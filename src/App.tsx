import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Catalog from './pages/catalog';
import CategoryProducts from './pages/category-products';
import ProductDetail from './pages/product-detail';
import Cart from './pages/cart';
import Checkout from './pages/checkout';
import Wishlist from './pages/wishlist';
import Profile from './pages/profile';
import Admin from './pages/admin';
import AdminProduct from './pages/admin-product';
import AdminOrderPage from './pages/admin-order';
import { BottomNav } from './components/shared';
import { ToastContainer } from './components/ui';
import { useEffect } from 'react';
import { useThemeStore } from './store/useThemeStore';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Telegram: any;
  }
}

function App() {
  useEffect(() => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg?.colorScheme) {
        useThemeStore.getState().setTheme(tg.colorScheme);
      }
    } catch {
      // not in Telegram WebApp
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-page">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/category/:category" element={<CategoryProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/:tab?" element={<Admin />} />
          <Route path="/admin/products/:id" element={<AdminProduct />} />
          <Route path="/admin/order/:id" element={<AdminOrderPage />} />
        </Routes>
        <BottomNav />
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
