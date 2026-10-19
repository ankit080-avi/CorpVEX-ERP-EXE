import React, { useState } from 'react';
import { LandingTopbar } from './common/LandingTopbar';
import {
  Sun, Moon, CheckCircle2, ArrowRight, ShieldCheck, Zap,
  Building2, Sparkles, X, Menu, Check, HelpCircle, PhoneCall, Clock
} from 'lucide-react';

export interface PricingViewProps {
  theme: 'dark' | 'light';
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
  onNavigateHome: () => void;
  onNavigatePlatform?: () => void;
  onNavigateFeatures?: () => void;
  onNavigateModules?: () => void;
  onNavigatePortal?: () => void;
  onNavigatePricing?: () => void;
  onNavigateTools?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  theme,
  setTheme,
  onNavigateHome,
  onNavigatePlatform,
  onNavigateFeatures,
  onNavigateModules,
  onNavigatePortal,
  onNavigatePricing,
  onNavigateTools,
}) => {
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [starterUserMode, setStarterUserMode] = useState<'single' | 'dual'>('single');
  const [businessMode, setBusinessMode] = useState<'standard' | 'pro'>('standard');
  const [mouseCoords, setMouseCoords] = useState({ x: -1000, y: -1000 });

  const dk = theme === 'dark';
  const bg = dk ? '#070e1b' : '#f8fafc';
  const bg2 = dk ? '#0d1728' : '#ffffff';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#475569';
  const acc = dk ? '#e8a838' : '#d97706';
  const bdr = dk ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <div
      onMouseMove={(e) => setMouseCoords({ x: e.clientX, y: e.clientY })}
      style={{
        minHeight: '100vh',
        width: '100%',
        fontFamily: "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        color: fg,
        background: bg,
        position: 'relative'
      }}
    >
      <style>{`
        *{box-sizing:border-box}

        .pv-bg-watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
          font-size:clamp(120px, 20vw, 320px);font-weight:900;letter-spacing:-0.04em;
          color:${dk ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.025)'};
          user-select:none;z-index:1;white-space:nowrap;display:flex;gap:4px;
          pointer-events:none;max-width:100vw;overflow:hidden}
        .pv-bg-watermark span {
          display: inline-block;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer; pointer-events: auto;
        }
        .pv-bg-watermark span:hover {
          color: ${acc} !important;
          opacity: 0.35 !important;
          transform: translateY(-10px) scale(1.08);
          text-shadow: 0 0 40px ${acc}80;
        }

        .pv-mono-tag {
          font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .pv-serif-title {
          font-family: 'Playfair Display', 'Merriweather', 'Georgia', serif;
          letter-spacing: -0.02em;
        }

        .pv-price-card {
          position: relative;
          background: ${bg2};
          border: 1px solid ${bdr};
          border-radius: 20px;
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: ${dk ? '0 20px 50px rgba(0,0,0,0.5)' : '0 16px 40px rgba(15,23,42,0.06)'};
        }
        .pv-price-card:hover {
          transform: translateY(-6px);
          border-color: ${acc};
          box-shadow: ${dk ? `0 28px 70px rgba(0,0,0,0.7), 0 0 35px ${acc}20` : `0 24px 55px rgba(15,23,42,0.1), 0 0 25px ${acc}20`};
        }
        .pv-price-card.popular {
          border-color: ${acc};
          background: ${dk ? 'linear-gradient(180deg, #101c30 0%, #0d1728 100%)' : '#ffffff'};
          box-shadow: ${dk ? `0 24px 60px rgba(0,0,0,0.6), 0 0 30px ${acc}25` : `0 20px 50px rgba(217,119,6,0.12)`};
        }

        .pv-pill-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          font-family: inherit; font-size: 13.5px; font-weight: 700;
          cursor: pointer; transition: all .2s ease;
          border-radius: 8px;
        }

        .pv-user-pill {
          padding: 3px 8px;
          border-radius: 4px;
          border: none;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        @media(max-width:1024px){
          .pv-nav-links{display:none !important}
          .pv-mobile-menu-btn{display:flex !important}
        }
      `}</style>

      {/* Background Watermark Text with Interactive Hover Shine */}
      <div className="pv-bg-watermark">
        <span>C</span>
        <span>O</span>
        <span>R</span>
        <span>P</span>
        <span>V</span>
        <span>E</span>
        <span>X</span>
      </div>

      {/* ── Single Unified Fixed Blueprint Grid ── */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: dk
          ? 'linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)'
          : 'linear-gradient(rgba(0, 0, 0, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.045) 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />

      {/* ── Interactive Blueprint Grid Hover Spotlight ── */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: dk
          ? 'linear-gradient(rgba(232, 168, 56, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(232, 168, 56, 0.25) 1px, transparent 1px)'
          : 'linear-gradient(rgba(217, 119, 6, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 119, 6, 0.25) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: `radial-gradient(380px circle at ${mouseCoords.x}px ${mouseCoords.y}px, black 15%, transparent 80%)`,
        WebkitMaskImage: `radial-gradient(380px circle at ${mouseCoords.x}px ${mouseCoords.y}px, black 15%, transparent 80%)`,
        opacity: 0.95,
        transition: 'opacity 0.25s ease'
      }} />

      {/* Top Header Navbar (Shared) */}
      <LandingTopbar
        theme={theme}
        setTheme={setTheme}
        activePage="pricing"
        onNavigateHome={onNavigateHome}
        onNavigatePlatform={onNavigatePlatform}
        onNavigateFeatures={onNavigateFeatures}
        onNavigateModules={onNavigateModules}
        onNavigatePortal={onNavigatePortal}
        onNavigatePricing={onNavigatePricing || (() => { window.scrollTo({ top: 0, behavior: 'smooth' }); })}
        onNavigateTools={onNavigateTools}
      />

      {/* Main Pricing Container */}
      <main style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: 1680,
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(36px, 5vh, 60px) clamp(20px, 4vw, 64px) 80px'
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div className="pv-mono-tag" style={{ fontSize: 11.5, fontWeight: 800, color: acc, letterSpacing: '0.18em', marginBottom: 12 }}>
            TRANSPARENT ENTERPRISE PRICING
          </div>
          <h1 className="pv-serif-title" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16, color: fg }}>
            Predictable Investment. <span style={{ color: acc, fontStyle: 'italic' }}>Massive Returns.</span>
          </h1>
          <p style={{ fontSize: 'clamp(14.5px, 1.8vw, 17px)', color: fg2, maxWidth: 760, margin: '0 auto 32px', lineHeight: 1.65 }}>
            Simple, honest pricing with statutory compliance, clear one-time onboarding charges, and dedicated industrial tiers engineered from retail counters up to composite mills.
          </p>

          {/* Billing Cycle Switcher */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: dk ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
            padding: 5, borderRadius: 50, border: `1px solid ${bdr}`
          }}>
            <button
              onClick={() => setBillingCycle('annual')}
              style={{
                padding: '8px 24px', borderRadius: 50, border: 'none',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                background: billingCycle === 'annual' ? acc : 'transparent',
                color: billingCycle === 'annual' ? (dk ? '#080e1a' : '#ffffff') : fg2,
                transition: 'all 0.2s ease'
              }}
            >
              Annual Billing
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: '8px 24px', borderRadius: 50, border: 'none',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                background: billingCycle === 'monthly' ? acc : 'transparent',
                color: billingCycle === 'monthly' ? (dk ? '#080e1a' : '#ffffff') : fg2,
                transition: 'all 0.2s ease'
              }}
            >
              Monthly Billing
            </button>
          </div>
        </div>

        {/* 3 Pricing Tier Cards (Starter, Business w/ Pro Toggle, Textile Industry) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginBottom: 70 }}>
          {/* Plan 1: Starter ERP */}
          <div className="pv-price-card">
            <div>
              <div className="pv-mono-tag" style={{ fontSize: 11, fontWeight: 800, color: fg2, marginBottom: 8 }}>
                TIER 01 · APPROVED ENTRY
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: fg, margin: '0 0 8px' }}>
                Starter ERP
              </h3>
              <p style={{ fontSize: 13.5, color: fg2, lineHeight: 1.5, margin: '0 0 20px', minHeight: 40 }}>
                For single-location textile traders, retail counters, and small wholesale businesses.
              </p>

              <div style={{ marginBottom: 24, borderBottom: `1px solid ${bdr}`, paddingBottom: 20 }}>
                {billingCycle === 'annual' ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 38, fontWeight: 900, color: fg, letterSpacing: '-0.03em' }}>
                        ₹5,999
                      </span>
                      <span style={{ fontSize: 13, color: fg2 }}>/ year</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: fg2, marginTop: 4 }}>
                      Up to 5 concurrent users · ₹5,000 one-time setup
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 38, fontWeight: 900, color: fg, letterSpacing: '-0.03em' }}>
                        {starterUserMode === 'single' ? '₹500' : '₹799'}
                      </span>
                      <span style={{ fontSize: 13, color: fg2 }}>/ month</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                      <button
                        onClick={() => setStarterUserMode('single')}
                        className="pv-user-pill"
                        style={{
                          background: starterUserMode === 'single' ? (dk ? 'rgba(255,255,255,0.18)' : '#e2e8f0') : 'transparent',
                          color: fg
                        }}
                      >
                        1 User: ₹500/mo
                      </button>
                      <button
                        onClick={() => setStarterUserMode('dual')}
                        className="pv-user-pill"
                        style={{
                          background: starterUserMode === 'dual' ? (dk ? 'rgba(255,255,255,0.18)' : '#e2e8f0') : 'transparent',
                          color: fg
                        }}
                      >
                        2 Users: ₹799/mo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
                {[
                  billingCycle === 'annual' ? 'Up to 5 Users Included' : (starterUserMode === 'single' ? '1 User Included' : '2 Users Included'),
                  '1 Company · Single Branch / Counter',
                  'Double-Entry Accounting & Ledgers',
                  'Multi-Godown Inventory & Stock Valuation',
                  'GST Invoice & E-Way Portal Data Export',
                  'Daily Automated Local Database Backup',
                  '₹5,000 One-Time Guided Setup'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: fg }}>
                    <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://drive.google.com/uc?export=download&id=1aPSjcxZtgJy3R1Aw6M_WhYi5oYIGLMdz"
              target="_blank"
              rel="noopener noreferrer"
              className="pv-pill-btn"
              style={{ width: '100%', padding: '13px', background: 'transparent', color: fg, border: `1px solid ${bdr}`, textDecoration: 'none' }}
            >
              Start 14-Day Free Trial
            </a>
          </div>

          {/* Plan 2: Business ERP (with inline Pro toggle) */}
          <div className="pv-price-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div className="pv-mono-tag" style={{ fontSize: 11, fontWeight: 800, color: businessMode === 'pro' ? '#818cf8' : '#38bdf8' }}>
                  {businessMode === 'pro' ? 'TIER 02 · ADVANCED OPERATIONS (PRO)' : 'TIER 02 · WHOLESALE & DISTRIBUTION'}
                </div>
                {/* Pro Switcher Toggle Pill */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: dk ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                  padding: '2px',
                  borderRadius: 20,
                  border: `1px solid ${bdr}`,
                  gap: 2
                }}>
                  <button
                    type="button"
                    onClick={() => setBusinessMode('standard')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 16,
                      border: 'none',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: businessMode === 'standard' ? '#38bdf8' : 'transparent',
                      color: businessMode === 'standard' ? (dk ? '#080e1a' : '#ffffff') : fg2,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Business
                  </button>
                  <button
                    type="button"
                    onClick={() => setBusinessMode('pro')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 16,
                      border: 'none',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: businessMode === 'pro' ? '#818cf8' : 'transparent',
                      color: businessMode === 'pro' ? '#ffffff' : fg2,
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <span>Pro</span>
                    <span style={{
                      fontSize: 8.5,
                      fontWeight: 800,
                      padding: '1px 4px',
                      borderRadius: 4,
                      background: businessMode === 'pro' ? 'rgba(255,255,255,0.25)' : (dk ? 'rgba(129,140,248,0.2)' : 'rgba(129,140,248,0.15)'),
                      color: businessMode === 'pro' ? '#ffffff' : '#818cf8'
                    }}>
                      ADVANCED
                    </span>
                  </button>
                </div>
              </div>

              <h3 style={{ fontSize: 24, fontWeight: 800, color: fg, margin: '0 0 8px' }}>
                {businessMode === 'pro' ? 'Business Pro ERP' : 'Business ERP'}
              </h3>
              <p style={{ fontSize: 13.5, color: fg2, lineHeight: 1.5, margin: '0 0 20px', minHeight: 40 }}>
                {businessMode === 'pro'
                  ? 'For multi-branch textile groups requiring centralized consolidation and real-time sync.'
                  : 'For expanding wholesale distributors, trading firms, and multi-counter sales operations.'}
              </p>

              <div style={{ marginBottom: 24, borderBottom: `1px solid ${bdr}`, paddingBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: businessMode === 'pro' ? '#818cf8' : '#38bdf8', letterSpacing: '-0.02em' }}>
                    Custom Quote
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: fg2, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} color={businessMode === 'pro' ? '#818cf8' : '#38bdf8'} />
                  <span>
                    {businessMode === 'pro'
                      ? 'Quotation-Based · Enterprise Licensing'
                      : 'Quotation-Based · Pricing Under Review'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
                {(businessMode === 'pro'
                  ? [
                      'Enterprise Multi-User Team Licensing',
                      'Multi-Company Group · Multi-Branch Sync',
                      'Drag-and-Drop Visual Report Designer',
                      'MCA-Compliant Immutable Audit Trail & Diffs',
                      'Telegram & WhatsApp Operational Alerts',
                      'Continuous Multi-Cloud Database Replication',
                      'Dedicated Solution Architect & Fast SLA'
                    ]
                  : [
                      'Scalable User Packages on Quotation',
                      'Up to 3 Companies · Multi-Counter Sales',
                      '1-Click Direct GST e-Invoice & e-Way Bill API',
                      'Automated WhatsApp PDF Statement Dispatch',
                      '100% Watermark-Free Document Printing',
                      'Automated Daily Encrypted Cloud Backup',
                      'Master Data Migration & Priority Desk'
                    ]
                ).map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: fg }}>
                    <CheckCircle2 size={16} color={businessMode === 'pro' ? '#818cf8' : '#38bdf8'} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={businessMode === 'pro'
                ? "https://wa.me/918858141463?text=Hello%20CorpVEX%20Team%2C%20I%20want%20to%20request%20a%20quotation%20for%20the%20Business%20Pro%20ERP%20plan."
                : "https://wa.me/918858141463?text=Hello%20CorpVEX%20Team%2C%20I%20want%20to%20request%20a%20quotation%20for%20the%20Business%20ERP%20plan."
              }
              target="_blank"
              rel="noopener noreferrer"
              className="pv-pill-btn"
              style={{
                width: '100%',
                padding: '13px',
                background: 'transparent',
                color: fg,
                border: `1px solid ${businessMode === 'pro' ? 'rgba(129, 140, 248, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
                textDecoration: 'none'
              }}
            >
              <span>{businessMode === 'pro' ? 'Request Business Pro Quote' : 'Request Business Quote'}</span>
              <ArrowRight size={15} color={businessMode === 'pro' ? '#818cf8' : '#38bdf8'} />
            </a>
          </div>

          {/* Plan 3: Textile Industry ERP (Popular) */}
          <div className="pv-price-card popular">
            <div style={{
              position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
              background: acc, color: dk ? '#080e1a' : '#ffffff', fontSize: 11, fontWeight: 900,
              padding: '3px 14px', borderRadius: 50, letterSpacing: '0.12em', boxShadow: `0 4px 14px ${acc}40`,
              whiteSpace: 'nowrap'
            }}>
              APPROVED TEXTILE PRICING
            </div>

            <div>
              <div className="pv-mono-tag" style={{ fontSize: 11, fontWeight: 800, color: acc, marginBottom: 8 }}>
                TIER 03 · SPECIALIZED TEXTILE SUITE
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: fg, margin: '0 0 8px' }}>
                Textile Industry ERP
              </h3>
              <p style={{ fontSize: 13.5, color: fg2, lineHeight: 1.5, margin: '0 0 20px', minHeight: 40 }}>
                Specialized ERP suite for composite mills, weaving units, dyeing/printing & garment exporters.
              </p>

              <div style={{ marginBottom: 24, borderBottom: `1px solid ${bdr}`, paddingBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 38, fontWeight: 900, color: acc, letterSpacing: '-0.03em' }}>
                    {billingCycle === 'annual' ? '₹99,999' : '₹15,000'}
                  </span>
                  <span style={{ fontSize: 13, color: fg2 }}>{billingCycle === 'annual' ? '/ year' : '/ month'}</span>
                </div>
                <div style={{ fontSize: 11.5, color: acc, marginTop: 4, fontWeight: 600 }}>
                  {billingCycle === 'annual'
                    ? 'Subject to defined user limits · ₹2,000/mo per extra user'
                    : 'For min 5 users · ₹2,000/mo for each extra user'}
                </div>
                <div style={{ fontSize: 11, color: fg2, marginTop: 4 }}>
                  ₹1,00,000 install + ₹50,000 e-way setup (one-time)
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
                {[
                  'Minimum 5 Users Included (+₹2,000/mo per extra user)',
                  'Grey Fabric Inward, Loom Issue & Finish Receipt',
                  'Multi-Level BOM & Dyeing/Printing Jobwork',
                  'Challan Tracking, Bale/Lot & Piece-Rate Wages',
                  'Dedicated High-Speed Direct NIC E-Way API Gateway',
                  'On-Site Implementation & 24/7 Mill Support SLA'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: fg }}>
                    <CheckCircle2 size={16} color={acc} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/918858141463?text=Hello%20CorpVEX%20Team%2C%20I%20want%20to%20book%20a%20demo%20for%20the%20Textile%20Industry%20ERP%20edition."
              target="_blank"
              rel="noopener noreferrer"
              className="pv-pill-btn"
              style={{ width: '100%', padding: '14px', background: acc, color: dk ? '#080e1a' : '#ffffff', border: 'none', boxShadow: `0 4px 18px ${acc}45`, textDecoration: 'none' }}
            >
              <span>Book Textile ERP Demo</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div style={{
          background: bg2, border: `1px solid ${bdr}`, borderRadius: 20,
          padding: 'clamp(24px, 4vw, 44px)', overflowX: 'auto', marginBottom: 60
        }}>
          <h2 className="pv-serif-title" style={{ fontSize: 24, fontWeight: 800, color: fg, marginBottom: 20, textAlign: 'center' }}>
            Comprehensive Capability Matrix
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${bdr}`, textAlign: 'left' }}>
                <th style={{ padding: '14px 16px', color: fg2 }}>Enterprise Superpower</th>
                <th style={{ padding: '14px 16px', color: fg, textAlign: 'center' }}>Starter ERP</th>
                <th style={{
                  padding: '14px 16px',
                  color: '#38bdf8',
                  textAlign: 'center',
                  background: businessMode === 'standard' ? (dk ? 'rgba(56, 189, 248, 0.08)' : 'rgba(56, 189, 248, 0.06)') : 'transparent',
                  borderRadius: '8px 8px 0 0'
                }}>
                  Business ERP {businessMode === 'standard' && <span style={{ fontSize: 9.5, padding: '2px 6px', background: '#38bdf8', color: '#080e1a', borderRadius: 10, marginLeft: 4, fontWeight: 800 }}>ACTIVE</span>}
                </th>
                <th style={{
                  padding: '14px 16px',
                  color: '#818cf8',
                  textAlign: 'center',
                  background: businessMode === 'pro' ? (dk ? 'rgba(129, 140, 248, 0.08)' : 'rgba(129, 140, 248, 0.06)') : 'transparent',
                  borderRadius: '8px 8px 0 0'
                }}>
                  Business Pro ERP {businessMode === 'pro' && <span style={{ fontSize: 9.5, padding: '2px 6px', background: '#818cf8', color: '#ffffff', borderRadius: 10, marginLeft: 4, fontWeight: 800 }}>ACTIVE</span>}
                </th>
                <th style={{ padding: '14px 16px', color: acc, textAlign: 'center' }}>Textile Industry ERP</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'User Limits', t1: 'Up to 5 Users', t2: 'Quotation-Based', t3: 'Enterprise Team', t4: 'Min 5 (+₹2,000/mo)' },
                { name: 'Setup & Onboarding', t1: '₹5,000 (One-time)', t2: 'Quotation-Based', t3: 'Quotation-Based', t4: '₹1.5L (₹1L + ₹50k)' },
                { name: 'Double-Entry Accounting & Ledgers', t1: true, t2: true, t3: true, t4: true },
                { name: 'Multi-Godown Inventory & Stock Valuation', t1: true, t2: true, t3: true, t4: true },
                { name: '1-Click GST e-Invoice & e-Way Bill Direct API', t1: true, t2: true, t3: true, t4: true },
                { name: 'Multi-Level BOM & Dyeing Jobwork', t1: false, t2: false, t3: false, t4: true },
                { name: 'Grey Fabric Inward, Loom Issue & Piece Wages', t1: false, t2: false, t3: false, t4: true },
                { name: 'AI Automated Bank Reconciliation (BRS)', t1: false, t2: 'Basic', t3: true, t4: true },
                { name: 'WhatsApp Statement Dispatch & UPI Link Recovery', t1: 'Basic', t2: 'Automated', t3: 'Automated Priority', t4: 'Unlimited 24/7' },
                { name: 'AG Grid Multi-Column Reporting Studio', t1: false, t2: 'Standard', t3: true, t4: true },
                { name: 'Multi-Company Group Consolidation', t1: false, t2: false, t3: true, t4: true },
                { name: 'MCA Cryptographic Immutable Audit Trail', t1: false, t2: false, t3: true, t4: true },
                { name: 'Custom ERP Field Schema Configurator', t1: false, t2: true, t3: true, t4: true },
                { name: 'Dedicated Solution Architect & SLAs', t1: 'Standard Desk', t2: 'WhatsApp Desk', t3: 'Dedicated Architect', t4: '24/7 Mill Support' }
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${bdr}` }}>
                  <td style={{ padding: '13px 16px', fontWeight: 600, color: fg }}>{row.name}</td>
                  <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                    {typeof row.t1 === 'boolean' ? (row.t1 ? <Check size={16} color="#10b981" /> : <X size={16} color={fg2} style={{ opacity: 0.4 }} />) : <span style={{ color: fg2, fontWeight: 600 }}>{row.t1}</span>}
                  </td>
                  <td style={{ padding: '13px 16px', textAlign: 'center', background: dk ? 'rgba(56, 189, 248, 0.04)' : 'rgba(56, 189, 248, 0.03)' }}>
                    {typeof row.t2 === 'boolean' ? (row.t2 ? <Check size={16} color="#38bdf8" /> : <X size={16} color={fg2} style={{ opacity: 0.4 }} />) : <span style={{ color: '#38bdf8', fontWeight: 600 }}>{row.t2}</span>}
                  </td>
                  <td style={{ padding: '13px 16px', textAlign: 'center', background: dk ? 'rgba(129, 140, 248, 0.04)' : 'rgba(129, 140, 248, 0.03)' }}>
                    {typeof row.t3 === 'boolean' ? (row.t3 ? <Check size={16} color="#818cf8" /> : <X size={16} color={fg2} style={{ opacity: 0.4 }} />) : <span style={{ color: '#818cf8', fontWeight: 600 }}>{row.t3}</span>}
                  </td>
                  <td style={{ padding: '13px 16px', textAlign: 'center', background: dk ? 'rgba(232, 168, 56, 0.04)' : 'rgba(217, 119, 6, 0.03)' }}>
                    {typeof row.t4 === 'boolean' ? (row.t4 ? <Check size={16} color={acc} /> : <X size={16} color={fg2} style={{ opacity: 0.4 }} />) : <span style={{ color: acc, fontWeight: 700 }}>{row.t4}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA Banner */}
        <div style={{
          padding: '40px clamp(24px, 4vw, 48px)',
          borderRadius: 20,
          background: dk
            ? 'linear-gradient(135deg, rgba(232, 168, 56, 0.08) 0%, rgba(13, 23, 40, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, #ffffff 100%)',
          border: `1px solid ${bdr}`,
          textAlign: 'center'
        }}>
          <h3 className="pv-serif-title" style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800, color: fg, margin: '0 0 12px' }}>
            Need a tailored plan for your mill group?
          </h3>
          <p style={{ fontSize: 14.5, color: fg2, maxWidth: 640, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Speak directly with our solution architects. We configure your custom chart of accounts, godowns, jobwork programs, and custom print formats live during your demo session.
          </p>
          <a
            href="https://wa.me/918858141463?text=Hello%20CorpVEX%20Team%2C%20I%20want%20a%20custom%20demo%20tailored%20for%20my%20business."
            target="_blank"
            rel="noopener noreferrer"
            className="pv-pill-btn"
            style={{ fontSize: 15, padding: '14px 34px', background: acc, color: dk ? '#080e1a' : '#ffffff', border: 'none', boxShadow: `0 4px 18px ${acc}45`, textDecoration: 'none' }}
          >
            <span>Book a Custom Demo</span>
            <ArrowRight size={17} />
          </a>
        </div>
      </main>

      {/* Enterprise Footer */}
      <footer style={{
        borderTop: `1px solid ${bdr}`,
        padding: '36px clamp(16px, 4vw, 64px) 24px',
        background: dk ? '#040609' : '#f1f5f9',
        fontSize: 12.5, color: fg2, position: 'relative', zIndex: 2
      }}>
        <div style={{ maxWidth: 1680, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 size={16} color={acc} />
            <span style={{ fontSize: 14, fontWeight: 900, color: fg }}>CORPVEX <span style={{ color: acc }}>ERP</span></span>
            <span style={{ fontSize: 12, marginLeft: 12 }}>© 2026 Corpvex Cloud Technologies Pvt Ltd.</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span onClick={onNavigateHome} style={{ cursor: 'pointer' }}>Back to Home</span>
            <a href="https://wa.me/918858141463?text=Hello%20CorpVEX%20Team%2C%20I%20want%20to%20book%20a%20demo." target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer', color: acc, fontWeight: 700, textDecoration: 'none' }}>Book a Demo</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
