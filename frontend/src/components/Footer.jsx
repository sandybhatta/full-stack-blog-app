// src/components/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>© 2025 BlogApp. All rights reserved.</p>
        <div className="social-links">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">Facebook</a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">Twitter</a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
