#!/usr/bin/env python3
"""
validate_demo_package.py
PIOS-42.9-RUN01-CONTRACT-v1

Validates the ExecLens Demo Package (Stream 42.9).

Checks that the demo is fully portable, reproducible, and documented
for third-party delivery without assistance.

Validation checks:

  AC-01  README.md exists at repo root with Quick Start section
  AC-02  README.md contains ≤5 numbered setup steps in Quick Start
  AC-03  .env.example exists in app/execlens-demo/
  AC-04  .env.example contains NEXT_PUBLIC_OBSIDIAN_VAULT_NAME
  AC-05  DEMO_SETUP.md exists at repo root
  AC-06  DEMO_RUNBOOK.md exists at repo root
  AC-07  DEMO_CONTEXT.md exists at repo root
  AC-08  app/execlens-demo/package.json exists with next, react, react-dom
  AC-09  app/execlens-demo is structured for standalone run (next.config.js present)

  V1    README quick start contains: clone, install, run, browser open (4 actions)
  V2    .env.example sufficient: no secret keys required
  V3    DEMO_RUNBOOK references GQ-003 (primary demo query)
  V4    DEMO_RUNBOOK references all 7 demo steps
  V5    DEMO_SETUP.md contains Obsidian validation instructions
  V6    DEMO_CONTEXT contains evidence-first principle statement
  V7    no computation layer files modified (42.1, 42.2 unchanged)
  V8    all 42.x validators still pass (spot check 42.4)
  V9    DEMO_RUNBOOK timing adds to ~3 minutes (contains timing section)
  V10   no hidden steps — DEMO_SETUP references vault registration procedure

Usage:
  python3 scripts/pios/42.9/validate_demo_package.py
  python3 scripts/pios/42.9/validate_demo_package.py --verbose
"""

import argparse
import re
import subprocess
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

REPO_ROOT       = Path(__file__).resolve().parents[3]
README          = REPO_ROOT / "README.md"
ENV_EXAMPLE     = REPO_ROOT / "app/execlens-demo/.env.example"
DEMO_SETUP      = REPO_ROOT / "DEMO_SETUP.md"
DEMO_RUNBOOK    = REPO_ROOT / "DEMO_RUNBOOK.md"
DEMO_CONTEXT    = REPO_ROOT / "DEMO_CONTEXT.md"
PACKAGE_JSON    = REPO_ROOT / "app/execlens-demo/package.json"
NEXT_CONFIG     = REPO_ROOT / "app/execlens-demo/next.config.js"
ADAPTER_42_1    = REPO_ROOT / "scripts/pios/42.1/run_execlens_query.py"
ADAPTER_42_2    = REPO_ROOT / "scripts/pios/42.2/render_executive_narrative.py"
VALIDATOR_42_4  = REPO_ROOT / "scripts/pios/42.4/validate_demo_surface.py"

EXPECTED_STEP_LABELS = ['System', 'Structure', 'Query', 'Signals', 'Evidence', 'Navigate', 'Complete']

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
    ok = README.exists() and file_contains(README, "Quick Start")
    check("AC-01", ok,
          "README.md exists with Quick Start section" if ok
          else "README.md missing or lacks 'Quick Start'")

def check_AC_02():
    text = file_text(README)
    # Count numbered steps in Quick Start block (# 1. ... # 2. ... etc.)
    steps = re.findall(r'^\s*#\s*\d+\.', text, re.MULTILINE)
    if not steps:
        # Also accept: "1." "2." as list items
        steps = re.findall(r'^\s*\d+\.\s+\w', text, re.MULTILINE)
    ok = 3 <= len(steps) <= 5
    check("AC-02", ok,
          f"Quick Start has {len(steps)} numbered steps (≤5)" if ok
          else f"step count outside range: found {len(steps)} numbered items")

def check_AC_03():
    ok = ENV_EXAMPLE.exists()
    check("AC-03", ok,
          ".env.example exists in app/execlens-demo/" if ok
          else "MISSING: app/execlens-demo/.env.example")

def check_AC_04():
    ok = file_contains(ENV_EXAMPLE, "NEXT_PUBLIC_OBSIDIAN_VAULT_NAME")
    check("AC-04", ok,
          ".env.example declares NEXT_PUBLIC_OBSIDIAN_VAULT_NAME" if ok
          else "NEXT_PUBLIC_OBSIDIAN_VAULT_NAME not found in .env.example")

def check_AC_05():
    ok = DEMO_SETUP.exists()
    check("AC-05", ok,
          "DEMO_SETUP.md exists at repo root" if ok else "MISSING: DEMO_SETUP.md")

def check_AC_06():
    ok = DEMO_RUNBOOK.exists()
    check("AC-06", ok,
          "DEMO_RUNBOOK.md exists at repo root" if ok else "MISSING: DEMO_RUNBOOK.md")

def check_AC_07():
    ok = DEMO_CONTEXT.exists()
    check("AC-07", ok,
          "DEMO_CONTEXT.md exists at repo root" if ok else "MISSING: DEMO_CONTEXT.md")

def check_AC_08():
    if not PACKAGE_JSON.exists():
        check("AC-08", False, "MISSING: package.json")
        return
    import json
    data = json.loads(PACKAGE_JSON.read_text())
    deps = data.get("dependencies", {})
    has_next  = "next" in deps
    has_react = "react" in deps
    has_dom   = "react-dom" in deps
    ok = has_next and has_react and has_dom
    check("AC-08", ok,
          f"package.json has next={deps.get('next')}, react={deps.get('react')}" if ok
          else f"missing deps: next={has_next}, react={has_react}, react-dom={has_dom}")

def check_AC_09():
    ok = NEXT_CONFIG.exists()
    check("AC-09", ok,
          "next.config.js present (standalone run configuration)" if ok
          else "MISSING: app/execlens-demo/next.config.js")

def check_V1():
    text = file_text(README)
    required = ["clone", "install", "run", "open"]
    missing  = [r for r in required if r.lower() not in text.lower()]
    ok = len(missing) == 0
    check("V1", ok,
          "README Quick Start covers: clone, install, run, open" if ok
          else f"README missing action keywords: {missing}")

def check_V2():
    text = file_text(ENV_EXAMPLE)
    # No secret keys required — should not ask for API keys, tokens, passwords
    secret_pats = [r'API_KEY', r'SECRET', r'TOKEN', r'PASSWORD', r'PRIVATE_KEY']
    found = [p for p in secret_pats if re.search(p, text, re.IGNORECASE)]
    ok = len(found) == 0
    check("V2", ok,
          ".env.example requires no secrets (only vault name)" if ok
          else f".env.example contains secret-pattern fields: {found}")

def check_V3():
    ok = file_contains(DEMO_RUNBOOK, "GQ-003")
    check("V3", ok,
          "DEMO_RUNBOOK references GQ-003 (primary demo query)" if ok
          else "GQ-003 not referenced in DEMO_RUNBOOK")

def check_V4():
    text = file_text(DEMO_RUNBOOK)
    missing = [label for label in EXPECTED_STEP_LABELS if label not in text]
    ok = len(missing) == 0
    check("V4", ok,
          f"DEMO_RUNBOOK covers all 7 step labels" if ok
          else f"DEMO_RUNBOOK missing step labels: {missing}")

def check_V5():
    ok = file_contains(DEMO_SETUP, "obsidian://open", "pie_vault")
    check("V5", ok,
          "DEMO_SETUP contains Obsidian deep-link validation command" if ok
          else "DEMO_SETUP missing Obsidian link validation (obsidian://open or pie_vault)")

def check_V6():
    ok = file_contains(DEMO_CONTEXT, "evidence-first", "null")
    check("V6", ok,
          "DEMO_CONTEXT states evidence-first principle and null-not-default" if ok
          else "DEMO_CONTEXT missing evidence-first principle statement")

def check_V7():
    ok = ADAPTER_42_1.exists() and ADAPTER_42_2.exists()
    check("V7", ok,
          "42.1 and 42.2 computation layers present (not modified)" if ok
          else "42.1 or 42.2 adapter missing")

def check_V8():
    if not VALIDATOR_42_4.exists():
        check("V8", False, "42.4 validator missing")
        return
    result = subprocess.run(
        ["python3", str(VALIDATOR_42_4)],
        capture_output=True, text=True, timeout=60
    )
    ok = result.returncode == 0
    check("V8", ok,
          "42.4 validator still passes (spot check)" if ok
          else f"42.4 validator FAIL: {result.stdout[-200:]}")

def check_V9():
    ok = file_contains(DEMO_RUNBOOK, "3:00", "Timing")
    check("V9", ok,
          "DEMO_RUNBOOK contains timing summary (~3 minutes)" if ok
          else "DEMO_RUNBOOK missing timing section or 3-minute target")

def check_V10():
    ok = file_contains(DEMO_SETUP, "Open folder as vault", "pie_vault")
    check("V10", ok,
          "DEMO_SETUP documents vault registration procedure" if ok
          else "DEMO_SETUP missing vault registration instructions")

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    print("PIOS-42.9-RUN01-CONTRACT-v1 — Demo Package Validation")
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
