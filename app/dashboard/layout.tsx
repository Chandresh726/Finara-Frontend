import type React from "react"
import { PortfolioProvider } from "@/lib/contexts/portfolio-context"

// This enables Partial Prerendering for the dashboard section
export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const revalidate = 0

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PortfolioProvider><div className="min-h-screen bg-background">{children}</div></PortfolioProvider>
}
