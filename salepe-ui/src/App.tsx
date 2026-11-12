import { BrowserRouter, Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import Logo from './components/Logo';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { CartProvider, useCart } from './cart/CartContext';
import './App.css';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports & Outdoors'];

function initials(phone: string | null): string {
  if (!phone) return '?';
  return phone.slice(-2);
}

function CategoriesDropdown() {
  return (
    <div className="navbar-dropdown">
      <button type="button" className="navbar-link navbar-dropdown-trigger">
        <span className="navbar-icon">🗂️</span> <span>Categories</span>
        <span className="dropdown-caret">▾</span>
      </button>
      <div className="navbar-dropdown-menu">
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            to={`/shop?category=${encodeURIComponent(category)}`}
            className="navbar-dropdown-item"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const { phoneNumber, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="shell">
      <header className="navbar">
        <NavLink to="/shop" className="navbar-brand">
          <Logo />
        </NavLink>
        <nav className="navbar-nav">
          <NavLink to="/shop" className="navbar-link" end>
            <span className="navbar-icon">🛍️</span> <span>Shop</span>
          </NavLink>
          <CategoriesDropdown />
          <NavLink to="/orders" className="navbar-link">
            <span className="navbar-icon">📦</span> <span>My Orders</span>
          </NavLink>
          <NavLink to="/cart" className="navbar-link">
            <span className="navbar-icon">🛒</span> <span>Cart</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </NavLink>
        </nav>
        <div className="navbar-spacer" />
        <div className="navbar-user">
          <span className="user-phone">{phoneNumber}</span>
          <span className="avatar">{initials(phoneNumber)}</span>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Shell><Shop /></Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/shop"
              element={
                <ProtectedRoute>
                  <Shell><Shop /></Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Shell><Cart /></Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Shell><MyOrders /></Shell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <Shell><OrderDetail /></Shell>
                </ProtectedRoute>
              }
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
