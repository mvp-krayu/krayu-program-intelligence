'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { loadJSON, REPO_ROOT } = require('../../lens-v2/SemanticArtifactLoader');
const { isClientRunAllowed } = require('../../lens-v2/manifests');

const CLIENT = 'blueedge';
const RUN = 'run_blueedge_productized_01_fixed';
const REGISTRY_PATH = path.join(
  'artifacts', 'sqo', CLIENT, RUN, 'evidence-ingestion', 'evidence_registry.v1.json'
);

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

const EXTRACTION_METHODS = {
  HEADING_EXTRACTION: 'HEADING_EXTRACTION',
  SECTION_TITLE_EXTRACTION: 'SECTION_TITLE_EXTRACTION',
  TABLE_LABEL_EXTRACTION: 'TABLE_LABEL_EXTRACTION',
  DOMAIN_KEYWORD_MAPPING: 'DOMAIN_KEYWORD_MAPPING',
  ARCHITECTURE_LAYER_MAPPING: 'ARCHITECTURE_LAYER_MAPPING',
  MODULE_CAPABILITY_MAPPING: 'MODULE_CAPABILITY_MAPPING',
};

function readEvidenceFile(sourcePath) {
  const abs = path.resolve(REPO_ROOT, sourcePath);
  if (!abs.startsWith(REPO_ROOT)) return null;
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, 'utf8');
}

function computeSourceHash(sourcePath) {
  const abs = path.resolve(REPO_ROOT, sourcePath);
  if (!fs.existsSync(abs)) return null;
  const content = fs.readFileSync(abs);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function mapDomainFromText(text) {
  for (const [keyword, domainId] of Object.entries(DOMAIN_KEYWORD_MAP)) {
    if (text.includes(keyword)) return domainId;
  }
  return 'UNMAPPED_CANDIDATE';
}

function extractFromTier1Brief(html, evidenceItem) {
  const candidates = [];
  let candidateSeq = 0;

  const domainPattern = /<div class="domain-card\s+(\w+)">\s*<div class="domain-dot[^"]*"><\/div>\s*<div>\s*<div class="domain-name">([^<]+)<\/div>[\s\S]*?<div class="domain-tag[^"]*">([^<]+)<\/div>/g;
  let match;
  while ((match = domainPattern.exec(html)) !== null) {
    candidateSeq++;
    const domainName = match[2].trim();
    const groundingTag = match[3].trim();
    const domainId = mapDomainFromText(domainName);
    candidates.push({
      candidate_id: `SC-T1-DOM-${String(candidateSeq).padStart(2, '0')}`,
      evidence_id: evidenceItem.evidence_id,
      source_path: evidenceItem.source_path,
      source_hash: evidenceItem.evidence_hash,
      extracted_label: `${domainName} — ${groundingTag}`,
      candidate_type: 'DOMAIN_GROUNDING_STATUS',
      candidate_domain: domainId,
      source_span_reference: `domain-card.${match[1]} > domain-name:"${domainName}"`,
      extraction_method: EXTRACTION_METHODS.DOMAIN_KEYWORD_MAPPING,
      confidence_class: groundingTag.toLowerCase().includes('grounded') && !groundingTag.toLowerCase().includes('weak') ? 'STRONG' : 'MODERATE',
      conflict_status: 'NONE',
      authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
      next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
    });
  }

  const signalPattern = /<div class="signal-title">([^<]+)<\/div>[\s\S]*?<div class="signal-domain-tag">([^<]+)<\/div>[\s\S]*?<span class="confidence-badge\s+(\w+)">([^<]+)<\/span>/g;
  while ((match = signalPattern.exec(html)) !== null) {
    candidateSeq++;
    const signalTitle = match[1].trim();
    const signalDomain = match[2].trim();
    const confidenceClass = match[4].trim().toUpperCase();
    const domainId = mapDomainFromText(signalDomain);
    candidates.push({
      candidate_id: `SC-T1-SIG-${String(candidateSeq - 17).padStart(2, '0')}`,
      evidence_id: evidenceItem.evidence_id,
      source_path: evidenceItem.source_path,
      source_hash: evidenceItem.evidence_hash,
      extracted_label: signalTitle,
      candidate_type: 'STRUCTURAL_SIGNAL',
      candidate_domain: domainId,
      source_span_reference: `signal-card > signal-title:"${signalTitle.slice(0, 60)}"`,
      extraction_method: EXTRACTION_METHODS.HEADING_EXTRACTION,
      confidence_class: confidenceClass,
      conflict_status: 'NONE',
      authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
      next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
    });
  }

  const focusPattern = /<div class="focus-domain-name">([^<]+)<\/div>/;
  const focusMatch = focusPattern.exec(html);
  if (focusMatch) {
    candidateSeq++;
    const focusName = focusMatch[1].trim();
    const domainId = mapDomainFromText(focusName);
    candidates.push({
      candidate_id: `SC-T1-FOCUS-01`,
      evidence_id: evidenceItem.evidence_id,
      source_path: evidenceItem.source_path,
      source_hash: evidenceItem.evidence_hash,
      extracted_label: `Focus Domain: ${focusName}`,
      candidate_type: 'FOCUS_DOMAIN_DESIGNATION',
      candidate_domain: domainId,
      source_span_reference: `focus-domain-block > focus-domain-name:"${focusName}"`,
      extraction_method: EXTRACTION_METHODS.SECTION_TITLE_EXTRACTION,
      confidence_class: 'STRONG',
      conflict_status: 'NONE',
      authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
      next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
    });
  }

  return candidates;
}

function extractFromGaugeArtifact(html, evidenceItem) {
  const candidates = [];

  const claimPattern = /<span class="mk">claim_label<\/span><span class="mv">([^<]+)<\/span>/;
  const claimMatch = claimPattern.exec(html);

  const titlePattern = /<title>([^<]+)<\/title>/;
  const titleMatch = titlePattern.exec(html);
  const title = titleMatch ? titleMatch[1].trim() : null;

  if (title) {
    const valuePattern = /<h2>Authoritative Value<\/h2>\s*<p>([^<]+)<\/p>/;
    const valueMatch = valuePattern.exec(html);

    candidates.push({
      candidate_id: `SC-GA-${evidenceItem.evidence_id.replace('EV-BE-', '')}`,
      evidence_id: evidenceItem.evidence_id,
      source_path: evidenceItem.source_path,
      source_hash: evidenceItem.evidence_hash,
      extracted_label: title,
      candidate_type: 'GAUGE_ARTIFACT_TITLE',
      candidate_domain: evidenceItem.candidate_domains.length === 1 ? evidenceItem.candidate_domains[0] : 'UNMAPPED_CANDIDATE',
      source_span_reference: `<title>"${title}"</title>`,
      extraction_method: EXTRACTION_METHODS.HEADING_EXTRACTION,
      confidence_class: 'STRONG',
      conflict_status: 'NONE',
      authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
      next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
    });

    if (valueMatch) {
      candidates.push({
        candidate_id: `SC-GA-${evidenceItem.evidence_id.replace('EV-BE-', '')}-VAL`,
        evidence_id: evidenceItem.evidence_id,
        source_path: evidenceItem.source_path,
        source_hash: evidenceItem.evidence_hash,
        extracted_label: `${title}: ${valueMatch[1].trim()}`,
        candidate_type: 'GAUGE_METRIC_VALUE',
        candidate_domain: evidenceItem.candidate_domains.length === 1 ? evidenceItem.candidate_domains[0] : 'UNMAPPED_CANDIDATE',
        source_span_reference: `content > h2:"Authoritative Value" + p:"${valueMatch[1].trim()}"`,
        extraction_method: EXTRACTION_METHODS.TABLE_LABEL_EXTRACTION,
        confidence_class: 'STRONG',
        conflict_status: 'NONE',
        authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
        next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
      });
    }
  }

  if (claimMatch) {
    const claimLabel = claimMatch[1].trim();
    candidates.push({
      candidate_id: `SC-CLM-${evidenceItem.evidence_id.replace('EV-BE-', '')}`,
      evidence_id: evidenceItem.evidence_id,
      source_path: evidenceItem.source_path,
      source_hash: evidenceItem.evidence_hash,
      extracted_label: `Claim: ${claimLabel}`,
      candidate_type: 'GAUGE_CLAIM_LABEL',
      candidate_domain: evidenceItem.candidate_domains.length === 1 ? evidenceItem.candidate_domains[0] : 'UNMAPPED_CANDIDATE',
      source_span_reference: `meta > claim_label:"${claimLabel}"`,
      extraction_method: EXTRACTION_METHODS.TABLE_LABEL_EXTRACTION,
      confidence_class: 'STRONG',
      conflict_status: 'NONE',
      authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
      next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
    });
  }

  return candidates;
}

function extractFromTier2Diagnostic(html, evidenceItem) {
  const candidates = [];

  const sectionPattern = /<span class="t2-section-num">([^<]+)<\/span>\s*<span class="t2-section-title">([^<]+)<\/span>/g;
  let match;
  let sectionSeq = 0;
  while ((match = sectionPattern.exec(html)) !== null) {
    sectionSeq++;
    const sectionNum = match[1].trim();
    const sectionTitle = match[2].trim();
    candidates.push({
      candidate_id: `SC-T2-SEC-${String(sectionSeq).padStart(2, '0')}`,
      evidence_id: evidenceItem.evidence_id,
      source_path: evidenceItem.source_path,
      source_hash: evidenceItem.evidence_hash,
      extracted_label: `${sectionNum}: ${sectionTitle}`,
      candidate_type: 'DIAGNOSTIC_SECTION',
      candidate_domain: 'UNMAPPED_CANDIDATE',
      source_span_reference: `t2-section-header > t2-section-num:"${sectionNum}" + t2-section-title:"${sectionTitle}"`,
      extraction_method: EXTRACTION_METHODS.SECTION_TITLE_EXTRACTION,
      confidence_class: 'MODERATE',
      conflict_status: 'NONE',
      authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
      next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
    });
  }

  const domainChipPattern = /<span class="t2-chip">(DOMAIN-\d+)<\/span>/g;
  const seenDomains = new Set();
  while ((match = domainChipPattern.exec(html)) !== null) {
    const domainId = match[1];
    if (!seenDomains.has(domainId)) {
      seenDomains.add(domainId);
      candidates.push({
        candidate_id: `SC-T2-DREF-${domainId.replace('DOMAIN-', '')}`,
        evidence_id: evidenceItem.evidence_id,
        source_path: evidenceItem.source_path,
        source_hash: evidenceItem.evidence_hash,
        extracted_label: `Diagnostic domain reference: ${domainId}`,
        candidate_type: 'DIAGNOSTIC_DOMAIN_REFERENCE',
        candidate_domain: domainId,
        source_span_reference: `t2-chip:"${domainId}"`,
        extraction_method: EXTRACTION_METHODS.ARCHITECTURE_LAYER_MAPPING,
        confidence_class: 'MODERATE',
        conflict_status: 'NONE',
        authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
        next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
      });
    }
  }

  const capPattern = /<span class="t2-chip">(CAP-\d+)<\/span>/g;
  const seenCaps = new Set();
  while ((match = capPattern.exec(html)) !== null) {
    const capId = match[1];
    if (!seenCaps.has(capId)) {
      seenCaps.add(capId);
      candidates.push({
        candidate_id: `SC-T2-CAP-${capId.replace('CAP-', '')}`,
        evidence_id: evidenceItem.evidence_id,
        source_path: evidenceItem.source_path,
        source_hash: evidenceItem.evidence_hash,
        extracted_label: `Diagnostic capability reference: ${capId}`,
        candidate_type: 'DIAGNOSTIC_CAPABILITY_REFERENCE',
        candidate_domain: 'UNMAPPED_CANDIDATE',
        source_span_reference: `t2-chip:"${capId}"`,
        extraction_method: EXTRACTION_METHODS.MODULE_CAPABILITY_MAPPING,
        confidence_class: 'WEAK',
        conflict_status: 'NONE',
        authority_state: 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE',
        next_required_gate: 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED',
      });
    }
  }

  return candidates;
}

function extractCandidatesFromEvidence(evidenceItem, html) {
  switch (evidenceItem.source_type) {
    case 'HTML_EVIDENCE_BRIEF':
      return extractFromTier1Brief(html, evidenceItem);
    case 'HTML_DIAGNOSTIC_NARRATIVE':
      return extractFromTier2Diagnostic(html, evidenceItem);
    case 'HTML_GAUGE_ARTIFACT':
    case 'HTML_GAUGE_CLAIM':
      return extractFromGaugeArtifact(html, evidenceItem);
    default:
      return [];
  }
}

function loadSemanticCandidateData() {
  if (!isClientRunAllowed(CLIENT, RUN)) {
    return { ok: false, error: 'CLIENT_RUN_NOT_REGISTERED' };
  }

  const registry = loadJSON(REGISTRY_PATH);
  if (!registry || !registry.ok) {
    return { ok: false, error: 'EVIDENCE_REGISTRY_NOT_FOUND' };
  }

  const evidenceItems = registry.data.evidence_items || [];
  const allCandidates = [];
  const extractionLog = [];

  for (const item of evidenceItems) {
    const html = readEvidenceFile(item.source_path);
    if (!html) {
      extractionLog.push({
        evidence_id: item.evidence_id,
        status: 'SKIP',
        reason: 'FILE_NOT_READABLE',
        candidates_extracted: 0,
      });
      continue;
    }

    const sourceHash = computeSourceHash(item.source_path);
    const hashMatch = sourceHash === item.evidence_hash;

    const candidates = extractCandidatesFromEvidence(item, html);
    allCandidates.push(...candidates);

    extractionLog.push({
      evidence_id: item.evidence_id,
      source_type: item.source_type,
      status: 'EXTRACTED',
      hash_verified: hashMatch,
      candidates_extracted: candidates.length,
    });
  }

  const domainCounts = {};
  const unmappedCount = allCandidates.filter(c => c.candidate_domain === 'UNMAPPED_CANDIDATE').length;
  for (const c of allCandidates) {
    if (c.candidate_domain !== 'UNMAPPED_CANDIDATE') {
      domainCounts[c.candidate_domain] = (domainCounts[c.candidate_domain] || 0) + 1;
    }
  }

  return {
    ok: true,
    client: CLIENT,
    run_id: RUN,
    evidence_registry_id: registry.data.registry_id,
    candidates: allCandidates,
    candidate_count: allCandidates.length,
    extraction_log: extractionLog,
    summary: {
      total_candidates: allCandidates.length,
      mapped_candidates: allCandidates.length - unmappedCount,
      unmapped_candidates: unmappedCount,
      domains_referenced: Object.keys(domainCounts).length,
      domain_counts: domainCounts,
      extraction_methods_used: [...new Set(allCandidates.map(c => c.extraction_method))],
      confidence_distribution: {
        STRONG: allCandidates.filter(c => c.confidence_class === 'STRONG').length,
        MODERATE: allCandidates.filter(c => c.confidence_class === 'MODERATE').length,
        WEAK: allCandidates.filter(c => c.confidence_class === 'WEAK').length,
      },
      all_non_authoritative: allCandidates.every(c => c.authority_state === 'NON_AUTHORITATIVE_SEMANTIC_CANDIDATE'),
      all_gated: allCandidates.every(c => c.next_required_gate === 'DYNAMIC_CEU_ADMISSIBILITY_REQUIRED'),
    },
    governance: {
      no_grounding_mutation: true,
      no_overlay_generation: true,
      no_qualification_mutation: true,
      no_authority_assertion: true,
      no_lens_mutation: true,
      extraction_only: true,
      additive_only: true,
      fail_closed: true,
    },
  };
}

module.exports = { loadSemanticCandidateData, CLIENT, RUN, DOMAIN_KEYWORD_MAP };
