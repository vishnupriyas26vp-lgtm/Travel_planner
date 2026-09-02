import React from 'react';
import { Icon } from './Icons';
import { handleDestinationImageError } from '../services/destinationImageService';

export function PopularTrips({ onPlanTrip, onExploreDestination, savedIds = [], onToggleSave }) {
  const POPULAR_TRIPS_EXACT = [
    {
      id: 'manali-escape',
      title: 'Manali Escape',
      meta: '5 Days • India',
      price: '₹14,999',
      destinationId: 'manali',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'coorg-weekend',
      title: 'Coorg Weekend',
      meta: '3 Days • Karnataka',
      price: '₹9,499',
      destinationId: 'coorg',
      image: 'https://images.unsplash.com/photo-1592985684811-6c0f98adb014?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'munnar-kerala',
      title: 'Munnar & Kerala',
      meta: '5 Days • India',
      price: '₹15,500',
      destinationId: 'munnar',
      image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'bali-escape',
      title: 'Bali Island Escape',
      meta: '6 Days • Indonesia',
      price: '₹34,999',
      destinationId: 'bali',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'swiss-alps-adv',
      title: 'Swiss Alps Adventure',
      meta: '7 Days • Switzerland',
      price: '₹98,500',
      destinationId: 'swiss-alps',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'ladakh-road',
      title: 'Ladakh Road Journey',
      meta: '7 Days • India',
      price: '₹24,999',
      destinationId: 'ladakh',
      image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section className="popular-trips-section" id="popular-trips" aria-label="Popular trips people love">
      <div className="container-xl">
        <div className="popular-trips-layout">
          {/* Left Title & Description (Matching Image 3) */}
          <div className="popular-trips-sidebar">
            <div className="popular-trips-eyebrow">TRIPS WORTH TAKING</div>
            <h2 className="popular-trips-title">
              Popular trips<br />people love
            </h2>
            <p className="popular-trips-desc">
              Handpicked journeys crafted for unforgettable experiences.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
              onClick={() => {
                const elem = document.getElementById('planner');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Explore All Trips</span>
              <Icon name="arrow-right" size={14} />
            </div>
          </div>

          {/* 6 Curated Vertical White Cards (Matching Image 3) */}
          <div className="popular-trips-cards-grid">
            {POPULAR_TRIPS_EXACT.map((trip) => {
              const isSaved = savedIds.includes(trip.id);
              return (
                <div
                  key={trip.id}
                  className="trip-card-exact"
                  onClick={() => onPlanTrip(trip.destinationId)}
                >
                  <div className="trip-card-photo-wrap">
                    <img
                      src={trip.image}
                      alt={trip.title}
                      loading="lazy"
                      onError={(e) => handleDestinationImageError(e, trip.destinationId || trip.title)}
                    />
                    <button
                      className="trip-card-heart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleSave) onToggleSave(trip);
                      }}
                      title="Save trip"
                    >
                      <Icon name={isSaved ? 'heart-filled' : 'heart'} size={14} style={{ color: isSaved ? '#f26440' : '#ffffff' }} />
                    </button>
                  </div>

                  <div className="trip-card-body-exact">
                    <h3 className="trip-card-name-exact">{trip.title}</h3>
                    <div className="trip-card-meta-exact">{trip.meta}</div>

                    <div className="trip-card-price-row">
                      <span>From</span>
                      <span className="trip-card-price-value">{trip.price}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
