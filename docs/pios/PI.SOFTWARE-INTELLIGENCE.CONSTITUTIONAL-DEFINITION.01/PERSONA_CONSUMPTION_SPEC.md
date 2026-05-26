# Persona Consumption Specification — Software Intelligence Module

Stream: PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01
Classification: G1 — Architecture-Mutating
Date: 2026-05-26
Runtime anchor: PR #16 — LensSQOOrchestrationAdapter + SoftwareIntelligenceField

---

## 1. Consumption Architecture — What the Runtime Proves

The runtime consumption model is NOT a future spec. PR #16 implemented the path from SQO artifacts to operator display:

```
SQO Artifacts (disk)
        │
        ▼
OperatorWorkflowResolver.resolveAuthorityWorkspace()
        │ returns workspace object
        ▼
LensSQOOrchestrationAdapter.deriveOrchestrationActions(workspace)
        │ computes guided actions
        ├── enrichActionsWithLearning(actions, learningSignals)
        │ attaches advisory context
        ▼
SoftwareIntelligenceField.jsx
        │ renders per-action cards
        └── GuidedActionCard → operator interaction
```

Learning context enrichment operates on 4 action types:

| Action Type | Learning Context | Content |
|---|---|---|
| `sqo-review-unresolved` | `review_history` | accept_rate, reject_rate, contest_rate, summary |
| `sqo-promotion-request` / `sqo-promotion-approve` | `progression_history` | transitions, holds, hold_to_advance_ratio, summary |
| `sqo-review-contested` | `governance_friction` | summary of escalation pattern |
| `sqo-arbitration` | `escalation_pattern` | arbitration activity context |

Learning context is ALWAYS `null` until explicitly set by `enrichActionsWithLearning()`. It never affects priority, eligibility, or authority.

---

## 2. Current Persona Consumption (Proven)

PR #16 operates through a single projection path — the Software Intelligence Field — that is visible across persona modes. The guided action cards render the same data regardless of persona. This is the current reality.

### What Each Persona Sees Today

| Persona | SW-Intel Consumption | Source |
|---|---|---|
| BOARDROOM | SQO posture summary in flagship view. Qualification state as governance readiness signal. Guided actions visible but not primary focus | `lens-v2-flagship.js` SQO region |
| EXECUTIVE_BALANCED | Same SQO workspace projection. Guided actions with learning context. Action evidence grids | `SoftwareIntelligenceField.jsx` |
| EXECUTIVE_DENSE | Same projection surface. Full action metadata visible. Workflow stamps and evidence references | `SoftwareIntelligenceField.jsx` |
| INVESTIGATION_DENSE | Same projection surface. Full evidence depth on action cards | `SoftwareIntelligenceField.jsx` |

### Honest Assessment

Persona differentiation for SW-Intel is NOT yet implemented. All four personas receive the same GuidedActionCard rendering. The per-persona consumption model described below is constitutional — it defines what SHOULD differ when the projection layer is built.

---

## 3. Constitutional Persona Consumption (Target)

When the governed projection object model is implemented (PI.LENS.GOVERNED-PROJECTION-OBJECT-MODEL.01), persona consumption differentiates:

### BOARDROOM Consumption

7 executive consequence channels (formalized from BOARDROOM_SOFTWARE_INTELLIGENCE_ADVISORY.md):

| Channel | Constitutional Definition | Current Status |
|---|---|---|
| Architectural Gravity Concentration | Where structural mass concentrates — which domains carry disproportionate weight | Available via PSIG/DPSIG signals. No SW-Intel operational typing |
| Backend/Infrastructure Pressure Corridor | Pressure concentrating in backend orchestration layers | Pressure zones computed (75.x). No topology rendering — GAP per PRESSURE_TOPOLOGY_SPEC.md |
| Dependency Propagation with Operational Names | Propagation chains with domain-specific vocabulary | Propagation data exists. No SW-Intel naming layer |
| Repository Topology Asymmetry with Named Domains | Topology cluster imbalance with operational labels | Topology rendered in LENS. No operational labeling |
| Coupling Pressure as Structural Risk | Cross-domain coupling framed as governance/deployment risk | PSIG-001 coupling_pressure operational. No executive framing |
| Module-Level Coverage Asymmetry | Testing/validation gaps per operational domain | Partially visible via qualification blockers |
| Operational Fragility Signals | Import hub pressure, fan asymmetry at file level | ISIG-001, ISIG-002 operational. No BOARDROOM projection |

**Current gap:** BOARDROOM sees SQO qualification posture and guided actions, but not the 7 executive consequence channels with SW-Intel operational vocabulary. The channels require the projection compiler that does not yet exist.

### BALANCED Consumption

Operational narrative with domain-specific vocabulary replacing structural labels. Currently: guided action cards with learning context summaries (text-based advisory). Target: full operational narrative where "SP-blueedge-0017 review_accept" becomes "Platform Infrastructure governance review accepted — 3 downstream qualification gates unblocked."

### DENSE Consumption

Topology role labels on domains, pressure zone operational types, execution corridor overlays. Currently: structural topology without SW-Intel labeling. Target: topology renders with operational role names (RUNTIME_SPINE → "Orchestration Hub") and pressure zone operational types (COMPOUND_ZONE → "deployment coordination instability").

### INVESTIGATION Consumption

Full abstraction lineage, role-to-structural trace, pressure interpretation evidence. Currently: full evidence depth on action cards and learning context detail rows. Target: complete trace from SW-Intel operational claim → PI Core structural evidence.

---

## 4. Learning Context Consumption (Operational)

Learning context is the one area where SW-Intel persona consumption IS operational today:

```jsx
{action.learningContext && (
  <div className="sw-intel-guided-action-learning" data-type={action.learningContext.type}>
    <div className="sw-intel-guided-action-section-label">Learned from event history</div>
    <div className="sw-intel-guided-action-learning-summary">{action.learningContext.summary}</div>
    {action.learningContext.type === 'review_history' && (
      <div className="sw-intel-guided-action-learning-detail">
        <span data-type="ok">{action.learningContext.accept_rate}% accepted</span>
        <span data-type="warn">{action.learningContext.reject_rate}% rejected</span>
        <span data-type="dim">{action.learningContext.contest_rate}% contested</span>
      </div>
    )}
  </div>
)}
```

This is the constitutional template for persona-specific learning consumption:
- BOARDROOM: learning summary only (one-line executive context)
- BALANCED: learning summary + key rates
- DENSE: full learning context with all pattern data
- INVESTIGATION: learning context + event source references + derivation trace

---

## 5. Gap Register Impact on Persona Consumption

| Gap | Persona Impact |
|---|---|
| GAP-01 (evidence_refs empty) | INVESTIGATION cannot trace from guided action → structural evidence that informed the operator |
| GAP-03 (no confirmation ceremony) | All personas execute actions immediately without preview of state change |
| GAP-04 (learning is descriptive only) | No persona receives prescriptive guidance or outcome prediction |
| GAP-05 (no before/after display) | No persona sees the governance record of what changed |
| GAP-08 (no graph-based progression) | No persona sees which action unlocks which future corridor |
