import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icons';
import { DESTINATIONS } from '../data/destinations';

export function DestinationSearch({
  onSelectDestination,
  onSearchSubmit,
  onChipSelect,
  onRequestLocation,
}) {
  const [destinationQuery, setDestinationQuery] = useState('');
  const [durationQuery, setDurationQuery] = useState('3–5 Days');
  const [styleQuery, setStyleQuery] = useState('All Styles');
  const [travelersQuery, setTravelersQuery] = useState('2 Travelers');
  const [isOpenSuggestions, setIsOpenSuggestions] = useState(false);

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Quick Discovery Chips
  const DISCOVERY_CHIPS = [
    { id: 'mountains', label: 'Mountain Escapes', icon: 'mountain' },
    { id: 'nature', label: 'Nature Retreats', icon: 'leaf' },
    { id: 'beaches', label: 'Beach Escapes', icon: 'sun' },
    { id: 'romance', label: 'Romantic Getaways', icon: 'heart' },
    { id: 'culture', label: 'Culture & Heritage', icon: 'landmark' },
    { id: 'weekend', label: 'Weekend Trips', icon: 'compass' },
  ];

  const POPULAR_SUGGESTIONS = [
    { id: 'manali', name: 'Manali', country: 'India', tag: 'Snow & Valley' },
    { id: 'coorg', name: 'Coorg', country: 'India', tag: 'Coffee Highlands' },
    { id: 'swiss-alps', name: 'Swiss Alps', country: 'Switzerland', tag: 'Alpine Peaks' },
    { id: 'bali', name: 'Bali', country: 'Indonesia', tag: 'Temples & Beaches' },
    { id: 'ladakh', name: 'Ladakh', country: 'India', tag: 'Himalayan Passes' },
    { id: 'munnar', name: 'Munnar', country: 'India', tag: 'Tea Highlands' },
  ];

  // Shortcut key '/'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpenSuggestions(true);
      } else if (e.key === 'Escape') {
        setIsOpenSuggestions(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpenSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter destinations
  const matches = destinationQuery.trim() === ''
    ? []
    : DESTINATIONS.filter((d) => {
        const q = destinationQuery.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          (d.region && d.region.toLowerCase().includes(q)) ||
          (d.tag && d.tag.toLowerCase().includes(q))
        );
      });

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setIsOpenSuggestions(false);
    if (matches.length > 0) {
      onSelectDestination(matches[0].id);
    } else if (destinationQuery.trim()) {
      onSearchSubmit(destinationQuery.trim());
    } else {
      const elem = document.getElementById('destinations');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="unified-search-panel-container" ref={containerRef}>
      {/* 1. Single Polished Travel Search Bar (Desktop: Single Row, Mobile: Clean Stack) */}
      <form
        onSubmit={handleSubmit}
        className={`unified-search-bar ${isOpenSuggestions ? 'has-open-suggestions' : ''}`}
        role="search"
      >
        {/* Field 1: Destination */}
        <div className={`search-field-segment search-dest-segment ${isOpenSuggestions ? 'active-dropdown' : ''}`}>
          <div className="search-segment-icon">
            <Icon name="map-pin" size={18} />
          </div>
          <div className="search-segment-content">
            <label htmlFor="hero-dest-input" className="search-mini-label">
              WHERE TO?
            </label>
            <input
              id="hero-dest-input"
              ref={inputRef}
              type="text"
              className="search-transparent-input"
              placeholder="Search destination, city, country..."
              value={destinationQuery}
              onChange={(e) => {
                setDestinationQuery(e.target.value);
                setIsOpenSuggestions(true);
              }}
              onFocus={() => setIsOpenSuggestions(true)}
              autoComplete="off"
            />
          </div>

          {/* Autocomplete / Suggestions Dropdown */}
          {isOpenSuggestions && (
            <div className="search-suggestions-dropdown">
              <div className="dropdown-section-title">
                {destinationQuery.trim() ? 'MATCHING DESTINATIONS' : 'POPULAR DESTINATIONS'}
              </div>
              <div className="dropdown-list">
                {(destinationQuery.trim() ? matches : POPULAR_SUGGESTIONS).map((dest) => (
                  <button
                    key={dest.id}
                    type="button"
                    className="dropdown-item-btn"
                    onClick={() => {
                      onSelectDestination(dest.id);
                      setDestinationQuery(dest.name);
                      setIsOpenSuggestions(false);
                    }}
                  >
                    <div className="dropdown-item-info">
                      <span className="dropdown-item-name">{dest.name}</span>
                      <span className="dropdown-item-country">{dest.country}</span>
                    </div>
                    <span className="dropdown-item-tag">{dest.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="search-divider" />

        {/* Field 2: Dates / Duration */}
        <div className="search-field-segment">
          <div className="search-segment-icon">
            <Icon name="calendar" size={18} />
          </div>
          <div className="search-segment-content">
            <span className="search-mini-label">DURATION</span>
            <select
              className="search-transparent-select"
              value={durationQuery}
              onChange={(e) => setDurationQuery(e.target.value)}
              aria-label="Trip Duration"
            >
              <option value="Weekend (2–3 Days)">Weekend (2–3 Days)</option>
              <option value="3–5 Days">Holiday (3–5 Days)</option>
              <option value="1 Week (6–8 Days)">1 Week (6–8 Days)</option>
              <option value="10+ Days">Extended (10+ Days)</option>
            </select>
          </div>
        </div>

        <div className="search-divider" />

        {/* Field 3: Travel Style */}
        <div className="search-field-segment">
          <div className="search-segment-icon">
            <Icon name="heart" size={18} />
          </div>
          <div className="search-segment-content">
            <span className="search-mini-label">TRAVEL STYLE</span>
            <select
              className="search-transparent-select"
              value={styleQuery}
              onChange={(e) => setStyleQuery(e.target.value)}
              aria-label="Travel Style"
            >
              <option value="All Styles">All Travel Styles</option>
              <option value="Mountain Escapes">Mountain Escapes</option>
              <option value="Nature Retreats">Nature Retreats</option>
              <option value="Beach & Islands">Beach & Islands</option>
              <option value="Romantic Getaways">Romantic Getaways</option>
              <option value="Cultural Heritage">Cultural Heritage</option>
            </select>
          </div>
        </div>

        <div className="search-divider" />

        {/* Field 4: Travelers */}
        <div className="search-field-segment">
          <div className="search-segment-icon">
            <Icon name="user" size={18} />
          </div>
          <div className="search-segment-content">
            <span className="search-mini-label">TRAVELERS</span>
            <select
              className="search-transparent-select"
              value={travelersQuery}
              onChange={(e) => setTravelersQuery(e.target.value)}
              aria-label="Number of Travelers"
            >
              <option value="Solo Traveler">Solo Traveler</option>
              <option value="2 Travelers (Couple)">2 Travelers (Couple)</option>
              <option value="Family (3–5)">Family (3–5)</option>
              <option value="Friends Group (4+)">Friends Group (4+)</option>
            </select>
          </div>
        </div>

        {/* Action: Explore Button */}
        <div className="search-action-segment">
          <button type="submit" className="search-unified-submit-btn" aria-label="Search Destinations">
            <span>EXPLORE</span>
            <Icon name="arrow-right" size={15} />
          </button>
        </div>
      </form>

      {/* 2. Quick Discovery Category Pills (Contained, Zero Horizontal Overflow) */}
      <div className="contained-category-pills-row" role="tablist" aria-label="Quick Categories">
        {DISCOVERY_CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className="category-pill-item"
            onClick={() => {
              if (onChipSelect) onChipSelect(chip.id);
              const elem = document.getElementById('destinations');
              if (elem) elem.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Icon name={chip.icon} size={13} />
            <span>{chip.label}</span>
          </button>
        ))}

        {onRequestLocation && (
          <button
            type="button"
            className="category-pill-item location-chip"
            onClick={onRequestLocation}
          >
            <Icon name="navigation" size={13} />
            <span>Near Me</span>
          </button>
        )}
      </div>
    </div>
  );
}
