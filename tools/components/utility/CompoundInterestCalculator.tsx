import React, { useState } from 'react';
import { formatIndianCurrency, copyToClipboard } from '../../utils/formatters';
import { Copy, Check, RotateCcw } from 'lucide-react';

export const CompoundInterestCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('10');
  const [timeYears, setTimeYears] = useState('5');
  const [frequency, setFrequency] = useState<'1' | '2' | '4' | '12' | '365'>('12');
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';
  const cardBg = dk ? 'rgba(255,255,255,0.03)' : '#f8fafc';

  const P = parseFloat(principal) || 0;
  const R = parseFloat(rate) || 0;
  const T = parseFloat(timeYears) || 0;
  const N = parseInt(frequency, 10) || 1;

  // Formula: A = P * (1 + (r / (n * 100)))^(n * t)
  const rateDecimal = R / 100;
  const maturity = P > 0 && R >= 0 && T > 0 ? P * Math.pow(1 + rateDecimal / N, N * T) : P;
  const totalInterest = Math.max(0, maturity - P);

  // Frequency labels
  const freqLabels: Record<string, string> = {
    '1': 'Annually (Once a year)',
    '2': 'Semi-Annually (Twice a year)',
    '4': 'Quarterly (Every 3 months)',
    '12': 'Monthly (12 times a year)',
    '365': 'Daily (365 times a year)',
  };

  // Year-by-year schedule (up to 30 years to keep performance snappy)
  const scheduleYears = Math.min(Math.ceil(T), 30);
  const yearlySchedule = [];
  let currentBalance = P;

  for (let yr = 1; yr <= scheduleYears; yr++) {
    const yrT = yr;
    const balanceAtEnd = P * Math.pow(1 + rateDecimal / N, N * yrT);
    const yrInterest = balanceAtEnd - currentBalance;
    yearlySchedule.push({
      year: yr,
      openingBalance: currentBalance,
      interestEarned: yrInterest,
      closingBalance: balanceAtEnd,
    });
    currentBalance = balanceAtEnd;
  }

  const handleCopy = () => {
    const text = `Compound Interest Calculation:\nPrincipal Amount: ${formatIndianCurrency(P)}\nAnnual Interest Rate: ${R}%\nTime Horizon: ${T} Years\nCompounding: ${freqLabels[frequency]}\nTotal Compound Interest: ${formatIndianCurrency(totalInterest)}\nTotal Maturity Value: ${formatIndianCurrency(maturity)}`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPrincipal('100000');
    setRate('10');
    setTimeYears('5');
    setFrequency('12');
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Initial Principal (₹)
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
            min="0"
            max="100"
            step="0.05"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Investment Horizon (Years)
          </label>
          <input
            type="number"
            min="0.1"
            max="50"
            step="0.5"
            value={timeYears}
            onChange={(e) => setTimeYears(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Compounding Frequency
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as any)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 14, fontWeight: 600, boxSizing: 'border-box' }}
          >
            <option value="1">Annually (Once / yr)</option>
            <option value="2">Semi-Annually (2x / yr)</option>
            <option value="4">Quarterly (4x / yr)</option>
            <option value="12">Monthly (12x / yr)</option>
            <option value="365">Daily (365x / yr)</option>
          </select>
        </div>
      </div>

      {/* Result cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div style={{ padding: '20px', borderRadius: 12, border: `1px solid ${bdr}`, background: cardBg }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: fg2, textTransform: 'uppercase', letterSpacing: 0.5 }}>Invested Principal</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: fg, marginTop: 6 }}>{formatIndianCurrency(P)}</div>
          <div style={{ fontSize: 12, color: fg2, marginTop: 4 }}>Initial capital deployed</div>
        </div>

        <div style={{ padding: '20px', borderRadius: 12, border: `1px solid ${bdr}`, background: cardBg }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: fg2, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Compound Interest</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#10b981', marginTop: 6 }}>+{formatIndianCurrency(totalInterest)}</div>
          <div style={{ fontSize: 12, color: fg2, marginTop: 4 }}>
            {P > 0 ? `${((totalInterest / P) * 100).toFixed(1)}% total returns` : '0%'}
          </div>
        </div>

        <div style={{ padding: '20px', borderRadius: 12, border: `1px solid ${acc}`, background: dk ? 'rgba(232,168,56,0.08)' : 'rgba(217,119,6,0.08)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: acc, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Maturity Value</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: acc, marginTop: 6 }}>{formatIndianCurrency(maturity)}</div>
          <div style={{ fontSize: 12, color: fg2, marginTop: 4 }}>After {T} years ({freqLabels[frequency].split(' ')[0]})</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <button
          onClick={handleCopy}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 8,
            background: acc,
            color: '#ffffff',
            border: 'none',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied to Clipboard' : 'Copy Calculation'}
        </button>

        <button
          onClick={handleReset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 8,
            background: 'transparent',
            color: fg2,
            border: `1px solid ${bdr}`,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Year by Year Growth Breakdown */}
      {yearlySchedule.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h4 style={{ fontSize: 16, fontWeight: 700, color: fg, marginBottom: 12 }}>
            Annual Growth Breakdown ({yearlySchedule.length} Years)
          </h4>
          <div style={{ overflowX: 'auto', border: `1px solid ${bdr}`, borderRadius: 10 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: dk ? 'rgba(255,255,255,0.05)' : '#f1f5f9', borderBottom: `1px solid ${bdr}` }}>
                  <th style={{ padding: '10px 14px', color: fg, fontWeight: 700 }}>Year</th>
                  <th style={{ padding: '10px 14px', color: fg, fontWeight: 700 }}>Opening Balance</th>
                  <th style={{ padding: '10px 14px', color: fg, fontWeight: 700 }}>Interest Earned</th>
                  <th style={{ padding: '10px 14px', color: fg, fontWeight: 700 }}>Closing Balance</th>
                </tr>
              </thead>
              <tbody>
                {yearlySchedule.map((row) => (
                  <tr key={row.year} style={{ borderBottom: `1px solid ${bdr}` }}>
                    <td style={{ padding: '10px 14px', color: fg, fontWeight: 600 }}>Year {row.year}</td>
                    <td style={{ padding: '10px 14px', color: fg2 }}>{formatIndianCurrency(row.openingBalance)}</td>
                    <td style={{ padding: '10px 14px', color: '#10b981', fontWeight: 600 }}>+{formatIndianCurrency(row.interestEarned)}</td>
                    <td style={{ padding: '10px 14px', color: fg, fontWeight: 700 }}>{formatIndianCurrency(row.closingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
