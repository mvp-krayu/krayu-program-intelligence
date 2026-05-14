# Qualification Re-evaluation Model

**Stream:** PI.SQO.SEMANTIC-EVIDENCE-PACKAGE-SPECIFICATION.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation

---

## 1. Problem

SQO currently evaluates qualification state from the certified substrate
alone. When a Semantic Evidence Package is activated (introducing Dynamic
CEU), the qualification state may need to change — but the deterministic
structural substrate must NOT be reprocessed.

This document defines how qualification re-evaluation is triggered,
executed, and bounded.

---

## 2. Re-evaluation Triggers

Qualification re-evaluation is triggered when ANY of the following
state changes occur:

| Trigger | Description | Example |
|---------|-------------|---------|
| SEP_ACTIVATED | A Semantic Evidence Package transitions to ACTIVATED status | New ADR-derived evidence package activated |
| SEP_REVOKED | An active SEP is revoked | Package withdrawn due to provenance issue |
| SEP_VERSION_UPGRADE | An active SEP is superseded by a newer version | Updated capability model replaces v1 |
| OVERLAY_CONFLICT_RESOLVED | A previously conflicting overlay entry is resolved | Manual conflict resolution |

Re-evaluation is NOT triggered by:
- substrate pipeline re-execution (that produces a new certified substrate, not an overlay)
- cockpit UI changes
- governance document updates
- read-only artifact inspection

---

## 3. Re-evaluation Process

```
TRIGGER EVENT
    │
    ▼
1. LOAD certified substrate (Static CEU)
    │  canonical_topology, dpsig, semantic_model, crosswalk,
    │  decision_validation, reproducibility_verdict
    │
    ▼
2. LOAD active overlay set (Dynamic CEU)
    │  All ACTIVATED SEPs from package_registry.json
    │  (excluding any just-REVOKED package if trigger is SEP_REVOKED)
    │
    ▼
3. COMPUTE composite semantic state
    │  Apply overlays in order per REPLAY_SAFE_OVERLAY_ARCHITECTURE
    │  Track static_backed_count, overlay_backed_count, composite_backed_count
    │
    ▼
4. RESOLVE Q-class from composite state
    │  Same formula: f(composite_backed_count, total_count,
    │                   composite_continuity_status, evidence_availability)
    │  Formula is governance-locked — NEVER modified by overlays
    │
    ▼
5. RE-EVALUATE semantic debt inventory
    │  Check each debt item against composite state
    │  Mark resolved items with overlay attribution
    │  Recompute blocking counts
    │
    ▼
6. RE-COMPUTE progression readiness
    │  readiness = 1 - (composite_blocking_count / composite_total_debt)
    │
    ▼
7. EMIT re-evaluation result
    │  qualification_reevaluation.v1.json
    │
    ▼
8. UPDATE SQO cockpit state
    │  S-state may change if gates are now met
    │  Debt inventory reflects resolved items
    │  Progression readiness reflects new blocking ratio
```

---

## 4. What Re-evaluation May Change

| Metric | May Change | How |
|--------|-----------|-----|
| backed_count | YES | Overlay lineage upgrades increase backing |
| continuity_coverage | YES | Overlay crosswalk extensions improve coverage |
| Q-class | YES | Changed backed_count/continuity may shift Q-class |
| S-state | YES | If all S-state gates are now met by composite state |
| Debt items (blocking) | YES | Overlay evidence may resolve specific debt items |
| Progression readiness | YES | Reduced blocking debt changes readiness score |
| Maturity scores | YES | Overlay enrichments may improve dimension scores |

---

## 5. What Re-evaluation MUST NOT Change

| Protected Element | Why |
|-------------------|-----|
| Certified substrate artifacts | Immutable; pipeline-derived |
| Q-class formula | Governance-locked; cannot be modified by overlays |
| S-state gate definitions | Locked by qualification governance |
| Debt classification rules | Locked by debt engine specification |
| PATH A artifact chain | Structural truth; never modified |
| PATH B projection chain | Semantic projection; operates on certified substrate |
| Reproducibility verdict | Pipeline guarantee; independent of overlays |

---

## 6. S-State Gate Model Under Composite Evaluation

### S0 → S1 Gate

No overlay involvement. S1 requires pipeline registration with
structural artifacts. Overlays cannot substitute for missing
pipeline artifacts.

### S1 → S2 Gate

The S1 → S2 transition requires:
- All 6 required artifacts present (Static CEU — cannot be overlay-provided)
- semantic_level != STRUCTURAL_LABELS_ONLY
- At least 1 domain with EXACT or STRONG lineage
- Crosswalk with at least 1 mapping
- Decision validation with at least 1 check
- Reproducibility verdict defined

Dynamic CEU CAN contribute to:
- lineage upgrades (NONE → STRONG/EXACT) via LINEAGE_UPGRADE claims
- crosswalk extension via CONTINUITY_MAPPING claims
- domain enrichment via LABEL_ASSIGNMENT claims

Dynamic CEU CANNOT substitute for:
- missing required artifacts (must be pipeline-produced)
- decision validation (must be pipeline-executed)
- reproducibility verdict (must be pipeline-verified)

### S2 → S3 Gate

S3 requires backed_count == total_count (ALL domains structurally backed).

Dynamic CEU CAN contribute lineage upgrades toward this goal,
potentially closing the gap between partial and full grounding.

Example: BlueEdge at S2 has 4/17 backed. If Dynamic CEU provides
verifiable lineage upgrades for the remaining 13 domains, the
composite backed_count would reach 17/17, satisfying the S3 gate.

However: each lineage upgrade must be individually verifiable from
the SEP's provenance chain. Bulk upgrades without per-domain
evidence are REJECTED.

---

## 7. Re-evaluation Artifact

```json
{
  "schema_version": "1.0",
  "client": "<client_id>",
  "run_id": "<run_id>",
  "timestamp": "<ISO-8601>",
  "trigger": "SEP_ACTIVATED | SEP_REVOKED | SEP_VERSION_UPGRADE | OVERLAY_CONFLICT_RESOLVED",
  "trigger_package_id": "<package that triggered re-evaluation>",

  "prior_state": {
    "s_state": "S1",
    "q_class": "Q-03",
    "backed_count": 0,
    "total_count": 9,
    "progression_readiness": 0.520,
    "blocking_debt_count": 12
  },

  "composite_state": {
    "s_state": "S2",
    "q_class": "Q-02",
    "static_backed_count": 0,
    "overlay_backed_count": 3,
    "composite_backed_count": 3,
    "total_count": 9,
    "progression_readiness": 0.680,
    "blocking_debt_count": 8
  },

  "changes": [
    {
      "metric": "s_state",
      "from": "S1",
      "to": "S2",
      "cause": "S2 gates met via overlay lineage upgrades"
    }
  ],

  "overlay_attribution": {
    "packages_contributing": ["SEP-fastapi-run_02-001"],
    "entries_applied": 7,
    "entries_rejected": 0,
    "debt_items_resolved": 4
  },

  "governance": {
    "substrate_mutation": false,
    "formula_modification": false,
    "gate_bypass": false
  }
}
```

---

## 8. Re-evaluation Governance Rules

1. Re-evaluation MUST use the same Q-class formula as certified evaluation.
2. Re-evaluation MUST distinguish overlay contributions from certified contributions.
3. Re-evaluation MUST NOT proceed if the certified substrate has been corrupted.
4. Re-evaluation results MUST include full overlay attribution.
5. S-state transitions from re-evaluation MUST meet ALL gate requirements
   (overlay contributions alone do not bypass missing pipeline artifacts).
6. Re-evaluation MUST be idempotent: running the same re-evaluation
   twice with the same inputs produces the same output.
