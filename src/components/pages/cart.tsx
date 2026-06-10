import { useNavigate } from 'react-router-dom';
import type { CartItem } from '@/types';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/queries/useCartQuery';
import { PrimaryButton } from '@/components/ui';
import {
  CartItem as CartItemComponent,
  EmptyState,
  PageLayout,
  PageTitle,
} from '@/components/shared';
import { formatPrice } from '@/utils/formatPrice';
import { calcCartSubtotal } from '@/utils/cartTotals';

const Cart = () => {
  const navigate = useNavigate();
  const { data: items = [] } = useCart();

  const total = calcCartSubtotal(items);

  const handleCheckout = () => navigate('/checkout');

  return (
    <PageLayout>
      <PageTitle>Корзина</PageTitle>

      {items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<ShoppingCart size={48} />}
            title="Корзина пуста"
            description="Добавьте товары из каталога"
          />
        </div>
      ) : (
        <>
          <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item: CartItem, i: number) => (
              <CartItemComponent key={item.product.id + i * i} item={item} />
            ))}
          </div>
          <div className="mt-5 p-4 bg-surface rounded-xl">
            <div className="flex justify-between text-base font-semibold text-primary">
              <span>Итого:</span>
              <span>{formatPrice(total)}</span>
            </div>
            <PrimaryButton className="mt-3.5" onClick={handleCheckout}>
              Оформить заказ
            </PrimaryButton>
          </div>
        </>
      )}
    </PageLayout>
  );
};

export { Cart };
