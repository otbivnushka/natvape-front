import React from 'react';
import { Skeleton } from '../ui';

const DetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-5xl pt-12 md:pt-0 mx-auto md:grid md:grid-cols-2 md:gap-10 md:items-start">
      <div className="flex justify-center mb-4 md:mb-0 md:sticky md:top-24">
        <Skeleton className="w-full rounded-xl max-w-87.5 aspect-square" />
      </div>

      <div>
        <Skeleton className="h-7 w-3/4 mb-1" />

        <Skeleton className="h-8 w-32 mb-3" />

        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded" />
          ))}
        </div>

        <div className="mb-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="mb-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-6" />
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 lg:p-5">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export { DetailsSkeleton };
