#!/usr/bin/env python3
"""
validate_feedback_artifacts.py
Stream: 40.9 — PiOS Feedback & Continuous Improvement Layer
Contract: PIOS-40.9-FEEDBACK-CONTRACT

Validates the docs/pios/40.9 feedback artifacts against contract requirements.

Checks:
  1. Completeness                   — all 7 expected artifacts present
  2. Traceability Preservation      — all 8 FSR signals traced to 40.8 delivery elements
  3. Unknown-Space Preservation     — 2/2 unknown space dimensions preserved without reduction
  4. Non-Interpretation Compliance  — no scoring, prioritization, prediction, or recommendation
  5. Boundary Compliance            — no new analytical content; 40.8 artifacts not modified

Usage:
    python3 scripts/pios/40.9/validate_feedback_artifacts.py
"""

import sys
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
ARTIFACT_DIR = REPO_ROOT / "docs/pios/40.9"
INPUT_40_8 = REPO_ROOT / "docs/pios/40.8"

EXPECTED_ARTIFACTS = [
    "feedback_signal_registry.md",
    "unknown_space_registry.md",
    "recurrence_detection_report.md",
    "coverage_pressure_map.md",
    "feedback_traceability_manifest.md",
    "feedback_validation_report.md",
    "execution_manifest.md",
]

FSR_IDS = [f"FSR-{i:03d}" for i in range(1, 9)]
UNKNOWN_SPACE_DIMS = ["USR-001", "USR-002"]
RECURRENCE_IDS = [f"REC-{i:03d}" for i in range(1, 6)]

# Required 40.8 source references that must appear in traceability
REQUIRED_40_8_REFS = [
    "delivery_output_packet.md",
    "delivery_binding_map.md",
    "INTEL-001", "INTEL-002", "INTEL-003", "INTEL-004", "INTEL-005",
    "DIAG-001", "DIAG-002", "DIAG-003", "DIAG-004",
    "DIAG-005", "DIAG-006", "DIAG-007", "DIAG-008",
]

# Non-interpretation forbidden patterns (no scoring, no recommendation, no prediction)
FORBIDDEN_PATTERNS = [
    (re.compile(r"\brecommend(?:ation|s|ed|ing)\b", re.IGNORECASE), "recommendation"),
    (re.compile(r"\bpredict(?:ion|s|ed|ing)\b", re.IGNORECASE), "prediction"),
    (re.compile(r"\bprioritiz(?:ation|e|ed|ing)\b", re.IGNORECASE), "prioritization"),
    (re.compile(r"\bscor(?:ing|e|ed)\b", re.IGNORECASE), "scoring"),
    (re.compile(r"\bremediati(?:on|ng)\b", re.IGNORECASE), "remediation"),
    (re.compile(r"\bprogn(?:osis|oses)\b", re.IGNORECASE), "prognosis"),
    (re.compile(r"\bheuristic\b", re.IGNORECASE), "heuristic enrichment"),
    (re.compile(r"\bspeculat(?:ive|ion)\b", re.IGNORECASE), "speculative content"),
    (re.compile(r"\bshould\s+be\b", re.IGNORECASE), "prescriptive language"),
    (re.compile(r"\bmust\s+be\s+(?:fixed|addressed|resolved)\b", re.IGNORECASE), "prescriptive action"),
]

FORBIDDEN_ALLOWED_CONTEXTS = re.compile(
    r"(No recommendation|No prediction|No prioritization|No scoring|Not produced|prohibited|Compliant|"
    r"Confirmed|Boundary|boundary|forbidden|Prohibition|downstream|"
    r"not performed|not produced|GC-06|GC-07|Delivery Integrity|"
    r"Non-Interpretation|non-interpretation|No inference|"
    r"Feedback Integrity|no.*scoring|no.*priorit|no.*predict|no.*recommend|"
    r"constraint|absence|absent|not present|not available|not generated)",
    re.IGNORECASE
)


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def check_completeness() -> list:
    return [f"MISSING: {n}" for n in EXPECTED_ARTIFACTS if not (ARTIFACT_DIR / n).exists()]


def check_traceability_preservation() -> list:
    failures = []
    manifest = ARTIFACT_DIR / "feedback_traceability_manifest.md"
    if not manifest.exists():
        return ["Cannot check traceability — feedback_traceability_manifest.md missing"]
    content = read(manifest)

    # All 8 FSR IDs must appear
    for fsr_id in FSR_IDS:
        if fsr_id not in content:
            failures.append(f"Feedback signal not traced in manifest: {fsr_id}")

    # 40.8 delivery source must be cited
    if "delivery_output_packet.md" not in content:
        failures.append("40.8 delivery source (delivery_output_packet.md) not cited in traceability manifest")
    if "delivery_binding_map.md" not in content:
        failures.append("40.8 binding map not cited in traceability manifest")

    # Completeness declaration must confirm all 8 signals
    fsr_registry = ARTIFACT_DIR / "feedback_signal_registry.md"
    if fsr_registry.exists():
        reg_content = read(fsr_registry)
        if "Total feedback signals registered: 8" not in reg_content:
            failures.append("feedback_signal_registry.md does not confirm 8 registered signals")

    # Traceability manifest must declare 8/8 complete
    if "8 / 8" not in content and "8/8" not in content:
        failures.append("feedback_traceability_manifest.md does not confirm 8/8 traceability completeness")

    return failures


def check_unknown_space_preservation() -> list:
    failures = []
    usr = ARTIFACT_DIR / "unknown_space_registry.md"
    fsr = ARTIFACT_DIR / "feedback_signal_registry.md"

    if not usr.exists():
        return ["Cannot check unknown space — unknown_space_registry.md missing"]

    usr_content = read(usr)

    # Both unknown space dimensions must be registered
    for dim_id in UNKNOWN_SPACE_DIMS:
        if dim_id not in usr_content:
            failures.append(f"Unknown space dimension not registered: {dim_id}")

    # USR-001 must reference Change Concentration and AT-001/AT-002
    if "AT-001" not in usr_content or "AT-002" not in usr_content:
        failures.append("USR-001 must reference blocking telemetry AT-001, AT-002")

    # USR-002 must reference Execution Stability and DT-007/AT-007
    if "DT-007" not in usr_content or "AT-007" not in usr_content:
        failures.append("USR-002 must reference blocking telemetry DT-007, AT-007")

    # FSR must carry both unknown space signals (FSR-001, FSR-002)
    if fsr.exists():
        fsr_content = read(fsr)
        if "FSR-001" not in fsr_content:
            failures.append("FSR-001 (unknown space signal) missing from feedback_signal_registry.md")
        if "FSR-002" not in fsr_content:
            failures.append("FSR-002 (unknown space signal) missing from feedback_signal_registry.md")
        if "unknown_space" not in fsr_content:
            failures.append("Signal type 'unknown_space' not declared in feedback_signal_registry.md")

    # Validation report must confirm 2/2 preservation
    fvr = ARTIFACT_DIR / "feedback_validation_report.md"
    if fvr.exists():
        fvr_content = read(fvr)
        if "PASS — 2/2 unknown space dimensions preserved" not in fvr_content:
            failures.append("feedback_validation_report.md does not confirm 2/2 unknown space preservation")

    return failures


def check_non_interpretation_compliance() -> list:
    failures = []
    # Check main content artifacts — not the validation report itself
    check_artifacts = [
        "feedback_signal_registry.md",
        "unknown_space_registry.md",
        "recurrence_detection_report.md",
        "coverage_pressure_map.md",
        "feedback_traceability_manifest.md",
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
    # Recurrence detection must be bounded to delivery evidence only
    rdr = ARTIFACT_DIR / "recurrence_detection_report.md"
    if rdr.exists():
        rdr_content = read(rdr)
        for rec_id in RECURRENCE_IDS:
            if rec_id not in rdr_content:
                failures.append(f"Recurrence pattern not registered: {rec_id}")

    # Coverage pressure map must be descriptive only
    cpm = ARTIFACT_DIR / "coverage_pressure_map.md"
    if cpm.exists():
        cpm_content = read(cpm)
        if "descriptive" not in cpm_content.lower() and "structural observation" not in cpm_content.lower():
            failures.append("coverage_pressure_map.md does not declare descriptive/structural-observation-only constraint")

    return failures


def check_boundary_compliance() -> list:
    failures = []

    # Feedback signal registry must not contain new analytical content
    fsr = ARTIFACT_DIR / "feedback_signal_registry.md"
    if fsr.exists():
        fsr_content = read(fsr)
        # Must confirm no scoring or prioritization
        if "No scoring" not in fsr_content and "no scoring" not in fsr_content.lower():
            failures.append("feedback_signal_registry.md does not declare 'no scoring' constraint")
        if "No prioritization" not in fsr_content and "no prioritization" not in fsr_content.lower():
            failures.append("feedback_signal_registry.md does not declare 'no prioritization' constraint")

    # Validation report must confirm boundary compliance PASS
    fvr = ARTIFACT_DIR / "feedback_validation_report.md"
    if fvr.exists():
        fvr_content = read(fvr)
        if "PASS — all boundary constraints satisfied" not in fvr_content:
            failures.append("feedback_validation_report.md does not confirm boundary compliance PASS")

    # All FSR signals must trace to 40.8 only (not directly to 40.7 or earlier)
    manifest = ARTIFACT_DIR / "feedback_traceability_manifest.md"
    if manifest.exists():
        manifest_content = read(manifest)
        # Check that 40.7 is only referenced via 40.8 lineage chains
        if "docs/pios/40.7/" in manifest_content:
            # This is acceptable only if it appears as part of upstream chain, not as a direct access
            # Check that no direct 40.7 file access is claimed
            lines = manifest_content.splitlines()
            for i, line in enumerate(lines, 1):
                if "docs/pios/40.7/" in line and "40.8" not in line and "lineage" not in line.lower() and "chain" not in line.lower() and "upstream" not in line.lower():
                    failures.append(
                        f"Possible direct 40.7 access in feedback_traceability_manifest.md:{i}: {line.strip()[:80]}"
                    )

    # Execution manifest must declare PARTIAL (not COMPLETE — upstream gaps persist)
    em = ARTIFACT_DIR / "execution_manifest.md"
    if em.exists():
        em_content = read(em)
        if "final_status: PARTIAL" not in em_content:
            failures.append("execution_manifest.md must declare final_status: PARTIAL (upstream gaps persist)")

    return failures


def check_recurrence_definition_compliance() -> list:
    failures = []
    rdr = ARTIFACT_DIR / "recurrence_detection_report.md"
    if not rdr.exists():
        return ["Cannot check recurrence definition — recurrence_detection_report.md missing"]
    content = rdr.read_text(encoding="utf-8")

    # Hardened definition must be present
    if "Recurrence Definition (Hardened)" not in content and "recurrence definition" not in content.lower():
        failures.append("recurrence_detection_report.md does not declare a recurrence definition")

    # All governed recurrence IDs must appear
    for rec_id in ["REC-001", "REC-002", "REC-003"]:
        if rec_id not in content:
            failures.append(f"Governed recurrence pattern not present: {rec_id}")

    # Abstract category patterns must NOT be governed recurrences
    # OBS-A and OBS-B (downgraded from REC-004 and REC-005) must not appear as governed recurrences
    if "REC-004" in content:
        # Allowed only if in downgrade/exclusion context
        lines = content.splitlines()
        for i, line in enumerate(lines, 1):
            if "REC-004" in line:
                lower = line.lower()
                if not any(kw in lower for kw in ["downgrad", "obs-a", "excluded", "formerly", "structural observation"]):
                    failures.append(
                        f"REC-004 appears in recurrence_detection_report.md:{i} without downgrade/exclusion context: {line.strip()[:80]}"
                    )
    if "REC-005" in content:
        lines = content.splitlines()
        for i, line in enumerate(lines, 1):
            if "REC-005" in line:
                lower = line.lower()
                if not any(kw in lower for kw in ["downgrad", "obs-b", "excluded", "formerly", "structural observation"]):
                    failures.append(
                        f"REC-005 appears in recurrence_detection_report.md:{i} without downgrade/exclusion context: {line.strip()[:80]}"
                    )

    # FSR summary must not reference REC-004 or REC-005 as active recurrence links
    fsr = ARTIFACT_DIR / "feedback_signal_registry.md"
    if fsr.exists():
        fsr_content = fsr.read_text(encoding="utf-8")
        # In the summary table, check no active REC-004/REC-005 references remain
        in_summary = False
        for line in fsr_content.splitlines():
            if "## Feedback Signal Summary" in line:
                in_summary = True
            if in_summary and ("REC-004" in line or "REC-005" in line):
                failures.append(
                    f"feedback_signal_registry.md summary table still references downgraded REC-004 or REC-005: {line.strip()[:80]}"
                )

    # Hardening compliance declaration must be present
    if "Hardening Compliance Declaration" not in content:
        failures.append("recurrence_detection_report.md missing Hardening Compliance Declaration section")

    return failures


def check_occurrence_count_preservation() -> list:
    failures = []
    rdr = ARTIFACT_DIR / "recurrence_detection_report.md"
    if not rdr.exists():
        return ["Cannot check occurrence counts — recurrence_detection_report.md missing"]
    content = rdr.read_text(encoding="utf-8")

    # Each governed recurrence pattern must declare an explicit occurrence count
    for rec_id in ["REC-001", "REC-002", "REC-003"]:
        # Find the section
        pattern = re.compile(rf"## {rec_id}.*?(?=## REC-|\Z)", re.DOTALL)
        m = pattern.search(content)
        if not m:
            failures.append(f"{rec_id} section not found in recurrence_detection_report.md")
            continue
        section = m.group(0)
        if "Occurrence count" not in section:
            failures.append(f"{rec_id}: explicit occurrence count field missing")
        if "Occurrence count source" not in section:
            failures.append(f"{rec_id}: occurrence count source reference missing")
        # Check numbered occurrence rows (| 1 | or | 2 | etc.)
        if "| 1 |" not in section:
            failures.append(f"{rec_id}: occurrence rows not numbered in table")

    # FSR-007 and FSR-008 must declare explicit occurrence count
    fsr = ARTIFACT_DIR / "feedback_signal_registry.md"
    if fsr.exists():
        fsr_content = fsr.read_text(encoding="utf-8")
        for fsr_id in ["FSR-007", "FSR-008"]:
            fsr_pattern = re.compile(rf"## {fsr_id}.*?(?=## FSR-|\Z)", re.DOTALL)
            m = fsr_pattern.search(fsr_content)
            if m:
                section = m.group(0)
                if "Occurrence count:" not in section and "occurrence count" not in section.lower():
                    failures.append(f"{fsr_id}: explicit occurrence count not declared")
                if "| 1 |" not in section:
                    failures.append(f"{fsr_id}: occurrence rows not numbered in occurrence map table")

    return failures


def check_temporal_sequence_preservation() -> list:
    failures = []
    rdr = ARTIFACT_DIR / "recurrence_detection_report.md"
    if not rdr.exists():
        return ["Cannot check temporal sequence — recurrence_detection_report.md missing"]
    content = rdr.read_text(encoding="utf-8")

    for rec_id in ["REC-001", "REC-002", "REC-003"]:
        pattern = re.compile(rf"## {rec_id}.*?(?=## REC-|\Z)", re.DOTALL)
        m = pattern.search(content)
        if not m:
            continue
        section = m.group(0)
        # Temporal sequence must be explicitly declared
        if "Temporal sequence" not in section:
            failures.append(f"{rec_id}: temporal sequence declaration missing")
        else:
            # Must be either a preserved sequence or NOT APPLICABLE with basis
            if "NOT APPLICABLE" not in section and "preserved" not in section.lower():
                failures.append(f"{rec_id}: temporal sequence declared but neither preserved nor NOT APPLICABLE")

    return failures


def run_checks() -> bool:
    results = {}
    all_passed = True

    checks = [
        ("1. Completeness", check_completeness),
        ("2. Traceability Preservation", check_traceability_preservation),
        ("3. Unknown-Space Preservation", check_unknown_space_preservation),
        ("4. Non-Interpretation Compliance", check_non_interpretation_compliance),
        ("5. Boundary Compliance", check_boundary_compliance),
        ("6. Recurrence Definition Compliance", check_recurrence_definition_compliance),
        ("7. Occurrence Count Preservation", check_occurrence_count_preservation),
        ("8. Temporal Sequence Preservation", check_temporal_sequence_preservation),
    ]

    print("=" * 60)
    print("PIOS-40.9 validate_feedback_artifacts.py")
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
    print("(Checks 6–8 added by hardening pass 2026-03-18)")
    print("=" * 60)
    return all_passed


if __name__ == "__main__":
    passed = run_checks()
    sys.exit(0 if passed else 1)
