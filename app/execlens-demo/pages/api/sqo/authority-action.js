'use strict';

const { executeAction } = require('../../../lib/sqo-cockpit/server/SQOActionEngine.server');

const ACTIONS_REQUIRING_JUSTIFICATION = ['review_reject', 'review_contest', 'promotion_deny', 'insufficiency_acknowledge'];

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'METHOD_NOT_ALLOWED', detail: 'Only POST is accepted' });
  }

  const { action, client, runId, actor_id, target_item, justification, accepted_aspects, contested_aspects, resolution_outcome, insufficiency_permanent } = req.body || {};

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
    action, client, runId, actor_id, target_item,
    justification, accepted_aspects, contested_aspects,
    resolution_outcome, insufficiency_permanent,
  });

  const status = result.success ? 200 : 400;
  return res.status(status).json({
    ...result,
    _disclaimer: 'actor_id is DECLARATIVE ONLY. Not production RBAC. Not secure identity enforcement.',
  });
}
