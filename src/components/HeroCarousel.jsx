import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HERO_SLIDES } from '../data/heroSlides';
import { DestinationSearch } from './DestinationSearch';
import { Icon } from './Icons';
import { getDestinationPrimaryImage } from '../services/destinationImageService';

export function HeroCarousel({
  onExploreDestination,
  onSecondaryCta,
  onSearchSubmit,
  onChipSelect,
  onRequestLocation,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    setTimerKey((k) => k + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setTimerKey((k) => k + 1);
  }, []);

  const goToSlide = (idx) => {
    setCurrentIndex(idx);
    setTimerKey((k) => k + 1);
  };

  // Continuous 5-Second Autoplay Loop starting IMMEDIATELY on mount
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Resume fresh 5-second slide duration when returning to tab
      if (!document.hidden) {
        setTimerKey((k) => k + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const interval = setInterval(() => {
      if (!document.hidden) {
        setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
        setTimerKey((k) => k + 1);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timerKey]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;
      if (e.key === 'ArrowRight') nextSlide();
      else if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
  };

  const currentSlide = HERO_SLIDES[currentIndex];

  return (
    <section
      className="hero-redesigned-section"
      id="discover"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="DK Holidays Cinematic Carousel"
    >
      {/* Background with Framer Motion Crossfade & Subtle Zoom (Clipped to hero) */}
      <div
        className="hero-bg-frame"
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            className="hero-background-layer"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              backgroundImage: `url(${(currentSlide.image && currentSlide.image.startsWith('https://images.')) ? currentSlide.image : getDestinationPrimaryImage(currentSlide.id, currentSlide.image)})`,
            }}
          />
        </AnimatePresence>

        {/* Balanced Cinematic Gradient (Clear text readability, bright photography) */}
        <div className="hero-gradient-overlay" />
      </div>

      {/* Hero Body Content */}
      <div className="container-xl hero-content-wrapper">
        {/* Main Stage: Left Story Copy + Right Subtle Destination Meta */}
        <div className="hero-stage-row">
          {/* Left Emotional Storytelling Block */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              className="hero-story-block"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {/* Eyebrow / Region Meta */}
              <div className="hero-eyebrow-line">
                <span className="hero-eyebrow-pill">
                  {currentSlide.eyebrow}
                </span>
                <span className="hero-eyebrow-dot">•</span>
                <span className="hero-eyebrow-meta">
                  {currentSlide.metadataText}
                </span>
              </div>

              {/* Large but Controlled Headline */}
              <h1 className="hero-headline-text">
                {currentSlide.headline.includes(' ') ? (
                  <>
                    {currentSlide.headline.split(' ').slice(0, 2).join(' ')}{' '}
                    <span className="hero-headline-italic">
                      {currentSlide.headline.split(' ').slice(2).join(' ')}
                    </span>
                  </>
                ) : (
                  currentSlide.headline
                )}
              </h1>

              {/* Supporting Description */}
              <p className="hero-desc-text">
                {currentSlide.description}
              </p>

              {/* Primary & Secondary Action Buttons */}
              <div className="hero-action-buttons-group">
                <button
                  type="button"
                  className="hero-primary-btn"
                  onClick={() => onExploreDestination(currentSlide.id)}
                >
                  <span>{currentSlide.ctaText}</span>
                  <Icon name="arrow-right" size={15} />
                </button>

                <button
                  type="button"
                  className="hero-secondary-btn"
                  onClick={() => onSecondaryCta(currentSlide.secondaryCtaAction, currentSlide.id)}
                >
                  {currentSlide.secondaryCtaAction === 'ai' ? (
                    <Icon name="sparkles" size={15} style={{ color: '#e5a93b' }} />
                  ) : (
                    <Icon name="calendar" size={15} />
                  )}
                  <span>{currentSlide.secondaryCtaText}</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right: Subtle Supporting Destination Card (Non-competing) */}
          <div className="hero-destination-side-card">
            <div className="hero-slide-num">
              0{currentIndex + 1} <span className="hero-slide-total">/ 0{HERO_SLIDES.length}</span>
            </div>
            <div className="hero-side-dest-name">{currentSlide.name}</div>
            <div className="hero-side-dest-country">{currentSlide.locationSubtitle}</div>
            <div className="hero-side-dest-quote">{currentSlide.vibe}</div>

            {/* Previous / Next Circular Navigation Arrows */}
            <div className="hero-controls-arrows-cluster">
              <button
                type="button"
                className="hero-circular-nav-btn"
                onClick={prevSlide}
                aria-label="Previous Slide"
              >
                <Icon name="arrow-left" size={15} />
              </button>
              <button
                type="button"
                className="hero-circular-nav-btn"
                onClick={nextSlide}
                aria-label="Next Slide"
              >
                <Icon name="arrow-right" size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Unified Travel Search Panel */}
        <div className="hero-search-placement">
          <DestinationSearch
            onSelectDestination={onExploreDestination}
            onSearchSubmit={onSearchSubmit}
            onChipSelect={onChipSelect}
            onRequestLocation={onRequestLocation}
          />
        </div>

        {/* 6-Slide Progress Dashes (Resets every 5 seconds) */}
        <div className="hero-progress-track" role="tablist" aria-label="Slide Progress Indicator">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              className={`hero-progress-pill-btn ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}: ${slide.name}`}
            >
              {idx === currentIndex ? (
                <div
                  key={timerKey}
                  className="hero-progress-bar-fill"
                />
              ) : idx < currentIndex ? (
                <div className="hero-progress-bar-past" />
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
