"use client";

import { TodoItem } from "./TodoItem";
import { useTodos } from "@/hooks/useTodos";

export default function TodoList() {
  const { todos, toggleTodo, deleteTodo, updateTodo } = useTodos();

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`p-2 border rounded-lg ${
            todo.priority === 'High' ? 'border-red-500 border-2' : ''
          }`}
        >
          <TodoItem
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        </div>
      ))}
    </div>
  );
} 
