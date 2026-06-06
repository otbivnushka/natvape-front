import clsx from 'clsx';
import React from 'react';
import { Skeleton } from '../ui';

interface ProductSkeletonProps {
  count?: number;
  className?: string;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 1, className }) => {
  return (
    <>
      {Array.from<number>({ length: count }).map((_, i) => (
        <div key={i} className={clsx(className, 'relative')}>
          <Skeleton className="h-full w-full rounded-xl">
            <div className="aspect-square w-full rounded-lg bg-transparent" />
            <div className="flex flex-col justify-end gap-1.5 p-3 ">
              <div className="h-10.75 w-full rounded-lg bg-page" />
              <div className="h-6 w-20 rounded-lg bg-page" />
              <div className="h-[35.5px] rounded-lg bg-page mt-1" />
            </div>
          </Skeleton>
        </div>
      ))}
    </>
  );
};

export { ProductSkeleton };
