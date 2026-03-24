# ENL-008: Narrative Construction Rules

**Contract:** ENL-008-CONTRACT-v1
**Layer:** Narrative Coupling
**Applies To:** `lens_narrative_v1.py`
**Status:** Active

---

## Rule A — Evidence Anchoring

**A.1** Every statement in the narrative output MUST reference exactly one ENL node via a non-empty `node_id` field.

**A.2** No statement may be generated without a corresponding ENL node. There are no synthetic or inferred statements.

**A.3** The `text` field of every statement MUST be the verbatim `title` value from the corresponding ENL node dict. No transformation, summarization, or paraphrasing is permitted.

**A.4** The `source_ref` field of every statement MUST be copied from the corresponding ENL node's `source_ref` field. No substitution.

---

## Rule B — Layer Mapping

**B.1** `node_type == 'INTEL'` → `role = 'headline'`. The first INTEL node in the chain becomes the narrative headline. Its title populates `headline`; its node_id populates `headline_node_id`.

**B.2** `node_type == 'SIG-41'` → `role = 'support'`. Placed in `statements`.

**B.3** `node_type == 'SIG-40'` → `role = 'support'`. Placed in `statements`.

**B.4** `node_type == 'EVID'` → `role = 'evidence'`. Placed in `evidence`. EVID nodes MUST NOT appear in `statements`.

**B.5** Every node in the chain MUST appear exactly once across `statements` and `evidence`. No node is dropped.

**B.6** Statement order within `statements` MUST follow chain order (the order nodes appear in the input chain list).

---

## Rule C — No Inference

**C.1** No meaning may be added to a statement beyond what is present in the ENL node fields.

**C.2** No aggregation of multiple node values into a single statement is permitted.

**C.3** No cross-node comparison, trend analysis, or derived conclusion may be expressed in any output field.

**C.4** No statistical, predictive, or probabilistic interpretation is permitted.

**C.5** No node field may be modified, enriched, or annotated by the narrative layer.

---

## Rule D — Incomplete Chain Handling

**D.1** If the chain contains no EVID node, `status` MUST be `'incomplete'`.

**D.2** When `status == 'incomplete'`, `incomplete_reason` MUST be a non-empty string explaining the gap (e.g., which layers are present and which are missing).

**D.3** An incomplete chain narrative MUST NOT be presented to the user as a resolved evidence conclusion.

**D.4** `evidence` will be an empty list for incomplete chains. This is expected and correct — not an error condition.

**D.5** `generate_narrative` on an incomplete upstream view MUST propagate `status = 'incomplete'` to the narrative output. The binding layer's `terminates_in_evid = False` is not used directly — the narrative layer independently determines completeness by examining whether EVID is present in the chain.

---

## Rule E — Determinism

**E.1** Identical input produces identical output. The narrative layer has no state.

**E.2** For unordered views (query, full graph), node ordering MUST be determined by `(LAYER_ORDER, node_id)` before narrative construction. LAYER_ORDER: INTEL=0, SIG-41=1, SIG-40=2, EVID=3.

**E.3** No timestamps, counters, or random values are introduced into output fields.

**E.4** The narrative layer MUST NOT cache results.

---

## Rule F — Immutability

**F.1** `generate_node_statement` MUST NOT modify the input node dict.

**F.2** `generate_chain_narrative` MUST NOT modify the input chain list or any node dict within it.

**F.3** `generate_narrative` MUST NOT modify the input view, its chain, or any node dict referenced by the view.

**F.4** `attach_evidence_trace` MUST NOT modify the input narrative dict or the input chain list. It returns a new narrative dict with the enriched trace.

**F.5** Evidence trace snapshots (from `attach_evidence_trace`) MUST be scalar copies of node fields — not references to the original ENL node dicts.

---

## Rule G — ENL Boundary

**G.1** The narrative layer MUST NOT import or call any function from `enl_query_engine_v1`.

**G.2** The narrative layer MUST NOT perform graph traversal, load graphs from disk, or validate ENL graph structure.

**G.3** The narrative layer operates exclusively on Lens view structures already produced by the binding, persona, or drill-down layers.

---

## Rule H — Persona Boundary

**H.1** Persona-projected views (containing `persona` and `node_display` keys) MUST be accepted without error.

**H.2** The `node_display` labels from a persona-projected view MUST NOT be used as statement text. Statement text is always the raw ENL node `title`.

**H.3** Persona influence on narrative output is limited to downstream display rendering by the UI layer — it does not enter the narrative data structure.

---

## Rule I — View Dispatch

**I.1** `generate_narrative` MUST detect the Lens view type and extract the appropriate node list.

**I.2** Upstream views and drill-down sessions share the `chain`+`entry_node` structure. A drill-down session is distinguished by the presence of `current_index`.

**I.3** For drill-down sessions, `generate_narrative` MUST use the full `chain` list — not a slice up to `current_index`. Navigation position is a UI concern; the narrative is built from the complete evidence chain.

---

## Compliance Table

| Rule | Verified by Test(s) |
|---|---|
| A.1 — every statement has node_id | T-31, T-32, T-90 |
| A.3 — text is verbatim title | T-05, T-33, T-63, T-64 |
| B.1 — INTEL → headline | T-04, T-16, T-17 |
| B.2/B.3 — SIG → support | T-09, T-10, T-29, T-30 |
| B.4 — EVID → evidence only | T-11, T-23, T-24 |
| B.5 — no node dropped | T-22, T-23, T-26 |
| B.6 — chain order preserved | T-28–T-30 |
| C.1–C.5 — no inference | T-63, T-64, T-83–T-85 |
| D.1 — incomplete → status incomplete | T-34, T-49 |
| D.2 — incomplete_reason present | T-35, T-50 |
| D.4 — evidence empty on incomplete | T-36 |
| E.1 — determinism | T-86–T-89 |
| F.1–F.5 — immutability | T-12, T-43, T-77–T-85 |
| G.1–G.3 — ENL boundary | (structural — no ENL engine imports) |
| H.1–H.3 — persona boundary | T-62–T-64 |
| I.2/I.3 — drill-down session dispatch | T-59–T-61 |

---

## Examples

### Full Chain Narrative (INTEL → EVID)

Input: upstream view with chain `[N-001 INTEL, N-002 SIG-41, N-003 SIG-40, N-004 EVID]`

Output:
```
headline:         "Program velocity declining across streams"
headline_node_id: "N-001"
statements:
  - { node_id: "N-001", role: "headline", text: "Program velocity declining across streams" }
  - { node_id: "N-002", role: "support",  text: "Stream 40 throughput below threshold for 3 consecutive cycles" }
  - { node_id: "N-003", role: "support",  text: "Delivery rate dropped from 92% to 71% in cycle 14" }
evidence:
  - { node_id: "N-004", role: "evidence", text: "Cycle 14 delivery log — 71% completion rate recorded" }
evidence_trace: ["N-001", "N-002", "N-003", "N-004"]
status:          "complete"
incomplete_reason: null
```

### Incomplete Chain Narrative (no EVID)

Input: upstream view with chain `[N-001 INTEL, N-002 SIG-41, N-003 SIG-40]`

Output:
```
headline:         "Program velocity declining across streams"
statements:
  - { node_id: "N-001", role: "headline", text: "Program velocity declining..." }
  - { node_id: "N-002", role: "support",  text: "Stream 40 throughput..." }
  - { node_id: "N-003", role: "support",  text: "Delivery rate dropped..." }
evidence:          []
evidence_trace:    ["N-001", "N-002", "N-003"]
status:            "incomplete"
incomplete_reason: "Evidence chain does not terminate in EVID. Present layers: ['INTEL', 'SIG-41', 'SIG-40']."
```

### Persona-Projected View (raw title preserved)

Input: persona-projected upstream view where node_display has label `"INT: Program velocity declining..."`

Statement text remains:
```
"Program velocity declining across streams"
```
NOT:
```
"INT: Program velocity declining across streams"   ← FORBIDDEN
```
