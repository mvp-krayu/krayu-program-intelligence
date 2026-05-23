# SQO Execution Graph

Operational reference for the SQO governance lifecycle. Machine-loadable source of truth: `sqo_execution_graph.json`.

---

## Stage Sequence

```
GATE 1          GATE 2              GATE 3            GATE 4           GATE 5
CEU             Proposition         Proposition       Revalidation     Promotion
Reconciliation  Derivation          Review                             Evaluation
(operator)      (deterministic)     (operator)        (deterministic)  (operator + anchor)
    │               │                   │                  │               │
    ▼               ▼                   ▼                  ▼               ▼
reconciliation  semantic_           proposition_       revalidation_    promotion_
_state.json     propositions.json   review_state.json  result.json      state.json
                                                                         │
                                                           ┌─────────────┘
                                                           ▼
                                                       ENRICHMENT ──→ re-run Gate 4
                                                       (deterministic)
```

Each gate requires the previous gate's completion artifact.

---

## State Vocabulary

### Proposition Dispositions

| State | Terminal | Meaning |
|-------|----------|---------|
| CANDIDATE | No | Initial state after derivation. Awaiting review. |
| ACCEPTED | Yes | Operator accepted as structurally valid. |
| REJECTED | Yes | Operator rejected as ungrounded. |
| CONTESTED | No | Operator disputes. Requires arbitration. |
| ARBITRATED | Yes | Arbitration resolved a contested proposition. |

**Naming rule:** Actions produce past-participle form. `accept` → `ACCEPTED`. `reject` → `REJECTED`. Never `ACCEPT` or `REJECT` (present tense).

### Stage States

| State | Meaning |
|-------|---------|
| NOT_STARTED | Prerequisites may or may not be met. |
| IN_PROGRESS | Artifacts partially produced. |
| COMPLETE | All required artifacts produced and valid. |
| BLOCKED | Cannot proceed — missing prerequisites or governance hold. |
| DEFERRED | Intentionally postponed — governed decision, not failure. |

### Promotion States

| State | Meaning |
|-------|---------|
| S0 | Initial. No governance lifecycle exercised. |
| S1 | First governed advancement. Full gate traversal proven. |
| S2 | Full qualification. Enrichment + convergence + revalidation. |

### Revalidation Verdicts

| Verdict | Gate 4 |
|---------|--------|
| PASS | Cleared. All 25 checks passed. |
| PARTIAL | NOT cleared. Some checks failed. |
| FAIL | Blocked. Critical checks failed. |

### Constitutional Anchor Verdicts

| Verdict | Advancement |
|---------|-------------|
| CONSTITUTIONAL_DISTANCE_NOMINAL | Permitted. Corpus comparable. |
| CONSTITUTIONAL_DISTANCE_ELEVATED | Permitted with operator rationale. Non-critical failures. |
| CONSTITUTIONAL_DISTANCE_CRITICAL | Blocked. CRITICAL dimensions failed. No override. |

---

## Allowed Transitions

### Proposition Dispositions

```
CANDIDATE ──accept──→ ACCEPTED (terminal)
CANDIDATE ──reject──→ REJECTED (terminal)
CANDIDATE ──contest─→ CONTESTED
CONTESTED ──arbitrate→ ARBITRATED (terminal)
CANDIDATE ──batch────→ ACCEPTED (accept-unflagged)
```

Invalid:
- ACCEPTED → anything (terminal)
- REJECTED → anything (terminal)
- ARBITRATED → anything (terminal)
- CANDIDATE → ARBITRATED (must contest first)
- CONTESTED → ACCEPTED or REJECTED (must arbitrate)

### Promotion

```
S0 ──advance──→ S1  requires: revalidation PASS + anchor not blocked
S1 ──advance──→ S2  requires: revalidation PASS + anchor not blocked + enrichment exercised
```

---

## Stage Artifact Requirements

### Gate 1: CEU Reconciliation

| | |
|---|---|
| Type | Operator governed |
| Script | `scripts/pios/ceu_reconciliation_action.py` |
| Input | `ceu/candidate_registry.json`, `ceu/evidence_anchors.json` |
| Output | `ceu/reconciliation_state.json`, `ceu/reconciliation_event_log.jsonl` |
| Complete when | `reconciliation_state.json` status == COMPLETE |
| Actions | confirm, reject, merge, complete |

### Gate 2: Proposition Derivation

| | |
|---|---|
| Type | Deterministic |
| Script (PATH A) | `scripts/pios/semantic_proposition_engine.py` |
| Script (PATH B) | `scripts/pios/sdc/proposition_bridge.py` |
| Input (PATH A) | reconciliation_state, candidate_registry, structural_centrality, code_graph, canonical_topology, spine hero_moments |
| Input (PATH B) | reconciliation_state, SDC candidate_csr, derivation_report, review_queue, client_semantic_registry, vault claims, topology_model |
| Output | `semantic/spe/semantic_propositions.json`, `semantic/spe/spe_derivation_report.json` |
| Complete when | semantic_propositions.json exists with propositions |

### Gate 3: Proposition Review

| | |
|---|---|
| Type | Operator governed |
| Script | `scripts/pios/proposition_review_action.py` |
| Input | `semantic/spe/semantic_propositions.json` |
| Output | `semantic/spe/proposition_review_state.json`, `semantic/spe/review_event_log.jsonl` |
| Complete when | status == COMPLETE AND all dispositions terminal |
| Terminal set | {ACCEPTED, REJECTED, ARBITRATED} |
| Actions | accept, reject, contest, arbitrate, accept-unflagged, complete |

### Gate 4: Revalidation

| | |
|---|---|
| Type | Deterministic |
| Script | `scripts/pios/revalidation_engine.py` |
| Input | semantic_propositions, proposition_review_state, reconciliation_state, promotion_state, spine_objects |
| Output | `sqo/revalidation_result.json`, `sqo/revalidation_event_log.jsonl` |
| Complete when | status == PASS (25/25 checks) |
| Phases | input_gate, proposition_integrity, confidence_realism, tier_validity, disposition_completeness, reconciliation_cleanliness, spine_consistency, sqo_state_consistency |

### Gate 5: Promotion

| | |
|---|---|
| Type | Operator governed + constitutional anchor |
| Script | `scripts/pios/promotion_action.py` |
| Anchor | `scripts/pios/constitutional_replay_anchor.py` |
| Input | revalidation_result (PASS), proposition_review_state (COMPLETE), promotion_state |
| Output | `sqo/promotion_state.json`, `sqo/promotion_event_log.jsonl`, `sqo/constitutional_replay_anchor.json` |
| Complete when | s_level advanced AND provenance == GOVERNED_LIFECYCLE |
| Anchor dimensions | proposition_count (CRITICAL), class_diversity (CRITICAL), review_obligations (HIGH), governance_friction (HIGH), confidence_distribution (HIGH), tier_diversity (HIGH), governance_event_density (MEDIUM), enrichment_activity (MEDIUM) |
| Actions | advance, hold, block, status |

---

## Rehydration Contract

On context compaction or session resume, before any SQO work:

**Mandatory loads:**
1. `docs/pios/sqo_execution_graph.json`
2. `docs/pios/CAPABILITY_REGISTRY.md`
3. `clients/{client}/psee/runs/{run_id}/sqo/promotion_state.json`
4. `clients/{client}/psee/runs/{run_id}/semantic/spe/proposition_review_state.json`

**Verification:**
- State vocabulary loaded — disposition names are canonical, not reconstructed
- Current stage identified — which gate is the run at?
- Allowed transitions known — what can happen next?
- Artifact locations known — where are inputs and outputs?

**Hard rule:** No S-state advancement may be evaluated unless this graph has been loaded and current run state mapped onto it.
