# BOARDROOM Projection Object Contract

Stream: PI.LENS.GOVERNED-PROJECTION-OBJECT-MODEL.01
Classification: G1 (architecture-mutating)
Date: 2026-05-24
Depends on: GOVERNED_PROJECTION_OBJECT_MODEL.md (Layer 3 definition)
Implements: Layer 3 contract for BOARDROOM persona

---

## Purpose

This document defines the exact shape, fields, rules, and authority boundary for the `boardroom_projection` object — the governed projection object consumed by all BOARDROOM persona surfaces.

BOARDROOM components render this object. They do not derive semantic meaning from `fullReport` or raw substrate artifacts. Every visible field in the BOARDROOM experience traces to a field in this contract.

---

## Projection Identity

```json
{
  "projection_id": "<uuid>",
  "persona": "BOARDROOM",
  "altitude": "EXECUTIVE",
  "generated_at": "<utc_iso>",
  "specimen_id": "<client>",
  "run_id": "<run_id>",
  "schema_version": "1.0.0"
}
```

Immutable per projection. `projection_id` is unique per compilation. `schema_version` is the contract version this object conforms to.

---

## Sections

The BOARDROOM projection object contains 9 sections. Each section is defined below with its field inventory, derivation source, and rendering intent.

### 1. Qualification Posture

**Consumer:** DeclarationZone (governed branch), ExecutiveInterpretation (left panel header)

The executive-altitude qualification state. Answers: "Where does this specimen stand in the governed lifecycle?"

```json
{
  "qualification_posture": {
    "s_level": "S2",
    "qualification_method": "GOVERNED_LIFECYCLE",
    "governed": true,
    "posture_label": "S2 GOVERNED",
    "provenance_summary": "Earned through 10-stream governance lifecycle with 12 governance events.",
    "authority_ceiling": "L3",
    "authority_ceiling_label": "AI-derived intelligence under bounded interpretive authority."
  }
}
```

| Field | Type | Source (Resolved Payload) | Rule |
|---|---|---|---|
| `s_level` | string | `governance_lifecycle.s_level` | Verbatim pass-through |
| `qualification_method` | enum | Derived: `GOVERNED_LIFECYCLE` if promotion_state has governed transitions; `LEGACY_BRIDGE` if bridge provenance; `LEGACY` otherwise | Deterministic classification |
| `governed` | boolean | `governance_lifecycle.available && s_level in [S1,S2,S3]` | Gate for all governed rendering |
| `posture_label` | string | Composed: `"${s_level} GOVERNED"` or `"${s_level} LEGACY"` | Executive-altitude label |
| `provenance_summary` | string | Composed from `governance_lifecycle.transitions`, `governance_lifecycle.governance_event_count` | 75.x — one sentence, evidence-cited |
| `authority_ceiling` | string | `governance_lifecycle.authority_ceiling` | Verbatim pass-through |
| `authority_ceiling_label` | string | Static per authority ceiling value | Mapping, not interpretation |

**Non-governed fallback:** When `governed` is false, the qualification posture section still populates using legacy readiness model:

```json
{
  "qualification_posture": {
    "s_level": null,
    "qualification_method": "LEGACY",
    "governed": false,
    "posture_label": "INVESTIGATE",
    "provenance_summary": null,
    "authority_ceiling": null,
    "authority_ceiling_label": null
  }
}
```

`posture_label` maps from `readiness_summary.posture` for legacy runs.

---

### 2. Tension Summary

**Consumer:** DeclarationZone (tension count), ExecutiveInterpretation (pressure annotation)

The structural tension state projected at executive altitude. BOARDROOM sees families, not individual signals.

```json
{
  "tension_summary": {
    "tension_count": 3,
    "tension_label": "3 STRUCTURAL TENSIONS",
    "active_families": ["DPSIG", "PSIG", "ISIG"],
    "pressure_zone": "Platform Infrastructure and Data",
    "pressure_zone_narrative": "Structural load concentrates in Platform Infrastructure and Data — this domain carries disproportionate weight across the system."
  }
}
```

| Field | Type | Source (Resolved Payload) | Rule |
|---|---|---|---|
| `tension_count` | integer | Count of distinct `signal_family` values among activated signals | Family count, not signal count |
| `tension_label` | string | Composed: `"${tension_count} STRUCTURAL TENSION${tension_count !== 1 ? 'S' : ''}"` or `"NO ELEVATED PRESSURE"` when 0 | Deterministic template |
| `active_families` | string[] | Unique `signal_family` values from activated signals | Sorted: DPSIG, PSIG, ISIG |
| `pressure_zone` | string | `zone_anchor_domain_name` from resolved payload | Business-domain label, not cluster ID |
| `pressure_zone_narrative` | string | 75.x — one sentence describing concentration and organizational exposure | Evidence-cited, no prescription |

**Activation criteria:** A signal is "activated" when its `severity` (or `activation_state`) is not `NOMINAL`. This is a structural fact from the resolved payload, not a projection decision.

---

### 3. Signal Intelligence

**Consumer:** CockpitSignalBar (governed), ExecutiveInterpretation (briefing)

Per-family signal summaries at executive altitude. BOARDROOM does not see raw signal mechanics (values, thresholds, population sizes). It sees organizational implications.

```json
{
  "signal_intelligence": {
    "families": [
      {
        "family": "DPSIG",
        "family_label": "Structural Concentration",
        "signal_count": 2,
        "activated_count": 2,
        "signals": [
          {
            "signal_id": "DPSIG-031",
            "signal_name": "Cluster Pressure Index",
            "severity": "ELEVATED",
            "executive_reading": "Structural load concentrated in Platform Infrastructure and Data — this domain carries disproportionate architectural weight across the system.",
            "source_lineage": {
              "resolved_signal_id": "DPSIG-031",
              "derivation": "altitude_projection"
            }
          }
        ]
      }
    ],
    "total_signals": 8,
    "activated_signals": 8,
    "compound_narrative": "Compound pressure zone centers on Platform Infrastructure and Data. Elevated structural binding pressure across 3 signal families."
  }
}
```

| Field | Type | Source (Resolved Payload) | Rule |
|---|---|---|---|
| `families` | array | Grouped from resolved payload signal array by `signal_family` | One entry per family |
| `family_label` | string | Static map: DPSIG → "Structural Concentration", PSIG → "Architectural Binding", ISIG → "Import Dependency" | Fixed vocabulary, not generated |
| `signal_count` / `activated_count` | integer | Count from resolved signals per family | Structural facts |
| `signals[].signal_id` | string | Verbatim from resolved payload | Pass-through |
| `signals[].signal_name` | string | Verbatim from resolved payload | Pass-through |
| `signals[].severity` | string | Verbatim from resolved payload | Pass-through |
| `signals[].executive_reading` | string | 75.x — organizational-altitude interpretation of this signal | No CLU-IDs, no thresholds, no file paths, no ratios |
| `signals[].source_lineage` | object | Back-reference to resolved payload signal | Provenance |
| `compound_narrative` | string | 75.x — one sentence summarizing the overall pressure profile | Evidence-cited, zone-anchored |

**Executive reading derivation rules:**
- DPSIG signals: domain-anchored language ("Structural load concentrated in X")
- PSIG signals: binding/coupling language ("Cross-domain coupling exceeds structural norms")
- ISIG signals: dependency/propagation language ("A structural dependency hub concentrates import traffic")
- No signal gets a generic "pressure detected" reading — every reading must reference the specific structural phenomenon
- Domain names replace cluster IDs. Business labels replace entity paths.

---

### 4. Domain Coverage

**Consumer:** ExecutiveInterpretation (coverage annotation), TopologyGraph (governance overlay)

Structural coverage projected at executive altitude.

```json
{
  "domain_coverage": {
    "total_domains": 17,
    "structurally_backed": 13,
    "semantic_only": 4,
    "grounding_ratio": 0.76,
    "coverage_label": "13 of 17 domains structurally grounded",
    "cluster_count": 8
  }
}
```

| Field | Type | Source (Resolved Payload) | Rule |
|---|---|---|---|
| `total_domains` | integer | `topology_summary.semantic_domain_count` | Verbatim |
| `structurally_backed` | integer | `topology_summary.structurally_backed_count` | Verbatim |
| `semantic_only` | integer | `topology_summary.semantic_only_count` | Verbatim |
| `grounding_ratio` | float | `structurally_backed / total_domains` | Deterministic |
| `coverage_label` | string | Composed: `"${backed} of ${total} domains structurally grounded"` | Deterministic template |
| `cluster_count` | integer | `topology_summary.cluster_count` | Verbatim |

These are structural facts at executive altitude. The projection compiler adds `coverage_label` (template, not interpretation) but does not interpret what the grounding ratio means for the organization.

---

### 5. Governed Narrative

**Consumer:** NarrativeEnvelope (BOARDROOM right panel / center)

The 75.x governed narrative produced by GoverningNarrativeComposer. This is an existing projection artifact — already correctly separated into its own module. The projection compiler passes it through with minimal transformation.

```json
{
  "governed_narrative": {
    "available": true,
    "paragraphs": [
      {
        "text": "...",
        "arc_position": "OPENING",
        "anchors": ["evidence_object_id_1"],
        "governance": { "authority": "75.x", "method": "evidence_synthesized" }
      }
    ],
    "composition_provenance": {
      "method": "structural_evidence_synthesis",
      "governance_contract": "75.x_bounded_interpretive",
      "anchors_consumed": 4,
      "evidence_objects_referenced": 3
    },
    "qualification_context": {
      "specimen_display": "BlueEdge"
    },
    "proof_graph": {
      "evidence_objects": ["eo_1", "eo_2"]
    }
  }
}
```

| Field | Type | Source | Rule |
|---|---|---|---|
| `available` | boolean | `governed_narrative` exists and has paragraphs | Gate field |
| `paragraphs` | array | `governed_narrative.paragraphs` from GoverningNarrativeComposer | Pass-through — already governed |
| `composition_provenance` | object | `governed_narrative.composition_provenance` | Pass-through |
| `qualification_context` | object | `governed_narrative.qualification_context` | Pass-through |
| `proof_graph` | object | `governed_narrative.proof_graph` | Pass-through |

The governed narrative is the one section where the projection compiler is primarily a pass-through. GoverningNarrativeComposer already operates at Layer 3 authority — it produces 75.x governed prose from spine objects. The projection compiler's job is to include or exclude it based on qualification state, not to re-derive it.

**Gate:** Governed narrative is available only when `qualification_posture.governed === true` and `s_level` is `S1` or higher.

---

### 6. Governance Legitimacy

**Consumer:** BoardroomGovernanceIntelligence (governed cockpit), ExecutiveInterpretation (left panel governance section)

The governed lifecycle projected at executive altitude. Each sub-section answers one governance question an executive would ask.

```json
{
  "governance_legitimacy": {
    "available": true,
    "lifecycle_summary": "Fully governed S2 lifecycle. 10 governance streams. 12 governance events.",
    "sections": {
      "proposition_review": {
        "available": true,
        "finding": "77 semantic propositions reviewed. 60 accepted, 8 rejected, 9 arbitrated. 22% governance friction rate.",
        "detail": {
          "total": 77,
          "accepted": 60,
          "rejected": 8,
          "arbitrated": 9,
          "friction_rate": 0.22
        }
      },
      "evidence_enrichment": {
        "available": true,
        "finding": "3 evidence enrichment events corrected confidence across 5 domains.",
        "detail": {
          "enrichment_events": 3,
          "domains_corrected": 5
        }
      },
      "deterministic_replay": {
        "available": true,
        "finding": "Deterministic revalidation PASS. 48 of 48 checks across 9 phases.",
        "detail": {
          "status": "PASS",
          "passed": 48,
          "total_checks": 48,
          "phase_count": 9
        }
      },
      "constitutional_anchor": {
        "available": true,
        "finding": "Constitutional replay anchor verified. No advancement blockers.",
        "detail": {
          "advancement_blocked": false,
          "overall_verdict": "PASS"
        }
      },
      "cross_specimen": {
        "available": true,
        "finding": "7 cross-specimen convergence observations across 2 specimens.",
        "detail": {
          "total_observations": 7,
          "convergences": 5,
          "divergences": 2
        }
      },
      "replay_certification": {
        "available": true,
        "finding": "Replay corridor certified. 48 of 48 checks across 9 phases.",
        "detail": {
          "certification_status": "CERTIFIED",
          "passed": 48,
          "total_checks": 48,
          "phase_count": 9
        }
      }
    }
  }
}
```

| Sub-Section | Source (Resolved Payload) | Finding Derivation |
|---|---|---|
| `proposition_review` | `proposition_corpus` | 75.x — one-sentence summary of disposition counts and friction rate |
| `evidence_enrichment` | `enrichment_intelligence` | 75.x — one-sentence summary of enrichment events and coverage |
| `deterministic_replay` | `revalidation_intelligence` | 75.x — one-sentence verdict with pass/total and phase count |
| `constitutional_anchor` | `constitutional_anchor` | 75.x — one-sentence anchor gate status |
| `cross_specimen` | `convergence_intelligence` | 75.x — one-sentence convergence summary with specimen count |
| `replay_certification` | `chronicle_certification` | 75.x — one-sentence certification status |

**Finding rules:**
- Each `finding` is exactly one sentence
- Each `finding` cites at least one numeric structural fact from `detail`
- No finding prescribes action or diagnoses organizational behavior
- Findings are deterministic given the same `detail` values
- `detail` contains the structural facts that back the finding — components may render either

**Availability cascade:** Each sub-section has its own `available` gate. The top-level `governance_legitimacy.available` is true when `qualification_posture.governed === true`. Individual sub-sections may be unavailable even when the parent is available (e.g., no convergence observations for a first specimen).

---

### 7. Propagation Chain

**Consumer:** ExecutiveInterpretation (evidence panel), BoardroomDecisionSurface (propagation chain visual)

The triadic propagation chain projected at executive altitude.

```json
{
  "propagation_chain": {
    "available": true,
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
  }
}
```

| Field | Type | Source (Resolved Payload) | Rule |
|---|---|---|---|
| `available` | boolean | At least one evidence_block exists | Gate |
| `origin.domain_label` | string | Domain name(s) from ORIGIN evidence block | Business-domain language |
| `origin.evidence_summary` | string | 75.x — one-sentence description of origin role | No file paths, no CLU-IDs |
| `passthrough` | object | Same pattern from PASS_THROUGH evidence blocks | May be null if no passthrough |
| `receiver` | object | Same pattern from RECEIVER evidence blocks | May be null if no receiver |

Evidence summaries describe structural roles (origin, transfer, absorption), not engineering specifics.

---

### 8. Topology Reference

**Consumer:** TopologyGraph (modal), ExecutiveInterpretation (topology count)

Pointer to topology data, not embedded topology. BOARDROOM doesn't render inline topology — it provides a modal exploration affordance.

```json
{
  "topology_reference": {
    "available": true,
    "domain_count": 17,
    "cluster_count": 8,
    "edge_count": 24,
    "governance_overlay": {
      "grounding_status": true,
      "pressure_zone_highlighting": true,
      "proposition_state_indicators": true
    },
    "data_ref": "resolved_payload.topology"
  }
}
```

| Field | Type | Source | Rule |
|---|---|---|---|
| `domain_count` / `cluster_count` / `edge_count` | integer | Topology summary counts | Structural facts |
| `governance_overlay` | object | Flags for which overlays the projection authorizes | BOARDROOM gets grounding + pressure + proposition state |
| `data_ref` | string | Pointer to resolved payload topology data | Components fetch topology data from resolved payload via this reference |

The topology reference tells the component WHAT governance overlays to apply. The actual rendering data (domain positions, edge lists) comes from the resolved payload directly — topology is structural data, not altitude-specific projection.

---

### 9. Authority Declaration

**Consumer:** All BOARDROOM components (footer/disclosure wrappers)

The authority under which this projection was compiled.

```json
{
  "authority_declaration": {
    "interpretive_authority": "75.x",
    "authority_ceiling": "L3",
    "governance_contract": "BOARDROOM_PROJECTION_CONTRACT_v1",
    "evidence_traced": true,
    "prohibitions_enforced": 13,
    "structural_derivation_primary": true,
    "compilation_timestamp": "<utc_iso>",
    "resolved_payload_hash": "<sha256>",
    "compiler_version": "1.0.0"
  }
}
```

| Field | Type | Rule |
|---|---|---|
| `interpretive_authority` | string | Always `"75.x"` for BOARDROOM |
| `authority_ceiling` | string | Always `"L3"` for AI-derived |
| `governance_contract` | string | Contract name + version |
| `evidence_traced` | boolean | Always `true` — compilation enforces this |
| `prohibitions_enforced` | integer | Always `13` — per CLAUDE.md §3.4.1 |
| `structural_derivation_primary` | boolean | Always `true` — interpretation is additive |
| `resolved_payload_hash` | string | SHA-256 of the resolved payload this projection was compiled from |
| `compiler_version` | string | Compiler module version |

The authority declaration is the projection object's self-attestation. It does not change per specimen — it declares the rules under which compilation occurred.

---

## Complete Object Shape

```json
{
  "projection_id": "<uuid>",
  "persona": "BOARDROOM",
  "altitude": "EXECUTIVE",
  "generated_at": "<utc_iso>",
  "specimen_id": "<client>",
  "run_id": "<run_id>",
  "schema_version": "1.0.0",

  "qualification_posture": { ... },
  "tension_summary": { ... },
  "signal_intelligence": { ... },
  "domain_coverage": { ... },
  "governed_narrative": { ... },
  "governance_legitimacy": { ... },
  "propagation_chain": { ... },
  "topology_reference": { ... },
  "authority_declaration": { ... }
}
```

9 sections. No ad hoc fields. No field exists without being defined in this contract.

---

## Current-to-Contract Field Mapping

How BOARDROOM components' current `fullReport` consumption maps to this contract:

| Current Field (from fullReport) | Contract Section | Contract Field |
|---|---|---|
| `governance_lifecycle.s_level` | `qualification_posture` | `s_level` |
| `governance_lifecycle.available` | `qualification_posture` | `governed` |
| `governance_lifecycle.qualification_provenance` | `qualification_posture` | `provenance_summary` |
| `governance_lifecycle.authority_ceiling` | `qualification_posture` | `authority_ceiling` |
| `readiness_summary.posture` | `qualification_posture` | `posture_label` (legacy) |
| `signal_interpretations` (filtered by severity) | `tension_summary` | `tension_count`, `active_families` |
| `propagation_summary.primary_zone_business_label` | `tension_summary` | `pressure_zone` |
| `signal_interpretations[].boardroom_interpretation` | `signal_intelligence.families[].signals[].executive_reading` | — |
| `signal_interpretations[].signal_family` | `signal_intelligence.families[].family` | — |
| `signal_interpretations[].severity` | `signal_intelligence.families[].signals[].severity` | — |
| `topology_summary.structurally_backed_count` | `domain_coverage` | `structurally_backed` |
| `topology_summary.semantic_domain_count` | `domain_coverage` | `total_domains` |
| `topology_summary.semantic_only_count` | `domain_coverage` | `semantic_only` |
| `topology_summary.cluster_count` | `domain_coverage` | `cluster_count` |
| `governed_narrative` (full object) | `governed_narrative` | Pass-through |
| `proposition_corpus` | `governance_legitimacy.sections.proposition_review` | — |
| `enrichment_intelligence` | `governance_legitimacy.sections.evidence_enrichment` | — |
| `revalidation_intelligence` | `governance_legitimacy.sections.deterministic_replay` | — |
| `constitutional_anchor` | `governance_legitimacy.sections.constitutional_anchor` | — |
| `convergence_intelligence` | `governance_legitimacy.sections.cross_specimen` | — |
| `chronicle_certification` | `governance_legitimacy.sections.replay_certification` | — |
| `evidence_blocks` (ORIGIN/PASS_THROUGH/RECEIVER) | `propagation_chain` | `origin`, `passthrough`, `receiver` |
| `semantic_domain_registry` | `topology_reference` | `data_ref` (pointer) |
| `semantic_cluster_registry` | `topology_reference` | `data_ref` (pointer) |
| `semantic_topology_edges` | `topology_reference` | `data_ref` (pointer) |

**Fields NOT in this contract (consumed by BOARDROOM currently but excluded):**

| Field | Reason for Exclusion |
|---|---|
| `readiness_summary.score` | Legacy scoring model — not part of governed projection |
| `readiness_summary.band` | Legacy band model — not part of governed projection |
| `readiness_summary.conclusion` | Legacy conclusion — not part of governed projection |
| `qualifier_summary` | Technical Q-class derivation — below BOARDROOM altitude |
| `topology_scope` | Non-governed mode only |

These legacy fields are consumed by the non-governed BOARDROOM path. During the transition period, the non-governed path continues reading from `fullReport` until all runs are governed, at which point these fields are no longer needed by BOARDROOM.

---

## Compilation Rules

### Input

The projection compiler receives:
1. The resolved payload (Layer 2 output)
2. The persona identifier (`BOARDROOM`)
3. The authority declaration configuration

### Compilation Steps

1. **Resolve qualification posture** — classify governed/legacy, derive posture label
2. **Compile tension summary** — group signals by family, count activated, derive pressure zone label
3. **Compile signal intelligence** — generate executive readings per signal, compose compound narrative
4. **Compile domain coverage** — extract topology counts, compose coverage label
5. **Pass through governed narrative** — include if available and qualified
6. **Compile governance legitimacy** — generate one-sentence findings per governance sub-section
7. **Compile propagation chain** — map evidence blocks to domain-labeled triadic chain
8. **Set topology reference** — counts + governance overlay flags + data pointer
9. **Attach authority declaration** — static self-attestation

### Determinism

Same resolved payload → same boardroom projection (given same compiler version). No stochastic behavior. No prompt-based generation. All prose is template-composed from structural facts under 75.x authority.

### Governed vs. Legacy

The projection compiler handles both:

| Resolved Payload State | Projection Behavior |
|---|---|
| `governance_lifecycle.available === true` and `s_level in [S1,S2,S3]` | Full governed projection — all 9 sections populated |
| `governance_lifecycle` absent or `s_level` below S1 | Legacy projection — `qualification_posture.governed = false`, `governance_legitimacy.available = false`, other sections populate from legacy fields where possible |

The contract does not change shape between governed and legacy runs. Sections that aren't applicable have `available: false` and null/empty detail fields. Components check `available` gates — they don't branch on presence/absence of top-level keys.

---

## Prohibited Transformations

The BOARDROOM projection object MUST NOT contain:

1. **Raw substrate identifiers** — CLU-04, PSIG-001, entity_path, population_size, threshold values
2. **Engineering prose** — "activation_state ELEVATED at threshold 0.33", "fanout ratio 4.2"
3. **Rendering instructions** — CSS class names, layout constants, component references
4. **Prescriptive language** — "you should", "we recommend", "next steps"
5. **Organizational diagnosis** — team behavior, leadership quality, management effectiveness
6. **Personnel attribution** — individual names, role-based behavioral claims
7. **Cross-persona content** — DENSE-altitude per-signal mechanics, INVESTIGATION forensic trails
8. **Uncited claims** — any sentence not traceable to a resolved payload fact
9. **Speculative projections** — future state predictions, risk forecasts
10. **Comparative rankings** — "worse than X", "better than average"

---

## Component Migration Path

When the projection compiler is built (Phase 2), each BOARDROOM component migrates from `fullReport` to `boardroom_projection`:

| Component | Current Source | Target Source | Migration Complexity |
|---|---|---|---|
| `DeclarationZone` (governed) | `fullReport.governance_lifecycle`, `fullReport.signal_interpretations` | `boardroom_projection.qualification_posture`, `boardroom_projection.tension_summary` | Low — direct field mapping |
| `CockpitSignalBar` (governed) | `fullReport.signal_interpretations[].boardroom_interpretation` | `boardroom_projection.signal_intelligence.families[].signals[].executive_reading` | Low — field rename |
| `ExecutiveInterpretation` (governed left panel) | Multiple fullReport fields | `boardroom_projection.qualification_posture`, `boardroom_projection.tension_summary`, `boardroom_projection.domain_coverage`, `boardroom_projection.governance_legitimacy` | Medium — multiple field sources collapse into sections |
| `NarrativeEnvelope` | `fullReport.governed_narrative` | `boardroom_projection.governed_narrative` | Trivial — pass-through |
| `BoardroomGovernanceIntelligence` | `fullReport.proposition_corpus`, `.enrichment_intelligence`, `.revalidation_intelligence`, `.constitutional_anchor`, `.convergence_intelligence`, `.chronicle_certification` | `boardroom_projection.governance_legitimacy.sections.*` | Medium — 6 fields collapse into sub-sections with pre-composed findings |
| `BoardroomDecisionSurface` (evidence/propagation) | `fullReport.evidence_blocks`, `fullReport.propagation_summary` | `boardroom_projection.propagation_chain` | Medium — triadic chain already structured |
| `TopologyGraph` (modal) | `fullReport.semantic_domain_registry`, `.semantic_cluster_registry`, `.semantic_topology_edges` | `boardroom_projection.topology_reference` (pointer) + resolved payload (data) | Low — topology data stays in resolved payload |

---

## Validation

A valid BOARDROOM projection object passes these checks:

| Check | Rule |
|---|---|
| Schema conformance | All 9 top-level sections present |
| Projection identity | `persona === "BOARDROOM"`, `altitude === "EXECUTIVE"` |
| Authority declaration | `interpretive_authority === "75.x"`, `evidence_traced === true` |
| Qualification gate | If `governed === true`, then `s_level` is one of `S1`, `S2`, `S3` |
| Tension consistency | `tension_count === active_families.length` |
| Signal completeness | Every signal in signal_intelligence has a non-empty `executive_reading` |
| Coverage arithmetic | `structurally_backed + semantic_only === total_domains` |
| Narrative gate | `governed_narrative.available` only true when `governed === true` and `s_level >= S1` |
| Legitimacy cascade | `governance_legitimacy.available` only true when `governed === true` |
| Finding citation | Every finding sentence references at least one numeric fact from its detail |
| Resolved payload hash | `authority_declaration.resolved_payload_hash` matches actual input |

---

## Versioning

The contract version (`schema_version`) follows semantic versioning:

- **Major** — section added/removed, field type changed, validation rule changed
- **Minor** — new optional field within existing section, new governance_legitimacy sub-section
- **Patch** — finding template wording refinement, label text update

Components declare the minimum contract version they support. The projection compiler tags every output with the contract version it conforms to. Version mismatch → fail closed.

---

## Interim Compatibility

During the transition from `fullReport` to `boardroom_projection`:

1. The projection compiler produces the `boardroom_projection` object
2. The orchestrator passes BOTH `fullReport` (legacy) and `boardroom_projection` (new) to BOARDROOM components
3. Components migrate one section at a time — each section switch is a discrete, testable change
4. When all BOARDROOM components consume only `boardroom_projection`, the `fullReport` pass-through to BOARDROOM is removed
5. `fullReport` continues to exist for BALANCED/DENSE/INVESTIGATION until their projection contracts are defined

No big-bang migration. No parallel data paths that silently diverge. Each component switch is verified by: (a) the component renders identically before and after, and (b) the component no longer references any `fullReport` field.
