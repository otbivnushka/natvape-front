import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const rootPaths = ['/', '/catalog'];

export function useTelegramBackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    if (rootPaths.includes(location.pathname)) {
      tg.BackButton.hide();
    } else {
      tg.BackButton.show();
    }

    const handler = () => navigate(-1);
    tg.onEvent('backButtonClicked', handler);
    return () => {
      tg.BackButton.hide();
      tg.offEvent('backButtonClicked', handler);
    };
  }, [location.pathname, navigate]);
}
