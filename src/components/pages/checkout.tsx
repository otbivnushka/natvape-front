import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Api } from '@/api';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { PrimaryButton, Textarea } from '@/components/ui';
import {
  PageLayout,
  DeliveryMethodSelector,
  PageTitle,
  TimeSelector,
} from '@/components/shared';
import { AddressSelector, OrderSummary, PickupSelector } from '@/components/widgets';
import type { DeliveryMethod } from '@/components/shared/delivery-method-selector';
import { useToastStore } from '@/store/useToastStore';
import { useToastError } from '@/hooks/useToastError';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCartStore();
  const toastError = useToastError();
  const addToast = useToastStore((s) => s.addToast);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const [delivery, setDelivery] = useState<DeliveryMethod>('pickup');
  const [pickupPoint, setPickupPoint] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [timeOption, setTimeOption] = useState<'soon' | 'whenever' | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);


  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const deliveryFee = delivery === 'delivery' && totalQty < 3 ? 3 : 0;
  const total = subtotal() + deliveryFee;

  const handleSubmit = async () => {
    if (!isLoggedIn()) {
      addToast('Войдите в профиль, чтобы оформить заказ');
      navigate('/profile');
      return;
    }

    setSubmitting(true);
    try {
      const extras: string[] = [];
      if (delivery === 'pickup' && pickupPoint) extras.push(`Самовывоз: ${pickupPoint}`);
      if (comment) extras.push(comment);
      const commentSend = extras.length > 0 ? extras.join(' | ') : undefined;
      const order = await Api.orders.create({
        deliveryMethod: delivery,
        comment: commentSend,
        addressId: delivery === 'delivery' ? (selectedAddressId ?? undefined) : undefined,
        deliveryTime:
          timeOption === 'soon'
            ? 'как можно скорее'
            : timeOption === 'whenever'
              ? 'не важно когда'
              : undefined,
      });
      addToast(`Заказ #${order.id} оформлен! Спасибо за покупку!`);
      clearCart();
      navigate('/profile');
    } catch {
      toastError('оформлении заказа');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center mt-20 gap-3">
          <ShoppingCart size={48} className="text-dim" />
          <p className="text-muted text-sm">Корзина пуста</p>
          <PrimaryButton onClick={() => navigate('/')}>В каталог</PrimaryButton>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageTitle>Оформление заказа</PageTitle>

      <DeliveryMethodSelector value={delivery} onChange={setDelivery} />

      {delivery === 'pickup' && (
        <PickupSelector className="mb-5" pickupPoint={pickupPoint} setPickupPoint={setPickupPoint} />
      )}

      {delivery === 'delivery' && (
        <AddressSelector selectedAddressId={selectedAddressId} setSelectedAddressId={setSelectedAddressId} className="mb-5" />
      )}

      <TimeSelector time={timeOption} setTime={setTimeOption} />

      <div className="mb-5">
        <h2 className="text-sm font-semibold text-muted mb-2.5">Комментарий к заказу</h2>
        <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>

      <OrderSummary items={items} total={total} deliveryFee={deliveryFee} />

      <PrimaryButton onClick={handleSubmit} disabled={submitting}>
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Оформление...
          </span>
        ) : (
          'Подтвердить заказ'
        )}
      </PrimaryButton>
    </PageLayout>
  );
};

export { Checkout };
