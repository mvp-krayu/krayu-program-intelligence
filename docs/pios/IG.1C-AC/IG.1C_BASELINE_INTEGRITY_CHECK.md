# IG.1C-AC — Baseline Integrity Check

**Stream:** IG.1C-AC  
**Parent:** IG.1  
**Layer:** INGESTION  
**Status:** COMPLETE  
**Date:** 2026-04-04  

---

## 1. PURPOSE

This document records the forensic verification that the baseline directories (`docs/pios/40.2/`, `docs/pios/40.3/`, `docs/pios/40.4/`) were not modified during IG.1C execution. Baseline immutability is required for admissibility.

---

## 2. EVIDENCE SOURCES USED

| Source | Command | Result |
|---|---|---|
| Git diff against HEAD | `git diff --name-status HEAD -- docs/pios/40.2/ docs/pios/40.3/ docs/pios/40.4/` | **empty output** — no changes |
| HEAD content spot-check 40.2 | `git show HEAD:docs/pios/40.2/evidence_classification_map.md \| head -5` | `contract: PIOS-40.2-RUN02-CONTRACT-v2` — original |
| HEAD content spot-check 40.3 | `git show HEAD:docs/pios/40.3/entity_catalog.md \| head -5` | `contract: PIOS-40.3-RUN02-CONTRACT-v3` — original |
| HEAD content spot-check 40.4 | `git show HEAD:docs/pios/40.4/entity_telemetry.md \| head -5` | `contract: PIOS-40.4-RUN01-CONTRACT-v1` — original |
| Git status | `git status --short` | 40.2/40.3/40.4 baseline paths show **no entries** — clean |

---

## 3. FINDINGS

### 3.1 Baseline 40.2

| Indicator | Finding |
|---|---|
| `git diff HEAD -- docs/pios/40.2/` | **empty** — zero modifications |
| HEAD file content intact | CONFIRMED — `contract: PIOS-40.2-RUN02-CONTRACT-v2` (no IG1C-REGEN suffix) |
| Any file modified, added, or deleted | **NONE** |

**40.2 baseline status: UNTOUCHED**

### 3.2 Baseline 40.3

| Indicator | Finding |
|---|---|
| `git diff HEAD -- docs/pios/40.3/` | **empty** — zero modifications |
| HEAD file content intact | CONFIRMED — `contract: PIOS-40.3-RUN02-CONTRACT-v3` (no IG1C-REGEN suffix) |
| Any file modified, added, or deleted | **NONE** |

**40.3 baseline status: UNTOUCHED**

### 3.3 Baseline 40.4

| Indicator | Finding |
|---|---|
| `git diff HEAD -- docs/pios/40.4/` | **empty** — zero modifications |
| HEAD file content intact | CONFIRMED — `contract: PIOS-40.4-RUN01-CONTRACT-v1` (no IG1C-REGEN suffix) |
| Any file modified, added, or deleted | **NONE** |

**40.4 baseline status: UNTOUCHED**

---

## 4. CONTRACT HEADER DIFFERENTIATION CONFIRMED

A critical differentiator between baseline and regenerated artifacts is the contract field:

| Artifact location | Contract field | Status |
|---|---|---|
| `docs/pios/40.2/evidence_classification_map.md` (baseline) | `PIOS-40.2-RUN02-CONTRACT-v2` | ORIGINAL — unmodified |
| `docs/pios/runs/run_02_blueedge/40.2/evidence_classification_map.md` (regenerated) | `PIOS-40.2-RUN02-IG1C-REGEN` | FRESH REGENERATION |
| `docs/pios/40.3/entity_catalog.md` (baseline) | `PIOS-40.3-RUN02-CONTRACT-v3` | ORIGINAL — unmodified |
| `docs/pios/runs/run_02_blueedge/40.3/entity_catalog.md` (regenerated) | `PIOS-40.3-RUN02-IG1C-REGEN` | FRESH REGENERATION |
| `docs/pios/40.4/entity_telemetry.md` (baseline) | `PIOS-40.4-RUN01-CONTRACT-v1` | ORIGINAL — unmodified |
| `docs/pios/runs/run_02_blueedge/40.4/entity_telemetry.md` (regenerated) | `PIOS-40.4-RUN01-IG1C-REGEN` | FRESH REGENERATION |

The namespaces are cleanly separated. No file in `docs/pios/40.x/` carries a `-IG1C-REGEN` contract. No file in `runs/run_02_blueedge/40.x/` carries the original contract suffix.

---

## 5. BASELINE INTEGRITY VERDICT

**INTACT**

Basis: Zero modifications to any file in `docs/pios/40.2/`, `docs/pios/40.3/`, or `docs/pios/40.4/` between the last commit and current working tree. Git diff confirms clean state. The baseline artifact set is immutable as required for valid invariance comparison.

---

## 6. STATUS

baseline_integrity_check_complete: TRUE  
40.2_baseline_modified: FALSE  
40.3_baseline_modified: FALSE  
40.4_baseline_modified: FALSE  
baseline_immutable: TRUE  
verdict: **INTACT**
