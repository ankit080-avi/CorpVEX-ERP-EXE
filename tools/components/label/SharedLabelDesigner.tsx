import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  CANONICAL_LABEL_PRESETS,
  SCREEN_DPI,
  PRINT_DPI,
  convertToPixels,
  convertToInches,
  convertToPoints,
  validateLabelDimensions,
  PRODUCT_FIELD_TEMPLATES,
  exportLabelAsPng,
  generateSingleLabelPdf,
  generateSheetLabelPdf,
  downloadPdfBytes,
  THERMAL_PRINTER_GUIDANCE,
  type LabelUnit,
  type LabelSizePreset,
  type LabelElement,
  type TextElement,
  type BarcodeElement,
  type ImageElement,
  type DividerElement,
  type LabelDesignState
} from '../../utils/labelEngine';
import {
  generateBarcodeBits,
  type BarcodeFormat
} from '../../utils/barcodeEncoder';
import {
  Printer,
  Download,
  Plus,
  Trash2,
  Copy,
  RotateCcw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Minimize2,
  Upload,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  FileText,
  Tag,
  Barcode as BarcodeIcon,
  Image as ImageIcon,
  ShieldCheck,
  Eye,
  Sliders,
  Sparkles,
  Move
} from 'lucide-react';

export interface SharedLabelDesignerProps {
  theme: 'dark' | 'light';
  mode: 'product-label' | 'barcode-label';
  initialPresetId?: string;
}

export const SharedLabelDesigner: React.FC<SharedLabelDesignerProps> = ({
  theme,
  mode,
  initialPresetId = '2.25x1.25'
}) => {
  // ── Preset & Dimensions State ──
  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialPresetId);
  const [unit, setUnit] = useState<LabelUnit>('inch');
  const [customWidth, setCustomWidth] = useState<number>(2.25);
  const [customHeight, setCustomHeight] = useState<number>(1.25);
  const [dimensionError, setDimensionError] = useState<string | null>(null);

  // ── Preview Zoom Scale ──
  const [zoomScale, setZoomScale] = useState<number>(1.75); // 175% for comfortable desktop editing

  // ── Label Elements State ──
  const [elements, setElements] = useState<LabelElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');

  // ── Drag & Interaction State ──
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  // ── Modals / Dialogs ──
  const [showExportModal, setShowExportModal] = useState(false);
  const [showThermalModal, setShowThermalModal] = useState(false);
  const [sheetCopies, setSheetCopies] = useState<number>(24);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Theme Styling
  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const inputBg = dk ? '#151f30' : '#ffffff';
  const cardBg = dk ? '#0b1322' : '#ffffff';
  const headerBg = dk ? '#151f30' : '#f8fafc';
  const acc = '#2563eb'; // Royal blue brand accent

  // ── Current Width & Height Calculations ──
  const currentPreset = CANONICAL_LABEL_PRESETS.find((p) => p.id === selectedPresetId);
  const effectiveWidthInch = selectedPresetId === 'custom'
    ? convertToInches(customWidth, unit)
    : (currentPreset?.widthInch || 2.25);
  const effectiveHeightInch = selectedPresetId === 'custom'
    ? convertToInches(customHeight, unit)
    : (currentPreset?.heightInch || 1.25);

  const canvasWidthPx = Math.round(effectiveWidthInch * SCREEN_DPI);
  const canvasHeightPx = Math.round(effectiveHeightInch * SCREEN_DPI);

  const currentLabelState: LabelDesignState = {
    presetId: selectedPresetId,
    unit: 'inch',
    width: effectiveWidthInch,
    height: effectiveHeightInch,
    backgroundColor,
    elements,
    selectedElementId: selectedId
  };

  // ── Helper Notification ──
  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // ─────────────────────────────────────────────────────────────
  // Default Template Initialization
  // ─────────────────────────────────────────────────────────────
  const initializeDefaultTemplate = useCallback((presetW: number, presetH: number) => {
    const wPx = Math.round(presetW * SCREEN_DPI);
    const hPx = Math.round(presetH * SCREEN_DPI);

    if (mode === 'barcode-label') {
      // Barcode-First Layout: Top Title, Middle Large Barcode, Bottom SKU & Price
      const defaultBarcode: BarcodeElement = {
        id: 'el_barcode_main',
        type: 'barcode',
        x: Math.round(wPx * 0.05),
        y: Math.round(hPx * 0.28),
        width: Math.round(wPx * 0.9),
        height: Math.round(hPx * 0.42),
        format: 'CODE128',
        value: 'CORPVEX-9901',
        barWidth: 2,
        showText: true,
        fgColor: '#000000',
        bgColor: '#ffffff'
      };

      const defaultTitle: TextElement = {
        id: 'el_title_main',
        type: 'text',
        x: Math.round(wPx * 0.05),
        y: Math.round(hPx * 0.08),
        width: Math.round(wPx * 0.9),
        height: 18,
        content: 'INDUSTRIAL BOLT 10MM',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        fieldTag: 'productName'
      };

      const defaultPrice: TextElement = {
        id: 'el_price_main',
        type: 'text',
        x: Math.round(wPx * 0.05),
        y: Math.round(hPx * 0.78),
        width: Math.round(wPx * 0.9),
        height: 18,
        content: 'MRP: ₹ 249.00  |  SKU: BLT-10',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        fieldTag: 'mrp'
      };

      setElements([defaultTitle, defaultBarcode, defaultPrice]);
      setSelectedId('el_barcode_main');
    } else {
      // Product Label Layout: Product Title, Brand/Sub, Divider, Price/MRP, Barcode, Size
      const prodName: TextElement = {
        id: 'el_prod_name',
        type: 'text',
        x: 8,
        y: 8,
        width: wPx - 16,
        height: 20,
        content: 'Premium Cotton Polo T-Shirt',
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#0f172a',
        fieldTag: 'productName'
      };

      const divider: DividerElement = {
        id: 'el_divider_top',
        type: 'divider',
        x: 12,
        y: 32,
        width: wPx - 24,
        height: 2,
        orientation: 'horizontal',
        strokeWidth: 1,
        strokeColor: '#cbd5e1'
      };

      const priceTag: TextElement = {
        id: 'el_price_tag',
        type: 'text',
        x: 8,
        y: 38,
        width: Math.round(wPx * 0.55),
        height: 22,
        content: '₹ 899.00',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#0f172a',
        fieldTag: 'price'
      };

      const mrpTag: TextElement = {
        id: 'el_mrp_tag',
        type: 'text',
        x: 8,
        y: 58,
        width: Math.round(wPx * 0.55),
        height: 14,
        content: 'MRP: ₹ 1,499.00',
        fontSize: 9,
        fontWeight: 'normal',
        textAlign: 'left',
        color: '#64748b',
        fieldTag: 'mrp'
      };

      const sizeTag: TextElement = {
        id: 'el_size_tag',
        type: 'text',
        x: Math.round(wPx * 0.6),
        y: 38,
        width: Math.round(wPx * 0.35),
        height: 24,
        content: 'Size: L (42)',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right',
        color: '#0f172a',
        fieldTag: 'size'
      };

      const barcode: BarcodeElement = {
        id: 'el_barcode',
        type: 'barcode',
        x: 10,
        y: Math.max(76, Math.round(hPx * 0.65)),
        width: wPx - 20,
        height: Math.max(30, hPx - Math.max(76, Math.round(hPx * 0.65)) - 8),
        format: 'CODE128',
        value: 'SHIRT-BLU-L',
        barWidth: 1.5,
        showText: true,
        fgColor: '#0f172a',
        bgColor: '#ffffff'
      };

      setElements([prodName, divider, priceTag, mrpTag, sizeTag, barcode]);
      setSelectedId('el_prod_name');
    }
  }, [mode]);

  useEffect(() => {
    initializeDefaultTemplate(effectiveWidthInch, effectiveHeightInch);
  }, [selectedPresetId, initializeDefaultTemplate]);

  // ── Selected Element Reference ──
  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  const updateSelectedElement = (partial: Partial<LabelElement>) => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) => (el.id === selectedId ? ({ ...el, ...partial } as LabelElement) : el))
    );
  };

  // ─────────────────────────────────────────────────────────────
  // Element Creation Helpers
  // ─────────────────────────────────────────────────────────────
  const addTextElement = (template?: (typeof PRODUCT_FIELD_TEMPLATES)[0]) => {
    const newId = `text_${Date.now()}`;
    const newEl: TextElement = {
      id: newId,
      type: 'text',
      x: 10,
      y: Math.min(canvasHeightPx - 30, elements.length * 15 + 10),
      width: Math.round(canvasWidthPx * 0.8),
      height: 20,
      content: template?.defaultContent || 'New Text Line',
      fontSize: template?.defaultFontSize || 11,
      fontWeight: template?.defaultBold ? 'bold' : 'normal',
      textAlign: template?.defaultAlign || 'center',
      color: '#0f172a',
      fieldTag: template?.tag || 'custom'
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newId);
  };

  const addBarcodeElement = () => {
    const newId = `barcode_${Date.now()}`;
    const newEl: BarcodeElement = {
      id: newId,
      type: 'barcode',
      x: Math.round(canvasWidthPx * 0.05),
      y: Math.round(canvasHeightPx * 0.4),
      width: Math.round(canvasWidthPx * 0.9),
      height: Math.round(canvasHeightPx * 0.35),
      format: 'CODE128',
      value: 'PROD-8821',
      barWidth: 2,
      showText: true,
      fgColor: '#0f172a',
      bgColor: '#ffffff'
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newId);
  };

  const addDividerElement = () => {
    const newId = `divider_${Date.now()}`;
    const newEl: DividerElement = {
      id: newId,
      type: 'divider',
      x: 10,
      y: Math.round(canvasHeightPx * 0.5),
      width: canvasWidthPx - 20,
      height: 2,
      orientation: 'horizontal',
      strokeWidth: 1,
      strokeColor: '#cbd5e1'
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newId);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const src = loadEvt.target?.result as string;
      if (!src) return;

      const newId = `img_${Date.now()}`;
      const imgSize = Math.min(60, Math.round(canvasHeightPx * 0.4));
      const newEl: ImageElement = {
        id: newId,
        type: 'image',
        src,
        x: 10,
        y: 10,
        width: imgSize,
        height: imgSize,
        keepAspectRatio: true
      };
      setElements((prev) => [...prev, newEl]);
      setSelectedId(newId);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeSelectedElement = () => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const duplicateSelectedElement = () => {
    if (!selectedElement) return;
    const dupId = `${selectedElement.type}_${Date.now()}`;
    const dup: LabelElement = {
      ...selectedElement,
      id: dupId,
      x: Math.min(canvasWidthPx - selectedElement.width, selectedElement.x + 8),
      y: Math.min(canvasHeightPx - selectedElement.height, selectedElement.y + 8)
    };
    setElements((prev) => [...prev, dup]);
    setSelectedId(dupId);
  };

  // ─────────────────────────────────────────────────────────────
  // Alignment Operations
  // ─────────────────────────────────────────────────────────────
  const alignSelected = (alignType: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (!selectedElement) return;
    let newX = selectedElement.x;
    let newY = selectedElement.y;

    if (alignType === 'left') newX = 4;
    else if (alignType === 'center') newX = Math.round((canvasWidthPx - selectedElement.width) / 2);
    else if (alignType === 'right') newX = canvasWidthPx - selectedElement.width - 4;
    else if (alignType === 'top') newY = 4;
    else if (alignType === 'middle') newY = Math.round((canvasHeightPx - selectedElement.height) / 2);
    else if (alignType === 'bottom') newY = canvasHeightPx - selectedElement.height - 4;

    updateSelectedElement({ x: Math.max(0, newX), y: Math.max(0, newY) });
  };

  // ─────────────────────────────────────────────────────────────
  // Mouse & Touch Dragging
  // ─────────────────────────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent, elementId: string) => {
    e.stopPropagation();
    setSelectedId(elementId);
    setIsDragging(true);

    const targetEl = elements.find((el) => el.id === elementId);
    if (!targetEl || !canvasContainerRef.current) return;

    const rect = canvasContainerRef.current.getBoundingClientRect();
    const clickCanvasX = (e.clientX - rect.left) / zoomScale;
    const clickCanvasY = (e.clientY - rect.top) / zoomScale;

    setDragOffset({
      x: clickCanvasX - targetEl.x,
      y: clickCanvasY - targetEl.y
    });

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !selectedId || !canvasContainerRef.current) return;

    const rect = canvasContainerRef.current.getBoundingClientRect();
    const currCanvasX = (e.clientX - rect.left) / zoomScale;
    const currCanvasY = (e.clientY - rect.top) / zoomScale;

    const targetEl = elements.find((el) => el.id === selectedId);
    if (!targetEl) return;

    let nextX = Math.round(currCanvasX - dragOffset.x);
    let nextY = Math.round(currCanvasY - dragOffset.y);

    // Clamp within canvas boundaries
    nextX = Math.max(0, Math.min(canvasWidthPx - targetEl.width, nextX));
    nextY = Math.max(0, Math.min(canvasHeightPx - targetEl.height, nextY));

    updateSelectedElement({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Keyboard Arrow Nudging
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (!selectedId) return;

      const nudge = e.shiftKey ? 5 : 1;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        updateSelectedElement({ x: Math.max(0, (selectedElement?.x || 0) - nudge) });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        updateSelectedElement({
          x: Math.min(canvasWidthPx - (selectedElement?.width || 0), (selectedElement?.x || 0) + nudge)
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        updateSelectedElement({ y: Math.max(0, (selectedElement?.y || 0) - nudge) });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        updateSelectedElement({
          y: Math.min(canvasHeightPx - (selectedElement?.height || 0), (selectedElement?.y || 0) + nudge)
        });
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        removeSelectedElement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectedElement, canvasWidthPx, canvasHeightPx]);

  // ─────────────────────────────────────────────────────────────
  // Exports
  // ─────────────────────────────────────────────────────────────
  const handleExportPng = async () => {
    try {
      await exportLabelAsPng(
        currentLabelState,
        `label_${effectiveWidthInch}x${effectiveHeightInch}.png`,
        PRINT_DPI
      );
      showFeedback('High-resolution 300 DPI PNG downloaded!');
    } catch (err) {
      console.error(err);
      alert('Failed to export PNG.');
    }
  };

  const handleExportSinglePdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const pdfBytes = await generateSingleLabelPdf(currentLabelState, PRINT_DPI);
      downloadPdfBytes(pdfBytes, `label_${effectiveWidthInch}x${effectiveHeightInch}.pdf`);
      showFeedback('Exact-dimension PDF downloaded!');
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF.');
    } finally {
      setIsGeneratingPdf(false);
      setShowExportModal(false);
    }
  };

  const handleExportSheetPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const pdfBytes = await generateSheetLabelPdf(currentLabelState, sheetCopies, PRINT_DPI);
      downloadPdfBytes(pdfBytes, `labels_a4_sheet_${sheetCopies}copies.pdf`);
      showFeedback(`A4 Sheet PDF with ${sheetCopies} copies downloaded!`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate A4 sheet PDF.');
    } finally {
      setIsGeneratingPdf(false);
      setShowExportModal(false);
    }
  };

  const handleDirectBrowserPrint = () => {
    window.print();
  };

  return (
    <div style={{ color: fg, fontFamily: "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* ── Top Feedback Banner ── */}
      {feedbackMessage && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999,
            background: '#10b981',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 14,
            fontWeight: 600
          }}
        >
          <CheckCircle2 size={18} />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* ── Toolbar Header ── */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${bdr}`,
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        {/* Preset Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, textTransform: 'uppercase', marginBottom: 4 }}>
              Label Preset
            </label>
            <select
              value={selectedPresetId}
              onChange={(e) => {
                const newId = e.target.value;
                setSelectedPresetId(newId);
                const p = CANONICAL_LABEL_PRESETS.find((x) => x.id === newId);
                if (p && newId !== 'custom') {
                  setCustomWidth(p.widthInch);
                  setCustomHeight(p.heightInch);
                  setUnit('inch');
                  setDimensionError(null);
                }
              }}
              style={{
                background: inputBg,
                color: fg,
                border: `1px solid ${bdr}`,
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {CANONICAL_LABEL_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Dimension Inputs */}
          {selectedPresetId === 'custom' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, textTransform: 'uppercase', marginBottom: 4 }}>
                  Width
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={customWidth}
                  onChange={(e) => {
                    const w = parseFloat(e.target.value) || 0;
                    setCustomWidth(w);
                    const v = validateLabelDimensions(w, customHeight, unit);
                    setDimensionError(v.valid ? null : (v.error || 'Invalid size'));
                  }}
                  style={{
                    width: 70,
                    background: inputBg,
                    color: fg,
                    border: `1px solid ${bdr}`,
                    borderRadius: 8,
                    padding: '8px 10px',
                    fontSize: 13,
                    fontWeight: 600
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, textTransform: 'uppercase', marginBottom: 4 }}>
                  Height
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={customHeight}
                  onChange={(e) => {
                    const h = parseFloat(e.target.value) || 0;
                    setCustomHeight(h);
                    const v = validateLabelDimensions(customWidth, h, unit);
                    setDimensionError(v.valid ? null : (v.error || 'Invalid size'));
                  }}
                  style={{
                    width: 70,
                    background: inputBg,
                    color: fg,
                    border: `1px solid ${bdr}`,
                    borderRadius: 8,
                    padding: '8px 10px',
                    fontSize: 13,
                    fontWeight: 600
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, textTransform: 'uppercase', marginBottom: 4 }}>
                  Unit
                </label>
                <button
                  type="button"
                  onClick={() => setUnit(unit === 'inch' ? 'mm' : 'inch')}
                  style={{
                    background: inputBg,
                    color: acc,
                    border: `1px solid ${bdr}`,
                    borderRadius: 8,
                    padding: '8px 14px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {unit}
                </button>
              </div>
            </div>
          )}

          {/* Zoom Slider */}
          <div style={{ marginLeft: 8 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, textTransform: 'uppercase', marginBottom: 4 }}>
              Preview Zoom: {Math.round(zoomScale * 100)}%
            </label>
            <input
              type="range"
              min="1"
              max="2.5"
              step="0.25"
              value={zoomScale}
              onChange={(e) => setZoomScale(parseFloat(e.target.value))}
              style={{ width: 110, accentColor: acc, cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => initializeDefaultTemplate(effectiveWidthInch, effectiveHeightInch)}
            title="Reset to default template"
            style={{
              background: 'transparent',
              color: fg2,
              border: `1px solid ${bdr}`,
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>

          {mode === 'barcode-label' && (
            <button
              type="button"
              onClick={() => setShowThermalModal(true)}
              style={{
                background: dk ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
                borderRadius: 8,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer'
              }}
            >
              <Printer size={15} />
              <span>Thermal Guide</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportPng}
            style={{
              background: inputBg,
              color: fg,
              border: `1px solid ${bdr}`,
              borderRadius: 8,
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            <Download size={15} />
            <span>PNG (300 DPI)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            style={{
              background: acc,
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
            }}
          >
            <FileText size={15} />
            <span>Export PDF & Print</span>
          </button>
        </div>
      </div>

      {dimensionError && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            borderRadius: 8,
            padding: '10px 16px',
            marginBottom: 16,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <AlertCircle size={16} />
          <span>{dimensionError}</span>
        </div>
      )}

      {/* ── Main Workspace Grid (Sidebar | Canvas | Properties) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr 290px',
          gap: 20,
          alignItems: 'start'
        }}
        className="label-designer-grid"
      >
        {/* ── Column 1: Quick Add Tool Shelf ── */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${bdr}`,
            borderRadius: 12,
            padding: 16
          }}
        >
          <h3
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: fg2,
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Plus size={14} /> Add Elements
          </h3>

          {/* Quick Product Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: fg2 }}>Product Templates</span>
            {PRODUCT_FIELD_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.tag}
                type="button"
                onClick={() => addTextElement(tmpl)}
                style={{
                  background: inputBg,
                  color: fg,
                  border: `1px solid ${bdr}`,
                  borderRadius: 6,
                  padding: '7px 10px',
                  fontSize: 12,
                  fontWeight: 500,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
              >
                <span>{tmpl.label}</span>
                <span style={{ color: acc, fontSize: 13, fontWeight: 700 }}>+</span>
              </button>
            ))}
          </div>

          {/* Graphic Elements */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: fg2 }}>Standard Elements</span>
            <button
              type="button"
              onClick={addBarcodeElement}
              style={{
                background: dk ? 'rgba(37, 99, 235, 0.1)' : '#eff6ff',
                color: acc,
                border: `1px solid ${dk ? 'rgba(37, 99, 235, 0.3)' : '#bfdbfe'}`,
                borderRadius: 6,
                padding: '8px 10px',
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer'
              }}
            >
              <BarcodeIcon size={16} />
              <span>Add Barcode</span>
            </button>

            <button
              type="button"
              onClick={addDividerElement}
              style={{
                background: inputBg,
                color: fg,
                border: `1px solid ${bdr}`,
                borderRadius: 6,
                padding: '8px 10px',
                fontSize: 12,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer'
              }}
            >
              <Sliders size={16} />
              <span>Add Divider Line</span>
            </button>

            {/* Logo / Image Upload */}
            <label
              style={{
                background: inputBg,
                color: fg,
                border: `1px dashed ${bdr}`,
                borderRadius: 6,
                padding: '8px 10px',
                fontSize: 12,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer'
              }}
            >
              <ImageIcon size={16} />
              <span>Add Logo / Image</span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Background Color Picker */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, marginBottom: 6 }}>
              Sticker Background
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: `1px solid ${bdr}`,
                  cursor: 'pointer',
                  padding: 0
                }}
              />
              <span style={{ fontSize: 12, color: fg2 }}>{backgroundColor}</span>
            </div>
          </div>
        </div>

        {/* ── Column 2: Visual Canvas Area ── */}
        <div
          style={{
            background: dk ? '#060a12' : '#e2e8f0',
            border: `1px solid ${bdr}`,
            borderRadius: 12,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 460,
            overflow: 'auto',
            position: 'relative'
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Canvas Wrapper with Zoom Scale */}
          <div
            ref={canvasContainerRef}
            style={{
              width: canvasWidthPx * zoomScale,
              height: canvasHeightPx * zoomScale,
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
              borderRadius: 4,
              overflow: 'hidden',
              cursor: isDragging ? 'grabbing' : 'default',
              userSelect: 'none'
            }}
            onClick={() => setSelectedId(null)}
          >
            {/* Inner Scaled Canvas Surface */}
            <div
              style={{
                width: canvasWidthPx,
                height: canvasHeightPx,
                background: backgroundColor,
                transform: `scale(${zoomScale})`,
                transformOrigin: 'top left',
                position: 'relative'
              }}
            >
              {elements.map((el) => {
                const isSelected = el.id === selectedId;

                return (
                  <div
                    key={el.id}
                    onPointerDown={(e) => handlePointerDown(e, el.id)}
                    style={{
                      position: 'absolute',
                      left: el.x,
                      top: el.y,
                      width: el.width,
                      height: el.height,
                      outline: isSelected ? '2px solid #2563eb' : '1px dashed transparent',
                      outlineOffset: 2,
                      cursor: 'move',
                      zIndex: isSelected ? 10 : 1,
                      transition: isDragging ? 'none' : 'outline 0.1s'
                    }}
                  >
                    {/* Element Renderers */}
                    {el.type === 'text' && (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          fontSize: (el as TextElement).fontSize,
                          fontWeight: (el as TextElement).fontWeight,
                          textAlign: (el as TextElement).textAlign,
                          color: (el as TextElement).color,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          lineHeight: 1.2
                        }}
                      >
                        {(el as TextElement).content}
                      </div>
                    )}

                    {el.type === 'barcode' && (
                      <BarcodeElementRenderer element={el as BarcodeElement} />
                    )}

                    {el.type === 'image' && (
                      <img
                        src={(el as ImageElement).src}
                        alt="Sticker Element"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: (el as ImageElement).keepAspectRatio ? 'contain' : 'fill',
                          pointerEvents: 'none'
                        }}
                      />
                    )}

                    {el.type === 'divider' && (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: (el as DividerElement).strokeColor,
                          pointerEvents: 'none'
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Size Dimension Tag */}
          <div
            style={{
              marginTop: 16,
              fontSize: 11,
              fontWeight: 600,
              color: fg2,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span>
              {effectiveWidthInch}" × {effectiveHeightInch}" ({Math.round(effectiveWidthInch * 25.4)}mm × {Math.round(effectiveHeightInch * 25.4)}mm)
            </span>
            <span>•</span>
            <span>Click element to select & drag • Arrow keys nudge</span>
          </div>
        </div>

        {/* ── Column 3: Property Inspector & Alignment ── */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${bdr}`,
            borderRadius: 12,
            padding: 16
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
              borderBottom: `1px solid ${bdr}`,
              paddingBottom: 8
            }}
          >
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: fg2 }}>
              Properties
            </h3>

            {selectedElement && (
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={duplicateSelectedElement}
                  title="Duplicate element"
                  style={{
                    background: inputBg,
                    color: fg,
                    border: `1px solid ${bdr}`,
                    borderRadius: 6,
                    padding: '5px 8px',
                    cursor: 'pointer'
                  }}
                >
                  <Copy size={13} />
                </button>
                <button
                  type="button"
                  onClick={removeSelectedElement}
                  title="Delete element"
                  style={{
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    borderRadius: 6,
                    padding: '5px 8px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>

          {selectedElement ? (
            <div>
              {/* Alignment Bar */}
              <div style={{ marginBottom: 14 }}>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, marginBottom: 6 }}>
                  Align on Sticker
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    type="button"
                    onClick={() => alignSelected('left')}
                    title="Align Left"
                    style={{ flex: 1, padding: 6, borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, cursor: 'pointer' }}
                  >
                    <AlignLeft size={14} style={{ margin: '0 auto' }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => alignSelected('center')}
                    title="Align Center"
                    style={{ flex: 1, padding: 6, borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, cursor: 'pointer' }}
                  >
                    <AlignCenter size={14} style={{ margin: '0 auto' }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => alignSelected('right')}
                    title="Align Right"
                    style={{ flex: 1, padding: 6, borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, cursor: 'pointer' }}
                  >
                    <AlignRight size={14} style={{ margin: '0 auto' }} />
                  </button>
                </div>
              </div>

              {/* Text Element Properties */}
              {selectedElement.type === 'text' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                      Content
                    </label>
                    <textarea
                      rows={2}
                      value={(selectedElement as TextElement).content}
                      onChange={(e) => updateSelectedElement({ content: e.target.value })}
                      style={{
                        width: '100%',
                        background: inputBg,
                        color: fg,
                        border: `1px solid ${bdr}`,
                        borderRadius: 6,
                        padding: 8,
                        fontSize: 13,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                        Font Size (px)
                      </label>
                      <input
                        type="number"
                        min="8"
                        max="48"
                        value={(selectedElement as TextElement).fontSize}
                        onChange={(e) => updateSelectedElement({ fontSize: parseInt(e.target.value, 10) || 12 })}
                        style={{
                          width: '100%',
                          background: inputBg,
                          color: fg,
                          border: `1px solid ${bdr}`,
                          borderRadius: 6,
                          padding: '6px 8px',
                          fontSize: 13,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                        Weight
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          updateSelectedElement({
                            fontWeight: (selectedElement as TextElement).fontWeight === 'bold' ? 'normal' : 'bold'
                          })
                        }
                        style={{
                          width: '100%',
                          padding: '7px 8px',
                          borderRadius: 6,
                          border: `1px solid ${bdr}`,
                          background: (selectedElement as TextElement).fontWeight === 'bold' ? acc : inputBg,
                          color: (selectedElement as TextElement).fontWeight === 'bold' ? '#ffffff' : fg,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {(selectedElement as TextElement).fontWeight === 'bold' ? 'Bold' : 'Regular'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                      Text Alignment
                    </label>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {(['left', 'center', 'right'] as const).map((al) => (
                        <button
                          key={al}
                          type="button"
                          onClick={() => updateSelectedElement({ textAlign: al })}
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            borderRadius: 6,
                            border: `1px solid ${bdr}`,
                            background: (selectedElement as TextElement).textAlign === al ? acc : inputBg,
                            color: (selectedElement as TextElement).textAlign === al ? '#ffffff' : fg,
                            fontSize: 11,
                            textTransform: 'capitalize',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {al}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={(selectedElement as TextElement).color}
                      onChange={(e) => updateSelectedElement({ color: e.target.value })}
                      style={{
                        width: '100%',
                        height: 32,
                        borderRadius: 6,
                        border: `1px solid ${bdr}`,
                        cursor: 'pointer',
                        padding: 0
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Barcode Element Properties */}
              {selectedElement.type === 'barcode' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                      Barcode Symbology
                    </label>
                    <select
                      value={(selectedElement as BarcodeElement).format}
                      onChange={(e) => {
                        const fmt = e.target.value as BarcodeFormat;
                        let val = (selectedElement as BarcodeElement).value;
                        if (fmt === 'EAN13' && !/^\d{12,13}$/.test(val)) {
                          val = '890123456789';
                        }
                        updateSelectedElement({ format: fmt, value: val });
                      }}
                      style={{
                        width: '100%',
                        background: inputBg,
                        color: fg,
                        border: `1px solid ${bdr}`,
                        borderRadius: 6,
                        padding: '8px 10px',
                        fontSize: 13,
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="CODE128">Code 128 (Alphanumeric)</option>
                      <option value="CODE39">Code 39 (Standard)</option>
                      <option value="EAN13">EAN-13 (Retail Standard)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                      Barcode Value
                    </label>
                    <input
                      type="text"
                      value={(selectedElement as BarcodeElement).value}
                      onChange={(e) => updateSelectedElement({ value: e.target.value })}
                      style={{
                        width: '100%',
                        background: inputBg,
                        color: fg,
                        border: `1px solid ${bdr}`,
                        borderRadius: 6,
                        padding: '8px 10px',
                        fontSize: 13,
                        fontWeight: 600,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                        Height (px)
                      </label>
                      <input
                        type="number"
                        min="20"
                        max="200"
                        value={selectedElement.height}
                        onChange={(e) => updateSelectedElement({ height: parseInt(e.target.value, 10) || 40 })}
                        style={{
                          width: '100%',
                          background: inputBg,
                          color: fg,
                          border: `1px solid ${bdr}`,
                          borderRadius: 6,
                          padding: '6px 8px',
                          fontSize: 13,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                        Width (px)
                      </label>
                      <input
                        type="number"
                        min="40"
                        max="400"
                        value={selectedElement.width}
                        onChange={(e) => updateSelectedElement({ width: parseInt(e.target.value, 10) || 100 })}
                        style={{
                          width: '100%',
                          background: inputBg,
                          color: fg,
                          border: `1px solid ${bdr}`,
                          borderRadius: 6,
                          padding: '6px 8px',
                          fontSize: 13,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={(selectedElement as BarcodeElement).showText}
                        onChange={(e) => updateSelectedElement({ showText: e.target.checked })}
                        style={{ accentColor: acc }}
                      />
                      <span>Show Human-Readable Value Below</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Dimensions (X, Y, W, H) for Image or Divider */}
              {(selectedElement.type === 'image' || selectedElement.type === 'divider') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={selectedElement.width}
                      onChange={(e) => updateSelectedElement({ width: parseInt(e.target.value, 10) || 20 })}
                      style={{
                        width: '100%',
                        background: inputBg,
                        color: fg,
                        border: `1px solid ${bdr}`,
                        borderRadius: 6,
                        padding: '6px 8px',
                        fontSize: 13,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: fg2, marginBottom: 4 }}>
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={selectedElement.height}
                      onChange={(e) => updateSelectedElement({ height: parseInt(e.target.value, 10) || 20 })}
                      style={{
                        width: '100%',
                        background: inputBg,
                        color: fg,
                        border: `1px solid ${bdr}`,
                        borderRadius: 6,
                        padding: '6px 8px',
                        fontSize: 13,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '24px 8px', textAlign: 'center', color: fg2, fontSize: 12 }}>
              <Move size={24} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
              <p>Click on any element in the label preview to edit its text, barcode, size, and styling.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Privacy Assurance Note ── */}
      <div
        style={{
          marginTop: 24,
          padding: '12px 16px',
          background: dk ? 'rgba(16, 185, 129, 0.08)' : '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 8,
          fontSize: 12,
          color: dk ? '#86efac' : '#166534',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        <ShieldCheck size={16} />
        <span>Your label data is processed locally in your browser. No product names, prices, or barcodes are uploaded or transmitted to any server.</span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Export & Print Modal
      ───────────────────────────────────────────────────────────── */}
      {showExportModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20
          }}
          onClick={() => setShowExportModal(false)}
        >
          <div
            style={{
              background: cardBg,
              border: `1px solid ${bdr}`,
              borderRadius: 14,
              padding: 24,
              maxWidth: 480,
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: fg, marginBottom: 8 }}>
              Export & Print Options
            </h3>
            <p style={{ fontSize: 13, color: fg2, marginBottom: 20 }}>
              Choose your preferred print format. Physical sticker dimensions ({effectiveWidthInch}" × {effectiveHeightInch}") are strictly preserved.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {/* Option 1: Exact Physical PDF */}
              <div
                style={{
                  border: `1px solid ${bdr}`,
                  borderRadius: 8,
                  padding: 14,
                  background: inputBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: fg, margin: 0 }}>Single Label PDF</h4>
                  <span style={{ fontSize: 11, color: fg2 }}>Exact {effectiveWidthInch}" × {effectiveHeightInch}" page bounding box for thermal roll printers.</span>
                </div>
                <button
                  type="button"
                  disabled={isGeneratingPdf}
                  onClick={handleExportSinglePdf}
                  style={{
                    background: acc,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 14px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {isGeneratingPdf ? 'Generating...' : 'Download'}
                </button>
              </div>

              {/* Option 2: Multi-Label A4 Sheet PDF */}
              <div
                style={{
                  border: `1px solid ${bdr}`,
                  borderRadius: 8,
                  padding: 14,
                  background: inputBg
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: fg, margin: 0 }}>Multi-Label A4 Sheet PDF</h4>
                    <span style={{ fontSize: 11, color: fg2 }}>Multiple stickers tiled onto standard A4 paper for laser/inkjet printers.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, color: fg2 }}>Copies:</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={sheetCopies}
                      onChange={(e) => setSheetCopies(parseInt(e.target.value, 10) || 12)}
                      style={{
                        width: 60,
                        background: cardBg,
                        color: fg,
                        border: `1px solid ${bdr}`,
                        borderRadius: 6,
                        padding: '4px 8px',
                        fontSize: 12
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isGeneratingPdf}
                    onClick={handleExportSheetPdf}
                    style={{
                      background: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '8px 14px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {isGeneratingPdf ? 'Generating...' : 'Download Sheet'}
                  </button>
                </div>
              </div>

              {/* Option 3: Browser Direct Print */}
              <div
                style={{
                  border: `1px solid ${bdr}`,
                  borderRadius: 8,
                  padding: 14,
                  background: inputBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: fg, margin: 0 }}>Direct Browser Print</h4>
                  <span style={{ fontSize: 11, color: fg2 }}>Open browser print dialog for thermal sticker or desktop printer.</span>
                </div>
                <button
                  type="button"
                  onClick={handleDirectBrowserPrint}
                  style={{
                    background: inputBg,
                    color: fg,
                    border: `1px solid ${bdr}`,
                    borderRadius: 6,
                    padding: '8px 14px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Print Dialog
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                style={{
                  background: 'transparent',
                  color: fg2,
                  border: `1px solid ${bdr}`,
                  borderRadius: 6,
                  padding: '8px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          Thermal Printer Advice Modal
      ───────────────────────────────────────────────────────────── */}
      {showThermalModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20
          }}
          onClick={() => setShowThermalModal(false)}
        >
          <div
            style={{
              background: cardBg,
              border: `1px solid ${bdr}`,
              borderRadius: 14,
              padding: 24,
              maxWidth: 580,
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              maxHeight: '85vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: fg, marginBottom: 6 }}>
              Thermal Printer Setup & Guidance
            </h3>
            <p style={{ fontSize: 13, color: fg2, marginBottom: 16 }}>
              Recommendations for printing crisp, scannable barcode stickers on thermal transfer and direct thermal label printers.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {THERMAL_PRINTER_GUIDANCE.map((advice, idx) => (
                <div
                  key={idx}
                  style={{
                    background: inputBg,
                    border: `1px solid ${bdr}`,
                    borderRadius: 8,
                    padding: 14
                  }}
                >
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: acc, marginBottom: 6 }}>
                    {advice.modelType} ({advice.dpi} DPI / {advice.dotsPerMm} dots/mm)
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: fg2, lineHeight: 1.6 }}>
                    {advice.recommendedSettings.map((rec, rIdx) => (
                      <li key={rIdx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowThermalModal(false)}
                style={{
                  background: acc,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 18px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Barcode Element Canvas Renderer Component
// ─────────────────────────────────────────────────────────────
const BarcodeElementRenderer: React.FC<{ element: BarcodeElement }> = ({ element }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { bits, displayValue } = generateBarcodeBits(element.value, element.format);
    if (!bits) return;

    const canvas = canvasRef.current;
    canvas.width = element.width;
    canvas.height = element.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (element.bgColor && element.bgColor !== 'transparent') {
      ctx.fillStyle = element.bgColor;
      ctx.fillRect(0, 0, element.width, element.height);
    }

    const barCount = bits.length;
    const singleBarWidth = element.width / barCount;
    const textSpace = element.showText ? 14 : 0;
    const actualBarHeight = Math.max(10, element.height - textSpace);

    ctx.fillStyle = element.fgColor || '#000000';
    for (let i = 0; i < barCount; i++) {
      if (bits[i] === '1') {
        ctx.fillRect(
          Math.round(i * singleBarWidth),
          0,
          Math.max(1, Math.ceil(singleBarWidth)),
          actualBarHeight
        );
      }
    }

    if (element.showText && displayValue) {
      ctx.fillStyle = element.fgColor || '#000000';
      ctx.font = '600 11px Inter, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(displayValue, element.width / 2, element.height);
    }
  }, [element]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none'
      }}
    />
  );
};
