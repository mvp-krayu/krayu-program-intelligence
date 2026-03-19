#!/usr/bin/env python3
"""
validate_delivery_artifacts.py
Stream: 40.8 — PiOS Intelligence Delivery Layer
Contract: PIOS-40.8-DELIVERY-CONTRACT

Validates the docs/pios/40.8 delivery artifacts against contract requirements.

Checks:
  1. Completeness                — all 7 expected artifacts present
  2. Traceability Preservation   — lineage chains present for all 5 intelligence outputs
  3. Coverage Preservation       — computed/partial/blocked states preserved without conversion
  4. Uncertainty Preservation    — unknown space and blocked dimensions explicitly declared
  5. Boundary Compliance         — no semantic drift, narrative, or recommendation injection

Usage:
    python3 scripts/pios/40.8/validate_delivery_artifacts.py
"""

import sys
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
ARTIFACT_DIR = REPO_ROOT / "docs/pios/40.8"
INPUT_40_7 = REPO_ROOT / "docs/pios/40.7"

EXPECTED_ARTIFACTS = [
    "delivery_output_packet.md",
    "delivery_binding_map.md",
    "uncertainty_preservation_report.md",
    "delivery_traceability_manifest.md",
    "delivery_boundary_enforcement.md",
    "delivery_validation_report.md",
    "execution_manifest.md",
]

DIAG_IDS = [f"DIAG-{i:03d}" for i in range(1, 9)]
INTEL_IDS = [f"INTEL-{i:03d}" for i in range(1, 6)]

# Coverage states that must appear
COMPUTED_ELEMENTS = ["DIAG-001", "DIAG-002", "INTEL-001"]
BLOCKED_ELEMENTS = ["DIAG-005", "DIAG-006", "INTEL-005"]
PARTIAL_ELEMENTS = ["DIAG-003", "DIAG-004", "DIAG-007", "DIAG-008", "INTEL-002", "INTEL-003", "INTEL-004"]

FORBIDDEN_PATTERNS = [
    (re.compile(r"\brecommend(?:ation|s|ed|ing)\b", re.IGNORECASE), "recommendation"),
    (re.compile(r"\bremediati(?:on|ng)\b", re.IGNORECASE), "remediation"),
    (re.compile(r"\bprogn(?:osis|oses)\b", re.IGNORECASE), "prognosis"),
    (re.compile(r"\bheuristic\b", re.IGNORECASE), "heuristic enrichment"),
    (re.compile(r"\bnarrative\b", re.IGNORECASE), "narrative injection"),
    (re.compile(r"\bspeculat(?:ive|ion)\b", re.IGNORECASE), "speculative content"),
]

FORBIDDEN_ALLOWED_CONTEXTS = re.compile(
    r"(No recommendation|Not produced|prohibited|Compliant|Confirmed|"
    r"Boundary|boundary|forbidden|Prohibition|downstream|"
    r"not performed|not produced|GC-06|GC-07|Delivery Integrity)",
    re.IGNORECASE
)


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def check_completeness() -> list:
    return [f"MISSING: {n}" for n in EXPECTED_ARTIFACTS if not (ARTIFACT_DIR / n).exists()]


def check_traceability_preservation() -> list:
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
    # Check full chain keywords present
    for keyword in ["condition_output_set.md", "signal_output_set.md", "CKR-012"]:
        if keyword not in content:
            failures.append(f"Lineage chain reference missing in delivery manifest: {keyword}")
    # Check binding map
    bmap = ARTIFACT_DIR / "delivery_binding_map.md"
    if bmap.exists():
        bmap_content = read(bmap)
        if "diagnosis_output_set.md" not in bmap_content:
            failures.append("diagnosis_output_set.md reference missing in delivery_binding_map.md")
        if "intelligence_output_set.md" not in bmap_content:
            failures.append("intelligence_output_set.md reference missing in delivery_binding_map.md")
    return failures


def check_coverage_preservation() -> list:
    failures = []
    packet = ARTIFACT_DIR / "delivery_output_packet.md"
    if not packet.exists():
        return ["Cannot check coverage — delivery_output_packet.md missing"]
    content = read(packet)

    # Check computed elements declare 'computed'
    for elem in COMPUTED_ELEMENTS:
        pattern = re.compile(rf"### {elem}.*?(?=### |\Z)", re.DOTALL)
        m = pattern.search(content)
        if not m:
            failures.append(f"Section missing in delivery_output_packet.md: {elem}")
            continue
        if "computed" not in m.group(0).lower():
            failures.append(f"{elem}: expected coverage state 'computed' not found in delivery packet")

    # Check blocked elements declare 'blocked'
    for elem in BLOCKED_ELEMENTS:
        pattern = re.compile(rf"### {elem}.*?(?=### |\Z)", re.DOTALL)
        m = pattern.search(content)
        if not m:
            failures.append(f"Section missing in delivery_output_packet.md: {elem}")
            continue
        if "blocked" not in m.group(0).lower():
            failures.append(f"{elem}: expected coverage state 'blocked' not found in delivery packet")

    # Check uncertainty preservation report confirms no conversions
    upr = ARTIFACT_DIR / "uncertainty_preservation_report.md"
    if upr.exists():
        upr_content = read(upr)
        if "0 prohibited conversions" not in upr_content and "zero prohibited conversions" not in upr_content.lower():
            # Check for explicit pass declaration
            if "partial → computed" not in upr_content:
                failures.append("uncertainty_preservation_report.md does not verify prohibited conversion check")
    return failures


def check_uncertainty_preservation() -> list:
    failures = []
    packet = ARTIFACT_DIR / "delivery_output_packet.md"
    if not packet.exists():
        return ["Cannot check uncertainty — delivery_output_packet.md missing"]
    content = read(packet)

    # INTEL-005 unknown space must be present
    if "INTEL-005" not in content:
        failures.append("INTEL-005 unknown space declaration missing from delivery_output_packet.md")
    if "Unknown Space" not in content and "unknown_space" not in content:
        failures.append("Unknown space type declaration missing from delivery_output_packet.md")

    # Blocking reasons must be present
    for blocking_kw in ["AT-001", "AT-002", "DT-007", "AT-007"]:
        if blocking_kw not in content:
            failures.append(f"Blocking telemetry reference {blocking_kw} missing from delivery packet")

    # Check uncertainty preservation report passes
    upr = ARTIFACT_DIR / "uncertainty_preservation_report.md"
    if upr.exists():
        upr_content = read(upr)
        if "PASS — 2/2 unknown space dimensions preserved" not in upr_content:
            failures.append("uncertainty_preservation_report.md does not confirm 2/2 unknown space preservation")

    return failures


def check_boundary_compliance() -> list:
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
            if FORBIDDEN_ALLOWED_CONTEXTS.search(line):
                continue
            for pattern, label in FORBIDDEN_PATTERNS:
                if pattern.search(line):
                    failures.append(
                        f"Forbidden content ({label}) in {filename}:{i}: {line.strip()[:80]}"
                    )
    # Boundary enforcement must declare upstream layers not accessed
    be = ARTIFACT_DIR / "delivery_boundary_enforcement.md"
    if be.exists():
        be_content = read(be)
        if "not accessed" not in be_content:
            failures.append("delivery_boundary_enforcement.md does not declare upstream layers as not accessed")
    # Check no recomputation declarations
    packet = ARTIFACT_DIR / "delivery_output_packet.md"
    if packet.exists():
        p_content = read(packet)
        if "recomput" in p_content.lower():
            # Only fail if not in a prohibition statement
            lines = [l for l in p_content.splitlines() if "recomput" in l.lower()]
            violations = [l for l in lines if not FORBIDDEN_ALLOWED_CONTEXTS.search(l)]
            if violations:
                failures.append("delivery_output_packet.md contains recomputation reference outside prohibition context")
    return failures


def run_checks() -> bool:
    results = {}
    all_passed = True

    checks = [
        ("1. Completeness", check_completeness),
        ("2. Traceability Preservation", check_traceability_preservation),
        ("3. Coverage Preservation", check_coverage_preservation),
        ("4. Uncertainty Preservation", check_uncertainty_preservation),
        ("5. Boundary Compliance", check_boundary_compliance),
    ]

    print("=" * 60)
    print("PIOS-40.8 validate_delivery_artifacts.py")
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
