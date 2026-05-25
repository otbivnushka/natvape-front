import type { Product } from '../types';

const cache = new Map<number, Product>();

export const productCache = {
  set: (products: Product[]) => {
    for (const p of products) cache.set(p.id, p);
  },
  setOne: (product: Product) => cache.set(product.id, product),
  get: (id: number): Product | undefined => cache.get(id),
  clear: () => cache.clear(),
};
