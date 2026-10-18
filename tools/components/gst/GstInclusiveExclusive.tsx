import React, { useState } from 'react';
import { formatIndianCurrency, copyToClipboard } from '../../utils/formatters';
import { RotateCcw, Copy, Check } from 'lucide-react';

export const GstInclusiveExclusive: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [amount, setAmount] = useState('50000');
  const [rate, setRate] = useState<number>(18);
  const [copied, setCopied] = useState<string | null>(null);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const val = parseFloat(amount) || 0;

  // Mode A: Input as Exclusive (Base) -> Calculate Gross
  const exclusiveTax = (val * rate) / 100;
  const exclusiveTotal = val + exclusiveTax;

  // Mode B: Input as Inclusive (Gross) -> Extract Base
  const inclusiveBase = (val * 100) / (100 + rate);
  const inclusiveTax = val - inclusiveBase;

  const handleCopy = (type: 'ex' | 'in') => {
    let text = '';
    if (type === 'ex') {
      text = `GST Exclusive Analysis for ₹${val}:\nBase: ${formatIndianCurrency(val)}\nTax (${rate}%): ${formatIndianCurrency(exclusiveTax)}\nGross Total: ${formatIndianCurrency(exclusiveTotal)}`;
    } else {
      text = `GST Inclusive Analysis for ₹${val}:\nGross: ${formatIndianCurrency(val)}\nExtracted Base: ${formatIndianCurrency(inclusiveBase)}\nTax Portion (${rate}%): ${formatIndianCurrency(inclusiveTax)}`;
    }
    copyToClipboard(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      {/* Top Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Transaction Amount (₹)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
            Applicable GST Rate (%)
          </label>
          <select
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
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
            {[0, 3, 5, 12, 18, 28].map((r) => (
              <option key={r} value={r}>{r}% Standard Slab</option>
            ))}
          </select>
        </div>
      </div>

      {/* Side by Side Comparative Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        
        {/* Scenario 1: Exclusive */}
        <div style={{
          background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff',
          border: `1px solid ${bdr}`,
          borderRadius: 12,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#38bdf8', background: '#38bdf820', padding: '3px 8px', borderRadius: 4, marginBottom: 12, textTransform: 'uppercase' }}>
              SCENARIO A • GST EXCLUSIVE
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
              If ₹{formatIndianCurrency(val, false)} is Net of Tax
            </div>
            <p style={{ fontSize: 13, color: fg2, marginBottom: 20 }}>
              Tax is added ON TOP of your base price. You bill your customer the base price plus {rate}% GST.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: `1px solid ${bdr}`, paddingTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: fg2, fontSize: 13.5 }}>Base Price (Your Revenue)</span>
                <span style={{ fontWeight: 700 }}>{formatIndianCurrency(val)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: fg2, fontSize: 13.5 }}>GST Added ({rate}%)</span>
                <span style={{ fontWeight: 700, color: acc }}>+{formatIndianCurrency(exclusiveTax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px dashed ${bdr}`, paddingTop: 10, fontSize: 16, fontWeight: 800 }}>
                <span>Final Billing Total:</span>
                <span style={{ color: fg }}>{formatIndianCurrency(exclusiveTotal)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleCopy('ex')}
            style={{
              marginTop: 20,
              padding: '10px',
              borderRadius: 8,
              border: `1px solid ${bdr}`,
              background: dk ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
              color: fg,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            {copied === 'ex' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied === 'ex' ? 'Copied' : 'Copy Scenario A'}</span>
          </button>
        </div>

        {/* Scenario 2: Inclusive */}
        <div style={{
          background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff',
          border: `1px solid ${bdr}`,
          borderRadius: 12,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#10b981', background: '#10b98120', padding: '3px 8px', borderRadius: 4, marginBottom: 12, textTransform: 'uppercase' }}>
              SCENARIO B • GST INCLUSIVE (MRP)
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
              If ₹{formatIndianCurrency(val, false)} includes GST
            </div>
            <p style={{ fontSize: 13, color: fg2, marginBottom: 20 }}>
              Tax is already packed inside the total price. Back-calculate your actual pre-tax revenue.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: `1px solid ${bdr}`, paddingTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: fg2, fontSize: 13.5 }}>Extracted Net Revenue</span>
                <span style={{ fontWeight: 700 }}>{formatIndianCurrency(inclusiveBase)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: fg2, fontSize: 13.5 }}>Embedded GST ({rate}%)</span>
                <span style={{ fontWeight: 700, color: acc }}>{formatIndianCurrency(inclusiveTax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px dashed ${bdr}`, paddingTop: 10, fontSize: 16, fontWeight: 800 }}>
                <span>Collected From Customer:</span>
                <span style={{ color: fg }}>{formatIndianCurrency(val)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleCopy('in')}
            style={{
              marginTop: 20,
              padding: '10px',
              borderRadius: 8,
              border: `1px solid ${bdr}`,
              background: dk ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
              color: fg,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            {copied === 'in' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied === 'in' ? 'Copied' : 'Copy Scenario B'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
