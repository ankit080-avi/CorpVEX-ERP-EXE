import React, { useState } from 'react';
import { LandingTopbar } from './common/LandingTopbar';
import {
  CheckCircle2, ArrowRight, ShieldCheck, Zap,
  Building2, Sparkles, X, Check, HelpCircle, PhoneCall,
  Clock, AlertCircle, Wrench, Factory, Store, Briefcase,
  Monitor, Smartphone, Globe, Mail, Send, MessageSquare,
  FileText, Database, Cloud, RefreshCw, ChevronDown, ChevronUp
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mouseCoords, setMouseCoords] = useState({ x: -1000, y: -1000 });

  const dk = theme === 'dark';
  const bg = dk ? '#070e1b' : '#f8fafc';
  const bg2 = dk ? '#0d1728' : '#ffffff';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#475569';
  const acc = dk ? '#e8a838' : '#d97706';
  const bdr = dk ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

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
          gap: 20px;
          margin-bottom: 70px;
        }
        @media(max-width: 1360px) {
          .pv-pricing-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }
        @media(max-width: 768px) {
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
          padding: 30px 22px;
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
          font-family: inherit; font-size: 13px; font-weight: 700;
          cursor: pointer; transition: all .2s ease;
          border-radius: 8px;
        }

        .pv-matrix-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
        }
        .pv-matrix-table th, .pv-matrix-table td {
          padding: 13px 14px;
        }
        .pv-matrix-category {
          background: ${dk ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 0.08em;
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
        padding: 'clamp(36px, 5vh, 60px) clamp(16px, 3vw, 48px) 80px'
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div className="pv-mono-tag" style={{ fontSize: 11.5, fontWeight: 800, color: acc, letterSpacing: '0.18em', marginBottom: 12 }}>
            TRANSPARENT ENTERPRISE PRICING & EDITIONS
          </div>
          <h1 className="pv-serif-title" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16, color: fg }}>
            Predictable Investment. <span style={{ color: acc, fontStyle: 'italic' }}>Massive Return on Assets.</span>
          </h1>
          <p style={{ fontSize: 'clamp(14.5px, 1.8vw, 17px)', color: fg2, maxWidth: 780, margin: '0 auto 30px', lineHeight: 1.65 }}>
            Simple, honest pricing with statutory compliance, clear one-time onboarding charges, and dedicated industrial tiers engineered for small counters up to composite textile mills.
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
                BEST VALUE
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

        {/* ══════════════════════════════════════════════════════════════════
            4 Pricing Tier Cards
        ══════════════════════════════════════════════════════════════════ */}
        <div className="pv-pricing-grid">
          {/* ───────────────────────────────────────────────────────────────
              Card 1: Starter ERP (Approved Small-Business Pricing)
          ─────────────────────────────────────────────────────────────── */}
          <div className="pv-price-card">
            <div>
              <div className="pv-mono-tag" style={{ fontSize: 10.5, fontWeight: 800, color: fg2, marginBottom: 8 }}>
                TIER 01 · APPROVED ENTRY TIER
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: fg, margin: '0 0 6px' }}>
                Starter ERP
              </h3>
              <p style={{ fontSize: 12.5, color: fg2, lineHeight: 1.5, margin: '0 0 14px', minHeight: 38 }}>
                Essential double-entry accounting and billing for single-location traders, retail counters, and small wholesale businesses.
              </p>

              {/* Price Display */}
              <div style={{ marginBottom: 16, borderBottom: `1px solid ${bdr}`, paddingBottom: 16 }}>
                {billingCycle === 'annual' ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 32, fontWeight: 900, color: fg, letterSpacing: '-0.03em' }}>
                        ₹5,999
                      </span>
                      <span style={{ fontSize: 12, color: fg2 }}>/ year</span>
                    </div>
                    <div style={{ fontSize: 11, color: acc, marginTop: 4, fontWeight: 600 }}>
                      Includes up to 5 users · ~₹500/month equivalent
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <button
                        onClick={() => setStarterUserMode('single')}
                        style={{
                          padding: '4px 10px', borderRadius: 4, border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                          background: starterUserMode === 'single' ? (dk ? 'rgba(255,255,255,0.15)' : '#e2e8f0') : 'transparent',
                          color: fg
                        }}
                      >
                        Single User
                      </button>
                      <button
                        onClick={() => setStarterUserMode('dual')}
                        style={{
                          padding: '4px 10px', borderRadius: 4, border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                          background: starterUserMode === 'dual' ? (dk ? 'rgba(255,255,255,0.15)' : '#e2e8f0') : 'transparent',
                          color: fg
                        }}
                      >
                        Dual User (2 Users)
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 32, fontWeight: 900, color: fg, letterSpacing: '-0.03em' }}>
                        {starterUserMode === 'single' ? '₹500' : '₹799'}
                      </span>
                      <span style={{ fontSize: 12, color: fg2 }}>/ month</span>
                    </div>
                    <div style={{ fontSize: 11, color: fg2, marginTop: 4 }}>
                      {starterUserMode === 'single' ? 'Billed monthly · 1 Concurrent User' : 'Billed monthly · 2 Concurrent Users'}
                    </div>
                  </div>
                )}
              </div>

              {/* Approved Setup & Capacity Scope */}
              <div style={{
                background: dk ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                border: `1px solid ${bdr}`, borderRadius: 10, padding: '10px 12px',
                marginBottom: 16, fontSize: 11.5, display: 'flex', flexDirection: 'column', gap: 5
              }}>
                <div style={{ color: fg }}>
                  <strong style={{ color: acc }}>Installation / Setup:</strong> ₹5,000 (One-time)
                </div>
                <div style={{ color: fg2 }}>
                  <strong style={{ color: fg }}>Capacity:</strong> {billingCycle === 'annual' ? 'Up to 5 Users' : (starterUserMode === 'single' ? '1 User' : '2 Users')} · 1 Company · 1 Location
                </div>
                <div style={{ color: fg2 }}>
                  <strong style={{ color: fg }}>Access:</strong> Windows Desktop + Web Browser
                </div>
                <div style={{ color: fg2 }}>
                  <strong style={{ color: fg }}>Report Prints:</strong> Standard (CorpVEX Watermark)
                </div>
              </div>

              {/* Feature List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                {[
                  'Double-Entry Accounting & Ledger Master',
                  'Multi-Godown Stock & Inventory Valuation',
                  'Standard Financial Ledgers & Daybook',
                  'GST Invoice & E-Way Portal Data Export',
                  'Email PDF Invoices & Manual WhatsApp Sharing',
                  'Daily Automated Local Database Backup',
                  '₹5,000 Remote Guided Installation & Setup',
                  'Standard Email & Ticket Support Desk'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: fg }}>
                    <CheckCircle2 size={14} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
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
              style={{ width: '100%', padding: '12px', background: 'transparent', color: fg, border: `1px solid ${bdr}`, textDecoration: 'none' }}
            >
              <span>Download Starter Edition</span>
              <ArrowRight size={14} />
            </a>
          </div>

          {/* ───────────────────────────────────────────────────────────────
              Card 2: Business ERP (Quotation-Based · Pricing Under Review)
          ─────────────────────────────────────────────────────────────── */}
          <div className="pv-price-card">
            <div>
              <div className="pv-mono-tag" style={{ fontSize: 10.5, fontWeight: 800, color: '#38bdf8', marginBottom: 8 }}>
                TIER 02 · WHOLESALE & DISTRIBUTION
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: fg, margin: '0 0 6px' }}>
                Business ERP
              </h3>
              <p style={{ fontSize: 12.5, color: fg2, lineHeight: 1.5, margin: '0 0 14px', minHeight: 38 }}>
                For expanding wholesale distribution, multi-counter stores, and trading firms requiring automated WhatsApp dispatch and direct GST APIs.
              </p>

              {/* Price Placeholder */}
              <div style={{ marginBottom: 16, borderBottom: `1px solid ${bdr}`, paddingBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: '#38bdf8', letterSpacing: '-0.02em' }}>
                    Custom Quote
                  </span>
                  <span style={{
                    fontSize: 9.5, fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                    background: dk ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.1)',
                    color: '#38bdf8'
                  }}>
                    ON REQUEST
                  </span>
                </div>
                <div style={{ fontSize: 11, color: fg2, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} color="#38bdf8" />
                  <span>Quotation-Based · Pricing Under Review</span>
                </div>
              </div>

              {/* Setup & Capacity Scope */}
              <div style={{
                background: dk ? 'rgba(56, 189, 248, 0.04)' : '#f0f9ff',
                border: `1px solid ${dk ? 'rgba(56, 189, 248, 0.2)' : 'rgba(56, 189, 248, 0.3)'}`,
                borderRadius: 10, padding: '10px 12px',
                marginBottom: 16, fontSize: 11.5, display: 'flex', flexDirection: 'column', gap: 5
              }}>
                <div style={{ color: fg }}>
                  <strong style={{ color: '#38bdf8' }}>Installation / Setup:</strong> Quotation-Based Scope
                </div>
                <div style={{ color: fg2 }}>
                  <strong style={{ color: fg }}>Capacity:</strong> Scalable Users · Up to 3 Companies · Up to 3 Counters
                </div>
                <div style={{ color: fg2 }}>
                  <strong style={{ color: fg }}>Access:</strong> Desktop + Web + Mobile Web View
                </div>
                <div style={{ color: fg2 }}>
                  <strong style={{ color: fg }}>Report Prints:</strong> 100% Watermark-Free (Custom Layouts)
                </div>
              </div>

              {/* Feature List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                {[
                  'Everything in Starter ERP +',
                  'Multi-Counter POS & Wholesale Dispatch',
                  '1-Click Direct GST e-Invoice & e-Way Bill API',
                  'Automated WhatsApp PDF Invoices & Payment Links',
                  'Weekly/Monthly Scheduled Summary Reports',
                  '100% Watermark-Free Branded Document Printing',
                  'Automated Daily Encrypted Cloud Database Backup',
                  'Guided Migration & Priority Support Desk'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: fg }}>
                    <CheckCircle2 size={14} color="#38bdf8" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/918858141463?text=Hello%20CorpVEX%20Team%2C%20I%20would%20like%20to%20request%20a%20quotation%20for%20the%20Business%20ERP%20edition."
              target="_blank"
              rel="noopener noreferrer"
              className="pv-pill-btn"
              style={{ width: '100%', padding: '12px', background: 'transparent', color: fg, border: `1px solid ${bdr}`, textDecoration: 'none' }}
            >
              <span>Request Business Quote</span>
              <ArrowRight size={14} />
            </a>
          </div>

          {/* ───────────────────────────────────────────────────────────────
              Card 3: Business Pro ERP (Quotation-Based · Pricing Under Review)
          ─────────────────────────────────────────────────────────────── */}
          <div className="pv-price-card">
            <div>
              <div className="pv-mono-tag" style={{ fontSize: 10.5, fontWeight: 800, color: '#818cf8', marginBottom: 8 }}>
                TIER 03 · ADVANCED OPERATIONS
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: fg, margin: '0 0 6px' }}>
                Business Pro ERP
              </h3>
              <p style={{ fontSize: 12.5, color: fg2, lineHeight: 1.5, margin: '0 0 14px', minHeight: 38 }}>
                For multi-branch trading conglomerates, commercial hubs, and high-volume operations requiring live sync and visual reporting.
              </p>

              {/* Price Placeholder */}
              <div style={{ marginBottom: 16, borderBottom: `1px solid ${bdr}`, paddingBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: '#818cf8', letterSpacing: '-0.02em' }}>
                    Custom Quote
                  </span>
                  <span style={{
                    fontSize: 9.5, fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                    background: dk ? 'rgba(129, 140, 248, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                    color: '#818cf8'
                  }}>
                    ENTERPRISE
                  </span>
                </div>
                <div style={{ fontSize: 11, color: fg2, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} color="#818cf8" />
                  <span>Quotation-Based · Pricing Under Review</span>
                </div>
              </div>

              {/* Setup & Capacity Scope */}
              <div style={{
                background: dk ? 'rgba(129, 140, 248, 0.04)' : '#eef2ff',
                border: `1px solid ${dk ? 'rgba(129, 140, 248, 0.2)' : 'rgba(129, 140, 248, 0.3)'}`,
                borderRadius: 10, padding: '10px 12px',
                marginBottom: 16, fontSize: 11.5, display: 'flex', flexDirection: 'column', gap: 5
              }}>
                <div style={{ color: fg }}>
                  <strong style={{ color: '#818cf8' }}>Installation / Setup:</strong> Quotation-Based Scope
                </div>
                <div style={{ color: fg2 }}>
                  <strong style={{ color: fg }}>Capacity:</strong> Enterprise Team · Multi-Company · Multi-Branch Sync
                </div>
                <div style={{ color: fg2 }}>
                  <strong style={{ color: fg }}>Access:</strong> Desktop + Dedicated Cloud Web + Mobile PWA
                </div>
                <div style={{ color: fg2 }}>
                  <strong style={{ color: fg }}>Report Prints:</strong> Drag-and-Drop Visual Designer (Watermark-Free)
                </div>
              </div>

              {/* Feature List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                {[
                  'Everything in Business ERP +',
                  'Multi-Branch Real-Time Data Synchronization',
                  'Visual Report Designer (Drag-and-Drop Custom Reports)',
                  'AI Automated Bank Statement Reconciliation (BRS)',
                  'Telegram Instant Operational Alerts & Dispatch Bots',
                  'Daily Scheduled Executive Briefing & Overdue Alerts',
                  'Continuous Multi-Cloud Encrypted Database Replication',
                  'Dedicated Solution Architect & Fast SLA Guarantee'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: fg }}>
                    <CheckCircle2 size={14} color="#818cf8" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/918858141463?text=Hello%20CorpVEX%20Team%2C%20I%20would%20like%20to%20request%20a%20quotation%20for%20the%20Business%20Pro%20ERP%20edition."
              target="_blank"
              rel="noopener noreferrer"
              className="pv-pill-btn"
              style={{ width: '100%', padding: '12px', background: 'transparent', color: fg, border: `1px solid ${bdr}`, textDecoration: 'none' }}
            >
              <span>Request Business Pro Quote</span>
              <ArrowRight size={14} />
            </a>
          </div>

          {/* ───────────────────────────────────────────────────────────────
              Card 4: Textile Industry ERP (Approved Textile Pricing)
          ─────────────────────────────────────────────────────────────── */}
          <div className="pv-price-card popular">
            <div style={{
              position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
              background: acc, color: dk ? '#080e1a' : '#ffffff', fontSize: 10.5, fontWeight: 900,
              padding: '3px 12px', borderRadius: 50, letterSpacing: '0.1em', boxShadow: `0 4px 12px ${acc}40`,
              whiteSpace: 'nowrap'
            }}>
              APPROVED TEXTILE PRICING
            </div>

            <div>
              <div className="pv-mono-tag" style={{ fontSize: 10.5, fontWeight: 800, color: acc, marginBottom: 8 }}>
                TIER 04 · SPECIALIZED TEXTILE SUITE
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: fg, margin: '0 0 6px' }}>
                Textile Industry ERP
              </h3>
              <p style={{ fontSize: 12.5, color: fg2, lineHeight: 1.5, margin: '0 0 14px', minHeight: 38 }}>
                Comprehensive ERP engine for composite mills, weaving units, dyeing/printing jobwork houses, and garment manufacturers.
              </p>

              {/* Price Display */}
              <div style={{ marginBottom: 16, borderBottom: `1px solid ${bdr}`, paddingBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: acc, letterSpacing: '-0.03em' }}>
                    {billingCycle === 'annual' ? '₹99,999' : '₹15,000'}
                  </span>
                  <span style={{ fontSize: 12, color: fg2 }}>{billingCycle === 'annual' ? '/ year' : '/ month'}</span>
                </div>
                <div style={{ fontSize: 11, color: acc, marginTop: 4, fontWeight: 600 }}>
                  {billingCycle === 'annual'
                    ? 'Subject to defined user limits · ₹2,000/mo per additional user'
                    : 'For minimum 5 users · ₹2,000/mo for each additional user'}
                </div>
              </div>

              {/* Approved Setup & Capacity Scope */}
              <div style={{
                background: dk ? 'rgba(232, 168, 56, 0.08)' : 'rgba(217, 119, 6, 0.06)',
                border: `1px solid ${acc}40`, borderRadius: 10, padding: '10px 12px',
                marginBottom: 16, fontSize: 11.5, display: 'flex', flexDirection: 'column', gap: 5
              }}>
                <div style={{ color: fg }}>
                  <strong style={{ color: acc }}>Installation / Setup:</strong> ₹1,00,000 installation + ₹50,000 e-way setup (₹1,50,000 total)
                </div>
                <div style={{ color: fg2 }}>
                  <strong style={{ color: fg }}>Capacity:</strong> Min 5 Users (+₹2k/user) · Mill Group Multi-Company · Multi-Mill/Godown
                </div>
                <div style={{ color: fg2 }}>
                  <strong style={{ color: fg }}>Access:</strong> High-Perf Desktop + Mill Web Cloud + Floor Mobile Scanner
                </div>
                <div style={{ color: fg2 }}>
                  <strong style={{ color: fg }}>Report Prints:</strong> Textile Production & Jobwork (Watermark-Free)
                </div>
              </div>

              {/* Feature List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                {[
                  'Minimum 5 Concurrent Users Included',
                  'Multi-Level Textile BOM & Dyeing/Printing Jobwork',
                  'Grey Fabric Inward, Loom Allocation & Finish Receipt',
                  'Challan Tracking, Bale/Lot Numbering & Piece Wages',
                  'Dedicated High-Speed NIC Direct E-Way & E-Invoice API',
                  'Automated WhatsApp, Email & Telegram Floor Dispatch',
                  'Shift Digests, Loom Efficiency Logs & Broker Aging',
                  'On-Site Textile ERP Consultant & 24/7 Priority SLA'
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: fg }}>
                    <CheckCircle2 size={14} color={acc} style={{ flexShrink: 0, marginTop: 2 }} />
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
            Comprehensive Capability Matrix (Plan Comparison Table)
        ══════════════════════════════════════════════════════════════════ */}
        <div style={{
          background: bg2, border: `1px solid ${bdr}`, borderRadius: 20,
          padding: 'clamp(24px, 4vw, 44px)', overflowX: 'auto', marginBottom: 60,
          boxShadow: dk ? '0 10px 40px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.03)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div className="pv-mono-tag" style={{ fontSize: 11, fontWeight: 800, color: acc, marginBottom: 6 }}>
              FEATURE-BY-FEATURE BENCHMARK
            </div>
            <h2 className="pv-serif-title" style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: fg, margin: '0 0 8px' }}>
              Detailed Plan Comparison
            </h2>
            <p style={{ fontSize: 13.5, color: fg2, maxWidth: 800, margin: '0 auto', lineHeight: 1.6 }}>
              A transparent, rigorous breakdown of user capacities, company bounds, device platforms, report customizations, integrations, and deployment SLAs across all four CorpVEX editions.
            </p>
          </div>

          <table className="pv-matrix-table">
            <thead>
              <tr style={{ borderBottom: `2px solid ${bdr}`, textAlign: 'left' }}>
                <th style={{ color: fg2, minWidth: 260 }}>Platform Dimension</th>
                <th style={{ color: fg, textAlign: 'center', minWidth: 160 }}>Starter ERP</th>
                <th style={{ color: '#38bdf8', textAlign: 'center', minWidth: 170 }}>Business ERP</th>
                <th style={{ color: '#818cf8', textAlign: 'center', minWidth: 180 }}>Business Pro ERP</th>
                <th style={{ color: acc, textAlign: 'center', minWidth: 190 }}>Textile Industry ERP</th>
              </tr>
            </thead>
            <tbody>
              {/* Category: Pricing & One-Time Charges */}
              <tr>
                <td colSpan={5} className="pv-matrix-category" style={{ color: acc }}>
                  1. Subscription & Setup Charges
                </td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Monthly Subscription</td>
                <td style={{ textAlign: 'center', color: fg2 }}>₹500 (1 User) / ₹799 (2 Users)</td>
                <td style={{ textAlign: 'center', color: '#38bdf8', fontWeight: 600 }}>Quotation-Based (TBA)</td>
                <td style={{ textAlign: 'center', color: '#818cf8', fontWeight: 600 }}>Quotation-Based (TBA)</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>₹15,000 / month (Min 5 Users)</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Annual Subscription</td>
                <td style={{ textAlign: 'center', color: fg2 }}>₹5,999 / year (Up to 5 Users)</td>
                <td style={{ textAlign: 'center', color: '#38bdf8', fontWeight: 600 }}>Quotation-Based (TBA)</td>
                <td style={{ textAlign: 'center', color: '#818cf8', fontWeight: 600 }}>Quotation-Based (TBA)</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>₹99,999 / year (Defined Limits)</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>One-Time Installation & Setup</td>
                <td style={{ textAlign: 'center', color: fg2 }}>₹5,000 (Guided Remote)</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Quotation-Based</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Quotation-Based</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>₹1,00,000 (Full Mill Setup)</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Dedicated E-Way Bill Setup</td>
                <td style={{ textAlign: 'center', color: fg2 }}>Optional Add-On</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Optional / Included in Quote</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Optional / Included in Quote</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>₹50,000 (Dedicated Direct API)</td>
              </tr>

              {/* Category: Capacity & Access */}
              <tr>
                <td colSpan={5} className="pv-matrix-category" style={{ color: '#38bdf8' }}>
                  2. User Capacity, Companies & Access
                </td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Number of Users</td>
                <td style={{ textAlign: 'center', color: fg2 }}>1, 2, or Up to 5 (Annual)</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Scalable (Quotation-Based)</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Enterprise Team (Quote)</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Min 5 Included (+₹2k/user)</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Additional User License</td>
                <td style={{ textAlign: 'center', color: fg2 }}>Upgrade to next tier</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>As per quotation</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>As per quotation</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>₹2,000 / user / month</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Number of Companies</td>
                <td style={{ textAlign: 'center', color: fg2 }}>1 Registered Company</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Up to 3 Companies</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Multi-Company Group</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Mill Group & Sister Concerns</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Number of Branches / Locations</td>
                <td style={{ textAlign: 'center', color: fg2 }}>1 Single Location</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Up to 3 Counters/Locations</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Multi-Branch Central Sync</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Multi-Mill & Godowns</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Desktop, Web & Mobile Access</td>
                <td style={{ textAlign: 'center', color: fg2 }}>Desktop + Web Browser</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Desktop + Web + Mobile Web</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Desktop + Web + Mobile PWA</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Desktop + Web + Mobile Scanner</td>
              </tr>

              {/* Category: Reports & Document Customization */}
              <tr>
                <td colSpan={5} className="pv-matrix-category" style={{ color: '#818cf8' }}>
                  3. Reports & Document Customization
                </td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Standard vs Customised Reports</td>
                <td style={{ textAlign: 'center', color: fg2 }}>Standard Ledgers & GST</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Standard + Letterhead Custom</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Drag-and-Drop Visual Designer</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Full Textile Reports + Visual Designer</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Report Watermark Status</td>
                <td style={{ textAlign: 'center', color: fg2 }}>CorpVEX Watermark on Prints</td>
                <td style={{ textAlign: 'center', color: '#38bdf8', fontWeight: 600 }}>100% Watermark-Free</td>
                <td style={{ textAlign: 'center', color: '#818cf8', fontWeight: 600 }}>100% Watermark-Free</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>100% Watermark-Free (Mill Branded)</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Scheduled Reporting</td>
                <td style={{ textAlign: 'center', color: fg2 }}><X size={15} color={fg2} style={{ opacity: 0.3 }} /></td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Weekly / Monthly Digests</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Daily Executive Briefing</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Shift Digests & Loom Logs</td>
              </tr>

              {/* Category: Integrations & Statutory Automation */}
              <tr>
                <td colSpan={5} className="pv-matrix-category" style={{ color: '#10b981' }}>
                  4. Integrations & Statutory Automation
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
                <td style={{ textAlign: 'center', color: fg2 }}>Manual Document Share</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Automated PDF Invoices</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>WhatsApp Business API</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Automated Dispatch + Payment Links</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Telegram Bot Integration</td>
                <td style={{ textAlign: 'center', color: fg2 }}><X size={15} color={fg2} style={{ opacity: 0.3 }} /></td>
                <td style={{ textAlign: 'center', color: fg2 }}>Optional Add-On</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Management Alert Bots</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Floor, Dispatch & Jobwork Alerts</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>E-Way Bill & E-Invoice Integration</td>
                <td style={{ textAlign: 'center', color: fg2 }}>Portal CSV / JSON Export</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>1-Click Direct GST API</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>High-Throughput Direct API</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Dedicated NIC High-Speed Gateway</td>
              </tr>

              {/* Category: Security, Backups & Support Scope */}
              <tr>
                <td colSpan={5} className="pv-matrix-category" style={{ color: fg }}>
                  5. Backups, Implementation & Support Scope
                </td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Automatic Backups</td>
                <td style={{ textAlign: 'center', color: fg2 }}>Daily Local Database Backup</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Automated Daily Cloud Backup</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Continuous Cloud Replication</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>Air-Gapped Multi-Mill Replication</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Implementation Scope</td>
                <td style={{ textAlign: 'center', color: fg2 }}>Remote Guided (₹5,000)</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Guided Onboarding (Quote)</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Architect Cut-over (Quote)</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>On-Site Mill Configuration (₹1.5L)</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                <td style={{ fontWeight: 600, color: fg }}>Support Channel & SLA</td>
                <td style={{ textAlign: 'center', color: fg2 }}>Standard Email & Ticket Desk</td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>Priority WhatsApp & Email</td>
                <td style={{ textAlign: 'center', color: '#818cf8' }}>Dedicated Solution Engineer</td>
                <td style={{ textAlign: 'center', color: acc, fontWeight: 700 }}>24/7 Priority Emergency Mill SLA</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            Add-On Modular Extensions (Inspired by Industry Best Practices)
        ══════════════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div className="pv-mono-tag" style={{ fontSize: 11, fontWeight: 800, color: acc, marginBottom: 6 }}>
              MODULAR SCALABILITY
            </div>
            <h2 className="pv-serif-title" style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: fg, margin: '0 0 8px' }}>
              Add-On Plans & Enterprise Enhancements
            </h2>
            <p style={{ fontSize: 13.5, color: fg2, maxWidth: 680, margin: '0 auto', lineHeight: 1.6 }}>
              Add extra team capacity, connect remote branches, or configure dedicated statutory gateways as your operations scale.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20
          }}>
            {[
              {
                title: 'Extra Team Members',
                price: '₹2,000',
                unit: '/ user / month',
                badge: 'USER SCALE',
                color: '#38bdf8',
                desc: 'Add additional concurrent user licenses to your existing deployment with real-time sync across all workstations.'
              },
              {
                title: 'Multi-Location Godown Sync',
                price: '₹4,999',
                unit: '/ location / year',
                badge: 'MULTI-BRANCH',
                color: '#818cf8',
                desc: 'Connect remote godowns, retail counters, or dispatch depots to your centralized CorpVEX database in real time.'
              },
              {
                title: 'Dedicated E-Way & E-Invoice Gateway',
                price: '₹50,000',
                unit: 'one-time setup',
                badge: 'NIC API GATEWAY',
                color: acc,
                desc: 'High-speed dedicated direct NIC integration for high-volume automated IRN generation and multi-vehicle e-way bills.'
              },
              {
                title: 'Custom Mill Stationary Engineering',
                price: 'Quotation',
                unit: 'on request',
                badge: 'BESPOKE DESIGN',
                color: '#10b981',
                desc: 'Customized print stationery, pre-printed continuous roll formats, and specialized barcode labels crafted by CorpVEX engineers.'
              }
            ].map((addon, i) => (
              <div key={i} style={{
                background: bg2, border: `1px solid ${bdr}`, borderRadius: 16, padding: '24px 20px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                transition: 'transform 0.25s ease'
              }}>
                <div>
                  <div style={{
                    display: 'inline-block', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4,
                    background: `${addon.color}15`, color: addon.color, marginBottom: 12
                  }}>
                    {addon.badge}
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: fg, margin: '0 0 8px' }}>{addon.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
                    <span style={{ fontSize: 24, fontWeight: 900, color: addon.color }}>{addon.price}</span>
                    <span style={{ fontSize: 11.5, color: fg2 }}>{addon.unit}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: fg2, lineHeight: 1.55, margin: 0 }}>
                    {addon.desc}
                  </p>
                </div>
                <a
                  href={`https://wa.me/918858141463?text=Hello%20CorpVEX%20Team%2C%20I%20want%20to%20inquire%20about%20the%20${encodeURIComponent(addon.title)}%20add-on.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginTop: 20, fontSize: 12, fontWeight: 700, color: addon.color,
                    display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none'
                  }}
                >
                  <span>Inquire for Add-On</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            Frequently Asked Questions (FAQ) Accordion
        ══════════════════════════════════════════════════════════════════ */}
        <div style={{
          background: bg2, border: `1px solid ${bdr}`, borderRadius: 20,
          padding: 'clamp(24px, 4vw, 40px)', marginBottom: 60
        }}>
          <h3 className="pv-serif-title" style={{ fontSize: 24, fontWeight: 800, color: fg, textAlign: 'center', margin: '0 0 24px' }}>
            Frequently Asked Questions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 900, margin: '0 auto' }}>
            {[
              {
                q: 'What is covered under the ₹5,000 Starter ERP installation charge?',
                a: 'The ₹5,000 one-time onboarding fee covers remote guided software installation on your Windows desktop workstation, database configuration, initial company setup, chart of accounts initialization, and standard invoice print template alignment.'
              },
              {
                q: 'What is included in the ₹1,00,000 installation and ₹50,000 e-way bill setup for Textile ERP?',
                a: 'Textile Industry ERP is an industrial deployment. The ₹1,00,000 fee includes comprehensive mill workflow configuration: loom allocation, multi-stage jobwork processes (dyeing, printing, folding), piece-rate wage calculation formulas, and opening master data cut-over. The ₹50,000 fee covers dedicated NIC GST e-Way Bill and e-Invoice direct API integration and test suite validation.'
              },
              {
                q: 'How does user licensing and extra user billing work?',
                a: 'Starter ERP includes 1 user (₹500/mo), 2 users (₹799/mo), or up to 5 users on the annual plan (₹5,999/yr). Textile Industry ERP includes a minimum of 5 users; additional users can be added at any time for ₹2,000 per user per month. Business and Business Pro editions have customizable user limits provided in your quote.'
              },
              {
                q: 'Why are Business ERP and Business Pro ERP listed as quotation-based?',
                a: 'To maintain strict compliance with CorpVEX governance, pricing for Business ERP and Business Pro ERP remains quotation-based until official management pricing approval is ratified. Our enterprise sales team provides custom quotes tailored to your exact number of branches, users, and migration needs.'
              },
              {
                q: 'Can we upgrade our plan as our business expands?',
                a: 'Yes, seamlessly. All CorpVEX editions utilize the same enterprise SQL Server database architecture. You can upgrade from Starter ERP to Business or Textile Industry ERP with zero data loss, preserving all ledgers, item masters, vouchers, and historical transactions.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                onClick={() => toggleFaq(idx)}
                style={{
                  border: `1px solid ${bdr}`, borderRadius: 12, padding: '16px 20px',
                  background: openFaq === idx ? (dk ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)') : 'transparent',
                  cursor: 'pointer', transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: fg }}>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={16} color={acc} /> : <ChevronDown size={16} color={fg2} />}
                </div>
                {openFaq === idx && (
                  <p style={{ fontSize: 13, color: fg2, lineHeight: 1.6, marginTop: 12, marginBottom: 0 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
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
