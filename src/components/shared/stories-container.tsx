import clsx from 'clsx';
import React from 'react';
import { StoriesItem } from './stories-item';
import Stories from 'react-insta-stories';
import type { Story } from 'react-insta-stories/dist/interfaces';

interface StoriesContainerProps {
  className?: string;
}

const stories: Story[] = [
  {
    url: 'https://placehold.co/600x400',
  },
  {
    url: 'https://placehold.co/600x400',
  },
];

const StoriesContainer: React.FC<StoriesContainerProps> = ({ className }) => {
  return (
    <div className={clsx('mb-6', className)}>
      <h2 className="text-lg font-semibold text-muted mb-3">Информация</h2>

      <div className="flex gap-2 overflow-x-auto scrollbar-horizontal">
        <StoriesItem title="Информация" image="https://placehold.co/600x400" />
        <StoriesItem title="Информация" image="https://placehold.co/600x400" />
        <StoriesItem title="Информация" image="https://placehold.co/600x400" />
        <StoriesItem title="Информация" image="https://placehold.co/600x400" />
        <StoriesItem title="Информация" image="https://placehold.co/600x400" />
        <Stories stories={stories} defaultInterval={1500} width={432} height={768} />
      </div>
    </div>
  );
};

export { StoriesContainer };
