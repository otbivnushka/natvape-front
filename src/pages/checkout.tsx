import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Loader2, Clock, RotateCcw } from 'lucide-react';
import { Api } from '../api';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { PrimaryButton } from '../components/ui';
import {
  PageLayout,
  MapBlock,
  AddressBlock,
  OrderSummary,
  DeliveryMethodSelector,
} from '../components/shared';
import type { Address } from '../types';
import type { DeliveryMethod } from '../components/shared/delivery-method-selector';
import { LocalizationProvider, TimeClock } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useToastStore } from '../store/useToastStore';
import { useToastError } from '../hooks/useToastError';

const pickupPoints = [
  'McDonalds',
  'Трио',
  'Зеленая гура',
  'Континент',
  'Марко',
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCartStore();
  const toastError = useToastError();
  const addToast = useToastStore((s) => s.addToast);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const [delivery, setDelivery] = useState<DeliveryMethod>('pickup');
  const [pickupPoint, setPickupPoint] = useState('');
  const [deliveryText, setDeliveryText] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

  useEffect(() => {
    Api.addresses
      .getAll()
      .then((list) => {
        setAddresses(list);
        if (list.length > 0) setSelectedAddressId(list[0].id);
      })
      .catch(() => {});
  }, []);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [pendingLat, setPendingLat] = useState<number | null>(null);
  const [pendingLng, setPendingLng] = useState<number | null>(null);
  const [pendingLabel, setPendingLabel] = useState('');

  const handleAddNew = () => {
    setIsAddingAddress(true);
    setPendingLat(null);
    setPendingLng(null);
    setPendingLabel('');
  };

  const handleMapClick = (lat: number, lng: number) => {
    setPendingLat(lat);
    setPendingLng(lng);
  };

  const handleSaveAddress = async () => {
    const trimmed = pendingLabel.trim();
    if (!trimmed || pendingLat === null || pendingLng === null) return;
    try {
      const newAddr = await Api.addresses.create({
        label: trimmed,
        lat: pendingLat,
        lng: pendingLng,
      });
      setAddresses((prev) => [...prev, newAddr]);
      setSelectedAddressId(newAddr.id);
      setIsAddingAddress(false);
    } catch {
      toastError('сохранении адреса');
    }
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

  const [selectedTime, setSelectedTime] = useState(dayjs());
  const [focusedView, setFocusedView] = useState<'hours' | 'minutes'>('hours');
  const viewTimerRef = useRef<number>(undefined);
  const handleTimeChange = (newVal: dayjs.Dayjs | null) => {
    if (!newVal) return;
    setSelectedTime(newVal);
    clearTimeout(viewTimerRef.current);
    viewTimerRef.current = setTimeout(() => setFocusedView('minutes'), 400);
  };

  const total = subtotal();

  const handleSubmit = async () => {
    if (!isLoggedIn()) {
      addToast('Войдите в профиль, чтобы оформить заказ');
      navigate('/profile');
      return;
    }

    const extra: string[] = [];
    if (delivery === 'pickup' && pickupPoint) extra.push(`Самовывоз: ${pickupPoint}`);
    if (delivery === 'delivery_text' && deliveryText) extra.push(`Адрес: ${deliveryText}`);
    const fullComment = [...extra, comment].filter(Boolean).join(' | ');

    setSubmitting(true);
    try {
      const order = await Api.orders.create({
        deliveryMethod: delivery === 'pickup' ? 'pickup' : 'delivery',
        comment: fullComment || undefined,
        addressId: delivery === 'delivery_map' ? (selectedAddressId ?? undefined) : undefined,
        deliveryTime: selectedTime.format('HH:mm'),
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

      {delivery === 'delivery_map' && (
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-muted mb-2.5">Адрес доставки</h2>

          {isAddingAddress ? (
            <div className="flex flex-col gap-3">
              <div className="w-full rounded-xl flex items-center justify-center">
                <MapBlock
                  lat={pendingLat ?? undefined}
                  lng={pendingLng ?? undefined}
                  onMapClick={handleMapClick}
                  markerTitle={pendingLabel}
                />
              </div>
              <input
                type="text"
                value={pendingLabel}
                onChange={(e) => setPendingLabel(e.target.value)}
                placeholder="Название адреса"
                className="w-full bg-surface border-2 border-line rounded-xl p-3 text-sm text-body outline-none transition-all duration-200 focus:border-primary placeholder:text-dim"
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
                  disabled={!pendingLabel.trim() || pendingLat === null}
                  className="flex-1 py-3 rounded-xl border-2 border-primary bg-primary text-sm font-medium text-on-primary hover:bg-primary-hover transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  Сохранить
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full rounded-xl flex items-center justify-center">
                <MapBlock lat={selectedAddress?.lat} lng={selectedAddress?.lng} />
              </div>
              <AddressBlock
                addresses={addresses}
                selectedId={selectedAddressId ?? -1}
                onSelect={setSelectedAddressId}
                onAddNew={handleAddNew}
                onDelete={handleDeleteAddress}
              />
            </>
          )}
        </div>
      )}

      {delivery === 'delivery_text' && (
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-muted mb-2.5">Адрес доставки</h2>
          <textarea
            value={deliveryText}
            onChange={(e) => setDeliveryText(e.target.value)}
            placeholder="Введите адрес вручную"
            rows={3}
            className="w-full resize-none bg-surface border-2 border-line rounded-xl p-3 text-sm text-body outline-none transition-all duration-200 focus:border-primary placeholder:text-dim"
          />
        </div>
      )}

      <div className="[&_.MuiClock-root]:bg-transparent! [&_.MuiClock-root]:border-line! [&_.MuiClock-clock]:bg-primary! [&_.MuiClockPointer-root]:bg-page! [&_.MuiClock-pin]:bg-page! [&_.MuiClockNumber-root]:text-page! [&_.MuiClockNumber-selected]:text-page! [&_.MuiClockNumber-selected]:bg-body! [&_.MuiClockPointer-thumb]:border-body! [&_.MuiClockPointer-thumb]:bg-white/5! [&_.MuiClockNumber-root]:font-bold">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimeClock
            value={selectedTime}
            onChange={handleTimeChange}
            ampm={false}
            view={focusedView}
          />
        </LocalizationProvider>
      </div>
      <div className="flex items-center justify-between mt-2 mb-5">
        <span className="flex items-center gap-1.5 text-sm font-medium text-body">
          <Clock size={14} />
          {selectedTime.format('HH:mm')}
        </span>
        <button
          type="button"
          onClick={() => {
            setSelectedTime(dayjs());
            setFocusedView('hours');
          }}
          className="flex items-center gap-1 text-xs text-muted hover:text-body transition-colors duration-200 cursor-pointer"
        >
          <RotateCcw size={12} />
          Сброс
        </button>
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
