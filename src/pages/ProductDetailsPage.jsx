import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowLeft, ShieldCheck, CheckCircle2, BadgePercent, Heart, Package, MessageSquarePlus, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import './Page.css';

const MOCK_GALLERY = [
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1662991060410-d021c1f71df4?auto=format&fit=crop&w=800&q=80',
];

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, token } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, revRes, relRes] = await Promise.all([
          fetch(`http://localhost:5000/api/products/${id}`),
          fetch(`http://localhost:5000/api/products/${id}/reviews`),
          fetch(`http://localhost:5000/api/products/${id}/related`)
        ]);

        if (prodRes.ok) {
          const data = await prodRes.json();
          setProduct(data);
          setSelectedImage(data.image_url);
        }
        if (revRes.ok) setReviews(await revRes.json());
        if (relRes.ok) setRelatedProducts(await relRes.json());
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to leave a review');
    setSubmittingReview(true);
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      });
      if (res.ok) {
        const revRes = await fetch(`http://localhost:5000/api/products/${id}/reviews`);
        setReviews(await revRes.json());
        setReviewComment('');
        setReviewRating(5);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="page-container loading">Loading details...</div>;
  if (!product) return <div className="page-container error">Product not found.</div>;

  const galleryImages = [product.image_url, ...MOCK_GALLERY.slice(0, 2)];

  // Pricing Psychology Calculations
  const sellingPrice = parseFloat(product.price);
  const mrp = sellingPrice * 1.28; // Fake 28% markup for MRP
  const savedAmount = mrp - sellingPrice;
  const savePercent = Math.round((savedAmount / mrp) * 100);
  const emiStarts = Math.round(sellingPrice / 6); // Fake 6 month EMI

  return (
    <div className="page-container product-details-page">
      <button className="btn-outline back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="product-details-grid glass-panel">

        {/* Left Column: Image Gallery */}
        <div className="product-gallery">
          <div className="main-image-container">
            <img src={selectedImage} alt={product.name} className="main-detail-image" />
            <div className="discount-badge"><BadgePercent size={16} /> {savePercent}% OFF</div>
          </div>
          <div className="thumbnail-list">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                className={`thumbnail-btn ${selectedImage === img ? 'active' : ''}`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt={`Thumbnail ${idx}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Content */}
        <div className="product-content">
          <h1 className="product-title">{product.name}</h1>

          <div className="rating">
            <Star color="gold" fill="gold" size={18} />
            <span>{product.rating}</span>
            <span className="reviews">({product.reviews_count} Customer Reviews)</span>
          </div>

          <div className="pricing-section">
            <p className="mrp-price">MRP: <del>${mrp.toFixed(2)}</del></p>
            <div className="price-row">
              <p className="price-large">${sellingPrice.toFixed(2)}</p>
              <span className="save-pill">Save ${savedAmount.toFixed(2)}</span>
            </div>
            <p className="taxes-note">Inclusive of all taxes. <strong>EMI starts at ${emiStarts}/mo.</strong></p>
          </div>

          <div className="trust-signals">
            <div className="trust-item"><CheckCircle2 size={16} /> 100% Genuine </div>
            <div className="trust-item"><ShieldCheck size={16} /> 1 Year Warranty</div>
            <div className={`trust-item ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
              <Package size={16} /> 
              {product.stock_quantity > 0 ? `${product.stock_quantity} In Stock` : 'Out of Stock'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              className="btn-primary shadow-glow add-to-cart-hero" 
              onClick={() => addToCart(product)} 
              style={{ flex: 1 }}
              disabled={product.stock_quantity <= 0}
            >
              <ShoppingCart size={20} /> 
              {product.stock_quantity > 0 ? `Add to Cart — $${sellingPrice.toFixed(2)}` : 'Out of Stock'}
            </button>
            <button 
              className={`btn-outline ${isInWishlist(product.id) ? 'active' : ''}`} 
              onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
              style={{ padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: isInWishlist(product.id) ? '#ff4b4b' : 'var(--color-text)', borderColor: isInWishlist(product.id) ? '#ff4b4b' : '' }}
            >
              <Heart size={20} fill={isInWishlist(product.id) ? '#ff4b4b' : 'none'} />
            </button>
          </div>

          <div className="payment-badges">
            <span className="secure-text">Guaranteed Safe Checkout</span>
            <div className="badges-list">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/UPI-Logo.png" alt="UPI" />
            </div>
          </div>

          {/* Dynamic Tabs */}
          <div className="dynamic-tabs">
            <div className="tab-headers">
              <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
              <button className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>Specifications</button>
              <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
            </div>
            <div className="tab-body">
              {activeTab === 'reviews' && (
                <div className="reviews-tab-container">
                  {user ? (
                    <form onSubmit={handleSubmitReview} className="review-form glass-panel">
                      <h3>Add a Review</h3>
                      <div className="rating-select">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button 
                            key={num} 
                            type="button" 
                            onClick={() => setReviewRating(num)}
                            className={reviewRating >= num ? 'star active' : 'star'}
                          >
                            <Star size={20} fill={reviewRating >= num ? "gold" : "none"} color={reviewRating >= num ? "gold" : "currentColor"} />
                          </button>
                        ))}
                      </div>
                      <textarea 
                        placeholder="Share your thoughts about this product..." 
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                      />
                      <button type="submit" className="btn-primary" disabled={submittingReview}>
                        <Send size={16} /> {submittingReview ? 'Posting...' : 'Post Review'}
                      </button>
                    </form>
                  ) : (
                    <div className="login-to-review glass-panel">
                      <p>Please <Link to="/login" style={{ color: 'var(--color-primary)' }}>login</Link> to write a review.</p>
                    </div>
                  )}

                  <div className="reviews-list">
                    {reviews.length === 0 ? (
                      <p className="no-reviews">No reviews yet. Be the first to review!</p>
                    ) : (
                      reviews.map(rev => (
                        <div key={rev.id} className="review-item glass-panel">
                          <div className="review-header">
                            <strong>{rev.user_name}</strong>
                            <div className="review-stars">
                              {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                            </div>
                          </div>
                          <p className="review-comment">{rev.comment}</p>
                          <span className="review-date">{new Date(rev.created_at).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section" style={{ marginTop: '60px' }}>
          <h2 className="section-title">You May Also Like</h2>
          <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', marginTop: '30px' }}>
            {relatedProducts.map(item => (
              <div key={item.id} className="product-card glass-panel">
                <Link to={`/products/${item.id}`}>
                  <div className="product-image-wrap">
                    <img src={item.image_url} alt={item.name} className="product-image" />
                    <span className="category-tag">{item.category}</span>
                  </div>
                </Link>
                <div className="product-info">
                  <h3><Link to={`/products/${item.id}`}>{item.name}</Link></h3>
                  <div className="product-footer">
                    <p className="price">${Number(item.price).toFixed(2)}</p>
                    <button className="btn-primary add-cart-btn" onClick={() => addToCart(item)} disabled={item.stock_quantity <= 0}>
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
