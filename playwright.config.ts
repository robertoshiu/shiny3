import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'pnpm preview',
    port: 4173,
    reuseExistingServer: !process.env['CI'],
  },
  use: {
    baseURL: 'http://localhost:4173/shiny3/',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
