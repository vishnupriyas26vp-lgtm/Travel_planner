import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';
import { fetchLiveWeather } from '../services/weatherService';
import { getDestinationPrimaryImage, handleDestinationImageError } from '../services/destinationImageService';

export function DestinationCard({
  destination,
  isSaved,
  onToggleSave,
  onSelect,
  onPlanTrip,
  userDistance,
}) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
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

  return (
    <article className="destination-card" onClick={() => onSelect(destination.id)}>
      {/* Media & Badges */}
      <div className="destination-card-media">
        <img
          src={getDestinationPrimaryImage(destination.id, destination.image)}
          alt={`${destination.name}, ${destination.country}`}
          className="destination-card-img"
          loading="lazy"
          onError={(e) => handleDestinationImageError(e, destination.id || destination.name)}
        />
        <div className="destination-card-overlay" />

        <div className="card-top-badges">
          <span className="tag-pill">{destination.tag}</span>

          <button
            className={`save-heart-btn ${isSaved ? 'saved' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(destination);
            }}
            title={isSaved ? 'Remove from Saved' : 'Save to My Journey'}
            aria-label={`Save ${destination.name}`}
          >
            <Icon name={isSaved ? 'heart-filled' : 'heart'} size={18} />
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="destination-card-body">
        <div className="card-location-meta">
          {destination.state ? `${destination.state} · ` : ''}
          {destination.country}
        </div>

        <h3 className="card-destination-name">{destination.name}</h3>

        <p className="card-desc">{destination.shortDesc}</p>

        {/* Live Weather & Distance Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          {weather && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                color: '#ffb443',
                background: 'rgba(255, 180, 67, 0.1)',
                padding: '4px 10px',
                borderRadius: '8px',
              }}
              title="Real-time Weather"
            >
              <Icon name={weather.icon} size={14} />
              <span style={{ fontWeight: 600 }}>{weather.temp}°C</span>
              <span style={{ color: '#a3b1c2', fontSize: '0.75rem' }}>{weather.condition}</span>
            </div>
          )}

          {userDistance && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                color: '#4ed1c7',
                background: 'rgba(37, 143, 135, 0.12)',
                padding: '4px 10px',
                borderRadius: '8px',
              }}
            >
              <Icon name="navigation" size={12} />
              <span>{userDistance.toLocaleString()} km from you</span>
            </div>
          )}
        </div>

        {/* Footer Meta & CTAs */}
        <div className="card-footer-stats">
          <div className="stat-chip">
            <Icon name="calendar" size={14} />
            <span>{destination.duration}</span>
          </div>

          <span className="card-cta-link">
            <span>Explore Dossier</span>
            <Icon name="arrow-right" size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}
