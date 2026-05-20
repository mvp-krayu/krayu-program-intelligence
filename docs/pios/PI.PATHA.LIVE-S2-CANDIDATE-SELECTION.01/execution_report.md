# Execution Report — PI.PATHA.LIVE-S2-CANDIDATE-SELECTION.01

## Stream Classification: G1

## Pre-Flight

- Branch: `feature/PI.PATHA.LIVE-S2-CANDIDATE-SELECTION.01`
- Branch authorized: YES (feature branch from main, research/evaluation stream)
- Canonical state loaded: YES
- Terminology loaded: YES
- Concept-specific pages loaded: CURRENT_CANONICAL_PATHS.md
- Preflight result: PASS

## Mission

Identify and evaluate open-source repositories suitable as the first canonical live S2 candidate for Program Intelligence. Select for operational-semantic richness, narrative transformation potential, and PATH A/B viability — not mere processability.

## Execution Sequence

### Phase 1 — Web Research

Searched across 8 target categories:
1. Workflow engines / state machines / orchestration
2. Incident management platforms
3. Billing / subscription management
4. Deployment / orchestration / control planes
5. Identity / access management (RBAC)
6. Observability / monitoring platforms
7. Asset inventory / CMDB
8. Task queues / job schedulers

16 web searches executed. 2 deep-wiki structural analyses performed.

### Phase 2 — Initial Candidate Assembly

20+ repositories identified from web research. GitHub API metadata collected for 8 shortlisted repos (stars, size, language, license, activity).

### Phase 3 — Rejection Criteria Screening

Eliminated:
- **Apache Airflow** (607MB) — too large, framework-first
- **Dagster** (1.4GB) — too large
- **Sentry** (874MB) — too large, polyglot (Python + TypeScript)
- **Netflix Dispatch** — archived September 2025
- **Paperless-ngx** — GPL-3.0, document management (insufficient operational domain)
- **Prefect** — framework-first (orchestration framework, not operational application)
- Billing platforms (Kill Bill, Meteroid) — Java/Rust-primary, not Python
- RBAC libraries (PyCasbin, py-rbac) — library-only, no operational domain
- Helpdesk systems (django-helpdesk) — too small, limited operational semantics

### Phase 4 — Hard Operational-Semantic Filter (3+ of 7 required)

| Criterion | NetBox | Nautobot | StackStorm | AWX | Ralph | InvenTree |
|---|---|---|---|---|---|---|
| Workflows | YES | YES | YES | YES | YES | YES |
| State transitions | YES | YES | YES | YES | YES | YES |
| Operational responsibilities | YES | YES | YES | YES | PARTIAL | YES |
| Role boundaries | YES | YES | YES | YES | PARTIAL | YES |
| Orchestration behavior | PARTIAL | YES | YES | YES | NO | PARTIAL |
| Runtime coordination | YES | YES | YES | YES | NO | NO |
| Reconciliation logic | YES | YES | PARTIAL | PARTIAL | NO | NO |
| **Score** | **6.5/7** | **7/7** | **6.5/7** | **6.5/7** | **3.5/7** | **4.5/7** |

All 6 candidates pass the hard filter (3+ of 7).

### Phase 5 — PATH B Viability Checkpoint

| Criterion | NetBox | Nautobot | StackStorm | AWX | Ralph | InvenTree |
|---|---|---|---|---|---|---|
| Compiler proposals | YES | YES | YES | YES | PARTIAL | YES |
| CSR emergence | YES | YES | PARTIAL | PARTIAL | PARTIAL | PARTIAL |
| Reconciliation pressure | YES | YES | PARTIAL | PARTIAL | NO | PARTIAL |
| Grounding expansion | YES | YES | YES | YES | PARTIAL | YES |
| SQO onboarding workflow | YES | YES | YES | YES | PARTIAL | YES |
| **PATH B viable** | **YES** | **YES** | **YES** | **YES** | **NO** | **PARTIAL** |

Ralph eliminated (insufficient PATH B material). InvenTree marginal.

### Phase 6 — 10-Criterion Scoring

Scoring matrix applied to 5 surviving candidates. See CANDIDATE_SCORING_MATRIX.md.

### Phase 7 — Selection

**Top candidate: NetBox** (netbox-community/netbox) — Score: 63/80
**Backup candidate: Nautobot** (nautobot/nautobot) — Score: 50/80

### Phase 8 — Narrative Justification

"Why this repo proves Program Intelligence matters" written. See CANDIDATE_SCORING_MATRIX.md §7.

## Research Evidence

### GitHub API Data Collected

| Repo | Stars | Size (KB) | Language | License | Files (.py) | Last Updated |
|---|---|---|---|---|---|---|
| netbox-community/netbox | 20,550 | 192,597 | Python | Apache-2.0 | 1,156 | 2026-05-20 |
| nautobot/nautobot | 1,500 | 279,866 | Python | Apache-2.0 | — | 2026-05-19 |
| StackStorm/st2 | 6,470 | 42,797 | Python | Apache-2.0 | 1,333 | 2026-05-19 |
| ansible/awx | 15,420 | 354,078 | Python | (unlisted) | 1,037 | 2026-05-20 |
| allegro/ralph | 2,494 | 39,500 | Python | Apache-2.0 | — | 2026-05-19 |
| inventree/InvenTree | 6,995 | 327,199 | Python | MIT | — | 2026-05-20 |

### NetBox Structural Profile (from GitHub API tree inspection)

- **Django apps**: 11 operational domains (dcim, ipam, circuits, core, extras, tenancy, users, virtualization, vpn, wireless, account)
- **Model files**: ~60 across all apps
- **DCIM module alone**: 184 files (10 model files: base, cables, device_component_templates, device_components, devices, mixins, modules, power, racks, sites)
- **Device lifecycle states**: Planned, Staged, Active, Offline, Failed, Inventory, Decommissioning (7+ states with governed transitions)
- **Permissions**: Object-based RBAC with Django QuerySet-filter constraints
- **Extensibility**: Custom fields, webhooks, event rules, plugin system, custom scripts
- **Change logging**: Full audit trail on all object mutations
- **Data sources**: External data sync with drift detection

## Governance

- No data mutation
- No computation
- No interpretation
- No new API calls
- Research-only stream: web searches and GitHub API queries
