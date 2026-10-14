import {
  LayoutDashboard,
  Layers,
  Settings,
  Inbox,
  MessageSquareQuote,
  Award,
  Images,
  BriefcaseBusiness,
} from 'lucide-react';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const STATUS = {
  New: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa', dot: '#f97316' },
  Contacted: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe', dot: '#3b82f6' },
  Quoted: { bg: '#faf5ff', text: '#7c3aed', border: '#ddd6fe', dot: '#8b5cf6' },
  Booked: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0', dot: '#22c55e' },
  Completed: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0', dot: '#10b981' },
  Cancelled: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', dot: '#ef4444' },
};

export const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { id: 'quotes', label: 'Quote Requests', icon: Inbox, path: '/admin/quotes' },
  { id: 'services', label: 'Services', icon: Layers, path: '/admin/services' },
  { id: 'projects', label: 'Projects', icon: BriefcaseBusiness, path: '/admin/projects' },
  { id: 'heroCarousel', label: 'Hero Carousel', icon: Images, path: '/admin/hero-carousel' },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, path: '/admin/testimonials' },
  { id: 'brands', label: 'Brand Partners', icon: Award, path: '/admin/brands' },
  { id: 'settings', label: 'Site Settings', icon: Settings, path: '/admin/settings' },
];

export const fmt = (value) => value?.toLocaleString?.() ?? value;
