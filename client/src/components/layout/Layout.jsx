import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import VideoModal from '../VideoModal';

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar />
      <main style={{ flex: 1, width: '100%', overflowX: 'clip' }}>
        <Outlet />
      </main>
      <Footer />
      <VideoModal />
    </div>
  );
}
