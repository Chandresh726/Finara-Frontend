export interface ChatMessage {
  sender: string
  name: string
  message: string
}

export interface ChatHistory {
  id: string
  title: string
  timestamp: Date
  messages: ChatMessage[]
}

export type ChatSender = "user" | "ai"