import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { DestinationExplorer } from './components/DestinationExplorer';
import { QuickActionCards } from './components/QuickActionCards';
import { PopularTrips } from './components/PopularTrips';
import { DkAiSection } from './components/DkAiSection';
import { WeatherExperience } from './components/WeatherExperience';
import { TripArchitect } from './components/TripArchitect';
import { TrustSection } from './components/TrustSection';
import { Footer } from './components/Footer';
import { DestinationModal } from './components/DestinationModal';
import { AiAssistant } from './components/AiAssistant';
import { SavedTripsModal } from './components/SavedTripsModal';
import { detectUserLocation } from './services/locationService';
import { DESTINATIONS } from './data/destinations';
import { Icon } from './components/Icons';

export function App() {
  const [activeDossierId, setActiveDossierId] = useState(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiDestination, setAiDestination] = useState(null);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [plannerDestinationId, setPlannerDestinationId] = useState('manali');

  // Location State
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Saved Wishlist
  const [savedDestinations, setSavedDestinations] = useState(() => {
    try {
      const stored = localStorage.getItem('dk_saved_destinations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [savedItineraries, setSavedItineraries] = useState(() => {
    try {
      const stored = localStorage.getItem('dk_saved_itineraries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    localStorage.setItem('dk_saved_destinations', JSON.stringify(savedDestinations));
  }, [savedDestinations]);

  useEffect(() => {
    localStorage.setItem('dk_saved_itineraries', JSON.stringify(savedItineraries));
  }, [savedItineraries]);

  const handleRequestLocation = async () => {
    setIsLocating(true);
    try {
      const loc = await detectUserLocation();
      setUserLocation(loc);
      triggerToast(`Location identified: ${loc.city || 'Coordinates active'}`);
    } catch (err) {
      console.warn('Location detection failed:', err);
      triggerToast('Location permission unavailable. You can search manually.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleToggleSaveDestination = (destination) => {
    setSavedDestinations((prev) => {
      const exists = prev.some((d) => d.id === destination.id);
      if (exists) {
        triggerToast(`Removed ${destination.name} from wishlist.`);
        return prev.filter((d) => d.id !== destination.id);
      } else {
        triggerToast(`Saved ${destination.name} to wishlist!`);
        return [...prev, destination];
      }
    });
  };

  const handleSaveItinerary = (itinerary) => {
    setSavedItineraries((prev) => {
      const filtered = prev.filter((it) => it.id !== itinerary.id);
      triggerToast(`Saved ${itinerary.durationDays}-day ${itinerary.destinationName} plan!`);
      return [...filtered, itinerary];
    });
  };

  const handleExploreDestination = (destId) => {
    setActiveDossierId(destId);
  };

  const handleStartPlan = (destId) => {
    if (destId && typeof destId === 'string') {
      setPlannerDestinationId(destId);
    }
    const elem = document.getElementById('planner');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearchSubmit = (query) => {
    const match = DESTINATIONS.find(
      (d) =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.country.toLowerCase().includes(query.toLowerCase())
    );
    if (match) {
      setActiveDossierId(match.id);
    } else {
      const elem = document.getElementById('destinations');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-canvas">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <Icon name="check" size={16} style={{ color: 'var(--accent-teal)' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar matching Image 3 */}
      <Navbar
        userLocation={userLocation}
        onRequestLocation={handleRequestLocation}
        isLocating={isLocating}
        onOpenAiPlanner={() => setIsAiOpen(true)}
        onNavigateToPlanner={() => handleStartPlan()}
      />

      <main>
        {/* 1. Hero Section matching Image 3 */}
        <HeroCarousel
          onExploreDestination={handleExploreDestination}
          onSecondaryCta={(action, id) => {
            if (action === 'ai') setIsAiOpen(true);
            else handleStartPlan(id);
          }}
          onSearchSubmit={handleSearchSubmit}
          onChipSelect={() => {
            const elem = document.getElementById('destinations');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }}
          onRequestLocation={handleRequestLocation}
        />

        {/* 2. "Where will you go next?" matching Image 3 */}
        <DestinationExplorer
          onSelectDestination={handleExploreDestination}
          savedDestinationIds={savedDestinations.map((d) => d.id)}
          onToggleSave={handleToggleSaveDestination}
        />

        {/* 3. 4 Feature / Quick Action Cards matching Image 3 */}
        <QuickActionCards
          onCheckWeather={() => {
            const elem = document.getElementById('weather');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }}
          onUseLocation={handleRequestLocation}
          onOpenAiPlanner={() => setIsAiOpen(true)}
          onOpenItineraryPlanner={() => handleStartPlan('manali')}
        />

        {/* 4. "Popular trips people love" matching Image 3 */}
        <PopularTrips
          onPlanTrip={handleStartPlan}
          onExploreDestination={handleExploreDestination}
          savedIds={savedDestinations.map((d) => d.id)}
          onToggleSave={handleToggleSaveDestination}
        />

        {/* 5. Live Atmospheric Weather Experience ("Know before you go") */}
        <WeatherExperience
          userLocation={userLocation}
          onRequestLocation={handleRequestLocation}
          isLocating={isLocating}
          onPlanTrip={handleStartPlan}
        />

        {/* 6. DK AI Conversation Dock matching Image 3 */}
        <DkAiSection
          onOpenAi={() => setIsAiOpen(true)}
          onPromptClick={() => setIsAiOpen(true)}
        />

        {/* 6. Progressive 6-Step Trip Architect & Structured Day-by-Day Timeline */}
        <div id="planner">
          <TripArchitect
            initialDestinationId={plannerDestinationId}
            onSaveItinerary={handleSaveItinerary}
            isSaved={savedItineraries.some((it) => it.destinationId === plannerDestinationId)}
            onAskAiAboutTrip={() => setIsAiOpen(true)}
          />
        </div>

        {/* 7. Trust Bar matching Image 3 */}
        <TrustSection />
      </main>

      {/* 8. Dark Footer matching Image 3 */}
      <Footer
        onSelectDestination={handleExploreDestination}
        onStartPlan={() => handleStartPlan()}
        onOpenAi={() => setIsAiOpen(true)}
      />

      {/* Destination Dossier Modal */}
      <DestinationModal
        destinationId={activeDossierId}
        onClose={() => setActiveDossierId(null)}
        onBuildItinerary={handleStartPlan}
        onAskAi={(dest) => {
          setAiDestination(dest);
          setIsAiOpen(true);
        }}
        onViewWeather={() => {
          const elem = document.getElementById('weather');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }}
        isSaved={savedDestinations.some((d) => d.id === activeDossierId)}
        onToggleSave={handleToggleSaveDestination}
      />

      {/* DK AI Assistant Modal */}
      <AiAssistant
        isOpen={isAiOpen}
        onClose={() => {
          setIsAiOpen(false);
          setAiDestination(null);
        }}
        destination={aiDestination}
        onLoadItineraryOnPage={(destId) => {
          handleStartPlan(destId);
        }}
        onViewWeather={() => {
          const elem = document.getElementById('weather');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }}
        onExploreDestination={handleExploreDestination}
      />

      {/* Saved Trips Drawer Modal */}
      <SavedTripsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedDestinations={savedDestinations}
        savedItineraries={savedItineraries}
        onRemoveDestination={(id) => setSavedDestinations((prev) => prev.filter((d) => d.id !== id))}
        onRemoveItinerary={(id) => setSavedItineraries((prev) => prev.filter((it) => it.id !== id))}
        onSelectDestination={handleExploreDestination}
        onLoadSavedItinerary={(itinerary) => {
          handleStartPlan(itinerary.destinationId);
        }}
      />
    </div>
  );
}

export default App;
