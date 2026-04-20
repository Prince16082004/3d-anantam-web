import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Plus, Trash2, CheckCircle, BarChart3, Ticket, AlertTriangle, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminPage.css';

const AdminPage = () => {
  const { user, token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: '', image_url: '', stock_quantity: 10 });
  const [newCoupon, setNewCoupon] = useState({ code: '', discount_type: 'percent', discount_value: '', expiry_date: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  // Protect route
  useEffect(() => {
    if (!user || !isAdmin) navigate('/login');
  }, [user, isAdmin]);

  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [ordersRes, productsRes, couponsRes, statsRes] = await Promise.all([
          fetch('http://localhost:5000/api/orders/all', { headers: authHeaders }),
          fetch('http://localhost:5000/api/products'),
          fetch('http://localhost:5000/api/admin/coupons', { headers: authHeaders }),
          fetch('http://localhost:5000/api/admin/stats', { headers: authHeaders })
        ]);
        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (productsRes.ok) setProducts(await productsRes.json());
        if (couponsRes.ok) setCoupons(await couponsRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/coupons', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(newCoupon)
      });
      if (res.ok) {
        setCoupons(prev => [newCoupon, ...prev]);
        setNewCoupon({ code: '', discount_type: 'percent', discount_value: '', expiry_date: '' });
        setSuccessMsg('Coupon created!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) { alert(err.message); }
  };

  const updateProductInline = async (id, field, value) => {
    const endpoint = field === 'stock_quantity' ? 'stock' : 'featured';
    const body = field === 'stock_quantity' ? { stock_quantity: parseInt(value) } : { is_featured: value };
    
    try {
      await fetch(`http://localhost:5000/api/admin/products/${id}/${endpoint}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify(body)
      });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    } catch (err) { console.error(err); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ ...newProduct, price: parseFloat(newProduct.price) })
      });
      if (!res.ok) throw new Error('Failed to add product');
      const added = await res.json();
      setProducts(prev => [added, ...prev]);
      setNewProduct({ name: '', description: '', price: '', category: '', image_url: '' });
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE', headers: authHeaders });
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateStatus = async (orderId, status) => {
    await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ status })
    });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  if (loading) return <div className="page-container loading">Loading Admin Panel...</div>;

  return (
    <div className="admin-page page-container">
      <div className="admin-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Welcome, {user?.name}</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card glass-panel">
          <ShoppingBag size={28} color="var(--color-brand-primary)" />
          <div>
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <Package size={28} color="var(--color-brand-primary)" />
          <div>
            <h3>{products.length}</h3>
            <p>Products</p>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <CheckCircle size={28} color="var(--color-brand-primary)" />
          <div>
            <h3>${orders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0).toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs" style={{ marginBottom: '30px' }}>
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}><BarChart3 size={16} /> Dashboard</button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}><ShoppingBag size={16} /> Orders</button>
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}><Package size={16} /> Products</button>
        <button className={activeTab === 'coupons' ? 'active' : ''} onClick={() => setActiveTab('coupons')}><Ticket size={16} /> Coupons</button>
        <button className={activeTab === 'add' ? 'active' : ''} onClick={() => setActiveTab('add')}><Plus size={16} /> Add Product</button>
      </div>

      {activeTab === 'dashboard' && stats && (
        <div className="admin-dashboard-stats">
          <div className="stats-row">
            <div className="stat-card glass-panel highlight">
              <CheckCircle size={32} color="var(--color-primary)" />
              <div>
                <h2>${stats.totalRevenue.toFixed(2)}</h2>
                <p>Gross Revenue (MTD: ${stats.revenue30Days.toFixed(2)})</p>
              </div>
            </div>
          </div>
          <div className="stats-grid">
            <div className="stat-card glass-panel">
              <ShoppingBag size={24} />
              <div><h3>{stats.totalOrders}</h3><p>Total Orders</p></div>
            </div>
            <div className="stat-card glass-panel">
              <Package size={24} />
              <div><h3>{stats.totalUsers}</h3><p>Active Users</p></div>
            </div>
            <div className={`stat-card glass-panel ${stats.lowStockCount > 0 ? 'warning' : ''}`}>
              <AlertTriangle size={24} color={stats.lowStockCount > 0 ? '#f59e0b' : ''} />
              <div><h3>{stats.lowStockCount}</h3><p>Low Stock Items</p></div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="admin-table-wrap glass-panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th><th>Customer</th><th>Email</th><th>Total</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.customer_email}</td>
                  <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Printing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="empty-msg">No orders yet.</p>}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="admin-table-wrap glass-panel">
          <table className="admin-table">
            <thead>
              <tr><th>Item</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={p.image_url} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                      <div>
                        <strong>{p.name}</strong><br/>
                        <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{p.category}</span>
                      </div>
                    </div>
                  </td>
                  <td>${parseFloat(p.price).toFixed(2)}</td>
                  <td>
                    <input 
                      type="number" 
                      value={p.stock_quantity} 
                      onChange={(e) => updateProductInline(p.id, 'stock_quantity', e.target.value)}
                      className="inline-input"
                      style={{ width: '60px', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '4px 8px' }}
                    />
                  </td>
                  <td>
                    <button 
                      onClick={() => updateProductInline(p.id, 'is_featured', !p.is_featured)}
                      className={`btn-icon ${p.is_featured ? 'text-primary' : ''}`}
                      style={{ color: p.is_featured ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)' }}
                    >
                      <Star size={18} fill={p.is_featured ? 'var(--color-primary)' : 'none'} />
                    </button>
                  </td>
                  <td>
                    <button className="btn-icon text-danger" onClick={() => handleDeleteProduct(p.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="admin-coupons-view">
          <form className="add-coupon-form glass-panel" onSubmit={handleCreateCoupon} style={{ marginBottom: '30px', padding: '25px' }}>
            <h3>Create New Coupon</h3>
            {successMsg && <div className="success-msg" style={{ color: 'var(--color-primary)', marginBottom: '10px' }}>{successMsg}</div>}
            <div className="form-row" style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
              <input placeholder="CODE (e.g. SAVE10)" className="input-field" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} required />
              <select className="input-field" value={newCoupon.discount_type} onChange={e => setNewCoupon({...newCoupon, discount_type: e.target.value})}>
                <option value="percent">% Percent</option>
                <option value="flat">$ Flat</option>
              </select>
              <input type="number" placeholder="Value" className="input-field" value={newCoupon.discount_value} onChange={e => setNewCoupon({...newCoupon, discount_value: e.target.value})} required />
              <button type="submit" className="btn-primary">Create</button>
            </div>
          </form>

          <div className="admin-table-wrap glass-panel">
            <table className="admin-table">
              <thead>
                <tr><th>Code</th><th>Type</th><th>Value</th><th>Status</th></tr>
              </thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.code}</strong></td>
                    <td style={{ textTransform: 'capitalize' }}>{c.discount_type}</td>
                    <td>{c.discount_type === 'percent' ? `${c.discount_value}%` : `$${c.discount_value}`}</td>
                    <td><span className={c.is_active ? 'text-primary' : ''}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Tab */}
      {activeTab === 'add' && (
        <form className="add-product-form glass-panel" onSubmit={handleAddProduct}>
          <h2>Add New Product</h2>
          {addSuccess && <div className="success-msg">Product added successfully!</div>}
          {['name', 'description', 'price', 'category', 'image_url'].map(field => (
            <div className="form-group" key={field}>
              <label style={{ textTransform: 'capitalize' }}>{field.replace('_', ' ')}</label>
              {field === 'description' ? (
                <textarea className="input-field" rows="3" value={newProduct[field]} onChange={e => setNewProduct({...newProduct, [field]: e.target.value})} required />
              ) : (
                <input className="input-field" type={field === 'price' ? 'number' : 'text'} value={newProduct[field]} onChange={e => setNewProduct({...newProduct, [field]: e.target.value})} required min={field === 'price' ? '0' : undefined} step={field === 'price' ? '0.01' : undefined} />
              )}
            </div>
          ))}
          <button type="submit" className="btn-primary shadow-glow"><Plus size={18} /> Add Product</button>
        </form>
      )}
    </div>
  );
};

export default AdminPage;
