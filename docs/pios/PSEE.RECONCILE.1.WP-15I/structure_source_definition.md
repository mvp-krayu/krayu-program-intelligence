# Structure Source Definition — WP-15I

stream:   PSEE.RECONCILE.1.WP-15I
evidence: WP-15E execution log · WP-15F structure_source_report · WP-15G structural_emission_decision · WP-15H execution_report
commit:   ce512fc

---

## TASK 1 — NEGATIVE DEFINITION

The following are explicitly NOT valid structure sources.

### 1.1 Telemetry VAR_* Maps

**Evidence**: telemetry_baseline.json — 20 keys: VAR_AT (6), VAR_DT (4), VAR_ST (10); value types: int (13), null (7)

| Exclusion Reason | Violated Principle |
|---|---|
| Contains only scalar metric measurements — no arrays of objects, no cross-key references | Evidence-First: no explicit topology declaration present |
| Prefix groupings (VAR_AT, VAR_DT, VAR_ST) are measurement categories, not domain/entity declarations | Admissibility: mapping prefixes to domains requires semantic inference — forbidden |
| Null values carry no structural information | Determinism: null → topology mapping is undefined and non-reproducible |

**Verdict**: EXCLUDED. Confirmed by WP-15E STRUCTURE_SOURCE=NONE.

---

### 1.2 Signal Outputs

**Evidence**: WP-15F scan — signal_output.json, signal_validation_report.json, signal_traceability_map.json across 40.5–40.11: all NO_STRUCTURE

| Exclusion Reason | Violated Principle |
|---|---|
| Signals are DERIVED outputs of SIGNAL_DERIVATION — they are downstream of topology, not upstream | Evidence-First: signals presuppose topology; using them to define topology is circular |
| Signal severity and bound_count are computed from the topology they would need to define | Admissibility: output artifact of pipeline stage cannot be re-ingested as input source of that same pipeline |
| CRITICAL + bound_count=0 in authoritative_state.json is precisely the result of absent topology — it is evidence of the gap, not a definition of structure | Determinism: circular binding produces non-reproducible state |

**Verdict**: EXCLUDED. Confirmed by WP-15F NO_STRUCTURE classification.

---

### 1.3 Validation Reports

**Evidence**: WP-15F scan — signal_validation_report.json, condition_validation_report.json, intelligence_validation_report.json, delivery_validation_report.json, feedback_validation_report.json, closure_validation_report.json: all NO_STRUCTURE

| Exclusion Reason | Violated Principle |
|---|---|
| Validation reports record PASS/FAIL verdicts against execution contracts — they contain no topology declarations | Evidence-First: validation is audit; it does not author structural truth |
| Validation reports are produced by validators, which are downstream governance artifacts | Admissibility: governance artifacts cannot become upstream structural authority without formal promotion |

**Verdict**: EXCLUDED.

---

### 1.4 Lineage / Traceability Reports

**Evidence**: WP-15F scan — signal_traceability_map.json, condition_traceability_map.json, intelligence_traceability_map.json, delivery_traceability_map.json, feedback_traceability_manifest.json, control_traceability_manifest.json: all NO_STRUCTURE

| Exclusion Reason | Violated Principle |
|---|---|
| Lineage reports trace execution provenance — they reference topology but do not declare it | Evidence-First: reference ≠ declaration |
| Traceability maps are read-only audit artifacts produced after execution; they cannot be valid inputs to the pipeline that produced them | Admissibility: same-run circular dependency |

**Verdict**: EXCLUDED.

---

### 1.5 UI Projections

| Exclusion Reason | Violated Principle |
|---|---|
| UI panels render topology for display — they consume authoritative_state.json and do not author it | Admissibility: L6/L7 runtime layer cannot become upstream Core truth (git_structure_contract.md §9) |
| UI may apply rendering transforms, abbreviations, or layout decisions that do not exist in raw structure | Determinism: UI rendering is non-canonical; re-ingesting it would import display-layer decisions as structural fact |

**Verdict**: EXCLUDED.

---

### 1.6 Documentation Artifacts

| Exclusion Reason | Violated Principle |
|---|---|
| docs/pios/ outputs are execution reports, governance records, and closure documents — prose descriptions of pipeline behavior, not structured data declarations | Evidence-First: narrative description of topology ≠ explicit topology declaration |
| Documentation may describe intent, decisions, or observed state — none of which constitutes an executable structural source | Admissibility: prose cannot be parsed deterministically into topology |

**Verdict**: EXCLUDED.

---

## TASK 2 — REQUIRED PROPERTIES

A valid AUTHORITATIVE_STRUCTURE_SOURCE MUST satisfy ALL of the following:

### 2.1 Explicit Topology Declaration

The source MUST contain all three structural keys at top level, each as a non-empty list:

```
domains:       non-empty list of strings
entities:      non-empty list of objects with "name" (string) and "domain" (string)
relationships: non-empty list of objects with "from" (string), "to" (string), "type" (string)
```

Partial declarations are NOT accepted. A source with only `domains` and `entities` but no `relationships` is not admissible. The full topology triad is required.

### 2.2 Client Scope Binding

The source MUST be located at or promoted into the client-scoped intake path:

```
clients/<uuid>/input/intake/
```

Cross-client structural sources are not admissible. Each client binding requires a client-scoped intake artifact.

### 2.3 Deterministic Reproducibility

The source MUST produce identical topology output when processed by the STRUCTURE_EMITTER under identical conditions. This requires:

- Static file content (no runtime-variable fields)
- No timestamps, nonces, or execution-context-dependent values in the structural arrays
- Provenance hash computed over file content — same file → same hash → same manifest

### 2.4 Traceability

The emitted `structure_manifest.json` MUST record:

```
provenance_hash:  SHA-256 of source file content
source_file:      filename of the structural source
source_class:     "AUTHORITATIVE_STRUCTURE_SOURCE"
stream:           PSEE.RECONCILE.1.WP-15I (or successor)
```

The intake_manifest.json MUST be updated (or a new admissibility layer added) so that the pipeline provenance hash covers BOTH `telemetry_baseline.json` AND the structural source.

### 2.5 Non-Derivation Constraint

The source MUST NOT be produced by:

- Analyzing VAR_* metric prefix patterns
- Inferring entity names from signal identifiers
- Applying heuristics to any existing pipeline output
- Transforming validation report content into structural form

The source MUST be authoritative and self-standing. It contains the structure because the structure exists in that source, not because it was derived from another artifact.

### 2.6 Execution Origin

The source MUST be produced by, or validated through, an executable governance stage — not authored by direct manual JSON editing without a governing script. This ensures:

- The source has a defined validator
- The source can be reproduced (via the governance stage) in a fresh environment
- The pipeline can verify the source against its declared schema before admitting it

---

## TASK 3 — SOURCE CANDIDATE ENUMERATION

### OPTION_S1 — SYSTEM OF RECORD

**Definition**: Structure originates from an external authoritative system — an architecture model, CMDB, service graph, or dependency registry — that declares program topology explicitly.

| Criterion | Assessment |
|---|---|
| Evidence-First compliance | YES — if the external system is the designated source of truth for program structure, its exports are primary evidence |
| Determinism | YES — same export from same system state → same topology |
| Operational feasibility | LOW — requires: (a) external system access, (b) export format contract, (c) new integration adapter, (d) governance promotion of the external system as authoritative source |

**Admissibility requirements**:
- External system must be formally declared as SYSTEM_OF_RECORD for this client
- Export must be committed into `clients/<uuid>/input/intake/` via a governed promotion script
- Export format must comply with required structural schema (domains/entities/relationships)
- Provenance hash must cover the export file

**Pros**: True upstream authority; independent of IG pipeline artifacts.
**Cons**: Requires external system dependency; adds integration surface; not immediately available.

---

### OPTION_S2 — INGESTION STAGE EMISSION

**Definition**: A new stage in the IG pipeline (40.x or adjacent) consumes raw intake PLUS an additional structural feed and emits structure explicitly as part of the ingestion output.

| Criterion | Assessment |
|---|---|
| Evidence-First compliance | YES — if the additional structural feed is an authoritative input, the emitted structure is traceable to that input |
| Determinism | YES — same raw intake + same structural feed → same emitted structure |
| Operational feasibility | MED — requires: (a) new IG pipeline stage, (b) new structural feed input, (c) contract for that stage, (d) the "structural feed" still requires an external or client-provided source |

**Admissibility requirements**:
- New IG stage must have its own stream contract
- Stage must be deterministic and independently replayable
- The structural feed input to that stage must itself qualify as S1 or S3 — S2 defers the source question one layer; it does not resolve it
- Output must be promoted to `clients/<uuid>/input/intake/` as a governed artifact

**Pros**: Integrates structure emission into the canonical pipeline.
**Cons**: Defers the root source question — the stage still requires an upstream structural input that must be S1 or S3; adds pipeline complexity without resolving the origin problem.

---

### OPTION_S3 — CLIENT-PROVIDED STRUCTURE PACKAGE

**Definition**: The client explicitly provides a structure file declaring their program topology. The file is validated through a governed intake script and promoted into `clients/<uuid>/input/intake/structure_manifest.json`.

| Criterion | Assessment |
|---|---|
| Evidence-First compliance | YES — the client is the authoritative source of their own program structure; explicit declaration by the source of truth |
| Determinism | YES — same provided file → same structure; no computation required |
| Operational feasibility | HIGH — requires only: (a) client-provided JSON file, (b) validation by emit_structure_manifest.py (already built in WP-15H), (c) commitment to intake path |

**Admissibility requirements**:
- File must be deposited at `clients/<uuid>/input/intake/` under a governed path
- File must contain non-empty `domains`, `entities`, `relationships` arrays
- File must pass `STRUCTURE_VALIDATION` stage in `emit_structure_manifest.py`
- `emit_structure_manifest.py` produces `structure_manifest.json` — the pipeline-admissible form
- Provenance hash covers both structural source and telemetry_baseline.json

**Pros**: Immediately actionable; no external system integration required; client knows their own program structure; scales to all clients without system dependency; STRUCTURE_EMITTER (WP-15H) is already implemented and ready.
**Cons**: Depends on client to provide accurate structure; validation cannot verify domain accuracy against an external authority, only schema compliance.

---

## TASK 4 — SELECTION

**STRUCTURE_SOURCE = S3**

### Justification

1. The client is the authoritative source of their own program structure — explicit client declaration satisfies Evidence-First without requiring external system integration.
2. S1 requires an external system of record that does not currently exist in this pipeline's operational scope; adding it would block resolution indefinitely.
3. S2 defers the source question rather than resolving it — the IG stage it introduces still requires an S1 or S3 input to function; it adds complexity without closing the evidence gap.
4. S3 is the only option that is immediately actionable given the current pipeline state: `emit_structure_manifest.py` (WP-15H) is already implemented and will process a client-provided structure file without modification.
5. S3 scales to future clients without architectural dependency — any client can provide a structure declaration file; no per-client system integration is required.

### Rejections

**S1 rejected**: No external system of record is currently designated or accessible for this client. Requiring external system integration as a prerequisite for pipeline execution introduces an unbounded blocking dependency.

**S2 rejected**: S2 is a pipeline orchestration pattern, not a source definition. The new IG stage it describes still requires an upstream structural input — it inherits the S1/S3 question. It adds governance overhead without resolving the origin problem.

---

## TASK 5 — CANONICAL CONTRACT

```json
{
  "source_class": "AUTHORITATIVE_STRUCTURE_SOURCE",
  "origin": "S3",
  "required_files": [
    {
      "path": "clients/<uuid>/input/intake/structure_source.json",
      "description": "Client-provided explicit structure declaration — raw input before validation",
      "role": "RAW_STRUCTURE_INPUT"
    },
    {
      "path": "clients/<uuid>/input/intake/structure_manifest.json",
      "description": "Pipeline-admissible structure manifest — emitted by emit_structure_manifest.py after validation",
      "role": "GOVERNED_STRUCTURE_OUTPUT"
    }
  ],
  "schema": {
    "domains": ["<string>"],
    "entities": [
      { "name": "<string>", "domain": "<string>" }
    ],
    "relationships": [
      { "from": "<string>", "to": "<string>", "type": "<string>" }
    ]
  },
  "admissibility_rules": [
    "ALL_THREE_KEYS_REQUIRED: domains, entities, relationships must all be present as non-empty lists",
    "NO_INFERENCE: structure must not be derived from VAR_* metrics, signals, or any pipeline output",
    "CLIENT_SCOPE_BOUND: source file must reside under clients/<uuid>/input/intake/",
    "GOVERNED_EMISSION: structure_manifest.json must be produced by emit_structure_manifest.py — direct pipeline injection of raw source is not admissible",
    "PROVENANCE_COVERAGE: provenance_hash in structure_manifest.json must cover both structure source content and telemetry_baseline.json content",
    "NO_RUNTIME_VARIABLES: source file must not contain timestamps, nonces, or execution-context values in structural arrays"
  ],
  "validation_rules": [
    "DOMAINS_VALID: each domain must be a non-empty string",
    "ENTITIES_VALID: each entity must be an object with non-empty string 'name' and non-empty string 'domain'",
    "ENTITY_DOMAIN_RESOLVES: each entity 'domain' value must match a declared entry in the 'domains' list",
    "RELATIONSHIPS_VALID: each relationship must be an object with non-empty string 'from', 'to', and 'type'",
    "HASH_DETERMINISTIC: SHA-256(source_file_content + telemetry_baseline_content) must match provenance_hash in emitted manifest",
    "NO_OVERWRITE: emit_structure_manifest.py must not overwrite an existing structure_manifest.json without explicit deletion"
  ]
}
```

---

## PIPELINE INTEGRATION POINT

Once `structure_manifest.json` is present, `build_authoritative_input.py` must be updated (WP-15J) to:

1. After `INTAKE_SCHEMA_ADAPT` — check for `clients/<uuid>/input/intake/structure_manifest.json`
2. If present and valid: load `domains`, `entities`, `relationships` from it (replaces current empty return from `adapt_intake_structure.py`)
3. If absent: retain current behavior (empty topology, BLOCKED signals)

This insertion preserves all existing pipeline stages. The STRUCTURE_EMITTER stage becomes a pre-pipeline preparation step, not a mid-pipeline injection.

---

## EVIDENCE CHAIN

| Artifact | Finding | Reference |
|---|---|---|
| telemetry_baseline.json | 20 VAR_* scalars only — no structural data | WP-15E |
| CE2 40.5–40.11 lineage | STRUCTURE_SOURCE_VERDICT: NOT_FOUND — 30 files, 0 structural keys | WP-15F |
| structural_emission_decision.md | DECISION = OPTION_C | WP-15G |
| structure_emission_log.md | BLOCKED — STRUCTURE_SOURCE_UNAVAILABLE — 0 candidates in intake | WP-15H |
| authoritative_state.json | topology: domains=0, nodes=0, relationships=0 — 8 CRITICAL signals | WP-15E output |
