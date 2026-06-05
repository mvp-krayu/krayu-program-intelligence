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

  const questionType = classifyQuestionType(intent);
  let personaVerdict = tier2.verdict ? applyPersonaCognitionWeighting(tier2.verdict, audience) : null;

  if (questionType === 'RUNTIME_ONLY' && personaVerdict && personaVerdict.boardroom) {
    personaVerdict = applyRuntimeFilter(personaVerdict);
  }

  let runtimeGraphsForPrompt = null;
  if (client && runId && (needsTopology || questionType === 'RUNTIME_ONLY' || questionType === 'TOPOLOGY_GRAVITY')) {
    try {
      const { loadRuntimeGraphs, deriveRuntimeSignals } = require('../lens-v2/RuntimeSignalDerivation');
      const REPO_ROOT = require('path').resolve(__dirname, '../../../..');
      const graphs = loadRuntimeGraphs(client, runId, REPO_ROOT);
      if (graphs && Object.values(graphs).some(v => v !== null)) {
        runtimeGraphsForPrompt = { _derived_signals: deriveRuntimeSignals(graphs) };
      }
    } catch { /* runtime graphs not available */ }
  }

  return {
    contextLevel,
    accessTier,
    evidenceClass,
    questionType,
    audience: audience || null,
    client: client || null,
    runId: runId || null,
    availableDomains,

    systemPrompt,
    bootContext: tier1.bootContext,
    capabilityContext,

    specimen: specimenForPrompt,
    verdict: personaVerdict,
    structuralTopology: needsTopology ? tier2.structuralTopology : null,
    runtimeGraphs: runtimeGraphsForPrompt,
    publishingAssets: tier2.publishingAssets,

    retrievedTopics: tier3.topics,
    retrievedDocuments: tier3.documents,
  };
}

function formatContextForPrompt(assembled) {
  const budgetSections = [];
  const qt = assembled.questionType || 'GENERAL_SYNTHESIS';
  const isRuntimeOnly = qt === 'RUNTIME_ONLY';

  budgetSections.push({
    id: 'boot', priority: 1,
    content: assembled.bootContext || '',
  });

  if (assembled.verdict) {
    const verdictParts = [];

    const answerContract = renderAnswerContract(assembled.questionType, assembled.verdict, assembled.audience);
    if (answerContract) {
      verdictParts.push(answerContract + '\n');
    }

    if (assembled.verdict.architectural_findings && assembled.verdict.architectural_findings.length > 0) {
      verdictParts.push('### ARCHITECTURAL FINDINGS (highest-order cognition — address these first)\n');
      for (const af of assembled.verdict.architectural_findings) {
        verdictParts.push(af.id + ': ' + af.title + ' [' + af.significance + ']');
        verdictParts.push(af.description);
        verdictParts.push('Evidence: ' + af.evidence);
        verdictParts.push('Executive implication: ' + af.executive_implication);
        verdictParts.push('');
      }
    }

    if (assembled.verdict.visibility_layer_completeness) {
      verdictParts.push('### Visibility-Layer Completeness\n');
      verdictParts.push(JSON.stringify(assembled.verdict.visibility_layer_completeness, null, 2));
    }
    if (assembled.verdict.boardroom) {
      verdictParts.push('\n### Boardroom Cognition\n');
      verdictParts.push(renderBoardroomAuthority(assembled.verdict.boardroom));
    }
    if (!isRuntimeOnly && assembled.verdict.balanced) {
      verdictParts.push('\n### Balanced Projection\n');
      verdictParts.push(JSON.stringify(assembled.verdict.balanced, null, 2));
    }

    budgetSections.push({
      id: 'verdict', priority: 2,
      content: '\n---\n## Verdict Data\n' + verdictParts.join(''),
    });
  }

  if (!isRuntimeOnly && assembled.specimen) {
    budgetSections.push({
      id: 'specimen', priority: 3,
      content: '\n---\n## Specimen Data\n' + formatSpecimenSummary(assembled.specimen),
    });
  }

  if (!isRuntimeOnly && assembled.structuralTopology) {
    budgetSections.push({
      id: 'topology', priority: 4,
      content: '\n---\n## Static Structural Topology (L1 Import Evidence)\n' + formatStructuralTopology(assembled.structuralTopology),
    });
  }

  if (assembled.runtimeGraphs) {
    const rtTopo = formatRuntimeTopology(assembled.runtimeGraphs, assembled.verdict?.visibility_layer_completeness);
    if (rtTopo) {
      const isGravityQ = qt === 'TOPOLOGY_GRAVITY';
      budgetSections.push({
        id: 'runtime_topology', priority: isRuntimeOnly ? 3 : isGravityQ ? 4 : 5,
        content: '\n---\n' + rtTopo,
      });
    }
  }

  if (qt === 'TOPOLOGY_GRAVITY' && assembled.structuralTopology && assembled.runtimeGraphs) {
    const rtSignals = (assembled.runtimeGraphs._derived_signals || []);
    const highRT = rtSignals.filter(s => s.severity === 'HIGH' || s.severity === 'ELEVATED');
    if (highRT.length > 0) {
      const gravityLines = [
        '\n---\n## System Gravity Interpretation\n',
        'This system has BOTH static and runtime gravity wells. Your answer must address both.',
        '',
        'STATIC GRAVITY: Platform Infrastructure and Data — import graph concentration, dependency hub, coupling pressure.',
        'RUNTIME GRAVITY: ' + highRT.map(s => s.signal_name + ' [' + s.severity + ']').join(', ') + '.',
        '',
        'The system gravity is the combination of both. Static analysis alone does not capture the runtime coordination backbone.',
      ];
      budgetSections.push({
        id: 'gravity_interpretation', priority: 3,
        content: gravityLines.join('\n'),
      });
    }
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

function formatRuntimeTopology(runtimeGraphs, vlc) {
  if (!runtimeGraphs) return '';
  const signals = runtimeGraphs._derived_signals || [];
  const parts = [];

  parts.push('## Runtime Connectivity Topology\n');

  if (vlc) {
    parts.push('### Connectivity Summary');
    parts.push(`Architecture: ${vlc.architecture_profile} | Verdict scope: ${vlc.verdict_scope} | Completeness: ${vlc.completeness}% (${vlc.measured_count}/${vlc.required_count} layers)`);
    const rtLayers = (vlc.layers_measured || []).filter(l => l.id !== 'STATIC_IMPORT');
    if (rtLayers.length > 0) {
      parts.push(`Runtime layers: ${rtLayers.map(l => l.name).join(', ')}`);
    }
    parts.push('');
  }

  const eventSig = signals.find(s => s.signal_type === 'EVENT_CONCENTRATION' && s.evidence_class === 'EVENT_FLOW');
  const diSig = signals.find(s => s.signal_type === 'EVENT_CONCENTRATION' && s.evidence_class === 'DI_MODULE_GRAPH');
  const brokerSig = signals.find(s => s.signal_type === 'BROKER_DEPENDENCY');
  const topicSig = signals.find(s => s.signal_type === 'TOPIC_FANOUT_PRESSURE');
  const wsSig = signals.find(s => s.signal_type === 'RUNTIME_DEPENDENCY_CHOKE_POINT');
  const asyncSig = signals.find(s => s.signal_type === 'ASYNC_PROPAGATION_ASYMMETRY');
  const edgeCloudSig = signals.find(s => s.signal_type === 'EDGE_CLOUD_PROPAGATION_RISK');

  if (eventSig) {
    parts.push('### Event Topology');
    parts.push(`${eventSig.measurement_basis}`);
    parts.push(`Event concentration ratio: ${eventSig.signal_value} events per handler [${eventSig.severity}]`);
    parts.push(`Affected domains: ${(eventSig.affected_domains || []).join(', ')}`);
    parts.push(`Evidence: ${eventSig.evidence_class} (${eventSig.evidence_snippet || ''})`);
    parts.push('');
  }

  if (brokerSig) {
    parts.push('### MQTT / Broker Topology');
    parts.push(`${brokerSig.measurement_basis}`);
    parts.push(`Broker dependency: single broker [${brokerSig.severity}]`);
    parts.push(`Affected domains: ${(brokerSig.affected_domains || []).join(', ')}`);
    if (topicSig) {
      parts.push(`Topic fanout: ${topicSig.signal_value} topics per subscriber domain [${topicSig.severity}]`);
      parts.push(`Topic domains: ${(topicSig.affected_domains || []).join(', ')}`);
    }
    if (edgeCloudSig) {
      parts.push(`Edge-cloud path: ${edgeCloudSig.measurement_basis}`);
      parts.push(`Edge-cloud severity: ${edgeCloudSig.severity}`);
    }
    parts.push('');
  }

  if (wsSig) {
    parts.push('### WebSocket / Real-Time Topology');
    parts.push(`${wsSig.measurement_basis}`);
    parts.push(`Stream count: ${wsSig.signal_value} real-time event streams [${wsSig.severity}]`);
    parts.push(`Affected domains: ${(wsSig.affected_domains || []).join(', ')}`);
    parts.push('');
  }

  if (asyncSig) {
    parts.push('### Async Propagation');
    parts.push(`${asyncSig.measurement_basis}`);
    parts.push(`Asymmetry ratio: ${asyncSig.signal_value}:1 events to handlers [${asyncSig.severity}]`);
    parts.push(`Affected domains: ${(asyncSig.affected_domains || []).join(', ')}`);
    parts.push('');
  }

  if (diSig) {
    parts.push('### DI / Module Graph');
    parts.push(`${diSig.measurement_basis}`);
    parts.push(`Global injection concentration: ${diSig.signal_value} providers [${diSig.severity}]`);
    parts.push(`Affected domains: ${(diSig.affected_domains || []).join(', ')}`);
    parts.push('');
  }

  const rtGravityCandidates = signals
    .filter(s => s.severity === 'HIGH' || s.severity === 'ELEVATED')
    .sort((a, b) => ({ HIGH: 0, ELEVATED: 1 }[a.severity] ?? 2) - ({ HIGH: 0, ELEVATED: 1 }[b.severity] ?? 2));
  if (rtGravityCandidates.length > 0) {
    parts.push('### Runtime Gravity Candidates');
    rtGravityCandidates.forEach(s => {
      parts.push(`- ${s.signal_name} [${s.severity}] — ${s.evidence_class} — domains: ${(s.affected_domains || []).slice(0, 4).join(', ')}`);
    });
    parts.push('');
  }

  parts.push('### Runtime Risk Summary');
  signals.forEach(s => {
    parts.push(`- ${s.signal_name} [${s.severity}] value=${s.signal_value} evidence=${s.evidence_class}`);
  });

  return parts.join('\n');
}

function classifyQuestionType(intent) {
  const lower = (intent || '').toLowerCase();
  if (/runtime.only|runtime.derived.only|show.*runtime|runtime.*risk.*only|event.*only|mqtt.*only/i.test(lower)) return 'RUNTIME_ONLY';
  if (/beyond.*static|not.*visible.*static|invisible.*static|runtime.*visible|what.*static.*cannot|what.*static.*miss/i.test(lower)) return 'RUNTIME_ONLY';
  if (/gravity|topology|backbone|system.*architecture|where.*gravity|structural.*mass/i.test(lower)) return 'TOPOLOGY_GRAVITY';
  if (/posture|executive.*risk|board.*risk|overall.*risk/i.test(lower)) return 'EXECUTIVE_POSTURE';
  return 'GENERAL_SYNTHESIS';
}

function applyRuntimeFilter(verdict) {
  if (!verdict || !verdict.boardroom) return verdict;
  const b = verdict.boardroom;
  const pureRtThemes = (b.consequence_themes || []).filter(t => t.evidence_diversity === 'RUNTIME');
  const rtSlices = (b.cognition_slices || []).filter(s =>
    ['EVENT_CONCENTRATION', 'RUNTIME_DEPENDENCY_CHOKE_POINT', 'BROKER_DEPENDENCY', 'TOPIC_FANOUT_PRESSURE', 'ASYNC_PROPAGATION_ASYMMETRY', 'EDGE_CLOUD_PROPAGATION_RISK', 'RUNTIME_OBSERVABILITY_GAP'].includes(s.condition_type)
  );
  const rtNarratives = (b.domain_narratives || []).filter(n => n.risk_label && n.risk_label !== 'structural stress is present');

  return {
    ...verdict,
    boardroom: {
      ...b,
      consequence_themes: pureRtThemes.length > 0 ? pureRtThemes : b.consequence_themes,
      cognition_slices: rtSlices.length > 0 ? rtSlices : b.cognition_slices,
      domain_narratives: rtNarratives.length > 0 ? rtNarratives : b.domain_narratives,
      posture_label: pureRtThemes.length > 0 ? 'Runtime Structural Risk' : b.posture_label,
      executive_synthesis: pureRtThemes.length > 0
        ? 'Runtime connectivity analysis identifies ' + pureRtThemes.length + ' runtime-native risk themes derived from event flow, MQTT, WebSocket, and DI evidence — independent of static import analysis.'
        : b.executive_synthesis,
    },
  };
}

function renderAnswerContract(questionType, verdict, audience) {
  if (!questionType || !verdict) return null;

  if (questionType === 'EXECUTIVE_POSTURE') {
    const vlc = verdict.visibility_layer_completeness;
    const themes = verdict.boardroom?.consequence_themes || [];
    const rtThemes = themes.filter(t => t.evidence_diversity === 'RUNTIME' || t.evidence_diversity === 'MIXED');
    const lines = ['### ANSWER CONTRACT — EXECUTIVE POSTURE', ''];
    lines.push('Your answer MUST include all of the following:');
    lines.push('1. Primary posture classification and severity');
    lines.push('2. Highest-severity systemic risks');
    lines.push('3. Governance qualifier and confidence boundary');
    if (vlc) {
      lines.push('4. Visibility-layer completeness: ' + vlc.verdict_scope + ' (' + vlc.completeness + '%, ' + vlc.measured_count + '/' + vlc.required_count + ' layers, ' + vlc.architecture_profile + ')');
    }
    if (rtThemes.length > 0) {
      lines.push('5. Runtime/system connectivity: ' + rtThemes.length + ' consequence themes include runtime-derived evidence:');
      rtThemes.slice(0, 5).forEach(t => {
        lines.push('   - ' + t.theme_label + ' [' + t.severity + '] — ' + t.evidence_annotation);
      });
      lines.push('   You must acknowledge these runtime findings in the posture assessment.');
    }
    return lines.join('\n');
  }

  if (questionType === 'RUNTIME_ONLY') {
    const themes = verdict.boardroom?.consequence_themes || [];
    const pureRuntime = themes.filter(t => t.evidence_diversity === 'RUNTIME');
    const mixed = themes.filter(t => t.evidence_diversity === 'MIXED');
    const slices = verdict.boardroom?.cognition_slices || [];
    const vlc = verdict.visibility_layer_completeness;
    const lines = ['### ANSWER CONTRACT — RUNTIME-ONLY RETRIEVAL', ''];

    if (vlc) {
      lines.push('RUNTIME VERDICT');
      lines.push('Verdict scope: ' + vlc.verdict_scope);
      lines.push('Completeness: ' + vlc.completeness + '% (' + vlc.measured_count + '/' + vlc.required_count + ' layers)');
      lines.push('Architecture: ' + vlc.architecture_profile);
      if (vlc.verdict_scope === 'SYSTEM_CONNECTIVITY') {
        lines.push('Runtime connectivity IS present in this assessment.');
        lines.push('STATIC_IMPORT is one of ' + vlc.measured_count + ' measured layers — it is NOT the verdict scope.');
        lines.push('The verdict scope is SYSTEM_CONNECTIVITY, not CODE_CONNECTIVITY.');
        const rtLayers = (vlc.layers_measured || []).filter(l => l.id !== 'STATIC_IMPORT');
        if (rtLayers.length > 0) {
          lines.push('Runtime evidence classes: ' + rtLayers.map(l => l.name).join(', '));
        }
      }
      lines.push('');
    }

    lines.push('The user requested runtime-derived risks only.');
    lines.push('');
    lines.push('Your answer MUST:');
    lines.push('- Name each runtime-derived risk below by its exact label');
    lines.push('- State severity, affected domains, and evidence class for each');
    lines.push('- These are structural risks derived from runtime connectivity evidence (event flow, MQTT, WebSocket, DI) — not static import');
    lines.push('- Do NOT describe this assessment as CODE_CONNECTIVITY — it is SYSTEM_CONNECTIVITY');
    lines.push('- Do NOT report static-only findings');
    lines.push('');
    if (pureRuntime.length > 0) {
      lines.push('RUNTIME-DERIVED CONSEQUENCE THEMES (answer from these):');
      pureRuntime.forEach((t, i) => {
        lines.push((i + 1) + '. ' + t.theme_label + ' [' + t.severity + ']');
        lines.push('   ' + t.description);
      });
      lines.push('');
    }
    if (slices.length > 0) {
      lines.push('RUNTIME CONDITIONS (report these by name):');
      slices.forEach((s, i) => {
        lines.push('  ' + (i + 1) + '. ' + s.executive_name + ' [' + s.severity + '] → ' + s.domain + ' — evidence: ' + (s.evidence_class || 'RUNTIME'));
      });
      lines.push('');
    }
    if (mixed.length > 0) {
      lines.push('MIXED-EVIDENCE THEMES (include runtime contributions):');
      mixed.forEach((t, i) => {
        lines.push('  ' + (i + 1) + '. ' + t.theme_label + ' [' + t.severity + '] — ' + t.evidence_annotation);
      });
    }
    return lines.join('\n');
  }

  return null;
}

function renderBoardroomAuthority(boardroom) {
  const lines = [];

  lines.push('POSTURE: ' + boardroom.posture_label + ' [' + boardroom.posture_severity + '] — ' + boardroom.posture_scope);
  lines.push('Confidence: ' + (boardroom.overall_confidence_label || boardroom.overall_confidence));
  lines.push('Primary locus: ' + boardroom.primary_locus);
  lines.push('Consequences: ' + boardroom.consequence_count + ' total, ' + boardroom.systemic_count + ' systemic');
  lines.push('');

  lines.push('PRIMARY CONSEQUENCE THEMES (authoritative — answer from these):');
  lines.push('');
  const themes = boardroom.consequence_themes || [];
  themes.forEach((t, i) => {
    const rel = t.persona_relevance === 'ELEVATED' ? ' [PERSONA-RELEVANT]' : '';
    lines.push((i + 1) + '. ' + t.theme_label + ' — ' + t.severity + ' — ' + (t.scope || 'REGIONAL') + rel);
    lines.push('   Evidence: ' + t.evidence_diversity + (t.evidence_annotation ? ' — ' + t.evidence_annotation : ''));
    lines.push('   Meaning: ' + t.description);
    lines.push('');
  });

  lines.push('EXECUTIVE SYNTHESIS (derived from themes above):');
  lines.push(boardroom.executive_synthesis || '');
  lines.push('');

  lines.push('SUPPORTING COGNITION SLICES:');
  const slices = boardroom.cognition_slices || [];
  slices.forEach((s, i) => {
    const rel = s.persona_relevance === 'ELEVATED' ? ' [PERSONA-RELEVANT]' : '';
    lines.push('  ' + (i + 1) + '. [' + s.severity + '] ' + s.executive_name + ' → ' + s.domain + rel);
  });
  lines.push('');

  lines.push('DOMAIN NARRATIVES:');
  const narratives = boardroom.domain_narratives || [];
  narratives.forEach(n => {
    lines.push('  ' + n.domain + ': ' + n.risk_label + (n.classes ? ' (classes: ' + n.classes + ')' : ''));
  });
  lines.push('');

  lines.push('COMBINED SYNTHESIS: ' + (boardroom.combined_synthesis || ''));

  return lines.join('\n');
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

// ─── PERSONA-WEIGHTED COGNITION SELECTION ─────────────────────────
// Each condition type maps to cognition categories.
// Each persona weights categories differently.
// Slices are scored by: severity_base + persona_category_bonus.

const CONDITION_CATEGORIES = {
  DELIVERY_PRESSURE_CONCENTRATION: ['delivery', 'coordination'],
  DEPENDENCY_CHOKE_POINT: ['topology', 'concentration'],
  PROPAGATION_ASYMMETRY: ['delivery', 'propagation'],
  STRUCTURAL_MASS_CONCENTRATION: ['topology', 'concentration'],
  CROSS_DOMAIN_COUPLING_PRESSURE: ['coordination', 'coupling'],
  EXECUTION_FRAGILITY: ['resilience', 'delivery'],
  EXECUTION_CONSTRICTION: ['topology', 'delivery'],
  STRUCTURAL_BOUNDARY_DIVERGENCE: ['governance', 'drift'],
  COUPLING_INERTIA: ['coupling', 'topology'],
  COMPOUND_CONVERGENCE: ['systemic', 'concentration'],
  GOVERNANCE_COVERAGE_STATUS: ['governance'],
  EVENT_CONCENTRATION: ['runtime_connectivity', 'coordination'],
  RUNTIME_DEPENDENCY_CHOKE_POINT: ['runtime_connectivity', 'topology'],
  BROKER_DEPENDENCY: ['runtime_connectivity', 'resilience'],
  TOPIC_FANOUT_PRESSURE: ['runtime_connectivity', 'propagation'],
  ASYNC_PROPAGATION_ASYMMETRY: ['runtime_connectivity', 'coordination', 'propagation'],
  EDGE_CLOUD_PROPAGATION_RISK: ['runtime_connectivity', 'delivery', 'resilience'],
  RUNTIME_OBSERVABILITY_GAP: ['runtime_connectivity', 'governance'],
};

const PERSONA_CATEGORY_WEIGHTS = {
  'Transformation Leader': { coordination: 3, propagation: 2, runtime_connectivity: 3, coupling: 2, delivery: 2, resilience: 1, drift: 2, systemic: 1 },
  'Chief Architect': { topology: 3, runtime_connectivity: 3, coupling: 2, concentration: 2, resilience: 2, governance: 1 },
  'CTO / VP Engineering': { topology: 2, runtime_connectivity: 2, concentration: 2, resilience: 2, coupling: 1 },
  'Program Director': { delivery: 3, coordination: 2, propagation: 2, runtime_connectivity: 1 },
  'Board of Directors': { systemic: 3, governance: 3, resilience: 1 },
  'Investor': { systemic: 3, concentration: 2, resilience: 2 },
  'PE Acquisition Team': { concentration: 3, systemic: 2, topology: 1 },
  'Engineering Director': { delivery: 2, resilience: 2, coordination: 1 },
  'Release Train Engineer (RTE)': { delivery: 3, coordination: 2, propagation: 2 },
  'GOD / Founder-Operator': { runtime_connectivity: 2, topology: 2, governance: 2, coordination: 1, delivery: 1, systemic: 1 },
};

const SEVERITY_BASE_SCORE = { CRITICAL: 10, HIGH: 7, ELEVATED: 4, MODERATE: 2, LOW: 1, NOMINAL: 0 };

function scoreSliceForPersona(slice, audience) {
  const base = SEVERITY_BASE_SCORE[slice.severity] || 0;
  const categories = CONDITION_CATEGORIES[slice.condition_type] || [];
  const weights = PERSONA_CATEGORY_WEIGHTS[audience] || {};

  let bonus = 0;
  for (const cat of categories) {
    bonus += weights[cat] || 0;
  }

  return { total: base + bonus, severity_base: base, persona_bonus: bonus, categories };
}

const CONSEQUENCE_TO_CATEGORIES = {
  COORD_FRAG: ['coordination', 'coupling'],
  DEP_AMP: ['topology', 'concentration'],
  DEL_EXP: ['delivery'],
  OP_BOTTLENECK: ['delivery', 'topology'],
  RESIL_DEF: ['resilience'],
  GOV_GAP: ['governance'],
  PROP_EXP: ['propagation'],
  STAB_RISK: ['systemic', 'concentration'],
  AMPLIFIED_DEP_FRAG: ['concentration', 'coordination'],
  STRUCT_GRAVITY_WELL: ['topology', 'concentration'],
  SYSTEMIC_OP_FRAG: ['systemic'],
};

function scoreThemeForPersona(theme, audience) {
  const base = SEVERITY_BASE_SCORE[theme.severity] || 0;
  const categories = CONSEQUENCE_TO_CATEGORIES[theme.theme_id] || [];
  const weights = PERSONA_CATEGORY_WEIGHTS[audience] || {};

  let bonus = 0;
  for (const cat of categories) {
    bonus += weights[cat] || 0;
  }
  if (theme.evidence_diversity === 'RUNTIME' || theme.evidence_diversity === 'MIXED') {
    bonus += weights['runtime_connectivity'] || 0;
  }

  return { total: base + bonus, severity_base: base, persona_bonus: bonus };
}

function applyPersonaCognitionWeighting(verdict, audience) {
  if (!verdict || !verdict.boardroom || !audience) return verdict;

  const slices = verdict.boardroom.cognition_slices || [];
  const themes = verdict.boardroom.consequence_themes || [];

  const scoredSlices = slices.map(s => ({
    ...s,
    _score: scoreSliceForPersona(s, audience),
  }));
  scoredSlices.sort((a, b) => b._score.total - a._score.total);
  const rerankedSlices = scoredSlices.slice(0, 10).map(s => ({
    executive_name: s.executive_name,
    condition_type: s.condition_type,
    domain: s.domain,
    severity: s.severity,
    confidence: s.confidence,
    evidence_class: s.evidence_class,
    persona_relevance: s._score.persona_bonus > 0 ? 'ELEVATED' : 'STANDARD',
    relevance_score: s._score.total,
  }));

  const scoredThemes = themes.map(t => {
    const score = scoreThemeForPersona(t, audience);
    return {
      ...t,
      persona_relevance: score.persona_bonus > 0 ? 'ELEVATED' : 'STANDARD',
      relevance_score: score.total,
    };
  });
  scoredThemes.sort((a, b) => b.relevance_score - a.relevance_score);

  return {
    ...verdict,
    boardroom: {
      ...verdict.boardroom,
      cognition_slices: rerankedSlices,
      consequence_themes: scoredThemes,
    },
  };
}

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
