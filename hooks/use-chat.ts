import { useState, useEffect, useRef, useCallback, RefObject } from "react";
import { usePortfolio } from "@/lib/contexts/portfolio-context";
import { ModelType } from "@/lib/constants/enums";
import type { ChatHistory, ChatMessage } from "@/lib/types/chat";
import {
  fetchChatHistory,
  fetchChat,
  createChat,
  sendChatMessage,
  ChatServiceError,
} from "@/lib/services/chat";

export function useChat() {
  const { selectedPortfolio } = usePortfolio();
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState("New Chat");
  const [newMessage, setNewMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.GEMINI_2_FLASH);
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [typingMessage, setTypingMessage] = useState<{text: string, isComplete: boolean, actions: any[] | undefined} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [userName, setUserName] = useState<string>("You");
  // In-memory cache for chat messages
  const messagesCache = useRef<Map<string, { messages: ChatMessage[]; userName: string; title: string }>>(new Map());
  // Add debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const DEBOUNCE_DELAY = 1000; // 1 second delay between messages

  // Helper: scroll to bottom
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, []);

  // On portfolio change, fetch chat history and open most recent chat or create first chat if none
  useEffect(() => {
    if (!selectedPortfolio) return;
    setLoading(true);
    setError(null);
    fetchChatHistory(selectedPortfolio.id)
      .then(async (chats) => {
        setHistory(chats);
        if (chats.length > 0) {
          // Open the most recent chat (assuming sorted by createdAt desc, else sort here)
          const mostRecent = chats[0];
          // Check cache first
          if (messagesCache.current.has(mostRecent.id)) {
            const cached = messagesCache.current.get(mostRecent.id)!;
            setSelectedChat(mostRecent.id);
            setCurrentTitle(cached.title);
            setMessages(cached.messages);
            setUserName(cached.userName);
            setTimeout(scrollToBottom, 0);
          } else {
            try {
              const chat = await fetchChat(mostRecent.id);
              setSelectedChat(chat.id);
              setCurrentTitle(chat.title);
              setMessages(chat.messages);
              setUserName(chat.userName);
              messagesCache.current.set(chat.id, {
                messages: chat.messages,
                userName: chat.userName,
                title: chat.title,
              });
              setTimeout(scrollToBottom, 0);
            } catch (e) {
              setError(e instanceof ChatServiceError ? e.message : "Failed to load chat");
              setMessages([]);
            }
          }
        } else {
          // No chat history, create "My First AI Chat"
          try {
            const chat = await createChat(selectedPortfolio.id, "My First AI Chat");
            setSelectedChat(chat.id);
            setCurrentTitle(chat.title);
            setMessages([]);
            setUserName("You");
            setHistory([
              {
                id: chat.id,
                title: chat.title,
                timestamp: new Date(chat.createdAt),
                messages: [],
              },
            ]);
            messagesCache.current.set(chat.id, {
              messages: [],
              userName: "You",
              title: chat.title,
            });
            setTimeout(scrollToBottom, 0);
          } catch (e) {
            setError(e instanceof ChatServiceError ? e.message : "Failed to start new chat");
          }
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [selectedPortfolio]);

  // Fetch messages for a selected chat (with cache)
  const fetchAndSetChat = useCallback(async (id: string) => {
    // Show cached messages instantly if available
    if (messagesCache.current.has(id)) {
      const cached = messagesCache.current.get(id)!;
      setSelectedChat(id);
      setCurrentTitle(cached.title);
      setMessages(cached.messages);
      setUserName(cached.userName);
      setTimeout(scrollToBottom, 0);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const chat = await fetchChat(id);
      setSelectedChat(chat.id);
      setCurrentTitle(chat.title);
      setMessages(chat.messages);
      setUserName(chat.userName);
      messagesCache.current.set(chat.id, {
        messages: chat.messages,
        userName: chat.userName,
        title: chat.title,
      });
      setTimeout(scrollToBottom, 0);
    } catch (e) {
      setError(e instanceof ChatServiceError ? e.message : "Failed to load chat");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [scrollToBottom]);

  // Start a new chat (manual trigger)
  const handleNewChat = useCallback(async (title: string) => {
    if (!selectedPortfolio) return;
    setLoading(true);
    setError(null);
    try {
      const chat = await createChat(selectedPortfolio.id, title);
      setSelectedChat(chat.id);
      setCurrentTitle(chat.title);
      setMessages([]);
      setUserName("You");
      // Refresh history
      setHistory((prev) => [
        {
          id: chat.id,
          title: chat.title,
          timestamp: new Date(chat.createdAt),
          messages: [],
        },
        ...prev,
      ]);
      messagesCache.current.set(chat.id, {
        messages: [],
        userName: "You",
        title: chat.title,
      });
      setTimeout(scrollToBottom, 0);
    } catch (e) {
      setError(e instanceof ChatServiceError ? e.message : "Failed to start new chat");
    } finally {
      setLoading(false);
    }
  }, [selectedPortfolio, scrollToBottom]);

  // Switch to a chat from history
  const switchToChat = useCallback((chatId: string) => {
    fetchAndSetChat(chatId);
    setIsHistoryExpanded(false);
  }, [fetchAndSetChat]);

  // Simulate typing animation for AI response
  const simulateTyping = useCallback((fullText: string, actions: any[] | undefined) => {
    setTypingMessage({ text: "", isComplete: false, actions });
    let currentIndex = 0;
    const typingSpeed = 15; // milliseconds per character
    
    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        setTypingMessage(prev => ({
          text: fullText.substring(0, currentIndex + 1),
          isComplete: false,
          actions
        }));
        currentIndex++;
        // Scroll to bottom with each character update
        scrollToBottom();
        setTimeout(typeNextChar, typingSpeed);
      } else {
        // Typing complete
        setTypingMessage({
          text: fullText,
          isComplete: true,
          actions
        });
        scrollToBottom();
      }
    };
    
    typeNextChar();
  }, [scrollToBottom]);

  // Send a message
  const sendMessage = useCallback(async () => {
    if (!selectedChat || !newMessage.trim() || !canSendMessage) return;
    
    // Set debounce timer
    setCanSendMessage(false);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setCanSendMessage(true);
    }, DEBOUNCE_DELAY);

    setLoading(true);
    setIsThinking(true);
    setError(null);
    setMessages((prev) => [
      ...prev,
      { sender: "user", name: userName, message: newMessage },
    ]);
    // Update cache instantly for user message
    messagesCache.current.set(selectedChat, {
      messages: [
        ...(messagesCache.current.get(selectedChat)?.messages || []),
        { sender: "user", name: userName, message: newMessage },
      ],
      userName,
      title: currentTitle,
    });
    const msgToSend = newMessage;
    setNewMessage("");
    try {
      // Start "thinking" state
      setTimeout(scrollToBottom, 0);
      
      const aiResponse = await sendChatMessage(selectedChat, msgToSend, selectedModel);
      
      // Stop thinking and start typing animation
      setIsThinking(false);
      simulateTyping(aiResponse.message, aiResponse.actions);
      
      // When typing is done, this will be called by the useEffect below
      // that watches for typingMessage.isComplete
    } catch (e) {
      setIsThinking(false);
      setTypingMessage(null);
      setError(e instanceof ChatServiceError ? e.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  }, [selectedChat, newMessage, selectedModel, userName, currentTitle, scrollToBottom, simulateTyping, canSendMessage]);
  
  // When typing is complete, update the messages state
  useEffect(() => {
    if (typingMessage?.isComplete && selectedChat) {
      setMessages((prev) => {
        const updated = [
          ...prev,
          {
            sender: "ai",
            name: "AI",
            message: typingMessage.text,
            actions: typingMessage.actions,
          },
        ];
        // Update cache for AI response
        messagesCache.current.set(selectedChat, {
          messages: updated,
          userName,
          title: currentTitle,
        });
        return updated;
      });
      setTypingMessage(null);
      setTimeout(scrollToBottom, 0);
    }
  }, [typingMessage, selectedChat, userName, currentTitle, scrollToBottom]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    isHistoryExpanded,
    setIsHistoryExpanded,
    selectedChat,
    currentTitle,
    newMessage,
    setNewMessage,
    selectedModel,
    setSelectedModel,
    history,
    messages,
    loading,
    isThinking,
    typingMessage,
    error,
    messagesEndRef,
    handleNewChat,
    switchToChat,
    sendMessage,
    canSendMessage,
  };
}