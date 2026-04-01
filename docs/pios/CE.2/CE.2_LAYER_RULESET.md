# CE.2 — Layer Ruleset

**Stream:** CE.2 — PiOS Core Engine Internal Contract
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** canonical-layer-model.md (00.2), CE.2_CORE_EXECUTION_MODEL.md

---

## Layer Rules

Each layer entry defines: authorized inputs, authorized outputs, responsibilities, and explicit prohibitions.

---

### 40.5 — Signal Computation

**Canonical layer:** L3 (Derivation Layer)

**Authorized inputs:**
- 40.4 AT/DT telemetry metric values (via load_40_4_intake or equivalent)
- Program constants derived from 40.4 structural telemetry
- Derivation normalization rules (NF-01..NF-07)
- ESI and RAG derivation specifications

**Authorized outputs:**
- Normalization function values (NF-01..NF-07): [0.0, 1.0] or UNDEFINED
- PES signal values (PES-ESI-01..PES-ESI-05): [0.0, 1.0] or UNDEFINED
- ESI composite value: [0, 100] or UNDEFINED, with mode (FULL/PARTIAL) and warnings
- RAG component values (RAG_rate, RAG_accel, RAG_cross): [-1.0, 1.0] or INSUFFICIENT_WINDOWS
- RAG composite value: [-100, 100] or INSUFFICIENT_WINDOWS
- ESI manifest (JSON handoff to subsequent layers)

**Responsibilities:**
- Apply governed normalization functions to telemetry observations
- Compute PES signals from normalized inputs
- Apply PARTIAL mode when CG-01 (no cost telemetry) is active
- Propagate UNDEFINED status when required inputs are missing
- Detect INSUFFICIENT_WINDOWS for RAG when N < 2

**Prohibitions:**
- Must NOT invent signal values heuristically
- Must NOT smooth over UNDEFINED inputs
- Must NOT generate semantic meaning from signal values
- Must NOT access 40.6–40.11 outputs
- Must NOT modify 40.4 inputs

---

### 40.6 — Condition Activation

**Canonical layer:** L3 (Derivation Layer)

**Authorized inputs:**
- 40.5 signal primitives (ESI value, mode, PES signals, RAG components)
- Governed condition threshold definitions

**Authorized outputs:**
- Condition activation records: structured state descriptors per signal
- Condition state enumeration: e.g., STABLE / DEGRADING / RECOVERING / INSUFFICIENT_DATA
- PARTIAL condition records where input signals are UNDEFINED

**Responsibilities:**
- Map signal values to governed condition states using defined threshold rules
- Produce one condition record per activated signal
- Mark conditions as PARTIAL where signal input is UNDEFINED or INSUFFICIENT_WINDOWS
- Record which threshold rule activated each condition

**Prohibitions:**
- Must NOT generate explanation language
- Must NOT produce causal claims ("because of X, Y happened")
- Must NOT rank conditions by business importance
- Must NOT reference 40.7–40.11 outputs
- Must NOT introduce thresholds beyond governed definitions

---

### 40.7 — Diagnosis and Intelligence Synthesis

**Canonical layer:** L3 boundary / L4 entry

**Authorized inputs:**
- 40.6 condition activation records
- 40.5 signal primitives (for evidence anchoring)
- Governed diagnosis model definitions

**Authorized outputs:**
- Evidence-bound diagnosis structures: condition mapping, evidence reference, gap declaration
- Intelligence packets: structured, evidence-bound assemblies of condition states and their evidence chains
- PARTIAL diagnosis records where condition inputs are PARTIAL or INSUFFICIENT_DATA

**Responsibilities:**
- Synthesize condition states into structured diagnosis outputs
- Preserve explicit evidence chain from 40.4 → 40.5 → 40.6 → 40.7 in every output
- Produce intelligence packets that remain structured and non-narrative
- Declare gaps explicitly — do not fill with inference

**Prohibitions:**
- Must NOT generate narrative prose or executive language
- Must NOT rank findings by strategic importance
- Must NOT interpret cause-and-effect without governed causal model
- Must NOT recompute signals from 40.5
- Must NOT expand beyond the evidence chain received from 40.5 and 40.6

---

### 40.8 — Delivery Packaging

**Canonical layer:** L4 boundary / L5 entry

**Authorized inputs:**
- 40.7 diagnosis structures and intelligence packets

**Authorized outputs:**
- Delivery packages: evidence-bound, lineage-preserving, schema-governed output bundles
- Package manifests: metadata declaring contents, evidence references, PARTIAL/UNDEFINED flags

**Responsibilities:**
- Assemble 40.7 outputs into delivery-ready packages without altering content
- Preserve evidence lineage, uncertainty state, and PARTIAL flags in packaging
- Add manifest metadata (run ID, layer chain, input source, timestamps)
- Produce packages consumable by downstream systems without requiring downstream recomputation

**Prohibitions:**
- Must NOT change the meaning of any 40.7 output during packaging
- Must NOT suppress or omit PARTIAL or UNDEFINED flags
- Must NOT introduce new semantic framing
- Must NOT modify evidence references
- Must NOT perform signal recomputation

---

### 40.9 — Feedback Registration

**Canonical layer:** L3

**Authorized inputs:**
- 40.7 diagnosis structures (for recurrence and gap identification)
- 40.8 delivery events (for coverage tracking)

**Authorized outputs:**
- Feedback registration records:
  - Recurrence log: repeated condition activations across windows
  - Unknown space log: inputs that remain UNDEFINED across runs
  - Coverage pressure log: areas with persistent PARTIAL states
  - Gap log: explicit declaration of unresolvable evidence gaps (e.g., CG-01)

**Responsibilities:**
- Register structural patterns in condition states across windows
- Explicitly log coverage gaps without resolving them
- Record unknown space as a named, structured artifact
- Produce one feedback registration record per pipeline run

**Prohibitions:**
- Must NOT prioritize feedback by business importance
- Must NOT interpret why gaps exist
- Must NOT recommend remediation actions
- Must NOT generate narrative text
- Must NOT access 40.10 or 40.11 outputs

---

### 40.10 — Orchestration Directive Formation

**Canonical layer:** L3 / L4

**Authorized inputs:**
- 40.9 feedback registration records
- Governed orchestration rule set (defined rules only)

**Authorized outputs:**
- Orchestration directives: structured control instructions derived from governed rules
- Directive manifest: declaring which rules triggered which directives

**Responsibilities:**
- Apply governed rule set to feedback registration records
- Produce directives as structured control outputs (not recommendations or advice)
- Record which feedback record triggered each directive
- Mark directives as CONDITIONAL where triggering input was PARTIAL

**Prohibitions:**
- Must NOT make autonomous decisions outside governed rule set
- Must NOT invent rules not present in governed rule set
- Must NOT produce free-form recommendations
- Must NOT access semantic or narrative layers
- Must NOT access 40.11 outputs

---

### 40.11 — Loop Closure and Integrity Validation

**Canonical layer:** L8 (Governance, Contract, and Validation Layer)

**Authorized inputs:**
- Outputs of 40.5, 40.6, 40.7, 40.8, 40.9, 40.10
- 40.4 input contract lock (input_contract_lock.json)
- Baseline identity lock (baseline_identity_lock.json)
- Governing contracts and validation rules

**Authorized outputs:**
- Loop closure assertion: COMPLETE / PARTIAL / FAIL
- Integrity validation record: per-layer completeness and adherence check
- Scope adherence declaration: confirmation that Core did not violate boundary rules
- Traceability completeness report: evidence chain from 40.4 through 40.10

**Responsibilities:**
- Validate that each layer produced its required outputs
- Validate that no layer violated its prohibitions (to the extent detectable from outputs)
- Assert whether the full Core execution chain closed with complete or partial evidence
- Confirm input contract integrity (40.4 hashes match frozen contract)
- Produce a durable closure record for governance audit

**Prohibitions:**
- Must NOT expand execution scope
- Must NOT reinterpret outputs from prior layers
- Must NOT generate narrative closure language
- Must NOT modify any prior layer output
- Must NOT assert completeness where evidence gaps remain unresolved
