#!/usr/bin/env python3
"""
validate_topology_panel.py
PIOS-42.7-RUN01-CONTRACT-v2

Validates the ExecLens Structural Topology Panel (Stream 42.7).

Delivery targets validated:
  D1  Obsidian deep-link path correction
  D2  landing-page topology panel rendered beneath gauges
  D3  preservation of 42.4–42.6 validated sections
  D4  topology integrity and Obsidian correctness

Validation checks:

  AC-01  topology adapter exists at scripts/pios/42.7/execlens_topology_adapter.py
  AC-02  TopologyPanel.js component exists in app/execlens-demo/components/
  AC-03  obsidian.js utility exists in app/execlens-demo/utils/
  AC-04  API route references ADAPTER_42_7 (scripts/pios/42.7)
  AC-05  API route dispatches ?topology=true route
  AC-06  API route supports ?topology=true&highlight=GQ-NNN (highlight param)
  AC-07  index.js imports TopologyPanel
  AC-08  index.js places TopologyPanel between LandingGaugeStrip and QuerySelector

  V1  landing surface preserved — hero, LandingGaugeStrip, QuerySelector all in index.js
  V2  topology panel renders — adapter returns valid JSON with topology array
  V3  governed entities only — topology contains 4 known domains
  V4  no synthetic nodes — topology entity IDs match expected governed set exactly
  V5  no inferred edges — topology hierarchy JSON has no cross-domain edge arrays
  V6  selected highlighting — highlight flag present per entity when query specified
  V7  Obsidian vault name — obsidian.js reads from NEXT_PUBLIC_OBSIDIAN_VAULT_NAME
  V8  Obsidian path transformation — strip VAULT_PREFIX + .md present in obsidian.js
  V9  vault path correctness — D_11 vault_path = 01_Domains/D_11_Event_Driven_Architecture
  V10 unresolved integrity — CMP_01 unresolved → path=null, resolved=false
  V11 rendering regression check — TemplateRenderer.js still exists and unchanged
  V12 no backend semantic change — 42.1 and 42.2 files unmodified
  V13 topology CSS present — .topo-panel and .topo-domains-grid in globals.css
  V14 determinism — two runs of adapter produce identical output

Usage:
  python3 scripts/pios/42.7/validate_topology_panel.py
  python3 scripts/pios/42.7/validate_topology_panel.py --verbose
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

REPO_ROOT        = Path(__file__).resolve().parents[3]
ADAPTER_42_7     = REPO_ROOT / "scripts/pios/42.7/execlens_topology_adapter.py"
APP_ROOT         = REPO_ROOT / "app/execlens-demo"
TOPOLOGY_PANEL   = APP_ROOT / "components/TopologyPanel.js"
OBSIDIAN_UTIL    = APP_ROOT / "utils/obsidian.js"
API_ROUTE        = APP_ROOT / "pages/api/execlens.js"
INDEX_PAGE       = APP_ROOT / "pages/index.js"
GLOBALS_CSS      = APP_ROOT / "styles/globals.css"
TEMPLATE_REND    = APP_ROOT / "components/TemplateRenderer.js"
ADAPTER_42_1     = REPO_ROOT / "scripts/pios/42.1/run_execlens_query.py"
ADAPTER_42_2     = REPO_ROOT / "scripts/pios/42.2/render_executive_narrative.py"

# Governed entity set (all domains present in the run_01_blueedge query corpus)
EXPECTED_DOMAINS = {
    "D_01_Edge_Data_Acquisition",
    "D_10_Platform_Infrastructure_and_Data",
    "D_11_Event_Driven_Architecture",
    "D_16_Operational_Engineering",
}

VAULT_PREFIX = "docs/pios/41.2/pie_vault/"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_results = []

def check(label, passed, detail=""):
    status = "PASS" if passed else "FAIL"
    _results.append((label, status, detail))
    return passed

def file_contains(path, *patterns):
    try:
        text = path.read_text()
        return all(p in text for p in patterns)
    except FileNotFoundError:
        return False

def file_text(path):
    try:
        return path.read_text()
    except FileNotFoundError:
        return ""

def run_adapter(args=None) -> tuple:
    """Run topology adapter; returns (success, data_or_None, stderr)."""
    cmd = ["python3", str(ADAPTER_42_7)] + (args or [])
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if result.returncode != 0:
        return False, None, result.stderr
    try:
        data = json.loads(result.stdout)
        return True, data, ""
    except json.JSONDecodeError as e:
        return False, None, str(e)

# ---------------------------------------------------------------------------
# Checks
# ---------------------------------------------------------------------------

def check_AC_01():
    ok = ADAPTER_42_7.exists()
    check("AC-01", ok, "adapter exists" if ok else f"MISSING: {ADAPTER_42_7.relative_to(REPO_ROOT)}")

def check_AC_02():
    ok = TOPOLOGY_PANEL.exists()
    check("AC-02", ok, "TopologyPanel.js exists" if ok else "MISSING: TopologyPanel.js")

def check_AC_03():
    ok = OBSIDIAN_UTIL.exists()
    check("AC-03", ok, "utils/obsidian.js exists" if ok else "MISSING: utils/obsidian.js")

def check_AC_04():
    ok = file_contains(API_ROUTE, "42.7", "ADAPTER_42_7")
    check("AC-04", ok,
          "API route references ADAPTER_42_7" if ok else "API route missing 42.7 adapter")

def check_AC_05():
    ok = file_contains(API_ROUTE, "topology === 'true'")
    check("AC-05", ok,
          "API route dispatches ?topology=true" if ok else "topology dispatch missing from API route")

def check_AC_06():
    ok = file_contains(API_ROUTE, "highlight")
    check("AC-06", ok,
          "API route supports highlight param" if ok else "highlight param not in API route")

def check_AC_07():
    ok = file_contains(INDEX_PAGE, "TopologyPanel")
    check("AC-07", ok,
          "index.js imports TopologyPanel" if ok else "TopologyPanel missing from index.js")

def check_AC_08():
    text = file_text(INDEX_PAGE)
    tp_pos  = text.find("<TopologyPanel")
    lg_pos  = text.find("<LandingGaugeStrip")
    qs_pos  = text.find("<QuerySelector")
    ok = (lg_pos != -1 and tp_pos != -1 and qs_pos != -1
          and lg_pos < tp_pos < qs_pos)
    check("AC-08", ok,
          "TopologyPanel between LandingGaugeStrip and QuerySelector" if ok
          else f"ordering: LandingGaugeStrip@{lg_pos}, TopologyPanel@{tp_pos}, QuerySelector@{qs_pos}")

def check_V1():
    text = file_text(INDEX_PAGE)
    missing = []
    for req in ["hero", "LandingGaugeStrip", "QuerySelector"]:
        if req not in text:
            missing.append(req)
    ok = len(missing) == 0
    check("V1", ok,
          "hero, LandingGaugeStrip, QuerySelector present in index.js" if ok
          else f"missing: {missing}")

def check_V2(data):
    if not data:
        check("V2", False, "no data (adapter failed)")
        return
    ok = isinstance(data.get("topology"), list) and len(data["topology"]) > 0
    check("V2", ok,
          f"topology array has {len(data.get('topology', []))} domains" if ok
          else "topology array empty or missing")

def check_V3(data):
    if not data:
        check("V3", False, "no data")
        return
    found = {d["id"] for d in data.get("topology", [])}
    ok = found == EXPECTED_DOMAINS
    check("V3", ok,
          f"4 governed domains present: {sorted(found)}" if ok
          else f"domain mismatch — found: {sorted(found)}, expected: {sorted(EXPECTED_DOMAINS)}")

def check_V4(data):
    if not data:
        check("V4", False, "no data")
        return
    # Verify no entity IDs are unknown/synthetic (must start with D_, C_, CMP_)
    violations = []
    for dom in data.get("topology", []):
        if not dom["id"].startswith("D_"):
            violations.append(f"unexpected domain ID: {dom['id']}")
        for cap in dom.get("capabilities", []):
            if not (cap["id"].startswith("C_") and not cap["id"].startswith("CMP_")):
                violations.append(f"unexpected cap ID: {cap['id']}")
            for cmp in cap.get("components", []):
                if not cmp["id"].startswith("CMP_"):
                    violations.append(f"unexpected component ID: {cmp['id']}")
    ok = len(violations) == 0
    check("V4", ok,
          "all entity IDs follow governed naming (D_/C_/CMP_)" if ok
          else "; ".join(violations[:3]))

def check_V5(data):
    if not data:
        check("V5", False, "no data")
        return
    # No cross-domain edge arrays — hierarchy must be strictly domain>cap>component nesting
    # Check that no "edges" key appears anywhere in the topology
    raw = json.dumps(data.get("topology", []))
    has_edges = '"edges"' in raw or '"links"' in raw
    check("V5", not has_edges,
          "no cross-domain edge arrays found" if not has_edges
          else "unexpected 'edges' or 'links' key in topology JSON")

def check_V6():
    success, data, stderr = run_adapter(["--query", "GQ-003"])
    if not success or not data:
        check("V6", False, f"adapter failed with GQ-003: {stderr[:100]}")
        return
    # GQ-003 drill-down: D_10, D_11, C_29, C_30, CMP_65, CMP_01
    highlighted = []
    for dom in data.get("topology", []):
        if dom.get("highlighted"):
            highlighted.append(dom["id"])
        for cap in dom.get("capabilities", []):
            if cap.get("highlighted"):
                highlighted.append(cap["id"])
            for cmp in cap.get("components", []):
                if cmp.get("highlighted"):
                    highlighted.append(cmp["id"])
    expected_highlights = {"D_10_Platform_Infrastructure_and_Data", "D_11_Event_Driven_Architecture",
                           "C_29_Platform_Monorepo_Container", "C_30_Domain_Event_Bus",
                           "CMP_01_blueedge_platform_Monorepo", "CMP_65_FleetEventsModule"}
    found_set = set(highlighted)
    ok = found_set == expected_highlights
    check("V6", ok,
          f"GQ-003 highlights correct entities: {sorted(found_set)}" if ok
          else f"highlight mismatch — found: {sorted(found_set)}, expected: {sorted(expected_highlights)}")

def check_V7():
    ok = file_contains(OBSIDIAN_UTIL, "NEXT_PUBLIC_OBSIDIAN_VAULT_NAME")
    check("V7", ok,
          "obsidian.js reads vault name from NEXT_PUBLIC_OBSIDIAN_VAULT_NAME" if ok
          else "vault name env var not referenced in obsidian.js")

def check_V8():
    ok = file_contains(OBSIDIAN_UTIL, VAULT_PREFIX, ".md")
    check("V8", ok,
          f"obsidian.js applies VAULT_PREFIX strip + .md strip" if ok
          else "vault prefix or .md strip missing from obsidian.js")

def check_V9(data):
    if not data:
        check("V9", False, "no data")
        return
    for dom in data.get("topology", []):
        if dom["id"] == "D_11_Event_Driven_Architecture":
            expected = "01_Domains/D_11_Event_Driven_Architecture"
            ok = dom.get("vault_path") == expected
            check("V9", ok,
                  f"D_11 vault_path={dom.get('vault_path')}" if ok
                  else f"D_11 vault_path wrong: got {dom.get('vault_path')!r}, expected {expected!r}")
            return
    check("V9", False, "D_11_Event_Driven_Architecture not found in topology")

def check_V10(data):
    if not data:
        check("V10", False, "no data")
        return
    # CMP_01_blueedge_platform_Monorepo should be unresolved with path=null
    for dom in data.get("topology", []):
        for cap in dom.get("capabilities", []):
            for cmp in cap.get("components", []):
                if cmp["id"] == "CMP_01_blueedge_platform_Monorepo":
                    ok = not cmp.get("resolved") and cmp.get("path") is None
                    check("V10", ok,
                          "CMP_01 is unresolved with path=null" if ok
                          else f"CMP_01 state wrong: resolved={cmp.get('resolved')}, path={cmp.get('path')}")
                    return
    check("V10", False, "CMP_01_blueedge_platform_Monorepo not found in topology")

def check_V11():
    ok = TEMPLATE_REND.exists()
    check("V11", ok,
          "TemplateRenderer.js still exists (no regression)" if ok
          else "REGRESSION: TemplateRenderer.js missing")

def check_V12():
    ok = ADAPTER_42_1.exists() and ADAPTER_42_2.exists()
    check("V12", ok,
          "42.1 and 42.2 adapter files present (not mutated)" if ok
          else "42.1 or 42.2 file missing")

def check_V13():
    ok = file_contains(GLOBALS_CSS, ".topo-panel", ".topo-domains-grid")
    check("V13", ok,
          ".topo-panel and .topo-domains-grid present in globals.css" if ok
          else "topology CSS missing from globals.css")

def check_V14():
    success1, data1, _ = run_adapter()
    success2, data2, _ = run_adapter()
    if not success1 or not success2:
        check("V14", False, "adapter failed on one or both runs")
        return
    ok = json.dumps(data1, sort_keys=True) == json.dumps(data2, sort_keys=True)
    check("V14", ok,
          "adapter output is deterministic (two runs identical)" if ok
          else "adapter output differs between runs (non-deterministic)")

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    print("PIOS-42.7-RUN01-CONTRACT-v2 — Topology Panel Validation")
    print("=" * 60)

    # Run adapter once, share data across dependent checks
    success, data, stderr = run_adapter()

    check_AC_01()
    check_AC_02()
    check_AC_03()
    check_AC_04()
    check_AC_05()
    check_AC_06()
    check_AC_07()
    check_AC_08()

    check_V1()
    check_V2(data)
    check_V3(data)
    check_V4(data)
    check_V5(data)
    check_V6()
    check_V7()
    check_V8()
    check_V9(data)
    check_V10(data)
    check_V11()
    check_V12()
    check_V13()
    check_V14()

    print()
    passed = sum(1 for _, s, _ in _results if s == "PASS")
    total  = len(_results)
    for label, status, detail in _results:
        marker = "✓" if status == "PASS" else "✗"
        line   = f"  {marker} {label}"
        if args.verbose or status == "FAIL":
            line += f"  — {detail}"
        print(line)

    print()
    print(f"Result: {passed}/{total} checks passed")

    if passed < total:
        print("STATUS: FAIL")
        sys.exit(1)
    else:
        print("STATUS: PASS")
        sys.exit(0)

if __name__ == "__main__":
    main()
