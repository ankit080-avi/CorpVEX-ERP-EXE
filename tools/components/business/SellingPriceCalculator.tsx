import React, { useState } from 'react';
import { formatIndianCurrency, copyToClipboard } from '../../utils/formatters';
import { Copy, Check, RotateCcw } from 'lucide-react';

export const SellingPriceCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [directCost, setDirectCost] = useState('650');
  const [overheadCost, setOverheadCost] = useState('120');
  const [targetMarginPercent, setTargetMarginPercent] = useState('30');
  const [gstRate, setGstRate] = useState('5');
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const dc = parseFloat(directCost) || 0;
  const oh = parseFloat(overheadCost) || 0;
  const marginPct = parseFloat(targetMarginPercent) || 0;
  const gst = parseFloat(gstRate) || 0;

  const totalCost = dc + oh;
  const validMargin = Math.min(99, Math.max(0, marginPct));
  const sellingPriceBeforeTax = validMargin < 100 ? totalCost / (1 - validMargin / 100) : totalCost;
  const profitPerUnit = sellingPriceBeforeTax - totalCost;
  const taxAmount = (sellingPriceBeforeTax * gst) / 100;
  const finalPriceWithGst = sellingPriceBeforeTax + taxAmount;

  const handleCopy = () => {
    const text = `Selling Price Breakdown:\nDirect Cost: ${formatIndianCurrency(dc)}\nOverheads: ${formatIndianCurrency(oh)}\nTotal Cost: ${formatIndianCurrency(totalCost)}\nTarget Margin: ${validMargin}%\nRecommended Pre-Tax Selling Price: ${formatIndianCurrency(sellingPriceBeforeTax)}\nProfit: ${formatIndianCurrency(profitPerUnit)}\nGST (${gst}%): ${formatIndianCurrency(taxAmount)}\nFinal Price with GST: ${formatIndianCurrency(finalPriceWithGst)}`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 28 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Direct Material & Labor Cost (₹)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={directCost}
            onChange={(e) => setDirectCost(e.target.value)}
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
            Overhead / Logistics / Pack per Unit (₹)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={overheadCost}
            onChange={(e) => setOverheadCost(e.target.value)}
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
            Desired Profit Margin (%)
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

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Applicable GST Slab (%)
          </label>
          <select
            value={gstRate}
            onChange={(e) => setGstRate(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 8,
              border: `1px solid ${bdr}`,
              background: inputBg,
              color: fg,
              fontSize: 15,
              fontWeight: 700,
              boxSizing: 'border-box'
            }}
          >
            <option value="0">0% (Nil)</option>
            <option value="5">5% (Textiles/Garments)</option>
            <option value="12">12% (Apparel & Yarn)</option>
            <option value="18">18% (Standard General)</option>
            <option value="28">28% (Luxury)</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Total Unit Cost</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{formatIndianCurrency(totalCost)}</div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Direct ₹{dc} + Overheads ₹{oh}</div>
        </div>

        <div style={{ background: dk ? 'rgba(16, 185, 129, 0.08)' : '#ecfdf5', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>Profit per Unit</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4, color: '#10b981' }}>
            +{formatIndianCurrency(profitPerUnit)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>{validMargin}% margin on sales</div>
        </div>

        <div style={{ background: dk ? `${acc}15` : `${acc}10`, border: `1px solid ${acc}40`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: acc, fontWeight: 800, textTransform: 'uppercase' }}>Base Selling Price</div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4, color: fg }}>
            {formatIndianCurrency(sellingPriceBeforeTax)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Price on B2B Invoice (Taxable)</div>
        </div>

        <div style={{ background: dk ? 'rgba(56, 189, 248, 0.08)' : '#f0f9ff', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>Price with GST ({gst}%)</div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4, color: fg }}>
            {formatIndianCurrency(finalPriceWithGst)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Consumer / MRP tag with GST</div>
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
          <span>{copied ? 'Copied Details' : 'Copy Selling Price Breakdown'}</span>
        </button>
      </div>
    </div>
  );
};
