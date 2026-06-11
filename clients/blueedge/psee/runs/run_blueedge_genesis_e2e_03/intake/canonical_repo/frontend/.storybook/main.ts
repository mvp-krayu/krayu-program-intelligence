import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)', '../components/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': require('path').resolve(__dirname, '..'),
        '@/components': require('path').resolve(__dirname, '../components'),
        '@/hooks': require('path').resolve(__dirname, '../hooks'),
        '@/constants': require('path').resolve(__dirname, '../constants'),
        '@/types': require('path').resolve(__dirname, '../types'),
        '@/utils': require('path').resolve(__dirname, '../utils'),
        '@/contexts': require('path').resolve(__dirname, '../contexts'),
      };
    }
    return config;
  },
};

export default config;
