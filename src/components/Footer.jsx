import React, { useState } from 'react';
import { Icon } from './Icons';

export function Footer({ onSelectDestination, onStartPlan, onOpenAi }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3500);
    }
  };

  return (
    <footer className="dark-footer" id="about" aria-label="Site Footer">
      <div className="container-xl">
        <div className="footer-columns-grid">
          {/* Brand Info */}
          <div>
            <div className="footer-brand-title">
              <span className="brand-dk-gold">
                DK
                <span className="brand-dk-star">✦</span>
              </span>
              <span>Holidays</span>
            </div>
            <p className="footer-brand-motto">
              The world is waiting. Let's plan your next chapter.
            </p>
            <div className="footer-social-row">
              <span className="social-circle-link">📷</span>
              <span className="social-circle-link">📘</span>
              <span className="social-circle-link">▶</span>
              <span className="social-circle-link">🐦</span>
            </div>
          </div>

          {/* Column 1: Discover */}
          <div>
            <h4 className="footer-col-heading">Discover</h4>
            <ul className="footer-links-list">
              <li><a href="#destinations">Destinations</a></li>
              <li><a href="#experiences">Experiences</a></li>
              <li><a href="#popular-trips">Popular Trips</a></li>
              <li><a href="#destinations">Travel Guide</a></li>
            </ul>
          </div>

          {/* Column 2: Plan a Trip */}
          <div>
            <h4 className="footer-col-heading">Plan a Trip</h4>
            <ul className="footer-links-list">
              <li><a href="#" onClick={(e) => { e.preventDefault(); onOpenAi(); }}>AI Trip Planner</a></li>
              <li><a href="#planner" onClick={onStartPlan}>Itinerary Planner</a></li>
              <li><a href="#popular-trips">Trip Ideas</a></li>
              <li><a href="#planner" onClick={onStartPlan}>Custom Trips</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="footer-col-heading">Company</h4>
            <ul className="footer-links-list">
              <li><a href="#">About DK Holidays</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Our Blog</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="footer-col-heading">Support</h4>
            <ul className="footer-links-list">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div>
            <h4 className="footer-col-heading">Newsletter</h4>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.5', marginBottom: '14px' }}>
              Get travel inspiration & exclusive deals straight to your inbox.
            </p>
            {isSubscribed ? (
              <div style={{ color: '#e5a93b', fontSize: '0.85rem', fontWeight: 600 }}>
                ✓ Subscribed! Welcome to DK Holidays.
              </div>
            ) : (
              <form className="newsletter-input-box" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-submit-arrow">
                  →
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom-copyright">
          © 2026 DK Holidays. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
