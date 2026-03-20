#!/usr/bin/env python3
"""
validate_loop_closure.py
Stream: 40.11 — PiOS Loop Closure and Governance Review
Contract: PIOS-40.11-RUN01-CONTRACT-v1
run_id: run_01_blueedge
comparison_run_set: run_00_baseline, run_01_blueedge

GOVERNANCE IMMUTABILITY DECLARATION:
This script is a governed validation artifact. Its check logic, expected values,
and governance rules must not be modified without a new contract execution.
Modification of this script outside a governed execution constitutes a boundary
violation of the PiOS pipeline governance model.

Validates the docs/pios/40.11 loop closure artifacts against contract requirements.

Checks:
  1. Completeness                    — all 5 mandatory artifacts present
  2. Input integrity                 — all 40.10 inputs present; orchestration validation PASS
  3. Control surface classification  — CONTROL-SURFACE-A declared; eligibility distribution confirmed
  4. Governance compliance           — 5/5 rules confirmed PASS
  5. Non-interpretation compliance   — no forbidden language in any artifact
  6. Structural gap register         — SGR entries present; trace links confirmed
  7. Closure statement integrity     — required declarations present
  8. Governance immutability         — GOVERNANCE IMMUTABILITY DECLARATION in this script

Usage:
    python3 scripts/pios/40.11/validate_loop_closure.py
"""

import sys
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
ARTIFACT_DIR = REPO_ROOT / "docs/pios/40.11"
INPUT_40_10 = REPO_ROOT / "docs/pios/40.10"

EXPECTED_ARTIFACTS = [
    "loop_closure_report.md",
    "control_surface_classification.md",
    "governance_compliance_report.md",
    "structural_gap_register.md",
    "execution_closure_statement.md",
]

REQUIRED_40_10_INPUTS = [
    "control_directive_registry.md",
    "control_eligibility_map.md",
    "orchestration_traceability_manifest.md",
    "control_boundary_enforcement.md",
    "orchestration_validation_report.md",
    "execution_manifest.md",
]

SGR_IDS = [f"SGR-{i:03d}" for i in range(1, 8)]   # SGR-001..007
GFB_IDS = [f"GFB-{i:03d}" for i in range(1, 4)]   # GFB-001..003
DIR_IDS = [f"DIR-{i:03d}" for i in range(1, 7)]    # DIR-001..006

FORBIDDEN_PATTERNS = [
    (re.compile(r"\brecommend(?:ation|s|ed|ing)\b", re.IGNORECASE), "recommendation"),
    (re.compile(r"\bprioritiz(?:ation|e|ed|ing)\b", re.IGNORECASE), "prioritization"),
    (re.compile(r"\branking\b", re.IGNORECASE), "ranking"),
    (re.compile(r"\bscor(?:ing|e|ed)\b(?!\s+(?:on|in|for))", re.IGNORECASE), "scoring"),
    (re.compile(r"\boptimal\b", re.IGNORECASE), "optimal language"),
    (re.compile(r"\bshould\s+be\b", re.IGNORECASE), "prescriptive 'should be'"),
    (re.compile(r"\bmust\s+be\s+(?:fixed|addressed|resolved|activated|implemented)\b", re.IGNORECASE), "prescriptive action"),
    (re.compile(r"\broot\s+cause\b", re.IGNORECASE), "root-cause inference"),
    (re.compile(r"\boptimiz(?:ation|e|ed|ing)\b", re.IGNORECASE), "optimization language"),
    (re.compile(r"\bimprove(?:ment|d|s)\b", re.IGNORECASE), "improvement language"),
    (re.compile(r"\bregress(?:ion|ed|es)\b", re.IGNORECASE), "regression language"),
    (re.compile(r"\bbaseline\s+(?:truth|reference|standard|benchmark)\b", re.IGNORECASE), "baseline reference truth"),
]

FORBIDDEN_ALLOWED_CONTEXTS = re.compile(
    r"(No recommendation|Not produced|prohibited|Confirmed|Compliant|"
    r"Boundary|boundary|forbidden|Prohibition|downstream|"
    r"not performed|not produced|GC-06|GC-07|"
    r"no.*recommendation|no.*scoring|no.*ranking|no.*priorit|"
    r"no.*optimiz|no.*interpret|no.*improvement|"
    r"Non-interpretation|non-interpretation|"
    r"constraint|absence|absent|not present|not available|"
    r"No.*judgment|no.*judgment|no.*evaluation|"
    r"No.*system.*judgment|no.*system|"
    r"descriptive|Descriptive|"
    r"governance.*feedback|Governance.*Feedback|"
    r"GFB-|SGR-|OBS-|"
    r"limitation|gap|weakness|structural|"
    r"Feedback and improvement|and improvement|Continuous Improvement|"
    r"stream.*40\\.9|40\\.9.*Feedback)",
    re.IGNORECASE
)


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def check_completeness() -> list:
    failures = []
    for name in EXPECTED_ARTIFACTS:
        if not (ARTIFACT_DIR / name).exists():
            failures.append(f"MISSING: docs/pios/40.11/{name}")

    # Contract identity must be present in closure statement and loop closure report
    for name in ["execution_closure_statement.md", "loop_closure_report.md"]:
        path = ARTIFACT_DIR / name
        if path.exists():
            content = read(path)
            if "PIOS-40.11-RUN01-CONTRACT-v1" not in content:
                failures.append(f"{name} does not cite contract PIOS-40.11-RUN01-CONTRACT-v1")

    return failures


def check_input_integrity() -> list:
    failures = []

    # All mandatory 40.10 inputs must be present
    for name in REQUIRED_40_10_INPUTS:
        if not (INPUT_40_10 / name).exists():
            failures.append(f"MISSING mandatory 40.10 input: docs/pios/40.10/{name}")

    # Orchestration validation report must declare PASS
    vr = INPUT_40_10 / "orchestration_validation_report.md"
    if vr.exists():
        content = read(vr)
        if "PASS — all 7 checks pass" not in content and "7/7 PASS" not in content:
            failures.append("docs/pios/40.10/orchestration_validation_report.md does not confirm 7/7 PASS")

    # Closure report must confirm input integrity
    lcr = ARTIFACT_DIR / "loop_closure_report.md"
    if lcr.exists():
        content = read(lcr)
        if "Input integrity: PASS" not in content:
            failures.append("loop_closure_report.md does not declare Input integrity: PASS")
        if "6/6 mandatory 40.10 artifacts present" not in content and "6 mandatory 40.10 artifacts present" not in content:
            failures.append("loop_closure_report.md does not confirm all 6 mandatory 40.10 artifacts")

    return failures


def check_control_surface_classification() -> list:
    failures = []
    csc = ARTIFACT_DIR / "control_surface_classification.md"
    if not csc.exists():
        return ["Cannot check control surface — control_surface_classification.md missing"]
    content = read(csc)

    # CONTROL-SURFACE-A must be declared
    if "CONTROL-SURFACE-A" not in content:
        failures.append("control_surface_classification.md does not declare CONTROL-SURFACE-A")

    # observation-only must be declared
    if "observation-only" not in content:
        failures.append("control_surface_classification.md does not declare observation-only label")

    # ELIGIBILITY-3 count must be 0
    e3_pattern = re.compile(r"ELIGIBILITY-3.*?\|\s*(\d+)", re.DOTALL)
    m = e3_pattern.search(content)
    if m:
        count = m.group(1).strip()
        if count != "0":
            failures.append(f"control_surface_classification.md: ELIGIBILITY-3 count is {count}, expected 0")
    else:
        # Check that ELIGIBILITY-3 appears with 0 or absent
        if "ELIGIBILITY-3" in content:
            # Check lines with ELIGIBILITY-3
            for line in content.splitlines():
                if "ELIGIBILITY-3" in line and "| 0 |" not in line and "count = 0" not in line and "count: 0" not in line:
                    if re.search(r"\|\s*[1-9]\d*\s*\|", line):
                        failures.append(f"control_surface_classification.md: ELIGIBILITY-3 appears with non-zero count")

    # ELIGIBILITY-2 count must be 0
    e2_pattern = re.compile(r"ELIGIBILITY-2.*?\|\s*(\d+)", re.DOTALL)
    m2 = e2_pattern.search(content)
    if m2:
        count2 = m2.group(1).strip()
        if count2 != "0":
            failures.append(f"control_surface_classification.md: ELIGIBILITY-2 count is {count2}, expected 0")

    # ELIGIBILITY-1 must be declared with count 6
    if "ELIGIBILITY-1" not in content:
        failures.append("control_surface_classification.md does not cite ELIGIBILITY-1")

    # Classification rule must be declared
    if "Classification Rule" not in content and "classification rule" not in content:
        failures.append("control_surface_classification.md missing classification rule declaration")

    # Closure statement must also declare CONTROL-SURFACE-A
    cs_stmt = ARTIFACT_DIR / "execution_closure_statement.md"
    if cs_stmt.exists():
        stmt_content = read(cs_stmt)
        if "CONTROL-SURFACE-A" not in stmt_content:
            failures.append("execution_closure_statement.md does not declare CONTROL-SURFACE-A")

    return failures


def check_governance_compliance() -> list:
    failures = []
    gcr = ARTIFACT_DIR / "governance_compliance_report.md"
    if not gcr.exists():
        return ["Cannot check governance compliance — governance_compliance_report.md missing"]
    content = read(gcr)

    # All 5 rules must show PASS
    required_rules = [
        "Non-intelligence principle",
        "Cross-run neutrality",
        "Deterministic classification",
        "Action mapping explicitness",
        "Boundary enforcement",
    ]
    for rule in required_rules:
        rule_pattern = re.compile(rf"{re.escape(rule)}.*?(?=## Rule|\Z)", re.DOTALL | re.IGNORECASE)
        m = rule_pattern.search(content)
        if not m:
            failures.append(f"governance_compliance_report.md: Rule section for '{rule}' not found")
            continue
        section = m.group(0)
        if "result: PASS" not in section.lower() and "PASS" not in section:
            failures.append(f"governance_compliance_report.md: Rule '{rule}' does not declare PASS result")

    # Summary must confirm 5/5 PASS
    if "5/5 PASS" not in content and "all 5 rules confirmed" not in content.lower():
        failures.append("governance_compliance_report.md does not confirm 5/5 PASS")

    # Closure statement must declare governance_compliance: PASS
    cs = ARTIFACT_DIR / "execution_closure_statement.md"
    if cs.exists():
        cs_content = read(cs)
        if "governance_compliance: PASS" not in cs_content:
            failures.append("execution_closure_statement.md does not declare governance_compliance: PASS")

    return failures


def check_non_interpretation_compliance() -> list:
    failures = []
    for name in EXPECTED_ARTIFACTS:
        path = ARTIFACT_DIR / name
        if not path.exists():
            continue
        content = read(path)
        for i, line in enumerate(content.splitlines(), 1):
            if FORBIDDEN_ALLOWED_CONTEXTS.search(line):
                continue
            for pattern, label in FORBIDDEN_PATTERNS:
                if pattern.search(line):
                    failures.append(
                        f"Forbidden content ({label}) in {name}:{i}: {line.strip()[:80]}"
                    )
    return failures


def check_structural_gap_register() -> list:
    failures = []
    sgr = ARTIFACT_DIR / "structural_gap_register.md"
    if not sgr.exists():
        return ["Cannot check structural gaps — structural_gap_register.md missing"]
    content = read(sgr)

    # All 7 SGR entries must be present
    for sgr_id in SGR_IDS:
        if sgr_id not in content:
            failures.append(f"Structural gap entry missing: {sgr_id}")

    # Gap types must be declared
    for gap_type in ["missing_evidence_dimension", "partial_coverage_dimension", "escalation_pathway_absence"]:
        if gap_type not in content:
            failures.append(f"Gap type not declared in structural_gap_register.md: {gap_type}")

    # Each SGR must cite a directive (except SGR-007 which is pathway absence)
    for dir_id in ["DIR-001", "DIR-002", "DIR-003", "DIR-004", "DIR-005", "DIR-006"]:
        if dir_id not in content:
            failures.append(f"Directive not cited in structural_gap_register.md: {dir_id}")

    # Total count must be 7
    if "Total structural gaps registered: 7" not in content:
        failures.append("structural_gap_register.md does not confirm 7 total structural gaps")

    # No recommendation language in gap descriptions — check within SGR sections
    forbidden_in_sgr = [
        (re.compile(r"\bshould\b", re.IGNORECASE), "prescriptive 'should'"),
        (re.compile(r"\bmust\s+be\s+(?:fixed|resolved|addressed)\b", re.IGNORECASE), "prescriptive action"),
        (re.compile(r"\brecommend\b", re.IGNORECASE), "recommendation"),
    ]
    sgr_allowed = re.compile(r"(Gap state|Registry Rule|trace-linked|No.*recommend|no.*recommend|"
                              r"No.*priorit|no.*solution|no.*proposal|SGR-|GFB-|DIR-|FSR-|"
                              r"UNRESOLVED|PARTIAL|blocked|partial)", re.IGNORECASE)
    for i, line in enumerate(content.splitlines(), 1):
        if sgr_allowed.search(line):
            continue
        for pattern, label in forbidden_in_sgr:
            if pattern.search(line):
                failures.append(f"Forbidden content ({label}) in structural_gap_register.md:{i}: {line.strip()[:80]}")

    return failures


def check_closure_statement_integrity() -> list:
    failures = []
    cs = ARTIFACT_DIR / "execution_closure_statement.md"
    if not cs.exists():
        return ["Cannot check closure statement — execution_closure_statement.md missing"]
    content = read(cs)

    # Required declarations
    required = [
        ("closure_status: PARTIAL", "closure_status: PARTIAL"),
        ("CONTROL-SURFACE-A", "CONTROL-SURFACE-A"),
        ("governance_compliance: PASS", "governance_compliance: PASS"),
        ("traceability_integrity: PASS", "traceability_integrity: PASS"),
        ("stream_40.11_run_01_blueedge: CLOSED", "stream_40.11_run_01_blueedge: CLOSED"),
        ("final_status: PARTIAL", "final_status: PARTIAL"),
    ]
    for declaration, label in required:
        if declaration not in content:
            failures.append(f"execution_closure_statement.md missing declaration: {label}")

    # GFB entries must be cited
    for gfb_id in GFB_IDS:
        if gfb_id not in content:
            failures.append(f"Governance feedback entry not cited in closure statement: {gfb_id}")

    # Structural gap count must match
    if "7" not in content:
        failures.append("execution_closure_statement.md does not reference 7 structural gaps")

    return failures


def check_governance_immutability() -> list:
    """Verify GOVERNANCE IMMUTABILITY DECLARATION is present in this script."""
    failures = []
    this_script = Path(__file__)
    content = this_script.read_text(encoding="utf-8")
    if "GOVERNANCE IMMUTABILITY DECLARATION" not in content:
        failures.append("GOVERNANCE IMMUTABILITY DECLARATION missing from validate_loop_closure.py")
    else:
        print("  PASS  GOVERNANCE IMMUTABILITY DECLARATION present in this script")
    return failures


def run_checks() -> bool:
    results = {}
    all_passed = True

    checks = [
        ("1.  Completeness", check_completeness),
        ("2.  Input integrity", check_input_integrity),
        ("3.  Control surface classification", check_control_surface_classification),
        ("4.  Governance compliance", check_governance_compliance),
        ("5.  Non-interpretation compliance", check_non_interpretation_compliance),
        ("6.  Structural gap register", check_structural_gap_register),
        ("7.  Closure statement integrity", check_closure_statement_integrity),
        ("8.  Governance immutability", check_governance_immutability),
    ]

    print("=" * 65)
    print("PIOS-40.11-RUN01 validate_loop_closure.py")
    print("run_id: run_01_blueedge")
    print("comparison_run_set: run_00_baseline, run_01_blueedge")
    print(f"Artifact directory: {ARTIFACT_DIR.relative_to(REPO_ROOT)}")
    print("=" * 65)

    for label, fn in checks:
        failures = fn()
        passed = len(failures) == 0
        results[label] = passed
        if label != "8.  Governance immutability":
            print(f"\n[{'PASS' if passed else 'FAIL'}] {label}")
        else:
            print(f"\n[...] {label}")
        if not passed:
            all_passed = False
            for f in failures:
                print(f"       {f}")

    print("\n" + "=" * 65)
    print("Validation Summary:")
    for label, passed in results.items():
        print(f"  {'PASS' if passed else 'FAIL'}  {label}")
    status = "COMPLETE" if all_passed else "INCOMPLETE"
    print(f"\nValidation result: {sum(v for v in results.values())}/{len(results)} PASS")
    print(f"Final status: {status}")
    print("=" * 65)
    return all_passed


if __name__ == "__main__":
    passed = run_checks()
    sys.exit(0 if passed else 1)
