#!/usr/bin/env python3
"""
validate_signals.py
PIOS-41.4-RUN01-ADDENDUM-SCRIPT-RECOVERY-v1

Validates signal_registry.json against acceptance criteria AC-01 through AC-05.

Usage:
  python3 validate_signals.py                          # validates docs/pios/41.4/signal_registry.json
  python3 validate_signals.py --input /tmp/pios_41.4_output/signal_registry.json
"""

import json
import sys
import argparse
from pathlib import Path


# ---------------------------------------------------------------------------
# Acceptance criteria
# ---------------------------------------------------------------------------

EXPECTED_SIGNAL_COUNT = 5
VALID_CONFIDENCE_VALUES = {"STRONG", "MODERATE", "WEAK"}

# Known valid signal IDs — any signal_id outside this set is flagged as invented
KNOWN_SIGNAL_IDS = {"SIG-001", "SIG-002", "SIG-003", "SIG-004", "SIG-005"}

# Required top-level fields in each signal object
REQUIRED_SIGNAL_FIELDS = [
    "signal_id",
    "title",
    "statement",
    "domain_id",
    "capability_id",
    "component_ids",
    "component_names",
    "source_refs",
    "trace_links",
    "evidence_confidence",
    "confidence_rationale",
    "business_impact",
    "risk",
]


# ---------------------------------------------------------------------------
# Validation logic
# ---------------------------------------------------------------------------

class ValidationResult:
    def __init__(self, criterion: str):
        self.criterion = criterion
        self.passed = True
        self.messages: list[str] = []

    def fail(self, msg: str):
        self.passed = False
        self.messages.append(f"  FAIL: {msg}")

    def info(self, msg: str):
        self.messages.append(f"  INFO: {msg}")

    def status(self) -> str:
        return "PASS" if self.passed else "FAIL"


def validate_registry(registry: dict) -> list[ValidationResult]:
    results = []

    # -----------------------------------------------------------------------
    # AC-01 — Signal count
    # -----------------------------------------------------------------------
    r = ValidationResult("AC-01  Signal count == 5")
    actual = registry.get("total_signals", -1)
    signals = registry.get("signals", [])
    actual_list_len = len(signals)
    if actual != EXPECTED_SIGNAL_COUNT:
        r.fail(f"total_signals field = {actual}, expected {EXPECTED_SIGNAL_COUNT}")
    if actual_list_len != EXPECTED_SIGNAL_COUNT:
        r.fail(f"signals array length = {actual_list_len}, expected {EXPECTED_SIGNAL_COUNT}")
    if r.passed:
        r.info(f"total_signals = {actual}, array length = {actual_list_len}")
    results.append(r)

    # -----------------------------------------------------------------------
    # AC-02 — Required fields present per signal
    # -----------------------------------------------------------------------
    r = ValidationResult("AC-02  Required fields present in every signal")
    for sig in signals:
        sig_id = sig.get("signal_id", "<unknown>")
        for field in REQUIRED_SIGNAL_FIELDS:
            if field not in sig:
                r.fail(f"{sig_id}: missing field '{field}'")
            elif sig[field] is None:
                r.fail(f"{sig_id}: field '{field}' is null")
            elif isinstance(sig[field], (str, list)) and not sig[field]:
                r.fail(f"{sig_id}: field '{field}' is empty")
    if r.passed:
        r.info(f"All {len(signals)} signals have required fields")
    results.append(r)

    # -----------------------------------------------------------------------
    # AC-03 — source_refs ≥ 1 per signal
    # -----------------------------------------------------------------------
    r = ValidationResult("AC-03  source_refs ≥ 1 per signal")
    for sig in signals:
        sig_id = sig.get("signal_id", "<unknown>")
        refs = sig.get("source_refs", [])
        if not isinstance(refs, list) or len(refs) == 0:
            r.fail(f"{sig_id}: source_refs is empty or not a list")
        else:
            r.info(f"{sig_id}: {len(refs)} source refs")
    results.append(r)

    # -----------------------------------------------------------------------
    # AC-04 — domain_id and capability_id present
    # -----------------------------------------------------------------------
    r = ValidationResult("AC-04  domain_id and capability_id present")
    for sig in signals:
        sig_id = sig.get("signal_id", "<unknown>")
        if not sig.get("domain_id"):
            r.fail(f"{sig_id}: domain_id missing or empty")
        else:
            r.info(f"{sig_id}: domain_id = {sig['domain_id']}")
        if not sig.get("capability_id"):
            r.fail(f"{sig_id}: capability_id missing or empty")
        else:
            r.info(f"{sig_id}: capability_id = {sig['capability_id']}")
    results.append(r)

    # -----------------------------------------------------------------------
    # AC-05 — component_ids ≥ 1 per signal
    # -----------------------------------------------------------------------
    r = ValidationResult("AC-05  component_ids ≥ 1 per signal")
    for sig in signals:
        sig_id = sig.get("signal_id", "<unknown>")
        cids = sig.get("component_ids", [])
        if not isinstance(cids, list) or len(cids) == 0:
            r.fail(f"{sig_id}: component_ids is empty or not a list")
        else:
            r.info(f"{sig_id}: {len(cids)} component(s): {', '.join(cids)}")
    results.append(r)

    # -----------------------------------------------------------------------
    # AC-06 — evidence_confidence assigned and valid
    # -----------------------------------------------------------------------
    r = ValidationResult("AC-06  evidence_confidence assigned and valid")
    for sig in signals:
        sig_id = sig.get("signal_id", "<unknown>")
        conf = sig.get("evidence_confidence", "")
        if conf not in VALID_CONFIDENCE_VALUES:
            r.fail(
                f"{sig_id}: evidence_confidence = '{conf}', "
                f"expected one of {sorted(VALID_CONFIDENCE_VALUES)}"
            )
        else:
            r.info(f"{sig_id}: evidence_confidence = {conf}")
    results.append(r)

    # -----------------------------------------------------------------------
    # AC-07 — No invented signals (signal_id must be in known set)
    # -----------------------------------------------------------------------
    r = ValidationResult("AC-07  No invented signals (all signal_ids known)")
    for sig in signals:
        sig_id = sig.get("signal_id", "<unknown>")
        if sig_id not in KNOWN_SIGNAL_IDS:
            r.fail(f"Unknown signal_id '{sig_id}' — not in approved set {sorted(KNOWN_SIGNAL_IDS)}")
        else:
            r.info(f"{sig_id}: recognised")
    # Also verify all known IDs are present
    found_ids = {s.get("signal_id") for s in signals}
    missing = KNOWN_SIGNAL_IDS - found_ids
    if missing:
        r.fail(f"Expected signal IDs not found: {sorted(missing)}")
    results.append(r)

    # -----------------------------------------------------------------------
    # AC-08 — Confidence distribution reflects actual grounding (no all-STRONG)
    # -----------------------------------------------------------------------
    r = ValidationResult("AC-08  Confidence distribution not artificially inflated")
    conf_dist: dict[str, int] = {}
    for sig in signals:
        c = sig.get("evidence_confidence", "UNKNOWN")
        conf_dist[c] = conf_dist.get(c, 0) + 1

    if conf_dist.get("STRONG", 0) == EXPECTED_SIGNAL_COUNT:
        r.fail(
            "All signals rated STRONG — inspect for confidence inflation. "
            "Expected: STRONG=2, MODERATE=2, WEAK=1"
        )
    expected_dist = {"STRONG": 2, "MODERATE": 2, "WEAK": 1}
    for level, expected_count in expected_dist.items():
        actual_count = conf_dist.get(level, 0)
        if actual_count != expected_count:
            r.fail(
                f"Confidence distribution mismatch: {level} = {actual_count}, "
                f"expected {expected_count}"
            )
    if r.passed:
        r.info(f"Distribution: {conf_dist} — matches expected STRONG:2/MODERATE:2/WEAK:1")
    results.append(r)

    return results


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Validate PIOS 41.4 signal_registry.json against acceptance criteria."
    )
    parser.add_argument(
        "--input",
        default="docs/pios/41.4/signal_registry.json",
        help="Path to signal_registry.json (default: docs/pios/41.4/signal_registry.json)",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Show INFO messages in addition to PASS/FAIL.",
    )
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"ERROR: Input file not found: {input_path}")
        sys.exit(1)

    try:
        registry = json.loads(input_path.read_text())
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON in {input_path}: {e}")
        sys.exit(1)

    print(f"Validating: {input_path}")
    print(f"Registry ID: {registry.get('registry_id', '<missing>')}")
    print(f"Run reference: {registry.get('run_reference', '<missing>')}")
    print()

    results = validate_registry(registry)

    all_pass = True
    for r in results:
        status = r.status()
        print(f"[{status}] {r.criterion}")
        if args.verbose or not r.passed:
            for msg in r.messages:
                print(msg)
        if not r.passed:
            all_pass = False

    print()
    if all_pass:
        print("VALIDATION RESULT: PASS")
        print(f"All {len(results)} acceptance criteria passed.")
        sys.exit(0)
    else:
        failed = sum(1 for r in results if not r.passed)
        print(f"VALIDATION RESULT: FAIL")
        print(f"{failed} of {len(results)} criteria failed.")
        sys.exit(1)


if __name__ == "__main__":
    main()
