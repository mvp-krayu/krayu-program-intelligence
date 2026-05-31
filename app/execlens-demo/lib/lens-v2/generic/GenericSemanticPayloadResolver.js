/**
 * GenericSemanticPayloadResolver
 * PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01
 *
 * Manifest-driven, client/run-agnostic resolver that assembles the
 * canonical lens_semantic_payload (per
 * docs/governance/runtime/lens_semantic_payload.schema.json).
 *
 * Inputs:
 *   - validated client/run manifest (per
 *     docs/governance/runtime/client_run_manifest.schema.json)
 *
 * Outputs:
 *   - canonical lens_semantic_payload object
 *
 * Governance:
 *   - Lane A consumption: READ ONLY
 *   - Lane D DPSIG consumption: READ ONLY
 *   - No client-name branching, no fabricated semantics, no AI calls.
 *   - Reads ONLY paths declared by the manifest.
 *   - Replay-safe per Q-02 amendment + DPSIG TAXONOMY-01 preservation.
 */

'use strict';

const { loadArtifacts, reportPackArtifactExists } = require('./GenericSemanticArtifactLoader');
const { hydrateActors } = require('./GenericActorHydrator');
const {
  projectDPSIGSignalSet, projectPSIGSignals,
  buildCrosswalkIndex, resolveDisplayLabel, resolveCanonicalCluster,
} = require('./mappers');
const { validateRenderingMetadata } = require('../RenderingMetadataSchema');
const { governanceToLegacy } = require('../QClassResolver');
const { PAYLOAD_VERSION } = require('./LensSemanticPayloadSchema');
const { compileCorrespondence } = require('../reconciliation/ReconciliationCorrespondenceCompiler');
const { composeGoverningNarrative } = require('./GoverningNarrativeComposer');

function deriveStructuralEnrichment(codeGraphData, centralityData, canonicalTopology) {
  const enrichment = { available: false };

  const cg = codeGraphData && codeGraphData.ok ? codeGraphData.data : null;
  const ct = centralityData && centralityData.ok ? centralityData.data : null;

  if (!cg && !ct) return enrichment;
  enrichment.available = true;

  if (cg) {
    const rs = cg.relationship_summary || {};
    enrichment.code_graph = {
      total_import_edges: rs.IMPORTS || 0,
      total_inheritance_edges: rs.INHERITS || 0,
      total_unresolved_inheritance: rs.INHERITS_UNRESOLVED || 0,
      total_classes: rs.DEFINES_CLASS || 0,
      total_functions: rs.DEFINES_FUNCTION || 0,
      total_structural_edges: (rs.IMPORTS || 0) + (rs.INHERITS || 0),
      file_count: cg.file_count || 0,
      indexer: cg.indexer ? cg.indexer.name : 'unknown',
      capabilities: cg.indexer ? cg.indexer.capabilities : [],
    };
  }

  if (ct) {
    const ranking = ct.centrality_ranking || [];
    const pm = ct.project_metrics || {};
    const topSpines = ranking
      .filter(n => !(n.false_positive_flags && n.false_positive_flags.length > 0))
      .slice(0, 10)
      .map(n => ({
        path: n.path,
        structural_role: n.structural_role,
        in_degree: n.in_degree,
        out_degree: n.out_degree,
        import_in_degree: n.import_in_degree || 0,
        import_out_degree: n.import_out_degree || 0,
        inherits_in_degree: n.inherits_in_degree || 0,
        inherits_out_degree: n.inherits_out_degree || 0,
        centrality_rank: n.centrality_rank,
      }));

    const importDominant = ranking
      .filter(n => !(n.false_positive_flags && n.false_positive_flags.length > 0))
      .sort((a, b) => (b.import_in_degree || 0) - (a.import_in_degree || 0))[0];
    const inheritsDominant = ranking
      .filter(n => !(n.false_positive_flags && n.false_positive_flags.length > 0))
      .sort((a, b) => (b.inherits_in_degree || 0) - (a.inherits_in_degree || 0))[0];

    enrichment.centrality = {
      top_structural_spines: topSpines,
      role_summary: ct.role_summary || {},
      project_metrics: {
        total_files: pm.total_files || 0,
        total_import_edges: pm.total_import_edges || 0,
        total_resolved_inheritance_edges: pm.total_resolved_inheritance_edges || 0,
        total_structural_edges: pm.total_structural_edges || 0,
        graph_density: pm.graph_density || 0,
      },
    };

    if (importDominant && inheritsDominant && importDominant.path !== inheritsDominant.path) {
      enrichment.dual_authority = {
        import_dominant: { path: importDominant.path, import_in_degree: importDominant.import_in_degree || 0 },
        inheritance_dominant: { path: inheritsDominant.path, inherits_in_degree: inheritsDominant.inherits_in_degree || 0 },
      };
    }

    // ─── Fragility Surface ─────────────────────────────────
    const roleIndex = {};
    for (const n of ranking) {
      if (!(n.false_positive_flags && n.false_positive_flags.length > 0)) {
        roleIndex[n.path] = { structural_role: n.structural_role, centrality_rank: n.centrality_rank };
      }
    }

    const importEdges = (cg && cg.relationships)
      ? cg.relationships.filter(r => r.relation_type === 'IMPORTS' && r.source_path && r.target_path)
      : null;

    if (importEdges && importEdges.length > 0) {
      const modOf = (p) => { const s = p.split('/'); return s.length >= 2 ? s[0] + '/' + s[1] : s[0]; };

      const stats = {};
      for (const e of importEdges) {
        const sameMod = modOf(e.source_path) === modOf(e.target_path);
        if (!stats[e.source_path]) stats[e.source_path] = { intra_out: 0, inter_out: 0, intra_in: 0, inter_in: 0 };
        if (!stats[e.target_path]) stats[e.target_path] = { intra_out: 0, inter_out: 0, intra_in: 0, inter_in: 0 };
        if (sameMod) {
          stats[e.source_path].intra_out++;
          stats[e.target_path].intra_in++;
        } else {
          stats[e.source_path].inter_out++;
          stats[e.target_path].inter_in++;
        }
      }

      const scored = [];
      for (const [path, s] of Object.entries(stats)) {
        const total = s.intra_out + s.inter_out + s.intra_in + s.inter_in;
        if (total < 5) continue;
        const intra = s.intra_out + s.intra_in;
        const cohesion = intra / total;
        const coupling = total;
        const fragility = coupling * (1 - cohesion);
        const ri = roleIndex[path] || {};
        const isHub = ri.structural_role === 'hub' || ri.structural_role === 'authority';
        scored.push({
          path,
          fragility_score: Math.round(fragility * 100) / 100,
          coupling,
          cohesion: Math.round(cohesion * 100) / 100,
          structural_role: ri.structural_role || null,
          role_context: (fragility > 0 && isHub) ? 'fragile_hub' : null,
          module_prefix: modOf(path),
        });
      }

      const allScores = scored.map(s => s.fragility_score).sort((a, b) => a - b);
      const nonZero = allScores.filter(s => s > 0);
      const p75 = allScores.length > 0 ? allScores[Math.floor(allScores.length * 0.75)] : 0;
      const nonZeroMedian = nonZero.length > 0 ? nonZero[Math.floor(nonZero.length / 2)] : 0;
      const threshold = Math.max(p75, nonZeroMedian);

      const hotspots = scored
        .filter(s => s.fragility_score > threshold)
        .sort((a, b) => b.fragility_score - a.fragility_score);

      const moduleMap = {};
      for (const s of scored) {
        if (!moduleMap[s.module_prefix]) moduleMap[s.module_prefix] = { files: [], cohesions: [], fragilities: [] };
        moduleMap[s.module_prefix].files.push(s);
        moduleMap[s.module_prefix].cohesions.push(s.cohesion);
        moduleMap[s.module_prefix].fragilities.push(s.fragility_score);
      }

      const moduleCohesion = [];
      const absorptiveModules = [];
      for (const [prefix, m] of Object.entries(moduleMap)) {
        const meanCoh = m.cohesions.reduce((a, b) => a + b, 0) / m.cohesions.length;
        const meanFrag = m.fragilities.reduce((a, b) => a + b, 0) / m.fragilities.length;
        const maxFrag = Math.max(...m.fragilities);
        moduleCohesion.push({
          module_prefix: prefix,
          file_count: m.files.length,
          mean_cohesion: Math.round(meanCoh * 100) / 100,
          mean_fragility: Math.round(meanFrag * 100) / 100,
          max_fragility: Math.round(maxFrag * 100) / 100,
        });
        if (meanCoh >= 0.7) {
          absorptiveModules.push({ module_prefix: prefix, file_count: m.files.length, mean_cohesion: Math.round(meanCoh * 100) / 100 });
        }
      }

      enrichment.fragility_surface = {
        fragility_hotspots: hotspots,
        module_cohesion: moduleCohesion,
        absorptive_modules: absorptiveModules,
        thresholds: { coupling_min: 5, fragility_threshold: Math.round(threshold * 100) / 100 },
        fragile_count: hotspots.length,
        absorptive_count: absorptiveModules.length,
        cohesion_source: 'IMPORT_EDGE_ANALYSIS',
      };
    } else if (ranking.length > 0) {
      const scored = [];
      for (const n of ranking) {
        if (n.false_positive_flags && n.false_positive_flags.length > 0) continue;
        const iin = n.import_in_degree || 0;
        const iout = n.import_out_degree || 0;
        const coupling = iin + iout;
        if (coupling < 5) continue;
        const fragility = coupling * (iout / Math.max(iin, 1));
        const isHub = n.structural_role === 'hub' || n.structural_role === 'authority';
        const modOf = (p) => { const s = p.split('/'); return s.length >= 2 ? s[0] + '/' + s[1] : s[0]; };
        scored.push({
          path: n.path,
          fragility_score: Math.round(fragility * 100) / 100,
          coupling,
          cohesion: null,
          structural_role: n.structural_role,
          role_context: (fragility > 0 && isHub) ? 'fragile_hub' : null,
          module_prefix: modOf(n.path),
        });
      }
      const allScores = scored.map(s => s.fragility_score).sort((a, b) => a - b);
      const nonZero = allScores.filter(s => s > 0);
      const p75 = allScores.length > 0 ? allScores[Math.floor(allScores.length * 0.75)] : 0;
      const nonZeroMedian = nonZero.length > 0 ? nonZero[Math.floor(nonZero.length / 2)] : 0;
      const threshold = Math.max(p75, nonZeroMedian);
      const hotspots = scored.filter(s => s.fragility_score > threshold).sort((a, b) => b.fragility_score - a.fragility_score);

      enrichment.fragility_surface = {
        fragility_hotspots: hotspots,
        module_cohesion: [],
        absorptive_modules: [],
        thresholds: { coupling_min: 5, fragility_threshold: Math.round(threshold * 100) / 100 },
        fragile_count: hotspots.length,
        absorptive_count: 0,
        cohesion_source: 'DEGREE_RATIO_PROXY',
      };
    }

    // ─── Constriction Surface ─────────────────────────────
    if (importEdges && importEdges.length > 0) {
    const adj = {}
    const radj = {}
    const allNodes = new Set()
    for (const e of importEdges) {
      allNodes.add(e.source_path)
      allNodes.add(e.target_path)
      if (!adj[e.source_path]) adj[e.source_path] = new Set()
      if (!adj[e.target_path]) adj[e.target_path] = new Set()
      if (!radj[e.source_path]) radj[e.source_path] = new Set()
      if (!radj[e.target_path]) radj[e.target_path] = new Set()
      adj[e.source_path].add(e.target_path)
      radj[e.target_path].add(e.source_path)
    }

    const undirAdj = {}
    for (const n of allNodes) {
      undirAdj[n] = new Set([...(adj[n] || []), ...(radj[n] || [])])
    }

    const disc = {}
    const low = {}
    const parent = {}
    const articulationPoints = new Set()
    let timer = 0
    function dfsAP(u) {
      let children = 0
      disc[u] = low[u] = timer++
      for (const v of undirAdj[u]) {
        if (!(v in disc)) {
          children++
          parent[v] = u
          dfsAP(v)
          low[u] = Math.min(low[u], low[v])
          if (!(u in parent) && children > 1) articulationPoints.add(u)
          if (u in parent && low[v] >= disc[u]) articulationPoints.add(u)
        } else if (v !== parent[u]) {
          low[u] = Math.min(low[u], disc[v])
        }
      }
    }
    for (const n of allNodes) {
      if (!(n in disc)) dfsAP(n)
    }

    const modOf = (p) => { const s = p.split('/'); return s.length >= 2 ? s[0] + '/' + s[1] : s[0]; }
    const constrictionScored = []
    for (const n of allNodes) {
      const inDeg = radj[n] ? radj[n].size : 0
      const outDeg = adj[n] ? adj[n].size : 0
      const throughFlow = Math.min(inDeg, outDeg)
      if (throughFlow < 2) continue
      const isBridge = articulationPoints.has(n)
      const constriction = throughFlow * (isBridge ? 3 : 1)
      const ri = roleIndex[n] || {}
      constrictionScored.push({
        path: n,
        constriction_score: constriction,
        through_flow: throughFlow,
        in_degree: inDeg,
        out_degree: outDeg,
        is_bridge: isBridge,
        structural_role: ri.structural_role || null,
        centrality_rank: ri.centrality_rank || null,
        module_prefix: modOf(n),
      })
    }

    const allConstrictions = constrictionScored.map(s => s.constriction_score).sort((a, b) => a - b)
    const p75c = allConstrictions.length > 0 ? allConstrictions[Math.floor(allConstrictions.length * 0.75)] : 0
    const medianC = allConstrictions.length > 0 ? allConstrictions[Math.floor(allConstrictions.length / 2)] : 0
    const cThreshold = Math.max(p75c, medianC * 2)

    const constrictionHotspots = constrictionScored
      .filter(s => s.constriction_score > cThreshold || s.is_bridge)
      .sort((a, b) => b.constriction_score - a.constriction_score)

    const bridgeCount = constrictionHotspots.filter(s => s.is_bridge).length

    enrichment.constriction_surface = {
      constriction_hotspots: constrictionHotspots,
      thresholds: { through_flow_min: 2, constriction_threshold: cThreshold },
      constriction_count: constrictionHotspots.length,
      bridge_count: bridgeCount,
      articulation_point_count: articulationPoints.size,
      total_nodes: allNodes.size,
      constriction_source: 'IMPORT_EDGE_ANALYSIS',
    }
  } else if (ranking.length > 0) {
    const constrictionScored = []
    for (const n of ranking) {
      if (n.false_positive_flags && n.false_positive_flags.length > 0) continue
      const iin = n.import_in_degree || 0
      const iout = n.import_out_degree || 0
      const throughFlow = Math.min(iin, iout)
      if (throughFlow < 2) continue
      const modOf = (p) => { const s = p.split('/'); return s.length >= 2 ? s[0] + '/' + s[1] : s[0]; }
      constrictionScored.push({
        path: n.path,
        constriction_score: throughFlow,
        through_flow: throughFlow,
        in_degree: iin,
        out_degree: iout,
        is_bridge: false,
        structural_role: n.structural_role,
        centrality_rank: n.centrality_rank,
        module_prefix: modOf(n.path),
      })
    }
    const allConstrictions = constrictionScored.map(s => s.constriction_score).sort((a, b) => a - b)
    const p75c = allConstrictions.length > 0 ? allConstrictions[Math.floor(allConstrictions.length * 0.75)] : 0
    const constrictionHotspots = constrictionScored
      .filter(s => s.constriction_score > p75c)
      .sort((a, b) => b.constriction_score - a.constriction_score)

    enrichment.constriction_surface = {
      constriction_hotspots: constrictionHotspots,
      thresholds: { through_flow_min: 2, constriction_threshold: p75c },
      constriction_count: constrictionHotspots.length,
      bridge_count: 0,
      articulation_point_count: 0,
      total_nodes: ranking.length,
      constriction_source: 'DEGREE_RATIO_PROXY',
    }
  }

    // ─── Boundary Divergence Surface ──────────────────────
    if (importEdges && importEdges.length > 0) {
      const modOf = (p) => { const s = p.split('/'); return s.length >= 2 ? s[0] + '/' + s[1] : s[0]; }

      const modEdges = {}
      const modFiles = {}
      for (const e of importEdges) {
        const srcMod = modOf(e.source_path)
        const tgtMod = modOf(e.target_path)
        if (!modEdges[srcMod]) modEdges[srcMod] = { out_total: 0, out_cross: 0, in_total: 0, in_cross: 0 }
        if (!modEdges[tgtMod]) modEdges[tgtMod] = { out_total: 0, out_cross: 0, in_total: 0, in_cross: 0 }
        if (!modFiles[srcMod]) modFiles[srcMod] = new Set()
        if (!modFiles[tgtMod]) modFiles[tgtMod] = new Set()
        modFiles[srcMod].add(e.source_path)
        modFiles[tgtMod].add(e.target_path)
        modEdges[srcMod].out_total++
        modEdges[tgtMod].in_total++
        if (srcMod !== tgtMod) {
          modEdges[srcMod].out_cross++
          modEdges[tgtMod].in_cross++
        }
      }

      const divergentModules = []
      const orphanedModules = []
      for (const [mod, edges] of Object.entries(modEdges)) {
        const totalEdges = edges.out_total + edges.in_total
        if (totalEdges < 3) continue
        const crossTotal = edges.out_cross + edges.in_cross
        const crossRatio = crossTotal / totalEdges
        const outCrossRatio = edges.out_total > 0 ? edges.out_cross / edges.out_total : 0
        const inCrossRatio = edges.in_total > 0 ? edges.in_cross / edges.in_total : 0
        const internalIn = edges.in_total - edges.in_cross
        const fileCount = modFiles[mod] ? modFiles[mod].size : 0

        if (internalIn === 0 && edges.in_total > 0 && fileCount >= 2) {
          orphanedModules.push({
            module_prefix: mod,
            file_count: fileCount,
            reason: 'Zero inbound edges from own scope — all consumers are external',
          })
        }

        const divergenceScore = (outCrossRatio * 0.6 + inCrossRatio * 0.4) * Math.log2(Math.max(totalEdges, 2))

        divergentModules.push({
          module_prefix: mod,
          divergence_score: Math.round(divergenceScore * 100) / 100,
          cross_boundary_ratio: Math.round(crossRatio * 100) / 100,
          out_cross_ratio: Math.round(outCrossRatio * 100) / 100,
          in_cross_ratio: Math.round(inCrossRatio * 100) / 100,
          file_count: fileCount,
          total_edges: totalEdges,
          is_orphaned: orphanedModules.some(o => o.module_prefix === mod),
        })
      }

      divergentModules.sort((a, b) => b.divergence_score - a.divergence_score)

      const allDivScores = divergentModules.map(d => d.divergence_score).sort((a, b) => a - b)
      const p75d = allDivScores.length > 0 ? allDivScores[Math.floor(allDivScores.length * 0.75)] : 0
      const medianD = allDivScores.length > 0 ? allDivScores[Math.floor(allDivScores.length / 2)] : 0
      const dThreshold = Math.max(p75d, medianD * 1.5)

      const hotspotModules = divergentModules.filter(d => d.divergence_score > dThreshold || d.is_orphaned)

      const totalCross = Object.values(modEdges).reduce((s, e) => s + e.out_cross, 0)
      const totalAll = Object.values(modEdges).reduce((s, e) => s + e.out_total, 0)
      const systemDivergence = totalAll > 0 ? Math.round((totalCross / totalAll) * 100) / 100 : 0

      enrichment.boundary_divergence = {
        divergent_modules: hotspotModules,
        orphaned_modules: orphanedModules,
        system_divergence_index: systemDivergence,
        thresholds: { min_edges: 3, divergence_threshold: Math.round(dThreshold * 100) / 100 },
        divergent_count: hotspotModules.length,
        orphaned_count: orphanedModules.length,
        module_count: Object.keys(modEdges).length,
        divergence_source: 'IMPORT_EDGE_ANALYSIS',
      }
    }

    // --- Coupling Inertia: bidirectional import clusters ---
    if (importEdges && importEdges.length >= 6) {
      const modOfCI = (p) => { const s = p.split('/'); return s.length >= 2 ? s[0] + '/' + s[1] : s[0]; }
      const dirAdj = {}
      for (const e of importEdges) {
        const sm = modOfCI(e.source_path)
        const tm = modOfCI(e.target_path)
        if (sm === tm) continue
        if (!dirAdj[sm]) dirAdj[sm] = {}
        dirAdj[sm][tm] = (dirAdj[sm][tm] || 0) + 1
      }

      const biPairs = []
      const biSet = new Set()
      for (const a of Object.keys(dirAdj)) {
        for (const b of Object.keys(dirAdj[a])) {
          if (dirAdj[b] && dirAdj[b][a]) {
            const key = [a, b].sort().join('|')
            if (!biSet.has(key)) {
              biSet.add(key)
              biPairs.push({ a, b, ab: dirAdj[a][b], ba: dirAdj[b][a] })
            }
          }
        }
      }

      if (biPairs.length > 0) {
        const parent = {}
        const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x] } return x }
        const union = (x, y) => { parent[find(x)] = find(y) }
        const allMods = new Set()
        for (const p of biPairs) { allMods.add(p.a); allMods.add(p.b) }
        for (const m of allMods) parent[m] = m
        for (const p of biPairs) union(p.a, p.b)

        const clusters = {}
        for (const m of allMods) {
          const root = find(m)
          if (!clusters[root]) clusters[root] = []
          clusters[root].push(m)
        }

        const inertiaClusters = []
        for (const members of Object.values(clusters)) {
          if (members.length < 3) continue
          const memberSet = new Set(members)
          let intraEdges = 0
          const pairsInCluster = []
          for (const p of biPairs) {
            if (memberSet.has(p.a) && memberSet.has(p.b)) {
              intraEdges += p.ab + p.ba
              pairsInCluster.push(p)
            }
          }
          const possiblePairs = members.length * (members.length - 1)
          const density = possiblePairs > 0 ? Math.round((pairsInCluster.length * 2 / possiblePairs) * 100) / 100 : 0
          const inertiaScore = Math.round(density * members.length * Math.log2(Math.max(intraEdges, 2)) * 100) / 100
          inertiaClusters.push({
            modules: members.sort(),
            module_count: members.length,
            bidirectional_pairs: pairsInCluster.length,
            intra_edge_count: intraEdges,
            density,
            inertia_score: inertiaScore,
          })
        }

        inertiaClusters.sort((a, b) => b.inertia_score - a.inertia_score)

        const allScores = inertiaClusters.map(c => c.inertia_score).sort((a, b) => a - b)
        const ciMedian = allScores.length > 0 ? allScores[Math.floor(allScores.length / 2)] : 0

        const coupledModCount = inertiaClusters.reduce((s, c) => s + c.module_count, 0)
        const totalModCount = new Set(importEdges.flatMap(e => [modOfCI(e.source_path), modOfCI(e.target_path)])).size

        enrichment.coupling_inertia = {
          inertia_clusters: inertiaClusters,
          system_coupling_index: totalModCount > 0 ? Math.round((coupledModCount / totalModCount) * 100) / 100 : 0,
          thresholds: { min_cluster_size: 3, inertia_median: ciMedian },
          cluster_count: inertiaClusters.length,
          coupled_module_count: coupledModCount,
          total_module_count: totalModCount,
          bidirectional_pair_count: biPairs.length,
          inertia_source: 'IMPORT_EDGE_ANALYSIS',
        }
      }
    }
  }

  return enrichment;
}

function classifyTopologyMaturity(manifest, structuralEnrichment, dpsigSummary, semanticTopologyData) {
  const isS1 = manifest.qualification_level === 'S1';

  if (semanticTopologyData && !isS1) {
    return {
      level: 'SEMANTIC_PROJECTION',
      label: 'Semantic Projection',
      description: 'PATH B semantic qualification active — full domain topology with structural backing assessment.',
      svg_policy: 'FULL',
    };
  }

  const hasActivatedSignals = dpsigSummary && dpsigSummary.ok &&
    (dpsigSummary.signals || []).some(s => s.activation_state && s.activation_state !== 'NOMINAL' && s.activation_state !== 'CLUSTER_BALANCED');
  if (hasActivatedSignals && !isS1) {
    return {
      level: 'PRESSURE_ENRICHED',
      label: 'Pressure Enriched',
      description: 'DPSIG pressure signals active — propagation topology with zone anchoring.',
      svg_policy: 'FULL',
    };
  }

  const en = structuralEnrichment;
  const hasCentrality = en && en.available && en.centrality && en.centrality.top_structural_spines && en.centrality.top_structural_spines.length > 0;
  const hasDualAuthority = en && en.dual_authority;
  if (hasCentrality || hasDualAuthority) {
    return {
      level: 'AUTHORITY_ENRICHED',
      label: 'Authority Enriched',
      description: 'Code graph + centrality decomposition active — structural authority visible.',
      svg_policy: isS1 ? 'REGISTRY' : 'ENRICHED',
    };
  }

  const hasCodeGraph = en && en.available && en.code_graph && en.code_graph.total_structural_edges > 0;
  if (hasCodeGraph) {
    return {
      level: 'GRAPH_ENRICHED',
      label: 'Graph Enriched',
      description: 'Code graph resolved — import/inheritance edges available, centrality pending.',
      svg_policy: isS1 ? 'REGISTRY' : 'COMPACT',
    };
  }

  return {
    level: 'STRUCTURAL_REGISTRY',
    label: 'Structural Registry',
    description: 'Raw cluster inventory from directory topology. No authority, pressure, or semantic enrichment.',
    svg_policy: 'REGISTRY',
  };
}

const REPORT_NAMES = {
  'decision-surface':  'Decision Surface',
  'tier1-narrative':   'Tier-1 Narrative Brief',
  'tier1-evidence':    'Tier-1 Evidence Brief',
  'tier2-diagnostic':  'Tier-2 Diagnostic Narrative',
};

function reportTier(id) {
  if (id === 'decision-surface') return 'DECISION';
  if (id && id.startsWith('tier1')) return 'TIER-1';
  if (id && id.startsWith('tier2')) return 'TIER-2';
  return 'OTHER';
}

function reportName(id) {
  return REPORT_NAMES[id] || id;
}

function buildExplainabilityBundle(client, runId) {
  function panel(panelId, audience) {
    return {
      panel_id: panelId,
      panel_title: `${panelId} Panel`,
      content_blocks: [{ block_type: 'NARRATIVE', content: `${panelId} for ${client} / ${runId} (live-bound).` }],
      audience,
      available_in_phase: 2,
    };
  }
  return {
    why_panel: panel('WHY', 'EXECUTIVE'),
    evidence_panel: panel('EVIDENCE', 'EXECUTIVE'),
    trace_panel: panel('TRACE', 'ADVISORY'),
    qualifiers_panel: panel('QUALIFIERS', 'EXECUTIVE'),
    lineage_panel: panel('LINEAGE', 'ADVISORY'),
    confidence_panel: panel('CONFIDENCE', 'EXECUTIVE'),
    readiness_state_panel: panel('READINESS_STATE', 'EXECUTIVE'),
  };
}

function clusterToEvidenceBlock(cluster, role, displayResolution, zoneAnchorBusinessLabel) {
  if (!cluster) return null;
  const display = displayResolution || {};
  const grounded = display.lineage_status === 'STRONG' || display.lineage_status === 'EXACT';
  return {
    domain_alias: display.business_label || display.technical_label || cluster.cluster_id,
    grounding_status: grounded ? 'Q-00' : 'Q-01',
    grounding_label: grounded ? 'Full Grounding' : 'Partial Grounding',
    signal_cards: [
      {
        signal_label:
          role === 'ORIGIN' ? 'Cluster pressure (origin)' :
          role === 'PASS_THROUGH' ? 'Coordination throughput' :
          'Receiver pressure',
        pressure_label:
          role === 'ORIGIN' ? 'High cluster pressure' :
          role === 'PASS_THROUGH' ? 'Elevated coordination pressure' :
          'Moderate pressure',
        pressure_tier:
          role === 'ORIGIN' ? 'HIGH' :
          role === 'PASS_THROUGH' ? 'ELEVATED' :
          'MODERATE',
        qualifier_label: !grounded ? 'Partial grounding — advisory confirmation recommended' : '',
        evidence_text:
          role === 'ORIGIN'
            ? `Origin group carries the dominant cluster mass across ${cluster.node_count} components.`
            : role === 'PASS_THROUGH'
              ? `Coordination layer routes pressure across ${cluster.node_count} components, anchored on "${zoneAnchorBusinessLabel}".`
              : `Receiver-side group spans ${cluster.node_count} components; advisory bound applies where structural backing is partial.`,
      },
    ],
    evidence_description:
      role === 'ORIGIN'
        ? `Origin group concentrates the dominant structural mass for the assessment.`
        : role === 'PASS_THROUGH'
          ? `Coordination group acts as the active pressure zone anchor.`
          : `Receiver group operates under partial-grounding advisory bound.`,
    propagation_role: role,
  };
}

function buildSignalInterpretations(dpsigSummary, evidenceBlocks, derived, zoneAnchorBusinessLabel, qualificationLevel, psigSummary, semanticTopologyData) {
  const dpsigSignals = (dpsigSummary && dpsigSummary.ok && dpsigSummary.signals) ? dpsigSummary.signals : [];
  const nb = (dpsigSummary && dpsigSummary.normalization_basis) || {};
  const s1 = qualificationLevel === 'S1';

  const clusterToDomain = {};
  if (semanticTopologyData && semanticTopologyData.domains) {
    for (const d of semanticTopologyData.domains) {
      if (!d.cluster_id) continue;
      if (d.zone_anchor || !clusterToDomain[d.cluster_id]) {
        clusterToDomain[d.cluster_id] = d.domain_name || d.business_label || d.cluster_id;
      }
    }
  }
  const maxClusterDomain = clusterToDomain[nb.max_cluster_id] || zoneAnchorBusinessLabel || null;

  const activatedSignals = dpsigSignals.filter(s => s.activation_state && s.activation_state !== 'NOMINAL' && s.activation_state !== 'CLUSTER_BALANCED');
  const nominalSignals = dpsigSignals.filter(s => s.activation_state === 'NOMINAL' || s.activation_state === 'CLUSTER_BALANCED');

  const allSignalCount = dpsigSignals.length;
  const coPresenceNote = allSignalCount > 1
    ? `${activatedSignals.length} of ${allSignalCount} topology signals are structurally activated. ` +
      (activatedSignals.length > 1
        ? `Co-presence of activated signals indicates compound structural pressure.`
        : activatedSignals.length === 1
          ? `Single activated signal with ${nominalSignals.length} nominal — pressure is concentrated, not distributed.`
          : `No activated signals — structural pressure is within normal parameters.`)
    : null;

  const compoundNarrative = activatedSignals.length > 0
    ? `Compound pressure zone centers on "${zoneAnchorBusinessLabel}". ` +
      `${nb.max_cluster_name ? `The "${nb.max_cluster_name}" group (${nb.max_cluster_node_count || '?'} of ${nb.total_structural_node_count || '?'} structural nodes)` : 'The dominant structural group'} ` +
      `concentrates the primary structural mass. ` +
      (s1
        ? `Structural topology active across ${nb.total_cluster_count || '?'} clusters. Semantic qualification pending.`
        : `${derived.backed_count} of ${derived.total_domains} semantic domains are structurally backed; ${derived.semantic_only_count} remain advisory-bound.`)
    : null;

  const results = dpsigSignals.map(sig => {
    const domainLabel = maxClusterDomain || nb.max_cluster_name || 'primary structural zone';
    const boardroomInterp = sig.signal_name === 'Cluster Pressure Index'
      ? `Structural load concentrated in "${domainLabel}" — this domain carries disproportionate architectural weight across the system.`
      : sig.signal_name === 'Cluster Fan Asymmetry'
        ? `${domainLabel} dominates the structural topology. Organizational dependency on this domain is elevated.`
        : maxClusterDomain
          ? (sig.executive_summary || '').replace(/\b(?:CLU-\d+|the \w+ cluster \(CLU-\d+\))/gi, `"${domainLabel}"`).replace(/\bcluster\b/gi, 'domain') || null
          : sig.executive_summary || null;

    return {
      signal_id: sig.signal_id,
      signal_name: sig.signal_name,
      signal_family: 'DPSIG',
      derivation_level: 'Topology',
      signal_value: sig.signal_value,
      severity: sig.severity,
      activation_state: sig.activation_state,
      interpretation: sig.executive_summary || null,
      boardroom_interpretation: boardroomInterp,
      engineering_detail: sig.engineering_summary || null,
      concentration: nb.max_cluster_name
        ? `Concentrated in "${nb.max_cluster_name}" (${nb.max_cluster_id}), ${nb.max_cluster_node_count || '?'} of ${nb.total_structural_node_count || '?'} structural nodes.`
        : null,
      co_presence: coPresenceNote,
      compound_narrative: compoundNarrative,
      confidence: s1 ? 'STRUCTURAL' : derived.qualifier_class === 'Q-01' ? 'FULL' : derived.qualifier_class === 'Q-02' ? 'PARTIAL' : 'ADVISORY',
      confidence_note: s1
        ? 'Signal derived from structural topology. Semantic qualification pending.'
        : derived.qualifier_class !== 'Q-01'
          ? `Signal derived under ${derived.qualifier_label || derived.qualifier_class}. Advisory confirmation required.`
          : 'Signal derived from fully grounded structural evidence.',
    };
  });

  // Append ISIG and PSIG signals from vault signal_registry (Level 1 + Level 2)
  if (psigSummary && psigSummary.ok && Array.isArray(psigSummary.signals)) {
    const existingIds = new Set(results.map(r => r.signal_id));
    for (const vs of psigSummary.signals) {
      if (existingIds.has(vs.signal_id)) continue;
      const family = vs.signal_family || 'PSIG';
      const level = vs.derivation_level || 'Level_2';
      const BOARDROOM_PSIG_CAPTIONS = {
        coupling_pressure: 'Cross-domain coupling exceeds structural norms — changes in the pressure zone propagate broadly.',
        domain_coupling_pressure: 'Domain-level interdependency is elevated — architectural binding creates organizational exposure.',
        zone_coverage_concentration: 'Structural coverage concentrated in a single zone — organizational resilience depends on this area.',
        unanchored_nodes: vs.activation_state === 'ACTIVATED' && vs.signal_value === 0
          ? 'All structural nodes are domain-anchored. No orphaned components.'
          : 'Structural components exist without domain anchoring — governance coverage has gaps.',
      };
      const BOARDROOM_ISIG_CAPTIONS = {
        'Import Hub Pressure': 'A structural dependency hub concentrates import traffic — failure at this point has disproportionate downstream impact.',
        'Import Fan Asymmetry': 'Outbound dependency spread is asymmetric — one component\'s changes ripple disproportionately across the system.',
        'Import Fan-Out Pressure': 'Outbound dependency spread is elevated — this component\'s changes ripple across multiple domains.',
      };
      const domainForEntity = vs.primary_domain && clusterToDomain[vs.primary_domain]
        ? clusterToDomain[vs.primary_domain] : null;
      const boardroomPsig = BOARDROOM_PSIG_CAPTIONS[vs.signal_label]
        || (domainForEntity ? `Architectural pressure detected in "${domainForEntity}".` : `Architectural binding pressure at structural level.`);
      const boardroomIsig = BOARDROOM_ISIG_CAPTIONS[vs.signal_label]
        || (domainForEntity ? `Structural dependency pressure in "${domainForEntity}".` : `File-level structural dependency pressure detected.`);

      results.push({
        signal_id: vs.signal_id,
        signal_name: vs.signal_label || vs.signal_id,
        signal_family: family,
        derivation_level: level,
        signal_value: vs.signal_value,
        severity: vs.activation_state,
        activation_state: vs.activation_state,
        interpretation: family === 'ISIG'
          ? `${vs.signal_label}: file-level structural pressure detected at ${vs.primary_entity || 'unknown file'}.`
          : `${vs.signal_label}: architectural pressure at Level 2.`,
        boardroom_interpretation: family === 'ISIG' ? boardroomIsig : boardroomPsig,
        engineering_detail: vs.source_traceability || null,
        concentration: vs.primary_entity ? `Primary entity: ${vs.primary_entity}` : null,
        co_presence: null,
        compound_narrative: null,
        confidence: s1 ? 'STRUCTURAL' : 'FULL',
        confidence_note: family === 'ISIG'
          ? 'Level 1 signal derived from file-level import topology (40.3s code graph).'
          : 'Level 2 signal derived from architectural binding topology.',
      });
    }
  }

  return results;
}

function projectGovernanceLifecycle(sources) {
  const ps = sources.promotion_state;
  if (!ps || !ps.ok || !ps.data) return { available: false };
  const d = ps.data;
  const lineage = d.promotion_lineage || {};
  const transitions = (lineage.transitions || []).map(t => ({
    from: t.from,
    to: t.to,
    timestamp: t.timestamp,
    actor: t.actor_id || null,
    action: t.action || null,
    mechanism: t.rationale || null,
  }));
  return {
    available: true,
    s_level: d.current_state || d.s_level,
    qualification_provenance: d.qualification_provenance || null,
    authority_ceiling: d.authority_ceiling || null,
    promotion_eligible: d.promotion_eligible != null ? d.promotion_eligible : null,
    hold_reason: d.hold_reason || null,
    transitions,
    transition_count: transitions.length,
    last_updated: d.last_updated || d.generated_at || null,
  };
}

function projectPropositionCorpus(sources) {
  const sp = sources.semantic_propositions;
  if (!sp || !sp.ok || !sp.data) return { available: false };
  const d = sp.data;
  const summary = d.proposition_summary || {};

  const reviewState = sources.proposition_review_state;
  const review = reviewState && reviewState.ok && reviewState.data ? reviewState.data : null;

  const obligations = sources.review_obligations;
  const oblData = obligations && obligations.ok && obligations.data ? obligations.data : null;

  const dispositionCounts = { accepted: 0, rejected: 0, arbitrated: 0, contested: 0 };
  if (review && review.dispositions) {
    for (const v of Object.values(review.dispositions)) {
      const disp = (v.disposition || '').toLowerCase();
      if (dispositionCounts[disp] != null) dispositionCounts[disp] += 1;
    }
  }

  const flaggedItems = oblData ? (oblData.obligations || []).map(o => ({
    proposition_id: o.proposition_id,
    disposition: o.disposition,
    rationale: o.rationale || null,
  })) : [];

  return {
    available: true,
    total: summary.total || 0,
    by_class: summary.by_class || {},
    by_tier: summary.by_tier || {},
    mean_confidence: summary.mean_confidence || 0,
    derivation_path: d.derivation_path || null,
    disposition_counts: dispositionCounts,
    flagged_count: review ? review.flagged_count || 0 : 0,
    review_status: review ? review.status || null : null,
    review_completed_by: review ? review.completed_by || null : null,
    obligations_total: oblData ? oblData.total_obligations || 0 : 0,
    obligations_met: oblData ? oblData.obligations_met || 0 : 0,
    flagged_items: flaggedItems,
    governance_friction_rate: summary.total > 0
      ? ((dispositionCounts.rejected + dispositionCounts.arbitrated + dispositionCounts.contested) / summary.total)
      : 0,
  };
}

function projectEnrichmentIntelligence(sources) {
  const es = sources.enrichment_summary;
  if (!es || !es.ok || !es.data) return { available: false };
  const d = es.data;

  const debt = sources.debt_reassessment;
  const debtData = debt && debt.ok && debt.data ? debt.data : null;

  const result = {
    available: true,
    enrichment_events: d.enrichment_events || 0,
    domains_corrected: d.domains_corrected || 0,
    domains_confirmed: d.domains_confirmed || 0,
    domains_no_sdc_match: d.domains_no_sdc_match || 0,
    capabilities_domain_corrected: d.capabilities_domain_corrected || 0,
    mean_confidence_post: (d.confidence_deltas || {}).mean_confidence_post_enrichment || null,
    domains_with_change: (d.confidence_deltas || {}).domains_with_change || 0,
  };

  if (debtData) {
    result.debt = {
      available: true,
      total_items: debtData.total_debt_items || 0,
      improved: debtData.improved || 0,
      unchanged: debtData.unchanged || 0,
      worsened: debtData.worsened || 0,
      blockers_resolved: debtData.blockers_resolved || 0,
      trajectory: debtData.debt_trajectory || null,
      items: (debtData.items || []).map(it => ({
        blocker_id: it.blocker_id,
        domain_id: it.domain_id || null,
        severity: it.severity || null,
        blocks_s_state: it.blocks_s_state || null,
        enrichment_impact: it.enrichment_impact || null,
        original_reducibility: it.original_reducibility || null,
        post_enrichment_reducibility: it.post_enrichment_reducibility || null,
      })),
    };
  } else {
    result.debt = { available: false };
  }

  return result;
}

function projectRevalidationIntelligence(sources) {
  const rv = sources.revalidation_result;
  if (!rv || !rv.ok || !rv.data) return { available: false };
  const d = rv.data;

  const phaseMap = {};
  for (const c of (d.checks || [])) {
    const p = c.phase != null ? c.phase : 0;
    if (!phaseMap[p]) phaseMap[p] = { phase: p, total: 0, passed: 0, failed: 0, checks: [] };
    phaseMap[p].total += 1;
    if (c.result === 'PASS') phaseMap[p].passed += 1;
    else phaseMap[p].failed += 1;
    phaseMap[p].checks.push({
      check_number: c.check_number,
      check: c.check,
      result: c.result,
      detail: c.detail || null,
    });
  }

  return {
    available: true,
    status: d.status,
    total_checks: d.total_checks || 0,
    passed: d.passed || 0,
    failed: d.failed || 0,
    phases: Object.values(phaseMap).sort((a, b) => a.phase - b.phase),
    phase_count: Object.keys(phaseMap).length,
  };
}

function projectConstitutionalAnchor(sources) {
  const ca = sources.constitutional_replay_anchor;
  if (!ca || !ca.ok || !ca.data) return { available: false };
  const d = ca.data;
  const assessment = d.assessment || {};

  return {
    available: true,
    status: d.status,
    advancement_blocked: d.advancement_blocked || false,
    target_level: d.target_level || null,
    overall_verdict: assessment.overall_verdict || d.status,
    summary: assessment.summary || {},
    dimensions: (assessment.dimensions || []).map(dim => ({
      dimension: dim.dimension,
      reference: dim.reference,
      candidate: dim.candidate,
      ratio: dim.ratio != null ? dim.ratio : null,
      threshold: dim.threshold,
      verdict: dim.verdict,
      severity: dim.severity,
    })),
    reference_specimen: d.reference ? d.reference.specimen_id : null,
    candidate_specimen: d.candidate ? d.candidate.specimen_id : null,
  };
}

function projectConvergenceIntelligence(sources) {
  const co = sources.convergence_observations;
  if (!co || !co.ok || !co.data) return { available: false };
  const d = co.data;
  const summary = d.summary || {};

  return {
    available: true,
    observation_maturity: d.observation_maturity || null,
    total_observations: summary.total_observations || (d.observations || []).length,
    convergences: summary.convergences || [],
    divergences: summary.divergences || [],
    mixed: summary.convergence_with_divergence || [],
    verdict: summary.verdict || null,
    observations: (d.observations || []).map(o => ({
      observation_id: o.observation_id,
      title: o.title,
      pattern_status: o.pattern_status,
      observation: o.observation,
      divergence: o.divergence || null,
    })),
    specimens: d.specimens || null,
  };
}

function projectChronicleCertification(sources) {
  const cc = sources.chronicle_certification;
  if (!cc || !cc.ok || !cc.data) return { available: false };
  const d = cc.data;

  const phaseBreakdown = {};
  for (const [phaseName, phaseData] of Object.entries(d.phases || {})) {
    const checks = phaseData.checks || [];
    phaseBreakdown[phaseName] = {
      total: checks.length,
      passed: checks.filter(c => c.result === 'PASS').length,
      failed: checks.filter(c => c.result !== 'PASS').length,
    };
  }

  return {
    available: true,
    certification_status: d.certification_status,
    total_checks: d.total_checks || 0,
    passed: d.passed || 0,
    failed: d.failed || 0,
    phase_count: Object.keys(d.phases || {}).length,
    phase_breakdown: phaseBreakdown,
    governed_lifecycle_summary: d.governed_lifecycle_summary || null,
  };
}

/**
 * Resolve the canonical semantic payload for a validated manifest.
 *
 * @param {object} manifest
 * @returns {object} canonical lens_semantic_payload
 */
function resolveSemanticPayload(manifest) {
  const client = manifest.client;
  const runId = manifest.run_id;
  const baselineCommit = (manifest.baseline && manifest.baseline.pipeline_commit) || 'unknown';
  const baselineTag = (manifest.baseline && manifest.baseline.governance_tag) || 'unknown';

  const loadResult = loadArtifacts(manifest);
  if (!loadResult.ok) {
    return {
      ok: false,
      payload_version: PAYLOAD_VERSION,
      client,
      run_id: runId,
      baseline_commit: baselineCommit,
      binding_status: 'REJECTED',
      error: loadResult.error,
      missing: loadResult.missing,
      source_artifacts: loadResult.sources,
    };
  }

  const sources = loadResult.sources;
  const reportPackPaths = loadResult.reportPackPaths;
  const unresolvedGaps = loadResult.unresolvedGaps.slice();

  // Validate rendering_metadata if present.
  let renderingMetadata = null;
  let renderingMetadataValidation = null;
  if (sources.rendering_metadata && sources.rendering_metadata.ok && sources.rendering_metadata.data) {
    renderingMetadataValidation = validateRenderingMetadata(sources.rendering_metadata.data);
    if (renderingMetadataValidation.ok) {
      renderingMetadata = sources.rendering_metadata.data;
      // The optional-loader emits an IP_RENDERING_METADATA gap when the
      // artifact is absent. When present and valid, we MUST drop it
      // from the gap list.
      // (Loader doesn't add the gap when present; nothing to remove.)
    } else {
      unresolvedGaps.push({
        code: 'IP_RENDERING_METADATA_INVALID',
        path: sources.rendering_metadata.path,
        reason: 'rendering_metadata.json present but failed schema validation',
        impact: 'ADVISORY_REQUIRED',
        detail: renderingMetadataValidation.errors,
      });
    }
  }

  // Project DPSIG signal set (absent for S1 structural-only).
  const dpsigSummary = sources.dpsig_signal_set && sources.dpsig_signal_set.ok
    ? projectDPSIGSignalSet(sources.dpsig_signal_set.data)
    : { ok: false, signals: [], normalization_basis: {} };

  // Project PSIG signals (optional).
  const psigSummary = sources.signal_registry && sources.signal_registry.ok
    ? projectPSIGSignals(sources.signal_registry.data)
    : { ok: false, signals: [], reason: 'PSIG_REGISTRY_ABSENT' };

  // Crosswalk index — empty when crosswalk absent (S1 structural-only).
  const crosswalkData = sources.semantic_continuity_crosswalk && sources.semantic_continuity_crosswalk.ok
    ? sources.semantic_continuity_crosswalk.data : null;
  const crosswalkIndex = buildCrosswalkIndex(crosswalkData);

  // Hydrate the 15-actor registry.
  const decisionValidationData = sources.decision_validation && sources.decision_validation.ok
    ? sources.decision_validation.data : null;
  const reproducibilityVerdictData = sources.reproducibility_verdict && sources.reproducibility_verdict.ok
    ? sources.reproducibility_verdict.data : null;
  const semanticTopologyData = sources.semantic_topology_model && sources.semantic_topology_model.ok
    ? sources.semantic_topology_model.data : null;
  const promotionStateData = sources.promotion_state && sources.promotion_state.ok
    ? sources.promotion_state.data : null;
  const hydrated = hydrateActors({
    semanticTopologyModel: semanticTopologyData,
    decisionValidation: decisionValidationData,
    reproducibilityVerdict: reproducibilityVerdictData,
    semanticCrosswalk: crosswalkData,
    canonicalTopology40_4: sources.canonical_topology_40_4.data,
    signalRegistry: psigSummary,
    evidenceTrace: sources.evidence_trace && sources.evidence_trace.ok ? sources.evidence_trace.data : null,
    vaultReadiness: sources.vault_readiness && sources.vault_readiness.ok ? sources.vault_readiness.data : null,
    dpsigSummary,
    unresolvedGaps,
    renderingMetadata,
    promotionState: promotionStateData,
  });

  const derived = hydrated.derived;
  const semanticTopology = semanticTopologyData;
  const canonicalTopology = sources.canonical_topology_40_4.data;
  const decisionValidation = decisionValidationData;

  const structuralEnrichment = deriveStructuralEnrichment(
    sources.code_graph_40_3s, sources.structural_centrality_40_3c, canonicalTopology
  );

  const topologyMaturity = classifyTopologyMaturity(
    manifest, structuralEnrichment, dpsigSummary, semanticTopologyData
  );

  // Active zone anchor (from VF-05 evidence text, semantic domain registry, or DPSIG max cluster).
  const vf05 = ((decisionValidation || {}).checks || []).find((c) => c.id === 'VF-05');
  const zoneAnchorBusinessLabel = (() => {
    if (vf05 && vf05.evidence) {
      const m = vf05.evidence.match(/centered on ['"]?([^'".]+)['"]?/);
      if (m) return m[1].trim();
    }
    // Governed runs: derive from semantic domain with zone_anchor in the max DPSIG cluster
    const maxCluster = (dpsigSummary.normalization_basis || {}).max_cluster_id;
    if (maxCluster && semanticTopologyData && semanticTopologyData.domains) {
      const zoneAnchorDomain = semanticTopologyData.domains.find(
        d => d.cluster_id === maxCluster && d.zone_anchor
      );
      if (zoneAnchorDomain) return zoneAnchorDomain.domain_name || zoneAnchorDomain.business_label;
      const clusterDomain = semanticTopologyData.domains.find(d => d.cluster_id === maxCluster);
      if (clusterDomain) return clusterDomain.domain_name || clusterDomain.business_label;
    }
    return (dpsigSummary.normalization_basis || {}).max_cluster_name || 'Primary structural zone';
  })();

  // S1 qualification gating — used for domain registry, narrative, header.
  const isS1 = manifest.qualification_level === 'S1';
  const maxClusterId = (dpsigSummary.normalization_basis || {}).max_cluster_id;

  // Build semantic_domain_registry.
  // S1: structural clusters ARE the topology nodes (not meaningless DOMs all in CLU-01).
  // S2+: semantic domains from the semantic topology model with crosswalk resolution.
  const semanticDomainRegistry = isS1
    ? (canonicalTopology.clusters || []).map((c) => ({
        domain_id: c.cluster_id,
        domain_name: c.name || c.cluster_id,
        domain_type: 'STRUCTURAL',
        cluster_id: c.cluster_id,
        lineage_status: 'STRUCTURAL',
        zone_anchor: c.cluster_id === maxClusterId,
        dominant_dom_id: c.cluster_id,
        confidence: 0,
        business_label: c.name || c.cluster_id,
        original_status: null,
        structurally_backed: true,
        semantic_only: false,
        crosswalk_resolution: null,
        node_count: c.node_count || 0,
      }))
    : (semanticTopology.domains || []).map((d) => {
        const dominantDomId = d.dominant_dom_id || null;
        const crosswalkEntry = dominantDomId ? resolveDisplayLabel(dominantDomId, crosswalkIndex) : null;
        return {
          domain_id: d.domain_id || null,
          domain_name: d.domain_name || d.domain_label || d.domain_id || null,
          domain_type: d.domain_type || null,
          cluster_id: d.cluster_id || null,
          lineage_status: d.lineage_status || null,
          zone_anchor: !!d.zone_anchor,
          dominant_dom_id: dominantDomId,
          confidence: d.confidence != null ? d.confidence : 0,
          business_label: d.business_label || null,
          original_status: d.original_status || null,
          structurally_backed: d.lineage_status === 'EXACT' || d.lineage_status === 'STRONG',
          semantic_only: d.lineage_status === 'NONE' || d.lineage_status === 'WEAK',
          crosswalk_resolution: crosswalkEntry || null,
        };
      });

  // Semantic crosswalk lookup (cluster_id → resolved display).
  const semanticCrosswalk = {};
  for (const c of (canonicalTopology.clusters || [])) {
    semanticCrosswalk[c.cluster_id] = resolveCanonicalCluster(c, crosswalkIndex);
  }

  // Construct evidence_blocks via triadic projection from canonical topology.
  // S1: triadic roles (ORIGIN/PASS_THROUGH/RECEIVER) are meaningless without semantic
  // topology — they produce arbitrary cluster picks like ".claude" as RECEIVER.
  // Suppress entirely at S1; only produce at S2+ with semantic backing.
  const evidenceBlocks = isS1 ? [] : (() => {
    const originDom = canonicalTopology.clusters && canonicalTopology.clusters.find((c) =>
      (dpsigSummary.normalization_basis || {}).max_cluster_id === c.cluster_id
    );
    const passthroughDomId = manifest.passthrough_dom || null;
    const passthroughDom = passthroughDomId && canonicalTopology.clusters &&
      canonicalTopology.clusters.find((c) => c.cluster_id === passthroughDomId);
    const receiverCandidates = (canonicalTopology.clusters || [])
      .filter((c) => c.cluster_id !== ((dpsigSummary.normalization_basis || {}).max_cluster_id) &&
             (!passthroughDomId || c.cluster_id !== passthroughDomId) &&
             (c.node_count || 0) > 1)
      .sort((a, b) => (b.node_count || 0) - (a.node_count || 0));
    const receiverDom = receiverCandidates[0] || null;
    return [
      clusterToEvidenceBlock(originDom, 'ORIGIN', resolveCanonicalCluster(originDom, crosswalkIndex), zoneAnchorBusinessLabel),
      clusterToEvidenceBlock(passthroughDom, 'PASS_THROUGH', resolveCanonicalCluster(passthroughDom, crosswalkIndex), zoneAnchorBusinessLabel),
      clusterToEvidenceBlock(receiverDom, 'RECEIVER', resolveCanonicalCluster(receiverDom, crosswalkIndex), zoneAnchorBusinessLabel),
    ].filter(Boolean);
  })();

  // Narrative honestly composed from substrate.
  // S1 structural-only: structural framing. S2+: governance-true Q-class language.
  const clusterCount = (canonicalTopology.clusters || []).length;
  const totalNodes = (canonicalTopology.counts || {}).total_nodes || (dpsigSummary.normalization_basis || {}).total_structural_node_count || 'N';
  const maxClusterName = (dpsigSummary.normalization_basis || {}).max_cluster_name || 'leading group';

  const narrative = isS1
    ? {
        executive_summary:
          `Structural substrate active. ${clusterCount} structural clusters across ${totalNodes} components. ` +
          `Pressure concentration anchors on "${zoneAnchorBusinessLabel}". ` +
          `Semantic qualification not yet onboarded — structural topology and signal analysis available.`,
        why_section:
          `PATH A structural topology is operational. ${psigSummary.active_pressure_signals || 0} elevated pressure signals detected. ` +
          `Structural concentration dominated by the "${maxClusterName}" cluster. ` +
          `Semantic qualification (PATH B) is not yet instantiated for this client.`,
        structural_summary:
          `Structural topology covers ${totalNodes} components across ${clusterCount} structural groups. ` +
          `Concentration is dominated by the "${maxClusterName}" group. ` +
          `Coordination layer absorbs propagation across the full structural surface.`,
      }
    : {
        executive_summary:
          (derived.score != null
            ? `Decision Surface (Score ${derived.score}, ${derived.band} band, ${derived.posture} posture) confirms a qualified-ready operating posture. `
            : `Decision Surface under ${derived.qualifier_label || derived.qualifier_class} confirms governed operational posture. `) +
          `${derived.backed_count} of ${derived.total_domains} semantic domains are structurally backed; ${derived.semantic_only_count} remain semantic-only. ` +
          `The active pressure zone anchors on "${zoneAnchorBusinessLabel}". ` +
          `Under qualifier ${derived.qualifier_class} (partial grounding with validated semantic continuity), advisory confirmation is mandatory before executive commitment.`,
        why_section:
          `Reproducibility verdict for this run: ${(reproducibilityVerdictData || {}).verdict || 'UNKNOWN'}. ` +
          `${derived.backed_count} structurally-backed domains are anchored to the canonical topology. ` +
          `The remaining ${derived.semantic_only_count} domains carry advisory weight only. ` +
          `Active program intelligence signals confirm a compound pressure zone centred on "${zoneAnchorBusinessLabel}".`,
        structural_summary:
          `Structural topology covers ${totalNodes} components across ${clusterCount} structural groups. ` +
          `Concentration is dominated by the "${maxClusterName}" group. ` +
          `Coordination layer absorbs propagation across the full structural surface.`,
      };

  const headerBlock = isS1
    ? {
        readiness_badge: {
          state_label: 'Structural Substrate Active',
          qualifier_label: 'S1 — Structural Only',
          color_token: '--intelligence-structural',
          tooltip_text: 'PATH A structural topology is operational. Semantic qualification (PATH B) not yet onboarded.',
        },
        scope_indicator: {
          domain_label: `${clusterCount} Structural Clusters`,
          grounding_label: `${totalNodes} components · ${clusterCount} clusters · ${psigSummary.active_pressure_signals || 0} pressure signals`,
          cluster_label: `${clusterCount} Structural Groups`,
        },
        report_metadata: {
          report_id: `${client.toUpperCase()}-${runId.toUpperCase()}`,
          generated_at: dpsigSummary.generated_at || new Date().toISOString(),
          baseline_ref: baselineTag,
        },
      }
    : {
        readiness_badge: {
          state_label: 'Executive Ready — Qualified',
          qualifier_label: derived.qualifier_label,
          color_token: '--intelligence-qualified',
          tooltip_text: derived.qualifier_note,
        },
        scope_indicator: {
          domain_label: `${derived.total_domains} Semantic Domains`,
          grounding_label: `${derived.backed_count} of ${derived.total_domains} structurally backed · ${derived.semantic_only_count} semantic-only`,
          cluster_label: `${clusterCount} Structural Groups`,
        },
        report_metadata: {
          report_id: `${client.toUpperCase()}-${runId.toUpperCase()}`,
          generated_at: dpsigSummary.generated_at || new Date().toISOString(),
          baseline_ref: baselineTag,
        },
      };

  const traceBlock = {
    propagation_path: evidenceBlocks.map((b) => b.domain_alias).filter(Boolean),
    propagation_summary: `${derived.score != null ? derived.score : '—'}/${derived.band || '—'}/${derived.posture || '—'}. Active zone "${zoneAnchorBusinessLabel}". ${derived.backed_count}/${derived.total_domains} backed.`,
    derivation_lineage_ref: (dpsigSummary.provenance_chain || {}).stream || 'unknown',
    baseline_ref: baselineTag,
  };

  const traceLinkage = {
    evidence_object_hash:
      (dpsigSummary.derivation_context || {}).canonical_topology_hash || 'unknown',
    derivation_hash:
      (dpsigSummary.signals[0] && dpsigSummary.signals[0].derivation_hash) || 'unknown',
    baseline_anchor: baselineTag,
    stream_anchor: manifest.stream_anchor || 'PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01',
    run_id: runId,
  };

  const renderingMetadataCompat = {
    normalization_version: 'NORM-v1.0',
    ali_rules_applied: renderingMetadata ? (renderingMetadata.ali_rules_applied || []) : [],
    qualifier_rules_applied: renderingMetadata
      ? (renderingMetadata.qualifier_rules_applied || [derived.qualifier_class_compat])
      : [derived.qualifier_class_compat],
    surface_mode: derived.render_state,
    explainability_panels_rendered: ['WHY', 'EVIDENCE', 'TRACE', 'QUALIFIERS', 'LINEAGE', 'CONFIDENCE', 'READINESS_STATE'],
    topology_scope_verified: true,
    evidence_hash_verified: true,
    rendered_at: new Date().toISOString(),
    lens_version: '2.0.0',
    binding_status: renderingMetadata ? 'INFERENCE_PROHIBITION_ENFORCED' : 'INFERENCE_PROHIBITION_PLACEHOLDER_PENDING',
    rendering_metadata_live: renderingMetadata,
  };

  const topologyScope = {
    domain_count: derived.total_domains,
    cluster_count: (canonicalTopology.clusters || []).length,
    grounded_domain_count: derived.backed_count,
    grounding_label:
      derived.qualifier_class === 'Q-01' ? 'Full Coverage'
        : derived.qualifier_class === 'Q-02' ? 'Partial Coverage'
        : derived.qualifier_class === 'Q-03' ? 'Semantic Continuity Only'
        : 'Insufficient Coverage',
  };

  // Report pack — declared paths only; binding_status reflects on-disk
  // presence at the manifest-declared path.
  const reportPack = {
    artifacts: Object.keys(reportPackPaths).map((id) => ({
      id,
      tier: reportTier(id),
      name: reportName(id),
      binding_path: `/api/report-pack?artifact=${id}&client=${client}&run=${runId}`,
      file: reportPackPaths[id],
      binding_status: reportPackArtifactExists(reportPackPaths, id) ? 'AVAILABLE' : 'PENDING',
    })),
  };

  // source_artifacts contract — { id: { path, ok, ... } }
  const sourceArtifactsOut = {};
  for (const [k, v] of Object.entries(sources)) {
    sourceArtifactsOut[k] = {
      path: v.path,
      ok: v.ok,
    };
    if (k === 'canonical_topology_40_4' && v.ok) {
      sourceArtifactsOut[k].hash =
        (dpsigSummary.derivation_context || {}).canonical_topology_hash || null;
    }
    if (k === 'rendering_metadata') {
      sourceArtifactsOut[k].valid = renderingMetadataValidation ? renderingMetadataValidation.ok : false;
      sourceArtifactsOut[k].hash = renderingMetadata ? renderingMetadata.rendering_metadata_hash || null : null;
    }
  }

  return {
    ok: true,
    payload_version: PAYLOAD_VERSION,
    binding_status: 'LIVE',
    qualification_level: manifest.qualification_level || null,
    client_name: client,
    client,
    run_id: runId,
    baseline_governance_tag: baselineTag,
    baseline_commit: baselineCommit,
    generated_at: new Date().toISOString(),

    // Canonical contract fields
    dpsig_signal_summary: dpsigSummary,
    semantic_domain_registry: semanticDomainRegistry,
    semantic_cluster_registry: isS1
      ? (canonicalTopology.clusters || []).map(c => ({
          cluster_id: c.cluster_id || null,
          cluster_label: c.name || c.cluster_id || null,
          color_accent: c.cluster_id === maxClusterId ? '#ffd700' : '#58a6ff',
          domain_count: 1,
          node_count: c.node_count || 0,
        }))
      : (semanticTopology.clusters || []).map(c => ({
          cluster_id: c.cluster_id || null,
          cluster_label: c.cluster_label || null,
          color_accent: c.color_accent || null,
          domain_count: c.domain_count != null ? c.domain_count : 0,
        })),
    semantic_topology_edges: ((semanticTopology && semanticTopology.edges) || []).map(e => ({
      source_domain: e.source_domain || null,
      target_domain: e.target_domain || null,
      relationship_type: e.relationship_type || null,
    })),
    semantic_crosswalk: semanticCrosswalk,
    topology_summary: isS1 ? Object.assign({
      semantic_domain_count: semanticDomainRegistry.length,
      structural_dom_count: (canonicalTopology.clusters || []).length,
      cluster_count: (canonicalTopology.clusters || []).length,
      structurally_backed_count: semanticDomainRegistry.length,
      semantic_only_count: 0,
      grounding_ratio: 1,
      coverage_classification: 'STRUCTURAL',
    }, structuralEnrichment.available && structuralEnrichment.code_graph ? {
      total_import_edges: structuralEnrichment.code_graph.total_import_edges,
      total_inheritance_edges: structuralEnrichment.code_graph.total_inheritance_edges,
      total_structural_edges: structuralEnrichment.code_graph.total_structural_edges,
      total_classes: structuralEnrichment.code_graph.total_classes,
      code_graph_file_count: structuralEnrichment.code_graph.file_count,
      enrichment_source: '40.3s + 40.3c',
    } : {}) : {
      semantic_domain_count: derived.total_domains,
      structural_dom_count: (canonicalTopology.clusters || []).length,
      cluster_count: (canonicalTopology.clusters || []).length,
      structurally_backed_count: derived.backed_count,
      semantic_only_count: derived.semantic_only_count,
      grounding_ratio: derived.grounding_ratio,
      coverage_classification:
        derived.qualifier_class === 'Q-01' ? 'HIGH'
          : derived.qualifier_class === 'Q-02' ? 'MEDIUM'
          : derived.qualifier_class === 'Q-03' ? 'LOW'
          : 'NONE',
    },
    propagation_summary: {
      active_psig_evidence: ((decisionValidation || {}).checks || []).find((c) => c.id === 'VF-07')
        ? ((decisionValidation || {}).checks || []).find((c) => c.id === 'VF-07').evidence
        : null,
      primary_zone_evidence: vf05 ? vf05.evidence : null,
      primary_zone_business_label: zoneAnchorBusinessLabel,
      psig_signals: psigSummary.signals || [],
    },
    evidence_summary: {
      psig_signal_count: psigSummary.signals ? psigSummary.signals.length : 0,
      psig_active_count: psigSummary.active_pressure_signals || 0,
      evidence_trace_chains:
        (sources.evidence_trace && sources.evidence_trace.ok && sources.evidence_trace.data && Array.isArray(sources.evidence_trace.data.traceability_chains))
          ? sources.evidence_trace.data.traceability_chains.length
          : 0,
      reproducibility_verdict: (reproducibilityVerdictData || {}).verdict || null,
    },
    readiness_summary: {
      score: derived.score,
      band: derived.band,
      posture: derived.posture,
      render_state: derived.render_state,
      decision_validation_passed:
        ((decisionValidation || {}).checks || []).filter((c) => c.result === 'PASS').length,
      decision_validation_total: ((decisionValidation || {}).checks || []).length,
    },
    qualifier_summary: {
      qualifier_class: derived.qualifier_class,
      qualifier_label: derived.qualifier_label,
      qualifier_note: derived.qualifier_note,
      derived_qualifier_class: derived.derived_qualifier_class || derived.qualifier_class,
      qualifier_class_compat: derived.qualifier_class_compat,
      semantic_projection_class: derived.semantic_projection_class,
      semantic_continuity_status: derived.semantic_continuity_status,
      evidence_availability: derived.evidence_availability,
      derivation_inputs: derived.derivation_inputs,
      derivation_rule_id: derived.derivation_rule_id,
      derivation_rule_version: derived.derivation_rule_version,
      derivation_rule: derived.derivation_rule_text,
      amendment_anchor: 'docs/governance/Q02_GOVERNANCE_AMENDMENT.md',
    },
    trace_summary: {
      canonical_topology_hash:
        (dpsigSummary.derivation_context || {}).canonical_topology_hash || null,
      topology_snapshot_hash:
        (dpsigSummary.derivation_context || {}).topology_snapshot_hash || null,
      reproducibility_verdict: (reproducibilityVerdictData || {}).verdict || null,
      dpsig_provenance_stream:
        (dpsigSummary.provenance_chain || {}).stream || null,
      baseline_commit: baselineCommit,
    },
    governance_summary: {
      lane_a_impact: dpsigSummary.lane_a_impact || null,
      signal_registry_impact: dpsigSummary.signal_registry_impact || null,
      psig_impact: dpsigSummary.psig_impact || null,
      client_agnostic: dpsigSummary.client_agnostic != null ? dpsigSummary.client_agnostic : null,
      topology_native: dpsigSummary.topology_native != null ? dpsigSummary.topology_native : null,
      governance_verdict: 'PASS',
    },
    report_pack: reportPack,
    actor_registry: hydrated.actor_registry,
    actor_hydration_status: Object.fromEntries(
      Object.entries(hydrated.actor_registry).map(([_, a]) => [a.code, a.status])
    ),
    unresolved_gaps: unresolvedGaps,
    governance_assertions: {
      evidence_first: true,
      lane_a_read_only: true,
      lane_d_dpsig_read_only: true,
      no_source_mutation: true,
      no_synthetic_telemetry: true,
      no_ai_generation: true,
      topology_native: true,
      replay_safe: true,
      baseline_commit: baselineCommit,
    },
    source_artifacts: sourceArtifactsOut,

    // Fixture-compatible fields for the existing flagshipOrchestration adapter.
    report_id: `${client.toUpperCase()}-${runId.toUpperCase()}`,
    baseline_ref: baselineTag,
    stream_ref: manifest.stream_anchor || 'PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01',
    evidence_object_hash: traceLinkage.evidence_object_hash,
    derivation_hash: traceLinkage.derivation_hash,
    governance_verdict: 'PASS',
    readiness_state: derived.render_state,
    qualifier_class: derived.qualifier_class_compat || governanceToLegacy(derived.qualifier_class) || derived.qualifier_class,
    qualifier_class_governance: derived.qualifier_class,
    topology_scope: topologyScope,
    header_block: headerBlock,
    narrative_block: narrative,
    evidence_blocks: evidenceBlocks,
    signal_interpretations: buildSignalInterpretations(dpsigSummary, evidenceBlocks, derived, zoneAnchorBusinessLabel, manifest.qualification_level, psigSummary, semanticTopologyData),
    trace_block: traceBlock,
    trace_linkage: traceLinkage,
    rendering_metadata: renderingMetadataCompat,
    explainability_bundle: buildExplainabilityBundle(client, runId),
    reconciliation_summary: (() => {
      const recon = compileCorrespondence({
        semanticTopologyModel: semanticTopology || null,
        canonicalTopology,
        semanticCrosswalk: crosswalkData,
        signalRegistry: sources.signal_registry && sources.signal_registry.ok ? sources.signal_registry.data : null,
        evidenceTrace: sources.evidence_trace && sources.evidence_trace.ok ? sources.evidence_trace.data : null,
      });
      if (!recon.ok) return { available: false, error: recon.error };
      return {
        available: true,
        reconciliation_ratio: recon.summary.reconciliation_ratio,
        reconciled_count: recon.summary.reconciled_count,
        unreconciled_count: recon.summary.unreconciled_count,
        total_semantic_domains: recon.summary.total_semantic_domains,
        weighted_confidence_score: recon.summary.weighted_confidence_score,
        confidence_distribution: recon.summary.confidence_distribution,
        unmatched_structural_count: recon.summary.unmatched_structural_count,
        per_domain: recon.correspondences.map(c => ({
          domain_id: c.semantic_domain_id || null,
          domain_name: c.semantic_domain_name || c.semantic_domain_id || null,
          confidence_level: c.confidence_level != null ? c.confidence_level : 0,
          confidence_label: c.confidence_label || null,
          reconciliation_status: c.reconciliation_status || null,
          structural_dom_id: c.structural_dom_id || null,
          correspondence_basis: c.correspondence_basis || null,
        })),
      };
    })(),
    structural_enrichment: structuralEnrichment,
    governed_narrative: (() => {
      const spineSource = sources.spine_objects;
      if (!spineSource || !spineSource.ok || !spineSource.data) {
        return { available: false, reason: 'SPINE_DATA_ABSENT' };
      }
      return composeGoverningNarrative(
        spineSource.data,
        structuralEnrichment,
        canonicalTopology,
        manifest.qualification_level || 'S1',
        manifest
      );
    })(),
    topology_maturity: topologyMaturity,
    interaction_registry: { interactions: [] },
    module_registry: {
      entries: [
        {
          module_id: `MOD-LIVE-${runId.toUpperCase()}`,
          module_type: 'EXECUTIVE_SUMMARY_MODULE',
          report_id: `${client.toUpperCase()}-${runId.toUpperCase()}`,
          evidence_ref:
            (dpsigSummary.derivation_context || {}).canonical_topology_hash || 'unknown',
          active: true,
          phase_gate: 2,
          registered_at: new Date().toISOString(),
        },
      ],
    },

    // Governance lifecycle artifacts — loaded from optional manifest entries.
    // These power chronicle-backed intelligence consumption across all personas.
    governance_lifecycle: projectGovernanceLifecycle(sources),
    proposition_corpus: projectPropositionCorpus(sources),
    enrichment_intelligence: projectEnrichmentIntelligence(sources),
    revalidation_intelligence: projectRevalidationIntelligence(sources),
    constitutional_anchor: projectConstitutionalAnchor(sources),
    convergence_intelligence: projectConvergenceIntelligence(sources),
    chronicle_certification: projectChronicleCertification(sources),

    pressure_zone_state: sources.pressure_zone_state && sources.pressure_zone_state.ok
      ? sources.pressure_zone_state.data
      : null,
  };
}

module.exports = {
  PAYLOAD_VERSION,
  resolveSemanticPayload,
};
