export const ApiRoutes = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',

  CATEGORIES: '/categories',

  PRODUCTS: '/products',
  PRODUCT_BY_ID: '/products/:id',
  PRODUCTS_BRANDS: '/products/brands',

  CART: '/cart',
  CART_ITEM: '/cart/:id',

  WISHLIST: '/wishlist',
  WISHLIST_ITEM: '/wishlist/:productId',

  ORDERS: '/orders',
  ORDER_BY_ID: '/orders/:id',

  PROFILE: '/profile',

  ADDRESSES: '/addresses',
  ADDRESS_BY_ID: '/addresses/:id',
} as const;
