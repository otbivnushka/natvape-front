import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Catalog from './pages/catalog';
import CategoryProducts from './pages/category-products';
import ProductDetail from './pages/product-detail';
import Cart from './pages/cart';
import Checkout from './pages/checkout';
import Wishlist from './pages/wishlist';
import Profile from './pages/profile';
import { BottomNav } from './components/shared';
import { ToastContainer } from './components/ui';

function App() {
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
        </Routes>
        <BottomNav />
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
