/**
 * DK Holidays — Analytics Event Dispatcher
 * Structured for production readiness (Google Analytics, PostHog, Mixpanel).
 */
export const trackEvent = (eventName, params = {}) => {
  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...params,
  };

  // Dispatch custom DOM event for any attached analytics listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dk_analytics_event', { detail: payload }));
    
    // In development mode, log in a clean, subtle group
    if (import.meta.env?.DEV) {
      // Subtle console log for frontend tracking verification
      // console.debug(`[DK Analytics] ${eventName}`, params);
    }
  }

  return payload;
};
