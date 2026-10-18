import React, { useState } from 'react';
import { formatIndianCurrency, copyToClipboard } from '../../utils/formatters';
import { RotateCcw, Copy, Check } from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh (37)', 'Assam (18)', 'Bihar (10)', 'Chhattisgarh (22)', 'Delhi (07)',
  'Goa (30)', 'Gujarat (24)', 'Haryana (06)', 'Himachal Pradesh (02)', 'Jammu & Kashmir (01)',
  'Jharkhand (20)', 'Karnataka (29)', 'Kerala (32)', 'Madhya Pradesh (23)', 'Maharashtra (27)',
  'Odisha (21)', 'Punjab (03)', 'Rajasthan (08)', 'Tamil Nadu (33)', 'Telangana (36)',
  'Uttar Pradesh (09)', 'Uttarakhand (05)', 'West Bengal (19)'
];

export const CgstSgstIgstCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [baseAmount, setBaseAmount] = useState('25000');
  const [gstRate, setGstRate] = useState<number>(18);
  const [supplierState, setSupplierState] = useState('Gujarat (24)');
  const [buyerState, setBuyerState] = useState('Gujarat (24)');
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const isIntraState = supplierState === buyerState;
  const val = parseFloat(baseAmount) || 0;
  const totalTax = (val * gstRate) / 100;
  const cgst = isIntraState ? totalTax / 2 : 0;
  const sgst = isIntraState ? totalTax / 2 : 0;
  const igst = !isIntraState ? totalTax : 0;
  const grossTotal = val + totalTax;

  const handleCopy = () => {
    const text = `GST Tax Head Split:\nTransaction: ${isIntraState ? 'Intra-State (Local Supply)' : 'Inter-State (Inter-State Supply)'}\nSupplier: ${supplierState} -> Buyer: ${buyerState}\nBase Amount: ${formatIndianCurrency(val)}\nRate: ${gstRate}%\n${isIntraState ? `CGST (${gstRate / 2}%): ${formatIndianCurrency(cgst)}\nSGST (${gstRate / 2}%): ${formatIndianCurrency(sgst)}` : `IGST (${gstRate}%): ${formatIndianCurrency(igst)}`}\nTotal Invoice: ${formatIndianCurrency(grossTotal)}`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 28 }}>
        {/* Base Amount */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Taxable Base Amount (₹)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={baseAmount}
            onChange={(e) => setBaseAmount(e.target.value)}
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

        {/* GST Rate */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            GST Rate (%)
          </label>
          <select
            value={gstRate}
            onChange={(e) => setGstRate(Number(e.target.value))}
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
              <option key={r} value={r}>{r}% GST</option>
            ))}
          </select>
        </div>

        {/* Supplier State */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Supplier Location (State of Supply)
          </label>
          <select
            value={supplierState}
            onChange={(e) => setSupplierState(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 8,
              border: `1px solid ${bdr}`,
              background: inputBg,
              color: fg,
              fontSize: 13.5,
              boxSizing: 'border-box'
            }}
          >
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Buyer State */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Buyer Location (Place of Supply)
          </label>
          <select
            value={buyerState}
            onChange={(e) => setBuyerState(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 8,
              border: `1px solid ${bdr}`,
              background: inputBg,
              color: fg,
              fontSize: 13.5,
              boxSizing: 'border-box'
            }}
          >
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Banner */}
      <div style={{
        padding: '12px 18px',
        borderRadius: 8,
        background: isIntraState ? 'rgba(56, 189, 248, 0.12)' : 'rgba(232, 168, 56, 0.12)',
        border: `1px solid ${isIntraState ? 'rgba(56, 189, 248, 0.3)' : `${acc}40`}`,
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8
      }}>
        <div>
          <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: isIntraState ? '#0284c7' : acc }}>
            {isIntraState ? 'Intra-State Supply (Within Same State)' : 'Inter-State Supply (Different States)'}
          </span>
          <div style={{ fontSize: 13, color: fg, marginTop: 2 }}>
            {isIntraState
              ? `Both entities in ${supplierState}. Tax is equally divided into Central GST (CGST) and State GST (SGST).`
              : `Supplier in ${supplierState} & Buyer in ${buyerState}. Tax is charged 100% as Integrated GST (IGST).`}
          </div>
        </div>
        <span style={{
          fontSize: 11,
          fontWeight: 800,
          background: isIntraState ? '#0284c7' : acc,
          color: '#ffffff',
          padding: '4px 10px',
          borderRadius: 4
        }}>
          {isIntraState ? 'CGST + SGST' : 'IGST'}
        </span>
      </div>

      {/* Result Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${bdr}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Central GST (CGST)</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, color: isIntraState ? fg : fg2 }}>
            {formatIndianCurrency(cgst)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>
            {isIntraState ? `${gstRate / 2}% rate to Central Govt` : '0% (Not applicable for Inter-State)'}
          </div>
        </div>

        <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${bdr}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>State GST (SGST)</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, color: isIntraState ? fg : fg2 }}>
            {formatIndianCurrency(sgst)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>
            {isIntraState ? `${gstRate / 2}% rate to State Govt` : '0% (Not applicable for Inter-State)'}
          </div>
        </div>

        <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: `1px solid ${bdr}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Integrated GST (IGST)</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, color: !isIntraState ? acc : fg2 }}>
            {formatIndianCurrency(igst)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>
            {!isIntraState ? `${gstRate}% full rate to Central Fund` : '0% (Not applicable for Intra-State)'}
          </div>
        </div>

        <div style={{ background: dk ? `${acc}15` : `${acc}10`, border: `1px solid ${acc}40`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: acc, fontWeight: 800, textTransform: 'uppercase' }}>Gross Invoice Total</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4, color: fg }}>
            {formatIndianCurrency(grossTotal)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>
            Base ₹{formatIndianCurrency(val, false)} + Total Tax ₹{formatIndianCurrency(totalTax, false)}
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
          <span>{copied ? 'Copied Details' : 'Copy Split Breakdown'}</span>
        </button>
      </div>
    </div>
  );
};
