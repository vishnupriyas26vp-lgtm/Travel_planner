/**
 * DK Holidays — Geolocation & Distance Service
 * Computes real-world distances to destinations and detects user location.
 */

/**
 * Calculate Great Circle distance between two coordinates in kilometers (Haversine formula)
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Request user's current coordinates via browser HTML5 Geolocation
 */
export function getUserCoordinates() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let msg = 'Could not access location';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was declined';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out';
        }
        reject(new Error(msg));
      },
      { timeout: 8000, enableHighAccuracy: false, maximumAge: 300000 }
    );
  });
}

/**
 * Reverse geocode coordinates to City / Country using Open-Meteo reverse geocoding or fallback
 */
export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (res.ok) {
      const data = await res.json();
      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.state_district ||
        data.address.state ||
        'Nearby';
      const country = data.address.country || '';
      return { city, country, label: country ? `${city}, ${country}` : city };
    }
  } catch {
    // Fallback if nominatim is blocked or rate limited
  }

  // Graceful fallback display
  return {
    city: 'Your Current Spot',
    country: '',
    label: `Coordinates: ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
  };
}

/**
 * Detect user location and reverse geocode in a single call
 */
export async function detectUserLocation() {
  const coords = await getUserCoordinates();
  const geo = await reverseGeocode(coords.lat, coords.lon);
  return {
    ...coords,
    city: geo.city,
    country: geo.country,
    label: geo.label,
  };
}
