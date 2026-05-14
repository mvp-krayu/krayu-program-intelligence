# Reusable Reconciliation Primitive Inventory

**Stream:** PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01

---

## 1. What Is Already Reusable (No Changes Needed)

### Primitive 1: Correspondence Compiler Core

**Module:** `ReconciliationCorrespondenceCompiler.compileCorrespondence()`

Takes 5 typed artifacts, produces a reconciliation correspondence table. Pure function. No client branching. Accepts any client's data that conforms to the input schemas.

**Reuse cost:** Zero. Works for any client today.

### Primitive 2: Graduated Confidence Model

**Module:** `CONFIDENCE_LEVELS` constant + `assessConfidence()` function

The 5-level confidence ladder (L1 UNMAPPED → L5 STRUCTURALLY_GROUNDED) is a domain-agnostic classification scheme. It classifies correspondence strength based on crosswalk lineage status, numeric confidence, signal binding, and trace chain presence.

**Reuse cost:** Zero. The levels and their definitions are universal to the correspondence operation.

### Primitive 3: Structural Index Builder

**Module:** `buildStructuralIndex()`

Reads `canonical_topology` in either vault format (domains[]) or 40.4 format (clusters[]) and produces a lookup index. Client-agnostic.

**Reuse cost:** Zero.

### Primitive 4: Crosswalk Bridge Builder

**Module:** `buildCrosswalkBridge()`

Reads `semantic_continuity_crosswalk` and produces a lookup index by entity ID. Client-agnostic.

**Reuse cost:** Zero.

### Primitive 5: Signal & Trace Index Builders

**Modules:** `buildSignalIndex()`, `buildTraceIndex()`

Read vault signal_registry and evidence_trace, produce lookup indices. Client-agnostic. Gracefully degrade when artifacts are absent.

**Reuse cost:** Zero.

### Primitive 6: Artifact Writer/Reader

**Module:** `ReconciliationArtifactWriter`

Writes/reads `reconciliation_correspondence.v1.json` to/from `artifacts/sqo/<client>/<run>/`. Path is parameterized.

**Reuse cost:** Zero.

### Primitive 7: Reconciliation Summary in Payload

**Module:** Inline compilation in `GenericSemanticPayloadResolver.resolveSemanticPayload()`

Compiles correspondence during payload resolution using whatever artifacts the manifest loads. Adds `reconciliation_summary` to the canonical payload.

**Reuse cost:** Zero. Works for any client whose manifest provides the required artifacts.

### Primitive 8: SQO Cockpit Artifact Loader Integration

**Module:** `SQOCockpitArtifactLoader` — loads `reconciliation_correspondence.v1.json`

Standard SQO artifact loading pattern. Client-agnostic path resolution.

**Reuse cost:** Zero.

### Primitive 9: Cockpit UI Components

**Modules:** `ReconciliationCorrespondencePanel.jsx`, `SQOWorkspacePanel.jsx` routing, page route

All data-driven rendering. No client-specific rendering logic. Shows whatever the artifact contains.

**Reuse cost:** Zero.

---

## 2. What Becomes Reusable With Minor Generalization

### Primitive 10: Compilation Orchestrator (currently BlueEdge-hardcoded)

**Current module:** `scripts/reconciliation/compile_blueedge_correspondence.js`

**What needs to change:** Replace hardcoded CLIENT/RUN_ID constants with:
- CLI arguments (`node scripts/reconciliation/compile_correspondence.js --client=<client> --run=<run>`)
- Or manifest-driven execution (read client/run from a manifest)

**Generalization cost:** ~15 lines of CLI argument parsing. The function calls inside are already parameterized.

### Primitive 11: Confidence Threshold Configuration

**Current state:** Thresholds (0.90, 0.65, 0.50) are constants in `assessConfidence()`.

**What needs to change:** Extract thresholds into an options object:
```javascript
compileCorrespondence({
  ...artifacts,
  confidenceThresholds: { l5: 0.90, l4: 0.65, l3: 0.50 },
})
```

**Generalization cost:** ~10 lines. Default values preserve current behavior.

---

## 3. What Is NOT Reusable (Client-Specific Material)

These are NOT framework components. They are client semantic material that each new client must produce through its own evidence intake process.

| Material | BlueEdge Instance | Why Not Reusable |
|----------|-------------------|------------------|
| `semantic_topology_model.json` | 17 domains, specific business labels | Each client has its own business domain model |
| `canonical_topology.json` | 13 DOM groups from PATH A analysis of BlueEdge's codebase | Each client has its own structural topology |
| `semantic_continuity_crosswalk.json` | 13 entities mapping BlueEdge DOMs to semantic domains | Each client has its own DOM-to-domain mapping |
| `signal_registry.json` | 4 PSIG signals for BlueEdge pressure analysis | Each client has its own structural signals |
| `evidence_trace.json` | Traceability chains for BlueEdge evidence | Each client has its own evidence lineage |
| SQO qualification artifacts | BlueEdge at S2, Q-02 | Each client has its own qualification state |
| Evidence HTML files | 3 BlueEdge evidence source files | Each client provides its own source evidence |

---

## 4. Reuse Ratio

| Category | Count | Percentage |
|----------|-------|------------|
| Already reusable (Primitives 1–9) | 9 | 82% |
| Minor generalization needed (Primitives 10–11) | 2 | 18% |
| BlueEdge-specific code that needs rewriting | 0 | 0% |

**The reconciliation engine is 82% reusable out of the box. The remaining 18% requires ~25 lines of parameter extraction. No architectural changes needed.**
