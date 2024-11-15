"use client";

import { TodoItem } from "./TodoItem";
import { useTodos } from "@/hooks/useTodos";
import { motion, AnimatePresence } from "framer-motion";

const TodoList = () => {
  const { todos, toggleTodo, deleteTodo, updateTodo } = useTodos();

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <AnimatePresence>
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className={`
              p-4 border rounded-xl shadow-sm hover:shadow-md transition-shadow
              ${todo.priority === 'High' ? 'border-red-500/50 bg-red-50/30' : 'border-gray-200'}
              ${todo.completed ? 'opacity-75' : ''}
            `}
          >
            <TodoItem
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      {todos.length === 0 && (
        <div className="text-center text-gray-500 italic py-8">
          No todos yet. Start by adding a new task!
        </div>
      )}
    </div>
  );
};

export default TodoList; 
