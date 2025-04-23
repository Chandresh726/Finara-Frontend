"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ChatHistory } from "@/lib/types/chat"

interface ChatHistoryListProps {
  isExpanded: boolean
  selectedId: string
  history: ChatHistory[]
  onSelectChat: (id: string) => void
}

export function ChatHistoryList({
  isExpanded,
  selectedId,
  history,
  onSelectChat,
}: ChatHistoryListProps) {
  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <div className={cn(
      "overflow-hidden transition-all border-b",
      isExpanded ? "max-h-[400px]" : "max-h-0"
    )}>
      <ScrollArea className="max-h-[400px] [&_::-webkit-scrollbar]:w-1.5 [&_::-webkit-scrollbar-thumb]:rounded-full">
        <div className="py-1 px-2">
          {history.map((chat, index) => (
            <div key={chat.id} className="px-1">
              <button
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  "w-full flex items-center justify-between gap-2 p-1.5 rounded-sm text-left hover:bg-muted transition-colors",
                  selectedId === chat.id && "bg-muted"
                )}
              >
                <span className="truncate text-xs font-medium min-w-0 flex-1">{chat.title}</span>
                <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">{getRelativeTime(chat.timestamp)}</span>
              </button>
              {index < history.length - 1 && (
                <div className="h-px bg-border/50 my-1" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}