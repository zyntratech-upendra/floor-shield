import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout wrapper (Navbar + Footer + Outlet)
import Layout from '../components/layout/Layout';

// Eagerly load the home page for fastest initial render
import HomePage from '../pages/HomePage';

// Lazy-load secondary public pages
const ProductsPage    = lazy(() => import('../pages/ProductsPage'));
const ServicesPage    = lazy(() => import('../pages/ServicesPage'));
const ProjectsPage    = lazy(() => import('../pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage'));
const CalculatorPage  = lazy(() => import('../pages/CalculatorPage'));
const IndustryPage    = lazy(() => import('../pages/IndustryPage'));
const AboutPage       = lazy(() => import('../pages/AboutPage'));

// Lazy-load service detail page
const ServiceDetailPage = lazy(() => import('../ServiceDetailPage'));

// Lazy-load admin pages
const AdminLogin = lazy(() => import('../AdminLogin'));
const AdminPanel = lazy(() => import('../AdminPanel'));

// ──────────────────────────────────────────────
//  Shared loading fallback
// ──────────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{
        position: 'relative',
        width: '54px',
        height: '54px',
        borderRadius: '50%',
        border: '3.5px solid rgba(234, 88, 12, 0.15)',
        borderTopColor: '#ea580c',
        animation: 'spin 0.8s linear infinite'
      }} />
      <div style={{
        marginTop: '16px',
        fontSize: '0.88rem',
        fontWeight: '700',
        color: '#0f172a',
        letterSpacing: '-0.01em'
      }}>
        Floor Shield Australia
      </div>
      <div style={{
        fontSize: '0.75rem',
        color: '#94a3b8',
        marginTop: '4px'
      }}>
        Loading…
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
//  Admin route guard
// ──────────────────────────────────────────────
function RequireAdmin() {
  const token = localStorage.getItem('fs_admin_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return <AdminPanel />;
}

// ──────────────────────────────────────────────
//  Application Router
// ──────────────────────────────────────────────
export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Admin routes (no public layout) ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*"     element={<RequireAdmin />} />

        {/* ── Service detail (has its own layout internally) ── */}
        <Route path="/services/:slug" element={<ServiceDetailPage />} />

        {/* ── Public routes wrapped in shared Layout ── */}
        <Route element={<Layout />}>
          <Route index                 element={<HomePage />} />
          <Route path="products"       element={<ProductsPage />} />
          <Route path="services"       element={<ServicesPage />} />
          <Route path="projects"       element={<ProjectsPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="calculator"     element={<CalculatorPage />} />
          <Route path="industry"       element={<IndustryPage />} />
          <Route path="about"          element={<AboutPage />} />

          {/* Catch-all → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
