# PICP Positioning in the Stack

**Stream:** PI.COGNITION-ANATOMY.RECONCILIATION.01
**Classification:** G1 (Architecture Defining)
**Date:** 2026-05-31

---

## 1. THE QUESTION

Is PICP:

- Core architecture?
- A cognition package?
- A transport mechanism?
- A container?
- Something else?

---

## 2. WHAT PICP IS

PICP is a **cognition packaging layer** — a transport container that extracts, names, and formalizes structured cognition from the CIP into a portable, deterministic, projection-independent format.

### Evidence for "packaging layer":

**A. PICP is produced FROM something.**
PICP is produced by PICR from CIP. It does not originate cognition — it extracts and packages cognition that already exists in the fullReport, synthesisResult, consequenceResult, and other CIP components.

**B. PICP is consumed BY something.**
PRE consumes PICP to produce audience-specific renderings. PICP exists to serve downstream consumers. It is an intermediate artifact, not a terminal one.

**C. PICP is not the only path.**
Today, all 5 personas consume the CIP directly (via fullReport). PICP is a formalization of what the system already does implicitly. If PICP never existed, the system would still work — it just would not have a named, portable, versionable cognition layer.

**D. PICP adds three properties that the CIP lacks.**

| Property | CIP | PICP |
|----------|-----|------|
| **Portability** | Tied to runtime (resolver produces it on-demand) | Self-contained, can be serialized and transmitted |
| **Diffability** | No — fullReport is ~180 fields mixed across concerns | Yes — 9 named objects with defined schemas |
| **Versionability** | No — recomputed each request | Yes — frozen per pipeline run, comparable across runs |

### PICP is NOT core architecture because:

**Core architecture** would be something the system cannot function without. The system CAN function without PICP — the 22 cognitive functions execute, personas render, SQO qualifies, Chronicle certifies, and Spine carries continuity. PICP adds packaging capability, not cognitive capability.

### PICP is NOT just a transport mechanism because:

**A transport mechanism** moves data without adding semantic structure. PICP adds semantic structure — it defines 9 named cognition objects, each answering a distinct cognitive question, each passing a 7-gate constitutional test. This naming and qualification is architecturally meaningful.

---

## 3. WHERE PICP SITS IN THE STACK

### 3.1 Pipeline Position

```
L0: External Evidence Source
L1: Ingestion (40.2 → 40.4)
L2: Evidence Navigation + Signal Derivation
L3: Synthesis + Consequence Compilation
    ──────────────────────────────────────
    CIP (L0–L3 Assembly)
    ──────────────────────────────────────
L4: PICR → PICP (Cognition Packaging)          ← HERE
    ──────────────────────────────────────
L5: PRE (Projection Rendering — 75.x)
    ──────────────────────────────────────
```

PICP sits between the evidence/intelligence computation (L0–L3) and the audience projection (L5). It is the boundary where raw computed intelligence becomes named, qualified, portable cognition.

### 3.2 Runtime Stratum Position

PICP does not map cleanly to a single runtime stratum:

| Runtime Stratum | PICP Relationship |
|----------------|-------------------|
| Stratum A (Deterministic Cognition) | CIP inputs to PICR are produced here |
| Stratum B (Orchestration) | Not involved |
| Stratum C (Continuity) | Spine feeds CIP; PICP snapshots could be stored as Spine objects |
| Stratum D (Qualification) | SQO state feeds into structural_posture; PICP could be the unit that SQO qualifies |
| Stratum E (Projection) | PRE consumes PICP |

PICP is a **cross-stratum artifact** — it is PRODUCED by Stratum A (deterministic computation), ENRICHED by Stratum C (Spine continuity data), QUALIFIED by Stratum D (SQO authority), and CONSUMED by Stratum E (projection).

### 3.3 Cognition Anatomy Position

In the cognition anatomy hierarchy:

```
GOVERNED COGNITION (center of gravity)
    ├── 22 Cognitive Functions (what the system DOES)
    ├── Temporal Continuity (what the system REMEMBERS)
    ├── Cognition Packaging (what the system DELIVERS)  ← PICP HERE
    └── Cognition Qualification (what the system EARNS)
```

PICP is one of four satellite systems serving Governed Cognition. It is the DELIVERY mechanism.

---

## 4. WHAT PICP ENABLES

| Capability | Without PICP | With PICP |
|-----------|-------------|-----------|
| Executive rendering | Works (personas consume CIP directly) | Works (personas consume PICP through PRE) |
| Temporal comparison | Not possible (CIP is recomputed per request) | Possible (PICP is frozen per run, diffable) |
| External delivery | Not possible (CIP is tied to LENS runtime) | Possible (PICP can be serialized as JSON, transmitted) |
| Cognition versioning | Not possible (no formal snapshot format) | Possible (PICP + pipeline_run_id = versioned cognition) |
| Multi-format rendering | Possible but messy (each format reads fullReport differently) | Clean (each PRE projection family reads the same PICP schema) |
| Marketplace delivery | Awkward (each module produces ad-hoc output) | Clean (each module contributes to a shared PICP, PRE renders per family) |
| Cognition auditing | Partial (CIP fields are implicit and mixed) | Full (9 named objects, each with defined schemas) |

### The commercial value of PICP:

PICP enables the **two-axis marketplace model:**
- **Axis 1:** Domain Cognition Modules (Software, Healthcare, Legal...) each produce domain-specific conditions and consequences that feed PICP
- **Axis 2:** Projection Families (Report, Briefing, Memo, Assessment...) each consume the same PICP and render differently

Without PICP, each module × family combination would need custom wiring. With PICP, the interface is standardized: modules produce CIP → PICR produces PICP → PRE renders per family.

---

## 5. WHAT PICP DOES NOT DO

| Claim | Reality |
|-------|---------|
| "PICP is the architecture" | PICP is an artifact PRODUCED by the architecture |
| "PICP is the center of gravity" | Governed Cognition (22 functions) is the center; PICP is one of four satellites |
| "PICP replaces the CIP" | PICP is PRODUCED FROM CIP; CIP continues to exist |
| "PICP replaces the fullReport" | fullReport is a CIP component; PICP extracts from it but does not replace it |
| "Personas should consume PICP directly" | Personas consume through PRE (L5); PICP is the input to PRE, not to personas |
| "PICP formalization is the next critical priority" | Governed Cognition (22 functions), Spine materialization, and Chronicle operationalization are architecturally prior |
| "Building materializers should come first" | Understanding what cognitive act each materializer serves should come first |

---

## 6. CORRECT SEQUENCING

The PICP-focused streams identified the correct destination but skipped the architectural prerequisites:

### What the PICP streams established (correctly):

1. L4/L5 separation — constitutionally valid
2. 9 cognition objects — pass 7-gate qualification
3. Consumption baseline — 8/9 already in LENS
4. Formalization is extraction, not construction

### What should happen BEFORE PICP formalization:

**Step 1: Ensure the 22 cognitive functions are complete and correct.**
The cognitive functions are the SOURCE of the cognition that PICP packages. If a function is missing, broken, or incomplete, PICP will package incomplete cognition. The consumption baseline map already identified 3 consumption gaps (trajectory_assessment, absence_profile, detection_boundary absent from all personas). These gaps exist in the cognitive functions, not in PICP.

**Step 2: Materialize Spine objects.**
7 of 8 Spine object classes show 0 objects. Spine feeds CIP, which feeds PICR. If Spine is empty, PICP loses its temporal dimension. The `executive_projection_snapshots` Spine class is where temporal PICP comparison would live — it requires Spine materialization.

**Step 3: Then formalize PICP extraction.**
With cognitive functions working and Spine populated, PICP extraction becomes thin materializers (30–80 lines each, per the consumption baseline map) that name and package what the system already produces.

**Step 4: Then build PRE.**
With PICP formalized, PRE becomes a configuration-driven rendering engine that maps PICP cognition objects to audience-specific deliverables through ProjectionConfig.

### This sequence preserves the PICP work while restoring architectural altitude.

---

## 7. VERDICT

PICP is a **cognition packaging layer** — architecturally legitimate, commercially essential, but NOT the center of gravity and NOT the first priority.

Its correct position:

- **In the hierarchy:** One of four satellite systems serving Governed Cognition
- **In the pipeline:** L4, between CIP and PRE
- **In the runtime:** Cross-stratum artifact (produced by A, enriched by C, qualified by D, consumed by E)
- **In the sequence:** Step 3 of 4, after cognitive function completion and Spine materialization
- **In the marketplace:** The standardized interface between Domain Modules and Projection Families
