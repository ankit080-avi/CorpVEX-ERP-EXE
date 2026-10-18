import React, { useState, useMemo } from 'react';
import { formatIndianCurrency, copyToClipboard } from '../../utils/formatters';
import { RotateCcw, Copy, Check, Calculator } from 'lucide-react';

export const GstCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [amountStr, setAmountStr] = useState('10000');
  const [gstRate, setGstRate] = useState<number>(18);
  const [customRate, setCustomRate] = useState('');
  const [taxType, setTaxType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const effectiveRate = gstRate === -1 ? (parseFloat(customRate) || 0) : gstRate;
  const amount = parseFloat(amountStr) || 0;

  const result = useMemo(() => {
    if (amount <= 0) {
      return { netAmount: 0, gstAmount: 0, totalAmount: 0, cgst: 0, sgst: 0 };
    }

    if (taxType === 'exclusive') {
      const gstAmount = (amount * effectiveRate) / 100;
      const totalAmount = amount + gstAmount;
      return {
        netAmount: amount,
        gstAmount,
        totalAmount,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2
      };
    } else {
      // Inclusive
      const netAmount = (amount * 100) / (100 + effectiveRate);
      const gstAmount = amount - netAmount;
      return {
        netAmount,
        gstAmount,
        totalAmount: amount,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2
      };
    }
  }, [amount, effectiveRate, taxType]);

  const handleReset = () => {
    setAmountStr('10000');
    setGstRate(18);
    setCustomRate('');
    setTaxType('exclusive');
  };

  const handleCopy = () => {
    const summary = `GST Calculation (${taxType.toUpperCase()}):\nNet Amount: ${formatIndianCurrency(result.netAmount)}\nGST Rate: ${effectiveRate}%\nGST Amount: ${formatIndianCurrency(result.gstAmount)} (CGST: ${formatIndianCurrency(result.cgst)}, SGST: ${formatIndianCurrency(result.sgst)})\nTotal Invoice Value: ${formatIndianCurrency(result.totalAmount)}`;
    copyToClipboard(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const standardRates = [0, 3, 5, 12, 18, 28];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
        
        {/* Left: Inputs */}
        <div>
          {/* Tax Calculation Mode Toggle */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: fg2, marginBottom: 8 }}>
              CALCULATION MODE
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                type="button"
                onClick={() => setTaxType('exclusive')}
                style={{
                  padding: '11px',
                  borderRadius: 8,
                  border: `1px solid ${taxType === 'exclusive' ? acc : bdr}`,
                  background: taxType === 'exclusive' ? (dk ? `${acc}20` : `${acc}15`) : inputBg,
                  color: taxType === 'exclusive' ? acc : fg,
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: 'pointer'
                }}
              >
                GST Exclusive (Add Tax)
              </button>
              <button
                type="button"
                onClick={() => setTaxType('inclusive')}
                style={{
                  padding: '11px',
                  borderRadius: 8,
                  border: `1px solid ${taxType === 'inclusive' ? acc : bdr}`,
                  background: taxType === 'inclusive' ? (dk ? `${acc}20` : `${acc}15`) : inputBg,
                  color: taxType === 'inclusive' ? acc : fg,
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: 'pointer'
                }}
              >
                GST Inclusive (Remove Tax)
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: fg, marginBottom: 8 }}>
              {taxType === 'exclusive' ? 'Base / Net Amount (₹)' : 'Total Gross Invoice Amount (₹)'}
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: fg2 }}>
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="Enter amount"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 32px',
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

          {/* GST Rate Selection */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: fg, marginBottom: 8 }}>
              GST Rate (%)
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {standardRates.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setGstRate(r)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 6,
                    border: `1px solid ${gstRate === r ? acc : bdr}`,
                    background: gstRate === r ? acc : inputBg,
                    color: gstRate === r ? '#ffffff' : fg,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  {r}%
                </button>
              ))}
              <button
                type="button"
                onClick={() => setGstRate(-1)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 6,
                  border: `1px solid ${gstRate === -1 ? acc : bdr}`,
                  background: gstRate === -1 ? acc : inputBg,
                  color: gstRate === -1 ? '#ffffff' : fg,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Custom %
              </button>
            </div>

            {gstRate === -1 && (
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="Enter custom GST % (e.g. 0.25 or 12)"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `1px solid ${bdr}`,
                  background: inputBg,
                  color: fg,
                  fontSize: 14,
                  boxSizing: 'border-box'
                }}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleReset}
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 18px',
                borderRadius: 8,
                border: `1px solid ${bdr}`,
                background: dk ? 'rgba(255,255,255,0.04)' : '#f1f5f9',
                color: fg,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Right: Results Breakdown */}
        <div style={{
          background: dk ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc',
          border: `1px solid ${bdr}`,
          borderRadius: 12,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: fg2, textTransform: 'uppercase' }}>
                CALCULATED BREAKDOWN
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: acc, background: `${acc}15`, padding: '3px 8px', borderRadius: 4 }}>
                {effectiveRate}% GST
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Net Base Amount */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: `1px dashed ${bdr}` }}>
                <span style={{ color: fg2, fontSize: 14 }}>Net Base Amount</span>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{formatIndianCurrency(result.netAmount)}</span>
              </div>

              {/* Total GST Amount */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: `1px dashed ${bdr}` }}>
                <div>
                  <span style={{ color: fg2, fontSize: 14 }}>Total GST Amount</span>
                  <div style={{ fontSize: 11, color: fg2 }}>CGST (50%) + SGST (50%)</div>
                </div>
                <span style={{ fontWeight: 800, fontSize: 17, color: acc }}>+{formatIndianCurrency(result.gstAmount)}</span>
              </div>

              {/* CGST / SGST Split */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: dk ? 'rgba(0,0,0,0.2)' : '#ffffff', padding: '10px 14px', borderRadius: 8, border: `1px solid ${bdr}` }}>
                <div>
                  <div style={{ fontSize: 11, color: fg2, fontWeight: 600 }}>CGST ({effectiveRate / 2}%)</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{formatIndianCurrency(result.cgst)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: fg2, fontWeight: 600 }}>SGST ({effectiveRate / 2}%)</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{formatIndianCurrency(result.sgst)}</div>
                </div>
              </div>

              {/* Final Gross Amount */}
              <div style={{
                background: dk ? 'rgba(232, 168, 56, 0.08)' : 'rgba(217, 119, 6, 0.06)',
                padding: '16px',
                borderRadius: 10,
                border: `1px solid ${acc}40`,
                marginTop: 6
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: acc, textTransform: 'uppercase' }}>
                  Total Invoice Value (Gross)
                </div>
                <div style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 900, color: fg, marginTop: 4 }}>
                  {formatIndianCurrency(result.totalAmount)}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px',
              borderRadius: 8,
              border: 'none',
              background: acc,
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: 20
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Calculation Breakdown'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
