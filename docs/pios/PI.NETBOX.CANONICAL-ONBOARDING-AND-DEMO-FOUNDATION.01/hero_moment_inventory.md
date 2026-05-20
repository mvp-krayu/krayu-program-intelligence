# Hero Moment Inventory — PI.NETBOX.CANONICAL-ONBOARDING-AND-DEMO-FOUNDATION.01

## Discipline

Per stream contract: hero moments are NOT manufactured. Only genuinely surprising structural revelations, non-obvious operational relationships, or evidence transformations impossible to infer casually are catalogued.

## Hero Moments

### HM-01: DCIM Gravitational Dominance

**Evidence:** 40.3c centrality — `dcim/models/__init__.py` at 160 inbound imports, exceeding core (114) + extras (95) combined.

**Why it's a hero moment:** From the README, DCIM appears as one of eleven peer apps. The import graph reveals it as the structural spine — not a peer but the foundation. No casual code review would produce this quantified dominance ranking.

### HM-02: 60.8% Cross-Domain Import Rate

**Evidence:** 40.3s code-graph — 2,197 of 3,614 imports cross app boundaries.

**Why it's a hero moment:** The Django app structure implies modularity. PI reveals the opposite — the majority of all imports cross app boundaries. The apparent modularity is organizational fiction at the structural level.

### HM-03: Bidirectional DCIM ↔ IPAM Entanglement

**Evidence:** 40.3s cross-domain analysis — 30 DCIM→IPAM + 28 IPAM→DCIM = 58 bidirectional imports.

**Why it's a hero moment:** These domains appear separate in documentation and UI. The bidirectional structural coupling means they cannot be independently versioned, tested, or extracted.

### HM-04: Choice Enumerations as Coupling Multipliers

**Evidence:** 40.3c centrality — `dcim/choices.py` at 76 inbound imports; 4 choices files totaling 203 combined inbound.

**Why it's a hero moment:** Small enumeration files (~50-200 lines) have disproportionate structural influence. Adding a device status choice propagates to 76+ files — a coupling multiplier invisible to code review.

### HM-05: Pipeline Self-Improvement Through Live Onboarding

**Evidence:** Three pipeline fixes during onboarding: source root discovery (21→1,155 files), cross-app import resolution (580→3,614 imports).

**Why it's a hero moment:** The first real-world onboarding exposed genuine pipeline limitations that testing on Flask (single-package) could not reveal. Each fix improved the pipeline for all future multi-app Python projects. The S2 candidate selection criteria correctly predicted that NetBox's complexity would stress-test the pipeline.

## Rejected Candidates

The following were considered but do NOT qualify as hero moments:

- **SRC classification accuracy** — 72.8% PRIMARY is expected for a well-structured project. Not surprising.
- **24 clusters in 40.4** — expected given the directory structure. Not revealing.
- **SQO cockpit showing "Unavailable"** — expected for a structural-only client. Correct behavior, not surprising.
- **Claude Code skills in NetBox** — interesting but not a structural intelligence finding. It's visible from `ls .claude/`.
