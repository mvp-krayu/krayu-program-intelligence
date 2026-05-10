# PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01 — Implementation

**Stream:** PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01
**Branch:** work/lens-v2-productization
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

This document records how the Q-02 governance amendment was implemented
end-to-end on the LENS V2 flagship surface, and how the
`rendering_metadata.json` vault artifact was introduced to enable
hydration of the Inference Prohibition (IP) actor.

---

## 1. Authority chain

| Authority                                   | Document                                                         |
|---------------------------------------------|------------------------------------------------------------------|
| Governance amendment (LOCKED)               | `docs/governance/Q02_GOVERNANCE_AMENDMENT.md`                     |
| Q-class matrix (machine-readable)           | `docs/governance/q02_governance_matrix.json`                      |
| Vault artifact schema (LOCKED)              | `docs/governance/runtime/rendering_metadata.schema.json`          |
| Stream contract                             | PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01                       |
| Baseline                                    | governed-dpsig-baseline-v1 (93098cb)                              |

The amendment extends the qualifier taxonomy under
`GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md` §4 ("Extend qualifier taxonomy
(Q-XX)") and §10 (Cognitive Projection Stabilization). It does not
modify any frozen lane (Lane A / Lane D DPSIG / 75.x thresholds).

---

## 2. Q-class model (LOCKED)

| Class | Name                                                | Render chip | Compat legacy |
|-------|-----------------------------------------------------|-------------|---------------|
| Q-01  | FULL_GROUNDING                                      | NO          | Q-00          |
| Q-02  | PARTIAL_GROUNDING_WITH_STRUCTURAL_CONTINUITY        | YES         | Q-01          |
| Q-03  | SEMANTIC_ONLY                                       | YES         | Q-02          |
| Q-04  | UNAVAILABLE                                         | NO (absence notice) | Q-04 |

Resolution rule (`Q02-RES-RULE-01`):

```
if (evidence_availability != 'AVAILABLE') → Q-04
let r = backed_count / total_count
if (r == 1.0) → Q-01
if (r == 0)   → semantic_continuity_status == 'VALIDATED' ? Q-03 : Q-04
if (0 < r < 1.0) → semantic_continuity_status == 'VALIDATED' ? Q-02 : Q-03
```

The resolver is a pure deterministic function; no AI inputs, no
probabilistic semantics. It implements the four-class model in
`app/execlens-demo/lib/lens-v2/QClassResolver.js`.

---

## 3. Rendering metadata schema (LOCKED)

The wire schema lives at
`docs/governance/runtime/rendering_metadata.schema.json`. The required
fields are:

- `rendering_contract_version`
- `client_id`, `run_id`, `generated_at`
- `semantic_projection_class` (enum)
- `inference_prohibition_status` (enum: `ENFORCED` / `PLACEHOLDER_PENDING`)
- `grounding_class` (enum: Q-01..Q-04)
- `semantic_continuity_status` (enum: `VALIDATED` / `ABSENT`)
- `replay_safe` (must be `true`)
- `topology_safe` (must be `true`)
- `unresolved_semantic_gaps` (array)
- `disclosure_requirements` (non-empty array)
- `governance_assertions` (must declare all six negation flags)
- `actor_projection_status` (15 entries, 2-letter codes)

The JS-side validator + builder lives at
`app/execlens-demo/lib/lens-v2/RenderingMetadataSchema.js` and is used
by both the vault writer and the resolver to fail closed on any
non-compliant document.

---

## 4. Vault writer

Location: `scripts/pios/PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01/emit_rendering_metadata.js`.

Behaviour:

- Reads `semantic_topology_model.json`, `decision_validation.json`,
  `semantic_continuity_crosswalk.json`, and `dpsig_signal_set.json`.
- Determines `(backed_count, total_count, semantic_continuity_status,
  evidence_availability)` from those artifacts.
- Calls `QClassResolver.resolveQClass(...)`.
- Builds the rendering metadata document via
  `buildRenderingMetadata(...)`.
- Computes a self-hash (`sha256:...`) over the canonicalised payload.
- Validates against the schema; **fails closed** on any error.
- Writes the canonicalised JSON to
  `clients/<client>/psee/runs/<run>/vault/rendering_metadata.json` —
  additive, never mutates prior artifacts.

Replay safety:

- JSON is canonicalised (sorted keys at every depth).
- `generated_at` is anchored on `dpsig_signal_set.generated_at` so the
  output is byte-stable for byte-stable inputs.
- Determinism verified by re-emitting and diffing — see VALIDATION
  document.

Authority gating: `--client` and `--run` are validated against
`ALLOWED_CLIENTS`/`ALLOWED_RUNS`; unknown values cause exit code 64.

---

## 5. Live payload resolver upgrade

`BlueEdgePayloadResolver.js` now:

1. Adds `rendering_metadata` to its known artifact paths
   (`<run>/vault/rendering_metadata.json`).
2. Loads it as an optional source artifact; validates the document via
   `validateRenderingMetadata`.
3. Surfaces `IP_RENDERING_METADATA` as an unresolved gap **only when the
   artifact is absent**. When present and invalid, surfaces
   `IP_RENDERING_METADATA_INVALID` with `ADVISORY_REQUIRED` impact.
4. Passes `renderingMetadata` to the actor hydrator.
5. Computes the qualifier via `QClassResolver` (consumed by the
   hydrator) and exposes:
   - `qualifier_summary.qualifier_class` — NEW governance class (Q-02)
   - `qualifier_summary.qualifier_class_compat` — LEGACY compat (Q-01)
   - `qualifier_summary.semantic_projection_class`
   - `qualifier_summary.derivation_rule_id` (`Q02-RES-RULE-01`)
   - `qualifier_summary.amendment_anchor`
   - top-level `qualifier_class` — LEGACY compat (Q-01) so existing
     `QualifierChipAdapter` / `ReadinessBadgeAdapter` keep working
   - top-level `qualifier_class_governance` — NEW class (Q-02) for live
     surfaces
6. The fixture-compat `rendering_metadata` block on the payload now
   carries `binding_status: INFERENCE_PROHIBITION_ENFORCED` and exposes
   the live document under `rendering_metadata.rendering_metadata_live`.

---

## 6. Actor hydrator upgrade

`SemanticActorHydrator.js` now:

- Accepts `renderingMetadata` as an input.
- When present, the IP actor transitions from
  `PLACEHOLDER_BINDING_PENDING` → **`HYDRATED`** with:
  - `inference_prohibition_status: 'ENFORCED'`
  - `grounding_class: 'Q-02'`
  - `semantic_projection_class`
  - `qualifier_rules_applied`
  - `disclosure_requirements`
  - `unresolved_semantic_gaps_count`
  - `rendering_metadata_hash`
  - `governance_assertions`
- Replaces the legacy `deriveQualifierClass` with a thin shim over
  `QClassResolver.resolveQClass`. The returned `derived` object now
  also carries `qualifier_class_compat`, `semantic_projection_class`,
  and the resolution rule metadata.

Status distribution (BlueEdge productized run):

| Status                       | Count |
|------------------------------|-------|
| HYDRATED                     | 12    |
| HYDRATED_WITH_DERIVATION     | 2     |
| PLACEHOLDER_BINDING_PENDING  | 0     |
| PRESENTATION_LAYER_DERIVED   | 1     |
| **Total**                    | **15** |

---

## 7. Live surface disclosure upgrade

`pages/lens-v2-flagship.js`:

- New `governanceQualifier` / `governanceQualifierLabel` /
  `governanceQualifierNote` derived in the page from
  `livePayload.qualifier_summary`.
- `QualifierMandate` rewritten:
  - Q-01 (FULL_GROUNDING) and Q-04 (UNAVAILABLE) → no chip rendered.
  - Q-02 → "QUALIFIER Q-02 · Partial Grounding · Structural Continuity"
    plus the contract-mandated executive note.
  - Q-03 → "QUALIFIER Q-03 · Semantic Continuity Only" plus the
    executive-caution note.
- Live banner now disambiguates IP state:
  - `INFERENCE PROHIBITION: BINDING PENDING` (legacy / placeholder)
  - `INFERENCE PROHIBITION: ENFORCED` (live, hydrated)
  - and appends `QUALIFIER Q-02` for visibility.
- A page-level chip override (`adaptedDisplay`) replaces
  `adapted.qualifierChip.{class_label, tooltip_text, qualifier_class,
  renders}` with the governance-true values so every downstream
  component (RepEvidenceState, SupportRail, ActorCard variants,
  BoardroomCard) displays the new Q-02 language without modifying the
  legacy chip adapter (which retains its fixture-era tests).

Forbidden language is absent from all user-facing prose. Verified by
the live-binding regression suite.

---

## 8. Tests

| Suite                                                           | Tests | Result   |
|-----------------------------------------------------------------|-------|----------|
| `flagship-experience/tests/q02-and-ip.test.js` (new)            | 36    | ✅ PASS  |
| `flagship-experience/tests/live-binding.test.js` (updated)      | 37    | ✅ PASS  |
| `flagship-experience/tests/flagshipExperience.test.js`          | unchanged | ✅ PASS |
| `flagship-experience/tests/flagshipSpinoffSmoke.test.js`        | unchanged | ✅ PASS |
| `validation/tests/*`                                            | unchanged | ✅ PASS |
| `adapters/tests/*`                                              | unchanged | ✅ PASS |
| `components/*/tests/*`                                          | unchanged | ✅ PASS |
| **Aggregate (execlens-demo)**                                   | **720**   | **✅ 720/720** |

Notable test families on the new suite:

- Q-class four-class resolution (FULL → Q-01, PARTIAL+CONTINUITY →
  Q-02, SEMANTIC_ONLY → Q-03, UNAVAILABLE → Q-04, partial without
  continuity → Q-03 not Q-02, total_count==0 → Q-04).
- Determinism (same inputs → identical outputs).
- Q-class metadata contains no probabilistic / AI-confidence wording.
- Compat translations are bidirectional for canonical classes.
- RenderingMetadataSchema rejects invalid / replay_safe=false /
  topology_safe=false / no_ai_inference=false / fewer-than-15-actors.
- Vault artifact validates against the schema.
- Vault writer is byte-identical on re-run.
- Vault writer rejects unknown clients / runs with non-zero exit.
- Live payload exposes Q-02 governance + Q-01 legacy compat.
- IP actor HYDRATED with INFERENCE_PROHIBITION_STATUS=ENFORCED.
- IP_RENDERING_METADATA no longer in unresolved_gaps.
- Adapter pipeline still EXECUTIVE_READY_WITH_QUALIFIER, no warnings.
- Forbidden language absent from user-facing prose.

---

## 9. Visual verification

Captured at viewport `1440×900` against
`http://localhost:3002/lens-v2-flagship` under live binding (zero app
console errors; only a transient `favicon.ico` 404 unrelated to
governance):

- `screenshots/balanced_1440x900_q02.png`
- `screenshots/dense_1440x900_q02.png`
- `screenshots/investigation_1440x900_q02.png`
- `screenshots/boardroom_1440x900_q02.png`

Every mode visibly displays:

- `LIVE SUBSTRATE · BlueEdge productized · run_blueedge_productized_01_fixed · baseline 93098cb · INFERENCE PROHIBITION: ENFORCED · QUALIFIER Q-02`
- `OPERATIONAL POSTURE · EXECUTIVE READY — QUALIFIED`
- `QUALIFIER Q-02 · Partial Grounding · Structural Continuity` with the
  contract-mandated executive note ("Semantic continuity is validated.
  Some semantic domains lack structural backing; advisory confirmation
  is mandatory before executive commitment.")

---

## 10. Backward compatibility

- The fixture-compat top-level `qualifier_class` field continues to
  carry the LEGACY adapter class (Q-01 for BlueEdge), so the existing
  `QualifierChipAdapter`, `ReadinessBadgeAdapter`,
  `EvidenceDrawerAdapter`, `SignalCardAdapter` regression tests pass
  unchanged.
- The new governance class is exposed exclusively via
  `qualifier_summary.qualifier_class` (and the new
  `qualifier_class_governance` mirror at the top level).
- The live page consumes the governance class directly for the
  qualifier chip / banner; downstream components receive an enriched
  `adaptedDisplay.qualifierChip` whose `class_label` / `tooltip_text` /
  `qualifier_class` reflect the new amendment.

This separation honours the contract's "preserve backward governance
compatibility" obligation while ensuring the live executive surface is
governance-true.
