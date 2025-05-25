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
          <Bot
            className={cn(
              "h-10 w-10 p-1 transition-colors hover:border rounded-sm hover:bg-muted",
              isSidebarCollapsed ? "text-muted-foreground" : "text-green-500"
            )}
            onClick={onToggleSidebar}
          />
          <span className="sr-only">Toggle AI Assistant</span>
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
