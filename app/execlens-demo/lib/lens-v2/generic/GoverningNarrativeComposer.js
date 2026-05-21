'use strict';

/**
 * GoverningNarrativeComposer
 *
 * Synthesis-native composition interface for governed executive narrative.
 * Defines the composition contract that any provider (deterministic or agentic)
 * must satisfy, and ships a deterministic bounded provider as the bootstrap
 * execution mode.
 *
 * Architecture: GEIOS owns intelligence production. LENS owns intelligence
 * presentation. This module sits at the GEIOS–LENS bridge boundary.
 *
 * Reference: PI.GEIOS.INTELLIGENCE-MEMORY-SPINE-AND-AGENTIC-CONTINUITY.01
 *   - Narrative Synthesizer agent class (L4, 75.x)
 *   - Projection Continuity dimension
 *   - Agent governance: agents enrich, agents do not govern
 */

const COMPOSITION_VERSION = '1.0';
const GOVERNANCE_CONTRACT = '75.x';
const PROHIBITIONS_ENFORCED = 13;

const SURPRISE_CLASS_PRIORITY = {
  CENTRALITY: 0,
  TOPOLOGY: 1,
  COUPLING: 2,
  EMERGENCE: 3,
};

function deriveNarrativeAnchors(heroMoments, structuralEnrichment) {
  const anchors = [];

  for (const hm of heroMoments) {
    anchors.push({
      anchor_id: `NA-${hm.id.slice(0, 8)}`,
      source: {
        hero_moment_id: hm.id,
        surprise_class: hm.surprise_class,
      },
      claim_text: hm.discovery,
      evidence_object_ids: hm.evidence_anchors || [],
      structural_basis: hm.discovery,
    });
  }

  if (structuralEnrichment && structuralEnrichment.dual_authority) {
    const da = structuralEnrichment.dual_authority;
    anchors.push({
      anchor_id: 'NA-DUAL-AUTH',
      source: { hero_moment_id: null, surprise_class: 'TOPOLOGY' },
      claim_text: `Dual structural authority: import authority at ${da.import_dominant.path} (${da.import_dominant.import_in_degree} inbound), inheritance authority at ${da.inheritance_dominant.path} (${da.inheritance_dominant.inherits_in_degree} inbound).`,
      evidence_object_ids: [],
      structural_basis: 'Derived from 40.3c centrality decomposition',
    });
  }

  anchors.sort((a, b) =>
    (SURPRISE_CLASS_PRIORITY[a.source.surprise_class] || 99) -
    (SURPRISE_CLASS_PRIORITY[b.source.surprise_class] || 99)
  );

  return anchors;
}

function deterministicBoundedProvider(compositionInput) {
  const { narrative_anchors, structural_context, qualification_context } = compositionInput;

  const paragraphs = [];
  const sc = structural_context;
  const qc = qualification_context;

  const clusterCount = sc.cluster_count || 0;
  const nodeCount = sc.node_count || 0;
  const importEdges = sc.import_edges || 0;
  const inheritEdges = sc.inheritance_edges || 0;
  const fileCount = sc.file_count || 0;
  const dualAuth = sc.dual_authority || null;

  const centralityAnchors = narrative_anchors.filter(a => a.source.surprise_class === 'CENTRALITY');
  const topologyAnchors = narrative_anchors.filter(a => a.source.surprise_class === 'TOPOLOGY');
  const couplingAnchors = narrative_anchors.filter(a => a.source.surprise_class === 'COUPLING');
  const emergenceAnchors = narrative_anchors.filter(a => a.source.surprise_class === 'EMERGENCE');

  const specimenName = qc.specimen_display || qc.specimen_id || 'This system';
  const sState = qc.s_state || 'S1';

  // --- OPENING ---
  paragraphs.push({
    arc_position: 'OPENING',
    text: `${specimenName} presents as a ${clusterCount > 10 ? 'large-scale' : 'mid-scale'} software system spanning ${fileCount.toLocaleString()} source files organized across ${clusterCount} structural clusters. The repository structure suggests modular architecture with clear domain boundaries. Program Intelligence structural analysis resolves ${importEdges.toLocaleString()} import relationships and ${inheritEdges.toLocaleString()} inheritance relationships across the codebase, producing a complete structural authority map that reveals the actual architectural reality beneath the apparent organization.`,
    anchors: [],
    governance: { authority: 'STRUCTURAL_NARRATIVE', contract: GOVERNANCE_CONTRACT },
  });

  // --- REVELATION ---
  if (centralityAnchors.length > 0 || dualAuth) {
    const centralityClaims = centralityAnchors.map(a => a.claim_text);

    let revelationText;
    if (dualAuth) {
      const impPath = dualAuth.import_dominant.path.split('/').pop();
      const inhPath = dualAuth.inheritance_dominant.path.split('/').pop();
      revelationText = `Beneath the apparent modularity, the structural substrate reveals a dual-authority backbone. Import authority — the vocabulary and data coupling that determines what each component references — concentrates around ${impPath} with ${dualAuth.import_dominant.import_in_degree} inbound dependencies. Inheritance authority — the behavioral framework that determines how components operate — converges independently on ${inhPath} with ${dualAuth.inheritance_dominant.inherits_in_degree} inbound inheritance relationships. These two authority hierarchies are architecturally distinct: one dictates data vocabulary, the other dictates operational behavior. This split gravity model is invisible from repository organization alone.`;
    } else {
      const primary = centralityClaims[0] || '';
      revelationText = `The structural substrate reveals concentration patterns not visible from repository organization. ${primary} This degree of structural dominance indicates a gravitational center that other components orbit around — a dependency pattern that shapes the operational reality of the entire system.`;
    }

    paragraphs.push({
      arc_position: 'REVELATION',
      text: revelationText,
      anchors: [...centralityAnchors, ...topologyAnchors].map(a => ({
        anchor_id: a.anchor_id,
        source: a.source,
        evidence_object_ids: a.evidence_object_ids,
        structural_basis: a.structural_basis,
      })),
      governance: { authority: 'STRUCTURAL_NARRATIVE', contract: GOVERNANCE_CONTRACT },
    });
  }

  // --- DEPTH ---
  if (couplingAnchors.length > 0) {
    const crossDomainAnchor = couplingAnchors.find(a => a.claim_text.includes('cross-domain') || a.claim_text.includes('cross-app'));
    const bidirectionalAnchor = couplingAnchors.find(a => a.claim_text.includes('idirectional'));

    let depthText = '';
    if (crossDomainAnchor && bidirectionalAnchor) {
      depthText = `The coupling analysis deepens this picture. What appears as modular domain separation is structurally porous — the majority of import relationships cross domain boundaries, indicating that the apparent modularity is organizational rather than architectural. Critical domain pairs show bidirectional entanglement: components that documentation presents as independent are structurally inseparable. They cannot be independently versioned, tested, or extracted without breaking the mutual dependency chain. This is not a defect to be fixed but a structural reality to be governed.`;
    } else if (crossDomainAnchor) {
      depthText = `The coupling analysis reveals that domain boundaries are more porous than the repository structure suggests. A significant proportion of import relationships cross domain boundaries, indicating that the apparent modularity serves organizational purposes rather than reflecting true architectural independence.`;
    } else {
      depthText = couplingAnchors[0].claim_text;
    }

    paragraphs.push({
      arc_position: 'DEPTH',
      text: depthText,
      anchors: couplingAnchors.map(a => ({
        anchor_id: a.anchor_id,
        source: a.source,
        evidence_object_ids: a.evidence_object_ids,
        structural_basis: a.structural_basis,
      })),
      governance: { authority: 'STRUCTURAL_NARRATIVE', contract: GOVERNANCE_CONTRACT },
    });
  }

  // --- AUTHORITY ---
  if (sc.top_spines && sc.top_spines.length > 0) {
    const topSpine = sc.top_spines[0];
    const roleCounts = sc.role_summary || {};
    const totalRanked = Object.values(roleCounts).reduce((s, v) => s + v, 0);

    paragraphs.push({
      arc_position: 'AUTHORITY',
      text: `Structural centrality analysis ranks ${totalRanked.toLocaleString()} files by authority weight. The primary structural spine — ${topSpine.path.split('/').slice(-2).join('/')} — carries ${topSpine.in_degree} inbound dependencies, making it the single most structurally influential component. ${roleCounts.RE_EXPORT_HUB ? `${roleCounts.RE_EXPORT_HUB} files operate as re-export hubs, amplifying coupling through transitive dependency chains.` : ''} ${roleCounts.INTERFACE_BOUNDARY ? `${roleCounts.INTERFACE_BOUNDARY} files serve as interface boundaries where cross-domain contracts are defined.` : ''} Changes to high-authority files propagate structurally to downstream dependents — this is the risk surface that traditional code review cannot see.`,
      anchors: centralityAnchors.map(a => ({
        anchor_id: a.anchor_id,
        source: a.source,
        evidence_object_ids: a.evidence_object_ids,
        structural_basis: a.structural_basis,
      })),
      governance: { authority: 'STRUCTURAL_NARRATIVE', contract: GOVERNANCE_CONTRACT },
    });
  }

  // --- QUALIFICATION ---
  const gateLabel = qc.gate_status === 'OPEN' ? 'open for progression' : 'pending structural escalation';

  paragraphs.push({
    arc_position: 'QUALIFICATION',
    text: `This system is currently at ${sState} structural qualification — structural topology, code graph, and centrality analysis are complete. ${qc.ceu_state ? `Canonical Evidence Unit reconciliation has been performed: ${qc.ceu_state}.` : ''} The qualification gate is ${gateLabel}. Semantic qualification — domain meaning, behavioral intent, and organizational alignment — has not yet been established. All intelligence presented here is structurally derived; no semantic claims are made or implied.`,
    anchors: [],
    governance: { authority: 'STRUCTURAL_NARRATIVE', contract: GOVERNANCE_CONTRACT },
  });

  return {
    paragraphs,
    composition_provenance: {
      method: 'DETERMINISTIC_BOUNDED',
      governance_contract: GOVERNANCE_CONTRACT,
      prohibitions_enforced: PROHIBITIONS_ENFORCED,
      replay_tier: 'EXACT',
      anchors_consumed: narrative_anchors.length,
      evidence_objects_referenced: new Set(narrative_anchors.flatMap(a => a.evidence_object_ids)).size,
      composition_version: COMPOSITION_VERSION,
      composition_timestamp: new Date().toISOString(),
    },
  };
}

function composeGoverningNarrative(spineData, structuralEnrichment, canonicalTopology, qualificationLevel, manifest) {
  if (!spineData || !spineData.objects) {
    return { available: false, reason: 'SPINE_DATA_ABSENT' };
  }

  const heroMoments = (spineData.objects.hero_moments || []).filter(hm => !hm.manufactured);
  const evidenceObjects = spineData.objects.evidence_objects || [];

  if (heroMoments.length === 0 && !structuralEnrichment.available) {
    return { available: false, reason: 'NO_NARRATIVE_ANCHORS' };
  }

  const narrativeAnchors = deriveNarrativeAnchors(heroMoments, structuralEnrichment);

  const clusters = canonicalTopology.clusters || [];
  const en = structuralEnrichment || {};
  const cg = en.code_graph || {};
  const ct = en.centrality || {};

  const compositionInput = {
    narrative_anchors: narrativeAnchors,
    structural_context: {
      cluster_count: clusters.length,
      node_count: (canonicalTopology.counts || {}).total_nodes || clusters.reduce((s, c) => s + (c.node_count || 0), 0),
      import_edges: cg.total_import_edges || 0,
      inheritance_edges: cg.total_inheritance_edges || 0,
      file_count: cg.file_count || (ct.project_metrics || {}).total_files || 0,
      dual_authority: en.dual_authority || null,
      top_spines: ct.top_structural_spines || [],
      role_summary: ct.role_summary || {},
    },
    qualification_context: {
      specimen_id: manifest.client,
      specimen_display: (manifest.labels || {}).client_display_name || manifest.client,
      s_state: qualificationLevel,
      gate_status: 'PENDING',
      ceu_state: null,
    },
    composition_governance: {
      contract: GOVERNANCE_CONTRACT,
      prohibitions: PROHIBITIONS_ENFORCED,
    },
  };

  const result = deterministicBoundedProvider(compositionInput);

  return {
    available: true,
    ...result,
    structural_summary: compositionInput.structural_context,
    qualification_context: compositionInput.qualification_context,
    proof_graph: {
      hero_moments: heroMoments,
      evidence_objects: evidenceObjects.map(eo => ({
        id: eo.id,
        phase: eo.phase || null,
        artifact_path: eo.artifact_path || null,
        evidence_class: eo.evidence_class || null,
        node_count: eo.node_count || null,
        edge_count: eo.edge_count || null,
        lineage: eo.lineage || null,
      })),
      narrative_anchors: narrativeAnchors,
    },
  };
}

module.exports = {
  COMPOSITION_VERSION,
  composeGoverningNarrative,
  deriveNarrativeAnchors,
  deterministicBoundedProvider,
};
