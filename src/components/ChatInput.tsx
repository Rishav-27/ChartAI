import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChartDataType } from "@/types/chart";

interface Props {
  onSend: (prompt: string, chart: ChartDataType) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const res = await fetch("/api/chart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await res.json();

    onSend(input, data);
    setInput("");
    setLoading(false);
  };

  return (
    <footer className="p-4 border-t bg-white">
      <div className="flex items-center gap-4">
        <Input
          placeholder="What's on your mind today?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>
    </footer>
  );
}
