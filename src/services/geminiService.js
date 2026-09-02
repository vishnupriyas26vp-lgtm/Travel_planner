/**
 * DK Holidays — DK AI Travel Concierge Engine
 * Integrates Google Gemini API (via VITE_GEMINI_API_KEY) with an intelligent,
 * contextual travel intelligence engine for broad questions, comparisons, and app handoffs.
 */

import { DESTINATIONS } from '../data/destinations.js';

const GEMINI_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || '';

// Contextual conversation state helper
export class DkAiSession {
  constructor() {
    this.context = {
      destination: null,
      destinationObj: null,
      travelers: null,
      duration: null,
      style: null,
    };
    this.history = [];
  }

  updateContext(query) {
    const q = query.toLowerCase();

    // Dynamic destination detection across all global regions
    const matched = DESTINATIONS.find(
      (d) =>
        q.includes(d.id) ||
        q.includes(d.name.toLowerCase()) ||
        q.includes(d.country.toLowerCase())
    );
    if (matched) {
      this.context.destination = matched.id;
      this.context.destinationObj = matched;
    } else if (q.includes('swiss') || q.includes('switzerland') || q.includes('matterhorn')) {
      const swiss = DESTINATIONS.find((d) => d.id === 'swiss-alps' || d.id === 'zermatt');
      if (swiss) {
        this.context.destination = swiss.id;
        this.context.destinationObj = swiss;
      }
    }

    // Travelers detection
    if (q.includes('couple') || q.includes('honeymoon') || q.includes('partner') || q.includes('two')) this.context.travelers = 'couple';
    else if (q.includes('solo') || q.includes('alone')) this.context.travelers = 'solo';
    else if (q.includes('family') || q.includes('kids')) this.context.travelers = 'family';
    else if (q.includes('friends') || q.includes('group')) this.context.travelers = 'friends';

    // Duration detection
    const matchDays = q.match(/(\d+)\s*(day|days|d)/i);
    if (matchDays && matchDays[1]) {
      this.context.duration = parseInt(matchDays[1], 10);
    }
  }

  async ask(userPrompt) {
    this.updateContext(userPrompt);
    this.history.push({ role: 'user', content: userPrompt });

    // Try Gemini API if key is present
    if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        const systemPrompt = `You are DK AI, the intelligent travel assistant for DK Holidays.
Brand personality: Premium, adventurous, warm, helpful, transparent.
Current conversation context: Destination=${this.context.destination || 'Unspecified'}, Travelers=${this.context.travelers || 'Unspecified'}, Duration=${this.context.duration || 'Unspecified'}.
Rules:
1. Provide structured, concise, elegant travel answers. Use bullet points where appropriate.
2. If discussing visa or documents, always include a caveat that requirements depend on nationality and should be verified with official embassy sources.
3. Never invent live flight/hotel availability, live exact prices, or fake reviews.
4. If planning an itinerary is relevant, suggest building a structured day-by-day itinerary with DK Holidays.`;

        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nUser Question: ${userPrompt}` }],
              },
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            const handoff = this.detectHandoff(userPrompt, replyText);
            this.history.push({ role: 'assistant', content: replyText });
            return { text: replyText, handoff };
          }
        }
      } catch (err) {
        console.warn('[DK AI] Gemini API call failed, using built-in travel intelligence:', err);
      }
    }

    // Built-in intelligent travel response engine
    const localResult = this.generateLocalResponse(userPrompt);
    this.history.push({ role: 'assistant', content: localResult.text });
    return localResult;
  }

  detectHandoff(query, replyText) {
    const q = query.toLowerCase();
    const dest = this.context.destination || 'manali';
    const dur = this.context.duration || 4;

    if (q.includes('weather') || q.includes('rain') || q.includes('snow') || q.includes('temperature')) {
      return {
        type: 'VIEW_WEATHER',
        destinationId: dest,
        label: `View Live Weather for ${this.formatDestName(dest)}`,
      };
    }
    if (q.includes('itinerary') || q.includes('plan') || q.includes('trip') || q.includes('schedule')) {
      return {
        type: 'BUILD_TRIP',
        destinationId: dest,
        duration: dur,
        label: `✦ Build ${dur}-Day ${this.formatDestName(dest)} Itinerary on Page`,
      };
    }
    return {
      type: 'EXPLORE_DESTINATION',
      destinationId: dest,
      label: `Explore ${this.formatDestName(dest)} Dossier →`,
    };
  }

  formatDestName(id) {
    if (!id) return 'Destination';
    return id.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  }

  generateLocalResponse(query) {
    const q = query.toLowerCase();
    const dest = this.context.destination || 'bali';
    const destObj = this.context.destinationObj || DESTINATIONS.find((d) => d.id === dest) || DESTINATIONS[0];
    const destName = destObj ? destObj.name : this.formatDestName(dest);
    const countryName = destObj ? destObj.country : '';
    const dur = this.context.duration || 5;

    // What should I see / Famous places intent
    if (q.includes('see') || (q.includes('visit') && q.includes('place')) || q.includes('sight') || q.includes('attraction') || q.includes('famous') || q.includes('landmark')) {
      const placesList = (destObj.famousPlaces || [])
        .map((p) => `• **${p.name}** (${p.tag})\n  ${p.desc}`)
        .join('\n\n');
      return {
        text: `### Signature Places to Experience in ${destName}${countryName ? `, ${countryName}` : ''}\n\n` +
          `${placesList || `Explore iconic sights and cultural monuments across ${destName}.`}\n\n` +
          `*DK Insider Secret:* ${destObj.insiderTip || 'Wander early in the morning for serene, uncrowded vistas.'}`,
        handoff: {
          type: 'EXPLORE_DESTINATION',
          destinationId: dest,
          label: `Explore ${destName} Travel Dossier →`,
        },
      };
    }

    // Food / Gastronomy intent
    if (q.includes('food') || q.includes('eat') || q.includes('cuisine') || q.includes('dish') || q.includes('taste') || q.includes('restaurant')) {
      const foodList = (destObj.cuisine || [])
        .map((c) => `• **${c}**`)
        .join('\n');
      return {
        text: `### Signature Gastronomy to Taste in ${destName}\n\n` +
          `Here are authentic culinary highlights you should experience during your journey:\n\n` +
          `${foodList || `Taste fresh regional specialties prepared with local ingredients.`}\n\n` +
          `*DK Recommendation:* Pair these dishes with regional teas, coffees, or local refreshments for the full cultural experience!`,
        handoff: {
          type: 'EXPLORE_DESTINATION',
          destinationId: dest,
          label: `Explore ${destName} Gastronomy →`,
        },
      };
    }

    // How many days do I need intent
    if (q.includes('how many days') || q.includes('how long') || (q.includes('need') && q.includes('day'))) {
      return {
        text: `### Recommended Trip Length for ${destName}${countryName ? `, ${countryName}` : ''}\n\n` +
          `• **Recommended Window:** **${destObj.duration || '4 – 7 Days'}**\n` +
          `• **Ideal Season:** ${destObj.bestTime}\n` +
          `• **Travel Persona:** Tailored for ${destObj.idealFor}\n\n` +
          `This duration allows a balanced rhythm covering signature icons, culinary tours, and unhurried relaxation without travel fatigue.`,
        handoff: {
          type: 'BUILD_TRIP',
          destinationId: dest,
          duration: parseInt(destObj.duration, 10) || 5,
          label: `✦ Architect ${destObj.duration || '5-Day'} ${destName} Journey`,
        },
      };
    }

    // Weather intent
    if (q.includes('weather') || q.includes('rain') || q.includes('snow') || q.includes('temperature') || q.includes('climate')) {
      return {
        text: `Live atmospheric telemetry for **${destName}${countryName ? `, ${countryName}` : ''}** is available on our atmospheric dashboard.\n\n` +
          `Elevation: ${destObj.elevation || 'Regional terrain'}.\n` +
          `Click below to view current temperature, wind speed, humidity, and condition:`,
        handoff: {
          type: 'VIEW_WEATHER',
          destinationId: dest,
          label: `View Live Weather for ${destName} →`,
        },
      };
    }

    // Comparison intent (e.g. Bali vs Maldives)
    if (q.includes('compare') || (q.includes('or') && (q.includes('bali') || q.includes('maldives') || q.includes('swiss')))) {
      return {
        text: `### Destination Comparison: Bali vs. Maldives\n\n` +
          `| Dimension | Bali, Indonesia | Maldives Archipelago |\n` +
          `|---|---|---|\n` +
          `| **Atmosphere** | Vibrant island culture, lush volcanic jungles, surf breaks & ancient temples | Total marine seclusion, overwater luxury bungalows & pristine lagoons |\n` +
          `| **Activities** | Rice terrace hikes, waterfalls, spiritual ceremonies, surf, beach clubs | Snorkeling house reefs, scuba diving with manta rays, spa wellness |\n` +
          `| **Cultural Depth** | High (Balinese Hinduism, Gamelan music, royal palaces) | Intimate resort living with gentle Maldivian island hospitality |\n` +
          `| **Best Duration** | 6 – 10 Days (ideal for exploring multiple regions) | 4 – 6 Days (ideal for pure unhurried relaxation) |\n\n` +
          `**DK AI Recommendation:** For active exploration and diverse landscapes, choose **Bali**. For absolute privacy and calm lagoons, choose **Maldives**.`,
        handoff: {
          type: 'BUILD_TRIP',
          destinationId: 'bali',
          duration: 5,
          label: `✦ Build 5-Day Bali Itinerary`,
        },
      };
    }

    // Best time intent
    if (q.includes('when') || q.includes('best time') || q.includes('season') || q.includes('month') || q.includes('december')) {
      return {
        text: `**Best Time to Visit ${destName}${countryName ? `, ${countryName}` : ''}:**\n\n` +
          `• **Optimal Season:** ${destObj.bestTime}\n` +
          `• **Elevation & Climate:** ${destObj.elevation || 'Comfortable regional climate'}\n` +
          `• **Ideal For:** ${destObj.idealFor}\n\n` +
          `*Live Check:* You can inspect real-time atmospheric conditions directly on the live weather sensor below.`,
        handoff: {
          type: 'VIEW_WEATHER',
          destinationId: dest,
          label: `Check Live Weather for ${destName}`,
        },
      };
    }

    // Packing list intent
    if (q.includes('pack') || q.includes('carry') || q.includes('clothes') || q.includes('wear')) {
      return {
        text: `**Essential Packing Blueprint for ${destName}${countryName ? `, ${countryName}` : ''}:**\n\n` +
          `• **Clothing & Footwear:** ${destObj.practicalInfo?.packing || 'Breathable base layers, comfortable walking footwear, and weather protection.'}\n` +
          `• **Travel Essentials:** Polarized sunglasses, power bank, and universal power adapter.\n\n` +
          `*DK Caveat:* ${destObj.practicalInfo?.visaNote || 'Verify passport validity and official embassy visa guidelines prior to travel.'}`,
        handoff: {
          type: 'EXPLORE_DESTINATION',
          destinationId: dest,
          label: `Explore ${destName} Travel Dossier`,
        },
      };
    }

    // Visa / safety guidance
    if (q.includes('visa') || q.includes('passport') || q.includes('safe') || q.includes('document')) {
      return {
        text: `**Travel Documents & Safety for ${destName}${countryName ? `, ${countryName}` : ''}:**\n\n` +
          `• **Visa Requirements:** ${destObj.practicalInfo?.visaNote || 'Visa requirements depend on your nationality. Verify through official consular portals.'}\n` +
          `• **General Safety:** Keep emergency contacts offline, verify local transit options, and respect local cultural etiquette.`,
        handoff: null,
      };
    }

    // General Itinerary / Trip Planning intent
    return {
      text: `I've shaped travel parameters for your **${dur}-day journey to ${destName}${countryName ? `, ${countryName}` : ''}**${this.context.travelers ? ` (${this.context.travelers})` : ''}.\n\n` +
        `This journey balances signature landmarks, local culinary moments, and unhurried time for spontaneous discovery.\n\n` +
        `Click below to load and review the complete day-by-day morning, afternoon, and evening schedule directly on the Trip Architect:`,
      handoff: {
        type: 'BUILD_TRIP',
        destinationId: dest,
        duration: dur,
        label: `✦ Render ${dur}-Day ${destName} Itinerary on Page`,
      },
    };
  }
}
