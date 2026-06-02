import React, { useEffect, useState } from 'react';
import { PrimaryButton, QuantityStepper } from '../ui';
import type { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';

interface AddProductWidgetProps {
  product: Product;
  selected: string | null;
}

const AddProductWidget: React.FC<AddProductWidgetProps> = ({ product, selected }) => {
  const addToast = useToastStore((s) => s.addToast);

  const cartItems = useCartStore.getState().items;
  const hasVariants = product.variants && product.variants.length > 0;
  const hasColors = product.colors && product.colors.length > 0;
  const canAdd = hasVariants ? selected !== '' : hasColors ? selected !== null : true;

  const variantStock = hasVariants
    ? (() => {
        const v = product.variants!.find((v) => v.value === selected);
        if (!v) return 0;
        const ci = cartItems.find((i) => i.product.id === product.id && i.variantKey === v.value);
        return v.stock - (ci?.quantity ?? 0);
      })()
    : hasColors
      ? (() => {
          const c = product.colors!.find((c) => c.name === selected);
          if (!selected) return 0;
          const ci = cartItems.find(
            (i) => i.product.id === product.id && i.variantKey === selected,
          );
          return c!.stock - (ci?.quantity ?? 0);
        })()
      : 0;

  const maxQuantity = canAdd ? variantStock : 0;
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore((s) => s);

  const handleAddToCart = () => {
    const variantKey = selected || undefined;
    if (!variantKey && !canAdd) return;
    addToCart(product.id, variantKey, quantity);
    const label = selected ? product.variants?.find((v) => v.value === selected)?.name : selected;
    addToast(`${product.name}${label ? ` — ${label}` : ''} добавлен в корзину (${quantity} шт.)`);
  };
  const increment = () => setQuantity((q) => Math.min(q + 1, maxQuantity!));
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  useEffect(() => {
    const newQuantity = (variantStock < quantity ? variantStock : quantity) || 1;
    setQuantity(newQuantity);
  }, [selected, variantStock]);
  useEffect(() => {
    console.log(quantity);
  });
  return (
    <div className="bg-surface rounded-xl p-4 lg:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-muted">
          {canAdd ? (
            <>
              Количество:{' '}
              <span className="text-[11px] font-normal text-dim">(доступно {maxQuantity})</span>
            </>
          ) : (
            <>Количество</>
          )}
        </div>
        <QuantityStepper
          quantity={quantity}
          onDecrement={decrement}
          onIncrement={increment}
          max={maxQuantity}
        />
      </div>

      <PrimaryButton onClick={handleAddToCart} disabled={!canAdd || maxQuantity === 0}>
        {!canAdd ? 'Выберите вариант' : `В корзину — ${quantity} шт.`}
      </PrimaryButton>
    </div>
  );
};

export { AddProductWidget };
