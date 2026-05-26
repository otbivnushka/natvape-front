import React, { useState } from 'react';
import type { Order } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { Info } from 'lucide-react';
import clsx from 'clsx';
import { OrderDetailModal } from './modals';

const statusLabels: Record<string, string> = {
  sent: 'Отправлен',
  end: 'Завершён',
};

const statusStyles: Record<string, string> = {
  sent: 'bg-muted text-on-primary',
  end: 'bg-primary text-on-primary',
};

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-surface rounded-xl p-3.5 mb-2.5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[13px] font-semibold text-muted">Заказ #{order.id}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">
              {order.createdAt?.slice(0, 10)}
            </span>
            <button
              onClick={() => setModalOpen(true)}
              className="p-1 rounded-full text-dim cursor-pointer hover:text-body transition-colors"
              aria-label="Подробнее"
            >
              <Info size={14} />
            </button>
          </div>
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

      <OrderDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        orderId={order.id}
      />
    </>
  );
};

export { OrderCard };
