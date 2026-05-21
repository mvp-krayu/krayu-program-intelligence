'use strict';

const { loadReconciliationState } = require('./CEUStateLoader.server');

function resolveCeuReconciliationWorkspace(client, runId) {
  const loaded = loadReconciliationState(client, runId);
  if (!loaded.loaded) {
    return { available: false, client, runId, failReason: 'No CEU reconciliation artifacts found' };
  }

  const { reconciliationState, candidateRegistry, evidenceAnchors, reconciliationObligations, reconciliationEventLog } = loaded;

  const candidateList = buildCandidateList(reconciliationState, candidateRegistry, evidenceAnchors);
  const obligationQueue = buildObligationQueue(reconciliationObligations);
  const eventTimeline = buildEventTimeline(reconciliationEventLog);
  const gateStatus = reconciliationState.promotion_gate || {};
  const summary = reconciliationState.summary || {};

  return {
    available: true,
    client,
    runId,
    reviewMode: reconciliationState.review_mode || 'UNCLASSIFIED',
    reconciliationStatus: reconciliationState.reconciliation_status,
    summary,
    gateStatus,
    candidateList,
    obligationQueue,
    eventTimeline,
    _disclaimer: 'actor_id is DECLARATIVE ONLY. Not production RBAC. Not secure identity enforcement.',
  };
}

function buildCandidateList(reconciliationState, candidateRegistry, evidenceAnchors) {
  const candidates = reconciliationState.candidates || {};
  const registryCandidates = (candidateRegistry.candidates || []).reduce((acc, c) => {
    acc[c.ceu_id] = c;
    return acc;
  }, {});
  const anchorsByCeu = {};
  for (const anchor of (evidenceAnchors.anchors || [])) {
    if (!anchorsByCeu[anchor.ceu_id]) anchorsByCeu[anchor.ceu_id] = [];
    anchorsByCeu[anchor.ceu_id].push(anchor);
  }

  return Object.entries(candidates).map(([ceuId, state]) => {
    const registry = registryCandidates[ceuId] || {};
    const anchors = anchorsByCeu[ceuId] || [];

    return {
      ceu_id: ceuId,
      domain: state.domain,
      state: state.state,
      tier: state.tier,
      file_count: state.file_count,
      merge_candidate: state.merge_candidate,
      authority_pattern: state.authority_pattern,
      evidence_count: state.evidence_count,
      reconciliation_finding: state.reconciliation_finding,
      last_action: state.last_action,
      last_actor: state.last_actor,
      last_action_at: state.last_action_at,
      structural_metrics: registry.structural_metrics || null,
      top_spine: registry.top_spine || null,
      coupling: registry.top_coupling || null,
      evidence_anchors: anchors.map(a => ({
        anchor_id: a.anchor_id,
        evidence_type: a.evidence_type,
        source_path: a.source_path,
        heading: a.heading || null,
        summary: a.summary || null,
        app_name: a.app_name || a.verbose_name || null,
        model_count: a.model_count || a.documented_model_count || null,
        endpoint_count: a.endpoint_count || null,
      })),
      affordances: resolveAffordances(state),
    };
  });
}

function resolveAffordances(candidateState) {
  const state = candidateState.state;
  const actions = [];

  switch (state) {
    case 'PROPOSED':
      actions.push('ceu_attach_evidence', 'ceu_reject');
      break;
    case 'EVIDENCE_ATTACHED':
      actions.push('ceu_reconcile', 'ceu_attach_evidence', 'ceu_reject');
      if (candidateState.merge_candidate) actions.push('ceu_merge');
      break;
    case 'RECONCILED':
      actions.push('ceu_confirm', 'ceu_reject', 'ceu_reclassify');
      if (candidateState.merge_candidate) actions.push('ceu_merge');
      break;
    case 'CONFIRMED':
    case 'REJECTED':
    case 'MERGED':
      break;
  }

  return { actions, readonly: actions.length === 0 };
}

function buildObligationQueue(reconciliationObligations) {
  const obligations = reconciliationObligations.obligations || [];
  return {
    total: obligations.length,
    unresolved: obligations.filter(o => o.status === 'UNRESOLVED').length,
    resolved: obligations.filter(o => o.status === 'RESOLVED').length,
    items: obligations.map(o => ({
      ...o,
      affordances: o.status === 'UNRESOLVED' ? { actions: ['ceu_resolve_obligation'] } : { actions: [], readonly: true },
    })),
  };
}

function buildEventTimeline(eventLog) {
  return (eventLog || []).slice().reverse().slice(0, 50).map(evt => ({
    event_id: evt.event_id,
    timestamp: evt.timestamp,
    actor_id: evt.actor_id,
    action: evt.action || evt.event_type,
    target_ceu_id: evt.target_ceu_id || evt.ceu_id || null,
    prior_state: evt.prior_state,
    resulting_state: evt.resulting_state,
    justification: evt.justification,
  }));
}

module.exports = { resolveCeuReconciliationWorkspace };
