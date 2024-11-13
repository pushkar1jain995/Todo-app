"use client";

import { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [filter, setFilter] = useLocalStorage('filter', 'All');
  const [sortBy, setSortBy] = useLocalStorage('sortBy', 'date');

  console.log("TodoContext - Current Todos:", todos);

  const addTodo = (newTodo) => {
    console.log("Adding todo:", newTodo);
    const todoToAdd = {
      ...newTodo,
      id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos(prevTodos => [...prevTodos, todoToAdd]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id, updatedTodo) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, ...updatedTodo } : todo
    ));
  };

  const value = {
    todos,
    filter,
    sortBy,
    setFilter,
    setSortBy,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
}; 
