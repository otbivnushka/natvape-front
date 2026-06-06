import React from 'react';
import Stories from '@/lib/stories';
import type { Story } from '@/lib/stories';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface StoriesModalProps {
  stories: Story[];
  onClose: () => void;
}

const StoriesModal: React.FC<StoriesModalProps> = ({ stories, onClose }) => {
  useBodyScrollLock(true);

  return (
    <div
      className="fixed inset-0 z-150 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-transparent rounded-2xl max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-108 h-dvh max-h-192">
          <Stories
            stories={stories}
            defaultInterval={3000}
            width="100%"
            height="100%"
            onAllStoriesEnd={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export { StoriesModal };
