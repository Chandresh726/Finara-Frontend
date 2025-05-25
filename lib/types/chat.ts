export interface ChatAction {
  id: string;
  type: string;
  assetSymbol?: string;
  investmentType?: string;
  region?: string;
  quantity?: number;
  [key: string]: any;
}

export interface ChatMessage {
  sender: string;
  name: string;
  message: string;
  actions?: ChatAction[];
}

export interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
  messages: ChatMessage[];
}

export type ChatSender = "user" | "ai";