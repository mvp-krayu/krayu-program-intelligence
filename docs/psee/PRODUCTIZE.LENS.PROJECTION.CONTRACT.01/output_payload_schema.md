# Output Payload Schema
# PRODUCTIZE.LENS.PROJECTION.CONTRACT.01

- Version: 1.0
- Stream: PRODUCTIZE.LENS.PROJECTION.CONTRACT.01
- Date: 2026-04-15

---

## SECTION 1 — SCHEMA CONVENTIONS

All output payloads share a common envelope. Zone-specific and depth-specific fields are explicitly identified. Fields marked `[ZONE-1+]` are forbidden from ZONE-2 outputs. Fields marked `[REQUIRED]` must be present or the payload is invalid.

**Evidence class values:**
- `VERIFIED` — claim is fully traced to a locked artifact with no known gaps
- `CONDITIONAL` — claim is admissible but requires a caveat (e.g., CLM-06 minimum observable state, CLM-10 execution pending)
- `PARTIAL` — evidence chain is present but one or more steps are incomplete (e.g., CLM-24 WEAK confidence)
- `BLOCKED` — claim cannot be projected at the requested zone/depth (see failure_safety_model.md)

**Zone floor for fields:**
- `Z0` — ZONE-0 only (never surfaced in any output)
- `Z1` — ZONE-1 minimum (operators and above); stripped from ZONE-2 output
- `Z2` — ZONE-2 and above (client-safe; all zones)
- `Z3` — ZONE-3 only (audit payloads only)

---

## SECTION 2 — COMMON PAYLOAD ENVELOPE

All projection outputs include this envelope regardless of depth or zone:

```
ProjectionPayload {
  projection_id:    string     [REQUIRED] // "PROJ-{claim_id}-{zone}-{depth}-{hash}"
  claim_id:         string     [REQUIRED] // "CLM-09"
  zone:             string     [REQUIRED] // "ZONE-1" | "ZONE-2" | "ZONE-3"
  depth:            string     [REQUIRED] // "L1" | "L2" | "L3"
  evidence_class:   string     [REQUIRED] // "VERIFIED" | "CONDITIONAL" | "PARTIAL" | "BLOCKED"
  persona:          string     [REQUIRED] // "shared" | "cto" | "ceo" (default: "shared")
  run_id:           string     [REQUIRED] // run basis for this projection
  generated_at:     timestamp  [REQUIRED]
  trace_available:  boolean    [REQUIRED] // true if L2/L3 projections are available
  caveats:          string[]   [REQUIRED] // empty array [] if no caveats — never omitted
  // depth-specific body — see sections below
}
```

---

## SECTION 3 — L1 EXPLANATION PAYLOAD

**Purpose:** Answer "what is this, and what does it mean?" in zone-appropriate vocabulary.

### Schema

```
L1ExplanationPayload extends ProjectionPayload {
  depth: "L1"

  claim_label:    string     [Z2] [REQUIRED]
  // ZONE-2: plain English label only ("Proven Score")
  // ZONE-1: label may include claim_id annotation ("CLM-09 — Proven Structural Score")

  value: {
    raw?:          string    [Z1]   // "60" (numeric/boolean/string) — stripped from ZONE-2
    narrative:     string    [Z2] [REQUIRED]  // "Proven: 60/100"
    unit?:         string    [Z2]   // e.g., "out of 100", "%", "nodes"
  }

  explanation:     string    [Z2] [REQUIRED]
  // ZONE-2: plain-language explanation; no PSEE internals
  // ZONE-1: full technical explanation from vault claim node (may include dimension IDs, axis names)

  source_field?:   string    [Z1]
  // "gauge_state.json → score.canonical" — stripped from ZONE-2

  transformation_summary?:  string  [Z1]
  // "coverage_points(35) + reconstruction_points(25) + completion_points(0) = 60" — stripped from ZONE-2

  stage_of_origin?:  string  [Z1]
  // "S4 — pios compute gauge" — stripped from ZONE-2

  trace_depth_available: string[]  [Z2] [REQUIRED]
  // ["L2", "L3"] — informs consumer which deeper projections are available
}
```

### ZONE-1 L1 Example (CLM-09)

```json
{
  "projection_id": "PROJ-CLM-09-ZONE-1-L1-a3f7c",
  "claim_id": "CLM-09",
  "zone": "ZONE-1",
  "depth": "L1",
  "evidence_class": "VERIFIED",
  "persona": "shared",
  "run_id": "run_authoritative_recomputed_01",
  "trace_available": true,
  "caveats": [],
  "claim_label": "CLM-09 — Proven Structural Score",
  "value": {
    "raw": "60",
    "narrative": "Proven: 60/100",
    "unit": "out of 100"
  },
  "explanation": "The canonical score is computed as coverage_points(35) + reconstruction_points(25) + completion_points(0) = 60. Coverage contributes 35 because structural evidence covers 100% of declared units. Reconstruction contributes 25 because all 30 units pass four-axis validation. Completion is 0 because execution_layer_evaluated=false.",
  "source_field": "gauge_state.json → score.canonical",
  "transformation_summary": "coverage_points(35) + reconstruction_points(25) + completion_points(0) = 60",
  "stage_of_origin": "S4 — pios compute gauge",
  "trace_depth_available": ["L2", "L3"]
}
```

### ZONE-2 L1 Example (CLM-09)

```json
{
  "projection_id": "PROJ-CLM-09-ZONE-2-L1-b8d1e",
  "claim_id": "CLM-09",
  "zone": "ZONE-2",
  "depth": "L1",
  "evidence_class": "VERIFIED",
  "persona": "shared",
  "run_id": "run_authoritative_recomputed_01",
  "trace_available": true,
  "caveats": [],
  "claim_label": "Proven Score",
  "value": {
    "narrative": "Proven: 60/100",
    "unit": "out of 100"
  },
  "explanation": "This score represents the maximum provable from structural analysis alone. The remaining 40 points are earned by runtime execution assessment.",
  "trace_depth_available": ["L2", "L3"]
}
```

### L1 Special Cases

**CONDITIONAL claim (CLM-10 — Projected Score):**
```json
{
  "evidence_class": "CONDITIONAL",
  "caveats": ["Requires runtime execution assessment. This is the achievable ceiling, not a current measurement."],
  "value": {
    "narrative": "Achievable: 100/100",
    "unit": "out of 100"
  }
}
```

**PARTIAL claim (CLM-24 — SIG-005 Coordination Pressure, WEAK confidence):**
```json
{
  "evidence_class": "PARTIAL",
  "caveats": ["Partial evidence — static component confirmed; runtime component pending. Cannot be presented as a fully established finding."],
  "value": {
    "narrative": "Coordination pressure indicated by static analysis"
  }
}
```

---

## SECTION 4 — L2 EVIDENCE PAYLOAD

**Purpose:** Answer "what artifact backs this claim, and who else relies on it?"

### Schema

```
L2EvidencePayload extends ProjectionPayload {
  depth: "L2"

  grounding_artifact: {
    artifact_id:          string    [Z1]   // "ART-01" — stripped from ZONE-2
    artifact_name:        string    [Z1]   // "gauge_state.json" — stripped from ZONE-2
    artifact_path?:       string    [Z1]   // full repo path — stripped from ZONE-2
    artifact_role:        string    [Z2] [REQUIRED]
    // ZONE-2: plain English role ("Terminal computation output")
    // ZONE-1: "Terminal output of the S0→S4 execution chain. Single artifact consumed by GAUGE."
    artifact_description: string    [Z2] [REQUIRED]
    producing_step?:      string    [Z1]   // "pios compute gauge (S4)" — stripped from ZONE-2
  }

  co_grounded_claims: [
    {
      claim_id:     string    [Z1]   // "CLM-10" — stripped from ZONE-2
      claim_label:  string    [Z2] [REQUIRED]
      // ZONE-2 label only; ZONE-1 includes claim_id
    }
  ]

  upstream_artifacts?: [           // ZONE-1 only — not surfaced in ZONE-2
    {
      artifact_id:    string  [Z1]
      artifact_name:  string  [Z1]
      relationship:   string  [Z1]  // "CONSUMES" | "DERIVES_FROM"
    }
  ]
}
```

### ZONE-2 L2 Example (CLM-09)

```json
{
  "projection_id": "PROJ-CLM-09-ZONE-2-L2-c9f2a",
  "claim_id": "CLM-09",
  "zone": "ZONE-2",
  "depth": "L2",
  "evidence_class": "VERIFIED",
  "caveats": [],
  "grounding_artifact": {
    "artifact_role": "Terminal computation output",
    "artifact_description": "The final output of the assessment computation chain. Contains all scores, dimensions, and execution state."
  },
  "co_grounded_claims": [
    { "claim_label": "Achievable Score" },
    { "claim_label": "Score Band" },
    { "claim_label": "Score Confidence Range" },
    { "claim_label": "Execution Status" }
  ],
  "trace_available": true
}
```

---

## SECTION 5 — L3 AUDIT PAYLOAD

**Purpose:** Answer "what is the complete evidence chain, and are there any known gaps?"

L3 is ZONE-3 only. A ZONE-1 or ZONE-2 request for L3 depth must be rejected with `ProjectionError { reason: "ZONE_INSUFFICIENT_FOR_L3" }`.

### Schema

```
L3AuditPayload extends ProjectionPayload {
  depth: "L3"
  zone: "ZONE-3"  // enforced — L3 requires ZONE-3

  full_trace: {
    source_fields:          string[]    // ["gauge_state.json → score.canonical"]
    artifact_paths:         string[]    // repo-relative paths of grounding artifacts
    transformation_id:      string      // "TRN-03"
    transformation_name:    string      // "Score Computation"
    transformation_command: string      // "pios compute gauge (S4)"
    derivation?:            string      // "0 + 35 + 25 = 60"
    input_artifact_ids:     string[]    // ["ART-02", "ART-03"]
    upstream_chain:         string      // human-readable chain description
  }

  known_gaps: [
    {
      gap_id:         string    // "GAP-01"
      description:    string    // description of the gap
      impact:         string    // what the gap affects
      status:         string    // "OPEN" | "RESOLVED" | "ACCEPTED"
    }
  ]

  blocking_conditions: [
    {
      condition_id:   string
      description:    string
      resolution:     string
    }
  ]

  traceability_status:    string    // "FULL" | "PARTIAL" | "BLOCKED"
  audit_confirmed:        boolean
  locked_baseline_tag:    string    // "evidence-vault-builder-v1"
}
```

### L3 Example (CLM-25 — Executive Verdict, showing known gap)

```json
{
  "projection_id": "PROJ-CLM-25-ZONE-3-L3-d4a8b",
  "claim_id": "CLM-25",
  "zone": "ZONE-3",
  "depth": "L3",
  "evidence_class": "CONDITIONAL",
  "caveats": ["CONCEPT-06 predicate mismatch. EXECUTION verdict requires correction before production deployment."],
  "full_trace": {
    "source_fields": ["concepts.json → CONCEPT-06 predicate", "gauge_state.json → state.execution_status"],
    "artifact_paths": [
      "app/gauge-product/lib/business-ontology/concepts.json",
      "clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/gauge_state.json"
    ],
    "transformation_id": "TRN-06",
    "transformation_name": "Concept Resolution",
    "transformation_command": "GAUGE resolver.js",
    "input_artifact_ids": ["ART-01", "ART-04"],
    "upstream_chain": "gauge_state.json + canonical_topology.json → resolver.js → concept predicate evaluation → phrase resolution → three-axis verdict"
  },
  "known_gaps": [
    {
      "gap_id": "GAP-01",
      "description": "CONCEPT-06 predicate uses 'PHASE_1_ACTIVE'. Stream 10 schema has execution_status='NOT_EVALUATED'. Predicate will not match.",
      "impact": "EXECUTION verdict may render as VERIFIED rather than UNKNOWN on recomputed run.",
      "status": "OPEN"
    }
  ],
  "blocking_conditions": [],
  "traceability_status": "FULL",
  "audit_confirmed": true,
  "locked_baseline_tag": "evidence-vault-builder-v1"
}
```

---

## SECTION 6 — CLAIM SET PAYLOAD

When a `ClaimSetProjectionRequest` is resolved, the output is a `ClaimSetPayload`:

```
ClaimSetPayload {
  claim_set_id:     string     [REQUIRED]  // "SCORE_ZONE"
  zone:             string     [REQUIRED]
  depth:            string     [REQUIRED]
  generated_at:     timestamp  [REQUIRED]
  run_id:           string     [REQUIRED]
  items:            ProjectionPayload[]    // ordered per claim_set definition
  set_evidence_class: string   [REQUIRED]
  // "VERIFIED" if all items VERIFIED
  // "CONDITIONAL" if any item CONDITIONAL
  // "PARTIAL" if any item PARTIAL
  // "BLOCKED" if any item BLOCKED
  set_caveats:      string[]   [REQUIRED]  // union of all item caveats
}
```

The `set_evidence_class` is the minimum evidence class across all items in the set. It represents the weakest link.

---

## SECTION 7 — FIELD ZONE FLOOR TABLE

This table is the authoritative field-level classification for all projection fields. It is derived from `gauge_lens_exposure_governance.md` §2 and §7 and `lens_v1_content_model.md` §2 and §3.

| field category | specific fields | zone floor | notes |
|---------------|----------------|-----------|-------|
| Score values | value.raw (score number) | Z2 | Safe as "60/100" or "Proven: 60" |
| Score derivation | transformation_summary | Z1 | Formula: "0+35+25=60" — operator only |
| Source field paths | source_field | Z1 | "gauge_state.json → score.canonical" |
| Artifact paths | artifact_path | Z1 | Full repo path — operator/audit only |
| Artifact IDs | artifact_id | Z1 | "ART-01" — internal reference |
| Artifact names | artifact_name | Z1 | "gauge_state.json" — technical |
| Artifact roles | artifact_role | Z2 | Plain-language role is client-safe |
| Claim IDs | claim_id | Z1 | "CLM-09" — internal reference |
| Claim labels | claim_label | Z2 | Plain-language labels are client-safe |
| Explanation (Z2 form) | explanation (narrative) | Z2 | No PSEE internals |
| Explanation (Z1 form) | explanation (technical) | Z1 | May include DIM-XX, axis names |
| DIM-XX identifiers | any DIM-XX field | Z1 | Replace with labels at ZONE-2 |
| Execution status (raw) | execution_status code | Z1 | "NOT_EVALUATED" — internal state |
| Execution status (narrative) | execution narrative | Z2 | "Runtime assessment pending" |
| Signal statement | signal.statement | Z1 | Contains CEU refs, PSEE internals |
| Signal business_impact | signal.business_impact | Z2 | Client-safe verbatim |
| Signal risk | signal.risk | Z2 | Client-safe verbatim |
| Signal confidence_rationale | signal.confidence_rationale | Z1 | Contains INTEL/DIAG/COND IDs |
| Signal source_refs | signal.source_refs | Z1 | Internal evidence IDs |
| Signal title | signal.title | Z2 | Client-safe |
| Signal confidence label | evidence_confidence label | Z2 | STRONG/MODERATE/PARTIAL EVIDENCE |
| Signal ID | signal_id | Z1 | "SIG-001" — internal reference |
| Concept IDs | concept_id | Z1 | "CONCEPT-01" — internal reference |
| Predicate logic | concepts.json predicate | Z1 | Operator language |
| Phrase outputs | phrases.json output | Z2 | Resolved phrase text is client-safe |
| Axis names | COMPLETENESS etc. | Z1 | CTO persona may access at ZONE-2 |
| Terminal state labels | S-13, S-T3 | Z1 | Internal PSEE state machine |
| Projection rule codes | PR-NOT-EVALUATED | Z1 | Internal rule identifiers |
| CEU file names | hasi_bridge.py etc. | Z0 | Never surface in any payload |
| Confidence status code | SPLIT_EXECUTION_NOT_EVALUATED | Z1 | Internal status code |
| Full trace | full_trace block | Z3 | Audit only |
| Known gaps | known_gaps block | Z3 | Audit only — but must not SUPPRESS |
| Locked baseline tag | locked_baseline_tag | Z2 | Safe as provenance reference |

**Authority:** PRODUCTIZE.LENS.PROJECTION.CONTRACT.01
