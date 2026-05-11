# Provisional vs Certified State Model

**Stream:** PI.SQO.BLUEEDGE.OVERLAY-OBSERVABILITY-AND-EVOLUTION-TRACE.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 6 — Operational Semantic Observability Architecture

---

## 1. Purpose

This document defines how the system distinguishes, communicates, and
enforces the boundary between pipeline-certified qualification state
and sandbox-computed (provisional) qualification state. Every consumer
of qualification data — operators, cockpit, LENS, governance — must
know whether they are observing certified truth or overlay-enhanced
provisional state.

---

## 2. State Classification

### 2.1 Three State Classes

| Class | Label | Definition | Mutability |
|-------|-------|-----------|-----------|
| PIPELINE_CERTIFIED | Certified | Produced by structural pipeline, validated by deterministic evaluation | IMMUTABLE (from sandbox perspective) |
| OVERLAY_VERIFIED | Provisional-Verified | Individual overlay contribution verified through 8-phase lifecycle | Revocable (overlay can be removed) |
| SANDBOX_COMPUTED | Provisional-Composite | Composite of certified + overlay contributions | Transient (changes with each activation/revocation) |

### 2.2 State Class Hierarchy

```
PIPELINE_CERTIFIED
│
│  Highest trust. Pipeline-verified structural truth.
│  Cannot be modified by sandbox operations.
│  Survives sandbox closure, rollback, and reset.
│
├── OVERLAY_VERIFIED
│   │
│   │  Individual overlay contribution validated through
│   │  the 8-phase activation lifecycle. Independently
│   │  removable. Attribution-linked to source package.
│   │
│   └── SANDBOX_COMPUTED
│       │
│       │  Composite of PIPELINE_CERTIFIED + OVERLAY_VERIFIED
│       │  contributions. Represents the "what-if" state
│       │  with active overlays applied.
│       │
│       └── UNVERIFIED
│           │
│           │  Overlay package registered but not yet
│           │  validated through lifecycle phases.
│           │  No qualification contribution.
```

### 2.3 State Class Transitions

| Transition | When | Direction |
|-----------|------|-----------|
| UNVERIFIED → OVERLAY_VERIFIED | Package passes all 8 lifecycle phases | Promotion |
| OVERLAY_VERIFIED → UNVERIFIED | Package revoked (contributions removed) | Demotion |
| PIPELINE_CERTIFIED → (unchanged) | Never modified by sandbox | N/A |
| SANDBOX_COMPUTED recalculated | Every activation, revocation, or version change | Recomputation |

---

## 3. Per-Metric State Classification

Every qualification metric carries its state class:

### 3.1 Backed Count Classification

```json
{
  "backed_count": {
    "total": 5,
    "by_class": {
      "PIPELINE_CERTIFIED": {
        "count": 4,
        "domains": ["DOMAIN-01", "DOMAIN-10", "DOMAIN-14", "DOMAIN-16"]
      },
      "OVERLAY_VERIFIED": {
        "count": 1,
        "domains": ["DOMAIN-11"],
        "packages": ["SEP-blueedge-run01-001"]
      }
    },
    "composite_class": "SANDBOX_COMPUTED",
    "certified_percentage": 80.0,
    "overlay_percentage": 20.0
  }
}
```

### 3.2 S-State Classification

```json
{
  "s_state": {
    "value": "S2",
    "achievable_by": "PIPELINE_CERTIFIED",
    "explanation": "S2 gates met by certified pipeline evaluation alone",
    "overlay_dependency": false,
    "would_change_if_overlays_removed": false
  }
}
```

When overlays push S-state to S3:

```json
{
  "s_state": {
    "value": "S3",
    "achievable_by": "SANDBOX_COMPUTED",
    "explanation": "S3 gates met only with overlay contributions (17/17 backed)",
    "overlay_dependency": true,
    "would_change_if_overlays_removed": true,
    "certified_s_state": "S2",
    "disclosure": "S3 via composite: 4 certified + 13 overlay = 17/17"
  }
}
```

### 3.3 Q-Class Classification

```json
{
  "q_class": {
    "value": "Q-02",
    "achievable_by": "PIPELINE_CERTIFIED",
    "formula_inputs": {
      "backed_count": { "value": 5, "class": "SANDBOX_COMPUTED" },
      "total_count": { "value": 17, "class": "PIPELINE_CERTIFIED" },
      "continuity_status": { "value": "CONTINUOUS", "class": "PIPELINE_CERTIFIED" },
      "evidence_availability": { "value": "FULL", "class": "PIPELINE_CERTIFIED" }
    },
    "formula_version": "1.0",
    "formula_class": "GOVERNANCE_LOCKED"
  }
}
```

### 3.4 Domain Lineage Classification

```json
{
  "domain_lineage": {
    "DOMAIN-01": { "status": "EXACT", "class": "PIPELINE_CERTIFIED" },
    "DOMAIN-10": { "status": "STRONG", "class": "PIPELINE_CERTIFIED" },
    "DOMAIN-11": { "status": "STRONG", "class": "OVERLAY_VERIFIED", "package": "SEP-001" },
    "DOMAIN-14": { "status": "EXACT", "class": "PIPELINE_CERTIFIED" },
    "DOMAIN-16": { "status": "EXACT", "class": "PIPELINE_CERTIFIED" },
    "DOMAIN-02": { "status": "NONE", "class": "PIPELINE_CERTIFIED" },
    "...": "..."
  }
}
```

---

## 4. Disclosure Requirements

### 4.1 Mandatory Disclosure Matrix

| Consumer | Required Disclosure | Detail Level |
|---------|--------------------|-------------|
| Sandbox audit trail | Full per-metric classification | FULL |
| Re-evaluation artifacts | Certified vs overlay breakdown | FULL |
| SQO Cockpit | Classification badges + percentages | SUMMARY |
| LENS projection | Overlay-present flag + attribution ratio | SUMMARY |
| Governance review | Full lineage per domain | FULL |
| External reporting | Certification level of S-state | DISCLOSURE |

### 4.2 Cockpit Disclosure Format

For SQO Cockpit integration, qualification metrics carry classification
badges:

```
S-state: S2 [CERTIFIED]
  or:   S3 [COMPOSITE — 4 certified + 13 overlay]

Q-class: Q-02 [CERTIFIED]
  or:    Q-01 [COMPOSITE — overlay-dependent]

Backed: 5/17 [4 CERTIFIED + 1 OVERLAY]
  or:   17/17 [4 CERTIFIED + 13 OVERLAY]

Grounding: 29.4% [COMPOSITE]
  or:      100% [COMPOSITE — 23.5% certified + 76.5% overlay]
```

### 4.3 Certification Level Badge

| Badge | Meaning | Color Signal |
|-------|---------|-------------|
| CERTIFIED | All contributions from pipeline | Neutral (established truth) |
| COMPOSITE | Includes overlay contributions | Distinct (overlay-enhanced) |
| PROVISIONAL | Overlay contributions not yet fully verified | Cautionary |

---

## 5. Certified Baseline Anchor

### 5.1 Baseline as Ground Truth

The certified baseline is the ground truth that provisional state
departs from and returns to:

```json
{
  "certified_baseline": {
    "s_state": "S2",
    "q_class": "Q-02",
    "backed_count": 4,
    "total_count": 17,
    "grounding_ratio": 0.235,
    "baseline_hash": "<hash>",
    "pipeline_date": "<when pipeline ran>",
    "immutable": true,
    "survives": ["sandbox_closure", "overlay_revocation", "full_reset"]
  }
}
```

### 5.2 Departure and Return Tracking

```json
{
  "baseline_departure": {
    "departed": true,
    "departure_transition": "transition-001",
    "departure_cause": "SEP-blueedge-run01-001 activated",
    "current_distance_from_baseline": {
      "backed_count_delta": "+1",
      "grounding_ratio_delta": "+0.059",
      "s_state_delta": "no change",
      "q_class_delta": "no change"
    },
    "return_mechanism": "Revoke all overlays",
    "return_verified": true,
    "last_return": "transition-002 (SEP-001 revoked, T0=T2 verified)"
  }
}
```

---

## 6. Promotion Path

### 6.1 From Provisional to Certified

Overlay contributions become PIPELINE_CERTIFIED only when:

1. The structural pipeline is re-executed with evidence that
   substantiates the overlay claim
2. The pipeline independently derives the same qualification
3. The new pipeline output replaces the prior certified baseline
4. A new sandbox epoch begins against the new baseline

This is a PIPELINE event, not a sandbox operation. The sandbox
cannot promote its own state.

### 6.2 Promotion Observability

```json
{
  "promotion_eligibility": {
    "domains_eligible_for_pipeline_promotion": [
      {
        "domain": "DOMAIN-11",
        "overlay_status": "STRONG",
        "overlay_confidence": "STRONG_INFERENCE",
        "promotion_requires": "Pipeline re-execution with evidence supporting STRONG lineage for DOMAIN-11",
        "promotion_authority": "PIPELINE (not sandbox)"
      }
    ]
  }
}
```

---

## 7. Provisional State Stability

### 7.1 Stability Assessment

Provisional state stability depends on overlay confidence and
governance posture:

```json
{
  "provisional_stability": {
    "overall": "STABLE | AT_RISK | UNSTABLE",
    "factors": [
      {
        "factor": "overlay_count",
        "value": 1,
        "assessment": "Low overlay count — minimal revocation risk"
      },
      {
        "factor": "confidence_basis",
        "minimum": "STRONG_INFERENCE",
        "assessment": "All overlays at STRONG_INFERENCE or higher"
      },
      {
        "factor": "governance_posture",
        "value": "NORMAL",
        "assessment": "No pending reviews or restrictions"
      },
      {
        "factor": "dependency_depth",
        "maximum": 0,
        "assessment": "No inter-overlay dependencies"
      }
    ]
  }
}
```

---

## 8. Governance Rules

1. Every qualification metric carries its state classification.
2. PIPELINE_CERTIFIED state is never modified by sandbox operations.
3. OVERLAY_VERIFIED contributions are explicitly attributed to packages.
4. SANDBOX_COMPUTED state always discloses its certified vs overlay breakdown.
5. Downstream consumers MUST distinguish certification levels.
6. No in-sandbox promotion from OVERLAY_VERIFIED to PIPELINE_CERTIFIED.
7. Cockpit displays include certification badges on all qualification metrics.
8. Provisional state stability is assessed and observable.
