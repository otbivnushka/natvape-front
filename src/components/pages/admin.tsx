import { useNavigate, useParams } from 'react-router-dom';
import type { AdminTab } from '@/components/widgets/admin-tab-picker';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { useProducts } from '@/hooks/queries/useProductsQuery';
import { useSentOrders } from '@/hooks/queries/useOrdersQuery';
import { useStories } from '@/hooks/queries/useStoriesQuery';
import { usePickups } from '@/hooks/queries/usePickupsQuery';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/hooks/queries/queryKeys';
import { Api } from '@/api';
import {
  AdminTabPicker,
  AdminProductsTable,
  AdminOrdersTable,
  AdminStoriesTable,
  AdminPickupsTable,
  AdminCategoryAttributes,
} from '@/components/widgets';
import { useState } from 'react';

const Admin = () => {
  const navigate = useNavigate();
  useAdminGuard();
  const { tab: tabParam } = useParams<{ tab: string }>();
  const [tab, setTab] = useState<AdminTab>(tabParam === 'orders' ? 'orders' : 'products');

  const handleTabChange = (next: AdminTab) => {
    setTab(next);
    navigate(`/admin/${next}`, { replace: true });
  };

  const { data: productsData, isLoading: productsLoading } = useProducts();
  const { data: orders = [], isLoading: ordersLoading } = useSentOrders();
  const { data: stories = [], isLoading: storiesLoading } = useStories();
  const { data: pickups = [], isLoading: pickupsLoading } = usePickups();

  const { confirm, ConfirmDialog } = useConfirmDialog<{
    type: 'product' | 'order' | 'story' | 'pickup';
    id: number;
  }>();

  const products = productsData?.items ?? [];

  const handleDelete = async (type: 'product' | 'order' | 'story' | 'pickup', id: number) => {
    const msg =
      type === 'product'
        ? 'Вы уверены, что хотите удалить этот товар?'
        : type === 'order'
          ? 'Вы уверены, что хотите удалить этот заказ?'
          : type === 'story'
            ? 'Вы уверены, что хотите удалить эту историю?'
            : 'Вы уверены, что хотите удалить эту точку самовывоза?';
    const ok = await confirm({ type, id }, msg);
    if (!ok) return;
    try {
      if (type === 'product') {
        await Api.admin.deleteProduct(id);
        queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      } else if (type === 'order') {
        await Api.admin.deleteOrder(id);
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      } else if (type === 'story') {
        await Api.admin.deleteStorySet(id);
        queryClient.invalidateQueries({ queryKey: queryKeys.stories.all });
      } else {
        await Api.admin.deletePickup(id);
        queryClient.invalidateQueries({ queryKey: queryKeys.addresses.pickups() });
      }
    } catch {
      /* silent */
    }
  };

  const handleCompleteOrder = async (id: number) => {
    try {
      await Api.admin.updateOrderStatus(id, 'end');
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    } catch {
      /* silent */
    }
  };

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-5xl mx-auto px-4 pb-20 py-6">
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
        {tab === 'stories' && (
          <AdminStoriesTable
            storySets={stories}
            loading={storiesLoading}
            onCreate={() => navigate('/admin/stories/new')}
            onDelete={(id: number) => handleDelete('story', id)}
          />
        )}
        {tab === 'pickups' && (
          <AdminPickupsTable
            pickups={pickups}
            loading={pickupsLoading}
            onCreate={() => navigate('/admin/pickups/new')}
            onDelete={(id: number) => handleDelete('pickup', id)}
          />
        )}
        {tab === 'attributes' && <AdminCategoryAttributes />}
      </div>

      <ConfirmDialog />
    </div>
  );
};

export { Admin };
