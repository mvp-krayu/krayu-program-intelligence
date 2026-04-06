# Replay Results — WP-12 Calibrated Verification

**Document:** replay_results.md
**Stream:** PSEE.RECONCILE.1.WP-12

Run all commands from repository root: `/Users/khorrix/Projects/k-pi-core`

---

## Build Outcomes

| Client | Build result | verification_outcome | bounded_conditions |
|---|---|---|---|
| blueedge | ENVELOPE_BUILT (exit 0) | PASS_FULL | 0 |
| client_template_01 | ENVELOPE_BUILT (exit 0) | PASS_PARTIAL | 5 |

## Intake Outcomes

| Client | Intake result | intake_mode | rejected |
|---|---|---|---|
| blueedge | INTAKE_COMPLETE (exit 0) | AUTHORITATIVE_INTAKE | false |
| client_template_01 | INTAKE_COMPLETE (exit 0) | BOUNDED_INTAKE | false |

---

## client_template_01 Bounded Conditions Detected

All five triggers active:

1. `coverage_class=PARTIAL — coverage scope is bounded`
2. `reconstruction_status=PARTIAL — bounded reconstruction validity`
3. `coverage_percent=73.3% — not full coverage`
4. `unknown_space_count=2 — unresolved unknown-space records`
5. `escalation_clearance=85 — escalation not fully resolved`

Uncertainty propagation: `required — unverified scope must be uncertainty-marked in downstream outputs`

---

## blueedge Bounded Conditions Detected

None. All five triggers inactive:
- `coverage_class=FULL`
- `reconstruction_status=PASS`
- `coverage_percent=100.0`
- `unknown_space_count=0`
- `escalation_clearance=100`

Uncertainty propagation: `none`

---

## WP-11 vs WP-12 Comparison

| Client | WP-11 outcome | WP-12 outcome | Change |
|---|---|---|---|
| blueedge | PASS_FULL / AUTHORITATIVE_INTAKE | PASS_FULL / AUTHORITATIVE_INTAKE | unchanged |
| client_template_01 | PASS_FULL / AUTHORITATIVE_INTAKE | PASS_PARTIAL / BOUNDED_INTAKE | corrected |

WP-11 over-issued PASS_FULL for `client_template_01`.
WP-12 corrects this by detecting bounded conditions before the PASS_FULL assignment.

---

## Replay Commands

### Build

```
python3 scripts/psee/build_runtime_envelope_generic.py --client blueedge --run-id run_01_authoritative
python3 scripts/psee/build_runtime_envelope_generic.py --client client_template_01 --run-id run_01_authoritative
```

### Intake

```
python3 scripts/psee/run_intake_replay_generic.py --client blueedge --run-id run_01_authoritative
python3 scripts/psee/run_intake_replay_generic.py --client client_template_01 --run-id run_01_authoritative
```
