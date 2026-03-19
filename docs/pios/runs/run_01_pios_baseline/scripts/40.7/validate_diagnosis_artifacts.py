#!/usr/bin/env python3
"""
validate_diagnosis_artifacts.py
Stream: 40.7 — PiOS Diagnosis & Intelligence Synthesis Layer
Contract: PIOS-40.7-DIAGNOSIS-INTELLIGENCE-CONTRACT

Validates the docs/pios/40.7 diagnosis and intelligence artifacts against contract requirements.

Checks:
  1. Completeness              — all 9 expected artifacts present
  2. Traceability              — every diagnosis and intelligence output carries full lineage chain
  3. Coverage preservation     — blocked/partial states correctly inherited from 40.6 conditions
  4. Evidence binding          — no unsupported claims; unknown space explicitly declared
  5. Boundary compliance       — absence of forbidden content; prohibited access patterns absent

Usage:
    python3 scripts/pios/40.7/validate_diagnosis_artifacts.py
"""

import sys
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
ARTIFACT_DIR = REPO_ROOT / "docs/pios/40.7"
INPUT_40_6 = REPO_ROOT / "docs/pios/40.6"

EXPECTED_ARTIFACTS = [
    "diagnosis_input_matrix.md",
    "diagnosis_output_set.md",
    "diagnosis_traceability_map.md",
    "diagnosis_validation_report.md",
    "intelligence_output_set.md",
    "intelligence_traceability_map.md",
    "intelligence_validation_report.md",
    "boundary_enforcement.md",
    "execution_manifest.md",
]

GOVERNED_DIAGNOSIS_IDS = [f"DIAG-{i:03d}" for i in range(1, 9)]
GOVERNED_INTELLIGENCE_IDS = [f"INTEL-{i:03d}" for i in range(1, 6)]
GOVERNED_CONDITIONS = [f"COND-{i:03d}" for i in range(1, 9)]

VALID_TEMPORAL = re.compile(r"\b(static|event-based|time-series)\b")

FORBIDDEN_PATTERNS = [
    (re.compile(r"\brecommend(?:ation|s|ed|ing)\b", re.IGNORECASE), "recommendation"),
    (re.compile(r"\bremediati(?:on|ng)\b", re.IGNORECASE), "remediation"),
    (re.compile(r"\bprogn(?:osis|oses|ostic)\b", re.IGNORECASE), "prognosis"),
    (re.compile(r"\bheuristic\b", re.IGNORECASE), "heuristic enrichment"),
    (re.compile(r"\bspeculat(?:ive|ion|ing)\b", re.IGNORECASE), "speculative logic"),
]

FORBIDDEN_ALLOWED_CONTEXTS = re.compile(
    r"(No recommendation|Not produced|prohibited|Compliant|absent|"
    r"Boundary|boundary|forbidden|Prohibition|downstream|"
    r"not performed|not defined|not produced|Confirmed|"
    r"GC-06|GC-07|Stream 75\.2|Stream 75\.1)",
    re.IGNORECASE
)

# Expected computed values that must appear in diagnosis output
EXPECTED_DIAGNOSIS_VALUES = [
    ("0.682", "SIG-002 dependency load ratio in DIAG-001"),
    ("1.273", "SIG-004 edge-to-node ratio in DIAG-002"),
    ("0.875", "SIG-001 structural coordination in DIAG-003"),
    ("ELEVATED_DEPENDENCY_LOAD", "DIAG-001 classification"),
    ("ELEVATED_STRUCTURAL_COUPLING", "DIAG-002 classification"),
]

# Expected intelligence values
EXPECTED_INTEL_VALUES = [
    ("INTEL-001", "INTEL-001 structural intelligence"),
    ("INTEL-005", "INTEL-005 unknown space declaration"),
    ("unknown", "unknown space explicitly declared"),
    ("blocked", "blocked dimension explicitly declared"),
]


def read(path: Path) -> str:
    with open(path, encoding="utf-8") as f:
        return f.read()


def check_completeness() -> list:
    failures = []
    for name in EXPECTED_ARTIFACTS:
        if not (ARTIFACT_DIR / name).exists():
            failures.append(f"MISSING: {name}")
    return failures


def check_traceability() -> list:
    failures = []

    # Check diagnosis traceability map
    dtm_path = ARTIFACT_DIR / "diagnosis_traceability_map.md"
    if not dtm_path.exists():
        return ["Cannot check traceability — diagnosis_traceability_map.md missing"]
    content = read(dtm_path)
    for diag_id in GOVERNED_DIAGNOSIS_IDS:
        if diag_id not in content:
            failures.append(f"Diagnosis not traced: {diag_id}")
    for cond_id in GOVERNED_CONDITIONS:
        if cond_id not in content:
            failures.append(f"Condition not referenced in diagnosis traceability map: {cond_id}")
    if "condition_output_set.md" not in content:
        failures.append("condition_output_set.md reference missing in diagnosis traceability map")

    # Check intelligence traceability map
    itm_path = ARTIFACT_DIR / "intelligence_traceability_map.md"
    if not itm_path.exists():
        failures.append("Cannot check intelligence traceability — intelligence_traceability_map.md missing")
    else:
        icontent = read(itm_path)
        for intel_id in GOVERNED_INTELLIGENCE_IDS:
            if intel_id not in icontent:
                failures.append(f"Intelligence not traced: {intel_id}")
        for diag_id in GOVERNED_DIAGNOSIS_IDS:
            if diag_id not in icontent:
                failures.append(f"Diagnosis not referenced in intelligence traceability map: {diag_id}")

    return failures


def check_coverage_preservation() -> list:
    failures = []

    # Check diagnosis output set
    dos_path = ARTIFACT_DIR / "diagnosis_output_set.md"
    if not dos_path.exists():
        return ["Cannot check coverage — diagnosis_output_set.md missing"]
    content = read(dos_path)

    # Computed diagnoses (DIAG-001, DIAG-002)
    for diag_id in ["DIAG-001", "DIAG-002"]:
        pattern = re.compile(rf"## {diag_id}.*?(?=## DIAG-|\Z)", re.DOTALL)
        match = pattern.search(content)
        if not match:
            failures.append(f"Section missing in diagnosis_output_set.md: {diag_id}")
            continue
        if "computed" not in match.group(0).lower():
            failures.append(f"{diag_id} expected state 'computed' not found in diagnosis output set")

    # Blocked diagnoses (DIAG-005, DIAG-006)
    for diag_id in ["DIAG-005", "DIAG-006"]:
        pattern = re.compile(rf"## {diag_id}.*?(?=## DIAG-|\Z)", re.DOTALL)
        match = pattern.search(content)
        if not match:
            failures.append(f"Section missing in diagnosis_output_set.md: {diag_id}")
            continue
        if "blocked" not in match.group(0).lower():
            failures.append(f"{diag_id} expected state 'blocked' not found in diagnosis output set")

    # Check intelligence output set
    ios_path = ARTIFACT_DIR / "intelligence_output_set.md"
    if not ios_path.exists():
        failures.append("Cannot check intelligence coverage — intelligence_output_set.md missing")
        return failures
    icontent = read(ios_path)

    # INTEL-001 should be computed
    p = re.compile(r"## INTEL-001.*?(?=## INTEL-|\Z)", re.DOTALL)
    m = p.search(icontent)
    if m and "computed" not in m.group(0).lower():
        failures.append("INTEL-001 expected state 'computed' not found in intelligence output set")

    # INTEL-005 should be blocked/unknown
    p = re.compile(r"## INTEL-005.*?(?=## INTEL-|\Z)", re.DOTALL)
    m = p.search(icontent)
    if m:
        section = m.group(0).lower()
        if "blocked" not in section and "unknown" not in section:
            failures.append("INTEL-005 expected state 'blocked' or 'unknown' not found in intelligence output set")

    return failures


def check_evidence_binding() -> list:
    failures = []

    dos_path = ARTIFACT_DIR / "diagnosis_output_set.md"
    ios_path = ARTIFACT_DIR / "intelligence_output_set.md"

    if dos_path.exists():
        content = read(dos_path)
        for value, description in EXPECTED_DIAGNOSIS_VALUES:
            if value not in content:
                failures.append(f"Expected diagnosis output not found: {description} ({value})")

    if ios_path.exists():
        content = read(ios_path)
        for value, description in EXPECTED_INTEL_VALUES:
            if value not in content:
                failures.append(f"Expected intelligence output not found: {description} ({value})")

    # Confirm INTEL-005 unknown space declaration exists
    if ios_path.exists():
        icontent = read(ios_path)
        if "Unknown Space Declaration" not in icontent and "INTEL-005" not in icontent:
            failures.append("Unknown space declaration (INTEL-005) not found in intelligence_output_set.md")

    return failures


def check_boundary_compliance() -> list:
    failures = []
    check_artifacts = [
        "diagnosis_input_matrix.md",
        "diagnosis_output_set.md",
        "intelligence_output_set.md",
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

    # Check boundary enforcement declares upstream layers not accessed
    be_path = ARTIFACT_DIR / "boundary_enforcement.md"
    if be_path.exists():
        be_content = read(be_path)
        if "not accessed" not in be_content:
            failures.append("boundary_enforcement.md does not declare upstream artifacts as not accessed")

    # Check no direct 40.5/40.4 references in diagnosis input
    dim_path = ARTIFACT_DIR / "diagnosis_input_matrix.md"
    if dim_path.exists():
        dim_content = read(dim_path)
        # Should reference 40.6 condition_output_set, not 40.5 signal_output_set directly
        if "signal_output_set.md" in dim_content:
            # Only allowed if it's in a traceability chain reference, not as primary input
            lines_with_40_5 = [
                l for l in dim_content.splitlines()
                if "signal_output_set.md" in l and "via" not in l.lower() and "chain" not in l.lower()
            ]
            if lines_with_40_5:
                failures.append("diagnosis_input_matrix.md references signal_output_set.md as direct input (violation of 40.5 access prohibition)")

    return failures


def run_checks() -> bool:
    results = {}
    all_passed = True

    checks = [
        ("1. Completeness", check_completeness),
        ("2. Traceability", check_traceability),
        ("3. Coverage preservation", check_coverage_preservation),
        ("4. Evidence binding", check_evidence_binding),
        ("5. Boundary compliance", check_boundary_compliance),
    ]

    print("=" * 60)
    print("PIOS-40.7 validate_diagnosis_artifacts.py")
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
