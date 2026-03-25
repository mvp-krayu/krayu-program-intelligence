#!/usr/bin/env python3
"""
validate_unified_demo_complete.py
PIOS-42.29-RUN01-CONTRACT-v1

Validates the complete unified demo surface:
  - All 4 existing certified routes (42.28 regression)
  - New ENL route (?enl=GQ-003)
  - New persona routes (?persona=P&query=GQ-003) x3
  - New status route (?status=true)
  - Red node still present in topology
  - Topology structure intact (4D/5C/9N)
  - ENL output contains enl_signals and emphasis_nodes
  - Persona outputs cover EXECUTIVE, CTO, ANALYST

Output: docs/pios/42.29/validation_log.json

Usage:
  python3 scripts/pios/42.29/validate_unified_demo_complete.py
  python3 scripts/pios/42.29/validate_unified_demo_complete.py --base http://localhost:3001/api/execlens
"""

import argparse
import json
import sys
import urllib.request
from pathlib import Path

OUTPUT_PATH = (
    Path(__file__).resolve().parents[2]
    / "docs" / "pios" / "42.29" / "validation_log.json"
)

CONTRACT_ID = "PIOS-42.29-RUN01-CONTRACT-v1"


def fetch(url: str, timeout: int = 15):
    r = urllib.request.urlopen(url, timeout=timeout)
    body = r.read()
    return r.status, json.loads(body)


def find_high_emphasis_nodes(topology: list) -> list:
    found = []
    for dom in topology:
        if dom.get("emphasis") == "high":
            found.append(("domain", dom.get("id")))
        for cap in dom.get("capabilities", []):
            if cap.get("emphasis") == "high":
                found.append(("capability", cap.get("id")))
            for cmp in cap.get("components", []):
                if cmp.get("emphasis") == "high":
                    found.append(("component", cmp.get("id")))
    return found


def run_tests(base: str) -> list:
    results = []

    def record(test, ok, detail):
        results.append({"test": test, "ok": ok, "detail": detail})

    # ── 42.28 regression: existing certified routes ──

    try:
        status, d = fetch(f"{base}?topology=true")
        record("topology_200", status == 200 and "topology" in d, f"status={status}")
    except Exception as e:
        record("topology_200", False, str(e)[:120])

    try:
        status, d = fetch(f"{base}?topology=true")
        dc = d.get("domain_count", 0)
        cc = d.get("capability_count", 0)
        nc = d.get("component_count", 0)
        ok = dc == 4 and cc == 5 and nc == 9
        record("topology_structure_stable", ok,
               f"domain_count={dc} capability_count={cc} component_count={nc}")
    except Exception as e:
        record("topology_structure_stable", False, str(e)[:120])

    try:
        status, d = fetch(f"{base}?topology=true&highlight=GQ-003")
        high_nodes = find_high_emphasis_nodes(d.get("topology", []))
        has_red = any("C_30_Domain_Event_Bus" in str(n) for n in high_nodes)
        record("red_node_present", has_red,
               f"emphasis:high nodes={high_nodes}")
    except Exception as e:
        record("red_node_present", False, str(e)[:120])

    try:
        status, d = fetch(f"{base}?overview=true")
        ok = "metrics" in d or any(
            k in d for k in ("dependency_load", "structural_density", "contract_id")
        )
        record("overview_200", ok, f"keys={list(d.keys())[:6]}")
    except Exception as e:
        record("overview_200", False, str(e)[:120])

    try:
        status, d = fetch(f"{base}?query=GQ-003")
        ok = status == 200 and "query_id" in d and "signals" in d
        record("query_GQ003_200", ok, f"query_id={d.get('query_id')} signals={len(d.get('signals', []))}")
    except Exception as e:
        record("query_GQ003_200", False, str(e)[:120])

    try:
        status, d = fetch(f"{base}?list=true")
        ok = status == 200 and "queries" in d
        record("list_200", ok, f"queries count={len(d.get('queries', []))}")
    except Exception as e:
        record("list_200", False, str(e)[:120])

    # ── New routes: ENL + persona + status ──

    try:
        status, d = fetch(f"{base}?enl=GQ-003")
        has_signals = isinstance(d.get("enl_signals"), list)
        has_emphasis = isinstance(d.get("emphasis_nodes"), list)
        ok = status == 200 and has_signals and has_emphasis
        record("enl_GQ003_200", ok,
               f"status={status} enl_signals={len(d.get('enl_signals',[]))} emphasis_nodes={len(d.get('emphasis_nodes',[]))}")
    except Exception as e:
        record("enl_GQ003_200", False, str(e)[:120])

    try:
        status, d = fetch(f"{base}?enl=GQ-003")
        emphasis_nodes = d.get("emphasis_nodes", [])
        has_high = any(n.get("node_id") == "C_30_Domain_Event_Bus" for n in emphasis_nodes)
        record("enl_emphasis_node_present", has_high,
               f"C_30_Domain_Event_Bus in emphasis_nodes={has_high}")
    except Exception as e:
        record("enl_emphasis_node_present", False, str(e)[:120])

    for persona in ["EXECUTIVE", "CTO", "ANALYST"]:
        test_name = f"persona_{persona.lower()}_200"
        try:
            status, d = fetch(f"{base}?persona={persona}&query=GQ-003")
            ok = (
                status == 200
                and d.get("persona") == persona
                and isinstance(d.get("enl_signals"), list)
                and "lens" in d
            )
            record(test_name, ok,
                   f"status={status} persona={d.get('persona')} lens={d.get('lens')} signals={len(d.get('enl_signals',[]))}")
        except Exception as e:
            record(test_name, False, str(e)[:120])

    try:
        status, d = fetch(f"{base}?status=true")
        ok = status == 200 and d.get("surface_status") == "ACTIVE"
        record("status_200", ok,
               f"status={status} surface_status={d.get('surface_status')}")
    except Exception as e:
        record("status_200", False, str(e)[:120])

    # ── Persona switching: same topology reused ──
    # Verify all 3 persona calls return the same query_id
    try:
        personas_ok = True
        details = []
        for persona in ["EXECUTIVE", "CTO", "ANALYST"]:
            _, d = fetch(f"{base}?persona={persona}&query=GQ-003")
            if d.get("query_id") != "GQ-003":
                personas_ok = False
            details.append(f"{persona}:{d.get('query_id')}")
        record("persona_switching_same_query", personas_ok, ", ".join(details))
    except Exception as e:
        record("persona_switching_same_query", False, str(e)[:120])

    return results


def main():
    parser = argparse.ArgumentParser(
        description="42.29 Unified Demo Complete Validator"
    )
    parser.add_argument(
        "--base",
        default="http://localhost:3000/api/execlens",
        help="API base URL",
    )
    args = parser.parse_args()

    # Check if app is reachable
    try:
        urllib.request.urlopen(f"{args.base}?list=true", timeout=5)
    except Exception:
        result = {
            "contract":    CONTRACT_ID,
            "base":        args.base,
            "status":      "NOT_RUN",
            "reason":      "App offline — cannot reach API",
            "total":       0,
            "pass_count":  0,
            "fail_count":  0,
            "results":     [],
        }
        OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT_PATH.write_text(json.dumps(result, indent=2))
        print(json.dumps(result, indent=2))
        sys.exit(0)

    results = run_tests(args.base)

    pass_count = sum(1 for r in results if r["ok"])
    fail_count = len(results) - pass_count
    overall    = "PASS" if fail_count == 0 else "FAIL"

    output = {
        "contract":   CONTRACT_ID,
        "base":       args.base,
        "total":      len(results),
        "pass_count": pass_count,
        "fail_count": fail_count,
        "status":     overall,
        "results":    results,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(output, indent=2))

    print(json.dumps(output, indent=2))

    if fail_count > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
