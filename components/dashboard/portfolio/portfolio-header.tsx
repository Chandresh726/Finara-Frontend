"use client"

import { Button } from "@/components/ui/button"
import { PortfolioView } from "../portfolio"

interface PortfolioHeaderProps {
  currentView: PortfolioView
  onViewChange: (view: PortfolioView) => void
}

export function PortfolioHeader({ 
  currentView, 
  onViewChange
}: PortfolioHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b pb-2">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">Portfolio {currentView === 'overview' ? 'Overview' : 'Holdings'}</h2>
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