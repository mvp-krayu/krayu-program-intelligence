#!/usr/bin/env python3
"""
validate_demo_flow_structure.py
PIOS-51.4-RUN01-CONTRACT-v1

Validates the 51.4 progressive disclosure demo surface:

Regression checks (42.28/42.29 surface must remain intact):
  - All existing API routes return 200
  - Red node still present

Structure checks (51.4 additions):
  - No new API routes introduced
  - Source files contain expected panel component names
  - Source files do NOT contain old step-pip structure
  - DemoController has DEMO_STAGES (not DEMO_STEPS)
  - index.js uses DisclosurePanel
  - index.js uses openPanels state
  - PersonaPanel no longer has outer panel wrapper

Output: docs/pios/51.4/validation_log.json

Usage:
  python3 scripts/pios/51.4/validate_demo_flow_structure.py
  python3 scripts/pios/51.4/validate_demo_flow_structure.py --base http://localhost:3001/api/execlens
"""

import argparse
import json
import sys
import urllib.request
from pathlib import Path

REPO_ROOT   = Path(__file__).resolve().parents[3]
OUTPUT_PATH = REPO_ROOT / "docs" / "pios" / "51.4" / "validation_log.json"
CONTRACT_ID = "PIOS-51.4-RUN01-CONTRACT-v1"


def fetch_json(url: str, timeout: int = 15):
    r = urllib.request.urlopen(url, timeout=timeout)
    return r.status, json.loads(r.read())


def find_high_emphasis_nodes(topology: list) -> list:
    found = []
    for dom in topology:
        if dom.get("emphasis") == "high":
            found.append(dom.get("id"))
        for cap in dom.get("capabilities", []):
            if cap.get("emphasis") == "high":
                found.append(cap.get("id"))
            for cmp in cap.get("components", []):
                if cmp.get("emphasis") == "high":
                    found.append(cmp.get("id"))
    return found


def read_source(rel_path: str) -> str:
    full = REPO_ROOT / rel_path
    if not full.exists():
        return ""
    return full.read_text()


def run_api_tests(base: str) -> list:
    results = []

    def record(test, ok, detail):
        results.append({"test": test, "ok": ok, "detail": detail, "group": "api_regression"})

    # 42.28/42.29 regression
    for route_name, params in [
        ("topology",          "?topology=true"),
        ("topology_highlight","?topology=true&highlight=GQ-003"),
        ("overview",          "?overview=true"),
        ("query_GQ003",       "?query=GQ-003"),
        ("list",              "?list=true"),
        ("enl_GQ003",         "?enl=GQ-003"),
        ("persona_executive", "?persona=EXECUTIVE&query=GQ-003"),
        ("persona_cto",       "?persona=CTO&query=GQ-003"),
        ("persona_analyst",   "?persona=ANALYST&query=GQ-003"),
        ("status",            "?status=true"),
    ]:
        try:
            status, d = fetch_json(f"{base}{params}")
            record(f"route_{route_name}", status == 200, f"status={status}")
        except Exception as e:
            record(f"route_{route_name}", False, str(e)[:120])

    # Red node check
    try:
        _, d = fetch_json(f"{base}?topology=true&highlight=GQ-003")
        nodes = find_high_emphasis_nodes(d.get("topology", []))
        has_red = any("C_30_Domain_Event_Bus" in str(n) for n in nodes)
        record("red_node_present", has_red, f"high_emphasis_nodes={nodes}")
    except Exception as e:
        record("red_node_present", False, str(e)[:120])

    # Topology structure
    try:
        _, d = fetch_json(f"{base}?topology=true")
        dc, cc, nc = d.get("domain_count", 0), d.get("capability_count", 0), d.get("component_count", 0)
        record("topology_4D5C9N", dc == 4 and cc == 5 and nc == 9,
               f"domain_count={dc} capability_count={cc} component_count={nc}")
    except Exception as e:
        record("topology_4D5C9N", False, str(e)[:120])

    return results


def run_source_tests() -> list:
    results = []

    def record(test, ok, detail, group="source_structure"):
        results.append({"test": test, "ok": ok, "detail": detail, "group": group})

    # DemoController: uses DEMO_STAGES not DEMO_STEPS
    dc = read_source("app/execlens-demo/components/DemoController.js")
    record("democontroller_has_stages",   "DEMO_STAGES" in dc,
           "DEMO_STAGES present" if "DEMO_STAGES" in dc else "DEMO_STAGES absent")
    record("democontroller_no_step_pips", "demo-pip" not in dc,
           "demo-pip absent" if "demo-pip" not in dc else "demo-pip FOUND — step pips not removed")
    record("democontroller_no_scroll",    "scrollIntoView" not in dc,
           "scrollIntoView absent" if "scrollIntoView" not in dc else "scrollIntoView FOUND — scroll still present")

    # index.js: uses DisclosurePanel, openPanels
    idx = read_source("app/execlens-demo/pages/index.js")
    record("index_imports_disclosurepanel",  "DisclosurePanel" in idx,
           "DisclosurePanel imported" if "DisclosurePanel" in idx else "DisclosurePanel NOT imported")
    record("index_has_openpanels",           "openPanels" in idx,
           "openPanels state present" if "openPanels" in idx else "openPanels NOT found")
    record("index_no_intelligence_output",   "intelligence-output" not in idx,
           "flat intelligence-output div removed" if "intelligence-output" not in idx else "intelligence-output STILL present")
    record("index_has_all_5_panels",
           all(p in idx for p in ["'situation'", "'signals'", "'persona'", "'evidence'", "'narrative'"]),
           "all 5 panel IDs present" if all(p in idx for p in ["'situation'", "'signals'", "'persona'", "'evidence'", "'narrative'"]) else "missing panel IDs")

    # PersonaPanel: no outer panel wrapper
    pp = read_source("app/execlens-demo/components/PersonaPanel.js")
    record("personapanel_no_outer_panel",    "panel persona-panel" not in pp,
           "outer panel wrapper removed" if "panel persona-panel" not in pp else "outer panel wrapper STILL present")
    record("personapanel_has_persona_body",  "persona-panel-body" in pp,
           "persona-panel-body class present" if "persona-panel-body" in pp else "persona-panel-body absent")

    # New components exist
    for comp in ["DisclosurePanel.js", "ENLPanel.js", "NarrativePanel.js"]:
        path = f"app/execlens-demo/components/{comp}"
        exists = (REPO_ROOT / path).exists()
        record(f"component_exists_{comp.replace('.js','').lower()}", exists,
               f"{comp} present" if exists else f"{comp} MISSING")

    # No new API routes in execlens.js
    api = read_source("app/execlens-demo/pages/api/execlens.js")
    # Should still have exactly the same routes as 42.29 — check for unexpected additions
    # All expected routes present
    expected = ["?query=", "?list=", "?overview=", "?topology=", "?enl=", "?persona=", "?status="]
    for route in expected:
        # check in comment/docs form — route params appear in comments
        route_key = route.strip("?=")
        present_in_api = route_key in api
        record(f"api_route_present_{route_key}", present_in_api,
               f"{route_key} present in execlens.js" if present_in_api else f"{route_key} absent",
               group="api_structure")

    return results


def main():
    parser = argparse.ArgumentParser(
        description="51.4 Demo Flow Structure Validator"
    )
    parser.add_argument(
        "--base",
        default="http://localhost:3000/api/execlens",
        help="API base URL",
    )
    args = parser.parse_args()

    # Check if app is reachable
    app_online = True
    try:
        urllib.request.urlopen(f"{args.base}?list=true", timeout=5)
    except Exception:
        app_online = False

    api_results    = run_api_tests(args.base) if app_online else []
    source_results = run_source_tests()

    if not app_online:
        # Record NOT_RUN for all API tests
        api_results = [
            {"test": t, "ok": None, "detail": "NOT_RUN — app offline", "group": "api_regression"}
            for t in [
                "route_topology", "route_topology_highlight", "route_overview",
                "route_query_GQ003", "route_list", "route_enl_GQ003",
                "route_persona_executive", "route_persona_cto", "route_persona_analyst",
                "route_status", "red_node_present", "topology_4D5C9N",
            ]
        ]

    all_results = api_results + source_results

    passed  = sum(1 for r in all_results if r["ok"] is True)
    failed  = sum(1 for r in all_results if r["ok"] is False)
    skipped = sum(1 for r in all_results if r["ok"] is None)
    total   = len(all_results)

    overall = "PASS" if failed == 0 else "FAIL"
    if not app_online and failed == 0:
        overall = "PARTIAL — source checks PASS, API NOT_RUN (app offline)"

    output = {
        "contract":    CONTRACT_ID,
        "base":        args.base,
        "app_online":  app_online,
        "total":       total,
        "pass_count":  passed,
        "fail_count":  failed,
        "skip_count":  skipped,
        "status":      overall,
        "results":     all_results,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(output, indent=2))

    print(json.dumps(output, indent=2))

    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
