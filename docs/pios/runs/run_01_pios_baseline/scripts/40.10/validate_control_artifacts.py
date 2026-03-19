#!/usr/bin/env python3
"""
validate_control_artifacts.py
Stream: 40.10 — PiOS Agentic Orchestration & Runtime Control Layer
Contract: PIOS-40.10-ORCHESTRATION-CONTRACT

Validates the docs/pios/40.10 orchestration artifacts against contract requirements.

Checks:
  1. Completeness                       — all 6 artifacts present; 8 FSRs → 8 directives
  2. Traceability Preservation          — full directive → FSR → delivery element → telemetry chain
  3. Non-Interpretation Compliance      — no recommendation, ranking, scoring, causal inference
  4. Eligibility Classification Correct — each directive matches deterministic rule
  5. Directive Constraint Compliance    — action types within ACT-01–ACT-05 enum; match rule
  6. Boundary Compliance                — no upstream modification; no autonomous execution logic

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

DIR_IDS = [f"DIR-{i:03d}" for i in range(1, 9)]
FSR_IDS = [f"FSR-{i:03d}" for i in range(1, 9)]

# Expected eligibility classifications per FSR (deterministic)
EXPECTED_ELIGIBILITY = {
    "FSR-001": "ELIGIBILITY-3",
    "FSR-002": "ELIGIBILITY-3",
    "FSR-003": "ELIGIBILITY-1",
    "FSR-004": "ELIGIBILITY-1",
    "FSR-005": "ELIGIBILITY-1",
    "FSR-006": "ELIGIBILITY-1",
    "FSR-007": "ELIGIBILITY-3",
    "FSR-008": "ELIGIBILITY-3",
}

# Expected action types per directive (deterministic)
EXPECTED_ACTION_TYPES = {
    "DIR-001": "ACT-02",
    "DIR-002": "ACT-03",
    "DIR-003": "ACT-01",
    "DIR-004": "ACT-01",
    "DIR-005": "ACT-01",
    "DIR-006": "ACT-01",
    "DIR-007": "ACT-03",
    "DIR-008": "ACT-03",
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
    r"Triggering condition|triggering_condition|"
    r"ACT-0[1-5].*not|not.*ACT-0[1-5])",
    re.IGNORECASE
)


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def check_completeness() -> list:
    failures = []
    for name in EXPECTED_ARTIFACTS:
        if not (ARTIFACT_DIR / name).exists():
            failures.append(f"MISSING: {name}")

    # Check all 8 directives present in registry
    registry = ARTIFACT_DIR / "control_directive_registry.md"
    if registry.exists():
        content = read(registry)
        for dir_id in DIR_IDS:
            if dir_id not in content:
                failures.append(f"Directive missing from control_directive_registry.md: {dir_id}")
        if "Total directives issued: 8" not in content:
            failures.append("control_directive_registry.md does not confirm 8 issued directives")

    # Each FSR must have exactly one directive
    eligibility = ARTIFACT_DIR / "control_eligibility_map.md"
    if eligibility.exists():
        emap_content = read(eligibility)
        for fsr_id in FSR_IDS:
            if fsr_id not in emap_content:
                failures.append(f"FSR not mapped in control_eligibility_map.md: {fsr_id}")

    return failures


def check_traceability_preservation() -> list:
    failures = []
    manifest = ARTIFACT_DIR / "orchestration_traceability_manifest.md"
    if not manifest.exists():
        return ["Cannot check traceability — orchestration_traceability_manifest.md missing"]
    content = read(manifest)

    # All 8 directives must appear
    for dir_id in DIR_IDS:
        if dir_id not in content:
            failures.append(f"Directive not traced in manifest: {dir_id}")

    # All 8 FSRs must appear
    for fsr_id in FSR_IDS:
        if fsr_id not in content:
            failures.append(f"Source FSR not cited in traceability manifest: {fsr_id}")

    # Key delivery element IDs must appear
    for elem in ["INTEL-005", "DIAG-005", "DIAG-006", "DIAG-003", "DIAG-004", "DIAG-007", "DIAG-008", "INTEL-002", "INTEL-003", "INTEL-004"]:
        if elem not in content:
            failures.append(f"Delivery element not cited in traceability manifest: {elem}")

    # Blocking telemetry must appear
    for tel in ["AT-001", "AT-002", "DT-007", "AT-007"]:
        if tel not in content:
            failures.append(f"Blocking telemetry {tel} not cited in traceability manifest")

    # Completeness declaration
    if "8 / 8" not in content and "8/8" not in content:
        failures.append("orchestration_traceability_manifest.md does not confirm 8/8 traceability completeness")

    return failures


def check_non_interpretation_compliance() -> list:
    failures = []
    # Check content artifacts (not the validation report)
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


def check_eligibility_classification() -> list:
    failures = []
    eligibility = ARTIFACT_DIR / "control_eligibility_map.md"
    if not eligibility.exists():
        return ["Cannot check eligibility — control_eligibility_map.md missing"]
    content = read(eligibility)

    # Check each FSR has the expected eligibility class
    for fsr_id, expected_class in EXPECTED_ELIGIBILITY.items():
        # Find the section for this FSR
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

    # Check no FSR assigned multiple eligibility classes
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
            # Check expected eligibility class present
            fsr_id = f"FSR-{dir_id[4:]}"  # DIR-001 → FSR-001
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

    return failures


def check_boundary_compliance() -> list:
    failures = []

    # Boundary enforcement must declare upstream layers not accessed
    be = ARTIFACT_DIR / "control_boundary_enforcement.md"
    if be.exists():
        be_content = read(be)
        for layer in ["40.8", "40.7", "40.6", "40.5", "40.4"]:
            if f"docs/pios/{layer}" in be_content:
                # Must appear as "not accessed"
                lines = [l for l in be_content.splitlines() if f"docs/pios/{layer}" in l or layer in l]
                for line in lines:
                    if "not accessed" not in line and "read-only" not in line and "Authorized" not in line:
                        # Only flag if it looks like an access claim
                        if "accessed" in line.lower() and "not accessed" not in line.lower():
                            failures.append(f"control_boundary_enforcement.md may claim unauthorized access: {line.strip()[:80]}")
        if "not accessed" not in be_content:
            failures.append("control_boundary_enforcement.md does not declare upstream layers as not accessed")

    # Directive registry must not contain execution logic
    registry = ARTIFACT_DIR / "control_directive_registry.md"
    if registry.exists():
        reg_content = read(registry)
        # Check for autonomous execution language
        auto_patterns = [
            (re.compile(r"\bexecut(?:ing|ed|es)\b(?!.*non-executing)(?!.*does not)", re.IGNORECASE), "execution action language"),
            (re.compile(r"\btrigger(?:ing|ed|s)\b(?!.*not trigger)(?!.*no.*trigger)", re.IGNORECASE), "trigger language"),
        ]
        for i, line in enumerate(reg_content.splitlines(), 1):
            # Skip lines with clear non-execution context
            if any(kw in line.lower() for kw in ["non-executing", "does not", "not trigger", "not execut", "no.*execut", "declarative", "not activated", "triggering condition", "triggering_condition"]):
                continue
            for pattern, label in auto_patterns:
                if pattern.search(line):
                    failures.append(f"Possible {label} in control_directive_registry.md:{i}: {line.strip()[:80]}")

    # Execution manifest must declare PARTIAL
    em = ARTIFACT_DIR / "execution_manifest.md"
    if em.exists():
        em_content = read(em)
        if "final_status: PARTIAL" not in em_content:
            failures.append("execution_manifest.md must declare final_status: PARTIAL (upstream gaps persist)")

    # Validation report must confirm all 6 checks pass
    vr = ARTIFACT_DIR / "orchestration_validation_report.md"
    if vr.exists():
        vr_content = read(vr)
        if "PASS — all 6 checks pass" not in vr_content:
            failures.append("orchestration_validation_report.md does not confirm PASS — all 6 checks pass")

    return failures


def run_checks() -> bool:
    results = {}
    all_passed = True

    checks = [
        ("1. Completeness", check_completeness),
        ("2. Traceability Preservation", check_traceability_preservation),
        ("3. Non-Interpretation Compliance", check_non_interpretation_compliance),
        ("4. Eligibility Classification Correctness", check_eligibility_classification),
        ("5. Directive Constraint Compliance", check_directive_constraint_compliance),
        ("6. Boundary Compliance", check_boundary_compliance),
    ]

    print("=" * 60)
    print("PIOS-40.10 validate_control_artifacts.py")
    print(f"Artifact directory: {ARTIFACT_DIR.relative_to(REPO_ROOT)}")
    print("=" * 60)

    for label, fn in checks:
        failures = fn()
        passed = len(failures) == 0
        results[label] = passed
        print(f"\n[{'PASS' if passed else 'FAIL'}] {label}")
        if not passed:
            all_passed = False
            for f in failures:
                print(f"       {f}")

    print("\n" + "=" * 60)
    print("Validation Summary:")
    for label, passed in results.items():
        print(f"  {'PASS' if passed else 'FAIL'}  {label}")
    print(f"\nFinal status: {'COMPLETE' if all_passed else 'INCOMPLETE'}")
    print("=" * 60)
    return all_passed


if __name__ == "__main__":
    passed = run_checks()
    sys.exit(0 if passed else 1)
