import type React from "react"

// This enables Partial Prerendering for the dashboard section
export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const revalidate = 0

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-background">{children}</div>
}
