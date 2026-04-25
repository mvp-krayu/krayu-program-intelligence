# Signal Selector Specification
## Governed Signal Selection Model for Client/Run-Scoped 40.5 Execution

**Stream:** PI.SIGNAL-SPACE.EXPANSION.40X.02
**Layer:** 40.5 — Signal Computation Specification
**Date:** 2026-04-25
**Branch:** feature/next
**Status:** SPECIFICATION — no execution authorized by this document

---

## Purpose

This document specifies the signal selector model: the governance layer that controls which eligible signals are attempted for a given client/run during 40.5 signal computation.

The selector filters. It does not define, compute, or reinterpret signals. It does not activate conditions. It does not override the blocked status of any signal.

---

## Selector Responsibility

| Responsibility | In Scope | Out of Scope |
|---------------|----------|-------------|
| Select which eligible signals are attempted | YES | — |
| Filter by include/exclude/group | YES | — |
| Preserve CKR and provisional status | YES | — |
| Record selection in run evidence | YES | — |
| Compute signal values | NO | (40.5 engine responsibility) |
| Alter signal definitions | NO | (CKR authority) |
| Override blocked status | NO | (blocked status is absolute) |
| Activate conditions or thresholds | NO | (40.6 / 75.x responsibility) |
| Interpret signal output | NO | (41.x / 75.x responsibility) |
| Introduce new signals | NO | (CKR + 40.5 contract authority) |

**Governance rule:** A signal selected by the selector that is blocked by its input status remains BLOCKED. Selection is an expression of intent, not a guarantee of computation.

---

## Eligibility Rules

A signal is eligible for selection if and only if:
1. It is defined in the current GOVERNED_SIGNALS registry (SIG-XXX) OR the provisional expansion registry (PSIG-XXX)
2. Its required ST-XXX inputs are registered and available in the client's 40.4 telemetry
3. It is not excluded by the selector configuration

A signal is ineligible if:
- Its inputs are missing or not yet registered as ST-XXX (BLOCKED_INPUT_MISSING)
- It requires runtime telemetry (BLOCKED_RUNTIME)
- It is not in any recognized signal namespace (UNKNOWN_SIGNAL_ID → fail closed)

---

## Selector Modes

### Mode 1: `default_all_static`

Attempt all signals whose inputs are statically available for the current client/run. Includes both canonical SIG and provisional PSIG signals with `allow_provisional=true`. Skips blocked signals without error.

**Behavior:** Enumerate all SIG and PSIG entries; for each, check input availability against client telemetry; compute if inputs are present; skip if blocked; log all outcomes.

**Use case:** Full static signal sweep. Appropriate for new client onboarding or baseline assessment runs.

---

### Mode 2: `explicit`

Attempt only the explicitly listed signal IDs. Any signal not in the `include` list is skipped regardless of availability.

**Behavior:** Process only signals in `include` list; validate each against signal registry; fail closed on unknown IDs; skip blocked signals; log all outcomes.

**Use case:** Targeted single-signal validation; re-execution of specific signals after data update.

---

### Mode 3: `group`

Attempt all signals in the specified named groups. Group definitions are the canonical list in this document (Section: Signal Group Definitions).

**Behavior:** Resolve all signal IDs from named groups; deduplicate; compute available signals; skip blocked; log all outcomes.

**Use case:** Pressure-zone assessment (use `pressure_zone_default`); coupling-only analysis (use `coupling`).

---

### Mode 4: `default_minus_exclusions`

Compute all static-eligible signals (same as `default_all_static`) except those in the `exclude` list.

**Behavior:** Enumerate all eligible signals; remove excluded IDs; compute remaining; log all outcomes.

**Use case:** Suppress specific signals for a run (e.g., exclude PSIG-007 while inputs are being developed).

---

## Selector Configuration Schema

```json
{
  "schema_version": "1.0",
  "mode": "default_all_static",
  "include": [],
  "exclude": [],
  "groups": [],
  "allow_provisional": true,
  "require_ckr": false,
  "notes": ""
}
```

### Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `schema_version` | string | Schema version; must be "1.0" for this spec |
| `mode` | enum | One of: `default_all_static`, `explicit`, `group`, `default_minus_exclusions` |
| `include` | array of string | Signal IDs to compute (used in `explicit` mode; must be non-empty in that mode) |
| `exclude` | array of string | Signal IDs to skip (used in `default_minus_exclusions` mode; may be used in other modes as secondary filter) |
| `groups` | array of string | Group names to compute (used in `group` mode; must be non-empty in that mode) |
| `allow_provisional` | boolean | If false, all PSIG-XXX signals are excluded regardless of mode or include list |
| `require_ckr` | boolean | If true, only SIG-XXX signals with a CKR entry are eligible; all PSIG-XXX signals excluded |
| `notes` | string | Free-text annotation for run documentation; does not affect behavior |

### Governance Rules on Schema Fields

- `allow_provisional: false` + `require_ckr: false` → only canonical SIG-XXX signals are attempted
- `allow_provisional: true` + `require_ckr: true` → only CKR-linked SIG-XXX signals; PSIG excluded despite allow_provisional
- `require_ckr: true` takes precedence over `allow_provisional: true` when both are set
- `mode: explicit` + empty `include` → fail closed; execution must not proceed with no signals selected
- `mode: group` + empty `groups` → fail closed; execution must not proceed with no groups specified
- `exclude` is always applied as a final filter regardless of mode
- Unknown signal ID in `include`, `exclude`, or `groups` → fail closed; do not silently ignore

---

## Signal Group Definitions

These are the canonical group definitions. Groups are selector constructs only. Group membership does not imply canonical status, CKR registration, or condition activation eligibility.

### Group: `coupling`

Signals that detect coupling pressure: dependency intake and propagation load.

```
SIG-002  (CKR-007 — Dependency Load)
PSIG-001 (Fan-In Concentration)
PSIG-002 (Fan-Out Propagation)
PSIG-003 (Cross-Domain Coupling Ratio)
```

---

### Group: `structure`

Signals that detect structural topology pressure: volatility, overload, and fragmentation.

```
SIG-004  (CKR-009 — Structural Volatility)
PSIG-004 (Responsibility Concentration)
PSIG-006 (Structural Fragmentation Index)
```

---

### Group: `surface`

Signals that detect interface exposure pressure.

```
PSIG-005 (Interface Surface Area)
```

---

### Group: `test_risk`

Signals that detect structurally unobservable areas due to absent test coverage.

```
PSIG-007 (Critical Untested Surface) [PROVISIONAL_BLOCKED_INPUT_MISSING]
```

Note: This group currently contains only blocked signals. Including it in a selector config is not an error; all blocked signals are skipped, and the outcome is logged.

---

### Group: `complexity`

Signals that detect static complexity concentration.

```
PSIG-008 (Complexity Hotspot Ratio) [PROVISIONAL_BLOCKED_INPUT_MISSING]
```

Note: Same as `test_risk` — currently all blocked.

---

### Group: `pressure_zone_default`

The default composite group for pressure-zone and focus-domain identification. Contains all non-blocked static signals that contribute to structural pressure assessment.

```
SIG-002  (CKR-007 — Dependency Load)
SIG-004  (CKR-009 — Structural Volatility)
PSIG-001 (Fan-In Concentration)
PSIG-002 (Fan-Out Propagation)
PSIG-003 (Cross-Domain Coupling Ratio)
PSIG-004 (Responsibility Concentration)
PSIG-005 (Interface Surface Area)
PSIG-006 (Structural Fragmentation Index)
```

This group is the recommended default for second-client and future client onboarding runs. When PSIG-007 or PSIG-008 inputs become available, they should be added to this group via a governed group update contract.

---

## Fail-Closed Rules

| Condition | Behavior |
|-----------|---------|
| Unknown signal ID in `include` | FAIL — execution blocked; unrecognized signal ID |
| Unknown signal ID in `exclude` | FAIL — execution blocked; unknown exclusion target |
| Unknown group name in `groups` | FAIL — execution blocked; unknown group |
| `mode: explicit` + `include: []` | FAIL — no signals selected |
| `mode: group` + `groups: []` | FAIL — no groups selected |
| `require_ckr: true` + no CKR-linked signals available | FAIL — no eligible signals after filtering |
| Signal selected but inputs missing | SKIP with BLOCKED log entry; not a failure |
| Signal selected but BLOCKED_RUNTIME | SKIP with BLOCKED log entry; not a failure |
| Schema version mismatch | FAIL — schema must be "1.0" |

All FAIL conditions must halt execution before any computation begins. All SKIP conditions must be logged in the run's signal output artifact.

---

## Selector Output Record

When selector execution is authorized and performed, the following must be recorded in the run's signal output artifact:

```json
{
  "selector": {
    "schema_version": "1.0",
    "mode": "<mode used>",
    "resolved_signal_ids": ["SIG-002", "SIG-004", "PSIG-001", "..."],
    "excluded_signal_ids": [],
    "computed_signal_ids": ["SIG-002", "SIG-004"],
    "blocked_signal_ids": ["PSIG-001", "PSIG-002", "..."],
    "blocked_reasons": {
      "PSIG-001": "ST-031 not registered in client 40.4 telemetry",
      "PSIG-002": "ST-032 not registered in client 40.4 telemetry"
    },
    "allow_provisional": true,
    "require_ckr": false
  }
}
```

This record is evidence of selection. It must not be omitted from run artifacts.

---

## Example Configurations

### Example 1 — Full static sweep (default)

```json
{
  "schema_version": "1.0",
  "mode": "default_all_static",
  "include": [],
  "exclude": [],
  "groups": [],
  "allow_provisional": true,
  "require_ckr": false,
  "notes": "Full static signal sweep — initial client onboarding"
}
```

### Example 2 — Canonical signals only

```json
{
  "schema_version": "1.0",
  "mode": "default_all_static",
  "include": [],
  "exclude": [],
  "groups": [],
  "allow_provisional": false,
  "require_ckr": true,
  "notes": "CKR-canonical signals only — governance audit run"
}
```

### Example 3 — Pressure zone group

```json
{
  "schema_version": "1.0",
  "mode": "group",
  "include": [],
  "exclude": [],
  "groups": ["pressure_zone_default"],
  "allow_provisional": true,
  "require_ckr": false,
  "notes": "Pressure zone assessment for second-client run_01_oss_fastapi"
}
```

### Example 4 — Explicit coupling signals

```json
{
  "schema_version": "1.0",
  "mode": "explicit",
  "include": ["SIG-002", "PSIG-001", "PSIG-003"],
  "exclude": [],
  "groups": [],
  "allow_provisional": true,
  "require_ckr": false,
  "notes": "Targeted coupling pressure analysis"
}
```

### Example 5 — All static minus blocked inputs

```json
{
  "schema_version": "1.0",
  "mode": "default_minus_exclusions",
  "include": [],
  "exclude": ["PSIG-007", "PSIG-008"],
  "groups": [],
  "allow_provisional": true,
  "require_ckr": false,
  "notes": "Skip signals with unresolved input gaps"
}
```

---

## Governance Invariants

1. The selector does not compute signals. It controls which signals the engine attempts.
2. A blocked signal remains blocked regardless of selector configuration. Selector selection of a blocked signal produces a SKIP log entry, not a computation.
3. The selector output record must be included in all run artifacts. Selection without evidence is a governance violation.
4. Provisional PSIG signals must be clearly labeled PROVISIONAL_CKR_CANDIDATE in all run outputs. The selector does not change their provisional status.
5. The selector does not define groups. Groups are defined in this document. A new group requires a contract to update this specification.
6. `require_ckr: true` is the conservative setting for production evidence runs. `allow_provisional: true` is appropriate for exploratory and development runs.
7. Unknown signal IDs and unknown group names fail closed. Silent omission is not permitted.

---

## Execution Boundary

This specification describes the selector model only. Execution of the selector is authorized by a future 40.5 execution contract that:
1. References this specification
2. Provides a valid selector configuration
3. Operates on a specific client/run with confirmed 40.4 telemetry availability
4. Produces all mandatory run artifacts including the selector output record

This document does not authorize execution. No signals are computed by this document.
