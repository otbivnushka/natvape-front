import React from 'react';
import type { CartItem } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { OrderSummaryItem } from './order-summary-item';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  deliveryFee?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, total, deliveryFee }) => {
  return (
    <div className="mb-5 p-4 bg-surface rounded-xl">
      <h2 className="text-sm font-semibold text-muted mb-3">Ваш заказ</h2>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <OrderSummaryItem key={`${item.product.id}:${item.variantKey ?? ''}`} item={item} />
        ))}
      </div>
      {deliveryFee ? (
        <div className="flex justify-between text-sm text-muted mt-2">
          <span>Доставка</span>
          <span>+{formatPrice(deliveryFee)}</span>
        </div>
      ) : null}
      <div className="flex justify-between text-base font-semibold text-body mt-3 pt-3 border-t border-line">
        <span>Итого</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
};

export { OrderSummary };
