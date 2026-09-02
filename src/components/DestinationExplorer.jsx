import React, { useState, useRef, useEffect } from 'react';
import { DESTINATIONS } from '../data/destinations';
import { Icon } from './Icons';
import { getDestinationPrimaryImage, handleDestinationImageError } from '../services/destinationImageService';

export function DestinationExplorer({
  onSelectDestination,
  savedDestinationIds = [],
  onToggleSave,
}) {
  const [selectedRegion, setSelectedRegion] = useState('India');
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef(null);

  // Region tabs with vector icons matching Image 3
  const REGION_TABS = [
    { id: 'India', label: 'India', icon: 'landmark' },
    { id: 'Asia', label: 'Asia', icon: 'sun' },
    { id: 'Europe', label: 'Europe', icon: 'compass' },
    { id: 'Middle East', label: 'Middle East', icon: 'navigation' },
    { id: 'Africa', label: 'Africa', icon: 'leaf' },
    { id: 'Americas', label: 'Americas', icon: 'map' },
    { id: 'Islands', label: 'Islands', icon: 'sun' },
    { id: 'Australia', label: 'Australia', icon: 'globe' },
  ];

  const handleSelectRegion = (regionId) => {
    setSelectedRegion(regionId);
    // Pause automatic rolling briefly so the user can clearly see their selection
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 4000); // 4-second comfortable pause
  };

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  const regionDests = DESTINATIONS.filter((d) => {
    if (selectedRegion === 'Asia') {
      return d.region === 'Asia' || d.id === 'bali' || d.country === 'Indonesia';
    }
    if (selectedRegion === 'Islands') {
      return d.region === 'Islands' || d.id === 'bali';
    }
    return d.region === selectedRegion;
  });
  const showcaseDests = regionDests.length >= 6
    ? regionDests.slice(0, 6)
    : regionDests.length > 0
      ? regionDests
      : DESTINATIONS.filter((d) => d.region === 'India').slice(0, 6);

  return (
    <section className="where-next-section" id="destinations" aria-label="Where will you go next">
      <div className="container-xl">
        {/* Section Header Row (Matching Image 3) */}
        <div className="where-next-header-row">
          <div className="where-next-left">
            <div className="where-next-eyebrow">EXPLORE THE WORLD</div>
            <h2 className="where-next-title">Where will you go next?</h2>
            <p className="where-next-subtitle">
              From misty mountains to tropical beaches, the world is full of places waiting for you.
            </p>
            <button
              className="btn-view-all"
              onClick={() => {
                const elem = document.getElementById('popular-trips');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>View All Destinations</span>
              <Icon name="arrow-right" size={14} />
            </button>
          </div>

          {/* Region Icon Tabs (Mobile: Automatic Rolling Track, Desktop: Clean Wrapped Grid) */}
          <div className="region-icon-tabs destination-selector" role="tablist" aria-label="Destinations & Regions">
            <div className={`destination-rolling-track ${isPaused ? 'paused' : ''}`}>
              {/* Primary list */}
              {REGION_TABS.map((tab) => (
                <button
                  key={`primary-${tab.id}`}
                  className={`region-icon-tab destination-selector-item ${selectedRegion === tab.id ? 'active' : ''}`}
                  onClick={() => handleSelectRegion(tab.id)}
                  role="tab"
                  aria-selected={selectedRegion === tab.id}
                  title={`Select ${tab.label}`}
                >
                  <div className="region-tab-icon">
                    <Icon name={tab.icon} size={22} />
                  </div>
                  <span>{tab.label}</span>
                </button>
              ))}

              {/* Duplicated list for seamless infinite rolling loop on mobile */}
              <div className="destination-rolling-track-dup" aria-hidden="true">
                {REGION_TABS.map((tab) => (
                  <button
                    key={`dup-${tab.id}`}
                    tabIndex={-1}
                    className={`region-icon-tab destination-selector-item ${selectedRegion === tab.id ? 'active' : ''}`}
                    onClick={() => handleSelectRegion(tab.id)}
                    role="tab"
                    aria-selected={selectedRegion === tab.id}
                    title={`Select ${tab.label}`}
                  >
                    <div className="region-tab-icon">
                      <Icon name={tab.icon} size={22} />
                    </div>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 6 Portrait Destination Cards (Side by Side, Matching Image 3) */}
        <div className="destinations-portrait-grid">
          {showcaseDests.map((dest) => {
            const isSaved = savedDestinationIds.includes(dest.id);
            const fullDest = DESTINATIONS.find((d) => d.id === dest.id) || dest;
            return (
              <div
                key={dest.id}
                className="portrait-card"
                onClick={() => onSelectDestination(dest.id)}
              >
                <img
                  src={getDestinationPrimaryImage(dest.id, dest.image)}
                  alt={dest.name}
                  className="portrait-card-bg"
                  loading="lazy"
                  onError={(e) => handleDestinationImageError(e, dest.id || dest.name)}
                />
                <div className="portrait-card-overlay" />

                {/* Heart Button */}
                <button
                  className={`portrait-card-heart ${isSaved ? 'saved' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(fullDest);
                  }}
                  title={isSaved ? 'Saved' : 'Save'}
                  aria-label="Save Destination"
                >
                  <Icon name={isSaved ? 'heart-filled' : 'heart'} size={16} />
                </button>

                {/* Card Bottom Meta */}
                <div className="portrait-card-content">
                  <div className="portrait-card-title">{dest.name}</div>
                  <div className="portrait-card-country">{dest.country}</div>
                  <div className="portrait-card-season">{dest.bestTime}</div>
                </div>

                {/* Circular Orange Arrow Button (Matching Image 3) */}
                <div className="portrait-circle-arrow-btn">
                  <Icon name="arrow-right" size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
