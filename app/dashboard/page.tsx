import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

// Enable Partial Prerendering for this page
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <Sidebar className="hidden md:flex w-64 flex-col" />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-6xl">
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

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
      </div>
      <Skeleton className="h-[500px] w-full" />
    </div>
  )
}
