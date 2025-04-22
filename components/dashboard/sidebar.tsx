"use client"

import { useState, useOptimistic } from "react"
import { motion } from "framer-motion"
import { Send, Bot, User as UserIcon, Plus, History, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([
    { sender: "ai", message: "Hello! How can I help you with your investments today?" },
  ])
  const [newMessage, setNewMessage] = useState("")

  // Use optimistic UI updates for chat messages
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: { sender: string; message: string }) => [...state, newMessage],
  )

  const sendMessage = () => {
    if (!newMessage.trim()) return

    // Add user message with optimistic update
    addOptimisticMessage({ sender: "user", message: newMessage })

    // Actually update the state
    setMessages((prev) => [...prev, { sender: "user", message: newMessage }])
    setNewMessage("")

    // Simulate AI response after a short delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          message:
            "I've analyzed your portfolio and have some recommendations based on current market trends. Would you like to hear them?",
        },
      ])
    }, 1000)
  }

  return (
    <div className={cn("flex h-[calc(100vh-4rem)] flex-col border-r bg-background w-80", className)}>
      <div className="flex items-center justify-between p-3 border-b">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
          <span className="sr-only">New chat</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <History className="h-4 w-4" />
          <span className="sr-only">Chat history</span>
        </Button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-3">
          {optimisticMessages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-2",
                msg.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.sender === "ai" && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-finance-500/10">
                  <Bot className="h-3 w-3 text-finance-500" />
                </div>
              )}
              <div
                className={cn(
                  "rounded-lg px-3 py-1.5 max-w-[80%]",
                  msg.sender === "user"
                    ? "bg-finance-500 text-white"
                    : "bg-muted"
                )}
              >
                <p className="text-xs">{msg.message}</p>
              </div>
              {msg.sender === "user" && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-finance-500/10">
                  <UserIcon className="h-3 w-3 text-finance-500" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-3 border-t space-y-2 bg-background">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            className="h-8 text-xs"
          />
          <Button size="icon" className="h-8 w-8" onClick={sendMessage}>
            <Send className="h-3 w-3" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        <Select defaultValue="gpt-4">
          <SelectTrigger className="h-6 text-xs">
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <SelectValue placeholder="Select model" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4" className="text-xs">GPT-4</SelectItem>
            <SelectItem value="gpt-3.5" className="text-xs">GPT-3.5</SelectItem>
            <SelectItem value="claude" className="text-xs">Claude</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
