# Qualification Evidence Chain

**Stream:** PI.SEMANTIC-QUALIFICATION-LOOP.ROADMAP-AND-ARCHITECTURE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Purpose

This document defines the evidence chain model for SQO qualification — how every qualification assertion traces back to source evidence, how provenance is maintained across enrichment cycles, and where certification boundaries are drawn.

An evidence chain is a directed, auditable path from a qualification assertion (e.g., "this client is at S2") back to the specific artifact fields that justify that assertion. No qualification assertion is valid without a complete evidence chain.

---

## 2. Evidence chain structure

### 2.1 Chain elements

Every evidence chain consists of four element types:

**Source evidence:** The raw artifact field that provides the ground truth.
```
semantic_topology_model.domains[2].lineage_status = "EXACT"
```

**Derivation step:** A deterministic operation that transforms source evidence into a higher-level assertion.
```
count(domains where lineage_status in ["EXACT", "STRONG"]) → backed_count = 4
```

**Qualification assertion:** The SQO-level statement derived from the evidence chain.
```
domain_grounding_ratio = 4/17 = 0.235 → Q-02
```

**Governance classification:** The governance-level outcome derived from the qualification assertion.
```
Q-02 → AUTHORIZED_WITH_QUALIFICATION → "QUALIFIER Q-02 · Partial Grounding · Structural Continuity"
```

### 2.2 Chain directionality

Evidence chains flow in one direction: from source evidence upward to governance classification.

```
Source Evidence (L1/L2)
    │
    ▼
Derivation Step (deterministic)
    │
    ▼
Qualification Assertion (L4 - SQO)
    │
    ▼
Governance Classification (L3 - executive)
```

No reverse flow. Governance classifications never modify source evidence. Qualification assertions never alter derivation logic. Derivation steps never mutate source artifacts.

### 2.3 Chain completeness

An evidence chain is **complete** when every assertion can be traced to at least one source evidence field through one or more derivation steps.

An evidence chain is **incomplete** when an assertion exists without a traceable derivation path. Incomplete chains produce UNKNOWN qualification states.

---

## 3. Evidence chain for each S-state

### S0: STRUCTURAL_ONLY

```
Chain: manifest.artifacts.required.semantic_topology_model = absent
       → detectQualificationState returns S0
       → projection: NOT_AUTHORIZED (report-pack only)
```

Evidence required: manifest file (presence/absence of semantic_topology_model declaration).

### S1: STRUCTURAL_LABELS_ONLY

```
Chain: manifest.artifacts.required.semantic_topology_model = present
       + loadArtifacts(manifest).error = 'REQUIRED_ARTIFACT_MISSING'
       → detectQualificationState returns S1
       → projection: NOT_AUTHORIZED (LIVE_BINDING_FAILED)
```

Evidence required: manifest file + artifact loader result.

Specific missing artifacts recorded:
```
loadResult.missingArtifacts = [
  { key: "decision_validation", path: "...", impact: "CRITICAL" },
  { key: "reproducibility_verdict", path: "...", impact: "CRITICAL" },
  { key: "semantic_continuity_crosswalk", path: "...", impact: "CRITICAL" }
]
```

### S2: PARTIAL_GROUNDING_WITH_CONTINUITY

```
Chain: loadArtifacts(manifest).ok = true
       + resolveSemanticPayload(manifest).qualifier_summary.qualifier_class = 'Q-02'
       → backed_count/total_count where 0 < ratio < 1.0
       + semantic_continuity_status = 'VALIDATED'
       + evidence_availability = 'AVAILABLE'
       → detectQualificationState returns S2
       → projection: AUTHORIZED_WITH_QUALIFICATION
```

Evidence required: all 6 required artifacts + Q-class resolution inputs (backed_count, total_count, semantic_continuity_status, evidence_availability).

### S3: SEMANTICALLY_GOVERNABLE

```
Chain: loadArtifacts(manifest).ok = true
       + resolveSemanticPayload(manifest).qualifier_summary.qualifier_class = 'Q-01'
       → backed_count == total_count
       + semantic_continuity_status = 'VALIDATED'
       + evidence_availability = 'AVAILABLE'
       → detectQualificationState returns S3
       → projection: FULLY_AUTHORIZED
```

Evidence required: all 6 required artifacts + Q-01 resolution (all domains structurally grounded).

---

## 4. Evidence chain for maturity dimensions

Each maturity dimension (D1-D7 from SEMANTIC_MATURITY_MODEL.md) has its own evidence chain:

### D1: Artifact Completeness

```
Source: manifest.artifacts.required[key] → file exists on disk (yes/no)
Derivation: count(present_required_artifacts) / total_required_count
Assertion: artifact_completeness = N/6
```

### D2: Domain Grounding

```
Source: semantic_topology_model.domains[i].lineage_status
Derivation: count(EXACT or STRONG) / total_domains
Assertion: domain_grounding = backed/total
```

### D3: Semantic Continuity

```
Source: semantic_continuity_crosswalk.validation_status
Derivation: direct read (binary)
Assertion: semantic_continuity = VALIDATED | NOT_VALIDATED
```

### D4: Decision Validation

```
Source: decision_validation.validation_functions[i].status
Derivation: count(PASS) / total_functions; overall = all PASS
Assertion: decision_validation = passed/total
```

### D5: Reproducibility

```
Source: reproducibility_verdict.criteria[i].status
Derivation: all criteria PASS → FULL_REPRODUCIBILITY
Assertion: reproducibility = FULL | PARTIAL | ABSENT
```

### D6: Business Label Coverage

```
Source: semantic_topology_model.domains[i].domain_name
Derivation: count(non-structural-ID names) / total_domains
Assertion: business_label_coverage = labeled/total
```

### D7: Rendering Metadata

```
Source: rendering_metadata.integrity_protection_status
Derivation: direct read
Assertion: rendering_metadata = ENFORCED | PLACEHOLDER | ABSENT
```

---

## 5. Provenance rules

### Rule P-01: Input hash anchoring

Every SQO artifact must record the sha256 hashes of all source artifacts it consumed. This anchors the provenance chain cryptographically.

```json
{
  "provenance": {
    "input_hashes": {
      "semantic_topology_model": "sha256:...",
      "decision_validation": "sha256:...",
      "reproducibility_verdict": "sha256:...",
      "semantic_continuity_crosswalk": "sha256:...",
      "canonical_topology_40_4": "sha256:...",
      "dpsig_signal_set": "sha256:..."
    }
  }
}
```

### Rule P-02: Operation traceability

Every SQO artifact must record which operation produced it and the operation version.

```json
{
  "provenance": {
    "operation": "detect_qualification_state",
    "operation_version": "1.0",
    "timestamp": "<ISO-8601>"
  }
}
```

### Rule P-03: Output hash

Every SQO artifact must carry its own sha256 hash for integrity verification.

```json
{
  "provenance": {
    "output_hash": "sha256:..."
  }
}
```

### Rule P-04: Version linkage

When an SQO artifact supersedes a prior version, it must reference the prior version:

```json
{
  "provenance": {
    "prior_version": "maturity_score.v1.json",
    "prior_hash": "sha256:..."
  }
}
```

### Rule P-05: Cross-artifact reference

When one SQO artifact references another SQO artifact, it must reference the specific version and hash:

```json
{
  "provenance": {
    "referenced_sqo_artifacts": {
      "qualification_state": {
        "artifact": "qualification_state.v2.json",
        "hash": "sha256:..."
      }
    }
  }
}
```

---

## 6. Certification boundaries

### 6.1 What certification covers

Certification is the formal assertion that a qualification assessment is:
- **Evidence-complete:** Every assertion has a complete evidence chain
- **Deterministic:** Re-execution produces identical results
- **Provenance-intact:** All input hashes match current artifact state
- **Governance-compliant:** No SQO constraint violated

### 6.2 Certification scope

Certification applies to a specific (client, run_id, timestamp) tuple. It does not certify across clients. It does not certify across time — a certification is valid only as long as the underlying evidence remains unchanged.

### 6.3 Certification artifact

```json
{
  "schema_version": "1.0",
  "certification_type": "qualification_assessment",
  "client": "<client_id>",
  "run_id": "<run_id>",
  "timestamp": "<ISO-8601>",
  "certified_artifacts": [
    {
      "artifact": "qualification_state.v2.json",
      "hash": "sha256:...",
      "evidence_chain_complete": true,
      "determinism_verified": true,
      "provenance_intact": true,
      "governance_compliant": true
    }
  ],
  "overall_verdict": "CERTIFIED | NOT_CERTIFIED",
  "failure_reasons": []
}
```

### 6.4 Certification invalidation

A certification becomes invalid when:
- Any source artifact changes (input hash mismatch)
- The SQO operation version changes
- The governance model changes (e.g., new Q-class rules)
- The certification artifact itself is modified

Invalidation is detected by re-running the replay verification protocol (REPLAY_SAFE_ENRICHMENT_MODEL.md §4).

### 6.5 Certification boundaries

| In scope | Out of scope |
|----------|-------------|
| SQO qualification assessment | Lane A structural derivation |
| Maturity scoring | DPSIG signal derivation |
| Semantic debt inventory | Pipeline execution |
| Enrichment recommendations | Q-class resolution logic |
| Governance disclosure | Resolver behavior |

SQO certifies its own outputs. It does not certify the source pipeline or the resolver. Source pipeline certification is the responsibility of the pipeline_execution_manifest. Resolver behavior certification is the responsibility of E2E tests.

---

## 7. Evidence chain for governance disclosures

### Q-02 disclosure chain

```
Source: semantic_topology_model.qualifier_summary.backed_count = 4
        semantic_topology_model.qualifier_summary.total_count = 17
        semantic_continuity_crosswalk.validation_status = 'VALIDATED'
Derivation: 4/17 = 0.235 (partial), continuity VALIDATED → Q-02
Assertion: AUTHORIZED_WITH_QUALIFICATION
Disclosure: "QUALIFIER Q-02 · Partial Grounding · Structural Continuity"
Executive note: "Advisory confirmation required for executive commitment on partially grounded domains."
Unresolved gaps: [list of 13 ungrounded domains with their structural IDs]
```

Every word in the executive disclosure traces back to a specific artifact field. "Partial Grounding" → backed_count < total_count. "Structural Continuity" → semantic_continuity_status = VALIDATED.

### Q-04 disclosure chain

```
Source: evidence_availability = 'UNAVAILABLE'
Derivation: unavailable → Q-04
Assertion: NOT_AUTHORIZED
Disclosure: "Withheld · evidence unavailable"
```

### S1 rejection chain

```
Source: loadArtifacts(manifest).error = 'REQUIRED_ARTIFACT_MISSING'
        loadArtifacts(manifest).missingArtifacts = [keys...]
Derivation: missing required artifacts → binding REJECTED
Assertion: NOT_AUTHORIZED (S1)
Disclosure: "LIVE_BINDING_FAILED — required semantic artifacts missing: [key1, key2, key3]"
```

---

## 8. Governance constraints

1. Every qualification assertion must have a complete evidence chain. Assertion without evidence → INVALID.
2. Evidence chains are auditable. Any auditor must be able to follow the chain from assertion to source evidence.
3. Evidence chains are immutable once certified. Modifying a certified chain invalidates the certification.
4. Provenance records are mandatory on all SQO artifacts. No provenance → no validity.
5. Certification is scoped to (client, run_id, timestamp). No cross-client, no cross-time certification.
6. Certification invalidation must be detectable by replay verification.
7. No evidence chain may reference data not traceable to Lane A, Lane D, or the semantic processing pipeline.
8. Evidence chains must not include AI-generated or AI-inferred links. Every link must be a deterministic derivation from source artifact fields.
