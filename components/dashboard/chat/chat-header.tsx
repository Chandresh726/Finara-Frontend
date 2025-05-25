"use client"

import { Plus, History, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatHeaderProps {
  title: string
  isHistoryExpanded: boolean
  onNewChat: () => void
  onToggleHistory: () => void
  onClose: () => void
}

export function ChatHeader({
  title,
  isHistoryExpanded,
  onNewChat,
  onToggleHistory,
  onClose
}: ChatHeaderProps) {
  return (
    <div className={`flex w-full items-center ${isHistoryExpanded ? "border-b" : ""} p-2 gap-2`}>
      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onNewChat}>
        <Plus className="h-6 w-6" />
        <span className="sr-only">New chat</span>
      </Button>
      <div className="flex-1 min-w-0">
        <span className="font-medium text-sm block truncate">{title}</span>
      </div>
      <div className="flex gap-1 shrink-0">
        <Button 
          variant={isHistoryExpanded ? "secondary" : "ghost"}
          size="icon" 
          className="h-8 w-8" 
          onClick={onToggleHistory}
        >
          <History className="h-6 w-6" />
          <span className="sr-only">Chat history</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-6 w-6" />
          <span className="sr-only">Close chat</span>
        </Button>
      </div>
    </div>
  )
}