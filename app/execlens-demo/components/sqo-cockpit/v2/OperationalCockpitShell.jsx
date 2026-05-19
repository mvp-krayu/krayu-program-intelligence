import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import RoleDeclarationGate from './RoleDeclarationGate';
import WorkflowNavigationRail from './WorkflowNavigationRail';
import OperationalOverviewShell from './OperationalOverviewShell';

import SQODegradedState from '../SQODegradedState';
import SQOCognitiveLayoutShell from '../SQOCognitiveLayoutShell';
import QualificationHeroRegion from '../QualificationHeroRegion';
import QualificationStateRibbon from '../QualificationStateRibbon';
import BlockerDominanceLayer from '../BlockerDominanceLayer';
import OperationalWorkflowSpine from '../OperationalWorkflowSpine';
import WorkflowStageCluster from '../WorkflowStageCluster';
import ProgressionRail from '../ProgressionRail';
import DeferredDebtCollapseZone from '../DeferredDebtCollapseZone';
import OperationalAttentionLayout from '../OperationalAttentionLayout';
import SQOWorkspacePanel from '../SQOWorkspacePanel';

const { buildV2NavigationItems, buildV2SectionPath, deriveV2SectionFromPath } = require('../../../lib/sqo-cockpit/V2CockpitRouteResolver');
const { computeWorkflowProjection } = require('../../../lib/sqo-cockpit/client/WorkflowRoleProjection');

export default function OperationalCockpitShell({
  client, runId, error, cockpitState, navigation, clientRuns,
  degradation, degradedNotice, isCritical,
  runtimeCapabilities, sectionAvailability, runtimeClasses,
  journey, visualState, attentionHierarchy, workflowDominance, deferredVisibility,
  sectionData, initialSection,
  workflowState: ssrWorkflowState,
}) {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [identifier, setIdentifier] = useState('');
  const [activeSection, setActiveSection] = useState(initialSection || 'overview');

  const workflowState = useMemo(() => {
    if (!ssrWorkflowState) return null;
    if (!role || role === 'operator') return ssrWorkflowState;
    return computeWorkflowProjection(ssrWorkflowState, role);
  }, [ssrWorkflowState, role]);

  const navigationItems = useMemo(() => {
    return buildV2NavigationItems(client, runId, activeSection, sectionAvailability);
  }, [client, runId, activeSection, sectionAvailability]);

  const navigateSection = useCallback((sectionId) => {
    setActiveSection(sectionId);
    const targetPath = buildV2SectionPath(client, runId, sectionId);
    router.push(targetPath, undefined, { shallow: true });
  }, [client, runId, router]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      const section = deriveV2SectionFromPath(url.split('?')[0]);
      setActiveSection(section);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  function handleRoleSelected(selectedRole, selectedIdentifier) {
    setRole(selectedRole);
    setIdentifier(selectedIdentifier);
  }

  function handleRoleChange() {
    setRole(null);
    setIdentifier('');
  }

  if (error) {
    return (
      <div className="sqo-v2-cockpit sqo-v2-cockpit--error">
        <SQODegradedState degradation={{ state: error, reason: `Route validation failed: ${error}` }} />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="sqo-v2-cockpit sqo-v2-cockpit--gate">
        <RoleDeclarationGate onRoleSelected={handleRoleSelected} />
      </div>
    );
  }

  const hasJourney = journey && journey.available;
  const roleLabel = workflowState?.roleProjection?.roleLabel || role;

  return (
    <div className={`sqo-v2-cockpit ${visualState ? visualState.chromatic_class : ''}`}>
      <WorkflowNavigationRail
        client={client}
        runId={runId}
        activeSection={activeSection}
        navigationItems={navigationItems}
        clientRuns={clientRuns}
        role={role}
        roleLabel={roleLabel}
        onNavigate={navigateSection}
        onRoleChange={handleRoleChange}
      />

      <main className="sqo-v2-cockpit__content">
        {degradedNotice && (
          <div className={`sqo-cockpit__notice sqo-cockpit__notice--${degradedNotice.severity.toLowerCase()}`}>
            {degradedNotice.message}
          </div>
        )}

        {isCritical ? (
          <SQODegradedState degradation={degradation} />
        ) : activeSection === 'overview' && hasJourney ? (
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
                        href="#"
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
        ) : activeSection === 'overview' ? (
          <OperationalOverviewShell
            workflowState={workflowState}
            onNavigateSection={navigateSection}
          />
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
