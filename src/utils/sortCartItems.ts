import type { CartItem } from '../types';

export function sortCartItems(items: CartItem[]): CartItem[] {
  return [...items].sort((a, b) => b.id - a.id);
}
