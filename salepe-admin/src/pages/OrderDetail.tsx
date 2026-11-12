import { useParams, Link } from 'react-router-dom';
import { OrdersApi, PaymentsApi, ShipmentsApi } from '../api/client';
import { useSafeFetch } from '../api/useSafeFetch';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const orderId = id!;

  const { data: order, status: orderStatus } = useSafeFetch(
    () => OrdersApi.get(orderId),
    [orderId]
  );
  const { data: payment, status: paymentStatus } = useSafeFetch(
    () => PaymentsApi.getByOrderId(orderId),
    [orderId]
  );
  const { data: shipment, status: shipmentStatus } = useSafeFetch(
    () => ShipmentsApi.getByOrderId(orderId),
    [orderId]
  );

  if (orderStatus === 'loading') return <p>Loading order...</p>;
  if (orderStatus === 'error') return <p className="error">Failed to load order.</p>;
  if (orderStatus === 'missing' || !order) return <p className="error">Order not found.</p>;

  return (
    <div>
      <Link to="/orders">&larr; Back to orders</Link>
      <h2>Order {order.id}</h2>
      <p>
        <strong>Customer:</strong> {order.customerId} &nbsp;|&nbsp;
        <strong>Status:</strong>{' '}
        <span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span>
        &nbsp;|&nbsp;
        <strong>Total:</strong> ${Number(order.totalAmount).toFixed(2)} &nbsp;|&nbsp;
        <strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}
      </p>

      <h3>Items</h3>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id}>
              <td>{item.productName} ({item.productId})</td>
              <td>{item.quantity}</td>
              <td>${Number(item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="side-by-side">
        <div className="card">
          <h3>Payment</h3>
          {paymentStatus === 'loading' && <p>Checking...</p>}
          {paymentStatus === 'missing' && <p>Not processed yet.</p>}
          {paymentStatus === 'error' && <p className="error">Failed to load payment.</p>}
          {paymentStatus === 'ready' && payment && (
            <ul>
              <li>Status: {payment.status}</li>
              <li>Amount: ${Number(payment.amount).toFixed(2)}</li>
              <li>Processed: {new Date(payment.processedAt).toLocaleString()}</li>
            </ul>
          )}
        </div>

        <div className="card">
          <h3>Shipment</h3>
          {shipmentStatus === 'loading' && <p>Checking...</p>}
          {shipmentStatus === 'missing' && <p>Not created yet.</p>}
          {shipmentStatus === 'error' && <p className="error">Failed to load shipment.</p>}
          {shipmentStatus === 'ready' && shipment && (
            <ul>
              <li>Status: {shipment.status}</li>
              <li>Created: {new Date(shipment.createdAt).toLocaleString()}</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
