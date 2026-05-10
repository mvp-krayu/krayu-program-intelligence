# Qualification State Machine

**Stream:** PI.SEMANTIC-QUALIFICATION-LOOP.ROADMAP-AND-ARCHITECTURE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. State definitions

### S0: STRUCTURAL_ONLY

| Property | Value |
|----------|-------|
| Semantic properties | Canonical topology + DPSIG signals only. No semantic domains. No business labels. |
| Runtime behavior | Static HTML reports available via `/api/report-pack`. No manifest registration. No live binding. |
| Governance class | Not classified. No Q-class resolution possible. |
| Boardroom readiness | NOT_AUTHORIZED. Static reports only. |
| Projection permissions | NONE. No LENS v2 executive surface. |
| Runtime restrictions | Report-pack only. No page route. No semantic payload API. |
| Enrichment pathways | Run semantic bundle production → S1. |
| Failure conditions | No failure — S0 is a valid state. Pipeline completed. Reports generated. |
| UX manifestation | Static report viewer. No executive intelligence surface. |
| Disclosure obligations | None — S0 does not claim semantic intelligence. |

**Transition S0 → S1:**
- Prerequisite: run semantic bundle producer against the canonical topology.
- Output: `semantic_topology_model.json` with `semantic_level: STRUCTURAL_LABELS_ONLY`.
- Registration: create manifest + registry entry.

---

### S1: STRUCTURAL_LABELS_ONLY

| Property | Value |
|----------|-------|
| Semantic properties | Semantic topology model present. Domains exist but carry structural IDs only. No business labels. No lineage. `inference_prohibition: true`. |
| Runtime behavior | Manifest registered. Resolver returns REJECTED / REQUIRED_ARTIFACT_MISSING. API returns 424. Page returns 502. Report-pack returns 200. |
| Governance class | Not Q-classifiable. Required artifacts absent. |
| Boardroom readiness | NOT_AUTHORIZED. Structural skeleton visible, but no executive projection. |
| Projection permissions | DENIED. Fail-closed. No synthetic fallback. |
| Runtime restrictions | LIVE_BINDING_FAILED visible state. Structured error with missing artifact details. |
| Enrichment pathways | Provide richer source material → rerun semantic pipeline → produce crosswalk + decision_validation + reproducibility_verdict → S2. |
| Failure conditions | Missing: decision_validation, reproducibility_verdict, semantic_continuity_crosswalk. |
| UX manifestation | `LIVE_BINDING_FAILED` page with structured rejection. Report-pack HTML independently available. |
| Disclosure obligations | Surface shows `REQUIRED_ARTIFACT_MISSING` with the specific missing artifact key and path. No fabrication. |

**Reference case:** FastAPI `run_02_oss_fastapi_pipeline`.

**Transition S1 → S2:**
1. Enrich source material (ADRs, capability models, ownership docs).
2. Re-run semantic bundle producer → named domains with business labels.
3. Produce semantic continuity crosswalk.
4. Run decision validation.
5. Produce reproducibility verdict.
6. Emit rendering_metadata via the vault writer.
7. No code changes required — manifest already registered.

---

### S2: PARTIAL_GROUNDING_WITH_CONTINUITY

| Property | Value |
|----------|-------|
| Semantic properties | All 6 required artifacts present. Named domains with business labels. Partial structural grounding (0 < backed/total < 1). Validated semantic continuity. |
| Runtime behavior | Resolver returns LIVE, `ok: true`. 15-actor registry hydrated. Full canonical payload. |
| Governance class | Q-02 (PARTIAL_GROUNDING_WITH_STRUCTURAL_CONTINUITY). |
| Boardroom readiness | AUTHORIZED_WITH_QUALIFICATION. Executive projection permitted with Q-02 chip. |
| Projection permissions | FULL executive intelligence surface. Q-02 qualifier visible. Advisory confirmation required. |
| Runtime restrictions | Forbidden language: "probabilistic", "AI confidence", "estimated likelihood". Advisory confirmation mandatory before commitment. |
| Enrichment pathways | Improve grounding ratio: ground more domains via structural evidence → S3. Expand business labels via richer crosswalk. |
| Failure conditions | rendering_metadata absent → IP at PLACEHOLDER (still S2 but IP not ENFORCED). Crosswalk regression → drops to S1. |
| UX manifestation | Full LENS v2 surface. "QUALIFIER Q-02 · Partial Grounding · Structural Continuity" chip. Unresolved gaps disclosed. |
| Disclosure obligations | Q-02 chip with contract-mandated language. Unresolved semantic gaps enumerated. Advisory confirmation requirement stated. |

**Reference case:** BlueEdge `run_blueedge_productized_01_fixed`.

**Transition S2 → S3:**
1. Ground all semantic domains structurally (backed_count == total_count).
2. Maintain semantic continuity as VALIDATED.
3. Maintain evidence availability as AVAILABLE.
4. Q-class resolves to Q-01 automatically.

---

### S3: SEMANTICALLY_GOVERNABLE

| Property | Value |
|----------|-------|
| Semantic properties | All 6 required artifacts present. All domains structurally backed (backed_count == total_count). Full semantic continuity. |
| Runtime behavior | Resolver returns LIVE, Q-01. No qualifier chip needed. Full readiness badge. |
| Governance class | Q-01 (FULL_GROUNDING). |
| Boardroom readiness | FULLY_AUTHORIZED. No advisory qualification. |
| Projection permissions | FULL executive intelligence surface. No qualifier chip. Readiness badge alone sufficient. |
| Runtime restrictions | No advisory confirmation required. Standard governance constraints still apply (no AI inference, no fabrication). |
| Enrichment pathways | Extend signal classes (EXSIG, ORGSIG). Expand topology coverage. Deepen evidence chains. |
| Failure conditions | Domain grounding regression → drops to S2. Crosswalk regression → drops to S1. |
| UX manifestation | Full LENS v2 surface without qualifier chip. Clean readiness badge. Full executive confidence. |
| Disclosure obligations | None beyond standard governance. Q-01 does not require additional disclosure. |

**Reference case:** No client has achieved S3 yet.

---

### S4+: GOVERNED_COGNITION (Future)

| Property | Value |
|----------|-------|
| Semantic properties | S3 + governed agentic semantic layers (EXSIG, ORGSIG, FLOWSIG, RISKSIG). Multi-signal-class cognitive surface. |
| Runtime behavior | Multi-lane semantic payload. Governed enrichment overlays. Semantic drift detection active. |
| Governance class | Q-01 + signal class extensions per GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md §3 lifecycle. |
| Boardroom readiness | FULLY_AUTHORIZED + enhanced cognitive depth. |
| Projection permissions | Full surface + governed signal expansions. |
| Runtime restrictions | Each new signal class must complete the 6-stage extension lifecycle before projection. |
| Enrichment pathways | New signal classes via governed streams. Organizational intelligence. Flow intelligence. Risk intelligence. |
| Failure conditions | Signal class lifecycle incomplete → extension not projected. Existing S3 surface unaffected. |
| UX manifestation | Extended executive surface with multi-layer cognitive depth. Each layer governance-disclosed. |
| Disclosure obligations | Per-signal-class governance disclosure. Layer classification (L1/L2/L3) visible. |

---

## 2. State transition rules

```
S0 ──────→ S1 ──────→ S2 ──────→ S3 ──────→ S4+
   semantic    semantic    ground      governed
   bundle     enrichment  all domains  signal
   production pipeline    structurally extensions
```

**Forward transitions:**
- S0 → S1: semantic bundle production produces topology model.
- S1 → S2: semantic enrichment produces crosswalk + decision_validation + reproducibility_verdict.
- S2 → S3: all domains achieve EXACT or STRONG lineage.
- S3 → S4+: new signal classes complete 6-stage lifecycle.

**Backward transitions (degradation):**
- S3 → S2: domain grounding regresses (backed_count drops below total_count).
- S2 → S1: required semantic artifact becomes invalid or absent.
- S1 → S0: semantic topology model removed or invalidated.
- Any → S0: catastrophic pipeline regression (structural artifacts lost).

**Transition rules:**
1. No state may be skipped. S0 → S2 is forbidden (must pass through S1).
2. No state may be manually overridden. Q-class resolution is deterministic.
3. Backward transitions must be detected and disclosed, never hidden.
4. Each transition must be captured in qualification history.
5. Forward transitions require re-certification of all dependent artifacts.

---

## 3. State detection algorithm

```
function detectQualificationState(manifest, loadResult):
  if !manifest.artifacts.required.semantic_topology_model:
    return S0

  if loadResult.error == 'REQUIRED_ARTIFACT_MISSING':
    return S1

  if !loadResult.ok:
    return S1  // artifacts declared but invalid

  payload = resolveSemanticPayload(manifest)
  if payload.qualifier_summary.qualifier_class == 'Q-01':
    return S3
  if payload.qualifier_summary.qualifier_class in ['Q-02', 'Q-03']:
    return S2
  if payload.qualifier_summary.qualifier_class == 'Q-04':
    return S1  // evidence unavailable

  return S1  // fallback conservative
```

This algorithm is deterministic, replay-safe, and derives directly from existing resolver behavior.
