import { useRef, useEffect } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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

function SystemMessage({ content, mode, validation, usage, streaming }) {
  return (
    <div className="copilot-msg copilot-msg-system">
      <div className="copilot-msg-meta">
        <ModeBadge mode={mode} />
        <ValidationIndicator validation={validation} />
        <UsageLine usage={usage} />
      </div>
      <div className="copilot-msg-content copilot-msg-result">
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        {streaming && <span className="copilot-cursor" />}
      </div>
    </div>
  )
}

export default function ConversationPanel({ messages, streamingContent, streamingMeta }) {
  const endRef = useRef(null)

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, streamingContent])

  if (messages.length === 0 && !streamingContent) {
    return (
      <div className="copilot-conversation copilot-empty">
        <div className="copilot-empty-state">
          <p className="copilot-empty-title">Transformation Surface</p>
          <p className="copilot-empty-hint">
            Describe what you need. Specify an audience to shape the projection.
          </p>
          <div className="copilot-empty-examples">
            <span>Explain the structural posture</span>
            <span>Draft a board briefing from this verdict</span>
            <span>Compare PI to static analysis tools</span>
            <span>Which architectural runways does this verdict imply?</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="copilot-conversation">
      {messages.map((msg, i) => {
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
          />
        )
      })}

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
