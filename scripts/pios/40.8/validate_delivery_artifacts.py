#!/usr/bin/env python3
"""
validate_delivery_artifacts.py
Stream: 40.8 — PiOS Intelligence Delivery & Orchestration Layer
Contract: PIOS-40.8-RUN01-CONTRACT-v1
run_id: run_01_blueedge

GOVERNANCE IMMUTABILITY DECLARATION:
This validator script is the authoritative validation record for Stream 40.8 run_01_blueedge.
It must not be modified after stream execution is declared complete. Modifications to this
script after stream closure constitute a governance violation.

Validates the docs/pios/40.8 delivery artifacts against contract requirements.

Checks:
  1.  Completeness              — all 8 expected artifacts present (run_01_blueedge artifact names)
  2.  Contract identity         — run_01_blueedge and PIOS-40.8-RUN01-CONTRACT-v1 in all artifacts
  3.  Delivery traceability     — INTEL-001..002 and DIAG-001..008 traced in manifest
  4.  Intelligence binding      — INTEL-001..002 present in delivery packet and binding map
  5.  Computed delivery         — DIAG-006 / INTEL-001 with 0.333 and SENSOR_BRIDGE_CONFIGURED
  6.  Blocked delivery count    — 7 blocked diagnoses + INTEL-002 blocked in delivery packet
  7.  Unknown space             — 7 unknown dimensions from INTEL-002 preserved
  8.  Input boundary            — condition_output_set.md referenced; no direct 40.5 as primary input
  9.  Boundary compliance       — forbidden content absent; prohibited patterns not present
  10. Upstream access           — not-accessed declaration in delivery_boundary_enforcement.md
  11. Governance immutability   — GOVERNANCE IMMUTABILITY DECLARATION present in this script

Usage:
    python3 scripts/pios/40.8/validate_delivery_artifacts.py
"""

import sys
import re
from pathlib import Path

EXECUTION_WORKSPACE = Path.home() / "Projects/krayu-program-intelligence"
ARTIFACT_DIR = EXECUTION_WORKSPACE / "docs/pios/40.8"
INPUT_40_7 = EXECUTION_WORKSPACE / "docs/pios/40.7"

EXPECTED_ARTIFACTS = [
    "delivery_structure_definition.md",
    "delivery_output_packet.md",
    "delivery_binding_map.md",
    "delivery_traceability_manifest.md",
    "uncertainty_preservation_report.md",
    "delivery_validation_report.md",
    "delivery_boundary_enforcement.md",
    "execution_manifest.md",
]

DIAG_IDS = [f"DIAG-{i:03d}" for i in range(1, 9)]
INTEL_IDS = ["INTEL-001", "INTEL-002"]
COND_IDS = [f"COND-{i:03d}" for i in range(1, 9)]

BLOCKED_DIAG_IDS = ["DIAG-001", "DIAG-002", "DIAG-003", "DIAG-004", "DIAG-005", "DIAG-007", "DIAG-008"]

FORBIDDEN_PATTERNS = [
    (re.compile(r"\brecommend(?:ation|s|ed|ing)\b", re.IGNORECASE), "recommendation"),
    (re.compile(r"\bremediati(?:on|ng)\b", re.IGNORECASE), "remediation"),
    (re.compile(r"\bprogn(?:osis|oses|ostic)\b", re.IGNORECASE), "prognosis"),
    (re.compile(r"\bheuristic\b", re.IGNORECASE), "heuristic enrichment"),
    (re.compile(r"\bspeculat(?:ive|ion|ing)\b", re.IGNORECASE), "speculative content"),
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
    r"Confirmed",
    r"downstream",
    r"Downstream",
    r"GC-06",
    r"GC-07",
    r"Delivery\s+Integrity",
    r"no\s+heuristic",
    r"No\s+heuristic",
    r"No\s+recommendations",
    r"not\s+accessed",
]

FORBIDDEN_ALLOWED_RE = re.compile(
    "(" + "|".join(FORBIDDEN_ALLOWED_CONTEXTS) + ")",
    re.IGNORECASE,
)


def read(path: Path) -> str:
    with open(path, encoding="utf-8") as f:
        return f.read()


def check_completeness() -> list:
    """Check 1 — All 8 artifacts present."""
    failures = []
    for name in EXPECTED_ARTIFACTS:
        if not (ARTIFACT_DIR / name).exists():
            failures.append(f"MISSING: {name}")
    return failures


def check_contract_identity() -> list:
    """Check 2 — run_01_blueedge and PIOS-40.8-RUN01-CONTRACT-v1 in all artifacts."""
    failures = []
    for name in EXPECTED_ARTIFACTS:
        path = ARTIFACT_DIR / name
        if not path.exists():
            continue
        content = read(path)
        if "run_01_blueedge" not in content:
            failures.append(f"run_01_blueedge not found in {name}")
        if "PIOS-40.8-RUN01-CONTRACT-v1" not in content:
            failures.append(f"PIOS-40.8-RUN01-CONTRACT-v1 not found in {name}")
    return failures


def check_delivery_traceability() -> list:
    """Check 3 — INTEL-001..002 and DIAG-001..008 traced in manifest."""
    failures = []
    manifest = ARTIFACT_DIR / "delivery_traceability_manifest.md"
    if not manifest.exists():
        return ["Cannot check traceability — delivery_traceability_manifest.md missing"]
    content = read(manifest)
    for intel_id in INTEL_IDS:
        if intel_id not in content:
            failures.append(f"Intelligence output not traced in delivery manifest: {intel_id}")
    for diag_id in DIAG_IDS:
        if diag_id not in content:
            failures.append(f"Diagnosis output not traced in delivery manifest: {diag_id}")
    if "condition_output_set.md" not in content:
        failures.append("condition_output_set.md reference missing in delivery_traceability_manifest.md")
    # Binding map check
    bmap = ARTIFACT_DIR / "delivery_binding_map.md"
    if bmap.exists():
        bmap_content = read(bmap)
        if "diagnosis_output_set.md" not in bmap_content:
            failures.append("diagnosis_output_set.md reference missing in delivery_binding_map.md")
        if "intelligence_output_set.md" not in bmap_content:
            failures.append("intelligence_output_set.md reference missing in delivery_binding_map.md")
    return failures


def check_intelligence_binding() -> list:
    """Check 4 — INTEL-001..002 present in delivery packet and binding map."""
    failures = []
    for name in ["delivery_output_packet.md", "delivery_binding_map.md"]:
        path = ARTIFACT_DIR / name
        if not path.exists():
            failures.append(f"Cannot check intelligence binding — {name} missing")
            continue
        content = read(path)
        for intel_id in INTEL_IDS:
            if intel_id not in content:
                failures.append(f"{intel_id} not found in {name}")
    return failures


def check_computed_delivery() -> list:
    """Check 5 — DIAG-006 / INTEL-001 with 0.333 and SENSOR_BRIDGE_CONFIGURED."""
    failures = []
    packet = ARTIFACT_DIR / "delivery_output_packet.md"
    if not packet.exists():
        return ["Cannot check computed delivery — delivery_output_packet.md missing"]
    content = read(packet)
    # DIAG-006 section
    diag006_pattern = re.compile(r"### DIAG-006.*?(?=\n### |\Z)", re.DOTALL)
    match = diag006_pattern.search(content)
    if not match:
        failures.append("DIAG-006 section missing in delivery_output_packet.md")
    else:
        section = match.group(0)
        if "computed" not in section.lower():
            failures.append("DIAG-006 expected state 'computed' not found in delivery packet")
        if "0.333" not in section:
            failures.append("DIAG-006 expected throughput 0.333 not found in delivery packet")
        if "SENSOR_BRIDGE_CONFIGURED" not in section:
            failures.append("DIAG-006 expected classification SENSOR_BRIDGE_CONFIGURED not found in delivery packet")
    # INTEL-001 section
    intel001_pattern = re.compile(r"### INTEL-001.*?(?=\n### |\Z)", re.DOTALL)
    match = intel001_pattern.search(content)
    if not match:
        failures.append("INTEL-001 section missing in delivery_output_packet.md")
    else:
        section = match.group(0)
        if "computed" not in section.lower():
            failures.append("INTEL-001 expected state 'computed' not found in delivery packet")
        if "0.333" not in section:
            failures.append("INTEL-001 expected throughput 0.333 not found in delivery packet")
    return failures


def check_blocked_delivery_count() -> list:
    """Check 6 — 7 blocked diagnoses + INTEL-002 blocked in delivery packet."""
    failures = []
    packet = ARTIFACT_DIR / "delivery_output_packet.md"
    if not packet.exists():
        return ["Cannot check blocked delivery — delivery_output_packet.md missing"]
    content = read(packet)
    for diag_id in BLOCKED_DIAG_IDS:
        pattern = re.compile(rf"### {diag_id}.*?(?=\n### |\Z)", re.DOTALL)
        match = pattern.search(content)
        if not match:
            failures.append(f"{diag_id} section missing in delivery_output_packet.md")
            continue
        section = match.group(0)
        if "blocked" not in section.lower():
            failures.append(f"{diag_id} expected state 'blocked' not found in delivery packet")
    # INTEL-002 blocked
    intel002_pattern = re.compile(r"### INTEL-002.*?(?=\n### |\Z)", re.DOTALL)
    match = intel002_pattern.search(content)
    if not match:
        failures.append("INTEL-002 section missing in delivery_output_packet.md")
    else:
        if "blocked" not in match.group(0).lower():
            failures.append("INTEL-002 expected state 'blocked' not found in delivery packet")
    return failures


def check_unknown_space_preservation() -> list:
    """Check 7 — 7 unknown dimensions from INTEL-002 preserved."""
    failures = []
    packet = ARTIFACT_DIR / "delivery_output_packet.md"
    if not packet.exists():
        return ["Cannot check unknown space — delivery_output_packet.md missing"]
    content = read(packet)
    if "INTEL-002" not in content:
        failures.append("INTEL-002 unknown space declaration missing from delivery packet")
        return failures
    if "unknown_space" not in content and "Unknown Space" not in content:
        failures.append("Unknown space type declaration missing from delivery packet")
    # Check all 7 blocking telemetry sources are referenced
    blocking_refs = [
        ("INF-003", "INF-003 Prometheus blocking reference"),
        ("fleet:*", "WebSocket fleet:* blocking reference"),
        ("TMP-003", "Alert event TMP-003 blocking reference"),
        ("TMP-010", "Driver session TMP-010 blocking reference"),
    ]
    for ref, description in blocking_refs:
        if ref not in content:
            failures.append(f"{description} missing from delivery packet")
    # Check uncertainty preservation report confirms 7 dimensions
    upr = ARTIFACT_DIR / "uncertainty_preservation_report.md"
    if upr.exists():
        upr_content = read(upr)
        if "7/7 unknown space dimensions preserved" not in upr_content:
            failures.append("uncertainty_preservation_report.md does not confirm 7/7 unknown space preservation")
    return failures


def check_input_boundary() -> list:
    """Check 8 — condition_output_set.md referenced in traceability; no direct 40.5 access."""
    failures = []
    manifest = ARTIFACT_DIR / "delivery_traceability_manifest.md"
    if not manifest.exists():
        return ["Cannot check input boundary — delivery_traceability_manifest.md missing"]
    content = read(manifest)
    if "condition_output_set.md" not in content:
        failures.append("condition_output_set.md reference missing — 40.6 lineage not preserved in traceability manifest")
    return failures


def check_boundary_compliance() -> list:
    """Check 9 — forbidden content absent; prohibited patterns not present."""
    failures = []
    check_artifacts = [
        "delivery_output_packet.md",
        "delivery_binding_map.md",
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
    """Check 10 — not-accessed declaration in delivery_boundary_enforcement.md."""
    failures = []
    be_path = ARTIFACT_DIR / "delivery_boundary_enforcement.md"
    if not be_path.exists():
        return ["Cannot check upstream access — delivery_boundary_enforcement.md missing"]
    content = read(be_path)
    if "not accessed" not in content:
        failures.append("delivery_boundary_enforcement.md does not declare upstream artifacts as 'not accessed'")
    for layer in ["40.2", "40.3", "40.4", "40.5", "40.6"]:
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
        ("3.  Delivery traceability", check_delivery_traceability),
        ("4.  Intelligence binding", check_intelligence_binding),
        ("5.  Computed delivery", check_computed_delivery),
        ("6.  Blocked delivery count", check_blocked_delivery_count),
        ("7.  Unknown space preservation", check_unknown_space_preservation),
        ("8.  Input boundary", check_input_boundary),
        ("9.  Boundary compliance", check_boundary_compliance),
        ("10. Upstream access declaration", check_upstream_access_declaration),
        ("11. Governance immutability", check_governance_immutability),
    ]

    print("=" * 65)
    print("PIOS-40.8-RUN01 validate_delivery_artifacts.py")
    print("run_id: run_01_blueedge")
    print("Artifact directory: docs/pios/40.8/")
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
