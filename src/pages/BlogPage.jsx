import React from 'react';
import './Page.css';

const BlogPage = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">Engineering Blog</h1>
      <div className="products-grid">
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ color: 'var(--color-brand-primary)' }}>CF Nylon vs standard PLA for Drones</h3>
          <p className="text-secondary" style={{ marginTop: '10px' }}>Exploring material shear strength and why your FPV racer might need an upgrade.</p>
          <button className="btn-outline" style={{ marginTop: '20px' }}>Read More</button>
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ color: 'var(--color-brand-primary)' }}>Top 5 Rover Chassis Designs 2026</h3>
          <p className="text-secondary" style={{ marginTop: '10px' }}>An analysis of modular printable chassis for autonomous navigation systems.</p>
          <button className="btn-outline" style={{ marginTop: '20px' }}>Read More</button>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
