import React from 'react';
import './Page.css';

const AboutPage = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">About Anantam 3D</h1>
      <div className="glass-panel" style={{ padding: '40px' }}>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--color-text-secondary)' }}>
          Founded by passionate roboticists, Anantam 3D bridges the gap between digital design and physical reality in the aerospace and automation sectors. Our cutting-edge farm of industrial-grade FDM and SLA printers ensures that whether you're prototyping a micro-drone or building a full-scale rover, you have the highest quality parts delivered fast.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
