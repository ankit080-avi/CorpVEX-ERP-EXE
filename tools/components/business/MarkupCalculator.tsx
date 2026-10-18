import React, { useState } from 'react';
import { formatIndianCurrency, copyToClipboard } from '../../utils/formatters';
import { Copy, Check, RotateCcw } from 'lucide-react';

export const MarkupCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [costPrice, setCostPrice] = useState('1500');
  const [markupPercent, setMarkupPercent] = useState('40');
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const cp = parseFloat(costPrice) || 0;
  const mp = parseFloat(markupPercent) || 0;

  const profit = (cp * mp) / 100;
  const sellingPrice = cp + profit;
  const marginPercent = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

  const handleCopy = () => {
    const text = `Markup Calculation:\nCost: ${formatIndianCurrency(cp)}\nMarkup: ${mp}%\nProfit Added: ${formatIndianCurrency(profit)}\nRecommended Selling Price: ${formatIndianCurrency(sellingPrice)}\nResulting Profit Margin: ${marginPercent.toFixed(2)}%`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 28 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Product / Unit Cost Price (₹)
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

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Markup Percentage (%)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={markupPercent}
            onChange={(e) => setMarkupPercent(e.target.value)}
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Profit Amount Added</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, color: '#10b981' }}>
            +{formatIndianCurrency(profit)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>{mp}% on top of cost</div>
        </div>

        <div style={{ background: dk ? `${acc}15` : `${acc}10`, border: `1px solid ${acc}40`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: acc, fontWeight: 800, textTransform: 'uppercase' }}>Selling Price</div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4, color: fg }}>
            {formatIndianCurrency(sellingPrice)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Cost + Markup Profit</div>
        </div>

        <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Equivalent Margin</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>
            {marginPercent.toFixed(2)}%
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Margin on revenue</div>
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
          <span>{copied ? 'Copied Details' : 'Copy Markup Details'}</span>
        </button>
      </div>
    </div>
  );
};
