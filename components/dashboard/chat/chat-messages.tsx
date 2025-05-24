"use client"

import { Bot, User as UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChatMessage } from "@/lib/types/chat"
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ChatAction } from "@/lib/types/chat"
import { ActionCarousel } from "./action-carousel"

interface ChatMessagesProps {
  messages: ChatMessage[]
  messagesEndRef?: React.RefObject<HTMLDivElement | null>
}

function ActionCard({ action, onExecute, onDeny }: { action: ChatAction, onExecute: () => void, onDeny: () => void }) {
  return (
    <Card className="my-2 shadow-lg border-2 border-green-200 bg-gradient-to-br from-green-50/80 to-white animate-fade-in-up">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Bot className="w-5 h-5 text-green-400 animate-pulse" />
          AI Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="text-sm font-medium text-green-900">
          {action.type === "buy" && (
            <span>
              Buy <span className="font-bold">{action.quantity}</span> of <span className="font-bold">{action.assetSymbol}</span> ({action.investmentType}) in <span className="font-bold">{action.region}</span>
            </span>
          )}
          {action.type === "sell" && (
            <span>
              Sell <span className="font-bold">{action.quantity}</span> of <span className="font-bold">{action.assetSymbol}</span> ({action.investmentType}) in <span className="font-bold">{action.region}</span>
            </span>
          )}
          {action.type !== "buy" && action.type !== "sell" && (
            <span>{action.type}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-2 pt-0">
        <Button size="sm" variant="finance" className="animate-bounce-in" onClick={onExecute}>Execute</Button>
        <Button size="sm" variant="ghost" onClick={onDeny}>Deny</Button>
      </CardFooter>
    </Card>
  )
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
              {/* Render AI actions as carousel */}
              {msg.sender === "ai" && msg.actions && msg.actions.length > 0 && (
                <ActionCarousel
                  actions={msg.actions}
                  onExecute={() => {}}
                  onDeny={() => {}}
                />
              )}
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