import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ProductsApi } from '../api/client';
import { useCart } from '../cart/CartContext';
import type { Product } from '../types';

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

const BEST_SELLERS_COUNT = 4;

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const { addItem } = useCart();
  const allProductsRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    ProductsApi.list()
      .then(setProducts)
      .catch((err) => setError(extractErrorMessage(err, 'Failed to load products')))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (category) {
      setQuery(category);
      allProductsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [category]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q)
    );
  }, [products, query]);

  const bestSellers = useMemo(() => products.slice(0, BEST_SELLERS_COUNT), [products]);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId((cur) => (cur === product.id ? null : cur)), 1200);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((cur) => {
      const next = new Set(cur);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const scrollToAllProducts = () => {
    allProductsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderProductCard = (p: Product) => (
    <div className="product-card" key={p.id}>
      <div className="product-image">
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.name} />
        ) : (
          <div className="product-image-placeholder">🛍️</div>
        )}
        {p.stock > 0 && p.stock <= 5 && (
          <span className="product-stock-tag">Only {p.stock} left</span>
        )}
        <button
          type="button"
          className={`wishlist-btn${wishlist.has(p.id) ? ' liked' : ''}`}
          onClick={() => toggleWishlist(p.id)}
          aria-label={wishlist.has(p.id) ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlist.has(p.id) ? '❤️' : '🤍'}
        </button>
        {p.stock > 0 && (
          <button
            type="button"
            className="quick-add-btn"
            onClick={() => handleAddToCart(p)}
          >
            {addedId === p.id ? 'Added ✓' : 'Quick Add'}
          </button>
        )}
      </div>
      <div className="product-info">
        <h3>{p.name}</h3>
        {p.description && <p className="product-desc">{p.description}</p>}
        <div className="product-footer">
          <div className="product-price-block">
            <span className="product-price">₹{p.price.toFixed(2)}</span>
            <span className="product-stock">
              {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <button
            type="button"
            className={`add-btn${addedId === p.id ? ' added' : ''}`}
            disabled={p.stock <= 0}
            onClick={() => handleAddToCart(p)}
            aria-label={`Add ${p.name} to cart`}
          >
            {addedId === p.id ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {!loading && !error && bestSellers.length > 0 && (
        <section className="best-sellers">
          <div className="page-header">
            <div>
              <h2>Best Sellers</h2>
              <p>Our most popular picks, handpicked for you</p>
            </div>
          </div>
          <div className="product-grid">{bestSellers.map(renderProductCard)}</div>
          <div className="view-all-wrap">
            <button className="btn btn-ghost" onClick={scrollToAllProducts}>
              View All
            </button>
          </div>
        </section>
      )}

      <div className="page-header" ref={allProductsRef}>
        <div>
          <h2>Shop</h2>
          <p>{products.length} product{products.length === 1 ? '' : 's'} available</p>
          {category && (
            <span className="active-category-chip">
              {category}
              <button
                type="button"
                aria-label="Clear category filter"
                onClick={() => {
                  setSearchParams({});
                  setQuery('');
                }}
              >
                ✕
              </button>
            </span>
          )}
        </div>
        <div className="search-bar">
          <span className="search-bar-icon">🔍</span>
          <input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon">🛍️</span>
          <h3>{products.length === 0 ? 'No products available yet' : 'No matches found'}</h3>
          <p>
            {products.length === 0
              ? 'Check back soon for new arrivals!'
              : 'Try a different search term.'}
          </p>
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="product-grid">{filteredProducts.map(renderProductCard)}</div>
      )}
    </div>
  );
}
