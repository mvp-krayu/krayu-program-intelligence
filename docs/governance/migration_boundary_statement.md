# Migration Boundary Statement

**Authority:** EX.0 — Execution Operating Model Hardening
**Date:** 2026-04-04
**Status:** ACTIVE — binding on all future stream artifact placement

---

## 1. PURPOSE

This document defines the boundary between the legacy `docs/pios/` artifact storage and the new governed framework structure in `docs/governance/`. It specifies where future artifacts go without requiring migration of historical content.

---

## 2. EXISTING ARTIFACT LOCATIONS (LEGACY — DO NOT MIGRATE)

| Location | Content type | Status |
|---|---|---|
| `docs/pios/<stream>/` | Per-stream execution artifacts for 40.x, 42.x, EX.x streams | FROZEN — read-only reference |
| `docs/pios/41.x/` | L3 semantic artifacts (signal_registry, query maps, etc.) | FROZEN — authoritative L3 |
| `docs/pios/43.x/` | Binding contracts | FROZEN |
| `docs/pios/44.x/` | Projection and emphasis | FROZEN |
| `docs/pios/contracts/` | Stream-specific contracts (pre-framework) | FROZEN |
| `docs/pios/EX.1A/` | EX.1A execution artifacts | FROZEN |
| `docs/pios/EX.3/` | EX.3 execution artifacts | FROZEN |
| `docs/pios/EX.2/` | EX.2 execution artifacts | FROZEN |

**Frozen means:** These artifacts are complete and authoritative as of their stream closure. They must not be reorganized, renamed, or moved unless the owning stream explicitly requires it.

---

## 3. NEW GOVERNED FRAMEWORK STRUCTURE

| Location | Content type | Authority |
|---|---|---|
| `docs/governance/FAMILY_REGISTRY.md` | Family registration index | EX.0 |
| `docs/governance/families/<ID>.md` | Family governance definition | EX.0 per family |
| `docs/governance/families/<ID>.json` | Machine-readable validation profiles | EX.0 per family |
| `docs/governance/CONTRACT_TEMPLATE.md` | Canonical contract template | EX.0 |
| `docs/governance/STREAM_SCHEMA.md` | Contract grammar | EX.0 |
| `docs/governance/EXECUTION_REPORT_TEMPLATE.md` | Execution report template | EX.0 |
| `docs/governance/HANDOVER_TEMPLATE.md` | Handover template | EX.0 |
| `docs/governance/CONTEXT_REGISTRY.md` | Legacy summary — see §4 | DEPRECATED as authority |
| `docs/governance/fallback_execution_rules.md` | Fallback behavior governance | EX.0 |
| `docs/governance/framework_gap_assessment.md` | Framework gap record | EX.0 |
| `docs/governance/migration_boundary_statement.md` | This document | EX.0 |
| `SKILLS.md` | Execution pattern library | EX.0 |
| `scripts/pios/validate_stream.py` | Validation framework | EX.0 |

---

## 4. CONTEXT_REGISTRY.md DEPRECATION

`docs/governance/CONTEXT_REGISTRY.md` was the first-drop family context file. As of EX.0:
- It is **no longer the authority** for family definitions
- The authoritative sources are `FAMILY_REGISTRY.md` and `docs/governance/families/<ID>.md`
- CONTEXT_REGISTRY.md is retained as a legacy summary and historical reference
- It must not be updated going forward — updates go to family files
- Contracts must not cite CONTEXT_REGISTRY.md as an authority source

---

## 5. FUTURE EX.x STREAM ARTIFACT PLACEMENT

Starting with the first EX stream after EX.0:

| Artifact type | Location |
|---|---|
| Stream execution artifacts (7-pack) | `docs/pios/EX.<N>/` — consistent with EX.1A, EX.2, EX.3 |
| Governance framework updates | `docs/governance/` |
| Family file updates | `docs/governance/families/<ID>.md` and `.json` |
| SKILLS.md updates | `SKILLS.md` (repo root) |
| Run archives | `runs/pios/40.5/<run_id>/` and `runs/pios/40.6/<run_id>/` — unchanged |
| Adapter scripts | `scripts/pios/<stream>/` — unchanged |

The `docs/pios/` tree is NOT being reorganized. EX stream artifacts continue to go there. The `docs/governance/` tree is for framework-level files only.

---

## 6. AUTHORIZED BRANCH SCOPE

| Family | Authorized branch | Notes |
|---|---|---|
| EX | `pios-governance-baseline-v0.4` | Declared exception per `docs/governance/families/EX.md` |
| 40, 42, 51 | Feature branch per CLAUDE.md §7 | `feature/<stream-id>-<name>` |
| GOV, CAT, WEB | Feature branch per CLAUDE.md §7 | `feature/<stream-id>-<name>` |

EX family exception: EX streams were established as direct commits to `pios-governance-baseline-v0.4` starting from EX.H1. This pattern is declared as authorized by the EX family file. Future EX streams should continue on this branch unless a specific EX stream contract declares a new feature branch.

---

## 7. WHAT DOES NOT MOVE

The following must not be migrated, renamed, or restructured:
- Any file under `docs/pios/41.x/` (L3 static artifacts — authoritative)
- Any committed execution report in `docs/pios/EX.x/`
- Any run archive in `runs/pios/`
- Engine files under `pios/core/v0.1/engine/`
- Any file named in a prior stream's CLOSURE or execution report as an authoritative artifact
