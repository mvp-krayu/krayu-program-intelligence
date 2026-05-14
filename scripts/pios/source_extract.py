#!/usr/bin/env python3
"""
source_extract.py
Contract: PI.LENS.REAL-E2E-PIPELINE.BLOCKER-07-CLOSURE.01

Extract source archive into canonical_repo for the target run's intake directory.

Reads:   clients/<client>/sources/<source>/source_manifest.json
Writes:  clients/<client>/psee/runs/<run_id>/intake/canonical_repo/
         clients/<client>/psee/runs/<run_id>/intake/extraction_manifest.json

Usage:
    python3 scripts/pios/source_extract.py \\
        --client blueedge \\
        --source source_01 \\
        --run-id run_blueedge_e2e_execute_01 \\
        [--dry-run]
        [--allow-existing]

RULE: CREATE_ONLY — abort if canonical_repo destination exists and is non-empty,
      unless --allow-existing is explicitly passed.
RULE: PATH_TRAVERSAL_GUARD — reject any archive member whose resolved path escapes
      the destination directory.
RULE: Do NOT extract into canonical productized/fixed runs.
"""

import argparse
import hashlib
import json
import os
import tarfile
import zipfile
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_ID = "PI.LENS.REAL-E2E-PIPELINE.BLOCKER-07-CLOSURE.01"

CANONICAL_RUN_GUARD = frozenset([
    "run_blueedge_productized_01",
    "run_blueedge_productized_01_fixed",
    "run_be_orchestrated_fixup_01",
])


# ── Utilities ──────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Source archive extraction stage")
    p.add_argument("--client",         required=True, help="Client ID (e.g. blueedge)")
    p.add_argument("--source",         required=True, help="Source ID (e.g. source_01)")
    p.add_argument("--run-id",         required=True, help="Run identifier")
    p.add_argument("--dry-run",        action="store_true",
                   help="Validate archive and list members; do not write files")
    p.add_argument("--allow-existing", action="store_true",
                   help="Allow extraction even if canonical_repo already exists")
    return p.parse_args()


def load_json(path: Path) -> dict:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_json(path: Path, data: dict, dry_run: bool) -> None:
    if dry_run:
        print(f"  [DRY-RUN] Would write: {path.relative_to(REPO_ROOT)}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"  [WROTE]   {path.relative_to(REPO_ROOT)}")


def fail_closed(msg: str) -> None:
    print(f"\nFAIL-CLOSED: {msg}")
    sys.exit(1)


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def compute_sha256(path: Path) -> str:
    sha = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            sha.update(chunk)
    return sha.hexdigest()


# ── Path Resolution ────────────────────────────────────────────────────────────

def resolve_archive_path(manifest: dict) -> Path:
    """Resolve archive_path — handles both absolute and repo-relative values."""
    raw = manifest["archive_path"]
    p = Path(raw)
    if p.is_absolute():
        return p
    return REPO_ROOT / raw


def resolve_destination(client_id: str, run_id: str) -> Path:
    return REPO_ROOT / "clients" / client_id / "psee" / "runs" / run_id / "intake" / "canonical_repo"


def resolve_manifest_out(client_id: str, run_id: str) -> Path:
    return REPO_ROOT / "clients" / client_id / "psee" / "runs" / run_id / "intake" / "extraction_manifest.json"


# ── Guard Checks ───────────────────────────────────────────────────────────────

def guard_canonical_run(run_id: str) -> None:
    if run_id in CANONICAL_RUN_GUARD:
        fail_closed(
            f"CANONICAL_RUN_GUARD: extraction into '{run_id}' is forbidden. "
            f"This is a protected canonical/productized run."
        )


def guard_create_only(destination: Path, allow_existing: bool) -> None:
    if destination.exists():
        contents = list(destination.iterdir())
        if contents and not allow_existing:
            fail_closed(
                f"CREATE_ONLY: canonical_repo already exists and is non-empty at "
                f"{destination.relative_to(REPO_ROOT)}. "
                f"Pass --allow-existing to override."
            )
        elif contents and allow_existing:
            print(f"  [WARN] --allow-existing: destination non-empty; proceeding")


# ── Path Traversal Guard ───────────────────────────────────────────────────────

def validate_tar_members(tf: tarfile.TarFile, destination: Path) -> list:
    """Validate all tar members for path traversal. Returns list of file members."""
    destination_resolved = destination.resolve()
    file_members = []
    for member in tf.getmembers():
        name = member.name
        # Reject absolute paths
        if os.path.isabs(name):
            fail_closed(f"PATH_TRAVERSAL: absolute path in archive member: {name!r}")
        # Reject null bytes
        if "\x00" in name:
            fail_closed(f"PATH_TRAVERSAL: null byte in archive member name: {name!r}")
        # Resolve and check containment
        target = (destination / name).resolve()
        try:
            target.relative_to(destination_resolved)
        except ValueError:
            fail_closed(
                f"PATH_TRAVERSAL: member {name!r} resolves outside destination "
                f"({destination.relative_to(REPO_ROOT)})"
            )
        if member.isfile():
            file_members.append(member)
    return file_members


def validate_zip_members(zf: zipfile.ZipFile, destination: Path) -> list:
    """Validate all zip members for path traversal. Returns list of file names."""
    destination_resolved = destination.resolve()
    file_names = []
    for name in zf.namelist():
        if os.path.isabs(name):
            fail_closed(f"PATH_TRAVERSAL: absolute path in zip member: {name!r}")
        if "\x00" in name:
            fail_closed(f"PATH_TRAVERSAL: null byte in zip member name: {name!r}")
        target = (destination / name).resolve()
        try:
            target.relative_to(destination_resolved)
        except ValueError:
            fail_closed(f"PATH_TRAVERSAL: zip member {name!r} resolves outside destination")
        info = zf.getinfo(name)
        if not name.endswith("/"):
            file_names.append(name)
    return file_names


# ── Archive Detection ──────────────────────────────────────────────────────────

def detect_archive_type(archive_path: Path) -> str:
    name = archive_path.name.lower()
    if name.endswith(".tar.gz") or name.endswith(".tgz"):
        return "tar.gz"
    if name.endswith(".tar"):
        return "tar"
    if name.endswith(".zip"):
        return "zip"
    # Probe by magic bytes
    with open(archive_path, "rb") as f:
        magic = f.read(4)
    if magic[:2] == b"PK":
        return "zip"
    # tarfile can auto-detect
    if tarfile.is_tarfile(archive_path):
        return "tar"
    return "unknown"


# ── Extraction ─────────────────────────────────────────────────────────────────

def extract_archive(
    archive_path: Path,
    destination: Path,
    archive_type: str,
    dry_run: bool,
) -> int:
    """Extract archive to destination. Returns file count extracted."""
    if archive_type in ("tar", "tar.gz"):
        mode = "r:gz" if archive_type == "tar.gz" else "r:"
        with tarfile.open(archive_path, mode) as tf:
            file_members = validate_tar_members(tf, destination)
            print(f"  [GUARD] PATH_TRAVERSAL: all {len(tf.getmembers())} members validated — PASS")
            print(f"  [INFO]  {len(file_members)} file members to extract")
            if dry_run:
                print(f"  [DRY-RUN] Would extract {len(file_members)} files to {destination.relative_to(REPO_ROOT)}")
                return len(file_members)
            destination.mkdir(parents=True, exist_ok=True)
            tf.extractall(path=destination)
        # Count actual files written
        return sum(1 for p in destination.rglob("*") if p.is_file())

    elif archive_type == "zip":
        with zipfile.ZipFile(archive_path, "r") as zf:
            file_names = validate_zip_members(zf, destination)
            print(f"  [GUARD] PATH_TRAVERSAL: all members validated — PASS")
            print(f"  [INFO]  {len(file_names)} file members to extract")
            if dry_run:
                print(f"  [DRY-RUN] Would extract {len(file_names)} files to {destination.relative_to(REPO_ROOT)}")
                return len(file_names)
            destination.mkdir(parents=True, exist_ok=True)
            zf.extractall(path=destination)
        return sum(1 for p in destination.rglob("*") if p.is_file())

    else:
        fail_closed(f"Unsupported archive type for: {archive_path.name}")
        return 0  # unreachable


# ── Main ───────────────────────────────────────────────────────────────────────

def main() -> None:
    args = parse_args()
    client_id = args.client
    source_id = args.source
    run_id = args.run_id
    dry_run = args.dry_run
    allow_existing = args.allow_existing

    print("=" * 64)
    print(f"source_extract.py — {CONTRACT_ID}")
    print(f"  client:  {client_id}")
    print(f"  source:  {source_id}")
    print(f"  run_id:  {run_id}")
    mode_label = "DRY-RUN" if dry_run else "WRITE"
    print(f"  mode:    {mode_label}")
    print("=" * 64)

    # Guard: protect canonical runs
    guard_canonical_run(run_id)

    # Load source manifest
    print("\n[1] Loading source manifest ...")
    manifest_path = REPO_ROOT / "clients" / client_id / "sources" / source_id / "source_manifest.json"
    if not manifest_path.exists():
        fail_closed(f"source_manifest.json not found: {manifest_path.relative_to(REPO_ROOT)}")
    manifest = load_json(manifest_path)
    print(f"  loaded ({len(manifest)} fields)")

    # Resolve archive path
    print("\n[2] Resolving archive path ...")
    archive_path = resolve_archive_path(manifest)
    print(f"  archive: {archive_path}")
    if not archive_path.exists():
        fail_closed(f"archive not found: {archive_path}")
    print(f"  archive exists: True")

    # SHA256 validation
    print("\n[3] Validating SHA256 ...")
    expected_sha = manifest.get("sha256", "")
    if not expected_sha:
        print("  [WARN] sha256 not in manifest — skipping checksum validation")
        actual_sha = None
        sha_match = None
    else:
        print(f"  computing SHA256 (may take a moment) ...")
        actual_sha = compute_sha256(archive_path)
        sha_match = (actual_sha == expected_sha)
        if sha_match:
            print(f"  SHA256 match: True ({actual_sha[:16]}...)")
        else:
            fail_closed(
                f"SHA256 mismatch — expected {expected_sha[:16]}..., "
                f"got {actual_sha[:16]}..."
            )

    # Detect archive type
    print("\n[4] Detecting archive type ...")
    archive_type = detect_archive_type(archive_path)
    print(f"  type: {archive_type}")
    if archive_type == "unknown":
        fail_closed(f"Cannot determine archive type for: {archive_path.name}")

    # Resolve destination
    destination = resolve_destination(client_id, run_id)
    manifest_out = resolve_manifest_out(client_id, run_id)
    print(f"\n[5] Destination: {destination.relative_to(REPO_ROOT)}")

    # CREATE_ONLY guard
    guard_create_only(destination, allow_existing)

    # Extract
    print(f"\n[6] Extracting archive ...")
    file_count = extract_archive(archive_path, destination, archive_type, dry_run)

    if not dry_run:
        print(f"  extracted {file_count} files to {destination.relative_to(REPO_ROOT)}")

    # Write extraction manifest
    extraction_manifest = {
        "contract_id": CONTRACT_ID,
        "client": client_id,
        "source": source_id,
        "run_id": run_id,
        "archive_path": str(archive_path),
        "archive_type": archive_type,
        "archive_sha256": actual_sha if actual_sha else "NOT_CHECKED",
        "sha256_match": sha_match,
        "destination": str(destination.relative_to(REPO_ROOT)),
        "files_extracted": file_count,
        "status": "PASS",
        "create_only": not allow_existing,
        "mode": mode_label,
        "generated_at": now_iso(),
    }

    print(f"\n[7] Writing extraction manifest ...")
    save_json(manifest_out, extraction_manifest, dry_run)

    print("\n" + "=" * 64)
    print(f"EXTRACTION {'PASS (dry-run)' if dry_run else 'PASS'}")
    print("=" * 64)


if __name__ == "__main__":
    main()
