import { useState } from 'react';

export default function CandidateQuarantineSummary({ evaluations, summary }) {
  const [showQuarantineDetails, setShowQuarantineDetails] = useState(false);
  const [showRejectedDetails, setShowRejectedDetails] = useState(false);

  if (!evaluations || evaluations.length === 0) {
    return null;
  }

  const quarantined = evaluations.filter(e => e.is_quarantined);
  const rejected = evaluations.filter(e => e.is_rejected);

  if (quarantined.length === 0 && rejected.length === 0) {
    return null;
  }

  const quarantineReasons = {};
  for (const e of quarantined) {
    const reason = e.quarantine_reason || 'Unspecified';
    if (!quarantineReasons[reason]) quarantineReasons[reason] = [];
    quarantineReasons[reason].push(e);
  }

  const rejectionReasons = {};
  for (const e of rejected) {
    const reason = e.admissibility_reason || 'Unspecified';
    if (!rejectionReasons[reason]) rejectionReasons[reason] = [];
    rejectionReasons[reason].push(e);
  }

  return (
    <div className="admissibility-quarantine">
      <div className="admissibility-quarantine__header">
        <h3 className="admissibility-quarantine__title">Quarantine and Rejection Summary</h3>
        <div className="admissibility-quarantine__badges">
          {quarantined.length > 0 && (
            <span className="corridor-badge corridor-badge--warn">{quarantined.length} QUARANTINED</span>
          )}
          {rejected.length > 0 && (
            <span className="corridor-badge corridor-badge--danger">{rejected.length} REJECTED</span>
          )}
        </div>
      </div>

      {quarantined.length > 0 && (
        <div className="admissibility-quarantine__section">
          <div
            className="admissibility-quarantine__section-trigger"
            onClick={() => setShowQuarantineDetails(!showQuarantineDetails)}
          >
            <span className="admissibility-quarantine__section-label">Quarantine Reasons</span>
            <span className="admissibility-quarantine__section-toggle">
              {showQuarantineDetails ? '[-]' : '[+]'}
            </span>
          </div>

          {showQuarantineDetails && (
            <div className="admissibility-quarantine__details">
              {Object.entries(quarantineReasons).map(([reason, candidates]) => (
                <div key={reason} className="admissibility-quarantine__reason-group">
                  <div className="admissibility-quarantine__reason-text">{reason}</div>
                  <div className="admissibility-quarantine__reason-candidates">
                    {candidates.map(c => (
                      <span key={c.candidate_id} className="admissibility-quarantine__candidate-chip">
                        {c.candidate_id} → {c.candidate_domain}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {rejected.length > 0 && (
        <div className="admissibility-quarantine__section">
          <div
            className="admissibility-quarantine__section-trigger"
            onClick={() => setShowRejectedDetails(!showRejectedDetails)}
          >
            <span className="admissibility-quarantine__section-label">Rejection Reasons</span>
            <span className="admissibility-quarantine__section-toggle">
              {showRejectedDetails ? '[-]' : '[+]'}
            </span>
          </div>

          {showRejectedDetails && (
            <div className="admissibility-quarantine__details">
              {Object.entries(rejectionReasons).map(([reason, candidates]) => (
                <div key={reason} className="admissibility-quarantine__reason-group">
                  <div className="admissibility-quarantine__reason-text">{reason}</div>
                  <div className="admissibility-quarantine__reason-candidates">
                    {candidates.map(c => (
                      <span key={c.candidate_id} className="admissibility-quarantine__candidate-chip">
                        {c.candidate_id}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="admissibility-quarantine__footer">
        Quarantined candidates require governance review before overlay eligibility.
        Rejected candidates cannot proceed without domain resolution or evidence strengthening.
      </div>
    </div>
  );
}
