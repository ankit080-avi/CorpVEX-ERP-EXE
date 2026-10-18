import React, { useState } from 'react';
import { formatIndianCurrency, copyToClipboard } from '../../utils/formatters';
import { Copy, Check, RotateCcw } from 'lucide-react';

export const CommissionCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [salesAmount, setSalesAmount] = useState('1250000');
  const [commissionRate, setCommissionRate] = useState('5');
  const [deductions, setDeductions] = useState('0');
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const sales = parseFloat(salesAmount) || 0;
  const rate = parseFloat(commissionRate) || 0;
  const ded = parseFloat(deductions) || 0;

  const grossCommission = (sales * rate) / 100;
  const netCommission = Math.max(0, grossCommission - ded);
  const netSalesProceeds = sales - netCommission;

  const handleCopy = () => {
    const text = `Commission Summary:\nTotal Deal/Sales Volume: ${formatIndianCurrency(sales)}\nCommission Rate: ${rate}%\nGross Commission: ${formatIndianCurrency(grossCommission)}\nNet Commission to Agent: ${formatIndianCurrency(netCommission)}\nNet Proceeds to Seller: ${formatIndianCurrency(netSalesProceeds)}`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 28 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Total Sales / Deal Amount (₹)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={salesAmount}
            onChange={(e) => setSalesAmount(e.target.value)}
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
            Commission Percentage (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="any"
            value={commissionRate}
            onChange={(e) => setCommissionRate(e.target.value)}
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
            Deductions / Processing Fees (₹)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
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

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: dk ? 'rgba(16, 185, 129, 0.08)' : '#ecfdf5', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>Net Commission to Agent</div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4, color: '#10b981' }}>
            {formatIndianCurrency(netCommission)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>{rate}% commission after deductions</div>
        </div>

        <div style={{ background: dk ? `${acc}15` : `${acc}10`, border: `1px solid ${acc}40`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: acc, fontWeight: 800, textTransform: 'uppercase' }}>Net Proceeds to Seller</div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4, color: fg }}>
            {formatIndianCurrency(netSalesProceeds)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Gross sales minus commission payout</div>
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
          <span>{copied ? 'Copied Details' : 'Copy Commission Summary'}</span>
        </button>
      </div>
    </div>
  );
};
