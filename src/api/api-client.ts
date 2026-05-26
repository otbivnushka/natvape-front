import * as auth from './auth';
import * as categories from './categories';
import * as products from './products';
import * as cart from './cart';
import * as wishlist from './wishlist';
import * as orders from './orders';
import * as profile from './profile';
import * as addresses from './addresses';
import * as admin from './admin';
import * as images from './images';
import { productCache } from './product-cache';

export const Api = {
  auth,
  categories,
  products,
  cart,
  wishlist,
  orders,
  profile,
  addresses,
  admin,
  images,
  productCache,
};
