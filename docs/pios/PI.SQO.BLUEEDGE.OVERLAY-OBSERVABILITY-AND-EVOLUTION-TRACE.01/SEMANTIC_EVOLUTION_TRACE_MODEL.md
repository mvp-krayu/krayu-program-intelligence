# Semantic Evolution Trace Model

**Stream:** PI.SQO.BLUEEDGE.OVERLAY-OBSERVABILITY-AND-EVOLUTION-TRACE.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 6 — Operational Semantic Observability Architecture

---

## 1. Purpose

This document defines the trace model for semantic qualification
evolution — how a client's qualification state changes over time
become observable, ordered, attributed, and reconstructable as a
continuous evolution history rather than disconnected snapshots.

---

## 2. Evolution Trace Architecture

### 2.1 What Is an Evolution Trace

An evolution trace is the complete, ordered, causally-linked record
of every qualification state change for a given (client, run_id) pair.
It captures not just what changed, but why it changed, what caused it,
what authorized it, and what the state was before and after.

The trace transforms isolated re-evaluation artifacts into a coherent
qualification evolution narrative.

### 2.2 Trace vs Audit Trail

| Concern | Audit Trail | Evolution Trace |
|---------|------------|----------------|
| Focus | Individual operations (mount, revoke, validate) | Qualification state transitions |
| Granularity | Per-event (20 event types) | Per-transition (state → state) |
| Question answered | "What happened?" | "How did qualification evolve?" |
| Primary consumer | Governance auditor | Operator and cockpit |
| Source | Sandbox audit events | Synthesized from re-evaluation artifacts + audit events |

The evolution trace is a higher-order synthesis — it reads audit events
and re-evaluation artifacts to construct a qualification evolution
narrative. It does NOT replace the audit trail.

---

## 3. Trace Record Model

### 3.1 Evolution Transition Record

Each qualification state change produces one transition record:

```json
{
  "transition_id": "<uuid>",
  "sequence_number": N,
  "timestamp": "<ISO-8601>",
  "client": "<client_id>",
  "run_id": "<run_id>",
  "sandbox_id": "<sandbox_id>",
  "prior_state": {
    "s_state": "S2",
    "q_class": "Q-02",
    "backed_count": 4,
    "backed_domains": ["DOMAIN-01", "DOMAIN-10", "DOMAIN-14", "DOMAIN-16"],
    "grounding_ratio": 0.235,
    "overlay_count": 0,
    "certification_level": "PIPELINE_CERTIFIED",
    "composite_hash": "<hash>"
  },
  "post_state": {
    "s_state": "S2",
    "q_class": "Q-02",
    "backed_count": 5,
    "backed_domains": ["DOMAIN-01", "DOMAIN-10", "DOMAIN-11", "DOMAIN-14", "DOMAIN-16"],
    "grounding_ratio": 0.294,
    "overlay_count": 1,
    "certification_level": "SANDBOX_COMPUTED",
    "composite_hash": "<hash>"
  },
  "delta": {
    "backed_count_change": "+1",
    "domains_added": ["DOMAIN-11"],
    "domains_removed": [],
    "grounding_ratio_change": "+0.059",
    "s_state_change": null,
    "q_class_change": null,
    "certification_level_change": "PIPELINE_CERTIFIED → SANDBOX_COMPUTED"
  },
  "cause": {
    "trigger_type": "SEP_ACTIVATED",
    "trigger_package_id": "SEP-blueedge-run01-001",
    "trigger_entry_id": "E-001",
    "claim_type": "LINEAGE_UPGRADE",
    "target_domain": "DOMAIN-11",
    "causal_chain": [
      "SEP-blueedge-run01-001 activated",
      "E-001: LINEAGE_UPGRADE DOMAIN-11 PARTIAL→STRONG",
      "backed_count 4→5",
      "grounding_ratio 0.235→0.294"
    ]
  },
  "authorization": {
    "source": "stream_contract",
    "authority": "PI.SQO.BLUEEDGE.DYNAMIC-CEU.MICRO-OVERLAY-ACTIVATION.01"
  },
  "replay_inputs_hash": "<hash of 6-input set at this transition>",
  "reversible": true,
  "reversal_mechanism": "STANDARD_REVOCATION"
}
```

### 3.2 Transition Types

| Transition Type | Trigger | Direction |
|----------------|---------|-----------|
| OVERLAY_ACTIVATION | SEP activated | Forward (qualification advances) |
| OVERLAY_REVOCATION | SEP revoked | Backward (qualification retreats) |
| OVERLAY_VERSION_UPGRADE | SEP version superseded | Neutral (qualification adjusts) |
| CONFLICT_RESOLUTION | Overlay conflict resolved | Neutral |
| FULL_SANDBOX_RESET | All overlays revoked | Backward (return to baseline) |
| BASELINE_DRIFT | Certified baseline changed | Reset (new evolution epoch) |

### 3.3 Transition Ordering

Transitions are strictly ordered by:

1. **Sequence number:** Monotonically increasing integer per (client, run_id)
2. **Timestamp:** ISO-8601 timestamp (for temporal ordering)
3. **Causal dependency:** A transition's prior_state.composite_hash MUST
   equal the preceding transition's post_state.composite_hash

This chain produces a deterministic evolution history. Any gap or hash
mismatch in the chain is a governance event.

---

## 4. Evolution Timeline

### 4.1 Timeline Model

The evolution timeline is the ordered sequence of transition records
for a (client, run_id):

```
T0: Baseline (certified)
│   S2, Q-02, 4/17, ratio 0.235
│   certification: PIPELINE_CERTIFIED
│
T1: SEP-001 activated → DOMAIN-11 PARTIAL→STRONG
│   S2, Q-02, 5/17, ratio 0.294
│   certification: SANDBOX_COMPUTED
│
T2: SEP-001 revoked → DOMAIN-11 STRONG→PARTIAL (reverted)
│   S2, Q-02, 4/17, ratio 0.235
│   certification: PIPELINE_CERTIFIED (baseline restored)
│
T3: [future] SEP-002 activated → DOMAIN-03 NONE→STRONG
│   ...
```

### 4.2 Timeline Properties

| Property | Guarantee |
|----------|----------|
| Completeness | Every qualification state change appears in the timeline |
| Ordering | Transitions are causally and temporally ordered |
| Determinism | Same evolution inputs produce same timeline |
| Reconstructability | Any T(n) state is replayable from T(0) + overlays at n |
| Reversibility | Every forward transition has a known reversal mechanism |
| Attribution | Every transition is linked to its causal overlay package |

### 4.3 Evolution Epochs

An epoch is a contiguous span of evolution transitions against the
same certified baseline. A new epoch begins when:

- The certified baseline changes (pipeline re-execution)
- A full sandbox reset occurs
- A new sandbox is created

```
Epoch 1: Against certified baseline v1
  T0 → T1 → T2 → T3
  [sandbox created → activations → revocations → ...]

Epoch 2: Against certified baseline v2
  T0' → T1' → T2'
  [new sandbox → new activations → ...]
```

Epochs are not connected by causal links. Each epoch starts fresh
from its certified baseline.

---

## 5. Trace Persistence

### 5.1 Trace Artifact Location

```
artifacts/sqo/<client>/<run_id>/sandbox/evolution/
├── trace_index.json
├── transitions/
│   ├── transition-001.json
│   ├── transition-002.json
│   └── ...
└── timeline_summary.json
```

### 5.2 Trace Index

```json
{
  "client": "<client_id>",
  "run_id": "<run_id>",
  "sandbox_id": "<sandbox_id>",
  "epoch": 1,
  "baseline_hash": "<certified baseline hash>",
  "transition_count": N,
  "current_state": {
    "s_state": "<current>",
    "q_class": "<current>",
    "backed_count": M,
    "overlay_count": K,
    "certification_level": "<current>"
  },
  "transitions": [
    {
      "transition_id": "<id>",
      "sequence_number": 1,
      "timestamp": "<time>",
      "type": "OVERLAY_ACTIVATION",
      "summary": "SEP-001 → DOMAIN-11 PARTIAL→STRONG"
    }
  ]
}
```

### 5.3 Timeline Summary

A compact, cockpit-consumable summary of the evolution:

```json
{
  "client": "<client_id>",
  "run_id": "<run_id>",
  "evolution_summary": {
    "epoch": 1,
    "baseline": { "s_state": "S2", "backed_count": 4 },
    "current": { "s_state": "S2", "backed_count": 5, "overlay_count": 1 },
    "peak": { "s_state": "S2", "backed_count": 5, "at_transition": 1 },
    "total_transitions": 2,
    "forward_transitions": 1,
    "backward_transitions": 1,
    "net_change": { "backed_count": 0, "s_state": "no change" }
  }
}
```

---

## 6. Trace Queries

The evolution trace MUST support:

| Query | Resolution |
|-------|-----------|
| What is the current qualification state? | Latest transition's post_state |
| How did we get here? | Ordered list of transitions |
| What caused the last change? | Latest transition's cause block |
| What was the state at time T? | Find transition with timestamp ≤ T |
| Which overlays are contributing now? | Active overlay set from latest state |
| Has the qualification ever been higher? | Peak state from timeline_summary |
| What would revocation of SEP-X do? | Replay reconstruction minus SEP-X |
| Is the current state reversible? | Check reversible flag on latest transition |
| How many forward vs backward transitions? | Count from timeline_summary |
| What epoch are we in? | trace_index.epoch |

---

## 7. Trace Integrity

### 7.1 Chain Verification

```
FOR EACH transition IN trace (ordered by sequence_number):
  VERIFY transition.prior_state.composite_hash ==
    previous_transition.post_state.composite_hash
  IF first transition:
    VERIFY prior_state.composite_hash == certified_baseline_hash
  IF mismatch:
    REPORT: "EVOLUTION_TRACE_CHAIN_BREAK at transition N"
    ESCALATE to governance
```

### 7.2 Trace-Audit Reconciliation

The evolution trace MUST be consistent with the audit trail:

```
FOR EACH transition IN trace:
  VERIFY corresponding audit event exists (REEVALUATION_COMPLETED)
  VERIFY transition.delta matches audit event.changes
  IF mismatch:
    REPORT: "TRACE_AUDIT_RECONCILIATION_FAILURE"
```

---

## 8. Governance Rules

1. Every qualification state change produces an evolution transition record.
2. Transitions are immutable and append-only.
3. Transition ordering is deterministic (sequence + timestamp + causal hash).
4. Evolution epochs reset on baseline change.
5. Trace-audit reconciliation is verifiable on demand.
6. No hidden evolution — every transition is externally visible.
7. The trace is a synthesis layer, NOT a replacement for the audit trail.
8. Trace integrity violations are governance events.
