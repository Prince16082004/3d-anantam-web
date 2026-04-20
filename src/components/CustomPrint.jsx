import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import './CustomPrint.css';

const pricingRates = {
  pla: 10,
  tpu: 15,
  abs: 12,
  nylon: 35
};

const materialNames = {
  pla: 'PLA+ (Standard)',
  tpu: 'TPU (Flexible)',
  abs: 'ABS (Heat Resistant)',
  nylon: 'Carbon Fibre Nylon (Ultra Strength)'
};

const BASE_SETUP_FEE = 150; // Fixed starting price for slicing and warming up bed

const CustomPrint = () => {
  const { token } = useAuth();
  const [material, setMaterial] = useState('pla');
  const [weight, setWeight] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef(null);
  
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(0);
  
  const [isQuoting, setIsQuoting] = useState(false);

  useEffect(() => {
    const w = parseFloat(weight);
    if (!isNaN(w) && w > 0) {
      const materialCost = w * pricingRates[material];
      let subTotal = materialCost + BASE_SETUP_FEE;
      let discount = 0;

      // Dynamic discounts for larger orders
      if (w >= 1000) {
        discount = subTotal * 0.20; // 20% off for 1kg+
      } else if (w >= 500) {
        discount = subTotal * 0.10; // 10% off for 500g+
      }

      setDiscountApplied(discount);
      setEstimatedPrice(Math.round(subTotal - discount));
      setEstimatedTime(Math.ceil(w / 40)); // Approx 40 grams per hour
    } else {
      setEstimatedPrice(0);
      setEstimatedTime(0);
      setDiscountApplied(0);
    }
  }, [material, weight]);

  const handleQuoteRequest = async (e) => {
    e.preventDefault();
    if (!weight || weight <= 0) return alert('Please enter an estimated weight.');

    setIsQuoting(true);
    setUploadProgress('Submitting request...');

    try {
      // Upload file if provided
      let uploadedFilePath = null;
      if (file) {
        setUploadProgress('Uploading your 3D file...');
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch('http://localhost:5000/api/upload/stl', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedFilePath = uploadData.path;
          setUploadProgress(`✓ File uploaded: ${file.name}`);
        } else {
          setUploadProgress('File upload failed — continuing without file.');
        }
      }

      // Simulate sending quote email (replace with real email API later)
      setTimeout(() => {
        alert(`Quote Submitted!\n\nCost: ₹${estimatedPrice}\nWeight: ${weight}g of ${materialNames[material]}\nPrint Time: ~${estimatedTime} hours${uploadedFilePath ? '\nFile: Uploaded successfully' : ''}\n\nWe will contact you within 24 hours.`);
        setIsQuoting(false);
        setUploadProgress('');
        setFile(null);
      }, 1000);
    } catch (err) {
      setUploadProgress('Error: ' + err.message);
      setIsQuoting(false);
    }
  };

  return (
    <section id="custom-print" className="section" style={{ background: 'var(--color-bg-elevated)' }}>
      <div className="container custom-print-container">
        <div className="print-info">
          <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>
            Get a <span className="text-gradient">Custom Print</span> Estimate
          </h2>
          <p className="text-secondary" style={{ marginBottom: '30px', maxWidth: '400px' }}>
            Need a specific prototype or a rare UAV mount? Upload your STL or OBJ file, select your preferred material, and get an instant quote to start manufacturing.
          </p>
          
          <ul className="print-features">
            <li>✔ Carbon Fiber infused Nylon available</li>
            <li>✔ Basic setup fee of ₹150 per print job</li>
            <li>✔ Automatic 10% volume discount over 500g</li>
            <li>✔ Automatic 20% industrial discount over 1kg</li>
          </ul>

          <div className="live-pricing glass-panel" style={{ marginTop: '30px', padding: '20px' }}>
            <h4 style={{ marginBottom: '15px', color: 'var(--color-brand-primary)' }}>Live Estimate Factors</h4>
            
            {estimatedPrice > 0 && (
              <div style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                  <span className="text-secondary">Base Machine Setup:</span>
                  <span>₹{BASE_SETUP_FEE}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                  <span className="text-secondary">Material Cost ({weight}g):</span>
                  <span>₹{weight * pricingRates[material]}</span>
                </div>
                {discountApplied > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#10b981', fontWeight: '600' }}>
                    <span>Volume Discount:</span>
                    <span>- ₹{Math.round(discountApplied)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '10px', color: 'var(--color-text-secondary)' }}>
                  <span>Est. Print Time:</span>
                  <span>~{estimatedTime} Hours</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-secondary">Projected Total:</span>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-brand-primary)' }}>₹{estimatedPrice}</span>
            </div>
          </div>
        </div>
        
        <div className="print-form glass-panel">
          <h3 style={{ marginBottom: '20px' }}>Request Quote</h3>
          <form onSubmit={handleQuoteRequest} className="form">
            <div className="form-group">
              <label>Part Description</label>
              <input type="text" className="input-field" placeholder="e.g. 5 inch FPV drone arm" required />
            </div>
            
            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label>Material Preference</label>
                <select 
                  className="input-field" 
                  value={material} 
                  onChange={(e) => setMaterial(e.target.value)}
                  style={{ appearance: 'none', background: 'var(--color-bg-base)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                >
                  <option value="pla">PLA+ (₹10/g)</option>
                  <option value="tpu">TPU (₹15/g)</option>
                  <option value="abs">ABS (₹12/g)</option>
                  <option value="nylon">CF Nylon (₹35/g)</option>
                </select>
              </div>
              <div>
                <label>Est. Weight (grams)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="e.g. 150" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="1"
                  required 
                />
              </div>
            </div>
            
            <div className="form-group upload-area">
              <div
                className={`upload-box ${file ? 'has-file' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const dropped = e.dataTransfer.files[0];
                  if (dropped) setFile(dropped);
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".stl,.obj"
                  style={{ display: 'none' }}
                  onChange={(e) => setFile(e.target.files[0] || null)}
                />
                <span style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }}>
                  {file ? '✅' : '📁'}
                </span>
                {file ? (
                  <>
                    <p style={{ color: 'var(--color-brand-primary)', fontWeight: '600' }}>{file.name}</p>
                    <p className="text-secondary" style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button type="button" className="btn-outline" style={{ marginTop: '10px', fontSize: '0.8rem' }} onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                      Remove File
                    </button>
                  </>
                ) : (
                  <>
                    <p>Drag & Drop or Click to Upload STL/OBJ</p>
                    <p className="text-secondary" style={{ fontSize: '0.8rem', marginTop: '5px' }}>Max file size: 50MB</p>
                  </>
                )}
                {uploadProgress && (
                  <p style={{ marginTop: '10px', fontSize: '0.8rem', color: uploadProgress.startsWith('✓') ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)' }}>
                    {uploadProgress}
                  </p>
                )}
              </div>
            </div>

            
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={isQuoting}>
              {isQuoting ? 'Sending...' : 'Confirm Request & Send Specs'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CustomPrint;
