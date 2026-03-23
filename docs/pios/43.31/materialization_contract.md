# Governed Materialization Contract

Stream: 43.31 — Governed Materialization & Reproducibility Contract
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-23
Authority: 43.1, 43.2, 43.3, 44.1, 44.2, 44.3
Status: AUTHORITATIVE — CONTRACT DEFINITION

---

## 3.1 Governed Materialization Review

### Gap Confirmed

Governance definitions are present on disk:

| Document | Path | Status Flag |
|---|---|---|
| 43.1 Signal-to-Structure Binding Definition | `docs/pios/43.1/signal_to_structure_binding.md` | DEFINITION — ARCHITECTURAL / GOVERNANCE ONLY |
| 43.2 Binding Payload Contract | `docs/pios/43.2/binding_payload_contract.md` | DEFINITION — SCHEMA-LEVEL, NON-IMPLEMENTABLE |
| 43.3 Binding Validation Envelope | `docs/pios/43.3/binding_validation_envelope.md` | DEFINITION — RUNTIME GUARD / NON-IMPLEMENTABLE |
| 44.1 Structural Overlay Projection Definition | `docs/pios/44.1/structural_overlay_projection_definition.md` | DEFINITION — ARCHITECTURAL / GOVERNANCE ONLY |
| 44.2 Projection Attachment Contract | `docs/pios/44.2/projection_attachment_contract.md` | DEFINITION — ARCHITECTURAL / GOVERNANCE ONLY |
| 44.3 Projection Emphasis Attribute | `docs/pios/44.3/projection_emphasis_attribute.md` | AUTHORITATIVE |

### Output Schema Absent

No governance document defines:
- A runtime output file path for 43.3 validated binding payload
- A runtime output file path for 44.2 projection attachment
- A JSON schema or serialization format for either artifact
- A per-query vs aggregate persistence rule
- A checksum or versioning convention

43.2 explicitly states: "The contract is conceptual. It describes the composition and constraints of a bound projection record in governance terms. It is not a technical schema, a serialization format, an API definition, or an implementation guide."

### Runtime Artifacts Absent

Confirmed by direct filesystem inspection. No JSON files exist under `docs/pios/43.3/`, `docs/pios/44.1/`, `docs/pios/44.2/`, or `docs/pios/44.3/`. The only runtime JSON artifacts on disk are the 41.x source files.

---

## 3.2 Deterministic Input Inventory

### Inputs for 43.3 Materialization (Signal-to-Structure Binding)

| Path | Content | Status |
|---|---|---|
| `docs/pios/41.4/signal_registry.json` | 5 signals (SIG-001–SIG-005). Fields: signal_id, title, statement, domain_id, domain_name, capability_id, capability_name, component_ids, component_names, source_refs, trace_links, evidence_confidence | MANDATORY |
| `docs/pios/41.4/evidence_mapping_index.json` | Evidence entries per signal. Fields: signal_id, source_layer, source_file, source_object_id, supporting_objects[], semantic_anchor, evidence_chain, blocking_point, temporal_reference | MANDATORY |
| `docs/pios/41.2/pie_vault/01_Domains/*.md` | Governed topology nodes — Domains (D_01_ through D_17_). Node identities are file stems. | MANDATORY |
| `docs/pios/41.2/pie_vault/02_Capabilities/*.md` | Governed topology nodes — Capabilities. Node identities are file stems. | MANDATORY |
| `docs/pios/41.2/pie_vault/03_Components/*.md` | Governed topology nodes — Components. Node identities are file stems. | MANDATORY |

### Inputs for 44.2 Materialization (Projection Attachment)

| Path | Content | Status |
|---|---|---|
| `docs/pios/43.3/validated_binding_payload.json` | Output of 43.3 materialization step. All records VALID-only. | MANDATORY |
| `docs/pios/41.2/pie_vault/` | Authoritative topology for exact node resolution per 44.2 §3.2 | MANDATORY |

### Optional Inputs

NONE. No optional inputs are recognized. Any input not listed above is outside the governed materialization boundary.

### Source Metadata Fields (from inspection)

| File | registry_id / map_id | contract_id | run_reference | generated_date |
|---|---|---|---|---|
| signal_registry.json | PIOS-41.4-RUN01-SIGNAL-REGISTRY | PIOS-41.4-RUN01-CONTRACT-v1 | run_01_blueedge | 2026-03-20 |
| evidence_mapping_index.json | PIOS-41.4-EVIDENCE-INDEX | PIOS-41.4-RUN01-CONTRACT-v1 | run_01_blueedge | 2026-03-20 |
| query_signal_map.json | PIOS-41.5-QUERY-SIGNAL-MAP | PIOS-41.5-RUN01-CONTRACT-v1 | run_01_blueedge | 2026-03-20 |

---

## 3.3 Materialization Boundary Definition

### Allowed Transformations

| Transformation | Permitted | Definition |
|---|---|---|
| Mapping | YES | Carry a field value from a source record to an output record field unchanged |
| Validation | YES | Check a field against a defined rule and emit VALID or INVALID — no repair |
| Structuring | YES | Arrange governed fields into a defined JSON record shape |

### Forbidden Transformations

| Transformation | Forbidden | Enforcement |
|---|---|---|
| Inference | FORBIDDEN | No field may be generated from context, pattern-matching, or reasoning |
| Repair | FORBIDDEN | A missing or invalid field causes record rejection — no value substitution |
| Substitution | FORBIDDEN | No default value may replace an absent governed field |
| Aggregation | FORBIDDEN | No field may be derived from combining values across records |
| Derived constructs | FORBIDDEN | SSZ, SSI, or any construct not admitted through krayu-knowledge may not appear |
| Normalization | FORBIDDEN | Signal states and evidence chains are carried as-received, not transformed |
| Narrative generation | FORBIDDEN | No field may contain text constructed by the materialization process |

### Fail-Closed Triggers

Each of the following terminates materialization immediately with no partial output:

| Trigger | Condition | Behavior |
|---|---|---|
| FC-001 | `signal_registry.json` absent or unreadable | TERMINATE — NO OUTPUT |
| FC-002 | `evidence_mapping_index.json` absent or unreadable | TERMINATE — NO OUTPUT |
| FC-003 | `pie_vault/` directory absent or unreadable | TERMINATE — NO OUTPUT |
| FC-004 | Signal in registry has no evidence entry in evidence_mapping_index.json | RECORD REJECTED — binding_id marked INVALID |
| FC-005 | Signal evidence chain is null, empty, or truncated | RECORD REJECTED — binding_id marked INVALID |
| FC-006 | Node reference in signal registry does not resolve to an exact vault entry | RECORD REJECTED |
| FC-007 | signal_id is absent or does not match a CKR-format identifier (SIG-NNN) | RECORD REJECTED |
| FC-008 | temporal_reference absent from evidence entry | RECORD REJECTED |
| FC-009 | association_basis (semantic_anchor) absent from evidence entry | RECORD REJECTED |
| FC-010 | All binding records rejected (empty validated payload) | TERMINATE — NO OUTPUT — emit observability record only |

---

## 3.4 Output Artifact Contract — 43.3 (Validated Binding Payload)

### Canonical Path

```
docs/pios/43.3/validated_binding_payload.json
```

### Canonical Structure

JSON array. Root element is an array. No wrapper object. Each element is a binding record.

```json
[
  {
    "binding_id": "<string>",
    "signal_reference": {
      "signal_id": "<string>",
      "signal_state": "<string>",
      "source_reference": "<string | string[]>"
    },
    "node_reference": {
      "node_id": "<string>",
      "source_reference": "<string>"
    },
    "evidence_embedding": {
      "association_basis": "<string>",
      "provenance_chain": "<string>",
      "source_reference": "<string>",
      "temporal_reference": "<string | null>"
    },
    "validation_status": "VALID | INVALID",
    "validation_trace": ["<string>"],
    "contract_version": "<string>",
    "source_snapshot_reference": "<string>",
    "checksum": "<string>"
  }
]
```

### Field Definitions

| Field | Source | Rule |
|---|---|---|
| `binding_id` | Constructed: `BIND-{signal_id}-{node_id}` | Deterministic. Same inputs always produce same ID. |
| `signal_reference.signal_id` | `signal_registry.json → signals[].signal_id` | Carried unchanged |
| `signal_reference.signal_state` | `signal_registry.json → signals[].statement` | Carried unchanged — no abbreviation |
| `signal_reference.source_reference` | `signal_registry.json → signals[].source_refs` | Carried unchanged |
| `node_reference.node_id` | `signal_registry.json → signals[].domain_id + capability_id + component_ids` | Governed external identity; one record per binding target |
| `node_reference.source_reference` | `pie_vault/` — exact resolved vault path for node_id | Exact match only; unresolved → RECORD REJECTED |
| `evidence_embedding.association_basis` | `evidence_mapping_index.json → signals[].semantic_anchor` | domain_id, capability_id, component_ids — carried unchanged |
| `evidence_embedding.provenance_chain` | `evidence_mapping_index.json → signals[].evidence_chain` | Full string carried unchanged — no summarization |
| `evidence_embedding.source_reference` | `evidence_mapping_index.json → signals[].source_object_id` | Carried unchanged |
| `evidence_embedding.temporal_reference` | `evidence_mapping_index.json → signals[].temporal_reference` | Carried unchanged; null is preserved as null — not substituted |
| `validation_status` | Produced by 43.3 validation | VALID or INVALID only |
| `validation_trace` | Produced by 43.3 validation | List of check results (e.g. "STRUCTURE_VALIDITY: PASS") |
| `contract_version` | Materialization process | Fixed: `"43.31-v1"` |
| `source_snapshot_reference` | Constructed from source metadata | `"{registry_id}:{run_reference}:{generated_date}"` |
| `checksum` | SHA256 of record content (excluding checksum field itself) | Hex string |

### Persistence Rule

**Aggregate artifact only.** One file. All binding records for all signals in a single JSON array. No per-query splitting. No per-signal files. The artifact represents the complete materialization output from the current 41.x source state.

### Binding Granularity

Each signal in `signal_registry.json` produces one binding record per structural node it is anchored to. A signal anchored to a domain, a capability, and one or more components produces one record per node level where evidence resolution succeeds. Each record is independent. Records are not merged.

---

## 3.5 Output Artifact Contract — 44.2 (Projection Attachment)

### Canonical Path

```
docs/pios/44.2/projection_attachment.json
```

### Canonical Structure

JSON array. Root element is an array. Each element is a projection element.

```json
[
  {
    "projection_id": "<string>",
    "node_reference": {
      "node_id": "<string>",
      "vault_path": "<string>"
    },
    "signal_reference": {
      "signal_id": "<string>",
      "signal_state": "<string>",
      "source_reference": "<string | string[]>"
    },
    "evidence_reference": {
      "association_basis": "<string>",
      "provenance_chain": "<string>",
      "source_reference": "<string>",
      "temporal_reference": "<string | null>"
    },
    "upstream_binding_reference": "<string>",
    "emphasis": "high | medium | low | none",
    "validation_basis_reference": "<string>",
    "contract_version": "<string>",
    "source_snapshot_reference": "<string>",
    "checksum": "<string>"
  }
]
```

### Field Definitions

| Field | Source | Rule |
|---|---|---|
| `projection_id` | Constructed: `PROJ-{binding_id}-{node_id}` | Deterministic |
| `node_reference.node_id` | `validated_binding_payload.json → [].node_reference.node_id` | Carried unchanged from 43.3 output |
| `node_reference.vault_path` | `pie_vault/` — exact resolved path | Exact match only per 44.2 §3.2; failure → RECORD REJECTED |
| `signal_reference.*` | `validated_binding_payload.json → [].signal_reference.*` | Carried unchanged from 43.3 output |
| `evidence_reference.*` | `validated_binding_payload.json → [].evidence_embedding.*` | Carried unchanged from 43.3 output |
| `upstream_binding_reference` | `validated_binding_payload.json → [].binding_id` | Exact reference to originating binding record |
| `emphasis` | 44.3 governed closed set: `high`, `medium`, `low`, `none` | Default: `none`. Assigned upstream only. Not computed here. |
| `validation_basis_reference` | `validated_binding_payload.json → [].validation_status + contract_version` | Confirms 43.3 certification |
| `contract_version` | Materialization process | Fixed: `"43.31-v1"` |
| `source_snapshot_reference` | Reference to `validated_binding_payload.json` checksum | `"43.3:{binding_payload_checksum}"` |
| `checksum` | SHA256 of record content (excluding checksum field itself) | Hex string |

### Attachment Rules (Enforced from 44.2)

NO hierarchy derivation. The projection attachment does not build or infer a topology hierarchy. It attaches validated binding records to the exact node referenced in each record.

NO co-occurrence logic. The co-occurrence mechanism currently present in `42.7/execlens_topology_adapter.py` must not be replicated here. Topology structure is external and authoritative.

EXACT node matching only. Per 44.2 §3.2: the canonical node identifier must match exactly one entry in the authoritative structural topology. No fuzzy matching. No nearest-match selection. Failure to resolve exactly → RECORD REJECTED.

---

## 3.6 Provenance & Evidence Continuity Contract

### Every Field Traces to 41.x

| Output Field | 41.x Origin | Traceability Path |
|---|---|---|
| `signal_reference.signal_id` | `41.4/signal_registry.json → signal_id` | Direct carry |
| `signal_reference.signal_state` | `41.4/signal_registry.json → statement` | Direct carry |
| `signal_reference.source_reference` | `41.4/signal_registry.json → source_refs` | Direct carry |
| `node_reference.node_id` | `41.4/signal_registry.json → domain_id / capability_id / component_ids` | Direct carry |
| `node_reference.source_reference` | `41.2/pie_vault/` — resolved vault path | Resolution against 41.2 |
| `evidence_embedding.association_basis` | `41.4/evidence_mapping_index.json → semantic_anchor` | Direct carry |
| `evidence_embedding.provenance_chain` | `41.4/evidence_mapping_index.json → evidence_chain` | Direct carry — no summarization |
| `evidence_embedding.source_reference` | `41.4/evidence_mapping_index.json → source_object_id` | Direct carry |
| `evidence_embedding.temporal_reference` | `41.4/evidence_mapping_index.json → temporal_reference` | Direct carry; null preserved |

### Provenance Chain Structure

The `evidence_chain` field in `evidence_mapping_index.json` follows the pattern:

```
{layer} {object_id} ({state}: {derivation}) → {layer} {object_id} ({state}: ...) → ... → {vault_node}
```

Example from SIG-001:
```
40.5 SIG-006 (complete: DIM-PC-002/DIM-PC-001 = 10/30 = 0.333 rec/sec)
→ 40.6 COND-006 (complete: activation_state=configured)
→ 40.7 DIAG-006 (computed: SENSOR_BRIDGE_CONFIGURED, 0.333 rec/sec, static config)
→ 40.7 INTEL-001 (computed: confirmed claims, runtime state UNAVAILABLE)
→ 41.1 DOMAIN-01/CAP-02/COMP-74,COMP-75
→ 41.2 vault: D_01_Edge_Data_Acquisition / C_02_Network_Security_Intelligence_Collection
```

This string is carried verbatim into `evidence_embedding.provenance_chain`. It must not be abbreviated, summarized, or reconstructed.

### Orphan Value Prohibition

An orphan value is any field in a materialized output record whose value cannot be traced to an explicit field in a 41.x source file or a deterministic construction rule defined in this contract.

Orphan values are prohibited. If a field cannot be filled from a governed source, the field is either:
- Left absent (if optional per this contract) — NONE are optional
- Treated as a failure condition triggering RECORD REJECTED

---

## 3.7 Reproduction & Replay Contract

See `docs/pios/43.31/reproducibility_contract.md`.

---

## 3.8 Fail-Closed Conditions

Each condition below terminates materialization or rejects the record. No partial output is produced under any fail-closed condition.

| Condition | Trigger | Behavior |
|---|---|---|
| FC-001 | Missing input file — any file in §3.2 MANDATORY list is absent | TERMINATE — NO OUTPUT |
| FC-002 | Schema mismatch — source file does not contain expected top-level fields | TERMINATE — NO OUTPUT |
| FC-003 | Missing signal mapping — a signal_id in registry has no corresponding evidence entry | RECORD REJECTED — validation_status: INVALID |
| FC-004 | Missing node reference — signal_registry entry has no domain_id, capability_id, or component_ids | RECORD REJECTED — validation_status: INVALID |
| FC-005 | Invalid evidence linkage — evidence_chain is null, empty, or structurally broken | RECORD REJECTED — validation_status: INVALID |
| FC-006 | Checksum mismatch — recomputed checksum does not match stored checksum at verification | TERMINATE — NO OUTPUT |
| FC-007 | Contract version mismatch — artifact contract_version does not match consuming process version | TERMINATE — NO OUTPUT |
| FC-008 | Node resolution failure (44.2) — node_id does not exactly match a vault entry | RECORD REJECTED — projection element not produced |
| FC-009 | Temporal reference absent — evidence entry carries no temporal_reference | RECORD REJECTED — validation_status: INVALID |
| FC-010 | Association basis absent — semantic_anchor is null or missing required fields | RECORD REJECTED — validation_status: INVALID |
| FC-011 | Empty validated payload — all binding records rejected by 43.3 | TERMINATE — NO OUTPUT — observability record emitted only |
| FC-012 | Emphasis value outside closed set (44.3) — value not in {high, medium, low, none} | Treat as none per 44.3 E-VAL-001; do not reject record |

---

## 3.9 Audit & Verification Contract

### Checksum Algorithm

Placeholder: **SHA256**. Applied to the JSON-serialized record content (deterministic key-ordering, no whitespace variation) excluding the `checksum` field itself. Output is a lowercase hex string.

### Timestamp Format

**ISO-8601 UTC**. All timestamps in materialization metadata and audit log entries use the format:
```
YYYY-MM-DDTHH:MM:SSZ
```

### Required Metadata Fields (per artifact file)

Each artifact file (`validated_binding_payload.json`, `projection_attachment.json`) must be accompanied by or carry within a metadata envelope:

| Field | Content |
|---|---|
| `artifact_id` | Unique artifact identifier (e.g. `ARTIFACT-43.3-BINDING-{date}`) |
| `produced_at` | ISO-8601 UTC timestamp of production |
| `contract_version` | `43.31-v1` |
| `source_snapshot_reference` | Source file registry_id + run_reference + generated_date |
| `record_count` | Total records in array |
| `valid_count` | Records with validation_status: VALID |
| `invalid_count` | Records with validation_status: INVALID |
| `artifact_checksum` | SHA256 of full artifact JSON (sorted keys, no whitespace) |

### Audit Log Expectations

A materialization execution producing these artifacts must emit a structured audit log entry that includes:
- execution timestamp (ISO-8601 UTC)
- input files with their observed checksums at time of read
- total records processed
- valid / invalid / rejected counts
- output artifact path and checksum
- contract version used
- pass / fail determination per check in Section 3.4 and 3.5 field definitions

---

## 3.10 Downstream Consumption Rule — 42.x

42.x MAY ONLY:
- Read `docs/pios/43.3/validated_binding_payload.json` and `docs/pios/44.2/projection_attachment.json`
- Verify `checksum` field on each consumed record using SHA256
- Verify `contract_version` field matches consuming process version expectation
- Render the content as-received
- FAIL CLOSED if either artifact is missing, unreadable, checksum-invalid, or version-mismatched

42.x MUST NOT:
- Recompute any field in any record
- Derive any signal value, node assignment, or evidence chain
- Infer any missing record, missing field, or failed binding
- Repair any record whose evidence_embedding is incomplete
- Substitute any value for an absent or INVALID record
- Execute any co-occurrence, density, or hierarchy derivation

---

## 3.11 Downstream Auditability Rule — 75.x

75.x MAY ONLY operate if ALL of the following are true:

- `docs/pios/43.3/validated_binding_payload.json` exists and artifact_checksum is verified
- `docs/pios/44.2/projection_attachment.json` exists and artifact_checksum is verified
- All consumed records carry `validation_status: VALID`
- Full provenance chain is present and non-empty in every consumed record
- `contract_version` matches the version expected by 75.x

If ANY condition above is false: 75.x MUST NOT EXECUTE.

---

## 3.12 Promotion Readiness

READY FOR MATERIALIZATION EXECUTION STREAMS

This contract defines all required schemas, paths, field mappings, fail-closed triggers, validation rules, and reproduction procedures. No ambiguity remains within the scope of this contract definition. Materialization execution streams may proceed against this contract.

---

## 3.13 Changelog

See `docs/pios/43.31/changelog.md`.
