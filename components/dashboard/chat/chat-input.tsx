"use client"

import { useCallback, useEffect, useRef } from "react"
import { SendHorizonal, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ModelType } from "@/lib/constants/enums"

interface ChatInputProps {
  message: string
  modelType: ModelType
  onMessageChange: (message: string) => void
  onModelChange: (model: ModelType) => void
  onSend: () => void
}

export function ChatInput({
  message,
  modelType,
  onMessageChange,
  onModelChange,
  onSend
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to get the correct scrollHeight
    textarea.style.height = '32px'
    
    // Calculate new height based on content
    const scrollHeight = textarea.scrollHeight
    const newHeight = Math.min(Math.max(scrollHeight, 32), 72) // min 32px (1 line), max 72px (3 lines)
    textarea.style.height = `${newHeight}px`
  }, [])

  useEffect(() => {
    adjustTextareaHeight()
  }, [message, adjustTextareaHeight])

  return (
    <div className="p-2 border-t space-y-2 bg-background">
      <Select value={modelType} onValueChange={onModelChange}>
        <SelectTrigger className="h-7 text-xs w-full min-h-0">
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <SelectValue>{modelType}</SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(ModelType).map(([key, value]) => (
            <SelectItem key={key} value={value} className="text-xs">
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          placeholder="Type your message..."
          value={message}
          onChange={e => onMessageChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              onSend()
            }
          }}
          className="text-xs min-h-[32px] max-h-[72px] resize-none py-1.5 [&::-webkit-resizer]:hidden [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-0"
          style={{ height: '32px' }}
        />
        <Button
          size="icon"
          className="h-8 w-8 bg-gradient-primary hover:bg-gradient-primary hover:opacity-90 text-white"
          onClick={onSend}
        >
          <SendHorizonal className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  )
}