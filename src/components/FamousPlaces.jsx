import React from 'react';
import { FAMOUS_PLACES } from '../data/famousPlaces';
import { Icon } from './Icons';
import { handleDestinationImageError } from '../services/destinationImageService';

export function FamousPlaces({ onSelectRelatedDestination }) {
  return (
    <section className="section-spacing" style={{ background: 'var(--bg-secondary)' }} aria-label="Famous Places Worldwide">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="eyebrow">
            <Icon name="landmark" size={16} />
            <span>ICONIC GLOBAL LANDMARKS</span>
          </div>
          <h2 className="section-title">
            Famous places that live<br />in the imagination.
          </h2>
          <p className="section-desc">
            From centuries-old alpine massifs and sacred temple cliffs to architectural marvels
            piercing the desert sky.
          </p>
        </div>

        {/* Famous Places Grid (No Empty Cards!) */}
        <div className="famous-places-grid">
          {FAMOUS_PLACES.map((place) => (
            <article key={place.id} className="famous-place-card">
              <div className="place-img-wrap">
                <img
                  src={place.image}
                  alt={place.name}
                  loading="lazy"
                  onError={(e) => handleDestinationImageError(e, place.name)}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    padding: '4px 12px',
                    background: 'rgba(18, 22, 28, 0.75)',
                    color: '#ffffff',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {place.tag}
                </span>
              </div>

              <div className="place-body">
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-orange)', marginBottom: '4px' }}>
                  {place.location}
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '10px' }}>
                  {place.name}
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: '1.6', marginBottom: '16px', flex: 1 }}>
                  {place.whyVisit}
                </p>

                <div style={{ padding: '10px 14px', background: 'var(--bg-sand-light)', borderRadius: '12px', fontSize: '0.82rem', marginBottom: '18px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Best Time to Visit: </span>
                  <strong style={{ color: 'var(--text-heading)' }}>{place.bestTime}</strong>
                </div>

                <button
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'space-between', padding: '10px 18px', fontSize: '0.88rem' }}
                  onClick={() => onSelectRelatedDestination(place.relatedDestinationId)}
                >
                  <span>Explore Destination</span>
                  <Icon name="arrow-right" size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
