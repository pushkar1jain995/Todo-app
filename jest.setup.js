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

// Enhanced pointer event mocks
class MockPointerEvent extends Event {
  constructor(type, props) {
    super(type, props);
    this.button = props?.button ?? 0;
    this.ctrlKey = props?.ctrlKey ?? false;
    this.pointerType = props?.pointerType ?? 'mouse';
    this.pointerId = props?.pointerId ?? 1;
    this.pressure = props?.pressure ?? 0;
    this.clientX = props?.clientX ?? 0;
    this.clientY = props?.clientY ?? 0;
    this.buttons = props?.buttons ?? 0;
  }
}

// Mock pointer capture methods
HTMLElement.prototype.setPointerCapture = jest.fn();
HTMLElement.prototype.releasePointerCapture = jest.fn();
HTMLElement.prototype.hasPointerCapture = jest.fn(() => false);

global.PointerEvent = MockPointerEvent;

// Create and manage portal root for Radix UI
beforeEach(() => {
  // Remove any existing portal root
  const existingPortal = document.querySelector('#radix-portal');
  if (existingPortal) {
    existingPortal.remove();
  }
  
  // Create fresh portal root
  const portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', 'radix-portal');
  document.body.appendChild(portalRoot);
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Enhanced select helper
global.openSelect = async (element) => {
  try {
    // Force the select to open
    element.setAttribute('data-state', 'open');
    element.setAttribute('aria-expanded', 'true');
    
    // Create and append content container to portal
    const contentId = element.getAttribute('aria-controls');
    const content = document.createElement('div');
    content.setAttribute('id', contentId);
    content.setAttribute('role', 'listbox');
    content.setAttribute('data-state', 'open');
    
    const portal = document.querySelector('#radix-portal');
    portal.appendChild(content);
    
    return content;
  } catch (error) {
    console.error('Error opening select:', error);
    throw error;
  }
};
  