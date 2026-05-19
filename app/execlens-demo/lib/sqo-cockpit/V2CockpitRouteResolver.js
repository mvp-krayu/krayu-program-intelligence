'use strict';

const TIER1_SECTIONS = ['overview', 'authority'];
const TIER2_SECTIONS = ['semantic-candidates', 'progression', 'reconciliation', 'evidence', 'debt'];
const TIER3_SECTIONS = ['continuity', 'maturity', 'reconciliation-loop', 'handoff', 'ceu-admissibility', 'evidence-ingestion', 'corridor', 'evidence-rebase'];

const SECTION_LABELS_V2 = {
  overview: 'Overview',
  authority: 'Authority',
  'semantic-candidates': 'Semantic Intake',
  progression: 'Progression',
  reconciliation: 'Reconciliation',
  evidence: 'Evidence & Replay',
  debt: 'Semantic Debt',
  continuity: 'Continuity Assessment',
  maturity: 'Maturity Profile',
  'reconciliation-loop': 'Reconciliation Loop',
  handoff: 'PATH B Handoff',
  'ceu-admissibility': 'CEU Admissibility',
  'evidence-ingestion': 'Evidence Ingestion',
  corridor: 'Runtime Corridor',
  'evidence-rebase': 'Evidence Rebase',
};

function resolveTierFromSection(section) {
  if (TIER1_SECTIONS.includes(section)) return 1;
  if (TIER2_SECTIONS.includes(section)) return 2;
  if (TIER3_SECTIONS.includes(section)) return 3;
  return null;
}

function buildV2BasePath(client, runId) {
  return `/sqo/client/${client}/run/${runId}/v2`;
}

function buildV2SectionPath(client, runId, section) {
  const base = buildV2BasePath(client, runId);
  if (section === 'overview') return base;
  if (section === 'authority') return `${base}/authority`;
  const tier = resolveTierFromSection(section);
  if (tier === 2) return `${base}/detail/${section}`;
  if (tier === 3) return `${base}/forensic/${section}`;
  return base;
}

function deriveV2SectionFromPath(urlPath) {
  const detailMatch = urlPath.match(/\/v2\/detail\/([^/]+)/);
  if (detailMatch) return detailMatch[1];
  const forensicMatch = urlPath.match(/\/v2\/forensic\/([^/]+)/);
  if (forensicMatch) return forensicMatch[1];
  if (urlPath.endsWith('/v2/authority')) return 'authority';
  return 'overview';
}

function buildV2NavigationItems(client, runId, activeSection, sectionAvailability) {
  const sa = sectionAvailability || {};

  const tier1 = TIER1_SECTIONS.map(section => ({
    section,
    label: SECTION_LABELS_V2[section],
    path: buildV2SectionPath(client, runId, section),
    active: section === activeSection,
    available: true,
    tier: 1,
  }));

  const tier2 = TIER2_SECTIONS.map(section => ({
    section,
    label: SECTION_LABELS_V2[section],
    path: buildV2SectionPath(client, runId, section),
    active: section === activeSection,
    available: !!sa[section],
    tier: 2,
  }));

  const tier3 = TIER3_SECTIONS.map(section => ({
    section,
    label: SECTION_LABELS_V2[section],
    path: buildV2SectionPath(client, runId, section),
    active: section === activeSection,
    available: !!sa[section],
    tier: 3,
  }));

  return { tier1, tier2, tier3 };
}

module.exports = {
  TIER1_SECTIONS,
  TIER2_SECTIONS,
  TIER3_SECTIONS,
  SECTION_LABELS_V2,
  resolveTierFromSection,
  buildV2BasePath,
  buildV2SectionPath,
  deriveV2SectionFromPath,
  buildV2NavigationItems,
};
