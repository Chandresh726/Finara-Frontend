"use client";

import { useState } from "react";
import { PortfolioHeader } from "./portfolio/portfolio-header";
import { PortfolioOverview } from "./portfolio/overview";
import { PortfolioHoldings } from "./portfolio/holdings";
import { Transactions } from "./portfolio/transactions";
import type { PortfolioView, PortfolioHeaderProps } from "@/lib/types/portfolio";

interface PortfolioProps extends Pick<PortfolioHeaderProps, 'isSidebarCollapsed' | 'onToggleSidebar'> {}

export function Portfolio({ isSidebarCollapsed, onToggleSidebar }: PortfolioProps) {
  const [view, setView] = useState<PortfolioView>("overview");

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
