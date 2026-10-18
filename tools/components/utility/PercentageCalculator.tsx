import React, { useState } from 'react';
import { formatNumber, copyToClipboard } from '../../utils/formatters';
import { Copy, Check, RotateCcw } from 'lucide-react';

export const PercentageCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  // Mode 1: What is X% of Y?
  const [m1X, setM1X] = useState('18');
  const [m1Y, setM1Y] = useState('25000');

  // Mode 2: X is what % of Y?
  const [m2X, setM2X] = useState('450');
  const [m2Y, setM2Y] = useState('2000');

  // Mode 3: % Increase/Decrease from X to Y
  const [m3X, setM3X] = useState('1200');
  const [m3Y, setM3Y] = useState('1650');

  // Mode 4: Add / Subtract X% from Y
  const [m4Y, setM4Y] = useState('5000');
  const [m4X, setM4X] = useState('12');
  const [m4Op, setM4Op] = useState<'add' | 'sub'>('add');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  // 1.
  const m1Result = ((parseFloat(m1X) || 0) * (parseFloat(m1Y) || 0)) / 100;

  // 2.
  const m2yVal = parseFloat(m2Y) || 0;
  const m2Result = m2yVal > 0 ? ((parseFloat(m2X) || 0) / m2yVal) * 100 : 0;

  // 3.
  const m3xVal = parseFloat(m3X) || 0;
  const m3yVal = parseFloat(m3Y) || 0;
  const m3Diff = m3yVal - m3xVal;
  const m3Result = m3xVal !== 0 ? (m3Diff / Math.abs(m3xVal)) * 100 : 0;

  // 4.
  const m4yVal = parseFloat(m4Y) || 0;
  const m4xVal = parseFloat(m4X) || 0;
  const m4Delta = (m4yVal * m4xVal) / 100;
  const m4Result = m4Op === 'add' ? m4yVal + m4Delta : m4yVal - m4Delta;

  const handleCopy = (id: string, text: string) => {
    copyToClipboard(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      
      {/* 1. What is X% of Y? */}
      <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 12, padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: fg, marginBottom: 14 }}>
          1. Calculate Part: What is X% of Y?
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span>What is</span>
          <input
            type="number"
            step="any"
            value={m1X}
            onChange={(e) => setM1X(e.target.value)}
            style={{ width: 100, padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700 }}
          />
          <span>% of</span>
          <input
            type="number"
            step="any"
            value={m1Y}
            onChange={(e) => setM1Y(e.target.value)}
            style={{ width: 140, padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700 }}
          />
          <span>=</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: acc, minWidth: 100 }}>
            {formatNumber(m1Result, 2)}
          </span>
          <button
            type="button"
            onClick={() => handleCopy('m1', `${m1X}% of ${m1Y} = ${m1Result.toFixed(2)}`)}
            style={{ marginLeft: 'auto', background: dk ? 'rgba(255,255,255,0.06)' : '#f1f5f9', border: `1px solid ${bdr}`, padding: '6px 12px', borderRadius: 6, color: fg, cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {copiedId === 'm1' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copiedId === 'm1' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* 2. X is what % of Y? */}
      <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 12, padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: fg, marginBottom: 14 }}>
          2. Calculate Ratio: X is what % of Y?
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="number"
            step="any"
            value={m2X}
            onChange={(e) => setM2X(e.target.value)}
            style={{ width: 120, padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700 }}
          />
          <span>is what percentage of</span>
          <input
            type="number"
            step="any"
            value={m2Y}
            onChange={(e) => setM2Y(e.target.value)}
            style={{ width: 140, padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700 }}
          />
          <span>=</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: acc, minWidth: 100 }}>
            {m2Result.toFixed(2)}%
          </span>
          <button
            type="button"
            onClick={() => handleCopy('m2', `${m2X} is ${m2Result.toFixed(2)}% of ${m2Y}`)}
            style={{ marginLeft: 'auto', background: dk ? 'rgba(255,255,255,0.06)' : '#f1f5f9', border: `1px solid ${bdr}`, padding: '6px 12px', borderRadius: 6, color: fg, cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {copiedId === 'm2' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copiedId === 'm2' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* 3. % Increase / Decrease */}
      <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 12, padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: fg, marginBottom: 14 }}>
          3. Percentage Change: From Value X to Value Y
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span>From</span>
          <input
            type="number"
            step="any"
            value={m3X}
            onChange={(e) => setM3X(e.target.value)}
            style={{ width: 120, padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700 }}
          />
          <span>to</span>
          <input
            type="number"
            step="any"
            value={m3Y}
            onChange={(e) => setM3Y(e.target.value)}
            style={{ width: 120, padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700 }}
          />
          <span>=</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: m3Result >= 0 ? '#10b981' : '#ef4444', minWidth: 100 }}>
            {m3Result >= 0 ? `+${m3Result.toFixed(2)}%` : `${m3Result.toFixed(2)}%`}
          </span>
          <button
            type="button"
            onClick={() => handleCopy('m3', `Change from ${m3X} to ${m3Y} = ${m3Result.toFixed(2)}%`)}
            style={{ marginLeft: 'auto', background: dk ? 'rgba(255,255,255,0.06)' : '#f1f5f9', border: `1px solid ${bdr}`, padding: '6px 12px', borderRadius: 6, color: fg, cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {copiedId === 'm3' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copiedId === 'm3' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* 4. Add / Subtract X% */}
      <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 12, padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: fg, marginBottom: 14 }}>
          4. Adjust Value: Add or Subtract Percentage
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <select
            value={m4Op}
            onChange={(e) => setM4Op(e.target.value as any)}
            style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 14, fontWeight: 700 }}
          >
            <option value="add">Add (+)</option>
            <option value="sub">Subtract (−)</option>
          </select>
          <input
            type="number"
            step="any"
            value={m4X}
            onChange={(e) => setM4X(e.target.value)}
            style={{ width: 100, padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700 }}
          />
          <span>% to/from</span>
          <input
            type="number"
            step="any"
            value={m4Y}
            onChange={(e) => setM4Y(e.target.value)}
            style={{ width: 140, padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 16, fontWeight: 700 }}
          />
          <span>=</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: acc, minWidth: 100 }}>
            {formatNumber(m4Result, 2)}
          </span>
          <button
            type="button"
            onClick={() => handleCopy('m4', `${m4Op === 'add' ? 'Add' : 'Subtract'} ${m4X}% to ${m4Y} = ${m4Result.toFixed(2)}`)}
            style={{ marginLeft: 'auto', background: dk ? 'rgba(255,255,255,0.06)' : '#f1f5f9', border: `1px solid ${bdr}`, padding: '6px 12px', borderRadius: 6, color: fg, cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {copiedId === 'm4' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copiedId === 'm4' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
