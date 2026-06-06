import { useState } from 'react';
import clsx from 'clsx';
import { StoriesItem } from './stories-item';
import { StoriesModal } from './modals';
import { useStoriesStore } from '../../store/useStoriesStore';

interface StoriesContainerProps {
  className?: string;
}

const StoriesContainer: React.FC<StoriesContainerProps> = ({ className }) => {
  const {storySets} = useStoriesStore();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
