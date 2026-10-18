import React, { useState } from 'react';
import { formatIndianCurrency, copyToClipboard } from '../../utils/formatters';
import { Copy, Check, RotateCcw } from 'lucide-react';

interface TcsSection {
  id: string;
  name: string;
  rate: number;
  noPanRate: number;
  threshold: number;
  description: string;
}

const TCS_SECTIONS: TcsSection[] = [
  { id: '206C_1H', name: 'Sec 206C(1H): Sale of Goods (> ₹50L aggregate)', rate: 0.1, noPanRate: 1.0, threshold: 5000000, description: 'Collected by seller whose turnover exceeded ₹10 Cr in previous FY, on sale consideration exceeding ₹50 Lakhs in current FY.' },
  { id: '206C_SCRAP', name: 'Sec 206C(1): Scrap (Industrial / Textile / Metal)', rate: 1.0, noPanRate: 5.0, threshold: 0, description: '1% collected on all commercial sales of scrap, waste materials from manufacturing or mechanical working.' },
  { id: '206C_MINERALS', name: 'Sec 206C(1): Minerals, Coal & Iron Ore', rate: 1.0, noPanRate: 5.0, threshold: 0, description: '1% collected on sale of coal, lignite, iron ore and related mineral items.' },
  { id: '206C_TIMBER', name: 'Sec 206C(1): Timber & Forest Produce', rate: 2.5, noPanRate: 5.0, threshold: 0, description: '2.5% collected on timber obtained under a forest lease or other forest produce.' },
  { id: '206C_MOTOR', name: 'Sec 206C(1F): Motor Vehicle (> ₹10 Lakhs)', rate: 1.0, noPanRate: 5.0, threshold: 1000000, description: '1% collected by seller on sale of any motor vehicle value exceeding ₹10,00,000.' },
  { id: '206C_LRS', name: 'Sec 206C(1G): Overseas Tour Program Package / LRS', rate: 5.0, noPanRate: 20.0, threshold: 700000, description: '5% (or 20% on higher brackets) collected on overseas remittances and tour packages.' }
];

export const TcsCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [selectedSectionId, setSelectedSectionId] = useState('206C_SCRAP');
  const [invoiceAmount, setInvoiceAmount] = useState('150000');
  const [hasPan, setHasPan] = useState(true);
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const section = TCS_SECTIONS.find((s) => s.id === selectedSectionId) || TCS_SECTIONS[0];
  const amount = parseFloat(invoiceAmount) || 0;
  const rate = hasPan ? section.rate : section.noPanRate;

  const tcsAmount = (amount * rate) / 100;
  const grandTotal = amount + tcsAmount;

  const handleCopy = () => {
    const text = `TCS Calculation (${section.name}):\nInvoice Value: ${formatIndianCurrency(amount)}\nPAN Status: ${hasPan ? 'PAN Provided' : 'No PAN (Higher Rate)'}\nTCS Rate: ${rate}%\nTCS to Collect: ${formatIndianCurrency(tcsAmount)}\nTotal Amount to Collect from Buyer: ${formatIndianCurrency(grandTotal)}`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 24 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            TCS Provision / Nature of Goods
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
            {TCS_SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Invoice Value (Including GST) (₹)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={invoiceAmount}
            onChange={(e) => setInvoiceAmount(e.target.value)}
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
            Buyer's PAN Status
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
              PAN Available ({section.rate}%)
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
              No PAN ({section.noPanRate}%)
            </button>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 13, color: fg2, background: dk ? 'rgba(255,255,255,0.03)' : '#f8fafc', padding: '10px 14px', borderRadius: 8, border: `1px solid ${bdr}`, marginBottom: 24 }}>
        💡 <strong>Proviso:</strong> {section.description}
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Goods / Invoice Value</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{formatIndianCurrency(amount)}</div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Base value for TCS computation</div>
        </div>

        <div style={{ background: dk ? 'rgba(56, 189, 248, 0.08)' : '#f0f9ff', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>TCS Added to Invoice ({rate}%)</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4, color: '#0284c7' }}>
            +{formatIndianCurrency(tcsAmount)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Collected from buyer & paid to Govt</div>
        </div>

        <div style={{ background: dk ? `${acc}15` : `${acc}10`, border: `1px solid ${acc}40`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: acc, fontWeight: 800, textTransform: 'uppercase' }}>Total Amount to Collect</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4, color: fg }}>
            {formatIndianCurrency(grandTotal)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Grand total charged on final tax invoice</div>
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
          <span>{copied ? 'Copied Calculation' : 'Copy TCS Breakdown'}</span>
        </button>
      </div>
    </div>
  );
};
