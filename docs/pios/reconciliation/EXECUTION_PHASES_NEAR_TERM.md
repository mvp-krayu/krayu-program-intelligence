# Execution Phases — Near Term

> **What gets built, in what order, toward commercially realistic delivery.**

---

## 1. Current State

| Asset | Status |
|---|---|
| PATH A structural substrate | FROZEN, certified (e8a369d) |
| PATH B semantic reconstruction | OPERATIONAL, BlueEdge at HYDRATED (Q-02) |
| SQO qualification engine | OPERATIONAL, 18 engines, 12 cockpit sections |
| LENS v2 flagship | OPERATIONAL, rendering with disclosure |
| Evidence rebase corridor | OPERATIONAL |
| Reconciliation bridge | NOT IMPLEMENTED — defined in this stream |
| AI-assisted reconstruction | NOT IMPLEMENTED — positioned in this stream |
| Graduated grounding model | NOT IMPLEMENTED — defined, binary only today |

---

## 2. Phase 1: Reconciliation Foundation

**Goal:** Build the minimum reconciliation bridge that can produce a correspondence report for BlueEdge.

### Deliverables

| Deliverable | Description |
|---|---|
| Registry correspondence table | DOM-01→DOM-17 mapped to CLU/CAP/vault registries |
| Evidence strength classifier | Per-domain graduated confidence (5-level) |
| Reconciliation report | Structured output: domain → evidence → confidence |
| Human approval corridor | Operator review/approve interface for reconciliation results |

### Prerequisites
- PATH A vault anchors inventory (exists)
- PATH B semantic domain model (exists — SemanticActorHydrator)
- Crosswalk mapping (exists — SemanticCrosswalkMapper, semantic_continuity_crosswalk.json)

### What This Phase Proves
- Reconciliation is mechanically feasible
- Correspondence can be compiled from existing data
- The graduated confidence model works in practice
- The HYDRATED → RECONCILED transition is achievable for BlueEdge

### Branch: feature/pios-core (L2-L4 work)

---

## 3. Phase 2: LENS v2 Reconciliation Visibility

**Goal:** Make reconciliation data visible in LENS v2.

### Deliverables

| Deliverable | Description |
|---|---|
| Reconciliation data in payload | GenericSemanticPayloadResolver enriched with reconciliation |
| Per-domain indicators | LENS v2 shows reconciliation status per domain |
| Graduated confidence display | 5-level confidence visible in rendering |
| Reconciliation progress | Overall reconciliation progress indicator |

### Prerequisites
- Phase 1 complete (reconciliation report exists)
- GenericSemanticPayloadResolver operational (exists)
- LENS v2 operational (exists)

### What This Phase Proves
- Reconciliation is visible without disrupting existing HYDRATED rendering
- Executives can see which domains have structural backing
- The enrichment model works (additive, not replacing)

### Branch: feature/runtime-demo (L6 work)

---

## 4. Phase 3: AI-Assisted Semantic Reconstruction

**Goal:** Introduce AI-assisted techniques to enrich semantic reconstruction.

### Deliverables

| Deliverable | Description |
|---|---|
| AI semantic extraction pipeline | AI-assisted extraction from source documents |
| Enriched domain model | Deeper semantic coverage per domain |
| Reconciliation re-run | Updated correspondence with enriched semantics |
| Quality assessment | Comparison: AI-enriched vs current hydration |

### Prerequisites
- Phase 1 complete (reconciliation baseline exists for comparison)
- Source documents available (BlueEdge: 3 HTML files)
- AI integration approach defined

### What This Phase Proves
- AI-assisted reconstruction produces richer semantic output
- Enriched output feeds the existing pipeline without disruption
- Reconciliation confidence improves with richer semantics
- The approach is commercially realistic (not a research project)

### Branch: feature/pios-core (L3-L4 work)

### AI Positioning

AI-assisted reconstruction is:
- A PATH B input source (not a new path)
- Consumed by existing SemanticActorHydrator pipeline
- Subject to Q-class governance (AI output is classified like any other)
- Subject to reconciliation (AI semantic claims need correspondence verification)
- NOT authority (AI output enters at HYDRATED, not at CERTIFIED)

---

## 5. Phase 4: Progressive Grounding Expansion

**Goal:** Expand PATH A coverage to increase grounding across BlueEdge domains.

### Deliverables

| Deliverable | Description |
|---|---|
| Additional vault anchors | New structural evidence bindings for ungrounded domains |
| Topology expansion | New topology verification data |
| Grounding ratio improvement | More domains at confidence level 4-5 |
| Q-class reassessment | Updated Q-class reflecting improved grounding |

### Prerequisites
- Phase 1 complete (know which domains need grounding)
- Phase 3 recommended (enriched semantics identify better correspondence targets)

### What This Phase Proves
- Progressive grounding is achievable without PATH A redesign
- BlueEdge can advance toward Q-01 incrementally
- The graduated model works in practice

### Branch: feature/pios-core (L3-L4 work)

---

## 6. Phase Dependencies

```
Phase 1 (Reconciliation Foundation)
  │
  ├──→ Phase 2 (LENS v2 Visibility)     [can start after Phase 1]
  │
  ├──→ Phase 3 (AI Reconstruction)       [can start after Phase 1]
  │         │
  │         └──→ Phase 4 (Grounding)     [benefits from Phase 3]
  │
  └──→ HYDRATED → RECONCILED transition  [after Phase 1 + human approval]
```

Phases 2, 3, and 4 can proceed in parallel after Phase 1. Phase 1 is the critical path.

---

## 7. What Is NOT in These Phases

| Excluded | Why |
|---|---|
| PATH A redesign | Frozen, certified — expansion only |
| SQO state machine redesign | Existing S-states sufficient |
| New SQO cockpit sections | Contract non-goal |
| Overlay/replay redesign | Contract non-goal |
| Runtime corridor redesign | Contract non-goal |
| Universal semantic compiler | Over-engineering — solve for BlueEdge first |
| New governance frameworks | Existing Q-class governance sufficient |
| Multi-client reconciliation | Solve for BlueEdge, then generalize |

---

## 8. Commercial Realism Check

| Phase | Effort Estimate | Commercial Value |
|---|---|---|
| Phase 1 | Medium — correspondence compilation from existing data | HIGH — unlocks HYDRATED→RECONCILED, proves the path |
| Phase 2 | Low — data layer enrichment + UI indicators | HIGH — executives see grounding progress |
| Phase 3 | Medium-High — AI integration | HIGH — richer semantics, more domains covered |
| Phase 4 | Ongoing — progressive grounding | CUMULATIVE — each anchor improves confidence |

The near-term path is commercially realistic because:
- Phase 1 uses existing data (no new evidence gathering required)
- Phase 2 enriches existing LENS v2 (no redesign)
- Phase 3 positions AI as a practical tool (not a research program)
- Phase 4 is incremental (not a big-bang grounding project)

---

## 9. Cross-References

- [[RECONCILIATION_BRIDGE_ARCHITECTURE]] — what Phase 1 builds
- [[HYDRATED_STATE_FORMALIZATION]] — the state these phases advance from
- [[PATH_A_PATH_B_OPERATIONAL_BOUNDARIES]] — why PATH A is not redesigned
- [[SEMANTIC_RECONSTRUCTION_VS_GROUNDING]] — conceptual foundation
- [[LENS_V2_RECONCILIATION_INTEGRATION]] — what Phase 2 delivers
