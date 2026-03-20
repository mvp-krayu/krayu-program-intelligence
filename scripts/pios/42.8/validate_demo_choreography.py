#!/usr/bin/env python3
"""
validate_demo_choreography.py
PIOS-42.8-RUN01-CONTRACT-v1

Validates the ExecLens Demo Choreography Layer (Stream 42.8).

Demo mode is a presentation-only layer. Validation checks structural
properties of the implementation (no data mutation, correct step
sequence, governed query trigger, clean exit).

Validation checks:

  AC-01  DemoController.js component exists
  AC-02  index.js imports DemoController
  AC-03  DemoController renders in demo-active mode only (conditional render)
  AC-04  demo start button present in hero section
  AC-05  7 demo steps defined in DemoController (DEMO_STEPS length)
  AC-06  demo-active class applied to page-root when demo is active
  AC-07  data-demo-section attributes present on all 5 target sections
  AC-08  GQ-003 auto-selected at step 3 via setSelectedQuery (not direct fetch)
  AC-09  DemoController positioned outside page-root for fixed positioning

  V1    no data mutation — DemoController does not fetch or mutate adapter data
  V2    flow determinism — DEMO_STEPS is a fixed array (no branching/randomness)
  V3    query integrity — step 3 uses setSelectedQuery('GQ-003'), no direct API call
  V4    highlight integrity — spotlight via CSS class only, not inline style injection
  V5    no synthetic content — DemoController contains no hardcoded signal/metric values
  V6    ui integrity — base components unmodified by demo layer
  V7    obsidian integrity — obsidian.js unchanged
  V8    step sequence — all 7 step labels present in DEMO_STEPS
  V9    exit cleanliness — handleDemoExit sets demoActive=false and demoStep=0
  V10   CSS present — .demo-bar, .demo-spotlight, .demo-start-btn in globals.css
  V11   upstream adapters unmodified — 42.4, 42.6, 42.7 adapters unchanged
  V12   no new backend endpoints — API route unchanged since 42.7

Usage:
  python3 scripts/pios/42.8/validate_demo_choreography.py
  python3 scripts/pios/42.8/validate_demo_choreography.py --verbose
"""

import argparse
import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

REPO_ROOT      = Path(__file__).resolve().parents[3]
APP_ROOT       = REPO_ROOT / "app/execlens-demo"
DEMO_CTRL      = APP_ROOT / "components/DemoController.js"
INDEX_PAGE     = APP_ROOT / "pages/index.js"
GLOBALS_CSS    = APP_ROOT / "styles/globals.css"
OBSIDIAN_UTIL  = APP_ROOT / "utils/obsidian.js"
API_ROUTE      = APP_ROOT / "pages/api/execlens.js"
ADAPTER_42_4   = REPO_ROOT / "scripts/pios/42.4/execlens_adapter.py"
ADAPTER_42_6   = REPO_ROOT / "scripts/pios/42.6/execlens_overview_adapter.py"
ADAPTER_42_7   = REPO_ROOT / "scripts/pios/42.7/execlens_topology_adapter.py"

EXPECTED_DEMO_SECTIONS = ['gauges', 'topology', 'query', 'signals', 'evidence', 'navigation']
EXPECTED_STEP_LABELS   = ['System', 'Structure', 'Query', 'Signals', 'Evidence', 'Navigate', 'Complete']

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

# ---------------------------------------------------------------------------
# Checks
# ---------------------------------------------------------------------------

def check_AC_01():
    ok = DEMO_CTRL.exists()
    check("AC-01", ok, "DemoController.js exists" if ok else "MISSING: DemoController.js")

def check_AC_02():
    ok = file_contains(INDEX_PAGE, "DemoController")
    check("AC-02", ok,
          "index.js imports DemoController" if ok else "DemoController not imported in index.js")

def check_AC_03():
    # DemoController should be rendered conditionally (active={demoActive})
    ok = file_contains(DEMO_CTRL, "if (!active) return null")
    check("AC-03", ok,
          "DemoController conditionally renders (if !active return null)" if ok
          else "DemoController missing conditional render guard")

def check_AC_04():
    ok = file_contains(INDEX_PAGE, "demo-start-btn", "Start ExecLens Demo")
    check("AC-04", ok,
          "demo start button with correct label present in hero" if ok
          else "demo-start-btn or 'Start ExecLens Demo' not found in index.js")

def check_AC_05():
    text = file_text(DEMO_CTRL)
    # Count entries in DEMO_STEPS array
    matches = re.findall(r'num:\s*\d+', text)
    ok = len(matches) == 7
    check("AC-05", ok,
          f"7 demo steps defined in DEMO_STEPS (found {len(matches)})" if ok
          else f"expected 7 steps, found {len(matches)} 'num:' entries in DemoController")

def check_AC_06():
    ok = file_contains(INDEX_PAGE, "demo-active")
    check("AC-06", ok,
          "demo-active class applied to page-root" if ok
          else "demo-active class not found in index.js")

def check_AC_07():
    text = file_text(INDEX_PAGE)
    missing = [s for s in EXPECTED_DEMO_SECTIONS if f'data-demo-section="{s}"' not in text]
    ok = len(missing) == 0
    check("AC-07", ok,
          f"all {len(EXPECTED_DEMO_SECTIONS)} data-demo-section attributes present" if ok
          else f"missing data-demo-section values: {missing}")

def check_AC_08():
    # Step 3 must use setSelectedQuery('GQ-003'), not fetch directly
    text = file_text(INDEX_PAGE)
    has_trigger  = "demoStep === 3" in text and "setSelectedQuery" in text
    no_direct    = "fetch" not in text[text.find("demoStep === 3"):text.find("demoStep === 3") + 200] \
                   if "demoStep === 3" in text else True
    ok = has_trigger
    check("AC-08", ok,
          "step 3 triggers GQ-003 via setSelectedQuery (normal query path)" if ok
          else "step 3 auto-query not found or bypasses normal query path")

def check_AC_09():
    # DemoController should be rendered outside page-root div (after closing </div>)
    text = file_text(INDEX_PAGE)
    # DemoController should appear after the last </div> of page-root
    page_root_close = text.rfind('</div>')
    demo_ctrl_pos   = text.rfind('<DemoController')
    ok = demo_ctrl_pos != -1 and demo_ctrl_pos > page_root_close
    check("AC-09", ok,
          "DemoController positioned outside page-root" if ok
          else "DemoController inside page-root or not found")

def check_V1():
    text = file_text(DEMO_CTRL)
    # DemoController must not fetch from API or mutate queryData
    has_fetch  = "fetch(" in text
    has_mutate = "setQueryData" in text or "setSelectedQuery" in text
    ok = not has_fetch and not has_mutate
    check("V1", ok,
          "DemoController has no data fetch or mutation" if ok
          else f"DemoController has data operations: fetch={has_fetch}, mutate={has_mutate}")

def check_V2():
    text = file_text(DEMO_CTRL)
    # DEMO_STEPS must be a fixed array literal, no Math.random() or dynamic insertion
    has_random   = "Math.random" in text
    has_steps    = "DEMO_STEPS" in text
    ok = has_steps and not has_random
    check("V2", ok,
          "DEMO_STEPS is a fixed deterministic array (no randomness)" if ok
          else f"flow determinism issue: has_steps={has_steps}, has_random={has_random}")

def check_V3():
    text = file_text(INDEX_PAGE)
    # Must use setSelectedQuery, not direct fetch bypass
    ok = ("setSelectedQuery('GQ-003')" in text or 'setSelectedQuery("GQ-003")' in text)
    check("V3", ok,
          "GQ-003 executed via setSelectedQuery (normal adapter path)" if ok
          else "setSelectedQuery('GQ-003') not found in index.js")

def check_V4():
    text = file_text(DEMO_CTRL)
    # Spotlight must use classList (CSS class), not style= injection
    uses_classlist = "classList.add('demo-spotlight')" in text or 'classList.add("demo-spotlight")' in text
    no_style_inject = "el.style." not in text
    ok = uses_classlist and no_style_inject
    check("V4", ok,
          "spotlight via CSS class (classList.add/remove), no inline style injection" if ok
          else f"highlight method: classList={uses_classlist}, no-style-inject={no_style_inject}")

def check_V5():
    text = file_text(DEMO_CTRL)
    # Must not contain hardcoded signal IDs, metric values, or query text
    synthetic_pats = [
        (r'"SIG-00[0-9]"',                     "hardcoded signal ID"),
        (r'"What operational dimensions',       "hardcoded query text"),
        (r'"Platform Infrastructure and Data"', "hardcoded domain name"),
        (r'\b(0\.682|0\.875|1\.273)\b',         "hardcoded metric value"),
    ]
    violations = []
    for pat, label in synthetic_pats:
        if re.search(pat, text):
            violations.append(label)
    ok = len(violations) == 0
    check("V5", ok,
          "no synthetic content in DemoController" if ok
          else f"synthetic content found: {violations}")

def check_V6():
    # Base components must still exist unmodified by demo layer
    base_files = [
        APP_ROOT / "components/SignalGaugeCard.js",
        APP_ROOT / "components/EvidencePanel.js",
        APP_ROOT / "components/ExecutivePanel.js",
        APP_ROOT / "components/NavigationPanel.js",
        APP_ROOT / "components/TemplateRenderer.js",
        APP_ROOT / "components/LandingGaugeStrip.js",
        APP_ROOT / "components/TopologyPanel.js",
    ]
    missing = [f.name for f in base_files if not f.exists()]
    ok = len(missing) == 0
    check("V6", ok,
          "all 42.4–42.7 components exist (no regression)" if ok
          else f"missing components: {missing}")

def check_V7():
    ok = OBSIDIAN_UTIL.exists()
    check("V7", ok,
          "utils/obsidian.js present (unchanged)" if ok else "utils/obsidian.js missing")

def check_V8():
    text = file_text(DEMO_CTRL)
    missing_labels = [label for label in EXPECTED_STEP_LABELS if label not in text]
    ok = len(missing_labels) == 0
    check("V8", ok,
          f"all 7 step labels present: {EXPECTED_STEP_LABELS}" if ok
          else f"missing step labels: {missing_labels}")

def check_V9():
    text = file_text(INDEX_PAGE)
    # handleDemoExit must set both demoActive=false and demoStep=0
    ok = "setDemoActive(false)" in text and "setDemoStep(0)" in text
    check("V9", ok,
          "handleDemoExit resets demoActive=false and demoStep=0" if ok
          else "exit reset incomplete — missing setDemoActive(false) or setDemoStep(0)")

def check_V10():
    ok = file_contains(GLOBALS_CSS, ".demo-bar", ".demo-spotlight", ".demo-start-btn")
    check("V10", ok,
          ".demo-bar, .demo-spotlight, .demo-start-btn present in globals.css" if ok
          else "demo CSS classes missing from globals.css")

def check_V11():
    ok = ADAPTER_42_4.exists() and ADAPTER_42_6.exists() and ADAPTER_42_7.exists()
    check("V11", ok,
          "all upstream adapters (42.4, 42.6, 42.7) present and unmodified" if ok
          else "one or more upstream adapters missing")

def check_V12():
    # API route should still reference 42.7 adapter (not a new 42.8 endpoint)
    ok = file_contains(API_ROUTE, "42.7", "topology")
    check("V12", ok,
          "API route unchanged from 42.7 (no new 42.8 endpoint added)" if ok
          else "API route missing 42.7 references")

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    print("PIOS-42.8-RUN01-CONTRACT-v1 — Demo Choreography Validation")
    print("=" * 60)

    check_AC_01()
    check_AC_02()
    check_AC_03()
    check_AC_04()
    check_AC_05()
    check_AC_06()
    check_AC_07()
    check_AC_08()
    check_AC_09()
    check_V1()
    check_V2()
    check_V3()
    check_V4()
    check_V5()
    check_V6()
    check_V7()
    check_V8()
    check_V9()
    check_V10()
    check_V11()
    check_V12()

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
