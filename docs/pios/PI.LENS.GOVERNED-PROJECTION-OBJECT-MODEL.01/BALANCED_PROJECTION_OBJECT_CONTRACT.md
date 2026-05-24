# BALANCED Projection Object Contract

Stream: PI.LENS.GOVERNED-PROJECTION-OBJECT-MODEL.01
Classification: G1 (architecture-mutating)
Date: 2026-05-24
Depends on: GOVERNED_PROJECTION_OBJECT_MODEL.md (Layer 3 definition), BOARDROOM_PROJECTION_OBJECT_CONTRACT.md
Implements: Layer 3 contract for BALANCED persona

---

## Purpose

This document defines the exact shape, fields, rules, and authority boundary for the `balanced_projection` object — the governed projection object consumed by all BALANCED persona surfaces.

BALANCED components render this object. They do not derive semantic meaning from `fullReport` or raw substrate artifacts. Every visible field in the BALANCED experience traces to a field in this contract.

---

## Governing Distinction

**BOARDROOM answers: "Where does this specimen stand?"**
**BALANCED answers: "How did it get there?"**

BOARDROOM projects posture and tension at executive altitude. One-sentence findings. Family-level signals. Qualification stamp.

BALANCED projects the qualification journey at investigative altitude. Timeline of governed transitions. Signal family explanations. Pressure zone distribution. Governance friction narrative. Enrichment corrections. Constitutional anchor dimensions. Convergence observations. Chronicle chapter navigation. Guided query seeds.

BALANCED is NOT "BOARDROOM with more words." It is a different cognitive function: understanding the governed lifecycle trajectory rather than consuming its conclusion.

---

## Projection Identity

```json
{
  "projection_id": "<uuid>",
  "persona": "BALANCED",
  "altitude": "INVESTIGATIVE",
  "generated_at": "<utc_iso>",
  "specimen_id": "<client>",
  "run_id": "<run_id>",
  "schema_version": "1.0.0"
}
```

Immutable per projection. `projection_id` is unique per compilation. `schema_version` is the contract version this object conforms to.

---

## Sections

The BALANCED projection object contains 12 sections. Each section is defined below with its field inventory, derivation source, and rendering intent.

### 1. Qualification Timeline

**Consumer:** Qualification journey panel (governed), lifecycle visualization

Answers: "What happened, in what order, to earn this qualification state?"

```json
{
  "qualification_timeline": {
    "available": true,
    "s_level": "S2",
    "governed": true,
    "transitions": [
      {
        "from": "S0",
        "to": "S1",
        "timestamp": "2026-05-23T11:16:31Z",
        "actor": "operator:khorrix",
        "mechanism_summary": "Revalidation 25/25 PASS. Constitutional anchor ELEVATED. 85 propositions, 81 accepted, 3 rejected, 1 arbitrated.",
        "semantic_phase": "QUALIFICATION",
        "governance_gates_cleared": ["revalidation", "proposition_review", "constitutional_anchor"]
      },
      {
        "from": "S1",
        "to": "S2",
        "timestamp": "2026-05-23T11:35:41Z",
        "actor": "operator:khorrix",
        "mechanism_summary": "Full S1→S2 governed lifecycle. Revalidation 25/25 PASS. Constitutional anchor 8/8 PASS. 32 enrichment events.",
        "semantic_phase": "QUALIFICATION",
        "governance_gates_cleared": ["revalidation", "proposition_review", "constitutional_anchor", "enrichment", "replay_certification"]
      }
    ],
    "transition_count": 2,
    "timeline_narrative": "This specimen advanced through 2 governed transitions — S0→S1 then S1→S2. Each transition required operator review, deterministic revalidation, and constitutional anchor clearance.",
    "hold_reason": null,
    "promotion_eligible": true
  }
}
```

| Field | Type | Source (Resolved Payload) | Rule |
|---|---|---|---|
| `s_level` | string | `governance_lifecycle.s_level` | Verbatim pass-through |
| `governed` | boolean | Same gate as BOARDROOM `qualification_posture.governed` | Shared gate logic |
| `transitions` | array | `governance_lifecycle.transitions` | Enriched with `semantic_phase` and `governance_gates_cleared` derived from mechanism text |
| `transition_count` | integer | `governance_lifecycle.transition_count` | Verbatim |
| `timeline_narrative` | string | 75.x — summary of the advancement trajectory | Evidence-cited, no prescription |
| `hold_reason` | string/null | `governance_lifecycle.hold_reason` | Verbatim pass-through |
| `promotion_eligible` | boolean | `governance_lifecycle.promotion_eligible` | Verbatim |

**Enrichment:** The compiler extracts `governance_gates_cleared` by parsing which governance artifacts were referenced in each transition's `mechanism` text. This is structural pattern matching, not interpretation.

---

### 2. Signal Family Explanation

**Consumer:** Signal exploration panel (BALANCED), signal family cards

Answers: "What does each signal family detect, and what did it find in this specimen?"

```json
{
  "signal_family_explanation": {
    "available": true,
    "families": [
      {
        "family": "DPSIG",
        "family_label": "Structural Concentration",
        "family_explanation": "DPSIG signals measure structural concentration — where architectural weight accumulates disproportionately. Concentration creates fragility when load-bearing domains carry outsized responsibility.",
        "signal_count": 2,
        "activated_count": 2,
        "signals": [
          {
            "signal_id": "DPSIG-031",
            "signal_name": "Cluster Pressure Index",
            "severity": "ELEVATED",
            "investigative_reading": "Platform Infrastructure and Data carries the dominant cluster mass. This domain's structural load exceeds the system mean — any instability here propagates disproportionately.",
            "activation_context": {
              "what_triggered": "Cluster mass concentration exceeds structural norm",
              "what_it_means": "This domain is a structural gravity well — changes ripple outward",
              "where_it_concentrates": "Platform Infrastructure and Data"
            }
          }
        ]
      }
    ],
    "total_signals": 8,
    "activated_signals": 8
  }
}
```

| Field | Type | Source (Resolved Payload) | Rule |
|---|---|---|---|
| `family_explanation` | string | 75.x — one paragraph explaining what this signal family measures | Structural description, not prescription. Static per family. |
| `signals[].investigative_reading` | string | 75.x — organizational-altitude interpretation at investigative depth | More detail than BOARDROOM `executive_reading` — includes cause/effect |
| `signals[].activation_context` | object | 75.x — structured what/what/where decomposition | Each field is one sentence. Evidence-cited. |

**Altitude distinction from BOARDROOM:**
- BOARDROOM: `executive_reading` — one sentence, posture-focused
- BALANCED: `investigative_reading` — expanded structural explanation + `activation_context` decomposition

---

### 3. Pressure Zone Distribution

**Consumer:** Pressure zone map (BALANCED), propagation analysis panel

Answers: "Where does structural pressure concentrate, and how does it flow?"

```json
{
  "pressure_zone_distribution": {
    "available": true,
    "primary_zone": {
      "domain_label": "Platform Infrastructure and Data",
      "zone_role": "ORIGIN",
      "structural_weight_narrative": "This domain carries the dominant cluster mass and acts as the structural origin of propagated pressure."
    },
    "propagation_pattern": {
      "origin": {
        "domain_label": "Platform Infrastructure and Data",
        "cluster_count": 1,
        "evidence_summary": "Origin group carries the dominant cluster mass."
      },
      "passthrough": {
        "domain_labels": ["Telemetry Transport", "Real-Time Streaming"],
        "cluster_count": 2,
        "evidence_summary": "Intermediate coupling transfers pressure from origin to peripheral zones."
      },
      "receiver": {
        "domain_labels": ["Configuration Management", "Identity and Access"],
        "cluster_count": 3,
        "evidence_summary": "Receiving domains absorb propagated pressure from the origin zone."
      }
    },
    "propagation_narrative": "Structural pressure originates in Platform Infrastructure and Data, transfers through Telemetry Transport and Real-Time Streaming, and settles in Configuration Management and Identity and Access. This triadic flow reveals the system's structural dependency chain.",
    "zone_count": 3,
    "affected_domain_count": 6
  }
}
```

| Field | Type | Source (Resolved Payload) | Rule |
|---|---|---|---|
| `primary_zone` | object | `propagation_summary` fields | Domain-labeled, business language |
| `propagation_pattern` | object | Same source as BOARDROOM `propagation_chain` | Shared derivation, BALANCED adds narrative |
| `propagation_narrative` | string | 75.x — paragraph describing the flow and its structural meaning | Evidence-cited, zone-anchored |

**Altitude distinction from BOARDROOM:**
- BOARDROOM: `propagation_chain` — triadic structure with per-role summaries
- BALANCED: `pressure_zone_distribution` — adds primary zone identification, flow narrative, affected domain count

---

### 4. Governance Friction

**Consumer:** Governance friction panel (BALANCED), review detail cards

Answers: "What governance tension was exercised? What survived? What didn't?"

```json
{
  "governance_friction": {
    "available": true,
    "proposition_review": {
      "total": 85,
      "accepted": 81,
      "rejected": 3,
      "arbitrated": 1,
      "contested": 0,
      "friction_rate": 0.047,
      "friction_narrative": "85 semantic propositions reviewed. 81 accepted on structural merit. 3 rejected — governance friction challenged weak claims and they did not survive. 1 arbitrated — operator judgment resolved a contested boundary.",
      "review_status": "COMPLETE",
      "review_completed_by": "operator:khorrix",
      "class_distribution": {
        "DOMAIN_EVIDENCE_GROUNDING": 17,
        "CAPABILITY_EVIDENCE": 24,
        "VAULT_CLAIM_STRUCTURAL": 25,
        "CROSS_DOMAIN_EVIDENCE": 19
      },
      "tier_distribution": {
        "DIRECT_EVIDENCE": 53,
        "DERIVED": 32,
        "INFERRED": 0
      }
    },
    "friction_summary": "Governance friction rate: 4.7%. The system challenged 4 claims — 3 rejected outright, 1 resolved through operator arbitration. This is genuine operational governance, not rubber-stamp acceptance."
  }
}
```

| Field | Type | Source (Resolved Payload) | Rule |
|---|---|---|---|
| `proposition_review.*` | various | `proposition_corpus` fields | Mostly verbatim pass-through |
| `friction_narrative` | string | 75.x — paragraph explaining what happened during review | Must cite accept/reject/arbitrate counts |
| `friction_summary` | string | 75.x — short summary of friction quality | Must cite friction_rate and characterize the governance exercise |
| `class_distribution` | object | `proposition_corpus.by_class` | Verbatim |
| `tier_distribution` | object | `proposition_corpus.by_tier` | Verbatim |

**Altitude distinction from BOARDROOM:**
- BOARDROOM: `governance_legitimacy.sections.proposition_review.finding` — one sentence
- BALANCED: Full review decomposition with class/tier distribution, narrative, friction characterization

---

### 5. Enrichment Corrections

**Consumer:** Enrichment journey panel (BALANCED), evidence correction cards

Answers: "How did evidence enrichment change the system's understanding?"

```json
{
  "enrichment_corrections": {
    "available": true,
    "domains_corrected": 12,
    "domains_confirmed": 1,
    "domains_no_sdc_match": 3,
    "capabilities_domain_corrected": 16,
    "mean_confidence_post": 0.727,
    "domains_with_change": 15,
    "correction_narrative": "Evidence enrichment corrected domain assignments for 12 of 17 domains. 16 capabilities received domain-reference corrections. 3 domains had no SDC match — an honest gap in evidence coverage. Mean confidence after enrichment: 72.7%.",
    "debt": {
      "available": true,
      "total_items": null,
      "improved": null,
      "unchanged": null,
      "worsened": null,
      "blockers_resolved": null,
      "trajectory": null,
      "debt_narrative": null
    }
  }
}
```

| Field | Type | Source (Resolved Payload) | Rule |
|---|---|---|---|
| `domains_corrected` | integer | `enrichment_intelligence.domains_corrected` | Verbatim |
| `domains_confirmed` | integer | `enrichment_intelligence.domains_confirmed` | Verbatim |
| `domains_no_sdc_match` | integer | `enrichment_intelligence.domains_no_sdc_match` | Verbatim |
| `capabilities_domain_corrected` | integer | `enrichment_intelligence.capabilities_domain_corrected` | Verbatim |
| `mean_confidence_post` | float | `enrichment_intelligence.mean_confidence_post` | Verbatim |
| `correction_narrative` | string | 75.x — paragraph describing the enrichment outcome | Must cite corrected/confirmed/no-match counts |
| `debt` | object | `enrichment_intelligence.debt` | Pass-through with optional narrative |

**Altitude distinction from BOARDROOM:**
- BOARDROOM: `governance_legitimacy.sections.evidence_enrichment.finding` — one sentence
- BALANCED: Full enrichment decomposition with correction counts, confidence, debt trajectory

---

### 6. Constitutional Anchor Dimensions

**Consumer:** Constitutional anchor panel (BALANCED), dimension cards

Answers: "What constitutional dimensions were assessed, and what was the verdict on each?"

```json
{
  "constitutional_anchor_dimensions": {
    "available": true,
    "status": "CONSTITUTIONAL_DISTANCE_ACCEPTABLE",
    "advancement_blocked": false,
    "overall_verdict": "CONSTITUTIONAL_DISTANCE_ACCEPTABLE",
    "dimension_count": 8,
    "dimensions": [
      {
        "dimension_id": "DIM-01",
        "dimension_label": "Proposition Count",
        "verdict": "PASS",
        "verdict_label": "Constitutional distance within acceptable range"
      }
    ],
    "anchor_narrative": "Constitutional anchor assessed 8 dimensions. All 8 PASS — constitutional distance acceptable. No advancement blockers. The specimen's governance structure is constitutionally sound relative to the reference specimen.",
    "reference_specimen": "netbox",
    "candidate_specimen": "blueedge"
  }
}
```

| Field | Type | Source (Resolved Payload) | Rule |
|---|---|---|---|
| `status` | string | `constitutional_anchor.status` | Verbatim |
| `advancement_blocked` | boolean | `constitutional_anchor.advancement_blocked` | Verbatim |
| `overall_verdict` | string | `constitutional_anchor.overall_verdict` | Verbatim |
| `dimensions` | array | `constitutional_anchor.dimensions` | Pass-through, enriched with `verdict_label` |
| `anchor_narrative` | string | 75.x — paragraph summarizing the constitutional assessment | Must cite dimension count and pass/fail |
| `reference_specimen` | string | `constitutional_anchor.reference_specimen` | Verbatim |
| `candidate_specimen` | string | `constitutional_anchor.candidate_specimen` | Verbatim |

**Altitude distinction from BOARDROOM:**
- BOARDROOM: `governance_legitimacy.sections.constitutional_anchor.finding` — one sentence
- BALANCED: Per-dimension breakdown, both specimens named, narrative explaining what was assessed

---

### 7. Convergence Observations

**Consumer:** Convergence panel (BALANCED), observation cards

Answers: "What governance patterns were observed across specimens? What converged, what diverged?"

```json
{
  "convergence_observations": {
    "available": true,
    "observation_maturity": "DESCRIPTIVE",
    "total_observations": 9,
    "convergence_count": 5,
    "divergence_count": 3,
    "mixed_count": 1,
    "convergences": [
      "governance_lifecycle",
      "governance_friction_mechanism",
      "revalidation_contract",
      "debt_taxonomy",
      "authority_ceiling"
    ],
    "divergences": [
      "proposition_derivation_classes",
      "enrichment_mechanisms",
      "evidence_authority_ceiling"
    ],
    "mixed": [
      "constitutional_anchor_behavior"
    ],
    "convergence_narrative": "9 cross-specimen observations across 2 specimens. 5 convergences, 3 divergences, 1 mixed. Observation maturity: DESCRIPTIVE — two specimens establish comparison, not pattern. Convergences include governance lifecycle structure, friction mechanisms, and revalidation contract. Divergences reflect legitimate PATH A/PATH B differences in proposition derivation and enrichment.",
    "specimens": ["netbox", "blueedge"],
    "verdict": "DESCRIPTIVE CONVERGENCE OBSERVED",
    "observations": []
  }
}
```

| Field | Type | Source (Resolved Payload) | Rule |
|---|---|---|---|
| `observation_maturity` | string | `convergence_intelligence.observation_maturity` | Verbatim — always DESCRIPTIVE for 2 specimens |
| `convergences` / `divergences` / `mixed` | string[] | `convergence_intelligence.convergences` etc. | Verbatim |
| `convergence_narrative` | string | 75.x — paragraph summarizing convergence state | Must cite observation count, specimen count, maturity |
| `specimens` | string[] | `convergence_intelligence.specimens` | Verbatim |
| `observations` | array | `convergence_intelligence.observations` | Pass-through for detail expansion |

**Altitude distinction from BOARDROOM:**
- BOARDROOM: `governance_legitimacy.sections.cross_specimen.finding` — one sentence
- BALANCED: Full observation decomposition, convergence/divergence lists, maturity classification, per-observation detail

---

### 8. Chronicle Chapter Navigation

**Consumer:** Chronicle navigation panel (BALANCED), chapter cards

Answers: "What chapters of the governed cognitive replay are available for exploration?"

```json
{
  "chronicle_navigation": {
    "available": true,
    "certification_status": "CERTIFIED",
    "total_checks": 62,
    "passed": 62,
    "failed": 0,
    "phase_count": 10,
    "phase_summary": [
      {
        "phase_label": "EMERGENCE",
        "phase_description": "Raw intake — the system encounters unknown structure",
        "status": "COMPLETE"
      }
    ],
    "chronicle_narrative": "Chronicle replay certified — 62/62 checks across 10 semantic phases. The governed cognitive replay traces the full lifecycle from specimen intake through qualification, enrichment, revalidation, and cross-specimen convergence.",
    "descent_available": true,
    "descent_label": "Descend into Chronicle for the full governed cognitive replay."
  }
}
```

| Field | Type | Source (Resolved Payload) | Rule |
|---|---|---|---|
| `certification_status` | string | `chronicle_certification.certification_status` | Verbatim |
| `total_checks` / `passed` / `failed` | integer | `chronicle_certification` fields | Verbatim |
| `phase_count` | integer | `chronicle_certification.phase_count` | Verbatim |
| `phase_summary` | array | `chronicle_certification.phase_breakdown` | Enriched with semantic phase labels |
| `chronicle_narrative` | string | 75.x — paragraph summarizing certification and coverage | Must cite check counts and phase count |
| `descent_available` | boolean | `certification_status === 'CERTIFIED'` | Gate for Chronicle descent invitation |

**Altitude distinction from BOARDROOM:**
- BOARDROOM: `governance_legitimacy.sections.replay_certification.finding` — one sentence
- BALANCED: Phase-level breakdown, semantic phase labels, descent invitation to Chronicle

---

### 9. Revalidation Detail

**Consumer:** Revalidation panel (BALANCED), phase cards

Answers: "What did deterministic revalidation check, and what passed?"

```json
{
  "revalidation_detail": {
    "available": true,
    "status": "PASS",
    "total_checks": 25,
    "passed": 25,
    "failed": 0,
    "phase_count": 8,
    "phases": [
      {
        "phase_id": "STRUCTURAL_INTEGRITY",
        "phase_label": "Structural Integrity",
        "passed": 7,
        "total": 7,
        "status": "PASS"
      }
    ],
    "revalidation_narrative": "Deterministic revalidation: 25/25 checks across 8 phases. All phases PASS. Structural integrity, confidence realism, novelty pressure, reconciliation cleanliness, SQO state consistency, corpus evolution metrics — all verified deterministically."
  }
}
```

| Field | Type | Source (Resolved Payload) | Rule |
|---|---|---|---|
| `status` | string | `revalidation_intelligence.status` | Verbatim |
| `total_checks` / `passed` / `failed` | integer | `revalidation_intelligence` fields | Verbatim |
| `phases` | array | `revalidation_intelligence.phases` | Enriched with `phase_label` derived from `phase_id` |
| `revalidation_narrative` | string | 75.x — paragraph listing what was checked | Must cite check/phase counts |

**Altitude distinction from BOARDROOM:**
- BOARDROOM: `governance_legitimacy.sections.deterministic_replay.finding` — one sentence
- BALANCED: Per-phase breakdown with check counts and status

---

### 10. Guided Query Seeds

**Consumer:** Query suggestion panel (BALANCED), interaction affordances

Answers: "What structurally-grounded questions can the operator explore from this state?"

```json
{
  "guided_query_seeds": {
    "available": true,
    "queries": [
      {
        "query_id": "GQ-01",
        "query_text": "Which domains carry the highest structural concentration?",
        "query_category": "PRESSURE",
        "grounding": "pressure_zone_distribution",
        "depth_target": "DENSE"
      },
      {
        "query_id": "GQ-02",
        "query_text": "What claims were rejected during governance review?",
        "query_category": "FRICTION",
        "grounding": "governance_friction",
        "depth_target": "INVESTIGATION"
      },
      {
        "query_id": "GQ-03",
        "query_text": "How did evidence enrichment change domain confidence?",
        "query_category": "ENRICHMENT",
        "grounding": "enrichment_corrections",
        "depth_target": "DENSE"
      },
      {
        "query_id": "GQ-04",
        "query_text": "What governance patterns converge across specimens?",
        "query_category": "CONVERGENCE",
        "grounding": "convergence_observations",
        "depth_target": "INVESTIGATION"
      },
      {
        "query_id": "GQ-05",
        "query_text": "Which signal families are activated and why?",
        "query_category": "SIGNALS",
        "grounding": "signal_family_explanation",
        "depth_target": "DENSE"
      }
    ]
  }
}
```

| Field | Type | Source | Rule |
|---|---|---|---|
| `queries` | array | Structurally derived from available sections | Only emit queries for sections with `available: true` |
| `query_text` | string | Static per category — not generated | Fixed vocabulary, not LLM prose |
| `grounding` | string | Reference to the BALANCED section that would answer this query | Structural pointer, not interpretation |
| `depth_target` | string | Which persona provides deeper answer | `DENSE` or `INVESTIGATION` |

**Derivation rules:**
- Queries are structurally derived from projection state, not generated
- A query is only available if its grounding section has `available: true`
- Query text is static per category — same questions for all governed specimens
- These are affordances for persona transition, not a chatbot interface

---

### 11. Domain Coverage (Extended)

**Consumer:** Domain exploration panel (BALANCED), coverage cards

Answers: "What is the semantic domain landscape, and which domains have governed propositions?"

```json
{
  "domain_coverage_extended": {
    "available": true,
    "total_domains": 17,
    "structurally_backed": 13,
    "semantic_only": 4,
    "grounding_ratio": 0.76,
    "coverage_label": "13 of 17 domains structurally grounded",
    "cluster_count": 8,
    "proposition_coverage": {
      "domains_with_propositions": 17,
      "mean_confidence": 0.728,
      "derivation_path": "SDC → PROPOSITION_BRIDGE"
    },
    "coverage_narrative": "17 semantic domains, 13 structurally backed. 85 propositions across 4 PATH B classes. Mean proposition confidence: 72.8%. Evidence derivation via SDC → PROPOSITION_BRIDGE."
  }
}
```

| Field | Type | Source (Resolved Payload) | Rule |
|---|---|---|---|
| `total_domains` / `structurally_backed` / `semantic_only` | integer | `topology_summary` fields | Verbatim (shared with BOARDROOM) |
| `proposition_coverage` | object | `proposition_corpus` fields | BALANCED-specific — not in BOARDROOM |
| `coverage_narrative` | string | 75.x — paragraph combining topology and proposition coverage | Must cite domain counts and proposition stats |

**Altitude distinction from BOARDROOM:**
- BOARDROOM: `domain_coverage` — counts and label only
- BALANCED: Adds proposition coverage, confidence, derivation path, narrative

---

### 12. Authority Declaration

**Consumer:** All BALANCED components (footer/disclosure wrappers)

The authority under which this projection was compiled. Same structure as BOARDROOM, different contract reference.

```json
{
  "authority_declaration": {
    "interpretive_authority": "75.x",
    "authority_ceiling": "L3",
    "governance_contract": "BALANCED_PROJECTION_CONTRACT_v1",
    "evidence_traced": true,
    "prohibitions_enforced": 13,
    "structural_derivation_primary": true,
    "compilation_timestamp": "<utc_iso>",
    "resolved_payload_hash": "<sha256>",
    "compiler_version": "1.0.0"
  }
}
```

Same fields and rules as BOARDROOM authority declaration. Only `governance_contract` differs.

---

## Complete Object Shape

```json
{
  "projection_id": "<uuid>",
  "persona": "BALANCED",
  "altitude": "INVESTIGATIVE",
  "generated_at": "<utc_iso>",
  "specimen_id": "<client>",
  "run_id": "<run_id>",
  "schema_version": "1.0.0",

  "qualification_timeline": { ... },
  "signal_family_explanation": { ... },
  "pressure_zone_distribution": { ... },
  "governance_friction": { ... },
  "enrichment_corrections": { ... },
  "constitutional_anchor_dimensions": { ... },
  "convergence_observations": { ... },
  "chronicle_navigation": { ... },
  "revalidation_detail": { ... },
  "guided_query_seeds": { ... },
  "domain_coverage_extended": { ... },
  "authority_declaration": { ... }
}
```

12 sections. No ad hoc fields. No field exists without being defined in this contract.

---

## Altitude Distinction Matrix

| Intelligence Element | BOARDROOM (Executive) | BALANCED (Investigative) |
|---|---|---|
| Qualification state | One-line posture label | Full transition timeline with gates |
| Signals | Family badges, executive reading | Family explanation, activation context, investigative reading |
| Pressure zones | Named zone, one-sentence narrative | Distribution analysis, propagation flow narrative |
| Governance review | "N propositions reviewed" | Full friction decomposition: class/tier, accept/reject/arbitrate, friction rate |
| Enrichment | "N domains corrected" | Correction counts, confidence delta, no-match gaps, debt trajectory |
| Constitutional anchor | "No advancement blockers" | Per-dimension breakdown, reference/candidate specimens |
| Convergence | "N observations across M specimens" | Convergence/divergence/mixed lists, maturity classification, per-observation |
| Chronicle | "Replay-certified" | Phase-level breakdown, semantic phase labels, descent invitation |
| Revalidation | "N/N checks PASS" | Per-phase breakdown with individual check counts |
| Guided queries | Not available | Structurally-derived query suggestions with depth targets |
| Domain coverage | Counts and label | Adds proposition coverage, confidence, derivation path |
| Governed narrative | 3-paragraph 75.x narrative | Shared — same narrative available at both altitudes |

---

## Shared vs. Distinct Sections

Some BALANCED sections share derivation logic with BOARDROOM. The compiler should factor shared derivation where practical:

| BALANCED Section | Shares Derivation With | Distinction |
|---|---|---|
| `qualification_timeline` | `qualification_posture` (BOARDROOM) | Shared S-level gate. BALANCED adds transitions, gates, timeline narrative |
| `pressure_zone_distribution` | `propagation_chain` (BOARDROOM) | Shared triadic derivation. BALANCED adds primary zone, flow narrative |
| `signal_family_explanation` | `signal_intelligence` (BOARDROOM) | Shared family grouping. BALANCED adds family explanation, activation context |
| `domain_coverage_extended` | `domain_coverage` (BOARDROOM) | Shared topology counts. BALANCED adds proposition coverage |
| `authority_declaration` | `authority_declaration` (BOARDROOM) | Same structure, different contract reference |

Sections with no BOARDROOM equivalent (BALANCED-only):
- `governance_friction` — BOARDROOM has a one-sentence finding; BALANCED has full decomposition
- `enrichment_corrections` — BOARDROOM has a one-sentence finding; BALANCED has full decomposition
- `constitutional_anchor_dimensions` — BOARDROOM has a one-sentence finding; BALANCED has dimension breakdown
- `convergence_observations` — BOARDROOM has a one-sentence finding; BALANCED has observation decomposition
- `chronicle_navigation` — BOARDROOM has no Chronicle surface; BALANCED has phase-level navigation
- `revalidation_detail` — BOARDROOM has a one-sentence finding; BALANCED has phase breakdown
- `guided_query_seeds` — BALANCED-only interaction affordance

---

## Compilation Rules

### Input

The projection compiler receives:
1. The resolved payload (Layer 2 output)
2. The persona identifier (`BALANCED`)
3. The authority declaration configuration

### Compilation Steps

1. **Resolve qualification timeline** — extract transitions, derive governance gates cleared, compose timeline narrative
2. **Compile signal family explanation** — group signals, compose family explanations and activation contexts
3. **Compile pressure zone distribution** — identify primary zone, compose propagation flow narrative
4. **Compile governance friction** — extract disposition counts, class/tier distribution, compose friction narrative
5. **Compile enrichment corrections** — extract correction counts, compose correction narrative
6. **Compile constitutional anchor dimensions** — extract per-dimension verdicts, compose anchor narrative
7. **Compile convergence observations** — extract convergence/divergence lists, compose convergence narrative
8. **Compile chronicle navigation** — extract phase breakdown, compose chronicle narrative, gate descent
9. **Compile revalidation detail** — extract per-phase breakdown, compose revalidation narrative
10. **Derive guided query seeds** — emit queries only for available sections
11. **Compile domain coverage extended** — extend BOARDROOM coverage with proposition stats
12. **Attach authority declaration** — static self-attestation with BALANCED contract reference

### Determinism

Same resolved payload → same balanced projection (given same compiler version). No stochastic behavior. No prompt-based generation. All prose is template-composed from structural facts under 75.x authority.

### Governed vs. Legacy

| Resolved Payload State | Projection Behavior |
|---|---|
| `governance_lifecycle.available === true` and `s_level in [S1,S2,S3]` | Full governed projection — all 12 sections populated |
| `governance_lifecycle` absent or `s_level` below S1 | Legacy projection — most sections have `available: false`, domain coverage and signals still populate from legacy data |

The contract does not change shape between governed and legacy runs. Sections that aren't applicable have `available: false` and null/empty detail fields.

---

## Prohibited Transformations

The BALANCED projection object MUST NOT contain:

1. **Raw substrate identifiers** — CLU-04, PSIG-001, entity_path, population_size, threshold values
2. **Engineering prose** — "activation_state ELEVATED at threshold 0.33", "fanout ratio 4.2"
3. **Rendering instructions** — CSS class names, layout constants, component references
4. **Prescriptive language** — "you should", "we recommend", "next steps"
5. **Organizational diagnosis** — team behavior, leadership quality, management effectiveness
6. **Personnel attribution** — individual names (actor IDs are structural facts, not attribution)
7. **Cross-persona content at wrong altitude** — INVESTIGATION forensic detail, raw proposition tables
8. **Uncited claims** — any sentence not traceable to a resolved payload fact
9. **Speculative projections** — future state predictions, risk forecasts
10. **Comparative rankings** — "worse than X", "better than average"
11. **BOARDROOM content duplication** — BALANCED must not re-derive BOARDROOM's executive readings; it derives its own investigative-altitude content from the same resolved payload

---

## Relationship to BOARDROOM

BALANCED and BOARDROOM are siblings, not parent-child. They:
- Share the same resolved payload (Layer 2) as input
- Share the same compiler infrastructure
- Share some derivation logic (factored as shared helper functions)
- Produce structurally independent projection objects
- Are consumed by structurally independent component trees

BALANCED does NOT consume `boardroom_projection`. BALANCED does NOT extend `boardroom_projection`. They are parallel Layer 3 compilations from the same Layer 2 input.

The operator transitions from BOARDROOM to BALANCED (persona switch), receiving the `balanced_projection` object compiled from the same resolved payload. The transition reveals depth — the same intelligence at investigative altitude.

---

## Non-Governed Fallback

When `governed === false`, BALANCED operates at reduced capacity:

| Section | Legacy Behavior |
|---|---|
| `qualification_timeline` | `available: false` |
| `signal_family_explanation` | Available — signals exist for legacy runs. Family explanations populate. No governance context. |
| `pressure_zone_distribution` | Available if evidence_blocks exist |
| `governance_friction` | `available: false` |
| `enrichment_corrections` | `available: false` |
| `constitutional_anchor_dimensions` | `available: false` |
| `convergence_observations` | `available: false` |
| `chronicle_navigation` | `available: false` |
| `revalidation_detail` | `available: false` |
| `guided_query_seeds` | Reduced — only queries for available sections |
| `domain_coverage_extended` | Available — topology counts exist. No proposition coverage. |
| `authority_declaration` | Always available |

Legacy BALANCED is sparse. This is correct — the journey doesn't exist yet.

---

## Validation

A valid BALANCED projection object passes these checks:

| Check | Rule |
|---|---|
| Schema conformance | All 12 top-level sections present |
| Projection identity | `persona === "BALANCED"`, `altitude === "INVESTIGATIVE"` |
| Authority declaration | `interpretive_authority === "75.x"`, `evidence_traced === true` |
| Qualification gate | If `governed === true` in timeline, then `s_level` is one of `S1`, `S2`, `S3` |
| Timeline consistency | `transition_count === transitions.length` |
| Signal completeness | Every signal in signal_family_explanation has a non-empty `investigative_reading` |
| Friction arithmetic | `accepted + rejected + arbitrated + contested === total` |
| Coverage arithmetic | `structurally_backed + semantic_only === total_domains` |
| Query grounding | Every guided_query references an available section |
| Convergence maturity | If 2 specimens, maturity must be DESCRIPTIVE |
| Resolved payload hash | `authority_declaration.resolved_payload_hash` matches actual input |
| Narrative citation | Every `*_narrative` field references at least one numeric structural fact |

---

## Versioning

Same rules as BOARDROOM. Schema version follows semver. Components declare minimum contract version. Version mismatch → fail closed.
