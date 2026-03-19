# Stream 40.3 — Execution Adjustments and Structure Governance

**Source:** Adjustments for 40.3 — Contract Surface + Runtime Alignment (Based on 40.2 Baseline)
**Issued:** 2026-03-18
**Applies to:** Stream 40.3 — PiOS Reverse Engineering Engine
**Baseline reference:** INT-03-40.2-GITHUB-INTAKE / INT-04-40.2-RUNTIME-EXTRACTION

---

## 1. Canonical Folder Structure

The following structure is established and must be enforced for all 40.3 execution.

```
docs/pios/40.3/                   → reconstruction artifacts (PEG + corpus)
docs/pios/40.3/reconstruction/    → reconstructed structural artifacts
docs/pios/40.3/traceability/      → traceability mappings to evidence
docs/pios/contracts/40.3/         → contracts, execution receipts, reconstruction trace, handover artifacts
scripts/pios/40.3/                → deterministic reconstruction utilities (CONDITIONAL — create only if required)
```

**Status at issuance:** All directories except `scripts/pios/40.3/` created. Scripts directory deferred until a reconstruction step requires it.

---

## 2. Runtime Structure Creation (Mandatory for 40.3 Execution)

Any contract executing 40.3 must create the following directories before producing artifacts:

```yaml
create_directories:
  - docs/pios/40.3/
  - docs/pios/40.3/reconstruction/
  - docs/pios/40.3/traceability/
  - docs/pios/contracts/40.3/
  - scripts/pios/40.3/   # conditional — only if scripts are required
```

---

## 3. Contract Surface Governance

`docs/pios/contracts/40.3/` must contain:

| Artifact | Status |
|---|---|
| Reconstruction contract file (PERM execution contract) | Required |
| Execution receipt (Claude output log) | Required |
| Reconstruction execution trace | Recommended |
| Handover artifacts to 40.4 | Required at closure |

**Rules:**
- Contracts are mandatory for execution governance.
- Contracts are NOT part of the reconstructed program baseline.
- Contracts must be excluded from reconstruction logic and file counts.

---

## 4. Script Governance

`scripts/pios/40.3/` is a formal runtime artifact directory **if used**.

All scripts must be:
- deterministic
- idempotent (safe to re-run)
- version-controlled
- operating only on local repository state
- not calling external APIs or connectors
- strictly implementing PERM logic (no deviation)

Scripts are:
- optional — create only if reconstruction cannot be done deterministically without them
- part of the reproducibility layer (same model as 40.2)
- excluded from baseline reconstruction counts

---

## 5. Baseline Hygiene — Exclusion Rules

The following paths and patterns must be excluded from reconstruction baseline counts. These extend the 40.2 exclusion model directly.

**Exclude any path under:**
- `docs/pios/contracts/40.3/`
- `scripts/pios/40.3/`

**Exclude by pattern:**
- any `.DS_Store` file
- any path under `.claude/`

**Mandatory artifacts** (when defined) are:
- existence-checked only
- never part of baseline count

---

## 6. Execution Discipline (Mirror of 40.2)

40.3 must follow the same execution discipline as 40.2:

| Requirement | Rule |
|---|---|
| Contract-driven | No execution without a governing contract |
| Reproducibility | Given same inputs, outputs must be identical |
| Gap reporting | Any gaps between executed logic and scripted logic must be explicitly flagged |
| Deterministic outputs | All artifacts must be producible deterministically |
| Separation of concerns | Artifacts / Contracts / Runtime are separate directories and must not be mixed |

---

## 7. Non-Goals (Locked Boundary)

40.3 must NOT:

- introduce telemetry logic
- introduce signal computation
- introduce scoring or interpretation
- introduce platform coupling
- bypass PERM via script shortcuts

These remain exclusively within downstream streams (40.4 and beyond).

---

## 8. Handover to 40.4

At closure, 40.3 hands over to 40.4:

- complete reconstruction corpus
- Program Execution Graph (PEG)
- structural traceability mappings

Handover artifacts must be placed in `docs/pios/contracts/40.3/` and referenced in the execution receipt.
