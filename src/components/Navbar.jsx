import { useState, useEffect } from 'react';
import { Icon } from './Icons';

export function Navbar({
  userLocation,
  onRequestLocation,
  isLocating,
  onOpenAiPlanner,
  onNavigateToPlanner,
  onCloseModals,
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

  // Lock body & html scroll completely and fix background in place when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
      document.documentElement.classList.add('menu-open');

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setIsMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.classList.remove('menu-open');
        document.documentElement.classList.remove('menu-open');
        window.scrollTo(0, scrollY);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    if (onCloseModals) onCloseModals();
    setTimeout(() => {
      const elem = document.getElementById(sectionId);
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }, 50);
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
              if (onCloseModals) onCloseModals();
              setIsMobileMenuOpen(false);
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 50);
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
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <Icon name={isMobileMenuOpen ? 'x' : 'menu'} size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Backdrop (Darkened overlay on the right, closes drawer on click) */}
      <div
        className={`mobile-nav-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        onTouchMove={(e) => e.preventDefault()}
        onWheel={(e) => e.preventDefault()}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer (Appears from Left to Right) */}
      <aside
        className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}
        aria-label="Mobile Navigation Menu"
        aria-hidden={!isMobileMenuOpen}
        role="dialog"
        aria-modal="true"
      >
        <div className="mobile-nav-header">
          <a
            href="#"
            className="nav-brand-logo"
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span className="brand-dk-gold">
              DK
              <span className="brand-dk-star">✦</span>
            </span>
            <span>Holidays</span>
          </a>

          <button
            type="button"
            className="mobile-nav-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <Icon name="x" size={22} />
          </button>
        </div>

        <nav className="mobile-nav-links" aria-label="Mobile navigation links">
          <a
            href="#discover"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('discover');
            }}
          >
            Discover
          </a>
          <a
            href="#destinations"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('destinations');
            }}
          >
            Destinations
          </a>
          <a
            href="#weather"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('weather');
            }}
          >
            Weather & Location
          </a>
          <a
            href="#planner"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('planner');
            }}
          >
            Plan a Trip
          </a>
          <a
            href="#about"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('about');
            }}
          >
            About DK Holidays
          </a>
        </nav>

        <div className="mobile-nav-footer">
          <button
            type="button"
            className="search-unified-submit-btn mobile-nav-ai-btn"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenAiPlanner();
            }}
          >
            <span>✦ Open DK AI Travel Assistant</span>
          </button>

          <button
            type="button"
            className="btn-view-all mobile-nav-loc-btn"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onRequestLocation();
            }}
          >
            <Icon name="navigation" size={14} />
            <span>{userLocation?.city || 'Use My Location'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
