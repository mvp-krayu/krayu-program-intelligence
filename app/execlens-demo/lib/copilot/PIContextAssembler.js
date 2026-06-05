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
const { routeIntent, classifyIntent, resolveEvidenceClass } = require('./topic-router');

const CONTEXT_TOKEN_BUDGET = 16000;
const CHARS_PER_TOKEN = 4;

const BOOT_CONTEXT_PATH = path.join(__dirname, 'pi-boot-context.md');
const CAPABILITY_CONTEXT_PATH = path.join(__dirname, 'pi-capability-context.md');

let cachedBootContext = null;
let cachedCapabilityContext = null;

function loadBootContext() {
  if (cachedBootContext) return cachedBootContext;
  try {
    cachedBootContext = require('fs').readFileSync(BOOT_CONTEXT_PATH, 'utf-8');
  } catch {
    cachedBootContext = '[Boot context unavailable]';
  }
  return cachedBootContext;
}

function loadCapabilityContext() {
  if (cachedCapabilityContext) return cachedCapabilityContext;
  try {
    cachedCapabilityContext = require('fs').readFileSync(CAPABILITY_CONTEXT_PATH, 'utf-8');
  } catch {
    cachedCapabilityContext = null;
  }
  return cachedCapabilityContext;
}

function assembleTier1() {
  return {
    bootContext: loadBootContext(),
    capabilityContext: loadCapabilityContext(),
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
    tier2.verdict = resolveVerdict(rawSpecimen, client, runId);
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

const ACCESS_TIER = {
  CLIENT: 'client',
  OPERATOR: 'operator',
  ENGINEER: 'engineer',
};

const PERSONA_PROJECTIONS = {
  'Board of Directors': {
    decisionHorizon: 'Governance, risk, exposure, confidence, business impact',
    altitude: 'executive',
    accessTier: ACCESS_TIER.CLIENT,
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
    accessTier: ACCESS_TIER.CLIENT,
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
    accessTier: ACCESS_TIER.CLIENT,
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
    accessTier: ACCESS_TIER.OPERATOR,
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
    accessTier: ACCESS_TIER.OPERATOR,
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
    accessTier: ACCESS_TIER.OPERATOR,
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
    accessTier: ACCESS_TIER.OPERATOR,
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
    accessTier: ACCESS_TIER.OPERATOR,
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
  'Transformation Leader': {
    decisionHorizon: 'Transformation execution risk, change capacity, adoption friction, investment conversion, sequencing',
    altitude: 'strategic',
    accessTier: ACCESS_TIER.OPERATOR,
    defaultEvidence: [
      'consequence posture translated to transformation risk',
      'structural conditions as change-adoption barriers',
      'domain concentration as execution energy drain',
      'combination consequences as sequencing threats',
      'risk shapes as transformation drag profiles',
      'reinforcement flows as compounding adoption friction',
      'governance confidence as transformation oversight readiness',
    ],
    avoid: [
      'raw file paths or module names',
      'graph metrics, z-scores, or signal IDs',
      'implementation-level structural mechanics unless asked',
      'customer-sanitized language — this is an internal operator persona',
    ],
    narrativeStyle: 'Transformation execution framing. Translate every structural finding into: what does this mean for change capacity, adoption, sequencing, and investment conversion? Use language of transformation drag, execution energy, scaling friction, and portfolio-level delivery confidence. Frame structural conditions as organizational execution barriers, not technical defects.',
  },
  'GOD / Founder-Operator': {
    decisionHorizon: 'Full-stack sovereign interrogation — doctrine, product, runtime, consumer, commercial, governance, gaps, next move',
    altitude: 'sovereign',
    accessTier: ACCESS_TIER.ENGINEER,
    defaultEvidence: [
      'PI doctrine and its activation state',
      'runtime cognition chain (evidence → condition → consequence → combination → persona)',
      'consumer exposure state (what is wired, what is computed-but-hidden, what is missing)',
      'commercial demonstration readiness',
      'governance confidence boundaries',
      'remaining gaps and next highest-leverage move',
    ],
    avoid: [],
    narrativeStyle: 'Direct. Brutally honest. No customer-sanitized language. No over-technical drift unless requested. Connect every answer through the full stack: runtime → cognition → consumer → commercial value. Expose gaps explicitly. When relevant, label the cognitive layer being discussed (DOCTRINE / RUNTIME / COMPILER / ADAPTER / CONDENSER / CONSUMER / PERSONA / COMMERCIAL / GOVERNANCE). Frame answers as: what the system knows, what is exposed, what remains hidden, and what the next move is.',
    layerAwareness: true,
  },
};

function resolveAccessTier(audience) {
  const persona = PERSONA_PROJECTIONS[audience];
  if (!persona) return ACCESS_TIER.CLIENT;
  return persona.accessTier;
}

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
    `Access tier: ${persona.accessTier}`,
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

  if (persona.accessTier === ACCESS_TIER.CLIENT) {
    lines.push(
      '',
      'KNOWLEDGE BOUNDARY — CLIENT TIER:',
      'This audience receives ASSESSMENT FINDINGS only. When asked about assessment improvement or evidence quality:',
      '- State that additional evidence collection could improve confidence in specific areas',
      '- State what the current confidence envelope covers and where uncertainty remains',
      '- Do NOT expose PI processes, tools, modules, scripts, or internal capabilities',
      '- Do NOT reference compiler pipeline, signal derivation, enrichment, or capability registry',
      '- Do NOT discuss roadmap, future enhancements, or internal architecture',
      '- Do NOT mention gap classifications (EXISTS, PARTIALLY_EXISTS, GENUINELY_MISSING)',
      '- The PI Capability & Process Map is NOT available at this tier — do not reference it',
      'Assessment findings and structural evidence are the complete knowledge boundary.',
    );
  } else if (persona.accessTier === ACCESS_TIER.OPERATOR) {
    lines.push(
      '',
      'KNOWLEDGE BOUNDARY — OPERATOR TIER:',
      'This audience may interrogate PI capabilities for assessment improvement. When asked:',
      '- Map gaps to available PI processes using the PI Capability & Process Map',
      '- Use gap classification vocabulary (EXISTS / PARTIALLY_EXISTS / GENUINELY_MISSING)',
      '- Trace: Gap → PI process/tool → available now vs missing → expected output',
      '- Do NOT expose product roadmap, strategic direction, or commercial plans',
      '- Do NOT discuss compiler evolution strategy or internal architecture decisions',
      '- Do NOT reference internal backlogs, future enhancement candidates, or competitive positioning',
      '- Focus on what IS operational and what is a KNOWN GAP — not what might be built',
    );
  } else if (persona.accessTier === ACCESS_TIER.ENGINEER) {
    lines.push(
      '',
      'KNOWLEDGE BOUNDARY — ENGINEER / FOUNDER TIER:',
      'Full-stack sovereign access. No knowledge boundary restrictions.',
      '- Full PI doctrine, runtime architecture, compiler internals, consumer exposure',
      '- Product roadmap, commercial strategy, competitive positioning — all available',
      '- Gap classifications, capability registry, internal backlogs — all available',
      '- May discuss what exists, what is missing, what should be built next',
      '- May reference specific compiler functions, adapter boundaries, condenser logic',
      '- May expose where cognition is being lost, flattened, or hidden',
      '',
      'LAYER AWARENESS — include layer labels when relevant to the answer:',
      '- DOCTRINE: PI foundational principles and governance rules',
      '- RUNTIME: Pipeline execution, evidence ingestion, signal derivation',
      '- COMPILER: ConsequenceCompiler, SignalSynthesisEngine, cognition formation',
      '- ADAPTER: SoftwareIntelligenceProjectionAdapter, surface-level projection',
      '- CONDENSER: PIKnowledgeGraphAccess condensers, THORR context assembly',
      '- CONSUMER: LENS UI components, EIR chapters, report pack rendering',
      '- PERSONA: Persona projection contracts, audience-specific framing',
      '- COMMERCIAL: Demo readiness, customer-facing value, product packaging',
      '- GOVERNANCE: SQO state, qualification ceiling, confidence boundaries',
      '',
      'When answering, structure as: Layer → Finding → Why it matters → Remaining gap → Next move.',
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
    '',
    'VISIBILITY-LAYER AWARENESS: When visibility_layer_completeness is present in Verdict Data, use it to qualify structural findings. Read the verdict_scope, completeness percentage, measured layers, missing layers, and qualifier_modifier fields. Reason from the data — do not restate Q-class rationale without checking visibility completeness.',
    '',
    'EVIDENCE PRECISION — INDEX FILE QUALIFICATION:',
    'When a dependency hub, constriction point, or fragility hotspot is an index file (index.ts, index.tsx, index.js), the structural measurement is confirmed but operational interpretation requires qualification. Index files may be barrel/re-export files, facade/API boundaries, or logic-bearing modules — these carry different operational risk profiles. If the evidence data includes INDEX_FILE_UNCLASSIFIED, state that the structural signal is real but the file role classification (barrel vs facade vs logic-bearing) is not yet present in the evidence. Do not overstate operational risk from index-file centrality alone.',
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
  const accessTier = resolveAccessTier(audience);

  const topics = classifyIntent(intent);
  const evidenceClass = resolveEvidenceClass(topics, audience, intent);

  const tier1 = assembleTier1();
  const tier2 = assembleTier2(contextLevel, client, runId, producedArtifacts);
  const tier3 = assembleTier3(intent);
  const systemPrompt = assembleSystemPrompt(contextLevel, mode, audience);

  const capabilityContext = accessTier !== ACCESS_TIER.CLIENT
    ? tier1.capabilityContext
    : null;

  const specimenForPrompt = condenseSpecimenForIntent(tier2.specimen, evidenceClass);
  const needsTopology = evidenceClass === 'STRUCTURAL' || evidenceClass === 'FULL';

  return {
    contextLevel,
    accessTier,
    evidenceClass,
    client: client || null,
    runId: runId || null,
    availableDomains,

    systemPrompt,
    bootContext: tier1.bootContext,
    capabilityContext,

    specimen: specimenForPrompt,
    verdict: tier2.verdict,
    structuralTopology: needsTopology ? tier2.structuralTopology : null,
    publishingAssets: tier2.publishingAssets,

    retrievedTopics: tier3.topics,
    retrievedDocuments: tier3.documents,
  };
}

function formatContextForPrompt(assembled) {
  const budgetSections = [];

  budgetSections.push({
    id: 'boot', priority: 1,
    content: assembled.bootContext || '',
  });

  if (assembled.verdict) {
    const verdictParts = [];
    if (assembled.verdict.visibility_layer_completeness) {
      verdictParts.push('### Visibility-Layer Completeness\n');
      verdictParts.push(JSON.stringify(assembled.verdict.visibility_layer_completeness, null, 2));
    }
    if (assembled.verdict.boardroom) {
      verdictParts.push('\n### Boardroom Projection\n');
      verdictParts.push(JSON.stringify(assembled.verdict.boardroom, null, 2));
    }
    if (assembled.verdict.balanced) {
      verdictParts.push('\n### Balanced Projection\n');
      verdictParts.push(JSON.stringify(assembled.verdict.balanced, null, 2));
    }
    budgetSections.push({
      id: 'verdict', priority: 2,
      content: '\n---\n## Verdict Data\n' + verdictParts.join(''),
    });
  }

  if (assembled.specimen) {
    budgetSections.push({
      id: 'specimen', priority: 3,
      content: '\n---\n## Specimen Data\n' + formatSpecimenSummary(assembled.specimen),
    });
  }

  if (assembled.structuralTopology) {
    budgetSections.push({
      id: 'topology', priority: 4,
      content: '\n---\n## Structural Topology (L1 Specimen Evidence)\n' + formatStructuralTopology(assembled.structuralTopology),
    });
  }

  if (assembled.capabilityContext) {
    budgetSections.push({
      id: 'capability', priority: 5,
      content: '\n---\n## PI Capability & Process Map\n' + assembled.capabilityContext,
    });
  }

  if (assembled.retrievedDocuments && assembled.retrievedDocuments.length > 0) {
    const docContent = assembled.retrievedDocuments
      .map(doc => `### ${doc.path}\n\n${doc.content}\n`)
      .join('');
    budgetSections.push({
      id: 'retrieved', priority: 6,
      content: '\n---\n## Retrieved Knowledge\n' + docContent,
    });
  }

  if (assembled.publishingAssets && assembled.publishingAssets.length > 0) {
    const assetContent = assembled.publishingAssets
      .map(a => `- **${a.title}** (${a.audience}, ${a.mode}, ${a.timestamp})${a.contentPreview ? '\n  Preview: ' + a.contentPreview + '...' : ''}`)
      .join('\n');
    budgetSections.push({
      id: 'publishing', priority: 7,
      content: '\n---\n## Previously Produced Artifacts\n' + assetContent,
    });
  }

  const budgeted = enforceContextBudget(budgetSections, CONTEXT_TOKEN_BUDGET);
  return budgeted.map(s => s.content).join('\n');
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
      const roleTag = s.file_role_hint ? ` ⚠ ${s.file_role_hint}` : '';
      parts.push(`- #${s.centrality_rank} \`${s.path}\` — ${s.in_degree} inbound, ${s.out_degree} outbound${roleTag}`);
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
      const roleTag = h.file_role_hint ? ` ⚠ ${h.file_role_hint}` : '';
      parts.push(`- \`${h.path}\` — score ${h.constriction_score}, through-flow ${h.through_flow}${h.is_bridge ? ', BRIDGE' : ''}${roleTag}`);
    }
  }

  if (st.constrictionPoints?.fragility_hotspots) {
    parts.push('\n### Fragility Hotspots');
    for (const h of st.constrictionPoints.fragility_hotspots.slice(0, 5)) {
      const roleTag = h.file_role_hint ? ` ⚠ ${h.file_role_hint}` : '';
      parts.push(`- \`${h.path}\` — fragility ${h.fragility_score}, coupling ${h.coupling}, cohesion ${h.cohesion.toFixed(2)}${roleTag}`);
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

// ─── INTENT-DRIVEN SPECIMEN CONDENSER ─────────────────────────────
// Instead of dumping the full specimen (~20k tokens), select only
// the keys needed for the classified evidence class.

const SPECIMEN_KEYS_BY_EVIDENCE_CLASS = {
  POSTURE: [
    'client', 'run_id', 'qualification_level', 'topology_summary',
    'readiness_summary', 'qualifier_summary', 'evidence_summary',
    'governance_summary', 'header_block', 'narrative_block',
    'governance_verdict', 'readiness_state', 'qualifier_class',
  ],
  GOVERNANCE: [
    'client', 'run_id', 'qualification_level', 'topology_summary',
    'readiness_summary', 'qualifier_summary', 'governance_summary',
    'governance_lifecycle', 'proposition_corpus', 'constitutional_anchor',
    'revalidation_intelligence', 'governance_verdict', 'qualifier_class',
  ],
  STRUCTURAL: [
    'client', 'run_id', 'qualification_level', 'topology_summary',
    'readiness_summary', 'qualifier_summary', 'evidence_summary',
    'dpsig_signal_summary', 'signal_interpretations',
    'pressure_zone_state', 'propagation_summary',
    'semantic_domain_registry', 'semantic_cluster_registry',
    'semantic_topology_edges', 'governance_verdict', 'qualifier_class',
  ],
  DOCTRINE: [
    'client', 'run_id', 'qualification_level', 'topology_summary',
    'readiness_summary', 'qualifier_summary', 'governance_verdict',
  ],
};

function condenseSpecimenForIntent(specimen, evidenceClass) {
  if (!specimen) return null;
  if (evidenceClass === 'FULL') return specimen;

  const allowedKeys = SPECIMEN_KEYS_BY_EVIDENCE_CLASS[evidenceClass]
    || SPECIMEN_KEYS_BY_EVIDENCE_CLASS.POSTURE;
  const condensed = {};
  for (const key of allowedKeys) {
    if (specimen[key] !== undefined) {
      condensed[key] = specimen[key];
    }
  }
  return condensed;
}

// ─── CONTEXT BUDGET ENFORCEMENT ───────────────────────────────────

function enforceContextBudget(sections, budgetTokens) {
  let totalChars = sections.reduce((s, sec) => s + sec.content.length, 0);
  const budgetChars = budgetTokens * CHARS_PER_TOKEN;

  if (totalChars <= budgetChars) return sections;

  const result = [];
  const coreIds = new Set(['system', 'boot', 'verdict', 'topology']);
  const core = sections.filter(s => coreIds.has(s.id));
  const flexible = sections.filter(s => !coreIds.has(s.id));

  let coreChars = core.reduce((s, sec) => s + sec.content.length, 0);
  let remaining = budgetChars - coreChars;

  result.push(...core);

  flexible.sort((a, b) => (a.priority || 99) - (b.priority || 99));
  for (const sec of flexible) {
    if (sec.content.length <= remaining) {
      result.push(sec);
      remaining -= sec.content.length;
    } else if (remaining > 400) {
      const truncated = sec.content.slice(0, remaining - 100)
        + '\n\n[... truncated — ' + Math.round(sec.content.length / CHARS_PER_TOKEN)
        + ' tokens total, ask for detail if needed]';
      result.push({ ...sec, content: truncated });
      remaining = 0;
    }
  }

  return result;
}

module.exports = {
  assembleTier1,
  assembleTier2,
  assembleTier3,
  assembleSystemPrompt,
  assemble,
  formatContextForPrompt,
  PERSONA_PROJECTIONS,
  ACCESS_TIER,
};
