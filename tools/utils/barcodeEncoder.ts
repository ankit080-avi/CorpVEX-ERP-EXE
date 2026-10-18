/**
 * Pure TypeScript Client-Side Barcode Generator
 * Supports Code 128, Code 39, and EAN-13.
 * Renders directly to HTML5 Canvas or SVG string with download support.
 */

// Code 128 Patterns (107 patterns, each 11 bits)
const CODE128_PATTERNS = [
  '11011001100', '11001101100', '11001100110', '10010011000', '10010001100', '10001001100',
  '10011001000', '10011000100', '10001100100', '11001001000', '11001000100', '11000100100',
  '10110011100', '10011011100', '10011001110', '10111001100', '10011101100', '10011100110',
  '11001110010', '11001011100', '11001001110', '11011100100', '11001110100', '11101101110',
  '11101001100', '11100101100', '11100100110', '11101100100', '11100110100', '11100110010',
  '11011011000', '11011000110', '11000110110', '10100011000', '10001011000', '10001000110',
  '10110001000', '10001101000', '10001100010', '11010001000', '11000101000', '11000100010',
  '10110111000', '10110001110', '10001101110', '10111011000', '10111000110', '10001110110',
  '11101110110', '11010001110', '11000101110', '11011101000', '11011100010', '11011101110',
  '11101011000', '11101000110', '11100010110', '11101101000', '11101100010', '11100011010',
  '11101111010', '11001000010', '11110001010', '10100110000', '10100001100', '10010110000',
  '10010000110', '10000101100', '10000100110', '10110010000', '10110000100', '10011010000',
  '10011000010', '10000110100', '10000110010', '11000010010', '11001010000', '11110111010',
  '11000010100', '10001111010', '10100111100', '10010111100', '10010011110', '10111100100',
  '10011110100', '10011110010', '11110100100', '11110010100', '11110010010', '11011011110',
  '11011110110', '11110110110', '10101111000', '10100011110', '10001011110', '10111101000',
  '10111100010', '11110101000', '11110100010', '10111011110', '10111101110', '11101011110',
  '11110101110', '11010000100', '11010010000', '11010011100', '1100011101011' // Stop pattern is 13 bits
];

export function encodeCode128(text: string): string {
  // Use Code 128 Set B (ASCII 32 to 127)
  const startCodeB = 104;
  let checksum = startCodeB;
  let bitstring = CODE128_PATTERNS[startCodeB];

  for (let i = 0; i < text.length; i++) {
    const ascii = text.charCodeAt(i);
    const code = ascii - 32;
    if (code >= 0 && code <= 95) {
      bitstring += CODE128_PATTERNS[code];
      checksum += code * (i + 1);
    } else {
      // Fallback for space
      bitstring += CODE128_PATTERNS[0];
    }
  }

  const checkCode = checksum % 103;
  bitstring += CODE128_PATTERNS[checkCode];
  bitstring += CODE128_PATTERNS[106]; // Stop pattern
  return bitstring;
}

// Code 39 Patterns
const CODE39_MAP: Record<string, string> = {
  '0': 'bwbwbwBwb', '1': 'BwbwbwbwB', '2': 'bwBwbwbwB', '3': 'BwBwbwbwb',
  '4': 'bwbwBwbwB', '5': 'BwbwBwbwb', '6': 'bwBwBwbwb', '7': 'bwbwbwBwB',
  '8': 'BwbwbwBwb', '9': 'bwBwbwBwb', 'A': 'BwbwbwbBw', 'B': 'bwBwbwbBw',
  'C': 'BwBwbwbBw', 'D': 'bwbwBwbBw', 'E': 'BwbwBwbBw', 'F': 'bwBwBwbBw',
  'G': 'bwbwbwBBw', 'H': 'BwbwbwBBw', 'I': 'bwBwbwBBw', 'J': 'bwbwBwBBw',
  'K': 'BwbwbwbwB', 'L': 'bwBwbwbwB', 'M': 'BwBwbwbwB', 'N': 'bwbwBwbwB',
  'O': 'BwbwBwbwb', 'P': 'bwBwBwbwb', 'Q': 'bwbwbwBwB', 'R': 'BwbwbwBwB',
  'S': 'bwBwbwBwB', 'T': 'bwbwBwBwB', 'U': 'BBwbwbwbw', 'V': 'bwBBwbwbw',
  'W': 'BBwBBwbwb', 'X': 'bwBwbwBbw', 'Y': 'BBwbwbwBw', 'Z': 'bwBBwbwBw',
  '-': 'bwBwbwbwB', '.': 'BBwbwbwbw', ' ': 'bwBBwbwbw', '$': 'bwbwbwbwb',
  '/': 'bwbwbwbwb', '+': 'bwbwbwbwb', '%': 'bwbwbwbwb', '*': 'bwBwBwbwB'
};

export function encodeCode39(text: string): string {
  const upper = `*${text.toUpperCase()}*`;
  let bitstring = '';
  for (const ch of upper) {
    const pat = CODE39_MAP[ch] || CODE39_MAP['-'];
    for (let j = 0; j < pat.length; j++) {
      const c = pat[j];
      const isBar = j % 2 === 0;
      const width = (c === 'B' || c === 'W') ? 3 : 1;
      bitstring += (isBar ? '1' : '0').repeat(width);
    }
    bitstring += '0'; // Inter-character gap
  }
  return bitstring;
}

// EAN-13 Patterns
const EAN_L = [
  '0001101', '0011001', '0010011', '0111101', '0100011',
  '0110001', '0101111', '0111011', '0110111', '0001011'
];
const EAN_G = [
  '0100111', '0110011', '0011011', '0100001', '0011101',
  '0111001', '0000101', '0010001', '0001001', '0010111'
];
const EAN_R = [
  '1110010', '1100110', '1101100', '1000010', '1011100',
  '1001110', '1010000', '1000100', '1001000', '1110100'
];
const EAN_PARITY = [
  'LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG',
  'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'
];

export function encodeEan13(rawDigits: string): { bits: string; valid: boolean; fullCode: string } {
  let digits = rawDigits.replace(/\D/g, '');
  if (digits.length < 12) {
    digits = digits.padEnd(12, '0');
  } else if (digits.length > 13) {
    digits = digits.substring(0, 13);
  }

  // Calculate checksum if 12 digits
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const d = parseInt(digits[i], 10);
    sum += i % 2 === 0 ? d : d * 3;
  }
  const checksum = (10 - (sum % 10)) % 10;
  const fullCode = digits.substring(0, 12) + checksum;

  const firstDigit = parseInt(fullCode[0], 10);
  const parity = EAN_PARITY[firstDigit];

  let bitstring = '101'; // Start guard

  // Left 6 digits
  for (let i = 1; i <= 6; i++) {
    const d = parseInt(fullCode[i], 10);
    const useG = parity[i - 1] === 'G';
    bitstring += useG ? EAN_G[d] : EAN_L[d];
  }

  bitstring += '01010'; // Center guard

  // Right 6 digits
  for (let i = 7; i <= 12; i++) {
    const d = parseInt(fullCode[i], 10);
    bitstring += EAN_R[d];
  }

  bitstring += '101'; // End guard
  return { bits: bitstring, valid: true, fullCode };
}

export type BarcodeFormat = 'CODE128' | 'CODE39' | 'EAN13';

export function generateBarcodeBits(text: string, format: BarcodeFormat): { bits: string; displayValue: string } {
  if (format === 'CODE39') {
    return {
      bits: encodeCode39(text || 'CORPVEX'),
      displayValue: text.toUpperCase() || 'CORPVEX'
    };
  } else if (format === 'EAN13') {
    const res = encodeEan13(text || '890123456789');
    return {
      bits: res.bits,
      displayValue: res.fullCode
    };
  } else {
    return {
      bits: encodeCode128(text || 'CORPVEX-2026'),
      displayValue: text || 'CORPVEX-2026'
    };
  }
}

/**
 * Draw barcode to HTML5 Canvas
 */
export function drawBarcodeToCanvas(
  canvas: HTMLCanvasElement,
  bits: string,
  displayValue: string,
  options: {
    barWidth?: number;
    height?: number;
    showText?: boolean;
    fgColor?: string;
    bgColor?: string;
    padding?: number;
  } = {}
) {
  const {
    barWidth = 2,
    height = 90,
    showText = true,
    fgColor = '#0f172a',
    bgColor = '#ffffff',
    padding = 16
  } = options;

  const totalBarWidth = bits.length * barWidth;
  const canvasWidth = totalBarWidth + padding * 2;
  const canvasHeight = height + (showText ? 32 : 0) + padding * 2;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = fgColor;
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === '1') {
      ctx.fillRect(padding + i * barWidth, padding, barWidth, height);
    }
  }

  if (showText && displayValue) {
    ctx.font = '600 13px Inter, -apple-system, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(displayValue, canvasWidth / 2, padding + height + 20);
  }
}

/**
 * Export barcode as SVG string
 */
export function barcodeToSvg(
  bits: string,
  displayValue: string,
  options: {
    barWidth?: number;
    height?: number;
    showText?: boolean;
    fgColor?: string;
    bgColor?: string;
    padding?: number;
  } = {}
): string {
  const {
    barWidth = 2,
    height = 90,
    showText = true,
    fgColor = '#0f172a',
    bgColor = '#ffffff',
    padding = 16
  } = options;

  const totalBarWidth = bits.length * barWidth;
  const svgWidth = totalBarWidth + padding * 2;
  const svgHeight = height + (showText ? 32 : 0) + padding * 2;

  let rects = '';
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === '1') {
      rects += `<rect x="${padding + i * barWidth}" y="${padding}" width="${barWidth}" height="${height}" fill="${fgColor}" />`;
    }
  }

  const textElem = showText && displayValue
    ? `<text x="${svgWidth / 2}" y="${padding + height + 20}" font-family="Inter, system-ui, sans-serif" font-weight="600" font-size="13" text-anchor="middle" fill="${fgColor}">${displayValue}</text>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
    <rect width="100%" height="100%" fill="${bgColor}" />
    ${rects}
    ${textElem}
  </svg>`;
}
