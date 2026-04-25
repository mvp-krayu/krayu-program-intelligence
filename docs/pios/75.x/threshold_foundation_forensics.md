# Threshold Foundation Forensics
## 75.x Activation Authority Model and Strategy Classification

**Stream:** PI.THRESHOLD-FOUNDATION.FORENSICS.75X.01
**Layer:** 75.x — Condition Activation Authority
**Date:** 2026-04-25
**Branch:** feature/next
**Status:** FORENSICS_AND_DESIGN — no thresholds finalized; no conditions activated

---

## Purpose

This document establishes the governance foundation for Stream 75.x: the authority model that determines how static signal values may later become activated conditions, pressure indicators, and structural observations.

It answers the core question for each static signal: *what kind of activation authority is epistemically defensible, and what kind is not?*

This document does not finalize any threshold. It does not activate any condition. It prepares the methodological ground so that future contracts can safely calibrate, research, or empirically derive thresholds without drifting from a defensible authority model.

---

## Scope

**In scope:** SIG-002 (CKR-007), SIG-004 (CKR-009), PSIG-001..PSIG-006

**Explicitly out of scope:** SIG-001, SIG-003, SIG-005, SIG-006/CKR-011, SIG-007/ESI, SIG-008/RAG, PSIG-007, PSIG-008, runtime telemetry, delivery telemetry, DORA metrics, AI-derived scoring

---

## Governing Principles

1. CKR is construct authority — it defines what a signal is.
2. 40.x computes raw signal values from telemetry.
3. 75.x defines deterministic activation semantics — it governs when a value becomes a condition.
4. 75.x does not compute raw values. It operates only on values produced by 40.x.
5. Thresholds must be evidence-backed, explicitly provisional, or declared unresolved.
6. Grouping is not activation. Selector is not activation. A selected signal can remain non-activated.
7. A raw value is not a condition until an authorized activation rule exists for that signal.
8. No LLM judgment may serve as threshold authority at any layer.

---

## Authority Model

### Class 1 — External Benchmark Authority

A numeric threshold drawn from published, peer-reviewed, or broadly accepted software engineering research or industry standards. Examples:

- Henry-Kafura fan-in/fan-out complexity thresholds (1981)
- Martin's Stable Dependencies Principle (clean architecture coupling theory)
- Coupling Between Objects (CBO) thresholds from OO research (Chidamber & Kemerer 1994)
- Cohesion and coupling bounds from ISO/IEC 25010 quality models
- Graph theory connectivity results (theoretical bounds on cluster count, density)
- Architecture smell catalogues (God Object, Hub-Like Dependency — Palomba et al.)

**Governance requirement:** Each external benchmark claim must cite a specific source type and describe how the published metric maps to the PiOS signal formula. If the formula is not directly analogous, the adaptation must be documented and marked as ADAPTED_BENCHMARK, not DIRECT_BENCHMARK.

---

### Class 2 — Internal Empirical Authority

A threshold derived from observed distributions across client systems or across structural units (domains, components) within one or more PiOS runs. Examples:

- Percentile bands from N ≥ 3 client runs (e.g., flag signals in top decile across clients)
- Per-run domain distribution (e.g., flag the domain whose signal value deviates > 2× mean within the run)
- Baseline drift detection (e.g., flag values that increased > X% from a prior run for the same client)
- Intra-run outlier detection using run-relative statistics (e.g., Z-score, IQR)

**Governance requirement:** Internal calibration requires documented corpus composition (client count, industry, topology scale), corpus version, and calibration date. Single-client calibration is only valid as PROVISIONAL; multi-client calibration can be promoted with sufficient corpus size.

---

### Class 3 — Governance Authority

Conditions admitted through formal governance processes:

- CKR registration of a new condition construct (via authorized CKR contract)
- Condition model registration in 40.6 (`condition_output_set.md` expansion)
- Pressure-zone rule admission in 75.x (via authorized 75.x threshold contract)
- Focus-domain rule admission in 75.x (via authorized 75.x focus contract)

**Governance requirement:** All governance registrations must produce artifacts in governed paths and reference CKR IDs. No rule is admitted without a traceable artifact.

---

### Class 4 — Prohibited Authority

The following may NOT serve as threshold authority at any layer, for any signal, under any contract:

| Prohibited Source | Reason |
|------------------|--------|
| LLM judgment or LLM-suggested thresholds | Non-deterministic; not reproducible; not peer-reviewed |
| One-off consultant intuition | Not traceable; not reproducible |
| Thresholds borrowed from unrelated domains (e.g., financial risk, operations) without mapping | Category error; different model semantics |
| Narrative-first interpretation (LENS text claiming threshold behavior before activation) | Inverts the authority chain; LENS may not pre-define signal meaning |
| Downstream report claims (e.g., "the report says this is high risk") | Reports consume activations; they do not define them |
| Single data point calibration ("this one client had a ratio of 4.3, so > 4.0 is dangerous") | Insufficient statistical basis |
| Developer intuition without external evidence or corpus backing | Same as consultant intuition |

---

## Threshold Strategy Taxonomy

Six allowed strategies, from most to least externally grounded:

### FIXED_EXTERNAL_BENCHMARK
A published source provides a directly applicable or closely adapted numeric threshold for this signal formula or a directly analogous formula. The mapping from published metric to PiOS formula is documented and marked DIRECT or ADAPTED.

**Appropriate for:** Signals whose formulas closely match published coupling, cohesion, or graph density metrics.

---

### INTERNAL_PERCENTILE
No reliable external benchmark exists or applies. Threshold is derived from the observed statistical distribution of signal values across a corpus of N client runs. Threshold is expressed as a percentile (e.g., "top 15% of observed values across N clients is the activation band").

**Appropriate for:** Signals with system-scale sensitivity (absolute values depend heavily on topology size) where within-corpus normalization is required.

**Minimum corpus requirement:** N ≥ 3 independent client runs for PROVISIONAL calibration; N ≥ 10 for stable calibration.

---

### RUN_RELATIVE_OUTLIER
The signal formula is already normalized to the run's own statistics (e.g., ratio of max to mean). The signal value inherently represents a relative outlier indicator within the run. A threshold applied to the ratio value (e.g., ratio > 2.5) is self-calibrating to each run's topology scale without requiring external corpus.

**Appropriate for:** Signals expressed as concentration ratios or dispersion measures (max/mean, max/total, normalized counts).

**Governance note:** The threshold applied to the ratio still requires justification (e.g., statistical outlier reasoning — 2× mean corresponds to roughly a 2-σ outlier in many distributions). Rationale must be documented.

---

### COMPOSITE_ONLY
The signal is not suitable for individual threshold activation in its current form. It must be combined with one or more other signals via a defined aggregation rule before activation can be evaluated. A composite score or compound rule must be defined before this signal can activate a condition.

**Appropriate for:** Multi-dimensional signals (e.g., SIG-004 with four sub-ratios) or signals that are only meaningful in combination with structural location data.

**Blocker:** Composite rule must be defined via authorized contract before this signal can participate in any condition activation.

---

### REQUIRES_CORPUS_BASELINE
No external benchmark is available and the signal value is scale-sensitive (absolute values change significantly with topology size). A multi-client corpus is required before any threshold can be proposed. Cannot be activated until corpus baseline exists.

**Appropriate for:** Signals measuring absolute counts or ratios that depend heavily on system scale (number of domains, total nodes) where normalization is insufficient without cross-client calibration.

**Blocker:** Corpus baseline contract required before threshold can be proposed.

---

### NOT_THRESHOLD_READY
The signal definition, formula, or CKR authority is insufficient to support any activation strategy. Requires additional signal definition work, CKR registration, or fundamental reconsideration before threshold evaluation can begin.

**Appropriate for:** PROVISIONAL signals with unstable definitions, unresolved CKR mapping, or no clear pressure meaning.

---

## Signal-by-Signal Analysis

### SIG-002 / CKR-007 — Dependency Load

**Definition:** dep_load_ratio = dep_edge_count / ST-007 (dependency edges / total nodes)

**Analysis:**

The dependency load ratio measures the density of dependency-typed edges relative to the graph's node count. This is structurally analogous to the graph density concept from graph theory and to Coupling Between Objects (CBO) from Chidamber & Kemerer (1994). However, the PiOS formula uses dependency edge types specifically (OVERLAP_STRUCTURAL, pipeline, governance edges) rather than method-call or import coupling, which requires adaptation documentation if published thresholds are applied.

The signal produces a system-wide scalar. It does not natively produce per-domain or per-component values. To be useful for pressure-zone identification, it must be disaggregated to domain or component level.

**Threshold strategy:** REQUIRES_CORPUS_BASELINE (primary); FIXED_EXTERNAL_BENCHMARK (possible if CBO literature is adapted with documented formula mapping); RUN_RELATIVE_OUTLIER (possible for per-domain disaggregation if computed per domain)

**External benchmark availability:** CBO literature (Chidamber & Kemerer 1994, Basili et al. 1996) provides coupling thresholds for OO method coupling. Henry-Kafura (1981) addresses fan-in/fan-out at module level. Neither maps directly to the PiOS formula without adaptation. Adaptation is possible but must be documented as ADAPTED_BENCHMARK.

**Internal calibration required:** YES — system-level ratio is scale-sensitive; larger topologies may naturally have lower ratios regardless of coupling architecture quality.

**Pressure-zone suitability:** MEDIUM — system-level value does not directly identify a location; must be disaggregated per domain or supplemented with PSIG-001/002 for location specificity.

**Focus-domain suitability:** LOW (as system-wide scalar); MEDIUM if disaggregated per domain.

**Unresolved:** No PiOS corpus baseline exists. Per-domain disaggregation formula not yet defined. CBO adaptation mapping not documented.

---

### SIG-004 / CKR-009 — Structural Volatility

**Definition:** Four sub-dimensions — edge_to_node_ratio, containment_density_ratio, responsibility_distribution, module_surface_ratio

**Analysis:**

SIG-004 is a multi-dimensional signal. Its four sub-ratios capture different structural properties:
- `edge_to_node_ratio` = graph density measure (analogous to graph density from graph theory)
- `containment_density_ratio` = tree-structure saturation (CONTAINS edges / total nodes)
- `responsibility_distribution` = domain count relative to total nodes (organizational span)
- `module_surface_ratio` = CEU count relative to total nodes (module granularity)

Each sub-ratio potentially has distinct activation semantics. Activating a condition from SIG-004 requires either: (a) a defined aggregation rule combining the four sub-ratios into a composite volatility index, or (b) separate activation rules for each sub-dimension. Neither is currently defined.

The "volatility" concept implies a change-risk composite — but as a static signal, these ratios measure a structural state, not a rate of change. The name is inherited from CKR-009 which defines the construct authority.

**Threshold strategy:** COMPOSITE_ONLY — an aggregation rule must be defined before condition activation is possible; individual sub-dimension thresholds are unstable without defining which combination of deviations constitutes "high structural volatility."

**External benchmark availability:** Graph density (edge_to_node) has theoretical bounds (0 to N-1 for directed graphs). Architecture smell research (God Object, Hub-Like Dependency) addresses module surface ratios indirectly. No direct literature mapping exists for the four-dimensional PiOS formulation.

**Internal calibration required:** YES — all four sub-ratios are scale-dependent.

**Pressure-zone suitability:** MEDIUM — once a composite rule is defined, the resulting index can identify structural pressure; until then, raw sub-ratios are observational only.

**Focus-domain suitability:** LOW as raw multi-dimensional signal; MEDIUM once aggregation rule is defined.

**Unresolved:** Aggregation rule for four sub-dimensions not defined. "Volatility" in a static context needs reframe or CKR annotation. No published composite volatility index maps directly to these four ratios.

---

### PSIG-001 — Fan-In Concentration

**Definition:** fan_in_concentration = ST-030 / (total_edges / ST-007) = max_fan_in / mean_fan_in

**Analysis:**

The signal formula is a concentration ratio: max incoming edges to any node divided by the mean incoming edges across all nodes. This is a self-normalizing, run-relative outlier indicator. A value of 1.0 means the highest fan-in node is at the mean (no concentration). Values >> 1.0 indicate a bottleneck node.

Fan-in as a structural bottleneck predictor is well-supported in the software engineering literature. Henry and Kafura (1981) identified fan-in as a predictor of module complexity and defect density. Freeman (1977) demonstrated the relationship between graph centrality (which fan-in measures) and information flow problems. The "God Object" and "Hub-Like Dependency" architecture smells (Palomba et al., various) directly address high fan-in as a structural problem.

The concentration-ratio form (max/mean) is analytically stronger than a raw fan-in count because it normalizes across topology scale.

**Threshold strategy:** RUN_RELATIVE_OUTLIER (primary) — the ratio form is self-calibrating. A threshold of ratio > 2.0 (max fan-in is ≥ 2× mean) has statistical defensibility as an outlier indicator. A threshold > 3.0 or > 5.0 corresponds to progressively stronger outlier claims. FIXED_EXTERNAL_BENCHMARK (possible if Henry-Kafura or Palomba fan-in thresholds are adapted to the concentration-ratio form with documented mapping).

**External benchmark availability:** Henry-Kafura (1981), Eder et al. (1992), Palomba et al. on architecture smells — directly applicable to fan-in logic; adaptation needed for the concentration-ratio formula rather than raw count. ADAPTED_BENCHMARK status.

**Internal calibration required:** MINIMAL for the ratio form (self-normalizing); YES for the absolute threshold value (what ratio > X is calibrated to real-world defect risk).

**Pressure-zone suitability:** HIGH — fan-in concentration directly identifies a specific node as a structural bottleneck; that node's domain is the natural pressure-zone location.

**Focus-domain suitability:** HIGH — the domain containing the max-fan-in node is the highest-coupling-pressure focus candidate; PSIG-001 activation is a strong focus-domain signal when combined with structural domain attribution.

**Unresolved:** Domain attribution of the max fan-in node is not yet computed (requires 40.5 execution with node-to-domain resolution). Exact ratio threshold not yet calibrated. Fan-in/fan-out literature threshold adaptation mapping not yet documented.

---

### PSIG-002 — Fan-Out Propagation

**Definition:** fan_out_propagation = ST-031 / (total_edges / ST-007) = max_fan_out / mean_fan_out

**Analysis:**

Structurally identical to PSIG-001 but measuring outgoing edge concentration rather than incoming. The blast-radius interpretation: a node with high fan-out is the highest propagation risk — changes to it affect the most downstream dependents.

Henry-Kafura (1981) use both fan-in and fan-out jointly as complexity predictors. Many architecture smell catalogs cite high fan-out as a "Unstable Dependency" or "Shotgun Surgery" indicator. The same concentration-ratio self-normalizing form applies.

The second-client data suggests the same node has max fan-in = max fan-out = 13, which is architecturally notable (a node that is simultaneously the highest intake and highest propagation point is the structural hub of the system — a strong pressure-zone and focus-domain candidate).

**Threshold strategy:** RUN_RELATIVE_OUTLIER (primary) — same structure as PSIG-001; FIXED_EXTERNAL_BENCHMARK (ADAPTED) possible via Henry-Kafura fan-out literature.

**External benchmark availability:** Same literature as PSIG-001. Henry-Kafura, Palomba et al. ADAPTED_BENCHMARK status.

**Internal calibration required:** MINIMAL for ratio form; YES for threshold calibration.

**Pressure-zone suitability:** HIGH — identifies the highest blast-radius node; propagation pressure zone maps to this node's domain.

**Focus-domain suitability:** HIGH — complements PSIG-001; when the same node holds max fan-in AND max fan-out, that node's domain is the compound coupling+propagation pressure candidate.

**Unresolved:** Domain attribution of the max fan-out node not yet computed. Threshold calibration pending. Same node as PSIG-001 in second-client — this co-occurrence pattern needs a documented interpretation rule (compound signal or separate?).

---

### PSIG-003 — Cross-Domain Coupling Ratio

**Definition:** cross_domain_coupling_ratio = ST-032 / ST-010 = cross_domain_edge_count / total_edge_count

**Analysis:**

This ratio measures what fraction of all structural edges cross domain boundaries. It is a structural cohesion / coupling metric at the domain level.

From software architecture principles, domain/module coupling is extensively discussed. Martin's Stable Dependencies Principle and Clean Architecture advocate for minimal cross-module coupling. The metric directly operationalizes this architectural ideal. However, most literature discusses coupling qualitatively rather than providing specific numeric ratios.

The second-client value (0.032 = 3.2%) is low — which may indicate good domain isolation or may reflect that the binding model only captures OVERLAP_STRUCTURAL edges (not all logical coupling). This interpretation ambiguity must be documented.

An important edge case: if ST-032 = 0 (no cross-domain edges at all), fragmentation is complete — this is a degenerate case that warrants its own indicator, not a low-value activation. This interacts with PSIG-006.

**Threshold strategy:** REQUIRES_CORPUS_BASELINE (primary) — the ratio's meaning depends heavily on whether the current baseline is near zero (pathologically isolated) or near 1.0 (pathologically coupled); position in a cross-client distribution is needed. FIXED_EXTERNAL_BENCHMARK (ADAPTED, weak) — architecture principles suggest "lower is better" direction but no specific numeric thresholds appear in the literature for this formula.

**External benchmark availability:** Martin's Stable Dependencies Principle, Clean Architecture coupling guidance — directionally applicable ("lower coupling is better") but without numeric thresholds. No direct benchmark for the ratio form. DIRECTIONAL only.

**Internal calibration required:** YES — ratio is scale-insensitive (percentage) but baseline requires corpus context.

**Pressure-zone suitability:** HIGH for edges that DO exist (each OVERLAP_STRUCTURAL edge is a specific structural pressure point — a coordination obligation at that boundary); MEDIUM for the ratio as a system-level indicator.

**Focus-domain suitability:** HIGH for the specific domain that receives the most cross-domain edges (coupling hub) — this is a deterministic structural selection criterion; the coupling-hub domain is the strongest focus-domain candidate from this signal.

**Unresolved:** No numeric threshold from external literature. Degenerate case (ST-032 = 0) needs special handling rule. Binding model coverage limitation (OVERLAP_STRUCTURAL may not capture all cross-domain structural relationships).

---

### PSIG-004 — Responsibility Concentration

**Definition:** responsibility_concentration = ST-033 / (ST-034 / ST-009) = max_surfaces_per_CEU / mean_surfaces_per_CEU

**Analysis:**

The concentration ratio format (max / mean) makes this a self-normalizing run-relative outlier indicator. A value of 1.0 = all CEUs have equal responsibility (no concentration). Higher values indicate one CEU dominates.

This is analogous to the Gini coefficient concept from economics applied to responsibility distribution. Statistical outlier theory supports threshold reasoning: a value ≥ 2.0 means the most loaded CEU has ≥ 2× the mean load (a 2-σ-class outlier in a symmetric distribution); ≥ 3.0 is a stronger outlier.

The "God Class" / "God Object" architecture smell is the closest literature analog — a component that "does too much" relative to peers. This is well-documented in architecture smell research (Palomba et al. 2018, Lippert & Roock 2006).

**Threshold strategy:** RUN_RELATIVE_OUTLIER (primary) — the concentration ratio is self-normalizing; threshold directly applicable. FIXED_EXTERNAL_BENCHMARK (ADAPTED) via God Object / God Class literature — the "too much responsibility" concept is well-evidenced even if the surface-count formula requires adaptation.

**External benchmark availability:** God Object / God Class smell research (Palomba et al., various); LCOM (Lack of Cohesion of Methods) literature; Lippert & Roock architecture smell taxonomy. ADAPTED_BENCHMARK status.

**Internal calibration required:** MINIMAL for ratio form; YES for exact threshold calibration to real-world outcomes.

**Pressure-zone suitability:** HIGH — the CEU with max responsibility concentration is the highest-priority responsibility pressure zone; domain inherits zone designation from its highest-responsibility CEU.

**Focus-domain suitability:** HIGHEST among all signals — responsibility concentration directly identifies the domain as overloaded relative to peers, which is the strongest deterministic focus-domain selection criterion available from static evidence alone.

**Unresolved:** Surface ownership as a proxy for "responsibility" may not fully capture all responsibility dimensions (e.g., depth of functionality). CEU-level identification needs domain attribution mapping. Exact threshold calibration pending.

---

### PSIG-005 — Interface Surface Area

**Definition (system-level):** interface_surface_ratio = ST-034 / ST-006 = total_surfaces / total_domains
**Companion (per-domain concentration):** max_surface_domain_ratio = max_surfaces_per_domain / interface_surface_ratio

**Analysis:**

The system-level ratio (total surfaces / total domains) is scale-sensitive: a 5-domain system naturally has different values than a 20-domain system regardless of architecture quality. The absolute value is not threshold-ready without corpus calibration.

The per-domain concentration companion (max_surfaces_per_domain / mean) is a RUN_RELATIVE_OUTLIER measure (same form as PSIG-004) and is more immediately tractable.

The "interface surface" concept relates to Martin's Interface Segregation Principle — more surfaces per component/domain increases the coordination exposure and change sensitivity. However, surfaces are not interfaces in the strict ISP sense; adaptation is required.

**Threshold strategy:** COMPOSITE_ONLY (system-level ratio) — requires either corpus baseline or per-domain decomposition before activation; RUN_RELATIVE_OUTLIER (per-domain concentration companion, once that companion is formally defined as a sub-metric or separate signal).

**External benchmark availability:** Martin's ISP (Interface Segregation Principle) — directional only; no numeric threshold for surface-per-domain ratio. Halstead/McCabe complexity metrics address module size but not surface distribution. DIRECTIONAL only.

**Internal calibration required:** YES for system-level ratio; MINIMAL for per-domain concentration companion.

**Pressure-zone suitability:** MEDIUM — surface density alone indicates exposure but not pressure; meaningful when combined with PSIG-003 (high surfaces + high cross-domain coupling = surface-exposure pressure zone).

**Focus-domain suitability:** MEDIUM — per-domain concentration companion can identify the domain with disproportionate surface exposure; combined with PSIG-003 coupling data this becomes a stronger focus-domain input.

**Unresolved:** Per-domain concentration companion needs formal registration as a sub-metric or derived signal. System-level ratio requires corpus baseline. ISP adaptation mapping not documented.

---

### PSIG-006 — Structural Fragmentation Index

**Definition:** fragmentation_index = (ST-035 - 1) / ST-007 = (cluster_count - 1) / total_nodes

**Analysis:**

The formula is grounded in graph theory: ST-035 counts connected components. The baseline (fully connected) = 1 component → fragmentation_index = 0. Every isolated component beyond the first adds to the index.

The theoretical minimum is 0 (fully connected graph). A fragmentation_index > 0 is an objectively notable structural state — it means some nodes are structurally unreachable from others. This is a condition that can be stated without numeric calibration: *any fragmentation is structurally notable*.

However, different fragmentation levels have different implications:
- Low fragmentation (e.g., 0.05 — 2-3 isolated nodes in a 40-node graph): minor blind spots
- Moderate (0.20 — 9 isolated nodes in 45): significant coverage gaps in coupling signals
- High (> 0.50): the system is structurally disjointed

Graph theory provides theoretical bounds. Architecture literature on cohesion (a single connected system = maximum cohesion) supports the direction. However, numeric thresholds for "acceptable" fragmentation in program topology graphs are not established in the literature.

Second-client: fragmentation_index = 0.20 (10 clusters / 45 nodes, with 9 singletons).

**Threshold strategy:** FIXED_EXTERNAL_BENCHMARK (ADAPTED, partial) — graph theory gives a natural zero-baseline (0 = fully connected = ideal); any value > 0 is objectively a fragmentation event. The degenerate case "fragmentation_index > 0" is defensible as a soft indicator without numeric calibration. For a quantitative threshold beyond "any fragmentation," REQUIRES_CORPUS_BASELINE.

**External benchmark availability:** Graph theory (connected components) — provides natural zero-baseline and direction. Software cohesion literature (coupling/cohesion principles) — directional support for lower fragmentation being better. No numeric threshold found for this specific formula in architecture literature. DIRECTIONAL + THEORETICAL_BASELINE.

**Internal calibration required:** YES for quantitative thresholds above the zero-baseline; NO for the binary "fragmentation exists" indicator.

**Pressure-zone suitability:** LOW for active pressure zone (fragmented nodes have no coupling/propagation signals — they are *absent* from the coupling pressure landscape). HIGH as structural blind-spot indicator — fragmented domains are the ones where no static pressure signal can be produced.

**Focus-domain suitability:** LOW — isolated/fragmented nodes are poor focus-domain candidates precisely because they have no structural coupling evidence; the focus domain should be selected from the *coupled* component of the topology.

**Unresolved:** No numeric threshold beyond the zero-baseline for quantitative activation. The relationship between fragmentation and PSIG-003 (when fragmentation is high but PSIG-003 is nonzero, the few cross-domain edges carry disproportionate coupling pressure) needs a formal compound rule.

---

## Unresolved Evidence

| Item | Nature | Resolution Path |
|------|--------|-----------------|
| PiOS corpus baseline | No multi-client corpus exists; several signals require corpus for threshold calibration | Issue corpus collection contract when ≥ 3 client runs exist |
| CBO formula adaptation | CBO (Chidamber & Kemerer 1994) threshold adaptation for PiOS SIG-002 formula requires documented mapping | Authorized adaptation documentation contract |
| Henry-Kafura / fan-in adaptation | Fan-in/fan-out thresholds in literature use raw counts; PiOS PSIG-001/002 use concentration ratios; adaptation required | Benchmark mapping documentation contract |
| SIG-004 aggregation rule | Four sub-dimensions with no defined composite rule; cannot activate until rule is defined | Authorized 75.x aggregation rule contract |
| PSIG-005 per-domain companion | Per-domain concentration companion not formally registered as a sub-metric | Signal definition sub-contract or PSIG-005b registration |
| PSIG-003 degenerate case | ST-032 = 0 (zero cross-domain edges) needs special handling distinct from "low coupling" | Rule definition contract |
| Domain attribution of max fan-in/fan-out nodes | PSIG-001/002 identify a max node but do not yet attribute it to a domain | 40.5 execution with node-to-domain resolution |
| PSIG-006 quantitative threshold | Binary "fragmentation exists" indicator is defensible; numeric threshold for severity requires corpus | Corpus calibration contract |

---

## Governance Implications

1. **No threshold finalization until authority is established.** Each strategy classification represents a *category* of defensible authority, not a finalized threshold. Contracts must establish the threshold with specific evidence before 40.6 condition activation is possible.

2. **CKR alignment required for condition constructs.** When a threshold activation rule is defined for a PSIG signal, the resulting condition construct must be registered in CKR (as a new CKR entry via authorized contract) before 40.6 can formally activate it.

3. **COMPOSITE_ONLY signals block their downstream chain.** SIG-004 and PSIG-005 (system-level) cannot contribute to any condition, pressure zone, or focus domain designation until their aggregation rules are defined.

4. **RUN_RELATIVE_OUTLIER thresholds are the fastest path to activation.** PSIG-001, PSIG-002, and PSIG-004 are all concentration ratios — they are self-calibrating to each run's topology. A threshold contract for these three signals can proceed without corpus or external benchmark research.

5. **PSIG-006 fragmentation is an enabling signal, not a pressure signal.** It maps the *absence* of coupling evidence rather than the presence of pressure. It enables structural coverage assessment rather than pressure-zone designation.

6. **Focus-domain selection must not hardcode domain IDs.** The architecture smells identified in STEP 14E-F (DOMAIN-10 hardcoded, CG-01/CG-02 unresolved) must be resolved by a governed focus-domain rule defined in 75.x, not by constant substitution.
