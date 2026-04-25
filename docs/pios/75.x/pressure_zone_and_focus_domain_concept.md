# Pressure Zone and Focus Domain — Conceptual Model
## Eligibility, Rules, and Governance Principles

**Stream:** PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01
**Layer:** 75.x — Condition Activation Authority
**Date:** 2026-04-25
**Branch:** feature/next
**Status:** CONCEPTUAL MODEL — no pressure zones raised; no focus domains selected

---

## Purpose

This document defines what a pressure zone is, what a focus domain is, what makes a structural location eligible for either designation, and what rules govern selection. It resolves the open items CG-01 (focus domain selection) and CG-02 (pressure zone designation) identified in STEP 14E-F and STEP 14E-G at the conceptual level — without selecting any specific domain for any specific client.

---

## Governing Invariants

1. A pressure zone is not raised by a raw signal value.
2. A pressure zone is raised by one or more activated conditions tied to a structural location.
3. A focus domain is not hardcoded. It is derived by a deterministic rule from activated condition outputs.
4. No pressure zone or focus domain designation may use LLM judgment.
5. No pressure zone or focus domain designation may reference hardcoded domain identifiers.
6. Selector and signal groups filter signals — they do not activate conditions or designate zones.
7. The signal layer (40.5) produces values. The condition layer (40.6 / 75.x) activates. The pressure layer (this stream) designates zones. These layers must not be collapsed.

---

## Pressure Zone — Definition

A **pressure zone** is a formally designated structural location (domain or component entity) where one or more activated conditions indicate concentrated structural stress.

### Required Components

All four must be present before a pressure zone can be raised:

| Component | Description | Provided By |
|-----------|-------------|-------------|
| Structural location | A domain (DOM-XX) or component entity (CEU-XX) with a valid, grounded identity in `canonical_topology.json` | 40.3 / binding_envelope |
| Activated condition(s) | One or more 40.6 conditions that have been activated for this structural location (not just a raw signal value) | 40.6 / 75.x threshold contract |
| Evidence trail | Traceable chain from activated condition → signal value → telemetry → source artifact | 40.4 → 40.5 → 40.6 |
| Deterministic designation rule | A formally defined rule specifying which condition activations at which structural locations constitute a pressure zone of each class | 75.x contract |

### What Does NOT Constitute a Pressure Zone

| Not a Pressure Zone | Reason |
|--------------------|--------|
| A raw signal value that is "high" | No activation rule → no condition → no zone |
| A signal group that includes a structural domain | Groups are selector constructs, not activation constructs |
| A domain selected by LLM reasoning ("this domain looks busy") | Prohibited authority |
| A hardcoded domain ID ("DOMAIN-10 is always the pressure zone") | Prohibited — must be derived deterministically |
| A domain with no structural evidence (fragmented / isolated) | No signal inputs → no activation possible → cannot be a pressure zone |
| A signal value without domain attribution | Location is required; a system-wide scalar is not a zone |

---

## Pressure Zone Classes

### Class 1 — Coupling Pressure Zone

**Definition:** A structural location where incoming dependency concentration has activated the coupling pressure condition.

**Required activation:** PSIG-001 (Fan-In Concentration) condition activated AND the max-fan-in node is attributed to a specific domain or CEU.

**Zone location:** The domain containing the max-fan-in node.

**Indicative second-client candidate (not designated):** The domain containing the node with fan-in = 13 (identity to be resolved during 40.5 execution). Provisionally indicated by PSIG-001 = 9.43.

---

### Class 2 — Propagation Pressure Zone

**Definition:** A structural location where outgoing dependency concentration has activated the propagation pressure condition.

**Required activation:** PSIG-002 (Fan-Out Propagation) condition activated AND the max-fan-out node is attributed to a specific domain or CEU.

**Zone location:** The domain containing the max-fan-out node.

**Compound note:** When the same node holds max fan-in AND max fan-out, its domain is eligible for *both* Class 1 and Class 2 designation, producing a compound coupling+propagation pressure zone (see Class 6).

---

### Class 3 — Responsibility Pressure Zone

**Definition:** A structural location where surface ownership concentration has activated the responsibility pressure condition.

**Required activation:** PSIG-004 (Responsibility Concentration) condition activated on a specific CEU.

**Zone location:** The CEU with max responsibility surface concentration, and by extension its parent domain.

**Indicative second-client candidate (not designated):** CEU-09 / DOM-04 (frontend_isolated) — PSIG-004 indicative value = 4.33. Not a designated zone until condition is activated.

---

### Class 4 — Surface Exposure Pressure Zone

**Definition:** A structural location where both interface surface density and cross-domain coupling have activated jointly.

**Required activation:** PSIG-005 companion (per-domain concentration) condition activated AND PSIG-003 condition activated on the same domain.

**Zone location:** The domain with both disproportionate surface count AND incoming OVERLAP_STRUCTURAL edges.

**Compound requirement:** Neither PSIG-005 alone nor PSIG-003 alone constitutes a surface-exposure pressure zone — both must be activated on the same domain. Single-signal activation would produce Class 1 / Class 2 or Class 5 zone, not Class 4.

---

### Class 5 — Coordination Pressure Zone

**Definition:** A structural location designated as the coupling hub based on cross-domain edge receipt concentration.

**Required activation:** PSIG-003 (Cross-Domain Coupling Ratio) condition activated AND the domain receiving the most OVERLAP_STRUCTURAL incoming edges is identified.

**Zone location:** The domain that receives the most incoming OVERLAP_STRUCTURAL edges.

**Indicative second-client candidate (not designated):** DOM-05 / platform_monorepo — receives both OVERLAP_STRUCTURAL edges (from CEU-08/DOM-03 and CEU-09/DOM-04). This is the coupling-hub domain.

---

### Class 6 — Compound Structural Pressure Zone

**Definition:** A structural location where conditions from multiple pressure families have activated. Compound zones are the highest-priority pressure zones and the primary focus-domain selection input.

**Required activation:** ≥ 2 conditions from different pressure families activated on the same structural location.

**Example compound patterns:**
- Class 1 + Class 2 (coupling + propagation): same domain holds max fan-in AND max fan-out
- Class 3 + Class 1 (responsibility + coupling): same domain has max-responsibility CEU AND max-fan-in node
- Class 3 + Class 5 (responsibility + coordination): same domain has max responsibility AND is the cross-domain coupling hub

**Zone location:** The domain where the compound activation occurs.

---

## Focus Domain — Definition

A **focus domain** is a single architectural domain formally selected as the highest-priority structural investigation target for a given client/run.

### Required Components

All four must be present before a focus domain can be selected:

| Component | Description | Provided By |
|-----------|-------------|-------------|
| Domain identity | A domain with a valid, grounded identity in `canonical_topology.json`; must be in the canonical topology of the specific client run | 40.3 / binding_envelope |
| Activated pressure conditions | One or more pressure conditions activated for the candidate domain | 40.6 / 75.x threshold contract |
| Aggregation and ranking rule | A deterministic rule that produces a ranked list of focus-domain candidates from activated condition outputs; the rule must be defined via contract | 75.x focus contract |
| Evidence trail | Full traceability from focus-domain designation → activated conditions → signal values → telemetry → source artifact | 40.4 → 40.5 → 40.6 → 75.x |

### What Does NOT Constitute a Valid Focus Domain Selection

| Not Valid | Reason |
|-----------|--------|
| Hardcoded domain ID (e.g., `DOMAIN-10`, `DOM-05`, `DOM-04`) | Prohibited; must be derived from signal evidence |
| LLM selection ("this domain looks like the most important one") | Prohibited authority |
| Selection based on raw signal values without activated conditions | Activation layer must be traversed first |
| Selection of an isolated/fragmented domain with no signal inputs | No evidence basis |
| BlueEdge focus domain rule applied to non-BlueEdge client | Portability violation |
| Selector group configuration treated as focus-domain selection | Selector filters signals; it does not designate structural locations |

---

## Allowed Future Focus Domain Strategies

These are candidate strategies. None is currently an active rule. Each requires a formal 75.x focus-domain contract to be authorized.

### Strategy 1 — Highest Activated Pressure Count

**Rule principle:** The domain with the most distinct activated pressure conditions is selected.

**Tie-breaking:** If two domains have equal condition counts, use compound zone class as tiebreaker (Class 6 > Class 1..5); then alphabetical domain ID for determinism.

**Strengths:** Simple, transparent, resistant to weighting bias.
**Weaknesses:** Treats all condition types as equal regardless of severity.

**Indicative result for second-client (not a designation):** Would favor DOM-04 (Class 3 — responsibility) or DOM-05 (Class 5 — coordination) depending on which conditions activate first. Compound zone (if any) would override.

---

### Strategy 2 — Highest Weighted Pressure Score

**Rule principle:** Each condition class is assigned a weight. The domain with the highest weighted sum of activated conditions is selected.

**Weight assignment:** Requires an authorized 75.x weighting contract. Weights must be evidence-backed (not LLM-assigned).

**Strengths:** Allows severity differentiation between pressure types.
**Weaknesses:** Introduces weighting subjectivity unless weights are formally evidence-backed.

---

### Strategy 3 — Highest Cross-Domain Coupling Role

**Rule principle:** The domain that appears as the target of the most OVERLAP_STRUCTURAL incoming edges (coupling hub) is selected as the focus domain.

**Deterministic rule:** Count incoming OVERLAP_STRUCTURAL edges per domain; select the domain with the highest count. Ties broken by domain ID (alphabetical).

**Strengths:** Fully deterministic from structural data; no condition activation required; can be computed from ST-032 + edge attribution data.
**Weaknesses:** Does not account for internal structural pressure within the coupling hub; a domain can be a coupling hub without being internally overloaded.

**Indicative result for second-client (not a designation):** DOM-05 (platform_monorepo) receives 2 of 2 OVERLAP_STRUCTURAL edges. Would be selected under this strategy.

---

### Strategy 4 — Highest Responsibility Concentration

**Rule principle:** The domain whose CEUs have the highest responsibility concentration (PSIG-004 activation) is selected.

**Deterministic rule:** Select the domain of the CEU with ST-033 (max responsibility surface). Derived from PSIG-004 activation.

**Strengths:** Directly identifies the most overloaded architectural unit; PSIG-004 is self-normalizing and RUN_RELATIVE_OUTLIER — the most tractable signal for activation.
**Weaknesses:** Does not account for cross-domain coupling pressure; a domain can be overloaded but isolated.

**Indicative result for second-client (not a designation):** DOM-04 (frontend_isolated) via CEU-09 (13/30 surfaces = 4.33× mean). Would be selected under this strategy.

---

### Strategy 5 — Compound-Pressure Dominance

**Rule principle:** If any domain has activations in ≥ 2 pressure families (Class 6 compound zone), it is selected. If no compound zone exists, fall back to Strategy 1 (highest count).

**Strengths:** Prioritizes the highest-evidence structural pressure location; compound zones are the most defensible focus-domain candidates.
**Weaknesses:** If no compound zone exists, falls back to Strategy 1 and inherits its weaknesses.

---

## Relation to Signal Selector and Signal Groups

The signal selector and signal groups (defined in `docs/pios/40.5/signal_selector_specification.md`) operate at a different layer than pressure zones and focus domains:

| Layer | Role | Output |
|-------|------|--------|
| Signal selector | Determines which eligible signals are attempted for a run | Selector output record: computed vs. blocked signal IDs |
| Signal groups | Organize signals by pressure family for selector configuration | Named groups of signal IDs |
| 40.5 computation | Produces raw signal values from telemetry | Signal output set with values |
| 75.x threshold rules | Activates conditions when signal values exceed authorized thresholds | Activated condition set with location attribution |
| Pressure zone rules | Raises zones from activated conditions at structural locations | Pressure zone designation with structural identity |
| Focus domain rules | Selects the highest-priority domain from pressure zone evidence | Focus domain ID with evidence chain |

**Critical invariant:** The `pressure_zone_default` selector group includes PSIG-001..006 — this is a *computation target*, not a *pressure zone designation*. Running signals in the `pressure_zone_default` group produces signal values. It does not produce a pressure zone. Zones require the threshold → condition → zone chain to be traversed.

---

## Relation to 40.6 Condition Activation

40.6 is the condition activation layer (CKR-027: Condition and Diagnosis Activation Layer). Its role is to evaluate signal values against threshold rules and produce activated/not-activated condition outputs.

The current state of 40.6 for second-client:
- No threshold rules exist for PSIG-001..006 (BLOCKED_THRESHOLD_RULE_MISSING)
- No threshold rules exist for SIG-002 (CKR-007) or SIG-004 (CKR-009) as delivery-domain conditions

Before 40.6 can activate any condition for the static signal expansion set:
1. Threshold rules must be defined in 75.x (via authorized threshold calibration contract)
2. Threshold rules must be registered in 40.6 condition model
3. 40.6 must be executed for the client/run

The 75.x threshold foundation (this stream) is a prerequisite for 40.6 condition activation. No shortcut exists: raw signal values cannot bypass this chain.

---

## Relation to LENS Observation Layer

LENS (the observation and reporting layer) consumes pressure zone designations as structural observations. It does not produce them.

The chain is:
```
Raw signal values (40.5)
        ↓
Condition activation (40.6 / 75.x threshold rules)
        ↓
Pressure zone designation (75.x zone rules)
        ↓
Focus domain selection (75.x focus rules)
        ↓
LENS narrative / observation rendering (Phase 5)
```

**Prohibited shortcuts:**
- LENS narrative must not pre-define what constitutes "high pressure" without an upstream condition
- A report section titled "pressure zone" must not be populated with raw signal values
- The "Pressure zones not yet evaluated" disclosure (currently implemented for second-client) is the correct behavior when the threshold → condition → zone chain has not been executed

---

## Prohibited Shortcuts — Summary

| Shortcut | Violation Type |
|---------|---------------|
| Hardcoding focus domain ID | Portability violation; governance violation |
| LLM assigns a zone | Prohibited authority |
| Raw signal value triggers LENS observation | Bypasses activation chain |
| Selector group = pressure zone | Layer collapse |
| Choosing focus domain based on developer intuition | Prohibited authority |
| Applying BlueEdge zone rules to non-BlueEdge client | Portability violation |
| Defining threshold in a code constant without governed document | Governance violation (code is not an authority document) |

---

## Open Items: CG-01 and CG-02 Resolution Path

**CG-01 — Focus Domain Selection (from STEP 14E-F):**
- Current state: no canonical rule; DOMAIN-10 hardcoded in code (BlueEdge-specific)
- Resolution path via this foundation: One of Strategies 1..5 above must be formally authorized via a 75.x focus-domain contract; the authorized strategy becomes the canonical focus-domain selection rule; code constants must then be replaced with the parametric rule

**CG-02 — Pressure Zone Designation (from STEP 14E-G):**
- Current state: no canonical rule; pressure_concentration zone type requires FOCUS_DOMAIN_T2 == "DOMAIN-10" hardcoded
- Resolution path via this foundation: The Class 1..6 pressure zone definitions above replace the hardcoded constant; a domain receives the `pressure_concentration` zone type when its conditions activate a compound pressure zone designation via the authorized rule

Both CG-01 and CG-02 are now formally described at the conceptual level. They remain unresolved at the execution level pending authorized 75.x calibration and rule-definition contracts.
