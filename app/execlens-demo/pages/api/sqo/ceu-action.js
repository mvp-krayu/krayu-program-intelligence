'use strict';

const { executeAction } = require('../../../lib/sqo-cockpit/server/CEUActionEngine.server');

const ACTIONS_REQUIRING_JUSTIFICATION = ['ceu_reject', 'ceu_merge', 'ceu_split', 'ceu_reclassify'];

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED', detail: 'Only POST is accepted' });
  }

  const { action, client, runId, actor_id, target_ceu_id, justification, merge_target, new_tier, finding, evidence_ref, obligation_description } = req.body || {};

  if (!action || !client || !runId || !actor_id) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_REQUIRED_FIELDS',
      detail: 'action, client, runId, and actor_id are required',
      _disclaimer: 'actor_id is DECLARATIVE ONLY. Not production RBAC. Not secure identity enforcement.',
    });
  }

  if (ACTIONS_REQUIRING_JUSTIFICATION.includes(action) && !justification) {
    return res.status(400).json({
      success: false,
      error: 'JUSTIFICATION_REQUIRED',
      detail: `Action "${action}" requires a justification field`,
      _disclaimer: 'actor_id is DECLARATIVE ONLY. Not production RBAC. Not secure identity enforcement.',
    });
  }

  const result = executeAction({
    action, client, runId, actor_id, target_ceu_id,
    justification, merge_target, new_tier, finding,
    evidence_ref, obligation_description,
  });

  const status = result.success ? 200 : 400;
  return res.status(status).json({
    ...result,
    _disclaimer: 'actor_id is DECLARATIVE ONLY. Not production RBAC. Not secure identity enforcement.',
  });
}
