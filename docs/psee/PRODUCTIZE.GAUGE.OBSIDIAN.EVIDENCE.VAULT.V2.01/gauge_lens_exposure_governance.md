# GAUGE + LENS Exposure Governance Specification
# PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01

- Version: 1.0
- Stream: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01
- Date: 2026-04-15

---

## SECTION 1 — GOVERNING PRINCIPLE

Not everything traceable should be client-visible.
Everything visible must be traceable.

This is not a preference — it is an architectural constraint. Client-safe claims are those that can be explained without exposing operational detail that could be misinterpreted, that lack meaningful context for a non-technical audience, or that carry confidentiality risk. But every claim that reaches a client must trace backward to a verified artifact chain. No inference, no interpolation, no invented narrative.

**The four exposure zones:**

| zone | id | definition |
|------|-----|-----------|
| Full Internal Trace Reality | ZONE-0 | Everything the vault knows. Not exposed directly to any audience. The ground truth layer. |
| Operator Surface (GAUGE) | ZONE-1 | Technical operators, platform engineers, CTOs. Full dimension detail, axis results, raw scores, execution state. |
| Client Surface (LENS) | ZONE-2 | Client executives, non-technical decision-makers. Summary metrics, signal business_impact, narrative phrases, score range. No raw artifact names, no PSEE internals. |
| Audit / Evidence Vault | ZONE-3 | Auditors, client technical representatives, forensic verification. Full evidence chain, blocking conditions, traceability maps. |

---

## SECTION 2 — CLAIM EXPOSURE MATRIX

For each claim identified in the inventory, this section assigns the governing exposure zone.

| claim_id | claim_label | ZONE-0 | ZONE-1 (GAUGE) | ZONE-2 (LENS) | ZONE-3 (Audit) | notes |
|----------|-------------|--------|---------------|---------------|----------------|-------|
| CLM-01 | Coverage Completeness (100%) | YES | YES — full % | YES — summary | YES | Safe: headline metric |
| CLM-02 | Structural Unit Count (30/30) | YES | YES — exact count | SUMMARY ONLY — "30 core elements" | YES | Individual unit names: ZONE-0/3 only |
| CLM-03 | Reconstruction State (PASS) | YES | YES | YES — "structural consistency confirmed" | YES | Audience-appropriate rephrasing required |
| CLM-04 | Reconstruction Axis Results (4×PASS) | YES | YES — full axis table | ZONE-2: YES (CTO) / NO (CEO) | YES | Axis names are technical — phrased narratively for LENS |
| CLM-05 | Escalation Clearance (CLEAR) | YES | YES | YES — "no blocking conditions found" | YES | Derivation rule (S-13 invariant) is ZONE-1 only |
| CLM-06 | Unknown-Space Count (0) | YES | YES — with caveat | CONDITIONAL — caveat must be surfaced | YES | Caveat: minimum observable state, not proven zero |
| CLM-07 | Intake Completeness (COMPLETE) | YES | YES | YES — "all source data received" | YES | Invariant derivation is ZONE-1 only |
| CLM-08 | Heuristic Compliance (PASS) | YES | YES — CTO | CONDITIONAL (audience: cto per concepts.json) | YES | "Structural patterns conform" — CTO-only in concepts.json |
| CLM-09 | Canonical Score (60) | YES | YES — with derivation | YES — "Proven Score: 60" | YES | Score derivation detail is ZONE-1 |
| CLM-10 | Projected Score (100) | YES | YES — with rule | YES — "Achievable: 100 if execution completes" | YES | Caveat (execution not yet run) must accompany LENS surface |
| CLM-11 | Score Band (CONDITIONAL) | YES | YES | YES — "floor established, ceiling defined" | YES | Band label raw text is ZONE-1; narrative form for LENS |
| CLM-12 | Confidence Range [60, 100] | YES | YES | YES — "score range confirmed" | YES | Status value SPLIT_EXECUTION_NOT_EVALUATED: ZONE-1 only |
| CLM-13 | Execution Status (NOT_EVALUATED) | YES | YES — full state | YES — "execution layer pending" | YES | Raw status string ZONE-1; narrative for LENS |
| CLM-14 | Domain Count (17) | YES | YES | YES | YES | Safe: topology summary |
| CLM-15 | Capability Count (42) | YES | YES | YES | YES | Safe: topology summary |
| CLM-16 | Component Count (89) | YES | YES | YES | YES | Safe: topology summary |
| CLM-17 | Cross-Domain Overlaps (0 canonical / 2 envelope) | YES | YES — both models | ZONE-2: YES for canonical 0; CONDITIONAL for envelope 2 | YES | If envelope overlaps are surfaced in LENS, must explain what OVL-01/OVL-02 mean |
| CLM-18 | Signal Registry Total (5) | YES | YES | YES | YES | Safe: count |
| CLM-19 | Signal Confidence Distribution | YES | YES — full dist | YES — "STRONG:2, MODERATE:2, WEAK:1" with explanation | YES | Confidence terminology requires explanation for LENS |
| CLM-20 | SIG-001: Sensor Bridge Throughput | YES | YES — full | YES — business_impact (no technical detail) | YES | statement + confidence_rationale: ZONE-1/3 only |
| CLM-21 | SIG-002: Seven Unknown Dimensions | YES | YES — full | YES — business_impact + risk | YES | "Seven operational dimensions are currently unknown" — powerful LENS claim |
| CLM-22 | SIG-003: Dependency Load 68% | YES | YES — full | YES — business_impact (ratio in context) | YES | "15 of 22 architectural connections are load-bearing" |
| CLM-23 | SIG-004: Structural Volatility | YES | YES — full | YES — business_impact | YES | Metric values (1.273, etc.) are ZONE-1; narrative for LENS |
| CLM-24 | SIG-005: Coordination Pressure | YES | YES — with WEAK caveat | CONDITIONAL — WEAK confidence must be surfaced | YES | Cannot claim "coordination pressure confirmed" — static component only |
| CLM-25 | Executive Three-Axis Verdict | YES | YES | YES — primary LENS surface | YES | STRUCTURE/COMPLEXITY/EXECUTION verdicts are LENS-first |
| CLM-26 | Business Ontology Phrase Set | YES | YES — concept resolution detail | YES — phrase output only | YES | Predicate logic and concept_ids: ZONE-1/3 only |
| CLM-27 | Full Node Inventory (148 nodes) | YES | YES — via topology explorer | ZONE-2: domain names only | YES | Component-level names may be too technical for non-CTO |

---

## SECTION 3 — ENTITY FAMILY EXPOSURE POLICY

| entity_family | ZONE-1 (GAUGE) | ZONE-2 (LENS) | rationale |
|---------------|---------------|---------------|-----------|
| Structural Units (30 CEUs) | Count (30) + admissibility status | Count only ("30 core structural elements") | Individual file names are technical artifacts not meaningful to executives |
| Topology Nodes (148) | Full node explorer with IDs, names, depths | Domain names only (17 domain names as named areas) | Component-level names (COMP-64: "RedisCacheModule") are too technical; domain names ("Platform Infrastructure") are business-meaningful |
| Signals (5) | Full: title, statement, confidence, rationale, source_refs | title + business_impact + risk + evidence_confidence class | statement and confidence_rationale contain technical PSEE internals (CEU refs, dimension IDs) |
| Business Concepts (19) | Full predicate evaluation detail | Resolved phrase output only | Predicate logic (DIM-01.coverage_percent == 100) is operator language |
| Reconstruction Axes (4) | Full axis names and pass/fail | CONDITIONAL — CTO audience: axis names + verdicts | COMPLETENESS/STRUCTURAL_LINK/etc. are technical terms |
| Score Components (3) | Full: completion/coverage/reconstruction points | Narrative: "structural evidence contributes 60 points; execution layer can add up to 40" | Individual component_points are explainable but formula detail is ZONE-1 |
| Dimensions (DIM-01..06) | Full: all 6 dimensions with values | CONDITIONAL: DIM-01/02/03 (summary); DIM-04/05/06 contextual | DIM-04 caveat must accompany; DIM-05/06 are invariants |

---

## SECTION 4 — WHAT IS "TOO RAW" AND WHY

| raw information | reason not client-safe without treatment |
|-----------------|------------------------------------------|
| Individual CEU file names | These are code/artifact filenames (e.g., `hasi_bridge.py`). Meaningful to engineers; confusing or misleading without full context to executives. |
| PSEE terminal state (S-13, S-T3) | Internal state machine labels. No client meaning. Should be replaced by execution narrative. |
| Schema version differences (PHASE_1_ACTIVE vs NOT_EVALUATED) | Legacy vs Stream 10 schema gap is a platform evolution detail, not a client observation. |
| Reconstruction axis names verbatim | COMPLETENESS/STRUCTURAL_LINK/REFERENTIAL_INTEGRITY/LAYER_CONSISTENCY have specific technical definitions that differ from everyday usage. Without explanation, they mislead. |
| DIM-XX identifiers | Dimension codes are internal PSEE identifiers. Replace with labels: "Coverage", "Reconstruction", "Escalation Clearance", etc. |
| confidence_rationale text | Contains references to specific INTEL/DIAG/COND/SIG IDs, 40.5/40.6/40.7 streams, and scoring model details. Technical provenance for operators and auditors only. |
| Projection rule (PR-02, PR-NOT-EVALUATED) | Internal rule identifiers. Replace with explanation: "assumes execution completes to maximum structural state". |

---

## SECTION 5 — HOW RAW INFORMATION STAYS TRACEABLE BUT NOT DIRECTLY EXPOSED

The governance model is not "hide it" — it is "govern the path to it."

For every piece of information in ZONE-0 or ZONE-1, there must be a path to it from ZONE-2/3 that respects the exposure policy:

1. **Summary claim (ZONE-2)** → links to operator detail (ZONE-1) → links to evidence chain (ZONE-3) → links to raw artifact (ZONE-0)

2. **Drill-down model:** A LENS client who wants to understand how a claim is backed can navigate: summary phrase → claim node → artifact node → transformation explanation → raw artifact path. Each step is governed.

3. **ZONE-3 access:** Audit/evidence access grants view of the full chain. For a client requesting technical due diligence, ZONE-3 surfaces everything: axis results, CEU counts, admissibility log entries, evidence_refs, confidence_rationale.

---

## SECTION 6 — GAUGE vs LENS DIFFERENCE MODEL

The architectural principle is: **GAUGE computes. LENS explains.**

GAUGE is truthful but technical. It uses dimension IDs, execution status codes, and reconstruction axis names. It is designed for operators who understand the PSEE system.

LENS takes the same evidence and produces client-safe projections. It does not recompute. It does not invent. It maps GAUGE outputs through the exposure governance policy to arrive at audience-appropriate surface claims.

The difference is not about hiding truth — it is about choosing vocabulary and framing that is accurate AND intelligible to the audience.

**Concrete example:**

| GAUGE says | LENS says |
|-----------|-----------|
| `execution_status: NOT_EVALUATED` | "Runtime execution assessment is pending" |
| `score.canonical: 60, score.projected: 100` | "Proven foundation: 60/100. Maximum achievable: 100/100 when execution assessment runs." |
| `DIM-04.total_count: 0 (caveat: minimum observable state)` | "No structural unknowns observable in current evidence. Runtime behavior assessment pending." |
| `SIG-002: Seven operational dimensions currently unknown` | "The platform's live operational state — cache performance, fleet connectivity, event pipeline activity — cannot be determined from structural analysis alone. These require runtime assessment." |
| `confidence.lower: 60, confidence.upper: 100, status: SPLIT_EXECUTION_NOT_EVALUATED` | "Score confidence range: 60 to 100. Floor is proven. Ceiling is achievable upon execution assessment." |

LENS never drops below a sentence that could be verified against an artifact. If a phrase in phrases.json says "All components are accounted for", that phrase only renders when CONCEPT-01 predicate (DIM-01.coverage_percent == 100) is true, which in turn means coverage_state.json.state=COMPUTED AND coverage_percent=100.0 AND required_units=admissible_units=30. Evidence-first is preserved.

---

## SECTION 7 — SIGNAL EXPOSURE POLICY (SPECIAL CASE)

Signals are the richest client-facing claims in the system. They require dedicated exposure rules.

| signal field | ZONE-1 (GAUGE) | ZONE-2 (LENS) | ZONE-3 (Audit) |
|-------------|---------------|---------------|----------------|
| `signal_id` | YES | NO — internal ID | YES |
| `title` | YES | YES | YES |
| `statement` | YES | NO — too technical | YES |
| `business_impact` | YES | YES | YES |
| `risk` | YES | YES | YES |
| `evidence_confidence` (label) | YES | YES | YES |
| `confidence_rationale` | YES | NO — references PSEE internals | YES |
| `domain_name` | YES | YES | YES |
| `capability_name` | YES | YES (where meaningful) | YES |
| `component_names` | YES | CONDITIONAL (where client-recognizable) | YES |
| `source_refs` (INTEL/DIAG/COND IDs) | YES | NO | YES |
| `trace_links` | YES | NO | YES |

**WEAK confidence signals (SIG-005):**
Must be surfaced with explicit confidence caveat. A LENS surface may not present SIG-005 as a fully established claim. It may say: "One signal has partial evidence — the static coordination structure suggests elevated sharing, but runtime validation is not yet complete."

---

## SECTION 8 — CONCEPT-06 SEMANTIC GAP NOTICE

The CONCEPT-06 predicate in concepts.json reads:
```
"predicate": "score.components.completion_points == 0 AND state.execution_status == 'PHASE_1_ACTIVE'"
```

This predicate will NOT match the Stream 10 schema where `execution_status = 'NOT_EVALUATED'`. This means the ExecutiveDecisionBlock EXECUTION verdict will not correctly identify the execution-pending state on `run_authoritative_recomputed_01`.

**Governance decision:**
This is a known semantic gap. It does not break the canonical run (run_01_authoritative uses PHASE_1_ACTIVE). For a production LENS deployment using the recomputed run, CONCEPT-06 must be updated to include `NOT_EVALUATED` as a matching status. Until that update is made, the EXECUTION verdict in overview.js may render as VERIFIED rather than UNKNOWN for the recomputed run — which would be incorrect.

This is documented here as an exposure governance concern: before LENS can safely surface the EXECUTION verdict against any Stream-10-schema run, the concept predicate must be updated.

---

## SECTION 9 — GOVERNED CLAIM FORMULA

Every client-surfaced claim must satisfy:

1. **Traceability:** The claim traces backward to a verified artifact in the locked baseline.
2. **Accuracy:** The claim does not overstate or understate the actual measured state.
3. **Audience-appropriateness:** The vocabulary is matched to the intended audience.
4. **Caveat completeness:** Any known limitations or partial-evidence conditions must accompany the claim.
5. **Source attribution:** For ZONE-3 access, the full evidence chain must be available.

A claim that satisfies 1–5 for ZONE-2 is LENS-admissible. A claim that satisfies only 1–3 but lacks required caveats is NOT LENS-admissible until caveats are present.

Authority: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V2.01
