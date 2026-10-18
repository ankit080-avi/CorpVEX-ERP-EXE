import React, { useState, useMemo } from 'react';
import { formatIndianCurrency, copyToClipboard } from '../../utils/formatters';
import { Copy, Check, RotateCcw } from 'lucide-react';

export const ProfitMarginCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [mode, setMode] = useState<'forward' | 'target'>('forward');
  const [costPrice, setCostPrice] = useState('800');
  const [sellingPrice, setSellingPrice] = useState('1200');
  const [targetMarginPercent, setTargetMarginPercent] = useState('35');
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const cp = parseFloat(costPrice) || 0;
  const sp = parseFloat(sellingPrice) || 0;
  const targetM = parseFloat(targetMarginPercent) || 0;

  const results = useMemo(() => {
    if (mode === 'forward') {
      const profit = sp - cp;
      const margin = sp > 0 ? (profit / sp) * 100 : 0;
      const markup = cp > 0 ? (profit / cp) * 100 : 0;
      return {
        cost: cp,
        selling: sp,
        profit,
        margin,
        markup
      };
    } else {
      // Reverse target margin mode: SP = CP / (1 - Margin/100)
      const validMargin = Math.min(99.9, targetM);
      const calculatedSelling = validMargin < 100 ? cp / (1 - validMargin / 100) : 0;
      const profit = calculatedSelling - cp;
      const markup = cp > 0 ? (profit / cp) * 100 : 0;
      return {
        cost: cp,
        selling: calculatedSelling,
        profit,
        margin: validMargin,
        markup
      };
    }
  }, [cp, sp, targetM, mode]);

  const handleCopy = () => {
    const text = `Profit & Margin Analysis:\nCost Price: ${formatIndianCurrency(results.cost)}\nSelling Price: ${formatIndianCurrency(results.selling)}\nGross Profit: ${formatIndianCurrency(results.profit)}\nProfit Margin: ${results.margin.toFixed(2)}%\nMarkup: ${results.markup.toFixed(2)}%`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Mode Toggle */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg2 }}>
          CALCULATION OBJECTIVE
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
          <button
            type="button"
            onClick={() => setMode('forward')}
            style={{
              padding: '11px',
              borderRadius: 8,
              border: `1px solid ${mode === 'forward' ? acc : bdr}`,
              background: mode === 'forward' ? (dk ? `${acc}20` : `${acc}15`) : inputBg,
              color: mode === 'forward' ? acc : fg,
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer'
            }}
          >
            Calculate Margin & Profit from Cost + Selling Price
          </button>
          <button
            type="button"
            onClick={() => setMode('target')}
            style={{
              padding: '11px',
              borderRadius: 8,
              border: `1px solid ${mode === 'target' ? acc : bdr}`,
              background: mode === 'target' ? (dk ? `${acc}20` : `${acc}15`) : inputBg,
              color: mode === 'target' ? acc : fg,
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer'
            }}
          >
            Find Required Selling Price for Target Margin %
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 28 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Cost of Goods / Purchase Cost (₹)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 8,
              border: `1px solid ${bdr}`,
              background: inputBg,
              color: fg,
              fontSize: 16,
              fontWeight: 700,
              boxSizing: 'border-box'
            }}
          />
        </div>

        {mode === 'forward' ? (
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
              Selling / Sale Price (₹)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 8,
                border: `1px solid ${bdr}`,
                background: inputBg,
                color: fg,
                fontSize: 16,
                fontWeight: 700,
                boxSizing: 'border-box'
              }}
            />
          </div>
        ) : (
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
              Target Profit Margin (%)
            </label>
            <input
              type="number"
              min="0"
              max="99"
              step="any"
              value={targetMarginPercent}
              onChange={(e) => setTargetMarginPercent(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 8,
                border: `1px solid ${bdr}`,
                background: inputBg,
                color: fg,
                fontSize: 16,
                fontWeight: 700,
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Selling Price</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>{formatIndianCurrency(results.selling)}</div>
        </div>

        <div style={{ background: dk ? 'rgba(16, 185, 129, 0.08)' : '#ecfdf5', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>Gross Profit</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4, color: '#10b981' }}>
            {formatIndianCurrency(results.profit)}
          </div>
        </div>

        <div style={{ background: dk ? `${acc}15` : `${acc}10`, border: `1px solid ${acc}40`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: acc, fontWeight: 800, textTransform: 'uppercase' }}>Profit Margin</div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4, color: fg }}>
            {results.margin.toFixed(2)}%
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Profit as % of Selling Price</div>
        </div>

        <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Markup</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>{results.markup.toFixed(2)}%</div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Profit as % of Cost Price</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleCopy}
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 18px',
            borderRadius: 8,
            border: 'none',
            background: acc,
            color: '#ffffff',
            fontSize: 13.5,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Copied Details' : 'Copy Margin Breakdown'}</span>
        </button>
      </div>
    </div>
  );
};
