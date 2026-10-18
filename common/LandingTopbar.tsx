import React, { useState } from 'react';
import { Sun, Moon, X, Menu } from 'lucide-react';

export interface LandingTopbarProps {
  theme: 'dark' | 'light';
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
  activePage: 'home' | 'platform' | 'features' | 'modules' | 'pricing' | 'portal' | 'signup' | 'tools';
  onNavigateHome: () => void;
  onNavigatePlatform?: () => void;
  onNavigateFeatures?: () => void;
  onNavigateModules?: () => void;
  onNavigatePricing: () => void;
  onNavigateTools?: () => void;
  onNavigatePortal?: () => void;
  onNavigateSignup: () => void;
  onNavigateLogin: () => void;
  onLaunchDemo?: () => void;
}

export const LandingTopbar: React.FC<LandingTopbarProps> = ({
  theme,
  setTheme,
  activePage,
  onNavigateHome,
  onNavigatePlatform,
  onNavigateFeatures,
  onNavigateModules,
  onNavigatePricing,
  onNavigateTools,
  onNavigatePortal,
  onNavigateSignup,
  onNavigateLogin,
  onLaunchDemo
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dk = theme === 'dark';
  const bg = dk ? 'rgba(6, 9, 14, 0.88)' : 'rgba(255, 255, 255, 0.92)';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#475569';
  const acc = dk ? '#e8a838' : '#d97706';
  const bdr = dk ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  const navItems = [
    { label: 'Home', key: 'home', action: onNavigateHome },
    { label: 'Platform', key: 'platform', action: onNavigatePlatform || onNavigateHome },
    { label: 'Features', key: 'features', action: onNavigateFeatures || onNavigateHome },
    { label: 'Modules', key: 'modules', action: onNavigateModules || onNavigateHome },
    { label: 'Pricing', key: 'pricing', action: onNavigatePricing },
    { label: 'Free Tools', key: 'tools', action: onNavigateTools || (() => { window.location.href = '/tools'; }) },
    { label: 'Portal', key: 'portal', action: onNavigatePortal || onNavigateHome }
  ];

  return (
    <>
      <style>{`
        .shared-topbar-desktop { display: flex; }
        .shared-topbar-mobile-btn { display: none; }
        @media(max-width: 1024px) {
          .shared-topbar-desktop { display: none !important; }
          .shared-topbar-mobile-btn { display: flex !important; }
        }
      `}</style>

      {/* ── Fixed Sticky Glassmorphic Header ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        zIndex: 999,
        padding: '0 clamp(16px, 4vw, 48px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: bg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${bdr}`,
        boxSizing: 'border-box',
        transition: 'all 0.25s ease'
      }}>
        {/* Brand Title / Logo */}
        <div
          onClick={onNavigateHome}
          style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{
            fontSize: 18,
            fontWeight: 800,
            fontFamily: "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: fg
          }}>
            CORPVEX <span style={{ color: acc }}>ERP</span>
          </div>
          <div style={{
            fontSize: 9.5,
            fontWeight: 700,
            fontFamily: "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: '0.12em',
            color: acc,
            textTransform: 'uppercase',
            marginTop: 2
          }}>
            Next-Gen Enterprise Suite
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="shared-topbar-desktop" style={{
          alignItems: 'center',
          gap: 28,
          background: 'transparent',
          padding: '6px 0'
        }}>
          {navItems.map((item) => {
            const isActive = activePage === item.key;
            return (
              <span
                key={item.key}
                onClick={item.action}
                style={{
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? acc : fg2,
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.color = acc)}
                onMouseLeave={e => (e.currentTarget.style.color = isActive ? acc : fg2)}
              >
                {item.label}
              </span>
            );
          })}
        </nav>

        {/* Right Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              border: `1px solid ${bdr}`,
              background: dk ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              color: fg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            {dk ? <Sun size={16} /> : <Moon size={16} />}
          </button>


          {/* Mobile & Tablet Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="shared-topbar-mobile-btn"
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              border: `1px solid ${bdr}`,
              background: dk ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              color: fg,
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Slide-out Drawer ── */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 64,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 998,
          background: dk ? 'rgba(6, 9, 14, 0.96)' : 'rgba(248, 250, 252, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderBottom: `1px solid ${bdr}`, paddingBottom: 18 }}>
            {navItems.map((item) => {
              const isActive = activePage === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    item.action();
                  }}
                  style={{
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    color: isActive ? acc : fg,
                    fontSize: 16,
                    fontWeight: 700,
                    padding: '10px 0',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {onLaunchDemo && (
              <button
                onClick={() => { setMobileMenuOpen(false); onLaunchDemo(); }}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: 14,
                  fontWeight: 700,
                  color: acc,
                  background: dk ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${acc}60`,
                  borderRadius: 10,
                  cursor: 'pointer'
                }}
              >
                Launch Interactive Sandbox Demo
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
