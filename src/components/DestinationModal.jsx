import React, { useState, useEffect, useRef } from 'react';
import { DESTINATIONS } from '../data/destinations';
import { fetchLiveWeather } from '../services/weatherService';
import { getDestinationPrimaryImage, handleDestinationImageError } from '../services/destinationImageService';
import { Icon } from './Icons';

export function DestinationModal({
  destinationId,
  onClose,
  onBuildItinerary,
  onAskAi,
  onViewWeather,
  isSaved,
  onToggleSave,
}) {
  const [weather, setWeather] = useState(null);
  const destination = destinationId ? DESTINATIONS.find((d) => d.id === destinationId) : null;
  const savedScrollYRef = useRef(0);

  // Safely release fixed scroll lock and restore smooth native scrolling
  const releaseScrollLock = () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.classList.remove('modal-open');
    document.documentElement.classList.remove('modal-open');
    if (savedScrollYRef.current > 0) {
      window.scrollTo(0, savedScrollYRef.current);
    }
  };

  // Safe close handler that restores scrolling immediately before parent state change
  const handleSafeClose = () => {
    releaseScrollLock();
    if (onClose) onClose();
  };

  // Lock body & html scroll completely and fix background in place when modal is open
  useEffect(() => {
    if (!destinationId || !destination) {
      releaseScrollLock();
      return;
    }

    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    savedScrollYRef.current = scrollY;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    document.documentElement.classList.add('modal-open');

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleSafeClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      releaseScrollLock();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [destinationId]);

  useEffect(() => {
    if (!destination) {
      setWeather(null);
      return;
    }
    let isMounted = true;
    const loadWeather = async () => {
      const data = await fetchLiveWeather(
        destination.coordinates.lat,
        destination.coordinates.lon,
        destination.id
      );
      if (isMounted) setWeather(data);
    };
    loadWeather();
    return () => {
      isMounted = false;
    };
  }, [destination]);

  // If no destination is selected or found, render nothing (after all hooks have run)
  if (!destinationId || !destination) return null;

  return (
    <div
      className="ai-modal-overlay"
      onClick={handleSafeClose}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      onWheel={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="dossier-light-window" onClick={(e) => e.stopPropagation()}>
        {/* Sticky Top Bar with "Back to Home" and Close (Always visible even when scrolled) */}
        <div className="dossier-sticky-top-bar">
          <button
            type="button"
            className="dossier-back-home-btn"
            onClick={handleSafeClose}
            aria-label="Back to Home"
          >
            <Icon name="arrow-left" size={16} />
            <span>Back to Home</span>
          </button>

          <div className="dossier-sticky-title">
            {destination.name} · {destination.country}
          </div>

          <button
            type="button"
            className="dossier-close-circle-btn"
            onClick={handleSafeClose}
            aria-label="Close and return to Home"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Hero Banner Header */}
        <div style={{ position: 'relative', height: '360px', overflow: 'hidden' }}>
          <img
            src={getDestinationPrimaryImage(destination.id, destination.image)}
            alt={destination.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => handleDestinationImageError(e, destination.id || destination.name)}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(18, 22, 28, 0.85) 0%, rgba(18, 22, 28, 0.3) 50%, rgba(18, 22, 28, 0.5) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '36px',
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-orange)', letterSpacing: '0.12em' }}>
              {destination.state ? `${destination.state} · ` : ''}{destination.country}
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 800, color: '#ffffff', lineHeight: '1.1', marginTop: '4px' }}>
              {destination.name}
            </h1>
            <p style={{ color: '#efeae1', fontSize: '1.05rem', maxWidth: '640px', marginTop: '8px' }}>
              {destination.shortDesc}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSafeClose}
            className="dossier-hero-back-pill"
            aria-label="Back to Home"
          >
            <Icon name="arrow-left" size={15} />
            <span>Back to Home</span>
          </button>

          <button
            type="button"
            onClick={handleSafeClose}
            className="dossier-hero-close-pill"
            aria-label="Close Dossier"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Action Header Strip */}
        <div
          style={{
            padding: '16px 36px',
            background: 'var(--bg-sand-light)',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              onClick={handleSafeClose}
            >
              <Icon name="arrow-left" size={14} />
              <span>Back to Home</span>
            </button>

            <button
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              onClick={() => onToggleSave(destination)}
            >
              <Icon name={isSaved ? 'heart-filled' : 'heart'} size={16} />
              <span>{isSaved ? 'Saved to Journey' : 'Save'}</span>
            </button>

            <button
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              onClick={() => {
                handleSafeClose();
                onAskAi(destination);
              }}
            >
              <Icon name="sparkles" size={16} />
              <span>Ask DK AI</span>
            </button>

            <button
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              onClick={() => {
                handleSafeClose();
                onViewWeather(destination.id);
              }}
            >
              <Icon name="sun" size={16} />
              <span>Check Weather</span>
            </button>
          </div>

          <button
            className="btn-primary"
            style={{ padding: '9px 20px', fontSize: '0.88rem' }}
            onClick={() => {
              handleSafeClose();
              onBuildItinerary(destination.id);
            }}
          >
            <span>Plan This Trip →</span>
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {/* Quick Key Facts Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px',
              padding: '20px',
              background: 'var(--bg-sand-light)',
              borderRadius: '16px',
              border: '1px solid var(--border-light)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>IDEAL DURATION</div>
              <div style={{ fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px' }}>{destination.duration}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>BEST TIME TO VISIT</div>
              <div style={{ fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px' }}>{destination.bestTime}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>ELEVATION / VIBE</div>
              <div style={{ fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px' }}>{destination.elevation}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>IDEAL FOR</div>
              <div style={{ fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px' }}>{destination.idealFor}</div>
            </div>
          </div>

          {/* Live Weather Strip */}
          {weather && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: '#fff9f3',
                border: '1px solid rgba(242, 106, 54, 0.2)',
                borderRadius: '16px',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Icon name={weather.icon} size={28} style={{ color: 'var(--accent-orange)' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-heading)' }}>
                    Current Atmospheric Condition: {weather.temp}°C
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {weather.condition} · Feels like {weather.apparentTemp}°C · Wind {weather.wind} km/h
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-body)' }}>
                High/Low: <strong>{weather.high}° / {weather.low}°C</strong> · Humidity <strong>{weather.humidity}%</strong>
              </div>
            </div>
          )}

          {/* Why Visit */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '10px' }}>
              Why Visit {destination.name}?
            </h3>
            <p style={{ color: 'var(--text-body)', fontSize: '1.02rem', lineHeight: '1.7' }}>
              {destination.whyGo}
            </p>
          </div>

          {/* Top Places to Visit */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '16px' }}>
              Top Places to Explore
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {destination.famousPlaces.map((spot, i) => (
                <div key={i} style={{ background: 'var(--bg-sand-light)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                  <img
                    src={spot.image}
                    alt={spot.name}
                    style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                    onError={(e) => handleDestinationImageError(e, spot.name || destination.id)}
                  />
                  <div style={{ padding: '16px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
                      {spot.tag}
                    </span>
                    <h4 style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '1rem', marginTop: '2px', marginBottom: '6px' }}>
                      {spot.name}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                      {spot.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local Food & Dining */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '14px' }}>
              Local Culinary Specialties
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {destination.cuisine.map((dish, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 16px',
                    background: 'var(--bg-sand-light)',
                    borderRadius: '999px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--text-heading)',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  🍴 {dish}
                </div>
              ))}
            </div>
          </div>

          {/* Getting Around & Where to Stay */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ padding: '20px', background: 'var(--bg-sand-light)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <h4 style={{ fontWeight: 700, color: 'var(--text-heading)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="compass" size={16} style={{ color: 'var(--accent-orange)' }} />
                <span>Getting Around</span>
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: '1.6' }}>
                {destination.gettingAround}
              </p>
            </div>

            <div style={{ padding: '20px', background: 'var(--bg-sand-light)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <h4 style={{ fontWeight: 700, color: 'var(--text-heading)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="heart" size={16} style={{ color: 'var(--accent-orange)' }} />
                <span>Where to Stay</span>
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: '1.6' }}>
                {destination.whereToStay}
              </p>
            </div>
          </div>

          {/* Practical Info & Visa Caveat */}
          <div style={{ padding: '20px', background: '#f5f7fa', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-heading)', marginBottom: '6px' }}>
              Practical Travel Considerations:
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: '1.6', marginBottom: '8px' }}>
              <strong>Packing:</strong> {destination.practicalInfo?.packing}
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', fontStyle: 'italic' }}>
              *<strong>Visa Guidance Caveat:</strong> {destination.practicalInfo?.visaNote}
            </p>
          </div>

          {/* Footer CTA with Back to Home & Plan Trip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-light)',
            }}
          >
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              onClick={handleSafeClose}
            >
              <Icon name="arrow-left" size={15} />
              <span>Back to Home</span>
            </button>

            <button
              type="button"
              className="btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.88rem' }}
              onClick={() => {
                handleSafeClose();
                onBuildItinerary(destination.id);
              }}
            >
              <span>✦ Build Day-by-Day Itinerary for {destination.name}</span>
              <Icon name="arrow-right" size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
