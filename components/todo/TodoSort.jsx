"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTodos } from "@/hooks/useTodos";
import { IconArrowsSort, IconCalendar, IconFlag } from "@tabler/icons-react";

const TodoSort = () => {
  const { sortBy, setSortBy } = useTodos();

  return (
    <div className="flex justify-between items-center mb-6 px-1">
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[140px] bg-white">
          <IconArrowsSort className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">
            <div className="flex items-center">
              <IconCalendar className="w-4 h-4 mr-2" />
              Date
            </div>
          </SelectItem>
          <SelectItem value="priority">
            <div className="flex items-center">
              <IconFlag className="w-4 h-4 mr-2" />
              Priority
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TodoSort; 
