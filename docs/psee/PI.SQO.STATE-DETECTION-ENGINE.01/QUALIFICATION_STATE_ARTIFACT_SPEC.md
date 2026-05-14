# Qualification State Artifact Specification

**Stream:** PI.SQO.STATE-DETECTION-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Artifact schema

### qualification_state.v1.json

```json
{
  "schema_version": "1.0",
  "client": "<client>",
  "run_id": "<run_id>",
  "qualification_state": {
    "s_state": "S0 | S1 | S2 | S3",
    "state_label": "<canonical label from S_STATES enum>",
    "state_reason": "<evidence-derived reason for this state>",
    "authorization_tier": "NOT_AUTHORIZED | AUTHORIZED_WITH_QUALIFICATION | FULLY_AUTHORIZED",
    "boardroom_readiness": "REPORT_PACK_ONLY | NOT_READY | BOARDROOM_QUALIFIED | BOARDROOM_READY",
    "projection_permission": "NONE | DENIED | EXECUTIVE_SURFACE_WITH_QUALIFIER | FULL_EXECUTIVE_SURFACE"
  },
  "evidence": {
    "manifest_registered": true,
    "required_artifacts_declared": ["<key>", ...],
    "required_artifacts_present": ["<key>", ...],
    "required_artifacts_missing": ["<key>", ...],
    "loader_status": "OK | REQUIRED_ARTIFACT_MISSING | <error>",
    "binding_status": "LIVE | REJECTED | NOT_RESOLVED",
    "q_class": "Q-01 | Q-02 | Q-03 | Q-04 | NOT_AVAILABLE",
    "qualifier_summary": { ... }
  },
  "governance": {
    "fail_closed": true,
    "client_agnostic": true,
    "no_semantic_fabrication": true,
    "no_source_mutation": true,
    "sqo_advisory_only": true
  },
  "provenance": {
    "source_commit": "<git commit hash (12 chars)>",
    "input_hashes": { "<artifact_key>": "present", ... },
    "operation": "detect_qualification_state",
    "operation_version": "1.0",
    "output_hash": "sha256:<hex>"
  }
}
```

### qualification_history.v1.json

```json
{
  "schema_version": "1.0",
  "client": "<client>",
  "run_id": "<run_id>",
  "current_state": "S0 | S1 | S2 | S3",
  "prior_state": "S0 | S1 | S2 | S3 | null",
  "history_entries": [
    {
      "timestamp": "<ISO-8601>",
      "s_state": "S0 | S1 | S2 | S3",
      "state_label": "<canonical label>",
      "prior_state": "null | S0 | S1 | S2 | S3",
      "transition_type": "INITIAL | FORWARD | DOWNGRADE | STABLE",
      "transition_cause": "<evidence-derived cause>",
      "evidence_snapshot": {
        "loader_status": "<status>",
        "binding_status": "<status>",
        "q_class": "<class>",
        "required_artifacts_present_count": 0,
        "required_artifacts_missing_count": 0
      },
      "governance": { "fail_closed": true, "client_agnostic": true, "no_semantic_fabrication": true },
      "provenance": { "source_commit": "<hash>", "operation": "record_qualification_history", "operation_version": "1.0" }
    }
  ],
  "governance": { "append_only": true, "no_rewrite": true, "fail_closed": true },
  "provenance": { "source_commit": "<hash>", "operation": "emit_qualification_history", "operation_version": "1.0" }
}
```

### qualification_state_replay_verification.v1.json

```json
{
  "schema_version": "1.0",
  "client": "<client>",
  "run_id": "<run_id>",
  "verification_timestamp": "<ISO-8601>",
  "checks": {
    "input_integrity": { "pass": true, "mismatches": [] },
    "deterministic_recomputation": { "pass": true, "stored": {...}, "recomputed": {...} },
    "output_hash": { "pass": true, "stored_hash": "sha256:...", "recomputed_hash": "sha256:..." }
  },
  "overall_verdict": "PASS | FAIL",
  "governance": { "operation": "replay_verification", "operation_version": "1.0" }
}
```

### qualification_state_certification.v1.json

```json
{
  "schema_version": "1.0",
  "certification_type": "sqo_state_detection_e2e",
  "timestamp": "<ISO-8601>",
  "cases": [ { "case_id": "CASE-N", "label": "...", "pass": true, ... } ],
  "overall_verdict": "CERTIFIED | NOT_CERTIFIED",
  "governance": { "no_lane_a_mutation": true, ... }
}
```

---

## 2. Artifact location

All artifacts are written to:

```
artifacts/sqo/<client>/<run_id>/
├── qualification_state.v1.json
├── qualification_history.v1.json
├── qualification_state_replay_verification.v1.json
└── qualification_state_certification.v1.json
```

No SQO artifact is written outside this namespace.

---

## 3. Persistence rules

1. Artifacts are additive-only. New versions append; prior versions retained.
2. History entries are append-only. No rewriting of historical entries.
3. All artifacts carry provenance (source commit, operation version, input hashes, output hash).
4. Replay verification can be re-run at any time to verify artifact integrity.
