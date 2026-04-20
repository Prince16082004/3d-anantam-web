import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './Page.css';

const ContactPage = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Contact Us</h1>
      <div className="checkout-layout">
        <form className="checkout-form glass-panel" onSubmit={handleSubmit}>
          <h2>Send a Message</h2>
          <div className="form-group">
            <label>Name</label>
            <input required type="text" className="input-field" placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input required type="email" className="input-field" placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea required rows="5" className="input-field" placeholder="How can we help your robotics team?"></textarea>
          </div>
          <button type="submit" className="btn-primary w-full shadow-glow">
            {sent ? 'Message Sent!' : <><Send size={18} style={{marginRight: '8px'}} /> Send Message</>}
          </button>
        </form>

        <div className="checkout-summary">
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>Direct Connect</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', color: 'var(--color-text-secondary)' }}>
              <Mail size={20} color="var(--color-brand-primary)" />
              <span>support@anantam3d.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', color: 'var(--color-text-secondary)' }}>
              <Phone size={20} color="var(--color-brand-primary)" />
              <span>+91 98765 43210</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--color-text-secondary)' }}>
              <MapPin size={20} color="var(--color-brand-primary)" />
              <span>Kalyani Nagar, Pune, India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
