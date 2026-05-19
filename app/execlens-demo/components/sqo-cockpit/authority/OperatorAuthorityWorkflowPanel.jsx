import { useState } from 'react';
import AuthorityPostureBanner from './AuthorityPostureBanner';
import ReviewQueueActionPanel from './ReviewQueueActionPanel';
import PromotionControlPanel from './PromotionControlPanel';
import QualificationBlockerActionList from './QualificationBlockerActionList';
import PromotionEventTimeline from './PromotionEventTimeline';

export default function OperatorAuthorityWorkflowPanel({ authorityData }) {
  const [refreshKey, setRefreshKey] = useState(0);

  if (!authorityData || !authorityData.available) {
    return (
      <div className="sqo-authority-panel sqo-authority-panel--unavailable">
        <p>No promotion state artifacts found. Authority workflow requires governed qualification artifacts.</p>
      </div>
    );
  }

  const handleActionComplete = () => {
    setRefreshKey(k => k + 1);
    window.location.reload();
  };

  return (
    <div className="sqo-authority-panel" key={refreshKey}>
      <AuthorityPostureBanner posture={authorityData.authorityPosture} />

      <div className="sqo-authority-panel__sections">
        <ReviewQueueActionPanel
          reviewQueue={authorityData.reviewQueue}
          client={authorityData.client}
          runId={authorityData.runId}
          onActionComplete={handleActionComplete}
        />

        <QualificationBlockerActionList blockers={authorityData.blockerList} />

        <PromotionControlPanel
          promotionControl={authorityData.promotionControl}
          client={authorityData.client}
          runId={authorityData.runId}
          onActionComplete={handleActionComplete}
        />

        <PromotionEventTimeline events={authorityData.eventTimeline} />
      </div>

      <footer className="sqo-authority-panel__disclaimer">
        actor_id is DECLARATIVE ONLY. Not production RBAC. Not secure identity enforcement.
      </footer>
    </div>
  );
}
