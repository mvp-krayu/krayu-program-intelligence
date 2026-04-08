# PSEE Consumption Profile

stream: PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07
artifact: psee_consumption_profile
run_classification: MULTI-SOURCE STRUCTURAL RECONSTRUCTION (<=40.4 COMPLIANT)
layer_constraint: <=40.4
generated_date: 2026-04-08

---

## 1. Purpose and Position

This profile governs PSEE consumption of the Runtime Handoff Package (RHP) only.

It applies after `psee_runtime_handoff_contract.md`. That contract governs RHP construction and general consumption rules. This profile governs the specific evaluation permissions and restrictions that apply when PSEE acts as the consumer.

This profile defines evaluation permissions, not reconstruction permissions.

It does not authorize access to 41.x, 42.x, 51.x, or higher layers.

---

## 2. Input Package

PSEE MUST receive all of the following as mandatory input:

| File | Role |
|------|------|
| normalized_file_inventory.json | File enumeration |
| ceu_registry.json | CEU definitions |
| domain_structure.json | Domain groupings |
| overlap_registry.json | OVL-* declarations |
| unknown_space_registry.json | USP-* declarations |
| html_influence_map.json | HTML influence classification |
| structural_topology.json | Integrated topology |
| psee_runtime_handoff_contract.md | Consumption governance |

Rules:

- All inputs are read-only
- No partial input is allowed
- A missing input invalidates PSEE evaluation before any check proceeds

---

## 3. PSEE Role at <=40.4

PSEE at this layer is defined as:

- structural evaluator
- topology integrity evaluator
- provenance compliance evaluator
- overlap/unknown-space preservation evaluator

PSEE is NOT at this layer:

- capability evaluator
- narrative engine
- semantic reasoning engine
- architecture interpreter
- business meaning generator

Any PSEE output that crosses into the above roles is a governance violation.

---

## 4. Allowed Evaluation Objects

PSEE MAY evaluate only the following:

| Object | Allowed |
|--------|---------|
| Completeness of CEU coverage | YES |
| Domain-to-CEU structural consistency | YES |
| Overlap declaration presence and preservation | YES |
| Unknown-space declaration presence and preservation | YES |
| Provenance field completeness | YES |
| Dual-lens separation compliance | YES |
| Path consistency across artifacts | YES |
| Containment consistency across artifacts | YES |
| HTML influence traceability completeness | YES |

Rule: All evaluation must be field-traceable to explicit artifact content. No evaluation may depend on inferred, synthesized, or external content.

---

## 5. Forbidden Evaluation Objects

PSEE MUST NOT evaluate:

| Object | Reason |
|--------|--------|
| Functional purpose of domains or CEUs | Semantic inference |
| Capability maturity | 41.x+ scope |
| Business value | Out of layer |
| Product meaning | Out of layer |
| Architecture quality beyond structural integrity | Out of layer |
| Inferred parity where file_level_parity is UNKNOWN | Resolves unknown-space |
| Inferred resolution of USP-* entries | Resolves unknown-space |
| Semantic validity of labels | Semantic inference |
| Runtime behavior | 42.x scope |
| Demo fidelity at 42.x/51.x layers | 42.x/51.x scope |

---

## 6. PSEE Evaluation Dimensions

The following controlled dimensions are defined for PSEE at <=40.4.

---

### 6.1 Structural Completeness

What is checked:
- All 13 CEUs declared in normalized_evidence_map.md are present in ceu_registry.json
- All accepted CEUs appear in structural_topology.json
- Domain membership is consistent across domain_structure.json and structural_topology.json

Allowed evidence basis:
- ceu_registry.json
- structural_topology.json
- normalized_file_inventory.json

Forbidden expansion:
- No inference about missing CEUs
- No assessment of whether the CEU set is architecturally sufficient

---

### 6.2 Containment Consistency

What is checked:
- Sub-domain containment paths in domain_structure.json match physical path patterns declared for each CEU
- No domain references a path outside its declared CEU containment group
- Top-level subdirectory declarations are internally consistent

Allowed evidence basis:
- domain_structure.json
- ceu_registry.json
- normalized_file_inventory.json

Forbidden expansion:
- No assessment of whether containment reflects correct system architecture
- No inference about modules not listed in RHP

---

### 6.3 Provenance Completeness

What is checked:
- `source_origin` is present for every element that declares one
- `structural_topology_source` is present where required
- `documented_taxonomy_source` is present where required
- `label_provenance` is present where required
- No element has provenance collapsed to a single source where multi-source is declared

Allowed evidence basis:
- ceu_registry.json
- domain_structure.json
- structural_topology.json
- html_influence_map.json

Forbidden expansion:
- No inferred provenance for elements that lack it
- No reassignment of source_origin

---

### 6.4 Overlap Preservation

What is checked:
- OVL-01 and OVL-02 are present in overlap_registry.json
- `file_level_parity` is `UNKNOWN` for all OVL-* entries
- `resolution_status` is `UNRESOLVED` for all OVL-* entries
- Overlapping domains in structural_topology.json reference the correct OVL-* IDs
- Canonical preference assignments are present and unchanged

Allowed evidence basis:
- overlap_registry.json
- structural_topology.json
- domain_structure.json
- ceu_registry.json

Forbidden expansion:
- No scoring of UNKNOWN parity as a defect
- No resolution or equivalence inference

---

### 6.5 Unknown-Space Preservation

What is checked:
- USP-01, USP-02, USP-03 are present in unknown_space_registry.json
- `resolution_status` is `PERMANENTLY_UNRESOLVED` for all entries
- `inference_applied` is `false` for all entries
- Relevant domains and CEUs reference the correct USP-* IDs in structural_topology.json

Allowed evidence basis:
- unknown_space_registry.json
- structural_topology.json

Forbidden expansion:
- No scoring of unresolved unknown-space as incomplete execution
- No generation of substitute values

---

### 6.6 Dual-Lens Compliance

What is checked:
- `structural_topology_source` ≠ `documented_taxonomy_source` where the element has both
- No element has both lenses collapsed into a single field
- `label_provenance` is traceable to a declared source (HTML_DOCUMENTED, STRUCTURAL_CONTAINMENT, or NORMALIZED_EVIDENCE_MAP)
- HTML_DOCUMENTED influence in html_influence_map.json is consistent with CEU membership of HTML artifacts (CEU-01, CEU-02, CEU-03)

Allowed evidence basis:
- domain_structure.json
- ceu_registry.json
- html_influence_map.json
- structural_topology.json

Forbidden expansion:
- No merging of structural and taxonomy lenses in output
- No use of label to validate structural path

---

### 6.7 HTML Influence Traceability

What is checked:
- Every element in html_influence_map.json has a declared `html_influence` value (DIRECT / INDIRECT / NONE)
- DIRECT or INDIRECT entries reference at least one HTML source CEU (CEU-01, CEU-02, or CEU-03)
- NONE entries have empty `html_source_ceus`
- html_influence_map.json covers all domains present in structural_topology.json

Allowed evidence basis:
- html_influence_map.json
- ceu_registry.json
- structural_topology.json

Forbidden expansion:
- No inference about undeclared HTML influence
- No interpretation of label meaning from influence classification

---

## 7. Dual-Lens Enforcement for PSEE

PSEE MUST evaluate structural and taxonomy lenses independently.

**Structural Lens checks:**
- Paths declared in ceu_registry.json
- Containment in domain_structure.json
- CEU/domain relations in structural_topology.json
- Overlap placements in overlap_registry.json
- Unknown-space placements in unknown_space_registry.json

**Taxonomy Lens checks:**
- Documented labels in domain_structure.json and ceu_registry.json
- `documented_taxonomy_source` per element
- `label_provenance` per element
- HTML influence traceability in html_influence_map.json

PSEE MUST NOT:
- treat taxonomy labels as confirmation of structural correctness
- treat structural paths as confirmation of label validity
- merge both lenses into a single score or composite finding

If structural and taxonomy sources diverge for an element, PSEE must record the divergence explicitly — not resolve it.

---

## 8. Overlap Policy for PSEE

- OVL-* entries are admissible structural uncertainty markers
- `file_level_parity = UNKNOWN` is a valid terminal state at <=40.4
- PSEE MAY check that UNKNOWN is preserved and not overwritten
- PSEE MUST NOT score UNKNOWN as a failure
- PSEE MUST NOT convert overlap into equivalence or duplication truth
- Canonical preference assignments do not imply structural identity

---

## 9. Unknown-Space Policy for PSEE

- USP-* entries are admissible structural outputs
- Unresolved unknown-space is valid and expected at <=40.4
- PSEE MAY check:
  - presence of all declared USP-* entries
  - consistency of USP-* IDs referenced across artifacts
  - immutability — that no entry has been altered from its declared state
- PSEE MUST NOT:
  - penalize unresolved unknown-space as incomplete execution
  - attempt resolution of any USP-* entry
  - generate substitute or inferred values for unknown-space positions

---

## 10. Provenance Policy for PSEE

PSEE must validate all of the following:

- `source_origin` exists for every element that is required to carry it
- `structural_topology_source` exists where required
- `documented_taxonomy_source` exists where required
- `label_provenance` exists where required
- Provenance is not collapsed to a single source when multi-source is declared

PSEE MUST return FAIL if any of the following is detected:

- provenance field removed
- provenance field merged into a composite value
- provenance field overwritten with a non-declared value
- multi-source `source_origin` reduced to a single source
- `source_origin` contradicts `structural_topology_source` or `documented_taxonomy_source`

---

## 11. Output Class of PSEE at <=40.4

PSEE evaluation results at this layer may only be:

| Result | Meaning |
|--------|---------|
| PASS | All structural and governance criteria met |
| PARTIAL | Boundary rules respected; one or more checks blocked by admissible unresolved states |
| FAIL | One or more required criteria violated |

PSEE outputs MUST NOT contain:

- semantic conclusions
- architectural narratives
- capability claims
- product interpretations
- business recommendations

Any output field that cannot be traced to an explicit RHP field and a declared evaluation dimension is invalid.

---

## 12. Permitted PSEE Output Fields

PSEE output MAY include only the following field families:

| Field Family | Content |
|-------------|---------|
| `evaluation_scope` | Stream ID, layer, artifacts checked |
| `artifacts_checked` | List of RHP files evaluated |
| `fields_checked` | Specific field names evaluated per artifact |
| `pass_conditions` | Named conditions that passed |
| `failed_conditions` | Named conditions that failed, with artifact and field reference |
| `overlap_preservation_status` | PRESERVED / VIOLATED per OVL-* |
| `unknown_space_preservation_status` | PRESERVED / VIOLATED per USP-* |
| `provenance_integrity_status` | COMPLETE / INCOMPLETE / COLLAPSED per artifact |
| `dual_lens_compliance_status` | COMPLIANT / VIOLATION per element or artifact |
| `boundary_compliance_status` | COMPLIANT / VIOLATION |

Rule: All output fields must map to explicit checks declared in this profile.

---

## 13. Failure Conditions

PSEE MUST return FAIL if any of the following occur:

| Condition | Triggered By |
|-----------|-------------|
| Missing required RHP artifact | Any file absent from input package |
| Missing required provenance fields | source_origin, structural_topology_source, documented_taxonomy_source, or label_provenance absent where required |
| Provenance collapse detected | Multi-source origin reduced to single source |
| Overlap UNKNOWN overwritten or reinterpreted | file_level_parity changed from UNKNOWN |
| Unknown-space resolved or substituted | USP-* entry altered or replaced |
| Structural/taxonomy lens collapse detected | Both lenses merged into a single field or score |
| Cross-layer reference introduced | Any 41.x+, 42.x, or 51.x content referenced in evaluation |
| Semantic inference introduced | Any output based on inferred meaning rather than explicit field values |
| Capability grouping introduced | Any output grouping structural elements by inferred function |

---

## 14. Partial Conditions

PSEE MAY return PARTIAL only when:

- All boundary rules are respected
- Structural evaluation can proceed on available data
- One or more required structural checks are blocked by admissible unresolved states (USP-* or UNKNOWN parity)
- All unresolved states remain explicit and unchanged in the evaluation output

PARTIAL is not a license for inference. A PARTIAL result must:
- Name exactly which checks were blocked
- State the admissible unresolved state that caused the block
- Preserve all USP-* and OVL-* entries unchanged in output references

---

## 15. Pass Conditions

PSEE MAY return PASS only if all of the following hold:

- All required RHP artifacts are present
- All required provenance fields are present and internally consistent
- All structural relations are internally consistent across artifacts
- All OVL-* entries are preserved with `file_level_parity = UNKNOWN`
- All USP-* entries are preserved with `resolution_status = PERMANENTLY_UNRESOLVED`
- Dual-lens separation is preserved in all evaluated elements
- No forbidden operations occurred during evaluation
- No cross-layer leakage occurred

---

## 16. Relation to Higher Layers

- This profile does not authorize comparison with 41.x, 42.x, or 51.x outputs
- Any semantic, runtime, demo, or narrative evaluation requires a separate authorized stream
- A <=40.4 PASS does not imply demo fidelity
- A <=40.4 PASS does not imply capability correctness
- A <=40.4 PASS means only structural admissibility and governance compliance within the declared evidence boundary

---

## 17. Governance Statement

- This profile is mandatory for PSEE execution against the RHP
- Any downstream PSEE process operating without this profile is non-compliant
- Violation of this profile invalidates the evaluation result
- This profile operates under `psee_runtime_handoff_contract.md` and does not supersede it
- This profile operates under `docs/governance/runtime/git_structure_contract.md` and `docs/governance/runtime/reference_boundary_contract.md`

---

## 18. Execution Constraint

- This document defines evaluation consumption only
- It introduces no new evidence
- It modifies no existing artifact
- It does not reinterpret structural topology
- It does not authorize promotion to higher layers
- It does not resolve any declared unknown-space or overlap
