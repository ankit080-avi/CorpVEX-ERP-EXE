import React from 'react';
import { PdfToolShell, type BackendEngineInfo } from './PdfToolShell';

// Helper component factory for heavy tools
function createBackendPdfTool(
  toolSlug: string,
  toolTitle: string,
  subtitle: string,
  acceptExtensions: string[],
  acceptLabel: string,
  backendInfo: BackendEngineInfo
): React.FC<{ theme: 'dark' | 'light' }> {
  const Component: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
    return (
      <PdfToolShell
        theme={theme}
        toolSlug={toolSlug}
        toolTitle={toolTitle}
        subtitle={subtitle}
        acceptExtensions={acceptExtensions}
        acceptLabel={acceptLabel}
        multiple={false}
        isBackendRequired={true}
        backendInfo={backendInfo}
        actionButtonLabel={`Convert with ${backendInfo.engineName}`}
      />
    );
  };
  Component.displayName = `BackendPdfTool_${toolSlug}`;
  return Component;
}

// 1. PDF to Word
export const PdfToWordTool = createBackendPdfTool(
  'pdf-to-word',
  'PDF to Word Converter',
  'Convert PDF documents into editable Microsoft Word (.docx) documents with intact layout, font styles, and tabular paragraphs.',
  ['.pdf'],
  'PDF document (.pdf)',
  {
    engineName: 'CorpVEX Headless Document Transcoder',
    requiredEngine: 'LibreOffice 7.6 Headless & Poppler pdf2docx',
    apiEndpoint: '/api/v1/pdf/convert/docx',
    supportedFormats: 'PDF to DOCX / DOC',
  }
);

// 2. PDF to Excel
export const PdfToExcelTool = createBackendPdfTool(
  'pdf-to-excel',
  'PDF to Excel Converter',
  'Extract accounting ledgers, bank statements, and structured tables from PDF into native Microsoft Excel (.xlsx) spreadsheets.',
  ['.pdf'],
  'PDF document (.pdf)',
  {
    engineName: 'CorpVEX Tabular Extraction Worker',
    requiredEngine: 'Tabula Java / Camelot Python Microservice',
    apiEndpoint: '/api/v1/pdf/convert/xlsx',
    supportedFormats: 'PDF to XLSX / CSV',
  }
);

// 3. Word to PDF
export const WordToPdfTool = createBackendPdfTool(
  'word-to-pdf',
  'Word to PDF Converter',
  'Convert DOC and DOCX Word documents into professional, print-ready PDF files with preserved formatting and embedded fonts.',
  ['.docx', '.doc'],
  'Word document (.docx, .doc)',
  {
    engineName: 'CorpVEX Office Render Service',
    requiredEngine: 'LibreOffice Document Virtual Print Engine',
    apiEndpoint: '/api/v1/office/convert/pdf',
    supportedFormats: 'DOCX / DOC to PDF',
  }
);

// 4. Excel to PDF
export const ExcelToPdfTool = createBackendPdfTool(
  'excel-to-pdf',
  'Excel to PDF Converter',
  'Convert Microsoft Excel spreadsheets and workbooks into cleanly formatted, paginated PDF documents with page fit options.',
  ['.xlsx', '.xls'],
  'Excel workbook (.xlsx, .xls)',
  {
    engineName: 'CorpVEX Spreadsheet Render Service',
    requiredEngine: 'LibreOffice Calc Headless Engine',
    apiEndpoint: '/api/v1/office/convert/pdf',
    supportedFormats: 'XLSX / XLS to PDF',
  }
);

// 5. PDF Compress
export const PdfCompressTool = createBackendPdfTool(
  'pdf-compress',
  'PDF Compress & Size Reducer',
  'Reduce PDF file size without sacrificing readability using advanced raster image downsampling and font subsetting.',
  ['.pdf'],
  'PDF document (.pdf)',
  {
    engineName: 'CorpVEX Stream Optimizer',
    requiredEngine: 'Ghostscript 10.x / QPDF Linearizer',
    apiEndpoint: '/api/v1/pdf/compress',
    supportedFormats: 'PDF Size Reduction (Screen / Ebook / Printer)',
  }
);

// 6. PDF Unlock
export const PdfUnlockTool = createBackendPdfTool(
  'pdf-unlock',
  'PDF Unlock & Password Remover',
  'Remove owner restrictions and print permissions passwords from authorized PDF files.',
  ['.pdf'],
  'Encrypted PDF (.pdf)',
  {
    engineName: 'CorpVEX Cryptographic Decryptor',
    requiredEngine: 'QPDF Decryption Worker',
    apiEndpoint: '/api/v1/pdf/unlock',
    supportedFormats: 'AES-128 / AES-256 PDF Decryption',
  }
);

// 7. PDF Protect / Password
export const PdfProtectTool = createBackendPdfTool(
  'pdf-protect',
  'PDF Protect & Password Encryption',
  'Secure sensitive commercial agreements and payroll documents with enterprise-grade 256-bit AES encryption.',
  ['.pdf'],
  'PDF document (.pdf)',
  {
    engineName: 'CorpVEX Security Cipher Service',
    requiredEngine: 'QPDF Standard 256-Bit AES Engine',
    apiEndpoint: '/api/v1/pdf/protect',
    supportedFormats: '256-bit AES PDF Encryption',
  }
);

// 8. PDF to JPG
export const PdfToJpgTool = createBackendPdfTool(
  'pdf-to-jpg',
  'PDF to JPG Image Converter',
  'Render every page of your PDF document into high-resolution JPG images suitable for web publishing and presentations.',
  ['.pdf'],
  'PDF document (.pdf)',
  {
    engineName: 'CorpVEX High-DPI Raster Engine',
    requiredEngine: 'Poppler pdftoppm / Cairo Graphics Microservice',
    apiEndpoint: '/api/v1/pdf/render/jpg',
    supportedFormats: 'PDF to 300-DPI JPG',
  }
);

// 9. PDF Watermark
export const PdfWatermarkTool = createBackendPdfTool(
  'pdf-watermark',
  'PDF Watermark Tool',
  'Apply custom text stamps (Confidential, Draft, Approved) or company logo watermarks diagonally across all pages.',
  ['.pdf'],
  'PDF document (.pdf)',
  {
    engineName: 'CorpVEX Stamping & Overlay Engine',
    requiredEngine: 'PyMuPDF Watermarking Daemon',
    apiEndpoint: '/api/v1/pdf/watermark',
    supportedFormats: 'Diagonal Text & PNG Image Stamping',
  }
);

// 10. PDF Sign
export const PdfSignTool = createBackendPdfTool(
  'pdf-sign',
  'PDF Sign & Digital Signature',
  'Place cryptographic PKI digital signatures or drawn signature stamps onto agreements, purchase orders, and tax invoices.',
  ['.pdf'],
  'PDF document (.pdf)',
  {
    engineName: 'CorpVEX Digital Signature Service',
    requiredEngine: 'X.509 PKI / DSC Token Cryptographic Signer',
    apiEndpoint: '/api/v1/pdf/sign',
    supportedFormats: 'Class-3 DSC / PAdES Digital Signatures',
  }
);

// 11. PDF Text Extractor
export const PdfTextExtractorTool = createBackendPdfTool(
  'pdf-text-extractor',
  'PDF Text Extractor',
  'Extract raw ASCII / Unicode text strings and paragraphs from searchable PDF documents without loading images.',
  ['.pdf'],
  'Searchable PDF (.pdf)',
  {
    engineName: 'CorpVEX Text Parser',
    requiredEngine: 'Apache PDFBox / Poppler pdftotext',
    apiEndpoint: '/api/v1/pdf/extract-text',
    supportedFormats: 'UTF-8 Plain Text Extraction',
  }
);

// 12. PDF OCR
export const PdfOcrTool = createBackendPdfTool(
  'pdf-ocr',
  'PDF OCR (Optical Character Recognition)',
  'Convert scanned image-only PDFs and physical receipts into fully searchable, selectable text documents using neural OCR.',
  ['.pdf'],
  'Scanned PDF (.pdf)',
  {
    engineName: 'CorpVEX Neural OCR Pipeline',
    requiredEngine: 'Tesseract OCR 5.x with Indian Language Models (Eng/Hin/Guj)',
    apiEndpoint: '/api/v1/pdf/ocr',
    supportedFormats: 'Searchable PDF/A Output',
  }
);
