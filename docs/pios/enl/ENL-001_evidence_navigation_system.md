ENL-001 — Evidence Navigation System (Concept & Contract)
──────────────────────────────────────────────────────────

Program
Krayu — Program Intelligence Discipline

Date
2026-03-21

Stream Reference
ENL-001 — Evidence Navigation System (Concept & Contract)

──────────────────────────────────────────────────────────
Position in Architecture
──────────────────────────────────────────────────────────

40.x → Computation Layer  
41.x → Semantic Layer  
42.x → ExecLens (proto perception)  

ENL-XXX → Evidence Navigation System (formal perception system)

──────────────────────────────────────────────────────────
Context
──────────────────────────────────────────────────────────

Following completion of:

- PiOS execution pipeline (40.x)
- Semantic transformation layer (41.x)
- Initial perception constructs (42.x — ExecLens)

The system has reached:

→ Structural completeness in signal production

However:

- Navigation from INTEL → SIG-41 → SIG-40 → EVID remains implicit
- Evidence traceability exists but is not exposed as a system
- Perception remains fragmented and non-deterministic

──────────────────────────────────────────────────────────
Problem Statement
──────────────────────────────────────────────────────────

Current state:

- Signals and narratives are produced
- Evidence exists and is linked
- No formal navigation system governs traversal

This results in:

- Hidden derivation paths
- Reduced trust surface
- Lack of deterministic drill-down
- Perception layer not productizable

──────────────────────────────────────────────────────────
Objective
──────────────────────────────────────────────────────────

Define and formalize:

The Evidence Navigation System (ENL)

As a first-class system responsible for:

- deterministic traversal
- evidence traceability exposure
- multi-layer navigation
- persona-aware projection hooks

──────────────────────────────────────────────────────────
Definition
──────────────────────────────────────────────────────────

ENL (Evidence Navigation System) enables deterministic traversal
from narrative insight to raw evidence across all transformation layers,
preserving full traceability and evidence integrity.

──────────────────────────────────────────────────────────
Scope
──────────────────────────────────────────────────────────

IN SCOPE

- Definition of ENL system boundaries
- Formal navigation model
- Node types and relationships (conceptual)
- Traversal principles
- Separation from computation layers
- Alignment with Evidence-First doctrine

OUT OF SCOPE

- Graph schema implementation (ENL-002)
- API development
- UI / visualization
- Persona rendering logic
- Vault restructuring

──────────────────────────────────────────────────────────
Core Principles
──────────────────────────────────────────────────────────

1. No Computation

ENL must not compute, transform, or generate signals.

ENL only:
- resolves
- links
- exposes

────────────────────────────────────────

2. Deterministic Traversal

All upstream and downstream paths must be fully resolvable
and consistent across runs.

────────────────────────────────────────

3. Evidence First Enforcement

Every navigation path must terminate in verifiable evidence.

No evidence → no navigation endpoint

────────────────────────────────────────

4. Layer Integrity

INTEL → narrative  
SIG-41 → semantic  
SIG-40 → computed  
EVID → raw  

No blending of layers is allowed.

────────────────────────────────────────

5. Progressive Concreteness

Each navigation step increases concreteness:

INTEL  
↓  
SIG-41  
↓  
SIG-40  
↓  
EVID

────────────────────────────────────────

6. Run Awareness

All nodes must remain bound to run context and origin.

──────────────────────────────────────────────────────────
Conceptual Model
──────────────────────────────────────────────────────────

Node Types

- INTEL
- SIG-41
- SIG-40
- EVID

Relationships

INTEL → derived_from → SIG-41  
SIG-41 → derived_from → SIG-40  
SIG-40 → derived_from → EVID  

Relationships are:

- directional
- explicit
- non-inferential

──────────────────────────────────────────────────────────
System Boundary
──────────────────────────────────────────────────────────

ENL operates:

- above 41.x
- below user interaction (Lens)

ENL interacts with:

- 40.x (read-only)
- 41.x (read-only)
- INTEL layer (read-only)

ENL outputs:

- navigable structure
- traversal responses

──────────────────────────────────────────────────────────
Relationship to Lens
──────────────────────────────────────────────────────────

ENL → provides navigation  
Lens → renders navigation  

ENL is invisible  
Lens is visible  

──────────────────────────────────────────────────────────
Governance Rules
──────────────────────────────────────────────────────────

- ENL must not alter source artifacts
- ENL must not introduce inferred links
- ENL must not collapse layers
- ENL must fail if traceability is incomplete

Fail-closed principle applies

──────────────────────────────────────────────────────────
Expected Outcome
──────────────────────────────────────────────────────────

- ENL formally defined
- System boundaries locked
- Navigation principles unambiguous
- Ready for ENL-002 (schema)

──────────────────────────────────────────────────────────
Acceptance Criteria
──────────────────────────────────────────────────────────

- ENL definition complete and unambiguous
- No overlap with 40.x / 41.x responsibilities
- Navigation model deterministic
- Evidence-First doctrine enforced
- System boundaries clearly defined

──────────────────────────────────────────────────────────
Definition of Ready
──────────────────────────────────────────────────────────

- 40.x outputs validated
- 41.x outputs validated
- INTEL layer available
- Evidence artifacts accessible

──────────────────────────────────────────────────────────
Definition of Done
──────────────────────────────────────────────────────────

- ENL concept documented
- Navigation rules defined
- Governance constraints enforced
- Ready for schema implementation

──────────────────────────────────────────────────────────
Sign-off Criteria
──────────────────────────────────────────────────────────

- No ambiguity in ENL role
- No computation responsibilities assigned
- Full alignment with Evidence-First doctrine
- Traversal logic validated conceptually
