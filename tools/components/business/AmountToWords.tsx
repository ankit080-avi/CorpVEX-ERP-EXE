import React, { useState } from 'react';
import { numberToWordsIndian, numberToWordsInternational, copyToClipboard, formatIndianCurrency } from '../../utils/formatters';
import { Copy, Check, RotateCcw } from 'lucide-react';

export const AmountToWords: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [numInput, setNumInput] = useState('1485250.50');
  const [system, setSystem] = useState<'indian' | 'international'>('indian');
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'NONE'>('INR');
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const val = parseFloat(numInput) || 0;

  let mainUnit = 'Rupees';
  let subUnit = 'Paise';
  if (currency === 'USD') {
    mainUnit = 'Dollars';
    subUnit = 'Cents';
  } else if (currency === 'NONE') {
    mainUnit = '';
    subUnit = '';
  }

  const words = system === 'indian'
    ? numberToWordsIndian(val, mainUnit, subUnit)
    : numberToWordsInternational(val, mainUnit, subUnit);

  const handleCopy = () => {
    copyToClipboard(words);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 24 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Enter Numeric Amount
          </label>
          <input
            type="number"
            step="any"
            value={numInput}
            onChange={(e) => setNumInput(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 8,
              border: `1px solid ${bdr}`,
              background: inputBg,
              color: fg,
              fontSize: 18,
              fontWeight: 800,
              boxSizing: 'border-box'
            }}
          />
          <div style={{ fontSize: 12, color: fg2, marginTop: 6 }}>
            Formatted: {formatIndianCurrency(val)}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Numbering Format
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => setSystem('indian')}
              style={{
                padding: '11px',
                borderRadius: 8,
                border: `1px solid ${system === 'indian' ? acc : bdr}`,
                background: system === 'indian' ? (dk ? `${acc}20` : `${acc}15`) : inputBg,
                color: system === 'indian' ? acc : fg,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Indian (Lakh / Crore)
            </button>
            <button
              type="button"
              onClick={() => setSystem('international')}
              style={{
                padding: '11px',
                borderRadius: 8,
                border: `1px solid ${system === 'international' ? acc : bdr}`,
                background: system === 'international' ? (dk ? `${acc}20` : `${acc}15`) : inputBg,
                color: system === 'international' ? acc : fg,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              International (Million)
            </button>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Currency Denomination
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 8,
              border: `1px solid ${bdr}`,
              background: inputBg,
              color: fg,
              fontSize: 14,
              fontWeight: 700,
              boxSizing: 'border-box'
            }}
          >
            <option value="INR">Indian Rupee (INR - Rupees & Paise)</option>
            <option value="USD">US Dollar (USD - Dollars & Cents)</option>
            <option value="NONE">Plain Number (Without Currency)</option>
          </select>
        </div>
      </div>

      {/* Result Display Card */}
      <div style={{
        background: dk ? 'rgba(232, 168, 56, 0.08)' : '#fffbeb',
        border: `1px solid ${acc}40`,
        borderRadius: 12,
        padding: '24px 28px',
        marginBottom: 24
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: acc, textTransform: 'uppercase', marginBottom: 8 }}>
          AMOUNT IN WORDS (CHEQUE / INVOICE READY)
        </div>
        <div style={{
          fontSize: 'clamp(20px, 2.8vw, 28px)',
          fontWeight: 800,
          color: fg,
          lineHeight: 1.4,
          fontFamily: 'serif'
        }}>
          "{words}"
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
            padding: '12px 24px',
            borderRadius: 8,
            border: 'none',
            background: acc,
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Amount in Words'}</span>
        </button>

        <button
          onClick={() => setNumInput('')}
          type="button"
          style={{
            padding: '12px 20px',
            borderRadius: 8,
            border: `1px solid ${bdr}`,
            background: dk ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
            color: fg,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};
