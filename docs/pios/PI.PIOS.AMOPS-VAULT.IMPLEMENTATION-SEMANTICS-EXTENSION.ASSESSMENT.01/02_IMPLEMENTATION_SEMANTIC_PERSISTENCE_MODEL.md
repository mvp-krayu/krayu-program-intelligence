# Implementation-Semantic Persistence Model Recommendation

**Stream:** PI.PIOS.AMOPS-VAULT.IMPLEMENTATION-SEMANTICS-EXTENSION.ASSESSMENT.01

---

## 1. Design Principle

Implementation semantics should be persisted **where the code lives** — in the stream container — not in the vault.

**Vault** = architecture memory (concepts, states, boundaries, terminology)
**Stream container** = execution memory (what was built, how it works, what it needs)

This separation is critical. The vault must not grow heavy with implementation detail. Stream containers already hold execution reports, closure records, and validation logs. Adding one more artifact type — implementation semantics — is a natural extension.

---

## 2. The Artifact: IMPLEMENTATION_SEMANTICS.md

A new optional artifact in the stream container, produced alongside CLOSURE.md when a stream creates reusable code primitives.

### Location

```
docs/pios/<STREAM-ID>/IMPLEMENTATION_SEMANTICS.md
```

### When Required

A stream SHOULD produce IMPLEMENTATION_SEMANTICS.md when it creates code that meets ANY of:
- A module intended to be consumed by other modules or streams
- Functions with a defined input/output contract
- Configurable parameters or extension points
- Infrastructure intended for multi-client use

A stream does NOT need IMPLEMENTATION_SEMANTICS.md when:
- It only modifies existing code within an existing module
- It is a bug fix, CSS/UI refinement, or configuration change
- It is a documentation-only or assessment-only stream
- No reusable code primitives are introduced

### Detection Rule

If the stream's file_changes.json includes CREATEd files in `app/`, `lib/`, or `scripts/` that export functions intended for reuse → IMPLEMENTATION_SEMANTICS.md is indicated.

---

## 3. Required Sections

### Section 1: Primitive Inventory

A table of all reusable code primitives introduced by the stream.

```markdown
## 1. Primitive Inventory

| # | Primitive | Module | Purpose | Reuse Status |
|---|-----------|--------|---------|--------------|
| 1 | compileCorrespondence() | ReconciliationCorrespondenceCompiler.js | Compile correspondence from 5 artifact types | Client-agnostic |
| 2 | assessConfidence() | ReconciliationCorrespondenceCompiler.js | Assign graduated confidence per domain | Client-agnostic (calibration risk) |
```

### Section 2: Input Contracts

What each input artifact must look like. Not full JSON schema — just the consumed fields and expected shapes.

```markdown
## 2. Input Contracts

### semanticTopologyModel
- Required: `domains[]` array
- Each domain: `domain_id`, `domain_name`, `domain_type`, `cluster_id`, `lineage_status`, `dominant_dom_id`, `confidence`
- Loaded from: manifest `semantic_topology_model` key

### canonicalTopology
- Dual format: vault `domains[]` OR 40.4 `clusters[]`
- Vault format: each entry has `domain_id`, `grounding_status`, `component_ids[]`
- 40.4 format: each entry has `cluster_id`, `name`, `node_count`, `node_ids[]`
```

### Section 3: Output Contracts

What the code produces and where it goes.

```markdown
## 3. Output Contracts

### reconciliation_correspondence.v1.json
- Path: `artifacts/sqo/<client>/<run>/`
- Schema: `{ metadata: {...}, summary: {...}, correspondences: [...], unmatched_structural: [...] }`
- Deterministic: same inputs → same output
```

### Section 4: Calibration Assumptions

Which constants are assumptions (tuned against specific data) vs governance (defined by specification).

```markdown
## 4. Calibration Assumptions

| Constant | Value | Type | Notes |
|----------|-------|------|-------|
| L5 confidence threshold | 0.90 | Calibration | Tuned against BlueEdge crosswalk data |
| L4 confidence threshold | 0.65 | Calibration | Tuned against BlueEdge crosswalk data |
| L3 confidence threshold | 0.50 | Calibration | Tuned against BlueEdge crosswalk data |
| L4+ = RECONCILED | — | Governance | Defined in formalization |
```

### Section 5: Extension Points

Where the system can be parameterized without code changes.

```markdown
## 5. Extension Points

| Extension | Mechanism | Current State |
|-----------|-----------|---------------|
| Confidence thresholds | Options object in compileCorrespondence() | Hardcoded defaults, not yet extracted |
| Client/run selection | Manifest system | Already parameterized via manifest registry |
| Topology format | buildStructuralIndex() dual-format | Already handles both formats automatically |
```

### Section 6: Module Responsibility Map

Which file owns which concern.

```markdown
## 6. Module Responsibility Map

| Module | Responsibility | Client-Specific? |
|--------|---------------|------------------|
| ReconciliationCorrespondenceCompiler.js | Core compilation engine | NO |
| ReconciliationArtifactWriter.js | Artifact persistence | NO |
| compile_blueedge_correspondence.js | BlueEdge compilation orchestration | YES — hardcoded |
```

---

## 4. What This Is NOT

- NOT an API documentation system (no JSDoc, no TypeDoc, no generated docs)
- NOT a test specification (tests live in test files)
- NOT a design document (design intent is in the stream contract)
- NOT a vault page (it lives in the stream container)
- NOT required for all streams (only when reusable primitives are introduced)

---

## 5. Relationship to Existing Artifacts

```
docs/pios/<STREAM-ID>/
├── CLOSURE.md                      ← governance closure (EXISTING)
├── execution_report.md             ← execution narrative (EXISTING)
├── validation_log.json             ← validation results (EXISTING)
├── file_changes.json               ← file change tracking (EXISTING)
├── IMPLEMENTATION_SEMANTICS.md     ← implementation memory (NEW, CONDITIONAL)
└── [assessment deliverables]       ← stream-specific outputs (EXISTING)
```

IMPLEMENTATION_SEMANTICS.md is a peer to execution_report.md. The execution report tells WHAT was done. Implementation semantics tell HOW it works and WHAT it needs.

---

## 6. Cost/Benefit

### Cost
- ~15 minutes additional effort per qualifying stream
- One additional file in the stream container
- Requires the execution engine to shift from "what I built" to "how it works" perspective at closure

### Benefit
- Eliminates code archaeology for future assessment/extension streams
- Reduces context consumption by ~40% for downstream streams
- Prevents calibration/governance confusion
- Makes multi-client reusability assessment trivially loadable
- Creates a queryable implementation memory alongside the architecture memory

### Net Assessment
The reconciliation compiler + assessment streams together consumed ~2 hours of code reverse-engineering that a 15-minute IMPLEMENTATION_SEMANTICS.md would have prevented. The ROI is immediate for any stream that has a downstream consumer.
