"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTodos } from "@/hooks/useTodos";

export function TodoSort() {
  const { sortBy, setSortBy } = useTodos();

  return (
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
  );
} 