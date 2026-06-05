import { useState } from 'react';
import clsx from 'clsx';
import { StoriesItem } from './stories-item';
import Stories from '../../lib/stories';
import { storySets } from '../../data/stories';

interface StoriesContainerProps {
  className?: string;
}

const StoriesContainer: React.FC<StoriesContainerProps> = ({ className }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={clsx('mb-6', className)}>
      <h2 className="text-lg font-semibold text-muted mb-3">Информация</h2>

      <div className="flex gap-2 overflow-x-auto scrollbar-horizontal">
        {storySets.map((set, i) => (
          <StoriesItem
            key={i}
            title={set.title}
            image={set.image}
            onClick={() => setOpenIndex(i)}
          />
        ))}
      </div>

      {openIndex !== null && (
        <div className="fixed inset-0 z-150 bg-black/90 flex items-center justify-center">
          <div className="relative w-full max-w-108 h-dvh max-h-192">

            <Stories
              stories={storySets[openIndex].stories}
              defaultInterval={3000}
              width="100%"
              height="100%"
              onAllStoriesEnd={() => setOpenIndex(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { StoriesContainer };
