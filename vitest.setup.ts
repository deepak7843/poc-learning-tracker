import '@testing-library/jest-dom';
import { expect, vi } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';

// Extending Vitest's expect with jest-dom's matchers
expect.extend(matchers);

// Mocking window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
