import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../utils/constants';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState({
    siteName: "Floor Shield Australia",
    phone: "0489 074 340",
    tollFree: "1800 231 907",
    email: "floorshieldptyltd@gmail.com",
    address: "Melbourne VIC 3000",
    abn: "75 688 496 166",
    heroTitle: "Premium epoxy floors installed fast, built to last.",
    heroSubtitle: "Transform tired concrete into a seamless, non-slip floor with Australian-made coating systems, certified installers and a clear quote before work begins.",
    heroSlides: [
      {
        kicker: 'Garage epoxy flooring offer',
        title: 'Premium garage floors installed fast, built to last.',
        description: 'Transform tired concrete into a seamless, non-slip floor with Australian-made coating systems, certified installers and a clear quote before work begins.',
        image: '/images/epoxy-flake-garage.jpg',
        alt: 'Decorative flake epoxy garage floor with a clean premium finish',
        badge: 'From $2,499',
        badgeText: 'Garage epoxy packages',
        benefits: ['Most garage floors completed in 2 days', 'Australian-made APC epoxy and flake systems', 'Free measure, quote and coating advice']
      },
      {
        kicker: 'Commercial coating systems',
        title: 'Durable floors for retail, workshops and busy facilities.',
        description: 'Specify a clean, hard-wearing resin system that handles traffic, spills and daily cleaning without slowing the site down.',
        image: '/images/industrial-epoxy-warehouse.jpg',
        alt: 'Industrial epoxy flooring installed across a large warehouse',
        badge: 'Fast return',
        badgeText: 'Polyaspartic topcoat options',
        benefits: ['Purpose-specified systems for each floor', 'Slip-resistant finishes for safer work areas', 'Low-maintenance seamless surfaces']
      },
      {
        kicker: 'Surface preparation matters',
        title: 'Diamond-ground concrete prep before every coating system.',
        description: 'The finish starts below the coating. We prepare, repair and profile concrete properly for stronger adhesion and a longer-lasting result.',
        image: '/images/concrete-diamond-grinding.jpg',
        alt: 'Concrete surface being diamond ground before epoxy installation',
        badge: 'Prep first',
        badgeText: 'Better adhesion and finish',
        benefits: ['Mechanical grinding and slab preparation', 'Crack and joint repair before coating', 'Systems for homes, factories and kitchens']
      }
    ],
    experienceYears: 15,
    projectsCompleted: 2450,
    warrantyYears: 10,
    satisfactionRate: 99.8
  });
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Quote Form State accessible globally or across pages
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    email: '',
    suburb: '',
    serviceType: 'APC Ultra Flake® Seamless Garage & Commercial',
    areaApproxSqm: '50',
    currentFloorState: 'Bare Concrete (Good Condition)',
    preferredTimeline: 'Within 2 Weeks',
    conditionNotes: 'Concrete is in good condition, single expansion joint repair needed.'
  });

  const [activeVideoModal, setActiveVideoModal] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoadingData(true);
      const [resSettings, resServices, resProjects, resReviews, resBrands] = await Promise.all([
        fetch(`${API_BASE}/settings`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/services`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/projects`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/reviews`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/brands`).then(r => r.json()).catch(() => [])
      ]);

      if (resSettings && resSettings.siteName) setSettings(resSettings);
      if (Array.isArray(resServices) && resServices.length > 0) setServices(resServices);
      if (Array.isArray(resProjects) && resProjects.length > 0) setProjects(resProjects);
      if (Array.isArray(resReviews) && resReviews.length > 0) setReviews(resReviews);
      if (Array.isArray(resBrands) && resBrands.length > 0) setBrands(resBrands);
    } catch (err) {
      console.error('Failed fetching data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <SiteContext.Provider value={{
      settings,
      setSettings,
      services,
      setServices,
      projects,
      setProjects,
      reviews,
      setReviews,
      brands,
      setBrands,
      loadingData,
      quoteForm,
      setQuoteForm,
      activeVideoModal,
      setActiveVideoModal,
      refreshData: fetchInitialData
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within a SiteProvider');
  return ctx;
}
