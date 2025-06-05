"use client"

import { useState, useEffect } from "react"
import { Suspense } from "react"
import { cn } from "@/lib/utils"
import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Portfolio } from "@/components/dashboard/portfolio"
import { DashboardSkeleton } from "@/components/skeleton/dashboard-skeleton"
import { useAuth } from "@/lib/contexts/auth-context"
import { useSidebar } from "@/lib/contexts/sidebar-context"
import { Loader2 } from "lucide-react"

// Enable Partial Prerendering for this page
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const { sidebarWidth } = useSidebar()

  // Persist sidebar state in localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sidebarCollapsed")
    if (stored !== null) {
      setIsSidebarCollapsed(stored === "true")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader 
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      {/* Mobile message - only visible on small screens */}
      <div className="md:hidden flex flex-col items-center justify-center flex-1 p-6 text-center">
        <div className="max-w-md p-6 rounded-lg bg-muted/50 border border-border shadow-sm">
          <h2 className="text-2xl font-bold mb-2">Best viewed on a larger screen</h2>
          <p className="text-muted-foreground mb-4">
            For the best experience with Finara's dashboard and advanced features, please use a tablet or desktop device.
          </p>
          <p className="text-sm text-muted-foreground">
            We're working on a mobile-optimized version. Thank you for your understanding.
          </p>
        </div>
      </div>

      {/* Desktop dashboard - hidden on mobile */}
      <div className="hidden md:flex flex-1">
        <div 
          className={cn(
            "fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 transition-all duration-300",
            isSidebarCollapsed
              ? "-translate-x-full opacity-0 pointer-events-none"
              : "translate-x-0 opacity-100"
          )}
        >
          {/* Sidebar is always mounted for state/cache persistence */}
          <Sidebar 
            className="h-full" 
            onClose={() => setIsSidebarCollapsed(true)}
          />
        </div>
        <main 
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300",
            isSidebarCollapsed ? "ml-0" : "ml-[var(--sidebar-width)]"
          )}
          style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
        >
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
