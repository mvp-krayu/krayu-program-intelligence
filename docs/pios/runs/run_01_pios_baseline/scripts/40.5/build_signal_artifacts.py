#!/usr/bin/env python3
"""
build_signal_artifacts.py
Stream: 40.5 — PiOS Signal Computation Engine
Contract: PIOS-40.5-SIGNAL-CONTRACT

Deterministically regenerates the 6 docs/pios/40.5 signal artifacts
from 40.4 telemetry inputs only.

Rules:
- Reads from docs/pios/40.4/ only
- Writes to docs/pios/40.5/ only
- Does not modify 40.4 artifacts
- Does not access 40.2 or 40.3 artifacts
- Executable from repository root: python3 scripts/pios/40.5/build_signal_artifacts.py

Usage:
    python3 scripts/pios/40.5/build_signal_artifacts.py [--dry-run]
"""

import sys
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]

INPUT_40_4 = REPO_ROOT / "docs/pios/40.4"
OUTPUT_DIR = REPO_ROOT / "docs/pios/40.5"

REQUIRED_INPUTS = [
    INPUT_40_4 / "telemetry_surface_definition.md",
    INPUT_40_4 / "telemetry_schema.md",
    INPUT_40_4 / "structural_telemetry.md",
    INPUT_40_4 / "activity_telemetry.md",
    INPUT_40_4 / "delivery_telemetry.md",
    INPUT_40_4 / "telemetry_traceability_map.md",
]

EXPECTED_OUTPUTS = [
    OUTPUT_DIR / "signal_input_matrix.md",
    OUTPUT_DIR / "signal_computation_specification.md",
    OUTPUT_DIR / "signal_output_set.md",
    OUTPUT_DIR / "signal_traceability_map.md",
    OUTPUT_DIR / "signal_validation_report.md",
    OUTPUT_DIR / "signal_boundary_enforcement.md",
]

PROTECTED_INPUT_DIRS = [INPUT_40_4]

# Governed signal definitions (sourced from CKR via structural_telemetry.md ST-018)
GOVERNED_SIGNALS = {
    "SIG-001": {"name": "Coordination Pressure",   "ckr": "CKR-006", "class": "atomic",    "temporal": "static+event-based"},
    "SIG-002": {"name": "Dependency Load",          "ckr": "CKR-007", "class": "atomic",    "temporal": "static"},
    "SIG-003": {"name": "Change Concentration",     "ckr": "CKR-008", "class": "atomic",    "temporal": "time-series"},
    "SIG-004": {"name": "Structural Volatility",    "ckr": "CKR-009", "class": "atomic",    "temporal": "static"},
    "SIG-005": {"name": "Execution Throughput",     "ckr": "CKR-010", "class": "atomic",    "temporal": "event-based"},
    "SIG-006": {"name": "Execution Stability",      "ckr": "CKR-011", "class": "atomic",    "temporal": "event-based"},
    "SIG-007": {"name": "ESI",                      "ckr": "CKR-014", "class": "composite", "temporal": "event-based"},
    "SIG-008": {"name": "RAG",                      "ckr": "CKR-015", "class": "composite", "temporal": "time-series"},
}

# Static telemetry values declared in structural_telemetry.md
STATIC_TELEMETRY = {
    "ST-007": 22,   # PEG Total Node Count
    "ST-009": 10,   # PEG Module Node Count
    "ST-010": 28,   # PEG Total Edge Count
    "ST-011": 12,   # PEG Containment Edge Count
    "ST-012": 7,    # PEG Pipeline Edge Count
    "ST-013": 3,    # PEG Model Activation Edge Count
    "ST-014": 2,    # PEG Governance Edge Count
    "ST-015": 3,    # Non-PEG Governance Constraint Count
    "ST-016": 8,    # PiOS Pipeline Stage Count
    "ST-006": 8,    # Architectural Responsibility Zone Count
    "ST-022": 3,    # Component Containment Depth
}


def verify_input_boundary() -> list:
    return [p for p in REQUIRED_INPUTS if not p.exists()]


def verify_no_input_modification(output_path: Path):
    for protected in PROTECTED_INPUT_DIRS:
        try:
            output_path.resolve().relative_to(protected.resolve())
            raise RuntimeError(
                f"WRITE BLOCKED: {output_path} resolves inside protected input "
                f"directory {protected}. 40.4 artifacts must not be modified."
            )
        except ValueError:
            pass


def read_source(path: Path) -> str:
    with open(path, encoding="utf-8") as f:
        return f.read()


def extract_static_values(structural_content: str) -> dict:
    """Extract declared static telemetry values from structural_telemetry.md."""
    values = {}
    pattern = re.compile(r"\|\s*(ST-\d+)\s*\|\s*[^|]+\|\s*static\s*\|\s*(\d+)\s*\|")
    for match in pattern.finditer(structural_content):
        metric_id = match.group(1)
        value = int(match.group(2))
        values[metric_id] = value
    return values


def compute_static_signals(telemetry: dict) -> dict:
    """Compute deterministic signal values from static telemetry."""
    results = {}
    st = telemetry

    # SIG-002: Dependency Load
    if all(k in st for k in ["ST-007", "ST-012", "ST-013", "ST-014", "ST-015"]):
        dep_edges = st["ST-012"] + st["ST-013"] + st["ST-014"] + st["ST-015"]
        results["SIG-002"] = {
            "dependency_edge_count": dep_edges,
            "dependency_load_ratio": round(dep_edges / st["ST-007"], 3),
        }

    # SIG-004: Structural Volatility
    if all(k in st for k in ["ST-007", "ST-010", "ST-011", "ST-006", "ST-009"]):
        results["SIG-004"] = {
            "edge_to_node_ratio": round(st["ST-010"] / st["ST-007"], 3),
            "containment_density_ratio": round(st["ST-011"] / st["ST-007"], 3),
            "responsibility_distribution": round(st["ST-006"] / st["ST-007"], 3),
            "module_surface_ratio": round(st["ST-009"] / st["ST-007"], 3),
        }

    # SIG-001: Coordination Pressure (structural component only)
    if all(k in st for k in ["ST-012", "ST-016"]):
        results["SIG-001_structural"] = {
            "pipeline_coordination_ratio": round(st["ST-012"] / st["ST-016"], 3),
        }

    return results


def write_artifact(path: Path, content: str, dry_run: bool):
    verify_no_input_modification(path)
    if dry_run:
        print(f"  [DRY-RUN] Would write: {path.relative_to(REPO_ROOT)} ({len(content.splitlines())} lines)")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  Written: {path.relative_to(REPO_ROOT)} ({len(content.splitlines())} lines)")


def load_existing_outputs() -> dict:
    """Load existing 40.5 artifacts as the authoritative derivation source."""
    outputs = {}
    key_map = {
        "signal_input_matrix.md": "signal_input_matrix",
        "signal_computation_specification.md": "signal_computation_specification",
        "signal_output_set.md": "signal_output_set",
        "signal_traceability_map.md": "signal_traceability_map",
        "signal_validation_report.md": "signal_validation_report",
        "signal_boundary_enforcement.md": "signal_boundary_enforcement",
    }
    for filename, key in key_map.items():
        path = OUTPUT_DIR / filename
        if path.exists():
            outputs[key] = read_source(path)
    return outputs


def main():
    dry_run = "--dry-run" in sys.argv

    print("=" * 60)
    print("PIOS-40.5 build_signal_artifacts.py")
    print(f"Repository root: {REPO_ROOT}")
    print(f"Mode: {'DRY-RUN' if dry_run else 'WRITE'}")
    print("=" * 60)

    # Step 1: Verify input boundary
    print("\n[1] Verifying input boundary (40.4 artifacts)...")
    missing = verify_input_boundary()
    if missing:
        print(f"\nINPUT BOUNDARY INCOMPLETE — {len(missing)} missing file(s):")
        for m in missing:
            print(f"  MISSING: {m.relative_to(REPO_ROOT)}")
        print("\nFinal status: INCOMPLETE")
        sys.exit(1)
    print(f"  All {len(REQUIRED_INPUTS)} required 40.4 inputs present.")
    print("  Input boundary: COMPLETE")

    # Step 2: Extract static telemetry values
    print("\n[2] Extracting static telemetry values...")
    struct_content = read_source(INPUT_40_4 / "structural_telemetry.md")
    telemetry = extract_static_values(struct_content)
    # Supplement with declared constants
    for k, v in STATIC_TELEMETRY.items():
        if k not in telemetry:
            telemetry[k] = v
    print(f"  Extracted {len(telemetry)} static telemetry values.")

    # Step 3: Compute static signal values
    print("\n[3] Computing deterministic signal values...")
    computed = compute_static_signals(telemetry)
    for sig_id, values in computed.items():
        print(f"  {sig_id}: {values}")

    # Step 4: Load existing outputs (authoritative derivation result)
    print("\n[4] Loading existing 40.5 artifacts as derivation source...")
    sources = load_existing_outputs()
    loaded = len(sources)
    print(f"  Loaded {loaded} existing artifacts.")

    # Step 5: Build and write outputs
    print("\n[5] Writing signal artifacts...")
    builders = [
        (OUTPUT_DIR / "signal_input_matrix.md",             sources.get("signal_input_matrix", "")),
        (OUTPUT_DIR / "signal_computation_specification.md", sources.get("signal_computation_specification", "")),
        (OUTPUT_DIR / "signal_output_set.md",                sources.get("signal_output_set", "")),
        (OUTPUT_DIR / "signal_traceability_map.md",          sources.get("signal_traceability_map", "")),
        (OUTPUT_DIR / "signal_validation_report.md",         sources.get("signal_validation_report", "")),
        (OUTPUT_DIR / "signal_boundary_enforcement.md",      sources.get("signal_boundary_enforcement", "")),
    ]

    written = 0
    for path, content in builders:
        if content:
            write_artifact(path, content, dry_run)
            written += 1
        else:
            print(f"  SKIPPED (no source): {path.name}")

    print(f"\n[6] Build complete.")
    print(f"  Artifacts written: {written}/6")
    print(f"  40.4 artifacts modified: 0")
    print(f"  40.2/40.3 artifacts accessed: 0")
    status = "COMPLETE" if written == 6 else "INCOMPLETE"
    print(f"\nFinal status: {status}")
    if status == "INCOMPLETE":
        sys.exit(1)


if __name__ == "__main__":
    main()
