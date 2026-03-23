# Stream 44.3 — Changelog
stream: Stream 44.3 — Projection Emphasis Attribute Definition
program: Krayu — Program Intelligence Discipline
date: 2026-03-22

---

## Changelog

### 2026-03-22 — Stream Executed

Gap identified by 42.20: no governed projection attribute exists to support visual emphasis. Structure is visible; importance / emphasis is not expressible in governed form.

44.3 addresses this as a strict extension of 44.x projection semantics. No new layer introduced. No modification of 43.x, 44.1, or 44.2.

---

### 2026-03-22 — Attribute Defined

`emphasis` attribute defined:

- Categorical closed set: `high`, `medium`, `low`, `none`
- Default: `none` (absent = `none`)
- Assigned upstream only
- Not computed in 42.x
- Not derived in UI
- Part of the governed projection payload

Attachment rules defined: E-ATT-001 through E-ATT-008.

Attachment validation rules defined: E-VAL-001 through E-VAL-005.

Consumer handling rules defined: permitted actions, prohibited actions, fail-closed rule, rendering contract.

---

### 2026-03-22 — Projection Payload Extended

44.1 overlay element extended with `emphasis` field (optional).

Canonical payload example produced with and without `emphasis`.

Relationship to 44.1 and 44.2 explicitly documented — all existing constraints unchanged.

---

### 2026-03-22 — Governance Artifacts Created

- `docs/pios/44.3/projection_emphasis_attribute.md`
- `docs/pios/contracts/44.3_execution_contract.md`
- `docs/pios/44.3/changelog.md`

---

### 2026-03-22 — Governance Tightening Patches Applied

Patch 1: Section 2.2 — "Meaning" column renamed to "Designation"; value descriptions for `high`, `medium`, `low` replaced with uniform text "Upstream-assigned emphasis level" to prevent semantic drift (e.g., high ≠ critical / risk / priority).

Patch 2: Section 5 — E-VAL-006 added: if `emphasis` is present without upstream attribution traceable to the governed projection lineage, the element is invalid. Section 5.1 updated to reference E-VAL-006 alongside E-VAL-003 and E-VAL-004.

Validation rule count: E-VAL-001 through E-VAL-006.

---

### 2026-03-22 — Stream Closed

Stream 44.3 closed. No files modified. 3 governance artifacts created. `emphasis` attribute: AUTHORITATIVE.
