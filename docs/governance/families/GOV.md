# Family: GOV — Canonical Governance

**Status:** REGISTERED
**Registered:** 2026-04-04
**Authority:** EX.0

---

## PURPOSE

Canonical governance, registry control, authority locking, and execution governance enforcement. GOV streams establish and enforce the source-of-truth structure across all layers — what is canonical, what is derivative, and what is invalid.

---

## STANDARD INVARIANTS

- Evidence first — no authority claim without traceable basis
- Canonical source precedence — no competing truth surfaces without explicit designation
- No authority ambiguity — every construct has one canonical owner
- No duplicate truth surfaces without explicit derivative designation

---

## STATE VOCABULARIES

| Object | States |
|---|---|
| authority_state | LOCKED \| PARTIAL \| UNRESOLVED |
| source_state | CANONICAL \| DERIVATIVE \| INVALID |

---

## STANDARD ARTIFACT SLOTS (7-PACK)

| Slot | Function |
|---|---|
| 1 | Registry or inventory |
| 2 | Governance spec |
| 3 | Control definition |
| 4 | Authority exposure surface |
| 5 | Boundary contract |
| 6 | Validation report |
| 7 | Execution report |

---

## VALIDATION PROFILES

| Profile | Purpose |
|---|---|
| `canonical_integrity` | Registry entry and authority state |
| `registry_integrity` | Registry completeness and consistency |
| `authority_lock` | Lock state and downstream implications |

---

## HANDOVER EXPECTATIONS

- Authority result (what was locked, what remains unresolved)
- Source precedence declared
- Downstream implications
- Locked constraints with scope

---

## KNOWN EXCLUSIONS

- No publishing execution inside GOV unless explicitly scoped
- No engine computation inside GOV

---

## COMPRESSION ELIGIBILITY

REGISTERED. Compressed contracts permitted.
