# Information Architecture

> **Authority:** This document defines the cockpit's structural organization — what surfaces exist, how they relate, and how the operator navigates between them.

---

## Architectural Principle

The cockpit is organized by **operator need**, not by **artifact category**.

The primary axis is: **What does the operator need to know at this moment?**

Not: **What artifacts exist in the system?**

---

## Three-Tier Navigation Model

### Tier 1 — Operational Spine (Always Visible)

The operator's primary workspace. Contains everything needed for standard qualification operations.

| Surface | Purpose | Always Visible |
|---|---|---|
| **Operational Overview** | Posture + guidance + blocker summary + progression path + available actions | YES — primary entry |
| **Authority Workflow** | Governed mutation surface — review, promote, acknowledge, escalate | YES — primary action surface |

Tier 1 surfaces are NEVER hidden, collapsed, or made conditional. They are the cockpit.

### Tier 2 — Qualification Detail (Contextual)

Appears when relevant to current posture. The operator reaches these through workflow-driven navigation ("Review semantic intake" → Semantic Intake surface) or through explicit selection.

| Surface | Appears When | Purpose |
|---|---|---|
| **Semantic Intake** | `semantic_candidates` capability | Qualification intake: posture, candidates, blockers, next actions |
| **Progression** | `static_progression` capability | Gate validation, transition readiness |
| **Reconciliation** | `static_reconciliation` capability | PATH A/B correspondence, confidence levels |
| **Evidence & Replay** | `static_replay` capability | Evidence chain verification, replay state |
| **Semantic Debt** | `static_debt` capability | Qualification debt inspection, remediation |

Tier 2 surfaces are **shown or hidden based on capability detection**. If the capability doesn't exist for the client/run, the surface doesn't appear — no empty states, no "coming soon" placeholders.

Tier 2 items that are relevant to the current posture may be **promoted in prominence** (e.g., Semantic Intake gets visual emphasis when posture is SEMANTIC_INTAKE).

### Tier 3 — Forensic Drilldown (Expert Access)

Available through explicit "Forensic Detail" access. Not part of the operator's standard workflow. These surfaces serve audit, engineering validation, and deep investigation.

| Surface | Purpose |
|---|---|
| Continuity Assessment | Crosswalk coverage inspection |
| Maturity Profile | Dimension-level maturity scores |
| Reconciliation Loop | Loop lifecycle, phase completion, rerun chain |
| PATH B Handoff | PATH B activation boundary inspection |
| CEU Admissibility | Canonical evidence unit evaluation |
| Evidence Ingestion | Evidence registry and ingestion pipeline |
| Runtime Corridor | Sandbox state, activation, replay, rollback |
| Evidence Rebase | Rebase extraction and source linkage |

Tier 3 is collapsed by default. Accessible through a single "Forensic Investigation" expander or through explicit navigation. Does NOT appear in the primary navigation.

---

## Navigation Philosophy

### V1 (Current — Broken)

```
[Sidebar: 15 sections, flat list]
  Overview
  Semantic Debt
  Continuity
  Maturity Profile
  Progression
  Evidence & Replay
  Reconciliation
  Reconciliation Loop
  PATH B Handoff
  Runtime Corridor
  Evidence Ingestion
  Semantic Intake
  CEU Admissibility
  Evidence Rebase
  Authority
```

Every section at equal weight. No hierarchy. No workflow context. The operator must know which section matters.

### V2 (Target — Workflow-Driven)

```
[Operational Spine]
  ● Overview          ← always visible, primary entry
  ● Authority         ← always visible, action surface

[Qualification Detail]      ← appears based on capabilities
  ○ Semantic Intake
  ○ Progression
  ○ Reconciliation
  ○ Evidence & Replay
  ○ Semantic Debt

[Forensic Investigation ▸]  ← collapsed by default
  ○ Continuity Assessment
  ○ Maturity Profile
  ○ Reconciliation Loop
  ○ PATH B Handoff
  ○ CEU Admissibility
  ○ Evidence Ingestion
  ○ Runtime Corridor
  ○ Evidence Rebase
```

Maximum 2-7 items visible at any time. Never 15.

---

## Routing Model

### V1 (Current)

```
/sqo/client/{client}/run/{run}                    → overview
/sqo/client/{client}/run/{run}/{section}          → section panel
```

15 section routes at the same level.

### V2 (Target)

```
/sqo/client/{client}/run/{run}                    → operational overview
/sqo/client/{client}/run/{run}/authority           → authority workflow
/sqo/client/{client}/run/{run}/detail/{section}    → qualification detail (Tier 2)
/sqo/client/{client}/run/{run}/forensic/{section}  → forensic drilldown (Tier 3)
```

Route structure encodes tier hierarchy. The URL itself communicates the operator's depth level.

---

## Entry Flow

```
/sqo → Client Selector → Run Selector → Operational Overview
                                            ↓
                                    Role Declaration (session)
                                            ↓
                                    Workflow-Aware Cockpit
```

Role declaration is the first interaction after selecting a client/run. The operator selects their role, and the cockpit adapts all surfaces to that role's authority for the session.

---

## Workflow-Driven Navigation

Navigation between surfaces is driven by workflow context, not by sidebar selection:

| From | Navigation Trigger | To |
|---|---|---|
| Overview | "3 review obligations require action" → click | Authority workflow (review tab) |
| Overview | "Semantic intake available" → click | Semantic Intake detail |
| Overview | "Reconciliation in progress" → click | Reconciliation detail |
| Authority | "Obligation references domain X" → click | Forensic detail for that domain |
| Any Tier 2 | "← Back to Overview" | Overview |
| Any Tier 3 | "← Back to Overview" | Overview |

The sidebar is secondary navigation. The primary navigation is inline workflow guidance.

---

## Surface Reuse from V1

The existing V1 panel components are reused as rendering content within the new tier structure:

| V1 Component | V2 Location | Modification |
|---|---|---|
| QualificationPostureSummary | Overview (posture region) | Enhanced with workflow guidance |
| SemanticQualificationIntakePanel | Tier 2: Semantic Intake | Unchanged |
| ProgressionReadinessPanel | Tier 2: Progression | Unchanged |
| ReconciliationCorrespondencePanel | Tier 2: Reconciliation | Unchanged |
| EvidenceReplayPanel | Tier 2: Evidence & Replay | Unchanged |
| SemanticDebtPanel | Tier 2: Semantic Debt | Unchanged |
| OperatorAuthorityWorkflowPanel | Authority workflow | Enhanced with role projection |
| All corridor/rebase/CEU/etc panels | Tier 3 forensic surfaces | Unchanged |

**New components required:**
- OperationalOverviewShell — primary entry surface (posture + guidance + blockers + actions + progression)
- WorkflowNavigationRail — tiered navigation replacing flat sidebar
- RoleDeclarationGate — session role selector on entry
- PrimaryGuidanceStrip — the single most important UI element
- BlockerSummaryPanel — blocker overview with lane grouping
- ProgressionPathVisualization — linear progression with step status
- ActionAvailabilityGrid — all 12 actions with role-aware availability

---

## BlueEdge S2 Special Case

BlueEdge at S2 has the full journey available (cognitive layout shell, hero region, workflow spine, etc.). This rich overview is preserved as the S2+ overview rendering path. The new operational overview serves S0/S1 clients that lack journey data.

```
Overview rendering decision:
  if journey available (S2+)  → SQOCognitiveLayoutShell (existing rich layout)
  else                        → OperationalOverviewShell (new workflow-driven layout)
```

Both paths are valid. The rich journey layout is not deprecated — it serves qualified clients. The operational overview serves clients in progression.

---

## Information Density Rules

| Tier | Max Items Visible | Interaction Cost |
|---|---|---|
| Tier 1 | 2 surfaces | Zero — always visible |
| Tier 2 | 3-5 surfaces (capability-dependent) | One click from overview |
| Tier 3 | 8 surfaces | Two interactions (expand forensic + select) |

Total visible at any moment: **2-7 items** (not 15).
