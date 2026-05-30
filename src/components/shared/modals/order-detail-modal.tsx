import React, { useEffect, useState } from 'react';
import type { Order } from '../../../types';
import { formatPrice } from '../../../utils/formatPrice';
import { Api } from '../../../api';
import { X, Loader2 } from 'lucide-react';
import { useBodyScrollLock } from '../../../hooks/useBodyScrollLock';
import { StatusMark } from '../../ui/status-mark';
import { OrderedItemCard } from '../ordered-item-card';
import { MapBlock } from '..';
import { getYandexMapLink } from '../../../utils/getYandexMapsLink';

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ open, onClose, orderId }) => {
  const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null);
  const [fetching, setFetching] = useState(false);
  const detail = fetchedOrder;

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFetching(true);
    setFetchedOrder(null);
    Api.orders
      .getById(orderId)
      .then(setFetchedOrder)
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [open, orderId]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 pb-16"
      onClick={() => {
        onClose();
        setFetchedOrder(null);
      }}
    >
      <div
        className="bg-surface rounded-xl p-5 w-full max-w-md max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-primary">Заказ #{orderId}</h3>
            {fetchedOrder && (
              <a
                className="inline-block text-sm text-muted bg-transparent border border-line rounded-lg px-2 py-0.5"
                href={`tg://user?id=${fetchedOrder.user.telegramId}`}
              >
                @{fetchedOrder.user.telegramUsername}
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              setFetchedOrder(null);
            }}
            className="p-1 border border-line rounded-lg text-muted cursor-pointer hover:text-body transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="animate-spin text-dim" />
          </div>
        ) : detail ? (
          <>
            <div className="flex flex-col gap-1 text-sm text-muted mb-4 pb-4 border-b border-line">
              <span>Дата: {detail.createdAt?.slice(0, 10)}</span>
              <span>Доставка: {detail.deliveryMethod === 'pickup' ? 'Самовывоз' : 'Доставка'}</span>
              {detail.deliveryTime && <span>Время: {detail.deliveryTime}</span>}
              <span>
                Статус: <StatusMark status={detail.status} />
              </span>
              {detail.address && (
                <div
                  onClick={() =>
                    window.open(
                      getYandexMapLink(detail.address!.lat, detail.address!.lng),
                      '_blank',
                      'noopener,noreferrer',
                    )
                  }
                  className="cursor-pointer underline hover:text-body transition-colors"
                >
                  Адрес:
                  {detail.address?.label}
                </div>
              )}
            </div>
            {detail.address && (detail.address!.lat !== 0 || detail.address!.lng !== 0) && (
              <div className="flex flex-col gap-1 text-sm text-muted mb-4 pb-4 border-b border-line">
                <MapBlock
                  lat={detail.address.lat}
                  lng={detail.address.lng}
                  markerTitle={detail.address.label}
                />
              </div>
            )}

            <div className="flex flex-col gap-2 mb-4">
              <h4 className="text-sm font-semibold text-body">Товары</h4>
              {detail.items.map((item) => (
                <OrderedItemCard key={item.id} item={item} />
              ))}
            </div>

            {detail.comment && (
              <div className="text-sm text-muted mb-4 pb-4">
                <span className="font-semibold text-body">Комментарий:</span> {detail.comment}
              </div>
            )}

            <div className="flex justify-between text-base font-bold text-primary pt-3 border-t border-line">
              <span>Итого</span>
              <span>{formatPrice(detail.total)}</span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export { OrderDetailModal };
