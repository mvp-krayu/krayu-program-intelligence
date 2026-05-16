import { useState, useMemo, useCallback } from 'react'
import {
  DeclarationZone,
  QualifierMandate,
  GovernanceRibbon,
  SemanticTrustPostureZone,
  ReconciliationAwarenessZone,
  IntelligenceField,
  SQOIntelligenceZone,
  EvidenceDepthLayer,
} from './zones'

const { resolveLayoutDirectives, getEffectiveSequence } = require('../../lib/lens-v2/ConditionDrivenLayoutResolver')

const TIER_ORDER = ['tier0', 'tier1', 'tier2', 'tier3']

const ZONE_LABELS = {
  DeclarationZone: 'Declaration',
  GovernanceRibbon: 'Governance',
  QualifierMandate: 'Qualifier',
  SemanticTrustPostureZone: 'Trust Posture',
  ReconciliationAwarenessZone: 'Reconciliation',
  IntelligenceField: 'Intelligence Field',
  SQOIntelligenceZone: 'Qualification Intelligence',
  EvidenceDepthLayer: 'Evidence Depth',
}

const SEVERITY_INDICATORS = {
  CRITICAL: { symbol: '●', label: 'critical' },
  ELEVATED: { symbol: '◐', label: 'elevated' },
  AMBIENT: { symbol: '○', label: 'ambient' },
}

function shouldCollapseTier(tier, persona) {
  if (tier === 'tier0' || tier === 'tier1') return false
  if (tier === 'tier2') {
    if (persona === 'INVESTIGATION_DENSE') return false
    return true
  }
  return true
}

function CollapsedTierSummary({ entries, severityMap, tier, onExpand }) {
  return (
    <div className="disclosure-collapsed" data-tier={tier}>
      <div className="disclosure-collapsed-inner">
        <div className="disclosure-collapsed-zones">
          {entries.map(entry => {
            const ind = SEVERITY_INDICATORS[severityMap[entry.zone]] || SEVERITY_INDICATORS.AMBIENT
            return (
              <span key={entry.zone} className="disclosure-collapsed-chip" data-severity={severityMap[entry.zone]}>
                <span className="disclosure-collapsed-chip-dot">{ind.symbol}</span>
                <span className="disclosure-collapsed-chip-name">{ZONE_LABELS[entry.zone] || entry.zone}</span>
              </span>
            )
          })}
        </div>
        <button
          className="disclosure-collapsed-expand"
          onClick={onExpand}
          type="button"
          aria-expanded="false"
          aria-label={`Expand ${entries.length} additional intelligence zones`}
        >
          <span className="disclosure-collapsed-expand-label">
            {entries.length} zone{entries.length !== 1 ? 's' : ''} available
          </span>
          <span className="disclosure-collapsed-expand-caret">▾</span>
        </button>
      </div>
    </div>
  )
}

export default function LensDisclosureShell({
  renderState,
  densityClass,
  boardroomMode,
  substrateBinding,
  reconciliationAwareness,
  qualifierClass,
  qualifierVisible,
  adapted,
  governance,
  qualifierLabel,
  qualifierNote,
  domainTraceability,
  narrative,
  evidenceBlocks,
  fullReport,
  reportPackArtifacts,
  propagationChains,
  correspondenceData,
  evidenceIntakeData,
  debtIndexData,
  progressionData,
  maturityData,
  temporalAnalyticsData,
  temporalLifecycleData,
  onModeTransition,
  pendingTransitionZone,
  onTransitionZoneConsumed,
  authorityTier = 'INVESTIGATIVE',
}) {
  const directives = useMemo(() => {
    return resolveLayoutDirectives({
      renderState,
      substrateBinding,
      reconciliationAwareness,
      qualifierClass,
      qualifierVisible,
      evidenceAvailable: !!(evidenceBlocks && evidenceBlocks.length),
      densityClass,
      boardroomMode,
    })
  }, [renderState, substrateBinding, reconciliationAwareness, qualifierClass, qualifierVisible, evidenceBlocks, densityClass, boardroomMode])

  const sequence = useMemo(() => getEffectiveSequence(directives), [directives])

  const tierGroups = useMemo(() => {
    const groups = {}
    for (const entry of sequence) {
      if (!groups[entry.tier]) groups[entry.tier] = []
      groups[entry.tier].push(entry)
    }
    return groups
  }, [sequence])

  const persona = directives.diagnostics.persona
  const [expandedTiers, setExpandedTiers] = useState({})
  const [governanceExpanded, setGovernanceExpanded] = useState(false)
  const [activeAuthorityTier, setActiveAuthorityTier] = useState(authorityTier)
  const handleAuthorityChange = useCallback((tier) => {
    setActiveAuthorityTier(tier || authorityTier)
  }, [authorityTier])

  const toggleTier = useCallback((tier) => {
    setExpandedTiers(prev => ({ ...prev, [tier]: !prev[tier] }))
  }, [])

  function isTierExpanded(tier) {
    if (expandedTiers[tier] !== undefined) return expandedTiers[tier]
    return !shouldCollapseTier(tier, persona)
  }

  function renderZone(zoneName) {
    switch (zoneName) {
      case 'DeclarationZone':
        if (renderState === 'BLOCKED') return null
        return <DeclarationZone renderState={renderState} adapted={adapted} boardroomMode={boardroomMode} fullReport={fullReport} />
      case 'QualifierMandate':
        return (
          <QualifierMandate
            qualifierClass={qualifierClass}
            qualifierLabel={qualifierLabel}
            qualifierNote={qualifierNote}
            visible={qualifierVisible}
          />
        )
      case 'GovernanceRibbon':
        return <GovernanceRibbon governance={governance} />
      case 'SemanticTrustPostureZone':
        return (
          <SemanticTrustPostureZone
            binding={substrateBinding}
            densityClass={densityClass}
            boardroomMode={boardroomMode}
          />
        )
      case 'ReconciliationAwarenessZone':
        return (
          <ReconciliationAwarenessZone
            awareness={reconciliationAwareness}
            densityClass={densityClass}
            boardroomMode={boardroomMode}
            domainTraceability={domainTraceability}
          />
        )
      case 'IntelligenceField':
        return (
          <IntelligenceField
            narrative={narrative}
            adapted={adapted}
            densityClass={densityClass}
            boardroomMode={boardroomMode}
            renderState={renderState}
            evidenceBlocks={evidenceBlocks}
            fullReport={fullReport}
            reportPackArtifacts={reportPackArtifacts}
            qualifierClass={qualifierClass}
            qualifierLabel={qualifierLabel}
            correspondenceData={correspondenceData}
            evidenceIntakeData={evidenceIntakeData}
            debtIndexData={debtIndexData}
            progressionData={progressionData}
            maturityData={maturityData}
            temporalAnalyticsData={temporalAnalyticsData}
            temporalLifecycleData={temporalLifecycleData}
            onModeTransition={onModeTransition}
            pendingTransitionZone={pendingTransitionZone}
            onTransitionZoneConsumed={onTransitionZoneConsumed}
            onAuthorityChange={handleAuthorityChange}
          />
        )
      case 'SQOIntelligenceZone':
        return (
          <SQOIntelligenceZone
            binding={substrateBinding}
            densityClass={densityClass}
            boardroomMode={boardroomMode}
          />
        )
      case 'EvidenceDepthLayer':
        return (
          <EvidenceDepthLayer
            evidenceBlocks={evidenceBlocks}
            densityClass={densityClass}
            signalInterpretations={fullReport && fullReport.signal_interpretations}
          />
        )
      default:
        return null
    }
  }

  const { escalationBanner, diagnostics } = directives

  return (
    <div
      className="disclosure-shell"
      data-persona={persona}
      data-active-zones={diagnostics.activeZones}
    >
      {escalationBanner.active && (
        <div className="disclosure-escalation" role="status" aria-atomic="true">
          <span className="disclosure-escalation-count">{escalationBanner.criticalCount}</span>
          <span className="disclosure-escalation-label">
            critical condition{escalationBanner.criticalCount !== 1 ? 's' : ''} detected
          </span>
          <span className="disclosure-escalation-zones">
            {escalationBanner.zones.join(' · ')}
          </span>
        </div>
      )}

      {TIER_ORDER.map(tier => {
        const entries = tierGroups[tier]
        if (!entries || entries.length === 0) return null

        const expanded = isTierExpanded(tier)

        if (!expanded) {
          return (
            <CollapsedTierSummary
              key={tier}
              entries={entries}
              severityMap={diagnostics.severityMap}
              tier={tier}
              onExpand={() => toggleTier(tier)}
            />
          )
        }

        return (
          <div
            key={tier}
            className={`disclosure-tier disclosure-tier--${tier.replace('tier', '')}`}
            data-tier={tier}
            data-zone-count={entries.length}
            data-expanded="true"
          >
            {shouldCollapseTier(tier, persona) && (
              <button
                className="disclosure-tier-collapse"
                onClick={() => toggleTier(tier)}
                type="button"
                aria-label={`Collapse ${tier} zones`}
              >
                <span className="disclosure-tier-collapse-label">▴ collapse</span>
              </button>
            )}
            {entries.map(entry => {
              const rendered = renderZone(entry.zone)
              if (rendered === null) return null
              return (
                <div
                  key={entry.zone}
                  className={`disclosure-zone${entry.promoted ? ' disclosure-zone--promoted' : ''}`}
                  data-zone={entry.zone}
                  data-severity={diagnostics.severityMap[entry.zone]}
                >
                  {rendered}
                </div>
              )
            })}
          </div>
        )
      })}

      <footer className="disclosure-footer" aria-label="Governance envelope">
        <div className="disclosure-footer-inner">
          <div className="disclosure-footer-status">
            <span className="disclosure-footer-dot" />
            <span className="disclosure-footer-status-label">GOVERNANCE ENVELOPE ACTIVE</span>
          </div>
          <span className="disclosure-footer-prohibition">
            {activeAuthorityTier === 'PI_INTERPRETIVE'
              ? 'Structural depth active · bounded interpretation (75.x) · evidence-bound · 13 prohibitions enforced'
              : activeAuthorityTier === 'INTERPRETIVE'
              ? 'Structural derivation primary · bounded interpretive synthesis active · evidence-bound'
              : 'All outputs structurally derived · no inference · no AI-generated interpretation'}
          </span>
          {qualifierClass && qualifierClass !== 'Q-01' && qualifierClass !== 'Q-04' && qualifierClass !== 'Q-00' && (
            <span className="disclosure-footer-qualifier">Qualifier {qualifierClass} in effect</span>
          )}
          <button
            className="disclosure-footer-expand"
            onClick={() => setGovernanceExpanded(prev => !prev)}
            type="button"
            aria-expanded={governanceExpanded}
            aria-label="Toggle governance details"
          >
            {governanceExpanded ? '▴' : '▾'}
          </button>
        </div>
        {governanceExpanded && (
          <div className="disclosure-footer-details">
            <div className="disclosure-footer-detail-row">Inference prohibition: {activeAuthorityTier === 'PI_INTERPRETIVE' ? 'BOUNDED (75.x) · structural depth' : activeAuthorityTier === 'INTERPRETIVE' ? 'BOUNDED (75.x)' : 'ENFORCED'}</div>
            <div className="disclosure-footer-detail-row">Structural derivation: VERIFIED</div>
            <div className="disclosure-footer-detail-row">Guided queries: STRUCTURALLY DERIVED</div>
            <div className="disclosure-footer-detail-row">Interpretive authority: {activeAuthorityTier === 'PI_INTERPRETIVE' ? 'STRUCTURAL DEPTH ACTIVE' : activeAuthorityTier === 'INTERPRETIVE' ? 'ACTIVE' : 'INACTIVE'}</div>
            {activeAuthorityTier === 'PI_INTERPRETIVE' && (
              <div className="disclosure-footer-detail-row">Interaction authority: ESCALATED</div>
            )}
            <div className="disclosure-footer-detail-row">Qualifier governance: {qualifierClass || 'Q-01'}</div>
          </div>
        )}
      </footer>
    </div>
  )
}
