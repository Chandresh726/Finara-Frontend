"use client";

import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import type { PortfolioHeaderProps, PortfolioView } from "@/lib/types/portfolio";
import { cn } from "@/lib/utils";

export function PortfolioHeader({
  currentView,
  onViewChange,
  isSidebarCollapsed,
  onToggleSidebar,
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
          <Bot
            className={cn(
              "h-8 w-8 transition-colors",
              isSidebarCollapsed ? "text-muted-foreground" : "text-green-500"
            )}
          />
          <span className="sr-only">Toggle AI Assistant</span>
        </Button>
        <h2 className="text-2xl font-bold">
          Portfolio {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant={currentView === "overview" ? "default" : "ghost"}
          onClick={() => onViewChange("overview")}
        >
          Overview
        </Button>
        <Button
          variant={currentView === "holdings" ? "default" : "ghost"}
          onClick={() => onViewChange("holdings")}
        >
          Holdings
        </Button>
        <Button
          variant={currentView === "transactions" ? "default" : "ghost"}
          onClick={() => onViewChange("transactions")}
        >
          Transactions
        </Button>
      </div>
    </div>
  );
}
