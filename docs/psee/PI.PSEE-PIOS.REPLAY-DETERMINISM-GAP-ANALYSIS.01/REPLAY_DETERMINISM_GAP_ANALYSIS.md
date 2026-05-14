# Replay Determinism Gap Analysis

Stream: PI.PSEE-PIOS.REPLAY-DETERMINISM-GAP-ANALYSIS.01  
Status: COMPLETE  
Generated: 2026-05-07  
Branch: work/psee-runtime  

LANE_SCOPE: A + D  
LANE_IMPACT:  
  Modifies Lane A runtime behavior: NO  
  Modifies Lane A scripts (75.x/41.x): NO  
  Implements enriched derivation: NO  
  Advances Lane D governance: YES — determinism gap analysis issued; 10 minimum determinism requirements defined

Authoritative inputs:
- `docs/psee/PI.PSEE-PIOS.SEMANTIC-REPLAYABILITY-VALIDATION.REVIEW.01/SEMANTIC_REPLAYABILITY_VALIDATION_REVIEW.md`
- `docs/psee/PI.PSEE-PIOS.SEMANTIC-TRACEABILITY-OBSERVABILITY.DESIGN.01/SEMANTIC_TRACEABILITY_OBSERVABILITY.md`
- `docs/psee/PI.PSEE-PIOS.SEMANTIC-PROVENANCE-INSTRUMENTATION.IMPLEMENTATION.01/SEMANTIC_PROVENANCE_INSTRUMENTATION.md`
- `docs/psee/PI.PSEE-PIOS.ENRICHED-PSIG-DERIVATION-PRECONDITIONS.REVIEW.01/ENRICHED_PSIG_DERIVATION_PRECONDITIONS_REVIEW.md`
- `artifacts/psee_semantic_provenance/fastapi/run_02_oss_fastapi_pipeline/semantic_provenance.json`
- `artifacts/psee_advisory/fastapi/run_02_oss_fastapi_pipeline/participation_advisory.json`
- `artifacts/psee_gate/fastapi/run_02_oss_fastapi_pipeline/gate_evaluation.json`
- `docs/governance/psee_enrichment_schema.json`

Evidence base (run_02_oss_fastapi_pipeline):

| Field | Value |
|-------|-------|
| replay_supported | PARTIAL |
| advisory_count | 2 (ADV-001: CONTEXT_INCOMPLETE, ADV-002: PENDING_DERIVATION) |
| degradation_lineage events | 4 (DEG-001..DEG-004; all degradation_replayable=true) |
| replay_gaps | 10 |
| ENRICHMENT_SOURCE_MAP | Hardcoded in capture_semantic_provenance.py (12 entries) |
| N reference runs | 1 |
| semantic_authority | BLOCKED |
| runtime_impact | NONE |

---

## 1. Purpose

This analysis identifies all remaining conditions that prevent semantic provenance replay from being deterministic, reconstructable, reversible, and governance-auditable. It formally distinguishes replay determinism from replayability, reproducibility, and authority readiness — four concepts that must be kept rigorously separate.

**This analysis does not implement anything.** It produces a single governance document defining the gap landscape and minimum determinism requirements.

**This analysis does not authorize semantic authority.** Determinism is a technical property. Authority is a governance property. No level of determinism achievement produces or implies semantic authority.

**This analysis does not advance participation mode.** The system remains at OBSERVATIONAL_ONLY throughout.

**Governing principle of this document:**

> **Replay determinism validates technical reproducibility. Technical reproducibility enables governance audit. Neither constitutes semantic authority. The path is: determinism → reproducibility → audit readiness → authority review → authorization. Each step is a separate gate requiring explicit governance action.**

---

## 2. Replay Determinism Question

### The Central Question

> **Can semantic provenance replay produce the SAME semantic reconstruction outcome under identical provenance conditions?**

This question requires four concepts to be kept rigorously distinct. Each has a different authority level, different requirements, and different meaning.

---

### RDQ-01: Replayability

**Definition:** Given only the existing provenance artifacts (without re-running the pipeline), can every advisory and degradation event be reproduced?

**Current answer: PARTIAL.** The advisory evaluator is deterministic by construction. The provenance capture adds source attribution. But:
- Advisory artifacts are not self-describing (AL-02, AL-03, AL-08 absent)
- An auditor with only participation_advisory.json cannot cold-reconstruct trigger conditions
- N=1 reference run — empirical stability unvalidated

**What replayability requires:** Self-describing artifacts + empirically validated consistency across multiple runs with identical inputs.

**Current verdict (inherited from prior review):** PARTIALLY_REPLAYABLE — not yet REPLAY_OBSERVABLE.

---

### RDQ-02: Determinism

**Definition:** Given identical inputs to the advisory evaluator and capture script, does every execution produce bit-identical output (excluding time-varying fields)?

**Current answer: PARTIALLY_DETERMINISTIC.** The core logic — threshold checks, None comparisons, sequential advisory emission — is deterministic by construction. But the provenance artifacts contain version-dependent fields that differ across capture script versions even with identical inputs:
- `observability_state` is hardcoded "PARTIAL" in the capture script (not derived from advisory content)
- `lineage_gaps[]` is a hardcoded constant (not derived from advisory content)
- `captured_at` timestamps are runtime-generated (intentionally non-deterministic, but not formally excluded from identity comparison)
- `ENRICHMENT_SOURCE_MAP` attribution is compile-time-constant in the capture script — not embedded in the source artifact

**What determinism requires:** All replay-stable fields produce identical output across executions; all time-varying fields are formally excluded from identity comparison; version-dependent fields are either eliminated or version-tagged.

**Determinism ≠ replayability.** The evaluator can be deterministic (same code + same inputs → same outputs) while the artifacts remain not self-describing (auditor cannot reconstruct from artifacts alone). Both properties are required for full accountability.

---

### RDQ-03: Reproducibility

**Definition:** Given the same raw source inputs through the same pipeline, does the full system produce identical semantic provenance?

**Current answer: NOT YET ASSESSED.** Reproducibility requires the full pipeline path (L0 → 40.x → psee_handoff → advisory → provenance) to produce consistent outputs end-to-end. This has been validated for the advisory evaluator layer in isolation (deterministic by construction) but not for the full pipeline — specifically:
- Does re-running add_psee_enrichment_stubs.py against the same source produce identical psee_binding_envelope.json? Unvalidated.
- Does re-running evaluate_psee_gate.py against the same source produce identical gate_evaluation.json? Unvalidated (expected yes — same logic, same inputs).
- Does re-running evaluate_enrichment_participation.py against the same psee_binding_envelope.json and gate_evaluation.json produce identical participation_advisory.json? Expected yes but N=1.

**Reproducibility requires:** Full pipeline re-execution test across minimum N=3 reference runs confirming identical output at each layer.

**Reproducibility ≠ determinism.** A deterministic evaluator can fail reproducibility if its input artifacts are not immutable between runs (e.g., psee_binding_envelope.json is regenerated with a timestamp change).

---

### RDQ-04: Authority Readiness

**Definition:** Is the system technically prepared for a future governance authority consideration of semantic participation?

**Current answer: NOT READY.** Authority readiness requires all of:
- Replayability: PARTIALLY_REPLAYABLE (not yet REPLAY_GOVERNANCE_READY)
- Determinism: PARTIALLY_DETERMINISTIC (10 gaps identified in this analysis)
- Reproducibility: NOT YET ASSESSED
- Minimum preconditions: 1 of 9 met (from ENRICHED_PSIG_DERIVATION_PRECONDITIONS review)
- Minimum replayability thresholds: 1 of 6 partially met (from SEMANTIC_REPLAYABILITY_VALIDATION review)

**Authority readiness ≠ determinism.** A fully deterministic system still requires an explicit governance action by the governance authority to authorize semantic participation. No technical achievement constitutes authorization.

---

### The Four-Level Separation

```
REPLAYABILITY       → PARTIALLY_REPLAYABLE (artifacts observable but not self-describing)
DETERMINISM         → PARTIALLY_DETERMINISTIC (core logic deterministic; schema nondeterminism present)
REPRODUCIBILITY     → NOT YET ASSESSED (pipeline-level re-execution not validated)
AUTHORITY READINESS → NOT READY (1 of 9 preconditions met; authority is governance action, not technical threshold)
```

**No level implies the next.** Each is a distinct property requiring separate validation.

---

## 3. Advisory Replay Divergence Analysis

Six dimensions of advisory replay divergence are analyzed. Each is classified LOW / MODERATE / HIGH / CRITICAL.

---

### ARD-01: Enrichment Input Ambiguity

**Description:** Advisory records identify enrichment inputs by field path (e.g., `"evidence_state.evidence_confidence"`) but not by artifact path or observed value. Two replays using different source versions of psee_binding_envelope.json could produce different advisory outcomes while appearing to use the "same" inputs.

**Evidence:** enrichment_inputs_used in ADV-001: `["evidence_state.evidence_confidence"]`. Source artifact: NOT embedded in advisory. Observed value at emission: NOT embedded in advisory. Both are present only in semantic_provenance.json (derived capture record), not in the advisory artifact itself.

**Divergence path:** If psee_binding_envelope.json is regenerated between two replay attempts (e.g., after add_psee_enrichment_stubs.py is updated), the advisory evaluator's input values could change while the replay appears to be using the "same run artifacts." AL-02 (originating_artifact) and observed value attribution being absent from the advisory makes this divergence invisible from the advisory alone.

**Classification: HIGH**

**Why HIGH:** This is the primary advisory identity gap. Without AL-02 and observed values embedded in the advisory, a replay that silently substitutes a newer psee_binding_envelope.json is indistinguishable from a true replay. The divergence is invisible from the advisory artifact.

---

### ARD-02: Provenance Ordering Instability

**Description:** Advisory IDs (ADV-001, ADV-002) are assigned by an in-memory sequential counter in evaluate_enrichment_participation.py. The assignment order depends on the evaluation sequence in the `evaluate_advisories()` function. If a future evaluator version reorders the evaluation logic (e.g., evaluates ADV-03 before ADV-04), the same trigger conditions produce differently-numbered advisory IDs.

**Evidence from capture script:** advisory_lineage in semantic_provenance.json uses advisory_id as the primary advisory identifier. lineage_gaps[] references advisory_ids. If advisory IDs shift between evaluator versions, cross-version replay comparisons would incorrectly classify matched advisories as new/missing.

**Divergence path:** Evaluator version update → evaluation order changes → same inputs produce ADV-001=evidence_insufficiency (was ADV-002) → replay comparator reports "advisory type changed" when it did not.

**Classification: MODERATE**

**Why MODERATE:** Only manifests if the evaluator is updated between replay attempts. For a fixed evaluator version, advisory IDs are stable. Becomes HIGH if no stable identity key (independent of advisory_id) is defined before the evaluator is extended.

---

### ARD-03: Incomplete Lineage Chains

**Description:** Six of eight advisory lineage requirements (AL-01..AL-08) are absent from the current advisory artifact. An auditor performing cold reconstruction from participation_advisory.json cannot verify:
- Which artifact provided each enrichment input (AL-02)
- What the exact trigger condition was in machine-readable form (AL-03)
- What the participation mode was at advisory emission (AL-04)
- What the degradation state was at advisory emission (AL-05)
- What the governance gate state was at emission (AL-07)
- What the artifact provenance chain was (AL-08)

**Divergence path:** Cold reconstruction attempt → auditor reads advisory artifact → cannot determine source artifact → cannot verify trigger conditions → reconstruction fails. Two auditors performing independent reconstructions could reach different conclusions about what caused ADV-001.

**Classification: HIGH**

**Why HIGH:** This gap is not about evaluator nondeterminism — the evaluator IS deterministic. The gap is that the advisory artifact cannot support independent replay verification. The divergence is not in the computation but in the auditing of it.

---

### ARD-04: Replay Dependency Gaps

**Description:** Replay requires three source artifacts: gate_evaluation.json, psee_binding_envelope.json, and participation_advisory.json. These artifacts have no formal immutability guarantee. If any is regenerated between the original evaluation and a later replay attempt, the replay uses different inputs.

**Evidence:** Artifacts are written to `artifacts/psee_gate/`, `artifacts/psee_advisory/`, `artifacts/psee_semantic_provenance/` — local directories, not committed. No artifact versioning mechanism exists. No read-only policy enforces immutability.

**Divergence path:** Evaluator re-run for a given run_id → psee_binding_envelope.json overwritten → capture script re-run → semantic_provenance.json references the new envelope → original advisory still references old enrichment values → replay comparison fails.

**Classification: MODERATE**

**Why MODERATE:** Depends on whether re-evaluation is performed. For a frozen reference run, all artifacts remain stable. Becomes HIGH if artifact immutability is not formally defined before the evaluator is run against additional reference runs.

---

### ARD-05: Governance Gate Ambiguity

**Description:** The advisory evaluator reads `activation_state` from gate_evaluation.json as a text string. It does not read individual gate results (G-01..G-09). If the gate evaluator's logic changes — producing the same `activation_state: "ENRICHMENT_READY"` from a different combination of gate results — the advisory evaluator would produce the same advisory output while the underlying gate state has changed.

**Evidence from gate_evaluation.json:** G-01..G-06 all PASS; G-07..G-09 all FAIL → activation_state=ENRICHMENT_READY. The advisory evaluator reads activation_state only. A hypothetical version where G-04 FAIL but G-07 PASS could also produce activation_state=ENRICHMENT_READY (if the gate logic were redesigned), but the advisory evaluator would produce identical output while the actual gate state is entirely different.

**Divergence path (future):** Gate evaluator updated → different gate pass/fail combination → same activation_state → advisory evaluator produces identical advisories → provenance record shows identical governance_gate_state summary → actual underlying gate result is different.

**Classification: MODERATE**

**Why MODERATE:** Does not affect current run (gate logic is stable). Becomes HIGH if the gate evaluator is updated without updating the advisory evaluator to read gate results directly.

---

### ARD-06: Degradation Timing Ambiguity

**Description:** Timestamps in the provenance artifacts (`captured_at`, `emitted_at`, `evaluated_at`) are generated at runtime and vary between executions. No mechanism formally excludes time-varying fields from replay identity comparison. A replay comparator that includes timestamps in identity comparison would always report divergence.

**Evidence:** semantic_provenance.json: `captured_at: "2026-05-06T14:28:33.743666+00:00"`. Each degradation event carries its own `captured_at`. participation_advisory.json: `evaluated_at`, `emitted_at` per advisory.

**Divergence path:** Replay comparison naively includes timestamps → every re-execution appears nondeterministic → replay validation always fails → replay guarantee can never be asserted.

**Classification: LOW**

**Why LOW:** This is a known and easily resolvable issue — define time-varying fields and exclude them from identity comparison. Not a logic nondeterminism; not a semantic risk. But must be formally documented before any replay validation is defined.

---

### Advisory Replay Divergence Summary

| Dimension | Classification | Primary Mechanism | Closeable |
|-----------|---------------|-------------------|-----------|
| ARD-01: Enrichment input ambiguity | HIGH | AL-02/observed values absent from advisory | YES (advisory format extension) |
| ARD-02: Provenance ordering instability | MODERATE | Sequential advisory ID assignment | YES (stable identity key) |
| ARD-03: Incomplete lineage chains | HIGH | AL-02/03/04/05/07/08 absent | YES (advisory format extension) |
| ARD-04: Replay dependency gaps | MODERATE | No artifact immutability guarantee | YES (immutability policy) |
| ARD-05: Governance gate ambiguity | MODERATE | activation_state only; no gate results | YES (advisory evaluator reads gate results) |
| ARD-06: Degradation timing ambiguity | LOW | Timestamps in identity comparison | YES (time-varying field taxonomy) |

**Two HIGH divergence risks exist.** Both are closeable through advisory format extension and artifact immutability policy. Neither requires derivation authorization. Neither requires participation mode advancement.

---

## 4. Degradation Replay Instability Analysis

Five degradation replay targets are assessed for determinism, reversibility, and reconstruction consistency.

---

### DRI-01: Evidence Insufficiency (DEG-001 — EVIDENCE_INCOMPLETE)

**Replay determinism:** DETERMINISTIC. The trigger `evidence_state.evidence_confidence is None` is a Python None-check — exact, platform-independent, version-stable. Same psee_binding_envelope.json with evidence_confidence=null always produces DEG-001.

**Replay reversibility:** HIGH but blocked by derivation gap. DEG-001 is reversed when evidence_confidence derivation is implemented. Until that stream is issued, DEG-001 is permanently present for all runs. This is the correct state — the degradation is real, not a schema artifact.

**Reconstruction consistency:** PARTIAL. DEG-001 is fully described in semantic_provenance.json (event_type, degradation_reason, observed_value, advisory_refs, modes_blocked). But DEG-001 is NOT present as a structured event in participation_advisory.json — only ADV-001 text reason. An auditor with only the advisory artifact knows evidence_confidence is null (from advisory_reason text) but does not see DEG-001 as a structured degradation record.

**Instability source:** NONE for the determinism claim itself. Instability in the completeness claim — DEG-001 is reconstructable from semantic_provenance.json but not from participation_advisory.json alone.

---

### DRI-02: Structural Overlap Placeholder (DEG-002 — STRUCTURAL_OVERLAP_PENDING)

**Replay determinism:** DETERMINISTIC by construction (edge_count=0 integer check). However:

**Semantic ambiguity (governance-blocking):** edge_count=0 is a placeholder value hardcoded by add_psee_enrichment_stubs.py. After OVERLAP_STRUCTURAL derivation is implemented, the same run could produce edge_count=0 meaning "genuinely no structural overlap" — not a placeholder. These two states are semantically different but produce identical artifact values. A replay of a future run with genuinely-zero overlap would produce DEG-002 even when no overlap degradation exists.

The current artifact has `"ultimate_source": "NOT_YET_DERIVED — OVERLAP_STRUCTURAL derivation pending"` in the provenance record — this distinguishes the placeholder. But this distinction is in the provenance record (not the advisory or envelope artifact). Once derivation is implemented, the NOT_YET_DERIVED marker would be updated to a real source — but old provenance records with the placeholder marker cannot be distinguished from new records with genuinely-zero overlap.

**Replay reversibility:** HIGH (clear when derivation is implemented + edge_count field is updated). But requires explicit disambiguation in the psee_enrichment_schema.json: add `"derivation_status"` field to structural_overlap.edge_count to distinguish PLACEHOLDER from DERIVED_ZERO.

**Reconstruction consistency:** PARTIAL. Same as DEG-001 — structured record in provenance, absent from advisory.

---

### DRI-03: Selector Not Authorized (DEG-003 — SELECTOR_NOT_AUTHORIZED)

**Replay determinism:** DETERMINISTIC. `selector_context.selector_confidence is None` is a None-check. Always produces DEG-003 when selector_confidence=null.

**Replay reversibility:** HIGH. Cleared when selector authorization is issued and selector_confidence is populated with a non-null value.

**Reconstruction consistency:** PARTIAL. DEG-003 captured in provenance. Not a structured event in advisory. Cited in ADV-002 (evidence_insufficiency) only.

**Instability source:** NONE for the determinism claim. The risk is that DEG-003 semantics conflate two different states: "selector not authorized" (governance gap) and "selector authorized but confidence not computed" (future possible state). Currently these are identical (both null selector_confidence) but represent different governance situations. When selector authorization is issued, a new intermediate state could produce null selector_confidence legitimately — making DEG-003 appear as a false positive.

---

### DRI-04: Activation Not Authorized (DEG-004 — ACTIVATION_NOT_AUTHORIZED)

**Replay determinism:** FULLY DETERMINISTIC. `activation_authorized = False` is hardcoded in evaluate_psee_gate.py. G-08 always FAIL. DEG-004 always appears. This is not contingent on any artifact value — it is a code constant.

**Replay reversibility:** Requires governance authority action (changing `activation_authorized` behavior in the gate evaluator — requires a separate implementation stream with explicit governance authorization).

**Reconstruction consistency:** CRITICALLY PARTIAL. DEG-004 has `"advisory_refs": []` — no advisory record references it. An auditor with only participation_advisory.json has no awareness of DEG-004. The activation authorization gap is visible only in gate_evaluation.json (G-08 FAIL) and semantic_provenance.json. This creates an accountability gap: the most governance-significant degradation event (activation not authorized) is invisible in the advisory artifact.

**Instability source:** No instability in the determinism claim. The accountability gap is that DEG-004's governance significance is not surfaced in the advisory artifact. Any advisory-artifact-only audit would miss the activation authorization degradation entirely.

---

### DRI-05: Semantic Ambiguity (DR-05 — not present for run_02)

**Replay determinism:** UNKNOWN. The semantic_conflict advisory logic is not implemented. If ADV-01 and ADV-02 were simultaneously emitted, the conflict detection path does not exist. A future evaluator that encounters this scenario has undefined behavior — it would emit both advisories without a conflict record, which is a deterministic output but an incorrect one (missing the conflict signal).

**Replay reversibility:** N/A — not yet triggered.

**Reconstruction consistency:** NOT IMPLEMENTED. This degradation path has no replay instrumentation.

**Instability source:** The absence of conflict detection logic means that when the simultaneous-trigger scenario eventually occurs (after structural_overlap derivation), the evaluator will silently produce two contradictory advisories with no conflict record. This is a design determinism gap — not a runtime nondeterminism.

---

### Degradation Replay Instability Summary

| Event | Determinism | Reconstruction Consistency | Key Instability |
|-------|-------------|---------------------------|-----------------|
| DEG-001: Evidence incomplete | DETERMINISTIC | PARTIAL (provenance only; not in advisory) | Advisory artifact lacks structured degradation record |
| DEG-002: Structural overlap placeholder | DETERMINISTIC (with semantic ambiguity) | PARTIAL | edge_count=0 is indistinguishable from DERIVED_ZERO without derivation_status field |
| DEG-003: Selector not authorized | DETERMINISTIC (with semantic conflation) | PARTIAL | Future "authorized but null" state would produce false DEG-003 |
| DEG-004: Activation not authorized | FULLY DETERMINISTIC | CRITICALLY PARTIAL | DEG-004 invisible in advisory artifact; no advisory_refs |
| DR-05: Semantic ambiguity | UNDEFINED | NOT IMPLEMENTED | Conflict detection absent; simultaneous trigger produces no conflict record |

**Three governance-significant instability sources identified:**
1. DEG-002 semantic ambiguity (placeholder vs. derived-zero)
2. DEG-004 accountability gap (orphaned from advisory artifact)
3. DR-05 undefined behavior (conflict detection absent)

---

## 5. Provenance Nondeterminism Analysis

Six provenance nondeterminism sources are identified and classified.

---

### PND-01: Runtime-Generated Timestamps

**Description:** semantic_provenance.json `captured_at`, degradation event `captured_at` fields, participation_advisory.json `evaluated_at` and advisory `emitted_at` fields are all generated at `datetime.now(timezone.utc).isoformat()` at execution time. Two executions with identical inputs produce identical advisory logic output but different timestamp strings.

**Evidence:** semantic_provenance.json `"captured_at": "2026-05-06T14:28:33.743666+00:00"`. This value changes with every execution.

**Reducible:** YES — define a formal replay-stable field taxonomy that explicitly marks `captured_at`, `evaluated_at`, `emitted_at` as time-varying fields excluded from identity comparison. This taxonomy must be documented in the schema, not just in analyst knowledge.

**Governance-blocking:** NO — but must be formally defined before any replay validation harness is designed. Without the taxonomy, any automated replay comparator would incorrectly report nondeterminism.

**Classification: REDUCIBLE**

---

### PND-02: Advisory ID Sequencing Nondeterminism

**Description:** Advisory IDs are assigned by an in-memory counter in evaluate_enrichment_participation.py. The counter resets on each execution. The assigned IDs (ADV-001, ADV-002) depend on the evaluation order within `evaluate_advisories()`. If the evaluator is extended with new advisory types or the evaluation order changes, the same trigger conditions produce different advisory IDs.

**Evidence:** evaluate_enrichment_participation.py: `adv_seq = [0]; def next_id(): adv_seq[0] += 1; return f"ADV-{adv_seq[0]:03d}"`. This counter is session-local and not seeded from any deterministic input.

**Current implication:** For run_02, ADV-001=confidence_downgrade, ADV-002=evidence_insufficiency. If a future evaluator adds a new advisory type between these two in evaluation order, run_02 equivalent would produce ADV-001=confidence_downgrade, ADV-002=new_type, ADV-003=evidence_insufficiency. The provenance capture references advisory_ids — a cross-version replay would fail to match.

**Reducible:** YES — define advisory stable identity key as `(advisory_type, advisory_state, frozenset(enrichment_inputs_used))`. This key is deterministic regardless of evaluation order or advisory_id assignment.

**Governance-blocking:** YES — until a stable identity key is defined, cross-run and cross-version replay comparisons cannot be automated. Any replay governance framework built on advisory_id will fail when the evaluator is updated.

**Classification: GOVERNANCE-BLOCKING (until stable identity key defined)**

---

### PND-03: ENRICHMENT_SOURCE_MAP Compile-Time Binding

**Description:** In capture_semantic_provenance.py, the ENRICHMENT_SOURCE_MAP constant hardcodes source artifact attribution for 12 enrichment field paths. Example:

```python
"evidence_state.evidence_confidence": {
    "source_artifact": "binding/psee_binding_envelope.json",
    "ultimate_source": "NOT_YET_DERIVED — evidence_confidence derivation formula pending",
    "derivation_status": "PENDING_DERIVATION",
}
```

This attribution is a property of the capture script, not of the psee_binding_envelope.json artifact. Two different versions of capture_semantic_provenance.py could produce different `ultimate_source` or `derivation_status` values for the same advisory, making provenance records from different script versions incomparable.

**Governance-blocking:** YES — source attribution in the provenance record is version-dependent. When evidence_confidence derivation is implemented, the capture script will be updated to change `"derivation_status": "PENDING_DERIVATION"` to `"derivation_status": "DERIVED"`. Old provenance records (PENDING_DERIVATION) and new provenance records (DERIVED) describe the same field path but reflect different derivation state. This is correct — but only if the script version is tracked in the provenance artifact. Currently, no `capture_script_version` field exists in semantic_provenance.json.

**Irreducible (as currently designed):** The ENRICHMENT_SOURCE_MAP must either be:
1. Migrated to psee_binding_envelope.json as `psee_enrichment_meta.source_map` (closing PT-02 gap), making attribution intrinsic to the artifact, OR
2. Tagged with a formal script version in semantic_provenance.json, making version-dependence explicit

**Classification: GOVERNANCE-BLOCKING (until PT-02 source_map closed OR script version tagged)**

---

### PND-04: observability_state Version Dependence

**Description:** In capture_semantic_provenance.py, `observability_state` is hardcoded to `"PARTIAL"` for every advisory record with the comment "current advisory format has text reason; structured trigger object absent." When AL-03 (advisory_reason_structured) is implemented, the capture script will be updated to compute `observability_state` as `"COMPLETE"`. Historical provenance records for run_02 will retain `"PARTIAL"` while new records for the same run type would show `"COMPLETE"`.

**Evidence:** capture_semantic_provenance.py builds advisory lineage with `"observability_state": "PARTIAL"` for all advisory records. This is a hardcoded classification, not derived from advisory content.

**Governance-blocking:** YES — observability_state is a governance-classification field. If two auditors independently assess the same advisory from different versions of the provenance record, they get different observability verdicts. This undermines the accountability claim.

**Reducible:** YES — observability_state should be dynamically computed from advisory content: if `advisory_reason_structured` field is present in advisory record → COMPLETE; if absent → PARTIAL. This makes observability_state a derived property of the advisory artifact, not a capture-script constant.

**Classification: GOVERNANCE-BLOCKING (until observability_state computed dynamically)**

---

### PND-05: lineage_gaps Hardcoding

**Description:** In capture_semantic_provenance.py, `ADVISORY_FORMAT_LINEAGE_GAPS` is a module-level constant listing six specific gap strings. This list is injected verbatim into every advisory's `lineage_gaps[]` array in the provenance record. The gaps are static — they do not change based on the actual content of the advisory record.

**Current content:**
```python
ADVISORY_FORMAT_LINEAGE_GAPS = [
    "AL-02: originating_artifact absent from participation_advisory.json advisory records",
    "AL-03: advisory_reason_structured absent — text reason only; structured trigger object missing",
    ...
]
```

**Governance-blocking:** YES — when AL-02/AL-03/AL-08 are implemented in the advisory evaluator, the lineage_gaps list should shorten. But if the capture script is not updated simultaneously, old gaps will continue to appear in provenance records even after the advisory artifact has the required fields. Conversely, a provenance record from before implementation would show no gaps that the current advisor exhibits — making longitudinal gap tracking impossible without manual script version management.

**Reducible:** YES — lineage_gaps should be dynamically computed: for each required advisory lineage field (AL-01..AL-08), check whether the advisory record actually contains that field. Gaps are advisory-content-derived, not script-constant-derived.

**Classification: GOVERNANCE-BLOCKING (until lineage_gaps computed dynamically)**

---

### PND-06: Session Identity Fragility

**Description:** gate_evaluation.json and participation_advisory.json share client_id and run_id but no formal session_id. If either artifact is regenerated (e.g., gate evaluator re-run after a script update for the same run_id), the two artifacts would describe different evaluations while appearing to describe the same one. The implicit session identity (shared run_id) is a weak link that can silently break.

**Evidence:** gate_evaluation.json: `"client_id": "fastapi"`, `"run_id": "run_02_oss_fastapi_pipeline"`, `"evaluated_at": "2026-05-06T13:18:53.080209+00:00"`. participation_advisory.json: same client_id + run_id, `"evaluated_at": "2026-05-06T13:40:47.661713+00:00"`. These are 22 minutes apart. Nothing formally links these as a contemporaneous pair.

**Governance-blocking:** YES — the provenance chain (semantic_provenance.json step 1 + step 3) references these artifacts by path. If either is regenerated without updating the provenance chain, the provenance record describes a state that no longer exists.

**Reducible:** YES — add a formal `session_id` (UUID or hash of run_id + evaluated_at of both artifacts) to both gate_evaluation.json and participation_advisory.json, plus to the semantic_provenance.json provenance chain. This makes the session identity explicit and detectable if broken.

**Classification: GOVERNANCE-BLOCKING (until formal session_id implemented)**

---

### Provenance Nondeterminism Summary

| Source | Classification | Governance-Blocking | Resolution Path |
|--------|---------------|--------------------|----|
| PND-01: Runtime timestamps | REDUCIBLE | NO | Define time-varying field taxonomy |
| PND-02: Advisory ID sequencing | GOVERNANCE-BLOCKING | YES | Define stable advisory identity key |
| PND-03: ENRICHMENT_SOURCE_MAP compile-time binding | GOVERNANCE-BLOCKING | YES | Migrate to psee_binding_envelope.json source_map (PT-02) OR version-tag |
| PND-04: observability_state version dependence | GOVERNANCE-BLOCKING | YES | Compute dynamically from advisory content |
| PND-05: lineage_gaps hardcoding | GOVERNANCE-BLOCKING | YES | Compute dynamically from advisory field presence |
| PND-06: Session identity fragility | GOVERNANCE-BLOCKING | YES | Add formal session_id linking |

**Five of six nondeterminism sources are governance-blocking.** All are reducible through design changes — none requires derivation authorization, participation mode advancement, or runtime modification.

---

## 6. Semantic Reconstruction Consistency Review

Four dimensions of semantic reconstruction consistency are assessed.

---

### SRC-01: Advisory Reconstruction Consistency

**Question:** Does reconstructing an advisory from its artifact produce consistent results across independent reconstruction attempts?

**Evidence:** From SEMANTIC_REPLAYABILITY_VALIDATION_REVIEW, all six AR dimensions (AR-01..AR-06) are PARTIAL. The primary gap: the advisory artifact is not self-describing — AL-02/03/08 absent.

**With provenance capture assistance:**
- Advisory causality: PARTIAL — text reason present; machine-readable trigger absent (AL-03)
- Source attribution: PARTIAL — originating_artifact in semantic_provenance.json; absent from advisory
- Provenance chain: PARTIAL — chain reconstructable across artifacts; absent from advisory itself
- Degradation linkage: PARTIAL — advisory_refs in provenance; degradation_event_ref absent from advisory

**Without provenance capture:**
- Cold reconstruction: FAILS — AL-02, AL-03, AL-08 absent; causal chain not machine-reproducible from advisory alone

**Classification: PARTIAL**

**Two independent auditors** — one with full provenance stack, one with advisory artifact only — would reach different but non-contradictory conclusions. This is acceptable temporarily but is not the standard for governance accountability.

---

### SRC-02: Degradation Reconstruction Consistency

**Question:** Are degradation events consistently reconstructable from available artifacts?

**Evidence:** Four degradation events. DEG-001..DEG-003 captured in semantic_provenance.json with full structure. DEG-004 captured in semantic_provenance.json but absent from participation_advisory.json (advisory_refs = []).

**Critical gap (DEG-004):** An auditor with only participation_advisory.json would see no activation authorization degradation event. An auditor with semantic_provenance.json would see DEG-004 fully described. These two reconstructions are inconsistent — not because the facts differ, but because a critical degradation event is visible in one artifact and invisible in another.

**DR-05 (semantic ambiguity):** Not implemented. When the simultaneous-trigger scenario occurs, no conflict record would exist. Reconstruction of a conflict scenario would be impossible.

**DEG-002 semantic ambiguity:** edge_count=0 is indistinguishable from genuine-zero-overlap without a derivation_status field. Post-derivation reconstruction of the current run would be ambiguous.

**Classification: PARTIAL with NONDETERMINISTIC dimension (DEG-002 ambiguity; DEG-004 artifact-dependent visibility; DR-05 undefined)**

---

### SRC-03: Provenance Replay Consistency

**Question:** Does replaying the capture script against the same source artifacts produce consistent provenance records?

**Evidence:** The capture script is deterministic in its logic path (same inputs → same advisory_lineage, degradation_lineage, provenance_chain structure). But:
- PND-01 (timestamps): different captured_at on every execution
- PND-04 (observability_state): hardcoded "PARTIAL" — consistent across versions but not derived from content
- PND-05 (lineage_gaps): hardcoded list — consistent within a capture script version but diverges across versions

**Classification: PARTIAL (consistent within a version; diverges across versions)**

**If the capture script is never updated:** consistency is HIGH (same inputs → same output modulo timestamps). But this is a fragile property — it holds only because the script is frozen, not because the design guarantees version stability.

---

### SRC-04: Replay Causality Consistency

**Question:** Is the causal chain from enrichment input to advisory emission to degradation event consistently traceable?

**Evidence:**
- Input → advisory: PARTIAL (field paths present; observed values and source artifacts absent from advisory)
- Advisory → degradation: PARTIAL (advisory_refs in degradation events; degradation_event_ref absent from advisory)
- Gate state → advisory: PARTIAL (activation_state in advisory; individual gate results absent)
- DEG-004 → advisory: BROKEN — no advisory references DEG-004

**Causality chain for ADV-001:**
```
evidence_state.evidence_confidence (null)
  → [evaluate_enrichment_participation.py applies CONTEXT_INCOMPLETE logic]
  → ADV-001 (confidence_downgrade, CONTEXT_INCOMPLETE)
  → DEG-001 references ADV-001 in advisory_refs
  → DEG-001 captured in semantic_provenance.json
```
This chain is reconstructable WITH the provenance record. Not reconstructable from advisory alone (AL-03 absent).

**Causality chain for DEG-004:**
```
activation_authorized = False (hardcoded in gate evaluator)
  → G-08 FAIL in gate_evaluation.json
  → DEG-004 (ACTIVATION_NOT_AUTHORIZED) captured in semantic_provenance.json
  → NO advisory record references this degradation
```
This chain ends without an advisory. The most important governance event (activation not authorized) has no advisory-layer representation.

**Classification: PARTIAL / NONDETERMINISTIC (DEG-004 causality chain broken)**

---

### Semantic Reconstruction Consistency Summary

| Dimension | Classification | Primary Gap |
|-----------|---------------|------------|
| SRC-01: Advisory reconstruction | PARTIAL | AL-02/03/08 absent; self-describing advisory not achieved |
| SRC-02: Degradation reconstruction | PARTIAL / NONDETERMINISTIC | DEG-004 orphaned; DEG-002 semantic ambiguity; DR-05 undefined |
| SRC-03: Provenance replay | PARTIAL | Version-dependent fields (PND-04, PND-05); timestamps (PND-01) |
| SRC-04: Replay causality | PARTIAL / NONDETERMINISTIC | DEG-004 causality chain broken at advisory layer |

**No dimension achieves CONSISTENT.** The system is at PARTIAL for all four dimensions, with NONDETERMINISTIC elements in two dimensions (SRC-02, SRC-04) due to the DEG-004 accountability gap and DEG-002 semantic ambiguity.

The expected direction (PARTIAL or NONDETERMINISTIC) is confirmed.

---

## 7. Minimum Determinism Requirements

The following ten requirements define the minimum conditions for the system to achieve DETERMINISTIC_OBSERVABLE status — the lowest level at which a replay governance claim could be formally asserted. Meeting all ten requirements does not authorize semantic participation.

**Critical principle: meeting determinism requirements ≠ semantic authority authorization.**

Semantic authority authorization requires an explicit governance action by the governance authority. Determinism is a technical property that supports governance audit. It does not constitute governance action.

---

### MDR-01: Stable Advisory Identity Key

**What:** Define advisory identity as `(advisory_type, advisory_state, frozenset(enrichment_inputs_used))` — a tuple that is deterministic regardless of advisory_id assignment order or evaluator version.

**What this closes:** PND-02 (advisory ID sequencing nondeterminism), ARD-02 (provenance ordering instability).

**Required before:** Any replay comparison that must survive evaluator updates. Any cross-version advisory stability test.

**Not required for:** Advisory evaluator correctness (the evaluator is already deterministic). Single-run provenance capture.

---

### MDR-02: Replay-Stable Field Taxonomy

**What:** Explicitly classify all fields in semantic_provenance.json, participation_advisory.json, and gate_evaluation.json as one of:
- `REPLAY_STABLE`: deterministic from inputs (advisory_type, gate results, enrichment_inputs_used, degradation events)
- `TIME_VARYING`: expected to differ per execution (captured_at, evaluated_at, emitted_at)
- `VERSION_DEPENDENT`: may change when scripts are updated (observability_state, lineage_gaps, ultimate_source in ENRICHMENT_SOURCE_MAP)

**What this closes:** PND-01 (timestamp nondeterminism), enables automated replay comparators to exclude time-varying fields.

**Required before:** Any replay validation harness design. Any automated N=3 advisory stability test.

---

### MDR-03: Artifact-Bound Source Attribution

**What:** Migrate ENRICHMENT_SOURCE_MAP from compile-time constant in capture_semantic_provenance.py to `psee_enrichment_meta.source_map` embedded in psee_binding_envelope.json (PT-02 gap closure). Source attribution must be a property of the semantic artifact, not of the capture script.

**What this closes:** PND-03 (ENRICHMENT_SOURCE_MAP compile-time binding). Closes PT-02 semantic provenance gap.

**Required before:** Provenance records can be version-independent. Source attribution can survive capture script updates without becoming stale.

---

### MDR-04: Formal Session Identity

**What:** Add a `session_id` field to gate_evaluation.json and participation_advisory.json, and reference it in semantic_provenance.json provenance_chain entries. The session_id must be:
- A deterministic hash of (client_id, run_id, evaluated_at of gate_evaluation.json)
- OR a UUID generated once and embedded in both artifacts during the same evaluation session

**What this closes:** PND-06 (session identity fragility). Prevents silent ambiguity when artifacts are regenerated for the same run_id.

**Required before:** Multi-run advisory stability tests (where multiple evaluation sessions exist for the same client/run combination). Replay harness design.

---

### MDR-05: Dynamic lineage_gaps Computation

**What:** Replace the hardcoded `ADVISORY_FORMAT_LINEAGE_GAPS` constant with a dynamic check: for each advisory lineage requirement (AL-01..AL-08), inspect the advisory record content and report which fields are present vs. absent. lineage_gaps must reflect the actual state of the advisory artifact at capture time, not a static list.

**What this closes:** PND-05 (lineage_gaps hardcoding). Ensures lineage_gaps array correctly shrinks as AL-02/03/08 are implemented.

**Required before:** Any advisory format extension stream (so that provenance records correctly reflect gap closure progress).

---

### MDR-06: Dynamic observability_state Computation

**What:** Replace the hardcoded `observability_state = "PARTIAL"` in advisory lineage records with a dynamic computation: if `advisory_reason_structured` is present in advisory record → COMPLETE; if absent → PARTIAL. The observability classification must be derived from advisory content.

**What this closes:** PND-04 (observability_state version dependence). Ensures observability_state correctly advances to COMPLETE when AL-03 is implemented.

**Required before:** Any advisory format extension stream (so that provenance records reflect the correct observability state after extension).

---

### MDR-07: DEG-004 Advisory Emission

**What:** Extend the advisory evaluator to emit an advisory record for activation authorization absence (ACTIVATION_NOT_AUTHORIZED). This advisory type is currently absorbed entirely by gate_evaluation.json (G-08 FAIL) with no corresponding advisory in participation_advisory.json. The advisory record must reference DEG-004 and explicitly state that activation_authorized=false is the most significant governance-blocking condition.

**What this closes:** DRI-04 accountability gap (DEG-004 orphaned from advisory). SRC-04 causality chain broken at advisory layer.

**Required before:** Advisory artifact alone can represent complete degradation picture. Auditor with advisory artifact alone can see activation authorization state.

---

### MDR-08: DEG-002 Derivation Status Field

**What:** Add a `derivation_status` field to `structural_overlap.edge_count` in psee_enrichment_schema.json and psee_binding_envelope.json, with values:
- `PLACEHOLDER`: value is 0 because derivation is not yet implemented (current state)
- `DERIVED_ZERO`: derivation ran and genuinely found no structural overlap
- `DERIVED_NONZERO`: derivation ran and produced actual edges

**What this closes:** DRI-02 semantic ambiguity (placeholder vs. derived-zero). Ensures DEG-002 can be distinguished from a genuinely zero-overlap result.

**Required before:** OVERLAP_STRUCTURAL derivation is implemented. If derivation is implemented without this field, the placeholder and genuine-zero states become permanently indistinguishable in historical records.

---

### MDR-09: Hidden Influence Audit

**What:** A formal line-by-line code audit of evaluate_enrichment_participation.py confirming that every enrichment input that conditionally affects advisory emission is listed in enrichment_inputs_used for the advisory it affects. Audit must produce a structured artifact (hidden_influence_audit.json) with:
- Per-advisory-type: list of all conditional branches; confirmation that all enrichment fields accessed are in enrichment_inputs_used
- Overall verdict: PASS / FAIL

**What this closes:** RF-04 (hidden influence propagation) from replayability validation — CRITICAL/UNVALIDATED. Until this audit passes, causal attribution in provenance records cannot be trusted.

**Required before:** Any replay causal attribution claim. Any replayability governance advancement.

---

### MDR-10: Replay Causality Audit Artifact

**What:** Implement a `replay_causality.json` artifact produced alongside semantic_provenance.json for each reference run, containing:
- Evaluator version identifiers (hash of evaluate_enrichment_participation.py + capture_semantic_provenance.py at execution time)
- Input artifact hashes (sha256 of gate_evaluation.json + psee_binding_envelope.json at evaluation time)
- Output advisory stable identifiers (MDR-01 identity keys, not advisory_ids)
- Replay-stable field values for all REPLAY_STABLE fields (per MDR-02 taxonomy)

**What this closes:** Provides an audit-grade record of evaluation state that a replay harness can use to confirm bit-identical stable-field output.

**Required before:** Any automated N=3 determinism validation. Any formal replay audit capability.

---

### Minimum Determinism Requirements Summary

| Requirement | Closes | Type |
|-------------|--------|------|
| MDR-01: Stable advisory identity key | PND-02, ARD-02 | Schema design |
| MDR-02: Replay-stable field taxonomy | PND-01 | Schema design |
| MDR-03: Artifact-bound source attribution | PND-03, PT-02 | Script extension |
| MDR-04: Formal session identity | PND-06 | Script extension |
| MDR-05: Dynamic lineage_gaps | PND-05 | Script modification |
| MDR-06: Dynamic observability_state | PND-04 | Script modification |
| MDR-07: DEG-004 advisory emission | DRI-04, SRC-04 | Script extension |
| MDR-08: DEG-002 derivation status field | DRI-02 | Schema extension |
| MDR-09: Hidden influence audit | RF-04 (CRITICAL) | Code audit |
| MDR-10: Replay causality audit artifact | N=3 validation | New artifact |

**Meeting MDR-01..MDR-10 ≠ semantic authority authorization.**

---

## 8. Current Governance Verdict

The replay determinism verdict is derived exclusively from evidence in the authoritative inputs.

---

### Verdict Criteria Evaluation

**GVC-01: Does the advisory evaluator produce deterministic output by design?**
Evidence: stdlib only; no randomness; exact integer/None comparisons; fixed threshold constants
Result: YES — deterministic by design

**GVC-02: Is empirical determinism validated across N=3 reference runs?**
Evidence: N=1 reference run only (run_02_oss_fastapi_pipeline)
Result: NO — empirical determinism unvalidated

**GVC-03: Are all replay-stable fields formally identified and distinguished from time-varying fields?**
Evidence: No replay-stable field taxonomy exists; timestamps, observability_state, and lineage_gaps all present in provenance without classification
Result: NO — MDR-02 not met

**GVC-04: Is advisory identity stable across evaluator versions?**
Evidence: advisory_id = sequential counter; no stable identity key defined
Result: NO — MDR-01 not met; PND-02 present

**GVC-05: Is source attribution intrinsic to the provenance artifact (not script-version-dependent)?**
Evidence: ENRICHMENT_SOURCE_MAP hardcoded in capture_semantic_provenance.py; not in psee_binding_envelope.json
Result: NO — MDR-03 not met; PND-03 present

**GVC-06: Are all session-level artifact pairs formally linked?**
Evidence: implicit run_id linkage only; no session_id
Result: NO — MDR-04 not met; PND-06 present

**GVC-07: Is DEG-004 represented in the advisory artifact?**
Evidence: DEG-004 advisory_refs = []; participation_advisory.json has no ACTIVATION_NOT_AUTHORIZED record
Result: NO — MDR-07 not met; DRI-04 accountability gap present

**GVC-08: Has the hidden influence audit (RF-04) been performed?**
Evidence: no code audit performed; RF-04 governance severity = CRITICAL
Result: NO — MDR-09 not met; RF-04 UNVALIDATED

**GVC-09: Is the structural overlap placeholder state formally distinguished from derived-zero state?**
Evidence: structural_overlap.edge_count=0 has no derivation_status field
Result: NO — MDR-08 not met; DRI-02 semantic ambiguity present

**GVC-10: Is conflict detection logic implemented for simultaneous ADV-01 + ADV-02 triggers?**
Evidence: semantic_conflict advisory not implemented; DR-05 undefined behavior
Result: NO — semantic ambiguity scenario has undefined evaluator behavior

---

### Verdict: PARTIALLY_DETERMINISTIC

The current replay determinism maturity is **PARTIALLY_DETERMINISTIC**.

**Justification:**

The system achieves PARTIALLY_DETERMINISTIC because:
- The advisory evaluator logic is deterministic by construction (stdlib, exact comparisons, fixed thresholds)
- All four present degradation events are replayable with identical event_type, scope, and advisory_refs
- The gate evaluator logic is fully deterministic (hardcoded gates, fixed pass criteria)
- For a frozen script version and frozen input artifacts, the provenance record is reproducible modulo timestamps

The system does NOT achieve DETERMINISTIC_OBSERVABLE (the next level) because:
- 5 of 6 identified provenance nondeterminism sources are governance-blocking (PND-02..PND-06)
- Advisory identity is sequencing-dependent (MDR-01 not met)
- Source attribution is script-version-dependent (MDR-03 not met)
- DEG-004 is invisible in the advisory artifact (MDR-07 not met)
- Hidden influence (RF-04) is UNVALIDATED — CRITICAL governance severity
- N=1 empirical determinism validation

The system does NOT achieve GOVERNANCE_DETERMINISTIC_READY because:
- 10 minimum determinism requirements (MDR-01..MDR-10) are not met
- 10 minimum replayability thresholds from prior review are not met
- 9 minimum preconditions for derivation eligibility are not met

**Current progression:**

```
NOT_ELIGIBLE (preconditions review)
  → PARTIALLY_REPLAYABLE (replayability validation review)
    → PARTIALLY_DETERMINISTIC (this analysis)
      → DETERMINISTIC_OBSERVABLE (requires MDR-01..MDR-10)
        → REPLAY_GOVERNANCE_READY (requires RRT-01..RRT-06 + ATP-01..ATP-06)
          → AUTHORITY_REVIEW_ELIGIBLE (requires MPC-01..MPC-09)
            → [governance authority action required] → AUTHORIZED
```

Each level is a separate gate. Progress from PARTIALLY_DETERMINISTIC to DETERMINISTIC_OBSERVABLE requires the deterministic instrumentation design and implementation streams specified as the safe next step. No level implies the next automatically.

**The verdict is NOT governance-ready.** The governance-blocking determinism gaps (PND-02..PND-06) and the CRITICAL unvalidated risk (RF-04) prevent any replay governance claim from being asserted.

---

## 9. Safe Next Step

**Recommended contract:** PI.PSEE-PIOS.DETERMINISTIC-REPLAY-INSTRUMENTATION.DESIGN.01

---

### What This Design Does

1. **Replay-stable field taxonomy specification** — formally define which fields in semantic_provenance.json, participation_advisory.json, and gate_evaluation.json are REPLAY_STABLE vs TIME_VARYING vs VERSION_DEPENDENT (MDR-02). Produce a schema document that any future replay harness can reference.

2. **Stable advisory identity key specification** — define the advisory identity tuple `(advisory_type, advisory_state, frozenset(enrichment_inputs_used))` and specify how this key is computed, stored, and used in replay comparison (MDR-01). Produce the exact JSON schema extension needed.

3. **Session ID formalization design** — specify the session_id computation (hash or UUID), the embedding locations in gate_evaluation.json and participation_advisory.json, and the provenance chain cross-reference format (MDR-04).

4. **Dynamic lineage_gaps and observability_state specification** — specify the exact conditional logic for dynamically computing lineage_gaps and observability_state from advisory content (MDR-05, MDR-06). Produce the exact code change specification for capture_semantic_provenance.py.

5. **DEG-004 advisory emission design** — specify the new advisory type for ACTIVATION_NOT_AUTHORIZED: advisory_type, advisory_state, enrichment_inputs_used, advisory_reason_structured, advisory_reason text (MDR-07). Produce the exact advisory evaluator extension specification.

6. **DEG-002 derivation status field specification** — specify the `derivation_status` field extension for structural_overlap in psee_enrichment_schema.json and psee_binding_envelope.json (MDR-08). Produce the exact schema change.

7. **Hidden influence audit specification** — define exactly what constitutes a valid hidden influence audit of evaluate_enrichment_participation.py: which lines must be reviewed, what the audit pass criterion is, what structured artifact records the audit result (MDR-09). Produce the audit checklist and output schema.

8. **Replay causality audit artifact schema** — design the replay_causality.json schema (MDR-10): input artifact hashes, evaluator version identifiers, stable advisory identity keys, replay-stable field values. Produce the exact schema and capture logic specification.

9. **N=3 determinism test plan** — define the specific test protocol: how many reference runs, what counts as "identical inputs," how stable identity comparison is performed, what artifact records the test result.

---

### What This Design Does NOT Do

- Does NOT implement any of the above (implementation is a subsequent stream)
- Does NOT grant semantic authority
- Does NOT advance participation mode beyond OBSERVATIONAL_ONLY
- Does NOT implement enriched derivation
- Does NOT authorize selector execution
- Does NOT modify 75.x or 41.x scripts
- Does NOT change runtime behavior
- Does NOT implement BP-01 resolution (governance authority action)

---

### Why This Is the Safest Next Step

The 10 minimum determinism requirements (MDR-01..MDR-10) span four implementation targets:
1. Schema changes to psee_enrichment_schema.json (MDR-08)
2. Script modifications to capture_semantic_provenance.py (MDR-05, MDR-06)
3. Script extensions to evaluate_enrichment_participation.py (MDR-07, MDR-09)
4. Script extensions to evaluate_psee_gate.py + advisory evaluator (MDR-04)
5. New artifact design (MDR-10)

Implementing any of these without a design document risks:
- Partial closures that introduce new nondeterminism sources (e.g., implementing MDR-05 without MDR-06 creates a new inconsistency between lineage_gaps and observability_state)
- Advisory evaluator extensions that introduce hidden influence (without the audit specification in MDR-09, the extension might inadvertently add unlisted inputs)
- Session identity schemes that are incompatible with the replay causality artifact design (MDR-04 and MDR-10 must be co-designed)

The design stream front-loads all cross-requirement dependency analysis before any implementation proceeds. It produces a specification document that implementation streams can follow without guessing.

---

### What This Does NOT Recommend

Not recommended at this time (requires determinism design first):
- Implementing advisory format extension (AL-02/03/08) without deterministic replay design — would close format gaps without addressing PND-04/PND-05 nondeterminism
- Implementing N=3 advisory stability test without stable identity key (MDR-01) — test results would be unreliable if evaluator is updated
- Implementing source_map extension (PT-02) without session_id design (MDR-04) — source_map would be present but provenance chain linkage would remain fragile
- Implementing hidden influence audit without audit specification (MDR-09) — audit quality would be unverifiable

---

## 10. Validation

PASS criteria:

- [x] Replay determinism question explicitly defined and distinguished from replayability, reproducibility, authority readiness (Section 2, RDQ-01..RDQ-04)
- [x] Four-level separation stated: REPLAYABILITY (PARTIALLY_REPLAYABLE), DETERMINISM (PARTIALLY_DETERMINISTIC), REPRODUCIBILITY (NOT YET ASSESSED), AUTHORITY READINESS (NOT READY)
- [x] "No level implies the next" principle explicitly stated
- [x] Six advisory replay divergence dimensions analyzed (ARD-01..ARD-06) with LOW/MODERATE/HIGH classification
- [x] Two HIGH advisory divergence risks identified (ARD-01: enrichment input ambiguity, ARD-03: incomplete lineage chains)
- [x] Five degradation replay targets analyzed (DRI-01..DRI-05)
- [x] DEG-004 accountability gap identified (invisible in advisory artifact)
- [x] DEG-002 semantic ambiguity identified (placeholder vs. derived-zero)
- [x] DR-05 undefined behavior identified (conflict detection absent)
- [x] Six provenance nondeterminism sources analyzed (PND-01..PND-06)
- [x] Five governance-blocking nondeterminism sources identified (PND-02..PND-06)
- [x] All nondeterminism sources classified as REDUCIBLE (none irreducible)
- [x] Four semantic reconstruction consistency dimensions reviewed (SRC-01..SRC-04)
- [x] PARTIAL or NONDETERMINISTIC confirmed for all four dimensions
- [x] DEG-004 causality chain broken at advisory layer identified (SRC-04)
- [x] Ten minimum determinism requirements defined (MDR-01..MDR-10)
- [x] "meeting determinism requirements ≠ semantic authority authorization" explicitly stated
- [x] Governance verdict = PARTIALLY_DETERMINISTIC, justified from 10 verdict criteria (GVC-01..GVC-10)
- [x] Full progression ladder defined: NOT_ELIGIBLE → PARTIALLY_REPLAYABLE → PARTIALLY_DETERMINISTIC → DETERMINISTIC_OBSERVABLE → REPLAY_GOVERNANCE_READY → AUTHORITY_REVIEW_ELIGIBLE → [governance action] → AUTHORIZED
- [x] Verdict is NOT governance-ready — explicitly stated
- [x] RF-04 (hidden influence) CRITICAL/UNVALIDATED confirmed as governance-blocking
- [x] Safe next step = deterministic replay instrumentation design (not implementation)
- [x] Safe next step does NOT include semantic authority, enriched derivation, or participation mode advancement
- [x] No implementation performed
- [x] No runtime mutation
- [x] No threshold modification
- [x] Semantic authority remains blocked throughout
- [x] Activation sovereignty preserved

FAIL conditions check:

- Replayability conflated with determinism? NO — Section 2 explicitly defines and distinguishes all four concepts
- Determinism treated as authority authorization? NO — MDR principles section and verdict section both state "meeting determinism requirements ≠ semantic authority authorization"
- Provenance nondeterminism ignored? NO — 6 sources fully analyzed; 5 governance-blocking
- Semantic authority implicitly escalated? NO — verdict is PARTIALLY_DETERMINISTIC; participation mode unchanged; no derivation authorized
- Runtime behavior modified? NO — analysis only; no scripts created or modified

Status: PASS
