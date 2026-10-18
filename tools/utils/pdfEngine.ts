import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';

export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
}

/**
 * Read the number of pages in a PDF file
 */
export async function getPdfPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    return doc.getPageCount();
  } catch (err) {
    console.warn('Could not read PDF page count:', err);
    return 1;
  }
}

/**
 * Format bytes into human readable format (KB, MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Helper to download a Uint8Array as a file in the browser
 */
export function downloadUint8Array(bytes: Uint8Array, filename: string, mimeType = 'application/pdf'): void {
  // Coerce bytes into ArrayBuffer to satisfy BlobPart typings
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/**
 * 1. PDF Merge: Combine multiple PDF files into one in given order
 */
export async function mergePdfs(
  files: File[],
  onProgress?: (percent: number, message: string) => void
): Promise<Uint8Array> {
  if (files.length === 0) throw new Error('No PDF files selected for merging.');
  
  onProgress?.(10, 'Initializing merge engine...');
  const mergedDoc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const pct = Math.round(10 + ((i + 1) / files.length) * 80);
    onProgress?.(pct, `Merging ${f.name} (${i + 1} of ${files.length})...`);
    
    const bytes = await f.arrayBuffer();
    const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const copiedPages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
    copiedPages.forEach((page) => mergedDoc.addPage(page));
  }

  onProgress?.(95, 'Finalizing merged document...');
  const result = await mergedDoc.save();
  onProgress?.(100, 'Complete!');
  return result;
}

/**
 * 2. PDF Split: Extract specific pages or split into ranges
 */
export async function splitPdf(
  file: File,
  pageRangeStr: string,
  onProgress?: (percent: number, message: string) => void
): Promise<{ filename: string; bytes: Uint8Array }[]> {
  onProgress?.(15, 'Loading PDF document...');
  const bytes = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const results: { filename: string; bytes: Uint8Array }[] = [];
  const baseName = file.name.replace(/\.[^/.]+$/, '');

  // If user requested "all" -> 1 PDF per page
  if (pageRangeStr.trim().toLowerCase() === 'all') {
    for (let p = 0; p < totalPages; p++) {
      onProgress?.(Math.round(20 + ((p + 1) / totalPages) * 70), `Extracting page ${p + 1} of ${totalPages}...`);
      const singleDoc = await PDFDocument.create();
      const [copiedPage] = await singleDoc.copyPages(srcDoc, [p]);
      singleDoc.addPage(copiedPage);
      const outBytes = await singleDoc.save();
      results.push({
        filename: `${baseName}-page-${p + 1}.pdf`,
        bytes: outBytes,
      });
    }
  } else {
    // Parse comma-separated ranges e.g. "1-3, 4, 5-8"
    const parts = pageRangeStr.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length === 0) throw new Error('Please specify valid page numbers or ranges (e.g. 1-3, 5).');

    for (let idx = 0; idx < parts.length; idx++) {
      const part = parts[idx];
      const pageIndicesToCopy: number[] = [];

      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
          throw new Error(`Invalid range: "${part}". Ensure numbers are positive and start <= end.`);
        }
        for (let p = Math.max(1, start); p <= Math.min(totalPages, end); p++) {
          pageIndicesToCopy.push(p - 1);
        }
      } else {
        const p = parseInt(part, 10);
        if (isNaN(p) || p < 1 || p > totalPages) {
          throw new Error(`Invalid page number "${part}". Document only has ${totalPages} pages.`);
        }
        pageIndicesToCopy.push(p - 1);
      }

      if (pageIndicesToCopy.length === 0) {
        throw new Error(`Range "${part}" exceeds the document page count (${totalPages} pages).`);
      }

      onProgress?.(Math.round(20 + ((idx + 1) / parts.length) * 70), `Building split part ${idx + 1}...`);
      const rangeDoc = await PDFDocument.create();
      const copiedPages = await rangeDoc.copyPages(srcDoc, pageIndicesToCopy);
      copiedPages.forEach((cp) => rangeDoc.addPage(cp));
      const outBytes = await rangeDoc.save();
      results.push({
        filename: `${baseName}-part-${idx + 1}.pdf`,
        bytes: outBytes,
      });
    }
  }

  onProgress?.(100, 'Complete!');
  return results;
}

/**
 * 3. PDF Page Extractor: Extract specific pages into a single new PDF
 */
export async function extractPages(
  file: File,
  pageNumbersList: number[],
  onProgress?: (percent: number, message: string) => void
): Promise<Uint8Array> {
  if (pageNumbersList.length === 0) throw new Error('Please enter at least one page number to extract.');

  onProgress?.(20, 'Loading PDF document...');
  const bytes = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const validZeroBasedIndices: number[] = [];
  for (const p of pageNumbersList) {
    if (p >= 1 && p <= totalPages) {
      validZeroBasedIndices.push(p - 1);
    }
  }

  if (validZeroBasedIndices.length === 0) {
    throw new Error(`No valid pages selected. The document contains ${totalPages} pages.`);
  }

  onProgress?.(60, 'Extracting selected pages...');
  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, validZeroBasedIndices);
  copiedPages.forEach((cp) => newDoc.addPage(cp));

  onProgress?.(90, 'Saving extracted PDF...');
  const result = await newDoc.save();
  onProgress?.(100, 'Complete!');
  return result;
}

/**
 * 4. PDF Rotate: Rotate pages clockwise (90, 180, 270 degrees)
 */
export async function rotatePdf(
  file: File,
  rotationAngle: 90 | 180 | 270,
  targetScope: 'all' | 'odd' | 'even' = 'all',
  onProgress?: (percent: number, message: string) => void
): Promise<Uint8Array> {
  onProgress?.(25, 'Loading PDF document...');
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pages = doc.getPages();

  onProgress?.(50, `Rotating ${targetScope} pages by ${rotationAngle}°...`);
  pages.forEach((page, idx) => {
    const pageNumber = idx + 1;
    const isOdd = pageNumber % 2 !== 0;
    const shouldRotate =
      targetScope === 'all' ||
      (targetScope === 'odd' && isOdd) ||
      (targetScope === 'even' && !isOdd);

    if (shouldRotate) {
      const currentAngle = page.getRotation().angle;
      page.setRotation(degrees((currentAngle + rotationAngle) % 360));
    }
  });

  onProgress?.(90, 'Saving rotated document...');
  const result = await doc.save();
  onProgress?.(100, 'Complete!');
  return result;
}

/**
 * 5. Images / JPG to PDF: Convert multiple JPG/PNG images into a paginated PDF
 */
export async function imagesToPdf(
  files: File[],
  onProgress?: (percent: number, message: string) => void
): Promise<Uint8Array> {
  if (files.length === 0) throw new Error('Please select at least one image file (JPG, PNG).');

  onProgress?.(10, 'Creating blank PDF canvas...');
  const doc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const pct = Math.round(15 + ((i + 1) / files.length) * 75);
    onProgress?.(pct, `Embedding image ${i + 1} of ${files.length} (${f.name})...`);

    const imgBytes = await f.arrayBuffer();
    const isPng = f.type === 'image/png' || f.name.toLowerCase().endsWith('.png');

    let imageEmbed;
    if (isPng) {
      imageEmbed = await doc.embedPng(imgBytes);
    } else {
      // Default to JPEG
      imageEmbed = await doc.embedJpg(imgBytes);
    }

    const { width, height } = imageEmbed;
    const page = doc.addPage([width, height]);
    page.drawImage(imageEmbed, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  onProgress?.(95, 'Generating PDF...');
  const result = await doc.save();
  onProgress?.(100, 'Complete!');
  return result;
}

/**
 * 6. PDF Number Pages: Add page numbers to header or footer
 */
export async function numberPages(
  file: File,
  options: {
    position: 'bottom-center' | 'bottom-right' | 'top-right';
    startNumber: number;
    format: 'page-x' | 'page-x-of-y' | 'number-only';
  },
  onProgress?: (percent: number, message: string) => void
): Promise<Uint8Array> {
  onProgress?.(20, 'Loading PDF and fonts...');
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const total = pages.length;

  onProgress?.(50, `Adding page numbers to ${total} pages...`);
  pages.forEach((page, idx) => {
    const currentNum = idx + options.startNumber;
    let label = '';
    if (options.format === 'number-only') {
      label = `${currentNum}`;
    } else if (options.format === 'page-x') {
      label = `Page ${currentNum}`;
    } else {
      label = `Page ${currentNum} of ${total + options.startNumber - 1}`;
    }

    const { width, height } = page.getSize();
    const fontSize = 10;
    const textWidth = font.widthOfTextAtSize(label, fontSize);

    let x = 0;
    let y = 0;
    if (options.position === 'bottom-center') {
      x = (width - textWidth) / 2;
      y = 20;
    } else if (options.position === 'bottom-right') {
      x = width - textWidth - 30;
      y = 20;
    } else {
      // top-right
      x = width - textWidth - 30;
      y = height - 25;
    }

    page.drawText(label, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.35, 0.35, 0.35),
    });
  });

  onProgress?.(90, 'Finalizing numbered document...');
  const result = await doc.save();
  onProgress?.(100, 'Complete!');
  return result;
}

/**
 * 7. PDF Metadata Remover: Strip author, producer, title, and creation dates
 */
export async function removeMetadata(
  file: File,
  onProgress?: (percent: number, message: string) => void
): Promise<Uint8Array> {
  onProgress?.(25, 'Loading PDF document...');
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

  onProgress?.(60, 'Sanitizing metadata dictionary...');
  doc.setTitle('');
  doc.setAuthor('');
  doc.setSubject('');
  doc.setKeywords([]);
  doc.setProducer('');
  doc.setCreator('');
  doc.setCreationDate(new Date(0));
  doc.setModificationDate(new Date(0));

  onProgress?.(90, 'Writing privacy-sanitized PDF...');
  const result = await doc.save();
  onProgress?.(100, 'Complete!');
  return result;
}
