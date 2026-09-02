import React, { useState } from 'react';
import { DESTINATIONS, INTEREST_CATEGORIES } from '../data/destinations';
import { DestinationCard } from './DestinationCard';
import { calculateDistanceKm } from '../services/locationService';
import { Icon } from './Icons';

export function DestinationGrid({
  activeCategory,
  onCategoryChange,
  savedDestinationIds = [],
  onToggleSave,
  onSelectDestination,
  onPlanTrip,
  userLocation,
}) {
  const filtered = activeCategory === 'all'
    ? DESTINATIONS
    : DESTINATIONS.filter((d) => d.categories.includes(activeCategory));

  return (
    <section className="section-spacing" id="destinations" aria-label="Curated Destinations">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="eyebrow">
            <Icon name="compass" size={16} />
            <span>DISCOVER EXTRAORDINARY PLACES</span>
          </div>
          <h2 className="section-title">
            Some places are better<br />experienced than explained.
          </h2>
          <p className="section-desc">
            Explore hand-curated sanctuaries across the Himalayas, emerald Western Ghats,
            tropical archipelagos, and alpine peaks.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="categories-filter-bar" role="tablist" aria-label="Destination Categories">
          {INTEREST_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat.id)}
              role="tab"
              aria-selected={activeCategory === cat.id}
            >
              <Icon name={cat.icon} size={15} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Varied Editorial Grid */}
        <div className="destinations-grid">
          {filtered.map((dest) => {
            let distance = null;
            if (userLocation?.lat && userLocation?.lon) {
              distance = calculateDistanceKm(
                userLocation.lat,
                userLocation.lon,
                dest.coordinates.lat,
                dest.coordinates.lon
              );
            }

            return (
              <DestinationCard
                key={dest.id}
                destination={dest}
                isSaved={savedDestinationIds.includes(dest.id)}
                onToggleSave={onToggleSave}
                onSelect={onSelectDestination}
                onPlanTrip={onPlanTrip}
                userDistance={distance}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
