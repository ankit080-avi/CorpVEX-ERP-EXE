import React, { useState } from 'react';
import type { ToolDefinition } from './types';
import { ChevronRight, HelpCircle, BookOpen, Layers, ArrowRight, Share2, Check } from 'lucide-react';
import { copyToClipboard } from './utils/formatters';

export interface ToolPageLayoutProps {
  tool: ToolDefinition;
  theme: 'dark' | 'light';
  onNavigateHome: () => void;
  onNavigateToolsHome: () => void;
  onSelectTool: (slug: string) => void;
  relatedTools: ToolDefinition[];
  children: React.ReactNode;
}

export const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({
  tool,
  theme,
  onNavigateHome,
  onNavigateToolsHome,
  onSelectTool,
  relatedTools,
  children
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const dk = theme === 'dark';
  const bg = dk ? '#06090e' : '#f8fafc';
  const cardBg = dk ? '#0d1522' : '#ffffff';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const acc = dk ? '#e8a838' : '#d97706';

  const handleShare = () => {
    copyToClipboard(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div style={{ background: bg, minHeight: '100vh', color: fg, fontFamily: "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* ── Breadcrumb Bar ── */}
      <div style={{
        borderBottom: `1px solid ${bdr}`,
        background: dk ? 'rgba(13, 21, 34, 0.6)' : 'rgba(255, 255, 255, 0.7)',
        padding: '12px clamp(16px, 4vw, 48px)',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            onClick={onNavigateHome}
            style={{ color: fg2, cursor: 'pointer', fontWeight: 500 }}
          >
            Home
          </span>
          <ChevronRight size={14} color={fg2} />
          <span
            onClick={onNavigateToolsHome}
            style={{ color: fg2, cursor: 'pointer', fontWeight: 500 }}
          >
            Free Tools
          </span>
          <ChevronRight size={14} color={fg2} />
          <span style={{ color: acc, fontWeight: 600 }}>
            {tool.categoryLabel}
          </span>
          <ChevronRight size={14} color={fg2} />
          <span style={{ color: fg, fontWeight: 700 }}>
            {tool.shortTitle || tool.title}
          </span>
        </div>

        <button
          onClick={handleShare}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: dk ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
            border: `1px solid ${bdr}`,
            color: fg,
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {copiedUrl ? <Check size={14} color="#10b981" /> : <Share2 size={14} color={fg2} />}
          <span>{copiedUrl ? 'Link Copied!' : 'Share Tool'}</span>
        </button>
      </div>

      {/* ── Main Tool Wrapper ── */}
      <main style={{ maxWidth: 1120, margin: '0 auto', padding: 'clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px)' }}>
        
        {/* Page Header (Canonical H1 & Subtitle) */}
        <header style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11.5,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '4px 12px',
            borderRadius: 20,
            background: dk ? 'rgba(232, 168, 56, 0.12)' : 'rgba(217, 119, 6, 0.08)',
            color: acc,
            marginBottom: 12
          }}>
            {tool.categoryLabel} • Free Online Tool
          </div>
          <h1 style={{
            fontSize: 'clamp(26px, 4vw, 40px)',
            fontWeight: 800,
            color: fg,
            letterSpacing: '-0.02em',
            margin: '0 0 10px 0',
            lineHeight: 1.2
          }}>
            {tool.title}
          </h1>
          <p style={{
            fontSize: 16,
            color: fg2,
            maxWidth: 680,
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            {tool.description}
          </p>
        </header>

        {/* ── Tool Panel (Primary Interactive Component) ── */}
        <div style={{
          background: cardBg,
          borderRadius: 16,
          border: `1px solid ${bdr}`,
          boxShadow: dk
            ? '0 10px 30px rgba(0, 0, 0, 0.45)'
            : '0 4px 20px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(0,0,0,0.02)',
          padding: 'clamp(20px, 3.5vw, 36px)',
          marginBottom: 44
        }}>
          {children}
        </div>

        {/* ── How to Use & Explanation Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
          marginBottom: 44
        }}>
          {/* How to Use Card */}
          <div style={{
            background: cardBg,
            borderRadius: 14,
            border: `1px solid ${bdr}`,
            padding: 24
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
              <BookOpen size={18} color={acc} />
              <span>How to Use the {tool.shortTitle || tool.title}</span>
            </div>
            <ol style={{ margin: 0, paddingLeft: 20, color: fg2, lineHeight: 1.7, fontSize: 14 }}>
              {tool.howToUseSteps.map((step, idx) => (
                <li key={idx} style={{ marginBottom: 8 }}>
                  <strong style={{ color: fg }}>Step {idx + 1}:</strong> {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Formula & Explanation Card */}
          <div style={{
            background: cardBg,
            borderRadius: 14,
            border: `1px solid ${bdr}`,
            padding: 24
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
              <Layers size={18} color={acc} />
              <span>Formula & Mathematical Method</span>
            </div>
            {tool.formulaLatex && (
              <div style={{
                background: dk ? 'rgba(255,255,255,0.04)' : '#f1f5f9',
                border: `1px solid ${bdr}`,
                borderRadius: 8,
                padding: '12px 16px',
                fontFamily: 'monospace',
                fontSize: 14,
                color: acc,
                fontWeight: 700,
                marginBottom: 12
              }}>
                {tool.formulaLatex}
              </div>
            )}
            <p style={{ margin: 0, color: fg2, fontSize: 14, lineHeight: 1.65 }}>
              {tool.formulaDescription || 'Calculated deterministically in real-time according to official accounting and mathematical formulas.'}
            </p>
          </div>
        </div>

        {/* ── Frequently Asked Questions (FAQ) ── */}
        {tool.faqs && tool.faqs.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, fontWeight: 800, marginBottom: 18 }}>
              <HelpCircle size={22} color={acc} />
              <span>Frequently Asked Questions</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tool.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      background: cardBg,
                      border: `1px solid ${bdr}`,
                      borderRadius: 10,
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '14px 18px',
                        background: 'none',
                        border: 'none',
                        color: fg,
                        fontSize: 14.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12
                      }}
                    >
                      <span>{faq.question}</span>
                      <span style={{ fontSize: 18, color: acc, fontWeight: 700 }}>
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div style={{
                        padding: '0 18px 16px',
                        color: fg2,
                        fontSize: 14,
                        lineHeight: 1.65,
                        borderTop: `1px solid ${bdr}`,
                        paddingTop: 12
                      }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Related Tools Section ── */}
        {relatedTools && relatedTools.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>
              Related Business & Utility Tools
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16
            }}>
              {relatedTools.map((rel) => (
                <div
                  key={rel.slug}
                  onClick={() => onSelectTool(rel.slug)}
                  style={{
                    background: cardBg,
                    border: `1px solid ${bdr}`,
                    borderRadius: 12,
                    padding: 18,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = acc;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = bdr;
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div>
                    <span style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: acc,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em'
                    }}>
                      {rel.categoryLabel}
                    </span>
                    <div style={{ fontSize: 15, fontWeight: 700, color: fg, margin: '4px 0 6px' }}>
                      {rel.title}
                    </div>
                    <p style={{
                      fontSize: 12.5,
                      color: fg2,
                      margin: 0,
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {rel.description}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    color: acc,
                    fontSize: 12.5,
                    fontWeight: 700,
                    marginTop: 12
                  }}>
                    <span>Open Tool</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
};
