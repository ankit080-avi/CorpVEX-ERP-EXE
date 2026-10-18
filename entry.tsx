import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { LandingPageView } from './LandingPageView';
import { FreeToolsView } from './tools/FreeToolsView';
import { PricingView } from './PricingView';

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('corpvex_landing_theme');
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [currentView, setCurrentView] = useState<'landing' | 'pricing' | 'tools'>(() => {
    try {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        const path = window.location.pathname;
        const search = window.location.search;
        if (hash === '#pricing' || path.includes('/pricing')) {
          return 'pricing';
        }
        if (hash.startsWith('#tools') || path.includes('/tools') || search.includes('tool=')) {
          return 'tools';
        }
      }
    } catch {}
    return 'landing';
  });

  useEffect(() => {
    try {
      localStorage.setItem('corpvex_landing_theme', theme);
    } catch {}
  }, [theme]);

  // Sync hash changes with currentView
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#pricing') {
        setCurrentView('pricing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#tools')) {
        setCurrentView('tools');
      } else if (!hash || hash === '#' || hash === '#home') {
        setCurrentView('landing');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const scrollToSectionOnLanding = (id: string) => {
    setCurrentView('landing');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleNavigateHome = () => {
    setCurrentView('landing');
    try {
      window.history.pushState(null, '', window.location.pathname);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePricing = () => {
    setCurrentView('pricing');
    try {
      window.history.pushState(null, '', '#pricing');
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTools = () => {
    setCurrentView('tools');
    try {
      window.history.pushState(null, '', '#tools');
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegister = () => {
    scrollToSectionOnLanding('hero');
  };

  const handleLogin = () => {
    window.open(
      'https://wa.me/918858141463?text=' +
        encodeURIComponent('Hi CorpVEX Team, I want 14-Day Free Trial & Demo of CorpVEX ERP.'),
      '_blank'
    );
  };

  if (currentView === 'pricing') {
    return (
      <PricingView
        theme={theme}
        setTheme={setTheme}
        onNavigateHome={handleNavigateHome}
        onNavigatePlatform={() => scrollToSectionOnLanding('platform')}
        onNavigateFeatures={() => scrollToSectionOnLanding('features')}
        onNavigateModules={() => scrollToSectionOnLanding('modules')}
        onNavigatePortal={() => scrollToSectionOnLanding('telemetry')}
        onNavigatePricing={handleNavigatePricing}
        onNavigateTools={handleNavigateTools}
      />
    );
  }

  if (currentView === 'tools') {
    return (
      <FreeToolsView
        theme={theme}
        setTheme={setTheme}
        onNavigateHome={handleNavigateHome}
        onNavigatePlatform={() => scrollToSectionOnLanding('platform')}
        onNavigateFeatures={() => scrollToSectionOnLanding('features')}
        onNavigateModules={() => scrollToSectionOnLanding('modules')}
        onNavigatePortal={() => scrollToSectionOnLanding('telemetry')}
        onNavigatePricing={handleNavigatePricing}
        onNavigateSignup={handleRegister}
        onNavigateLogin={handleLogin}
      />
    );
  }

  return (
    <LandingPageView
      theme={theme}
      setTheme={setTheme}
      onLogin={handleLogin}
      onRegister={handleRegister}
      onPricing={handleNavigatePricing}
      onNavigateTools={handleNavigateTools}
    />
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
