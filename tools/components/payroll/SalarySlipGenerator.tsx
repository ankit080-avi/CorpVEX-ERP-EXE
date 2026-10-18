import React, { useState, useRef } from 'react';
import {
  formatIndianCurrency,
  numberToWordsIndian,
  copyToClipboard,
} from '../../utils/formatters';
import {
  Printer,
  Plus,
  Trash2,
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
  Eye,
  FileText,
  Copy,
  Building2,
  User,
  CreditCard,
  Layers,
} from 'lucide-react';

interface ComponentItem {
  id: string;
  name: string;
  amount: string;
}

export const SalarySlipGenerator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  // ── Company Details ──
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyGstin, setCompanyGstin] = useState('');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  // ── Employee Details ──
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [payPeriod, setPayPeriod] = useState(() => {
    const now = new Date();
    return now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  });
  const [paidDays, setPaidDays] = useState('30');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');

  // ── Earnings Components (Generic dynamic rows) ──
  const [earnings, setEarnings] = useState<ComponentItem[]>([
    { id: 'e1', name: 'Basic Salary', amount: '35000' },
    { id: 'e2', name: 'House Rent Allowance (HRA)', amount: '14000' },
    { id: 'e3', name: 'Dearness Allowance (DA)', amount: '4500' },
    { id: 'e4', name: 'Special Allowance', amount: '5500' },
    { id: 'e5', name: 'Conveyance Allowance', amount: '1600' },
  ]);

  // ── Deductions Components (Generic dynamic rows) ──
  const [deductions, setDeductions] = useState<ComponentItem[]>([
    { id: 'd1', name: 'Provident Fund (PF)', amount: '1800' },
    { id: 'd2', name: 'Professional Tax (PT)', amount: '200' },
    { id: 'd3', name: 'TDS / Income Tax', amount: '1500' },
    { id: 'd4', name: 'Health Insurance', amount: '500' },
  ]);

  // ── Configuration ──
  const [copies, setCopies] = useState<'1' | '2'>('1');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#ffffff';
  const cardBg = dk ? 'rgba(255,255,255,0.02)' : '#f8fafc';

  // ── Calculations ──
  const grossSalary = earnings.reduce((accVal, item) => {
    const val = parseFloat(item.amount);
    return accVal + (isNaN(val) || val < 0 ? 0 : val);
  }, 0);

  const totalDeductions = deductions.reduce((accVal, item) => {
    const val = parseFloat(item.amount);
    return accVal + (isNaN(val) || val < 0 ? 0 : val);
  }, 0);

  const netSalary = Math.max(0, grossSalary - totalDeductions);
  const amountInWords = numberToWordsIndian(netSalary);

  // ── Handlers for Earnings ──
  const handleAddEarning = () => {
    setEarnings((prev) => [
      ...prev,
      { id: Math.random().toString(36).substr(2, 9), name: 'Custom Allowance', amount: '0' },
    ]);
  };

  const handleUpdateEarning = (id: string, field: 'name' | 'amount', value: string) => {
    setEarnings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveEarning = (id: string) => {
    setEarnings((prev) => prev.filter((item) => item.id !== id));
  };

  // ── Handlers for Deductions ──
  const handleAddDeduction = () => {
    setDeductions((prev) => [
      ...prev,
      { id: Math.random().toString(36).substr(2, 9), name: 'Custom Deduction', amount: '0' },
    ]);
  };

  const handleUpdateDeduction = (id: string, field: 'name' | 'amount', value: string) => {
    setDeductions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveDeduction = (id: string) => {
    setDeductions((prev) => prev.filter((item) => item.id !== id));
  };

  // ── Handle Logo Upload ──
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setValidationError('Logo image must be smaller than 2 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCompanyLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ── Print / Save PDF ──
  const handlePrint = () => {
    // Validate required fields
    if (!companyName.trim()) {
      setValidationError('Please enter your Company Name before printing.');
      setActiveTab('editor');
      return;
    }
    if (!employeeName.trim()) {
      setValidationError('Please enter Employee Name before printing.');
      setActiveTab('editor');
      return;
    }
    if (!payPeriod.trim()) {
      setValidationError('Please enter Pay Period before printing.');
      setActiveTab('editor');
      return;
    }

    setValidationError(null);
    window.print();
  };

  // ── Copy Summary ──
  const handleCopySummary = () => {
    const summaryText = `SALARY SLIP SUMMARY:
Company: ${companyName.trim() || 'N/A'}
Employee: ${employeeName.trim() || 'N/A'} (${designation.trim() || 'N/A'})
Pay Period: ${payPeriod}
Gross Earnings: ${formatIndianCurrency(grossSalary)}
Total Deductions: ${formatIndianCurrency(totalDeductions)}
Net Salary Payable: ${formatIndianCurrency(netSalary)}
Amount in Words: ${amountInWords}`;
    copyToClipboard(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  // ── Reset ──
  const handleReset = () => {
    setCompanyName('');
    setCompanyAddress('');
    setCompanyGstin('');
    setCompanyLogo(null);
    setEmployeeName('');
    setEmployeeId('');
    setDesignation('');
    setDepartment('');
    setDateOfJoining('');
    setPaidDays('30');
    setBankName('');
    setAccountNumber('');
    setPanNumber('');
    setEarnings([
      { id: 'e1', name: 'Basic Salary', amount: '' },
      { id: 'e2', name: 'House Rent Allowance (HRA)', amount: '' },
      { id: 'e3', name: 'Dearness Allowance (DA)', amount: '' },
      { id: 'e4', name: 'Special Allowance', amount: '' },
    ]);
    setDeductions([
      { id: 'd1', name: 'Provident Fund (PF)', amount: '' },
      { id: 'd2', name: 'Professional Tax (PT)', amount: '' },
      { id: 'd3', name: 'TDS / Income Tax', amount: '' },
    ]);
    setValidationError(null);
  };

  // ── Render Printable Pay Slip Template ──
  const renderSingleSlip = (copyLabel: string) => {
    const displayCompanyName = companyName.trim() || 'COMPANY NAME';
    const displayEmployeeName = employeeName.trim() || 'EMPLOYEE NAME';

    return (
      <div
        className="salary-slip-document"
        style={{
          background: '#ffffff',
          color: '#0f172a',
          padding: '28px',
          border: '1px solid #cbd5e1',
          borderRadius: 8,
          marginBottom: '28px',
          fontFamily: "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          boxSizing: 'border-box',
          pageBreakInside: 'avoid',
        }}
      >
        {/* Slip Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #0f172a',
            paddingBottom: '16px',
            marginBottom: '16px',
            gap: 16,
          }}
        >
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.02em', color: '#0f172a' }}>
              {displayCompanyName}
            </h2>
            {companyAddress && (
              <p style={{ fontSize: 12, margin: '0 0 2px 0', color: '#475569', lineHeight: 1.4, maxWidth: 500 }}>
                {companyAddress}
              </p>
            )}
            {companyGstin && (
              <p style={{ fontSize: 11.5, margin: 0, color: '#475569', fontWeight: 600 }}>
                GSTIN: {companyGstin}
              </p>
            )}
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            {companyLogo && (
              <img
                src={companyLogo}
                alt="Company Logo"
                style={{ maxHeight: 52, maxWidth: 160, objectFit: 'contain', marginBottom: 6 }}
              />
            )}
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '3px 8px',
                borderRadius: 4,
                background: '#f1f5f9',
                color: '#334155',
                display: 'inline-block',
              }}
            >
              {copyLabel}
            </div>
          </div>
        </div>

        {/* Payslip Title Bar */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            padding: '8px 16px',
            textAlign: 'center',
            marginBottom: '18px',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a' }}>
            PAYSLIP FOR THE MONTH OF {payPeriod.toUpperCase()}
          </span>
        </div>

        {/* Employee Info Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px 14px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            padding: '14px',
            marginBottom: '18px',
            fontSize: 12,
          }}
        >
          <div>
            <span style={{ color: '#64748b', fontSize: 11, display: 'block' }}>Employee Name</span>
            <strong style={{ color: '#0f172a', fontSize: 13 }}>{displayEmployeeName}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: 11, display: 'block' }}>Employee ID</span>
            <strong style={{ color: '#0f172a' }}>{employeeId || '—'}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: 11, display: 'block' }}>Designation</span>
            <strong style={{ color: '#0f172a' }}>{designation || '—'}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: 11, display: 'block' }}>Department</span>
            <strong style={{ color: '#0f172a' }}>{department || '—'}</strong>
          </div>

          <div>
            <span style={{ color: '#64748b', fontSize: 11, display: 'block' }}>Date of Joining</span>
            <strong style={{ color: '#0f172a' }}>{dateOfJoining || '—'}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: 11, display: 'block' }}>Paid Days</span>
            <strong style={{ color: '#0f172a' }}>{paidDays || '30'} Days</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: 11, display: 'block' }}>Bank &amp; Account No.</span>
            <strong style={{ color: '#0f172a' }}>
              {bankName ? `${bankName} ` : ''}
              {accountNumber ? `(${accountNumber})` : '—'}
            </strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: 11, display: 'block' }}>PAN Number</span>
            <strong style={{ color: '#0f172a' }}>{panNumber || '—'}</strong>
          </div>
        </div>

        {/* Earnings & Deductions Tables (Dual Columns) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
          {/* Earnings Table */}
          <div style={{ border: '1px solid #cbd5e1', borderRadius: 6, overflow: 'hidden' }}>
            <div
              style={{
                background: '#f1f5f9',
                borderBottom: '1px solid #cbd5e1',
                padding: '8px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
                fontSize: 12.5,
                color: '#0f172a',
              }}
            >
              <span>EARNINGS</span>
              <span>AMOUNT (₹)</span>
            </div>
            <div style={{ minHeight: 140 }}>
              {earnings.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '7px 12px',
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: 12,
                    color: '#334155',
                  }}
                >
                  <span>{item.name}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>
                    {formatIndianCurrency(parseFloat(item.amount) || 0, false)}
                  </span>
                </div>
              ))}
            </div>
            {/* Total Gross Earnings */}
            <div
              style={{
                background: '#f8fafc',
                borderTop: '2px solid #cbd5e1',
                padding: '9px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
                fontSize: 13,
                color: '#0f172a',
              }}
            >
              <span>TOTAL GROSS SALARY</span>
              <span style={{ color: '#16a34a' }}>{formatIndianCurrency(grossSalary)}</span>
            </div>
          </div>

          {/* Deductions Table */}
          <div style={{ border: '1px solid #cbd5e1', borderRadius: 6, overflow: 'hidden' }}>
            <div
              style={{
                background: '#f1f5f9',
                borderBottom: '1px solid #cbd5e1',
                padding: '8px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
                fontSize: 12.5,
                color: '#0f172a',
              }}
            >
              <span>DEDUCTIONS</span>
              <span>AMOUNT (₹)</span>
            </div>
            <div style={{ minHeight: 140 }}>
              {deductions.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '7px 12px',
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: 12,
                    color: '#334155',
                  }}
                >
                  <span>{item.name}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>
                    {formatIndianCurrency(parseFloat(item.amount) || 0, false)}
                  </span>
                </div>
              ))}
            </div>
            {/* Total Deductions */}
            <div
              style={{
                background: '#f8fafc',
                borderTop: '2px solid #cbd5e1',
                padding: '9px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
                fontSize: 13,
                color: '#0f172a',
              }}
            >
              <span>TOTAL DEDUCTIONS</span>
              <span style={{ color: '#dc2626' }}>{formatIndianCurrency(totalDeductions)}</span>
            </div>
          </div>
        </div>

        {/* Net Pay Highlight Banner */}
        <div
          style={{
            background: '#f8fafc',
            border: '2px solid #0f172a',
            borderRadius: 6,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Take Home Pay (Gross Earnings - Total Deductions)
            </span>
            <div style={{ fontSize: 13, color: '#334155', marginTop: 3 }}>
              <strong>In Words:</strong> {amountInWords}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block' }}>
              NET SALARY PAYABLE
            </span>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>
              {formatIndianCurrency(netSalary)}
            </span>
          </div>
        </div>

        {/* Signatures & Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingTop: '28px',
            fontSize: 12,
            color: '#475569',
          }}
        >
          <div style={{ textAlign: 'center', width: 180 }}>
            <div style={{ borderTop: '1px dashed #94a3b8', paddingTop: 6, fontWeight: 700, color: '#0f172a' }}>
              Employee Signature
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', maxWidth: 280 }}>
            This is a computer-generated salary slip and does not require a physical signature unless mandated.
          </div>

          <div style={{ textAlign: 'center', width: 200 }}>
            <div style={{ borderTop: '1px dashed #94a3b8', paddingTop: 6, fontWeight: 700, color: '#0f172a' }}>
              Authorized Signatory
            </div>
            <div style={{ fontSize: 10.5, color: '#64748b' }}>For {displayCompanyName}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* ── Print Specific Styles ── */}
      <style>{`
        @media print {
          /* Hide non-print elements */
          body * {
            visibility: hidden !important;
          }
          #salary-slip-printable-area, #salary-slip-printable-area * {
            visibility: visible !important;
          }
          #salary-slip-printable-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
        }
      `}</style>

      {/* ── Top View Switcher & Action Bar ── */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          paddingBottom: 20,
          borderBottom: `1px solid ${bdr}`,
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setActiveTab('editor')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              border: activeTab === 'editor' ? `1px solid ${acc}` : `1px solid ${bdr}`,
              background: activeTab === 'editor' ? (dk ? 'rgba(232, 168, 56, 0.16)' : 'rgba(217, 119, 6, 0.1)') : 'transparent',
              color: activeTab === 'editor' ? acc : fg,
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer',
            }}
          >
            <FileText size={15} />
            <span>1. Edit Salary Information</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              border: activeTab === 'preview' ? `1px solid ${acc}` : `1px solid ${bdr}`,
              background: activeTab === 'preview' ? (dk ? 'rgba(232, 168, 56, 0.16)' : 'rgba(217, 119, 6, 0.1)') : 'transparent',
              color: activeTab === 'preview' ? acc : fg,
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer',
            }}
          >
            <Eye size={15} />
            <span>2. Payslip Preview &amp; Print</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Copies Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: fg2 }}>
            <Layers size={14} />
            <span>Copies:</span>
            <select
              value={copies}
              onChange={(e) => setCopies(e.target.value as any)}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: `1px solid ${bdr}`,
                background: inputBg,
                color: fg,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <option value="1">1 Copy (Employee)</option>
              <option value="2">2 Copies (Employee + Employer)</option>
            </select>
          </div>

          <button
            onClick={handleCopySummary}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              background: 'transparent',
              border: `1px solid ${bdr}`,
              color: fg,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {copiedSummary ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handlePrint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px',
              borderRadius: 8,
              background: acc,
              border: 'none',
              color: '#ffffff',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.25)',
            }}
          >
            <Printer size={15} />
            <span>Print / Save as PDF</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset form"
            style={{
              padding: '8px',
              borderRadius: 8,
              background: 'transparent',
              border: `1px solid ${bdr}`,
              color: fg2,
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Validation Banner */}
      {validationError && (
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            borderRadius: 8,
            background: dk ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: 13.5,
            marginBottom: 20,
          }}
        >
          <AlertCircle size={16} />
          <span>{validationError}</span>
        </div>
      )}

      {/* ── Tab 1: Input Editor ── */}
      {activeTab === 'editor' && (
        <div className="no-print">
          {/* Section 1: Company Details */}
          <div
            style={{
              background: cardBg,
              border: `1px solid ${bdr}`,
              borderRadius: 12,
              padding: 22,
              marginBottom: 22,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 800, color: fg, marginBottom: 16 }}>
              <Building2 size={18} color={acc} />
              <span>1. Company &amp; Employer Details</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Company Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. CorpVEX Textiles Pvt Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Company GSTIN (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 27AABCU9603R1ZM"
                  value={companyGstin}
                  onChange={(e) => setCompanyGstin(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Registered Office Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Plot No. 42, GIDC Industrial Estate, Surat, Gujarat - 395006"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Company Logo (Optional)
                </label>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '9px 14px',
                      borderRadius: 8,
                      border: `1px solid ${bdr}`,
                      background: inputBg,
                      color: fg,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Upload size={14} />
                    <span>{companyLogo ? 'Change Logo' : 'Upload Logo Image'}</span>
                  </button>
                  {companyLogo && (
                    <button
                      type="button"
                      onClick={() => setCompanyLogo(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      Remove Logo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Employee Details */}
          <div
            style={{
              background: cardBg,
              border: `1px solid ${bdr}`,
              borderRadius: 12,
              padding: 22,
              marginBottom: 22,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 800, color: fg, marginBottom: 16 }}>
              <User size={18} color={acc} />
              <span>2. Employee Details &amp; Pay Period</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Employee Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar Sharma"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Employee ID / Staff Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. EMP-1048"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Designation / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Production Manager"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Operations / Weaving"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Pay Period <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. August 2026"
                  value={payPeriod}
                  onChange={(e) => setPayPeriod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Paid Days / Working Days
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={paidDays}
                  onChange={(e) => setPaidDays(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Date of Joining
                </label>
                <input
                  type="date"
                  value={dateOfJoining}
                  onChange={(e) => setDateOfJoining(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Employee PAN
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="e.g. ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Bank Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. HDFC Bank Ltd"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Bank Account Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 50100234567890"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 3 & 4: Earnings & Deductions Components */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
            {/* Earnings Column */}
            <div
              style={{
                background: cardBg,
                border: `1px solid ${bdr}`,
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 15, color: '#16a34a' }}>
                  <span>3. Earnings Breakdown</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddEarning}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '5px 10px',
                    borderRadius: 6,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: acc,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={13} />
                  <span>Add Earning Row</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {earnings.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="text"
                      value={item.name}
                      placeholder="Allowance / Salary Head"
                      onChange={(e) => handleUpdateEarning(item.id, 'name', e.target.value)}
                      style={{
                        flex: 1.5,
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        boxSizing: 'border-box',
                      }}
                    />
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: fg2, fontSize: 13 }}>
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={item.amount}
                        onChange={(e) => handleUpdateEarning(item.id, 'amount', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 8px 8px 22px',
                          borderRadius: 6,
                          border: `1px solid ${bdr}`,
                          background: inputBg,
                          color: fg,
                          fontSize: 13,
                          fontWeight: 600,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEarning(item.id)}
                      disabled={earnings.length <= 1}
                      title="Remove earning head"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: earnings.length <= 1 ? fg2 : '#ef4444',
                        cursor: earnings.length <= 1 ? 'not-allowed' : 'pointer',
                        padding: 6,
                        display: 'flex',
                        opacity: earnings.length <= 1 ? 0.3 : 1,
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: `1px solid ${bdr}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: fg }}>Total Gross Earnings:</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#16a34a' }}>
                  {formatIndianCurrency(grossSalary)}
                </span>
              </div>
            </div>

            {/* Deductions Column */}
            <div
              style={{
                background: cardBg,
                border: `1px solid ${bdr}`,
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 15, color: '#dc2626' }}>
                  <span>4. Deductions Breakdown</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddDeduction}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '5px 10px',
                    borderRadius: 6,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: acc,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={13} />
                  <span>Add Deduction Row</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {deductions.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="text"
                      value={item.name}
                      placeholder="Deduction Head"
                      onChange={(e) => handleUpdateDeduction(item.id, 'name', e.target.value)}
                      style={{
                        flex: 1.5,
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        boxSizing: 'border-box',
                      }}
                    />
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: fg2, fontSize: 13 }}>
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={item.amount}
                        onChange={(e) => handleUpdateDeduction(item.id, 'amount', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 8px 8px 22px',
                          borderRadius: 6,
                          border: `1px solid ${bdr}`,
                          background: inputBg,
                          color: fg,
                          fontSize: 13,
                          fontWeight: 600,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDeduction(item.id)}
                      disabled={deductions.length <= 1}
                      title="Remove deduction head"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: deductions.length <= 1 ? fg2 : '#ef4444',
                        cursor: deductions.length <= 1 ? 'not-allowed' : 'pointer',
                        padding: 6,
                        display: 'flex',
                        opacity: deductions.length <= 1 ? 0.3 : 1,
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: `1px solid ${bdr}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: fg }}>Total Deductions:</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#dc2626' }}>
                  {formatIndianCurrency(totalDeductions)}
                </span>
              </div>
            </div>
          </div>

          {/* Live Calculation Summary Banner */}
          <div
            style={{
              padding: 20,
              borderRadius: 12,
              background: dk ? 'rgba(232, 168, 56, 0.08)' : 'rgba(217, 119, 6, 0.06)',
              border: `1px solid ${acc}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: acc, letterSpacing: '0.04em' }}>
                Net Monthly Pay (In-Hand Salary)
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: fg, marginTop: 4 }}>
                {formatIndianCurrency(netSalary)}
              </div>
              <div style={{ fontSize: 13, color: fg2, marginTop: 2 }}>
                <strong>In Words:</strong> {amountInWords}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                style={{
                  padding: '12px 20px',
                  borderRadius: 8,
                  background: acc,
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Eye size={16} />
                <span>View Full Salary Slip Preview</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Salary Slip Preview & Print Container ── */}
      <div id="salary-slip-printable-area" style={{ display: activeTab === 'preview' ? 'block' : 'none' }}>
        {renderSingleSlip('EMPLOYEE COPY')}

        {copies === '2' && (
          <>
            <div
              className="no-print"
              style={{
                textAlign: 'center',
                margin: '20px 0',
                borderTop: '2px dashed #94a3b8',
                paddingTop: 10,
                fontSize: 12,
                color: '#64748b',
              }}
            >
              ✂️ ──────────────── Cut / Perforation Line ──────────────── ✂️
            </div>
            {renderSingleSlip('EMPLOYER RECORD COPY')}
          </>
        )}
      </div>
    </div>
  );
};
