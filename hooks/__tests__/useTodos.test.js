import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { TodoProvider } from '@/context/TodoContext';
import { useTodos } from '../useTodos';
import { PRIORITIES } from '@/lib/constants/priorities';

const createWrapper = () => {
  return ({ children }) => (
    <TodoProvider>{children}</TodoProvider>
  );
};

describe('useTodos hook', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = createWrapper();
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useTodos(), { wrapper });

    expect(result.current.todos).toEqual([]);
    expect(result.current.filter).toBe('All');
    expect(result.current.sortBy).toBe('date');
  });

  test('should add a todo', () => {
    const { result } = renderHook(() => useTodos(), { wrapper });

    act(() => {
      result.current.addTodo({
        title: 'Test Todo',
        description: 'Test Description',
        priority: PRIORITIES.HIGH,
        category: 'Work'
      });
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Test Todo');
    expect(result.current.todos[0].completed).toBe(false);
  });

  test('should toggle todo completion', async () => {
    const { result } = renderHook(() => useTodos(), { wrapper });

    // First act: Add the todo
    await act(async () => {
      result.current.addTodo({
        title: 'Test Todo',
        description: 'Test Description',
        priority: PRIORITIES.HIGH,
        category: 'Work'
      });
    });

    // Get the todo ID after the first operation is complete
    const todoId = result.current.todos[0].id;

    // Second act: Toggle the todo
    await act(async () => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todos[0].completed).toBe(true);
  });

  test('should delete a todo', async () => {
    const { result } = renderHook(() => useTodos(), { wrapper });

    // First act: Add the todo
    await act(async () => {
      result.current.addTodo({
        title: 'Test Todo',
        description: 'Test Description',
        priority: PRIORITIES.HIGH,
        category: 'Work'
      });
    });

    // Get the todo ID after the first operation is complete
    const todoId = result.current.todos[0].id;

    // Second act: Delete the todo
    await act(async () => {
      result.current.deleteTodo(todoId);
    });

    expect(result.current.todos).toHaveLength(0);
  });

  test('should update a todo', async () => {
    const { result } = renderHook(() => useTodos(), { wrapper });

    // First act: Add the todo
    await act(async () => {
      result.current.addTodo({
        title: 'Test Todo',
        description: 'Test Description',
        priority: PRIORITIES.HIGH,
        category: 'Work'
      });
    });

    // Get the todo ID after the first operation is complete
    const todoId = result.current.todos[0].id;

    // Second act: Update the todo
    await act(async () => {
      result.current.updateTodo(todoId, { title: 'Updated Todo' });
    });

    expect(result.current.todos[0].title).toBe('Updated Todo');
  });

  test('should filter todos by category', async () => {
    const { result } = renderHook(() => useTodos(), { wrapper });

    // Add todos in separate act calls
    await act(async () => {
      result.current.addTodo({
        title: 'Work Todo',
        description: 'Work Description',
        priority: PRIORITIES.HIGH,
        category: 'Work'
      });
    });

    await act(async () => {
      result.current.addTodo({
        title: 'Personal Todo',
        description: 'Personal Description',
        priority: PRIORITIES.LOW,
        category: 'Personal'
      });
    });

    // Set filter in separate act call
    await act(async () => {
      result.current.setFilter('Work');
    });

    // Add small delay to ensure state updates are processed
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const workTodos = result.current.todos.filter(todo => todo.category === 'Work');
    expect(workTodos).toHaveLength(1);
    expect(workTodos[0].category).toBe('Work');
  });

  test('should sort todos by priority', () => {
    const { result } = renderHook(() => useTodos(), { wrapper });

    act(() => {
      result.current.addTodo({
        title: 'Low Priority Todo',
        description: 'Low Description',
        priority: PRIORITIES.LOW,
        category: 'Work'
      });
      result.current.addTodo({
        title: 'High Priority Todo',
        description: 'High Description',
        priority: PRIORITIES.HIGH,
        category: 'Work'
      });
      result.current.setSortBy('priority');
    });

    expect(result.current.todos[0].priority).toBe(PRIORITIES.HIGH);
    expect(result.current.todos[1].priority).toBe(PRIORITIES.LOW);
  });
});
