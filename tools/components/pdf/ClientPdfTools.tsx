import React, { useState } from 'react';
import { PdfToolShell } from './PdfToolShell';
import {
  mergePdfs,
  splitPdf,
  rotatePdf,
  imagesToPdf,
  extractPages,
  numberPages,
  removeMetadata,
  type FileItem,
} from '../../utils/pdfEngine';

// 1. PDF Merge
export const PdfMergeTool: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  return (
    <PdfToolShell
      theme={theme}
      toolSlug="pdf-merge"
      toolTitle="PDF Merge"
      subtitle="Combine multiple PDF documents into a single organized file in any sequence you choose. All processing runs 100% client-side in your browser."
      acceptExtensions={['.pdf']}
      acceptMimeTypes={['application/pdf']}
      acceptLabel="PDF files (.pdf)"
      multiple={true}
      maxFiles={25}
      maxSizeMB={80}
      actionButtonLabel="Merge All PDFs"
      onExecute={async (files, _opts, onProgress) => {
        const rawFiles = files.map((f) => f.file);
        const mergedBytes = await mergePdfs(rawFiles, onProgress);
        return {
          filename: 'merged-document.pdf',
          bytes: mergedBytes,
        };
      }}
    />
  );
};

// 2. PDF Split
export const PdfSplitTool: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  return (
    <PdfToolShell
      theme={theme}
      toolSlug="pdf-split"
      toolTitle="PDF Split"
      subtitle="Split a PDF into individual single-page documents or extract specific page ranges (e.g., 1-3, 5-8)."
      acceptExtensions={['.pdf']}
      acceptMimeTypes={['application/pdf']}
      acceptLabel="PDF file (.pdf)"
      multiple={false}
      initialOptions={{ mode: 'ranges', ranges: '1-2' }}
      actionButtonLabel="Split PDF"
      renderCustomOptions={(files, opts, setOpts, t) => {
        const dk = t === 'dark';
        const fg = dk ? '#f8fafc' : '#0f172a';
        const fg2 = dk ? '#94a3b8' : '#64748b';
        const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        const inputBg = dk ? '#151f30' : '#f8fafc';
        const totalPages = files[0]?.pageCount || 1;

        return (
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: fg, marginBottom: 12 }}>
              Split Configuration ({totalPages} total pages detected)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: fg, fontSize: 13.5 }}>
                <input
                  type="radio"
                  name="splitMode"
                  checked={opts.mode === 'all'}
                  onChange={() => setOpts({ ...opts, mode: 'all' })}
                />
                <span>Split all pages into separate single-page PDFs ({totalPages} files)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: fg, fontSize: 13.5 }}>
                <input
                  type="radio"
                  name="splitMode"
                  checked={opts.mode === 'ranges'}
                  onChange={() => setOpts({ ...opts, mode: 'ranges' })}
                />
                <span>Split by custom page ranges (e.g. 1-2, 3-5)</span>
              </label>

              {opts.mode === 'ranges' && (
                <div style={{ marginTop: 6, paddingLeft: 24 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: fg2, marginBottom: 6 }}>
                    Page Ranges (comma-separated):
                  </label>
                  <input
                    type="text"
                    value={opts.ranges || ''}
                    placeholder="e.g. 1-2, 3-5"
                    onChange={(e) => setOpts({ ...opts, ranges: e.target.value })}
                    style={{
                      width: '100%',
                      maxWidth: 320,
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: `1px solid ${bdr}`,
                      background: inputBg,
                      color: fg,
                      fontSize: 14,
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ fontSize: 11.5, color: fg2, marginTop: 4 }}>
                    Use format &ldquo;1-3, 5, 6-8&rdquo;. Numbers must be between 1 and {totalPages}.
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }}
      onExecute={async (files, opts, onProgress) => {
        const file = files[0].file;
        const rangeParam = opts.mode === 'all' ? 'all' : opts.ranges || '1';
        const parts = await splitPdf(file, rangeParam, onProgress);
        return parts;
      }}
    />
  );
};

// 3. PDF Rotate
export const PdfRotateTool: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  return (
    <PdfToolShell
      theme={theme}
      toolSlug="pdf-rotate"
      toolTitle="PDF Rotate"
      subtitle="Rotate all pages or select odd/even pages by 90°, 180°, or 270° clockwise with permanent orientation saving."
      acceptExtensions={['.pdf']}
      acceptMimeTypes={['application/pdf']}
      acceptLabel="PDF file (.pdf)"
      multiple={false}
      initialOptions={{ angle: 90, scope: 'all' }}
      actionButtonLabel="Rotate PDF"
      renderCustomOptions={(files, opts, setOpts, t) => {
        const dk = t === 'dark';
        const fg = dk ? '#f8fafc' : '#0f172a';
        const fg2 = dk ? '#94a3b8' : '#64748b';
        const acc = dk ? '#e8a838' : '#d97706';
        const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: fg, marginBottom: 8 }}>
                Rotation Angle (Clockwise)
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => setOpts({ ...opts, angle: deg })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 8,
                      border: opts.angle === deg ? `1px solid ${acc}` : `1px solid ${bdr}`,
                      background: opts.angle === deg ? (dk ? 'rgba(232, 168, 56, 0.16)' : 'rgba(217, 119, 6, 0.1)') : 'transparent',
                      color: opts.angle === deg ? acc : fg,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    +{deg}°
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: fg, marginBottom: 8 }}>
                Target Pages ({files[0]?.pageCount || 1} pages)
              </div>
              <select
                value={opts.scope || 'all'}
                onChange={(e) => setOpts({ ...opts, scope: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: `1px solid ${bdr}`,
                  background: dk ? '#151f30' : '#f8fafc',
                  color: fg,
                  fontSize: 13.5,
                  fontWeight: 600,
                }}
              >
                <option value="all">All Pages</option>
                <option value="odd">Odd Pages Only (1, 3, 5...)</option>
                <option value="even">Even Pages Only (2, 4, 6...)</option>
              </select>
            </div>
          </div>
        );
      }}
      onExecute={async (files, opts, onProgress) => {
        const file = files[0].file;
        const angle = opts.angle || 90;
        const scope = opts.scope || 'all';
        const bytes = await rotatePdf(file, angle, scope, onProgress);
        return {
          filename: `rotated-${file.name}`,
          bytes,
        };
      }}
    />
  );
};

// 4. Images to PDF
export const ImagesToPdfTool: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  return (
    <PdfToolShell
      theme={theme}
      toolSlug="images-to-pdf"
      toolTitle="Images to PDF"
      subtitle="Convert PNG, JPG, and JPEG images into a single paginated PDF document. Reorder images to arrange page order."
      acceptExtensions={['.jpg', '.jpeg', '.png']}
      acceptMimeTypes={['image/jpeg', 'image/png']}
      acceptLabel="Images (JPG, JPEG, PNG)"
      multiple={true}
      maxFiles={30}
      maxSizeMB={50}
      actionButtonLabel="Convert Images to PDF"
      onExecute={async (files, _opts, onProgress) => {
        const rawFiles = files.map((f) => f.file);
        const bytes = await imagesToPdf(rawFiles, onProgress);
        return {
          filename: 'converted-images.pdf',
          bytes,
        };
      }}
    />
  );
};

// 5. JPG to PDF
export const JpgToPdfTool: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  return (
    <PdfToolShell
      theme={theme}
      toolSlug="jpg-to-pdf"
      toolTitle="JPG to PDF"
      subtitle="Fast client-side converter to combine JPG photos, receipts, or document scans into a high-resolution PDF."
      acceptExtensions={['.jpg', '.jpeg']}
      acceptMimeTypes={['image/jpeg']}
      acceptLabel="JPG Images (.jpg, .jpeg)"
      multiple={true}
      maxFiles={30}
      maxSizeMB={50}
      actionButtonLabel="Convert JPG to PDF"
      onExecute={async (files, _opts, onProgress) => {
        const rawFiles = files.map((f) => f.file);
        const bytes = await imagesToPdf(rawFiles, onProgress);
        return {
          filename: 'converted-jpg.pdf',
          bytes,
        };
      }}
    />
  );
};

// 6. PDF Page Extractor
export const PdfPageExtractorTool: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  return (
    <PdfToolShell
      theme={theme}
      toolSlug="pdf-page-extractor"
      toolTitle="PDF Page Extractor"
      subtitle="Extract specific pages from your PDF into a brand-new concise PDF file."
      acceptExtensions={['.pdf']}
      acceptMimeTypes={['application/pdf']}
      acceptLabel="PDF file (.pdf)"
      multiple={false}
      initialOptions={{ pagesInput: '1, 2' }}
      actionButtonLabel="Extract Selected Pages"
      renderCustomOptions={(files, opts, setOpts, t) => {
        const dk = t === 'dark';
        const fg = dk ? '#f8fafc' : '#0f172a';
        const fg2 = dk ? '#94a3b8' : '#64748b';
        const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        const inputBg = dk ? '#151f30' : '#f8fafc';
        const total = files[0]?.pageCount || 1;

        return (
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: fg, marginBottom: 6 }}>
              Pages to Extract (Document has {total} pages)
            </label>
            <input
              type="text"
              value={opts.pagesInput || ''}
              placeholder="e.g. 1, 3, 5-7"
              onChange={(e) => setOpts({ ...opts, pagesInput: e.target.value })}
              style={{
                width: '100%',
                maxWidth: 360,
                padding: '10px 14px',
                borderRadius: 8,
                border: `1px solid ${bdr}`,
                background: inputBg,
                color: fg,
                fontSize: 14,
                boxSizing: 'border-box',
              }}
            />
            <div style={{ fontSize: 12, color: fg2, marginTop: 6 }}>
              Enter individual page numbers or ranges separated by commas (e.g., &ldquo;1, 3, 5-8&rdquo;).
            </div>
          </div>
        );
      }}
      onExecute={async (files, opts, onProgress) => {
        const file = files[0].file;
        const total = files[0].pageCount || 1;
        const inputStr = opts.pagesInput || '1';

        // Parse list
        const pageNums: number[] = [];
        const parts = inputStr.split(',').map((s: string) => s.trim()).filter(Boolean);
        for (const p of parts) {
          if (p.includes('-')) {
            const [s, e] = p.split('-').map((v: string) => parseInt(v.trim(), 10));
            if (!isNaN(s) && !isNaN(e)) {
              for (let i = s; i <= e; i++) pageNums.push(i);
            }
          } else {
            const val = parseInt(p, 10);
            if (!isNaN(val)) pageNums.push(val);
          }
        }

        const valid = Array.from(new Set(pageNums)).filter((n) => n >= 1 && n <= total);
        if (valid.length === 0) {
          throw new Error(`Please specify valid page numbers between 1 and ${total}.`);
        }

        const bytes = await extractPages(file, valid, onProgress);
        return {
          filename: `extracted-${file.name}`,
          bytes,
        };
      }}
    />
  );
};

// 7. PDF Number Pages
export const PdfNumberPagesTool: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  return (
    <PdfToolShell
      theme={theme}
      toolSlug="pdf-number-pages"
      toolTitle="PDF Number Pages"
      subtitle="Insert clean, standardized page numbers into the header or footer of every page in your PDF document."
      acceptExtensions={['.pdf']}
      acceptMimeTypes={['application/pdf']}
      acceptLabel="PDF file (.pdf)"
      multiple={false}
      initialOptions={{ position: 'bottom-center', format: 'page-x-of-y', startNumber: 1 }}
      actionButtonLabel="Apply Page Numbers"
      renderCustomOptions={(_files, opts, setOpts, t) => {
        const dk = t === 'dark';
        const fg = dk ? '#f8fafc' : '#0f172a';
        const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        const inputBg = dk ? '#151f30' : '#f8fafc';

        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                Number Position
              </label>
              <select
                value={opts.position || 'bottom-center'}
                onChange={(e) => setOpts({ ...opts, position: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: `1px solid ${bdr}`,
                  background: inputBg,
                  color: fg,
                  fontSize: 13.5,
                }}
              >
                <option value="bottom-center">Bottom Center (Footer)</option>
                <option value="bottom-right">Bottom Right (Footer)</option>
                <option value="top-right">Top Right (Header)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                Numbering Format
              </label>
              <select
                value={opts.format || 'page-x-of-y'}
                onChange={(e) => setOpts({ ...opts, format: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: `1px solid ${bdr}`,
                  background: inputBg,
                  color: fg,
                  fontSize: 13.5,
                }}
              >
                <option value="page-x-of-y">Page X of Y (e.g. Page 1 of 10)</option>
                <option value="page-x">Page X (e.g. Page 1)</option>
                <option value="number-only">Number Only (e.g. 1)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: fg, marginBottom: 6 }}>
                Starting Number
              </label>
              <input
                type="number"
                min="1"
                value={opts.startNumber || 1}
                onChange={(e) => setOpts({ ...opts, startNumber: parseInt(e.target.value, 10) || 1 })}
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
          </div>
        );
      }}
      onExecute={async (files, opts, onProgress) => {
        const file = files[0].file;
        const bytes = await numberPages(
          file,
          {
            position: opts.position || 'bottom-center',
            format: opts.format || 'page-x-of-y',
            startNumber: opts.startNumber || 1,
          },
          onProgress
        );
        return {
          filename: `numbered-${file.name}`,
          bytes,
        };
      }}
    />
  );
};

// 8. PDF Metadata Remover
export const PdfMetadataRemoverTool: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  return (
    <PdfToolShell
      theme={theme}
      toolSlug="pdf-metadata-remover"
      toolTitle="PDF Metadata Remover"
      subtitle="Sanitize sensitive PDF metadata including author names, editing software, creation timestamps, and hidden revision history."
      acceptExtensions={['.pdf']}
      acceptMimeTypes={['application/pdf']}
      acceptLabel="PDF file (.pdf)"
      multiple={false}
      actionButtonLabel="Remove All Metadata"
      onExecute={async (files, _opts, onProgress) => {
        const file = files[0].file;
        const bytes = await removeMetadata(file, onProgress);
        return {
          filename: `sanitized-${file.name}`,
          bytes,
        };
      }}
    />
  );
};
