import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Api } from '../../api';
import type { StorySet } from '../../api/stories';
import { StoriesItem } from './stories-item';
import { StoriesModal } from './modals';

interface StoriesContainerProps {
  className?: string;
}

const StoriesContainer: React.FC<StoriesContainerProps> = ({ className }) => {
  const [storySets, setStorySets] = useState<StorySet[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    Api.stories
      .getAll()
      .then(setStorySets)
      .catch(() => {});
  }, []);

  if (storySets.length === 0) return null;

  return (
    <div className={clsx('mb-6', className)}>
      <h2 className="text-lg font-semibold text-muted mb-3">Информация</h2>

      <div className="flex gap-2 overflow-x-auto scrollbar-horizontal">
        {storySets.map((set, i) => (
          <StoriesItem
            key={set.id}
            title={set.title}
            image={set.image}
            onClick={() => setOpenIndex(i)}
          />
        ))}
      </div>

      {openIndex !== null && (
        <StoriesModal
          stories={storySets[openIndex].stories}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </div>
  );
};

export { StoriesContainer };
