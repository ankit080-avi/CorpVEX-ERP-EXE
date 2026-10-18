import React, { useState } from 'react';
import { formatIndianCurrency, copyToClipboard } from '../../utils/formatters';
import { Copy, Check, Info } from 'lucide-react';

interface TdsSection {
  id: string;
  name: string;
  standardRate: number;
  individualRate?: number;
  threshold: number;
  description: string;
}

const TDS_SECTIONS: TdsSection[] = [
  { id: '194C', name: 'Sec 194C: Contractor & Subcontractor', standardRate: 2, individualRate: 1, threshold: 30000, description: '1% for Individual/HUF, 2% for Companies/Firms. Single payment > ₹30,000 or annual > ₹1,00,000.' },
  { id: '194J_P', name: 'Sec 194J: Professional Fees', standardRate: 10, threshold: 30000, description: '10% on legal, medical, engineering, accounting, architectural services > ₹30,000/year.' },
  { id: '194J_T', name: 'Sec 194J: Technical Services & Royalty', standardRate: 2, threshold: 30000, description: '2% on technical services, call center operations, FTS > ₹30,000/year.' },
  { id: '194I_B', name: 'Sec 194I: Rent of Land, Building & Furniture', standardRate: 10, threshold: 240000, description: '10% deduction on commercial/residential rent exceeding ₹2,40,000 per financial year.' },
  { id: '194I_M', name: 'Sec 194I: Rent of Plant & Machinery', standardRate: 2, threshold: 240000, description: '2% deduction on equipment, plant, generator or machinery hire exceeding ₹2,40,000/yr.' },
  { id: '194H', name: 'Sec 194H: Commission or Brokerage', standardRate: 5, threshold: 15000, description: '5% on agent commissions, sales brokerages exceeding ₹15,000 per financial year.' },
  { id: '194Q', name: 'Sec 194Q: Purchase of Goods (> ₹50L)', standardRate: 0.1, threshold: 5000000, description: '0.1% by buyer with turnover > ₹10 Cr purchasing goods from seller exceeding ₹50 Lakhs.' }
];

export const TdsCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [selectedSectionId, setSelectedSectionId] = useState('194C');
  const [billAmount, setBillAmount] = useState('85000');
  const [deducteeType, setDeducteeType] = useState<'individual' | 'company'>('individual');
  const [hasPan, setHasPan] = useState(true);
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const section = TDS_SECTIONS.find((s) => s.id === selectedSectionId) || TDS_SECTIONS[0];
  const amount = parseFloat(billAmount) || 0;

  // Rate determination
  let rate = section.standardRate;
  if (section.id === '194C' && deducteeType === 'individual' && section.individualRate) {
    rate = section.individualRate;
  }

  // Section 206AA penalty rate if no PAN (typically 20%)
  if (!hasPan) {
    rate = 20;
  }

  const tdsAmount = (amount * rate) / 100;
  const netPayable = amount - tdsAmount;
  const isBelowThreshold = amount < section.threshold;

  const handleCopy = () => {
    const text = `TDS Calculation (${section.name}):\nBill Amount: ${formatIndianCurrency(amount)}\nPAN Status: ${hasPan ? 'Available' : 'NOT Available (Sec 206AA)'}\nTDS Rate: ${rate}%\nTDS Deducted: ${formatIndianCurrency(tdsAmount)}\nNet Amount Payable to Party: ${formatIndianCurrency(netPayable)}`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 24 }}>
        {/* Section Picker */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Select TDS Section
          </label>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
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
            {TDS_SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Bill Amount */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Gross Bill / Transaction Value (₹)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
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

        {/* Deductee Entity Type (for 194C) */}
        {section.id === '194C' && (
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
              Payee Constitution
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                type="button"
                onClick={() => setDeducteeType('individual')}
                style={{
                  padding: '11px',
                  borderRadius: 8,
                  border: `1px solid ${deducteeType === 'individual' ? acc : bdr}`,
                  background: deducteeType === 'individual' ? (dk ? `${acc}20` : `${acc}15`) : inputBg,
                  color: deducteeType === 'individual' ? acc : fg,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Individual / HUF (1%)
              </button>
              <button
                type="button"
                onClick={() => setDeducteeType('company')}
                style={{
                  padding: '11px',
                  borderRadius: 8,
                  border: `1px solid ${deducteeType === 'company' ? acc : bdr}`,
                  background: deducteeType === 'company' ? (dk ? `${acc}20` : `${acc}15`) : inputBg,
                  color: deducteeType === 'company' ? acc : fg,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Company / Firm (2%)
              </button>
            </div>
          </div>
        )}

        {/* Valid PAN Toggle */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            PAN Status of Payee
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => setHasPan(true)}
              style={{
                padding: '11px',
                borderRadius: 8,
                border: `1px solid ${hasPan ? '#10b981' : bdr}`,
                background: hasPan ? '#10b98120' : inputBg,
                color: hasPan ? '#10b981' : fg,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Valid PAN Available
            </button>
            <button
              type="button"
              onClick={() => setHasPan(false)}
              style={{
                padding: '11px',
                borderRadius: 8,
                border: `1px solid ${!hasPan ? '#ef4444' : bdr}`,
                background: !hasPan ? '#ef444420' : inputBg,
                color: !hasPan ? '#ef4444' : fg,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              No PAN (20% Sec 206AA)
            </button>
          </div>
        </div>
      </div>

      {/* Section info description */}
      <div style={{ fontSize: 13, color: fg2, background: dk ? 'rgba(255,255,255,0.03)' : '#f8fafc', padding: '10px 14px', borderRadius: 8, border: `1px solid ${bdr}`, marginBottom: 24 }}>
        💡 <strong>Threshold & Scope:</strong> {section.description}
      </div>

      {/* Result Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Gross Bill Amount</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{formatIndianCurrency(amount)}</div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Before tax deduction</div>
        </div>

        <div style={{ background: dk ? 'rgba(239, 68, 68, 0.08)' : '#fef2f2', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 800, textTransform: 'uppercase' }}>TDS to Deduct ({rate}%)</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4, color: '#ef4444' }}>
            -{formatIndianCurrency(tdsAmount)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Deposit with Govt (Challan 281)</div>
        </div>

        <div style={{ background: dk ? 'rgba(16, 185, 129, 0.08)' : '#ecfdf5', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>Net Payment to Party</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4, color: fg }}>
            {formatIndianCurrency(netPayable)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Net cheque / NEFT / RTGS transfer</div>
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
          <span>{copied ? 'Copied Calculation' : 'Copy TDS Summary'}</span>
        </button>
      </div>
    </div>
  );
};
