# Overlay Coexistence Observability

**Stream:** PI.SQO.BLUEEDGE.OVERLAY-OBSERVABILITY-AND-EVOLUTION-TRACE.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 6 — Operational Semantic Observability Architecture

---

## 1. Purpose

This document defines how multiple overlays coexisting in the same
sandbox become observable — their individual contributions, their
interactions, their conflicts, their combined qualification impact,
and the operator's ability to understand which overlays are doing what.

---

## 2. Coexistence Model

### 2.1 Overlay Independence Principle

Each overlay is independently:
- Validated (own 8-phase lifecycle)
- Activated (own governance authorization)
- Contributing (own domain targets)
- Revocable (independent removability)
- Attributable (own causal chain)

Coexistence observability makes these independent contributions
visible as a coherent whole.

### 2.2 Coexistence Dimensions

| Dimension | What Is Observable |
|-----------|-------------------|
| Coverage | Which domains does each overlay target? |
| Overlap | Do any overlays target the same domain? |
| Conflict | Do overlapping overlays disagree? |
| Contribution | What does each overlay add to backed_count? |
| Dependency | Does any overlay depend on another? |
| Precedence | When overlays conflict, which wins? |

---

## 3. Coverage Map

### 3.1 Overlay-Domain Coverage Matrix

For N overlays and M domains, the coverage matrix shows which
overlay targets which domain:

```
                 SEP-001  SEP-002  SEP-003  Certified
DOMAIN-01        .        .        .        EXACT
DOMAIN-02        .        ✓        .        NONE
DOMAIN-03        .        .        ✓        NONE
DOMAIN-05        .        ✓        .        NONE
DOMAIN-10        .        .        .        STRONG
DOMAIN-11        ✓        .        .        PARTIAL
DOMAIN-14        .        .        .        EXACT
DOMAIN-16        .        .        .        EXACT
...
```

### 3.2 Coverage Summary

```json
{
  "coverage_summary": {
    "total_domains": 17,
    "certified_coverage": {
      "EXACT": 3,
      "STRONG": 1,
      "PARTIAL": 1,
      "NONE": 12
    },
    "overlay_coverage": {
      "total_domains_targeted": 3,
      "domains_targeted": ["DOMAIN-11", "DOMAIN-02", "DOMAIN-03"],
      "unique_targeting": 3,
      "overlapping_targeting": 0
    },
    "uncovered_domains": {
      "count": 9,
      "domains": ["DOMAIN-04", "DOMAIN-06", "..."]
    }
  }
}
```

---

## 4. Overlap and Conflict Observability

### 4.1 Overlap Detection

When two or more overlays target the same domain:

```json
{
  "overlaps": [
    {
      "domain": "DOMAIN-11",
      "overlapping_packages": [
        {
          "package_id": "SEP-001",
          "claim_type": "LINEAGE_UPGRADE",
          "proposed_status": "STRONG",
          "confidence": "STRONG_INFERENCE"
        },
        {
          "package_id": "SEP-004",
          "claim_type": "LINEAGE_UPGRADE",
          "proposed_status": "EXACT",
          "confidence": "EXACT_MATCH"
        }
      ],
      "conflict": false,
      "resolution": "SEP-004 wins (higher status, higher confidence)",
      "resolution_rule": "CONFIDENCE_PRECEDENCE"
    }
  ]
}
```

### 4.2 Conflict Classification

| Conflict Type | Definition | Resolution |
|--------------|-----------|-----------|
| COMPATIBLE_UPGRADE | Both upgrade same domain, compatible direction | Higher confidence wins |
| INCOMPATIBLE_CLAIM | Conflicting claim types on same domain | Governance escalation |
| LABEL_CONFLICT | Different domain labels from different packages | Later package precedence |
| CONFIDENCE_CONFLICT | Same claim, incompatible confidence levels | Higher confidence wins |

### 4.3 Conflict Observability Record

```json
{
  "conflict_record": {
    "conflict_id": "<uuid>",
    "domain": "DOMAIN-11",
    "packages_involved": ["SEP-001", "SEP-004"],
    "conflict_type": "COMPATIBLE_UPGRADE",
    "resolution": {
      "winner": "SEP-004",
      "rule_applied": "CONFIDENCE_PRECEDENCE",
      "loser_status": "SHADOWED",
      "governance_escalation": false
    },
    "impact_on_composite": {
      "domain_status_from_winner": "EXACT",
      "domain_status_if_winner_revoked": "STRONG (SEP-001 unmasked)"
    }
  }
}
```

---

## 5. Per-Overlay Contribution Observability

### 5.1 Contribution Board

Each overlay's contribution to the composite state:

```json
{
  "contribution_board": [
    {
      "package_id": "SEP-001",
      "status": "ACTIVATED",
      "entry_count": 1,
      "domains_targeted": 1,
      "domains_contributing": 1,
      "domains_shadowed": 0,
      "backed_count_contribution": 1,
      "contribution_detail": [
        {
          "domain": "DOMAIN-11",
          "claim_type": "LINEAGE_UPGRADE",
          "contributed_status": "STRONG",
          "contributing": true,
          "shadowed_by": null
        }
      ],
      "revocation_impact": {
        "backed_count_would_change": -1,
        "domains_would_revert": ["DOMAIN-11"],
        "s_state_would_change": false
      }
    }
  ]
}
```

### 5.2 Attribution Breakdown

The composite qualification state broken down by contributor:

```json
{
  "attribution_breakdown": {
    "backed_count": 5,
    "by_source": {
      "PIPELINE_CERTIFIED": {
        "count": 4,
        "percentage": 80.0,
        "domains": [
          { "domain": "DOMAIN-01", "status": "EXACT" },
          { "domain": "DOMAIN-10", "status": "STRONG" },
          { "domain": "DOMAIN-14", "status": "EXACT" },
          { "domain": "DOMAIN-16", "status": "EXACT" }
        ]
      },
      "SEP-blueedge-run01-001": {
        "count": 1,
        "percentage": 20.0,
        "domains": [
          { "domain": "DOMAIN-11", "status": "STRONG" }
        ]
      }
    }
  }
}
```

---

## 6. Dependency Observability

### 6.1 Dependency Graph

When overlays declare dependencies on each other:

```json
{
  "dependency_graph": {
    "packages": [
      { "package_id": "SEP-001", "depends_on": [] },
      { "package_id": "SEP-002", "depends_on": ["SEP-001"] },
      { "package_id": "SEP-003", "depends_on": ["SEP-002"] }
    ],
    "dependency_depth": 2,
    "root_packages": ["SEP-001"],
    "leaf_packages": ["SEP-003"],
    "cascade_risk": {
      "if_SEP-001_revoked": ["SEP-002", "SEP-003"],
      "if_SEP-002_revoked": ["SEP-003"],
      "if_SEP-003_revoked": []
    }
  }
}
```

### 6.2 Cascade Risk Assessment

```json
{
  "cascade_risk_summary": {
    "max_cascade_depth": 2,
    "packages_with_dependents": 2,
    "packages_at_cascade_risk": 3,
    "worst_case_revocation": {
      "package": "SEP-001",
      "cascade_count": 2,
      "backed_count_impact": -3,
      "domains_affected": ["DOMAIN-11", "DOMAIN-03", "DOMAIN-05"]
    }
  }
}
```

---

## 7. Coexistence Health

### 7.1 Health Indicators

| Indicator | Healthy | Warning | Critical |
|-----------|---------|---------|----------|
| Overlap count | 0 | 1-2 | 3+ |
| Conflict count | 0 | 1 (resolved) | 1+ (unresolved) |
| Dependency depth | 0 | 1 | 2+ |
| Shadowed overlays | 0 | 1-2 | 3+ (wasted contributions) |
| Governance escalations | 0 | Pending | Unresolved |

### 7.2 Coexistence Health Summary

```json
{
  "coexistence_health": {
    "overall": "HEALTHY | WARNING | CRITICAL",
    "active_overlays": N,
    "overlaps": 0,
    "unresolved_conflicts": 0,
    "max_dependency_depth": 0,
    "shadowed_contributions": 0,
    "governance_escalations": 0
  }
}
```

---

## 8. Observability Queries

| Query | Resolution |
|-------|-----------|
| What is each overlay contributing? | Contribution board |
| Are any overlays targeting the same domain? | Overlap detection |
| Are there unresolved conflicts? | Conflict record with resolution status |
| What happens if we revoke SEP-X? | Per-overlay revocation_impact |
| What is the cascade risk? | Dependency graph → cascade_risk |
| Which domains are still uncovered? | Coverage summary → uncovered_domains |
| What percentage is overlay-contributed? | Attribution breakdown percentages |
| Which overlays are being shadowed? | Contribution board → shadowed_by |

---

## 9. Persistence

```
artifacts/sqo/<client>/<run_id>/sandbox/coexistence/
├── coverage_matrix.json
├── overlap_report.json
├── conflict_records/
│   └── conflict-<id>.json
├── contribution_board.json
├── attribution_breakdown.json
├── dependency_graph.json
└── coexistence_health.json
```

---

## 10. Governance Rules

1. Every overlay's contribution is independently observable.
2. Overlapping targeting is detected and reported.
3. Conflicts are classified, resolved, and recorded.
4. Shadowed overlays are explicitly identified.
5. Dependency graphs are maintained for cascade risk assessment.
6. Coexistence health is observable on demand.
7. Attribution breakdown separates certified from overlay contributions.
8. No hidden overlay interaction — all coexistence effects are visible.
