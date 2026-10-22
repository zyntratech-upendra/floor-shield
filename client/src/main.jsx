import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

import { SiteProvider } from './context/SiteContext';
import AppRouter from './router/AppRouter';
import SplashScreen from './components/SplashScreen';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SiteProvider>
        <SplashScreen />
        <AppRouter />
      </SiteProvider>
    </BrowserRouter>
  </StrictMode>,
);
