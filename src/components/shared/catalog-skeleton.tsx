import clsx from 'clsx';
import React from 'react';
import { Skeleton } from '../ui';

interface CatalogSkeletonProps {
  count?: number;
  className?: string;
}

const CatalogSkeleton: React.FC<CatalogSkeletonProps> = ({ count = 1, className }) => {
  return (
    <>
      {Array.from<number>({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className={clsx(
            className,
            'flex flex-col items-center justify-center gap-3 p-8 bg-surface rounded-xl',
          )}
        >
          <Skeleton className="h-30 w-30 rounded-lg bg-primary" />
          <Skeleton className="h-5 w-24 rounded-lg bg-primary" />
          <Skeleton className="h-4 w-18 rounded-lg bg-primary" />
        </Skeleton>
      ))}
    </>
  );
};

export { CatalogSkeleton };
