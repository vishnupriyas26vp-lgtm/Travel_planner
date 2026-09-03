import React, { useState, useEffect } from 'react';
import { DESTINATIONS } from '../data/destinations';
import { fetchLiveWeather, fetchWeatherByCityName } from '../services/weatherService';
import { Icon } from './Icons';

export function WeatherExperience({
  userLocation,
  onRequestLocation,
  isLocating,
  onPlanTrip,
}) {
  const [activeCityId, setActiveCityId] = useState('manali');
  const [searchCityQuery, setSearchCityQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [emptySearch, setEmptySearch] = useState(false);

  const activeDest = DESTINATIONS.find((d) => d.id === activeCityId) || DESTINATIONS[0];

  const loadWeatherForCoords = async (lat, lon, label) => {
    setIsLoading(true);
    setHasError(false);
    setEmptySearch(false);
    try {
      const data = await fetchLiveWeather(lat, lon);
      setWeatherData({ ...data, cityName: label || activeDest.name });
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherForCoords(activeDest.coordinates.lat, activeDest.coordinates.lon, activeDest.name);
  }, [activeCityId]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchCityQuery.trim()) return;

    setIsLoading(true);
    setHasError(false);
    setEmptySearch(false);

    try {
      const result = await fetchWeatherByCityName(searchCityQuery.trim());
      if (result) {
        setWeatherData(result);
      } else {
        setEmptySearch(true);
      }
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section-spacing" id="weather" style={{ background: '#faf9f6' }} aria-label="Weather Intelligence">
      <div className="container-xl">
        {/* Section Header */}
        <div className="section-header" style={{ maxWidth: '780px' }}>
          <div className="eyebrow">
            <Icon name="sun" size={16} />
            <span>REAL-TIME TRAVEL CLIMATOLOGY</span>
          </div>
          <h2 className="section-title">Know before you go.</h2>
          <p className="section-desc">
            Atmospheric conditions determine the difference between a scenic mountain drive and
            a foggy whiteout. Review real-time conditions before architecting your itinerary.
          </p>
        </div>

        {/* Location & Search Controls Bar */}
        <div
          className="weather-controls-bar"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '20px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          }}
        >
          {/* Left Location status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#e6f4f2',
                color: '#228b84',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="navigation" size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {userLocation?.city ? `Detected Location: ${userLocation.city}` : 'Want travel recommendations near you?'}
              </div>
            </div>
          </div>

          {/* Right: Search Destination City Input & Location Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Search any destination city..."
                value={searchCityQuery}
                onChange={(e) => setSearchCityQuery(e.target.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  minWidth: '220px',
                }}
              />
              <button
                type="submit"
                className="search-explore-btn"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Search
              </button>
            </form>

            <button
              type="button"
              className="btn-view-all"
              onClick={onRequestLocation}
              disabled={isLocating}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Icon name="navigation" size={13} />
              <span>{isLocating ? 'Locating...' : 'Use My Location'}</span>
            </button>
          </div>
        </div>

        {/* Live Weather Card Display */}
        <div className="weather-card-container">
          {/* Quick Destination Pills */}
          <div className="weather-dest-pills-row" role="tablist">
            {DESTINATIONS.map((dest) => (
              <button
                key={dest.id}
                type="button"
                onClick={() => {
                  setActiveCityId(dest.id);
                  setSearchCityQuery('');
                }}
                className={`weather-dest-pill-btn ${activeCityId === dest.id && !searchCityQuery ? 'active' : ''}`}
              >
                {dest.name} ({dest.country})
              </button>
            ))}
          </div>

          {/* Loading Skeleton */}
          {isLoading ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Icon name="sun" size={36} style={{ color: 'var(--accent-orange)', marginBottom: '12px' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Checking current conditions...
              </div>
              <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>Connecting to live atmospheric sensors</div>
            </div>
          ) : hasError ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Icon name="cloud-rain" size={32} style={{ color: 'var(--accent-orange)', marginBottom: '8px' }} />
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Weather data temporarily unavailable.</div>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Please check your internet connection or try another city.</p>
            </div>
          ) : emptySearch ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Icon name="compass" size={32} style={{ color: 'var(--accent-orange)', marginBottom: '8px' }} />
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Location "{searchCityQuery}" not found.</div>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Try searching for cities like Manali, Zurich, Bali, or Dubai.</p>
              <button
                type="button"
                className="btn-view-all"
                style={{ marginTop: '14px' }}
                onClick={() => {
                  setSearchCityQuery('');
                  setEmptySearch(false);
                  loadWeatherForCoords(activeDest.coordinates.lat, activeDest.coordinates.lon);
                }}
              >
                Reset to {activeDest.name}
              </button>
            </div>
          ) : (
            /* Weather Dashboard Output */
            <div>
              <div className="weather-dashboard-grid">
                {/* Left: Big Temp & Condition */}
                <div className="weather-temp-condition-block">
                  <div className="weather-icon-box">
                    <Icon name={weatherData?.icon || 'sun'} size={44} />
                  </div>

                  <div>
                    <div className="weather-eyebrow-city">
                      CURRENT WEATHER IN {weatherData?.cityName || activeDest.name}
                    </div>
                    <div className="weather-temp-huge">
                      {weatherData?.temp}°C
                    </div>
                    <div className="weather-condition-sub">
                      {weatherData?.condition} · Feels like {weatherData?.apparentTemp}°C
                    </div>
                    <div className="weather-provider-meta">
                      Source: {weatherData?.provider || 'OpenWeather Sensor'} · Updated {weatherData?.lastUpdated}
                    </div>
                  </div>
                </div>

                {/* Right: Detailed Parameters (Pressure, Humidity, Wind, Visibility) */}
                <div className="weather-metrics-panel">
                  <div className="weather-metric-cell">
                    <div className="wmc-label">HUMIDITY</div>
                    <div className="wmc-val">{weatherData?.humidity}%</div>
                  </div>
                  <div className="weather-metric-cell">
                    <div className="wmc-label">WIND SPEED</div>
                    <div className="wmc-val">{weatherData?.wind} km/h</div>
                  </div>
                  <div className="weather-metric-cell">
                    <div className="wmc-label">PRESSURE</div>
                    <div className="wmc-val">{weatherData?.pressure || '1012 hPa'}</div>
                  </div>
                  <div className="weather-metric-cell">
                    <div className="wmc-label">VISIBILITY</div>
                    <div className="wmc-val">{weatherData?.visibility || '10 km'}</div>
                  </div>
                </div>
              </div>

              {/* Bottom Connection to Travel Planning */}
              <div className="weather-bottom-action-bar">
                <div className="weather-bottom-text">
                  Planning {weatherData?.cityName || activeDest.name}? Atmospheric conditions are optimal for outdoor exploration.
                </div>

                <button
                  type="button"
                  className="search-explore-btn weather-plan-cta"
                  onClick={() => onPlanTrip(activeDest.id)}
                >
                  <span>✦ Build Itinerary for this Weather</span>
                  <Icon name="arrow-right" size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
