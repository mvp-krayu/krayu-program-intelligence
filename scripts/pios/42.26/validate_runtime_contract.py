#!/usr/bin/env python3
"""
validate_runtime_contract.py
42.26 — ExecLens Runtime Contract Validation

Validates all 7 API routes against the 42.26 runtime contract.
Requires ExecLens app running at BASE (default: http://localhost:3000).

Usage:
  python3 scripts/pios/42.26/validate_runtime_contract.py
  python3 scripts/pios/42.26/validate_runtime_contract.py --base http://localhost:3001
"""

import json
import os
import sys
import argparse

try:
    import requests
except ImportError:
    print(json.dumps({"error": "requests library not available — install with: pip install requests"}))
    sys.exit(1)

OUTPUT_PATH = "docs/pios/42.26/validation_log.json"


def run_tests(base: str) -> list[dict]:
    tests = [
        ("status",   f"{base}?status=true"),
        ("enl",      f"{base}?enl=GQ-001"),
        ("persona",  f"{base}?persona=EXECUTIVE&query=GQ-001"),
        ("overview", f"{base}?overview=true"),
        ("topology", f"{base}?topology=true&highlight=GQ-001"),
        ("list",     f"{base}?list=true"),
        ("query",    f"{base}?query=GQ-001"),
    ]

    results = []
    for name, url in tests:
        try:
            r = requests.get(url, timeout=10)
            ok = r.status_code == 200
            results.append({
                "test":        name,
                "url":         url,
                "status_code": r.status_code,
                "ok":          ok,
            })
        except Exception as e:
            results.append({
                "test":  name,
                "url":   url,
                "error": str(e),
                "ok":    False,
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
        "contract":    "42.26",
        "base":        args.base,
        "total":       len(results),
        "pass_count":  pass_count,
        "fail_count":  fail_count,
        "status":      "PASS" if fail_count == 0 else "FAIL",
        "results":     results,
    }

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f, indent=2)

    print(json.dumps(output, indent=2))

    if fail_count > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
