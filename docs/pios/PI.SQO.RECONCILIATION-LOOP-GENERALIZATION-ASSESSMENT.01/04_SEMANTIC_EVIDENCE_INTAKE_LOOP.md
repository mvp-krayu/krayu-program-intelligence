# Future Semantic Evidence Intake Loop Definition

**Stream:** PI.SQO.RECONCILIATION-LOOP-GENERALIZATION-ASSESSMENT.01

---

## 1. The Problem This Solves

The reconciliation compiler is reusable. The question is: **how does a new client get from zero to having the 5 artifacts the compiler consumes?**

BlueEdge's artifacts were produced through 6+ months of iterative stream execution (40.x evidence pipelines, 41.x semantic construction, crosswalk recovery, signal computation, vault assembly). That process was BlueEdge-specific, discovery-driven, and non-replayable for a new client.

The evidence intake loop defines the repeatable, client-agnostic onboarding process that produces the required artifacts for any client.

---

## 2. Reconciliation Evidence Intake Architecture

```
CLIENT ONBOARDING TRIGGER
         │
         ▼
┌─────────────────────────────────┐
│  STAGE 1: Evidence Intake       │
│                                 │
│  Input:  Client source material │
│          (codebase, docs, etc.) │
│                                 │
│  Output: Raw evidence artifacts │
│          (HTML, topology, etc.) │
│                                 │
│  Owner:  Evidence corridor      │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  STAGE 2: Structural Analysis   │
│           (PATH A)              │
│                                 │
│  Input:  Raw evidence           │
│                                 │
│  Output: canonical_topology     │
│          signal_registry        │
│          evidence_trace         │
│                                 │
│  Owner:  PATH A pipeline        │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  STAGE 3: Semantic Construction │
│           (PATH B)              │
│                                 │
│  Input:  Raw evidence +         │
│          structural topology    │
│                                 │
│  Output: semantic_topology_model│
│          crosswalk              │
│                                 │
│  Owner:  PATH B pipeline        │
│          (includes AI-assisted  │
│           reconstruction here)  │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  STAGE 4: Reconciliation        │
│           Correspondence        │
│                                 │
│  Input:  All 5 artifacts from   │
│          Stages 2 + 3           │
│                                 │
│  Output: reconciliation_        │
│          correspondence.v1.json │
│                                 │
│  Owner:  Reconciliation         │
│          compiler (REUSABLE)    │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  STAGE 5: SQO Qualification     │
│                                 │
│  Input:  Correspondence +       │
│          existing SQO artifacts │
│                                 │
│  Output: Updated qualification  │
│          state, S-state,        │
│          progression gates      │
│                                 │
│  Owner:  SQO engine (REUSABLE)  │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  STAGE 6: Runtime Visibility    │
│                                 │
│  Input:  Correspondence +       │
│          qualification state    │
│                                 │
│  Output: LENS v2 payload,       │
│          SQO cockpit data       │
│                                 │
│  Owner:  LENS / cockpit         │
│          (REUSABLE)             │
└─────────────────────────────────┘
```

---

## 3. What Each Stage Requires for a New Client

### Stage 1: Evidence Intake

**Input contract:**
- A codebase URL or snapshot (Git repository, or archived source tree)
- Optional: existing documentation, architecture diagrams, stakeholder descriptions

**Output contract:**
- Evidence HTML files placed in `artifacts/sqo/<client>/<run>/evidence-ingestion/`
- Evidence manifest (`evidence_manifest.json`)
- Raw topology data (structural_topology_log, ceu_node_map)

**Who does the work:** This is the evidence corridor — currently a semi-manual pipeline involving code analysis tooling. For scaling, this becomes the first AI-assisted automation target.

### Stage 2: Structural Analysis (PATH A)

**Input contract:**
- Raw topology data from Stage 1

**Output contract:**
- `canonical_topology.json` — structural DOM groups with node mapping
- `signal_registry.json` — computed pressure signals (PSIG-*)
- `evidence_trace.json` — traceability chains from raw evidence to vault

**Who does the work:** The existing PATH A pipeline (DPSIG computation, topology analysis, vault assembly). This is already deterministic and replayable. For a new client, it runs against the new client's topology data.

### Stage 3: Semantic Construction (PATH B)

**Input contract:**
- Raw evidence from Stage 1
- Structural topology from Stage 2

**Output contract:**
- `semantic_topology_model.json` — semantic domain model with domain IDs, types, clusters, lineage status, confidence
- `semantic_continuity_crosswalk.json` — mapping between structural DOMs and semantic domains

**Who does the work:** This is where the semantic material is created. For BlueEdge, this was done through iterative manual streams. For new clients, this is the AI-assisted reconstruction insertion point (see deliverable 5).

**Critical distinction:** The *schema* of these artifacts is reusable. The *content* is client-specific semantic material. The framework defines what shape the semantic topology model must have. The client's onboarding process fills in the actual business domains.

### Stage 4: Reconciliation Correspondence

**Input contract:** All 5 artifacts from Stages 2 + 3
**Output contract:** `reconciliation_correspondence.v1.json`
**Who does the work:** The reconciliation compiler. Already reusable. Already replayable.

### Stage 5–6: SQO + Runtime Visibility

**Already reusable.** No new client-specific work needed beyond providing the artifacts.

---

## 4. Client Manifest as Intake Contract

The manifest system (`app/execlens-demo/lib/lens-v2/manifests/`) is the natural intake contract boundary. For a new client:

1. **Create a client/run directory structure:**
   ```
   clients/<client>/psee/runs/<run>/
     semantic/topology/semantic_topology_model.json
     semantic/crosswalk/semantic_continuity_crosswalk.json
     vault/canonical_topology.json
     vault/signal_registry.json
     vault/evidence_trace.json
   artifacts/sqo/<client>/<run>/
     [SQO qualification artifacts]
   ```

2. **Create a manifest file:**
   ```
   app/execlens-demo/lib/lens-v2/manifests/<client>.<run>.json
   ```

3. **Register in the manifest registry:**
   ```javascript
   // manifests/index.js REGISTRY
   <client>: {
     <run>: '<client>.<run>.json',
   },
   ```

4. **Run the correspondence compiler.**

5. **The rest follows automatically** — LENS v2 payload includes reconciliation_summary, SQO cockpit shows the reconciliation section.

---

## 5. Evidence Intake Boundaries

### What the framework provides (reusable):
- Artifact schema definitions (what shape the JSON must have)
- Manifest validation (ensuring required artifacts are present)
- Correspondence compilation
- Confidence assessment
- Runtime visibility

### What the client must provide (per-client):
- Raw source evidence (codebase access)
- Structural analysis output (PATH A pipeline result)
- Semantic domain model (PATH B construction result)
- Crosswalk mapping (bridge between structural and semantic)

### What must NOT be provided by the framework:
- Business domain definitions ("what are your semantic domains?")
- Domain naming ("what do you call this cluster?")
- Capability taxonomies ("what capabilities does this codebase have?")
- Business context ("what does this organization do?")

These are client semantic material. They are the output of evidence intake, not the input to the framework. The framework's job is to process whatever semantic material the intake produces — not to generate it.

---

## 6. Correspondence Persistence Model

| Artifact | Path | Lifecycle | Replay |
|----------|------|-----------|--------|
| `reconciliation_correspondence.v1.json` | `artifacts/sqo/<client>/<run>/` | Regenerated on re-compilation | Deterministic — same inputs, same output |
| `reconciliation_summary` in payload | In-memory, computed per request | Ephemeral | Deterministic |
| SQO cockpit reconciliation section | Server-side rendered from artifact | Follows artifact lifecycle | Follows artifact |

Correspondence is always replayable. It is a computed artifact, not a stateful record. Deleting it and re-running the compiler produces identical results.
