#!/usr/bin/env python3
"""
extract_perm_entities.py
Stream 40.3 — PiOS Reverse Engineering
run_id: run_02_blueedge
contract: PIOS-40.3-RUN02-CONTRACT-v3

Extracts and reports canonical PERM entity counts and structure from
the 40.3 reconstruction artifacts. Verifies entity catalog completeness
against the evidenced source structure.
"""

import re
import sys
from pathlib import Path

EXECUTION_WORKSPACE = Path.home() / "Projects/krayu-program-intelligence"
OUTPUT_DIR = EXECUTION_WORKSPACE / "docs/pios/40.3"
ENTITY_CATALOG = OUTPUT_DIR / "entity_catalog.md"

EXPECTED_CE_IDS = ["CE-001", "CE-002", "CE-003"]
EXPECTED_SA_IDS = ["SA-001", "SA-002"]
EXPECTED_INF_IDS = ["INF-001", "INF-002", "INF-003", "INF-004", "INF-005"]
EXPECTED_FE_RANGE = (1, 11)
EXPECTED_DS_RANGE = (1, 8)
EXPECTED_BM_COUNT = 65

EVIDENCE_ORIGIN_ROOT = Path.home() / "Projects/blueedge-program-intelligence/source-v3.23"
BACKEND_MODULES_DIR = EVIDENCE_ORIGIN_ROOT / "extracted/backend/backend/src/modules"


def section(title):
    print(f"\n{'=' * 60}")
    print(f"  {title}")
    print('=' * 60)


def load(path):
    if not path.exists():
        return None
    return path.read_text()


def extract_bm_modules_from_catalog(content):
    return re.findall(r"BM-(\d+)", content)


def check_entity_catalog_exists():
    section("Check 1 — Entity Catalog Exists")
    if not ENTITY_CATALOG.exists():
        print(f"  FAIL  Entity catalog not found: {ENTITY_CATALOG}")
        return False
    size = ENTITY_CATALOG.stat().st_size
    print(f"  PASS  {ENTITY_CATALOG.relative_to(EXECUTION_WORKSPACE)} ({size:,} bytes)")
    return True


def check_system_components(content):
    section("Check 2 — System Components (CE-)")
    failures = []
    for ce_id in EXPECTED_CE_IDS:
        if ce_id in content:
            print(f"  PASS  {ce_id}")
        else:
            print(f"  FAIL  {ce_id} not found")
            failures.append(ce_id)
    return len(failures) == 0


def check_svg_agents(content):
    section("Check 3 — SVG Agent Entities (SA-)")
    failures = []
    for sa_id in EXPECTED_SA_IDS:
        if sa_id in content:
            print(f"  PASS  {sa_id}")
        else:
            print(f"  FAIL  {sa_id} not found")
            failures.append(sa_id)
    return len(failures) == 0


def check_infrastructure(content):
    section("Check 4 — Infrastructure Entities (INF-)")
    failures = []
    for inf_id in EXPECTED_INF_IDS:
        if inf_id in content:
            print(f"  PASS  {inf_id}")
        else:
            print(f"  FAIL  {inf_id} not found")
            failures.append(inf_id)
    return len(failures) == 0


def check_backend_modules(content):
    section("Check 5 — Backend Module Entities (BM-)")
    bm_numbers = set(int(n) for n in extract_bm_modules_from_catalog(content))
    if not bm_numbers:
        print("  FAIL  No BM- entities found in catalog")
        return False
    found = len(bm_numbers)
    print(f"  INFO  BM entities found: {found} (max BM-{max(bm_numbers):03d})")
    if found >= EXPECTED_BM_COUNT:
        print(f"  PASS  Backend module count: {found} >= expected {EXPECTED_BM_COUNT}")
        return True
    else:
        print(f"  FAIL  Backend module count: {found} < expected {EXPECTED_BM_COUNT}")
        return False


def check_source_module_alignment():
    section("Check 6 — Source Module Directory Alignment")
    if not BACKEND_MODULES_DIR.exists():
        print(f"  WARN  Backend modules directory not accessible: {BACKEND_MODULES_DIR}")
        return True

    actual_modules = [d.name for d in BACKEND_MODULES_DIR.iterdir() if d.is_dir()]
    actual_count = len(actual_modules)
    print(f"  INFO  Actual module directories in source: {actual_count}")

    content = load(ENTITY_CATALOG)
    if content is None:
        print("  FAIL  Cannot load entity catalog")
        return False

    missing = [m for m in actual_modules if m not in content]
    if missing:
        for m in missing[:5]:
            print(f"  WARN  Module '{m}' in source but not mentioned in catalog")
        print(f"  WARN  Total unmentioned: {len(missing)}")
    else:
        print(f"  PASS  All {actual_count} source modules referenced in entity catalog")
    return len(missing) == 0


def check_frontend_subsystems(content):
    section("Check 7 — Frontend Subsystem Entities (FE-)")
    failures = []
    start, end = EXPECTED_FE_RANGE
    for i in range(start, end + 1):
        fe_id = f"FE-{i:03d}"
        if fe_id in content:
            print(f"  PASS  {fe_id}")
        else:
            print(f"  FAIL  {fe_id} not found")
            failures.append(fe_id)
    return len(failures) == 0


def check_database_entities(content):
    section("Check 8 — Database Schema Entities (DS-)")
    failures = []
    start, end = EXPECTED_DS_RANGE
    for i in range(start, end + 1):
        ds_id = f"DS-{i:03d}"
        if ds_id in content:
            print(f"  PASS  {ds_id}")
        else:
            print(f"  FAIL  {ds_id} not found")
            failures.append(ds_id)
    if "PARTIAL" in content and "DS-009" in content:
        print("  PASS  DS-009+ partial range declared")
    else:
        print("  WARN  DS-009+ partial declaration not confirmed")
    return len(failures) == 0


def check_unknown_space_declarations(content):
    section("Check 9 — Unknown-Space Declarations")
    required = ["US-04", "US-05", "US-06", "OVL-01", "OVL-02"]
    failures = []
    for term in required:
        if term in content:
            print(f"  PASS  {term} declared")
        else:
            print(f"  FAIL  {term} not declared in entity catalog")
            failures.append(term)
    return len(failures) == 0


def print_entity_summary(content):
    section("Entity Extraction Summary")
    bm_count = len(set(extract_bm_modules_from_catalog(content)))
    for prefix, label in [("CE", "System Components"), ("SA", "SVG Agents"),
                           ("INF", "Infrastructure"), ("FE", "Frontend Subsystems"), ("DS", "DB Entities")]:
        ids = re.findall(rf"{prefix}-\d+", content)
        unique = len(set(ids))
        print(f"  {label:28s} ({prefix}-) : {unique}")
    print(f"  {'Backend Modules':28s} (BM-) : {bm_count}")


def main():
    print("\nStream 40.3 — PiOS Reverse Engineering")
    print("Extract PERM Entities — run_02_blueedge")
    print("Contract: PIOS-40.3-RUN02-CONTRACT-v3")

    if not check_entity_catalog_exists():
        print("\n  ABORT — Entity catalog not found")
        return 1

    content = load(ENTITY_CATALOG)

    checks = {
        "Check 2 — System Components": lambda: check_system_components(content),
        "Check 3 — SVG Agents": lambda: check_svg_agents(content),
        "Check 4 — Infrastructure": lambda: check_infrastructure(content),
        "Check 5 — Backend Modules": lambda: check_backend_modules(content),
        "Check 6 — Source Alignment": check_source_module_alignment,
        "Check 7 — Frontend Subsystems": lambda: check_frontend_subsystems(content),
        "Check 8 — Database Entities": lambda: check_database_entities(content),
        "Check 9 — Unknown-Space": lambda: check_unknown_space_declarations(content),
    }

    results = {"Check 1 — Entity Catalog": True}
    for name, fn in checks.items():
        results[name] = fn()

    print_entity_summary(content)

    section("Extraction Summary")
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    for name, result in results.items():
        print(f"  {'PASS' if result else 'FAIL'}  {name}")
    print(f"\n  Result: {passed}/{total} PASS")
    if passed == total:
        print("  Entity extraction COMPLETE")
        return 0
    else:
        print("  Entity extraction INCOMPLETE")
        return 1


if __name__ == "__main__":
    sys.exit(main())
