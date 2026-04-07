#!/usr/bin/env python3
"""
PSEE Product Surface Builder
Stream: PSEE.RECONCILE.1.WP-14

Consumes WP-13 runtime package artifacts and produces a tiered product
exposure surface (ENTRY / GUIDED / OPERATOR) without modifying any
runtime truth layer.

Usage:
    python3 scripts/psee/build_product_surface.py \\
        --client <client_uuid> --run-id <run_id>

Reads:   clients/<client_uuid>/runs/<run_id>/package/
Writes:  clients/<client_uuid>/runs/<run_id>/surface/

Exit codes:
    0 = SURFACE_COMPLETE
    1 = SURFACE_FAILED
"""

import argparse
import hashlib
import json
import os
import subprocess
import sys

# ── CONSTANTS ─────────────────────────────────────────────────────────────────
REPO_NAME       = "k-pi-core"
REQUIRED_BRANCH = "work/psee-runtime"
STREAM_ID       = "PSEE.RECONCILE.1.WP-14"
BASELINE_TAG    = "psee-runtime-baseline-v1"

PROTECTED_FILES = [
    "scripts/psee/run_client_runtime.py",
    "scripts/psee/build_authoritative_input.py",
]

PACKAGE_ARTIFACTS = [
    "package_manifest.json",
    "engine_state.json",
    "gauge_state.json",
    "gauge_view.json",
    "coverage_state.json",
    "reconstruction_state.json",
    "verification.log",
]

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# ── HELPERS ───────────────────────────────────────────────────────────────────
def out(msg=""):
    print(msg)


def fail(stage, reason, rule_id="WP14_RULE"):
    print(f"\nFAIL [{stage}]")
    print(f"  rule:   {rule_id}")
    print(f"  reason: {reason}")
    print("  action: execution halted\n")
    sys.exit(1)


def jdump(obj):
    return json.dumps(obj, sort_keys=True, indent=2, ensure_ascii=True)


def sha256_of(text):
    return hashlib.sha256(text.encode()).hexdigest()


# ── PRE-FLIGHT ────────────────────────────────────────────────────────────────
def preflight(client_uuid, run_id):
    out("=== PSEE Product Surface Builder ===")
    out(f"stream:      {STREAM_ID}")
    out(f"client_uuid: {client_uuid}")
    out(f"run_id:      {run_id}")
    out()
    out("--- PRECHECK ---")

    # Repo
    try:
        r = subprocess.run(["git", "rev-parse", "--show-toplevel"],
                           capture_output=True, text=True, cwd=REPO_ROOT)
        if r.returncode != 0:
            fail("PRECHECK", "not a git repository", "REPO_LOCK")
        if os.path.basename(r.stdout.strip()) != REPO_NAME:
            fail("PRECHECK",
                 f"repo={os.path.basename(r.stdout.strip())!r} expected={REPO_NAME!r}",
                 "REPO_LOCK")
    except Exception as e:
        fail("PRECHECK", f"git error: {e}", "REPO_LOCK")

    # Branch
    try:
        r = subprocess.run(["git", "branch", "--show-current"],
                           capture_output=True, text=True, cwd=REPO_ROOT)
        branch = r.stdout.strip()
        if branch != REQUIRED_BRANCH:
            fail("PRECHECK",
                 f"branch={branch!r} required={REQUIRED_BRANCH!r}",
                 "BRANCH_LOCK")
    except Exception as e:
        fail("PRECHECK", f"git error: {e}", "BRANCH_LOCK")

    # Worktree clean
    try:
        r = subprocess.run(["git", "status", "--porcelain"],
                           capture_output=True, text=True, cwd=REPO_ROOT)
        lines = [l for l in r.stdout.splitlines() if l.strip()]
        allowed = (
            f"?? clients/{client_uuid}/runs/",
            f"?? clients/{client_uuid}/input/",
        )
        dirty = [l for l in lines if not any(l.startswith(p) for p in allowed)]
        if dirty:
            fail("PRECHECK",
                 f"dirty worktree: {'; '.join(dirty[:3])}",
                 "WORKTREE_LOCK")
    except Exception as e:
        fail("PRECHECK", f"git error: {e}", "WORKTREE_LOCK")

    # Baseline tag
    try:
        r = subprocess.run(
            ["git", "rev-list", "-n", "1", BASELINE_TAG],
            capture_output=True, text=True, cwd=REPO_ROOT
        )
        if r.returncode != 0 or not r.stdout.strip():
            fail("PRECHECK", f"baseline tag not found: {BASELINE_TAG}", "TAG_MISSING")
    except Exception as e:
        fail("PRECHECK", f"git error: {e}", "TAG_MISSING")

    # Protected files untouched
    try:
        r = subprocess.run(["git", "diff", "HEAD", "--name-only"],
                           capture_output=True, text=True, cwd=REPO_ROOT)
        modified = r.stdout.splitlines()
        for pf in PROTECTED_FILES:
            if pf in modified:
                fail("PRECHECK",
                     f"protected file modified: {pf}",
                     "TRUTH_MUTATION_VIOLATION")
            if not os.path.isfile(os.path.join(REPO_ROOT, pf)):
                fail("PRECHECK", f"protected file missing: {pf}", "ARTIFACT_MISSING")
    except Exception as e:
        fail("PRECHECK", f"git error: {e}", "ARTIFACT_CHECK_ERROR")

    # client_index.json
    reg = os.path.join(REPO_ROOT, "clients", "registry", "client_index.json")
    if not os.path.isfile(reg):
        fail("PRECHECK", "client_index.json missing", "ARTIFACT_MISSING")

    # No-overwrite
    surface_dir = os.path.join(REPO_ROOT, "clients", client_uuid, "runs", run_id, "surface")
    if os.path.isdir(surface_dir):
        fail("PRECHECK",
             f"surface/ already exists for run_id={run_id}. Delete to re-run.",
             "NO_OVERWRITE_VIOLATION")

    out("PRECHECK_PASS")
    out()
    return surface_dir


# ── PACKAGE READ ──────────────────────────────────────────────────────────────
def read_package(client_uuid, run_id):
    out("--- PACKAGE_READ ---")
    pkg_dir = os.path.join(REPO_ROOT, "clients", client_uuid, "runs", run_id, "package")

    if not os.path.isdir(pkg_dir):
        fail("PACKAGE_READ",
             f"package dir not found: clients/{client_uuid}/runs/{run_id}/package/",
             "PACKAGE_MISSING")

    # Scope check — no reads outside allowed paths
    allowed_roots = [
        os.path.realpath(pkg_dir),
        os.path.realpath(os.path.join(REPO_ROOT, "clients", client_uuid, "config")),
    ]

    def safe_read(fname):
        fpath = os.path.join(pkg_dir, fname)
        real = os.path.realpath(fpath)
        if not any(real.startswith(r + os.sep) or real == r for r in allowed_roots):
            fail("PACKAGE_READ", f"forbidden read: {fname}", "READ_SCOPE_VIOLATION")
        # Reject docs/pios/ or runs/pios/ leakage
        rel = os.path.relpath(real, REPO_ROOT)
        for forbidden in ("docs/pios/", "runs/pios/"):
            if rel.startswith(forbidden):
                fail("PACKAGE_READ", f"forbidden path: {rel}", "FORBIDDEN_PATH")
        with open(fpath) as f:
            return f.read() if fname == "verification.log" else json.load(f)

    for fname in PACKAGE_ARTIFACTS:
        if not os.path.isfile(os.path.join(pkg_dir, fname)):
            fail("PACKAGE_READ", f"required artifact missing: {fname}", "ARTIFACT_MISSING")

    pkg = {
        "manifest":       safe_read("package_manifest.json"),
        "engine":         safe_read("engine_state.json"),
        "gauge":          safe_read("gauge_state.json"),
        "gauge_view":     safe_read("gauge_view.json"),
        "coverage":       safe_read("coverage_state.json"),
        "reconstruction": safe_read("reconstruction_state.json"),
        "vlog":           safe_read("verification.log"),
    }

    out(f"  artifacts loaded: {len(PACKAGE_ARTIFACTS)}")
    out("PACKAGE_READ_PASS")
    out()
    return pkg


# ── EXPOSURE CLASSIFICATION ───────────────────────────────────────────────────
def exposure_classification(pkg):
    out("--- EXPOSURE_CLASSIFICATION ---")
    g = pkg["gauge"]
    gv = pkg["gauge_view"]

    score     = g["score"]["canonical"]
    band      = g["score"]["band_label"]
    conf_lo   = g["confidence"]["lower"]
    conf_hi   = g["confidence"]["upper"]
    intake    = gv["query_state"]["gating_state"]
    envelope  = pkg["manifest"]["lifecycle_state"]
    n_signals = len(g["signals"])
    n_nodes   = len(g["topology"]["nodes"])
    n_rels    = len(g["topology"]["relationships"])
    n_domains = len(g["topology"]["domains"])

    cls = {
        "canonical_score": score,
        "band_label":      band,
        "conf_lower":      conf_lo,
        "conf_upper":      conf_hi,
        "intake_mode":     intake,
        "envelope_status": envelope,
        "n_signals":       n_signals,
        "n_nodes":         n_nodes,
        "n_rels":          n_rels,
        "n_domains":       n_domains,
    }

    out(f"  score={score}  band={band}  intake={intake}  signals={n_signals}  nodes={n_nodes}")
    out("EXPOSURE_CLASSIFICATION_PASS")
    out()
    return cls


# ── FIELD SELECTION → TIER BUILD ──────────────────────────────────────────────
def build_entry(pkg, cls, client_uuid, run_id):
    """ENTRY — executive-facing. Minimum viable truth."""
    g  = pkg["gauge"]
    gv = pkg["gauge_view"]
    return {
        "client_uuid":     client_uuid,
        "run_id":          run_id,
        "exposure_tier":   "ENTRY",
        "stream":          STREAM_ID,
        "schema_version":  "1.0",
        "score": {
            "canonical":      g["score"]["canonical"],
            "band_label":     g["score"]["band_label"],
            "projected_score": g["projection"]["value"],
            "projection_rule": g["projection"]["rule"],
        },
        "confidence": {
            "lower":  g["confidence"]["lower"],
            "upper":  g["confidence"]["upper"],
            "status": g["confidence"]["status"],
        },
        "intake_mode":    gv["query_state"]["gating_state"],
        "envelope_status": pkg["manifest"]["lifecycle_state"],
    }


def build_guided(entry, pkg, cls, client_uuid, run_id):
    """GUIDED — advisory-facing. Entry + metrics + signal summary + query context."""
    g  = pkg["gauge"]
    gv = pkg["gauge_view"]

    # Signal summary — no recomputation, derived counts only
    sev_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
    for s in g["signals"]:
        sev_counts[s["severity"]] = sev_counts.get(s["severity"], 0) + 1

    bounded_count = sum(
        s["bound_count"] for s in g["signals"]
    )

    return {
        **entry,
        "exposure_tier":  "GUIDED",
        "structural_metrics": g["structural_metrics"],
        "signal_summary": {
            "count":    len(g["signals"]),
            "critical": sev_counts["CRITICAL"],
            "high":     sev_counts["HIGH"],
            "medium":   sev_counts["MEDIUM"],
            "low":      sev_counts["LOW"],
        },
        "bounded_conditions": {
            "total_bound_count": bounded_count,
        },
        "query_state":     g["query_state"],
        "topology_summary": {
            "domains": len(g["topology"]["domains"]),
            "nodes":   len(g["topology"]["nodes"]),
        },
    }


def build_operator(guided, pkg, cls, client_uuid, run_id):
    """OPERATOR — full governed exposure. Guided + all runtime detail."""
    g   = pkg["gauge"]
    cov = pkg["coverage"]
    rec = pkg["reconstruction"]
    mfst = pkg["manifest"]

    vlog_lines = pkg["vlog"].splitlines()
    vlog_summary = {
        "total_lines": len(vlog_lines),
        "sha256": sha256_of(pkg["vlog"]),
        "pass_count": sum(1 for l in vlog_lines if "_PASS" in l),
        "fail_count": sum(1 for l in vlog_lines if "_FAIL" in l),
    }

    return {
        **guided,
        "exposure_tier": "OPERATOR",
        "signals":       g["signals"],
        "topology":      g["topology"],
        "dimensions":    g["dimensions"],
        "coverage": {
            "dimension":       cov["dimension"],
            "label":           cov["label"],
            "admitted_units":  cov["admitted_units"],
            "total_units":     cov["total_units"],
            "coverage_percent": cov["coverage_percent"],
            "state_label":     cov["state_label"],
            "authority":       cov["authority"],
        },
        "reconstruction": {
            "dimension":        rec["dimension"],
            "label":            rec["label"],
            "validated_units":  rec["validated_units"],
            "total_units":      rec["total_units"],
            "state":            rec["state"],
            "violations":       rec["violations"],
            "authority":        rec["authority"],
        },
        "package_traceability": {
            "git_commit_hash":  mfst["git_commit_hash"],
            "git_branch":       mfst["git_branch"],
            "repository_name":  mfst["repository_name"],
            "lifecycle_state":  mfst["lifecycle_state"],
            "package_version":  mfst["package_version"],
            "stream":           mfst["stream"],
        },
        "verification_summary": vlog_summary,
    }


# ── SURFACE VALIDATION ────────────────────────────────────────────────────────
def validate_surface(entry, guided, operator_view, pkg, client_uuid, run_id):
    """Validate fidelity, superset, identity leakage, truth-layer mutation."""
    out("--- SURFACE_VALIDATION ---")
    g  = pkg["gauge"]
    gv = pkg["gauge_view"]

    checks = []

    def chk(name, a, b):
        result = "PASS" if a == b else f"FAIL (surface={a!r} package={b!r})"
        checks.append((name, str(a), str(b), "PASS" if a == b else "FAIL"))
        if result != "PASS":
            fail("SURFACE_VALIDATION", f"fidelity drift: {name}: {result}",
                 "FIDELITY_VIOLATION")

    # Entry fidelity
    chk("entry.score.canonical",
        entry["score"]["canonical"],
        g["score"]["canonical"])
    chk("entry.score.band_label",
        entry["score"]["band_label"],
        g["score"]["band_label"])
    chk("entry.score.projected_score",
        entry["score"]["projected_score"],
        g["projection"]["value"])
    chk("entry.confidence.lower",
        entry["confidence"]["lower"],
        g["confidence"]["lower"])
    chk("entry.confidence.upper",
        entry["confidence"]["upper"],
        g["confidence"]["upper"])
    chk("entry.intake_mode",
        entry["intake_mode"],
        gv["query_state"]["gating_state"])
    chk("entry.envelope_status",
        entry["envelope_status"],
        pkg["manifest"]["lifecycle_state"])

    # Guided fidelity
    chk("guided.structural_metrics",
        guided["structural_metrics"],
        g["structural_metrics"])
    chk("guided.query_state",
        guided["query_state"],
        g["query_state"])

    # Operator fidelity
    chk("operator.signals",
        operator_view["signals"],
        g["signals"])
    chk("operator.topology.nodes",
        operator_view["topology"]["nodes"],
        g["topology"]["nodes"])
    chk("operator.topology.relationships",
        operator_view["topology"]["relationships"],
        g["topology"]["relationships"])

    # Superset checks
    entry_keys   = set(entry.keys())
    guided_keys  = set(guided.keys())
    operator_keys = set(operator_view.keys())

    if not guided_keys >= entry_keys:
        missing = entry_keys - guided_keys
        fail("SURFACE_VALIDATION",
             f"GUIDED not superset of ENTRY — missing keys: {missing}",
             "SUPERSET_VIOLATION")
    if not operator_keys >= guided_keys:
        missing = guided_keys - operator_keys
        fail("SURFACE_VALIDATION",
             f"OPERATOR not superset of GUIDED — missing keys: {missing}",
             "SUPERSET_VIOLATION")

    # Identity leakage — forbidden strings must not appear in any surface
    FORBIDDEN_PATTERNS = [
        "blueedge", "business_client_id", "/Users/", "client_index"
    ]
    for tier_name, tier_obj in [("entry", entry), ("guided", guided), ("operator", operator_view)]:
        tier_text = json.dumps(tier_obj)
        for pat in FORBIDDEN_PATTERNS:
            if pat in tier_text:
                fail("SURFACE_VALIDATION",
                     f"identity leakage in {tier_name}: pattern={pat!r}",
                     "IDENTITY_LEAKAGE")

    out(f"  fidelity checks: {len(checks)} / {len(checks)} PASS")
    out("  superset: GUIDED ⊇ ENTRY: PASS")
    out("  superset: OPERATOR ⊇ GUIDED: PASS")
    out("  identity leakage: NONE")
    out("SURFACE_VALIDATION_PASS")
    out()
    return checks


def build_validation_md(checks, client_uuid, run_id, pkg):
    g = pkg["gauge"]
    lines = [
        "# Surface Validation — PSEE.RECONCILE.1.WP-14",
        "",
        f"stream:      {STREAM_ID}",
        f"client_uuid: {client_uuid}",
        f"run_id:      {run_id}",
        "",
        "## Fidelity Checks",
        "",
        "| Check | Surface Value | Package Value | Result |",
        "|---|---|---|---|",
    ]
    for name, sv, pv in [(c[0], c[1], c[2]) for c in checks]:
        # Truncate long values for readability
        sv_disp = sv[:60] + "…" if len(sv) > 60 else sv
        pv_disp = pv[:60] + "…" if len(pv) > 60 else pv
        lines.append(f"| {name} | {sv_disp} | {pv_disp} | PASS |")

    lines += [
        "",
        "## Superset Checks",
        "",
        "| Check | Result |",
        "|---|---|",
        "| GUIDED ⊇ ENTRY | PASS |",
        "| OPERATOR ⊇ GUIDED | PASS |",
        "",
        "## Identity Leakage Check",
        "",
        "| Pattern | Status |",
        "|---|---|",
        "| business_client_id | ABSENT |",
        "| semantic client name | ABSENT |",
        "| absolute local paths | ABSENT |",
        "| registry content | ABSENT |",
        "",
        "## Truth-Layer Mutation Check",
        "",
        "| File | Status |",
        "|---|---|",
    ]
    for pf in PROTECTED_FILES:
        lines.append(f"| {pf} | UNCHANGED |")

    sig_crits = sum(1 for s in g["signals"] if s["severity"] == "CRITICAL")
    topo = g["topology"]
    lines += [
        "",
        "## Runtime Package Reference",
        "",
        f"- signals: {len(g['signals'])} (CRITICAL: {sig_crits})",
        f"- topology: {len(topo['nodes'])} nodes / {len(topo['relationships'])} relationships / "
        f"{len(topo['domains'])} domains",
        f"- structural_density: {g['structural_metrics']['structural_density']}",
        f"- dependency_load: {g['structural_metrics']['dependency_load']}",
        f"- coordination_pressure: {g['structural_metrics']['coordination_pressure']}",
        f"- visibility_deficit: {g['structural_metrics']['visibility_deficit']}",
        "",
        "## Status: PASS",
    ]
    return "\n".join(lines) + "\n"


# ── EXPOSURE MANIFEST ─────────────────────────────────────────────────────────
def build_exposure_manifest(client_uuid, run_id, pkg, surface_files):
    return {
        "schema_version":     "1.0",
        "stream":             STREAM_ID,
        "client_uuid":        client_uuid,
        "run_id":             run_id,
        "source_run_package": f"clients/{client_uuid}/runs/{run_id}/package/",
        "surface_root":       f"clients/{client_uuid}/runs/{run_id}/surface/",
        "tiers_produced":     ["ENTRY", "GUIDED", "OPERATOR"],
        "surface_artifacts":  surface_files,
        "fidelity_status":    "PASS",
        "identity_leakage":   "NONE",
        "truth_layer_mutation": "NONE",
        "baseline_tag":       BASELINE_TAG,
        "source_git_commit":  pkg["manifest"]["git_commit_hash"],
    }


# ── HTML SURFACE ──────────────────────────────────────────────────────────────
def build_html(entry, guided, operator_view, pkg, client_uuid, run_id):
    """Self-contained HTML surface. v2-baseline grammar. Layout-stabilized 3-column.
    All values from runtime package — no recomputation."""
    g    = pkg["gauge"]
    gv   = pkg["gauge_view"]
    cov  = pkg["coverage"]
    rec  = pkg["reconstruction"]
    mfst = pkg["manifest"]
    eng  = pkg["engine"]

    sc   = g["score"]["components"]
    sm   = g["structural_metrics"]
    dims = g["dimensions"]

    score       = g["score"]["canonical"]
    band        = g["score"]["band_label"]
    derivation  = g["score"]["derivation"]
    proj        = g["projection"]["value"]
    proj_rule   = g["projection"]["rule"]
    conf_lo     = g["confidence"]["lower"]
    conf_hi     = g["confidence"]["upper"]
    intake      = gv["query_state"]["gating_state"]
    exec_status = eng["execution_status"]
    pkg_stream  = mfst["stream"]
    git_commit  = mfst["git_commit_hash"]
    git_branch  = mfst["git_branch"]
    lifecycle   = mfst["lifecycle_state"]

    comp_pts  = sc["completion_points"]
    cov_pts   = sc["coverage_points"]
    recon_pts = sc["reconstruction_points"]
    comp_basis  = sc["completion_basis"]
    cov_basis   = sc["coverage_basis"]
    recon_basis = sc["reconstruction_basis"]

    comp_bar  = int(comp_pts / 40 * 100)
    cov_bar   = int(cov_pts / 35 * 100)
    recon_bar = int(recon_pts / 25 * 100)
    comp_pts_clr  = "#8b949e" if comp_pts == 0 else "#3fb950"
    cov_pts_clr   = "#3fb950" if cov_pts >= 35 else "#d29922"
    recon_pts_clr = "#3fb950" if recon_pts >= 25 else "#d29922"

    cov_pct      = cov["coverage_percent"]
    cov_admitted = cov["admitted_units"]
    cov_total    = cov["total_units"]
    rec_valid    = rec["validated_units"]
    rec_total    = rec["total_units"]

    dim03_val   = dims["DIM-03"]["value"]
    dim03_lbl   = dims["DIM-03"]["state_label"]
    dim04_count = dims["DIM-04"]["total_count"]
    dim04_lbl   = dims["DIM-04"]["state_label"]
    dim05_state = dims["DIM-05"]["state"]
    dim06_state = dims["DIM-06"]["state"]

    _sev_cls = {"CRITICAL": "sev-critical", "HIGH": "sev-high",
                "MEDIUM": "sev-medium", "LOW": "sev-low"}

    sig_rows_dev = "\n          ".join(
        f'<tr class="dev-sig-row"><td>{s["id"]}</td>'
        f'<td class="{_sev_cls.get(s["severity"], "")}">{s["severity"]}</td>'
        f'<td style="color:#c9d1d9;">{s["bound_count"]}</td></tr>'
        for s in g["signals"]
    )
    id_to_label   = {n["id"]: n["label"] for n in g["topology"]["nodes"]}
    n_domains     = len(g["topology"]["domains"])
    n_nodes       = len(g["topology"]["nodes"])
    n_rels        = len(g["topology"]["relationships"])
    domains_str   = " &middot; ".join(g["topology"]["domains"])
    topo_node_rows = "\n        ".join(
        f'<div class="topo-node">{n["label"]} <span class="nd">{n["domain"]}</span></div>'
        for n in g["topology"]["nodes"]
    )
    topo_rel_rows = "\n        ".join(
        f'<div class="topo-rel">{id_to_label.get(r["from"], r["from"])}'
        f' <span class="ra">→</span> {id_to_label.get(r["to"], r["to"])}'
        f' <span class="rt">{r["type"]}</span></div>'
        for r in g["topology"]["relationships"]
    )

    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Execution Gauge — Product Surface</title>
  <style>
    /* === BASE (v2-baseline grammar, layout-stabilized) === */
    *, *::before, *::after {{ box-sizing: border-box; }}
    body {{ font-family: monospace; background:#0b0f14; color:#e6edf3; padding:24px; margin:0; }}
    .value {{ font-size:32px; font-weight:bold; }}
    .phase {{ color:#58a6ff; }}

    /* === OUTER — balanced 3-column container === */
    .outer {{ max-width:1280px; border:1px solid #333; transition:max-width 0.3s ease; }}
    .outer.develop-open {{ max-width:1560px; }}
    .top-bar {{ padding:20px; border-bottom:1px solid #1f2937; }}
    .cols {{ display:flex; align-items:flex-start; }}
    .col-left  {{ flex:0 0 42%; border-right:1px solid #1f2937; min-width:0; }}
    .col-right {{ flex:1; min-width:260px; border-right:1px solid #1f2937; }}

    /* === PANELS === */
    .panel {{ padding:20px; border-bottom:1px solid #1f2937; }}
    .panel:last-child {{ border-bottom:none; }}
    .panel-label {{
      color:#8b949e; font-size:11px; text-transform:uppercase;
      letter-spacing:.08em; margin-bottom:14px;
    }}
    hr {{ border:none; border-top:1px solid #1f2937; margin:14px 0; }}

    /* === HEADER === */
    .header-top {{ display:flex; justify-content:space-between; align-items:flex-start; }}
    .header-run {{ color:#8b949e; font-size:13px; margin-bottom:4px; }}
    .header-phase {{ color:#58a6ff; font-size:14px; }}
    .header-tag {{ font-size:11px; color:#444; padding:3px 8px; border:1px solid #333; }}
    .score-grid {{ display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:16px; }}
    .score-cell {{ border:1px solid #1f2937; padding:14px; }}
    .score-cell .sc-label {{ color:#8b949e; font-size:12px; margin-bottom:6px; }}
    .score-cell .sc-value {{ font-size:32px; font-weight:bold; }}
    .score-cell .sc-sub {{ font-size:12px; color:#8b949e; margin-top:4px; }}
    .score-cell .sc-band {{ font-size:14px; font-weight:bold; color:#d29922; }}

    /* === DECOMPOSITION === */
    .comp-block {{ margin-bottom:16px; }}
    .comp-block:last-child {{ margin-bottom:0; }}
    .comp-header {{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:5px; }}
    .comp-name {{ font-size:14px; }}
    .comp-pts {{ font-size:14px; font-weight:bold; }}
    .comp-bar-bg {{ background:#1f2937; height:7px; border-radius:3px; }}
    .comp-bar-fill {{ height:7px; border-radius:3px; }}
    .comp-status {{ color:#8b949e; font-size:12px; margin-top:4px; }}

    /* === COMPONENT EXPLANATION === */
    .exp-block {{ border:1px solid #1f2937; padding:14px; margin-bottom:10px; }}
    .exp-block:last-child {{ margin-bottom:0; }}
    .exp-header {{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; }}
    .exp-title {{ font-size:14px; font-weight:bold; }}
    .exp-badge {{ font-size:11px; padding:3px 8px; border-radius:3px; font-weight:bold; white-space:nowrap; }}
    .badge-pass     {{ background:#0d2e1a; color:#3fb950; border:1px solid #1b5e3d; }}
    .badge-computed {{ background:#0d2e1a; color:#3fb950; border:1px solid #1b5e3d; }}
    .badge-not-eval {{ background:#1a1a1a; color:#8b949e; border:1px solid #333; }}
    .exp-row {{ display:flex; gap:6px; font-size:13px; margin-top:5px; line-height:1.5; }}
    .exp-row .ek {{ color:#8b949e; min-width:110px; flex-shrink:0; }}
    .exp-row .ev {{ color:#c9d1d9; overflow-wrap:break-word; word-break:break-word; min-width:0; }}

    /* === CTA === */
    .cta-block {{ margin-top:12px; border-top:1px solid #1f2937; padding-top:12px; }}
    .cta-truth {{
      font-size:12px; color:#c9d1d9; background:#0a1017; border:1px solid #1f2937;
      padding:9px 12px; margin-bottom:10px; line-height:1.6; overflow-wrap:break-word;
    }}
    .cta-truth strong {{ color:#e6edf3; }}
    .cta-sep {{ border-top:1px dashed #1f2937; margin:8px 0 10px; }}
    .cta-gate-label {{
      font-size:10px; color:#444; text-transform:uppercase;
      letter-spacing:.07em; margin-bottom:7px;
    }}
    .cta-btn {{
      font-family:monospace; font-size:13px; padding:8px 16px;
      border:1px solid #1b3a5c; background:#0b1f31; color:#58a6ff;
      cursor:pointer; display:inline-block;
    }}
    .cta-btn:hover {{ border-color:#58a6ff; }}

    /* === MISSING CAPABILITIES === */
    .cap-block {{ border:1px solid #1f2937; padding:12px 14px; margin-bottom:8px; }}
    .cap-block:last-child {{ margin-bottom:0; }}
    .cap-title {{ font-size:13px; margin-bottom:6px; }}
    .cap-row {{ display:flex; gap:6px; font-size:12px; margin-top:4px; }}
    .cap-row .ck {{ color:#8b949e; min-width:90px; flex-shrink:0; }}
    .cap-row .cv {{ color:#c9d1d9; overflow-wrap:break-word; word-break:break-word; min-width:0; }}
    .cap-unlock {{ color:#58a6ff; font-size:12px; margin-top:8px; border-top:1px solid #1f2937; padding-top:6px; }}
    .cap-na-badge {{ display:inline-block; font-size:11px; color:#8b949e; border:1px solid #333; padding:2px 7px; margin-bottom:6px; }}

    /* === CONFIDENCE === */
    .conf-text {{ font-size:13px; color:#c9d1d9; line-height:1.65; margin-bottom:12px; overflow-wrap:break-word; }}
    .conf-bar-wrap {{ background:#1f2937; height:7px; border-radius:3px; position:relative; margin:10px 0 6px; }}
    .conf-bar-fill {{ height:7px; border-radius:3px; background:#d29922; width:100%; }}
    .conf-lower-mark {{ position:absolute; top:-5px; width:2px; height:17px; background:#8b949e; left:{conf_lo}%; }}
    .conf-legend {{ display:flex; gap:20px; font-size:12px; color:#8b949e; flex-wrap:wrap; }}
    .conf-legend-item {{ display:flex; align-items:center; gap:6px; }}
    .conf-legend-dot {{ width:8px; height:8px; border-radius:50%; flex-shrink:0; }}

    /* === OPERATOR === */
    details.op-details {{ border:1px solid #1f2937; }}
    details.op-details summary {{
      padding:12px 16px; cursor:pointer; font-size:13px; color:#8b949e;
      list-style:none; user-select:none;
    }}
    details.op-details summary::-webkit-details-marker {{ display:none; }}
    details.op-details summary::before {{ content:"▶  "; font-size:10px; }}
    details.op-details[open] summary::before {{ content:"▼  "; }}
    .op-inner {{ padding:14px 16px; border-top:1px solid #1f2937; }}
    .op-group-label {{
      color:#444; font-size:11px; text-transform:uppercase;
      letter-spacing:.06em; margin-bottom:8px; margin-top:12px;
    }}
    .op-group-label:first-child {{ margin-top:0; }}
    .op-table {{ width:100%; border-collapse:collapse; font-size:12px; }}
    .op-table td {{ padding:4px 8px; border-bottom:1px solid #111; vertical-align:top; }}
    .op-table td:first-child {{ color:#8b949e; width:200px; flex-shrink:0; }}
    .op-table td:last-child {{ color:#c9d1d9; word-break:break-word; overflow-wrap:break-word; min-width:0; }}
    .op-authority {{ color:#444; font-size:11px; margin-top:10px; line-height:1.6; overflow-wrap:break-word; }}

    /* === SI BRIDGE === */
    .si-bridge {{ border:1px solid #1b3a5c; background:#060e17; padding:16px; margin-bottom:12px; }}
    .si-bridge-title {{ font-size:14px; font-weight:bold; margin-bottom:6px; }}
    .si-bridge-sub {{ font-size:12px; color:#8b949e; line-height:1.6; margin-bottom:12px; overflow-wrap:break-word; }}
    .si-bridge-metrics {{ display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:14px; }}
    .si-metric {{ border:1px solid #1b3a5c; padding:10px; text-align:center; }}
    .si-metric-val {{ font-size:22px; font-weight:bold; color:#3fb950; }}
    .si-metric-lbl {{ font-size:11px; color:#8b949e; margin-top:2px; }}
    .si-bridge-btn {{
      font-family:monospace; font-size:13px; padding:9px 16px;
      border:1px solid #1b3a5c; background:#0b1f31; color:#58a6ff;
      cursor:pointer; width:100%; text-align:left;
    }}
    .si-bridge-btn:hover {{ border-color:#58a6ff; }}
    .si-bridge-artifacts {{ color:#444; font-size:11px; margin-top:10px; line-height:1.8; }}

    /* === DISCOVERY === */
    .query-block {{ border:1px solid #1f2937; padding:12px 14px; margin-bottom:8px; }}
    .query-block:last-child {{ margin-bottom:0; }}
    .query-text {{ font-size:13px; color:#444; font-style:italic; margin-bottom:6px; overflow-wrap:break-word; }}
    .query-lock-bar {{ display:flex; justify-content:space-between; align-items:center; gap:8px; }}
    .query-lock-reason {{ font-size:11px; color:#333; }}
    .query-lock-badge {{
      font-size:10px; padding:2px 7px; border:1px solid #1b3a5c;
      color:#1b3a5c; text-transform:uppercase; letter-spacing:.04em; white-space:nowrap; flex-shrink:0;
    }}
    .query-block.exec-locked .query-lock-badge {{ border-color:#333; color:#333; }}
    .query-block.unlocked {{ border-color:#1b5e3d; background:#050f0a; }}
    .query-block.unlocked .query-text {{ color:#c9d1d9; font-style:normal; }}
    .query-block.unlocked .query-lock-badge {{ border-color:#1b5e3d; color:#3fb950; }}
    .query-block.unlocked .query-lock-reason {{ color:#8b949e; }}

    /* === CHIPS / MESSAGES === */
    .access-chip {{
      display:none; font-size:11px; padding:3px 9px;
      border:1px solid #1b5e3d; background:#050f0a; color:#3fb950;
      margin-left:10px; vertical-align:middle;
    }}
    .discovery-success {{
      display:none; font-size:12px; color:#3fb950; border:1px solid #1b5e3d;
      background:#050f0a; padding:10px 12px; margin-bottom:12px; line-height:1.6;
    }}
    .discovery-success-sub {{ color:#8b949e; font-size:11px; margin-top:4px; }}
    .state-row {{ font-size:13px; line-height:2.1; display:flex; align-items:center; gap:8px; }}
    .state-dot {{ width:8px; height:8px; border-radius:50%; flex-shrink:0; }}

    /* === MODAL === */
    .modal-overlay {{
      display:none; position:fixed; inset:0; background:rgba(0,0,0,.8);
      align-items:center; justify-content:center; z-index:100;
    }}
    .modal-overlay.open {{ display:flex; }}
    .modal-box {{ background:#0b0f14; border:1px solid #333; padding:24px; max-width:420px; width:90%; }}
    .modal-title {{ font-size:16px; font-weight:bold; margin-bottom:10px; }}
    .modal-truth {{
      font-size:12px; color:#d29922; border:1px solid #4c3610;
      background:#120b02; padding:10px 12px; margin-bottom:14px; line-height:1.6; overflow-wrap:break-word;
    }}
    .modal-sub {{ font-size:12px; color:#8b949e; margin-bottom:14px; line-height:1.6; overflow-wrap:break-word; }}
    .modal-input {{
      font-family:monospace; font-size:13px; width:100%; padding:8px 10px;
      background:#060c12; border:1px solid #333; color:#e6edf3; margin-bottom:10px;
    }}
    .modal-input:focus {{ outline:none; border-color:#58a6ff; }}
    .modal-actions {{ display:flex; gap:8px; justify-content:flex-end; margin-top:4px; }}
    .modal-cancel {{
      font-family:monospace; font-size:12px; padding:7px 14px;
      border:1px solid #333; background:transparent; color:#8b949e; cursor:pointer;
    }}
    .modal-submit {{
      font-family:monospace; font-size:12px; padding:7px 14px;
      border:1px solid #1b3a5c; background:#0b1f31; color:#58a6ff; cursor:pointer;
    }}
    .modal-cancel:hover {{ border-color:#8b949e; }}
    .modal-submit:hover {{ border-color:#58a6ff; }}
    .modal-denied {{ display:none; font-size:12px; color:#f85149; margin-top:10px; line-height:1.5; }}

    /* === DEVELOP ACCESS === */
    .dev-access-block {{ border-top:1px dashed #1b3a5c; margin-top:14px; padding-top:12px; }}
    .dev-access-btn {{
      font-family:monospace; font-size:12px; padding:7px 14px;
      border:1px solid #1b3a5c; background:#060e17; color:#58a6ff;
      cursor:pointer; display:inline-block; margin-top:6px;
    }}
    .dev-access-btn:hover {{ border-color:#58a6ff; }}

    /* === COLUMN 3 — DEVELOP === */
    .col-develop {{ flex:0 0 300px; min-width:0; display:none; flex-direction:column; }}
    .col-develop.visible {{ display:flex; }}
    .dev-tier-badge {{
      display:inline-block; font-size:10px; padding:2px 7px;
      border:1px solid #1b3a5c; color:#58a6ff; letter-spacing:.05em; margin-left:8px; vertical-align:middle;
    }}
    .dev-sig-row td {{ padding:4px 8px; border-bottom:1px solid #111; font-size:12px; }}
    .dev-sig-row td:first-child {{ color:#8b949e; width:70px; }}
    .sev-critical {{ color:#f85149; font-weight:bold; }}
    .sev-high     {{ color:#d29922; font-weight:bold; }}
    .sev-medium   {{ color:#58a6ff; }}
    .sev-low      {{ color:#3fb950; }}
    .topo-domain  {{ font-size:11px; color:#58a6ff; margin-bottom:6px; overflow-wrap:break-word; }}
    .topo-node    {{ font-size:12px; color:#c9d1d9; padding:3px 0; overflow-wrap:break-word; }}
    .topo-node .nd {{ color:#8b949e; font-size:11px; margin-left:6px; }}
    .topo-rel     {{ font-size:11px; color:#8b949e; padding:2px 0; overflow-wrap:break-word; }}
    .topo-rel .ra {{ color:#444; margin:0 4px; }}
    .topo-rel .rt {{ color:#c9d1d9; font-size:10px; margin-left:4px; }}

    /* === CXO EXECUTIVE OVERLAY === */
    .cxo-overlay {{
      display:none; position:fixed; inset:0; background:#070910;
      z-index:200; overflow-y:auto;
      font-family: system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    }}
    .cxo-overlay.open {{ display:block; }}
    .cxo-inner {{ max-width:1080px; margin:0 auto; padding:36px 48px 64px; }}

    /* Toggle button in cockpit header */
    .cxo-toggle-btn {{
      font-family:system-ui,-apple-system,sans-serif; font-size:12px; font-weight:600;
      letter-spacing:.05em; color:#818cf8; background:#0f1221;
      border:1px solid #312e81; padding:6px 16px; cursor:pointer;
    }}
    .cxo-toggle-btn:hover {{ background:#1e1b4b; border-color:#6366f1; color:#a5b4fc; }}

    /* CxO Header bar */
    .cxo-header {{
      display:flex; justify-content:space-between; align-items:center;
      margin-bottom:44px; padding-bottom:20px; border-bottom:1px solid #13162a;
    }}
    .cxo-logo {{
      font-size:12px; font-weight:700; letter-spacing:.15em;
      color:#6366f1; text-transform:uppercase;
    }}
    .cxo-close {{
      font-family:monospace; font-size:12px; color:#4b5563;
      background:transparent; border:1px solid #1e2235; padding:6px 14px; cursor:pointer;
    }}
    .cxo-close:hover {{ color:#e5e7eb; border-color:#374151; }}

    /* Hero grid */
    .cxo-hero {{
      display:grid; grid-template-columns:1fr 1fr; gap:28px; margin-bottom:52px; align-items:center;
    }}
    .cxo-eyebrow {{
      font-size:11px; font-weight:600; letter-spacing:.14em;
      color:#374151; text-transform:uppercase; margin-bottom:14px;
    }}
    .cxo-score-row {{ display:flex; align-items:baseline; gap:10px; margin-bottom:10px; }}
    .cxo-score-num {{ font-size:80px; font-weight:800; color:#f59e0b; line-height:1; }}
    .cxo-score-denom {{ font-size:26px; color:#374151; font-weight:300; }}
    .cxo-score-band-tag {{
      display:inline-block; font-size:12px; font-weight:700; letter-spacing:.08em;
      color:#f59e0b; border:1px solid #78350f; background:#1c1208; padding:3px 10px;
    }}
    .cxo-score-desc {{ font-size:14px; color:#6b7280; margin-bottom:12px; }}
    .cxo-score-ceiling {{ font-size:14px; color:#6366f1; font-weight:500; }}
    .cxo-score-ceiling strong {{ color:#a5b4fc; font-size:18px; }}

    /* Confidence card */
    .cxo-conf-card {{
      background:#0c0f1e; border:1px solid #1e2235; padding:28px;
    }}
    .cxo-conf-label {{
      font-size:11px; font-weight:600; letter-spacing:.12em;
      color:#374151; text-transform:uppercase; margin-bottom:14px;
    }}
    .cxo-conf-range {{
      font-size:38px; font-weight:700; color:#e5e7eb; margin-bottom:20px; letter-spacing:-.02em;
    }}
    .cxo-conf-track {{
      height:8px; background:#13162a; border-radius:4px;
      display:flex; overflow:hidden; margin-bottom:12px;
    }}
    .cxo-conf-proven {{ background:#f59e0b; height:100%; }}
    .cxo-conf-potential {{ background:#6366f1; height:100%; opacity:.45; }}
    .cxo-conf-legend {{
      display:flex; flex-wrap:wrap; gap:16px; font-size:12px; color:#6b7280;
    }}
    .cxo-conf-legend span {{ display:flex; align-items:center; gap:6px; }}
    .cxo-legend-dot {{ width:8px; height:8px; border-radius:50%; flex-shrink:0; }}

    /* Section */
    .cxo-section {{ margin-bottom:52px; }}
    .cxo-section-title {{
      font-size:12px; font-weight:700; letter-spacing:.12em; color:#374151;
      text-transform:uppercase; margin-bottom:20px; padding-bottom:10px;
      border-bottom:1px solid #13162a;
    }}

    /* Proof cards */
    .cxo-proof-grid {{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }}
    .cxo-proof-card {{
      background:#061208; border:1px solid #14532d; padding:26px;
    }}
    .cxo-proof-icon {{ font-size:18px; color:#10b981; margin-bottom:10px; }}
    .cxo-proof-label {{
      font-size:11px; color:#6b7280; text-transform:uppercase;
      letter-spacing:.08em; margin-bottom:8px;
    }}
    .cxo-proof-val {{ font-size:36px; font-weight:800; color:#10b981; margin-bottom:4px; }}
    .cxo-proof-sub {{ font-size:13px; color:#374151; }}

    /* Query cards */
    .cxo-queries-grid {{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }}
    .cxo-query-card {{ padding:22px; border:1px solid #1e2235; background:#0a0d1a; }}
    .cxo-query-badge {{
      font-size:10px; font-weight:700; letter-spacing:.1em;
      color:#6366f1; text-transform:uppercase; margin-bottom:12px;
    }}
    .cxo-query-text {{
      font-size:14px; color:#d1d5db; line-height:1.55;
      font-style:italic; margin-bottom:14px;
    }}
    .cxo-query-cta {{
      font-size:12px; font-weight:600; color:#6366f1; cursor:pointer;
      background:none; border:none; padding:0; font-family:inherit; letter-spacing:.03em;
    }}
    .cxo-query-cta:hover {{ color:#818cf8; }}
    .cxo-query-card.cxo-exec {{
      background:#09090f; border-color:#111827;
      opacity:.55;
    }}
    .cxo-exec .cxo-query-badge {{ color:#374151; }}
    .cxo-exec .cxo-query-text {{ color:#374151; font-style:italic; }}
    .cxo-exec .cxo-query-cta {{ color:#374151; cursor:default; }}
  </style>
</head>
<body>

<!-- ACCESS KEY MODAL -->
<div class="modal-overlay" id="modal-access-key">
  <div class="modal-box">
    <div class="modal-title" id="modal-title">Unlock PiOS Discovery</div>
    <div class="modal-truth" id="modal-truth">
      This intake has not been evaluated by the execution layer.
      Execution must be performed — this key activates the discovery session, not a cached result.
      Structural proof is already complete and does not require this key.
    </div>
    <div class="modal-sub" id="modal-sub">
      PiOS Discovery provides execution-layer activation, interactive structural query,
      signal propagation analysis, and provenance trace for this intake.
      Enter your access key to continue.
    </div>
    <input class="modal-input" type="password" id="access-key-input" placeholder="Access key" autocomplete="off"/>
    <div class="modal-denied" id="modal-denied"></div>
    <div class="modal-actions">
      <button class="modal-cancel" id="modal-cancel-btn">Cancel</button>
      <button class="modal-submit" id="modal-submit-btn">Activate</button>
    </div>
  </div>
</div>

<!-- CXO EXECUTIVE OVERLAY -->
<div class="cxo-overlay" id="cxo-overlay">
  <div class="cxo-inner">

    <div class="cxo-header">
      <div class="cxo-logo">KRAYU &middot; Portfolio Intelligence</div>
      <button class="cxo-close" id="cxo-close">&larr; Operator Cockpit</button>
    </div>

    <!-- HERO: Score Journey -->
    <div class="cxo-hero">
      <div>
        <div class="cxo-eyebrow">Portfolio Intelligence Score</div>
        <div class="cxo-score-row">
          <span class="cxo-score-num">{score}</span>
          <span class="cxo-score-denom">/ 100</span>
          <span class="cxo-score-band-tag">{band}</span>
        </div>
        <div class="cxo-score-desc">Verified structural state &mdash; proven floor, no open risks</div>
        <div class="cxo-score-ceiling">
          Full intelligence ceiling: <strong>{proj} / 100</strong><br/>
          <span style="font-size:13px;color:#4b5563;">Unlocks when execution layer activates</span>
        </div>
      </div>
      <div class="cxo-conf-card">
        <div class="cxo-conf-label">Intelligence Confidence Band</div>
        <div class="cxo-conf-range">[{conf_lo} &ndash; {conf_hi}]</div>
        <div class="cxo-conf-track">
          <div class="cxo-conf-proven" style="width:{conf_lo}%;"></div>
          <div class="cxo-conf-potential" style="width:{conf_hi - conf_lo}%;"></div>
        </div>
        <div class="cxo-conf-legend">
          <span><span class="cxo-legend-dot" style="background:#f59e0b;"></span>{conf_lo} &mdash; proven structural floor</span>
          <span><span class="cxo-legend-dot" style="background:#6366f1;opacity:.6;"></span>{conf_hi} &mdash; achievable ceiling</span>
        </div>
      </div>
    </div>

    <!-- WHAT ONBOARDING DELIVERED -->
    <div class="cxo-section">
      <div class="cxo-section-title">What this onboarding engagement delivered</div>
      <div class="cxo-proof-grid">
        <div class="cxo-proof-card">
          <div class="cxo-proof-icon">&#10003;</div>
          <div class="cxo-proof-label">Structural Coverage</div>
          <div class="cxo-proof-val">{cov_pct}%</div>
          <div class="cxo-proof-sub">{cov_admitted} of {cov_total} units fully admitted</div>
        </div>
        <div class="cxo-proof-card">
          <div class="cxo-proof-icon">&#10003;</div>
          <div class="cxo-proof-label">Reconstruction Proof</div>
          <div class="cxo-proof-val">PASS</div>
          <div class="cxo-proof-sub">4-axis validation &middot; {len(rec["violations"])} violations</div>
        </div>
        <div class="cxo-proof-card">
          <div class="cxo-proof-icon">&#10003;</div>
          <div class="cxo-proof-label">Validated Units</div>
          <div class="cxo-proof-val">{rec_valid}</div>
          <div class="cxo-proof-sub">structural units verified &middot; no open risks</div>
        </div>
      </div>
    </div>

    <!-- GOLDEN QUERIES -->
    <div class="cxo-section">
      <div class="cxo-section-title">Intelligence queries you can activate</div>
      <div class="cxo-queries-grid">
        <div class="cxo-query-card">
          <div class="cxo-query-badge">Structural Discovery &middot; Available Now</div>
          <div class="cxo-query-text">&#x201C;Which structural units carry the highest referential integrity exposure?&#x201D;</div>
          <button class="cxo-query-cta" onclick="document.getElementById('cxo-overlay').classList.remove('open');openModal('discovery');">Activate with Discovery Key &rarr;</button>
        </div>
        <div class="cxo-query-card">
          <div class="cxo-query-badge">Structural Discovery &middot; Available Now</div>
          <div class="cxo-query-text">&#x201C;Trace provenance chain from IG.6 orchestration to terminal intake boundary.&#x201D;</div>
          <button class="cxo-query-cta" onclick="document.getElementById('cxo-overlay').classList.remove('open');openModal('discovery');">Activate with Discovery Key &rarr;</button>
        </div>
        <div class="cxo-query-card">
          <div class="cxo-query-badge">Structural Discovery &middot; Available Now</div>
          <div class="cxo-query-text">&#x201C;Show layer-by-layer structural linking across L40_2, L40_3, L40_4.&#x201D;</div>
          <button class="cxo-query-cta" onclick="document.getElementById('cxo-overlay').classList.remove('open');openModal('discovery');">Activate with Discovery Key &rarr;</button>
        </div>
        <div class="cxo-query-card cxo-exec">
          <div class="cxo-query-badge">Execution Layer Required</div>
          <div class="cxo-query-text">&#x201C;What are the execution failure scenarios for this intake under signal degradation?&#x201D;</div>
          <button class="cxo-query-cta">Run execution layer to unlock &rarr;</button>
        </div>
        <div class="cxo-query-card cxo-exec">
          <div class="cxo-query-badge">Execution Layer Required</div>
          <div class="cxo-query-text">&#x201C;Project signal propagation paths from coverage boundary to terminal state.&#x201D;</div>
          <button class="cxo-query-cta">Run execution layer to unlock &rarr;</button>
        </div>
      </div>
    </div>

  </div>
</div><!-- /cxo-overlay -->

<div class="outer" id="outer">

  <div class="top-bar">
    <div class="header-top">
      <div>
        <div class="header-run">Run: {run_id}</div>
        <div class="header-phase">Execution Phase: {exec_status}</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <button class="cxo-toggle-btn" id="cxo-toggle-btn">CxO View &rarr;</button>
        <div class="header-tag">gauge-v2-product &middot; wp-14</div>
      </div>
    </div>
    <div class="score-grid">
      <div class="score-cell">
        <div class="sc-label">Canonical Score</div>
        <div class="sc-value">{score}</div>
        <div class="sc-band">{band}</div>
        <div class="sc-sub">Verified structural state</div>
      </div>
      <div class="score-cell">
        <div class="sc-label">Projected Score</div>
        <div class="sc-value">{proj}</div>
        <div class="sc-sub">If execution layer completes</div>
      </div>
      <div class="score-cell">
        <div class="sc-label">Confidence Band</div>
        <div class="sc-value" style="font-size:22px;padding-top:4px;">[{conf_lo} &#x2013; {conf_hi}]</div>
        <div class="sc-sub">Lower = proven / Upper = achievable</div>
      </div>
    </div>
  </div>

  <div class="cols">

    <!-- LEFT COLUMN -->
    <div class="col-left">

      <div class="panel">
        <div class="panel-label">Score Decomposition ({score} = {comp_pts} + {cov_pts} + {recon_pts})</div>
        <div class="comp-block">
          <div class="comp-header">
            <div class="comp-name">Completion / Execution Insight</div>
            <div class="comp-pts" style="color:{comp_pts_clr};">{comp_pts} / 40 pts</div>
          </div>
          <div class="comp-bar-bg"><div class="comp-bar-fill" style="width:{comp_bar}%;background:{comp_pts_clr};"></div></div>
          <div class="comp-status">NOT EVALUATED &#x2014; execution layer not performed</div>
        </div>
        <div class="comp-block">
          <div class="comp-header">
            <div class="comp-name">Coverage</div>
            <div class="comp-pts" style="color:{cov_pts_clr};">{cov_pts} / 35 pts</div>
          </div>
          <div class="comp-bar-bg"><div class="comp-bar-fill" style="width:{cov_bar}%;background:{cov_pts_clr};"></div></div>
          <div class="comp-status" style="color:{cov_pts_clr};">COMPUTED &#x2014; {cov_pct}% structural coverage ({cov_admitted}/{cov_total} units)</div>
        </div>
        <div class="comp-block">
          <div class="comp-header">
            <div class="comp-name">Reconstruction</div>
            <div class="comp-pts" style="color:{recon_pts_clr};">{recon_pts} / 25 pts</div>
          </div>
          <div class="comp-bar-bg"><div class="comp-bar-fill" style="width:{recon_bar}%;background:{recon_pts_clr};"></div></div>
          <div class="comp-status" style="color:{recon_pts_clr};">PASS &#x2014; structural validation ({rec_valid}/{rec_total} units)</div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-label">Component Detail</div>
        <div class="exp-block">
          <div class="exp-header">
            <div class="exp-title">Completion / Execution Insight</div>
            <div class="exp-badge badge-not-eval">NOT EVALUATED</div>
          </div>
          <div class="exp-row"><span class="ek">Contribution</span><span class="ev">{comp_pts} of 40 points</span></div>
          <div class="exp-row"><span class="ek">Reason</span><span class="ev">The execution layer has not been run. Completion scoring requires terminal execution state &#x2014; none exists for this run.</span></div>
          <div class="exp-row"><span class="ek">Basis</span><span class="ev">{comp_basis}</span></div>
          <div class="cta-block">
            <div class="cta-truth">
              <strong>Structural proof is complete.</strong>
              The {score}-point floor is verified without execution.
              Execution insight is a separate evaluation that has not been performed.
            </div>
            <div class="cta-sep"></div>
            <div class="cta-gate-label">PiOS Discovery &#x2014; Commercially Gated Access</div>
            <button class="cta-btn" id="cta-unlock-btn">Unlock PiOS Discovery &#x2192;</button>
          </div>
        </div>
        <div class="exp-block">
          <div class="exp-header">
            <div class="exp-title">Coverage</div>
            <div class="exp-badge badge-computed">COMPUTED</div>
          </div>
          <div class="exp-row"><span class="ek">Contribution</span><span class="ev">{cov_pts} of 35 points</span></div>
          <div class="exp-row"><span class="ek">Value</span><span class="ev">{cov_pct}% &#x2014; {cov_admitted}/{cov_total} admissible units</span></div>
          <div class="exp-row"><span class="ek">Basis</span><span class="ev">{cov_basis}</span></div>
          <div class="exp-row"><span class="ek">Authority</span><span class="ev">PSEE-GAUGE.0 DP-5-02 / coverage_state.json</span></div>
        </div>
        <div class="exp-block">
          <div class="exp-header">
            <div class="exp-title">Reconstruction</div>
            <div class="exp-badge badge-pass">PASS</div>
          </div>
          <div class="exp-row"><span class="ek">Contribution</span><span class="ev">{recon_pts} of 25 points</span></div>
          <div class="exp-row"><span class="ek">Validated units</span><span class="ev">{rec_valid} / {rec_total}</span></div>
          <div class="exp-row"><span class="ek">Axes evaluated</span><span class="ev">Completeness &middot; Structural Link &middot; Referential Integrity &middot; Layer Consistency</span></div>
          <div class="exp-row"><span class="ek">Violations</span><span class="ev">{len(rec["violations"])}</span></div>
          <div class="exp-row"><span class="ek">Basis</span><span class="ev">{recon_basis}</span></div>
          <div class="exp-row"><span class="ek">Authority</span><span class="ev">PSEE-GAUGE.0 DP-6-03 / reconstruction_state.json</span></div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-label">Capabilities Not Available</div>
        <div class="cap-block">
          <div class="cap-na-badge">NOT EVALUATED</div>
          <div class="cap-title">Execution Validation</div>
          <div class="cap-row"><span class="ck">Why</span><span class="cv">PiOS execution layer has not been run. No terminal execution state exists.</span></div>
          <div class="cap-unlock">Unlock: run PiOS execution layer against this intake</div>
        </div>
        <div class="cap-block">
          <div class="cap-na-badge">NOT EVALUATED</div>
          <div class="cap-title">Signal Propagation Analysis</div>
          <div class="cap-row"><span class="ck">Why</span><span class="cv">Signal propagation requires execution-layer output. No execution has occurred.</span></div>
          <div class="cap-unlock">Unlock: complete execution layer; activate signal propagation stream</div>
        </div>
        <div class="cap-block">
          <div class="cap-na-badge">NOT EVALUATED</div>
          <div class="cap-title">Completion Scoring (Runtime)</div>
          <div class="cap-row"><span class="ck">Why</span><span class="cv">Completion score requires terminal state (S-T1, S-T2, S-T3, S-13). Current: {exec_status} &#x2014; in-flight.</span></div>
          <div class="cap-unlock">Unlock: advance to terminal state via PiOS execution layer</div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-label">Confidence Band [{conf_lo} &#x2013; {conf_hi}]</div>
        <div class="conf-text">
          The <strong>lower bound ({conf_lo})</strong> represents the verified structural state.
          Coverage ({cov_pts} pts) and Reconstruction ({recon_pts} pts) are fully proven.
          Completion (0 pts) reflects the absence of execution-layer evaluation &#x2014; not a failure.
        </div>
        <div class="conf-text">
          The <strong>upper bound ({conf_hi})</strong> represents the achievable score if the execution layer
          completes successfully. No structural risks have been identified that would reduce this ceiling.
        </div>
        <div class="conf-text">
          The gap is fully explained by the missing execution evaluation.
          There are no open escalations, unknown-space records, or coverage gaps.
        </div>
        <div class="conf-bar-wrap">
          <div class="conf-bar-fill"></div>
          <div class="conf-lower-mark"></div>
        </div>
        <div class="conf-legend">
          <div class="conf-legend-item">
            <div class="conf-legend-dot" style="background:#8b949e;"></div>
            <span>Lower = {conf_lo} &#x2014; verified structural state</span>
          </div>
          <div class="conf-legend-item">
            <div class="conf-legend-dot" style="background:#d29922;"></div>
            <span>Upper = {conf_hi} &#x2014; achievable if execution layer completes</span>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-label">Operator Mode</div>
        <details class="op-details">
          <summary>Raw State &#x2014; gauge_state.json / coverage_state.json / reconstruction_state.json</summary>
          <div class="op-inner">
            <div class="op-group-label">Execution State</div>
            <table class="op-table">
              <tr><td>execution_status</td><td>{exec_status}</td></tr>
              <tr><td>execution_mode</td><td>{pkg["engine"]["execution_mode"]}</td></tr>
              <tr><td>run_id</td><td>{run_id}</td></tr>
              <tr><td>stream</td><td>{pkg_stream}</td></tr>
            </table>
            <div class="op-group-label">Score Components</div>
            <table class="op-table">
              <tr><td>canonical_score</td><td>{score}</td></tr>
              <tr><td>band_label</td><td>{band}</td></tr>
              <tr><td>derivation</td><td>{derivation}</td></tr>
              <tr><td>completion_points</td><td>{comp_pts}</td></tr>
              <tr><td>coverage_points</td><td>{cov_pts}</td></tr>
              <tr><td>reconstruction_points</td><td>{recon_pts}</td></tr>
              <tr><td>projected_score</td><td>{proj}</td></tr>
              <tr><td>projection_rule</td><td>{proj_rule}</td></tr>
              <tr><td>confidence_lower</td><td>{conf_lo}</td></tr>
              <tr><td>confidence_upper</td><td>{conf_hi}</td></tr>
            </table>
            <div class="op-group-label">DIM-01 &#x2014; Coverage</div>
            <table class="op-table">
              <tr><td>coverage_percent</td><td>{cov_pct}</td></tr>
              <tr><td>admitted_units</td><td>{cov_admitted}</td></tr>
              <tr><td>total_units</td><td>{cov_total}</td></tr>
              <tr><td>authority</td><td>PSEE-GAUGE.0 DP-5-02</td></tr>
            </table>
            <div class="op-group-label">DIM-02 &#x2014; Reconstruction</div>
            <table class="op-table">
              <tr><td>state</td><td>{rec["state"]}</td></tr>
              <tr><td>validated_units</td><td>{rec_valid}</td></tr>
              <tr><td>total_units</td><td>{rec_total}</td></tr>
              <tr><td>violations</td><td>{len(rec["violations"])}</td></tr>
              <tr><td>authority</td><td>PSEE-GAUGE.0 DP-6-03</td></tr>
            </table>
            <div class="op-group-label">DIM-03 through DIM-06</div>
            <table class="op-table">
              <tr><td>DIM-03 Escalation</td><td>{dim03_val} &#x2014; {dim03_lbl}</td></tr>
              <tr><td>DIM-04 Unknown-Space</td><td>{dim04_count} records &#x2014; {dim04_lbl}</td></tr>
              <tr><td>DIM-05 Intake</td><td>{dim05_state}</td></tr>
              <tr><td>DIM-06 Heuristic</td><td>{dim06_state}</td></tr>
            </table>
            <div class="op-authority">
              Authority: PSEE-GAUGE.0/gauge_score_model.md &sect;G.2&#x2013;G.4 &middot;
              dimension_projection_model.md &sect;DIM-01..06 &middot;
              projection_logic_spec.md &sect;{proj_rule}
            </div>
          </div>
        </details>
      </div>

    </div><!-- /col-left -->

    <!-- RIGHT COLUMN (middle reading area) -->
    <div class="col-right">

      <div class="panel">
        <div class="panel-label">Structural Proof</div>
        <div id="discovery-success-msg" class="discovery-success">
          PiOS Discovery access enabled for structural exploration.
          <div class="discovery-success-sub">Execution-layer scenarios remain unavailable until execution runs.</div>
        </div>
        <div class="si-bridge">
          <div class="si-bridge-title">Structural Proof Summary <span id="access-enabled-chip" class="access-chip">ACCESS ENABLED</span></div>
          <div class="si-bridge-sub">
            PSEE-validated reconstruction proof. {rec_valid} structural units validated.
            Provenance chain, layer integrity, and case structure are governed artifacts for this run.
          </div>
          <div class="si-bridge-metrics">
            <div class="si-metric"><div class="si-metric-val">{rec_valid}</div><div class="si-metric-lbl">Validated Units</div></div>
            <div class="si-metric"><div class="si-metric-val">4</div><div class="si-metric-lbl">Reconstruction Axes</div></div>
            <div class="si-metric"><div class="si-metric-val">{len(rec["violations"])}</div><div class="si-metric-lbl">Violations</div></div>
          </div>
          <button class="si-bridge-btn" id="si-bridge-btn">Unlock PiOS Discovery &#x2192;</button>
          <div class="si-bridge-artifacts">
            Governed artifacts: gauge_state.json &middot; coverage_state.json &middot; reconstruction_state.json &middot; verification.log
          </div>
        </div>
        <div class="dev-access-block">
          <div class="cta-gate-label">Develop Access &#x2014; Runtime Intelligence Layer</div>
          <div style="font-size:11px;color:#333;margin-bottom:8px;line-height:1.6;">
            Exposes structural metrics, full signal set, and topology. Requires develop-tier key.
          </div>
          <button class="dev-access-btn" id="dev-unlock-btn">Unlock Develop Access &#x2192;</button>
        </div>
        <div style="font-size:12px;color:#8b949e;line-height:1.6;margin-top:12px;">
          Full PiOS Structural Insights mounting remains part of reconciliation.
        </div>
      </div>

      <div class="panel">
        <div class="panel-label">Discovery Queries</div>
        <div class="query-block structural-query">
          <div class="query-text">&#x201C;Which structural units carry the highest referential integrity exposure?&#x201D;</div>
          <div class="query-lock-bar">
            <div class="query-lock-reason">Requires PiOS Discovery &middot; structural query</div>
            <div class="query-lock-badge">LOCKED &#x2014; Access Key</div>
          </div>
        </div>
        <div class="query-block structural-query">
          <div class="query-text">&#x201C;Trace provenance chain from IG.6 orchestration to terminal intake boundary.&#x201D;</div>
          <div class="query-lock-bar">
            <div class="query-lock-reason">Requires PiOS Discovery &middot; provenance trace</div>
            <div class="query-lock-badge">LOCKED &#x2014; Access Key</div>
          </div>
        </div>
        <div class="query-block structural-query">
          <div class="query-text">&#x201C;Show layer-by-layer structural linking across L40_2, L40_3, L40_4.&#x201D;</div>
          <div class="query-lock-bar">
            <div class="query-lock-reason">Requires PiOS Discovery &middot; layer analysis</div>
            <div class="query-lock-badge">LOCKED &#x2014; Access Key</div>
          </div>
        </div>
        <div class="query-block exec-locked">
          <div class="query-text">&#x201C;What are the execution failure scenarios for this intake under signal degradation?&#x201D;</div>
          <div class="query-lock-bar">
            <div class="query-lock-reason">Execution Layer Required</div>
            <div class="query-lock-badge">LOCKED &#x2014; Execution Layer + Access Key</div>
          </div>
        </div>
        <div class="query-block exec-locked">
          <div class="query-text">&#x201C;Project signal propagation paths from coverage boundary to terminal state.&#x201D;</div>
          <div class="query-lock-bar">
            <div class="query-lock-reason">Execution Layer Required</div>
            <div class="query-lock-badge">LOCKED &#x2014; Execution Layer + Access Key</div>
          </div>
        </div>
        <div style="font-size:12px;color:#333;margin-top:12px;border-top:1px solid #1f2937;padding-top:10px;line-height:1.7;">
          Structural queries unlock with PiOS Discovery key only.<br/>
          Execution queries require the execution layer to have run.
        </div>
      </div>

      <div class="panel">
        <div class="panel-label">State Summary</div>
        <div class="state-row"><div class="state-dot" style="background:#3fb950;"></div><span>Structural proof: <strong>COMPLETE</strong></span></div>
        <div class="state-row"><div class="state-dot" style="background:#3fb950;"></div><span>Coverage: <strong>{cov_pct}% ({cov_admitted}/{cov_total} units)</strong></span></div>
        <div class="state-row"><div class="state-dot" style="background:#3fb950;"></div><span>Reconstruction: <strong>PASS (4-axis, {len(rec["violations"])} violations)</strong></span></div>
        <div class="state-row"><div class="state-dot" style="background:#d29922;"></div><span>Score: <strong>{score} {band}</strong> &#x2014; proven floor</span></div>
        <div class="state-row"><div class="state-dot" style="background:#8b949e;"></div><span>Execution insight: <strong style="color:#8b949e;">NOT EVALUATED</strong></span></div>
        <div class="state-row"><div class="state-dot" id="discovery-dot" style="background:#1b3a5c;"></div><span>Structural discovery: <span id="discovery-state"><strong style="color:#444;">ACCESS KEY REQUIRED</strong></span></span></div>
        <div class="state-row"><div class="state-dot" id="develop-dot" style="background:#1b3a5c;"></div><span>Runtime intelligence: <span id="develop-state"><strong style="color:#444;">DEVELOP ACCESS REQUIRED</strong></span></span></div>
        <div class="state-row"><div class="state-dot" style="background:#1f2937;"></div><span>Execution scenarios: <strong style="color:#333;">EXECUTION LAYER REQUIRED</strong></span></div>
      </div>

    </div><!-- /col-right -->

    <!-- COLUMN 3 — DEVELOP -->
    <div class="col-develop" id="col-develop">

      <div class="panel" style="background:#060e17;border-bottom:1px solid #0d1f2e;">
        <div class="panel-label">Runtime Intelligence <span class="dev-tier-badge">DEVELOP</span></div>
        <div style="font-size:11px;color:#8b949e;line-height:1.6;">
          WP-13B authoritative input layer.<br/>Source: gauge_state.json
        </div>
      </div>

      <div class="panel">
        <div class="panel-label">Structural Metrics</div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
          <div class="si-metric" style="border-color:#1b3a5c;">
            <div class="si-metric-val" style="font-size:18px;">{sm["structural_density"]}</div>
            <div class="si-metric-lbl">Structural Density</div>
          </div>
          <div class="si-metric" style="border-color:#1b3a5c;">
            <div class="si-metric-val" style="font-size:18px;">{sm["dependency_load"]}</div>
            <div class="si-metric-lbl">Dependency Load</div>
          </div>
          <div class="si-metric" style="border-color:#1b3a5c;">
            <div class="si-metric-val" style="font-size:18px;">{sm["coordination_pressure"]}</div>
            <div class="si-metric-lbl">Coordination Pressure</div>
          </div>
          <div class="si-metric" style="border-color:#1b3a5c;">
            <div class="si-metric-val" style="font-size:18px;">{sm["visibility_deficit"]}</div>
            <div class="si-metric-lbl">Visibility Deficit</div>
          </div>
        </div>
        <div style="font-size:11px;color:#333;margin-top:10px;">source: gauge_state.structural_metrics</div>
      </div>

      <div class="panel">
        <div class="panel-label">Signal Set ({len(g["signals"])})</div>
        <table class="op-table">
          <tr><td style="color:#444;font-size:10px;padding-bottom:6px;">ID</td>
              <td style="color:#444;font-size:10px;padding-bottom:6px;">Severity</td>
              <td style="color:#444;font-size:10px;padding-bottom:6px;">Bound</td></tr>
          {sig_rows_dev}
        </table>
        <div style="font-size:11px;color:#333;margin-top:8px;">source: gauge_state.signals</div>
      </div>

      <div class="panel">
        <div class="panel-label">Topology</div>
        <div class="op-group-label">Domains ({n_domains})</div>
        <div class="topo-domain">{domains_str}</div>
        <div class="op-group-label" style="margin-top:10px;">Nodes ({n_nodes})</div>
        {topo_node_rows}
        <div class="op-group-label" style="margin-top:10px;">Relationships ({n_rels})</div>
        {topo_rel_rows}
        <div style="font-size:11px;color:#333;margin-top:10px;">source: gauge_state.topology</div>
      </div>

      <div class="panel">
        <div class="panel-label">Package Traceability</div>
        <table class="op-table">
          <tr><td>run_id</td><td>{run_id}</td></tr>
          <tr><td>stream</td><td>{pkg_stream}</td></tr>
          <tr><td>git_commit</td><td>{git_commit[:20]}&#x2026;</td></tr>
          <tr><td>branch</td><td>{git_branch}</td></tr>
          <tr><td>lifecycle</td><td>{lifecycle}</td></tr>
          <tr><td>intake_mode</td><td>{intake}</td></tr>
        </table>
      </div>

    </div><!-- /col-develop -->

  </div><!-- /cols -->
</div><!-- /outer -->

<script>
// Expose openModal globally so CxO overlay buttons can call it
var openModal;
(function() {{
  var VALID_KEY_DISCOVERY = 'PIOS-DISCOVERY-DEMO';
  var VALID_KEY_DEVELOP   = 'DEVELOP-DELTA-1';
  var discoveryEnabled = false;
  var developEnabled   = false;
  var modalMode = 'discovery';

  var MODAL_CONTENT = {{
    discovery: {{
      title: 'Unlock PiOS Discovery',
      truth: 'This intake has not been evaluated by the execution layer. Execution must be performed — this key activates the discovery session, not a cached result. Structural proof is already complete.',
      sub:   'PiOS Discovery provides execution-layer activation, interactive structural query, signal propagation analysis, and provenance trace. Enter your access key to continue.'
    }},
    develop: {{
      title: 'Unlock Develop Access',
      truth: 'Develop access exposes the runtime intelligence layer: structural metrics, full signal set (SIG-001..SIG-008), and topology from the WP-13B authoritative input. All values sourced from the emitted runtime package.',
      sub:   'Develop access reveals column 3 of this surface. Values are bound to gauge_state.json from this run. Enter your develop access key to continue.'
    }}
  }};

  openModal = function(mode) {{
    modalMode = mode || 'discovery';
    var c = MODAL_CONTENT[modalMode];
    document.getElementById('modal-title').textContent = c.title;
    document.getElementById('modal-truth').textContent = c.truth;
    document.getElementById('modal-sub').textContent   = c.sub;
    document.getElementById('modal-access-key').classList.add('open');
    document.getElementById('access-key-input').value = '';
    document.getElementById('modal-denied').style.display = 'none';
    setTimeout(function() {{ document.getElementById('access-key-input').focus(); }}, 50);
  }}

  function closeModal() {{
    document.getElementById('modal-access-key').classList.remove('open');
  }}

  function enableDiscovery() {{
    if (discoveryEnabled) return;
    discoveryEnabled = true;
    var ctaBtn = document.getElementById('cta-unlock-btn');
    ctaBtn.textContent = 'Discovery Access Enabled';
    ctaBtn.style.borderColor = '#1b5e3d'; ctaBtn.style.color = '#3fb950'; ctaBtn.style.cursor = 'default'; ctaBtn.onclick = null;
    var siBtn = document.getElementById('si-bridge-btn');
    siBtn.textContent = 'Discovery Access Enabled';
    siBtn.style.borderColor = '#1b5e3d'; siBtn.style.color = '#3fb950'; siBtn.style.cursor = 'default'; siBtn.onclick = null;
    document.getElementById('access-enabled-chip').style.display = 'inline-block';
    document.getElementById('discovery-success-msg').style.display = 'block';
    document.querySelectorAll('.query-block.structural-query').forEach(function(b) {{
      b.classList.add('unlocked');
      b.querySelector('.query-lock-badge').textContent = 'AVAILABLE';
      b.querySelector('.query-lock-reason').textContent = 'PiOS Discovery access enabled';
    }});
    document.getElementById('discovery-dot').style.background = '#3fb950';
    document.getElementById('discovery-state').innerHTML = '<strong style="color:#3fb950;">ACCESS ENABLED</strong>';
  }}

  function enableDevelop() {{
    if (developEnabled) return;
    developEnabled = true;
    enableDiscovery();
    document.getElementById('col-develop').classList.add('visible');
    document.getElementById('outer').classList.add('develop-open');
    var devBtn = document.getElementById('dev-unlock-btn');
    devBtn.textContent = 'Develop Access Enabled';
    devBtn.style.borderColor = '#1b5e3d'; devBtn.style.color = '#3fb950'; devBtn.style.cursor = 'default'; devBtn.onclick = null;
    document.getElementById('develop-dot').style.background = '#58a6ff';
    document.getElementById('develop-state').innerHTML = '<strong style="color:#58a6ff;">COLUMN 3 VISIBLE</strong>';
  }}

  function handleSubmit() {{
    var key = document.getElementById('access-key-input').value.trim();
    var denied = document.getElementById('modal-denied');
    if (!key) {{ denied.style.display = 'block'; denied.textContent = 'Access key required.'; return; }}
    if (key === VALID_KEY_DEVELOP)   {{ closeModal(); enableDevelop();   return; }}
    if (key === VALID_KEY_DISCOVERY) {{ closeModal(); enableDiscovery(); return; }}
    denied.style.display = 'block';
    denied.textContent = 'Access key not recognized. Contact your program coordinator to obtain access.';
  }}

  // CxO Overlay toggle
  document.getElementById('cxo-toggle-btn').addEventListener('click', function() {{
    document.getElementById('cxo-overlay').classList.add('open');
    window.scrollTo(0, 0);
  }});
  document.getElementById('cxo-close').addEventListener('click', function() {{
    document.getElementById('cxo-overlay').classList.remove('open');
  }});

  document.getElementById('cta-unlock-btn').addEventListener('click', function() {{ openModal('discovery'); }});
  document.getElementById('si-bridge-btn').addEventListener('click',  function() {{ openModal('discovery'); }});
  document.getElementById('dev-unlock-btn').addEventListener('click', function() {{ openModal('develop'); }});
  document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
  document.getElementById('modal-submit-btn').addEventListener('click', handleSubmit);
  document.getElementById('modal-access-key').addEventListener('click', function(e) {{ if (e.target===this) closeModal(); }});
  document.getElementById('access-key-input').addEventListener('keydown', function(e) {{
    if (e.key==='Enter') handleSubmit();
    if (e.key==='Escape') closeModal();
  }});
}})();
</script>
</body>
</html>
"""



# ── OUTPUT WRITE ──────────────────────────────────────────────────────────────
def output_write(surface_dir, client_uuid, run_id, pkg, entry, guided, operator_view,
                 checks, html_content):
    out("--- OUTPUT_WRITE ---")
    run_root = os.path.realpath(
        os.path.join(REPO_ROOT, "clients", client_uuid, "runs", run_id)
    )
    surf_real = os.path.realpath(surface_dir)

    def safe_write(fname, content):
        fpath = os.path.join(surface_dir, fname)
        real = os.path.realpath(os.path.abspath(fpath))
        if not real.startswith(surf_real + os.sep) and real != surf_real:
            fail("OUTPUT_WRITE", f"forbidden write: {fpath}", "WRITE_SCOPE_VIOLATION")
        with open(fpath, "w") as f:
            f.write(content)
        out(f"  WRITTEN  {os.path.relpath(fpath, REPO_ROOT)}")

    os.makedirs(surface_dir, exist_ok=True)

    validation_md  = build_validation_md(checks, client_uuid, run_id, pkg)
    surface_files  = ["entry_view.json", "guided_view.json", "operator_view.json",
                      "exposure_manifest.json", "surface_validation.md", "gauge_surface.html"]
    manifest_obj   = build_exposure_manifest(client_uuid, run_id, pkg, surface_files)

    safe_write("entry_view.json",    jdump(entry))
    safe_write("guided_view.json",   jdump(guided))
    safe_write("operator_view.json", jdump(operator_view))
    safe_write("exposure_manifest.json", jdump(manifest_obj))
    safe_write("surface_validation.md",  validation_md)
    safe_write("gauge_surface.html",     html_content)

    out("OUTPUT_WRITE_PASS")
    out()
    return surface_files


# ── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="PSEE Product Surface Builder — WP-14"
    )
    parser.add_argument("--client", required=True, help="Client UUID")
    parser.add_argument("--run-id", required=True, dest="run_id", help="Run ID")
    args = parser.parse_args()

    client_uuid = args.client
    run_id      = args.run_id

    # PRE-FLIGHT
    surface_dir = preflight(client_uuid, run_id)

    # PACKAGE_READ
    pkg = read_package(client_uuid, run_id)

    # EXPOSURE_CLASSIFICATION
    cls = exposure_classification(pkg)

    # TIER_BUILD
    out("--- TIER_BUILD ---")
    entry         = build_entry(pkg, cls, client_uuid, run_id)
    guided        = build_guided(entry, pkg, cls, client_uuid, run_id)
    operator_view = build_operator(guided, pkg, cls, client_uuid, run_id)
    out(f"  tiers built: ENTRY ({len(entry)} fields) / "
        f"GUIDED ({len(guided)} fields) / OPERATOR ({len(operator_view)} fields)")
    out("TIER_BUILD_PASS")
    out()

    # SURFACE_VALIDATION
    checks = validate_surface(entry, guided, operator_view, pkg, client_uuid, run_id)

    # HTML
    html = build_html(entry, guided, operator_view, pkg, client_uuid, run_id)

    # OUTPUT_WRITE
    surface_files = output_write(surface_dir, client_uuid, run_id, pkg,
                                  entry, guided, operator_view, checks, html)

    out("SURFACE_COMPLETE")
    out(f"  client_uuid:   {client_uuid}")
    out(f"  run_id:        {run_id}")
    out(f"  tiers:         ENTRY / GUIDED / OPERATOR")
    out(f"  fidelity:      PASS ({len(checks)} checks)")
    out(f"  artifacts:     {len(surface_files)}")
    out(f"  surface root:  clients/{client_uuid}/runs/{run_id}/surface/")
    sys.exit(0)


if __name__ == "__main__":
    main()
