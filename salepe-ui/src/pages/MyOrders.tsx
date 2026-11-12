import { useEffect, useState } from 'react';
import axios from 'axios';
import { OrdersApi } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import type { Order } from '../types';

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export default function MyOrders() {
  const { phoneNumber } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!phoneNumber) return;
    OrdersApi.listByCustomer(phoneNumber)
      .then((data) =>
        setOrders([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
      )
      .catch((err) => setError(extractErrorMessage(err, 'Failed to load orders')))
      .finally(() => setLoading(false));
  }, [phoneNumber]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;

  if (orders.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h2>My Orders</h2>
        </div>
        <div className="empty-state">
          <span className="empty-state-icon">📦</span>
          <h3>No orders yet</h3>
          <p>You haven't placed any orders yet. Start shopping to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>My Orders</h2>
          <p>{orders.length} order{orders.length === 1 ? '' : 's'} placed</p>
        </div>
      </div>
      <div className="orders-list">
        {orders.map((o) => (
          <div className="order-card" key={o.id}>
            <div className="order-card-header">
              <span className="order-id">#{o.id.slice(0, 8)}</span>
              <span className={`status-badge status-${o.status.toLowerCase()}`}>{o.status}</span>
            </div>
            <ul className="order-card-items">
              {o.items.map((it) => (
                <li key={it.id}>
                  {it.productName} × {it.quantity}
                </li>
              ))}
            </ul>
            <div className="order-card-footer">
              <span>{new Date(o.createdAt).toLocaleString()}</span>
              <strong>₹{o.totalAmount.toFixed(2)}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
