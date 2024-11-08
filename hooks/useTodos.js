import { useTodoContext } from "@/context/TodoContext";
import { PRIORITIES } from "@/lib/constants/priorities";

export function useTodos() {
  const {
    todos,
    filter,
    sortBy,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    setFilter,
    setSortBy
  } = useTodoContext();

  const getSortedTodos = (todosToSort) => {
    return [...todosToSort].sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.createdAt - a.createdAt;
    });
  };

  const filteredAndSortedTodos = getSortedTodos(
    filter === 'All' 
      ? todos 
      : todos.filter(todo => todo.category === filter)
  );

  return {
    todos: filteredAndSortedTodos,
    filter,
    sortBy,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    setFilter,
    setSortBy
  };
} 