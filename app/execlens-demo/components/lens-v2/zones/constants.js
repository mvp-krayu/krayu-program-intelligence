export const PRESSURE_META = {
  HIGH:     { color: '#ff6b6b', label: 'HIGH',     symbol: '▲' },
  ELEVATED: { color: '#ff9e4a', label: 'ELEVATED', symbol: '△' },
  MODERATE: { color: '#ffd700', label: 'MODERATE', symbol: '◇' },
  LOW:      { color: '#64ffda', label: 'LOW',      symbol: '○' },
}

export const ROLE_META = {
  ORIGIN:       { label: 'ORIGIN',       symbol: '◉', color: '#ff6b6b' },
  PASS_THROUGH: { label: 'PASS-THROUGH', symbol: '→', color: '#ff9e4a' },
  RECEIVER:     { label: 'RECEIVER',     symbol: '◎', color: '#ffd700' },
}

export const STATE_LABELS = {
  EXECUTIVE_READY:                'EXECUTIVE READY',
  EXECUTIVE_READY_WITH_QUALIFIER: 'EXECUTIVE READY — QUALIFIED',
  DIAGNOSTIC_ONLY:                'DIAGNOSTIC ONLY',
  BLOCKED:                        'BLOCKED',
}

export const DEFAULT_BINDING_CLIENT = 'blueedge'
export const DEFAULT_BINDING_RUN = 'run_blueedge_productized_01_fixed'
