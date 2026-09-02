/**
 * DK Holidays — Dynamic Trip Budget Currency & Exchange Rate Service
 * Handles destination-aware local currency defaults, live exchange rates,
 * persistent user currency preference, and formatting.
 */

// Supported Currencies configuration
export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', isIndia: true },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩' },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  MVR: { code: 'MVR', symbol: 'Rf', name: 'Maldivian Rufiyaa', flag: '🇲🇻' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  EGP: { code: 'EGP', symbol: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬' },
  THB: { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭' },
};

// Destination ID & Country to Local Currency mapping
export const DESTINATION_CURRENCY_MAP = {
  // India (Default INR)
  manali: 'INR',
  coorg: 'INR',
  munnar: 'INR',
  ladakh: 'INR',
  jaipur: 'INR',
  goa: 'INR',
  kerala: 'INR',
  india: 'INR',

  // Switzerland (Default CHF)
  'swiss-alps': 'CHF',
  switzerland: 'CHF',
  zermatt: 'CHF',
  lucerne: 'CHF',
  zurich: 'CHF',
  interlaken: 'CHF',

  // Indonesia (Default IDR)
  bali: 'IDR',
  indonesia: 'IDR',
  ubud: 'IDR',
  seminyak: 'IDR',

  // UAE & Middle East (Default AED / USD)
  dubai: 'AED',
  uae: 'AED',
  'abu-dhabi': 'AED',
  petra: 'USD',
  muscat: 'USD',

  // Japan (Default JPY)
  tokyo: 'JPY',
  kyoto: 'JPY',
  japan: 'JPY',

  // Europe (Default EUR)
  paris: 'EUR',
  france: 'EUR',
  rome: 'EUR',
  italy: 'EUR',
  spain: 'EUR',
  santorini: 'EUR',
  greece: 'EUR',

  // UK (Default GBP)
  london: 'GBP',
  uk: 'GBP',

  // USA & Americas
  usa: 'USD',
  newyork: 'USD',
  'new-york': 'USD',
  'grand-canyon': 'USD',

  // Canada (Default CAD)
  banff: 'CAD',
  canada: 'CAD',
  vancouver: 'CAD',

  // Australia (Default AUD)
  sydney: 'AUD',
  australia: 'AUD',
  melbourne: 'AUD',
  'great-barrier-reef': 'AUD',

  // Egypt & Africa
  cairo: 'EGP',
  egypt: 'EGP',
  'cape-town': 'USD',
  'maasai-mara': 'USD',
  marrakech: 'EUR',

  // Islands
  maldives: 'MVR',
  mauritius: 'USD',
  seychelles: 'USD',

  // Thailand
  phuket: 'THB',
  bangkok: 'THB',
  thailand: 'THB',
};

// Baseline reference exchange rates (relative to INR)
// 1 unit of foreign currency = X INR
const BASELINE_INR_RATES = {
  INR: 1.0,
  CHF: 98.40,      // 1 CHF ≈ ₹98.40
  IDR: 0.0053,     // 1 IDR ≈ ₹0.0053 (100,000 IDR ≈ ₹530)
  AED: 23.65,      // 1 AED ≈ ₹23.65
  USD: 86.85,      // 1 USD ≈ ₹86.85
  EUR: 94.20,      // 1 EUR ≈ ₹94.20
  GBP: 110.60,     // 1 GBP ≈ ₹110.60
  JPY: 0.58,       // 1 JPY ≈ ₹0.58
  MVR: 5.62,       // 1 MVR ≈ ₹5.62
  CAD: 61.20,      // 1 CAD ≈ ₹61.20
  AUD: 54.50,      // 1 AUD ≈ ₹54.50
  EGP: 1.75,       // 1 EGP ≈ ₹1.75
  THB: 2.45,       // 1 THB ≈ ₹2.45
};

// Memory cache for exchange rates
let cachedRates = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 3600000; // 1 Hour

/**
 * Fetch live exchange rates from Open Exchange API with fallback to baseline
 */
export async function fetchLiveExchangeRates() {
  const now = Date.now();

  // Return cached if fresh
  if (cachedRates && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedRates;
  }

  // Check sessionStorage
  try {
    const stored = sessionStorage.getItem('dk_exchange_rates');
    const storedTime = sessionStorage.getItem('dk_exchange_rates_time');
    if (stored && storedTime && now - parseInt(storedTime, 10) < CACHE_TTL_MS) {
      cachedRates = JSON.parse(stored);
      lastFetchTime = parseInt(storedTime, 10);
      return cachedRates;
    }
  } catch {
    // ignore storage access restrictions
  }

  // Fetch from Open Exchange Rates API (Base: INR)
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/INR');
    if (res.ok) {
      const data = await res.json();
      if (data.rates) {
        // Build map: 1 unit of foreign currency in INR = 1 / data.rates[CURRENCY]
        const liveRates = { INR: 1.0 };
        Object.keys(CURRENCIES).forEach((code) => {
          if (code === 'INR') {
            liveRates.INR = 1.0;
          } else if (data.rates[code]) {
            liveRates[code] = 1 / data.rates[code];
          } else {
            liveRates[code] = BASELINE_INR_RATES[code] || 1.0;
          }
        });

        cachedRates = liveRates;
        lastFetchTime = now;
        try {
          sessionStorage.setItem('dk_exchange_rates', JSON.stringify(liveRates));
          sessionStorage.setItem('dk_exchange_rates_time', now.toString());
        } catch {
          // ignore
        }
        return liveRates;
      }
    }
  } catch (err) {
    console.warn('[DK Currency] Live exchange rate fetch failed, using reliable baseline:', err);
  }

  // Fallback to baseline rates
  cachedRates = { ...BASELINE_INR_RATES };
  lastFetchTime = now;
  return cachedRates;
}

/**
 * Get the default local currency for a destination ID
 */
export function getLocalCurrencyCode(destinationId) {
  if (!destinationId) return 'INR';
  const norm = destinationId.toLowerCase().trim();
  return DESTINATION_CURRENCY_MAP[norm] || 'INR';
}

/**
 * Check if destination is Indian
 */
export function isIndianDestination(destinationId) {
  return getLocalCurrencyCode(destinationId) === 'INR';
}

/**
 * Convert an amount between two currencies using the exchange rates map
 */
export function convertCurrency(amount, fromCode, toCode, rates = cachedRates || BASELINE_INR_RATES) {
  if (!amount || isNaN(amount)) return 0;
  if (fromCode === toCode) return amount;

  const fromRateInInr = rates[fromCode] || BASELINE_INR_RATES[fromCode] || 1.0;
  const toRateInInr = rates[toCode] || BASELINE_INR_RATES[toCode] || 1.0;

  // Amount in INR
  const amountInInr = amount * fromRateInInr;
  // Convert INR to target currency
  const targetAmount = amountInInr / toRateInInr;

  return targetAmount;
}

/**
 * Format currency with proper locale grouping and symbols
 */
export function formatCurrencyAmount(amount, currencyCode) {
  const code = currencyCode || 'INR';
  const currencyObj = CURRENCIES[code] || CURRENCIES.INR;

  if (code === 'INR') {
    // Indian comma format (e.g. ₹31,600, ₹1,85,000)
    const rounded = Math.round(amount);
    return `₹${rounded.toLocaleString('en-IN')}`;
  } else if (code === 'CHF') {
    // Swiss Franc with comma as thousands separator (e.g. CHF 1,215, CHF 12,500)
    const rounded = Math.round(amount);
    return `CHF ${rounded.toLocaleString('en-US')}`;
  } else if (code === 'IDR') {
    // Indonesian Rupiah e.g. Rp 950.000
    const rounded = Math.round(amount / 1000) * 1000;
    return `Rp ${rounded.toLocaleString('id-ID')}`;
  } else if (code === 'USD') {
    return `$${Math.round(amount).toLocaleString('en-US')}`;
  } else if (code === 'EUR') {
    return `€${Math.round(amount).toLocaleString('en-US')}`;
  } else if (code === 'AED') {
    return `AED ${Math.round(amount).toLocaleString('en-US')}`;
  } else if (code === 'JPY') {
    return `¥${Math.round(amount).toLocaleString('en-US')}`;
  } else if (code === 'GBP') {
    return `£${Math.round(amount).toLocaleString('en-GB')}`;
  }

  return `${currencyObj.symbol} ${Math.round(amount).toLocaleString('en-US')}`;
}

/**
 * Parse any raw cost string (e.g. "₹4,000", "€220", "$90", "4000") into numeric value and source currency
 */
export function parseRawCostString(costStr, destinationId) {
  if (typeof costStr === 'number') {
    return {
      numeric: costStr,
      detectedCurrency: getLocalCurrencyCode(destinationId),
    };
  }

  const str = String(costStr || '').trim();
  const numeric = parseFloat(str.replace(/[^0-9.]/g, '')) || 0;

  let detectedCurrency = getLocalCurrencyCode(destinationId);
  if (str.includes('₹') || str.includes('INR')) detectedCurrency = 'INR';
  else if (str.includes('CHF')) detectedCurrency = 'CHF';
  else if (str.includes('Rp') || str.includes('IDR')) detectedCurrency = 'IDR';
  else if (str.includes('€') || str.includes('EUR')) detectedCurrency = 'EUR';
  else if (str.includes('$') || str.includes('USD')) detectedCurrency = 'USD';
  else if (str.includes('AED') || str.includes('د.إ')) detectedCurrency = 'AED';
  else if (str.includes('¥') || str.includes('JPY')) detectedCurrency = 'JPY';
  else if (str.includes('£') || str.includes('GBP')) detectedCurrency = 'GBP';

  return { numeric, detectedCurrency };
}

/**
 * Standard baseline per-day costs for international and domestic destinations
 * to ensure realistic local currency amounts (e.g. 220 CHF stay for Switzerland, 900,000 IDR for Bali)
 */
export const DESTINATION_BASE_DAY_BUDGET = {
  'swiss-alps': {
    currency: 'CHF',
    stay: 220,
    food: 75,
    activities: 65,
    transport: 45,
  },
  bali: {
    currency: 'IDR',
    stay: 900000,
    food: 300000,
    activities: 200000,
    transport: 250000,
  },
  dubai: {
    currency: 'AED',
    stay: 450,
    food: 180,
    activities: 160,
    transport: 110,
  },
  manali: {
    currency: 'INR',
    stay: 4000,
    food: 1500,
    activities: 1000,
    transport: 1000,
  },
  coorg: {
    currency: 'INR',
    stay: 4500,
    food: 1600,
    activities: 600,
    transport: 1200,
  },
  munnar: {
    currency: 'INR',
    stay: 3800,
    food: 1500,
    activities: 1200,
    transport: 1000,
  },
  ladakh: {
    currency: 'INR',
    stay: 4500,
    food: 1600,
    activities: 1200,
    transport: 2200,
  },
};

/**
 * Get normalized, converted daily budget items in target currency
 */
export function getConvertedDailyBudget(day, destinationId, targetCurrency, rates = cachedRates || BASELINE_INR_RATES) {
  const normDest = (destinationId || 'manali').toLowerCase().trim();
  const localCode = getLocalCurrencyCode(normDest);
  const targetCode = targetCurrency || localCode;

  // Check if we have destination baseline in local currency
  const baseBudget = DESTINATION_BASE_DAY_BUDGET[normDest];

  let rawStay, rawFood, rawActivities, rawTransport, baseCurrency;

  if (baseBudget) {
    baseCurrency = baseBudget.currency;
    rawStay = baseBudget.stay;
    rawFood = baseBudget.food;
    rawActivities = baseBudget.activities;
    rawTransport = baseBudget.transport;
  } else {
    // Parse from day's estimatedCost object
    const pStay = parseRawCostString(day.estimatedCost?.stay, normDest);
    const pFood = parseRawCostString(day.estimatedCost?.food, normDest);
    const pActivities = parseRawCostString(day.estimatedCost?.activities, normDest);
    const pTransport = parseRawCostString(day.estimatedCost?.transport, normDest);

    baseCurrency = pStay.detectedCurrency || localCode;
    rawStay = pStay.numeric || 4000;
    rawFood = pFood.numeric || 1500;
    rawActivities = pActivities.numeric || 1000;
    rawTransport = pTransport.numeric || 1000;
  }

  // Convert each component to target currency
  const convertedStay = convertCurrency(rawStay, baseCurrency, targetCode, rates);
  const convertedFood = convertCurrency(rawFood, baseCurrency, targetCode, rates);
  const convertedActivities = convertCurrency(rawActivities, baseCurrency, targetCode, rates);
  const convertedTransport = convertCurrency(rawTransport, baseCurrency, targetCode, rates);
  const convertedTotal = convertedStay + convertedFood + convertedActivities + convertedTransport;

  return {
    currencyCode: targetCode,
    currencySymbol: CURRENCIES[targetCode]?.symbol || targetCode,
    stay: formatCurrencyAmount(convertedStay, targetCode),
    food: formatCurrencyAmount(convertedFood, targetCode),
    activities: formatCurrencyAmount(convertedActivities, targetCode),
    transport: formatCurrencyAmount(convertedTransport, targetCode),
    totalDay: formatCurrencyAmount(convertedTotal, targetCode),
    totalDayNumeric: convertedTotal,
    baseCurrency,
  };
}
