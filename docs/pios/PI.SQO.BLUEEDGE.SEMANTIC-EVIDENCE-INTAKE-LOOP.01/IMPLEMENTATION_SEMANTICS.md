# Implementation Semantics

**Stream:** PI.SQO.BLUEEDGE.SEMANTIC-EVIDENCE-INTAKE-LOOP.01
**Classification:** G2 (Architecture-Consuming)

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| `runIntakeLoop` | SemanticEvidenceIntakeLoop.js | Master intake loop: validate, classify, determine eligibility for all evidence | Reusable — any client with evidence registry |
| `emitIntakeArtifact` | SemanticEvidenceIntakeLoop.js | Write intake artifact to governed path | Reusable |
| `classifySource` | SemanticEvidenceIntakeLoop.js | Map source_type to source_class | Reusable |
| `validateEvidence` | SemanticEvidenceIntakeLoop.js | Hash-verify evidence file on disk | Reusable |
| `determineEligibility` | SemanticEvidenceIntakeLoop.js | Determine downstream operation eligibility per source class | Reusable |
| `processIntakeItem` | SemanticEvidenceIntakeLoop.js | Full intake processing for a single evidence item | Reusable |
| `scanRebaseEvidence` | SemanticEvidenceIntakeLoop.js | Discover and register explicit rebase evidence from client directory | Reusable |
| `projectEvidenceIntakeForRuntime` | EvidenceIntakeProjection.js | Transform intake artifact into 6-facet runtime projection | Reusable |

## 2. Input Contracts

### runIntakeLoop(inputs)

**inputs.evidenceRegistry** — `evidence_registry.v1.json`
- Consumed fields: `evidence_items[]` (evidence_id, source_type, source_path, evidence_hash, provenance_origin, authority_state, candidate_domains, file_size_bytes, description)
- Required: YES

**inputs.client** — Client identifier (e.g., 'blueedge')
- Required: YES

**inputs.runId** — Run identifier
- Required: YES

**inputs.includeRebase** — Whether to scan for explicit rebase evidence in client directory
- Required: NO (default behavior: no rebase scan)

### Rebase Evidence Scan Path
- `clients/{client}/sqo/evidence/` — scanned for `.html` and `.json` files in subdirectories

## 3. Output Contracts

### Intake Artifact Shape (`semantic_evidence_intake.v1.json`)
```
{
  schema_version, artifact_type, client, run_id, generated_at, compiler_version,
  intake_summary: { total_items, accepted_count, rejected_count, quarantined_count,
    all_valid, source_class_distribution, eligibility_counts, covered_domains,
    covered_domain_count, registry_items_count, rebase_items_count },
  items: [{ evidence_id, source_type, source_class, source_path, authority_state,
    candidate_domain_count, candidate_domains, provenance_origin, intake_status,
    rejection_reason, rejection_detail, hash_verified, computed_hash, expected_hash,
    file_size, eligible_operations, description }],
  accepted: [{ evidence_id, source_class, eligible_operations, candidate_domain_count }],
  rejected: [{ evidence_id, source_class, rejection_reason, rejection_detail }],
  quarantined: [{ evidence_id, source_class, rejection_reason, rejection_detail }],
  eligibility: { semantic_reconstruction, enrichment, reconciliation, lifecycle_progression },
  governance, provenance
}
```

### Runtime Projection Shape
```
{ summary, accepted[], rejected[], quarantined[], eligibility, provenance }
```

## 4. Calibration Assumptions

| Constant | Value | Nature |
|----------|-------|--------|
| SOURCE_CLASS enum | STRUCTURAL_EVIDENCE, GAUGE_ARTIFACT, DIAGNOSTIC_NARRATIVE, EXPLICIT_REBASE, CLIENT_UPLOAD, UNKNOWN | Governed classification vocabulary |
| INTAKE_STATUS enum | ACCEPTED, REJECTED, QUARANTINED | Fixed status set |
| REJECTION_REASON enum | HASH_MISMATCH, FILE_NOT_FOUND, PATH_VIOLATION, EMPTY_FILE, INVALID_SOURCE_TYPE | Fixed rejection vocabulary |
| ELIGIBLE_OPS enum | SEMANTIC_RECONSTRUCTION, ENRICHMENT, RECONCILIATION, LIFECYCLE_PROGRESSION | Fixed eligibility vocabulary |
| Eligibility matrix | STRUCTURAL_EVIDENCE → all 4; GAUGE → ENRICHMENT + RECONCILIATION; DIAGNOSTIC → ENRICHMENT only; REBASE → all 4 | Governed per source class |

## 5. Extension Points

- **SOURCE_TYPE_TO_CLASS mapping**: add new source types as evidence formats expand
- **Eligibility matrix**: modify `determineEligibility` for new operational eligibility types
- **Rejection reasons**: extensible vocabulary
- **Rebase scan**: currently scans `.html` and `.json` — extend for new formats
- **Multi-client**: parameterized by client/runId, works for any client with evidence registry

## 6. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| SemanticEvidenceIntakeLoop.js | Intake loop: validate, classify, accept/reject, determine eligibility |
| EvidenceIntakeProjection.js | Runtime projection: transforms artifact into consumable shapes |
| SQOCockpitArtifactLoader.js | Artifact registry: loads intake alongside SQO artifacts |
| SQOCockpitFormatter.js | Integration: includes intake projection in evidence replay section |
| compile_blueedge_evidence_intake.js | Compilation script: orchestrates BlueEdge-specific intake |
