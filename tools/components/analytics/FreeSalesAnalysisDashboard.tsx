import React, { useState, useRef, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Filter,
  Download,
  RotateCcw,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  ChevronDown,
  Layers,
  ShoppingBag,
  UserCheck,
  X,
  Search
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  detectColumnMappings,
  normalizeAndAuditSalesData,
  calculateKPIs,
  calculateFinancialYearSummary,
  calculateMonthlyTrends,
  calculateWeeklyTrends,
  calculateCustomerAnalysis,
  calculateDimensionBreakdown,
  filterSalesRecords,
  exportToCsv,
  type ColumnMapping,
  type DateFormatPreference,
  type InvoiceMode,
  type NormalizedSalesRecord,
  type DataQualityReport,
  type AnalysisFilter
} from '../../utils/salesAnalysisEngine';
import { formatIndianCurrency, formatNumber } from '../../utils/formatters';

export interface FreeSalesAnalysisDashboardProps {
  theme: 'dark' | 'light';
}

const RFM_COLORS: Record<string, string> = {
  VIP: '#10b981',      // Emerald Green
  Regular: '#3b82f6',  // Blue
  'At-Risk': '#f59e0b',// Amber
  New: '#8b5cf6'       // Purple
};

export const FreeSalesAnalysisDashboard: React.FC<FreeSalesAnalysisDashboardProps> = ({ theme }) => {
  // ── Step State ──
  // 1: Upload, 2: Column Mapping, 3: Dashboard
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // ── File & Workbook State ──
  const [file, setFile] = useState<File | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [workbookRaw, setWorkbookRaw] = useState<XLSX.WorkBook | null>(null);
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ── Configuration State ──
  const [mapping, setMapping] = useState<ColumnMapping>({
    dateCol: '',
    customerCol: '',
    amountCol: ''
  });
  const [datePreference, setDatePreference] = useState<DateFormatPreference>('AUTO');
  const [invoiceMode, setInvoiceMode] = useState<InvoiceMode>('INVOICE_LEVEL');

  // ── Processed Data State ──
  const [records, setRecords] = useState<NormalizedSalesRecord[]>([]);
  const [quality, setQuality] = useState<DataQualityReport | null>(null);
  const [showQualityModal, setShowQualityModal] = useState(false);

  // ── Dashboard Filter State ──
  const [filter, setFilter] = useState<AnalysisFilter>({
    financialYear: 'ALL',
    startDate: '',
    endDate: '',
    customer: '',
    product: '',
    salesperson: '',
    category: '',
    state: ''
  });

  // ── Active Dashboard Tab ──
  const [activeTab, setActiveTab] = useState<'overview' | 'financial_years' | 'monthly' | 'customers' | 'items' | 'raw_data'>('overview');

  // ── Table Pagination & Search ──
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerPage, setCustomerPage] = useState(1);
  const [rawSearch, setRawSearch] = useState('');
  const [rawPage, setRawPage] = useState(1);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Theme Helpers
  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const inputBg = dk ? '#151f30' : '#ffffff';
  const cardBg = dk ? '#0b1322' : '#ffffff';
  const headerBg = dk ? '#151f30' : '#f8fafc';
  const acc = '#ea580c'; // Vibrant brand orange

  // ─────────────────────────────────────────────────────────────
  // File Upload & Parsing (via SheetJS)
  // ─────────────────────────────────────────────────────────────

  const handleProcessFile = (selectedFile: File) => {
    setUploadError(null);
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls', 'txt'].includes(ext || '')) {
      setUploadError('Unsupported file type. Please upload a valid CSV, XLSX, or XLS file.');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          setUploadError('Unable to read file content.');
          return;
        }

        const wb = XLSX.read(data, { type: 'binary', cellDates: true });
        if (!wb.SheetNames || wb.SheetNames.length === 0) {
          setUploadError('No sheets found in workbook.');
          return;
        }

        setWorkbookRaw(wb);
        setSheetNames(wb.SheetNames);
        const initialSheet = wb.SheetNames[0];
        setSelectedSheet(initialSheet);
        loadSheetData(wb, initialSheet);
      } catch (err: any) {
        console.error('File parsing error:', err);
        setUploadError(`Failed to parse workbook: ${err.message || 'Corrupt or unreadable file'}`);
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read file.');
    };

    reader.readAsBinaryString(selectedFile);
  };

  const loadSheetData = (wb: XLSX.WorkBook, sheetName: string) => {
    const ws = wb.Sheets[sheetName];
    if (!ws) {
      setUploadError(`Sheet "${sheetName}" not found.`);
      return;
    }

    const rows: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });
    if (!rows || rows.length === 0) {
      setUploadError(`Sheet "${sheetName}" contains no readable rows.`);
      return;
    }

    const headers = Object.keys(rows[0]);
    setRawHeaders(headers);
    setRawRows(rows);

    // Auto-detect columns
    const detected = detectColumnMappings(headers);
    setMapping(detected);

    setStep(2); // Proceed to Column Mapping Step
  };

  const handleSheetChange = (newSheet: string) => {
    if (!workbookRaw) return;
    setSelectedSheet(newSheet);
    loadSheetData(workbookRaw, newSheet);
  };

  // ─────────────────────────────────────────────────────────────
  // Column Mapping & Analysis Execution
  // ─────────────────────────────────────────────────────────────

  const handleRunAnalysis = () => {
    if (!mapping.dateCol || !mapping.customerCol || !mapping.amountCol) {
      alert('Please map all required fields: Date, Customer, and Amount.');
      return;
    }

    const { records: normRecords, quality: qualReport } = normalizeAndAuditSalesData(
      rawRows,
      mapping,
      datePreference
    );

    if (normRecords.length === 0) {
      alert('No valid sales records could be parsed with current mappings. Please verify selected columns.');
      return;
    }

    setRecords(normRecords);
    setQuality(qualReport);
    setStep(3); // Enter Dashboard View
  };

  const handleResetAll = () => {
    setFile(null);
    setWorkbookRaw(null);
    setSheetNames([]);
    setSelectedSheet('');
    setRawHeaders([]);
    setRawRows([]);
    setRecords([]);
    setQuality(null);
    setStep(1);
    setFilter({
      financialYear: 'ALL',
      startDate: '',
      endDate: '',
      customer: '',
      product: '',
      salesperson: '',
      category: '',
      state: ''
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─────────────────────────────────────────────────────────────
  // Reactive Filtered Data & Metrics
  // ─────────────────────────────────────────────────────────────

  const filteredRecords = useMemo(() => {
    return filterSalesRecords(records, filter);
  }, [records, filter]);

  const kpis = useMemo(() => {
    return calculateKPIs(filteredRecords, invoiceMode);
  }, [filteredRecords, invoiceMode]);

  const fyMetrics = useMemo(() => {
    return calculateFinancialYearSummary(filteredRecords);
  }, [filteredRecords]);

  const monthlyTrends = useMemo(() => {
    return calculateMonthlyTrends(filteredRecords);
  }, [filteredRecords]);

  const customerMetrics = useMemo(() => {
    return calculateCustomerAnalysis(filteredRecords);
  }, [filteredRecords]);

  // Top Products (if mapped)
  const productMetrics = useMemo(() => {
    if (!mapping.productCol) return [];
    return calculateDimensionBreakdown(filteredRecords, 'product', 'quantity', 15);
  }, [filteredRecords, mapping.productCol]);

  // Salesperson Metrics (if mapped)
  const salespersonMetrics = useMemo(() => {
    if (!mapping.salespersonCol) return [];
    return calculateDimensionBreakdown(filteredRecords, 'salesperson', undefined, 15);
  }, [filteredRecords, mapping.salespersonCol]);

  // Category Metrics (if mapped)
  const categoryMetrics = useMemo(() => {
    if (!mapping.categoryCol) return [];
    return calculateDimensionBreakdown(filteredRecords, 'category', undefined, 10);
  }, [filteredRecords, mapping.categoryCol]);

  // State Metrics (if mapped)
  const stateMetrics = useMemo(() => {
    if (!mapping.stateCol) return [];
    return calculateDimensionBreakdown(filteredRecords, 'state', undefined, 10);
  }, [filteredRecords, mapping.stateCol]);

  // Payment Mode Metrics (if mapped)
  const paymentModeMetrics = useMemo(() => {
    if (!mapping.paymentModeCol) return [];
    return calculateDimensionBreakdown(filteredRecords, 'paymentMode', undefined, 8);
  }, [filteredRecords, mapping.paymentModeCol]);

  // RFM Segments Distribution
  const rfmDistribution = useMemo(() => {
    const counts: Record<string, number> = { VIP: 0, Regular: 0, 'At-Risk': 0, New: 0 };
    for (const c of customerMetrics) {
      counts[c.rfmSegment] = (counts[c.rfmSegment] || 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [customerMetrics]);

  // Available Filter Options
  const availableFYs = useMemo(() => {
    return Array.from(new Set(records.map(r => r.financialYear))).sort();
  }, [records]);

  const availableCustomers = useMemo(() => {
    return Array.from(new Set(records.map(r => r.customer))).sort();
  }, [records]);

  // ─────────────────────────────────────────────────────────────
  // Export Handlers
  // ─────────────────────────────────────────────────────────────

  const handleExportSummaryCsv = () => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Sales Revenue', formatIndianCurrency(kpis.totalSales)],
      ['Total Invoices', kpis.invoiceCount],
      ['Unique Customers', kpis.uniqueCustomers],
      ['Average Order Value (AOV)', formatIndianCurrency(kpis.averageOrderValue)],
      ['Total Quantity Sold', kpis.totalQuantity],
      ['Total GST Collected', formatIndianCurrency(kpis.totalGst)],
      ['Total Discounts', formatIndianCurrency(kpis.totalDiscount)],
      ['Net Revenue', formatIndianCurrency(kpis.netRevenue)],
      ['Active Filter FY', filter.financialYear || 'All'],
      ['Dataset Start Date', kpis.dateRange.minDate?.toLocaleDateString('en-IN') || 'N/A'],
      ['Dataset End Date', kpis.dateRange.maxDate?.toLocaleDateString('en-IN') || 'N/A']
    ];
    exportToCsv('sales_kpi_summary', headers, rows);
  };

  const handleExportCustomersCsv = () => {
    const headers = [
      'Customer Name',
      'Total Sales (INR)',
      'Invoice Count',
      'AOV (INR)',
      'First Purchase',
      'Last Purchase',
      'Recency (Days)',
      'RFM Score',
      'RFM Segment',
      'Sales Share %'
    ];
    const rows = customerMetrics.map(c => [
      c.customer,
      c.totalSales,
      c.invoiceCount,
      c.averageOrderValue,
      c.firstPurchase.toLocaleDateString('en-IN'),
      c.lastPurchase.toLocaleDateString('en-IN'),
      c.recencyDays,
      c.rfmScore,
      c.rfmSegment,
      `${c.salesSharePct}%`
    ]);
    exportToCsv('customer_rfm_analysis', headers, rows);
  };

  const handleExportFyCsv = () => {
    const headers = [
      'Financial Year',
      'Total Sales (INR)',
      'Invoice Count',
      'Unique Customers',
      'AOV (INR)',
      'YoY Growth %'
    ];
    const rows = fyMetrics.map(f => [
      f.financialYear,
      f.totalSales,
      f.invoiceCount,
      f.uniqueCustomers,
      f.averageOrderValue,
      f.yoyGrowthPct !== null ? `${f.yoyGrowthPct}%` : 'N/A'
    ]);
    exportToCsv('financial_year_summary', headers, rows);
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER: Step 1 - File Upload View
  // ─────────────────────────────────────────────────────────────

  if (step === 1) {
    return (
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              background: dk ? 'rgba(234, 88, 12, 0.15)' : 'rgba(234, 88, 12, 0.1)',
              color: acc,
              fontWeight: 700,
              fontSize: 13,
              marginBottom: 12
            }}
          >
            <ShieldCheck size={16} />
            <span>100% Client-Side Privacy • Zero Server Uploads</span>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: fg, margin: '0 0 10px 0' }}>
            Upload Sales Data Spreadsheet
          </h2>
          <p style={{ color: fg2, fontSize: 15, maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
            Upload your sales ledger, billing register, or invoice export (.csv, .xlsx, .xls) from Tally, Busy, Excel, or any ERP.
            All analytics and charts are generated entirely in your browser memory.
          </p>
        </div>

        {uploadError && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 18px',
              borderRadius: 10,
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              marginBottom: 24,
              fontSize: 14,
              fontWeight: 600
            }}
          >
            <AlertCircle size={18} />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Drag and drop upload box */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const dropped = e.dataTransfer.files?.[0];
            if (dropped) handleProcessFile(dropped);
          }}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${bdr}`,
            borderRadius: 16,
            padding: '56px 24px',
            textAlign: 'center',
            background: cardBg,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .xlsx, .xls, .txt"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleProcessFile(f);
            }}
            style={{ display: 'none' }}
          />
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: dk ? 'rgba(234, 88, 12, 0.2)' : 'rgba(234, 88, 12, 0.1)',
              color: acc,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px auto'
            }}
          >
            <FileSpreadsheet size={32} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: fg, margin: '0 0 8px 0' }}>
            Click to Browse or Drag & Drop File Here
          </h3>
          <p style={{ color: fg2, fontSize: 14, margin: '0 0 16px 0' }}>
            Supports <strong>.XLSX</strong>, <strong>.XLS</strong>, <strong>.CSV</strong>, and <strong>.TXT</strong> (Max tested up to 20,000 rows)
          </p>
          <button
            type="button"
            style={{
              background: acc,
              color: '#ffffff',
              border: 'none',
              padding: '10px 22px',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)'
            }}
          >
            <Upload size={16} />
            <span>Select File From Computer</span>
          </button>
        </div>

        {/* Informative Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 32 }}>
          <div style={{ padding: 16, borderRadius: 12, border: `1px solid ${bdr}`, background: cardBg }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: 14, fontWeight: 800, color: fg }}>Indian Financial Year (Apr - Mar)</h4>
            <p style={{ margin: 0, fontSize: 12.5, color: fg2, lineHeight: 1.5 }}>
              Automatically calculates FY 2024-25, FY 2025-26, etc. with fiscal month sorting (April to March) and YoY growth.
            </p>
          </div>
          <div style={{ padding: 16, borderRadius: 12, border: `1px solid ${bdr}`, background: cardBg }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: 14, fontWeight: 800, color: fg }}>Customer RFM Intelligence</h4>
            <p style={{ margin: 0, fontSize: 12.5, color: fg2, lineHeight: 1.5 }}>
              Identifies VIP buyers, consistent regulars, new acquisitions, and at-risk churn accounts via weighted RFM models.
            </p>
          </div>
          <div style={{ padding: 16, borderRadius: 12, border: `1px solid ${bdr}`, background: cardBg }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: 14, fontWeight: 800, color: fg }}>Flexible Column Mapping</h4>
            <p style={{ margin: 0, fontSize: 12.5, color: fg2, lineHeight: 1.5 }}>
              Works with any header names. Smartly auto-detects Date, Customer, Amount, Products, Invoices, and GST.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: Step 2 - Column Mapping View
  // ─────────────────────────────────────────────────────────────

  if (step === 2) {
    return (
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 800, color: acc, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Step 2 of 3: Column Mapping
            </span>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: fg, margin: '4px 0 0 0' }}>
              Map Your File Columns
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={handleResetAll}
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 8,
                border: `1px solid ${bdr}`,
                background: inputBg,
                color: fg2,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
              <span>Replace File</span>
            </button>
            <button
              onClick={handleRunAnalysis}
              type="button"
              style={{
                background: acc,
                color: '#ffffff',
                border: 'none',
                padding: '10px 22px',
                borderRadius: 8,
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)'
              }}
            >
              <span>Analyze Sales Data</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* File Meta Banner */}
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            border: `1px solid ${bdr}`,
            background: cardBg,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FileSpreadsheet size={24} color={acc} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: fg }}>{file?.name}</div>
              <div style={{ fontSize: 12.5, color: fg2 }}>
                {rawRows.length} rows detected • Size: {Math.round((file?.size || 0) / 1024)} KB
              </div>
            </div>
          </div>

          {/* Multiple sheets selector */}
          {sheetNames.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: fg2 }}>Selected Sheet:</label>
              <select
                value={selectedSheet}
                onChange={(e) => handleSheetChange(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: `1px solid ${bdr}`,
                  background: inputBg,
                  color: fg,
                  fontWeight: 600,
                  fontSize: 13
                }}
              >
                {sheetNames.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Mapping Controls Grid */}
        <div
          style={{
            background: cardBg,
            borderRadius: 16,
            border: `1px solid ${bdr}`,
            padding: 24,
            marginBottom: 24
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 800, color: fg, margin: '0 0 16px 0' }}>
            Required Columns
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
            {/* Date */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: fg, marginBottom: 6 }}>
                Transaction Date <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={mapping.dateCol}
                onChange={(e) => setMapping({ ...mapping, dateCol: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: `1px solid ${mapping.dateCol ? bdr : '#ef4444'}`,
                  background: inputBg,
                  color: fg,
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                <option value="">-- Select Date Column --</option>
                {rawHeaders.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Customer */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: fg, marginBottom: 6 }}>
                Customer / Party Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={mapping.customerCol}
                onChange={(e) => setMapping({ ...mapping, customerCol: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: `1px solid ${mapping.customerCol ? bdr : '#ef4444'}`,
                  background: inputBg,
                  color: fg,
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                <option value="">-- Select Customer Column --</option>
                {rawHeaders.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: fg, marginBottom: 6 }}>
                Sales Amount / Value <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={mapping.amountCol}
                onChange={(e) => setMapping({ ...mapping, amountCol: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: `1px solid ${mapping.amountCol ? bdr : '#ef4444'}`,
                  background: inputBg,
                  color: fg,
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                <option value="">-- Select Amount Column --</option>
                {rawHeaders.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 800, color: fg, margin: '24px 0 16px 0', borderTop: `1px solid ${bdr}`, paddingTop: 20 }}>
            Optional Contextual Columns
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {/* Invoice No */}
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg2, marginBottom: 6 }}>
                Invoice / Bill Number
              </label>
              <select
                value={mapping.invoiceCol || ''}
                onChange={(e) => setMapping({ ...mapping, invoiceCol: e.target.value || undefined })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
              >
                <option value="">-- None --</option>
                {rawHeaders.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Product */}
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg2, marginBottom: 6 }}>
                Product / Item Name
              </label>
              <select
                value={mapping.productCol || ''}
                onChange={(e) => setMapping({ ...mapping, productCol: e.target.value || undefined })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
              >
                <option value="">-- None --</option>
                {rawHeaders.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg2, marginBottom: 6 }}>
                Quantity Sold
              </label>
              <select
                value={mapping.quantityCol || ''}
                onChange={(e) => setMapping({ ...mapping, quantityCol: e.target.value || undefined })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
              >
                <option value="">-- None --</option>
                {rawHeaders.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Salesperson */}
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg2, marginBottom: 6 }}>
                Salesperson / Executive
              </label>
              <select
                value={mapping.salespersonCol || ''}
                onChange={(e) => setMapping({ ...mapping, salespersonCol: e.target.value || undefined })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
              >
                <option value="">-- None --</option>
                {rawHeaders.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg2, marginBottom: 6 }}>
                Product Category / Group
              </label>
              <select
                value={mapping.categoryCol || ''}
                onChange={(e) => setMapping({ ...mapping, categoryCol: e.target.value || undefined })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
              >
                <option value="">-- None --</option>
                {rawHeaders.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg2, marginBottom: 6 }}>
                State / Place of Supply
              </label>
              <select
                value={mapping.stateCol || ''}
                onChange={(e) => setMapping({ ...mapping, stateCol: e.target.value || undefined })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
              >
                <option value="">-- None --</option>
                {rawHeaders.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced Preferences */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 24, paddingTop: 20, borderTop: `1px solid ${bdr}` }}>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                Date Format Interpretation
              </label>
              <select
                value={datePreference}
                onChange={(e) => setDatePreference(e.target.value as any)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
              >
                <option value="AUTO">Auto Detect (Recommended)</option>
                <option value="DMY">DD/MM/YYYY (Indian Standard)</option>
                <option value="YMD">YYYY-MM-DD (ISO Format)</option>
                <option value="MDY">MM/DD/YYYY (US Format)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                Dataset Structure Mode
              </label>
              <select
                value={invoiceMode}
                onChange={(e) => setInvoiceMode(e.target.value as any)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
              >
                <option value="INVOICE_LEVEL">Invoice-Level (1 Row = 1 Invoice)</option>
                <option value="INVOICE_LINE_LEVEL">Invoice-Line-Level (Multiple Rows per Invoice)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Preview Table (First 5 Rows) */}
        <div style={{ background: cardBg, borderRadius: 16, border: `1px solid ${bdr}`, padding: 20, overflowX: 'auto' }}>
          <h4 style={{ fontSize: 14, fontWeight: 800, color: fg, margin: '0 0 12px 0' }}>
            Data Preview (First 5 Rows)
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: headerBg, borderBottom: `1px solid ${bdr}` }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: fg2 }}>#</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: acc }}>Date ({mapping.dateCol || 'Unmapped'})</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: acc }}>Customer ({mapping.customerCol || 'Unmapped'})</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', color: acc }}>Amount ({mapping.amountCol || 'Unmapped'})</th>
                {mapping.invoiceCol && <th style={{ padding: '8px 12px', textAlign: 'left', color: fg2 }}>Invoice No</th>}
                {mapping.productCol && <th style={{ padding: '8px 12px', textAlign: 'left', color: fg2 }}>Product</th>}
              </tr>
            </thead>
            <tbody>
              {rawRows.slice(0, 5).map((row, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${bdr}` }}>
                  <td style={{ padding: '8px 12px', color: fg2 }}>{idx + 1}</td>
                  <td style={{ padding: '8px 12px', color: fg }}>{String(row[mapping.dateCol] || '-')}</td>
                  <td style={{ padding: '8px 12px', color: fg, fontWeight: 600 }}>{String(row[mapping.customerCol] || '-')}</td>
                  <td style={{ padding: '8px 12px', color: fg, textAlign: 'right', fontWeight: 700 }}>{String(row[mapping.amountCol] || '-')}</td>
                  {mapping.invoiceCol && <td style={{ padding: '8px 12px', color: fg2 }}>{String(row[mapping.invoiceCol] || '-')}</td>}
                  {mapping.productCol && <td style={{ padding: '8px 12px', color: fg2 }}>{String(row[mapping.productCol] || '-')}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: Step 3 - Interactive Dashboard View
  // ─────────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px' }}>
      {/* Top Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '16px 20px',
          borderRadius: 14,
          border: `1px solid ${bdr}`,
          background: cardBg,
          marginBottom: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: dk ? 'rgba(234, 88, 12, 0.2)' : 'rgba(234, 88, 12, 0.1)',
              color: acc,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <TrendingUp size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: fg, margin: 0 }}>
              Sales Analysis Dashboard
            </h2>
            <div style={{ fontSize: 12.5, color: fg2 }}>
              {file?.name} • {records.length} Analyzed Records • Indian FY (Apr-Mar)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setStep(2)}
            type="button"
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: `1px solid ${bdr}`,
              background: inputBg,
              color: fg,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Edit Mappings
          </button>
          <button
            onClick={handleResetAll}
            type="button"
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: `1px solid ${bdr}`,
              background: inputBg,
              color: fg2,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <RotateCcw size={14} />
            <span>Upload New</span>
          </button>
          <button
            onClick={handleExportSummaryCsv}
            type="button"
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: 'none',
              background: acc,
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Download size={14} />
            <span>Export Summary CSV</span>
          </button>
        </div>
      </div>

      {/* Data Quality Health Alert Bar */}
      {quality && (
        <div
          style={{
            padding: '10px 16px',
            borderRadius: 10,
            border: `1px solid ${quality.invalidRows > 0 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.3)'}`,
            background: quality.invalidRows > 0 ? (dk ? 'rgba(245, 158, 11, 0.12)' : '#fffbeb') : (dk ? 'rgba(16, 185, 129, 0.1)' : '#f0fdf4'),
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 13,
            flexWrap: 'wrap',
            gap: 8
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {quality.invalidRows > 0 ? <AlertCircle size={16} color="#f59e0b" /> : <CheckCircle2 size={16} color="#10b981" />}
            <span style={{ color: fg, fontWeight: 600 }}>
              {quality.validRows} rows healthy & analyzed.
              {quality.invalidRows > 0 && ` (${quality.invalidRows} rows excluded due to missing dates or unreadable amounts).`}
              {quality.negativeAmounts > 0 && ` ${quality.negativeAmounts} negative return/credit rows included.`}
            </span>
          </div>
          {quality.invalidRows > 0 && (
            <button
              onClick={() => setShowQualityModal(true)}
              type="button"
              style={{
                background: 'transparent',
                border: 'none',
                color: acc,
                fontSize: 12.5,
                fontWeight: 700,
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              Inspect Excluded Rows ({quality.invalidRows})
            </button>
          )}
        </div>
      )}

      {/* Global Filter Toolbar */}
      <div
        style={{
          padding: '12px 16px',
          borderRadius: 12,
          border: `1px solid ${bdr}`,
          background: cardBg,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: fg2, fontSize: 13, fontWeight: 700 }}>
          <Filter size={15} color={acc} />
          <span>Filters:</span>
        </div>

        {/* FY Selector */}
        <select
          value={filter.financialYear || 'ALL'}
          onChange={(e) => setFilter({ ...filter, financialYear: e.target.value })}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: `1px solid ${bdr}`,
            background: inputBg,
            color: fg,
            fontSize: 13,
            fontWeight: 600
          }}
        >
          <option value="ALL">All Financial Years</option>
          {availableFYs.map(fy => (
            <option key={fy} value={fy}>{fy}</option>
          ))}
        </select>

        {/* Customer Filter */}
        <select
          value={filter.customer || ''}
          onChange={(e) => setFilter({ ...filter, customer: e.target.value })}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: `1px solid ${bdr}`,
            background: inputBg,
            color: fg,
            fontSize: 13,
            maxWidth: 180,
            fontWeight: 600
          }}
        >
          <option value="">All Customers ({availableCustomers.length})</option>
          {availableCustomers.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Product Filter (if mapped) */}
        {mapping.productCol && (
          <select
            value={filter.product || ''}
            onChange={(e) => setFilter({ ...filter, product: e.target.value })}
            style={{ padding: '6px 10px', borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13, maxWidth: 160, fontWeight: 600 }}
          >
            <option value="">All Products</option>
            {productMetrics.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        )}

        {/* Reset Filter Button */}
        {(filter.financialYear !== 'ALL' || filter.customer || filter.product || filter.startDate) && (
          <button
            onClick={() => setFilter({ financialYear: 'ALL', customer: '', product: '', startDate: '', endDate: '' })}
            type="button"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <X size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
        {/* Total Sales */}
        <div style={{ padding: 18, borderRadius: 14, border: `1px solid ${bdr}`, background: cardBg }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: fg2 }}>Total Sales Revenue</span>
            <DollarSign size={18} color={acc} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: fg }}>
            {formatIndianCurrency(kpis.totalSales)}
          </div>
          <div style={{ fontSize: 12, color: fg2, marginTop: 4 }}>
            Net Realization: {formatIndianCurrency(kpis.netRevenue)}
          </div>
        </div>

        {/* Invoice Count */}
        <div style={{ padding: 18, borderRadius: 14, border: `1px solid ${bdr}`, background: cardBg }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: fg2 }}>Invoices / Orders</span>
            <FileSpreadsheet size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: fg }}>
            {formatNumber(kpis.invoiceCount, 0)}
          </div>
          <div style={{ fontSize: 12, color: fg2, marginTop: 4 }}>
            Mode: {invoiceMode === 'INVOICE_LINE_LEVEL' ? 'Distinct Invoices' : 'Row Invoices'}
          </div>
        </div>

        {/* Unique Customers */}
        <div style={{ padding: 18, borderRadius: 14, border: `1px solid ${bdr}`, background: cardBg }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: fg2 }}>Unique Customers</span>
            <Users size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: fg }}>
            {formatNumber(kpis.uniqueCustomers, 0)}
          </div>
          <div style={{ fontSize: 12, color: fg2, marginTop: 4 }}>
            Avg {(kpis.invoiceCount / (kpis.uniqueCustomers || 1)).toFixed(1)} orders / customer
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div style={{ padding: 18, borderRadius: 14, border: `1px solid ${bdr}`, background: cardBg }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: fg2 }}>Average Order Value (AOV)</span>
            <Award size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: fg }}>
            {formatIndianCurrency(kpis.averageOrderValue)}
          </div>
          <div style={{ fontSize: 12, color: fg2, marginTop: 4 }}>
            Total Sales ÷ Total Invoices
          </div>
        </div>
      </div>

      {/* Dashboard Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          borderBottom: `1px solid ${bdr}`,
          marginBottom: 20,
          overflowX: 'auto',
          paddingBottom: 4
        }}
      >
        {[
          { id: 'overview', label: 'Dashboard Overview' },
          { id: 'financial_years', label: 'Financial Years (Apr-Mar)' },
          { id: 'monthly', label: 'Monthly Trends' },
          { id: 'customers', label: `Customer & RFM Insights (${customerMetrics.length})` },
          ...(mapping.productCol ? [{ id: 'items', label: 'Products & Items' }] : []),
          { id: 'raw_data', label: 'Data Records' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            type="button"
            style={{
              padding: '10px 18px',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              borderBottom: activeTab === t.id ? `3px solid ${acc}` : '3px solid transparent',
              background: activeTab === t.id ? (dk ? 'rgba(255,255,255,0.04)' : '#ffffff') : 'transparent',
              color: activeTab === t.id ? acc : fg2,
              fontWeight: 800,
              fontSize: 13.5,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB CONTENT: OVERVIEW
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 20 }}>
          {/* Chart 1: Monthly Sales Trend (Apr to Mar) */}
          <div style={{ padding: 20, borderRadius: 14, border: `1px solid ${bdr}`, background: cardBg }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: fg, margin: '0 0 4px 0' }}>
                  Monthly Sales Trend (Fiscal April → March)
                </h3>
                <span style={{ fontSize: 12, color: fg2 }}>Chronological Indian fiscal year distribution</span>
              </div>
            </div>
            <div style={{ height: 280, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dk ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="monthKey" stroke={fg2} fontSize={12} />
                  <YAxis stroke={fg2} fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: dk ? '#0f172a' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 8 }}
                    formatter={(val: any) => [formatIndianCurrency(Number(val)), 'Sales']}
                  />
                  <Bar dataKey="totalSales" fill={acc} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Customer RFM Segmentation */}
          <div style={{ padding: 20, borderRadius: 14, border: `1px solid ${bdr}`, background: cardBg }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: fg, margin: '0 0 4px 0' }}>
                  Customer RFM Segmentation
                </h3>
                <span style={{ fontSize: 12, color: fg2 }}>VIP, Regular, At-Risk, and New Buyer breakdown</span>
              </div>
            </div>
            <div style={{ height: 280, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rfmDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {rfmDistribution.map((entry) => (
                      <Cell key={entry.name} fill={RFM_COLORS[entry.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: dk ? '#0f172a' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 8 }}
                    formatter={(val: any, name: any) => [`${val} Customers`, name]}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Top 10 Customers by Revenue */}
          <div style={{ padding: 20, borderRadius: 14, border: `1px solid ${bdr}`, background: cardBg }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: fg, margin: '0 0 4px 0' }}>
                  Top 10 Buyers by Sales Volume
                </h3>
                <span style={{ fontSize: 12, color: fg2 }}>Highest revenue contributing customer accounts</span>
              </div>
            </div>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerMetrics.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={dk ? '#1e293b' : '#f1f5f9'} />
                  <XAxis type="number" stroke={fg2} fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="customer" width={110} stroke={fg2} fontSize={11} />
                  <Tooltip
                    contentStyle={{ background: dk ? '#0f172a' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 8 }}
                    formatter={(val: any) => [formatIndianCurrency(Number(val)), 'Sales']}
                  />
                  <Bar dataKey="totalSales" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Financial Year YoY Comparison */}
          <div style={{ padding: 20, borderRadius: 14, border: `1px solid ${bdr}`, background: cardBg }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: fg, margin: '0 0 4px 0' }}>
                  Financial Year Performance Comparison
                </h3>
                <span style={{ fontSize: 12, color: fg2 }}>Total sales realization across financial years</span>
              </div>
            </div>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dk ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="financialYear" stroke={fg2} fontSize={12} />
                  <YAxis stroke={fg2} fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: dk ? '#0f172a' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 8 }}
                    formatter={(val: any) => [formatIndianCurrency(Number(val)), 'Sales']}
                  />
                  <Bar dataKey="totalSales" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB CONTENT: FINANCIAL YEARS TABLE
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'financial_years' && (
        <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${bdr}`, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: fg, margin: 0 }}>
              Indian Financial Year Breakdown (April 1 to March 31)
            </h3>
            <button
              onClick={handleExportFyCsv}
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                border: `1px solid ${bdr}`,
                background: inputBg,
                color: fg,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Download size={14} />
              <span>Export FY CSV</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: headerBg, borderBottom: `1px solid ${bdr}` }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: fg }}>Financial Year</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>Total Sales</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>Orders / Invoices</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>Active Buyers</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>Avg Order Value (AOV)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>YoY Growth</th>
                </tr>
              </thead>
              <tbody>
                {fyMetrics.map((f) => (
                  <tr key={f.financialYear} style={{ borderBottom: `1px solid ${bdr}` }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: acc }}>{f.financialYear}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: fg }}>{formatIndianCurrency(f.totalSales)}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: fg2 }}>{formatNumber(f.invoiceCount, 0)}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: fg2 }}>{formatNumber(f.uniqueCustomers, 0)}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: fg }}>{formatIndianCurrency(f.averageOrderValue)}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700 }}>
                      {f.yoyGrowthPct !== null ? (
                        <span style={{ color: f.yoyGrowthPct >= 0 ? '#10b981' : '#ef4444' }}>
                          {f.yoyGrowthPct >= 0 ? '+' : ''}{f.yoyGrowthPct}%
                        </span>
                      ) : (
                        <span style={{ color: fg2 }}>Base Year</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB CONTENT: MONTHLY TRENDS
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'monthly' && (
        <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${bdr}`, padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: fg, margin: '0 0 16px 0' }}>
            Fiscal Month Sales Progression (April → March)
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: headerBg, borderBottom: `1px solid ${bdr}` }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: fg }}>Fiscal Month</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>Total Sales</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>Invoice Count</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>Avg Order Value</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>Annual Share</th>
                </tr>
              </thead>
              <tbody>
                {monthlyTrends.map((m) => (
                  <tr key={m.monthKey} style={{ borderBottom: `1px solid ${bdr}` }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: fg }}>
                      Month {m.fiscalOrder}: {m.monthKey}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: fg }}>
                      {formatIndianCurrency(m.totalSales)}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: fg2 }}>
                      {formatNumber(m.invoiceCount, 0)}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>
                      {formatIndianCurrency(m.averageOrderValue)}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: acc }}>
                      {m.sharePct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB CONTENT: CUSTOMERS & RFM
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'customers' && (
        <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${bdr}`, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: fg, margin: '0 0 4px 0' }}>
                Customer Ledger & RFM Classification
              </h3>
              <span style={{ fontSize: 12, color: fg2 }}>
                RFM Model: 45% Monetary Value • 35% Frequency • 20% Purchase Recency
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: fg2 }} />
                <input
                  type="text"
                  placeholder="Search customer name..."
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setCustomerPage(1);
                  }}
                  style={{
                    padding: '6px 12px 6px 30px',
                    borderRadius: 6,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 13,
                    width: 200
                  }}
                />
              </div>
              <button
                onClick={handleExportCustomersCsv}
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: `1px solid ${bdr}`,
                  background: inputBg,
                  color: fg,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Customer Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: headerBg, borderBottom: `1px solid ${bdr}` }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: fg }}>Customer Account</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>Total Sales</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>Orders</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>AOV</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', color: fg }}>Last Purchase</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', color: fg }}>Recency</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', color: fg }}>RFM Score</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', color: fg }}>Segment</th>
                </tr>
              </thead>
              <tbody>
                {customerMetrics
                  .filter(c => c.customer.toLowerCase().includes(customerSearch.toLowerCase()))
                  .slice((customerPage - 1) * 15, customerPage * 15)
                  .map((c) => (
                    <tr key={c.customer} style={{ borderBottom: `1px solid ${bdr}` }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: fg }}>{c.customer}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: fg }}>
                        {formatIndianCurrency(c.totalSales)}
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', color: fg2 }}>{c.invoiceCount}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>{formatIndianCurrency(c.averageOrderValue)}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', color: fg2 }}>{c.lastPurchase.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', color: fg2 }}>{c.recencyDays}d ago</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 800, color: acc }}>{c.rfmScore}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 800,
                            background: `${RFM_COLORS[c.rfmSegment]}20`,
                            color: RFM_COLORS[c.rfmSegment]
                          }}
                        >
                          {c.rfmSegment}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
            <span style={{ fontSize: 12.5, color: fg2 }}>
              Showing {Math.min(15, customerMetrics.length)} of {customerMetrics.length} customers
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                disabled={customerPage <= 1}
                onClick={() => setCustomerPage(p => p - 1)}
                type="button"
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: `1px solid ${bdr}`,
                  background: inputBg,
                  color: fg,
                  fontSize: 12,
                  cursor: customerPage <= 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Prev
              </button>
              <button
                disabled={customerPage * 15 >= customerMetrics.length}
                onClick={() => setCustomerPage(p => p + 1)}
                type="button"
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: `1px solid ${bdr}`,
                  background: inputBg,
                  color: fg,
                  fontSize: 12,
                  cursor: customerPage * 15 >= customerMetrics.length ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB CONTENT: ITEMS & CATEGORIES (IF MAPPED)
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'items' && mapping.productCol && (
        <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${bdr}`, padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: fg, margin: '0 0 16px 0' }}>
            Product & SKU Sales Analysis
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: headerBg, borderBottom: `1px solid ${bdr}` }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: fg }}>Product Description</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>Revenue Realized</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>Quantity Sold</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>Avg Unit Price</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>Sales Share</th>
                </tr>
              </thead>
              <tbody>
                {productMetrics.map((p) => (
                  <tr key={p.name} style={{ borderBottom: `1px solid ${bdr}` }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: fg }}>{p.name}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: fg }}>{formatIndianCurrency(p.totalSales)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: fg2 }}>{p.totalQuantity || '-'}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: fg }}>{p.averagePrice ? formatIndianCurrency(p.averagePrice) : '-'}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: acc }}>{p.sharePct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB CONTENT: RAW DATA AUDIT
      ────────────────────────────────────────────────────────────── */}
      {activeTab === 'raw_data' && (
        <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${bdr}`, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: fg, margin: 0 }}>
              Analyzed Sales Records ({records.length})
            </h3>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: fg2 }} />
              <input
                type="text"
                placeholder="Search raw records..."
                value={rawSearch}
                onChange={(e) => {
                  setRawSearch(e.target.value);
                  setRawPage(1);
                }}
                style={{
                  padding: '6px 12px 6px 30px',
                  borderRadius: 6,
                  border: `1px solid ${bdr}`,
                  background: inputBg,
                  color: fg,
                  fontSize: 13,
                  width: 220
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: headerBg, borderBottom: `1px solid ${bdr}` }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left', color: fg2 }}>Row</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', color: fg }}>Date</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', color: fg }}>FY</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', color: fg }}>Customer</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right', color: fg }}>Amount</th>
                  {mapping.invoiceCol && <th style={{ padding: '8px 12px', textAlign: 'left', color: fg2 }}>Invoice</th>}
                  {mapping.productCol && <th style={{ padding: '8px 12px', textAlign: 'left', color: fg2 }}>Product</th>}
                </tr>
              </thead>
              <tbody>
                {records
                  .filter(r => r.customer.toLowerCase().includes(rawSearch.toLowerCase()) || (r.invoiceNo && r.invoiceNo.toLowerCase().includes(rawSearch.toLowerCase())))
                  .slice((rawPage - 1) * 20, rawPage * 20)
                  .map((r) => (
                    <tr key={r.rowIndex} style={{ borderBottom: `1px solid ${bdr}` }}>
                      <td style={{ padding: '8px 12px', color: fg2 }}>{r.rowIndex}</td>
                      <td style={{ padding: '8px 12px', color: fg }}>{r.dateStr}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: acc }}>{r.financialYear}</td>
                      <td style={{ padding: '8px 12px', color: fg, fontWeight: 600 }}>{r.customer}</td>
                      <td style={{ padding: '8px 12px', color: fg, textAlign: 'right', fontWeight: 700 }}>{formatIndianCurrency(r.amount)}</td>
                      {mapping.invoiceCol && <td style={{ padding: '8px 12px', color: fg2 }}>{r.invoiceNo || '-'}</td>}
                      {mapping.productCol && <td style={{ padding: '8px 12px', color: fg2 }}>{r.product || '-'}</td>}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
            <span style={{ fontSize: 12.5, color: fg2 }}>
              Page {rawPage} of {Math.ceil(records.length / 20)}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                disabled={rawPage <= 1}
                onClick={() => setRawPage(p => p - 1)}
                type="button"
                style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 12, cursor: rawPage <= 1 ? 'not-allowed' : 'pointer' }}
              >
                Prev
              </button>
              <button
                disabled={rawPage * 20 >= records.length}
                onClick={() => setRawPage(p => p + 1)}
                type="button"
                style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 12, cursor: rawPage * 20 >= records.length ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: Flagged / Excluded Rows Audit
      ────────────────────────────────────────────────────────────── */}
      {showQualityModal && quality && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16
          }}
        >
          <div
            style={{
              background: cardBg,
              borderRadius: 16,
              border: `1px solid ${bdr}`,
              width: '100%',
              maxWidth: 720,
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={20} color="#f59e0b" />
                <h3 style={{ fontSize: 16, fontWeight: 800, color: fg, margin: 0 }}>
                  Data Hygiene Audit ({quality.invalidRows} Excluded Rows)
                </h3>
              </div>
              <button
                onClick={() => setShowQualityModal(false)}
                type="button"
                style={{ background: 'transparent', border: 'none', color: fg2, cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
              <p style={{ fontSize: 13, color: fg2, margin: '0 0 16px 0', lineHeight: 1.5 }}>
                These rows were omitted from sales calculations because they were missing required date, customer, or numeric amount values.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {quality.flaggedRows.map((item) => (
                  <div
                    key={item.rowIndex}
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      border: `1px solid ${bdr}`,
                      background: inputBg,
                      fontSize: 12.5
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontWeight: 800, color: fg }}>Source Row #{item.rowIndex}</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {item.reasons.map((r, i) => (
                          <span
                            key={i}
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#ef4444',
                              padding: '2px 6px',
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 700
                            }}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ color: fg2, fontFamily: 'monospace', fontSize: 11.5, wordBreak: 'break-all' }}>
                      {JSON.stringify(item.sampleData)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '14px 20px', borderTop: `1px solid ${bdr}`, textAlign: 'right' }}>
              <button
                onClick={() => setShowQualityModal(false)}
                type="button"
                style={{
                  background: inputBg,
                  border: `1px solid ${bdr}`,
                  color: fg,
                  padding: '8px 16px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
