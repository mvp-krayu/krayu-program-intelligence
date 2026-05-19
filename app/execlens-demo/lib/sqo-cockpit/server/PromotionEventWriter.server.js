'use strict';

const fs = require('fs');
const { resolveSqoArtifactPath } = require('./PromotionStateLoader.server');

const SEMANTIC_DISPOSITIONS = [
  'OPERATIONAL_ACCEPTANCE',
  'OPERATIONAL_REJECTION',
  'CONTESTED',
  'ARBITRATION_ESCALATION',
  'PARTIAL_ACCEPTANCE',
  'INSUFFICIENCY_DETERMINATION',
  'QUALIFICATION_ADVANCEMENT',
  'QUALIFICATION_DENIAL',
  'QUALIFICATION_REQUEST',
  'STRUCTURAL_ACCEPTANCE',
];

function readExistingLog(client, run) {
  const filePath = resolveSqoArtifactPath(client, run, 'promotion_event_log.jsonl');
  try {
    const raw = fs.readFileSync(filePath, 'utf8').trim();
    if (!raw) return [];
    return raw.split('\n').map(line => JSON.parse(line));
  } catch (_e) {
    return [];
  }
}

function nextEventId(existingLog) {
  if (!existingLog || existingLog.length === 0) return 'EVT-001';
  const maxNum = existingLog.reduce((max, evt) => {
    const match = evt.event_id?.match(/^EVT-(\d+)$/);
    if (!match) return max;
    return Math.max(max, parseInt(match[1], 10));
  }, 0);
  return `EVT-${String(maxNum + 1).padStart(3, '0')}`;
}

function buildEvent({
  existingLog,
  actorId,
  actorRole,
  action,
  authorityDomain,
  authorityLevel,
  targetArtifact,
  targetItem,
  priorState,
  resultingState,
  justification,
  evidenceRefs,
  promotionAuthorityOwner,
  approvalScope,
  semanticDisposition,
}) {
  return {
    event_id: nextEventId(existingLog),
    timestamp: new Date().toISOString(),
    actor_id: actorId,
    actor_role: actorRole,
    action,
    authority_domain: authorityDomain,
    authority_level: authorityLevel,
    target_artifact: targetArtifact || null,
    target_item: targetItem || null,
    prior_state: priorState,
    resulting_state: resultingState,
    justification: justification || null,
    evidence_refs: evidenceRefs || [],
    promotion_authority_owner: promotionAuthorityOwner || null,
    approval_scope: approvalScope || null,
    semantic_disposition: semanticDisposition || null,
  };
}

function appendEvent(client, run, event) {
  const filePath = resolveSqoArtifactPath(client, run, 'promotion_event_log.jsonl');
  const line = JSON.stringify(event) + '\n';
  fs.appendFileSync(filePath, line, 'utf8');
  return event;
}

module.exports = {
  readExistingLog,
  nextEventId,
  buildEvent,
  appendEvent,
  SEMANTIC_DISPOSITIONS,
};
