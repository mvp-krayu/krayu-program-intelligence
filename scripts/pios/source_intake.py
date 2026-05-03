#!/usr/bin/env python3
"""
source_intake.py
Contract: PI.LENS.SOURCE-INTAKE.GENERIC.01

Generic deterministic source intake stage. Validates registered client/source
boundary and produces intake artifacts for the target run path.

Reads:   clients/<client_id>/client.yaml
         clients/<client_id>/sources/<source_id>/source_manifest.json
Writes:  clients/<client_id>/psee/runs/<run_id>/intake/

Usage:
    python3 scripts/pios/source_intake.py \\
        --client fastapi \\
        --source source_01 \\
        --run-id run_02_oss_fastapi_pipeline

    --dry-run        Compute everything, log what would be written; no files written
    --validate-only  Check source boundary only; no files written

RULE: No structural scanning. No CEU/DOM/41.x/75.x. Intake boundary only.
RULE: CREATE_ONLY — abort if any output file already exists (in write mode).
RULE: Fail closed on any missing required source_manifest field.
"""

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_ID = "PI.LENS.SOURCE-INTAKE.GENERIC.01"

REQUIRED_MANIFEST_FIELDS = [
    "archive_path",
    "sha256",
]


# ── Utilities ──────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generic source intake stage")
    p.add_argument("--client",       required=True, help="Client ID (e.g. fastapi)")
    p.add_argument("--source",       required=True, help="Source ID (e.g. source_01)")
    p.add_argument("--run-id",       required=True, help="Run identifier")
    p.add_argument("--dry-run",      action="store_true",
                   help="Compute everything but do not write output files")
    p.add_argument("--validate-only", action="store_true",
                   help="Validate source boundary only; do not write any files")
    return p.parse_args()


def parse_yaml_simple(path: Path) -> dict:
    result = {}
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if ":" in line:
                key, _, val = line.partition(":")
                val = val.strip()
                if val.lower() == "true":
                    val = True
                elif val.lower() == "false":
                    val = False
                else:
                    try:
                        val = int(val)
                    except ValueError:
                        try:
                            val = float(val)
                        except ValueError:
                            pass
                result[key.strip()] = val
    return result


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


def classify_path(path: Path, repo_root: Path) -> dict:
    """Classify a path as REPO_RELATIVE or EXTERNAL_ABSOLUTE without assuming containment."""
    try:
        rel = path.relative_to(repo_root)
        return {"path": str(rel), "path_type": "REPO_RELATIVE", "inside_repo": True}
    except ValueError:
        return {"path": str(path), "path_type": "EXTERNAL_ABSOLUTE", "inside_repo": False}


def resolve_inventory_source_path(client_id: str, run_id: str, manifest: dict) -> dict:
    """Hybrid inventory source path resolution — CLIENT_RUN first, EXTRACTED_PATH fallback.
    PI.LENS.SOURCE-INTAKE.INVENTORY-PATH.CONTRACT-CLOSURE.01"""
    client_run_path = (
        REPO_ROOT / "clients" / client_id / "psee" / "runs" / run_id / "intake" / "canonical_repo"
    )
    manifest_path_str = manifest.get("extracted_path", "")
    manifest_path = (REPO_ROOT / manifest_path_str) if manifest_path_str else None

    candidates = [str(client_run_path.relative_to(REPO_ROOT))]
    if manifest_path:
        candidates.append(str(manifest_path.relative_to(REPO_ROOT)))

    if client_run_path.exists():
        return {
            "resolution_mode": "CLIENT_RUN",
            "resolved_path": str(client_run_path.relative_to(REPO_ROOT)),
            "resolved_path_abs": client_run_path,
            "candidate_paths": candidates,
        }
    if manifest_path and manifest_path.exists():
        return {
            "resolution_mode": "EXTRACTED_PATH",
            "resolved_path": str(manifest_path.relative_to(REPO_ROOT)),
            "resolved_path_abs": manifest_path,
            "candidate_paths": candidates,
        }
    return {
        "resolution_mode": "MISSING",
        "resolved_path": None,
        "resolved_path_abs": None,
        "candidate_paths": candidates,
    }


# ── Load Config ────────────────────────────────────────────────────────────────

def load_client_config(client_id: str) -> dict:
    path = REPO_ROOT / "clients" / client_id / "client.yaml"
    if not path.exists():
        fail_closed(f"client.yaml not found: {path.relative_to(REPO_ROOT)}")
    return parse_yaml_simple(path)


def load_source_manifest(client_id: str, source_id: str) -> dict:
    path = REPO_ROOT / "clients" / client_id / "sources" / source_id / "source_manifest.json"
    if not path.exists():
        fail_closed(f"source_manifest.json not found: {path.relative_to(REPO_ROOT)}")
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def validate_manifest_fields(manifest: dict) -> None:
    missing = [f for f in REQUIRED_MANIFEST_FIELDS if f not in manifest]
    if missing:
        fail_closed(f"source_manifest.json missing required fields: {missing}")


# ── Output Path Resolution ─────────────────────────────────────────────────────

def resolve_intake_dir(client_id: str, run_id: str) -> Path:
    return REPO_ROOT / "clients" / client_id / "psee" / "runs" / run_id / "intake"


def check_create_only(intake_dir: Path, filenames: list[str]) -> None:
    """Abort if any target output file already exists."""
    conflicts = [f for f in filenames if (intake_dir / f).exists()]
    if conflicts:
        fail_closed(
            f"CREATE_ONLY violation — target files already exist in {intake_dir.relative_to(REPO_ROOT)}: "
            f"{conflicts}"
        )


# ── Checksum ───────────────────────────────────────────────────────────────────

def compute_sha256(path: Path) -> str:
    sha256 = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            sha256.update(chunk)
    return sha256.hexdigest()


# ── Intake Steps ───────────────────────────────────────────────────────────────

def step_boundary(manifest: dict) -> dict:
    """
    Validate archive_path exists and SHA256 matches.
    Returns structured boundary validation result.
    """
    archive_path = REPO_ROOT / manifest["archive_path"]
    archive_path_class = classify_path(archive_path, REPO_ROOT)
    expected_sha = manifest["sha256"]

    archive_exists = archive_path.exists()
    sha256_actual = None
    sha256_match = False
    boundary_result = "FAIL"
    notes = []

    if not archive_exists:
        notes.append(f"archive_path not found: {manifest['archive_path']}")
    else:
        print(f"  Computing SHA256 of {archive_path_class['path']} [{archive_path_class['path_type']}] ...")
        sha256_actual = compute_sha256(archive_path)
        sha256_match = (sha256_actual == expected_sha)
        if sha256_match:
            boundary_result = "PASS"
            notes.append("archive_path present; SHA256 verified")
        else:
            notes.append(f"SHA256 mismatch — expected {expected_sha[:16]}..., got {sha256_actual[:16]}...")

    return {
        "archive_path": manifest["archive_path"],
        "archive_path_type": archive_path_class["path_type"],
        "archive_path_inside_repo": archive_path_class["inside_repo"],
        "archive_path_exists": archive_exists,
        "sha256_expected": expected_sha,
        "sha256_actual": sha256_actual,
        "sha256_match": sha256_match,
        "boundary_result": boundary_result,
        "notes": notes,
    }


def step_checksum(manifest: dict, boundary: dict) -> dict:
    """Focused checksum validation record."""
    return {
        "archive_path": manifest["archive_path"],
        "sha256_expected": boundary["sha256_expected"],
        "sha256_actual": boundary["sha256_actual"],
        "sha256_match": boundary["sha256_match"],
        "checksum_result": "PASS" if boundary["sha256_match"] else "FAIL",
        "algorithm": "sha256",
        "file_size_bytes": (
            (REPO_ROOT / manifest["archive_path"]).stat().st_size
            if boundary["archive_path_exists"] else None
        ),
    }


def step_inventory(manifest: dict, client_id: str, run_id: str) -> dict:
    """
    Enumerate all files in extracted source deterministically.
    Hybrid path resolution: CLIENT_RUN first, EXTRACTED_PATH fallback.
    Returns structured file inventory.
    PI.LENS.SOURCE-INTAKE.INVENTORY-PATH.CONTRACT-CLOSURE.01
    """
    resolution = resolve_inventory_source_path(client_id, run_id, manifest)
    mode = resolution["resolution_mode"]
    candidates = resolution["candidate_paths"]

    print(f"  [PATH-RESOLUTION] mode: {mode}")
    for p in candidates:
        print(f"    checked: {p}")

    if mode == "MISSING":
        return {
            "resolution_mode": mode,
            "candidate_paths": candidates,
            "source_root": None,
            "source_root_exists": False,
            "file_count": 0,
            "files": [],
            "inventory_result": "MISSING_INPUT_FAIL_CLOSED",
            "notes": ["source not found at any candidate path; re-run extraction before intake"],
        }

    source_root = resolution["resolved_path_abs"]
    source_root_rel = resolution["resolved_path"]

    files = sorted(p for p in source_root.rglob("*") if p.is_file())
    entries = []
    for f in files:
        rel = str(f.relative_to(source_root))
        size = f.stat().st_size
        entries.append({"path": rel, "size_bytes": size})

    file_count = len(entries)
    registered_count = manifest.get("file_count")
    count_match = (registered_count is None) or (file_count == registered_count)

    notes = []
    if registered_count is not None:
        if count_match:
            notes.append(f"file count matches registered: {file_count}")
        else:
            notes.append(
                f"file count mismatch — registered {registered_count}, found {file_count}"
            )

    return {
        "resolution_mode": mode,
        "candidate_paths": candidates,
        "source_root": source_root_rel,
        "source_root_exists": True,
        "file_count": file_count,
        "registered_file_count": registered_count,
        "file_count_match": count_match,
        "files": entries,
        "inventory_result": "PASS" if (file_count > 0 and count_match) else "FAIL",
        "notes": notes,
    }


def build_intake_manifest(
    client_id: str,
    source_id: str,
    run_id: str,
    client_config: dict,
    manifest: dict,
    boundary: dict,
    inventory: dict,
    dry_run: bool,
    validate_only: bool,
) -> dict:
    overall = (
        boundary["boundary_result"] == "PASS"
        and inventory["inventory_result"] == "PASS"
    )
    return {
        "contract_id": CONTRACT_ID,
        "client_id": client_id,
        "source_id": source_id,
        "run_id": run_id,
        "client_display_name": client_config.get("display_name", client_id),
        "source_type": manifest.get("archive_type", "UNKNOWN"),
        "archive_path": manifest["archive_path"],
        "extracted_path": manifest.get("extracted_path", ""),
        "file_count": inventory["file_count"],
        "boundary_result": boundary["boundary_result"],
        "inventory_result": inventory["inventory_result"],
        "intake_result": "PASS" if overall else "FAIL",
        "mode": "validate_only" if validate_only else ("dry_run" if dry_run else "write"),
        "generated_at": now_iso(),
    }


# ── Main ───────────────────────────────────────────────────────────────────────

def main() -> None:
    args = parse_args()
    client_id = args.client
    source_id = args.source
    run_id = args.run_id
    dry_run = args.dry_run
    validate_only = args.validate_only

    print("=" * 64)
    print(f"source_intake.py — {CONTRACT_ID}")
    print(f"  client:  {client_id}")
    print(f"  source:  {source_id}")
    print(f"  run_id:  {run_id}")
    mode_label = "VALIDATE-ONLY" if validate_only else ("DRY-RUN" if dry_run else "WRITE")
    print(f"  mode:    {mode_label}")
    print("=" * 64)

    # Load registration
    print("\n[1] Loading client registration ...")
    client_config = load_client_config(client_id)
    print(f"  client.yaml: {client_config.get('display_name', client_id)}")

    manifest = load_source_manifest(client_id, source_id)
    validate_manifest_fields(manifest)
    print(f"  source_manifest.json: loaded ({len(manifest)} fields)")

    # Resolve output path
    intake_dir = resolve_intake_dir(client_id, run_id)
    print(f"\n[2] Output path: {intake_dir.relative_to(REPO_ROOT)}")

    output_files = [
        "source_boundary_validation.json",
        "source_checksum_validation.json",
        "source_inventory.json",
        "intake_manifest.json",
    ]

    if not dry_run and not validate_only:
        check_create_only(intake_dir, output_files)

    # Step A: Boundary validation
    print("\n[3] Source boundary validation ...")
    boundary = step_boundary(manifest)
    bnd_status = boundary["boundary_result"]
    print(f"  archive_path exists: {boundary['archive_path_exists']}")
    print(f"  SHA256 match: {boundary['sha256_match']}")
    print(f"  Boundary result: {bnd_status}")

    # Step B: Source inventory
    print("\n[4] Source inventory ...")
    inventory = step_inventory(manifest, client_id, run_id)
    inv_status = inventory["inventory_result"]
    print(f"  source_root exists: {inventory['source_root_exists']}")
    print(f"  files found: {inventory['file_count']}")
    if inventory.get("registered_file_count") is not None:
        print(f"  registered count: {inventory['registered_file_count']}")
        print(f"  count match: {inventory['file_count_match']}")
    print(f"  Inventory result: {inv_status}")

    # Step C: Checksum record
    checksum = step_checksum(manifest, boundary)

    # Step D: Intake manifest
    intake_manifest = build_intake_manifest(
        client_id, source_id, run_id,
        client_config, manifest,
        boundary, inventory,
        dry_run, validate_only,
    )
    overall = intake_manifest["intake_result"]

    print(f"\n[5] Intake result: {overall}")
    for note in boundary.get("notes", []):
        print(f"  NOTE: {note}")
    for note in inventory.get("notes", []):
        print(f"  NOTE: {note}")

    # Write outputs
    if validate_only:
        print("\n[6] Validate-only mode — no files written.")
    else:
        print("\n[6] Writing outputs ...")
        save_json(intake_dir / "source_boundary_validation.json", boundary, dry_run)
        save_json(intake_dir / "source_checksum_validation.json",  checksum,  dry_run)
        save_json(intake_dir / "source_inventory.json",             inventory, dry_run)
        save_json(intake_dir / "intake_manifest.json",              intake_manifest, dry_run)

    print("\n" + "=" * 64)
    print(f"INTAKE {overall}")
    print("=" * 64)

    if overall != "PASS":
        sys.exit(1)


if __name__ == "__main__":
    main()
