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
import { BottomNav } from './components/shared';
import { ToastContainer } from './components/ui';
import { useEffect } from 'react';

declare global {
  interface Window {
    Telegram: any;
  }
}

function App() {
  useEffect(() => {
    const tg = window.Telegram.WebApp;

    fetch('https://r1n60fhm-3000.euw.devtunnels.ms/api/auth/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        initData: tg.initData,
      }),
    });
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
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/products/:id" element={<AdminProduct />} />
        </Routes>
        <BottomNav />
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
