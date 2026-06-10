import React from 'react';
import type { CartItem } from '@/types';

interface OrderSummaryItemProps {
  item: CartItem;
}

const OrderSummaryItem: React.FC<OrderSummaryItemProps> = ({ item }) => {
  return (
    <div className="flex justify-between text-[13px]">
      <span className="text-muted truncate mr-2">
        {item.product.name}
        {item.variantName && <span className="text-dim"> ({item.variantName})</span>}
        <span className="text-dim"> × {item.quantity}</span>
      </span>
      <span className="text-body font-medium whitespace-nowrap">{item.quantity} шт.</span>
    </div>
  );
};

export { OrderSummaryItem };
