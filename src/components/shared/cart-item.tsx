import React from 'react';
import type { CartItem as CartItemType } from '@/types';
import { useRemoveFromCart, useUpdateCartQuantity } from '@/hooks/queries/useCartQuery';
import { formatPrice } from '@/utils/formatPrice';
import { calcCartItemTotal } from '@/utils/cartTotals';
import { X } from 'lucide-react';
import { QuantityStepper, PriceDisplay } from '@/components/ui';

interface CartItemProps {
  item: CartItemType;
  allItems?: CartItemType[];
}

function getVariantStock(item: CartItemType): number {
  if (!item.variantKey) return Infinity;
  const v = item.product.variants?.find((x) => x.value === item.variantKey);
  if (v) return v.stock;
  const c = item.product.colors?.find((x) => x.name === item.variantKey);
  if (c) return c.stock;
  return Infinity;
}

const CartItem: React.FC<CartItemProps> = ({ item, allItems }) => {
  const removeMutation = useRemoveFromCart();
  const updateQtyMutation = useUpdateCartQuantity();
  const variantName = item.variantName ?? null;
  const maxQty = getVariantStock(item);

  return (
    <div className="flex gap-3 p-3 bg-surface rounded-xl items-center">
      <img
        className="w-18 h-18 rounded-lg object-cover bg-page shrink-0"
        src={item.product.image}
        alt={item.product.name}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-muted truncate">{item.product.name}</div>
        {variantName && <div className="text-[12px] text-dim mt-0.5">{variantName}</div>}
        <div className="mt-1">
          <PriceDisplay price={item.product.price} doublePrice={item.product.doublePrice} />
        </div>
        <div className="text-xs text-muted mt-0.5">
          Сумма: {formatPrice(calcCartItemTotal(item, allItems ?? []))}
        </div>
        <div className="mt-2">
          <QuantityStepper
            quantity={item.quantity}
            onDecrement={() =>
              updateQtyMutation.mutate({ itemId: item.id, quantity: item.quantity - 1 })
            }
            onIncrement={() =>
              updateQtyMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })
            }
            size="sm"
            max={maxQty}
          />
        </div>
      </div>
      <button
        className="bg-transparent border-none text-muted cursor-pointer p-1 ml-auto transition-colors duration-150 hover:text-primary"
        onClick={() => removeMutation.mutate(item.id)}
        aria-label="Удалить"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export { CartItem };
