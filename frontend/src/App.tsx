import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Home from './pages/Home';
import CategoryPage from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Search from './pages/Search';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ProductManager from './admin/ProductManager';
import CategoryManager from './admin/CategoryManager';
import OrderManager from './admin/OrderManager';

function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <CartSidebar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Store Routes */}
          <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
          <Route path="/categoria/:slug" element={<StoreLayout><CategoryPage /></StoreLayout>} />
          <Route path="/producto/:slug" element={<StoreLayout><ProductDetail /></StoreLayout>} />
          <Route path="/buscar" element={<StoreLayout><Search /></StoreLayout>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="productos" element={<ProductManager />} />
            <Route path="categorias" element={<CategoryManager />} />
            <Route path="pedidos" element={<OrderManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
