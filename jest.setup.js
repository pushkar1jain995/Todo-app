import '@testing-library/jest-dom';

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
  if (args[0]?.includes('Error: Uncaught [Error: useTodoContext must be used within a TodoProvider]')) {
    return;
  }
  if (args[0]?.includes('The above error occurred in the <TestComponent> component')) {
    return;
  }
  if (args[0]?.includes('Consider adding an error boundary')) {
    return;
  }
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  if (/Warning.*ReactDOMTestUtils.act/.test(args[0])) {
    return;
  }
  // Log other unexpected errors
  originalError.call(console, ...args);
};

// Suppress TodoContext logs during tests
console.log = (...args) => {
  if (args[0]?.includes('TodoContext - Current Todos:')) {
    return;
  }
  if (args[0]?.includes('Adding todo:')) {
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