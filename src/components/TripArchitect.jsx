import React, { useState, useEffect } from 'react';
import { DESTINATIONS } from '../data/destinations';
import { generateItinerary } from '../services/itineraryEngine';
import { Icon } from './Icons';
import { trackEvent } from '../services/analytics';
import {
  getLocalCurrencyCode,
  isIndianDestination,
  fetchLiveExchangeRates,
  getConvertedDailyBudget,
  formatCurrencyAmount,
  CURRENCIES,
} from '../services/currencyService';

export function TripArchitect({
  initialDestinationId = 'manali',
  onSaveItinerary,
  isSaved,
  onAskAiAboutTrip,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    destinationId: initialDestinationId,
    durationDays: 4,
    groupType: 'couple',
    budgetTier: 'balanced',
    travelStyle: 'nature',
    interests: ['Mountains', 'Culture', 'Scenic Viewpoints'],
    pacing: 'balanced',
  });

  const [itinerary, setItinerary] = useState(() =>
    generateItinerary({
      destinationId: initialDestinationId,
      durationDays: 4,
      travelStyle: 'nature',
      budgetTier: 'balanced',
      groupType: 'couple',
    })
  );

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isAddingCustomActivity, setIsAddingCustomActivity] = useState(false);
  const [customActivityTitle, setCustomActivityTitle] = useState('');
  const [customActivityTime, setCustomActivityTime] = useState('15:00');

  // Currency state & live exchange rates
  const [exchangeRates, setExchangeRates] = useState(null);
  const [displayCurrency, setDisplayCurrency] = useState(() =>
    getLocalCurrencyCode(initialDestinationId)
  );

  // Fetch live exchange rates on mount
  useEffect(() => {
    let isMounted = true;
    fetchLiveExchangeRates().then((rates) => {
      if (isMounted && rates) {
        setExchangeRates(rates);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Update currency default when destination changes
  useEffect(() => {
    const localCurr = getLocalCurrencyCode(formData.destinationId);
    setDisplayCurrency(localCurr);
  }, [formData.destinationId]);

  // Sync destination change from hero or outside
  useEffect(() => {
    if (initialDestinationId && initialDestinationId !== formData.destinationId) {
      setFormData((prev) => ({ ...prev, destinationId: initialDestinationId }));
      const newPlan = generateItinerary({
        ...formData,
        destinationId: initialDestinationId,
      });
      setItinerary(newPlan);
      setActiveDayIndex(0);
      setDisplayCurrency(getLocalCurrencyCode(initialDestinationId));
    }
  }, [initialDestinationId]);

  const handleGenerate = () => {
    trackEvent('itinerary_generated', {
      destination: formData.destinationId,
      duration: formData.durationDays,
    });
    const newPlan = generateItinerary(formData);
    setItinerary(newPlan);
    setActiveDayIndex(0);

    setTimeout(() => {
      const elem = document.getElementById('itinerary-results');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleAddCustomActivity = (e) => {
    e.preventDefault();
    if (!customActivityTitle.trim()) return;

    setItinerary((prev) => {
      const updatedDays = [...prev.days];
      const day = { ...updatedDays[activeDayIndex] };
      const customList = day.customActivities ? [...day.customActivities] : [];
      customList.push({
        id: `act-${Date.now()}`,
        time: customActivityTime,
        title: customActivityTitle.trim(),
        desc: 'Custom experience added to your day schedule.',
        isCompleted: false,
      });
      day.customActivities = customList;
      updatedDays[activeDayIndex] = day;
      return { ...prev, days: updatedDays };
    });

    setCustomActivityTitle('');
    setIsAddingCustomActivity(false);
  };

  const handleRemoveCustomActivity = (actId) => {
    setItinerary((prev) => {
      const updatedDays = [...prev.days];
      const day = { ...updatedDays[activeDayIndex] };
      day.customActivities = (day.customActivities || []).filter((a) => a.id !== actId);
      updatedDays[activeDayIndex] = day;
      return { ...prev, days: updatedDays };
    });
  };

  const toggleMilestoneCompleted = (periodKey) => {
    setItinerary((prev) => {
      const updatedDays = [...prev.days];
      const day = { ...updatedDays[activeDayIndex] };
      day[periodKey] = {
        ...day[periodKey],
        isCompleted: !day[periodKey].isCompleted,
      };
      updatedDays[activeDayIndex] = day;
      return { ...prev, days: updatedDays };
    });
  };

  const currentDay = itinerary.days[activeDayIndex] || itinerary.days[0];
  const isIndia = isIndianDestination(formData.destinationId);
  const localCurrencyCode = getLocalCurrencyCode(formData.destinationId);

  // Converted budget for current active day
  const dayBudget = getConvertedDailyBudget(
    currentDay,
    formData.destinationId,
    displayCurrency,
    exchangeRates
  );

  // Total estimated trip budget across all days
  const totalTripNumeric = itinerary.days.reduce((acc, d) => {
    const b = getConvertedDailyBudget(d, formData.destinationId, displayCurrency, exchangeRates);
    return acc + b.totalDayNumeric;
  }, 0);
  const formattedTripTotal = formatCurrencyAmount(totalTripNumeric, displayCurrency);

  const handleCopyMarkdown = () => {
    const text = `# ${itinerary.durationDays}-Day ${itinerary.destinationName} Travel Plan\n` +
      `Curated for: ${itinerary.groupType} • ${itinerary.travelStyle} pace\n` +
      `Total Estimated Budget: ${formattedTripTotal} (${displayCurrency})\n\n` +
      itinerary.days
        .map((d) => {
          const b = getConvertedDailyBudget(d, formData.destinationId, displayCurrency, exchangeRates);
          return (
            `## Day ${d.day}: ${d.title}\n` +
            `• 09:00 Morning: ${d.morning.title} - ${d.morning.location}\n` +
            `• 14:00 Afternoon: ${d.afternoon.title} - ${d.afternoon.location}\n` +
            `• 19:00 Evening: ${d.evening.title} - ${d.evening.location}\n` +
            `• Day Budget (${displayCurrency}): Stay: ${b.stay}, Food: ${b.food}, Activities: ${b.activities}, Transport: ${b.transport} (Total: ${b.totalDay})\n` +
            `• Insider Tip: ${d.insiderTip}\n`
          );
        })
        .join('\n');

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <section className="section-spacing" id="planner" aria-label="Interactive Trip Planner">
      <div className="container-xl">
        {/* Intro Header */}
        <div className="section-header" style={{ maxWidth: '780px' }}>
          <div className="eyebrow">
            <Icon name="sparkles" size={16} />
            <span>PROGRESSIVE 6-STEP ITINERARY ARCHITECT</span>
          </div>
          <h2 className="section-title">
            Personalized day-by-day itineraries,<br />rendered to perfection.
          </h2>
          <p className="section-desc">
            Answer 6 simple travel parameters to generate an authentic vertical timeline with
            morning, afternoon, and evening milestones, local dining spots, and transparent cost estimates.
          </p>
        </div>

        {/* 6-Step Progressive Wizard Form */}
        <div className="planner-wizard-card">
          {/* Progress Header */}
          <div className="planner-wizard-header">
            <div className="planner-step-badge">
              STEP 0{currentStep} / 06 &nbsp;·&nbsp;{' '}
              {currentStep === 1 && 'Where are you going?'}
              {currentStep === 2 && 'When are you travelling / duration?'}
              {currentStep === 3 && 'Who is travelling with you?'}
              {currentStep === 4 && 'Budget tier'}
              {currentStep === 5 && 'Travel style'}
              {currentStep === 6 && 'Interests & preferences'}
            </div>

            {/* Stepper Dots */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5, 6].map((st) => (
                <div
                  key={st}
                  onClick={() => setCurrentStep(st)}
                  style={{
                    width: st === currentStep ? '28px' : '10px',
                    height: '10px',
                    borderRadius: '5px',
                    background: st === currentStep ? 'var(--accent-orange)' : st < currentStep ? '#228b84' : '#e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                  title={`Go to Step ${st}`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: Destination Selection */}
          {currentStep === 1 && (
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Select or Search your Destination
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                {DESTINATIONS.map((dest) => {
                  const isSelected = formData.destinationId === dest.id;
                  return (
                    <div
                      key={dest.id}
                      onClick={() => setFormData({ ...formData, destinationId: dest.id })}
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        background: isSelected ? '#fff9f6' : '#faf9f6',
                        border: isSelected ? '2px solid var(--accent-orange)' : '1px solid rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{dest.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dest.state || dest.country}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-orange)', fontWeight: 600, marginTop: '4px' }}>{dest.tag}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Duration / Dates */}
          {currentStep === 2 && (
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
                How many days will you travel?
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
                {[
                  { days: 3, label: '3 Days', desc: 'Weekend Escape' },
                  { days: 4, label: '4 Days', desc: 'Short Holiday' },
                  { days: 5, label: '5 Days', desc: 'Ideal Explorer' },
                  { days: 7, label: '7 Days', desc: 'Deep Immersion' },
                  { days: 9, label: '9 Days', desc: 'Grand Circuit' },
                ].map((d) => {
                  const isSelected = formData.durationDays === d.days;
                  return (
                    <div
                      key={d.days}
                      onClick={() => setFormData({ ...formData, durationDays: d.days })}
                      style={{
                        padding: '18px',
                        borderRadius: '16px',
                        background: isSelected ? '#fff9f6' : '#faf9f6',
                        border: isSelected ? '2px solid var(--accent-orange)' : '1px solid rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{d.label}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>{d.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Travelers */}
          {currentStep === 3 && (
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Who is travelling?
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                {[
                  { id: 'solo', label: 'Solo Traveler', desc: 'Personal rhythm & discovery' },
                  { id: 'couple', label: 'Couple / Honeymoon', desc: 'Romance & intimate moments' },
                  { id: 'family', label: 'Family with Children', desc: 'Comfort & child-friendly pacing' },
                  { id: 'friends', label: 'Group of Friends', desc: 'Adventures & vibrant memories' },
                ].map((t) => {
                  const isSelected = formData.groupType === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setFormData({ ...formData, groupType: t.id })}
                      style={{
                        padding: '18px',
                        borderRadius: '16px',
                        background: isSelected ? '#fff9f6' : '#faf9f6',
                        border: isSelected ? '2px solid var(--accent-orange)' : '1px solid rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{t.label}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>{t.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Budget Tier */}
          {currentStep === 4 && (
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Select Budget Category (Estimated Guidance)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                {[
                  { id: 'budget', label: 'Budget-Conscious', desc: 'Authentic homestays, local public transit' },
                  { id: 'balanced', label: 'Moderate & Balanced', desc: 'Charming boutique chalets, private cabs' },
                  { id: 'premium', label: 'Premium Comfort', desc: 'Signature plantation stays, guided tours' },
                  { id: 'luxury', label: 'Luxury & Spa', desc: '5-star resorts, private helicopters/suites' },
                ].map((b) => {
                  const isSelected = formData.budgetTier === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setFormData({ ...formData, budgetTier: b.id })}
                      style={{
                        padding: '18px',
                        borderRadius: '16px',
                        background: isSelected ? '#fff9f6' : '#faf9f6',
                        border: isSelected ? '2px solid var(--accent-orange)' : '1px solid rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{b.label}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>{b.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Travel Style */}
          {currentStep === 5 && (
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
                What is your preferred travel pace and style?
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                {[
                  { id: 'nature', label: 'Nature & Solitude', desc: 'Pine forests, sunrise mist & silence' },
                  { id: 'adventure', label: 'High Adventure', desc: 'Trekking, rafting & mountain passes' },
                  { id: 'cultural', label: 'Cultural & Heritage', desc: 'Monasteries, old villages & crafts' },
                  { id: 'relaxed', label: 'Relaxed & Wellness', desc: 'Ayurveda, leisurely cafe afternoons' },
                ].map((s) => {
                  const isSelected = formData.travelStyle === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setFormData({ ...formData, travelStyle: s.id })}
                      style={{
                        padding: '18px',
                        borderRadius: '16px',
                        background: isSelected ? '#fff9f6' : '#faf9f6',
                        border: isSelected ? '2px solid var(--accent-orange)' : '1px solid rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.label}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Interests & Preferences */}
          {currentStep === 6 && (
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Confirm specific interests & preferences
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
                {['Mountains', 'Beaches', 'Artisanal Food', 'Culture', 'Photography', 'Nightlife', 'Scenic Viewpoints', 'Wellness', 'Shopping'].map((tag) => {
                  const isSelected = formData.interests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const updated = isSelected
                          ? formData.interests.filter((i) => i !== tag)
                          : [...formData.interests, tag];
                        setFormData({ ...formData, interests: updated });
                      }}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '999px',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        background: isSelected ? 'var(--accent-orange)' : '#f4f3f0',
                        color: isSelected ? '#ffffff' : 'var(--text-primary)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                      }}
                    >
                      {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                    </button>
                  );
                })}
              </div>

              <div style={{ padding: '16px 20px', background: '#faf9f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Pacing Preference</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>How full should your schedule feel?</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Slow', 'Balanced', 'Packed'].map((pace) => (
                    <button
                      key={pace}
                      type="button"
                      onClick={() => setFormData({ ...formData, pacing: pace.toLowerCase() })}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: formData.pacing === pace.toLowerCase() ? '#151922' : '#ffffff',
                        color: formData.pacing === pace.toLowerCase() ? '#ffffff' : 'var(--text-primary)',
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                    >
                      {pace}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="planner-action-bar">
            {currentStep > 1 ? (
              <button
                type="button"
                className="btn-view-all"
                onClick={() => setCurrentStep((s) => s - 1)}
              >
                <Icon name="arrow-left" size={16} />
                <span>Previous Step</span>
              </button>
            ) : <div />}

            {currentStep < 6 ? (
              <button
                type="button"
                className="search-explore-btn"
                style={{ padding: '12px 28px' }}
                onClick={() => setCurrentStep((s) => s + 1)}
              >
                <span>Continue</span>
                <Icon name="arrow-right" size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="search-explore-btn"
                style={{ padding: '14px 34px', fontSize: '1.05rem', background: 'var(--accent-orange)' }}
                onClick={handleGenerate}
              >
                <span>✦ Generate My Trip</span>
                <Icon name="arrow-right" size={18} />
              </button>
            )}
          </div>
        </div>

        {/* ==========================================================================
            STRUCTURED DAY-BY-DAY ITINERARY UI (VERTICAL TIMELINE)
            ========================================================================== */}
        <div id="itinerary-results" className="itinerary-results-card">
          {/* Itinerary Header */}
          <div className="itinerary-header-flex">
            <div className="itinerary-title-meta-block">
              <div className="itinerary-eyebrow">
                STRUCTURED DAY-BY-DAY TRAVEL PLAN
              </div>
              <h3 className="itinerary-main-title">
                {itinerary.durationDays}-Day {itinerary.destinationName} Itinerary
              </h3>
              <p className="itinerary-subtitle">
                Curated for: <strong>{itinerary.groupType}</strong> • <strong>{itinerary.travelStyle}</strong> pace • <strong>{formData.pacing}</strong> schedule
              </p>
            </div>

            {/* Practical Actions: Print, Share, Ask DK AI, Save */}
            <div className="itinerary-actions-cluster">
              <button className="btn-view-all" onClick={() => window.print()} title="Print clean PDF itinerary">
                <Icon name="printer" size={16} />
                <span>Print / PDF</span>
              </button>

              <button className="btn-view-all" onClick={handleCopyMarkdown} title="Share plan text">
                <Icon name="share" size={16} />
                <span>{copiedNotification ? 'Copied!' : 'Share'}</span>
              </button>

              <button className="btn-view-all" onClick={() => onAskAiAboutTrip(itinerary.destinationId)}>
                <Icon name="sparkles" size={16} style={{ color: 'var(--accent-gold)' }} />
                <span>Ask DK AI</span>
              </button>

              <button
                className="search-explore-btn"
                style={{ padding: '10px 22px', background: isSaved ? '#228b84' : 'var(--accent-orange)' }}
                onClick={() => onSaveItinerary(itinerary)}
              >
                <Icon name={isSaved ? 'check' : 'heart'} size={16} />
                <span>{isSaved ? 'Saved to My Trips' : 'Save Itinerary'}</span>
              </button>
            </div>
          </div>

          {/* ==========================================================================
              DYNAMIC TRIP BUDGET BANNER & CURRENCY TOGGLE (NEW FEATURE)
              ========================================================================== */}
          <div className="itinerary-budget-banner">
            <div>
              <div className="budget-banner-label">
                ESTIMATED TRIP BUDGET ({itinerary.durationDays} DAYS)
              </div>
              <div className="budget-banner-amount">
                {formattedTripTotal}
              </div>
              <div className="budget-banner-disclaimer">
                *Approximate budget • Based on current exchange rates
              </div>
            </div>

            {/* Currency Selector Control */}
            <div className="itinerary-currency-toggle-wrapper">
              <span className="currency-label-text">
                Currency:
              </span>

              {!isIndia ? (
                /* International Destination: Toggle between Destination Local Currency & INR */
                <div
                  className="currency-toggle-pill-container"
                  role="group"
                  aria-label="Trip Budget Currency Toggle"
                >
                  <button
                    type="button"
                    onClick={() => setDisplayCurrency(localCurrencyCode)}
                    className={`currency-pill-btn ${displayCurrency === localCurrencyCode ? 'active' : ''}`}
                    aria-pressed={displayCurrency === localCurrencyCode}
                  >
                    <span>{CURRENCIES[localCurrencyCode]?.flag}</span>
                    <span>{localCurrencyCode}</span>
                    <span className="curr-symbol-sub">({CURRENCIES[localCurrencyCode]?.symbol})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDisplayCurrency('INR')}
                    className={`currency-pill-btn ${displayCurrency === 'INR' ? 'active' : ''}`}
                    aria-pressed={displayCurrency === 'INR'}
                  >
                    <span>🇮🇳</span>
                    <span>INR</span>
                    <span className="curr-symbol-sub">(₹)</span>
                  </button>
                </div>
              ) : (
                /* Indian Destination: Default INR (₹) badge */
                <div className="currency-badge-indian">
                  <span>🇮🇳</span>
                  <span>INR (₹)</span>
                  <span className="indian-badge-sub">• Local Standard</span>
                </div>
              )}
            </div>
          </div>

          {/* Day Navigation Tabs */}
          <div className="itinerary-day-tabs-scroll" role="tablist">
            {itinerary.days.map((d, idx) => (
              <button
                key={d.day}
                type="button"
                onClick={() => setActiveDayIndex(idx)}
                className={`day-tab-btn ${activeDayIndex === idx ? 'active' : ''}`}
              >
                Day 0{d.day}
              </button>
            ))}
          </div>

          {/* Active Day Title */}
          <div className="active-day-heading-block">
            <span className="active-day-eyebrow">
              DAY 0{currentDay.day} THEME: {currentDay.theme}
            </span>
            <h4 className="active-day-title">
              {currentDay.title}
            </h4>
          </div>

          {/* Vertical Timeline Structure */}
          <div className="milestones-timeline-stack">
            {/* Morning Milestone */}
            <div className={`itinerary-milestone-card ${currentDay.morning.isCompleted ? 'completed' : ''}`}>
              <div className="milestone-time-col">
                <div className="milestone-time-val">09:00</div>
                <div className="milestone-time-label">Morning</div>
              </div>
              <div className="milestone-content-col">
                <h5 className="milestone-title">
                  {currentDay.morning.title}
                </h5>
                <div className="milestone-location">
                  📍 {currentDay.morning.location}
                </div>
                <p className="milestone-desc">
                  {currentDay.morning.desc}
                </p>
                {currentDay.morning.dining && (
                  <div className="milestone-dining">
                    🍴 <strong>Local Breakfast / Dining:</strong> {currentDay.morning.dining}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => toggleMilestoneCompleted('morning')}
                  className={`milestone-complete-btn ${currentDay.morning.isCompleted ? 'is-done' : ''}`}
                >
                  <Icon name={currentDay.morning.isCompleted ? 'check' : 'plus'} size={14} />
                  <span>{currentDay.morning.isCompleted ? 'Visited & Completed' : 'Mark as visited'}</span>
                </button>
              </div>
            </div>

            {/* Afternoon Milestone */}
            <div className={`itinerary-milestone-card ${currentDay.afternoon.isCompleted ? 'completed' : ''}`}>
              <div className="milestone-time-col">
                <div className="milestone-time-val">14:00</div>
                <div className="milestone-time-label">Afternoon</div>
              </div>
              <div className="milestone-content-col">
                <h5 className="milestone-title">
                  {currentDay.afternoon.title}
                </h5>
                <div className="milestone-location">
                  📍 {currentDay.afternoon.location}
                </div>
                <p className="milestone-desc">
                  {currentDay.afternoon.desc}
                </p>
                {currentDay.afternoon.dining && (
                  <div className="milestone-dining">
                    🍴 <strong>Midday Meal:</strong> {currentDay.afternoon.dining}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => toggleMilestoneCompleted('afternoon')}
                  className={`milestone-complete-btn ${currentDay.afternoon.isCompleted ? 'is-done' : ''}`}
                >
                  <Icon name={currentDay.afternoon.isCompleted ? 'check' : 'plus'} size={14} />
                  <span>{currentDay.afternoon.isCompleted ? 'Visited & Completed' : 'Mark as visited'}</span>
                </button>
              </div>
            </div>

            {/* Evening Milestone */}
            <div className={`itinerary-milestone-card ${currentDay.evening.isCompleted ? 'completed' : ''}`}>
              <div className="milestone-time-col">
                <div className="milestone-time-val">19:00</div>
                <div className="milestone-time-label">Evening</div>
              </div>
              <div className="milestone-content-col">
                <h5 className="milestone-title">
                  {currentDay.evening.title}
                </h5>
                <div className="milestone-location">
                  📍 {currentDay.evening.location}
                </div>
                <p className="milestone-desc">
                  {currentDay.evening.desc}
                </p>
                {currentDay.evening.dining && (
                  <div className="milestone-dining">
                    🍴 <strong>Dinner Experience:</strong> {currentDay.evening.dining}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => toggleMilestoneCompleted('evening')}
                  className={`milestone-complete-btn ${currentDay.evening.isCompleted ? 'is-done' : ''}`}
                >
                  <Icon name={currentDay.evening.isCompleted ? 'check' : 'plus'} size={14} />
                  <span>{currentDay.evening.isCompleted ? 'Visited & Completed' : 'Mark as visited'}</span>
                </button>
              </div>
            </div>

            {/* Custom Added Activities */}
            {(currentDay.customActivities || []).map((customAct) => (
              <div key={customAct.id} className="itinerary-milestone-card custom-milestone">
                <div className="milestone-time-col">
                  <div className="milestone-time-val">{customAct.time}</div>
                  <div className="milestone-time-label">Custom</div>
                </div>
                <div className="milestone-content-col">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <div>
                      <h5 className="milestone-title">{customAct.title}</h5>
                      <p className="milestone-desc">{customAct.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomActivity(customAct.id)}
                      style={{ color: '#ef4444', fontSize: '0.82rem', fontWeight: 600, padding: '4px 8px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Activity & Insider Tip */}
          <div className="add-activity-row">
            {isAddingCustomActivity ? (
              <form onSubmit={handleAddCustomActivity} className="milestone-custom-form">
                <input
                  type="text"
                  placeholder="Activity Title (e.g. Sunset Boat Ride)"
                  value={customActivityTitle}
                  onChange={(e) => setCustomActivityTitle(e.target.value)}
                  className="custom-title-input"
                  required
                />
                <input
                  type="text"
                  placeholder="Time (e.g. 17:00)"
                  value={customActivityTime}
                  onChange={(e) => setCustomActivityTime(e.target.value)}
                  className="custom-time-input"
                />
                <div className="milestone-custom-form-btns">
                  <button type="submit" className="search-explore-btn" style={{ padding: '8px 18px' }}>Add</button>
                  <button type="button" className="btn-view-all" onClick={() => setIsAddingCustomActivity(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                className="btn-view-all"
                onClick={() => setIsAddingCustomActivity(true)}
              >
                <Icon name="plus" size={14} />
                <span>Add Activity to Day 0{currentDay.day}</span>
              </button>
            )}

            {/* Secret Insider Tip */}
            {currentDay.insiderTip && (
              <div className="insider-secret-pill">
                💡 <strong>DK Insider Secret:</strong> {currentDay.insiderTip}
              </div>
            )}
          </div>

          {/* ==========================================================================
              TRANSPARENT ESTIMATED DAILY BUDGET BREAKDOWN IN SELECTED CURRENCY
              ========================================================================== */}
          <div className="itinerary-day-budget-card">
            <div>
              <div className="day-budget-title-row">
                <span>Estimated Day 0{currentDay.day} Budget Breakdown</span>
                <span className="day-budget-curr-badge">
                  {displayCurrency}
                </span>
              </div>
              <div className="day-budget-disclaimer">
                *Estimated costs • Approximate values based on current exchange rates
              </div>
            </div>

            <div className="day-budget-items-grid">
              <div className="day-budget-item">
                <span className="dbi-label">Accommodation</span>
                <div className="dbi-val">{dayBudget.stay}</div>
              </div>
              <div className="day-budget-item">
                <span className="dbi-label">Food & Drinks</span>
                <div className="dbi-val">{dayBudget.food}</div>
              </div>
              <div className="day-budget-item">
                <span className="dbi-label">Attractions</span>
                <div className="dbi-val">{dayBudget.activities}</div>
              </div>
              <div className="day-budget-item">
                <span className="dbi-label">Local Transit</span>
                <div className="dbi-val">{dayBudget.transport}</div>
              </div>
              <div className="day-budget-item day-budget-total-item">
                <span className="dbi-label dbi-total-label">Day Total</span>
                <div className="dbi-val dbi-total-val">{dayBudget.totalDay}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================================================
            DEDICATED PRINTABLE ITINERARY DOCUMENT (PRINT / PDF ONLY)
            ========================================================================== */}
        <div className="printable-itinerary-document" aria-hidden="true">
          {/* Header */}
          <div className="print-header-brand">
            <div>
              <div className="print-brand-title">DK HOLIDAYS</div>
              <div className="print-brand-tagline">Intelligent Travel Discovery & Curated Journeys</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '9pt', color: '#666666' }}>
              Ref: {itinerary.id}
            </div>
          </div>

          <div className="print-doc-eyebrow">STRUCTURED DAY-BY-DAY TRAVEL PLAN</div>
          <h1 className="print-doc-title">
            {itinerary.durationDays}-Day {itinerary.destinationName} Itinerary
          </h1>

          <div className="print-doc-meta">
            Curated for: <strong>{itinerary.groupType}</strong> • <strong>{itinerary.travelStyle} pace</strong> • <strong>{formData.pacing} schedule</strong>
          </div>

          {/* Budget Summary Card */}
          <div className="print-budget-box">
            <div className="print-budget-label">ESTIMATED TRIP BUDGET ({itinerary.durationDays} DAYS)</div>
            <div className="print-budget-amount">{formattedTripTotal}</div>
            <div className="print-budget-disclaimer">
              Approximate budget • Based on current exchange rates
            </div>
            <div className="print-budget-currency">
              Currency: <strong>{displayCurrency} ({CURRENCIES[displayCurrency]?.symbol})</strong>
              {!isIndia && displayCurrency === localCurrencyCode && (
                <span> • Destination Local Currency</span>
              )}
              {isIndia && <span> • Local Standard</span>}
            </div>
          </div>

          <div className="print-days-list">
            {itinerary.days.map((dayItem) => {
              const dBudget = getConvertedDailyBudget(dayItem, formData.destinationId, displayCurrency, exchangeRates);
              return (
                <div key={dayItem.day} className="print-day-card">
                  <div className="print-day-heading">
                    <span className="print-day-badge">DAY 0{dayItem.day}</span>
                    <span className="print-day-theme">THEME: {dayItem.theme.toUpperCase()}</span>
                  </div>
                  <h2 className="print-day-title">{dayItem.title}</h2>

                  <div className="print-milestones-container">
                    {/* Morning */}
                    <div className="print-milestone-item">
                      <div className="print-milestone-time">09:00</div>
                      <div className="print-milestone-details">
                        <div className="print-milestone-title">Morning: {dayItem.morning.title}</div>
                        <div className="print-milestone-loc">📍 {dayItem.morning.location}</div>
                        <div className="print-milestone-desc">{dayItem.morning.desc}</div>
                        {dayItem.morning.dining && (
                          <div className="print-milestone-dining">🍴 Dining: {dayItem.morning.dining}</div>
                        )}
                      </div>
                    </div>

                    {/* Afternoon */}
                    <div className="print-milestone-item">
                      <div className="print-milestone-time">14:00</div>
                      <div className="print-milestone-details">
                        <div className="print-milestone-title">Afternoon: {dayItem.afternoon.title}</div>
                        <div className="print-milestone-loc">📍 {dayItem.afternoon.location}</div>
                        <div className="print-milestone-desc">{dayItem.afternoon.desc}</div>
                        {dayItem.afternoon.dining && (
                          <div className="print-milestone-dining">🍴 Dining: {dayItem.afternoon.dining}</div>
                        )}
                      </div>
                    </div>

                    {/* Evening */}
                    <div className="print-milestone-item">
                      <div className="print-milestone-time">19:00</div>
                      <div className="print-milestone-details">
                        <div className="print-milestone-title">Evening: {dayItem.evening.title}</div>
                        <div className="print-milestone-loc">📍 {dayItem.evening.location}</div>
                        <div className="print-milestone-desc">{dayItem.evening.desc}</div>
                        {dayItem.evening.dining && (
                          <div className="print-milestone-dining">🍴 Dining: {dayItem.evening.dining}</div>
                        )}
                      </div>
                    </div>

                    {/* Custom Added Activities */}
                    {(dayItem.customActivities || []).map((customAct) => (
                      <div key={customAct.id} className="print-milestone-item">
                        <div className="print-milestone-time">{customAct.time}</div>
                        <div className="print-milestone-details">
                          <div className="print-milestone-title">Custom Experience: {customAct.title}</div>
                          <div className="print-milestone-desc">{customAct.desc}</div>
                        </div>
                      </div>
                    ))}

                    {/* Insider Secret */}
                    {dayItem.insiderTip && (
                      <div className="print-insider-tip">
                        💡 <strong>DK Insider Secret:</strong> {dayItem.insiderTip}
                      </div>
                    )}

                    {/* Day Budget Breakdown */}
                    <div className="print-day-budget-row">
                      <span className="print-db-label">Day 0{dayItem.day} Budget ({displayCurrency}):</span>
                      <span>Stay: {dBudget.stay}</span>
                      <span>•</span>
                      <span>Food: {dBudget.food}</span>
                      <span>•</span>
                      <span>Attractions: {dBudget.activities}</span>
                      <span>•</span>
                      <span>Transit: {dBudget.transport}</span>
                      <span>•</span>
                      <strong style={{ color: '#000000' }}>Day Total: {dBudget.totalDay}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Document Footer */}
          <div className="print-doc-footer">
            <div>DK Holidays • The world is waiting. Let's plan your next chapter.</div>
            <div>Generated on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • DK Holidays Planner</div>
          </div>
        </div>
      </div>
    </section>
  );
}
