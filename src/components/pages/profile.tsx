import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrders } from '@/hooks/queries/useOrdersQuery';
import { Lock, Info, Shield } from 'lucide-react';
import { PageLayout, FixedButton, PageTitle } from '@/components/shared';
import { StoriesContainer, UserInfo, OrdersContainer } from '@/components/widgets';
import { ProjectInfoModal } from '@/components/widgets/modals';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, isAdmin } = useAuthStore();
  const { name: userName } = user ?? {};
  const { data: orders = [], isLoading: ordersLoading } = useOrders();

  const tg = window.Telegram?.WebApp;
  const tgUser = tg.initDataUnsafe.user;
  const displayName = [tgUser?.first_name, tgUser?.last_name].filter(Boolean).join(' ') || userName;
  const displayAvatar = tgUser?.photo_url;
  const displayTelegram = tgUser?.username;

  const [infoOpen, setInfoOpen] = useState(false);

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

        <StoriesContainer />

        <OrdersContainer orders={orders} ordersLoading={ordersLoading} />
      </PageLayout>
      {isAdmin() && (
        <FixedButton onClick={() => navigate('/admin')} className="bottom-19 right-18 w-11 h-11">
          <Shield size={20} />
        </FixedButton>
      )}
      <FixedButton onClick={() => setInfoOpen(true)} className="bottom-19 right-4 w-11 h-11">
        <Info size={20} />
      </FixedButton>

      <ProjectInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
};

export { Profile };
