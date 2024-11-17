import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Mock the localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Custom console error handler to reduce noise
const originalError = console.error;
const originalLog = console.log;

console.error = (...args) => {
  // Filter out specific React error messages we expect during tests
  const errorMessage = String(args[0]);
  
  if (errorMessage.includes('Error: Uncaught [Error: useTodoContext must be used within a TodoProvider]') ||
      errorMessage.includes('The above error occurred in the <TestComponent> component') ||
      errorMessage.includes('Consider adding an error boundary') ||
      /Warning.*not wrapped in act/.test(errorMessage) ||
      /Warning.*ReactDOMTestUtils.act/.test(errorMessage) ||
      errorMessage.includes('React.createPortal')
  ) {
    return;
  }
  
  // Log other unexpected errors
  originalError.call(console, ...args);
};

// Suppress TodoContext logs during tests
console.log = (...args) => {
  const logMessage = String(args[0]);
  
  if (logMessage.includes('TodoContext - Current Todos:') ||
      logMessage.includes('Adding todo:')) {
    return;
  }
  
  originalLog.call(console, ...args);
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Clean up after each test
afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
  