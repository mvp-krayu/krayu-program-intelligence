#!/usr/bin/env python3
"""
validate_golden_queries.py
PIOS-41.5-ADDENDUM-SCRIPT-RECOVERY-v1

Validates 41.5 Golden Query Engine artifacts against acceptance criteria.

Canonical artifacts (4 files):
  - golden_query_catalog.md
  - query_signal_map.json
  - query_response_templates.md
  - interactive_query_examples.md

Default input : /tmp/pios_41_5_output/

Acceptance Criteria:
  AC-01  All 4 required files present and non-empty
  AC-02  Contract and run metadata present in all markdown files
  AC-03  Total queries = 10 (GQ-001 through GQ-010)
  AC-04  All 10 queries in catalog map to ≥1 signal
  AC-05  All 5 signals (SIG-001 through SIG-005) covered by ≥1 query
  AC-06  No invented signals (only SIG-001..SIG-005 used)
  AC-07  All 7 intent types present
  AC-08  Drill-down [[wiki-links]] present in response templates
  AC-09  Confidence aggregation (lowest-present) rule documented
  AC-10  query_signal_map.json parses and has correct structure

Usage:
  python3 validate_golden_queries.py                              # reads /tmp/pios_41_5_output
  python3 validate_golden_queries.py --input /tmp/pios_41_5_verify
  python3 validate_golden_queries.py --input /tmp/pios_41_5_verify --verbose
"""

import argparse
import json
import re
import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

REQUIRED_FILES = [
    "golden_query_catalog.md",
    "query_signal_map.json",
    "query_response_templates.md",
    "interactive_query_examples.md",
]

CONTRACT_ID   = "PIOS-41.5-RUN01-CONTRACT-v1"
RUN_REFERENCE = "run_01_blueedge"

QUERY_IDS = [f"GQ-{str(i).zfill(3)}" for i in range(1, 11)]  # GQ-001..GQ-010
SIGNAL_IDS = ["SIG-001", "SIG-002", "SIG-003", "SIG-004", "SIG-005"]

INTENT_TYPES = [
    "UNKNOWN_SPACE",
    "INSTABILITY",
    "RISK",
    "DEPENDENCY",
    "PERFORMANCE",
    "COVERAGE",
    "COORDINATION",
]

# Known valid signals — no others may appear
VALID_SIGNAL_PATTERN = re.compile(r'\bSIG-(\d{3})\b')


# ---------------------------------------------------------------------------
# Result tracking
# ---------------------------------------------------------------------------

class ValidationResult:
    def __init__(self, ac_id: str, description: str):
        self.ac_id       = ac_id
        self.description = description
        self.passed      = False
        self.details: list[str] = []

    def pass_(self, detail: str = ""):
        self.passed = True
        if detail:
            self.details.append(f"  PASS  {detail}")

    def fail(self, detail: str):
        self.passed = False
        self.details.append(f"  FAIL  {detail}")

    def summary_line(self) -> str:
        status = "PASS" if self.passed else "FAIL"
        return f"  [{status}]  {self.ac_id}: {self.description}"


# ---------------------------------------------------------------------------
# Acceptance criteria
# ---------------------------------------------------------------------------

def ac01_required_files(input_dir: Path) -> ValidationResult:
    r = ValidationResult("AC-01", "All 4 required files present and non-empty")
    ok = True
    for fname in REQUIRED_FILES:
        path = input_dir / fname
        if path.exists() and path.stat().st_size > 0:
            r.pass_(f"{fname} ({path.stat().st_size} bytes)")
        else:
            r.fail(f"{fname} missing or empty")
            ok = False
    if ok:
        r.passed = True
    return r


def ac02_contract_metadata(input_dir: Path) -> ValidationResult:
    r = ValidationResult("AC-02", "Contract and run metadata in all markdown files")
    ok = True
    md_files = [f for f in REQUIRED_FILES if f.endswith(".md")]
    for fname in md_files:
        path = input_dir / fname
        if not path.exists():
            r.fail(f"{fname}: file missing")
            ok = False
            continue
        text = path.read_text(encoding="utf-8")
        for token in [CONTRACT_ID, RUN_REFERENCE]:
            if token in text:
                r.pass_(f"{fname}: '{token}' present")
            else:
                r.fail(f"{fname}: '{token}' missing")
                ok = False
    if ok:
        r.passed = True
    return r


def ac03_total_queries(input_dir: Path) -> ValidationResult:
    r = ValidationResult("AC-03", "Total queries = 10 (GQ-001 through GQ-010)")
    catalog = input_dir / "golden_query_catalog.md"
    if not catalog.exists():
        r.fail("golden_query_catalog.md missing")
        return r
    text = catalog.read_text(encoding="utf-8")
    ok = True
    for qid in QUERY_IDS:
        if qid in text:
            r.pass_(f"{qid} present in catalog")
        else:
            r.fail(f"{qid} missing from catalog")
            ok = False
    # Also check the validation self-check line
    if "Total queries = 10" in text:
        r.pass_("'Total queries = 10' self-check present")
    else:
        r.fail("'Total queries = 10' self-check missing")
        ok = False
    if ok:
        r.passed = True
    return r


def ac04_query_signal_mapping(input_dir: Path) -> ValidationResult:
    r = ValidationResult("AC-04", "Each query maps to ≥1 signal")
    map_file = input_dir / "query_signal_map.json"
    if not map_file.exists():
        r.fail("query_signal_map.json missing")
        return r
    try:
        data = json.loads(map_file.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        r.fail(f"JSON parse error: {e}")
        return r

    queries = data.get("queries", [])
    ok = True
    for q in queries:
        qid = q.get("query_id", "?")
        signals = q.get("mapped_signals", [])
        if len(signals) >= 1:
            r.pass_(f"{qid}: {len(signals)} mapped signal(s)")
        else:
            r.fail(f"{qid}: 0 mapped signals (must have ≥1)")
            ok = False
    if ok:
        r.passed = True
    return r


def ac05_signal_coverage(input_dir: Path) -> ValidationResult:
    r = ValidationResult("AC-05", "All 5 signals (SIG-001..SIG-005) covered by ≥1 query")
    map_file = input_dir / "query_signal_map.json"
    if not map_file.exists():
        r.fail("query_signal_map.json missing")
        return r
    try:
        data = json.loads(map_file.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        r.fail(f"JSON parse error: {e}")
        return r

    coverage = data.get("signal_coverage", {})
    ok = True
    for sid in SIGNAL_IDS:
        covered_by = coverage.get(sid, [])
        if covered_by:
            r.pass_(f"{sid} covered by: {covered_by}")
        else:
            r.fail(f"{sid} not covered by any query")
            ok = False

    # Cross-check: catalog also mentions all signals
    catalog = input_dir / "golden_query_catalog.md"
    if catalog.exists():
        text = catalog.read_text(encoding="utf-8")
        for sid in SIGNAL_IDS:
            if sid in text:
                r.pass_(f"{sid} present in catalog")
            else:
                r.fail(f"{sid} missing from catalog")
                ok = False

    if ok:
        r.passed = True
    return r


def ac06_no_invented_signals(input_dir: Path) -> ValidationResult:
    r = ValidationResult("AC-06", "No invented signals (only SIG-001..SIG-005 used)")
    ok = True
    valid_nums = {str(i).zfill(3) for i in range(1, 6)}
    for fname in REQUIRED_FILES:
        path = input_dir / fname
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        found = set(VALID_SIGNAL_PATTERN.findall(text))
        invented = found - valid_nums
        if invented:
            r.fail(f"{fname}: invented signal IDs found: {sorted(invented)}")
            ok = False
        else:
            r.pass_(f"{fname}: only valid signal IDs present")
    if ok:
        r.passed = True
    return r


def ac07_intent_types(input_dir: Path) -> ValidationResult:
    r = ValidationResult("AC-07", "All 7 intent types present")
    catalog = input_dir / "golden_query_catalog.md"
    if not catalog.exists():
        r.fail("golden_query_catalog.md missing")
        return r
    text = catalog.read_text(encoding="utf-8")
    ok = True
    for intent in INTENT_TYPES:
        if intent in text:
            r.pass_(f"intent type '{intent}' present")
        else:
            r.fail(f"intent type '{intent}' missing")
            ok = False
    if ok:
        r.passed = True
    return r


def ac08_drill_down_links(input_dir: Path) -> ValidationResult:
    r = ValidationResult("AC-08", "Drill-down [[wiki-links]] present in response templates")
    templates = input_dir / "query_response_templates.md"
    if not templates.exists():
        r.fail("query_response_templates.md missing")
        return r
    text = templates.read_text(encoding="utf-8")

    # Extract all [[...]] links
    links = re.findall(r'\[\[([^\]]+)\]\]', text)
    if not links:
        r.fail("No [[wiki-links]] found in query_response_templates.md")
        return r

    r.pass_(f"{len(links)} [[wiki-link]](s) found in response templates")

    # Check for specific expected drill-down link types
    required_link_prefixes = ["D_", "C_", "CMP_"]
    for prefix in required_link_prefixes:
        matching = [lk for lk in links if lk.startswith(prefix)]
        if matching:
            r.pass_(f"[[{prefix}...]] links present ({len(matching)} found)")
        else:
            r.fail(f"No [[{prefix}...]] links found in response templates")

    # Check each query section has a Drill-down block
    ok = True
    for qid in QUERY_IDS:
        section_pattern = f"## {qid} —"
        if section_pattern in text:
            # Find the section and look for Drill-down nearby
            idx = text.find(section_pattern)
            section_end = text.find("\n---", idx + 1)
            if section_end == -1:
                section_end = len(text)
            section = text[idx:section_end]
            if "**Drill-down**" in section or "Drill-down" in section:
                r.pass_(f"{qid}: Drill-down block present")
            else:
                r.fail(f"{qid}: Drill-down block missing in response template")
                ok = False
        else:
            r.fail(f"{qid}: section header missing from response templates")
            ok = False

    if ok and links:
        r.passed = True
    return r


def ac09_confidence_aggregation(input_dir: Path) -> ValidationResult:
    r = ValidationResult("AC-09", "Confidence aggregation (lowest-present) rule documented")
    ok = True
    # Check catalog self-check line
    catalog = input_dir / "golden_query_catalog.md"
    if catalog.exists():
        text = catalog.read_text(encoding="utf-8")
        if "lowest-present rule" in text or "LOWEST-present rule" in text:
            r.pass_("lowest-present rule referenced in catalog")
        else:
            r.fail("lowest-present rule not referenced in catalog")
            ok = False
    else:
        r.fail("golden_query_catalog.md missing")
        ok = False

    # Check response templates reference the rule in WEAK-confidence queries
    templates = input_dir / "query_response_templates.md"
    if templates.exists():
        text = templates.read_text(encoding="utf-8")
        if "lowest-present rule" in text or "lowest present" in text.lower():
            r.pass_("lowest-present rule applied in response templates")
        else:
            r.fail("lowest-present rule not found in response templates")
            ok = False
    else:
        r.fail("query_response_templates.md missing")
        ok = False

    if ok:
        r.passed = True
    return r


def ac10_json_structure(input_dir: Path) -> ValidationResult:
    r = ValidationResult("AC-10", "query_signal_map.json parses and has correct structure")
    map_file = input_dir / "query_signal_map.json"
    if not map_file.exists():
        r.fail("query_signal_map.json missing")
        return r
    try:
        data = json.loads(map_file.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        r.fail(f"JSON parse error: {e}")
        return r

    ok = True

    # Top-level fields
    for field in ["map_id", "contract_id", "run_reference", "total_queries",
                  "signal_pool_size", "queries", "signal_coverage"]:
        if field in data:
            r.pass_(f"field '{field}' present")
        else:
            r.fail(f"field '{field}' missing")
            ok = False

    # Counts
    total = data.get("total_queries", 0)
    if total == 10:
        r.pass_(f"total_queries = 10")
    else:
        r.fail(f"total_queries = {total} (expected 10)")
        ok = False

    pool = data.get("signal_pool_size", 0)
    if pool == 5:
        r.pass_(f"signal_pool_size = 5")
    else:
        r.fail(f"signal_pool_size = {pool} (expected 5)")
        ok = False

    # Query entry structure
    queries = data.get("queries", [])
    if len(queries) == 10:
        r.pass_(f"queries array has 10 entries")
    else:
        r.fail(f"queries array has {len(queries)} entries (expected 10)")
        ok = False

    for q in queries[:3]:  # spot-check first 3
        for sub_field in ["query_id", "query_text", "intent_type", "semantic_tags",
                           "mapped_signals", "aggregate_confidence", "response_template_ref"]:
            if sub_field in q:
                r.pass_(f"{q.get('query_id','?')}.{sub_field} present")
            else:
                r.fail(f"{q.get('query_id','?')}.{sub_field} missing")
                ok = False

    # Contract ID match
    if data.get("contract_id") == CONTRACT_ID:
        r.pass_(f"contract_id matches '{CONTRACT_ID}'")
    else:
        r.fail(f"contract_id mismatch: '{data.get('contract_id')}' != '{CONTRACT_ID}'")
        ok = False

    if ok:
        r.passed = True
    return r


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Validate 41.5 Golden Query Engine artifacts."
    )
    parser.add_argument(
        "--input",
        default="/tmp/pios_41_5_output",
        help="Input directory containing generated artifacts (default: /tmp/pios_41_5_output)",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Show per-check detail lines.",
    )
    args = parser.parse_args()

    input_dir = Path(args.input)

    if not input_dir.exists():
        print(f"ERROR: Input directory not found: {input_dir}")
        print("       Run build_golden_queries.py first.")
        sys.exit(1)

    print(f"41.5 Golden Query Engine — Validation")
    print(f"  Input : {input_dir}")
    print()

    results = [
        ac01_required_files(input_dir),
        ac02_contract_metadata(input_dir),
        ac03_total_queries(input_dir),
        ac04_query_signal_mapping(input_dir),
        ac05_signal_coverage(input_dir),
        ac06_no_invented_signals(input_dir),
        ac07_intent_types(input_dir),
        ac08_drill_down_links(input_dir),
        ac09_confidence_aggregation(input_dir),
        ac10_json_structure(input_dir),
    ]

    print("=" * 60)
    all_passed = True
    for r in results:
        print(r.summary_line())
        if args.verbose:
            for d in r.details:
                print(d)
        if not r.passed:
            all_passed = False

    print("=" * 60)
    passed_count = sum(1 for r in results if r.passed)
    failed_count = len(results) - passed_count

    if all_passed:
        print("VALIDATION RESULT: PASS")
        print(f"All {len(results)} acceptance criteria passed.")
        sys.exit(0)
    else:
        print("VALIDATION RESULT: FAIL")
        print(f"  Passed : {passed_count}/{len(results)}")
        print(f"  Failed : {failed_count}/{len(results)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
