import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Header section with portfolio name and buttons */}
      <div className="flex items-center justify-between border-b pb-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Stats Cards - matching the real dashboard layout */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-[120px] mb-2" />
            <Skeleton className="h-4 w-[100px]" />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-[120px] mb-2" />
            <Skeleton className="h-4 w-[100px]" />
          </CardContent>
        </Card>
        <Card className="col-span-1 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-[120px] mb-2" />
            <Skeleton className="h-4 w-[100px]" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - matching the real dashboard layout */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-7">
        <Card className="col-span-1 xl:col-span-4">
          <CardHeader>
            <Skeleton className="h-5 w-[180px] mb-2" />
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent className="pt-2 sm:pt-4">
            <Skeleton className="h-[250px] sm:h-[300px] lg:h-[350px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-1 xl:col-span-3">
          <CardHeader>
            <Skeleton className="h-5 w-[180px] mb-2" />
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent className="pt-2 sm:pt-4">
            <Skeleton className="h-[250px] sm:h-[300px] lg:h-[350px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}