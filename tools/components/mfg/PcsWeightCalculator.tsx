import React, { useState, useMemo } from 'react';
import { formatNumber, copyToClipboard } from '../../utils/formatters';
import { Copy, Check, RotateCcw } from 'lucide-react';

export const PcsWeightCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [direction, setDirection] = useState<'weightToPcs' | 'pcsToWeight'>('weightToPcs');

  // Parameters
  const [pieceWeightGrams, setPieceWeightGrams] = useState('42.5');
  const [totalWeightKg, setTotalWeightKg] = useState('85.4');
  const [tareWeightKg, setTareWeightKg] = useState('2.2');
  const [targetPieces, setTargetPieces] = useState('2000');
  const [toleranceMarginPct, setToleranceMarginPct] = useState('1.5');
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const singlePieceG = parseFloat(pieceWeightGrams) || 0;
  const grossKg = parseFloat(totalWeightKg) || 0;
  const tareKg = parseFloat(tareWeightKg) || 0;
  const pcsCount = parseFloat(targetPieces) || 0;
  const tol = parseFloat(toleranceMarginPct) || 0;

  const results = useMemo(() => {
    if (direction === 'weightToPcs') {
      const netKg = Math.max(0, grossKg - tareKg);
      const netGrams = netKg * 1000;
      const count = singlePieceG > 0 ? Math.round(netGrams / singlePieceG) : 0;
      const minCount = Math.round(count * (1 - tol / 100));
      const maxCount = Math.round(count * (1 + tol / 100));
      return {
        netKg,
        count,
        minCount,
        maxCount,
        singlePieceG,
        grossEstimatedKg: grossKg,
        pcsCount: count
      };
    } else {
      const netGrams = pcsCount * singlePieceG;
      const netKg = netGrams / 1000;
      const grossEstimatedKg = netKg + tareKg;
      return {
        netKg,
        grossEstimatedKg,
        pcsCount,
        count: pcsCount,
        minCount: Math.round(pcsCount * (1 - tol / 100)),
        maxCount: Math.round(pcsCount * (1 + tol / 100)),
        singlePieceG
      };
    }
  }, [direction, singlePieceG, grossKg, tareKg, pcsCount, tol]);

  const handleCopy = () => {
    const text = direction === 'weightToPcs'
      ? `Weight to Pieces Count:\nGross Weight: ${grossKg} kg (Tare: ${tareKg} kg | Net: ${results.netKg.toFixed(2)} kg)\nSingle Piece Weight: ${singlePieceG} g\nEstimated Total Pieces: ${formatNumber(results.count)} Pcs (Range: ${formatNumber(results.minCount)} - ${formatNumber(results.maxCount)} Pcs)`
      : `Pieces to Weight Calculation:\nTarget Pieces: ${formatNumber(pcsCount)} Pcs\nSingle Piece Weight: ${singlePieceG} g\nCalculated Net Weight: ${results.netKg.toFixed(3)} kg (Gross with ${tareKg} kg tare: ${results.grossEstimatedKg?.toFixed(3)} kg)`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Direction Toggle */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => setDirection('weightToPcs')}
          style={{
            padding: '12px',
            borderRadius: 8,
            border: `1px solid ${direction === 'weightToPcs' ? acc : bdr}`,
            background: direction === 'weightToPcs' ? (dk ? `${acc}20` : `${acc}15`) : inputBg,
            color: direction === 'weightToPcs' ? acc : fg,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          Mode A: Total Weight (kg) ➔ Total Pieces (Pcs)
        </button>

        <button
          type="button"
          onClick={() => setDirection('pcsToWeight')}
          style={{
            padding: '12px',
            borderRadius: 8,
            border: `1px solid ${direction === 'pcsToWeight' ? acc : bdr}`,
            background: direction === 'pcsToWeight' ? (dk ? `${acc}20` : `${acc}15`) : inputBg,
            color: direction === 'pcsToWeight' ? acc : fg,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          Mode B: Pieces Count (Pcs) ➔ Total Weight (kg)
        </button>
      </div>

      {/* Common & Specific Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
            Weight of Single Piece (Grams)
          </label>
          <input
            type="number"
            step="any"
            min="0.001"
            value={pieceWeightGrams}
            onChange={(e) => setPieceWeightGrams(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
          />
          <div style={{ fontSize: 11.5, color: fg2, marginTop: 4 }}>Weigh 10 units and divide for high accuracy</div>
        </div>

        {direction === 'weightToPcs' ? (
          <>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
                Gross Weighing Scale Reading (kg)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={totalWeightKg}
                onChange={(e) => setTotalWeightKg(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
                Tare Weight (Box / Pallet / Carton) (kg)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={tareWeightKg}
                onChange={(e) => setTareWeightKg(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
                Tolerance / Variance Margin (±%)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                max="10"
                value={toleranceMarginPct}
                onChange={(e) => setToleranceMarginPct(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
                Total Required Pieces
              </label>
              <input
                type="number"
                min="1"
                value={targetPieces}
                onChange={(e) => setTargetPieces(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
                Tare / Packaging Weight to Add (kg)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={tareWeightKg}
                onChange={(e) => setTareWeightKg(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>
          </>
        )}
      </div>

      {/* Results */}
      {direction === 'weightToPcs' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ background: dk ? `${acc}15` : `${acc}10`, border: `1px solid ${acc}40`, borderRadius: 10, padding: 22 }}>
            <div style={{ fontSize: 12, color: acc, fontWeight: 800, textTransform: 'uppercase' }}>Calculated Piece Count</div>
            <div style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 900, marginTop: 4, color: fg }}>
              {formatNumber(results.count)} <span style={{ fontSize: 16, fontWeight: 600, color: fg2 }}>Pcs</span>
            </div>
            <div style={{ fontSize: 12, color: fg2, marginTop: 4 }}>Based on {results.netKg.toFixed(2)} kg net weight</div>
          </div>

          <div style={{ background: dk ? 'rgba(56, 189, 248, 0.08)' : '#f0f9ff', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 10, padding: 22 }}>
            <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>Expected Range (±{tol}%)</div>
            <div style={{ fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 800, marginTop: 4, color: fg }}>
              {formatNumber(results.minCount)} – {formatNumber(results.maxCount)} <span style={{ fontSize: 14, color: fg2 }}>Pcs</span>
            </div>
            <div style={{ fontSize: 12, color: fg2, marginTop: 4 }}>Accounts for part weight variation</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ background: dk ? `${acc}15` : `${acc}10`, border: `1px solid ${acc}40`, borderRadius: 10, padding: 22 }}>
            <div style={{ fontSize: 12, color: acc, fontWeight: 800, textTransform: 'uppercase' }}>Net Target Material Weight</div>
            <div style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 900, marginTop: 4, color: fg }}>
              {results.netKg.toFixed(3)} <span style={{ fontSize: 16, fontWeight: 600, color: fg2 }}>kg</span>
            </div>
            <div style={{ fontSize: 12, color: fg2, marginTop: 4 }}>Pure goods weight for {formatNumber(pcsCount)} pieces</div>
          </div>

          <div style={{ background: dk ? 'rgba(56, 189, 248, 0.08)' : '#f0f9ff', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 10, padding: 22 }}>
            <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>Gross Scale Weight (with Tare)</div>
            <div style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 900, marginTop: 4, color: fg }}>
              {results.grossEstimatedKg?.toFixed(3)} <span style={{ fontSize: 16, fontWeight: 600, color: fg2 }}>kg</span>
            </div>
            <div style={{ fontSize: 12, color: fg2, marginTop: 4 }}>Includes {tareKg} kg packaging allowance</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleCopy}
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 18px',
            borderRadius: 8,
            border: 'none',
            background: acc,
            color: '#ffffff',
            fontSize: 13.5,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Copied Calculation' : 'Copy Count & Weight Result'}</span>
        </button>
      </div>
    </div>
  );
};
