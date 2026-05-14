# PERSONA LENS MAPPING

**Stream:** PI.LENS.V2.REPRESENTATION-FIELD-AND-PERSONA-CONSOLIDATION.01
**Status:** AUTHORITATIVE for the LENS V2 flagship executive lenses.

---

## 0. Why this document

The contract directs that the existing visible mode labels — BALANCED / DENSE / INVESTIGATION / BOARDROOM — must NOT be renamed to CEO / CTO / Analyst / Boardroom. Instead, the persona meaning of each mode must be made explicit through the interface itself: subtitles, tooltips, ARIA labels, and microcopy.

This document records the canonical mapping. Future contracts must consult this mapping when extending mode behavior, adding new modes, or evolving accessibility surfaces.

---

## 1. Mapping table

| Visible label  | Persona role                          | Cognitive posture                                                          | Field component name           |
|----------------|---------------------------------------|----------------------------------------------------------------------------|--------------------------------|
| BALANCED       | Executive — CEO consequence read       | consequence-first; decision posture; operational meaning; boardroom-safe   | `BalancedConsequenceField`     |
| DENSE          | Structural — CTO / delivery-tech       | structural cause; dependency pressure; propagation mechanics; coordination  | `DenseTopologyField`           |
| INVESTIGATION  | Evidence — Analyst / intelligence      | evidence depth; traceability; confidence limits; grounding gaps; diagnostic | `InvestigationTraceField`      |
| BOARDROOM      | Projection — Boardroom display         | compressed executive narrative; minimal chrome; maximum readability         | `BoardroomAtmosphericField`    |

The persona role is the **internal mental model** the surface adopts when that lens is active. The visible label is the **operator-facing handle** that names the lens.

---

## 2. Persona-line microcopy

A live `aria-live="polite"` line below the lens button strip reflects the active persona:

| Active lens       | Persona line                                            |
|-------------------|---------------------------------------------------------|
| BALANCED          | `Executive lens · CEO · consequence-first read`         |
| DENSE             | `Structural lens · CTO · structural cause and propagation` |
| INVESTIGATION     | `Evidence lens · Analyst · evidence trace and confidence` |
| BOARDROOM         | `Projection lens · Boardroom — minimal chrome`          |

The microcopy is small (10px), low-contrast, right-aligned. It reads as a quiet subtitle — not as marketing text.

---

## 3. ARIA contract

The lens buttons form a `role="radiogroup"` aria-labeled "Executive lens". Each button is a `role="radio"` with:

```
aria-checked  = (this lens is active)
aria-pressed  = (this lens is active)   [legacy support]
aria-label    = persona-extended label, e.g.
                "Balanced — Executive (CEO) consequence lens"
title         = persona pair, e.g.
                "Executive lens — CEO · consequence-first read"
data-persona  = persona label, e.g. "Executive lens"
```

This satisfies the contract requirement that persona meaning be present in accessibility without renaming the visible labels.

---

## 4. Boardroom-as-projection contract

BOARDROOM is **not** a fourth dashboard density state. It is a projection-grade lens that:

- Reduces chrome (no extra UI).
- Preserves the dominant declaration.
- Simplifies the Representation Field to a single atmospheric mark + supportive sentence.
- Suppresses analytical detail.
- Preserves the Evidence-First qualifier when active (does not hide critical confidence limitations).

When BOARDROOM is selected together with a density class, BOARDROOM wins for the Representation Field and for the IntelligenceField composition (more whitespace, narrower right column).

---

## 5. What persona mapping does NOT change

The persona mapping is a presentation contract. It does not change:

- evidence semantics
- governance verdict logic
- render-state vocabulary (`EXECUTIVE_READY`, `EXECUTIVE_READY_WITH_QUALIFIER`, `DIAGNOSTIC_ONLY`, `BLOCKED`)
- qualifier-class semantics (`Q-00`, `Q-01`)
- propagation logic
- structural meaning of nodes / signals / conditions
- Brain authority (Canonical / Product / Publish / Code)
- governance ribbon pass / fail logic

If a future contract proposes to extend or replace the persona mapping, the change must be explicit, scoped, and recorded in a new mapping document.

---

## 6. Future evolution

The persona model is intentionally bounded to four lenses for now. If future contracts need to add a fifth lens, the mapping must:

1. Preserve the visible-label discipline (lens names should be operator-facing handles, not job titles).
2. Define the persona role, cognitive posture, and field component.
3. Update the ARIA contract.
4. Update the persona-line microcopy and tooltips.
5. Document the mapping in a new authoritative version of this document.

The four-lens system is sufficient for current LENS V2 flagship needs and was validated through the runtime inspection in this contract.

---

**End of persona lens mapping.**
