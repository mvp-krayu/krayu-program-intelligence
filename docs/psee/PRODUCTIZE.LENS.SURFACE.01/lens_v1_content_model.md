# LENS v1 Content Model
# PRODUCTIZE.LENS.SURFACE.01

- Version: 1.0
- Stream: PRODUCTIZE.LENS.SURFACE.01
- Date: 2026-04-15

---

## SECTION 1 — LENS v1 PURPOSE

LENS v1 is the first client-deliverable surface of the PiOS assessment system. Its purpose is to project the execution chain's outputs to a non-technical client audience in a form that is:

1. Accurate — every claim is backed by a vault node that traces to an artifact
2. Honest — caveats for partial evidence, unknown states, and pending assessments are always present
3. Intelligible — no PSEE internals, no engineering vocabulary, no internal IDs
4. Bounded — it shows only what can be shown; it does not fill gaps with invented narrative

LENS v1 does NOT introduce new claims. It does NOT interpret beyond what the evidence supports. It does NOT generate business narrative from scratch — every sentence it produces is sourced from a vault node or vault governance rule.

---

## SECTION 2 — ALLOWED CONTENT CLASSES

Content is allowed in LENS v1 if and only if it satisfies all five admissibility conditions:
1. Traces to a verified vault artifact
2. Does not overstate or understate actual measured state
3. Uses vocabulary appropriate for a non-technical executive audience
4. Carries all required caveats
5. Full evidence chain is available for ZONE-3 audit access

| content class | allowed | source | caveats required |
|---------------|---------|--------|-----------------|
| Proven score (60) | YES | CLM-09 | "maximum provable from structural analysis" |
| Achievable score (100) | YES | CLM-10 | "requires running execution assessment" |
| Score band (CONDITIONAL) | YES — narrative form | CLM-11 | "floor proven, ceiling contingent" |
| Score range [60, 100] | YES | CLM-12 | "lower: proven; upper: achievable" |
| Coverage completeness (100%) | YES | CLM-01 | none |
| Reconstruction verdict (PASS) | YES — "structural consistency confirmed" | CLM-03 | none |
| Execution status (pending) | YES — narrative only | CLM-13 | "not a deficiency; assessment is incomplete" |
| Domain count (17) | YES | CLM-14 | none |
| Capability count (42) | YES | CLM-15 | none |
| Component count (89) | YES | CLM-16 | none |
| Total node count (148) | YES | CLM-27 | domain names only; no component-level names |
| Domain names (17 names) | YES | CLM-27 | none |
| Signal count (5) | YES | CLM-18 | none |
| Signal confidence distribution | YES — with label explanation | CLM-19 | confidence labels must be explained |
| Signal title | YES | CLM-20..24 | none |
| Signal business_impact | YES | CLM-20..24 | WEAK confidence (SIG-005) must be marked |
| Signal risk | YES | CLM-20..24 | WEAK confidence (SIG-005) must be marked |
| Signal evidence_confidence label | YES | CLM-20..24 | WEAK must be explained |
| Three-axis verdict | YES | CLM-25 | CONCEPT-06 fix required before deployment |
| Business phrase outputs | YES | CLM-26 | phrase output only; no concept_ids |
| Unknown-space count (0) | CONDITIONAL | CLM-06 | "minimum observable state, not proven zero" |
| Heuristic compliance | CONDITIONAL | CLM-08 | CTO audience only |

---

## SECTION 3 — PROHIBITED CONTENT CLASSES

Content is prohibited from LENS v1 if it violates any of the five admissibility conditions, primarily C2 (audience-appropriateness) or C4 (caveat completeness).

| prohibited content | source location | why prohibited |
|-------------------|----------------|----------------|
| `signal.statement` | signal_registry.json | Contains CEU references (hasi_bridge.py), dimension IDs, PSEE internals. Not interpretable without PSEE knowledge. |
| `signal.confidence_rationale` | signal_registry.json | Contains INTEL/DIAG/COND/SIG IDs, stream numbers, scoring model details. Operator/auditor only. |
| `signal.source_refs` (INTEL/DIAG/COND/SIG IDs) | signal_registry.json | Internal evidence reference IDs. No client meaning. |
| `signal.trace_links` | signal_registry.json | Internal path references. Operator/audit only. |
| `signal_id` (e.g., "SIG-001") | signal_registry.json | Internal ID. Use signal title instead. |
| `DIM-XX` identifiers | gauge_state.json | Internal PSEE dimension codes. Replace with labels: "Coverage", "Reconstruction". |
| `execution_status: NOT_EVALUATED` raw string | gauge_state.json | Internal state machine label. Replace with: "Runtime execution assessment is pending." |
| `execution_mode: STRUCTURAL_ONLY` | gauge_state.json | Internal execution mode code. |
| `PHASE_1_ACTIVE` | gauge_state.json (legacy schema) | Internal state machine label. |
| `S-13`, `S-T3` | dimension derivation fields | PSEE terminal state codes. No client meaning. |
| `PR-NOT-EVALUATED`, `PR-02` | projection.rule field | Internal projection rule identifiers. |
| Reconstruction axis names verbatim | reconstruction_state.json | COMPLETENESS/STRUCTURAL_LINK/REFERENTIAL_INTEGRITY/LAYER_CONSISTENCY differ from everyday meaning without explanation. |
| `confidence.status: SPLIT_EXECUTION_NOT_EVALUATED` | gauge_state.json | Internal confidence status code. Replace with: "Score confidence range: 60 to 100. Floor is proven. Ceiling is achievable upon execution assessment." |
| CEU file names | admissibility_log.json, component_names | Code artifact filenames (e.g., `hasi_bridge.py`). Confusing without engineering context. |
| `run_id` in raw form | gauge_state.json | Internal run identifier. Use "authoritative assessment run" or date instead. |
| Concept IDs (CONCEPT-01..19) | concepts.json | Internal concept identifiers. Use phrase output only. |
| Predicate logic | concepts.json | DIM-01.coverage_percent == 100 — engineering syntax. |
| Projection.rule detail | gauge_state.json | "PR-NOT-EVALUATED assumes execution completes to maximum structural state" — too technical. |
| Axis result table (verbatim) | reconstruction_state.json | COMPLETENESS: PASS — OK for CTO only; replace with "structural coherence verified" for general LENS. |
| score.components raw breakdown | gauge_state.json | completion_points(0) + coverage_points(35) + reconstruction_points(25) — OK for ZONE-1; LENS uses narrative summary. |

---

## SECTION 4 — EXECUTIVE OVERVIEW SCHEMA

The executive overview is the LENS v1 landing view. It must answer in one screen: "What do we know, what is the score, what matters?"

**Required blocks (in order):**

```
BLOCK 1 — IDENTITY
  - Assessment subject: [client name]
  - Basis: Structural assessment (run [date or run label])

BLOCK 2 — SCORE
  - Proven: [score_canonical]/100
  - Caption: "The maximum provable from structural analysis alone."
  - Achievable: [score_projected]/100
  - Caption: "Requires completing runtime execution assessment."

BLOCK 3 — THREE-AXIS VERDICT
  - STRUCTURE · [verdict] — [one-sentence plain-language explanation]
  - COMPLEXITY · [verdict] — [one-sentence plain-language explanation]
  - EXECUTION · [verdict] — [one-sentence plain-language explanation]
  [Required caveat if EXECUTION=UNKNOWN: "Pending — not a deficiency. Assessment is incomplete until execution runs."]

BLOCK 4 — KEY FINDING
  - [SIG-002 framing: "Seven operational dimensions of this platform cannot be determined from structural analysis alone. Runtime assessment is required."]
  - [List the 7 dimensions in plain language — NOT using any of the technical dimension names]

BLOCK 5 — SIGNAL INDICATORS
  - [For each STRONG signal]: [title] · STRONG · [business_impact text]
  - [For each MODERATE signal]: [title] · MODERATE · [business_impact text]
  - [For each WEAK signal]: [title] · PARTIAL EVIDENCE · [business_impact text] · [required caveat: "Runtime validation pending."]

BLOCK 6 — STRUCTURAL FOOTPRINT
  - [domain_count] functional areas
  - [capability_count] capability surfaces
  - [component_count] components mapped
  - "No structural overlaps in the canonical model."

BLOCK 7 — WHAT COMES NEXT
  - "Runtime execution assessment will complete the score and resolve the seven unknown dimensions."
  - Score confirmation: "[score_canonical] is proven today. [score_projected] is achievable when execution runs."
```

**Required caveats that must appear somewhere in the overview:**
1. Projected score caveat (Block 2)
2. Execution verdict caveat (Block 3)
3. WEAK signal caveat for SIG-005 (Block 5)
4. SIG-006 minimum observable state caveat if CLM-06 is surfaced

---

## SECTION 5 — CURATED CLAIMS SCHEMA

LENS v1 exposes a curated subset of the 27 claims. Not all 27 claims are appropriate for the client surface.

**Tier 1 — Always surface:**

| claim | lens label | zone-2 value |
|-------|-----------|-------------|
| CLM-09 | Proven Score | {score_canonical}/100 |
| CLM-10 | Achievable Score | {score_projected}/100 |
| CLM-01 | Coverage | {coverage_percent:.0f}% — all structural evidence present |
| CLM-25 | Executive Verdict | STRUCTURE · {structure_verdict} / COMPLEXITY · {complexity_verdict} / EXECUTION · {execution_verdict} |
| CLM-21 | Platform Runtime State | Seven operational dimensions are currently unknown |

**Tier 2 — Surface with context:**

| claim | lens label | zone-2 value | context required |
|-------|-----------|-------------|-----------------|
| CLM-13 | Execution Status | Runtime execution assessment is pending | "Not a deficiency — assessment is incomplete until execution runs." |
| CLM-12 | Score Range | Confidence range: {confidence_lower} to {confidence_upper} | "Floor is proven. Ceiling is achievable." |
| CLM-18 | Signal Count | {total_signals} intelligence signals derived | Brief explanation of what a signal is |
| CLM-19 | Signal Confidence | STRONG:{n}, MODERATE:{n}, WEAK:{n} | Explanation of confidence levels |
| CLM-11 | Score Band | Floor established, ceiling defined | Narrative only; raw band label is ZONE-1 |

**Tier 3 — Available on request / drill-down only:**

| claim | available via | restriction |
|-------|--------------|-------------|
| CLM-03 (reconstruction) | Drill-down or CTO request | "Structural consistency confirmed" — axis names may appear for CTO |
| CLM-06 (unknown-space) | Drill-down | Must carry minimum observable state caveat |
| CLM-08 (heuristic) | CTO request only | "Structural patterns conform" |
| CLM-14/15/16 (topology counts) | Structural footprint block | Safe as summary numbers |

**Not surfaced in LENS v1:**
- CLM-02, CLM-04, CLM-05, CLM-07 — derived/invariant; low executive value
- CLM-17 — cross-domain overlaps; requires envelope explanation
- CLM-27 — node inventory; domain names only in LENS

---

## SECTION 6 — SIGNAL NARRATIVE SCHEMA

For each signal in LENS v1:

```
SIGNAL DISPLAY SCHEMA

title: [signal.title — required]
confidence_label: [STRONG | MODERATE | PARTIAL EVIDENCE]
  [If WEAK: add "(partial evidence — runtime validation pending)"]

business_impact: [signal.business_impact verbatim — required]
risk: [signal.risk verbatim — required]

[NOT displayed: signal_id, statement, confidence_rationale, source_refs, trace_links, component_names]
[domain_name and capability_name: optional; only if client-recognizable]
```

**SIG-002 special handling:**
SIG-002 ("Platform Runtime State: Seven Core Dimensions Are Currently Unknown") is the most commercially significant signal. It must appear prominently, not buried in a list. Its business_impact text is ZONE-2 safe and directly client-presentable:

> "The entire observable CE-001 platform runtime — cache performance, event delivery, fleet connectivity, alert processing, and driver session scoring — operates as a structural unknown; any operational decision about platform health or capacity lacks an evidence base."

This text is sourced from `signal_registry.json → signals[SIG-002].business_impact`. It is not generated. It is not summarized. It is reproduced as-is.

**SIG-005 required caveat:**
SIG-005 (Coordination Pressure) must display: "One signal has partial evidence — the static coordination structure suggests elevated sharing, but runtime validation is not yet complete." This is the exact language from `governance/LENS Admissibility.md`.

---

## SECTION 7 — EVIDENCE REFERENCE PATTERN

LENS v1 provides evidence references without exposing raw artifact paths.

**Pattern for evidence reference in ZONE-2 output:**

```
[Claim statement]
Backed by: Structural assessment evidence (verified)
[On request / ZONE-3]: Full evidence chain available for audit.
```

**Never:**
```
[Claim statement]
Source: clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/gauge_state.json → score.canonical
```

The distinction: ZONE-2 audiences should know the claim is evidenced, not how to navigate the artifact tree. ZONE-3 audiences see the full path.

For ZONE-3 audit packages, the vault provides full traceability including: artifact paths, field names, transformation chains, source run IDs.

---

## SECTION 8 — EXPORT RELATIONSHIP

LENS v1 exports are structured documents derived from the executive overview schema.

**Export format:** PDF or structured HTML
**Content:** Blocks 1–7 from the executive overview schema (Section 4)
**Evidence appendix:** ZONE-3 package attached for technical reviewers

**Export must include:**
- All required caveats from Section 4
- Assessment date and run basis
- Statement: "This assessment is based on structural evidence only. Runtime execution assessment is pending."
- No invented narrative — every sentence is sourced from a vault node

**Export must NOT include:**
- Any ZONE-1 content without explicit ZONE-3 labeling
- Raw artifact paths in the main body (appendix only)
- PSEE internal identifiers in the main body

---

## SECTION 9 — ZONE-2 ENFORCEMENT RULES

These rules are mandatory for any system that generates or renders LENS v1 content:

**Rule L-01:** Every block rendered in LENS must trace to a vault claim node with `lens_admissible: YES` or `lens_admissible: CONDITIONAL` (with caveat present).

**Rule L-02:** Claims with `lens_admissible: CONDITIONAL` may only appear if the required caveat is present in the same rendered block. The caveat may not be deferred to a footnote.

**Rule L-03:** No field from `signal_registry.json` other than `title`, `business_impact`, `risk`, `evidence_confidence`, `domain_name`, and (conditionally) `capability_name` may appear in ZONE-2 output.

**Rule L-04:** The EXECUTION verdict must not render until CONCEPT-06 predicate in `concepts.json` is updated to include `NOT_EVALUATED`. Until then, render EXECUTION verdict as "UNKNOWN — pending assessment" with explanation: "This verdict requires a predicate correction before it can be automatically derived. It is manually confirmed as UNKNOWN based on `execution_status = NOT_EVALUATED`."

**Rule L-05:** All DIM-XX identifiers must be replaced with their labels: DIM-01 → "Coverage", DIM-02 → "Reconstruction", DIM-03 → "Escalation Clearance", DIM-04 → "Unknown-Space", DIM-05 → "Intake Completeness", DIM-06 → "Heuristic Compliance".

**Rule L-06:** The projected score must always appear with the caveat from Rule L-02. It cannot be presented as an achieved score or a near-term projection without qualification.

**Rule L-07:** Component names (e.g., `RedisCacheModule`, `FleetEventsModule`, `hasi_bridge.py`) are ZONE-0 and must not appear in ZONE-2 output, even in context.

**Rule L-08:** The score derivation formula (`0 + 35 + 25 = 60`) is ZONE-1 and must not appear in ZONE-2 output. Use narrative summary only.

**Authority:** PRODUCTIZE.LENS.SURFACE.01
