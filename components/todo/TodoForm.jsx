"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants/categories";
import { PRIORITIES } from "@/lib/constants/priorities";
import { useTodos } from "@/hooks/useTodos";

export default function TodoForm() {
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
    <div className="flex gap-2 mb-4">
      <Input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo..."
        className="flex-1"
      />
      <Select value={newTodoCategory} onValueChange={setNewTodoCategory}>
        <SelectTrigger className="w-[120px]">
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
        <SelectTrigger className="w-[100px]">
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
      <Button onClick={handleSubmit}>Add</Button>
    </div>
  );
} 
