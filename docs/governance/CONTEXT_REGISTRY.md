# CONTEXT_REGISTRY

Purpose:
Externalize stream-family operating context so stream contracts do not need to carry the full worldview every time.

This file is the anti-context-loss registry.

────────────────────────────────────
## FAMILY: EX

Purpose:
Execution layer for binding, verification, debug, trace, and system bridge work that plugs runtime truth into governed consumption surfaces.

Typical streams:
- EX.1 binding and verification
- EX.2 debug and trace
- EX.3 system bridge

Standard invariants:
- read-only unless stream delta explicitly authorizes writes
- no recomputation of governed upstream states
- adapter boundary must remain explicit
- runtime truth preferred over synthetic narration
- debug/trace outputs must remain traceable to source payloads

Standard artifact slots:
1. map or trace surface
2. spec
3. definition
4. exposure surface or mechanism
5. boundary contract
6. validation report
7. execution report

Validation profiles:
- bridge_binding
- debug_trace
- runtime_bridge

State vocabularies:
- CE.4 = COMPLETE | PARTIAL | BLOCKED | COMPUTABLE_PENDING
- CE.5 = AVAILABLE | PARTIAL | BLOCKED
- CE.2 = BLOCKED | DEGRADED | AT_RISK | STABLE

Handover expectations:
- resulting execution state
- adapter boundary state
- validation status
- remaining gaps
- git hygiene status

Known exclusions:
- no redefinition of PiOS core logic
- no synthetic runtime generation
- no ungoverned UI interpretation

────────────────────────────────────
## FAMILY: 40

Purpose:
PiOS core deterministic runtime from governed telemetry through signals, conditions, diagnosis, intelligence, delivery, feedback, and orchestration.

Typical streams:
- 40.5 signal computation
- 40.6 conditions
- 40.7 intelligence synthesis
- 40.8 delivery
- 40.9 feedback
- 40.10 orchestration
- 40.11 closure

Standard invariants:
- evidence-first
- deterministic transformation only
- bounded stage-to-stage inputs
- no downstream artifact used as upstream evidence
- no speculative values without traceability

Standard artifact slots:
1. input matrix
2. specification
3. output set
4. traceability map
5. boundary enforcement
6. validation report
7. execution manifest or report

Validation profiles:
- signal_contract
- condition_contract
- diagnosis_contract
- delivery_contract
- feedback_contract
- orchestration_contract
- closure_contract

State vocabularies:
- signal_state = COMPLETE | PARTIAL | BLOCKED
- condition_state = BLOCKED | DEGRADED | AT_RISK | STABLE
- intelligence_state = BOUNDED | PARTIAL | BLOCKED
- delivery_state = READY | PARTIAL | BLOCKED

Handover expectations:
- stage closure status
- boundary integrity
- evidence sufficiency
- traceability sufficiency
- next upstream/downstream dependency

Known exclusions:
- no UI logic
- no publishing logic
- no category narration drift

────────────────────────────────────
## FAMILY: 42

Purpose:
Consumption and interpretation layer for query execution, executive narrative rendering, delivery packaging, and demo-facing governed exposure.

Typical streams:
- 42.1 query execution
- 42.2 narrative rendering
- 42.3 delivery CLI
- 42.4 demo integration
- 42.5 gauges and Obsidian
- 42.6 overview
- 42.7 topology
- 42.8 choreography
- 42.9 packaging

Standard invariants:
- render only governed upstream truth
- no synthetic metrics in UI
- drill-down must preserve traceability
- executive readability must not destroy evidence lineage

Standard artifact slots:
1. adapter or query map
2. rendering spec
3. output definition
4. exposure surface
5. boundary contract
6. validation report
7. execution report

Validation profiles:
- query_execution
- narrative_rendering
- delivery_surface
- demo_adapter
- topology_surface
- packaging_readiness

State vocabularies:
- render_state = READY | PARTIAL | BLOCKED
- evidence_state = PRESENT | PARTIAL | MISSING
- navigation_state = VALID | DEGRADED | BLOCKED

Handover expectations:
- user-facing behavior state
- evidence chain status
- adapter fidelity status
- UI/demo readiness
- packaging readiness

Known exclusions:
- no recomputation of upstream core states
- no free-form narrative beyond governed bounds

────────────────────────────────────
## FAMILY: 51

Purpose:
Runtime layer for UI, API, scenario execution, and operational behavior above governed consumption outputs.

Typical scopes:
- demo runtime
- API route behavior
- scenario execution
- interface-level runtime integration

Standard invariants:
- runtime must bind to governed surfaces
- no bypass of governed adapters
- scenario execution must remain inspectable
- interface behavior must remain attributable

Standard artifact slots:
1. runtime map
2. interface spec
3. execution definition
4. exposure surface
5. runtime boundary contract
6. validation report
7. execution report

Validation profiles:
- ui_runtime
- api_runtime
- scenario_execution

State vocabularies:
- runtime_state = READY | DEGRADED | BLOCKED
- api_state = HEALTHY | PARTIAL | FAILED
- scenario_state = EXECUTABLE | PARTIAL | BLOCKED

Handover expectations:
- runtime readiness
- route behavior
- scenario coverage
- outstanding runtime gaps

Known exclusions:
- no redefinition of PiOS semantics
- no governance rewriting in runtime layer

────────────────────────────────────
## FAMILY: GOV

Purpose:
Canonical governance, registry control, authority locking, and execution governance enforcement.

Typical streams:
- registry formation
- source determination
- authority lock
- governance operating rules

Standard invariants:
- evidence first
- canonical source precedence
- no authority ambiguity
- no duplicate truth surfaces without designation

Standard artifact slots:
1. registry or inventory
2. governance spec
3. control definition
4. authority exposure surface
5. boundary contract
6. validation report
7. execution report

Validation profiles:
- canonical_integrity
- registry_integrity
- authority_lock

State vocabularies:
- authority_state = LOCKED | PARTIAL | UNRESOLVED
- source_state = CANONICAL | DERIVATIVE | INVALID

Handover expectations:
- authority result
- source precedence
- downstream implications
- locked constraints

Known exclusions:
- no publishing execution inside GOV unless explicitly scoped

────────────────────────────────────
## FAMILY: CAT

Purpose:
Category authority, construct positioning, derivative classification, reinforcement of canonical conceptual surfaces.

Standard invariants:
- category authority originates from canonical layer
- derivative constructs must be explicitly positioned
- no promotional drift in authority statements

Standard artifact slots:
1. construct map
2. positioning spec
3. authority definition
4. derivative exposure surface
5. boundary contract
6. validation report
7. execution report

Validation profiles:
- construct_positioning
- derivative_alignment
- category_authority

State vocabularies:
- construct_state = CANONICAL | DERIVATIVE | MISALIGNED
- authority_state = ALIGNED | PARTIAL | DRIFTED

Handover expectations:
- authority positioning outcome
- derivative alignment state
- downstream publishing implications

Known exclusions:
- no crawl/publish execution inside CAT unless explicitly scoped

────────────────────────────────────
## FAMILY: WEB

Purpose:
Publishing, crawl projection, route governance, mirror behavior, SEO surfaces, and externally consumable authority projection.

Typical scopes:
- mirror route structure
- crawl validation
- sitemap
- canonical mapping
- publishing alignment

Standard invariants:
- published surface must reflect canonical authority
- route and canonical mapping must remain explicit
- no content drift between authority and projection
- crawl surface must remain clean and indexable

Standard artifact slots:
1. route or surface map
2. publishing spec
3. projection definition
4. crawl or exposure surface
5. boundary contract
6. validation report
7. execution report

Validation profiles:
- mirror_publish
- crawl_surface
- sitemap_integrity
- canonical_projection

State vocabularies:
- publish_state = READY | PARTIAL | BLOCKED
- crawl_state = VALID | DEGRADED | BLOCKED
- canonical_state = ALIGNED | PARTIAL | DRIFTED

Handover expectations:
- publishing outcome
- crawl/index readiness
- canonical alignment
- remaining route issues

Known exclusions:
- no canonical source redefinition inside WEB

────────────────────────────────────
## REGISTRY RULES

1. Stream contracts reference family context; they do not restate it.
2. Validators should consume these family definitions.
3. Templates must remain family-neutral unless explicitly specialized.
4. Any new family must be added here before its contracts are compressed.
