# Reconciliation Bridge Architecture

> **The missing layer between semantic reconstruction and structural grounding.**

---

## 1. What the Reconciliation Bridge Is

The reconciliation bridge is the architectural layer that connects PATH B's semantic reconstruction output to PATH A's structural grounding substrate. It answers the question: *for each semantic claim, does structural evidence exist, and how strong is the correspondence?*

The bridge is NOT:
- A proof engine (that's PATH A structural verification)
- A semantic engine (that's PATH B semantic reconstruction)
- A qualification engine (that's SQO)
- A rendering surface (that's LENS v2)

The bridge IS:
- A correspondence compiler
- A confidence assessor
- A reconciliation lifecycle manager
- The mechanism that moves a client from HYDRATED to RECONCILED

---

## 2. Why the Bridge Is Missing

The system currently has two strong but disconnected substrates:

**PATH A (structural grounding):** Deterministic, certified, frozen. DPSIG signals, vault anchors, topology reports, grounding ratios. Commercially validated at da268c2 (2026-05-08). Produces structural proof but no semantic interpretation.

**PATH B (semantic reconstruction):** Operational, rich, hydrated. 15-actor semantic model, crosswalk translation, Q-class governance, LENS v2 rendering. Delivers executive intelligence but without structural proof for every claim.

Between them: nothing. The system can say "BlueEdge has 15 semantic domains" (PATH B) and "BlueEdge has vault anchors for some domains" (PATH A) but cannot systematically say "semantic domain X corresponds to structural evidence Y with confidence Z."

That correspondence operation is the reconciliation bridge.

---

## 3. Bridge Architecture

```
PATH B (Semantic Reconstruction)          PATH A (Structural Grounding)
┌─────────────────────────────┐          ┌─────────────────────────────┐
│ SemanticActorHydrator        │          │ Vault anchors               │
│ SemanticCrosswalkMapper      │          │ Topology reports            │
│ 15-actor domain model        │          │ CLU/DOM/CAP registries      │
│ DOM-01 → DOM-17              │          │ Grounding ratio             │
│ Q-class governance           │          │ DPSIG signals               │
└──────────────┬──────────────┘          └──────────────┬──────────────┘
               │                                        │
               ▼                                        ▼
        ┌──────────────────────────────────────────────────────┐
        │              RECONCILIATION BRIDGE                    │
        │                                                      │
        │  Correspondence Compiler                             │
        │  ├─ Semantic domain → structural registry mapping    │
        │  ├─ Evidence strength classification                 │
        │  └─ Per-domain reconciliation status                 │
        │                                                      │
        │  Confidence Assessor                                 │
        │  ├─ Graduated confidence (5 levels)                  │
        │  ├─ Corroboration scoring                            │
        │  └─ Gap identification                               │
        │                                                      │
        │  Reconciliation Lifecycle Manager                    │
        │  ├─ HYDRATED → RECONCILED transition gate            │
        │  ├─ Human approval corridor                          │
        │  └─ Progressive reconciliation tracking              │
        └──────────────────────────────────────────────────────┘
               │
               ▼
        ┌──────────────────────┐
        │ SQO (qualification)  │ ── state transition from S2 → S3
        │ LENS v2 (rendering)  │ ── reconciliation status visibility
        └──────────────────────┘
```

---

## 4. Bridge Components

### 4.1 Correspondence Compiler

Takes as input:
- PATH B semantic domain model (DOM-01 → DOM-17 with actor semantics)
- PATH A structural registries (vault anchors, topology, CLU/CAP)

Produces:
- Per-domain correspondence table: which semantic claims have structural backing
- Per-domain evidence classification (5-level graduated model)
- Unmatched semantic claims (semantic-only, no structural correspondence)
- Unmatched structural evidence (structural evidence with no semantic consumer)

### 4.2 Confidence Assessor

For each domain correspondence, assigns a graduated confidence level:

| Level | Name | Evidence | Q-Class Impact |
|---|---|---|---|
| 5 | STRUCTURALLY_GROUNDED | Vault-backed | Contributes to Q-01 |
| 4 | OBSERVATIONALLY_CORROBORATED | Topology/crosswalk confirmed | Contributes to Q-01/Q-02 |
| 3 | SEMANTICALLY_COHERENT | Multiple semantic sources agree | Q-02 |
| 2 | UPSTREAM_EVIDENCE_BOUND | Operator evidence only | Q-02/Q-03 |
| 1 | UNMAPPED | No binding | Q-03/Q-04 |

This replaces the current binary grounding model with the graduated model defined in the strategic roadmap.

### 4.3 Reconciliation Lifecycle Manager

Manages the progressive reconciliation of a client's semantic data:
- Tracks which domains have been reconciled
- Manages the HYDRATED → RECONCILED state transition
- Enforces the human approval corridor (reconciliation results require human sign-off before state advancement)
- Records reconciliation history for audit

---

## 5. What the Bridge Does NOT Do

| Responsibility | Owner | NOT the Bridge |
|---|---|---|
| Semantic extraction from evidence | Evidence corridor | Bridge consumes, doesn't extract |
| Structural verification | PATH A infrastructure | Bridge maps correspondence, doesn't verify structure |
| Qualification state management | SQO | Bridge feeds SQO, doesn't manage S-states |
| Executive rendering | LENS v2 | Bridge produces data, doesn't render |
| Authority promotion | Governance | Bridge produces evidence for promotion, doesn't promote |
| AI semantic reconstruction | Future AI-assisted pipeline | Bridge compiles correspondence, doesn't reconstruct |

---

## 6. Integration Points

| System | Integration | Direction |
|---|---|---|
| PATH B semantic model | Input: domain semantics | Bridge reads PATH B output |
| PATH A registries | Input: structural evidence | Bridge reads PATH A output |
| SQO | Output: reconciliation status feeds state transitions | Bridge writes to SQO |
| LENS v2 | Output: reconciliation confidence visible in rendering | Bridge writes to LENS v2 data layer |
| Human approval corridor | Gate: reconciliation results require sign-off | Bridge pauses for approval |
| Crosswalk mapper | Tool: DOM-XX translation used during correspondence | Bridge uses existing mapper |

---

## 7. Cross-References

- [[HYDRATED_STATE_FORMALIZATION]] — the state the bridge advances from
- [[PATH_A_PATH_B_OPERATIONAL_BOUNDARIES]] — the two substrates the bridge connects
- [[SEMANTIC_RECONSTRUCTION_VS_GROUNDING]] — why the bridge exists
- [[LENS_V2_RECONCILIATION_INTEGRATION]] — how reconciliation becomes visible
- [[EXECUTION_PHASES_NEAR_TERM]] — when the bridge gets built
