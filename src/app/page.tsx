"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ChatHistory from "@/components/ChatHistory";
import ChatInput from "@/components/ChatInput";
import { useState } from "react";
import { ChartDataType } from "@/types/chart";

export default function Home() {
  interface PromptChart {
    prompt: string;
    chartData: ChartDataType;
  }

  const [history, setHistory] = useState<PromptChart[]>([]);

  return (
    <div className="flex min-h-screen font-sans bg-gray-50 text-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 h-7 overflow-y-auto">
          <ChatHistory history={history} />
        </div>
        <div className="sticky bottom-0 bg-white z-10 border-t">
          <ChatInput
            onSend={(userPrompt: string, chart: ChartDataType) => {
              setHistory((prev) => [...prev, { prompt: userPrompt, chartData: chart }]);
            }}
          />
        </div>
      </div>
    </div>
  );
}
