import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, ChevronRight, RefreshCw, Bell, Home, ExternalLink, Menu, X } from 'lucide-react';
import { API_BASE, NAV } from './admin/adminConstants';
import { Toast } from './admin/AdminShared';
import DashboardPage from './admin/pages/DashboardPage';
import QuotesPage from './admin/pages/QuotesPage';
import ServicesPage from './admin/pages/ServicesPage';
import SettingsPage from './admin/pages/SettingsPage';
import TestimonialsPage from './admin/pages/TestimonialsPage';
import BrandsPage from './admin/pages/BrandsPage';
import HeroCarouselPage from './admin/pages/HeroCarouselPage';
import ProjectsPage from './admin/pages/ProjectsPage';
import './admin/admin.css';

export default function AdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [quotes, setQuotes] = useState([]);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [brands, setBrands] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const adminEmail = localStorage.getItem('fs_admin_email') || 'admin@floorshield.au';
  const token = localStorage.getItem('fs_admin_token');
  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  // Sync tab from URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/quotes')) setActiveTab('quotes');
    else if (path.includes('/services')) setActiveTab('services');
    else if (path.includes('/projects')) setActiveTab('projects');
    else if (path.includes('/hero-carousel')) setActiveTab('heroCarousel');
    else if (path.includes('/testimonials')) setActiveTab('testimonials');
    else if (path.includes('/brands')) setActiveTab('brands');
    else if (path.includes('/settings')) setActiveTab('settings');
    else setActiveTab('dashboard');
  }, [location.pathname]);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rq, rs, rp, rt, rb, rset] = await Promise.all([
        fetch(`${API_BASE}/quotes`, { headers: authHeaders }).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/services`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/projects`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/testimonials`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/brands/all`, { headers: authHeaders }).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/settings`).then(r => r.json()).catch(() => ({})),
      ]);
      if (Array.isArray(rq)) setQuotes(rq);
      if (Array.isArray(rs)) setServices(rs);
      if (Array.isArray(rp)) setProjects(rp);
      if (Array.isArray(rt)) setTestimonials(rt);
      if (Array.isArray(rb)) setBrands(rb);
      if (rset?.siteName) setSettings(rset);
    } catch { /* silent */ }
    setLoading(false);
  };

  const showToast = (type, text) => setToast({ type, text });

  const handleLogout = () => {
    localStorage.removeItem('fs_admin_token');
    localStorage.removeItem('fs_admin_email');
    navigate('/admin/login', { replace: true });
  };

  const handleNavClick = (id, path) => {
    setActiveTab(id);
    navigate(path);
    setMobileOpen(false);
  };

  const handleStatusUpdate = async (quoteId, status) => {
    try {
      await fetch(`${API_BASE}/quotes/${quoteId}/status`, { method: 'PATCH', headers: authHeaders, body: JSON.stringify({ status }) });
      setQuotes(prev => prev.map(q => (q.id === quoteId || q._id == quoteId) ? { ...q, status } : q));
      showToast('success', `Status updated to "${status}"`);
    } catch { showToast('error', 'Failed to update status'); }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service from the catalog?')) return;
    try {
      await fetch(`${API_BASE}/services/${id}`, { method: 'DELETE', headers: authHeaders });
      setServices(prev => prev.filter(s => s.id !== id && s._id != id));
      showToast('success', 'Service removed from catalog');
    } catch { showToast('error', 'Delete failed'); }
  };

  const handleAddService = async (form) => {
    try {
      const res = await fetch(`${API_BASE}/services`, { method: 'POST', headers: authHeaders, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { setServices(prev => [data.service, ...prev]); showToast('success', 'Service added successfully!'); }
    } catch { showToast('error', 'Failed to add service'); }
  };

  const handleUpdateService = async (id, form) => {
    try {
      const res = await fetch(`${API_BASE}/services/${id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setServices(prev => prev.map(s => (s.id === id || s._id === id) ? data.service : s));
        showToast('success', 'Service updated successfully!');
      }
    } catch { showToast('error', 'Failed to update service'); }
  };

  const handleAddProject = async (form) => {
    try {
      const res = await fetch(`${API_BASE}/projects`, { method: 'POST', headers: authHeaders, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to add project.');
      setProjects(prev => [data.project, ...prev]);
      showToast('success', 'Project added to the portfolio.');
      return true;
    } catch (error) {
      showToast('error', error.message || 'Failed to add project.');
      return false;
    }
  };

  const handleUpdateProject = async (id, form) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update project.');
      setProjects(prev => prev.map(project => (
        project._id === id || project.id === id ? data.project : project
      )));
      showToast('success', 'Project details updated.');
      return true;
    } catch (error) {
      showToast('error', error.message || 'Failed to update project.');
      return false;
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE', headers: authHeaders });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete project.');
      setProjects(prev => prev.filter(project => project._id !== id && project.id !== id));
      showToast('success', 'Project removed from the portfolio.');
    } catch (error) {
      showToast('error', error.message || 'Failed to delete project.');
    }
  };

  /* ── Testimonials CRUD Handlers ── */
  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Delete this customer review?')) return;
    try {
      await fetch(`${API_BASE}/testimonials/${id}`, { method: 'DELETE', headers: authHeaders });
      setTestimonials(prev => prev.filter(t => t.id !== id && t._id !== id));
      showToast('success', 'Review deleted successfully');
    } catch { showToast('error', 'Failed to delete review'); }
  };

  const handleAddTestimonial = async (form) => {
    try {
      const res = await fetch(`${API_BASE}/testimonials`, { method: 'POST', headers: authHeaders, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setTestimonials(prev => [data.testimonial, ...prev]);
        showToast('success', 'Testimonial added to Google reviews!');
      }
    } catch { showToast('error', 'Failed to create testimonial'); }
  };

  const handleUpdateTestimonial = async (id, form) => {
    try {
      const res = await fetch(`${API_BASE}/testimonials/${id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setTestimonials(prev => prev.map(t => (t.id === id || t._id === id) ? data.testimonial : t));
        showToast('success', 'Testimonial updated successfully!');
      }
    } catch { showToast('error', 'Failed to update testimonial'); }
  };

  /* ── Brands CRUD Handlers ── */
  const handleAddBrand = async (form) => {
    try {
      const res = await fetch(`${API_BASE}/brands`, { method: 'POST', headers: authHeaders, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setBrands(prev => [...prev, data.brand]);
        showToast('success', 'Brand logo added to carousel!');
      }
    } catch { showToast('error', 'Failed to add brand'); }
  };

  const handleUpdateBrand = async (id, form) => {
    try {
      const res = await fetch(`${API_BASE}/brands/${id}`, { method: 'PUT', headers: authHeaders, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setBrands(prev => prev.map(b => (b.id === id || b._id === id) ? data.brand : b));
        showToast('success', 'Brand logo updated successfully!');
      }
    } catch { showToast('error', 'Failed to update brand'); }
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm('Delete this brand logo?')) return;
    try {
      await fetch(`${API_BASE}/brands/${id}`, { method: 'DELETE', headers: authHeaders });
      setBrands(prev => prev.filter(b => b.id !== id && b._id !== id));
      showToast('success', 'Brand logo removed');
    } catch { showToast('error', 'Failed to delete brand'); }
  };

  const handleSaveSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`, { method: 'PUT', headers: authHeaders, body: JSON.stringify(settings) });
      const data = await res.json();
      if (data.success) showToast('success', 'Settings saved successfully!');
    } catch { showToast('error', 'Failed to save settings'); }
  };

  const SBW = collapsed ? 76 : 268;
  const newCount = quotes.filter(q => (q.status || 'New') === 'New').length;
  /* Sidebar link */
  const SidebarLink = ({ item }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    const badge = item.id === 'quotes' && newCount > 0 ? newCount : null;
    return (
      <button 
        onClick={() => handleNavClick(item.id, item.path)}
        style={{
          position: 'relative',
          display: 'flex', alignItems: 'center', gap: '11px',
          padding: collapsed ? '10px 0' : '9px 12px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderRadius: '10px', border: 'none', width: '100%',
          backgroundColor: isActive ? '#fff7ed' : 'transparent',
          color: isActive ? '#ea580c' : '#475569',
          fontWeight: isActive ? '700' : '500', fontSize: '0.85rem',
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
          whiteSpace: 'nowrap', overflow: 'hidden',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => { 
          if (!isActive) { 
            e.currentTarget.style.backgroundColor = '#f1f5f9'; 
            e.currentTarget.style.color = '#0f172a'; 
          } 
        }}
        onMouseLeave={e => { 
          if (!isActive) { 
            e.currentTarget.style.backgroundColor = 'transparent'; 
            e.currentTarget.style.color = '#475569'; 
          } 
        }}
      >
        {/* Active subtle left accent indicator */}
        {isActive && (
          <span style={{
            position: 'absolute', left: '0px', top: '15%', bottom: '15%',
            width: '3.5px', borderRadius: '0 4px 4px 0',
            backgroundColor: '#ea580c',
          }} />
        )}

        {/* Icon container */}
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: isActive ? 'rgba(234,88,12,0.12)' : 'transparent',
          color: isActive ? '#ea580c' : '#64748b',
          transition: 'all 0.15s ease'
        }}>
          <Icon size={17} strokeWidth={isActive ? 2.4 : 1.9} />
        </div>

        {!collapsed && (
          <>
            <span style={{ flex: 1, letterSpacing: '-0.01em', fontWeight: isActive ? '600' : '500' }}>{item.label}</span>
            {badge && (
              <span style={{
                minWidth: '20px', height: '18px', borderRadius: '6px',
                backgroundColor: '#ea580c', color: '#fff',
                fontSize: '0.68rem', fontWeight: '700',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 6px', flexShrink: 0
              }}>{badge}</span>
            )}
            {!badge && isActive && (
              <ChevronRight size={13} color="#ea580c" style={{ flexShrink: 0, opacity: 0.7 }} />
            )}
          </>
        )}

        {/* Collapsed badge dot */}
        {collapsed && badge && (
          <span style={{ position: 'absolute', top: '6px', right: '8px', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ea580c', border: '1.5px solid #fff' }} />
        )}
      </button>
    );
  };

  const pageTitle = {
    dashboard: 'Dashboard',
    quotes: 'Quote Requests',
    services: 'Services',
    projects: 'Projects',
    heroCarousel: 'Hero Carousel',
    testimonials: 'Customer Testimonials',
    brands: 'Brand Partner Logos',
    settings: 'Site Settings'
  };

  return (
    <div className="admin-shell" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="admin-sidebar-backdrop"
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)', zIndex: 999
          }}
        />
      )}

      {/* ══ PREMIUM SIDEBAR ══ */}
      <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`} style={{
        width: SBW, flexShrink: 0,
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 1000,
        transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1), transform 0.28s cubic-bezier(0.4,0,0.2,1)', overflow: 'hidden'
      }}>

        {/* ── CLEAN LOGO BRANDING ── */}
        <div style={{
          height: '76px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: !collapsed ? '10px 16px 10px 20px' : '10px',
          borderBottom: '1px solid #f1f5f9',
          flexShrink: 0
        }}>
          {!collapsed ? (
            <img 
              src="/logo.png" 
              alt="Floor Shield" 
              style={{ 
                maxHeight: '48px', 
                maxWidth: '170px', 
                objectFit: 'contain' 
              }}
              onError={e => { e.target.style.display='none'; }} 
            />
          ) : (
            <img 
              src="/logo.png" 
              alt="Floor Shield" 
              style={{ 
                maxHeight: '42px', 
                maxWidth: '42px', 
                objectFit: 'contain',
                margin: '0 auto' 
              }}
              onError={e => { e.target.style.display='none'; }} 
            />
          )}

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="admin-sidebar-close-btn"
            style={{
              display: 'none',
              background: 'none', border: 'none', color: '#64748b',
              padding: '6px', borderRadius: '8px', cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── NAV LINKS ── */}
        <div style={{ flex: 1, padding: collapsed ? '12px 6px' : '14px 10px', display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto' }}>
          {!collapsed && (
            <p style={{ fontSize: '0.62rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px 8px', margin: 0 }}>
              Navigation
            </p>
          )}
          {NAV.map(item => <SidebarLink key={item.id} item={item} />)}

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '12px 6px' }} />

          {/* Quick links */}
          {!collapsed && (
            <p style={{ fontSize: '0.62rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 10px 6px', margin: 0 }}>
              External
            </p>
          )}
          <a 
            href="/" target="_blank" rel="noreferrer"
            title={collapsed ? "View Live Site" : undefined}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '11px', 
              padding: collapsed ? '10px 0' : '9px 12px', 
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: '10px', textDecoration: 'none', 
              color: '#475569', fontSize: '0.85rem', fontWeight: '500', 
              transition: 'all 0.15s' 
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#475569'; }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#64748b' }}>
              <ExternalLink size={16} />
            </div>
            {!collapsed && <span style={{ flex: 1, letterSpacing: '-0.01em' }}>View Live Site</span>}
          </a>
        </div>

        {/* ── SIDEBAR BOTTOM CONTROLS (LOGOUT & COLLAPSE) ── */}
        <div style={{ padding: collapsed ? '10px 6px' : '10px 10px', borderTop: '1px solid #f1f5f9', flexShrink: 0, backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Logout button */}
          <button 
            onClick={handleLogout}
            title={collapsed ? "Log Out" : undefined}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '10px', padding: collapsed ? '9px 0' : '9px 12px',
              borderRadius: '8px', border: '1px solid #fee2e2', width: '100%',
              backgroundColor: '#fef2f2', color: '#dc2626',
              cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '0.82rem', fontWeight: '600', whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fee2e2'; e.currentTarget.style.borderColor = '#fca5a5'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.borderColor = '#fee2e2'; }}
          >
            <LogOut size={16} color="#dc2626" style={{ flexShrink: 0 }} />
            {!collapsed && <span>Log Out</span>}
          </button>

          {/* Collapse Toggle */}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            style={{
              display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between',
              gap: '8px', padding: collapsed ? '8px 0' : '8px 12px',
              borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%',
              backgroundColor: '#ffffff', color: '#64748b',
              cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '0.78rem', fontWeight: '600', whiteSpace: 'nowrap',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            {!collapsed && <span>Collapse Sidebar</span>}
            <ChevronRight size={14} style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.25s', flexShrink: 0 }} />
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="admin-main" style={{ marginLeft: SBW, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', transition: 'margin-left 0.25s ease' }}>

        {/* Top Header */}
        <header className="admin-topbar" style={{
          minHeight: '64px', backgroundColor: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
          boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', position: 'sticky', top: 0, zIndex: 90, gap: '12px'
        }}>
          {/* Left: Mobile Toggle + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              title="Open Navigation"
              className="admin-mobile-menu-btn"
              style={{
                width: '38px', height: '38px', borderRadius: '10px',
                border: '1.5px solid #e2e8f0', backgroundColor: '#ffffff',
                display: 'none', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#1e293b', flexShrink: 0
              }}
            >
              <Menu size={18} />
            </button>
            <div style={{ minWidth: 0 }}>
              <h1 className="admin-page-title" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.18rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.025em', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {pageTitle[activeTab]}
              </h1>
              <div className="admin-breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '1px' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Admin</span>
                <span style={{ color: '#cbd5e1', fontSize: '0.7rem' }}>›</span>
                <span style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: '600' }}>{pageTitle[activeTab]}</span>
              </div>
            </div>
          </div>

          {/* Right actions: Compact, balanced icons */}
          <div className="admin-topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* New quotes pill */}
            {newCount > 0 && (
              <button
                onClick={() => handleNavClick('quotes', '/admin/quotes')}
                className="admin-lead-pill"
                title={`${newCount} new pending quote inquiries`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '999px',
                  backgroundColor: '#fff7ed', border: '1px solid #fed7aa',
                  color: '#ea580c', fontSize: '0.76rem', fontWeight: '750',
                  cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0
                }}
              >
                <Bell size={13} color="#ea580c" />
                <span>{newCount} new</span>
              </button>
            )}

            {/* Refresh */}
            <button
              onClick={fetchAll}
              title="Refresh Dashboard"
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
                color: '#64748b', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', flexShrink: 0
              }}
            >
              <RefreshCw size={15} />
            </button>

            {/* Live site link */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="admin-livesite-btn"
              title="View Public Website"
              style={{
                height: '36px', padding: '0 12px', borderRadius: '10px',
                border: '1px solid #e2e8f0', backgroundColor: '#ffffff',
                color: '#334155', fontSize: '0.78rem', fontWeight: '650',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                textDecoration: 'none', flexShrink: 0
              }}
            >
              <Home size={14} />
              <span className="admin-livesite-text">Live Site</span>
            </a>

            {/* Admin Avatar chip & logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '4px', borderLeft: '1px solid #f1f5f9' }}>
              <div
                title={adminEmail}
                style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.82rem', fontWeight: '800', color: '#ffffff',
                  boxShadow: '0 2px 6px rgba(234, 88, 12, 0.25)', flexShrink: 0
                }}
              >
                {adminEmail.charAt(0).toUpperCase()}
              </div>

              <button
                onClick={handleLogout}
                className="admin-logout-btn"
                title="Log out from Admin"
                style={{
                  height: '34px', padding: '0 10px', borderRadius: '9px',
                  backgroundColor: '#fef2f2', border: '1px solid #fee2e2',
                  color: '#dc2626', fontSize: '0.76rem', fontWeight: '700',
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px',
                  fontFamily: 'inherit', flexShrink: 0
                }}
              >
                <LogOut size={13} />
                <span className="admin-logout-text">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Toast */}
        <AnimatePresence>
          {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
        </AnimatePresence>

        {/* Page Content */}
        <main className="admin-content" style={{ flex: 1, padding: '28px', overflowX: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid #f1f5f9', borderTopColor: '#ea580c', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Loading dashboard data...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {activeTab === 'dashboard'    && <DashboardPage quotes={quotes} services={services} onTabChange={id => handleNavClick(id, NAV.find(n => n.id === id)?.path)} />}
                {activeTab === 'quotes'       && (
                  <QuotesPage
                    quotes={quotes}
                    onStatusUpdate={handleStatusUpdate}
                    onQuoteUpdated={(updatedQuote) => {
                      setQuotes(prev => prev.map(q => (q.id === updatedQuote.id || q._id === updatedQuote._id) ? updatedQuote : q));
                      showToast('success', 'Email reply recorded!');
                    }}
                  />
                )}
                {activeTab === 'services'     && <ServicesPage services={services} onDelete={handleDeleteService} onAdd={handleAddService} onUpdate={handleUpdateService} />}
                {activeTab === 'projects'     && <ProjectsPage projects={projects} onDelete={handleDeleteProject} onAdd={handleAddProject} onUpdate={handleUpdateProject} />}
                {activeTab === 'heroCarousel' && <HeroCarouselPage settings={settings} onChange={setSettings} onSave={handleSaveSettings} />}
                {activeTab === 'testimonials' && <TestimonialsPage testimonials={testimonials} onDelete={handleDeleteTestimonial} onAdd={handleAddTestimonial} onUpdate={handleUpdateTestimonial} />}
                {activeTab === 'brands'       && <BrandsPage brands={brands} onAdd={handleAddBrand} onUpdate={handleUpdateBrand} onDelete={handleDeleteBrand} />}
                {activeTab === 'settings'     && <SettingsPage settings={settings} onChange={setSettings} onSave={handleSaveSettings} />}
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        {/* Footer */}
        <footer style={{ padding: '16px 28px', borderTop: '1px solid #f1f5f9', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
          <span>© 2026 Floor Shield Australia — Admin CMS</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: '600' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
            All systems operational
          </span>
        </footer>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes liquidFloat1 {
          0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(30px, -45px) scale(1.12) rotate(120deg); }
          66% { transform: translate(-25px, 25px) scale(0.92) rotate(240deg); }
          100% { transform: translate(0px, 0px) scale(1) rotate(360deg); }
        }
        @keyframes liquidFloat2 {
          0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(-35px, 30px) scale(0.88) rotate(-120deg); }
          66% { transform: translate(25px, -35px) scale(1.15) rotate(-240deg); }
          100% { transform: translate(0px, 0px) scale(1) rotate(-360deg); }
        }
        @keyframes liquidFloat3 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, 20px) scale(1.18); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(241, 245, 249, 0.5); }
        ::-webkit-scrollbar-thumb { background: rgba(203, 213, 225, 0.8); border-radius: 999px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.9); }
      `}</style>
    </div>
  );
}
