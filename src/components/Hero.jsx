import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="home" className="hero section">
      <div className="dot-grid"></div>
      <div className="bg-glow-top"></div>
      <div className="container hero-container">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="badge">
            🚀 Future of Prototyping
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <span className="hero-kicker">Endless Innovation</span>
            <h1 className="hero-title">
              Precision <br />
              <span className="text-gradient">Engineered 3D Parts</span>
            </h1>
          </motion.div>

          <motion.p variants={itemVariants} className="hero-subtitle">
            Scale your UAV and robotics projects with industrial-grade 3D printed parts. From custom mounts to full drone frames, we print your imagination with unmatched speed and strength.
          </motion.p>

          <motion.div variants={itemVariants} className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/products')}>Explore Shop</button>
            <button className="btn-outline" onClick={() => document.getElementById('custom-print')?.scrollIntoView({behavior: 'smooth'})}>Upload STL for Quote</button>
          </motion.div>

          <motion.div variants={itemVariants} className="hero-stats">
            <div className="stat">
              <h3>24h</h3>
              <p>Turnaround</p>
            </div>
            <div className="stat">
              <h3>4+</h3>
              <p>Materials</p>
            </div>
            <div className="stat">
              <h3>1mm</h3>
              <p>Precision</p>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="printer-container glass-panel">
            <div className="printer-background"></div>
            <div className="scan-line"></div>
          </div>
          <div className="system-status">
            <span className="blink-dot"></span> 
            <code>SYSTEM ACTIVE: [PROTO_GEN_v4.2]</code>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
