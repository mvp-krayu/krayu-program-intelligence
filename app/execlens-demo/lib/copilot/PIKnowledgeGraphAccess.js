'use strict';

const fs = require('fs');
const path = require('path');

const { resolveFlagshipBinding } = require('../lens-v2/flagshipBinding');
const { compile, forBoardroom, forBalanced } = require('../lens-v2/software-intelligence/ConsequenceCompiler');
const { synthesize } = require('../lens-v2/SignalSynthesisEngine');

const REPO_ROOT = path.resolve(__dirname, '../../../../');

const CONTEXT_LEVEL = {
  L0: 0,
  L1: 1,
  L2: 2,
  L3: 3,
};

const KNOWLEDGE_DOMAINS = [
  'doctrine',
  'commercial',
  'runtime',
  'vault',
  'specimen',
  'verdict',
  'publishing',
];

function loadMarkdownFile(relativePath) {
  const fullPath = path.join(REPO_ROOT, relativePath);
  try {
    return fs.readFileSync(fullPath, 'utf-8');
  } catch {
    return null;
  }
}

function loadMultipleFiles(relativePaths) {
  const results = [];
  for (const p of relativePaths) {
    const content = loadMarkdownFile(p);
    if (content) {
      results.push({ path: p, content });
    }
  }
  return results;
}

function resolveSpecimen(client, runId) {
  if (!client || !runId) return null;

  const binding = resolveFlagshipBinding({
    query: { client, run: runId },
  });

  if (!binding || binding.statusCode !== 200) return null;
  if (!binding.props || !binding.props.livePayload) return null;

  return binding.props.livePayload;
}

function stripForContext(fullReport) {
  if (!fullReport) return null;

  const stripped = {};
  const EXCLUDE_KEYS = new Set([
    'structural_enrichment',
    'source_artifacts',
    'raw_signals',
    'internal_trace',
  ]);

  for (const [key, value] of Object.entries(fullReport)) {
    if (!EXCLUDE_KEYS.has(key)) {
      stripped[key] = value;
    }
  }
  return stripped;
}

function resolveVerdict(specimen) {
  if (!specimen) return null;

  try {
    const synthesisResult = synthesize(specimen);
    const consequenceResult = compile(synthesisResult, specimen);
    const boardroom = forBoardroom(consequenceResult, synthesisResult, specimen);
    const balanced = forBalanced(consequenceResult, synthesisResult, specimen);

    return {
      boardroom: condenseBoardroom(boardroom),
      balanced: condenseBalanced(balanced),
    };
  } catch {
    return null;
  }
}

function condenseBoardroom(projection) {
  if (!projection) return null;

  const slices = (projection.cognition_slices || [])
    .filter(s => s.severity !== 'NOMINAL')
    .slice(0, 5)
    .map(s => ({
      executive_name: s.executive_name,
      condition_type: s.condition_type,
      domain: s.domain,
      severity: s.severity,
      confidence: s.confidence,
    }));

  const narratives = (projection.domain_narratives || []).map(n => ({
    domain: n.domain,
    risk_shape: n.risk_shape,
    risk_label: n.risk_label,
    classes: n.classes,
  }));

  return {
    posture_label: projection.posture_label,
    posture_severity: projection.posture_severity,
    posture_scope: projection.posture_scope,
    primary_locus: projection.primary_locus,
    consequence_count: projection.consequence_count,
    systemic_count: projection.systemic_count,
    overall_confidence: projection.overall_confidence,
    executive_synthesis: projection.executive_synthesis,
    combined_synthesis: projection.combined_synthesis,
    consequence_themes: projection.consequence_themes,
    domain_concentration: projection.domain_concentration,
    cognition_slices: slices,
    domain_narratives: narratives,
  };
}

function condenseBalanced(projection) {
  if (!projection) return null;

  const flow = (projection.reinforcement_flow || []).slice(0, 3).map(r => ({
    consequence_type_id: r.consequence_type_id,
    title: r.title,
    relationship_verb: r.relationship_verb,
    relationship_sentence: r.relationship_sentence,
    severity: r.severity,
  }));

  const groups = (projection.ontology_groups || []).map(g => ({
    class_id: g.class_id,
    class_name: g.class_name,
    class_question: g.class_question,
    condition_count: g.conditions.length,
    conditions: g.conditions.slice(0, 3).map(c => c.executive_name),
  }));

  return {
    posture_label: projection.posture_label,
    primary_locus: projection.primary_locus,
    overall_confidence: projection.overall_confidence,
    primary_story: projection.primary_story,
    confidence_sentence: projection.confidence_sentence,
    combined_synthesis: projection.combined_synthesis,
    reinforcement_flow: flow,
    ontology_groups: groups,
  };
}

function classifyFileRole(filePath) {
  const basename = filePath.split('/').pop();
  if (/^index\.(ts|tsx|js|jsx)$/.test(basename)) return 'INDEX_FILE_UNCLASSIFIED';
  return null;
}

function condenseSpecimenTopology(rawSpecimen) {
  if (!rawSpecimen) return null;

  const result = {};

  if (rawSpecimen.semantic_cluster_registry && rawSpecimen.semantic_domain_registry) {
    result.clusters = rawSpecimen.semantic_cluster_registry.map(c => {
      const domains = rawSpecimen.semantic_domain_registry
        .filter(d => d.cluster_id === c.cluster_id)
        .map(d => ({
          name: d.domain_name,
          structurally_backed: d.structurally_backed,
          zone_anchor: d.zone_anchor,
        }));
      return { id: c.cluster_id, label: c.cluster_label, domains };
    });
  }

  if (rawSpecimen.semantic_topology_edges) {
    const nameMap = {};
    if (rawSpecimen.semantic_domain_registry) {
      for (const d of rawSpecimen.semantic_domain_registry) {
        nameMap[d.domain_id] = d.domain_name;
      }
    }
    result.edges = rawSpecimen.semantic_topology_edges.map(e => ({
      source: nameMap[e.source_domain] || e.source_domain,
      target: nameMap[e.target_domain] || e.target_domain,
      type: e.relationship_type,
    }));
  }

  if (rawSpecimen.topology_summary) {
    result.summary = rawSpecimen.topology_summary;
  }

  return result;
}

function condenseDependencyHub(rawSpecimen) {
  if (!rawSpecimen?.structural_enrichment?.centrality) return null;

  const centrality = rawSpecimen.structural_enrichment.centrality;
  const result = {};

  if (centrality.top_structural_spines) {
    result.spines = centrality.top_structural_spines.slice(0, 10).map(s => {
      const entry = {
        path: s.path,
        in_degree: s.in_degree,
        out_degree: s.out_degree,
        centrality_rank: s.centrality_rank,
      };
      const hint = classifyFileRole(s.path);
      if (hint) entry.file_role_hint = hint;
      return entry;
    });
  }

  if (centrality.project_metrics) {
    result.metrics = centrality.project_metrics;
  }

  if (centrality.role_summary) {
    result.role_summary = centrality.role_summary;
  }

  return result;
}

function condensePressureZones(rawSpecimen) {
  if (!rawSpecimen?.pressure_zone_state) return null;

  const pz = rawSpecimen.pressure_zone_state;
  const result = { total_zones: pz.total_zones };

  if (pz.zones) {
    result.zones = pz.zones.map(z => ({
      zone_id: z.zone_id,
      zone_class: z.zone_class,
      anchor_name: z.anchor_name,
      condition_count: z.condition_count,
      conditions: z.aggregated_conditions,
      embedded_rules: z.embedded_pair_rules,
    }));
  }

  if (rawSpecimen.propagation_summary?.psig_signals) {
    result.signals = rawSpecimen.propagation_summary.psig_signals.map(s => ({
      id: s.signal_id,
      label: s.signal_label,
      activation: s.activation_state,
      value: s.signal_value,
      primary_domain: s.primary_domain,
      primary_entity: s.primary_entity,
      traceability: s.source_traceability,
    }));
  }

  return result;
}

function condenseConstrictionPoints(rawSpecimen) {
  if (!rawSpecimen?.structural_enrichment) return null;

  const se = rawSpecimen.structural_enrichment;
  const result = {};

  if (se.constriction_surface?.constriction_hotspots) {
    result.constriction_hotspots = se.constriction_surface.constriction_hotspots.slice(0, 10).map(h => {
      const entry = {
        path: h.path,
        constriction_score: h.constriction_score,
        through_flow: h.through_flow,
        is_bridge: h.is_bridge,
      };
      const hint = classifyFileRole(h.path);
      if (hint) entry.file_role_hint = hint;
      return entry;
    });
  }

  if (se.fragility_surface?.fragility_hotspots) {
    result.fragility_hotspots = se.fragility_surface.fragility_hotspots.slice(0, 10).map(h => {
      const entry = {
        path: h.path,
        fragility_score: h.fragility_score,
        coupling: h.coupling,
        cohesion: h.cohesion,
      };
      const hint = classifyFileRole(h.path);
      if (hint) entry.file_role_hint = hint;
      return entry;
    });
  }

  if (se.boundary_divergence) {
    const bd = se.boundary_divergence;
    result.boundary_divergence = {
      divergent_count: bd.divergent_count,
      orphaned_count: bd.orphaned_count,
      system_divergence_index: bd.system_divergence_index,
      divergent_modules: bd.divergent_modules?.slice(0, 5).map(m => ({
        module: m.module_prefix,
        divergence_score: m.divergence_score,
        file_count: m.file_count,
        is_orphaned: m.is_orphaned,
      })),
    };
  }

  return result;
}

function condenseStructuralMass(rawSpecimen) {
  if (!rawSpecimen) return null;

  const result = {};

  if (rawSpecimen.structural_enrichment?.code_graph) {
    result.code_graph = rawSpecimen.structural_enrichment.code_graph;
  }

  if (rawSpecimen.semantic_cluster_registry && rawSpecimen.semantic_domain_registry) {
    result.cluster_mass = rawSpecimen.semantic_cluster_registry.map(c => {
      const domains = rawSpecimen.semantic_domain_registry.filter(d => d.cluster_id === c.cluster_id);
      const backed = domains.filter(d => d.structurally_backed).length;
      return {
        cluster: c.cluster_label,
        total_domains: domains.length,
        structurally_backed: backed,
        grounding_ratio: domains.length > 0 ? +(backed / domains.length).toFixed(2) : 0,
      };
    });
  }

  return result;
}

function determineContextLevel(client, runId, specimen, producedArtifacts) {
  if (!client || !runId) return CONTEXT_LEVEL.L0;
  if (!specimen) return CONTEXT_LEVEL.L0;

  const hasVerdict = specimen.governance_verdict || specimen.readiness_summary;
  if (producedArtifacts && producedArtifacts.length > 0) return CONTEXT_LEVEL.L3;
  if (hasVerdict) return CONTEXT_LEVEL.L2;
  return CONTEXT_LEVEL.L1;
}

function getAvailableDomains(contextLevel) {
  const domains = ['doctrine', 'commercial', 'runtime', 'vault'];
  if (contextLevel >= CONTEXT_LEVEL.L1) domains.push('specimen');
  if (contextLevel >= CONTEXT_LEVEL.L2) domains.push('verdict');
  if (contextLevel >= CONTEXT_LEVEL.L3) domains.push('publishing');
  return domains;
}

module.exports = {
  CONTEXT_LEVEL,
  KNOWLEDGE_DOMAINS,
  loadMarkdownFile,
  loadMultipleFiles,
  resolveSpecimen,
  stripForContext,
  resolveVerdict,
  condenseSpecimenTopology,
  condenseDependencyHub,
  condensePressureZones,
  condenseConstrictionPoints,
  condenseStructuralMass,
  determineContextLevel,
  getAvailableDomains,
};
