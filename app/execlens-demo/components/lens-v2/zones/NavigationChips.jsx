import { useMemo } from 'react'

const ACTION_MAP = {
  implication: { label: 'Why it matters', icon: '→', targetMode: 'EXECUTIVE_BALANCED' },
  challenge: { label: 'Prove it', icon: '?', targetMode: 'OPERATOR_DENSE' },
  descent: { label: 'Show evidence', icon: '↓', targetMode: 'OPERATOR_DENSE' },
  adjacent: { label: 'What compounds', icon: '◇', targetMode: null },
  ascent: { label: 'Board view', icon: '↑', targetMode: null, boardroom: true },
  clarify: { label: 'Explain', icon: '⊙', targetMode: 'EXECUTIVE_DENSE' },
}

const TYPE_COLORS = {
  implication: '#ccd6f6',
  challenge: '#ff9e4a',
  descent: '#64ffda',
  adjacent: '#bb86fc',
  ascent: '#ffd700',
  clarify: '#4a9eff',
}

const QUAL_COLORS = {
  QUALIFIED: '#64ffda',
  PARTIALLY_QUALIFIED: '#e6b800',
  UNQUALIFIED: '#ff6b6b',
}

function resolveQualification(continuation, evidenceLayers) {
  const layers = evidenceLayers || []
  const layerSet = new Set(layers.map(l => typeof l === 'string' ? l : l.id))

  const te = continuation.targetEvidence
  if (!te) return { state: 'QUALIFIED', gap: null }

  const runtimeEvidence = ['RSIG', 'EVENT_FLOW', 'MQTT_TOPIC_FLOW', 'WEBSOCKET_FLOW']
  if (runtimeEvidence.includes(te)) {
    const hasRuntime = layerSet.has('EVENT_FLOW') || layerSet.has('MQTT_TOPIC_FLOW') || layerSet.has('WEBSOCKET_FLOW')
    if (!hasRuntime) return { state: 'UNQUALIFIED', gap: 'Runtime evidence not available' }
    return { state: 'QUALIFIED', gap: null }
  }

  if (te === 'centrality' || te === 'cognition_slices') {
    if (!layerSet.has('STATIC_IMPORT')) return { state: 'PARTIALLY_QUALIFIED', gap: 'Static enrichment limited' }
    return { state: 'QUALIFIED', gap: null }
  }

  return { state: 'QUALIFIED', gap: null }
}

function deriveChipsFromContinuations(crossDomainCognition, fullReport, projectionLevel, altitude) {
  try {
    const { deriveContinuations } = require('../../../lib/lens-v2/pios/CognitiveContinuations')
    const surfaceId = crossDomainCognition && crossDomainCognition.posture_label
      ? 'SYSTEMIC_OPERATIONAL_FRAGILITY' : 'STRUCTURAL_FRAGILITY'
    const ctx = {
      crossDomainCognition: crossDomainCognition || {},
      fullReport: fullReport || {},
    }
    return deriveContinuations(surfaceId, ctx, projectionLevel || 0, altitude || 'sovereign')
  } catch { return null }
}

export default function NavigationChips({ crossDomainCognition, fullReport, projectionLevel, altitude, evidenceLayers, onModeTransition, onNavigate, compact }) {
  const continuations = useMemo(() =>
    deriveChipsFromContinuations(crossDomainCognition, fullReport, projectionLevel, altitude),
    [crossDomainCognition, fullReport, projectionLevel, altitude]
  )

  if (!continuations || !continuations.ranked) return null

  const chips = continuations.ranked.filter(c => c.available).slice(0, compact ? 3 : 4)
  if (chips.length === 0) return null

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
      {chips.map((c, i) => {
        const action = ACTION_MAP[c.typeKey] || ACTION_MAP.clarify
        const color = TYPE_COLORS[c.typeKey] || '#7a8aaa'
        const qual = resolveQualification(c, evidenceLayers)

        const handleClick = () => {
          if (action.boardroom && onModeTransition) {
            onModeTransition('EXECUTIVE_DENSE')
          } else if (action.targetMode && onModeTransition) {
            onModeTransition(action.targetMode)
          }
          if (onNavigate) onNavigate(c)
        }

        return (
          <button
            key={i}
            type="button"
            onClick={handleClick}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 4,
              background: color + '08', border: `1px solid ${color}30`,
              cursor: 'pointer', fontSize: 10, fontFamily: 'monospace',
              color, transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = color + '18'; e.currentTarget.style.borderColor = color + '60' }}
            onMouseLeave={e => { e.currentTarget.style.background = color + '08'; e.currentTarget.style.borderColor = color + '30' }}
          >
            <span style={{ fontSize: 11 }}>{action.icon}</span>
            <span>{action.label}</span>
            {qual.state !== 'QUALIFIED' && (
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: QUAL_COLORS[qual.state],
                flexShrink: 0,
              }} title={qual.gap || qual.state} />
            )}
          </button>
        )
      })}
      {evidenceLayers && evidenceLayers.length > 0 && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '3px 8px', borderRadius: 4,
          background: '#64ffda08', border: '1px solid #64ffda20',
          fontSize: 9, fontFamily: 'monospace', color: '#64ffda80',
        }}>
          {evidenceLayers.length} layers
        </span>
      )}
    </div>
  )
}
