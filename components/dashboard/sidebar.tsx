"use client"

import { useState, useOptimistic } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  CreditCard,
  HelpCircle,
  Home,
  MessageSquare,
  PieChart,
  Settings,
  TrendingUp,
  Users,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: PieChart },
  { name: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
  { name: "Market", href: "/dashboard/market", icon: TrendingUp },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Community", href: "/dashboard/community", icon: Users },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [activeTab, setActiveTab] = useState("Dashboard")
  const [isChatOpen, setIsChatOpen] = useState(false)
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
    <div className={cn("flex h-screen flex-col border-r bg-background", className)}>
      <ScrollArea className="flex-1 pt-3">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
          <div className="space-y-1">
            {sidebarLinks.map((link) => (
              <Button
                key={link.name}
                variant={activeTab === link.name ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(link.name)}
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.name}
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="mt-auto p-4">
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Support
          </Button>
          <Button
            variant={isChatOpen ? "secondary" : "outline"}
            className="w-full justify-start"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            AI Assistant
            {!isChatOpen && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-finance-500 text-[10px] font-medium text-white">
                1
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* AI Chat Window */}
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "400px" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t bg-card"
        >
          <div className="flex h-10 items-center justify-between border-b px-4">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
              <h3 className="font-medium">AI Assistant</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-[300px] p-4">
            <div className="space-y-4">
              {optimisticMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      msg.sender === "user" ? "bg-finance-500 text-white" : "bg-secondary text-foreground"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex items-center gap-2 border-t p-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything about your finances..."
              className="flex-1 bg-background border-0 focus:ring-0"
            />
            <Button size="sm" onClick={sendMessage}>
              Send
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
