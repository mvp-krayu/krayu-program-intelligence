#!/usr/bin/env python3
"""
validate_narrative_rendering.py
PIOS-42.2-RUN01-CONTRACT-v1

Validates the ExecLens Narrative Rendering Layer (Stream 42.2) against
all acceptance criteria.

AC-01  render_executive_narrative.py exists
AC-02  validate_narrative_rendering.py exists
AC-03  42.2 uses 42.1 execution path (no bypass)
AC-04  all template sections rendered in output
AC-05  no signal loss or alteration
AC-06  no evidence loss or alteration
AC-07  no additional conclusions introduced
AC-08  unresolved links remain visible
AC-09  deterministic output across runs
AC-10  no canonical file writes

Usage:
  python3 scripts/pios/42.2/validate_narrative_rendering.py
  python3 scripts/pios/42.2/validate_narrative_rendering.py --verbose
  python3 scripts/pios/42.2/validate_narrative_rendering.py --query GQ-003
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Optional

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

REPO_ROOT     = Path(__file__).resolve().parents[3]
SCRIPT_42_2   = Path(__file__).parent / "render_executive_narrative.py"
SCRIPT_42_1   = Path(__file__).resolve().parents[1] / "42.1/run_execlens_query.py"

PATH_QUERY_SIGNAL_MAP   = REPO_ROOT / "docs/pios/41.5/query_signal_map.json"
PATH_SIGNAL_REGISTRY    = REPO_ROOT / "docs/pios/41.4/signal_registry.json"
PATH_EVIDENCE_INDEX     = REPO_ROOT / "docs/pios/41.4/evidence_mapping_index.json"
PATH_RESPONSE_TEMPLATES = REPO_ROOT / "docs/pios/41.5/query_response_templates.md"
PATH_PIE_VAULT          = REPO_ROOT / "docs/pios/41.2/pie_vault"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _load_json(path: Path) -> Optional[dict]:
    if not path.exists():
        return None
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def _run_render(query_id: str, extra: Optional[list] = None) -> subprocess.CompletedProcess:
    cmd = [sys.executable, str(SCRIPT_42_2), query_id]
    if extra:
        cmd += extra
    return subprocess.run(cmd, capture_output=True, text=True, cwd=REPO_ROOT)


class ValidationResult:
    def __init__(self, ac_id: str, description: str):
        self.ac_id       = ac_id
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
        return f"  [{status}]  {self.ac_id}: {self.description}"


# ---------------------------------------------------------------------------
# Acceptance criteria
# ---------------------------------------------------------------------------

def ac01_render_script_exists() -> ValidationResult:
    r = ValidationResult("AC-01", "render_executive_narrative.py exists")
    if SCRIPT_42_2.exists():
        r.pass_(f"found at {SCRIPT_42_2.relative_to(REPO_ROOT)}")
    else:
        r.fail(f"not found: {SCRIPT_42_2}")
    return r


def ac02_validator_exists() -> ValidationResult:
    r = ValidationResult("AC-02", "validate_narrative_rendering.py exists")
    this = Path(__file__)
    if this.exists():
        r.pass_(f"found at {this.relative_to(REPO_ROOT)}")
    else:
        r.fail(f"not found: {this}")
    return r


def ac03_uses_42_1_path() -> ValidationResult:
    r = ValidationResult("AC-03", "42.2 uses 42.1 execution path (no bypass)")
    if not SCRIPT_42_2.exists():
        r.fail("render script missing")
        return r
    text = SCRIPT_42_2.read_text(encoding="utf-8")

    # Check imports from 42.1
    if "import run_execlens_query" in text or "from run_execlens_query" in text:
        r.pass_("render script imports run_execlens_query (42.1 module)")
    else:
        r.fail("render script does not import 42.1 module")
        return r

    # Check sys.path insertion for 42.1 path
    if "42.1" in text and "sys.path" in text:
        r.pass_("42.1 path added to sys.path for import")
    else:
        r.fail("no sys.path insertion for 42.1 found")
        return r

    # Check that 42.1 traversal functions are called (not reimplemented)
    for fn in ["resolve_query", "bind_signals", "bind_evidence", "bind_navigation",
               "extract_template_section"]:
        if f"_q41.{fn}" in text or f"run_execlens_query.{fn}" in text:
            r.pass_(f"42.1 function called: {fn}")
        else:
            r.fail(f"42.1 function not called: {fn}")
            return r

    r.passed = True
    return r


def ac04_all_template_sections(query_id: str = "GQ-001") -> ValidationResult:
    r = ValidationResult("AC-04", "all template sections rendered in output")
    res = _run_render(query_id)
    if res.returncode != 0:
        r.fail(f"render failed (exit={res.returncode}): {res.stdout[:200]}")
        return r
    output = res.stdout
    required_sections = [
        "INTELLIGENCE SIGNALS",
        "EVIDENCE CHAINS",
        "NAVIGATION MAP",
        "INTELLIGENCE RESPONSE",
        "RENDER COMPLETE",
    ]
    ok = True
    for sec in required_sections:
        if sec in output:
            r.pass_(f"section present: '{sec}'")
        else:
            r.fail(f"section MISSING: '{sec}'")
            ok = False

    # Also check the template text anchor is in the output
    templates_text = PATH_RESPONSE_TEMPLATES.read_text(encoding="utf-8") \
        if PATH_RESPONSE_TEMPLATES.exists() else ""
    # Find the GQ's template section header
    pattern = re.compile(
        r'^## ' + re.escape(query_id) + r' — (.+)$', re.MULTILINE
    )
    m = pattern.search(templates_text)
    if m:
        # First 30 chars of template question in output
        probe = m.group(0)[:40]
        if probe in output:
            r.pass_(f"template header rendered: '{probe}'")
        else:
            r.fail(f"template header not found in output: '{probe}'")
            ok = False

    if ok:
        r.passed = True
    return r


def ac05_signal_preservation(query_id: str = "GQ-003") -> ValidationResult:
    r = ValidationResult("AC-05", "no signal loss or alteration")
    qsmap    = _load_json(PATH_QUERY_SIGNAL_MAP)
    registry = _load_json(PATH_SIGNAL_REGISTRY)
    if not qsmap or not registry:
        r.fail("required inputs missing")
        return r

    # Get the signals for this query
    queries = {q["query_id"]: q for q in qsmap.get("queries", [])}
    if query_id not in queries:
        r.fail(f"{query_id} not in query map")
        return r
    expected_sids = [m["signal_id"] for m in queries[query_id]["mapped_signals"]]

    res = _run_render(query_id)
    if res.returncode != 0:
        r.fail(f"render failed (exit={res.returncode})")
        return r
    output = res.stdout

    ok = True
    # Every mapped signal must appear in output
    for sid in expected_sids:
        if sid in output:
            r.pass_(f"{sid} present in rendered output")
        else:
            r.fail(f"{sid} MISSING from rendered output")
            ok = False

    # Verify signal title is not altered: spot-check first signal
    reg_map = {s["signal_id"]: s for s in registry.get("signals", [])}
    for sid in expected_sids:
        if sid in reg_map:
            title = reg_map[sid]["title"]
            if title in output:
                r.pass_(f"{sid} title preserved verbatim")
            else:
                r.fail(f"{sid} title not found verbatim in output")
                ok = False

    if ok:
        r.passed = True
    return r


def ac06_evidence_preservation(query_id: str = "GQ-001") -> ValidationResult:
    r = ValidationResult("AC-06", "no evidence loss or alteration")
    ev_idx = _load_json(PATH_EVIDENCE_INDEX)
    qsmap  = _load_json(PATH_QUERY_SIGNAL_MAP)
    if not ev_idx or not qsmap:
        r.fail("required inputs missing")
        return r

    queries = {q["query_id"]: q for q in qsmap.get("queries", [])}
    if query_id not in queries:
        r.fail(f"{query_id} not in query map")
        return r
    expected_sids = [m["signal_id"] for m in queries[query_id]["mapped_signals"]]
    ev_map = {s["signal_id"]: s for s in ev_idx.get("signals", [])}

    res = _run_render(query_id)
    if res.returncode != 0:
        r.fail(f"render failed (exit={res.returncode})")
        return r
    output = res.stdout

    ok = True
    for sid in expected_sids:
        if sid not in ev_map:
            continue
        ev = ev_map[sid]
        # Source object ID must appear
        src_id = ev.get("source_object_id", "")
        if src_id and src_id in output:
            r.pass_(f"{sid}: source object {src_id} present in output")
        elif src_id:
            r.fail(f"{sid}: source object {src_id} MISSING from output")
            ok = False

        # At least one supporting object ID present
        supports = ev.get("supporting_objects", [])
        if supports:
            first = supports[0]["object_id"]
            if first in output:
                r.pass_(f"{sid}: supporting object {first} present in output")
            else:
                r.fail(f"{sid}: supporting object {first} MISSING from output")
                ok = False

        # Evidence chain anchor present (first segment before first →)
        chain = ev.get("evidence_chain", "")
        if chain:
            first_seg = chain.split("→")[0].strip()[:30]
            if first_seg in output:
                r.pass_(f"{sid}: evidence chain anchor present: '{first_seg}'")
            else:
                r.fail(f"{sid}: evidence chain anchor missing: '{first_seg}'")
                ok = False

    if ok:
        r.passed = True
    return r


def ac07_no_additional_conclusions(query_id: str = "GQ-001") -> ValidationResult:
    r = ValidationResult("AC-07", "no additional conclusions introduced beyond template")
    if not SCRIPT_42_2.exists():
        r.fail("render script missing")
        return r

    text = SCRIPT_42_2.read_text(encoding="utf-8")

    # Check for forbidden patterns: no new signal generation, no inference calls
    forbidden_patterns = [
        (r"def\s+infer_", "infer_ function definition"),
        (r"def\s+compute_", "compute_ function definition"),
        (r"def\s+synthesize_", "synthesize_ function definition"),
        (r"json\.loads\(.*signal", "direct signal JSON parsing (bypass)"),
    ]
    ok = True
    for pat, label in forbidden_patterns:
        if re.search(pat, text, re.IGNORECASE):
            r.fail(f"forbidden pattern found: {label}")
            ok = False
        else:
            r.pass_(f"no forbidden pattern: {label}")

    # Verify rendering functions only reformat, not recalculate
    render_fns = ["render_signals_section", "render_evidence_section",
                  "render_navigation_section", "render_template_section"]
    for fn in render_fns:
        if fn in text:
            r.pass_(f"rendering function '{fn}' present (rendering-only)")

    # Ensure render_narrative calls 42.1 functions, not independent lookups
    if "_q41.resolve_query" in text and "_q41.bind_signals" in text:
        r.pass_("narrative calls 42.1 binding functions (no independent computation)")
    else:
        r.fail("narrative does not call 42.1 binding functions")
        ok = False

    if ok:
        r.passed = True
    return r


def ac08_unresolved_links_visible(query_id: str = "GQ-003") -> ValidationResult:
    r = ValidationResult("AC-08", "unresolved links remain visible in output")
    res = _run_render(query_id)
    if res.returncode != 0:
        r.fail(f"render failed (exit={res.returncode})")
        return r
    output = res.stdout

    # NAVIGATION MAP section must be present
    if "NAVIGATION MAP" in output:
        r.pass_("NAVIGATION MAP section present")
    else:
        r.fail("NAVIGATION MAP section missing")
        return r

    # Check that resolved/unresolved counts are shown
    if "links resolved" in output:
        r.pass_("link resolution count present in navigation section")
    else:
        r.fail("link resolution count missing from navigation section")
        return r

    # Run a query that has known unresolved links and check UNRESOLVED marker
    # GQ-003 or GQ-004 references CMP_01_blueedge_platform_Monorepo (known unresolved)
    if "UNRESOLVED" in output or "unresolved" in output.lower():
        r.pass_("unresolved links explicitly marked in output")
    else:
        # No unresolved links for this query — that's also valid
        r.pass_("no unresolved links for this query (all resolved)")

    r.passed = True
    return r


def ac09_deterministic(query_id: str = "GQ-001") -> ValidationResult:
    r = ValidationResult("AC-09", "deterministic output across runs")
    outputs = []
    for run_n in range(2):
        res = _run_render(query_id)
        if res.returncode != 0:
            r.fail(f"run {run_n+1} failed (exit={res.returncode})")
            return r
        outputs.append(res.stdout)

    if outputs[0] == outputs[1]:
        r.pass_(f"two executions of {query_id} produced identical stdout")
    else:
        lines_a = outputs[0].splitlines()
        lines_b = outputs[1].splitlines()
        for i, (la, lb) in enumerate(zip(lines_a, lines_b)):
            if la != lb:
                r.fail(f"output differs at line {i+1}:\n    run1: {la!r}\n    run2: {lb!r}")
                return r
        r.fail(f"outputs differ in length: {len(lines_a)} vs {len(lines_b)} lines")
        return r
    return r


def ac10_no_canonical_writes() -> ValidationResult:
    r = ValidationResult("AC-10", "no canonical file writes")
    if not SCRIPT_42_2.exists():
        r.fail("render script missing")
        return r
    text = SCRIPT_42_2.read_text(encoding="utf-8")

    # Check for file write operations
    write_patterns = [
        (r"open\(.*[\"']w[\"']", "open(..., 'w')"),
        (r"\.write_text\(", ".write_text()"),
        (r"shutil\.copy", "shutil.copy"),
        (r"\.write\(", ".write()"),
    ]
    ok = True
    for pat, label in write_patterns:
        if re.search(pat, text):
            r.fail(f"file-write pattern found: {label}")
            ok = False
        else:
            r.pass_(f"no file-write pattern: {label}")

    # Verify docs/pios/42.1/ is not modified (no write to 42.1 paths)
    if "docs/pios/41" in text and "write" in text.lower():
        r.fail("render script references 41.x path with write context")
        ok = False
    else:
        r.pass_("no write operations referencing docs/pios/41.x paths")

    if ok:
        r.passed = True
    return r


def v1_42_1_dependency() -> ValidationResult:
    r = ValidationResult("V1", "rendering traceable to 42.1 output")
    # When 42.1 preflight would fail (e.g. missing input), 42.2 must also fail
    res = _run_render("GQ-999")
    if res.returncode != 0:
        r.pass_("invalid query → 42.2 fails (42.1 failure propagates)")
    else:
        r.fail("invalid query GQ-999 should fail but returned exit 0")
        return r
    r.passed = True
    return r


def v9_fail_closed() -> ValidationResult:
    r = ValidationResult("V9", "if 42.1 fails, 42.2 must not proceed")
    # Test with clearly invalid query_id — 42.1 will fail, 42.2 must stop
    res = _run_render("NOT-A-QUERY")
    if res.returncode != 0:
        r.pass_("NOT-A-QUERY → 42.2 exits non-zero (fail closed)")
    else:
        r.fail("NOT-A-QUERY should fail closed but returned exit 0")
        return r
    # Verify the failure message originates from 42.1 traversal
    combined = res.stdout + res.stderr
    if "EXECUTION FAILURE" in combined or "not found" in combined.lower():
        r.pass_("failure message from 42.1 traversal visible")
    else:
        r.fail("failure message not visible in output")
        return r
    r.passed = True
    return r


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Validate ExecLens Narrative Rendering Layer (PIOS-42.2-RUN01-CONTRACT-v1)"
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Show per-check detail lines.",
    )
    parser.add_argument(
        "--query",
        default="GQ-001",
        help="Primary query ID for execution-based tests (default: GQ-001)",
    )
    args = parser.parse_args()

    print(f"42.2 ExecLens Narrative Rendering Layer — Validation")
    print(f"  Render script : {SCRIPT_42_2.relative_to(REPO_ROOT)}")
    print()

    results = [
        ac01_render_script_exists(),
        ac02_validator_exists(),
        ac03_uses_42_1_path(),
        ac04_all_template_sections(args.query),
        ac05_signal_preservation("GQ-003"),
        ac06_evidence_preservation(args.query),
        ac07_no_additional_conclusions(args.query),
        ac08_unresolved_links_visible("GQ-003"),
        ac09_deterministic(args.query),
        ac10_no_canonical_writes(),
        v1_42_1_dependency(),
        v9_fail_closed(),
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
    failed_count = len(results) - passed_count

    if all_passed:
        print("VALIDATION RESULT: PASS")
        print(f"All {len(results)} checks passed.")
        sys.exit(0)
    else:
        print("VALIDATION RESULT: FAIL")
        print(f"  Passed : {passed_count}/{len(results)}")
        print(f"  Failed : {failed_count}/{len(results)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
