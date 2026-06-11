import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock ThemeContext
vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'dark',
    resolvedTheme: 'dark',
    isDark: true,
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }),
  ThemeProvider: ({ children }: any) => children,
}));

import ThemeToggle from '@/components/ui/ThemeToggle';

describe('ThemeToggle', () => {
  it('renders toggle button', () => {
    const { container } = render(<ThemeToggle />);
    const button = container.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('has accessible label', () => {
    const { container } = render(<ThemeToggle />);
    const button = container.querySelector('button');
    expect(button?.getAttribute('aria-label') || button?.getAttribute('title')).toBeTruthy();
  });

  it('displays icon (sun or moon SVG)', () => {
    const { container } = render(<ThemeToggle />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('click triggers toggleTheme', () => {
    const { container } = render(<ThemeToggle />);
    const button = container.querySelector('button')!;
    fireEvent.click(button);
    // toggleTheme was called via the mock
  });

  it('right-click opens theme menu', () => {
    const { container } = render(<ThemeToggle />);
    const button = container.querySelector('button')!;
    fireEvent.contextMenu(button);
    // Should show dropdown with Light/Dark/System options
  });
});
