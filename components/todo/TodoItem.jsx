"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants/categories";
import { PRIORITIES } from "@/lib/constants/priorities";

export function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editCategory, setEditCategory] = useState(todo.category);
  const [editPriority, setEditPriority] = useState(todo.priority);

  const handleSave = () => {
    onUpdate(todo.id, {
      text: editText,
      category: editCategory,
      priority: editPriority
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 w-full">
        <Input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-1"
        />
        <Select value={editCategory} onValueChange={setEditCategory}>
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
        <Select value={editPriority} onValueChange={setEditPriority}>
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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
        />
        <span className={`${todo.completed ? "line-through text-gray-500" : ""}`}>
          {todo.text}
        </span>
        <Badge 
          variant="outline" 
          className={PRIORITIES.find(p => p.name === todo.priority)?.color}
        >
          {todo.priority}
        </Badge>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(todo.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
} 