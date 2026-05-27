import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { retrieveRawInitData } from '@telegram-apps/sdk';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { Api } from '../api';
import type { Order } from '../types';
import { Lock, Package, Sun, Moon, Loader2, Info, Shield } from 'lucide-react';
import {
  EmptyState,
  PageLayout,
  ProjectInfoModal,
  FixedButton,
  OrderCard,
} from '../components/shared';

const Profile = () => {
  const navigate = useNavigate();
  const { user, telegramAuth, logout, isLoggedIn, isAdmin } = useAuthStore();
  const { name: userName, telegramUsername: userTelegram, avatar: userAvatar } = user ?? {};
  const { theme, toggle } = useThemeStore();



  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) return;
    try {
      const initData = retrieveRawInitData();
      if (initData) {
        telegramAuth(initData).catch(() => {});
      }
    } catch {
      // not in Telegram WebApp
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    Api.orders
      .getAll()
      .then(setOrders)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setOrdersLoading(false));
  }, [user]);

  const handleLogout = () => {
    logout();
    setOrders([]);
  };

  if (!isLoggedIn()) {
    return (
      <>
        <PageLayout>
          <h1 className="text-2xl font-bold text-primary mb-5">Профиль</h1>
          <div className="max-w-sm mx-auto mt-8">
            <div className="flex flex-col items-center gap-2 mb-6">
              <Lock size={40} className="text-dim" />
              <p className="text-sm text-muted">Авторизация доступна только в Telegram</p>
            </div>
          </div>
        </PageLayout>
        <FixedButton
          onClick={() => setInfoOpen(true)}
          className="bottom-6 right-6 w-11 h-11 rounded-full bg-primary text-on-primary hover:scale-105"
        >
          <Info size={20} />
        </FixedButton>
        <ProjectInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
      </>
    );
  }

  return (
    <>
      <PageLayout>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-primary">Профиль</h1>
          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="py-1.5 px-3 border border-line rounded-lg bg-surface text-sm text-muted cursor-pointer hover:bg-page transition-colors"
            >
              Выйти
            </button>
            <button
              onClick={toggle}
              className="py-1.5 px-3 border border-line rounded-lg bg-surface text-sm text-muted cursor-pointer hover:bg-page transition-colors"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-surface rounded-xl mb-6">
          {userAvatar ? (
            <img
              className="w-15 h-15 rounded-full object-cover"
              src={userAvatar}
              alt={userName ?? ''}
            />
          ) : (
            <div className="w-15 h-15 rounded-full bg-surface flex items-center justify-center text-lg font-bold text-muted shrink-0">
              {userName?.charAt(0) ?? '?'}
            </div>
          )}
          <div className="flex-1">
            <div className="text-base font-semibold text-primary">{userName}</div>
            {userTelegram && (
              <div className="text-[13px] text-muted mt-0.5">@{userTelegram}</div>
            )}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-lg font-semibold text-muted mb-3">История заказов</h2>
          {ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-dim" />
            </div>
          ) : orders.length === 0 ? (
            <EmptyState icon={<Package size={48} />} title="Нет заказов" />
          ) : (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </div>
      </PageLayout>
      {isAdmin() ? (
        <div className="fixed bottom-18 right-2 z-40 flex gap-3">
          <FixedButton
            onClick={() => setInfoOpen(true)}
            className="relative w-11 h-11 hover:scale-105"
          >
            <Info size={20} />
          </FixedButton>
          <FixedButton
            onClick={() => navigate('/admin')}
            className="relative w-11 h-11 hover:scale-105"
          >
            <Shield size={20} />
          </FixedButton>
        </div>
      ) : (
        <FixedButton
          onClick={() => setInfoOpen(true)}
          className="bottom-18 right-2 relative w-11 h-11 hover:scale-105"
        >
          <Info size={20} />
        </FixedButton>
      )}
      <ProjectInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
};

export default Profile;
