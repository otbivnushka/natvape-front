import type { Story } from '../lib/stories';

export interface StorySet {
  title: string;
  image: string;
  stories: Story[];
}

export const storySets: StorySet[] = [
  {
    title: 'Новинки',
    image: 'https://www.sigaretnet.by/upload/images/smoant-battlestar-baby-pod-1.jpg',

    stories: [
      {
        url: 'https://placehold.co/600x900/000000/FFF?text=Новая+коллекция',
        duration: 3000,
        header: {
          heading: 'Новая коллекция',
          subheading: 'VapeMaster X Pro',
          profileImage: 'https://placehold.co/100x100/000000/FFF?text=NV',
        },
      },
      {
        url: 'https://placehold.co/600x900/000000/FFF?text=Story+2',
        duration: 2500,
      },
      {
        url: 'https://placehold.co/600x900/000000/FFF?text=Story+3',
        duration: 3000,
      },
    ],
  },
  {
    title: 'Акции',
    image: 'https://placehold.co/400x225/000000/FFF?text=Акции',
    stories: [
      {
        url: 'https://placehold.co/300x300/000000/FFF?text=Скидка+20%25',
        duration: 3000,
        header: {
          heading: 'Скидка 20%',
          subheading: 'На всю линейку POD-систем',
          profileImage: 'https://placehold.co/100x100/000000/FFF?text=NV',
        },
      },
      {
        url: 'https://placehold.co/600x900/000000/FFF?text=Story+5',
        duration: 3000,
      },
    ],
  },
  {
    title: 'Обзоры',
    image: 'https://placehold.co/400x225/000000/FFF?text=Обзоры',
    stories: [
      {
        url: 'https://placehold.co/600x900/000000/FFF?text=Lost+Vape+Orion+Bar+10000',
        duration: 4000,
        header: {
          heading: 'Обзор',
          subheading: 'Lost Vape Orion Bar 10000',
          profileImage: 'https://placehold.co/100x100/000000/FFF?text=NV',
        },
      },
    ],
  },
  {
    title: 'Советы',
    image: 'https://placehold.co/400x225/000000/FFF?text=Советы',
    stories: [
      {
        url: 'https://placehold.co/600x900/000000/FFF?text=Как+выбрать%3F',
        duration: 3000,
        header: {
          heading: 'Как выбрать?',
          subheading: 'Гайд для новичков',
          profileImage: 'https://placehold.co/100x100/000000/FFF?text=NV',
        },
      },
      {
        url: 'https://placehold.co/600x900/000000/FFF?text=Story+8',
        duration: 3000,
      },
      {
        url: 'https://placehold.co/600x900/000000/FFF?text=Story+9',
        duration: 3000,
      },
    ],
  },
  {
    title: 'Магазин',
    image: 'https://placehold.co/400x225/000000/FFF?text=Магазин',
    stories: [
      {
        url: 'https://placehold.co/600x900/000000/FFF?text=Наш+шоурум',
        duration: 2500,
        header: {
          heading: 'Наш шоурум',
          subheading: 'ул. Ленина, 15',
          profileImage: 'https://placehold.co/100x100/000000/FFF?text=NV',
        },
      },
      {
        url: 'https://placehold.co/600x900/000000/FFF?text=Story+11',
        duration: 3000,
      },
    ],
  },
];
