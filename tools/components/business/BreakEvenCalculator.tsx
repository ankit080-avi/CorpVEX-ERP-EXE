import React, { useState, useMemo } from 'react';
import { formatIndianCurrency, formatNumber, copyToClipboard } from '../../utils/formatters';
import { Copy, Check, RotateCcw } from 'lucide-react';

export const BreakEvenCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [fixedCosts, setFixedCosts] = useState('250000');
  const [variableCostPerUnit, setVariableCostPerUnit] = useState('120');
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState('200');
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const fc = parseFloat(fixedCosts) || 0;
  const vc = parseFloat(variableCostPerUnit) || 0;
  const sp = parseFloat(sellingPricePerUnit) || 0;

  const results = useMemo(() => {
    const contributionMargin = sp - vc;
    const cmRatio = sp > 0 ? (contributionMargin / sp) * 100 : 0;
    const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fc / contributionMargin) : 0;
    const breakEvenRevenue = breakEvenUnits * sp;

    return {
      contributionMargin,
      cmRatio,
      breakEvenUnits,
      breakEvenRevenue
    };
  }, [fc, vc, sp]);

  const handleCopy = () => {
    const text = `Break-Even Analysis:\nFixed Costs: ${formatIndianCurrency(fc)}\nSelling Price / Unit: ${formatIndianCurrency(sp)}\nVariable Cost / Unit: ${formatIndianCurrency(vc)}\nContribution Margin: ${formatIndianCurrency(results.contributionMargin)} (${results.cmRatio.toFixed(1)}%)\nBreak-Even Volume: ${formatNumber(results.breakEvenUnits)} Units\nBreak-Even Revenue: ${formatIndianCurrency(results.breakEvenRevenue)}`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 28 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Total Fixed Costs (Rent, Salaries, EMI) (₹)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={fixedCosts}
            onChange={(e) => setFixedCosts(e.target.value)}
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

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Variable Cost per Unit (Raw Material, Labor) (₹)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={variableCostPerUnit}
            onChange={(e) => setVariableCostPerUnit(e.target.value)}
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

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Selling Price per Unit (₹)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={sellingPricePerUnit}
            onChange={(e) => setSellingPricePerUnit(e.target.value)}
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
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: dk ? `${acc}15` : `${acc}10`, border: `1px solid ${acc}40`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: acc, fontWeight: 800, textTransform: 'uppercase' }}>Break-Even Units</div>
          <div style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 900, marginTop: 4, color: fg }}>
            {formatNumber(results.breakEvenUnits)} <span style={{ fontSize: 14, fontWeight: 600, color: fg2 }}>Units</span>
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Units needed to cover all expenses</div>
        </div>

        <div style={{ background: dk ? 'rgba(56, 189, 248, 0.08)' : '#f0f9ff', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>Break-Even Revenue</div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4, color: fg }}>
            {formatIndianCurrency(results.breakEvenRevenue)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Zero profit, zero loss threshold</div>
        </div>

        <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Contribution Margin</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>
            {formatIndianCurrency(results.contributionMargin)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>
            {results.cmRatio.toFixed(1)}% Contribution Ratio (SP − VC)
          </div>
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
          <span>{copied ? 'Copied Details' : 'Copy Break-Even Analysis'}</span>
        </button>
      </div>
    </div>
  );
};
