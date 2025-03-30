import '@testing-library/jest-dom';
import { vi } from 'vitest';

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

// Mock de react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => children,
    Routes: ({ children }) => children,
    Route: ({ children }) => children,
  };
});

vi.mock('../services/indexedDB', () => ({
  default: {
    initSampleData: vi.fn().mockResolvedValue(undefined)
  }
}));

vi.mock('../services/localStorage', () => ({
  default: {
    getUserPreferences: vi.fn().mockReturnValue({
      theme: 'light',
      fontSize: 'medium'
    }),
    updateLastVisitedPage: vi.fn()
  }
}));

vi.mock('../services/serviceWorkerRegistration', () => ({
  register: vi.fn()
}));