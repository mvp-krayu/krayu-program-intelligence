#!/usr/bin/env python3
"""
validate_diagnosis_artifacts.py
Stream: 40.7 — PiOS Diagnosis & Intelligence Synthesis Layer
Contract: PIOS-40.7-RUN01-CONTRACT-v1
run_id: run_01_blueedge

GOVERNANCE IMMUTABILITY DECLARATION:
This validator script is the authoritative validation record for Stream 40.7 run_01_blueedge.
It must not be modified after stream execution is declared complete. Modifications to this
script after stream closure constitute a governance violation.

Validates the docs/pios/40.7 diagnosis and intelligence artifacts against contract requirements.

Checks:
  1.  Completeness              — all 9 expected artifacts present (run_01_blueedge artifact names)
  2.  Contract identity         — run_01_blueedge and PIOS-40.7-RUN01-CONTRACT-v1 in all artifacts
  3.  Diagnosis traceability    — DIAG-001..008 and COND-001..008 present in traceability map
  4.  Intelligence traceability — INTEL-001..002 present in intelligence artifacts
  5.  Condition coverage        — COND-001..008 referenced across input matrix and output set
  6.  Computed diagnosis        — DIAG-006 computed with 0.333 rec/sec and SENSOR_BRIDGE_CONFIGURED
  7.  Blocked diagnosis count   — 7 blocked diagnoses declared in diagnosis_output_set.md
  8.  Input boundary            — condition_output_set.md referenced; no direct 40.5 access
  9.  Boundary compliance       — forbidden content absent; prohibited patterns not present
  10. Upstream access           — not-accessed declaration in diagnosis_boundary_enforcement.md
  11. Governance immutability   — GOVERNANCE IMMUTABILITY DECLARATION present in this script

Usage:
    python3 scripts/pios/40.7/validate_diagnosis_artifacts.py
"""

import sys
import re
from pathlib import Path

EXECUTION_WORKSPACE = Path.home() / "Projects/krayu-program-intelligence"
ARTIFACT_DIR = EXECUTION_WORKSPACE / "docs/pios/40.7"
INPUT_40_6 = EXECUTION_WORKSPACE / "docs/pios/40.6"

EXPECTED_ARTIFACTS = [
    "diagnosis_input_matrix.md",
    "diagnosis_output_set.md",
    "diagnosis_traceability_map.md",
    "diagnosis_validation_log.md",
    "intelligence_output_set.md",
    "intelligence_traceability_map.md",
    "intelligence_validation_log.md",
    "diagnosis_boundary_enforcement.md",
    "execution_manifest.md",
]

GOVERNED_DIAGNOSIS_IDS = [f"DIAG-{i:03d}" for i in range(1, 9)]
GOVERNED_INTELLIGENCE_IDS = ["INTEL-001", "INTEL-002"]
GOVERNED_CONDITIONS = [f"COND-{i:03d}" for i in range(1, 9)]

FORBIDDEN_PATTERNS = [
    (re.compile(r"\brecommend(?:ation|s|ed|ing)\b", re.IGNORECASE), "recommendation"),
    (re.compile(r"\bremediati(?:on|ng)\b", re.IGNORECASE), "remediation"),
    (re.compile(r"\bprogn(?:osis|oses|ostic)\b", re.IGNORECASE), "prognosis"),
    (re.compile(r"\bheuristic\b", re.IGNORECASE), "heuristic enrichment"),
    (re.compile(r"\bspeculat(?:ive|ion|ing)\b", re.IGNORECASE), "speculative logic"),
]

FORBIDDEN_ALLOWED_CONTEXTS = [
    r"No\s+recommendation",
    r"no\s+recommendation",
    r"no\s+prognosis",
    r"No\s+prognosis",
    r"no\s+remediation",
    r"No\s+remediation",
    r"prohibited",
    r"Prohibited",
    r"Enforced",
    r"Compliant",
    r"not\s+produced",
    r"not\s+performed",
    r"not\s+defined",
    r"downstream",
    r"Downstream",
    r"GC-06",
    r"GC-07",
    r"Stream\s+75\.2",
    r"Stream\s+75\.1",
    r"no\s+heuristic",
    r"No\s+heuristic",
    r"No\s+inference",
    r"no\s+inference",
    r"no\s+fabrication",
    r"No\s+fabrication",
]

FORBIDDEN_ALLOWED_RE = re.compile(
    "(" + "|".join(FORBIDDEN_ALLOWED_CONTEXTS) + ")",
    re.IGNORECASE,
)


def read(path: Path) -> str:
    with open(path, encoding="utf-8") as f:
        return f.read()


def check_completeness() -> list:
    """Check 1 — All 9 artifacts present."""
    failures = []
    for name in EXPECTED_ARTIFACTS:
        if not (ARTIFACT_DIR / name).exists():
            failures.append(f"MISSING: {name}")
    return failures


def check_contract_identity() -> list:
    """Check 2 — run_01_blueedge and PIOS-40.7-RUN01-CONTRACT-v1 in all artifacts."""
    failures = []
    for name in EXPECTED_ARTIFACTS:
        path = ARTIFACT_DIR / name
        if not path.exists():
            continue
        content = read(path)
        if "run_01_blueedge" not in content:
            failures.append(f"run_01_blueedge not found in {name}")
        if "PIOS-40.7-RUN01-CONTRACT-v1" not in content:
            failures.append(f"PIOS-40.7-RUN01-CONTRACT-v1 not found in {name}")
    return failures


def check_diagnosis_traceability() -> list:
    """Check 3 — DIAG-001..008 and COND-001..008 in traceability map."""
    failures = []
    dtm_path = ARTIFACT_DIR / "diagnosis_traceability_map.md"
    if not dtm_path.exists():
        return ["Cannot check diagnosis traceability — diagnosis_traceability_map.md missing"]
    content = read(dtm_path)
    for diag_id in GOVERNED_DIAGNOSIS_IDS:
        if diag_id not in content:
            failures.append(f"Diagnosis not traced: {diag_id}")
    for cond_id in GOVERNED_CONDITIONS:
        if cond_id not in content:
            failures.append(f"Condition not referenced in diagnosis traceability map: {cond_id}")
    if "condition_output_set.md" not in content:
        failures.append("condition_output_set.md reference missing in diagnosis traceability map")
    return failures


def check_intelligence_traceability() -> list:
    """Check 4 — INTEL-001..002 present in intelligence artifacts."""
    failures = []
    for name in ["intelligence_output_set.md", "intelligence_traceability_map.md"]:
        path = ARTIFACT_DIR / name
        if not path.exists():
            failures.append(f"Cannot check intelligence traceability — {name} missing")
            continue
        content = read(path)
        for intel_id in GOVERNED_INTELLIGENCE_IDS:
            if intel_id not in content:
                failures.append(f"{intel_id} not found in {name}")
        if name == "intelligence_traceability_map.md":
            for diag_id in GOVERNED_DIAGNOSIS_IDS:
                if diag_id not in content:
                    failures.append(f"{diag_id} not referenced in intelligence_traceability_map.md")
    return failures


def check_condition_coverage() -> list:
    """Check 5 — COND-001..008 referenced in input matrix and output set."""
    failures = []
    for artifact in ["diagnosis_input_matrix.md", "diagnosis_output_set.md"]:
        path = ARTIFACT_DIR / artifact
        if not path.exists():
            failures.append(f"Cannot check condition coverage — {artifact} missing")
            continue
        content = read(path)
        for cond_id in GOVERNED_CONDITIONS:
            if cond_id not in content:
                failures.append(f"{cond_id} not referenced in {artifact}")
    return failures


def check_computed_diagnosis() -> list:
    """Check 6 — DIAG-006 computed with 0.333 rec/sec and SENSOR_BRIDGE_CONFIGURED."""
    failures = []
    dos_path = ARTIFACT_DIR / "diagnosis_output_set.md"
    if not dos_path.exists():
        return ["Cannot check computed diagnosis — diagnosis_output_set.md missing"]
    content = read(dos_path)
    # Use \n## as section boundary to avoid matching --- inside table rows
    diag006_pattern = re.compile(r"## DIAG-006.*?(?=\n## DIAG-|\Z)", re.DOTALL)
    match = diag006_pattern.search(content)
    if not match:
        failures.append("DIAG-006 section missing in diagnosis_output_set.md")
        return failures
    section = match.group(0)
    if "computed" not in section.lower():
        failures.append("DIAG-006 expected state 'computed' not found in diagnosis_output_set.md")
    if "0.333" not in section:
        failures.append("DIAG-006 expected throughput 0.333 rec/sec not found in diagnosis_output_set.md")
    if "SENSOR_BRIDGE_CONFIGURED" not in section:
        failures.append("DIAG-006 expected classification SENSOR_BRIDGE_CONFIGURED not found in diagnosis_output_set.md")
    return failures


def check_blocked_diagnosis_count() -> list:
    """Check 7 — 7 blocked diagnoses declared in diagnosis_output_set.md."""
    failures = []
    dos_path = ARTIFACT_DIR / "diagnosis_output_set.md"
    if not dos_path.exists():
        return ["Cannot check blocked diagnoses — diagnosis_output_set.md missing"]
    content = read(dos_path)
    blocked_ids = ["DIAG-001", "DIAG-002", "DIAG-003", "DIAG-004", "DIAG-005", "DIAG-007", "DIAG-008"]
    for diag_id in blocked_ids:
        # Use \n## as section boundary to avoid matching --- inside table rows
        pattern = re.compile(rf"## {diag_id}.*?(?=\n## DIAG-|\Z)", re.DOTALL)
        match = pattern.search(content)
        if not match:
            failures.append(f"{diag_id} section missing in diagnosis_output_set.md")
            continue
        section = match.group(0)
        if "blocked" not in section.lower():
            failures.append(f"{diag_id} expected state 'blocked' not found in diagnosis_output_set.md")
    return failures


def check_input_boundary() -> list:
    """Check 8 — condition_output_set.md referenced; no direct 40.5 access as primary input."""
    failures = []
    dim_path = ARTIFACT_DIR / "diagnosis_input_matrix.md"
    if not dim_path.exists():
        return ["Cannot check input boundary — diagnosis_input_matrix.md missing"]
    content = read(dim_path)
    if "condition_output_set.md" not in content:
        failures.append("condition_output_set.md reference missing in diagnosis_input_matrix.md (40.6 input boundary not declared)")
    if "signal_output_set.md" in content:
        lines_with_40_5 = [
            line for line in content.splitlines()
            if "signal_output_set.md" in line
            and "via" not in line.lower()
            and "chain" not in line.lower()
            and "traceability" not in line.lower()
        ]
        if lines_with_40_5:
            failures.append("diagnosis_input_matrix.md references signal_output_set.md as direct input (violation of 40.5 access boundary)")
    return failures


def check_boundary_compliance() -> list:
    """Check 9 — forbidden content absent; prohibited patterns not present."""
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
            if FORBIDDEN_ALLOWED_RE.search(line):
                continue
            for pattern, label in FORBIDDEN_PATTERNS:
                if pattern.search(line):
                    failures.append(
                        f"Forbidden content ({label}) in {filename}:{i}: {line.strip()[:80]}"
                    )
    return failures


def check_upstream_access_declaration() -> list:
    """Check 10 — not-accessed declaration in diagnosis_boundary_enforcement.md."""
    failures = []
    be_path = ARTIFACT_DIR / "diagnosis_boundary_enforcement.md"
    if not be_path.exists():
        return ["Cannot check upstream access — diagnosis_boundary_enforcement.md missing"]
    content = read(be_path)
    if "not accessed" not in content:
        failures.append("diagnosis_boundary_enforcement.md does not declare upstream artifacts as 'not accessed'")
    for layer in ["40.2", "40.3", "40.4", "40.5"]:
        if layer not in content:
            failures.append(f"Layer {layer} not referenced in boundary enforcement declaration")
    return failures


def check_governance_immutability() -> list:
    """Check 11 — GOVERNANCE IMMUTABILITY DECLARATION present in this script."""
    script_content = Path(__file__).read_text(encoding="utf-8")
    if "GOVERNANCE IMMUTABILITY DECLARATION" in script_content:
        print("  PASS  GOVERNANCE IMMUTABILITY DECLARATION present in this script")
        return []
    return ["GOVERNANCE IMMUTABILITY DECLARATION missing from validator script"]


def run_checks() -> bool:
    checks = [
        ("1.  Completeness", check_completeness),
        ("2.  Contract identity", check_contract_identity),
        ("3.  Diagnosis traceability", check_diagnosis_traceability),
        ("4.  Intelligence traceability", check_intelligence_traceability),
        ("5.  Condition coverage", check_condition_coverage),
        ("6.  Computed diagnosis", check_computed_diagnosis),
        ("7.  Blocked diagnosis count", check_blocked_diagnosis_count),
        ("8.  Input boundary", check_input_boundary),
        ("9.  Boundary compliance", check_boundary_compliance),
        ("10. Upstream access declaration", check_upstream_access_declaration),
        ("11. Governance immutability", check_governance_immutability),
    ]

    print("=" * 65)
    print("PIOS-40.7-RUN01 validate_diagnosis_artifacts.py")
    print("run_id: run_01_blueedge")
    print("Artifact directory: docs/pios/40.7/")
    print("=" * 65)

    results = {}
    all_passed = True

    for label, fn in checks:
        if label.startswith("11."):
            print(f"\n[...] {label}")
        failures = fn()
        passed = len(failures) == 0
        results[label] = passed
        if not label.startswith("11."):
            status = "PASS" if passed else "FAIL"
            print(f"\n[{status}] {label}")
        else:
            status = "PASS" if passed else "FAIL"
            if not passed:
                print(f"[{status}] {label}")
        if not passed:
            all_passed = False
            for f in failures:
                print(f"       {f}")

    print("\n" + "=" * 65)
    print("Validation Summary:")
    for label, passed in results.items():
        print(f"  {'PASS' if passed else 'FAIL'}  {label}")
    passed_count = sum(1 for v in results.values() if v)
    total_count = len(results)
    print(f"\nValidation result: {passed_count}/{total_count} {'PASS' if all_passed else 'FAIL'}")
    print(f"Final status: {'COMPLETE' if all_passed else 'INCOMPLETE'}")
    print("=" * 65)
    return all_passed


if __name__ == "__main__":
    passed = run_checks()
    sys.exit(0 if passed else 1)
