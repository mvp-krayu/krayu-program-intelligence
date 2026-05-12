# Candidate Lineage and Authority Validation

**Stream:** PI.SQO.BLUEEDGE.SEMANTIC-CANDIDATE-EXTRACTION.01

---

## 1. Lineage Chain

```
Evidence Registry (EVREG-blueedge-run01-001)
  ├── EV-BE-001 (HTML_EVIDENCE_BRIEF)
  │   ├── 17 DOMAIN_GROUNDING_STATUS candidates
  │   ├── 5 STRUCTURAL_SIGNAL candidates
  │   └── 1 FOCUS_DOMAIN_DESIGNATION candidate
  ├── EV-BE-002 (HTML_GAUGE_ARTIFACT)
  │   └── 1 GAUGE_ARTIFACT_TITLE candidate
  ├── EV-BE-003 (HTML_DIAGNOSTIC_NARRATIVE)
  │   ├── 8 DIAGNOSTIC_SECTION candidates
  │   ├── 2 DIAGNOSTIC_DOMAIN_REFERENCE candidates
  │   └── 5 DIAGNOSTIC_CAPABILITY_REFERENCE candidates
  ├── EV-BE-004 (HTML_GAUGE_CLAIM)
  │   ├── 1 GAUGE_ARTIFACT_TITLE candidate
  │   ├── 1 GAUGE_METRIC_VALUE candidate
  │   └── 1 GAUGE_CLAIM_LABEL candidate
  └── EV-BE-005 (HTML_GAUGE_CLAIM)
      ├── 1 GAUGE_ARTIFACT_TITLE candidate
      ├── 1 GAUGE_METRIC_VALUE candidate
      └── 1 GAUGE_CLAIM_LABEL candidate
```

## 2. Hash Verification Chain

Every candidate carries its evidence_hash from the evidence registry. The extractor re-computes SHA-256 of the source file before extraction and verifies it matches the registered hash.

| Evidence ID | Registry Hash (first 16) | Computed Match |
|-------------|-------------------------|----------------|
| EV-BE-001 | 8d18f52a54205788... | YES |
| EV-BE-002 | 647e08b7a097adea... | YES |
| EV-BE-003 | ba3a782e4bca7107... | YES |
| EV-BE-004 | f32492ef7bcedfe8... | YES |
| EV-BE-005 | 7b2eb3307d2ae8bf... | YES |

## 3. Authority Validation

### 3.1 Authority State Enforcement

All 45 candidates carry:
```
authority_state: NON_AUTHORITATIVE_SEMANTIC_CANDIDATE
```

This is not a degraded or provisional state. It is the correct, intended, and permanent state for extracted candidates. Candidates do not become authoritative through extraction. They may only gain authority through Dynamic CEU admissibility evaluation in a future contract.

### 3.2 Next Gate Enforcement

All 45 candidates carry:
```
next_required_gate: DYNAMIC_CEU_ADMISSIBILITY_REQUIRED
```

No candidate may bypass this gate. The gate is enforced in the data model and rendered explicitly in the cockpit UI.

### 3.3 Governance Flags

| Flag | Value | Meaning |
|------|-------|---------|
| no_grounding_mutation | true | Extraction cannot change domain grounding |
| no_overlay_generation | true | Extraction cannot create overlays |
| no_qualification_mutation | true | Extraction cannot change S-state or Q-class |
| no_authority_assertion | true | Extraction cannot assert authority |
| no_lens_mutation | true | Extraction cannot modify LENS projection |
| extraction_only | true | Only candidate signal extraction |
| additive_only | true | No existing data modified |
| fail_closed | true | Any failure stops extraction |

## 4. Unmapped Candidate Handling

14 candidates could not be deterministically mapped to a single BlueEdge domain. These are marked as `UNMAPPED_CANDIDATE` and rendered in a separate visual section in the cockpit with explicit UNMAPPED badge. They are not hidden, suppressed, or force-mapped.

Unmapped candidate types:
- GAUGE_ARTIFACT_TITLE (1): Document title without single-domain scope
- DIAGNOSTIC_SECTION (8): Section titles spanning multiple domains
- DIAGNOSTIC_CAPABILITY_REFERENCE (5): Capability IDs not uniquely mapped to domains

## 5. No State Improvement

This contract extracts candidates only. No qualification state (S-state), domain grounding, overlay, or publication changed. The semantic debt inventory remains unchanged. The only new artifacts are the candidate extraction data (in memory, not persisted as artifacts) and the cockpit view.
