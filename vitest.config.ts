import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // Use jsdom for component tests
    include: ['test/**/*.test.ts'],
  },
});
