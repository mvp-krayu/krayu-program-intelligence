BASELINE FREEZE

stream: EX.1
status: BASELINE — COMPRESSED EXECUTION VERIFIED
date: 2026-04-04

validation result: PASS (11/11)
profile: EX/debug_trace
adapter: scripts/pios/EX.2/pios_debug_adapter.py
PROFILE_EXTENSION: NOT TRIGGERED
drift: NONE
files changed: NONE
commit reference: 2d8b90e
git tag: ex1-compressed-baseline-v1

description:
First successful execution under compressed contract model with full skill
invocation and validator authority.

Contract EX.1 executed with STRICT EXECUTION / COMPRESSED CONTRACT / DELTA ONLY
modes active. PRELOAD_GATE passed. LOAD_CONTEXT EX loaded family invariants from
docs/governance/families/EX.md without restatement. CE_VALIDATION delegated to
validate_stream.py — no inline validator written. RETURN_CONTRACT honored return
mode exactly. Zero governance artifacts generated beyond standard templates.

reproducibility:
  python3 scripts/pios/EX.2/pios_debug_adapter.py | \
  python3 scripts/pios/validate_stream.py --family EX --profile debug_trace
  expected: SUMMARY: PASS / FAILURES: 0
