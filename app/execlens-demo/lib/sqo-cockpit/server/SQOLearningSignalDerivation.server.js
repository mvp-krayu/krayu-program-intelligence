'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..', '..');

const AUTHORITY_ACTIONS = [
  'review_accept', 'review_reject', 'review_contest', 'review_partial_accept',
  'promotion_request', 'promotion_approve', 'promotion_deny',
  'insufficiency_acknowledge', 'crosswalk_accept', 'reconciliation_accept',
  'escalate_arbitration', 'resolve_arbitration',
];

const TERMINAL_DISPOSITIONS = ['RESOLVED', 'REJECTED', 'UNRESOLVABLE'];

function resolveSqoPath(client, run, filename) {
  const rel = path.join('clients', client, 'psee', 'runs', run, 'sqo', filename);
  if (rel.includes('..')) throw new Error('PATH_TRAVERSAL_REJECTED');
  return path.resolve(REPO_ROOT, rel);
}

function loadEventLog(client, run) {
  const filePath = resolveSqoPath(client, run, 'promotion_event_log.jsonl');
  try {
    const raw = fs.readFileSync(filePath, 'utf8').trim();
    if (!raw) return [];
    return raw.split('\n').map(line => JSON.parse(line));
  } catch (_e) {
    return [];
  }
}

function loadExistingSignals(client, run) {
  const filePath = resolveSqoPath(client, run, 'learning_signals.json');
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (_e) {
    return null;
  }
}

function classifyEvent(evt) {
  if (evt.action && AUTHORITY_ACTIONS.includes(evt.action)) return 'authority_action';
  if (evt.event_type === 'promotion_advanced') return 'promotion_transition';
  if (evt.event_type === 'promotion_held') return 'promotion_hold';
  if (evt.event_type === 'structural_onboarding_complete') return 'lifecycle_milestone';
  if (evt.event_type === 'legacy_qualification_bridge') return 'lifecycle_milestone';
  return 'unknown';
}

function deriveActionPatterns(events) {
  const authorityEvents = events.filter(e => classifyEvent(e) === 'authority_action');
  if (authorityEvents.length === 0) return { total_authority_actions: 0, by_action: {}, by_target: {} };

  const byAction = {};
  const byTarget = {};

  for (const evt of authorityEvents) {
    const action = evt.action;
    if (!byAction[action]) byAction[action] = { count: 0, dispositions: {} };
    byAction[action].count += 1;
    const disp = evt.semantic_disposition || 'UNCLASSIFIED';
    byAction[action].dispositions[disp] = (byAction[action].dispositions[disp] || 0) + 1;

    const target = evt.target_item;
    if (target) {
      if (!byTarget[target]) byTarget[target] = { actions: [], resulting_states: [] };
      byTarget[target].actions.push(action);
      byTarget[target].resulting_states.push(evt.resulting_state);
    }
  }

  return { total_authority_actions: authorityEvents.length, by_action: byAction, by_target: byTarget };
}

function deriveProgressionHistory(events) {
  const transitions = events.filter(e => classifyEvent(e) === 'promotion_transition');
  const holds = events.filter(e => classifyEvent(e) === 'promotion_hold');

  const progressionPath = transitions.map(t => ({
    from: t.from,
    to: t.to,
    timestamp: t.timestamp,
    rationale_length: (t.rationale || '').length,
  }));

  const holdReasons = holds.map(h => ({
    state: h.current_state,
    timestamp: h.timestamp,
    rationale_summary: (h.rationale || '').slice(0, 120),
  }));

  return {
    total_transitions: transitions.length,
    total_holds: holds.length,
    hold_to_advance_ratio: transitions.length > 0 ? holds.length / transitions.length : null,
    progression_path: progressionPath,
    hold_reasons: holdReasons,
  };
}

function deriveTemporalSignals(events) {
  if (events.length < 2) return { event_span_hours: null, avg_gap_hours: null };

  const timestamps = events
    .map(e => e.timestamp)
    .filter(Boolean)
    .map(t => new Date(t).getTime())
    .filter(t => !isNaN(t))
    .sort((a, b) => a - b);

  if (timestamps.length < 2) return { event_span_hours: null, avg_gap_hours: null };

  const spanMs = timestamps[timestamps.length - 1] - timestamps[0];
  const gaps = [];
  for (let i = 1; i < timestamps.length; i++) {
    gaps.push(timestamps[i] - timestamps[i - 1]);
  }
  const avgGapMs = gaps.reduce((a, b) => a + b, 0) / gaps.length;

  return {
    event_span_hours: Math.round(spanMs / 3600000 * 10) / 10,
    avg_gap_hours: Math.round(avgGapMs / 3600000 * 10) / 10,
    first_event: new Date(timestamps[0]).toISOString(),
    last_event: new Date(timestamps[timestamps.length - 1]).toISOString(),
  };
}

function deriveGuidanceSignals(actionPatterns, progressionHistory) {
  const signals = [];

  if (actionPatterns.by_action.review_reject && actionPatterns.by_action.review_reject.count > 0) {
    signals.push({
      signal: 'rejection_activity',
      severity: 'INFORMATIONAL',
      detail: `${actionPatterns.by_action.review_reject.count} review rejection(s) recorded`,
    });
  }

  if (actionPatterns.by_action.review_contest && actionPatterns.by_action.review_contest.count > 0) {
    signals.push({
      signal: 'contest_activity',
      severity: 'INFORMATIONAL',
      detail: `${actionPatterns.by_action.review_contest.count} contest(s) recorded — governance friction active`,
    });
  }

  if (actionPatterns.by_action.escalate_arbitration && actionPatterns.by_action.escalate_arbitration.count > 0) {
    signals.push({
      signal: 'arbitration_escalation',
      severity: 'ELEVATED',
      detail: `${actionPatterns.by_action.escalate_arbitration.count} arbitration escalation(s) — governance contention`,
    });
  }

  if (progressionHistory.hold_to_advance_ratio !== null && progressionHistory.hold_to_advance_ratio > 2) {
    signals.push({
      signal: 'progression_friction',
      severity: 'ELEVATED',
      detail: `Hold-to-advance ratio is ${progressionHistory.hold_to_advance_ratio.toFixed(1)} — qualification progression is meeting resistance`,
    });
  }

  const targetActionCounts = Object.values(actionPatterns.by_target);
  const multiActionTargets = targetActionCounts.filter(t => t.actions.length > 1);
  if (multiActionTargets.length > 0) {
    signals.push({
      signal: 'multi_action_targets',
      severity: 'INFORMATIONAL',
      detail: `${multiActionTargets.length} obligation(s) have been acted on multiple times — review/contest/re-review activity`,
    });
  }

  return signals;
}

function deriveLearningSignals(client, run) {
  const events = loadEventLog(client, run);
  if (events.length === 0) {
    return { available: false, client, run, reason: 'NO_EVENTS' };
  }

  const actionPatterns = deriveActionPatterns(events);
  const progressionHistory = deriveProgressionHistory(events);
  const temporalSignals = deriveTemporalSignals(events);
  const guidanceSignals = deriveGuidanceSignals(actionPatterns, progressionHistory);

  return {
    available: true,
    client,
    run,
    learning_version: 'v1',
    derived_at: new Date().toISOString(),
    derived_from_events: events.length,
    event_schema_types: [...new Set(events.map(e => classifyEvent(e)))],
    action_patterns: actionPatterns,
    progression_history: progressionHistory,
    temporal_signals: temporalSignals,
    guidance_signals: guidanceSignals,
  };
}

function writeLearningSignals(client, run, signals) {
  const filePath = resolveSqoPath(client, run, 'learning_signals.json');
  fs.writeFileSync(filePath, JSON.stringify(signals, null, 2), 'utf8');
  return filePath;
}

function refreshLearningSignals(client, run) {
  const signals = deriveLearningSignals(client, run);
  if (signals.available) {
    writeLearningSignals(client, run, signals);
  }
  return signals;
}

module.exports = {
  deriveLearningSignals,
  refreshLearningSignals,
  loadExistingSignals,
};
