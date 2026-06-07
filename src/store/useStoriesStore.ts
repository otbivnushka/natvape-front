import { create } from 'zustand';
import { Api } from '../api';
import type { StorySet } from '../api/requests/stories';

interface StoriesState {
  storySets: StorySet[];
  getStorySets: () => void;
}

export const useStoriesStore = create<StoriesState>()((set) => ({
  storySets: [],

  getStorySets: () => {
    Api.stories
      .getAll()
      .then((data) => set({ storySets: data }))
      .catch(() => {});
  },
}));
