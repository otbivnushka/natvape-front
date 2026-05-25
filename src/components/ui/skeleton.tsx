import React from 'react';

interface SkeletonProps {
  count?: number;
}

const shimmerLight = 'bg-[linear-gradient(90deg,#eee_25%,#e0e0e0_50%,#eee_75%)]';
const shimmerDark = 'dark:bg-[linear-gradient(90deg,#222_25%,#2a2a2a_50%,#222_75%)]';
const anim = 'bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]';

const Skeleton: React.FC<SkeletonProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`rounded-xl overflow-hidden flex flex-col ${shimmerLight} ${shimmerDark} ${anim}`}>
          <div className={`w-full aspect-square rounded-none ${shimmerLight} ${shimmerDark} ${anim}`} />
          <div className={`h-3.5 mx-3 mt-3 w-[70%] rounded-lg ${shimmerLight} ${shimmerDark} ${anim}`} />
          <div className={`h-3.5 mx-3 mt-2 w-[40%] rounded-lg ${shimmerLight} ${shimmerDark} ${anim}`} />
          <div className={`h-9 mx-3 my-3 rounded-lg ${shimmerLight} ${shimmerDark} ${anim}`} />
        </div>
      ))}
    </>
  );
};

export { Skeleton };
