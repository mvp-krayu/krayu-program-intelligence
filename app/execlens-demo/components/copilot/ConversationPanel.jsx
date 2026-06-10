import { useRef, useEffect } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const EXAMPLES = [
  { text: 'Explain the structural posture', audience: 'CTO / VP Engineering' },
  { text: 'Draft a board briefing from this verdict', audience: 'Board of Directors' },
  { text: 'What transformation risk is emerging?', audience: 'Transformation Leader' },
  { text: 'What does the system know now that was previously invisible?', audience: 'GOD / Founder-Operator' },
  { text: 'Which architectural runways does this verdict imply?', audience: 'Chief Architect' },
]

function ModeBadge({ mode }) {
  return (
    <span className="copilot-mode-badge" data-mode={mode}>
      {mode}
    </span>
  )
}

function ValidationIndicator({ validation }) {
  if (!validation) return null
  if (validation.pass) {
    return <span className="copilot-validation copilot-validation-pass">GOV PASS</span>
  }
  return (
    <span className="copilot-validation copilot-validation-warn">
      GOV {validation.violations.length} flag{validation.violations.length !== 1 ? 's' : ''}
    </span>
  )
}

function UsageLine({ usage }) {
  if (!usage || !usage.inputTokens) return null
  return (
    <span className="copilot-usage">
      {usage.inputTokens.toLocaleString()}in / {usage.outputTokens.toLocaleString()}out
    </span>
  )
}

function OperatorMessage({ content, audience }) {
  return (
    <div className="copilot-msg copilot-msg-operator">
      <div className="copilot-msg-meta">
        <span className="copilot-msg-role">Operator</span>
        {audience && <span className="copilot-msg-audience">{audience}</span>}
      </div>
      <div className="copilot-msg-content copilot-msg-intent">{content}</div>
    </div>
  )
}

function CognitiveContinuationsPanel({ continuations, onSelect }) {
  if (!continuations) return null
  const TYPE_LABELS = { clarify: 'CLARIFY', implication: 'IMPLICATION', challenge: 'CHALLENGE', descent: 'DESCENT', adjacent: 'ADJACENT', ascent: 'ASCENT' }
  const TYPE_COLORS = { clarify: '#4a9eff', implication: '#ccd6f6', challenge: '#ff9e4a', descent: '#64ffda', adjacent: '#bb86fc', ascent: '#ffd700' }
  const allItems = continuations.ranked
    ? continuations.ranked
    : Object.entries(continuations)
      .flatMap(([type, items]) => Array.isArray(items) ? items.filter(c => c.available).map(c => ({ ...c, typeKey: type })) : [])
      .slice(0, 6)
  if (allItems.length === 0) return null
  return (
    <div className="copilot-continuations">
      <div className="copilot-continuations-label">NEXT LINES OF INQUIRY</div>
      <div className="copilot-continuations-list">
        {allItems.map((c, i) => (
          <button key={i} className="copilot-continuation-btn" onClick={() => onSelect && onSelect(c.question)} type="button">
            <span className="copilot-continuation-type" style={{ color: TYPE_COLORS[c.typeKey] || '#7a8aaa' }}>{TYPE_LABELS[c.typeKey] || c.typeKey}</span>
            <span className="copilot-continuation-question">{c.question}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function RoutingTrace({ routing }) {
  if (!routing) return null
  return (
    <div style={{ display: 'flex', gap: 12, fontSize: 9, fontFamily: 'monospace', color: '#5a6580', padding: '2px 0' }}>
      <span>req: <span style={{ color: '#7a8aaa' }}>{routing.requested}</span></span>
      <span>res: <span style={{ color: '#7a8aaa' }}>{routing.resolved}</span></span>
      <span>alt: <span style={{ color: '#4a9eff' }}>{routing.altitude || '—'}</span></span>
      <span>cont: <span style={{ color: '#64ffda' }}>{routing.continuationProfile}</span></span>
    </div>
  )
}

function SystemMessage({ content, mode, validation, usage, streaming, cognitiveContinuations, onContinuationSelect, routing }) {
  return (
    <div className="copilot-msg copilot-msg-system">
      <div className="copilot-msg-meta">
        <ModeBadge mode={mode} />
        <ValidationIndicator validation={validation} />
        <UsageLine usage={usage} />
      </div>
      <RoutingTrace routing={routing} />
      <div className="copilot-msg-content copilot-msg-result">
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        {streaming && <span className="copilot-cursor" />}
      </div>
      {!streaming && <CognitiveContinuationsPanel continuations={cognitiveContinuations} onSelect={onContinuationSelect} />}
    </div>
  )
}

function PersonaChangeEvent({ fromAudience, toAudience }) {
  return (
    <div className="copilot-persona-change">
      <span className="copilot-persona-change-line" />
      <span className="copilot-persona-change-label">
        {fromAudience} → {toAudience}
      </span>
      <span className="copilot-persona-change-line" />
    </div>
  )
}

function AssemblingIndicator() {
  return (
    <div className="copilot-msg copilot-msg-system">
      <div className="copilot-assembling">
        <span className="copilot-assembling-dot" />
        <span className="copilot-assembling-text">Assembling context and transforming...</span>
      </div>
    </div>
  )
}

export default function ConversationPanel({ messages, streamingContent, streamingMeta, assembling, onExampleClick, onContinuationSelect }) {
  const endRef = useRef(null)

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, streamingContent, assembling])

  if (messages.length === 0 && !streamingContent && !assembling) {
    return (
      <div className="copilot-conversation copilot-empty">
        <div className="copilot-empty-state">
          <p className="copilot-empty-title">Transformation Surface</p>
          <p className="copilot-empty-hint">
            Describe what you need. Specify an audience to shape the projection.
          </p>
          <div className="copilot-empty-examples">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                className="copilot-example-btn"
                onClick={() => onExampleClick && onExampleClick(ex)}
              >
                <span className="copilot-example-text">{ex.text}</span>
                {ex.audience && <span className="copilot-example-audience">{ex.audience}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="copilot-conversation">
      {messages.map((msg, i) => {
        if (msg.role === 'system_event') {
          return <PersonaChangeEvent key={i} fromAudience={msg.fromAudience} toAudience={msg.toAudience} />
        }
        if (msg.role === 'user') {
          return <OperatorMessage key={i} content={msg.content} audience={msg.audience} />
        }
        return (
          <SystemMessage
            key={i}
            content={msg.content}
            mode={msg.mode}
            validation={msg.validation}
            usage={msg.usage}
            cognitiveContinuations={msg.cognitiveContinuations}
            onContinuationSelect={onContinuationSelect}
            routing={msg.routing}
          />
        )
      })}

      {assembling && !streamingContent && <AssemblingIndicator />}

      {streamingContent && (
        <SystemMessage
          content={streamingContent}
          mode={streamingMeta?.mode || 'query'}
          streaming
        />
      )}

      <div ref={endRef} />
    </div>
  )
}
