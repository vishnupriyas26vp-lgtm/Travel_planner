import React from 'react';
import { Icon } from './Icons';

export function FinalConversion({ onStartPlan, onExploreClick }) {
  return (
    <section className="final-conversion-dark" aria-label="Start Your Journey">
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="eyebrow" style={{ justifyContent: 'center', color: 'var(--accent-orange)' }}>
          <Icon name="sparkles" size={16} />
          <span>YOUR NEXT STORY STARTS HERE</span>
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 5vw, 4.4rem)', fontWeight: 800, color: '#ffffff', marginBottom: '18px', letterSpacing: '-0.02em' }}>
          Ready to go somewhere?
        </h2>

        <p style={{ fontSize: '1.2rem', color: '#efeae1', maxWidth: '620px', margin: '0 auto 36px auto', lineHeight: '1.6' }}>
          Tell DK AI what you're dreaming about. We'll help you turn it into a trip.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={onStartPlan}
            style={{ padding: '16px 36px', fontSize: '1.05rem' }}
          >
            <span>Plan My Trip</span>
            <Icon name="arrow-right" size={18} />
          </button>

          <button
            className="btn-secondary"
            onClick={onExploreClick}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              padding: '15px 32px',
              fontSize: '1rem',
            }}
          >
            <span>Explore Destinations</span>
          </button>
        </div>
      </div>
    </section>
  );
}
