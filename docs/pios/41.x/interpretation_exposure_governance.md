# Interpretation Exposure — Governance Document
## PI.41X.INTERPRETATION-EXPOSURE.01

**Layer:** 41.x — Semantic Authority  
**Contract:** PI.41X.INTERPRETATION-EXPOSURE.01  
**Date:** 2026-04-25  
**Branch:** work/psee-runtime  
**Status:** ACTIVE

---

## 1. Purpose of the Exposure Layer

The Interpretation Exposure layer packages governed interpretation bindings (BIND-NNN entries from `interpretation_binding.json`) into render-ready items for downstream consumption by workspace panels, LENS report generation, and future UI surfaces.

Its purpose is to answer the question: *what may each surface display, from which binding, and under what constraints?*

The exposure layer does not create interpretation. It does not alter, enrich, summarize, or rewrite any content from the registry or binding layer. It specifies the surface permission boundary — what each target surface is authorized to display.

No surface may claim it received interpretation unless it can reference a specific EXP-NNN item. Exposure items are the governance chain terminus for human-facing structural meaning.

---

## 2. Difference Between Binding and Exposure

| Layer | Contract | Purpose | Output |
|---|---|---|---|
| Interpretation Registry | PI.41X.INTERPRETATION-REGISTRY.01 | Define governed behavioral meaning per structural construct | INT-XXX entries with three-layer output |
| Interpretation Binding | PI.41X.INTERPRETATION-BINDING.01 | Attach registry entries to specific constructs in a 41.x projection run | BIND-NNN entries with verbatim attached_interpretation |
| **Interpretation Exposure** | **PI.41X.INTERPRETATION-EXPOSURE.01** | **Package bindings into render-ready form with per-surface permission rules** | **EXP-NNN entries with render_payload and render_targets** |

**The binding answers:** which INT-XXX entry applies to this zone/signal/condition?

**The exposure answers:** which surface may render which field from that binding?

The exposure layer does not introduce any content that is not already present in the binding. `render_payload` is copied verbatim from `attached_interpretation`. The only additions are `render_targets` (surface permission declarations) and `trace` (traceability chain).

---

## 3. Render-Only Rule

The exposure layer operates under an unconditional `exposure_mode: render_only` constraint.

This means:

- No new text may be written into `render_payload` fields at exposure time
- No content may be combined, synthesized, or aggregated across exposure items
- No conditional logic may alter which fields are displayed based on signal values or attribution profiles
- No inference about the structural condition of the run may be derived from the exposure layer

Downstream surfaces receiving exposure items must treat `render_payload` fields as static, governed strings — not as inputs to further reasoning.

---

## 4. Surface-Specific Display Permissions

Each exposure item declares a `render_targets` block specifying what each surface may display. Permissions are defined as follows:

### workspace_why

May display:
- `render_payload.behavioral_meaning` — structural meaning in technical register
- `source_ref` — to identify which construct the interpretation attaches to
- `interpretation_ref` — to identify the INT-XXX registry source

Must not: add severity, priority, recommendation, or causal language to the displayed content.

### workspace_evidence

May display:
- `trace.registry_path` — path to the registry source
- `trace.binding_path` — path to the binding source
- `trace.evidence_status` — confirms `registry_bound`

Must not: claim new evidence, modify the trace chain, or add fields not present in the trace block.

### workspace_trace

May display:
- `trace.registry_entry_id` — the INT-XXX identifier
- `trace.binding_id` — the BIND-NNN identifier
- `source_ref` — the structural construct being traced

Must not: modify, extend, or reorder the existing trace chains in 41.x projection artifacts.

### lens_report

May display:
- `render_payload.business_expression` — plain language structural observation for non-technical stakeholders

Must not: add recommendation, severity, prioritization, or causal claim language. `business_expression` is a structural observation — it must not be presented as a verdict, finding, or advisory.

### future_ui

May display:
- All three `render_payload` fields: `behavioral_meaning`, `system_expression`, `business_expression`
- `trace.registry_entry_id`, `trace.binding_id`, `source_ref`, `trace.evidence_status`

Must not: modify content at render time or present any field as a computed or inferred result.

---

## 5. Prohibited Transformations

The following transformations are unconditionally prohibited when consuming exposure items:

| Prohibited action | Example |
|---|---|
| Combining render_payload fields into a synthesized claim | Merging behavioral_meaning + business_expression into a summary paragraph |
| Summarizing or paraphrasing render_payload content | Replacing verbatim text with an abbreviated version |
| Adding severity, risk, priority, or urgency labels | Prefixing business_expression with "HIGH RISK:" |
| Adding recommendation or action directive language | Appending "This area should be addressed" to any field |
| Adding predictive statements | Inserting "This may cause failures" before behavioral_meaning |
| Adding client-specific wording | Inserting domain names or node IDs not present in source_ref |
| Reordering or filtering exposure items to imply importance | Displaying only PZ-002 items while suppressing PZ-001 and PZ-003 |
| Treating business_expression as a verdict | Presenting business_expression as a diagnosis, finding, or risk assessment |

These prohibitions apply at every integration point: workspace rendering, report template generation, PDF export, and any future UI surface.

---

## 6. Evidence First Compliance Statement

The exposure layer satisfies the Evidence First doctrine as follows:

- **Source traceability:** Every `render_payload` field is traceable through `trace.binding_id → BIND-NNN → INT-XXX → source_authority` in the registry governance document.
- **No introduced facts:** `render_payload` contains no content that was not present in `interpretation_binding.json → attached_interpretation → interpretation_registry.json → output`.
- **Determinism:** The same EXP-NNN item produces the same render_payload for the same input binding, regardless of which surface consumes it or how many times it is read.
- **Governed source chain:** Registry → Binding → Exposure is a fully governed chain. No link in the chain introduces external knowledge, LLM inference, or unstated assumptions.
- **inference_prohibition active:** The `inference_prohibition: ACTIVE` field in the exposure package header confirms that no inference occurred at exposure time.

---

## 7. Future Integration Rules

### Adding new exposure items

New exposure items must correspond 1:1 to new BIND-NNN entries. EXP-NNN and BIND-NNN identifiers must remain in correspondence. A new exposure item may only be created after its governing binding exists.

Steps:
1. Confirm the new BIND-NNN entry exists in `interpretation_binding.json`
2. Assign the next EXP-NNN ID
3. Copy `render_payload` verbatim from `binding.attached_interpretation`
4. Propagate `source_ref`, `interpretation_ref`, `source_type` from the binding
5. Set `render_targets` per the surface permission rules in Section 4
6. Set all six `constraints` fields to false
7. Increment `total_exposure_items`

### Updating exposure items

Exposure items may be updated only if the underlying binding is updated. When a binding is updated (e.g., because the referenced INT-XXX entry was superseded), the corresponding exposure item's `render_payload` must be re-copied verbatim from the updated binding.

### Wiring to workspace surfaces

When `tier2_query_engine.py` or `workspace.js` is updated to consume exposure items, the integration contract must:
- Reference specific EXP-NNN IDs as the source of rendered content
- Not modify `render_payload` content at query time
- Respect `render_targets` permission boundaries per surface
- Record the integration in a governance trace

### Wiring to report generation

When `lens_report_generator.py` is updated to consume exposure items, the integration contract must:
- Use only `render_payload.business_expression` for non-technical narrative
- Not combine multiple `business_expression` values into a synthesized paragraph
- Reference the EXP-NNN ID in the report's evidence trace
- Record the integration in a governance trace

### Composite exposure

Composite exposure items (corresponding to composite binding entries) may only be created after INT-020 has been populated with aggregation logic (requires a future contract). The INT-020 placeholder does not authorize composite rendering.
