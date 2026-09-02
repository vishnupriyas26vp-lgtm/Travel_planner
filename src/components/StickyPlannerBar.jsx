import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';

export function StickyPlannerBar({ onOpenPlanner }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 650px (beyond hero)
      if (window.scrollY > 650) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      className="sticky-planner-pill"
      onClick={onOpenPlanner}
      aria-label="Open Trip Planner"
      title="Plan Your Trip"
    >
      <Icon name="sparkles" size={17} />
      <span>Plan My Trip →</span>
    </button>
  );
}
