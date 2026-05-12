# LENS v2 Reconciliation Integration

> **How reconciliation status becomes visible in the executive intelligence surface.**

---

## 1. Current LENS v2 State

LENS v2 currently renders HYDRATED (Q-02) output for BlueEdge:

| What LENS v2 Shows | Source |
|---|---|
| 15-actor semantic domain model | SemanticActorHydrator |
| Domain business labels | SemanticCrosswalkMapper |
| Executive signals (DPSIG) | DPSIGSignalMapper |
| Qualification disclosure (Q-02) | QClassResolver |
| SQO state (S2_QUALIFIED_WITH_DEBT) | SQOCockpitStateResolver |
| Semantic debt items (15) | SemanticDebtEngine |

What LENS v2 does NOT currently show:
- Reconciliation status per domain
- Structural grounding confidence per domain
- Correspondence between semantic claims and structural evidence
- Graduated trustworthiness indicators beyond Q-class

---

## 2. What Reconciliation Adds to LENS v2

When the reconciliation bridge is operational, LENS v2 gains:

### Per-Domain Reconciliation Status

Each of the 17 semantic domains gets a reconciliation indicator:

| Status | Meaning | Visual Treatment |
|---|---|---|
| RECONCILED | Correspondence compiled and human-approved | Confidence indicator (level 3-5) |
| PENDING | Correspondence compiled, awaiting human review | Pending indicator |
| UNRECONCILED | No correspondence attempted | Current state (HYDRATED baseline) |
| CONTRADICTED | Structural evidence contradicts semantic claim | Alert indicator |

### Graduated Confidence Display

For reconciled domains, LENS v2 displays the 5-level confidence:

| Level | Name | Display |
|---|---|---|
| 5 | STRUCTURALLY_GROUNDED | Full confidence |
| 4 | OBSERVATIONALLY_CORROBORATED | High confidence |
| 3 | SEMANTICALLY_COHERENT | Moderate confidence |
| 2 | UPSTREAM_EVIDENCE_BOUND | Low confidence |
| 1 | UNMAPPED | No confidence indicator |

### Reconciliation Progress

LENS v2 shows overall reconciliation progress:
- X of 17 domains reconciled
- Aggregate confidence distribution
- Domains requiring attention (CONTRADICTED, low confidence)

---

## 3. Integration Architecture

```
LENS v2 (current)                    LENS v2 (with reconciliation)
┌──────────────────────┐            ┌──────────────────────────────┐
│ Semantic model        │            │ Semantic model                │
│ Domain labels         │            │ Domain labels                 │
│ DPSIG signals         │            │ DPSIG signals                 │
│ Q-class disclosure    │            │ Q-class disclosure            │
│ SQO state             │            │ SQO state                     │
│ Debt items            │            │ Debt items                    │
│                       │            │ + Per-domain reconciliation   │
│                       │            │ + Graduated confidence        │
│                       │            │ + Reconciliation progress     │
│                       │            │ + Contradiction alerts        │
└──────────────────────┘            └──────────────────────────────┘
```

### Data Flow

```
Reconciliation Bridge
  ├─ produces: reconciliation_report.json (per-domain correspondence + confidence)
  │
  ▼
GenericSemanticPayloadResolver
  ├─ enriches semantic payload with reconciliation data
  │
  ▼
LENS v2 Flagship
  ├─ renders enriched semantic model with reconciliation visibility
```

The reconciliation bridge output becomes an additional data source for the existing GenericSemanticPayloadResolver. The payload resolver already handles multi-source data assembly — reconciliation is an additional source, not a new pipeline.

---

## 4. What Does NOT Change in LENS v2

| LENS v2 Capability | Impact |
|---|---|
| Semantic domain rendering | Unchanged — enriched, not replaced |
| DPSIG signal display | Unchanged |
| Q-class disclosure | Unchanged — reconciliation may eventually feed Q-class upgrades |
| SQO state display | Unchanged — SQO consumes reconciliation status |
| Qualification cockpit | Unchanged — new reconciliation section possible |
| Executive narrative | Unchanged — may incorporate reconciliation language |

LENS v2 is not redesigned. It is enriched with reconciliation data when that data becomes available. Until then, it continues rendering HYDRATED output as it does today.

---

## 5. Phased Integration

### Phase 1: Data Layer (No UI Change)
- Reconciliation bridge produces reconciliation_report.json
- GenericSemanticPayloadResolver includes reconciliation data in payload
- LENS v2 has access to reconciliation data but does not yet render it

### Phase 2: Reconciliation Indicators
- LENS v2 renders per-domain reconciliation status
- Graduated confidence indicators visible
- Overall reconciliation progress shown

### Phase 3: Deep Integration
- LENS v2 allows drill-down into reconciliation evidence per domain
- Correspondence details visible (which semantic claim → which structural evidence)
- Contradiction alerts with resolution guidance

---

## 6. HYDRATED Rendering Continues

Critical principle: **LENS v2 continues rendering HYDRATED output with Q-02 disclosure regardless of reconciliation progress.**

Reconciliation is additive visibility. It does not gate rendering. A client at HYDRATED with zero reconciliation still renders the full LENS v2 experience. Reconciliation data, when available, enriches the display — it does not replace or block it.

---

## 7. Cross-References

- [[RECONCILIATION_BRIDGE_ARCHITECTURE]] — the bridge that produces reconciliation data
- [[HYDRATED_STATE_FORMALIZATION]] — the state LENS v2 currently renders
- [[PATH_A_PATH_B_OPERATIONAL_BOUNDARIES]] — the two paths feeding LENS v2
- [[SEMANTIC_RECONSTRUCTION_VS_GROUNDING]] — what reconciliation data represents
- [[EXECUTION_PHASES_NEAR_TERM]] — phased delivery timeline
