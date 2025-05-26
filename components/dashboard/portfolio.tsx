"use client";

import { useState, useEffect } from "react";
import { PortfolioHeader } from "./portfolio/portfolio-header";
import { PortfolioOverview } from "./portfolio/overview";
import { PortfolioHoldings } from "./portfolio/holdings";
import type { PortfolioView, PortfolioHeaderProps } from "@/lib/types/portfolio";
import Transactions from "./portfolio/transactions";
import { usePortfolio } from "@/lib/contexts/portfolio-context";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewPortfolioDialog } from "./new-portfolio-dialog";
import { DashboardSkeleton } from "@/components/skeleton/dashboard-skeleton";

interface PortfolioProps extends Pick<PortfolioHeaderProps, 'isSidebarCollapsed' | 'onToggleSidebar'> {}

export function Portfolio({ isSidebarCollapsed, onToggleSidebar }: PortfolioProps) {
  const { portfolios, selectedPortfolio, isLoading } = usePortfolio();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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

  // Show skeleton while loading portfolios
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  // If there are no portfolios after loading is complete, show a message to create one
  if (portfolios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center h-[calc(100vh-16rem)]">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Welcome to Finara</h2>
          <p className="text-muted-foreground mb-6">
            You don't have any portfolios yet. Create your first portfolio to start tracking your investments.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Portfolio
          </Button>
          {isCreateDialogOpen && (
            <NewPortfolioDialog 
              onCreatePortfolio={async (title, description) => {
                // Portfolio creation is handled by the dialog component
              }}
            >
              <span></span>
            </NewPortfolioDialog>
          )}
        </div>
      </div>
    );
  }

  // If portfolios exist but none is selected (shouldn't happen but just in case)
  if (!selectedPortfolio) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center h-[calc(100vh-16rem)]">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">No Portfolio Selected</h2>
          <p className="text-muted-foreground mb-6">
            Please select a portfolio from the sidebar to view your investments.
          </p>
          <Button onClick={() => onToggleSidebar()} className="gap-2">
            Open Sidebar
          </Button>
        </div>
      </div>
    );
  }

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
