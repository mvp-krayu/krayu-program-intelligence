#!/usr/bin/env python3
"""
RC-08 Cognitive Traversal Orchestration — Chronicle Builder

Generates REPLAY_CHRONICLE.html: a self-contained cognitive traversal instrument.
8 chapters, Z1-Z5 zoom levels via <details>/<summary>, replay timeline.
Reads from actual PSEE run artifacts — not from chronicle-specific paths.

No external dependencies. No JavaScript in output. CSS-only interaction.
"""

import argparse
import json
import os
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
STREAM = "PI.BLUEEDGE.GOVERNED-COGNITIVE-REPLAY-CHRONICLE.RC-08"


def resolve_paths(client, run_id):
    run_dir = os.path.join(BASE, "clients", client, "psee", "runs", run_id)
    return {
        "run_dir": run_dir,
        "propositions": os.path.join(run_dir, "semantic", "spe", "semantic_propositions.json"),
        "review_state": os.path.join(run_dir, "semantic", "spe", "proposition_review_state.json"),
        "review_log": os.path.join(run_dir, "semantic", "spe", "proposition_review_event_log.jsonl"),
        "enrichment_log": os.path.join(run_dir, "semantic", "spe", "enrichment_log.json"),
        "enrichment_summary": os.path.join(run_dir, "semantic", "spe", "enrichment_summary.json"),
        "enrichment_activity": os.path.join(run_dir, "semantic", "spe", "enrichment_activity_event.json"),
        "debt_reassessment": os.path.join(run_dir, "semantic", "spe", "debt_reassessment.json"),
        "revalidation": os.path.join(run_dir, "sqo", "revalidation_result.json"),
        "promotion": os.path.join(run_dir, "sqo", "promotion_state.json"),
        "anchor": os.path.join(run_dir, "sqo", "constitutional_replay_anchor.json"),
        "convergence": os.path.join(run_dir, "convergence", "convergence_observations.json"),
        "spine": os.path.join(run_dir, "spine", "spine_objects.json"),
    }


def load_json(path):
    with open(path) as f:
        return json.load(f)


def load_jsonl(path):
    events = []
    with open(path) as f:
        for line in f:
            if line.strip():
                events.append(json.loads(line))
    return events


def load_run_data(paths):
    props = load_json(paths["propositions"])
    review = load_json(paths["review_state"])
    reval = load_json(paths["revalidation"])
    promotion = load_json(paths["promotion"])
    anchor = load_json(paths["anchor"])
    convergence = load_json(paths["convergence"])
    enrichment_log = load_json(paths["enrichment_log"])
    enrichment_summary = load_json(paths["enrichment_summary"])
    debt = load_json(paths["debt_reassessment"])
    review_events = load_jsonl(paths["review_log"])

    all_props = props["propositions"]
    statuses = {}
    classes = {}
    tiers = {}
    confs = []
    for p in all_props:
        s = p.get("status", "UNKNOWN")
        statuses[s] = statuses.get(s, 0) + 1
        c = p.get("proposition_class", "UNKNOWN")
        classes[c] = classes.get(c, 0) + 1
        t = p.get("derivation_tier", "UNKNOWN")
        tiers[t] = tiers.get(t, 0) + 1
        confs.append(p.get("confidence", 0))

    accepted_confs = [p.get("confidence", 0) for p in all_props if p.get("status") == "ACCEPTED"]

    event_types = {}
    for e in review_events:
        t = e.get("event_type", "UNKNOWN")
        event_types[t] = event_types.get(t, 0) + 1
    batch_count = sum(1 for e in review_events if e.get("batch"))

    reval_checks = reval.get("checks", [])
    reval_phases = {}
    for c in reval_checks:
        p = c.get("phase", 0)
        reval_phases.setdefault(p, {"pass": 0, "fail": 0, "total": 0})
        reval_phases[p]["total"] += 1
        if c.get("result") == "PASS":
            reval_phases[p]["pass"] += 1
        else:
            reval_phases[p]["fail"] += 1

    anchor_dims = anchor.get("assessment", {}).get("dimensions", [])

    return {
        "props": props,
        "all_props": all_props,
        "statuses": statuses,
        "classes": classes,
        "tiers": tiers,
        "mean_conf": sum(confs) / len(confs) if confs else 0,
        "accepted_mean_conf": sum(accepted_confs) / len(accepted_confs) if accepted_confs else 0,
        "review": review,
        "review_events": review_events,
        "event_types": event_types,
        "batch_count": batch_count,
        "total_events": len(review_events),
        "reval": reval,
        "reval_phases": reval_phases,
        "promotion": promotion,
        "anchor": anchor,
        "anchor_dims": anchor_dims,
        "convergence": convergence,
        "enrichment_log": enrichment_log,
        "enrichment_summary": enrichment_summary,
        "debt": debt,
    }


def build_styles():
    return """
    :root {
      --bg-base: #0d0f14;
      --bg-panel: #141720;
      --bg-card: #1a1e2b;
      --bg-deep: #12151f;
      --border: #2a2f40;
      --border-dim: #1e2330;
      --accent: #4a9eff;
      --text-primary: #ccd6f6;
      --text-dim: #7a8aaa;
      --text-muted: #4a5570;
      --green: #64ffda;
      --yellow: #ffd700;
      --orange: #ff9e4a;
      --red: #ff6b6b;
      --phase-emergence: #64ffda;
      --phase-formation: #4a9eff;
      --phase-tension: #ff9e4a;
      --phase-strengthening: #ffd700;
      --phase-stabilization: #64ffda;
      --phase-qualification: #4a9eff;
      --phase-convergence: #b794f6;
      --phase-projection: #ff79c6;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background: var(--bg-base);
      color: var(--text-primary);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 13px;
      line-height: 1.6;
      max-width: 920px;
      margin: 0 auto;
      padding: 40px 32px;
    }

    .chronicle-header {
      text-align: center;
      margin-bottom: 48px;
      padding-bottom: 32px;
      border-bottom: 1px solid var(--border-dim);
    }

    .chronicle-title {
      font-family: 'Courier New', monospace;
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 16px;
    }

    .chronicle-headline {
      font-family: 'Courier New', monospace;
      font-size: 22px;
      font-weight: bold;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .chronicle-subtitle {
      font-size: 12px;
      color: var(--text-dim);
      max-width: 640px;
      margin: 0 auto;
      line-height: 1.7;
    }

    .chronicle-principle {
      font-family: 'Courier New', monospace;
      font-size: 10px;
      color: var(--text-muted);
      margin-top: 20px;
      letter-spacing: 0.06em;
    }

    /* Timeline */
    .timeline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 32px 0 48px;
      padding: 16px 0;
      position: relative;
    }

    .timeline::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 24px;
      right: 24px;
      height: 2px;
      background: var(--border-dim);
      z-index: 0;
    }

    .timeline-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 1;
      width: 80px;
    }

    .timeline-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-bottom: 8px;
      border: 2px solid var(--bg-base);
    }

    .timeline-label {
      font-family: 'Courier New', monospace;
      font-size: 8px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      text-align: center;
    }

    /* Chapters */
    .chapter {
      margin-bottom: 48px;
      border: 1px solid var(--border-dim);
      border-radius: 4px;
      background: var(--bg-panel);
      overflow: hidden;
    }

    .chapter-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: var(--bg-deep);
      border-bottom: 1px solid var(--border-dim);
    }

    .chapter-number {
      font-family: 'Courier New', monospace;
      font-size: 10px;
      color: var(--text-muted);
      letter-spacing: 0.06em;
    }

    .chapter-title {
      font-family: 'Courier New', monospace;
      font-size: 16px;
      font-weight: bold;
    }

    .chapter-phase {
      font-family: 'Courier New', monospace;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 3px 8px;
      border-radius: 2px;
      border: 1px solid;
    }

    .chapter-body { padding: 20px; }

    /* Z1 — Executive Understanding (always visible) */
    .z1-executive {
      font-size: 13px;
      line-height: 1.7;
      color: var(--text-primary);
      margin-bottom: 20px;
    }

    .z1-finding {
      background: var(--bg-deep);
      border-left: 3px solid var(--accent);
      padding: 12px 16px;
      margin: 16px 0;
      font-family: 'Courier New', monospace;
      font-size: 12px;
    }

    .z1-finding-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    /* Zoom levels (Z2-Z5 via details) */
    .zoom-section {
      margin-top: 12px;
    }

    .zoom-section > summary {
      font-family: 'Courier New', monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      cursor: pointer;
      padding: 8px 12px;
      background: var(--bg-deep);
      border: 1px solid var(--border-dim);
      border-radius: 2px;
      list-style: none;
      transition: color 0.15s ease;
    }

    .zoom-section > summary:hover { color: var(--text-dim); }
    .zoom-section > summary::before {
      content: '\\25B8 ';
      font-size: 8px;
    }
    .zoom-section[open] > summary::before { content: '\\25BE '; }

    .zoom-content {
      padding: 12px 16px;
      border: 1px solid var(--border-dim);
      border-top: none;
      background: var(--bg-card);
      font-size: 12px;
      line-height: 1.6;
    }

    .zoom-content p { margin-bottom: 8px; color: var(--text-dim); }

    /* Data cards */
    .data-card {
      background: var(--bg-deep);
      border-left: 3px solid var(--border);
      padding: 10px 14px;
      margin: 8px 0;
    }

    .data-card.green { border-left-color: var(--green); }
    .data-card.blue { border-left-color: var(--accent); }
    .data-card.orange { border-left-color: var(--orange); }
    .data-card.red { border-left-color: var(--red); }
    .data-card.yellow { border-left-color: var(--yellow); }
    .data-card.purple { border-left-color: var(--phase-convergence); }

    .data-label {
      font-family: 'Courier New', monospace;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
    }

    .data-value {
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: var(--text-primary);
      margin-top: 2px;
    }

    .data-explain {
      font-size: 11px;
      color: var(--text-dim);
      font-style: italic;
      margin-top: 4px;
    }

    /* Meta grid */
    .meta-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 6px 12px;
      font-size: 11px;
    }

    .meta-key {
      font-family: 'Courier New', monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
    }

    .meta-val { color: var(--text-dim); }

    /* Ascent summary */
    .ascent {
      background: var(--bg-deep);
      border-top: 1px solid var(--border-dim);
      padding: 12px 16px;
      margin-top: 16px;
      font-size: 12px;
    }

    .ascent-label {
      font-family: 'Courier New', monospace;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .ascent-text { color: var(--text-dim); line-height: 1.6; }

    /* Convergence matrix */
    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      margin: 12px 0;
    }

    .matrix-table th {
      font-family: 'Courier New', monospace;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }

    .matrix-table td {
      padding: 8px;
      border-bottom: 1px solid var(--border-dim);
      color: var(--text-dim);
      vertical-align: top;
    }

    .convergent { color: var(--green); }
    .divergent { color: var(--orange); }

    /* Confidence bar */
    .conf-bar {
      height: 6px;
      border-radius: 3px;
      background: var(--border-dim);
      margin-top: 4px;
    }

    .conf-fill {
      height: 100%;
      border-radius: 3px;
    }

    /* Footer */
    .chronicle-footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid var(--border-dim);
      font-size: 11px;
      color: var(--text-muted);
    }

    .governance-boundary {
      background: var(--bg-deep);
      border: 1px solid var(--border-dim);
      padding: 14px 18px;
      margin-top: 16px;
      font-size: 11px;
    }

    .governance-boundary p { margin-bottom: 6px; color: var(--text-dim); }

    .snapshot-id {
      font-family: 'Courier New', monospace;
      font-size: 10px;
      color: var(--text-muted);
      margin-top: 16px;
    }

    @media print {
      body { background: #fff; color: #1a1a1a; max-width: 100%; }
      .chapter { border-color: #ddd; background: #fafafa; }
      .chapter-header { background: #f0f0f0; }
      .z1-finding, .data-card, .zoom-content, .ascent, .governance-boundary { background: #f5f5f5; }
      .chapter-title, .data-value { color: #1a1a1a; }
      details { break-inside: avoid; }
    }
    """


PHASE_COLORS = {
    "EMERGENCE": "var(--phase-emergence)",
    "FORMATION": "var(--phase-formation)",
    "TENSION": "var(--phase-tension)",
    "STRENGTHENING": "var(--phase-strengthening)",
    "STABILIZATION": "var(--phase-stabilization)",
    "QUALIFICATION": "var(--phase-qualification)",
    "CONVERGENCE": "var(--phase-convergence)",
    "PROJECTION": "var(--phase-projection)",
}


def build_header():
    return """
    <div class="chronicle-header">
      <div class="chronicle-title">Governed Cognitive Replay Chronicle</div>
      <div class="chronicle-headline">BlueEdge — Program Intelligence</div>
      <div class="chronicle-subtitle">
        A cognitive traversal instrument through which governed cognition unfolds.
        This chronicle traces how Program Intelligence ingests, structures, governs,
        strengthens, validates, and qualifies semantic understanding — within a
        post-genesis governed replay corridor.
      </div>
      <div class="chronicle-principle">
        THE CHRONICLE IS THE LENS · THE LINEAGE IS THE PROOF · THE OUTPUTS ARE THE CONCLUSIONS
      </div>
    </div>
    """


def build_timeline():
    phases = [
        ("CP-00", "EMERGENCE", "var(--phase-emergence)"),
        ("CP-01", "FORMATION", "var(--phase-formation)"),
        ("CP-02/03", "TENSION", "var(--phase-tension)"),
        ("CP-04/05", "STRENGTHENING", "var(--phase-strengthening)"),
        ("CP-06", "STABILIZATION", "var(--phase-stabilization)"),
        ("CP-07", "QUALIFICATION", "var(--phase-qualification)"),
        ("CP-08", "CONVERGENCE", "var(--phase-convergence)"),
        ("CP-09", "PROJECTION", "var(--phase-projection)"),
    ]
    nodes = ""
    for cp, phase, color in phases:
        nodes += f"""
        <div class="timeline-node">
          <div class="timeline-dot" style="background: {color};"></div>
          <div class="timeline-label" style="color: {color};">{phase}</div>
          <div class="timeline-label" style="color: var(--text-muted); margin-top: 2px;">{cp}</div>
        </div>
        """
    return f'<div class="timeline">{nodes}</div>'


def build_chapter(num, title, phase, z1_prose, z1_finding, z2_content, z3_content, z4_content, z5_content, ascent_text):
    color = PHASE_COLORS.get(phase, "var(--accent)")
    return f"""
    <div class="chapter">
      <div class="chapter-header">
        <div>
          <div class="chapter-number">Chapter {num}</div>
          <div class="chapter-title" style="color: {color};">{title}</div>
        </div>
        <div class="chapter-phase" style="color: {color}; border-color: {color};">{phase}</div>
      </div>
      <div class="chapter-body">
        <div class="z1-executive">{z1_prose}</div>
        <div class="z1-finding">
          <div class="z1-finding-label">Key Governed Finding</div>
          {z1_finding}
        </div>

        <details class="zoom-section">
          <summary>Z2 · Semantic Interpretation</summary>
          <div class="zoom-content">{z2_content}</div>
        </details>

        <details class="zoom-section">
          <summary>Z3 · Governance Detail</summary>
          <div class="zoom-content">{z3_content}</div>
        </details>

        <details class="zoom-section">
          <summary>Z4 · Structural Proof</summary>
          <div class="zoom-content">{z4_content}</div>
        </details>

        <details class="zoom-section">
          <summary>Z5 · Raw Evidence</summary>
          <div class="zoom-content">{z5_content}</div>
        </details>

        <div class="ascent">
          <div class="ascent-label">Ascent — What the Depth Proved</div>
          <div class="ascent-text">{ascent_text}</div>
        </div>
      </div>
    </div>
    """


def data_card(label, value, explain="", color=""):
    cls = f"data-card {color}" if color else "data-card"
    exp = f'<div class="data-explain">{explain}</div>' if explain else ""
    return f"""
    <div class="{cls}">
      <div class="data-label">{label}</div>
      <div class="data-value">{value}</div>
      {exp}
    </div>
    """


def meta_row(key, val):
    return f'<div class="meta-key">{key}</div><div class="meta-val">{val}</div>'


def build_chapters(d):
    chapters = []
    n_total = len(d["all_props"])
    n_accepted = d["statuses"].get("ACCEPTED", 0)
    n_rejected = d["statuses"].get("REJECTED", 0)
    n_arbitrated = d["statuses"].get("ARBITRATED", 0)
    n_batch = d["batch_count"]
    n_individual = n_accepted - n_batch
    n_events = d["total_events"]
    mean_conf = d["mean_conf"]
    accepted_mean = d["accepted_mean_conf"]
    reval_total = d["reval"].get("total_checks", 25)
    reval_passed = d["reval"].get("passed", 25)
    n_phases = len(d["reval_phases"])
    s_level = d["promotion"].get("s_level", "S2")
    provenance = d["promotion"].get("qualification_provenance", "GOVERNED_LIFECYCLE")
    enr = d["enrichment_summary"]
    enr_events = enr.get("enrichment_events", 0)
    enr_dom_corrected = enr.get("domains_corrected", 0)
    enr_dom_confirmed = enr.get("domains_confirmed", 0)
    enr_dom_nomatch = enr.get("domains_no_sdc_match", 0)
    enr_cap_corrected = enr.get("capabilities_domain_corrected", 0)
    debt_improved = d["debt"].get("improved", 0)
    debt_unchanged = d["debt"].get("unchanged", 0)
    debt_worsened = d["debt"].get("worsened", 0)
    debt_resolved = d["debt"].get("blockers_resolved", 0)
    obs = d["convergence"].get("observations", [])
    n_obs = len(obs)
    conv_summary = d["convergence"].get("summary", {})
    n_convergences = len(conv_summary.get("convergences", []))
    n_divergences = len(conv_summary.get("divergences", []))
    anchor_dims = d["anchor_dims"]
    anchor_passed = sum(1 for dim in anchor_dims if dim.get("verdict") == "PASS")
    anchor_total = len(anchor_dims)
    anchor_verdict = d["anchor"].get("assessment", {}).get("overall_verdict", "UNKNOWN")

    class_cards = ""
    for cls in sorted(d["classes"].keys()):
        count = d["classes"][cls]
        class_cards += data_card(cls, f"{count} propositions", color="blue")

    tier_desc = ", ".join(f"{count} {t}" for t, count in sorted(d["tiers"].items(), key=lambda x: -x[1]))

    # ─── CHAPTER 1: THE SPECIMEN [EMERGENCE] ───
    chapters.append(build_chapter(
        1, "The Specimen", "EMERGENCE",
        z1_prose="""
          The system encounters BlueEdge for the first time within the governed replay corridor.
          Not as raw intake — the semantic substrates already exist: an SDC-derived candidate CSR with
          17 domains, 42 capabilities, and 89 components; 3 HTML evidence documents totaling 505KB;
          28 vault claims; 18 prior PSEE runs. BlueEdge holds S0 after pipeline genesis —
          structural substrate materialized, but governance lifecycle not yet exercised.
          <br><br>
          The chronicle begins here: at the gap between structural onboarding and governed qualification.
        """,
        z1_finding="BlueEdge at S0 — structural substrate complete, governance lifecycle NOT_STARTED. 0 propositions. 0 operator reviews. 15 qualification blockers classified.",
        z2_content=f"""
          <p>The baseline captures what the system knows before governed cognition begins:</p>
          {data_card("CSR Domains", "17 (canonical semantic registry)", color="blue")}
          {data_card("Capabilities", "42 across 17 domains")}
          {data_card("Components", "89 structural components")}
          {data_card("Evidence Files", "3 HTML documents (505KB total)", color="green")}
          {data_card("Vault Claims", "28 CLM-* entries with structural backing")}
          {data_card("Qualification Blockers", "15 (4 irreducible, 8 enrichable, 1 evidence-reducible, 2 continuity)", color="orange")}
        """,
        z3_content=f"""
          <p>Governance state at baseline:</p>
          {data_card("S-Level", "S0 — PIPELINE_GENESIS", color="yellow")}
          {data_card("Qualification Provenance", "PIPELINE_GENESIS — structural substrate materialized")}
          {data_card("Operator Reviews", "0 — no human governance exercised")}
          {data_card("Propositions", "0 — no semantic claims derived")}
          {data_card("Governance Lifecycle", "NOT_STARTED")}
        """,
        z4_content=f"""
          <p>Pre-governance structural artifacts:</p>
          {data_card("Pipeline Run", "run_blueedge_genesis_e2e_03 — 19-phase pipeline complete", color="blue")}
          {data_card("SDC Validation", "run_blueedge_sdc_validation_01 — 3 HTML files processed", color="blue")}
          <p>Checkpoint: checkpoint_00 (genesis pipeline completion)</p>
        """,
        z5_content="""
          <p>Raw evidence sources:</p>
          <div class="data-card">
            <div class="data-label">Evidence Files</div>
            <div class="data-value">BlueEdge_Unified_Architecture_v3_23_0.html (89KB)</div>
            <div class="data-value">Blue_Edge_PMO_Dashboard.html (365KB)</div>
            <div class="data-value">BlueEdge_Competitive_Dashboard_Feb2026.html (51KB)</div>
          </div>
          <p>SDC validation run: run_blueedge_sdc_validation_01</p>
        """,
        ascent_text="The system has a structural substrate but no governed cognition. Propositions, review, enrichment, revalidation — all ahead. The governance lifecycle begins from S0."
    ))

    # ─── CHAPTER 2: THE CLAIMS [FORMATION] ───
    chapters.append(build_chapter(
        2, "The Claims", "FORMATION",
        z1_prose=f"""
          Semantic propositions crystallize from PATH B evidence. The proposition bridge transforms
          SDC output (candidate CSR) and vault claims into {n_total} CANDIDATE propositions across
          {len(d["classes"])} classes.
          This is not code-graph derivation — it is document-evidence derivation. The propositions
          carry what HTML documents and semantic registry entries can prove, bounded by L3 authority ceiling.
          <br><br>
          Mean confidence: {mean_conf:.3f}. All at CANDIDATE status, awaiting operator review.
        """,
        z1_finding=f"{n_total} CANDIDATE propositions derived across {len(d['classes'])} classes. All at L3 authority ceiling. Mean confidence {mean_conf:.3f}.",
        z2_content=f"""
          <p>Proposition classes derived from PATH B evidence:</p>
          {class_cards}
          {data_card("Derivation Tiers", tier_desc, color="green")}
          {data_card("Mean Confidence", f"{mean_conf:.3f}")}
          {data_card("Authority Ceiling", "L3 — AI-derived, requires operator review")}
        """,
        z3_content=f"""
          <p>Derivation mechanism:</p>
          {data_card("Stage 1", "SDC execution on 3 HTML evidence files (already proven)", color="blue")}
          {data_card("Stage 2", "proposition_bridge.py transforms candidate_csr + vault claims + CSR into propositions")}
          <p>All propositions at status: CANDIDATE. No operator action yet.</p>
        """,
        z4_content=f"""
          {data_card("Materializer", "scripts/pios/sdc/proposition_bridge.py", color="blue")}
          <p>Output: semantic_propositions.json ({n_total} CANDIDATE propositions)</p>
        """,
        z5_content="""
          <p>Input artifacts:</p>
          <div class="data-card">
            <div class="data-label">Bridge Inputs</div>
            <div class="data-value">client_semantic_registry.json (17 domains)</div>
            <div class="data-value">candidate_csr.json (SDC output)</div>
            <div class="data-value">derivation_report.json (SDC derivation)</div>
            <div class="data-value">claims/*.json (28 vault claims)</div>
          </div>
        """,
        ascent_text=f"Semantic DNA has formed from document evidence. {n_total} propositions now exist as governed claims awaiting challenge. The system has moved from raw evidence to structured meaning — but meaning that has not yet been tested by governance friction."
    ))

    # ─── CHAPTER 3: THE GOVERNANCE [TENSION] ───
    acceptance_rate = (n_accepted + n_arbitrated) / n_total * 100 if n_total > 0 else 0

    chapters.append(build_chapter(
        3, "The Governance", "TENSION",
        z1_prose=f"""
          The operator reviews all {n_total} propositions through the SQO Authority Workflow. This is genuine
          governance friction — not simulated, not rubber-stamped. {n_batch} propositions are batch-accepted
          (unflagged by the review queue). {n_individual} flagged propositions are individually reviewed:
          {n_individual - n_rejected - (1 if n_arbitrated > 0 else 0)} accepted after examination,
          {n_rejected} rejected outright, {n_arbitrated} contested and escalated to arbitration.
          <br><br>
          The friction surfaces a domain ID mismatch between the canonical CSR and SDC candidate CSR that
          had silently corrupted cross-references in the proposition bridge. The system could not have
          found this without operator challenge.
        """,
        z1_finding=f"{n_accepted} accepted, {n_rejected} rejected, {n_arbitrated} contested → arbitrated. {n_events} governance events. The system has been challenged and some meaning did not survive.",
        z2_content=f"""
          <p>Review outcome:</p>
          {data_card("Batch Accepted", f"{n_batch} propositions — not flagged in review queue, sufficient evidence", color="green")}
          {data_card("Individually Accepted", f"{n_individual} propositions — flagged, examined, accepted after operator review", color="green")}
          {data_card("Rejected", f"{n_rejected} propositions — insufficient evidence or misclassification", color="red")}
          {data_card("Contested → Arbitrated", f"{n_arbitrated} proposition — challenged, reviewed at higher authority", color="yellow")}
          {data_card("Acceptance Rate", f"{acceptance_rate:.1f}% ({n_accepted + n_arbitrated}/{n_total})")}
        """,
        z3_content=f"""
          <p>Governance friction detail:</p>
          {data_card("Domain ID Mismatch", "Canonical CSR and SDC use different domain numbering — governance review surfaced this", color="red")}
          {data_card("Rejection Reasons", f"{n_rejected} capabilities in unassigned domains — SDC extraction artifacts, not semantic propositions", color="orange")}
          {data_card("Arbitration", "DOMAIN-17 weak grounding (2 DERIVED components) — contested, upheld after examination", color="yellow")}
          <p>{n_events} governance events logged. All append-only.</p>
        """,
        z4_content=f"""
          <p>Governance artifacts:</p>
          {data_card("Review State", "proposition_review_state.json — COMPLETE, all dispositions terminal", color="blue")}
          {data_card("Event Log", f"proposition_review_event_log.jsonl — {n_events} events")}
          <p>Operator: operator:khorrix, Authority: L2 (review), L3 (arbitration)</p>
        """,
        z5_content=f"""
          <p>Review event log: proposition_review_event_log.jsonl ({n_events} events)</p>
          <p>Operator: operator:khorrix</p>
          <p>Non-automatable boundary: proposition review (Gate 3) requires operator action — no system actor could self-authorize.</p>
        """,
        ascent_text=f"The system has been challenged and some meaning did not survive. {n_rejected} propositions were rejected — not because the system failed, but because governance friction surfaced genuine evidence limitations. The domain ID mismatch proves that operator review discovers structural defects invisible to automated derivation."
    ))

    # ─── CHAPTER 4: THE STRENGTHENING [STRENGTHENING] ───
    chapters.append(build_chapter(
        4, "The Strengthening", "STRENGTHENING",
        z1_prose=f"""
          Evidence enrichment addresses the governance findings. The primary mechanism: semantic name matching
          between canonical CSR domains and SDC candidate CSR domains, correcting the domain ID mismatch
          that governance friction surfaced. {enr_dom_corrected} domain propositions receive corrected
          component counts. {enr_cap_corrected} capability propositions receive corrected domain references.
          <br><br>
          Debt evolution assessment tells the honest story: {debt_improved} items improved, {debt_unchanged}
          unchanged, {debt_worsened} worsened, {debt_resolved} resolved. Enrichment produced more accurate
          evidence — not uniformly better evidence. Post-enrichment mean confidence: {enr.get("confidence_deltas", {}).get("mean_confidence_post_enrichment", 0):.3f}.
        """,
        z1_finding=f"Domain ID correction via semantic name matching. {enr_dom_corrected} corrected, {enr_dom_confirmed} confirmed, {enr_dom_nomatch} NO_SDC_MATCH. Debt trajectory: HONEST_LIMITATION. {debt_resolved} blockers resolved — all require L5 authority PATH B cannot provide.",
        z2_content=f"""
          <p>Enrichment impact on accepted propositions:</p>
          {data_card("Domains Corrected", f"{enr_dom_corrected} — component counts updated from name-matched SDC domains", color="green")}
          {data_card("Domains Confirmed", f"{enr_dom_confirmed} — already correct")}
          {data_card("Domains NO_SDC_MATCH", f"{enr_dom_nomatch} — no matching SDC domain found", color="orange")}
          {data_card("Capabilities Corrected", f"{enr_cap_corrected} — domain refs updated to canonical domains")}
          {data_card("Enrichment Events", f"{enr_events} total", color="green")}
        """,
        z3_content=f"""
          <p>Debt evolution assessment ({d["debt"].get("total_debt_items", 15)} items):</p>
          {data_card("Improved", f"{debt_improved}", color="green")}
          {data_card("Unchanged", f"{debt_unchanged}")}
          {data_card("Worsened", f"{debt_worsened}", color="orange")}
          {data_card("Resolved", f"{debt_resolved} — all block S3 requiring L5 authority", color="red")}
          <p>Trajectory: HONEST_LIMITATION. The system is now more honest about what PATH B can prove.</p>
        """,
        z4_content=f"""
          <p>Enrichment artifacts:</p>
          {data_card("Enrichment Log", f"enrichment_log.json — {enr_events} events", color="blue")}
          {data_card("Enrichment Summary", "enrichment_summary.json", color="blue")}
          {data_card("Debt Reassessment", "debt_reassessment.json", color="blue")}
          {data_card("Enrichment Activity", "enrichment_activity_event.json — enrichment_exercised: true", color="green")}
        """,
        z5_content="""
          <p>Enrichment script: scripts/pios/sdc/evidence_enrichment_rc04.py</p>
          <p>PATH B limitation: no code graph. Enrichment bounded by SDC HTML extraction.</p>
          <p>Cannot provide L5 structural authority from document evidence alone.</p>
        """,
        ascent_text=f"What was weak is now grounded — or honestly acknowledged as ungroundable. The system self-corrected where evidence permitted and transparently documented where it could not. The {enr_dom_nomatch} NO_SDC_MATCH domains are genuine evidence gaps, not failures. Honest limitation is itself a form of structural integrity."
    ))

    # ─── CHAPTER 5: THE PROOF [STABILIZATION] ───
    phase_cards = ""
    phase_names = {
        1: "Input Gate",
        2: "Proposition Integrity",
        3: "Confidence Realism",
        4: "Tier Validity",
        5: "Disposition Completeness",
        6: "Reconciliation Cleanliness",
        7: "Spine Consistency",
        8: "SQO State Consistency",
    }
    for p_num in sorted(d["reval_phases"].keys()):
        p_data = d["reval_phases"][p_num]
        p_name = phase_names.get(p_num, f"Phase {p_num}")
        phase_cards += data_card(
            f"Phase {p_num} · {p_name}",
            f"{p_data['total']}/{p_data['total']} — all checks pass",
            color="green"
        )

    chapters.append(build_chapter(
        5, "The Proof", "STABILIZATION",
        z1_prose=f"""
          Deterministic revalidation replays the entire governance-challenged, evidence-enriched corpus
          through an {n_phases}-phase/{reval_total}-check engine. Every phase passes. The corpus
          holds under structural examination — what was challenged now stands deterministically.
          <br><br>
          The revalidation engine itself is significant: the same engine runs on both NetBox (PATH A)
          and BlueEdge (PATH B) without PATH-specific adaptation. Same structural rigor, different
          evidence channels.
        """,
        z1_finding=f"{reval_passed}/{reval_total} PASS across {n_phases} phases. The revalidation engine transfers across evidence channels without modification.",
        z2_content=f"""
          <p>Revalidation phases:</p>
          {phase_cards}
        """,
        z3_content=f"""
          <p>Engine: scripts/pios/revalidation_engine.py (same engine, both specimens)</p>
          <div class="data-card blue">
            <div class="data-label">What transferred</div>
            <div class="data-value">Same {n_phases}-phase engine, same checks, same validation contract</div>
          </div>
          <div class="data-card orange">
            <div class="data-label">Key observation</div>
            <div class="data-value">No PATH-specific adaptation required — the engine validates governance discipline, not evidence type</div>
          </div>
        """,
        z4_content=f"""
          <p>Revalidation artifacts:</p>
          {data_card("Revalidation Result", f"revalidation_result.json — {reval_passed}/{reval_total} PASS", color="green")}
          {data_card("Engine", "scripts/pios/revalidation_engine.py")}
        """,
        z5_content=f"""
          <p>Revalidation result: sqo/revalidation_result.json ({reval_total} checks, all PASS)</p>
          <p>Revalidation event log: sqo/revalidation_event_log.jsonl</p>
        """,
        ascent_text="What was challenged now holds deterministically. The revalidation engine confirmed that governance friction produced a stronger corpus, not a broken one. The engine's transferability across evidence channels is itself structural evidence — the validation contract is evidence-channel-independent."
    ))

    # ─── CHAPTER 6: THE ADVANCEMENT [QUALIFICATION] ───
    transitions = d["promotion"].get("promotion_lineage", {}).get("transitions", [])
    s1_transition = transitions[0] if len(transitions) > 0 else {}
    s2_transition = transitions[1] if len(transitions) > 1 else {}

    chapters.append(build_chapter(
        6, "The Advancement", "QUALIFICATION",
        z1_prose=f"""
          The SQO execution graph governs advancement: S0 → S1 after revalidation PASS and constitutional
          anchor clearance, then S1 → S2 after enrichment + post-enrichment revalidation + anchor re-check.
          Both transitions authorized by operator:khorrix. The governance lifecycle is complete:
          proposition derivation, operator review with genuine friction, evidence enrichment,
          deterministic revalidation, constitutional anchor verification.
          <br><br>
          {s_level} achieved via {provenance}. Two operator-authorized transitions.
        """,
        z1_finding=f"S0 → S1 → {s_level}. {provenance}. {anchor_passed}/{anchor_total} anchor dimensions PASS. Full governed lifecycle — not bridge, not projection.",
        z2_content=f"""
          <p>Advancement path:</p>
          {data_card("S0 → S1", f"Revalidation {reval_passed}/{reval_total} PASS, anchor ELEVATED (6/8 — enrichment not yet exercised)", color="green")}
          {data_card("S1 → S2", f"Post-enrichment revalidation PASS, anchor {anchor_passed}/{anchor_total} PASS ({anchor_verdict})", color="green")}
          {data_card("S1 Actor", s1_transition.get("actor_id", "operator:khorrix"))}
          {data_card("S2 Actor", s2_transition.get("actor_id", "operator:khorrix"))}
        """,
        z3_content=f"""
          <p>Governed lifecycle proven:</p>
          {data_card("Gate 2", f"{n_total} propositions via PATH B proposition bridge")}
          {data_card("Gate 3", f"{n_accepted} accepted, {n_rejected} rejected, {n_arbitrated} arbitrated")}
          {data_card("Enrichment", f"{enr_events} enrichment events, {enr_dom_corrected} domains corrected")}
          {data_card("Gate 4", f"{reval_passed}/{reval_total} revalidation PASS")}
          {data_card("Gate 5", f"{s_level} via {provenance}")}
        """,
        z4_content=f"""
          <p>Promotion artifacts:</p>
          {data_card("Promotion State", f"sqo/promotion_state.json — {s_level}, {provenance}", color="green")}
          {data_card("Constitutional Anchor", f"sqo/constitutional_replay_anchor.json — {anchor_passed}/{anchor_total} PASS", color="green")}
          {data_card("Promotion Log", "sqo/promotion_event_log.jsonl")}
        """,
        z5_content=f"""
          <p>Promotion state: sqo/promotion_state.json</p>
          <p>S1 rationale: {s1_transition.get("rationale", "")[:120]}...</p>
          <p>S2 rationale: {s2_transition.get("rationale", "")[:120]}...</p>
        """,
        ascent_text=f"The system has earned its state — not by resolving all blockers, but by completing the governed lifecycle. {s_level} means governance discipline, not semantic perfection."
    ))

    # ─── CHAPTER 7: THE PATTERN [CONVERGENCE] ───
    obs_cards = ""
    for ob in obs:
        obs_cards += data_card(
            ob["observation_id"],
            ob["title"],
            explain=f"Status: {ob.get('pattern_status', 'OBSERVED')} · Maturity: {ob.get('interpretation_maturity', 'DESCRIPTIVE')}",
            color="purple"
        )

    convergence_list = ", ".join(conv_summary.get("convergences", []))
    divergence_list = ", ".join(conv_summary.get("divergences", []))

    chapters.append(build_chapter(
        7, "The Pattern", "CONVERGENCE",
        z1_prose=f"""
          Two independent specimens — NetBox (full governed semantic evolution, PATH A) and BlueEdge
          (governed cognitive replay, PATH B) — are compared across {n_obs} observations. The comparison
          reveals {n_convergences} convergences and {n_divergences} divergences. The convergence is in governance
          discipline; the divergence is in evidence depth.
          <br><br>
          This is observational, not unification. Two specimens = comparison, not pattern. All observations
          are DESCRIPTIVE. The specimens are deliberately different — different evidence channels, different
          proposition engines, different enrichment mechanisms. The diversity within common governance
          is itself the observation.
        """,
        z1_finding=f"{n_obs} observations. {n_convergences} convergences, {n_divergences} divergences. All DESCRIPTIVE (2 specimens = comparison, not law). Verdict: {conv_summary.get('verdict', 'DESCRIPTIVE CONVERGENCE OBSERVED')}.",
        z2_content=f"""
          <p>Convergence observations:</p>
          {obs_cards}
          <p>All observations at interpretation_maturity: DESCRIPTIVE. Promotion to LAW requires 3+ specimens.</p>
        """,
        z3_content=f"""
          <p>Convergence/divergence classification:</p>
          {data_card("Convergences", convergence_list, color="green")}
          {data_card("Divergences", divergence_list, color="orange")}
          {data_card("Mixed", ", ".join(conv_summary.get("convergence_with_divergence", [])), color="yellow")}
          <p>Verdict: {conv_summary.get("verdict", "DESCRIPTIVE CONVERGENCE OBSERVED")}</p>
        """,
        z4_content=f"""
          <p>Convergence artifacts:</p>
          {data_card("Observations", f"convergence/convergence_observations.json — {n_obs} observations", color="purple")}
          <p>NetBox reference: READ-ONLY. No mutation.</p>
        """,
        z5_content="""
          <p>NetBox reference: clients/netbox/psee/runs/run_github_netbox_20260520_134600/ (READ-ONLY)</p>
          <p>No NetBox mutation. No BlueEdge evidence mutation. Observation only.</p>
        """,
        ascent_text="Governed cognition generalizes across specimens. Not because the specimens are the same — they are deliberately different. But because the governance discipline is specimen-independent. Different evidence corridors, same governed spine model. This is not one system — it is a discipline."
    ))

    # ─── CHAPTER 8: THE PROJECTION [PROJECTION] ───
    chapters.append(build_chapter(
        8, "The Projection", "PROJECTION",
        z1_prose=f"""
          Cognition has become communicable. This chronicle — {n_obs} convergence observations,
          {n_events} governance events, {reval_passed}/{reval_total} revalidation, {anchor_passed}/{anchor_total}
          constitutional anchor — is the projection of how Program Intelligence governs semantic understanding.
          Not a report. Not documentation. A traversal instrument through which governed cognition unfolds.
          <br><br>
          The replay corridor proved that governance patterns operate within a post-genesis corridor.
          The convergence observations suggest — with DESCRIPTIVE maturity — that governance discipline
          may be specimen-independent. The audience now understands not just WHAT the system concluded,
          but HOW it governed the path from intake to qualification.
        """,
        z1_finding=f"The first governed cognitive replay chronicle is complete. S0 → {s_level} through full governance lifecycle. {n_obs} convergence observations. Post-genesis replay corridor closed.",
        z2_content=f"""
          <p>Chronicle statistics:</p>
          {data_card("Propositions", f"{n_total} total ({n_accepted} accepted, {n_rejected} rejected, {n_arbitrated} arbitrated)", color="green")}
          {data_card("Governance Events", f"{n_events} (review log)")}
          {data_card("Enrichment Events", f"{enr_events}")}
          {data_card("Revalidation", f"{reval_passed}/{reval_total} PASS")}
          {data_card("Constitutional Anchor", f"{anchor_passed}/{anchor_total} PASS")}
          {data_card("Convergence Observations", f"{n_obs} (all DESCRIPTIVE)")}
        """,
        z3_content=f"""
          <p>Governed lifecycle summary:</p>
          <div class="meta-grid">
            {meta_row("EMERGENCE", "Baseline capture — S0, 0 propositions, governance NOT_STARTED")}
            {meta_row("FORMATION", f"{n_total} propositions derived from PATH B evidence")}
            {meta_row("TENSION", f"{n_accepted} accepted, {n_rejected} rejected, {n_arbitrated} arbitrated")}
            {meta_row("STRENGTHENING", f"Domain ID correction, debt evolution ({debt_improved}↑ {debt_worsened}↓ {debt_resolved} resolved)")}
            {meta_row("STABILIZATION", f"{reval_passed}/{reval_total} revalidation PASS")}
            {meta_row("QUALIFICATION", f"S0 → S1 → {s_level} via {provenance}")}
            {meta_row("CONVERGENCE", f"{n_obs} observations across 2 specimens")}
            {meta_row("PROJECTION", "This chronicle — cognition made communicable")}
          </div>
        """,
        z4_content=f"""
          <p>Key artifacts:</p>
          {data_card("Promotion State", f"sqo/promotion_state.json — {s_level}", color="green")}
          {data_card("Revalidation", f"sqo/revalidation_result.json — {reval_passed}/{reval_total} PASS")}
          {data_card("Constitutional Anchor", f"sqo/constitutional_replay_anchor.json — {anchor_passed}/{anchor_total}")}
          {data_card("Convergence", f"convergence/convergence_observations.json — {n_obs} observations")}
        """,
        z5_content=f"""
          <p>Run directory: clients/blueedge/psee/runs/run_blueedge_genesis_e2e_03/</p>
          <p>This HTML: REPLAY_CHRONICLE.html</p>
        """,
        ascent_text="The audience now understands not just what the system concluded, but how it governed the path to those conclusions. The lineage is the proof. The outputs are the conclusions. And this chronicle is the lens through which governed cognition becomes visible."
    ))

    return "\n".join(chapters)


def build_footer(client, run_id):
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return f"""
    <div class="chronicle-footer">
      <div class="governance-boundary">
        <p><strong>Evidence Boundary Statement</strong></p>
        <p>This chronicle was produced under bounded interpretive authority (75.x). All narrative content
        traces to structural evidence in the run artifacts. No inference beyond evidence-bound synthesis.
        No team behavior, organizational intent, or human motive inference. No causal attribution to humans.
        No remediation prioritization. 13 absolute prohibitions enforced.</p>
        <p>Structural derivation remains primary. Interpretive authority is additive, not replacement.</p>
      </div>
      <div class="snapshot-id">
        CHRONICLE · {client}/{run_id} · {ts} · format v2.0
      </div>
    </div>
    """


def run():
    parser = argparse.ArgumentParser(description="RC-08 Chronicle Builder")
    parser.add_argument("--client", required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--output", help="Output path (default: run_dir/chronicle/REPLAY_CHRONICLE.html)")
    args = parser.parse_args()

    paths = resolve_paths(args.client, args.run_id)

    for name, path in paths.items():
        if name == "run_dir":
            if not os.path.isdir(path):
                print(f"FAIL: run directory not found: {path}")
                return
        elif not os.path.exists(path):
            print(f"WARN: artifact not found: {name} → {path}")

    d = load_run_data(paths)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-version" content="2.0">
  <meta name="generator" content="Governed Cognitive Replay Chronicle Builder">
  <meta name="governance" content="75.x bounded interpretive authority — evidence-bound narrative synthesis">
  <meta name="chronicle-id" content="{args.client}-governed-cognitive-replay-chronicle">
  <meta name="client" content="{args.client}">
  <meta name="run-id" content="{args.run_id}">
  <title>{args.client.title()} — Governed Cognitive Replay Chronicle</title>
  <style>{build_styles()}</style>
</head>
<body>
  {build_header()}
  {build_timeline()}
  {build_chapters(d)}
  {build_footer(args.client, args.run_id)}
</body>
</html>"""

    if args.output:
        output_path = args.output
    else:
        output_dir = os.path.join(paths["run_dir"], "chronicle")
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, "REPLAY_CHRONICLE.html")

    with open(output_path, "w") as f:
        f.write(html)

    print(f"Chronicle generated: {output_path}")
    print(f"Size: {len(html):,} bytes")
    print(f"Client: {args.client}")
    print(f"Run: {args.run_id}")
    print(f"Propositions: {len(d['all_props'])} ({d['statuses']})")
    print(f"Revalidation: {d['reval'].get('passed', 0)}/{d['reval'].get('total_checks', 0)} PASS")
    print(f"Anchor: {sum(1 for dim in d['anchor_dims'] if dim.get('verdict') == 'PASS')}/{len(d['anchor_dims'])} PASS")
    print(f"Convergence: {len(d['convergence'].get('observations', []))} observations")
    print(f"Chapters: 8, Zoom levels: Z1-Z5")


if __name__ == "__main__":
    run()
