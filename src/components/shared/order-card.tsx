import React from 'react';
import type { Order } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import clsx from 'clsx';

const statusLabels: Record<string, string> = {
  delivered: 'Доставлен',
  shipping: 'Доставка',
  processing: 'Обработка',
};

const statusStyles: Record<string, string> = {
  delivered: 'bg-primary text-on-primary',
  shipping: 'bg-surface text-primary border border-line',
  processing: 'bg-muted text-on-primary',
};

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="bg-surface rounded-xl p-3.5 mb-2.5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[13px] font-semibold text-muted">Заказ #{order.id}</span>
        <span className="text-xs text-muted">
          {order.date || order.createdAt?.slice(0, 10)}
        </span>
      </div>
      <span
        className={clsx(
          'inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold',
          statusStyles[order.status] || 'bg-surface text-primary border border-line',
        )}
      >
        {statusLabels[order.status]}
      </span>
      <div className="text-sm font-semibold text-primary mt-1.5">
        {formatPrice(order.total)}
      </div>
    </div>
  );
};

export { OrderCard };
