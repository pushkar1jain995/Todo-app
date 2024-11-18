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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with values:', {
      text: newTodo,
      category: newTodoCategory,
      priority: newTodoPriority
    });
    
    if (!newTodo.trim()) {
      console.log('Empty todo, submission cancelled');
      return;
    }

    try {
      await addTodo({
        text: newTodo,
        category: newTodoCategory,
        priority: newTodoPriority,
      });

      setNewTodo("");
      setNewTodoCategory(CATEGORIES[0].name);
      setNewTodoPriority(PRIORITIES[2].name);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
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
        <Select 
          value={newTodoCategory} 
          onValueChange={setNewTodoCategory}
          name="category"
        >
          <SelectTrigger className="w-[130px] bg-gray-50" aria-label="Category selector">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem 
                key={cat.name} 
                value={cat.name}
                data-testid={`category-option-${cat.name.toLowerCase()}`}
              >
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={newTodoPriority} 
          onValueChange={setNewTodoPriority}
          name="priority"
        >
          <SelectTrigger className="w-[110px] bg-gray-50" aria-label="Priority selector">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map(priority => (
              <SelectItem 
                key={priority.name} 
                value={priority.name}
                data-testid={`priority-option-${priority.name.toLowerCase()}`}
              >
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
