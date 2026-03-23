# Projection Emphasis Attribute Specification

stream: Stream 44.3 — Projection Emphasis Attribute Definition
program: Krayu — Program Intelligence Discipline
date: 2026-03-22
position: 44.x projection extension
status: AUTHORITATIVE

---

## 1. Position in Architecture

44.3 is a governed extension of 44.x projection semantics.

It does not:
- redefine 44.1 (Structural Overlay Projection Definition)
- redefine 44.2 (Projection Attachment Contract)
- introduce a new layer
- modify 43.x
- modify 42.x behavior

It adds one governed attribute to the projection payload within the layer boundaries already defined by 44.1 and 44.2.

Authoritative chain position:

```
L3 → 43.1 → 43.2 → 43.3 → 44.1 → 44.2 → [44.3 extension] → 42.x
```

44.3 operates within the 44.2 attachment process. It does not create a new attachment stage.

---

## 2. Attribute Definition

### 2.1 Name

```
emphasis
```

### 2.2 Allowed Values

Closed enumeration. No other values are permitted.

| Value | Designation |
|---|---|
| `high` | Upstream-assigned emphasis level |
| `medium` | Upstream-assigned emphasis level |
| `low` | Upstream-assigned emphasis level |
| `none` | No emphasis designation (default) |

### 2.3 Type Properties

| Property | Value |
|---|---|
| Type | Categorical string (closed set) |
| Numeric | No |
| Computed | No — not computed in 42.x |
| Derived | No — not derived in the UI |
| Ordered | No — the values are not ranked by the attribute itself; ranking is upstream responsibility |
| Required | No — absence is valid and treated as `none` |
| Default | `none` |

### 2.4 Scope

The `emphasis` attribute:
- is attached to individual projection elements (nodes and attachments)
- is part of the governed projection payload
- is bound to specific structural elements via the 44.2 attachment process
- does not exist at the signal layer (43.x)
- does not exist as a standalone entity outside projection context

---

## 3. Attachment Rule

### 3.1 Attachment Process

The `emphasis` attribute MUST be attached through the projection and attachment process defined in 44.2.

`emphasis` is a field on the projection element. It is populated upstream — before the payload reaches 42.x — and travels with the element through the governed attachment chain.

### 3.2 Attachment Requirements

The following rules govern how `emphasis` is attached to a projection element:

| Rule | Requirement |
|---|---|
| E-ATT-001 | `emphasis` MUST be set upstream of 42.x |
| E-ATT-002 | `emphasis` MUST be part of the projection payload — it travels with the element |
| E-ATT-003 | `emphasis` MUST be bound to a specific structural element (node or attachment) |
| E-ATT-004 | `emphasis` MUST NOT be assigned outside the projection context |
| E-ATT-005 | `emphasis` MUST NOT be computed from topology structure (no density, no co-occurrence scoring) |
| E-ATT-006 | `emphasis` MUST NOT be derived from signal count, confidence level, or any runtime metric |
| E-ATT-007 | `emphasis` MUST NOT be assigned by 42.x |
| E-ATT-008 | A projection element with no `emphasis` field is valid; the value is treated as `none` |

### 3.3 What Upstream Logic May Use to Set `emphasis`

Upstream logic (pre-42.x) assigns `emphasis` based on explicit, governed criteria. Examples of acceptable assignment basis:
- a programmatic designation by the signal author or projection author
- a governed field in the binding payload (e.g., explicit annotation in 43.2 payload)
- an explicit rule applied at projection time (e.g., "all signals of type X receive emphasis: high")

What upstream logic MUST NOT use:
- computed topology metrics
- density calculations
- co-occurrence analysis
- signal count aggregation
- any heuristic evaluation
- any SSZ / SSI equivalent

---

## 4. Extended Projection Payload

### 4.1 Projection Element Structure (Extended from 44.1)

44.1 defines the overlay element as:

```
node reference
signal reference
evidence reference
upstream validation basis
```

44.3 extends this with one additional field:

```
node reference
signal reference
evidence reference
upstream validation basis
emphasis                    ← 44.3 addition
```

The `emphasis` field is optional. Its absence is valid.

### 4.2 Canonical Payload Example

The following illustrates a projection element with the `emphasis` field populated:

```
{
  "node_reference": {
    "node_id": "<topology node identity>",
    "topology_source": "<external topology reference>",
    "topology_path": "<source reference>"
  },
  "signal_reference": {
    "signal_id": "<CKR signal identity>",
    "signal_state": "<unmodified state from 43.2>",
    "provenance_reference": "<provenance chain reference>"
  },
  "evidence_reference": {
    "association_basis": "<evidence-grounded basis>",
    "provenance_chain": "<full provenance chain>",
    "topology_evidence_reference": "<topology evidence reference>"
  },
  "upstream_validation_basis": {
    "validator": "43.3",
    "result": "VALID",
    "validated_at": "<timestamp>"
  },
  "emphasis": "high"
}
```

A projection element with no emphasis designation:

```
{
  ...
  "emphasis": "none"
}
```

Or equivalently, with the field absent:

```
{
  "node_reference": { ... },
  "signal_reference": { ... },
  "evidence_reference": { ... },
  "upstream_validation_basis": { ... }
}
```

Both the absent field and `"emphasis": "none"` are treated identically by 42.x.

### 4.3 What `emphasis` Does Not Contain

The `emphasis` attribute is not:
- a score
- a rank
- a severity level
- a risk indicator
- a computed metric
- an SSZ or SSI equivalent

It is a categorical designation set by upstream logic and passed unchanged.

---

## 5. Attachment Validation Rules

Before a projection element is passed to 42.x, the following must hold:

| Rule | Check | Fail Behavior |
|---|---|---|
| E-VAL-001 | If `emphasis` is present, its value must be in the closed set: `high`, `medium`, `low`, `none` | Treat as `none` |
| E-VAL-002 | `emphasis` must not be a numeric value | Treat as `none` |
| E-VAL-003 | `emphasis` must not be derived from topology structure at attachment time | Attachment is invalid; element must not pass validation |
| E-VAL-004 | `emphasis` must not have been set by a 42.x component | Attachment is invalid; element must not pass validation |
| E-VAL-005 | Absence of `emphasis` is valid | No failure; treat as `none` |
| E-VAL-006 | If `emphasis` is present, it must carry upstream attribution traceable to the governed projection lineage (i.e., assigned as part of the 44.x projection process, not injected outside it) | Attachment is invalid; element must not pass validation |

### 5.1 Validation Outcome

`emphasis` validation does not override the element-level VALID/INVALID determination from 43.3. An element that passes 43.3 validation is not invalidated by `emphasis` absence or the `none` value.

An element with `emphasis` outside the allowed set (E-VAL-001) is not rejected — the value is corrected to `none`. This is the only correction permitted; no other field may be corrected.

An element where `emphasis` was computed from topology structure (E-VAL-003), set by a 42.x component (E-VAL-004), or present without traceable upstream attribution (E-VAL-006) is invalid and must not pass attachment.

---

## 6. Consumer Handling Rules (42.x)

### 6.1 Permitted 42.x Actions

42.x may:
- read the `emphasis` value from the projection element
- pass `emphasis` to the rendering layer without modification
- map `emphasis` to a visual representation (e.g., color, weight, highlight)

### 6.2 Prohibited 42.x Actions

42.x MUST NOT:
- compute `emphasis` from any data source
- modify the received `emphasis` value
- infer `emphasis` from signal confidence, domain membership, or any runtime property
- override `emphasis` based on UI state or interaction
- create a fallback `emphasis` value when the field is missing
- treat `high` as more important than `medium` unless that ordering is explicit in upstream definition
- interpret the semantic meaning of `emphasis` beyond the visual mapping it is used for

### 6.3 Fail-Closed Rule

If `emphasis` is:
- absent from the projection element
- present but outside the allowed set (`high`, `medium`, `low`, `none`)
- present but null
- present but empty string

Then 42.x MUST treat the value as `none`.

No substitution, inference, or escalation is permitted.

### 6.4 Rendering Contract

The mapping from `emphasis` to visual representation is a rendering concern. It is not defined here. The constraint is:

- the same `emphasis` value must produce the same visual output for the same rendering context (deterministic)
- the rendering mapping must not feed back into any data state
- the rendering mapping must not alter the underlying projection element

---

## 7. Relationship to 44.1 and 44.2

### 7.1 Relationship to 44.1

44.1 defines the overlay element structure. 44.3 adds one optional field (`emphasis`) to that structure. All 44.1 constraints remain in force:
- overlay elements are not a new data structure
- lifecycle is refresh-only, non-accumulative
- multi-binding coexistence is independent; `emphasis` is per-element, not aggregated across bindings
- zero-binding state remains valid

### 7.2 Relationship to 44.2

44.2 defines the attachment contract. `emphasis` is attached as part of the projection element during the 44.2 process. All 44.2 constraints remain in force:
- exact node match only
- fail-closed on resolution failure
- no heuristic mapping
- one binding → one node (with the `emphasis` field traveling with the element)

### 7.3 What 44.3 Does Not Change

| 44.1 / 44.2 Rule | Status After 44.3 |
|---|---|
| Fail-closed on resolution failure | Unchanged |
| No heuristic node mapping | Unchanged |
| Evidence continuity | Unchanged — `emphasis` does not replace or override evidence |
| Upstream validation basis | Unchanged — `emphasis` does not alter the 43.3 result |
| Non-accumulative lifecycle | Unchanged |
| Multi-binding independence | Unchanged — each element has its own `emphasis` |

---

## 8. Prohibited Behaviors (44.3 Boundary)

44.3 MUST NOT be used to introduce:

| Prohibited Behavior | Reason |
|---|---|
| Scoring systems | `emphasis` is categorical; no numeric ordering is defined here |
| Aggregation logic | `emphasis` is per-element; no cross-element aggregation |
| Density calculations | Any topology density metric would reproduce SSZ/SSI patterns |
| Heuristic evaluation | Assignment must be explicit, not computed from structural patterns |
| Runtime-derived metrics | `emphasis` is set upstream; 42.x does not derive it |
| SSZ / SSI equivalents | Any structural stress construct is excluded regardless of naming |
| Importance calculations | Relative importance ordering beyond the four values is not defined here |
| Rendering-driven assignment | Visual state does not set `emphasis` |

---

## 9. Validation Summary

| Check | Rule | Result Expectation |
|---|---|---|
| `emphasis` value in closed set | E-VAL-001 | PASS or treat as `none` |
| `emphasis` not numeric | E-VAL-002 | PASS or treat as `none` |
| `emphasis` not derived from topology structure | E-VAL-003 | PASS or element invalid |
| `emphasis` not set by 42.x | E-VAL-004 | PASS or element invalid |
| Absent `emphasis` treated as `none` | E-VAL-005 | Always PASS |
| 42.x does not compute `emphasis` | Consumer rule | Verified at 42.x compliance check |
| 42.x does not create fallback emphasis | Consumer rule | Verified at 42.x compliance check |
| No scoring or aggregation introduced | Boundary rule | Verified at 44.3 governance review |

---

## 10. Governance Lock

```
stream: 44.3
attribute: emphasis
type: categorical
values: high | medium | low | none
default: none
assignment: upstream only
consumer_rule: pass-through, no derivation, fail-closed to none
prohibited: scoring, aggregation, density, heuristic, SSZ/SSI equivalents
status: AUTHORITATIVE
```
