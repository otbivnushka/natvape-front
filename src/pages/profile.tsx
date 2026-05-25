import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { ordersApi } from '../api/orders';
import { profileApi } from '../api/profile';
import type { Order } from '../types';
import { Lock, Package, Sun, Moon, Loader2, Info } from 'lucide-react';
import { EmptyState, PageLayout, ProjectInfoModal, FixedButton, OrderCard } from '../components/shared';
import { formatPrice } from '../utils/formatPrice';

const Profile = () => {
  const { user, login, logout, isLoggedIn } = useAuthStore();
  const { name: userName, email: userEmail, avatar: userAvatar } = user ?? {};
  const { theme, toggle } = useThemeStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrdersLoading(true);
    ordersApi
      .getAll()
      .then(setOrders)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setOrdersLoading(false));
    profileApi.get().then((p) => setTotalSpent(p.totalSpent)).catch(() => {});
  }, [user]);

  const handleLogin = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      await login(email, password);
    } catch (e) {
      setAuthError((e as Error).message || 'Ошибка входа');
    } finally {
      setAuthLoading(false);
    }
  };

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
              <p className="text-sm text-muted">Войдите, чтобы увидеть профиль и заказы</p>
            </div>

            <div className="bg-surface rounded-xl p-5">
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-page border border-line rounded-lg px-3.5 py-2.5 text-sm text-body outline-none transition-colors duration-150 focus:border-primary placeholder:text-dim"
                />
                <input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full bg-page border border-line rounded-lg px-3.5 py-2.5 text-sm text-body outline-none transition-colors duration-150 focus:border-primary placeholder:text-dim"
                />
                {authError && <p className="text-[13px] text-red-500">{authError}</p>}
                <button
                  onClick={handleLogin}
                  disabled={authLoading || !email || !password}
                  className="w-full py-2.5 border-none rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer transition-all duration-150 hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {authLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {authLoading ? 'Вход...' : 'Войти'}
                </button>
              </div>

              <p className="text-[12px] text-dim text-center mt-4">
                Тестовый: max@natvape.ru / password123
              </p>
            </div>
          </div>
        </PageLayout>
        <FixedButton
          onClick={() => setInfoOpen(true)}
          className="bottom-6 right-6 w-11 h-11 rounded-full bg-primary text-on-primary shadow-lg hover:scale-105"
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
            <div className="text-[13px] text-muted mt-0.5">{userEmail}</div>
          </div>
        </div>

        {orders.length > 0 && (
          <div className="mb-6 p-4 bg-surface rounded-xl">
            <div className="text-sm text-muted">Сумма выкупа</div>
            <div className="text-xl font-bold text-primary mt-0.5">{formatPrice(totalSpent)}</div>
          </div>
        )}

        <div className="mb-12">
          <h2 className="text-lg font-semibold text-muted mb-3">История заказов</h2>
          {ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-dim" />
            </div>
          ) : orders.length === 0 ? (
            <EmptyState icon={<Package size={48} />} title="Нет заказов" />
          ) : (
            orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      </PageLayout>
      <FixedButton
        onClick={() => setInfoOpen(true)}
        className="bottom-18 right-2 w-11 h-11 rounded-full bg-primary text-on-primary shadow-lg hover:scale-105"
      >
        <Info size={20} />
      </FixedButton>
      <ProjectInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
};

export default Profile;
