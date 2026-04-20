import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User, LayoutDashboard, Menu, X, Heart, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import logo from '../assets/logo.png';
import './Header.css';

const Header = () => {
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header glass-panel">
      <div className="container header-content">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Anantam 3D Logo" className="header-logo" />
          <span className="logo-text text-gradient">ANANTAM 3D</span>
        </Link>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`desktop-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Shop</Link>
          <a href="/#custom-print" onClick={() => setMenuOpen(false)}>Custom Print</a>
          <Link to="/track-order" onClick={() => setMenuOpen(false)}>Track Order</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </nav>

        <div className="header-actions">
          <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/wishlist" className="cart-btn" style={{ marginRight: '10px' }}>
            <Heart size={20} />
            {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className="cart-btn">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="user-name"><User size={16} /> {user.name.split(' ')[0]}</span>
              {isAdmin && (
                <Link to="/admin" className="btn-outline" style={{ padding: '7px 14px', fontSize: '0.85rem' }}>
                  <LayoutDashboard size={16} /> Admin
                </Link>
              )}
              <button className="btn-outline logout-btn" onClick={handleLogout}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '9px 20px' }}>Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
