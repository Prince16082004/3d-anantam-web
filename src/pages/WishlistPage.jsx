import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { HeartCrack, ShoppingCart, Trash2 } from 'lucide-react';
import './Page.css';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="page-container wishlist-page" style={{ minHeight: '60vh' }}>
      <h1 className="page-title">My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="empty-state">
          <HeartCrack size={48} color="var(--color-text-secondary)" />
          <h3>Your wishlist is empty</h3>
          <p>Save items you love and buy them later.</p>
          <Link to="/products" className="btn-primary" style={{ marginTop: '20px' }}>Explore Products</Link>
        </div>
      ) : (
        <div className="products-grid">
          {wishlist.map(product => (
            <div key={product.id} className="product-card glass-panel" style={{ position: 'relative' }}>
              <button 
                className="remove-wishlist-btn" 
                onClick={() => removeFromWishlist(product.id)}
                style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, background: 'rgba(255,0,0,0.1)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: 'red' }}
              >
                <Trash2 size={18} />
              </button>
              
              <Link to={`/products/${product.id}`}>
                <div className="product-image-wrap">
                  <img src={product.image_url} alt={product.name} className="product-image" />
                  <span className="category-tag">{product.category}</span>
                </div>
              </Link>
              
              <div className="product-info">
                <h3><Link to={`/products/${product.id}`}>{product.name}</Link></h3>
                <div className="product-footer" style={{ marginTop: '10px' }}>
                  <p className="price">${Number(product.price).toFixed(2)}</p>
                  <button 
                    className="btn-primary add-cart-btn" 
                    onClick={() => {
                        addToCart(product);
                        removeFromWishlist(product.id);
                    }}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                  >
                    <ShoppingCart size={16} /> Move to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
