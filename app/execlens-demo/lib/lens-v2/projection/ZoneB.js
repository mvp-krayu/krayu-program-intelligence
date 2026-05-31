// Zone B — Governed Narrative Interface
// 75.x bounded interpretive authority.
// This module defines the INTERFACE and governance boundary for narrative projection.
// Actual narrative generation is deferred to consumer-specific narrative providers.
// All output is disclosure-wrapped, evidence-traceable, subject to 13 absolute prohibitions.

const GOVERNANCE_CONTRACT = '75.x'

const ABSOLUTE_PROHIBITIONS = [
  'NO_TEAM_BEHAVIOR_INFERENCE',
  'NO_ORGANIZATIONAL_INTENT',
  'NO_HUMAN_MOTIVE',
  'NO_CULTURAL_DIAGNOSIS',
  'NO_LEADERSHIP_ASSESSMENT',
  'NO_PERSONNEL_ATTRIBUTION',
  'NO_BEHAVIORAL_PREDICTION',
  'NO_ORGANIZATIONAL_SENTIMENT',
  'NO_CAUSAL_ATTRIBUTION_TO_HUMANS',
  'NO_REMEDIATION_PRIORITIZATION',
  'NO_YOU_SHOULD_LANGUAGE',
  'NO_RANKED_NEXT_ACTIONS',
  'NO_SIMULATION_OF_ORG_PSYCHOLOGY',
]

const NARRATIVE_MODES = {
  EXECUTIVE: { register: 'executive', depth: 'synthesis', t_types: ['T6', 'T7'] },
  OPERATIONAL: { register: 'operational', depth: 'causal', t_types: ['T6'] },
  STRUCTURAL: { register: 'structural', depth: 'pattern', t_types: ['T6'] },
  FORENSIC: { register: 'forensic', depth: 'verification', t_types: [] },
  MINIMAL: { register: 'operational', depth: 'summary', t_types: [] },
  NONE: { register: null, depth: null, t_types: [] },
}

function narrate(zoneAOutput, config) {
  const mode = NARRATIVE_MODES[config.narrative_mode] || NARRATIVE_MODES.NONE

  if (mode.register === null) {
    return {
      narratives: [],
      disclosures: [buildDisclosure(config, 'NARRATIVE_DISABLED')],
      governance: { contract: GOVERNANCE_CONTRACT, prohibitions_enforced: ABSOLUTE_PROHIBITIONS.length, mode: 'NONE' },
    }
  }

  const narratives = []
  for (const section of zoneAOutput.sections) {
    const narrative = {
      section_id: section.section_id,
      narrative_mode: config.narrative_mode,
      narrative_register: mode.register,
      narrative_depth: mode.depth,
      evidence_sources: section.evidence_sources,
      narrative_slot: {
        status: 'AWAITING_PROVIDER',
        provider_type: config.narrative_mode === 'EXECUTIVE' ? 'GOVERNED_AI' : 'DETERMINISTIC',
        t_types: mode.t_types,
      },
      disclosure: buildSectionDisclosure(section, config),
    }
    narratives.push(narrative)
  }

  return {
    narratives,
    disclosures: [buildDisclosure(config, 'NARRATIVE_BOUNDED')],
    governance: {
      contract: GOVERNANCE_CONTRACT,
      prohibitions_enforced: ABSOLUTE_PROHIBITIONS.length,
      prohibitions: ABSOLUTE_PROHIBITIONS,
      mode: config.narrative_mode,
      register: mode.register,
    },
  }
}

function buildDisclosure(config, status) {
  return {
    consumer_id: config.consumer_id,
    governance_contract: GOVERNANCE_CONTRACT,
    narrative_status: status,
    prohibition_count: ABSOLUTE_PROHIBITIONS.length,
    authority_boundary: 'Interpretive authority bounded by 75.x. All claims trace to structural evidence.',
  }
}

function buildSectionDisclosure(section, config) {
  return {
    section_id: section.section_id,
    evidence_count: section.evidence_sources.length,
    primary_object: section.primary_object_id,
    interpretive_authority: GOVERNANCE_CONTRACT,
  }
}

module.exports = { narrate, ABSOLUTE_PROHIBITIONS, NARRATIVE_MODES, GOVERNANCE_CONTRACT }
