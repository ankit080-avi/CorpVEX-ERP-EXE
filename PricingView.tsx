import React, { useState } from 'react';
import { LandingTopbar } from './common/LandingTopbar';
import {
  CheckCircle2, ArrowRight, Building2, Check, X, Clock
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

        .pv-pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
          margin-bottom: 70px;
          align-items: stretch;
        }
        @media(max-width: 1240px) {
          .pv-pricing-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }
        @media(max-width: 680px) {
          .pv-pricing-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        .pv-price-card {
          position: relative;
          background: ${bg2};
          border: 1px solid ${bdr};
          border-radius: 20px;
          padding: 34px 24px;
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

        .pv-mini-tab {
          padding: 3px 8px;
          border-radius: 4px;
          border: none;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .pv-matrix-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
        }
        .pv-matrix-table th, .pv-matrix-table td {
          padding: 13px 16px;
        }
        .pv-matrix-category {
          background: ${dk ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
          font-weight: 800;
          font-size: 11.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
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

      {/* Top Header Navbar */}
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
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="pv-mono-tag" style={{ fontSize: 11.5, fontWeight: 800, color: acc, letterSpacing: '0.18em', marginBottom: 12 }}>
            TRANSPARENT ENTERPRISE PRICING
          </div>
          <h1 className="pv-serif-title" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16, color: fg }}>
            Predictable Investment. <span style={{ color: acc, fontStyle: 'italic' }}>Massive Returns.</span>
          </h1>
          <p style={{ fontSize: 'clamp(14.5px, 1.8vw, 17px)', color: fg2, maxWidth: 760, margin: '0 auto 30px', lineHeight: 1.65 }}>
            Simple, honest pricing with statutory compliance, clear one-time onboarding charges, and dedicated industrial tiers engineered from retail counters up to composite mills.
          </p>

          {/* Billing Cycle Switcher (Restyled to match original dark design) */}
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

        {/* ══════════════════════════════════════════════════════════════════
            4 Balanced Pricing Tier Cards
        ══════════════════════════════════════════════════════════════════ */}
        <div className="pv-pricing-grid">
          {/* ───────────────────────────────────────────────────────────────
              Card 1: Starter ERP
          ─────────────────────────────────────────────────────────────── */}
          <div className="pv-price-card">
            <div>
              <div className="pv-mono-tag" style={{ fontSize: 10.5, fontWeight: 800, color: fg2, marginBottom: 8 }}>
                TIER 01 · APPROVED ENTRY
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: fg, margin: '0 0 8px' }}>
                Starter ERP
              </h3>
              <p style={{ fontSize: 13, color: fg2, lineHeight: 1.5, margin: '0 0 18px', minHeight: 40 }}>
                For single-location textile traders, retail counters, and small wholesale businesses.
              </p>

              {/* Price Block */}
              <div style={{ marginBottom: 20, borderBottom: `1px solid ${bdr}`, paddingBottom: 18, minHeight: 88 }}>
                {billingCycle === 'annual' ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 36, fontWeight: 900, color: fg, letterSpacing: '-0.03em' }}>
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
                      <span style={{ fontSize: 36, fontWeight: 900, color: fg, letterSpacing: '-0.03em' }}>
                        {starterUserMode === 'single' ? '₹500' : '₹799'}
                      </span>
                      <span style={{ fontSize: 13, color: fg2 }}>/ month</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                      <button
                        onClick={() => setStarterUserMode('single')}
                        className="pv-mini-tab"
                        style={{
                          background: starterUserMode === 'single' ? (dk ? 'rgba(255,255,255,0.18)' : '#e2e8f0') : 'transparent',
                          color: fg
                        }}
                      >
                        1 User: ₹500/mo
                      </button>
                      <button
                        onClick={() => setStarterUserMode('dual')}
                        className="pv-mini-tab"
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

              {/* Setup Charge & Capacity Badge */}
              <div style={{ fontSize: 11.5, color: fg2, marginBottom: 20 }}>
                <span style={{ color: fg, fontWeight: 600 }}>One-Time Onboarding:</span> ₹5,000 guided setup
              </div>

              {/* Concise Feature List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28 }}>
                {[
                  billingCycle === 'annual' ? 'Up to 5 Users Included' : (starterUserMode === 'single' ? '1 User Included' : '2 Users Included'),
                  '1 Company · Single Branch / Counter',
                  'Double-Entry Accounting & Ledger Master',
                  'Multi-Godown Stock & Inventory Valuation',
                  'GST Invoice & E-Way Portal Data Export',
                  'Daily Automated Local Database Backup'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12.5, color: fg }}>
                    <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
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
              <span>Start 14-Day Free Trial</span>
              <ArrowRight size={15} />
            </a>
          </div>

          {/* ───────────────────────────────────────────────────────────────
              Card 2: Business ERP
          ─────────────────────────────────────────────────────────────── */}
          <div className="pv-price-card">
            <div>
              <div className="pv-mono-tag" style={{ fontSize: 10.5, fontWeight: 800, color: '#38bdf8', marginBottom: 8 }}>
                TIER 02 · WHOLESALE & DISTRIBUTION
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: fg, margin: '0 0 8px' }}>
                Business ERP
              </h3>
              <p style={{ fontSize: 13, color: fg2, lineHeight: 1.5, margin: '0 0 18px', minHeight: 40 }}>
                For expanding wholesale distribution, trading firms, and multi-counter sales operations.
              </p>

              {/* Price Block */}
              <div style={{ marginBottom: 20, borderBottom: `1px solid ${bdr}`, paddingBottom: 18, minHeight: 88 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: '#38bdf8', letterSpacing: '-0.02em' }}>
                    Custom Quote
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: fg2, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} color="#38bdf8" />
                  <span>Quotation-Based · Pricing Under Review</span>
                </div>
              </div>

              {/* Setup Charge & Capacity Badge */}
              <div style={{ fontSize: 11.5, color: fg2, marginBottom: 20 }}>
                <span style={{ color: fg, fontWeight: 600 }}>One-Time Onboarding:</span> Custom quotation-based
              </div>

              {/* Concise Feature List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28 }}>
                {[
                  'Scalable User Packages on Quotation',
                  'Up to 3 Companies · Multi-Counter Support',
                  '1-Click Direct GST e-Invoice & e-Way Bill API',
                  'Automated WhatsApp PDF Invoice Dispatch',
                  '100% Watermark-Free Document Printing',
                  'Automated Daily Encrypted Cloud Backup'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12.5, color: fg }}>
                    <CheckCircle2 size={15} color="#38bdf8" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/918858141463?text=Hello%20CorpVEX%20Team%2C%20I%20want%20to%20request%20a%20quotation%20for%20the%20Business%20ERP%20plan."
              target="_blank"
              rel="noopener noreferrer"
              className="pv-pill-btn"
              style={{ width: '100%', padding: '13px', background: 'transparent', color: fg, border: `1px solid ${bdr}`, textDecoration: 'none' }}
            >
              <span>Request Business Quote</span>
              <ArrowRight size={15} />
            </a>
          </div>

          {/* ───────────────────────────────────────────────────────────────
              Card 3: Business Pro ERP
          ─────────────────────────────────────────────────────────────── */}
          <div className="pv-price-card">
            <div>
              <div className="pv-mono-tag" style={{ fontSize: 10.5, fontWeight: 800, color: '#818cf8', marginBottom: 8 }}>
                TIER 03 · ADVANCED OPERATIONS
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: fg, margin: '0 0 8px' }}>
                Business Pro ERP
              </h3>
              <p style={{ fontSize: 13, color: fg2, lineHeight: 1.5, margin: '0 0 18px', minHeight: 40 }}>
                For multi-branch enterprises requiring central sync, visual reporting, and deep audit trails.
              </p>

              {/* Price Block */}
              <div style={{ marginBottom: 20, borderBottom: `1px solid ${bdr}`, paddingBottom: 18, minHeight: 88 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: '#818cf8', letterSpacing: '-0.02em' }}>
                    Custom Quote
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: fg2, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} color="#818cf8" />
                  <span>Quotation-Based · Enterprise Licensing</span>
                </div>
              </div>

              {/* Setup Charge & Capacity Badge */}
              <div style={{ fontSize: 11.5, color: fg2, marginBottom: 20 }}>
                <span style={{ color: fg, fontWeight: 600 }}>One-Time Onboarding:</span> Custom enterprise setup
              </div>

              {/* Concise Feature List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28 }}>
                {[
                  'Enterprise Multi-User Team Licensing',
                  'Multi-Company Group · Multi-Branch Sync',
                  'Drag-and-Drop Visual Report Designer',
                  'MCA-Compliant Immutable Audit Trail',
                  'Telegram & WhatsApp Operational Alerts',
                  'Continuous Multi-Cloud Database Replication'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12.5, color: fg }}>
                    <CheckCircle2 size={15} color="#818cf8" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/918858141463?text=Hello%20CorpVEX%20Team%2C%20I%20want%20to%20request%20a%20quotation%20for%20the%20Business%20Pro%20ERP%20plan."
              target="_blank"
              rel="noopener noreferrer"
              className="pv-pill-btn"
              style={{ width: '100%', padding: '13px', background: 'transparent', color: fg, border: `1px solid ${bdr}`, textDecoration: 'none' }}
            >
              <span>Request Business Pro Quote</span>
              <ArrowRight size={15} />
            </a>
          </div>

          {/* ───────────────────────────────────────────────────────────────
              Card 4: Textile Industry ERP (Highlighted .popular)
          ─────────────────────────────────────────────────────────────── */}
          <div className="pv-price-card popular">
            <div style={{
              position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
              background: acc, color: dk ? '#080e1a' : '#ffffff', fontSize: 10.5, fontWeight: 900,
              padding: '3px 14px', borderRadius: 50, letterSpacing: '0.12em', boxShadow: `0 4px 14px ${acc}40`,
              whiteSpace: 'nowrap'
            }}>
              APPROVED TEXTILE PRICING
            </div>

            <div>
              <div className="pv-mono-tag" style={{ fontSize: 10.5, fontWeight: 800, color: acc, marginBottom: 8 }}>
                TIER 04 · SPECIALIZED TEXTILE SUITE
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: fg, margin: '0 0 8px' }}>
                Textile Industry ERP
              </h3>
              <p style={{ fontSize: 13, color: fg2, lineHeight: 1.5, margin: '0 0 18px', minHeight: 40 }}>
                Specialized ERP suite for composite mills, weaving units, dyeing/printing, and garment exporters.
              </p>

              {/* Price Block */}
              <div style={{ marginBottom: 20, borderBottom: `1px solid ${bdr}`, paddingBottom: 18, minHeight: 88 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: acc, letterSpacing: '-0.03em' }}>
                    {billingCycle === 'annual' ? '₹99,999' : '₹15,000'}
                  </span>
                  <span style={{ fontSize: 13, color: fg2 }}>{billingCycle === 'annual' ? '/ year' : '/ month'}</span>
                </div>
                <div style={{ fontSize: 11.5, color: acc, marginTop: 4, fontWeight: 600 }}>
                  {billingCycle === 'annual'
                    ? 'Subject to defined user limits · ₹2,000/mo per extra user'
                    : 'For min 5 users · ₹2,000/mo per additional user'}
                </div>
              </div>

              {/* Setup Charge & Capacity Badge */}
              <div style={{ fontSize: 11.5, color: fg2, marginBottom: 20 }}>
                <span style={{ color: fg, fontWeight: 600 }}>One-Time Onboarding:</span> ₹1,00,000 install + ₹50,000 e-way setup
              </div>

              {/* Concise Feature List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28 }}>
                {[
                  'Minimum 5 Users Included (+₹2,000/mo per extra user)',
                  'Grey Fabric Inward, Loom Issue & Finish Receipt',
                  'Multi-Level BOM & Dyeing/Printing Jobwork',
                  'Challan Tracking, Bale/Lot & Piece-Rate Wages',
                  'Dedicated High-Speed Direct NIC E-Way API Gateway',
                  'On-Site Textile Implementation & 24/7 Mill SLA'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12.5, color: fg }}>
                    <CheckCircle2 size={15} color={acc} style={{ flexShrink: 0, marginTop: 2 }} />
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
              style={{ width: '100%', padding: '13px', background: acc, color: dk ? '#080e1a' : '#ffffff', border: 'none', boxShadow: `0 4px 18px ${acc}45`, textDecoration: 'none' }}
            >
              <span>Book Textile ERP Demo</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            Compact Capability Comparison Table (Dark Navy Premium Theme)
        ══════════════════════════════════════════════════════════════════ */}
        <div style={{
          background: bg2, border: `1px solid ${bdr}`, borderRadius: 20,
          padding: 'clamp(24px, 4vw, 44px)', overflowX: 'auto', marginBottom: 60,
          boxShadow: dk ? '0 20px 50px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.03)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 className="pv-serif-title" style={{ fontSize: 26, fontWeight: 800, color: fg, margin: '0 0 8px' }}>
              Comprehensive Capability Matrix
            </h2>
            <p style={{ fontSize: 13.5, color: fg2, maxWidth: 760, margin: '0 auto' }}>
              Detailed breakdown of user capacities, statutory automation, and support scopes across all four tiers.
            </p>
          </div>

          <table className="pv-matrix-table">
            <thead>
              <tr style={{ borderBottom: `2px solid ${bdr}`, textAlign: 'left' }}>
                <th style={{ color: fg2, minWidth: 230 }}>Platform Dimension</th>
                <th style={{ color: fg, textAlign: 'center', minWidth: 140 }}>Starter ERP</th>
                <th style={{ color: '#38bdf8', textAlign: 'center', minWidth: 150 }}>Business ERP</th>
                <th style={{ color: '#818cf8', textAlign: 'center', minWidth: 160 }}>Business Pro ERP</th>
                <th style={{ color: acc, textAlign: 'center', minWidth: 170 }}>Textile Industry ERP</th>
              </tr>
            </thead>
            <tbody>
              {/* Category: Subscription & Onboarding */}
              <tr>
                <td colSpan={5} className="pv-matrix-category" style={{ color: acc }}>
                  Subscription & Onboarding Charges
                </td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Subscription Price</td>
                <td style={{ textAlign: 'center', color: fg2 }}>{billingCycle === 'annual' ? '₹5,999 / yr' : (starterUserMode === 'single' ? '₹500 / mo' : '₹799 / mo')}</td>
                <td style={{ textAlign: 'center', color: '#38bdf8', fontWeight: 600 }}>Quotation-Based</td>
                <td style={{ textAlign: 'center', color: '#818cf8', fontWeight: 600 }}>Quotation-Based</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>{billingCycle === 'annual' ? '₹99,999 / yr' : '₹15,000 / mo'}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>One-Time Installation Fee</td>
                <td style={{ textAlign: 'center', color: fg2 }}>₹5,000</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Quotation-Based</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Quotation-Based</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>₹1,00,000</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Dedicated E-Way Bill Setup</td>
                <td style={{ textAlign: 'center', color: fg2 }}>Optional Add-On</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Included in Quote</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Included in Quote</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>₹50,000 (Dedicated API)</td>
              </tr>

              {/* Category: Capacity & Platform Access */}
              <tr>
                <td colSpan={5} className="pv-matrix-category" style={{ color: '#38bdf8' }}>
                  Capacity & Access Architecture
                </td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Number of Users</td>
                <td style={{ textAlign: 'center', color: fg2 }}>1, 2, or Up to 5 (Annual)</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Scalable on Quote</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Enterprise Team</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Min 5 (+₹2,000/mo/user)</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Number of Companies</td>
                <td style={{ textAlign: 'center', color: fg2 }}>1 Company</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Up to 3 Companies</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Multi-Company Group</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Mill Group & Concerns</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Number of Branches / Locations</td>
                <td style={{ textAlign: 'center', color: fg2 }}>1 Single Location</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Up to 3 Counters</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Multi-Branch Central Sync</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Multi-Mill & Godowns</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Desktop, Web & Mobile Access</td>
                <td style={{ textAlign: 'center', color: fg2 }}>Desktop + Web Browser</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Desktop + Web + Mobile Web</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Desktop + Web + Mobile PWA</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Desktop + Web + Scanner</td>
              </tr>

              {/* Category: Reporting & Document Customization */}
              <tr>
                <td colSpan={5} className="pv-matrix-category" style={{ color: '#818cf8' }}>
                  Reporting & Document Customization
                </td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Standard vs Customised Reports</td>
                <td style={{ textAlign: 'center', color: fg2 }}>Standard Ledgers & GST</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Standard + Letterhead Custom</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Drag-and-Drop Visual Designer</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Full Textile + Visual Designer</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Report Watermark Status</td>
                <td style={{ textAlign: 'center', color: fg2 }}>CorpVEX Watermark on prints</td>
                <td style={{ textAlign: 'center', color: '#38bdf8', fontWeight: 600 }}>100% Watermark-Free</td>
                <td style={{ textAlign: 'center', color: '#818cf8', fontWeight: 600 }}>100% Watermark-Free</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>100% Watermark-Free</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Scheduled Reporting</td>
                <td style={{ textAlign: 'center', color: fg2 }}><X size={15} color={fg2} style={{ opacity: 0.3 }} /></td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Weekly / Monthly Digests</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Daily Executive Briefing</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Shift Digests & Loom Logs</td>
              </tr>

              {/* Category: Integrations & Compliance */}
              <tr>
                <td colSpan={5} className="pv-matrix-category" style={{ color: '#10b981' }}>
                  Integrations, Backups & Support
                </td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Email Integration</td>
                <td style={{ textAlign: 'center', color: fg2 }}>Manual PDF Export</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Automated Statement Dispatch</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Automated SMTP Dispatch</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Batch Mill Dispatch & Statements</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>WhatsApp Integration</td>
                <td style={{ textAlign: 'center', color: fg2 }}>Manual Share</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Automated PDF Invoices</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>WhatsApp Business API</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Automated Dispatch + Payment Links</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Telegram Bot Integration</td>
                <td style={{ textAlign: 'center', color: fg2 }}><X size={15} color={fg2} style={{ opacity: 0.3 }} /></td>
                <td style={{ textAlign: 'center', color: fg2 }}>Optional Add-On</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Management Alert Bots</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Floor, Loom & Jobwork Alerts</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>E-Way Bill & E-Invoice Integration</td>
                <td style={{ textAlign: 'center', color: fg2 }}>Portal CSV / JSON Export</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>1-Click Direct GST API</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>High-Throughput Direct API</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Dedicated Direct NIC Gateway</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Automatic Backups</td>
                <td style={{ textAlign: 'center', color: fg2 }}>Daily Local Backup</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Automated Daily Cloud Backup</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Continuous Cloud Replication</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Air-Gapped Multi-Location Replication</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Implementation & Support</td>
                <td style={{ textAlign: 'center', color: fg2 }}>Remote Setup · Email Support</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Guided Onboarding · Priority Desk</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Architect Cut-over · Fast SLA</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>On-Site Mill Setup · 24/7 SLA</td>
              </tr>
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
