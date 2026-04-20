import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCatalog.css';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products?featured=true');
        if (res.ok) {
          const data = await res.json();
          // If no featured products, just show top 4
          if (data.length === 0) {
            const allRes = await fetch('http://localhost:5000/api/products');
            const allData = await allRes.json();
            setProducts(allData.slice(0, 4));
          } else {
            setProducts(data);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) return (
    <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
      <p style={{ color: 'var(--color-primary)' }}>Discovering Parts...</p>
    </div>
  );

  return (
    <section id="shop" className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <h2 className="section-title" style={{ marginBottom: '10px' }}>Popular <span className="text-gradient">3D Parts</span></h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Precision engineered components for your next build.</p>
          </div>
          <Link to="/products" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            View Full Shop <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card glass-panel">
              <Link to={`/products/${product.id}`} className="product-image-link">
                <div className="product-image">
                  <img src={product.image_url} alt={product.name} />
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
                  <span className="product-price">${Number(product.price).toFixed(2)}</span>
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
