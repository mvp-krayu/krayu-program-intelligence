# Evidence Lineage and Replay Binding

**Stream:** PI.SQO.EVIDENCE-INTAKE-AND-PACKAGING-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define how evidence lineage preserves the complete transformation
history from external source through qualification influence — and
how replay binding ensures every evidence-derived state is
deterministically reconstructable.

---

## 2. Lineage Chain Architecture

### 2.1 Six-Layer Lineage Model

```
L0: External Source
    │  source_authority, source_hash, source_type
    │  (outside SQO governance boundary)
    ▼
L1: Intake Registration
    │  intake_id, source_ref, trust_level, classification
    │  (crosses governance boundary)
    ▼
L2: Package Entry
    │  package_id, entry_id, semantic_class, claim_type
    │  (structured, governed evidence container)
    ▼
L3: Overlay Activation
    │  activation_lifecycle, phase_records, composite_contribution
    │  (sandbox state modified)
    ▼
L4: Qualification Influence
    │  backed_count_delta, grounding_delta, debt_resolution
    │  (qualification metrics changed)
    ▼
L5: Certification/Publication
    │  certification_record, publication_record, authority_disclosure
    │  (evidence becomes published authority)
```

### 2.2 Lineage Invariant

**Every value at L5 (published authority) must be traceable through
L4, L3, L2, L1, to L0 (external source) without any hidden
transformation.**

If any lineage link is broken, the downstream authority is
indeterminate and must be quarantined until lineage is restored.

---

## 3. Per-Layer Lineage Records

### 3.1 L0 → L1: Source-to-Intake Lineage

```json
{
  "lineage_L0_L1": {
    "source_ref": "SRC-001",
    "source_authority": "FastAPI core maintainers",
    "source_type": "ADR",
    "source_hash": "sha256:abc123...",
    "source_location": "<path or reference>",
    "intake_id": "INT-001",
    "trust_level": "TRUSTED",
    "classification_timestamp": "<ISO-8601>",
    "operator": "<operator identity>",
    "transformation": "NONE — raw source registered as-is"
  }
}
```

### 3.2 L1 → L2: Intake-to-Package Lineage

```json
{
  "lineage_L1_L2": {
    "intake_id": "INT-001",
    "package_id": "SEP-blueedge-CLU-04-004",
    "entry_id": "SEP-ENTRY-001",
    "extraction_method": "DIRECT_CITATION",
    "evidence_basis": "ADR section 3.2: 'Module X implements payment processing'",
    "claim_type": "LABEL_ASSIGNMENT",
    "target_domain": "DOM-05",
    "semantic_class": "TECHNICAL",
    "confidence_basis": "DIRECT_CITATION",
    "transformation": "Structural extraction — claim derived from specific source passage"
  }
}
```

### 3.3 L2 → L3: Package-to-Activation Lineage

```json
{
  "lineage_L2_L3": {
    "package_id": "SEP-blueedge-CLU-04-004",
    "entry_id": "SEP-ENTRY-001",
    "activation_lifecycle": "Phase 0–7 completed",
    "activation_timestamp": "<ISO-8601>",
    "composite_contribution": {
      "field": "domain_label",
      "value": "Payment Processing",
      "attribution": "OVERLAY (SEP-blueedge-CLU-04-004, SEP-ENTRY-001)"
    },
    "transformation": "Overlay application — entry applied to composite state per deterministic order"
  }
}
```

### 3.4 L3 → L4: Activation-to-Qualification Lineage

```json
{
  "lineage_L3_L4": {
    "package_id": "SEP-blueedge-CLU-04-004",
    "entry_id": "SEP-ENTRY-001",
    "qualification_impact": {
      "backed_count_before": 7,
      "backed_count_after": 8,
      "backed_count_delta": 1,
      "grounding_ratio_before": 0.412,
      "grounding_ratio_after": 0.471,
      "debt_items_resolved": ["DEBT-DOM-05-grounding"]
    },
    "transformation": "Qualification re-evaluation — composite state recomputed with overlay contributions"
  }
}
```

### 3.5 L4 → L5: Qualification-to-Publication Lineage

```json
{
  "lineage_L4_L5": {
    "qualification_state": "S2, Q-02, 8/17 backed",
    "certification_record": "CERT-002",
    "certification_level": "OVERLAY_VERIFIED",
    "publication_record": "PUB-002",
    "disclosed_overlays": ["SEP-blueedge-CLU-04-004"],
    "authority_boundary": "Overlay-contributed authority — not pipeline-certified",
    "transformation": "Certification review — overlay verified through replay/rollback proof"
  }
}
```

---

## 4. Lineage Verification

### 4.1 Three Audit Directions

| Direction | Question | Method |
|-----------|----------|--------|
| Forward audit | Given source SRC-001, what authority does it produce? | Trace L0 → L1 → L2 → L3 → L4 → L5 |
| Backward audit | Given published authority PUB-002, where did it come from? | Trace L5 → L4 → L3 → L2 → L1 → L0 |
| Attribution audit | Given composite metric backed_count=8, which overlays contribute? | Query L3 → L2 → L1 → L0 for each contributing entry |

### 4.2 Lineage Completeness Check

```
FOR each published authority claim:
  VERIFY L5 record exists with certification reference
  VERIFY L4 record exists with qualification impact
  VERIFY L3 record exists with activation lifecycle
  VERIFY L2 record exists with package entry
  VERIFY L1 record exists with intake registration
  VERIFY L0 reference exists with source hash

  IF any layer missing:
    → LINEAGE_BROKEN
    → Authority claim is INDETERMINATE
    → Must quarantine until lineage restored
```

### 4.3 Lineage Integrity Hash

```
lineage_hash = sha256(
  L0.source_hash +
  L1.intake_id +
  L2.package_id + L2.entry_id +
  L3.activation_timestamp +
  L4.qualification_impact_hash +
  L5.certification_record
)
```

The lineage hash provides a single verifiable proof that the
complete chain from source to publication is intact.

---

## 5. Replay Binding Model

### 5.1 Replay Binding Definition

Replay binding is the contractual guarantee that any evidence-derived
state can be deterministically reconstructed from its inputs.

### 5.2 Six Replay Binding Properties

| Property | Guarantee |
|----------|----------|
| Source determinism | Same source material (same hash) produces same extraction |
| Extraction determinism | Same extraction rules on same source produce same entries |
| Application determinism | Same entries applied in same order produce same composite |
| Qualification determinism | Same composite produces same qualification metrics |
| Revocation determinism | Removing an entry produces the same state as never having applied it |
| Certification determinism | Same replay/rollback proof produces same certification decision |

### 5.3 Replay Binding Verification

```
REPLAY VERIFICATION:
  1. Record inputs: certified baseline + ordered overlay set + versions
  2. Compute composite state (first pass)
  3. Hash composite state → H1
  4. Compute composite state (second pass, same inputs)
  5. Hash composite state → H2
  6. ASSERT H1 == H2 (deterministic)

  IF H1 != H2:
    → REPLAY_DIVERGENCE
    → Freeze sandbox
    → Escalate to G-4
    → Investigate non-determinism source
```

### 5.4 Replay Binding for Evidence Intake

At the intake level, replay binding means:

| Intake Phase | Replay Binding |
|-------------|---------------|
| Source Discovery | Source exists at stated location (or hash-verified copy retained) |
| Source Classification | Same source always classifies to same type (deterministic taxonomy) |
| Trust Assessment | Same criteria evaluation produces same trust level |
| Evidence Extraction | Same source produces same extracted claims (no interpretation) |
| Normalization | Same extracted claims normalize to same SEP entries |
| Provenance Binding | Same chain produces same provenance hash |
| Intake Registration | Same evidence always gets same registration (idempotent) |

---

## 6. Hidden Transformation Prevention

### 6.1 Forbidden Transformations

| Transformation | Why Forbidden |
|---------------|--------------|
| Unstated summarization | Changes evidence meaning without audit trail |
| Unstated aggregation | Combines evidence without attribution |
| Unstated inference | Adds meaning not present in source |
| Silent enrichment | Adds fields without provenance |
| Implicit ranking | Assigns importance without criteria |
| Format-dependent extraction | Different formats produce different claims from same content |
| Context injection | Adds context not present in source material |

### 6.2 Permitted Transformations

| Transformation | Why Permitted | Requirement |
|----------------|-------------|-------------|
| Format normalization | Raw source → canonical SEP entry format | Deterministic, reversible |
| Hash computation | Raw bytes → sha256 hash | Deterministic, standard algorithm |
| Structural extraction | Source passage → specific claim | Explicit evidence_basis recorded |
| Confidence classification | Source → DIRECT_CITATION/STRONG_INFERENCE/CONTEXTUAL_DERIVATION | Criteria-based, deterministic |
| Domain mapping | Source reference → DOM-NN target | Topology model is deterministic |

### 6.3 Transformation Audit

Every permitted transformation is recorded in the lineage chain.
No transformation may occur without producing a lineage record
at the appropriate layer.

---

## 7. Lineage Persistence

### 7.1 Artifact Structure

```
artifacts/sqo/<client>/<run_id>/evidence_lineage/
├── lineage_L0_sources.json        (all source records)
├── lineage_L1_registrations.json  (all intake registrations)
├── lineage_L2_packages.json       (all package entry mappings)
├── lineage_L3_activations.json    (all activation records)
├── lineage_L4_qualifications.json (all qualification impacts)
├── lineage_L5_publications.json   (all publication records)
└── lineage_integrity.json         (per-chain lineage hashes)
```

### 7.2 Lineage Retention

| Retention Rule | Description |
|---------------|------------|
| Active lineage | Retained for all ACTIVATED overlays |
| Revoked lineage | Retained for audit trail (never deleted) |
| Quarantined lineage | Retained for investigation |
| Published lineage | Retained permanently (published authority) |

---

## 8. Governance

- 6-layer lineage model traces evidence from external source to published authority
- 3 audit directions (forward, backward, attribution) are always satisfiable
- Lineage integrity hash provides single-value chain verification
- 6 replay binding properties guarantee deterministic reconstruction
- Hidden transformations are explicitly forbidden with 7 prohibited categories
- All permitted transformations produce lineage records
- Lineage is retained for all evidence states (active, revoked, quarantined, published)
- Broken lineage quarantines downstream authority claims
