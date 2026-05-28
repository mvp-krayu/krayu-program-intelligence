// OperationalVocabulary.js
// Governed vocabulary registry for BALANCED narrative composition.
// Every sentence emitted by BALANCED must draw from this registry.
// Stream: PI.BALANCED.GOVERNED-NARRATIVE-COMPOSITION.01

// ─────────────────────────────────────────────
// ALLOWED VOCABULARY — organized by semantic class
// ─────────────────────────────────────────────

export const PRESSURE_VERBS = [
  'concentrates', 'converges', 'compounds', 'amplifies',
  'propagates', 'reinforces', 'loads', 'exposes',
]

export const STRUCTURE_VERBS = [
  'carries', 'absorbs', 'dominates', 'anchors',
  'binds', 'distributes', 'resolves', 'centralizes',
]

export const TRUST_VERBS = [
  'confirms', 'projects', 'grounds', 'backs',
  'qualifies', 'calibrates',
]

export const MOVEMENT_VERBS = [
  'routes', 'flows', 'propagates', 'reaches',
  'spreads', 'traverses',
]

export const TOPOLOGY_NOUNS = [
  'corridor', 'region', 'cluster', 'anchor', 'epicenter',
  'domain', 'hub', 'node', 'path', 'edge',
]

export const PRESSURE_NOUNS = [
  'mass', 'load', 'concentration', 'convergence',
  'pattern', 'exposure', 'asymmetry', 'imbalance',
  'fragility', 'pressure', 'weight',
]

export const TRUST_NOUNS = [
  'boundary', 'grounding', 'confirmation', 'projection',
  'calibration', 'confidence', 'backing',
]

export const EVIDENCE_NOUNS = [
  'signal', 'condition', 'backing', 'evidence',
  'indicator', 'activation', 'severity',
]

// ─────────────────────────────────────────────
// OPERATIONAL ADJECTIVES
// ─────────────────────────────────────────────

export const ALLOWED_ADJECTIVES = [
  'structural', 'operational', 'compound', 'concentrated',
  'dominant', 'asymmetric', 'disproportionate', 'reinforcing',
  'advisory-bound', 'grounded', 'semantic-only',
  'independent', 'convergent', 'critical', 'elevated',
  'activated', 'nominal', 'exposed', 'fragile',
]

// ─────────────────────────────────────────────
// FORBIDDEN LANGUAGE — hard violations
// ─────────────────────────────────────────────

export const FORBIDDEN_PATTERNS = [
  // Organizational / human attribution
  /\bteams?\b/i,
  /\borganization(al)?\b/i,
  /\bleadership\b/i,
  /\bmanagement\b/i,
  /\bcultur(e|al)\b/i,
  /\btoxic\b/i,
  /\bfailing\b/i,
  /\bcollaps(e|ing)\b/i,
  /\bdysfunction(al)?\b/i,
  /\bbroken\b/i,

  // Prediction / prescription
  /\bwill fail\b/i,
  /\bshould\b/i,
  /\bmust fix\b/i,
  /\brecommend\b/i,
  /\bpriority\b/i,
  /\bimminent\b/i,
  /\bcatastroph(e|ic)\b/i,

  // AI theater / hedge language
  /\bour analysis shows\b/i,
  /\bwe believe\b/i,
  /\bit appears that\b/i,
  /\bmay potentially\b/i,
  /\bcould experience\b/i,
  /\bmight struggle\b/i,
  /\bseems to indicate\b/i,

  // Management consulting
  /\becosystem challenges\b/i,
  /\btransformation journey\b/i,
  /\bstrategic alignment\b/i,
  /\bcapability maturation\b/i,
  /\boperational excellence\b/i,
]

// ─────────────────────────────────────────────
// SEVERITY VOCABULARY — deterministic from data
// ─────────────────────────────────────────────

export const SEVERITY_LANGUAGE = {
  CRITICAL: {
    posture: 'structurally exposed',
    pressure: 'compound convergent pressure',
    trust: 'structurally confirmed within grounded regions',
  },
  HIGH: {
    posture: 'concentrated pressure',
    pressure: 'concentrated structural pressure',
    trust: 'partially confirmed',
  },
  ELEVATED: {
    posture: 'elevated structural attention',
    pressure: 'elevated pressure indicators',
    trust: 'directionally indicated',
  },
  ACTIVATED: {
    posture: 'structural attention required',
    pressure: 'active structural signals',
    trust: 'advisory',
  },
  NOMINAL: {
    posture: 'within expected bounds',
    pressure: 'no significant pressure detected',
    trust: 'structurally stable',
  },
}

// ─────────────────────────────────────────────
// ZONE HEADLINE TEMPLATES — deterministic
// ─────────────────────────────────────────────

export const POSTURE_HEADLINES = {
  EXPOSED: 'Delivery coordination is structurally exposed.',
  CONCENTRATED: 'Operational coordination shows concentrated pressure.',
  ELEVATED: 'Structural pressure is elevated but distributed.',
  NOMINAL: 'Structural posture is within expected bounds.',
}

export const CONVERGENCE_TEMPLATES = {
  REINFORCING: (themeA, themeB) =>
    `These pressures are not independent. ${themeA} loads the same corridor that ${themeB}.`,
  COMPOUNDING: (anchor) =>
    `This reinforcing pattern is what makes the pressure compound rather than additive at ${anchor}.`,
  INDEPENDENT: () =>
    'These pressure themes operate on different structural corridors.',
}

export const TRUST_TEMPLATES = {
  ADVISORY_BOUND: (confirmed, total) =>
    `The pressure pattern described above is structurally confirmed where code-level evidence exists — ${confirmed} of ${total} operational domains. For the remaining ${total - confirmed} domains, interpretation follows semantic structure but has not been verified against structural evidence.`,
  PARTIALLY_GROUNDED: (confirmed, total) =>
    `Structural confirmation exists for ${confirmed} of ${total} domains. The remaining domains carry semantic continuity but lack structural backing.`,
  FULLY_GROUNDED: (total) =>
    `All ${total} operational domains are structurally confirmed.`,
}

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────

export function validateSentence(sentence) {
  const violations = []
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(sentence)) {
      violations.push({ pattern: pattern.source, sentence })
    }
  }
  return { valid: violations.length === 0, violations }
}

export function validateComposition(composition) {
  const allSentences = extractSentences(composition)
  const results = allSentences.map(s => ({
    sentence: s,
    ...validateSentence(s),
  }))
  const failures = results.filter(r => !r.valid)
  return {
    valid: failures.length === 0,
    total: allSentences.length,
    failures,
  }
}

function extractSentences(obj) {
  if (typeof obj === 'string') return obj.split(/[.!?]+/).filter(s => s.trim())
  if (Array.isArray(obj)) return obj.flatMap(extractSentences)
  if (obj && typeof obj === 'object') return Object.values(obj).flatMap(extractSentences)
  return []
}
