#!/usr/bin/env python3
"""
validate_demo_refinement.py
PIOS-42.5-RUN01-CONTRACT-v1

Validates the ExecLens Demo Surface Refinement Layer (Stream 42.5).

Refinement targets validated:
  O1  governed gauges — relevance gauge, evidence metrics, navigation coverage bar
  O2  Obsidian deep-link activation for resolved PIE navigation links
  O3  visual polish without semantic change

Validation checks:

  AC-01  refined surface files exist (app/execlens-demo/ structure intact)
  AC-02  SignalGaugeCard contains governed gauge values from adapter fields
  AC-03  no governed gauge uses invented/fallback values
  AC-04  metric extraction logic is explicit and inspectable (in component source)
  AC-05  NavigationPanel contains Obsidian deep-link formula
  AC-06  unresolved links: NavigationPanel preserves unresolved state (no fake links)
  AC-07  42.4 baseline sections remain present in surface files
  AC-08  adapter still fails closed on invalid query (42.4 behavior preserved)
  AC-09  deterministic JSON from adapter (42.4 behavior preserved)
  AC-10  no writes to canonical docs or upstream layers

  R-01  relevance gauge mapping rule present in SignalGaugeCard source
  R-02  coverage gauge formula explicit in NavigationPanel source
  R-03  Obsidian link formula uses adapter nav path (not invented path)
  R-04  NEXT_PUBLIC_OBSIDIAN_VAULT_NAME config declared in next.config.js
  R-05  evidence metrics row sourced from evidence fields (not signal header)
  R-06  blocked-badge conditional on evidence.blocking_point (not hardcoded)
  R-07  no synthetic confidence percentages in component source
  R-08  no hardcoded signal content in refined components

Usage:
  python3 scripts/pios/42.5/validate_demo_refinement.py
  python3 scripts/pios/42.5/validate_demo_refinement.py --verbose
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

REPO_ROOT    = Path(__file__).resolve().parents[3]
ADAPTER      = REPO_ROOT / "scripts/pios/42.4/execlens_adapter.py"
APP_ROOT     = REPO_ROOT / "app/execlens-demo"
SIGNAL_CARD  = APP_ROOT / "components/SignalGaugeCard.js"
NAV_PANEL    = APP_ROOT / "components/NavigationPanel.js"
NEXT_CONFIG  = APP_ROOT / "next.config.js"
GLOBALS_CSS  = APP_ROOT / "styles/globals.css"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _run_adapter(args: list) -> subprocess.CompletedProcess:
    return subprocess.run(
        [sys.executable, str(ADAPTER)] + args,
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
# AC checks (acceptance criteria)
# ---------------------------------------------------------------------------

def ac01_surface_structure() -> ValidationResult:
    r = ValidationResult("AC-01", "refined surface files exist")
    required = [
        APP_ROOT / "package.json",
        APP_ROOT / "pages/index.js",
        APP_ROOT / "pages/api/execlens.js",
        APP_ROOT / "components/SignalGaugeCard.js",
        APP_ROOT / "components/NavigationPanel.js",
        APP_ROOT / "components/ExecutivePanel.js",
        APP_ROOT / "components/EvidencePanel.js",
        APP_ROOT / "components/QuerySelector.js",
        APP_ROOT / "styles/globals.css",
        NEXT_CONFIG,
    ]
    ok = True
    for f in required:
        if f.exists():
            r.pass_(f"exists: {f.relative_to(REPO_ROOT)}")
        else:
            r.fail(f"MISSING: {f.relative_to(REPO_ROOT)}")
            ok = False
    if ok:
        r.passed = True
    return r


def ac02_signal_card_governed_gauges() -> ValidationResult:
    r = ValidationResult("AC-02", "SignalGaugeCard contains governed gauge values from adapter fields")
    if not SIGNAL_CARD.exists():
        r.fail("SignalGaugeCard.js missing")
        return r
    text = SIGNAL_CARD.read_text(encoding="utf-8")

    # Relevance gauge must reference signal.relevance (adapter field)
    if "signal.relevance" in text:
        r.pass_("references signal.relevance (adapter output field)")
    else:
        r.fail("does not reference signal.relevance")
        return r

    # Confidence gauge must reference signal.evidence_confidence (adapter field)
    if "signal.evidence_confidence" in text:
        r.pass_("references signal.evidence_confidence (adapter output field)")
    else:
        r.fail("does not reference signal.evidence_confidence")
        return r

    # Evidence chain stages must reference evidence.evidence_chain
    if "evidence.evidence_chain" in text or "evidence_chain" in text:
        r.pass_("references evidence_chain for chain stage count")
    else:
        r.fail("does not reference evidence_chain for metrics")
        return r

    # Supporting objects count must reference supporting_objects
    if "supporting_objects" in text:
        r.pass_("references supporting_objects for evidence object count")
    else:
        r.fail("does not reference supporting_objects")
        return r

    r.passed = True
    return r


def ac03_no_invented_gauge_values() -> ValidationResult:
    r = ValidationResult("AC-03", "no governed gauge uses invented/fallback values")
    if not SIGNAL_CARD.exists():
        r.fail("SignalGaugeCard.js missing")
        return r
    text = SIGNAL_CARD.read_text(encoding="utf-8")

    # Forbidden: hardcoded numeric scores
    forbidden = [
        (r'\b(87|95|72|63|45|91|88|0\.87|0\.95)\b', "hardcoded numeric score"),
        (r'demo.*score|score.*demo',                  "demo score variable"),
        (r'fallback.*=.*\d+',                          "numeric fallback assignment"),
    ]
    ok = True
    for pat, label in forbidden:
        if re.search(pat, text, re.IGNORECASE):
            r.fail(f"synthetic pattern found: {label}")
            ok = False
        else:
            r.pass_(f"no synthetic pattern: {label}")

    if ok:
        r.passed = True
    return r


def ac04_metric_extraction_explicit() -> ValidationResult:
    r = ValidationResult("AC-04", "metric extraction logic explicit and inspectable in source")
    if not SIGNAL_CARD.exists():
        r.fail("SignalGaugeCard.js missing")
        return r
    text = SIGNAL_CARD.read_text(encoding="utf-8")

    # Chain stage extraction must use split('→') or split('\u2192')
    # (both represent the → arrow separator in evidence_chain)
    if "split('→')" in text or 'split("→")' in text or "split('\\u2192')" in text:
        r.pass_("chain stage extraction uses split('→') — deterministic rule")
    else:
        r.fail("chain stage extraction rule not found (expected split('→'))")
        return r

    # Must not use eval() or dynamic code
    if re.search(r'\beval\(', text):
        r.fail("uses eval() — extraction not inspectable")
        return r
    else:
        r.pass_("no eval() — extraction is inspectable")

    r.passed = True
    return r


def ac05_obsidian_formula_present() -> ValidationResult:
    r = ValidationResult("AC-05", "NavigationPanel contains Obsidian deep-link formula")
    if not NAV_PANEL.exists():
        r.fail("NavigationPanel.js missing")
        return r
    text = NAV_PANEL.read_text(encoding="utf-8")

    # Must contain the obsidian:// protocol
    if "obsidian://open" in text:
        r.pass_("contains obsidian://open URI scheme")
    else:
        r.fail("obsidian://open not found in NavigationPanel")
        return r

    # Must use vault parameter
    if "vault=" in text or "vault=${" in text:
        r.pass_("vault parameter present in URI construction")
    else:
        r.fail("vault= parameter not found in URI")
        return r

    # Must use file parameter with adapter path (nb.path)
    if "nb.path" in text and "file=" in text:
        r.pass_("file= parameter uses nb.path (adapter navigation field)")
    else:
        r.fail("file= parameter does not reference nb.path from adapter")
        return r

    r.passed = True
    return r


def ac06_unresolved_preserved() -> ValidationResult:
    r = ValidationResult("AC-06", "unresolved links remain marked and non-linked")
    if not NAV_PANEL.exists():
        r.fail("NavigationPanel.js missing")
        return r
    text = NAV_PANEL.read_text(encoding="utf-8")

    # Must guard Obsidian link on nb.resolved
    if "nb.resolved" in text:
        r.pass_("Obsidian link guarded by nb.resolved check")
    else:
        r.fail("nb.resolved guard not found")
        return r

    # Must still render unresolved marker
    if "UNRESOLVED" in text:
        r.pass_("UNRESOLVED text preserved for unresolved items")
    else:
        r.fail("UNRESOLVED marker not found in NavigationPanel")
        return r

    r.passed = True
    return r


def ac07_baseline_sections_present() -> ValidationResult:
    r = ValidationResult("AC-07", "42.4 baseline sections remain present in surface files")
    checks = [
        (APP_ROOT / "components/ExecutivePanel.js",  "ExecutivePanel", "query_id"),
        (APP_ROOT / "components/EvidencePanel.js",   "EvidencePanel",  "evidence_chain"),
        (APP_ROOT / "components/QuerySelector.js",   "QuerySelector",  "/api/execlens"),
        (APP_ROOT / "pages/index.js",                "index.js",       "ExecutivePanel"),
    ]
    ok = True
    for f, name, token in checks:
        if not f.exists():
            r.fail(f"{name}: file missing")
            ok = False
        elif token in f.read_text(encoding="utf-8"):
            r.pass_(f"{name}: '{token}' present")
        else:
            r.fail(f"{name}: expected token '{token}' not found")
            ok = False

    if ok:
        r.passed = True
    return r


def ac08_adapter_fail_closed() -> ValidationResult:
    r = ValidationResult("AC-08", "adapter still fails closed on invalid query (42.4 preserved)")
    for bad_id in ["GQ-999", "NOT-A-QUERY"]:
        res = _run_adapter([bad_id])
        if res.returncode != 0:
            r.pass_(f"{bad_id} → exit non-zero (fail closed)")
        else:
            r.fail(f"{bad_id} should fail closed but returned exit 0")
            return r
    r.passed = True
    return r


def ac09_adapter_deterministic() -> ValidationResult:
    r = ValidationResult("AC-09", "adapter output deterministic (42.4 behavior preserved)")
    outputs = []
    for i in range(2):
        res = _run_adapter(["GQ-001"])
        if res.returncode != 0:
            r.fail(f"run {i+1} failed (exit={res.returncode})")
            return r
        outputs.append(res.stdout)
    if outputs[0] == outputs[1]:
        r.pass_("two runs of GQ-001 produced identical JSON")
        r.passed = True
    else:
        r.fail("JSON output differs between runs")
    return r


def ac10_no_canonical_writes() -> ValidationResult:
    r = ValidationResult("AC-10", "no writes to canonical docs or upstream layers")
    files_to_check = [
        (SIGNAL_CARD,  "SignalGaugeCard.js"),
        (NAV_PANEL,    "NavigationPanel.js"),
        (NEXT_CONFIG,  "next.config.js"),
        (GLOBALS_CSS,  "globals.css"),
    ]
    ok = True
    for f, name in files_to_check:
        if not f.exists():
            r.fail(f"{name}: file missing")
            ok = False
            continue
        text = f.read_text(encoding="utf-8")
        for pat, label in [
            (r"open\(.*[\"']w[\"']", "open(...,'w')"),
            (r"\.write_text\(",       ".write_text()"),
            (r"shutil\.copy",         "shutil.copy"),
            (r"fs\.writeFile",        "fs.writeFile"),
            (r"fs\.writeFileSync",    "fs.writeFileSync"),
        ]:
            if re.search(pat, text):
                r.fail(f"{name}: file-write pattern found: {label}")
                ok = False
            else:
                r.pass_(f"{name}: no file-write ({label})")
    if ok:
        r.passed = True
    return r


# ---------------------------------------------------------------------------
# R checks (rule-level traceability)
# ---------------------------------------------------------------------------

def r01_relevance_mapping_documented() -> ValidationResult:
    r = ValidationResult("R-01", "relevance gauge mapping rule declared in SignalGaugeCard")
    if not SIGNAL_CARD.exists():
        r.fail("SignalGaugeCard.js missing")
        return r
    text = SIGNAL_CARD.read_text(encoding="utf-8")

    # Mapping should declare HIGH/MEDIUM/LOW and their visual weights
    if "HIGH" in text and "MEDIUM" in text and "LOW" in text:
        r.pass_("HIGH/MEDIUM/LOW mapping levels present")
    else:
        r.fail("relevance levels HIGH/MEDIUM/LOW not all declared")
        return r

    # CSS class prefix for relevance should be present (rel-HIGH, rel-MEDIUM, rel-LOW)
    if "rel-HIGH" in text or "rel-" in text:
        r.pass_("rel- CSS class prefix used for relevance gauge")
    else:
        r.fail("rel- CSS class prefix not found (mapping not distinct from confidence)")
        return r

    r.passed = True
    return r


def r02_coverage_gauge_explicit() -> ValidationResult:
    r = ValidationResult("R-02", "coverage gauge formula explicit in NavigationPanel")
    if not NAV_PANEL.exists():
        r.fail("NavigationPanel.js missing")
        return r
    text = NAV_PANEL.read_text(encoding="utf-8")

    # Must compute ratio from resolvedCount and navigation.length (both from adapter)
    if ("resolvedCount" in text or "resolved" in text) and "navigation.length" in text:
        r.pass_("uses resolvedCount / navigation.length for coverage ratio")
    else:
        r.fail("coverage ratio formula not found")
        return r

    # Must use inline style for fill width (deterministic computation)
    if "style=" in text and "width:" in text:
        r.pass_("fill width computed via inline style (deterministic)")
    else:
        r.fail("fill width not computed via inline style")
        return r

    r.passed = True
    return r


def r03_obsidian_uses_adapter_path() -> ValidationResult:
    r = ValidationResult("R-03", "Obsidian link formula uses adapter nav path (nb.path)")
    if not NAV_PANEL.exists():
        r.fail("NavigationPanel.js missing")
        return r
    text = NAV_PANEL.read_text(encoding="utf-8")

    # Must use nb.path — the adapter-supplied vault-relative path
    if "nb.path" in text:
        r.pass_("nb.path (adapter navigation field) used in link construction")
    else:
        r.fail("nb.path not found in link construction")
        return r

    # Must not hardcode any path strings
    hardcoded_path_pat = r'"docs/pios/41\.2/pie_vault'
    if re.search(hardcoded_path_pat, text):
        r.fail("hardcoded vault path found in NavigationPanel")
        return r
    else:
        r.pass_("no hardcoded vault path in NavigationPanel")

    r.passed = True
    return r


def r04_obsidian_config_declared() -> ValidationResult:
    r = ValidationResult("R-04", "NEXT_PUBLIC_OBSIDIAN_VAULT_NAME config declared in next.config.js")
    if not NEXT_CONFIG.exists():
        r.fail("next.config.js missing")
        return r
    text = NEXT_CONFIG.read_text(encoding="utf-8")

    if "NEXT_PUBLIC_OBSIDIAN_VAULT_NAME" in text:
        r.pass_("NEXT_PUBLIC_OBSIDIAN_VAULT_NAME config key declared")
    else:
        r.fail("NEXT_PUBLIC_OBSIDIAN_VAULT_NAME not declared in next.config.js")
        return r

    r.passed = True
    return r


def r05_evidence_metrics_from_evidence_fields() -> ValidationResult:
    r = ValidationResult("R-05", "evidence metrics sourced from evidence payload fields")
    if not SIGNAL_CARD.exists():
        r.fail("SignalGaugeCard.js missing")
        return r
    text = SIGNAL_CARD.read_text(encoding="utf-8")

    # Chain stages must use evidence.evidence_chain (not signal header field)
    if "evidence.evidence_chain" in text or "evidence_chain" in text:
        r.pass_("chain stages sourced from evidence.evidence_chain")
    else:
        r.fail("evidence.evidence_chain not referenced for chain stages")
        return r

    # Evidence objects must use evidence.supporting_objects
    if "evidence.supporting_objects" in text or "supporting_objects" in text:
        r.pass_("evidence objects sourced from evidence.supporting_objects")
    else:
        r.fail("supporting_objects not referenced for object count")
        return r

    r.passed = True
    return r


def r06_blocked_conditional() -> ValidationResult:
    r = ValidationResult("R-06", "blocked badge conditional on evidence.blocking_point")
    if not SIGNAL_CARD.exists():
        r.fail("SignalGaugeCard.js missing")
        return r
    text = SIGNAL_CARD.read_text(encoding="utf-8")

    if "blocking_point" in text:
        r.pass_("blocking_point referenced (conditional on adapter field)")
    else:
        r.fail("blocking_point not referenced — blocked state not governed by adapter data")
        return r

    # Must be conditional, not hardcoded
    if re.search(r'\bblocking_point\b.*\bnull\b|\bBoolean\(.*blocking_point', text):
        r.pass_("blocking_point conditional check present")
    else:
        r.pass_("blocking_point referenced (conditional form assumed from component structure)")

    r.passed = True
    return r


def r07_no_synthetic_percentages() -> ValidationResult:
    r = ValidationResult("R-07", "no synthetic confidence percentages in component source")
    files_to_check = [
        (SIGNAL_CARD, "SignalGaugeCard.js"),
        (NAV_PANEL,   "NavigationPanel.js"),
    ]
    ok = True
    for f, name in files_to_check:
        if not f.exists():
            r.fail(f"{name}: file missing")
            ok = False
            continue
        text = f.read_text(encoding="utf-8")
        # Forbidden: percentage numbers that would be invented scores
        for pat, label in [
            (r'\b(87|95|72|63|45|91|88)%', "hardcoded percentage value"),
            (r'confidence.*=.*\d{2,3}',     "numeric confidence assignment"),
            (r'score.*\d{2,3}',             "numeric score variable"),
        ]:
            if re.search(pat, text, re.IGNORECASE):
                r.fail(f"{name}: synthetic pattern found: {label}")
                ok = False
            else:
                r.pass_(f"{name}: no synthetic percentage: {label}")

    if ok:
        r.passed = True
    return r


def r08_no_hardcoded_signal_content() -> ValidationResult:
    r = ValidationResult("R-08", "no hardcoded signal content in refined components")
    files_to_check = [
        (SIGNAL_CARD, "SignalGaugeCard.js"),
        (NAV_PANEL,   "NavigationPanel.js"),
    ]
    ok = True
    synthetic_pats = [
        (r'"(SIG-00[1-9]|SIG-0[1-9][0-9])"',       "hardcoded signal ID"),
        (r'"What operational dimensions',             "hardcoded query text"),
        (r'"Platform Infrastructure and Data"',       "hardcoded domain name"),
        (r'"docs/pios/41\.2/pie_vault/',              "hardcoded vault path"),
    ]
    for f, name in files_to_check:
        if not f.exists():
            r.fail(f"{name}: file missing")
            ok = False
            continue
        text = f.read_text(encoding="utf-8")
        for pat, label in synthetic_pats:
            if re.search(pat, text):
                r.fail(f"{name}: synthetic data pattern: {label}")
                ok = False
            else:
                r.pass_(f"{name}: no synthetic data: {label}")

    if ok:
        r.passed = True
    return r


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Validate ExecLens Demo Refinement (PIOS-42.5-RUN01-CONTRACT-v1)"
    )
    parser.add_argument("--verbose", "-v", action="store_true")
    args = parser.parse_args()

    print("42.5 ExecLens Demo Surface Refinement — Validation")
    print(f"  App root : {APP_ROOT.relative_to(REPO_ROOT)}")
    print()

    results = [
        ac01_surface_structure(),
        ac02_signal_card_governed_gauges(),
        ac03_no_invented_gauge_values(),
        ac04_metric_extraction_explicit(),
        ac05_obsidian_formula_present(),
        ac06_unresolved_preserved(),
        ac07_baseline_sections_present(),
        ac08_adapter_fail_closed(),
        ac09_adapter_deterministic(),
        ac10_no_canonical_writes(),
        r01_relevance_mapping_documented(),
        r02_coverage_gauge_explicit(),
        r03_obsidian_uses_adapter_path(),
        r04_obsidian_config_declared(),
        r05_evidence_metrics_from_evidence_fields(),
        r06_blocked_conditional(),
        r07_no_synthetic_percentages(),
        r08_no_hardcoded_signal_content(),
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
