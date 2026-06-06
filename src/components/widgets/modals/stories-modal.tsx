import React from 'react';
import Stories from '@/lib/stories';
import type { Story } from '@/lib/stories';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { FixedButton } from '@/components/shared';
import { SquareArrowRightExit } from 'lucide-react';

interface StoriesModalProps {
  stories: Story[];
  onClose: () => void;
}

const StoriesModal: React.FC<StoriesModalProps> = ({ stories, onClose }) => {
  useBodyScrollLock(true);

  return (
    <div
      className="fixed inset-0 z-150 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      onClick={() => onClose()}
    >
      <FixedButton
        className="flex gap-2 items-center bottom-4 left-4 z-9999 py-2 px-3"
        onClick={() => onClose()}
      >
        <SquareArrowRightExit />
        Закрыть
      </FixedButton>
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
