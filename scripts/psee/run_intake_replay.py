#!/usr/bin/env python3
"""
PSEE Intake Replay — BlueEdge
Stream: PSEE.RECONCILE.1.WP-10

Replays PiOS intake deterministically from the built package.
Reads from:   clients/blueedge/psee/runs/run_01_authoritative/package/
Writes to:    clients/blueedge/psee/runs/run_01_authoritative/intake/

Usage:
    python3 scripts/psee/run_intake_replay.py

Exit codes:
    0 = INTAKE_COMPLETE
    1 = INTAKE_FAILED
"""

import json
import os
import sys
from datetime import datetime, timezone

# ── IDENTITY ──────────────────────────────────────────────────────────────────
RUN_ID = "run_01_authoritative"
CLIENT_ID = "blueedge"

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BASE = os.path.join(REPO_ROOT, "clients", CLIENT_ID, "psee", "runs", RUN_ID)
PACKAGE_DIR = os.path.join(BASE, "package")
INTAKE_DIR = os.path.join(BASE, "intake")

os.makedirs(INTAKE_DIR, exist_ok=True)

MANDATORY_ARTIFACTS = [
    "package_manifest.json",
    "verification.log",
    "engine_state.json",
    "gauge_state.json",
    "gauge_view.json",
    "coverage_state.json",
    "reconstruction_state.json"
]

# ── OUTCOME → INTAKE MODE MAP ─────────────────────────────────────────────────
OUTCOME_MAP = {
    "PASS_FULL": "AUTHORITATIVE_INTAKE",
    "PASS_PARTIAL": "BOUNDED_INTAKE",
    "FAIL_STRUCTURAL": "REJECT"
}

print("=== PSEE Intake Replay ===")
print(f"client:   {CLIENT_ID}")
print(f"run_id:   {RUN_ID}")
print(f"package:  {PACKAGE_DIR}")
print(f"intake:   {INTAKE_DIR}")
print()

log_lines = []
rejected = False
errors = []


def log(msg=""):
    print(msg)
    log_lines.append(msg)


# ── STEP 1: LOAD MANIFEST ─────────────────────────────────────────────────────
log("--- Step 1: Load package_manifest.json ---")
manifest_path = os.path.join(PACKAGE_DIR, "package_manifest.json")
if not os.path.isfile(manifest_path):
    log("  FAIL  package_manifest.json not found")
    rejected = True
    errors.append("MANIFEST_FAILURE: package_manifest.json missing")
else:
    with open(manifest_path) as f:
        manifest = json.load(f)
    manifest_run_id = manifest.get("run_id", "")
    log(f"  PASS  manifest loaded; run_id={manifest_run_id}")

# ── STEP 2: VALIDATE RUN_ID CONSISTENCY ──────────────────────────────────────
log()
log("--- Step 2: Validate run_id consistency ---")
if not rejected:
    run_id_mismatches = []
    for artifact in MANDATORY_ARTIFACTS:
        path = os.path.join(PACKAGE_DIR, artifact)
        if artifact.endswith(".json") and os.path.isfile(path):
            with open(path) as f:
                data = json.load(f)
            art_run_id = data.get("run_id", None)
            if art_run_id != manifest_run_id:
                run_id_mismatches.append(f"{artifact}: run_id={art_run_id}")
            else:
                log(f"  PASS  {artifact}: run_id={art_run_id}")
    if run_id_mismatches:
        for m in run_id_mismatches:
            log(f"  FAIL  run_id mismatch: {m}")
            errors.append(f"RUN_ID_INCONSISTENCY: {m}")
        rejected = True

# ── STEP 3: VALIDATE MANDATORY ARTIFACT PRESENCE ─────────────────────────────
log()
log("--- Step 3: Validate mandatory artifact presence ---")
if not rejected:
    missing = []
    for artifact in MANDATORY_ARTIFACTS:
        path = os.path.join(PACKAGE_DIR, artifact)
        if os.path.isfile(path):
            log(f"  PASS  present: {artifact}")
        else:
            log(f"  FAIL  missing: {artifact}")
            missing.append(artifact)
    if missing:
        errors.append(f"PACKAGE_INCOMPLETE: missing {missing}")
        rejected = True

# ── STEP 4: LOAD VERIFICATION.LOG ────────────────────────────────────────────
log()
log("--- Step 4: Load verification.log ---")
verification_outcome = None
consumption_permission = None
verified_scope_lines = []
unverified_scope_lines = []

if not rejected:
    vlog_path = os.path.join(PACKAGE_DIR, "verification.log")
    if not os.path.isfile(vlog_path):
        log("  FAIL  verification.log missing")
        errors.append("VERIFICATION_SCOPE_CONTRADICTION: verification.log missing")
        rejected = True
    else:
        with open(vlog_path) as f:
            vlog_content = f.read()

        section = None
        for line in vlog_content.splitlines():
            stripped = line.strip()
            if stripped.startswith("Outcome:"):
                verification_outcome = stripped.split("Outcome:", 1)[1].strip()
                section = "outcome"
            elif stripped.startswith("Verified Scope:"):
                section = "verified"
            elif stripped.startswith("Unverified Scope:"):
                section = "unverified"
            elif stripped.startswith("Consumption Permission:"):
                section = "consumption"
            elif stripped.startswith("Blocking Contradictions:"):
                section = "contradictions"
            elif stripped.startswith("Inferred Scope:"):
                section = "inferred"
            elif stripped.startswith("Evidence Basis:"):
                section = "evidence"
            elif stripped.startswith("-") and section == "verified":
                verified_scope_lines.append(stripped.lstrip("- ").strip())
            elif stripped.startswith("-") and section == "unverified":
                unverified_scope_lines.append(stripped.lstrip("- ").strip())
            elif stripped.startswith("-") and section == "consumption":
                consumption_permission = stripped.lstrip("- ").strip()

        if not verification_outcome:
            log("  FAIL  verification.log: Outcome field not found")
            errors.append("VERIFICATION_SCOPE_CONTRADICTION: Outcome field missing")
            rejected = True
        elif verification_outcome not in OUTCOME_MAP:
            log(f"  FAIL  verification.log: unrecognized outcome={verification_outcome}")
            errors.append(f"VERIFICATION_SCOPE_CONTRADICTION: unrecognized outcome={verification_outcome}")
            rejected = True
        else:
            log(f"  PASS  verification.log loaded; outcome={verification_outcome}")

# ── STEP 5: EVALUATE VERIFICATION OUTCOME ────────────────────────────────────
log()
log("--- Step 5: Evaluate verification outcome ---")
intake_mode = None

if rejected:
    intake_mode = "REJECT"
    log("  RESULT  intake_mode=REJECT (pre-verification failure)")
else:
    if verification_outcome == "FAIL_STRUCTURAL":
        rejected = True
    intake_mode = OUTCOME_MAP[verification_outcome]
    log(f"  RESULT  verification_outcome={verification_outcome}")
    log(f"  RESULT  intake_mode={intake_mode}")

# ── STEP 6: DETERMINE CONSUMED SCOPE AND UNCERTAINTY ─────────────────────────
log()
log("--- Step 6: Determine consumed scope ---")

if intake_mode == "AUTHORITATIVE_INTAKE":
    consumed_scope = "all"
    uncertainty_propagation = "none"
    log("  PASS_FULL → all artifact fields consumed as authoritative")
    log("  no uncertainty propagation required")
elif intake_mode == "BOUNDED_INTAKE":
    consumed_scope = "verified_scope_only"
    uncertainty_propagation = "required — unverified scope must be marked uncertain in all downstream outputs"
    log(f"  PASS_PARTIAL → verified scope authoritative: {verified_scope_lines}")
    log(f"  unverified scope uncertain: {unverified_scope_lines}")
else:
    consumed_scope = "none"
    uncertainty_propagation = "not applicable — package rejected"
    log("  FAIL_STRUCTURAL → no consumption; package returned to PSEE")

# ── STEP 7: WRITE intake_result.json ─────────────────────────────────────────
log()
log("--- Step 7: Write intake_result.json ---")
intake_result = {
    "run_id": RUN_ID,
    "client_id": CLIENT_ID,
    "intake_timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "verification_outcome": verification_outcome if verification_outcome else "UNKNOWN",
    "intake_mode": intake_mode,
    "consumed_scope": consumed_scope,
    "verified_domains": verified_scope_lines,
    "unverified_domains": unverified_scope_lines,
    "uncertainty_propagation": uncertainty_propagation,
    "consumption_permission": consumption_permission,
    "rejected": rejected,
    "errors": errors
}

result_path = os.path.join(INTAKE_DIR, "intake_result.json")
with open(result_path, "w") as f:
    json.dump(intake_result, f, indent=2)
log(f"  WRITTEN  intake_result.json")

# ── STEP 8: WRITE intake_log.md ──────────────────────────────────────────────
log()
log("--- Step 8: Write intake_log.md ---")

intake_log_md = f"""# Intake Log — {CLIENT_ID} / {RUN_ID}

**Timestamp:** {intake_result['intake_timestamp']}
**Client:** {CLIENT_ID}
**Run ID:** {RUN_ID}

## Steps Executed

{chr(10).join(log_lines)}

## Intake Result

| Field | Value |
|---|---|
| verification_outcome | {intake_result['verification_outcome']} |
| intake_mode | {intake_result['intake_mode']} |
| consumed_scope | {intake_result['consumed_scope']} |
| uncertainty_propagation | {intake_result['uncertainty_propagation']} |
| rejected | {intake_result['rejected']} |

## Errors

{chr(10).join(f'- {e}' for e in errors) if errors else 'None'}
"""

log_path = os.path.join(INTAKE_DIR, "intake_log.md")
with open(log_path, "w") as f:
    f.write(intake_log_md)
print(f"  WRITTEN  intake_log.md")

# ── SUMMARY ───────────────────────────────────────────────────────────────────
print()
print("INTAKE_COMPLETE" if not rejected else "INTAKE_FAILED")
print(f"  verification_outcome: {intake_result['verification_outcome']}")
print(f"  intake_mode:          {intake_mode}")
print(f"  rejected:             {rejected}")
sys.exit(0 if not rejected else 1)
