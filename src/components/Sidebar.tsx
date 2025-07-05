"use client";

import { useState } from "react";
import { Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNewChat: () => void;
  onSelectChat: (chat: any[]) => void;
  previousChats: any[]; // array of chat sessions
}

export default function Sidebar({
  onNewChat,
  onSelectChat,
  previousChats,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={cn(
        "bg-gradient-to-b from-blue-50 to-white border-r h-screen transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={() => setIsOpen(!isOpen)}>
          <Menu className="w-5 h-5 text-blue-600" />
        </button>
        {isOpen && <span className="text-lg font-bold text-blue-700">Chats</span>}
      </div>

      <div className="p-4 space-y-4">
        <div
          className="flex items-center gap-2 p-2 cursor-pointer rounded hover:bg-blue-100"
          onClick={onNewChat}
        >
          <Plus className="w-4 h-4 text-blue-600" />
          {isOpen && <span className="text-blue-700">New Chat</span>}
        </div>

        {previousChats.length > 0 && (
          <div className="space-y-1 text-sm text-gray-700">
            {previousChats.map((chat, i) => (
              <div
                key={i}
                onClick={() => onSelectChat(chat)}
                className="p-2 rounded hover:bg-gray-100 cursor-pointer truncate border border-gray-100"
              >
                {isOpen ? chat[0]?.prompt?.slice(0, 30) || "Untitled Chat" : "💬"}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
