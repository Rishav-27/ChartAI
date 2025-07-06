export interface PromptChartMessage {
  prompt: string;
  chartData: any;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  messages: PromptChartMessage[];
  created_at: string;
}

export interface SidebarChatSession {
  id: string;
  title: string;
}
