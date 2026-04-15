# GAUGE Click-Through Model
# PRODUCTIZE.LENS.SURFACE.01

- Version: 1.0
- Stream: PRODUCTIZE.LENS.SURFACE.01
- Date: 2026-04-15

---

## SECTION 1 — GOVERNING PRINCIPLE

GAUGE is a rendering surface, not an explanation surface. The current GAUGE panels display values derived from artifacts but do not explain where those values come from or what they mean in depth.

Click-through adds a governed depth ladder: click once for explanation, click again for evidence, click again for audit. Each layer deepens the claim, and each layer is zone-governed — operators see more than clients at every depth.

**The ladder does not invent content.** At every level, the content shown is sourced from a vault node that traces to an artifact.

---

## SECTION 2 — CLICKABLE ZONES

Five zones in the current GAUGE UI are candidates for click-through behavior:

| zone | GAUGE component | primary claim(s) | ZONE-1 value shown | ZONE-2 value available |
|------|----------------|-----------------|-------------------|------------------------|
| **Score** | StatusBand / ScoreGauge | CLM-09, CLM-10, CLM-12 | `score.canonical=60`, `score.projected=100`, band=CONDITIONAL | "Proven: 60/100. Achievable: 100/100 when execution runs." |
| **Signals** | SignalAvailability (each signal row) | CLM-20..CLM-24 | title + evidence_confidence | title + business_impact + risk + confidence label |
| **Verdict** | ExecutiveDecisionBlock | CLM-25 | STRUCTURE/COMPLEXITY/EXECUTION raw verdicts | "Structure is strong. Complexity is low. Execution is pending." |
| **Topology** | StructuralMetrics (17/42/89 counts) | CLM-14, CLM-15, CLM-16, CLM-27 | domain/capability/component counts | "17 functional areas. 42 capability surfaces. 89 components." |
| **Coverage / Execution** | RuntimeIntelligence panel | CLM-01, CLM-13 | coverage_percent=100, execution_status=NOT_EVALUATED | "All structural evidence present. Runtime assessment pending." |

---

## SECTION 3 — THREE-LEVEL CLICK-DEPTH LADDER

### Level 1 — Explanation (first click)

**What opens:** A focused panel showing the claim in plain language.

**Operator receives (ZONE-1):**
- Claim ID and label
- Authoritative value (raw: `score.canonical: 60`)
- Explanation paragraph from vault claim node
- Source field path (`gauge_state.json → score.canonical`)
- Transformation chain (e.g., `coverage_points(35) + reconstruction_points(25) + completion_points(0) = 60`)

**Client receives (ZONE-2):**
- Claim label (no ID codes)
- Authoritative value (narrative: "Proven foundation: 60/100")
- Explanation in plain language: "This score represents the maximum provable from structural analysis. The remaining 40 points are earned by runtime execution assessment."
- No source field paths, no JSON key names, no PSEE internals

**Implementation note:** Level 1 content is sourced from the vault claim node's `## Explanation` and `## Authoritative Value` sections, zone-filtered before display.

---

### Level 2 — Evidence (second click)

**What opens:** The artifact node that grounds this claim.

**Operator receives (ZONE-1):**
- Artifact name and path (`clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/gauge_state.json`)
- Key fields relevant to this claim (with raw values)
- Transformation that produced the artifact
- Other claims grounded by the same artifact

**Client receives (ZONE-2):**
- Artifact's role in plain language: "This is the final output of the assessment computation chain."
- Claims grounded by this artifact (narrative list)
- No raw artifact paths, no JSON field names

**Implementation note:** Level 2 content is sourced from the vault artifact node's `## Purpose`, `## Producing Step`, and `## Claims Grounded` sections.

---

### Level 3 — Audit (third click)

**What opens:** The full ZONE-3 evidence chain for this claim.

**Operator and auditor receive (ZONE-3):**
- Full traceability from claim → transformation → artifact → upstream sources
- All evidence refs (INTEL/DIAG/COND/SIG IDs where applicable)
- All known gaps and caveats
- Blocking conditions if any
- Source artifact path confirmed in locked baseline

**Client receives (ZONE-3 for technical due diligence only):**
- Same as operator/auditor
- ZONE-3 is not normally surfaced to the primary client audience; it is available upon request for technical review

**Implementation note:** Level 3 content is sourced from the vault's `governance/Known Gaps.md`, individual claim `## Traceability` sections, and the `client-lineage/BlueEdge — Evidence Path.md` node.

---

## SECTION 4 — PER-ZONE CONTENT SPECIFICATION

### Score Zone (StatusBand / ScoreGauge)

| depth | ZONE-1 content | ZONE-2 content |
|-------|---------------|---------------|
| Level 1 | `score.canonical=60`; derivation `0+35+25`; execution pending; projection rule PR-NOT-EVALUATED | "Proven: 60/100. Structural evidence complete. Achievable: 100/100 when runtime assessment runs." |
| Level 2 | `gauge_state.json` artifact node; fields: score.canonical/projected/components | "This score comes from the assessment computation artifact." |
| Level 3 | Full score computation chain (TRN-03); coverage/reconstruction inputs; known gaps | Same + "The full derivation is available for technical review." |

**Caveats required at Level 1 (ZONE-2):** "The 100/100 ceiling requires running execution assessment. It is the maximum achievable, not a current measurement."

---

### Signal Zone (each signal row in SignalAvailability)

| depth | ZONE-1 content | ZONE-2 content |
|-------|---------------|---------------|
| Level 1 | signal_id + title + statement + evidence_confidence + confidence_rationale | title + business_impact + risk + confidence label (NO statement, NO rationale) |
| Level 2 | source_refs (INTEL/DIAG/COND IDs) + trace_links + domain/capability detail | domain_name + capability_name + confidence label only |
| Level 3 | Full four-layer evidence chain | Evidence summary: "This signal is backed by a complete four-layer evidence chain available for audit." |

**WEAK confidence caveat (SIG-005 only):** At all levels, must surface: "Partial evidence — static component confirmed; runtime component pending."

**Current gap:** `business_impact` and `risk` are not rendered in the current SignalAvailability panel. Level 1 ZONE-2 click-through is the correct place to surface these fields without modifying the main panel display.

---

### Verdict Zone (ExecutiveDecisionBlock)

| depth | ZONE-1 content | ZONE-2 content |
|-------|---------------|---------------|
| Level 1 | STRUCTURE=STRONG (CONCEPT-01/03/14 resolution); COMPLEXITY=LOW (CONCEPT-08/09/16 false); EXECUTION=UNKNOWN (CONCEPT-06) | "Structure: All structural evidence is complete and verified. Complexity: No structural overlaps found. Execution: Runtime assessment is pending — this is expected, not a problem." |
| Level 2 | concepts.json predicate evaluations; concept_ids; phrase resolution | Business phrase outputs (phrases.json output only; no predicate logic) |
| Level 3 | Full concept resolution trace; CONCEPT-06 gap documented | "Known gap: execution verdict predicate must be updated before production deployment. See audit record." |

**CONCEPT-06 blocking condition:** Until CONCEPT-06 predicate is fixed, EXECUTION verdict at Level 1 must display "UNKNOWN — pending assessment" for the recomputed run. This cannot be suppressed. If the predicate fix has not been applied, the verdict panel must explicitly mark EXECUTION verdict as "requires correction."

---

### Topology Zone (StructuralMetrics counts)

| depth | ZONE-1 content | ZONE-2 content |
|-------|---------------|---------------|
| Level 1 | `domains=17, capabilities=42, components=89, total_nodes=148`; canonical topology hash | "17 functional areas. 42 capability surfaces. 89 components mapped." |
| Level 2 | `canonical_topology.json` artifact node; domain names list; cross-domain overlap count (0) | Domain names list (business-meaningful labels only) |
| Level 3 | Full node inventory; binding envelope comparison (0 canonical / 2 envelope overlaps) | "Full topology map available for technical review." |

**Audience restriction:** At Level 2 (ZONE-2), only domain names are shown. Component-level names (e.g., `RedisCacheModule`, `FleetEventsModule`) remain ZONE-0/3 only.

---

### Coverage / Execution Zone (RuntimeIntelligence panel)

| depth | ZONE-1 content | ZONE-2 content |
|-------|---------------|---------------|
| Level 1 | `coverage_percent=100.0`, `required_units=30`, `admissible_units=30`; execution_status=NOT_EVALUATED; execution_mode=STRUCTURAL_ONLY | "All structural evidence is present and admitted. Runtime execution assessment has not run." |
| Level 2 | `coverage_state.json` + `reconstruction_state.json` artifact nodes; DIM-01..06 full values | Coverage summary (percentage only); reconstruction verdict (PASS only, no axis names) |
| Level 3 | Full dimension values; S-13 invariant chain; admissibility log | "Full evidence details available for audit." |

---

## SECTION 5 — FORBIDDEN EXPOSURES AT EACH LEVEL

Regardless of depth level, these items must NEVER appear in ZONE-2 content:

| forbidden item | appears in | risk if exposed |
|---------------|-----------|-----------------|
| `confidence_rationale` text | signal nodes | Contains INTEL/DIAG/COND IDs — meaningless and misleading to non-technical clients |
| `signal.statement` | signal nodes | Contains CEU references, dimension IDs, technical provenance |
| `DIM-XX` identifiers | claim nodes, gauge data | Internal PSEE codes with no client meaning |
| `PHASE_1_ACTIVE`, `NOT_EVALUATED` as raw strings | execution state | Internal state machine labels |
| `S-13`, `S-T3` | dimension derivation | PSEE terminal state codes |
| `PR-NOT-EVALUATED`, `PR-02` | projection | Internal rule identifiers |
| CEU file names (e.g., `hasi_bridge.py`) | signal component_names | Code filenames — confusing without engineering context |
| `source_refs` list (INTEL/DIAG/COND/SIG IDs) | signal nodes | Internal evidence IDs |
| `confidence.status: SPLIT_EXECUTION_NOT_EVALUATED` | score confidence | Internal status code — replace with narrative |
| Axis names verbatim (COMPLETENESS, STRUCTURAL_LINK, etc.) | reconstruction | Technical PSEE terms without explanation |

---

## SECTION 6 — OPERATOR VS CLIENT BEHAVIOR SPLIT

The click-through system has two modes. The mode is determined by the serving context (operator session vs client session), not by a client-side toggle.

| behavior | operator mode | client mode |
|----------|--------------|-------------|
| Level 1 content | Full ZONE-1 claim detail | ZONE-2 narrative only |
| Level 2 content | Artifact node with paths and field values | Artifact node description only |
| Level 3 content | Full evidence chain + known gaps | Audit package summary + "request full audit" option |
| Signal station | statement + confidence_rationale visible | business_impact + risk only |
| Score display | derivation formula visible | "proven floor / achievable ceiling" narrative |
| Topology drill | Full node explorer with IDs | Domain names list only |
| Verdict display | concept_ids + predicate evaluations | Three-axis narrative |

---

## SECTION 7 — MINIMAL INTERACTION SPECIFICATION (V1)

For LENS v1 implementation, the minimal click-through behavior requires:

**Required to implement Level 1 for all five zones:**
1. A vault claim fragment export from the vault builder — per-claim ZONE-1 and ZONE-2 fragments as static JSON or markdown
2. A click handler in each GAUGE panel that opens a slide-in drawer or modal
3. The drawer renders the appropriate fragment based on the active zone

**Technical minimum per panel:**
- Score zone: render CLM-09 + CLM-10 fragments
- Signal zone: render CLM-20..24 fragments (one per signal click)
- Verdict zone: render CLM-25 fragment
- Topology zone: render CLM-27 + domain name list
- Coverage zone: render CLM-01 + CLM-13 fragments

**Level 2 and Level 3 are deferred to v2** unless the current stream authorizes GAUGE code changes.

**No interaction behavior should be implemented that:**
- Shows raw artifact field values in ZONE-2 mode
- Uses a client-side zone toggle (zone must be server-determined)
- Renders content not present in the vault

**Authority:** PRODUCTIZE.LENS.SURFACE.01
