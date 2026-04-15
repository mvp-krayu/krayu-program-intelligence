# Zone Enforcement Model
# PRODUCTIZE.LENS.PROJECTION.CONTRACT.01

- Version: 1.0
- Stream: PRODUCTIZE.LENS.PROJECTION.CONTRACT.01
- Date: 2026-04-15

---

## SECTION 1 — ZONE SYSTEM

Four exposure zones govern all content production in this system. Zones are not permissions — they are information boundaries. The zone requested determines which fields are admissible in the output. It does not modify what is true; it modifies what can be shown.

| zone | name | primary audience | scope |
|------|------|-----------------|-------|
| ZONE-0 | Ground Truth | No surface — internal execution only | All raw artifacts, CEU files, component names, internal identifiers |
| ZONE-1 | Operator | GAUGE operators, internal team | Technical claim values, source fields, transformation chains, dimension IDs |
| ZONE-2 | Client | Non-technical executive audience (LENS) | Plain-language narratives, labels, summaries, evidence references without paths |
| ZONE-3 | Audit | Technical reviewers, compliance | Full traceability chain, artifact paths, known gaps, blocking conditions |

**ZONE-2 is a strict subset of ZONE-1.** ZONE-3 is a full-access extension of ZONE-1.

```
ZONE-3 ⊇ ZONE-1 ⊋ ZONE-2
ZONE-0 is disjoint from all surface zones (never emitted)
```

---

## SECTION 2 — ZONE FLOOR CLASSIFICATION

Every field in every claim record carries a zone floor. Zone floor is the minimum zone required to expose that field. Fields with zone floor above the requested zone are stripped before projection transform.

### Zone Floor Values

| floor | meaning |
|-------|---------|
| Z0 | Never surfaced in any output. Exists only in execution chain. |
| Z1 | Operator and above (ZONE-1, ZONE-3). Stripped from ZONE-2 output. |
| Z2 | Client and above (ZONE-2, ZONE-1, ZONE-3). Safe for all surfaces. |
| Z3 | Audit only (ZONE-3). Stripped from ZONE-1 and ZONE-2 output. |

### Enforcement Rule

```
IF field.zone_floor == Z0:
    STRIP — never emit
ELIF field.zone_floor == Z1 AND requested_zone == ZONE-2:
    STRIP
ELIF field.zone_floor == Z3 AND requested_zone IN [ZONE-1, ZONE-2]:
    STRIP
ELSE:
    RETAIN
```

This rule is applied in Stage 2 of the projection pipeline, before the projection transform begins.

---

## SECTION 3 — FIELD ZONE FLOOR REGISTER

This register is the authoritative classification for all field categories. It derives from `gauge_lens_exposure_governance.md` and is extended by this contract.

### 3.1 Score and Derivation Fields

| field | zone floor | notes |
|-------|-----------|-------|
| score.canonical (numeric value) | Z2 | Safe as "60/100" or "Proven: 60" |
| score.projected (numeric value) | Z2 | Safe as "Achievable: 100/100" |
| score.confidence_lower / confidence_upper | Z2 | Safe as range presentation |
| score.components breakdown (0+35+25) | Z1 | Formula is operator-only |
| score.band label (CONDITIONAL) | Z1 | Internal band code; use narrative at Z2 |
| transformation_summary | Z1 | "coverage_points(35) + ..." — operator only |
| source_field path | Z1 | "gauge_state.json → score.canonical" |
| projection.rule code (PR-NOT-EVALUATED) | Z1 | Internal rule identifiers |
| confidence.status code | Z1 | SPLIT_EXECUTION_NOT_EVALUATED — internal |

### 3.2 Artifact and Traceability Fields

| field | zone floor | notes |
|-------|-----------|-------|
| artifact_role (plain English) | Z2 | "Terminal computation output" — client-safe |
| artifact_description | Z2 | Plain-language description is client-safe |
| artifact_id (ART-01) | Z1 | Internal reference |
| artifact_name (gauge_state.json) | Z1 | Technical filename |
| artifact_path (full repo path) | Z1 | Repo-relative path — operator/audit only |
| producing_step (S4) | Z1 | PSEE internal stage identifier |
| transformation_id (TRN-03) | Z3 | Audit-level transformation reference |
| full_trace block | Z3 | Audit only |
| input_artifact_ids | Z3 | Audit only |
| upstream_chain description | Z3 | Audit only |

### 3.3 Claim Reference Fields

| field | zone floor | notes |
|-------|-----------|-------|
| claim_label (plain English) | Z2 | "Proven Score" — client-safe |
| claim_id (CLM-09) | Z1 | Internal ID — strip from ZONE-2 |
| claim_label with ID annotation | Z1 | "CLM-09 — Proven Score" — operator form |
| co_grounded_claims labels | Z2 | Plain labels are client-safe |
| co_grounded_claims IDs | Z1 | Internal IDs — strip from ZONE-2 |

### 3.4 Signal Fields

| field | zone floor | notes |
|-------|-----------|-------|
| signal.title | Z2 | Client-safe |
| signal.business_impact | Z2 | Client-safe verbatim |
| signal.risk | Z2 | Client-safe verbatim |
| evidence_confidence label (STRONG/MODERATE) | Z2 | Client-safe label |
| signal.statement | Z1 | Contains CEU refs, PSEE internals |
| signal.confidence_rationale | Z1 | Contains INTEL/DIAG/COND IDs |
| signal.source_refs | Z1 | Internal evidence IDs |
| signal.trace_links | Z1 | Internal path references |
| signal_id (SIG-001) | Z1 | Internal reference |
| signal component_names | Z0 | CEU file names — never surfaced |

### 3.5 Topology Fields

| field | zone floor | notes |
|-------|-----------|-------|
| domain_count | Z2 | "17 functional areas" — client-safe |
| capability_count | Z2 | "42 capability surfaces" — client-safe |
| component_count | Z2 | "89 components" — client-safe |
| total_node_count | Z2 | "148 nodes" — client-safe |
| domain_names list | Z2 | Business-meaningful labels only |
| capability_names | Z1 | May contain internal naming conventions |
| component_names | Z0 | RedisCacheModule etc. — never surfaced |
| canonical_topology_hash | Z1 | Internal hash reference |
| cross_domain_overlap_count | Z2 | "0 overlaps" — client-safe |
| envelope_overlap_count | Z3 | Audit comparison only |

### 3.6 Execution State Fields

| field | zone floor | notes |
|-------|-----------|-------|
| execution_status: NOT_EVALUATED (narrative) | Z2 | "Runtime assessment pending" — client-safe |
| execution_status: NOT_EVALUATED (raw code) | Z1 | Internal state machine label |
| execution_mode: STRUCTURAL_ONLY (raw) | Z1 | Internal execution mode code |
| PHASE_1_ACTIVE (raw) | Z1 | Legacy internal state label |
| S-13, S-T3 terminal state codes | Z1 | PSEE state machine codes |
| execution_layer_evaluated flag | Z1 | Boolean internal flag |

### 3.7 Concept and Phrase Fields

| field | zone floor | notes |
|-------|-----------|-------|
| phrase output (resolved text) | Z2 | Resolved phrase text is client-safe |
| concept_id (CONCEPT-01) | Z1 | Internal concept identifier |
| predicate logic | Z1 | DIM-01.coverage_percent == 100 — engineering syntax |
| axis names verbatim (COMPLETENESS etc.) | Z1 | CTO persona may access at ZONE-2 by persona modifier |
| DIM-XX identifiers | Z1 | Replace with labels at ZONE-2 |
| projection.rule detail | Z1 | Technical rule explanation |

### 3.8 Audit Fields

| field | zone floor | notes |
|-------|-----------|-------|
| known_gaps block | Z3 | Audit only — must not be suppressed at Z3 |
| blocking_conditions block | Z3 | Audit only |
| locked_baseline_tag | Z2 | Provenance reference is client-safe |
| audit_confirmed flag | Z3 | Audit only |
| traceability_status code | Z3 | Audit only |

### 3.9 Infrastructure Fields

| field | zone floor | notes |
|-------|-----------|-------|
| CEU file names (hasi_bridge.py) | Z0 | Code artifact names — never emitted |
| run_id (raw internal identifier) | Z1 | Use "authoritative assessment run" at ZONE-2 |
| generated_at timestamp | Z2 | Safe as provenance metadata |
| projection_id | Z2 | Self-referential payload identifier |

---

## SECTION 4 — ZONE-2 STRICT SUBSET DEFINITION

ZONE-2 output is a strict transformation of ZONE-1 content. It is not a separate content set — it is a filtered view.

**The following are PROHIBITED from any ZONE-2 payload, regardless of context:**

| prohibited content | reason |
|-------------------|--------|
| Any field with zone_floor=Z1 | Operator-only by classification |
| Any field with zone_floor=Z0 | Never surfaced |
| Any field with zone_floor=Z3 | Audit-only |
| Claim IDs (CLM-XX) | Internal reference |
| Signal IDs (SIG-XXX) | Internal reference |
| DIM-XX identifiers | Internal PSEE codes |
| Raw execution state codes | Internal state machine labels |
| Artifact paths | Repo-relative paths |
| Artifact IDs (ART-XX) | Internal reference |
| Transformation IDs (TRN-XX) | Internal reference |
| Score derivation formula | Operator-only computation |
| signal.statement | PSEE internals |
| signal.confidence_rationale | PSEE evidence chain details |
| Predicate logic | Engineering syntax |
| CEU file names | Code artifacts |
| run_id in raw form | Internal identifier |

**There are no exceptions to this list.** Persona modifiers cannot reinstate stripped fields. Business context cannot override zone floor. Commercial convenience cannot override zone floor.

---

## SECTION 5 — ZONE-1 CEILING FOR ZONE-2 VIOLATIONS

If a projection pipeline produces ZONE-2 output that contains a Z1+ field, the Stage 5 output validation MUST fail the entire payload. The enforcement check is:

```
FOR each field in output_payload:
    IF field.zone_floor > ZONE-2 AND requested_zone == ZONE-2:
        → ProjectionError { reason: "ZONE_FILTER_VIOLATION", field: field_name }
        → reject full payload
        → do not return partial content
```

This check is not a safety net — it is a contract enforcement gate. Zone filter in Stage 2 is the primary enforcement point. Stage 5 is the audit gate.

---

## SECTION 6 — ZONE-3 EXTENSION MODEL

ZONE-3 includes all ZONE-1 fields plus the Z3-classified audit fields. ZONE-3 is additive — it does not remove ZONE-1 content; it adds audit-layer content.

**Fields exclusive to ZONE-3 (zone_floor=Z3):**
- `full_trace` block (source fields, artifact paths, transformation chain, upstream chain)
- `known_gaps` array (gap_id, description, impact, status)
- `blocking_conditions` array
- `traceability_status` code
- `audit_confirmed` boolean
- `locked_baseline_tag`

**L3 depth is only available at ZONE-3.** A request for L3 at ZONE-1 or ZONE-2 returns `ProjectionError { reason: "ZONE_INSUFFICIENT_FOR_L3" }`. The audit payload contains known gaps and blocking conditions that cannot be selectively disclosed — ZONE-3 access is binary.

---

## SECTION 7 — PERSONA MODIFIER ZONE INTERACTION

Persona modifiers (Stage 4) operate on the zone-filtered claim record (ZFR). They cannot access fields stripped in Stage 2.

**Permitted persona actions within zone:**

| persona | permitted within ZONE-2 | not permitted |
|---------|------------------------|---------------|
| `shared` | No modifications — pass through | n/a |
| `cto` | Axis names verbatim (COMPLETENESS, STRUCTURAL_LINK, etc.); heuristic claim inclusion | Access stripped Z1 fields; reinstate claim IDs; show derivation formula |
| `ceo` | Score framing adjustment (proven/achievable emphasis); verdict narrative simplification | Access stripped Z1 fields; remove caveats |

**The CTO persona exemption** for axis names is a pre-approved vocabulary substitution within the Z2 floor, not a zone escalation. It is bounded: only the axis names themselves are permitted verbatim; their derivation or underlying dimension scores remain Z1.

**Caveats may not be removed by any persona.** A persona that would require caveat removal to function is a malformed persona application. The output must fail rather than surface uncaveated content.

---

## SECTION 8 — ZONE ENFORCEMENT POINT DIAGRAM

```
Request arrives: (claim_id, zone, depth, persona?)
         │
         ▼
[Stage 1] INPUT VALIDATION
         │
         ▼
[Stage 2] ZONE FILTER ◄── ENFORCEMENT POINT 1 (pre-transform)
    For each field in claim record:
        IF field.zone_floor > requested_zone → STRIP
        Result: Zone-Filtered Record (ZFR)
         │
         ▼
[Stage 3] PROJECTION TRANSFORM
    Apply depth template to ZFR
         │
         ▼
[Stage 4] PERSONA MODIFIER
    Operate on ZFR-derived output only
    Cannot access pre-ZFR fields
         │
         ▼
[Stage 5] OUTPUT VALIDATION ◄── ENFORCEMENT POINT 2 (post-transform)
    Verify no Z1+ fields in ZONE-2 output
    Verify required caveats present
         │
         ▼
    OutputPayload (zone-clean, self-contained)
```

Zone enforcement is applied TWICE: once during field selection (Stage 2), once during output audit (Stage 5). Neither check may be skipped.

---

## SECTION 9 — CROSS-ZONE REQUEST HANDLING

A consumer may request projections at multiple zones within the same session. Each request is independent. Zone is not a session-level property — it is a per-request property.

| scenario | behavior |
|----------|---------|
| Same claim_id, different zones | Two independent projections. Different ZFRs. Different output payloads. |
| claim_set_id across zones | Disallowed. Each item in a ClaimSetProjectionRequest must use the same zone. |
| Zone upgrade within session | Not possible. Each request specifies its zone. No zone memory between requests. |
| Zone downgrade within session | Not possible. Same rules as zone upgrade. |

A system that tracks zone across requests and adjusts content accordingly is non-compliant with guarantee G2 (zone filter is stateless).

**Authority:** PRODUCTIZE.LENS.PROJECTION.CONTRACT.01
