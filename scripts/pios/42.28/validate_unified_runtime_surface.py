#!/usr/bin/env python3
"""
validate_unified_runtime_surface.py
42.28 — Unified Live Runtime Surface Regression Validator

Validates the complete active runtime surface and regression controls:
  1.  topology_200                — ?topology=true returns 200 with topology[]
  2.  topology_structure_stable   — domain_count=4, capability_count=5, component_count=9
  3.  topology_contract_id        — contract_id = PIOS-42.7-RUN01-CONTRACT-v2
  4.  topology_highlight_200      — ?topology=true&highlight=GQ-003 returns 200
  5.  topology_highlight_id       — highlight_query_id=GQ-003 in response
  6.  red_node_present            — C_30_Domain_Event_Bus carries emphasis:high
  7.  emphasis_field_on_all_nodes — all domain/cap/cmp nodes carry emphasis field
  8.  emphasis_values_valid       — all emphasis values in closed set
  9.  projection_file_emphasis    — 44.2 projection_attachment.json has C_30_Domain_Event_Bus:high
  10. overview_200                — ?overview=true returns 200 with metric fields
  11. query_GQ003_200             — ?query=GQ-003 returns 200 with query_id
  12. list_200                    — ?list=true returns 200 with queries[]

Requires ExecLens app running at BASE (default: http://localhost:3000).

Usage:
  python3 scripts/pios/42.28/validate_unified_runtime_surface.py
  python3 scripts/pios/42.28/validate_unified_runtime_surface.py --base http://localhost:3001
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

OUTPUT_PATH                = "docs/pios/42.28/validation_log.json"
PROJECTION_ATTACHMENT_PATH = "docs/pios/44.2/projection_attachment.json"
VALID_EMPHASIS             = {"high", "medium", "low", "none"}
EXPECTED_CONTRACT_ID       = "PIOS-42.7-RUN01-CONTRACT-v2"
EXPECTED_RED_NODE          = "C_30_Domain_Event_Bus"


def check_emphasis_fields(nodes: list, path: str = "") -> list:
    issues = []
    for node in nodes:
        nid = node.get("id", "?")
        loc = f"{path}/{nid}" if path else nid
        if "emphasis" not in node:
            issues.append(f"MISSING emphasis on {loc}")
        elif node["emphasis"] not in VALID_EMPHASIS:
            issues.append(f"INVALID emphasis '{node['emphasis']}' on {loc}")
        for cap in node.get("capabilities", []):
            cid = cap.get("id", "?")
            cloc = f"{loc}/{cid}"
            if "emphasis" not in cap:
                issues.append(f"MISSING emphasis on cap {cloc}")
            elif cap["emphasis"] not in VALID_EMPHASIS:
                issues.append(f"INVALID emphasis '{cap['emphasis']}' on cap {cloc}")
            for cmp in cap.get("components", []):
                mid = cmp.get("id", "?")
                mloc = f"{cloc}/{mid}"
                if "emphasis" not in cmp:
                    issues.append(f"MISSING emphasis on cmp {mloc}")
                elif cmp["emphasis"] not in VALID_EMPHASIS:
                    issues.append(f"INVALID emphasis '{cmp['emphasis']}' on cmp {mloc}")
    return issues


def find_high_emphasis_nodes(nodes: list) -> list:
    found = []
    for dom in nodes:
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
    topo_data = None
    topo_hl_data = None

    # ------------------------------------------------------------------ #
    # 1 — topology_200
    # ------------------------------------------------------------------ #
    try:
        r = requests.get(f"{base}?topology=true", timeout=15)
        ok = r.status_code == 200
        if ok:
            topo_data = r.json()
            has_topo = isinstance(topo_data.get("topology"), list)
        else:
            has_topo = False
        results.append({
            "test": "topology_200",
            "ok": ok and has_topo,
            "detail": "topology[] present" if has_topo else f"status={r.status_code} or topology[] missing",
        })
    except Exception as e:
        results.append({"test": "topology_200", "ok": False, "detail": str(e)})
        # No point continuing topology checks
        for t in ["topology_structure_stable", "topology_contract_id",
                  "emphasis_field_on_all_nodes", "emphasis_values_valid", "red_node_present"]:
            results.append({"test": t, "ok": False, "detail": "skipped — topology_200 failed"})
        topo_data = None

    # ------------------------------------------------------------------ #
    # 2 — topology_structure_stable
    # ------------------------------------------------------------------ #
    if topo_data is not None:
        dc = topo_data.get("domain_count")
        cc = topo_data.get("capability_count")
        nc = topo_data.get("component_count")
        ok = dc == 4 and cc == 5 and nc == 9
        results.append({
            "test": "topology_structure_stable",
            "ok": ok,
            "detail": f"domain_count={dc} capability_count={cc} component_count={nc}" +
                      (" (expected 4/5/9)" if not ok else ""),
        })

    # ------------------------------------------------------------------ #
    # 3 — topology_contract_id
    # ------------------------------------------------------------------ #
    if topo_data is not None:
        cid = topo_data.get("contract_id")
        ok = cid == EXPECTED_CONTRACT_ID
        results.append({
            "test": "topology_contract_id",
            "ok": ok,
            "detail": f"contract_id={cid}" + (f" (expected {EXPECTED_CONTRACT_ID})" if not ok else ""),
        })

    # ------------------------------------------------------------------ #
    # 4 — topology_highlight_200
    # ------------------------------------------------------------------ #
    try:
        r = requests.get(f"{base}?topology=true&highlight=GQ-003", timeout=15)
        ok = r.status_code == 200
        if ok:
            topo_hl_data = r.json()
        results.append({
            "test": "topology_highlight_200",
            "ok": ok,
            "detail": f"status={r.status_code}",
        })
    except Exception as e:
        results.append({"test": "topology_highlight_200", "ok": False, "detail": str(e)})
        topo_hl_data = None

    # ------------------------------------------------------------------ #
    # 5 — topology_highlight_id
    # ------------------------------------------------------------------ #
    if topo_hl_data is not None:
        hq = topo_hl_data.get("highlight_query_id")
        ok = hq == "GQ-003"
        results.append({
            "test": "topology_highlight_id",
            "ok": ok,
            "detail": f"highlight_query_id={hq}" + (" (expected GQ-003)" if not ok else ""),
        })
    else:
        results.append({"test": "topology_highlight_id", "ok": False, "detail": "skipped — topology_highlight_200 failed"})

    # ------------------------------------------------------------------ #
    # 6 — red_node_present
    # ------------------------------------------------------------------ #
    if topo_hl_data is not None:
        high_nodes = find_high_emphasis_nodes(topo_hl_data.get("topology", []))
        red_node_ids = [n[1] for n in high_nodes]
        ok = EXPECTED_RED_NODE in red_node_ids
        results.append({
            "test": "red_node_present",
            "ok": ok,
            "detail": f"emphasis:high nodes={high_nodes}" +
                      (f" — {EXPECTED_RED_NODE} NOT found" if not ok else f" — {EXPECTED_RED_NODE} confirmed"),
        })
    else:
        results.append({"test": "red_node_present", "ok": False, "detail": "skipped — topology_highlight_200 failed"})

    # ------------------------------------------------------------------ #
    # 7 — emphasis_field_on_all_nodes
    # ------------------------------------------------------------------ #
    if topo_data is not None:
        issues = check_emphasis_fields(topo_data.get("topology", []))
        ok = len(issues) == 0
        results.append({
            "test": "emphasis_field_on_all_nodes",
            "ok": ok,
            "detail": f"{len(issues)} issue(s): {issues[:3]}" if issues else "all nodes carry emphasis field",
        })

    # ------------------------------------------------------------------ #
    # 8 — emphasis_values_valid (covered by check_emphasis_fields above)
    # ------------------------------------------------------------------ #
    results.append({
        "test": "emphasis_values_valid",
        "ok": results[-1]["ok"] if topo_data is not None else False,
        "detail": "covered by emphasis_field_on_all_nodes check" if topo_data is not None else "skipped",
    })

    # ------------------------------------------------------------------ #
    # 9 — projection_file_emphasis
    # ------------------------------------------------------------------ #
    try:
        with open(PROJECTION_ATTACHMENT_PATH) as f:
            proj = json.load(f)
        emphases = {p["node_reference"]["node_id"]: p.get("emphasis", "none")
                    for p in proj.get("projections", [])
                    if p.get("attachment_status") == "ATTACHED"}
        red_in_file = emphases.get(EXPECTED_RED_NODE)
        ok = red_in_file == "high"
        results.append({
            "test": "projection_file_emphasis",
            "ok": ok,
            "detail": f"{EXPECTED_RED_NODE} emphasis={red_in_file}" +
                      (" (expected high)" if not ok else " — confirmed in 44.2 artifact"),
        })
    except Exception as e:
        results.append({"test": "projection_file_emphasis", "ok": False, "detail": str(e)})

    # ------------------------------------------------------------------ #
    # 10 — overview_200
    # ------------------------------------------------------------------ #
    try:
        r = requests.get(f"{base}?overview=true", timeout=15)
        ok = r.status_code == 200
        if ok:
            d = r.json()
            # Response shape: {"contract_id": ..., "metrics": [...]}
            has_fields = "metrics" in d or any(k in d for k in [
                "dependency_load", "structural_density",
                "coordination_pressure", "visibility_deficit"])
        else:
            has_fields = False
        results.append({
            "test": "overview_200",
            "ok": ok and has_fields,
            "detail": "metrics present" if has_fields else f"status={r.status_code} or metrics missing",
        })
    except Exception as e:
        results.append({"test": "overview_200", "ok": False, "detail": str(e)})

    # ------------------------------------------------------------------ #
    # 11 — query_GQ003_200
    # ------------------------------------------------------------------ #
    try:
        r = requests.get(f"{base}?query=GQ-003", timeout=15)
        ok = r.status_code == 200
        if ok:
            d = r.json()
            has_qid = "query_id" in d or "signals" in d
        else:
            has_qid = False
        results.append({
            "test": "query_GQ003_200",
            "ok": ok and has_qid,
            "detail": "query_id/signals present" if has_qid else f"status={r.status_code} or fields missing",
        })
    except Exception as e:
        results.append({"test": "query_GQ003_200", "ok": False, "detail": str(e)})

    # ------------------------------------------------------------------ #
    # 12 — list_200
    # ------------------------------------------------------------------ #
    try:
        r = requests.get(f"{base}?list=true", timeout=15)
        ok = r.status_code == 200
        if ok:
            d = r.json()
            has_queries = "queries" in d
        else:
            has_queries = False
        results.append({
            "test": "list_200",
            "ok": ok and has_queries,
            "detail": "queries[] present" if has_queries else f"status={r.status_code} or queries[] missing",
        })
    except Exception as e:
        results.append({"test": "list_200", "ok": False, "detail": str(e)})

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
        "contract":   "42.28",
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
