"use client";

import ChartRenderer from "./ChartRenderer";
import { ChartDataType } from "@/types/chart";

interface ChatHistoryProps {
  history: { prompt: string; chartData: ChartDataType }[];
}

export default function ChatHistory({ history }: ChatHistoryProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {history.map((entry, index) => (
        <div key={index} className="space-y-2">
          <p className="text-sm font-medium">Prompt:</p>
          <div className="bg-gray-100 p-3 rounded-md">{entry.prompt}</div>
          <div className="bg-white p-4 border rounded-md shadow-sm">
            <ChartRenderer data={entry.chartData} />
          </div>
        </div>
      ))}
    </div>
  );
}
