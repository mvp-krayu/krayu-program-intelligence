import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import SQONavigation from './SQONavigation';
import SQODegradedState from './SQODegradedState';
import SQOCognitiveLayoutShell from './SQOCognitiveLayoutShell';
import QualificationHeroRegion from './QualificationHeroRegion';
import QualificationStateRibbon from './QualificationStateRibbon';
import BlockerDominanceLayer from './BlockerDominanceLayer';
import OperationalWorkflowSpine from './OperationalWorkflowSpine';
import WorkflowStageCluster from './WorkflowStageCluster';
import ProgressionRail from './ProgressionRail';
import DeferredDebtCollapseZone from './DeferredDebtCollapseZone';
import OperationalAttentionLayout from './OperationalAttentionLayout';
import SQOWorkspacePanel from './SQOWorkspacePanel';

export default function SQOWorkspaceShell({
  client, runId, error, cockpitState, navigation, clientRuns,
  degradation, degradedNotice, isCritical,
  journey, visualState, attentionHierarchy, workflowDominance, deferredVisibility,
  sectionData, initialSection,
}) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(initialSection || 'overview');

  const navigateSection = useCallback((sectionId) => {
    setActiveSection(sectionId);
    const basePath = `/sqo/client/${client}/run/${runId}`;
    const targetPath = sectionId === 'overview' ? basePath : `${basePath}/${sectionId}`;
    router.push(targetPath, undefined, { shallow: true });
  }, [client, runId, router]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      const segments = url.split('?')[0].split('/').filter(Boolean);
      const last = segments[segments.length - 1];
      const knownSections = ['debt', 'continuity', 'maturity', 'progression', 'evidence', 'handoff', 'corridor', 'evidence-ingestion', 'semantic-candidates', 'ceu-admissibility', 'evidence-rebase'];
      setActiveSection(knownSections.includes(last) ? last : 'overview');
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  if (error) {
    return (
      <div className="sqo-cockpit sqo-cockpit--error">
        <h1>SQO Cockpit</h1>
        <SQODegradedState degradation={{ state: error, reason: `Route validation failed: ${error}` }} />
      </div>
    );
  }

  const hasJourney = journey && journey.available;

  return (
    <div className={`sqo-cockpit ${visualState ? visualState.chromatic_class : ''}`}>
      <SQONavigation
        client={client}
        runId={runId}
        activeSection={activeSection}
        sections={navigation}
        clientRuns={clientRuns}
        degradation={degradation}
        onNavigate={navigateSection}
      />

      <main className="sqo-cockpit__content">
        {degradedNotice && (
          <div className={`sqo-cockpit__notice sqo-cockpit__notice--${degradedNotice.severity.toLowerCase()}`}>
            {degradedNotice.message}
          </div>
        )}

        {isCritical ? (
          <SQODegradedState degradation={degradation} />
        ) : activeSection === 'overview' ? (
          hasJourney ? (
            <OperationalAttentionLayout attentionHierarchy={attentionHierarchy}>
              <SQOCognitiveLayoutShell
                visualState={visualState}
                ribbon={
                  <QualificationStateRibbon
                    banner={journey.banner}
                    visualState={visualState}
                    debtCounts={journey.debtCounts}
                    maturity={journey.maturity}
                    continuity={journey.continuity}
                  />
                }
                heroRegion={
                  <QualificationHeroRegion
                    banner={journey.banner}
                    visualState={visualState}
                    narratives={journey.narratives}
                  />
                }
                blockerLayer={
                  journey.immediateBlockers && journey.immediateBlockers.length > 0 ? (
                    <BlockerDominanceLayer
                      blockers={journey.immediateBlockers}
                      debtCounts={journey.debtCounts}
                      visualState={visualState}
                    />
                  ) : null
                }
                spine={
                  workflowDominance && workflowDominance.spineNodes.length > 0 ? (
                    <OperationalWorkflowSpine
                      spineNodes={workflowDominance.spineNodes}
                      sState={journey.banner.s_state}
                      nextState={journey.banner.next_reachable}
                    />
                  ) : null
                }
                workflowCluster={
                  workflowDominance && workflowDominance.stages.length > 0 ? (
                    <WorkflowStageCluster
                      stages={workflowDominance.stages}
                      currentStage={journey.currentStage}
                      sourceGuidance={journey.sourceGuidance}
                      rerunChecklist={journey.rerunChecklist}
                    />
                  ) : null
                }
                progressionRail={
                  <ProgressionRail
                    progression={journey.progression}
                    validationGates={journey.validationGates}
                    visualState={visualState}
                  />
                }
                deferredZone={
                  <DeferredDebtCollapseZone
                    deferred={journey.deferredDebt}
                    active={journey.activeDebt}
                    visibility={deferredVisibility}
                  />
                }
                forensicLink={
                  <div className="sqo-forensic-link">
                    <span className="sqo-forensic-link__label">Detailed exploration</span>
                    <nav className="sqo-forensic-link__nav">
                      {navigation && navigation.filter(n => n.section !== 'overview').map(nav => (
                        <a
                          key={nav.section}
                          href={nav.path}
                          className="sqo-forensic-link__item"
                          onClick={(e) => { e.preventDefault(); navigateSection(nav.section); }}
                        >
                          {nav.label}
                        </a>
                      ))}
                    </nav>
                  </div>
                }
                governance={
                  <span>Read-only artifact consumption · No AI interpretation · Deterministic display</span>
                }
              />
            </OperationalAttentionLayout>
          ) : (
            <div className="sqo-cockpit__no-journey">
              <p>Qualification journey could not be resolved. Use section navigation for detailed artifact exploration.</p>
            </div>
          )
        ) : (
          <SQOWorkspacePanel
            section={activeSection}
            sectionData={sectionData}
            onNavigateOverview={() => navigateSection('overview')}
          />
        )}
      </main>
    </div>
  );
}
