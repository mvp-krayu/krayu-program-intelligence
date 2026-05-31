// T1 materializer — pure assembly from fullReport posture/qualification fields
const OBJECT_ID = 'structural_posture'

function materialize(cip) {
  const fr = cip.fullReport || {}
  const readiness = fr.readiness_summary || {}
  const qualifier = fr.qualifier_summary || {}
  const topo = fr.topology_summary || {}
  const dpsig = fr.dpsig_signal_summary || {}
  const governance = fr.governance_lifecycle || {}
  const propositions = fr.proposition_corpus || {}
  const revalidation = fr.revalidation_intelligence || null
  const anchor = fr.constitutional_anchor || null
  const certification = fr.chronicle_certification || null
  const signals = fr.signal_interpretations || []
  const enrichment = fr.structural_enrichment || {}

  const activeSignals = signals.filter(s => s.severity && s.severity !== 'NOMINAL')

  return {
    object_id: OBJECT_ID,
    qualification: {
      s_level: readiness.posture || null,
      q_class: qualifier.qualifier_class || null,
      q_label: qualifier.qualifier_label || null,
      provenance: governance.qualification_provenance || null,
      revalidation: revalidation ? {
        status: revalidation.overall_status || null,
        pass_count: revalidation.pass_count || 0,
        total_count: revalidation.total_count || 0,
      } : null,
      anchor: anchor ? {
        status: anchor.overall_status || null,
        dimensions_passed: anchor.dimensions_passed || 0,
        dimensions_total: anchor.dimensions_total || 0,
      } : null,
      certification: certification ? {
        status: certification.status || null,
        check_count: certification.check_count || 0,
        pass_count: certification.pass_count || 0,
      } : null,
      propositions: propositions.total_count != null ? {
        total: propositions.total_count || 0,
        accepted: propositions.accepted_count || 0,
        rejected: propositions.rejected_count || 0,
        contested: propositions.contested_count || 0,
      } : null,
    },
    scale: {
      total_nodes: topo.structural_dom_count || topo.semantic_domain_count || 0,
      cluster_count: topo.cluster_count || 0,
      import_relationships: enrichment.code_graph ? enrichment.code_graph.total_import_edges || 0 : 0,
      grounding_ratio: topo.grounding_ratio || null,
      coverage_classification: topo.coverage_classification || null,
    },
    signal_profile: {
      total_signals: (dpsig.signals || []).length + signals.length,
      active_signals: activeSignals.length,
      primary_severity: activeSignals.length > 0 ? activeSignals[0].severity : null,
      signal_families: extractSignalFamilies(dpsig, signals),
    },
    posture_drivers: {
      readiness_score: readiness.score || null,
      readiness_band: readiness.band || null,
      render_state: readiness.render_state || null,
    },
    confidence_envelope: {
      semantic_continuity: qualifier.semantic_continuity_status || null,
      evidence_availability: qualifier.evidence_availability || null,
      governance_verdict: fr.governance_summary ? fr.governance_summary.governance_verdict : null,
    },
  }
}

function extractSignalFamilies(dpsig, signals) {
  const families = new Set()
  if (dpsig && dpsig.signals) {
    for (const s of dpsig.signals) families.add('DPSIG')
  }
  for (const s of signals) {
    if (s.signal_id) {
      const prefix = s.signal_id.split('-')[0]
      if (prefix) families.add(prefix.toUpperCase())
    }
  }
  return [...families]
}

module.exports = { materialize, OBJECT_ID }
