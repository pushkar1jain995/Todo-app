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
  // Provider Initialization Tests
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

  // CRUD Operations Tests
  describe('CRUD Operations', () => {
    const wrapper = ({ children }) => <TodoProvider>{children}</TodoProvider>;

    it('should add a new todo correctly', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      const newTodo = {
        title: 'Test Todo',
        category: 'Work',
        priority: 'High'
      };

      act(() => {
        result.current.addTodo(newTodo);
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0]).toMatchObject({
        ...newTodo,
        completed: false,
      });
      expect(result.current.todos[0].id).toBeDefined();
      expect(result.current.todos[0].createdAt).toBeDefined();
    });

    it('should toggle todo completion status', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.addTodo({
          title: 'Toggle Test',
          category: 'Work',
          priority: 'High'
        });
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.toggleTodo(todoId);
      });

      expect(result.current.todos[0].completed).toBe(true);

      act(() => {
        result.current.toggleTodo(todoId);
      });

      expect(result.current.todos[0].completed).toBe(false);
    });

    it('should delete a todo', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.addTodo({
          title: 'Delete Test',
          category: 'Work',
          priority: 'High'
        });
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.deleteTodo(todoId);
      });

      expect(result.current.todos).toHaveLength(0);
    });

    it('should update a todo', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.addTodo({
          title: 'Update Test',
          category: 'Work',
          priority: 'High'
        });
      });

      const todoId = result.current.todos[0].id;
      const updatedTitle = 'Updated Title';

      act(() => {
        result.current.updateTodo(todoId, { title: updatedTitle });
      });

      expect(result.current.todos[0].title).toBe(updatedTitle);
    });
  });

  // Filter and Sort Tests
  describe('Filter and Sort Management', () => {
    const wrapper = ({ children }) => <TodoProvider>{children}</TodoProvider>;

    it('should update filter state', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.setFilter('Work');
      });

      expect(result.current.filter).toBe('Work');
    });

    it('should update sort state', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.setSortBy('priority');
      });

      expect(result.current.sortBy).toBe('priority');
    });
  });

  // Integration Tests
  describe('Integration Tests', () => {
    const wrapper = ({ children }) => <TodoProvider>{children}</TodoProvider>;

    it('should maintain state across multiple operations', async () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      // Add todos
      await act(async () => {
        result.current.addTodo({
          title: 'Todo 1',
          category: 'Work',
          priority: 'High'
        });
      });

      await act(async () => {
        result.current.addTodo({
          title: 'Todo 2',
          category: 'Personal',
          priority: 'Low'
        });
      });

      expect(result.current.todos).toHaveLength(2);

      const firstTodoId = result.current.todos[0].id;
      const secondTodoId = result.current.todos[1].id;

      // Toggle first todo
      await act(async () => {
        result.current.toggleTodo(firstTodoId);
      });

      expect(result.current.todos[0].completed).toBe(true);

      // Update second todo
      await act(async () => {
        result.current.updateTodo(secondTodoId, { title: 'Updated Todo 2' });
      });

      expect(result.current.todos[1].title).toBe('Updated Todo 2');

      // Delete first todo
      await act(async () => {
        result.current.deleteTodo(firstTodoId);
      });

      // Add small delay to ensure state updates are processed
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].id).toBe(secondTodoId);
    });

    it('should handle empty todos list operations', () => {
      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.deleteTodo(123);
        result.current.toggleTodo(456);
        result.current.updateTodo(789, { title: 'New Title' });
      });

      expect(result.current.todos).toHaveLength(0);
    });
  });
}); 