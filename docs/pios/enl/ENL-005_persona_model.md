ENL-005 — Persona Configuration Model
────────────────────────────────────────────────────────────

Program
Krayu — Program Intelligence Discipline

Date
2026-03-21

Contract
ENL-005-CONTRACT-v1 · run_01_blueedge

────────────────────────────────────────────────────────────
Purpose
────────────────────────────────────────────────────────────

This document defines the persona configuration model — the
schema and semantics of the persona_config dict consumed by
the Lens Persona Projection Layer (ENL-005).

A persona configuration expresses display preferences for
a named consumer type (e.g. executive, program lead, engineer).
It does not alter ENL data. It does not alter traversal. It
does not alter graph composition.

────────────────────────────────────────────────────────────
Persona Configuration Fields
────────────────────────────────────────────────────────────

┌─────────────────────┬──────────┬──────────────────────────────────────────┐
│ Field               │ Required │ Type                                     │
├─────────────────────┼──────────┼──────────────────────────────────────────┤
│ persona_id          │ yes      │ non-empty string                         │
│ label_map           │ no       │ dict of node_type → display prefix       │
│ layer_emphasis      │ no       │ list of node_type strings                │
│ visibility_rules    │ no       │ dict of node_type → "collapsed"|"visible"│
│ confidence_threshold│ no       │ float in [0.0, 1.0]                      │
│ node_confidence     │ no       │ dict of node_id → float in [0.0, 1.0]   │
└─────────────────────┴──────────┴──────────────────────────────────────────┘

────────────────────────────────────────────────────────────
Field Definitions
────────────────────────────────────────────────────────────

persona_id
──────────

  Type:     non-empty string
  Required: yes

  A unique identifier for this persona. Used in the persona
  block of projected views.

  Examples: "executive", "program-lead", "engineer"

  Does not affect ENL data. Does not affect traversal.

label_map
─────────

  Type:     dict of string → string
  Required: no

  Maps ENL node_type values to display prefix strings.
  When a node's type is present in label_map, the projected
  display label becomes:

    "<prefix>: <original node title>"

  When a node's type is absent from label_map, the display
  label equals the original node title unchanged.

  The original title field in the ENL node dict is never
  altered. Label mapping applies only to the display label
  in node_display.

  Valid keys: "INTEL", "SIG-41", "SIG-40", "EVID"
  Values:     any non-empty string

  Example:
    {
      "INTEL":  "Finding",
      "SIG-41": "Signal",
      "SIG-40": "Measurement",
      "EVID":   "Source"
    }

layer_emphasis
──────────────

  Type:     list of strings
  Required: no

  Lists the node_types that should be visually emphasised
  in the rendered view. Nodes whose type appears in this
  list receive highlight: true in node_display. All other
  nodes receive highlight: false.

  This is a display hint. It does not affect which nodes
  are returned, which nodes are navigable, or which nodes
  are in the ENL graph.

  Valid values: "INTEL", "SIG-41", "SIG-40", "EVID"

  Example:
    ["INTEL", "SIG-41"]

visibility_rules
────────────────

  Type:     dict of string → "collapsed" | "visible"
  Required: no

  Maps node_types to a default display state. A value of
  "collapsed" causes nodes of that type to receive
  visible: false in node_display. A value of "visible"
  (or absence from the dict) causes visible: true.

  visible: false is a rendering hint only. The node remains
  present in the chain or subgraph. Node count is unchanged.
  The node is still navigable.

  No other values are permitted. "invisible", "hidden",
  "removed", or any other string will cause a validation
  error.

  Example:
    {
      "SIG-40": "collapsed",
      "EVID":   "collapsed"
    }

confidence_threshold
────────────────────

  Type:     float in [0.0, 1.0]
  Required: no

  When set, nodes with a declared confidence score (from
  node_confidence) below this threshold receive
  confidence_flag: "low" in node_display.

  Nodes above the threshold receive confidence_flag: "normal".

  Nodes with no declared confidence score always receive
  confidence_flag: "normal", regardless of threshold.
  The projection layer never assumes low confidence.

  confidence_flag: "low" is a display tag. The node is not
  removed. Its status field in the ENL node dict is not
  altered.

  If confidence_threshold is absent from persona_config,
  all nodes receive confidence_flag: "normal".

  Example: 0.7

node_confidence
───────────────

  Type:     dict of node_id → float in [0.0, 1.0]
  Required: no

  Provides confidence scores for specific nodes by node_id.
  Used in conjunction with confidence_threshold to compute
  confidence_flag values.

  Scores are expressed as floats from 0.0 (no confidence)
  to 1.0 (full confidence).

  This field is the only permitted mechanism for introducing
  confidence signal into the persona layer in v1. The
  projection engine does not derive confidence from ENL
  node fields, source artifacts, or traversal outcomes.

  node_confidence scores are display metadata. They do not
  alter the ENL node's status, source_ref, or any other field.

  Example:
    {
      "SIG41-SIG003-001": 0.6,
      "INTEL-GQ003-001":  0.95
    }

────────────────────────────────────────────────────────────
Persona Configuration Invariants
────────────────────────────────────────────────────────────

  1. persona_config does not alter ENL data.
     No field in persona_config causes any modification to
     ENL node dicts, the graph structure, or traversal paths.

  2. persona_config does not filter graph composition.
     visibility_rules and confidence_threshold affect display
     flags only. Nodes are never removed from views on account
     of persona settings.

  3. persona_config does not introduce navigation shortcuts.
     layer_emphasis affects visual weight. It does not create
     new traversal paths or bypass layer constraints.

  4. persona_config is Lens-layer only.
     Persona configuration must not be persisted to ENL graph
     files, schema files, or any ENL artifact. A persona is a
     rendering instruction, not a graph mutation.

  5. Invalid persona_config raises LensPersonaError before
     any projection is applied. No partial projection occurs.

────────────────────────────────────────────────────────────
Reference Persona Examples
────────────────────────────────────────────────────────────

EXECUTIVE PERSONA
─────────────────

  {
    "persona_id": "executive",
    "label_map": {
      "INTEL":  "Finding",
      "SIG-41": "Signal",
      "SIG-40": "Measurement",
      "EVID":   "Source"
    },
    "layer_emphasis":    ["INTEL"],
    "visibility_rules":  {
      "SIG-40": "collapsed",
      "EVID":   "collapsed"
    },
    "confidence_threshold": 0.7
  }

  Effect: INTEL nodes are highlighted and labelled as
  "Finding: <title>". SIG-40 and EVID nodes are collapsed
  by default but remain navigable. Nodes below 70% confidence
  (if scored) are flagged.

ENGINEER PERSONA
────────────────

  {
    "persona_id": "engineer",
    "layer_emphasis":   ["SIG-40", "EVID"],
    "visibility_rules": {
      "INTEL": "visible",
      "SIG-41": "visible",
      "SIG-40": "visible",
      "EVID":   "visible"
    }
  }

  Effect: SIG-40 and EVID layers are highlighted. All layers
  are visible by default. No label mapping or confidence
  threshold applied.

MINIMAL PERSONA
───────────────

  {
    "persona_id": "default"
  }

  Effect: no label mapping, no emphasis, all nodes visible,
  all confidence flags "normal". persona block is added to
  the view; node_display is generated with default values.

────────────────────────────────────────────────────────────
Implementation Reference
────────────────────────────────────────────────────────────

  scripts/pios/enl/lens_persona_v1.py
    → _validate_persona_config — validates all fields
    → _project_node_display     — applies config to a single node
    → _build_node_display       — applies config to all nodes in a view

  docs/pios/enl/ENL-002A_lens_integration_boundary.md
    → Section F — Persona Layer (ENL-002A compliance basis)
