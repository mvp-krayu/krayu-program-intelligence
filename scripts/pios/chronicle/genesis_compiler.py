#!/usr/bin/env python3
"""
genesis_compiler.py — Genesis Chronicle Compiler

Contract: PI.GENESIS.GEN-5.FIRST-FULL-GENESIS-CHRONICLE.01

Compiles accumulated chronicle events, checkpoints, hero moments, learning events,
governance data, and spine objects into a navigable self-contained HTML instrument.

The compiler reads — it does not produce — the chronicle runtime artifacts.
The compilation is a lens onto accumulated events, not the creation of them.
"""

import json
import html
import hashlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional


SEMANTIC_PHASES = [
    "DISCOVERY", "EMERGENCE", "FORMATION", "TENSION",
    "STRENGTHENING", "STABILIZATION", "QUALIFICATION",
    "CONVERGENCE", "PROJECTION",
]

PHASE_DESCRIPTIONS = {
    "DISCOVERY": "Raw intake — the system encounters unknown structure",
    "EMERGENCE": "First structural topology materializes from evidence",
    "FORMATION": "Semantic claims crystallize from structural evidence",
    "TENSION": "Governance challenges weak meaning — friction, dispute, rejection",
    "STRENGTHENING": "Evidence enrichment, debt evolution — the system self-corrects",
    "STABILIZATION": "Deterministic replay confirms — what was challenged now holds",
    "QUALIFICATION": "Governed advancement — the system earns its state transition",
    "CONVERGENCE": "Cross-specimen pattern — generalized governed cognition emerges",
    "PROJECTION": "Executive understanding crystallizes — cognition becomes communicable",
}

PHASE_COLORS = {
    "DISCOVERY": "#7a8aaa",
    "EMERGENCE": "#4a9eff",
    "FORMATION": "#64ffda",
    "TENSION": "#ff6b6b",
    "STRENGTHENING": "#ffd700",
    "STABILIZATION": "#64ffda",
    "QUALIFICATION": "#4a9eff",
    "CONVERGENCE": "#ff9e4a",
    "PROJECTION": "#ccd6f6",
}


class GenesisChronicleCompiler:
    """Compiles genesis chronicle data into navigable HTML."""

    def __init__(self, client_id: str, run_id: str, run_dir: Path):
        self.client_id = client_id
        self.run_id = run_id
        self.run_dir = run_dir
        self.chronicle_dir = run_dir / "chronicle"
        self.events: list[dict] = []
        self.checkpoints: list[dict] = []
        self.hero_moments: list[dict] = []
        self.learning_events: list[dict] = []
        self.propositions: list[dict] = []
        self.governance_events: list[dict] = []
        self.manifest: dict = {}
        self.spine_summary: dict = {}

    def load(self) -> "GenesisChronicleCompiler":
        self._load_manifest()
        self._load_events()
        self._load_checkpoints()
        self._load_hero_moments()
        self._load_learning_events()
        self._load_spine()
        self._load_governance()
        return self

    def compile(self, output_path: Optional[Path] = None) -> Path:
        if output_path is None:
            output_path = self.chronicle_dir / "GENESIS_CHRONICLE.html"

        chronicle_html = self._render()

        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(chronicle_html)

        self._write_compilation_manifest(output_path)
        return output_path

    # ── Data Loading ─────────────────────────────────────────────────────────

    def _load_manifest(self):
        path = self.chronicle_dir / "CHRONICLE_MANIFEST.json"
        if path.exists():
            with open(path) as f:
                self.manifest = json.load(f)

    def _load_events(self):
        path = self.chronicle_dir / "chronicle_events.jsonl"
        if path.exists():
            with open(path) as f:
                for line in f:
                    line = line.strip()
                    if line:
                        self.events.append(json.loads(line))

    def _load_checkpoints(self):
        cp_dir = self.chronicle_dir / "checkpoints"
        if cp_dir.exists():
            for cp_file in sorted(cp_dir.glob("checkpoint_*.json")):
                with open(cp_file) as f:
                    self.checkpoints.append(json.load(f))

    def _load_hero_moments(self):
        path = self.chronicle_dir / "hero_moments.json"
        if path.exists():
            with open(path) as f:
                data = json.load(f)
                self.hero_moments = data.get("hero_moments", [])

    def _load_learning_events(self):
        path = self.run_dir / "governance" / "learning_events.jsonl"
        if path.exists():
            with open(path) as f:
                for line in f:
                    line = line.strip()
                    if line:
                        self.learning_events.append(json.loads(line))

    def _load_spine(self):
        path = self.run_dir / "spine" / "spine_objects.json"
        if path.exists():
            with open(path) as f:
                data = json.load(f)
                self.spine_summary = data.get("summary", {})
                props = data.get("objects", {}).get("semantic_propositions", [])
                self.propositions = props

    def _load_governance(self):
        gov_dir = self.run_dir / "governance"
        if not gov_dir.exists():
            return
        for jsonl_file in gov_dir.glob("*.jsonl"):
            if jsonl_file.name == "learning_events.jsonl":
                continue
            with open(jsonl_file) as f:
                for line in f:
                    line = line.strip()
                    if line:
                        self.governance_events.append(json.loads(line))

    # ── Compilation ──────────────────────────────────────────────────────────

    def _write_compilation_manifest(self, output_path: Path):
        with open(output_path, "rb") as f:
            content_hash = hashlib.sha256(f.read()).hexdigest()

        compilation = {
            "chronicle_id": self.manifest.get("chronicle_id", f"{self.client_id}-{self.run_id}-genesis"),
            "compiled_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "output_path": str(output_path.relative_to(self.run_dir.parents[3])),
            "content_hash": content_hash,
            "sources": {
                "events": len(self.events),
                "checkpoints": len(self.checkpoints),
                "hero_moments": len(self.hero_moments),
                "learning_events": len(self.learning_events),
                "propositions": len(self.propositions),
                "governance_events": len(self.governance_events),
            },
            "phases_reached": self.manifest.get("semantic_phases_reached", []),
            "corridor_type": "FULL_COGNITIVE_GENESIS",
        }

        manifest_path = self.chronicle_dir / "compilation_manifest.json"
        with open(manifest_path, "w", encoding="utf-8") as f:
            json.dump(compilation, f, indent=2)

    def _render(self) -> str:
        events_by_phase = self._group_events_by_phase()
        phases_reached = self.manifest.get("semantic_phases_reached", [])
        pipeline_status = self.manifest.get("status", "UNKNOWN")

        prop_stats = self._proposition_stats()
        hm_by_type = self._hero_moments_by_type()
        le_by_category = self._learning_by_category()

        return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Genesis Chronicle — {h(self.client_id)}</title>
{self._render_styles()}
</head>
<body>
<div class="chronicle-shell">

{self._render_header(pipeline_status, phases_reached)}

{self._render_timeline(phases_reached)}

{self._render_manifest_ribbon()}

{self._render_chapters(events_by_phase, phases_reached, hm_by_type, prop_stats, le_by_category)}

{self._render_hero_moments_panel()}

{self._render_learning_events_panel()}

{self._render_governance_footer()}

</div>
{self._render_scripts()}
</body>
</html>"""

    # ── Section Renderers ────────────────────────────────────────────────────

    def _render_header(self, status: str, phases: list) -> str:
        status_color = "#64ffda" if status == "COMPLETE" else "#ffd700" if status == "INCOMPLETE" else "#ff6b6b"
        phase_count = len(phases)
        return f"""
<header class="chronicle-header">
  <div class="header-identity">
    <div class="header-label">GENESIS CHRONICLE</div>
    <div class="header-client">{h(self.client_id)}</div>
    <div class="header-run">{h(self.run_id)}</div>
  </div>
  <div class="header-status">
    <div class="status-badge" style="border-color: {status_color}; color: {status_color};">{h(status)}</div>
    <div class="status-detail">{phase_count}/{len(SEMANTIC_PHASES)} semantic phases</div>
    <div class="status-detail">{len(self.events)} events &middot; {len(self.checkpoints)} checkpoints</div>
  </div>
</header>"""

    def _render_timeline(self, phases_reached: list) -> str:
        nodes = []
        for phase in SEMANTIC_PHASES:
            reached = phase in phases_reached
            color = PHASE_COLORS.get(phase, "#4a5570")
            opacity = "1.0" if reached else "0.25"
            nodes.append(f"""
      <div class="timeline-node" style="opacity: {opacity};" data-phase="{phase}">
        <div class="timeline-dot" style="background: {color};"></div>
        <div class="timeline-label" style="color: {color};">{phase}</div>
      </div>""")

        return f"""
<div class="semantic-timeline">
  <div class="timeline-track">
    <div class="timeline-line"></div>
    {"".join(nodes)}
  </div>
</div>"""

    def _render_manifest_ribbon(self) -> str:
        m = self.manifest
        return f"""
<div class="manifest-ribbon">
  <div class="ribbon-segment">
    <span class="ribbon-key">CORRIDOR</span>
    <span class="ribbon-val">{h(m.get('corridor_type', 'GENESIS'))}</span>
  </div>
  <div class="ribbon-segment">
    <span class="ribbon-key">EVENTS</span>
    <span class="ribbon-val">{m.get('events_emitted', len(self.events))}</span>
  </div>
  <div class="ribbon-segment">
    <span class="ribbon-key">CHECKPOINTS</span>
    <span class="ribbon-val">{m.get('checkpoints_frozen', len(self.checkpoints))}</span>
  </div>
  <div class="ribbon-segment">
    <span class="ribbon-key">HERO MOMENTS</span>
    <span class="ribbon-val">{len(self.hero_moments)}</span>
  </div>
  <div class="ribbon-segment">
    <span class="ribbon-key">PROPOSITIONS</span>
    <span class="ribbon-val">{len(self.propositions)}</span>
  </div>
  <div class="ribbon-segment">
    <span class="ribbon-key">LEARNING</span>
    <span class="ribbon-val">{len(self.learning_events)}</span>
  </div>
</div>"""

    def _render_chapters(self, events_by_phase, phases_reached, hm_by_type, prop_stats, le_by_category) -> str:
        chapters = []
        for phase in SEMANTIC_PHASES:
            reached = phase in phases_reached
            events = events_by_phase.get(phase, [])
            chapter = self._render_chapter(phase, events, reached, hm_by_type, prop_stats, le_by_category)
            chapters.append(chapter)
        return "\n".join(chapters)

    def _render_chapter(self, phase, events, reached, hm_by_type, prop_stats, le_by_category) -> str:
        color = PHASE_COLORS.get(phase, "#4a5570")
        description = PHASE_DESCRIPTIONS.get(phase, "")
        opacity = "1" if reached else "0.4"
        event_count = len(events)

        z1 = self._render_z1(phase, events, hm_by_type, prop_stats, le_by_category)
        z2 = self._render_z2(phase, events)
        z3 = self._render_z3(phase, events)
        z4 = self._render_z4(phase, events)
        z5 = self._render_z5(phase, events)

        checkpoint_html = self._render_checkpoint_for_phase(phase)

        return f"""
<section class="chapter" data-phase="{phase}" style="opacity: {opacity};">
  <div class="chapter-header">
    <div class="chapter-phase-marker" style="background: {color};">{phase}</div>
    <div class="chapter-title">{h(description)}</div>
    <div class="chapter-event-count">{event_count} events</div>
  </div>

  <div class="zoom-container" data-current-zoom="1">
    <div class="zoom-controls">
      <button class="zoom-btn" data-zoom="1" title="Executive Understanding">Z1</button>
      <button class="zoom-btn" data-zoom="2" title="Semantic Interpretation">Z2</button>
      <button class="zoom-btn" data-zoom="3" title="Governance Detail">Z3</button>
      <button class="zoom-btn" data-zoom="4" title="Structural Proof">Z4</button>
      <button class="zoom-btn" data-zoom="5" title="Raw Evidence">Z5</button>
    </div>

    <div class="zoom-level z1 active">{z1}</div>
    <div class="zoom-level z2">{z2}</div>
    <div class="zoom-level z3">{z3}</div>
    <div class="zoom-level z4">{z4}</div>
    <div class="zoom-level z5">{z5}</div>
  </div>

  {checkpoint_html}
</section>"""

    def _render_z1(self, phase, events, hm_by_type, prop_stats, le_by_category) -> str:
        if phase == "DISCOVERY":
            return self._z1_discovery(events)
        elif phase == "EMERGENCE":
            return self._z1_emergence(events, hm_by_type)
        elif phase == "FORMATION":
            return self._z1_formation(events, prop_stats)
        elif phase == "TENSION":
            return self._z1_tension(events)
        elif phase == "STRENGTHENING":
            return self._z1_strengthening(events, le_by_category)
        elif phase == "STABILIZATION":
            return self._z1_stabilization(events)
        elif phase == "QUALIFICATION":
            return self._z1_qualification(events)
        elif phase == "CONVERGENCE":
            return self._z1_convergence(events)
        elif phase == "PROJECTION":
            return self._z1_projection(events)
        return "<div class='z1-content'>No data for this phase.</div>"

    def _z1_discovery(self, events) -> str:
        source_events = [e for e in events if e.get("event_type") in ("source_discovery", "evidence_acquisition")]
        phase_events = [e for e in events if e.get("event_type") in ("phase_started", "phase_completed")]
        detail = self._extract_detail(source_events)
        file_count = ""
        for e in source_events:
            fc = e.get("detail", {}).get("file_count", 0)
            if fc:
                file_count = f"<div class='z1-metric'>{fc} evidence files extracted</div>"
        sha = ""
        for e in source_events:
            s = e.get("detail", {}).get("sha256", "")
            if s:
                sha = f"<div class='z1-evidence'>SHA256: {h(s[:16])}...</div>"

        return f"""
<div class="z1-content">
  <div class="z1-narrative">
    The system encounters raw evidence for the first time.
    Source boundaries are verified, intake structures are extracted and SHA256-stamped.
    {len(events)} events captured the intake corridor from archive identification through evidence acquisition.
  </div>
  {file_count}
  {sha}
  <div class="z1-finding">
    <span class="finding-label">KEY FINDING</span>
    {len(source_events)} source/evidence events &middot; {len(phase_events)} phase boundary events
  </div>
</div>"""

    def _z1_emergence(self, events, hm_by_type) -> str:
        struct_events = [e for e in events if e.get("event_type") == "structural_emergence"]
        node_count = edge_count = cluster_count = 0
        for e in struct_events:
            d = e.get("detail", {})
            node_count = d.get("node_count", node_count)
            edge_count = d.get("edge_count", edge_count)
            cluster_count = d.get("cluster_count", cluster_count)

        hm_total = len(self.hero_moments)
        hm_types = ", ".join(f"{t}: {len(hms)}" for t, hms in hm_by_type.items())

        return f"""
<div class="z1-content">
  <div class="z1-narrative">
    First structural topology materializes. From raw file inventory, the system
    extracts containment edges, import relationships, and structural clusters.
    Relevance classification separates architectural spine from peripheral noise.
    Centrality derivation reveals which files are structurally dominant.
  </div>
  <div class="z1-metric">{node_count} nodes &middot; {edge_count} edges &middot; {cluster_count} clusters</div>
  <div class="z1-metric">{hm_total} hero moment candidates detected</div>
  <div class="z1-finding">
    <span class="finding-label">KEY FINDING</span>
    {hm_types if hm_types else "Structural topology extracted — hero moments pending detection"}
  </div>
</div>"""

    def _z1_formation(self, events, prop_stats) -> str:
        sem_events = [e for e in events if e.get("event_type") == "semantic_formation"]
        prop_count = prop_stats.get("total", 0)
        by_class = prop_stats.get("by_class", {})
        class_summary = ", ".join(f"{c}: {n}" for c, n in by_class.items()) if by_class else "no propositions"

        return f"""
<div class="z1-content">
  <div class="z1-narrative">
    Semantic claims crystallize from structural evidence. The Semantic Proposition Engine
    transforms verified structural artifacts into governed propositions — each carrying
    derivation tier, confidence score, and authority ceiling.
  </div>
  <div class="z1-metric">{prop_count} propositions derived</div>
  <div class="z1-metric">{class_summary}</div>
  <div class="z1-finding">
    <span class="finding-label">KEY FINDING</span>
    Semantic DNA formed from structural evidence — all at L3 authority ceiling, CANDIDATE status
  </div>
</div>"""

    def _z1_tension(self, events) -> str:
        gov_count = len(self.governance_events)
        return f"""
<div class="z1-content">
  <div class="z1-narrative">
    Governance challenges weak meaning. Operator review exercises the full authority
    workflow — accept, contest, arbitrate, reject. Claims that cannot survive
    governance friction are removed. This is genuine friction, not ceremony.
  </div>
  <div class="z1-metric">{gov_count} governance events recorded</div>
  <div class="z1-finding">
    <span class="finding-label">KEY FINDING</span>
    {"Governance friction exercised — some meaning did not survive" if gov_count > 0 else "Governance phase — operator review required"}
  </div>
</div>"""

    def _z1_strengthening(self, events, le_by_category) -> str:
        le_total = len(self.learning_events)
        cat_summary = ", ".join(f"{c}: {len(les)}" for c, les in le_by_category.items()) if le_by_category else "none captured"
        return f"""
<div class="z1-content">
  <div class="z1-narrative">
    Evidence enrichment strengthens weak claims. The substrate self-corrects through
    additional structural evidence — code graph authority, cross-reference validation,
    and reconciliation. Learning events capture what the system discovers about its own
    onboarding process.
  </div>
  <div class="z1-metric">{le_total} learning events captured</div>
  <div class="z1-metric">Categories: {cat_summary}</div>
  <div class="z1-finding">
    <span class="finding-label">KEY FINDING</span>
    {"System learning from its own genesis — substrate strengthening through evidence" if le_total > 0 else "Strengthening phase — enrichment and learning capture"}
  </div>
</div>"""

    def _z1_stabilization(self, events) -> str:
        return """
<div class="z1-content">
  <div class="z1-narrative">
    Deterministic replay confirms. What was challenged now holds under structural rigor.
    The revalidation framework replays derivation, reconciliation, and governance
    decisions to verify deterministic reproducibility.
  </div>
  <div class="z1-finding">
    <span class="finding-label">KEY FINDING</span>
    Stabilization — deterministic revalidation confirms governance-challenged corpus
  </div>
</div>"""

    def _z1_qualification(self, events) -> str:
        return """
<div class="z1-content">
  <div class="z1-narrative">
    The system earns its state transition. S-level advancement is not granted by
    blocker resolution alone — it requires completion of the full governance lifecycle:
    proposition derivation, operator review, substrate strengthening, deterministic revalidation.
  </div>
  <div class="z1-finding">
    <span class="finding-label">KEY FINDING</span>
    Qualification — governed advancement through lifecycle completion
  </div>
</div>"""

    def _z1_convergence(self, events) -> str:
        return """
<div class="z1-content">
  <div class="z1-narrative">
    Cross-specimen patterns emerge. When two or more specimens traverse the same
    governance lifecycle, convergent and divergent patterns become observable.
    All observations at DESCRIPTIVE maturity — two specimens is comparison, not law.
  </div>
  <div class="z1-finding">
    <span class="finding-label">KEY FINDING</span>
    Convergence — governed cognition generalizes across specimens
  </div>
</div>"""

    def _z1_projection(self, events) -> str:
        return """
<div class="z1-content">
  <div class="z1-narrative">
    Executive understanding crystallizes. Cognition becomes communicable through
    governed projection surfaces — LENS views, SQO cockpit, BOARDROOM narratives.
    The genesis corridor is complete: from raw intake to governed understanding.
  </div>
  <div class="z1-finding">
    <span class="finding-label">KEY FINDING</span>
    Projection — the system's understanding is now structurally communicable
  </div>
</div>"""

    def _render_z2(self, phase, events) -> str:
        if not events:
            return "<div class='z2-content'><div class='z2-empty'>No semantic data for this phase.</div></div>"

        event_types = {}
        for e in events:
            t = e.get("event_type", "unknown")
            event_types[t] = event_types.get(t, 0) + 1

        type_rows = "\n".join(
            f"<div class='z2-row'><span class='z2-type'>{h(t)}</span><span class='z2-count'>{c}</span></div>"
            for t, c in sorted(event_types.items(), key=lambda x: -x[1])
        )

        prop_html = ""
        if phase == "FORMATION" and self.propositions:
            classes = {}
            for p in self.propositions:
                pc = p.get("proposition_class", "UNKNOWN")
                classes[pc] = classes.get(pc, 0) + 1
            prop_rows = "\n".join(
                f"<div class='z2-row'><span class='z2-type'>{h(c)}</span><span class='z2-count'>{n}</span></div>"
                for c, n in sorted(classes.items(), key=lambda x: -x[1])
            )
            prop_html = f"""
<div class="z2-section">
  <div class="z2-section-title">PROPOSITION CLASSES</div>
  {prop_rows}
</div>"""

        return f"""
<div class="z2-content">
  <div class="z2-section">
    <div class="z2-section-title">EVENT TYPES IN THIS PHASE</div>
    {type_rows}
  </div>
  {prop_html}
</div>"""

    def _render_z3(self, phase, events) -> str:
        gov_html = ""
        if phase == "TENSION" and self.governance_events:
            rows = []
            for ge in self.governance_events[:20]:
                action = ge.get("action", ge.get("event_type", "unknown"))
                target = ge.get("target_id", ge.get("proposition_id", ""))
                actor = ge.get("actor_id", ge.get("operator", ""))
                rows.append(
                    f"<div class='z3-row'>"
                    f"<span class='z3-action'>{h(str(action))}</span>"
                    f"<span class='z3-target'>{h(str(target)[:30])}</span>"
                    f"<span class='z3-actor'>{h(str(actor))}</span>"
                    f"</div>"
                )
            gov_html = f"""
<div class="z3-section">
  <div class="z3-section-title">GOVERNANCE EVENTS ({len(self.governance_events)} total)</div>
  {"".join(rows)}
  {"<div class='z3-truncated'>... and more</div>" if len(self.governance_events) > 20 else ""}
</div>"""

        event_rows = []
        for e in events[:15]:
            desc = e.get("description", "")[:80]
            etype = e.get("event_type", "unknown")
            event_rows.append(
                f"<div class='z3-row'>"
                f"<span class='z3-action'>{h(etype)}</span>"
                f"<span class='z3-target'>{h(desc)}</span>"
                f"</div>"
            )

        return f"""
<div class="z3-content">
  {gov_html}
  <div class="z3-section">
    <div class="z3-section-title">CHRONICLE EVENTS</div>
    {"".join(event_rows)}
  </div>
</div>"""

    def _render_z4(self, phase, events) -> str:
        rows = []
        for e in events:
            eid = e.get("event_id", "")
            etype = e.get("event_type", "")
            refs = e.get("evidence_refs", [])
            detail = e.get("detail", {})
            artifacts = detail.get("artifacts_produced", [])
            all_refs = refs + artifacts
            if all_refs:
                ref_str = ", ".join(str(r)[:40] for r in all_refs[:3])
                rows.append(
                    f"<div class='z4-row'>"
                    f"<span class='z4-id'>{h(eid)}</span>"
                    f"<span class='z4-refs'>{h(ref_str)}</span>"
                    f"</div>"
                )
        if not rows:
            rows.append("<div class='z4-empty'>No evidence anchors for this phase.</div>")

        return f"""
<div class="z4-content">
  <div class="z4-section-title">STRUCTURAL PROOF — EVIDENCE ANCHORS</div>
  {"".join(rows[:20])}
</div>"""

    def _render_z5(self, phase, events) -> str:
        raw_events = []
        for e in events[:10]:
            raw_events.append(f"<pre class='z5-raw'>{h(json.dumps(e, indent=2)[:500])}</pre>")

        return f"""
<div class="z5-content">
  <div class="z5-section-title">RAW EVIDENCE — CHRONICLE EVENTS</div>
  {"".join(raw_events)}
  {"<div class='z5-truncated'>... " + str(len(events) - 10) + " more events</div>" if len(events) > 10 else ""}
</div>"""

    def _render_checkpoint_for_phase(self, phase) -> str:
        matching = [c for c in self.checkpoints if c.get("semantic_phase") == phase]
        if not matching:
            return ""

        rows = []
        for cp in matching:
            cpid = cp.get("checkpoint_id", "")
            pipeline_phase = cp.get("pipeline_phase", "")
            ts = cp.get("timestamp", "")
            rows.append(
                f"<div class='checkpoint-row'>"
                f"<span class='checkpoint-id'>{h(cpid)}</span>"
                f"<span class='checkpoint-phase'>{h(pipeline_phase)}</span>"
                f"<span class='checkpoint-ts'>{h(ts[:19])}</span>"
                f"</div>"
            )

        return f"""
<div class="checkpoint-bar">
  <div class="checkpoint-label">FROZEN CHECKPOINTS</div>
  {"".join(rows)}
</div>"""

    def _render_hero_moments_panel(self) -> str:
        if not self.hero_moments:
            return ""

        rows = []
        for hm in self.hero_moments[:15]:
            hm_id = hm.get("hero_moment_id", "")
            hm_type = hm.get("hero_type", "")
            desc = hm.get("description", "")[:100]
            metric = hm.get("structural_metric", {})
            metric_str = json.dumps(metric)[:60] if metric else ""
            rows.append(f"""
<div class="hm-row">
  <span class="hm-id">{h(hm_id)}</span>
  <span class="hm-type">{h(hm_type)}</span>
  <div class="hm-desc">{h(desc)}</div>
  <div class="hm-metric">{h(metric_str)}</div>
</div>""")

        return f"""
<section class="hero-moments-panel">
  <div class="panel-header">HERO MOMENTS — {len(self.hero_moments)} CANDIDATES</div>
  <div class="panel-subtitle">Cognitive discontinuities detected during structural emergence</div>
  {"".join(rows)}
  {"<div class='panel-truncated'>... and " + str(len(self.hero_moments) - 15) + " more</div>" if len(self.hero_moments) > 15 else ""}
</section>"""

    def _render_learning_events_panel(self) -> str:
        if not self.learning_events:
            return ""

        rows = []
        for le in self.learning_events[:15]:
            le_id = le.get("event_id", "")
            title = le.get("title", "")[:80]
            cat = le.get("category", "")
            cap_class = le.get("capability_class", "")
            state = le.get("lifecycle_state", "PROPOSED")
            rows.append(f"""
<div class="le-row">
  <span class="le-id">{h(le_id)}</span>
  <span class="le-state">{h(state)}</span>
  <span class="le-cat">{h(cat)}</span>
  <div class="le-title">{h(title)}</div>
  <div class="le-cap">{h(cap_class)}</div>
</div>""")

        return f"""
<section class="learning-panel">
  <div class="panel-header">LEARNING EVENTS — {len(self.learning_events)} CAPTURED</div>
  <div class="panel-subtitle">Governed learning from onboarding experience</div>
  {"".join(rows)}
</section>"""

    def _render_governance_footer(self) -> str:
        now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        return f"""
<footer class="governance-footer">
  <div class="footer-section">
    <div class="footer-label">GOVERNANCE</div>
    <div class="footer-value">75.x bounded &middot; evidence-bound &middot; 13 prohibitions enforced</div>
  </div>
  <div class="footer-section">
    <div class="footer-label">COMPILED</div>
    <div class="footer-value">{h(now)}</div>
  </div>
  <div class="footer-section">
    <div class="footer-label">CONTRACT</div>
    <div class="footer-value">PI.GENESIS.GEN-5.FIRST-FULL-GENESIS-CHRONICLE.01</div>
  </div>
  <div class="footer-section">
    <div class="footer-label">AUTHORITY</div>
    <div class="footer-value">BOUNDED INTERPRETATION &middot; lineage-grounded &middot; no inference beyond evidence</div>
  </div>
</footer>"""

    # ── Helpers ───────────────────────────────────────────────────────────────

    def _group_events_by_phase(self) -> dict:
        result = {}
        for e in self.events:
            phase = e.get("semantic_phase", "DISCOVERY")
            if phase not in result:
                result[phase] = []
            result[phase].append(e)
        return result

    def _proposition_stats(self) -> dict:
        if not self.propositions:
            return {"total": 0, "by_class": {}}
        by_class = {}
        for p in self.propositions:
            pc = p.get("proposition_class", "UNKNOWN")
            by_class[pc] = by_class.get(pc, 0) + 1
        return {"total": len(self.propositions), "by_class": by_class}

    def _hero_moments_by_type(self) -> dict:
        result = {}
        for hm in self.hero_moments:
            t = hm.get("hero_type", "UNKNOWN")
            if t not in result:
                result[t] = []
            result[t].append(hm)
        return result

    def _learning_by_category(self) -> dict:
        result = {}
        for le in self.learning_events:
            c = le.get("category", "UNKNOWN")
            if c not in result:
                result[c] = []
            result[c].append(le)
        return result

    @staticmethod
    def _extract_detail(events) -> str:
        for e in events:
            d = e.get("detail", {})
            if d:
                return json.dumps(d)[:200]
        return ""

    # ── CSS ───────────────────────────────────────────────────────────────────

    def _render_styles(self) -> str:
        return """<style>
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
  --font-mono: 'Courier New', monospace;
  --font-ui: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
}

.chronicle-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* Header */
.chronicle-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 4px;
  margin-bottom: 24px;
}
.header-label {
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.header-client {
  font-size: 28px;
  font-weight: bold;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 2px;
}
.header-run {
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 4px;
}
.header-status { text-align: right; }
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border: 1px solid;
  border-radius: 2px;
  font-size: 11px;
  letter-spacing: 2px;
  font-weight: bold;
}
.status-detail {
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 4px;
}

/* Timeline */
.semantic-timeline {
  margin-bottom: 24px;
  padding: 16px 24px;
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  border-radius: 4px;
}
.timeline-track {
  display: flex;
  align-items: center;
  gap: 0;
  position: relative;
}
.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border);
  transform: translateY(-50%);
}
.timeline-node {
  flex: 1;
  text-align: center;
  position: relative;
  z-index: 1;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 0 auto 4px;
}
.timeline-label {
  font-size: 8px;
  letter-spacing: 1px;
  font-weight: bold;
}

/* Manifest Ribbon */
.manifest-ribbon {
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  border: 1px solid var(--border-dim);
  border-radius: 4px;
  overflow: hidden;
}
.ribbon-segment {
  flex: 1;
  padding: 10px 16px;
  background: var(--bg-panel);
  border-right: 1px solid var(--border-dim);
  text-align: center;
}
.ribbon-segment:last-child { border-right: none; }
.ribbon-key {
  display: block;
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.ribbon-val {
  display: block;
  font-size: 14px;
  color: var(--text-primary);
  font-weight: bold;
}

/* Chapter */
.chapter {
  margin-bottom: 20px;
  border: 1px solid var(--border-dim);
  border-radius: 4px;
  background: var(--bg-panel);
  transition: opacity 0.2s ease;
}
.chapter-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-dim);
}
.chapter-phase-marker {
  padding: 3px 10px;
  border-radius: 2px;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 1px;
  color: var(--bg-base);
}
.chapter-title {
  flex: 1;
  font-size: 12px;
  color: var(--text-dim);
  font-family: var(--font-ui);
}
.chapter-event-count {
  font-size: 11px;
  color: var(--text-muted);
}

/* Zoom */
.zoom-container { padding: 16px; }
.zoom-controls {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}
.zoom-btn {
  padding: 4px 10px;
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  border-radius: 2px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.zoom-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.zoom-btn.active {
  background: var(--accent);
  color: var(--bg-base);
  border-color: var(--accent);
}

.zoom-level {
  display: none;
  animation: fadeIn 0.15s ease;
}
.zoom-level.active { display: block; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Z1 */
.z1-content { padding: 8px 0; }
.z1-narrative {
  font-family: var(--font-ui);
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-primary);
  margin-bottom: 12px;
}
.z1-metric {
  font-size: 12px;
  color: var(--accent);
  margin-bottom: 4px;
  padding-left: 12px;
  border-left: 2px solid var(--accent);
}
.z1-evidence {
  font-size: 11px;
  color: var(--text-dim);
  margin-bottom: 4px;
}
.z1-finding {
  margin-top: 12px;
  padding: 8px 12px;
  background: var(--bg-deep);
  border-left: 3px solid var(--yellow);
  font-size: 12px;
}
.finding-label {
  display: inline-block;
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--yellow);
  margin-right: 8px;
  font-weight: bold;
}

/* Z2 */
.z2-content { padding: 8px 0; }
.z2-section { margin-bottom: 12px; }
.z2-section-title {
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--text-muted);
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border-dim);
}
.z2-row {
  display: flex;
  justify-content: space-between;
  padding: 3px 8px;
  font-size: 11px;
}
.z2-type { color: var(--text-dim); }
.z2-count { color: var(--accent); font-weight: bold; }
.z2-empty { color: var(--text-muted); font-style: italic; font-size: 11px; }

/* Z3 */
.z3-content { padding: 8px 0; }
.z3-section { margin-bottom: 12px; }
.z3-section-title {
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--text-muted);
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border-dim);
}
.z3-row {
  display: flex;
  gap: 12px;
  padding: 3px 8px;
  font-size: 11px;
  border-bottom: 1px solid var(--border-dim);
}
.z3-action { color: var(--accent); min-width: 120px; }
.z3-target { color: var(--text-dim); flex: 1; }
.z3-actor { color: var(--text-muted); }
.z3-truncated { color: var(--text-muted); font-size: 10px; padding: 4px 8px; }

/* Z4 */
.z4-content { padding: 8px 0; }
.z4-section-title {
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--text-muted);
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border-dim);
}
.z4-row {
  display: flex;
  gap: 12px;
  padding: 3px 8px;
  font-size: 11px;
}
.z4-id { color: var(--text-muted); min-width: 160px; }
.z4-refs { color: var(--text-dim); }
.z4-empty { color: var(--text-muted); font-style: italic; font-size: 11px; padding: 4px 8px; }

/* Z5 */
.z5-content { padding: 8px 0; }
.z5-section-title {
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--text-muted);
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border-dim);
}
.z5-raw {
  background: var(--bg-base);
  padding: 8px;
  margin-bottom: 6px;
  border-radius: 2px;
  font-size: 10px;
  color: var(--text-dim);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
.z5-truncated { color: var(--text-muted); font-size: 10px; padding: 4px 0; }

/* Checkpoint Bar */
.checkpoint-bar {
  padding: 8px 16px;
  background: var(--bg-deep);
  border-top: 1px solid var(--border-dim);
}
.checkpoint-label {
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.checkpoint-row {
  display: flex;
  gap: 12px;
  font-size: 11px;
  padding: 2px 0;
}
.checkpoint-id { color: var(--green); min-width: 280px; }
.checkpoint-phase { color: var(--text-dim); flex: 1; }
.checkpoint-ts { color: var(--text-muted); }

/* Hero Moments Panel */
.hero-moments-panel, .learning-panel {
  margin-bottom: 20px;
  border: 1px solid var(--border-dim);
  border-radius: 4px;
  background: var(--bg-panel);
  padding: 16px;
}
.panel-header {
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--orange);
  margin-bottom: 4px;
  font-weight: bold;
}
.panel-subtitle {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 12px;
  font-family: var(--font-ui);
}
.hm-row, .le-row {
  padding: 8px;
  background: var(--bg-deep);
  border-radius: 2px;
  margin-bottom: 6px;
}
.hm-id, .le-id {
  font-size: 10px;
  color: var(--accent);
  margin-right: 8px;
}
.hm-type, .le-state {
  font-size: 10px;
  color: var(--yellow);
  padding: 1px 6px;
  background: rgba(255,215,0,0.1);
  border-radius: 2px;
}
.le-cat {
  font-size: 10px;
  color: var(--text-muted);
  margin-left: 8px;
}
.hm-desc, .le-title {
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 4px;
  font-family: var(--font-ui);
}
.hm-metric, .le-cap {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 2px;
}
.panel-truncated { color: var(--text-muted); font-size: 10px; margin-top: 4px; }

/* Learning Panel */
.learning-panel .panel-header { color: var(--green); }

/* Governance Footer */
.governance-footer {
  display: flex;
  gap: 24px;
  padding: 16px 24px;
  background: var(--bg-deep);
  border: 1px solid var(--border-dim);
  border-radius: 4px;
  margin-top: 32px;
}
.footer-section { flex: 1; }
.footer-label {
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.footer-value {
  font-size: 11px;
  color: var(--text-dim);
}
</style>"""

    def _render_scripts(self) -> str:
        return """<script>
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.zoom-controls').forEach(function(controls) {
    var container = controls.closest('.zoom-container');
    var buttons = controls.querySelectorAll('.zoom-btn');
    var levels = container.querySelectorAll('.zoom-level');

    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var zoom = btn.getAttribute('data-zoom');
        buttons.forEach(function(b) { b.classList.remove('active'); });
        levels.forEach(function(l) { l.classList.remove('active'); });
        btn.classList.add('active');
        container.querySelector('.z' + zoom).classList.add('active');
        container.setAttribute('data-current-zoom', zoom);
      });
    });

    if (buttons.length > 0) buttons[0].classList.add('active');
  });

  document.querySelectorAll('.timeline-node').forEach(function(node) {
    node.addEventListener('click', function() {
      var phase = node.getAttribute('data-phase');
      var chapter = document.querySelector('.chapter[data-phase="' + phase + '"]');
      if (chapter) {
        chapter.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
</script>"""


def h(text: str) -> str:
    return html.escape(str(text))


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Genesis Chronicle Compiler")
    parser.add_argument("--client", required=True, help="Client ID")
    parser.add_argument("--run-id", required=True, help="Run ID")
    parser.add_argument("--run-dir", required=False, help="Override run directory")
    args = parser.parse_args()

    if args.run_dir:
        run_dir = Path(args.run_dir)
    else:
        run_dir = Path(f"clients/{args.client}/psee/runs/{args.run_id}")

    if not run_dir.exists():
        print(f"FAIL: run directory not found: {run_dir}")
        return 1

    chronicle_dir = run_dir / "chronicle"
    if not chronicle_dir.exists():
        print(f"FAIL: chronicle directory not found: {chronicle_dir}")
        print("Run the pipeline with chronicle emission first (GEN-1+)")
        return 1

    compiler = GenesisChronicleCompiler(args.client, args.run_id, run_dir)
    compiler.load()

    print(f"Genesis Chronicle Compiler")
    print(f"  Client:       {args.client}")
    print(f"  Run:          {args.run_id}")
    print(f"  Events:       {len(compiler.events)}")
    print(f"  Checkpoints:  {len(compiler.checkpoints)}")
    print(f"  Hero Moments: {len(compiler.hero_moments)}")
    print(f"  Propositions: {len(compiler.propositions)}")
    print(f"  Learning:     {len(compiler.learning_events)}")
    print(f"  Governance:   {len(compiler.governance_events)}")

    output = compiler.compile()
    print(f"\n  COMPILED: {output}")
    return 0


if __name__ == "__main__":
    exit(main())
