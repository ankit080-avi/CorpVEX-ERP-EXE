import React, { useState, useEffect, useRef } from 'react';
import { generateQrMatrix, drawQrToCanvas, qrToSvg } from '../../utils/qrEncoder';
import {
  Download,
  RotateCcw,
  QrCode,
  Copy,
  Check,
  Upload,
  Printer,
  Sparkles,
} from 'lucide-react';
import { copyToClipboard, formatIndianCurrency } from '../../utils/formatters';

export interface UpiQrCodeGeneratorProps {
  theme: 'dark' | 'light';
}

// ── Authentic Official Vector Logos (Official Wikimedia / NPCI Brand Vectors) ──

const GooglePayLogo: React.FC = () => (
  <img
    src="/images/upi-logos/gpay.svg"
    alt="Google Pay"
    style={{ height: 19, width: 'auto', objectFit: 'contain', display: 'block' }}
  />
);

const PhonePeLogo: React.FC = () => (
  <img
    src="/images/upi-logos/phonepe.svg"
    alt="PhonePe"
    style={{ height: 21, width: 'auto', objectFit: 'contain', display: 'block' }}
  />
);

const PaytmLogo: React.FC = () => (
  <img
    src="/images/upi-logos/paytm.svg"
    alt="Paytm"
    style={{ height: 16, width: 'auto', objectFit: 'contain', display: 'block' }}
  />
);

const AmazonPayLogo: React.FC = () => (
  <img
    src="/images/upi-logos/amazonpay.svg"
    alt="Amazon Pay"
    style={{ height: 17, width: 'auto', objectFit: 'contain', display: 'block' }}
  />
);

const BhimUpiHeader: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 36,
      marginBottom: 16,
      width: '100%',
    }}
  >
    <img
      src="/images/upi-logos/bhim.svg"
      alt="BHIM"
      style={{ height: 26, width: 'auto', objectFit: 'contain', display: 'block' }}
    />
    <img
      src="/images/upi-logos/upi.svg"
      alt="UPI"
      style={{ height: 26, width: 'auto', objectFit: 'contain', display: 'block' }}
    />
  </div>
);


export const UpiQrCodeGenerator: React.FC<UpiQrCodeGeneratorProps> = ({ theme }) => {
  // ── Payment Details ──
  const [amount, setAmount] = useState('1000');
  const [remark, setRemark] = useState('');

  // ── Merchant Info ──
  const [upiId, setUpiId] = useState('ankit@googlepay');
  const [payeeName, setPayeeName] = useState('ankit kumar');

  // ── Customization Options ──
  const [centerLogo, setCenterLogo] = useState<string | null>(null);
  const [showUpiId, setShowUpiId] = useState(true);
  const [showAppLogos, setShowAppLogos] = useState(true);
  const [showPayeeName, setShowPayeeName] = useState(true);
  const [showAmountBadge, setShowAmountBadge] = useState(true);
  const [qrFgColor, setQrFgColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [qrSize] = useState(360); // High-res internal resolution for crisp scanning

  // ── Action states ──
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [exporting, setExporting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const acc = '#ea580c'; // Vibrant Zubizi-style orange accent
  const inputBg = dk ? '#151f30' : '#ffffff';
  const cardBg = dk ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc';

  // ── Build UPI Payload ──
  const cleanVpa = upiId.trim();
  const cleanName = payeeName.trim();
  const cleanAmount = amount.trim();
  const cleanRemark = remark.trim();

  let upiPayload = `upi://pay?pa=${encodeURIComponent(cleanVpa)}&pn=${encodeURIComponent(cleanName || 'Merchant')}`;
  if (cleanAmount && !isNaN(parseFloat(cleanAmount)) && parseFloat(cleanAmount) > 0) {
    upiPayload += `&am=${encodeURIComponent(cleanAmount)}`;
  }
  upiPayload += '&cu=INR';
  if (cleanRemark) {
    upiPayload += `&tn=${encodeURIComponent(cleanRemark)}`;
  }

  // ── Draw QR Canvas with Optional Center Logo ──
  useEffect(() => {
    if (!canvasRef.current || !cleanVpa) return;
    try {
      const qr = generateQrMatrix(upiPayload, 12);
      drawQrToCanvas(canvasRef.current, qr, {
        size: qrSize,
        fgColor: qrFgColor,
        bgColor: qrBgColor,
        quietZone: 2,
      });

      // Draw Center Logo if present
      if (centerLogo) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          const img = new Image();
          img.onload = () => {
            const logoSize = Math.floor(qrSize * 0.22);
            const logoX = (qrSize - logoSize) / 2;
            const logoY = (qrSize - logoSize) / 2;
            const radius = 8;

            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0,0,0,0.18)';
            ctx.shadowBlur = 8;

            // Rounded rect for logo background
            ctx.beginPath();
            ctx.roundRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10, radius);
            ctx.fill();

            // Clip image to rounded rect
            ctx.shadowColor = 'transparent';
            ctx.beginPath();
            ctx.roundRect(logoX, logoY, logoSize, logoSize, radius - 2);
            ctx.clip();
            ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
            ctx.restore();
          };
          img.src = centerLogo;
        }
      }
    } catch (err) {
      console.error('UPI QR Generation error:', err);
    }
  }, [upiPayload, qrSize, qrFgColor, qrBgColor, centerLogo, cleanVpa]);

  // ── Handle Custom Logo Upload ──
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCenterLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setCenterLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Copy UPI Payload Link ──
  const handleCopyLink = () => {
    copyToClipboard(upiPayload);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyVpa = () => {
    copyToClipboard(cleanVpa);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // ── Download QR Code Only as PNG ──
  const handleDownloadQrOnly = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `upi_qr_${cleanVpa.replace(/[@.]/g, '_')}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  // ── Download QR Code as SVG ──
  const handleDownloadSvg = () => {
    const qr = generateQrMatrix(upiPayload, 12);
    const svgStr = qrToSvg(qr, { size: qrSize, fgColor: qrFgColor, bgColor: qrBgColor });
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `upi_qr_${cleanVpa.replace(/[@.]/g, '_')}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ── Helper to load image for canvas export ──
  const loadLogoImage = (src: string): Promise<HTMLImageElement | null> =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });

  // ── Export Full Standee Card as High-Resolution PNG ──
  const handleExportFullStandee = async () => {
    setExporting(true);
    try {
      const standeeWidth = 600;
      let standeeHeight = 840;
      if (!showAppLogos) standeeHeight -= 120;
      if (!showUpiId) standeeHeight -= 40;
      if (!showPayeeName) standeeHeight -= 40;

      const offscreen = document.createElement('canvas');
      offscreen.width = standeeWidth;
      offscreen.height = standeeHeight;
      const ctx = offscreen.getContext('2d');
      if (!ctx) return;

      // Card Background (pure white with rounded corners)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(0, 0, standeeWidth, standeeHeight, 28);
      ctx.fill();

      // Card Border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 4;
      ctx.stroke();

      let curY = 56;

      // 1. Payee Name
      if (showPayeeName && cleanName) {
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(cleanName, standeeWidth / 2, curY);
        curY += 34;
      }

      // Optional Amount badge if present
      if (showAmountBadge && cleanAmount && parseFloat(cleanAmount) > 0) {
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Amount: ${formatIndianCurrency(parseFloat(cleanAmount))}`, standeeWidth / 2, curY);
        curY += 28;
      }

      if (cleanRemark) {
        ctx.fillStyle = '#64748b';
        ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Note: ${cleanRemark}`, standeeWidth / 2, curY);
        curY += 24;
      }

      curY += 10;

      // 2. Draw QR Code (Large & prominent)
      const qrDrawSize = 440;
      const qrX = (standeeWidth - qrDrawSize) / 2;
      if (canvasRef.current) {
        ctx.drawImage(canvasRef.current, qrX, curY, qrDrawSize, qrDrawSize);
      }
      curY += qrDrawSize + 24;

      // 3. Draw UPI ID
      if (showUpiId && cleanVpa) {
        ctx.fillStyle = '#475569';
        ctx.font = '600 20px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(cleanVpa, standeeWidth / 2, curY);
        curY += 36;
      }

      // 4. Draw Official BHIM & App Logos
      if (showAppLogos) {
        const [bhimImg, upiImg, gpayImg, phonepeImg, paytmImg, amazonImg] = await Promise.all([
          loadLogoImage('/images/upi-logos/bhim.svg'),
          loadLogoImage('/images/upi-logos/upi.svg'),
          loadLogoImage('/images/upi-logos/gpay.svg'),
          loadLogoImage('/images/upi-logos/phonepe.svg'),
          loadLogoImage('/images/upi-logos/paytm.svg'),
          loadLogoImage('/images/upi-logos/amazonpay.svg'),
        ]);

        if (bhimImg && upiImg) {
          const bhimH = 34;
          const bhimW = Math.round(bhimH * (32.17 / 7.957)); // ~137
          const upiH = 34;
          const upiW = Math.round(upiH * (130.54 / 46.118)); // ~96
          const rowGap = 44;
          const totalRowW = bhimW + rowGap + upiW;
          const startX = (standeeWidth - totalRowW) / 2;

          ctx.drawImage(bhimImg, startX, curY, bhimW, bhimH);
          ctx.drawImage(upiImg, startX + bhimW + rowGap, curY, upiW, upiH);
          curY += bhimH + 28;
        }

        if (gpayImg && phonepeImg && paytmImg && amazonImg) {
          const gpayH = 26;
          const gpayW = Math.round(gpayH * (64 / 24)); // ~69

          const phonepeH = 28;
          const phonepeW = Math.round(phonepeH * (230 / 69.75)); // ~92

          const paytmH = 23;
          const paytmW = Math.round(paytmH * (16.84 / 5.285)); // ~73

          const amazonH = 24;
          const amazonW = Math.round(amazonH * (176.5 / 33.86)); // ~125

          const brandGap = 20;
          const totalBrandW = gpayW + brandGap + phonepeW + brandGap + paytmW + brandGap + amazonW;
          let bx = (standeeWidth - totalBrandW) / 2;
          const targetMidY = curY + 14;

          ctx.drawImage(gpayImg, bx, targetMidY - gpayH / 2, gpayW, gpayH);
          bx += gpayW + brandGap;

          ctx.drawImage(phonepeImg, bx, targetMidY - phonepeH / 2, phonepeW, phonepeH);
          bx += phonepeW + brandGap;

          ctx.drawImage(paytmImg, bx, targetMidY - paytmH / 2, paytmW, paytmH);
          bx += paytmW + brandGap;

          ctx.drawImage(amazonImg, bx, targetMidY - amazonH / 2, amazonW, amazonH);
        }
      }

      // Download
      const link = document.createElement('a');
      link.download = `upi_standee_${(cleanName || cleanVpa).replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      link.href = offscreen.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Standee export error:', err);
    } finally {
      setExporting(false);
    }
  };

  // ── Print Standee ──
  const handlePrint = () => {
    window.print();
  };

  // ── Reset ──
  const handleReset = () => {
    setAmount('1000');
    setRemark('');
    setUpiId('ankit@googlepay');
    setPayeeName('ankit kumar');
    setCenterLogo(null);
    setShowUpiId(true);
    setShowAppLogos(true);
    setShowPayeeName(true);
    setShowAmountBadge(true);
    setQrFgColor('#000000');
    setQrBgColor('#ffffff');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto' }}>
      {/* ── Print Media Styles (Standee Isolated) ── */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #upi-standee-card, #upi-standee-card * {
            visibility: visible !important;
          }
          #upi-standee-card {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 420px !important;
            box-shadow: none !important;
            border: 2px solid #0f172a !important;
            border-radius: 20px !important;
            padding: 36px 28px !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>

      {/* ── Main Two-Column Layout ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 36,
          alignItems: 'start',
        }}
      >
        {/* ─────────────────────────────────────────────────────────────
            LEFT COLUMN: CONTROLS & CUSTOMIZATION (Matching Zubizi)
        ────────────────────────────────────────────────────────────── */}
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Section 1: Payment Details */}
          <div
            style={{
              background: cardBg,
              border: `1px solid ${bdr}`,
              borderRadius: 14,
              padding: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: acc,
                fontSize: 15,
                fontWeight: 800,
                marginBottom: 14,
              }}
            >
              <span>+ Payment Details</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 1000 (leave empty for customer choice)"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 16,
                    fontWeight: 700,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Remark / Note (Optional)
                </label>
                <input
                  type="text"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="e.g., Bill #1234 or Chai & Snacks"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Merchant Info */}
          <div
            style={{
              background: cardBg,
              border: `1px solid ${bdr}`,
              borderRadius: 14,
              padding: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: acc,
                fontSize: 15,
                fontWeight: 800,
                marginBottom: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🏦 Merchant Info</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  UPI ID <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. ankit@googlepay or 9876543210@paytm"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 14,
                    fontWeight: 600,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Payee Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  placeholder="e.g. ankit kumar or CorpVEX Enterprises"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                    color: fg,
                    fontSize: 14,
                    fontWeight: 600,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Customization (Center Logo, Toggles) */}
          <div
            style={{
              background: cardBg,
              border: `1px solid ${bdr}`,
              borderRadius: 14,
              padding: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: acc,
                fontSize: 15,
                fontWeight: 800,
                marginBottom: 14,
              }}
            >
              <span>🎛️ Customization</span>
            </div>

            {/* Center Logo Upload Box */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: fg, marginBottom: 8 }}>
                Center Logo
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
                id="upi-center-logo"
              />

              {!centerLogo ? (
                <label
                  htmlFor="upi-center-logo"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '20px 16px',
                    borderRadius: 12,
                    border: `2px dashed ${bdr}`,
                    background: inputBg,
                    color: fg2,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = acc)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = bdr)}
                >
                  <Upload size={20} color={acc} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: fg }}>Upload Custom Logo</span>
                  <span style={{ fontSize: 11, color: fg2 }}>PNG, JPG or SVG (Transparent logo recommended)</span>
                </label>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: `1px solid ${bdr}`,
                    background: inputBg,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img
                      src={centerLogo}
                      alt="Logo"
                      style={{ width: 34, height: 34, objectFit: 'contain', borderRadius: 6, background: '#ffffff' }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 600, color: fg }}>Custom Logo Active</span>
                  </div>
                  <button
                    onClick={handleRemoveLogo}
                    type="button"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#ef4444',
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Checkbox Toggles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: fg, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showUpiId}
                  onChange={(e) => setShowUpiId(e.target.checked)}
                  style={{ width: 17, height: 17, accentColor: acc }}
                />
                <span>Show UPI ID below QR</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: fg, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showAppLogos}
                  onChange={(e) => setShowAppLogos(e.target.checked)}
                  style={{ width: 17, height: 17, accentColor: acc }}
                />
                <span>Show supported UPI apps logos</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: fg, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showPayeeName}
                  onChange={(e) => setShowPayeeName(e.target.checked)}
                  style={{ width: 17, height: 17, accentColor: acc }}
                />
                <span>Show Payee Name on top</span>
              </label>

              {amount && (
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: fg, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showAmountBadge}
                    onChange={(e) => setShowAmountBadge(e.target.checked)}
                    style={{ width: 17, height: 17, accentColor: acc }}
                  />
                  <span>Show Amount badge on card</span>
                </label>
              )}
            </div>

            {/* Reset */}
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${bdr}` }}>
              <button
                onClick={handleReset}
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: `1px solid ${bdr}`,
                  background: inputBg,
                  color: fg2,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={14} />
                <span>Reset to Default</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT COLUMN: STUNNING LIVE STANDEE CARD & EXPORT BUTTONS
            (EXACT MATCH TO ZUBIZI REFERENCE SCREENSHOT)
        ────────────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {/* Card Wrapper Container (Matching Reference Image 1) */}
          <div
            id="upi-standee-card"
            style={{
              width: '100%',
              maxWidth: 380,
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: 22,
              padding: '30px 24px 26px 24px',
              boxShadow: dk
                ? '0 20px 45px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.08)'
                : '0 16px 40px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              boxSizing: 'border-box',
              marginBottom: 18,
            }}
          >
            {/* Payee Name on top */}
            {showPayeeName && (
              <h2
                style={{
                  margin: '0 0 4px 0',
                  fontSize: 20,
                  fontWeight: 900,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  wordBreak: 'break-word',
                  maxWidth: '100%',
                }}
              >
                {cleanName || 'Merchant Name'}
              </h2>
            )}

            {/* Optional Amount badge */}
            {showAmountBadge && cleanAmount && parseFloat(cleanAmount) > 0 && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 10px',
                  borderRadius: 20,
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#059669',
                  fontSize: 12.5,
                  fontWeight: 800,
                  margin: '4px 0',
                }}
              >
                <span>Pay ₹{cleanAmount}</span>
              </div>
            )}

            {/* Optional Note / Remark */}
            {cleanRemark && (
              <div style={{ fontSize: 11.5, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>
                Note: {cleanRemark}
              </div>
            )}

            {/* Direct Large Canvas QR Code (NO extra nested white box with padding!) */}
            <div
              style={{
                margin: '10px 0 10px 0',
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <canvas
                ref={canvasRef}
                style={{
                  display: 'block',
                  width: 310,
                  height: 310,
                  maxWidth: '100%',
                }}
              />
            </div>

            {/* Monospace UPI ID Text (Matching Reference Image 1) */}
            {showUpiId && cleanVpa && (
              <div
                onClick={handleCopyVpa}
                title="Click to copy UPI ID"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#475569',
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: 18,
                  letterSpacing: '0.02em',
                }}
              >
                <span>{cleanVpa}</span>
                {copiedUpi ? <Check size={12} color="#10b981" /> : <Copy size={12} color="#94a3b8" />}
              </div>
            )}

            {/* Supported UPI Apps & BHIM Section (Exact original logos from Reference Image 1) */}
            {showAppLogos && (
              <div style={{ width: '100%' }}>
                {/* BHIM & UPI Header */}
                <BhimUpiHeader />

                {/* Exact Brand Logos Row (Google Pay, PhonePe, Paytm, Amazon Pay) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                    flexWrap: 'nowrap',
                    width: '100%',
                    padding: '0 4px',
                  }}
                >
                  <GooglePayLogo />
                  <PhonePeLogo />
                  <PaytmLogo />
                  <AmazonPayLogo />
                </div>
              </div>
            )}
          </div>

          {/* ── Action Buttons Below Standee (Zubizi Style) ── */}
          <div className="no-print" style={{ width: '100%', maxWidth: 380 }}>
            {/* Primary Orange Button: Export as PNG */}
            <button
              onClick={handleExportFullStandee}
              disabled={exporting}
              type="button"
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 6px 18px rgba(234, 88, 12, 0.35)',
                marginBottom: 10,
                transition: 'all 0.15s ease',
              }}
            >
              <Download size={18} />
              <span>{exporting ? 'Generating Standee...' : 'Export as PNG'}</span>
            </button>

            {/* Quick Actions Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
              <button
                onClick={handleCopyLink}
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '9px 6px',
                  borderRadius: 8,
                  border: `1px solid ${bdr}`,
                  background: cardBg,
                  color: fg,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {copiedLink ? <Check size={14} color="#10b981" /> : <Copy size={14} color={fg2} />}
                <span>{copiedLink ? 'Copied!' : 'Copy Intent'}</span>
              </button>

              <button
                onClick={handleDownloadQrOnly}
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '9px 6px',
                  borderRadius: 8,
                  border: `1px solid ${bdr}`,
                  background: cardBg,
                  color: fg,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <QrCode size={14} color={fg2} />
                <span>QR Only</span>
              </button>

              <button
                onClick={handleDownloadSvg}
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '9px 6px',
                  borderRadius: 8,
                  border: `1px solid ${bdr}`,
                  background: cardBg,
                  color: fg,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Download size={14} color={fg2} />
                <span>Vector SVG</span>
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              type="button"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 8,
                border: `1px solid ${bdr}`,
                background: dk ? 'rgba(255,255,255,0.05)' : '#ffffff',
                color: fg,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Printer size={15} color={acc} />
              <span>Print Counter Standee (A4 / 4x6)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
