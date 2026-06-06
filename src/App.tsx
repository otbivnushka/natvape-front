import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BottomNav } from '@/components/shared';
import { ToastContainer } from '@/components/ui';
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton';
import { useInit } from '@/hooks/useInit';
import {
  Admin,
  AdminOrderPage,
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
import { HelmetProvider } from 'react-helmet-async';

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
        <Route path="/admin/stories/new" element={<AdminStory />} />
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
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
