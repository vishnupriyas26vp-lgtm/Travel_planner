import React from 'react';
import { Icon } from './Icons';

export function QuickActionCards({
  onCheckWeather,
  onUseLocation,
  onOpenAiPlanner,
  onOpenItineraryPlanner,
}) {
  return (
    <section className="feature-cards-section" aria-label="Feature Quick Actions">
      <div className="container-xl">
        <div className="feature-cards-grid">
          {/* Card 1: Know before you go (Weather) */}
          <div
            className="feature-action-card card-weather-style"
            onClick={onCheckWeather}
          >
            <div>
              <h3 className="feature-card-heading">Know before you go</h3>
              <p className="feature-card-desc">Check real-time weather anywhere in the world.</p>
            </div>
            <div className="feature-card-link">
              <span>Check Weather</span>
              <Icon name="arrow-right" size={14} />
            </div>
            <div className="feature-card-icon-art">
              <Icon name="sun" size={38} style={{ color: '#ffb443', opacity: 0.85 }} />
            </div>
          </div>

          {/* Card 2: Explore around you (Location) */}
          <div
            className="feature-action-card card-explore-style"
            onClick={onUseLocation}
          >
            <div>
              <h3 className="feature-card-heading">Explore around you</h3>
              <p className="feature-card-desc">Let us find the best places near your location.</p>
            </div>
            <div className="feature-card-link">
              <span>Use My Location</span>
              <Icon name="arrow-right" size={14} />
            </div>
            <div className="feature-card-icon-art">
              <Icon name="navigation" size={36} style={{ color: '#ffffff', opacity: 0.8 }} />
            </div>
          </div>

          {/* Card 3: AI Trip Planner */}
          <div
            className="feature-action-card card-ai-style"
            onClick={onOpenAiPlanner}
          >
            <div>
              <h3 className="feature-card-heading">AI Trip Planner</h3>
              <p className="feature-card-desc">Your travel companion for smart planning.</p>
            </div>
            <div className="feature-card-link">
              <span>Start Planning</span>
              <Icon name="arrow-right" size={14} />
            </div>
            <div className="feature-card-icon-art">
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #866bf5, #2a2254)',
                  boxShadow: '0 0 16px rgba(134, 107, 245, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="sparkles" size={20} style={{ color: '#ffffff' }} />
              </div>
            </div>
          </div>

          {/* Card 4: Plan your itinerary */}
          <div
            className="feature-action-card card-itinerary-style"
            onClick={onOpenItineraryPlanner}
          >
            <div>
              <h3 className="feature-card-heading">Plan your itinerary</h3>
              <p className="feature-card-desc">Get a personalized day-by-day itinerary in seconds.</p>
            </div>
            <div className="feature-card-link">
              <span>Plan My Trip</span>
              <Icon name="arrow-right" size={14} />
            </div>
            <div className="feature-card-icon-art">
              <Icon name="calendar" size={36} style={{ color: '#ffffff', opacity: 0.8 }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
