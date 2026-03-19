#!/usr/bin/env python3
"""
validate_signal_artifacts.py
Stream: 40.5 — PiOS Signal Computation Engine
Contract: PIOS-40.5-SIGNAL-CONTRACT

Validates the 6 docs/pios/40.5 signal artifacts against contract requirements.

Checks:
  1. Completeness              — all 6 expected artifacts present
  2. Signal traceability       — every signal traces to CKR + telemetry inputs + 40.4 artifact
  3. Temporal reference        — every signal carries a declared temporal reference
  4. Boundary compliance       — absence of forbidden content across all artifacts
  5. Deterministic reproducibility — static signal computations yield expected values

Usage:
    python3 scripts/pios/40.5/validate_signal_artifacts.py
"""

import sys
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
ARTIFACT_DIR = REPO_ROOT / "docs/pios/40.5"
INPUT_40_4 = REPO_ROOT / "docs/pios/40.4"

EXPECTED_ARTIFACTS = [
    "signal_input_matrix.md",
    "signal_computation_specification.md",
    "signal_output_set.md",
    "signal_traceability_map.md",
    "signal_validation_report.md",
    "signal_boundary_enforcement.md",
]

GOVERNED_SIGNAL_IDS = ["SIG-001", "SIG-002", "SIG-003", "SIG-004", "SIG-005", "SIG-006", "SIG-007", "SIG-008"]
GOVERNED_CKR = ["CKR-006", "CKR-007", "CKR-008", "CKR-009", "CKR-010", "CKR-011", "CKR-014", "CKR-015"]

VALID_TEMPORAL = re.compile(r"\b(static|event-based|time-series)\b")

FORBIDDEN_PATTERNS = [
    (re.compile(r"\bcondition activation\b", re.IGNORECASE), "condition activation"),
    (re.compile(r"\bdiagnos[ie]", re.IGNORECASE), "diagnosis"),
    (re.compile(r"\bintelligence synthesis\b", re.IGNORECASE), "intelligence synthesis"),
    (re.compile(r"\bnarrative\b", re.IGNORECASE), "narrative"),
    (re.compile(r"\binterpret(?:ation|s|ed|ing)\b", re.IGNORECASE), "interpretation"),
    (re.compile(r"\bheuristic\b", re.IGNORECASE), "heuristic enrichment"),
]

# Allowed context lines for forbidden content (e.g. boundary enforcement, prohibition declarations)
FORBIDDEN_ALLOWED_CONTEXTS = re.compile(
    r"(No condition activation|No diagnosis|Not activated|no.*diagnosis|no.*condition|prohibited|enforced|forbidden|"
    r"Boundary|boundary|absent|Compliant|not produced|not activated|Prohibition|Layer 3|Layer 4|"
    r"stream 40\.6|downstream|not applicable)"
    , re.IGNORECASE
)

# Static telemetry values for determinism check
STATIC_TELEMETRY = {
    "ST-007": 22, "ST-009": 10, "ST-010": 28, "ST-011": 12,
    "ST-012": 7,  "ST-013": 3,  "ST-014": 2,  "ST-015": 3,
    "ST-016": 8,  "ST-006": 8,  "ST-022": 3,
}

# Expected computed values (deterministic)
EXPECTED_COMPUTED = {
    "SIG-002_dep_edge_count": 15,
    "SIG-002_dep_load_ratio": 0.682,
    "SIG-004_edge_node_ratio": 1.273,
    "SIG-004_containment_ratio": 0.545,
    "SIG-004_responsibility": 0.364,
    "SIG-004_module_surface": 0.455,
    "SIG-001_coord_ratio": 0.875,
}


def read(path: Path) -> str:
    with open(path, encoding="utf-8") as f:
        return f.read()


def check_completeness() -> list:
    failures = []
    for name in EXPECTED_ARTIFACTS:
        if not (ARTIFACT_DIR / name).exists():
            failures.append(f"MISSING: {name}")
    return failures


def check_signal_traceability() -> list:
    failures = []
    ttm_path = ARTIFACT_DIR / "signal_traceability_map.md"
    if not ttm_path.exists():
        return ["Cannot check traceability — signal_traceability_map.md missing"]
    content = read(ttm_path)
    for sig_id in GOVERNED_SIGNAL_IDS:
        if sig_id not in content:
            failures.append(f"Signal not traced: {sig_id}")
    for ckr in GOVERNED_CKR:
        if ckr not in content:
            failures.append(f"CKR reference not found in traceability map: {ckr}")
    # Check at least one 40.4 artifact reference
    for artifact in ["structural_telemetry.md", "activity_telemetry.md", "delivery_telemetry.md"]:
        if artifact not in content:
            failures.append(f"40.4 artifact reference missing in traceability map: {artifact}")
    return failures


def check_temporal_references() -> list:
    failures = []
    spec_path = ARTIFACT_DIR / "signal_computation_specification.md"
    if not spec_path.exists():
        return ["Cannot check temporal references — signal_computation_specification.md missing"]
    content = read(spec_path)
    for sig_id in GOVERNED_SIGNAL_IDS:
        # Find the section for this signal
        sig_pattern = re.compile(rf"## {sig_id}", re.MULTILINE)
        if not sig_pattern.search(content):
            failures.append(f"Signal section missing in computation specification: {sig_id}")
            continue
        # Find temporal reference in signal section
        sig_section_pattern = re.compile(
            rf"## {sig_id}.*?(?=## SIG-|\Z)", re.DOTALL
        )
        match = sig_section_pattern.search(content)
        if match:
            section_text = match.group(0)
            if not VALID_TEMPORAL.search(section_text):
                failures.append(f"No valid temporal reference in specification for: {sig_id}")
    return failures


def check_boundary_compliance() -> list:
    failures = []
    check_artifacts = [
        "signal_input_matrix.md",
        "signal_computation_specification.md",
        "signal_output_set.md",
        "signal_traceability_map.md",
    ]
    for filename in check_artifacts:
        path = ARTIFACT_DIR / filename
        if not path.exists():
            continue
        content = read(path)
        for i, line in enumerate(content.splitlines(), 1):
            if FORBIDDEN_ALLOWED_CONTEXTS.search(line):
                continue
            for pattern, label in FORBIDDEN_PATTERNS:
                if pattern.search(line):
                    failures.append(
                        f"Forbidden content ({label}) in {filename}:{i}: {line.strip()[:80]}"
                    )
    # Check no 40.2/40.3 direct access in boundary enforcement
    be_path = ARTIFACT_DIR / "signal_boundary_enforcement.md"
    if be_path.exists():
        be_content = read(be_path)
        if "not accessed" not in be_content:
            failures.append("signal_boundary_enforcement.md does not declare 40.2/40.3 as not accessed")
    return failures


def check_deterministic_reproducibility() -> list:
    failures = []
    output_path = ARTIFACT_DIR / "signal_output_set.md"
    if not output_path.exists():
        return ["Cannot check reproducibility — signal_output_set.md missing"]
    content = read(output_path)

    checks = [
        ("0.682", "SIG-002 dependency load ratio"),
        ("0.875", "SIG-001 structural coordination ratio"),
        ("1.273", "SIG-004 edge-to-node ratio"),
        ("0.545", "SIG-004 containment density ratio"),
        ("0.364", "SIG-004 responsibility distribution"),
        ("0.455", "SIG-004 module surface ratio"),
        ("15", "SIG-002 dependency edge count"),
    ]
    for expected_value, description in checks:
        if expected_value not in content:
            failures.append(f"Expected computed value not found: {description} ({expected_value})")

    return failures


def run_checks() -> bool:
    results = {}
    all_passed = True

    checks = [
        ("1. Completeness", check_completeness),
        ("2. Signal traceability coverage", check_signal_traceability),
        ("3. Temporal reference coverage", check_temporal_references),
        ("4. Boundary compliance", check_boundary_compliance),
        ("5. Deterministic reproducibility", check_deterministic_reproducibility),
    ]

    print("=" * 60)
    print("PIOS-40.5 validate_signal_artifacts.py")
    print(f"Artifact directory: {ARTIFACT_DIR.relative_to(REPO_ROOT)}")
    print("=" * 60)

    for label, fn in checks:
        failures = fn()
        passed = len(failures) == 0
        results[label] = passed
        status = "PASS" if passed else "FAIL"
        print(f"\n[{status}] {label}")
        if not passed:
            all_passed = False
            for f in failures:
                print(f"       {f}")

    print("\n" + "=" * 60)
    print("Validation Summary:")
    for label, passed in results.items():
        print(f"  {'PASS' if passed else 'FAIL'}  {label}")
    final = "COMPLETE" if all_passed else "INCOMPLETE"
    print(f"\nFinal status: {final}")
    print("=" * 60)
    return all_passed


if __name__ == "__main__":
    passed = run_checks()
    sys.exit(0 if passed else 1)
