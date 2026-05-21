'use strict';

const fs = require('fs');
const { resolveCeuArtifactPath } = require('./CEUStateLoader.server');

function readExistingLog(client, run) {
  try {
    const filePath = resolveCeuArtifactPath(client, run, 'reconciliation_event_log.jsonl');
    const raw = fs.readFileSync(filePath, 'utf8').trim();
    if (!raw) return [];
    return raw.split('\n').map(line => JSON.parse(line));
  } catch (_e) {
    return [];
  }
}

function nextEventId(existingLog) {
  let maxNum = 0;
  for (const evt of existingLog) {
    const match = (evt.event_id || '').match(/^RCEU-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return `RCEU-${String(maxNum + 1).padStart(4, '0')}`;
}

function buildEvent({ existingLog, actorId, actorRole, action, targetCeuId, priorState, resultingState, justification, evidenceRefs, detail }) {
  const eventId = nextEventId(existingLog);
  return {
    event_id: eventId,
    timestamp: new Date().toISOString(),
    actor_id: actorId,
    actor_role: actorRole || 'unknown',
    action,
    target_ceu_id: targetCeuId || null,
    prior_state: priorState || null,
    resulting_state: resultingState || null,
    justification: justification || null,
    evidence_refs: evidenceRefs || [],
    detail: detail || null,
  };
}

function appendEvent(client, run, event) {
  const filePath = resolveCeuArtifactPath(client, run, 'reconciliation_event_log.jsonl');
  fs.appendFileSync(filePath, JSON.stringify(event) + '\n', 'utf8');
  return event;
}

module.exports = { readExistingLog, nextEventId, buildEvent, appendEvent };
