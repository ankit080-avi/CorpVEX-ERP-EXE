/**
 * Pure TypeScript Client-Side QR Code Matrix Generator
 * Self-contained, zero-dependency, deterministic implementation of ISO/IEC 18004.
 * Generates boolean[][] module grid for rendering to Canvas, SVG, or Data URI.
 */

// Error correction levels
export type QrErrorLevel = 'L' | 'M' | 'Q' | 'H';

// Reed-Solomon generator polynomial tables & Galois Field GF(256)
const GF256_EXP: number[] = new Array(512);
const GF256_LOG: number[] = new Array(256);

(function initGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = x;
    GF256_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d; // generator poly x^8 + x^4 + x^3 + x^2 + 1
  }
  for (let i = 255; i < 512; i++) {
    GF256_EXP[i] = GF256_EXP[i - 255];
  }
})();

function gfMultiply(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return GF256_EXP[GF256_LOG[x] + GF256_LOG[y]];
}

// RS Generator Polynomial for ECC
function getRsGenerator(deg: number): number[] {
  let poly = [1];
  for (let i = 0; i < deg; i++) {
    const nextPoly: number[] = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      nextPoly[j] ^= gfMultiply(poly[j], GF256_EXP[i]);
      nextPoly[j + 1] ^= poly[j];
    }
    poly = nextPoly;
  }
  return poly;
}

function computeRsRemainder(data: Uint8Array, eccCount: number): Uint8Array {
  const gen = getRsGenerator(eccCount);
  const remainder = new Uint8Array(eccCount);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ remainder[0];
    for (let j = 0; j < eccCount - 1; j++) {
      remainder[j] = remainder[j + 1] ^ gfMultiply(factor, gen[j + 1]);
    }
    remainder[eccCount - 1] = gfMultiply(factor, gen[eccCount]);
  }
  return remainder;
}

// Version table capacities (Byte mode with Level M error correction)
const VERSION_CAPACITIES_M = [
  0, 14, 26, 42, 62, 84, 106, 122, 152, 180, 213, 251, 287, 331, 362, 412, 450, 504, 560, 624, 666
];

const ECC_PER_BLOCK_M = [
  0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26
];

const NUM_BLOCKS_M = [
  0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16
];

export interface QrCodeResult {
  size: number;
  modules: boolean[][];
}

export function generateQrMatrix(text: string, maxVersion = 10): QrCodeResult {
  // UTF-8 byte encode
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);

  // Select minimum suitable version (Level M)
  let version = 1;
  while (version <= maxVersion && bytes.length > VERSION_CAPACITIES_M[version]) {
    version++;
  }
  if (version > maxVersion) {
    version = maxVersion;
  }

  const moduleCount = version * 4 + 17;
  const modules: boolean[][] = Array.from({ length: moduleCount }, () => new Array(moduleCount).fill(false));
  const isFunction: boolean[][] = Array.from({ length: moduleCount }, () => new Array(moduleCount).fill(false));

  // 1. Finder patterns (Top-Left, Top-Right, Bottom-Left)
  function placeFinder(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = row + r;
        const nc = col + c;
        if (nr >= 0 && nr < moduleCount && nc >= 0 && nc < moduleCount) {
          isFunction[nr][nc] = true;
          if (r >= 0 && r <= 6 && (c === 0 || c === 6 || r === 0 || r === 6)) {
            modules[nr][nc] = true;
          } else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) {
            modules[nr][nc] = true;
          } else {
            modules[nr][nc] = false;
          }
        }
      }
    }
  }

  placeFinder(0, 0);
  placeFinder(0, moduleCount - 7);
  placeFinder(moduleCount - 7, 0);

  // 2. Timing patterns
  for (let i = 8; i < moduleCount - 8; i++) {
    modules[6][i] = i % 2 === 0;
    modules[i][6] = i % 2 === 0;
    isFunction[6][i] = true;
    isFunction[i][6] = true;
  }

  // 3. Dark module
  modules[moduleCount - 8][8] = true;
  isFunction[moduleCount - 8][8] = true;

  // 4. Reserve format bits areas
  for (let i = 0; i < 9; i++) {
    isFunction[8][i] = true;
    isFunction[i][8] = true;
  }
  for (let i = moduleCount - 8; i < moduleCount; i++) {
    isFunction[8][i] = true;
    isFunction[i][8] = true;
  }

  // 5. Build Bitstream (Byte Mode: 0100)
  const bitstream: number[] = [];
  function appendBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) {
      bitstream.push((val >>> i) & 1);
    }
  }

  appendBits(0b0100, 4); // Byte mode indicator
  const charCountBits = version < 10 ? 8 : 16;
  appendBits(bytes.length, charCountBits);
  for (let i = 0; i < bytes.length; i++) {
    appendBits(bytes[i], 8);
  }

  // Terminator
  const totalDataBits = VERSION_CAPACITIES_M[version] * 8;
  const termLen = Math.min(4, totalDataBits - bitstream.length);
  appendBits(0, termLen);

  // Byte align
  while (bitstream.length % 8 !== 0) {
    bitstream.push(0);
  }

  // Pad bytes (0xEC, 0x11 alternating)
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bitstream.length < totalDataBits) {
    appendBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  // Convert bitstream to data bytes
  const dataBytes = new Uint8Array(bitstream.length / 8);
  for (let i = 0; i < dataBytes.length; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bitstream[i * 8 + j];
    }
    dataBytes[i] = b;
  }

  // Reed-Solomon error correction calculation
  const eccLen = ECC_PER_BLOCK_M[version] || 16;
  const numBlocks = NUM_BLOCKS_M[version] || 1;
  const blockSize = Math.floor(dataBytes.length / numBlocks);
  
  const allBlocksData: Uint8Array[] = [];
  const allBlocksEcc: Uint8Array[] = [];

  for (let b = 0; b < numBlocks; b++) {
    const chunk = dataBytes.slice(b * blockSize, (b + 1) * blockSize);
    allBlocksData.push(chunk);
    allBlocksEcc.push(computeRsRemainder(chunk, eccLen));
  }

  // Interleave data & ECC bytes
  const finalSequence: number[] = [];
  const maxBlockLen = blockSize;
  for (let i = 0; i < maxBlockLen; i++) {
    for (let b = 0; b < numBlocks; b++) {
      if (i < allBlocksData[b].length) {
        finalSequence.push(allBlocksData[b][i]);
      }
    }
  }
  for (let i = 0; i < eccLen; i++) {
    for (let b = 0; b < numBlocks; b++) {
      finalSequence.push(allBlocksEcc[b][i]);
    }
  }

  // Interleaved bitstream
  const finalBits: number[] = [];
  for (const byte of finalSequence) {
    for (let j = 7; j >= 0; j--) {
      finalBits.push((byte >>> j) & 1);
    }
  }

  // 6. Placement of data bits in matrix (right-to-left zigzag)
  let bitIdx = 0;
  let upward = true;
  for (let right = moduleCount - 1; right > 0; right -= 2) {
    if (right === 6) right--; // Skip vertical timing column
    const rows = upward
      ? Array.from({ length: moduleCount }, (_, i) => moduleCount - 1 - i)
      : Array.from({ length: moduleCount }, (_, i) => i);

    for (const r of rows) {
      for (const col of [right, right - 1]) {
        if (!isFunction[r][col]) {
          let bit = 0;
          if (bitIdx < finalBits.length) {
            bit = finalBits[bitIdx++];
          }
          // Mask pattern 0: (row + col) % 2 === 0
          const mask = (r + col) % 2 === 0;
          modules[r][col] = (bit ^ (mask ? 1 : 0)) === 1;
        }
      }
    }
    upward = !upward;
  }

  // 7. Format bits for Level M + Mask 0
  // Level M = 00, Mask 0 = 000 -> 00000 -> BCH code: 101010000010010
  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
  
  // Top-left format placement
  for (let i = 0; i < 6; i++) modules[8][i] = formatBits[i] === 1;
  modules[8][7] = formatBits[6] === 1;
  modules[8][8] = formatBits[7] === 1;
  modules[7][8] = formatBits[8] === 1;
  for (let i = 9; i < 15; i++) modules[14 - i][8] = formatBits[i] === 1;

  // Split format placement (around other corners)
  for (let i = 0; i < 8; i++) modules[moduleCount - 1 - i][8] = formatBits[i] === 1;
  for (let i = 8; i < 15; i++) modules[8][moduleCount - 15 + i] = formatBits[i] === 1;

  return {
    size: moduleCount,
    modules
  };
}

/**
 * Draw QR Code directly to an HTML5 Canvas
 */
export function drawQrToCanvas(
  canvas: HTMLCanvasElement,
  qr: QrCodeResult,
  options: {
    size?: number;
    fgColor?: string;
    bgColor?: string;
    quietZone?: number;
  } = {}
) {
  const {
    size = 280,
    fgColor = '#0f172a',
    bgColor = '#ffffff',
    quietZone = 4
  } = options;

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  const totalGrid = qr.size + quietZone * 2;
  const cellSize = size / totalGrid;

  ctx.fillStyle = fgColor;
  for (let r = 0; r < qr.size; r++) {
    for (let c = 0; c < qr.size; c++) {
      if (qr.modules[r][c]) {
        ctx.fillRect(
          Math.floor((c + quietZone) * cellSize),
          Math.floor((r + quietZone) * cellSize),
          Math.ceil(cellSize),
          Math.ceil(cellSize)
        );
      }
    }
  }
}

/**
 * Export QR code as an SVG string
 */
export function qrToSvg(
  qr: QrCodeResult,
  options: {
    size?: number;
    fgColor?: string;
    bgColor?: string;
    quietZone?: number;
  } = {}
): string {
  const {
    size = 280,
    fgColor = '#0f172a',
    bgColor = '#ffffff',
    quietZone = 4
  } = options;

  const totalGrid = qr.size + quietZone * 2;
  let rects = '';

  for (let r = 0; r < qr.size; r++) {
    for (let c = 0; c < qr.size; c++) {
      if (qr.modules[r][c]) {
        rects += `<rect x="${c + quietZone}" y="${r + quietZone}" width="1" height="1" fill="${fgColor}" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalGrid} ${totalGrid}" width="${size}" height="${size}">
    <rect width="100%" height="100%" fill="${bgColor}" />
    ${rects}
  </svg>`;
}
