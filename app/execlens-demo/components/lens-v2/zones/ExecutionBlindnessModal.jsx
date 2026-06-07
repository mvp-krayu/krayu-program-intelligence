import { useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'

const RT_CONDITION_TYPES = new Set([
  'EVENT_CONCENTRATION','RUNTIME_DEPENDENCY_CHOKE_POINT','BROKER_DEPENDENCY',
  'TOPIC_FANOUT_PRESSURE','ASYNC_PROPAGATION_ASYMMETRY',
  'EDGE_CLOUD_PROPAGATION_RISK','RUNTIME_OBSERVABILITY_GAP',
])

const BLINDNESS_CONFIG = {
  BOUNDARY: {
    label: 'Boundary Blindness',
    subtitle: 'Critical dependencies exist outside the software boundary',
    color: '#ff4757',
    icon: '◇',
    conditions: ['BROKER_DEPENDENCY', 'EDGE_CLOUD_PROPAGATION_RISK'],
    capability: 'Field telemetry ingestion / edge-cloud data continuity',
    failure: 'Cloud application remains healthy while field data silently stops arriving',
  },
  SILENCE: {
    label: 'Silence Blindness',
    subtitle: 'Failure produces absence of signal, not observable error',
    color: '#ff6b6b',
    icon: '○',
    conditions: ['RUNTIME_DEPENDENCY_CHOKE_POINT', 'ASYNC_PROPAGATION_ASYMMETRY'],
    capability: 'Real-time operational visibility',
    failure: 'Backend processing continues but live operational visibility goes dark',
  },
  COUPLING: {
    label: 'Coupling Blindness',
    subtitle: 'Runtime coordination blast radius exceeds static prediction',
    color: '#ff9e4a',
    icon: '◉',
    conditions: ['EVENT_CONCENTRATION', 'TOPIC_FANOUT_PRESSURE'],
    capability: 'Cross-domain operational coordination',
    failure: 'Event bus failure interrupts coordination across all affected domains simultaneously',
  },
}

function resolveLabel(domainId, registry) {
  if (!registry) return domainId
  const d = registry.find(r => r.domain_id === domainId)
  return d ? (d.business_label || d.domain_name || domainId) : domainId
}

function resolveRole(domainId, registry) {
  if (!registry) return null
  const d = registry.find(r => r.domain_id === domainId)
  if (!d || !d.role_classification) return null
  const SHORT = { FOUNDATION: 'Foundation', SHARED_LIBRARY: 'Shared Library', EXECUTION_ENGINE: 'Execution Engine', API_BOUNDARY: 'API', AUTH_BOUNDARY: 'Auth', TEST_INFRASTRUCTURE: 'Test', CLIENT_INTERFACE: 'Client', STREAMING_INTERFACE: 'Streaming', BUILD_INFRASTRUCTURE: 'Build', APPLICATION_DOMAIN: 'Application', UTILITY: 'Utility' }
  return SHORT[d.role_classification] || d.role_classification
}

export function useBlindnessData(fullReport) {
  const registry = fullReport?.semantic_domain_registry || []
  const conditions = (fullReport?._synthesisResult?.conditions || [])

  return useMemo(() => {
    const result = {}
    for (const [type, config] of Object.entries(BLINDNESS_CONFIG)) {
      const matched = conditions.filter(c => config.conditions.includes(c.condition_type) && c.severity !== 'NOMINAL')
      const domainIds = [...new Set(matched.flatMap(c => (c.shared_topology_targets?.domains || [])))]
      result[type] = {
        ...config,
        conditions: matched,
        domains: domainIds.map(id => ({ id, label: resolveLabel(id, registry), role: resolveRole(id, registry) })),
        domainCount: domainIds.length,
      }
    }
    const totalAffected = new Set(
      Object.values(result).flatMap(b => b.conditions.flatMap(c => c.shared_topology_targets?.domains || []))
    ).size
    const activeTypes = Object.values(result).filter(b => b.conditions.length > 0).length
    return { blindnessTypes: result, totalAffected, activeTypes }
  }, [conditions, registry])
}

export function useGravityData(fullReport) {
  const registry = fullReport?.semantic_domain_registry || []
  const conditions = (fullReport?._synthesisResult?.conditions || [])

  return useMemo(() => {
    const staticDomains = new Set()
    const runtimeDomains = new Set()

    for (const c of conditions) {
      if (c.severity === 'NOMINAL') continue
      const domains = (c.shared_topology_targets?.domains || [])
      if (RT_CONDITION_TYPES.has(c.condition_type)) {
        domains.forEach(id => runtimeDomains.add(id))
      } else {
        domains.forEach(id => staticDomains.add(id))
      }
    }

    const overlap = [...staticDomains].filter(id => runtimeDomains.has(id))
    const staticOnly = [...staticDomains].filter(id => !runtimeDomains.has(id))
    const runtimeOnly = [...runtimeDomains].filter(id => !staticDomains.has(id))

    return {
      staticOnly: staticOnly.map(id => ({ id, label: resolveLabel(id, registry), role: resolveRole(id, registry) })),
      runtimeOnly: runtimeOnly.map(id => ({ id, label: resolveLabel(id, registry), role: resolveRole(id, registry) })),
      overlap: overlap.map(id => ({ id, label: resolveLabel(id, registry), role: resolveRole(id, registry) })),
      staticConditions: conditions.filter(c => !RT_CONDITION_TYPES.has(c.condition_type) && c.severity !== 'NOMINAL'),
      runtimeConditions: conditions.filter(c => RT_CONDITION_TYPES.has(c.condition_type) && c.severity !== 'NOMINAL'),
    }
  }, [conditions, registry])
}

export function ExecutionBlindnessInline({ fullReport, onOpenDeepDive }) {
  const { blindnessTypes, totalAffected, activeTypes } = useBlindnessData(fullReport)

  return (
    <div className="rt-inline-detail rt-inline-detail--eb">
      <div className="rt-inline-header">
        <span className="rt-inline-stat"><strong className="rt-inline-stat-value rt-inline-stat--critical">{totalAffected}</strong> domains affected</span>
        <span className="rt-inline-sep">·</span>
        <span className="rt-inline-stat">{activeTypes} blindness types active</span>
        <span className="rt-inline-sep">·</span>
        <span className="rt-inline-stat">Evidence: EVENT_FLOW, MQTT, WEBSOCKET</span>
      </div>
      <div className="rt-inline-blindness-grid">
        {Object.entries(blindnessTypes).map(([type, data]) => (
          <div key={type} className={`rt-inline-blindness-type${data.conditions.length === 0 ? ' rt-inline-blindness-type--inactive' : ''}`} style={{ '--blindness-color': data.color }}>
            <div className="rt-inline-blindness-label">
              <span className="rt-inline-blindness-icon">{data.icon}</span>
              <span className="rt-inline-blindness-name">{data.label}</span>
            </div>
            {data.conditions.length > 0 ? (
              <>
                <div className="rt-inline-blindness-conditions">
                  {data.conditions.map((c, i) => (
                    <div key={i} className="rt-inline-blindness-condition">
                      <span className="rt-inline-blindness-condition-name">{c.condition_label || c.condition_type}</span>
                      <span className="rt-inline-blindness-condition-sev">{c.severity}</span>
                    </div>
                  ))}
                </div>
                <div className="rt-inline-blindness-domains">
                  {data.domains.map((d, i) => (
                    <span key={i} className="domain-chip" data-severity="CRITICAL" style={{ '--chip-color': data.color }}>
                      {d.label}
                      {d.role && <span className="domain-chip-role">{d.role}</span>}
                    </span>
                  ))}
                </div>
                <div className="rt-inline-blindness-failure">{data.failure}</div>
              </>
            ) : (
              <div className="rt-inline-blindness-absent">No evidence in current assessment</div>
            )}
          </div>
        ))}
      </div>
      {onOpenDeepDive && (
        <button className="rt-inline-deep-dive" onClick={onOpenDeepDive} type="button">Open deep dive</button>
      )}
    </div>
  )
}

export function GravityDivergenceInline({ fullReport, onOpenDeepDive }) {
  const gravityData = useGravityData(fullReport)

  const DomainList = ({ items, color }) => (
    <div className="rt-inline-gravity-domains">
      {items.length > 0 ? items.map((d, i) => (
        <span key={i} className="domain-chip" data-severity="CRITICAL" style={{ '--chip-color': color }}>
          {d.label}
          {d.role && <span className="domain-chip-role">{d.role}</span>}
        </span>
      )) : (
        <span className="rt-inline-gravity-none">None</span>
      )}
    </div>
  )

  return (
    <div className="rt-inline-detail rt-inline-detail--gd">
      <div className="rt-inline-gravity-columns">
        <div className="rt-inline-gravity-col" style={{ '--gravity-color': '#4a9eff' }}>
          <div className="rt-inline-gravity-col-title">Code Gravity</div>
          <div className="rt-inline-gravity-col-sub">Where the import graph is heavy</div>
          <DomainList items={gravityData.staticOnly} color="#4a9eff" />
          {gravityData.staticConditions.length > 0 && (
            <div className="rt-inline-gravity-conditions">
              {gravityData.staticConditions.slice(0, 3).map((c, i) => (
                <div key={i} className="rt-inline-gravity-condition">
                  <span style={{ color: '#4a9eff' }}>{c.severity}</span> · {c.condition_label || c.condition_type}
                </div>
              ))}
              {gravityData.staticConditions.length > 3 && <div className="rt-inline-gravity-more">+{gravityData.staticConditions.length - 3} more</div>}
            </div>
          )}
        </div>
        <div className="rt-inline-gravity-col" style={{ '--gravity-color': '#b392f0' }}>
          <div className="rt-inline-gravity-col-title">Shared</div>
          <div className="rt-inline-gravity-col-sub">Both gravity fields present</div>
          <DomainList items={gravityData.overlap} color="#b392f0" />
        </div>
        <div className="rt-inline-gravity-col" style={{ '--gravity-color': '#ff9e4a' }}>
          <div className="rt-inline-gravity-col-title">Operational Gravity</div>
          <div className="rt-inline-gravity-col-sub">Where the system actually runs</div>
          <DomainList items={gravityData.runtimeOnly} color="#ff9e4a" />
          {gravityData.runtimeConditions.length > 0 && (
            <div className="rt-inline-gravity-conditions">
              {gravityData.runtimeConditions.slice(0, 3).map((c, i) => (
                <div key={i} className="rt-inline-gravity-condition">
                  <span style={{ color: '#ff9e4a' }}>{c.severity}</span> · {c.condition_label || c.condition_type}
                </div>
              ))}
              {gravityData.runtimeConditions.length > 3 && <div className="rt-inline-gravity-more">+{gravityData.runtimeConditions.length - 3} more</div>}
            </div>
          )}
        </div>
      </div>
      <div className="rt-inline-gravity-summary">
        {gravityData.runtimeOnly.length > 0 ? (
          <>Code center of mass and operational center of mass diverge. <strong style={{ color: '#ff9e4a' }}>{gravityData.runtimeOnly.length}</strong> domain{gravityData.runtimeOnly.length !== 1 ? 's carry' : ' carries'} operational gravity without corresponding static code weight.</>
        ) : (
          'Static and operational gravity coincide — no divergence detected.'
        )}
      </div>
      {onOpenDeepDive && (
        <button className="rt-inline-deep-dive" onClick={onOpenDeepDive} type="button">Open deep dive</button>
      )}
    </div>
  )
}

function ModalPortal({ children, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  if (typeof document === 'undefined') return null
  return createPortal(children, document.body)
}

export function ExecutionBlindnessModal({ fullReport, onClose }) {
  const { blindnessTypes, totalAffected } = useBlindnessData(fullReport)

  return (
    <ModalPortal onClose={onClose}>
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(10, 12, 20, 0.97)', zIndex: 99999,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      overflow: 'auto', padding: '40px 24px',
    }} onClick={onClose}>
      <div style={{ maxWidth: 1100, width: '100%' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: '#e0e6f0', letterSpacing: '-0.02em', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
              Execution Blindness
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 15, color: '#7a8aaa', fontFamily: '-apple-system, sans-serif' }}>
              What can fail while the organization believes it is healthy
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid #2a2f40', borderRadius: 6,
            color: '#7a8aaa', padding: '6px 14px', cursor: 'pointer', fontSize: 13,
          }}>Close</button>
        </div>

        <div style={{
          display: 'flex', gap: 8, marginBottom: 32, padding: '12px 16px',
          background: '#141720', borderRadius: 8, border: '1px solid #1e2333',
        }}>
          <span style={{ fontSize: 13, color: '#7a8aaa' }}>
            <strong style={{ color: '#ff4757' }}>{totalAffected}</strong> domains affected by execution blindness
          </span>
          <span style={{ color: '#2a2f40' }}>|</span>
          <span style={{ fontSize: 13, color: '#7a8aaa' }}>
            {Object.values(blindnessTypes).filter(b => b.conditions.length > 0).length} blindness types active
          </span>
          <span style={{ color: '#2a2f40' }}>|</span>
          <span style={{ fontSize: 13, color: '#7a8aaa' }}>
            Evidence: EVENT_FLOW, MQTT_TOPIC_FLOW, WEBSOCKET_FLOW
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          {Object.entries(blindnessTypes).map(([type, data]) => (
            <div key={type} style={{
              background: '#141720', borderRadius: 10, border: `1px solid ${data.conditions.length > 0 ? data.color + '30' : '#1e2333'}`,
              padding: 24, opacity: data.conditions.length > 0 ? 1 : 0.4,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 20, color: data.color }}>{data.icon}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#e0e6f0' }}>{data.label}</h3>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#5e6d8a' }}>{data.subtitle}</p>
                </div>
              </div>

              {data.conditions.length > 0 ? (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: '#5e6d8a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Runtime Evidence</div>
                    {data.conditions.map((c, i) => (
                      <div key={i} style={{
                        padding: '8px 10px', marginBottom: 4,
                        background: '#0d0f17', borderRadius: 6, border: '1px solid #1e2333',
                      }}>
                        <div style={{ fontSize: 13, color: '#ccd6f6', fontWeight: 500 }}>{c.condition_label || c.condition_type}</div>
                        <div style={{ fontSize: 11, color: '#7a8aaa', marginTop: 2 }}>
                          {c.severity} · {c.measurement_basis || c.evidence_class || ''}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: '#5e6d8a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Affected Domains</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {data.domains.map((d, i) => (
                        <span key={i} style={{
                          fontSize: 11, padding: '3px 8px', borderRadius: 4,
                          background: data.color + '15', color: data.color, border: `1px solid ${data.color}30`,
                        }}>{d.label}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: '#5e6d8a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Business Capability</div>
                    <div style={{ fontSize: 13, color: '#9aa4c0' }}>{data.capability}</div>
                  </div>

                  <div style={{
                    padding: '10px 12px', borderRadius: 6,
                    background: data.color + '10', border: `1px solid ${data.color}20`,
                  }}>
                    <div style={{ fontSize: 11, color: data.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Failure Implication</div>
                    <div style={{ fontSize: 13, color: '#ccd6f6', lineHeight: 1.5 }}>{data.failure}</div>
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 13, color: '#5e6d8a', fontStyle: 'italic', padding: '20px 0' }}>
                  No evidence for this blindness type in current assessment
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 32, padding: '16px 20px',
          background: '#141720', borderRadius: 8, border: '1px solid #1e2333',
        }}>
          <div style={{ fontSize: 13, color: '#e0e6f0', fontWeight: 500, marginBottom: 8 }}>The Executive Summary</div>
          <div style={{ fontSize: 14, color: '#9aa4c0', lineHeight: 1.6 }}>
            This system has {Object.values(blindnessTypes).filter(b => b.conditions.length > 0).length} active
            forms of execution blindness across {totalAffected} operational domains.
            The platform can report healthy while its operational backbone is failing.
            Static code analysis cannot detect these conditions — they are only visible through
            runtime connectivity evidence.
          </div>
        </div>
      </div>
    </div>
    </ModalPortal>
  )
}

export function GravityDivergenceModal({ fullReport, onClose }) {
  const gravityData = useGravityData(fullReport)

  const Column = ({ title, subtitle, color, domains, conditions: conds }) => (
    <div style={{
      background: '#141720', borderRadius: 10, border: `1px solid ${color}30`,
      padding: 24, flex: 1,
    }}>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color }}>{title}</h3>
      <p style={{ margin: '4px 0 16px', fontSize: 12, color: '#5e6d8a' }}>{subtitle}</p>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: '#5e6d8a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Gravity Loci</div>
        {domains.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {domains.map((d, i) => (
              <span key={i} style={{
                fontSize: 13, padding: '5px 10px', borderRadius: 5,
                background: color + '12', color, border: `1px solid ${color}25`,
              }}>{d.label}</span>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: '#5e6d8a', fontStyle: 'italic' }}>None</div>
        )}
      </div>

      {conds && conds.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: '#5e6d8a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Structural Conditions</div>
          {conds.slice(0, 5).map((c, i) => (
            <div key={i} style={{ fontSize: 12, color: '#9aa4c0', padding: '4px 0' }}>
              <span style={{ color }}>{c.severity}</span> · {c.condition_label || c.condition_type}
            </div>
          ))}
          {conds.length > 5 && <div style={{ fontSize: 11, color: '#5e6d8a' }}>+{conds.length - 5} more</div>}
        </div>
      )}
    </div>
  )

  return (
    <ModalPortal onClose={onClose}>
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(10, 12, 20, 0.97)', zIndex: 99999,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      overflow: 'auto', padding: '40px 24px',
    }} onClick={onClose}>
      <div style={{ maxWidth: 1100, width: '100%' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: '#e0e6f0', letterSpacing: '-0.02em', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
              Gravity Divergence
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 15, color: '#7a8aaa', fontFamily: '-apple-system, sans-serif' }}>
              Where code gravity and operational gravity diverge — AF-001 [CRITICAL]
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid #2a2f40', borderRadius: 6,
            color: '#7a8aaa', padding: '6px 14px', cursor: 'pointer', fontSize: 13,
          }}>Close</button>
        </div>

        <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
          <Column
            title="Code Center of Mass"
            subtitle="Where the import graph is heavy"
            color="#4a9eff"
            domains={gravityData.staticOnly}
            conditions={gravityData.staticConditions}
          />
          <Column
            title="Shared"
            subtitle="Both gravity fields present"
            color="#b392f0"
            domains={gravityData.overlap}
          />
          <Column
            title="Operational Center of Mass"
            subtitle="Where the system actually runs"
            color="#ff9e4a"
            domains={gravityData.runtimeOnly}
            conditions={gravityData.runtimeConditions}
          />
        </div>

        <div style={{
          padding: '16px 20px',
          background: '#141720', borderRadius: 8, border: '1px solid #1e2333',
        }}>
          <div style={{ fontSize: 13, color: '#e0e6f0', fontWeight: 500, marginBottom: 8 }}>The Divergence</div>
          <div style={{ fontSize: 14, color: '#9aa4c0', lineHeight: 1.6 }}>
            {gravityData.runtimeOnly.length > 0 ? (
              <>
                The code center of mass and the operational center of mass do not fully coincide.
                {' '}<strong style={{ color: '#ff9e4a' }}>{gravityData.runtimeOnly.length}</strong> domain{gravityData.runtimeOnly.length !== 1 ? 's carry' : ' carries'} operational
                gravity without corresponding static code weight.
                Transformation planning based solely on static code analysis targets the wrong center of mass
                for operational resilience.
              </>
            ) : (
              'Static and operational gravity coincide — no divergence detected in current evidence.'
            )}
          </div>
        </div>
      </div>
    </div>
    </ModalPortal>
  )
}
