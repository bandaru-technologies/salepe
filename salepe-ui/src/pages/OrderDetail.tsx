import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../api/config';
import type { Order } from '../types';

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    axios
      .get<Order>(`${API_BASE.order}/api/orders/${id}`)
      .then((r) => setOrder(r.data))
      .catch((err) => setError(extractErrorMessage(err, 'Failed to load order')))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading order...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      <div className="confirm-card">
        <div className="confirm-icon">🎉</div>
        <h2>Order Confirmed!</h2>
        <p>
          Order <strong>#{order.id.slice(0, 8)}</strong> has been placed and is{' '}
          <span className={`status-badge status-${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </p>
        <div className="confirm-summary">
          <ul className="order-card-items">
            {order.items.map((it) => (
              <li key={it.id}>
                {it.productName} × {it.quantity} — ₹{(it.price * it.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <div className="confirm-total">
            <span>Total</span>
            <span>₹{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
        <Link className="btn" to="/orders">
          View My Orders
        </Link>
      </div>
    </div>
  );
}
