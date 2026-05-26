import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Api } from '../api';
import type { Product } from '../types';
import type { AdminOrder } from '../api/dto/admin.dto';
import { formatPrice } from '../utils/formatPrice';
import { Package, ShoppingBag, Plus, Loader2, Check, Trash2, Pencil } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const isAdmin = useAuthStore((s) => s.isAdmin);

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/profile', { replace: true });
    }
  }, []);

  const [tab, setTab] = useState<'products' | 'orders'>('products');

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    type: 'product' | 'order';
    id: number;
  } | null>(null);

  useEffect(() => {
    if (tab === 'products') {
      setProductsLoading(true);
      Api.products
        .getAll({ limit: 100 })
        .then((res) => setProducts(res.items.map(Api.products.mapProduct)))
        .catch(() => {})
        .finally(() => setProductsLoading(false));
    } else {
      setOrdersLoading(true);
      Api.admin
        .getSentOrders()
        .then(setOrders)
        .catch(() => {})
        .finally(() => setOrdersLoading(false));
    }
  }, [tab]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      if (confirmDelete.type === 'product') {
        await Api.admin.deleteProduct(confirmDelete.id);
        setProducts((prev) => prev.filter((p) => p.id !== confirmDelete.id));
      } else {
        await Api.admin.deleteOrder(confirmDelete.id);
        setOrders((prev) => prev.filter((o) => o.id !== confirmDelete.id));
      }
    } catch {
      /* silent */
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleCompleteOrder = async (id: number) => {
    try {
      await Api.admin.updateOrderStatus(id, 'end');
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch {
      /* silent */
    }
  };

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-5xl mx-auto px-4 pb-16 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary">Панель администратора</h1>
          <button
            onClick={() => navigate('/profile')}
            className="py-1.5 px-3 border border-line rounded-lg bg-surface text-sm text-muted cursor-pointer hover:bg-page transition-colors"
          >
            Назад
          </button>
        </div>

        <div className="flex gap-1 mb-6 bg-surface rounded-xl p-1">
          <button
            onClick={() => setTab('products')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              tab === 'products' ? 'bg-primary text-on-primary' : 'text-muted hover:text-body'
            }`}
          >
            Товары
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              tab === 'orders' ? 'bg-primary text-on-primary' : 'text-muted hover:text-body'
            }`}
          >
            Заказы
          </button>
        </div>

        {tab === 'products' && (
          <>
            <button
              onClick={() => navigate('/admin/products/new')}
              className="mb-4 flex items-center gap-2 py-2 px-4 border-none rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer hover:opacity-85 transition-all duration-200"
            >
              <Plus size={16} />
              Создать товар
            </button>

            {productsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-dim" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-dim gap-2">
                <Package size={48} className="opacity-50" />
                <span className="text-sm">Нет товаров</span>
              </div>
            ) : (
              <div className="bg-surface rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-line text-left text-muted text-[13px]">
                        <th className="p-3 font-semibold">ID</th>
                        <th className="p-3 font-semibold">Название</th>
                        <th className="p-3 font-semibold">Цена</th>
                        <th className="p-3 font-semibold">Категория</th>
                        <th className="p-3 font-semibold">Бренд</th>
                        <th className="p-3 font-semibold">Акция</th>
                        <th className="p-3 font-semibold text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} className="border-b border-line last:border-none text-body">
                          <td className="p-3 text-muted">{p.id}</td>
                          <td className="p-3 font-medium max-w-48 truncate">{p.name}</td>
                          <td className="p-3">{formatPrice(p.price)}</td>
                          <td className="p-3 text-muted">{p.category}</td>
                          <td className="p-3 text-muted">{p.brand}</td>
                          <td className="p-3">
                            {p.doublePrice != null ? `1+1 = ${p.doublePrice}` : '—'}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => navigate(`/admin/products/${p.id}`)}
                                className="p-1.5 border border-line rounded-lg text-muted cursor-pointer hover:text-body hover:border-muted transition-colors"
                                title="Редактировать"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => setConfirmDelete({ type: 'product', id: p.id })}
                                className="p-1.5 border border-line rounded-lg text-muted cursor-pointer hover:text-red-500 hover:border-red-300 transition-colors"
                                title="Удалить"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'orders' && (
          <>
            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-dim" />
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-dim gap-2">
                <ShoppingBag size={48} className="opacity-50" />
                <span className="text-sm">Нет новых заказов</span>
              </div>
            ) : (
              <div className="bg-surface rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-line text-left text-muted text-[13px]">
                        <th className="p-3 font-semibold">ID</th>
                        <th className="p-3 font-semibold">Пользователь</th>
                        <th className="p-3 font-semibold">Сумма</th>
                        <th className="p-3 font-semibold">Способ</th>
                        <th className="p-3 font-semibold text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} className="border-b border-line last:border-none text-body">
                          <td className="p-3 text-muted">{o.id}</td>
                          <td className="p-3 max-w-36 truncate">{o.user.name}</td>
                          <td className="p-3 font-medium">{formatPrice(Number(o.total))}</td>
                          <td className="p-3 text-muted">
                            {o.deliveryMethod === 'pickup' ? 'Самовывоз' : 'Доставка'}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleCompleteOrder(o.id)}
                                className="flex items-center gap-1 py-1.5 px-2.5 border-none rounded-lg bg-accent text-on-accent text-[12px] font-semibold cursor-pointer hover:opacity-85 transition-all duration-200"
                              >
                                <Check size={12} />
                                Завершить
                              </button>
                              <button
                                onClick={() => setConfirmDelete({ type: 'order', id: o.id })}
                                className="p-1.5 border border-line rounded-lg text-muted cursor-pointer hover:text-red-500 hover:border-red-300 transition-colors"
                                title="Удалить"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-surface rounded-xl p-5 w-full max-w-sm">
            <h3 className="text-base font-bold text-primary mb-2">Подтверждение удаления</h3>
            <p className="text-sm text-muted mb-4">
              {confirmDelete.type === 'product'
                ? 'Вы уверены, что хотите удалить этот товар?'
                : 'Вы уверены, что хотите удалить этот заказ?'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 border border-line rounded-lg bg-surface text-sm text-muted cursor-pointer hover:bg-page transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 border-none rounded-lg bg-red-500 text-white text-sm font-semibold cursor-pointer hover:opacity-85 transition-all duration-200"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
