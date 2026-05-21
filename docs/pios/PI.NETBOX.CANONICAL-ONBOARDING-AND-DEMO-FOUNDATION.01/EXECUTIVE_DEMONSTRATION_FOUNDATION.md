# Executive Demonstration Foundation — NetBox

> Canonical demonstration walkthrough for NetBox (netbox-community/netbox), the first live Program Intelligence specimen through end-to-end structural qualification.

---

## Demonstration Identity

- **Subject:** NetBox — open-source network infrastructure management (netbox-community/netbox)
- **Run:** run_github_netbox_20260520_134600
- **Current State:** S1 CEU RECONCILED, OPERATOR_VALIDATED, promotion gate OPEN
- **Date:** 2026-05-21

---

## Narrative Arc

### Act 1 — Source Acquisition (30 seconds)

**What happens:** A GitHub repository URL is provided. The pipeline clones, archives, and inventories the repository.

**Key numbers:**
- 2,169 files inventoried
- 59MB repository archived with SHA256 provenance
- Deterministic source manifest produced

**Demo point:** Any GitHub repository. No configuration. No onboarding questionnaire. No pre-existing knowledge of the project.

### Act 2 — Structural Intelligence Emergence (60 seconds)

**What happens:** The pipeline scans, classifies, and enriches the structural topology without any semantic input.

**Key numbers:**
- 2,540 structural nodes identified
- 1,848 PRIMARY, 138 SUPPORT, 554 PERIPHERAL (structural relevance classification)
- 3,614 resolved import relationships (code-graph enrichment)
- 1,089 files ranked by structural centrality
- 24 structural clusters emerged

**Demo point:** Structure emerges from evidence, not from documentation or human description. The system sees what the repository actually IS, not what anyone says it is.

**Hero moment:** NetBox's 11 Django domain apps (DCIM, IPAM, circuits, tenancy, virtualization, wireless, VPN, core, extras, users, account) emerged as distinct structural clusters from code analysis alone — matching the project's own architectural intent without reading any documentation.

### Act 3 — Structural Surprise Report (45 seconds)

**What happens:** The system reveals structural facts that were NOT obvious from README or documentation.

**11 genuine structural surprises:**
1. `utilities/` is NOT a utility library — it's a 233-file architectural spine with its own model inventory
2. `dcim/` dominates with 170 files (15% of codebase) — expected for infrastructure management, but the degree of dominance is remarkable
3. `extras/` (133 files) is the second-largest domain — an extensibility framework, not an afterthought
4. Every domain has its own `api/urls.py` namespace — genuine API-first architecture, not bolted-on
5. Dual authority pattern: `dcim/choices.py` dominates import authority (76 inbound), while `utilities/choices.py` dominates inheritance authority (107 inbound)

**Demo point:** Program Intelligence reveals structural truth that no amount of documentation reading can substitute. These are facts about the codebase, not opinions about the codebase.

### Act 4 — CEU Reconciliation (90 seconds)

**What happens:** The system structurally derives 13 Canonical Execution Unit candidates, extracts 66 documentation evidence anchors, and presents them for human-governed reconciliation.

**Key numbers:**
- 13 CEU candidates derived from structural topology
- 66 evidence anchors extracted (AppConfig, model inventory, URL namespace, official docs, model docs)
- 12 candidates CONFIRMED by operator
- 1 candidate MERGED (account → users)
- 4 review obligations resolved with justification
- Review mode: OPERATOR_VALIDATED

**Demo point:** The system proposes. The human validates. The system records. Nobody can self-authorize promotion. The promotion gate opened because a human operator validated, not because the system decided it was ready.

**See:** `screenshots/netbox-ceu-reconciliation-complete.png`

### Act 5 — Operational Cockpit (60 seconds)

**What happens:** The SQO cockpit shows the full qualification state, progression path, available actions, and evidence state.

**V2 Operator Cockpit shows:**
- S1 Qualification Pending with 7 qualification blockers
- 12 operator actions (all visible, unavailable actions show reason + required role)
- 6-step qualification progression rail (Structural Derivation complete → Semantic Derivation awaiting)
- Evidence state (Structural Topology active, Event Lineage active)
- Blocker escalation guidance

**Demo point:** This is not a dashboard. This is a governed operational workbench. Every action is auditable. Every mutation is append-only. Every role has explicit authority boundaries. The system tells the operator what to do next — not what the codebase means.

**See:** `screenshots/netbox-v2-operator-cockpit.png`

### Act 6 — Structural Intelligence Surface (45 seconds)

**What happens:** LENS v2 renders the full structural intelligence view with interactive topology, centrality spines, and dual authority detection.

**LENS v2 shows:**
- "INTELLIGENCE BLOCKED" disclosure (no semantic authority — honest about what it doesn't know)
- 24 structural clusters with domain rings
- Interactive SVG topology graph
- Structural spines panel with top centrality files
- Dual authority detection (import vs inheritance authority)
- Code graph metrics (3,614 IMPORTS, 1,089 ranked)

**Demo point:** The intelligence surface shows structural truth with governed confidence boundaries. It does NOT claim to understand the project semantically. It shows what the structure reveals, with explicit disclosure of what it cannot yet show.

**See:** `screenshots/netbox-lens-v2-current.png`

---

## Demonstration Sequence (Recommended)

| Step | Surface | Duration | What to show |
|------|---------|----------|--------------|
| 1 | Terminal | 30s | Pipeline execution command, file counts |
| 2 | LENS v2 | 60s | Structural topology, clusters, centrality spines |
| 3 | Surprise Report | 45s | Read 3 highlights from the 11 surprises |
| 4 | CEU Reconciliation | 90s | Walk through candidate table, evidence anchors, operator validation |
| 5 | V2 Cockpit | 60s | Qualification state, blocker list, progression path, available actions |
| 6 | Closing | 30s | "This was a repository we'd never seen. No configuration. No questionnaire. Structural intelligence emerged from evidence." |

**Total:** ~5 minutes

---

## What to Emphasize

1. **Zero prior knowledge.** NetBox was onboarded with a URL. No project documentation was pre-loaded, no architecture diagrams were provided, no humans described the codebase.

2. **Structure, not opinion.** Every claim traces to structural evidence. Import counts, centrality scores, cluster assignments — these are measurements, not assessments.

3. **Human governance, not AI autonomy.** The system proposes, derives, and presents. Humans validate, confirm, and authorize. The non-automatable boundary prevents self-authorization at every level.

4. **Honest about limitations.** "INTELLIGENCE BLOCKED" is a feature, not a bug. The system discloses what it cannot yet show rather than fabricating confidence.

5. **Replayable.** Same inputs produce same outputs. Every command is documented in `replay_commands.md`. Any engineer can reproduce the entire onboarding.

---

## What NOT to Say

- "The AI understands the codebase" — it doesn't. It observes structure.
- "The system recommends..." — it doesn't prescribe. It presents structural evidence.
- "This works for any language" — it works for Python repositories. Language extension is documented, not claimed.
- "S2 is ready" — the promotion gate is open, but semantic compiler isn't active yet. Don't overclaim.

---

## Comparative Evidence (StackStorm)

StackStorm (StackStorm/st2) serves as a comparative learning specimen:
- 1,804 nodes, 3,087 IMPORTS, 920 ranked files
- 22 evidence anchors (generalized Python-package extractors)
- Different project structure (setuptools multi-package vs Django)
- Same pipeline, same evidence types, different structural topology

**Use only if asked:** "What happens with a different project type?" The answer: same pipeline, different evidence, comparable structural intelligence depth.

---

## Screenshot Inventory (Post-CEU)

| Screenshot | What it shows |
|-----------|---------------|
| `netbox-sqo-overview-post-ceu.png` | SQO V1 overview — S1 posture, runtime capabilities, available sections |
| `netbox-ceu-reconciliation-complete.png` | Full CEU reconciliation — 12 confirmed, 1 merged, OPERATOR_VALIDATED, event timeline |
| `netbox-lens-v2-current.png` | LENS v2 structural intelligence — topology, clusters, spines, dual authority |
| `netbox-v2-operator-cockpit.png` | V2 cockpit operator view — S1, blockers, actions, progression rail |
| `netbox-v2-cockpit-current.png` | V2 role declaration gate — 5 RBAC roles |

---

## Governance

This document is a demonstration planning artifact, not a marketing claim. All numbers are measured from actual pipeline output. All screenshots are unmodified runtime captures. No synthetic data. No staged behavior.

Replayable from: `replay_commands.md`
