import React, { useState } from 'react';
import { formatNumber, copyToClipboard } from '../../utils/formatters';
import { Copy, Check, RotateCcw } from 'lucide-react';

export const GsmCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [method, setMethod] = useState<'sample' | 'construction'>('sample');

  // Method 1: Swatch Sample
  const [sampleWeightGrams, setSampleWeightGrams] = useState('2.45');
  const [sampleLengthCm, setSampleLengthCm] = useState('10');
  const [sampleWidthCm, setSampleWidthCm] = useState('10');

  // Method 2: Woven Construction
  const [epi, setEpi] = useState('76');
  const [ppi, setPpi] = useState('68');
  const [warpCount, setWarpCount] = useState('40');
  const [weftCount, setWeftCount] = useState('40');
  const [crimpPct, setCrimpPct] = useState('5');

  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  let calculatedGsm = 0;
  let calculationDetails = '';

  if (method === 'sample') {
    const w = parseFloat(sampleWeightGrams) || 0;
    const l = parseFloat(sampleLengthCm) || 0;
    const b = parseFloat(sampleWidthCm) || 0;
    const areaSqCm = l * b;
    if (areaSqCm > 0) {
      calculatedGsm = (w * 10000) / areaSqCm;
      calculationDetails = `Swatch Sample: ${w}g on ${l}cm × ${b}cm (${areaSqCm} cm²)`;
    }
  } else {
    const e = parseFloat(epi) || 0;
    const p = parseFloat(ppi) || 0;
    const wC = parseFloat(warpCount) || 1;
    const fC = parseFloat(weftCount) || 1;
    const crimpFactor = 1 + (parseFloat(crimpPct) || 0) / 100;

    // Standard textile formula: GSM = ((EPI / Warp Count) + (PPI / Weft Count)) * 23.25 * crimp
    if (wC > 0 && fC > 0) {
      const warpGsm = (e / wC) * 23.25 * crimpFactor;
      const weftGsm = (p / fC) * 23.25 * crimpFactor;
      calculatedGsm = warpGsm + weftGsm;
      calculationDetails = `Warp GSM: ${warpGsm.toFixed(1)} | Weft GSM: ${weftGsm.toFixed(1)} (Crimp: ${crimpPct}%)`;
    }
  }

  // Oz per square yard = GSM / 33.906
  const ozPerSqYard = calculatedGsm / 33.906;

  const handleCopy = () => {
    const text = `Fabric GSM Calculation:\nMethod: ${method === 'sample' ? 'Sample Weight Method' : 'Yarn Construction Method'}\nCalculated GSM: ${calculatedGsm.toFixed(2)} g/m²\nOunces per Sq Yard (oz/yd²): ${ozPerSqYard.toFixed(2)} oz\n${calculationDetails}`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Method Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => setMethod('sample')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: 8,
            border: `1px solid ${method === 'sample' ? acc : bdr}`,
            background: method === 'sample' ? (dk ? `${acc}20` : `${acc}15`) : inputBg,
            color: method === 'sample' ? acc : fg,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          Method 1: Swatch / Cut Sample Weight
        </button>
        <button
          type="button"
          onClick={() => setMethod('construction')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: 8,
            border: `1px solid ${method === 'construction' ? acc : bdr}`,
            background: method === 'construction' ? (dk ? `${acc}20` : `${acc}15`) : inputBg,
            color: method === 'construction' ? acc : fg,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          Method 2: Woven Fabric Construction (EPI / PPI / Count)
        </button>
      </div>

      {/* Inputs */}
      {method === 'sample' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
              Sample Weight (Grams)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={sampleWeightGrams}
              onChange={(e) => setSampleWeightGrams(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
            />
            <div style={{ fontSize: 11.5, color: fg2, marginTop: 4 }}>e.g. from precision balance</div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
              Sample Length (cm)
            </label>
            <input
              type="number"
              step="any"
              min="1"
              value={sampleLengthCm}
              onChange={(e) => setSampleLengthCm(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
            />
            <div style={{ fontSize: 11.5, color: fg2, marginTop: 4 }}>Default standard swatch: 10 cm</div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
              Sample Width (cm)
            </label>
            <input
              type="number"
              step="any"
              min="1"
              value={sampleWidthCm}
              onChange={(e) => setSampleWidthCm(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700, boxSizing: 'border-box' }}
            />
            <div style={{ fontSize: 11.5, color: fg2, marginTop: 4 }}>Default standard swatch: 10 cm</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 6, color: fg }}>
              Ends per Inch (EPI)
            </label>
            <input
              type="number"
              value={epi}
              onChange={(e) => setEpi(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 15, fontWeight: 700, boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 6, color: fg }}>
              Picks per Inch (PPI)
            </label>
            <input
              type="number"
              value={ppi}
              onChange={(e) => setPpi(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 15, fontWeight: 700, boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 6, color: fg }}>
              Warp Count (Ne)
            </label>
            <input
              type="number"
              value={warpCount}
              onChange={(e) => setWarpCount(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 15, fontWeight: 700, boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 6, color: fg }}>
              Weft Count (Ne)
            </label>
            <input
              type="number"
              value={weftCount}
              onChange={(e) => setWeftCount(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 15, fontWeight: 700, boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 6, color: fg }}>
              Crimp Allowance (%)
            </label>
            <input
              type="number"
              value={crimpPct}
              onChange={(e) => setCrimpPct(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 15, fontWeight: 700, boxSizing: 'border-box' }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: dk ? `${acc}15` : `${acc}10`, border: `1px solid ${acc}40`, borderRadius: 10, padding: 22 }}>
          <div style={{ fontSize: 12, color: acc, fontWeight: 800, textTransform: 'uppercase' }}>Fabric Weight (GSM)</div>
          <div style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 900, marginTop: 4, color: fg }}>
            {calculatedGsm.toFixed(1)} <span style={{ fontSize: 16, fontWeight: 600, color: fg2 }}>g/m²</span>
          </div>
          <div style={{ fontSize: 12, color: fg2, marginTop: 4 }}>{calculationDetails}</div>
        </div>

        <div style={{ background: dk ? 'rgba(56, 189, 248, 0.08)' : '#f0f9ff', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 10, padding: 22 }}>
          <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>Ounces per Sq Yard (oz/yd²)</div>
          <div style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 900, marginTop: 4, color: fg }}>
            {ozPerSqYard.toFixed(2)} <span style={{ fontSize: 16, fontWeight: 600, color: fg2 }}>oz</span>
          </div>
          <div style={{ fontSize: 12, color: fg2, marginTop: 4 }}>Standard US denim & garment specification</div>
        </div>
      </div>

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
          <span>{copied ? 'Copied GSM' : 'Copy GSM Result'}</span>
        </button>
      </div>
    </div>
  );
};
