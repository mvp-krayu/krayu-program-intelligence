# SOFTWARE INTELLIGENCE DOMAIN REASONING CONTRACT

**Authority:** PI.SOFTWARE-INTELLIGENCE.COGNITIVE-RUNTIME-ORCHESTRATION.01
**Classification:** Governance specification — binding on all SW-Intel runtime orchestration
**Status:** ACTIVE

---

## Purpose

SW-Intel cognition surfaces are NOT content panels. They are **domain cognition states**.

When an operator activates a cognition surface, the entire LENS v2 runtime must respond: the left executive interpretation reshapes, the right support rail repopulates, the center topology refocuses, the orchestration actions reprioritize, and unrelated cognition dims. Each surface is a complete operational reasoning lens through which the system is understood.

This contract defines the 12-question reasoning specification for each of the six cognition surfaces. Every answer is grounded in specific `fullReport` field paths. No answer may be supplied through inference, conversation history, or unstated assumption.

The contract serves two audiences:
1. **Implementation** — the adapter and component code that must orchestrate runtime mutation when a state activates
2. **Governance** — the audit record of what each cognition state is authorized to derive and expose

---

## Contract Template (12 Questions)

Every cognition surface MUST answer these 12 questions. The answers constitute the domain reasoning specification for that state.

| # | Question | Purpose |
|---|----------|---------|
| Q1 | What operationally activates this state? | Activation trigger — what evidence condition causes this surface to materialize |
| Q2 | What topology conditions contribute? | Structural topology factors that feed this cognition state |
| Q3 | What pressure patterns contribute? | Signal and propagation patterns that shape the assessment |
| Q4 | What domains are affected? | Which semantic domains fall under this cognition state's scope |
| Q5 | What runtime interpretation is derived? | The operational meaning synthesized from evidence — what the state SAYS |
| Q6 | What orchestration implications exist? | How the broader LENS runtime should adapt when this state is active |
| Q7 | What qualification implications exist? | How this cognition state affects SQO qualification progression |
| Q8 | What guided cognition should appear? | What contextual queries populate the right support rail |
| Q9 | What topology focus should activate? | How the center topology visualization adapts — highlights, dims, focus zones |
| Q10 | What actions become available? | What orchestration actions reprioritize or appear in the bottom panel |
| Q11 | What evidence gaps block confidence? | What missing data would improve the assessment if present |
| Q12 | What progression improves posture? | What operational steps reduce severity or advance qualification |

---

## Contract: DELIVERY_FRAGILITY

**Surface ID:** `DELIVERY_FRAGILITY`
**Governing question:** "How fragile are our delivery paths?"
**Adapter function:** `deriveDeliveryFragility(fullReport)`

### Q1. What operationally activates this state?

The surface activates when ANY of:
- `evidence_blocks[]` contains entries where `propagation_role === 'ORIGIN'` (at least one domain originates structural pressure)
- `signal_interpretations[]` contains activated signals (where `severity !== 'NOMINAL'` AND `activation_state !== 'NOMINAL'` AND `activation_state !== 'CLUSTER_BALANCED'`)

The surface returns `null` (does not materialize) when both origin count and activated signal count are zero.

**Data sources:**
- `fullReport.evidence_blocks[].propagation_role` — filtered for `'ORIGIN'`
- `fullReport.signal_interpretations[].severity` — filtered for activated state
- `fullReport.signal_interpretations[].activation_state` — activation gate

### Q2. What topology conditions contribute?

Origin domains carry structural pressure that flows outward through the dependency topology. The topology conditions are:

- **Origin domain count:** Number of `evidence_blocks[]` with `propagation_role === 'ORIGIN'` — each origin is a pressure source node in the topology
- **Origin grounding status:** `evidence_blocks[].grounding_status` per origin — determines whether the origin assessment rests on structural reality or semantic assertion
- **Propagation zone:** `propagation_summary.primary_zone_business_label` — identifies the topology zone where pressure concentrates

### Q3. What pressure patterns contribute?

- **High-severity signals:** `signal_interpretations[]` filtered where `severity === 'HIGH'` or `severity === 'ELEVATED'` — these indicate concentrated structural stress
- **Signal concentration at origins:** `signal_interpretations[].concentration` matched against `evidence_blocks[].domain_alias` — reveals whether signals cluster at origin domains
- **Severity derivation:** 2+ HIGH/ELEVATED signals = `HIGH`; 1+ HIGH/ELEVATED = `ELEVATED`; 3+ any activated = `MODERATE`; otherwise `LOW`

### Q4. What domains are affected?

Affected domains are **origin domains exclusively**: `evidence_blocks[].domain_alias` where `propagation_role === 'ORIGIN'`. These are the domains that generate structural pressure — the delivery paths that carry concentrated load.

Each origin domain is further characterized by:
- `grounding_status` — structural backing level
- Domain-specific signal count and peak severity derived from `signal_interpretations[].concentration`

### Q5. What runtime interpretation is derived?

The surface synthesizes an `operational_summary` following the pattern:

> "{N} domain(s) originate structural pressure with {M} elevated-or-higher signal(s) — delivery paths carry concentrated load at {zone}"

And a `consequence` statement:
- HIGH/ELEVATED: "Changes touching pressure-origin domains propagate risk through execution corridors — deployment requires structural awareness"
- MODERATE/LOW: "Delivery paths under moderate structural load — monitor for concentration drift"

Both are structurally derived from `evidence_blocks` counts and `signal_interpretations` severity distribution.

### Q6. What orchestration implications exist?

When DELIVERY_FRAGILITY is the active cognition state:

- **Left panel (ExecutiveInterpretation):** Reshapes to show origin domain assessment, pressure concentration explanation, and delivery path structural context. Suppresses unrelated governance or topology narrative.
- **Right panel (SupportRail):** Populates with delivery-specific guided queries: "Which origin domains carry the highest signal concentration?", "How does pressure propagate from these origins?", "What grounding status do origin domains hold?"
- **Unrelated surfaces:** COORDINATION_SATURATION, QUALIFICATION_EXPOSURE, and OPERATIONAL_TOPOLOGY dim unless their affected domains overlap with origin domains.

### Q7. What qualification implications exist?

- Origin domains with `grounding_status === 'SEMANTIC_ONLY'` reduce reconciliation confidence — these are delivery-critical paths operating on assertion rather than structural proof
- HIGH severity on delivery fragility may trigger qualification hold if `governance_lifecycle.hold_reason` references structural risk
- Delivery fragility does not directly block SQO advancement but degrades operator confidence in deployment decisions at the current S-level

### Q8. What guided cognition should appear?

Right support rail queries when this state is active:

1. "Which origin domains generate the most pressure?" — traces `evidence_blocks[].propagation_role === 'ORIGIN'` sorted by associated signal count
2. "What signals concentrate at delivery origins?" — maps `signal_interpretations[].concentration` to origin `domain_alias` values
3. "Are delivery origins structurally grounded?" — reads `evidence_blocks[].grounding_status` for origins
4. "Where does origin pressure propagate?" — traces ORIGIN -> PASS_THROUGH -> RECEIVER chain from `evidence_blocks[].propagation_role`
5. "What is the primary pressure zone?" — reads `propagation_summary.primary_zone_business_label`
6. "How does delivery fragility compare to last assessment?" — temporal delta if `temporalAnalyticsData` available

### Q9. What topology focus should activate?

- **Highlight:** All domains in `affected_domains` (origin domains) — rendered with severity-appropriate color from `SEVERITY_COLOR` map
- **Dim:** Domains with no ORIGIN role and no signal concentration overlap
- **Pressure zone overlay:** If `propagation_summary.primary_zone_business_label` is present, the topology zone containing origin domains receives a pressure zone indicator
- **Edge emphasis:** Outbound edges from origin domains to PASS_THROUGH domains should be visually emphasized to show propagation direction

### Q10. What actions become available?

- **Investigate origin structural backing** — if any origin has `grounding_status !== 'GROUNDED'`, surface an action to assess structural correspondence
- **Review pressure propagation path** — when origins connect to receivers through pass-through corridors, surface corridor investigation action
- **Stage enrichment for ungrounded origins** — if `structural_enrichment.available === false`, surface enrichment pipeline action

### Q11. What evidence gaps block confidence?

- `structural_enrichment.available === false` — no code graph or centrality data to confirm structural relationships at file level
- Origin domains with `grounding_status === 'SEMANTIC_ONLY'` — delivery path assessment rests on semantic assertion, not structural proof
- `propagation_summary` absent or empty — cannot determine where origin pressure flows
- `signal_interpretations[].concentration` absent — cannot attribute signals to specific origin domains

### Q12. What progression improves posture?

- **Reduce origin count:** Structural refactoring that distributes pressure away from concentrated origins
- **Improve grounding:** Run reconciliation or enrichment to move origin domains from SEMANTIC_ONLY to GROUNDED
- **Resolve elevated signals:** Address the structural conditions (not the signals themselves) that cause HIGH/ELEVATED activation
- **Enrich structural substrate:** Run code graph (40.3s) and centrality (40.3c) enrichment to provide file-level structural intelligence for origin domains

---

## Contract: COORDINATION_SATURATION

**Surface ID:** `COORDINATION_SATURATION`
**Governing question:** "Are coordination points overloaded?"
**Adapter function:** `deriveCoordinationSaturation(fullReport)`

### Q1. What operationally activates this state?

The surface activates when:
- `structural_enrichment.available === true` AND `structural_enrichment.centrality` is present
- At least one file in `structural_enrichment.centrality.top_structural_spines[]` has `structural_role === 'hub'` or `structural_role === 'authority'`

Returns `null` if structural enrichment is unavailable or no hub/authority coordination nodes exist.

**Data sources:**
- `fullReport.structural_enrichment.centrality.top_structural_spines[].structural_role` — filtered for `'hub'` or `'authority'`
- `fullReport.structural_enrichment.centrality.role_summary` — hub and authority counts

### Q2. What topology conditions contribute?

- **Hub/authority count:** `structural_enrichment.centrality.role_summary.hub` + `role_summary.authority` — the total number of files absorbing disproportionate structural coordination
- **Hub ratio:** hub+authority count divided by total classified files — measures coordination concentration
- **In-degree distribution:** `top_structural_spines[].in_degree` for hub/authority nodes — inbound dependency count per coordination point
- **Out-degree distribution:** `top_structural_spines[].out_degree` — outbound coupling from coordination points
- **Centrality rank:** `top_structural_spines[].centrality_rank` — structural importance ordering

### Q3. What pressure patterns contribute?

- **Absorption signals:** `signal_interpretations[]` filtered where `signal_name` contains `'Absorption'` — indicate structural load concentration
- **Cluster pressure signals:** `signal_interpretations[]` filtered where `signal_name` contains `'Cluster Pressure'` — indicate domain-level coordination overload
- **HIGH severity signals:** Any `signal_interpretations[].severity === 'HIGH'` — co-occurrence with hub concentration amplifies assessment
- **Severity derivation:** 2+ concentration signals AND hub_ratio > 0.15 = `HIGH`; 1+ concentration signals OR hub_ratio > 0.2 = `ELEVATED`; hub_ratio > 0.1 = `MODERATE`; otherwise `LOW`

### Q4. What domains are affected?

Affected items are **high-centrality files**, not semantic domains. Reported as path-derived identifiers: `top_structural_spines[].path` (last two path segments). The top 5 coordination nodes by centrality rank are surfaced as constituents.

Each constituent reports:
- `path` — file path
- `structural_role` — hub or authority
- `in_degree` — inbound dependency count
- `out_degree` — outbound coupling
- `centrality_rank` — structural importance position

### Q5. What runtime interpretation is derived?

Operational summary pattern:

> "{N} coordination hub(s) absorb structural load — peak inbound dependency {max_in_degree}, mean {mean_in_degree} with {M} concentration signal(s) active"

Consequence:
- HIGH/ELEVATED: "Coordination hubs carry disproportionate coupling — changes to these files amplify across the dependency graph"
- MODERATE/LOW: "Coordination load is distributed — no immediate concentration risk"

Additionally exposes `hub_ratio` as a percentage — the proportion of classified files serving coordination roles.

### Q6. What orchestration implications exist?

When COORDINATION_SATURATION is the active cognition state:

- **Left panel (ExecutiveInterpretation):** Shows hub concentration analysis — which files absorb coordination load, in-degree/out-degree asymmetry, and the structural dependency this creates. Framing shifts from domain-level to file-level structural reality.
- **Right panel (SupportRail):** Populates with coordination-specific queries: "Which files carry the most inbound dependencies?", "What structural role distribution exists?", "Do absorption signals co-locate with hub nodes?"
- **Unrelated surfaces:** QUALIFICATION_EXPOSURE and OPERATIONAL_TOPOLOGY dim. DELIVERY_FRAGILITY and PROPAGATION_RISK remain visible if their affected domains overlap with hub/authority file domains.

### Q7. What qualification implications exist?

- Hub concentration above 15% (`hub_ratio > 0.15`) with active concentration signals indicates structural fragility that affects deployment confidence
- Coordination saturation is an advisory signal — it does not directly gate SQO advancement
- However, if concentration co-occurs with failed revalidation checks (`revalidation_intelligence.failed > 0`), it may explain why substrate does not replay cleanly

### Q8. What guided cognition should appear?

1. "Which files absorb the most coordination load?" — reads `top_structural_spines[]` sorted by `in_degree` descending, filtered for hub/authority
2. "What is the hub-to-total ratio?" — computes from `role_summary` — shows concentration proportion
3. "Do absorption signals concentrate at hubs?" — cross-references `signal_interpretations[].concentration` with `top_structural_spines[].path`
4. "What structural role distribution exists?" — reads `role_summary` for full role breakdown (hub/authority/bridge/connector/leaf/isolate)
5. "Are coordination points also integration bridges?" — cross-references hub nodes with bridge/connector classification
6. "What happens if the top hub changes?" — impact assessment based on `in_degree` of highest-ranked hub

### Q9. What topology focus should activate?

- **Highlight:** Hub and authority nodes from `top_structural_spines[]` — rendered with severity color based on `hub_ratio` assessment
- **Dim:** Leaf and isolate nodes that are not connected to highlighted hubs
- **Edge emphasis:** All inbound edges to hub/authority nodes — visualizes the coordination absorption pattern
- **Node sizing:** Hub/authority nodes rendered proportionally larger based on `in_degree` to show structural load visually
- **Spine overlay:** `top_structural_spines` rendered as a structural spine layer if topology supports file-level rendering

### Q10. What actions become available?

- **Inspect hub dependency graph** — opens detailed view of inbound/outbound edges for top coordination nodes
- **Assess concentration signal co-presence** — if absorption or cluster pressure signals are active, surface investigation into signal-hub co-location
- **Stage structural refactoring assessment** — when `hub_ratio > 0.2`, surface an advisory action to assess whether coordination can be distributed

### Q11. What evidence gaps block confidence?

- `structural_enrichment.centrality` absent — surface cannot activate at all; code graph enrichment required
- `structural_enrichment.code_graph` absent — centrality exists but import edge detail unavailable for deeper analysis
- `signal_interpretations[].concentration` absent — cannot determine whether signals co-locate with hub nodes
- Limited spine depth — only top N spines surfaced; deeper coordination patterns may exist below threshold

### Q12. What progression improves posture?

- **Distribute coordination:** Architectural refactoring that reduces hub in-degree by extracting responsibilities
- **Resolve absorption signals:** Address structural conditions causing absorption signal activation
- **Enrich code graph depth:** If `structural_enrichment.code_graph.total_import_edges` is low, deeper enrichment may reveal true coordination patterns
- **Reduce hub ratio below 15%** — the threshold where severity begins to elevate

---

## Contract: INTEGRATION_EXPOSURE

**Surface ID:** `INTEGRATION_EXPOSURE`
**Governing question:** "Where are integration boundaries under stress?"
**Adapter function:** `deriveIntegrationExposure(fullReport)`

### Q1. What operationally activates this state?

The surface activates when ANY of:
- `structural_enrichment.centrality.role_summary` contains `bridge > 0` or `connector > 0`
- `signal_interpretations[]` contains activated signals where `signal_family === 'ISIG'` (import structure signal family)
- `signal_interpretations[]` contains signals where `signal_name` includes `'Fan Asymmetry'`
- `evidence_blocks[]` contains entries where `propagation_role === 'PASS_THROUGH'`

Returns `null` when bridge count, integration signal count, and pass-through count are all zero.

**Data sources:**
- `fullReport.structural_enrichment.centrality.role_summary.bridge` / `.connector`
- `fullReport.structural_enrichment.centrality.top_structural_spines[].structural_role` — filtered for `'bridge'` or `'connector'`
- `fullReport.signal_interpretations[].signal_family` — filtered for `'ISIG'`
- `fullReport.signal_interpretations[].signal_name` — filtered for `'Fan Asymmetry'`
- `fullReport.evidence_blocks[].propagation_role` — filtered for `'PASS_THROUGH'`

### Q2. What topology conditions contribute?

- **Bridge count:** `role_summary.bridge` — files that span domain boundaries, connecting otherwise separate clusters
- **Connector count:** `role_summary.connector` — files with cross-domain coupling that integrate subsystems
- **Bridge/connector spine nodes:** `top_structural_spines[]` filtered for bridge/connector roles — the specific files serving as integration points
- **Pass-through domains:** `evidence_blocks[].domain_alias` where `propagation_role === 'PASS_THROUGH'` — semantic domains that conduct pressure rather than originate or absorb it

### Q3. What pressure patterns contribute?

- **ISIG signals:** `signal_interpretations[]` where `signal_family === 'ISIG'` — import structure signals indicating import dependency stress at integration boundaries
- **Fan Asymmetry signals:** `signal_interpretations[]` where `signal_name` contains `'Fan Asymmetry'` — indicate directional coupling imbalance at boundaries
- **Severity derivation:** 2+ ISIG signals = `ELEVATED`; 1+ ISIG AND 2+ pass-throughs = `ELEVATED`; bridge > 0 AND (ISIG or Fan Asymmetry) > 0 = `MODERATE`; otherwise `LOW`

### Q4. What domains are affected?

Affected domains combine two populations:
- **Pass-through domains:** `evidence_blocks[].domain_alias` where `propagation_role === 'PASS_THROUGH'` — domains conducting structural pressure
- **Bridge/connector file domains:** `top_structural_spines[].path` (last two segments) where `structural_role` is bridge or connector — the file-level integration points

Deduplicated via Set — a domain or file path appears once.

### Q5. What runtime interpretation is derived?

Operational summary pattern:

> "{N} cross-domain integration point(s) under {M} import dependency signal(s) — {P} domain(s) conduct pressure"

Consequence:
- ELEVATED: "Integration boundaries are absorbing cross-domain pressure — changes here risk cascading through connected subsystems"
- MODERATE/LOW: "Integration points present but not under elevated structural stress"

Constituents expose: `bridges` count, `connectors` count, `isig_signals` count, `pass_through_domains` list.

### Q6. What orchestration implications exist?

When INTEGRATION_EXPOSURE is the active cognition state:

- **Left panel (ExecutiveInterpretation):** Shows integration boundary analysis — which files span domain boundaries, what import structure signals indicate, and where pass-through domains conduct pressure. Framing emphasizes cross-domain risk.
- **Right panel (SupportRail):** Populates with integration-specific queries: "Which bridges span the most domains?", "What ISIG signals are active at boundaries?", "Do pass-through domains also serve as bridges?"
- **Unrelated surfaces:** QUALIFICATION_EXPOSURE dims. PROPAGATION_RISK and DELIVERY_FRAGILITY remain visible because pass-through domains are part of propagation chains.

### Q7. What qualification implications exist?

- Integration boundaries with ISIG signals indicate import structure stress — this affects structural confidence in reconciliation
- Pass-through domains that are `SEMANTIC_ONLY` (no structural grounding) reduce reconciliation authority
- Fan Asymmetry signals may indicate structural drift that would cause revalidation failure

### Q8. What guided cognition should appear?

1. "Which files serve as cross-domain bridges?" — reads `top_structural_spines[]` filtered for bridge/connector roles
2. "What import structure signals are active?" — reads `signal_interpretations[]` where `signal_family === 'ISIG'`
3. "Which domains conduct pressure without originating it?" — reads `evidence_blocks[]` where `propagation_role === 'PASS_THROUGH'`
4. "Is there fan asymmetry at integration points?" — reads `signal_interpretations[]` for Fan Asymmetry signals
5. "Do bridges overlap with coordination hubs?" — cross-references bridge nodes with hub/authority nodes from centrality
6. "What structural grounding do pass-through domains have?" — reads `evidence_blocks[].grounding_status` for pass-through entries

### Q9. What topology focus should activate?

- **Highlight:** Bridge and connector nodes from `top_structural_spines[]`, plus pass-through domains from `evidence_blocks[]`
- **Dim:** Hub, leaf, and isolate nodes not connected to integration boundaries
- **Edge emphasis:** Cross-domain edges — edges that connect nodes in different semantic domains, visualizing the boundary-spanning pattern
- **Boundary overlay:** If topology supports domain boundary rendering, integration boundary lines should be visually emphasized
- **Signal annotation:** ISIG and Fan Asymmetry signals annotated at their concentration points

### Q10. What actions become available?

- **Inspect integration boundary signals** — when ISIG signals are active, surface detailed signal investigation for boundary files
- **Review pass-through domain classification** — when pass-through domains include non-operational artifacts (config, docs), surface classification review action (mirrors `receiver-classification` pattern from `OrchestrationGuidanceRuntime`)
- **Assess fan asymmetry resolution** — when Fan Asymmetry signals are present, surface structural investigation action

### Q11. What evidence gaps block confidence?

- `structural_enrichment.centrality` absent — cannot identify bridge/connector roles; only pass-through evidence from `evidence_blocks` available
- `signal_interpretations[].signal_family` absent — cannot distinguish ISIG signals from general signals
- `evidence_blocks[].propagation_role` absent or all ORIGIN/RECEIVER — no pass-through domains identified, cannot assess integration conduction
- Code graph unavailable — bridge/connector role assignment depends on import edge analysis from `structural_enrichment.code_graph`

### Q12. What progression improves posture?

- **Reduce bridge fan-out:** Refactor integration points to serve fewer cross-domain connections
- **Resolve ISIG signals:** Address import structure conditions causing signal activation
- **Ground pass-through domains:** Run enrichment to move pass-through domains from semantic-only to structurally grounded
- **Enrich centrality analysis:** If bridge/connector detection is incomplete, deeper code graph enrichment improves boundary identification

---

## Contract: OPERATIONAL_TOPOLOGY

**Surface ID:** `OPERATIONAL_TOPOLOGY`
**Governing question:** "What is the structural health of this system's topology?"
**Adapter function:** `deriveOperationalTopologyPosture(fullReport)`

### Q1. What operationally activates this state?

The surface activates when the system has at least one recognized semantic domain:
- `topology_summary.semantic_domain_count > 0` OR `semantic_domain_registry.length > 0`

Returns `null` when domain count is zero — there is no topology to assess.

**Data sources:**
- `fullReport.topology_summary.semantic_domain_count`
- `fullReport.semantic_domain_registry[]`
- `fullReport.topology_summary.grounding_ratio`
- `fullReport.topology_summary.structurally_backed_count`
- `fullReport.topology_summary.semantic_only_count`

### Q2. What topology conditions contribute?

This is the **cross-domain** surface — it assesses the topology itself rather than specific domains within it.

- **Domain count:** `topology_summary.semantic_domain_count` or `semantic_domain_registry.length`
- **Grounding ratio:** `topology_summary.grounding_ratio` or derived from `structurally_backed_count / semantic_domain_count` — the proportion of domains with structural correspondence
- **Structurally backed count:** `topology_summary.structurally_backed_count`
- **Semantic-only count:** `topology_summary.semantic_only_count` — domains without structural backing
- **Role distribution:** Derived from `structural_enrichment.centrality.role_summary` — classified as `hub-concentrated` (hub+authority > 25%), `leaf-heavy` (leaf > 70%), or `balanced`
- **Role breakdown:** Per-role count and percentage from `role_summary` (hub, authority, bridge, connector, leaf, isolate)
- **Zone anchors:** `semantic_domain_registry[].zone_anchor === true` — domains that anchor topology zones

### Q3. What pressure patterns contribute?

Operational Topology is a posture surface, not a pressure surface. It does not directly consume `signal_interpretations`. Instead, it synthesizes:

- **Reconciliation state:** `reconciliation_summary.reconciled_count` (or `aligned_count`) / `total_semantic_domains` — how much of the topology has been structurally confirmed
- **Weighted confidence:** `reconciliation_summary.weighted_confidence_score` — the reconciliation confidence level
- **Severity derivation:** grounding_ratio < 0.5 = `ELEVATED`; grounding_ratio < 0.7 = `MODERATE`; otherwise `LOW`

### Q4. What domains are affected?

This is a **cross-domain surface** — all domains are within scope. The `affected_domains` field reports zone anchor domains: `semantic_domain_registry[].domain_name` or `.domain_id` where `zone_anchor === true`. These are the structural anchors of the topology.

### Q5. What runtime interpretation is derived?

Operational summary pattern:

> "{N} domain(s) — {backed} structurally grounded ({pct}%), {semantic_only} semantic-only — topology {role_distribution}, {classified} files classified"

Consequence:
- grounding < 50%: "Low grounding coverage means operational assessments rest on semantic inference — structural confirmation needed before deployment decisions"
- grounding < 70%: "Partial grounding — topology assessments are advisory-qualified for ungrounded domains"
- grounding >= 70%: "Topology has strong structural grounding — operational assessments carry structural authority"

Constituents: `domain_count`, `backed`, `semantic_only`, `grounding_pct`, `reconciliation_pct`, `role_distribution`, `role_breakdown`, `zone_anchors`.

### Q6. What orchestration implications exist?

When OPERATIONAL_TOPOLOGY is the active cognition state:

- **Left panel (ExecutiveInterpretation):** Shows full topology health assessment — grounding coverage, role distribution balance, reconciliation authority. This is the "system structural overview" frame.
- **Right panel (SupportRail):** Populates with topology-wide queries: "What is the current grounding ratio?", "Which domains are semantic-only?", "What is the role distribution shape?", "Where are zone anchors?"
- **All other surfaces remain visible** — Operational Topology is the base posture that contextualizes all other surfaces. No suppression occurs; instead, other surfaces gain topology context annotations.

### Q7. What qualification implications exist?

This surface directly affects qualification authority:

- Grounding ratio below 50% reduces reconciliation authority — `reconciliation_authority.level` will be `PARTIAL` or `UNRECONCILED`
- Q-class (`qualifier_summary.qualifier_class`) is constrained by grounding coverage
- Semantic-only domains cannot carry structural authority for qualification advancement
- Zone anchors without grounding weaken the topology foundation for SQO progression

### Q8. What guided cognition should appear?

1. "What proportion of domains are structurally grounded?" — reads `topology_summary.grounding_ratio`, `structurally_backed_count`, `semantic_only_count`
2. "Which domains lack structural backing?" — reads `semantic_domain_registry[]` filtered for ungrounded entries
3. "What is the structural role distribution?" — reads `structural_enrichment.centrality.role_summary` for full breakdown
4. "Where are zone anchors positioned?" — reads `semantic_domain_registry[].zone_anchor`
5. "How does reconciliation authority map to grounding?" — cross-references `reconciliation_summary` with `topology_summary`
6. "What is the reconciliation confidence level?" — reads `reconciliation_summary.weighted_confidence_score`

### Q9. What topology focus should activate?

- **Full topology visible** — no dimming; this is the topology overview state
- **Grounding overlay:** Domains colored by grounding status — `GROUNDED` in structural authority color, `SEMANTIC_ONLY` in advisory color
- **Role distribution overlay:** If file-level rendering available, node shapes indicate structural role (hub, authority, bridge, connector, leaf, isolate) per `SW_INTEL_ROLE_MAP`
- **Zone anchor emphasis:** Zone anchor domains receive anchor indicators
- **Reconciliation border:** Reconciled domains receive confirmation border; unreconciled receive advisory border

### Q10. What actions become available?

- **Domain reconciliation** — when unreconciled domains exist, surface the `domain-reconciliation` action (already present in `OrchestrationGuidanceRuntime`): review structural correspondence, confirm/reject backing, update Q-class
- **Enrichment assessment** — when `structural_enrichment.available === false`, surface substrate enrichment action to improve grounding
- **Topology shape assessment** — when `role_distribution === 'hub-concentrated'` or `'leaf-heavy'`, surface structural balance advisory

### Q11. What evidence gaps block confidence?

- `structural_enrichment.available === false` — no file-level structural intelligence; role distribution unknown
- `reconciliation_summary.available === false` — cannot assess structural backing of semantic domains; grounding is inferred from `topology_summary` only
- `semantic_domain_registry` empty — no domain-level detail available; only aggregate counts from `topology_summary`
- Low zone anchor count — topology lacks structural anchors to orient the assessment

### Q12. What progression improves posture?

- **Improve grounding ratio:** Run reconciliation to match semantic domains to structural correspondence — move domains from SEMANTIC_ONLY to GROUNDED
- **Enrich structural substrate:** Run code graph and centrality enrichment to populate `structural_enrichment`
- **Balance role distribution:** If hub-concentrated, consider structural refactoring to distribute coordination
- **Establish zone anchors:** Ensure high-confidence grounded domains are marked as zone anchors in `semantic_domain_registry`

---

## Contract: QUALIFICATION_EXPOSURE

**Surface ID:** `QUALIFICATION_EXPOSURE`
**Governing question:** "What governance gaps affect qualification progression?"
**Adapter function:** `deriveQualificationExposure(fullReport)`

### Q1. What operationally activates this state?

This surface ALWAYS activates when the adapter runs — it has no null-return path. It assesses the presence of 7 governance artifacts and derives severity from gaps and blockers.

**Data sources (7 governance artifacts):**
- `fullReport.governance_lifecycle.available`
- `fullReport.proposition_corpus.available`
- `fullReport.revalidation_intelligence.available`
- `fullReport.constitutional_anchor.available`
- `fullReport.convergence_intelligence.available`
- `fullReport.chronicle_certification.available`
- `fullReport.enrichment_intelligence.available`

### Q2. What topology conditions contribute?

Qualification Exposure is a **cross-domain governance surface** — it does not derive from topology structure. Instead, it assesses the governance artifact landscape:

- **Artifact presence:** 7 governance artifacts checked for `.available` — each represents a distinct governance lifecycle facet
- **S-level:** `governance_lifecycle.s_level` — current qualification level
- **Promotion eligibility:** `governance_lifecycle.promotion_eligible` — whether advancement gate conditions are met
- **Authority ceiling:** `governance_lifecycle.authority_ceiling` — the maximum achievable qualification level under current conditions

### Q3. What pressure patterns contribute?

Qualification pressure comes from blockers, not signal patterns:

- **Advancement hold:** `governance_lifecycle.promotion_eligible === false` AND `governance_lifecycle.hold_reason` present — qualification is held with stated reason
- **Flagged propositions:** `proposition_corpus.flagged_count > 0` — semantic propositions requiring operator disposition before progression
- **Revalidation failures:** `revalidation_intelligence.failed > 0` — substrate does not replay cleanly, blocking structural confidence
- **Severity derivation:** 2+ blockers = `HIGH`; 1 blocker = `ELEVATED`; fewer than 3 artifacts present = `MODERATE`; otherwise `LOW`

### Q4. What domains are affected?

Qualification Exposure `affected_domains` is always empty (`[]`). This is intentional — qualification is a cross-domain governance assessment, not a domain-specific surface. All domains are equally affected by qualification posture.

### Q5. What runtime interpretation is derived?

Operational summary pattern (when governance lifecycle present):

> "Qualification at {S-level} — {N}/7 governance artifacts present, {M} blocker(s)"

Operational summary pattern (when governance lifecycle absent):

> "{N}/7 governance artifacts present — no governance lifecycle established"

Consequence:
- Blockers present: "Qualification progression blocked: {blocker descriptions joined}"
- No blockers but gaps: "Missing governance artifacts ({gap names}) limit qualification depth"
- All present: "Governance artifacts fully present — qualification progression unblocked"

Constituents: `s_level`, `promotion_eligible`, `authority_ceiling`, `artifacts_present`, `artifacts_total`, `gaps[]`, `blockers[]`.

### Q6. What orchestration implications exist?

When QUALIFICATION_EXPOSURE is the active cognition state:

- **Left panel (ExecutiveInterpretation):** Shows governance gap analysis — which artifacts are present, what blockers prevent advancement, and what the current authority ceiling means operationally. This is the "qualification health" frame.
- **Right panel (SupportRail):** Populates with governance-specific queries: "What artifacts are missing?", "What blocks advancement?", "What is the authority ceiling?", "What propositions need review?"
- **Unrelated surfaces:** DELIVERY_FRAGILITY, COORDINATION_SATURATION, and INTEGRATION_EXPOSURE dim unless they contain active blockers relevant to qualification (e.g., revalidation failures linked to structural pressure).

### Q7. What qualification implications exist?

This IS the qualification surface. Direct implications:

- `governance_lifecycle.promotion_eligible === true` means advancement gate prerequisites are met — operator authorization is the remaining step
- `governance_lifecycle.hold_reason` explicitly states what blocks progression
- `proposition_corpus.flagged_count > 0` requires operator disposition before any advancement
- `revalidation_intelligence.failed > 0` indicates structural drift — substrate must replay cleanly before progression
- Missing artifacts (gaps) limit the depth of qualification assessment even if no explicit blockers exist

### Q8. What guided cognition should appear?

1. "What qualification level is current?" — reads `governance_lifecycle.s_level` and `authority_ceiling`
2. "What blocks qualification advancement?" — reads `governance_lifecycle.hold_reason`, `proposition_corpus.flagged_count`, `revalidation_intelligence.failed`
3. "Which governance artifacts are missing?" — reads `gaps[]` from constituents
4. "How many propositions need review?" — reads `proposition_corpus.flagged_count`, `proposition_corpus.total`
5. "What is the revalidation status?" — reads `revalidation_intelligence.passed`, `.failed`, `.total_checks`, `.status`
6. "What does the authority ceiling mean?" — reads `governance_lifecycle.authority_ceiling` and explains what S-level capabilities it enables

### Q9. What topology focus should activate?

- **Minimal topology modification** — Qualification Exposure is governance-focused, not topology-focused
- **Qualification overlay:** If governance lifecycle is present, a subtle S-level indicator appears on the topology view header
- **Blocker annotation:** If blockers reference specific domains (via proposition corpus or revalidation), those domains receive blocker indicators in the topology
- **Governance depth color:** Overall topology border color shifts to reflect governance depth level (FULL, EXERCISED, MINIMAL, NONE)

### Q10. What actions become available?

This surface directly drives orchestration actions already implemented in `OrchestrationGuidanceRuntime`:

- **Proposition review** (`proposition-review` action) — when `proposition_corpus.flagged_count > 0`
- **Revalidation failure investigation** (`revalidation-failure` action) — when `revalidation_intelligence.failed > 0`
- **Governance lifecycle initiation** (`governance-lifecycle` action) — when `governance_depth.level === 'NONE'`
- **Qualification assessment** (`qualification-assessment` action) — always present when `qualification_cognition` exists
- **SQO review obligations** (from `LensSQOOrchestrationAdapter`) — when `sqoAuthorityWorkspace` has unresolved obligations

### Q11. What evidence gaps block confidence?

- `governance_lifecycle.available === false` — no governance lifecycle exercised; S-level, promotion eligibility, and authority ceiling all unknown
- `proposition_corpus.available === false` — no semantic propositions derived; governed structural claims not available
- `revalidation_intelligence.available === false` — cannot determine whether substrate replays cleanly
- `constitutional_anchor.available === false` — constitutional basis for qualification not established
- `convergence_intelligence.available === false` — cross-specimen convergence patterns unavailable
- `chronicle_certification.available === false` — governance chronicle not certified
- `enrichment_intelligence.available === false` — enrichment event history unavailable

### Q12. What progression improves posture?

- **Resolve blockers first:** Address `hold_reason`, flagged propositions, and revalidation failures — these are the direct gates
- **Exercise governance lifecycle:** Initiate SQO qualification to produce governance lifecycle artifacts
- **Derive propositions:** Run semantic proposition derivation to populate `proposition_corpus`
- **Run revalidation:** Execute revalidation checkpoint to confirm substrate replays cleanly
- **Enrich governance depth:** Each additional governance artifact reduces the gap count and moves governance depth toward FULL

---

## Contract: PROPAGATION_RISK

**Surface ID:** `PROPAGATION_RISK`
**Governing question:** "How does pressure propagate through the system?"
**Adapter function:** `derivePropagationRisk(fullReport)`

### Q1. What operationally activates this state?

The surface activates when:
- `evidence_blocks[]` is non-empty (at least one evidence block exists with a propagation role)

Returns `null` when `evidence_blocks` is empty or absent.

**Data sources:**
- `fullReport.evidence_blocks[].propagation_role` — classified as `'ORIGIN'`, `'PASS_THROUGH'`, or `'RECEIVER'`
- `fullReport.evidence_blocks[].domain_alias`
- `fullReport.evidence_blocks[].grounding_status`
- `fullReport.signal_interpretations[].co_presence` — signals with co-occurrence relationships
- `fullReport.signal_interpretations[].concentration` — signal domain attribution
- `fullReport.propagation_summary`

### Q2. What topology conditions contribute?

- **Chain composition:** The ORIGIN -> PASS_THROUGH -> RECEIVER chain derived from `evidence_blocks[].propagation_role` — the structural propagation pathway
- **Chain length:** Total count of origin + pass-through + receiver blocks — longer chains indicate more complex propagation
- **Grounding per node:** `evidence_blocks[].grounding_status` at each chain position — ungrounded nodes in the chain weaken propagation confidence
- **Domain identity per node:** `evidence_blocks[].domain_alias` — maps the propagation chain to semantic domains

### Q3. What pressure patterns contribute?

- **Co-presence signals:** `signal_interpretations[]` filtered where `co_presence` array is non-empty — signals that co-occur, indicating compound structural conditions
- **Concentrated signals:** `signal_interpretations[]` filtered where `concentration` is present — signals attributed to specific domains
- **Concentration pattern:** If concentrated signals exceed 50% of all activated signals, pattern is `'concentrated'`; otherwise `'distributed'`
- **Severity derivation:** 2+ origins AND 2+ receivers = `HIGH`; 1+ origin AND 1+ pass-through AND 1+ receiver (complete chain) = `ELEVATED`; chain length > 2 = `MODERATE`; otherwise `LOW`

### Q4. What domains are affected?

Affected domains span the **full propagation chain**: all `evidence_blocks[].domain_alias` values, ordered by propagation role (ORIGIN first, then PASS_THROUGH, then RECEIVER). This is the only surface that explicitly spans origin-to-receiver domains.

Each chain node reports:
- `domain` — domain alias
- `role` — ORIGIN, PASS_THROUGH, or RECEIVER
- `grounding` — grounding status at that chain position

### Q5. What runtime interpretation is derived?

Operational summary pattern:

> "Pressure propagates from {N} origin(s) through {M} corridor(s) to {P} receiver(s) — signal concentration {pattern}"

Consequence:
- HIGH/ELEVATED: "Multi-domain pressure propagation active — changes at origins amplify through corridors to receivers"
- MODERATE/LOW: "Pressure propagation paths present but not under elevated structural load"

Constituents: `chain[]`, `origins` count, `pass_throughs` count, `receivers` count, `co_presence_signals` count, `concentration_pattern`.

### Q6. What orchestration implications exist?

When PROPAGATION_RISK is the active cognition state:

- **Left panel (ExecutiveInterpretation):** Shows the full propagation chain narrative — where pressure originates, how it conducts through corridors, where it terminates. Framing emphasizes cascade risk and amplification.
- **Right panel (SupportRail):** Populates with propagation-specific queries: "What is the full propagation chain?", "Where are grounding gaps in the chain?", "Do co-present signals amplify propagation?", "Which receivers absorb the most downstream pressure?"
- **Overlapping surfaces:** DELIVERY_FRAGILITY (shares origin domains) and INTEGRATION_EXPOSURE (shares pass-through domains) remain visible with propagation context. COORDINATION_SATURATION remains visible if hubs appear in the chain.

### Q7. What qualification implications exist?

- Propagation chains with ungrounded nodes reduce confidence in the structural assessment — pass-through domains at `SEMANTIC_ONLY` mean the chain is partially inferred
- Complete chains (ORIGIN -> PASS_THROUGH -> RECEIVER) with HIGH severity indicate systemic structural pressure that may affect deployment confidence at the current S-level
- Co-present signals at multiple chain positions may indicate structural conditions that would cause revalidation failure

### Q8. What guided cognition should appear?

1. "What is the full propagation chain?" — renders `chain[]` as ORIGIN -> PASS_THROUGH -> RECEIVER sequence with grounding status
2. "Where are grounding gaps in the chain?" — filters `chain[]` for nodes where `grounding !== 'GROUNDED'`
3. "Which signals co-present across chain domains?" — reads `signal_interpretations[].co_presence` filtered for chain domain overlap
4. "Is signal concentration localized or distributed?" — reads `concentration_pattern` from constituents
5. "Which receivers absorb the most downstream pressure?" — reads `evidence_blocks[]` where `propagation_role === 'RECEIVER'`, cross-referenced with signal concentration
6. "Does the propagation path cross domain boundaries?" — reads `chain[].domain` to identify boundary crossings

### Q9. What topology focus should activate?

- **Chain highlight:** Full propagation chain rendered as a connected path — ORIGIN nodes, PASS_THROUGH nodes, RECEIVER nodes, with directed edges between them
- **Role coloring:** Origins in pressure-origin color, pass-throughs in corridor color, receivers in absorption color
- **Dim:** Domains not participating in the propagation chain
- **Flow animation:** If topology supports it, directional flow indicators on chain edges showing pressure direction
- **Co-presence annotation:** Where signals co-present at chain nodes, annotate with signal count

### Q10. What actions become available?

- **Investigate propagation chain** — opens detailed chain view with grounding status and signal attribution per node
- **Review receiver classification** — when receivers include non-operational artifacts (config, docs, examples), surface the `receiver-classification` action from `OrchestrationGuidanceRuntime`
- **Assess chain grounding gaps** — when chain nodes have `SEMANTIC_ONLY` grounding, surface enrichment action for those specific domains
- **Trace co-presence amplification** — when co-present signals exceed threshold, surface investigation into compound structural conditions

### Q11. What evidence gaps block confidence?

- `evidence_blocks[].propagation_role` all same role — no chain exists, only isolated roles; cannot assess propagation
- `evidence_blocks[].grounding_status` is `SEMANTIC_ONLY` for chain nodes — propagation assessment rests on semantic assertion
- `signal_interpretations[].co_presence` absent — cannot determine signal compound effects across chain
- `signal_interpretations[].concentration` absent — cannot attribute signals to specific chain positions
- `propagation_summary` absent — no aggregate propagation characterization available

### Q12. What progression improves posture?

- **Ground chain nodes:** Run reconciliation/enrichment to move SEMANTIC_ONLY nodes to GROUNDED — strengthens chain confidence
- **Reduce origin count:** Structural refactoring that distributes pressure origination across more domains
- **Shorten chains:** Reduce pass-through depth where possible — shorter chains have less amplification risk
- **Resolve co-present signals:** Address the structural conditions (not the signals) that cause compound signal activation at chain positions
- **Classify suspect receivers:** Review non-operational receivers (config, docs, examples) to clean the propagation model

---

## Runtime Choreography Model

When an operator selects a cognition surface, the LENS v2 three-column layout orchestrates a complete runtime mutation. This is not tab switching — it is cognitive state transition.

### Three-Column Choreography

```
┌─────────────────────────────┬─────────────────────────────────┬─────────────────────────────┐
│   LEFT PANEL                │   CENTER TOPOLOGY               │   RIGHT PANEL               │
│   ExecutiveInterpretation   │   StructuralTopologyZone        │   SupportRail               │
│                             │                                 │                             │
│   Contract Interpretation   │   Affected Domain Focus         │   Guided Cognition Queries  │
│   - operational meaning     │   - highlight affected          │   - Q8 queries for active   │
│   - structural evidence     │   - dim unrelated               │     surface                 │
│   - domain impact           │   - pressure zone overlay       │   - data-derived            │
│   - consequence projection  │   - edge emphasis               │   - structurally grounded   │
│   - suppression disclosure  │   - role coloring               │   - no inference            │
│                             │                                 │                             │
├─────────────────────────────┴─────────────────────────────────┴─────────────────────────────┤
│   BOTTOM — ORCHESTRATION GUIDANCE                                                           │
│   OrchestrationGuidanceRuntime                                                              │
│                                                                                             │
│   Actions reprioritize based on active cognition state (Q10)                                │
│   Qualification-relevant actions float to top when QUALIFICATION_EXPOSURE active             │
│   Structural actions float when DELIVERY_FRAGILITY or PROPAGATION_RISK active                │
│   Integration actions float when INTEGRATION_EXPOSURE active                                │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### State Transition Rules

1. **Single active surface:** Only one cognition surface may be active at a time. Selecting a new surface deactivates the previous.

2. **Deactivation returns to base posture:** When no surface is selected, the runtime returns to the default OPERATIONAL_TOPOLOGY posture with all surfaces visible at equal weight.

3. **Dimming, not hiding:** Unrelated surfaces dim (reduced opacity, muted colors) but remain accessible. The operator can see that other cognition exists without being distracted by it.

4. **Cross-surface overlap:** When affected domains overlap between the active surface and another surface, the overlapping surface retains partial visibility. For example, activating PROPAGATION_RISK keeps DELIVERY_FRAGILITY partially visible because they share origin domains.

5. **Severity preservation:** The active surface's severity determines the interpretive tone of the left panel (HIGH = alarming, ELEVATED = cautionary, MODERATE = advisory, LOW = informational).

6. **Evidence trace continuity:** All interpretive content in the left panel must trace to `trace_sources[]` declared by the active surface. No interpretive content may be synthesized from sources not listed.

### Persona Adaptation

The choreography adapts to the active LENS persona:

| Persona | Left Panel Framing | Right Rail Depth | Topology Detail | Action Detail |
|---|---|---|---|---|
| BOARDROOM | Executive posture assessment | Top 2-3 queries only | Domain-level only | Summary actions |
| EXECUTIVE_BALANCED | Balanced narrative interpretation | Full Q8 query set | Domain + zone overlay | Full action set |
| EXECUTIVE_DENSE | Structural interpretation | Full Q8 + structural expansions | Domain + file-level roles | Full action set |
| INVESTIGATION_DENSE | Forensic evidence interpretation | Full Q8 + evidence trace paths | Full topology + edge detail | Full action set + evidence links |

---

## Implementation Binding

This contract governs the following implementation files:

### Projection Layer

| File | Responsibility |
|---|---|
| `app/execlens-demo/lib/lens-v2/SoftwareIntelligenceProjectionAdapter.js` | Derives the 6 cognition surfaces from `fullReport` — implements Q1-Q5 for each contract |
| `app/execlens-demo/components/lens-v2/zones/SoftwareIntelligenceField.jsx` | Renders cognition surface cards — `CognitionSurfaceCard`, severity strips, detail expansion |

### Orchestration Layer

| File | Responsibility |
|---|---|
| `app/execlens-demo/components/lens-v2/zones/OrchestrationGuidanceRuntime.jsx` | Derives condition actions from SW-Intel projection — implements Q10 actions |
| `app/execlens-demo/lib/lens-v2/LensSQOOrchestrationAdapter.js` | Translates SQO operational state into governed orchestration actions |

### Shell and Layout

| File | Responsibility |
|---|---|
| `app/execlens-demo/components/lens-v2/LensDisclosureShell.jsx` | Three-column layout orchestration — zone sequence, tier grouping, persona adaptation |
| `app/execlens-demo/components/lens-v2/zones/IntelligenceField.jsx` | Left panel executive interpretation — persona-adapted framing, structural escalation conditions |
| `app/execlens-demo/components/lens-v2/zones/StructuralTopologyZone.jsx` | Center topology visualization — domain graph, structural spines, grounding overlay |

### Topology and Evidence

| File | Responsibility |
|---|---|
| `app/execlens-demo/components/lens-v2/zones/constants.js` | Pressure metadata, role metadata, binding defaults |
| `app/execlens-demo/lib/lens-v2/InterrogationTrailBuilder.js` | Builds evidence trail HTML for forensic mode traversal |

### Implementation Gap

The following Q-specifications from this contract are NOT YET implemented in the codebase:

- **Q6 (orchestration implications per surface):** The runtime does not yet mutate the left panel, right rail, and topology based on which cognition surface is active. Surfaces are currently rendered as selectable cards but do not drive three-column choreography.
- **Q8 (guided cognition queries per surface):** Context-specific guided queries per active cognition state are specified but not yet wired to the support rail.
- **Q9 (topology focus per surface):** Domain highlighting and dimming based on active surface is specified but not yet implemented in `StructuralTopologyZone`.
- **Q10 (surface-specific action reprioritization):** Actions are derived from projection and SQO state but not yet reprioritized based on active cognition surface.

These gaps represent the implementation target for cognitive runtime orchestration.
