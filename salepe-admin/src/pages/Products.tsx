import { useEffect, useState, type FormEvent } from 'react';
import axios from 'axios';
import { ProductsApi } from '../api/client';
import type { Product } from '../types';

interface FormState {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  stock: string;
}

const emptyForm = (): FormState => ({
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  stock: '1',
});

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    ProductsApi.list()
      .then(setProducts)
      .catch((err) => setError(extractErrorMessage(err, 'Failed to load products')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const updateField = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await ProductsApi.create({
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        imageUrl: form.imageUrl || undefined,
        stock: Number(form.stock),
      });
      setForm(emptyForm());
      loadProducts();
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to create product'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Products</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Name
          <input
            required
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
        </label>
        <label>
          Description
          <input
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </label>
        <div className="item-row">
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Price"
            required
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
          />
          <input
            type="number"
            min="0"
            placeholder="Stock"
            required
            value={form.stock}
            onChange={(e) => updateField('stock', e.target.value)}
          />
          <input
            placeholder="Image URL (optional)"
            value={form.imageUrl}
            onChange={(e) => updateField('imageUrl', e.target.value)}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Product'}
        </button>
      </form>

      <h3>Catalog</h3>
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products yet. Add one above.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>₹{p.price.toFixed(2)}</td>
                <td>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
