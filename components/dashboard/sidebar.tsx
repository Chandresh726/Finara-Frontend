"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChatHeader } from "./chat/chat-header"
import { ChatHistoryList } from "./chat/chat-history"
import { ChatMessages } from "./chat/chat-messages"
import { ChatInput } from "./chat/chat-input"
import { useChat } from "@/hooks/use-chat"
import { NewChatDialog } from "./chat/new-chat-dialog"
import { NewPortfolioDialog } from "./new-portfolio-dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { usePortfolio } from "@/lib/contexts/portfolio-context"
import { useSidebar } from "@/lib/contexts/sidebar-context"

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const { selectedPortfolio } = usePortfolio();
  const { sidebarWidth, setSidebarWidth } = useSidebar();
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
    isThinking,
    typingMessage,
    error,
    messagesEndRef,
    handleNewChat,
    switchToChat,
    sendMessage,
    canSendMessage,
  } = useChat();

  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on drag handle
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // Handle mouse move for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX - (sidebarRef.current?.getBoundingClientRect().left || 0);
      // Set minimum and maximum width constraints
      if (newWidth >= 280 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setSidebarWidth]);

  const handleCreateChat = async (title: string) => {
    await handleNewChat(title);
  };

  // Component to show when no portfolio is selected
  const NoPortfolioMessage = () => {
    const { createPortfolio } = usePortfolio();
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="mb-4 text-muted-foreground">
          <PlusCircle className="h-16 w-16 mx-auto mb-4" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Portfolio Selected</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Create a portfolio to start interacting with Finara AI.
        </p>
        <NewPortfolioDialog onCreatePortfolio={createPortfolio}>
          <Button variant="default" className="w-full">
            Create Portfolio
          </Button>
        </NewPortfolioDialog>
      </div>
    );
  };

  return (
    <div 
      ref={sidebarRef}
      className={cn(
        "flex h-[calc(100vh-4rem)] flex-col border-r border-t bg-background relative",
        className
      )}
      style={{ width: `${sidebarWidth}px` }}
    >
      {selectedPortfolio ? (
        <>
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
            <ChatMessages 
              messages={messages} 
              messagesEndRef={messagesEndRef} 
              isThinking={isThinking}
              typingMessage={typingMessage}
            />
          </div>
          <ChatInput
            message={newMessage}
            modelType={selectedModel}
            onMessageChange={setNewMessage}
            onModelChange={setSelectedModel}
            onSend={sendMessage}
            canSendMessage={canSendMessage}
          />
          {/* Only show the full-page loader for operations other than message sending */}
          {loading && !isThinking && !typingMessage && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-10 animate-fade-in">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && (
            <div className="absolute bottom-16 left-0 right-0 px-4 py-2 bg-red-500 text-white text-xs rounded-b-xl text-center animate-fade-in">
              {error}
            </div>
          )}
        </>
      ) : (
        <NoPortfolioMessage />
      )}
      
      {/* Resize handle */}
      <div
        ref={dragHandleRef}
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 active:bg-primary transition-colors"
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}
