import React, { useState } from 'react';
import { Package, Search, PackageSearch, AlertCircle, CheckCircle } from 'lucide-react';
import './Page.css';

const OrderTrackingPage = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const res = await fetch(`http://localhost:5000/api/orders/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, email })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.msg || 'Failed to track order');
      }
      
      setStatus({ ...data.order, statusMessage: getStatusMessage(data.order.status) });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = (code) => {
    switch (code) {
      case 'Pending': return 'Your order is confirmed and being prepared.';
      case 'Shipped': return 'Good news! Your order is on the way.';
      case 'Delivered': return 'Your order has been delivered.';
      case 'Cancelled': return 'This order has been cancelled.';
      default: return 'Status unavailable.';
    }
  };

  return (
    <div className="page-container page-layout" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', padding: '40px', borderRadius: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <PackageSearch size={48} color="var(--color-primary)" style={{ marginBottom: '20px' }} />
          <h1 className="page-title text-gradient" style={{ fontSize: '2rem', marginBottom: '10px' }}>Track Your Order</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Enter your Order ID and Email Address to track your package.</p>
        </div>

        <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="filter-label">Order ID</label>
            <input 
              type="text" 
              required
              className="w-full glass-panel" 
              style={{ background: 'var(--color-bg-base)', padding: '12px', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
              placeholder="e.g. 102"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <div>
            <label className="filter-label">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full glass-panel" 
              style={{ background: 'var(--color-bg-base)', padding: '12px', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn-primary shadow-glow w-full" disabled={loading} style={{ justifyContent: 'center', padding: '14px' }}>
            {loading ? 'Searching...' : <><Search size={20} /> Track Package</>}
          </button>
        </form>

        {error && (
          <div className="error-banner" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {status && (
          <div style={{ marginTop: '30px', padding: '20px', borderRadius: '12px', background: 'rgba(88, 81, 219, 0.05)', border: '1px solid rgba(88, 81, 219, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} color="var(--color-primary)" /> 
                Order #{status.id}
              </h3>
              <span style={{ 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '0.85rem', 
                fontWeight: 'bold',
                  background: status.status === 'Delivered' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(88, 81, 219, 0.1)',
                color: status.status === 'Delivered' ? '#10b981' : 'var(--color-primary)'
              }}>
                {status.status}
              </span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '15px' }}>{status.statusMessage}</p>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '15px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              Total Amount: <strong>${status.total_amount.toFixed(2)}</strong><br/>
              Date Placed: {new Date(status.created_at).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
