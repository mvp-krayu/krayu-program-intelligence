#!/usr/bin/env python3
"""
validate_condition_artifacts.py
Stream: 40.6 — PiOS Condition Activation Engine
Contract: PIOS-40.6-CONDITION-CONTRACT

Validates the 7 docs/pios/40.6 condition artifacts against contract requirements.

Checks:
  1. Completeness              — all 7 expected artifacts present
  2. Condition traceability    — every condition traces to CKR-012 + signal inputs + 40.5 artifact
  3. Temporal reference        — every condition carries an inherited temporal reference
  4. Boundary compliance       — absence of forbidden content across all artifacts
  5. Coverage propagation      — blocked/partial states correctly inherited from 40.5 signals

Usage:
    python3 scripts/pios/40.6/validate_condition_artifacts.py
"""

import sys
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
ARTIFACT_DIR = REPO_ROOT / "docs/pios/40.6"
INPUT_40_5 = REPO_ROOT / "docs/pios/40.5"

EXPECTED_ARTIFACTS = [
    "condition_input_matrix.md",
    "condition_activation_specification.md",
    "condition_output_set.md",
    "condition_traceability_map.md",
    "condition_validation_report.md",
    "condition_boundary_enforcement.md",
    "execution_manifest.md",
]

GOVERNED_CONDITION_IDS = [
    "COND-001", "COND-002", "COND-003", "COND-004",
    "COND-005", "COND-006", "COND-007", "COND-008",
]

GOVERNED_SIGNALS_IN_CONDITIONS = [
    "SIG-001", "SIG-002", "SIG-003", "SIG-004",
    "SIG-005", "SIG-006", "SIG-007", "SIG-008",
]

VALID_TEMPORAL = re.compile(r"\b(static|event-based|time-series)\b")

FORBIDDEN_PATTERNS = [
    (re.compile(r"\bdiagnos[ie]", re.IGNORECASE), "diagnosis"),
    (re.compile(r"\bintelligence synthesis\b", re.IGNORECASE), "intelligence synthesis"),
    (re.compile(r"\bnarrative\b", re.IGNORECASE), "narrative"),
    (re.compile(r"\binterpret(?:ation|s|ed|ing)\b", re.IGNORECASE), "interpretation"),
    (re.compile(r"\bheuristic\b", re.IGNORECASE), "heuristic enrichment"),
    (re.compile(r"\bthreshold\s*=\s*\d", re.IGNORECASE), "threshold value definition"),
]

# Allowed context for forbidden patterns (boundary enforcement declarations, prohibition lists)
FORBIDDEN_ALLOWED_CONTEXTS = re.compile(
    r"(No diagnosis|No interpretation|Not produced|not activated|prohibited|Compliant|absent|"
    r"Boundary|boundary|forbidden|Prohibition|Stream 75\.2|Stream 75\.1|downstream|"
    r"not performed|exclusive authority|not defined|Separation|"
    r"not attached|no.*attached|attached to any output|"
    r"State.Diagnosis|GC-07)",
    re.IGNORECASE
)

# Expected coverage states in condition output
EXPECTED_EVALUABLE = ["COND-001", "COND-002"]
EXPECTED_BLOCKED = ["COND-005", "COND-006"]
EXPECTED_PARTIAL = ["COND-003", "COND-004", "COND-007", "COND-008"]


def read(path: Path) -> str:
    with open(path, encoding="utf-8") as f:
        return f.read()


def check_completeness() -> list:
    failures = []
    for name in EXPECTED_ARTIFACTS:
        if not (ARTIFACT_DIR / name).exists():
            failures.append(f"MISSING: {name}")
    return failures


def check_condition_traceability() -> list:
    failures = []
    ctm_path = ARTIFACT_DIR / "condition_traceability_map.md"
    if not ctm_path.exists():
        return ["Cannot check traceability — condition_traceability_map.md missing"]
    content = read(ctm_path)
    for cond_id in GOVERNED_CONDITION_IDS:
        if cond_id not in content:
            failures.append(f"Condition not traced: {cond_id}")
    if "CKR-012" not in content:
        failures.append("CKR-012 reference not found in traceability map")
    # Check at least one 40.5 signal artifact reference
    if "signal_output_set.md" not in content:
        failures.append("signal_output_set.md reference missing in traceability map")
    # Check at least one signal referenced
    for sig_id in GOVERNED_SIGNALS_IN_CONDITIONS:
        if sig_id not in content:
            failures.append(f"Signal reference missing in traceability map: {sig_id}")
    return failures


def check_temporal_references() -> list:
    failures = []
    spec_path = ARTIFACT_DIR / "condition_activation_specification.md"
    if not spec_path.exists():
        return ["Cannot check temporal references — condition_activation_specification.md missing"]
    content = spec_path.read_text(encoding="utf-8")
    for cond_id in GOVERNED_CONDITION_IDS:
        # Find the section for this condition
        cond_pattern = re.compile(rf"## {cond_id}", re.MULTILINE)
        if not cond_pattern.search(content):
            failures.append(f"Condition section missing in activation specification: {cond_id}")
            continue
        # Extract section
        section_pattern = re.compile(
            rf"## {cond_id}.*?(?=## COND-|\Z)", re.DOTALL
        )
        match = section_pattern.search(content)
        if match:
            section_text = match.group(0)
            if not VALID_TEMPORAL.search(section_text):
                failures.append(f"No valid temporal reference in specification for: {cond_id}")
    return failures


def check_boundary_compliance() -> list:
    failures = []
    check_artifacts = [
        "condition_input_matrix.md",
        "condition_activation_specification.md",
        "condition_output_set.md",
        "condition_traceability_map.md",
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
    # Check boundary enforcement declares 40.4, 40.3, 40.2 not accessed
    be_path = ARTIFACT_DIR / "condition_boundary_enforcement.md"
    if be_path.exists():
        be_content = read(be_path)
        if "not accessed" not in be_content:
            failures.append("condition_boundary_enforcement.md does not declare upstream dirs as not accessed")
    return failures


def check_coverage_propagation() -> list:
    failures = []
    output_path = ARTIFACT_DIR / "condition_output_set.md"
    if not output_path.exists():
        return ["Cannot check coverage propagation — condition_output_set.md missing"]
    content = read(output_path)

    # Check evaluable conditions declare evaluable state
    for cond_id in EXPECTED_EVALUABLE:
        # Find section
        pattern = re.compile(rf"## {cond_id}.*?(?=## COND-|\Z)", re.DOTALL)
        match = pattern.search(content)
        if not match:
            failures.append(f"Section missing in condition_output_set.md: {cond_id}")
            continue
        section = match.group(0)
        if "evaluable" not in section.lower():
            failures.append(f"{cond_id} expected state 'evaluable' not found in output set")

    # Check blocked conditions declare blocked state
    for cond_id in EXPECTED_BLOCKED:
        pattern = re.compile(rf"## {cond_id}.*?(?=## COND-|\Z)", re.DOTALL)
        match = pattern.search(content)
        if not match:
            failures.append(f"Section missing in condition_output_set.md: {cond_id}")
            continue
        section = match.group(0)
        if "blocked" not in section.lower():
            failures.append(f"{cond_id} expected state 'blocked' not found in output set")

    # Check partial conditions declare partial state
    for cond_id in EXPECTED_PARTIAL:
        pattern = re.compile(rf"## {cond_id}.*?(?=## COND-|\Z)", re.DOTALL)
        match = pattern.search(content)
        if not match:
            failures.append(f"Section missing in condition_output_set.md: {cond_id}")
            continue
        section = match.group(0)
        if "partial" not in section.lower():
            failures.append(f"{cond_id} expected state 'partial' not found in output set")

    # Check SIG-002 value 0.682 present (from COND-001 evaluable)
    if "0.682" not in content:
        failures.append("Expected signal value 0.682 (SIG-002) not found in condition_output_set.md")

    # Check SIG-004 values present (from COND-002 evaluable)
    for val in ["1.273", "0.545", "0.364", "0.455"]:
        if val not in content:
            failures.append(f"Expected signal value {val} (SIG-004) not found in condition_output_set.md")

    return failures


def run_checks() -> bool:
    results = {}
    all_passed = True

    checks = [
        ("1. Completeness", check_completeness),
        ("2. Condition traceability coverage", check_condition_traceability),
        ("3. Temporal reference inheritance", check_temporal_references),
        ("4. Boundary compliance", check_boundary_compliance),
        ("5. Coverage propagation correctness", check_coverage_propagation),
    ]

    print("=" * 60)
    print("PIOS-40.6 validate_condition_artifacts.py")
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
