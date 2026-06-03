'use strict';

const path = require('path');
const {
  CONTEXT_LEVEL,
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
} = require('./PIKnowledgeGraphAccess');
const { routeIntent } = require('./topic-router');

const BOOT_CONTEXT_PATH = path.join(__dirname, 'pi-boot-context.md');

let cachedBootContext = null;

function loadBootContext() {
  if (cachedBootContext) return cachedBootContext;
  try {
    cachedBootContext = require('fs').readFileSync(BOOT_CONTEXT_PATH, 'utf-8');
  } catch {
    cachedBootContext = '[Boot context unavailable]';
  }
  return cachedBootContext;
}

function assembleTier1() {
  return {
    bootContext: loadBootContext(),
  };
}

function assembleTier2(contextLevel, client, runId, producedArtifacts) {
  const tier2 = {
    specimen: null,
    verdict: null,
    structuralTopology: null,
    publishingAssets: null,
  };

  if (contextLevel < CONTEXT_LEVEL.L1 || !client || !runId) {
    return tier2;
  }

  const rawSpecimen = resolveSpecimen(client, runId);
  if (!rawSpecimen) return tier2;

  tier2.specimen = stripForContext(rawSpecimen);

  if (contextLevel >= CONTEXT_LEVEL.L1) {
    tier2.structuralTopology = {
      topology: condenseSpecimenTopology(rawSpecimen),
      dependencyHub: condenseDependencyHub(rawSpecimen),
      pressureZones: condensePressureZones(rawSpecimen),
      constrictionPoints: condenseConstrictionPoints(rawSpecimen),
      structuralMass: condenseStructuralMass(rawSpecimen),
    };
  }

  if (contextLevel >= CONTEXT_LEVEL.L2) {
    tier2.verdict = resolveVerdict(rawSpecimen);
  }

  if (contextLevel >= CONTEXT_LEVEL.L3 && producedArtifacts) {
    tier2.publishingAssets = producedArtifacts.map(a => ({
      title: a.title,
      audience: a.audience,
      mode: a.mode,
      timestamp: a.timestamp,
      contentPreview: (a.content || '').slice(0, 500),
    }));
  }

  return tier2;
}

function assembleTier3(intent) {
  if (!intent) return { topics: [], documents: [] };

  const routing = routeIntent(intent);
  const documents = loadMultipleFiles(routing.files);

  return {
    topics: routing.topics,
    documents,
  };
}

const PERSONA_PROJECTIONS = {
  'Board of Directors': {
    decisionHorizon: 'Governance, risk, exposure, confidence, business impact',
    altitude: 'executive',
    defaultEvidence: [
      'posture and severity',
      'scope and confidence envelope',
      'consequence themes and business impact',
      'uncertainty and exposure',
      'governance state',
    ],
    avoid: [
      'file paths, module names, or implementation identifiers',
      'dependency counts, import edges, or graph metrics',
      'topology mechanics or structural derivation detail',
      'code-level evidence unless explicitly requested',
    ],
    narrativeStyle: 'Executive framing. Consequence-driven. Risk and governance language. No technical jargon.',
  },
  'Investor': {
    decisionHorizon: 'Asset quality, scalability, fragility, concentration risk, execution exposure',
    altitude: 'executive',
    defaultEvidence: [
      'structural quality assessment',
      'operational leverage indicators',
      'concentration themes and risk distribution',
      'confidence and uncertainty',
    ],
    avoid: [
      'file paths or module names',
      'dependency counts or graph internals',
      'implementation-level detail unless explicitly requested',
    ],
    narrativeStyle: 'Investment framing. Asset quality language. Structural risk as portfolio exposure.',
  },
  'PE Acquisition Team': {
    decisionHorizon: 'Due diligence, integration risk, technical concentration, acquisition exposure',
    altitude: 'strategic',
    defaultEvidence: [
      'topology summaries and concentration patterns',
      'dependency concentration themes',
      'structural hotspot regions (domain-level, not file-level)',
      'integration risk indicators',
    ],
    avoid: [
      'raw file paths unless asked',
      'graph metrics or z-scores',
    ],
    narrativeStyle: 'Acquisition framing. Frame all structural evidence through integration and due diligence consequences.',
  },
  'Program Director': {
    decisionHorizon: 'Program execution, planning, coordination',
    altitude: 'operational',
    defaultEvidence: [
      'pressure zones and their anchor domains',
      'convergence regions',
      'dependency concentrations',
      'planning implications and execution exposure',
    ],
    avoid: [
      'raw file paths unless specifically useful for planning',
    ],
    narrativeStyle: 'Program execution language. Pressure, coordination, and delivery framing. May descend beyond verdict level when relevant.',
  },
  'Release Train Engineer (RTE)': {
    decisionHorizon: 'Flow, delivery coordination, dependency management',
    altitude: 'operational',
    defaultEvidence: [
      'bottlenecks and flow constrictions',
      'coordination load indicators',
      'dependency pressure between domains',
      'delivery exposure and execution constrictions',
    ],
    avoid: [
      'file-level evidence by default',
      'raw graph metrics',
    ],
    narrativeStyle: 'Flow language. Translate structural evidence into delivery and coordination terms. Bottleneck, throughput, and dependency framing.',
  },
  'Engineering Director': {
    decisionHorizon: 'Organizational execution, team impact, delivery capacity',
    altitude: 'operational',
    defaultEvidence: [
      'hotspot regions and fragility concentrations',
      'delivery impact indicators',
      'structural load distribution',
      'domain-level topology when useful',
    ],
    avoid: [
      'excessive file-level detail unless asked',
    ],
    narrativeStyle: 'Organizational execution framing. Structural evidence translated into team and delivery impact.',
  },
  'CTO / VP Engineering': {
    decisionHorizon: 'Technical strategy, architectural direction',
    altitude: 'structural',
    defaultEvidence: [
      'dependency hubs and their structural role',
      'pressure zones with anchor detail',
      'topology summaries and cluster structure',
      'concentration mechanisms and structural mass',
      'L1 specimen evidence may be used by default',
    ],
    avoid: [],
    narrativeStyle: 'Technical strategy framing. Structural mechanics are appropriate. Evidence depth should support architectural decision-making.',
  },
  'Chief Architect': {
    decisionHorizon: 'Structural design, architectural integrity',
    altitude: 'structural',
    defaultEvidence: [
      'file paths, clusters, bridges, constrictions',
      'full topology and graph evidence',
      'centrality, fragility, cohesion metrics',
      'pressure zone internals and signal traceability',
      'full specimen descent permitted',
    ],
    avoid: [],
    narrativeStyle: 'Structural design language. Full evidence depth. Graph mechanics, file-level detail, and derivation traceability are expected.',
  },
};

function resolvePersonaProjection(audience) {
  const persona = PERSONA_PROJECTIONS[audience];
  if (!persona) {
    return [`Target audience: ${audience}. Adapt language, depth, and framing for this audience.`];
  }

  const lines = [
    `PERSONA PROJECTION CONTRACT — ${audience}`,
    '',
    `Decision horizon: ${persona.decisionHorizon}`,
    `Projection altitude: ${persona.altitude}`,
    `Narrative style: ${persona.narrativeStyle}`,
    '',
    'Default evidence to project:',
    ...persona.defaultEvidence.map(e => `- ${e}`),
  ];

  if (persona.avoid.length > 0) {
    lines.push(
      '',
      'AVOID in output (unless operator explicitly requests deeper evidence):',
      ...persona.avoid.map(a => `- ${a}`),
    );
  }

  lines.push(
    '',
    'PROJECTION RULE: The same structural truth must be projected through the decision-making lens of this persona. All evidence remains available to you for derivation — but what you surface in the response must match the persona\'s decision horizon. Question + Persona + Intent determines depth, not question alone.',
  );

  return lines;
}

function assembleSystemPrompt(contextLevel, mode, audience) {
  const levelDescriptions = {
    [CONTEXT_LEVEL.L0]: 'Level 0 — Doctrine, commercial, vault, and runtime knowledge available. No specimen loaded.',
    [CONTEXT_LEVEL.L1]: 'Level 1 — Specimen loaded. Topology, signals, findings, and qualification state available.',
    [CONTEXT_LEVEL.L2]: 'Level 2 — Verdict generated. Full structural assessment with posture, findings, and governed narrative available.',
    [CONTEXT_LEVEL.L3]: 'Level 3 — Publishing assets available. Previously generated consumption artifacts can be refined.',
  };

  const parts = [
    'You are the PI Co-Pilot — the universal intelligence interaction surface for Program Intelligence.',
    'Your purpose is operator amplification: the operator enters with intent, you contribute knowledge + context + transformation, the outcome is an amplified operator.',
    '',
    `Current context: ${levelDescriptions[contextLevel] || levelDescriptions[CONTEXT_LEVEL.L0]}`,
    '',
    'ABSOLUTE PROHIBITIONS (non-negotiable):',
    '- Never infer team behavior, organizational intent, or human motive',
    '- Never diagnose culture, leadership quality, or management effectiveness',
    '- Never attribute findings to personnel or predict individual behavior',
    '- Never prescribe remediation or say "you should"',
    '- Never rank next actions or prioritize fixes',
    '- Never create intelligence — only interrogate, explain, curate, package',
    '- Never change findings, evidence, or qualification state',
    '- Never claim knowledge beyond your current context level',
    '- All outputs must be traceable to structural evidence',
    '',
    'CONTEXT-HONESTY: Always disclose what context level you are operating at. If asked about specimen-specific data at Level 0, say so — do not hallucinate context you do not have.',
  ];

  if (audience) {
    const projection = resolvePersonaProjection(audience);
    parts.push('', ...projection);
  }

  if (mode) {
    parts.push('', `Active mode: ${mode}. This shapes the transformation type but does not constrain the operator's intent.`);
  }

  return parts.join('\n');
}

function assemble({ client, runId, intent, mode, audience, producedArtifacts }) {
  const rawSpecimen = (client && runId) ? resolveSpecimen(client, runId) : null;
  const contextLevel = determineContextLevel(client, runId, rawSpecimen, producedArtifacts);
  const availableDomains = getAvailableDomains(contextLevel);

  const tier1 = assembleTier1();
  const tier2 = assembleTier2(contextLevel, client, runId, producedArtifacts);
  const tier3 = assembleTier3(intent);
  const systemPrompt = assembleSystemPrompt(contextLevel, mode, audience);

  return {
    contextLevel,
    client: client || null,
    runId: runId || null,
    availableDomains,

    systemPrompt,
    bootContext: tier1.bootContext,

    specimen: tier2.specimen,
    verdict: tier2.verdict,
    structuralTopology: tier2.structuralTopology,
    publishingAssets: tier2.publishingAssets,

    retrievedTopics: tier3.topics,
    retrievedDocuments: tier3.documents,
  };
}

function formatContextForPrompt(assembled) {
  const sections = [];

  sections.push(assembled.bootContext);

  if (assembled.retrievedDocuments.length > 0) {
    sections.push('\n---\n## Retrieved Knowledge\n');
    for (const doc of assembled.retrievedDocuments) {
      sections.push(`### ${doc.path}\n\n${doc.content}\n`);
    }
  }

  if (assembled.specimen) {
    sections.push('\n---\n## Specimen Data\n');
    const specimenSummary = formatSpecimenSummary(assembled.specimen);
    sections.push(specimenSummary);
  }

  if (assembled.verdict) {
    sections.push('\n---\n## Verdict Data\n');
    if (assembled.verdict.boardroom) {
      sections.push('### Boardroom Projection\n');
      sections.push(JSON.stringify(assembled.verdict.boardroom, null, 2));
    }
    if (assembled.verdict.balanced) {
      sections.push('\n### Balanced Projection\n');
      sections.push(JSON.stringify(assembled.verdict.balanced, null, 2));
    }
  }

  if (assembled.structuralTopology) {
    sections.push('\n---\n## Structural Topology (L1 Specimen Evidence)\n');
    sections.push(formatStructuralTopology(assembled.structuralTopology));
  }

  if (assembled.publishingAssets && assembled.publishingAssets.length > 0) {
    sections.push('\n---\n## Previously Produced Artifacts\n');
    for (const asset of assembled.publishingAssets) {
      sections.push(`- **${asset.title}** (${asset.audience}, ${asset.mode}, ${asset.timestamp})`);
      if (asset.contentPreview) {
        sections.push(`  Preview: ${asset.contentPreview}...`);
      }
    }
  }

  return sections.join('\n');
}

function formatStructuralTopology(st) {
  const parts = [];

  if (st.topology?.clusters) {
    parts.push('### Cluster → Domain Topology');
    for (const c of st.topology.clusters) {
      const domainList = c.domains.map(d => {
        const tag = d.structurally_backed ? '[structural]' : '[semantic-only]';
        return `  - ${d.name} ${tag}`;
      }).join('\n');
      parts.push(`\n**${c.label}** (${c.id})\n${domainList}`);
    }
  }

  if (st.topology?.edges) {
    parts.push('\n### Domain Relationships');
    for (const e of st.topology.edges) {
      parts.push(`- ${e.source} → ${e.target} (${e.type})`);
    }
  }

  if (st.dependencyHub?.spines) {
    parts.push('\n### Dependency Hubs (top structural spines by centrality)');
    for (const s of st.dependencyHub.spines) {
      parts.push(`- #${s.centrality_rank} \`${s.path}\` — ${s.in_degree} inbound, ${s.out_degree} outbound`);
    }
    if (st.dependencyHub.metrics) {
      const m = st.dependencyHub.metrics;
      parts.push(`\nProject: ${m.total_files} files, ${m.total_import_edges} import edges, density ${m.graph_density}`);
    }
  }

  if (st.pressureZones?.zones?.length > 0) {
    parts.push('\n### Pressure Zones');
    for (const z of st.pressureZones.zones) {
      parts.push(`- ${z.zone_id} [${z.zone_class}] anchored at **${z.anchor_name}** — ${z.condition_count} conditions (${z.conditions?.join(', ') || 'none'})`);
      if (z.embedded_rules?.length > 0) {
        parts.push(`  Embedded: ${z.embedded_rules.join(', ')}`);
      }
    }
  }

  if (st.pressureZones?.signals) {
    parts.push('\n### Active Signals');
    for (const s of st.pressureZones.signals) {
      parts.push(`- ${s.id} **${s.label}** — ${s.activation} (${s.value.toFixed(2)}) at ${s.primary_domain || 'system'}${s.primary_entity ? ` / ${s.primary_entity}` : ''}`);
      if (s.traceability) {
        parts.push(`  Trace: ${s.traceability.slice(0, 200)}`);
      }
    }
  }

  if (st.constrictionPoints?.constriction_hotspots) {
    parts.push('\n### Constriction Points (structural choke points)');
    for (const h of st.constrictionPoints.constriction_hotspots.slice(0, 5)) {
      parts.push(`- \`${h.path}\` — score ${h.constriction_score}, through-flow ${h.through_flow}${h.is_bridge ? ', BRIDGE' : ''}`);
    }
  }

  if (st.constrictionPoints?.fragility_hotspots) {
    parts.push('\n### Fragility Hotspots');
    for (const h of st.constrictionPoints.fragility_hotspots.slice(0, 5)) {
      parts.push(`- \`${h.path}\` — fragility ${h.fragility_score}, coupling ${h.coupling}, cohesion ${h.cohesion.toFixed(2)}`);
    }
  }

  if (st.structuralMass?.cluster_mass) {
    parts.push('\n### Structural Mass by Cluster');
    for (const c of st.structuralMass.cluster_mass) {
      parts.push(`- **${c.cluster}** — ${c.total_domains} domains, ${c.structurally_backed} structurally backed (${(c.grounding_ratio * 100).toFixed(0)}%)`);
    }
  }

  if (st.structuralMass?.code_graph) {
    const cg = st.structuralMass.code_graph;
    parts.push(`\nCode graph: ${cg.file_count} files, ${cg.total_structural_edges} structural edges, ${cg.total_classes} classes, ${cg.total_functions} functions`);
  }

  return parts.join('\n');
}

function formatSpecimenSummary(specimen) {
  const parts = [];

  if (specimen.client) parts.push(`Client: ${specimen.client}`);
  if (specimen.run_id) parts.push(`Run: ${specimen.run_id}`);

  if (specimen.topology_summary) {
    const t = specimen.topology_summary;
    parts.push(`Topology: ${t.domain_count || '?'} domains, ${t.cluster_count || '?'} clusters`);
  }

  if (specimen.readiness_summary) {
    const r = specimen.readiness_summary;
    parts.push(`Posture: ${r.posture || 'unknown'}`);
    parts.push(`Readiness band: ${r.band || 'unknown'}`);
  }

  if (specimen.qualifier_summary) {
    const q = specimen.qualifier_summary;
    parts.push(`Qualifier class: ${q.qualifier_class || 'unknown'}`);
  }

  if (specimen.evidence_summary) {
    const e = specimen.evidence_summary;
    parts.push(`Signal count: ${e.signal_count || '?'}`);
  }

  if (specimen.semantic_domain_registry) {
    const domains = Object.keys(specimen.semantic_domain_registry);
    if (domains.length > 0) {
      parts.push(`Domains: ${domains.join(', ')}`);
    }
  }

  return parts.join('\n');
}

module.exports = {
  assembleTier1,
  assembleTier2,
  assembleTier3,
  assembleSystemPrompt,
  assemble,
  formatContextForPrompt,
};
