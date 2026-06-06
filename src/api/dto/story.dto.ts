export interface ApiStorySet {
  id: number;
  title: string;
  image: string;
  image_id: number;
  stories: ApiStory[];
}

export interface ApiStory {
  id: number;
  url: string;
  image_id: number;
  duration: number;
  title: string | null;
  subtitle: string | null;
  story_set_id: number;
}

export interface CreateStorySetDto {
  title: string;
  imageId: number;
  stories: CreateStoryDto[];
}

export interface CreateStoryDto {
  imageId: number;
  duration?: number;
  title?: string;
  subtitle?: string;
}

export interface UpdateStorySetDto {
  title?: string;
  imageId?: number;
}

export interface UpdateStoryDto {
  imageId?: number;
  duration?: number;
  title?: string;
  subtitle?: string;
}
