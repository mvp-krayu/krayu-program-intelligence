#!/usr/bin/env python3
"""
PSEE IG Intake Rebinder
Stream: PSEE.RECONCILE.1.WP-15B.REBIND

PURPOSE
  Promote the authoritative IG intake from ig-invariance-chain-v1 into
  client-scoped intake boundary. PATH_PROMOTION_ONLY — no semantic rewrite.

BASELINE ANCHOR
  Tag: ig-invariance-chain-v1
  Source: runs/pios/ce2/CE.2-R01-MIX/input/telemetry_baseline.json

WRITES
  clients/<uuid>/input/intake/telemetry_baseline.json
  clients/<uuid>/input/intake/intake_manifest.json

Usage:
    python3 scripts/psee/rebind_ig_intake_to_client.py --client <client_uuid>

Exit codes:
    0 = REBIND_PASS
    1 = REBIND_FAIL
"""

import argparse
import hashlib
import json
import os
import subprocess
import sys

# ── CONSTANTS ─────────────────────────────────────────────────────────────────
REPO_NAME            = "k-pi-core"
REQUIRED_BRANCH      = "work/psee-runtime"
STREAM_ID            = "PSEE.RECONCILE.1.WP-15B.REBIND"
BASELINE_TAG         = "ig-invariance-chain-v1"
SOURCE_LOADER_PATH   = "scripts/pios/40.16/load_40_4_intake.py"
SOURCE_CLASS         = "AUTHORITATIVE_INTAKE"
CONSTRUCTION_MODE    = "REPLAY_BINDING"
REBINDING_MODE       = "PATH_PROMOTION_ONLY"

# Exact baseline-relative path of the source intake artifact
SOURCE_BASELINE_PATH = "runs/pios/ce2/CE.2-R01-MIX/input/telemetry_baseline.json"

# Forbidden source classes — any promoted artifact matching these is rejected
FORBIDDEN_SOURCE_CLASSES = {
    "TEST_INPUT", "PLACEHOLDER", "RUNTIME_STATE", "CONFIG",
    "DERIVED_OUTPUT", "DOCUMENTATION",
}

# Content markers that identify forbidden classes
_TEST_INPUT_MARKERS    = [
    "raw input", "placeholder", "test_input", "not committed",
    "WP-13B raw input", "Entity A", "Entity B", "Entity C",
    "Domain Alpha", "Domain Beta", "Domain Gamma",
]
_RUNTIME_STATE_MARKERS = [
    "execution_status", "escalation_clearance", "unknown_space_count",
]
_CONFIG_FILENAMES     = {"runtime_config.json"}
_DERIVED_FILENAMES    = {
    "authoritative_state.json", "construction_log.md",
    "replay_source_reference.md", "intake_result.json", "verification.log",
}

# Forbidden path fragments for source_artifacts field
_FORBIDDEN_PATH_FRAGMENTS = [
    "docs/pios", "signal_registry", "entity_catalog",
    "dependency_map", "signal_computation", "signal_traceability",
    "presentation", "historical",
]

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# ── HELPERS ───────────────────────────────────────────────────────────────────
def out(msg=""):
    print(msg)


def fail(stage, rule, reason):
    out()
    out(f"FAIL [{stage}]")
    out(f"  rule:   {rule}")
    out(f"  reason: {reason}")
    out(f"  action: execution halted")
    sys.exit(1)


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: str) -> str:
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


def git_run(args, cwd=None):
    r = subprocess.run(args, capture_output=True, text=True,
                       cwd=cwd or REPO_ROOT)
    return r.returncode, r.stdout.strip(), r.stderr.strip()


# ── PRE-FLIGHT ────────────────────────────────────────────────────────────────
def preflight(client_uuid):
    out("=== PSEE IG Intake Rebinder ===")
    out(f"stream:      {STREAM_ID}")
    out(f"client_uuid: {client_uuid}")
    out()
    out("--- PREFLIGHT ---")

    # P1: repo name
    code, name, _ = git_run(["git", "rev-parse", "--show-toplevel"])
    if code != 0 or os.path.basename(name) != REPO_NAME:
        fail("PREFLIGHT", "REPO_MISMATCH",
             f"expected repo {REPO_NAME!r}, got {os.path.basename(name)!r}")

    # P2: branch
    code, branch, _ = git_run(["git", "branch", "--show-current"])
    if code != 0 or branch != REQUIRED_BRANCH:
        fail("PREFLIGHT", "BRANCH_MISMATCH",
             f"expected branch {REQUIRED_BRANCH!r}, got {branch!r}")

    # P3: worktree clean
    code, status, _ = git_run(["git", "status", "--porcelain"])
    if code != 0:
        fail("PREFLIGHT", "GIT_ERROR", "git status failed")
    lines = [l for l in status.splitlines() if l.strip()]
    allowed = (
        f"?? clients/{client_uuid}/",
        "?? scripts/psee/rebind_ig_intake_to_client.py",
    )
    dirty = [l for l in lines if not any(l.startswith(p) for p in allowed)]
    if dirty:
        fail("PREFLIGHT", "WORKTREE_DIRTY",
             f"dirty worktree: {'; '.join(dirty[:3])}")

    # P4: baseline tags
    for tag in (BASELINE_TAG, "psee-runtime-baseline-v1"):
        code, _, _ = git_run(["git", "rev-list", "-n", "1", tag])
        if code != 0:
            fail("PREFLIGHT", "TAG_MISSING", f"required tag not found: {tag}")

    out("  repo:     PASS")
    out(f"  branch:   PASS ({branch})")
    out("  worktree: PASS (clean)")
    out("  tags:     PASS")
    out("PREFLIGHT_PASS")
    out()


# ── BASELINE INSPECTION ───────────────────────────────────────────────────────
def inspect_baseline():
    out("--- BASELINE_INSPECTION ---")
    out(f"  tag:    {BASELINE_TAG}")
    out(f"  source: {SOURCE_BASELINE_PATH}")

    # Resolve tag commit
    code, commit, _ = git_run(["git", "rev-parse", f"{BASELINE_TAG}^{{}}"])
    if code != 0:
        fail("BASELINE_INSPECTION", "TAG_RESOLVE_FAIL",
             f"cannot resolve {BASELINE_TAG}")

    # Verify source path exists in tag
    code, content, err = git_run(
        ["git", "show", f"{BASELINE_TAG}:{SOURCE_BASELINE_PATH}"])
    if code != 0:
        fail("BASELINE_INSPECTION", "SOURCE_NOT_IN_TAG",
             f"{SOURCE_BASELINE_PATH} not found in {BASELINE_TAG}: {err}")

    # Validate JSON parse
    try:
        data = json.loads(content)
    except json.JSONDecodeError as e:
        fail("BASELINE_INSPECTION", "SOURCE_INVALID_JSON",
             f"source artifact is not valid JSON: {e}")

    # Validate not empty
    if not data:
        fail("BASELINE_INSPECTION", "SOURCE_EMPTY",
             "source telemetry_baseline.json is empty")

    # Validate no forbidden content markers (ZERO_RECONSTRUCTION guard)
    content_str = content
    for marker in _TEST_INPUT_MARKERS:
        if marker in content_str:
            fail("BASELINE_INSPECTION", "FORBIDDEN_CONTENT_MARKER",
                 f"source contains TEST_INPUT marker: {marker!r}")
    for marker in _RUNTIME_STATE_MARKERS:
        if marker in content_str:
            fail("BASELINE_INSPECTION", "FORBIDDEN_CONTENT_MARKER",
                 f"source contains RUNTIME_STATE marker: {marker!r}")

    source_hash = sha256_bytes(content.encode())
    out(f"  tag_commit:  {commit[:20]}...")
    out(f"  source_hash: {source_hash[:16]}...")
    out(f"  data_keys:   {len(data)}")
    out("BASELINE_INSPECTION_PASS")
    out()
    return content.encode(), data, commit, source_hash


# ── PROMOTION ─────────────────────────────────────────────────────────────────
def promote_intake(client_uuid, raw_bytes):
    out("--- PROMOTION ---")

    intake_dir = os.path.join(
        REPO_ROOT, "clients", client_uuid, "input", "intake")

    # Scope guard — write only within client intake path
    real_dir = os.path.realpath(intake_dir)
    client_root = os.path.realpath(
        os.path.join(REPO_ROOT, "clients", client_uuid))
    if not real_dir.startswith(client_root + os.sep):
        fail("PROMOTION", "WRITE_SCOPE_VIOLATION",
             f"target dir {real_dir!r} outside client root")

    os.makedirs(intake_dir, exist_ok=True)

    dest = os.path.join(intake_dir, "telemetry_baseline.json")
    with open(dest, "wb") as f:
        f.write(raw_bytes)

    promoted_hash = sha256_file(dest)
    promoted_rel  = os.path.relpath(dest, REPO_ROOT)

    out(f"  WRITTEN  {promoted_rel}")
    out(f"  sha256:  {promoted_hash[:16]}...")
    out("PROMOTION_PASS")
    out()
    return dest, promoted_rel, promoted_hash


# ── MANIFEST BUILD ────────────────────────────────────────────────────────────
def build_manifest(client_uuid, promoted_rel, promoted_hash, tag_commit):
    out("--- MANIFEST_BUILD ---")

    # source_artifacts: promoted client-scoped path
    # runs/pios is NOT listed here — original lineage is in source_baseline_tag
    source_artifacts = [promoted_rel]

    # provenance_hash = sha256 over promoted artifact hash
    provenance_hash = sha256_bytes(promoted_hash.encode())

    manifest = {
        "schema_version":       "1.0",
        "stream":               STREAM_ID,
        "client_uuid":          client_uuid,
        "source_class":         SOURCE_CLASS,
        "construction_mode":    CONSTRUCTION_MODE,
        "rebinding_mode":       REBINDING_MODE,
        "source_baseline_tag":  BASELINE_TAG,
        "source_baseline_commit": tag_commit[:20],
        "source_loader_path":   SOURCE_LOADER_PATH,
        "source_baseline_artifacts": [SOURCE_BASELINE_PATH],
        "admissibility_metadata": {
            "source_class":      SOURCE_CLASS,
            "construction_mode": CONSTRUCTION_MODE,
            "source_artifacts":  source_artifacts,
            "provenance_hash":   provenance_hash,
        },
        "source_artifacts": source_artifacts,
        "provenance_hash":  provenance_hash,
    }

    out(f"  source_class:    {SOURCE_CLASS}")
    out(f"  construction:    {CONSTRUCTION_MODE}")
    out(f"  provenance_hash: {provenance_hash[:16]}...")
    out("MANIFEST_BUILD_PASS")
    out()
    return manifest, provenance_hash


# ── MANIFEST WRITE ────────────────────────────────────────────────────────────
def write_manifest(client_uuid, manifest):
    out("--- MANIFEST_WRITE ---")

    intake_dir = os.path.join(
        REPO_ROOT, "clients", client_uuid, "input", "intake")
    dest = os.path.join(intake_dir, "intake_manifest.json")

    real_dest   = os.path.realpath(os.path.abspath(dest))
    real_dir    = os.path.realpath(intake_dir)
    client_root = os.path.realpath(
        os.path.join(REPO_ROOT, "clients", client_uuid))
    if not real_dest.startswith(client_root + os.sep):
        fail("MANIFEST_WRITE", "WRITE_SCOPE_VIOLATION",
             f"manifest path {real_dest!r} outside client root")

    with open(dest, "w") as f:
        json.dump(manifest, f, indent=2, sort_keys=True)

    manifest_rel = os.path.relpath(dest, REPO_ROOT)
    out(f"  WRITTEN  {manifest_rel}")
    out("MANIFEST_WRITE_PASS")
    out()
    return manifest_rel


# ── VALIDATION ────────────────────────────────────────────────────────────────
def validate_rebinding(client_uuid, promoted_rel, manifest):
    out("--- VALIDATION ---")
    checks = []

    def chk(name, result, detail=""):
        checks.append((name, result, detail))
        mark = "PASS" if result else "FAIL"
        out(f"  [{mark}] {name}" + (f" — {detail}" if detail else ""))

    # V1: SOURCE LINEAGE — baseline tag resolves and source path was in it
    code, commit, _ = git_run(
        ["git", "rev-list", "-n", "1", BASELINE_TAG])
    chk("V1.SOURCE_LINEAGE",
        code == 0 and bool(commit),
        f"tag={BASELINE_TAG} commit={commit[:12] if commit else 'n/a'}")

    # V2: BASELINE_ARTIFACTS LISTED — source_baseline_artifacts present
    baseline_arts = manifest.get("source_baseline_artifacts", [])
    chk("V2.BASELINE_ARTIFACTS_LISTED",
        SOURCE_BASELINE_PATH in baseline_arts,
        f"listed={baseline_arts}")

    # V3: SOURCE CLASS — declared AUTHORITATIVE_INTAKE
    sc = manifest.get("admissibility_metadata", {}).get("source_class")
    chk("V3.SOURCE_CLASS",
        sc == SOURCE_CLASS,
        f"source_class={sc!r}")

    # V4: CONSTRUCTION MODE — REPLAY_BINDING
    cm = manifest.get("admissibility_metadata", {}).get("construction_mode")
    chk("V4.CONSTRUCTION_MODE",
        cm == CONSTRUCTION_MODE,
        f"construction_mode={cm!r}")

    # V5: PROVENANCE HASH — present and non-empty
    ph = manifest.get("provenance_hash", "")
    chk("V5.PROVENANCE_HASH",
        isinstance(ph, str) and len(ph) == 64,
        f"hash={ph[:16]}..." if ph else "MISSING")

    # V6: ZERO RECONSTRUCTION — promoted file is byte-exact copy from tag
    dest_path = os.path.join(REPO_ROOT, promoted_rel)
    code, tag_content, _ = git_run(
        ["git", "show", f"{BASELINE_TAG}:{SOURCE_BASELINE_PATH}"])
    if code == 0 and os.path.isfile(dest_path):
        with open(dest_path, "rb") as f:
            promoted_bytes = f.read()
        tag_hash      = sha256_bytes(tag_content.encode())
        promoted_hash = sha256_bytes(promoted_bytes)
        chk("V6.ZERO_RECONSTRUCTION",
            tag_hash == promoted_hash,
            f"tag_hash={tag_hash[:12]} promoted_hash={promoted_hash[:12]}")
    else:
        chk("V6.ZERO_RECONSTRUCTION", False, "file or tag content not accessible")

    # V7: CLIENT ISOLATION — promoted path inside clients/<uuid>/input/intake/
    expected_prefix = f"clients/{client_uuid}/input/intake/"
    chk("V7.CLIENT_ISOLATION",
        promoted_rel.startswith(expected_prefix),
        f"path={promoted_rel!r}")

    # V8: NO FORBIDDEN PATH FRAGMENTS in source_artifacts
    arts = manifest.get("admissibility_metadata", {}).get("source_artifacts", [])
    forbidden_found = [
        f"{a!r}→{frag!r}"
        for a in arts
        for frag in _FORBIDDEN_PATH_FRAGMENTS
        if frag in str(a)
    ]
    chk("V8.NO_FORBIDDEN_PATHS",
        len(forbidden_found) == 0,
        f"violations={forbidden_found}" if forbidden_found else "clean")

    # V9: NO FORBIDDEN CONTENT IN PROMOTED FILE
    with open(os.path.join(REPO_ROOT, promoted_rel)) as f:
        content_str = f.read(8192)
    bad_markers = [m for m in _TEST_INPUT_MARKERS + _RUNTIME_STATE_MARKERS
                   if m in content_str]
    chk("V9.NO_FORBIDDEN_CONTENT",
        len(bad_markers) == 0,
        f"markers={bad_markers}" if bad_markers else "clean")

    # V10: REQUIRED MANIFEST FIELDS
    required = ["source_class", "construction_mode", "source_baseline_tag",
                "source_loader_path", "source_artifacts", "client_uuid",
                "provenance_hash", "rebinding_mode"]
    missing = [f for f in required if not manifest.get(f)]
    chk("V10.MANIFEST_COMPLETE",
        len(missing) == 0,
        f"missing={missing}" if missing else "all fields present")

    out()
    passed = sum(1 for _, r, _ in checks if r)
    total  = len(checks)
    out(f"  checks: {passed}/{total}")

    if passed < total:
        failed = [n for n, r, _ in checks if not r]
        fail("VALIDATION", "VALIDATION_FAIL",
             f"failed checks: {failed}")

    out("VALIDATION_PASS")
    out()
    return checks


# ── ADMISSIBILITY CHECK (Section I) ──────────────────────────────────────────
def admissibility_check(manifest):
    out("--- ADMISSIBILITY_CHECK ---")

    meta = manifest.get("admissibility_metadata", {})
    violations = []

    sc = meta.get("source_class")
    if sc != SOURCE_CLASS:
        violations.append(f"source_class={sc!r} != {SOURCE_CLASS!r}")

    cm = meta.get("construction_mode")
    if cm not in ("FIRST_RUN_INTAKE", "REPLAY_BINDING"):
        violations.append(f"construction_mode={cm!r} not valid")

    ph = meta.get("provenance_hash", "")
    if not isinstance(ph, str) or not ph.strip():
        violations.append("provenance_hash missing or empty")

    arts = meta.get("source_artifacts", [])
    if not isinstance(arts, list) or len(arts) == 0:
        violations.append("source_artifacts empty")
    else:
        for a in arts:
            for frag in _FORBIDDEN_PATH_FRAGMENTS + ["runs/pios"]:
                if frag in str(a):
                    violations.append(
                        f"source_artifact {a!r} references forbidden fragment {frag!r}")

    if violations:
        fail("ADMISSIBILITY_CHECK", "ADMISSIBILITY_FAIL",
             "; ".join(violations))

    out(f"  source_class:    {sc} — OK")
    out(f"  construction:    {cm} — OK")
    out(f"  artifacts:       {len(arts)} — OK")
    out(f"  forbidden_paths: NONE")
    out("ADMISSIBILITY_PASS — AUTHORITATIVE_INTAKE confirmed")
    out()


# ── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="PSEE IG Intake Rebinder — WP-15B.REBIND")
    parser.add_argument("--client", required=True, help="Client UUID")
    args = parser.parse_args()
    client_uuid = args.client

    preflight(client_uuid)
    raw_bytes, data, tag_commit, source_hash = inspect_baseline()
    dest_path, promoted_rel, promoted_hash   = promote_intake(client_uuid, raw_bytes)
    manifest, provenance_hash                = build_manifest(
        client_uuid, promoted_rel, promoted_hash, tag_commit)
    manifest_rel = write_manifest(client_uuid, manifest)
    checks       = validate_rebinding(client_uuid, promoted_rel, manifest)
    admissibility_check(manifest)

    out("=== REBIND_PASS ===")
    out(f"  stream:             {STREAM_ID}")
    out(f"  client_uuid:        {client_uuid}")
    out(f"  baseline_tag:       {BASELINE_TAG}")
    out(f"  source_artifact:    {SOURCE_BASELINE_PATH}")
    out(f"  promoted:           {promoted_rel}")
    out(f"  manifest:           {manifest_rel}")
    out(f"  provenance_hash:    {provenance_hash}")
    out(f"  admissibility:      AUTHORITATIVE_INTAKE — PASS")
    out(f"  checks:             {len(checks)}/{len(checks)} PASS")
    sys.exit(0)


if __name__ == "__main__":
    main()
