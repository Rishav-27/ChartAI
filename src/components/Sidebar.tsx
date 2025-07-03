"use client";

import { useState } from "react";
import { Menu, Plus, Search, Library } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`bg-white border-r transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={() => setIsOpen(!isOpen)}>
          <Menu className="w-5 h-5" />
        </button>
        {isOpen && <span className="text-lg font-bold">Menu</span>}
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          {isOpen && <span>New Chat</span>}
        </div>
        <div className="flex items-center gap-2 cursor-pointer">
          <Search className="w-4 h-4" />
          {isOpen && <span>Search</span>}
        </div>
        <div className="flex items-center gap-2 cursor-pointer">
          <Library className="w-4 h-4" />
          {isOpen && <span>Library</span>}
        </div>

        {isOpen && (
          <div className="mt-6 space-y-2 text-sm text-gray-600">
            <div className="truncate border-t pt-2">Recent Prompts</div>
          </div>
        )}
      </div>
    </aside>
  );
}
