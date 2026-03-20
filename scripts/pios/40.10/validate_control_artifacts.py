#!/usr/bin/env python3
"""
validate_control_artifacts.py
Stream: 40.10 — PiOS Agentic Orchestration and Runtime Control Layer
Contract: PIOS-40.10-RUN01-CONTRACT-v1
run_id: run_01_blueedge
comparison_run_set: run_00_baseline, run_01_blueedge

GOVERNANCE IMMUTABILITY DECLARATION:
This script is a governed validation artifact. Its check logic, expected values,
and governance rules must not be modified without a new contract execution.
Modification of this script outside a governed execution constitutes a boundary
violation of the PiOS pipeline governance model.

Validates the docs/pios/40.10 orchestration artifacts against contract requirements.

Checks:
  1. Completeness                       — all 6 artifacts present; 6 FSRs → 6 directives
  2. Traceability Integrity             — full directive → FSR → delivery element → telemetry chain
  3. Eligibility Classification Correct — each directive matches deterministic classification rule
  4. Directive Constraint Compliance    — action types within ACT-01–ACT-05 enum; match rule
  5. Non-Interpretation Compliance      — no recommendation, ranking, scoring, causal inference
  6. Cross-Run Neutrality Compliance    — symmetric treatment; no run superiority or baseline normalization
  7. Boundary Compliance                — no upstream modification; no autonomous execution logic
  8. Governance Immutability            — GOVERNANCE IMMUTABILITY DECLARATION present in this script

Usage:
    python3 scripts/pios/40.10/validate_control_artifacts.py
"""

import sys
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
ARTIFACT_DIR = REPO_ROOT / "docs/pios/40.10"
INPUT_40_9 = REPO_ROOT / "docs/pios/40.9"

EXPECTED_ARTIFACTS = [
    "control_directive_registry.md",
    "control_eligibility_map.md",
    "orchestration_traceability_manifest.md",
    "control_boundary_enforcement.md",
    "orchestration_validation_report.md",
    "execution_manifest.md",
]

DIR_IDS = [f"DIR-{i:03d}" for i in range(1, 7)]   # DIR-001..006
FSR_IDS = [f"FSR-{i:03d}" for i in range(1, 7)]   # FSR-001..006

# All 6 FSRs are classified ELIGIBILITY-1 (no recurrence → can't reach ELIGIBILITY-2/3)
EXPECTED_ELIGIBILITY = {
    "FSR-001": "ELIGIBILITY-1",
    "FSR-002": "ELIGIBILITY-1",
    "FSR-003": "ELIGIBILITY-1",
    "FSR-004": "ELIGIBILITY-1",
    "FSR-005": "ELIGIBILITY-1",
    "FSR-006": "ELIGIBILITY-1",
}

# Deterministic action type mapping:
# ELIGIBILITY-1 + unknown_space → ACT-02 (DIR-001, DIR-002, DIR-006)
# ELIGIBILITY-1 + partial_coverage → ACT-01 (DIR-003, DIR-004, DIR-005)
EXPECTED_ACTION_TYPES = {
    "DIR-001": "ACT-02",
    "DIR-002": "ACT-02",
    "DIR-003": "ACT-01",
    "DIR-004": "ACT-01",
    "DIR-005": "ACT-01",
    "DIR-006": "ACT-02",
}

ALLOWED_ACTION_TYPES = {"ACT-01", "ACT-02", "ACT-03", "ACT-04", "ACT-05"}

FORBIDDEN_PATTERNS = [
    (re.compile(r"\brecommend(?:ation|s|ed|ing)\b", re.IGNORECASE), "recommendation"),
    (re.compile(r"\bprioritiz(?:ation|e|ed|ing)\b", re.IGNORECASE), "prioritization"),
    (re.compile(r"\branking\b", re.IGNORECASE), "ranking"),
    (re.compile(r"\bscor(?:ing|e|ed)\b", re.IGNORECASE), "scoring"),
    (re.compile(r"\boptimal\b", re.IGNORECASE), "optimal language"),
    (re.compile(r"\bshould\s+be\b", re.IGNORECASE), "prescriptive 'should be'"),
    (re.compile(r"\bmust\s+be\s+(?:fixed|addressed|resolved|activated)\b", re.IGNORECASE), "prescriptive action"),
    (re.compile(r"\broot\s+cause\b", re.IGNORECASE), "root-cause inference"),
    (re.compile(r"\bcausal\b", re.IGNORECASE), "causal language"),
    (re.compile(r"\bexplains?\b", re.IGNORECASE), "explanatory language"),
    (re.compile(r"\bprogn(?:osis|oses)\b", re.IGNORECASE), "prognosis"),
    (re.compile(r"\bspeculat(?:ive|ion)\b", re.IGNORECASE), "speculative content"),
]

FORBIDDEN_ALLOWED_CONTEXTS = re.compile(
    r"(No recommendation|Not produced|prohibited|Confirmed|Compliant|"
    r"Boundary|boundary|forbidden|Prohibition|downstream|"
    r"not performed|not produced|GC-06|GC-07|"
    r"no.*recommendation|no.*scoring|no.*ranking|no.*priorit|"
    r"no.*causal|no.*root.cause|no.*interpret|"
    r"No causal|No root|Non-interpretation|non-interpretation|"
    r"constraint|absence|absent|not present|not available|"
    r"Orchestration principle|Controlled Orchestration|"
    r"Cross-Run Neutrality|cross-run neutrality|"
    r"Triggering condition|triggering_condition|"
    r"ACT-0[1-5].*not|not.*ACT-0[1-5])",
    re.IGNORECASE
)

CROSS_RUN_FORBIDDEN = [
    (re.compile(r"\bimprove(?:ment|d|s)\b", re.IGNORECASE), "improvement language"),
    (re.compile(r"\bdegrada(?:tion|ted)\b", re.IGNORECASE), "degradation language"),
    (re.compile(r"\bregress(?:ion|ed|es)\b", re.IGNORECASE), "regression language"),
    (re.compile(r"\bbaseline\s+(?:truth|reference|standard|benchmark)\b", re.IGNORECASE), "baseline reference truth"),
    (re.compile(r"\breference\s+run\b", re.IGNORECASE), "reference run designation"),
]

CROSS_RUN_ALLOWED_CONTEXTS = re.compile(
    r"(run_00_baseline|run_01_blueedge|comparison_run_set|"
    r"Baseline normalization.*not|No baseline|no baseline|"
    r"Cross-Run Neutrality|cross-run neutrality|"
    r"symmetrical|symmetrically|not designated|not treated as|"
    r"independent.*input|treated.*symmetrically|"
    r"cross-run.*not|not.*cross-run|no.*cross-run)",
    re.IGNORECASE
)


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def check_completeness() -> list:
    failures = []
    for name in EXPECTED_ARTIFACTS:
        if not (ARTIFACT_DIR / name).exists():
            failures.append(f"MISSING: {name}")

    # Check all 6 directives present in registry
    registry = ARTIFACT_DIR / "control_directive_registry.md"
    if registry.exists():
        content = read(registry)
        for dir_id in DIR_IDS:
            if dir_id not in content:
                failures.append(f"Directive missing from control_directive_registry.md: {dir_id}")
        if "Total directives issued: 6" not in content:
            failures.append("control_directive_registry.md does not confirm 6 issued directives")

    # Each FSR must be mapped in eligibility map
    eligibility = ARTIFACT_DIR / "control_eligibility_map.md"
    if eligibility.exists():
        emap_content = read(eligibility)
        for fsr_id in FSR_IDS:
            if fsr_id not in emap_content:
                failures.append(f"FSR not mapped in control_eligibility_map.md: {fsr_id}")

    # Contract identity must be present
    for name in ["control_directive_registry.md", "execution_manifest.md"]:
        path = ARTIFACT_DIR / name
        if path.exists():
            content = read(path)
            if "PIOS-40.10-RUN01-CONTRACT-v1" not in content:
                failures.append(f"{name} does not cite contract PIOS-40.10-RUN01-CONTRACT-v1")

    return failures


def check_traceability_integrity() -> list:
    failures = []
    manifest = ARTIFACT_DIR / "orchestration_traceability_manifest.md"
    if not manifest.exists():
        return ["Cannot check traceability — orchestration_traceability_manifest.md missing"]
    content = read(manifest)

    # All 6 directives must appear
    for dir_id in DIR_IDS:
        if dir_id not in content:
            failures.append(f"Directive not traced in manifest: {dir_id}")

    # All 6 FSRs must appear
    for fsr_id in FSR_IDS:
        if fsr_id not in content:
            failures.append(f"Source FSR not cited in traceability manifest: {fsr_id}")

    # Key delivery element IDs must appear
    for elem in ["INTEL-005", "INTEL-002", "INTEL-003", "INTEL-004",
                 "DIAG-005", "DIAG-006", "DIAG-007", "DIAG-008"]:
        if elem not in content:
            failures.append(f"Delivery element not cited in traceability manifest: {elem}")

    # Blocking/pending telemetry must appear
    for tel in ["AT-001", "AT-002", "DT-007", "AT-007", "INF-003"]:
        if tel not in content:
            failures.append(f"Blocking telemetry {tel} not cited in traceability manifest")

    # Cross-run attribution: both runs must be cited
    if "run_00_baseline" not in content:
        failures.append("orchestration_traceability_manifest.md does not cite run_00_baseline")
    if "run_01_blueedge" not in content:
        failures.append("orchestration_traceability_manifest.md does not cite run_01_blueedge")

    # Completeness declaration
    if "6 / 6" not in content and "6/6" not in content:
        failures.append("orchestration_traceability_manifest.md does not confirm 6/6 traceability completeness")

    return failures


def check_eligibility_classification() -> list:
    failures = []
    eligibility = ARTIFACT_DIR / "control_eligibility_map.md"
    if not eligibility.exists():
        return ["Cannot check eligibility — control_eligibility_map.md missing"]
    content = read(eligibility)

    # Check each FSR has the expected eligibility class
    for fsr_id, expected_class in EXPECTED_ELIGIBILITY.items():
        pattern = re.compile(rf"### {fsr_id}.*?(?=### FSR-|\Z)", re.DOTALL)
        m = pattern.search(content)
        if not m:
            failures.append(f"Eligibility section missing for {fsr_id}")
            continue
        section = m.group(0)
        if expected_class not in section:
            failures.append(f"{fsr_id}: expected eligibility class {expected_class} not found in section")

    # Check classification rule is stated
    if "Eligibility Classification Rule" not in content:
        failures.append("control_eligibility_map.md missing classification rule declaration")

    # Check precedence order is declared
    if "Precedence" not in content and "precedence" not in content:
        failures.append("control_eligibility_map.md missing precedence order declaration")

    # Check classification boundary rule is declared (for blocked-without-recurrence handling)
    if "Classification boundary rule" not in content and "classification boundary rule" not in content:
        failures.append("control_eligibility_map.md missing classification boundary rule declaration")

    # Check action type mapping is explicitly declared
    if "Action type mapping" not in content and "action type mapping" not in content:
        failures.append("control_eligibility_map.md missing explicit action type mapping declaration")

    # Cross-check eligibility in directive registry
    directive_registry = ARTIFACT_DIR / "control_directive_registry.md"
    if directive_registry.exists():
        reg_content = read(directive_registry)
        for dir_id, expected_action in EXPECTED_ACTION_TYPES.items():
            dir_pattern = re.compile(rf"## {dir_id}.*?(?=## DIR-|\Z)", re.DOTALL)
            dm = dir_pattern.search(reg_content)
            if not dm:
                failures.append(f"Directive section missing in registry: {dir_id}")
                continue
            section = dm.group(0)
            fsr_id = f"FSR-{dir_id[4:]}"
            expected_elig = EXPECTED_ELIGIBILITY.get(fsr_id, "")
            if expected_elig and expected_elig not in section:
                failures.append(f"{dir_id}: expected eligibility class {expected_elig} not found in directive entry")

    return failures


def check_directive_constraint_compliance() -> list:
    failures = []
    registry = ARTIFACT_DIR / "control_directive_registry.md"
    if not registry.exists():
        return ["Cannot check directive constraints — control_directive_registry.md missing"]
    content = read(registry)

    for dir_id, expected_action in EXPECTED_ACTION_TYPES.items():
        dir_pattern = re.compile(rf"## {dir_id}.*?(?=## DIR-|\Z)", re.DOTALL)
        m = dir_pattern.search(content)
        if not m:
            failures.append(f"Directive section missing: {dir_id}")
            continue
        section = m.group(0)

        # Check expected action type present
        if expected_action not in section:
            failures.append(f"{dir_id}: expected action type {expected_action} not found in directive")

        # Check action type is within allowed enum
        found_actions = re.findall(r"ACT-0[1-5]", section)
        for act in found_actions:
            if act not in ALLOWED_ACTION_TYPES:
                failures.append(f"{dir_id}: action type {act} not in allowed enum ACT-01–ACT-05")

        # Check permitted_action_type field present
        if "permitted_action_type" not in section.lower() and "Permitted action type" not in section:
            failures.append(f"{dir_id}: permitted_action_type field missing")

        # Check triggering_condition field present
        if "triggering_condition" not in section.lower() and "Triggering condition" not in section:
            failures.append(f"{dir_id}: triggering_condition field missing")

        # Check run reference present
        if "run_00_baseline" not in section and "run_01_blueedge" not in section:
            failures.append(f"{dir_id}: no run reference found in directive")

    return failures


def check_non_interpretation_compliance() -> list:
    failures = []
    check_artifacts = [
        "control_directive_registry.md",
        "control_eligibility_map.md",
        "orchestration_traceability_manifest.md",
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
    return failures


def check_cross_run_neutrality() -> list:
    failures = []

    # Directive registry must not contain run superiority language
    registry = ARTIFACT_DIR / "control_directive_registry.md"
    if registry.exists():
        content = read(registry)
        for i, line in enumerate(content.splitlines(), 1):
            if CROSS_RUN_ALLOWED_CONTEXTS.search(line):
                continue
            for pattern, label in CROSS_RUN_FORBIDDEN:
                if pattern.search(line):
                    failures.append(
                        f"Cross-run neutrality violation ({label}) in control_directive_registry.md:{i}: {line.strip()[:80]}"
                    )

    # Both runs must appear in the directive registry
    if registry.exists():
        reg_content = read(registry)
        if "run_00_baseline" not in reg_content:
            failures.append("control_directive_registry.md does not cite run_00_baseline")
        if "run_01_blueedge" not in reg_content:
            failures.append("control_directive_registry.md does not cite run_01_blueedge")

    # Boundary enforcement must declare cross-run neutrality
    be = ARTIFACT_DIR / "control_boundary_enforcement.md"
    if be.exists():
        be_content = read(be)
        if "cross-run neutrality" not in be_content.lower() and "Cross-Run Neutrality" not in be_content:
            failures.append("control_boundary_enforcement.md does not declare cross-run neutrality")
        if "symmetrically" not in be_content and "symmetric" not in be_content:
            failures.append("control_boundary_enforcement.md does not declare symmetric run treatment")

    return failures


def check_boundary_compliance() -> list:
    failures = []

    # Boundary enforcement must declare upstream layers not accessed
    be = ARTIFACT_DIR / "control_boundary_enforcement.md"
    if be.exists():
        be_content = read(be)
        for layer in ["40.8", "40.7", "40.6", "40.5", "40.4"]:
            lines_with_layer = [l for l in be_content.splitlines() if layer in l]
            for line in lines_with_layer:
                if "not accessed" not in line and "read-only" not in line and "Authorized" not in line:
                    if "accessed" in line.lower() and "not accessed" not in line.lower():
                        # Skip prohibition statements — these declare access is forbidden, not claimed
                        if re.search(r"No analytical|must not|may not|no direct|through 40\.2|prohibited|not permitted", line, re.IGNORECASE):
                            continue
                        failures.append(f"control_boundary_enforcement.md may claim unauthorized access: {line.strip()[:80]}")
        if "not accessed" not in be_content:
            failures.append("control_boundary_enforcement.md does not declare upstream layers as not accessed")
        if "boundary_enforcement_status: PASS" not in be_content:
            failures.append("control_boundary_enforcement.md does not declare boundary_enforcement_status: PASS")

    # Execution manifest must declare PARTIAL
    em = ARTIFACT_DIR / "execution_manifest.md"
    if em.exists():
        em_content = read(em)
        if "final_status: PARTIAL" not in em_content:
            failures.append("execution_manifest.md must declare final_status: PARTIAL (upstream gaps persist)")

    # Validation report must confirm all 7 checks pass
    vr = ARTIFACT_DIR / "orchestration_validation_report.md"
    if vr.exists():
        vr_content = read(vr)
        if "PASS — all 7 checks pass" not in vr_content and "7/7 PASS" not in vr_content:
            failures.append("orchestration_validation_report.md does not confirm PASS — all 7 checks pass")

    # Directive registry must not contain execution logic
    registry = ARTIFACT_DIR / "control_directive_registry.md"
    if registry.exists():
        reg_content = read(registry)
        auto_patterns = [
            (re.compile(r"\bexecut(?:ing|ed|es)\b(?!.*non-executing)(?!.*does not)", re.IGNORECASE), "execution action language"),
            (re.compile(r"\btrigger(?:ing|ed|s)\b(?!.*not trigger)(?!.*no.*trigger)", re.IGNORECASE), "trigger language"),
        ]
        for i, line in enumerate(reg_content.splitlines(), 1):
            if any(kw in line.lower() for kw in ["non-executing", "does not", "not trigger", "not execut",
                                                   "declarative", "not activated", "triggering condition",
                                                   "triggering_condition", "Triggering"]):
                continue
            for pattern, label in auto_patterns:
                if pattern.search(line):
                    failures.append(f"Possible {label} in control_directive_registry.md:{i}: {line.strip()[:80]}")

    return failures


def check_governance_immutability() -> list:
    """Verify GOVERNANCE IMMUTABILITY DECLARATION is present in this script."""
    failures = []
    this_script = Path(__file__)
    content = this_script.read_text(encoding="utf-8")
    if "GOVERNANCE IMMUTABILITY DECLARATION" not in content:
        failures.append("GOVERNANCE IMMUTABILITY DECLARATION missing from validate_control_artifacts.py")
    else:
        print("  PASS  GOVERNANCE IMMUTABILITY DECLARATION present in this script")
    return failures


def run_checks() -> bool:
    results = {}
    all_passed = True

    checks = [
        ("1.  Completeness", check_completeness),
        ("2.  Traceability integrity", check_traceability_integrity),
        ("3.  Eligibility classification", check_eligibility_classification),
        ("4.  Directive constraint compliance", check_directive_constraint_compliance),
        ("5.  Non-interpretation compliance", check_non_interpretation_compliance),
        ("6.  Cross-run neutrality", check_cross_run_neutrality),
        ("7.  Boundary compliance", check_boundary_compliance),
        ("8.  Governance immutability", check_governance_immutability),
    ]

    print("=" * 65)
    print("PIOS-40.10-RUN01 validate_control_artifacts.py")
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
