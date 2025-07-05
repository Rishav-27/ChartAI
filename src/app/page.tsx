"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ChatHistory from "@/components/ChatHistory";
import ChatInput from "@/components/ChatInput";
import { ChartDataType } from "@/types/chart";
import { supabase } from "@/lib/supabase";

interface PromptChart {
  prompt: string;
  chartData: ChartDataType;
}

export default function Home() {
  const [currentChat, setCurrentChat] = useState<PromptChart[]>([]);
  const [allChats, setAllChats] = useState<PromptChart[][]>([]); // array of chat sessions
  const [loading, setLoading] = useState(true);

  // Save current chat to Supabase
  const saveChatToDB = async (chat: PromptChart[]) => {
    const { error } = await supabase.from("chats").insert({
      title: chat[0]?.prompt?.slice(0, 50) || "Untitled Chat",
      messages: chat,
    });

    if (error) console.error("Failed to save chat:", error.message);
  };

  // Load existing chats from Supabase
  const loadChats = async () => {
    const { data, error } = await supabase
      .from("chats")
      .select("id, title, messages")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load chats:", error.message);
      return;
    }

    const chatList = data.map((d) => d.messages as PromptChart[]);
    setAllChats(chatList);
    setLoading(false);
  };

  useEffect(() => {
    loadChats();
  }, []);

  // Handler for sending a new prompt
  const handleSend = (prompt: string, chart: ChartDataType) => {
    setCurrentChat((prev) => [...prev, { prompt, chartData: chart }]);
  };

  // Start new chat (and store old one)
  const startNewChat = async () => {
    if (currentChat.length > 0) {
      await saveChatToDB(currentChat);
      setAllChats((prev) => [currentChat, ...prev]);
    }
    setCurrentChat([]);
  };

  // Load a previous chat session
  const handleSelectChat = (chat: PromptChart[]) => {
    setCurrentChat(chat);
  };

  return (
    <div className="flex min-h-screen font-sans bg-gray-50 text-black">
      <Sidebar
        onNewChat={startNewChat}
        onSelectChat={handleSelectChat}
        previousChats={allChats}
      />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {loading ? (
            <div className="text-center mt-10 text-gray-500">Loading chats...</div>
          ) : (
            <ChatHistory history={currentChat} />
          )}
        </div>
        <div className="sticky bottom-0 bg-white z-10 border-t">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
