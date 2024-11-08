"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  { name: 'Work', color: 'bg-blue-100 text-blue-800' },
  { name: 'Personal', color: 'bg-green-100 text-green-800' },
  { name: 'Shopping', color: 'bg-purple-100 text-purple-800' },
  { name: 'Health', color: 'bg-red-100 text-red-800' }
];

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [newTodoCategory, setNewTodoCategory] = useState(CATEGORIES[0].name);
  const [filter, setFilter] = useState('All');

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editCategory, setEditCategory] = useState("");

  console.log("Current Todos:", todos);

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    console.log("Adding todo:", newTodo, "in category:", newTodoCategory);
    
    setTodos(prevTodos => [...prevTodos, { 
      id: Date.now(), 
      text: newTodo, 
      completed: false,
      category: newTodoCategory
    }]);
    setNewTodo("");
    setNewTodoCategory(CATEGORIES[0].name);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditCategory(todo.category);
  };

  const saveEdit = () => {
    setTodos(
      todos.map((todo) =>
        todo.id === editingId 
          ? { ...todo, text: editText, category: editCategory } 
          : todo
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const filteredTodos = filter === 'All' 
    ? todos 
    : todos.filter(todo => todo.category === filter);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Todo App
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new todo..."
                className="flex-1"
              />
              <Select 
                value={newTodoCategory} 
                onValueChange={setNewTodoCategory}
              >
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
              <Button onClick={addTodo}>Add</Button>
            </div>

            <div className="flex gap-2 mb-4">
              <Button 
                variant={filter === 'All' ? 'default' : 'outline'}
                onClick={() => setFilter('All')}
              >
                All
              </Button>
              {CATEGORIES.map(cat => (
                <Button
                  key={cat.name}
                  variant={filter === cat.name ? 'default' : 'outline'}
                  onClick={() => setFilter(cat.name)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  {editingId === todo.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1"
                      />
                      <Select 
                        value={editCategory} 
                        onValueChange={setEditCategory}
                      >
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={cancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={saveEdit}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                        />
                        <span
                          className={`${
                            todo.completed ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {todo.text}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={CATEGORIES.find(c => c.name === todo.category)?.color}
                        >
                          {todo.category}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditing(todo)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
