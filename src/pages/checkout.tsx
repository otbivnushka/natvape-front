import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Api } from '../api';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { PrimaryButton, AddressInput } from '../components/ui';
import {
  PageLayout,
  AddressBlock,
  OrderSummary,
  DeliveryMethodSelector,
} from '../components/shared';
import type { Address } from '../types';
import type { DeliveryMethod } from '../components/shared/delivery-method-selector';
import { useToastStore } from '../store/useToastStore';
import { useToastError } from '../hooks/useToastError';
import { geocodeAddress } from '../utils/geocode';

const pickupPoints = [
  'McDonalds',
  'Трио',
  'Зеленая гура',
  'Континент',
  'Марко',
  'Правды 60а (Евроопт)',
];

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

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  useEffect(() => {
    Api.addresses
      .getAll()
      .then((list) => {
        setAddresses(list);
        if (list.length > 0) setSelectedAddressId(list[0].id);
      })
      .catch(() => {});
  }, []);

  const [timeOption, setTimeOption] = useState<'soon' | 'whenever' | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [pendingAddressInput, setPendingAddressInput] = useState('');
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleAddNew = () => {
    setIsAddingAddress(true);
    setPendingAddressInput('');
    setPendingCoords(null);
  };

  const handleSaveAddress = async () => {
    const trimmed = pendingAddressInput.trim();
    if (!trimmed) return;
    let { lat, lng } = pendingCoords ?? { lat: 0, lng: 0 };
    if (!pendingCoords) {
      try {
        const coords = await geocodeAddress(trimmed);
        lat = coords.lat;
        lng = coords.lng;
      } catch {
        lat = 0;
        lng = 0;
      }
    }
    try {
      const newAddr = await Api.addresses.create({
        label: trimmed,
        lat,
        lng,
      });
      setAddresses((prev) => [...prev, newAddr]);
      setSelectedAddressId(newAddr.id);
      setIsAddingAddress(false);
    } catch {
      toastError('сохранении адреса');
    }
  };

  const handleSelectAddress = (address: string, lat: number, lng: number) => {
    setPendingAddressInput(address);
    setPendingCoords({ lat, lng });
  };

  const handleCancelAdd = () => {
    setIsAddingAddress(false);
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await Api.addresses.remove(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      if (selectedAddressId === id) {
        const remaining = addresses.filter((a) => a.id !== id);
        const first = remaining[0];
        if (first) {
          setSelectedAddressId(first.id);
        } else {
          handleAddNew();
        }
      }
    } catch {
      toastError('удалении адреса');
    }
  };

  const total = subtotal();

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
      <h1 className="text-2xl font-bold text-body mb-5">Оформление заказа</h1>

      <DeliveryMethodSelector value={delivery} onChange={setDelivery} />

      {delivery === 'pickup' && (
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-muted mb-2.5">Точка самовывоза</h2>
          <div className="flex flex-wrap gap-2">
            {pickupPoints.map((p) => (
              <button
                key={p}
                onClick={() => setPickupPoint(p)}
                className={
                  pickupPoint === p
                    ? 'py-1.5 px-3.5 rounded-lg border border-primary bg-primary text-on-primary text-[13px] font-medium cursor-pointer'
                    : 'py-1.5 px-3.5 rounded-lg border border-line bg-surface text-body text-[13px] font-medium cursor-pointer hover:border-muted'
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {delivery === 'delivery' && (
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-muted mb-2.5">Адрес доставки</h2>

          {isAddingAddress ? (
            <div className="flex flex-col gap-3">
              <AddressInput
                value={pendingAddressInput}
                onChange={(v) => {
                  setPendingAddressInput(v);
                  setPendingCoords(null);
                }}
                onSelectAddress={handleSelectAddress}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancelAdd}
                  className="flex-1 py-3 rounded-xl border-2 border-line text-sm font-medium text-muted bg-surface hover:border-muted transition-all duration-200 cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  disabled={!pendingAddressInput.trim()}
                  className="flex-1 py-3 rounded-xl border-2 border-primary bg-primary text-sm font-medium text-on-primary hover:bg-primary-hover transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  Сохранить
                </button>
              </div>
            </div>
          ) : (
            <AddressBlock
              addresses={addresses}
              selectedId={selectedAddressId ?? -1}
              onSelect={setSelectedAddressId}
              onAddNew={handleAddNew}
              onDelete={handleDeleteAddress}
            />
          )}
        </div>
      )}

      <div className="mb-5">
        <h2 className="text-sm font-semibold text-muted mb-2.5">Время</h2>
        <div className="flex gap-2 flex-wrap">
          {(['soon', 'whenever'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setTimeOption(opt)}
              className={
                timeOption === opt
                  ? 'py-1.5 px-3.5 rounded-lg border border-primary bg-primary text-on-primary text-[13px] font-medium cursor-pointer'
                  : 'py-1.5 px-3.5 rounded-lg border border-line bg-surface text-body text-[13px] font-medium cursor-pointer hover:border-muted'
              }
            >
              {opt === 'soon' ? 'Как можно скорее' : 'Не важно когда'}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <h2 className="text-sm font-semibold text-muted mb-2.5">Комментарий к заказу</h2>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Необязательно"
          rows={3}
          className="w-full resize-none bg-surface border-2 border-line rounded-xl p-3 text-sm text-body outline-none transition-all duration-200 focus:border-primary placeholder:text-dim"
        />
      </div>

      <OrderSummary items={items} total={total} />

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

export default Checkout;
