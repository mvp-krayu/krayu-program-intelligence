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
    """Self-contained HTML surface. All values sourced from runtime package."""
    g = pkg["gauge"]

    def sig_row(s):
        sev_color = {"CRITICAL": "#c0392b", "HIGH": "#e67e22",
                     "MEDIUM": "#2980b9", "LOW": "#27ae60"}
        color = sev_color.get(s["severity"], "#666")
        return (f'<tr><td>{s["id"]}</td>'
                f'<td style="color:{color};font-weight:600">{s["severity"]}</td>'
                f'<td>{s["bound_count"]}</td></tr>')

    def node_row(n):
        return (f'<tr><td>{n["label"]}</td><td>{n["domain"]}</td>'
                f'<td style="font-family:monospace;font-size:0.8em">{n["id"]}</td></tr>')

    def rel_row(r):
        # Resolve node ids to labels for readability
        id_to_label = {n["id"]: n["label"] for n in g["topology"]["nodes"]}
        return (f'<tr><td>{id_to_label.get(r["from"], r["from"])}</td>'
                f'<td style="color:#7f8c8d">→</td>'
                f'<td>{id_to_label.get(r["to"], r["to"])}</td>'
                f'<td style="font-size:0.85em">{r["type"]}</td></tr>')

    sig_rows   = "\n".join(sig_row(s) for s in g["signals"])
    node_rows  = "\n".join(node_row(n) for n in g["topology"]["nodes"])
    rel_rows   = "\n".join(rel_row(r) for r in g["topology"]["relationships"])
    domain_list = ", ".join(g["topology"]["domains"])

    sm = g["structural_metrics"]
    score = g["score"]["canonical"]
    band  = g["score"]["band_label"]
    proj  = g["projection"]["value"]
    conf_lo = g["confidence"]["lower"]
    conf_hi = g["confidence"]["upper"]
    intake  = guided["intake_mode"]
    qs_cls  = guided["query_state"]["classification"]
    qs_gate = guided["query_state"]["gating_state"]
    qs_sel  = guided["query_state"]["selected_query"]

    sig_sum = guided["signal_summary"]

    band_color = {"CONDITIONAL": "#e67e22", "FULL": "#27ae60",
                  "PARTIAL": "#3498db", "LOW": "#c0392b"}.get(band, "#666")

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PSEE Gauge Surface — {run_id}</title>
<style>
  /* source: PSEE.RECONCILE.1.WP-14 — all values from runtime package */
  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
         background: #f5f6fa; color: #2c3e50; min-height: 100vh; }}
  header {{ background: #1a252f; color: #ecf0f1; padding: 18px 32px;
            display: flex; align-items: center; justify-content: space-between; }}
  header h1 {{ font-size: 1.1rem; font-weight: 600; letter-spacing: 0.03em; }}
  header small {{ font-size: 0.75rem; color: #95a5a6; font-family: monospace; }}
  .tabs {{ display: flex; background: #fff; border-bottom: 2px solid #ecf0f1;
           padding: 0 32px; }}
  .tab {{ padding: 12px 24px; cursor: pointer; font-size: 0.85rem; font-weight: 600;
          color: #7f8c8d; border-bottom: 3px solid transparent; margin-bottom: -2px;
          letter-spacing: 0.04em; transition: color 0.15s; }}
  .tab.active {{ color: #2980b9; border-bottom-color: #2980b9; }}
  .tab:hover {{ color: #2980b9; }}
  .panel {{ display: none; padding: 32px; max-width: 1000px; margin: 0 auto; }}
  .panel.active {{ display: block; }}
  .card {{ background: #fff; border-radius: 8px; padding: 24px;
           box-shadow: 0 1px 4px rgba(0,0,0,0.07); margin-bottom: 20px; }}
  .card h2 {{ font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em;
              color: #95a5a6; margin-bottom: 16px; }}
  .score-hero {{ display: flex; align-items: baseline; gap: 12px; }}
  .score-value {{ font-size: 3.5rem; font-weight: 700; color: {band_color}; }}
  .score-meta {{ display: flex; flex-direction: column; gap: 4px; }}
  .badge {{ display: inline-block; padding: 3px 10px; border-radius: 4px;
            font-size: 0.75rem; font-weight: 700; letter-spacing: 0.04em; }}
  .badge-band {{ background: {band_color}22; color: {band_color}; }}
  .badge-intake {{ background: #27ae6022; color: #27ae60; font-size: 0.7rem; }}
  .conf-range {{ font-size: 0.85rem; color: #7f8c8d; margin-top: 4px; }}
  .kv-grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 12px; }}
  .kv {{ background: #f8f9fa; border-radius: 6px; padding: 12px 16px; }}
  .kv-label {{ font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em;
               color: #95a5a6; margin-bottom: 4px; }}
  .kv-value {{ font-size: 1.05rem; font-weight: 600; color: #2c3e50; }}
  table {{ width: 100%; border-collapse: collapse; font-size: 0.85rem; }}
  th {{ text-align: left; padding: 8px 12px; font-size: 0.7rem; text-transform: uppercase;
        letter-spacing: 0.06em; color: #95a5a6; border-bottom: 2px solid #ecf0f1; }}
  td {{ padding: 8px 12px; border-bottom: 1px solid #f5f6fa; }}
  tr:last-child td {{ border-bottom: none; }}
  .sig-count {{ display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }}
  .sig-badge {{ padding: 4px 12px; border-radius: 4px; font-size: 0.75rem;
                font-weight: 600; }}
  .sc-critical {{ background: #c0392b22; color: #c0392b; }}
  .sc-high {{ background: #e67e2222; color: #e67e22; }}
  .sc-medium {{ background: #2980b922; color: #2980b9; }}
  .sc-low {{ background: #27ae6022; color: #27ae60; }}
  .mono {{ font-family: monospace; font-size: 0.8em; color: #7f8c8d; }}
  .qs-row {{ display: flex; flex-direction: column; gap: 8px; }}
  .qs-item {{ display: flex; gap: 8px; align-items: center; font-size: 0.85rem; }}
  .qs-key {{ color: #95a5a6; min-width: 120px; font-size: 0.75rem; }}
  footer {{ text-align: center; padding: 24px; font-size: 0.7rem; color: #bdc3c7; }}
</style>
</head>
<body>
<header>
  <h1>PSEE Gauge Surface</h1>
  <small>run: {run_id} &nbsp;|&nbsp; stream: PSEE.RECONCILE.1.WP-14 &nbsp;|&nbsp;
         source: PSEE.RECONCILE.1.WP-13</small>
</header>

<div class="tabs">
  <div class="tab active" onclick="showTab('entry')">ENTRY</div>
  <div class="tab" onclick="showTab('guided')">GUIDED</div>
  <div class="tab" onclick="showTab('operator')">OPERATOR</div>
</div>

<!-- ══ ENTRY ══ -->
<div class="panel active" id="tab-entry">
  <div class="card">
    <h2>Gauge Score</h2>
    <div class="score-hero">
      <div class="score-value">{score}</div>
      <div class="score-meta">
        <span class="badge badge-band">{band}</span>
        <span class="badge badge-intake">{intake}</span>
        <div class="conf-range">Confidence range: {conf_lo} – {conf_hi}
             &nbsp;(projected: {proj})</div>
      </div>
    </div>
  </div>
  <div class="card">
    <h2>Envelope</h2>
    <div class="kv-grid">
      <div class="kv"><div class="kv-label">Intake Mode</div>
           <div class="kv-value">{intake}</div></div>
      <div class="kv"><div class="kv-label">Envelope Status</div>
           <div class="kv-value">{entry["envelope_status"]}</div></div>
      <div class="kv"><div class="kv-label">Canonical Score</div>
           <div class="kv-value">{score}</div></div>
      <div class="kv"><div class="kv-label">Band</div>
           <div class="kv-value">{band}</div></div>
    </div>
  </div>
</div>

<!-- ══ GUIDED ══ -->
<div class="panel" id="tab-guided">
  <div class="card">
    <h2>Gauge Score</h2>
    <div class="score-hero">
      <div class="score-value">{score}</div>
      <div class="score-meta">
        <span class="badge badge-band">{band}</span>
        <span class="badge badge-intake">{intake}</span>
        <div class="conf-range">Confidence range: {conf_lo} – {conf_hi}
             &nbsp;(projected: {proj})</div>
      </div>
    </div>
  </div>
  <div class="card">
    <h2>Structural Metrics</h2>
    <div class="kv-grid">
      <div class="kv"><div class="kv-label">Structural Density</div>
           <div class="kv-value">{sm["structural_density"]}</div></div>
      <div class="kv"><div class="kv-label">Dependency Load</div>
           <div class="kv-value">{sm["dependency_load"]}</div></div>
      <div class="kv"><div class="kv-label">Coordination Pressure</div>
           <div class="kv-value">{sm["coordination_pressure"]}</div></div>
      <div class="kv"><div class="kv-label">Visibility Deficit</div>
           <div class="kv-value">{sm["visibility_deficit"]}</div></div>
    </div>
  </div>
  <div class="card">
    <h2>Signal Summary</h2>
    <div class="sig-count">
      <span class="sig-badge sc-critical">CRITICAL: {sig_sum["critical"]}</span>
      <span class="sig-badge sc-high">HIGH: {sig_sum["high"]}</span>
      <span class="sig-badge sc-medium">MEDIUM: {sig_sum["medium"]}</span>
      <span class="sig-badge sc-low">LOW: {sig_sum["low"]}</span>
    </div>
    <div style="font-size:0.8rem;color:#7f8c8d">
      {sig_sum["count"]} signals &nbsp;|&nbsp;
      topology: {guided["topology_summary"]["nodes"]} nodes across
      {guided["topology_summary"]["domains"]} domains
    </div>
  </div>
  <div class="card">
    <h2>Query Classification</h2>
    <div class="qs-row">
      <div class="qs-item"><span class="qs-key">Classification</span>
           <strong>{qs_cls}</strong></div>
      <div class="qs-item"><span class="qs-key">Gating State</span>
           <strong>{qs_gate}</strong></div>
      <div class="qs-item"><span class="qs-key">Selected Query</span>
           <span class="mono">{qs_sel}</span></div>
    </div>
  </div>
</div>

<!-- ══ OPERATOR ══ -->
<div class="panel" id="tab-operator">
  <div class="card">
    <h2>Gauge Score</h2>
    <div class="score-hero">
      <div class="score-value">{score}</div>
      <div class="score-meta">
        <span class="badge badge-band">{band}</span>
        <span class="badge badge-intake">{intake}</span>
        <div class="conf-range">Confidence range: {conf_lo} – {conf_hi}
             &nbsp;(projected: {proj})</div>
      </div>
    </div>
  </div>
  <div class="card">
    <h2>Structural Metrics</h2>
    <div class="kv-grid">
      <div class="kv"><div class="kv-label">Structural Density</div>
           <div class="kv-value">{sm["structural_density"]}</div></div>
      <div class="kv"><div class="kv-label">Dependency Load</div>
           <div class="kv-value">{sm["dependency_load"]}</div></div>
      <div class="kv"><div class="kv-label">Coordination Pressure</div>
           <div class="kv-value">{sm["coordination_pressure"]}</div></div>
      <div class="kv"><div class="kv-label">Visibility Deficit</div>
           <div class="kv-value">{sm["visibility_deficit"]}</div></div>
    </div>
  </div>
  <div class="card">
    <h2>Full Signal Set</h2>
    <div class="sig-count">
      <span class="sig-badge sc-critical">CRITICAL: {sig_sum["critical"]}</span>
      <span class="sig-badge sc-high">HIGH: {sig_sum["high"]}</span>
      <span class="sig-badge sc-medium">MEDIUM: {sig_sum["medium"]}</span>
      <span class="sig-badge sc-low">LOW: {sig_sum["low"]}</span>
    </div>
    <table>
      <thead><tr><th>Signal</th><th>Severity</th><th>Bound Count</th></tr></thead>
      <tbody>{sig_rows}</tbody>
    </table>
  </div>
  <div class="card">
    <h2>Topology — Nodes ({len(g["topology"]["nodes"])})</h2>
    <div style="font-size:0.8rem;color:#7f8c8d;margin-bottom:12px">
      Domains: {domain_list}
    </div>
    <table>
      <thead><tr><th>Label</th><th>Domain</th><th>Node ID</th></tr></thead>
      <tbody>{node_rows}</tbody>
    </table>
  </div>
  <div class="card">
    <h2>Topology — Relationships ({len(g["topology"]["relationships"])})</h2>
    <table>
      <thead><tr><th>From</th><th></th><th>To</th><th>Type</th></tr></thead>
      <tbody>{rel_rows}</tbody>
    </table>
  </div>
  <div class="card">
    <h2>Package Traceability</h2>
    <div class="kv-grid">
      <div class="kv"><div class="kv-label">Git Commit</div>
           <div class="kv-value mono">{pkg["manifest"]["git_commit_hash"][:16]}…</div></div>
      <div class="kv"><div class="kv-label">Branch</div>
           <div class="kv-value mono">{pkg["manifest"]["git_branch"]}</div></div>
      <div class="kv"><div class="kv-label">Repository</div>
           <div class="kv-value">{pkg["manifest"]["repository_name"]}</div></div>
      <div class="kv"><div class="kv-label">Lifecycle</div>
           <div class="kv-value">{pkg["manifest"]["lifecycle_state"]}</div></div>
    </div>
  </div>
</div>

<footer>
  PSEE.RECONCILE.1.WP-14 &nbsp;·&nbsp; stream: PSEE.RECONCILE.1.WP-13 &nbsp;·&nbsp;
  client: {client_uuid} &nbsp;·&nbsp; run: {run_id}
</footer>

<script>
function showTab(name) {{
  document.querySelectorAll('.tab').forEach(function(t) {{ t.classList.remove('active'); }});
  document.querySelectorAll('.panel').forEach(function(p) {{ p.classList.remove('active'); }});
  document.querySelector('#tab-' + name).classList.add('active');
  var tabs = document.querySelectorAll('.tab');
  var order = ['entry','guided','operator'];
  tabs[order.indexOf(name)].classList.add('active');
}}
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
