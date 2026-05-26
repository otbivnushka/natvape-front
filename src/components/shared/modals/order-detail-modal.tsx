import React, { useEffect, useState } from 'react';
import type { Order } from '../../../types';
import { formatPrice } from '../../../utils/formatPrice';
import { Api } from '../../../api';
import { X, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const statusLabels: Record<string, string> = {
  sent: 'Отправлен',
  end: 'Завершён',
};

const statusStyles: Record<string, string> = {
  sent: 'bg-muted text-on-primary',
  end: 'bg-primary text-on-primary',
};

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ open, onClose, orderId }) => {
  const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null);
  const [fetching, setFetching] = useState(false);
  const detail = fetchedOrder;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
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
        className="bg-surface rounded-xl p-5 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-primary">Заказ #{orderId}</h3>
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
                Статус:{' '}
                <span
                  className={clsx(
                    'inline-block px-1.5 py-0.5 rounded-full text-[11px] font-semibold',
                    statusStyles[detail.status] || 'bg-surface text-primary border border-line',
                  )}
                >
                  {statusLabels[detail.status]}
                </span>
              </span>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <h4 className="text-sm font-semibold text-body">Товары</h4>
              {detail.items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-page rounded-lg p-2.5">
                  {item.productImage && (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover bg-surface shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-body truncate">{item.productName}</div>
                    {item.variantName && (
                      <div className="text-[12px] text-dim">{item.variantName}</div>
                    )}
                    <div className="text-[12px] text-muted mt-0.5">
                      {formatPrice(item.price)} × {item.quantity}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-body shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {detail.comment && (
              <div className="text-sm text-muted mb-4 pb-4 border-b border-line">
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
