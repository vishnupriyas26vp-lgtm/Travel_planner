# DK Holidays — Travel Planner Web Application

DK Holidays is a modern travel discovery, atmospheric intelligence, and day-by-day itinerary planning platform built with React, Vite, and custom luxury editorial aesthetics.

The application combines real-time atmospheric tracking (OpenWeather API with Open-Meteo zero-config fallback), context-aware AI travel intelligence (Google Gemini API with localized heuristics), and a 6-step progressive trip architect that produces structured day-by-day timelines on the page.

---

## 🌟 Core Brand Philosophy & Design Identity

- **Brand Name**: **DK Holidays**
- **AI Assistant**: **DK AI**
- **Theme**: **Light + Warm + Premium + Photography-First**
  - Soft warm ivory (`#faf8f5`), light cream (`#fdfbf7`), warm sand, and pure white card surfaces.
  - Deep near-black charcoal headings (`#12161c`) and warm muted typography for optimal legibility.
  - Sunset orange (`#f26a36`) and terracotta accents.
  - Strategic dark contrast sections (Hero photo overlay, dedicated DK AI showcase section, final emotional CTA, and footer).
- **Strict Layout Integrity**: Zero empty cards, zero blank boxes, no accidental whitespace. Varied editorial compositions (large features, split image/story blocks, asymmetric grids).
- **Zero Fabrication**: No fabricated ratings, no fake customer counters, no artificial urgency banners.

---

## ✨ Features

### 1. 6-Slide Cinematic Hero Carousel
Exact required destinations and master copy:
1. **Manali, India** — *"Where the mountains slow time."* (CTAs: *Explore Manali* | *Ask DK AI*)
2. **Coorg, India** — *"Wake up where nature feels alive."* (CTAs: *Explore Coorg* | *Plan a Getaway*)
3. **Swiss Alps, Switzerland** — *"Chase the peaks you've dreamed about."* (CTAs: *Explore Switzerland* | *Build My Trip*)
4. **Bali, Indonesia** — *"Find your version of paradise."* (CTAs: *Explore Bali* | *Ask DK AI*)
5. **Ladakh, India** — *"Take the road less ordinary."* (CTAs: *Explore Ladakh* | *Plan My Journey*)
6. **Munnar, India** — *"Let the hills breathe for you."* (CTAs: *Explore Munnar* | *Discover Kerala*)

### 2. Large Glossy Search Bar & Quick Discovery Chips
- Quick search with keyboard `/` shortcut.
- Inputs for Destination, Dates / Duration, Travel Style, and Travelers.
- Quick chips: 🏖️ Beach escapes, 🏔️ Mountain trips, 💑 Romantic getaways, 👨‍👩‍👧 Family holidays, ⚡ Adventure, 🌿 Weekend escapes, 🌍 International, 🇮🇳 India.

### 3. Destination Explorer ("Your next story starts somewhere")
- Multi-axis filtering: search keyword, region (India, Asia, Europe, Middle East, Islands), travel style, and duration.
- Varied editorial layout with featured spotlight and detailed cards.

### 4. Dedicated Famous Places Section
- Landmark discovery cards for iconic global attractions (*Eiffel Tower, Burj Khalifa, Bali Temples, Matterhorn, Taj Mahal, Pangong Lake, Munnar Tea Gardens, Golden Temple, Niagara Falls*) with why visit, best season, and direct destination links.

### 5. Popular Trips Inspiration
- Realistic multi-destination travel circuits (*Himalayan Escape, Kerala Slow Travel, Swiss Alpine Journey, Bali Discovery, Ladakh High Road Journey*) with highlights and pace breakdown.

### 6. Weather & Location Experience ("Know before you go")
- Real-time weather dashboard with temperature, feels-like, condition, humidity, wind, visibility, and high/low ranges.
- Permission-friendly location prompt: *"Want travel recommendations near you? Use My Location / Search Manually."*
- Supported by OpenWeather API with automatic Open-Meteo fallback for 100% uptime.

### 7. Dedicated DK AI Section & Interactive Modal
- Conversational travel concierge powered by Google Gemini API with conversational context memory.
- Answers broad travel questions: season suitability, luggage checklists, transportation advice, local food specialties, and official visa caveats.
- Side-by-side destination comparisons (e.g. *Bali vs Maldives*).
- Direct application handoffs: *View Weather*, *Explore Destination Dossier*, and *Build Itinerary*.

### 8. Progressive 6-Step Trip Planner & Day-by-Day Timeline
- Step 1: Destination
- Step 2: Dates & Duration
- Step 3: Travelers (Solo, Couple, Family, Friends)
- Step 4: Travel Style (Relaxed, Nature, Adventure, Luxury, Culture)
- Step 5: Interests (Pines, Cafes, Spa, Heritage, Lakes)
- Step 6: Preferences & Confirmation -> **Generate My Trip**
- Structured day-by-day output on the page with morning, afternoon, and evening blocks, meal suggestions, activity completion checkboxes, notes, and transparent daily budget breakdown.
- Print / PDF export, markdown copy, and wishlist persistence in `localStorage`.

### 9. Comprehensive Destination Dossier Modal
- Hero photography, quick key facts, why visit, top spots, authentic dishes, transit options, where to stay, packing advice, and official government visa advisories.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Custom Vanilla CSS Design System with CSS variables and responsive glassmorphism
- **Iconography**: Custom bespoke vector SVG icon registry + Lucide React
- **APIs**:
  - OpenWeather API (REST endpoint with Open-Meteo fallback)
  - Google Gemini API (REST endpoint with high-fidelity local NLP fallback)
  - HTML5 Geolocation & OpenStreetMap Nominatim Reverse Geocoding

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0+ or v20.0+)
- npm (v9.0+ or v10.0+)

### 1. Clone & Install Dependencies
```bash
cd travel-planner
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your API keys (optional — the application runs with automatic zero-config fallbacks):
```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Locally
```bash
npm run dev
```
The application will launch at `http://localhost:5173/`.

### 4. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
travel-planner/
├── public/
│   └── favicon.svg              # Bespoke vector compass & mountain favicon
├── src/
│   ├── components/
│   │   ├── AiAssistant.jsx       # DK AI conversational modal & handoffs
│   │   ├── DestinationExplorer.jsx # Multi-axis filterable destination grid
│   │   ├── DestinationModal.jsx  # In-depth travel dossier modal
│   │   ├── DestinationSearch.jsx # Glossy search bar & quick discovery chips
│   │   ├── DkAiSection.jsx       # Strategic dark contrast AI feature showcase
│   │   ├── EditorialStories.jsx  # Travel magazine stories & reader
│   │   ├── FamousPlaces.jsx      # Dedicated iconic landmarks discovery
│   │   ├── FinalConversion.jsx   # Closing emotional CTA
│   │   ├── Footer.jsx            # Dark contrast footer with manifesto
│   │   ├── HeroCarousel.jsx      # 6-slide cinematic hero with live weather
│   │   ├── Icons.jsx             # SVG icon registry
│   │   ├── Navbar.jsx            # Floating glass navbar with location sensor
│   │   ├── PopularTrips.jsx      # Curated multi-destination circuits
│   │   ├── SavedTripsModal.jsx   # Persisted localStorage wishlist drawer
│   │   ├── StickyPlannerBar.jsx  # Floating sticky CTA
│   │   ├── TripArchitect.jsx     # 6-step wizard & structured timeline UI
│   │   └── TrustSection.jsx      # Product craftsmanship pillars
│   ├── data/
│   │   ├── destinations.js       # Curated destination dossiers
│   │   ├── famousPlaces.js       # Global famous places & landmarks
│   │   ├── heroSlides.js         # Exact 6-slide sequence & copy
│   │   ├── experiences.js        # Editorial magazine articles
│   │   └── popularTrips.js       # Curated circuit inspirations
│   ├── services/
│   │   ├── analytics.js          # Structured event dispatcher
│   │   ├── geminiService.js      # Google Gemini API & DK AI session engine
│   │   ├── itineraryEngine.js    # Algorithmic day-by-day scheduler
│   │   ├── locationService.js    # Geolocation & distance calculation
│   │   └── weatherService.js     # OpenWeather & Open-Meteo live API coordinator
│   ├── App.jsx                   # Central state & flow coordinator
│   ├── index.css                 # Master light + warm design tokens
│   └── main.jsx                  # Application entry point
├── .env.example                  # API keys template
├── index.html                    # SEO meta tags, Google Fonts & viewport setup
├── package.json
└── vite.config.js
```

---

## ⚖️ License & Attribution

Designed and developed for **DK Holidays**. All rights reserved.
Destination photography licensed under Unsplash open terms.
