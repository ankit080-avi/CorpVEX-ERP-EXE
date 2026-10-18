/**
 * Pure TypeScript Client-Side Sales Analysis Engine
 * Decoupled from React, fully unit-testable.
 * Supports Indian Financial Years (Apr 1 - Mar 31), RFM Customer Segmentation,
 * Data Hygiene Auditing, and Multi-Dimensional Sales Metrics.
 */

export interface ColumnMapping {
  dateCol: string;
  customerCol: string;
  amountCol: string;
  invoiceCol?: string;
  productCol?: string;
  quantityCol?: string;
  rateCol?: string;
  variantCol?: string;
  brandCol?: string;
  salespersonCol?: string;
  categoryCol?: string;
  gstCol?: string;
  discountCol?: string;
  stateCol?: string;
  paymentModeCol?: string;
}

export type DateFormatPreference = 'AUTO' | 'DMY' | 'YMD' | 'MDY';
export type InvoiceMode = 'INVOICE_LEVEL' | 'INVOICE_LINE_LEVEL';

export interface RawRow {
  [key: string]: any;
}

export interface NormalizedSalesRecord {
  rowIndex: number;
  date: Date;
  dateStr: string;
  financialYear: string;
  fiscalMonthIndex: number; // 0 for Apr, 11 for Mar
  fiscalMonthName: string;
  isoWeek: string;
  customer: string;
  amount: number;
  invoiceNo?: string;
  product?: string;
  quantity?: number;
  rate?: number;
  variant?: string;
  brand?: string;
  salesperson?: string;
  category?: string;
  gstAmount?: number;
  discountAmount?: number;
  state?: string;
  paymentMode?: string;
}

export interface DataQualityReport {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  missingDates: number;
  missingCustomers: number;
  missingProducts?: number;
  missingAmounts: number;
  negativeAmounts: number;
  zeroAmounts: number;
  duplicateInvoices: number;
  flaggedRows: {
    rowIndex: number;
    reasons: string[];
    sampleData: Record<string, any>;
  }[];
}

export interface SalesKPIs {
  totalSales: number;
  invoiceCount: number;
  uniqueCustomers: number;
  averageOrderValue: number;
  totalQuantity: number;
  totalGst: number;
  totalDiscount: number;
  netRevenue: number;
  dateRange: {
    minDate: Date | null;
    maxDate: Date | null;
  };
}

export interface FinancialYearMetric {
  financialYear: string;
  totalSales: number;
  invoiceCount: number;
  uniqueCustomers: number;
  averageOrderValue: number;
  yoyGrowthPct: number | null; // Safe from division by zero
}

export interface MonthlyTrendMetric {
  monthKey: string; // e.g. "Apr"
  fiscalOrder: number; // 1 = Apr ... 12 = Mar
  totalSales: number;
  invoiceCount: number;
  averageOrderValue: number;
  sharePct: number;
}

export interface WeeklyTrendMetric {
  weekKey: string; // e.g. "2025-W18"
  weekStart: string;
  totalSales: number;
  invoiceCount: number;
}

export type RfmSegment = 'VIP' | 'Regular' | 'At-Risk' | 'New';

export interface CustomerMetric {
  customer: string;
  totalSales: number;
  invoiceCount: number;
  averageOrderValue: number;
  firstPurchase: Date;
  lastPurchase: Date;
  recencyDays: number;
  rfmScore: number;
  rfmSegment: RfmSegment;
  salesSharePct: number;
}

export interface DimensionMetric {
  name: string;
  totalSales: number;
  count: number;
  sharePct: number;
  totalQuantity?: number;
  averagePrice?: number;
}

export interface AnalysisFilter {
  financialYear?: string;
  startDate?: string;
  endDate?: string;
  customer?: string;
  product?: string;
  variant?: string;
  brand?: string;
  salesperson?: string;
  category?: string;
  state?: string;
}

// ─────────────────────────────────────────────────────────────
// 1. Column Detection Heuristics
// ─────────────────────────────────────────────────────────────

const HEADER_CANDIDATES = {
  date: ['date', 'inv_date', 'invoice_date', 'bill_date', 'transaction_date', 'sale_date', 'doc_date', 'voucher_date'],
  customer: ['customer', 'customer_name', 'party', 'party_name', 'buyer', 'client', 'account', 'customer_id', 'client_name'],
  amount: ['amount', 'total', 'net_amount', 'invoice_amount', 'grand_total', 'sales', 'bill_amount', 'value', 'final_amount', 'net_value', 'total_amount'],
  invoice: ['invoice', 'invoice_no', 'invoice_number', 'bill_no', 'bill_number', 'doc_no', 'voucher_no', 'ref_no', 'inv_no', 'order_id'],
  product: ['product', 'item', 'item_name', 'product_name', 'description', 'particulars', 'sku', 'product_description'],
  quantity: ['qty', 'quantity', 'units', 'pcs', 'nos', 'item_qty', 'billed_qty'],
  rate: ['rate', 'unit_rate', 'price', 'unit_price', 'selling_price', 'mrp', 'item_rate'],
  variant: ['variant', 'size', 'item_size', 'dimension', 'variant_name', 'color_size', 'style_size'],
  brand: ['brand', 'brand_name', 'make', 'manufacturer', 'company'],
  salesperson: ['salesperson', 'sales_rep', 'agent', 'executive', 'sales_executive', 'rep', 'employee'],
  category: ['category', 'group', 'product_group', 'class', 'item_group', 'segment'],
  gst: ['gst', 'tax', 'tax_amount', 'gst_amount', 'igst', 'cgst', 'sgst', 'vat'],
  discount: ['discount', 'disc', 'discount_amount', 'disc_amt'],
  state: ['state', 'place_of_supply', 'region', 'zone', 'destination'],
  paymentMode: ['payment_mode', 'pay_mode', 'payment_method', 'pay_type', 'mode', 'type']
};

function normalizeHeaderName(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

export function detectColumnMappings(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    dateCol: '',
    customerCol: '',
    amountCol: '',
  };

  const normHeaders = headers.map(h => ({ original: h, normalized: normalizeHeaderName(h) }));

  const findBestMatch = (candidates: string[]): string => {
    // 1. Exact normalized match
    for (const item of normHeaders) {
      if (candidates.includes(item.normalized)) return item.original;
    }
    // 2. Substring match
    for (const item of normHeaders) {
      for (const cand of candidates) {
        if (item.normalized.includes(cand) || cand.includes(item.normalized)) {
          return item.original;
        }
      }
    }
    return '';
  };

  mapping.dateCol = findBestMatch(HEADER_CANDIDATES.date);
  mapping.customerCol = findBestMatch(HEADER_CANDIDATES.customer);
  mapping.amountCol = findBestMatch(HEADER_CANDIDATES.amount);

  const inv = findBestMatch(HEADER_CANDIDATES.invoice);
  if (inv && inv !== mapping.dateCol && inv !== mapping.amountCol) mapping.invoiceCol = inv;

  const prod = findBestMatch(HEADER_CANDIDATES.product);
  if (prod) mapping.productCol = prod;

  const qty = findBestMatch(HEADER_CANDIDATES.quantity);
  if (qty) mapping.quantityCol = qty;

  const rt = findBestMatch(HEADER_CANDIDATES.rate);
  if (rt) mapping.rateCol = rt;

  const vr = findBestMatch(HEADER_CANDIDATES.variant);
  if (vr) mapping.variantCol = vr;

  const br = findBestMatch(HEADER_CANDIDATES.brand);
  if (br) mapping.brandCol = br;

  const sp = findBestMatch(HEADER_CANDIDATES.salesperson);
  if (sp) mapping.salespersonCol = sp;

  const cat = findBestMatch(HEADER_CANDIDATES.category);
  if (cat) mapping.categoryCol = cat;

  const gst = findBestMatch(HEADER_CANDIDATES.gst);
  if (gst) mapping.gstCol = gst;

  const disc = findBestMatch(HEADER_CANDIDATES.discount);
  if (disc) mapping.discountCol = disc;

  const st = findBestMatch(HEADER_CANDIDATES.state);
  if (st) mapping.stateCol = st;

  const pm = findBestMatch(HEADER_CANDIDATES.paymentMode);
  if (pm) mapping.paymentModeCol = pm;

  return mapping;
}

// ─────────────────────────────────────────────────────────────
// 2. Numeric & Currency Parser
// ─────────────────────────────────────────────────────────────

export function parseAmountValue(val: any): { value: number; isNegative: boolean; isValid: boolean } {
  if (val === null || val === undefined || val === '') {
    return { value: 0, isNegative: false, isValid: false };
  }

  if (typeof val === 'number') {
    if (isNaN(val)) return { value: 0, isNegative: false, isValid: false };
    return { value: Math.round(val * 100) / 100, isNegative: val < 0, isValid: true };
  }

  let str = String(val).trim();
  if (!str) return { value: 0, isNegative: false, isValid: false };

  // Handle accounting parentheses for negatives e.g. (1,250.50) -> -1250.50
  let isNegative = false;
  if (str.startsWith('(') && str.endsWith(')')) {
    isNegative = true;
    str = str.substring(1, str.length - 1).trim();
  } else if (str.startsWith('-')) {
    isNegative = true;
    str = str.substring(1).trim();
  }

  // Strip currency symbols (₹, $, €, £), commas, spaces
  str = str.replace(/[₹$€£,\s]/g, '');

  const num = parseFloat(str);
  if (isNaN(num)) {
    return { value: 0, isNegative: false, isValid: false };
  }

  const finalValue = Math.round((isNegative ? -Math.abs(num) : Math.abs(num)) * 100) / 100;
  return { value: finalValue, isNegative, isValid: true };
}

// ─────────────────────────────────────────────────────────────
// 3. Date Parser & Indian Financial Year Resolver
// ─────────────────────────────────────────────────────────────

const FISCAL_MONTH_NAMES = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

export function parseDateString(val: any, preference: DateFormatPreference = 'AUTO'): Date | null {
  if (!val) return null;

  // Native Date object
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }

  // Excel serial number timestamp (e.g. 45000 -> 2023)
  if (typeof val === 'number') {
    // Excel epoch begins at 1899-12-30 (taking into account the 1900 leap year bug)
    const excelEpoch = new Date(1899, 11, 30);
    const millis = val * 86400 * 1000;
    const d = new Date(excelEpoch.getTime() + millis);
    return isNaN(d.getTime()) ? null : d;
  }

  let str = String(val).trim();
  if (!str) return null;

  // Remove time component if present
  str = str.split('T')[0].split(' ')[0];

  // Regex patterns
  // DD/MM/YYYY or DD-MM-YYYY
  const parts = str.split(/[/.-]/);
  if (parts.length === 3) {
    let [p1, p2, p3] = parts.map(p => parseInt(p, 10));
    if (isNaN(p1) || isNaN(p2) || isNaN(p3)) return null;

    // Normalize 2-digit year (e.g. 26 -> 2026, 99 -> 1999)
    if (p3 < 100) p3 += p3 < 70 ? 2000 : 1900;
    if (p1 < 100 && p3 > 1000) {
      // p1 is day or month, p3 is year
      let day = p1;
      let month = p2;
      let year = p3;

      if (preference === 'MDY' || (preference === 'AUTO' && p1 <= 12 && p2 > 12)) {
        month = p1;
        day = p2;
      }

      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const d = new Date(year, month - 1, day);
        if (!isNaN(d.getTime())) return d;
      }
    } else if (p1 > 1000) {
      // YYYY-MM-DD or YYYY-DD-MM
      const year = p1;
      let month = p2;
      let day = p3;

      if (preference === 'MDY' || (preference === 'AUTO' && p2 > 12 && p3 <= 12)) {
        day = p2;
        month = p3;
      }

      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const d = new Date(year, month - 1, day);
        if (!isNaN(d.getTime())) return d;
      }
    }
  }

  // Fallback to standard Date.parse
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export function getIndianFinancialYear(date: Date): { code: string; startYear: number; endYear: number } {
  const month = date.getMonth(); // 0 = Jan ... 11 = Dec
  const year = date.getFullYear();

  // In India, Financial Year runs from April 1 to March 31.
  // Months 0, 1, 2 (Jan, Feb, Mar) belong to previous calendar year's FY
  if (month < 3) {
    const startYear = year - 1;
    const endYear = year;
    const code = `FY ${startYear}-${String(endYear).slice(-2)}`;
    return { code, startYear, endYear };
  } else {
    const startYear = year;
    const endYear = year + 1;
    const code = `FY ${startYear}-${String(endYear).slice(-2)}`;
    return { code, startYear, endYear };
  }
}

export function getFiscalMonthIndex(date: Date): { index: number; name: string } {
  const m = date.getMonth(); // 0 = Jan, 3 = Apr
  // April (3) is index 0; March (2) is index 11
  const index = (m + 9) % 12;
  return { index, name: FISCAL_MONTH_NAMES[index] };
}

export function getIsoWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

// ─────────────────────────────────────────────────────────────
// 4. Data Quality & Normalization
// ─────────────────────────────────────────────────────────────

export function normalizeAndAuditSalesData(
  rows: RawRow[],
  mapping: ColumnMapping,
  datePreference: DateFormatPreference = 'AUTO',
  options: { requireProduct?: boolean; requireCustomer?: boolean } = {}
): {
  records: NormalizedSalesRecord[];
  quality: DataQualityReport;
} {
  const { requireProduct = false, requireCustomer = true } = options;
  const records: NormalizedSalesRecord[] = [];
  const flaggedRows: DataQualityReport['flaggedRows'] = [];
  const invoiceCounts: Record<string, number> = {};

  let missingDates = 0;
  let missingCustomers = 0;
  let missingProducts = 0;
  let missingAmounts = 0;
  let negativeAmounts = 0;
  let zeroAmounts = 0;

  rows.forEach((row, idx) => {
    const rowNumber = idx + 1;
    const reasons: string[] = [];

    // Date
    const rawDate = row[mapping.dateCol];
    const parsedDate = parseDateString(rawDate, datePreference);
    if (!parsedDate) {
      missingDates++;
      reasons.push('Unparseable or missing date');
    }

    // Customer
    const rawCustomer = row[mapping.customerCol];
    let customer = String(rawCustomer || '').trim();
    if (requireCustomer) {
      if (!customer) {
        missingCustomers++;
        reasons.push('Missing customer identity');
      }
    } else {
      if (!customer) {
        customer = 'General Customer';
      }
    }

    // Product
    const rawProduct = mapping.productCol ? row[mapping.productCol] : undefined;
    const product = rawProduct ? String(rawProduct).trim() : undefined;
    if (requireProduct) {
      if (!product) {
        missingProducts++;
        reasons.push('Missing product / item name');
      }
    }

    // Amount
    const rawAmount = row[mapping.amountCol];
    const parsedAmt = parseAmountValue(rawAmount);
    if (!parsedAmt.isValid) {
      missingAmounts++;
      reasons.push('Invalid or empty amount value');
    } else if (parsedAmt.value === 0) {
      zeroAmounts++;
    } else if (parsedAmt.isNegative) {
      negativeAmounts++;
    }

    // Optional Invoice Tracking
    let invoiceNo = '';
    if (mapping.invoiceCol && row[mapping.invoiceCol]) {
      invoiceNo = String(row[mapping.invoiceCol]).trim();
      if (invoiceNo) {
        invoiceCounts[invoiceNo] = (invoiceCounts[invoiceNo] || 0) + 1;
      }
    }

    // Optional fields
    const quantity = mapping.quantityCol && row[mapping.quantityCol] !== undefined ? parseFloat(String(row[mapping.quantityCol])) || 0 : undefined;
    const rate = mapping.rateCol && row[mapping.rateCol] !== undefined ? parseAmountValue(row[mapping.rateCol]).value : undefined;
    const variant = mapping.variantCol && row[mapping.variantCol] !== undefined ? String(row[mapping.variantCol]).trim() : undefined;
    const brand = mapping.brandCol && row[mapping.brandCol] !== undefined ? String(row[mapping.brandCol]).trim() : undefined;
    const salesperson = mapping.salespersonCol && row[mapping.salespersonCol] ? String(row[mapping.salespersonCol]).trim() : undefined;
    const category = mapping.categoryCol && row[mapping.categoryCol] ? String(row[mapping.categoryCol]).trim() : undefined;
    const gstAmount = mapping.gstCol && row[mapping.gstCol] ? parseAmountValue(row[mapping.gstCol]).value : undefined;
    const discountAmount = mapping.discountCol && row[mapping.discountCol] ? parseAmountValue(row[mapping.discountCol]).value : undefined;
    const state = mapping.stateCol && row[mapping.stateCol] ? String(row[mapping.stateCol]).trim() : undefined;
    const paymentMode = mapping.paymentModeCol && row[mapping.paymentModeCol] ? String(row[mapping.paymentModeCol]).trim() : undefined;

    if (reasons.length > 0) {
      flaggedRows.push({
        rowIndex: rowNumber,
        reasons,
        sampleData: row
      });
    } else if (parsedDate && customer && parsedAmt.isValid && (!requireProduct || product)) {
      const fy = getIndianFinancialYear(parsedDate);
      const fm = getFiscalMonthIndex(parsedDate);
      const isoWeek = getIsoWeek(parsedDate);

      records.push({
        rowIndex: rowNumber,
        date: parsedDate,
        dateStr: parsedDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        financialYear: fy.code,
        fiscalMonthIndex: fm.index,
        fiscalMonthName: fm.name,
        isoWeek,
        customer,
        amount: parsedAmt.value,
        invoiceNo: invoiceNo || undefined,
        product,
        quantity,
        rate,
        variant,
        brand,
        salesperson,
        category,
        gstAmount,
        discountAmount,
        state,
        paymentMode
      });
    }
  });

  const duplicateInvoices = Object.values(invoiceCounts).filter(c => c > 1).length;

  return {
    records,
    quality: {
      totalRows: rows.length,
      validRows: records.length,
      invalidRows: flaggedRows.length,
      missingDates,
      missingCustomers,
      missingProducts,
      missingAmounts,
      negativeAmounts,
      zeroAmounts,
      duplicateInvoices,
      flaggedRows
    }
  };
}

// ─────────────────────────────────────────────────────────────
// 5. Core KPI Calculations
// ─────────────────────────────────────────────────────────────

export function calculateKPIs(records: NormalizedSalesRecord[], invoiceMode: InvoiceMode = 'INVOICE_LEVEL'): SalesKPIs {
  if (records.length === 0) {
    return {
      totalSales: 0,
      invoiceCount: 0,
      uniqueCustomers: 0,
      averageOrderValue: 0,
      totalQuantity: 0,
      totalGst: 0,
      totalDiscount: 0,
      netRevenue: 0,
      dateRange: { minDate: null, maxDate: null }
    };
  }

  let totalSales = 0;
  let totalQuantity = 0;
  let totalGst = 0;
  let totalDiscount = 0;

  const customers = new Set<string>();
  const invoices = new Set<string>();

  let minDate = records[0].date;
  let maxDate = records[0].date;

  for (const r of records) {
    totalSales += r.amount;
    if (r.quantity) totalQuantity += r.quantity;
    if (r.gstAmount) totalGst += r.gstAmount;
    if (r.discountAmount) totalDiscount += r.discountAmount;

    customers.add(r.customer);
    if (r.invoiceNo) {
      invoices.add(r.invoiceNo);
    }

    if (r.date < minDate) minDate = r.date;
    if (r.date > maxDate) maxDate = r.date;
  }

  // Invoice count logic
  let invoiceCount = records.length;
  if (invoices.size > 0 && invoiceMode === 'INVOICE_LINE_LEVEL') {
    invoiceCount = invoices.size;
  }

  const averageOrderValue = invoiceCount > 0 ? Math.round((totalSales / invoiceCount) * 100) / 100 : 0;
  const netRevenue = Math.round((totalSales - totalDiscount) * 100) / 100;

  return {
    totalSales: Math.round(totalSales * 100) / 100,
    invoiceCount,
    uniqueCustomers: customers.size,
    averageOrderValue,
    totalQuantity: Math.round(totalQuantity * 100) / 100,
    totalGst: Math.round(totalGst * 100) / 100,
    totalDiscount: Math.round(totalDiscount * 100) / 100,
    netRevenue,
    dateRange: { minDate, maxDate }
  };
}

// ─────────────────────────────────────────────────────────────
// 6. Indian Financial Year Summary
// ─────────────────────────────────────────────────────────────

export function calculateFinancialYearSummary(records: NormalizedSalesRecord[]): FinancialYearMetric[] {
  const groups: Record<string, { totalSales: number; invoices: Set<string>; rows: number; customers: Set<string> }> = {};

  for (const r of records) {
    if (!groups[r.financialYear]) {
      groups[r.financialYear] = { totalSales: 0, invoices: new Set(), rows: 0, customers: new Set() };
    }
    const g = groups[r.financialYear];
    g.totalSales += r.amount;
    g.rows++;
    g.customers.add(r.customer);
    if (r.invoiceNo) g.invoices.add(r.invoiceNo);
  }

  // Sort chronological by FY start year
  const sortedYears = Object.keys(groups).sort((a, b) => {
    const yA = parseInt(a.replace(/\D/g, '').slice(0, 4), 10);
    const yB = parseInt(b.replace(/\D/g, '').slice(0, 4), 10);
    return yA - yB;
  });

  const metrics: FinancialYearMetric[] = [];

  for (let i = 0; i < sortedYears.length; i++) {
    const fy = sortedYears[i];
    const g = groups[fy];
    const invCount = g.invoices.size > 0 ? g.invoices.size : g.rows;
    const aov = invCount > 0 ? Math.round((g.totalSales / invCount) * 100) / 100 : 0;

    let yoyGrowthPct: number | null = null;
    if (i > 0) {
      const prevSales = groups[sortedYears[i - 1]].totalSales;
      if (prevSales > 0) {
        yoyGrowthPct = Math.round(((g.totalSales - prevSales) / prevSales) * 1000) / 10;
      }
    }

    metrics.push({
      financialYear: fy,
      totalSales: Math.round(g.totalSales * 100) / 100,
      invoiceCount: invCount,
      uniqueCustomers: g.customers.size,
      averageOrderValue: aov,
      yoyGrowthPct
    });
  }

  return metrics;
}

// ─────────────────────────────────────────────────────────────
// 7. Monthly Trends (April to March Fiscal Ordering)
// ─────────────────────────────────────────────────────────────

export function calculateMonthlyTrends(records: NormalizedSalesRecord[]): MonthlyTrendMetric[] {
  const totalSalesAll = records.reduce((acc, r) => acc + r.amount, 0) || 1;
  const groups: Record<number, { totalSales: number; invoices: Set<string>; rows: number }> = {};

  // Initialize all 12 fiscal months (0 = Apr ... 11 = Mar)
  for (let i = 0; i < 12; i++) {
    groups[i] = { totalSales: 0, invoices: new Set(), rows: 0 };
  }

  for (const r of records) {
    const idx = r.fiscalMonthIndex;
    groups[idx].totalSales += r.amount;
    groups[idx].rows++;
    if (r.invoiceNo) groups[idx].invoices.add(r.invoiceNo);
  }

  return FISCAL_MONTH_NAMES.map((name, idx) => {
    const g = groups[idx];
    const invCount = g.invoices.size > 0 ? g.invoices.size : g.rows;
    const aov = invCount > 0 ? Math.round((g.totalSales / invCount) * 100) / 100 : 0;
    const sharePct = Math.round((g.totalSales / totalSalesAll) * 1000) / 10;

    return {
      monthKey: name,
      fiscalOrder: idx + 1,
      totalSales: Math.round(g.totalSales * 100) / 100,
      invoiceCount: invCount,
      averageOrderValue: aov,
      sharePct
    };
  });
}

// ─────────────────────────────────────────────────────────────
// 8. Weekly Trends (ISO Weeks)
// ─────────────────────────────────────────────────────────────

export function calculateWeeklyTrends(records: NormalizedSalesRecord[], limit = 16): WeeklyTrendMetric[] {
  const groups: Record<string, { totalSales: number; invoices: Set<string>; rows: number; minDate: Date }> = {};

  for (const r of records) {
    if (!groups[r.isoWeek]) {
      groups[r.isoWeek] = { totalSales: 0, invoices: new Set(), rows: 0, minDate: r.date };
    }
    const g = groups[r.isoWeek];
    g.totalSales += r.amount;
    g.rows++;
    if (r.invoiceNo) g.invoices.add(r.invoiceNo);
    if (r.date < g.minDate) g.minDate = r.date;
  }

  const sortedWeeks = Object.keys(groups).sort();
  const recentWeeks = sortedWeeks.slice(-limit);

  return recentWeeks.map(wk => {
    const g = groups[wk];
    const invCount = g.invoices.size > 0 ? g.invoices.size : g.rows;
    return {
      weekKey: wk,
      weekStart: g.minDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      totalSales: Math.round(g.totalSales * 100) / 100,
      invoiceCount: invCount
    };
  });
}

// ─────────────────────────────────────────────────────────────
// 9. Customer Analysis & RFM Segmentation
// ─────────────────────────────────────────────────────────────

/**
 * RFM Segmentation Model:
 * Recency: Days since customer's latest purchase relative to dataset reference date (max date).
 * Frequency: Unique invoices (or rows).
 * Monetary: Total spending.
 * Weighted: Monetary 45%, Frequency 35%, Recency 20%.
 */
export function calculateCustomerAnalysis(records: NormalizedSalesRecord[]): CustomerMetric[] {
  if (records.length === 0) return [];

  const totalSalesAll = records.reduce((acc, r) => acc + r.amount, 0) || 1;
  const maxDatasetDate = records.reduce((max, r) => (r.date > max ? r.date : max), records[0].date);

  const map: Record<string, {
    totalSales: number;
    invoices: Set<string>;
    rows: number;
    firstPurchase: Date;
    lastPurchase: Date;
  }> = {};

  for (const r of records) {
    if (!map[r.customer]) {
      map[r.customer] = {
        totalSales: 0,
        invoices: new Set(),
        rows: 0,
        firstPurchase: r.date,
        lastPurchase: r.date
      };
    }
    const c = map[r.customer];
    c.totalSales += r.amount;
    c.rows++;
    if (r.invoiceNo) c.invoices.add(r.invoiceNo);
    if (r.date < c.firstPurchase) c.firstPurchase = r.date;
    if (r.date > c.lastPurchase) c.lastPurchase = r.date;
  }

  const customerList = Object.entries(map).map(([customer, data]) => {
    const invCount = data.invoices.size > 0 ? data.invoices.size : data.rows;
    const aov = invCount > 0 ? Math.round((data.totalSales / invCount) * 100) / 100 : 0;
    const diffTime = Math.abs(maxDatasetDate.getTime() - data.lastPurchase.getTime());
    const recencyDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const salesSharePct = Math.round((data.totalSales / totalSalesAll) * 1000) / 10;

    return {
      customer,
      totalSales: Math.round(data.totalSales * 100) / 100,
      invoiceCount: invCount,
      averageOrderValue: aov,
      firstPurchase: data.firstPurchase,
      lastPurchase: data.lastPurchase,
      recencyDays,
      salesSharePct
    };
  });

  // Calculate RFM ranks
  const maxMonetary = Math.max(...customerList.map(c => c.totalSales), 1);
  const maxFrequency = Math.max(...customerList.map(c => c.invoiceCount), 1);
  const maxRecency = Math.max(...customerList.map(c => c.recencyDays), 1);

  return customerList.map(c => {
    // Scores normalized to 0 - 100
    // Recency: Lower days = higher score
    const rScore = Math.max(0, Math.min(100, 100 - (c.recencyDays / (maxRecency || 1)) * 100));
    const fScore = Math.min(100, (c.invoiceCount / (maxFrequency || 1)) * 100);
    const mScore = Math.min(100, (c.totalSales / (maxMonetary || 1)) * 100);

    // Centralized RFM weights (45% M, 35% F, 20% R)
    const compositeScore = Math.round(mScore * 0.45 + fScore * 0.35 + rScore * 0.2);

    let rfmSegment: RfmSegment = 'Regular';
    if (compositeScore >= 75) {
      rfmSegment = 'VIP';
    } else if (rScore < 35 && mScore >= 40) {
      rfmSegment = 'At-Risk';
    } else if (c.invoiceCount === 1 && rScore >= 70) {
      rfmSegment = 'New';
    } else {
      rfmSegment = 'Regular';
    }

    return {
      ...c,
      rfmScore: compositeScore,
      rfmSegment
    };
  }).sort((a, b) => b.totalSales - a.totalSales);
}

// ─────────────────────────────────────────────────────────────
// 10. Conditional Breakdown Calculators (Products, Salesperson, etc.)
// ─────────────────────────────────────────────────────────────

export function calculateDimensionBreakdown(
  records: NormalizedSalesRecord[],
  key: keyof NormalizedSalesRecord,
  qtyKey?: keyof NormalizedSalesRecord,
  limit = 15
): DimensionMetric[] {
  const totalSalesAll = records.reduce((acc, r) => acc + r.amount, 0) || 1;
  const groups: Record<string, { totalSales: number; count: number; totalQuantity: number }> = {};

  for (const r of records) {
    const rawVal = r[key];
    if (!rawVal) continue;
    const name = String(rawVal).trim();
    if (!name) continue;

    if (!groups[name]) {
      groups[name] = { totalSales: 0, count: 0, totalQuantity: 0 };
    }
    groups[name].totalSales += r.amount;
    groups[name].count++;
    if (qtyKey && typeof r[qtyKey] === 'number') {
      groups[name].totalQuantity += (r[qtyKey] as number) || 0;
    }
  }

  return Object.entries(groups)
    .map(([name, data]) => {
      const sharePct = Math.round((data.totalSales / totalSalesAll) * 1000) / 10;
      const avgPrice = data.totalQuantity > 0 ? Math.round((data.totalSales / data.totalQuantity) * 100) / 100 : undefined;
      return {
        name,
        totalSales: Math.round(data.totalSales * 100) / 100,
        count: data.count,
        sharePct,
        totalQuantity: Math.round(data.totalQuantity * 100) / 100,
        averagePrice: avgPrice
      };
    })
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, limit);
}

// ─────────────────────────────────────────────────────────────
// 11. Interactive Filter Engine
// ─────────────────────────────────────────────────────────────

export function filterSalesRecords(records: NormalizedSalesRecord[], filter: AnalysisFilter): NormalizedSalesRecord[] {
  return records.filter(r => {
    if (filter.financialYear && filter.financialYear !== 'ALL' && r.financialYear !== filter.financialYear) {
      return false;
    }
    if (filter.startDate) {
      const sDate = new Date(filter.startDate);
      if (!isNaN(sDate.getTime()) && r.date < sDate) return false;
    }
    if (filter.endDate) {
      const eDate = new Date(filter.endDate);
      if (!isNaN(eDate.getTime()) && r.date > eDate) return false;
    }
    if (filter.customer && r.customer !== filter.customer) {
      return false;
    }
    if (filter.product && r.product !== filter.product) {
      return false;
    }
    if (filter.variant && r.variant !== filter.variant) {
      return false;
    }
    if (filter.brand && r.brand !== filter.brand) {
      return false;
    }
    if (filter.salesperson && r.salesperson !== filter.salesperson) {
      return false;
    }
    if (filter.category && r.category !== filter.category) {
      return false;
    }
    if (filter.state && r.state !== filter.state) {
      return false;
    }
    return true;
  });
}

// ─────────────────────────────────────────────────────────────
// 12. Client-Side CSV Exporter
// ─────────────────────────────────────────────────────────────

export function exportToCsv(filename: string, headers: string[], rows: (string | number | null | undefined)[][]): void {
  const sanitize = (v: any): string => {
    if (v === null || v === undefined) return '';
    const str = String(v).replace(/"/g, '""');
    return /[",\n\r]/.test(str) ? `"${str}"` : str;
  };

  const csvContent = [
    headers.map(sanitize).join(','),
    ...rows.map(row => row.map(sanitize).join(','))
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────
// 13. Dedicated Product & Item Analysis Engine
// ─────────────────────────────────────────────────────────────

export interface ProductKPIs {
  totalSales: number;
  totalProducts: number;
  totalVariants: number;
  totalUnits: number;
  hasQuantity: boolean;
  invoiceCount: number;
  hasInvoice: boolean;
  avgSellingPrice: number;
  avgSalesPerProduct: number;
}

export type ProductClassification = 'Star' | 'Growth' | 'Stable' | 'Low Performer';

export interface ProductItemMetric {
  product: string;
  totalSales: number;
  totalQuantity: number;
  invoiceCount: number;
  averagePrice: number;
  salesSharePct: number;
  classification: ProductClassification;
  uniqueCustomers: number;
}

export interface ProductVariantMetric {
  product: string;
  variant: string;
  totalSales: number;
  totalQuantity: number;
  invoiceCount: number;
  averagePrice: number;
  variantSharePct: number;
  overallSharePct: number;
}

export interface ProductFyMetric {
  product: string;
  financialYear: string;
  totalSales: number;
  totalQuantity: number;
  invoiceCount: number;
  yoyGrowthPct: number | null;
  absoluteChange: number;
}

export interface MonthlyProductMetric {
  monthKey: string;
  fiscalOrder: number;
  totalSales: number;
  totalQuantity: number;
  invoiceCount: number;
}

/**
 * Calculates core Product KPIs
 */
export function calculateProductKPIs(
  records: NormalizedSalesRecord[],
  hasQtyMapped: boolean,
  hasInvoiceMapped: boolean
): ProductKPIs {
  let totalSales = 0;
  let totalUnits = 0;
  const productsSet = new Set<string>();
  const variantsSet = new Set<string>();
  const invoicesSet = new Set<string>();

  for (const r of records) {
    totalSales += r.amount;
    if (r.product) productsSet.add(r.product);
    if (r.product && r.variant) variantsSet.add(`${r.product}__${r.variant}`);
    if (r.quantity !== undefined) totalUnits += r.quantity;
    if (r.invoiceNo) invoicesSet.add(r.invoiceNo);
  }

  const invoiceCount = hasInvoiceMapped ? invoicesSet.size : records.length;
  const avgSellingPrice = (hasQtyMapped && totalUnits > 0) ? Math.round((totalSales / totalUnits) * 100) / 100 : 0;
  const avgSalesPerProduct = productsSet.size > 0 ? Math.round((totalSales / productsSet.size) * 100) / 100 : 0;

  return {
    totalSales: Math.round(totalSales * 100) / 100,
    totalProducts: productsSet.size,
    totalVariants: variantsSet.size,
    totalUnits: Math.round(totalUnits * 100) / 100,
    hasQuantity: hasQtyMapped,
    invoiceCount,
    hasInvoice: hasInvoiceMapped,
    avgSellingPrice,
    avgSalesPerProduct
  };
}

/**
 * Calculates Top Products with Sales Share and Analytical Performance Classification
 */
export function calculateTopProducts(
  records: NormalizedSalesRecord[],
  limit: number = 25,
  sortBy: 'sales' | 'quantity' | 'invoices' = 'sales'
): ProductItemMetric[] {
  const map: Record<string, {
    sales: number;
    quantity: number;
    invoices: Set<string>;
    customers: Set<string>;
    rowCount: number;
  }> = {};

  let totalGrandSales = 0;

  for (const r of records) {
    const prod = r.product || 'Unspecified Product';
    if (!map[prod]) {
      map[prod] = { sales: 0, quantity: 0, invoices: new Set(), customers: new Set(), rowCount: 0 };
    }
    map[prod].sales += r.amount;
    totalGrandSales += r.amount;
    if (r.quantity !== undefined) map[prod].quantity += r.quantity;
    if (r.invoiceNo) map[prod].invoices.add(r.invoiceNo);
    if (r.customer) map[prod].customers.add(r.customer);
    map[prod].rowCount++;
  }

  const list: ProductItemMetric[] = Object.keys(map).map(prod => {
    const d = map[prod];
    const totalSales = Math.round(d.sales * 100) / 100;
    const totalQuantity = Math.round(d.quantity * 100) / 100;
    const invoiceCount = d.invoices.size > 0 ? d.invoices.size : d.rowCount;
    const averagePrice = totalQuantity > 0 ? Math.round((totalSales / totalQuantity) * 100) / 100 : 0;
    const salesSharePct = totalGrandSales > 0 ? Math.round((totalSales / totalGrandSales) * 10000) / 100 : 0;

    return {
      product: prod,
      totalSales,
      totalQuantity,
      invoiceCount,
      averagePrice,
      salesSharePct,
      classification: 'Stable', // Will be classified below
      uniqueCustomers: d.customers.size
    };
  });

  // Sort by sales descending to assign analytical classifications
  list.sort((a, b) => b.totalSales - a.totalSales);

  const totalCount = list.length;
  list.forEach((item, index) => {
    const percentile = (index + 1) / totalCount;
    if (item.salesSharePct >= 12 || percentile <= 0.15) {
      item.classification = 'Star';
    } else if (percentile <= 0.45) {
      item.classification = 'Growth';
    } else if (percentile <= 0.75) {
      item.classification = 'Stable';
    } else {
      item.classification = 'Low Performer';
    }
  });

  // Apply requested sort order
  if (sortBy === 'quantity') {
    list.sort((a, b) => b.totalQuantity - a.totalQuantity);
  } else if (sortBy === 'invoices') {
    list.sort((a, b) => b.invoiceCount - a.invoiceCount);
  }

  return limit > 0 ? list.slice(0, limit) : list;
}

/**
 * Calculates Product + Variant Matrix (e.g. Shirt | S, Shirt | M)
 */
export function calculateProductVariantAnalysis(records: NormalizedSalesRecord[]): ProductVariantMetric[] {
  const map: Record<string, {
    product: string;
    variant: string;
    sales: number;
    quantity: number;
    invoices: Set<string>;
    rowCount: number;
  }> = {};

  const productTotalSalesMap: Record<string, number> = {};
  let grandTotalSales = 0;

  for (const r of records) {
    if (!r.product) continue;
    const variant = r.variant || 'Standard';
    const key = `${r.product}__${variant}`;

    if (!map[key]) {
      map[key] = {
        product: r.product,
        variant,
        sales: 0,
        quantity: 0,
        invoices: new Set(),
        rowCount: 0
      };
    }

    map[key].sales += r.amount;
    grandTotalSales += r.amount;
    productTotalSalesMap[r.product] = (productTotalSalesMap[r.product] || 0) + r.amount;

    if (r.quantity !== undefined) map[key].quantity += r.quantity;
    if (r.invoiceNo) map[key].invoices.add(r.invoiceNo);
    map[key].rowCount++;
  }

  return Object.values(map).map(d => {
    const totalSales = Math.round(d.sales * 100) / 100;
    const totalQuantity = Math.round(d.quantity * 100) / 100;
    const invoiceCount = d.invoices.size > 0 ? d.invoices.size : d.rowCount;
    const averagePrice = totalQuantity > 0 ? Math.round((totalSales / totalQuantity) * 100) / 100 : 0;
    const prodSales = productTotalSalesMap[d.product] || totalSales;
    const variantSharePct = prodSales > 0 ? Math.round((totalSales / prodSales) * 10000) / 100 : 0;
    const overallSharePct = grandTotalSales > 0 ? Math.round((totalSales / grandTotalSales) * 10000) / 100 : 0;

    return {
      product: d.product,
      variant: d.variant,
      totalSales,
      totalQuantity,
      invoiceCount,
      averagePrice,
      variantSharePct,
      overallSharePct
    };
  }).sort((a, b) => b.totalSales - a.totalSales);
}

/**
 * Calculates Multi-Year Product Sales Comparison by Indian Financial Year (Apr - Mar)
 */
export function calculateYearlyProductAnalysis(
  records: NormalizedSalesRecord[],
  selectedProduct?: string
): ProductFyMetric[] {
  const filtered = selectedProduct ? records.filter(r => r.product === selectedProduct) : records;

  const fyProductMap: Record<string, {
    product: string;
    financialYear: string;
    sales: number;
    quantity: number;
    invoices: Set<string>;
    rowCount: number;
  }> = {};

  for (const r of filtered) {
    const prod = r.product || 'Unspecified';
    const key = `${prod}__${r.financialYear}`;
    if (!fyProductMap[key]) {
      fyProductMap[key] = {
        product: prod,
        financialYear: r.financialYear,
        sales: 0,
        quantity: 0,
        invoices: new Set(),
        rowCount: 0
      };
    }
    fyProductMap[key].sales += r.amount;
    if (r.quantity !== undefined) fyProductMap[key].quantity += r.quantity;
    if (r.invoiceNo) fyProductMap[key].invoices.add(r.invoiceNo);
    fyProductMap[key].rowCount++;
  }

  // Sort chronological by FY
  const results = Object.values(fyProductMap).map(d => {
    const totalSales = Math.round(d.sales * 100) / 100;
    const totalQuantity = Math.round(d.quantity * 100) / 100;
    const invoiceCount = d.invoices.size > 0 ? d.invoices.size : d.rowCount;
    return {
      product: d.product,
      financialYear: d.financialYear,
      totalSales,
      totalQuantity,
      invoiceCount,
      yoyGrowthPct: null as number | null,
      absoluteChange: 0
    };
  }).sort((a, b) => a.financialYear.localeCompare(b.financialYear));

  // Compute zero-safe YoY growth %
  const prodYearHistory: Record<string, number> = {};
  for (const item of results) {
    if (prodYearHistory[item.product] !== undefined) {
      const prev = prodYearHistory[item.product];
      item.absoluteChange = Math.round((item.totalSales - prev) * 100) / 100;
      if (prev !== 0) {
        item.yoyGrowthPct = Math.round(((item.totalSales - prev) / Math.abs(prev)) * 10000) / 100;
      }
    }
    prodYearHistory[item.product] = item.totalSales;
  }

  return results;
}

/**
 * Calculates Chronological 12-Month Product Trend (Apr -> Mar)
 */
export function calculateMonthlyProductTrend(
  records: NormalizedSalesRecord[],
  selectedProduct?: string
): MonthlyProductMetric[] {
  const filtered = selectedProduct ? records.filter(r => r.product === selectedProduct) : records;

  const monthBuckets: { sales: number; quantity: number; invoices: Set<string>; rowCount: number }[] =
    Array.from({ length: 12 }, () => ({ sales: 0, quantity: 0, invoices: new Set(), rowCount: 0 }));

  for (const r of filtered) {
    const idx = r.fiscalMonthIndex;
    if (idx >= 0 && idx < 12) {
      monthBuckets[idx].sales += r.amount;
      if (r.quantity !== undefined) monthBuckets[idx].quantity += r.quantity;
      if (r.invoiceNo) monthBuckets[idx].invoices.add(r.invoiceNo);
      monthBuckets[idx].rowCount++;
    }
  }

  return FISCAL_MONTH_NAMES.map((name, i) => ({
    monthKey: name,
    fiscalOrder: i + 1,
    totalSales: Math.round(monthBuckets[i].sales * 100) / 100,
    totalQuantity: Math.round(monthBuckets[i].quantity * 100) / 100,
    invoiceCount: monthBuckets[i].invoices.size > 0 ? monthBuckets[i].invoices.size : monthBuckets[i].rowCount
  }));
}

/**
 * Calculates Customer Cross-Analysis for a selected Product
 */
export function calculateProductCustomerCrossAnalysis(
  records: NormalizedSalesRecord[],
  selectedProduct: string
): { customer: string; totalSales: number; totalQuantity: number; invoiceCount: number; sharePct: number }[] {
  if (!selectedProduct) return [];

  const map: Record<string, { sales: number; quantity: number; invoices: Set<string>; rowCount: number }> = {};
  let totalProductSales = 0;

  for (const r of records) {
    if (r.product !== selectedProduct) continue;
    const cust = r.customer || 'General Customer';
    if (!map[cust]) {
      map[cust] = { sales: 0, quantity: 0, invoices: new Set(), rowCount: 0 };
    }
    map[cust].sales += r.amount;
    totalProductSales += r.amount;
    if (r.quantity !== undefined) map[cust].quantity += r.quantity;
    if (r.invoiceNo) map[cust].invoices.add(r.invoiceNo);
    map[cust].rowCount++;
  }

  return Object.keys(map).map(cust => {
    const d = map[cust];
    const totalSales = Math.round(d.sales * 100) / 100;
    const totalQuantity = Math.round(d.quantity * 100) / 100;
    const invoiceCount = d.invoices.size > 0 ? d.invoices.size : d.rowCount;
    const sharePct = totalProductSales > 0 ? Math.round((totalSales / totalProductSales) * 10000) / 100 : 0;
    return {
      customer: cust,
      totalSales,
      totalQuantity,
      invoiceCount,
      sharePct
    };
  }).sort((a, b) => b.totalSales - a.totalSales);
}

/**
 * Calculates Category and Brand Breakdown for Products
 */
export function calculateCategoryAndBrandBreakdown(
  records: NormalizedSalesRecord[]
): {
  categories: { name: string; sales: number; quantity: number; productCount: number; sharePct: number }[];
  brands: { name: string; sales: number; quantity: number; productCount: number; sharePct: number }[];
} {
  const catMap: Record<string, { sales: number; quantity: number; products: Set<string> }> = {};
  const brandMap: Record<string, { sales: number; quantity: number; products: Set<string> }> = {};
  let totalSales = 0;

  for (const r of records) {
    totalSales += r.amount;
    if (r.category) {
      if (!catMap[r.category]) catMap[r.category] = { sales: 0, quantity: 0, products: new Set() };
      catMap[r.category].sales += r.amount;
      if (r.quantity !== undefined) catMap[r.category].quantity += r.quantity;
      if (r.product) catMap[r.category].products.add(r.product);
    }
    if (r.brand) {
      if (!brandMap[r.brand]) brandMap[r.brand] = { sales: 0, quantity: 0, products: new Set() };
      brandMap[r.brand].sales += r.amount;
      if (r.quantity !== undefined) brandMap[r.brand].quantity += r.quantity;
      if (r.product) brandMap[r.brand].products.add(r.product);
    }
  }

  const categories = Object.keys(catMap).map(k => ({
    name: k,
    sales: Math.round(catMap[k].sales * 100) / 100,
    quantity: Math.round(catMap[k].quantity * 100) / 100,
    productCount: catMap[k].products.size,
    sharePct: totalSales > 0 ? Math.round((catMap[k].sales / totalSales) * 10000) / 100 : 0
  })).sort((a, b) => b.sales - a.sales);

  const brands = Object.keys(brandMap).map(k => ({
    name: k,
    sales: Math.round(brandMap[k].sales * 100) / 100,
    quantity: Math.round(brandMap[k].quantity * 100) / 100,
    productCount: brandMap[k].products.size,
    sharePct: totalSales > 0 ? Math.round((brandMap[k].sales / totalSales) * 10000) / 100 : 0
  })).sort((a, b) => b.sales - a.sales);

  return { categories, brands };
}

