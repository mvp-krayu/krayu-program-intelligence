# SQO Execution Graph

Operational reference for the SQO governance lifecycle. Machine-loadable source of truth: `sqo_execution_graph.json`.

---

## Stage Sequence

### S0 → S1 Path (Initial Governance Lifecycle)

```
GATE 1          GATE 2              GATE 3            GATE 4           GATE 5 (S1)
CEU             Proposition         Proposition       Revalidation     Promotion
Reconciliation  Derivation          Review                             → S1
(operator)      (deterministic)     (operator)        (deterministic)  (operator + anchor)
    │               │                   │                  │               │
    ▼               ▼                   ▼                  ▼               ▼
reconciliation  semantic_           proposition_       revalidation_    promotion_
_state.json     propositions.json   review_state.json  result.json      state.json [S1]
```

### S1 → S2 Path (Full Qualification)

```
S1 achieved
    │
    ▼
┌─ ENRICHMENT PLANNING ─────────────────────────────────────────────┐
│  Identify targets: weak/DERIVED propositions, debt items,         │
│  evidence sources. Output: enrichment_plan.json                   │
└───────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─ EVIDENCE ENRICHMENT EXECUTION ───────────────────────────────────┐
│  PATH A: code graph authority edges (AST)                         │
│  PATH B: HTML document structure re-extraction                    │
│  Output: enrichment_log.json, enrichment_activity_event.json      │
└───────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─ DEBT REASSESSMENT ───────────────────────────────────────────────┐
│  Re-evaluate debt items against enriched propositions.            │
│  Output: debt_reassessment.json                                   │
└───────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─ ENRICHED PROPOSITION UPDATE ─────────────────────────────────────┐
│  Apply enrichment: confidence deltas, tier upgrades, evidence     │
│  anchors. Output: enrichment_summary.json                         │
└───────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─ POST-ENRICHMENT REVALIDATION (Gate 4 re-run) ────────────────────┐
│  Same 25-check engine. Must PASS on enriched corpus.              │
│  Output: revalidation_result.json (overwritten)                   │
└───────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─ CONSTITUTIONAL ANCHOR RE-CHECK ──────────────────────────────────┐
│  enrichment_activity must now be PASS.                            │
│  All 8 dimensions evaluated. No CRITICAL failures.                │
│  Output: constitutional_replay_anchor.json (overwritten)          │
└───────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─ S2 PROMOTION EVALUATION (Gate 5, L5 authority) ──────────────────┐
│  Operator evaluates. Requires: post-enrichment revalidation PASS, │
│  anchor not blocked, enrichment_activity PASS.                    │
│  Output: promotion_state.json [S2, GOVERNED_LIFECYCLE]            │
└───────────────────────────────────────────────────────────────────┘
```

Each stage requires the previous stage's output artifact. S2 cannot be evaluated until `enrichment_activity == true` and post-enrichment revalidation PASS.

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

### Gate 5: Promotion (S0 → S1)

| | |
|---|---|
| Type | Operator governed + constitutional anchor |
| Script | `scripts/pios/promotion_action.py` |
| Anchor | `scripts/pios/constitutional_replay_anchor.py` |
| Input | revalidation_result (PASS), proposition_review_state (COMPLETE), promotion_state |
| Output | `sqo/promotion_state.json`, `sqo/promotion_event_log.jsonl`, `sqo/constitutional_replay_anchor.json` |
| Complete when | s_level == S1 AND provenance == GOVERNED_LIFECYCLE |
| Anchor dimensions | proposition_count (CRITICAL), class_diversity (CRITICAL), review_obligations (HIGH), governance_friction (HIGH), confidence_distribution (HIGH), tier_diversity (HIGH), governance_event_density (MEDIUM), enrichment_activity (MEDIUM) |
| Actions | advance, hold, block, status |

---

## S1 → S2 Advancement Path

### Stage 1: Enrichment Planning

| | |
|---|---|
| Type | Deterministic |
| Script | TBD (part of enrichment stream) |
| Input | semantic_propositions.json, proposition_review_state.json (COMPLETE), promotion_state.json (S1), constitutional_replay_anchor.json (enrichment_activity: false) |
| Output | `semantic/spe/enrichment_plan.json` |
| Complete when | enrichment_plan.json exists with target propositions and evidence sources |

### Stage 2: Evidence Enrichment Execution

| | |
|---|---|
| Type | Deterministic |
| Script (PATH B) | `scripts/pios/sdc/evidence_enrichment_rc04.py` (EXISTS — needs parameterization) |
| Input | enrichment_plan.json, evidence source files |
| Output | `semantic/spe/enrichment_log.json`, `semantic/spe/enrichment_activity_event.json` |
| Complete when | enrichment_log.json exists with enrichment events AND enrichment_activity_event.json emitted |

### Stage 3: Debt Reassessment

| | |
|---|---|
| Type | Deterministic |
| Script | TBD |
| Input | enrichment_log.json, qualification_blockers.json (or debt inventory) |
| Output | `semantic/spe/debt_reassessment.json` |
| Complete when | debt_reassessment.json exists with before/after debt classification |

### Stage 4: Enriched Proposition Update

| | |
|---|---|
| Type | Deterministic |
| Script | TBD |
| Input | semantic_propositions.json, enrichment_log.json, debt_reassessment.json |
| Output | `semantic/spe/semantic_propositions.json` (enriched), `semantic/spe/enrichment_summary.json` |
| Complete when | enrichment_summary.json exists with proposition count, confidence deltas, tier changes |

### Stage 5: Post-Enrichment Revalidation

| | |
|---|---|
| Type | Deterministic |
| Script | `scripts/pios/revalidation_engine.py` (same engine, re-run) |
| Input | semantic_propositions.json (enriched), proposition_review_state.json, reconciliation_state.json, promotion_state.json (S1), spine_objects.json |
| Output | `sqo/revalidation_result.json` (overwritten), `sqo/revalidation_event_log.jsonl` (appended) |
| Complete when | status == PASS |

### Stage 6: Constitutional Anchor Re-check

| | |
|---|---|
| Type | Deterministic |
| Script | `scripts/pios/constitutional_replay_anchor.py` (same engine, re-run) |
| Input | revalidation_result.json (PASS), enrichment_activity_event.json, promotion_state.json (S1) |
| Output | `sqo/constitutional_replay_anchor.json` (overwritten) |
| Complete when | advancement_blocked == false AND enrichment_activity == PASS |

### Stage 7: S2 Promotion Evaluation

| | |
|---|---|
| Type | Operator governed + constitutional anchor (L5 authority) |
| Script | `scripts/pios/promotion_action.py` |
| Anchor | `scripts/pios/constitutional_replay_anchor.py` |
| Input | revalidation_result.json (PASS, post-enrichment), constitutional_replay_anchor.json (not blocked, enrichment PASS), enrichment_summary.json, debt_reassessment.json, promotion_state.json (S1) |
| Output | `sqo/promotion_state.json` (S2, GOVERNED_LIFECYCLE), `sqo/promotion_event_log.jsonl` |
| Complete when | s_level == S2 AND provenance == GOVERNED_LIFECYCLE |
| Actions | advance, hold, block, status |

**S2 promotion rule:** S2 cannot be evaluated until enrichment_activity == true AND post-enrichment revalidation PASS. This is enforced by the constitutional anchor and the promotion action's integrated anchor check.

---

## Rehydration Contract

On context compaction or session resume, before any SQO work:

**Mandatory loads:**
1. `docs/pios/sqo_execution_graph.json`
2. `docs/pios/CAPABILITY_REGISTRY.md`
3. `clients/{client}/psee/runs/{run_id}/sqo/promotion_state.json`
4. `clients/{client}/psee/runs/{run_id}/semantic/spe/proposition_review_state.json`
5. `clients/{client}/psee/runs/{run_id}/sqo/constitutional_replay_anchor.json` (if exists — shows which dimensions are elevated/failed)
6. `clients/{client}/psee/runs/{run_id}/semantic/spe/enrichment_activity_event.json` (if S1 — determines S1→S2 stage position)

**Verification:**
- State vocabulary loaded — disposition names are canonical, not reconstructed
- Current S-level identified — S0, S1, or S2?
- Current advancement path identified — in S0→S1 or S1→S2 sequence?
- If S1: which S1→S2 stage is active? (enrichment_planning through gate_5_promotion_s2)
- Allowed transitions known — what can happen next?
- Artifact locations known — where are inputs and outputs?

**Hard rule:** No S-state advancement may be evaluated unless this graph has been loaded and current run state mapped onto it. The process must know how it advances — not rely on Claude remembering it.
