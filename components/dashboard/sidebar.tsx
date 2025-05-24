"use client"

import { useState} from "react"
import { cn } from "@/lib/utils"
import { ChatHeader } from "./chat/chat-header"
import { ChatHistoryList } from "./chat/chat-history"
import { ChatMessages } from "./chat/chat-messages"
import { ChatInput } from "./chat/chat-input"
import { useChat } from "@/hooks/use-chat"
import { NewChatDialog } from "./chat/new-chat-dialog"

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const {
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
    error,
    messagesEndRef,
    handleNewChat,
    switchToChat,
    sendMessage,
  } = useChat();

  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);

  const handleCreateChat = async (title: string) => {
    await handleNewChat(title);
  };

  return (
    <div className={cn("flex h-[calc(100vh-4rem)] flex-col border-r bg-background w-80", className)}>
      <NewChatDialog
        open={newChatDialogOpen}
        onClose={() => setNewChatDialogOpen(false)}
        onCreate={handleCreateChat}
      />
      <div className="flex flex-col">
        <ChatHeader
          title={currentTitle}
          isHistoryExpanded={isHistoryExpanded}
          onNewChat={() => setNewChatDialogOpen(true)}
          onToggleHistory={() => setIsHistoryExpanded(!isHistoryExpanded)}
          onClose={onClose || (() => {})}
        />
        <ChatHistoryList
          isExpanded={isHistoryExpanded}
          selectedId={selectedChat || ""}
          history={history}
          onSelectChat={switchToChat}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
      </div>
      <ChatInput
        message={newMessage}
        modelType={selectedModel}
        onMessageChange={setNewMessage}
        onModelChange={setSelectedModel}
        onSend={sendMessage}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-10 animate-fade-in">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {error && (
        <div className="absolute bottom-16 left-0 right-0 px-4 py-2 bg-red-500 text-white text-xs rounded-b-xl text-center animate-fade-in">
          {error}
        </div>
      )}
    </div>
  )
}
