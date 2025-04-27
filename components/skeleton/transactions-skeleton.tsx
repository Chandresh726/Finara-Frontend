import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TransactionsSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-8 w-56 ml-auto" />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {/* Table header skeleton */}
          <Skeleton className="h-6 w-full mb-2 rounded" />
          {/* Table rows skeleton */}
          <div className="flex flex-col gap-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded" />
            ))}
          </div>
        </div>
        {/* Pagination skeleton */}
        <div className="flex justify-center gap-2 mt-6">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  );
} 