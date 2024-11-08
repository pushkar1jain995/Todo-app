"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState(() => {
    try {
      const savedTodos = localStorage.getItem('todos');
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (error) {
      console.error("Error loading todos from localStorage:", error);
      return [];
    }
  });
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  // Save todos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todos to localStorage:", error);
    }
  }, [todos]);

  console.log("TodoContext - Current Todos:", todos);

  const addTodo = (newTodo) => {
    console.log("Adding todo:", newTodo);
    const todoToAdd = {
      ...newTodo,
      id: Date.now(),
      completed: false,
      createdAt: new Date()
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
