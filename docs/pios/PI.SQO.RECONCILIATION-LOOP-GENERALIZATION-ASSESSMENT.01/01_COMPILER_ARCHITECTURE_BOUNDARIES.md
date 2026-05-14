# Assessment of Current Compiler Architecture Boundaries

**Stream:** PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01

---

## 1. Current Architecture Classification

**Verdict: BlueEdge-instantiated, architecturally reusable with identified hardcoding risks.**

The correspondence compiler is not a universal semantic compiler. It is a specific engine that takes 5 artifact types as input and produces a reconciliation correspondence table. The engine itself is client-agnostic — it has no `if (client === 'blueedge')` logic. But the infrastructure around it has BlueEdge assumptions baked in at multiple levels.

---

## 2. Layer-by-Layer Boundary Assessment

### Layer 1: Core Compiler (`ReconciliationCorrespondenceCompiler.js`)

**Status: Already client-agnostic.**

The `compileCorrespondence()` function accepts:
```
{
  semanticTopologyModel,   // any client's PATH B domain model
  canonicalTopology,       // any client's PATH A structural topology
  semanticCrosswalk,       // any client's crosswalk
  signalRegistry,          // optional — any client's vault signals
  evidenceTrace,           // optional — any client's evidence trace
}
```

There are no client-specific field names, no BlueEdge domain references, no hardcoded domain counts. The engine would compile correspondence for any client that provides these 5 artifact types in the expected schema.

**Risk: None. This layer is clean.**

### Layer 2: Confidence Assessment Logic (`assessConfidence()`)

**Status: Mostly client-agnostic with one implicit assumption.**

The confidence ladder (L1–L5) is based on:
- `lineage_status` values: EXACT, STRONG, PARTIAL, WEAK, NONE
- `confidence` numeric scores with thresholds (0.90, 0.65, 0.50)
- `match_classification` values: EXACT, STRONG, PARTIAL, WEAK
- `activation_state` values: HIGH, ACTIVATED

These are all defined by the crosswalk and signal schemas — not by BlueEdge specifically.

**Implicit assumption:** The confidence thresholds (0.90, 0.65, 0.50) were calibrated against BlueEdge data. For a client with radically different confidence distributions, these thresholds may not produce meaningful stratification. This is not a code dependency — it's a calibration dependency.

**Risk: LOW. Thresholds should become configurable but aren't blocking.**

### Layer 3: Structural Index Builder (`buildStructuralIndex()`)

**Status: Already client-agnostic.**

Supports two topology formats (vault `domains` array and 40.4 `clusters` array). No client-specific logic. Would index any client's canonical topology.

**Risk: None.**

### Layer 4: Artifact Writer (`ReconciliationArtifactWriter.js`)

**Status: Already client-agnostic.**

Writes to `artifacts/sqo/<client>/<run>/reconciliation_correspondence.v1.json`. Path is parameterized by client and run. No hardcoding.

**Risk: None.**

### Layer 5: Compilation Script (`scripts/reconciliation/compile_blueedge_correspondence.js`)

**Status: HARDCODED for BlueEdge.**

```javascript
const CLIENT = 'blueedge';
const RUN_ID = 'run_blueedge_productized_01_fixed';
```

Artifact paths are constructed from these constants. The script is a single-client, single-run executor.

**Risk: HIGH. This is the most obvious hardcoding. Must become manifest-driven or CLI-parameterized.**

### Layer 6: Payload Integration (`GenericSemanticPayloadResolver.js`)

**Status: Client-agnostic in principle, but coupled to manifest artifact availability.**

The reconciliation compilation runs inline during payload resolution. It uses whatever artifacts the manifest loads. No client-specific logic. However:
- The compiler uses `sources.semantic_continuity_crosswalk.data` directly — this artifact is manifest-declared
- The compiler uses `sources.signal_registry` and `sources.evidence_trace` — both optional, both manifest-declared
- The `canonicalTopology` variable is the 40.4 version (clusters), not the vault version (domains) — but the compiler handles both

**Risk: LOW. Works for any client that has the required artifacts in their manifest.**

### Layer 7: SQO Cockpit Integration

**Status: Already client-agnostic.**

The cockpit loads `reconciliation_correspondence.v1.json` from the standard SQO artifact path (`artifacts/sqo/<client>/<run>/`). The formatter, panel, and route are all data-driven.

**Risk: None.**

### Layer 8: Manifest Schema

**Status: Does not yet include reconciliation artifacts.**

The `ClientRunManifestSchema.js` defines required and optional artifact keys. Reconciliation inputs are already covered by existing keys (`semantic_topology_model`, `semantic_continuity_crosswalk`, `canonical_topology_40_4`, `signal_registry`, `evidence_trace`). The reconciliation output (`reconciliation_correspondence`) is loaded by the cockpit from the SQO artifact directory, not from the manifest.

**Risk: LOW. Manifest already covers inputs. Output is handled by the cockpit loader.**

---

## 3. Boundary Summary

| Component | Client-Agnostic? | BlueEdge Risk | Action Required |
|-----------|-------------------|---------------|-----------------|
| `compileCorrespondence()` | YES | None | None |
| `assessConfidence()` | MOSTLY | Threshold calibration | Make thresholds configurable |
| `buildStructuralIndex()` | YES | None | None |
| `ReconciliationArtifactWriter` | YES | None | None |
| `compile_blueedge_correspondence.js` | NO — HARDCODED | Script is BlueEdge-only | Generalize to manifest-driven |
| `GenericSemanticPayloadResolver` integration | YES | None | None |
| SQO cockpit integration | YES | None | None |
| Manifest schema | YES | None | None |

**Bottom line:** The engine is reusable. The orchestration around it (specifically the compile script) is not. The confidence thresholds are implicitly calibrated against BlueEdge but not structurally bound to it.
