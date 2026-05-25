import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Truck, ShoppingCart, Loader2, Clock, RotateCcw } from 'lucide-react';
import { ordersApi } from '../api/orders';
import { addressesApi } from '../api/addresses';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { PrimaryButton } from '../components/ui';
import { PageLayout, MapBlock, AddressBlock } from '../components/shared';
import type { Address } from '../types';
import { formatPrice } from '../utils/formatPrice';
import { LocalizationProvider, TimeClock } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import clsx from 'clsx';

const deliveryOptions = [
  { value: 'pickup', label: 'Самовывоз', icon: Store },
  { value: 'delivery', label: 'Доставка (не халява)', icon: Truck },
] as const;

const radioBase =
  'flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCartStore();
  const addToast = useToastStore((s) => s.addToast);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const [delivery, setDelivery] = useState<'pickup' | 'delivery'>('pickup');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

  useEffect(() => {
    addressesApi.getAll()
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
      const newAddr = await addressesApi.create({ label: trimmed, lat: pendingLat, lng: pendingLng });
      setAddresses((prev) => [...prev, newAddr]);
      setSelectedAddressId(newAddr.id);
      setIsAddingAddress(false);
    } catch {
      addToast('Ошибка при сохранении адреса');
    }
  };

  const handleCancelAdd = () => {
    setIsAddingAddress(false);
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await addressesApi.remove(id);
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
      addToast('Ошибка при удалении адреса');
    }
  };

  const [selectedTime, setSelectedTime] = useState(dayjs());
  const [focusedView, setFocusedView] = useState<'hours' | 'minutes'>('hours');

  const total = subtotal();

  const handleSubmit = async () => {
    if (!isLoggedIn()) {
      addToast('Войдите в профиль, чтобы оформить заказ');
      navigate('/profile');
      return;
    }

    setSubmitting(true);
    try {
      const order = await ordersApi.create({
        deliveryMethod: delivery,
        comment: comment || undefined,
        addressId: delivery === 'delivery' ? (selectedAddressId ?? undefined) : undefined,
        deliveryTime: selectedTime.format('HH:mm'),
      });
      addToast(`Заказ #${order.id} оформлен! Спасибо за покупку!`);
      clearCart();
      navigate('/profile');
    } catch {
      addToast('Ошибка при оформлении заказа');
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

      <div className="mb-5">
        <h2 className="text-sm font-semibold text-muted mb-2.5">Способ получения</h2>
        <div className="flex flex-col gap-2">
          {deliveryOptions.map((opt) => {
            const selected = delivery === opt.value;
            return (
              <label
                key={opt.value}
                className={clsx(
                  radioBase,
                  selected
                    ? 'border-primary bg-primary/5'
                    : 'border-line bg-surface hover:border-muted',
                )}
              >
                <input
                  type="radio"
                  name="delivery"
                  value={opt.value}
                  checked={selected}
                  onChange={() => setDelivery(opt.value)}
                  className="sr-only"
                />
                <span
                  className={clsx(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200',
                    selected ? 'border-primary' : 'border-muted',
                  )}
                >
                  {selected && <span className="w-2 h-2 rounded-full bg-primary" />}
                </span>
                <opt.icon size={18} className={selected ? 'text-primary' : 'text-dim'} />
                <span
                  className={clsx('text-sm font-medium', selected ? 'text-body' : 'text-muted')}
                >
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {delivery === 'delivery' && (
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
          ) : addresses.length > 0 && selectedAddress ? (
            <>
              <div className="w-full rounded-xl flex items-center justify-center">
                <MapBlock lat={selectedAddress.lat} lng={selectedAddress.lng} />
              </div>
              <AddressBlock
                addresses={addresses}
                selectedId={selectedAddressId!}
                onSelect={setSelectedAddressId}
                onAddNew={handleAddNew}
                onDelete={handleDeleteAddress}
              />
            </>
          ) : null}
        </div>
      )}

      <div className="[&_.MuiClock-root]:!bg-transparent [&_.MuiClock-root]:!border-line [&_.MuiClock-clock]:!bg-primary [&_.MuiClockPointer-root]:!bg-page [&_.MuiClock-pin]:!bg-page [&_.MuiClockNumber-root]:!text-page [&_.MuiClockNumber-selected]:!text-page [&_.MuiClockNumber-selected]:!bg-body [&_.MuiClockPointer-thumb]:!border-body [&_.MuiClockPointer-thumb]:!bg-white/5 [&_.MuiClockNumber-root]:font-bold">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimeClock
            value={selectedTime}
            onChange={(newVal) => {
              if (newVal) setSelectedTime(newVal);
              setFocusedView('minutes');
            }}
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

      <div className="mb-5 p-4 bg-surface rounded-xl">
        <h2 className="text-sm font-semibold text-muted mb-3">Ваш заказ</h2>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={`${item.product.id}:${item.variantKey ?? ''}`}
              className="flex justify-between text-[13px]"
            >
              <span className="text-muted truncate mr-2">
                {item.product.name}
                {item.variantKey && <span className="text-dim"> ({item.variantKey})</span>}
                <span className="text-dim"> × {item.quantity}</span>
              </span>
              <span className="text-body font-medium whitespace-nowrap">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-base font-semibold text-body mt-3 pt-3 border-t border-line">
          <span>Итого</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

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
