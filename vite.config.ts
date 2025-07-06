/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 1173,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      './vitest.setup.ts', // Include if you need both, otherwise remove as needed
      './src/test/setup.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'], // All useful formats
      reportsDirectory: './coverage',
      reportOnFailure: true, // Show coverage even if tests fail
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/src/test/**',
        '**/src/mocks/**',
        '**/src/types/**',
        '**/src/vite-env.d.ts',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: -10, // allows up to 10 uncovered statements globally
        }
      },
      clean: true,
      all: false, // Uncomment if you want coverage for all matched files, not just those imported in tests
    },
  },
});
