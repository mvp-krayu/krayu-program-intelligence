# Evidence Observability Model

**Stream:** PI.SQO.EVIDENCE-INTAKE-AND-PACKAGING-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define continuous observability into evidence state throughout the
intake and packaging workflow — ensuring evidence source, trust
state, lineage, packaging status, replay bindings, qualification
influence, and governance-zone state remain externally visible
at all times.

---

## 2. Eight Evidence Observability Dimensions

| # | Dimension | Question | Observable Artifact |
|---|-----------|----------|-------------------|
| 1 | Source state | What evidence sources exist and what is their status? | intake_inventory.json |
| 2 | Trust state | What trust level does each source have? | trust_assessment.json |
| 3 | Lineage state | Is the full lineage chain intact for all evidence? | lineage_integrity.json |
| 4 | Package state | What packages exist and what is their status? | package_registry.json |
| 5 | Replay binding state | Are all packages replay-bound? | replay_binding.json |
| 6 | Qualification influence | How does evidence affect qualification metrics? | qualification_attribution.json |
| 7 | Governance zone state | What zone are we in and how does evidence affect it? | zone_status.json |
| 8 | Quarantine state | What evidence is quarantined and why? | quarantine_inventory.json |

---

## 3. Evidence Pipeline Dashboard

### 3.1 At-a-Glance View

```
┌─────────────────────────────────────────────────────┐
│  EVIDENCE PIPELINE — BlueEdge / CLU-04              │
│                                                     │
│  Sources: 5 discovered, 4 classified, 4 trusted     │
│  Trust:   3 TRUSTED, 1 PROVISIONAL, 0 QUARANTINED   │
│                                                     │
│  Evidence: 13 extracted, 13 normalized, 13 registered│
│  Lineage:  13/13 chains intact                      │
│                                                     │
│  Packages: 4 STAGED, 3 ACTIVATED, 0 REVOKED         │
│  Entries:  13 total (within 200 limit)              │
│  Replay:   3/3 ACTIVATED packages BOUND             │
│                                                     │
│  Qualification: 7/17 backed (3 from overlay)        │
│  Zone: SAFE     Next projection: SAFE               │
│  Quarantine: 0 sources, 0 entries                   │
│                                                     │
│  Health: ● HEALTHY                                  │
└─────────────────────────────────────────────────────┘
```

### 3.2 Dashboard Update Frequency

| Event | Dashboard Update |
|-------|-----------------|
| Source discovered | Sources count updated |
| Source classified | Classification count updated |
| Trust assessed | Trust distribution updated |
| Evidence extracted | Evidence count updated |
| Evidence registered | Registration count updated |
| Package registered | Package count, entry count updated |
| Package activated | Package status, replay binding updated |
| Package revoked | Package status, qualification attribution updated |
| Zone transition | Zone status, projection updated |
| Quarantine event | Quarantine count updated |

---

## 4. Per-Dimension Observability

### 4.1 Source State Observability

```
Source               Type    Trust      Status       Entries  Domains
──────────────────────────────────────────────────────────────────────
SRC-001              ADR     TRUSTED    REGISTERED   3        DOM-11, DOM-02, DOM-08
SRC-002              DOC     TRUSTED    REGISTERED   4        DOM-03, DOM-05, DOM-06, DOM-04
SRC-003              CAP     TRUSTED    REGISTERED   3        DOM-07, DOM-09, DOM-10
SRC-004              ARC     PROV.      REGISTERED   3        DOM-12, DOM-13, DOM-14
SRC-005              OPS     —          DISCOVERED   —        (pending classification)
```

### 4.2 Trust State Observability

```json
{
  "trust_summary": {
    "total_sources": 5,
    "by_trust_level": {
      "TRUSTED": 3,
      "PROVISIONAL": 1,
      "QUARANTINED": 0,
      "PROHIBITED": 0
    },
    "unassessed": 1,
    "trust_criteria_summary": {
      "TC-01_authority_verifiable": { "pass": 3, "declared": 1, "fail": 0 },
      "TC-02_integrity_verifiable": { "pass": 4, "fail": 0 },
      "TC-03_freshness_acceptable": { "pass": 4, "fail": 0 },
      "TC-04_format_processable": { "pass": 4, "fail": 0 },
      "TC-05_no_circular_authority": { "pass": 4, "fail": 0 }
    }
  }
}
```

### 4.3 Lineage State Observability

```json
{
  "lineage_summary": {
    "total_chains": 13,
    "by_status": {
      "COMPLETE": 13,
      "BROKEN": 0,
      "PENDING": 0
    },
    "layers_verified": {
      "L0_source": "13/13 verified",
      "L1_intake": "13/13 verified",
      "L2_package": "10/13 verified (3 pending packaging)",
      "L3_activation": "7/13 verified (6 not yet activated)",
      "L4_qualification": "7/13 verified",
      "L5_publication": "3/13 verified (4 pending certification)"
    }
  }
}
```

### 4.4 Package State Observability

```
Package              Status      Version  Entries  Domains    Trust
──────────────────────────────────────────────────────────────────────
SEP-multi-001        ACTIVATED   v1       1        DOM-11     TRUSTED
SEP-multi-002        ACTIVATED   v1       1        DOM-02     TRUSTED
SEP-multi-003        ACTIVATED   v1       1        DOM-08     TRUSTED
SEP-batch-001        STAGED      v1       3        DOM-03,    TRUSTED
                                                   DOM-05,
                                                   DOM-06
SEP-batch-002        STAGED      v1       2        DOM-04,    PROV.
                                                   DOM-07
```

### 4.5 Quarantine State Observability

```json
{
  "quarantine_status": {
    "quarantined_sources": 0,
    "quarantined_entries": 0,
    "quarantined_packages": 0,
    "active_investigations": 0,
    "resolved_this_iteration": 0,
    "total_ever_quarantined": 0,
    "total_ever_prohibited": 0
  }
}
```

---

## 5. Evidence Workflow Event Stream

### 5.1 Event Types

| Event Type | Phase | Data |
|-----------|-------|------|
| SOURCE_DISCOVERED | Intake 1 | source_ref, location, type estimate |
| SOURCE_CLASSIFIED | Intake 2 | source_ref, type, authorized_classes |
| TRUST_ASSESSED | Intake 3 | source_ref, trust_level, criteria_results |
| EVIDENCE_EXTRACTED | Intake 4 | source_ref, entry_count, domains |
| EVIDENCE_NORMALIZED | Intake 5 | entry_ids, schema_validation_result |
| PROVENANCE_BOUND | Intake 6 | entry_ids, provenance_chain_hash |
| EVIDENCE_REGISTERED | Intake 7 | intake_id, entry_ids, trust_level |
| EVIDENCE_SELECTED | Packaging 1 | entry_ids, strategy, rationale |
| PACKAGE_ASSEMBLED | Packaging 3 | package_id, entry_count, domains |
| PACKAGE_VALIDATED | Packaging 4 | package_id, validation_result |
| REPLAY_BINDING_COMPLETE | Packaging 5 | package_id, replay_hash |
| PACKAGE_REGISTERED | Packaging 6 | package_id, status: STAGED |
| EVIDENCE_QUARANTINED | Any | source_ref, reason, recovery_path |
| EVIDENCE_PROHIBITED | Any | source_ref, reason (terminal) |
| QUARANTINE_RESOLVED | Any | source_ref, resolution, new_trust_level |
| TRUST_UPGRADED | Any | source_ref, old_level, new_level |
| TRUST_DOWNGRADED | Any | source_ref, old_level, new_level, reason |

### 5.2 Event Schema

```json
{
  "evidence_event": {
    "event_id": "<unique>",
    "event_type": "EVIDENCE_REGISTERED",
    "timestamp": "<ISO-8601>",
    "phase": "Intake Phase 7",
    "source_ref": "SRC-001",
    "details": {
      "intake_id": "INT-001",
      "entry_count": 3,
      "trust_level": "TRUSTED",
      "domains": ["DOM-11", "DOM-02", "DOM-08"]
    },
    "governance_zone": "SAFE",
    "escalation_level": "G-0",
    "operator": "<operator identity>"
  }
}
```

---

## 6. Evidence Health Indicators

### 6.1 Health Computation

```
Evidence pipeline health = HEALTHY if ALL of:
  - No QUARANTINED sources
  - No broken lineage chains
  - All ACTIVATED packages are replay-bound
  - Governance zone ≤ PRESSURE
  - No pending trust violations
  - Package count within limits (≤ 10)
  - Entry count within limits (≤ 200)

Evidence pipeline health = DEGRADED if ANY of:
  - 1-2 QUARANTINED sources (under investigation)
  - 1-2 broken lineage chains (being repaired)
  - Governance zone = PRESSURE

Evidence pipeline health = IMPAIRED if ANY of:
  - 3+ QUARANTINED sources
  - 3+ broken lineage chains
  - Governance zone = RISK
  - ACTIVATED package with broken replay binding

Evidence pipeline health = CRITICAL if ANY of:
  - Governance zone = PROHIBITED
  - Replay divergence detected in evidence-derived state
  - Baseline contamination from evidence source
  - Trust violation in ACTIVATED overlay
```

### 6.2 Health Dashboard

```
Evidence Pipeline Health: ● HEALTHY

  Sources:      ● 4/4 classified, 0 quarantined
  Trust:        ● 3 TRUSTED + 1 PROVISIONAL, 0 violations
  Lineage:      ● 13/13 chains intact
  Packages:     ● 7/10 capacity (3 ACTIVATED + 4 STAGED)
  Entries:      ● 13/200 capacity
  Replay:       ● 3/3 ACTIVATED packages bound
  Zone:         ● SAFE
  Quarantine:   ● 0 items
```

---

## 7. Observability Persistence

### 7.1 Artifact Structure

```
artifacts/sqo/<client>/<run_id>/evidence_observability/
├── intake_inventory.json
├── trust_assessment.json
├── lineage_integrity.json
├── package_state.json
├── replay_binding_state.json
├── qualification_attribution.json
├── quarantine_inventory.json
├── evidence_health.json
├── evidence_event_log.json
└── snapshots/
    ├── snapshot-intake-001.json
    └── snapshot-intake-002.json
```

### 7.2 Snapshot Triggers

| Trigger | Snapshot Content |
|---------|----------------|
| Intake session complete | Full evidence pipeline state |
| Package registration | Package state + lineage state |
| Trust level change | Trust assessment + affected packages |
| Quarantine event | Quarantine inventory + affected lineage |
| Zone transition | Full pipeline state with zone context |

---

## 8. Governance

- 8 observability dimensions cover the full evidence pipeline
- Evidence pipeline dashboard provides at-a-glance operator awareness
- 17 event types cover all intake and packaging transitions
- 4-level health indicator (HEALTHY / DEGRADED / IMPAIRED / CRITICAL)
- Every evidence state change produces an observable event
- Quarantine state is always visible (never hidden)
- Observability artifacts persist for audit
- Snapshots taken at key workflow transitions
- No evidence state is hidden from authorized operators
