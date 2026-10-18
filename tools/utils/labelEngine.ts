/**
 * Pure TypeScript Client-Side Label Engine
 * Handles canonical label presets, inch/mm/pt/px conversions,
 * element positioning, high-DPI canvas rendering, and pdf-lib generation.
 */

import { PDFDocument } from 'pdf-lib';
import {
  generateBarcodeBits,
  type BarcodeFormat
} from './barcodeEncoder';

// ─────────────────────────────────────────────────────────────
// 1. Units & Canonical Presets
// ─────────────────────────────────────────────────────────────

export type LabelUnit = 'inch' | 'mm';

export interface LabelSizePreset {
  id: string;
  name: string;
  widthInch: number;
  heightInch: number;
  category: 'retail' | 'barcode' | 'shipping' | 'custom';
  description: string;
}

export const CANONICAL_LABEL_PRESETS: LabelSizePreset[] = [
  {
    id: '2x1',
    name: '2" × 1" (50.8 × 25.4 mm)',
    widthInch: 2.0,
    heightInch: 1.0,
    category: 'barcode',
    description: 'Standard retail barcode sticker & shelf price tag'
  },
  {
    id: '2.25x1.25',
    name: '2.25" × 1.25" (57.2 × 31.8 mm)',
    widthInch: 2.25,
    heightInch: 1.25,
    category: 'retail',
    description: 'Popular apparel barcode tag & product price sticker'
  },
  {
    id: '3x2',
    name: '3" × 2" (76.2 × 50.8 mm)',
    widthInch: 3.0,
    heightInch: 2.0,
    category: 'retail',
    description: 'Medium product label with MRP, SKU, specs & barcode'
  },
  {
    id: '4x2',
    name: '4" × 2" (101.6 × 50.8 mm)',
    widthInch: 4.0,
    heightInch: 2.0,
    category: 'shipping',
    description: 'Bin label, warehouse box tag & wide product sticker'
  },
  {
    id: '4x3',
    name: '4" × 3" (101.6 × 76.2 mm)',
    widthInch: 4.0,
    heightInch: 3.0,
    category: 'shipping',
    description: 'Packaging carton label & comprehensive product card'
  },
  {
    id: '4x6',
    name: '4" × 6" (101.6 × 152.4 mm)',
    widthInch: 4.0,
    heightInch: 6.0,
    category: 'shipping',
    description: 'Standard courier / logistics shipping label'
  },
  {
    id: 'custom',
    name: 'Custom Dimensions',
    widthInch: 2.5,
    heightInch: 1.5,
    category: 'custom',
    description: 'User-specified width and height in inches or mm'
  }
];

// Centralized Conversion Constants
export const MM_PER_INCH = 25.4;
export const POINTS_PER_INCH = 72; // Standard PDF points
export const SCREEN_DPI = 96;     // Interactive screen canvas DPI
export const PRINT_DPI = 300;     // High-resolution export DPI

export function convertToInches(val: number, unit: LabelUnit): number {
  if (unit === 'inch') return val;
  return val / MM_PER_INCH;
}

export function convertToMm(val: number, unit: LabelUnit): number {
  if (unit === 'mm') return val;
  return val * MM_PER_INCH;
}

export function convertToPoints(val: number, unit: LabelUnit): number {
  const inches = convertToInches(val, unit);
  return inches * POINTS_PER_INCH;
}

export function convertToPixels(val: number, unit: LabelUnit, dpi = SCREEN_DPI): number {
  const inches = convertToInches(val, unit);
  return Math.round(inches * dpi);
}

export function validateLabelDimensions(
  width: number,
  height: number,
  unit: LabelUnit
): { valid: boolean; error?: string } {
  const wInch = convertToInches(width, unit);
  const hInch = convertToInches(height, unit);

  if (isNaN(wInch) || isNaN(hInch) || wInch <= 0 || hInch <= 0) {
    return { valid: false, error: 'Dimensions must be positive numbers.' };
  }
  if (wInch < 0.5 || hInch < 0.5) {
    return { valid: false, error: 'Minimum supported label dimension is 0.5 inches (12.7 mm).' };
  }
  if (wInch > 12 || hInch > 12) {
    return { valid: false, error: 'Maximum supported label dimension is 12 inches (304.8 mm).' };
  }
  return { valid: true };
}

// ─────────────────────────────────────────────────────────────
// 2. Element Data Model
// ─────────────────────────────────────────────────────────────

export type ElementType = 'text' | 'barcode' | 'image' | 'divider';

export type TextAlignment = 'left' | 'center' | 'right';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number; // in pixels (at screen DPI coordinate space)
  y: number;
  width: number;
  height: number;
  locked?: boolean;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number; // in pt/px at screen space
  fontWeight: 'normal' | 'bold';
  textAlign: TextAlignment;
  color: string;
  fieldTag?: 'productName' | 'price' | 'mrp' | 'sku' | 'batch' | 'size' | 'custom';
}

export interface BarcodeElement extends BaseElement {
  type: 'barcode';
  format: BarcodeFormat;
  value: string;
  barWidth: number; // in canvas px
  showText: boolean;
  fgColor: string;
  bgColor: string;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string; // Base64 data URL
  alt?: string;
  keepAspectRatio: boolean;
}

export interface DividerElement extends BaseElement {
  type: 'divider';
  orientation: 'horizontal' | 'vertical';
  strokeWidth: number;
  strokeColor: string;
}

export type LabelElement = TextElement | BarcodeElement | ImageElement | DividerElement;

export interface LabelDesignState {
  presetId: string;
  unit: LabelUnit;
  width: number; // in current unit
  height: number; // in current unit
  backgroundColor: string;
  elements: LabelElement[];
  selectedElementId: string | null;
}

// ─────────────────────────────────────────────────────────────
// 3. Quick-Add Product Field Templates
// ─────────────────────────────────────────────────────────────

export interface ProductFieldTemplate {
  tag: TextElement['fieldTag'];
  label: string;
  defaultContent: string;
  defaultFontSize: number;
  defaultBold: boolean;
  defaultAlign: TextAlignment;
}

export const PRODUCT_FIELD_TEMPLATES: ProductFieldTemplate[] = [
  {
    tag: 'productName',
    label: 'Product Name',
    defaultContent: 'Premium Cotton Polo Shirt',
    defaultFontSize: 13,
    defaultBold: true,
    defaultAlign: 'center'
  },
  {
    tag: 'price',
    label: 'Selling Price',
    defaultContent: '₹ 899.00',
    defaultFontSize: 16,
    defaultBold: true,
    defaultAlign: 'center'
  },
  {
    tag: 'mrp',
    label: 'MRP (Inclusive)',
    defaultContent: 'MRP: ₹ 1,499.00 (Incl. of all taxes)',
    defaultFontSize: 10,
    defaultBold: false,
    defaultAlign: 'center'
  },
  {
    tag: 'sku',
    label: 'SKU Code',
    defaultContent: 'SKU: POLO-BLU-L',
    defaultFontSize: 10,
    defaultBold: true,
    defaultAlign: 'center'
  },
  {
    tag: 'batch',
    label: 'Batch / Lot No.',
    defaultContent: 'Batch: B26-09A',
    defaultFontSize: 9,
    defaultBold: false,
    defaultAlign: 'center'
  },
  {
    tag: 'size',
    label: 'Size / Variant',
    defaultContent: 'Size: L (42 cm)',
    defaultFontSize: 12,
    defaultBold: true,
    defaultAlign: 'center'
  },
  {
    tag: 'custom',
    label: 'Custom Text',
    defaultContent: 'Pack of 1 | Made in India',
    defaultFontSize: 9,
    defaultBold: false,
    defaultAlign: 'center'
  }
];

// ─────────────────────────────────────────────────────────────
// 4. Pure Canvas Renderer (Screen Preview & High-DPI Export)
// ─────────────────────────────────────────────────────────────

/**
 * Renders the entire label onto an HTML5 Canvas context.
 * Scales coordinate space by (dpi / SCREEN_DPI) for crisp 300 DPI exports.
 */
export async function renderLabelToCanvas(
  canvas: HTMLCanvasElement,
  state: LabelDesignState,
  dpi = SCREEN_DPI
): Promise<void> {
  const scale = dpi / SCREEN_DPI;
  const widthPx = Math.round(convertToPixels(state.width, state.unit, dpi));
  const heightPx = Math.round(convertToPixels(state.height, state.unit, dpi));

  canvas.width = widthPx;
  canvas.height = heightPx;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Anti-aliasing and image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Draw Background
  ctx.fillStyle = state.backgroundColor || '#ffffff';
  ctx.fillRect(0, 0, widthPx, heightPx);

  // 2. Draw Elements in order
  for (const el of state.elements) {
    const elX = Math.round(el.x * scale);
    const elY = Math.round(el.y * scale);
    const elW = Math.round(el.width * scale);
    const elH = Math.round(el.height * scale);

    if (el.type === 'text') {
      const textEl = el as TextElement;
      ctx.fillStyle = textEl.color || '#0f172a';
      const weight = textEl.fontWeight === 'bold' ? 'bold' : 'normal';
      const fontSizePx = Math.max(8, Math.round(textEl.fontSize * scale));
      ctx.font = `${weight} ${fontSizePx}px Inter, -apple-system, sans-serif`;
      ctx.textBaseline = 'top';

      if (textEl.textAlign === 'center') {
        ctx.textAlign = 'center';
        ctx.fillText(textEl.content || '', elX + elW / 2, elY);
      } else if (textEl.textAlign === 'right') {
        ctx.textAlign = 'right';
        ctx.fillText(textEl.content || '', elX + elW, elY);
      } else {
        ctx.textAlign = 'left';
        ctx.fillText(textEl.content || '', elX, elY);
      }
    } else if (el.type === 'barcode') {
      const bEl = el as BarcodeElement;
      const { bits, displayValue } = generateBarcodeBits(bEl.value, bEl.format);

      if (bits) {
        // Draw background for barcode if specified
        if (bEl.bgColor && bEl.bgColor !== 'transparent') {
          ctx.fillStyle = bEl.bgColor;
          ctx.fillRect(elX, elY, elW, elH);
        }

        const barCount = bits.length;
        const totalBarWidth = elW;
        const singleBarWidth = totalBarWidth / barCount;
        const textSpace = bEl.showText ? Math.round(14 * scale) : 0;
        const actualBarHeight = Math.max(10, elH - textSpace);

        ctx.fillStyle = bEl.fgColor || '#0f172a';
        for (let i = 0; i < barCount; i++) {
          if (bits[i] === '1') {
            ctx.fillRect(
              Math.round(elX + i * singleBarWidth),
              elY,
              Math.max(1, Math.ceil(singleBarWidth)),
              actualBarHeight
            );
          }
        }

        if (bEl.showText && displayValue) {
          ctx.fillStyle = bEl.fgColor || '#0f172a';
          const bFontSize = Math.max(9, Math.round(11 * scale));
          ctx.font = `600 ${bFontSize}px Inter, monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(displayValue, elX + elW / 2, elY + elH);
        }
      }
    } else if (el.type === 'image') {
      const imgEl = el as ImageElement;
      if (imgEl.src) {
        try {
          const img = await loadImageAsync(imgEl.src);
          ctx.drawImage(img, elX, elY, elW, elH);
        } catch {
          // Gracefully ignore image loading error
        }
      }
    } else if (el.type === 'divider') {
      const dEl = el as DividerElement;
      ctx.strokeStyle = dEl.strokeColor || '#cbd5e1';
      ctx.lineWidth = Math.max(1, Math.round(dEl.strokeWidth * scale));
      ctx.beginPath();
      if (dEl.orientation === 'vertical') {
        ctx.moveTo(elX + elW / 2, elY);
        ctx.lineTo(elX + elW / 2, elY + elH);
      } else {
        ctx.moveTo(elX, elY + elH / 2);
        ctx.lineTo(elX + elW, elY + elH / 2);
      }
      ctx.stroke();
    }
  }
}

function loadImageAsync(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

// ─────────────────────────────────────────────────────────────
// 5. High-DPI PNG Exporter
// ─────────────────────────────────────────────────────────────

export async function exportLabelAsPng(
  state: LabelDesignState,
  filename = 'product_label.png',
  dpi = PRINT_DPI
): Promise<void> {
  const canvas = document.createElement('canvas');
  await renderLabelToCanvas(canvas, state, dpi);

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

// ─────────────────────────────────────────────────────────────
// 6. PDF Generation (Exact Physical Dimensions & A4 Sheet Grid)
// ─────────────────────────────────────────────────────────────

/**
 * Generates an exact single-label PDF where page size matches the label's physical size.
 */
export async function generateSingleLabelPdf(
  state: LabelDesignState,
  dpi = PRINT_DPI
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  const widthPt = convertToPoints(state.width, state.unit);
  const heightPt = convertToPoints(state.height, state.unit);

  const page = pdfDoc.addPage([widthPt, heightPt]);

  // Render high-DPI canvas to embed
  const canvas = document.createElement('canvas');
  await renderLabelToCanvas(canvas, state, dpi);
  const pngDataUrl = canvas.toDataURL('image/png');
  const pngBytes = await fetch(pngDataUrl).then(res => res.arrayBuffer());

  const pngImage = await pdfDoc.embedPng(pngBytes);
  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: widthPt,
    height: heightPt
  });

  return await pdfDoc.save();
}

/**
 * Generates an A4 sheet PDF populated with multiple copies of the label in a grid.
 * Standard A4: 595.28 × 841.89 pt (8.27" × 11.69")
 */
export async function generateSheetLabelPdf(
  state: LabelDesignState,
  copies = 12,
  dpi = PRINT_DPI
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // A4 dimensions in points
  const a4WidthPt = 595.28;
  const a4HeightPt = 841.89;

  const labelWidthPt = convertToPoints(state.width, state.unit);
  const labelHeightPt = convertToPoints(state.height, state.unit);

  const marginPt = 24; // ~0.33" margin around A4
  const gapPt = 8;     // gap between stickers

  const availWidth = a4WidthPt - marginPt * 2;
  const availHeight = a4HeightPt - marginPt * 2;

  const cols = Math.max(1, Math.floor((availWidth + gapPt) / (labelWidthPt + gapPt)));
  const rows = Math.max(1, Math.floor((availHeight + gapPt) / (labelHeightPt + gapPt)));

  // Render canvas once
  const canvas = document.createElement('canvas');
  await renderLabelToCanvas(canvas, state, dpi);
  const pngDataUrl = canvas.toDataURL('image/png');
  const pngBytes = await fetch(pngDataUrl).then(res => res.arrayBuffer());
  const pngImage = await pdfDoc.embedPng(pngBytes);

  let placed = 0;
  while (placed < copies) {
    const page = pdfDoc.addPage([a4WidthPt, a4HeightPt]);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (placed >= copies) break;

        const x = marginPt + c * (labelWidthPt + gapPt);
        // PDF coordinate system starts at bottom-left
        const y = a4HeightPt - marginPt - (r + 1) * labelHeightPt - r * gapPt;

        page.drawImage(pngImage, {
          x,
          y,
          width: labelWidthPt,
          height: labelHeightPt
        });

        placed++;
      }
    }
  }

  return await pdfDoc.save();
}

/**
 * Downloads a Uint8Array as a PDF file
 */
export function downloadPdfBytes(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

// ─────────────────────────────────────────────────────────────
// 7. Thermal Printer Guidance Metadata
// ─────────────────────────────────────────────────────────────

export interface ThermalPrinterAdvice {
  modelType: string;
  dpi: number;
  dotsPerMm: number;
  recommendedSettings: string[];
}

export const THERMAL_PRINTER_GUIDANCE: ThermalPrinterAdvice[] = [
  {
    modelType: 'Standard 203 DPI Desktop Thermal (Zebra, TSC, TVS, Honeywell)',
    dpi: 203,
    dotsPerMm: 8,
    recommendedSettings: [
      'Set print driver paper size to match exact sticker dimensions (e.g. 2.0" × 1.0" or 50mm × 25mm).',
      'Select "Direct Thermal" for thermal stickers (no ribbon), or "Thermal Transfer" for polyester/resin ribbons.',
      'Set Media Tracking to "Web / Gap" or "Mark" according to your label roll sensor.',
      'For sharp barcodes, export PNG at 300 DPI or download PDF to prevent anti-aliasing fuzziness.'
    ]
  },
  {
    modelType: 'High-Resolution 300 DPI Thermal (Zebra ZD420/620, TSC 345, Citizen)',
    dpi: 300,
    dotsPerMm: 12,
    recommendedSettings: [
      'Ideal for tiny jewellery tags, pharmaceutical labels, and dense 2D/EAN-13 barcodes.',
      'Set Print Speed to 2.0 or 3.0 inches/sec for maximum bar contrast.',
      'Use 100% black bars on pure white background (#ffffff) for optimal optical scanning.'
    ]
  }
];
