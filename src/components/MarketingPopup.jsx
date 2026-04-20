import React, { useState, useEffect } from 'react';
import { X, Mail, Sparkles } from 'lucide-react';
import './MarketingPopup.css';

const MarketingPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup this session
    const hasSeenPopup = sessionStorage.getItem('anantam_marketing_popup_seen');
    
    if (!hasSeenPopup) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('anantam_marketing_popup_seen', 'true');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 2500);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="marketing-popup-overlay">
      <div className="marketing-popup-content glass-panel shadow-glow">
        <button className="close-popup-btn" onClick={handleClose}>
          <X size={24} />
        </button>
        
        <div className="popup-body">
          {!submitted ? (
            <>
              <div className="popup-icon">
                <Sparkles size={40} color="var(--color-primary)" />
              </div>
              <h2>Unlock 10% Off Your First Order!</h2>
              <p>Subscribe to our newsletter for exclusive deals on 3D prints, drone parts, and robotics kits.</p>
              
              <form onSubmit={handleSubmit} className="popup-form">
                <div className="input-group">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-primary">Reveal My Discount</button>
              </form>
              <p className="no-thanks" onClick={handleClose}>No thanks, I prefer paying full price</p>
            </>
          ) : (
            <div className="success-message">
              <h2>You're In! 🎉</h2>
              <p>Check your inbox for your 10% off promo code.</p>
              <div className="fake-code">WELCOME10</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingPopup;
