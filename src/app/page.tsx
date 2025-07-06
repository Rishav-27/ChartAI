"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ChatHistory from "@/components/ChatHistory";
import ChatInput from "@/components/ChatInput";
import { ChartDataType } from "@/types/chart";
import { createClient } from "@/utils/supabase/client";
import type { PromptChartMessage, SidebarChatSession } from "@/types/chat";

export default function Home() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);
  const [currentChatMessages, setCurrentChatMessages] = useState<
    PromptChartMessage[]
  >([]);
  const [currentChatSessionId, setCurrentChatSessionId] = useState<
    string | null
  >(null);
  const [allChatSessionsMeta, setAllChatSessionsMeta] = useState<
    SidebarChatSession[]
  >([]);

  const loadChatSessions = useCallback(
    async (userId: string) => {
      setLoadingChats(true);
      const { data, error } = await supabase
        .from("user_chat_sessions")
        .select("id, title")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load chat sessions:", error);
      } else {
        setAllChatSessionsMeta(data as SidebarChatSession[]);
      }

      setLoadingChats(false);
    },
    [supabase]
  );

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        setLoadingUser(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          loadChatSessions(session.user.id);
        } else {
          setUser(null);
          setCurrentChatMessages([]);
          setCurrentChatSessionId(null);
          setAllChatSessionsMeta([]);
          router.push("/login");
        }
        setLoadingUser(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, loadChatSessions, supabase.auth]);

  useEffect(() => {
    if (user && !loadingUser) {
      loadChatSessions(user.id);
    }
  }, [user, loadingUser, loadChatSessions]);

  const handleSend = async (prompt: string, chart: ChartDataType) => {
    if (!user) return router.push("/login");

    const newPromptChart: PromptChartMessage = { prompt, chartData: chart };
    const updatedMessages = [...currentChatMessages, newPromptChart];
    setCurrentChatMessages(updatedMessages);

    if (!currentChatSessionId) {
      const { data, error } = await supabase
        .from("user_chat_sessions")
        .insert({
          user_id: user.id,
          title: prompt.length > 50 ? `${prompt.slice(0, 47)}...` : prompt,
          messages: updatedMessages,
        })
        .select("id, title")
        .single();

      if (error) {
        console.error("Failed to create new chat session:", error);
        setCurrentChatMessages(currentChatMessages);
      } else if (data) {
        setCurrentChatSessionId(data.id);
        setAllChatSessionsMeta((prev) => [
          { id: data.id, title: data.title },
          ...prev,
        ]);
      }
    } else {
      const { error } = await supabase
        .from("user_chat_sessions")
        .update({ messages: updatedMessages })
        .eq("id", currentChatSessionId)
        .eq("user_id", user.id);
      if (error) {
        console.error("Failed to update chat session:", error.message );
        setCurrentChatMessages(currentChatMessages);
      }
    }
  };

  const startNewChat = () => {
    setCurrentChatMessages([]);
    setCurrentChatSessionId(null);
  };

  const handleSelectChat = async (sessionId: string) => {
    if (!user) return router.push("/login");

    setLoadingChats(true);
    const { data, error } = await supabase
      .from("user_chat_sessions")
      .select("messages")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Failed to load selected chat session:", error);
    } else if (data) {
      setCurrentChatMessages(data.messages as PromptChartMessage[]);
      setCurrentChatSessionId(sessionId);
    }

    setLoadingChats(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
    }
  };

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading user session...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen font-sans bg-gray-50 text-black">
      <div className="w-[250px] fixed top-0 left-0 bottom-0 bg-white z-20">
        <Sidebar
          onNewChat={startNewChat}
          onSelectChat={handleSelectChat}
          previousChats={allChatSessionsMeta}
          currentChatId={currentChatSessionId}
          onLogout={handleLogout}
        />
      </div>

      <div className="ml-[256px] flex-1 flex flex-col max-h-screen bg-[#f9fafb]">
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <Navbar
            userName={
              user.user_metadata?.name || user.email?.split("@")[0] || "User"
            }
            userInitial={(
              user.user_metadata?.name ||
              user.email?.split("@")[0] ||
              "U"
            )
              .charAt(0)
              .toUpperCase()}
            onLogout={handleLogout}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 max-w-3xl mx-auto w-full">
          {loadingChats ? (
            <div className="text-center mt-10 text-gray-400 text-sm">
              Loading chat history...
            </div>
          ) : (
            <ChatHistory history={currentChatMessages} />
          )}
        </div>

        <div className="sticky bottom-0 z-20 px-6 py-2 bg-white/60 backdrop-blur-md">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
