#!/usr/bin/env python3
"""
build_evidence_inventory.py
Stream 40.2 — PiOS Evidence Connectors Layer
run_id: run_02_blueedge
contract: PIOS-40.2-RUN02-CONTRACT-v2

Verifies the input boundary (evidence_boundary.md) and output boundary
(docs/pios/40.2/) for Stream 40.2. Does not ingest content.
"""

import sys
from pathlib import Path

# ─── EVIDENCE ORIGIN ROOT ─────────────────────────────────────────────────────

EVIDENCE_ORIGIN_ROOT = Path.home() / "Projects/blueedge-program-intelligence/source-v3.23"

# ─── PRIMARY EVIDENCE PATHS ───────────────────────────────────────────────────

PRIMARY_EVIDENCE_PATHS = [
    EVIDENCE_ORIGIN_ROOT / "BlueEdge_Competitive_Dashboard_Feb2026.html",
    EVIDENCE_ORIGIN_ROOT / "BlueEdge_Unified_Architecture_v3_23_0.html",
    EVIDENCE_ORIGIN_ROOT / "Blue_Edge_PMO_Dashboard.html",
    EVIDENCE_ORIGIN_ROOT / "analysis",
    EVIDENCE_ORIGIN_ROOT / "extracted/backend",
    EVIDENCE_ORIGIN_ROOT / "extracted/frontend",
    EVIDENCE_ORIGIN_ROOT / "extracted/platform",
]

# ─── PROVENANCE-ONLY PATHS (existence check only — NOT ingested) ──────────────

PROVENANCE_ONLY_PATHS = [
    EVIDENCE_ORIGIN_ROOT / "raw/blueedge-backend-v3_23_0-COMPLETE.tar",
    EVIDENCE_ORIGIN_ROOT / "raw/blueedge-frontend-v3_23_0-COMPLETE.tar",
    EVIDENCE_ORIGIN_ROOT / "raw/blueedge-platform-v3_23_0-COMPLETE.tar",
]

# ─── EXPLICITLY EXCLUDED PATHS ────────────────────────────────────────────────

EXCLUDED_PATHS = [
    Path.home() / "Projects/blueedge-program-intelligence/docs/reverse_engineering",
    Path.home() / "Projects/blueedge-program-intelligence/docs/program-charter",
    Path.home() / "Projects/blueedge-program-intelligence/docs/execution-telemetry",
    Path.home() / "Projects/blueedge-program-intelligence/docs/signal-layer",
    Path.home() / "Projects/blueedge-program-intelligence/docs/case-study",
    Path.home() / "Projects/blueedge-program-intelligence/weekly",
]

# ─── EXPECTED OUTPUT ARTIFACTS ────────────────────────────────────────────────

EXECUTION_WORKSPACE = Path.home() / "Projects/krayu-program-intelligence"
OUTPUT_DIR = EXECUTION_WORKSPACE / "docs/pios/40.2"
CONTRACT_DIR = EXECUTION_WORKSPACE / "docs/pios/contracts/40.2"
SCRIPTS_DIR = EXECUTION_WORKSPACE / "scripts/pios/40.2"

EXPECTED_OUTPUT_ARTIFACTS = [
    OUTPUT_DIR / "evidence_surface_inventory.md",
    OUTPUT_DIR / "evidence_classification_map.md",
    OUTPUT_DIR / "normalized_evidence_map.md",
    OUTPUT_DIR / "intake_validation_log.md",
    CONTRACT_DIR / "PIOS-40.2-RUN02-CONTRACT.md",
    CONTRACT_DIR / "PIOS-40.2-RUN02.execution.md",
    SCRIPTS_DIR / "build_evidence_inventory.py",
    SCRIPTS_DIR / "validate_evidence_inventory.py",
]

# ─── EVIDENCE BOUNDARY FILE ───────────────────────────────────────────────────

EVIDENCE_BOUNDARY_FILE = EXECUTION_WORKSPACE / "docs/pios/runs/run_02_blueedge/evidence_boundary.md"


def section(title):
    print(f"\n{'=' * 60}")
    print(f"  {title}")
    print('=' * 60)


def check_evidence_boundary():
    section("Check 1 — Evidence Boundary File")
    if not EVIDENCE_BOUNDARY_FILE.exists():
        print(f"  FAIL  evidence_boundary.md not found at {EVIDENCE_BOUNDARY_FILE}")
        return False
    print(f"  PASS  {EVIDENCE_BOUNDARY_FILE}")
    return True


def check_evidence_origin_root():
    section("Check 2 — Evidence Origin Root")
    if not EVIDENCE_ORIGIN_ROOT.exists():
        print(f"  FAIL  Evidence origin root not found: {EVIDENCE_ORIGIN_ROOT}")
        return False
    print(f"  PASS  {EVIDENCE_ORIGIN_ROOT}")
    return True


def check_primary_evidence_paths():
    section("Check 3 — Primary Evidence Paths")
    passed = True
    for path in PRIMARY_EVIDENCE_PATHS:
        if path.exists():
            print(f"  PASS  {path.relative_to(EVIDENCE_ORIGIN_ROOT.parent.parent)}")
        else:
            print(f"  FAIL  MISSING: {path}")
            passed = False
    return passed


def check_provenance_only_paths():
    section("Check 4 — Provenance-Only Paths (existence only — NOT ingested)")
    passed = True
    for path in PROVENANCE_ONLY_PATHS:
        if path.exists():
            size_mb = path.stat().st_size / (1024 * 1024)
            print(f"  PASS  EXISTS ({size_mb:.1f} MB) — NOT INGESTED: {path.name}")
        else:
            print(f"  WARN  MISSING provenance archive: {path.name}")
            passed = False
    return passed


def check_excluded_paths_not_accessed():
    section("Check 5 — Excluded Paths Not Accessed")
    # This check verifies excluded paths exist (as directories/files in the source repo)
    # but confirms they were NOT included in output artifacts
    output_content = []
    for artifact in EXPECTED_OUTPUT_ARTIFACTS:
        if artifact.exists():
            try:
                output_content.append(artifact.read_text())
            except Exception:
                pass

    violations = []
    for excluded_path in EXCLUDED_PATHS:
        path_str = str(excluded_path)
        for content in output_content:
            # Check if excluded path appears as evidence reference in output
            if path_str in content and "NOT ACCESSED" not in content:
                violations.append(excluded_path.name)

    if violations:
        for v in violations:
            print(f"  FAIL  Excluded path referenced in output: {v}")
        return False
    else:
        print("  PASS  No excluded paths referenced as ingested evidence in output artifacts")
        return True


def check_output_boundary():
    section("Check 6 — Output Artifact Boundary")
    passed = True
    for artifact in EXPECTED_OUTPUT_ARTIFACTS:
        if artifact.exists():
            print(f"  PASS  {artifact.relative_to(EXECUTION_WORKSPACE)}")
        else:
            print(f"  FAIL  MISSING: {artifact.relative_to(EXECUTION_WORKSPACE)}")
            passed = False
    return passed


def check_extracted_source_file_counts():
    section("Check 7 — Extracted Source Tree File Counts")
    passed = True

    backend_dir = EVIDENCE_ORIGIN_ROOT / "extracted/backend"
    frontend_dir = EVIDENCE_ORIGIN_ROOT / "extracted/frontend"
    platform_dir = EVIDENCE_ORIGIN_ROOT / "extracted/platform"

    for tree, label, min_count in [
        (backend_dir, "backend", 350),
        (frontend_dir, "frontend", 300),
        (platform_dir, "platform", 700),
    ]:
        if tree.exists():
            count = sum(1 for _ in tree.rglob("*") if _.is_file())
            if count >= min_count:
                print(f"  PASS  {label}: {count} files (min {min_count})")
            else:
                print(f"  FAIL  {label}: {count} files (below min {min_count})")
                passed = False
        else:
            print(f"  FAIL  {label} directory not found")
            passed = False

    return passed


def main():
    print("\nStream 40.2 — Evidence Connectors Layer")
    print("Build Evidence Inventory — run_02_blueedge")
    print(f"Contract: PIOS-40.2-RUN02-CONTRACT-v2")

    results = {
        "Check 1 — Evidence Boundary File": check_evidence_boundary(),
        "Check 2 — Evidence Origin Root": check_evidence_origin_root(),
        "Check 3 — Primary Evidence Paths": check_primary_evidence_paths(),
        "Check 4 — Provenance-Only Paths": check_provenance_only_paths(),
        "Check 5 — Excluded Paths": check_excluded_paths_not_accessed(),
        "Check 6 — Output Boundary": check_output_boundary(),
        "Check 7 — File Counts": check_extracted_source_file_counts(),
    }

    section("Build Summary")
    passed = sum(1 for v in results.values() if v)
    total = len(results)

    for name, result in results.items():
        status = "PASS" if result else "FAIL"
        print(f"  {status}  {name}")

    print(f"\n  Result: {passed}/{total} PASS")

    if passed == total:
        print("  Build COMPLETE — all checks passed")
        return 0
    else:
        print("  Build INCOMPLETE — one or more checks failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())
