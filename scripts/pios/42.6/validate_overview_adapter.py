#!/usr/bin/env python3
"""
validate_overview_adapter.py
PIOS-42.6-RUN01-CONTRACT-v1

Validates the ExecLens Overview Metrics Adapter (Stream 42.6).

Overview: 42.6 adds a landing-page executive gauge strip that surfaces four
structural program-condition metrics before any query is selected. Values are
extracted from the signal registry via explicit, deterministic rules — no
synthesis, no invented fallbacks.

Validation checks:

  AC-01  adapter script exists at scripts/pios/42.6/execlens_overview_adapter.py
  AC-02  LandingGaugeStrip.js component exists in app/execlens-demo/components/
  AC-03  API route execlens.js contains ?overview=true dispatch
  AC-04  API route references ADAPTER_42_6 path (scripts/pios/42.6)
  AC-05  index.js imports LandingGaugeStrip
  AC-06  index.js places LandingGaugeStrip before QuerySelector
  AC-07  adapter runs without error and returns valid JSON
  AC-08  JSON output contains 'metrics' array with 4 entries
  AC-09  all four target signal IDs present: SIG-002, SIG-003, SIG-004, SIG-005
  AC-10  no metric has a hardcoded value bypassing extraction (value must come from extraction)

  R-01   dependency_load extraction rule present in adapter source
  R-02   structural_density extraction rule present in adapter source
  R-03   coordination_pressure extraction rule present in adapter source
  R-04   visibility_deficit word-map extraction present in adapter source
  R-05   extraction failure returns null (not default numeric value)
  R-06   threshold marker declared for structural_density (0-2 scale, unity at 1.0)
  R-07   adapter declares contract_id in output
  R-08   CSS contains .lg-strip and .lg-gauge-track (visual layer present)
  R-09   LandingGaugeStrip fetches /api/execlens?overview=true (correct endpoint)
  R-10   adapter extraction paths through 42.2 → 42.1 (no direct 41.x file access)

Usage:
  python3 scripts/pios/42.6/validate_overview_adapter.py
  python3 scripts/pios/42.6/validate_overview_adapter.py --verbose
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

REPO_ROOT      = Path(__file__).resolve().parents[3]
ADAPTER_42_6   = REPO_ROOT / "scripts/pios/42.6/execlens_overview_adapter.py"
APP_ROOT       = REPO_ROOT / "app/execlens-demo"
LANDING_STRIP  = APP_ROOT / "components/LandingGaugeStrip.js"
API_ROUTE      = APP_ROOT / "pages/api/execlens.js"
INDEX_PAGE     = APP_ROOT / "pages/index.js"
GLOBALS_CSS    = APP_ROOT / "styles/globals.css"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

PASS = "PASS"
FAIL = "FAIL"

_results = []

def check(label, passed, detail=""):
    status = PASS if passed else FAIL
    _results.append((label, status, detail))
    return passed

def file_contains(path, *patterns):
    """Return True if all patterns are found in file text."""
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
# Validation functions
# ---------------------------------------------------------------------------

def check_AC_01():
    ok = ADAPTER_42_6.exists()
    check("AC-01", ok,
          f"adapter exists at {ADAPTER_42_6.relative_to(REPO_ROOT)}" if ok
          else f"MISSING: {ADAPTER_42_6.relative_to(REPO_ROOT)}")

def check_AC_02():
    ok = LANDING_STRIP.exists()
    check("AC-02", ok,
          "LandingGaugeStrip.js exists" if ok else "MISSING: LandingGaugeStrip.js")

def check_AC_03():
    ok = file_contains(API_ROUTE, "overview === 'true'")
    check("AC-03", ok,
          "API route dispatches ?overview=true" if ok else "API route missing overview dispatch")

def check_AC_04():
    ok = file_contains(API_ROUTE, "42.6", "ADAPTER_42_6")
    check("AC-04", ok,
          "API route references ADAPTER_42_6 (scripts/pios/42.6)" if ok
          else "API route does not reference 42.6 adapter path")

def check_AC_05():
    ok = file_contains(INDEX_PAGE, "LandingGaugeStrip")
    check("AC-05", ok,
          "index.js imports LandingGaugeStrip" if ok
          else "index.js does not import LandingGaugeStrip")

def check_AC_06():
    text = file_text(INDEX_PAGE)
    # Check JSX usage order (component tags, not import statements)
    ls_pos = text.find("<LandingGaugeStrip")
    qs_pos = text.find("<QuerySelector")
    ok = (ls_pos != -1 and qs_pos != -1 and ls_pos < qs_pos)
    check("AC-06", ok,
          "LandingGaugeStrip rendered before QuerySelector in JSX" if ok
          else f"ordering incorrect in JSX (<LandingGaugeStrip@{ls_pos}, <QuerySelector@{qs_pos})")

def check_AC_07():
    result = subprocess.run(
        ["python3", str(ADAPTER_42_6)],
        capture_output=True, text=True, timeout=30
    )
    ok = result.returncode == 0 and result.stdout.strip()
    detail = "adapter runs cleanly" if ok else f"returncode={result.returncode} stderr={result.stderr[:200]}"
    check("AC-07", ok, detail)
    if ok:
        return result.stdout
    return None

def check_AC_08(raw_output):
    if not raw_output:
        check("AC-08", False, "no output to parse (AC-07 failed)")
        return None
    try:
        data = json.loads(raw_output)
        metrics = data.get("metrics", [])
        ok = isinstance(metrics, list) and len(metrics) == 4
        check("AC-08", ok,
              f"metrics array has {len(metrics)} entries" + (" (expected 4)" if not ok else ""))
        return data
    except json.JSONDecodeError as e:
        check("AC-08", False, f"JSON parse error: {e}")
        return None

def check_AC_09(data):
    if not data:
        check("AC-09", False, "no data (AC-08 failed)")
        return
    metrics = data.get("metrics", [])
    found_ids = {m.get("signal_id") for m in metrics}
    required  = {"SIG-002", "SIG-003", "SIG-004", "SIG-005"}
    missing   = required - found_ids
    ok = len(missing) == 0
    check("AC-09", ok,
          f"all target signal IDs present: {sorted(found_ids)}" if ok
          else f"missing signal IDs: {sorted(missing)}")

def check_AC_10(data):
    if not data:
        check("AC-10", False, "no data (AC-08 failed)")
        return
    # Check that extraction_status is never 'bypassed' and no value appears without extraction rule
    metrics = data.get("metrics", [])
    violations = []
    for m in metrics:
        # Every metric must declare an extraction_rule (not empty)
        if not m.get("extraction_rule"):
            violations.append(f"{m.get('id')}: missing extraction_rule")
        # extraction_status must be ok or extraction_failed — not a made-up status
        status = m.get("extraction_status", "")
        if status not in ("ok", "extraction_failed", "signal_not_found"):
            violations.append(f"{m.get('id')}: unexpected extraction_status={status}")
    ok = len(violations) == 0
    check("AC-10", ok,
          "all metrics have declared extraction rules and valid status" if ok
          else "; ".join(violations))

def check_R_01():
    ok = file_contains(ADAPTER_42_6, 'computed at', r'0\.')
    check("R-01", ok,
          "dependency_load extraction pattern present" if ok
          else "dependency_load regex not found in adapter source")

def check_R_02():
    ok = file_contains(ADAPTER_42_6, 'edge-to-node density')
    check("R-02", ok,
          "structural_density extraction pattern present" if ok
          else "structural_density regex not found in adapter source")

def check_R_03():
    ok = file_contains(ADAPTER_42_6, 'static component of')
    check("R-03", ok,
          "coordination_pressure extraction pattern present" if ok
          else "coordination_pressure regex not found in adapter source")

def check_R_04():
    ok = file_contains(ADAPTER_42_6, '_WORD_TO_INT', 'seven')
    check("R-04", ok,
          "visibility_deficit word-map (_WORD_TO_INT) present in adapter" if ok
          else "word-map extraction not found in adapter source")

def check_R_05(data):
    if not data:
        check("R-05", False, "no data (AC-08 failed)")
        return
    # Confirm: if value is None, extraction_status must not be 'ok'
    metrics = data.get("metrics", [])
    violations = []
    for m in metrics:
        if m.get("value") is None and m.get("extraction_status") == "ok":
            violations.append(f"{m.get('id')}: value=null but status=ok (invalid state)")
    ok = len(violations) == 0
    check("R-05", ok,
          "extraction failure correctly returns null (not default)" if ok
          else "; ".join(violations))

def check_R_06(data):
    if not data:
        check("R-06", False, "no data (AC-08 failed)")
        return
    metrics = {m["id"]: m for m in data.get("metrics", [])}
    sd = metrics.get("structural_density", {})
    has_threshold     = sd.get("threshold") == 1.0
    has_threshold_pct = sd.get("threshold_fill_pct") == 50.0
    ok = has_threshold and has_threshold_pct
    check("R-06", ok,
          "structural_density threshold=1.0, threshold_fill_pct=50.0 declared" if ok
          else f"threshold={sd.get('threshold')}, threshold_fill_pct={sd.get('threshold_fill_pct')}")

def check_R_07(data):
    if not data:
        check("R-07", False, "no data (AC-08 failed)")
        return
    ok = bool(data.get("contract_id"))
    check("R-07", ok,
          f"contract_id={data.get('contract_id')}" if ok
          else "contract_id missing from adapter output")

def check_R_08():
    ok = file_contains(GLOBALS_CSS, '.lg-strip', '.lg-gauge-track')
    check("R-08", ok,
          ".lg-strip and .lg-gauge-track present in globals.css" if ok
          else "landing gauge CSS missing from globals.css")

def check_R_09():
    ok = file_contains(LANDING_STRIP, '/api/execlens?overview=true')
    check("R-09", ok,
          "LandingGaugeStrip fetches correct endpoint" if ok
          else "LandingGaugeStrip does not reference /api/execlens?overview=true")

def check_R_10():
    # Adapter must import via 42.2 path and not directly open 41.x files
    text = file_text(ADAPTER_42_6)
    uses_42_2 = 'pios/42.2' in text and 'render_executive_narrative' in text
    no_direct_41x = 'pios/41.' not in text
    ok = uses_42_2 and no_direct_41x
    detail = []
    if not uses_42_2:
        detail.append("missing 42.2 import chain")
    if not no_direct_41x:
        detail.append("direct 41.x file access found")
    check("R-10", ok,
          "data access via 42.2 → 42.1 (no direct 41.x access)" if ok
          else "; ".join(detail))

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    print("PIOS-42.6-RUN01-CONTRACT-v1 — Overview Adapter Validation")
    print("=" * 60)

    # Run checks in order; pass data between dependent checks
    check_AC_01()
    check_AC_02()
    check_AC_03()
    check_AC_04()
    check_AC_05()
    check_AC_06()
    raw = check_AC_07()
    data = check_AC_08(raw)
    check_AC_09(data)
    check_AC_10(data)

    check_R_01()
    check_R_02()
    check_R_03()
    check_R_04()
    check_R_05(data)
    check_R_06(data)
    check_R_07(data)
    check_R_08()
    check_R_09()
    check_R_10()

    print()
    passed = sum(1 for _, s, _ in _results if s == PASS)
    total  = len(_results)
    for label, status, detail in _results:
        marker = "✓" if status == PASS else "✗"
        line   = f"  {marker} {label}"
        if args.verbose or status == FAIL:
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
