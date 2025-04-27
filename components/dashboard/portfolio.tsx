"use client";

import { useState, useEffect } from "react";
import { PortfolioHeader } from "./portfolio/portfolio-header";
import { PortfolioOverview } from "./portfolio/overview";
import { PortfolioHoldings } from "./portfolio/holdings";
import { Transactions } from "./portfolio/transactions";
import type { PortfolioView, PortfolioHeaderProps } from "@/lib/types/portfolio";

interface PortfolioProps extends Pick<PortfolioHeaderProps, 'isSidebarCollapsed' | 'onToggleSidebar'> {}

export function Portfolio({ isSidebarCollapsed, onToggleSidebar }: PortfolioProps) {
  const [view, setView] = useState<PortfolioView>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("portfolioTab");
      if (stored === "overview" || stored === "holdings" || stored === "transactions") {
        return stored as PortfolioView;
      }
    }
    return "overview";
  });

  useEffect(() => {
    localStorage.setItem("portfolioTab", view);
  }, [view]);

  return (
    <div className="flex flex-col gap-6">
      <PortfolioHeader
        currentView={view}
        onViewChange={setView}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={onToggleSidebar}
      />

      {view === "overview" && <PortfolioOverview />}
      {view === "holdings" && <PortfolioHoldings />}
      {view === "transactions" && <Transactions />}
    </div>
  );
}
