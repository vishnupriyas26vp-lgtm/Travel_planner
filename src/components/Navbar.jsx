import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';

export function Navbar({
  userLocation,
  onRequestLocation,
  isLocating,
  onOpenAiPlanner,
  onNavigateToPlanner,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    const elem = document.getElementById(sectionId);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className={`top-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container-xl nav-flex">
          {/* Brand Logo: Gold DK + Star + White Holidays */}
          <a
            href="#"
            className="nav-brand-logo"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span className="brand-dk-gold">
              DK
              <span className="brand-dk-star">✦</span>
            </span>
            <span>Holidays</span>
          </a>

          {/* Desktop Center Links */}
          <nav aria-label="Main Navigation">
            <ul className="nav-menu-links">
              <li>
                <a href="#discover" onClick={(e) => { e.preventDefault(); handleNavClick('discover'); }}>
                  Discover
                </a>
              </li>
              <li>
                <a href="#destinations" onClick={(e) => { e.preventDefault(); handleNavClick('destinations'); }}>
                  Destinations
                </a>
              </li>
              <li>
                <a href="#weather" onClick={(e) => { e.preventDefault(); handleNavClick('weather'); }}>
                  Weather
                </a>
              </li>
              <li>
                <a href="#planner" onClick={(e) => { e.preventDefault(); handleNavClick('planner'); }}>
                  Plan a Trip
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}>
                  About
                </a>
              </li>
            </ul>
          </nav>

          {/* Right Action Cluster */}
          <div className="nav-right-cluster">
            <button
              type="button"
              className="nav-location-btn"
              onClick={onRequestLocation}
              title={userLocation?.city ? `Location: ${userLocation.city}` : 'Click to use your live location'}
            >
              <Icon name="navigation" size={14} />
              <span>{isLocating ? 'Locating...' : userLocation?.city ? userLocation.city : 'Use My Location'}</span>
            </button>

            <button
              type="button"
              className="nav-ai-btn"
              onClick={onOpenAiPlanner}
            >
              <Icon name="sparkles" size={14} />
              <span>AI Planner</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <Icon name={isMobileMenuOpen ? 'x' : 'menu'} size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation (Zero Horizontal Overflow) */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(12, 16, 25, 0.95)',
            backdropFilter: 'blur(16px)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            padding: '80px 24px 32px 24px',
            boxSizing: 'border-box',
          }}
        >
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              color: '#ffffff',
              padding: '10px',
            }}
            aria-label="Close menu"
          >
            <Icon name="x" size={24} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
            <a href="#discover" onClick={(e) => { e.preventDefault(); handleNavClick('discover'); }}>
              Discover
            </a>
            <a href="#destinations" onClick={(e) => { e.preventDefault(); handleNavClick('destinations'); }}>
              Destinations
            </a>
            <a href="#weather" onClick={(e) => { e.preventDefault(); handleNavClick('weather'); }}>
              Weather & Location
            </a>
            <a href="#planner" onClick={(e) => { e.preventDefault(); handleNavClick('planner'); }}>
              Plan a Trip
            </a>
            <a href="#about" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}>
              About DK Holidays
            </a>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              type="button"
              className="search-unified-submit-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAiPlanner();
              }}
              style={{ justifyContent: 'center' }}
            >
              <span>✦ Open DK AI Travel Assistant</span>
            </button>
            <button
              type="button"
              className="btn-view-all"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onRequestLocation();
              }}
              style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', justifyContent: 'center' }}
            >
              <Icon name="navigation" size={14} />
              <span>{userLocation?.city || 'Use My Location'}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
