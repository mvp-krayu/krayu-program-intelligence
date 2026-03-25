# Demo Sequence — 51.3
# Unified 9-Step Governed Demo Flow

Stream: 51.3 — Unified Demo Surface Recomposition & Contract Revalidation
Date: 2026-03-25
Supersedes: PIOS-42.9-RUN01-CONTRACT-v1 (7-step flow)

---

## Sequence

| Step | Name | Runtime Call | Layer | Duration |
|---|---|---|---|---|
| 1 | Entry | none (verbal) | 51.x composition | 15s |
| 2 | Query Selection | `?list=true` | 42.4 | 20s |
| 3 | Structural Overview | `?overview=true` | 42.6 | 20s |
| 4 | Topology Rendering | `?topology=true` | 42.7 | 20s |
| 5 | Highlight Focus | `?topology=true&highlight=GQ-003` | 42.7 + 42.25 | 20s |
| 6 | Emphasis Activation | (topology already loaded — emphasis:high visible) | 42.27 + 44.4C | 20s |
| 7 | Persona Selection | none (presentation layer) | ENL substrate | 15s |
| 8 | ENL Lens Application | `?query=GQ-003` | 42.4 + ENL governance | 20s |
| 9 | Executive Narrative | (query response already loaded) | 51.x composition | 30s |

**Total: ~3:00**

---

## Step Traceability

### Step 1 — Entry

**Action:** Demo context initialization — verbal framing only.

Governed authority:
- docs/program-intelligence-demonstrations/program_intelligence_demonstration_model.md (Layer 1–5 model)
- DEMO_CONTEXT.md (evidence-first principle)

No runtime call. No data displayed. Establishes:
- what ExecLens is
- what it is not
- that everything shown is governed, traceable, and non-synthetic

---

### Step 2 — Query Selection

**Action:** Select GQ-003 — "What is the blast radius if a core component fails?"

Runtime: `GET /api/execlens?list=true`
Adapter: scripts/pios/42.4/execlens_adapter.py
Output: list of 10 governed queries

Presenter selects GQ-003. This establishes the question before any data is shown.
All subsequent steps answer this question.

---

### Step 3 — Structural Overview

**Action:** Show the baseline structural condition.

Runtime: `GET /api/execlens?overview=true`
Adapter: scripts/pios/42.6/execlens_overview_adapter.py
Output: 4 gauge metrics — Dependency Load, Structural Density, Coordination Pressure, Visibility Deficit

Evidence layer:
- SIG-002 (Dependency Load — CAP-27, COMP-64/81/65/27)
- SIG-004 (Structural Volatility — CAP-29, COMP-01)
- SIG-005 (Coordination Pressure — CAP-40, COMP-88/89)

Presenter: "Before a single query executes, ExecLens already knows your structural condition.
Coordination pressure at 87.5%. Seven runtime dimensions unknown. Evidence-grounded, not estimated."

---

### Step 4 — Topology Rendering

**Action:** Show the full structural map.

Runtime: `GET /api/execlens?topology=true`
Adapter: scripts/pios/42.7/execlens_topology_adapter.py
Output: domain → capability → component hierarchy (4 domains, 5 capabilities, 9 components)

Emphasis field present on all nodes (from 44.2 projection attachment).
Current state: C_30_Domain_Event_Bus carries emphasis:high → renders as RED.

Presenter: "This is your architecture as ExecLens sees it — four domains, five capabilities,
nine components. These groupings came from your own query drill-downs. Nothing was invented."

Note to presenter: RED node (Domain Event Bus) is already visible. Do NOT reference it yet —
emphasis activation is Step 6. Acknowledge the structure only.

---

### Step 5 — Highlight Focus

**Action:** Apply query-linked topology highlighting.

Runtime: `GET /api/execlens?topology=true&highlight=GQ-003`
Adapter: scripts/pios/42.7/execlens_topology_adapter.py (--query GQ-003)
Output: same topology with highlighted=true on GQ-003 relevant nodes
CSS: topo-domain-highlighted (blue), topo-cap-highlighted (yellow), topo-chip-highlighted (teal)

Presenter: "Watch the topology respond to the question. These highlighted nodes are directly
referenced in the evidence for GQ-003 — traced from the query signal map through the evidence
index to your PIE vault."

---

### Step 6 — Emphasis Activation

**Action:** Surface projection-driven RED node emphasis.

Runtime: no additional call — topology already loaded with emphasis:high on C_30_Domain_Event_Bus
Rendering: topo-emphasis-red (border #ef4444, background rgba(239,68,68,0.12))
Source: docs/pios/44.2/projection_attachment.json → C_30_Domain_Event_Bus → emphasis:high
Governed by: 44.3 (emphasis attribute spec) + 44.4C (GQ-003 materialization)
Rendered by: 42.27 (red node activation)

Presenter: "This node appears in red. That is not an ExecLens decision. That emphasis value
was assigned upstream — in the governed projection layer — based on the structural position
of the Domain Event Bus relative to GQ-003. The system is showing you what the projection
layer already determined."

Presenter: "Domain Event Bus: DOMAIN-11, the sole component, COMP-65 — Event Driven Architecture.
This is your blast radius node. The emphasis is projection-driven, not estimated."

CUE-03 update (supersedes 51.2C CUE-03):
Previous state: all nodes emphasis:none → RENDER_NONE
Current state: C_30_Domain_Event_Bus emphasis:high → RENDER_RED active

Presenter MUST NOT claim: "ExecLens decided this node is important."
Presenter MUST say: "The projection layer assigned high emphasis upstream."

---

### Step 7 — Persona Selection

**Action:** Presenter selects audience lens — Exec / CTO / Analyst.

Runtime: none (presentation layer choice; 42.16 adapter absent from current branch)
ENL authority: ENL governance layer defines persona-scoped traversal
Dependency note: live persona routing requires 42.16 activation (separate 42.x stream)

Personas:
- **Exec**: "What does this mean for my program delivery commitment?"
- **CTO**: "What structural risk does this expose in my architecture?"
- **Analyst**: "What evidence gaps remain and what would close them?"

Presenter selects based on audience. No runtime call. Same governed query output applies.
The persona selection determines how Step 8 framing is delivered.

---

### Step 8 — ENL Lens Application

**Action:** Apply selected persona's perspective to the already-loaded query response.

Runtime: `GET /api/execlens?query=GQ-003` (returns signals, evidence, navigation)
Adapter: scripts/pios/42.4/execlens_adapter.py
Output: response template + intelligence signals + evidence chains + navigation

Persona framing applied at presentation layer (not runtime):

Exec framing:
"Three intelligence signals bound to this query. One component — the Domain Event Bus —
carries high-emphasis projection. If it fails, your event-driven architecture loses its
coordination hub. That's structural risk, not speculation."

CTO framing:
"COMP-65 is a single-component capability under DOMAIN-11. The emphasis:high assignment
traces to SIG-003 — Dependency Load Elevation — with evidence rooted in co-occurrence
across 7 dependencies. The blast radius is real and bounded."

Analyst framing:
"SIG-003 is in evaluable state — awaiting Stream 75.1 threshold activation. Two signals
(SIG-001, SIG-002) are blocked: runtime telemetry unavailable. Evidence gap exists.
The claim is structural, not runtime-confirmed."

ENL governance authority:
- docs/program-intelligence-demonstrations/demonstration_exec_intelligence.md
  (Step 1: Signal Review → Step 2: Contextualization → Step 3: Synthesis → Step 4: Interpretation)

---

### Step 9 — Executive Narrative

**Action:** Deliver evidence-grounded executive summary.

Runtime: already loaded — signals, evidence, navigation panels from `?query=GQ-003`
Output structure (from demonstration_exec_intelligence.md):

**Program Situation:**
"The Domain Event Bus (COMP-65 / DOMAIN-11) has been assigned high-emphasis projection
by the governed projection layer. It is the coordination hub for the Event-Driven Architecture domain."

**Evidence Basis:**
"SIG-003: Dependency Load Elevation — 15/22 dependency load ratio (0.682), evaluable state.
Evidence: ST-007, ST-010, ST-012, ST-013, ST-014, ST-015 (structural telemetry, static)."

**Intelligence Interpretation:**
"A failure of C_30_Domain_Event_Bus propagates to DOMAIN-11/CAP-30 and all components
that share its dependency surface. The blast radius is bounded but architecturally significant."

**Executive Implication:**
"The projection layer has flagged this node as high-emphasis. The signal is evaluable — not
confirmed runtime — but the structural dependency is governed and traceable. Attention warranted."

Presenter: "Three minutes. One question. One blast-radius node, identified through a
deterministic traversal of your own architecture artifacts. No inference. No estimates.
That is Program Intelligence."

---

## Unified Flow Summary

```
Entry → Question → Baseline → Structure → Focus → Emphasis → Persona → Lens → Narrative
                                                        ↑
                                              RED node visible here
                                              (C_30_Domain_Event_Bus
                                               emphasis:high via 44.4C)
```

All 9 steps flow from the SAME GQ-003 instance.
No parallel demo paths. No duplication. No synthetic data.

---

## Timing Summary

| Step | Duration | Cumulative |
|---|---|---|
| 1 — Entry | 15s | 0:15 |
| 2 — Query Selection | 20s | 0:35 |
| 3 — Structural Overview | 20s | 0:55 |
| 4 — Topology Rendering | 20s | 1:15 |
| 5 — Highlight Focus | 20s | 1:35 |
| 6 — Emphasis Activation | 20s | 1:55 |
| 7 — Persona Selection | 15s | 2:10 |
| 8 — ENL Lens | 20s | 2:30 |
| 9 — Executive Narrative | 30s | **3:00** |

---

## ENL Runtime Dependency Note

Steps 7–8 reference the ENL governance layer for persona framing.
Live persona-scoped routing (`?persona=P&query=GQ-003`) requires:
- scripts/pios/42.16/persona_view_map.py (absent from current branch)
- scripts/pios/42.15/enl_console_adapter.py (absent from current branch)

These are 42.x wiring dependencies. Required stream: 42.x ENL routing activation.
51.3 notes this dependency and composes from existing query output + ENL governance layer.
51.3 does NOT introduce synthetic persona logic.
