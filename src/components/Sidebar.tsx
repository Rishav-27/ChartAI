"use client";

import { useState, useMemo } from "react";
import {
  Menu,
  Plus,
  LogOut,
  MessageSquareText,
  Search,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarChatSession } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SidebarProps {
  onNewChat: () => void;
  onSelectChat: (sessionId: string) => void;
  previousChats: SidebarChatSession[];
  currentChatId: string | null;
  onLogout: () => void;
}

export default function Sidebar({
  onNewChat,
  onSelectChat,
  previousChats,
  currentChatId,
  onLogout,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = useMemo(() => {
    return previousChats.filter((chat) =>
      chat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, previousChats]);

  return (
    <aside
      className={cn(
        "bg-gradient-to-b from-blue-50 to-white border-r h-screen transition-all duration-300 flex flex-col",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-blue-600" />
          {isOpen && (
            <span className="text-lg font-bold text-blue-700">Chats</span>
          )}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none ml-auto"
        >
          <Menu className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <div
          className="flex items-center gap-2 p-2 cursor-pointer rounded hover:bg-blue-100 transition-colors duration-200"
          onClick={onNewChat}
        >
          <Plus className="w-4 h-4 text-blue-600" />
          {isOpen && <span className="text-blue-700">New Chat</span>}
        </div>

        {isOpen && (
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search chats"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 rounded-md text-sm shadow border border-gray-200"
            />
          </div>
        )}

        <div className="space-y-1 text-sm text-gray-700">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  "p-2 rounded-md cursor-pointer transition-colors duration-200 border",
                  "hover:bg-gray-100",
                  currentChatId === chat.id
                    ? "bg-blue-200 text-blue-800 font-semibold border-blue-300 shadow-inner"
                    : "bg-white text-gray-700 border-gray-100"
                )}
                title={chat.title}
              >
                {isOpen ? (
                  <span className="truncate block">{chat.title}</span>
                ) : (
                  <MessageSquareText className="w-5 h-5 text-gray-600" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-xs text-gray-500 py-2">
              {previousChats.length === 0
                ? isOpen
                  ? "Start a new chat to see history!"
                  : "No chats"
                : "No matches"}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t">
        <Button
          onClick={onLogout}
          className="w-full flex items-center gap-2 text-blue-700 bg-blue-100 hover:bg-blue-200 justify-center"
          variant="ghost"
        >
          <LogOut className="w-4 h-4" />
          {isOpen && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
