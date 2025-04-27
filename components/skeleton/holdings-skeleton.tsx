import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function HoldingsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Tabs and search */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-8 w-56 ml-4 rounded-md" />
        </div>
        {/* Stat cards */}
        <div className="flex flex-wrap gap-4 mb-4">
          {[...Array(3)].map((_, i) => (
            <Card className="flex-1 min-w-[180px]" key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Table skeleton */}
        <div className="w-full">
          <div className="flex flex-col gap-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 