import React, { useState, useMemo } from 'react';
import type { ToolCategory, ToolDefinition } from './types';
import { CATEGORIES, TOOLS_REGISTRY, searchTools } from './registry';
import {
  Receipt,
  Percent,
  ShieldCheck,
  Search,
  FileText,
  Building,
  Type,
  Tag,
  TrendingUp,
  DollarSign,
  Target,
  QrCode,
  Barcode,
  Factory,
  Layers,
  Scale,
  RefreshCw,
  CreditCard,
  Calculator,
  Briefcase,
  ArrowRight,
  Sparkles,
  X,
  CheckCircle2,
  Lock,
  Cpu,
  RotateCw,
  Split,
  Combine,
  Image,
  Unlock,
  PenTool,
  Wallet,
  Boxes,
} from 'lucide-react';

export interface FreeToolsHomeProps {
  theme: 'dark' | 'light';
  onSelectTool: (slug: string) => void;
  onNavigateHome: () => void;
  onNavigateSignup?: () => void;
  onNavigateContact?: () => void;
}

// Icon mapper
function getToolIcon(iconName: string, size = 20, color?: string) {
  const props = { size, color };
  switch (iconName) {
    case 'Receipt':
      return <Receipt {...props} />;
    case 'Percent':
      return <Percent {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'Search':
      return <Search {...props} />;
    case 'FileText':
      return <FileText {...props} />;
    case 'RotateCw':
      return <RotateCw {...props} />;
    case 'Split':
      return <Split {...props} />;
    case 'Combine':
      return <Combine {...props} />;
    case 'Image':
      return <Image {...props} />;
    case 'Lock':
      return <Lock {...props} />;
    case 'Unlock':
      return <Unlock {...props} />;
    case 'PenTool':
      return <PenTool {...props} />;
    case 'Building':
      return <Building {...props} />;
    case 'Type':
      return <Type {...props} />;
    case 'Tag':
      return <Tag {...props} />;
    case 'TrendingUp':
      return <TrendingUp {...props} />;
    case 'DollarSign':
      return <DollarSign {...props} />;
    case 'Target':
      return <Target {...props} />;
    case 'QrCode':
      return <QrCode {...props} />;
    case 'Barcode':
      return <Barcode {...props} />;
    case 'Factory':
      return <Factory {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    case 'Scale':
      return <Scale {...props} />;
    case 'RefreshCw':
      return <RefreshCw {...props} />;
    case 'CreditCard':
      return <CreditCard {...props} />;
    case 'Calculator':
      return <Calculator {...props} />;
    case 'Wallet':
      return <Wallet {...props} />;
    case 'Boxes':
      return <Boxes {...props} />;
    case 'Briefcase':
    default:
      return <Briefcase {...props} />;
  }
}

export const FreeToolsHome: React.FC<FreeToolsHomeProps> = ({
  theme,
  onSelectTool,
  onNavigateHome,
  onNavigateSignup,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const dk = theme === 'dark';
  const bg = dk ? '#06090e' : '#f8fafc';
  const cardBg = dk ? '#0d1522' : '#ffffff';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? 'rgba(255, 255, 255, 0.05)' : '#ffffff';

  // Filter tools
  const filteredTools = useMemo(() => {
    return searchTools(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: TOOLS_REGISTRY.length };
    TOOLS_REGISTRY.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div style={{ background: bg, minHeight: '100vh', color: fg, fontFamily: "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* ── Hero Banner ── */}
      <section
        style={{
          borderBottom: `1px solid ${bdr}`,
          background: dk
            ? 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(232, 168, 56, 0.15), transparent 70%), #06090e'
            : 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(217, 119, 6, 0.08), transparent 70%), #f8fafc',
          padding: 'clamp(36px, 6vw, 64px) clamp(16px, 4vw, 32px)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '6px 14px',
              borderRadius: 20,
              background: dk ? 'rgba(232, 168, 56, 0.12)' : 'rgba(217, 119, 6, 0.1)',
              color: acc,
              marginBottom: 16,
            }}
          >
            <Sparkles size={14} />
            <span>{TOOLS_REGISTRY.length} Free Business, GST &amp; PDF Tools</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(30px, 5vw, 48px)',
              fontWeight: 900,
              color: fg,
              letterSpacing: '-0.025em',
              margin: '0 0 16px 0',
              lineHeight: 1.15,
            }}
          >
            Free Business, GST, Accounting, PDF &amp; Manufacturing Tools
          </h1>

          <p
            style={{
              fontSize: 'clamp(15px, 2vw, 17.5px)',
              color: fg2,
              lineHeight: 1.6,
              maxWidth: 720,
              margin: '0 auto 28px',
            }}
          >
            Instant, professional calculators for Indian business owners, accountants, manufacturers, and entrepreneurs.
            100% free, run completely client-side in your browser with zero data storage.
          </p>

          {/* Privacy & Feature Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 16,
              fontSize: 12.5,
              color: fg2,
              marginBottom: 32,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Lock size={14} color="#10b981" /> 100% Private & Client-Side
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={14} color="#10b981" /> No Signup or Login Required
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Cpu size={14} color="#10b981" /> Zero Server Latency
            </span>
          </div>

          {/* Search Box */}
          <div
            style={{
              maxWidth: 580,
              margin: '0 auto',
              position: 'relative',
              boxShadow: dk ? '0 8px 24px rgba(0,0,0,0.4)' : '0 4px 18px rgba(15,23,42,0.06)',
              borderRadius: 12,
            }}
          >
            <Search
              size={18}
              color={fg2}
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by tool name, keyword, or slab (e.g., GST, HSN, Margin, Barcode)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 44px 14px 46px',
                borderRadius: 12,
                border: `1px solid ${bdr}`,
                background: inputBg,
                color: fg,
                fontSize: 15,
                fontWeight: 500,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: fg2,
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Directory Section ── */}
      <main
        className="corpvex-free-tools-content"
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: 'clamp(28px, 4vw, 48px) clamp(16px, 3.5vw, 32px)',
          boxSizing: 'border-box',
        }}
      >
        <style>{`
          .corpvex-free-tools-content .tools-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 24px;
            margin-bottom: 48px;
          }
          @media (max-width: 1080px) {
            .corpvex-free-tools-content .tools-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 20px;
            }
          }
          @media (max-width: 640px) {
            .corpvex-free-tools-content .tools-grid {
              grid-template-columns: 1fr;
              gap: 16px;
            }
          }
          .corpvex-free-tools-content .tool-card {
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 310px;
            height: 100%;
            box-sizing: border-box;
            background: ${cardBg};
            border: 1px solid ${bdr};
            border-radius: 14px;
            padding: 24px 22px 18px;
            cursor: pointer;
            outline: none;
            box-shadow: ${dk ? 'none' : '0 1px 3px rgba(15,23,42,0.04), 0 1px 2px rgba(15,23,42,0.02)'};
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                        border-color 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                        box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .corpvex-free-tools-content .tool-card:focus-visible {
            outline: 2px solid ${acc};
            outline-offset: 2px;
          }
          .corpvex-free-tools-content .tool-card-icon {
            width: 46px;
            height: 46px;
            border-radius: 12px;
            background: ${dk ? 'rgba(232, 168, 56, 0.12)' : 'rgba(217, 119, 6, 0.08)'};
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${acc};
            flex-shrink: 0;
            transition: transform 0.2s ease, background 0.2s ease;
          }
          .corpvex-free-tools-content .tool-card:hover .tool-card-icon,
          .corpvex-free-tools-content .tool-card:focus-within .tool-card-icon {
            transform: scale(1.05);
            background: ${dk ? 'rgba(232, 168, 56, 0.2)' : 'rgba(217, 119, 6, 0.14)'};
          }
          .corpvex-free-tools-content .tool-card-title {
            font-size: 19px;
            font-weight: 750;
            line-height: 1.35;
            letter-spacing: -0.015em;
            margin: 0 0 8px 0;
            color: ${fg};
            transition: color 0.15s ease;
          }
          @media (max-width: 768px) {
            .corpvex-free-tools-content .tool-card-title {
              font-size: 18px;
            }
          }
          .corpvex-free-tools-content .tool-card-desc {
            font-size: 14px;
            line-height: 1.52;
            color: ${fg2};
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .corpvex-free-tools-content .tool-card-footer-normal {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: auto;
            padding-top: 14px;
            border-top: 1px solid ${bdr};
            transition: opacity 0.18s ease, transform 0.18s ease;
          }
          .corpvex-free-tools-content .tool-card-reveal-drawer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: ${cardBg};
            border-top: 1px solid ${bdr};
            padding: 13px 22px 16px;
            border-radius: 0 0 14px 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            opacity: 0;
            pointer-events: none;
            transform: translateY(8px);
            transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 2;
          }
          .corpvex-free-tools-content .tool-card:hover,
          .corpvex-free-tools-content .tool-card:focus-within {
            transform: translateY(-2px);
            border-color: ${acc};
            box-shadow: ${dk ? '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(232, 168, 56, 0.25)' : '0 10px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(217, 119, 6, 0.08)'};
          }
          .corpvex-free-tools-content .tool-card:hover .tool-card-reveal-drawer,
          .corpvex-free-tools-content .tool-card:focus-within .tool-card-reveal-drawer {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0);
          }
          .corpvex-free-tools-content .tool-card:hover .tool-card-footer-normal,
          .corpvex-free-tools-content .tool-card:focus-within .tool-card-footer-normal {
            opacity: 0;
            transform: translateY(4px);
          }
          .corpvex-free-tools-content .tool-cta-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            width: 100%;
            padding: 9px 14px;
            border-radius: 8px;
            background: ${acc};
            color: #ffffff;
            font-size: 13.5px;
            font-weight: 700;
            border: none;
            cursor: pointer;
            box-shadow: ${dk ? '0 3px 10px rgba(232, 168, 56, 0.25)' : '0 3px 10px rgba(217, 119, 6, 0.25)'};
            transition: filter 0.15s ease, transform 0.15s ease;
          }
          .corpvex-free-tools-content .tool-cta-btn:hover {
            filter: brightness(1.08);
            transform: translateY(-1px);
          }
          @media (hover: none) {
            .corpvex-free-tools-content .tool-card-reveal-drawer {
              display: none;
            }
            .corpvex-free-tools-content .tool-card-footer-normal {
              opacity: 1 !important;
              transform: none !important;
            }
          }
        `}</style>

        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            overflowX: 'auto',
            paddingBottom: 14,
            marginBottom: 28,
            scrollbarWidth: 'none',
          }}
        >
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 18px',
              borderRadius: 24,
              border: selectedCategory === 'all' ? `1px solid ${acc}` : `1px solid ${bdr}`,
              background: selectedCategory === 'all' ? (dk ? 'rgba(232, 168, 56, 0.16)' : 'rgba(217, 119, 6, 0.1)') : cardBg,
              color: selectedCategory === 'all' ? acc : fg,
              fontSize: 14,
              fontWeight: selectedCategory === 'all' ? 700 : 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            <span>All Tools</span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 12,
                background: dk ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                color: selectedCategory === 'all' ? acc : fg2,
              }}
            >
              {categoryCounts.all}
            </span>
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 18px',
                  borderRadius: 24,
                  border: isSelected ? `1px solid ${acc}` : `1px solid ${bdr}`,
                  background: isSelected ? (dk ? 'rgba(232, 168, 56, 0.16)' : 'rgba(217, 119, 6, 0.1)') : cardBg,
                  color: isSelected ? acc : fg,
                  fontSize: 14,
                  fontWeight: isSelected ? 700 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{cat.label}</span>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: dk ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                    color: isSelected ? acc : fg2,
                  }}
                >
                  {categoryCounts[cat.id] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            fontSize: 14,
            color: fg2,
          }}
        >
          <div>
            Showing <strong style={{ color: fg, fontWeight: 700 }}>{filteredTools.length}</strong> of{' '}
            <strong style={{ color: fg, fontWeight: 700 }}>{TOOLS_REGISTRY.length}</strong> free tools
            {searchQuery && (
              <span>
                {' '}for &ldquo;<strong style={{ color: fg }}>{searchQuery}</strong>&rdquo;
              </span>
            )}
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: acc,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reset Search
            </button>
          )}
        </div>

        {/* ── Tools Grid ── */}
        {filteredTools.length > 0 ? (
          <div className="tools-grid">
            {filteredTools.map((tool) => (
              <div
                key={tool.slug}
                onClick={() => onSelectTool(tool.slug)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTool(tool.slug);
                  }
                }}
                tabIndex={0}
                role="link"
                aria-label={`Open ${tool.title}`}
                className="tool-card"
              >
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Top Bar inside Card */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div className="tool-card-icon">
                      {getToolIcon(tool.icon, 22, acc)}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {tool.badge && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '4px 9px',
                            borderRadius: 14,
                            background: dk ? 'rgba(16, 185, 129, 0.16)' : 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {tool.badge}
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: fg2,
                          background: dk ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                          padding: '4px 10px',
                          borderRadius: 8,
                        }}
                      >
                        {tool.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="tool-card-title">
                    {tool.title}
                  </h3>

                  <p className="tool-card-desc">
                    {tool.subtitle || tool.description}
                  </p>
                </div>

                {/* Normal State Footer */}
                <div className="tool-card-footer-normal">
                  <span style={{ fontSize: 13, fontWeight: 500, color: fg2 }}>Free to Use</span>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 14,
                      fontWeight: 700,
                      color: acc,
                    }}
                  >
                    <span>Calculate Now</span>
                    <ArrowRight size={15} />
                  </div>
                </div>

                {/* Hover Reveal Drawer */}
                <div className="tool-card-reveal-drawer">
                  {tool.description && tool.description !== tool.subtitle && (
                    <p
                      style={{
                        fontSize: 12,
                        color: fg2,
                        lineHeight: 1.45,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {tool.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: fg2, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Sparkles size={13} color={acc} />
                      <span>{tool.processingType === 'backend' ? 'Cloud Processing' : '100% Client-Side'}</span>
                    </span>
                    {tool.keywords && tool.keywords.length > 0 && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: dk ? 'rgba(255, 255, 255, 0.06)' : '#f1f5f9',
                          color: fg2,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {tool.keywords[0]}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="tool-cta-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTool(tool.slug);
                    }}
                    tabIndex={-1}
                  >
                    <span>Open Tool</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              background: cardBg,
              border: `1px solid ${bdr}`,
              borderRadius: 14,
              marginBottom: 48,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: fg, margin: '0 0 8px' }}>
              No calculators found
            </h3>
            <p style={{ fontSize: 14, color: fg2, maxWidth: 440, margin: '0 auto 20px' }}>
              We couldn&apos;t find any tool matching &ldquo;{searchQuery}&rdquo;. Try another search term or clear the filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                background: acc,
                color: '#fff',
                border: 'none',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Show All {TOOLS_REGISTRY.length} Free Tools
            </button>
          </div>
        )}

        {/* ── CorpVEX ERP Promotion Banner ── */}
        <section
          style={{
            background: dk
              ? 'linear-gradient(135deg, rgba(13, 21, 34, 0.9) 0%, rgba(232, 168, 56, 0.08) 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, rgba(217, 119, 6, 0.06) 100%)',
            border: `1px solid ${bdr}`,
            borderRadius: 16,
            padding: 'clamp(24px, 4vw, 40px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 24,
            boxShadow: dk ? 'none' : '0 4px 20px rgba(15,23,42,0.04)',
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: acc,
                marginBottom: 6,
              }}
            >
              Enterprise Automation
            </div>
            <h3 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, color: fg, margin: '0 0 10px 0' }}>
              Automate GST Invoices, Barcode Scanning &amp; BOM Costing
            </h3>
            <p style={{ fontSize: 14.5, color: fg2, lineHeight: 1.6, margin: 0 }}>
              Need more than manual calculators? CorpVEX Web ERP automates automated multi-state GST tax invoices,
              real-time warehouse barcode scanning, live multi-level BOM costing, and manufacturing shop-floor tracking.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {onNavigateSignup && (
              <button
                onClick={onNavigateSignup}
                style={{
                  padding: '12px 24px',
                  borderRadius: 8,
                  background: acc,
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)',
                }}
              >
                <span>Start Free ERP Trial</span>
                <ArrowRight size={16} />
              </button>
            )}
            <button
              onClick={onNavigateHome}
              style={{
                padding: '12px 20px',
                borderRadius: 8,
                background: 'transparent',
                color: fg,
                border: `1px solid ${bdr}`,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Explore CorpVEX Features
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
