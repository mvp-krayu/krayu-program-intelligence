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
  const abortRef = useRef(null)

  const [assembling, setAssembling] = useState(false)

  const handleSubmit = useCallback(async ({ message, audience }) => {
    setMessages(prev => [...prev, {
      role: 'user',
      content: message,
      audience,
    }])

    setStreaming(true)
    setAssembling(true)
    setStreamingContent('')
    setStreamingMeta(null)

    const history = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))

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
            contextLevel={contextLevel}
            availableDomains={availableDomains}
            availableModes={availableModes}
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
