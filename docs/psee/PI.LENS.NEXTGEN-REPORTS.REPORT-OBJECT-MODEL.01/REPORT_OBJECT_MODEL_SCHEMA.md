# Report Object Model — Schema Reference

**Stream:** PI.LENS.NEXTGEN-REPORTS.REPORT-OBJECT-MODEL.01  
**Document type:** SCHEMA REFERENCE — IMPLEMENTATION AUTHORITY  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Branch:** work/lens-v2-productization  
**Milestone tag:** lens-v2-productization-bridge-v1 (4e2a9e2)  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  

**Upstream authority:**
- `docs/psee/PI.LENS.GEIOS.PRODUCTIZATION-BRIDGE.01/GEIOS_LENS_PRODUCTIZATION_BRIDGE.md` §5, §6, §7, §12
- `docs/psee/PI.LENS.GEIOS.STRATEGIC-PRODUCTIZATION-MISSION.01/GEIOS_LENS_STRATEGIC_PRODUCTIZATION_MISSION.md` §5, §6

---

## 1. Purpose

This document defines the formal, implementation-ready schema for the **Report Object** — the governed bridge artifact that carries GEIOS-derived intelligence across the substrate/product boundary into the LENS executive rendering surface.

The report object is not a computation artifact. It is a **delivery artifact** — a sealed, hash-verified container of governed intelligence outputs that LENS renders without modification.

---

## 2. Scope

**In scope:**
- report_object schema definition (all fields, types, constraints)
- intelligence module composition model
- explainability bundle schema
- interaction registry schema
- module registry schema
- rendering metadata schema
- trace linkage schema
- validation behavior rules (complement to `report_object_validation_rules.json`)
- blocked/diagnostic state rendering rules
- forbidden transformation catalog

**Out of scope:**
- UI component implementation
- cognitive normalization implementation
- report generation pipeline changes
- DPSIG derivation logic
- LLM prompt orchestration
- RAG retrieval infrastructure
- memory layer activation
- workspace shell implementation
- any live AI interaction surfaces

---

## 3. Report Object Conceptual Definition

The report object is the **atomic bridge artifact** for one LENS intelligence delivery. It encapsulates all intelligence outputs produced by GEIOS for one analysis run, presented in a form that:

1. Is fully renderable by LENS without additional computation
2. Carries its own evidence integrity seal (`evidence_object_hash`)
3. Preserves all qualifier state through to the rendering surface
4. Contains workspace-compatible module registration from Phase 2 forward
5. Provides interaction injection points (inactive in Phase 2; activated by phase gates)
6. Is deterministic: the same report object always produces the same rendered intelligence module

```
REPORT OBJECT POSITION IN THE BRIDGE:

GEIOS SUBSTRATE                  │ SEAL           │ LENS SURFACE
─────────────────────────────────│────────────────│──────────────────────
Pipeline → derivation            │                │
→ evidence injection ────────────│ evidence_object │→ Evidence panels
→ cognitive normalization ───────│ _hash verified  │→ Narrative blocks
→ narrative generation ──────────│                 │→ WHY section
→ executive rendering ───────────│                 │→ Explainability bundle
→ COMMIT report_object ──────────│─────────────────│→ Intelligence module
```

---

## 4. Report Object Lifecycle

```
1. GENERATION (GEIOS substrate):
   Pipeline executes → signals derived → readiness gate classifies →
   evidence envelope sealed (evidence_object_hash set) →
   cognitive normalization applied → narrative generated →
   explainability bundle pre-rendered → report_object assembled →
   module_registry populated → interaction_registry populated →
   report_object committed to artifact store

2. BRIDGE CROSSING:
   BridgeValidator.verify(report_object):
     - evidence_object_hash present and non-empty
     - governance_verdict present and valid
     - qualifier_class present and valid
     - all required fields present
   → ValidationResult: PASS or FAIL

3. LENS RENDERING:
   IF governance_verdict = FAIL → render BlockedModule(report_id, reason)
   ELSE → SurfaceModeResolver resolves surface_mode →
   ModuleComposer assembles module_tree → DesignSystem applies tokens →
   InteractionRegistry activates Phase-2-permitted interactions →
   LENSRenderer renders ExecutiveIntelligenceModule

4. DISPLAY STATE (ephemeral; not persisted to report_object):
   Expand/collapse states → session display only; no mutation of report_object

5. WORKSPACE INTEGRATION (Phase 3+):
   report_object stored in WorkspaceArtifactStore (indexed by report_id) →
   WorkspaceShell retrieves and composes modules →
   ExplainabilitySidebar renders from explainability_bundle
```

---

## 5. Immutable Identity Fields

These fields are set at generation time and **must never be modified** at the LENS rendering layer or any downstream processing layer:

| Field | Type | Description |
|-------|------|-------------|
| `report_id` | string | Unique report identifier. Stable across all sessions and phases. |
| `baseline_ref` | string | Active governance baseline (e.g. "governed-dpsig-baseline-v1"). |
| `stream_ref` | string | Originating pipeline stream identifier. |
| `generated_at` | ISO8601 datetime | Report generation timestamp. |

---

## 6. Integrity Seal Fields

These fields anchor evidence provenance. They are never displayed in the executive surface.

| Field | Type | LENS Visibility | Purpose |
|-------|------|-----------------|---------|
| `evidence_object_hash` | string | Verification only; never displayed | Seals evidence envelope; verified by BridgeValidator |
| `derivation_hash` | string | Audit/LINEAGE panel only | TAXONOMY-01 derivation record anchor |

If `evidence_object_hash` is absent or fails verification → module renders in BLOCKED state. No silent fallback.

---

## 7. Governance Outcome Fields

These fields carry the GEIOS governance verdict and drive rendering decisions:

| Field | Type | Enum Values | LENS Rendering |
|-------|------|------------|---------------|
| `governance_verdict` | enum | PASS, FAIL | FAIL → BLOCKED module |
| `readiness_state` | enum | 5 states (see §7.1) | Drives readiness badge; drives surface_mode |
| `qualifier_class` | enum | Q-00..Q-04 | Drives qualifier chip; must never be suppressed |

### 7.1 ReadinessState Enum

| Value | Executive Label (ALI-03) | Surface Mode | Qualifier Chip |
|-------|--------------------------|--------------|----------------|
| `EXECUTIVE_READY` | "Executive Ready" | EXECUTIVE_READY | None (Q-00) |
| `EXECUTIVE_READY_WITH_QUALIFIER` | "Executive Ready — Qualified" | EXECUTIVE_READY_WITH_QUALIFIER | Q-01 or Q-02 chip |
| `DIAGNOSTIC_ONLY` | "Under Structural Review" | DIAGNOSTIC_ONLY | Q-03 chip |
| `SUPPRESSED_FROM_EXECUTIVE` | "Not Available" | BLOCKED | Q-04 — explicit absence notice |
| `BLOCKED_PENDING_DOMAIN_GROUNDING` | "Pending Grounding" | BLOCKED | Grounding scope notice |

### 7.2 QualifierClass Enum

| Value | Label | Rendering |
|-------|-------|-----------|
| `Q-00` | Fully Grounded | No chip; clean surface |
| `Q-01` | Partial Grounding | Amber chip on badge and signal cards |
| `Q-02` | Structural View | Blue scope chip |
| `Q-03` | Under Review | Grey indicator; report marked diagnostic |
| `Q-04` | Suppressed | Explicit absence notice; section not rendered |

---

## 8. Topology Scope Fields

Read-only scope metadata. Never used to compute or derive signals.

```
topology_scope {
  domain_count:           integer   // Total domains in topology
  cluster_count:          integer   // Total clusters in topology
  grounded_domain_count:  integer   // Domains with semantic grounding
  grounding_label:        string    // Human-readable scope note; ALI-applied
}
```

---

## 9. Header Block Schema

```
header_block {
  readiness_badge:    ReadinessBadgeObject
  scope_indicator:    ScopeIndicatorObject
  report_metadata: {
    report_id:      string    // Read from root; not duplicated with separate value
    generated_at:   ISO8601
    baseline_ref:   string
  }
}

ReadinessBadgeObject {
  state_label:       string   // ALI-03 applied; no raw readiness_state key
  qualifier_label:   string   // Q-xx taxonomy label; empty string for Q-00
  color_token:       string   // Design system token ref (e.g. "--intelligence-authority")
  tooltip_text:      string   // Qualifier explanation; empty string for Q-00
}

ScopeIndicatorObject {
  domain_label:     string    // e.g. "12 Domains Analyzed"
  grounding_label:  string    // e.g. "Full Coverage" / "Partial Coverage (5 of 12)"
  cluster_label:    string    // e.g. "47 Clusters"
}
```

---

## 10. Narrative Block Schema

All text in this block has ALI-01..07 normalization applied at GEIOS generation time. LENS renders as-is without re-normalization.

```
narrative_block {
  executive_summary:  string   // Normalized; inverted pyramid; conclusion first
  why_section:        string   // Primary causal chain; evidence-sourced; normalized
  structural_summary: string   // Key findings ranked by pressure; normalized
}
```

**Rendering rules:**
- No raw technical labels, cluster keys, or TAXONOMY-01 field names may appear
- If normalization was not applied at generation (system failure), `governance_verdict` must be FAIL
- LENS cannot re-generate or supplement narrative text

---

## 11. Evidence Blocks Schema

One `EvidenceBlock` per analyzed domain. Array must have at least one entry.

```
evidence_blocks: EvidenceBlock[]

EvidenceBlock {
  domain_alias:         string          // ALI-04 applied; no raw domain ID
  grounding_status:     QualifierClass  // Q-xx for this specific domain
  grounding_label:      string          // Scope note; e.g. "Full Grounding"
  signal_cards:         SignalCard[]
  evidence_description: string          // Normalized domain evidence; normalized
  propagation_role:     PropagationRole // ORIGIN | RECEIVER | PASS_THROUGH | ISOLATED
}

SignalCard {
  signal_label:    string          // ALI-01 (CPI) or ALI-02 (CFA); no raw key
  pressure_label:  string          // Human-readable; e.g. "Elevated"
  pressure_tier:   PressureTier    // HIGH | ELEVATED | MODERATE | LOW
  qualifier_label: string          // Q-xx label; empty string for Q-00
  evidence_text:   string          // Normalized evidence description
}
```

**Rendering rules:**
- `domain_alias` must never be a raw domain ID or technical key
- `signal_label` must never be "cpi_score", "cfa_score", or any raw TAXONOMY-01 key
- `qualifier_label` must never be suppressed if grounding_status is Q-01..Q-04
- `propagation_role` drives the "Propagation Role" label in the evidence drawer

---

## 12. Trace Block Schema

Audience: ADVISORY by default. EXECUTIVE view collapses trace block.

```
trace_block {
  propagation_path:       string[]  // Domain/cluster aliases; directional order
  propagation_summary:    string    // Normalized propagation narrative
  derivation_lineage_ref: string    // Stream reference for audit
  baseline_ref:           string    // Baseline anchor
}
```

**Rendering rules:**
- No raw cluster keys or topology IDs in `propagation_path`
- No TAXONOMY-01 field values in any trace field
- `derivation_lineage_ref` is shown as a reference label only (not decoded)
- Trace block is collapsed by default in executive surface; expanded for advisory/audit

---

## 13. Explainability Bundle Schema

The explainability bundle contains exactly **seven panels**, all pre-rendered at GEIOS generation time. LENS renders these panels — it does not generate them.

```
explainability_bundle {
  why_panel:              ExplainabilityPanel  // panel_id: WHY
  evidence_panel:         ExplainabilityPanel  // panel_id: EVIDENCE
  trace_panel:            ExplainabilityPanel  // panel_id: TRACE
  qualifiers_panel:       ExplainabilityPanel  // panel_id: QUALIFIERS
  lineage_panel:          ExplainabilityPanel  // panel_id: LINEAGE
  confidence_panel:       ExplainabilityPanel  // panel_id: CONFIDENCE
  readiness_state_panel:  ExplainabilityPanel  // panel_id: READINESS_STATE
}
```

### 13.1 Explainability Panel Schema

```
ExplainabilityPanel {
  panel_id:           PanelId         // WHY|EVIDENCE|TRACE|QUALIFIERS|LINEAGE|CONFIDENCE|READINESS_STATE
  panel_title:        string          // Human-readable panel name
  content_blocks:     ContentBlock[]
  audience:           Audience        // EXECUTIVE | ADVISORY | AUDIT
  available_in_phase: integer         // 2 = pre-rendered static; 3 = interactive drawer
}

PanelId enum: WHY, EVIDENCE, TRACE, QUALIFIERS, LINEAGE, CONFIDENCE, READINESS_STATE
```

### 13.2 Content Block Schema

```
ContentBlock {
  block_type:    ContentBlockType  // NARRATIVE|LIST|SIGNAL_CARD|QUALIFIER_CHIP|REFERENCE|PROPAGATION
  content:       string | object   // Type-specific content
  qualifier_ref: QualifierClass | null
}

ContentBlockType enum: NARRATIVE, LIST, SIGNAL_CARD, QUALIFIER_CHIP, REFERENCE, PROPAGATION
```

### 13.3 Default Panel Audience Assignments

| Panel | Default Audience | Phase 2 State |
|-------|-----------------|---------------|
| WHY | EXECUTIVE | Static; pre-rendered |
| EVIDENCE | EXECUTIVE | Static; pre-rendered |
| TRACE | ADVISORY | Collapsed by default in executive view |
| QUALIFIERS | EXECUTIVE | Static; shown if Q-01..Q-04 active |
| LINEAGE | ADVISORY | Available on request |
| CONFIDENCE | EXECUTIVE | Static; shown for scope communication |
| READINESS_STATE | EXECUTIVE | Static; full classification detail |

---

## 14. Interaction Registry Schema

Interaction injection points are registered at generation time. In Phase 2, only `EXPAND_COLLAPSE` interactions may be active.

```
interaction_registry {
  interactions: InteractionEntry[]
}

InteractionEntry {
  interaction_id:   string           // Unique stable identifier
  interaction_type: InteractionType  // EXPAND_COLLAPSE|EVIDENCE_DRAWER|INVESTIGATION_ENTRY|COPILOT_ENTRY
  target_module_id: string           // Module this interaction applies to
  phase_required:   integer          // Phase gate required to activate (≥2)
  active:           boolean          // Phase 2: only EXPAND_COLLAPSE may be true
  governance_gate:  string           // Gate identifier from maturity model
}

InteractionType enum: EXPAND_COLLAPSE, EVIDENCE_DRAWER, INVESTIGATION_ENTRY, COPILOT_ENTRY
```

**Phase 2 activation constraint:**
- `EXPAND_COLLAPSE`: may be `active: true` in Phase 2
- `EVIDENCE_DRAWER`: `active: false` until Phase 3 GATE-2 PASS
- `INVESTIGATION_ENTRY`: `active: false` until Phase 4 GATE-3 PASS
- `COPILOT_ENTRY`: `active: false` until Phase 5 GATE-4 PASS

A validator must reject any report object where non-EXPAND_COLLAPSE interactions have `active: true` in Phase 2 deployment.

---

## 15. Module Registry Schema

Every intelligence module is registered with a deterministic, stable identifier at generation time.

```
module_registry {
  entries: ModuleRegistryEntry[]
}

ModuleRegistryEntry {
  module_id:     string      // Stable deterministic identifier
  module_type:   ModuleType  // See enum below
  report_id:     string      // Parent report reference
  evidence_ref:  string      // evidence_object_hash reference
  active:        boolean     // Phase 2: EXECUTIVE_SUMMARY, DOMAIN_EVIDENCE, PROPAGATION, EXPLAINABILITY active
  phase_gate:    integer     // Phase required to activate (2..6)
  registered_at: ISO8601
}

ModuleType enum:
  EXECUTIVE_SUMMARY_MODULE    // Phase 2 — active
  DOMAIN_EVIDENCE_MODULE      // Phase 2 — active (one per domain)
  PROPAGATION_MODULE          // Phase 2 — active
  EXPLAINABILITY_MODULE       // Phase 2 — active (pre-rendered static)
  TOPOLOGY_MODULE             // Phase 3 — inactive placeholder in Phase 2
  INVESTIGATION_MODULE        // Phase 4 — inactive placeholder in Phase 2
  CONTINUITY_MODULE           // Phase 5 — inactive placeholder in Phase 2
  OPERATIONAL_MODULE          // Phase 6 — inactive placeholder in Phase 2
```

**Phase 2 active modules:** `EXECUTIVE_SUMMARY_MODULE`, `DOMAIN_EVIDENCE_MODULE`, `PROPAGATION_MODULE`, `EXPLAINABILITY_MODULE`

**Phase 2 inactive placeholders (registered but not rendered):** `TOPOLOGY_MODULE`, `INVESTIGATION_MODULE`, `CONTINUITY_MODULE`, `OPERATIONAL_MODULE`

---

## 16. Rendering Metadata Schema

Rendering metadata records what normalization, qualification, and rendering decisions were applied.

```
rendering_metadata {
  normalization_version:          string    // Cognitive normalization version applied
  ali_rules_applied:              string[]  // e.g. ["ALI-01", "ALI-02", "ALI-04"]
  qualifier_rules_applied:        string[]  // e.g. ["Q-01"]
  surface_mode:                   SurfaceMode
  explainability_panels_rendered: string[]  // Panel IDs rendered
  topology_scope_verified:        boolean
  evidence_hash_verified:         boolean
  rendered_at:                    ISO8601
  lens_version:                   string
}

SurfaceMode enum:
  EXECUTIVE_READY
  EXECUTIVE_READY_WITH_QUALIFIER
  DIAGNOSTIC_ONLY
  STRUCTURAL_ONLY
  BLOCKED
```

---

## 17. Trace Linkage Schema

Trace linkage connects rendered intelligence to its governance provenance for replay and audit.

```
trace_linkage {
  evidence_object_hash: string   // AUDIT ONLY — sealed evidence envelope reference
  derivation_hash:      string   // AUDIT ONLY — TAXONOMY-01 derivation record reference
  baseline_anchor:      string   // e.g. "governed-dpsig-baseline-v1"
  stream_anchor:        string   // Originating stream
  run_id:               string   // Pipeline run identifier
}
```

**Visibility:** `trace_linkage` is not rendered in the primary executive surface. It is available in the LINEAGE explainability panel and in audit-tier exports.

---

## 18. Validation Behavior

### 18.1 BridgeValidator Pre-Render Checks

Before any module rendering begins, the BridgeValidator performs:

1. `evidence_object_hash` present and non-empty → FAIL → BLOCKED
2. `governance_verdict` = "PASS" → FAIL → BLOCKED
3. `qualifier_class` present and valid enum → FAIL → BLOCKED
4. `readiness_state` present and valid enum → FAIL → BLOCKED
5. `explainability_bundle` contains exactly 7 panels → FAIL → BLOCKED
6. `module_registry` present → FAIL → BLOCKED
7. `interaction_registry` present → FAIL → BLOCKED
8. `rendering_metadata` present → FAIL → DIAGNOSTIC notice
9. `normalization_version` present in rendering_metadata → FAIL → DIAGNOSTIC notice

### 18.2 Blocked State Behavior

When `governance_verdict = "FAIL"` or a BridgeValidator hard check fails:

- Module renders as **BLOCKED** state — explicitly visible
- BLOCKED state displays:
  - `report_id` for reference
  - Blocking reason (from validation failure type)
  - Instruction to contact advisory for report status
- BLOCKED is never silent — an empty panel, an empty section, or a missing module is a governance violation
- No intelligence content is rendered in BLOCKED state

### 18.3 Diagnostic State Behavior

When normalization was not applied (`normalization_version` absent or `ali_rules_applied` empty):

- Module renders with **DIAGNOSTIC notice banner** on narrative block
- Notice text: "Narrative rendering under review — advisory confirmation required"
- Evidence panels and readiness badge continue to render (evidence is not affected by normalization failure)
- DIAGNOSTIC is never silent

### 18.4 Q-04 Suppression Behavior

When `qualifier_class = "Q-04"` (SUPPRESSED_FROM_EXECUTIVE):

- The module renders a suppression notice: "Signal intelligence withheld from this view"
- The suppression notice is rendered explicitly — not a blank section
- `readiness_state = SUPPRESSED_FROM_EXECUTIVE` triggers surface_mode = BLOCKED
- No signal card content is rendered for Q-04 signals

---

## 19. Future Workspace Compatibility

Report objects generated in Phase 2 are workspace-compatible from generation. The following design decisions ensure forward compatibility:

| Design Decision | Workspace Benefit |
|----------------|------------------|
| `report_id` is stable and globally unique | WorkspaceArtifactStore indexes by report_id without collision |
| `module_registry` uses deterministic module_ids | Phase 3 WorkspaceShell navigates modules by ID |
| `interaction_registry` has future interaction entries (inactive) | Phase 3+ activation does not require schema change |
| `TOPOLOGY_MODULE` placeholder registered | Phase 3 topology activation is a flag flip, not a schema change |
| `trace_linkage` provides replay anchors | Phase 5 Type 5 memory continuity uses trace_linkage.run_id |
| `explainability_bundle` is pre-rendered at generation | Phase 3 ExplainabilitySidebar renders from same objects |

---

## 20. Forbidden Transformations

The following transformations are explicitly forbidden at the LENS rendering layer:

| Forbidden Action | Governance Basis |
|------------------|-----------------|
| Re-derive signals from topology data | DPSIG Lane A FROZEN; no computation at LENS |
| Override `readiness_state` or `qualifier_class` | Governance outcome is GEIOS authority only |
| Upgrade qualifier (render Q-01 as Q-00) | QP-02: qualifier may never be upgraded |
| Suppress qualifier chip (hide Q-01..Q-04) | QP-03: qualifier may never be suppressed |
| Modify evidence content objects | Evidence is sealed by evidence_object_hash |
| Supplement narrative with live LLM generation | EF-05: pre-rendered content is authoritative |
| Modify trace_linkage fields | AUDIT fields are immutable at LENS |
| Write to canonical_topology.json | TP-BRIDGE-01: LENS never writes topology |
| Introduce new qualifier classes not in Q-00..Q-04 | SA-BRIDGE-02: semantic authority CLOSED |
| Introduce new ALI rules not in ALI-01..07 | SA-BRIDGE-03: ALI taxonomy CLOSED |
| Render BLOCKED state silently | ET-03: invalid states must be explicit |
| Activate Phase 3+ interactions in Phase 2 | Phase gate enforcement |

---

## 21. Governance Preservation Rules

| Rule | Obligation |
|------|-----------|
| ROM-GOV-01 | report_object is read-only at LENS rendering layer |
| ROM-GOV-02 | evidence_object_hash verified before any evidence panel renders |
| ROM-GOV-03 | governance_verdict = FAIL produces BLOCKED module — never silent |
| ROM-GOV-04 | qualifier_class present and non-null at all rendering stages |
| ROM-GOV-05 | ALI rules applied at generation time — LENS does not re-apply |
| ROM-GOV-06 | Normalization version tracked in rendering_metadata |
| ROM-GOV-07 | Phase 2 interactions limited to EXPAND_COLLAPSE only |
| ROM-GOV-08 | Inactive module placeholders registered but not rendered |
| ROM-GOV-09 | Rendering is deterministic: same report_object → same rendered output |
| ROM-GOV-10 | No GEIOS internal identifiers (rule IDs, stream IDs, agent names) in executive surface |

---

*Stream PI.LENS.NEXTGEN-REPORTS.REPORT-OBJECT-MODEL.01 — Schema Reference — COMPLETE*  
*Baseline: governed-dpsig-baseline-v1 (092e251)*  
*Issued: 2026-05-08*
