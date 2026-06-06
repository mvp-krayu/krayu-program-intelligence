// EIR Graphics — deterministic SVG generation for executive report chapters.
// Same PICP + same context → same SVG output. No AI participation.
// Embeds inline in the EIR HTML — no external assets.

const SEV_COLOR = {
  CRITICAL: '#ff6b6b',
  HIGH: '#ff9e4a',
  ELEVATED: '#ffd700',
  MODERATE: '#4a9eff',
  LOW: '#64ffda',
  NOMINAL: '#7a8aaa',
}

const CLASS_COLOR = {
  A: '#4a9eff',
  B: '#ff9e4a',
  C: '#ff6b6b',
  D: '#ffd700',
  E: '#64ffda',
}

const CLASS_SHORT = {
  A: 'Flow',
  B: 'Concentration',
  C: 'Fragility',
  D: 'Reinforcement',
  E: 'Drift',
}

const CONSEQUENCE_SHORT = {
  DEL_EXP: 'Delivery Exp.',
  PROP_EXP: 'Propagation Exp.',
  RESIL_DEF: 'Resilience Def.',
  GOV_GAP: 'Governance Gap',
  SYSTEMIC_OP_FRAG: 'Systemic Fragility',
  AMPLIFIED_DEP_FRAG: 'Amplified Dep.',
  STRUCT_GRAVITY_WELL: 'Gravity Well',
  COORD_FRAG: 'Coordination Frag.',
  DEP_AMP: 'Dependency Amp.',
  OP_BOTTLENECK: 'Bottleneck',
  STAB_RISK: 'Stability Risk',
}

function generateChapterGraphics(picp, context) {
  const objects = picp.cognition_objects || {}
  const ctx = context || {}
  const graphics = {}

  const tension = objects.tension_map || {}
  const exposure = objects.exposure_assessment || {}
  const ceiling = objects.operational_ceiling || {}
  const absence = objects.absence_profile || {}

  graphics.executive_brief = renderConvergenceMap(tension, ctx)
  graphics.pi_findings = renderConditionMatrix(ctx.conditions || [], tension)
  graphics.sw_intelligence = renderClassActivation(tension)
  graphics.operational_ceiling = renderCeilingDrivers(ceiling, ctx)

  return graphics
}


// ── Convergence Center Map (Executive Brief hero graphic) ──

function renderConvergenceMap(tension, ctx) {
  const allCenters = tension.convergence_centers || []
  if (allCenters.length === 0) return null

  const centers = allCenters.slice(0, 5)
  const count = centers.length
  const W = 840
  const H = count <= 2 ? 240 : 260
  const centerY = count <= 2 ? 120 : 130

  const nodes = centers.map((c, i) => {
    const domainIds = c.domains || []
    const firstName = domainIds.length > 0 ? domainName(domainIds[0], ctx) : 'Unknown'
    const name = domainIds.length <= 1 ? firstName : firstName + ' (+' + (domainIds.length - 1) + ')'
    let x
    if (count === 1) x = W / 2
    else if (count === 2) x = i === 0 ? W * 0.3 : W * 0.7
    else x = W * (0.12 + (i * 0.76 / (count - 1)))
    return { ...c, name, x, y: centerY, _nodeCount: count }
  })

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" style="display:block;margin:0 auto 8px;">`

  // Connection line between centers
  if (nodes.length >= 2) {
    const sharedClasses = intersect(
      nodes[0].behavioral_classes || [],
      nodes[1].behavioral_classes || []
    )
    if (sharedClasses.length > 0) {
      const x1 = nodes[0].x + 110
      const x2 = nodes[1].x - 110
      svg += `<line x1="${x1}" y1="${centerY}" x2="${x2}" y2="${centerY}" stroke="#2a2f40" stroke-width="2" stroke-dasharray="6,4"/>`
      const midX = (x1 + x2) / 2
      svg += `<text x="${midX}" y="${centerY - 10}" fill="#7a8aaa" font-family="'SF Mono','Courier New',monospace" font-size="10" text-anchor="middle">shared: ${sharedClasses.map(c => 'Class ' + c).join(', ')}</text>`
    }
  }

  // Title
  svg += `<text x="${W / 2}" y="20" fill="#7a8aaa" font-family="'SF Mono','Courier New',monospace" font-size="10" letter-spacing="2" text-anchor="middle">STRUCTURAL CONVERGENCE CENTERS</text>`

  for (const node of nodes) {
    svg += renderConvergenceNode(node)
  }

  svg += '</svg>'
  return svg
}

function renderConvergenceNode(node) {
  const x = node.x
  const y = node.y
  const sevColor = SEV_COLOR[node.severity] || '#7a8aaa'
  const nodeCount = node._nodeCount || 2
  const r = nodeCount <= 2 ? 56 : nodeCount <= 3 ? 44 : 36

  let svg = ''

  // Outer glow ring
  svg += `<circle cx="${x}" cy="${y}" r="${r + 8}" fill="none" stroke="${sevColor}" stroke-width="1" opacity="0.2"/>`
  // Main circle
  svg += `<circle cx="${x}" cy="${y}" r="${r}" fill="#1a1e2b" stroke="${sevColor}" stroke-width="2"/>`

  // Severity badge
  svg += `<rect x="${x - 28}" y="${y - 38}" width="56" height="18" rx="3" fill="${sevColor}" opacity="0.15"/>`
  svg += `<text x="${x}" y="${y - 25}" fill="${sevColor}" font-family="'SF Mono','Courier New',monospace" font-size="10" font-weight="700" text-anchor="middle">${node.severity}</text>`

  // Condition count
  svg += `<text x="${x}" y="${y + 4}" fill="#ccd6f6" font-family="-apple-system,sans-serif" font-size="22" font-weight="700" text-anchor="middle">${node.contributing_count}</text>`
  svg += `<text x="${x}" y="${y + 18}" fill="#7a8aaa" font-family="'SF Mono','Courier New',monospace" font-size="9" text-anchor="middle">conditions</text>`

  // Domain name below — split into two lines if long
  const name = truncate(node.name, 40)
  if (name.length > 22) {
    const mid = name.lastIndexOf(' ', 22)
    const line1 = mid > 0 ? name.slice(0, mid) : name.slice(0, 22)
    const line2 = mid > 0 ? name.slice(mid + 1) : name.slice(22)
    svg += `<text x="${x}" y="${y + r + 18}" fill="#ccd6f6" font-family="-apple-system,sans-serif" font-size="11" font-weight="500" text-anchor="middle">${esc(line1)}</text>`
    svg += `<text x="${x}" y="${y + r + 32}" fill="#ccd6f6" font-family="-apple-system,sans-serif" font-size="11" font-weight="500" text-anchor="middle">${esc(line2)}</text>`
  } else {
    svg += `<text x="${x}" y="${y + r + 22}" fill="#ccd6f6" font-family="-apple-system,sans-serif" font-size="12" font-weight="500" text-anchor="middle">${esc(name)}</text>`
  }

  // Class badges below domain name
  const classes = node.behavioral_classes || []
  const classStartX = x - (classes.length * 26) / 2
  for (let i = 0; i < classes.length; i++) {
    const cx = classStartX + i * 26 + 13
    const cy = y + r + 40
    const color = CLASS_COLOR[classes[i]] || '#7a8aaa'
    svg += `<rect x="${cx - 10}" y="${cy - 8}" width="20" height="16" rx="3" fill="${color}" opacity="0.15"/>`
    svg += `<text x="${cx}" y="${cy + 4}" fill="${color}" font-family="'SF Mono','Courier New',monospace" font-size="10" font-weight="600" text-anchor="middle">${classes[i]}</text>`
  }

  return svg
}


// ── Condition Matrix (PI Findings chapter) ──

function renderConditionMatrix(conditions, tension) {
  if (conditions.length === 0) return null

  const byType = {}
  for (const c of conditions) {
    if (!byType[c.condition_type]) byType[c.condition_type] = []
    byType[c.condition_type].push(c)
  }

  const sorted = Object.entries(byType).sort((a, b) => {
    const maxA = Math.max(...a[1].map(c => sevRank(c.severity)))
    const maxB = Math.max(...b[1].map(c => sevRank(c.severity)))
    return maxB - maxA
  })

  const rowH = 32
  const labelW = 240
  const barAreaW = 560
  const W = labelW + barAreaW + 40
  const H = sorted.length * rowH + 60

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" style="display:block;margin:0 auto 8px;">`

  svg += `<text x="20" y="20" fill="#7a8aaa" font-family="'SF Mono','Courier New',monospace" font-size="10" letter-spacing="2">CONDITION TYPE</text>`
  svg += `<text x="${labelW + 20}" y="20" fill="#7a8aaa" font-family="'SF Mono','Courier New',monospace" font-size="10" letter-spacing="2">SEVERITY</text>`

  const topY = 36

  for (let i = 0; i < sorted.length; i++) {
    const [type, instances] = sorted[i]
    const y = topY + i * rowH
    const maxSev = instances.reduce((m, c) => sevRank(c.severity) > sevRank(m) ? c.severity : m, 'NOMINAL')
    const sevColor = SEV_COLOR[maxSev] || '#7a8aaa'
    const label = conditionShort(type)

    // Alternating row background
    if (i % 2 === 0) {
      svg += `<rect x="10" y="${y}" width="${W - 20}" height="${rowH}" rx="3" fill="#141720" opacity="0.5"/>`
    }

    // Label
    svg += `<text x="20" y="${y + 20}" fill="#ccd6f6" font-family="-apple-system,sans-serif" font-size="12">${esc(label)}</text>`

    // Severity bar
    const barW = Math.max(30, (sevRank(maxSev) / 5) * 200)
    svg += `<rect x="${labelW + 20}" y="${y + 6}" width="${barW}" height="${rowH - 12}" rx="3" fill="${sevColor}" opacity="0.2"/>`
    svg += `<rect x="${labelW + 20}" y="${y + 6}" width="${barW}" height="${rowH - 12}" rx="3" fill="none" stroke="${sevColor}" stroke-width="1" opacity="0.4"/>`

    // Severity label inside bar
    svg += `<text x="${labelW + 28}" y="${y + 20}" fill="${sevColor}" font-family="'SF Mono','Courier New',monospace" font-size="10" font-weight="600">${maxSev}</text>`

    // Instance count
    if (instances.length > 1) {
      svg += `<text x="${labelW + barW + 28}" y="${y + 20}" fill="#7a8aaa" font-family="'SF Mono','Courier New',monospace" font-size="10">${instances.length} instances</text>`
    }
  }

  svg += '</svg>'
  return svg
}


// ── Behavioral Class Activation (SW Intelligence chapter) ──

function renderClassActivation(tension) {
  const activation = tension.behavioral_class_activation || []
  if (activation.length === 0) return null

  const allClasses = ['A', 'B', 'C', 'D', 'E']
  const activeMap = {}
  for (const a of activation) activeMap[a.class_id] = a

  const W = 840
  const cellW = (W - 40) / 5
  const H = 140

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" style="display:block;margin:0 auto 8px;">`

  svg += `<text x="${W / 2}" y="18" fill="#7a8aaa" font-family="'SF Mono','Courier New',monospace" font-size="10" letter-spacing="2" text-anchor="middle">BEHAVIORAL CLASS ACTIVATION</text>`

  for (let i = 0; i < allClasses.length; i++) {
    const classId = allClasses[i]
    const active = activeMap[classId]
    const x = 20 + i * cellW
    const y = 32
    const w = cellW - 8
    const h = 96
    const color = CLASS_COLOR[classId] || '#7a8aaa'

    if (active) {
      svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${color}" opacity="0.08"/>`
      svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="${color}" stroke-width="1.5"/>`

      // Class ID
      svg += `<text x="${x + w / 2}" y="${y + 24}" fill="${color}" font-family="'SF Mono','Courier New',monospace" font-size="18" font-weight="700" text-anchor="middle">${classId}</text>`

      // Class name
      svg += `<text x="${x + w / 2}" y="${y + 42}" fill="#ccd6f6" font-family="-apple-system,sans-serif" font-size="11" text-anchor="middle">${CLASS_SHORT[classId] || classId}</text>`

      // Condition count
      svg += `<text x="${x + w / 2}" y="${y + 62}" fill="#7a8aaa" font-family="'SF Mono','Courier New',monospace" font-size="10" text-anchor="middle">${active.condition_count} condition${active.condition_count !== 1 ? 's' : ''}</text>`

      // Severity
      const sevColor = SEV_COLOR[active.max_severity] || '#7a8aaa'
      svg += `<rect x="${x + w / 2 - 22}" y="${y + 70}" width="44" height="16" rx="3" fill="${sevColor}" opacity="0.15"/>`
      svg += `<text x="${x + w / 2}" y="${y + 82}" fill="${sevColor}" font-family="'SF Mono','Courier New',monospace" font-size="9" font-weight="600" text-anchor="middle">${active.max_severity}</text>`
    } else {
      svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="#2a2f40" stroke-width="1" stroke-dasharray="4,4"/>`
      svg += `<text x="${x + w / 2}" y="${y + 30}" fill="#4a5570" font-family="'SF Mono','Courier New',monospace" font-size="18" font-weight="700" text-anchor="middle">${classId}</text>`
      svg += `<text x="${x + w / 2}" y="${y + 48}" fill="#4a5570" font-family="-apple-system,sans-serif" font-size="11" text-anchor="middle">${CLASS_SHORT[classId] || classId}</text>`
      svg += `<text x="${x + w / 2}" y="${y + 68}" fill="#4a5570" font-family="'SF Mono','Courier New',monospace" font-size="10" text-anchor="middle">not triggered</text>`
    }
  }

  svg += '</svg>'
  return svg
}


// ── Ceiling Drivers (Operational Ceiling chapter) ──

function renderCeilingDrivers(ceiling, ctx) {
  const ps = ceiling.posture_statement || {}
  const drivers = ceiling.ceiling_drivers || []
  if (!ps.ceiling_exists || drivers.length === 0) return null

  const W = 840
  const rowH = 44
  const H = drivers.length * rowH + 64

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" style="display:block;margin:0 auto 8px;">`

  svg += `<text x="${W / 2}" y="18" fill="#7a8aaa" font-family="'SF Mono','Courier New',monospace" font-size="10" letter-spacing="2" text-anchor="middle">OPERATIONAL CEILING DRIVERS</text>`

  // Ceiling status bar
  const ceilColor = SEV_COLOR.CRITICAL
  svg += `<rect x="20" y="30" width="${W - 40}" height="24" rx="4" fill="${ceilColor}" opacity="0.06"/>`
  svg += `<rect x="20" y="30" width="${W - 40}" height="24" rx="4" fill="none" stroke="${ceilColor}" stroke-width="1" opacity="0.3"/>`
  svg += `<text x="${W / 2}" y="46" fill="${ceilColor}" font-family="'SF Mono','Courier New',monospace" font-size="10" font-weight="600" text-anchor="middle">CEILING PRESENT — ${ps.qualification_class || 'undetermined'}</text>`

  const topY = 64

  for (let i = 0; i < drivers.length; i++) {
    const d = drivers[i]
    const y = topY + i * rowH
    const sevColor = SEV_COLOR[d.severity] || '#7a8aaa'
    const label = CONSEQUENCE_SHORT[d.consequence_type] || d.consequence_type
    const locus = d.locus || '—'

    // Row background
    svg += `<rect x="20" y="${y}" width="${W - 40}" height="${rowH - 4}" rx="4" fill="#141720" opacity="0.6"/>`

    // Severity indicator
    svg += `<rect x="24" y="${y + 4}" width="4" height="${rowH - 12}" rx="2" fill="${sevColor}"/>`

    // Label
    svg += `<text x="40" y="${y + 16}" fill="#ccd6f6" font-family="-apple-system,sans-serif" font-size="12" font-weight="500">${esc(label)}</text>`
    svg += `<text x="40" y="${y + 30}" fill="#7a8aaa" font-family="'SF Mono','Courier New',monospace" font-size="10">${esc(locus)}</text>`

    // Severity badge
    svg += `<rect x="${W - 160}" y="${y + 6}" width="52" height="18" rx="3" fill="${sevColor}" opacity="0.15"/>`
    svg += `<text x="${W - 134}" y="${y + 19}" fill="${sevColor}" font-family="'SF Mono','Courier New',monospace" font-size="10" font-weight="600" text-anchor="middle">${d.severity}</text>`

    // Scope badge
    const scopeColor = d.scope === 'SYSTEMIC' ? '#ff6b6b' : d.scope === 'REGIONAL' ? '#ff9e4a' : '#7a8aaa'
    svg += `<rect x="${W - 96}" y="${y + 6}" width="56" height="18" rx="3" fill="${scopeColor}" opacity="0.1"/>`
    svg += `<text x="${W - 68}" y="${y + 19}" fill="${scopeColor}" font-family="'SF Mono','Courier New',monospace" font-size="9" text-anchor="middle">${d.scope}</text>`
  }

  svg += '</svg>'
  return svg
}


// ── Helpers ──

function domainName(id, ctx) {
  if (!id) return 'Unknown'
  const labels = (ctx && ctx.domainLabels) || {}
  return labels[id] || id.replace(/^DOMAIN-/, 'Domain ')
}

function conditionShort(type) {
  const LABELS = {
    DELIVERY_PRESSURE_CONCENTRATION: 'Delivery Pressure Concentration',
    DEPENDENCY_CHOKE_POINT: 'Dependency Choke Point',
    PROPAGATION_ASYMMETRY: 'Propagation Asymmetry',
    STRUCTURAL_MASS_CONCENTRATION: 'Structural Mass Concentration',
    CROSS_DOMAIN_COUPLING_PRESSURE: 'Cross-Domain Coupling',
    EXECUTION_FRAGILITY: 'Execution Fragility',
    EXECUTION_CONSTRICTION: 'Execution Constriction',
    STRUCTURAL_BOUNDARY_DIVERGENCE: 'Boundary Divergence',
    COUPLING_INERTIA: 'Coupling Inertia',
    COMPOUND_CONVERGENCE: 'Compound Convergence',
    GOVERNANCE_COVERAGE_STATUS: 'Governance Coverage',
  }
  return LABELS[type] || (type || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

function sevRank(sev) {
  return { CRITICAL: 5, HIGH: 4, ELEVATED: 3, MODERATE: 2, LOW: 1, NOMINAL: 0 }[sev] || 0
}

function intersect(a, b) {
  return a.filter(x => b.includes(x))
}

function truncate(str, max) {
  if (!str || str.length <= max) return str
  return str.substring(0, max - 1) + '…'
}

function esc(str) {
  if (str === null || str === undefined) return ''
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

module.exports = { generateChapterGraphics }
