"use client";

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TodoProvider } from "@/context/TodoContext";

const TodoForm = dynamic(() => import("@/components/todo/TodoForm"), { ssr: false });
const TodoList = dynamic(() => import("@/components/todo/TodoList"), { ssr: false });
const TodoSort = dynamic(() => import("@/components/todo/TodoSort"), { ssr: false });

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
              <TodoSort />
              <TodoList />
            </CardContent>
          </Card>
        </div>
      </div>
    </TodoProvider>
  );
}
