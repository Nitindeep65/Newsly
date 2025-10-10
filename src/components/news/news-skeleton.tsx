import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function NewsTileSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        <Skeleton className="h-full w-full" />
      </div>
      
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-5/6" />
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-3 w-1/3" />
        </div>
        
        <Skeleton className="h-8 w-full mt-4" />
      </CardContent>
    </Card>
  );
}

interface NewsGridSkeletonProps {
  count?: number;
}

export function NewsGridSkeleton({ count = 6 }: NewsGridSkeletonProps) {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <NewsTileSkeleton key={i} />
      ))}
    </div>
  );
}