# AO-011 Visual State Deltas

**Purpose:** Prove Answer Objects can steer cognition inside LENS, not merely generate explanations.
**Object:** AO-011 Divergence Pair
**Instance:** Platform Infrastructure and Data (structural) vs Fleet Core Operations (operational)
**Method:** Before/after for each persona. What dims, what highlights, what moves.

---

## 1. BOARDROOM

### Before AO-011

TopologyGraph renders with pressure-based emphasis:
- Pressure zone anchor (Platform Infrastructure and Data) at full opacity
- Non-pressure domains at 0.4 opacity
- Consequence themes shown as severity cards (CRITICAL, HIGH)
- Domain narratives show "WHERE IT MANIFESTS"
- No divergence signal — structural center and execution center not distinguished

The board sees: "Platform Infrastructure and Data is under pressure." One center. One story.

### After AO-011

**What highlights:**
- TWO domains at full opacity: Platform Infrastructure and Data + Fleet Core Operations
- Platform Infrastructure and Data: `_emphasisRole: 'structural-center'` — blue/structural color accent
- Fleet Core Operations: `_emphasisRole: 'execution-center'` — amber/operational color accent
- A visible connector or contrast marker between the two — the divergence IS the finding

**What dims:**
- All other domains drop from 0.4 to 0.18 opacity
- Consequence theme cards that don't reference either center domain fade
- Domain narratives narrow to only the two center domains

**What becomes primary:**
- The CONTRAST between the two domains is the primary visual element
- Not a card. Not a chart. The topology itself shows two highlighted nodes that should be one but aren't

**What becomes secondary:**
- Severity cards still visible but subordinate to the divergence visual
- Grounding coverage ring remains but is no longer the primary read

**What moves into Guide:**
- "Where you invest and where risk lives are different places"
- Proof status: structural center confirmed / execution center confirmed
- Resolution controls

**Visual lever:** `cognitionOverlay.emphasis_domains = ['Platform Infrastructure and Data', 'Fleet Core Operations']`, `cognitionOverlay.dim_domains = [all others]`, plus `_emphasisRole` distinction on the two nodes.

---

## 2. BALANCED

### Before AO-011

Briefing corridor renders narrative interpretations:
- Runtime divergence split visual (ARCHITECTURE CENTER ≠ OPERATIONS CENTER) shows when the intent is `interpret_runtime_divergence`
- But this is one narrative among several. Default view shows posture interpretation or consequence themes
- Domain mentions scattered across narrative text
- No visual topology — BALANCED is narrative-first

### After AO-011

**What highlights:**
- `activeIntent` locks to `interpret_runtime_divergence` — the divergence narrative becomes the primary briefing
- The split visual (structCenter vs execCenter) renders with full detail: domain names, condition counts, risk labels
- Micro-flow diagram shows the two centers and what flows between them

**What dims:**
- Other narrative intents (operational posture, dependency amplification, propagation dynamics) collapse to single-line summaries
- They're still accessible but no longer compete for attention

**What becomes primary:**
- The split visual: "ARCHITECTURE CENTER: Platform Infrastructure and Data" vs "OPERATIONS CENTER: Fleet Core Operations"
- The mechanism sentence: why they differ and what it means for delivery coordination
- Reinforcement relationship: structural gravity → investment targeting; operational gravity → incident exposure

**What becomes secondary:**
- Consequence themes shown as supporting evidence, not primary narrative
- Visual spec zone (if available) subordinate to the divergence briefing

**What moves into Guide:**
- "Which coordination assumptions are wrong?"
- Proof steps: confirm structural center, confirm execution center, test compounding
- BALANCED-specific next action: "Which investment decisions target the wrong region?"

**Visual lever:** `pendingBalancedIntent = 'interpret_runtime_divergence'` locks the corridor. Other intents remain in the intent selector but dimmed.

---

## 3. DENSE

### Before AO-011

Full topology surface with all zones expanded:
- Semantic Topology (ST): origin/passthrough/receiver matrix — all domains at equal visual weight
- Cluster Concentration (CC): cluster count, grounding bar
- Absorption Load (AL): passthrough domain conducting %
- Propagation Flow (PF): origin → passthrough → receiver chain
- Topology Surface (TS): full SVG with all domains at normal opacity
- Pressure Zone Focus: compound pressure zone narrative
- Visual Architecture zone
- Navigation chips at bottom

All zones compete equally for attention. The architect sees everything.

### After AO-011

**What highlights:**
- TopologyGraph: `highlightSet` contains Platform Infrastructure and Data + Fleet Core Operations + their connected nodes
- Platform Infrastructure and Data: stroke width 2.2, structural color (#4a9eff), full opacity
- Fleet Core Operations: stroke width 2.2, operational color (#ff9e4a), full opacity
- Connected edges between them emphasized (if they exist) or absence of connection emphasized (the divergence)

**What dims:**
- TopologyGraph: all non-connected domains at 0.18 opacity
- Zones that don't reference either center domain:
  - CC (Cluster Concentration): collapses to header line if neither center is the cluster focus
  - AL (Absorption Load): remains if passthrough domain is one of the centers
  - Zones collapse via `data-investigation-collapsed="true"` — single-line header, clickable to re-expand

**What stays expanded:**
- ST (Semantic Topology): ALWAYS — the substrate never collapses. But cells for the two center domains get emphasis borders
- TS (Topology Surface): ALWAYS — the graph IS the divergence visual
- PF (Propagation Flow): stays if propagation origin is one of the centers (it is — Platform Infrastructure and Data is the origin)

**What becomes primary:**
- The topology graph with two highlighted nodes and everything else faded
- The Semantic Topology matrix with two domains emphasized in the grid
- Side-by-side evidence: structural center gravity profile (conditions, mass) vs execution center gravity profile (RSIG signals, runtime load)

**What becomes secondary:**
- Pressure zone focus narrative (still relevant but subordinate)
- Visual architecture zone (collapsed unless it renders divergence-relevant visual spec)
- Navigation chips update: "Explain" is no longer offered (you're already explaining). Remaining chips: "Show evidence" → OPERATOR, "What compounds" → adjacent

**What moves into Guide:**
- Full divergence profile (condition counts, RSIG counts, narratives for both domains)
- Proof status
- "Does this compound with Execution Blindness?" as next step

**Visual levers:**
- `cognitionOverlay = { emphasis_domains: [structCenter, execCenter], dim_domains: [...others], mode: 'DIVERGENCE_PAIR' }`
- `highlightSet = new Set([structCenterId, execCenterId, ...connectedIds])`
- Zone collapse: `data-investigation-collapsed` attribute on actor blocks not matching center domains

---

## 4. OPERATOR

### Before AO-011

Evidence inspection surface with all zones expanded:
- Evidence Summary Chain: signals → conditions → elevated → critical (aggregate counts)
- Forensic Narrative: domain chain analysis prose
- Topology Compact: small graph with click-to-expand
- Runtime Connectivity (RC): all RSIG signals listed by severity group
- Signal Intelligence (SI): all signals by family (ISIG, DPSIG, PSIG, RSIG)
- Evidence Trace: lineage hash, derivation chain
- Propagation Flow: domain evidence blocks

All evidence presented equally. The investigator sees every signal, every condition.

### After AO-011

**What highlights:**
- Evidence Summary Chain: the chain nodes for the TWO domains light up differently
  - Platform Infrastructure and Data chain: structural evidence highlighted (conditions: 5, peak: CRITICAL)
  - Fleet Core Operations chain: runtime evidence highlighted (RSIG: 2, peak: HIGH)
  - The visual: two parallel evidence chains, not one aggregate

- Runtime Connectivity (RC): RSIG signals filtered to only those touching Fleet Core Operations
  - RSIG-001 (ELEVATED): Fleet Core Operations, Telemetry Transport
  - RSIG-002 (HIGH): Fleet Core Operations, Telemetry Transport
  - Other RSIGs dimmed (still visible at 0.45 opacity, not hidden)

- Signal Intelligence (SI): signals grouped by which center they belong to
  - Structural signals (ISIG, DPSIG, PSIG) tagged with "→ STRUCTURAL CENTER"
  - Runtime signals (RSIG) tagged with "→ EXECUTION CENTER"
  - The partition IS the verification

**What dims:**
- Signals that touch neither center domain: 0.45 opacity
- Evidence Trace zone: collapses (lineage is not divergence-relevant)
- Governance audit zone: collapses (governance is not the question)

**What stays expanded:**
- Runtime Connectivity: always (RC carries the execution center proof)
- Signal Intelligence: always (carries the evidence family partition)
- Topology Compact: always (shows the two nodes)

**What becomes primary:**
- The evidence family partition: structural signals on one side, runtime signals on the other
- The confidence assessment: "Structural center: HIGH confidence (5 conditions from structural enrichment). Execution center: ELEVATED confidence (2 RSIG from runtime derivation)."
- The divergence verification: structural_center ≠ execution_center: CONFIRMED

**What becomes secondary:**
- Propagation flow (relevant but subordinate to divergence verification)
- Forensic narrative (replaced by structured verification in Guide)

**What moves into Guide:**
- Verification checklist:
  - ☑ Structural center: Platform Infrastructure and Data (5 conditions, CRITICAL)
  - ☑ Execution center: Fleet Core Operations (2 RSIG, HIGH)
  - ☐ Evidence families agree? (structural says one domain, runtime says another → CONFIRMS DIVERGENCE)
  - ☐ Falsification: any evidence of convergence?

**Visual levers:**
- RC zone: `data-investigation-filter="Fleet Core Operations"` — primary filter on RSIG display
- SI zone: `data-investigation-partition="EVIDENCE_FAMILY"` — group signals by evidence family, tag with center role
- Evidence chain: parallel rendering via `data-investigation-mode="divergence-pair"` — two chains side by side

---

## 5. Delta Summary Table

| Persona | Primary becomes | Secondary becomes | Dims to | Guide receives |
|---------|----------------|-------------------|---------|----------------|
| BOARDROOM | Two highlighted nodes with divergence contrast | Severity cards (unchanged) | Other domains (0.18) | Investment-risk statement + proof |
| BALANCED | Divergence split visual locked as primary corridor | Other narratives collapse to one-line | Intent selector dimmed | Coordination question + next steps |
| DENSE | Topology with two emphasized nodes + evidence profiles | Irrelevant zones collapse to headers | Non-center domains (0.18), unrelated zones | Full divergence profile + proof |
| OPERATOR | Evidence family partition (structural vs runtime chains) | Propagation flow, governance zones | Non-center signals (0.45), lineage/governance collapse | Verification checklist |

---

## 6. Control Surface Required

AO-011 activation requires these state changes:

```javascript
// When AO-011 investigation is active:
{
  cognitionOverlay: {
    mode: 'DIVERGENCE_PAIR',
    emphasis_domains: [investigation.domain_a.domain, investigation.domain_b.domain],
    dim_domains: [...allOtherDomains],
    structural_center: investigation.domain_a.domain,
    execution_center: investigation.domain_b.domain,
  },
  
  // BALANCED
  pendingBalancedIntent: 'interpret_runtime_divergence',
  
  // Zone collapse (DENSE + OPERATOR)
  investigationCollapse: {
    expanded: ['semanticTopology', 'topologySurface', 'propagationFlow', 'runtimeConnectivity', 'signalAssessment'],
    collapsed: ['clusterConcentration', 'absorptionLoad', 'evidenceTrace', 'governanceLifecycle'],
  },
  
  // OPERATOR evidence filter
  investigationFilter: {
    rsig_focus_domain: investigation.domain_b.domain,
    evidence_partition: 'EVIDENCE_FAMILY',
  },
}
```

These are not new rendering systems. They're state values consumed by existing components through existing visual levers (cognitionOverlay, pendingBalancedIntent, data attributes, opacity scaling).

---

## 7. Verdict

AO-011 can steer every persona without new components. The visual levers already exist:
- `cognitionOverlay` for topology emphasis/dimming
- `highlightSet` for node selection
- `pendingBalancedIntent` for corridor locking
- `data-severity` / opacity scaling for zone dimming
- Zone collapse via data attributes

What doesn't exist yet:
- `investigationCollapse` state (zone-level collapse from investigation)
- `investigationFilter` state (evidence filtering per investigation)
- `_emphasisRole` distinction between structural-center and execution-center nodes
- Parallel evidence chain rendering in OPERATOR

These are state wiring additions, not new systems. The rendering infrastructure handles them. The Answer Object provides the values. The gap is: connecting AO-011's schema fields to the existing visual lever inputs.
