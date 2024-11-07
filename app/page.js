"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
    setNewTodo("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
   etTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    setTodos(
      todos.map((todo) =>
        todo.id === editingId ? { ...todo, text: editText } : todo
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

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
            <form onSubmit={addTodo} className="flex gap-2 mb-4">
              <Input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new todo..."
                className="flex-1"
              />
              <Button type="submit">Add</Button>
            </form>

            <div className="space-y-2">
              {todos.map((todo) => (
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
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
