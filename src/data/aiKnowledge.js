/**
 * DK Nomad — AI Travel Concierge Knowledge Base & Intent Classifier
 * Delivers contextual travel advice, packing checklists, and generates structured itineraries on the page.
 */

export const QUICK_PROMPTS = [
  {
    id: 'p1',
    label: '4-day trip to Munnar',
    query: 'Plan a 4-day romantic escape to Munnar with tea plantation walks and scenic viewpoints.',
    destinationId: 'munnar',
    duration: 4,
  },
  {
    id: 'p2',
    label: 'Ladakh packing checklist',
    query: 'What essentials should I pack for a high-altitude expedition to Ladakh?',
    destinationId: 'ladakh',
    duration: 5,
  },
  {
    id: 'p3',
    label: 'Hidden cafes in Manali',
    query: 'What are the best bohemian cafes and scenic riverside spots in Old Manali?',
    destinationId: 'manali',
    duration: 4,
  },
  {
    id: 'p4',
    label: 'Coorg coffee & waterfalls',
    query: 'Plan a relaxing 3-day weekend itinerary in Coorg with coffee estate tours.',
    destinationId: 'coorg',
    duration: 3,
  },
  {
    id: 'p5',
    label: 'Swiss Alps panoramic rails',
    query: 'How should I plan a 5-day Swiss Alps journey including Matterhorn and scenic trains?',
    destinationId: 'swiss-alps',
    duration: 5,
  },
  {
    id: 'p6',
    label: 'Bali spiritual & coast guide',
    query: 'Recommend a balanced 5-day Bali itinerary covering Ubud culture and Uluwatu cliffs.',
    destinationId: 'bali',
    duration: 5,
  },
];

export const PACKING_GUIDES = {
  ladakh: [
    'Layered thermal innerwear (merino wool recommended)',
    'Windproof & waterproof heavy fleece jacket',
    'UV Category 3/4 sunglasses (essential for high-altitude glare)',
    'High-SPF sunscreen (50+) and hydrating lip balm',
    'Prescribed Diamox or altitude acclimatization tablets',
    'Portable oxygen canister (readily available in Leh pharmacies)',
    'Sturdy broken-in trekking boots with wool socks',
    'High-capacity power bank (battery depletes rapidly in sub-zero temps)',
  ],
  manali: [
    'Insulated down jacket or windbreaker (especially for Rohtang & Solang)',
    'Comfortable waterproof walking shoes for forest trails',
    'Moisturizer, sunglasses, and beanie for evening chills',
    'Daypack for Jogini Waterfall hike with reusable water bottle',
    'Casual layers for daytime cafe lounging in Old Manali',
  ],
  coorg: [
    'Light rain jacket or compact umbrella (Western Ghats showers)',
    'Insect repellent for plantation walks',
    'Breathable cotton shirts and comfortable trousers',
    'Grippy trail shoes for muddy waterfall paths',
    'Light cardigan or shawl for cool mist-clad evenings',
  ],
  munnar: [
    'Light woolens and windcheaters for early morning jeep rides',
    'Comfortable walking shoes with traction for tea slopes',
    'Binoculars for spotting Nilgiri Tahr at Eravikulam',
    'Camera with polarizing filter to capture lush green tea leaves',
  ],
  'swiss-alps': [
    'Sturdy Gore-Tex hiking boots with ankle support',
    '3-layer clothing system: base thermal, fleece mid-layer, hardshell jacket',
    'Swiss power adapter (Type J) and universal plug',
    'Refillable metal water bottle (Swiss tap water is alpine-pure)',
    'Camera with extra battery for glacier panoramic shots',
  ],
  bali: [
    'Breathable linen apparel and lightweight swimwear',
    'Modest sarong and temple sash (for sacred water ceremonies)',
    'Reef-safe sunscreen and mosquito repellent',
    'Waterproof dry-bag for beach coves and boat transfers',
    'Slip-on sandals and comfortable sandals for walking Ubud rice terraces',
  ],
};

/**
 * Intelligent response matcher for DK Nomad
 */
export function getAiResponse(userQuery) {
  const q = userQuery.toLowerCase();

  // Check for destination mentions
  let destinationId = 'manali';
  let destName = 'Manali';
  if (q.includes('munnar') || q.includes('kerala')) {
    destinationId = 'munnar';
    destName = 'Munnar';
  } else if (q.includes('coorg') || q.includes('kodagu')) {
    destinationId = 'coorg';
    destName = 'Coorg';
  } else if (q.includes('swiss') || q.includes('switzerland') || q.includes('alps') || q.includes('matterhorn')) {
    destinationId = 'swiss-alps';
    destName = 'Swiss Alps';
  } else if (q.includes('bali') || q.includes('indonesia') || q.includes('ubud')) {
    destinationId = 'bali';
    destName = 'Bali';
  } else if (q.includes('ladakh') || q.includes('leh') || q.includes('pangong')) {
    destinationId = 'ladakh';
    destName = 'Ladakh';
  } else if (q.includes('kashmir') || q.includes('gulmarg')) {
    destinationId = 'kashmir';
    destName = 'Kashmir';
  } else if (q.includes('dubai')) {
    destinationId = 'dubai';
    destName = 'Dubai';
  }

  // Detect duration
  let duration = 4;
  const matchDays = q.match(/(\d+)\s*(day|days|d)/i);
  if (matchDays && matchDays[1]) {
    duration = Math.min(10, Math.max(2, parseInt(matchDays[1], 10)));
  }

  // Detect if user wants packing list
  if (q.includes('pack') || q.includes('carry') || q.includes('gear') || q.includes('clothes')) {
    const list = PACKING_GUIDES[destinationId] || PACKING_GUIDES.manali;
    return {
      text: `Here is the essential packing blueprint for your trip to **${destName}**:\n\n` +
        list.map((item, idx) => `• **${item}**`).join('\n') +
        `\n\n*DK Tip:* Mountain weather can turn brisk in minutes. Always keep a breathable windproof shell within arm's reach in your daypack.`,
      action: null,
    };
  }

  // Detect if user wants dining / food / cafes
  if (q.includes('cafe') || q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('dining')) {
    return {
      text: `When in **${destName}**, these culinary experiences are not to be missed:\n\n` +
        `• **Local Delicacies:** Taste the authentic regional specialties prepared with slow-cooking heritage methods.\n` +
        `• **Scenic Mountain Cafes:** Seek out independent, wooden balcony cafes overlooking pine valleys and rushing rivers.\n` +
        `• **Insider Tip:** Avoid crowded tourist thoroughfares during peak meal hours. Ask your estate host or local baker for their personal favorites.`,
      action: {
        type: 'PLAN_TRIP',
        destinationId,
        duration,
        label: `View Full Day-by-Day Itinerary with Dining for ${destName} →`,
      },
    };
  }

  // Default: Planning a trip / Itinerary recommendation
  return {
    text: `I have architected a **${duration}-day personalized travel itinerary for ${destName}**.\n\n` +
      `It balances scenic discovery, immersive cultural encounters, local culinary stops, and unhurried whitespace for spontaneous wandering.\n\n` +
      `Click below to review your day-by-day morning, afternoon, and evening schedule directly on the interactive planner:`,
    action: {
      type: 'LOAD_ITINERARY',
      destinationId,
      duration,
      label: `✦ Open ${duration}-Day ${destName} Itinerary on Page`,
    },
  };
}
