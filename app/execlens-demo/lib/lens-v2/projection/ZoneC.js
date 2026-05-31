// Zone C — Qualification Gate
// ZERO AI. Non-automatable boundary.
// Enforces SQO S-level authority ceiling on Zone B output.
// Consumer-INDEPENDENT — same gate for all consumers.
// Suppresses projections exceeding ceiling, not merely flags them.

const AUTHORITY_CEILING = {
  S0: {
    label: 'No projection authorized',
    narrative_allowed: false,
    structural_allowed: false,
    interpretive_allowed: false,
  },
  S1: {
    label: 'Structural projection only',
    narrative_allowed: false,
    structural_allowed: true,
    interpretive_allowed: false,
  },
  S2: {
    label: 'Qualified projection with debt disclosure',
    narrative_allowed: true,
    structural_allowed: true,
    interpretive_allowed: true,
    requires_debt_disclosure: true,
  },
  S3: {
    label: 'Full projection authority',
    narrative_allowed: true,
    structural_allowed: true,
    interpretive_allowed: true,
    requires_debt_disclosure: false,
  },
}

function qualify(zoneBOutput, qualificationState) {
  const sLevel = (qualificationState && qualificationState.s_level) || null
  const ceiling = AUTHORITY_CEILING[sLevel] || AUTHORITY_CEILING.S0
  const qClass = (qualificationState && qualificationState.q_class) || null

  const qualifiedNarratives = []
  const suppressedNarratives = []

  for (const narrative of (zoneBOutput.narratives || [])) {
    const isInterpretive = narrative.narrative_slot &&
      narrative.narrative_slot.provider_type === 'GOVERNED_AI'

    if (!ceiling.narrative_allowed) {
      suppressedNarratives.push({
        ...narrative,
        suppression_reason: 'S-level ' + sLevel + ' does not authorize narrative projection',
        suppressed_by: 'ZONE_C_AUTHORITY_CEILING',
      })
      continue
    }

    if (isInterpretive && !ceiling.interpretive_allowed) {
      suppressedNarratives.push({
        ...narrative,
        suppression_reason: 'S-level ' + sLevel + ' does not authorize interpretive projection',
        suppressed_by: 'ZONE_C_AUTHORITY_CEILING',
      })
      continue
    }

    const qualified = { ...narrative }
    if (ceiling.requires_debt_disclosure) {
      qualified.debt_disclosure = {
        required: true,
        q_class: qClass,
        ceiling_label: ceiling.label,
      }
    }
    qualifiedNarratives.push(qualified)
  }

  return {
    qualified_narratives: qualifiedNarratives,
    suppressed_narratives: suppressedNarratives,
    governance: {
      s_level: sLevel,
      q_class: qClass,
      authority_ceiling: ceiling.label,
      narrative_allowed: ceiling.narrative_allowed,
      structural_allowed: ceiling.structural_allowed,
      interpretive_allowed: ceiling.interpretive_allowed,
      requires_debt_disclosure: !!ceiling.requires_debt_disclosure,
      prohibitions_enforced: zoneBOutput.governance
        ? zoneBOutput.governance.prohibitions_enforced
        : 0,
      suppressed_count: suppressedNarratives.length,
      qualified_count: qualifiedNarratives.length,
    },
    disclosures: [
      ...(zoneBOutput.disclosures || []),
      {
        gate: 'ZONE_C',
        s_level: sLevel,
        q_class: qClass,
        ceiling: ceiling.label,
        suppressed: suppressedNarratives.length,
        qualified: qualifiedNarratives.length,
      },
    ],
  }
}

module.exports = { qualify, AUTHORITY_CEILING }
