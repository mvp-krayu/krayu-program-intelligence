# SEMANTIC ACTOR REGISTRY

**Stream:** PI.LENS.V2.SEMANTIC-REPRESENTATION-SYSTEM.01
**Authority:** Canonical specification of the 15 semantic actors that compose LENS V2 representation modes.

---

## Registry

For each actor: id (stable letter), code (2-letter), name, data source, persona visibility, rendering rule, forbidden behaviors.

### A · DP · Decision Posture

- **Data source:** `header_block.readiness_badge.state_label` + `header_block.readiness_badge.qualifier_label` + `qualifier_class`.
- **Persona visibility:** BALANCED (primary) · BOARDROOM (primary) · INVESTIGATION (secondary).
- **Rendering rule:** Display the readiness state phrase in display weight; surface the qualifier-class as a chip when active; carry the advisory tone in the surrounding label register.
- **Forbidden:** Showing readiness state phrase that contradicts `render_state`; hiding qualifier when active.

### B · CB · Confidence Boundary

- **Data source:** `topology_scope.grounded_domain_count` / `topology_scope.domain_count` ratio.
- **Persona visibility:** BALANCED (primary) · INVESTIGATION (primary) · BOARDROOM (compact).
- **Rendering rule:** Show grounded ratio as visual proportion (bar / arc) with explicit advisory tail.
- **Forbidden:** Implying full coverage when partial; hiding the advisory portion.

### C · PA · Pressure Anchor

- **Data source:** `evidence_blocks` filtered by `propagation_role === 'ORIGIN'`, with `signal_cards[0].pressure_tier`.
- **Persona visibility:** BALANCED (summary) · DENSE (anchor cue) · INVESTIGATION (secondary).
- **Rendering rule:** Surface as a single named operational object with tier color; never as a triad list.
- **Forbidden:** Repeating origin / pass-through / receiver cards under a Pressure Anchor heading.

### D · PP · Propagation Path

- **Data source:** `trace_block.propagation_path`.
- **Persona visibility:** Surfaces as a thin selected-path strip below the IntelligenceField; not a primary canvas actor.
- **Rendering rule:** Render the path verbatim as text, not as weighted nodes.
- **Forbidden:** Redrawing the path as a graph or weighted node row.

### E · AL · Absorption Load

- **Data source:** `evidence_blocks` filtered by `propagation_role === 'PASS_THROUGH'` plus narrative-derived absorption percentage.
- **Persona visibility:** DENSE (primary).
- **Rendering rule:** Render as a dedicated absorption panel — domain name, absorption percentage, operational note.
- **Forbidden:** Conflating Absorption Load with Pressure Anchor or Propagation Path.

### F · RE · Receiver Exposure

- **Data source:** `evidence_blocks` filtered by `propagation_role === 'RECEIVER'` with `grounding_status`.
- **Persona visibility:** Currently surfaced inside Resolution Boundary and Semantic Topology actors; reserved for future dedicated rendering.
- **Rendering rule:** When dedicated, show the receiver domain with explicit advisory-bound markers.
- **Forbidden:** Implying receiver state is fully grounded when grounding_status is partial.

### G · ST · Semantic Topology

- **Data source:** `evidence_blocks[].domain_alias` + `propagation_role`.
- **Persona visibility:** DENSE (primary) · INVESTIGATION (secondary).
- **Rendering rule:** Render as a 3-cell domain matrix with role labels (ORIGIN / PASS-THROUGH / RECEIVER).
- **Forbidden:** Force-directed graph; many-node visualization; tile-grid mimicry.

### H · SB · Structural Backing

- **Data source:** `grounding_status === 'Q-00'` per block.
- **Persona visibility:** DENSE (primary).
- **Rendering rule:** Annotate each topology cell with "structurally backed" + grounding-status code; differentiate visually from semantic-only cells.
- **Forbidden:** Implying structural backing exists where `grounding_status !== 'Q-00'`.

### I · SO · Semantic-Only Exposure

- **Data source:** `grounding_status !== 'Q-00'` per block.
- **Persona visibility:** DENSE (primary).
- **Rendering rule:** Mark the cell explicitly with "semantic-only · advisory"; visual gradient in warm tint.
- **Forbidden:** Hiding semantic-only state or merging it with structurally-backed display.

### J · CC · Cluster Concentration

- **Data source:** `topology_scope.cluster_count` + `grounded_domain_count` ratio + narrative cluster references.
- **Persona visibility:** DENSE (primary).
- **Rendering rule:** Large headline value (32px) + grounded ratio bar + operational meta line.
- **Forbidden:** Re-rendering raw cluster tables; per-cluster cards.

### K · SS · Signal Stack

- **Data source:** Flattened `evidence_blocks[].signal_cards[]` (every signal individually).
- **Persona visibility:** INVESTIGATION (primary) · DENSE (secondary).
- **Rendering rule:** Render each signal as its own row with tier mark, signal name, domain context, pressure label, evidence text, confidence row. The signal stack is signal-level, not domain-level.
- **Forbidden:** Aggregating signals into domain summary cards under a Signal Stack heading.

### L · ET · Evidence Trace

- **Data source:** `trace_linkage` (evidence_object_hash, derivation_hash, baseline_anchor, run_id) + `trace_block.derivation_lineage_ref`.
- **Persona visibility:** INVESTIGATION (primary).
- **Rendering rule:** Render as a vertical lineage chain: each step is a label + monospace hash value.
- **Forbidden:** Dumping raw JSON; rendering as a table.

### M · RB · Resolution Boundary

- **Data source:** `topology_scope.grounding_label` + `topology_scope.grounded_domain_count` + `qualifier_class` + execution-not-yet-validated state implied by qualifier.
- **Persona visibility:** BALANCED (primary) · INVESTIGATION (primary) · BOARDROOM (summary).
- **Rendering rule:** Render as a 3-cell grid: Known / Partial / Execution-not-yet-validated.
- **Forbidden:** Hiding execution-not-yet-validated state.

### N · IP · Inference Prohibition

- **Data source:** `rendering_metadata.qualifier_rules_applied` + `rendering_metadata.ali_rules_applied` + qualifier label text.
- **Persona visibility:** INVESTIGATION (primary) · BOARDROOM (compact).
- **Rendering rule:** Render an explicit "MUST NOT" statement + applied rule chips in monospace.
- **Forbidden:** Rendering this actor as advisory-soft language; the contract must read as binding.

### O · RA · Report Artifact Access

- **Data source:** `REPORT_PACK_ARTIFACTS` registry in source.
- **Persona visibility:** All lenses (constant, surfaced in the SupportRail).
- **Rendering rule:** Calm artifact list with tier label + name + binding-state caption.
- **Forbidden:** Letting Report Pack dominate the surface; inlining static HTML.

---

## Mode → Actor map

```
EXECUTIVE_BALANCED  → [DP, CB, RB, PA, RA]
EXECUTIVE_DENSE     → [ST, SB, SO, CC, AL, PA]
INVESTIGATION_DENSE → [ET, SS, IP, CB, RB]
BOARDROOM           → [DP, CB, PA, RA]
```

The Receiver Exposure (F) and Propagation Path (D) actors are documented but do not have dedicated rendering surfaces in this iteration; they are surfaced through other actors (RE through Semantic Topology / Resolution Boundary; PP through the topology strip).

---

## Visual grammar

All actors share a consistent panel shell:

```
┌────────────────────────────────────────────────┐
│ [CODE]  Actor name                             │  ← actor-tag
├────────────────────────────────────────────────┤
│                                                │
│  (actor-specific content composition)          │
│                                                │
└────────────────────────────────────────────────┘
```

- Panel: `rgba(20, 23, 31, 0.55)` background, 1px `#1a2030` border, 6px radius, 22/24 padding.
- `actor-tag`: `actor-code` chip (steel-blue, monospace-feel) + `actor-name` (uppercase tracked).
- Border-bottom under the tag: 1px `#1a2030`.

This grammar is consistent across all actors so that switching modes feels like a coherent system, not a stack of unrelated panels.

---

## Authority

Future contracts that touch any actor MUST consult this registry first. Adding a new actor requires:

1. Choosing the next available id (P).
2. Documenting the actor's data source, persona visibility, rendering rule, and forbidden behaviors here.
3. Adding it to `SEMANTIC_ACTORS` and `LENS_MODE_SEMANTICS` in the source.
4. Implementing the rendering panel.
5. Updating the mode → actor map above.

---

**End of semantic actor registry.**
