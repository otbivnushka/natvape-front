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

  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_BY_ID: '/admin/products/:id',
  ADMIN_VARIANTS: '/admin/products/:id/variants',
  ADMIN_VARIANT_BY_ID: '/admin/products/variants/:variantId',
  ADMIN_COLORS: '/admin/products/:id/colors',
  ADMIN_COLOR_BY_ID: '/admin/products/colors/:colorId',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_CATEGORY_BY_ID: '/admin/categories/:id',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ORDERS_SENT: '/admin/orders/sent',
  ADMIN_ORDER_STATUS: '/admin/orders/:id/status',
  ADMIN_ORDER_BY_ID: '/admin/orders/:id',

  IMAGES_UPLOAD: '/images/upload',
  IMAGES_BY_ID: '/images/:id',
} as const;
