# Interpretation Registry — Governance Document
## PI.41X.INTERPRETATION-REGISTRY.01

**Layer:** 41.x — Semantic Authority  
**Contract:** PI.41X.INTERPRETATION-REGISTRY.01  
**Date:** 2026-04-25  
**Branch:** work/psee-runtime  
**Status:** ACTIVE

---

## 1. Purpose

The Interpretation Registry is the canonical mapping from structural constructs — signals, conditions, and zone classes — to governed behavioral meaning.

Its purpose is to answer the question: *what does this structural fact mean for the system, without inferring cause, predicting outcome, or prescribing action?*

The registry makes interpretation deterministic, auditable, and reusable across clients, runs, and product surfaces (workspace, reports, AI consumption).

No product output may claim structural meaning without a registered INT-XXX entry as the source.

---

## 2. Separation from Other Layers

The interpretation layer is a distinct semantic layer within 41.x. It does not replace or overlap with layers below it.

### Layer boundaries

| Layer | Authority | Owns |
|---|---|---|
| 40.x | Structural truth | Signal values, topology, telemetry, condition activations |
| 75.x | Condition activation | Threshold rules, activation decisions, zone designation rules |
| 41.x projection | Projection | Normalized flat schemas of 75.x outputs for downstream consumption |
| **41.x interpretation (this registry)** | **Semantic meaning** | **Governed behavioral meaning per construct** |
| 42.x | Runtime exposure | API responses, workspace rendering |
| 75.x (LENS/reports) | Product narrative | Client-facing expression of interpretation |

### What this registry does NOT do

- It does not define signals. Signals are defined in 40.5 / 75.x contracts.
- It does not activate conditions. Conditions are activated by 75.x threshold rules.
- It does not designate zones. Zones are designated by 75.x zone rules.
- It does not select focus domains. Focus domain selection requires a 75.x focus contract.
- It does not produce reports. Reports are produced by the Phase 5 report generator.
- It does not modify 41.x projection artifacts. Projection artifacts are read-only.

---

## 3. Rules of Interpretation

### 3.1 Language rules

All `behavioral_meaning`, `system_expression`, and `business_expression` fields must:

**Use only:**
- "indicates"
- "reflects"
- "reveals"
- "is structured as"
- "is isolated from"
- "is dependent on"
- "records"
- "shows"
- "is active"
- "is co-present"
- "is attributed to"

**Never contain:**
- "will cause" — predictive claim prohibited
- "should" — prescriptive claim prohibited
- "high risk" — severity claim prohibited
- "critical" — severity claim prohibited
- "urgent" — severity claim prohibited
- "recommend" — recommendation prohibited
- "must fix" — action directive prohibited
- "needs to" — action directive prohibited
- "requires action" — action directive prohibited

### 3.2 Determinism rule

Every entry must produce the same interpretation for the same input construct, regardless of:
- which client run produced the activation
- which workspace or report surface consumes it
- how many times it is read

Entries must not contain run-specific values, client IDs, or domain-specific data.

### 3.3 Evidence-derivation rule

Every entry's content must be derivable from governed source documents listed in `source_authority`. No content may be introduced from external knowledge, LLM inference, or unstated assumptions.

### 3.4 Three-layer output rule

Every entry must provide all three output fields:

| Field | Audience | Register |
|---|---|---|
| `behavioral_meaning` | Internal engineering / diagnostic | Technical, structural |
| `system_expression` | Workspace / diagnostic UI | Architectural, mechanistic |
| `business_expression` | Non-technical stakeholders | Plain language, structural facts only |

All three must be present. None may be left blank or set to null.

### 3.5 Constraint invariants

Every entry's `constraints` block must be:
```json
{
  "no_prediction": true,
  "no_recommendation": true,
  "no_prioritization": true,
  "no_severity": true
}
```

These are invariants — not optional flags. An entry violating any constraint is invalid.

---

## 4. Extension Rules

### 4.1 Adding a new entry

To add a new entry to `interpretation_registry.json`:

1. Assign the next available INT-XXX ID (monotonically, never reused).
2. Set `entry_type` to one of: `signal`, `zone`, `condition`, `composite`.
3. Populate `inputs` with at least one non-null field (signal_id, condition_id, or zone_class).
4. Write all three `output` fields following language rules in Section 3.1.
5. Set all four `constraints` to true.
6. State `source_authority` — the governed document(s) from which the entry is derived.
7. Increment `total_entries` in the registry root.
8. Reference the new entry in a governance trace document.

No entry may be added without a governing contract or explicit authorization.

### 4.2 Updating an existing entry

Entries may be updated only if:
1. The update is authorized by a new contract that references the INT-XXX ID being updated.
2. The update is recorded in the contract's governance trace.
3. The update does not change the `id`, `entry_type`, or primary `inputs` without explicit supersession.

Minor corrections (typos, clarifications that do not change meaning) are exempt from contract requirement but must be logged in a commit message referencing the INT-XXX ID.

### 4.3 Deprecating an entry

Entries must not be deleted from the registry. To deprecate:
1. Add a `deprecated: true` field to the entry.
2. Add a `superseded_by: "INT-XXX"` field referencing the replacement entry.
3. Leave all original fields intact.
4. Record the deprecation in the governance trace of the authorizing contract.

### 4.4 Composite entries

Composite entries (entry_type: "composite") aggregate multiple INT-XXX entries into a combined interpretation. Rules:

1. The composite entry must enumerate the INT-XXX component IDs it aggregates in a `components` field.
2. The aggregation method must be explicitly declared (e.g., "co-presence record", "union of scopes").
3. No new behavioral meaning may be introduced beyond what is already present in the component entries.
4. Composites require explicit contract authorization — they are not auto-derived.

---

## 5. Prohibition Rules

The following are unconditionally prohibited in registry entries:

### 5.1 Causal claims

Statements asserting that a structural fact causes an outcome are prohibited.

Examples:
- "This zone causes deployment failures" — PROHIBITED
- "Fan-in concentration leads to tight coupling" — PROHIBITED (causal language)
- "The responsibility zone indicates disproportionate surface ownership concentration" — ALLOWED

### 5.2 Predictive claims

Statements predicting future events are prohibited.

Examples:
- "This signal indicates the system will become unstable" — PROHIBITED
- "PSIG-001 activation predicts deployment difficulty" — PROHIBITED
- "PSIG-001 indicates fan-in concentration is active in this run" — ALLOWED

### 5.3 Recommendations

Action directives and recommendations are prohibited.

Examples:
- "This zone should be refactored" — PROHIBITED
- "The responsibility zone indicates the component should be split" — PROHIBITED
- "The condition records surface ownership concentration" — ALLOWED

### 5.4 Severity and priority

Severity labels and prioritization claims are prohibited.

Examples:
- "This is a high-severity zone" — PROHIBITED
- "COMPOUND_ZONE is the most critical zone class" — PROHIBITED
- "Compound zones record co-presence of multiple pressure families" — ALLOWED

### 5.5 Client-specific content

Registry entries must not reference specific client IDs, run IDs, domain IDs, node IDs, or signal values from specific runs.

Examples:
- "DOM-04 (frontend_isolated) is responsible for this zone" — PROHIBITED
- "PSIG-001 = 9.43 for run_01_oss_fastapi" — PROHIBITED
- "The max-attribution entity for PSIG-001 is the node with the highest fan-in in the run" — ALLOWED

### 5.6 Duplication of signal definitions

Registry entries must not redefine or contradict signal definitions from the governing source documents. Signal names and structural descriptions must match the authoritative source.

---

## 6. Consumption Contract

### What consumers may do with registry entries

- Read `behavioral_meaning` to produce workspace panel descriptions
- Read `system_expression` to produce architectural diagnostic output
- Read `business_expression` to produce report narrative
- Combine INT-XXX entries to compose multi-zone explanations (via composite entries only)
- Reference INT-XXX IDs in governance traces as interpretation sources

### What consumers must not do

- Modify entry content at consumption time to add severity, priority, or recommendations
- Select only favorable INT-XXX entries while suppressing others
- Treat `business_expression` as a client-facing verdict — it is a structural observation
- Infer focus domain selection from the presence of any entry

---

## 7. Relation to Focus Domain

The interpretation registry records structural meaning per construct. It does not select, imply, or suggest a focus domain.

**COMPOUND_ZONE (INT-007)** records that multiple pressure families are co-present. This is a structural fact. It does not constitute focus domain selection.

**Primary attribution** (reflected in signal and condition entries) records which entity holds maximum attribution. It does not constitute focus domain selection.

Focus domain selection requires a formal 75.x focus-domain contract with an authorized aggregation and ranking rule. The interpretation registry is not that contract.

---

## 8. Scope of Version 1.0

Registry version 1.0 covers:

| Entry type | Count | Coverage |
|---|---|---|
| Zone class entries | 7 | COUPLING_ZONE, PROPAGATION_ZONE, RESPONSIBILITY_ZONE, SURFACE_EXPOSURE_ZONE, COORDINATION_ZONE, FRAGMENTATION_ZONE, COMPOUND_ZONE |
| Signal entries | 6 | PSIG-001 through PSIG-006 |
| Condition entries | 6 | COND-PSIG-001 through COND-PSIG-006 |
| Composite entries | 1 | INT-020 (placeholder only) |
| **Total** | **20** | |

Version 1.0 does not include:
- Composite entries with populated aggregation logic (INT-020 is a placeholder)
- Focus domain interpretation (not in scope — requires 75.x focus contract)
- Temporal signal entries (ESI, RAG — require multi-run temporal scope)
- Cross-client interpretation variations (registry is global and client-independent)
