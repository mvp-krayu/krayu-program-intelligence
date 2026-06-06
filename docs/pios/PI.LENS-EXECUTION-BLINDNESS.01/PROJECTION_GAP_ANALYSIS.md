# Execution Blindness — Projection Gap Analysis

Stream: PI.LENS-EXECUTION-BLINDNESS.01
Date: 2026-06-06
Classification: Projection analysis (no implementation)

---

## Definition

Execution Blindness = the condition where a system can fail while the organization believes it is healthy.

Three validated forms (BlueEdge):

1. **Boundary Blindness** — critical dependencies exist outside the software boundary (AF-003, AF-005)
2. **Silence Blindness** — failure produces absence of signal, not observable error (AF-003, AF-004)
3. **Coupling Blindness** — runtime coordination blast radius exceeds what static analysis predicts (AF-001, AF-004)

---

## PART 1: Current LENS Projection vs. AF Findings

### AF-001: Structural vs Operational Gravity Divergence [CRITICAL]

| LENS Projection Object | Can It Express AF-001? | Gap |
|---|---|---|
| Topology nodes | NO — nodes show domain grounding status (EXACT/STRONG/PARTIAL/SEMANTIC-ONLY), not gravity weight | No gravity magnitude indicator on nodes |
| Static edges | PARTIALLY — show EMITS/CALLS relationships but these are code relationships, not operational coordination | Cannot distinguish "code flows through here" from "operations depend on here" |
| Runtime edges | PARTIALLY — 6 runtime edge types ARE rendered with distinct colors/dashes when data exists | Edges exist but no gravity comparison — viewer cannot see that static and runtime gravity diverge |
| Pressure zone overlays | NO — show static pressure zones only, not runtime coordination concentration | No runtime pressure equivalent |
| 12 overlay modes | NO — none of the 12 modes expresses gravity divergence | No GRAVITY_DIVERGENCE overlay mode exists |
| Convergence web | NO — shows consequence co-presence, not gravity location comparison | Wrong abstraction — co-presence ≠ divergence |
| Cognition surfaces | PARTIALLY — surfaces include runtime-derived entries (RUNTIME_ prefix) | Runtime surfaces exist as list items but not as spatial/visual gravity comparison |

**Gap: LENS cannot show that static gravity and runtime gravity are in different places.** The topology has runtime edges, but there is no visual object that says "the code is heavy HERE, the system runs HERE, and those are different locations." AF-001 is the most commercially valuable finding and has zero dedicated LENS projection.

**Commercial test:** "I did not know my code's center of mass and my system's operational center of mass were in different places." — YES, passes.

---

### AF-002: Runtime Visibility Corrected Domain Coverage [HIGH]

| LENS Projection Object | Can It Express AF-002? | Gap |
|---|---|---|
| Topology nodes | PARTIALLY — nodes are colored by grounding status, but domain backing qualification (RUNTIME_BACKED vs SEMANTIC_ONLY) is not visually rendered | Qualified backing status not projected |
| Evidence state band | NO — shows grounding ratio from raw specimen, not qualified coverage | Still shows 4/17 backed, not 17/17 |
| Domain evidence coverage | NO — no LENS surface shows per-domain evidence layer coverage | Coverage is in THORR prompt data but not in any LENS visual |

**Gap: LENS still visually represents 13 domains as "semantic-only" (grey nodes) when they are actually runtime-backed.** The qualified registry exists but LENS topology doesn't consume it. The evidence state band still reports the raw grounding ratio.

**Commercial test:** "I thought 13 domains were unmeasured, but they were actually all connected through runtime evidence." — YES, passes. But less dramatic than AF-001.

---

### AF-003: MQTT Broker Operational Single Point of Failure [HIGH]

| LENS Projection Object | Can It Express AF-003? | Gap |
|---|---|---|
| Topology nodes | NO — MQTT broker is not a domain node. It is an external infrastructure component. | No representation for infrastructure outside the codebase boundary |
| Runtime edges | PARTIALLY — MQTT_TOPIC_FLOW edges exist if data is present | Edges show flow but not the broker as a single-point-of-failure node |
| Any LENS surface | NO | No "external dependency" or "boundary extension" visual concept exists |

**Gap: LENS has no way to show a component that is outside the codebase but is the highest-impact single point of failure.** The topology is a domain/cluster graph. `mqtt.blueedge.network:8883` is not a domain — it is infrastructure. LENS has no visual object for infrastructure dependencies.

**Commercial test:** "I did not know my entire edge-to-cloud telemetry depends on a single broker endpoint outside my codebase." — YES, strongly passes. This is the most surprising finding for any CTO.

---

### AF-004: Event Coordination Backbone Concentration [ELEVATED]

| LENS Projection Object | Can It Express AF-004? | Gap |
|---|---|---|
| Runtime edges | PARTIALLY — EVENT_FLOW edges are rendered | Edges show connections but not concentration ratio (13.3:1) |
| Structural spines panel | NO — shows static import hubs only | No runtime hub equivalent in the spines panel |
| COORDINATION_LOAD overlay | PARTIALLY — this overlay mode exists and could theoretically highlight event concentration | Currently derives from static consequences, not runtime event concentration |

**Gap: LENS can show event flow edges but cannot show that 53 event types converge through 4 handlers.** The concentration ratio — the thing that makes this dangerous — has no visual representation. A viewer sees edges but not the funnel.

**Commercial test:** "I did not know 53 event types all route through 4 handlers." — YES, passes for Chief Architect. Less impactful for Board.

---

### AF-005: Edge-Cloud Dependency Chain [ELEVATED]

| LENS Projection Object | Can It Express AF-005? | Gap |
|---|---|---|
| Any LENS surface | NO | Same gap as AF-003 — edge agents on separate hardware are outside the topology boundary |

**Gap: Same as AF-003.** LENS has no concept of system boundary extension. Edge agents on NXP i.MX 95 hardware running as systemd services cannot be represented in a domain/cluster topology.

**Commercial test:** "I did not know my system extends to hardware running on vehicles." — YES, passes.

---

## PART 2: Missing Projection Objects

### Missing Object 1: Gravity Divergence Map

**What it shows:** Two gravity indicators on the topology — one for code center of mass (static), one for operational center of mass (runtime). When they are in different locations, the divergence IS the visual finding.

**Data source:** Already exists. Static consequences concentrate at certain domains. Runtime consequences concentrate at others. AF-001 names both sets.

**Why it passes the commercial test:** A CTO opens LENS, sees two gravity markers in different parts of the topology, and immediately understands: "my refactoring plan targets the wrong place." No text needed. The visual IS the insight.

**Projection type:** First-class LENS concept. Not a subsection. This is the visual form of AF-001.

---

### Missing Object 2: Execution Blindness Surface

**What it shows:** Nodes/regions where failure is undetectable from inside the application boundary. Three classes:

1. **Boundary blind** — dependency is outside the codebase (AF-003 MQTT broker, AF-005 edge agents). Rendered as nodes OUTSIDE the topology boundary with connecting edges crossing the boundary line.
2. **Silence blind** — failure produces absence, not error (AF-003 broker failure → telemetry stops, no error signal). Rendered as a dim/fade overlay on affected domains — the domains that would go dark without knowing.
3. **Coupling blind** — runtime blast radius exceeds static prediction (AF-004 event backbone → 8 domains affected simultaneously). Rendered as blast radius circles that are larger than the static coupling suggests.

**Data source:** AF-003, AF-004, AF-005 provide the evidence. The mapping is:
- Boundary blind: runtime components with no codebase representation (MQTT broker, edge agents)
- Silence blind: failure modes where the application has no detection path
- Coupling blind: runtime consequences where `affected_domains` count exceeds the static consequence domain count

**Why it passes the commercial test:** "Show me what can fail while the organization thinks everything is fine." A CTO sees domains fading to indicate operational blindness. The visual answers the scariest question a board can ask.

**Projection type:** First-class LENS concept. This is the visual form of the Execution Blindness category.

---

### Missing Object 3: Boundary Expansion Map

**What it shows:** Where the operational system extends beyond the codebase. Today, the LENS topology ends at the codebase boundary. The operational system extends to MQTT brokers, edge hardware, external APIs, cloud services.

**Data source:** AF-003 (MQTT broker endpoint), AF-005 (edge agents on NXP hardware), API_BOUNDARY (external service endpoints).

**Rendering concept:** A dashed boundary line around the current topology representing the codebase. Outside that boundary: infrastructure nodes (broker, edge agents) connected by runtime edges that cross the boundary. The viewer sees the system is LARGER than the code.

**Why it passes the commercial test:** "I did not know my system extended beyond my codebase to hardware on vehicles." Every CTO who sees the system boundary extend to edge hardware will stop scrolling.

**Projection type:** First-class LENS concept. This is the visual form of AF-005 and the Boundary Blindness subcategory.

---

### Missing Object 4: Runtime Coordination Backbone

**What it shows:** The runtime dependency hubs — equivalent to the static structural spines panel but for runtime components. `fleet.gateway.ts` (12 streams, 16 consumers), `fleet-event-emitter.service.ts` (53 events, 4 handlers), MQTT broker.

**Data source:** Already exists in `formatRuntimeTopology` output. Per-component evidence with handler names, stream counts, consumer lists.

**Why it passes the commercial test:** Moderate. CTOs expect to see important files. This is useful but not surprising in the way that Gravity Divergence or Execution Blindness is.

**Projection type:** Panel addition (analogous to Structural Spines panel), not a first-class concept. It supports the other concepts but is not itself the insight.

---

### Missing Object 5: Operational Dependency Spine

**What it shows:** Business capability → operational dependency → runtime evidence chain.

**Data source:** Business capability labels already exist in the runtime topology (added in this session). The chain is: "Live fleet operations" → `fleet.gateway.ts` → 12 streams, 16 consumers.

**Why it passes the commercial test:** Moderate. Useful for operator/architect. Not a board visual.

**Projection type:** Detail panel, not first-class concept. Supports Execution Blindness Surface when drilling into a specific blind node.

---

## PART 3: EIR Narrative Gaps

### What the Board Should Remember (3 things)

1. **Operational gravity does not live where code gravity lives.** (AF-001)
   - Current EIR projection: NOT PRESENT. No EIR chapter presents gravity divergence.
   - Required: Standalone chapter or Executive Brief lead-in.

2. **The highest-impact failure mode was invisible to all prior analysis.** (AF-003)
   - Current EIR projection: PARTIALLY PRESENT in Chapter 8 ("What Traditional Analysis Cannot Discover") but as generic detection boundary rules, not as the concrete BlueEdge MQTT finding.
   - Required: Chapter 8 must cite AF-003 as the specific proven example, not generic rules.

3. **The operational system is larger than the codebase.** (AF-005)
   - Current EIR projection: NOT PRESENT. No EIR chapter addresses system boundary extension.
   - Required: Either a dedicated chapter or a section within the Executive Verdict.

### EIR Chapter Status vs. Execution Blindness

| EIR Chapter | Current State | Execution Blindness Gap |
|---|---|---|
| 1. Executive Brief | Static posture only | Missing: gravity divergence, execution blindness summary |
| 2. Program Overview | Static scope, CODE_CONNECTIVITY implied | Missing: SYSTEM_CONNECTIVITY scope, 6 layers |
| 3. Structural Topology | Static reinforcement flows | Missing: runtime reinforcement (event → WebSocket → frontend) |
| 4. PI Findings | Static conditions + runtime conditions listed | ADEQUATE — runtime conditions already flow here |
| 5. SW-Intel Assessment | Domain narratives, some runtime | PARTIALLY ADEQUATE — narratives include runtime domains |
| 6. Execution Risk Landscape | Static + runtime consequences | PARTIALLY ADEQUATE — runtime risks appear |
| 7. Operational Ceiling | Static governance gaps | Missing: runtime ceiling contributors (broker SPOF, event concentration) |
| 8. What Traditional Analysis Cannot Discover | Generic detection rules | WEAK — should cite AF-003/005 as proven examples, not generic statements |
| 9. Executive Verdict | Static scope, advisory confidence | Missing: SYSTEM_CONNECTIVITY scope, divergence finding |

### Missing EIR Chapter: Execution Blindness

A dedicated chapter that answers: "What can fail while the organization believes it is healthy?"

Content (all from existing AF findings):
- Three forms of blindness: boundary, silence, coupling
- Concrete evidence: MQTT broker (boundary), event backbone (coupling), WebSocket gateway (silence)
- The system is larger than the codebase (AF-005)
- The failure modes produce no internal signal (AF-003)

This chapter does not exist today. No existing chapter can absorb it without dilution. It is the chapter a board would remember.

---

## PART 4: Priority Ranking

| Projection Object | Commercial Impact | Data Exists? | Passes "I didn't know" Test? | Priority |
|---|---|---|---|---|
| Gravity Divergence Map | HIGH — visual AF-001 | YES | YES — "refactoring targets wrong place" | 1 |
| Execution Blindness Surface | HIGHEST — the category itself | YES | YES — "what fails while we think we're healthy" | 1 |
| Boundary Expansion Map | HIGH — system larger than code | YES | YES — "system extends to vehicle hardware" | 2 |
| EIR Execution Blindness Chapter | HIGH — board remembers this | YES | YES — "invisible failure modes exist" | 2 |
| Runtime Coordination Backbone panel | MODERATE — useful detail | YES | PARTIALLY — CTOs expect to see important files | 3 |
| Operational Dependency Spine | MODERATE — drill-down detail | YES | NO — useful but not surprising | 4 |

**Priority 1 items (Gravity Divergence + Execution Blindness Surface) are the ones that would make a CTO stop scrolling when opening LENS.**

---

## PART 5: What This Assessment Does NOT Do

- No implementation design
- No React components
- No SVG rendering specifications
- No compiler changes
- No new evidence layers
- No new cognition objects
- No roadmap or timeline

All cognition already exists. The gap is projection.
