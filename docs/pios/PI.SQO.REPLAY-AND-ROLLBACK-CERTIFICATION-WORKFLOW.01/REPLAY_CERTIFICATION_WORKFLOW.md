# Replay Certification Workflow

**Stream:** PI.SQO.REPLAY-AND-ROLLBACK-CERTIFICATION-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the canonical governed workflow by which replay integrity
becomes a certified gating condition for authority promotion —
ensuring every qualification state claimed as authority is
deterministically reconstructable from its inputs.

---

## 2. Replay Certification Overview

### 2.1 Six-Phase Replay Certification Pipeline

```
Phase 1: Input Inventory
    │   Enumerate all inputs to composite state
    ▼
Phase 2: Input Integrity Verification
    │   Verify every input hash matches expected value
    ▼
Phase 3: Deterministic Reconstruction
    │   Recompute composite state from verified inputs
    ▼
Phase 4: Output Comparison
    │   Compare reconstructed state against current state
    ▼
Phase 5: Lineage Verification
    │   Verify full lineage chain (L0→L5) for all contributors
    ▼
Phase 6: Certification Decision
    │   Issue REPLAY_CERTIFIED or REPLAY_DENIED
    ▼
[Output: Replay certification record — authority gate]
```

### 2.2 Certification Boundary Rule

Replay certification is the mandatory gate between ACTIVATED
overlay state (sandbox-computed) and PROMOTION-ELIGIBLE state
(authority candidate). No overlay may be promoted to authority
without passing replay certification.

---

## 3. Phase 1: Input Inventory

### 3.1 Six Replay Inputs

| # | Input | Description | Source |
|---|-------|-------------|--------|
| I-01 | Certified baseline | Hash-verified pipeline substrate | PIPELINE_CERTIFIED |
| I-02 | Overlay set | Ordered list of ACTIVATED SEPs with versions | Package registry |
| I-03 | Application order | Deterministic sequence (by package_id) | Package registry |
| I-04 | Conflict resolutions | Recorded resolution for every domain+field conflict | Composite state |
| I-05 | Qualification parameters | S-state thresholds, Q-class definitions | Governance configuration |
| I-06 | Governance configuration | Zone thresholds, escalation rules, architectural limits | Governance configuration |

### 3.2 Input Inventory Process

```
STEP 1: Enumerate baseline
  - Record certified baseline hash
  - Verify baseline exists in artifact store
  - Confirm baseline has not been modified (G-BASELINE)

STEP 2: Enumerate overlay set
  - List all ACTIVATED overlays in activation order
  - Record package_id, version, entry count for each
  - Verify each overlay exists in artifact store

STEP 3: Enumerate application order
  - Confirm package_id sequence is monotonic
  - Confirm entry_id sequences within packages are monotonic
  - Record complete application order

STEP 4: Enumerate conflict resolutions
  - Identify all domain+field overlaps between overlays
  - Record resolution outcome for each (which entry won, why)

STEP 5: Enumerate parameters and configuration
  - Record qualification parameters version
  - Record governance configuration version

STEP 6: Compute input inventory hash
  - input_hash = sha256(I-01 + I-02 + I-03 + I-04 + I-05 + I-06)
  - Record as replay input fingerprint
```

### 3.3 Input Inventory Gate (G-INPUT-INVENTORY)

| Check | Requirement |
|-------|------------|
| Baseline exists and is hash-verified | I-01 hash matches stored hash |
| All overlays exist in artifact store | Every ACTIVATED SEP retrievable |
| Application order is deterministic | Monotonic package_id and entry_id sequences |
| All conflict resolutions recorded | No unrecorded domain+field overlaps |
| Parameters and configuration versioned | Versions recorded for reproducibility |
| Input inventory hash computed | Fingerprint available for comparison |

---

## 4. Phase 2: Input Integrity Verification

### 4.1 Integrity Verification Process

```
FOR each input in inventory:

  I-01: Baseline integrity
    COMPUTE sha256(current_baseline)
    COMPARE against certified_baseline_hash
    IF mismatch → FAIL("Baseline drift detected — FC-01")

  I-02: Overlay integrity
    FOR each ACTIVATED overlay:
      COMPUTE sha256(package_content)
      COMPARE against registration_hash
      IF mismatch → FAIL("Package hash mismatch: {package_id}")

  I-03: Application order integrity
    VERIFY package_id sequence matches registration order
    VERIFY no packages inserted, removed, or reordered since activation
    IF discrepancy → FAIL("Application order modified post-activation")

  I-04: Conflict resolution integrity
    FOR each recorded conflict:
      RECOMPUTE resolution using deterministic rules
      COMPARE against recorded resolution
      IF mismatch → FAIL("Conflict resolution divergence")

  I-05 + I-06: Configuration integrity
    VERIFY parameter and configuration versions match activation-time versions
    IF mismatch → WARN("Configuration changed since activation — note in certification")
```

### 4.2 Integrity Gate (G-INPUT-INTEGRITY)

| Check | Requirement |
|-------|------------|
| Baseline hash matches | Zero drift from certified baseline |
| All package hashes match | Every ACTIVATED overlay is intact |
| Application order unchanged | No post-activation reordering |
| Conflict resolutions match | Deterministic resolution verified |
| Configuration versions noted | Any changes documented |

---

## 5. Phase 3: Deterministic Reconstruction

### 5.1 Reconstruction Process

```
STEP 1: Load verified baseline
  composite = deepClone(certified_baseline)

STEP 2: Apply overlays in order
  FOR each overlay in application_order:
    FOR each entry in overlay.evidence_entries:
      IF entry.semantic_class not authorized:
        SKIP (log as REJECTED_UNAUTHORIZED)
      application = applyEntry(composite, entry)
      composite.overlay_contributions.push(contribution_record)

STEP 3: Apply conflict resolutions
  FOR each domain+field conflict:
    APPLY deterministic resolution (later wins, higher confidence wins)
    RECORD resolution outcome

STEP 4: Compute qualification metrics
  composite.static_backed_count = countCertifiedBacking(baseline)
  composite.overlay_backed_count = countOverlayBacking(contributions)
  composite.composite_backed_count = static + overlay
  composite.grounding_ratio = computeGrounding(composite)
  composite.qualification = computeQualification(composite)

STEP 5: Hash reconstructed state
  reconstructed_hash = sha256(JSON.stringify(composite, sorted_keys))
```

### 5.2 Reconstruction Determinism Guarantee

The reconstruction is deterministic because:
- Inputs are hash-verified (Phase 2)
- Application order is monotonic (package_id, entry_id)
- Conflict resolution is rule-based (later wins, higher confidence wins)
- Qualification computation is a pure function
- No external state consulted during reconstruction

---

## 6. Phase 4: Output Comparison

### 6.1 Comparison Process

```
STEP 1: Hash current composite state
  current_hash = sha256(JSON.stringify(current_composite, sorted_keys))

STEP 2: Compare hashes
  IF reconstructed_hash == current_hash:
    → MATCH — replay is deterministic
    → Proceed to lineage verification

  IF reconstructed_hash != current_hash:
    → DIVERGENCE — replay produced different state
    → FREEZE sandbox
    → Escalate to G-4
    → Investigate divergence source
    → Record divergence details

STEP 3: Record comparison result
  - MATCH or DIVERGENCE
  - Both hashes recorded
  - Timestamp of comparison
  - If DIVERGENCE: delta details (which fields differ)
```

### 6.2 Double-Replay Verification

For CERTIFICATION-IMPACTING overlays, perform double-replay:

```
REPLAY 1: Reconstruct composite → hash H1
REPLAY 2: Reconstruct composite (same inputs) → hash H2

ASSERT H1 == H2 (proves no non-determinism in reconstruction itself)
ASSERT H1 == current_hash (proves current state matches reconstruction)

IF H1 != H2:
  → Non-deterministic reconstruction detected
  → CRITICAL — investigation required
  → Certification DENIED
```

---

## 7. Phase 5: Lineage Verification

### 7.1 Six-Lineage Verification

| Lineage Type | What Is Verified | Method |
|-------------|-----------------|--------|
| Substrate lineage | Certified baseline traces to pipeline execution | Verify pipeline certification record |
| Overlay lineage | Each overlay traces to evidence intake | Verify L0→L2 lineage per overlay |
| Orchestration lineage | Activation sequence traces to proposal/approval | Verify proposal registry |
| Qualification lineage | Metrics trace to specific overlay contributions | Verify attribution records |
| Evidence lineage | Evidence claims trace to external sources | Verify L0→L1 provenance chain |
| Authority lineage | Certification traces to replay/rollback proof | Verify certification evidence (this pipeline) |

### 7.2 Lineage Verification Process

```
FOR each ACTIVATED overlay contributing to current state:

  STEP 1: Verify evidence lineage (L0→L1)
    - Source exists, source hash matches, authority named

  STEP 2: Verify package lineage (L1→L2)
    - Intake registration exists, provenance chain complete

  STEP 3: Verify activation lineage (L2→L3)
    - Proposal exists, approval recorded, activation lifecycle complete

  STEP 4: Verify qualification lineage (L3→L4)
    - Attribution records link metrics to specific entries

  STEP 5: Verify full chain integrity
    - Compute lineage_hash for complete chain
    - Compare against recorded lineage_hash
    - IF mismatch → LINEAGE_BREAK detected
```

### 7.3 Lineage Gate (G-LINEAGE-CERT)

| Check | Requirement |
|-------|------------|
| All 6 lineage types verified | No lineage type skipped |
| No broken chains | Every overlay has complete L0→L4 chain |
| No orphaned contributions | Every contribution attributed to an overlay |
| Lineage hashes match | Per-chain integrity verified |

---

## 8. Phase 6: Certification Decision

### 8.1 Decision Process

```
IF Phase 4 result = MATCH AND Phase 5 all lineage verified:
  → REPLAY_CERTIFIED
  → Issue replay certification record
  → Overlay eligible for promotion review

IF Phase 4 result = MATCH BUT Phase 5 has lineage breaks:
  → REPLAY_PARTIAL
  → Certified overlays listed (those with complete lineage)
  → Non-certified overlays listed (those with broken lineage)
  → Promotion limited to certified subset

IF Phase 4 result = DIVERGENCE:
  → REPLAY_DENIED
  → No promotion eligibility
  → Mandatory investigation
  → G-4 escalation

IF Phase 3 reconstruction fails:
  → REPLAY_FAILED
  → No promotion eligibility
  → Investigation required
```

### 8.2 Certification Record

```json
{
  "replay_certification": {
    "certification_id": "RCERT-<client>-<run_id>-<seq>",
    "timestamp": "<ISO-8601>",
    "decision": "REPLAY_CERTIFIED",
    "input_hash": "<sha256 of all inputs>",
    "reconstructed_hash": "<sha256 of reconstructed state>",
    "current_hash": "<sha256 of current state>",
    "match": true,
    "double_replay": true,
    "lineage_verification": {
      "substrate": "VERIFIED",
      "overlay": "VERIFIED (3/3 overlays)",
      "orchestration": "VERIFIED",
      "qualification": "VERIFIED",
      "evidence": "VERIFIED",
      "authority": "VERIFIED"
    },
    "certified_overlays": ["SEP-multi-001", "SEP-multi-002", "SEP-multi-003"],
    "governance_zone": "SAFE",
    "escalation_level": "G-0"
  }
}
```

---

## 9. Governance

- 6-phase replay certification pipeline ensures deterministic reconstructability
- 6 replay inputs are hash-verified before reconstruction
- Deterministic reconstruction produces identical output from identical inputs
- Double-replay verification detects non-determinism in reconstruction itself
- 6 lineage types verified for complete authority chain
- REPLAY_CERTIFIED is mandatory gate for authority promotion
- DIVERGENCE triggers immediate freeze and G-4 escalation
- Every certification phase produces auditable records
- No authority promotion without replay certification
