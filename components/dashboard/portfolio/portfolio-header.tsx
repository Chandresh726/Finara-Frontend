"use client"

import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import { PortfolioView } from "../portfolio"
import { cn } from "@/lib/utils"

interface PortfolioHeaderProps {
  currentView: PortfolioView
  onViewChange: (view: PortfolioView) => void
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function PortfolioHeader({ 
  currentView, 
  onViewChange,
  isSidebarCollapsed,
  onToggleSidebar 
}: PortfolioHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hidden md:flex hover:bg-muted"
        >
          <Bot className={cn(
            "h-5 w-5 transition-colors",
            isSidebarCollapsed ? "text-muted-foreground" : "text-green-500"
          )} />
          <span className="sr-only">Toggle AI Assistant</span>
        </Button>
        <h2 className="text-2xl font-bold">Portfolio Overview</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          variant={currentView === 'overview' ? 'default' : 'ghost'}
          onClick={() => onViewChange('overview')}
        >
          Overview
        </Button>
        <Button
          variant={currentView === 'holdings' ? 'default' : 'ghost'}
          onClick={() => onViewChange('holdings')}
        >
          Holdings
        </Button>
      </div>
    </div>
  )
}