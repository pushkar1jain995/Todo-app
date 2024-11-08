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

const PRIORITIES = [
  { name: 'High', color: 'bg-red-100 text-red-900 border-red-500' },
  { name: 'Medium', color: 'bg-yellow-100 text-yellow-900 border-yellow-500' },
  { name: 'Low', color: 'bg-green-100 text-green-900 border-green-500' }
];

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [newTodoCategory, setNewTodoCategory] = useState(CATEGORIES[0].name);
  const [newTodoPriority, setNewTodoPriority] = useState(PRIORITIES[2].name);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPriority, setEditPriority] = useState("");

  console.log("Current Todos:", todos);

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    console.log("Adding todo:", newTodo, "in category:", newTodoCategory, "with priority:", newTodoPriority);
    
    setTodos(prevTodos => [...prevTodos, { 
      id: Date.now(), 
      text: newTodo, 
      completed: false,
      category: newTodoCategory,
      priority: newTodoPriority,
      createdAt: new Date()
    }]);
    setNewTodo("");
    setNewTodoCategory(CATEGORIES[0].name);
    setNewTodoPriority(PRIORITIES[2].name);
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
    setEditPriority(todo.priority);
  };

  const saveEdit = () => {
    setTodos(
      todos.map((todo) =>
        todo.id === editingId 
          ? { ...todo, text: editText, category: editCategory, priority: editPriority } 
          : todo
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const getSortedTodos = (todosToSort) => {
    return [...todosToSort].sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.createdAt - a.createdAt;
    });
  };

  const filteredTodos = getSortedTodos(
    filter === 'All' 
      ? todos 
      : todos.filter(todo => todo.category === filter)
  );

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
              <Select 
                value={newTodoPriority} 
                onValueChange={setNewTodoPriority}
              >
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
              <Button onClick={addTodo}>Add</Button>
            </div>

            <div className="flex justify-between mb-4">
              <Select 
                value={sortBy} 
                onValueChange={setSortBy}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center justify-between p-2 border rounded-lg ${
                    todo.priority === 'High' ? 'border-red-500 border-2' : ''
                  }`}
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
                      <Select 
                        value={editPriority} 
                        onValueChange={setEditPriority}
                      >
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
                          className={PRIORITIES.find(p => p.name === todo.priority)?.color}
                        >
                          {todo.priority}
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
