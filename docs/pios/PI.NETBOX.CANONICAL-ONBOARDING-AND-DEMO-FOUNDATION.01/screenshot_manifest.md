# Screenshot Manifest — PI.NETBOX.CANONICAL-ONBOARDING-AND-DEMO-FOUNDATION.01

## Capture Context

- Client: netbox
- Run: run_github_netbox_20260520_134600
- Date: 2026-05-20
- Server: Next.js dev server at localhost:3001
- Tool: Playwright MCP

## Screenshots

### 1. SQO Cockpit V1 — S0 Overview

**File:** `screenshots/netbox-sqo-cockpit-s0-overview.png`

**Content:** Full SQO cockpit overview page showing "Cockpit Unavailable" state with complete artifact binding diagnostics. 23 missing artifacts listed (2 MISSING_REQUIRED, 21 MISSING_OPTIONAL). Navigation sidebar shows all sections with availability indicators. Governance footer: "Missing data is explicitly displayed. No silent fallback. No fabrication."

**What it demonstrates:** SQO cockpit correctly handles a structural-only client with no SQO artifacts. No silent fallback. No fabrication. Explicit display of missing data.

### 2. SQO Cockpit V2 — Role Declaration Gate

**File:** `screenshots/netbox-v2-role-gate.png`

**Content:** V2 cockpit role declaration screen showing all 5 RBAC roles: Operator, Reviewer, Domain Authority, Promotion Authority, Audit Authority. Each role shows description and authority scope.

**What it demonstrates:** V2 cockpit renders correctly for an unqualified client. Role declaration gate is independent of SQO artifact availability.

### 3. SQO Cockpit V2 — Operator View (S0)

**File:** `screenshots/netbox-v2-cockpit-operator-s0.png`

**Content:** V2 cockpit after Operator role selection showing "Cockpit Unavailable" with artifact binding diagnostics. V2 navigation rail (Overview, Authority) visible in left sidebar. Same diagnostic data as V1 but with V2 layout and role context.

**What it demonstrates:** V2 cockpit degrades gracefully to diagnostic view when no SQO artifacts are available. Role selection works even without qualification data.

### 4. LENS v2 — Binding Failure

**File:** `screenshots/netbox-lens-v2-binding-failure.png`

**Content:** LENS v2 live binding failure page: "LIVE_BINDING_FAILED". Details: MANIFEST_INVALID, binding_status: REJECTED. Message: "LENS V2 could not bind to the BlueEdge productized substrate. Fixture fallback is disabled by contract (FIXTURE_FALLBACK_DISABLED). The flagship surface refuses to display synthetic semantics."

**What it demonstrates:** LENS v2 manifest validation correctly rejects the NetBox manifest (missing semantic_topology_model and dpsig_signal_set). No synthetic fallback — the system refuses to display incomplete data. This is the expected behavior for an S1 structural-only client.

---

## Post-Merge Screenshots (Operational Activation)

### 5. SQO Cockpit — NetBox S1 Posture

**File:** `sqo-netbox-s1-posture.png` (project root)

**Content:** SQO cockpit overview for NetBox showing S1 qualification posture. S1 badge with "Qualification Pending" label. Summary: "Review obligations exist. Qualification pending operator review actions." Runtime capabilities detected: Structural Topology, Authority Workflow, Qualification Blockers, Event Lineage. Available sections: Authority. Navigation sidebar with client/run binding.

**What it demonstrates:** After S1 structural-only LENS support was implemented and the pipeline produced operational SQO artifacts (`promotion_state.json`, `qualification_blockers.json`, `review_obligations.json`), the SQO cockpit correctly derives S1 posture from runtime capabilities. Progression from "Cockpit Unavailable" (screenshot #1) to operational posture view.

### 6. SQO Cockpit — StackStorm Unavailable

**File:** `sqo-stackstorm-unavailable.png` (project root)

**Content:** SQO cockpit for StackStorm showing "Cockpit Unavailable" with artifact binding diagnostics. 0/23 artifacts present. Shell renders, navigation sidebar works, client/run binding correct.

**What it demonstrates:** StackStorm was onboarded via individual pipeline scripts, not `run_client_pipeline.py`, so operational SQO artifacts were not produced. The cockpit correctly shows unavailable state with diagnostics. This is a gap in the onboarding workflow, not a cockpit defect.

### 7. LENS v2 — NetBox Authority Enriched

**File:** `lens-netbox-authority-enriched.png` (project root)

**Content:** LENS v2 dense topology view for NetBox. Topology Surface actor with "Authority Enriched" maturity badge. Full SVG topology graph rendered (ENRICHED svg_policy). Structural Spines Panel showing top 10 centrality spines with decomposed IMP/INH metrics. Dual authority tags: "IMPORT AUTHORITY: dcim/choices.py (76)" and "INHERITANCE AUTHORITY: utilities/choices.py (107)". Cluster concentration stats showing code graph metrics.

**What it demonstrates:** Structural enrichment pipeline active — code graph metrics, centrality decomposition, and dual authority detection all rendering correctly. Topology maturity gating allows full SVG at AUTHORITY_ENRICHED level.

### 8. LENS v2 — StackStorm Authority Enriched

**File:** `lens-stackstorm-authority-enriched.png` (project root)

**Content:** LENS v2 dense topology view for StackStorm. Topology Surface actor with "Authority Enriched" maturity badge. Full SVG topology graph rendered. Structural Spines Panel showing top 10 centrality spines. Dual authority tags: "IMPORT AUTHORITY: util/monkey_patch.py (64)" and "INHERITANCE AUTHORITY: api/base.py (59)".

**What it demonstrates:** Second specimen renders identically to the first through the same generic pipeline. No client-specific code branching. Topology maturity promoted from GRAPH_ENRICHED to AUTHORITY_ENRICHED after centrality gap was filled.

## Post-CEU Reconciliation Screenshots (Executive Demonstration Foundation)

### 9. SQO V1 — Post-CEU Overview

**File:** `screenshots/netbox-sqo-overview-post-ceu.png`

**Content:** SQO cockpit V1 overview showing S1 Qualification Pending posture after CEU reconciliation. Runtime capabilities: Structural Topology, Authority Workflow, Qualification Blockers, Event Lineage. Available section: Authority.

**What it demonstrates:** Post-CEU reconciliation, the SQO cockpit correctly reflects the operational state with detected runtime capabilities. The CEU Reconciliation section is accessible in the sidebar navigation.

### 10. CEU Reconciliation — Complete (OPERATOR_VALIDATED)

**File:** `screenshots/netbox-ceu-reconciliation-complete.png`

**Content:** Full CEU reconciliation page: Operator Validated status, 12 confirmed candidates, 1 merged (CEU-ACCOUNT → CEU-USERS), 0 rejected, 0 pending. 4 obligations resolved. Full event timeline (34+ events) showing reconciliation progression from initialization through evidence attachment, reconciliation, confirmation, merge, obligation resolution, and governance correction (SYSTEM_TEST → OPERATOR_VALIDATED). Promotion gate OPEN.

**What it demonstrates:** End-to-end governed reconciliation workflow: structure proposes → evidence attaches → operator validates → gate opens. Non-automatable boundary enforced (governance correction visible in timeline). This is the strongest commercial proof point.

### 11. LENS v2 — Current Structural Intelligence

**File:** `screenshots/netbox-lens-v2-current.png`

**Content:** LENS v2 full structural intelligence view. "INTELLIGENCE BLOCKED" disclosure banner. Structural topology with 24 clusters, code graph metrics (3,614 IMPORTS, 1,089 ranked files). Interactive SVG topology graph with domain rings. Structural Spines Panel with centrality rankings. Dual authority detection badges.

**What it demonstrates:** Structural intelligence surface rendering at S1 — honest "INTELLIGENCE BLOCKED" disclosure, full structural depth available, no semantic overclaim.

### 12. V2 Cockpit — Operator View

**File:** `screenshots/netbox-v2-operator-cockpit.png`

**Content:** V2 cockpit after Operator role selection. S1 Qualification Pending with 7 qualification blockers. 12 available actions (grouped by Review, Promotion, Structural, Escalation, Insufficiency). 6-step qualification progression rail. Evidence state inventory. Blocker escalation guidance.

**What it demonstrates:** Workflow-driven operational cockpit: posture dominates, blockers are surfaced with escalation requirements, all 12 actions visible with availability reasons. The operator knows exactly where they are and what they can do.

### 13. V2 Cockpit — Role Declaration Gate

**File:** `screenshots/netbox-v2-cockpit-current.png`

**Content:** V2 role declaration screen with 5 RBAC roles and operator identifier input. Each role shows authority scope.

**What it demonstrates:** Declarative RBAC gate — session-level role selection before operational access.

## Governance

All screenshots are governed evidence captures of actual runtime behavior. No mockups. No synthetic data. No post-processing.
