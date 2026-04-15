# Evidence Vault V2 Architecture
# PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01

- Version: 1.0
- Stream: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01
- Date: 2026-04-15
- Vault Root: `docs/psee/`

---

## SECTION 1 — V2 ARCHITECTURAL PRINCIPLE

The V1 vault was a file index with path references. It answered: "where is this documented?"

The V2 vault is an evidence graph. It answers: "why is this value true, where does it come from, and who can see it?"

**Core architectural formula:**

```
Execution chain computes
GAUGE renders operator-facing truth
Vault anchors evidence and traceability
LENS renders client-safe explanation
```

The computation engine is the upstream execution chain (Bootstrap, IG, PSEE, PiOS).
GAUGE does not compute the chain. It consumes governed outputs and renders them for operator-facing use.
GAUGE reads artifacts such as gauge_state.json, topology outputs, and signal registries, and exposes them through APIs and UI surfaces.
The Vault organizes and proves these outputs through traceable evidence chains.
LENS consumes vault-backed truth and projects it into client-safe narrative explanations.

---

## SECTION 2 — VAULT ROOT AND PHYSICAL STRUCTURE

Vault root: `docs/psee/`

The V2 vault uses `docs/psee/` as the Obsidian vault root. This means all wiki links resolve relative to this directory. The V1 vault under `PRODUCTIZE.GAUGE.OBSIDIAN.OPERATIONAL.WIKI.01/vault/` remains as a historical V1 seed — it is not replaced or destroyed.

The V2 vault is organized into node classes, not folders reflecting pipeline stages alone.

**V2 Proposed Physical Structure:**

```
docs/psee/
├── EVIDENCE.VAULT.V2/               ← V2 vault home (this stream's output)
│   ├── 00 — Graph Index/
│   │   ├── Evidence Vault Root.md
│   │   ├── Claim Registry Index.md
│   │   └── Entity Family Index.md
│   │
│   ├── 01 — Claims/                 ← CLAIM NODES
│   │   ├── CLM-01 Coverage Completeness.md
│   │   ├── CLM-09 Canonical Score.md
│   │   ├── CLM-14 Domain Count.md
│   │   ├── ... (27 claim nodes)
│   │
│   ├── 02 — Entities/               ← ENTITY NODES
│   │   ├── Entity Structural Units.md
│   │   ├── Entity Topology Nodes.md
│   │   ├── Entity Signals.md
│   │   ├── Entity Dimensions.md
│   │   ├── Entity Business Concepts.md
│   │   ├── Entity Score Components.md
│   │   └── Entity Reconstruction Axes.md
│   │
│   ├── 03 — Artifacts/              ← ARTIFACT NODES (explanation-rich)
│   │   ├── gauge_state.json.md
│   │   ├── coverage_state.json.md
│   │   ├── reconstruction_state.json.md
│   │   ├── canonical_topology.json.md
│   │   ├── signal_registry.json.md
│   │   ├── binding_envelope.json.md
│   │   └── admissibility_log.json.md
│   │
│   ├── 04 — Transformations/        ← TRANSFORMATION NODES
│   │   ├── T-Coverage Computation.md
│   │   ├── T-Reconstruction Computation.md
│   │   ├── T-Score Computation.md
│   │   ├── T-Topology Emission.md
│   │   ├── T-Signal Emission.md
│   │   ├── T-Concept Resolution.md
│   │   └── T-Label Resolution.md
│   │
│   ├── 05 — Client Lineage/         ← CLIENT LINEAGE NODES
│   │   ├── BlueEdge Lineage.md
│   │   └── Client Vault Template.md
│   │
│   ├── 06 — Surfaces/               ← SURFACE NODES
│   │   ├── Surface GAUGE.md
│   │   ├── Surface LENS (Design Target).md
│   │   ├── Surface Dual-Run.md
│   │   └── Surface Executive Overview.md
│   │
│   └── 07 — Governance/             ← GOVERNANCE NODES
│       ├── Exposure Policy.md
│       ├── Traceability Coverage.md
│       └── Blocked Mappings.md
```

This structure will be materialized in a follow-on execution. The current stream produces the specifications for this structure.

---

## SECTION 3 — NODE CLASS DEFINITIONS

### 3.1 Claim Nodes

One node per surfaced claim. Claim nodes are the primary queryable units of the vault.

**Purpose:** Answer "what does GAUGE claim?" with full evidence chain and exposure policy.

**Required fields for every Claim Node:**
- `claim_id` (CLM-XX)
- `claim_label`
- `claim_type` (metric | count | verdict | status | entity-summary | narrative-support | topology-summary | freshness/provenance | comparison/parity)
- **Explanation paragraph** — minimum one paragraph of human-readable logic explaining why this claim is true and what it means. Not just a path reference.
- `authoritative_value` — the actual value in the locked baseline
- `surfaced_location` — where this appears in the GAUGE product
- `source_trace` — chain of artifacts that produce this value
- `stage_of_origin` — which pipeline stage (S0/IG/L40.x/S1/S2/S3/S4)
- `exposure_classification` — per governance policy (Section 4)
- `entity_expansion` — whether this claim implies a browsable entity set
- `lens_candidate` — boolean + recommended phrasing
- `blocked_gaps` — any incomplete trace elements

**Example: CLM-09 Canonical Score Node**

```markdown
---
claim_id: CLM-09
claim_label: Proven Structural Score (60)
claim_type: metric
exposure: operator_visible + client_visible (summary only)
status: ACTIVE
---

## Explanation

The canonical score of 60 is the proven structural floor for this BlueEdge assessment run. It is computed as: 0 (completion) + 35 (coverage) + 25 (reconstruction) = 60. The score has three additive components. Coverage contributes 35 points because the structural evidence covers 100% of declared units — the maximum coverage award. Reconstruction contributes 25 points because all 30 units pass four-axis validation. Completion contributes 0 points because the PSEE execution engine has not been run against this model — the execution layer is pending. Until it is run, the score is structurally proven at 60 with a ceiling of 100 if execution completes.

## Source Trace

coverage_state.json (coverage_percent=100.0 → 35pts) + reconstruction_state.json (state=PASS → 25pts) + coverage_state.json (execution_layer_evaluated absent → 0pts)

→ gauge_state.json (canonical=60)
→ /api/gauge (score.canonical)
→ StatusBand "Proven Score" / ScoreGauge proven chip

## Stage of Origin: S4 (pios compute gauge)
```

### 3.2 Entity Nodes

One node per meaningful entity family. Entity nodes answer "what are the actual members of this set?" and "can a client see them individually?"

**Seven entity families identified:**

| entity_family | count | client_safe | drill_down_available |
|---------------|-------|-------------|---------------------|
| Structural Units (CEUs) | 30 | SUMMARY ONLY (counts) — individual file names are operator-only | Via IG admissibility_log.json |
| Topology Nodes | 148 (17+42+89) | YES — names and types are meaningful | Via topology explorer (TopologyAddon) |
| Signals | 5 | YES — title, statement, impact, risk | Via SignalAvailability panel (first 5) |
| Business Concepts | 19 active | YES (phrase output) — concept predicates are operator-only | Via overview.js concept resolution |
| Reconstruction Axes | 4 | CTO — axis names and results | axis_results in gauge_state.json |
| Score Components | 3 (completion/coverage/reconstruction) | YES — component values are explainable | score.components in gauge_state.json |
| Dimensions (DIM-01..06) | 6 | YES — dimension values are meaningful | RuntimeIntelligence panel |

Each entity node must contain:
- Entity family name and size
- Explanation of what the entities represent physically (what is a "domain"? what is a "CEU"?)
- Client-safe exposure policy per entity
- Whether individual entities are browsable vs summary-only
- Backlinks to claims that reference this entity set

### 3.3 Artifact Nodes

One node per artifact file (or artifact class). Artifact nodes are richer than V1 — they explain what the artifact is, why it exists, what transformation produced it, and what consumes it.

**Key example: gauge_state.json Artifact Node**

This file is the terminal output of the entire S0→S4 chain. It is the single artifact consumed by the GAUGE product surface. It contains six score dimensions (DIM-01..06), a canonical score, a projected score, an execution state, and a confidence band. Everything the client sees about the assessment is derived from this file plus the topology and signals artifacts. It is produced by `pios compute gauge` and read by `/api/gauge` via the `GAUGE_PACKAGE_DIR` environment variable.

The artifact node must document:
- File schema (Stream 10 schema vs legacy schema differences)
- Fields that are computed vs invariant vs derived vs read-through
- Consumption path (how the field flows to the UI)
- Explanation of why each major field exists

### 3.4 Transformation Nodes

One node per meaningful transformation. Transformation nodes explain the logic, not just the command.

**Example: T-Score Computation**

The score computation transformation reads three input fields from two source files: `coverage_state.json.coverage_percent` (→ coverage_points), `reconstruction_state.json.state` (→ reconstruction_points), and `coverage_state.json.execution_layer_evaluated` (→ completion_points gate). The coverage award formula is `round(coverage_percent × 0.35)` where 0.35 is the coverage weight constant. The reconstruction award is categorical: PASS→25, all other states→0. The completion award requires `execution_layer_evaluated=True` and then performs a terminal state lookup: S-13→40, S-T3→20, others→0. When execution_layer_evaluated=False (as in the current authoritative run), completion_points=0 regardless of terminal state. The canonical score is the sum. The projected score adds COMPLETION_WEIGHT=40 when execution is not evaluated.

This is the kind of explanation that is absent from V1 and required in V2.

### 3.5 Client Lineage Nodes

Client lineage nodes capture the full path from intake to product surface for a specific client. At minimum, BlueEdge must be documented.

**BlueEdge Lineage Node structure:**

```
BlueEdge Platform Assessment
  intake:    docs/pios/IG.RUNTIME/run_01/ (authoritative — original source absent)
  IG basis:  30 units admitted / 0 excluded
  chain:     S0→S1→S2→S3→S4 (L40.2/L40.3/L40.4 blocked for this lineage)
  run:       run_authoritative_recomputed_01
  package:   clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/
  surface:   /api/gauge + /api/topology + /api/signals
  score:     canonical=60, projected=100
  constraint: upstream source not recoverable — IG.RUNTIME/run_01 is floor
```

For future clients, the template must document:
- Client UUID / identifier
- Intake path (can use binding_envelope path if IG path is not applicable)
- Whether original source is recoverable
- Run chain path
- Surface binding mechanism

### 3.6 Surface Nodes

Surface nodes document what each rendering surface exposes — the claims it presents, the UI components, and the exposure audience.

**Four identified surfaces:**

| surface | primary audience | claims surfaced | status |
|---------|-----------------|-----------------|--------|
| GAUGE (index.js + topology.js) | Operator / CTO | CLM-01..18, CLM-27 | ACTIVE |
| Executive Overview (overview.js) | C-suite / Executive | CLM-09/10/25/26 | ACTIVE |
| LENS (design target) | Client | CLM-09/10/11/12/18/19/20..24/25/26 | DESIGN TARGET — not implemented |
| Dual-Run Comparison | Operator / Validation | All structural claims with run_id context | ACTIVE (forensic comparison complete) |

Surface nodes must document:
- Which claims are presented and how
- What audience the surface targets
- What claims are present in the underlying API but not rendered
- Navigation links to the relevant claim nodes

### 3.7 Governance Nodes

Three governance nodes:

1. **Exposure Policy** — the full governance matrix (see exposure governance spec)
2. **Traceability Coverage** — which claims are fully traced, which are partial, which are blocked
3. **Blocked Mappings** — all known absent paths, schema gaps, and semantic gaps with their resolutions

---

## SECTION 4 — EVIDENCE GRAPH LINKING MODEL

### 4.1 Primary Relation Types

| relation | direction | meaning |
|----------|-----------|---------|
| `PRODUCES` | transformation → artifact | Transform X produces artifact Y |
| `CONSUMES` | transformation → artifact | Transform X reads artifact Y |
| `SURFACES` | surface → claim | Surface X displays claim Y |
| `GROUNDS` | artifact → claim | Artifact X is the evidence for claim Y |
| `DERIVES` | claim → claim | Claim X is derived from claim Y |
| `GOVERNS` | governance node → claim | Policy P governs claim C's exposure |
| `CONTAINS` | entity family → entity | Family F contains entity E |
| `BELONGS_TO` | entity → client lineage | Entity E belongs to client lineage L |

### 4.2 Obsidian Link Conventions

Within the V2 vault:
- `[[CLM-09 Canonical Score]]` — link to claim node
- `[[gauge_state.json]]` — link to artifact node
- `[[T-Score Computation]]` — link to transformation node
- `[[BlueEdge Lineage]]` — link to client lineage node
- `[[Surface GAUGE]]` — link to surface node
- `[[Exposure Policy]]` — link to governance node

External repo paths (not in vault): cite as inline code only.

### 4.3 Claim → Artifact → Transformation Graph

The core evidence graph connects claims backward to their evidence:

```
CLM-09 Canonical Score
  ← GROUNDS: gauge_state.json → score.canonical
  ← PRODUCES: T-Score Computation
  ← CONSUMES: coverage_state.json (coverage_percent, execution_layer_evaluated)
  ← CONSUMES: reconstruction_state.json (state)
  ← CONSUMES: gauge_inputs.json (engine state)
  ← BELONGS_TO: BlueEdge Lineage
  ← GOVERNS: Exposure Policy (client_visible, summary_only)
  → SURFACES: Surface GAUGE (StatusBand "Proven Score: 60")
  → SURFACES: Surface Executive Overview (StatusBand + ScoreGauge)
```

Every claim node must contain this chain. Every artifact node must contain its producing transformation and consuming surfaces.

---

## SECTION 5 — V2 NODE TEMPLATE

All V2 vault nodes use this template:

```markdown
---
node_class: claim | entity | artifact | transformation | client-lineage | surface | governance
node_id: <CLM-XX | ENT-XX | ART-XX | TRN-XX | CL-XX | SRF-XX | GOV-XX>
status: ACTIVE | BLOCKED | DESIGN-TARGET | INFORMATIONAL
exposure: internal_only | operator_visible | client_visible | audit
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01
---

## Purpose
<why this node exists — one clear sentence>

## Explanation
<minimum one paragraph of human-readable logic. No path dumps. No "as described above".
Explain what this thing IS, WHY it exists, and HOW it relates to the product.>

## Authoritative Paths
- `<verified repo path>`

## Source / Producer / Consumer
- Produced by: `<pios command or transformation>`
- Consumed by: `<pios command, API route, or surface>`

## Authoritative Values (locked baseline)
| field | value |
|-------|-------|
| ... | ... |

## Evidence Chain
- `<source artifact>` → `<transformation>` → `<this artifact/claim>`

## Claim Relations
- Grounds: [[CLM-XX]]
- Derived from: [[CLM-XX]]

## Entity Expansion
<is there a browsable entity set here? how many members? client-safe?>

## Exposure Notes
<what audience can see this? what is hidden and why?>

## Blocked Mappings
- <any known absent paths or incomplete traces>

## Transitions
- ← Related: [[...]]
- → Consumes: [[...]]
```

---

## SECTION 6 — THE BINDING ENVELOPE AS A V2 SURFACE

The binding_envelope.json is a materially richer topology substrate that is currently unused in the canonical GAUGE product. It surfaces values that concepts.json predicates reference (overlap_present, signals_count, orphans) but that the canonical topology route does not expose in the same form.

**What binding_envelope exposes that canonical_topology.json does not:**
- Node-level signal binding (signals assigned to specific node_ids)
- Structural overlap edges with specific evidence IDs (OVL-01, OVL-02)
- Unknown-space records with specific evidence (USP-01/02/03)
- Orphan node detection
- Multi-parent node detection
- Resolved labels via full tokenization grammar (T-1..T-5, N-1..N-4)
- Client-specific scope (45 nodes for this client vs 148 canonical nodes)

The V2 vault must document this as a dual-surface reality:
- **Canonical surface:** 17/42/89 clean tree, 0 overlaps, 0 envelope signals — authoritative across all runs
- **Client-specific surface:** binding_envelope.json — richer, client-scoped, contains cross-domain topology and runtime-unknown markers

These are not contradictory. They answer different questions. The canonical surface says "what is structurally present". The client-specific surface says "how does this client's system specifically structure that presence".

The V2 vault must have nodes for both surfaces, with clear documentation of which claims each surface grounds.

---

## SECTION 7 — CLIENT VAULT STRATEGY

### 7.1 Model

Each client should be represented as a lineage subtree under `docs/psee/EVIDENCE.VAULT.V2/05 — Client Lineage/`. The subtree contains:
- Client identity node (UUID, name, assessment date)
- Intake lineage node (source → IG → admissibility)
- Run chain node (S0→S4 execution trace)
- Package artifact node (all 9 package files with values)
- Claim instance nodes (client-specific values for each claim)
- Surface binding node (which product instances serve this client)

### 7.2 BlueEdge Assessment: Current State

| property | value |
|----------|-------|
| Client name | BlueEdge Fleet Management Platform |
| Client ID | blueedge |
| Assessment basis | run_authoritative_recomputed_01 |
| IG basis | docs/pios/IG.RUNTIME/run_01/ (30 units) |
| Upstream source | NOT PRESENT (run_07_source_profiled_ingestion/) |
| Canonical score | 60 |
| Projected score | 100 |
| Surface instances | localhost:3001 (run_01_authoritative legacy), localhost:3002 (run_authoritative_recomputed_01 current) |
| Signals | 5 governed signals (SIG-001..005) |
| Known overlaps | 0 in canonical surface; 2 in binding_envelope |

### 7.3 Future Client Template

For a new client assessment, the lineage node must document:
1. Source intake path and whether original source is recoverable
2. Whether run-scoped IG is present or IG.RUNTIME legacy basis is used
3. Which chain steps were executed vs blocked
4. Complete package artifact values
5. Claim instance values (actual vs baseline comparison optional)
6. Surface binding (which GAUGE_PACKAGE_DIR points to this client)

### 7.4 Operator vs Client Path Distinction

The client vault surface must separate:
- **Operator path:** full chain visibility, blocked step explanations, technical dimension values, axis-level reconstruction detail, raw evidence refs
- **Client path (LENS):** narrative summary, proven score, signal titles and business_impact, executive section phrases, score range visualization

The vault proves both simultaneously by maintaining full internal traceability while governing what is surfaced per audience.

---

## SECTION 8 — WHAT V2 ADDS OVER V1

| V1 | V2 |
|----|-----|
| File index — lists what exists | Evidence graph — explains why claims are true |
| Path dump per stage | Transformation nodes with logic explanation |
| No claim registry | 27 claims with full trace and exposure policy |
| No entity inventory | 7 entity families with drill-down eligibility |
| No client differentiation | Client lineage subtrees |
| No exposure governance | Full four-zone governance matrix |
| No LENS design | LENS as first-class design target surface |
| No dual-surface model | Canonical vs binding_envelope documented |
| No gap analysis readiness | V3 gap map prepared |

Authority: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01
