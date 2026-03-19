#!/usr/bin/env python3
"""
validate_telemetry_artifacts.py
Stream: 40.4 — PiOS Telemetry Extraction
Contract: PIOS-40.4-TELEMETRY-CONTRACT

Validates the 6 docs/pios/40.4 telemetry artifacts against contract requirements.

Checks:
  1. Completeness         — all 6 expected artifacts present
  2. Schema consistency   — ST/AT/DT metric counts match telemetry_schema.md declaration
  3. Temporal coverage    — every metric carries a temporal classification
  4. Traceability         — every metric appears in telemetry_traceability_map.md
  5. Forbidden content    — absence of: signal, scoring, diagnosis, interpretation, narrative

Usage:
    python3 scripts/pios/40.4/validate_telemetry_artifacts.py
"""

import sys
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
ARTIFACT_DIR = REPO_ROOT / "docs/pios/40.4"

EXPECTED_ARTIFACTS = [
    "telemetry_surface_definition.md",
    "telemetry_schema.md",
    "structural_telemetry.md",
    "activity_telemetry.md",
    "delivery_telemetry.md",
    "telemetry_traceability_map.md",
]

# Schema-declared metric counts (from telemetry_schema.md §7)
SCHEMA_DECLARED = {"ST": 22, "AT": 10, "DT": 8}

# Patterns used for detection
METRIC_HEADER_RE = re.compile(r"^### (ST|AT|DT)-(\d+)")
TEMPORAL_CLASS_RE = re.compile(r"^\| Temporal Classification \| (static|event-based|time-series) \|")
SCHEMA_RANGE_RE = re.compile(r"(ST|AT|DT)-\d{3} through (ST|AT|DT)-\d{3} \((\d+)\)")

FORBIDDEN_PATTERNS = [
    (re.compile(r"\bsignal computation\b", re.IGNORECASE), "signal computation"),
    (re.compile(r"\bscoring\b", re.IGNORECASE), "scoring"),
    (re.compile(r"\bdiagnos[ie]", re.IGNORECASE), "diagnosis"),
    (re.compile(r"\binterpret(?:ation|s|ed|ing)\b", re.IGNORECASE), "interpretation"),
    (re.compile(r"\bnarrative\b", re.IGNORECASE), "narrative"),
    (re.compile(r"\bESI\b"), "ESI (forbidden signal index)"),
    (re.compile(r"\bRAG\b"), "RAG (forbidden signal index)"),
]

# Allowed files for forbidden content check (telemetry body only, not schema or traceability)
FORBIDDEN_CHECK_ARTIFACTS = [
    "structural_telemetry.md",
    "activity_telemetry.md",
    "delivery_telemetry.md",
]

# Lines in the above files that are allowed to contain these terms as structural references
# (e.g. "Maps to M-06 which computes ESI" in a Description field is a structural reference, not production)
FORBIDDEN_ALLOWED_CONTEXTS = re.compile(
    r"(Evidence Reference|Structural Element|entity_catalog|capability_map|normalized_evidence|CKR-014|CKR-015)"
)


def read(path: Path) -> str:
    with open(path, encoding="utf-8") as f:
        return f.read()


def check_completeness() -> list[str]:
    """Check 1: All 6 expected artifacts present."""
    failures = []
    for name in EXPECTED_ARTIFACTS:
        if not (ARTIFACT_DIR / name).exists():
            failures.append(f"MISSING: {name}")
    return failures


def check_schema_consistency() -> list[str]:
    """Check 2: Metric counts in telemetry artifacts match schema declaration."""
    failures = []
    counts = {"ST": 0, "AT": 0, "DT": 0}
    artifact_map = {
        "ST": "structural_telemetry.md",
        "AT": "activity_telemetry.md",
        "DT": "delivery_telemetry.md",
    }
    for prefix, filename in artifact_map.items():
        path = ARTIFACT_DIR / filename
        if not path.exists():
            failures.append(f"Cannot check schema consistency — {filename} missing")
            continue
        content = read(path)
        count = sum(1 for line in content.splitlines() if METRIC_HEADER_RE.match(line))
        counts[prefix] = count
        expected = SCHEMA_DECLARED[prefix]
        if count != expected:
            failures.append(
                f"Schema mismatch in {filename}: found {count} {prefix}-* metrics, "
                f"schema declares {expected}"
            )
    return failures


def check_temporal_coverage() -> list[str]:
    """Check 3: Every metric has a temporal classification line."""
    failures = []
    artifact_map = {
        "ST": "structural_telemetry.md",
        "AT": "activity_telemetry.md",
        "DT": "delivery_telemetry.md",
    }
    valid_values = {"static", "event-based", "time-series"}
    for prefix, filename in artifact_map.items():
        path = ARTIFACT_DIR / filename
        if not path.exists():
            continue
        content = read(path)
        lines = content.splitlines()
        current_metric = None
        metric_has_tc = {}
        for line in lines:
            m = METRIC_HEADER_RE.match(line)
            if m:
                current_metric = f"{m.group(1)}-{m.group(2).zfill(3)}"
                metric_has_tc[current_metric] = False
                continue
            if current_metric and TEMPORAL_CLASS_RE.match(line):
                tc_value = TEMPORAL_CLASS_RE.match(line).group(1)
                if tc_value in valid_values:
                    metric_has_tc[current_metric] = True
        for metric_id, has_tc in metric_has_tc.items():
            if not has_tc:
                failures.append(f"Missing or invalid temporal classification: {metric_id} in {filename}")
    return failures


def check_traceability_coverage() -> list[str]:
    """Check 4: Every metric ID appears in telemetry_traceability_map.md."""
    failures = []
    ttm_path = ARTIFACT_DIR / "telemetry_traceability_map.md"
    if not ttm_path.exists():
        return ["Cannot check traceability — telemetry_traceability_map.md missing"]
    ttm_content = read(ttm_path)
    artifact_map = {
        "ST": "structural_telemetry.md",
        "AT": "activity_telemetry.md",
        "DT": "delivery_telemetry.md",
    }
    for prefix, filename in artifact_map.items():
        path = ARTIFACT_DIR / filename
        if not path.exists():
            continue
        content = read(path)
        for line in content.splitlines():
            m = METRIC_HEADER_RE.match(line)
            if m:
                metric_id = f"{m.group(1)}-{m.group(2).zfill(3)}"
                if metric_id not in ttm_content:
                    failures.append(f"Not in traceability map: {metric_id}")
    return failures


def check_forbidden_content() -> list[str]:
    """Check 5: Telemetry body artifacts do not contain forbidden content."""
    failures = []
    for filename in FORBIDDEN_CHECK_ARTIFACTS:
        path = ARTIFACT_DIR / filename
        if not path.exists():
            continue
        content = read(path)
        for i, line in enumerate(content.splitlines(), 1):
            if FORBIDDEN_ALLOWED_CONTEXTS.search(line):
                continue
            for pattern, label in FORBIDDEN_PATTERNS:
                if pattern.search(line):
                    failures.append(f"Forbidden content ({label}) in {filename}:{i}: {line.strip()[:80]}")
    return failures


def run_checks() -> bool:
    results = {}
    all_passed = True

    checks = [
        ("1. Completeness", check_completeness),
        ("2. Schema consistency", check_schema_consistency),
        ("3. Temporal classification coverage", check_temporal_coverage),
        ("4. Traceability coverage", check_traceability_coverage),
        ("5. Forbidden content absence", check_forbidden_content),
    ]

    print("=" * 60)
    print("PIOS-40.4 validate_telemetry_artifacts.py")
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
