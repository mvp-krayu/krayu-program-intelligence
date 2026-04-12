GAUGE RUNTIME LABEL BINDING CONTRACT
Contract ID: GAUGE.RUNTIME.LABEL.BINDING.01
Stream: GAUGE.RUNTIME.LABEL.BINDING.01
Layer: Runtime Exposure (42.x) — GAUGE Binding
Status: AUTHORITATIVE DEFINITION

---

## SECTION 1 — CONTRACT OBJECTIVE

This contract defines the lawful binding of structural label resolution outputs into GAUGE runtime consumption. Its purpose is to ensure that every rendered GAUGE element carries:
- a display label sourced exclusively from the upstream resolved label
- a secondary label equal to the canonical identifier
- an optional short label passed through unchanged when present upstream

Runtime must consume labels — it must never create them. This contract enforces that boundary absolutely.

---

## SECTION 2 — AUTHORITATIVE INPUTS

The following inputs are the sole authority for this binding contract. No other source may be consulted.

| # | Input | Source |
|---|---|---|
| 1 | Projection output v1.1 | PSEE.PROJECTION.LAYER.CONTRACT.V1.1 |
| 2 | Projection output v2 | PSEE.PROJECTION.LAYER.CONTRACT.V2 |
| 3 | Binding structure: `nodes[]`, `containment_tree{}`, `overlap_edges[]` | GAUGE.RUNTIME.BINDING.01 |
| 4 | Structural label resolution output: `canonical_id`, `resolved_label`, `short_label` (optional) | PSEE.STRUCTURAL.LABEL.RESOLUTION.01 |

The structural label resolution output is the upstream label authority. It is the exclusive source for `display_label` values in this binding. Any element not present in the label resolution output must not receive a label — it must fail with GL-01.

---

## SECTION 3 — BOUND FIELD MAPPING

The following field mapping is the complete and exclusive definition of how label resolution outputs bind into runtime consumption fields. No other mapping is defined or permitted.

| Resolution field | Runtime binding field | Mapping rule |
|---|---|---|
| `canonical_id` | `canonical_id` | Direct pass-through — value unchanged |
| `resolved_label` | `display_label` | Direct assignment — `display_label = resolved_label` |
| `canonical_id` | `secondary_label` | Direct assignment — `secondary_label = canonical_id` |
| `short_label` (if present) | `short_label` | Pass-through only — absent when not present upstream |

No additional fields are introduced by this binding. No fields are merged, split, renamed beyond the above mapping, or derived.

### 3.1 Field identity rules

**`display_label`:** Must equal `resolved_label` exactly. No transformation, normalization, casing change, truncation, or whitespace modification is applied between assignment and consumption. The value is byte-for-byte the resolved_label value.

**`secondary_label`:** Must equal `canonical_id` exactly. It exists to ensure canonical identity is always accessible alongside the display label. No formatting, abbreviation, or truncation of `canonical_id` is applied.

**`canonical_id`:** Passes through unchanged from the resolution output record. It is the structural identity anchor for all other fields in the bound record.

**`short_label`:** Is present in the bound record only when the upstream resolution output record contains a `short_label` field. When the upstream field is absent, the `short_label` key is absent from the bound record. It is never set to null, empty string, or a substitute value. It is never computed, derived, or shortened from `display_label`.

---

## SECTION 4 — SCOPE COVERAGE

This binding must be applied to every structural element that carries a canonical_id and appears in the following binding targets:

| Binding target | Coverage requirement |
|---|---|
| `nodes[]` (GAUGE.RUNTIME.BINDING.01, binding target `nodes`) | Every node record — `canonical_id` is the `node_id` value per IP-1 of GAUGE.RUNTIME.BINDING.01 |
| `containment_tree{}` (binding target `containmentTree`) | Every parent-key entry — each parent node_id must resolve to a bound label record |
| `overlap_edges[]` (binding target `overlapEdges`) | Every edge record — `from_node` and `to_node` are node_id references; each must resolve to a bound label record for the referenced node |

Coverage is complete when every `canonical_id` appearing in any covered binding target has a corresponding bound record in the label binding layer.

### 4.1 Out-of-scope binding targets

The following binding targets are outside the scope of this label binding contract:

- `summary{}` — no canonical identifiers; integer counts only
- `constraint_flags{}` — opaque passthrough; no governed canonical identifiers
- `orphanSignals[]` — signal records; not structural node identifiers
- `signalsByNode` — signal records; not structural identifiers
- PL4-C3, PL4-C4 per-node annotations — boolean and count values; not identifiers
- PL4-C5 linkage reference — structural pointer value; must not be resolved into a label per PSEE.STRUCTURAL.LABEL.RESOLUTION.01 Section 3

---

## SECTION 5 — PROHIBITION SET

The following are absolutely prohibited at every point in the binding layer:

**P-01 — Fallback naming**
If `resolved_label` is absent for a given `canonical_id`, no fallback may be applied. The element must fail with GL-01. Forbidden fallbacks include: using `canonical_id` as `display_label`, using `node.label` directly as `display_label`, using any inferred or constructed name.

**P-02 — Label transformation**
The value of `resolved_label` must not be modified between receipt and assignment to `display_label`. Prohibited transformations include: casing changes, whitespace normalization, truncation, splitting, concatenation, abbreviation, reformatting.

**P-03 — Short label computation**
`short_label` must not be derived, computed, shortened, or inferred from `display_label`, `canonical_id`, or any other field. It is a pass-through of an upstream value. If the upstream value is absent, the field is absent.

**P-04 — Semantic augmentation**
No health label, status label, risk label, priority label, severity label, or equivalent may be introduced or appended to any bound label field.

**P-05 — Signal usage**
Signal field values, `computation_state` values, PL4-C3 boolean values, PL4-C4 partition counts must not influence any bound label field.

**P-06 — Structural mutation**
Node records, containment relationships, edge records, and array ordering must not be modified by the label binding operation. The binding layer is additive only.

**P-07 — Identity substitution**
`canonical_id` must not be replaced by any surrogate — no positional index, no display label, no sequential identifier.

**P-08 — Cross-element naming**
A label for element A must not be derived from the resolved_label or canonical_id of element B.

---

## SECTION 6 — FAILURE MODES

| Code | Name | Definition | Binding condition |
|---|---|---|---|
| GL-01 | Missing resolved_label | `resolved_label` is absent from the upstream resolution output for a given `canonical_id` | `display_label` field cannot be populated; binding for this element fails |
| GL-02 | display_label mismatch | `display_label` value in the bound record does not exactly equal the `resolved_label` from the resolution output | Any transformation between assignment and output |
| GL-03 | canonical_id mismatch | `canonical_id` in the bound record does not exactly equal the `canonical_id` from the resolution output; or `secondary_label` does not equal `canonical_id` | Identity substitution or alteration |
| GL-04 | Fallback naming used | `display_label` was populated from any source other than `resolved_label` (e.g., raw `node.label`, identifier string, constructed string) | P-01 violation |
| GL-05 | Label transformation detected | `display_label` value differs from `resolved_label` by any transformation (casing, whitespace, truncation, etc.) | P-02 violation |
| GL-06 | Structural mutation | Any node, edge, containment relationship, or array order was altered as a result of binding | P-06 violation |
| GL-07 | short_label recomputed | `short_label` in the bound record was derived or computed rather than passed through from upstream; or `short_label` is present when upstream record has no `short_label` field | P-03 violation |
| GL-08 | Traceability broken | `canonical_id` is absent from the bound record; or `secondary_label` is absent; or `display_label` cannot be traced back to its `resolved_label` source | TR binding rules |

---

## SECTION 7 — SUCCESS CONDITION

Binding is successful when all of the following hold simultaneously:

| Condition | Measurable check |
|---|---|
| All labels from resolved_label | `display_label` count matching `resolved_label` exactly = total node count in scope |
| canonical_id preserved everywhere | Every bound record carries `canonical_id` = source `canonical_id` |
| display_label mismatch count | 0 |
| fallback usage count | 0 |
| transformation count | 0 |
| structural mutation count | 0 |
| output is deterministic | Same projection + resolution input → byte-equivalent bound label output |

If any condition is not met, binding fails for the affected elements. Failed elements are recorded with their GL failure code. Binding does not fail silently.

---

## SECTION 8 — DETERMINISTIC BINDING PRINCIPLE

The bound label record for any element is fully determined by two inputs: the resolution output record for that element's `canonical_id`, and the resolution output record alone. No external state, runtime context, rendering context, signal state, or UI configuration influences the bound record.

Given:
```
resolution_record = { canonical_id: X, resolved_label: Y, short_label: Z (optional) }
```

The bound record is always:
```
{
  canonical_id: X,
  display_label: Y,
  secondary_label: X,
  short_label: Z      // only when Z is present in resolution_record
}
```

This mapping is:
- total: defined for every valid resolution record
- functional: one input → one output
- deterministic: no runtime variable influences the output
- stateless: no prior binding state is consulted

Same inputs at any point in time produce byte-equivalent bound records.
