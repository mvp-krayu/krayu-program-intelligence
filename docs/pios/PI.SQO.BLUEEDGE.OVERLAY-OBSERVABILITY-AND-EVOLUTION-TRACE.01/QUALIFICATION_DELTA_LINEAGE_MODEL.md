# Qualification Delta Lineage Model

**Stream:** PI.SQO.BLUEEDGE.OVERLAY-OBSERVABILITY-AND-EVOLUTION-TRACE.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 6 — Operational Semantic Observability Architecture

---

## 1. Purpose

This document defines the lineage model for qualification deltas —
how every change in qualification state (backed_count, grounding_ratio,
S-state, Q-class, debt resolution) is lineage-linked to its originating
event, certified baseline, overlay package, evidence entry, and
governance authorization.

---

## 2. Delta Lineage Architecture

### 2.1 What Is a Qualification Delta

A qualification delta is the difference between two consecutive
qualification states. Every delta has:

- A precise numeric change (before → after)
- A causal origin (what triggered the change)
- A lineage chain (tracing back to evidence source)
- A certification level (PIPELINE_CERTIFIED or SANDBOX_COMPUTED)
- A reversibility profile (can it be undone, and how)

### 2.2 Delta Granularity

Deltas are tracked at two levels of granularity:

| Level | Scope | Example |
|-------|-------|---------|
| Metric delta | Individual metric change | backed_count: 4→5 |
| Composite delta | Full state transition | {S2,Q-02,4/17} → {S2,Q-02,5/17} |

Both levels carry full lineage.

---

## 3. Metric Delta Lineage

### 3.1 Backed Count Delta

```json
{
  "metric": "backed_count",
  "delta_type": "INCREMENT",
  "before": 4,
  "after": 5,
  "change": "+1",
  "lineage": {
    "certified_component": {
      "value": 4,
      "source": "PIPELINE_CERTIFIED",
      "domains": ["DOMAIN-01", "DOMAIN-10", "DOMAIN-14", "DOMAIN-16"],
      "certification_hash": "<qualification_state.v1.json hash>"
    },
    "overlay_component": {
      "value": 1,
      "source": "OVERLAY_VERIFIED",
      "packages": [
        {
          "package_id": "SEP-blueedge-run01-001",
          "entry_id": "E-001",
          "domain": "DOMAIN-11",
          "claim_type": "LINEAGE_UPGRADE",
          "lineage_change": "PARTIAL → STRONG",
          "backed_contribution": true
        }
      ]
    },
    "formula": "composite_backed = certified_backed + overlay_backed",
    "formula_version": "1.0",
    "formula_authority": "GOVERNANCE_LOCKED"
  }
}
```

### 3.2 Grounding Ratio Delta

```json
{
  "metric": "grounding_ratio",
  "delta_type": "INCREMENT",
  "before": 0.235,
  "after": 0.294,
  "change": "+0.059",
  "lineage": {
    "formula": "grounding_ratio = backed_count / total_count",
    "backed_count_lineage": "<reference to backed_count delta>",
    "total_count": 17,
    "total_count_source": "PIPELINE_CERTIFIED (topology domain count)"
  }
}
```

### 3.3 Domain Lineage Delta

```json
{
  "metric": "domain_lineage_status",
  "domain": "DOMAIN-11",
  "domain_name": "Event-Driven Architecture",
  "delta_type": "UPGRADE",
  "before": "PARTIAL",
  "after": "STRONG",
  "lineage": {
    "certified_status": "PARTIAL",
    "certified_confidence": 0.65,
    "certified_reference": "DOM-07",
    "overlay_upgrade": {
      "package_id": "SEP-blueedge-run01-001",
      "entry_id": "E-001",
      "confidence_basis": "STRONG_INFERENCE",
      "semantic_class": "TECHNICAL",
      "evidence_source": "semantic_topology_model",
      "source_hash": "<hash>"
    },
    "upgrade_justification": "Structural correspondence in CLU-04 cluster"
  }
}
```

### 3.4 S-State Delta

```json
{
  "metric": "s_state",
  "delta_type": "NO_CHANGE",
  "before": "S2",
  "after": "S2",
  "lineage": {
    "gate_evaluation": {
      "s3_gate": {
        "requirement": "backed_count == total_count (17/17)",
        "current": "5/17",
        "deficit": 12,
        "status": "NOT_MET"
      }
    },
    "advancement_blocked_by": "12 domains without STRONG or EXACT lineage",
    "nearest_s_state_change": "S3 at 17/17 backed"
  }
}
```

### 3.5 Q-Class Delta

```json
{
  "metric": "q_class",
  "delta_type": "NO_CHANGE",
  "before": "Q-02",
  "after": "Q-02",
  "lineage": {
    "formula_inputs": {
      "backed_count": 5,
      "total_count": 17,
      "semantic_continuity_status": "CONTINUOUS",
      "evidence_availability": "FULL"
    },
    "formula_version": "1.0",
    "resolution": "Q-02 (partial grounding with structural continuity)"
  }
}
```

---

## 4. Composite Delta Record

The composite delta aggregates all metric deltas for a single
transition:

```json
{
  "composite_delta_id": "<uuid>",
  "transition_id": "<links to evolution trace transition>",
  "timestamp": "<ISO-8601>",
  "trigger": {
    "type": "SEP_ACTIVATED",
    "package_id": "SEP-blueedge-run01-001"
  },
  "metric_deltas": [
    { "metric": "backed_count", "before": 4, "after": 5, "change": "+1" },
    { "metric": "grounding_ratio", "before": 0.235, "after": 0.294, "change": "+0.059" },
    { "metric": "domain_DOMAIN-11_lineage", "before": "PARTIAL", "after": "STRONG", "change": "UPGRADE" },
    { "metric": "s_state", "before": "S2", "after": "S2", "change": "NO_CHANGE" },
    { "metric": "q_class", "before": "Q-02", "after": "Q-02", "change": "NO_CHANGE" },
    { "metric": "overlay_count", "before": 0, "after": 1, "change": "+1" },
    { "metric": "certification_level", "before": "PIPELINE_CERTIFIED", "after": "SANDBOX_COMPUTED", "change": "DOWNGRADE" }
  ],
  "net_qualification_effect": "POSITIVE",
  "reversible": true,
  "overlay_attribution": {
    "total_backed_domains": 5,
    "certified_domains": 4,
    "overlay_domains": 1,
    "overlay_percentage": 20.0
  }
}
```

---

## 5. Lineage Queries

### 5.1 Metric Provenance ("Why is backed_count = 5?")

```
backed_count = 5
  = certified_backed (4) + overlay_backed (1)
  certified:
    DOMAIN-01: EXACT (pipeline-certified, 0.95 confidence)
    DOMAIN-10: STRONG (pipeline-certified, 0.80 confidence)
    DOMAIN-14: EXACT (pipeline-certified, 0.95 confidence)
    DOMAIN-16: EXACT (pipeline-certified, 0.95 confidence)
  overlay:
    DOMAIN-11: STRONG (SEP-blueedge-run01-001, E-001, STRONG_INFERENCE)
```

### 5.2 Domain Lineage History ("How has DOMAIN-11 evolved?")

```
DOMAIN-11 (Event-Driven Architecture):
  T0: PARTIAL (pipeline-certified, confidence 0.65, ref DOM-07)
  T1: STRONG  (overlay SEP-blueedge-run01-001, STRONG_INFERENCE)
  T2: PARTIAL (SEP-001 revoked, reverted to certified status)
```

### 5.3 Delta Attribution ("What did the last overlay change?")

```
SEP-blueedge-run01-001 activation caused:
  backed_count: +1 (4→5)
  grounding_ratio: +0.059 (0.235→0.294)
  DOMAIN-11: PARTIAL → STRONG
  S-state: no change (S2, S3 gate not met: 5/17 < 17/17)
  Q-class: no change (Q-02, partial grounding)
```

### 5.4 Debt Resolution Lineage ("Which debts did overlays resolve?")

```
Debt items resolved by overlays:
  DEBT-GROUNDING_GAP-03 (DOMAIN-11 grounding gap):
    Status: PARTIALLY_RESOLVED by SEP-blueedge-run01-001
    Lineage upgraded from PARTIAL to STRONG
    Remaining gap: none (STRONG is sufficient for grounding)
```

---

## 6. Lineage Integrity Verification

### 6.1 Metric Consistency

```
FOR EACH composite_delta:
  VERIFY sum(certified_backed + overlay_backed) == backed_count
  VERIFY grounding_ratio == backed_count / total_count
  VERIFY s_state matches gate evaluation result
  VERIFY q_class matches formula resolution
  IF any inconsistency:
    REPORT: "DELTA_LINEAGE_CONSISTENCY_FAILURE"
```

### 6.2 Cross-Reference Verification

```
FOR EACH overlay_contribution:
  VERIFY package_id exists in sandbox registry
  VERIFY entry_id exists in package artifact
  VERIFY domain target matches entry specification
  VERIFY claim_type matches entry claim_type
  IF any mismatch:
    REPORT: "DELTA_LINEAGE_CROSS_REFERENCE_FAILURE"
```

---

## 7. Lineage Persistence

```
artifacts/sqo/<client>/<run_id>/sandbox/lineage/
├── deltas/
│   ├── delta-<transition_id>.json
│   └── ...
├── domain_lineage/
│   ├── domain-<domain_id>-history.json
│   └── ...
└── lineage_index.json
```

---

## 8. Governance Rules

1. Every qualification metric change carries full lineage (source → delta).
2. Certified and overlay contributions are always separated.
3. Formula references are versioned and governance-locked.
4. Domain lineage history is append-only.
5. Lineage cross-references must resolve to existing artifacts.
6. No metric change without a traceable delta record.
7. Composite deltas link to evolution trace transitions.
8. Lineage integrity is verifiable on demand.
