// GST Billing & Invoicing Engine (Calculation, State Metadata & Structural Validation)

export interface IndianState {
  code: string;
  name: string;
}

export const INDIAN_STATES: IndianState[] = [
  { code: '01', name: 'Jammu & Kashmir' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh' },
  { code: '05', name: 'Uttarakhand' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '11', name: 'Sikkim' },
  { code: '12', name: 'Arunachal Pradesh' },
  { code: '13', name: 'Nagaland' },
  { code: '14', name: 'Manipur' },
  { code: '15', name: 'Mizoram' },
  { code: '16', name: 'Tripura' },
  { code: '17', name: 'Meghalaya' },
  { code: '18', name: 'Assam' },
  { code: '19', name: 'West Bengal' },
  { code: '20', name: 'Jharkhand' },
  { code: '21', name: 'Odisha' },
  { code: '22', name: 'Chhattisgarh' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '25', name: 'Daman & Diu' },
  { code: '26', name: 'Dadra & Nagar Haveli' },
  { code: '27', name: 'Maharashtra' },
  { code: '28', name: 'Andhra Pradesh (Old)' },
  { code: '29', name: 'Karnataka' },
  { code: '30', name: 'Goa' },
  { code: '31', name: 'Lakshadweep' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '34', name: 'Puducherry' },
  { code: '35', name: 'Andaman & Nicobar Islands' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh (New)' },
  { code: '38', name: 'Ladakh' },
  { code: '97', name: 'Other Territory' },
];

export const STATE_MAP: Record<string, string> = INDIAN_STATES.reduce((acc, s) => {
  acc[s.code] = s.name;
  return acc;
}, {} as Record<string, string>);

export function getStateNameByCode(code: string): string {
  return STATE_MAP[code] || '';
}

export function getStateCodeByName(name: string): string {
  const found = INDIAN_STATES.find(
    (s) => s.name.toLowerCase() === name.toLowerCase() || name.includes(`(${s.code})`)
  );
  return found ? found.code : '';
}

export const COMMON_GST_RATES = [0, 5, 12, 18, 28] as const;

export const COMMON_UNITS = [
  'PCS',
  'NOS',
  'KGS',
  'BOX',
  'MTR',
  'SET',
  'LTR',
  'HRS',
  'PKT',
  'BAG',
  'SQF',
  'TON',
] as const;

// ── Decimal-Safe Rounding ──
export function round2(val: number): number {
  if (isNaN(val) || !isFinite(val)) return 0;
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

// ── Structural GSTIN Validation ──
const GSTIN_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export interface GstinValidationResult {
  isValid: boolean;
  stateCode: string;
  stateName: string;
  pan: string;
  errorMessage?: string;
}

export function validateStructuralGstin(rawGstin: string): GstinValidationResult {
  const gstin = rawGstin.trim().toUpperCase();
  if (!gstin) {
    return { isValid: false, stateCode: '', stateName: '', pan: '', errorMessage: 'GSTIN cannot be empty' };
  }

  if (gstin.length !== 15) {
    return {
      isValid: false,
      stateCode: '',
      stateName: '',
      pan: '',
      errorMessage: `GSTIN must be 15 characters (currently ${gstin.length})`,
    };
  }

  if (!GSTIN_REGEX.test(gstin)) {
    return {
      isValid: false,
      stateCode: '',
      stateName: '',
      pan: '',
      errorMessage: 'Invalid GSTIN format (Expected 2 digits state, 10-char PAN, 1 entity, 1 Z, 1 check digit)',
    };
  }

  const stateCode = gstin.substring(0, 2);
  const stateName = STATE_MAP[stateCode];
  if (!stateName) {
    return {
      isValid: false,
      stateCode,
      stateName: '',
      pan: '',
      errorMessage: `Invalid state code '${stateCode}' in GSTIN`,
    };
  }

  const pan = gstin.substring(2, 12);

  // Checksum calculation (Modulo 36)
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const charIndex = GSTIN_CHARS.indexOf(gstin[i]);
    if (charIndex === -1) {
      return { isValid: false, stateCode, stateName, pan, errorMessage: 'Contains invalid character' };
    }
    const multiplier = i % 2 === 0 ? 1 : 2;
    const product = charIndex * multiplier;
    sum += Math.floor(product / 36) + (product % 36);
  }

  const checkIndex = (36 - (sum % 36)) % 36;
  const expectedCheckChar = GSTIN_CHARS[checkIndex];
  const actualCheckChar = gstin[14];

  if (expectedCheckChar !== actualCheckChar) {
    return {
      isValid: false,
      stateCode,
      stateName,
      pan,
      errorMessage: `Checksum mismatch: expected '${expectedCheckChar}' but found '${actualCheckChar}'`,
    };
  }

  return { isValid: true, stateCode, stateName, pan };
}

// ── Line Item & Invoice Data Types ──
export interface InvoiceLineItem {
  id: string;
  product: string;
  hsn: string;
  quantity: number | string;
  unit: string;
  rate: number | string;
  discountPercent: number | string;
  gstRate: number;
}

export interface CalculatedLineItem {
  id: string;
  product: string;
  hsn: string;
  quantity: number;
  unit: string;
  rate: number;
  discountPercent: number;
  gstRate: number;
  grossAmount: number;
  discountAmount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  lineTotal: number;
}

export interface GstRateBreakdown {
  rate: number;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
}

export interface InvoiceCalculations {
  calculatedItems: CalculatedLineItem[];
  subtotal: number;
  totalDiscount: number;
  taxableValue: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
  grandTotal: number;
  totalItems: number;
  rateBreakdown: GstRateBreakdown[];
}

/**
 * Decimal-safe calculation engine for invoice line items and totals
 */
export function calculateInvoice(
  items: InvoiceLineItem[],
  taxMode: 'intrastate' | 'interstate'
): InvoiceCalculations {
  let subtotal = 0;
  let totalDiscount = 0;
  let taxableValue = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;

  const breakdownMap: Record<number, GstRateBreakdown> = {};

  const calculatedItems: CalculatedLineItem[] = items.map((item) => {
    const qty = typeof item.quantity === 'string' ? parseFloat(item.quantity) || 0 : item.quantity || 0;
    const rate = typeof item.rate === 'string' ? parseFloat(item.rate) || 0 : item.rate || 0;
    const discPct =
      typeof item.discountPercent === 'string'
        ? parseFloat(item.discountPercent) || 0
        : item.discountPercent || 0;
    const clampedDiscPct = Math.max(0, Math.min(100, discPct));
    const gstRate = item.gstRate || 0;

    const grossAmount = round2(qty * rate);
    const discountAmount = round2((grossAmount * clampedDiscPct) / 100);
    const taxableAmount = round2(grossAmount - discountAmount);

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (taxMode === 'intrastate') {
      const halfRate = gstRate / 2;
      cgst = round2((taxableAmount * halfRate) / 100);
      sgst = round2((taxableAmount * halfRate) / 100);
      igst = 0;
    } else {
      cgst = 0;
      sgst = 0;
      igst = round2((taxableAmount * gstRate) / 100);
    }

    const lineTotal = round2(taxableAmount + cgst + sgst + igst);

    subtotal = round2(subtotal + grossAmount);
    totalDiscount = round2(totalDiscount + discountAmount);
    taxableValue = round2(taxableValue + taxableAmount);
    totalCgst = round2(totalCgst + cgst);
    totalSgst = round2(totalSgst + sgst);
    totalIgst = round2(totalIgst + igst);

    // Rate breakdown grouping
    if (!breakdownMap[gstRate]) {
      breakdownMap[gstRate] = {
        rate: gstRate,
        taxableValue: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalTax: 0,
      };
    }
    const entry = breakdownMap[gstRate];
    entry.taxableValue = round2(entry.taxableValue + taxableAmount);
    entry.cgst = round2(entry.cgst + cgst);
    entry.sgst = round2(entry.sgst + sgst);
    entry.igst = round2(entry.igst + igst);
    entry.totalTax = round2(entry.cgst + entry.sgst + entry.igst);

    return {
      id: item.id,
      product: item.product,
      hsn: item.hsn,
      quantity: qty,
      unit: item.unit,
      rate,
      discountPercent: clampedDiscPct,
      gstRate,
      grossAmount,
      discountAmount,
      taxableAmount,
      cgst,
      sgst,
      igst,
      lineTotal,
    };
  });

  const totalTax = round2(totalCgst + totalSgst + totalIgst);
  const grandTotal = round2(taxableValue + totalTax);

  // Sorted rate breakdown list
  const rateBreakdown = Object.values(breakdownMap).sort((a, b) => a.rate - b.rate);

  return {
    calculatedItems,
    subtotal,
    totalDiscount,
    taxableValue,
    totalCgst,
    totalSgst,
    totalIgst,
    totalTax,
    grandTotal,
    totalItems: items.length,
    rateBreakdown,
  };
}
