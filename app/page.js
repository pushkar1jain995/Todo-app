"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TodoProvider } from "@/context/TodoContext";
import { TodoForm } from "@/components/todo/TodoForm";
import { TodoList } from "@/components/todo/TodoList";

export default function Home() {
  return (
    <TodoProvider>
      <div className="min-h-screen p-4 bg-gray-50">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Todo App
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TodoForm />
              <TodoList />
            </CardContent>
          </Card>
        </div>
      </div>
    </TodoProvider>
  );
}
