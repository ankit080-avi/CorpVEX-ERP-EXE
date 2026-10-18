import React, { useState, useEffect, useRef } from 'react';
import { generateQrMatrix, drawQrToCanvas, qrToSvg } from '../../utils/qrEncoder';
import { Download, RotateCcw, Link, QrCode, Smartphone, FileText, Check } from 'lucide-react';
import { UpiQrCodeGenerator } from './UpiQrCodeGenerator';

export const QrCodeGenerator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [qrType, setQrType] = useState<'url' | 'upi' | 'wa' | 'text'>('url');
  const [urlInput, setUrlInput] = useState('https://corpvex.com');
  const [upiVpa, setUpiVpa] = useState('billing@hdfcbank');
  const [upiName, setUpiName] = useState('Corpvex Enterprises');
  const [upiAmount, setUpiAmount] = useState('2500');
  const [waPhone, setWaPhone] = useState('918858141463');
  const [waMessage, setWaMessage] = useState('Hello, I would like to inquire about CorpVEX ERP.');
  const [plainText, setPlainText] = useState('INV-2026-0891 | Batch 409 | Quality Super Combed');

  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(260);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  // Determine final QR payload string
  let payload = '';
  if (qrType === 'url') {
    payload = urlInput.trim();
  } else if (qrType === 'upi') {
    payload = `upi://pay?pa=${encodeURIComponent(upiVpa.trim())}&pn=${encodeURIComponent(upiName.trim())}${upiAmount ? `&am=${encodeURIComponent(upiAmount.trim())}` : ''}&cu=INR`;
  } else if (qrType === 'wa') {
    const cleanPhone = waPhone.replace(/\D/g, '');
    payload = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
  } else {
    payload = plainText.trim();
  }

  // Draw QR code to canvas whenever inputs change
  useEffect(() => {
    if (!canvasRef.current || !payload) return;
    try {
      const qr = generateQrMatrix(payload);
      drawQrToCanvas(canvasRef.current, qr, {
        size,
        fgColor,
        bgColor,
        quietZone: 4
      });
    } catch (err) {
      console.error('QR generation error:', err);
    }
  }, [payload, size, fgColor, bgColor]);

  const downloadPng = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `qrcode_${qrType}_${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const downloadSvg = () => {
    if (!payload) return;
    const qr = generateQrMatrix(payload);
    const svgStr = qrToSvg(qr, { size, fgColor, bgColor });
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `qrcode_${qrType}_${Date.now()}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setQrType('url');
    setUrlInput('https://corpvex.com');
    setFgColor('#0f172a');
    setBgColor('#ffffff');
    setSize(260);
  };

  return (
    <div>
      {/* Mode Selector Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {[
          { id: 'url', label: 'Website / URL', icon: Link },
          { id: 'upi', label: 'UPI Payment QR', icon: QrCode },
          { id: 'wa', label: 'WhatsApp Direct Chat', icon: Smartphone },
          { id: 'text', label: 'Plain Text / Serial', icon: FileText }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = qrType === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setQrType(t.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 16px',
                borderRadius: 8,
                border: `1px solid ${isActive ? acc : bdr}`,
                background: isActive ? (dk ? `${acc}20` : `${acc}15`) : inputBg,
                color: isActive ? acc : fg,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              <Icon size={15} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {qrType === 'upi' ? (
        <UpiQrCodeGenerator theme={theme} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
          {/* Left Inputs */}
          <div>
            {qrType === 'url' && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
                  Destination Web URL
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 8,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 15,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            {qrType === 'wa' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
                  WhatsApp Phone Number (with Country Code)
                </label>
                <input
                  type="text"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="e.g. 918858141463"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
                  Pre-filled Message
                </label>
                <textarea
                  rows={3}
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>
            </div>
          )}

          {qrType === 'text' && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: fg }}>
                Plain Text / Data Payload
              </label>
              <textarea
                rows={4}
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
                placeholder="Enter any raw text, lot barcode number, product ID, or memo..."
                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>
          )}

          {/* Color & Size Customization */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: fg2, marginBottom: 6 }}>
                QR Dots Color
              </label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                style={{ width: '100%', height: 40, padding: 2, borderRadius: 6, border: `1px solid ${bdr}`, cursor: 'pointer', background: inputBg }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: fg2, marginBottom: 6 }}>
                Background Color
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                style={{ width: '100%', height: 40, padding: 2, borderRadius: 6, border: `1px solid ${bdr}`, cursor: 'pointer', background: inputBg }}
              />
            </div>
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
            <span>Reset Settings</span>
          </button>
        </div>

        {/* Right Preview & Download */}
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
            CLIENT-SIDE LIVE PREVIEW
          </div>

          {/* Canvas Preview Container */}
          <div style={{
            background: '#ffffff',
            padding: 16,
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            marginBottom: 20
          }}>
            <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', height: 'auto' }} />
          </div>

          <div style={{ fontSize: 11.5, color: fg2, textAlign: 'center', maxWidth: 280, marginBottom: 20 }}>
            Rendered 100% in your browser. Zero data transmitted over the internet.
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
      )}
    </div>
  );
};
