import { render, screen, act, fireEvent, renderHook } from '@testing-library/react';
import React, { useState } from 'react';
import { TodoProvider, useTodoContext } from '../TodoContext';

// Mock the useLocalStorage hook
jest.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn((key, initialValue) => {
    const [state, setState] = useState(initialValue);
    return [state, setState];
  }),
}));

describe('TodoContext', () => {
  describe('Provider Initialization', () => {
    it('should initialize with default values', () => {
      const wrapper = ({ children }) => <TodoProvider>{children}</TodoProvider>;
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      expect(result.current.todos).toEqual([]);
      expect(result.current.filter).toBe('All');
      expect(result.current.sortBy).toBe('date');
    });

    it('should throw error when used outside provider', () => {
      // Temporarily suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useTodoContext());
      }).toThrow('useTodoContext must be used within a TodoProvider');

      // Restore console.error
      console.error = originalError;
    });
  });

  // Add other test cases here...
}); 