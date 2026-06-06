import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { retrieveRawInitData } from '@telegram-apps/sdk';
import { initAuthInterceptor } from '../api/instance';
import { useThemeStore } from '../store/useThemeStore';
import { useStoriesStore } from '../store/useStoriesStore';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Telegram: any;
  }
}

export function useInit() {
  useEffect(() => {
    if (useAuthStore.getState().token === null) {
      try {
        const initData = retrieveRawInitData();
        if (initData) {
          useAuthStore
            .getState()
            .telegramAuth(initData)
            .catch(() => {});
        }
      } catch {
        // not in Telegram
      }
    }
    initAuthInterceptor(() => useAuthStore.getState().token);
  }, []);

  useEffect(() => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.enableClosingConfirmation();
        if (tg.colorScheme) {
          useThemeStore.getState().setTheme(tg.colorScheme);
        }
      }
    } catch {
      // not in Telegram WebApp
    }
  }, []);

  useEffect(() => {
    useStoriesStore.getState().getStorySets();
  }, []);
}
