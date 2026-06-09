import { create } from 'zustand';
import type { Product } from '../types';

interface ProductState {
  entities: Record<number, Product>;
  set: (products: Product[]) => void;
  setOne: (product: Product) => void;
  get: (id: number) => Product | undefined;
}

export const useProductStore = create<ProductState>()((set, get) => ({
  entities: {},

  set: (products) =>
    set((state) => {
      const next = { ...state.entities };
      for (const p of products) next[p.id] = p;
      return { entities: next };
    }),

  setOne: (product) =>
    set((state) => ({
      entities: { ...state.entities, [product.id]: product },
    })),

  get: (id) => get().entities[id],
}));
