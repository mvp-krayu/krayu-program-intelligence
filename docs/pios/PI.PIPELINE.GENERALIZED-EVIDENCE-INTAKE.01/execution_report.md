# Execution Report — PI.PIPELINE.GENERALIZED-EVIDENCE-INTAKE.01

## Stream Identity

- **Stream ID:** PI.PIPELINE.GENERALIZED-EVIDENCE-INTAKE.01
- **Classification:** G1 — Architecture-mutating (introduces project type detection, 4 new evidence type categories, --force idempotent re-intake)
- **Branch:** main (operational activation, no feature branch)
- **Baseline commit:** 0821166
- **Closure commit:** da62a9d
- **Date:** 2026-05-21

## Pre-flight

- Branch: main — authorized for operational activation continuation
- Inputs: StackStorm source repository (canonical_repo), candidate_registry.json (15 candidates), existing 0-anchor evidence_anchors.json
- Dependencies: PI.SQO.CEU-RECONCILIATION-WORKFLOW.01 (CEU reconciliation workflow, evidence intake architecture)
- Trigger: LRNE-0001 learning event — StackStorm evidence intake gap due to Django-specific extractors
- Validators: 12 checks

## Execution Phases

### Phase 1 — StackStorm Source Structure Research

Analyzed StackStorm repository structure to determine appropriate extractors:

| Finding | Detail |
|---------|--------|
| Project type | Python setuptools multi-package (NOT Django) |
| Packages with setup.py | 8 (st2common, st2api, st2actions, st2reactor, st2client, st2auth, st2stream, st2tests) |
| Packages without setup.py | 7 (conftest.py, contrib, packaging, pants-plugins, pylint_plugins, scripts, tools) |
| Entry points | st2common (metrics.driver, rbac.backend), st2client (console_scripts: st2), st2auth (sso.backends) |
| Cross-package deps | in-requirements.txt per package; st2common depends on st2-rbac-backend (external repo) |
| Package READMEs | st2client (README.rst), contrib (README.md), pants-plugins (README.md) |
| Repo README | Rich architectural content: Sensors, Triggers, Actions, Rules, Workflows, Packs, Audit trail |

### Phase 2 — Project Type Detection

Added `detect_project_type()` to `ceu_evidence_intake.py`:

- Scans source root for Django indicators (apps.py in any subdirectory)
- Counts setup.py files across subdirectories (>=2 = PYTHON_PACKAGE)
- Falls back to UNKNOWN (still runs generic extractors)
- Returns: "DJANGO" | "PYTHON_PACKAGE" | "UNKNOWN"

### Phase 3 — Generic Python Extractors

Added 4 new evidence extractors:

**extract_setup_py(domain_path):**
- Parses setup.py for: package_name, description, entry_points, scripts, find_packages
- Handles both literal and ST2_COMPONENT variable patterns
- Handles description format strings ({} interpolation)
- Produces SETUP_PY evidence type

**extract_package_readme(domain_path):**
- Searches README.md, README.rst, README.txt, README
- Extracts heading, summary (first non-boilerplate paragraph), format, line_count
- Handles both Markdown and RST heading styles
- Produces PACKAGE_README evidence type

**extract_cross_package_deps(domain_path, all_domains):**
- Parses in-requirements.txt for internal vs external dependencies
- Matches package names against all CEU candidate domains
- Identifies external repo dependencies (git+ URLs)
- Produces CROSS_PACKAGE_DEP evidence type

**extract_repo_readme_mapping(source_repo, domain):**
- Scans repo-level README.md/RST for sections mentioning domain name
- Matches both heading text and inline bold definitions (e.g., "**Actions** are StackStorm outbound integrations")
- Produces REPO_README_MAP evidence type

### Phase 4 — Extractor Orchestration

Modified `build_evidence_anchors()`:

- Calls `detect_project_type()` to determine extractor set
- DJANGO: existing extractors (APP_CONFIG, MODULE_DOCSTRING, MODEL_INVENTORY, URL_NAMESPACE, OFFICIAL_DOCS, MODEL_DOCS)
- PYTHON_PACKAGE/UNKNOWN: new extractors (SETUP_PY, PACKAGE_README, CROSS_PACKAGE_DEP, REPO_README_MAP)
- MODULE_DOCSTRING runs for all project types (deduplicated)
- Gap detection now project-type-aware

### Phase 5 — Idempotent Re-intake

Added `--force` flag to both scripts:
- `ceu_evidence_intake.py --force`: overwrites existing evidence_anchors.json
- `ceu_reconciliation_seeder.py --force`: overwrites existing reconciliation state/obligations/event log
- CREATE_ONLY rule preserved as default; --force is explicit opt-in

### Phase 6 — StackStorm Re-intake Execution

Ran evidence intake and re-seeded reconciliation state:

| Metric | Before | After |
|--------|--------|-------|
| Evidence anchors | 0 | 22 |
| EVIDENCE_ATTACHED candidates | 0 | 11 |
| PROPOSED candidates | 15 | 4 |
| Evidence types | 0 | 4 |
| Obligations | 24 | 13 |

Evidence type distribution:
- SETUP_PY: 8
- CROSS_PACKAGE_DEP: 8
- PACKAGE_README: 3
- REPO_README_MAP: 3

Remaining gaps (structurally expected):
- CEU-CONFTEST.PY: single file, no package structure
- CEU-PACKAGING: deployment scripts, no setup.py
- CEU-PYLINT-PLUGINS: linting plugins, no setup.py
- CEU-SCRIPTS: operational scripts, no setup.py
- CEU-TOOLS: utility scripts, README maps from repo README

### Phase 7 — Regression Verification

NetBox evidence intake re-run: 66 anchors (identical to previous run). No regression.

## Observations

1. Project type detection is clean — Django projects have apps.py, Python packages have multiple setup.py files
2. setup.py parsing produces rich evidence: package names, descriptions, entry_points, scripts, cross-package dependencies
3. The repo README mapping provides domain-level architectural context that package-level README cannot
4. 4 candidates remain at PROPOSED — these are non-package directories (scripts, packaging, pylint_plugins, conftest.py). This is structurally correct — they ARE evidence gaps, not extractor failures
5. LRNE-0001 is resolved: the evidence intake gap was Django-specific extractors; generalized extractors produce 22 anchors

## Gaps Identified

| Gap | Severity | Status |
|-----|----------|--------|
| pyproject.toml extractor | LOW | Not needed — StackStorm uses setup.py. Future generalization candidate |
| setup.cfg extractor | LOW | Not needed — StackStorm uses setup.py. Future generalization candidate |
| JavaScript/TypeScript project type | FUTURE | Not triggered — no JS/TS clients yet |
| Nested package detection | LOW | Current detection works for flat multi-package repos. Monorepo support would need work |
