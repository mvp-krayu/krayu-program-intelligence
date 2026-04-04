# Git Structure Contract

Status
LOCKED — AUTHORITATIVE

Scope
Krayu — Program Intelligence Discipline

Purpose
This contract establishes the permanent Git structure, ownership model, and branch-domain separation for the Program Intelligence system.

This contract exists to prevent:
- branch/domain confusion
- Core leakage into runtime or demo branches
- governance becoming hidden execution authority
- accidental recovery or anchoring of artifacts on the wrong branch
- future drift between Ledger / Ingestion / Core / Activation / Runtime / Publishing

This contract is operational and binding.

────────────────────────────────────

1. REPOSITORIES

There are only two authoritative repositories in the system.

A. krayu-program-intelligence
This is the system repository.
It owns:
- Ledger Selector
- Ingestion
- PiOS Core
- Activation
- Runtime / Demo
- Governance documents

B. krayu-mirror
This is the publishing repository.
It owns:
- WEB pipeline
- publishing projection
- crawlable and SEO-facing surfaces

No third execution repository is recognized.

Working directories may vary locally, but repository authority does not.

────────────────────────────────────

2. BOUNDARY CONTRACT LOCK

The system boundary is locked as follows:

Ledger Selector
→ pre-system entry mechanism
→ selects source and delivers a conforming evidence boundary
→ performs no computation
→ produces no governed artifacts

Ingestion
→ Streams 40.2 → 40.3 → 40.4
→ canonical layer: L1
→ scans, classifies, normalizes, and validates evidence
→ is upstream of PiOS Core
→ is not part of PiOS Core

PiOS Core
→ canonical layers: L2 + L3 + L4
→ begins only after validated 40.4 handoff
→ owns navigation, derivation, semantic shaping
→ owns signals, conditions, diagnosis, ESI, RAG, manifests, semantic payloads
→ does not own L5, L6, or L7

Activation
→ canonical layer: L5
→ includes 43.x and 44.x
→ binds and projects Core outputs
→ consumes Core outputs only
→ performs no derivation

Runtime
→ canonical layer: L6
→ includes 42.x runtime consumption
→ renders and interacts
→ consumes prepared payloads
→ performs no derivation

Demo / Narrative
→ canonical layer: L7
→ includes 51.x
→ packages runtime-visible truth for guided demonstration
→ performs no derivation

Governance / Validation
→ canonical layer: L8
→ defines, validates, audits, and records
→ does not become hidden computation authority

────────────────────────────────────

3. BRANCH MODEL

The system repository uses fixed branch domains.

A. main
Role
Stable integrated baseline

Owns
- validated integrated states only

Must not
- carry dirty work
- host recovery staging
- host experimental branch-specific authority

B. feature/pios-core
Role
PiOS Core authority branch

Owns
- 40.2 → 40.7
- 40.16
- 41.x
- L8 validators related to Core
- docs/pios/40.x
- docs/pios/41.x
- scripts/pios/40.x
- scripts/pios/41.x

Responsibilities
- Ingestion execution
- Core derivation
- condition and diagnosis synthesis
- ESI/RAG implementation
- semantic shaping
- execution manifests
- Core-side validation artifacts

Must not
- implement L5 activation logic
- implement L6 runtime logic
- implement L7 demo logic
- absorb governance prose as execution logic

C. feature/activation
Role
Activation authority branch

Owns
- 43.x
- 44.x
- docs/pios/43.x
- docs/pios/44.x
- scripts/pios/43.x
- scripts/pios/44.x

Responsibilities
- Signal-to-Structure Binding
- Structural Overlay Projection
- downstream activation of Core outputs into structural carriers

Must not
- compute signals
- compute ESI/RAG
- redefine semantic truth
- host runtime rendering logic

D. feature/runtime-demo
Role
Runtime / Demo authority branch

Owns
- 42.x
- 51.x
- app/execlens-demo
- scripts/pios/42.x
- docs/pios/51.x

Responsibilities
- runtime consumption
- adapter execution
- demo orchestration
- guided narrative packaging

Must not
- own Core truth
- compute derivation
- redefine semantics
- become hidden activation authority

E. feature/governance
Role
Governance authority branch

Owns
- docs/governance/**

Responsibilities
- canonical definitions
- classification
- drift registration
- validation records
- architecture reference

Must not
- implement runtime logic
- implement Core logic
- become hidden execution source
- own branch-local truth that is not declared canonically

────────────────────────────────────

4. OWNERSHIP RULES

Layer ownership is fixed.

L0
External evidence source
Not owned by system repo

L1
Ingestion
Owned by feature/pios-core
Includes 40.2 → 40.4 execution

L2
Evidence Navigation
Owned by feature/pios-core

L3
Derivation
Owned by feature/pios-core

L4
Semantic Shaping
Owned by feature/pios-core

L5
Presentation Assembly / Activation
Owned by feature/activation

L6
Runtime Experience
Owned by feature/runtime-demo

L7
Demo / Narrative Packaging
Owned by feature/runtime-demo

L8
Governance / Validation
Governance definitions on feature/governance
Core validation executables on feature/pios-core where applicable

────────────────────────────────────

5. FORBIDDEN ACTIONS

The following are hard violations.

- Recovering or anchoring PiOS Core artifacts on feature/runtime-demo
- Recovering or anchoring PiOS Core artifacts on feature/governance
- Implementing derivation outside feature/pios-core
- Implementing 43.x / 44.x on feature/pios-core
- Implementing runtime/demo logic on feature/pios-core
- Implementing governance prose as hidden execution logic
- Treating branch names as architecture truth
- Treating local folder names as repository truth
- Using replay from 40.4 as proof of full reconstructability
- Allowing runtime surfaces to compensate for missing upstream computation
- Allowing activation layers to create or mutate Core truth
- Allowing governance branch artifacts to become execution source without formal promotion

Any of the above must be treated as a contract breach.

────────────────────────────────────

6. RECOVERY AND ANCHORING RULE

Recovered artifacts must never be committed to the nearest available branch by convenience.

Recovered artifacts must be:
1. identified
2. classified
3. assigned to the correct branch domain
4. only then anchored by commit

Protection does not override ownership.
Nearest location is not rightful authority.

Example
- PiOS Core recovery artifacts such as 40.12 or 40.16 must be anchored on feature/pios-core
- never on feature/runtime-demo
- never on feature/governance

────────────────────────────────────

7. RECONSTRUCTABILITY RULE

Full reconstructability begins at raw source.

The only valid full reconstruction path is:

Ledger Selector
→ 40.2
→ 40.3
→ 40.4
→ validated handoff
→ PiOS Core
→ downstream consumption

Replay from 40.4 is permitted only as:
- debug mode
- isolation mode
- defect localization mode

Replay from 40.4 must never be represented as proof of full reconstructability.

────────────────────────────────────

8. REPRODUCIBILITY RULE

The system boundary is considered valid only if:

- the same fixed source
- through the same Ledger Selector mode
- produces the same 40.4 handoff
- produces the same Core outputs
- produces the same downstream runtime/demo behavior
- without violating canonical layer ownership

Current reference runtime truth is:
- early warning signals
- current WOW/topology behavior
- current ExecLens runtime behavior

ESI/RAG are additive L3 outputs and must not break existing reference behavior.

────────────────────────────────────

9. LOCAL WORKING DIRECTORY MODEL

Local directories must map cleanly to branch domains.

Recommended working directories:

~/Projects/k-pi-main
→ main

~/Projects/k-pi-core
→ feature/pios-core

~/Projects/k-pi-activation
→ feature/activation

~/Projects/k-pi-runtime
→ feature/runtime-demo

~/Projects/k-pi-governance
→ feature/governance

~/Projects/krayu-mirror
→ krayu-mirror repo

Local folder names do not create authority.
Branch role and repository identity create authority.

────────────────────────────────────

10. PROMOTION FLOW

Promotion flow is fixed.

feature/pios-core
→ main

feature/pios-core
→ feature/activation
→ main

feature/pios-core
→ feature/runtime-demo
→ main

feature/governance
→ informs branch work
→ does not silently override execution

main
→ krayu-mirror

No alternative path is recognized.

────────────────────────────────────

11. EXECUTION PRE-FLIGHT

Before any Claude execution, the following must be confirmed:

1. Contract loaded:
   docs/governance/runtime/git_structure_contract.md

2. Current repository:
   krayu-program-intelligence or krayu-mirror

3. Current branch:
   one of:
   - main
   - feature/pios-core
   - feature/activation
   - feature/runtime-demo
   - feature/governance

4. Allowed scope for current branch:
   explicitly stated

5. No boundary violation is planned:
   YES / NO

If NO:
STOP

No execution is valid without pre-flight confirmation.

────────────────────────────────────

12. CLAUDE EXECUTION RULE

Claude must operate under this contract.

Claude must:
- load this contract before execution
- respect branch/domain ownership
- refuse cross-domain execution that violates this contract
- report any detected boundary breach
- avoid making convenience commits on the wrong branch

Claude must not:
- improvise new branch roles
- treat governance as execution authority
- treat runtime/demo as Core authority
- bypass the branch-domain model

────────────────────────────────────

13. STATUS OF THIS CONTRACT

This contract is:
- authoritative
- active
- binding
- non-optional

It governs all future work unless superseded by a higher-order governance amendment of equal explicitness and authority.

No informal conversation may override it.

────────────────────────────────────

14. FINAL STATEMENT

There is one system repository and one publishing repository.

Within the system repository, branch domains are fixed:

- feature/pios-core owns Ingestion + Core
- feature/activation owns L5 activation
- feature/runtime-demo owns L6–L7 runtime/demo
- feature/governance owns canonical definition
- main owns stable integration

No branch may absorb another domain by convenience.
No artifact may be anchored on the wrong branch because it happens to be present there.
No downstream layer may become hidden Core.
No governance layer may become hidden execution.

This contract exists to prevent drift, preserve reconstructability, and keep the system aligned with canonical layer truth.
