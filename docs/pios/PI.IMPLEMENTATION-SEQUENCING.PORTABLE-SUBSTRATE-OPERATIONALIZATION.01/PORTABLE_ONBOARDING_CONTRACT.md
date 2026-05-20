# Portable GitHub Substrate Onboarding Contract

> Canonical specification for onboarding an arbitrary GitHub repository into governed S1 qualification with deterministic replay and workflow projection.

---

## 1. Prerequisites

| Requirement | Detail |
|---|---|
| Source repository | Any public or accessible GitHub repository |
| Python 3.10+ | Pipeline scripts require Python 3.10+ |
| Node.js 18+ | LENS v2 runtime requires Node.js 18+ |
| k-pi-core clone | This repository, checked out at `main` |

---

## 2. Onboarding Steps

### Step 1: Client Registration

Create `clients/{client_id}/client.yaml`:

```yaml
client_id: {client_id}
uuid: {generated-uuid}
display_name: {org}/{repo}
source_type: github_clone
pipeline_mode: generic
ceu_model: static
ceu_count: 0
dom_group_count: 0
structural_node_count: 0
default_source: source_01
```

Fields `ceu_count`, `dom_group_count`, `structural_node_count` are populated after pipeline execution (Step 4).

### Step 2: Source Intake

```bash
python3 scripts/pios/source_intake.py \
  --client {client_id} \
  --source source_01 \
  --github-url https://github.com/{org}/{repo} \
  --run-id {run_id}
```

Produces:
- `clients/{client_id}/archives/{repo}-{sha}.tar` — source archive
- `clients/{client_id}/psee/runs/{run_id}/intake/` — extracted source tree
- `clients/{client_id}/psee/runs/{run_id}/intake/intake_manifest.json`
- `clients/{client_id}/psee/runs/{run_id}/intake/source_boundary_validation.json`

### Step 3: Source Manifest Registration

Create `clients/{client_id}/sources/source_01/source_manifest.json`:

```json
{
  "source_id": "source_01",
  "client_id": "{client_id}",
  "archive_type": "GITHUB_CLONE",
  "archive_filename": "{repo}-{sha}.tar",
  "archive_path": "clients/{client_id}/archives/{repo}-{sha}.tar",
  "sha256": "{computed_sha256}",
  "intake_contract": "PI.LENS.SOURCE-INTAKE.GENERIC.01",
  "extracted_path": "clients/{client_id}/psee/runs/{run_id}/intake/canonical_repo",
  "structure_path": "clients/{client_id}/psee/runs/{run_id}/structure",
  "ceu_grounding_path": "clients/{client_id}/psee/runs/{run_id}/ceu",
  "dom_layer_path": "clients/{client_id}/psee/runs/{run_id}/dom/dom_layer.json",
  "grounding_state_path": "clients/{client_id}/psee/runs/{run_id}/ceu/grounding_state_v3.json",
  "integration_validation_path": "clients/{client_id}/psee/runs/{run_id}/integration/integration_validation.json"
}
```

SHA256 is available from `source_boundary_validation.json`.

### Step 4: Pipeline Execution

```bash
python3 scripts/pios/run_client_pipeline.py \
  --client {client_id} \
  --source source_01 \
  --run-id {run_id}
```

Executes 11 phases:
1. Source Boundary — archive existence + SHA256 verification
2. Intake Verification — canonical_repo presence
3. 40.x Structural Verification — structural artifacts
3b. Semantic Derivation — CSR candidate extraction (optional, requires `--enable-semantic-derivation`)
4. CEU Grounding Verification — grounding readiness gate
5. Binding Envelope — CEU + DOM → PIOS schema nodes/edges
5b. CSR Semantic Topology — CSR → topology transform
6+7. 75.x Activation + 41.x Projection — signal/pressure computation
8a. Vault Construction — 9 vault artifacts
8b. Vault Readiness Validation — VR-01 through VR-09
9. Selector Update — LENS selector.json + available_runs.json

### Step 5: SQO Governance Projection

```bash
python3 scripts/pios/sqo_governance_projection.py \
  --client {client_id} \
  --run-id {run_id}
```

Produces:
- `clients/{client_id}/psee/runs/{run_id}/sqo/promotion_state.json` — S0→S1
- `clients/{client_id}/psee/runs/{run_id}/sqo/qualification_blockers.json`
- `clients/{client_id}/psee/runs/{run_id}/sqo/review_obligations.json`
- `clients/{client_id}/psee/runs/{run_id}/sqo/promotion_event_log.jsonl`

### Step 6: LENS Manifest Registration

Create LENS manifest at:
`app/execlens-demo/lib/lens-v2/manifests/{client_id}.{run_id}.json`

Add REGISTRY entry in `app/execlens-demo/lib/lens-v2/manifests/index.js`:

```javascript
'{client_id}': {
  '{run_id}': require('./{client_id}.{run_id}.json'),
},
```

### Step 7: Verification

| Check | Method |
|---|---|
| Vault readiness | `clients/{client_id}/psee/runs/{run_id}/vault/vault_readiness.json` status = "READY" |
| SQO state | `promotion_state.json` s_level = "S1" |
| LENS v2 rendering | Navigate to `/lens/{client_id}/{run_id}` |
| V2 cockpit rendering | Navigate to `/sqo/client/{client_id}/run/{run_id}/v2/` |

---

## 3. Pipeline Portability Assessment

### Fully Generic Components (~88% of pipeline)

| Component | Path | Status |
|---|---|---|
| source_intake.py | scripts/pios/ | Generic — handles GitHub clone + archive extraction |
| structural_scanner.py | scripts/pios/ | Generic — Python import analysis + file type classification |
| ceu_grounding.py | scripts/pios/ | Generic — pattern-matched CEU registration |
| dom_layer_generator.py | scripts/pios/ | Generic — 40.2/40.4 + grounding state → DOM layer |
| generate_semantic_topology.py | scripts/pios/ | Generic — CSR → topology transform |
| run_client_pipeline.py | scripts/pios/ | Generic — parameterized orchestrator |
| LENS v2 manifest registry | app/execlens-demo/lib/lens-v2/manifests/index.js | Generic — one-line addition per client |
| GenericSemanticPayloadResolver | app/execlens-demo/lib/lens-v2/generic/ | Generic — manifest-driven payload assembly |
| SQO V2 Cockpit | app/execlens-demo/components/sqo-cockpit/v2/ | Generic — posture-driven, no client-specific logic |
| QualificationPostureResolver | app/execlens-demo/lib/sqo-cockpit/ | Generic — 8-state posture derivation |

### Client-Specific Components (Layer A — correct separation)

| Component | Path | Scope |
|---|---|---|
| build_semantic_layer.py | scripts/pios/41.1/ | BlueEdge-specific semantic layer (embedded 17-domain model) |
| ClientScopedSectionResolver | app/execlens-demo/lib/sqo-cockpit/server/ | Layer A (extraction) vs Layer B (generic intake) dispatch |
| BlueEdge evidence rebase sections | app/execlens-demo/components/sqo-cockpit/ | BlueEdge-specific evidence loaders |

Layer A/B separation is architecturally correct. Layer A components are client-specific extraction; Layer B (SemanticQualificationIntakeResolver) provides generic intake for all clients.

---

## 4. S1 Qualification Characteristics

| Property | Value |
|---|---|
| Qualification level | S1 — Structural Proof |
| Authority ceiling | L3 |
| Promotion eligibility | false (S2 requires semantic remediation runtime) |
| Available SQO actions | Structural review, evidence review |
| Blocker resolution | Cannot auto-resolve (requires semantic remediation authority) |
| Terminal conditions | PERMANENTLY_UNQUALIFIABLE if structural extraction fails |

---

## 5. Boundaries

### What S1 Provides
- Deterministic structural substrate (40.x artifacts)
- CEU grounding state with coverage/reconstruction metrics
- Signal/pressure computation (41.x)
- Governed vault with 9 deterministic artifacts
- SQO qualification posture with blocker inventory
- LENS v2 visualization
- V2 cockpit workflow projection

### What S1 Does NOT Provide
- Semantic candidate review lifecycle (requires S2 operator workflow)
- Crosswalk derivation (requires semantic remediation runtime)
- Active debt resolution (requires authority workflow actions)
- Reconciliation loop (requires operational evidence rebase)
- S2 promotion (requires semantic remediation + authority gate)

---

## 6. Contract Authority

| Contract | Scope |
|---|---|
| PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.E2E.01 | Pipeline orchestrator |
| PI.LENS.SOURCE-INTAKE.GENERIC.01 | Source intake |
| PI.LENS.RUN-PATH-IDENTITY.CONTRACT-CLOSURE.01 | Run path identity |
| PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01 | Pipeline fixup authority |
