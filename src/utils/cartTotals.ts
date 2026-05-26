import type { CartItem } from '../types';

export function calcProductGroupTotal(
  price: number,
  doublePrice: number | null,
  quantity: number,
): number {
  if (doublePrice == null) return price * quantity;
  const pairs = Math.floor(quantity / 2);
  const remaining = quantity % 2;
  return pairs * doublePrice + remaining * price;
}

export function calcCartSubtotal(items: CartItem[]): number {
  const groups = new Map<number, { price: number; doublePrice: number | null; qty: number }>();
  for (const item of items) {
    const prev = groups.get(item.product.id);
    if (prev) {
      prev.qty += item.quantity;
    } else {
      groups.set(item.product.id, {
        price: item.product.price ?? 0,
        doublePrice: item.product.doublePrice ?? null,
        qty: item.quantity,
      });
    }
  }
  let total = 0;
  for (const { price, doublePrice, qty } of groups.values()) {
    total += calcProductGroupTotal(price, doublePrice, qty);
  }
  return total;
}

export function calcCartItemTotal(
  item: CartItem,
  allItems: CartItem[],
): number {
  const { price, doublePrice } = item.product;
  if (doublePrice == null) return price * item.quantity;

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
  const itemInPairs = Math.max(0, Math.min(item.quantity, pairUnits - priorQty));
  const itemAlone = item.quantity - itemInPairs;

  return (itemInPairs / 2) * doublePrice + itemAlone * price;
}
