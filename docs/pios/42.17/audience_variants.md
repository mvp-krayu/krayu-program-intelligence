# Audience Variants
## Stream 42.17 — Persona Demonstration Strategy / Audience-Specific Demo Flow

**contract_id:** PIOS-42.17-RUN01-CONTRACT-v1
**run_reference:** run_01_enl_ui_exposure
**date:** 2026-03-21

---

## 1. Purpose

This document defines three audience-specific demo variants. Each variant uses
the same system, the same queries, and the same evidence. The variants differ
only in persona sequencing, emphasis timing, and optional phase selection.

---

## 2. Variant A — Executive Audience

**Audience:** Program executives, investors, sponsors, non-technical decision-makers

**Goal:** Establish credibility of the evidence base. Show that the program knows
what it knows and doesn't know. Show the confidence layer.

**Duration:** 20 minutes (canonical Phases 1–3, no Phase 4)

### Variant A Timeline

```
T+00:00  OPEN
T+00:30  Phase 1 — GQ-001, GQ-002, GQ-003 [SAFE MODE / 42.4 adapter]
         → pause after GQ-003: "The baseline. Program intelligence layer."
T+08:00  WOW-1 setup
T+10:00  Activation
T+10:30  GQ-003 contrast [ENHANCED / 42.4 adapter]
         → "The discipline layer labeled what was already there."
T+13:00  GQ-004, GQ-005 [ENHANCED / 42.4 adapter]
T+16:00  WOW-2 setup
T+16:30  PERSONA: EXECUTIVE — GQ-003
         → "Same data. Decision-support view."
         → show: signal, confidence, business_impact
         → do NOT show CTO or ANALYST without explicit request
T+19:00  Close
T+20:00  [Optional] Q&A — "What do you want to see deeper?"
```

### What to emphasize (Variant A)

- `aggregate_confidence` field — show it for each query
- `evidence_confidence` per signal — point to it, don't explain it
- `business_impact` field — let it stand verbatim
- Path state transition (INACTIVE → ACTIVE) — make it visible

### What NOT to emphasize (Variant A)

- Evidence chain details
- Supporting objects
- source_refs / ENL node IDs
- Drilldown depth indicators
- CTO/ANALYST personas (unless asked)

---

## 3. Variant B — Technical Audience (CTO / Architect)

**Audience:** CTOs, technical directors, platform architects, engineering leads

**Goal:** Show structural depth, domain/capability/component traceability,
blocking points, and evidence chain completeness.

**Duration:** 26 minutes (Phases 1–3 full)

### Variant B Timeline

```
T+00:00  OPEN
T+00:30  Phase 1 — GQ-001, GQ-002, GQ-003 [SAFE MODE / 42.4 adapter]
         → after GQ-003: mention dependency_load signal, blast radius scope
T+08:00  WOW-1 setup
T+10:00  Activation
T+10:30  GQ-003 contrast [ENHANCED / 42.4 adapter]
         → point to semantic_annotations block explicitly
T+13:00  GQ-004, GQ-005, GQ-006 [ENHANCED / 42.4 adapter]
T+16:00  WOW-2 setup
T+16:30  PERSONA: CTO — GQ-003
         → "Structural emphasis. Domain/capability/component."
         → point to domain_name, blocking_point, supporting_objects
T+19:00  Continue Phase 3 in CTO persona: GQ-007, GQ-008
T+21:00  [Optional] PERSONA: ANALYST — GQ-003 if audience requests full chain
T+24:00  Close
T+26:00  [Optional] Phase 4: Resilience demonstration
```

### What to emphasize (Variant B)

- Domain → Capability → Component triple per signal
- `blocking_point` when non-null — "the evidence chain stops here"
- Evidence chain partial depth (SIG-40 layer visible in CTO view)
- Path state transitions including acceptance condition count
- `chain_status: complete` vs `incomplete_terminal`

### What NOT to emphasize (Variant B)

- Business impact language
- Summary-level confidence framing
- EXECUTIVE persona (too shallow for this audience)

---

## 4. Variant C — Mixed Audience (Investor / Partner)

**Audience:** Investors, strategic partners, potential clients with mixed
technical depth

**Goal:** Show breadth and depth available. Establish the "levels of truth"
concept. Give technically-curious attendees a deeper path.

**Duration:** 22 minutes

### Variant C Timeline

```
T+00:00  OPEN
T+00:30  Phase 1 — GQ-001, GQ-002, GQ-003 [SAFE MODE / 42.4 adapter]
T+08:00  WOW-1 setup
T+10:00  Activation
T+10:30  GQ-003 contrast [ENHANCED / 42.4 adapter]
         → "Same query. Discipline layer active."
T+14:00  GQ-004 [ENHANCED / 42.4 adapter]
T+16:00  WOW-2 setup
T+16:30  PERSONA: EXECUTIVE — GQ-003
         → "Decision-support view."
T+18:30  [Offer a choice — one sentence only]
         → "I can show the same data with domain and component structure, or stop here."
         → If technical audience members engage → switch to CTO at T+19:00
         → If no request → proceed to close
T+20:00  Close
T+22:00  [Optional] ANALYST view on request only
```

### Key rule for Variant C

The mixed audience variant has one decision point (T+18:30). The presenter asks
one question and follows the audience response. No further improvisation.
If the audience wants deeper: one CTO persona view. Then close.

### What to emphasize (Variant C)

- The contrast between SAFE and ENHANCED mode (the core WOW-1 moment)
- The concept of same-truth across persona views
- The evidence-first framing: "the system knows what it knows"

### What NOT to do (Variant C)

- Do not switch persona twice without a clear audience signal
- Do not show ANALYST view unsolicited
- Do not explain what the program's signals mean for the business

---

## 5. Variant Selection Rules

| Audience signal | Variant |
|---|---|
| "We want to understand the program's health" | A — Executive |
| "We want to see the architecture / structure" | B — Technical |
| "We are evaluating this for investment / partnership" | C — Mixed |
| "We want to see the full evidence" | B — Technical (with ANALYST at T+21:00) |
| Audience is unknown | C — Mixed (safe default) |

---

## 6. Shared Invariants Across All Variants

| Invariant | All variants |
|---|---|
| Phase 1 always runs in SAFE MODE | YES |
| GQ-003 is the contrast query | YES |
| Activation is visible | YES |
| Persona is declared before switch | YES |
| No interpretation in narration | YES |
| Close always includes `--disable` | YES |
