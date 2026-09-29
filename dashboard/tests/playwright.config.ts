import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './',
  use: {
    baseURL: 'http://localhost:3737',
    headless: true,
    screenshot: 'on',
    viewport: { width: 1280, height: 900 },
  },
  outputDir: './screenshots',
  reporter: [['list']],
})
