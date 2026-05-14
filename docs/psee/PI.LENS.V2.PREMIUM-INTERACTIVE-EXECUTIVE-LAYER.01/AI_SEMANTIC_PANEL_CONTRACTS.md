# AI SEMANTIC PANEL CONTRACTS

**Stream:** PI.LENS.V2.PREMIUM-INTERACTIVE-EXECUTIVE-LAYER.01
**Scope:** Per-zone contract for the AI-enriched representation panel that surfaces the zone in LENS V2.

---

## 0. Why these contracts exist

Each semantic zone (Z1 – Z8) needs to be rendered consistently across persona lenses. Without a per-zone contract, ad-hoc visualizations will accumulate; with these contracts, future visual iterations have a stable target.

Each contract specifies:

- `zone_id` — stable id from `SEMANTIC_ZONE_INVENTORY.md`
- `zone_name` — human-readable name
- `source artifact family` — which static reports cover the same evidence ground
- `required structured inputs` — exact data shape needed from the runtime payload
- `AI rendering responsibility` — what the AI-enriched layer is responsible for producing
- `evidence grounding rule` — how the panel maintains evidence-first discipline
- `persona visibility` — which lenses surface the zone
- `forbidden static-copy behavior` — explicit forbidden patterns
- `visual representation form` — the expected visual form factor
- `confidence/qualifier display rule` — how confidence and qualifiers are surfaced

---

## 1. Z1 — Executive Posture Panel

```
zone_id: Z1
zone_name: Executive Posture
source_artifact_family:
  - Decision Surface
  - Tier-1 Narrative Brief

required_structured_inputs:
  - render_state: enum (EXECUTIVE_READY | EXECUTIVE_READY_WITH_QUALIFIER | DIAGNOSTIC_ONLY | BLOCKED)
  - readiness_badge.state_label: string
  - qualifier_chip.qualifier_class: string?
  - executive_summary: string (executive narrative paragraph)

AI_rendering_responsibility:
  - produce a one-sentence calm consequence statement
  - distinguish ready / qualified / diagnostic / blocked at typographic register
  - never invent severity beyond evidence

evidence_grounding_rule:
  - state_label and qualifier_class drive the visible language
  - never claim ready when render_state is qualified / diagnostic / blocked

persona_visibility:
  primary: BALANCED, BOARDROOM
  secondary: INVESTIGATION

forbidden_static_copy_behavior:
  - copying Decision Surface HTML
  - quoting executive_summary verbatim as panel body without recomposition

visual_representation_form:
  - declaration zone (large state phrase)
  - BALANCED: calm consequence statement + 3 anchor consequence path
  - BOARDROOM: atmospheric mark + supportive sentence

confidence_qualifier_display_rule:
  - if qualifier_chip.renders is true, qualifier mandate band must appear above panel
  - readiness state-color encodes posture in the declaration and anchor accents
```

---

## 2. Z2 — Resolution Boundary Panel

```
zone_id: Z2
zone_name: Resolution Boundary
source_artifact_family:
  - Tier-1 Narrative Brief
  - Decision Surface
  - Tier-2 Diagnostic Narrative

required_structured_inputs:
  - qualifier_class: string
  - grounding_label: string ("Full Coverage" | "Partial Coverage" | ...)
  - grounded_domain_count: integer
  - domain_count: integer

AI_rendering_responsibility:
  - state known / unknown boundary in operational language
  - admit uncertainty visibly (advisory bound markers)
  - render compact grounding summary in the rep field

evidence_grounding_rule:
  - never hide grounding gaps
  - never imply full coverage when partial

persona_visibility:
  primary: BALANCED, INVESTIGATION
  secondary: BOARDROOM (compact summary)

forbidden_static_copy_behavior:
  - copying "Limitations" sections from reports verbatim
  - moving qualifier source-text into panels without recomposition

visual_representation_form:
  - qualifier mandate band (above IntelligenceField)
  - compact evidence-state block (right column footer)
  - INVESTIGATION trace-band confidence rows

confidence_qualifier_display_rule:
  - Q-01 partial-grounding always visible when active
  - "advisory bound" flag on partial-grounding receiver
```

---

## 3. Z3 — Semantic Topology Panel

```
zone_id: Z3
zone_name: Semantic Topology
source_artifact_family:
  - Tier-1 Evidence Brief
  - Tier-2 Diagnostic Narrative

required_structured_inputs:
  - evidence_blocks: [
      {
        domain_alias: string,
        propagation_role: enum (ORIGIN | PASS_THROUGH | RECEIVER),
        signal_cards[0].pressure_tier: enum (HIGH | ELEVATED | MODERATE | LOW),
        grounding_status: enum (Q-00 | Q-01 | ...),
      },
      ...
    ]
  - propagation_path: [domain_alias, domain_alias, domain_alias]

AI_rendering_responsibility:
  - render up to 3 weighted nodes (ORIGIN / PASS-THROUGH / RECEIVER)
  - render gradient edges between adjacent nodes
  - never explode into a multi-node graph explorer

evidence_grounding_rule:
  - role labels are taken verbatim from propagation_role
  - tier glow taken from signal_cards[0].pressure_tier
  - no inferred edges or invented nodes

persona_visibility:
  primary: DENSE, INVESTIGATION
  secondary: (none)

forbidden_static_copy_behavior:
  - reintroducing prior static topology HTML / SVG
  - importing third-party graph libraries
  - rendering more than 5 nodes simultaneously

visual_representation_form:
  - DENSE: three vertical weighted nodes with edges
  - lower Propagation Structure Zone (full-width horizontal pressure chain)

confidence_qualifier_display_rule:
  - Q-01 partial node carries an "advisory bound" caption
```

---

## 4. Z4 — Pressure Anchor Panel

```
zone_id: Z4
zone_name: Pressure Anchor
source_artifact_family:
  - Tier-1 Evidence Brief
  - Tier-2 Diagnostic Narrative

required_structured_inputs:
  - origin_domain.signal_cards[0].pressure_label: string
  - origin_domain.signal_cards[0].pressure_tier: enum
  - propagation_chain: list of domain references with pressure tiers

AI_rendering_responsibility:
  - present the dominant pressure anchor as an operational focal object
  - show pressure flow into and through the coordination layer
  - never render pressure as a card list

evidence_grounding_rule:
  - tier label carried verbatim from upstream evidence
  - never escalate / de-escalate the tier

persona_visibility:
  primary: DENSE, INVESTIGATION
  secondary: BALANCED (consequence summary)

forbidden_static_copy_behavior:
  - tile-grid of pressure cards
  - repeating same pressure card in multiple zones

visual_representation_form:
  - BALANCED: anchor stripe with 3 anchors and a pressure-graded rail
  - DENSE: weighted nodes in topology
  - INVESTIGATION: pressure tier color rail on each trace band

confidence_qualifier_display_rule:
  - tier color is the visual encoding; numeric pressure values are NOT shown
```

---

## 5. Z5 — Signal Stack Panel

```
zone_id: Z5
zone_name: Signal Stack
source_artifact_family:
  - Tier-1 Evidence Brief
  - Tier-2 Diagnostic Narrative

required_structured_inputs:
  - evidence_blocks[].signal_cards[]: [
      {
        signal_label: string,
        pressure_label: string,
        pressure_tier: enum,
        evidence_text: string,
      }
    ]

AI_rendering_responsibility:
  - group signals by their semantic role within the trace narrative
  - never render signals as isolated repeated evidence cards

evidence_grounding_rule:
  - evidence_text taken verbatim from upstream
  - never invent signal labels

persona_visibility:
  primary: INVESTIGATION, DENSE
  secondary: (none)

forbidden_static_copy_behavior:
  - rendering each signal as an identical card with no role context

visual_representation_form:
  - INVESTIGATION: trace bands grouped by role (Observed / Absorption / Receiver)
  - lower Evidence Layer composes 1 dominant + 2 supporting blocks

confidence_qualifier_display_rule:
  - each band carries a confidence row with grounding label
```

---

## 6. Z6 — Cluster Concentration Panel

```
zone_id: Z6
zone_name: Cluster Concentration
source_artifact_family:
  - Tier-1 Evidence Brief
  - Tier-1 Narrative Brief

required_structured_inputs:
  - topology_scope.cluster_count: integer
  - topology_scope.domain_count: integer
  - topology_scope.grounded_domain_count: integer
  - topology_scope.grounding_label: string

AI_rendering_responsibility:
  - render concentration as a thin progress-bar with operational caption
  - never copy cluster tables

evidence_grounding_rule:
  - cluster / domain counts taken verbatim from upstream
  - never compute new aggregations

persona_visibility:
  primary: DENSE, INVESTIGATION
  secondary: (none)

forbidden_static_copy_behavior:
  - tabular cluster lists
  - per-cluster cards

visual_representation_form:
  - thin gradient bar (grounded ratio)
  - operational caption "N clusters monitored · X of Y domains fully grounded"

confidence_qualifier_display_rule:
  - the bar fill width represents the grounded ratio
  - never imply the missing portion is irrelevant
```

---

## 7. Z7 — Evidence Trace Panel

```
zone_id: Z7
zone_name: Evidence Trace
source_artifact_family:
  - Tier-1 Evidence Brief
  - Tier-2 Diagnostic Narrative

required_structured_inputs:
  - evidence_blocks[]: full record (domain_alias, evidence_text, evidence_description, grounding_status, grounding_label, propagation_role, signal_cards)
  - trace_block.propagation_path

AI_rendering_responsibility:
  - render evidence trace bands grouped by propagation role
  - expose grounding state explicitly per band
  - never render raw JSON or full HTML

evidence_grounding_rule:
  - text content taken verbatim from upstream evidence
  - confidence per band must reflect grounding_status accurately

persona_visibility:
  primary: INVESTIGATION
  secondary: (none)

forbidden_static_copy_behavior:
  - dumping JSON
  - rendering raw HTML body
  - long unstructured paragraphs

visual_representation_form:
  - vertical trace stack with three role-grouped bands
  - per-band confidence row with grounding label + advisory bound flag if Q-01

confidence_qualifier_display_rule:
  - each band has confidence row
  - partial-grounding band has warm gradient background
```

---

## 8. Z8 — Report Pack Access Panel

```
zone_id: Z8
zone_name: Report Pack Access
source_artifact_family:
  - all four static reports

required_structured_inputs:
  - artifact_id: stable id (decision-surface | tier1-narrative | tier1-evidence | tier2-diagnostic)
  - artifact_name: human-readable name
  - tier_label: enum (DECISION | TIER-1 | TIER-2)
  - file: canonical filename
  - binding_path: future API path (placeholder until live binding)
  - binding_status: enum (PENDING | AVAILABLE)

AI_rendering_responsibility:
  - render four named artifact entries in a calm row
  - mark each entry's binding state honestly

evidence_grounding_rule:
  - PENDING binding state must be visible on every PENDING entry
  - never imply an artifact is fetchable when it is not bound

persona_visibility:
  primary: all lenses
  secondary: n/a

forbidden_static_copy_behavior:
  - inlining the static report body into LENS V2
  - making the Report Pack the dominant surface element

visual_representation_form:
  - single horizontal band with REPORT PACK label + descriptor + four artifact entries
  - each entry: tier label + name + binding state caption
  - aria-disabled on all PENDING entries

confidence_qualifier_display_rule:
  - artifact availability is a discrete signal (PENDING / AVAILABLE)
  - no implied freshness or generation date until live binding adds those fields
```

---

## 9. Cross-cutting rules

- Every panel must read content from a structured payload — never from HTML / DOM scraping.
- Every panel must honor the executive cognition contract from `EXECUTIVE_COGNITION_MODEL.md` (parent doctrine).
- Every panel that surfaces a tier label must do so in tracked uppercase at small size (8–10px) — not as a chip or badge.
- Every panel must respect anti-dashboard rules from `ANTI_DASHBOARD_ENFORCEMENT.md`.
- Every panel must respect the topology guardrail from `TOPOLOGY_REINTRODUCTION_GUARDRAIL.md`.

---

## 10. Authority

Future visual contracts must consult this document before adding to or modifying any LENS V2 representation panel. Changes to a panel contract require the contract to explicitly cite the zone id and the changed clauses.

---

**End of AI semantic panel contracts.**
