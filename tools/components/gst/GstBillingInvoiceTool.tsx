import React, { useState, useRef, useMemo } from 'react';
import {
  formatIndianCurrency,
  numberToWordsIndian,
  copyToClipboard,
} from '../../utils/formatters';
import {
  INDIAN_STATES,
  COMMON_GST_RATES,
  COMMON_UNITS,
  calculateInvoice,
  validateStructuralGstin,
  type InvoiceLineItem,
} from '../../utils/gstBillingEngine';
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
  Building2,
  User,
  Truck,
  Receipt,
  CreditCard,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const GstBillingInvoiceTool: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  // ── Company / Supplier Details ──
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyGstin, setCompanyGstin] = useState('');
  const [companyMobile, setCompanyMobile] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyState, setCompanyState] = useState('Gujarat');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  // ── Customer / Bill To Details ──
  const [customerName, setCustomerName] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerState, setCustomerState] = useState('Gujarat');
  const [customerAddress, setCustomerAddress] = useState('');

  // ── Ship To Details ──
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [shipName, setShipName] = useState('');
  const [shipGstin, setShipGstin] = useState('');
  const [shipMobile, setShipMobile] = useState('');
  const [shipState, setShipState] = useState('Gujarat');
  const [shipAddress, setShipAddress] = useState('');

  // ── Invoice Metadata ──
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-001');
  const [invoiceDate, setInvoiceDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [invoiceTitle, setInvoiceTitle] = useState('TAX INVOICE');
  const [placeOfSupply, setPlaceOfSupply] = useState('Gujarat');
  const [dueDate, setDueDate] = useState('');
  const [reverseCharge, setReverseCharge] = useState<'No' | 'Yes'>('No');

  // ── Tax Mode Selection: Auto-detect or Manual Override ──
  const [taxModeOverride, setTaxModeOverride] = useState<'auto' | 'intrastate' | 'interstate'>('auto');

  // ── Items ──
  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      id: 'item-1',
      product: 'Consulting / Engineering Services',
      hsn: '998311',
      quantity: '1',
      unit: 'NOS',
      rate: '25000',
      discountPercent: '0',
      gstRate: 18,
    },
    {
      id: 'item-2',
      product: 'Industrial Hardware Components',
      hsn: '847130',
      quantity: '5',
      unit: 'PCS',
      rate: '3200',
      discountPercent: '5',
      gstRate: 18,
    },
  ]);

  // ── Terms & Notes & Bank Details ──
  const [terms, setTerms] = useState(
    '1. Payment due within 30 days from invoice date.\n2. Goods once sold will not be taken back or exchanged.\n3. All disputes subject to local jurisdiction.'
  );
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [bankBranch, setBankBranch] = useState('');

  // ── UI States ──
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#ffffff';
  const cardBg = dk ? 'rgba(255,255,255,0.02)' : '#f8fafc';

  // ── State Code Lookups ──
  const companyStateObj = INDIAN_STATES.find((s) => s.name === companyState);
  const companyStateCode = companyStateObj ? companyStateObj.code : '';

  const customerStateObj = INDIAN_STATES.find((s) => s.name === customerState);
  const customerStateCode = customerStateObj ? customerStateObj.code : '';

  const placeOfSupplyObj = INDIAN_STATES.find((s) => s.name === placeOfSupply);
  const placeOfSupplyCode = placeOfSupplyObj ? placeOfSupplyObj.code : '';

  const effectiveShipName = sameAsBilling ? customerName : shipName;
  const effectiveShipGstin = sameAsBilling ? customerGstin : shipGstin;
  const effectiveShipMobile = sameAsBilling ? customerMobile : shipMobile;
  const effectiveShipState = sameAsBilling ? customerState : shipState;
  const effectiveShipAddress = sameAsBilling ? customerAddress : shipAddress;

  // ── Derive Active Tax Mode ──
  const activeTaxMode: 'intrastate' | 'interstate' = useMemo(() => {
    if (taxModeOverride === 'intrastate') return 'intrastate';
    if (taxModeOverride === 'interstate') return 'interstate';

    // Auto-detect based on Supplier State vs Place of Supply
    if (companyState && placeOfSupply) {
      return companyState === placeOfSupply ? 'intrastate' : 'interstate';
    }
    return companyState === customerState ? 'intrastate' : 'interstate';
  }, [taxModeOverride, companyState, placeOfSupply, customerState]);

  // ── Calculations ──
  const invoiceCalc = useMemo(() => {
    return calculateInvoice(items, activeTaxMode);
  }, [items, activeTaxMode]);

  const amountInWords = numberToWordsIndian(invoiceCalc.grandTotal);

  // ── GSTIN Structural Validation Indicators ──
  const companyGstinValidation = useMemo(() => {
    if (!companyGstin.trim()) return null;
    return validateStructuralGstin(companyGstin);
  }, [companyGstin]);

  const customerGstinValidation = useMemo(() => {
    if (!customerGstin.trim()) return null;
    return validateStructuralGstin(customerGstin);
  }, [customerGstin]);

  // ── Handle Auto State Sync from GSTIN Prefix ──
  const handleCompanyGstinChange = (val: string) => {
    const upper = val.toUpperCase();
    setCompanyGstin(upper);
    if (upper.length >= 2) {
      const code = upper.substring(0, 2);
      const matched = INDIAN_STATES.find((s) => s.code === code);
      if (matched) {
        setCompanyState(matched.name);
      }
    }
  };

  const handleCustomerGstinChange = (val: string) => {
    const upper = val.toUpperCase();
    setCustomerGstin(upper);
    if (upper.length >= 2) {
      const code = upper.substring(0, 2);
      const matched = INDIAN_STATES.find((s) => s.code === code);
      if (matched) {
        setCustomerState(matched.name);
        setPlaceOfSupply(matched.name);
      }
    }
  };

  // ── Line Item Handlers ──
  const handleAddItem = () => {
    const newItem: InvoiceLineItem = {
      id: 'item-' + Date.now(),
      product: '',
      hsn: '',
      quantity: '1',
      unit: 'PCS',
      rate: '0',
      discountPercent: '0',
      gstRate: 18,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      setValidationError('An invoice must contain at least one line item.');
      return;
    }
    setValidationError(null);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceLineItem, value: any) => {
    setValidationError(null);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return { ...item, [field]: value };
      })
    );
  };

  // ── Logo Upload Handler ──
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setValidationError('Logo file size should be less than 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCompanyLogo(reader.result as string);
      setValidationError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setCompanyLogo(null);
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  // ── Reset Handler ──
  const handleReset = () => {
    setCompanyName('');
    setCompanyAddress('');
    setCompanyGstin('');
    setCompanyMobile('');
    setCompanyEmail('');
    setCompanyLogo(null);
    setCustomerName('');
    setCustomerGstin('');
    setCustomerMobile('');
    setCustomerEmail('');
    setCustomerAddress('');
    setSameAsBilling(true);
    setShipName('');
    setShipGstin('');
    setShipMobile('');
    setShipAddress('');
    setItems([
      {
        id: 'item-1',
        product: '',
        hsn: '',
        quantity: '1',
        unit: 'PCS',
        rate: '0',
        discountPercent: '0',
        gstRate: 18,
      },
    ]);
    setValidationError(null);
  };

  // ── Validate & Print ──
  const handlePrint = () => {
    if (!companyName.trim()) {
      setValidationError('Please enter your Business / Company Name.');
      setActiveTab('editor');
      return;
    }
    if (!customerName.trim()) {
      setValidationError('Please enter the Customer / Buyer Name.');
      setActiveTab('editor');
      return;
    }
    if (!invoiceNumber.trim()) {
      setValidationError('Please enter an Invoice Number.');
      setActiveTab('editor');
      return;
    }
    if (!invoiceDate.trim()) {
      setValidationError('Please enter the Invoice Date.');
      setActiveTab('editor');
      return;
    }

    const invalidItem = items.find(
      (item) =>
        !item.product.trim() ||
        parseFloat(String(item.quantity)) <= 0 ||
        isNaN(parseFloat(String(item.quantity))) ||
        parseFloat(String(item.rate)) < 0 ||
        isNaN(parseFloat(String(item.rate)))
    );

    if (invalidItem) {
      setValidationError('Every line item must have a product/service description, quantity > 0, and rate >= 0.');
      setActiveTab('editor');
      return;
    }

    setValidationError(null);
    window.print();
  };

  const handleCopySummary = () => {
    const summary = `GST Tax Invoice Summary:\nInvoice No: ${invoiceNumber}\nDate: ${invoiceDate}\nSupplier: ${companyName || 'N/A'}\nCustomer: ${customerName || 'N/A'}\nTax Model: ${activeTaxMode === 'intrastate' ? 'Intra-State (CGST+SGST)' : 'Inter-State (IGST)'}\nTaxable Value: ${formatIndianCurrency(invoiceCalc.taxableValue)}\nCGST: ${formatIndianCurrency(invoiceCalc.totalCgst)}\nSGST: ${formatIndianCurrency(invoiceCalc.totalSgst)}\nIGST: ${formatIndianCurrency(invoiceCalc.totalIgst)}\nGrand Total: ${formatIndianCurrency(invoiceCalc.grandTotal)}\nAmount in Words: ${amountInWords}`;
    copyToClipboard(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', paddingBottom: 40 }}>
      {/* ── Print Media Styles (Isolates A4 Document) ── */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #gst-invoice-printable-area, #gst-invoice-printable-area * {
            visibility: visible !important;
          }
          #gst-invoice-printable-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #0f172a !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>

      {/* ── Top Header Controls (No-Print) ── */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
          padding: '16px 20px',
          background: cardBg,
          border: `1px solid ${bdr}`,
          borderRadius: 12,
        }}
      >
        {/* Tab Toggle */}
        <div style={{ display: 'flex', gap: 6, background: inputBg, padding: 4, borderRadius: 8, border: `1px solid ${bdr}` }}>
          <button
            onClick={() => setActiveTab('editor')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'editor' ? acc : 'transparent',
              color: activeTab === 'editor' ? '#000000' : fg,
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <FileText size={16} />
            <span>Invoice Editor</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'preview' ? acc : 'transparent',
              color: activeTab === 'preview' ? '#000000' : fg,
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Eye size={16} />
            <span>A4 Print Preview</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={handleCopySummary}
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
            {copiedSummary ? <Check size={15} color="#10b981" /> : <Receipt size={15} color={fg2} />}
            <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 14px',
              borderRadius: 8,
              border: `1px solid ${bdr}`,
              background: inputBg,
              color: fg2,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>

          <button
            onClick={handlePrint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
            }}
          >
            <Printer size={16} />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            borderRadius: 8,
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: 13.5,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          <AlertCircle size={18} />
          <span>{validationError}</span>
        </div>
      )}

      {/* ── Active Mode Indicator Ribbon (No-Print) ── */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '12px 18px',
          background: activeTaxMode === 'intrastate' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(59, 130, 246, 0.08)',
          border: `1px solid ${activeTaxMode === 'intrastate' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(59, 130, 246, 0.25)'}`,
          borderRadius: 10,
          marginBottom: 24,
          fontSize: 13,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 20,
              fontWeight: 800,
              fontSize: 11.5,
              textTransform: 'uppercase',
              background: activeTaxMode === 'intrastate' ? '#10b981' : '#3b82f6',
              color: '#ffffff',
            }}
          >
            {activeTaxMode === 'intrastate' ? 'Intra-State GST' : 'Inter-State GST'}
          </span>
          <span style={{ color: fg, fontWeight: 600 }}>
            {activeTaxMode === 'intrastate'
              ? 'Local Supply: CGST (50%) + SGST (50%) applicable.'
              : 'Inter-State Supply: Integrated GST (IGST 100%) applicable.'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: fg2, fontSize: 12 }}>Tax Model Override:</span>
          <select
            value={taxModeOverride}
            onChange={(e) => setTaxModeOverride(e.target.value as any)}
            style={{
              padding: '5px 10px',
              borderRadius: 6,
              background: inputBg,
              color: fg,
              border: `1px solid ${bdr}`,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <option value="auto">Auto-Detect from State & Place of Supply</option>
            <option value="intrastate">Force Intra-State (CGST + SGST)</option>
            <option value="interstate">Force Inter-State (IGST)</option>
          </select>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: INVOICE EDITOR
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'editor' && (
        <div className="no-print">
          {/* Top Section: Company & Invoice Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
            {/* 1. Company Information */}
            <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: acc }}>
                <Building2 size={18} />
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: fg }}>Supplier / Company Details</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                    Business / Company Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Tech Solutions Pvt Ltd"
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
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                    Address
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Plot No. 12, GIDC Industrial Estate..."
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: `1px solid ${bdr}`,
                      background: inputBg,
                      color: fg,
                      fontSize: 13,
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Company GSTIN
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="24AAACC1206F1ZT"
                      value={companyGstin}
                      onChange={(e) => handleCompanyGstinChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        fontWeight: 600,
                        boxSizing: 'border-box',
                      }}
                    />
                    {companyGstinValidation && (
                      <div style={{ fontSize: 11, marginTop: 4, color: companyGstinValidation.isValid ? '#10b981' : '#f59e0b' }}>
                        {companyGstinValidation.isValid ? '✓ Valid 15-char structure' : companyGstinValidation.errorMessage}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      State &amp; Code
                    </label>
                    <select
                      value={companyState}
                      onChange={(e) => setCompanyState(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        fontWeight: 600,
                        boxSizing: 'border-box',
                      }}
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s.code} value={s.name}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Phone / Mobile
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={companyMobile}
                      onChange={(e) => setCompanyMobile(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 8,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="accounts@apextech.com"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 8,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 6 }}>
                    Company Logo (Optional)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      style={{ display: 'none' }}
                      id="company-logo-upload"
                    />
                    <label
                      htmlFor="company-logo-upload"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 14px',
                        borderRadius: 6,
                        border: `1px dashed ${acc}`,
                        background: dk ? 'rgba(232, 168, 56, 0.08)' : 'rgba(217, 119, 6, 0.05)',
                        color: acc,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Upload size={14} />
                      <span>{companyLogo ? 'Change Logo' : 'Upload Logo'}</span>
                    </label>

                    {companyLogo && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img
                          src={companyLogo}
                          alt="Logo Preview"
                          style={{ maxHeight: 36, maxWidth: 80, objectFit: 'contain', borderRadius: 4 }}
                        />
                        <button
                          onClick={handleRemoveLogo}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: 12,
                            padding: 4,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Invoice Details */}
            <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: acc }}>
                <Receipt size={18} />
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: fg }}>Invoice Metadata</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Invoice Title / Heading
                    </label>
                    <input
                      type="text"
                      value={invoiceTitle}
                      onChange={(e) => setInvoiceTitle(e.target.value)}
                      placeholder="TAX INVOICE"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        fontWeight: 700,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Invoice No. <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder="INV-2026-001"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        fontWeight: 700,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Invoice Date <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 8,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Payment Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 8,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Place of Supply (State)
                    </label>
                    <select
                      value={placeOfSupply}
                      onChange={(e) => setPlaceOfSupply(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 8,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        boxSizing: 'border-box',
                      }}
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s.code} value={s.name}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Reverse Charge
                    </label>
                    <select
                      value={reverseCharge}
                      onChange={(e) => setReverseCharge(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 8,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>

                <div style={{ padding: '10px 12px', background: inputBg, borderRadius: 8, border: `1px solid ${bdr}`, fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: fg2, marginBottom: 4 }}>
                    <span>Supplier State:</span>
                    <strong style={{ color: fg }}>{companyState} ({companyStateCode})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: fg2 }}>
                    <span>Place of Supply:</span>
                    <strong style={{ color: fg }}>{placeOfSupply} ({placeOfSupplyCode})</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section: Customer & Ship To Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
            {/* 3. Customer / Bill To Details */}
            <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: acc }}>
                <User size={18} />
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: fg }}>Customer / Bill To Details</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                    Customer / Buyer Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Zenith Global Enterprises"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
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
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                    Billing Address
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Office 401, Tech Park, Outer Ring Road..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: `1px solid ${bdr}`,
                      background: inputBg,
                      color: fg,
                      fontSize: 13,
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Customer GSTIN (Optional)
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="Leave blank for B2C"
                      value={customerGstin}
                      onChange={(e) => handleCustomerGstinChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        fontWeight: 600,
                        boxSizing: 'border-box',
                      }}
                    />
                    {customerGstinValidation && (
                      <div style={{ fontSize: 11, marginTop: 4, color: customerGstinValidation.isValid ? '#10b981' : '#f59e0b' }}>
                        {customerGstinValidation.isValid ? '✓ Valid structure' : customerGstinValidation.errorMessage}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      State &amp; Code
                    </label>
                    <select
                      value={customerState}
                      onChange={(e) => {
                        setCustomerState(e.target.value);
                        setPlaceOfSupply(e.target.value);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        fontWeight: 600,
                        boxSizing: 'border-box',
                      }}
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s.code} value={s.name}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Phone / Mobile
                    </label>
                    <input
                      type="text"
                      placeholder="+91 91234 56789"
                      value={customerMobile}
                      onChange={(e) => setCustomerMobile(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 8,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="purchase@zenith.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 8,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Ship To Details */}
            <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: acc }}>
                  <Truck size={18} />
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: fg }}>Ship To / Consignee</h3>
                </div>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: fg, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={(e) => setSameAsBilling(e.target.checked)}
                    style={{ accentColor: acc }}
                  />
                  <span>Same as Billing</span>
                </label>
              </div>

              {sameAsBilling ? (
                <div
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    background: inputBg,
                    border: `1px dashed ${bdr}`,
                    color: fg2,
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  <p style={{ margin: '0 0 6px 0', color: fg, fontWeight: 600 }}>
                    Shipping address is synchronized with billing address:
                  </p>
                  <div><strong>Consignee:</strong> {customerName || 'Same as Buyer'}</div>
                  <div><strong>Address:</strong> {customerAddress || 'Same as Buyer Address'}</div>
                  <div><strong>State:</strong> {customerState} ({customerStateCode})</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Consignee / Recipient Name
                    </label>
                    <input
                      type="text"
                      placeholder="Warehouse / Branch name"
                      value={shipName}
                      onChange={(e) => setShipName(e.target.value)}
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
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Shipping Address
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Consignee warehouse delivery address..."
                      value={shipAddress}
                      onChange={(e) => setShipAddress(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        boxSizing: 'border-box',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                        Consignee GSTIN
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        placeholder="Consignee GSTIN"
                        value={shipGstin}
                        onChange={(e) => setShipGstin(e.target.value.toUpperCase())}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: 8,
                          border: `1px solid ${bdr}`,
                          background: inputBg,
                          color: fg,
                          fontSize: 13,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                        Shipping State
                      </label>
                      <select
                        value={shipState}
                        onChange={(e) => setShipState(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: 8,
                          border: `1px solid ${bdr}`,
                          background: inputBg,
                          color: fg,
                          fontSize: 13,
                          boxSizing: 'border-box',
                        }}
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s.code} value={s.name}>
                            {s.name} ({s.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. Dynamic Line Items Table */}
          <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: acc }}>
                <Layers size={18} />
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: fg }}>
                  Invoice Line Items ({items.length})
                </h3>
              </div>

              <button
                onClick={handleAddItem}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: acc,
                  color: '#000000',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Plus size={15} />
                <span>Add Line Item</span>
              </button>
            </div>

            {/* Desktop Table View */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 840 }}>
                <thead>
                  <tr style={{ background: inputBg, borderBottom: `2px solid ${bdr}`, textAlign: 'left', color: fg2 }}>
                    <th style={{ padding: '10px 8px', width: 36 }}>#</th>
                    <th style={{ padding: '10px 8px', minWidth: 200 }}>Product / Service Name *</th>
                    <th style={{ padding: '10px 8px', width: 90 }}>HSN/SAC</th>
                    <th style={{ padding: '10px 8px', width: 80 }}>Qty *</th>
                    <th style={{ padding: '10px 8px', width: 75 }}>Unit</th>
                    <th style={{ padding: '10px 8px', width: 100 }}>Rate (₹) *</th>
                    <th style={{ padding: '10px 8px', width: 75 }}>Disc %</th>
                    <th style={{ padding: '10px 8px', width: 80 }}>GST %</th>
                    <th style={{ padding: '10px 8px', textAlign: 'right', width: 110 }}>Taxable</th>
                    <th style={{ padding: '10px 8px', textAlign: 'right', width: 110 }}>Total (₹)</th>
                    <th style={{ padding: '10px 8px', width: 44, textAlign: 'center' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const calc = invoiceCalc.calculatedItems[idx];
                    return (
                      <tr key={item.id} style={{ borderBottom: `1px solid ${bdr}` }}>
                        <td style={{ padding: '8px', color: fg2, fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: '8px' }}>
                          <input
                            type="text"
                            placeholder="Item description"
                            value={item.product}
                            onChange={(e) => handleItemChange(item.id, 'product', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: 6,
                              border: `1px solid ${bdr}`,
                              background: inputBg,
                              color: fg,
                              fontSize: 13,
                              boxSizing: 'border-box',
                            }}
                          />
                        </td>
                        <td style={{ padding: '8px' }}>
                          <input
                            type="text"
                            placeholder="HSN"
                            value={item.hsn}
                            onChange={(e) => handleItemChange(item.id, 'hsn', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 6px',
                              borderRadius: 6,
                              border: `1px solid ${bdr}`,
                              background: inputBg,
                              color: fg,
                              fontSize: 12.5,
                              boxSizing: 'border-box',
                            }}
                          />
                        </td>
                        <td style={{ padding: '8px' }}>
                          <input
                            type="number"
                            min="0.01"
                            step="any"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 6px',
                              borderRadius: 6,
                              border: `1px solid ${bdr}`,
                              background: inputBg,
                              color: fg,
                              fontSize: 13,
                              boxSizing: 'border-box',
                              fontWeight: 600,
                            }}
                          />
                        </td>
                        <td style={{ padding: '8px' }}>
                          <select
                            value={item.unit}
                            onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 4px',
                              borderRadius: 6,
                              border: `1px solid ${bdr}`,
                              background: inputBg,
                              color: fg,
                              fontSize: 12,
                              boxSizing: 'border-box',
                            }}
                          >
                            {COMMON_UNITS.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '8px' }}>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.rate}
                            onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 8px',
                              borderRadius: 6,
                              border: `1px solid ${bdr}`,
                              background: inputBg,
                              color: fg,
                              fontSize: 13,
                              boxSizing: 'border-box',
                              fontWeight: 600,
                            }}
                          />
                        </td>
                        <td style={{ padding: '8px' }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="any"
                            value={item.discountPercent}
                            onChange={(e) => handleItemChange(item.id, 'discountPercent', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 6px',
                              borderRadius: 6,
                              border: `1px solid ${bdr}`,
                              background: inputBg,
                              color: fg,
                              fontSize: 12.5,
                              boxSizing: 'border-box',
                            }}
                          />
                        </td>
                        <td style={{ padding: '8px' }}>
                          <select
                            value={item.gstRate}
                            onChange={(e) => handleItemChange(item.id, 'gstRate', Number(e.target.value))}
                            style={{
                              width: '100%',
                              padding: '8px 4px',
                              borderRadius: 6,
                              border: `1px solid ${bdr}`,
                              background: inputBg,
                              color: fg,
                              fontSize: 12.5,
                              fontWeight: 600,
                              boxSizing: 'border-box',
                            }}
                          >
                            {COMMON_GST_RATES.map((r) => (
                              <option key={r} value={r}>
                                {r}%
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600, color: fg }}>
                          {calc ? formatIndianCurrency(calc.taxableAmount) : '0.00'}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: acc }}>
                          {calc ? formatIndianCurrency(calc.lineTotal) : '0.00'}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            title="Remove line"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: 4,
                              display: 'inline-flex',
                              alignItems: 'center',
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Section: Terms, Bank Details & Totals Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {/* Terms & Bank Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Bank Details for Remittance */}
              <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, color: acc }}>
                  <CreditCard size={18} />
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: fg }}>
                    Bank Remittance Details (Optional)
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC Bank"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="A/C Number"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      placeholder="HDFC0001234"
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 4 }}>
                      Branch
                    </label>
                    <input
                      type="text"
                      placeholder="Main Branch"
                      value={bankBranch}
                      onChange={(e) => setBankBranch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: `1px solid ${bdr}`,
                        background: inputBg,
                        color: fg,
                        fontSize: 13,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 12, padding: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: fg, marginBottom: 8 }}>
                  Terms &amp; Conditions / Notes
                </label>
                <textarea
                  rows={4}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 13,
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    lineHeight: 1.5,
                  }}
                />
              </div>
            </div>

            {/* Totals Summary Card */}
            <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 12, padding: 22, height: 'fit-content' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 800, color: fg }}>
                Invoice Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: fg2 }}>
                  <span>Total Items:</span>
                  <strong style={{ color: fg }}>{invoiceCalc.totalItems}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: fg2 }}>
                  <span>Subtotal (Gross):</span>
                  <strong style={{ color: fg }}>{formatIndianCurrency(invoiceCalc.subtotal)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: fg2 }}>
                  <span>Total Discount:</span>
                  <strong style={{ color: '#ef4444' }}>- {formatIndianCurrency(invoiceCalc.totalDiscount)}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: fg2, borderTop: `1px dashed ${bdr}`, paddingTop: 8 }}>
                  <span>Taxable Value:</span>
                  <strong style={{ color: fg }}>{formatIndianCurrency(invoiceCalc.taxableValue)}</strong>
                </div>

                {activeTaxMode === 'intrastate' ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: fg2 }}>
                      <span>Central GST (CGST):</span>
                      <strong style={{ color: fg }}>{formatIndianCurrency(invoiceCalc.totalCgst)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: fg2 }}>
                      <span>State GST (SGST):</span>
                      <strong style={{ color: fg }}>{formatIndianCurrency(invoiceCalc.totalSgst)}</strong>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: fg2 }}>
                    <span>Integrated GST (IGST):</span>
                    <strong style={{ color: fg }}>{formatIndianCurrency(invoiceCalc.totalIgst)}</strong>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: fg2 }}>
                  <span>Total Tax:</span>
                  <strong style={{ color: fg }}>{formatIndianCurrency(invoiceCalc.totalTax)}</strong>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: `2px solid ${bdr}`,
                    paddingTop: 12,
                    marginTop: 4,
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 800, color: fg }}>Grand Total:</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: acc }}>
                    {formatIndianCurrency(invoiceCalc.grandTotal)}
                  </span>
                </div>

                <div
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    background: inputBg,
                    border: `1px solid ${bdr}`,
                    fontSize: 12,
                    color: fg2,
                    marginTop: 6,
                    lineHeight: 1.4,
                  }}
                >
                  <strong style={{ color: fg, display: 'block', marginBottom: 2 }}>Amount in Words:</strong>
                  {amountInWords}
                </div>

                <button
                  onClick={() => setActiveTab('preview')}
                  style={{
                    marginTop: 10,
                    width: '100%',
                    padding: '12px',
                    borderRadius: 8,
                    border: 'none',
                    background: acc,
                    color: '#000000',
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <span>Switch to A4 Invoice Preview</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: PROFESSIONAL A4 PRINTABLE INVOICE PREVIEW
      ────────────────────────────────────────────────────────────── */}
      <div
        id="gst-invoice-printable-area"
        style={{
          display: activeTab === 'preview' ? 'block' : 'none',
          background: '#ffffff',
          color: '#0f172a',
          padding: '36px 40px',
          borderRadius: 8,
          border: '1px solid #cbd5e1',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          fontFamily: "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          boxSizing: 'border-box',
          lineHeight: 1.4,
        }}
      >
        {/* ── Document Header ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid #0f172a',
            paddingBottom: 20,
            marginBottom: 20,
          }}
        >
          {/* Supplier Info */}
          <div style={{ maxWidth: '60%' }}>
            {companyLogo && (
              <img
                src={companyLogo}
                alt="Company Logo"
                style={{ maxHeight: 52, maxWidth: 160, objectFit: 'contain', marginBottom: 10 }}
              />
            )}
            <h1
              style={{
                margin: '0 0 6px 0',
                fontSize: 22,
                fontWeight: 900,
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              {companyName || 'YOUR BUSINESS NAME'}
            </h1>
            {companyAddress && (
              <div style={{ fontSize: 12, color: '#475569', whiteSpace: 'pre-line', marginBottom: 4 }}>
                {companyAddress}
              </div>
            )}
            <div style={{ fontSize: 12, color: '#334155' }}>
              {companyGstin && (
                <span>
                  <strong>GSTIN:</strong> {companyGstin} &nbsp;|&nbsp;{' '}
                </span>
              )}
              <span>
                <strong>State:</strong> {companyState} ({companyStateCode})
              </span>
            </div>
            {(companyMobile || companyEmail) && (
              <div style={{ fontSize: 11.5, color: '#475569', marginTop: 2 }}>
                {companyMobile && <span>Phone: {companyMobile} </span>}
                {companyEmail && <span>&nbsp;Email: {companyEmail}</span>}
              </div>
            )}
          </div>

          {/* Invoice Title & Quick Numbers */}
          <div style={{ textAlign: 'right', minWidth: 200 }}>
            <div
              style={{
                display: 'inline-block',
                background: '#0f172a',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: '0.05em',
                marginBottom: 12,
              }}
            >
              {invoiceTitle || 'TAX INVOICE'}
            </div>

            <table style={{ marginLeft: 'auto', borderCollapse: 'collapse', fontSize: 12 }}>
              <tbody>
                <tr>
                  <td style={{ padding: '2px 8px', color: '#64748b', textAlign: 'right' }}>Invoice No:</td>
                  <td style={{ padding: '2px 8px', fontWeight: 800, color: '#0f172a', textAlign: 'right' }}>
                    {invoiceNumber || 'INV-001'}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 8px', color: '#64748b', textAlign: 'right' }}>Invoice Date:</td>
                  <td style={{ padding: '2px 8px', fontWeight: 700, color: '#0f172a', textAlign: 'right' }}>
                    {invoiceDate}
                  </td>
                </tr>
                {dueDate && (
                  <tr>
                    <td style={{ padding: '2px 8px', color: '#64748b', textAlign: 'right' }}>Due Date:</td>
                    <td style={{ padding: '2px 8px', fontWeight: 600, color: '#0f172a', textAlign: 'right' }}>
                      {dueDate}
                    </td>
                  </tr>
                )}
                <tr>
                  <td style={{ padding: '2px 8px', color: '#64748b', textAlign: 'right' }}>Place of Supply:</td>
                  <td style={{ padding: '2px 8px', fontWeight: 700, color: '#0f172a', textAlign: 'right' }}>
                    {placeOfSupply} ({placeOfSupplyCode})
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 8px', color: '#64748b', textAlign: 'right' }}>Reverse Charge:</td>
                  <td style={{ padding: '2px 8px', fontWeight: 600, color: '#0f172a', textAlign: 'right' }}>
                    {reverseCharge}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Bill To & Ship To 2-Column Grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 20,
          }}
        >
          {/* Billed To */}
          <div
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              padding: '12px 14px',
              background: '#f8fafc',
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#475569',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}
            >
              Billed To (Customer / Buyer)
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
              {customerName || 'CUSTOMER NAME'}
            </div>
            {customerAddress && (
              <div style={{ fontSize: 12, color: '#475569', whiteSpace: 'pre-line', marginBottom: 4 }}>
                {customerAddress}
              </div>
            )}
            <div style={{ fontSize: 12, color: '#334155' }}>
              <span>
                <strong>GSTIN:</strong> {customerGstin || 'Unregistered / B2C'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#334155' }}>
              <span>
                <strong>State:</strong> {customerState} ({customerStateCode})
              </span>
            </div>
            {customerMobile && (
              <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>Phone: {customerMobile}</div>
            )}
          </div>

          {/* Shipped To */}
          <div
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              padding: '12px 14px',
              background: '#f8fafc',
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#475569',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}
            >
              Shipped To (Consignee)
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
              {effectiveShipName || customerName || 'SAME AS BILLING'}
            </div>
            {effectiveShipAddress && (
              <div style={{ fontSize: 12, color: '#475569', whiteSpace: 'pre-line', marginBottom: 4 }}>
                {effectiveShipAddress}
              </div>
            )}
            <div style={{ fontSize: 12, color: '#334155' }}>
              <span>
                <strong>GSTIN:</strong> {effectiveShipGstin || customerGstin || 'Unregistered'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#334155' }}>
              <span>
                <strong>State:</strong> {effectiveShipState}
              </span>
            </div>
            {effectiveShipMobile && (
              <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>Phone: {effectiveShipMobile}</div>
            )}
          </div>
        </div>

        {/* ── Line Items Table ── */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 11.5,
            marginBottom: 20,
            border: '1px solid #cbd5e1',
          }}
        >
          <thead>
            <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', color: '#0f172a' }}>
              <th style={{ padding: '8px 6px', textAlign: 'center', width: 28 }}>#</th>
              <th style={{ padding: '8px 8px', textAlign: 'left' }}>Item Description</th>
              <th style={{ padding: '8px 6px', textAlign: 'center', width: 64 }}>HSN/SAC</th>
              <th style={{ padding: '8px 6px', textAlign: 'right', width: 50 }}>Qty</th>
              <th style={{ padding: '8px 6px', textAlign: 'center', width: 44 }}>Unit</th>
              <th style={{ padding: '8px 6px', textAlign: 'right', width: 68 }}>Rate (₹)</th>
              <th style={{ padding: '8px 6px', textAlign: 'right', width: 54 }}>Disc %</th>
              <th style={{ padding: '8px 6px', textAlign: 'right', width: 80 }}>Taxable (₹)</th>
              <th style={{ padding: '8px 6px', textAlign: 'center', width: 48 }}>GST</th>
              {activeTaxMode === 'intrastate' ? (
                <>
                  <th style={{ padding: '8px 6px', textAlign: 'right', width: 68 }}>CGST (₹)</th>
                  <th style={{ padding: '8px 6px', textAlign: 'right', width: 68 }}>SGST (₹)</th>
                </>
              ) : (
                <th style={{ padding: '8px 6px', textAlign: 'right', width: 80 }}>IGST (₹)</th>
              )}
              <th style={{ padding: '8px 8px', textAlign: 'right', width: 84 }}>Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {invoiceCalc.calculatedItems.map((item, idx) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '7px 6px', textAlign: 'center', color: '#64748b' }}>{idx + 1}</td>
                <td style={{ padding: '7px 8px', fontWeight: 600, color: '#0f172a' }}>
                  {item.product || 'Standard Item'}
                </td>
                <td style={{ padding: '7px 6px', textAlign: 'center', color: '#475569' }}>
                  {item.hsn || '-'}
                </td>
                <td style={{ padding: '7px 6px', textAlign: 'right', fontWeight: 600 }}>
                  {item.quantity}
                </td>
                <td style={{ padding: '7px 6px', textAlign: 'center', color: '#64748b' }}>
                  {item.unit}
                </td>
                <td style={{ padding: '7px 6px', textAlign: 'right' }}>
                  {formatIndianCurrency(item.rate, false)}
                </td>
                <td style={{ padding: '7px 6px', textAlign: 'right', color: item.discountPercent > 0 ? '#ef4444' : '#64748b' }}>
                  {item.discountPercent > 0 ? `${item.discountPercent}%` : '-'}
                </td>
                <td style={{ padding: '7px 6px', textAlign: 'right', fontWeight: 600 }}>
                  {formatIndianCurrency(item.taxableAmount, false)}
                </td>
                <td style={{ padding: '7px 6px', textAlign: 'center', fontWeight: 600 }}>
                  {item.gstRate}%
                </td>
                {activeTaxMode === 'intrastate' ? (
                  <>
                    <td style={{ padding: '7px 6px', textAlign: 'right' }}>
                      {formatIndianCurrency(item.cgst, false)}
                    </td>
                    <td style={{ padding: '7px 6px', textAlign: 'right' }}>
                      {formatIndianCurrency(item.sgst, false)}
                    </td>
                  </>
                ) : (
                  <td style={{ padding: '7px 6px', textAlign: 'right' }}>
                    {formatIndianCurrency(item.igst, false)}
                  </td>
                )}
                <td style={{ padding: '7px 8px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                  {formatIndianCurrency(item.lineTotal, false)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: '#f8fafc', fontWeight: 800, borderTop: '2px solid #cbd5e1' }}>
              <td colSpan={7} style={{ padding: '8px', textAlign: 'right' }}>Total:</td>
              <td style={{ padding: '8px 6px', textAlign: 'right' }}>
                {formatIndianCurrency(invoiceCalc.taxableValue, false)}
              </td>
              <td></td>
              {activeTaxMode === 'intrastate' ? (
                <>
                  <td style={{ padding: '8px 6px', textAlign: 'right' }}>
                    {formatIndianCurrency(invoiceCalc.totalCgst, false)}
                  </td>
                  <td style={{ padding: '8px 6px', textAlign: 'right' }}>
                    {formatIndianCurrency(invoiceCalc.totalSgst, false)}
                  </td>
                </>
              ) : (
                <td style={{ padding: '8px 6px', textAlign: 'right' }}>
                  {formatIndianCurrency(invoiceCalc.totalIgst, false)}
                </td>
              )}
              <td style={{ padding: '8px', textAlign: 'right' }}>
                {formatIndianCurrency(invoiceCalc.grandTotal, false)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* ── Middle: GST Slabs Breakdown Table & Summary ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 20,
            marginBottom: 20,
            alignItems: 'flex-start',
          }}
        >
          {/* Rate-Wise GST Breakdown */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#475569',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}
            >
              GST Tax Breakdown
            </div>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 11,
                border: '1px solid #cbd5e1',
              }}
            >
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>Rate</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>Taxable Val (₹)</th>
                  {activeTaxMode === 'intrastate' ? (
                    <>
                      <th style={{ padding: '6px 8px', textAlign: 'right' }}>CGST (₹)</th>
                      <th style={{ padding: '6px 8px', textAlign: 'right' }}>SGST (₹)</th>
                    </>
                  ) : (
                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>IGST (₹)</th>
                  )}
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>Total Tax (₹)</th>
                </tr>
              </thead>
              <tbody>
                {invoiceCalc.rateBreakdown.map((r) => (
                  <tr key={r.rate} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '5px 8px', fontWeight: 600 }}>{r.rate}% GST</td>
                    <td style={{ padding: '5px 8px', textAlign: 'right' }}>
                      {formatIndianCurrency(r.taxableValue, false)}
                    </td>
                    {activeTaxMode === 'intrastate' ? (
                      <>
                        <td style={{ padding: '5px 8px', textAlign: 'right' }}>
                          {formatIndianCurrency(r.cgst, false)}
                        </td>
                        <td style={{ padding: '5px 8px', textAlign: 'right' }}>
                          {formatIndianCurrency(r.sgst, false)}
                        </td>
                      </>
                    ) : (
                      <td style={{ padding: '5px 8px', textAlign: 'right' }}>
                        {formatIndianCurrency(r.igst, false)}
                      </td>
                    )}
                    <td style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 700 }}>
                      {formatIndianCurrency(r.totalTax, false)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grand Totals Box */}
          <div
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              padding: '12px 16px',
              background: '#f8fafc',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <tbody>
                <tr>
                  <td style={{ padding: '4px 0', color: '#64748b' }}>Subtotal (Gross):</td>
                  <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                    {formatIndianCurrency(invoiceCalc.subtotal)}
                  </td>
                </tr>
                {invoiceCalc.totalDiscount > 0 && (
                  <tr>
                    <td style={{ padding: '4px 0', color: '#64748b' }}>Total Discount:</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 600, color: '#ef4444' }}>
                      - {formatIndianCurrency(invoiceCalc.totalDiscount)}
                    </td>
                  </tr>
                )}
                <tr style={{ borderTop: '1px dashed #cbd5e1' }}>
                  <td style={{ padding: '5px 0', color: '#334155', fontWeight: 600 }}>Taxable Value:</td>
                  <td style={{ padding: '5px 0', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                    {formatIndianCurrency(invoiceCalc.taxableValue)}
                  </td>
                </tr>
                {activeTaxMode === 'intrastate' ? (
                  <>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#64748b' }}>Central Tax (CGST):</td>
                      <td style={{ padding: '3px 0', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                        {formatIndianCurrency(invoiceCalc.totalCgst)}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#64748b' }}>State Tax (SGST):</td>
                      <td style={{ padding: '3px 0', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                        {formatIndianCurrency(invoiceCalc.totalSgst)}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td style={{ padding: '3px 0', color: '#64748b' }}>Integrated Tax (IGST):</td>
                    <td style={{ padding: '3px 0', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                      {formatIndianCurrency(invoiceCalc.totalIgst)}
                    </td>
                  </tr>
                )}
                <tr style={{ borderTop: '2px solid #0f172a' }}>
                  <td style={{ padding: '8px 0', fontSize: 14, fontWeight: 900, color: '#0f172a' }}>
                    Grand Total:
                  </td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontSize: 16, fontWeight: 900, color: '#0f172a' }}>
                    {formatIndianCurrency(invoiceCalc.grandTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Amount in Words ── */}
        <div
          style={{
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            padding: '10px 14px',
            background: '#ffffff',
            fontSize: 12,
            marginBottom: 20,
          }}
        >
          <strong style={{ color: '#475569' }}>Total Amount (in words): </strong>
          <span style={{ fontWeight: 800, color: '#0f172a' }}>{amountInWords}</span>
        </div>

        {/* ── Bottom Section: Bank Details, Terms & Signatory ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 20,
            borderTop: '1px solid #cbd5e1',
            paddingTop: 16,
          }}
        >
          {/* Bank & Terms */}
          <div>
            {(bankName || bankAccount) && (
              <div style={{ marginBottom: 14, fontSize: 11.5, color: '#334155' }}>
                <strong style={{ display: 'block', color: '#0f172a', marginBottom: 2 }}>
                  Bank Details for Remittance:
                </strong>
                {bankName && <div>Bank: {bankName}</div>}
                {bankAccount && <div>A/C No: {bankAccount}</div>}
                {bankIfsc && <div>IFSC Code: {bankIfsc}</div>}
                {bankBranch && <div>Branch: {bankBranch}</div>}
              </div>
            )}

            {terms && (
              <div style={{ fontSize: 10.5, color: '#64748b' }}>
                <strong style={{ display: 'block', color: '#334155', marginBottom: 2 }}>
                  Terms &amp; Conditions:
                </strong>
                <div style={{ whiteSpace: 'pre-line', lineHeight: 1.4 }}>{terms}</div>
              </div>
            )}
          </div>

          {/* Authorized Signature Block */}
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 48 }}>
              For {companyName || 'Business Name'}
            </div>
            <div style={{ borderTop: '1px solid #94a3b8', width: 180, marginLeft: 'auto', marginBottom: 4 }}></div>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
