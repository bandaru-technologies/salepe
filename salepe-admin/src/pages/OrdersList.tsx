import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OrdersApi } from '../api/client';
import type { Order } from '../types';

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    OrdersApi.list()
      .then(setOrders)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error">Failed to load orders: {error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Orders</h2>
        <Link className="btn" to="/orders/new">+ New Order</Link>
      </div>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>
                  <Link to={`/orders/${o.id}`}>{o.id.slice(0, 8)}...</Link>
                </td>
                <td>{o.customerId}</td>
                <td>
                  <span className={`status status-${o.status.toLowerCase()}`}>{o.status}</span>
                </td>
                <td>${Number(o.totalAmount).toFixed(2)}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
