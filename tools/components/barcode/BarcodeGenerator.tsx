import React, { useState, useEffect, useRef } from 'react';
import { generateBarcodeBits, drawBarcodeToCanvas, barcodeToSvg, type BarcodeFormat } from '../../utils/barcodeEncoder';
import { Download, RotateCcw, Barcode, Check } from 'lucide-react';

export const BarcodeGenerator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [format, setFormat] = useState<BarcodeFormat>('CODE128');
  const [barcodeValue, setBarcodeValue] = useState('CORPVEX-8891');
  const [showText, setShowText] = useState(true);
  const [barHeight, setBarHeight] = useState(80);
  const [barWidth, setBarWidth] = useState(2);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const { bits, displayValue } = generateBarcodeBits(barcodeValue, format);

  useEffect(() => {
    if (!canvasRef.current || !bits) return;
    drawBarcodeToCanvas(canvasRef.current, bits, displayValue, {
      barWidth,
      height: barHeight,
      showText,
      fgColor: '#0f172a',
      bgColor: '#ffffff',
      padding: 18
    });
  }, [bits, displayValue, barWidth, barHeight, showText]);

  const downloadPng = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `barcode_${format}_${barcodeValue}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const downloadSvg = () => {
    if (!bits) return;
    const svgStr = barcodeToSvg(bits, displayValue, {
      barWidth,
      height: barHeight,
      showText,
      fgColor: '#0f172a',
      bgColor: '#ffffff',
      padding: 18
    });
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `barcode_${format}_${barcodeValue}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFormat('CODE128');
    setBarcodeValue('CORPVEX-8891');
    setShowText(true);
    setBarHeight(80);
    setBarWidth(2);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
        
        {/* Controls */}
        <div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
              Barcode Symbology / Format
            </label>
            <select
              value={format}
              onChange={(e) => {
                const fmt = e.target.value as BarcodeFormat;
                setFormat(fmt);
                if (fmt === 'EAN13' && !/^\d{12,13}$/.test(barcodeValue)) {
                  setBarcodeValue('890123456789');
                } else if (fmt === 'CODE39' && !/^[A-Z0-9\-. $/+%]+$/i.test(barcodeValue)) {
                  setBarcodeValue('CORPVEX88');
                }
              }}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 8,
                border: `1px solid ${bdr}`,
                background: inputBg,
                color: fg,
                fontSize: 14,
                fontWeight: 700,
                boxSizing: 'border-box'
              }}
            >
              <option value="CODE128">Code 128 (Standard Logistics & Inventory - Alphanumeric)</option>
              <option value="CODE39">Code 39 (Industrial & Warehouse Identification)</option>
              <option value="EAN13">EAN-13 (Standard 13-Digit Retail Barcode)</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
              Barcode Value / Serial Number
            </label>
            <input
              type="text"
              value={barcodeValue}
              onChange={(e) => setBarcodeValue(e.target.value)}
              placeholder={format === 'EAN13' ? '12 or 13 numeric digits' : 'e.g. LOT-2026-X8'}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 8,
                border: `1px solid ${bdr}`,
                background: inputBg,
                color: fg,
                fontSize: 16,
                fontWeight: 700,
                fontFamily: 'monospace',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ fontSize: 11.5, color: fg2, marginTop: 6 }}>
              {format === 'EAN13'
                ? 'EAN-13 requires 12 digits (13th checksum digit is computed automatically).'
                : format === 'CODE39'
                  ? 'Supports uppercase A-Z, numbers 0-9, and symbols (- . $ / + % space).'
                  : 'Code 128 supports all standard ASCII letters, numbers, and symbols.'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: fg2, marginBottom: 6 }}>
                Bar Height: {barHeight}px
              </label>
              <input
                type="range"
                min={40}
                max={150}
                value={barHeight}
                onChange={(e) => setBarHeight(Number(e.target.value))}
                style={{ width: '100%', accentColor: acc }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: fg2, marginBottom: 6 }}>
                Bar Width: {barWidth}px
              </label>
              <input
                type="range"
                min={1}
                max={4}
                value={barWidth}
                onChange={(e) => setBarWidth(Number(e.target.value))}
                style={{ width: '100%', accentColor: acc }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5, fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={showText}
                onChange={(e) => setShowText(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: acc }}
              />
              <span>Display Human-Readable Text Underneath Barcode</span>
            </label>
          </div>

          <button
            onClick={handleReset}
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 6,
              border: `1px solid ${bdr}`,
              background: dk ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
              color: fg,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>

        {/* Preview & Download */}
        <div style={{
          background: dk ? 'rgba(255,255,255,0.02)' : '#f8fafc',
          border: `1px solid ${bdr}`,
          borderRadius: 12,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: fg2, textTransform: 'uppercase', marginBottom: 16 }}>
            CLIENT-SIDE BARCODE PREVIEW
          </div>

          <div style={{
            background: '#ffffff',
            padding: 16,
            borderRadius: 10,
            boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
            maxWidth: '100%',
            overflowX: 'auto',
            marginBottom: 20
          }}>
            <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto' }} />
          </div>

          <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 320 }}>
            <button
              onClick={downloadPng}
              type="button"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '11px',
                borderRadius: 8,
                border: 'none',
                background: acc,
                color: '#ffffff',
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Download size={15} />
              <span>Download PNG</span>
            </button>

            <button
              onClick={downloadSvg}
              type="button"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '11px',
                borderRadius: 8,
                border: `1px solid ${bdr}`,
                background: dk ? 'rgba(255,255,255,0.06)' : '#ffffff',
                color: fg,
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Download size={15} />
              <span>Download SVG</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
