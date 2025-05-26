"use client";

import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import type { PortfolioHeaderProps, PortfolioView } from "@/lib/types/portfolio";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

export function PortfolioHeader({
  currentView,
  onViewChange,
  isSidebarCollapsed,
  onToggleSidebar,
}: PortfolioHeaderProps) {
  const [isJumping, setIsJumping] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Clear any existing timer when component unmounts or dependencies change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    // Only set up the timer if the sidebar is collapsed and not hovering
    if (isSidebarCollapsed && !isHovering) {
      const setupJumpTimer = () => {
        // Clear any existing timer
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        
        // Set jumping to true briefly
        setIsJumping(true);
        
        // After 500ms, stop the jumping animation
        setTimeout(() => {
          setIsJumping(false);
        }, 200);
        
        // Set up the next jump after 5 seconds
        timerRef.current = setTimeout(setupJumpTimer, 5000);
      };
      
      // Start the first timer
      timerRef.current = setTimeout(setupJumpTimer, 1000);
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else {
      // If sidebar is open or hovering, clear timer and stop jumping
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setIsJumping(false);
    }
  }, [isSidebarCollapsed, isHovering]);
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-3">
          <div 
            className="relative cursor-pointer" 
            onClick={onToggleSidebar}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            title={isSidebarCollapsed ? "Open AI Assistant" : "Close AI Assistant"}
          >
            <Bot
              className={cn(
                "h-10 w-10 p-1 rounded-sm",
                "transition-all duration-300 hover:border hover:bg-muted",
                isJumping ? "transform -translate-y-1" : "",
                isSidebarCollapsed 
                  ? "text-muted-foreground" 
                  : "text-green-500 hover:scale-105"
              )}
            />
          </div>
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
