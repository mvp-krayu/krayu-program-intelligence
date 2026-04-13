# GAUGE.MEANING.LAYER.EXECUTIVE.CONSISTENCY.CORRECTION.01 — Contract

## Contract Identity

- ID: GAUGE.MEANING.LAYER.EXECUTIVE.CONSISTENCY.CORRECTION.01
- Type: TRUST COHERENCE FIX
- Mode: STRICT CONSISTENCY CORRECTION — CONFIG-DRIVEN ONLY
- Branch: wip/gauge-psee-hygiene-snapshot
- Date: 2026-04-13

---

## Purpose

Remove executive contradictions from the overview page. No statement may contradict
any other visible statement or the underlying Gauge/topology truth.

**This is a trust coherence fix. No redesign. No new semantics.**

---

## Contradictions Identified

### Contradiction 1 — Header absolute claim vs outside-control concepts

| Item | Value |
|------|-------|
| PHRASE-01-SHARED (header) | "Your system architecture is fully visible — no structural blind spots detected." |
| CONCEPT-06 (always active) | Execution not evaluated — a known gap in the outside-control section |
| CONCEPT-16 (may be active) | Orphan nodes — isolated from domain structure |
| CONCEPT-19 (may be active) | Topology records outside classified boundary |
| **Contradiction** | Header claims "no blind spots" while outside-control section may render real gaps |

**Resolution**: Downgrade header to claim what IS true — tracked components are mapped —
without asserting absolute completeness.

### Contradiction 2 — Gauge unknown-space vs topology outside-boundary boundary confusion

| Item | Value |
|------|-------|
| StatusBand "Unknown Space" | Sourced from DIM-04.total_count = 0 (gauge runtime) |
| PHRASE-04-CTO | "no elements fall outside the structural boundary" |
| CONCEPT-19 / PHRASE-19-CTO | "Parts of your system topology fall outside the classified structural boundary — N records" |
| **Contradiction** | "0 unknown space" + "no elements outside boundary" while topology may show N unclassified records — same term "structural boundary", different concepts |

**Resolution**: Scope PHRASE-04-CTO to gauge runtime boundary explicitly. Relabel StatusBand
metric from "Unknown Space" to "Runtime Unknown" to prevent label collision.

### Contradiction 3 — Execution trace overstatement

| Item | Value |
|------|-------|
| PHRASE-10-CTO | "execution traces are available" |
| CONCEPT-06 (always active) | "Execution assessment has not been performed" |
| **Contradiction** | Signals may be bound to components structurally, but execution has not run — "traces" implies runtime validation |

**Resolution**: Remove execution trace claim. State structural binding only.

---

## Changes Made

### Change 1 — PHRASE-01-SHARED (phrases.json)

```
Before: "Your system architecture is fully visible — no structural blind spots detected."
After:  "Your core system architecture is structurally mapped — visibility is established across all tracked components."
```

Grounding unchanged: CONCEPT-01, DIM-01.coverage_percent == 100.
Removed: absolute "no blind spots" claim.
Added: "tracked components" qualifier — scopes the claim to what is actually measured.

### Change 2 — PHRASE-04-CTO (phrases.json)

```
Before: "Everything within scope is accounted for — no elements fall outside the structural boundary."
After:  "All gauge-tracked elements fall within scope — no runtime unknown-space elements detected."
```

Grounding unchanged: CONCEPT-04, DIM-04.total_count == 0.
Removed: "structural boundary" (ambiguous — could refer to topology classified boundary).
Added: "gauge-tracked elements" and "runtime unknown-space" — explicitly scopes to DIM-04.

### Change 3 — PHRASE-10-CTO (phrases.json)

```
Before: "{signal_count} behavioral {signal_plural} are anchored to mapped structural components — execution traces are available."
After:  "{signal_count} behavioral {signal_plural} are bound to mapped structural components — signal bindings are present in the structural model."
```

Grounding unchanged: CONCEPT-10, summary.signals_count > 0.
Removed: "execution traces are available" — execution has not been evaluated (CONCEPT-06 active).
Added: "signal bindings are present in the structural model" — factual structural claim only.

### Change 4 — StatusBand label (overview.js)

```
Before: { lbl: 'Unknown Space', val: unkDisplay }
After:  { lbl: 'Runtime Unknown', val: unkDisplay }
```

Source unchanged: gaugeData.dimensions['DIM-04'].total_count.
Removed: "Unknown Space" label ambiguity (collides with topology outside-boundary concept).
Added: "Runtime Unknown" — scopes to gauge runtime layer only.

---

## Boundary Analysis

| Concept | Boundary type | Corrected label in UI |
|---------|--------------|----------------------|
| CONCEPT-04 (DIM-04 == 0) | Gauge runtime unknown space | "no runtime unknown-space elements detected" |
| CONCEPT-19 (topology) | Topology classified boundary | "outside the classified structural boundary — N records" |
| StatusBand metric | Gauge DIM-04 only | "Runtime Unknown" |

These are now non-contradictory: different scopes, different labels, different sections.

---

## DO NOT MODIFY Compliance

| File | Modified? |
|------|-----------|
| resolver.js | NO |
| renderer.js | NO |
| concepts.json | NO |
| schema.json | NO |
| /api/topology | NO |
| /api/gauge | NO |
| pages/topology.js | NO |
| pages/index.js | NO |
| ExecLens | NO |
| CSS | NO |

---

## Governance

- All corrections grounded in same input fields as prior phrases
- No new semantics introduced
- No new concepts defined
- No UI redesign
- Config-driven rendering preserved
- Deactivated phrases remain in file with status: inactive for audit
