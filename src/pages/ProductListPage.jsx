import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, SlidersHorizontal, Heart, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Page.css';

const CATEGORIES = ['All', 'Drone Parts', '3D Printing Mods', 'Robotics'];

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(500);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const toggleWishlist = (e, product) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (activeCategory !== 'All') params.append('category', activeCategory);
        const res = await fetch(`http://localhost:5000/api/products?${params}`);
        if (!res.ok) throw new Error('Failed to load products');
        setProducts(await res.json());
      } catch (err) {
        setError('Could not connect to backend. Please start the server.');
        setProducts([
          { id: 1, name: 'Carbon Fiber Drone Frame VX-1', price: 149.99, category: 'Drone Parts', image_url: 'https://images.unsplash.com/photo-1579824220023-adbd7d9959e4?auto=format&fit=crop&w=800&q=80', description: 'Ultra-lightweight frame.', rating: 4.8, reviews_count: 124 },
          { id: 2, name: 'Autonomous Rover Chassis Kit', price: 89.00, category: 'Robotics', image_url: 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?auto=format&fit=crop&w=800&q=80', description: 'Complete chassis base.', rating: 4.6, reviews_count: 42 },
          { id: 3, name: 'Titanium Extruder Gear', price: 24.50, category: '3D Printing Mods', image_url: 'https://images.unsplash.com/photo-1622344071373-c8d76db8d264?auto=format&fit=crop&w=800&q=80', description: 'High-precision gear.', rating: 4.9, reviews_count: 85 },
          { id: 4, name: 'Robotic Gripper Arm Module', price: 55.00, category: 'Robotics', image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', description: 'High-torque servo gripper.', rating: 4.5, reviews_count: 67 },
          { id: 5, name: 'Nylon Propeller Set (4x)', price: 12.99, category: 'Drone Parts', image_url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80', description: 'Durable 5-inch nylon props.', rating: 4.7, reviews_count: 198 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchProducts, 400);
    return () => clearTimeout(debounce);
  }, [search, activeCategory]);

  let displayProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  displayProducts = displayProducts.filter(p => p.price <= maxPrice);

  displayProducts.sort((a, b) => {
    if (sortBy === 'price-low') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'price-high') return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="page-container shop-page-layout">
      {/* Sidebar Filters */}
      <aside className="filters-sidebar glass-panel" style={{ width: '280px', padding: '25px', borderRadius: '16px', height: 'fit-content', position: 'sticky', top: '100px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', fontSize: '1.2rem', color: 'var(--color-primary)' }}>
          <SlidersHorizontal size={20} />
          Filters
        </h2>
        
        <div className="filter-group" style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Search</h3>
          <div className="search-box" style={{ width: '100%', margin: 0 }}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '10px 10px 10px 35px', width: '100%' }}
            />
          </div>
        </div>

        <div className="filter-group" style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Categories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {CATEGORIES.map(cat => (
              <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="category"
                  checked={activeCategory === cat}
                  onChange={() => setActiveCategory(cat)}
                  style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
                />
                <span style={{ color: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-text)' }}>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group" style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Max Price: ${maxPrice}</h3>
          <input
            type="range"
            min="0"
            max="500"
            value={maxPrice}
            onChange={e => setMaxPrice(parseInt(e.target.value))}
            className="price-slider"
            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
            <span>$0</span>
            <span>$500</span>
          </div>
        </div>

        <div className="filter-group">
          <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Sort By</h3>
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)} 
            className="sort-select"
            style={{ width: '100%', background: 'var(--color-bg-base)', color: 'var(--color-text-primary)', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '8px' }}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <div className="shop-content" style={{ flex: 1 }}>
        <div className="shop-header" style={{ marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 className="page-title" style={{ margin: 0, fontSize: '2.5rem' }}>Shop Parts & Kits</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>Showing {displayProducts.length} results</p>
          </div>
        </div>
        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="products-grid">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="product-card skeleton glass-panel" />)}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="empty-state">
            <SlidersHorizontal size={48} color="var(--color-text-secondary)" />
            <h3>No products found</h3>
            <p>Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="products-grid">
            {displayProducts.map(product => (
              <div key={product.id} className="product-card glass-panel" style={{ position: 'relative' }}>
                <button 
                  className={`wishlist-btn-card ${isInWishlist(product.id) ? 'active' : ''}`}
                  onClick={(e) => toggleWishlist(e, product)}
                  style={{ 
                    position: 'absolute', top: '15px', right: '15px', zIndex: 10, background: 'rgba(0,0,0,0.5)', 
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '36px', height: '36px', 
                    display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s',
                    color: isInWishlist(product.id) ? '#ff4b4b' : 'white',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <Heart size={18} fill={isInWishlist(product.id) ? '#ff4b4b' : 'none'} />
                </button>
                <Link to={`/products/${product.id}`}>
                  <div className="product-image-wrap">
                    <img src={product.image_url} alt={product.name} className="product-image" />
                    <span className="category-tag">{product.category}</span>
                  </div>
                </Link>
                <div className="product-info">
                  <h3><Link to={`/products/${product.id}`}>{product.name}</Link></h3>
                  <div className="product-rating">
                    {'★'.repeat(Math.round(product.rating))}
                    <span className="rating-count">({product.reviews_count})</span>
                  </div>
                  <div className="product-footer">
                    <p className="price">${Number(product.price).toFixed(2)}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
                      {product.stock_quantity <= 0 ? (
                        <span style={{ fontSize: '0.75rem', color: '#ff4b4b', fontWeight: 'bold' }}>Out of Stock</span>
                      ) : product.stock_quantity < 5 ? (
                        <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 'bold' }}>Only {product.stock_quantity} Left</span>
                      ) : null}
                      <button 
                        className="btn-primary add-cart-btn" 
                        onClick={() => addToCart(product)}
                        disabled={product.stock_quantity <= 0}
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
