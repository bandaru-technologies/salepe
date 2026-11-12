import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import { OrdersApi } from '../api/client';

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export default function Cart() {
  const { items, updateQuantity, removeItem, clear, totalAmount, totalItems } = useCart();
  const { phoneNumber } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!phoneNumber || items.length === 0) return;
    setError(null);
    setPlacing(true);
    try {
      const order = await OrdersApi.create({
        customerId: phoneNumber,
        items: items.map((it) => ({
          productId: it.productId,
          productName: it.productName,
          quantity: it.quantity,
          price: it.price,
        })),
      });
      clear();
      navigate(`/orders/${order.id}`, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to place order. Please try again.'));
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h2>Your Cart</h2>
        </div>
        <div className="empty-state">
          <span className="empty-state-icon">🛒</span>
          <h3>Your cart is empty</h3>
          <p>Go add something you love from the Shop!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Your Cart</h2>
          <p>{totalItems} item{totalItems === 1 ? '' : 's'} in your cart</p>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          {items.map((it) => (
            <div className="cart-row" key={it.productId}>
              <div className="cart-row-info">
                <strong>{it.productName}</strong>
                <span>₹{it.price.toFixed(2)} each</span>
              </div>
              <div className="cart-row-qty">
                <button type="button" onClick={() => updateQuantity(it.productId, it.quantity - 1)}>
                  -
                </button>
                <span>{it.quantity}</span>
                <button type="button" onClick={() => updateQuantity(it.productId, it.quantity + 1)}>
                  +
                </button>
              </div>
              <div className="cart-row-total">₹{(it.price * it.quantity).toFixed(2)}</div>
              <button type="button" className="link-btn" onClick={() => removeItem(it.productId)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="summary-card">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>

          {error && <p className="error">{error}</p>}

          <button className="btn btn-block" onClick={handleCheckout} disabled={placing}>
            {placing ? 'Placing order...' : 'Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
