import React, { useState } from 'react';
import { EDITORIAL_STORIES } from '../data/experiences';
import { Icon } from './Icons';
import { handleDestinationImageError } from '../services/destinationImageService';

export function EditorialStories({ onExploreDestination }) {
  const [activeStory, setActiveStory] = useState(null);

  return (
    <section className="section-spacing" id="experiences" aria-label="Curated Travel Experiences">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="eyebrow">
            <Icon name="leaf" size={16} />
            <span>LUXURY TRAVEL MAGAZINE</span>
          </div>
          <h2 className="section-title">
            Find places worth taking<br />the long way to.
          </h2>
          <p className="section-desc">
            Editorial chronicles exploring the contemplative calm of tea estates, high-pass
            Trans-Himalayan roads, and legendary alpine rail routes.
          </p>
        </div>

        {/* Stories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {EDITORIAL_STORIES.map((story) => (
            <article
              key={story.id}
              className="destination-card-white"
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveStory(story)}
            >
              <div className="card-media-wrap" style={{ height: '230px' }}>
                <img
                  src={story.image}
                  alt={story.title}
                  className="card-media-img"
                  loading="lazy"
                  onError={(e) => handleDestinationImageError(e, story.title)}
                />
                <div className="card-media-overlay" />
                <span
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    padding: '4px 12px',
                    background: 'rgba(18, 22, 28, 0.7)',
                    color: '#ffffff',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {story.category}
                </span>
              </div>

              <div className="card-body-white">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{story.readTime}</span>
                </div>

                <h3 className="card-title-lg" style={{ fontSize: '1.4rem' }}>{story.title}</h3>
                <p className="card-desc-clean">{story.excerpt}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-orange)', fontWeight: 600, fontSize: '0.9rem', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid rgba(18,22,28,0.06)' }}>
                  <span>Read Article</span>
                  <Icon name="arrow-right" size={14} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Story Reader Modal */}
      {activeStory && (
        <div className="ai-modal-overlay" onClick={() => setActiveStory(null)}>
          <div className="dossier-light-window" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
              <img src={activeStory.image} alt={activeStory.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(18, 22, 28, 0.85) 0%, rgba(18, 22, 28, 0.3) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '32px',
                }}
              >
                <span className="eyebrow" style={{ color: 'var(--accent-orange)' }}>{activeStory.category}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>
                  {activeStory.title}
                </h3>
              </div>

              <button
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(18, 22, 28, 0.7)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => setActiveStory(null)}
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ fontStyle: 'italic', fontSize: '1.15rem', color: 'var(--text-heading)', borderLeft: '3px solid var(--accent-orange)', paddingLeft: '16px', lineHeight: '1.6' }}>
                "{activeStory.subtitle}"
              </div>

              <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8', color: 'var(--text-body)', fontSize: '1.02rem' }}>
                {activeStory.body}
              </div>

              <div style={{ padding: '20px', background: 'var(--bg-sand-light)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-orange)', marginBottom: '10px' }}>
                  EXPERIENCE HIGHLIGHTS
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeStory.highlights.map((h, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-heading)', fontSize: '0.92rem' }}>
                      <Icon name="check" size={14} style={{ color: 'var(--accent-teal)' }} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    const destId = activeStory.destinationId;
                    setActiveStory(null);
                    onExploreDestination(destId);
                  }}
                >
                  <span>Explore Destination Dossier</span>
                  <Icon name="arrow-right" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
