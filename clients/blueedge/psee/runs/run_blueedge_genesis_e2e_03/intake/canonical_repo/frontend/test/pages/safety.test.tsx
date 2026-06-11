import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AlertsPage from '@/pages/safety/AlertsPage';
import CompliancePage from '@/pages/safety/CompliancePage';
import CrossBorderPage from '@/pages/safety/CrossBorderPage';
import FatigueRiskPage from '@/pages/safety/FatigueRiskPage';
import PermitsPage from '@/pages/safety/PermitsPage';
import SafetyPage from '@/pages/safety/SafetyPage';

describe('Safety Pages', () => {
  describe('AlertsPage', () => {
    it('renders without crashing', () => {
      const { container } = render(<AlertsPage />);
      expect(container).toBeTruthy();
    });

    it('displays page header', () => {
      render(<AlertsPage />);
      const header = document.querySelector('[class*="page-header"], h1, h2');
      expect(header).toBeTruthy();
    });

    it('renders KPI trend cards', () => {
      const { container } = render(<AlertsPage />);
      const cards = container.querySelectorAll('[class*="trend-card"], [class*="stat-card"], [class*="card"]');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('has interactive tab navigation', () => {
      const { container } = render(<AlertsPage />);
      const tabs = container.querySelectorAll('button');
      expect(tabs.length).toBeGreaterThan(0);
    });
  });
  describe('CompliancePage', () => {
    it('renders without crashing', () => {
      const { container } = render(<CompliancePage />);
      expect(container).toBeTruthy();
    });

    it('displays page header', () => {
      render(<CompliancePage />);
      const header = document.querySelector('[class*="page-header"], h1, h2');
      expect(header).toBeTruthy();
    });

    it('renders KPI trend cards', () => {
      const { container } = render(<CompliancePage />);
      const cards = container.querySelectorAll('[class*="trend-card"], [class*="stat-card"], [class*="card"]');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('has interactive tab navigation', () => {
      const { container } = render(<CompliancePage />);
      const tabs = container.querySelectorAll('button');
      expect(tabs.length).toBeGreaterThan(0);
    });
  });
  describe('CrossBorderPage', () => {
    it('renders without crashing', () => {
      const { container } = render(<CrossBorderPage />);
      expect(container).toBeTruthy();
    });

    it('displays page header', () => {
      render(<CrossBorderPage />);
      const header = document.querySelector('[class*="page-header"], h1, h2');
      expect(header).toBeTruthy();
    });

    it('renders KPI trend cards', () => {
      const { container } = render(<CrossBorderPage />);
      const cards = container.querySelectorAll('[class*="trend-card"], [class*="stat-card"], [class*="card"]');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('has interactive tab navigation', () => {
      const { container } = render(<CrossBorderPage />);
      const tabs = container.querySelectorAll('button');
      expect(tabs.length).toBeGreaterThan(0);
    });
  });
  describe('FatigueRiskPage', () => {
    it('renders without crashing', () => {
      const { container } = render(<FatigueRiskPage />);
      expect(container).toBeTruthy();
    });

    it('displays page header', () => {
      render(<FatigueRiskPage />);
      const header = document.querySelector('[class*="page-header"], h1, h2');
      expect(header).toBeTruthy();
    });

    it('renders KPI trend cards', () => {
      const { container } = render(<FatigueRiskPage />);
      const cards = container.querySelectorAll('[class*="trend-card"], [class*="stat-card"], [class*="card"]');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('has interactive tab navigation', () => {
      const { container } = render(<FatigueRiskPage />);
      const tabs = container.querySelectorAll('button');
      expect(tabs.length).toBeGreaterThan(0);
    });
  });
  describe('PermitsPage', () => {
    it('renders without crashing', () => {
      const { container } = render(<PermitsPage />);
      expect(container).toBeTruthy();
    });

    it('displays page header', () => {
      render(<PermitsPage />);
      const header = document.querySelector('[class*="page-header"], h1, h2');
      expect(header).toBeTruthy();
    });

    it('renders KPI trend cards', () => {
      const { container } = render(<PermitsPage />);
      const cards = container.querySelectorAll('[class*="trend-card"], [class*="stat-card"], [class*="card"]');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('has interactive tab navigation', () => {
      const { container } = render(<PermitsPage />);
      const tabs = container.querySelectorAll('button');
      expect(tabs.length).toBeGreaterThan(0);
    });
  });
  describe('SafetyPage', () => {
    it('renders without crashing', () => {
      const { container } = render(<SafetyPage />);
      expect(container).toBeTruthy();
    });

    it('displays page header', () => {
      render(<SafetyPage />);
      const header = document.querySelector('[class*="page-header"], h1, h2');
      expect(header).toBeTruthy();
    });

    it('renders KPI trend cards', () => {
      const { container } = render(<SafetyPage />);
      const cards = container.querySelectorAll('[class*="trend-card"], [class*="stat-card"], [class*="card"]');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('has interactive tab navigation', () => {
      const { container } = render(<SafetyPage />);
      const tabs = container.querySelectorAll('button');
      expect(tabs.length).toBeGreaterThan(0);
    });
  });
});
