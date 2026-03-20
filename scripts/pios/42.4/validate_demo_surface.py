#!/usr/bin/env python3
"""
validate_demo_surface.py
PIOS-42.4-RUN01-CONTRACT-v2

Validates the ExecLens Demo Surface Layer (Stream 42.4).

Validation checks:
  AC-01  execlens_adapter.py exists
  AC-02  validate_demo_surface.py exists
  AC-03  adapter imports 42.2 module (render_executive_narrative)
  AC-04  adapter accesses 42.1 via _r42._q41 (not directly imported)
  AC-05  no direct 41.x file path references in adapter
  AC-06  adapter JSON output: required top-level fields present for GQ-001
  AC-07  adapter JSON: signals array non-empty for GQ-001
  AC-08  adapter fails closed on invalid query_id (exit non-zero)
  AC-09  deterministic JSON output across two runs
  AC-10  no file writes in adapter

  NS-01  package.json exists in app/execlens-demo/
  NS-02  pages/index.js exists
  NS-03  pages/api/execlens.js exists
  NS-04  QuerySelector component exists
  NS-05  ExecutivePanel component exists
  NS-06  SignalGaugeCard component exists
  NS-07  EvidencePanel component exists
  NS-08  NavigationPanel component exists
  NS-09  API route calls Python adapter (not inline computation)
  NS-10  no hardcoded query content in UI components (no synthetic GQ-NNN data)

Usage:
  python3 scripts/pios/42.4/validate_demo_surface.py
  python3 scripts/pios/42.4/validate_demo_surface.py --verbose
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

REPO_ROOT   = Path(__file__).resolve().parents[3]
SCRIPT_42_4 = Path(__file__).parent / "execlens_adapter.py"
APP_ROOT    = REPO_ROOT / "app" / "execlens-demo"

REQUIRED_FIELDS = [
    "contract_id",
    "query_id",
    "query_text",
    "intent_type",
    "aggregate_confidence",
    "semantic_tags",
    "signals",
    "navigation",
    "template_section",
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _run(script: Path, args: list) -> subprocess.CompletedProcess:
    return subprocess.run(
        [sys.executable, str(script)] + args,
        capture_output=True, text=True, cwd=REPO_ROOT
    )


class ValidationResult:
    def __init__(self, v_id: str, description: str):
        self.v_id        = v_id
        self.description = description
        self.passed      = False
        self.details: list = []

    def pass_(self, detail: str = ""):
        self.passed = True
        if detail:
            self.details.append(f"  PASS  {detail}")

    def fail(self, detail: str):
        self.passed = False
        self.details.append(f"  FAIL  {detail}")

    def summary_line(self) -> str:
        status = "PASS" if self.passed else "FAIL"
        return f"  [{status}]  {self.v_id}: {self.description}"


# ---------------------------------------------------------------------------
# Python adapter checks  AC-01 – AC-10
# ---------------------------------------------------------------------------

def ac01_adapter_exists() -> ValidationResult:
    r = ValidationResult("AC-01", "execlens_adapter.py exists")
    if SCRIPT_42_4.exists():
        r.pass_(f"found at {SCRIPT_42_4.relative_to(REPO_ROOT)}")
    else:
        r.fail(f"not found: {SCRIPT_42_4}")
    return r


def ac02_validator_exists() -> ValidationResult:
    r = ValidationResult("AC-02", "validate_demo_surface.py exists")
    this = Path(__file__)
    if this.exists():
        r.pass_(f"found at {this.relative_to(REPO_ROOT)}")
    else:
        r.fail(f"not found: {this}")
    return r


def ac03_imports_42_2() -> ValidationResult:
    r = ValidationResult("AC-03", "adapter imports 42.2 module (render_executive_narrative)")
    if not SCRIPT_42_4.exists():
        r.fail("adapter missing")
        return r
    text = SCRIPT_42_4.read_text(encoding="utf-8")

    if "import render_executive_narrative as _r42" in text:
        r.pass_("imports render_executive_narrative (42.2 module)")
    else:
        r.fail("does not import render_executive_narrative")
        return r

    if "42.2" in text and "sys.path" in text:
        r.pass_("42.2 path inserted into sys.path")
    else:
        r.fail("42.2 path not found in sys.path insertion")
        return r

    r.passed = True
    return r


def ac04_accesses_via_r42() -> ValidationResult:
    r = ValidationResult("AC-04", "adapter accesses 42.1 via _r42._q41 (not direct import)")
    if not SCRIPT_42_4.exists():
        r.fail("adapter missing")
        return r
    text = SCRIPT_42_4.read_text(encoding="utf-8")

    if "_r42._q41." in text:
        r.pass_("uses _r42._q41.* access pattern")
    else:
        r.fail("does not use _r42._q41.* to reach 42.1")
        return r

    # Must NOT directly import run_execlens_query
    if "import run_execlens_query" in text:
        r.fail("directly imports run_execlens_query (bypasses 42.2)")
        return r
    else:
        r.pass_("does not directly import run_execlens_query")

    r.passed = True
    return r


def ac05_no_direct_41x_access() -> ValidationResult:
    r = ValidationResult("AC-05", "no direct 41.x file path references in adapter")
    if not SCRIPT_42_4.exists():
        r.fail("adapter missing")
        return r
    text = SCRIPT_42_4.read_text(encoding="utf-8")

    forbidden = [
        (r'open\(.*41\.[1-9]',           "direct open() of 41.x path"),
        (r'signal_registry\.json',        "direct signal_registry.json reference"),
        (r'evidence_mapping_index',       "direct evidence_mapping_index reference"),
        (r'query_signal_map\.json',       "direct query_signal_map.json reference"),
        (r'query_response_templates',     "direct query_response_templates reference"),
    ]
    ok = True
    for pat, label in forbidden:
        if re.search(pat, text):
            r.fail(f"forbidden pattern: {label}")
            ok = False
        else:
            r.pass_(f"no direct access: {label}")

    if ok:
        r.passed = True
    return r


def ac06_json_fields_present() -> ValidationResult:
    r = ValidationResult("AC-06", "adapter JSON output: required fields present for GQ-001")
    if not SCRIPT_42_4.exists():
        r.fail("adapter missing")
        return r
    res = _run(SCRIPT_42_4, ["GQ-001"])
    if res.returncode != 0:
        r.fail(f"adapter execution failed (exit={res.returncode}): {res.stderr.strip()[:200]}")
        return r

    try:
        data = json.loads(res.stdout)
    except json.JSONDecodeError as e:
        r.fail(f"JSON parse error: {e}")
        return r

    ok = True
    for field in REQUIRED_FIELDS:
        if field in data:
            r.pass_(f"field '{field}' present")
        else:
            r.fail(f"required field '{field}' MISSING from JSON output")
            ok = False

    if ok:
        r.passed = True
    return r


def ac07_signals_non_empty() -> ValidationResult:
    r = ValidationResult("AC-07", "adapter JSON: signals array non-empty for GQ-001")
    if not SCRIPT_42_4.exists():
        r.fail("adapter missing")
        return r
    res = _run(SCRIPT_42_4, ["GQ-001"])
    if res.returncode != 0:
        r.fail(f"execution failed (exit={res.returncode})")
        return r

    try:
        data = json.loads(res.stdout)
    except json.JSONDecodeError as e:
        r.fail(f"JSON parse error: {e}")
        return r

    signals = data.get("signals", [])
    if not isinstance(signals, list) or len(signals) == 0:
        r.fail(f"signals is empty or not a list: {signals!r}")
        return r

    r.pass_(f"signals array has {len(signals)} entry/entries")

    # Spot-check first signal structure
    s = signals[0]
    required_sig_fields = ["signal_id", "title", "evidence_confidence", "statement"]
    for f in required_sig_fields:
        if f in s:
            r.pass_(f"signal[0].{f} present")
        else:
            r.fail(f"signal[0].{f} MISSING")
            return r

    r.passed = True
    return r


def ac08_fail_closed() -> ValidationResult:
    r = ValidationResult("AC-08", "adapter fails closed on invalid query_id")
    for bad_id in ["GQ-999", "NOT-A-QUERY", "INVALID"]:
        res = _run(SCRIPT_42_4, [bad_id])
        if res.returncode != 0:
            r.pass_(f"{bad_id} → exit non-zero (fail closed)")
        else:
            r.fail(f"{bad_id} should fail closed but returned exit 0")
            return r
    r.passed = True
    return r


def ac09_deterministic() -> ValidationResult:
    r = ValidationResult("AC-09", "deterministic JSON output across two runs")
    if not SCRIPT_42_4.exists():
        r.fail("adapter missing")
        return r

    outputs = []
    for run_n in range(2):
        res = _run(SCRIPT_42_4, ["GQ-001"])
        if res.returncode != 0:
            r.fail(f"run {run_n + 1} failed (exit={res.returncode})")
            return r
        outputs.append(res.stdout)

    if outputs[0] == outputs[1]:
        r.pass_("two executions of GQ-001 produced identical stdout")
        r.passed = True
    else:
        r.fail("JSON output differs between run 1 and run 2")
        # Show first differing line
        lines_a = outputs[0].splitlines()
        lines_b = outputs[1].splitlines()
        for i, (la, lb) in enumerate(zip(lines_a, lines_b)):
            if la != lb:
                r.fail(f"first diff at line {i + 1}:\n    run1: {la!r}\n    run2: {lb!r}")
                break
    return r


def ac10_no_file_writes() -> ValidationResult:
    r = ValidationResult("AC-10", "no file writes in adapter")
    if not SCRIPT_42_4.exists():
        r.fail("adapter missing")
        return r
    text = SCRIPT_42_4.read_text(encoding="utf-8")
    ok = True
    for pat, label in [
        (r"open\(.*[\"']w[\"']",  "open(..., 'w')"),
        (r"\.write_text\(",       ".write_text()"),
        (r"shutil\.copy",         "shutil.copy"),
    ]:
        if re.search(pat, text):
            r.fail(f"file-write pattern found: {label}")
            ok = False
        else:
            r.pass_(f"no file-write: {label}")
    if ok:
        r.passed = True
    return r


# ---------------------------------------------------------------------------
# Next.js surface checks  NS-01 – NS-10
# ---------------------------------------------------------------------------

def ns01_package_json() -> ValidationResult:
    r = ValidationResult("NS-01", "package.json exists in app/execlens-demo/")
    pkg = APP_ROOT / "package.json"
    if pkg.exists():
        try:
            data = json.loads(pkg.read_text(encoding="utf-8"))
            if "next" in data.get("dependencies", {}):
                r.pass_(f"found, next.js listed as dependency")
            else:
                r.fail("found but 'next' not in dependencies")
                return r
        except json.JSONDecodeError:
            r.fail("package.json is not valid JSON")
            return r
        r.passed = True
    else:
        r.fail(f"not found: {pkg}")
    return r


def ns02_index_js() -> ValidationResult:
    r = ValidationResult("NS-02", "pages/index.js exists")
    f = APP_ROOT / "pages" / "index.js"
    if f.exists():
        r.pass_(f"found at {f.relative_to(REPO_ROOT)}")
        r.passed = True
    else:
        r.fail(f"not found: {f}")
    return r


def ns03_api_route() -> ValidationResult:
    r = ValidationResult("NS-03", "pages/api/execlens.js exists")
    f = APP_ROOT / "pages" / "api" / "execlens.js"
    if f.exists():
        r.pass_(f"found at {f.relative_to(REPO_ROOT)}")
        r.passed = True
    else:
        r.fail(f"not found: {f}")
    return r


def _check_component(check_id: str, name: str) -> ValidationResult:
    r = ValidationResult(check_id, f"{name} component exists")
    f = APP_ROOT / "components" / f"{name}.js"
    if f.exists():
        r.pass_(f"found at {f.relative_to(REPO_ROOT)}")
        r.passed = True
    else:
        r.fail(f"not found: {f}")
    return r


def ns09_api_calls_adapter() -> ValidationResult:
    r = ValidationResult("NS-09", "API route calls Python adapter (not inline computation)")
    f = APP_ROOT / "pages" / "api" / "execlens.js"
    if not f.exists():
        r.fail("API route missing")
        return r
    text = f.read_text(encoding="utf-8")

    if "execlens_adapter.py" in text:
        r.pass_("references execlens_adapter.py")
    else:
        r.fail("does not reference execlens_adapter.py")
        return r

    # Must not do inline signal computation
    forbidden = [
        (r'signal_registry',       "direct signal_registry reference"),
        (r'evidence_mapping_index', "direct evidence_mapping_index reference"),
        (r'json\.loads\(',          "direct JSON parsing of 41.x artifacts"),
    ]
    ok = True
    for pat, label in forbidden:
        if re.search(pat, text):
            r.fail(f"forbidden: {label}")
            ok = False
        else:
            r.pass_(f"no inline computation: {label}")

    if ok:
        r.passed = True
    return r


def ns10_no_synthetic_data() -> ValidationResult:
    r = ValidationResult("NS-10", "no hardcoded query content in UI components")
    components_dir = APP_ROOT / "components"
    if not components_dir.exists():
        r.fail("components/ directory missing")
        return r

    # Look for patterns that would indicate hardcoded query data
    synthetic_patterns = [
        # Hard-coded GQ response text (signal titles/statements should come from API)
        (r'"(SIG-00[1-9]|SIG-0[1-9][0-9])"',
         "hardcoded signal ID string literal"),
        # Hard-coded query text
        (r'"What operational dimensions',
         "hardcoded query text"),
        # Hard-coded domain names that would only come from data
        (r'"Platform Infrastructure and Data"',
         "hardcoded domain name"),
    ]

    ok = True
    for js_file in sorted(components_dir.glob("*.js")):
        text = js_file.read_text(encoding="utf-8")
        for pat, label in synthetic_patterns:
            if re.search(pat, text):
                r.fail(f"{js_file.name}: synthetic data pattern found: {label}")
                ok = False
            else:
                r.pass_(f"{js_file.name}: clean ({label})")

    if ok:
        r.passed = True
    return r


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Validate ExecLens Demo Surface (PIOS-42.4-RUN01-CONTRACT-v2)"
    )
    parser.add_argument("--verbose", "-v", action="store_true")
    args = parser.parse_args()

    print("42.4 ExecLens Demo Surface Layer — Validation")
    print(f"  Adapter  : {SCRIPT_42_4.relative_to(REPO_ROOT)}")
    print(f"  App root : {APP_ROOT.relative_to(REPO_ROOT)}")
    print()

    results = [
        # Python adapter
        ac01_adapter_exists(),
        ac02_validator_exists(),
        ac03_imports_42_2(),
        ac04_accesses_via_r42(),
        ac05_no_direct_41x_access(),
        ac06_json_fields_present(),
        ac07_signals_non_empty(),
        ac08_fail_closed(),
        ac09_deterministic(),
        ac10_no_file_writes(),
        # Next.js surface
        ns01_package_json(),
        ns02_index_js(),
        ns03_api_route(),
        _check_component("NS-04", "QuerySelector"),
        _check_component("NS-05", "ExecutivePanel"),
        _check_component("NS-06", "SignalGaugeCard"),
        _check_component("NS-07", "EvidencePanel"),
        _check_component("NS-08", "NavigationPanel"),
        ns09_api_calls_adapter(),
        ns10_no_synthetic_data(),
    ]

    print("=" * 60)
    all_passed = True
    for r in results:
        print(r.summary_line())
        if args.verbose:
            for d in r.details:
                print(d)
        if not r.passed:
            all_passed = False

    print("=" * 60)
    passed_count = sum(1 for r in results if r.passed)
    if all_passed:
        print("VALIDATION RESULT: PASS")
        print(f"All {len(results)} checks passed.")
        sys.exit(0)
    else:
        print("VALIDATION RESULT: FAIL")
        print(f"  Passed : {passed_count}/{len(results)}")
        print(f"  Failed : {len(results) - passed_count}/{len(results)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
