'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

describe('SQO Cockpit Final Stabilization', () => {

  describe('Left Rail Header — No Overflow', () => {
    it('SQONavigation renders stacked client/run labels, not raw combined string', () => {
      const src = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQONavigation.jsx'), 'utf8'
      );
      assert.ok(!src.includes('{client} / {runId}'),
        'Should not render client/runId as single combined string');
      assert.ok(src.includes('sqo-cockpit-nav__client-value'),
        'Should render client in dedicated element');
      assert.ok(src.includes('sqo-cockpit-nav__run-value'),
        'Should render run in dedicated element');
    });

    it('CSS enforces max-width and text-overflow on identity values', () => {
      const css = fs.readFileSync(
        path.join(ROOT, 'styles/globals.css'), 'utf8'
      );
      assert.ok(css.includes('.sqo-cockpit-nav__client-value'));
      assert.ok(css.includes('.sqo-cockpit-nav__run-value'));
      assert.ok(css.includes('text-overflow: ellipsis'));
      assert.ok(css.includes('max-width:'));
    });

    it('identity container has overflow hidden', () => {
      const css = fs.readFileSync(
        path.join(ROOT, 'styles/globals.css'), 'utf8'
      );
      assert.ok(css.includes('.sqo-cockpit-nav__identity'));
      const identityBlock = css.substring(
        css.indexOf('.sqo-cockpit-nav__identity'),
        css.indexOf('}', css.indexOf('.sqo-cockpit-nav__identity')) + 1
      );
      assert.ok(identityBlock.includes('overflow: hidden'));
    });
  });

  describe('Client/Run Switcher', () => {
    it('SQONavigation accepts clientRuns prop', () => {
      const src = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQONavigation.jsx'), 'utf8'
      );
      assert.ok(src.includes('clientRuns'));
    });

    it('switcher renders link targets for all registered runs', () => {
      const src = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQONavigation.jsx'), 'utf8'
      );
      assert.ok(src.includes('sqo-cockpit-nav__switcher'));
      assert.ok(src.includes('/sqo/client/${cr.client}/run/${cr.run}'));
    });

    it('workspace data resolver includes clientRuns in output', () => {
      const { resolveWorkspaceData } = require(
        path.join(ROOT, 'lib/sqo-cockpit/SQOWorkspaceDataResolver')
      );
      const data = resolveWorkspaceData('fastapi', 'run_02_oss_fastapi_pipeline', 'overview');
      assert.ok(Array.isArray(data.clientRuns), 'clientRuns should be an array');
      assert.ok(data.clientRuns.length >= 2, 'should have at least 2 registered runs');
    });

    it('FastAPI switch target is resolvable', () => {
      const { resolveWorkspaceData } = require(
        path.join(ROOT, 'lib/sqo-cockpit/SQOWorkspaceDataResolver')
      );
      const data = resolveWorkspaceData('fastapi', 'run_02_oss_fastapi_pipeline', 'overview');
      const fastapi = data.clientRuns.find(cr => cr.client === 'fastapi');
      assert.ok(fastapi, 'FastAPI client must be in clientRuns');
      assert.equal(fastapi.run, 'run_02_oss_fastapi_pipeline');
    });

    it('BlueEdge switch target is resolvable', () => {
      const { resolveWorkspaceData } = require(
        path.join(ROOT, 'lib/sqo-cockpit/SQOWorkspaceDataResolver')
      );
      const data = resolveWorkspaceData('fastapi', 'run_02_oss_fastapi_pipeline', 'overview');
      const blueedge = data.clientRuns.find(cr => cr.client === 'blueedge');
      assert.ok(blueedge, 'BlueEdge client must be in clientRuns');
      assert.equal(blueedge.run, 'run_blueedge_productized_01_fixed');
    });

    it('clientRuns included even on error path', () => {
      const { resolveWorkspaceData } = require(
        path.join(ROOT, 'lib/sqo-cockpit/SQOWorkspaceDataResolver')
      );
      const data = resolveWorkspaceData('nonexistent', 'fake_run', 'overview');
      assert.ok(data.error, 'should have error');
      assert.ok(Array.isArray(data.clientRuns), 'clientRuns should still be present on error');
    });
  });

  describe('Overview Navigation Anchor', () => {
    it('overview is first navigation section', () => {
      const { buildNavigationItems } = require(
        path.join(ROOT, 'lib/sqo-cockpit/SQOCockpitRouteResolver')
      );
      const items = buildNavigationItems('fastapi', 'run_02_oss_fastapi_pipeline', 'overview');
      assert.equal(items[0].section, 'overview');
      assert.equal(items[0].label, 'Overview');
    });

    it('detail panels include back-to-overview button', () => {
      const src = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQOWorkspacePanel.jsx'), 'utf8'
      );
      assert.ok(src.includes('onNavigateOverview'));
      assert.ok(src.includes('← Overview'));
    });

    it('workspace shell passes onNavigateOverview to panel', () => {
      const src = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQOWorkspaceShell.jsx'), 'utf8'
      );
      assert.ok(src.includes('onNavigateOverview'));
    });
  });

  describe('Detail Section Contextual Framing', () => {
    const EXPECTED_SECTIONS = ['debt', 'continuity', 'maturity', 'progression', 'evidence', 'handoff'];

    it('all 6 sections have contextual definitions', () => {
      const src = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQOWorkspacePanel.jsx'), 'utf8'
      );
      for (const section of EXPECTED_SECTIONS) {
        assert.ok(src.includes(`${section}:`), `section context missing for ${section}`);
      }
    });

    it('each section context has title, purpose, focus, and type', () => {
      const src = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQOWorkspacePanel.jsx'), 'utf8'
      );
      const contextFields = ['title:', 'purpose:', 'focus:', 'type:'];
      for (const field of contextFields) {
        const count = (src.match(new RegExp(field, 'g')) || []).length;
        assert.ok(count >= 6, `${field} should appear at least 6 times (once per section)`);
      }
    });

    it('section type classifies as forensic or operational', () => {
      const src = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQOWorkspacePanel.jsx'), 'utf8'
      );
      assert.ok(src.includes('forensic detail'));
      assert.ok(src.includes('operational guidance'));
    });

    it('panel header renders title and purpose elements', () => {
      const src = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQOWorkspacePanel.jsx'), 'utf8'
      );
      assert.ok(src.includes('sqo-workspace-panel__title'));
      assert.ok(src.includes('sqo-workspace-panel__purpose'));
      assert.ok(src.includes('sqo-workspace-panel__focus'));
      assert.ok(src.includes('sqo-workspace-panel__type'));
    });
  });

  describe('Persistent Navigation', () => {
    it('workspace shell renders SQONavigation alongside content', () => {
      const src = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQOWorkspaceShell.jsx'), 'utf8'
      );
      assert.ok(src.includes('SQONavigation'));
      assert.ok(src.includes('sqo-cockpit__content'));
    });

    it('nav rail CSS is sticky and full height', () => {
      const css = fs.readFileSync(
        path.join(ROOT, 'styles/globals.css'), 'utf8'
      );
      const navBlock = css.substring(
        css.indexOf('.sqo-cockpit-nav {'),
        css.indexOf('}', css.indexOf('.sqo-cockpit-nav {')) + 1
      );
      assert.ok(navBlock.includes('position: sticky'));
      assert.ok(navBlock.includes('min-height: 100vh'));
    });

    it('active section highlighting is driven by activeSection prop', () => {
      const src = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQONavigation.jsx'), 'utf8'
      );
      assert.ok(src.includes('activeSection'));
      assert.ok(src.includes('sqo-cockpit-nav__item--active'));
    });
  });

  describe('Governance Compliance', () => {
    it('no LENS runtime coupling introduced', () => {
      const navSrc = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQONavigation.jsx'), 'utf8'
      );
      const panelSrc = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQOWorkspacePanel.jsx'), 'utf8'
      );
      assert.ok(!navSrc.includes('lens-v2'));
      assert.ok(!panelSrc.includes('lens-v2'));
    });

    it('no PATH B coupling introduced', () => {
      const navSrc = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQONavigation.jsx'), 'utf8'
      );
      const panelSrc = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQOWorkspacePanel.jsx'), 'utf8'
      );
      assert.ok(!navSrc.includes('pathb') && !navSrc.includes('PATH_B'));
      assert.ok(!panelSrc.includes('pathb') && !panelSrc.includes('PATH_B'));
    });

    it('no artifact mutation occurs in stabilization components', () => {
      const navSrc = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQONavigation.jsx'), 'utf8'
      );
      const panelSrc = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQOWorkspacePanel.jsx'), 'utf8'
      );
      const shellSrc = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQOWorkspaceShell.jsx'), 'utf8'
      );
      for (const src of [navSrc, panelSrc, shellSrc]) {
        assert.ok(!src.includes('writeFile') && !src.includes('fs.write'));
        assert.ok(!src.includes('mutation') && !src.includes('mutate'));
      }
    });

    it('section panels remain unmodified (no imports changed)', () => {
      const panelSrc = fs.readFileSync(
        path.join(ROOT, 'components/sqo-cockpit/SQOWorkspacePanel.jsx'), 'utf8'
      );
      const expectedImports = [
        'SemanticDebtPanel', 'ContinuityAssessmentPanel', 'MaturityProfilePanel',
        'ProgressionReadinessPanel', 'EvidenceReplayPanel', 'HandoffReadinessPanel',
      ];
      for (const imp of expectedImports) {
        assert.ok(panelSrc.includes(imp), `panel import ${imp} must be preserved`);
      }
    });
  });
});
