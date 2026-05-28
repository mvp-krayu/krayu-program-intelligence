// CompositionContract.js
// Zone transition rules, composition governance, and anti-patterns.
// Stream: PI.BALANCED.GOVERNED-NARRATIVE-COMPOSITION.01

// ─────────────────────────────────────────────
// ZONE DEFINITIONS — what each zone renders
// ─────────────────────────────────────────────

export const ZONE_DEFINITIONS = {
  Z1: {
    id: 'Z1',
    name: 'Operational Posture',
    cognitive_role: 'PRIMARY',
    question: 'What is the situation?',
    renders: ['posture_headline', 'posture_dynamics', 'posture_chips'],
    visual_weight: 'DOMINANT',
    pacing: 'The reader orients here. Headline is snap-read. Narrative explains dynamics.',
  },
  Z2: {
    id: 'Z2',
    name: 'Pressure Synthesis',
    cognitive_role: 'SECONDARY',
    question: 'What creates this posture?',
    renders: ['pressure_themes', 'pressure_convergence', 'signal_disclosure'],
    visual_weight: 'VISIBLE',
    pacing: 'Two themes decompose the posture. Convergence observation connects them. Signals stay collapsed.',
  },
  Z3: {
    id: 'Z3',
    name: 'Operational Epicenter',
    cognitive_role: 'SECONDARY',
    question: 'Where do these pressures converge?',
    renders: ['epicenter_name', 'epicenter_portrait', 'epicenter_facts', 'epicenter_meaning'],
    visual_weight: 'GRAVITATIONAL',
    pacing: 'The moment the briefing lands. Narrative-led, facts support. Centered layout creates pause.',
  },
  Z4: {
    id: 'Z4',
    name: 'Trust Calibration',
    cognitive_role: 'TERTIARY',
    question: 'How trustworthy is this interpretation?',
    renders: ['trust_statement', 'trust_bar'],
    visual_weight: 'COMPRESSED',
    pacing: 'One paragraph. One bar. Done. No governance prose.',
  },
  Z5: {
    id: 'Z5',
    name: 'Descent Paths',
    cognitive_role: 'TERTIARY',
    question: 'Where can I descend for proof?',
    renders: ['descent_cards'],
    visual_weight: 'QUIET',
    pacing: 'Two cards. Footer-quiet. Exit ramps, not features.',
  },
}

// ─────────────────────────────────────────────
// ZONE TRANSITIONS — narrative thread
// ─────────────────────────────────────────────

export const ZONE_TRANSITIONS = [
  {
    from: 'Z1',
    to: 'Z2',
    cognitive_bridge: 'What creates this posture?',
    rule: 'Z2 first sentence must connect to the posture established in Z1. No cognitive reset.',
  },
  {
    from: 'Z2',
    to: 'Z3',
    cognitive_bridge: 'Where do these pressures converge?',
    rule: 'Z3 portrait must reference pressure themes. The epicenter is WHERE the themes concentrate.',
  },
  {
    from: 'Z3',
    to: 'Z4',
    cognitive_bridge: 'How much should I trust this?',
    rule: 'Z4 calibrates trust for everything above. No new findings. No new pressure.',
  },
  {
    from: 'Z4',
    to: 'Z5',
    cognitive_bridge: 'Where can I go deeper?',
    rule: 'Z5 is exit only. Two cards. No content. No findings.',
  },
]

// ─────────────────────────────────────────────
// COMPOSITION RULES — what BALANCED may and
// may not do
// ─────────────────────────────────────────────

export const COMPOSITION_RULES = {
  BALANCED_MAY: [
    'Sequence forBalanced() consequence objects into zone-appropriate structure',
    'Select headline/template variants from posture_severity',
    'Project convergence observation from reinforcement_flow relationship verbs',
    'Extract supplementary topology facts from fullReport (display only)',
    'Calibrate trust language based on grounding ratio',
    'Control visual pacing across zones',
    'Compress governance metadata into tertiary position',
  ],

  BALANCED_MAY_NOT: [
    'Derive posture from raw signal counts (owned by ConsequenceCompiler)',
    'Group signals into operational themes (owned by SignalSynthesisEngine)',
    'Detect convergence from raw data (owned by ConsequenceCompiler)',
    'Derive operational meaning from topology (owned by ConsequenceCompiler)',
    'Attribute causality to humans, teams, or organizations',
    'Predict future failure or operational outcomes',
    'Prescribe remediation actions or priorities',
    'Generate prose outside governed vocabulary',
    'Create a parallel cognition path alongside ConsequenceCompiler',
    'Replace PI-Core zone rendering with SW-Intel narrative',
  ],
}

// ─────────────────────────────────────────────
// ANTI-PATTERNS — explicit forbidden patterns
// ─────────────────────────────────────────────

export const ANTI_PATTERNS = [
  {
    id: 'AP-01',
    name: 'PROSE_DRIFT',
    description: 'Narrative text that cannot be traced to a governed vocabulary template or cognition source.',
    detection: 'Any sentence that does not match a registered template pattern.',
    correction: 'Bind to template in OperationalVocabulary.js or NarrativePrimitives.js.',
  },
  {
    id: 'AP-02',
    name: 'STACKED_CARD_SYNDROME',
    description: 'Rendering pressure themes or signals as equal-weight stacked cards without relationship.',
    detection: 'Zone 2 renders more than 2 top-level blocks without convergence observation.',
    correction: 'Themes must show relationship. Convergence observation is mandatory when themes share anchor.',
  },
  {
    id: 'AP-03',
    name: 'GOVERNANCE_REGRESSION',
    description: 'Confidence, qualifier, or governance prose appearing outside Zone 4.',
    detection: 'Q-class, qualifier label, or governance lifecycle language in Z1/Z2/Z3.',
    correction: 'All governance metadata belongs in Z4 or compressed into tertiary support.',
  },
  {
    id: 'AP-04',
    name: 'METADATA_OVERLOAD',
    description: 'Left panel or right panel competing with center corridor for cognitive attention.',
    detection: 'Panel content exceeds 40% of visual weight.',
    correction: 'Panels support. Center dominates. Compress panel content.',
  },
  {
    id: 'AP-05',
    name: 'DENSE_LEAKAGE',
    description: 'Topology overlays, signal IDs, forensic slices, or evidence tables in BALANCED.',
    detection: 'Signal IDs (PSIG-001, ISIG-001) visible in rendered output.',
    correction: 'Use operator-facing labels from BALANCED_SIGNAL_LABELS. IDs are internal.',
  },
  {
    id: 'AP-06',
    name: 'COGNITIVE_RESET',
    description: 'A zone renders as if the previous zone did not exist. No narrative continuity.',
    detection: 'Zone N first sentence has no connection to Zone N-1 content.',
    correction: 'Apply ZONE_TRANSITIONS bridge rule.',
  },
  {
    id: 'AP-07',
    name: 'SW_INTEL_REPLACEMENT',
    description: 'SW-Intel enrichment replaces PI-Core zone content instead of augmenting it.',
    detection: 'Conditional rendering: if (swIntelActive) return <different tree>.',
    correction: 'ONE rendering path. SW-Intel enriches zones inline. PI-Core owns zone structure.',
  },
]

// ─────────────────────────────────────────────
// AUDIENCE CONTRACT
// ─────────────────────────────────────────────

export const AUDIENCE_CONTRACT = {
  primary: ['CTO', 'VP Engineering', 'Enterprise Architect', 'Delivery Director'],
  secondary: ['Platform Director', 'Technical Due Diligence Lead', 'PMO Lead'],
  cognitive_mode: 'Operational — causal understanding, not forensic proof',
  prior_state: 'Reader already ACCEPTS there is a posture (from BOARDROOM)',
  balanced_question: 'What operational dynamics create this posture?',
  wants: [
    'WHY pressure exists',
    'HOW it propagates',
    'WHAT reinforces it',
    'WHERE operational gravity concentrates',
    'HOW trustworthy the interpretation is',
  ],
  does_not_want: [
    'Forensic telemetry',
    'Governance internals',
    'Raw topology traversal',
    'Signal IDs or evidence counts as primary content',
  ],
}

// ─────────────────────────────────────────────
// VISUAL PACING DOCTRINE
// ─────────────────────────────────────────────

export const VISUAL_PACING = {
  Z1: { weight: 'DOMINANT', typography: 'Headline 21px + body 15px', breathing: 'generous' },
  Z2: { weight: 'VISIBLE', typography: 'Theme label 10px mono + body 14px', breathing: 'standard' },
  Z3: { weight: 'GRAVITATIONAL', typography: 'Name 28px + body 14px', breathing: 'generous, centered' },
  Z4: { weight: 'COMPRESSED', typography: 'Body 13px + bar', breathing: 'tight' },
  Z5: { weight: 'QUIET', typography: 'Card title 10px mono + desc 11px', breathing: 'standard' },
}
