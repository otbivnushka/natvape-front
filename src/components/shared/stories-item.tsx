import clsx from 'clsx';
import React from 'react';

interface StoriesItemProps {
  title: string;
  image: string;
  onClick?: () => void;
  className?: string;
}

const StoriesItem: React.FC<StoriesItemProps> = ({ title, image, onClick, className }) => {
  
  return (
    <div className={clsx('flex flex-col items-center gap-2 shrink-0', className)}>
      <div onClick={onClick} className="aspect-video rounded-xl overflow-hidden shrink-0 max-w-40">
        {image && <img src={image} className="h-full w-full object-cover" />}
      </div>

      <span className="text-[13px] font-semibold text-primary uppercase">{title}</span>
    </div>
  );
};

export { StoriesItem };
