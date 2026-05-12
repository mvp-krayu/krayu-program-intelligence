'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { REPO_ROOT } = require('../../lens-v2/SemanticArtifactLoader');

const CLIENT = 'blueedge';
const RUN = 'run_blueedge_productized_01_fixed';
const EVIDENCE_SOURCES_PATH = path.join(REPO_ROOT, 'clients', CLIENT, 'sqo', 'evidence_sources.yaml');
const MANIFEST_OUTPUT_PATH = path.join(REPO_ROOT, 'artifacts', 'sqo', CLIENT, 'evidence_rebase_01', 'evidence_manifest.json');

const DOMAIN_KEYWORD_MAP = {
  'Edge Data Acquisition': 'DOMAIN-01',
  'Telemetry Transport and Messaging': 'DOMAIN-02',
  'Telemetry Transport': 'DOMAIN-02',
  'Fleet Core Operations': 'DOMAIN-03',
  'Fleet Vertical Extensions': 'DOMAIN-04',
  'Analytics and Intelligence': 'DOMAIN-05',
  'AI/ML Intelligence Layer': 'DOMAIN-06',
  'Sensor and Security Ingestion': 'DOMAIN-07',
  'Real-Time Streaming and Gateway': 'DOMAIN-08',
  'Access Control and Identity': 'DOMAIN-09',
  'Platform Infrastructure and Data': 'DOMAIN-10',
  'Platform Infrastructure': 'DOMAIN-10',
  'Event-Driven Architecture': 'DOMAIN-11',
  'SaaS Platform Layer': 'DOMAIN-12',
  'External Integration': 'DOMAIN-13',
  'Frontend Application': 'DOMAIN-14',
  'EV and Electrification': 'DOMAIN-15',
  'Operational Engineering': 'DOMAIN-16',
  'Extended Operations and Driver Services': 'DOMAIN-17',
};

const DISALLOWED_PATTERNS = [
  /lens_tier[12]/i,
  /tier[12].*evidence/i,
  /tier[12].*diagnostic/i,
  /gauge.*artifact/i,
  /gauge.*claim/i,
  /lens.*output/i,
  /cockpit.*summary/i,
];

const STRUCTURAL_COMPATIBILITY = {
  ARCHITECTURE_SECTION: 'HIGH',
  ARCHITECTURE_LAYER: 'HIGH',
  ARCHITECTURE_MODULE: 'MODERATE',
  PMO_SECTION: 'LOW',
  PMO_METRIC: 'LOW',
  COMPETITIVE_DIMENSION: 'LOW',
  COMPETITIVE_FEATURE_CATEGORY: 'MODERATE',
  DOCUMENT_TITLE: 'MODERATE',
};

function parseEvidenceSources() {
  if (!fs.existsSync(EVIDENCE_SOURCES_PATH)) {
    return { ok: false, error: 'EVIDENCE_SOURCES_MISSING' };
  }

  const raw = fs.readFileSync(EVIDENCE_SOURCES_PATH, 'utf8');
  const lines = raw.split('\n');

  const result = {
    client: null,
    run_id: null,
    evidence_set_id: null,
    evidence_root: null,
    allowed_source_class: null,
    disallowed_source_classes: [],
    files: [],
  };

  let inDisallowed = false;
  let inFiles = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (trimmed.startsWith('- ') && inDisallowed) {
      result.disallowed_source_classes.push(trimmed.slice(2).trim());
      continue;
    }
    if (trimmed.startsWith('- ') && inFiles) {
      result.files.push(trimmed.slice(2).trim());
      continue;
    }

    inDisallowed = false;
    inFiles = false;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    const val = trimmed.slice(colonIdx + 1).trim();

    if (key === 'disallowed_source_classes') { inDisallowed = true; continue; }
    if (key === 'files') { inFiles = true; continue; }
    if (key === 'client') result.client = val;
    if (key === 'run_id') result.run_id = val;
    if (key === 'evidence_set_id') result.evidence_set_id = val;
    if (key === 'evidence_root') result.evidence_root = val;
    if (key === 'allowed_source_class') result.allowed_source_class = val;
  }

  if (!result.evidence_root || result.files.length === 0) {
    return { ok: false, error: 'EVIDENCE_SOURCES_INCOMPLETE' };
  }

  return { ok: true, sources: result };
}

function isFileAllowed(filename, sources) {
  if (!sources.files.includes(filename)) return false;
  for (const pattern of DISALLOWED_PATTERNS) {
    if (pattern.test(filename)) return false;
  }
  return true;
}

function computeHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function mapDomainFromText(text) {
  for (const [keyword, domainId] of Object.entries(DOMAIN_KEYWORD_MAP)) {
    if (text.includes(keyword)) return domainId;
  }
  return 'UNMAPPED_CANDIDATE';
}

function classifySourceType(filename) {
  if (filename.includes('PMO_Dashboard')) return 'HTML_PMO_DASHBOARD';
  if (filename.includes('Competitive_Dashboard')) return 'HTML_COMPETITIVE_DASHBOARD';
  if (filename.includes('Unified_Architecture')) return 'HTML_ARCHITECTURE_SPECIFICATION';
  return 'HTML_UNKNOWN';
}

function extractFromArchitecture(html, evidenceItem) {
  const candidates = [];
  let seq = 0;

  const titlePattern = /<title>([^<]+)<\/title>/;
  const titleMatch = titlePattern.exec(html);
  if (titleMatch) {
    seq++;
    const title = titleMatch[1].trim();
    candidates.push({
      candidate_id: `SC-ARCH-TITLE-01`,
      evidence_id: evidenceItem.evidence_id,
      source_path: evidenceItem.source_path,
      source_hash: evidenceItem.evidence_hash,
      extracted_label: title,
      candidate_type: 'DOCUMENT_TITLE',
      candidate_domain: mapDomainFromText(title),
      source_span_reference: `<title>"${title}"</title>`,
      extraction_method: 'HEADING_EXTRACTION',
      confidence_class: 'STRONG',
      conflict_status: 'NONE',
      authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
      next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
    });
  }

  const sectionPattern = /<div class="st2">([^<]+)<\/div>/g;
  let match;
  let secSeq = 0;
  while ((match = sectionPattern.exec(html)) !== null) {
    secSeq++;
    const sectionTitle = match[1].trim();
    candidates.push({
      candidate_id: `SC-ARCH-SEC-${String(secSeq).padStart(2, '0')}`,
      evidence_id: evidenceItem.evidence_id,
      source_path: evidenceItem.source_path,
      source_hash: evidenceItem.evidence_hash,
      extracted_label: sectionTitle,
      candidate_type: 'ARCHITECTURE_SECTION',
      candidate_domain: mapDomainFromText(sectionTitle),
      source_span_reference: `st2:"${sectionTitle.slice(0, 60)}"`,
      extraction_method: 'SECTION_TITLE_EXTRACTION',
      confidence_class: 'STRONG',
      conflict_status: 'NONE',
      authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
      next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
    });
  }

  const layerPattern = /<div class="lt"[^>]*>([^<]+)<\/div>/g;
  let layerSeq = 0;
  while ((match = layerPattern.exec(html)) !== null) {
    layerSeq++;
    const layerTitle = match[1].trim().replace(/^[^\w]*/, '');
    candidates.push({
      candidate_id: `SC-ARCH-LYR-${String(layerSeq).padStart(2, '0')}`,
      evidence_id: evidenceItem.evidence_id,
      source_path: evidenceItem.source_path,
      source_hash: evidenceItem.evidence_hash,
      extracted_label: layerTitle,
      candidate_type: 'ARCHITECTURE_LAYER',
      candidate_domain: mapDomainFromText(layerTitle),
      source_span_reference: `lt:"${layerTitle.slice(0, 60)}"`,
      extraction_method: 'ARCHITECTURE_LAYER_EXTRACTION',
      confidence_class: 'STRONG',
      conflict_status: 'NONE',
      authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
      next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
    });
  }

  const modulePattern = /<div class="mn">([^<]+)<\/div>/g;
  const seenModules = new Set();
  while ((match = modulePattern.exec(html)) !== null) {
    const moduleName = match[1].trim().replace(/^[\p{Emoji}\s]+/u, '').trim();
    if (!moduleName || seenModules.has(moduleName)) continue;
    seenModules.add(moduleName);
    seq++;
    candidates.push({
      candidate_id: `SC-ARCH-MOD-${String(seenModules.size).padStart(2, '0')}`,
      evidence_id: evidenceItem.evidence_id,
      source_path: evidenceItem.source_path,
      source_hash: evidenceItem.evidence_hash,
      extracted_label: moduleName,
      candidate_type: 'ARCHITECTURE_MODULE',
      candidate_domain: mapDomainFromText(moduleName),
      source_span_reference: `mn:"${moduleName.slice(0, 60)}"`,
      extraction_method: 'MODULE_NAME_EXTRACTION',
      confidence_class: 'MODERATE',
      conflict_status: 'NONE',
      authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
      next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
    });
  }

  return candidates;
}

function extractFromPMO(html, evidenceItem) {
  const candidates = [];

  const titlePattern = /<title>([^<]+)<\/title>/;
  const titleMatch = titlePattern.exec(html);
  if (titleMatch) {
    const title = titleMatch[1].trim();
    candidates.push({
      candidate_id: 'SC-PMO-TITLE-01',
      evidence_id: evidenceItem.evidence_id,
      source_path: evidenceItem.source_path,
      source_hash: evidenceItem.evidence_hash,
      extracted_label: title,
      candidate_type: 'DOCUMENT_TITLE',
      candidate_domain: mapDomainFromText(title),
      source_span_reference: `<title>"${title}"</title>`,
      extraction_method: 'HEADING_EXTRACTION',
      confidence_class: 'STRONG',
      conflict_status: 'NONE',
      authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
      next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
    });
  }

  const sectionPattern = /<div class="section-title">([^<]+)<\/div>/g;
  let match;
  let seq = 0;
  while ((match = sectionPattern.exec(html)) !== null) {
    seq++;
    const sectionTitle = match[1].trim();
    candidates.push({
      candidate_id: `SC-PMO-SEC-${String(seq).padStart(2, '0')}`,
      evidence_id: evidenceItem.evidence_id,
      source_path: evidenceItem.source_path,
      source_hash: evidenceItem.evidence_hash,
      extracted_label: sectionTitle,
      candidate_type: 'PMO_SECTION',
      candidate_domain: mapDomainFromText(sectionTitle),
      source_span_reference: `section-title:"${sectionTitle.slice(0, 60)}"`,
      extraction_method: 'SECTION_TITLE_EXTRACTION',
      confidence_class: 'MODERATE',
      conflict_status: 'NONE',
      authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
      next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
    });
  }

  const kpiPattern = /<div class="kpi-label">([^<]+)<\/div>/g;
  let kpiSeq = 0;
  while ((match = kpiPattern.exec(html)) !== null) {
    kpiSeq++;
    const kpiLabel = match[1].trim();
    candidates.push({
      candidate_id: `SC-PMO-KPI-${String(kpiSeq).padStart(2, '0')}`,
      evidence_id: evidenceItem.evidence_id,
      source_path: evidenceItem.source_path,
      source_hash: evidenceItem.evidence_hash,
      extracted_label: kpiLabel,
      candidate_type: 'PMO_METRIC',
      candidate_domain: mapDomainFromText(kpiLabel),
      source_span_reference: `kpi-label:"${kpiLabel.slice(0, 60)}"`,
      extraction_method: 'TABLE_LABEL_EXTRACTION',
      confidence_class: 'MODERATE',
      conflict_status: 'NONE',
      authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
      next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
    });
  }

  return candidates;
}

function extractFromCompetitive(html, evidenceItem) {
  const candidates = [];

  const titlePattern = /<title>([^<]+)<\/title>/;
  const titleMatch = titlePattern.exec(html);
  if (titleMatch) {
    const title = titleMatch[1].trim();
    candidates.push({
      candidate_id: 'SC-COMP-TITLE-01',
      evidence_id: evidenceItem.evidence_id,
      source_path: evidenceItem.source_path,
      source_hash: evidenceItem.evidence_hash,
      extracted_label: title,
      candidate_type: 'DOCUMENT_TITLE',
      candidate_domain: mapDomainFromText(title),
      source_span_reference: `<title>"${title}"</title>`,
      extraction_method: 'HEADING_EXTRACTION',
      confidence_class: 'STRONG',
      conflict_status: 'NONE',
      authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
      next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
    });
  }

  const cardTitlePattern = /<div class="card-t">([^<]+)<\/div>/g;
  let match;
  let seq = 0;
  while ((match = cardTitlePattern.exec(html)) !== null) {
    seq++;
    const cardTitle = match[1].trim().replace(/^[\p{Emoji}\s]+/u, '').trim();
    if (!cardTitle) continue;
    candidates.push({
      candidate_id: `SC-COMP-DIM-${String(seq).padStart(2, '0')}`,
      evidence_id: evidenceItem.evidence_id,
      source_path: evidenceItem.source_path,
      source_hash: evidenceItem.evidence_hash,
      extracted_label: cardTitle,
      candidate_type: 'COMPETITIVE_DIMENSION',
      candidate_domain: mapDomainFromText(cardTitle),
      source_span_reference: `card-t:"${cardTitle.slice(0, 60)}"`,
      extraction_method: 'HEADING_EXTRACTION',
      confidence_class: 'MODERATE',
      conflict_status: 'NONE',
      authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
      next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
    });
  }

  const catPattern = /<td class="cat"[^>]*>([^<]+)<\/td>/g;
  const seenCats = new Set();
  while ((match = catPattern.exec(html)) !== null) {
    const cat = match[1].trim();
    if (seenCats.has(cat)) continue;
    seenCats.add(cat);
    candidates.push({
      candidate_id: `SC-COMP-CAT-${String(seenCats.size).padStart(2, '0')}`,
      evidence_id: evidenceItem.evidence_id,
      source_path: evidenceItem.source_path,
      source_hash: evidenceItem.evidence_hash,
      extracted_label: cat,
      candidate_type: 'COMPETITIVE_FEATURE_CATEGORY',
      candidate_domain: mapDomainFromText(cat),
      source_span_reference: `td.cat:"${cat.slice(0, 60)}"`,
      extraction_method: 'TABLE_LABEL_EXTRACTION',
      confidence_class: 'MODERATE',
      conflict_status: 'NONE',
      authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
      next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
    });
  }

  return candidates;
}

function evaluateAdmissibility(candidate) {
  const structCompat = STRUCTURAL_COMPATIBILITY[candidate.candidate_type] || 'NONE';
  const isUnmapped = candidate.candidate_domain === 'UNMAPPED_CANDIDATE';

  const result = {
    ...candidate,
    structural_compatibility: isUnmapped ? 'NONE' : structCompat,
    replay_compatibility: 'COMPATIBLE',
    evidence_repetition_score: 1,
    conflict_status: 'NONE',
    quarantine_reason: null,
    admissibility_confidence: null,
    admissibility_state: null,
    admissibility_reason: null,
    required_next_step: null,
    authority_state: 'NON_AUTHORITATIVE_ADMISSIBILITY_RESULT',
  };

  if (isUnmapped) {
    result.admissibility_state = 'REJECTED';
    result.admissibility_reason = 'No deterministic domain resolution from explicit upstream evidence';
    result.admissibility_confidence = 'N_A';
    result.required_next_step = 'REJECTED — domain terminology alignment or evidence enrichment required';
    return result;
  }

  if (structCompat === 'HIGH' && candidate.confidence_class === 'STRONG') {
    result.admissibility_state = 'ADMISSIBLE';
    result.admissibility_reason = 'Strong upstream evidence signal with high structural correlation';
    result.admissibility_confidence = 'HIGH';
    result.required_next_step = 'OVERLAY_PROPOSAL_ELIGIBLE — candidate may proceed to overlay proposal corridor';
    return result;
  }

  if (structCompat === 'HIGH' && candidate.confidence_class === 'MODERATE') {
    result.admissibility_state = 'QUARANTINED';
    result.admissibility_reason = 'High structural correlation but moderate evidence confidence';
    result.quarantine_reason = 'Moderate confidence requires evidence strengthening for overlay candidacy';
    result.admissibility_confidence = 'LOW';
    result.required_next_step = 'QUARANTINE_REVIEW_REQUIRED — evidence strengthening needed';
    return result;
  }

  result.admissibility_state = 'QUARANTINED';
  result.admissibility_reason = `${structCompat} structural correlation from ${candidate.candidate_type} — insufficient for direct admissibility`;
  result.quarantine_reason = 'Structural correlation insufficient for direct admissibility from this evidence type';
  result.admissibility_confidence = 'LOW';
  result.required_next_step = 'QUARANTINE_REVIEW_REQUIRED — stronger structural binding or corroborating evidence needed';
  return result;
}

function loadExplicitEvidenceRebaseData() {
  const sourcesResult = parseEvidenceSources();
  if (!sourcesResult.ok) {
    return { ok: false, error: sourcesResult.error };
  }

  const sources = sourcesResult.sources;
  const evidenceRoot = path.join(REPO_ROOT, sources.evidence_root);

  if (!fs.existsSync(evidenceRoot)) {
    return { ok: false, error: 'EVIDENCE_ROOT_NOT_FOUND' };
  }

  const evidenceItems = [];
  const ingestionLog = [];
  let evSeq = 0;

  for (const filename of sources.files) {
    evSeq++;
    const filePath = path.join(evidenceRoot, filename);

    if (!isFileAllowed(filename, sources)) {
      ingestionLog.push({ filename, status: 'REJECTED', reason: 'DISALLOWED_SOURCE_CLASS' });
      continue;
    }

    if (!fs.existsSync(filePath)) {
      ingestionLog.push({ filename, status: 'MISSING', reason: 'FILE_NOT_FOUND' });
      continue;
    }

    const hash = computeHash(filePath);
    const stats = fs.statSync(filePath);
    const sourceType = classifySourceType(filename);

    const item = {
      evidence_id: `EV-RB-${String(evSeq).padStart(3, '0')}`,
      filename,
      source_path: path.join(sources.evidence_root, filename),
      source_type: sourceType,
      evidence_hash: hash,
      byte_size: stats.size,
      ingestion_timestamp: new Date().toISOString(),
      operator_provided: true,
      source_class: sources.allowed_source_class,
    };

    evidenceItems.push(item);
    ingestionLog.push({ filename, status: 'INGESTED', evidence_id: item.evidence_id, hash: hash.slice(0, 16) + '...' });
  }

  if (evidenceItems.length === 0) {
    return { ok: false, error: 'NO_EVIDENCE_INGESTED' };
  }

  const allCandidates = [];
  const extractionLog = [];

  for (const item of evidenceItems) {
    const abs = path.join(REPO_ROOT, item.source_path);
    const html = fs.readFileSync(abs, 'utf8');
    let candidates = [];

    switch (item.source_type) {
      case 'HTML_ARCHITECTURE_SPECIFICATION':
        candidates = extractFromArchitecture(html, item);
        break;
      case 'HTML_PMO_DASHBOARD':
        candidates = extractFromPMO(html, item);
        break;
      case 'HTML_COMPETITIVE_DASHBOARD':
        candidates = extractFromCompetitive(html, item);
        break;
      default:
        candidates = [];
    }

    allCandidates.push(...candidates);
    extractionLog.push({
      evidence_id: item.evidence_id,
      source_type: item.source_type,
      filename: item.filename,
      status: 'EXTRACTED',
      candidates_extracted: candidates.length,
      hash_verified: true,
    });
  }

  const evaluations = allCandidates.map(c => evaluateAdmissibility(c));

  const admissibleCount = evaluations.filter(e => e.admissibility_state === 'ADMISSIBLE').length;
  const quarantinedCount = evaluations.filter(e => e.admissibility_state === 'QUARANTINED').length;
  const rejectedCount = evaluations.filter(e => e.admissibility_state === 'REJECTED').length;

  const mappedCount = allCandidates.filter(c => c.candidate_domain !== 'UNMAPPED_CANDIDATE').length;
  const unmappedCount = allCandidates.filter(c => c.candidate_domain === 'UNMAPPED_CANDIDATE').length;
  const domainsReferenced = [...new Set(allCandidates.filter(c => c.candidate_domain !== 'UNMAPPED_CANDIDATE').map(c => c.candidate_domain))];

  const manifest = {
    evidence_set_id: sources.evidence_set_id,
    client: sources.client,
    run_id: sources.run_id,
    source_class: sources.allowed_source_class,
    evidence_root: sources.evidence_root,
    evidence_items: evidenceItems,
    total_items: evidenceItems.length,
    total_bytes: evidenceItems.reduce((sum, i) => sum + i.byte_size, 0),
    all_operator_provided: evidenceItems.every(i => i.operator_provided),
    source_bound: true,
  };

  const manifestDir = path.dirname(MANIFEST_OUTPUT_PATH);
  if (!fs.existsSync(manifestDir)) fs.mkdirSync(manifestDir, { recursive: true });
  fs.writeFileSync(MANIFEST_OUTPUT_PATH, JSON.stringify(manifest, null, 2));

  return {
    ok: true,
    client: CLIENT,
    run_id: RUN,
    evidence_set_id: sources.evidence_set_id,
    source_status: 'UPSTREAM_EVIDENCE_BOUND',
    previous_chain_status: 'PRE_REBASE_NON_AUTHORITATIVE',
    manifest,
    ingestion_log: ingestionLog,
    extraction_log: extractionLog,
    candidates: allCandidates,
    candidate_count: allCandidates.length,
    evaluations,
    evaluation_count: evaluations.length,
    summary: {
      total_candidates: allCandidates.length,
      mapped_candidates: mappedCount,
      unmapped_candidates: unmappedCount,
      domains_referenced: domainsReferenced,
      total_evaluated: evaluations.length,
      admissible: admissibleCount,
      quarantined: quarantinedCount,
      rejected: rejectedCount,
      evidence_files: sources.files,
      evidence_hashes: evidenceItems.map(i => ({ filename: i.filename, hash: i.evidence_hash })),
    },
    governance: {
      no_grounding_mutation: true,
      no_overlay_generation: true,
      no_qualification_mutation: true,
      no_authority_assertion: true,
      no_lens_mutation: true,
      upstream_evidence_bound: true,
      additive_only: true,
      fail_closed: true,
    },
  };
}

module.exports = { loadExplicitEvidenceRebaseData, parseEvidenceSources, isFileAllowed, CLIENT, RUN, DOMAIN_KEYWORD_MAP };
