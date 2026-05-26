import type { CartItem } from '../types';

export function getCartItemTotal(
  item: CartItem,
  allItems: CartItem[],
): number {
  const { price, doublePrice } = item.product;

  if (doublePrice == null) {
    return price * item.quantity;
  }

  const sameProduct = allItems.filter(
    (i) => i.product.id === item.product.id,
  );
  const totalQty = sameProduct.reduce((s, i) => s + i.quantity, 0);

  let priorQty = 0;
  for (const i of sameProduct) {
    if (i.id === item.id) break;
    priorQty += i.quantity;
  }

  const pairUnits = Math.floor(totalQty / 2) * 2;
  const itemInPairs = Math.max(
    0,
    Math.min(item.quantity, pairUnits - priorQty),
  );
  const itemAlone = item.quantity - itemInPairs;

  return (itemInPairs / 2) * doublePrice + itemAlone * price;
}
