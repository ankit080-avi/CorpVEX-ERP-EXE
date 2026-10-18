import React, { useState, useMemo } from 'react';
import { formatIndianCurrency, copyToClipboard } from '../../utils/formatters';
import { Copy, Check, RotateCcw } from 'lucide-react';

export const DiscountCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [originalPrice, setOriginalPrice] = useState('4500');
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent');
  const [discountValue, setDiscountValue] = useState('20');
  const [hasSecondDiscount, setHasSecondDiscount] = useState(false);
  const [secondDiscountPercent, setSecondDiscountPercent] = useState('10');
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const orig = parseFloat(originalPrice) || 0;
  const disc = parseFloat(discountValue) || 0;
  const secondDisc = parseFloat(secondDiscountPercent) || 0;

  const results = useMemo(() => {
    let firstDiscountAmount = 0;
    if (discountType === 'percent') {
      firstDiscountAmount = (orig * disc) / 100;
    } else {
      firstDiscountAmount = Math.min(disc, orig);
    }

    let priceAfterFirst = orig - firstDiscountAmount;
    let secondDiscountAmount = 0;

    if (hasSecondDiscount && secondDisc > 0) {
      secondDiscountAmount = (priceAfterFirst * secondDisc) / 100;
    }

    const finalPrice = Math.max(0, priceAfterFirst - secondDiscountAmount);
    const totalSavings = orig - finalPrice;
    const effectivePercent = orig > 0 ? (totalSavings / orig) * 100 : 0;

    return {
      firstDiscountAmount,
      secondDiscountAmount,
      totalSavings,
      finalPrice,
      effectivePercent
    };
  }, [orig, disc, discountType, hasSecondDiscount, secondDisc]);

  const handleCopy = () => {
    const text = `Discount Summary:\nOriginal Price: ${formatIndianCurrency(orig)}\nPrimary Discount: ${discountType === 'percent' ? `${disc}%` : formatIndianCurrency(disc)} (-${formatIndianCurrency(results.firstDiscountAmount)})\n${hasSecondDiscount ? `Additional Stacked Discount: ${secondDisc}% (-${formatIndianCurrency(results.secondDiscountAmount)})\n` : ''}Final Net Price: ${formatIndianCurrency(results.finalPrice)}\nTotal Saved: ${formatIndianCurrency(results.totalSavings)} (${results.effectivePercent.toFixed(2)}% effective discount)`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 24 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Original List Price (MRP) (₹)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
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
            Discount Mode
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => setDiscountType('percent')}
              style={{
                padding: '11px',
                borderRadius: 8,
                border: `1px solid ${discountType === 'percent' ? acc : bdr}`,
                background: discountType === 'percent' ? (dk ? `${acc}20` : `${acc}15`) : inputBg,
                color: discountType === 'percent' ? acc : fg,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Percentage (%)
            </button>
            <button
              type="button"
              onClick={() => setDiscountType('flat')}
              style={{
                padding: '11px',
                borderRadius: 8,
                border: `1px solid ${discountType === 'flat' ? acc : bdr}`,
                background: discountType === 'flat' ? (dk ? `${acc}20` : `${acc}15`) : inputBg,
                color: discountType === 'flat' ? acc : fg,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Flat Value (₹)
            </button>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            {discountType === 'percent' ? 'Discount Percentage (%)' : 'Flat Discount Off (₹)'}
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
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

      {/* Stacked Discount Checkbox */}
      <div style={{ marginBottom: 28, padding: 14, borderRadius: 8, background: dk ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${bdr}` }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={hasSecondDiscount}
            onChange={(e) => setHasSecondDiscount(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: acc }}
          />
          <span>Add Stacked / Additional Seasonal Discount (e.g. "20% + Extra 10% Off")</span>
        </label>

        {hasSecondDiscount && (
          <div style={{ marginTop: 12, maxWidth: 260 }}>
            <label style={{ display: 'block', fontSize: 12, color: fg2, marginBottom: 4 }}>
              Additional Discount (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={secondDiscountPercent}
              onChange={(e) => setSecondDiscountPercent(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 6,
                border: `1px solid ${bdr}`,
                background: inputBg,
                color: fg,
                fontSize: 14,
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}
      </div>

      {/* Results Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Original Price</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{formatIndianCurrency(orig)}</div>
        </div>

        <div style={{ background: dk ? 'rgba(16, 185, 129, 0.08)' : '#ecfdf5', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>Total Savings</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4, color: '#10b981' }}>
            {formatIndianCurrency(results.totalSavings)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>{results.effectivePercent.toFixed(1)}% total effective discount</div>
        </div>

        <div style={{ background: dk ? `${acc}15` : `${acc}10`, border: `1px solid ${acc}40`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: acc, fontWeight: 800, textTransform: 'uppercase' }}>Final Net Price to Pay</div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4, color: fg }}>
            {formatIndianCurrency(results.finalPrice)}
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
          <span>{copied ? 'Copied Details' : 'Copy Discount Breakdown'}</span>
        </button>
      </div>
    </div>
  );
};
