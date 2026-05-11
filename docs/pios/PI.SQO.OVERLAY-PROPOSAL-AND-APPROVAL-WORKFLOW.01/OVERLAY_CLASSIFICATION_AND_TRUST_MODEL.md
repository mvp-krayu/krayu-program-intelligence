# Overlay Classification and Trust Model

**Stream:** PI.SQO.OVERLAY-PROPOSAL-AND-APPROVAL-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define how overlays are classified by type, sensitivity, and
impact — and how trust levels govern overlay progression from
proposal through certification.

---

## 2. Overlay Type Classification

### 2.1 Eight Overlay Types

| Type | Code | Definition | Primary Qualification Impact |
|------|------|-----------|----------------------------|
| Grounding overlay | OT-GND | Increases domain grounding (backed_count) via LINEAGE_UPGRADE | backed_count +N |
| Continuity overlay | OT-CNT | Extends crosswalk coverage via CONTINUITY_MAPPING | continuity improvement |
| Lineage-strengthening overlay | OT-LIN | Strengthens existing lineage from PARTIAL to BACKED | backed_count +N (upgrade path) |
| Semantic reinforcement overlay | OT-SEM | Adds domain typing, capability binding, or label assignment | domain_typing improvement |
| Qualification-enhancement overlay | OT-QUA | Multi-claim package targeting S-state progression | backed_count + grounding + continuity |
| Edge enrichment overlay | OT-EDG | Enriches structural edges with semantic typing | Indirect — topology depth |
| Debt resolution overlay | OT-DEB | Specifically targets identified semantic debt items | debt_items_resolved |
| Composite overlay | OT-COM | Multi-type package with claims across multiple categories | Mixed (per-entry attribution) |

### 2.2 Type Determination Rules

```
FOR each package in proposal:
  IF all entries are LINEAGE_UPGRADE:
    → type = OT-GND (grounding)
  IF all entries are CONTINUITY_MAPPING:
    → type = OT-CNT (continuity)
  IF all entries upgrade PARTIAL → BACKED:
    → type = OT-LIN (lineage-strengthening)
  IF all entries are DOMAIN_TYPING or CAPABILITY_BINDING:
    → type = OT-SEM (semantic reinforcement)
  IF entries target multiple claim types for S-state progression:
    → type = OT-QUA (qualification-enhancement)
  IF all entries are EDGE_ENRICHMENT:
    → type = OT-EDG (edge enrichment)
  IF all entries resolve specific debt items:
    → type = OT-DEB (debt resolution)
  IF entries span multiple categories:
    → type = OT-COM (composite)
```

### 2.3 Type Properties

| Type | Replay Sensitivity | Rollback Sensitivity | Certification Impact | Typical Confidence |
|------|:-----------------:|:-------------------:|:-------------------:|:------------------:|
| OT-GND | STANDARD | STANDARD | YES (changes backed_count) | STRONG_INFERENCE+ |
| OT-CNT | STANDARD | STANDARD | STANDARD | STRONG_INFERENCE |
| OT-LIN | STANDARD | STANDARD | YES (changes backed_count) | DIRECT_CITATION preferred |
| OT-SEM | STANDARD | STANDARD | STANDARD | STRONG_INFERENCE |
| OT-QUA | ELEVATED | ELEVATED | YES (targets S-state) | STRONG_INFERENCE+ |
| OT-EDG | STANDARD | STANDARD | STANDARD | DIRECT_CITATION |
| OT-DEB | STANDARD | STANDARD | STANDARD | STRONG_INFERENCE |
| OT-COM | ELEVATED | ELEVATED | DEPENDS on entries | Mixed |

---

## 3. Overlay Sensitivity Classification

### 3.1 Three Sensitivity Levels

| Level | Definition | Review Requirement |
|-------|-----------|-------------------|
| STANDARD | Normal replay/rollback behavior, no special considerations | Standard governance review |
| REPLAY-SENSITIVE | Overlay introduces ordering dependencies or conflict resolution | Enhanced replay review required |
| ROLLBACK-SENSITIVE | Overlay creates dependencies that complicate removal | Enhanced rollback review required |

### 3.2 Sensitivity Determination

```
REPLAY-SENSITIVE if ANY of:
  - Package contains entries that conflict with existing overlays
  - Package introduces dependency on specific activation order
  - Package targets domains already covered by another overlay
  - Confidence basis is CONTEXTUAL_DERIVATION (lowest tier)

ROLLBACK-SENSITIVE if ANY of:
  - Another proposal depends on this overlay's claims
  - Overlay targets a domain that would achieve S3 if activated
  - Overlay is part of a dependency chain (depth > 0)
  - Overlay removal would trigger cascade re-evaluation

OTHERWISE:
  → STANDARD
```

---

## 4. Overlay Trust Model

### 4.1 Seven Trust States

| Trust State | Definition | Progression Permitted |
|-------------|-----------|----------------------|
| PROPOSAL-TRUSTED | Evidence trust verified, proposal constructed | YES — submit for review |
| PROPOSAL-PROVISIONAL | Evidence is PROVISIONAL, proposal valid | YES — with enhanced review |
| GOVERNANCE-APPROVED | Governance review passed | YES — operator authorization |
| REPLAY-AUTHORIZED | Replay safety verified | YES — rollback check |
| ROLLBACK-AUTHORIZED | Rollback safety verified | YES — activation eligible |
| CERTIFICATION-AUTHORIZED | Full verification complete, certification eligible | YES — certification review |
| QUARANTINED | Trust violation detected, suspended | NO — investigation required |

### 4.2 Trust Progression

```
Evidence Trust (from intake)
    │
    ▼
PROPOSAL-TRUSTED ──── (evidence TRUSTED) ──── standard review
    or
PROPOSAL-PROVISIONAL ── (evidence PROVISIONAL) ── enhanced review
    │
    ▼ (governance review passes)
GOVERNANCE-APPROVED
    │
    ▼ (replay safety passes)
REPLAY-AUTHORIZED
    │
    ▼ (rollback safety passes)
ROLLBACK-AUTHORIZED
    │
    ▼ (activation + verification complete)
CERTIFICATION-AUTHORIZED
```

### 4.3 Trust Degradation

```
ANY trust state → QUARANTINED if:
  - Evidence trust violation detected post-approval
  - Source material integrity fails verification
  - Lineage chain breaks
  - Replay divergence detected
  - Operator reports concern

QUARANTINED → recovery:
  - Investigate trust violation
  - Resolve condition
  - Re-enter review at appropriate trust level
  - OR reject overlay permanently
```

### 4.4 Trust-to-Capability Matrix

| Trust State | Can Submit | Can Activate | Can Certify | Can Publish |
|-------------|:---------:|:------------:|:-----------:|:-----------:|
| PROPOSAL-TRUSTED | YES | NO | NO | NO |
| PROPOSAL-PROVISIONAL | YES (enhanced) | NO | NO | NO |
| GOVERNANCE-APPROVED | — | NO (needs replay/rollback) | NO | NO |
| REPLAY-AUTHORIZED | — | NO (needs rollback) | NO | NO |
| ROLLBACK-AUTHORIZED | — | YES | NO | NO |
| CERTIFICATION-AUTHORIZED | — | — | YES | AFTER certification |
| QUARANTINED | NO | NO | NO | NO |

---

## 5. Overlay Certification Impact Classification

### 5.1 Certification Impact Categories

| Category | Definition | Certification Pathway |
|----------|-----------|----------------------|
| CERTIFICATION-IMPACTING | Overlay changes backed_count, grounding, or S-state | Requires full 7-check promotion review |
| CERTIFICATION-STANDARD | Overlay enriches but does not change qualification metrics | Standard promotion review |
| CERTIFICATION-EXEMPT | Overlay is audit-only (GOVERNANCE class) | No certification required |

### 5.2 Certification Impact Determination

```
CERTIFICATION-IMPACTING if ANY entry:
  - claim_type = LINEAGE_UPGRADE
  - claim_type = LABEL_ASSIGNMENT with backed_count impact
  - package achieves S-state transition threshold

CERTIFICATION-STANDARD if ALL entries:
  - claim_type in {CONTINUITY_MAPPING, CAPABILITY_BINDING, EDGE_ENRICHMENT, DOMAIN_TYPING}
  - No backed_count impact
  - No S-state threshold crossing

CERTIFICATION-EXEMPT if ALL entries:
  - semantic_class = GOVERNANCE
  - No qualification impact
```

---

## 6. Classification Persistence

### 6.1 Classification Record

```json
{
  "overlay_classification": {
    "package_id": "SEP-blueedge-CLU-04-004",
    "overlay_type": "OT-QUA",
    "overlay_type_name": "Qualification-enhancement overlay",
    "sensitivity": "STANDARD",
    "certification_impact": "CERTIFICATION-IMPACTING",
    "trust_state": "PROPOSAL-TRUSTED",
    "evidence_trust": "TRUSTED",
    "claim_types": ["LINEAGE_UPGRADE", "LABEL_ASSIGNMENT"],
    "target_domains": ["DOM-04", "DOM-07", "DOM-09"],
    "classified_at": "<ISO-8601>",
    "classified_by": "governance_framework"
  }
}
```

---

## 7. Governance

- 8 overlay types cover all semantic evolution categories
- 3 sensitivity levels (STANDARD, REPLAY-SENSITIVE, ROLLBACK-SENSITIVE) determine review depth
- 7 trust states govern overlay progression from proposal through certification
- 3 certification impact categories determine certification pathway
- Classification is deterministic — computed from package content
- Trust progression is monotonic (unless degraded by violation)
- Trust degradation triggers quarantine with investigation requirement
- All classifications are externally visible and audit-recorded
