# Divergence and Ambiguity Detection

**Stream:** PI.SQO.REPLAY-AND-ROLLBACK-CERTIFICATION-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the canonical detection model for divergence (reconstructed
state differs from current state) and ambiguity (reconstruction
inputs are incomplete or contradictory) — ensuring certification
failures are precisely diagnosed and escalated.

---

## 2. Divergence Detection

### 2.1 Four Divergence Types

| # | Type | Description | Severity |
|---|------|-------------|----------|
| DIV-01 | Hash divergence | Reconstructed hash differs from current hash | CRITICAL |
| DIV-02 | Field divergence | Specific domain+field values differ | HIGH |
| DIV-03 | Metric divergence | Qualification metrics differ | HIGH |
| DIV-04 | Structural divergence | Contribution count or structure differs | CRITICAL |

### 2.2 Divergence Detection Process

```
FUNCTION detectDivergence(reconstructed, current):

  // Level 1: Hash comparison (fast path)
  reconstructed_hash = sha256(JSON.stringify(reconstructed, sorted_keys))
  current_hash = sha256(JSON.stringify(current, sorted_keys))
  
  IF reconstructed_hash == current_hash:
    RETURN { divergent: false }
  
  // Level 2: Structural comparison
  divergences = []
  
  // Check contribution count
  IF reconstructed.contributions.length != current.contributions.length:
    divergences.push({
      type: "DIV-04",
      detail: "Contribution count mismatch",
      reconstructed: reconstructed.contributions.length,
      current: current.contributions.length
    })
  
  // Check domain+field values
  FOR each domain in union(reconstructed.domains, current.domains):
    FOR each field in union(domain.fields):
      r_value = reconstructed[domain][field]
      c_value = current[domain][field]
      IF r_value != c_value:
        divergences.push({
          type: "DIV-02",
          domain: domain,
          field: field,
          reconstructed_value: r_value,
          current_value: c_value
        })
  
  // Check qualification metrics
  FOR each metric in union(reconstructed.metrics, current.metrics):
    IF reconstructed.metrics[metric] != current.metrics[metric]:
      divergences.push({
        type: "DIV-03",
        metric: metric,
        reconstructed_value: reconstructed.metrics[metric],
        current_value: current.metrics[metric]
      })
  
  RETURN {
    divergent: true,
    hash_divergence: { type: "DIV-01", reconstructed_hash, current_hash },
    field_divergences: divergences.filter(d => d.type == "DIV-02"),
    metric_divergences: divergences.filter(d => d.type == "DIV-03"),
    structural_divergences: divergences.filter(d => d.type == "DIV-04"),
    total_divergences: divergences.length
  }
```

### 2.3 Divergence Severity Matrix

| Divergence Type | Count | Severity | Action |
|----------------|-------|----------|--------|
| DIV-04 (structural) | Any | CRITICAL | Sandbox freeze, G-4 escalation |
| DIV-01 (hash) + DIV-02 (field) | > 10 fields | CRITICAL | Sandbox freeze, G-4 escalation |
| DIV-01 (hash) + DIV-02 (field) | 1–10 fields | HIGH | Investigation, G-3 escalation |
| DIV-03 (metric only) | Any | HIGH | Investigation, G-2 escalation |

---

## 3. Divergence Root Cause Analysis

### 3.1 Seven Root Cause Categories

| # | Category | Description | Detection Method |
|---|----------|-------------|-----------------|
| RC-01 | Baseline drift | Certified baseline was modified after certification | Compare baseline hash against certification record |
| RC-02 | Package mutation | Overlay package was modified after activation | Compare package hash against registration record |
| RC-03 | Order violation | Overlay application order changed post-activation | Compare application sequence against activation record |
| RC-04 | Resolution divergence | Conflict resolution rules changed since activation | Compare resolution outcomes against activation-time rules |
| RC-05 | Configuration drift | Qualification parameters or governance config changed | Compare config versions against activation-time versions |
| RC-06 | Unauthorized mutation | Composite state modified outside governed process | Audit trail gap detection |
| RC-07 | Non-deterministic computation | Reconstruction produces different results per execution | Double-replay/rollback verification |

### 3.2 Root Cause Investigation Protocol

```
STEP 1: Identify divergence scope
  - List all divergent fields
  - Map divergent fields to contributing overlays
  - Map divergent metrics to contributing entries

STEP 2: Check input integrity (RC-01 through RC-05)
  FOR each input in replay input inventory:
    RECOMPUTE hash
    COMPARE against certification-time hash
    IF mismatch → ROOT CAUSE identified (input category)

STEP 3: Check for unauthorized mutation (RC-06)
  SCAN audit trail for composite state modifications
  IDENTIFY modifications not attributable to governed overlay operations
  IF found → ROOT CAUSE: unauthorized mutation

STEP 4: Check for non-determinism (RC-07)
  EXECUTE reconstruction 3 times
  COMPARE all 3 hashes
  IF any differ → ROOT CAUSE: non-deterministic computation

STEP 5: Record root cause
  root_cause_record = {
    divergence_id: "<ref>",
    root_cause_category: "RC-XX",
    evidence: "<specific finding>",
    affected_inputs: [list],
    affected_overlays: [list],
    recommended_action: "<action>"
  }
```

---

## 4. Ambiguity Detection

### 4.1 Five Ambiguity Types

| # | Type | Description | Severity |
|---|------|-------------|----------|
| AMB-01 | Incomplete inputs | One or more replay inputs cannot be retrieved | CRITICAL |
| AMB-02 | Contradictory resolutions | Conflict resolution record contradicts resolution rules | HIGH |
| AMB-03 | Unrecorded conflict | Domain+field overlap exists but no resolution recorded | HIGH |
| AMB-04 | Version mismatch | Configuration version at activation differs from current | MEDIUM |
| AMB-05 | Lineage gap | Lineage chain has missing segments | HIGH |

### 4.2 Ambiguity Detection Process

```
FUNCTION detectAmbiguity(input_inventory, activation_records):

  ambiguities = []

  // AMB-01: Incomplete inputs
  FOR each input in input_inventory:
    IF NOT retrievable(input):
      ambiguities.push({
        type: "AMB-01",
        input: input.id,
        detail: "Input not retrievable from artifact store"
      })

  // AMB-02: Contradictory resolutions
  FOR each conflict_resolution in input_inventory.resolutions:
    expected = computeResolution(conflict_resolution.inputs)
    IF conflict_resolution.outcome != expected:
      ambiguities.push({
        type: "AMB-02",
        conflict: conflict_resolution.id,
        recorded: conflict_resolution.outcome,
        computed: expected
      })

  // AMB-03: Unrecorded conflicts
  overlaps = detectAllOverlaps(input_inventory.overlays)
  recorded = input_inventory.resolutions.map(r => r.conflict_id)
  FOR each overlap in overlaps:
    IF overlap.id NOT IN recorded:
      ambiguities.push({
        type: "AMB-03",
        domain: overlap.domain,
        field: overlap.field,
        overlays: overlap.contributing_overlays
      })

  // AMB-04: Version mismatch
  IF input_inventory.params_version != activation_records.params_version:
    ambiguities.push({
      type: "AMB-04",
      parameter: "qualification_params",
      activation_version: activation_records.params_version,
      current_version: input_inventory.params_version
    })
  IF input_inventory.config_version != activation_records.config_version:
    ambiguities.push({
      type: "AMB-04",
      parameter: "governance_config",
      activation_version: activation_records.config_version,
      current_version: input_inventory.config_version
    })

  // AMB-05: Lineage gaps
  FOR each overlay in input_inventory.overlays:
    chain = getLineageChain(overlay)
    FOR i = 0 TO chain.length - 2:
      IF chain[i].output_hash != chain[i+1].input_hash:
        ambiguities.push({
          type: "AMB-05",
          overlay: overlay.package_id,
          gap_between: [chain[i].level, chain[i+1].level]
        })

  RETURN {
    ambiguous: ambiguities.length > 0,
    ambiguities: ambiguities,
    critical: ambiguities.filter(a => a.type == "AMB-01").length,
    high: ambiguities.filter(a => a.type IN ["AMB-02","AMB-03","AMB-05"]).length,
    medium: ambiguities.filter(a => a.type == "AMB-04").length
  }
```

### 4.3 Ambiguity Resolution Rules

| Ambiguity | Resolution | Can Proceed? |
|-----------|------------|-------------|
| AMB-01 (incomplete inputs) | Retrieve from backup or investigate loss | NO — certification blocked |
| AMB-02 (contradictory resolutions) | Re-evaluate with activation-time rules | NO — certification blocked until resolved |
| AMB-03 (unrecorded conflict) | Record resolution, verify determinism | NO — certification blocked until resolved |
| AMB-04 (version mismatch) | Document in certification record | YES — with WARNING annotation |
| AMB-05 (lineage gap) | Investigate provenance chain | NO — certification blocked for affected overlay |

---

## 5. Combined Divergence and Ambiguity Assessment

### 5.1 Assessment Matrix

```
IF ambiguity detected (CRITICAL):
  → Cannot proceed to reconstruction
  → CERTIFICATION STATUS: BLOCKED
  → Resolve ambiguity first

IF ambiguity detected (HIGH):
  → Cannot proceed to certification decision
  → CERTIFICATION STATUS: INVESTIGATION_REQUIRED
  → Resolve ambiguity, then re-certify

IF ambiguity detected (MEDIUM only):
  → Proceed to reconstruction with WARNING
  → Document version mismatches in certification record

IF divergence detected after reconstruction:
  → Root cause investigation mandatory
  → CERTIFICATION STATUS: DENIED (replay) or DENIED (rollback)
  → No promotion eligibility until resolved

IF no ambiguity AND no divergence:
  → Proceed to certification decision
  → CERTIFICATION STATUS: eligible for CERTIFIED
```

### 5.2 Escalation from Divergence/Ambiguity

| Condition | Escalation | Action |
|-----------|-----------|--------|
| CRITICAL ambiguity | G-4 | Sandbox freeze, full investigation |
| HIGH ambiguity | G-3 | Certification blocked, targeted investigation |
| MEDIUM ambiguity | G-1 | Warning in certification record |
| CRITICAL divergence | G-4 | Sandbox freeze, root cause investigation |
| HIGH divergence | G-3 | Certification denied, investigation |
| Root cause = RC-06 (unauthorized mutation) | G-4 | Security investigation |
| Root cause = RC-07 (non-determinism) | G-4 | Platform investigation |

---

## 6. Divergence and Ambiguity Records

### 6.1 Divergence Record

```json
{
  "divergence_record": {
    "record_id": "DIVR-<client>-<run_id>-<seq>",
    "timestamp": "<ISO-8601>",
    "certification_attempt": "RCERT-<ref> | RBCERT-<ref>",
    "type": "REPLAY_DIVERGENCE | ROLLBACK_DIVERGENCE",
    "severity": "CRITICAL | HIGH",
    "hash_comparison": {
      "reconstructed": "<sha256>",
      "current": "<sha256>"
    },
    "field_divergences": [],
    "metric_divergences": [],
    "root_cause": "RC-XX",
    "investigation_status": "OPEN | IN_PROGRESS | RESOLVED",
    "resolution": null
  }
}
```

### 6.2 Ambiguity Record

```json
{
  "ambiguity_record": {
    "record_id": "AMBR-<client>-<run_id>-<seq>",
    "timestamp": "<ISO-8601>",
    "certification_attempt": "RCERT-<ref> | RBCERT-<ref>",
    "ambiguities": [],
    "blocking": true,
    "resolution_required_by": "<ISO-8601>",
    "investigation_status": "OPEN | IN_PROGRESS | RESOLVED"
  }
}
```

---

## 7. Governance

- 4 divergence types classified by severity (CRITICAL, HIGH)
- 7 root cause categories with investigation protocol
- 5 ambiguity types with resolution rules
- CRITICAL ambiguity blocks certification entirely
- CRITICAL divergence triggers sandbox freeze and G-4 escalation
- Root cause investigation is mandatory for all divergence
- Unauthorized mutation (RC-06) triggers security investigation
- Non-determinism (RC-07) triggers platform investigation
- Combined assessment determines certification eligibility
- All divergence and ambiguity records are persistent and auditable
