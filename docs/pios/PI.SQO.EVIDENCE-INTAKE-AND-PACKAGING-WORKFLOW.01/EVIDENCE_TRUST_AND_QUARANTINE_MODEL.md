# Evidence Trust and Quarantine Model

**Stream:** PI.SQO.EVIDENCE-INTAKE-AND-PACKAGING-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define how evidence is classified by trust level, how untrusted
evidence is quarantined, how prohibited evidence fails closed,
and how quarantined evidence may recover — ensuring no unsafe
evidence influences qualification evolution.

---

## 2. Trust Level Taxonomy

### 2.1 Four Trust Levels

| Trust Level | Definition | Progression Permitted |
|-------------|-----------|----------------------|
| TRUSTED | All trust criteria met; source authority verified; material integrity confirmed | YES — full packaging and activation pathway |
| PROVISIONAL | Most criteria met; source authority declared but unverified; integrity confirmed | YES — with enhanced review at packaging |
| QUARANTINED | One or more criteria failed; requires investigation before use | NO — must resolve and re-assess |
| PROHIBITED | Structural trust failure; evidence cannot be made safe | NO — terminal state, evidence rejected |

### 2.2 Trust Level Properties

| Property | TRUSTED | PROVISIONAL | QUARANTINED | PROHIBITED |
|----------|---------|-------------|-------------|-----------|
| Evidence extraction | PERMITTED | PERMITTED | BLOCKED | BLOCKED |
| Packaging | PERMITTED | PERMITTED (enhanced review) | BLOCKED | BLOCKED |
| Activation | PERMITTED | PERMITTED | BLOCKED | BLOCKED |
| Qualification influence | YES | YES (marked as provisional overlay) | NO | NO |
| Promotion eligibility | YES | CONDITIONAL (requires trust upgrade first) | NO | NO |
| Certification eligibility | YES | NO (must become TRUSTED first) | NO | NO |

---

## 3. Trust Criteria

### 3.1 Five Trust Criteria

| # | Criterion | Description | Weight |
|---|-----------|-------------|--------|
| TC-01 | Source authority verifiable | Named entity exists and can confirm they provided the material | CRITICAL |
| TC-02 | Material integrity verifiable | Source material can be hashed and hash can be verified | CRITICAL |
| TC-03 | Source freshness acceptable | Source was created or updated within acceptable window | IMPORTANT |
| TC-04 | Format deterministically processable | Evidence can be extracted without interpretation | IMPORTANT |
| TC-05 | No circular authority | Source does not reference the processing system as its own authority | CRITICAL |

### 3.2 Trust Level Determination

```
IF all 5 criteria met AND source authority VERIFIED:
  → TRUSTED

IF all CRITICAL criteria met AND source authority DECLARED but not VERIFIED:
  → PROVISIONAL

IF any CRITICAL criterion fails:
  → QUARANTINED (if potentially recoverable)
  → PROHIBITED (if structurally unrecoverable)

Specific PROHIBITED conditions:
  - TC-05 fails (circular authority) → always PROHIBITED
  - TC-02 fails AND source cannot be re-obtained → PROHIBITED
  - Source is fabricated or synthetic → PROHIBITED
```

### 3.3 Trust Assessment Record

```json
{
  "trust_assessment": {
    "source_ref": "SRC-001",
    "assessed_at": "<ISO-8601>",
    "assessed_by": "<operator identity>",
    "trust_level": "PROVISIONAL",
    "criteria": [
      { "id": "TC-01", "result": "DECLARED_UNVERIFIED", "note": "Authority named but not independently verified" },
      { "id": "TC-02", "result": "PASS", "hash": "sha256:<hex>" },
      { "id": "TC-03", "result": "PASS", "freshness": "6 months" },
      { "id": "TC-04", "result": "PASS", "format": "markdown" },
      { "id": "TC-05", "result": "PASS", "note": "External source, no self-reference" }
    ],
    "determination_basis": "TC-01 declared but unverified — PROVISIONAL until authority verification"
  }
}
```

---

## 4. Quarantine Model

### 4.1 Quarantine Entry Conditions

| Condition | Quarantine Reason | Recovery Path |
|-----------|------------------|---------------|
| Source authority unverifiable | Cannot confirm who provided the material | Obtain independent authority verification |
| Source material corrupted | Hash mismatch or format degraded | Re-obtain source material from authority |
| Source freshness exceeded | Material older than acceptable window | Obtain updated version or explicit operator waiver |
| Extraction non-deterministic | Unstructured format requires interpretation | Re-format source or obtain structured alternative |
| Conflicting sources | Multiple sources make contradictory claims | Operator resolves conflict, selects authoritative source |
| Provenance chain broken | Gap in source → entry linkage | Re-establish provenance or re-extract |
| Duplicate evidence | Same claim already registered from another source | Operator decides: retain, replace, or discard |

### 4.2 Quarantine Mechanics

```
ON quarantine_entry:
  1. Mark source as QUARANTINED in intake inventory
  2. Record quarantine reason with full context
  3. Record recovery path (how to resolve)
  4. Generate EVIDENCE_QUARANTINED audit event
  5. Notify operator of quarantine with reason

WHILE quarantined:
  - Evidence is VISIBLE in intake inventory (not hidden)
  - Evidence CANNOT proceed to packaging
  - Evidence CANNOT influence qualification state
  - Evidence CAN be inspected by operator
  - Evidence CAN be investigated for resolution

ON quarantine_resolution:
  1. Operator addresses quarantine condition
  2. Re-assess trust criteria
  3. IF all criteria now met → upgrade to TRUSTED or PROVISIONAL
  4. IF criteria still fail → remain QUARANTINED or downgrade to PROHIBITED
  5. Generate QUARANTINE_RESOLVED or QUARANTINE_PERSISTED audit event
```

### 4.3 Quarantine Inventory

```json
{
  "quarantine_inventory": {
    "client": "<client_id>",
    "run_id": "<run_id>",
    "quarantined_sources": [
      {
        "source_ref": "SRC-003",
        "quarantined_at": "<ISO-8601>",
        "reason": "Source authority unverifiable — document has no author attribution",
        "recovery_path": "Contact engineering team to confirm document origin",
        "status": "PENDING_RESOLUTION",
        "resolution_deadline": null,
        "escalation_level": "G-0"
      }
    ],
    "total_quarantined": 1,
    "total_resolved": 0,
    "total_rejected": 0
  }
}
```

---

## 5. Prohibition Model

### 5.1 Prohibition Conditions (Terminal)

| Condition | Why Terminal |
|-----------|------------|
| Circular authority (TC-05) | System cannot be its own evidence authority — structural impossibility |
| Fabricated source | Synthetic or AI-generated evidence without external grounding — no provenance possible |
| Irrecoverable corruption | Source cannot be re-obtained and integrity cannot be verified |
| Prohibited source type | Source type explicitly forbidden by governance policy |
| Classification fraud | Source deliberately misclassified to bypass authorization — governance violation |

### 5.2 Prohibition Mechanics

```
ON prohibition_determination:
  1. Mark source as PROHIBITED in intake inventory
  2. Record prohibition reason (permanent, auditable)
  3. Generate EVIDENCE_PROHIBITED audit event
  4. Operator notification with prohibition reason
  5. Source is PERMANENTLY excluded from intake

PROHIBITED sources:
  - Cannot be re-assessed (terminal state)
  - Cannot be re-submitted under a different reference
  - Remain in intake inventory for audit trail
  - Are flagged if operator attempts to re-submit similar material
```

---

## 6. Replay Safety by Trust Level

### 6.1 Replay-Safe Properties

| Trust Level | Replay-Safe? | Justification |
|-------------|:-------------|---------------|
| TRUSTED | YES | Full provenance chain, verified authority, deterministic extraction |
| PROVISIONAL | YES | Provenance chain complete, extraction deterministic (authority unverified does not affect replay) |
| QUARANTINED | N/A | Cannot be packaged — replay safety not applicable |
| PROHIBITED | N/A | Cannot be packaged — replay safety not applicable |

### 6.2 Replay-Unsafe Evidence Definition

Evidence is replay-unsafe if:

| Condition | Why Replay-Unsafe |
|-----------|------------------|
| Source hash missing | Cannot verify same source material in replay |
| Source hash changed | Different source produces different evidence — non-deterministic |
| Extraction depends on interpretation | Same source may produce different claims — non-deterministic |
| Provenance chain incomplete | Cannot reconstruct evidence origin — non-attributable |
| Confidence basis is CONTEXTUAL_DERIVATION without explicit derivation logic | Re-extraction may yield different claims |

Replay-unsafe evidence MUST be quarantined until the unsafe condition is resolved.

---

## 7. Trust Level Transitions

### 7.1 Permitted Transitions

```
                    ┌──────────────────────────┐
                    │                          │
PROVISIONAL ───────→ TRUSTED                   │
    │               (authority verified)       │
    │                                          │
    └──────────────→ QUARANTINED              │
                    (criterion fails)          │
                        │                      │
                        ├────→ PROVISIONAL     │
                        │     (condition       │
                        │      resolved)       │
                        │                      │
                        └────→ PROHIBITED      │
                              (terminal)       │
                                               │
TRUSTED ────────────→ QUARANTINED ─────────────┘
                    (post-registration
                     trust violation detected)
```

### 7.2 Prohibited Transitions

| Transition | Why Prohibited |
|-----------|---------------|
| PROHIBITED → any | PROHIBITED is terminal |
| QUARANTINED → TRUSTED (directly) | Must pass through PROVISIONAL first if authority unverified |
| Any → TRUSTED without criteria | Trust requires all 5 criteria met |
| Downgrade without audit | All transitions produce audit events |

---

## 8. Trust and Certification Interaction

### 8.1 Certification Requirements

| Trust Level | Certification Pathway |
|-------------|----------------------|
| TRUSTED | Standard certification — overlay eligible for OVERLAY_VERIFIED |
| PROVISIONAL | Cannot achieve OVERLAY_VERIFIED until trust upgraded to TRUSTED |
| QUARANTINED | No certification pathway — must resolve quarantine first |
| PROHIBITED | No certification pathway — terminal |

### 8.2 Trust Upgrade for Certification

```
IF overlay uses PROVISIONAL evidence AND promotion review requests certification:
  STEP 1: Verify source authority for all PROVISIONAL entries
  STEP 2: IF verification succeeds → upgrade trust to TRUSTED
  STEP 3: IF verification fails → QUARANTINE entries, block certification
  STEP 4: Re-run replay verification with updated trust status
```

---

## 9. Governance

- 4 trust levels (TRUSTED, PROVISIONAL, QUARANTINED, PROHIBITED) cover all evidence states
- 5 trust criteria with CRITICAL/IMPORTANT weighting
- QUARANTINED evidence has explicit recovery paths
- PROHIBITED evidence is terminal — no recovery
- No unsafe evidence may influence qualification evolution
- PROVISIONAL evidence can activate but cannot certify
- Trust transitions are auditable with no hidden state changes
- Replay safety is preserved for TRUSTED and PROVISIONAL evidence
- Quarantine inventory is always visible to operators
