# Client C Onboarding Model

**Stream:** PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

This playbook describes how a future Client C (any DPSIG-governed
client/run) is onboarded onto the LENS V2 flagship surface. The cost
is bounded to **configuration + certified artifacts + validation**.
There is **no bespoke UI engineering**.

---

## 1. What the DPSIG pipeline must emit (UPSTREAM)

For Client C to be onboard-able, the governed PSEE pipeline run for
Client C MUST produce the following certified artifacts at known
repo-relative paths:

### 1.1 Required artifacts (the resolver fails closed without these)

| Canonical id                 | What it provides                                   |
|------------------------------|----------------------------------------------------|
| `semantic_topology_model`    | Per-domain lineage_status (EXACT / STRONG / WEAK / NONE), business labels, cluster mappings |
| `decision_validation`        | VF-01..VF-08 checks; emits score, band, posture; verifies governance gates |
| `reproducibility_verdict`    | Verdict over the run (`FULL_REPRODUCIBILITY` / partial / failed) |
| `semantic_continuity_crosswalk` | DOM-XX → business-label crosswalk; presence implies semantic continuity is VALIDATED |
| `canonical_topology_40_4`    | Canonical 40.4 topology snapshot with cluster ids, node counts, hash |
| `dpsig_signal_set`           | Lane D DPSIG signal-set with TAXONOMY-01 fields per signal (replay_class, denominator_guard, derivation_trace, provenance_chain) |

### 1.2 Optional artifacts (resolver records gaps when absent)

| Canonical id                    | Effect when absent                              |
|---------------------------------|-------------------------------------------------|
| `structural_topology_log_40_3`  | NON_BLOCKING gap                                |
| `signal_registry`                | NON_BLOCKING gap; PSIG impact downgraded         |
| `evidence_trace`                 | NON_BLOCKING gap                                |
| `vault_readiness`                | NON_BLOCKING gap                                |
| `semantic_bundle_manifest`       | NON_BLOCKING gap                                |
| `rendering_metadata`             | INFERENCE_PROHIBITION_PLACEHOLDER gap; IP actor falls back to `PLACEHOLDER_BINDING_PENDING` |

### 1.3 Report pack artifacts (optional but typical)

The four executive HTML reports the runtime exposes via
`/api/report-pack` (binding-status reports `AVAILABLE` if file present,
`PENDING` otherwise):

- `decision-surface`
- `tier1-narrative`
- `tier1-evidence`
- `tier2-diagnostic`

---

## 2. What manifest must be created (CONFIGURATION)

A single JSON file at:

```
app/execlens-demo/lib/lens-v2/manifests/<client>.<run>.json
```

It MUST conform to
`docs/governance/runtime/client_run_manifest.schema.json` and declare:

```jsonc
{
  "manifest_version": "1.0",
  "client": "<client>",
  "run_id": "<run>",
  "stream_anchor": "PI.<client>.LENS-LIVE-BINDING.<n>",
  "amendment_anchor": "docs/governance/Q02_GOVERNANCE_AMENDMENT.md",
  "labels": {
    "client_display_name": "<Display>",
    "run_display_name": "<Display> productized · <run>"
  },
  "baseline": {
    "governance_tag": "governed-dpsig-baseline-v1",
    "pipeline_commit": "<sha>"
  },
  "artifacts": {
    "required": {
      "semantic_topology_model": "<path>",
      "decision_validation": "<path>",
      "reproducibility_verdict": "<path>",
      "semantic_continuity_crosswalk": "<path>",
      "canonical_topology_40_4": "<path>",
      "dpsig_signal_set": "<path>"
    },
    "optional": {
      "structural_topology_log_40_3": "<path>",
      "signal_registry": "<path>",
      "evidence_trace": "<path>",
      "vault_readiness": "<path>",
      "semantic_bundle_manifest": "<path>",
      "rendering_metadata": "<path>"
    }
  },
  "report_pack": {
    "decision-surface":  "<path>",
    "tier1-narrative":   "<path>",
    "tier1-evidence":    "<path>",
    "tier2-diagnostic":  "<path>"
  },
  "governance": {
    "lane_a_read_only": true,
    "lane_d_dpsig_read_only": true,
    "additive_only": true,
    "no_ai_inference": true,
    "no_topology_mutation": true,
    "no_synthetic_telemetry": true
  }
}
```

Path constraints:

- All paths MUST be repo-relative (no `..`, no absolute, no `C:\`).
- The wire schema enforces this; the loader rejects anything that
  resolves outside REPO_ROOT.

Then add a one-line registry entry to
`app/execlens-demo/lib/lens-v2/manifests/index.js`:

```js
const REGISTRY = {
  blueedge: { run_blueedge_productized_01_fixed: 'blueedge.run_blueedge_productized_01_fixed.json' },
  client_c: { run_client_c_certified_01:        'client_c.run_client_c_certified_01.json' },
};
```

---

## 3. What validation must pass

Run the existing generic-resolver suite — it structurally validates any
registered manifest:

```
REPO_ROOT=$(pwd) node --test \
  app/execlens-demo/flagship-experience/tests/generic-semantic-payload-resolver.test.js
```

For Client C, the suite will verify:

- The manifest validates against `ClientRunManifestSchema`.
- Required artifacts load successfully.
- Missing required artifacts fail closed.
- The resolved canonical payload validates against
  `LensSemanticPayloadSchema`.
- Q-class is derived correctly from
  `(backed_count, total_count, semantic_continuity_status,
  evidence_availability)`.
- IP actor hydrates from `rendering_metadata` if present.

If `rendering_metadata.json` is required (Q-02 ENFORCED), emit it via:

```
REPO_ROOT=$(pwd) node \
  scripts/pios/PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01/emit_rendering_metadata.js \
  --client client_c \
  --run    run_client_c_certified_01
```

Note: the emitter currently has its own `ALLOWED_CLIENTS` /
`ALLOWED_RUNS` allow-list. Extend that list at the top of the script
to include the new pair.

---

## 4. What LENS consumes

The LENS V2 runtime consumes the canonical `lens_semantic_payload`
shape (per
`docs/governance/runtime/lens_semantic_payload.schema.json`).
Specifically:

- `binding_status` — `LIVE` for a successful resolution
- `qualifier_summary.qualifier_class` — governance class (Q-01..Q-04)
- `qualifier_class` (top-level) — legacy compat class
- `actor_registry` — 15 canonical actors with hydration status
- `source_artifacts` — per-artifact `{path, ok, valid?, hash?}`
- `unresolved_gaps` — explicit gaps with codes + impact
- `report_pack.artifacts` — declared report ids with binding status
- `governance_assertions` — six negation flags (all `true`)
- `rendering_metadata.binding_status` — `INFERENCE_PROHIBITION_*`
- DPSIG-derived fields: `dpsig_signal_summary`, `trace_summary`

The page at `/lens-v2-flagship` consumes this payload via
`getServerSideProps` and routes the IP actor + Q-class through the
existing components. **No UI changes are required** for a new client.

---

## 5. What requires no engineering

For a Client C onboarding that has the certified artifact set and
follows the manifest contract above:

- **No** new resolver code.
- **No** new mapper code.
- **No** new actor hydrator code.
- **No** new schema code.
- **No** new API route.
- **No** new page route.
- **No** new component.
- **No** new test scaffolding (the existing parity tests cover
  manifest schema and payload schema validation generically).

---

## 6. What still requires upstream semantic grounding

These are upstream pipeline obligations the LENS layer cannot supply:

- **Lineage classification** of each semantic domain
  (EXACT / STRONG / WEAK / NONE) — produced by 41.x.
- **Decision validation gates** (VF-01..VF-08) — produced by 75.x.
- **Reproducibility verdict** — produced by the pipeline run.
- **DPSIG signal set** with TAXONOMY-01 fields — produced by Lane D.
- **Semantic continuity crosswalk** — produced by 41.x.
- **Canonical 40.4 topology** — produced by 40.x.
- **rendering_metadata.json** — produced by the Q02 amendment emitter
  (`scripts/pios/PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01/`).

The LENS layer is **consumer-only** for these. No "plug a missing
artifact in by inferring it" is permitted.

---

## 7. What fails closed

If any of the following holds for Client C, the runtime will visibly
fail rather than fabricate:

| Condition                                         | Behaviour                                |
|---------------------------------------------------|------------------------------------------|
| Pair not in registry                              | `binding_status: REJECTED`, `error: CLIENT_NOT_ALLOWED` / `RUN_NOT_ALLOWED` |
| Manifest invalid                                  | `binding_status: REJECTED`, `error: MANIFEST_INVALID` (with errors) |
| Manifest declares traversal / absolute paths      | Manifest-schema rejection                |
| Required artifact missing                         | `binding_status: REJECTED`, `error: REQUIRED_ARTIFACT_MISSING` (with key + path) |
| Optional artifact missing                         | `unresolved_gaps` entry; binding still LIVE |
| `rendering_metadata` absent                       | `unresolved_gaps`: `IP_RENDERING_METADATA` (INFERENCE_PROHIBITION_PLACEHOLDER); IP actor → `PLACEHOLDER_BINDING_PENDING` |
| `rendering_metadata` invalid                      | `unresolved_gaps`: `IP_RENDERING_METADATA_INVALID`; IP actor → `PLACEHOLDER_BINDING_PENDING` |
| Page receives no payload (resolver throws)        | `LIVE_BINDING_FAILED` visible state      |

There is no fixture fallback. There is no synthetic recovery. There is
no AI inference filling in the gap.

---

## 8. End-to-end Client C onboarding checklist

- [ ] Pipeline run produces all required artifacts at known paths.
- [ ] Per-run vault includes `rendering_metadata.json` if Q-02
      governance is to be enforced.
- [ ] Manifest JSON authored at
      `app/execlens-demo/lib/lens-v2/manifests/<client>.<run>.json`.
- [ ] Manifest validates against `ClientRunManifestSchema`.
- [ ] Registry entry added in `manifests/index.js`.
- [ ] (If applicable) emitter `ALLOWED_CLIENTS`/`ALLOWED_RUNS`
      extended in
      `scripts/pios/PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01/emit_rendering_metadata.js`.
- [ ] `rendering_metadata.json` emitted (replay-safe, byte-identical
      on re-run).
- [ ] Generic-resolver test suite passes for the new pair.
- [ ] Full execlens-demo regression remains 753/753.
- [ ] Visual smoke check on `/lens-v2-flagship?...` (when the page
      gains a client/run query parameter — currently the page hard-binds
      to BlueEdge as the only certified pair; multi-client surface is a
      separate downstream stream).

---

## 9. Note on the page's current client binding

Today, `pages/lens-v2-flagship.js` hard-binds to:

```js
const LIVE_BINDING_CLIENT = 'blueedge'
const LIVE_BINDING_RUN = 'run_blueedge_productized_01_fixed'
```

The resolver is generic; the **page** is not yet parameterised. A
trivial follow-up stream can switch the page to read `client` /
`run` from the query string and render any allow-listed pair. That
work is intentionally out of scope here — this stream productizes the
RESOLVER. The page binding swap is a one-route change with no resolver
or governance impact.
