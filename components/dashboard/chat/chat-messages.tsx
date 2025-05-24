"use client"

import { Bot, User as UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChatMessage } from "@/lib/types/chat"

interface ChatMessagesProps {
  messages: ChatMessage[]
  messagesEndRef?: React.RefObject<HTMLDivElement | null>
}

export function ChatMessages({ messages, messagesEndRef }: ChatMessagesProps) {
  const isEmpty = messages.length === 0;
  return (
    <div className="flex-1 p-3 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent">
      <div className="flex flex-col gap-0.5 h-full">
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center h-full text-muted-foreground/70 select-none animate-fade-in">
            <Bot className="w-10 h-10 mb-2 text-green-400 animate-bounce" />
            <div className="text-lg font-semibold">No messages yet</div>
            <div className="text-sm">Start the conversation below!</div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={cn(
              msg.sender === "user" ? "items-end text-right" : "items-start text-left",
              "flex flex-col w-full"
            )}>
              <div className={cn(
                "flex items-center gap-2 mb-0.5",
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              )}>
                {msg.sender === "user" ? (
                  <UserIcon className="h-4 w-4 text-finance-500" />
                ) : (
                  <Bot className="h-4 w-4 text-green-500" />
                )}
                <span className="text-xs font-medium text-muted-foreground">{msg.name}</span>
              </div>
              <div className="text-sm px-1 py-1 whitespace-pre-line">
                {msg.message}
              </div>
              {index < messages.length - 1 && (
                <div className="w-full flex justify-center">
                  <div className="h-px w-3/4 bg-muted-foreground/10 my-1" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}