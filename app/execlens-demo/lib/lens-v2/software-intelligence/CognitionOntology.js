'use strict'

// ─── Cognition Ontology ──────────────────────────────
//
// Two-layer cognition node model:
//   ONTOLOGY — static, authored, constitutional
//   RUNTIME  — computed per-run, optional
//
// Graph connections use addressable cognition references:
//   { ref: 'NODE_ID', role: 'defining' | 'conditional' | 'contributor' | 'escalation' | 'governance' }

// ─── Condition Nodes (7) ─────────────────────────────

const CONDITION_NODES = {
  DELIVERY_PRESSURE_CONCENTRATION: {
    id: 'DELIVERY_PRESSURE_CONCENTRATION',
    type: 'condition',

    human_name: 'Delivery pressure bottleneck',
    what_it_means: 'Multiple active delivery streams — pull requests, feature work, bug fixes — are converging on the same part of the codebase. This region is absorbing more concurrent change than its structure can naturally handle.',
    why_it_matters: 'When delivery pressure concentrates, teams working on different features collide in the same files. Merge conflicts increase, reviews slow down, and seemingly independent work streams start blocking each other.',
    operational_implication: 'Delivery speed in this area is constrained by how many teams can coordinate changes through the same narrow structural path.',
    how_detected: 'The system found that multiple delivery signals (PRs, commits, active tasks) converge on a single structural region with higher density than surrounding areas.',
    what_to_look_for: 'Check whether teams are experiencing merge conflicts, blocked PRs, or review bottlenecks in this area.',

    upstream: [],
    downstream: [
      { ref: 'COORD_FRAG', role: 'defining' },
      { ref: 'DEL_EXP', role: 'defining' },
      { ref: 'OP_BOTTLENECK', role: 'conditional' },
    ],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_2'],
    related_rules: ['§4'],
    runtime: null,
  },

  DEPENDENCY_CHOKE_POINT: {
    id: 'DEPENDENCY_CHOKE_POINT',
    type: 'condition',

    human_name: 'Dependency choke point',
    what_it_means: 'Many parts of the system depend on a single component or module. This creates a hub where changes have outsized downstream impact — touching this one area can ripple across many others.',
    why_it_matters: 'A dependency hub means that even small changes here require careful assessment of blast radius. A bug or regression in this area has disproportionate system-wide impact.',
    operational_implication: 'Change velocity through this component is slower than its apparent complexity suggests, because downstream impact assessment is required for every modification.',
    how_detected: 'Structural analysis identified a component with significantly more inbound dependencies than its peers — a hub in the dependency graph.',
    what_to_look_for: 'Look for components that require unusually broad test coverage, or where small changes trigger unexpected failures elsewhere.',

    upstream: [],
    downstream: [
      { ref: 'DEP_AMP', role: 'defining' },
      { ref: 'COORD_FRAG', role: 'conditional' },
      { ref: 'OP_BOTTLENECK', role: 'conditional' },
    ],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_2'],
    related_rules: ['§4'],
    runtime: null,
  },

  PROPAGATION_ASYMMETRY: {
    id: 'PROPAGATION_ASYMMETRY',
    type: 'condition',

    human_name: 'Asymmetric change propagation',
    what_it_means: 'Changes originating in one part of the system propagate unevenly — their impact reaches further or in different directions than the structure would suggest. The blast radius of changes here is larger than it appears.',
    why_it_matters: 'When propagation is asymmetric, standard impact assessment underestimates the real scope of changes. What looks like a local fix can have distant effects that are hard to predict from the code alone.',
    operational_implication: 'Routine changes in this area may require broader review and testing than their apparent scope suggests.',
    how_detected: 'The system found that dependency and change-propagation paths from this region are asymmetric — downstream reach exceeds what the local structure would predict.',
    what_to_look_for: 'Watch for cases where changes in this area cause unexpected test failures or bugs in seemingly unrelated parts of the system.',

    upstream: [],
    downstream: [
      { ref: 'PROP_EXP', role: 'defining' },
      { ref: 'DEL_EXP', role: 'conditional' },
    ],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_2'],
    related_rules: ['§4'],
    runtime: null,
  },

  STRUCTURAL_MASS_CONCENTRATION: {
    id: 'STRUCTURAL_MASS_CONCENTRATION',
    type: 'condition',

    human_name: 'Structural mass concentration',
    what_it_means: 'One region of the codebase carries a disproportionate share of the system\'s structural weight — more logic, more complexity, more responsibility than other areas of comparable size.',
    why_it_matters: 'When structural mass concentrates, that region becomes both essential and fragile. It\'s hard to refactor, hard to test comprehensively, and a failure there has outsized impact because so much depends on it.',
    operational_implication: 'Operational resilience depends disproportionately on the stability of this one region.',
    how_detected: 'Structural metrics (file size, complexity, responsibility concentration) identified a region carrying significantly more weight than its peers.',
    what_to_look_for: 'Look for large, complex files that are difficult to modify safely and that appear in many dependency chains.',

    upstream: [],
    downstream: [
      { ref: 'RESIL_DEF', role: 'defining' },
      { ref: 'STAB_RISK', role: 'conditional' },
    ],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_2'],
    related_rules: ['§4'],
    runtime: null,
  },

  CROSS_DOMAIN_COUPLING_PRESSURE: {
    id: 'CROSS_DOMAIN_COUPLING_PRESSURE',
    type: 'condition',

    human_name: 'Cross-boundary coupling',
    what_it_means: 'Components that should operate independently are structurally coupled — they share dependencies, modify shared state, or have hidden coordination requirements that cross architectural boundaries.',
    why_it_matters: 'Cross-boundary coupling means that changes in one domain can unexpectedly affect another. Teams working in different domains lose their ability to operate independently, slowing parallel delivery.',
    operational_implication: 'Delivery across these domains requires coordination that the org chart may not account for.',
    how_detected: 'Structural analysis found coupling patterns (shared imports, cross-boundary references, mutual state dependencies) between regions that should be independently changeable.',
    what_to_look_for: 'Look for cases where a change in one domain requires coordinated changes in another, or where tests from one domain fail due to changes in another.',

    upstream: [],
    downstream: [
      { ref: 'COORD_FRAG', role: 'defining' },
      { ref: 'PROP_EXP', role: 'conditional' },
    ],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_2'],
    related_rules: ['§4'],
    runtime: null,
  },

  GOVERNANCE_COVERAGE_STATUS: {
    id: 'GOVERNANCE_COVERAGE_STATUS',
    type: 'condition',

    human_name: 'Governance coverage gap',
    what_it_means: 'The system\'s governance boundaries — code ownership, review policies, access controls — don\'t fully cover the structural surface. Some regions lack clear ownership or oversight.',
    why_it_matters: 'Ungoverned regions are where unreviewed changes accumulate. Without clear ownership, quality standards drift and technical debt concentrates in the gaps between teams.',
    operational_implication: 'Risk concentrates in areas where no one is explicitly accountable for quality and stability.',
    how_detected: 'The system compared governance boundaries (CODEOWNERS, review policies) against the actual structural surface and found regions without coverage.',
    what_to_look_for: 'Check for directories or modules that lack CODEOWNERS entries, or where PRs are routinely merged without domain-expert review.',

    upstream: [],
    downstream: [
      { ref: 'GOV_GAP', role: 'defining' },
    ],
    visible_in: ['DENSE', 'OPERATOR'],
    verification_scope: ['step_2'],
    related_rules: ['§4'],
    runtime: null,
  },

  EXECUTION_FRAGILITY: {
    id: 'EXECUTION_FRAGILITY',
    type: 'condition',

    human_name: 'Execution fragility',
    what_it_means: 'A region of the codebase has high external coupling combined with low internal cohesion. This makes it structurally fragile — changes arrive from many directions, but the region lacks the internal integrity to absorb them without disrupting its dependents.',
    why_it_matters: 'Fragile regions cause outsized damage not because they are large, but because they are structurally exposed. A small change in a fragile region can propagate disproportionate disruption because the region both receives many inbound change vectors and lacks the encapsulation to contain them.',
    operational_implication: 'Changes touching this region carry elevated risk of unexpected downstream impact. The region\'s apparent simplicity masks its structural exposure.',
    how_detected: 'Structural analysis of import edges identified files with disproportionately high coupling (fan-in + fan-out) combined with low cohesion (most edges cross module boundaries). This combination — not either metric alone — triggers the fragility classification.',
    what_to_look_for: 'Look for regions where small changes cause surprisingly broad test failures, or where incident post-mortems consistently trace back to the same apparently minor components.',

    upstream: [],
    downstream: [
      { ref: 'RESIL_DEF', role: 'defining' },
      { ref: 'COORD_FRAG', role: 'conditional' },
      { ref: 'DEP_AMP', role: 'conditional' },
    ],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_2'],
    related_rules: ['§4'],
    runtime: null,
  },

  EXECUTION_CONSTRICTION: {
    id: 'EXECUTION_CONSTRICTION',
    type: 'condition',

    human_name: 'Structural throughput bottleneck',
    what_it_means: 'Operational flow is forced through a narrow structural passage. This node sits on critical traversal paths between otherwise-independent regions, acting as a structural bridge that all traffic must cross.',
    why_it_matters: 'When a single structural node is the only path between regions, it becomes a throughput ceiling. Adding more capacity (more developers, more parallel work) does not help because the constriction is topological, not capacity-based.',
    operational_implication: 'Work in areas connected through this constriction point will queue and serialize regardless of team size. This is Brooks\'s Law expressed as topology.',
    how_detected: 'Graph traversal analysis identified nodes with high through-flow (both inbound and outbound edges) that also serve as articulation points — structural bridges whose removal would disconnect regions of the import graph.',
    what_to_look_for: 'Look for areas where parallelizing work does not increase throughput, or where changes in one region unexpectedly block work in a structurally distant region.',

    upstream: [],
    downstream: [
      { ref: 'OP_BOTTLENECK', role: 'defining' },
      { ref: 'COORD_FRAG', role: 'conditional' },
      { ref: 'DEP_AMP', role: 'conditional' },
    ],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_2'],
    related_rules: ['§4'],
    runtime: null,
  },

  COMPOUND_CONVERGENCE: {
    id: 'COMPOUND_CONVERGENCE',
    type: 'condition',

    human_name: 'Multiple risk convergence',
    what_it_means: 'Several independent structural risk factors are present in the same region. No single issue is necessarily severe, but their combination in one area creates a compounding effect.',
    why_it_matters: 'Individual risks can be managed. But when multiple risks stack up in the same region, they interact in ways that make the overall situation worse than the sum of parts.',
    operational_implication: 'This region requires heightened attention because multiple independent risk vectors are amplifying each other.',
    how_detected: 'The system found that 3 or more distinct structural conditions are active on the same region, each triggered by independent evidence.',
    what_to_look_for: 'Look for areas where multiple teams have flagged different concerns — if the concerns are about the same region, they may be interacting.',

    upstream: [],
    downstream: [
      { ref: 'STAB_RISK', role: 'defining' },
    ],
    visible_in: ['DENSE', 'OPERATOR'],
    verification_scope: ['step_2'],
    related_rules: ['§4'],
    runtime: null,
  },
}

// ─── Consequence Nodes (8) ───────────────────────────

const CONSEQUENCE_NODES = {
  COORD_FRAG: {
    id: 'COORD_FRAG',
    type: 'consequence',

    human_name: 'Coordination brittleness',
    what_it_means: 'The codebase structure makes coordination between teams difficult in this area. Multiple teams need to work through the same structural bottleneck, and the structure doesn\'t support smooth coordination.',
    why_it_matters: 'When coordination is brittle, even routine changes require multi-team alignment. Integration failures increase, release cycles slow down, and teams spend more time coordinating than building.',
    operational_implication: 'Delivery speed becomes increasingly dependent on cross-team synchronization.',
    how_detected: 'Derived from structural conditions that create coordination pressure — delivery bottlenecks, dependency hubs, or cross-boundary coupling.',
    what_to_look_for: 'Watch for increasing merge conflicts, blocked PRs awaiting multi-team approval, or releases delayed by cross-team dependencies.',

    upstream: [
      { ref: 'DELIVERY_PRESSURE_CONCENTRATION', role: 'defining' },
      { ref: 'DEPENDENCY_CHOKE_POINT', role: 'conditional' },
      { ref: 'CROSS_DOMAIN_COUPLING_PRESSURE', role: 'defining' },
      { ref: 'EXECUTION_FRAGILITY', role: 'conditional' },
      { ref: 'EXECUTION_CONSTRICTION', role: 'conditional' },
    ],
    downstream: [
      { ref: 'AMPLIFIED_DEP_FRAG', role: 'contributor' },
    ],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_1', 'step_3'],
    related_rules: ['§4'],
    runtime: null,
  },

  DEP_AMP: {
    id: 'DEP_AMP',
    type: 'consequence',

    human_name: 'Dependency amplification',
    what_it_means: 'A structural dependency hub is amplifying the impact of changes beyond their apparent scope. Small changes to the hub propagate to many dependent components.',
    why_it_matters: 'Dependency amplification means that the true cost of changes is hidden. A seemingly simple fix in the hub can trigger cascading updates, test failures, or behavioral changes across the system.',
    operational_implication: 'Change impact assessment in this area consistently underestimates the actual blast radius.',
    how_detected: 'Derived from dependency concentration — a component with disproportionately many dependents.',
    what_to_look_for: 'Look for cases where PRs touching this area require unexpectedly broad test reruns or trigger failures in distant parts of the system.',

    upstream: [
      { ref: 'DEPENDENCY_CHOKE_POINT', role: 'defining' },
      { ref: 'EXECUTION_FRAGILITY', role: 'conditional' },
      { ref: 'EXECUTION_CONSTRICTION', role: 'conditional' },
    ],
    downstream: [
      { ref: 'AMPLIFIED_DEP_FRAG', role: 'contributor' },
    ],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_1', 'step_3'],
    related_rules: ['§4'],
    runtime: null,
  },

  DEL_EXP: {
    id: 'DEL_EXP',
    type: 'consequence',

    human_name: 'Delivery risk exposure',
    what_it_means: 'Delivery decisions affecting this region carry elevated structural risk. The combination of active delivery pressure and structural fragility creates a surface where delivery failures are more likely.',
    why_it_matters: 'When delivery risk is concentrated, schedule pressure directly translates to quality risk. Rushing delivery in this area has disproportionate consequences.',
    operational_implication: 'Delivery timelines for work touching this area should account for elevated risk of rework and integration issues.',
    how_detected: 'Derived from the intersection of delivery pressure concentration with structural factors that increase change risk.',
    what_to_look_for: 'Monitor release cycles for this area — increasing rework rates, hotfixes, or rollbacks indicate delivery exposure is materializing.',

    upstream: [
      { ref: 'DELIVERY_PRESSURE_CONCENTRATION', role: 'defining' },
      { ref: 'PROPAGATION_ASYMMETRY', role: 'conditional' },
    ],
    downstream: [
      { ref: 'STRUCT_GRAVITY_WELL', role: 'contributor' },
    ],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_1', 'step_3'],
    related_rules: ['§4'],
    runtime: null,
  },

  OP_BOTTLENECK: {
    id: 'OP_BOTTLENECK',
    type: 'consequence',

    human_name: 'Operational bottleneck',
    what_it_means: 'Structural concentration is constraining the throughput of operations in this region. Work is queuing up because the structure forces sequential or highly-coordinated changes.',
    why_it_matters: 'An operational bottleneck means that adding more people or effort doesn\'t proportionally increase delivery speed. The constraint is structural, not staffing.',
    operational_implication: 'Throughput through this area has a structural ceiling that can\'t be raised by adding more developers.',
    how_detected: 'Derived from conditions where delivery pressure or dependency concentration creates structural constraints on parallel work.',
    what_to_look_for: 'Look for areas where multiple PRs are waiting on each other, where CI queues are long, or where teams report being blocked on the same component.',

    upstream: [
      { ref: 'DELIVERY_PRESSURE_CONCENTRATION', role: 'conditional' },
      { ref: 'DEPENDENCY_CHOKE_POINT', role: 'conditional' },
      { ref: 'EXECUTION_CONSTRICTION', role: 'defining' },
    ],
    downstream: [],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_1', 'step_3'],
    related_rules: ['§4'],
    runtime: null,
  },

  RESIL_DEF: {
    id: 'RESIL_DEF',
    type: 'consequence',

    human_name: 'Resilience deficit',
    what_it_means: 'System resilience depends disproportionately on one structural region. If this area experiences problems, there\'s limited redundancy or alternative paths to absorb the impact.',
    why_it_matters: 'A resilience deficit means the system has a single point of fragility. Incidents in this area have outsized blast radius because there are no structural safety nets.',
    operational_implication: 'Incidents originating in this area are likely to be more severe and harder to contain than incidents elsewhere.',
    how_detected: 'Derived from structural mass concentration — a region carrying disproportionate system weight without corresponding redundancy.',
    what_to_look_for: 'Check whether this area has adequate test coverage, monitoring, and incident response procedures proportional to its structural importance.',

    upstream: [
      { ref: 'STRUCTURAL_MASS_CONCENTRATION', role: 'defining' },
      { ref: 'EXECUTION_FRAGILITY', role: 'defining' },
    ],
    downstream: [
      { ref: 'STRUCT_GRAVITY_WELL', role: 'contributor' },
    ],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_1', 'step_3'],
    related_rules: ['§4'],
    runtime: null,
  },

  GOV_GAP: {
    id: 'GOV_GAP',
    type: 'consequence',

    human_name: 'Governance gap',
    what_it_means: 'The governance framework — code ownership, review policies, quality gates — has a gap that leaves part of the structural surface without explicit oversight.',
    why_it_matters: 'Ungoverned code accumulates risk silently. Without ownership, changes go unreviewed, standards drift, and when problems surface, there\'s no clear owner to respond.',
    operational_implication: 'Risk is accumulating in an area where no team has explicit accountability.',
    how_detected: 'Derived from governance boundary analysis — comparing declared ownership surfaces against actual structural coverage.',
    what_to_look_for: 'Look for directories without CODEOWNERS, PRs merged with minimal review, or areas where everyone and no one is responsible.',

    upstream: [
      { ref: 'GOVERNANCE_COVERAGE_STATUS', role: 'defining' },
    ],
    downstream: [],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_1', 'step_3'],
    related_rules: ['§4'],
    runtime: null,
  },

  PROP_EXP: {
    id: 'PROP_EXP',
    type: 'consequence',

    human_name: 'Propagation exposure',
    what_it_means: 'Changes originating at this point propagate further and less predictably than changes elsewhere. The blast radius of modifications exceeds what the local code structure would suggest.',
    why_it_matters: 'Propagation exposure creates surprise. A change that looks safe locally causes unexpected effects downstream. This undermines confidence in the change process and slows delivery.',
    operational_implication: 'Changes in this area require broader impact analysis than their apparent scope suggests.',
    how_detected: 'Derived from propagation asymmetry — structural analysis showing that dependency paths from this region reach further than typical.',
    what_to_look_for: 'Watch for mystery failures — test or production issues that trace back to changes in this area, despite the changes seeming unrelated.',

    upstream: [
      { ref: 'PROPAGATION_ASYMMETRY', role: 'defining' },
      { ref: 'CROSS_DOMAIN_COUPLING_PRESSURE', role: 'conditional' },
    ],
    downstream: [],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_1', 'step_3'],
    related_rules: ['§4'],
    runtime: null,
  },

  STAB_RISK: {
    id: 'STAB_RISK',
    type: 'consequence',

    human_name: 'Stability risk',
    what_it_means: 'Multiple independent structural risk factors converge on this region, creating compounding instability. No single issue is catastrophic, but together they create a fragile equilibrium.',
    why_it_matters: 'Stability risk means this area is closer to a tipping point than it appears. A change that would be safe in isolation could trigger a cascade when combined with existing structural pressures.',
    operational_implication: 'This region is operating near the edge of its structural tolerance — proceed with extra caution.',
    how_detected: 'Derived from compound convergence or mass concentration — multiple independent structural indicators stacking up on the same region.',
    what_to_look_for: 'Look for an area where several teams have flagged concerns independently, or where metrics (bug rate, revert rate, incident rate) are trending upward.',

    upstream: [
      { ref: 'STRUCTURAL_MASS_CONCENTRATION', role: 'conditional' },
      { ref: 'COMPOUND_CONVERGENCE', role: 'defining' },
    ],
    downstream: [],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_1', 'step_3'],
    related_rules: ['§4'],
    runtime: null,
  },
}

// ─── Combination Nodes (3) ───────────────────────────

const COMBINATION_NODES = {
  AMPLIFIED_DEP_FRAG: {
    id: 'AMPLIFIED_DEP_FRAG',
    type: 'combination',

    human_name: 'Amplified dependency fragility',
    what_it_means: 'A dependency hub sits inside a delivery pressure zone. Coordination is already difficult, and the dependency hub amplifies every coordination failure. Teams can\'t work around the bottleneck because everything routes through the same dependency point.',
    why_it_matters: 'This is worse than either condition alone. Delivery pressure creates the need for fast, parallel work — but the dependency hub forces sequential coordination. The result is a structural trap where speed and quality trade off sharply.',
    operational_implication: 'Delivery in this area faces a structural ceiling that neither staffing changes nor process improvements can fully resolve without architectural intervention.',
    how_detected: 'Requires both coordination fragility from delivery pressure and dependency amplification from a choke point, active on the same structural region.',
    what_to_look_for: 'This is the pattern where teams report they can\'t go faster no matter what they try. Look for persistent delivery friction that doesn\'t respond to process changes.',

    upstream: [
      { ref: 'COORD_FRAG', role: 'contributor' },
      { ref: 'DEP_AMP', role: 'contributor' },
    ],
    downstream: [],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_4'],
    related_rules: ['§5.2'],
    runtime: null,
  },

  STRUCT_GRAVITY_WELL: {
    id: 'STRUCT_GRAVITY_WELL',
    type: 'combination',

    human_name: 'Structural gravity well',
    what_it_means: 'The structurally dominant region of the codebase is also under delivery pressure. Like a gravitational well, it pulls everything toward it — more work, more dependencies, more risk — and it\'s increasingly hard to escape.',
    why_it_matters: 'A gravity well tends to get worse over time. As more functionality accretes around the dominant region, delivery exposure increases, and the cost of eventually restructuring grows. It\'s a structural debt trap.',
    operational_implication: 'Without architectural intervention, this region will continue to accumulate structural mass and delivery risk at an accelerating rate.',
    how_detected: 'Requires both delivery exposure from active pressure and resilience deficit from structural mass concentration, active on the same region.',
    what_to_look_for: 'Look for the codebase area that keeps growing, that every new feature seems to touch, and that developers avoid modifying because it feels too risky.',

    upstream: [
      { ref: 'DEL_EXP', role: 'contributor' },
      { ref: 'RESIL_DEF', role: 'contributor' },
    ],
    downstream: [],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_4'],
    related_rules: ['§5.2'],
    runtime: null,
  },

  SYSTEMIC_OP_FRAG: {
    id: 'SYSTEMIC_OP_FRAG',
    type: 'combination',

    human_name: 'Systemic operational fragility',
    what_it_means: 'Three or more independent structural risk factors have converged on the same region through independent evidence paths. This isn\'t a single problem — it\'s a pattern of multiple problems stacking up in the same place.',
    why_it_matters: 'Systemic fragility means the region is being stressed from multiple directions simultaneously. Each pressure is manageable alone, but their convergence creates a qualitatively different — and more dangerous — situation.',
    operational_implication: 'Localized changes in this area may generate disproportionate execution risk across the broader system.',
    how_detected: 'Requires 3 or more atomic consequences from 3 or more distinct condition types, all sharing the same structural locus.',
    what_to_look_for: 'This is the highest-severity combination. Look for the area where every team has a different complaint, and where fixes for one problem seem to create new ones.',

    upstream: [],
    downstream: [],
    visible_in: ['BOARDROOM', 'BALANCED', 'DENSE', 'OPERATOR'],
    verification_scope: ['step_4'],
    related_rules: ['§5.2'],
    runtime: null,
  },
}

// ─── Rule Nodes (2) ──────────────────────────────────

const RULE_NODES = {
  '§4': {
    id: '§4',
    type: 'rule',

    human_name: 'Condition-to-consequence rules',
    what_it_means: 'These are the derivation rules that determine what operational consequences follow from each structural condition. When the system detects a structural condition (like a delivery bottleneck), these rules define what that condition means operationally.',
    why_it_matters: 'This is the translation layer between what was structurally observed and what it means for operations. It ensures that consequences are derived deterministically from evidence, not guessed or inferred.',
    operational_implication: 'Every consequence you see has a traceable derivation path back to structural evidence through these rules.',
    how_detected: 'Not detected — these are constitutional rules that govern the system\'s derivation logic.',
    what_to_look_for: 'In verification, these checks confirm that every consequence was correctly derived from the right conditions using the right rules.',

    upstream: [
      { ref: 'DELIVERY_PRESSURE_CONCENTRATION', role: 'governance' },
      { ref: 'DEPENDENCY_CHOKE_POINT', role: 'governance' },
      { ref: 'PROPAGATION_ASYMMETRY', role: 'governance' },
      { ref: 'STRUCTURAL_MASS_CONCENTRATION', role: 'governance' },
      { ref: 'CROSS_DOMAIN_COUPLING_PRESSURE', role: 'governance' },
      { ref: 'EXECUTION_FRAGILITY', role: 'governance' },
      { ref: 'EXECUTION_CONSTRICTION', role: 'governance' },
      { ref: 'GOVERNANCE_COVERAGE_STATUS', role: 'governance' },
      { ref: 'COMPOUND_CONVERGENCE', role: 'governance' },
    ],
    downstream: [
      { ref: 'COORD_FRAG', role: 'governance' },
      { ref: 'DEP_AMP', role: 'governance' },
      { ref: 'DEL_EXP', role: 'governance' },
      { ref: 'OP_BOTTLENECK', role: 'governance' },
      { ref: 'RESIL_DEF', role: 'governance' },
      { ref: 'GOV_GAP', role: 'governance' },
      { ref: 'PROP_EXP', role: 'governance' },
      { ref: 'STAB_RISK', role: 'governance' },
    ],
    visible_in: ['OPERATOR'],
    verification_scope: ['step_3'],
    related_rules: [],
    runtime: null,
  },

  '§5.2': {
    id: '§5.2',
    type: 'rule',

    human_name: 'Combination pattern rules',
    what_it_means: 'These rules determine when multiple individual consequences combine into a more serious compound pattern. When several consequences appear on the same structural region, these rules determine whether they interact in a way that warrants escalation.',
    why_it_matters: 'Individual consequences may be manageable in isolation. These rules capture the insight that certain combinations are qualitatively different — and more dangerous — than the sum of their parts.',
    operational_implication: 'A combination pattern means the system found that the observed consequences interact in a known, significant way.',
    how_detected: 'Not detected — these are constitutional rules that govern how individual consequences combine.',
    what_to_look_for: 'In verification, these checks confirm that combination patterns were correctly identified from the right contributor consequences.',

    upstream: [
      { ref: 'COORD_FRAG', role: 'governance' },
      { ref: 'DEP_AMP', role: 'governance' },
      { ref: 'DEL_EXP', role: 'governance' },
      { ref: 'RESIL_DEF', role: 'governance' },
    ],
    downstream: [
      { ref: 'AMPLIFIED_DEP_FRAG', role: 'governance' },
      { ref: 'STRUCT_GRAVITY_WELL', role: 'governance' },
      { ref: 'SYSTEMIC_OP_FRAG', role: 'governance' },
    ],
    visible_in: ['OPERATOR'],
    verification_scope: ['step_4'],
    related_rules: [],
    runtime: null,
  },
}

// ─── Unified Index ───────────────────────────────────

const ALL_NODES = {}
for (const n of Object.values(CONDITION_NODES)) ALL_NODES[n.id] = n
for (const n of Object.values(CONSEQUENCE_NODES)) ALL_NODES[n.id] = n
for (const n of Object.values(COMBINATION_NODES)) ALL_NODES[n.id] = n
for (const n of Object.values(RULE_NODES)) ALL_NODES[n.id] = n

// ─── Resolver: resolveNode ──────────────────────────

function resolveNode(labelId, runtimeContext) {
  const node = ALL_NODES[labelId]
  if (!node) return null

  const ontology = { ...node }
  delete ontology.runtime

  let runtime = null
  if (runtimeContext) {
    const { consequenceResult, synthesisResult, verificationState } = runtimeContext

    if (node.type === 'condition') {
      const conditions = synthesisResult && synthesisResult.conditions || []
      const match = conditions.find(c => c.condition_type === labelId)
      runtime = {
        activated: !!match,
        domain: match ? match.domain || match.locus || null : null,
        evidence_count: match && match.evidence_refs ? match.evidence_refs.length : 0,
        signal_count: match && match.source_signal_ids ? match.source_signal_ids.length : 0,
        verification_verdict: verificationState && verificationState.result ? verificationState.result.verdict : null,
        replay_verdict: verificationState && verificationState.result && verificationState.result.replay ? verificationState.result.replay.verdict : null,
        projection_count: node.visible_in.length,
      }
    } else if (node.type === 'consequence' || node.type === 'combination') {
      const allCsqs = consequenceResult ? [...(consequenceResult.consequences || []), ...(consequenceResult.atomic_consequences || [])] : []
      const match = allCsqs.find(c => c.consequence_type_id === labelId)
      runtime = {
        activated: !!match,
        domain: match ? match.primary_locus || match.locus || null : null,
        evidence_count: match && match.evidence_refs ? match.evidence_refs.length : 0,
        signal_count: match && match.source_signal_ids ? match.source_signal_ids.length : 0,
        verification_verdict: verificationState && verificationState.result ? verificationState.result.verdict : null,
        replay_verdict: verificationState && verificationState.result && verificationState.result.replay ? verificationState.result.replay.verdict : null,
        projection_count: node.visible_in.length,
      }
    }
  }

  return { ontology, runtime }
}

// ─── Resolver: resolveConnections ───────────────────

function resolveConnections(labelId) {
  const node = ALL_NODES[labelId]
  if (!node) return null

  function resolveRefs(refs) {
    return refs.map(r => {
      const target = ALL_NODES[r.ref]
      return {
        ref: r.ref,
        role: r.role,
        human_name: target ? target.human_name : r.ref,
        type: target ? target.type : 'unknown',
      }
    })
  }

  return {
    upstream: resolveRefs(node.upstream),
    downstream: resolveRefs(node.downstream),
  }
}

// ─── Exports ─────────────────────────────────────────

module.exports = {
  CONDITION_NODES,
  CONSEQUENCE_NODES,
  COMBINATION_NODES,
  RULE_NODES,
  ALL_NODES,
  resolveNode,
  resolveConnections,
}
