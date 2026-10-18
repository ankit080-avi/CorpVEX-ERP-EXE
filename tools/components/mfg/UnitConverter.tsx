import React, { useState } from 'react';
import { formatNumber, copyToClipboard } from '../../utils/formatters';
import { ArrowRightLeft, Copy, Check } from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'area' | 'volume';

interface UnitDef {
  id: string;
  name: string;
  factorToBase: number; // Base: Meter for length, KG for weight, Sq Meter for area, Liter for volume
}

const UNIT_SYSTEMS: Record<UnitCategory, { name: string; baseUnit: string; units: UnitDef[] }> = {
  length: {
    name: 'Length & Fabric Dimensions',
    baseUnit: 'Meter',
    units: [
      { id: 'm', name: 'Meters (m)', factorToBase: 1 },
      { id: 'yd', name: 'Yards (yd)', factorToBase: 0.9144 },
      { id: 'ft', name: 'Feet (ft)', factorToBase: 0.3048 },
      { id: 'in', name: 'Inches (in)', factorToBase: 0.0254 },
      { id: 'cm', name: 'Centimeters (cm)', factorToBase: 0.01 },
      { id: 'mm', name: 'Millimeters (mm)', factorToBase: 0.001 },
      { id: 'km', name: 'Kilometers (km)', factorToBase: 1000 }
    ]
  },
  weight: {
    name: 'Weight & Raw Material Mass',
    baseUnit: 'Kilogram',
    units: [
      { id: 'kg', name: 'Kilograms (kg)', factorToBase: 1 },
      { id: 'g', name: 'Grams (g)', factorToBase: 0.001 },
      { id: 'ton', name: 'Metric Ton (MT)', factorToBase: 1000 },
      { id: 'quintal', name: 'Quintal (q)', factorToBase: 100 },
      { id: 'lb', name: 'Pounds (lbs)', factorToBase: 0.45359237 },
      { id: 'oz', name: 'Ounces (oz)', factorToBase: 0.0283495 }
    ]
  },
  area: {
    name: 'Area & Industrial Land',
    baseUnit: 'Square Meter',
    units: [
      { id: 'sqm', name: 'Square Meters (sq m)', factorToBase: 1 },
      { id: 'sqft', name: 'Square Feet (sq ft)', factorToBase: 0.092903 },
      { id: 'sqyd', name: 'Square Yards / Gaj', factorToBase: 0.836127 },
      { id: 'acre', name: 'Acres', factorToBase: 4046.86 },
      { id: 'hectare', name: 'Hectares', factorToBase: 10000 },
      { id: 'guntha', name: 'Guntha (India)', factorToBase: 101.17 }
    ]
  },
  volume: {
    name: 'Liquid & Volume Capacity',
    baseUnit: 'Liter',
    units: [
      { id: 'ltr', name: 'Liters (L)', factorToBase: 1 },
      { id: 'ml', name: 'Milliliters (ml)', factorToBase: 0.001 },
      { id: 'gal_us', name: 'US Gallons (gal)', factorToBase: 3.78541 },
      { id: 'gal_uk', name: 'UK Gallons (Imperial)', factorToBase: 4.54609 },
      { id: 'cbm', name: 'Cubic Meters (m³)', factorToBase: 1000 }
    ]
  }
};

export const UnitConverter: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('yd');
  const [inputValue, setInputValue] = useState('100');
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const catData = UNIT_SYSTEMS[category];
  const fromDef = catData.units.find((u) => u.id === fromUnit) || catData.units[0];
  const toDef = catData.units.find((u) => u.id === toUnit) || catData.units[1] || catData.units[0];

  const val = parseFloat(inputValue) || 0;
  const baseValue = val * fromDef.factorToBase;
  const convertedValue = toDef.factorToBase > 0 ? baseValue / toDef.factorToBase : 0;

  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    setFromUnit(UNIT_SYSTEMS[newCat].units[0].id);
    setToUnit(UNIT_SYSTEMS[newCat].units[1].id);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCopy = () => {
    const text = `${formatNumber(val, 4)} ${fromDef.name} = ${formatNumber(convertedValue, 4)} ${toDef.name}`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {(['length', 'weight', 'area', 'volume'] as UnitCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: `1px solid ${category === cat ? acc : bdr}`,
              background: category === cat ? (dk ? `${acc}20` : `${acc}15`) : inputBg,
              color: category === cat ? acc : fg,
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer'
            }}
          >
            {UNIT_SYSTEMS[cat].name}
          </button>
        ))}
      </div>

      {/* Converter Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, alignItems: 'center', marginBottom: 28 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
            Convert From
          </label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 14, fontWeight: 700, boxSizing: 'border-box', marginBottom: 12 }}
          >
            {catData.units.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <input
            type="number"
            step="any"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 18, fontWeight: 800, boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
          <button
            type="button"
            onClick={swapUnits}
            title="Swap Units"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: `1px solid ${bdr}`,
              background: dk ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
              color: fg,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowRightLeft size={18} />
          </button>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
            Convert To
          </label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 14, fontWeight: 700, boxSizing: 'border-box', marginBottom: 12 }}
          >
            {catData.units.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <div style={{
            padding: '12px 14px',
            borderRadius: 8,
            border: `1px solid ${acc}40`,
            background: dk ? `${acc}15` : `${acc}10`,
            color: fg,
            fontSize: 20,
            fontWeight: 900,
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {formatNumber(convertedValue, 4)}
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div style={{
        background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff',
        border: `1px solid ${bdr}`,
        borderRadius: 12,
        padding: '20px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ fontSize: 12, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Conversion Result</div>
          <div style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 900, color: fg, marginTop: 4 }}>
            {formatNumber(val, 4)} {fromDef.name} = <span style={{ color: acc }}>{formatNumber(convertedValue, 4)} {toDef.name}</span>
          </div>
        </div>

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
          <span>{copied ? 'Copied' : 'Copy Result'}</span>
        </button>
      </div>
    </div>
  );
};
