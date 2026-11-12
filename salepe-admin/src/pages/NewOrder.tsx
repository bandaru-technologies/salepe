import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { OrdersApi } from '../api/client';

interface ItemFormState {
  productId: string;
  productName: string;
  quantity: string;
  price: string;
}

const emptyItem = (): ItemFormState => ({
  productId: '',
  productName: '',
  quantity: '1',
  price: '',
});

export default function NewOrder() {
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<ItemFormState[]>([emptyItem()]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const updateItem = (index: number, field: keyof ItemFormState, value: string) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: value } : it))
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        customerId,
        items: items.map((it) => ({
          productId: it.productId,
          productName: it.productName,
          quantity: Number(it.quantity),
          price: Number(it.price),
        })),
      };
      const order = await OrdersApi.create(payload);
      navigate(`/orders/${order.id}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to place order');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Place New Order</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Customer ID
          <input
            required
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
        </label>

        <h3>Items</h3>
        {items.map((item, idx) => (
          <div className="item-row" key={idx}>
            <input
              placeholder="Product ID"
              required
              value={item.productId}
              onChange={(e) => updateItem(idx, 'productId', e.target.value)}
            />
            <input
              placeholder="Product Name"
              required
              value={item.productName}
              onChange={(e) => updateItem(idx, 'productName', e.target.value)}
            />
            <input
              type="number"
              min="1"
              placeholder="Qty"
              required
              value={item.quantity}
              onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Price"
              required
              value={item.price}
              onChange={(e) => updateItem(idx, 'price', e.target.value)}
            />
            {items.length > 1 && (
              <button type="button" onClick={() => removeItem(idx)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addItem}>+ Add Item</button>

        {error && <p className="error">{error}</p>}

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Placing order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
