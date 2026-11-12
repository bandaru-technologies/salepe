import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import OrdersList from './pages/OrdersList';
import NewOrder from './pages/NewOrder';
import OrderDetail from './pages/OrderDetail';
import Analytics from './pages/Analytics';
import Products from './pages/Products';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './auth/AuthContext';
import './App.css';

function initials(phone: string | null): string {
  if (!phone) return '?';
  return phone.slice(-2);
}

function Shell({ children }: { children: ReactNode }) {
  const { phoneNumber, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark">B</span>
          <span className="brand-name">Bandaru</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/orders" className="sidebar-link" end>
            <span className="sidebar-icon">📦</span> Orders
          </NavLink>
          <NavLink to="/products" className="sidebar-link">
            <span className="sidebar-icon">🛍️</span> Products
          </NavLink>
          <NavLink to="/analytics" className="sidebar-link">
            <span className="sidebar-icon">📊</span> Analytics
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">
            <span className="avatar">{initials(phoneNumber)}</span>
            <span className="user-phone">{phoneNumber}</span>
          </div>
          <button className="btn btn-ghost btn-block" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Shell><OrdersList /></Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Shell><OrdersList /></Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/new"
            element={
              <ProtectedRoute>
                <Shell><NewOrder /></Shell>
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
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Shell><Analytics /></Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Shell><Products /></Shell>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
