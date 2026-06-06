'use strict';

// First-class governance component — not utility code.
// This is the first Co-Pilot governance boundary.
// Future constitutional evolution will expand this layer.
//
// DEBT: V1 = heuristic (regex pattern matching). Catches explicit
// violations but misses indirect formulations ("engineering leadership
// has failed", "the organization lacks strategic clarity", "management
// created this situation"). V2 = constitutional reasoning — LLM-based
// prohibition check against the 13 absolute prohibitions. The
// architecture must support strategy replacement (V1→V2) without
// changing the validate() contract.

const PROHIBITIONS = [
  {
    id: 'P01_TEAM_BEHAVIOR',
    label: 'Team behavior inference',
    patterns: [
      /\bteam\s+(dynamics?|behaviors?|morale|culture|friction|conflict)\b/i,
      /\bteam\s+(is|are|seems?|appears?)\s+(struggling|dysfunctional|siloed)/i,
    ],
  },
  {
    id: 'P02_ORG_INTENT',
    label: 'Organizational intent inference',
    patterns: [
      /\b(organization|company|management)\s+(intends?|wants?|plans?|aims?|trying)\b/i,
      /\borganizational\s+(intent|strategy|direction|agenda)\b/i,
    ],
  },
  {
    id: 'P03_HUMAN_MOTIVE',
    label: 'Human motive inference',
    patterns: [
      /\b(developer|engineer|architect|manager|leader)\s+(wants?|intends?|motivated|chose|decided)\b/i,
      /\bsomeone\s+(chose|decided|wanted|neglected)\b/i,
    ],
  },
  {
    id: 'P04_CULTURAL_DIAGNOSIS',
    label: 'Cultural diagnosis',
    patterns: [
      /\b(toxic|healthy|dysfunctional|broken)\s+(culture|environment|workplace)\b/i,
      /\bcultural\s+(issue|problem|diagnosis|assessment)\b/i,
    ],
  },
  {
    id: 'P05_LEADERSHIP_QUALITY',
    label: 'Leadership quality assessment',
    patterns: [
      /\b(poor|weak|strong|effective|ineffective)\s+(leadership|management)\b/i,
      /\bleadership\s+(failure|quality|effectiveness|gap)\b/i,
    ],
  },
  {
    id: 'P06_PERSONNEL_ATTRIBUTION',
    label: 'Personnel attribution',
    patterns: [
      /\b(caused by|fault of|blame|responsible for)\s+(the\s+)?(team|developers|engineers|management)\b/i,
      /\bwho\s+(caused|created|introduced|broke)\b/i,
    ],
  },
  {
    id: 'P07_BEHAVIORAL_PREDICTION',
    label: 'Behavioral prediction',
    patterns: [
      /\b(they|the team|developers)\s+(will likely|will probably|are going to|won't)\b/i,
      /\bpredict\s+(that|they|the team|behavior)\b/i,
    ],
  },
  {
    id: 'P08_REMEDIATION',
    label: 'Remediation prescription',
    patterns: [
      /\byou\s+should\b/i,
      /\bwe\s+recommend\s+(that\s+)?(you|the team|management)\b/i,
      /\bour\s+recommendation\s+is\b/i,
    ],
  },
  {
    id: 'P09_RANKED_ACTIONS',
    label: 'Ranked next actions',
    patterns: [
      /\b(priority|prioriti[sz]e|ranked?)\s+(actions?|steps?|next\s+steps?|recommendations?)\b/i,
      /\b(step\s+1|first\s*,?\s*(you|the team)\s+should)\b/i,
    ],
  },
  {
    id: 'P10_ORG_SENTIMENT',
    label: 'Organizational sentiment',
    patterns: [
      /\b(morale|sentiment|satisfaction|engagement)\s+(is|are|seems?|appears?)\b/i,
      /\b(frustrated|demotivated|burned\s*out|overwhelmed)\s+(team|developers|engineers)\b/i,
    ],
  },
  {
    id: 'P11_CAUSAL_HUMAN',
    label: 'Causal attribution to humans',
    patterns: [
      /\bthis\s+(happened|occurred|exists?)\s+because\s+(someone|they|the team|developers|management)\b/i,
    ],
  },
  {
    id: 'P12_BEYOND_EVIDENCE',
    label: 'Projection beyond evidence',
    patterns: [
      /\b(in\s+my\s+experience|typically|usually|in\s+most\s+cases|based\s+on\s+industry)\b/i,
      /\b(best\s+practice|industry\s+standard|common\s+pattern)\s+(suggests?|indicates?|shows?)\b/i,
    ],
  },
];

const CONTEXT_HONESTY_PATTERNS = {
  specimen_at_l0: [
    /\b(this|the)\s+(program|codebase|system|topology|specimen)\s+(shows?|reveals?|has|contains?)\b/i,
    /\b(the|this)\s+(structural|domain|cluster)\s+(assessment|analysis|posture)\b/i,
  ],
  verdict_at_l1: [
    /\bthe\s+verdict\s+(shows?|indicates?|states?|reveals?)\b/i,
    /\bposture\s+is\s+(STABLE|MONITOR|ESCALATE)\b/i,
  ],
};

function checkProhibitions(output) {
  const violations = [];

  for (const prohibition of PROHIBITIONS) {
    for (const pattern of prohibition.patterns) {
      if (pattern.test(output)) {
        violations.push({
          id: prohibition.id,
          label: prohibition.label,
          match: output.match(pattern)?.[0] || '',
        });
        break;
      }
    }
  }

  return violations;
}

function checkContextHonesty(output, contextLevel) {
  const violations = [];

  if (contextLevel < 1) {
    for (const pattern of CONTEXT_HONESTY_PATTERNS.specimen_at_l0) {
      if (pattern.test(output)) {
        violations.push({
          id: 'CTX_SPECIMEN_AT_L0',
          label: 'Claims specimen knowledge at Level 0',
          match: output.match(pattern)?.[0] || '',
        });
        break;
      }
    }
  }

  if (contextLevel < 2) {
    for (const pattern of CONTEXT_HONESTY_PATTERNS.verdict_at_l1) {
      if (pattern.test(output)) {
        violations.push({
          id: 'CTX_VERDICT_BELOW_L2',
          label: 'Claims verdict knowledge below Level 2',
          match: output.match(pattern)?.[0] || '',
        });
        break;
      }
    }
  }

  return violations;
}

function validate(output, contextLevel) {
  const prohibitionViolations = checkProhibitions(output);
  const contextViolations = checkContextHonesty(output, contextLevel);
  const allViolations = [...prohibitionViolations, ...contextViolations];

  return {
    pass: allViolations.length === 0,
    violations: allViolations,
  };
}

module.exports = {
  PROHIBITIONS,
  checkProhibitions,
  checkContextHonesty,
  validate,
};
