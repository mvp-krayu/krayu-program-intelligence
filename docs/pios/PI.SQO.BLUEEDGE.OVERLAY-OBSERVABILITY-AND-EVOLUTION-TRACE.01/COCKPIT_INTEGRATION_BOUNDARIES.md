# Cockpit Integration Boundaries

**Stream:** PI.SQO.BLUEEDGE.OVERLAY-OBSERVABILITY-AND-EVOLUTION-TRACE.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 6 — Operational Semantic Observability Architecture

---

## 1. Purpose

This document defines the integration boundaries between the overlay
observability architecture and the SQO Cockpit — what the cockpit
can consume, what it cannot, in what format, and at what certification
level. This anticipates future cockpit integration without implementing
runtime UX.

---

## 2. Integration Architecture

### 2.1 Cockpit as Consumer

The SQO Cockpit is a CONSUMER of observability data. It does not:
- Produce qualification state
- Modify overlay state
- Execute governance actions autonomously
- Promote certification levels
- Bypass disclosure requirements

The cockpit renders pre-computed observability artifacts.

### 2.2 Data Flow Direction

```
Sandbox Observability Layer
       │
       │  (read-only)
       ▼
SQO Cockpit Rendering
       │
       │  (display-only)
       ▼
Operator Visual Interface
```

No data flows back from cockpit to sandbox. The cockpit does not
write to sandbox artifacts.

---

## 3. Consumable Artifacts

### 3.1 Cockpit-Consumable Data

| Artifact | Cockpit Access | Format | Update Frequency |
|----------|---------------|--------|-----------------|
| Qualification state card | READ | JSON summary | On each re-evaluation |
| S-state with certification | READ | Labeled value | On each re-evaluation |
| Q-class with certification | READ | Labeled value | On each re-evaluation |
| Backed count breakdown | READ | Certified + overlay counts | On each re-evaluation |
| Domain grid | READ | Per-domain status + source | On each activation/revocation |
| Overlay package inventory | READ | Status per package | On each lifecycle event |
| Evolution timeline | READ | Ordered transitions | On each state change |
| Attribution breakdown | READ | Per-source contribution | On each re-evaluation |
| Coexistence health | READ | Health indicators | On each activation/revocation |
| Composite health dashboard | READ | Per-indicator status | On each verification |
| Debt resolution summary | READ | Overlay-resolved counts | On each re-evaluation |
| Progression readiness | READ | Gate status + deficit | On each re-evaluation |

### 3.2 Non-Consumable Data

The cockpit MUST NOT consume or render:

| Data | Reason |
|------|--------|
| Raw audit events | Too granular; use operational narratives instead |
| Package artifact content | Internal sandbox structure |
| Replay reconstruction inputs | Internal verification mechanism |
| Hash values | Infrastructure-level, not operator-meaningful |
| Rollback point internals | Recovery mechanism, not display data |
| Causal chain L0 (evidence source) | Evidence provenance is governance-level, not operator-level |
| Sandbox manifest | Internal namespace management |

### 3.3 Cockpit Disclosure Format

Every cockpit-consumable artifact MUST include:

```json
{
  "cockpit_metadata": {
    "artifact_type": "<type>",
    "certification_level": "PIPELINE_CERTIFIED | SANDBOX_COMPUTED",
    "overlay_present": true,
    "overlay_count": N,
    "last_updated": "<ISO-8601>",
    "disclosure": "<mandatory disclosure text>"
  }
}
```

---

## 4. Certification Display Rules

### 4.1 S-State Display

| Scenario | Cockpit Display | Badge |
|----------|----------------|-------|
| S2 from certified pipeline | S2 | CERTIFIED |
| S2 with overlays (overlays don't change S-state) | S2 | CERTIFIED |
| S3 achieved via overlays | S3 | COMPOSITE |
| S3 achieved via overlays, then S2 after revocation | S2 | CERTIFIED |

The cockpit MUST display the certification badge alongside the
S-state value. No S-state may be displayed without its certification
context.

### 4.2 Backed Count Display

```
Backed: 5 / 17
├── 4 certified (DOMAIN-01, 10, 14, 16)
└── 1 overlay  (DOMAIN-11 via SEP-001)
```

The cockpit MUST separate certified from overlay contributions.
A single "backed: 5/17" without breakdown is a disclosure violation.

### 4.3 Q-Class Display

| Scenario | Cockpit Display |
|----------|----------------|
| Q-02 from certified evaluation | Q-02 [CERTIFIED] |
| Q-01 via composite (17/17 with overlays) | Q-01 [COMPOSITE — overlay-dependent] |

---

## 5. Cockpit Data Contracts

### 5.1 Qualification State Contract

The cockpit consumes a qualification state contract:

```json
{
  "qualification_state_for_cockpit": {
    "s_state": {
      "value": "S2",
      "certification": "PIPELINE_CERTIFIED",
      "overlay_dependent": false
    },
    "q_class": {
      "value": "Q-02",
      "certification": "PIPELINE_CERTIFIED",
      "overlay_dependent": false
    },
    "backed_count": {
      "total": 5,
      "certified": 4,
      "overlay": 1,
      "total_possible": 17,
      "overlay_percentage": 20.0
    },
    "grounding_ratio": {
      "value": 0.294,
      "certification": "SANDBOX_COMPUTED"
    },
    "progression": {
      "next_s_state": "S3",
      "deficit": 12,
      "requirement": "17/17 backed"
    },
    "overlay_summary": {
      "active_count": 1,
      "staged_count": 0,
      "revoked_count": 0,
      "total_contribution": 1
    }
  }
}
```

### 5.2 Evolution Timeline Contract

```json
{
  "evolution_for_cockpit": {
    "epoch": 1,
    "baseline": {
      "s_state": "S2",
      "backed_count": 4,
      "timestamp": "<baseline timestamp>"
    },
    "current": {
      "s_state": "S2",
      "backed_count": 5,
      "timestamp": "<current timestamp>"
    },
    "transitions": [
      {
        "sequence": 1,
        "timestamp": "<time>",
        "summary": "SEP-001 activated → DOMAIN-11 PARTIAL→STRONG",
        "impact": "backed 4→5",
        "type": "OVERLAY_ACTIVATION"
      }
    ],
    "transition_count": 1,
    "net_change": "+1 backed"
  }
}
```

### 5.3 Health Contract

```json
{
  "health_for_cockpit": {
    "overall": "HEALTHY",
    "indicators": {
      "replay": "HEALTHY",
      "baseline": "HEALTHY",
      "audit": "HEALTHY",
      "composite": "HEALTHY"
    },
    "failure_count": 0,
    "last_verification": "<timestamp>"
  }
}
```

---

## 6. Cockpit Rendering Boundaries

### 6.1 What the Cockpit Renders

| Surface | Content | Certification Context |
|---------|---------|----------------------|
| S-state badge | S2 with CERTIFIED/COMPOSITE label | Required |
| Q-class badge | Q-02 with CERTIFIED/COMPOSITE label | Required |
| Backed count bar | Visual bar with certified/overlay segments | Required |
| Domain grid | Per-domain colored status with source indicator | Required |
| Evolution timeline | Chronological transitions with type badges | Required |
| Overlay inventory | Package list with lifecycle status | Required |
| Health indicators | Green/yellow/red per dimension | Required |
| Debt summary | Blocking/deferred/resolved counts | Required |

### 6.2 What the Cockpit Does NOT Render

| Surface | Reason |
|---------|--------|
| Raw audit event stream | Not operator-consumable at event granularity |
| Hash chain verification | Infrastructure concern |
| Replay reconstruction details | Internal mechanism |
| Rollback point inventory | Recovery mechanism, not display |
| Conflict resolution internals | Governance-level detail |
| Evidence source provenance (L0) | Too deep for operator display |

---

## 7. Integration Safety Rules

### 7.1 No Cockpit-Initiated Mutation

The cockpit does not modify sandbox state. All governance actions
(activation, revocation, suspension) are initiated through the
governance workspace, not through cockpit rendering.

### 7.2 No Certification Inflation

The cockpit MUST NOT display SANDBOX_COMPUTED state as
PIPELINE_CERTIFIED. No rendering treatment may obscure the
distinction between certification levels.

### 7.3 No Disclosure Suppression

The cockpit MUST display mandatory disclosures. No display mode,
filter, or view may hide the fact that overlay contributions are
present when they are.

### 7.4 Stale Data Indication

If cockpit-consumed data is older than the latest sandbox event,
the cockpit MUST indicate staleness:

```json
{
  "staleness": {
    "data_timestamp": "<last consumed>",
    "latest_event_timestamp": "<latest sandbox event>",
    "stale": true,
    "staleness_duration": "<delta>"
  }
}
```

---

## 8. BlueEdge Cockpit Integration Specifics

| Cockpit Surface | BlueEdge Content |
|----------------|-----------------|
| S-state | S2 [CERTIFIED] (S3 achievable via overlay at 17/17) |
| Backed count | 4/17 certified + up to 13 overlay |
| Domain grid | 17 domains, 4 backed by pipeline, up to 13 by overlay |
| Progression | S3 requires 13 additional domain lineage upgrades |
| Debt | 15 items, overlay can resolve grounding gaps |

---

## 9. Governance Rules

1. The cockpit is a read-only consumer of observability artifacts.
2. No data flows from cockpit to sandbox.
3. Certification level is mandatory on all qualification displays.
4. Backed count breakdown (certified vs overlay) is mandatory.
5. No cockpit rendering may suppress mandatory disclosures.
6. Stale data is explicitly indicated.
7. The cockpit does not initiate governance actions.
8. Cockpit data contracts are the integration interface — cockpit
   renders only contracted data.
