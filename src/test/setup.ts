import '@testing-library/jest-dom';

Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
  configurable: true,
  value: () => {},
});
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../mocks/server';

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test (important for test isolation)
afterEach(() => server.resetHandlers());

// Clean up after all tests are done
afterAll(() => server.close());
