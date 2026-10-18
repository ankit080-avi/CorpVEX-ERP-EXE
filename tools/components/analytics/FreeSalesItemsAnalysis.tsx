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
  Package,
  Boxes,
  Tag,
  Search,
  X,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  detectColumnMappings,
  normalizeAndAuditSalesData,
  filterSalesRecords,
  calculateProductKPIs,
  calculateTopProducts,
  calculateProductVariantAnalysis,
  calculateYearlyProductAnalysis,
  calculateMonthlyProductTrend,
  calculateProductCustomerCrossAnalysis,
  calculateCategoryAndBrandBreakdown,
  exportToCsv,
  type ColumnMapping,
  type DateFormatPreference,
  type InvoiceMode,
  type NormalizedSalesRecord,
  type DataQualityReport,
  type AnalysisFilter
} from '../../utils/salesAnalysisEngine';
import { formatIndianCurrency, formatNumber } from '../../utils/formatters';

export interface FreeSalesItemsAnalysisProps {
  theme: 'dark' | 'light';
}

const CLASSIFICATION_COLORS: Record<string, { bg: string; text: string; bdr: string }> = {
  Star: { bg: '#ecfdf5', text: '#059669', bdr: '#a7f3d0' },
  Growth: { bg: '#eff6ff', text: '#2563eb', bdr: '#bfdbfe' },
  Stable: { bg: '#f8fafc', text: '#475569', bdr: '#cbd5e1' },
  'Low Performer': { bg: '#fff1f2', text: '#e11d48', bdr: '#fecdd3' }
};

export const FreeSalesItemsAnalysis: React.FC<FreeSalesItemsAnalysisProps> = ({ theme }) => {
  // ── Step Navigation (1: Upload, 2: Column Mapping, 3: Dashboard) ──
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // ── File & Parsing State ──
  const [file, setFile] = useState<File | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [workbookRaw, setWorkbookRaw] = useState<XLSX.WorkBook | null>(null);
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ── Column Mapping State (Product Required, Date Required, Amount Required) ──
  const [mapping, setMapping] = useState<ColumnMapping>({
    dateCol: '',
    customerCol: '',
    amountCol: '',
    productCol: ''
  });
  const [datePreference, setDatePreference] = useState<DateFormatPreference>('AUTO');
  const [invoiceMode, setInvoiceMode] = useState<InvoiceMode>('INVOICE_LEVEL');

  // ── Normalized Records & Hygiene Report ──
  const [records, setRecords] = useState<NormalizedSalesRecord[]>([]);
  const [quality, setQuality] = useState<DataQualityReport | null>(null);
  const [showQualityModal, setShowQualityModal] = useState(false);

  // ── Dashboard Filter State ──
  const [filter, setFilter] = useState<AnalysisFilter>({
    financialYear: 'ALL',
    startDate: '',
    endDate: '',
    product: '',
    variant: '',
    brand: '',
    category: '',
    customer: ''
  });

  // ── Active Tab ──
  const [activeTab, setActiveTab] = useState<'top_products' | 'variants' | 'financial_years' | 'monthly' | 'categories' | 'customers' | 'raw_data'>('top_products');

  // ── Product View Controls ──
  const [topLimit, setTopLimit] = useState<number>(25);
  const [sortBy, setSortBy] = useState<'sales' | 'quantity' | 'invoices'>('sales');
  const [selectedProductForTrend, setSelectedProductForTrend] = useState<string>('');
  const [productSearch, setProductSearch] = useState('');
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
  const acc = '#0284c7'; // Vibrant sky blue accent for item analytics

  // ─────────────────────────────────────────────────────────────
  // File Upload & Sheet Handling
  // ─────────────────────────────────────────────────────────────
  const handleProcessFile = (selectedFile: File) => {
    setUploadError(null);
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls', 'txt'].includes(ext || '')) {
      setUploadError('Please upload a valid spreadsheet file (.xlsx, .xls, .csv).');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array', cellDates: true });
        setWorkbookRaw(wb);
        setSheetNames(wb.SheetNames);
        const firstSheet = wb.SheetNames[0];
        setSelectedSheet(firstSheet);
        loadWorksheetData(wb, firstSheet);
      } catch (err: any) {
        console.error('File parsing error:', err);
        setUploadError(`Failed to parse file: ${err.message || 'Corrupt or unsupported format.'}`);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const loadWorksheetData = (wb: XLSX.WorkBook, sheetName: string) => {
    const ws = wb.Sheets[sheetName];
    if (!ws) return;

    const jsonData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    if (!jsonData || jsonData.length === 0) {
      setUploadError('The selected worksheet is completely empty.');
      return;
    }

    // Identify header row (first row with >= 2 non-empty values)
    let headerIdx = 0;
    while (headerIdx < Math.min(10, jsonData.length)) {
      const nonEmpties = jsonData[headerIdx].filter((c) => String(c).trim().length > 0);
      if (nonEmpties.length >= 2) break;
      headerIdx++;
    }

    const headers = jsonData[headerIdx].map((h) => String(h || '').trim()).filter(Boolean);
    const dataRows = jsonData.slice(headerIdx + 1);

    const rowObjects = dataRows
      .map((r) => {
        const obj: Record<string, any> = {};
        headers.forEach((h, i) => {
          obj[h] = r[i];
        });
        return obj;
      })
      .filter((row) => Object.values(row).some((val) => String(val).trim().length > 0));

    setRawHeaders(headers);
    setRawRows(rowObjects);

    // Auto-detect columns
    const detected = detectColumnMappings(headers);
    setMapping(detected);
    setStep(2);
  };

  const handleSheetChange = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (workbookRaw) {
      loadWorksheetData(workbookRaw, sheetName);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Load Demo Product Sales Dataset
  // ─────────────────────────────────────────────────────────────
  const loadDemoProductData = () => {
    const demoHeaders = [
      'Invoice Date',
      'Invoice No',
      'Product Name',
      'Variant Size',
      'Brand',
      'Category',
      'Customer',
      'Quantity',
      'Unit Price',
      'Net Amount'
    ];

    const demoRows = [
      { 'Invoice Date': '15/04/2024', 'Invoice No': 'INV-2024-001', 'Product Name': 'Oxford Formal Shirt', 'Variant Size': 'M', Brand: 'Corpwear', Category: 'Apparel', Customer: 'Apex Logistics', Quantity: 20, 'Unit Price': 1200, 'Net Amount': 24000 },
      { 'Invoice Date': '18/04/2024', 'Invoice No': 'INV-2024-002', 'Product Name': 'Oxford Formal Shirt', 'Variant Size': 'L', Brand: 'Corpwear', Category: 'Apparel', Customer: 'Global Traders', Quantity: 35, 'Unit Price': 1200, 'Net Amount': 42000 },
      { 'Invoice Date': '22/05/2024', 'Invoice No': 'INV-2024-003', 'Product Name': 'Cotton Chinos', 'Variant Size': '32', Brand: 'Corpwear', Category: 'Apparel', Customer: 'Sunrise Textiles', Quantity: 15, 'Unit Price': 1500, 'Net Amount': 22500 },
      { 'Invoice Date': '10/06/2024', 'Invoice No': 'INV-2024-004', 'Product Name': 'Leather Formal Shoes', 'Variant Size': '9', Brand: 'StepCraft', Category: 'Footwear', Customer: 'Zenith Retails', Quantity: 10, 'Unit Price': 2800, 'Net Amount': 28000 },
      { 'Invoice Date': '15/07/2024', 'Invoice No': 'INV-2024-005', 'Product Name': 'Polo T-Shirt', 'Variant Size': 'L', Brand: 'UrbanFit', Category: 'Casuals', Customer: 'Metro Agencies', Quantity: 50, 'Unit Price': 650, 'Net Amount': 32500 },
      { 'Invoice Date': '15/07/2024', 'Invoice No': 'INV-2024-005', 'Product Name': 'Polo T-Shirt', 'Variant Size': 'XL', Brand: 'UrbanFit', Category: 'Casuals', Customer: 'Metro Agencies', Quantity: 40, 'Unit Price': 650, 'Net Amount': 26000 },
      { 'Invoice Date': '28/08/2024', 'Invoice No': 'INV-2024-006', 'Product Name': 'Oxford Formal Shirt', 'Variant Size': 'XL', Brand: 'Corpwear', Category: 'Apparel', Customer: 'Apex Logistics', Quantity: 25, 'Unit Price': 1200, 'Net Amount': 30000 },
      { 'Invoice Date': '12/09/2024', 'Invoice No': 'INV-2024-007', 'Product Name': 'Leather Belt', 'Variant Size': 'Free', Brand: 'StepCraft', Category: 'Accessories', Customer: 'Apex Logistics', Quantity: 30, 'Unit Price': 450, 'Net Amount': 13500 },
      { 'Invoice Date': '05/10/2024', 'Invoice No': 'INV-2024-008', 'Product Name': 'Cotton Chinos', 'Variant Size': '34', Brand: 'Corpwear', Category: 'Apparel', Customer: 'Global Traders', Quantity: 20, 'Unit Price': 1500, 'Net Amount': 30000 },
      { 'Invoice Date': '14/11/2024', 'Invoice No': 'INV-2024-009', 'Product Name': 'Denim Jacket', 'Variant Size': 'L', Brand: 'UrbanFit', Category: 'Casuals', Customer: 'Sunrise Textiles', Quantity: 12, 'Unit Price': 2200, 'Net Amount': 26400 },
      { 'Invoice Date': '20/12/2024', 'Invoice No': 'INV-2024-010', 'Product Name': 'Leather Formal Shoes', 'Variant Size': '10', Brand: 'StepCraft', Category: 'Footwear', Customer: 'Zenith Retails', Quantity: 8, 'Unit Price': 2800, 'Net Amount': 22400 },
      { 'Invoice Date': '15/01/2025', 'Invoice No': 'INV-2025-011', 'Product Name': 'Oxford Formal Shirt', 'Variant Size': 'L', Brand: 'Corpwear', Category: 'Apparel', Customer: 'Apex Logistics', Quantity: 40, 'Unit Price': 1250, 'Net Amount': 50000 },
      { 'Invoice Date': '18/02/2025', 'Invoice No': 'INV-2025-012', 'Product Name': 'Polo T-Shirt', 'Variant Size': 'M', Brand: 'UrbanFit', Category: 'Casuals', Customer: 'Metro Agencies', Quantity: 60, 'Unit Price': 650, 'Net Amount': 39000 },
      { 'Invoice Date': '25/03/2025', 'Invoice No': 'INV-2025-013', 'Product Name': 'Silk Necktie', 'Variant Size': 'Standard', Brand: 'Corpwear', Category: 'Accessories', Customer: 'Global Traders', Quantity: 25, 'Unit Price': 500, 'Net Amount': 12500 },
      // FY 2025-26 transactions
      { 'Invoice Date': '12/04/2025', 'Invoice No': 'INV-2025-014', 'Product Name': 'Oxford Formal Shirt', 'Variant Size': 'L', Brand: 'Corpwear', Category: 'Apparel', Customer: 'Apex Logistics', Quantity: 45, 'Unit Price': 1300, 'Net Amount': 58500 },
      { 'Invoice Date': '15/05/2025', 'Invoice No': 'INV-2025-015', 'Product Name': 'Cotton Chinos', 'Variant Size': '32', Brand: 'Corpwear', Category: 'Apparel', Customer: 'Global Traders', Quantity: 25, 'Unit Price': 1600, 'Net Amount': 40000 },
      { 'Invoice Date': '20/06/2025', 'Invoice No': 'INV-2025-016', 'Product Name': 'Denim Jacket', 'Variant Size': 'XL', Brand: 'UrbanFit', Category: 'Casuals', Customer: 'Zenith Retails', Quantity: 18, 'Unit Price': 2300, 'Net Amount': 41400 }
    ];

    setRawHeaders(demoHeaders);
    setRawRows(demoRows);
    setMapping({
      dateCol: 'Invoice Date',
      productCol: 'Product Name',
      amountCol: 'Net Amount',
      invoiceCol: 'Invoice No',
      variantCol: 'Variant Size',
      brandCol: 'Brand',
      categoryCol: 'Category',
      customerCol: 'Customer',
      quantityCol: 'Quantity',
      rateCol: 'Unit Price'
    });
    setStep(2);
  };

  // ─────────────────────────────────────────────────────────────
  // Run Analysis
  // ─────────────────────────────────────────────────────────────
  const handleAnalyzeData = () => {
    if (!mapping.dateCol || !mapping.productCol || !mapping.amountCol) {
      alert('Please map Date, Product, and Amount columns before continuing.');
      return;
    }

    const { records: cleanRecords, quality: report } = normalizeAndAuditSalesData(
      rawRows,
      mapping,
      datePreference,
      { requireProduct: true, requireCustomer: false }
    );

    setRecords(cleanRecords);
    setQuality(report);

    if (cleanRecords.length > 0) {
      setSelectedProductForTrend(cleanRecords[0].product || '');
    }

    setStep(3);
  };

  // ─────────────────────────────────────────────────────────────
  // Filtered Records & Analytics
  // ─────────────────────────────────────────────────────────────
  const filteredRecords = useMemo(() => {
    return filterSalesRecords(records, filter);
  }, [records, filter]);

  // Derived Filter Options
  const financialYears = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => set.add(r.financialYear));
    return Array.from(set).sort();
  }, [records]);

  const uniqueProductsList = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => { if (r.product) set.add(r.product); });
    return Array.from(set).sort();
  }, [records]);

  const uniqueVariantsList = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => { if (r.variant) set.add(r.variant); });
    return Array.from(set).sort();
  }, [records]);

  const uniqueBrandsList = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => { if (r.brand) set.add(r.brand); });
    return Array.from(set).sort();
  }, [records]);

  const uniqueCategoriesList = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => { if (r.category) set.add(r.category); });
    return Array.from(set).sort();
  }, [records]);

  // Analytical Metrics
  const kpis = useMemo(() => {
    return calculateProductKPIs(
      filteredRecords,
      Boolean(mapping.quantityCol),
      Boolean(mapping.invoiceCol)
    );
  }, [filteredRecords, mapping.quantityCol, mapping.invoiceCol]);

  const topProducts = useMemo(() => {
    return calculateTopProducts(filteredRecords, topLimit, sortBy);
  }, [filteredRecords, topLimit, sortBy]);

  const variantAnalysis = useMemo(() => {
    return calculateProductVariantAnalysis(filteredRecords);
  }, [filteredRecords]);

  const yearlyAnalysis = useMemo(() => {
    return calculateYearlyProductAnalysis(filteredRecords, filter.product || undefined);
  }, [filteredRecords, filter.product]);

  const monthlyTrend = useMemo(() => {
    return calculateMonthlyProductTrend(filteredRecords, selectedProductForTrend || filter.product || undefined);
  }, [filteredRecords, selectedProductForTrend, filter.product]);

  const categoryAndBrand = useMemo(() => {
    return calculateCategoryAndBrandBreakdown(filteredRecords);
  }, [filteredRecords]);

  const customerCrossAnalysis = useMemo(() => {
    return calculateProductCustomerCrossAnalysis(filteredRecords, selectedProductForTrend || filter.product || (uniqueProductsList[0] || ''));
  }, [filteredRecords, selectedProductForTrend, filter.product, uniqueProductsList]);

  // ─────────────────────────────────────────────────────────────
  // CSV Exports
  // ─────────────────────────────────────────────────────────────
  const exportTopProductsCsv = () => {
    const headers = ['Product', 'Total Sales (₹)', 'Units Sold', 'Invoices', 'Avg Price (₹)', 'Sales Share %', 'Classification', 'Unique Customers'];
    const rows = topProducts.map((p) => [
      p.product,
      p.totalSales,
      p.totalQuantity,
      p.invoiceCount,
      p.averagePrice,
      `${p.salesSharePct}%`,
      p.classification,
      p.uniqueCustomers
    ]);
    exportToCsv('top_products_summary', headers, rows);
  };

  const exportVariantsCsv = () => {
    const headers = ['Product', 'Variant/Size', 'Sales (₹)', 'Units Sold', 'Invoices', 'Avg Price (₹)', 'Product Share %', 'Overall Share %'];
    const rows = variantAnalysis.map((v) => [
      v.product,
      v.variant,
      v.totalSales,
      v.totalQuantity,
      v.invoiceCount,
      v.averagePrice,
      `${v.variantSharePct}%`,
      `${v.overallSharePct}%`
    ]);
    exportToCsv('product_variants_breakdown', headers, rows);
  };

  const exportYearlyCsv = () => {
    const headers = ['Product', 'Financial Year', 'Sales (₹)', 'Units Sold', 'Invoices', 'YoY Growth %', 'Absolute Variance (₹)'];
    const rows = yearlyAnalysis.map((y) => [
      y.product,
      y.financialYear,
      y.totalSales,
      y.totalQuantity,
      y.invoiceCount,
      y.yoyGrowthPct !== null ? `${y.yoyGrowthPct}%` : 'N/A',
      y.absoluteChange
    ]);
    exportToCsv('yearly_product_comparison', headers, rows);
  };

  return (
    <div style={{ color: fg, fontFamily: "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* ── Step 1: Upload View ── */}
      {step === 1 && (
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 0' }}>
          <div
            style={{
              background: cardBg,
              border: `1px solid ${bdr}`,
              borderRadius: 16,
              padding: '36px 32px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: dk ? 'rgba(2, 132, 199, 0.15)' : '#e0f2fe',
                color: acc,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}
            >
              <Package size={28} />
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: fg }}>
              Free Sales Items Analysis
            </h2>
            <p style={{ fontSize: 14, color: fg2, maxWidth: 540, margin: '0 auto 24px auto', lineHeight: 1.5 }}>
              Upload your sales spreadsheet to analyze top-selling products, variant/size breakdowns, monthly seasonality, and Indian Financial Year performance.
            </p>

            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dk ? 'rgba(255,255,255,0.2)' : '#cbd5e1'}`,
                borderRadius: 12,
                padding: '36px 20px',
                background: inputBg,
                cursor: 'pointer',
                marginBottom: 20,
                transition: 'border 0.2s'
              }}
            >
              <Upload size={36} color={acc} style={{ margin: '0 auto 12px auto' }} />
              <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px 0', color: fg }}>
                Click to browse or drag & drop your sales spreadsheet
              </p>
              <span style={{ fontSize: 12, color: fg2 }}>Supports .csv, .xlsx, .xls (up to 10,000+ rows)</span>
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
            </div>

            {uploadError && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  borderRadius: 8,
                  padding: '10px 16px',
                  marginBottom: 16,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  textAlign: 'left'
                }}
              >
                <AlertCircle size={16} />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Demo Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: fg2 }}>Want to see how it looks?</span>
              <button
                type="button"
                onClick={loadDemoProductData}
                style={{
                  background: dk ? 'rgba(2, 132, 199, 0.15)' : '#e0f2fe',
                  color: acc,
                  border: `1px solid ${dk ? 'rgba(2, 132, 199, 0.3)' : '#bae6fd'}`,
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Boxes size={15} />
                <span>Load Demo Product Sales Data</span>
              </button>
            </div>

            {/* Privacy Assurance */}
            <div
              style={{
                marginTop: 28,
                padding: '10px 14px',
                background: dk ? 'rgba(16, 185, 129, 0.08)' : '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 8,
                fontSize: 12,
                color: dk ? '#86efac' : '#166534',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <ShieldCheck size={16} />
              <span>100% In-Browser Privacy: No sales records or product names are ever uploaded to a server.</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Column Mapping View ── */}
      {step === 2 && (
        <div style={{ maxWidth: 840, margin: '0 auto', padding: '24px 0' }}>
          <div
            style={{
              background: cardBg,
              border: `1px solid ${bdr}`,
              borderRadius: 16,
              padding: 28,
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: fg, margin: 0 }}>
                  Verify Column Mapping
                </h2>
                <span style={{ fontSize: 13, color: fg2 }}>
                  Map your spreadsheet columns to enable deep product & variant performance insights.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: 'transparent',
                  color: fg2,
                  border: `1px solid ${bdr}`,
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Change File
              </button>
            </div>

            {/* Sheet Switcher if multiple sheets */}
            {sheetNames.length > 1 && (
              <div style={{ marginBottom: 20, padding: 12, background: inputBg, borderRadius: 8, border: `1px solid ${bdr}` }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: fg2, marginBottom: 6 }}>
                  Select Worksheet:
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {sheetNames.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSheetChange(s)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: `1px solid ${selectedSheet === s ? acc : bdr}`,
                        background: selectedSheet === s ? acc : cardBg,
                        color: selectedSheet === s ? '#ffffff' : fg,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mapping Selectors Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
              {/* Required: Date */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: fg, marginBottom: 4 }}>
                  Date Column <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={mapping.dateCol}
                  onChange={(e) => setMapping({ ...mapping, dateCol: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                >
                  <option value="">-- Select Date Column --</option>
                  {rawHeaders.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Required: Product */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: fg, marginBottom: 4 }}>
                  Product / Item Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={mapping.productCol}
                  onChange={(e) => setMapping({ ...mapping, productCol: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                >
                  <option value="">-- Select Product Column --</option>
                  {rawHeaders.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Required: Amount */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: fg, marginBottom: 4 }}>
                  Sales Amount (₹) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={mapping.amountCol}
                  onChange={(e) => setMapping({ ...mapping, amountCol: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                >
                  <option value="">-- Select Amount Column --</option>
                  {rawHeaders.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Optional: Variant / Size */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                  Size / Variant (Optional)
                </label>
                <select
                  value={mapping.variantCol || ''}
                  onChange={(e) => setMapping({ ...mapping, variantCol: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                >
                  <option value="">-- None (No Variant) --</option>
                  {rawHeaders.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Optional: Quantity */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                  Quantity / Units (Optional)
                </label>
                <select
                  value={mapping.quantityCol || ''}
                  onChange={(e) => setMapping({ ...mapping, quantityCol: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                >
                  <option value="">-- None --</option>
                  {rawHeaders.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Optional: Rate */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                  Unit Price / Rate (Optional)
                </label>
                <select
                  value={mapping.rateCol || ''}
                  onChange={(e) => setMapping({ ...mapping, rateCol: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                >
                  <option value="">-- None --</option>
                  {rawHeaders.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Optional: Brand */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                  Brand / Make (Optional)
                </label>
                <select
                  value={mapping.brandCol || ''}
                  onChange={(e) => setMapping({ ...mapping, brandCol: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                >
                  <option value="">-- None --</option>
                  {rawHeaders.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Optional: Category */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                  Category (Optional)
                </label>
                <select
                  value={mapping.categoryCol || ''}
                  onChange={(e) => setMapping({ ...mapping, categoryCol: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                >
                  <option value="">-- None --</option>
                  {rawHeaders.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Optional: Invoice No */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                  Invoice Number (Optional)
                </label>
                <select
                  value={mapping.invoiceCol || ''}
                  onChange={(e) => setMapping({ ...mapping, invoiceCol: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                >
                  <option value="">-- None --</option>
                  {rawHeaders.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              {/* Optional: Customer */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                  Customer Name (Optional)
                </label>
                <select
                  value={mapping.customerCol || ''}
                  onChange={(e) => setMapping({ ...mapping, customerCol: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                >
                  <option value="">-- None --</option>
                  {rawHeaders.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                type="button"
                onClick={handleAnalyzeData}
                style={{
                  background: acc,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 24px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                }}
              >
                <span>Analyze Sales Items</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Interactive Dashboard ── */}
      {step === 3 && (
        <div>
          {/* ── Top Bar & Actions ── */}
          <div
            style={{
              background: cardBg,
              border: `1px solid ${bdr}`,
              borderRadius: 12,
              padding: '14px 20px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  background: inputBg,
                  color: fg2,
                  border: `1px solid ${bdr}`,
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Filter size={13} />
                <span>Adjust Mappings</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: inputBg,
                  color: fg2,
                  border: `1px solid ${bdr}`,
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <RotateCcw size={13} />
                <span>New File</span>
              </button>
            </div>

            {/* Quick CSV Exports */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={exportTopProductsCsv}
                style={{
                  background: inputBg,
                  color: fg,
                  border: `1px solid ${bdr}`,
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer'
                }}
              >
                <Download size={13} />
                <span>Export Products CSV</span>
              </button>

              {Boolean(mapping.variantCol) && (
                <button
                  type="button"
                  onClick={exportVariantsCsv}
                  style={{
                    background: inputBg,
                    color: fg,
                    border: `1px solid ${bdr}`,
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={13} />
                  <span>Export Variants CSV</span>
                </button>
              )}

              <button
                type="button"
                onClick={exportYearlyCsv}
                style={{
                  background: inputBg,
                  color: fg,
                  border: `1px solid ${bdr}`,
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer'
                }}
              >
                <Download size={13} />
                <span>Export FY Trends CSV</span>
              </button>
            </div>
          </div>

          {/* ── Global Filter Bar ── */}
          <div
            style={{
              background: cardBg,
              border: `1px solid ${bdr}`,
              borderRadius: 12,
              padding: '12px 16px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap'
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: fg2, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Filter size={14} /> Filters:
            </span>

            {/* FY Filter */}
            {financialYears.length > 1 && (
              <select
                value={filter.financialYear || 'ALL'}
                onChange={(e) => setFilter({ ...filter, financialYear: e.target.value })}
                style={{ background: inputBg, color: fg, border: `1px solid ${bdr}`, borderRadius: 6, padding: '5px 10px', fontSize: 12, fontWeight: 600 }}
              >
                <option value="ALL">All Financial Years</option>
                {financialYears.map((fy) => (
                  <option key={fy} value={fy}>{fy}</option>
                ))}
              </select>
            )}

            {/* Product Filter */}
            <select
              value={filter.product || ''}
              onChange={(e) => setFilter({ ...filter, product: e.target.value })}
              style={{ background: inputBg, color: fg, border: `1px solid ${bdr}`, borderRadius: 6, padding: '5px 10px', fontSize: 12, maxWidth: 200 }}
            >
              <option value="">All Products ({uniqueProductsList.length})</option>
              {uniqueProductsList.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Variant Filter */}
            {uniqueVariantsList.length > 0 && (
              <select
                value={filter.variant || ''}
                onChange={(e) => setFilter({ ...filter, variant: e.target.value })}
                style={{ background: inputBg, color: fg, border: `1px solid ${bdr}`, borderRadius: 6, padding: '5px 10px', fontSize: 12 }}
              >
                <option value="">All Sizes/Variants</option>
                {uniqueVariantsList.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            )}

            {/* Category Filter */}
            {uniqueCategoriesList.length > 0 && (
              <select
                value={filter.category || ''}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                style={{ background: inputBg, color: fg, border: `1px solid ${bdr}`, borderRadius: 6, padding: '5px 10px', fontSize: 12 }}
              >
                <option value="">All Categories</option>
                {uniqueCategoriesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}

            {/* Brand Filter */}
            {uniqueBrandsList.length > 0 && (
              <select
                value={filter.brand || ''}
                onChange={(e) => setFilter({ ...filter, brand: e.target.value })}
                style={{ background: inputBg, color: fg, border: `1px solid ${bdr}`, borderRadius: 6, padding: '5px 10px', fontSize: 12 }}
              >
                <option value="">All Brands</option>
                {uniqueBrandsList.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            )}

            {/* Reset Filter Button */}
            {(filter.financialYear !== 'ALL' || filter.product || filter.variant || filter.category || filter.brand) && (
              <button
                type="button"
                onClick={() =>
                  setFilter({
                    financialYear: 'ALL',
                    startDate: '',
                    endDate: '',
                    product: '',
                    variant: '',
                    brand: '',
                    category: '',
                    customer: ''
                  })
                }
                style={{
                  background: 'transparent',
                  color: '#ef4444',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <X size={14} /> Clear Filters
              </button>
            )}
          </div>

          {/* ── KPI Cards ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: 14,
              marginBottom: 20
            }}
          >
            {/* Total Sales */}
            <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 10, padding: '14px 16px' }}>
              <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, textTransform: 'uppercase', marginBottom: 4 }}>
                Total Sales
              </span>
              <span style={{ fontSize: 20, fontWeight: 800, color: acc }}>
                {formatIndianCurrency(kpis.totalSales)}
              </span>
            </div>

            {/* Total Products / SKUs */}
            <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 10, padding: '14px 16px' }}>
              <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, textTransform: 'uppercase', marginBottom: 4 }}>
                Products / SKUs
              </span>
              <span style={{ fontSize: 20, fontWeight: 800, color: fg }}>
                {formatNumber(kpis.totalProducts)}
              </span>
            </div>

            {/* Total Variants (if mapped) */}
            {Boolean(mapping.variantCol) && (
              <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 10, padding: '14px 16px' }}>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, textTransform: 'uppercase', marginBottom: 4 }}>
                  Item Variants
                </span>
                <span style={{ fontSize: 20, fontWeight: 800, color: fg }}>
                  {formatNumber(kpis.totalVariants)}
                </span>
              </div>
            )}

            {/* Units Sold (if mapped) */}
            {kpis.hasQuantity && (
              <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 10, padding: '14px 16px' }}>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, textTransform: 'uppercase', marginBottom: 4 }}>
                  Units Sold
                </span>
                <span style={{ fontSize: 20, fontWeight: 800, color: fg }}>
                  {formatNumber(kpis.totalUnits)}
                </span>
              </div>
            )}

            {/* Avg Selling Price (if mapped) */}
            {kpis.hasQuantity && kpis.avgSellingPrice > 0 && (
              <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 10, padding: '14px 16px' }}>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, textTransform: 'uppercase', marginBottom: 4 }}>
                  Avg Price / Unit
                </span>
                <span style={{ fontSize: 20, fontWeight: 800, color: fg }}>
                  {formatIndianCurrency(kpis.avgSellingPrice)}
                </span>
              </div>
            )}

            {/* Avg Sales per Product */}
            <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 10, padding: '14px 16px' }}>
              <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, textTransform: 'uppercase', marginBottom: 4 }}>
                Avg Sales / SKU
              </span>
              <span style={{ fontSize: 20, fontWeight: 800, color: fg }}>
                {formatIndianCurrency(kpis.avgSalesPerProduct)}
              </span>
            </div>

            {/* Invoices (if mapped) */}
            {kpis.hasInvoice && (
              <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 10, padding: '14px 16px' }}>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, textTransform: 'uppercase', marginBottom: 4 }}>
                  Orders / Invoices
                </span>
                <span style={{ fontSize: 20, fontWeight: 800, color: fg }}>
                  {formatNumber(kpis.invoiceCount)}
                </span>
              </div>
            )}
          </div>

          {/* ── Data Hygiene Banner ── */}
          {quality && (quality.invalidRows > 0 || quality.negativeAmounts > 0) && (
            <div
              style={{
                background: dk ? 'rgba(245, 158, 11, 0.1)' : '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
                fontSize: 12,
                color: dk ? '#fde68a' : '#92400e'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={15} />
                <span>
                  Data Quality Check: {quality.validRows} clean rows analyzed.
                  {quality.invalidRows > 0 && ` ${quality.invalidRows} rows omitted due to missing date/amount.`}
                  {quality.negativeAmounts > 0 && ` ${quality.negativeAmounts} negative return rows included in net totals.`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowQualityModal(true)}
                style={{
                  background: 'transparent',
                  color: 'inherit',
                  textDecoration: 'underline',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Inspect Omitted Rows
              </button>
            </div>
          )}

          {/* ── Tabbed View Switcher ── */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              borderBottom: `1px solid ${bdr}`,
              paddingBottom: 8,
              marginBottom: 20,
              overflowX: 'auto'
            }}
          >
            {[
              { id: 'top_products', label: 'Top Products & Classification', icon: Award },
              ...(mapping.variantCol ? [{ id: 'variants', label: 'Product + Variant Matrix', icon: Boxes }] : []),
              { id: 'financial_years', label: 'Financial Year (Apr-Mar) Trends', icon: Calendar },
              { id: 'monthly', label: 'Monthly Seasonality', icon: TrendingUp },
              { id: 'categories', label: 'Category & Brand', icon: Tag },
              { id: 'customers', label: 'Customer Cross-Analysis', icon: Users },
              { id: 'raw_data', label: 'Raw Records', icon: FileSpreadsheet }
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as any)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: `1px solid ${isActive ? acc : 'transparent'}`,
                    background: isActive ? (dk ? 'rgba(2, 132, 199, 0.15)' : '#e0f2fe') : 'transparent',
                    color: isActive ? acc : fg2,
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={14} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              TAB 1: Top Products & Classification
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'top_products' && (
            <div>
              {/* Bar Chart of Top 10 */}
              <div
                style={{
                  background: cardBg,
                  border: `1px solid ${bdr}`,
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 20
                }}
              >
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: fg }}>
                  Top 10 Products by Net Revenue (₹)
                </h3>
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topProducts.slice(0, 10)}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={dk ? '#1e293b' : '#f1f5f9'} horizontal={false} />
                      <XAxis
                        type="number"
                        stroke={fg2}
                        fontSize={11}
                        tickFormatter={(v) => `₹${v >= 100000 ? `${(v / 100000).toFixed(1)}L` : v}`}
                      />
                      <YAxis
                        type="category"
                        dataKey="product"
                        stroke={fg2}
                        fontSize={11}
                        width={130}
                        tickFormatter={(t) => (t.length > 18 ? `${t.slice(0, 18)}...` : t)}
                      />
                      <Tooltip
                        contentStyle={{
                          background: dk ? '#0b1322' : '#ffffff',
                          border: `1px solid ${bdr}`,
                          borderRadius: 8,
                          fontSize: 12
                        }}
                        formatter={(val: any) => [formatIndianCurrency(Number(val)), 'Sales']}
                      />
                      <Bar dataKey="totalSales" fill={acc} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Products Table with Sort Controls */}
              <div
                style={{
                  background: cardBg,
                  border: `1px solid ${bdr}`,
                  borderRadius: 12,
                  padding: 20
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: fg, margin: 0 }}>
                    Product Sales Ranking & Performance Tiering
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, color: fg2 }}>Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        style={{ background: inputBg, color: fg, border: `1px solid ${bdr}`, borderRadius: 6, padding: '4px 8px', fontSize: 12 }}
                      >
                        <option value="sales">Net Sales (₹)</option>
                        {kpis.hasQuantity && <option value="quantity">Units Sold</option>}
                        {kpis.hasInvoice && <option value="invoices">Invoice Count</option>}
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, color: fg2 }}>Show:</span>
                      <select
                        value={topLimit}
                        onChange={(e) => setTopLimit(parseInt(e.target.value, 10))}
                        style={{ background: inputBg, color: fg, border: `1px solid ${bdr}`, borderRadius: 6, padding: '4px 8px', fontSize: 12 }}
                      >
                        <option value={10}>Top 10</option>
                        <option value={25}>Top 25</option>
                        <option value={50}>Top 50</option>
                        <option value={0}>All Products</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: headerBg, borderBottom: `1px solid ${bdr}` }}>
                        <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 700 }}>#</th>
                        <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 700 }}>Product Name</th>
                        <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>Total Sales (₹)</th>
                        {kpis.hasQuantity && <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>Units Sold</th>}
                        {kpis.hasQuantity && <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>Avg Price (₹)</th>}
                        <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>Sales Share</th>
                        <th style={{ textAlign: 'center', padding: '10px 12px', fontWeight: 700 }}>Classification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((p, idx) => {
                        const clColor = CLASSIFICATION_COLORS[p.classification] || CLASSIFICATION_COLORS.Stable;
                        return (
                          <tr
                            key={p.product}
                            style={{
                              borderBottom: `1px solid ${bdr}`,
                              transition: 'background 0.15s'
                            }}
                          >
                            <td style={{ padding: '10px 12px', color: fg2 }}>{idx + 1}</td>
                            <td style={{ padding: '10px 12px', fontWeight: 600 }}>{p.product}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: acc }}>
                              {formatIndianCurrency(p.totalSales)}
                            </td>
                            {kpis.hasQuantity && (
                              <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                {formatNumber(p.totalQuantity)}
                              </td>
                            )}
                            {kpis.hasQuantity && (
                              <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                {formatIndianCurrency(p.averagePrice)}
                              </td>
                            )}
                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>
                              {p.salesSharePct}%
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '2px 8px',
                                  borderRadius: 12,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  background: clColor.bg,
                                  color: clColor.text,
                                  border: `1px solid ${clColor.bdr}`
                                }}
                              >
                                {p.classification}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: 14, fontSize: 11, color: fg2, lineHeight: 1.5 }}>
                  * Performance Classification is an analytical heuristic based on relative revenue share and quantity velocity:
                  <strong> Star</strong> (top 15% / ≥12% share), <strong>Growth</strong> (15-45%), <strong>Stable</strong> (45-75%), and <strong>Low Performer</strong> (bottom 25%).
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 2: Product + Variant Matrix
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'variants' && (
            <div
              style={{
                background: cardBg,
                border: `1px solid ${bdr}`,
                borderRadius: 12,
                padding: 20
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: fg, margin: 0 }}>
                  Product + Size / Variant Performance Breakdown
                </h3>
                <span style={{ fontSize: 12, color: fg2 }}>
                  Showing {variantAnalysis.length} unique variant combinations
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: headerBg, borderBottom: `1px solid ${bdr}` }}>
                      <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 700 }}>Product</th>
                      <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 700 }}>Size / Variant</th>
                      <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>Total Sales (₹)</th>
                      {kpis.hasQuantity && <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>Units Sold</th>}
                      {kpis.hasQuantity && <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>Avg Price</th>}
                      <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>% of Product</th>
                      <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>% of Catalog</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variantAnalysis.map((v, idx) => (
                      <tr key={`${v.product}_${v.variant}_${idx}`} style={{ borderBottom: `1px solid ${bdr}` }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{v.product}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span
                            style={{
                              background: dk ? '#1e293b' : '#f1f5f9',
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 12,
                              fontWeight: 600
                            }}
                          >
                            {v.variant}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: acc }}>
                          {formatIndianCurrency(v.totalSales)}
                        </td>
                        {kpis.hasQuantity && (
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            {formatNumber(v.totalQuantity)}
                          </td>
                        )}
                        {kpis.hasQuantity && (
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            {formatIndianCurrency(v.averagePrice)}
                          </td>
                        )}
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>
                          {v.variantSharePct}%
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: fg2 }}>
                          {v.overallSharePct}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 3: Financial Year Trends (Apr-Mar)
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'financial_years' && (
            <div
              style={{
                background: cardBg,
                border: `1px solid ${bdr}`,
                borderRadius: 12,
                padding: 20
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: fg, margin: 0 }}>
                  Product Sales Comparison by Indian Financial Year (April - March)
                </h3>
                <span style={{ fontSize: 12, color: fg2 }}>
                  Zero-safe YoY % Growth Calculation
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: headerBg, borderBottom: `1px solid ${bdr}` }}>
                      <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 700 }}>Product</th>
                      <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 700 }}>Financial Year</th>
                      <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>Net Sales (₹)</th>
                      {kpis.hasQuantity && <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>Units Sold</th>}
                      <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>YoY Growth %</th>
                      <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>Variance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyAnalysis.map((y, idx) => {
                      const isPositive = y.yoyGrowthPct !== null && y.yoyGrowthPct > 0;
                      const isNegative = y.yoyGrowthPct !== null && y.yoyGrowthPct < 0;

                      return (
                        <tr key={`${y.product}_${y.financialYear}_${idx}`} style={{ borderBottom: `1px solid ${bdr}` }}>
                          <td style={{ padding: '10px 12px', fontWeight: 600 }}>{y.product}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 700 }}>{y.financialYear}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: acc }}>
                            {formatIndianCurrency(y.totalSales)}
                          </td>
                          {kpis.hasQuantity && (
                            <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                              {formatNumber(y.totalQuantity)}
                            </td>
                          )}
                          <td
                            style={{
                              padding: '10px 12px',
                              textAlign: 'right',
                              fontWeight: 700,
                              color: isPositive ? '#10b981' : isNegative ? '#ef4444' : fg2
                            }}
                          >
                            {y.yoyGrowthPct !== null ? `${isPositive ? '+' : ''}${y.yoyGrowthPct}%` : 'Base Year'}
                          </td>
                          <td
                            style={{
                              padding: '10px 12px',
                              textAlign: 'right',
                              color: isPositive ? '#10b981' : isNegative ? '#ef4444' : fg2
                            }}
                          >
                            {y.absoluteChange !== 0 ? formatIndianCurrency(y.absoluteChange) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 4: Monthly Seasonality (Apr -> Mar)
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'monthly' && (
            <div>
              <div
                style={{
                  background: cardBg,
                  border: `1px solid ${bdr}`,
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 20
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: fg, margin: 0 }}>
                      Monthly Product Sales Seasonality (Apr → Mar)
                    </h3>
                    <span style={{ fontSize: 12, color: fg2 }}>Chronological Indian fiscal calendar</span>
                  </div>

                  {/* Product Picker for Trend */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: fg2 }}>Select Product:</span>
                    <select
                      value={selectedProductForTrend}
                      onChange={(e) => setSelectedProductForTrend(e.target.value)}
                      style={{ background: inputBg, color: fg, border: `1px solid ${bdr}`, borderRadius: 6, padding: '5px 10px', fontSize: 12 }}
                    >
                      <option value="">All Catalog Products</option>
                      {uniqueProductsList.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyTrend} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={dk ? '#1e293b' : '#f1f5f9'} />
                      <XAxis dataKey="monthKey" stroke={fg2} fontSize={12} />
                      <YAxis
                        stroke={fg2}
                        fontSize={11}
                        tickFormatter={(v) => `₹${v >= 100000 ? `${(v / 100000).toFixed(1)}L` : v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: dk ? '#0b1322' : '#ffffff',
                          border: `1px solid ${bdr}`,
                          borderRadius: 8,
                          fontSize: 12
                        }}
                        formatter={(val: any) => [formatIndianCurrency(Number(val)), 'Sales']}
                      />
                      <Bar dataKey="totalSales" fill={acc} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 5: Category & Brand Breakdown
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'categories' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
              {/* Category Breakdown */}
              <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: fg }}>
                  Sales by Category
                </h3>
                {categoryAndBrand.categories.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: headerBg, borderBottom: `1px solid ${bdr}` }}>
                        <th style={{ textAlign: 'left', padding: 8 }}>Category</th>
                        <th style={{ textAlign: 'right', padding: 8 }}>Sales (₹)</th>
                        <th style={{ textAlign: 'right', padding: 8 }}>SKUs</th>
                        <th style={{ textAlign: 'right', padding: 8 }}>Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryAndBrand.categories.map((c) => (
                        <tr key={c.name} style={{ borderBottom: `1px solid ${bdr}` }}>
                          <td style={{ padding: 8, fontWeight: 600 }}>{c.name}</td>
                          <td style={{ padding: 8, textAlign: 'right', color: acc, fontWeight: 700 }}>
                            {formatIndianCurrency(c.sales)}
                          </td>
                          <td style={{ padding: 8, textAlign: 'right' }}>{c.productCount}</td>
                          <td style={{ padding: 8, textAlign: 'right' }}>{c.sharePct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ fontSize: 12, color: fg2 }}>Category column not mapped in source file.</p>
                )}
              </div>

              {/* Brand Breakdown */}
              <div style={{ background: cardBg, border: `1px solid ${bdr}`, borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: fg }}>
                  Sales by Brand / Make
                </h3>
                {categoryAndBrand.brands.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: headerBg, borderBottom: `1px solid ${bdr}` }}>
                        <th style={{ textAlign: 'left', padding: 8 }}>Brand</th>
                        <th style={{ textAlign: 'right', padding: 8 }}>Sales (₹)</th>
                        <th style={{ textAlign: 'right', padding: 8 }}>SKUs</th>
                        <th style={{ textAlign: 'right', padding: 8 }}>Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryAndBrand.brands.map((b) => (
                        <tr key={b.name} style={{ borderBottom: `1px solid ${bdr}` }}>
                          <td style={{ padding: 8, fontWeight: 600 }}>{b.name}</td>
                          <td style={{ padding: 8, textAlign: 'right', color: acc, fontWeight: 700 }}>
                            {formatIndianCurrency(b.sales)}
                          </td>
                          <td style={{ padding: 8, textAlign: 'right' }}>{b.productCount}</td>
                          <td style={{ padding: 8, textAlign: 'right' }}>{b.sharePct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ fontSize: 12, color: fg2 }}>Brand column not mapped in source file.</p>
                )}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 6: Customer Cross-Analysis
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'customers' && (
            <div
              style={{
                background: cardBg,
                border: `1px solid ${bdr}`,
                borderRadius: 12,
                padding: 20
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: fg, margin: 0 }}>
                    Top Customers Purchasing: {selectedProductForTrend || 'All Products'}
                  </h3>
                  <span style={{ fontSize: 12, color: fg2 }}>Cross-analysis of client demand per product</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: fg2 }}>Product:</span>
                  <select
                    value={selectedProductForTrend}
                    onChange={(e) => setSelectedProductForTrend(e.target.value)}
                    style={{ background: inputBg, color: fg, border: `1px solid ${bdr}`, borderRadius: 6, padding: '5px 10px', fontSize: 12 }}
                  >
                    {uniqueProductsList.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {customerCrossAnalysis.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: headerBg, borderBottom: `1px solid ${bdr}` }}>
                        <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 700 }}>Customer Name</th>
                        <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>Total Spend (₹)</th>
                        {kpis.hasQuantity && <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>Units Purchased</th>}
                        <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>Orders / Lines</th>
                        <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 700 }}>Share of Product</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerCrossAnalysis.map((c) => (
                        <tr key={c.customer} style={{ borderBottom: `1px solid ${bdr}` }}>
                          <td style={{ padding: '10px 12px', fontWeight: 600 }}>{c.customer}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: acc }}>
                            {formatIndianCurrency(c.totalSales)}
                          </td>
                          {kpis.hasQuantity && (
                            <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                              {formatNumber(c.totalQuantity)}
                            </td>
                          )}
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>{c.invoiceCount}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>{c.sharePct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ fontSize: 12, color: fg2 }}>Customer column not mapped or no data available for this product.</p>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 7: Raw Records
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'raw_data' && (
            <div
              style={{
                background: cardBg,
                border: `1px solid ${bdr}`,
                borderRadius: 12,
                padding: 20
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: fg, margin: 0 }}>
                  Normalized Sales Item Records ({filteredRecords.length} rows)
                </h3>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: headerBg, borderBottom: `1px solid ${bdr}` }}>
                      <th style={{ textAlign: 'left', padding: '8px 10px' }}>Date</th>
                      <th style={{ textAlign: 'left', padding: '8px 10px' }}>FY</th>
                      <th style={{ textAlign: 'left', padding: '8px 10px' }}>Product</th>
                      {Boolean(mapping.variantCol) && <th style={{ textAlign: 'left', padding: '8px 10px' }}>Variant</th>}
                      {Boolean(mapping.brandCol) && <th style={{ textAlign: 'left', padding: '8px 10px' }}>Brand</th>}
                      <th style={{ textAlign: 'left', padding: '8px 10px' }}>Customer</th>
                      {kpis.hasQuantity && <th style={{ textAlign: 'right', padding: '8px 10px' }}>Qty</th>}
                      <th style={{ textAlign: 'right', padding: '8px 10px' }}>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.slice((rawPage - 1) * 50, rawPage * 50).map((r, idx) => (
                      <tr key={`${r.rowIndex}_${idx}`} style={{ borderBottom: `1px solid ${bdr}` }}>
                        <td style={{ padding: '8px 10px' }}>{r.dateStr}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 600 }}>{r.financialYear}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 600 }}>{r.product}</td>
                        {Boolean(mapping.variantCol) && <td style={{ padding: '8px 10px' }}>{r.variant || '-'}</td>}
                        {Boolean(mapping.brandCol) && <td style={{ padding: '8px 10px' }}>{r.brand || '-'}</td>}
                        <td style={{ padding: '8px 10px' }}>{r.customer}</td>
                        {kpis.hasQuantity && <td style={{ padding: '8px 10px', textAlign: 'right' }}>{r.quantity ?? '-'}</td>}
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: acc }}>
                          {formatIndianCurrency(r.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredRecords.length > 50 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                  <span style={{ fontSize: 12, color: fg2 }}>
                    Page {rawPage} of {Math.ceil(filteredRecords.length / 50)}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      disabled={rawPage === 1}
                      onClick={() => setRawPage((p) => Math.max(1, p - 1))}
                      style={{ padding: '4px 10px', borderRadius: 4, border: `1px solid ${bdr}`, background: inputBg, color: fg, cursor: 'pointer' }}
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      disabled={rawPage * 50 >= filteredRecords.length}
                      onClick={() => setRawPage((p) => p + 1)}
                      style={{ padding: '4px 10px', borderRadius: 4, border: `1px solid ${bdr}`, background: inputBg, color: fg, cursor: 'pointer' }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Privacy Assurance ── */}
          <div
            style={{
              marginTop: 24,
              padding: '12px 16px',
              background: dk ? 'rgba(16, 185, 129, 0.08)' : '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 8,
              fontSize: 12,
              color: dk ? '#86efac' : '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <ShieldCheck size={16} />
            <span>All sales item analysis and calculations are executed 100% locally in your browser. No files, customer names, or prices are uploaded to any server.</span>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          Data Hygiene Audit Modal
      ───────────────────────────────────────────────────────────── */}
      {showQualityModal && quality && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20
          }}
          onClick={() => setShowQualityModal(false)}
        >
          <div
            style={{
              background: cardBg,
              border: `1px solid ${bdr}`,
              borderRadius: 14,
              padding: 24,
              maxWidth: 600,
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: fg, marginBottom: 8 }}>
              Data Quality Audit ({quality.invalidRows} Omitted Rows)
            </h3>
            <p style={{ fontSize: 13, color: fg2, marginBottom: 16 }}>
              The following rows were omitted from sales analysis due to missing dates, missing product names, or unparseable amounts:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {quality.flaggedRows.slice(0, 30).map((flag, idx) => (
                <div
                  key={idx}
                  style={{
                    background: inputBg,
                    border: `1px solid ${bdr}`,
                    borderRadius: 6,
                    padding: '8px 12px',
                    fontSize: 12
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>
                    Row #{flag.rowIndex}: {flag.reasons.join(', ')}
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      fontSize: 11,
                      color: fg2,
                      overflowX: 'auto',
                      background: dk ? '#060a12' : '#f1f5f9',
                      padding: 6,
                      borderRadius: 4
                    }}
                  >
                    {JSON.stringify(flag.sampleData)}
                  </pre>
                </div>
              ))}
              {quality.flaggedRows.length > 30 && (
                <div style={{ fontSize: 12, color: fg2, textAlign: 'center' }}>
                  ...and {quality.flaggedRows.length - 30} more omitted rows.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowQualityModal(false)}
                style={{
                  background: acc,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 16px',
                  fontSize: 13,
                  fontWeight: 600,
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
