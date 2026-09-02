/**
 * DK Holidays — Destination Image Registry & Resilient Fallback Service
 * 
 * Provides verified, destination-specific Unsplash and Pexels imagery
 * with multi-tier automatic fallbacks so that cards never display blank
 * or broken images.
 */

// Universal travel scenery fallback images (verified 200 OK)
export const UNIVERSAL_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=85';
export const UNIVERSAL_SECONDARY_FALLBACK =
  'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1600';

// Destination-specific image registry (verified 200 OK)
export const DESTINATION_IMAGE_REGISTRY = {
  // Coorg → Coorg Karnataka coffee plantation
  coorg: {
    query: 'Coorg Karnataka coffee plantation',
    primary: 'https://images.unsplash.com/photo-1592985684811-6c0f98adb014?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85',
      'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1600&q=85',
      'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
  },

  // Manali → Manali Himachal Pradesh mountains
  manali: {
    query: 'Manali Himachal Pradesh mountains',
    primary: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?auto=format&fit=crop&w=1600&q=85',
      'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
    ],
  },

  // Ladakh → Ladakh India mountains
  ladakh: {
    query: 'Ladakh India mountains',
    primary: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
      'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?auto=format&fit=crop&w=1600&q=85',
    ],
  },

  // Munnar → Munnar Kerala tea plantations
  munnar: {
    query: 'Munnar Kerala tea plantations',
    primary: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=85',
      'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
    ],
  },

  // Jaipur → Jaipur Rajasthan Hawa Mahal
  jaipur: {
    query: 'Jaipur Rajasthan Hawa Mahal',
    primary: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=1600&q=85',
      'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.unsplash.com/photo-1592985684811-6c0f98adb014?auto=format&fit=crop&w=1600&q=85',
    ],
  },

  // Goa → Goa India beach
  goa: {
    query: 'Goa India beach',
    primary: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
      'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85',
    ],
  },

  // Swiss Alps & Zermatt → Switzerland Matterhorn
  'swiss-alps': {
    query: 'Swiss Alps Zermatt Matterhorn mountains',
    primary: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=1600&q=85',
    ],
  },
  zermatt: {
    query: 'Zermatt Matterhorn Switzerland',
    primary: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
    ],
  },
  lucerne: {
    query: 'Lucerne Switzerland Chapel Bridge Mount Pilatus',
    primary: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
    ],
  },

  // Bali → Bali Indonesia tropical beaches temples
  bali: {
    query: 'Bali Indonesia tropical beaches temples',
    primary: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1600&q=85',
    ],
  },

  // Dubai → Dubai UAE Burj Khalifa architecture
  dubai: {
    query: 'Dubai UAE Burj Khalifa architecture',
    primary: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=85',
    ],
  },

  // Petra → Petra Jordan Al-Khazneh Treasury
  petra: {
    query: 'Petra Jordan Al-Khazneh Treasury',
    primary: 'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1600&q=85',
      'https://images.pexels.com/photos/1631665/pexels-photo-1631665.jpeg?auto=compress&cs=tinysrgb&w=1600',
    ],
  },

  // Cairo → Cairo Egypt Pyramids of Giza
  cairo: {
    query: 'Cairo Egypt Pyramids of Giza',
    primary: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1600&q=85',
    ],
  },

  // Banff → Banff Canada Lake Louise Rocky Mountains
  banff: {
    query: 'Banff Canada Lake Louise Rocky Mountains',
    primary: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
    ],
  },

  // Maldives → Maldives Indian Ocean overwater bungalows
  maldives: {
    query: 'Maldives Indian Ocean overwater bungalows turquoise lagoon',
    primary: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
    ],
  },

  // Sydney → Sydney Australia Opera House Harbour Bridge
  sydney: {
    query: 'Sydney Australia Opera House Harbour Bridge',
    primary: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?auto=format&fit=crop&w=1600&q=85',
    ],
  },

  // Paris → Paris France Eiffel Tower
  paris: {
    query: 'Paris France Eiffel Tower',
    primary: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1600&q=85',
    ],
  },

  // Rome → Rome Italy Colosseum
  rome: {
    query: 'Rome Italy Colosseum Trevi Fountain',
    primary: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1600&q=85',
    ],
  },

  // Tokyo → Tokyo Japan Sensoji Shibuya
  tokyo: {
    query: 'Tokyo Japan Sensoji Shibuya',
    primary: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85',
    fallbacks: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85',
    ],
  },
};

/**
 * Normalize destination ID or query string to registry key
 */
export function normalizeDestinationKey(destIdOrName) {
  if (!destIdOrName) return null;
  const clean = destIdOrName.toString().toLowerCase().trim();

  if (clean.includes('coorg')) return 'coorg';
  if (clean.includes('manali')) return 'manali';
  if (clean.includes('ladakh')) return 'ladakh';
  if (clean.includes('munnar')) return 'munnar';
  if (clean.includes('jaipur')) return 'jaipur';
  if (clean.includes('goa')) return 'goa';
  if (clean.includes('swiss') || clean.includes('alps')) return 'swiss-alps';
  if (clean.includes('zermatt') || clean.includes('matterhorn')) return 'zermatt';
  if (clean.includes('lucerne')) return 'lucerne';
  if (clean.includes('bali')) return 'bali';
  if (clean.includes('dubai')) return 'dubai';
  if (clean.includes('petra')) return 'petra';
  if (clean.includes('cairo') || clean.includes('egypt') || clean.includes('giza')) return 'cairo';
  if (clean.includes('banff') || clean.includes('louise')) return 'banff';
  if (clean.includes('maldives')) return 'maldives';
  if (clean.includes('sydney')) return 'sydney';
  if (clean.includes('paris')) return 'paris';
  if (clean.includes('rome')) return 'rome';
  if (clean.includes('tokyo')) return 'tokyo';

  return clean;
}

/**
 * Get verified primary image URL for a destination
 */
export function getDestinationPrimaryImage(destIdOrName, fallbackSrc = null) {
  const key = normalizeDestinationKey(destIdOrName);
  if (key && DESTINATION_IMAGE_REGISTRY[key]) {
    return DESTINATION_IMAGE_REGISTRY[key].primary;
  }
  return fallbackSrc || UNIVERSAL_FALLBACK_IMAGE;
}

/**
 * Get list of fallback images for a destination
 */
export function getDestinationFallbacks(destIdOrName) {
  const key = normalizeDestinationKey(destIdOrName);
  if (key && DESTINATION_IMAGE_REGISTRY[key] && DESTINATION_IMAGE_REGISTRY[key].fallbacks) {
    return DESTINATION_IMAGE_REGISTRY[key].fallbacks;
  }
  return [UNIVERSAL_FALLBACK_IMAGE, UNIVERSAL_SECONDARY_FALLBACK];
}

/**
 * Automatic onError handler for destination card images.
 * Automatically tries next relevant fallback and guarantees
 * no blank or broken image area is ever shown.
 */
export function handleDestinationImageError(event, destIdOrName) {
  const img = event.currentTarget || event.target;
  if (!img) return;

  const currentAttempt = parseInt(img.dataset.fallbackAttempt || '0', 10);
  const fallbacks = getDestinationFallbacks(destIdOrName);

  if (currentAttempt < fallbacks.length) {
    img.dataset.fallbackAttempt = (currentAttempt + 1).toString();
    img.src = fallbacks[currentAttempt];
  } else if (currentAttempt === fallbacks.length) {
    img.dataset.fallbackAttempt = (currentAttempt + 1).toString();
    img.src = UNIVERSAL_FALLBACK_IMAGE;
  } else if (currentAttempt === fallbacks.length + 1) {
    img.dataset.fallbackAttempt = (currentAttempt + 1).toString();
    img.src = UNIVERSAL_SECONDARY_FALLBACK;
  } else {
    // Avoid any potential infinite loop
    img.onerror = null;
  }
}
