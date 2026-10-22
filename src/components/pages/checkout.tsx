import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Api } from '@/api';
import { useCart, useClearCart } from '@/hooks/queries/useCartQuery';
import { useBonus } from '@/hooks/queries/useBonusQuery';
import { useAuthStore } from '@/store/useAuthStore';
import { PrimaryButton, Textarea } from '@/components/ui';
import { PageLayout, DeliveryMethodSelector, PageTitle, TimeSelector, BonusSelector } from '@/components/shared';
import { AddressSelector, OrderSummary, PickupSelector } from '@/components/widgets';
import { OrderErrorModal } from '@/components/widgets/modals';
import type { CartItem } from '@/types';
import type { DeliveryMethod } from '@/components/shared/delivery-method-selector';
import { useToastStore } from '@/store/useToastStore';
import { useToastError } from '@/hooks/useToastError';
import { calcCartSubtotal } from '@/utils/cartTotals';
import { queryKeys } from '@/hooks/queries/queryKeys';

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: items = [] } = useCart();
  const clearCart = useClearCart();
  const addToast = useToastStore((s) => s.addToast);
  const toastError = useToastError();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const [delivery, setDelivery] = useState<DeliveryMethod>('pickup');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [timeOption, setTimeOption] = useState<'soon' | 'whenever' | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [unsavedAddress, setUnsavedAddress] = useState('');
  const [orderErrors, setOrderErrors] = useState<string[] | null>(null);
  const [bonusToUse, setBonusToUse] = useState(0);

  const { data: bonus } = useBonus();

  const totalQty = items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0);
  const deliveryFee = delivery === 'delivery' && totalQty < 3 ? 3 : 0;
  const subtotal = calcCartSubtotal(items);
  const maxBonus = Math.min(bonus?.spendable ?? 0, Math.floor(subtotal));
  const effectiveBonus = Math.min(bonusToUse, maxBonus);

  const total = subtotal + deliveryFee - effectiveBonus;

  const handleDeliveryChange = (method: DeliveryMethod) => {
    if (method !== delivery) setUnsavedAddress('');
    setDelivery(method);
  };

  const handleSubmit = async () => {
    if (!isLoggedIn()) {
      addToast('Войдите в профиль, чтобы оформить заказ');
      navigate('/profile');
      return;
    }

    const typedAddress = delivery === 'delivery' ? unsavedAddress.trim() : '';
    const fullComment = typedAddress
      ? [comment.trim(), `Адрес: ${typedAddress}`].filter(Boolean).join('\n')
      : comment;

    setSubmitting(true);
    try {
      const order = await Api.orders.create({
        deliveryMethod: delivery,
        comment: fullComment,
        addressId: typedAddress ? undefined : (selectedAddressId ?? undefined),
        deliveryTime:
          timeOption === 'soon'
            ? 'как можно скорее'
            : timeOption === 'whenever'
              ? 'не важно когда'
              : undefined,
        bonusToUse: effectiveBonus > 0 ? effectiveBonus : undefined,
      });
      addToast(`Заказ #${order.id} оформлен! Спасибо за покупку!`);
      clearCart.mutate();
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bonus.all });
      navigate('/profile');
    } catch (e) {
      const msgs = (e as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
      if (Array.isArray(msgs) && msgs.length > 0) {
        setOrderErrors(msgs as string[]);
      } else if (typeof msgs === 'string') {
        addToast(msgs);
      } else {
        toastError('оформлении заказа');
      }
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

      <DeliveryMethodSelector value={delivery} onChange={handleDeliveryChange} />

      {delivery === 'pickup' && (
        <PickupSelector
          className="mb-5"
          pickupPoint={selectedAddressId}
          setPickupPoint={setSelectedAddressId}
        />
      )}

      {delivery === 'delivery' && (
        <AddressSelector
          selectedAddressId={selectedAddressId}
          setSelectedAddressId={setSelectedAddressId}
          onPendingAddressChange={setUnsavedAddress}
          className="mb-5"
        />
      )}

      <TimeSelector time={timeOption} setTime={setTimeOption} />

      <BonusSelector
        spendable={bonus?.spendable ?? 0}
        max={maxBonus}
        value={effectiveBonus}
        onChange={setBonusToUse}
      />

      <div className="mb-5">
        <h2 className="text-sm font-semibold text-muted mb-2.5">Комментарий к заказу</h2>
        <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>

      <OrderSummary items={items} total={total} deliveryFee={deliveryFee} bonusUsed={effectiveBonus} />

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

      <OrderErrorModal
        open={orderErrors != null}
        onClose={() => setOrderErrors(null)}
        errors={orderErrors ?? []}
      />
    </PageLayout>
  );
};

export { Checkout };
