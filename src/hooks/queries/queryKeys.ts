import type { ProductsQuery } from '@/api/dto/product.dto';

export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: ProductsQuery) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  cart: {
    all: ['cart'] as const,
  },
  wishlist: {
    all: ['wishlist'] as const,
  },
  orders: {
    all: ['orders'] as const,
    sent: () => [...queryKeys.orders.all, 'sent'] as const,
  },
  addresses: {
    all: ['addresses'] as const,
    pickups: () => [...queryKeys.addresses.all, 'pickup'] as const,
  },
  stories: {
    all: ['stories'] as const,
  },
  rates: {
    detail: (userId: number, productId: number) => ['rates', userId, productId] as const,
  },
};
