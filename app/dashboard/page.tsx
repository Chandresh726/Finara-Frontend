"use client"

import { useState, useEffect } from "react"
import { Suspense } from "react"
import { cn } from "@/lib/utils"
import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Portfolio } from "@/components/dashboard/portfolio"
import { DashboardSkeleton } from "@/components/skeleton/dashboard-skeleton"
import { useAuth } from "@/lib/contexts/auth-context"
import { Loader2 } from "lucide-react"

// Enable Partial Prerendering for this page
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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
