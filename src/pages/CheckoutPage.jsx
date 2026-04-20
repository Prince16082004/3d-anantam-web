import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Lock, ArrowRight, Ticket } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Page.css';

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart, appliedCoupon, getDiscountAmount } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setLoading(true);
    setError('');

    try {
      // SECURE: Only send product_id & quantity — server recalculates price
      const orderData = {
        customer_name: formData.name,
        customer_email: formData.email,
        address: formData.address,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
          // price is NOT sent — backend fetches it from DB
        })),
        couponCode: appliedCoupon?.code
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to place order');

      clearCart();
      setOrderId(data.orderId);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Must be logged in
  if (!user) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
        <Lock size={48} color="var(--color-brand-primary)" />
        <h2>Sign in to Checkout</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>You need to be logged in to place an order.</p>
        <Link to="/login" className="btn-primary shadow-glow">Sign In</Link>
      </div>
    );
  }

  if (cart.length === 0 && !success) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
        <h2>Your cart is empty.</h2>
        <button className="btn-primary" onClick={() => navigate('/products')}>Explore Shop</button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '10px' }}>
        <CheckCircle size={72} color="var(--color-brand-primary)" strokeWidth={1.5} />
        <h1 style={{ marginTop: '10px' }}>Order #{orderId} Confirmed!</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px', textAlign: 'center', maxWidth: '400px' }}>
          Thank you, {formData.name}! We'll start printing your items right away. You'll receive updates at {formData.email}.
        </p>
        <button className="btn-primary shadow-glow" onClick={() => navigate('/')}>
          Return Home <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form glass-panel" onSubmit={handleSubmit}>
          <h2>Shipping Information</h2>
          {error && <div className="error-banner">{error}</div>}
          <div className="form-group">
            <label>Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label>Delivery Address</label>
            <textarea required rows="3" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="123 Tech Street, Pune, Maharashtra" />
          </div>

          <div className="secure-badge">
            <Lock size={14} /> Secure checkout — prices verified server-side
          </div>

          <button type="submit" className="btn-primary w-full shadow-glow" disabled={loading}>
            {loading ? 'Placing Order...' : `Place Order — $${getCartTotal().toFixed(2)}`}
          </button>
        </form>

        <div className="checkout-summary">
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ marginBottom: '20px' }}>Order Summary</h3>
            {cart.map(item => (
              <div key={item.product_id} className="checkout-item-row">
                <span>{item.quantity}× {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-divider"></div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${getCartTotal(false).toFixed(2)}</span>
            </div>
            {appliedCoupon && (
              <div className="summary-row" style={{ color: 'var(--color-primary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Ticket size={14} /> Coupon ({appliedCoupon.code})</span>
                <span>-${getDiscountAmount().toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>${getCartTotal(true).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
