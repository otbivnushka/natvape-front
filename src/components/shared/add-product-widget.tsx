import React, { useState } from 'react';
import { PrimaryButton, QuantityStepper } from '@/components/ui';
import type { Product, CartItem } from '@/types';
import { useCart, useAddToCart } from '@/hooks/queries/useCartQuery';
import { useToastStore } from '@/store/useToastStore';

interface AddProductWidgetProps {
  product: Product;
  selected: string | null;
}

const AddProductWidget: React.FC<AddProductWidgetProps> = ({ product, selected }) => {
  const addToast = useToastStore((s) => s.addToast);
  const { data: cartItems = [] } = useCart();
  const addToCart = useAddToCart();

  const hasVariants = product.variants && product.variants.length > 0;
  const hasColors = product.colors && product.colors.length > 0;
  const canAdd = hasVariants ? selected !== '' : hasColors ? selected !== null : true;

  const variantStock = hasVariants
    ? (() => {
        const v = product.variants!.find((v) => v.value === selected);
        if (!v) return 0;
        const ci = cartItems.find(
          (i: CartItem) => i.product.id === product.id && i.variantKey === v.value,
        );
        return v.stock - (ci?.quantity ?? 0);
      })()
    : hasColors
      ? (() => {
          const c = product.colors!.find((c) => c.name === selected);
          if (!c || !selected) return 0;
          const ci = cartItems.find(
            (i: CartItem) => i.product.id === product.id && i.variantKey === c.hex,
          );
          return c.stock - (ci?.quantity ?? 0);
        })()
      : 0;

  const maxQuantity = canAdd ? variantStock : 0;
  const [quantity, setQuantity] = useState(1);

  const effectiveQuantity = maxQuantity > 0 && quantity > maxQuantity ? maxQuantity : quantity;

  const handleAddToCart = () => {
    if (!selected && !canAdd) return;

    let variantKey: string | undefined;
    let variantName: string | undefined;

    if (hasVariants && selected) {
      const v = product.variants!.find((v) => v.value === selected);
      variantKey = v?.value;
      variantName = v?.name;
    } else if (hasColors && selected) {
      const c = product.colors!.find((c) => c.name === selected);
      variantKey = c?.hex;
      variantName = c?.name;
    }

    addToCart.mutate({ productId: product.id, variantKey, variantName, quantity: effectiveQuantity });
    const label = variantName;
    addToast(
      `${product.name}${label ? ` — ${label}` : ''} добавлен в корзину (${effectiveQuantity} шт.)`,
    );
  };
  const increment = () => setQuantity((q) => Math.min(q + 1, maxQuantity!));
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

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
          quantity={effectiveQuantity}
          onDecrement={decrement}
          onIncrement={increment}
          max={maxQuantity}
        />
      </div>

      <PrimaryButton onClick={handleAddToCart} disabled={!canAdd || maxQuantity === 0}>
        {!canAdd ? 'Выберите вариант' : `В корзину — ${effectiveQuantity} шт.`}
      </PrimaryButton>
    </div>
  );
};

export { AddProductWidget };
