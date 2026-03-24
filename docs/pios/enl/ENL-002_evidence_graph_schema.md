ENL-002 — Evidence Graph Schema
────────────────────────────────────────────────────────────

Program
Krayu — Program Intelligence Discipline

Date
2026-03-21

Contract
ENL-002-CONTRACT-v1 · run_01_blueedge

────────────────────────────────────────────────────────────
Purpose
────────────────────────────────────────────────────────────

This document defines the ENL graph schema — the machine-readable
and human-readable specification governing how ENL nodes are
structured, related, and validated.

It is the schema implementation layer for ENL-001.

ENL-001 defines the principles.
ENL-002 defines the enforceable structure.

────────────────────────────────────────────────────────────
Position in Architecture
────────────────────────────────────────────────────────────

ENL-001 → concept and navigation principles
ENL-002 → schema, node types, transition rules, validation  ← THIS DOCUMENT
ENL-003+ → graph population, query binding, rendering hooks

────────────────────────────────────────────────────────────
Schema Artifacts
────────────────────────────────────────────────────────────

Two machine-readable schema files govern ENL graphs in v1:

  docs/pios/enl/schema/enl_node_schema_v1.json
    → Canonical field definitions for all ENL node types.
    → Required fields, types, constraints, status enum, layer mapping.

  docs/pios/enl/schema/enl_graph_rules_v1.json
    → Allowed and forbidden layer transitions.
    → Terminal node policy.
    → Empty derived_from policy.
    → Run-awareness constraints.
    → Fail conditions.

Both files carry schema_id, version, and contract_ref fields
that bind them to this contract (ENL-002-CONTRACT-v1).

────────────────────────────────────────────────────────────
Node Types
────────────────────────────────────────────────────────────

ENL v1 defines four canonical node types:

  INTEL   — narrative layer
            Highest abstraction. Intelligence output.
            Derived from one or more SIG-41 nodes.

  SIG-41  — semantic layer
            Interpreted signal. Bound to intelligence queries.
            Derived from one or more SIG-40 nodes.

  SIG-40  — computed layer
            Computed signal at evidence binding point.
            Derived from one or more EVID nodes.

  EVID    — raw evidence layer (terminal)
            Verifiable artifact. Structural telemetry or equivalent.
            derived_from must be an empty array.

No other node types are permitted in v1.

────────────────────────────────────────────────────────────
Required Fields
────────────────────────────────────────────────────────────

Every ENL node — regardless of type — must declare:

  node_id       string   Unique within the graph. Non-empty.
  node_type     enum     One of: INTEL, SIG-41, SIG-40, EVID
  run_id        string   Execution context identifier. Non-empty.
  title         string   Human-readable label. Non-empty.
  status        enum     One of: defined, active, validated, blocked, rejected
  derived_from  array    Upstream node_id references. Empty only for EVID.
  source_ref    string   Canonical source artifact pointer. Non-empty.
  created_at    string   ISO 8601 date or timestamp. Non-empty.

All fields are mandatory. No field may be null or absent.

Full field specifications are in:
  docs/pios/enl/schema/enl_node_schema_v1.json

────────────────────────────────────────────────────────────
Layer Transitions
────────────────────────────────────────────────────────────

Permitted transitions (via derived_from):

  INTEL   → SIG-41   ✓
  SIG-41  → SIG-40   ✓
  SIG-40  → EVID     ✓
  EVID    → (none)   ✓  terminal — derived_from must be []

Forbidden transitions (selected):

  INTEL  → SIG-40   ✗  cross-layer shortcut
  INTEL  → EVID     ✗  cross-layer shortcut
  SIG-41 → EVID     ✗  cross-layer shortcut
  INTEL  → INTEL    ✗  same-layer derivation
  SIG-41 → SIG-41   ✗  same-layer derivation
  SIG-40 → SIG-40   ✗  same-layer derivation
  EVID   → EVID     ✗  same-layer derivation
  SIG-41 → INTEL    ✗  reverse direction
  SIG-40 → SIG-41   ✗  reverse direction
  EVID   → SIG-40   ✗  reverse direction

Complete transition rules are in:
  docs/pios/enl/schema/enl_graph_rules_v1.json

────────────────────────────────────────────────────────────
Graph Constraints
────────────────────────────────────────────────────────────

Terminal node policy
  Every valid navigation path must terminate in an EVID node.
  A graph without at least one EVID node fails validation.
  Every non-EVID chain must be traversable to EVID without gaps.

Empty derived_from policy
  derived_from may be an empty array only for EVID nodes.
  Any non-EVID node with empty derived_from is invalid.

Run-awareness
  All nodes in a graph must carry a run_id.
  All nodes linked via derived_from must share the same run_id.
  Cross-run linking is not permitted in v1.

Duplicate node_id
  No two nodes in the same graph may share a node_id.

────────────────────────────────────────────────────────────
Validation
────────────────────────────────────────────────────────────

Two validation scripts enforce ENL-002:

  scripts/enl/validate_enl_schema.py
    → Validates presence and structure of schema JSON files.
    → Confirms required fields, enums, and constraints.
    → Confirms schema_id and contract_ref alignment.

  scripts/enl/validate_enl_example.py
    → Validates the minimal example graph against v1 rules.
    → Traverses derived_from chains, confirms EVID termination.
    → Confirms all 4-layer transitions.
    → Confirms run-awareness across all nodes.

Fail-closed: any validation failure produces a non-zero exit code.
Validators use Python 3.9+ standard library only.

────────────────────────────────────────────────────────────
Minimal Example
────────────────────────────────────────────────────────────

A minimal valid ENL graph covering the full 4-layer chain is defined in:

  docs/pios/enl/examples/ENL-002_minimal_graph_example.json

Human-readable explanation:

  docs/pios/enl/examples/ENL-002_minimal_graph_example.md

The example demonstrates:

  INTEL-GQ003-001  ← intelligence output for GQ-003
       ↓ derived_from
  SIG41-SIG003-001 ← semantic signal (SIG-003)
       ↓ derived_from
  SIG40-SIG003-001 ← computed signal at evidence binding
       ↓ derived_from
  EVID-ST007-001   ← structural telemetry artifact (terminal)

All four nodes share run_id = "run_01_blueedge".

────────────────────────────────────────────────────────────
v1 Scope Boundaries
────────────────────────────────────────────────────────────

NOT SUPPORTED in v1:

  - Cross-run derivation
  - Same-layer derivation
  - Partial or branching chains
  - Node types beyond INTEL, SIG-41, SIG-40, EVID
  - Computed or inferred relationships

These constraints may be relaxed in future schema versions
with explicit governance. v1 is intentionally minimal and strict.

────────────────────────────────────────────────────────────
Alignment with ENL-001
────────────────────────────────────────────────────────────

  ENL-001 Principle 1 (No Computation)
  → ENL-002 schema governs structure only. No computation, no transformation.

  ENL-001 Principle 2 (Deterministic Traversal)
  → derived_from arrays are explicit. No inference. Traversal is fully deterministic.

  ENL-001 Principle 3 (Evidence First Enforcement)
  → terminal_node_policy requires every chain to reach EVID.

  ENL-001 Principle 4 (Layer Integrity)
  → allowed_transitions enforces strict layer separation.

  ENL-001 Principle 5 (Progressive Concreteness)
  → forbidden_transitions blocks shortcuts and reverse direction.

  ENL-001 Principle 6 (Run Awareness)
  → run_awareness constraint requires matching run_id across all linked nodes.

────────────────────────────────────────────────────────────
Governance Rules
────────────────────────────────────────────────────────────

  - Schema files may not be modified without a new contract version.
  - Node types may not be extended without updating enl_node_schema_v1.json.
  - Transition rules may not be relaxed without updating enl_graph_rules_v1.json.
  - Validation scripts must remain aligned with schema file versions.
  - Schema version (1.0.0) is locked for the duration of ENL-002-CONTRACT-v1.

────────────────────────────────────────────────────────────
Acceptance Criteria
────────────────────────────────────────────────────────────

  ✓ All four node types defined with required fields
  ✓ All permitted and forbidden transitions declared
  ✓ Terminal node policy enforced
  ✓ Run-awareness constraint declared
  ✓ Machine-readable schema artifacts present and versioned
  ✓ Minimal example covers full 4-layer chain
  ✓ Validation scripts created and runnable
  ✓ All deliverables aligned with ENL-001 principles

────────────────────────────────────────────────────────────
Definition of Done
────────────────────────────────────────────────────────────

  - ENL-002 schema standard documented
  - Machine-readable schema artifacts created
  - Minimal example created and validated
  - Validation scripts created and runnable
  - All deliverables aligned with ENL-001
  - Stream ready for next execution stage

────────────────────────────────────────────────────────────
Sign-off Criteria
────────────────────────────────────────────────────────────

  - No ambiguity in node types or required fields
  - No ambiguity in permitted or forbidden transitions
  - Evidence-first termination enforced by schema and validator
  - validate_enl_example.py passes with no failures
  - validate_enl_schema.py passes with no failures
