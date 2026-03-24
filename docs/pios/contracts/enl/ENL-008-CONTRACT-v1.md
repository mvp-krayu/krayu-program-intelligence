# ENL-008-CONTRACT-v1

**Contract ID:** ENL-008-CONTRACT-v1
**Layer:** Narrative Coupling
**Run:** run_01_blueedge
**Status:** Closed
**Depends On:** ENL-004-CONTRACT-v1, ENL-005-CONTRACT-v1, ENL-006-CONTRACT-v1

---

## 1. Purpose

Define and implement a strict coupling between ENL navigation outputs and the narrative layer (41.x), ensuring every narrative statement is directly and transparently grounded in ENL evidence chains with no inference, synthesis, or data transformation.

The narrative layer enables fully traceable, evidence-backed narrative generation compliant with the Evidence First doctrine.

---

## 2. Scope

**In scope:**
- Narrative generation from any Lens view structure or drill-down session
- Layer-based role assignment (INTEL → headline, SIG → support, EVID → evidence)
- Evidence trace construction and enrichment
- Incomplete chain detection and surfacing
- Persona-projected view compatibility (display-only influence — raw text preserved)

**Out of scope:**
- Interpretation, inference, or summarization of ENL data
- ENL engine access or graph traversal
- Statistical or predictive analysis
- Caching or state retention
- UI rendering logic

---

## 3. Deliverables

| # | Artifact | Path | Status |
|---|---|---|---|
| 1 | Narrative coupling module | `scripts/pios/enl/lens_narrative_v1.py` | ✓ Complete |
| 2 | Test suite | `scripts/pios/enl/test_lens_narrative.py` | ✓ Complete |
| 3 | Narrative model document | `docs/pios/enl/ENL-008_narrative_model.md` | ✓ Complete |
| 4 | Narrative rules document | `docs/pios/enl/ENL-008_narrative_rules.md` | ✓ Complete |
| 5 | Contract record | `docs/pios/contracts/enl/ENL-008-CONTRACT-v1.md` | ✓ Complete |

---

## 4. Public API

```python
# Module: scripts/pios/enl/lens_narrative_v1.py

generate_node_statement(node)              → statement dict
generate_chain_narrative(chain)            → narrative dict
generate_narrative(view)                   → narrative dict
attach_evidence_trace(narrative, chain)    → new narrative dict (enriched trace)
```

---

## 5. Narrative Output Structure

```
{
  "view_type":         str,           — detected Lens view type
  "headline":          str | None,    — verbatim title of first INTEL node
  "headline_node_id":  str | None,    — node_id of headline source node
  "statements":        [ statement ], — INTEL + SIG-41 + SIG-40 in chain order
  "evidence":          [ statement ], — EVID nodes in chain order
  "evidence_trace":    [ node_id ],   — all node_ids in chain order
  "status":            str,           — complete | incomplete
  "node_count":        int,
  "incomplete_reason": str | None,
}
```

Each statement:
```
{
  "node_id":    str,  — ENL node identifier (always present)
  "node_type":  str,
  "role":       str,  — headline | support | evidence
  "text":       str,  — verbatim node title
  "source_ref": str,
  "status":     str,
  "run_id":     str,
}
```

---

## 6. Key Design Decisions

### 6.1 Verbatim Text — No Transformation

The `text` field of every statement is the raw node `title`. No prefix, suffix, or reformatting is applied. Persona labels (from `node_display`) are not used as statement text. This is the primary enforcement mechanism for the no-inference rule.

### 6.2 Every Node Represented Exactly Once

The first INTEL node appears in both `statements` (with `role = 'headline'`) and as the `headline` field. All other nodes appear in either `statements` or `evidence`. No node is dropped. Every statement is anchored to a `node_id`.

### 6.3 Complete vs Incomplete Determined Independently

The narrative layer determines `status` by examining whether the chain contains an EVID node — it does not rely on `terminates_in_evid` from the upstream view. This makes the determination explicit and self-contained.

### 6.4 Full Chain for Drill-Down Sessions

When a drill-down session is passed to `generate_narrative`, the full `chain` is used — not a slice up to `current_index`. The session's navigation position is a UI concern; the narrative is always built from the complete evidence chain.

### 6.5 Immutable Outputs

All functions return new dicts. No input structure (view, chain, narrative dict, node dict) is modified at any level.

---

## 7. Acceptance Criteria

| Criterion | Test IDs |
|---|---|
| Every statement has non-empty node_id | T-31, T-32, T-90–T-93 |
| Statement text is verbatim node title | T-05, T-33, T-63, T-64 |
| Layer mapping correct | T-04, T-09–T-11, T-28–T-30 |
| Full chain → status complete | T-25, T-47, T-53 |
| Incomplete chain → status incomplete + reason | T-34, T-35, T-49, T-50 |
| Incomplete chain evidence list is empty | T-36 |
| No mutation of node data | T-12, T-43, T-77–T-85 |
| Deterministic output | T-86–T-89 |
| All view types dispatched correctly | T-44–T-61 |
| Persona compatibility — raw title preserved | T-62–T-64 |
| attach_evidence_trace produces enriched trace | T-68–T-80 |
| Exception hierarchy correct | T-95–T-97 |

**Test result:** 101/101 PASS

---

## 8. ENL Stack State

| Contract | Artifact | Status |
|---|---|---|
| ENL-001 | Evidence Navigation Layer concept | Active |
| ENL-002 | Evidence graph schema | Active |
| ENL-002A | Lens integration boundary | Active |
| ENL-003 | Query engine (`enl_query_engine_v1.py`) | Active |
| ENL-004 | Lens binding layer (`lens_binding_v1.py`) | Active |
| ENL-005 | Persona projection layer (`lens_persona_v1.py`) | Closed |
| ENL-006 | Drill-down model (`lens_drilldown_v1.py`) | Closed |
| ENL-008 | Narrative coupling (`lens_narrative_v1.py`) | **Closed** |

---

## 9. Evidence First Compliance

| Requirement | Enforcement Mechanism |
|---|---|
| Every statement traceable to ENL node | `node_id` field mandatory in every statement |
| No statements without evidence | nodes-only source; no free-text generation |
| No inference beyond ENL data | verbatim `title` only; no cross-node derivation |
| Incomplete evidence surfaced explicitly | `status = 'incomplete'`, `incomplete_reason` present |
| No mutation of ENL node content | all functions return new dicts; inputs unchanged |
| Deterministic narrative generation | sort by `(LAYER_ORDER, node_id)`; no state |

---

## 10. Downstream Handover

ENL-008 closes the narrative coupling boundary at v1. The narrative output structure (`headline`, `statements`, `evidence`, `evidence_trace`) is the canonical input format for 41.x narrative rendering components.

No further ENL contracts are defined in this series at this time.
