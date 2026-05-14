# STEP 0 — Brain-Governed Onboarding Record

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
Date: 2026-04-24
Status: COMPLETE
Step: STEP 0 — Brain-Governed Onboarding

---

## Client Identity

| Field | Value |
|---|---|
| `client_uuid` | `e65d2f0a-dfa7-4257-9333-fcbb583f0880` |
| `business_client_id` | `oss-fastapi-modular` |
| `client_display_name` | `OSS FastAPI Modular Monolith` |
| `lifecycle_state` | `ACTIVE` |

---

## PRE-GATE Confirmation

- **PRE-GATE classification:** PASS
- **Record path:** `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/pregate_run_01/pregate_viability_record.json`
- **Checks passed:** bounded_source (87 files), reproducibility (manifest 87 lines, source_version `04dcdc9ae62e94d55f528cb89493a72b448845ab`), structural_density (64 .py, 217 imports, 5 test files)
- **Tier eligibility:** Tier 1 ELIGIBLE, Tier 2 ELIGIBLE, Tier 3 ELIGIBLE

PRE-GATE classification was PASS before STEP 0 began. This confirmation is required by the plan's STEP 0 ENTRY CONDITIONS.

---

## Intake Selector Confirmation

- **Intake selector bound:** YES
- `selector_type`: `local_directory`
- `source_uri`: `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/source/fastapi-backend`
- `source_version`: `04dcdc9ae62e94d55f528cb89493a72b448845ab`
- `checksum_manifest`: `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/manifests/fastapi-backend.manifest.sha256`
- `evidence_boundary`: `.py`, `.md`, `.toml`, `.yaml`, `.yml`, `.json`; excludes `.git`, `__pycache__`, `.venv`, build/dist artifacts

Selector is fully defined. DECISION-03 is locked.

---

## 4-Brain Governance Binding

**Client registered as governed entity across CANONICAL, CODE, PRODUCT, PUBLISH brains.**

| Brain | Binding act | Record |
|---|---|---|
| **CANONICAL** | Client identity established as immutable UUID-based canonical entity; evidence boundary declared; isolation invariant asserted — all downstream artifacts are scoped to `e65d2f0a-dfa7-4257-9333-fcbb583f0880` exclusively | `client.yaml` |
| **CODE** | `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/config/client.yaml` created as the authoritative client descriptor; tenant_mapping confirmed (`--client` = `--tenant` = UUID); no named alias directory created | `client.yaml` |
| **PRODUCT** | Client is an active engagement; evidence is real (OSS FastAPI Modular Monolith, public repository, pinned SHA); time-to-onboarding clock starts from this record | This record |
| **PUBLISH** | No external claim has been made; client identity is confidential; no external artifact references this client | This record |

---

## Artifacts Created in STEP 0

| Artifact | Path | Git-tracked |
|---|---|---|
| Client config descriptor | `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/config/client.yaml` | YES |
| STEP 0 governance record | `docs/programs/second-client-kill-plan-01/decisions/step0_onboarding_record.md` | YES |

---

## Scope Note — client_index.json

`clients/registry/client_index.json` was NOT updated in this contract chunk. The plan's STEP 0 EXIT CONDITIONS (CANONICAL) require a new entry in `client_index.json`. This registration must be completed before STEP 7 executes (the PSEE pipeline requires a registered client). A follow-up action or the STEP 1 contract must address this before the pipeline can run.

The `client.yaml` at `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/config/` is the canonical client descriptor created in this step. `client_index.json` registration is the global registry act that makes this client addressable system-wide.

---

## Confirmations

- **No runtime execution performed:** confirmed — no PiOS, PSEE, IG, GAUGE, LENS, npm, pip, or pipeline commands were run
- **STEP 0 complete:** confirmed — client descriptor written; intake selector bound; 4-brain governance binding recorded; PRE-GATE PASS confirmed
- **STEP 1 not executed:** confirmed
- **`clients/blueedge/` unmodified:** confirmed
- **`docs/baseline/pios_baseline_v1.0.md` unmodified:** confirmed
- **`clients/oss-fastapi-modular/` not created:** confirmed — named alias directory absent
