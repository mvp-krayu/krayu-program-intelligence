import { useState, useCallback, useRef } from 'react'
import CopilotHeader from './CopilotHeader'
import ConversationPanel from './ConversationPanel'
import ContextPanel from './ContextPanel'
import InputBar from './InputBar'

export default function CopilotPage({ client, runId }) {
  const [messages, setMessages] = useState([])
  const [streaming, setStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [streamingMeta, setStreamingMeta] = useState(null)
  const [contextLevel, setContextLevel] = useState(client ? 2 : 0)
  const [availableDomains, setAvailableDomains] = useState([])
  const [availableModes, setAvailableModes] = useState([])
  const [contextOpen, setContextOpen] = useState(false)
  const [vitals, setVitals] = useState(null)
  const [persona, setPersona] = useState(null)
  const [sessionStats, setSessionStats] = useState({ queries: 0, tokensIn: 0, tokensOut: 0 })
  const abortRef = useRef(null)

  const [assembling, setAssembling] = useState(false)

  const handleSubmit = useCallback(async ({ message, audience }) => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')
    const prevAudience = lastUserMsg?.audience
    const audienceChanged = prevAudience && audience && prevAudience !== audience

    const newMessages = []
    if (audienceChanged) {
      newMessages.push({
        role: 'system_event',
        content: `Persona changed: ${prevAudience} → ${audience}`,
        fromAudience: prevAudience,
        toAudience: audience,
      })
    }
    newMessages.push({ role: 'user', content: message, audience })

    setMessages(prev => [...prev, ...newMessages])

    setStreaming(true)
    setAssembling(true)
    setStreamingContent('')
    setStreamingMeta(null)

    const allMessages = [...messages, ...newMessages]
    const history = allMessages
      .filter(m => m.role === 'user' || m.role === 'assistant' || m.role === 'system_event')
      .map(m => {
        if (m.role === 'system_event') {
          return { role: 'user', content: `[System: ${m.content}. Re-answer using the new persona projection contract. Do not reference the prior answer — project fresh through the new decision-making lens.]` }
        }
        return { role: m.role === 'user' ? 'user' : 'assistant', content: m.content }
      })

    try {
      const res = await fetch('/api/copilot/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          audience,
          client: client || undefined,
          runId: runId || undefined,
          history,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }))
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `**Error:** ${err.error || 'Request failed'}`,
          mode: 'error',
        }])
        setStreaming(false)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''
      let meta = null
      let finalEvent = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6).trim()
          if (payload === '[DONE]') continue

          try {
            const event = JSON.parse(payload)

            if (event.type === 'meta') {
              meta = event
              setStreamingMeta(event)
              setContextLevel(event.contextLevel ?? contextLevel)
              if (event.availableDomains) setAvailableDomains(event.availableDomains)
              if (event.vitals) setVitals(event.vitals)
              if (event.persona) setPersona(event.persona)
            } else if (event.type === 'delta') {
              setAssembling(false)
              fullContent += event.text
              setStreamingContent(fullContent)
            } else if (event.type === 'done') {
              finalEvent = event
            } else if (event.type === 'error') {
              fullContent += `\n\n**Error:** ${event.error}`
              setStreamingContent(fullContent)
            }
          } catch {}
        }
      }

      if (finalEvent?.usage) {
        setSessionStats(prev => ({
          queries: prev.queries + 1,
          tokensIn: prev.tokensIn + (finalEvent.usage.inputTokens || 0),
          tokensOut: prev.tokensOut + (finalEvent.usage.outputTokens || 0),
        }))
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fullContent,
        mode: meta?.mode || 'query',
        validation: finalEvent?.validation,
        usage: finalEvent?.usage,
        contextLevel: meta?.contextLevel,
        retrievedTopics: meta?.retrievedTopics,
      }])

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `**Connection error:** ${err.message}`,
        mode: 'error',
      }])
    } finally {
      setStreaming(false)
      setAssembling(false)
      setStreamingContent('')
      setStreamingMeta(null)
    }
  }, [messages, client, runId, contextLevel])

  const handleExampleClick = useCallback(({ text, audience }) => {
    handleSubmit({ message: text, audience: audience || undefined })
  }, [handleSubmit])

  return (
    <div className="copilot-root">
      <CopilotHeader
        contextLevel={contextLevel}
        client={client}
        runId={runId}
      />

      <div className="copilot-body">
        <div className="copilot-main">
          <ConversationPanel
            messages={messages}
            streamingContent={streamingContent}
            streamingMeta={streamingMeta}
            assembling={assembling}
            onExampleClick={handleExampleClick}
          />
        </div>

        {contextOpen && (
          <ContextPanel
            vitals={vitals}
            persona={persona}
            sessionStats={sessionStats}
            contextLevel={contextLevel}
          />
        )}
      </div>

      <div className="copilot-footer">
        <InputBar onSubmit={handleSubmit} disabled={streaming} />
        <div className="copilot-footer-meta">
          <button
            className="copilot-context-toggle"
            onClick={() => setContextOpen(prev => !prev)}
          >
            {contextOpen ? 'Hide context' : 'Show context'}
          </button>
          <span className="copilot-footer-gov">
            Governed output &middot; 13 prohibitions &middot; Evidence-traceable
          </span>
        </div>
      </div>
    </div>
  )
}
