import { ApiError, apiRequest } from "./api-client";
import type { ChatHistory, ChatMessage } from "@/lib/types/chat";
import { ModelType } from "@/lib/constants/enums";

export class ChatServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChatServiceError";
  }
}

export async function fetchChatHistory(portfolioId: string): Promise<ChatHistory[]> {
  try {
    const response = await apiRequest<{ success: boolean; data: any[] }>(`/ai/history/${portfolioId}`);
    return response.data.map((item: any) => ({
      id: item.id,
      title: item.title,
      timestamp: new Date(item.createdAt),
      messages: [],
    }));
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ChatServiceError(error.message);
    }
    throw new ChatServiceError("Failed to fetch chat history.");
  }
}

export async function fetchChat(chatId: string): Promise<{ id: string; title: string; messages: ChatMessage[]; userName: string }> {
  try {
    const response = await apiRequest<{ success: boolean; data: any }>(`/ai/chat/${chatId}`);
    const { id, title, messages, user } = response.data;
    return {
      id,
      title,
      userName: user?.firstName || "You",
      messages: messages.map((msg: any) => ({
        sender: msg.role === "user" ? "user" : "ai",
        name: msg.role === "user" ? user?.firstName || "You" : "AI",
        message: msg.content,
      })),
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ChatServiceError(error.message);
    }
    throw new ChatServiceError("Failed to fetch chat.");
  }
}

export async function createChat(portfolioId: string, title: string): Promise<{ id: string; title: string; createdAt: string }> {
  try {
    const response = await apiRequest<{ success: boolean; data: any }>(`/ai/chat`, {
      method: "POST",
      body: JSON.stringify({ portfolioId, title }),
    });
    return {
      id: response.data.id,
      title: response.data.title,
      createdAt: response.data.createdAt,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ChatServiceError(error.message);
    }
    throw new ChatServiceError("Failed to create chat.");
  }
}

export async function sendChatMessage(chatId: string, query: string, model: ModelType): Promise<string> {
  try {
    const response = await apiRequest<{ success: boolean; data: any }>(`/ai/chat/${chatId}/message`, {
      method: "POST",
      body: JSON.stringify({ query, model }),
    });
    return response.data.response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ChatServiceError(error.message);
    }
    throw new ChatServiceError("Failed to send message.");
  }
} 