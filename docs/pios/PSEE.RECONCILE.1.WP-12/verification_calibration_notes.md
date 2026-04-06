# Verification Calibration Notes

**Document:** verification_calibration_notes.md
**Stream:** PSEE.RECONCILE.1.WP-12

---

## Problem Statement

In WP-11, the generic verification engine issued `PASS_FULL` for both `blueedge` and
`client_template_01`, despite `client_template_01` declaring `coverage_class=PARTIAL`,
`reconstruction_status=PARTIAL`, `coverage_percent=73.3%`, `unknown_space_count=2`,
and `escalation_clearance=85`.

The engine evaluated five WP-07 verification domains correctly for structural validity,
but did not distinguish structural validity from authoritative completeness. All five
domains passed for `client_template_01` because the package is internally consistent —
but the score/projection/confidence carry inherent uncertainty from bounded coverage.
Issuing `PASS_FULL` over a bounded-coverage package misrepresents the authority state.

WP-07 Rule V-02 defines: `PASS_FULL` requires no bounded scope — structurally valid
AND fully authoritative. WP-07 Rule V-03 defines: `PASS_PARTIAL` — structurally valid
but bounded uncertainty is present. These are distinct states that were collapsed in WP-11.

---

## Calibration Applied

`scripts/psee/build_runtime_envelope_generic.py` — added `bounded_conditions` detection
block between the FAIL_STRUCTURAL decision and the PASS_FULL assignment.

### Bounded Condition Triggers

Any of the following in `runtime_profile.json` forces `PASS_PARTIAL`:

| Condition | Field | Trigger |
|---|---|---|
| Partial or low coverage scope | `coverage_class` | value in `{PARTIAL, LOW}` |
| Partial reconstruction validity | `reconstruction_status` | value `PARTIAL` |
| Coverage below full | `coverage_percent` | value `< 100.0` |
| Unresolved unknown-space | `unknown_space_count` | value `> 0` |
| Escalation not fully resolved | `escalation_clearance` | value `< 100` |

### FAIL_STRUCTURAL Triggers (unchanged)

- Domain 2 (State Admissibility): `execution_status` not in defined phase set
- Domain 2: `reconstruction_status` not in `{PASS, PARTIAL, FAIL}`
- Domain 5 (Authority Honesty): all four domains not actively evaluated

### Decision Logic Post-Calibration

```
if d5 == VERIFIED_FAIL      → FAIL_STRUCTURAL
elif any domain VERIFIED_FAIL → FAIL_STRUCTURAL
elif is_bounded              → PASS_PARTIAL      ← WP-12 gate
elif all domains VERIFIED_PASS → PASS_FULL
else                         → PASS_PARTIAL
```

PASS_FULL is earned — it requires all domains to pass AND zero bounded conditions.

---

## Verification.Log Changes

When `outcome == PASS_PARTIAL` and `is_bounded`:

- `Unverified Scope:` section now lists each bounded condition
- `Consumption Permission:` reads `CONSUME AS BOUNDED INTELLIGENCE — unverified scope not confirmed`
- Domain 5 line reports `bounded_conditions=N detected`

When `outcome == PASS_FULL`:

- `Unverified Scope:` reads `None — all domains evaluated; no bounded conditions detected`
- `Consumption Permission:` reads `CONSUME AS AUTHORITATIVE`

---

## Client-Agnostic Confirmation

No client names appear in the calibration logic. All behavioral differences arise
exclusively from `runtime_profile.json` field values. The engine applies identical
bounded-conditions evaluation for all clients without branching on client identity.
