"use client"

import { useState } from "react"
import { Suspense } from "react"
import { cn } from "@/lib/utils"
import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Portfolio } from "@/components/dashboard/portfolio"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

// Enable Partial Prerendering for this page
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default function DashboardPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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
          {!isSidebarCollapsed && (
            <Sidebar 
              className="h-[calc(100vh-4rem)]" 
              onClose={() => setIsSidebarCollapsed(true)}
            />
          )}
        </div>
        <main className={cn(
          "flex-1 overflow-y-auto transition-all duration-300",
          isSidebarCollapsed ? "md:ml-0" : "md:ml-80"
        )}>
          <div className="mx-auto max-w-6xl p-6">
            <Suspense fallback={<DashboardSkeleton />}>
              <Portfolio 
                isSidebarCollapsed={isSidebarCollapsed}
                onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
