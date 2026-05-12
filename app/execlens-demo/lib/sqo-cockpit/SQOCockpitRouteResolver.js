'use strict';

const { isClientRunAllowed, listAllowedClientRuns } = require('../lens-v2/manifests');

const COCKPIT_SECTIONS = ['overview', 'debt', 'continuity', 'maturity', 'progression', 'evidence', 'handoff', 'corridor', 'evidence-ingestion', 'semantic-candidates', 'ceu-admissibility'];

const SECTION_ROUTES = {
  overview: '',
  debt: '/debt',
  continuity: '/continuity',
  maturity: '/maturity',
  progression: '/progression',
  evidence: '/evidence',
  handoff: '/handoff',
  corridor: '/corridor',
  'evidence-ingestion': '/evidence-ingestion',
  'semantic-candidates': '/semantic-candidates',
  'ceu-admissibility': '/ceu-admissibility',
};

const SECTION_LABELS = {
  overview: 'Overview',
  debt: 'Semantic Debt',
  continuity: 'Continuity',
  maturity: 'Maturity Profile',
  progression: 'Progression',
  evidence: 'Evidence & Replay',
  handoff: 'PATH B Handoff',
  corridor: 'Runtime Corridor',
  'evidence-ingestion': 'Evidence Ingestion',
  'semantic-candidates': 'Semantic Candidates',
  'ceu-admissibility': 'CEU Admissibility',
};

function validateRouteParams(client, runId) {
  if (!client || typeof client !== 'string') {
    return { valid: false, error: 'MISSING_CLIENT', detail: 'Client parameter is required' };
  }
  if (!runId || typeof runId !== 'string') {
    return { valid: false, error: 'MISSING_RUN', detail: 'Run parameter is required' };
  }
  if (!isClientRunAllowed(client, runId)) {
    return { valid: false, error: 'CLIENT_RUN_NOT_REGISTERED', detail: `${client}/${runId} is not registered` };
  }
  return { valid: true, client, run_id: runId };
}

function buildCockpitBasePath(client, runId) {
  return `/sqo/client/${client}/run/${runId}`;
}

function buildSectionPath(client, runId, section) {
  const route = SECTION_ROUTES[section];
  if (route === undefined) return null;
  return `${buildCockpitBasePath(client, runId)}${route}`;
}

function buildNavigationItems(client, runId, activeSection) {
  return COCKPIT_SECTIONS.map(section => ({
    section,
    label: SECTION_LABELS[section],
    path: buildSectionPath(client, runId, section),
    active: section === activeSection,
  }));
}

function resolveClientList() {
  return listAllowedClientRuns();
}

function deriveSectionFromPath(urlPath) {
  const segments = urlPath.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  return COCKPIT_SECTIONS.includes(last) ? last : 'overview';
}

module.exports = {
  COCKPIT_SECTIONS,
  SECTION_ROUTES,
  SECTION_LABELS,
  validateRouteParams,
  buildCockpitBasePath,
  buildSectionPath,
  buildNavigationItems,
  resolveClientList,
  deriveSectionFromPath,
};
