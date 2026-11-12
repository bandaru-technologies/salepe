import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-brand-name">
            <Logo size="md" />
          </div>
          <p>
            Your one-stop shop for everyday essentials and curated finds — quality
            products, fair prices, and a shopping experience that just works.
          </p>
        </div>

        <div className="footer-col">
          <h4>Help</h4>
          <a href="#contact">Contact Us</a>
          <a href="#shipping">Shipping Policy</a>
          <a href="#refund">Refund Policy</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>

        <div className="footer-col">
          <h4>Discover</h4>
          <a href="#about">About Us</a>
          <Link to="/orders">My Orders</Link>
          <Link to="/cart">My Cart</Link>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/shop">Shop</Link>
          <a href="#best-sellers">Best Sellers</a>
          <a href="#new-arrivals">New Arrivals</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {year} Salepe. All rights reserved.</span>
        <div className="footer-socials">
          <a href="#instagram" aria-label="Instagram">📷</a>
          <a href="#youtube" aria-label="YouTube">▶️</a>
          <a href="#whatsapp" aria-label="WhatsApp">💬</a>
        </div>
      </div>
    </footer>
  );
}
