import React, { useState, useMemo } from 'react';
import { formatIndianCurrency, formatNumber, copyToClipboard } from '../../utils/formatters';
import { Copy, Check, RotateCcw } from 'lucide-react';

export const EmiCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [loanAmount, setLoanAmount] = useState('2500000');
  const [interestRate, setInterestRate] = useState('9.5');
  const [tenureYears, setTenureYears] = useState('5');
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [showSchedule, setShowSchedule] = useState(false);
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const P = parseFloat(loanAmount) || 0;
  const annualRate = parseFloat(interestRate) || 0;
  const tenureInput = parseFloat(tenureYears) || 0;
  const totalMonths = tenureType === 'years' ? tenureInput * 12 : tenureInput;

  const results = useMemo(() => {
    if (P <= 0 || annualRate <= 0 || totalMonths <= 0) {
      return { emi: 0, totalInterest: 0, totalPayment: P, schedule: [] };
    }

    const r = annualRate / 12 / 100;
    const emi = (P * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - P;

    // Yearly schedule
    const schedule: Array<{ year: number; principalPaid: number; interestPaid: number; balance: number }> = [];
    let balance = P;
    const yearsCount = Math.ceil(totalMonths / 12);

    for (let y = 1; y <= yearsCount; y++) {
      let yearPrincipal = 0;
      let yearInterest = 0;
      const monthsInThisYear = Math.min(12, totalMonths - (y - 1) * 12);

      for (let m = 1; m <= monthsInThisYear; m++) {
        const monthlyInterest = balance * r;
        const monthlyPrincipal = emi - monthlyInterest;
        yearPrincipal += monthlyPrincipal;
        yearInterest += monthlyInterest;
        balance = Math.max(0, balance - monthlyPrincipal);
      }

      schedule.push({
        year: y,
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        balance
      });
    }

    return {
      emi,
      totalInterest,
      totalPayment,
      schedule
    };
  }, [P, annualRate, totalMonths]);

  const handleCopy = () => {
    const text = `Loan EMI Calculation:\nLoan Principal: ${formatIndianCurrency(P)}\nAnnual Interest Rate: ${annualRate}%\nTenure: ${totalMonths} Months (${(totalMonths / 12).toFixed(1)} Years)\nMonthly EMI: ${formatIndianCurrency(results.emi)}\nTotal Interest Payable: ${formatIndianCurrency(results.totalInterest)}\nTotal Amount Payable: ${formatIndianCurrency(results.totalPayment)}`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 28 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Loan Principal Amount (₹)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
            Annual Interest Rate (% p.a.)
          </label>
          <input
            type="number"
            min="0.1"
            max="40"
            step="any"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: fg }}>
              Loan Tenure
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                type="button"
                onClick={() => setTenureType('years')}
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  border: `1px solid ${tenureType === 'years' ? acc : bdr}`,
                  background: tenureType === 'years' ? acc : 'transparent',
                  color: tenureType === 'years' ? '#fff' : fg2,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Years
              </button>
              <button
                type="button"
                onClick={() => setTenureType('months')}
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  border: `1px solid ${tenureType === 'months' ? acc : bdr}`,
                  background: tenureType === 'months' ? acc : 'transparent',
                  color: tenureType === 'months' ? '#fff' : fg2,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Months
              </button>
            </div>
          </div>
          <input
            type="number"
            min="1"
            value={tenureYears}
            onChange={(e) => setTenureYears(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: dk ? `${acc}15` : `${acc}10`, border: `1px solid ${acc}40`, borderRadius: 10, padding: 22 }}>
          <div style={{ fontSize: 12, color: acc, fontWeight: 800, textTransform: 'uppercase' }}>Monthly Loan EMI</div>
          <div style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 900, marginTop: 4, color: fg }}>
            {formatIndianCurrency(results.emi)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Equated monthly payment</div>
        </div>

        <div style={{ background: dk ? 'rgba(239, 68, 68, 0.08)' : '#fef2f2', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 10, padding: 22 }}>
          <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 800, textTransform: 'uppercase' }}>Total Interest Payable</div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4, color: '#ef4444' }}>
            {formatIndianCurrency(results.totalInterest)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Total financing cost over tenure</div>
        </div>

        <div style={{ background: dk ? 'rgba(56, 189, 248, 0.08)' : '#f0f9ff', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 10, padding: 22 }}>
          <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>Total Repayment</div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4, color: fg }}>
            {formatIndianCurrency(results.totalPayment)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Principal + Total Interest</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
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
          <span>{copied ? 'Copied Details' : 'Copy Loan EMI Summary'}</span>
        </button>

        <button
          onClick={() => setShowSchedule(!showSchedule)}
          type="button"
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            border: `1px solid ${bdr}`,
            background: dk ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
            color: fg,
            fontSize: 13.5,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {showSchedule ? 'Hide Amortization Schedule' : 'View Year-wise Amortization Schedule'}
        </button>
      </div>

      {/* Yearly Amortization Schedule */}
      {showSchedule && (
        <div style={{ border: `1px solid ${bdr}`, borderRadius: 10, overflowX: 'auto', marginTop: 14 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: dk ? '#111a28' : '#f1f5f9', borderBottom: `1px solid ${bdr}`, textAlign: 'left', color: fg2 }}>
                <th style={{ padding: '10px 14px' }}>Year</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Principal Paid</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Interest Paid</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Total Annual EMI</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Closing Balance</th>
              </tr>
            </thead>
            <tbody>
              {results.schedule.map((row) => (
                <tr key={row.year} style={{ borderBottom: `1px solid ${bdr}` }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>Year {row.year}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', color: '#10b981' }}>{formatIndianCurrency(row.principalPaid)}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', color: '#ef4444' }}>{formatIndianCurrency(row.interestPaid)}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700 }}>{formatIndianCurrency(row.principalPaid + row.interestPaid)}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800 }}>{formatIndianCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
