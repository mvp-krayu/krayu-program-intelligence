#!/usr/bin/env python3
"""
validate_delivery_layer.py
PIOS-42.3-RUN01-CONTRACT-v1

Validates the ExecLens Delivery & Interface Layer (Stream 42.3).

V1  CLI calls 42.2 (no bypass)
V2  no signal/evidence computation in 42.3
V3  output content identical to 42.2 (modulo demo framing)
V4  invalid query_id fails closed via 42.2
V5  repeated runs identical (deterministic)

AC-01  execlens_cli.py exists
AC-02  validate_delivery_layer.py exists
AC-03  42.3 imports 42.2 rendering path
AC-04  no direct 41.x artifact access in 42.3
AC-05  no signal/evidence computation logic in 42.3
AC-06  42.2 narrative content present in 42.3 output
AC-07  demo framing present (header + footer)
AC-08  fail closed on invalid query_id
AC-09  deterministic across runs
AC-10  no file writes

Usage:
  python3 scripts/pios/42.3/validate_delivery_layer.py
  python3 scripts/pios/42.3/validate_delivery_layer.py --verbose
"""

import argparse
import re
import subprocess
import sys
from pathlib import Path
from typing import Optional

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

REPO_ROOT   = Path(__file__).resolve().parents[3]
SCRIPT_42_3 = Path(__file__).parent / "execlens_cli.py"
SCRIPT_42_2 = Path(__file__).resolve().parents[1] / "42.2/render_executive_narrative.py"


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
# Checks
# ---------------------------------------------------------------------------

def ac01_cli_exists() -> ValidationResult:
    r = ValidationResult("AC-01", "execlens_cli.py exists")
    if SCRIPT_42_3.exists():
        r.pass_(f"found at {SCRIPT_42_3.relative_to(REPO_ROOT)}")
    else:
        r.fail(f"not found: {SCRIPT_42_3}")
    return r


def ac02_validator_exists() -> ValidationResult:
    r = ValidationResult("AC-02", "validate_delivery_layer.py exists")
    this = Path(__file__)
    if this.exists():
        r.pass_(f"found at {this.relative_to(REPO_ROOT)}")
    else:
        r.fail(f"not found: {this}")
    return r


def ac03_imports_42_2() -> ValidationResult:
    r = ValidationResult("AC-03", "42.3 imports 42.2 rendering path")
    if not SCRIPT_42_3.exists():
        r.fail("cli script missing")
        return r
    text = SCRIPT_42_3.read_text(encoding="utf-8")

    if "import render_executive_narrative" in text:
        r.pass_("imports render_executive_narrative (42.2 module)")
    else:
        r.fail("does not import render_executive_narrative")
        return r

    if "42.2" in text and "sys.path" in text:
        r.pass_("42.2 path inserted into sys.path")
    else:
        r.fail("42.2 path not in sys.path insertion")
        return r

    if "_r42.render_narrative" in text:
        r.pass_("calls _r42.render_narrative (42.2 render function)")
    else:
        r.fail("does not call 42.2 render_narrative function")
        return r

    r.passed = True
    return r


def ac04_no_direct_41x_access() -> ValidationResult:
    r = ValidationResult("AC-04", "no direct 41.x artifact access in 42.3")
    if not SCRIPT_42_3.exists():
        r.fail("cli script missing")
        return r
    text = SCRIPT_42_3.read_text(encoding="utf-8")

    # Should not directly open 41.x files
    forbidden = [
        (r'open\(.*41\.[1-9]', "direct open() of 41.x path"),
        (r'signal_registry\.json', "direct signal_registry.json reference"),
        (r'evidence_mapping_index', "direct evidence_mapping_index reference"),
        (r'query_signal_map\.json', "direct query_signal_map.json reference"),
        (r'query_response_templates', "direct query_response_templates reference"),
    ]
    ok = True
    for pat, label in forbidden:
        if re.search(pat, text):
            r.fail(f"forbidden pattern found: {label}")
            ok = False
        else:
            r.pass_(f"no direct access: {label}")

    if ok:
        r.passed = True
    return r


def ac05_no_computation_logic() -> ValidationResult:
    r = ValidationResult("AC-05", "no signal/evidence computation logic in 42.3")
    if not SCRIPT_42_3.exists():
        r.fail("cli script missing")
        return r
    text = SCRIPT_42_3.read_text(encoding="utf-8")

    forbidden_fns = [
        (r'def\s+resolve_query', "resolve_query definition"),
        (r'def\s+bind_signals', "bind_signals definition"),
        (r'def\s+bind_evidence', "bind_evidence definition"),
        (r'def\s+bind_navigation', "bind_navigation definition"),
        (r'def\s+infer_', "infer_ function"),
        (r'def\s+compute_', "compute_ function"),
        (r'json\.loads\(', "direct JSON parsing (bypass)"),
    ]
    ok = True
    for pat, label in forbidden_fns:
        if re.search(pat, text, re.IGNORECASE):
            r.fail(f"forbidden: {label}")
            ok = False
        else:
            r.pass_(f"no computation: {label}")

    if ok:
        r.passed = True
    return r


def ac06_42_2_content_present() -> ValidationResult:
    r = ValidationResult("AC-06", "42.2 narrative content present in 42.3 output")
    # Run 42.2 directly and 42.3 — core narrative sections must appear in both
    res_42_2 = _run(SCRIPT_42_2, ["GQ-001"])
    res_42_3 = _run(SCRIPT_42_3, ["GQ-001"])

    if res_42_2.returncode != 0:
        r.fail(f"42.2 execution failed (exit={res_42_2.returncode})")
        return r
    if res_42_3.returncode != 0:
        r.fail(f"42.3 execution failed (exit={res_42_3.returncode})")
        return r

    # Core sections from 42.2 must be present in 42.3 output
    core_sections = [
        "INTELLIGENCE SIGNALS",
        "EVIDENCE CHAINS",
        "NAVIGATION MAP",
        "INTELLIGENCE RESPONSE",
        "RENDER COMPLETE",
    ]
    ok = True
    for sec in core_sections:
        if sec in res_42_2.stdout and sec in res_42_3.stdout:
            r.pass_(f"section '{sec}' present in both 42.2 and 42.3 output")
        elif sec not in res_42_2.stdout:
            r.fail(f"section '{sec}' missing from 42.2 output")
            ok = False
        else:
            r.fail(f"section '{sec}' present in 42.2 but MISSING from 42.3")
            ok = False

    # Signal content passthrough: SIG-002 title must appear in 42.3
    sig_title = "Platform Runtime State: Seven Core Dimensions Are Currently Unknown"
    if sig_title in res_42_3.stdout:
        r.pass_("signal title preserved verbatim in 42.3 output")
    else:
        r.fail("signal title missing from 42.3 output")
        ok = False

    if ok:
        r.passed = True
    return r


def ac07_demo_framing() -> ValidationResult:
    r = ValidationResult("AC-07", "demo framing present (header + footer) in 42.3 output")
    res = _run(SCRIPT_42_3, ["GQ-001"])
    if res.returncode != 0:
        r.fail(f"execution failed (exit={res.returncode})")
        return r
    output = res.stdout

    framing_tokens = [
        ("PIOS-42.3-RUN01-CONTRACT-v1", "contract ID in header"),
        ("Stream 42.3", "stream reference in header"),
        ("Layer chain", "layer chain declaration"),
        ("ExecLens session complete", "session complete footer"),
        ("Evidence-first delivery", "governance footer"),
    ]
    ok = True
    for token, label in framing_tokens:
        if token in output:
            r.pass_(f"{label}: '{token}'")
        else:
            r.fail(f"{label} MISSING: '{token}'")
            ok = False

    if ok:
        r.passed = True
    return r


def ac08_fail_closed() -> ValidationResult:
    r = ValidationResult("AC-08", "fail closed on invalid query_id via 42.2")
    for bad_id in ["GQ-999", "NOT-A-QUERY", "INVALID"]:
        res = _run(SCRIPT_42_3, [bad_id])
        if res.returncode != 0:
            r.pass_(f"{bad_id} → exit non-zero (fail closed)")
        else:
            r.fail(f"{bad_id} should fail closed but returned exit 0")
            return r
    r.passed = True
    return r


def ac09_deterministic() -> ValidationResult:
    r = ValidationResult("AC-09", "deterministic across runs")
    outputs = []
    for run_n in range(2):
        res = _run(SCRIPT_42_3, ["GQ-001"])
        if res.returncode != 0:
            r.fail(f"run {run_n+1} failed (exit={res.returncode})")
            return r
        outputs.append(res.stdout)

    if outputs[0] == outputs[1]:
        r.pass_("two executions of GQ-001 produced identical stdout")
    else:
        lines_a = outputs[0].splitlines()
        lines_b = outputs[1].splitlines()
        for i, (la, lb) in enumerate(zip(lines_a, lines_b)):
            if la != lb:
                r.fail(f"differs at line {i+1}:\n    run1: {la!r}\n    run2: {lb!r}")
                return r
        r.fail(f"length differs: {len(lines_a)} vs {len(lines_b)} lines")
        return r
    return r


def ac10_no_file_writes() -> ValidationResult:
    r = ValidationResult("AC-10", "no file writes in 42.3")
    if not SCRIPT_42_3.exists():
        r.fail("cli script missing")
        return r
    text = SCRIPT_42_3.read_text(encoding="utf-8")
    ok = True
    for pat, label in [
        (r"open\(.*[\"']w[\"']", "open(..., 'w')"),
        (r"\.write_text\(", ".write_text()"),
        (r"shutil\.copy", "shutil.copy"),
    ]:
        if re.search(pat, text):
            r.fail(f"file-write pattern found: {label}")
            ok = False
        else:
            r.pass_(f"no file-write: {label}")
    if ok:
        r.passed = True
    return r


def v3_content_integrity() -> ValidationResult:
    r = ValidationResult("V3", "42.3 output content identical to 42.2 (modulo framing)")
    res_42_2 = _run(SCRIPT_42_2, ["GQ-006"])
    res_42_3 = _run(SCRIPT_42_3, ["GQ-006"])

    if res_42_2.returncode != 0 or res_42_3.returncode != 0:
        r.fail("execution failure")
        return r

    # Strip 42.3-specific framing lines (contain "42.3" or the demo dot-border)
    # Then collapse consecutive blank lines so padding differences don't cause spurious diffs.
    def strip_framing(text: str) -> list:
        filtered = [
            ln for ln in text.splitlines()
            if not (
                "42.3" in ln
                or ln.strip().startswith("·" * 20)
                or "ExecLens session complete" in ln
                or "Evidence-first delivery" in ln
                or "All content sourced from locked" in ln
                or "No inference. No recomputation" in ln
                or "Executing query:" in ln
                or "Layer chain" in ln
            )
        ]
        # Collapse consecutive blank lines into one
        collapsed = []
        prev_blank = False
        for ln in filtered:
            is_blank = not ln.strip()
            if is_blank and prev_blank:
                continue
            collapsed.append(ln)
            prev_blank = is_blank
        # Strip leading/trailing blank lines
        while collapsed and not collapsed[0].strip():
            collapsed.pop(0)
        while collapsed and not collapsed[-1].strip():
            collapsed.pop()
        return collapsed

    core_42_2 = strip_framing(res_42_2.stdout)
    core_42_3 = strip_framing(res_42_3.stdout)

    if core_42_2 == core_42_3:
        r.pass_(f"core content identical after framing removal ({len(core_42_2)} lines)")
    else:
        diff_count = sum(1 for a, b in zip(core_42_2, core_42_3) if a != b)
        diff_count += abs(len(core_42_2) - len(core_42_3))
        r.fail(f"core content differs: {diff_count} line(s) different")
        # Show first diff
        for i, (la, lb) in enumerate(zip(core_42_2, core_42_3)):
            if la != lb:
                r.fail(f"  first diff at line {i+1}:\n    42.2: {la!r}\n    42.3: {lb!r}")
                break
        return r
    return r


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Validate ExecLens Delivery Layer (PIOS-42.3-RUN01-CONTRACT-v1)"
    )
    parser.add_argument("--verbose", "-v", action="store_true")
    args = parser.parse_args()

    print(f"42.3 ExecLens Delivery & Interface Layer — Validation")
    print(f"  CLI script : {SCRIPT_42_3.relative_to(REPO_ROOT)}")
    print()

    results = [
        ac01_cli_exists(),
        ac02_validator_exists(),
        ac03_imports_42_2(),
        ac04_no_direct_41x_access(),
        ac05_no_computation_logic(),
        ac06_42_2_content_present(),
        ac07_demo_framing(),
        ac08_fail_closed(),
        ac09_deterministic(),
        ac10_no_file_writes(),
        v3_content_integrity(),
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
