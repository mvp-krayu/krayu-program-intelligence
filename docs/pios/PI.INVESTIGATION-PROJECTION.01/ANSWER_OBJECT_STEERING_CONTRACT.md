# Answer Object Steering Contract

**Purpose:** Generic contract that LENS consumes for any Answer Object. LENS never knows which AO is active. It reads the contract.
**Date:** 2026-06-10
**Derived from:** AO-011 visual state deltas, abstracted to AO-agnostic interface.

---

## 1. The Contract

Every Answer Object, when active in an investigation, produces a steering contract. LENS consumes the contract. LENS does not consume the Answer Object.

```javascript
{
  // 1. TOPOLOGY EMPHASIS
  topology: {
    primary_nodes: [],     // domains at full opacity, emphasized stroke
    primary_roles: {},     // domain → role label (e.g., 'structural-center', 'execution-center', 'spof', 'origin')
    primary_color_key: {}, // domain → color intent ('structural', 'operational', 'critical', 'warning')
    secondary_nodes: [],   // domains at normal opacity (connected, relevant but not primary)
    dim_all_others: true,  // everything not in primary or secondary → 0.18 opacity
  },

  // 2. DOMAIN DIMMING
  dimming: {
    strategy: 'CONTRAST' | 'FOCUS' | 'CHAIN' | 'NONE',
    // CONTRAST: two+ primary nodes, everything else dims — the relationship is the finding
    // FOCUS: one primary node, everything else dims — the node is the finding
    // CHAIN: primary nodes form a path, chain is highlighted, rest dims
    // NONE: no dimming (e.g., temporal unavailability — nothing to emphasize)
  },

  // 3. ZONE COLLAPSE
  zones: {
    always_expanded: [],   // zone keys that stay open regardless (e.g., topology surface)
    investigation_relevant: [], // zone keys relevant to this AO — expanded
    collapse_others: true, // zones not in always_expanded or relevant → single-line header
  },

  // 4. EVIDENCE FILTERING
  evidence: {
    signal_filter: null,         // signal_family to foreground (e.g., 'RSIG') or null for all
    signal_focus_domain: null,   // domain to filter signals by, or null for all
    condition_filter: null,      // condition_type to foreground, or null for all
    partition_mode: null,        // 'EVIDENCE_FAMILY' | 'SEVERITY' | 'DOMAIN' | null
    // EVIDENCE_FAMILY: split structural vs runtime conditions
    // SEVERITY: group by severity tier
    // DOMAIN: group by affected domain
  },

  // 5. GUIDE FOCUS
  guide: {
    headline: '',          // investigation question — what we're resolving
    proof_steps: [],       // from InvestigationRuntime — what's proven, what remains
    inline_content: null,  // for judgment steps: text to render in Guide (e.g., falsification statement)
    primary_metric: null,  // the one number/fact that summarizes the finding (e.g., "2 centers, 0 overlap")
  },

  // 6. CONTINUATION GENERATION
  continuations: {
    next_ao_types: [],     // which AO types naturally follow (e.g., ['COMPOUNDING_VERDICT', 'FALSIFICATION_STATEMENT'])
    next_questions: [],    // concrete next questions derived from this AO's output
    persona_hints: {},     // question → suggested persona for answering it
  },
}
```

---

## 2. How LENS Consumes the Contract

```
Investigation active
    ↓
Answer Object resolved (from AnswerObjectRuntime)
    ↓
Steering Contract produced (from AO schema → contract mapper)
    ↓
LENS reads contract fields:
    topology   → cognitionOverlay, highlightSet
    dimming    → opacity scaling strategy
    zones      → investigationCollapse state
    evidence   → investigationFilter state
    guide      → Guide Runtime panel content
    continuations → NavigationChips update
```

LENS never imports AO-011. LENS never checks `if (ao.type === 'DIVERGENCE_PAIR')`. LENS reads `topology.primary_nodes` and highlights them. The Answer Object determines WHAT goes into the contract. LENS determines HOW to render it.

---

## 3. AO-011 Divergence Pair → Steering Contract

```javascript
{
  topology: {
    primary_nodes: ['Platform Infrastructure and Data', 'Fleet Core Operations'],
    primary_roles: {
      'Platform Infrastructure and Data': 'structural-center',
      'Fleet Core Operations': 'execution-center',
    },
    primary_color_key: {
      'Platform Infrastructure and Data': 'structural',
      'Fleet Core Operations': 'operational',
    },
    secondary_nodes: [],
    dim_all_others: true,
  },

  dimming: {
    strategy: 'CONTRAST',
  },

  zones: {
    always_expanded: ['semanticTopology', 'topologySurface'],
    investigation_relevant: ['propagationFlow', 'runtimeConnectivity', 'signalAssessment'],
    collapse_others: true,
  },

  evidence: {
    signal_filter: 'RSIG',
    signal_focus_domain: 'Fleet Core Operations',
    condition_filter: null,
    partition_mode: 'EVIDENCE_FAMILY',
  },

  guide: {
    headline: 'Why is Fleet Core Operations the execution center rather than Platform Infrastructure and Data?',
    proof_steps: [/* from InvestigationRuntime */],
    inline_content: null,
    primary_metric: '2 gravity centers, 0 overlap',
  },

  continuations: {
    next_ao_types: ['COMPOUNDING_VERDICT', 'FALSIFICATION_STATEMENT'],
    next_questions: [
      'Does this compound with Execution Blindness?',
      'What evidence would show convergence?',
      'Which investment decisions target the wrong region?',
    ],
    persona_hints: {
      'Does this compound with Execution Blindness?': 'DENSE',
      'What evidence would show convergence?': 'OPERATOR',
      'Which investment decisions target the wrong region?': 'BALANCED',
    },
  },
}
```

**Why CONTRAST:** Two primary nodes. The relationship between them is the finding. Not one node — the gap between them.

**Why EVIDENCE_FAMILY partition:** The divergence is PROVEN by the partition. Structural evidence points at one domain. Runtime evidence points at another. The partition IS the proof.

---

## 4. AO-015 Transformation Constraint → Steering Contract

AO-015 is not yet in the ontology. This projection proves the contract works for an unpromoted object.

**Schema (proposed):**
```json
{
  "ao_type": "TRANSFORMATION_CONSTRAINT",
  "constraint": "Modernization of Platform Infrastructure requires addressing Fleet Core Operations first — operational gravity creates sequencing dependency invisible to structural analysis",
  "blocking_dependencies": ["Fleet Core Operations runtime load", "Event handler concentration"],
  "required_preconditions": ["Runtime pressure reduction in Fleet Core Operations", "Handler distribution"],
  "violated_assumption": "Investment sequencing based on structural gravity (Platform Infrastructure first) misses operational dependency",
  "program_risk": "HIGH — sequencing error leads to investment in structurally heavy region while operationally critical region degrades"
}
```

**Steering Contract:**
```javascript
{
  topology: {
    primary_nodes: ['Platform Infrastructure and Data', 'Fleet Core Operations'],
    primary_roles: {
      'Platform Infrastructure and Data': 'blocked-target',
      'Fleet Core Operations': 'blocking-dependency',
    },
    primary_color_key: {
      'Platform Infrastructure and Data': 'warning',
      'Fleet Core Operations': 'critical',
    },
    secondary_nodes: ['Telemetry Transport and Messaging'],
    dim_all_others: true,
  },

  dimming: {
    strategy: 'CHAIN',
  },

  zones: {
    always_expanded: ['semanticTopology', 'topologySurface'],
    investigation_relevant: ['propagationFlow', 'absorptionLoad'],
    collapse_others: true,
  },

  evidence: {
    signal_filter: null,
    signal_focus_domain: 'Fleet Core Operations',
    condition_filter: null,
    partition_mode: 'DOMAIN',
  },

  guide: {
    headline: 'Which transformation sequencing assumptions are invalidated?',
    proof_steps: [/* from InvestigationRuntime */],
    inline_content: null,
    primary_metric: '1 blocking dependency, 2 preconditions unmet',
  },

  continuations: {
    next_ao_types: ['BLAST_RADIUS', 'LOAD_BEARING_CONDITION'],
    next_questions: [
      'What is the blast radius if Fleet Core Operations degrades during transformation?',
      'Which single precondition unblocks the most?',
      'Does the board understand the sequencing risk?',
    ],
    persona_hints: {
      'What is the blast radius if Fleet Core Operations degrades during transformation?': 'OPERATOR',
      'Which single precondition unblocks the most?': 'DENSE',
      'Does the board understand the sequencing risk?': 'BOARDROOM',
    },
  },
}
```

**Why CHAIN:** The constraint is a sequencing dependency — A blocks B. The primary nodes form a directed path, not a symmetric contrast. The visual shows: you can't get to Platform Infrastructure without going through Fleet Core Operations first.

**Why DOMAIN partition:** The constraint is about two domains' relationship, not about evidence families. Group conditions by which domain they affect to show the blocking load.

**Same contract, different values.** LENS renders the same way: read primary_nodes → highlight, read dimming.strategy → apply CHAIN instead of CONTRAST, read zones → collapse/expand. No AO-015-specific code.

---

## 5. AO-016 Governance Exposure Surface → Steering Contract

**Schema (proposed):**
```json
{
  "ao_type": "GOVERNANCE_EXPOSURE_SURFACE",
  "decision": "Platform modernization investment allocation",
  "hidden_assumption": "Code gravity accurately predicts operational risk distribution",
  "evidence_gap": "Runtime evidence reveals operational gravity in a different region than structural investment targets",
  "organizational_consequence": "Budget commitments based on structural analysis may allocate to the wrong region",
  "confidence": "HIGH — divergence confirmed by independent evidence families"
}
```

**Steering Contract:**
```javascript
{
  topology: {
    primary_nodes: ['Platform Infrastructure and Data'],
    primary_roles: {
      'Platform Infrastructure and Data': 'exposed-decision-target',
    },
    primary_color_key: {
      'Platform Infrastructure and Data': 'warning',
    },
    secondary_nodes: ['Fleet Core Operations'],
    dim_all_others: true,
  },

  dimming: {
    strategy: 'FOCUS',
  },

  zones: {
    always_expanded: ['topologySurface'],
    investigation_relevant: ['governanceLifecycle'],
    collapse_others: true,
  },

  evidence: {
    signal_filter: null,
    signal_focus_domain: null,
    condition_filter: null,
    partition_mode: null,
  },

  guide: {
    headline: 'Which governance decision is exposed by this finding?',
    proof_steps: [/* from InvestigationRuntime */],
    inline_content: 'Hidden assumption: code gravity accurately predicts operational risk distribution. This assumption is contradicted by AO-011 divergence evidence.',
    primary_metric: '1 decision exposed, 1 hidden assumption',
  },

  continuations: {
    next_ao_types: ['FALSIFICATION_STATEMENT', 'DIVERGENCE_PAIR'],
    next_questions: [
      'What evidence supports the hidden assumption?',
      'What is the investment exposure if the assumption is wrong?',
      'Does the divergence evidence invalidate this decision?',
    ],
    persona_hints: {
      'What evidence supports the hidden assumption?': 'OPERATOR',
      'What is the investment exposure if the assumption is wrong?': 'BALANCED',
      'Does the divergence evidence invalidate this decision?': 'BOARDROOM',
    },
  },
}
```

**Why FOCUS:** One primary node — the domain that the governance decision targets. The secondary node (Fleet Core Operations) is the evidence that the decision is exposed, but the FOCUS is on where the decision LANDS. Not a contrast. Not a chain. A spotlight on the decision target.

**Why inline_content in Guide:** The hidden assumption is a judgment object — text the operator reads and evaluates, not evidence to navigate to. Same pattern as AO-001 Falsification Statement. The Guide renders it inline.

**Why governanceLifecycle zone relevant:** The governance zone shows qualification state, replay status, confidence. For a governance exposure question, this zone carries the authority assessment — "is this finding governed or advisory?"

---

## 6. Contract Stability Proof

Three Answer Objects. Three different dimming strategies. Three different zone sets. Three different evidence configurations. All expressed through the same 6-field contract.

| Field | AO-011 | AO-015 | AO-016 |
|-------|--------|--------|--------|
| primary_nodes | 2 (contrast) | 2 (chain) | 1 (focus) |
| dimming.strategy | CONTRAST | CHAIN | FOCUS |
| zones.relevant | propagation, runtime, signals | propagation, absorption | governance |
| evidence.partition_mode | EVIDENCE_FAMILY | DOMAIN | null |
| guide.inline_content | null | null | hidden assumption text |
| continuations.next_ao | COMPOUNDING, FALSIFICATION | BLAST_RADIUS, LOAD_BEARING | FALSIFICATION, DIVERGENCE |

The contract absorbs the variation. LENS reads the same fields. The Answer Object fills them differently.

No `if (ao.type === 'DIVERGENCE_PAIR')` anywhere in LENS.
No `if (ao.type === 'TRANSFORMATION_CONSTRAINT')` anywhere in LENS.

One contract. Every Answer Object maps into it. LENS consumes the contract.

---

## 7. Dimming Strategy Semantics

The four strategies cover all discovered patterns:

| Strategy | When | Visual | Cognitive intent |
|----------|------|--------|-----------------|
| CONTRAST | 2+ primary nodes, relationship is the finding | Both highlighted, everything else fades | "See the gap between these" |
| FOCUS | 1 primary node, the node is the finding | One spotlight, everything else fades | "This is the thing" |
| CHAIN | Primary nodes form a directed path | Path highlighted, everything else fades | "This flows through these" |
| NONE | No topology emphasis needed (judgment, temporal) | No dimming, Guide carries the content | "Read this, don't look at the graph" |

If a future AO needs a fifth strategy, that's a signal the contract needs extension — not that the AO needs special handling.
