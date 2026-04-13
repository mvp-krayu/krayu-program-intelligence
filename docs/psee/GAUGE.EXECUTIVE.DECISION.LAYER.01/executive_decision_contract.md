# GAUGE.EXECUTIVE.DECISION.LAYER.01 — Contract

## Contract Identity

- ID: GAUGE.EXECUTIVE.DECISION.LAYER.01
- Type: EXECUTIVE SURFACE EXTENSION
- Mode: BOOLEAN CLASSIFICATION — NO NEW DATA SOURCES
- Branch: work/psee-runtime
- Date: 2026-04-13

---

## Purpose

Add a compact Executive Decision Layer at the top of /overview that classifies the
current system state into 3 categorical dimensions (STRUCTURE / COMPLEXITY / EXECUTION)
and composes a 2-sentence executive statement.

All classification derives from the already-resolved `matchedConcepts[]` array.
No new API calls. No new data fetching. No new logic beyond boolean concept-ID checks.

---

## Classification Rules

### STRUCTURE

| Condition | Value |
|-----------|-------|
| CONCEPT-01 AND CONCEPT-03 AND CONCEPT-14 all in matchedConcepts | STRONG |
| Otherwise | FRAGMENTED |

CONCEPT-01: full coverage, CONCEPT-03: cross-axis validation passed, CONCEPT-14: no heuristic anomalies.
All three together = structural foundation is solid.

### COMPLEXITY

| Condition | Value |
|-----------|-------|
| Any of CONCEPT-08, CONCEPT-09, CONCEPT-16 in matchedConcepts | RISING |
| Otherwise | LOW |

CONCEPT-08: cross-domain overlaps, CONCEPT-09: domain boundary violations, CONCEPT-16: orphan nodes.
Any of these = complexity is increasing.

### EXECUTION

| Condition | Value |
|-----------|-------|
| CONCEPT-06 in matchedConcepts | UNKNOWN |
| Otherwise | VERIFIED |

CONCEPT-06: execution layer has not run. If present, execution state is unknown.

---

## Statement Composition

Composed from fixed allowed clauses. No templates. No phrase lookup. No renderer.

```
structureClause:
  STRONG    → "System structure is solid"
  FRAGMENTED → "System structure has visible gaps"

complexityClause:
  RISING → "complexity is increasing across domains"
  LOW    → "complexity remains contained"

executionClause:
  UNKNOWN  → "Execution readiness is not yet validated"
  VERIFIED → "Execution readiness is confirmed"

statement = `${structureClause}, while ${complexityClause}. ${executionClause}.`
```

---

## Pill CSS Class Assignments

| Dimension | Value | Class |
|-----------|-------|-------|
| STRUCTURE | STRONG | ed-pill--strong (green) |
| STRUCTURE | FRAGMENTED | ed-pill--risk (red) |
| COMPLEXITY | RISING | ed-pill--warn (amber) |
| COMPLEXITY | LOW | ed-pill--neutral (slate) |
| EXECUTION | UNKNOWN | ed-pill--neutral (slate) |
| EXECUTION | VERIFIED | ed-pill--strong (green) |

---

## Placement

`ExecutiveDecisionBlock` renders between `.ov-header-bar` and `ExecHeader`.
Condition: `!isLoading` (same gate as ExecHeader and StatusBand).

---

## Traceability

`data-structure`, `data-complexity`, `data-execution` on the container `.ed-container`.
No concept IDs exposed in visible UI.

---

## DO NOT MODIFY

| File | Modified? |
|------|-----------|
| resolver.js | NO |
| renderer.js | NO |
| concepts.json | NO |
| phrases.json | NO |
| schema.json | NO |
| /api/topology | NO |
| /api/gauge | NO |
| pages/topology.js | NO |
| pages/index.js | NO |
| MeaningSection | NO |
| MeaningBlock | NO |

---

## Files Modified

| File | Change |
|------|--------|
| `app/gauge-product/pages/overview.js` | Added ExecutiveDecisionBlock component + render call |
| `app/gauge-product/styles/gauge.css` | Appended .ed-* block |
