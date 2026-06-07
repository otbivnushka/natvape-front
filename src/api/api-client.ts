import * as auth from './requests/auth';
import * as categories from './requests/categories';
import * as products from './requests/products';
import * as cart from './requests/cart';
import * as wishlist from './requests/wishlist';
import * as orders from './requests/orders';
import * as profile from './requests/profile';
import * as addresses from './requests/addresses';
import * as admin from './requests/admin';
import * as images from './requests/images';
import * as rates from './requests/rates';
import * as stories from './requests/stories';
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
  rates,
  stories,
  productCache,
};
