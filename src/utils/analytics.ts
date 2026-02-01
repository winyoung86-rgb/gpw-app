import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID);
  } else {
    console.warn('Google Analytics Measurement ID not found');
  }
};

// Track page views
export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

// Track custom events
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// Specific event tracking helpers for GPW app
export const trackTagSelection = (tags: string[]) => {
  trackEvent('Tag Selection', 'select_tags', tags.join(', '), tags.length);
};

export const trackDateSelection = (dates: string[]) => {
  trackEvent('Date Selection', 'select_dates', dates.join(', '), dates.length);
};

export const trackGenerateItinerary = () => {
  trackEvent('Itinerary', 'generate_itinerary');
};

export const trackViewAllParties = () => {
  trackEvent('Navigation', 'view_all_parties');
};

export const trackPartyCardClick = (partyName: string) => {
  trackEvent('Party Card', 'click', partyName);
};

export const trackExternalLink = (url: string) => {
  trackEvent('External Link', 'click', url);
};
