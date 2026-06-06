# Program Intelligence Capability Delta Assessment

Stream: PI.RUNTIME-CONNECTIVITY-CLOSURE.01
Date: 2026-06-06
Classification: Strategic capability review (no implementation)

---

## 1. THORR Capability Delta

### OLD THORR (pre-AF-001)

Could answer:
- Where is the structural coupling concentrated?
- Which files are dependency hubs?
- What is the fragility distribution?
- Where do pressure zones converge?
- What is the posture and qualifier class?

Could not answer:
- Where does the system actually run?
- What coordinates operations at runtime?
- What can fail without being detected?
- Does the code structure reflect operational reality?
- What exists outside the codebase boundary?

Evidence basis: 1 layer (STATIC_IMPORT). Scope: CODE_CONNECTIVITY. 4/17 domains with evidence.

### CURRENT THORR (post-AF-001)

New question families:

| Question | What Changed |
|---|---|
| Where does operational gravity reside? | THORR derives from AF-001 and runtime topology — names fleet.gateway.ts, fleet-event-emitter.service.ts, mqtt.blueedge.network |
| What can fail while the system appears healthy? | Three blindness types identified with business capability framing and failure implications |
| Does our refactoring plan target the right place? | Gravity divergence proves static and operational centers of mass differ |
| What is invisible to static code analysis? | AF-003/004/005 name concrete invisible dependencies — not generic rules |
| How large is the operational system? | System boundary extends to edge hardware on vehicles via MQTT |
| What is the runtime coordination backbone? | Event bus (53 events, 4 handlers), WebSocket gateway (12 streams), MQTT broker |

Evidence basis: 6 layers (SYSTEM_CONNECTIVITY). Scope: full operational topology. 17/17 domains with evidence.

**Delta classification: NEW CAPABILITY CLASS.** Old THORR answered about code. Current THORR answers about the system.

---

## 2. LENS Capability Delta

### OLD LENS (pre-AF-001)

Could show:
- Semantic domain topology with static edges
- Pressure zone overlays
- 12 SW-Intel cognition surfaces (all static-derived)
- Fragility hotspots, constriction points
- Convergence web
- Structural spines panel

Could not show:
- Where operational gravity differs from code gravity
- What is invisible to the organization
- What exists outside the codebase
- Runtime coordination hubs

### CURRENT LENS (post-AF-001)

New visual surfaces:

| Surface | What It Shows |
|---|---|
| Execution Blindness modal | Three blindness types with runtime evidence, affected domains, business capability, failure implications |
| Gravity Divergence modal | Static-only domains, runtime-only domains, shared domains — the divergence IS the visual |
| Runtime edges on topology | EVENT_FLOW, MQTT_TOPIC_FLOW, WEBSOCKET_FLOW edges with distinct color/dash |
| Runtime dependency hubs | fleet.gateway.ts, fleet-event-emitter.service.ts as runtime-equivalent structural spines |
| Qualified domain backing | Nodes show runtime-backed, system-backed, static-backed instead of raw semantic-only |

**Delta classification: NEW PROJECTION CLASS.** Old LENS projected code structure. Current LENS projects operational reality alongside code structure. The two new modals (Execution Blindness, Gravity Divergence) have no predecessor — they project concepts that did not exist before.

---

## 3. EIR Capability Delta

### OLD EIR (pre-AF-001)

Story: "Here is the system and here are its issues."

9 chapters:
1. Executive Brief (posture + severity)
2. Program Overview (scope + consequence count)
3. Structural Topology (reinforcement flows)
4. PI Findings (condition list)
5. SW-Intel Assessment (domain narratives)
6. Risk Landscape (consequence inventory)
7. Operational Ceiling (governance gaps)
8. What Traditional Analysis Cannot Discover (generic rules)
9. Verdict (posture restated)

Board memory after reading: "The code has structural issues, mainly coupling."

### CURRENT EIR (post-AF-001)

Story: "Here is where the organization is blind."

8 chapters in EXECUTION_BLINDNESS mode:
1. Executive Brief (Execution Blindness Detected + three discoveries)
2. What the Organization Believes (the visible, incomplete picture)
3. What Actually Governs Execution (AF-001 divergence + Gravity Divergence SVG)
4. What Cannot Currently Be Seen (Blindness Triad — Boundary, Silence, Coupling)
5. Software Intelligence (structural pressures that remain valid)
6. Why Traditional Analysis Missed It (AF-002/003/004/005 as concrete proof)
7. Executive Consequences (failure scenario cards)
8. Verdict (executive memo with three remembered discoveries)

Board memory after reading: "We are looking at the wrong place. Our most dangerous failure is invisible. The system is larger than the code."

**Delta classification: NEW NARRATIVE CLASS.** Old EIR told a findings story. Current EIR tells a discovery story. The narrative arc (confidence → surprise → evidence → implication → verdict) has no predecessor. The dual-mode architecture (structural vs. blindness) is constitutionally new.

---

## 4. Commercial Capability Delta

### OLD PI Commercial Position

"Governed alternative to static code analysis."

Value proposition: Better methodology, deterministic, governed — but answering the same question as SonarQube, CodeScene, dependency analyzers. The question was: "What does the code look like?"

Competitive differentiation: Governance model (deterministic, no AI in cognition formation). Important but not category-defining.

### CURRENT PI Commercial Position

"Operational intelligence that discovers what static analysis cannot see."

Value proposition: PI answers a question no competitor can answer: "Where can your system fail without the organization knowing?" The customer gets something they cannot get from any other tool.

| Capability | Before | After |
|---|---|---|
| Evidence layers | 1 (imports) | 6 (imports + events + MQTT + WebSocket + API + DI) |
| Domain coverage | 4/17 | 17/17 |
| Verdict scope | CODE_CONNECTIVITY | SYSTEM_CONNECTIVITY |
| Risk categories | Structural coupling | Structural coupling + Execution Blindness |
| System boundary | Codebase | Codebase + infrastructure + edge hardware |
| Executive deliverable | "Issues in your code" | "Where you are operationally blind" |
| Buying trigger | Engineering housekeeping | Operational risk governance |

**The buying trigger changed.** Before: engineering teams bought PI to understand code structure. After: executive teams buy PI to understand operational exposure. Different buyer. Different budget. Different conversation.

---

## 5. Category Impact Assessment

### The Question

Have AF-001 through AF-005 merely improved Program Intelligence, or have they crossed into a materially different capability class?

### The Evidence

| Dimension | Improvement | New Capability | Verdict |
|---|---|---|---|
| THORR questions | Existing questions answered better | 6 new question families that were impossible before | NEW |
| LENS surfaces | Existing overlays refined | 2 entirely new visual concepts (Blindness, Divergence) | NEW |
| EIR narrative | Existing chapters reorganized | New narrative arc, new chapter types, dual-mode architecture | NEW |
| Evidence scope | More data | Fundamentally different measurement dimension (runtime coordination) | NEW |
| Commercial position | Better methodology | Different buyer, different budget, different conversation | NEW |
| Executive memory | "Issues in your code" | "Where you are blind" | NEW |

### The Test

A customer who saw the original BlueEdge report and the current Execution Blindness EIR would consider them **fundamentally different intelligence products** (Option B), not better versions of the same thing.

The original report tells engineering: "Your DTO index file has 111 inbound imports."

The current report tells the board: "Your platform can report healthy while its operational backbone is failing."

These are not the same product at different quality levels. They answer different questions for different audiences at different altitudes.

### The Answer

**AF-001 through AF-005 changed Program Intelligence itself.**

Not incrementally. Categorically.

The change is not "better static analysis." The change is: PI now sees operational coordination, discovers execution blindness, and communicates executive intelligence that no static analysis tool can produce.

The old category was: governed code structure analysis.
The new category is: governed operational intelligence.

The evidence for this claim is not theoretical. It is the BlueEdge Chief Architect answer that names runtime components invisible to every static tool, the LENS modal that visualizes three forms of organizational blindness, and the EIR that tells a board "you are looking at the wrong place."

The moat doubled. Before: "AI inside bounded enterprise authority workflows." After: "multi-layer operational intelligence inside bounded enterprise authority workflows." The combination — governed, deterministic, multi-layer, operational — is the defensible position. No competitor has it because no competitor measures runtime coordination topology as a governed structural dimension.
