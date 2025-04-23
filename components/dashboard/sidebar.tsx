"use client"

import { useState, useOptimistic } from "react"
import { cn } from "@/lib/utils"
import { ModelType } from "@/lib/constants/enums"
import { ChatHeader } from "./chat/chat-header"
import { ChatHistoryList } from "./chat/chat-history"
import { ChatMessages } from "./chat/chat-messages"
import { ChatInput } from "./chat/chat-input"
import { ChatHistory, ChatMessage } from "@/lib/types/chat"

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)
  const [selectedChat, setSelectedChat] = useState("current")
  const [currentTitle, setCurrentTitle] = useState("New Chat")
  const [newMessage, setNewMessage] = useState("")
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.GEMINI_2_FLASH)

  // Mock chat history data
  const mockHistory: ChatHistory[] = [
    {
      id: "1",
      title: "Portfolio Analysis Discussion",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      messages: [
        { sender: "ai", name: "Finara AI", message: "Let's analyze your portfolio performance." },
        { sender: "user", name: "You", message: "Show me the key metrics." }
      ]
    },
    {
      id: "2",
      title: "Investment Strategy Planning",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      messages: [
        { sender: "ai", name: "Finara AI", message: "Let's plan your investment strategy." },
        { sender: "user", name: "You", message: "What are your recommendations?" }
      ]
    },
    {
      id: "3",
      title: "Risk Assessment Chat",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      messages: [
        { sender: "ai", name: "Finara AI", message: "Let's assess your risk tolerance." },
        { sender: "user", name: "You", message: "How can I optimize my portfolio?" }
      ]
    }
  ]

  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "ai", name: "Finara AI", message: "Hello! How can I help you with your investments today?" }
  ])
  
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: ChatMessage) => [...state, newMessage]
  )

  const handleNewChat = () => {
    setMessages([
      { sender: "ai", name: "Finara AI", message: "Started a new chat. How can I help you?" }
    ])
    setCurrentTitle("New Chat")
    setSelectedChat("current")
  }

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  }

  const switchToChat = (chatId: string) => {
    const chat = mockHistory.find(c => c.id === chatId)
    if (chat) {
      setSelectedChat(chatId)
      setCurrentTitle(chat.title)
      setMessages(chat.messages)
      setIsHistoryExpanded(false)
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    addOptimisticMessage({ sender: "user", name: "You", message: newMessage })
    setMessages((prev) => [...prev, { sender: "user", name: "You", message: newMessage }])
    setNewMessage("")

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          name: "Finara AI",
          message: "I've analyzed your portfolio and have some recommendations based on current market trends. Would you like to hear them?",
        },
      ])
    }, 1000)
  }

  return (
    <div className={cn("flex h-[calc(100vh-4rem)] flex-col border-r bg-background w-80", className)}>
      <div className="flex flex-col">
        <ChatHeader
          title={currentTitle}
          isHistoryExpanded={isHistoryExpanded}
          onNewChat={handleNewChat}
          onToggleHistory={() => setIsHistoryExpanded(!isHistoryExpanded)}
          onClose={handleClose}
        />
        
        <ChatHistoryList
          isExpanded={isHistoryExpanded}
          selectedId={selectedChat}
          history={mockHistory}
          onSelectChat={switchToChat}
        />
      </div>

      <ChatMessages messages={optimisticMessages} />

      <ChatInput
        message={newMessage}
        modelType={selectedModel}
        onMessageChange={setNewMessage}
        onModelChange={setSelectedModel}
        onSend={sendMessage}
      />
    </div>
  )
}
