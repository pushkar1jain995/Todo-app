"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants/categories";
import { PRIORITIES } from "@/lib/constants/priorities";
import { useTodos } from "@/hooks/useTodos";
import { PlusIcon } from "lucide-react";

const TodoForm = () => {
  const { addTodo } = useTodos();
  const [newTodo, setNewTodo] = useState("");
  const [newTodoCategory, setNewTodoCategory] = useState(CATEGORIES[0].name);
  const [newTodoPriority, setNewTodoPriority] = useState(PRIORITIES[2].name);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    addTodo({
      text: newTodo,
      category: newTodoCategory,
      priority: newTodoPriority,
    });

    setNewTodo("");
    setNewTodoCategory(CATEGORIES[0].name);
    setNewTodoPriority(PRIORITIES[2].name);
  };

  return (
    <div className="max-w-2xl mx-auto mb-6">
      <form onSubmit={handleSubmit} className="flex gap-3 bg-white rounded-xl p-3 border shadow-sm hover:shadow-md transition-shadow">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 border-none focus:ring-2 focus:ring-blue-500/50"
        />
        <Select value={newTodoCategory} onValueChange={setNewTodoCategory}>
          <SelectTrigger className="w-[130px] bg-gray-50">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat.name} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={newTodoPriority} onValueChange={setNewTodoPriority}>
          <SelectTrigger className="w-[110px] bg-gray-50">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map(priority => (
              <SelectItem key={priority.name} value={priority.name}>
                {priority.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700">
          <PlusIcon className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default TodoForm; 
