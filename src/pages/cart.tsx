import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { PrimaryButton } from '../components/ui';
import { CartItem as CartItemComponent, EmptyState, PageLayout } from '../components/shared';
import { formatPrice } from '../utils/formatPrice';
import { useEffect } from 'react';

const Cart = () => {
  const navigate = useNavigate();
  const { items, syncFromServer, subtotal } = useCartStore();

  useEffect(() => {
    syncFromServer();
  }, []);

  const total = subtotal();

  const handleCheckout = () => navigate('/checkout');

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-primary mb-4">Корзина</h1>

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
          <div className="flex flex-col gap-2.5">
            {items.map((item) => (
              <CartItemComponent key={item.product.id} item={item} />
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

export default Cart;
