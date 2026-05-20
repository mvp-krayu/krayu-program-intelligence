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

## Governance

All screenshots are governed evidence captures of actual runtime behavior. No mockups. No synthetic data. No post-processing.
