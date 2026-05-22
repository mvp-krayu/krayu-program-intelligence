#!/usr/bin/env python3
"""
RC-08 Cognitive Traversal Orchestration — Chronicle Builder

Generates REPLAY_CHRONICLE.html: a self-contained cognitive traversal instrument.
8 chapters, Z1-Z5 zoom levels via <details>/<summary>, replay timeline,
convergence matrix. Follows InterrogationTrailBuilder pattern.

No external dependencies. No JavaScript in output. CSS-only interaction.
"""

import json
import os
import hashlib
from datetime import datetime

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
CHRONICLE = os.path.join(BASE, "clients", "blueedge", "chronicle")
TIMESTAMP = "2026-05-23T00:00:00Z"
STREAM = "PI.BLUEEDGE.GOVERNED-COGNITIVE-REPLAY-CHRONICLE.RC-08"


def load(path):
    with open(os.path.join(BASE, path)) as f:
        return json.load(f)


def load_chronicle(path):
    with open(os.path.join(CHRONICLE, path)) as f:
        return json.load(f)


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


def build_chapters(manifest, props, review, governance, enrichment, debt, reval, convergence, spine):
    chapters = []

    # Extract data
    accepted = [p for p in props["propositions"] if p["status"] == "ACCEPTED"]
    rejected = [p for p in props["propositions"] if p["status"] == "REJECTED"]
    mean_conf = sum(p["confidence"] for p in accepted) / len(accepted) if accepted else 0
    findings = governance.get("governance_key_findings", [])

    # ─── CHAPTER 1: THE SPECIMEN [EMERGENCE] ───
    chapters.append(build_chapter(
        1, "The Specimen", "EMERGENCE",
        z1_prose="""
          The system encounters BlueEdge for the first time within the governed replay corridor.
          Not as raw intake — the semantic substrates already exist: an SDC-derived candidate CSR with
          17 domains, 42 capabilities, and 89 components; 3 HTML evidence documents totaling 505KB;
          28 vault claims; 18 prior PSEE runs. BlueEdge holds S2 via a Legacy Qualification Bridge —
          governance projection from system actors, not governed lifecycle.
          <br><br>
          The chronicle begins here: at the gap between projected qualification and governed qualification.
        """,
        z1_finding="BlueEdge S2 via LEGACY_QUALIFICATION_BRIDGE — governance projection, not governed lifecycle. 15 qualification blockers active. 0 propositions. 0 operator reviews.",
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
          {data_card("S-Level", "S2 (via GOVERNANCE_PROJECTION)", color="yellow")}
          {data_card("Qualification Provenance", "LEGACY_QUALIFICATION_BRIDGE — system:pipeline actors")}
          {data_card("Operator Reviews", "0 — no human governance exercised")}
          {data_card("Propositions", "0 — no semantic claims derived")}
          {data_card("Governance Events", "2 — bridge events only (EVT-BRIDGE-001, EVT-BRIDGE-002)")}
        """,
        z4_content=f"""
          <p>Spine objects emitted at baseline:</p>
          {data_card("SPINE-RC01-EO-001", "evidence_object — BASELINE_STATE_CAPTURE", color="blue")}
          {data_card("SPINE-RC01-EP-001", "executive_projection_snapshot — BASELINE_EXECUTIVE_STATE", color="blue")}
          <p>Checkpoint: checkpoint_00_baseline (FROZEN)</p>
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
          <p>Canonical run: run_blueedge_productized_01_fixed</p>
        """,
        ascent_text="The system has encountered a specimen with projected qualification but no governed lifecycle. The gap between bridge S2 and governed S2 is the space this chronicle will traverse."
    ))

    # ─── CHAPTER 2: THE CLAIMS [FORMATION] ───
    by_class = {}
    for p in props["propositions"]:
        c = p["proposition_class"]
        by_class.setdefault(c, []).append(p)

    class_cards = ""
    for cls, items in sorted(by_class.items()):
        class_cards += data_card(cls, f"{len(items)} propositions", color="blue")

    chapters.append(build_chapter(
        2, "The Claims", "FORMATION",
        z1_prose=f"""
          Semantic propositions crystallize from PATH B evidence. The proposition bridge transforms
          SDC output (candidate CSR) and vault claims into 85 CANDIDATE propositions across 4 classes.
          This is not code-graph derivation — it is document-evidence derivation. The propositions
          carry what HTML documents and semantic registry entries can prove, bounded by L3 authority ceiling.
          <br><br>
          Mean confidence: 0.728. All at CANDIDATE status, awaiting operator review.
        """,
        z1_finding=f"85 CANDIDATE propositions derived: 17 domain, 24 capability, 25 vault claim, 19 cross-domain. All at L3 authority ceiling. Mean confidence 0.728.",
        z2_content=f"""
          <p>Proposition classes derived from PATH B evidence:</p>
          {class_cards}
          {data_card("Derivation Tiers", "53 DIRECT_EVIDENCE, 32 DERIVED", color="green")}
          {data_card("Mean Confidence", "0.728")}
          {data_card("Authority Ceiling", "L3 — AI-derived, requires operator review")}
        """,
        z3_content=f"""
          <p>Derivation mechanism:</p>
          {data_card("Stage 1", "SDC execution on 3 HTML evidence files (already proven)", color="blue")}
          {data_card("Stage 2", "proposition_bridge.py transforms candidate_csr + vault claims + CSR into propositions")}
          <p>All propositions at status: CANDIDATE. No operator action yet.</p>
        """,
        z4_content=f"""
          {data_card("SPINE-RC02-SP-001", "semantic_proposition_derivation — PATH_B_PROPOSITION_BRIDGE", color="blue")}
          <p>Checkpoint: checkpoint_01_propositions (FROZEN)</p>
          <p>Bridge script: scripts/pios/sdc/proposition_bridge.py</p>
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
          <p>Output: semantic_propositions.json (85 CANDIDATE propositions)</p>
        """,
        ascent_text="Semantic DNA has formed from document evidence. 85 propositions now exist as governed claims awaiting challenge. The system has moved from raw evidence to structured meaning — but meaning that has not yet been tested by governance friction."
    ))

    # ─── CHAPTER 3: THE GOVERNANCE [TENSION] ───
    rejection_summary = ""
    for cat in governance.get("governance_key_findings", []):
        rejection_summary += data_card(cat.get("finding_id", ""), cat.get("description", ""), color="orange")

    chapters.append(build_chapter(
        3, "The Governance", "TENSION",
        z1_prose=f"""
          The operator reviews all 85 propositions through the SQO Authority Workflow. This is genuine
          governance friction — not simulated, not rubber-stamped. 62 propositions are directly accepted.
          9 are contested, escalated to arbitration, and accepted with annotations. 14 are rejected outright.
          <br><br>
          The friction surfaces 5 governance findings, the most significant being GF-RC03-001: a domain ID
          mismatch between the canonical CSR and SDC candidate CSR that had silently corrupted cross-references
          in the proposition bridge. The system could not have found this without operator challenge.
        """,
        z1_finding=f"71 accepted, 14 rejected. 9 contested → arbitrated. 5 governance findings. The system has been challenged and some meaning did not survive.",
        z2_content=f"""
          <p>Review outcome:</p>
          {data_card("Direct Accept", "62 propositions — sufficient evidence for operational acceptance", color="green")}
          {data_card("Contested → Arbitrated → Accepted", "9 propositions — challenged, reviewed at higher authority, accepted with annotations", color="yellow")}
          {data_card("Rejected", "14 propositions — insufficient evidence, parsing artifacts, or misclassification", color="red")}
          {data_card("Acceptance Rate", "83.5% (71/85)")}
        """,
        z3_content=f"""
          <p>Governance findings surfaced by operator review:</p>
          {data_card("GF-RC03-001 · HIGH", "Domain ID mismatch — canonical CSR and SDC use different domain numbering", color="red")}
          {data_card("GF-RC03-002 · MEDIUM", "SDC parsing artifacts — layer labels promoted to capabilities", color="orange")}
          {data_card("GF-RC03-003 · MEDIUM", "SDC domain overflow — domains beyond canonical 17-domain ontology", color="orange")}
          {data_card("GF-RC03-004 · LOW", "Grounding status conflict — uniform confidence ignoring WEAKLY_GROUNDED")}
          {data_card("GF-RC03-005 · LOW", "Functional overlap misclassified as cross-domain evidence")}
          <p>94 governance events logged (85 review + 9 arbitration). All append-only.</p>
        """,
        z4_content=f"""
          {data_card("SPINE-RC03-QT-001", "qualification_transition — OPERATOR_REVIEW_COMPLETE", color="blue")}
          {data_card("SPINE-RC03-QT-002", "qualification_transition — GOVERNANCE_FREEZE", color="blue")}
          <p>Checkpoints: checkpoint_02_review + checkpoint_03_governance (both FROZEN)</p>
          <p>Proof capsule: governance_proof_capsule.json</p>
        """,
        z5_content="""
          <p>Review event log: review_event_log.jsonl (94 events)</p>
          <p>Arbitration log: arbitration_log.jsonl (9 events)</p>
          <p>Operator: operator:krayu, Authority: L2</p>
          <p>Non-automatable boundary: 7 boundaries enforced — no system actor could self-authorize.</p>
        """,
        ascent_text="The system has been challenged and some meaning did not survive. 14 propositions were rejected — not because the system failed, but because governance friction surfaced genuine evidence limitations. The domain ID mismatch (GF-RC03-001) proves that operator review discovers structural defects invisible to automated derivation."
    ))

    # ─── CHAPTER 4: THE STRENGTHENING [STRENGTHENING] ───
    chapters.append(build_chapter(
        4, "The Strengthening", "STRENGTHENING",
        z1_prose=f"""
          Evidence enrichment addresses the governance findings. The primary mechanism: semantic name matching
          between canonical CSR domains and SDC candidate CSR domains, correcting the domain ID mismatch
          that governance friction surfaced. 12 domain propositions receive corrected component counts.
          15 capability propositions receive corrected domain references.
          <br><br>
          Debt evolution assessment tells the honest story: 4 items improved, 5 unchanged, 6 worsened,
          0 resolved. Enrichment produced more accurate evidence — not uniformly better evidence.
          Mean confidence: 0.728 → 0.741.
        """,
        z1_finding="Domain ID correction via semantic name matching. 14 EXACT matches, 3 NO_SDC_MATCH. Debt trajectory: HONEST_LIMITATION. 0 blockers resolved — all require L5 authority PATH B cannot provide.",
        z2_content=f"""
          <p>Enrichment impact on accepted propositions:</p>
          {data_card("Domains Corrected", "12 — component counts updated from name-matched SDC domains", color="green")}
          {data_card("Domains Confirmed", "1 — Telemetry Transport already correct")}
          {data_card("Domains NO_SDC_MATCH", "3 — Analytics, Real-Time Streaming, Event-Driven Architecture", color="orange")}
          {data_card("Capabilities Corrected", "15 — domain refs updated to canonical domains")}
          {data_card("Mean Confidence", "0.728 → 0.741 (+0.013)", color="green")}
        """,
        z3_content=f"""
          <p>Debt evolution assessment:</p>
          {data_card("Improved", "4 — DOMAIN-03, 09, 13, 15 (more components after name matching)", color="green")}
          {data_card("Unchanged", "5 — confirmed or not affected")}
          {data_card("Worsened", "6 — fewer components or NO_SDC_MATCH after correction", color="orange")}
          {data_card("Resolved", "0 — all block S3 requiring L5 authority", color="red")}
          <p>Trajectory: HONEST_LIMITATION. The system is now more honest about what PATH B can prove.</p>
        """,
        z4_content=f"""
          {data_card("SPINE-RC04-EO-001", "evidence_object — DOMAIN_ID_CORRECTION_ENRICHMENT", color="blue")}
          {data_card("SPINE-RC04-EO-002", "evidence_object — DEBT_EVOLUTION_ASSESSMENT", color="blue")}
          <p>Checkpoints: checkpoint_04_enrichment + checkpoint_05_debt (both FROZEN)</p>
          <p>31 enrichment events logged with pre/post values.</p>
        """,
        z5_content="""
          <p>Enrichment script: scripts/pios/sdc/evidence_enrichment_rc04.py</p>
          <p>Enrichment log: enrichment_log.json (31 events)</p>
          <p>Evidence manifest: evidence_manifest.json (3 HTML files, domain name mapping)</p>
          <p>Debt evolution: debt_evolution.json (15 items assessed)</p>
          <p>PATH B limitation: no code graph. Enrichment bounded by SDC HTML extraction.</p>
        """,
        ascent_text="What was weak is now grounded — or honestly acknowledged as ungroundable. The system self-corrected where evidence permitted and transparently documented where it could not. The 3 NO_SDC_MATCH domains are genuine evidence gaps, not failures. Honest limitation is itself a form of structural integrity."
    ))

    # ─── CHAPTER 5: THE PROOF [STABILIZATION] ───
    chapters.append(build_chapter(
        5, "The Proof", "STABILIZATION",
        z1_prose="""
          Deterministic revalidation replays the entire governance-challenged, evidence-enriched corpus
          through a 9-phase/48-check framework adapted from NetBox PATH A. Every phase passes. The corpus
          holds under structural examination — what was challenged now stands deterministically.
          <br><br>
          The revalidation framework itself is significant: it transfers from PATH A (code graph evidence)
          to PATH B (document evidence) without modification of the validation contract structure.
          Same structural rigor, different evidence channels.
        """,
        z1_finding="48/48 PASS across 9 phases. The revalidation framework transfers across evidence channels. Structural integrity, confidence realism, governance integrity, enrichment integrity — all confirmed.",
        z2_content=f"""
          <p>Revalidation phases:</p>
          {data_card("Phase 1 · Structural Integrity", "8/8 — all propositions structurally valid", color="green")}
          {data_card("Phase 2 · Evidence Integrity", "5/5 — all evidence anchors resolve", color="green")}
          {data_card("Phase 3 · Confidence Realism", "6/6 — bounds realistic for PATH B", color="green")}
          {data_card("Phase 4 · Governance Integrity", "5/5 — full lifecycle exercised", color="green")}
          {data_card("Phase 5 · Enrichment Integrity", "5/5 — domain mapping correct", color="green")}
          {data_card("Phase 6 · Checkpoint Integrity", "4/4 — all frozen and contiguous", color="green")}
          {data_card("Phase 7 · Spine Integrity", "4/4 — all valid and indexed", color="green")}
          {data_card("Phase 8 · SQO State Consistency", "3/3 — S2 preserved", color="green")}
          {data_card("Phase 9 · Corpus Evolution", "8/8 — trajectory realistic", color="green")}
        """,
        z3_content="""
          <p>Adaptation from NetBox:</p>
          <div class="data-card blue">
            <div class="data-label">What transferred</div>
            <div class="data-value">Same 9-phase framework structure, same structural rigor, same validation contract</div>
          </div>
          <div class="data-card orange">
            <div class="data-label">What adapted</div>
            <div class="data-value">Code graph phases (centrality, coupling, topology) replaced with evidence integrity and enrichment integrity phases</div>
          </div>
          <p>Both specimens: 48/48 PASS.</p>
        """,
        z4_content=f"""
          {data_card("SPINE-RC05-RC-001", "replay_corridor — DETERMINISTIC_REVALIDATION", color="blue")}
          <p>Corridor span: checkpoint_00 → checkpoint_06 (7 checkpoints traversed)</p>
          <p>Semantic phases covered: EMERGENCE → FORMATION → TENSION → STRENGTHENING → STABILIZATION</p>
          <p>Checkpoint: checkpoint_06_revalidation (FROZEN)</p>
        """,
        z5_content="""
          <p>Revalidation script: scripts/pios/sdc/revalidation_rc05.py</p>
          <p>Revalidation result: revalidation_result.json (48 checks, all PASS)</p>
          <p>Comparison: NetBox 48/48 PASS, BlueEdge 48/48 PASS</p>
        """,
        ascent_text="What was challenged now holds deterministically. The revalidation framework confirmed that governance friction produced a stronger corpus, not a broken one. The framework's transferability across evidence channels is itself structural evidence — the validation contract is evidence-channel-independent."
    ))

    # ─── CHAPTER 6: THE ADVANCEMENT [QUALIFICATION] ───
    chapters.append(build_chapter(
        6, "The Advancement", "QUALIFICATION",
        z1_prose="""
          The governed replay corridor is complete. BlueEdge's qualification provenance transitions from
          LEGACY_QUALIFICATION_BRIDGE to GOVERNED_REPLAY_QUALIFICATION. The bridge provenance — system actors,
          governance projection — is replaced by governed lifecycle lineage: proposition derivation, operator
          review with genuine friction, evidence enrichment, deterministic revalidation.
          <br><br>
          This is not full onboarding-origin genesis. It is governed lifecycle completion within a
          post-genesis semantic replay corridor. The distinction matters: genesis remains future upstream work.
        """,
        z1_finding="S2_BRIDGE → S2_GOVERNED. Bridge provenance replaced by governed lifecycle lineage. operator:krayu replaces system:pipeline. Post-genesis replay corridor — not full genesis.",
        z2_content=f"""
          <p>Provenance transition:</p>
          {data_card("Before", "GOVERNANCE_PROJECTION — system:pipeline actors, bridge events", color="yellow")}
          {data_card("After", "GOVERNED_REPLAY_QUALIFICATION — operator:krayu, governed lifecycle lineage", color="green")}
          {data_card("Corridor Type", "POST_GENESIS_SEMANTIC_REPLAY")}
          <p>Prior bridge provenance preserved in promotion_state.json for audit lineage.</p>
        """,
        z3_content=f"""
          <p>Governed lifecycle proven:</p>
          {data_card("RC-02", "85 propositions via PATH B proposition bridge")}
          {data_card("RC-03", "71 accepted, 14 rejected, 9 arbitrated, 5 findings")}
          {data_card("RC-04", "Domain ID correction, 31 enrichment events")}
          {data_card("RC-05", "48/48 revalidation PASS")}
          <p>S-level remains S2. 15 blockers still active — all require L5 authority.</p>
          <p>promotion_eligible remains false. S3 requires structural authority PATH B cannot provide.</p>
        """,
        z4_content=f"""
          {data_card("SPINE-RC06-QT-001", "qualification_transition — S2_BRIDGE_TO_S2_GOVERNED", color="blue")}
          <p>Checkpoint: checkpoint_07_advancement (FROZEN)</p>
          <p>Audit events: EVT-BRIDGE-001, EVT-BRIDGE-002 (superseded), EVT-REPLAY-001</p>
        """,
        z5_content="""
          <p>Mutated artifact: promotion_state.json</p>
          <p>Fields changed: qualification_provenance, governance_provenance, promotion_lineage, last_transition_actor, lane authorities</p>
          <p>Boundary: "This qualification was earned within the post-genesis semantic replay corridor. Genesis layer remains future upstream work."</p>
        """,
        ascent_text="The system has earned its state — not by resolving all blockers (15 remain), but by completing the governed lifecycle. S2 means governance discipline, not semantic perfection. The gap between bridge and governed qualification is now closed within this corridor."
    ))

    # ─── CHAPTER 7: THE PATTERN [CONVERGENCE] ───
    obs_cards = ""
    for obs in convergence.get("observations", []):
        obs_cards += data_card(
            obs["observation_id"],
            obs["title"],
            explain=f"Evidence: {obs['evidence_strength']}",
            color="purple"
        )

    matrix_rows = ""
    for dim in convergence.get("comparison_matrix", {}).get("dimensions", []):
        conv_class = "convergent" if dim["convergence"].startswith("CONVERGENT") else "divergent"
        matrix_rows += f"""
        <tr>
          <td>{dim['dimension']}</td>
          <td>{dim['netbox']}</td>
          <td>{dim['blueedge']}</td>
          <td class="{conv_class}">{dim['convergence']}</td>
        </tr>
        """

    chapters.append(build_chapter(
        7, "The Pattern", "CONVERGENCE",
        z1_prose="""
          Two independent specimens — NetBox (full governed semantic evolution, PATH A) and BlueEdge
          (post-genesis governed semantic replay, PATH B) — are compared across 15 dimensions. The comparison
          reveals 8 convergent and 7 divergent dimensions. The convergence is in governance discipline;
          the divergence is in evidence depth.
          <br><br>
          This is observational, not unification. The specimens are deliberately different — different
          evidence channels, different proposition engines, different enrichment mechanisms. The value
          is precisely in showing how different evidence corridors can still obey common governed
          cognition laws. That diversity is the proof.
        """,
        z1_finding="7 candidate governed cognition laws observed. All at DESCRIPTIVE maturity (2 specimens = comparison, not pattern). Governance discipline converges; evidence depth diverges. The governed spine model is evidence-channel-independent.",
        z2_content=f"""
          <p>Convergence observations (all SUPPORTED_BY_BOTH_SPECIMENS):</p>
          {obs_cards}
          <p>All observations at interpretation_maturity: DESCRIPTIVE. Promotion to LAW requires 3+ specimens.</p>
        """,
        z3_content=f"""
          <p>Comparison matrix (15 dimensions):</p>
          <table class="matrix-table">
            <tr><th>Dimension</th><th>NetBox</th><th>BlueEdge</th><th>Convergence</th></tr>
            {matrix_rows}
          </table>
        """,
        z4_content=f"""
          {data_card("SPINE-RC07-CO-001", "convergence_observation — CROSS_SPECIMEN_GOVERNANCE_CONVERGENCE", color="purple")}
          <p>Checkpoint: checkpoint_08_convergence (FROZEN)</p>
          <p>Convergence observations: convergence_observations.json</p>
        """,
        z5_content="""
          <p>NetBox reference: clients/netbox/psee/runs/run_github_netbox_20260520_134600/ (READ-ONLY)</p>
          <p>BlueEdge chronicle: clients/blueedge/chronicle/</p>
          <p>No NetBox mutation. No BlueEdge evidence mutation. Observation only.</p>
        """,
        ascent_text="Governed cognition generalizes across specimens. Not because the specimens are the same — they are deliberately different. But because the governance discipline is specimen-independent. Different evidence corridors, same governed spine model. This is not one system — it is a discipline."
    ))

    # ─── CHAPTER 8: THE PROJECTION [PROJECTION] ───
    chapters.append(build_chapter(
        8, "The Projection", "PROJECTION",
        z1_prose="""
          Cognition has become communicable. This chronicle — 8 checkpoints, 10 spine objects, 7 convergence
          observations, 94 governance events, 48/48 revalidation — is the projection of how Program
          Intelligence governs semantic understanding. Not a report. Not documentation. A traversal
          instrument through which governed cognition unfolds.
          <br><br>
          The replay corridor proved that governance patterns transfer within a post-genesis corridor.
          The convergence observations suggest — with DESCRIPTIVE maturity — that governance discipline
          may be specimen-independent. The audience now understands not just WHAT the system concluded,
          but HOW it governed the path from intake to qualification.
        """,
        z1_finding="The first governed cognitive replay chronicle is complete. 9 streams, 10 spine objects, 9 checkpoints, 7 convergence observations. Post-genesis replay corridor closed. Genesis layer remains future upstream work.",
        z2_content=f"""
          <p>Chronicle statistics:</p>
          {data_card("Streams Complete", "RC-01 through RC-07 (RC-08 = this compilation, RC-09 = certification)", color="green")}
          {data_card("Checkpoints Frozen", "9 (checkpoint_00 through checkpoint_08)")}
          {data_card("Spine Objects", "10 accumulated")}
          {data_card("Governance Events", "94 (review + arbitration)")}
          {data_card("Propositions", "85 total (71 accepted, 14 rejected)")}
          {data_card("Convergence Observations", "7 candidate laws")}
          {data_card("Revalidation", "48/48 PASS")}
        """,
        z3_content=f"""
          <p>Governed lifecycle summary:</p>
          <div class="meta-grid">
            {meta_row("EMERGENCE", "Baseline capture — S2 via bridge, 15 blockers, 0 propositions")}
            {meta_row("FORMATION", "85 propositions derived from PATH B evidence")}
            {meta_row("TENSION", "71 accepted, 14 rejected, 5 governance findings")}
            {meta_row("STRENGTHENING", "Domain ID correction, debt evolution (4↑ 6↓ 0 resolved)")}
            {meta_row("STABILIZATION", "48/48 revalidation PASS")}
            {meta_row("QUALIFICATION", "S2_BRIDGE → S2_GOVERNED")}
            {meta_row("CONVERGENCE", "7 observations across 2 specimens")}
            {meta_row("PROJECTION", "This chronicle — cognition made communicable")}
          </div>
        """,
        z4_content=f"""
          <p>Full spine object inventory:</p>
          {data_card("SPINE-RC01-EO-001", "evidence_object — baseline state capture")}
          {data_card("SPINE-RC01-EP-001", "executive_projection_snapshot — baseline executive state")}
          {data_card("SPINE-RC02-SP-001", "semantic_proposition_derivation — PATH B bridge")}
          {data_card("SPINE-RC03-QT-001", "qualification_transition — operator review complete")}
          {data_card("SPINE-RC03-QT-002", "qualification_transition — governance freeze")}
          {data_card("SPINE-RC04-EO-001", "evidence_object — domain ID correction enrichment")}
          {data_card("SPINE-RC04-EO-002", "evidence_object — debt evolution assessment")}
          {data_card("SPINE-RC05-RC-001", "replay_corridor — deterministic revalidation")}
          {data_card("SPINE-RC06-QT-001", "qualification_transition — S2 re-advancement")}
          {data_card("SPINE-RC07-CO-001", "convergence_observation — cross-specimen governance")}
        """,
        z5_content="""
          <p>Chronicle vault: clients/blueedge/chronicle/</p>
          <p>Chronicle manifest: CHRONICLE_MANIFEST.json</p>
          <p>This HTML: REPLAY_CHRONICLE.html</p>
          <p>Governance streams: docs/pios/PI.BLUEEDGE.GOVERNED-COGNITIVE-REPLAY-CHRONICLE.RC-*/</p>
        """,
        ascent_text="The audience now understands not just what the system concluded, but how it governed the path to those conclusions. The lineage is the proof. The outputs are the conclusions. And this chronicle is the lens through which governed cognition becomes visible."
    ))

    return "\n".join(chapters)


def build_footer():
    return """
    <div class="chronicle-footer">
      <div class="governance-boundary">
        <p><strong>Evidence Boundary Statement</strong></p>
        <p>This chronicle was produced under bounded interpretive authority (75.x). All narrative content
        traces to structural evidence in the chronicle vault. No inference beyond evidence-bound synthesis.
        No team behavior, organizational intent, or human motive inference. No causal attribution to humans.
        No remediation prioritization. 13 absolute prohibitions enforced.</p>
        <p>Structural derivation remains primary. Interpretive authority is additive, not replacement.</p>
        <p>BlueEdge qualification was earned within the post-genesis semantic replay corridor.
        Full onboarding-origin cognitive genesis remains future upstream work.</p>
      </div>
      <div class="snapshot-id">
        CHRONICLE · PI.BLUEEDGE.GOVERNED-COGNITIVE-REPLAY-CHRONICLE · 2026-05-23 · format v1.0
      </div>
    </div>
    """


def run():
    # Load all artifacts
    manifest = load_chronicle("CHRONICLE_MANIFEST.json")
    props = load_chronicle("propositions/semantic_propositions.json")
    review = load_chronicle("governance/review_summary.json")
    governance = load_chronicle("governance/governance_proof_capsule.json")
    enrichment = load_chronicle("evidence/enrichment_log.json")
    debt = load_chronicle("governance/debt_evolution.json")
    reval = load_chronicle("checkpoints/revalidation_result.json")
    convergence = load_chronicle("convergence/convergence_observations.json")
    spine = load_chronicle("spine/spine_objects.json")

    # Build HTML
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-version" content="1.0">
  <meta name="generator" content="Governed Cognitive Replay Chronicle Builder">
  <meta name="governance" content="75.x bounded interpretive authority — evidence-bound narrative synthesis">
  <meta name="chronicle-id" content="blueedge-governed-cognitive-replay-chronicle">
  <meta name="corridor-type" content="POST_GENESIS_SEMANTIC_REPLAY">
  <title>BlueEdge — Governed Cognitive Replay Chronicle</title>
  <style>{build_styles()}</style>
</head>
<body>
  {build_header()}
  {build_timeline()}
  {build_chapters(manifest, props, review, governance, enrichment, debt, reval, convergence, spine)}
  {build_footer()}
</body>
</html>"""

    # Write output
    output_path = os.path.join(CHRONICLE, "REPLAY_CHRONICLE.html")
    with open(output_path, "w") as f:
        f.write(html)

    print(f"Chronicle generated: {output_path}")
    print(f"Size: {len(html):,} bytes")
    print(f"Chapters: 8")
    print(f"Zoom levels: Z1-Z5 per chapter")


if __name__ == "__main__":
    run()
