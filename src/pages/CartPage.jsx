import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, Ticket, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Page.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, appliedCoupon, applyCoupon, removeCoupon, getDiscountAmount } = useCart();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (cart.length === 0) {
    return (
      <div className="page-container flex-center" style={{minHeight: '60vh', flexDirection: 'column'}}>
        <h2>Your Cart is Empty</h2>
        <p style={{color: 'var(--color-text-secondary)', marginBottom: '20px'}}>Looks like you haven't added any 3D parts yet.</p>
        <button className="btn-primary" onClick={() => navigate('/products')}>Explore Catalog</button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.product_id} className="cart-item glass-panel">
              <img src={item.image_url} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="price">${Number(item.price).toFixed(2)}</p>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}><Minus size={14}/></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}><Plus size={14}/></button>
                </div>
                <button className="btn-icon text-danger" onClick={() => removeFromCart(item.product_id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary glass-panel">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${getCartTotal(false).toFixed(2)}</span>
          </div>

          <div className="coupon-section" style={{ margin: '15px 0' }}>
            {!appliedCoupon ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Promo Code" 
                  className="input-field"
                  style={{ flex: 1, padding: '8px 12px', background: 'var(--color-bg-base)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                />
                <button 
                  className="btn-outline" 
                  style={{ padding: '8px 15px' }}
                  onClick={async () => {
                    const res = await applyCoupon(couponInput);
                    if (!res.success) setCouponError(res.msg);
                    else { setCouponError(''); setCouponInput(''); }
                  }}
                >Apply</button>
              </div>
            ) : (
              <div className="applied-coupon" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(88, 81, 219, 0.08)', padding: '10px 15px', borderRadius: '8px', border: '1px dashed var(--color-brand-primary)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Ticket size={14} /> {appliedCoupon.code} Applied
                </span>
                <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}><X size={14} /></button>
              </div>
            )}
            {couponError && <p style={{ color: '#ff4757', fontSize: '0.75rem', marginTop: '5px' }}>{couponError}</p>}
          </div>

          {appliedCoupon && (
            <div className="summary-row" style={{ color: 'var(--color-primary)' }}>
              <span>Discount</span>
              <span>-${getDiscountAmount().toFixed(2)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${getCartTotal(true).toFixed(2)}</span>
          </div>
          <button className="btn-primary w-full shadow-glow" onClick={() => navigate('/checkout')}>
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
