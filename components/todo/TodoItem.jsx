"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants/categories";
import { PRIORITIES } from "@/lib/constants/priorities";
import { PencilIcon, TrashIcon } from "lucide-react";

export function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editCategory, setEditCategory] = useState(todo.category);
  const [editPriority, setEditPriority] = useState(todo.priority);

  const handleCategoryChange = (value) => {
    console.log('Category changed to:', value);
    setEditCategory(value);
  };

  const handlePriorityChange = (value) => {
    console.log('Priority changed to:', value);
    setEditPriority(value);
  };

  const handleSave = () => {
    if (!editText.trim()) {
      console.log('Cannot save empty todo');
      return;
    }
    try {
      const updatedTodo = {
        text: editText.trim(),
        category: editCategory,
        priority: editPriority
      };
      console.log('Saving todo with values:', updatedTodo);
      onUpdate(todo.id, updatedTodo);
      setIsEditing(false);
      console.log('Todo updated successfully');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 w-full">
        <Input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-1"
        />
        <div data-testid="category-select">
          <Select 
            value={editCategory} 
            onValueChange={handleCategoryChange}
            name="category"
          >
            <SelectTrigger className="w-[120px]" aria-label="category">
              <SelectValue placeholder="Category">{editCategory}</SelectValue>
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
        </div>
        <div data-testid="priority-select">
          <Select 
            value={editPriority} 
            onValueChange={handlePriorityChange}
            name="priority"
          >
            <SelectTrigger className="w-[100px]" aria-label="priority">
              <SelectValue placeholder="Priority">{editPriority}</SelectValue>
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
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave}>
          Save
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className="h-5 w-5 border-2"
          aria-label={`Toggle ${todo.text}`}
        />
        <span className={`${
          todo.completed 
            ? "line-through text-gray-400" 
            : "text-gray-700"
        } transition-colors`}>
          {todo.text}
        </span>
        <Badge 
          variant="outline" 
          className={`${PRIORITIES.find(p => p.name === todo.priority)?.color} px-2 py-0.5 text-xs font-medium`}
        >
          {todo.priority}
        </Badge>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="hover:bg-gray-100"
          aria-label="Edit todo"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(todo.id)}
          className="hover:bg-red-100 hover:text-red-600"
          aria-label="Delete todo"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 