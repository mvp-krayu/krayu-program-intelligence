import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1440,
    viewportHeight: 900,
    defaultCommandTimeout: 10000,
    video: false,
    screenshotOnRunFailure: true,
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    env: {
      ADMIN_EMAIL: 'admin@blueedge.ae',
      ADMIN_PASSWORD: 'admin123',
      API_URL: 'http://localhost:3000/api/v1',
    },
    retries: { runMode: 2, openMode: 0 },
  },
});
