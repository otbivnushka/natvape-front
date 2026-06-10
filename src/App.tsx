import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BottomNav } from '@/components/shared';
import { ToastContainer } from '@/components/ui';
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton';
import { useInit } from '@/hooks/useInit';
import { useAuthStore } from '@/store/useAuthStore';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/hooks/queries/queryKeys';
import {
  Admin,
  AdminOrderPage,
  AdminPickup,
  AdminProduct,
  AdminStory,
  Cart,
  Catalog,
  CategoryProducts,
  Checkout,
  ProductDetail,
  Profile,
  Wishlist,
} from '@/components/pages';

function AuthSync() {
  useEffect(() => {
    const unsub = useAuthStore.subscribe((state, prev) => {
      if (state.token && !prev?.token) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      }
    });
    return () => unsub();
  }, []);

  return null;
}

function AppContent() {
  useTelegramBackButton();

  return (
    <div className="min-h-screen bg-page">
      <AuthSync />
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/category/:category" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/:tab?" element={<Admin />} />
        <Route path="/admin/stories/new" element={<AdminStory />} />
        <Route path="/admin/pickups/new" element={<AdminPickup />} />
        <Route path="/admin/products/:id" element={<AdminProduct />} />
        <Route path="/admin/order/:id" element={<AdminOrderPage />} />
      </Routes>
      <BottomNav />
      <ToastContainer />
    </div>
  );
}

function App() {
  useInit();

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
