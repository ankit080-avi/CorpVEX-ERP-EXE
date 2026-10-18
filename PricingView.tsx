import React, { useState } from 'react';
import { LandingTopbar } from './common/LandingTopbar';
import {
  Sun, Moon, CheckCircle2, ArrowRight, ShieldCheck, Zap,
  Building2, Sparkles, X, Menu, Check, HelpCircle, PhoneCall
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
            Simple, honest pricing with zero hidden fees, zero surprise per-user charges, and guaranteed 100% Indian GST & statutory compliance.
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
                padding: '8px 22px', borderRadius: 50, border: 'none',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                background: billingCycle === 'annual' ? acc : 'transparent',
                color: billingCycle === 'annual' ? (dk ? '#080e1a' : '#ffffff') : fg2,
                transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <span>Annual Billing</span>
              <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 7px', borderRadius: 50, background: billingCycle === 'annual' ? (dk ? '#080e1a' : '#ffffff') : `${acc}20`, color: billingCycle === 'annual' ? acc : acc }}>
                SAVE 20%
              </span>
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: '8px 22px', borderRadius: 50, border: 'none',
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

        {/* 3 Pricing Tier Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginBottom: 70 }}>
          {/* Tier 1: Starter */}
          <div className="pv-price-card">
            <div>
              <div className="pv-mono-tag" style={{ fontSize: 11, fontWeight: 800, color: fg2, marginBottom: 8 }}>
                TIER 01 · STARTER MILL / TRADER
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: fg, margin: '0 0 8px' }}>
                Starter Suite
              </h3>
              <p style={{ fontSize: 13.5, color: fg2, lineHeight: 1.5, margin: '0 0 20px', minHeight: 40 }}>
                For single-location textile traders, weaving units, and small processing houses.
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 24, borderBottom: `1px solid ${bdr}`, paddingBottom: 20 }}>
                <span style={{ fontSize: 38, fontWeight: 900, color: fg, letterSpacing: '-0.03em' }}>
                  {billingCycle === 'annual' ? '₹2,499' : '₹2,999'}
                </span>
                <span style={{ fontSize: 13, color: fg2 }}>/ month</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
                {[
                  'Up to 5 Concurrent Users',
                  'Double-Entry Accounting & Ledger Master',
                  'Multi-Godown Stock & Inventory Valuation',
                  'Direct GST e-Invoicing & E-Way Bill',
                  'WhatsApp Statement & Invoice Dispatch',
                  'Standard Email & Chat Support'
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

          {/* Tier 2: Growth (Popular) */}
          <div className="pv-price-card popular">
            <div style={{
              position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
              background: acc, color: dk ? '#080e1a' : '#ffffff', fontSize: 11, fontWeight: 900,
              padding: '4px 14px', borderRadius: 50, letterSpacing: '0.1em', boxShadow: `0 4px 12px ${acc}40`
            }}>
              MOST POPULAR
            </div>

            <div>
              <div className="pv-mono-tag" style={{ fontSize: 11, fontWeight: 800, color: acc, marginBottom: 8 }}>
                TIER 02 · COMPLETE MANUFACTURING
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: fg, margin: '0 0 8px' }}>
                Growth Enterprise
              </h3>
              <p style={{ fontSize: 13.5, color: fg2, lineHeight: 1.5, margin: '0 0 20px', minHeight: 40 }}>
                For multi-mill processing units, garment manufacturers, and high-volume yarn traders.
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 24, borderBottom: `1px solid ${bdr}`, paddingBottom: 20 }}>
                <span style={{ fontSize: 38, fontWeight: 900, color: acc, letterSpacing: '-0.03em' }}>
                  {billingCycle === 'annual' ? '₹5,999' : '₹6,999'}
                </span>
                <span style={{ fontSize: 13, color: fg2 }}>/ month</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
                {[
                  'Up to 15 Concurrent Users',
                  'Everything in Starter Suite',
                  'Multi-Level BOM & Dyeing Jobwork Tracking',
                  'AI Automated Bank Reconciliation (BRS)',
                  'Dynamic WhatsApp UPI Collection Recovery',
                  'AG Grid Live Report Filtering & Custom Views',
                  '24/7 Priority WhatsApp & Dedicated Desk Support'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: fg, fontWeight: 500 }}>
                    <CheckCircle2 size={16} color={acc} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/918858141463?text=Hello%20CorpVEX%20Team%2C%20I%20want%20to%20book%20an%20Enterprise%20Demo%20for%20the%20Growth%20Enterprise%20Plan."
              target="_blank"
              rel="noopener noreferrer"
              className="pv-pill-btn"
              style={{ width: '100%', padding: '14px', background: acc, color: dk ? '#080e1a' : '#ffffff', border: 'none', boxShadow: `0 4px 18px ${acc}45`, textDecoration: 'none' }}
            >
              <span>Book an Enterprise Demo</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Tier 3: Conglomerate */}
          <div className="pv-price-card">
            <div>
              <div className="pv-mono-tag" style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8', marginBottom: 8 }}>
                TIER 03 · MULTI-COMPANY GROUP
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: fg, margin: '0 0 8px' }}>
                Conglomerate Suite
              </h3>
              <p style={{ fontSize: 13.5, color: fg2, lineHeight: 1.5, margin: '0 0 20px', minHeight: 40 }}>
                For multi-entity holding groups, composite textile mills, and large trading houses.
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 24, borderBottom: `1px solid ${bdr}`, paddingBottom: 20 }}>
                <span style={{ fontSize: 38, fontWeight: 900, color: fg, letterSpacing: '-0.03em' }}>
                  {billingCycle === 'annual' ? '₹14,999' : '₹17,999'}
                </span>
                <span style={{ fontSize: 13, color: fg2 }}>/ month</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
                {[
                  'Unlimited Multi-Branch & Multi-Unit Users',
                  'Everything in Growth Enterprise',
                  'Multi-Company Group Financial Consolidation',
                  'MCA-Compliant Immutable Audit Trail & Diffs',
                  'Custom Letterhead Print & Voucher Designer',
                  'Custom ERP Database Extension Schemas',
                  'Dedicated Solution Architect & On-Site Handholding'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: fg }}>
                    <CheckCircle2 size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/918858141463?text=Hello%20CorpVEX%20Team%2C%20I%20want%20details%20about%20the%20Conglomerate%20Suite%20multi-company%20plan."
              target="_blank"
              rel="noopener noreferrer"
              className="pv-pill-btn"
              style={{ width: '100%', padding: '13px', background: 'transparent', color: fg, border: `1px solid ${bdr}`, textDecoration: 'none' }}
            >
              Contact Enterprise Sales
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
                <th style={{ padding: '14px 16px', color: fg, textAlign: 'center' }}>Starter Suite</th>
                <th style={{ padding: '14px 16px', color: acc, textAlign: 'center' }}>Growth Enterprise</th>
                <th style={{ padding: '14px 16px', color: '#38bdf8', textAlign: 'center' }}>Conglomerate Suite</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Double-Entry Accounting & Ledgers', t1: true, t2: true, t3: true },
                { name: 'Multi-Godown Inventory & Stock Valuation', t1: true, t2: true, t3: true },
                { name: '1-Click GST e-Invoice & e-Way Bill Direct API', t1: true, t2: true, t3: true },
                { name: 'Multi-Level BOM & Dyeing Jobwork', t1: false, t2: true, t3: true },
                { name: 'AI Automated Bank Reconciliation (BRS)', t1: false, t2: true, t3: true },
                { name: 'WhatsApp Statement Dispatch & UPI Link Recovery', t1: 'Basic', t2: 'Automated', t3: 'Unlimited 24/7' },
                { name: 'AG Grid Multi-Column Reporting Studio', t1: false, t2: true, t3: true },
                { name: 'Multi-Company Group Consolidation', t1: false, t2: false, t3: true },
                { name: 'MCA Cryptographic Immutable Audit Trail', t1: false, t2: false, t3: true },
                { name: 'Custom ERP Field Schema Configurator', t1: false, t2: true, t3: true },
                { name: 'Dedicated Solution Architect & SLAs', t1: false, t2: 'WhatsApp Desk', t3: 'Dedicated Architect' }
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${bdr}` }}>
                  <td style={{ padding: '13px 16px', fontWeight: 600, color: fg }}>{row.name}</td>
                  <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                    {typeof row.t1 === 'boolean' ? (row.t1 ? <Check size={16} color="#10b981" /> : <X size={16} color={fg2} style={{ opacity: 0.4 }} />) : <span style={{ color: fg2, fontWeight: 600 }}>{row.t1}</span>}
                  </td>
                  <td style={{ padding: '13px 16px', textAlign: 'center', background: dk ? 'rgba(232, 168, 56, 0.04)' : 'rgba(217, 119, 6, 0.03)' }}>
                    {typeof row.t2 === 'boolean' ? (row.t2 ? <Check size={16} color={acc} /> : <X size={16} color={fg2} style={{ opacity: 0.4 }} />) : <span style={{ color: acc, fontWeight: 700 }}>{row.t2}</span>}
                  </td>
                  <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                    {typeof row.t3 === 'boolean' ? (row.t3 ? <Check size={16} color="#38bdf8" /> : <X size={16} color={fg2} style={{ opacity: 0.4 }} />) : <span style={{ color: '#38bdf8', fontWeight: 700 }}>{row.t3}</span>}
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
