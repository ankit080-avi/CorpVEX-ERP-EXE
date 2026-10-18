import React, { useState, useEffect, useMemo } from 'react';
import { LandingTopbar } from '../common/LandingTopbar';
import { FreeToolsHome } from './FreeToolsHome';
import { ToolPageLayout } from './ToolPageLayout';
import { getToolBySlug, getRelatedTools, TOOLS_REGISTRY } from './registry';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export interface FreeToolsViewProps {
  theme: 'dark' | 'light';
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
  onNavigateHome: () => void;
  onNavigatePlatform?: () => void;
  onNavigateFeatures?: () => void;
  onNavigateModules?: () => void;
  onNavigatePortal?: () => void;
  onNavigatePricing?: () => void;
  onNavigateSignup?: () => void;
  onNavigateLogin?: () => void;
  initialSlug?: string;
}

function parseSlugFromPathname(): string | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname.replace(/\/$/, '');
  if (path.startsWith('/tools/')) {
    const s = path.split('/tools/')[1]?.split('/')[0]?.split('?')[0];
    return s || null;
  }
  // Also check query param fallback e.g. /tools?tool=gst-calculator
  const params = new URLSearchParams(window.location.search);
  const qTool = params.get('tool') || params.get('slug');
  if (qTool) return qTool;
  return null;
}

export const FreeToolsView: React.FC<FreeToolsViewProps> = ({
  theme,
  setTheme,
  onNavigateHome,
  onNavigatePlatform,
  onNavigateFeatures,
  onNavigateModules,
  onNavigatePortal,
  onNavigatePricing,
  onNavigateSignup,
  onNavigateLogin,
  initialSlug,
}) => {
  const [currentSlug, setCurrentSlug] = useState<string | null>(() => {
    return initialSlug || parseSlugFromPathname();
  });

  // Handle browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const slug = parseSlugFromPathname();
      setCurrentSlug(slug);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync document title and scroll to top on slug change
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch {}

    if (!currentSlug) {
      document.title = 'Free Business, GST, Accounting & Manufacturing Calculators | CorpVEX';
    } else {
      const t = getToolBySlug(currentSlug);
      if (t) {
        document.title = `${t.seoTitle} | CorpVEX Free Tools`;
      } else {
        document.title = 'Tool Not Found | CorpVEX Free Tools';
      }
    }
  }, [currentSlug]);

  const activeTool = useMemo(() => {
    if (!currentSlug) return null;
    return getToolBySlug(currentSlug);
  }, [currentSlug]);

  const handleSelectTool = (slug: string) => {
    try {
      window.history.pushState(null, '', `/tools/${slug}`);
    } catch {}
    setCurrentSlug(slug);
  };

  const handleNavigateToolsHome = () => {
    try {
      window.history.pushState(null, '', '/tools');
    } catch {}
    setCurrentSlug(null);
  };

  const handleNavigateHomeFull = () => {
    try {
      window.history.pushState(null, '', '/');
    } catch {}
    onNavigateHome();
  };

  const dk = theme === 'dark';
  const bg = dk ? '#06090e' : '#f8fafc';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const acc = dk ? '#e8a838' : '#d97706';
  const bdr = dk ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <div style={{ background: bg, minHeight: '100vh', color: fg, display: 'flex', flexDirection: 'column' }}>
      {/* ── Fixed Landing Header ── */}
      <LandingTopbar
        theme={theme}
        setTheme={setTheme}
        activePage="tools"
        onNavigateHome={handleNavigateHomeFull}
        onNavigatePlatform={onNavigatePlatform}
        onNavigateFeatures={onNavigateFeatures}
        onNavigateModules={onNavigateModules}
        onNavigatePortal={onNavigatePortal}
        onNavigatePricing={onNavigatePricing || handleNavigateHomeFull}
        onNavigateSignup={onNavigateSignup || handleNavigateHomeFull}
        onNavigateLogin={onNavigateLogin || handleNavigateHomeFull}
        onNavigateTools={handleNavigateToolsHome}
      />

      {/* ── Main Dynamic Body ── */}
      <div style={{ flex: 1 }}>
        {!currentSlug && (
          <FreeToolsHome
            theme={theme}
            onSelectTool={handleSelectTool}
            onNavigateHome={handleNavigateHomeFull}
            onNavigateSignup={onNavigateSignup}
          />
        )}

        {currentSlug && activeTool && (
          <ToolPageLayout
            tool={activeTool}
            theme={theme}
            onNavigateHome={handleNavigateHomeFull}
            onNavigateToolsHome={handleNavigateToolsHome}
            onSelectTool={handleSelectTool}
            relatedTools={getRelatedTools(activeTool.slug, 3)}
          >
            <activeTool.component theme={theme} />
          </ToolPageLayout>
        )}

        {currentSlug && !activeTool && (
          <main style={{ maxWidth: 640, margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: dk ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <AlertCircle size={32} />
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 12px 0', color: fg }}>
              Calculator Not Found
            </h1>
            <p style={{ fontSize: 15, color: fg2, lineHeight: 1.6, marginBottom: 24 }}>
              The calculator &ldquo;<strong>{currentSlug}</strong>&rdquo; does not exist or may have been updated.
              Browse our directory of 25 free business tools.
            </p>
            <button
              onClick={handleNavigateToolsHome}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 8,
                background: acc,
                color: '#fff',
                border: 'none',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Free Tools Directory</span>
            </button>
          </main>
        )}
      </div>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: `1px solid ${bdr}`,
          background: dk ? '#06090e' : '#ffffff',
          padding: '28px clamp(16px, 4vw, 48px)',
          fontSize: 13,
          color: fg2,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} CorpVEX ERP. All 25 Free Calculators run 100% client-side in your browser.
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <span
              onClick={handleNavigateToolsHome}
              style={{ cursor: 'pointer', color: fg, fontWeight: 600 }}
            >
              All 25 Free Tools
            </span>
            <span
              onClick={handleNavigateHomeFull}
              style={{ cursor: 'pointer', color: fg2 }}
            >
              CorpVEX Home
            </span>
            {onNavigatePricing && (
              <span
                onClick={onNavigatePricing}
                style={{ cursor: 'pointer', color: fg2 }}
              >
                ERP Pricing
              </span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
