import StoriesLib from 'react-insta-stories';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Stories = (StoriesLib as any).default ?? StoriesLib;

export default Stories;
export type { Story } from 'react-insta-stories/dist/interfaces';
