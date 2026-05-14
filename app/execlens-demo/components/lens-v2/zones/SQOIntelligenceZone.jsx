import { DEFAULT_BINDING_CLIENT, DEFAULT_BINDING_RUN } from './constants'

const S_STATE_NARRATIVE = {
  S0: { label: 'S0 — Structural Only', description: 'No semantic qualification has been attempted.' },
  S1: { label: 'S1 — Onboarding Required', description: 'Structural evidence is present but semantic qualification has not begun.' },
  S2: { label: 'S2 — Qualified with Debt', description: 'Semantic qualification is active. Structural backing is partial; semantic debt remains.' },
  S3: { label: 'S3 — Authority Ready', description: 'Full structural backing achieved. System is governable without advisory qualification.' },
}

function deriveBlockingNarrative(debtVisibility) {
  if (!debtVisibility) return null
  const { blocking_count, total_items } = debtVisibility
  if (!blocking_count) return null
  return `${blocking_count} of ${total_items} semantic debt items block advancement to S3.`
}

function derivePrimaryBlockingCondition(debtVisibility) {
  if (!debtVisibility) return null
  if (debtVisibility.operational_exposure === 'HIGH') return 'Grounding gaps — domains without structural backing'
  if (debtVisibility.operational_exposure === 'MEDIUM') return 'Partial grounding — enrichment residuals require evidence'
  return 'Semantic debt — qualification gaps remain'
}

function deriveProgressionNarrative(trustPosture) {
  if (!trustPosture) return null
  const target = trustPosture.progression_target || 'S3'
  const readiness = trustPosture.progression_readiness
  const readinessPct = readiness != null ? Math.round(readiness * 100) : null
  const targetMeta = S_STATE_NARRATIVE[target]
  const targetLabel = targetMeta ? targetMeta.label : target
  if (readinessPct != null) {
    return `Progression readiness toward ${targetLabel} is at ${readinessPct}%.`
  }
  return `Target state: ${targetLabel}.`
}

function deriveResolutionPath(debtVisibility, trustPosture) {
  if (!debtVisibility || !trustPosture) return null
  const reducible = debtVisibility.reducible_count
  const irreducible = debtVisibility.irreducible_count
  const target = trustPosture.progression_target || 'S3'
  const parts = []
  if (reducible != null && reducible > 0) {
    parts.push(`${reducible} items are reducible through evidence enrichment`)
  }
  if (irreducible != null && irreducible > 0) {
    parts.push(`${irreducible} require structural evidence from the client`)
  }
  if (parts.length === 0) return `Resolution of remaining debt would advance qualification to ${target}.`
  return `${parts.join('; ')}. Resolution would advance qualification to ${target}.`
}

export default function SQOIntelligenceZone({ binding, densityClass, boardroomMode }) {
  if (!binding || !binding.available) return null
  if (boardroomMode) return null

  const tp = binding.trustPosture
  const dv = binding.debtVisibility
  const pv = binding.propagationVisibility
  if (!tp) return null

  const sState = tp.s_state || 'S0'
  const meta = S_STATE_NARRATIVE[sState] || S_STATE_NARRATIVE.S0
  const blockingNarrative = deriveBlockingNarrative(dv)
  const primaryCondition = derivePrimaryBlockingCondition(dv)
  const progressionNarrative = deriveProgressionNarrative(tp)
  const resolutionPath = deriveResolutionPath(dv, tp)

  const cockpitHref = `/sqo/client/${DEFAULT_BINDING_CLIENT}/run/${DEFAULT_BINDING_RUN}`

  return (
    <div className="sqo-intelligence" data-s-state={sState}>
      <div className="sqo-intelligence-header">
        <div className="sqo-intelligence-label">QUALIFICATION INTELLIGENCE</div>
      </div>

      <div className="sqo-intelligence-narrative">
        <div className="sqo-intelligence-state">
          <span className="sqo-intelligence-state-badge">{sState}</span>
          <span className="sqo-intelligence-state-text">Qualification state: {meta.label}.</span>
        </div>

        <div className="sqo-intelligence-description">{meta.description}</div>

        {blockingNarrative && (
          <div className="sqo-intelligence-line sqo-intelligence-line--debt">{blockingNarrative}</div>
        )}

        {primaryCondition && (
          <div className="sqo-intelligence-line sqo-intelligence-line--condition">
            Primary blocking condition: {primaryCondition}.
          </div>
        )}

        {resolutionPath && (
          <div className="sqo-intelligence-line sqo-intelligence-line--resolution">{resolutionPath}</div>
        )}

        {progressionNarrative && (
          <div className="sqo-intelligence-line sqo-intelligence-line--progression">{progressionNarrative}</div>
        )}
      </div>

      <div className="sqo-intelligence-footer">
        <a className="sqo-intelligence-link" href={cockpitHref}>
          SQO Cockpit — operational drill-down
        </a>
      </div>
    </div>
  )
}
