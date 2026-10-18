import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  FileText,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Server,
  Plus,
  Loader2,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { type FileItem, formatFileSize, downloadUint8Array, getPdfPageCount } from '../../utils/pdfEngine';

export interface BackendEngineInfo {
  engineName: string;
  requiredEngine: string;
  apiEndpoint: string;
  supportedFormats: string;
}

export interface PdfToolShellProps {
  theme: 'dark' | 'light';
  toolSlug: string;
  toolTitle: string;
  subtitle: string;
  acceptExtensions: string[];
  acceptMimeTypes?: string[];
  acceptLabel: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  isBackendRequired?: boolean;
  backendInfo?: BackendEngineInfo;
  actionButtonLabel?: string;
  renderCustomOptions?: (
    files: FileItem[],
    options: any,
    setOptions: React.Dispatch<React.SetStateAction<any>>,
    theme: 'dark' | 'light'
  ) => React.ReactNode;
  initialOptions?: any;
  onExecute?: (
    files: FileItem[],
    options: any,
    onProgress: (pct: number, msg: string) => void
  ) => Promise<{ filename: string; bytes: Uint8Array } | { filename: string; bytes: Uint8Array }[]>;
}

export const PdfToolShell: React.FC<PdfToolShellProps> = ({
  theme,
  toolSlug,
  toolTitle,
  subtitle,
  acceptExtensions,
  acceptMimeTypes = [],
  acceptLabel,
  multiple = false,
  maxFiles = 20,
  maxSizeMB = 50,
  isBackendRequired = false,
  backendInfo,
  actionButtonLabel = 'Process File',
  renderCustomOptions,
  initialOptions = {},
  onExecute,
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [options, setOptions] = useState<any>(initialOptions);
  const [processing, setProcessing] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<{ filename: string; bytes: Uint8Array }[] | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const cardBg = dk ? 'rgba(255,255,255,0.02)' : '#ffffff';
  const dropzoneBg = dk ? 'rgba(255,255,255,0.03)' : '#f8fafc';

  // Validate and add files
  const handleFiles = useCallback(
    async (incoming: FileList | File[]) => {
      setErrorMessage(null);
      setResults(null);

      const validList: FileItem[] = [];
      const listArray = Array.from(incoming);

      if (!multiple && listArray.length > 1) {
        setErrorMessage('This tool accepts only a single file at a time.');
        return;
      }

      for (const f of listArray) {
        // Security check: validate extension
        const ext = '.' + f.name.split('.').pop()?.toLowerCase();
        const matchesExt = acceptExtensions.some((e) => e.toLowerCase() === ext);

        // Security check: validate MIME type if available
        const matchesMime =
          acceptMimeTypes.length === 0 ||
          acceptMimeTypes.some((m) => f.type.toLowerCase().includes(m.toLowerCase()));

        if (!matchesExt && !matchesMime) {
          setErrorMessage(
            `File "${f.name}" has an unsupported format. Please upload ${acceptLabel}.`
          );
          return;
        }

        // Security check: validate size limit
        const sizeMb = f.size / (1024 * 1024);
        if (sizeMb > maxSizeMB) {
          setErrorMessage(
            `File "${f.name}" exceeds the maximum allowable size of ${maxSizeMB} MB.`
          );
          return;
        }

        let pageCount: number | undefined;
        if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
          pageCount = await getPdfPageCount(f);
        }

        validList.push({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          name: f.name,
          size: f.size,
          pageCount,
        });
      }

      if (multiple) {
        setFiles((prev) => {
          const combined = [...prev, ...validList];
          if (combined.length > maxFiles) {
            setErrorMessage(`You can upload a maximum of ${maxFiles} files.`);
            return combined.slice(0, maxFiles);
          }
          return combined;
        });
      } else {
        setFiles(validList.slice(0, 1));
      }
    },
    [acceptExtensions, acceptLabel, acceptMimeTypes, maxFiles, maxSizeMB, multiple]
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setResults(null);
  };

  const handleMoveFile = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= files.length) return;
    const copy = [...files];
    const item = copy.splice(index, 1)[0];
    copy.splice(targetIdx, 0, item);
    setFiles(copy);
  };

  const handleReset = () => {
    setFiles([]);
    setResults(null);
    setErrorMessage(null);
    setProgressPct(0);
    setProgressMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExecute = async () => {
    if (files.length === 0) {
      setErrorMessage('Please select a file to process.');
      return;
    }

    if (isBackendRequired) {
      // Intentional architectural boundary notification
      return;
    }

    if (!onExecute) {
      setErrorMessage('No processing engine configured for this operation.');
      return;
    }

    setProcessing(true);
    setProgressPct(5);
    setProgressMsg('Starting process...');
    setErrorMessage(null);
    setResults(null);

    try {
      const res = await onExecute(files, options, (pct, msg) => {
        setProgressPct(pct);
        setProgressMsg(msg);
      });

      if (Array.isArray(res)) {
        setResults(res);
      } else {
        setResults([res]);
      }
    } catch (err: any) {
      console.error('PDF Processing Error:', err);
      setErrorMessage(err.message || 'An error occurred while processing the document.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {/* ── Subtitle / Overview ── */}
      <p style={{ fontSize: 14.5, color: fg2, lineHeight: 1.6, margin: '0 0 24px 0' }}>
        {subtitle}
      </p>

      {/* ── Error Banner ── */}
      {errorMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '14px 16px',
            borderRadius: 10,
            background: dk ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Backend Architecture Boundary Notice (For Heavy Tools) ── */}
      {isBackendRequired && (
        <div
          style={{
            padding: 20,
            borderRadius: 12,
            background: dk ? 'rgba(56, 189, 248, 0.08)' : '#f0f9ff',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Server size={20} color="#0284c7" />
            <span style={{ fontSize: 15, fontWeight: 800, color: fg }}>
              Microservice Architecture Notice: {toolTitle}
            </span>
          </div>
          <p style={{ fontSize: 13.5, color: fg2, lineHeight: 1.6, margin: '0 0 12px 0' }}>
            High-fidelity document conversion ({toolTitle}) is classified as a{' '}
            <strong style={{ color: fg }}>Heavy / Backend-Suitable</strong> operation. In accordance with
            production data safety standards, complex multi-format transcoding is handled via dedicated isolated
            worker containers rather than simulated client-side mockups.
          </p>
          <div
            style={{
              fontSize: 12,
              fontFamily: 'monospace',
              background: dk ? 'rgba(0,0,0,0.3)' : '#e0f2fe',
              padding: '10px 14px',
              borderRadius: 8,
              color: dk ? '#93c5fd' : '#0369a1',
            }}
          >
            Engine: {backendInfo?.engineName || 'CorpVEX Document Transcoder Service'} • Spec:{' '}
            {backendInfo?.requiredEngine || 'LibreOffice / Tesseract OCR / Ghostscript'} • API Route:{' '}
            {backendInfo?.apiEndpoint || '/api/v1/pdf/convert'}
          </div>
        </div>
      )}

      {/* ── Dropzone & Upload Zone ── */}
      {results === null && (
        <>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragActive ? acc : bdr}`,
              borderRadius: 14,
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragActive ? (dk ? 'rgba(232, 168, 56, 0.08)' : 'rgba(217, 119, 6, 0.05)') : dropzoneBg,
              transition: 'all 0.2s ease',
              marginBottom: 24,
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptExtensions.join(',')}
              multiple={multiple}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFiles(e.target.files);
                }
              }}
              style={{ display: 'none' }}
            />

            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: dk ? 'rgba(232, 168, 56, 0.12)' : 'rgba(217, 119, 6, 0.08)',
                color: acc,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <Upload size={26} />
            </div>

            <div style={{ fontSize: 16, fontWeight: 700, color: fg, marginBottom: 6 }}>
              Drag &amp; drop your {acceptLabel} here, or <span style={{ color: acc }}>browse files</span>
            </div>
            <div style={{ fontSize: 13, color: fg2 }}>
              Supported: {acceptExtensions.join(', ')} • Max size: {maxSizeMB} MB{' '}
              {multiple ? `• Up to ${maxFiles} files` : ''}
            </div>
          </div>

          {/* ── Selected Files List ── */}
          {files.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: fg }}>
                  Selected Files ({files.length}{multiple ? ` / ${maxFiles}` : ''})
                </div>
                {multiple && files.length < maxFiles && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: 'none',
                      border: 'none',
                      color: acc,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={15} />
                    <span>Add More</span>
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {files.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 10,
                      border: `1px solid ${bdr}`,
                      background: cardBg,
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: dk ? 'rgba(232, 168, 56, 0.12)' : 'rgba(217, 119, 6, 0.08)',
                          color: acc,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <FileText size={18} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: fg,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.name}
                        </div>
                        <div style={{ fontSize: 12, color: fg2 }}>
                          {formatFileSize(item.size)}{' '}
                          {item.pageCount ? `• ${item.pageCount} page${item.pageCount > 1 ? 's' : ''}` : ''}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      {multiple && (
                        <>
                          <button
                            onClick={() => handleMoveFile(idx, 'up')}
                            disabled={idx === 0}
                            title="Move Up"
                            style={{
                              background: 'none',
                              border: `1px solid ${bdr}`,
                              color: idx === 0 ? fg2 : fg,
                              borderRadius: 6,
                              padding: 6,
                              cursor: idx === 0 ? 'not-allowed' : 'pointer',
                              opacity: idx === 0 ? 0.4 : 1,
                              display: 'flex',
                            }}
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleMoveFile(idx, 'down')}
                            disabled={idx === files.length - 1}
                            title="Move Down"
                            style={{
                              background: 'none',
                              border: `1px solid ${bdr}`,
                              color: idx === files.length - 1 ? fg2 : fg,
                              borderRadius: 6,
                              padding: 6,
                              cursor: idx === files.length - 1 ? 'not-allowed' : 'pointer',
                              opacity: idx === files.length - 1 ? 0.4 : 1,
                              display: 'flex',
                            }}
                          >
                            <ArrowDown size={14} />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleRemoveFile(item.id)}
                        title="Remove file"
                        style={{
                          background: 'none',
                          border: `1px solid ${bdr}`,
                          color: '#ef4444',
                          borderRadius: 6,
                          padding: 6,
                          cursor: 'pointer',
                          display: 'flex',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Custom Options Section (e.g. Rotation, Page ranges, etc.) ── */}
          {files.length > 0 && renderCustomOptions && (
            <div
              style={{
                marginBottom: 24,
                padding: 20,
                borderRadius: 12,
                border: `1px solid ${bdr}`,
                background: cardBg,
              }}
            >
              {renderCustomOptions(files, options, setOptions, theme)}
            </div>
          )}

          {/* ── Progress Bar ── */}
          {processing && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  color: fg2,
                  marginBottom: 6,
                }}
              >
                <span>{progressMsg}</span>
                <span style={{ fontWeight: 700, color: fg }}>{progressPct}%</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: 8,
                  borderRadius: 4,
                  background: dk ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${progressPct}%`,
                    height: '100%',
                    background: acc,
                    transition: 'width 0.25s ease',
                  }}
                />
              </div>
            </div>
          )}

          {/* ── Action Buttons ── */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={handleExecute}
              disabled={files.length === 0 || processing}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                background: files.length === 0 || processing ? (dk ? 'rgba(255,255,255,0.1)' : '#cbd5e1') : acc,
                color: '#ffffff',
                border: 'none',
                fontSize: 14.5,
                fontWeight: 700,
                cursor: files.length === 0 || processing ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {processing && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              <span>{processing ? 'Processing Document...' : actionButtonLabel}</span>
            </button>

            {files.length > 0 && (
              <button
                onClick={handleReset}
                disabled={processing}
                style={{
                  padding: '12px 18px',
                  borderRadius: 8,
                  background: 'transparent',
                  color: fg2,
                  border: `1px solid ${bdr}`,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: processing ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </>
      )}

      {/* ── Success & Download State ── */}
      {results && (
        <div
          style={{
            padding: 28,
            borderRadius: 14,
            border: '1px solid rgba(16, 185, 129, 0.3)',
            background: dk ? 'rgba(16, 185, 129, 0.08)' : '#f0fdf4',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#10b981',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <CheckCircle2 size={30} />
          </div>

          <h3 style={{ fontSize: 20, fontWeight: 800, color: fg, margin: '0 0 8px 0' }}>
            Document Ready!
          </h3>
          <p style={{ fontSize: 14, color: fg2, margin: '0 0 24px 0' }}>
            Your document was successfully processed client-side. Click below to download your file.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              maxWidth: 420,
              margin: '0 auto 24px',
            }}
          >
            {results.map((res, i) => (
              <button
                key={i}
                onClick={() => downloadUint8Array(res.bytes, res.filename)}
                style={{
                  padding: '12px 20px',
                  borderRadius: 8,
                  background: acc,
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 14.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)',
                }}
              >
                <Download size={16} />
                <span>
                  Download {res.filename} ({formatFileSize(res.bytes.length)})
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleReset}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              background: 'transparent',
              color: fg2,
              border: `1px solid ${bdr}`,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <RotateCcw size={14} />
            <span>Process Another Document</span>
          </button>
        </div>
      )}
    </div>
  );
};
