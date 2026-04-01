#!/usr/bin/env python3
"""
Stream 40.16 — Baseline Validation Script
Layer: L8 (Governance/Validation)
Contract: docs/pios/contracts/40.16/execution_contract.md

Freezes: docs/pios/40.16/baseline/ (PiOS Core Baseline 0.1)

Procedure:
  1. Re-runs run_esi_derivation.py (40.4 primary path) and run_rag_derivation.py
  2. Loads fresh outputs alongside frozen baseline artifacts
  3. Normalizes both sides: strips timestamp fields ("generated", "**Generated:**",
     "| Generated |" rows) — all other values must match exactly
  4. Reports per-artifact PASS/FAIL and overall result

Usage:
  python validate_baseline.py

Does NOT modify 40.4 artifacts or derivation logic.
Does NOT write to baseline/ — baseline is read-only.
"""

import json
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
SCRIPT_DIR = Path(__file__).parent
DOCS_40_16 = REPO_ROOT / "docs" / "pios" / "40.16"
BASELINE_DIR = DOCS_40_16 / "baseline"

ARTIFACTS = [
    "esi_manifest.json",
    "rag_output_set.md",
    "derivation_execution_manifest.md",
]

PASS = "PASS"
FAIL = "FAIL"


# ---------------------------------------------------------------------------
# Normalization — strip timestamp fields before comparison
# ---------------------------------------------------------------------------

# JSON fields to exclude from comparison
_JSON_EXCLUDE_KEYS = {"generated"}

# Markdown line patterns to exclude from comparison
_MD_EXCLUDE_PATTERNS = [
    re.compile(r"^\*\*Generated:\*\*\s+\S+", re.IGNORECASE),
    re.compile(r"^\|\s*Generated\s*\|\s+\S+\s*\|", re.IGNORECASE),
]


def _normalize_json(obj):
    """Recursively remove excluded keys from a JSON-decoded object."""
    if isinstance(obj, dict):
        return {k: _normalize_json(v) for k, v in obj.items() if k not in _JSON_EXCLUDE_KEYS}
    if isinstance(obj, list):
        return [_normalize_json(item) for item in obj]
    return obj


def _normalize_md(text):
    """Remove timestamp-bearing lines from markdown text."""
    lines = text.splitlines()
    kept = [line for line in lines if not any(pat.match(line.strip()) for pat in _MD_EXCLUDE_PATTERNS)]
    return "\n".join(kept)


def _load_normalized(path):
    """Load and normalize an artifact. Returns (normalized_value, is_json)."""
    text = path.read_text()
    if path.suffix == ".json":
        obj = json.loads(text)
        return _normalize_json(obj), True
    else:
        return _normalize_md(text), False


# ---------------------------------------------------------------------------
# Comparison
# ---------------------------------------------------------------------------

def compare_artifact(name, fresh_path, baseline_path):
    """Compare one artifact. Returns (result, detail)."""
    if not baseline_path.exists():
        return FAIL, f"Baseline artifact missing: {baseline_path}"
    if not fresh_path.exists():
        return FAIL, f"Fresh artifact missing: {fresh_path}"

    fresh_norm, is_json = _load_normalized(fresh_path)
    baseline_norm, _ = _load_normalized(baseline_path)

    if is_json:
        fresh_serial = json.dumps(fresh_norm, sort_keys=True)
        baseline_serial = json.dumps(baseline_norm, sort_keys=True)
        if fresh_serial == baseline_serial:
            return PASS, "JSON values match (timestamps excluded)"
        # Find first diverging key path for diagnostics
        diff = _json_diff(fresh_norm, baseline_norm, path="")
        return FAIL, f"JSON mismatch: {diff}"
    else:
        if fresh_norm == baseline_norm:
            return PASS, "Markdown content matches (Generated lines excluded)"
        diff_lines = _md_diff(fresh_norm, baseline_norm)
        return FAIL, f"Markdown mismatch at line(s): {diff_lines}"


def _json_diff(a, b, path):
    """Return a short description of the first difference between two normalized dicts."""
    if isinstance(a, dict) and isinstance(b, dict):
        for key in sorted(set(list(a.keys()) + list(b.keys()))):
            sub_path = f"{path}.{key}" if path else key
            if key not in a:
                return f"key '{sub_path}' missing in fresh"
            if key not in b:
                return f"key '{sub_path}' missing in baseline"
            result = _json_diff(a[key], b[key], sub_path)
            if result:
                return result
        return ""
    if isinstance(a, list) and isinstance(b, list):
        if len(a) != len(b):
            return f"list length at '{path}': fresh={len(a)}, baseline={len(b)}"
        for i, (ai, bi) in enumerate(zip(a, b)):
            result = _json_diff(ai, bi, f"{path}[{i}]")
            if result:
                return result
        return ""
    if a != b:
        return f"'{path}': fresh={repr(a)}, baseline={repr(b)}"
    return ""


def _md_diff(fresh, baseline):
    """Return indices of first differing lines."""
    fresh_lines = fresh.splitlines()
    base_lines = baseline.splitlines()
    diffs = []
    for i, (fl, bl) in enumerate(zip(fresh_lines, base_lines)):
        if fl != bl:
            diffs.append(f"line {i+1}: fresh={repr(fl[:60])}, baseline={repr(bl[:60])}")
            if len(diffs) >= 3:
                break
    if len(fresh_lines) != len(base_lines):
        diffs.append(f"line count: fresh={len(fresh_lines)}, baseline={len(base_lines)}")
    return "; ".join(diffs) if diffs else "unknown"


# ---------------------------------------------------------------------------
# Re-run derivation
# ---------------------------------------------------------------------------

def run_derivation():
    """Run ESI and RAG derivation via 40.4 primary path."""
    esi_script = SCRIPT_DIR / "run_esi_derivation.py"
    rag_script = SCRIPT_DIR / "run_rag_derivation.py"

    print("Re-running ESI derivation (40.4 primary)...")
    result = subprocess.run(
        [sys.executable, str(esi_script)],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        return False, f"ESI derivation failed: {result.stderr.strip()}"
    print(f"  {result.stdout.strip()}")

    print("Re-running RAG derivation...")
    result = subprocess.run(
        [sys.executable, str(rag_script)],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        return False, f"RAG derivation failed: {result.stderr.strip()}"
    print(f"  {result.stdout.strip()}")

    return True, "ok"


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print(f"Baseline: {BASELINE_DIR}")
    print(f"Baseline identity: PiOS Core Baseline 0.1 / run_40_4_primary")
    print()

    ok, detail = run_derivation()
    if not ok:
        print(f"DERIVATION ERROR: {detail}", file=sys.stderr)
        sys.exit(1)

    print()
    print("Comparing against frozen baseline (timestamps excluded)...")
    print()

    results = []
    for artifact in ARTIFACTS:
        fresh_path = DOCS_40_16 / artifact
        baseline_path = BASELINE_DIR / artifact
        result, detail = compare_artifact(artifact, fresh_path, baseline_path)
        results.append((artifact, result, detail))
        status_icon = "✓" if result == PASS else "✗"
        print(f"  [{result}] {artifact}")
        if result == FAIL:
            print(f"         {detail}")

    print()
    overall = PASS if all(r == PASS for _, r, _ in results) else FAIL
    passed = sum(1 for _, r, _ in results if r == PASS)
    print(f"Baseline validation: {overall} ({passed}/{len(results)} artifacts match)")

    if overall == FAIL:
        sys.exit(1)


if __name__ == "__main__":
    main()
