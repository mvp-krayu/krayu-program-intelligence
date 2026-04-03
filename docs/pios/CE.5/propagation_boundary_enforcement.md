# CE.5 — Propagation Boundary Enforcement

**Stream:** CE.5 — Signal Consumption & Propagation Contract
**Artifact type:** BOUNDARY ENFORCEMENT (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.5

---

## 1. PURPOSE

This document defines what the CE.5 propagation boundary enforces.
The boundary separates what CE.5 is responsible for from what it must not do.

---

## 2. UPSTREAM BOUNDARY (CE.4 → CE.5)

CE.5 receives the CE.4 signal output packet at the upstream boundary.

**Enforced at intake:**
- CE.5 reads the packet. It does not modify it.
- CE.5 does not validate CE.4 signal values against any threshold or rule.
- CE.5 does not add fields to signal records.
- CE.5 does not remove fields from signal records.
- If CE.4 emits a signal with state=BLOCKED, CE.5 accepts that state as-is.
- If CE.4 emits a signal with state=PARTIAL, CE.5 accepts that state as-is.
- If CE.4 emits a signal with state=COMPLETE, CE.5 accepts that state as-is.

CE.5 takes no position on whether a CE.4 state is correct. CE.4 is authoritative
over its own output.

---

## 3. DOWNSTREAM BOUNDARY (CE.5 → downstream layer)

CE.5 delivers consumption records at the downstream boundary.

**Enforced at delivery:**

| What CE.5 delivers | What CE.5 does not deliver |
|---|---|
| signal_id | CE.4 formula traceability |
| consumption_state (AVAILABLE / PARTIAL / BLOCKED) | CE.4 partiality_reasons |
| output_ref (reference to CE.4 output, unchanged) | CE.4 blocking metadata |
| origin = "CE.4" | Computed or derived fields |
|  | Cross-signal summaries or aggregations |
|  | Interpretation of state meaning |

The downstream layer receives exactly what CE.5 consumed — no more, no less.

---

## 4. BOUNDARY VIOLATIONS — PROHIBITED

The following actions violate the CE.5 boundary:

| Violation | Category |
|---|---|
| Modifying signal output before delivery | Upstream boundary breach |
| Applying a binding rule within CE.5 | Upstream boundary breach — CE.5 is not an activation layer |
| Producing a derived field not present in CE.4 | Downstream boundary breach |
| Combining two signal states to produce a condition state | Downstream boundary breach |
| Substituting a value for a null field | Upstream boundary breach |
| Carrying CE.4 traceability fields forward as active inputs | Boundary contamination |
| Creating a consumption record for a signal not in CE.4 packet | Boundary fabrication |

---

## 5. BOUNDARY IDENTITY STATEMENT

CE.5 is a pass-through layer.

Input state = Output state.
Input signal set = Output signal set.
No new information is created at CE.5.
No existing information is destroyed at CE.5 (it remains in the CE.4 record).

The CE.5 boundary is enforced by the absence of transformation logic, not by a filter.
