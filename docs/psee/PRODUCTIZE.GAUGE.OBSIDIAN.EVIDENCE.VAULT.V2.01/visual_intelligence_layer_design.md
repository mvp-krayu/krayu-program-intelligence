# Visual Intelligence Layer Design
# PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01

- Version: 1.0
- Stream: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01
- Date: 2026-04-15

Assessment criteria applied to every visual recommendation:
- Explainability: does this visualization make evidence clearer or just more impressive?
- Evidence-first integrity: can every visual element be traced to a verified artifact?
- Commercial demo value: would a client executive or technical buyer find this compelling?
- Operator usefulness: does this help an operator navigate or diagnose?
- Implementation realism: what actually exists or could be built without reinventing infrastructure?

---

## SECTION 1 — CURRENT VISUAL SURFACE (WHAT EXISTS NOW)

GAUGE currently has four visual elements worth analyzing:

**1. ScoreGauge bar (overview.js):** A horizontal bar with a solid fill for canonical score (60%), a gap section for the completion weight (40%), a tick mark at the proven floor, and a tick mark at the achievable ceiling. Simple, clean. Commercial value: HIGH. The score range [60, 100] is immediately understood as a floor-to-ceiling range. This is already a good visualization.

**2. StructuralGraph mini bars (overview.js):** Three horizontal bars for Domains/Cross-Domain/Runtime Unknown proportions. Simple distribution visualization. Commercial value: MODERATE — it communicates structural distribution quickly, but the "Cross-Domain: 0" and "Runtime Unknown: 0" bars are currently zero, making them invisible. Only useful when these are non-zero.

**3. StatusBand metrics strip (overview.js):** Five horizontal chips: Proven Score, Achievable, Domains, Runtime Unknown, Cross-Domain. Clean and impactful. Commercial value: HIGH as an at-a-glance summary row.

**4. Topology explorer (topology.js via TopologyAddon):** Full interactive node explorer with the 148-node tree. Commercial value: HIGH for technical buyers. The ability to click through domains → capabilities → components is genuinely impressive and evidence-backed.

These four are the foundation. Everything in this section builds on or extends them.

---

## SECTION 2 — OBSIDIAN NATIVE VISUAL CAPABILITIES

### 2.1 What Obsidian Does Well Natively

**Graph view (native):** Obsidian renders the link graph between all notes as a force-directed 2D graph. With the V2 vault structure (27 claim nodes, 7 entity nodes, 7 artifact nodes, 7 transformation nodes, etc.) and explicit link structure, the graph will show a rich evidence web. Claim nodes will cluster around their grounding artifacts. The score claim will sit visually close to gauge_state.json and T-Score Computation.

Assessment: HIGH value for operator use and internal demonstration. The graph view of the V2 vault will immediately convey the evidence-first architecture. Clients viewing a vault walkthrough will see visually that every claim is connected to artifacts and transformations — this is more persuasive than any slide.

**Local graph (native):** Shows all notes within N hops of a selected note. Opening a claim node (e.g., CLM-09 Canonical Score) will show its immediate artifact connections, the transformation that produced it, and the surfaces that display it. This is already a "claim drill-down" without any plugin.

**Dataview (plugin — community):** Dataview queries YAML frontmatter and inline fields to generate tables and lists dynamically. With V2 vault nodes using consistent YAML frontmatter (`claim_type`, `exposure`, `stage_of_origin`, `traceability`), Dataview can generate:
- "All ZONE-2 (LENS) admissible claims" table
- "All claims with partial traceability"
- "All entity families with client_safe=YES"
- "All blocked mappings"

Assessment: HIGH value for vault navigation and gap analysis. Low implementation cost — Dataview is widely used and well-maintained.

**Canvas (native in Obsidian 1.x+):** Allows creating freeform visual boards with note cards, connections, and text labels. Can be used to build:
- The claim → artifact → transformation lineage graph manually arranged
- An executive-facing view showing the three-axis verdict with explanatory cards
- A "client readiness" board showing which claims are LENS-admissible vs pending

Assessment: MEDIUM value. Canvas is powerful but manually maintained. Best for fixed demonstration views, not dynamically updated evidence maps.

### 2.2 What Obsidian Cannot Do Well

- Dynamic data binding (reading live artifact JSON files into notes automatically)
- Interactive node-level topology exploration (this belongs in the web app)
- Real-time claim validation against fresh run outputs
- Client-facing delivery (Obsidian is an operator tool, not a client surface)

---

## SECTION 3 — RECOMMENDED VISUAL INTELLIGENCE UPGRADES

### 3.1 Enriched Claim → Evidence Graph (Obsidian native + Dataview)

**What:** Use the V2 vault link structure to produce a navigable evidence graph where each claim node connects visually to its grounding artifacts, producing transformations, and consuming surfaces.

**How:** Ensure all V2 vault nodes use consistent frontmatter and explicit Obsidian `[[links]]`. The Obsidian graph view does the rest. Supplement with a Canvas note that shows the top-level architecture: CLAIM → ARTIFACT → TRANSFORMATION → SOURCE → SURFACE.

**Commercial value:** In a demo session, an operator or technical reviewer opening the GAUGE vault in Obsidian and seeing the full evidence web — 27 claims, 7 artifacts, 7 transformations, all linked — is immediately convincing. It shows that every number has a verified origin.

**Implementation realism:** ZERO new code required. This is pure vault content structure. The V2 vault nodes (to be materialized in a follow-on stream) produce this graph automatically.

### 3.2 Claim → Evidence Drill-Down (Obsidian local graph + Canvas)

**What:** For a specific high-value claim like CLM-09 (Canonical Score), show all connected nodes within 2 hops. This reveals: score → gauge_state.json → T-Score Computation → coverage_state.json + reconstruction_state.json → admissibility_log.json → IG.RUNTIME/run_01.

**How:** Obsidian local graph with depth=2. Supplement with a Canvas note: "Evidence Chain for Canonical Score 60" with manual card layout showing the chain.

**Commercial value:** HIGH for client due diligence conversations. "Here is exactly how we arrived at 60. Every number has a source. You can trace it." This is a differentiator.

**Implementation realism:** Low cost. Local graph is native. Canvas card is a one-time layout.

### 3.3 Signal Intelligence Cards (in-vault or GAUGE UI)

**What:** Display each of the 5 signals as a rich evidence card with: title, evidence_confidence badge, business_impact paragraph, risk paragraph, and trace links.

**Where to implement:** Two options:
- Option A: In the GAUGE UI — a dedicated `/signals` page with full signal cards (title + business_impact + risk + confidence badge), accessible from the main page. GAUGE currently shows a minimal `SignalAvailability` panel. A full signal explorer page would be more commercially impressive.
- Option B: In the V2 vault — a set of 5 signal entity nodes, each with the full signal content formatted as an evidence card.

**Assessment of Option A vs B:** Option A (in the GAUGE UI) has higher commercial impact — it directly upgrades what a client sees. Option B (in the vault) serves operators and auditors. Both should be done. The GAUGE UI signal page requires a new `/signals` page and a new `/api/signals` enriched response (already has all data). The vault signal entity nodes are zero-code.

**Commercial value of signal cards:** VERY HIGH. Signal SIG-002 ("Seven operational dimensions of the platform are currently unknown") is a powerful, credible, evidence-backed business claim. Showing it as a formatted card with business_impact and risk — traceable to specific source references — is immediately valuable to a CTO or executive audience.

### 3.4 Score Range Visualization (GAUGE UI enhancement)

**What:** Extend the existing ScoreGauge to include:
- Confidence band annotation: "Proven 60 — Gap 40 — Achievable 100"
- CONDITIONAL band label displayed prominently
- Tooltip on the gap section: "This gap closes when execution assessment runs"

**How:** Minor CSS/JSX additions to `ScoreGauge` in overview.js. No data source changes needed — `projection.value`, `score.canonical`, and `confidence.status` are already in the API response.

**Commercial value:** HIGH. The current gap visualization is good but unlabeled. Adding "Achievable" label and "Proven" label with the band explanation converts a bar chart into a narrative.

**Implementation realism:** Very low — 20-30 lines of JSX/CSS.

### 3.5 Entity Cluster View (Obsidian Graph with grouping)

**What:** Use Obsidian graph group coloring to color-code vault nodes by type: claim nodes (blue), artifact nodes (orange), transformation nodes (green), entity nodes (purple), surface nodes (yellow).

**How:** Obsidian graph settings → Groups → regex patterns on note names or YAML frontmatter values. With consistent frontmatter `node_class: claim` etc., this is achievable.

**Commercial value:** MEDIUM for demo purposes. HIGH for operator navigation. Color-coded evidence graph is immediately readable.

**Implementation realism:** Zero code. Pure Obsidian settings.

### 3.6 Dual-Run Comparison Visualization (GAUGE UI or Canvas)

**What:** A side-by-side or diff-style view showing run_01_authoritative vs run_authoritative_recomputed_01 across all structural fields.

**Where:** Already documented in the vault (Dual-Run Comparison node). Could be visualized as:
- A Canvas note in the vault with two columns of cards
- A future `/compare` route in GAUGE if dual-run becomes a product feature

**Commercial value:** HIGH for demonstrating schema consistency and proving that the new schema adds semantics without changing structural truth.

**Implementation realism:** Canvas version is zero-code. Web route version requires new API endpoint and UI component.

---

## SECTION 4 — LENS SURFACE DESIGN (CLIENT-FACING PREMIUM LAYER)

LENS does not yet exist as code. This section defines its design as a product surface.

### 4.1 What LENS Should Be

LENS is a client-facing projection layer over GAUGE evidence. It shows the same underlying truth as GAUGE but through the exposure governance policy — narrative explanations instead of dimension IDs, business_impact instead of technical statements, score range instead of raw components.

LENS is not a dashboard. It is an evidence-backed brief. It should feel like a premium analyst report, not a metrics screen.

### 4.2 LENS Page Structure (Proposed)

**Page 1: Executive Summary**
- Three-axis verdict (STRUCTURE · STRONG / COMPLEXITY · LOW / EXECUTION · UNKNOWN)
- One-paragraph executive statement (from resolver + phrase output)
- Score range bar: [60 proven ──── 100 achievable]
- Three-line summary of key metrics: "30 structural elements mapped · 5 intelligence signals · 17 structural domains"

**Page 2: What We Found** (expandable sections)
- "What is structurally sound" (CONCEPT-01/03/07/12/13/14/15/17 → phrases)
- "Where complexity concentrates" (CONCEPT-08/09/10/11/16 → phrases)
- "What remains outside control" (CONCEPT-04/05/06/18/19 → phrases)

**Page 3: Intelligence Signals** (5 signal cards)
- Each signal: title + business_impact + risk + confidence badge
- SIG-002 and SIG-001 first (STRONG evidence)
- SIG-005 with explicit "Partial evidence" caveat

**Page 4: Evidence Reference**
- Score derivation in plain language
- "How we measured this" — each dimension in one sentence
- Trace trail: "This assessment is grounded in 30 structural artifacts verified by an independent ingestion pipeline."

### 4.3 Why LENS > GAUGE for Client Delivery

GAUGE is built for operators. It uses DIM-XX, axis names, execution_status codes. These are precise but require technical interpretation. A CTO reviewing a GAUGE output needs to translate it into business terms.

LENS removes that translation burden without losing evidence integrity. Every phrase in LENS is concept-grounded (concepts.json), and every concept predicate is artifact-grounded (gauge_state.json fields). The chain is unbroken. What changes is the vocabulary layer at the top.

---

## SECTION 5 — PREMIUM VISUALIZATION OPTIONS

### 5.1 Topology Graph (2D Interactive — Web)

The existing topology explorer (TopologyAddon) is already a good 2D interactive tree. The upgrade path is:
- Add signal badges to signal-bearing nodes (when binding_envelope path is used — nodes have signals[] from run_335c0575a080)
- Add overlap edge highlighting (2 edges in binding_envelope case)
- Add "depth filter" controls: show domains only / domains+capabilities / full tree
- Add node inspector panel showing node_id, display_label, grounding, evidence_refs

**Assessment:** This is the right 2D topology view. Signal-adorned nodes, overlap highlights, and a depth slider would make it significantly more commercially impressive. Implementation cost: medium (10-20 hours of UI work using existing data).

### 5.2 2.5D / 3D Topology Visualization

**When useful:** A 3D force-directed graph of the 148-node topology would allow visualization of cluster density, cross-domain connections, and structural depth simultaneously. A "zoom into domain" interaction would reveal capabilities and components as nested clusters.

**When gimmicky:** A pure 3D rotation for its own sake. If the 3D view does not allow interaction that reveals information not available in 2D, it is a gimmick.

**Honest assessment:** For a 148-node tree with a clear 3-level hierarchy (domains → capabilities → components), 2D hierarchical layout (the current approach) is actually more readable than 3D. The tree structure is well-suited to 2D. A 3D view adds value only if signal overlays, cross-domain overlay edges, and temporal change are simultaneously visible — which would require both the binding_envelope data and historical run comparison data.

**Recommendation:** Do not prioritize 3D now. The 2D topology explorer is already visually compelling. Invest in signal overlay and node inspector before 3D. When multiple client runs are available (historical comparison), revisit 3D or 2.5D for change visualization.

### 5.3 Provenance / Freshness Timeline

**What:** A visual timeline showing when each artifact was produced: intake → IG → S1 → S2 → S3 → S4 → validate freshness. Each stage node shows its production timestamp and whether the verdict is FRESH or STALE.

**Data available:** `engine_state.json` contains timestamps; `gauge_state.json.computed_at` timestamp; `pios validate freshness` verdict.

**Commercial value:** HIGH for showing clients that the assessment is fresh and governed. "Every artifact in this assessment was computed on 2026-04-15 and validated as GOVERNED AND FRESH THROUGH S4." This is a trust-building visual.

**Implementation:** Medium cost. Can be built as a static diagram in Obsidian Canvas for the vault, or as a UI component in GAUGE overview.

### 5.4 Evidence Confidence Distribution Chart

**What:** A visual breakdown of the 5 signals by confidence level (STRONG:2, MODERATE:2, WEAK:1) shown as a bar or pie chart.

**What it communicates:** "How well-evidenced are our findings?" The distribution itself is a credibility signal — 4 of 5 signals are at STRONG or MODERATE confidence.

**Commercial value:** HIGH for LENS. Showing that 80% of signals have STRONG or MODERATE evidence demonstrates rigor without requiring the client to understand the specific evidence chains.

**Implementation:** Very low. The `/api/signals` response already returns `by_confidence`. A small chart component using existing data.

### 5.5 Score Component Waterfall (Explanation Visual)

**What:** A waterfall chart showing how the canonical score of 60 is built: 0 (completion, pending) + 35 (coverage, proven) + 25 (reconstruction, proven) = 60. Then shows the 40-point ceiling as a pending gap: 60 + 40 (execution, pending) = 100 projected.

**Commercial value:** HIGH. The waterfall makes the score composition immediately legible. "You have 35 points for visibility and 25 points for structural integrity. The remaining 40 points come from execution assessment."

**Implementation:** Low cost. A simple CSS waterfall or SVG bar chart using existing score component data. The data is already in `/api/gauge`.

### 5.6 Signal → Node Map (Topology + Signal Overlay)

**What:** In the topology explorer, highlight the nodes associated with each signal. SIG-001 anchors to COMP-74 and COMP-75. SIG-002 anchors to COMP-64, COMP-81, COMP-65, COMP-27. This would allow a client or operator to see: "here is where in the structural model each signal is located."

**Commercial value:** VERY HIGH for technical buyers. "Your sensor bridge sits here in the Edge Data Acquisition domain, and this is why we flagged it." Visual, spatial, evidence-backed.

**Data availability:** `signal_registry.json` contains `domain_id`, `capability_id`, `component_ids` for each signal. The topology API returns the full node tree. Mapping signals to nodes requires matching by ID.

**Implementation:** Medium cost. Requires: (1) passing signal domain/component IDs into the topology renderer, (2) adding a signal badge or highlight class to matching nodes, (3) a toggle control to show/hide signal overlays.

---

## SECTION 6 — OBSIDIAN PLUGIN RECOMMENDATIONS

| plugin | use case | assessment |
|--------|----------|------------|
| **Dataview** | Dynamic claim/entity tables from YAML frontmatter | STRONGLY RECOMMENDED — essential for V2 vault navigation |
| **Graph Enhancement (Juggl)** | Interactive, filterable graph with grouping, shapes, and hover panels | WORTH EVALUATING — provides more control than native graph for evidence-type graphs. Check version compatibility. |
| **Excalidraw** | Embedded vector drawings within notes | USEFUL for transformation diagrams and score waterfall within notes |
| **Folder Notes** | Makes folder-level notes work more intuitively | LOW PRIORITY but improves vault navigation |
| **Hover Editor** | Preview note content on hover without leaving current note | USEFUL for dense claim graphs |
| Canvas (native) | Freeform visual boards | USE — for evidence chains and LENS design mockups |
| **Templater** | Dynamic note templates | USEFUL for automating V2 vault node creation to ensure consistent frontmatter |

**Explicitly NOT recommended:**
- 3D graph plugins at this stage — see Section 5.2 rationale
- Kanban plugins — the vault is not a task board
- Publishing plugins for client delivery — LENS should be a separate web surface, not a published Obsidian vault

---

## SECTION 7 — PHASED VISUAL INTELLIGENCE ROADMAP

### Phase 1 (Current stream + follow-on): Vault Evidence Graph

Materialize V2 vault nodes with consistent frontmatter. Resulting Obsidian graph = evidence web with color-coded node classes. Dataview tables for claim navigation. Canvas evidence chain for CLM-09. Zero web code required.

**Output:** Convincing operator/auditor visual surface. Walkable in Obsidian.

### Phase 2: GAUGE UI Enhancements

1. ScoreGauge labels ("Proven / Achievable / Gap")
2. Evidence confidence chart (5 signals × 3 tiers)
3. Score waterfall component
4. Signal detail cards page (`/signals`)
5. Node signal overlay in topology explorer

**Output:** Commercially impressive GAUGE demo. Every enhancement uses existing data.

### Phase 3: LENS Surface

1. Executive summary page (concept resolution → executive narrative)
2. "What we found" three-section page (phrase output)
3. Signal cards page (business_impact + risk)
4. Evidence reference page ("how we measured this")

**Output:** Client-delivery surface. Evidence-first throughout.

### Phase 4: Advanced Visualization (when warranted)

1. Signal → node map in topology explorer
2. Provenance timeline
3. Historical run comparison (multiple client runs)
4. Binding envelope cross-domain overlay (when envelope data is in canonical surface)

**Output:** Premium demonstration layer. For clients evaluating long-term engagement.

Authority: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01
