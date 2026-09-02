import React from 'react';
import { Icon } from './Icons';
import { getDestinationPrimaryImage, handleDestinationImageError } from '../services/destinationImageService';

export function SavedTripsModal({
  isOpen,
  onClose,
  savedDestinations = [],
  savedItineraries = [],
  onRemoveDestination,
  onRemoveItinerary,
  onSelectDestination,
  onLoadSavedItinerary,
}) {
  if (!isOpen) return null;

  return (
    <div className="ai-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="dossier-light-window" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <div style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-sand-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icon name="heart-filled" size={24} style={{ color: 'var(--accent-orange)' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              My Journey Wishlist & Saved Trips
            </h2>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: '6px' }} aria-label="Close Wishlist">
            <Icon name="x" size={20} />
          </button>
        </div>

        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {/* Saved Destinations Section */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-orange)', marginBottom: '16px' }}>
              SAVED DESTINATIONS ({savedDestinations.length})
            </div>

            {savedDestinations.length === 0 ? (
              <div style={{ padding: '24px', background: 'var(--bg-sand-light)', borderRadius: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                No destinations bookmarked yet. Tap the ♡ heart on any destination card to save it to your journey.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {savedDestinations.map((dest) => (
                  <div
                    key={dest.id}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-subtle)',
                    }}
                  >
                    <img
                      src={getDestinationPrimaryImage(dest.id, dest.image)}
                      alt={dest.name}
                      style={{ width: '100%', height: '110px', objectFit: 'cover' }}
                      onError={(e) => handleDestinationImageError(e, dest.id || dest.name)}
                    />
                    <div style={{ padding: '14px' }}>
                      <h4 style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '1rem' }}>{dest.name}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{dest.country}</div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <button
                          style={{ color: 'var(--accent-orange)', fontWeight: 600, fontSize: '0.82rem' }}
                          onClick={() => {
                            onClose();
                            onSelectDestination(dest.id);
                          }}
                        >
                          View Dossier →
                        </button>

                        <button
                          style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}
                          onClick={() => onRemoveDestination(dest.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Itineraries Section */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-orange)', marginBottom: '16px' }}>
              SAVED ITINERARIES ({savedItineraries.length})
            </div>

            {savedItineraries.length === 0 ? (
              <div style={{ padding: '24px', background: 'var(--bg-sand-light)', borderRadius: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                No generated itineraries saved. Build a custom trip in the Trip Architect and click "Save Itinerary" to store it here.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {savedItineraries.map((itinerary) => (
                  <div
                    key={itinerary.id}
                    style={{
                      padding: '16px 20px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-subtle)',
                    }}
                  >
                    <div>
                      <h4 style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '1.05rem' }}>
                        {itinerary.durationDays}-Day {itinerary.destinationName} Itinerary
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Pacing: {itinerary.travelStyle} · Saved on {new Date(itinerary.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                        onClick={() => {
                          onClose();
                          onLoadSavedItinerary(itinerary);
                        }}
                      >
                        Load Plan
                      </button>

                      <button
                        style={{ color: 'var(--text-muted)', fontSize: '0.82rem', padding: '6px' }}
                        onClick={() => onRemoveItinerary(itinerary.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
