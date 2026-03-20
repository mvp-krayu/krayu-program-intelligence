#!/usr/bin/env python3
"""
validate_telemetry_artifacts.py
Stream 40.4 — PiOS Telemetry Extraction Layer
run_id: run_01_blueedge
contract: PIOS-40.4-RUN01-CONTRACT-v1

Validates all 11 canonical 40.4 telemetry artifacts against the
governed rules of PIOS-40.4-RUN01-CONTRACT-v1.

GOVERNANCE IMMUTABILITY DECLARATION
This validation script is a governed artifact.
It is read-only after stream execution is declared complete.
Validation failures must be resolved by correcting the artifact under validation.
This script must not be modified in response to a failing check.
"""

import re
import sys
from pathlib import Path

EXECUTION_WORKSPACE = Path.home() / "Projects/krayu-program-intelligence"
OUTPUT_DIR = EXECUTION_WORKSPACE / "docs/pios/40.4"

TELEMETRY_SURFACE_MAP = OUTPUT_DIR / "telemetry_surface_map.md"
DIMENSION_CATALOG     = OUTPUT_DIR / "telemetry_dimension_catalog.md"
ENTITY_TELEMETRY      = OUTPUT_DIR / "entity_telemetry.md"
DEPENDENCY_TELEMETRY  = OUTPUT_DIR / "dependency_telemetry.md"
INTERFACE_TELEMETRY   = OUTPUT_DIR / "interface_telemetry.md"
DOMAIN_TELEMETRY      = OUTPUT_DIR / "domain_telemetry.md"
TEMPORAL_SERIES       = OUTPUT_DIR / "temporal_telemetry_series.md"
NORMALIZATION_SPEC    = OUTPUT_DIR / "telemetry_normalization_spec.md"
PEG_MAPPING           = OUTPUT_DIR / "telemetry_to_peg_mapping.md"
IMMUTABILITY_LOG      = OUTPUT_DIR / "structure_immutability_log.md"
VALIDATION_LOG        = OUTPUT_DIR / "telemetry_validation_log.md"

REQUIRED_ARTIFACTS = [
    TELEMETRY_SURFACE_MAP, DIMENSION_CATALOG, ENTITY_TELEMETRY,
    DEPENDENCY_TELEMETRY, INTERFACE_TELEMETRY, DOMAIN_TELEMETRY,
    TEMPORAL_SERIES, NORMALIZATION_SPEC, PEG_MAPPING,
    IMMUTABILITY_LOG, VALIDATION_LOG,
]

REQUIRED_RUN_TERMS = ["run_01_blueedge", "PIOS-40.4-RUN01-CONTRACT-v1"]

REQUIRED_TELEMETRY_SURFACES = [
    "TS-001", "TS-002", "TS-003", "TS-004",
    "TS-008", "TS-009", "TS-012", "TS-014",
]

REQUIRED_PROMETHEUS_METRICS = [
    "blueedge_process_heap_bytes",
    "blueedge_process_rss_bytes",
    "blueedge_cache_hits_total",
    "blueedge_cache_misses_total",
    "blueedge_cache_connected",
    "blueedge_events_total",
]

REQUIRED_PEG_REFS  = ["EP-01", "EP-02", "EP-03", "EP-06"]
REQUIRED_NODE_REFS = ["N-05", "N-09", "N-10", "N-13"]
REQUIRED_ENTITY_REFS = ["CE-001", "CE-002", "SA-001", "INF-001", "INF-002", "INF-003"]
REQUIRED_TEMPORAL_INTERVALS = ["2000ms", "5000ms", "10s", "15s", "30s"]
REQUIRED_UNKNOWN_SPACE_TERMS = ["TUS-01", "TUS-02"]

PROHIBITED_TERMS = [
    r"signal\s+computation",
    r"diagnosis\s+result",
    r"intelligence\s+synthesis",
    r"condition\s+activated",
    r"trend\s+derived",
    r"scoring\s+applied",
]

# Lines matching these patterns are prohibition declarations, not violations.
FORBIDDEN_ALLOWED_CONTEXTS = [
    r"NOT\s+VIOLATED",
    r"No\s+signal\s+computation",
    r"no\s+signal\s+computation",
    r"No\s+prohibited",
    r"No\s+inference",
    r"prohibited_operations",
    r"constraints_and_prohibitions",
    r"Check\s+12\s+—\s+No\s+signal",
    r"No\s+temporal\s+trend\s+derived",
    r"no\s+trend\s+deriv",
    r"Trend\s+derivation",
]


def section(title):
    print(f"\n{'=' * 60}")
    print(f"  {title}")
    print('=' * 60)


def load(path):
    if not path.exists():
        return None
    return path.read_text()


def all_content():
    return [load(p) or "" for p in REQUIRED_ARTIFACTS]


def check_artifact_completeness():
    section("Check 1 — All 11 Mandatory Telemetry Artifacts Present")
    failures = []
    for path in REQUIRED_ARTIFACTS:
        if path.exists() and path.stat().st_size > 0:
            print(f"  PASS  {path.relative_to(EXECUTION_WORKSPACE)}")
        elif path.exists():
            print(f"  FAIL  EMPTY: {path.relative_to(EXECUTION_WORKSPACE)}")
            failures.append(path.name)
        else:
            print(f"  FAIL  MISSING: {path.relative_to(EXECUTION_WORKSPACE)}")
            failures.append(path.name)
    return len(failures) == 0


def check_boundary_terms():
    section("Check 2 — Run and Contract Identifiers Present in All Artifacts")
    failures = []
    contents = all_content()
    for term in REQUIRED_RUN_TERMS:
        found = sum(1 for c in contents if term in c)
        if found >= len(REQUIRED_ARTIFACTS):
            print(f"  PASS  '{term}' present in all {found} artifacts")
        else:
            print(f"  FAIL  '{term}' present in only {found}/{len(REQUIRED_ARTIFACTS)} artifacts")
            failures.append(term)
    return len(failures) == 0


def check_telemetry_surfaces():
    section("Check 3 — Required Telemetry Surfaces Declared")
    content = load(TELEMETRY_SURFACE_MAP) or ""
    failures = []
    for ts in REQUIRED_TELEMETRY_SURFACES:
        if ts in content:
            print(f"  PASS  {ts}")
        else:
            print(f"  FAIL  {ts} missing from telemetry_surface_map.md")
            failures.append(ts)
    return len(failures) == 0


def check_prometheus_dimensions():
    section("Check 4 — Prometheus Metric Dimensions Defined")
    content = load(DIMENSION_CATALOG) or ""
    failures = []
    for metric in REQUIRED_PROMETHEUS_METRICS:
        if metric in content:
            print(f"  PASS  {metric}")
        else:
            print(f"  FAIL  {metric} missing from telemetry_dimension_catalog.md")
            failures.append(metric)
    dim_count = len(set(re.findall(r"DIM-[A-Z]+-\d+", content)))
    if dim_count >= 20:
        print(f"  PASS  DIM- count: {dim_count} >= 20")
    else:
        print(f"  FAIL  DIM- count: {dim_count} < 20")
        failures.append("DIM-count")
    return len(failures) == 0


def check_peg_attachment():
    section("Check 5 — Telemetry Mapped to PEG Paths and Nodes")
    content = load(PEG_MAPPING) or ""
    failures = []
    for ep in REQUIRED_PEG_REFS:
        if ep in content:
            print(f"  PASS  {ep} referenced in peg mapping")
        else:
            print(f"  FAIL  {ep} missing from telemetry_to_peg_mapping.md")
            failures.append(ep)
    for node in REQUIRED_NODE_REFS:
        if node in content:
            print(f"  PASS  {node} referenced in peg mapping")
        else:
            print(f"  FAIL  {node} missing from telemetry_to_peg_mapping.md")
            failures.append(node)
    if "new_peg_nodes_created: NONE" in content:
        print("  PASS  new_peg_nodes_created: NONE confirmed")
    else:
        print("  FAIL  new_peg_nodes_created confirmation missing")
        failures.append("new_peg_nodes")
    return len(failures) == 0


def check_entity_coverage():
    section("Check 6 — Entity Telemetry References Required Entities")
    content = load(ENTITY_TELEMETRY) or ""
    failures = []
    for entity in REQUIRED_ENTITY_REFS:
        if entity in content:
            print(f"  PASS  {entity}")
        else:
            print(f"  FAIL  {entity} missing from entity_telemetry.md")
            failures.append(entity)
    return len(failures) == 0


def check_temporal_anchors():
    section("Check 7 — Temporal Series Contains Required Intervals")
    content = load(TEMPORAL_SERIES) or ""
    failures = []
    for interval in REQUIRED_TEMPORAL_INTERVALS:
        if interval in content:
            print(f"  PASS  {interval} declared")
        else:
            print(f"  FAIL  {interval} not found in temporal_telemetry_series.md")
            failures.append(interval)
    tmp_count = len(set(re.findall(r"TMP-\d+", content)))
    if tmp_count >= 10:
        print(f"  PASS  TMP- count: {tmp_count} >= 10")
    else:
        print(f"  FAIL  TMP- count: {tmp_count} < 10")
        failures.append("TMP-count")
    if "trend_derivation_applied: NONE" in content:
        print("  PASS  No-trend boundary declaration present")
    else:
        print("  FAIL  No-trend boundary declaration missing")
        failures.append("no_trend_declaration")
    return len(failures) == 0


def check_unknown_space_declared():
    section("Check 8 — Telemetry Unknown-Space Declared")
    all_text = " ".join(all_content())
    failures = []
    for term in REQUIRED_UNKNOWN_SPACE_TERMS:
        if term in all_text:
            print(f"  PASS  {term} declared")
        else:
            print(f"  FAIL  {term} not declared in any artifact")
            failures.append(term)
    return len(failures) == 0


def check_immutability_confirmed():
    section("Check 9 — Structure Immutability Confirmed")
    content = load(IMMUTABILITY_LOG) or ""
    failures = []
    required_terms = [
        "structural_lock_established: TRUE",
        "modification_of_40_3_artifacts: NONE",
        "10/10 PASS",
    ]
    for term in required_terms:
        if term in content:
            print(f"  PASS  '{term}'")
        else:
            print(f"  FAIL  '{term}' not in structure_immutability_log.md")
            failures.append(term)
    return len(failures) == 0


def check_no_prohibited_operations():
    section("Check 10 — No Prohibited Operations in Telemetry Artifacts")
    all_lines = []
    for content in all_content():
        for line in content.splitlines():
            is_allowed_context = any(
                re.search(ctx, line, re.IGNORECASE)
                for ctx in FORBIDDEN_ALLOWED_CONTEXTS
            )
            if not is_allowed_context:
                all_lines.append(line)
    filtered_text = " ".join(all_lines)
    failures = []
    for pattern in PROHIBITED_TERMS:
        if re.search(pattern, filtered_text, re.IGNORECASE):
            print(f"  FAIL  Prohibited pattern found: '{pattern}'")
            failures.append(pattern)
    if not failures:
        print("  PASS  No prohibited operation terms detected")
    return len(failures) == 0


def check_validation_log_pass():
    section("Check 11 — Telemetry Validation Log Shows PASS")
    content = load(VALIDATION_LOG) or ""
    if "15/15 PASS" in content or re.search(r"15/15.*PASS", content):
        print("  PASS  Telemetry validation log shows 15/15 PASS")
        return True
    else:
        print("  FAIL  15/15 PASS not found in telemetry_validation_log.md")
        return False


def check_telemetry_completeness_declared():
    section("Check 12 — Telemetry Completeness Position Declared")
    content = load(VALIDATION_LOG) or ""
    for pos in ["COMPLETE", "PARTIAL"]:
        if f"telemetry_completeness: {pos}" in content:
            print(f"  PASS  Telemetry completeness declared: {pos}")
            return True
    print("  FAIL  telemetry_completeness not declared in validation log")
    return False


def check_immutability_declaration():
    section("Check 13 — Governance Immutability Declaration")
    script_content = Path(__file__).read_text()
    if "GOVERNANCE IMMUTABILITY DECLARATION" in script_content:
        print("  PASS  GOVERNANCE IMMUTABILITY DECLARATION present in this script")
        return True
    else:
        print("  FAIL  GOVERNANCE IMMUTABILITY DECLARATION missing from this script")
        return False


def main():
    print("\nStream 40.4 — PiOS Telemetry Extraction Layer")
    print("Validate Telemetry Artifacts — run_01_blueedge")
    print("Contract: PIOS-40.4-RUN01-CONTRACT-v1")

    checks = {
        "Check 1  — Artifact Completeness":       check_artifact_completeness,
        "Check 2  — Boundary Terms":              check_boundary_terms,
        "Check 3  — Telemetry Surfaces":          check_telemetry_surfaces,
        "Check 4  — Prometheus Dimensions":       check_prometheus_dimensions,
        "Check 5  — PEG Attachment":              check_peg_attachment,
        "Check 6  — Entity Coverage":             check_entity_coverage,
        "Check 7  — Temporal Anchors":            check_temporal_anchors,
        "Check 8  — Unknown-Space Declared":      check_unknown_space_declared,
        "Check 9  — Immutability Confirmed":      check_immutability_confirmed,
        "Check 10 — No Prohibited Operations":    check_no_prohibited_operations,
        "Check 11 — Validation Log PASS":         check_validation_log_pass,
        "Check 12 — Completeness Declared":       check_telemetry_completeness_declared,
        "Check 13 — Governance Declaration":      check_immutability_declaration,
    }

    results = {}
    for name, fn in checks.items():
        results[name] = fn()

    section("Validation Summary")
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    for name, result in results.items():
        print(f"  {'PASS' if result else 'FAIL'}  {name}")
    print(f"\n  Result: {passed}/{total} PASS")
    if passed == total:
        print("  Telemetry validation COMPLETE — all checks passed")
        return 0
    else:
        print("  Telemetry validation INCOMPLETE — one or more checks failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())
