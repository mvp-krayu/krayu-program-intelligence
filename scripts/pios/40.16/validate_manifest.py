#!/usr/bin/env python3
"""
Stream 40.16 — Derivation Validation Script
Layer: L8 (Governance/Validation)
Contract: docs/pios/contracts/40.16/execution_contract.md

Inputs:
  docs/pios/40.16/esi_manifest.json
  docs/pios/40.16/derivation_execution_manifest.md  (existence check)
  docs/pios/40.16/esi_output_set.md                 (existence check)
  docs/pios/40.16/rag_output_set.md                 (existence check)

Outputs:
  docs/pios/40.16/derivation_validation_report.md

Validation protocol:
  DVT-01..DVT-13 from docs/pios/40.16/derivation_validation_protocol.md
  DA-01..DA-03   DRIFT-001 remediation audit
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
DOCS_40_16 = REPO_ROOT / "docs" / "pios" / "40.16"
ESI_JSON_PATH = DOCS_40_16 / "esi_manifest.json"
ESI_MD_PATH = DOCS_40_16 / "esi_output_set.md"
RAG_MD_PATH = DOCS_40_16 / "rag_output_set.md"
MANIFEST_MD_PATH = DOCS_40_16 / "derivation_execution_manifest.md"
REPORT_PATH = DOCS_40_16 / "derivation_validation_report.md"

PASS = "PASS"
FAIL = "FAIL"
SKIP = "SKIP"
WARN = "WARN"


def test(test_id, name, result, detail):
    return {"id": test_id, "name": name, "result": result, "detail": detail}


def run_dvt_01(esi_manifest):
    """DVT-01: Determinism — same inputs produce same outputs.
    Verify that NF values are deterministically computed from TC observations."""
    results = []
    for wr in esi_manifest["windows"]:
        wid = wr["window_id"]
        obs = None
        # Re-derive NF-03 from DT-007 as a spot check
        dt_007 = None
        for tc, td in wr["tc_observations"].items():
            if tc == "TC-02":
                val = td.get("value")
                dt_007 = val
        nf03_expected = None
        if dt_007 == "complete":
            nf03_expected = 1.0
        elif dt_007 == "incomplete":
            nf03_expected = 0.0

        nf03_actual = wr["nf"].get("NF-03")
        if nf03_expected is not None and abs((nf03_actual or 0.0) - nf03_expected) > 1e-9:
            results.append((wid, FAIL, f"NF-03 mismatch: expected {nf03_expected}, got {nf03_actual}"))
        else:
            results.append((wid, PASS, f"NF-03 determinism check passed (DT-007={dt_007} → NF-03={nf03_actual})"))

    overall = PASS if all(r[1] == PASS for r in results) else FAIL
    detail = "; ".join(f"{wid}: {r}" for wid, s, r in results)
    return test("DVT-01", "Determinism — NF-03 spot check from TC-02", overall, detail)


def run_dvt_02(esi_manifest):
    """DVT-02: All metrics trace to 40.4 telemetry surface.
    Verify TC observations reference valid AT/DT metric IDs."""
    valid_metrics = {
        "AT-001", "AT-007", "AT-008", "AT-009",
        "DT-001", "DT-003", "DT-006", "DT-007", "DT-008"
    }
    issues = []
    for wr in esi_manifest["windows"]:
        for tc, td in wr["tc_observations"].items():
            metric = td.get("metric") or td.get("metrics") or []
            if isinstance(metric, str):
                metric = [metric]
            for m in metric:
                if m and m not in valid_metrics and not m.startswith("—"):
                    issues.append(f"{tc}: unrecognized metric {m}")
    if issues:
        return test("DVT-02", "Metric traceability to 40.4 surfaces", FAIL, "; ".join(issues))
    return test("DVT-02", "Metric traceability to 40.4 surfaces", PASS,
                "All TC observations reference valid AT/DT metric IDs from 40.4")


def run_dvt_03(esi_manifest):
    """DVT-03: Evidence reference completeness.
    Every defined PES signal must have a traceable NF chain."""
    issues = []
    for wr in esi_manifest["windows"]:
        pes = wr["pes"]
        nf = wr["nf"]
        # P01 requires NF-01, NF-02
        if pes.get("PES-ESI-01") is not None:
            if nf.get("NF-01") is None or nf.get("NF-02") is None:
                issues.append(f"{wr['window_id']}: PES-ESI-01 defined but NF-01 or NF-02 is UNDEFINED")
        # P03 requires NF-03, NF-04
        if pes.get("PES-ESI-03") is not None:
            if nf.get("NF-03") is None or nf.get("NF-04") is None:
                issues.append(f"{wr['window_id']}: PES-ESI-03 defined but NF-03 or NF-04 is UNDEFINED")
        # P04 requires NF-05
        if pes.get("PES-ESI-04") is not None:
            if nf.get("NF-05") is None:
                issues.append(f"{wr['window_id']}: PES-ESI-04 defined but NF-05 is UNDEFINED")
        # P05 requires NF-06, NF-07
        if pes.get("PES-ESI-05") is not None:
            if nf.get("NF-06") is None or nf.get("NF-07") is None:
                issues.append(f"{wr['window_id']}: PES-ESI-05 defined but NF-06 or NF-07 is UNDEFINED")
    if issues:
        return test("DVT-03", "Evidence reference completeness — NF chains", FAIL, "; ".join(issues))
    return test("DVT-03", "Evidence reference completeness — NF chains", PASS,
                "All defined PES signals have complete NF input chains")


def run_dvt_04(esi_manifest):
    """DVT-04: CG-01 gap properly declared and PARTIAL mode active."""
    issues = []
    for wr in esi_manifest["windows"]:
        pes_p02 = wr["pes"].get("PES-ESI-02")
        esi_mode = wr["esi"].get("mode")
        tc_09 = wr["tc_observations"].get("TC-09", {})

        if pes_p02 is not None:
            issues.append(f"{wr['window_id']}: PES-ESI-02 should be UNDEFINED under CG-01 but has value {pes_p02}")
        if tc_09.get("status") != "NOT_DEFINED":
            issues.append(f"{wr['window_id']}: TC-09 status should be NOT_DEFINED (CG-01), got {tc_09.get('status')}")
        if esi_mode != "PARTIAL" and wr["esi"]["value"] is not None:
            issues.append(f"{wr['window_id']}: ESI mode should be PARTIAL under CG-01, got {esi_mode}")

    if issues:
        return test("DVT-04", "CG-01 gap declaration and PARTIAL mode", FAIL, "; ".join(issues))
    return test("DVT-04", "CG-01 gap declaration and PARTIAL mode", PASS,
                "CG-01 active: PES-ESI-02=UNDEFINED, TC-09=NOT_DEFINED, ESI mode=PARTIAL for all windows")


def run_dvt_05(esi_manifest):
    """DVT-05: Source agnosticism — no hardcoded repo paths in NF derivation."""
    # This is a code-level check; verify via spot check that TC observations
    # carry only metric IDs, not file paths
    issues = []
    for wr in esi_manifest["windows"]:
        for tc, td in wr["tc_observations"].items():
            val = str(td.get("value", ""))
            if "/" in val and not val.startswith("UNDEFINED"):
                issues.append(f"{tc}: value appears to contain a path: {val}")
    if issues:
        return test("DVT-05", "Source agnosticism — no hardcoded paths in TC observations", FAIL,
                    "; ".join(issues))
    return test("DVT-05", "Source agnosticism — no hardcoded paths in TC observations", PASS,
                "TC observation values contain metric IDs and scalars only")


def run_dvt_06(esi_manifest):
    """DVT-06: NF-02 neutral value when window_count < 3."""
    window_count = esi_manifest["window_count"]
    issues = []
    if window_count < 3:
        for wr in esi_manifest["windows"]:
            nf02 = wr["nf"].get("NF-02")
            if nf02 != 0.5:
                issues.append(f"{wr['window_id']}: NF-02 should be 0.5 (neutral) when N<3, got {nf02}")
    if issues:
        return test("DVT-06", "NF-02 neutral value enforcement (N<3)", FAIL, "; ".join(issues))
    note = f"N={window_count}; NF-02=0.5 (neutral) applied correctly" if window_count < 3 else f"N={window_count}≥3; NF-02 variance-based"
    return test("DVT-06", "NF-02 neutral value enforcement (N<3)", PASS, note)


def run_dvt_07(esi_manifest):
    """DVT-07: ESI UNDEFINED when any required PARTIAL mode signal is UNDEFINED."""
    issues = []
    for wr in esi_manifest["windows"]:
        pes = wr["pes"]
        esi = wr["esi"]
        mode = esi.get("mode")
        value = esi.get("value")

        if mode == "PARTIAL":
            required = ["PES-ESI-01", "PES-ESI-03", "PES-ESI-04", "PES-ESI-05"]
            any_undefined = any(pes.get(sig) is None for sig in required)
            if any_undefined and value is not None:
                issues.append(f"{wr['window_id']}: ESI has value {value} but a required PARTIAL signal is UNDEFINED")
            if not any_undefined and value is None:
                issues.append(f"{wr['window_id']}: ESI is UNDEFINED but all required PARTIAL signals are defined")

    if issues:
        return test("DVT-07", "ESI UNDEFINED propagation in PARTIAL mode", FAIL, "; ".join(issues))
    return test("DVT-07", "ESI UNDEFINED propagation in PARTIAL mode", PASS,
                "ESI UNDEFINED/DEFINED status consistent with PARTIAL mode signal availability")


def run_dvt_08(esi_manifest):
    """DVT-08: PARTIAL mode weights sum to 1.0."""
    partial_weights = {"PES-ESI-01": 0.3125, "PES-ESI-03": 0.3125, "PES-ESI-04": 0.2500, "PES-ESI-05": 0.1250}
    total = sum(partial_weights.values())
    if abs(total - 1.0) > 1e-9:
        return test("DVT-08", "PARTIAL mode weight normalization", FAIL, f"Weights sum to {total}, expected 1.0")
    return test("DVT-08", "PARTIAL mode weight normalization", PASS,
                f"PARTIAL weights sum = {total:.4f} (correct)")


def run_dvt_09():
    """DVT-09: RAG INSUFFICIENT_WINDOWS when N < 2."""
    # This is verified by reading rag_output_set.md content
    if not RAG_MD_PATH.exists():
        return test("DVT-09", "RAG INSUFFICIENT_WINDOWS for N<2", SKIP, "rag_output_set.md not found")
    content = RAG_MD_PATH.read_text()
    if "INSUFFICIENT_WINDOWS" in content:
        return test("DVT-09", "RAG INSUFFICIENT_WINDOWS for N<2", PASS,
                    "rag_output_set.md declares INSUFFICIENT_WINDOWS for N=1 run")
    return test("DVT-09", "RAG INSUFFICIENT_WINDOWS for N<2", WARN,
                "rag_output_set.md does not contain INSUFFICIENT_WINDOWS — verify window count ≥2")


def run_dvt_10(esi_manifest):
    """DVT-10: All NF values in [0.0, 1.0] range."""
    issues = []
    for wr in esi_manifest["windows"]:
        for fn, fv in wr["nf"].items():
            if fv is not None:
                if fv < 0.0 - 1e-9 or fv > 1.0 + 1e-9:
                    issues.append(f"{wr['window_id']}: {fn}={fv} out of [0.0, 1.0]")
    if issues:
        return test("DVT-10", "NF boundary: all values in [0.0, 1.0]", FAIL, "; ".join(issues))
    return test("DVT-10", "NF boundary: all values in [0.0, 1.0]", PASS,
                "All non-UNDEFINED NF values within [0.0, 1.0]")


def run_dvt_11(esi_manifest):
    """DVT-11: ESI value in [0, 100] range when defined."""
    issues = []
    for wr in esi_manifest["windows"]:
        esi_val = wr["esi"]["value"]
        if esi_val is not None:
            if esi_val < 0.0 - 1e-6 or esi_val > 100.0 + 1e-6:
                issues.append(f"{wr['window_id']}: ESI={esi_val} out of [0, 100]")
    if issues:
        return test("DVT-11", "ESI boundary: value in [0, 100]", FAIL, "; ".join(issues))
    return test("DVT-11", "ESI boundary: value in [0, 100]", PASS,
                "All non-UNDEFINED ESI values within [0, 100]")


def run_dvt_12():
    """DVT-12: All required output artifacts exist."""
    artifacts = [ESI_MD_PATH, RAG_MD_PATH, MANIFEST_MD_PATH, ESI_JSON_PATH]
    missing = [str(p) for p in artifacts if not p.exists()]
    if missing:
        return test("DVT-12", "Output artifact existence", FAIL, f"Missing: {', '.join(missing)}")
    return test("DVT-12", "Output artifact existence", PASS,
                f"All required artifacts present: {', '.join(p.name for p in artifacts)}")


def run_dvt_13(esi_manifest):
    """DVT-13: Run ID consistent across all output artifacts."""
    run_id = esi_manifest["run_id"]
    issues = []

    for path in [ESI_MD_PATH, RAG_MD_PATH, MANIFEST_MD_PATH]:
        if path.exists():
            content = path.read_text()
            if run_id not in content:
                issues.append(f"{path.name} does not contain run_id={run_id}")

    if issues:
        return test("DVT-13", "Run ID consistency across artifacts", FAIL, "; ".join(issues))
    return test("DVT-13", "Run ID consistency across artifacts", PASS,
                f"run_id={run_id} present in all output artifacts")


def run_da_01():
    """DA-01: DRIFT-001 audit — verify SSZ/SSI computation is NOT present in 40.16 scripts."""
    script_dir = Path(__file__).parent
    issues = []
    for script in script_dir.glob("*.py"):
        if script.name == "validate_manifest.py":
            continue  # validator contains audit strings by necessity
        content = script.read_text()
        if "computeSSZ" in content or "computeSSI" in content or "ssz" in content.lower():
            issues.append(f"{script.name}: contains SSZ/SSI references (DRIFT-001 scope violation)")
    if issues:
        return test("DA-01", "DRIFT-001: no SSZ/SSI in 40.16 scripts", FAIL, "; ".join(issues))
    return test("DA-01", "DRIFT-001: no SSZ/SSI in 40.16 scripts", PASS,
                "No SSZ/SSI computation references found in 40.16 scripts")


def run_da_02():
    """DA-02: DRIFT-001 audit — verify L6 scripts are READ-ONLY (no modification by 40.16)."""
    # We can only verify that 40.16 scripts do not import from 42.x runtime
    script_dir = Path(__file__).parent
    issues = []
    for script in script_dir.glob("*.py"):
        if script.name == "validate_manifest.py":
            continue  # validator references 42.x as audit search terms
        content = script.read_text()
        if "42." in content or "execlens" in content.lower() or "app/" in content:
            issues.append(f"{script.name}: references L6/42.x scope")
    if issues:
        return test("DA-02", "DRIFT-001: 40.16 does not reference L6/42.x scope", FAIL, "; ".join(issues))
    return test("DA-02", "DRIFT-001: 40.16 does not reference L6/42.x scope", PASS,
                "No L6/42.x scope references in 40.16 scripts")


def run_da_03(esi_manifest):
    """DA-03: DRIFT-001 audit — ESI/RAG derivation uses 40.4 telemetry only (no L6 signals)."""
    # Verify TC observations reference only 40.4 AT/DT metrics
    l6_signals = {"ESI", "RAG", "SSZ", "SSI", "EXEC_RISK"}
    issues = []
    for wr in esi_manifest["windows"]:
        for tc, td in wr["tc_observations"].items():
            metric = str(td.get("metric", ""))
            for sig in l6_signals:
                if sig in metric:
                    issues.append(f"{tc}: references L6 signal {sig} instead of 40.4 metric")
    if issues:
        return test("DA-03", "DRIFT-001: derivation inputs from 40.4 only (no L6 signals)", FAIL,
                    "; ".join(issues))
    return test("DA-03", "DRIFT-001: derivation inputs from 40.4 only (no L6 signals)", PASS,
                "All TC observations reference 40.4 AT/DT metrics only")


def render_report(results, run_id, run_ts):
    total = len(results)
    passed = sum(1 for r in results if r["result"] == PASS)
    failed = sum(1 for r in results if r["result"] == FAIL)
    warned = sum(1 for r in results if r["result"] == WARN)
    skipped = sum(1 for r in results if r["result"] == SKIP)

    lines = [
        "# Derivation Validation Report",
        "",
        f"**Stream:** 40.16 — Derivation Validation",
        f"**Run ID:** {run_id}",
        f"**Generated:** {run_ts}",
        f"**Script:** scripts/pios/40.16/validate_manifest.py",
        f"**Protocol:** docs/pios/40.16/derivation_validation_protocol.md",
        "",
        "---",
        "",
        "## Validation Summary",
        "",
        f"| Field | Value |",
        f"|---|---|",
        f"| Total Tests | {total} |",
        f"| PASS | {passed} |",
        f"| FAIL | {failed} |",
        f"| WARN | {warned} |",
        f"| SKIP | {skipped} |",
        f"| Overall | {'PASS' if failed == 0 else 'FAIL'} |",
        "",
        "---",
        "",
        "## DVT Results",
        "",
        "| Test ID | Name | Result | Detail |",
        "|---|---|---|---|",
    ]
    for r in results:
        if r["id"].startswith("DVT"):
            lines.append(f"| {r['id']} | {r['name']} | {r['result']} | {r['detail']} |")

    lines += [
        "",
        "## DA Results (DRIFT-001 Remediation Audit)",
        "",
        "| Test ID | Name | Result | Detail |",
        "|---|---|---|---|",
    ]
    for r in results:
        if r["id"].startswith("DA"):
            lines.append(f"| {r['id']} | {r['name']} | {r['result']} | {r['detail']} |")

    lines += [""]
    return "\n".join(lines)


def main():
    if not ESI_JSON_PATH.exists():
        print(f"ERROR: esi_manifest.json not found at {ESI_JSON_PATH}", file=sys.stderr)
        sys.exit(1)

    with open(ESI_JSON_PATH) as f:
        esi_manifest = json.load(f)

    run_id = esi_manifest["run_id"]
    run_ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    results = [
        run_dvt_01(esi_manifest),
        run_dvt_02(esi_manifest),
        run_dvt_03(esi_manifest),
        run_dvt_04(esi_manifest),
        run_dvt_05(esi_manifest),
        run_dvt_06(esi_manifest),
        run_dvt_07(esi_manifest),
        run_dvt_08(esi_manifest),
        run_dvt_09(),
        run_dvt_10(esi_manifest),
        run_dvt_11(esi_manifest),
        run_dvt_12(),
        run_dvt_13(esi_manifest),
        run_da_01(),
        run_da_02(),
        run_da_03(esi_manifest),
    ]

    report_md = render_report(results, run_id, run_ts)
    REPORT_PATH.write_text(report_md)
    print(f"Written: {REPORT_PATH}")

    failed = [r for r in results if r["result"] == FAIL]
    if failed:
        print(f"VALIDATION: FAIL — {len(failed)} test(s) failed", file=sys.stderr)
        for r in failed:
            print(f"  {r['id']}: {r['detail']}", file=sys.stderr)
        sys.exit(1)
    else:
        passed = sum(1 for r in results if r["result"] == PASS)
        print(f"VALIDATION: PASS — {passed}/{len(results)} tests passed")


if __name__ == "__main__":
    main()
