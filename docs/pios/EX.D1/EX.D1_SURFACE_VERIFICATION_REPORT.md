DEMO SURFACE VERIFICATION REPORT

stream: EX.D1
date: 2026-04-04
status: COMPLETE
artifact_mode: PRODUCE
verification_method: STATIC — adapter invocation + component code inspection (server not running)
baseline_reference: EX.1 / ex1-compressed-baseline-v1 (commit 4ff215f)

---

§1. SCOPE

Surfaces verified:
- ENTRY / LANDING       — LandingGaugeStrip (42.6 overview adapter)
- EXECUTIVE PANEL       — ExecutivePanel (42.4 query adapter)
- SIGNAL GAUGES         — SignalGaugeCard (42.6 metrics)
- EVIDENCE PANEL        — EvidencePanel (42.4 signals.evidence)
- NAVIGATION            — NavigationPanel (42.4 navigation)
- TEMPLATE RENDERER     — TemplateRenderer (42.4 template_section)
- TOPOLOGY              — TopologyPanel (42.7 topology adapter)
- DEBUG                 — EX.2 debug adapter (pios_debug_adapter.py)

Query probed: GQ-003 (blast radius / instability intent)

---

§2. SURFACE RESULTS

Surface                 Status    Adapter         Notes
─────────────────────────────────────────────────────────────────────────
ENTRY / LANDING         STABLE    42.6            metrics[] with 4 entries returned;
                                                  component reads data.metrics (line 149 LandingGaugeStrip.js)
                                                  4 signals: SIG-003 (0.682), SIG-004 (1.273),
                                                  SIG-005 (0.875), SIG-002 (7)
                                                  all extraction_status=ok; value_source declared

EXECUTIVE PANEL         STABLE    42.4            query_id, query_text, intent_type,
                                                  aggregate_confidence=MODERATE present at query level
                                                  GQ-003 → INSTABILITY intent

SIGNAL GAUGES           STABLE    42.6            4 metrics; fill_pct, confidence, context all present
                                                  controlled unavailable state active for null values
                                                  SIG-002: value_source=static_extraction, pios_condition_tier=BLOCKED
                                                  SIG-003/SIG-004: pios_emission_state=COMPLETE
                                                  SIG-005: pios_emission_state=PARTIAL

EVIDENCE PANEL          STABLE    42.4            2 signals for GQ-003 (SIG-003, SIG-004)
                                                  evidence present on both; evidence_warning=None
                                                  source_object_id=COND-001/COND-002
                                                  evidence_chain populated; blocking_point/temporal_reference optional
                                                  fallback to evidence_warning text when missing — active

NAVIGATION              STABLE    42.4            6 navigation links; 5/6 resolved
                                                  1 unresolved — rendered as ⚠ (not hidden)
                                                  Obsidian deep-link gated on NEXT_PUBLIC_OBSIDIAN_VAULT_NAME env var
                                                  CoverageGauge shows 5/6 resolved

TEMPLATE RENDERER       STABLE    42.4            template_section present (2051 chars for GQ-003)
                                                  parseTemplateSections called via useMemo
                                                  sections: Answer (Executive), Key Signals, Why this matters,
                                                            Evidence Confidence, Drill-down
                                                  raw fallback active if section parse yields nothing
                                                  returns null if templateSection absent — correct gate

TOPOLOGY                GAP       42.7            42.7 adapter returns: topology[] list (4 entries),
                                                  domain_count, capability_count, component_count, pios_summary
                                                  top-level nodes=ABSENT, edges=ABSENT, wow_chain=ABSENT
                                                  TopologyPanel.js expects: wow_chain=True, exposure_records[]
                                                  (42.23 WOW chain format — not served by this route)
                                                  → PRE-EXISTING: BYP-R-001 (registered in EX.3)

DEBUG                   STABLE    EX.2            debug_run_id: EX3_live_20260404_074507
                                                  telemetry_source: STATIC_BASELINE
                                                  8 signals, 8 conditions, 8 diagnoses, 8 trace_chains
                                                  signal_summary keys: COMPLETE/PARTIAL/BLOCKED/signal_output_completeness
                                                  condition_summary keys: STABLE/AT_RISK/DEGRADED/BLOCKED
                                                  EX/debug_trace profile: PASS 11/11 (EX.1 baseline)

---

§3. FIELD ALIGNMENT MATRIX

Component              Field read              Adapter field          Aligned?
────────────────────────────────────────────────────────────────────────────────
LandingGaugeStrip      data.metrics            metrics[]              YES
ExecutivePanel         query_id                query_id               YES
ExecutivePanel         query_text              query_text             YES
ExecutivePanel         intent_type             intent_type            YES
ExecutivePanel         aggregate_confidence    aggregate_confidence   YES
SignalGaugeCard        evidence_confidence     evidence_confidence    YES
SignalGaugeCard        relevance               relevance              YES
EvidencePanel          signal.evidence         evidence               YES
EvidencePanel          evidence_warning        evidence_warning       YES
NavigationPanel        navigation[]            navigation             YES
NavigationPanel        nb.resolved             resolved               YES
TemplateRenderer       templateSection         template_section       YES
TopologyPanel          topology.wow_chain      wow_chain              NO (gap — BYP-R-001)
TopologyPanel          topology.exposure_records exposure_records     NO (gap — BYP-R-001)
EX.2 Debug             debug_run_id            debug_run_id           YES
EX.2 Debug             trace_chains            trace_chains           YES

---

§4. ISSUE REGISTRY

ID          Surface       Description                                         Classification
────────────────────────────────────────────────────────────────────────────────────────────
BYP-R-001   Topology      API ?topology=true routes to 42.7 (structural);    PRE-EXISTING
                          TopologyPanel expects 42.23 WOW chain format        (EX.3, not EX.D1)
                          (wow_chain=True, exposure_records[])
                          42.7 returns domain/capability/component tree only.

WOW-vocab   42.23         WOW chain signal_state uses non-CE.4 vocabulary:   PRE-EXISTING
                          computed/evaluable/partial/blocked                   (known open gap)
                          CE.4 vocabulary: COMPLETE/PARTIAL/BLOCKED/COMPUTABLE_PENDING

WOW-render  42.23         All 5 exposure_records: emphasis_render_token=      PRE-EXISTING
                          RENDER_NONE — no active WOW run driving token fill   (known open gap)

NEW ISSUES: NONE

---

§5. DRIFT CLASSIFICATION

Classification: MINOR

Rationale:
- 7 of 8 surfaces: STABLE, no field mismatches, no regressions
- 1 surface gap (Topology): pre-existing BYP-R-001 — not introduced by EX.1 compressed baseline
- All pre-existing issues registered in prior streams (EX.3)
- No new issues detected in this verification run
- Compressed execution baseline (EX.1 / ex1-compressed-baseline-v1) produced zero surface regressions

---

§6. EX.4 READINESS

Verdict: READY

Basis:
- All primary query-path surfaces (executive, evidence, navigation, template renderer) stable
- Signal gauges feeding from live adapter with correct field alignment
- Debug surface (EX.2) passing governed validation profile
- Topology gap is pre-existing, scoped, and registered
- No new blockers introduced

Conditions for EX.4:
- Topology route resolution (BYP-R-001) may be addressed in EX.4 or deferred
  with explicit FAIL-SAFE RULE declaring the gap in contract

---

§7. ARTIFACT CHECK

ARTIFACT MODE: PRODUCE
artifacts written: 1 (this document)
path: docs/pios/EX.D1/EX.D1_SURFACE_VERIFICATION_REPORT.md

ARTIFACT CHECK PASS — 1 artifact written
