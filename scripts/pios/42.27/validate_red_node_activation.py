#!/usr/bin/env python3
"""
validate_red_node_activation.py
42.27 — Projection-Driven Red Node Activation Validation

Validates:
  1. /api/execlens?topology=true returns 200 with topology array
  2. All topology nodes carry an 'emphasis' field
  3. 'emphasis' values are in the governed closed set {high, medium, low, none}
  4. Emphasis values match the 44.2 projection attachment baseline

Requires ExecLens app running at BASE (default: http://localhost:3000).

Usage:
  python3 scripts/pios/42.27/validate_red_node_activation.py
  python3 scripts/pios/42.27/validate_red_node_activation.py --base http://localhost:3001
"""

import json
import os
import sys
import argparse
from pathlib import Path

try:
    import requests
except ImportError:
    print(json.dumps({"error": "requests library not available — install with: pip install requests"}))
    sys.exit(1)

OUTPUT_PATH               = "docs/pios/42.27/validation_log.json"
PROJECTION_ATTACHMENT_PATH = "docs/pios/44.2/projection_attachment.json"
VALID_EMPHASIS_VALUES     = {"high", "medium", "low", "none"}


def load_emphasis_baseline() -> dict:
    """Load expected emphasis values from 44.2 projection attachment."""
    try:
        with open(PROJECTION_ATTACHMENT_PATH) as f:
            data = json.load(f)
        return {
            p["node_reference"]["node_id"]: p.get("emphasis", "none")
            for p in data.get("projections", [])
            if p.get("attachment_status") == "ATTACHED"
        }
    except Exception as e:
        return {"_load_error": str(e)}


def check_emphasis_fields(nodes: list, path: str = "") -> list:
    """Recursively check emphasis fields on topology nodes."""
    issues = []
    for node in nodes:
        node_id = node.get("id", "?")
        loc = f"{path}/{node_id}" if path else node_id

        if "emphasis" not in node:
            issues.append(f"MISSING emphasis on {loc}")
        elif node["emphasis"] not in VALID_EMPHASIS_VALUES:
            issues.append(f"INVALID emphasis '{node['emphasis']}' on {loc}")

        for cap in node.get("capabilities", []):
            cap_id = cap.get("id", "?")
            cap_loc = f"{loc}/{cap_id}"
            if "emphasis" not in cap:
                issues.append(f"MISSING emphasis on capability {cap_loc}")
            elif cap["emphasis"] not in VALID_EMPHASIS_VALUES:
                issues.append(f"INVALID emphasis '{cap['emphasis']}' on capability {cap_loc}")

            for cmp in cap.get("components", []):
                cmp_id = cmp.get("id", "?")
                cmp_loc = f"{cap_loc}/{cmp_id}"
                if "emphasis" not in cmp:
                    issues.append(f"MISSING emphasis on component {cmp_loc}")
                elif cmp["emphasis"] not in VALID_EMPHASIS_VALUES:
                    issues.append(f"INVALID emphasis '{cmp['emphasis']}' on component {cmp_loc}")

    return issues


def run_tests(base: str) -> list:
    results = []

    # Test 1: topology route returns 200 with topology array
    try:
        r = requests.get(f"{base}?topology=true", timeout=10)
        ok = r.status_code == 200
        if ok:
            data = r.json()
            has_topology = isinstance(data.get("topology"), list)
        else:
            data = {}
            has_topology = False

        results.append({
            "test":        "topology_200",
            "url":         f"{base}?topology=true",
            "status_code": r.status_code,
            "ok":          ok and has_topology,
            "detail":      "topology array present" if has_topology else "topology array missing or non-200",
        })
    except Exception as e:
        results.append({
            "test":   "topology_200",
            "url":    f"{base}?topology=true",
            "error":  str(e),
            "ok":     False,
        })
        return results  # No point continuing

    # Test 2: all nodes carry emphasis field with valid value
    domains = data.get("topology", [])
    issues = check_emphasis_fields(domains)
    results.append({
        "test":    "emphasis_fields_present_and_valid",
        "ok":      len(issues) == 0,
        "issues":  issues,
        "detail":  f"{len(issues)} issue(s) found" if issues else "all nodes carry valid emphasis",
    })

    # Test 3: emphasis values match 44.2 projection baseline
    baseline = load_emphasis_baseline()
    if "_load_error" in baseline:
        results.append({
            "test":   "emphasis_matches_baseline",
            "ok":     False,
            "detail": f"Could not load baseline: {baseline['_load_error']}",
        })
    else:
        mismatches = []
        for dom in domains:
            for cap in dom.get("capabilities", []):
                cap_id = cap.get("id")
                if cap_id in baseline:
                    expected = baseline[cap_id]
                    actual   = cap.get("emphasis", "none")
                    if actual != expected:
                        mismatches.append(
                            f"cap {cap_id}: expected '{expected}', got '{actual}'"
                        )
        results.append({
            "test":       "emphasis_matches_baseline",
            "ok":         len(mismatches) == 0,
            "mismatches": mismatches,
            "detail":     f"{len(mismatches)} mismatch(es)" if mismatches else "all emphasis values match 44.2 baseline",
        })

    return results


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="http://localhost:3000/api/execlens",
                        help="API base URL (default: http://localhost:3000/api/execlens)")
    args = parser.parse_args()

    results = run_tests(args.base)

    pass_count = sum(1 for r in results if r["ok"])
    fail_count = len(results) - pass_count

    output = {
        "contract":   "42.27",
        "base":       args.base,
        "total":      len(results),
        "pass_count": pass_count,
        "fail_count": fail_count,
        "status":     "PASS" if fail_count == 0 else "FAIL",
        "results":    results,
    }

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f, indent=2)

    print(json.dumps(output, indent=2))

    if fail_count > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
