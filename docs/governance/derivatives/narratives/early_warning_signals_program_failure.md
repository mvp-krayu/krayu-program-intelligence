# Early Warning Signals of Program Failure — Narrative Expansion

Stream: I.6 — Hardening Batch 03 (PROVISIONAL PROMOTION — SET B)
Phase: Canonical Gap Closure — Derivative Narrative
Entity: early_warning_signals
Narrative Depth: standard (level 2)
Authority: nodes/early_warning_signals.md | execution_stability_index.md | risk_acceleration_gradient.md | construct_positioning_map.md
Date: 2026-03-31

---

## Early Warning Signals of Program Failure

### Definition

The class of observable signal patterns, derived from ESI and RAG, that indicate structural deterioration in a program before that deterioration becomes visible in operational activity metrics. Early warning signals are not predictions — they are governed interpretations of signal state and signal change that precede operational failure within a measurable lead time.

### What It Is

The detection layer of Program Intelligence. Where ESI measures current structural stability and RAG measures the direction and rate of risk change, early warning signals are the named pattern configurations of those constructs that indicate a program is on a deteriorating trajectory.

Three categories of early warning signal are defined:

**ESI Decline Patterns:**
Configurations of ESI values across consecutive measurement windows that indicate sustained structural deterioration rather than transient noise. A single ESI reading provides a state snapshot; a sequence of ESI readings across windows provides a trend. Early warning patterns are trend-class signals, not point-class signals.

Named ESI decline patterns:
- *Sustained decline:* ESI declining across two or more consecutive measurement windows — indicates structural trend rather than single-window variation
- *Band crossing:* ESI crossing from a higher stability band into a lower band (Compounding Stress to Critical Exposure is the governance-critical threshold crossing) — indicates the program has entered an elevated structural risk zone
- *Declining velocity:* the rate of ESI decline increasing across consecutive windows — indicates structural integrity is weakening at an accelerating rate, compounding the severity of the condition

**RAG Acceleration Patterns:**
Configurations of RAG values across consecutive measurement windows that indicate risk is not merely present but growing. RAG is a dynamics construct — its early warning signal is not its absolute value but its direction and rate of change.

Named RAG acceleration patterns:
- *Positive onset:* RAG crossing from neutral or negative into positive territory — the point at which risk is beginning to accumulate net-new across the program rather than resolving
- *Sustained positive:* RAG remaining in positive territory across two or more consecutive windows — indicates the program has lost self-correcting capacity and risk accumulation has become structural
- *Acceleration-stability divergence:* RAG in positive acceleration while ESI remains in an acceptable band — the leading indicator configuration that precedes ESI decline; the ESI consequence typically follows within 2–4 measurement windows

**Dimension-Level Patterns:**
Each of the five ESI dimensions (schedule_stability, cost_stability, delivery_predictability, flow_compression, risk_acceleration_gradient) produces its own signal trajectory. Dimension-level patterns often precede composite ESI decline — monitoring individual dimensions provides additional detection lead time over monitoring the composite score alone.

Named dimension-level patterns (by dimension):
- Schedule Stability: milestone drift widening across consecutive windows; critical path variance increasing; buffer consumption rate accelerating
- Cost Stability: variance accumulation rate increasing; untracked scope expanding; budget consumption velocity diverging from earned value trajectory
- Delivery Predictability: cycle time dispersion increasing across the program; forecast reliability declining across consecutive periods; scope churn rate rising
- Flow Compression: work-in-progress variance increasing; bottleneck formation detectable through cycle time lengthening in specific stages; release cadence lengthening without corresponding scope reduction
- Risk Acceleration Gradient (dimension-level): risk injection rate exceeding resolution rate per window; cross-boundary propagation initiating; escalation proportion rising

### What It Is Not

- Not a separate signal system. Early warning signals are interpreted configurations of ESI and RAG outputs — they do not produce new signals or introduce new telemetry inputs. The detection model is a pattern-recognition layer applied to canonical construct outputs, not a new computation layer.
- Not a threshold alert system. Early warning signals are structural patterns observed across measurement windows — not single-window threshold crossings. Threshold alerts operate at the operational layer (ESI below X triggers alert); early warning signals operate at the pattern layer (ESI declining across N consecutive windows indicates structural trend).
- Not a prediction mechanism. Early warning signals describe observable structural conditions that have historically preceded operational failure. They do not assert that operational failure will occur, when it will occur, or what the severity will be. The observation is structural; the outcome is not governed.
- Not a substitute for ESI and RAG. Early warning signals are a detection interpretation layer applied to ESI and RAG outputs — they require ESI and RAG as their necessary precondition. A program without ESI and RAG computation cannot produce early warning signals.
- Not a complete governance response system. Detection of an early warning pattern identifies that structural deterioration is underway. The governance response (intervention type, scope, priority) is outside the scope of the detection layer.

### Role in Program Intelligence

Early warning signals translate the analytical construct outputs (ESI state, RAG dynamics) into the pattern vocabulary that leadership uses for governance decisions. Their role is to make ESI and RAG actionable — to convert "ESI is 62 and RAG is +14" into "this program is showing a sustained ESI decline pattern with concurrent RAG acceleration onset, which warrants governance attention."

The structural position:

```
Signal Infrastructure → Signal Layer
    ↓ consumed by
ESI (state) + RAG (dynamics)
    ↓ interpreted through
Early Warning Signal Patterns
    ↓ consumed by
Leadership Governance Response
```

Without the early warning signal layer, ESI and RAG are analytical construct definitions — precise measurements with no named interpretation of what their patterns mean for governance. The detection layer provides the named pattern vocabulary that connects measurement to governance action.

### Relationship to Signals (Input Layer)

Early warning signal patterns are derived from the outputs of the analytical constructs (ESI, RAG), which are themselves derived from the signal layer (Structural Pressure, Delivery Divergence, Risk Propagation). The detection layer is two steps above the signal formation layer in the consumption chain.

This means early warning pattern detection inherits the full telemetry binding and derivation governance of the upstream layers. An early warning pattern is only as reliable as the ESI and RAG values that produce it, which are only as reliable as the signal inputs that feed those constructs.

The PARTIAL mode condition (where ESI operates on fewer than five defined PES signals due to telemetry gaps, per Stream 40.16) propagates to the early warning detection layer: patterns derived from PARTIAL-mode ESI carry the same PARTIAL flag.

### Relationship to ESI / RAG (Derivation Dependency)

Early warning signal detection is a direct application of ESI and RAG construct outputs — not an independent computation.

**ESI dependency:** ESI provides the state sequence from which decline patterns are identified. Multi-window ESI values are required to identify trend patterns (sustained decline, velocity change). A minimum of two consecutive ESI values is required for trend detection; three or more windows are required for velocity pattern classification.

**RAG dependency:** RAG provides the direction and rate data from which acceleration patterns are identified. Positive onset detection requires at least two consecutive RAG windows (one neutral/negative, one positive). Sustained acceleration detection requires at least three consecutive positive RAG values to distinguish trend from transient.

**Combined patterns:** The acceleration-stability divergence pattern (RAG accelerating while ESI is still acceptable) is the highest-priority combined pattern in the detection model. It requires both ESI and RAG outputs across at least two windows and is only detectable when both constructs are computed simultaneously over the same program.

### Detection Model

Three detection pattern classes, ordered by structural priority:

**Class 1 — Leading Indicator (highest governance priority):**
RAG acceleration-stability divergence. Detected when RAG is in positive territory across 2+ consecutive windows while ESI remains above the Compounding Stress band. This configuration identifies programs on a deteriorating trajectory before ESI registers the deterioration. Governance response is warranted at Class 1 detection regardless of current ESI state.

**Class 2 — Active Deterioration:**
ESI sustained decline or ESI band crossing into Compounding Stress or Critical Exposure, with or without concurrent RAG acceleration. Detected when ESI declines across 2+ consecutive windows, or when ESI crosses below 70 or below 55. Governance response is warranted at Class 2. If concurrent RAG acceleration is present, Class 1 and Class 2 conditions co-exist — the combined configuration has the highest structural risk profile.

**Class 3 — Dimension-Level Stress:**
One or more individual ESI dimensions showing deterioration patterns while the composite ESI score remains in an acceptable band. Detected through dimension-level signal trajectory analysis. Class 3 provides the earliest available lead time — dimension stress often precedes composite ESI decline by 1–3 windows. Class 3 detection does not independently warrant the same governance response as Class 1 or 2, but indicates that Class 2 conditions are forming.

### Claim Boundary

Early warning signal claims are bounded to:

- The identification of named structural deterioration patterns from ESI and RAG outputs
- The pattern-class vocabulary (Class 1/2/3) as a governance prioritization reference
- The lead-time observation that structural patterns precede operational failure within measured windows — stated as a governed observation, not a prediction

Early warning signal claims must not:

- Assert that a detected pattern will result in program failure — pattern detection is a structural observation, not an outcome prediction
- Extend claim scope beyond ESI and RAG outputs — no signals outside the canonical analytical construct chain may be cited as early warning signals
- Assert lead-time precision beyond what the derivation model supports — "2–4 measurement windows" is an observed range, not a guaranteed advance notice
- Position the detection layer as a replacement for governance judgment — patterns indicate structural conditions; governance decisions in response to those conditions are outside the claim boundary

Mandatory framing: all early warning signal claims must reference the ESI and RAG derivation chain as their authority basis. No detection claim may stand independently of the underlying analytical construct outputs.

### Canonical Source

Authority container status: established. The early_warning_signals entity is a Phase 1 Category A Routed Derivative Entity per nodes/early_warning_signals.md. The detection patterns are derived directly from the ESI and RAG canonical narratives and the Stream 40.16 derivation specifications.

Sources:
- nodes/early_warning_signals.md — entity classification, relationships, boundaries
- docs/governance/derivatives/narratives/execution_stability_index.md — ESI construct definition; five dimensions; state-measurement function
- docs/governance/derivatives/narratives/risk_acceleration_gradient.md — RAG construct definition; dynamics measurement; temporal window requirements
- docs/pios/40.16/esi_derivation_specification.md — ESI component definitions; PARTIAL mode rules
- docs/pios/40.16/rag_derivation_specification.md — RAG component definitions; minimum window requirements
- Authority codes: CKR-014 | CKR-015 | CAT-00
