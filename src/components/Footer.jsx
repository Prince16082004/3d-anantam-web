import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-gradient" style={{ padding: '80px 0 40px', background: 'var(--gradient-insta)', color: 'white' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          <div>
            <div className="logo" style={{ marginBottom: '20px' }}>
              <span style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-1px' }}>ANANTAM 3D</span>
            </div>
            <p style={{ fontSize: '1rem', opacity: '0.9', lineHeight: '1.6' }}>
              Specialized 3D printing and parts provider for Anantam Aerials & Robotics.
              Powering the next generation of UAVs and Robotics with industrial precision.
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '24px', color: 'white', fontSize: '1.2rem', fontWeight: '700' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li><Link to="/products" style={{ color: 'white', opacity: '0.8' }}>Shop Parts</Link></li>
              <li><a href="/#custom-print" style={{ color: 'white', opacity: '0.8' }}>Custom Print</a></li>
              <li><Link to="/about" style={{ color: 'white', opacity: '0.8' }}>About Us</Link></li>
              <li><Link to="/contact" style={{ color: 'white', opacity: '0.8' }}>Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '24px', color: 'white', fontSize: '1.2rem', fontWeight: '700' }}>Contact Info</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', color: 'white', opacity: '0.8' }}>
              <li>📍 Pune, Maharashtra, India</li>
              <li>✉️ info@anantam3d.in</li>
              <li>📞 +91 XXXXX XXXXX</li>
            </ul>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', paddingTop: '30px', borderTop: '1px solid rgba(255, 255, 255, 0.2)', color: 'white', opacity: '0.7', fontSize: '0.9rem' }}>
          <p>&copy; {new Date().getFullYear()} Anantam Aerials & Robotics. Crafting Excellence with 3D Printing.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
