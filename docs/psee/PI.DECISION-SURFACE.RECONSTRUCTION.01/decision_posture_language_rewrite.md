# Decision Posture Language Rewrite — PI.DECISION-SURFACE.RECONSTRUCTION.01

**Contract:** PI.DECISION-SURFACE.RECONSTRUCTION.01  
**Date:** 2026-04-30

## INVESTIGATE Posture Explanation

The Decision Surface hero rationale now states:

**Hero rationale (semantic path):**  
"Structural evidence complete within the current evidence scope: 13 of 13 structural evidence groups are grounded. Semantic domain coverage is partial: 5 of 17 semantic domains have structural backing; 12 remain semantic-only. Execution evidence is incomplete."

This statement:
1. ✓ States posture is driven by evidence boundary — incomplete semantic coverage + execution not evaluated
2. ✓ States static structural evidence supports current floor score (13/13 grounded)
3. ✓ States execution layer not evaluated ("Execution evidence is incomplete.")
4. ✓ States semantic domain backing is partial (5 of 17)
5. ✓ No remediation direction implied

## Hero Context Tags

The hero context badges show:
- STRUCTURE: STABLE (when all DOM groups grounded) or DEGRADED
- EVIDENCE: PARTIAL (from decision_model["evidence_completeness"])
- RISK: LOW (from decision_model["structural_risk"])

Note: RISK = LOW because no structural metrics exceeded thresholds. The INVESTIGATE posture is driven by evidence gaps (not by risk elevation).

## Inference Prohibition

Active and visible on surface:
```
inference_prohibition | ACTIVE — all data on this surface is structural and evidential only.
No advisory content, causal inference, or remediation guidance may be derived.
```

## Forbidden Language Confirmed Absent

- "commit to this plan" — ABSENT
- "do not proceed" — ABSENT
- "recommend" (as advice) — ABSENT (the word "remediation" appears only in the prohibition disclaimer)
- "unsafe / safe" — ABSENT
- "priority" / "action" — ABSENT
- Causal claims — ABSENT
