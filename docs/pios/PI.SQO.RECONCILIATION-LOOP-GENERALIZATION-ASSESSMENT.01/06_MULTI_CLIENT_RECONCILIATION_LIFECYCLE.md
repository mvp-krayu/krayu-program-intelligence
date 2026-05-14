# Multi-Client Reconciliation Lifecycle Proposal

**Stream:** PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01

---

## 1. What Changes for Multi-Client

The reconciliation engine is reusable. The lifecycle question is operational: **what does each client go through, in what order, with what infrastructure?**

---

## 2. Client Lifecycle States (Reconciliation View)

```
NOT_ONBOARDED → EVIDENCE_INTAKE → STRUCTURAL_ANALYSIS → SEMANTIC_CONSTRUCTION → RECONCILABLE → RECONCILED → PROGRESSIVE
```

| State | Description | What Exists | Reconciliation Available |
|-------|-------------|-------------|--------------------------|
| NOT_ONBOARDED | Client not registered | Nothing | NO |
| EVIDENCE_INTAKE | Source material provided, pipeline running | Evidence artifacts | NO |
| STRUCTURAL_ANALYSIS | PATH A pipeline complete | canonical_topology, signal_registry, evidence_trace | NO |
| SEMANTIC_CONSTRUCTION | PATH B domain model constructed | semantic_topology_model, crosswalk | NO (but close) |
| RECONCILABLE | All 5 artifacts available | Full artifact set | YES — compiler can run |
| RECONCILED | Correspondence compiled, operator approved | reconciliation_correspondence artifact | YES — visible in runtime |
| PROGRESSIVE | Ongoing reconciliation improvement (AI, evidence, grounding) | Updated artifacts | YES — improving over time |

---

## 3. What the System Needs for Each Client

### Minimum Viable Reconciliation (get from NOT_ONBOARDED to RECONCILABLE)

| Requirement | Source | Effort |
|------------|--------|--------|
| Codebase access | Client provides | Client action |
| Structural topology pipeline run | PATH A tooling | Automated |
| Semantic domain model | AI-assisted + human review | Primary effort |
| Crosswalk mapping | AI-assisted + human review | Part of semantic construction |
| Manifest file | Template-based creation | ~5 minutes |
| Registry entry | One-line code change | ~1 minute |

### What the Framework Does (no per-client code)
- Validates manifest
- Loads artifacts
- Compiles correspondence
- Produces payload with reconciliation_summary
- Renders cockpit section
- Tracks qualification state

### What Each Client Provides (client semantic material)
- Business domain names
- Domain boundaries
- Capability groupings
- Business context for crosswalk labels

---

## 4. Generalized Compilation Orchestration

The current `compile_blueedge_correspondence.js` becomes a manifest-driven compilation tool:

```
scripts/reconciliation/compile_correspondence.js
  --client=<client>
  --run=<run>
  [--thresholds=<file>]       # optional confidence threshold overrides
  [--dry-run]                 # assess without writing artifact
```

Or, batch-compile all registered clients:

```
scripts/reconciliation/compile_all.js
  # iterates REGISTRY, compiles for each client/run pair
```

**No code change per client.** Adding a client is: manifest + registry entry + artifacts + compile.

---

## 5. Configuration vs. Code Boundary

| Layer | Config (per-client) | Code (framework, shared) |
|-------|---------------------|--------------------------|
| Client identity | Manifest `client` + `run_id` | Manifest schema validation |
| Artifact paths | Manifest `artifacts.required` + `artifacts.optional` | GenericSemanticArtifactLoader |
| Confidence thresholds | Optional override file | Default thresholds in assessConfidence() |
| Business labels | In crosswalk data | SemanticCrosswalkMapper |
| Domain model | In semantic_topology_model.json | CompileCorrespondence() |
| Qualification state | In qualification_state.v1.json | SQOCockpitStateResolver |
| Runtime visibility | Data-driven rendering | ReconciliationCorrespondencePanel |

**Rule: If it's about the client's business, it's configuration/data. If it's about how reconciliation works, it's code.**

---

## 6. Multi-Client Runtime Architecture

```
                                    MANIFEST REGISTRY
                                    ┌──────────────┐
                                    │ blueedge: {...}│
                                    │ clientB: {...} │
                                    │ clientC: {...} │
                                    └──────┬───────┘
                                           │
                        ┌──────────────────┼──────────────────┐
                        │                  │                  │
                  ┌─────▼─────┐     ┌─────▼─────┐     ┌─────▼─────┐
                  │ BlueEdge  │     │ Client B  │     │ Client C  │
                  │ Artifacts │     │ Artifacts │     │ Artifacts │
                  └─────┬─────┘     └─────┬─────┘     └─────┬─────┘
                        │                  │                  │
                        ▼                  ▼                  ▼
                 ┌──────────────────────────────────────────────────┐
                 │         SHARED RECONCILIATION ENGINE              │
                 │                                                  │
                 │  compileCorrespondence()                         │
                 │  assessConfidence()                              │
                 │  buildStructuralIndex()                          │
                 │  buildCrosswalkBridge()                          │
                 │  CONFIDENCE_LEVELS                               │
                 └──────────────────────────────────────────────────┘
                        │                  │                  │
                        ▼                  ▼                  ▼
                 ┌──────────────────────────────────────────────────┐
                 │         SHARED RUNTIME SURFACE                    │
                 │                                                  │
                 │  GenericSemanticPayloadResolver                  │
                 │  SQOCockpitArtifactLoader                       │
                 │  ReconciliationCorrespondencePanel               │
                 │  SQO Navigation / Routing                       │
                 └──────────────────────────────────────────────────┘
```

---

## 7. What Becomes the Reconciliation Loop

The "reconciliation loop" is the progressive cycle of:

1. **Compile** — run the compiler against current artifacts
2. **Assess** — review the reconciliation ratio, identify L1 targets
3. **Improve** — add evidence, improve crosswalk, run AI reconstruction on L1 domains
4. **Re-compile** — run the compiler again with improved artifacts
5. **Approve** — human operator approves the improved correspondence
6. **Advance** — if reconciliation ratio crosses threshold, qualify for HYDRATED → RECONCILED transition

This loop is **per-client, per-run**. Each client independently cycles through the loop at its own pace. The framework infrastructure (compiler, cockpit, LENS) is shared.

### Loop termination conditions

- **RECONCILED achieved:** Reconciliation ratio exceeds the governance-defined threshold + human operator approves
- **Diminishing returns:** Remaining L1 domains are genuinely unmappable (structural evidence doesn't exist for the semantic concept)
- **Client decision:** Operator accepts the current reconciliation state as commercially sufficient

---

## 8. What Must NOT Happen

| Anti-pattern | Why | Mitigation |
|-------------|-----|------------|
| Universal semantic compiler | Trying to build one model that generates semantic topology for any codebase automatically | The domain model is client-specific semantic material, not a compiler output |
| Reconciliation as qualification gate | Blocking all SQO progression on reconciliation completion | HYDRATED is a legitimate operational state; reconciliation is an enhancement, not a prerequisite |
| Client-specific compiler forks | Creating `compile_clientB_correspondence.js` for each client | One manifest-driven compiler serves all clients |
| AI confidence inflation | AI proposals getting L4/L5 confidence | AI output is capped at L3 by design |
| Reconciliation ratio comparisons between clients | "Client B has 60% reconciliation, BlueEdge has 23%" | Ratio depends on evidence availability, not operational quality |

---

## 9. Implementation Sequence

If multi-client reconciliation were prioritized, the work order would be:

| Step | Effort | Description |
|------|--------|-------------|
| 1. Generalize compile script | ~1 hour | CLI args instead of hardcoded CLIENT/RUN_ID |
| 2. Add threshold configuration | ~30 min | Options object in compileCorrespondence() |
| 3. Document evidence intake contract | ~2 hours | Schema docs for what a new client must provide |
| 4. Template manifest for new clients | ~30 min | Template + HOWTO for manifest creation |
| 5. Client B onboarding | Variable | Depends on client's evidence availability and semantic complexity |

Steps 1–4 are framework work. Step 5 is per-client semantic material production — the actual bottleneck.
