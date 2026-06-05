import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Api } from '../api';
import type { Product } from '../types';
import type { AdminOrder } from '../api/dto/admin.dto';
import type { AdminTab } from '../components/shared/admin-tab-picker';
import { useAdminGuard } from '../hooks/useAdminGuard';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { AdminTabPicker, AdminProductsTable, AdminOrdersTable } from '../components/shared';

const Admin = () => {
  const navigate = useNavigate();
  useAdminGuard();
  const { tab: tabParam } = useParams<{ tab: string }>();
  const [tab, setTab] = useState<AdminTab>(tabParam === 'orders' ? 'orders' : 'products');

  const handleTabChange = (next: AdminTab) => {
    setTab(next);
    navigate(`/admin/${next}`, { replace: true });
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { confirm, ConfirmDialog } = useConfirmDialog<{ type: 'product' | 'order'; id: number }>();

  useEffect(() => {
    if (tab === 'products') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProductsLoading(true);
      Api.products
        .getAll()
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

  const handleDelete = async (type: 'product' | 'order', id: number) => {
    const msg =
      type === 'product'
        ? 'Вы уверены, что хотите удалить этот товар?'
        : 'Вы уверены, что хотите удалить этот заказ?';
    const ok = await confirm({ type, id }, msg);
    if (!ok) return;
    try {
      if (type === 'product') {
        await Api.admin.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        await Api.admin.deleteOrder(id);
        setOrders((prev) => prev.filter((o) => o.id !== id));
      }
    } catch {
      /* silent */
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
        </div>

        <AdminTabPicker tab={tab} setTab={handleTabChange} />

        {tab === 'products' && (
          <AdminProductsTable
            products={products}
            loading={productsLoading}
            onCreate={() => navigate('/admin/products/new')}
            onEdit={(id: number) => navigate(`/admin/products/${id}`)}
            onDelete={(id: number) => handleDelete('product', id)}
          />
        )}
        {tab === 'orders' && (
          <AdminOrdersTable
            orders={orders}
            loading={ordersLoading}
            onComplete={handleCompleteOrder}
            onDelete={(id: number) => handleDelete('order', id)}
          />
        )}
        {tab === 'stories' && <div>Stories</div>}
      </div>

      <ConfirmDialog />
    </div>
  );
};

export default Admin;
