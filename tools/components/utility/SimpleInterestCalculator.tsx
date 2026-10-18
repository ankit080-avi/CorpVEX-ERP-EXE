import React, { useState } from 'react';
import { formatIndianCurrency, copyToClipboard } from '../../utils/formatters';
import { Copy, Check, RotateCcw } from 'lucide-react';

export const SimpleInterestCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('8.5');
  const [timeValue, setTimeValue] = useState('3');
  const [timeUnit, setTimeUnit] = useState<'years' | 'months' | 'days'>('years');
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const P = parseFloat(principal) || 0;
  const R = parseFloat(rate) || 0;
  const tNum = parseFloat(timeValue) || 0;

  let timeInYears = tNum;
  if (timeUnit === 'months') {
    timeInYears = tNum / 12;
  } else if (timeUnit === 'days') {
    timeInYears = tNum / 365;
  }

  const interest = (P * R * timeInYears) / 100;
  const totalMaturity = P + interest;

  const handleCopy = () => {
    const text = `Simple Interest Calculation:\nPrincipal (P): ${formatIndianCurrency(P)}\nAnnual Rate (R): ${R}%\nTime Period (T): ${tNum} ${timeUnit} (${timeInYears.toFixed(2)} Years)\nCalculated Simple Interest: ${formatIndianCurrency(interest)}\nTotal Maturity Amount: ${formatIndianCurrency(totalMaturity)}`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 28 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Principal Investment / Loan (₹)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Annual Rate of Interest (% p.a.)
          </label>
          <input
            type="number"
            min="0.01"
            step="any"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: fg }}>Time Duration</label>
            <select
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value as any)}
              style={{ padding: '2px 8px', borderRadius: 4, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 11, fontWeight: 700 }}
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
              <option value="days">Days</option>
            </select>
          </div>
          <input
            type="number"
            min="0.1"
            step="any"
            value={timeValue}
            onChange={(e) => setTimeValue(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 12, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Principal Deposited</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>{formatIndianCurrency(P)}</div>
        </div>

        <div style={{ background: dk ? 'rgba(16, 185, 129, 0.08)' : '#ecfdf5', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 12, color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>Total Simple Interest</div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4, color: '#10b981' }}>
            +{formatIndianCurrency(interest)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Earned at {R}% for {timeInYears.toFixed(2)} years</div>
        </div>

        <div style={{ background: dk ? `${acc}15` : `${acc}10`, border: `1px solid ${acc}40`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 12, color: acc, fontWeight: 800, textTransform: 'uppercase' }}>Total Maturity Amount</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4, color: fg }}>
            {formatIndianCurrency(totalMaturity)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Principal + Total Simple Interest</div>
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
          <span>{copied ? 'Copied Details' : 'Copy Interest Calculation'}</span>
        </button>
      </div>
    </div>
  );
};
