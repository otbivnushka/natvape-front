import React from 'react';
import type { CartItem as CartItemType } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../utils/formatPrice';
import { calcCartItemTotal } from '../../utils/cartTotals';
import { X } from 'lucide-react';
import { QuantityStepper, PriceDisplay } from '../ui';

interface CartItemProps {
  item: CartItemType;
}

function getVariantName(item: CartItemType): string | null {
  if (!item.variantKey) return null;
  const v = item.product.variants?.find((x) => x.value === item.variantKey);
  if (v) return v.name;
  const c = item.product.colors?.find((x) => x.name === item.variantKey);
  if (c) return c.name;
  return null;
}

function getVariantStock(item: CartItemType): number {
  if (!item.variantKey) return Infinity;
  const v = item.product.variants?.find((x) => x.value === item.variantKey);
  if (v) return v.stock;
  const c = item.product.colors?.find((x) => x.name === item.variantKey);
  if (c) return c.stock;
  return Infinity;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { increaseQty, decreaseQty, removeFromCart } = useCartStore();
  const items = useCartStore((s) => s.items);
  const variantName = getVariantName(item);
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
          Сумма: {formatPrice(calcCartItemTotal(item, items))}
        </div>
        <div className="mt-2">
          <QuantityStepper
            quantity={item.quantity}
            onDecrement={() => decreaseQty(item.id)}
            onIncrement={() => increaseQty(item.id)}
            size="sm"
            max={maxQty}
          />
        </div>
      </div>
      <button
        className="bg-transparent border-none text-muted cursor-pointer p-1 ml-auto transition-colors duration-150 hover:text-primary"
        onClick={() => removeFromCart(item.id)}
        aria-label="Удалить"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export { CartItem };
