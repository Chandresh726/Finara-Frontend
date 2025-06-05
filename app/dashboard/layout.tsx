import type React from "react"
import { PortfolioProvider } from "@/lib/contexts/portfolio-context"
import { SidebarProvider } from "@/lib/contexts/sidebar-context"

// This enables Partial Prerendering for the dashboard section
export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const revalidate = 0

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PortfolioProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-background">{children}</div>
      </SidebarProvider>
    </PortfolioProvider>
  )
}
