import { ApiRoutes } from '../constants';
import type { ApiStorySet } from '../dto/story.dto';
import type { Story } from '../../lib/stories';
import { axiosInstance } from '../instance';

export interface StorySet {
  id: number;
  title: string;
  image: string;
  imageId: number;
  stories: Story[];
}

function mapStorySet(api: ApiStorySet): StorySet {
  return {
    id: api.id,
    title: api.title,
    image: api.image,
    imageId: api.image_id,
    stories: api.stories.map((s) => ({
      url: s.url,
      duration: s.duration,
      ...(s.header?.heading || s.header?.subheading
        ? {
            header: {
              heading: s.header.heading ?? '',
              subheading: s.header.subheading ?? '',
              profileImage: s.header.profileImage ?? '',
            },
          }
        : {}),
    })),
  };
}

export const getAll = async (): Promise<StorySet[]> => {
  const { data } = await axiosInstance.get<ApiStorySet[]>(ApiRoutes.STORIES);
  return data.map(mapStorySet);
};

export const getRawAll = async (): Promise<ApiStorySet[]> => {
  const { data } = await axiosInstance.get<ApiStorySet[]>(ApiRoutes.STORIES);
  return data;
};
