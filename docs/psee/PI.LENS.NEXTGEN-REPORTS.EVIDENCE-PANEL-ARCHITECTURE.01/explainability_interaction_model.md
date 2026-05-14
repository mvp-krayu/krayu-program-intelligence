# Explainability Interaction Model

**Stream:** PI.LENS.NEXTGEN-REPORTS.EVIDENCE-PANEL-ARCHITECTURE.01  
**Document type:** EXPLAINABILITY INTERACTION MODEL  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Upstream:** PI.LENS.GEIOS.PRODUCTIZATION-BRIDGE.01 §8, §9 (4e2a9e2)  

---

## 1. Purpose

This document defines the interaction semantics of the LENS NextGen explainability surface. It specifies what interactions exist, what they reveal, what they cannot do, and how they behave across Phase 2 and future phases.

This document does **not** implement interaction logic. It is a formal interaction contract consumed by downstream implementation streams.

---

## 2. Interrogation-First Interaction Doctrine

### 2.1 Core Principle

> The executive interrogates governed evidence. The executive does not converse with an AI.

Every interaction in the LENS explainability surface is a navigation act — the executive moves through a pre-structured evidence hierarchy. Interactions reveal committed artifacts; they do not generate new content.

The interaction model is:

```
SEE VERDICT
    ↓
UNDERSTAND NARRATIVE
    ↓
INVESTIGATE WHY
    ↓
EXAMINE EVIDENCE
    ↓
FOLLOW PROPAGATION
    ↓
AUDIT TRACE
```

Each step is a deeper layer of the same committed evidence envelope. The executive controls how deep they go. The AI does not control what the executive sees next.

### 2.2 What Interaction Does

| Interaction | What It Does |
|-------------|-------------|
| Expand panel | Reveals pre-rendered committed content |
| Collapse panel | Hides display; retains content |
| Expand evidence drawer | Opens domain-level evidence (pre-rendered) |
| Collapse evidence drawer | Closes display; retains content |
| Hover qualifier chip | Shows pre-rendered qualifier tooltip |
| Click trace indicator | Expands TRACE panel (Advisory+) |
| Click lineage indicator | Expands LINEAGE panel (Advisory+) |

### 2.3 What Interaction Cannot Do

| Forbidden Interaction | Reason |
|----------------------|--------|
| Type a free-form question | No query capability until Phase 5 |
| Ask AI to "explain more" | No live AI generation in Phase 2–4 |
| Annotate or flag evidence | Evidence is immutable after bridge crossing |
| Change readiness state | readiness_state is immutable |
| Suppress a qualifier | Qualifier suppression is permanently prohibited |
| Modify audience tier | Audience tier locked at session initialization |
| Fetch updated data | No external fetch at interaction time |
| Compare to previous report | No comparative interaction without committed comparative data |
| Regenerate with different parameters | Evidence and derivation are sealed |

---

## 3. Expand/Collapse Semantics

### 3.1 What Expand/Collapse Is

Expand/collapse is a **display state change** only. It is the only interaction type active in Phase 2.

```
EXPAND:
  Display state: COLLAPSED → EXPANDED
  Effect: Pre-rendered panel content becomes visible
  Data effect: None — no computation, no fetch, no state change in report_object
  Timing: Immediate — content already in DOM or equivalent
  Persistence: Ephemeral — not persisted in Phase 2

COLLAPSE:
  Display state: EXPANDED → COLLAPSED
  Effect: Pre-rendered panel content is hidden
  Data effect: None — content retained; not removed
  Timing: Immediate
  Persistence: Ephemeral — not persisted in Phase 2
```

### 3.2 Expand/Collapse Governance

| Rule | Requirement |
|------|-------------|
| No computation at expand | Evidence loading is not triggered by expand |
| No fetch at expand | No external data source is called at expand time |
| Content identical pre/post collapse | Collapsing and re-expanding reveals identical content |
| Blocked panels do not expand | BLOCKED panels remain in blocked state regardless of expand action |
| Diagnostic panels do expand | DIAGNOSTIC panels expand to reveal content + diagnostic notice |

### 3.3 Default States by Panel

| Panel | Executive Default | Advisory Default | Audit Default |
|-------|------------------|-----------------|--------------|
| WHY | EXPANDED | EXPANDED | EXPANDED |
| EVIDENCE | COLLAPSED | EXPANDED | EXPANDED |
| TRACE | COLLAPSED | COLLAPSED | EXPANDED |
| QUALIFIERS | EXPANDED (if Q active) | EXPANDED | EXPANDED |
| LINEAGE | HIDDEN | COLLAPSED | EXPANDED |
| CONFIDENCE | COLLAPSED | EXPANDED | EXPANDED |
| READINESS_STATE | EXPANDED | EXPANDED | EXPANDED |

---

## 4. Evidence Drawer Semantics

### 4.1 Drawer Model

The evidence drawer is the primary progressive disclosure mechanism for domain-level evidence depth. Each evidence domain has exactly one drawer.

```
DRAWER CLOSED STATE:
  Visible: Domain alias + grounding status chip
  Hidden: Signal cards; propagation role; evidence summary
  Interaction available: Click to open

DRAWER OPEN STATE:
  Visible: All above + signal cards + propagation role + evidence summary
  Content: Pre-rendered from evidence_blocks[]
  Interaction available: Click to close; hover signal card chips for tooltips
```

### 4.2 Drawer Interaction Flow

```
STEP 1 — Executive sees domain list
  Domain aliases rendered (ALI-04)
  Grounding status chips visible (FULL / PARTIAL / STRUCTURAL / DIAGNOSTIC / SUPPRESSED)
  Count of active signal cards per domain (summary only)

STEP 2 — Executive clicks domain header
  Drawer opens (display state: COLLAPSED → EXPANDED)
  Signal cards render (ALI-01/02 labels applied)
  Pressure tier labels render (NORM-PROP-01)
  Qualifier chips render per signal (NORM-Q applied)
  Propagation role label renders
  Evidence summary text renders

STEP 3 — Executive clicks signal card qualifier chip (hover)
  Pre-rendered Q-taxonomy tooltip renders
  No AI generation; tooltip text committed at generation

STEP 4 — Executive clicks domain header again
  Drawer closes (display state: EXPANDED → COLLAPSED)
  Content retained; identical on re-open
```

### 4.3 SUPPRESSED Domain Drawer Behavior

When a domain's evidence is suppressed (Q-04 in scope):

```
SUPPRESSED DRAWER:
  Header: "{domain_alias} — Evidence"
  Grounding chip: NOT RENDERED (no chip for suppressed domain)
  Expand action: NOT AVAILABLE — drawer cannot open
  Absence notice: "Signal intelligence withheld from this view."
  No partial evidence: Drawer does not show available sub-evidence
```

The suppression notice is **mandatory** and **not aesthetically suppressible**.

---

## 5. Panel Transition Semantics

### 5.1 Phase 2 Panel Transitions

In Phase 2, panels transition only between COLLAPSED and EXPANDED states. The transition is a CSS/display state change only.

```
VALID TRANSITIONS (Phase 2):
  COLLAPSED ↔ EXPANDED  (user-triggered via click)
  
  BLOCKED → (no transition; blocked state is terminal for current report_object)
  DIAGNOSTIC → EXPANDED  (user can expand to see content + diagnostic notice)
  EXPANDED → COLLAPSED  (user can collapse)
```

### 5.2 State Determination Priority

Panel state is determined by governance before UX default:

```
PRIORITY ORDER:
  1. evidence_object_hash missing or failed → ALL PANELS → BLOCKED
  2. governance_verdict = FAIL → readiness module → BLOCKED
  3. Panel content absent in report_object → BLOCKED (required panels) / DIAGNOSTIC (optional)
  4. normalization_version mismatch → narrative panels → DIAGNOSTIC
  5. qualifier_class = Q-04 → QUALIFIERS panel → Absence notice (not BLOCKED; advisory notice)
  6. qualifier_class = Q-03 → WHY + READINESS_STATE → Diagnostic frame
  7. Audience tier → visibility filter applied
  8. Phase 2 default state → COLLAPSED or EXPANDED per panel contract
```

### 5.3 Phase 3 Interaction Preparation

Phase 3 expands the interaction model without changing the content contract:

| Phase 3 Addition | What It Adds | What Stays the Same |
|-----------------|-------------|---------------------|
| Slide-out panel drawers | Panels open as slide-out from sidebar | Content remains pre-rendered at generation |
| Workspace context | Reports embedded in workspace shell | Evidence integrity rules unchanged |
| Topology display (read-only) | Domain topology visualization | No topology mutation; read-only display |
| Evidence-to-workspace linking | Cross-report evidence navigation | Evidence is still immutable |

Phase 3 activates the EVIDENCE_DRAWER interaction type in the interaction_registry. Phase 2 keeps it as EXPAND_COLLAPSE only.

---

## 6. Advisory Investigation Flow

### 6.1 Flow Description

Advisory users have deeper access to explainability surfaces for structural verification purposes.

```
ADVISORY INVESTIGATION FLOW:

1. EXECUTIVE SURFACE (same as executive flow)
   → Readiness badge, executive summary, WHY section
   → All domain evidence cards (expanded by default)

2. EVIDENCE DEPTH
   → All evidence drawers open by default
   → Full signal cards visible per domain
   → Grounding status per domain (full detail)
   → CONFIDENCE panel expanded

3. TRACE ACCESS
   → TRACE panel: collapsed but accessible
   → Propagation path with ALI-04 aliases
   → Propagation summary
   → Baseline reference (readable label)
   → Abbreviated derivation reference (8 chars + "...")

4. LINEAGE ACCESS
   → LINEAGE panel: collapsed but accessible
   → Baseline anchor
   → Evidence hash (abbreviated)
   → Stream anchor (reference label)
   → Generation timestamp

5. QUALIFIERS (expanded)
   → Full qualifier scope explanation
   → Affected domain list
   → Q-04 absence notice if applicable
```

### 6.2 Advisory Interaction Rules

- All executive interactions available
- TRACE panel accessible (click to expand)
- LINEAGE panel accessible (click to expand)
- Abbreviated hash values visible (not full)
- Full signal card detail visible
- No audience tier elevation to AUDIT

---

## 7. Audit Trace Flow

### 7.1 Flow Description

Audit users have full panel access for governance and compliance verification.

```
AUDIT TRACE FLOW:

1. FULL EXPLAINABILITY BUNDLE
   → All 7 panels expanded by default
   → Full content of every panel visible

2. LINEAGE (full)
   → evidence_object_hash: full value
   → derivation_hash: reference ID
   → stream_anchor: full value
   → run_id: full value
   → Generation timestamp: full value

3. TRACE (full)
   → Full propagation path
   → Full propagation summary
   → Full baseline reference
   → Abbreviated derivation reference (even at audit tier — never fully decoded)

4. RENDERING METADATA
   → normalization_version
   → ali_rules_applied
   → Generated at
   → Rendering pipeline version
```

### 7.2 Audit Access Restrictions

Even at audit tier:

- derivation_hash is a reference ID only — never decoded
- evidence_object_hash is shown as a verification anchor — never interpreted
- No derivation formulas are shown
- No GEIOS internal mechanics are shown
- No AI/LLM mechanics are shown

---

## 8. Blocked-State Interaction Flow

### 8.1 What Happens When Blocked

When the BridgeValidator determines a BLOCKED state:

```
BLOCKED INTERACTION FLOW:

1. Report surface renders with explicit BLOCKED notice
   → Headline: "Readiness classification unavailable"
   → Reason: "Evidence integrity verification failed" or "Governance verdict: FAIL"

2. All intelligence panels are blocked
   → WHY: BLOCKED notice
   → EVIDENCE: BLOCKED notice
   → TRACE: BLOCKED notice
   → QUALIFIERS: BLOCKED notice
   → LINEAGE: BLOCKED notice (audit trail available to AUDIT tier)
   → CONFIDENCE: BLOCKED notice
   → READINESS_STATE: BLOCKED notice

3. Audit trace (AUDIT tier only)
   → TRACE panel: accessible for audit review even in BLOCKED state
   → Enables forensic review of why blocking occurred

4. No interaction to "retry" or "regenerate"
   → Executive cannot trigger re-derivation
   → Executive cannot bypass the blocked state
   → Contact workflow: directed outside the LENS surface
```

### 8.2 Silent Degradation Prohibition

| Forbidden Blocked Behavior | Required Behavior |
|---------------------------|------------------|
| Blank panel (no content, no notice) | Explicit BLOCKED notice |
| Placeholder content ("loading...") | Explicit BLOCKED notice |
| Degraded readiness state (show Q-04 instead of BLOCKED) | Explicit BLOCKED notice |
| Any partial panel rendering from failed hash | All panels blocked |
| Auto-retry after brief delay | User must take explicit action |

---

## 9. Diagnostic-State Interaction Flow

### 9.1 What Happens in Diagnostic State

Diagnostic state occurs when a normalization issue, version mismatch, or soft evidence issue is detected — but the evidence envelope integrity is intact.

```
DIAGNOSTIC INTERACTION FLOW:

1. Report surface renders with DIAGNOSTIC banner
   → Diagnostic indicator on affected panels
   → Core readiness badge still visible
   → Diagnostic notice: "This report contains content that could not be fully normalized."

2. Affected panels render with diagnostic indicator
   → Content visible; diagnostic notice appended
   → Advisory recommendation: "Advisory review of this report is recommended."

3. Evidence drawers remain accessible
   → Evidence drawers expand normally
   → Signal cards render with available data
   → Missing data fields render as "Not available"

4. Govenance notice
   → Diagnostic state traced to normalization_version mismatch or ALI rule miss
   → Available in TRACE panel for advisory review
```

### 9.2 Diagnostic vs Blocked Distinction

| Dimension | DIAGNOSTIC | BLOCKED |
|-----------|-----------|---------|
| Evidence integrity | Intact (hash passes) | Failed (hash missing or mismatch) |
| Content rendered | Yes, with diagnostic notice | No (blocked notice only) |
| Panels accessible | Yes (with diagnostic frame) | No (blocked state) |
| Advisory notice | Yes — "recommend advisory review" | Yes — "classification unavailable" |
| Audit trace | Available | Available (AUDIT tier) |
| Source | Normalization issue; version mismatch | Hash failure; governance verdict FAIL |

---

## 10. Forbidden Interaction Behaviors

### 10.1 Permanently Forbidden in All Phases

| Forbidden Behavior | Governance Basis |
|-------------------|-----------------|
| Free-form text input in any panel | EXP-FORBID-02; Phase 2 restrictions |
| Conversational AI interaction | EXP-FORBID-01; GEIOS_LENS boundary model |
| Live AI generation at panel open | EXP-FORBID-01; all panel content pre-rendered |
| "Tell me more" AI prompting | Phase 5 only; wrong interaction model for Phase 2–4 |
| Evidence modification or annotation | EXP-EVID-02; evidence immutability |
| Qualifier chip hiding | EXP-QUAL-01; qualifier suppression prohibition |
| Readiness state adjustment via interaction | EXP-READY-02; readiness_state immutable |
| Topology editing via any panel | topology_mutation_prohibited = true |
| Audience tier elevation at runtime | EXP-AUD-02 |
| "Regenerate with different grounding" | No derivation re-triggering from LENS |
| External link to GEIOS internals | GEIOS hidden substrate principle |

### 10.2 Phase-Gated Behaviors (Forbidden in Phase 2)

| Behavior | Earliest Phase Available |
|----------|------------------------|
| Investigation flow (structured guided drill) | Phase 4 |
| Cross-report evidence navigation | Phase 4 |
| Copilot conversational entry | Phase 5 |
| Topology visualization (interactive) | Phase 3 |
| Real-time data refresh | Phase 3+ |
| Evidence comparison between reports | Phase 4 |

These behaviors are registered as inactive in the interaction_registry. They do not appear in the Phase 2 user interface.

---

## 11. Phase 2 Interaction Summary

### 11.1 Permitted Phase 2 Interactions

| Interaction | Type | Available |
|-------------|------|-----------|
| Expand panel | EXPAND_COLLAPSE | YES |
| Collapse panel | EXPAND_COLLAPSE | YES |
| Expand evidence drawer | EXPAND_COLLAPSE | YES |
| Collapse evidence drawer | EXPAND_COLLAPSE | YES |
| Hover qualifier chip tooltip | Display state | YES |
| Expand TRACE panel | EXPAND_COLLAPSE (Advisory+) | YES |
| Expand LINEAGE panel | EXPAND_COLLAPSE (Advisory+) | YES |

### 11.2 Prohibited Phase 2 Interactions

| Interaction | Type | Status |
|-------------|------|--------|
| Evidence drawer with live data fetch | EVIDENCE_DRAWER | REGISTERED / NOT ACTIVE |
| Investigation entry | INVESTIGATION_ENTRY | REGISTERED / NOT ACTIVE |
| Copilot entry | COPILOT_ENTRY | REGISTERED / NOT ACTIVE |
| Free-form query | N/A | PERMANENTLY ABSENT in Phase 2 |
| Real-time AI narration | N/A | PERMANENTLY ABSENT in Phase 2 |

---

*Stream PI.LENS.NEXTGEN-REPORTS.EVIDENCE-PANEL-ARCHITECTURE.01 — Interaction Model — COMPLETE*  
*Baseline: governed-dpsig-baseline-v1 (092e251)*  
*Issued: 2026-05-08*
