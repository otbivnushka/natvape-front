import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const stored = (
  typeof window !== 'undefined' ? localStorage.getItem('theme') : null
) as Theme | null;
const prefersDark =
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
const initial: Theme = stored || (prefersDark ? 'dark' : 'light');

if (initial === 'dark') {
  document.documentElement.classList.add('dark');
}

const applyTheme = (theme: Theme) => {
  localStorage.setItem('theme', theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initial,
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));
