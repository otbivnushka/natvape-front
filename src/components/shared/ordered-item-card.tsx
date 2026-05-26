import React from 'react';
import { formatPrice } from '../../utils/formatPrice';
import type { OrderItem } from '../../types';
import clsx from 'clsx';

interface OrderedItemCardProps {
  item: OrderItem;
  className?: string;
}

const OrderedItemCard: React.FC<OrderedItemCardProps> = ({ item, className }) => {
  return (
    <div className={clsx(className, 'flex gap-3 bg-page rounded-lg p-2.5')}>
      {item.productImage && (
        <img
          src={item.productImage}
          alt={item.productName}
          className="w-10 h-10 rounded-lg object-cover bg-surface shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-body truncate">{item.productName}</div>
        {item.variantName && <div className="text-[12px] text-dim">{item.variantName}</div>}
        <div className="text-[12px] text-muted mt-0.5">
          {formatPrice(item.price)} × {item.quantity}
        </div>
      </div>
      <div className="text-sm font-semibold text-body shrink-0">
        {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  );
};

export { OrderedItemCard };
