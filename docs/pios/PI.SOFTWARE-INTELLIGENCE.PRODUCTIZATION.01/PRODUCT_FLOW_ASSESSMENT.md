# SW-Intel Product Flow Assessment

## PI.SOFTWARE-INTELLIGENCE.PRODUCTIZATION.01

Stream: CONTINUATION | Classification: G2 | Branch: feature/runtime-demo

---

## 1. Surface Inventory — What Renders on BlueEdge

### Active Surfaces (10 of 12)

| # | Surface Name | Severity | Evidence Items | Domains | Topology Overlay |
|---|-------------|----------|---------------|---------|-----------------|
| 1 | Delivery Fragility | HIGH | 19 | 5 | DELIVERY_FRAGILITY — origin/corridor/receiver paths |
| 2 | Structural Fragility | HIGH | 9 | 3 | FRAGILITY_HOTSPOT — hotspot domain emphasis |
| 3 | Integration Exposure | ELEVATED | 7 | 4 | INTEGRATION_CORRIDOR — bridge/pass-through/ISIG |
| 4 | Operational Topology Posture | ELEVATED | 5 | 0 | TOPOLOGY_POSTURE — grounding gradient |
| 5 | Qualification Exposure | ELEVATED | 3 | 0 | QUALIFICATION_POSTURE — governed/ungrounded |
| 6 | Boundary Alignment | ELEVATED | 4 | 3 | BOUNDARY_DIVERGENCE — cross-boundary emphasis |
| 7 | Reinforcement Flows | MODERATE | 3 | 2 | REINFORCEMENT_TOPOLOGY — flow paths |
| 8 | Convergence Patterns | MODERATE | 4 | 3 | CONVERGENCE_TOPOLOGY — multi-condition domains |
| 9 | Propagation Risk | LOW | 3 | 3 | PROPAGATION_CHAIN — origin→receiver paths |
| 10 | Absence Profile | LOW | 6 | 0 | (none — meta-surface) |

### Null Surfaces (2 of 12)

| Surface | Why Null | Data Required |
|---------|---------|---------------|
| Coordination Saturation | No hub/authority nodes in centrality data | structural_enrichment.centrality with hub-classified spines |
| Structural Coupling | No coupling_inertia clusters | structural_enrichment.coupling_inertia |

These are legitimate nulls — BlueEdge's structural enrichment doesn't produce hub classification or coupling clusters. The materializers correctly return `null` when evidence is absent.

---

## 2. Per-Persona Projection Analysis

### DENSE (EXECUTIVE_DENSE) — Primary Operator View

**What renders:** All 10 active surfaces, sorted by severity (HIGH → LOW). Each card shows: icon, name, severity badge, operational summary, consequence statement, affected domains, evidence count, expandable structural detail.

**Product assessment:**

- **Cognitive flow is strong.** The severity sort creates a natural reading order — the operator sees the most urgent structural conditions first. HIGH surfaces (Delivery Fragility, Structural Fragility) dominate the top. LOW surfaces (Propagation Risk, Absence Profile) settle to the bottom.

- **Topology interaction is the differentiator.** Clicking any surface activates a topology overlay — the SVG structural map transforms into a cognition canvas showing exactly which domains are affected and how they relate. This is where SW-Intel stops being a list and becomes operational intelligence.

- **Expandable detail provides forensic depth.** Each surface's `▾ structural detail` reveals the constituents: fragility hotspot files, divergent modules, propagation chains, convergence domains. This is the right information at the right depth.

**Issues identified:**

| Issue | Impact | Severity |
|-------|--------|----------|
| D-01: 10 surfaces is a long scroll | Operator must scroll to reach lower-severity surfaces | MODERATE |
| D-02: No grouping by concern | Structural surfaces (Fragility, Coupling, Boundary) are interleaved with operational surfaces (Delivery, Coordination) by severity sort | MODERATE |
| D-03: Absence Profile renders as a "surface" but it's a meta-assessment | It's a health summary of what's NOT firing, not a risk surface | LOW |
| D-04: Reinforcement Flows and Convergence Patterns lack topology overlays on BlueEdge | The overlay code exists but produces minimal emphasis because domain matching against registry is sparse | LOW |

### OPERATOR (OPERATOR_DENSE) — Forensic Verification View

**What renders:** All 10 active surfaces (identical to DENSE), plus: verification badge (VERIFIED/PARTIAL/FAILED), VERIFY action button.

**Product assessment:**

- **Verification integration is correct.** The VERIFY button invokes the investigation protocol against the active surface. The badge shows verification state.

- **Surface set is appropriate.** Operators need full visibility. No filtering needed.

**Issues identified:**

| Issue | Impact | Severity |
|-------|--------|----------|
| O-01: No surface-level verification targeting | VERIFY operates on the module as a whole, not on individual surfaces — operator can't verify a single surface | LOW |

### BOARDROOM — Executive Decision View

**What renders:** ConsequencePosture strip (posture label, severity, scope, primary/secondary consequences), then top 3 elevated surfaces showing name + severity + operational summary. Footer shows "+N surfaces" count.

**Product assessment:**

- **ConsequencePosture is the right executive surface.** The posture strip compresses 10 surfaces into a decision-relevant signal: severity, scope (LOCAL/REGIONAL/SYSTEMIC), and the primary consequence with confidence level. This is what an executive needs.

- **Surface selection is correct.** Showing only HIGH/ELEVATED surfaces (top 3) respects executive attention. The "+7 surfaces" footer signals depth without demanding it.

- **No topology interaction.** BOARDROOM doesn't offer surface click → topology overlay. Correct for the audience.

**Issues identified:**

| Issue | Impact | Severity |
|-------|--------|----------|
| B-01: Surface names are technical | "Delivery Fragility", "Integration Exposure" are structural language, not executive language | ELEVATED |
| B-02: No consequence grouping | The 3 surfaces are listed independently — no narrative connecting them | MODERATE |
| B-03: Operational summary is DENSE-grade language | The same `operational_summary` text renders in BOARDROOM — it's not audience-calibrated | ELEVATED |

### BALANCED (EXECUTIVE_BALANCED) — CTO Operational Understanding

**What renders:** Top 4 surfaces by severity, each showing: name, severity, operational summary, consequence statement. No expandable detail. No topology interaction.

**Product assessment:**

- **4-surface limit is correct for the audience.** CTO/VP Eng wants to understand the top structural dynamics, not audit all 10.

- **Consequence statement adds value.** The consequence text explains WHY the surface matters operationally, which is what this audience needs.

**Issues identified:**

| Issue | Impact | Severity |
|-------|--------|----------|
| BA-01: Same operational_summary as DENSE | Text is not calibrated for CTO audience — it reads like operator prose | ELEVATED |
| BA-02: No causal narrative between surfaces | Surfaces 1-4 are listed independently — no "because X, therefore Y" flow | MODERATE |
| BA-03: No qualification context in the narrative | The qualification strip (RICHNESS/GOVERNANCE/RECONCILIATION) is visible but not connected to the surface narrative | LOW |

---

## 3. UX Naming Assessment

### Surface Names — Current vs. Recommended

| Current Name | Issue | Recommended | Rationale |
|-------------|-------|-------------|-----------|
| Delivery Fragility | Acceptable for DENSE/OPERATOR | — | Structural language matches audience |
| Structural Fragility | Acceptable for DENSE/OPERATOR | — | |
| Integration Exposure | Acceptable | — | |
| Operational Topology Posture | Too long, redundant "Operational" | **Topology Posture** | Already within an operational context |
| Qualification Exposure | Acceptable | — | |
| Boundary Alignment | Acceptable | — | |
| Reinforcement Flows | Acceptable | — | |
| Convergence Patterns | Acceptable | — | |
| Propagation Risk | Acceptable | — | |
| Absence Profile | Misleading — sounds like a risk surface | **Condition Health** or **Coverage Profile** | This is a meta-surface showing what's NOT firing; "Absence" implies something is wrong |
| Coordination Saturation | (null on BlueEdge) | — | |
| Structural Coupling | (null on BlueEdge) | — | |

### Surface Icons — Assessment

Icons are distinctive and meaningful. The mapping:
- ⧖ Delivery Fragility (hourglass — time pressure)
- ⚡ Structural Fragility (lightning — breakage risk)
- ⇌ Integration Exposure (bidirectional — data flow)
- ◉ Topology Posture (target — structural center)
- ⊘ Qualification Exposure (null sign — gaps)
- ⊿ Boundary Alignment (triangle — divergence)
- ⇄ Reinforcement Flows (arrows — relationships)
- ⊕ Convergence Patterns (plus-circle — accumulation)
- ⟿ Propagation Risk (wave arrow — chain reaction)
- ◇ Absence Profile (diamond — meta)

**Assessment:** Icons are coherent. No changes needed.

---

## 4. Ordering Analysis

### Current: Severity Sort (HIGH → LOW)

Produces this order on BlueEdge:
1. Delivery Fragility (HIGH)
2. Structural Fragility (HIGH)
3. Integration Exposure (ELEVATED)
4. Topology Posture (ELEVATED)
5. Qualification Exposure (ELEVATED)
6. Boundary Alignment (ELEVATED)
7. Reinforcement Flows (MODERATE)
8. Convergence Patterns (MODERATE)
9. Propagation Risk (LOW)
10. Absence Profile (LOW)

### Alternative: Thematic Grouping

```
STRUCTURAL HEALTH
  Structural Fragility      ⚡ HIGH
  Boundary Alignment        ⊿ ELEVATED
  Structural Coupling       ⊛ (null)

OPERATIONAL DYNAMICS
  Delivery Fragility        ⧖ HIGH
  Coordination Saturation   ⬡ (null)
  Propagation Risk          ⟿ LOW

INTEGRATION ARCHITECTURE
  Integration Exposure      ⇌ ELEVATED
  Topology Posture          ◉ ELEVATED

CROSS-SIGNAL SYNTHESIS
  Reinforcement Flows       ⇄ MODERATE
  Convergence Patterns      ⊕ MODERATE

GOVERNANCE
  Qualification Exposure    ⊘ ELEVATED

META
  Absence Profile           ◇ LOW
```

### Recommendation

**Keep severity sort for DENSE/OPERATOR.** The operator's primary question is "what's most urgent?" — severity sort answers this directly.

**Consider thematic grouping for BALANCED.** The CTO's question is "what's structurally happening?" — thematic groups tell a coherent story.

**BOARDROOM is already filtered to top 3 elevated.** No ordering change needed.

---

## 5. Demo Sequence — BlueEdge Walkthrough

### Recommended Demo Flow

**Opening: BOARDROOM (30s)**
Start in BOARDROOM. The consequence posture strip immediately communicates: "This system has structural conditions requiring attention." The top 3 elevated surfaces give the executive the headline. This establishes the WHY.

**Descent: BALANCED (60s)**
Switch to BALANCED. The top 4 surfaces now explain the dynamics — the CTO sees the operational consequences. The consequence text connects structural findings to operational impact. This establishes the WHAT.

**Exploration: DENSE (90s)**
Switch to DENSE with SW-INTEL active. All 10 surfaces are visible. Click Delivery Fragility — the topology transforms to show origin/corridor/receiver propagation paths. Click Structural Fragility — the topology highlights fragility hotspots. Click Integration Exposure — bridge/connector nodes light up. This establishes the HOW.

**Depth: DENSE expand (30s)**
Expand Structural Fragility's `▾ structural detail` to show hotspot files, peak fragility percentages, low cohesion modules. This proves the intelligence is computed from structural evidence, not generated.

**Verification: OPERATOR (30s)**
Switch to OPERATOR. Click VERIFY to invoke the investigation protocol. The verification badge confirms or challenges the surface findings. This establishes TRUST.

**Total: ~4 minutes.** Descending cognitive complexity: posture → dynamics → exploration → evidence → verification.

---

## 6. Topology Overlay Assessment

### Overlay Coverage

| Surface | Overlay Mode | Effectiveness |
|---------|-------------|---------------|
| Delivery Fragility | origin/corridor/receiver paths + pressure zone emphasis | STRONG — clear propagation visualization |
| Structural Fragility | hotspot domain emphasis | MODERATE — domains light up but individual files aren't visible in topology |
| Integration Exposure | bridge/connector/ISIG/pass-through | STRONG — integration architecture visible |
| Topology Posture | grounding gradient (backed/weak/semantic-only) | STRONG — immediately shows where trust lives |
| Qualification Exposure | governed/ungrounded gradient | MODERATE — similar to Topology Posture |
| Boundary Alignment | cross-boundary emphasis | MODERATE — shows which domains diverge |
| Reinforcement Flows | flow path rendering | WEAK on BlueEdge — domain matching sparse |
| Convergence Patterns | multi-condition domain emphasis | WEAK on BlueEdge — same matching limitation |
| Propagation Risk | origin→receiver chain | MODERATE — chain visualization works |
| Absence Profile | (none) | N/A — meta-surface, no topology mapping |

### Key Finding

The topology overlay is the core product differentiator. When it works well (Delivery Fragility, Integration Exposure, Topology Posture), the experience is genuinely differentiated — the operator sees structural intelligence expressed through the topology, not just described in text. When it's weak (Reinforcement Flows, Convergence Patterns), the surface feels like a text card rather than an intelligence instrument.

---

## 7. Per-Persona SW-Intel Navigation

### DENSE Navigation Flow

```
[SW-INTEL toggle ON]
    ↓
[Peak Severity Strip: "HIGH · 10 cognition surfaces · 4 requiring attention"]
    ↓
[Surface Cards — severity ordered, click to activate topology overlay]
    ↓ (surface click)
[Topology transforms → domains emphasized/dimmed, corridors drawn, legend shown]
    ↓ (expand)
[Structural detail: constituents, files, percentages, chains]
    ↓
[Evidence Footer: "56 evidence items across 10 surfaces · structurally derived"]
```

**Assessment:** This flow works. The operator starts with the headline (peak severity), explores surfaces (click), inspects evidence (expand), and is grounded by the evidence footer.

### BOARDROOM Navigation Flow

```
[Consequence Posture Strip: severity + scope + primary/secondary consequences]
    ↓
[Top 3 elevated surfaces: name + severity + operational summary]
    ↓
["+7 surfaces" count — signals depth without showing it]
```

**Assessment:** Correct compression for the audience. No click interaction needed.

### BALANCED Navigation Flow

```
[Top 4 surfaces: name + severity + operational summary + consequence]
```

**Assessment:** Functional but flat. The 4 surfaces are listed independently with no narrative thread. This is the weakest persona experience — it's not BOARDROOM-compressed enough to be decisive and not DENSE-detailed enough to be investigative. It needs a narrative arc.

### OPERATOR Navigation Flow

```
[Same as DENSE + VERIFY button + verification badge]
```

**Assessment:** Correct extension of DENSE with forensic verification capability.

---

## 8. Product Issues Register

### Critical (ELEVATED)

| ID | Issue | Persona | Recommendation |
|----|-------|---------|---------------|
| B-01 | Surface names are technical in BOARDROOM context | BOARDROOM | Add audience-calibrated labels to PRE — same surface, different name per persona |
| B-03 | operational_summary is DENSE-grade language in BOARDROOM | BOARDROOM | PRE Zone B candidate — executive narrative generation per surface |
| BA-01 | Same operational_summary in BALANCED as DENSE | BALANCED | PRE Zone B candidate — CTO-calibrated explanation |

### Moderate

| ID | Issue | Persona | Recommendation |
|----|-------|---------|---------------|
| D-01 | 10 surfaces is a long scroll in DENSE | DENSE | Consider tier-based visual grouping: HIGH/ELEVATED surfaces get full cards, MODERATE/LOW get compact strips |
| D-02 | No concern-based grouping | DENSE | Evaluate thematic sections (Structural / Operational / Synthesis / Governance) |
| B-02 | No narrative connecting top 3 surfaces | BOARDROOM | PRE Zone B — "These three conditions combine to create..." |
| BA-02 | No causal narrative between surfaces | BALANCED | PRE Zone B — inter-surface causality explanation |

### Low

| ID | Issue | Persona | Recommendation |
|----|-------|---------|---------------|
| D-03 | Absence Profile reads like a risk surface | ALL | Rename to "Condition Health" or "Coverage Profile" |
| D-04 | Reinforcement/Convergence overlays are weak | DENSE | Improve domain matching in topology overlay derivation |
| O-01 | No per-surface verification targeting | OPERATOR | Future: allow VERIFY to target a specific surface |
| BA-03 | Qualification context not connected to narrative | BALANCED | Wire qualification strip into narrative flow |

---

## 9. Architecture Observations

### What Works

1. **CIP → PICR → PICP → PRE chain is operational.** All 12 materializers produce correct, deterministic output. The adapter consumes PICP cleanly.

2. **Topology integration is the moat.** The surface → topology overlay → domain emphasis flow is genuinely differentiated. No other product turns structural analysis into navigable visual cognition this way.

3. **Persona compression is structurally sound.** BOARDROOM (top 3), BALANCED (top 4), DENSE (all), OPERATOR (all + verify) is the right filtering model.

4. **Evidence-first discipline holds.** Every surface has `evidence_density`, `trace_sources`, and `affected_domains`. The evidence footer reinforces this. The disclosure contract is intact.

### What's Missing

1. **Audience-calibrated language.** The same `operational_summary` text appears in all personas. PRE should project different language per audience. This is the primary PRE Zone B use case.

2. **Cross-surface narrative.** Surfaces are independent cards. There's no synthesis: "Delivery Fragility and Structural Fragility share 3 affected domains — this is not coincidental." The reinforcement/convergence surfaces capture this data but it's not surfaced as narrative.

3. **Progressive disclosure in DENSE.** 10 cards of equal visual weight is too flat. HIGH/ELEVATED surfaces should be visually dominant; MODERATE/LOW should be visually quieter.

---

## 10. Readiness for THORR / EIR Consumption

The PICP is consumer-ready:

- `getSwIntelSurface(picp, surfaceId)` returns the same payload for any consumer
- Each surface has: `surface_id`, `surface_name`, `severity`, `operational_summary`, `consequence`, `evidence_density`, `affected_domains`, `constituents`, `trace_sources`
- The schema is stable — 10 active surfaces, 2 legitimate nulls, all deterministic

THORR/EIR consumption requires PRE Zone B (audience-calibrated narrative) and PRE Zone A (chapter→object mapping). The PICP itself needs no changes.

---

## 11. Summary Verdict

The 12 SW-Intel surfaces constitute a coherent operator intelligence module. The PICR extraction is architecturally correct. The DENSE/OPERATOR experience is strong. The BOARDROOM/BALANCED experience needs PRE Zone B narrative projection — this is expected and validates the consumer-generic architecture design.

**Strongest asset:** Topology overlay interaction. This is the moat.

**Primary gap:** Audience-calibrated language per persona (PRE Zone B work, not PICR work).

**Demo-ready:** Yes, for DENSE walkthrough. BOARDROOM/BALANCED are functional but will improve with PRE narrative projection.
