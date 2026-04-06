# Multi-Client Runtime Pattern

**Document:** multi_client_runtime_pattern.md
**Stream:** PSEE.RECONCILE.1.WP-11

---

## Shared Engine vs Client Config Separation

| Layer | Location | Responsibility |
|---|---|---|
| Shared engine logic | `scripts/psee/build_runtime_envelope_generic.py` | Score derivation, artifact construction, verification outcome derivation |
| Shared intake logic | `scripts/psee/run_intake_replay_generic.py` | Manifest loading, run_id validation, verification outcome mapping, intake result writing |
| Client configuration | `clients/<client_id>/psee/config/runtime_profile.json` | All client-specific values: score, coverage, reconstruction, evidence basis |
| Client runtime outputs | `clients/<client_id>/psee/runs/<run_id>/` | Package artifacts and intake results, scoped per client and run |

No client-specific branching exists in the shared engine scripts. All behavioral differences come from the config.

---

## Path Patterns

| Pattern | Path |
|---|---|
| Client config | `clients/<client_id>/psee/config/runtime_profile.json` |
| Package root | `clients/<client_id>/psee/runs/<run_id>/package/` |
| Intake output | `clients/<client_id>/psee/runs/<run_id>/intake/` |
| Downstream outputs | `clients/<client_id>/psee/runs/<run_id>/outputs/` |

---

## Required Per-Client Config Fields

`runtime_profile.json` must contain:

| Field | Purpose |
|---|---|
| `client_id` | Must match `--client` argument |
| `run_id` | Must match `--run-id` argument |
| `package_version` | Artifact package version |
| `source_system` | Must be `PSEE` |
| `gauge_score` | Declared baseline score (engine derives independently) |
| `gauge_projection` | Projected score ceiling |
| `coverage_class` | DIM-01 class label (FULL / PARTIAL / LOW) |
| `coverage_percent` | Numeric coverage percentage |
| `coverage_required_units` | Total required intake units |
| `coverage_admissible_units` | Admitted units count |
| `reconstruction_status` | DIM-02 state (PASS / PARTIAL / FAIL) |
| `reconstruction_validated_units` | Units validated in reconstruction |
| `reconstruction_total_units` | Total units evaluated |
| `execution_status` | Engine lifecycle phase |
| `execution_mode` | Execution mode label |
| `escalation_clearance` | Escalation clearance value (0–100) |
| `unknown_space_count` | Count of unknown-space records |
| `evidence_basis` | Free-text description of evidence provenance |
| `expected_domains` | List of expected verification domain names |
| `lifecycle_state` | Package lifecycle state |

---

## Replayability Rule

A run is replayable if and only if:
1. `runtime_profile.json` exists and is unchanged
2. The generic builder script is run with `--client <id> --run-id <run_id>`
3. The generic intake script is run with the same arguments
4. Outputs are deterministic given the same config (except `emission_timestamp` which reflects wall clock)

---

## Repeatability Rule Across Clients

The same engine scripts operate identically across all clients. Repeatability is proved when:
- Two distinct clients each have a `runtime_profile.json`
- Both clients produce structurally valid packages using the same generic builder
- Both clients produce valid intake results using the same generic intake runner
- The verification outcome for each client is derived independently from its own artifact state
- No client-specific code paths exist in the shared scripts
