import type { Preview } from '@storybook/react';
import React from 'react';

// Blue Edge dark theme CSS variables
const themeStyles = `
  :root {
    --bg-primary: #0a0e1a; --bg-secondary: #0f1525; --bg-card: #141b2d;
    --text-primary: #e2e8f0; --text-secondary: #94a3b8; --text-muted: #64748b;
    --cyan: #06b6d4; --cyan-glow: rgba(6,182,212,0.15);
    --green: #22c55e; --red: #ef4444; --amber: #f59e0b; --blue: #3b82f6;
    --border: #1e293b; --border-active: #334155;
    --radius: 8px; --radius-sm: 4px;
    --shadow: 0 4px 12px rgba(0,0,0,0.3);
    --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  body {
    background: var(--bg-primary); color: var(--text-primary);
    font-family: var(--font); margin: 0; padding: 16px;
  }
  *, *::before, *::after { box-sizing: border-box; }
`;

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'Blue Edge Dark',
      values: [
        { name: 'Blue Edge Dark', value: '#0a0e1a' },
        { name: 'Blue Edge Light', value: '#f3f6fb' },
        { name: 'White', value: '#ffffff' },
      ],
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' } },
        wide: { name: 'Wide', styles: { width: '1920px', height: '1080px' } },
      },
    },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: 'padded',
  },
  decorators: [
    (Story) => React.createElement(
      'div',
      null,
      React.createElement('style', null, themeStyles),
      React.createElement(Story)
    ),
  ],
};

export default preview;
