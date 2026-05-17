# Historical 17 Domain Recovery

> **The exact 17 semantic domains, their origin, structural correspondence, and grounding status.**

---

## 1. The 17 Semantic Domains

Source: `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/topology/semantic_topology_model.json`
Generation: `PI.LENS.SEMANTIC-TOPOLOGY-REBUILD.02` — DETERMINISTIC_RECONSTRUCTION
Original construction: `build_semantic_layer.py` (41.1), date 2026-03-20

| ID | Domain Name | Type | Cluster | Structural DOM | Lineage | Confidence | Reconciliation |
|---|---|---|---|---|---|---|---|
| DOMAIN-01 | Edge Data Acquisition | FUNCTIONAL | CLU-01 | DOM-13 svg_agents | EXACT | 0.95 | RECONCILED |
| DOMAIN-02 | Telemetry Transport and Messaging | INFRASTRUCTURE | CLU-04 | — | NONE | 0.0 | UNRECONCILED |
| DOMAIN-03 | Fleet Core Operations | FUNCTIONAL | CLU-02 | — | NONE | 0.0 | UNRECONCILED |
| DOMAIN-04 | Fleet Vertical Extensions | FUNCTIONAL | CLU-02 | — | NONE | 0.0 | UNRECONCILED |
| DOMAIN-05 | Analytics and Intelligence | FUNCTIONAL | CLU-01 | — | NONE | 0.0 | UNRECONCILED |
| DOMAIN-06 | AI/ML Intelligence Layer | FUNCTIONAL | CLU-01 | — | NONE | 0.0 | UNRECONCILED |
| DOMAIN-07 | Sensor and Security Ingestion | FUNCTIONAL | CLU-01 | — | NONE | 0.0 | UNRECONCILED |
| DOMAIN-08 | Real-Time Streaming and Gateway | OPERATIONAL | CLU-04 | — | NONE | 0.0 | UNRECONCILED |
| DOMAIN-09 | Access Control and Identity | CROSS-CUTTING | CLU-05 | — | NONE | 0.0 | UNRECONCILED |
| DOMAIN-10 | Platform Infrastructure and Data | INFRASTRUCTURE | CLU-04 | DOM-04 backend_app_root | STRONG | 0.78 | RECONCILED |
| DOMAIN-11 | Event-Driven Architecture | CROSS-CUTTING | CLU-04 | DOM-07 backend_events | PARTIAL | 0.65 | UNRECONCILED |
| DOMAIN-12 | SaaS Platform Layer | OPERATIONAL | CLU-05 | — | NONE | 0.0 | UNRECONCILED |
| DOMAIN-13 | External Integration | INTEGRATION | CLU-05 | — | NONE | 0.0 | UNRECONCILED |
| DOMAIN-14 | Frontend Application | FUNCTIONAL | CLU-05 | DOM-10 frontend | EXACT | 0.92 | RECONCILED |
| DOMAIN-15 | EV and Electrification | FUNCTIONAL | CLU-03 | — | NONE | 0.0 | UNRECONCILED |
| DOMAIN-16 | Operational Engineering | INFRASTRUCTURE | CLU-03 | DOM-11 load_tests | STRONG | 0.93 | RECONCILED |
| DOMAIN-17 | Extended Operations and Driver Services | FUNCTIONAL | CLU-02 | — | NONE | 0.0 | UNRECONCILED |

---

## 2. Domain Origin — How They Were Formed

### Construction Method (from `BLUEEDGE.SEMANTIC.PROVENANCE.RECOVERY.01`)

The 17 domains were constructed through a **four-stage reverse engineering and semantic elevation process**:

**Stage 1 — Architecture Orientation (BlueEdge workspace):**
- Evidence: architecture HTML, PMO dashboard, competitive dashboard, source snapshot
- Output: 7-layer architecture model, 18-CAP v2 taxonomy, 16-domain capability domain map
- Method: ARCHITECTURE_RECONCILIATION — multiple evidence sources converge
- The 16-domain capability map (Fleet Operations, Safety & Compliance, Platform Administration, etc.) is the conceptual precursor to the 17 DOMAIN-NN

**Stage 2 — Source Enumeration (run_02_blueedge, 40.x):**
- Evidence: `app.module.ts` direct reading
- Output: 89 entities (BM-001..BM-064 NestJS modules, CE-001..003, SA-001/002, INF-001..004)
- Method: DECLARATIVE enumeration — no semantic grouping yet

**Stage 3 — Derivation Bundle (run_03_blueedge — ABSENT, reconstructed):**
- Evidence: second reading of `app.module.ts` with emphasis on session comment strings
- Output: 89 COMP-NN + component_model.md + intent_inference_map.md (IIM-NN) + relationship_map.md + execution_paths.md
- Method: developer-authored session comment labels served as primary categorical grouping signal
- Session comments: "Session 23: Multi-Tenant SaaS" → IIM-06, "Session 24: Integration Layer" → IIM-07

**Stage 4 — Semantic Construction (41.1, 2026-03-20):**
- Input: Stage 3 derivation bundle (COMP, CAP, IIM, relationships, execution paths)
- Output: 17 DOMAIN-NN, 42 CAP-NN, 89 COMP-NN
- Method: COMP→CAP by functional purpose; CAP→DOMAIN by semantic purpose
- Grouping basis: session comment membership + source code placement + IIM intent validation
- Ratio: 89 components → 42 capabilities (2.12:1) → 17 domains (5.24:1)

### Key Quote from Provenance Recovery:

> "Developer-authored session comment labels in `app.module.ts` served as the primary categorical grouping signal; these labels were formalized as intent declarations (IIM-NN); the 89 NestJS modules were then assigned to 42 functional capabilities and 17 semantic domains based on functional purpose, source code placement, session comment membership, and intent validation."

---

## 3. Did Domains Pre-Exist Grounding?

**YES.** The 17 semantic domains were constructed ENTIRELY from upstream evidence through the 41.1 semantic layer. They pre-existed any structural grounding computation.

The structural grounding came LATER:
1. PATH A (40.x) produced 13 structural DOM groups from CEU path-prefix grouping
2. The crosswalk mapped DOM-XX → DOMAIN-XX
3. The ReconciliationCorrespondenceCompiler assessed correspondence
4. The SemanticActorHydrator computed grounding ratio
5. Q-class was derived from the ratio

Domains were NEVER derived from structure. Structure was reconciled AGAINST domains.

---

## 4. Which 4 Were Structurally Grounded

| Domain | Structural Basis | Evidence Chain |
|---|---|---|
| DOMAIN-01 Edge Data Acquisition | DOM-13 svg_agents | COMP-73 (sensor_collector.py) + COMP-74 (hasi_bridge.py) → svg-agents directory → structural match |
| DOMAIN-10 Platform Infrastructure | DOM-04 backend_app_root | COMP-01 (blueedge-platform Monorepo) → CAP-29 (Platform Monorepo Container) → app.module.ts + main.ts |
| DOMAIN-14 Frontend Application | DOM-10 frontend | App.tsx + index.html + main.tsx → frontend directory → direct path match |
| DOMAIN-16 Operational Engineering | DOM-11 load_tests | COMP-88 (CI/CD Workflows) + COMP-66 (HealthModule) → CAP-39/40 → load-tests + health + CI/CD |

### Why Only 4

The 13 structural DOM groups (from CEU path-prefix grouping of 35 curated nodes) represent **structural file boundaries** — directory-level groupings of source code files.

The 17 semantic domains represent **functional execution domains** — business capability groupings derived from session comments, component relationships, and intent declarations.

These are DIFFERENT ONTOLOGIES. A structural DOM answers "what files live together?" A semantic DOMAIN answers "what business capability does this serve?" The 13 DOMs do not 1:1 map to the 17 DOMAINs because:

- **DOM-09 backend_modules** (6 CEU nodes) spans at least DOMAIN-03 (Fleet Core), DOMAIN-04 (Fleet Vertical), DOMAIN-06 (AI/ML), DOMAIN-09 (Access Control), DOMAIN-12 (SaaS), and DOMAIN-17 (Driver Services). A single structural directory contains the implementation of 6+ semantic domains.
- **DOMAIN-02 Telemetry Transport** (MQTT, Kafka, Flink) has no structural presence in the extracted source — it exists as architecture-declared infrastructure, not as extractable source code files.
- **DOMAIN-03 Fleet Core Operations** contains capabilities scattered across backend_modules subdirectories — the structural grouping never subdivides to this functional granularity.

---

## 5. The 13 Semantic-Only Domains

| Domain | Why No Structural Backing |
|---|---|
| DOMAIN-02 Telemetry Transport | Architecture-declared (MQTT/Kafka/Flink); source code not in evidence boundary |
| DOMAIN-03 Fleet Core Operations | Functional capabilities inside backend_modules; structural path doesn't subdivide |
| DOMAIN-04 Fleet Vertical Extensions | Same — inside backend_modules |
| DOMAIN-05 Analytics and Intelligence | Same — inside backend_modules |
| DOMAIN-06 AI/ML Intelligence Layer | Same — inside backend_modules |
| DOMAIN-07 Sensor and Security Ingestion | Backend-side ingestion modules; structurally inside backend_modules |
| DOMAIN-08 Real-Time Streaming | Gateway/WebSocket modules; structurally inside backend_modules |
| DOMAIN-09 Access Control and Identity | Auth/guard modules; structurally inside backend_common and backend_modules |
| DOMAIN-11 Event-Driven Architecture | Partial crosswalk (0.65) but below RECONCILED threshold. DOM-07 exists but single-node. |
| DOMAIN-12 SaaS Platform Layer | Multi-tenancy/billing modules; structurally inside backend_modules |
| DOMAIN-13 External Integration | External API integrations; structurally inside backend_modules |
| DOMAIN-15 EV and Electrification | Electric vehicle modules; structurally inside backend_modules |
| DOMAIN-17 Extended Operations | Driver/dispatch modules; structurally inside backend_modules |

### Root cause: DOM-09 backend_modules

10 of the 13 unreconciled semantic domains have their implementation INSIDE `backend/src/modules/`. The structural DOM grouping (CEU + path-prefix) produced a single DOM-09 for all of `backend/src/modules/` — 6 curated entry-point nodes, but representing a monolithic structural boundary.

The A5a raw substrate (48 domains) also failed here — it produced DOM-10 `backend_src_modules` with 457 undifferentiated nodes.

The semantic domains subdivide this space by FUNCTIONAL PURPOSE. The structural domains cannot subdivide it because path-prefix grouping treats `backend/src/modules/` as a single structural unit.

This is the fundamental tension between structural topology and semantic topology. Resolving it requires either:
- Sub-module structural decomposition (splitting backend/src/modules by functional boundaries)
- Crosswalk enrichment with module-level structural evidence
- Or accepting that this structural boundary is inherently coarser than the semantic model

---

## 6. Grounding Classification in 41.1 vs Reconciliation

The 41.1 `build_semantic_layer.py` embeds grounding status per domain:

| Domain | 41.1 Grounding | Reconciliation Grounding |
|---|---|---|
| DOMAIN-01 | GROUNDED | RECONCILED (Level 5) |
| DOMAIN-02 | WEAKLY GROUNDED | UNRECONCILED (Level 1) |
| DOMAIN-03 | GROUNDED | UNRECONCILED (Level 1) |
| DOMAIN-10 | WEAKLY GROUNDED | RECONCILED (Level 5) |
| DOMAIN-14 | GROUNDED | RECONCILED (Level 5) |
| DOMAIN-16 | GROUNDED | RECONCILED (Level 5) |

**CRITICAL DISCREPANCY:** The 41.1 grounding status is NOT the same as the reconciliation grounding status.

- 41.1 labels DOMAIN-03 "Fleet Core Operations" as GROUNDED — meaning its 41.1 component anchors (VehiclesModule, DriversModule, etc.) have source code evidence. But those source files all live inside `backend/src/modules/`, which maps to DOM-09 — and DOM-09 is irresolvable in the crosswalk because it covers 6+ semantic domains.

- 41.1 labels DOMAIN-10 "Platform Infrastructure" as WEAKLY GROUNDED — because some of its components (Kafka, PostgreSQL) rely on architecture HTML rather than source files. But it IS reconciled because app.module.ts and main.ts (DOM-04) map cleanly to DOMAIN-10 via the crosswalk.

**The 41.1 grounding is evidence-boundary grounding** (does the source evidence exist?).
**The reconciliation grounding is crosswalk correspondence** (can the structural DOM be mapped to this semantic domain?).

These are different questions producing different answers.
