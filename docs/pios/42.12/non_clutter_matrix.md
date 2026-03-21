# Non-Clutter Matrix
## Stream 42.12 — Semantic Exposure Optimization

**contract_id:** PIOS-42.12-RUN01-CONTRACT-v1
**run_reference:** run_01_blueedge
**date:** 2026-03-21

---

## Matrix Purpose

For each surface in ExecLens, this matrix records:
- What stays **primary** (always shown, unchanged from current behavior)
- What stays **secondary** (shown only when ACTIVE and present)
- What is **omitted intentionally** (absent by design in all states or inactive mode)

The goal: every exposure decision is explicit. Nothing appears by accident.

---

## NC-01 — 42.3 CLI Output

| Element | Classification | Condition |
|---|---|---|
| `EXECLENS QUERY EXECUTION` header | PRIMARY | Always |
| Contract ID / run reference | PRIMARY | Always |
| Query ID, query text, intent, confidence | PRIMARY | Always |
| Bound signals section | PRIMARY | Always |
| Signal: signal_id, relevance, title | PRIMARY | Always |
| Signal: confidence, domain, capability | PRIMARY | Always |
| Signal: components, statement | PRIMARY | Always |
| Signal: impact, risk | PRIMARY | `--verbose` flag only (unchanged) |
| Evidence binding section | PRIMARY | Always |
| Navigation binding section | PRIMARY | Always |
| Response template section | PRIMARY | Always |
| Execution complete footer | PRIMARY | Always |
| **Semantic state banner** | SECONDARY | ACTIVE or FALLBACK only |
| **Signal semantic annotation row** | SECONDARY | ACTIVE + annotation exists |
| Empty annotation placeholder | OMITTED INTENTIONALLY | Never shown |
| Semantic debug info | OMITTED INTENTIONALLY | Out of scope |

**Primary / Secondary ratio (INACTIVE mode):** 100% / 0% — identical to pre-42.10.

---

## NC-02 — 42.4 JSON Adapter Output

| Field | Classification | Condition |
|---|---|---|
| `contract_id` | PRIMARY | Always |
| `query_id`, `query_text` | PRIMARY | Always |
| `intent_type`, `aggregate_confidence` | PRIMARY | Always |
| `semantic_tags` | PRIMARY | Always (ENL-sourced query tags, not 41.6) |
| `signals` array | PRIMARY | Always |
| Per signal: `signal_id`, `relevance`, `title` | PRIMARY | Always |
| Per signal: `evidence_confidence`, domain fields | PRIMARY | Always |
| Per signal: `component_ids`, `component_names` | PRIMARY | Always |
| Per signal: `statement`, `business_impact`, `risk` | PRIMARY | Always |
| Per signal: `evidence`, `evidence_warning` | PRIMARY | Always |
| `navigation` array | PRIMARY | Always |
| `template_section` | PRIMARY | Always |
| **`semantic_path_state`** (root) | SECONDARY | ACTIVE or FALLBACK only |
| **`semantic_activation_status`** (root) | SECONDARY | ACTIVE or FALLBACK only |
| **Per signal: `semantic_annotations`** | SECONDARY | ACTIVE + annotation exists |
| `semantic_annotations: null` | OMITTED INTENTIONALLY | Never — absent means not annotated |
| Coverage summary | OMITTED INTENTIONALLY | Not in 42.12 scope |

---

## NC-03 — 42.6 Overview Adapter Output

| Field | Classification | Condition |
|---|---|---|
| `dependency_load` | PRIMARY | Always |
| `structural_density` | PRIMARY | Always |
| `coordination_pressure` | PRIMARY | Always |
| `visibility_deficit` | PRIMARY | Always |
| Source signal metadata | PRIMARY | Always |
| **`semantic_path_state`** | SECONDARY | ACTIVE or FALLBACK only |
| Semantic metric interpretation | OMITTED INTENTIONALLY | 75.x territory — not in scope |
| Metric scoring or banding | OMITTED INTENTIONALLY | Forbidden — interpretation |

---

## NC-04 — 42.7 Topology Adapter Output

| Field | Classification | Condition |
|---|---|---|
| Domain entries (id, name, count) | PRIMARY | Always |
| Capability entries | PRIMARY | Always |
| Component entries | PRIMARY | Always |
| Co-occurrence data | PRIMARY | Always |
| Vault path resolution | PRIMARY | Always |
| **Per domain: `semantic_domain_id`** | SECONDARY | ACTIVE + domain annotation exists |
| Topology score or ranking | OMITTED INTENTIONALLY | Forbidden — interpretation |
| Semantic topology visualization | OMITTED INTENTIONALLY | Out of 42.12 scope |

---

## NC-05 — 42.8 Demo Choreography / UI Surface

| Element | Classification | Condition |
|---|---|---|
| Landing overview (gauges) | PRIMARY | Always |
| Signal cards (title, statement, evidence) | PRIMARY | Always |
| Topology panel | PRIMARY | Always |
| Query selection UI | PRIMARY | Always |
| Executive narrative panel | PRIMARY | Always |
| Navigation links panel | PRIMARY | Always |
| **Semantic state badge** | SECONDARY | ACTIVE or FALLBACK only |
| **Signal annotation chip** | SECONDARY | ACTIVE + annotation exists |
| **Semantic context panel** | SECONDARY | ACTIVE + annotations present |
| Semantic score gauge | OMITTED INTENTIONALLY | Forbidden — interpretation |
| "Semantic coverage: X%" indicator | OMITTED INTENTIONALLY | Coverage reporting deferred |
| Annotation modal with interpretation | OMITTED INTENTIONALLY | 75.x territory |

---

## NC-06 — Summary

| Surface | Primary Items | Secondary Items | Intentionally Omitted |
|---|---|---|---|
| 42.3 CLI | 14 | 2 | 2 |
| 42.4 JSON | 15 | 3 | 2 |
| 42.6 Overview | 4 | 1 | 2 |
| 42.7 Topology | 5 | 1 | 2 |
| 42.8 / UI | 6 | 3 | 3 |

**Clutter verdict:** Secondary items appear only when ACTIVE and data is present.
In INACTIVE mode, secondary item count = 0 across all surfaces.

**Non-clutter principle: ENFORCED**
