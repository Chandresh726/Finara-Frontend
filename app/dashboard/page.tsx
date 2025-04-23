"use client"

import { useEffect, useState } from "react"
import { Suspense } from "react"
import { cn } from "@/lib/utils"
import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

// Enable Partial Prerendering for this page
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default function DashboardPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    const handleCollapseSidebar = () => {
      setIsSidebarCollapsed(true)
    }
    window.addEventListener('collapseSidebar', handleCollapseSidebar)
    return () => {
      window.removeEventListener('collapseSidebar', handleCollapseSidebar)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader 
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex flex-1">
        <div 
          className={cn(
            "hidden md:block fixed top-16 transition-all duration-300",
            isSidebarCollapsed ? "w-0" : "w-80"
          )}
        >
          {!isSidebarCollapsed && <Sidebar className="h-[calc(100vh-4rem)]" />}
        </div>
        <main className={cn(
          "flex-1 overflow-y-auto transition-all duration-300",
          isSidebarCollapsed ? "md:ml-0" : "md:ml-80"
        )}>
          <div className="mx-auto max-w-6xl p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <Suspense fallback={<DashboardSkeleton />}>
              <PortfolioOverview />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
