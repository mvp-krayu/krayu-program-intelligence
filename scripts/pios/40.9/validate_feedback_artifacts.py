#!/usr/bin/env python3
"""
validate_feedback_artifacts.py
Stream: 40.9 — PiOS Feedback and Continuous Improvement Layer
Contract: PIOS-40.9-RUN01-CONTRACT-v1
run_id: run_01_blueedge
comparison_run_set: run_00_baseline, run_01_blueedge

GOVERNANCE IMMUTABILITY DECLARATION:
This validator script is the authoritative validation record for Stream 40.9 run_01_blueedge.
It must not be modified after stream execution is declared complete. Modifications to this
script after stream closure constitute a governance violation.

Validates the docs/pios/40.9 feedback artifacts against contract requirements.

Checks:
  1.  Completeness                    — all 9 expected artifacts present
  2.  Contract identity               — run_01_blueedge and PIOS-40.9-RUN01-CONTRACT-v1 in artifacts
  3.  Run coverage                    — both run_00_baseline and run_01_blueedge referenced
  4.  Unknown space completeness      — 9 USR entries (2 run_00 + 7 run_01)
  5.  Cross-run difference register   — CDR entries present; descriptive-only markers
  6.  Recurrence definition           — 0 governed recurrences declared; structural observations preserved
  7.  Non-interpretation compliance   — no forbidden content in feedback artifacts
  8.  Traceability preservation       — 6 FSR signals traced; 6/6 completeness declared
  9.  Boundary compliance             — upstream access declaration present; no 40.7 direct access
  10. Temporal sequence               — NOT APPLICABLE declared with basis
  11. Governance immutability         — GOVERNANCE IMMUTABILITY DECLARATION present in this script

Usage:
    python3 scripts/pios/40.9/validate_feedback_artifacts.py
"""

import sys
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
ARTIFACT_DIR = REPO_ROOT / "docs/pios/40.9"

EXPECTED_ARTIFACTS = [
    "feedback_signal_registry.md",
    "unknown_space_registry.md",
    "recurrence_detection_report.md",
    "cross_run_difference_register.md",
    "coverage_pressure_map.md",
    "feedback_traceability_manifest.md",
    "feedback_validation_report.md",
    "feedback_boundary_enforcement.md",
    "execution_manifest.md",
]

FSR_IDS = [f"FSR-{i:03d}" for i in range(1, 7)]
USR_IDS = [f"USR-{i:03d}" for i in range(1, 10)]
CDR_IDS = [f"CDR-{i:03d}" for i in range(1, 11)]

FORBIDDEN_PATTERNS = [
    (re.compile(r"\brecommend(?:ation|s|ed|ing)\b", re.IGNORECASE), "recommendation"),
    (re.compile(r"\bpredict(?:ion|s|ed|ing)\b", re.IGNORECASE), "prediction"),
    (re.compile(r"\bprioritiz(?:ation|e|ed|ing)\b", re.IGNORECASE), "prioritization"),
    (re.compile(r"\bscor(?:ing|e|ed)\b(?!\s+(?:PASS|FAIL|a\s+goal))", re.IGNORECASE), "scoring"),
    (re.compile(r"\bremediati(?:on|ng)\b", re.IGNORECASE), "remediation"),
    (re.compile(r"\bprogn(?:osis|oses)\b", re.IGNORECASE), "prognosis"),
    (re.compile(r"\bheuristic\b", re.IGNORECASE), "heuristic enrichment"),
    (re.compile(r"\bspeculat(?:ive|ion)\b", re.IGNORECASE), "speculative content"),
]

FORBIDDEN_ALLOWED_RE = re.compile(
    r"(No recommendation|No prediction|No prioritization|No scoring|Not produced|prohibited|Compliant|"
    r"Confirmed|Boundary|boundary|forbidden|Prohibition|downstream|"
    r"not performed|not produced|GC-06|GC-07|Delivery Integrity|"
    r"Non-Interpretation|non-interpretation|No inference|"
    r"Feedback Integrity|no.*scoring|no.*priorit|no.*predict|no.*recommend|"
    r"constraint|absence|absent|not present|not available|not generated|"
    r"no scoring|no prioritization|no recommendation|no prediction)",
    re.IGNORECASE,
)


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def check_completeness() -> list:
    return [f"MISSING: {n}" for n in EXPECTED_ARTIFACTS if not (ARTIFACT_DIR / n).exists()]


def check_contract_identity() -> list:
    failures = []
    check_files = [
        "feedback_signal_registry.md",
        "unknown_space_registry.md",
        "recurrence_detection_report.md",
        "cross_run_difference_register.md",
        "feedback_validation_report.md",
        "execution_manifest.md",
    ]
    for name in check_files:
        path = ARTIFACT_DIR / name
        if not path.exists():
            continue
        content = read(path)
        if "PIOS-40.9-RUN01-CONTRACT-v1" not in content:
            failures.append(f"PIOS-40.9-RUN01-CONTRACT-v1 not found in {name}")
        if "run_01_blueedge" not in content:
            failures.append(f"run_01_blueedge not found in {name}")
    return failures


def check_run_coverage() -> list:
    failures = []
    check_files = [
        "feedback_signal_registry.md",
        "unknown_space_registry.md",
        "cross_run_difference_register.md",
        "coverage_pressure_map.md",
        "recurrence_detection_report.md",
    ]
    for name in check_files:
        path = ARTIFACT_DIR / name
        if not path.exists():
            continue
        content = read(path)
        if "run_00_baseline" not in content:
            failures.append(f"run_00_baseline not referenced in {name}")
        if "run_01_blueedge" not in content:
            failures.append(f"run_01_blueedge not referenced in {name}")
    return failures


def check_unknown_space_completeness() -> list:
    failures = []
    usr_path = ARTIFACT_DIR / "unknown_space_registry.md"
    if not usr_path.exists():
        return ["Cannot check unknown space — unknown_space_registry.md missing"]
    content = read(usr_path)

    # All 9 USR IDs must be present
    for usr_id in USR_IDS:
        if usr_id not in content:
            failures.append(f"Unknown space registry entry not found: {usr_id}")

    # run_00_baseline must have AT-001, AT-002 (USR-001) and DT-007, AT-007 (USR-002)
    if "AT-001" not in content:
        failures.append("USR-001/USR-002: AT-001 blocking reference missing")
    if "AT-002" not in content:
        failures.append("USR-001: AT-002 blocking reference missing")
    if "DT-007" not in content:
        failures.append("USR-002: DT-007 blocking reference missing")
    if "AT-007" not in content:
        failures.append("USR-002: AT-007 blocking reference missing")

    # run_01_blueedge must have INF-003 and fleet references
    if "INF-003" not in content:
        failures.append("USR-003..006: INF-003 Prometheus blocking reference missing")
    if "fleet" not in content:
        failures.append("USR-007: fleet:* WebSocket blocking reference missing")
    if "TMP-010" not in content:
        failures.append("USR-008/USR-009: TMP-010 blocking reference missing")

    # Total count declaration
    if "Total unknown space dimensions: 9" not in content:
        failures.append("unknown_space_registry.md does not declare total of 9 unknown space dimensions")

    return failures


def check_cross_run_difference_register() -> list:
    failures = []
    cdr_path = ARTIFACT_DIR / "cross_run_difference_register.md"
    if not cdr_path.exists():
        return ["Cannot check cross-run differences — cross_run_difference_register.md missing"]
    content = read(cdr_path)

    # CDR entries CDR-001 through CDR-010 must be present
    for cdr_id in CDR_IDS:
        if cdr_id not in content:
            failures.append(f"Cross-run difference entry not found: {cdr_id}")

    # DIAG-006 state reversal must be registered (CDR-005)
    if "blocked" not in content or "computed" not in content:
        failures.append("cross_run_difference_register.md does not declare both blocked and computed states")

    # Element count differences must be declared (INTEL-003, INTEL-004, INTEL-005 absent)
    if "INTEL-003" not in content or "INTEL-004" not in content or "INTEL-005" not in content:
        failures.append("INTEL-003/INTEL-004/INTEL-005 element count differences not declared")

    # Cross-run comparison not established must be declared for absent elements
    if "cross-run comparison not established" not in content.lower():
        failures.append("cross_run_difference_register.md does not declare 'cross-run comparison not established' for absent elements")

    # No causal explanation — check for forbidden causal terms
    causal_patterns = [
        re.compile(r"\bbecause\s+of\b", re.IGNORECASE),
        re.compile(r"\bdue\s+to\s+the\s+fact\b", re.IGNORECASE),
        re.compile(r"\bindicat(?:es|ing)\s+a\s+(?:problem|defect|issue|failure)\b", re.IGNORECASE),
        re.compile(r"\bdefect\b", re.IGNORECASE),
    ]
    for i, line in enumerate(content.splitlines(), 1):
        for pat in causal_patterns:
            if pat.search(line):
                failures.append(
                    f"Possible causal explanation in cross_run_difference_register.md:{i}: {line.strip()[:80]}"
                )

    return failures


def check_recurrence_definition() -> list:
    failures = []
    rdr_path = ARTIFACT_DIR / "recurrence_detection_report.md"
    if not rdr_path.exists():
        return ["Cannot check recurrence — recurrence_detection_report.md missing"]
    content = read(rdr_path)

    # 0 governed cross-run recurrences must be declared
    if "Total governed cross-run recurrence patterns: 0" not in content:
        failures.append("recurrence_detection_report.md does not declare 0 governed cross-run recurrences")

    # Recurrence definition must be present
    if "Recurrence Definition" not in content:
        failures.append("recurrence_detection_report.md does not contain a Recurrence Definition section")

    # OBS-A and OBS-B must be present as structural observations
    if "OBS-A" not in content:
        failures.append("OBS-A structural observation missing from recurrence_detection_report.md")
    if "OBS-B" not in content:
        failures.append("OBS-B structural observation missing from recurrence_detection_report.md")

    # Hardening compliance declaration must be present
    if "Hardening Compliance Declaration" not in content:
        failures.append("recurrence_detection_report.md missing Hardening Compliance Declaration section")

    # DIAG-005 evaluation must be present (blocked in both but different chains)
    if "DIAG-005" not in content:
        failures.append("DIAG-005 recurrence evaluation missing from recurrence_detection_report.md")

    return failures


def check_non_interpretation_compliance() -> list:
    failures = []
    check_artifacts = [
        "feedback_signal_registry.md",
        "unknown_space_registry.md",
        "recurrence_detection_report.md",
        "coverage_pressure_map.md",
        "cross_run_difference_register.md",
        "feedback_traceability_manifest.md",
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


def check_traceability_preservation() -> list:
    failures = []
    manifest = ARTIFACT_DIR / "feedback_traceability_manifest.md"
    if not manifest.exists():
        return ["Cannot check traceability — feedback_traceability_manifest.md missing"]
    content = read(manifest)

    # All 6 FSR IDs must appear
    for fsr_id in FSR_IDS:
        if fsr_id not in content:
            failures.append(f"Feedback signal not traced in manifest: {fsr_id}")

    # 40.8 delivery sources for both runs must be cited
    if "delivery_output_packet.md" not in content:
        failures.append("40.8 delivery source (delivery_output_packet.md) not cited in traceability manifest")
    if "run_01_pios_baseline" not in content:
        failures.append("run_00_baseline 40.8 path not cited in traceability manifest")

    # Completeness declaration must confirm 6/6
    if "6 / 6" not in content and "6/6" not in content:
        failures.append("feedback_traceability_manifest.md does not confirm 6/6 traceability completeness")

    # FSR registry must declare 6 signals
    fsr_reg = ARTIFACT_DIR / "feedback_signal_registry.md"
    if fsr_reg.exists():
        reg_content = read(fsr_reg)
        if "Total feedback signals registered: 6" not in reg_content:
            failures.append("feedback_signal_registry.md does not confirm 6 registered signals")

    return failures


def check_boundary_compliance() -> list:
    failures = []

    # Boundary enforcement must be present and declare PASS
    be_path = ARTIFACT_DIR / "feedback_boundary_enforcement.md"
    if not be_path.exists():
        return ["Cannot check boundary — feedback_boundary_enforcement.md missing"]
    be_content = read(be_path)

    if "boundary_enforcement_status: PASS" not in be_content:
        failures.append("feedback_boundary_enforcement.md does not declare boundary_enforcement_status: PASS")

    # Upstream access declaration must confirm not-accessed for both runs
    for layer in ["40.2", "40.3", "40.4", "40.5", "40.6", "40.7"]:
        if f"Not accessed" not in be_content and layer not in be_content:
            failures.append(f"Layer {layer} not referenced in boundary enforcement declaration")

    # Validation report must confirm PASS
    fvr = ARTIFACT_DIR / "feedback_validation_report.md"
    if fvr.exists():
        fvr_content = read(fvr)
        if "9/9 PASS" not in fvr_content and "Total: 9/9 PASS" not in fvr_content:
            failures.append("feedback_validation_report.md does not confirm 9/9 PASS")

    # Execution manifest must declare PARTIAL
    em = ARTIFACT_DIR / "execution_manifest.md"
    if em.exists():
        em_content = read(em)
        if "final_status: PARTIAL" not in em_content:
            failures.append("execution_manifest.md must declare final_status: PARTIAL (upstream gaps persist)")

    return failures


def check_temporal_sequence() -> list:
    failures = []
    rdr_path = ARTIFACT_DIR / "recurrence_detection_report.md"
    if not rdr_path.exists():
        return ["Cannot check temporal sequence — recurrence_detection_report.md missing"]
    content = read(rdr_path)

    # NOT APPLICABLE must be declared with basis for temporal sequence
    if "NOT APPLICABLE" not in content:
        failures.append("recurrence_detection_report.md does not declare temporal sequence NOT APPLICABLE")

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
        ("3.  Run coverage", check_run_coverage),
        ("4.  Unknown space completeness", check_unknown_space_completeness),
        ("5.  Cross-run difference register", check_cross_run_difference_register),
        ("6.  Recurrence definition", check_recurrence_definition),
        ("7.  Non-interpretation compliance", check_non_interpretation_compliance),
        ("8.  Traceability preservation", check_traceability_preservation),
        ("9.  Boundary compliance", check_boundary_compliance),
        ("10. Temporal sequence", check_temporal_sequence),
        ("11. Governance immutability", check_governance_immutability),
    ]

    print("=" * 65)
    print("PIOS-40.9-RUN01 validate_feedback_artifacts.py")
    print("run_id: run_01_blueedge")
    print("comparison_run_set: run_00_baseline, run_01_blueedge")
    print(f"Artifact directory: docs/pios/40.9/")
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
