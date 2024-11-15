"use client";

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TodoProvider } from "@/context/TodoContext";

const TodoForm = dynamic(() => import("../components/todo/TodoForm"), {
  ssr: false,
});

const TodoList = dynamic(() => import("../components/todo/TodoList"), {
  ssr: false,
});

const TodoSort = dynamic(() => import("../components/todo/TodoSort"), {
  ssr: false,
});

export default function Home() {
  return (
    <TodoProvider>
      <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Todo App
              </CardTitle>
              <p className="text-sm text-muted-foreground">Organize your tasks efficiently</p>
            </CardHeader>
            <CardContent>
              <TodoForm />
              <TodoSort />
              <TodoList />
            </CardContent>
          </Card>
        </div>
      </div>
    </TodoProvider>
  );
}
