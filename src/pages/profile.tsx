import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Api } from '../api';
import type { Order } from '../types';
import { Lock, Info, Shield } from 'lucide-react';
import { PageLayout, ProjectInfoModal, FixedButton } from '../components/shared';
import { PageTitle } from '../components/shared/page-title';
import { UserInfo } from '../components/shared/user-info';
import { OrdersContainer } from '../components/shared/orders-container';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, isAdmin } = useAuthStore();
  const { name: userName } = user ?? {};

  const tg = window.Telegram?.WebApp;
  const tgUser = tg.initDataUnsafe.user;
  const displayName = [tgUser?.first_name, tgUser?.last_name].filter(Boolean).join(' ') || userName;
  const displayAvatar = tgUser?.photo_url;
  const displayTelegram = tgUser?.username;

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrdersLoading(true);
    Api.orders
      .getAll()
      .then(setOrders)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setOrdersLoading(false));
  }, [user]);

  if (!isLoggedIn()) {
    return (
      <>
        <PageLayout>
          <PageTitle>Профиль</PageTitle>
          <div className="max-w-sm mx-auto mt-8">
            <div className="flex flex-col items-center gap-2 mb-6">
              <Lock size={40} className="text-dim" />
              <p className="text-sm text-muted">Авторизация доступна только в Telegram</p>
            </div>
          </div>
        </PageLayout>
      </>
    );
  }

  return (
    <>
      <PageLayout>
        <PageTitle>Профиль</PageTitle>

        <UserInfo
          displayName={displayName}
          displayAvatar={displayAvatar}
          displayTelegram={displayTelegram}
        />

        <OrdersContainer orders={orders} ordersLoading={ordersLoading} />
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
          className="bottom-18 right-2 w-11 h-11 hover:scale-105"
        >
          <Info size={20} />
        </FixedButton>
      )}
      <ProjectInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
};

export default Profile;
