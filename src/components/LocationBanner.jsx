import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';
import { DESTINATIONS } from '../data/destinations';
import { calculateDistanceKm } from '../services/locationService';
import { fetchLiveWeather } from '../services/weatherService';

export function LocationBanner({ userLocation, onRequestLocation, isLocating, onExploreDestination }) {
  const [localWeather, setLocalWeather] = useState(null);
  const [nearestDest, setNearestDest] = useState(null);
  const [nearestDistance, setNearestDistance] = useState(null);

  useEffect(() => {
    if (!userLocation?.lat || !userLocation?.lon) return;

    // Fetch user's local weather
    let isMounted = true;
    const loadUserWeather = async () => {
      const data = await fetchLiveWeather(userLocation.lat, userLocation.lon, 'manali');
      if (isMounted) setLocalWeather(data);
    };
    loadUserWeather();

    // Find nearest destination from our curated list
    let minD = Infinity;
    let closest = null;
    DESTINATIONS.forEach((d) => {
      const dist = calculateDistanceKm(userLocation.lat, userLocation.lon, d.coordinates.lat, d.coordinates.lon);
      if (dist < minD) {
        minD = dist;
        closest = d;
      }
    });

    if (closest) {
      setNearestDest(closest);
      setNearestDistance(minD);
    }

    return () => {
      isMounted = false;
    };
  }, [userLocation]);

  return (
    <section className="section-spacing" style={{ paddingTop: '40px', paddingBottom: '70px' }}>
      <div className="container">
        <div className="location-sensor-banner">
          <div className="sensor-grid">
            {/* Left: Location Narrative & Status */}
            <div>
              <div className="eyebrow">
                <Icon name="navigation" size={16} />
                <span>INTELLIGENT LOCATION AWARENESS</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: '#faf8f5', marginBottom: '14px', lineHeight: '1.2' }}>
                {userLocation?.city
                  ? `Travel tailored from ${userLocation.city}`
                  : 'Tailor your journey around where you are.'}
              </h2>
              <p style={{ color: '#a3b1c2', fontSize: '1.02rem', lineHeight: '1.6', marginBottom: '24px' }}>
                {userLocation?.city
                  ? `We've detected your vantage point in ${userLocation.city}. Explore handpicked mountain getaways and plantation retreats closest to you.`
                  : 'Enable your browser location to view live weather at your current spot and calculate exact travel distances to every sanctuary.'}
              </p>

              {!userLocation?.city && (
                <button
                  className="btn-primary"
                  onClick={onRequestLocation}
                  disabled={isLocating}
                >
                  <Icon name="navigation" size={16} />
                  <span>{isLocating ? 'Detecting Your Location...' : 'Use My Current Location'}</span>
                </button>
              )}
            </div>

            {/* Right: Live Local Sensor Card or Nearest Getaway */}
            <div>
              {userLocation?.city && localWeather ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="sensor-weather-card">
                    <Icon name={localWeather.icon || 'sun'} size={42} style={{ color: '#ffb443' }} />
                    <div>
                      <div className="sensor-weather-temp">{localWeather.temp}°C</div>
                      <div style={{ fontWeight: 600, color: '#faf8f5', fontSize: '1.05rem' }}>
                        {userLocation.city}
                      </div>
                      <div style={{ color: '#a3b1c2', fontSize: '0.85rem' }}>
                        {localWeather.condition} · Humidity {localWeather.humidity}% · Wind {localWeather.wind} km/h
                      </div>
                    </div>
                  </div>

                  {nearestDest && (
                    <div
                      style={{
                        padding: '18px 22px',
                        background: 'rgba(37, 143, 135, 0.12)',
                        border: '1px solid rgba(37, 143, 135, 0.3)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                      onClick={() => onExploreDestination(nearestDest.id)}
                    >
                      <div>
                        <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#4ed1c7', fontWeight: 700 }}>
                          NEAREST ESCAPE · ONLY {nearestDistance?.toLocaleString()} KM
                        </div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem', marginTop: '2px' }}>
                          {nearestDest.name} ({nearestDest.tag})
                        </div>
                      </div>
                      <span style={{ color: '#f26a36', fontWeight: 600, fontSize: '0.9rem' }}>
                        Explore →
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    padding: '32px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px dashed rgba(255, 255, 255, 0.15)',
                    borderRadius: '20px',
                    textAlign: 'center',
                  }}
                >
                  <Icon name="compass" size={36} style={{ color: '#f26a36', margin: '0 auto 12px auto' }} />
                  <div style={{ fontWeight: 600, color: '#faf8f5', marginBottom: '6px' }}>
                    Zero setup required
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#a3b1c2', maxWidth: '320px', margin: '0 auto' }}>
                    Click "Use My Current Location" above to see real-time distance calculations and nearest getaways.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
