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
import AdminStory from './pages/admin-story';
import AdminOrderPage from './pages/admin-order';
import { BottomNav } from './components/shared';
import { ToastContainer } from './components/ui';
import { useEffect } from 'react';
import { useThemeStore } from './store/useThemeStore';
import { initAuthInterceptor } from './api/instance';
import { useAuthStore } from './store/useAuthStore';
import { retrieveRawInitData } from '@telegram-apps/sdk';
import { useTelegramBackButton } from './hooks/useTelegramBackButton';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Telegram: any;
  }
}

function AppContent() {
  useTelegramBackButton();

  return (
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
        <Route path="/admin/stories/:id" element={<AdminStory />} />
        <Route path="/admin/order/:id" element={<AdminOrderPage />} />
      </Routes>
      <BottomNav />
      <ToastContainer />
    </div>
  );
}

function App() {
  useEffect(() => {
    if (useAuthStore.getState().token === null) {
      try {
        const initData = retrieveRawInitData();
        if (initData) {
          useAuthStore
            .getState()
            .telegramAuth(initData)
            .catch(() => {});
        }
      } catch {
        // not in Telegram
      }
    }
    initAuthInterceptor(() => useAuthStore.getState().token);
  }, []);

  useEffect(() => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.enableClosingConfirmation();
        if (tg.colorScheme) {
          useThemeStore.getState().setTheme(tg.colorScheme);
        }
      }
    } catch {
      // not in Telegram WebApp
    }
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
