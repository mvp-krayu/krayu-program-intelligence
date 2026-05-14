# Overlay Activation Causality Model

**Stream:** PI.SQO.BLUEEDGE.OVERLAY-OBSERVABILITY-AND-EVOLUTION-TRACE.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 6 — Operational Semantic Observability Architecture

---

## 1. Purpose

This document defines the causality model for overlay activation —
how each overlay activation decision is linked to its upstream causes,
downstream effects, and the complete causal chain from evidence source
to qualification state change.

---

## 2. Causality Architecture

### 2.1 What Is Activation Causality

Every qualification state change has a causal chain:

```
Source evidence → Package creation → Validation → Authorization →
Activation → Re-evaluation → Qualification delta → State transition
```

The causality model makes this chain explicit, observable, and
reconstructable. No state change occurs without a traceable cause.

### 2.2 Causal Chain Levels

| Level | What | Example |
|-------|------|---------|
| L0: Evidence source | Where the claim originates | Certified topology model (fb04994a...) |
| L1: Package assembly | How evidence becomes an overlay package | SEP-blueedge-run01-001, entry E-001 |
| L2: Lifecycle execution | How the package progresses through activation | 9/9 validation → 5/5 authorization → 6/6 eligibility |
| L3: Qualification impact | What the activation changes | backed_count 4→5, DOMAIN-11 PARTIAL→STRONG |
| L4: State consequence | What the qualification change means | grounding_ratio 0.235→0.294, S-state unchanged |

---

## 3. Causal Chain Record

### 3.1 Schema

```json
{
  "causal_chain_id": "<uuid>",
  "package_id": "<package that caused the change>",
  "package_version": 1,
  "timestamp": "<when the chain completed>",
  "levels": {
    "L0_evidence_source": {
      "source_authority": "semantic_topology_model",
      "source_type": "ARCHITECTURE_RECORD",
      "source_hash": "<hash of source artifact>",
      "source_path": "<artifact path>",
      "extraction_method": "STRUCTURAL_CORRESPONDENCE"
    },
    "L1_package_assembly": {
      "package_id": "<id>",
      "entry_count": 1,
      "entries": [
        {
          "entry_id": "E-001",
          "claim_type": "LINEAGE_UPGRADE",
          "target_domain": "DOMAIN-11",
          "prior_status": "PARTIAL",
          "proposed_status": "STRONG",
          "confidence_basis": "STRONG_INFERENCE",
          "semantic_class": "TECHNICAL"
        }
      ]
    },
    "L2_lifecycle_execution": {
      "phases_executed": [
        { "phase": 0, "name": "Registration", "result": "STAGED" },
        { "phase": 1, "name": "Validation", "checks": 9, "passed": 9 },
        { "phase": 2, "name": "Authorization", "checks": 5, "passed": 5 },
        { "phase": 3, "name": "Eligibility", "checks": 6, "passed": 6 },
        { "phase": 4, "name": "Activation Authorization", "source": "stream_contract" },
        { "phase": 5, "name": "Re-evaluation", "triggered": true },
        { "phase": 6, "name": "Qualification-visible", "composite_updated": true },
        { "phase": 7, "name": "Terminal", "final_status": "ACTIVATED" }
      ],
      "total_checks": 20,
      "total_passed": 20,
      "total_failed": 0,
      "gate_failures": []
    },
    "L3_qualification_impact": {
      "metrics_changed": [
        {
          "metric": "backed_count",
          "before": 4,
          "after": 5,
          "change": "+1",
          "attribution": "DOMAIN-11 lineage upgrade"
        },
        {
          "metric": "grounding_ratio",
          "before": 0.235,
          "after": 0.294,
          "change": "+0.059",
          "attribution": "backed_count increase"
        }
      ],
      "domains_affected": [
        {
          "domain": "DOMAIN-11",
          "name": "Event-Driven Architecture",
          "lineage_before": "PARTIAL",
          "lineage_after": "STRONG",
          "change_type": "LINEAGE_UPGRADE"
        }
      ]
    },
    "L4_state_consequence": {
      "s_state_before": "S2",
      "s_state_after": "S2",
      "s_state_changed": false,
      "q_class_before": "Q-02",
      "q_class_after": "Q-02",
      "q_class_changed": false,
      "certification_level_before": "PIPELINE_CERTIFIED",
      "certification_level_after": "SANDBOX_COMPUTED",
      "progression_impact": "No S-state advancement; grounding ratio improved",
      "remaining_to_s3": 12
    }
  }
}
```

---

## 4. Causal Queries

The causality model MUST answer:

### 4.1 Forward Causality ("What did this overlay cause?")

```
INPUT:  package_id = SEP-blueedge-run01-001
OUTPUT: causal_chain → L3 qualification impact + L4 state consequence

Answer: "SEP-blueedge-run01-001 upgraded DOMAIN-11 from PARTIAL to STRONG,
         increasing backed_count from 4 to 5, grounding_ratio from 0.235 to
         0.294. S-state and Q-class unchanged. 12 domains remain to S3."
```

### 4.2 Backward Causality ("Why is DOMAIN-11 STRONG?")

```
INPUT:  domain = DOMAIN-11, status = STRONG
OUTPUT: causal_chain → L1 package + L0 evidence source

Answer: "DOMAIN-11 is STRONG because SEP-blueedge-run01-001 entry E-001
         upgraded lineage from PARTIAL to STRONG. Evidence source: certified
         topology model (fb04994a...), extraction: STRUCTURAL_CORRESPONDENCE.
         Confidence basis: STRONG_INFERENCE. Semantic class: TECHNICAL."
```

### 4.3 Impact Projection ("What if we revoke SEP-001?")

```
INPUT:  revocation target = SEP-blueedge-run01-001
OUTPUT: inverse of L3 + L4

Answer: "Revoking SEP-blueedge-run01-001 would revert DOMAIN-11 from
         STRONG to PARTIAL, reducing backed_count from 5 to 4, grounding_ratio
         from 0.294 to 0.235. S-state and Q-class unchanged. Composite
         returns to certified baseline."
```

### 4.4 Attribution Query ("How much is overlay-contributed?")

```
INPUT:  current composite state
OUTPUT: L3 attribution breakdown

Answer: "4 domains backed by certified pipeline (DOMAIN-01, 10, 14, 16).
         1 domain backed by overlay (DOMAIN-11 via SEP-blueedge-run01-001).
         Overlay attribution ratio: 20% (1 of 5 backed domains).
         Certified attribution ratio: 80% (4 of 5 backed domains)."
```

---

## 5. Causal Chain Integrity

### 5.1 Chain Completeness

A causal chain is COMPLETE if and only if all 5 levels are populated:

```
FOR EACH causal_chain:
  VERIFY L0_evidence_source is present and non-empty
  VERIFY L1_package_assembly is present with ≥ 1 entry
  VERIFY L2_lifecycle_execution shows all 8 phases
  VERIFY L3_qualification_impact lists all changed metrics
  VERIFY L4_state_consequence lists all state changes
  IF any level missing or empty:
    REPORT: "INCOMPLETE_CAUSAL_CHAIN"
```

### 5.2 Chain Consistency

The causal chain MUST be internally consistent:

```
VERIFY L1.source_hash == L0.source_hash
VERIFY L2.package_id == L1.package_id
VERIFY L3.domains_affected match L1.entries.target_domain
VERIFY L4.s_state_before matches prior transition.post_state.s_state
```

---

## 6. Multi-Overlay Causality

### 6.1 Independent Causality

When multiple overlays are active, each has its own causal chain.
Overlay contributions are independently attributed:

```
SEP-001: DOMAIN-11 PARTIAL→STRONG (+1 backed)
SEP-002: DOMAIN-03 NONE→STRONG (+1 backed)
SEP-003: DOMAIN-05 NONE→PARTIAL (+0 backed — PARTIAL does not count)

Composite: 4 certified + 2 overlay = 6 backed
Attribution: SEP-001 contributes 1, SEP-002 contributes 1
```

### 6.2 Conflicting Causality

When two overlays target the same domain, causality tracks the
resolution:

```
SEP-001: DOMAIN-11 PARTIAL→STRONG (confidence 0.65)
SEP-002: DOMAIN-11 PARTIAL→EXACT (confidence 0.85)

Resolution: SEP-002 wins (higher confidence)
Causal chain: DOMAIN-11 is EXACT because of SEP-002.
              SEP-001 is shadowed (present but not contributing).
```

### 6.3 Cascading Causality

When revoking an overlay triggers changes in conflict resolution:

```
SEP-002 revoked → SEP-001 unmasked → DOMAIN-11 now STRONG (not EXACT)
Causal chain: DOMAIN-11 changed from EXACT to STRONG because
              SEP-002 was revoked, unmasking SEP-001's contribution.
```

---

## 7. Causality Persistence

### 7.1 Storage

```
artifacts/sqo/<client>/<run_id>/sandbox/causality/
├── chains/
│   ├── chain-<package_id>-<version>.json
│   └── ...
├── causality_index.json
└── attribution_summary.json
```

### 7.2 Attribution Summary

A compact overlay attribution summary for cockpit consumption:

```json
{
  "client": "<client_id>",
  "run_id": "<run_id>",
  "timestamp": "<ISO-8601>",
  "total_backed": 5,
  "certified_backed": 4,
  "overlay_backed": 1,
  "certified_ratio": 0.80,
  "overlay_ratio": 0.20,
  "per_package_attribution": [
    {
      "package_id": "SEP-blueedge-run01-001",
      "domains_contributed": 1,
      "domains": ["DOMAIN-11"],
      "contribution_type": "LINEAGE_UPGRADE"
    }
  ]
}
```

---

## 8. Governance Rules

1. Every overlay activation produces a complete causal chain (L0–L4).
2. Causal chains are immutable once created.
3. Backward causality queries must resolve to the evidence source.
4. Forward causality queries must resolve to all state consequences.
5. Impact projection (revocation preview) must be computable on demand.
6. Multi-overlay causality must track independent attribution.
7. Conflict resolution is part of the causal record.
8. No qualification state change without a traceable causal chain.
