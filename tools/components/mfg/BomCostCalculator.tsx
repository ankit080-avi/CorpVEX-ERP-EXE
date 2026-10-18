import React, { useState, useMemo } from 'react';
import { formatIndianCurrency, formatNumber, copyToClipboard } from '../../utils/formatters';
import { Plus, Trash2, Copy, Check, RotateCcw } from 'lucide-react';

interface BomItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  rate: number;
  wastagePct: number;
}

export const BomCostCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [productName, setProductName] = useState('Cotton Formal Shirt (Batch #100)');
  const [batchOutputUnits, setBatchOutputUnits] = useState('100');
  const [laborCostPerBatch, setLaborCostPerBatch] = useState('8500');
  const [overheadCostPerBatch, setOverheadCostPerBatch] = useState('4200');

  const [items, setItems] = useState<BomItem[]>([
    { id: '1', name: 'Cotton 40s Combed Fabric', qty: 160, unit: 'MTR', rate: 210, wastagePct: 4 },
    { id: '2', name: 'Polyester Interlining Fusing', qty: 25, unit: 'MTR', rate: 85, wastagePct: 2 },
    { id: '3', name: 'Resin Pearlized Buttons', qty: 1200, unit: 'PCS', rate: 0.75, wastagePct: 5 },
    { id: '4', name: 'Poly-Core Spun Thread Spool', qty: 8, unit: 'SPOOL', rate: 120, wastagePct: 0 },
    { id: '5', name: 'Cardboard Tag & Poly Packaging', qty: 100, unit: 'SET', rate: 18, wastagePct: 1 }
  ]);
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const batchUnits = Math.max(1, parseFloat(batchOutputUnits) || 1);
  const labor = parseFloat(laborCostPerBatch) || 0;
  const overhead = parseFloat(overheadCostPerBatch) || 0;

  const totals = useMemo(() => {
    let totalMaterialCost = 0;

    items.forEach((it) => {
      const baseCost = it.qty * it.rate;
      const wastage = (baseCost * (it.wastagePct || 0)) / 100;
      totalMaterialCost += baseCost + wastage;
    });

    const totalBatchCost = totalMaterialCost + labor + overhead;
    const costPerFinishedUnit = totalBatchCost / batchUnits;

    return {
      totalMaterialCost,
      labor,
      overhead,
      totalBatchCost,
      costPerFinishedUnit
    };
  }, [items, batchUnits, labor, overhead]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: String(Date.now()), name: 'Raw Material', qty: 1, unit: 'KG', rate: 100, wastagePct: 0 }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const updateItem = (id: string, field: keyof BomItem, val: any) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: val } : it))
    );
  };

  const handleCopy = () => {
    const text = `Bill of Materials (BOM) Cost Breakdown:\nProduct: ${productName}\nBatch Size: ${batchUnits} Units\nTotal Raw Material Cost: ${formatIndianCurrency(totals.totalMaterialCost)}\nLabor Cost: ${formatIndianCurrency(labor)}\nOverheads: ${formatIndianCurrency(overhead)}\nTotal Batch Manufacturing Cost: ${formatIndianCurrency(totals.totalBatchCost)}\nUnit Cost per Finished Product: ${formatIndianCurrency(totals.costPerFinishedUnit)}`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Product & Batch Parameters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
            Finished Good / Product Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
            Batch Output Quantity (Units Produced)
          </label>
          <input
            type="number"
            min="1"
            value={batchOutputUnits}
            onChange={(e) => setBatchOutputUnits(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
            Batch Labor / Jobwork Charges (₹)
          </label>
          <input
            type="number"
            min="0"
            value={laborCostPerBatch}
            onChange={(e) => setLaborCostPerBatch(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 14, boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: fg }}>
            Factory Overheads & Power (₹)
          </label>
          <input
            type="number"
            min="0"
            value={overheadCostPerBatch}
            onChange={(e) => setOverheadCostPerBatch(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 14, boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* BOM Items Table */}
      <div style={{ overflowX: 'auto', marginBottom: 18 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: dk ? '#111a28' : '#f1f5f9', borderBottom: `1px solid ${bdr}`, textAlign: 'left', color: fg2 }}>
              <th style={{ padding: '10px 12px' }}>Raw Material / Component</th>
              <th style={{ padding: '10px 12px', width: 90 }}>Qty</th>
              <th style={{ padding: '10px 12px', width: 85 }}>Unit</th>
              <th style={{ padding: '10px 12px', width: 110 }}>Rate (₹)</th>
              <th style={{ padding: '10px 12px', width: 90 }}>Wastage %</th>
              <th style={{ padding: '10px 12px', width: 120, textAlign: 'right' }}>Total Cost (₹)</th>
              <th style={{ padding: '10px 12px', width: 45 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const baseCost = it.qty * it.rate;
              const wastage = (baseCost * (it.wastagePct || 0)) / 100;
              const lineTotal = baseCost + wastage;

              return (
                <tr key={it.id} style={{ borderBottom: `1px solid ${bdr}` }}>
                  <td style={{ padding: '6px 8px' }}>
                    <input
                      type="text"
                      value={it.name}
                      onChange={(e) => updateItem(it.id, 'name', e.target.value)}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                    />
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <input
                      type="number"
                      min="0.01"
                      step="any"
                      value={it.qty}
                      onChange={(e) => updateItem(it.id, 'qty', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                    />
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <input
                      type="text"
                      value={it.unit}
                      onChange={(e) => updateItem(it.id, 'unit', e.target.value.toUpperCase())}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                    />
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={it.rate}
                      onChange={(e) => updateItem(it.id, 'rate', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                    />
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={it.wastagePct}
                      onChange={(e) => updateItem(it.id, 'wastagePct', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                    />
                  </td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700 }}>
                    {formatIndianCurrency(lineTotal)}
                  </td>
                  <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => removeItem(it.id)}
                      disabled={items.length <= 1}
                      style={{ background: 'none', border: 'none', color: items.length <= 1 ? fg2 : '#ef4444', cursor: items.length <= 1 ? 'not-allowed' : 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: 28 }}>
        <button
          type="button"
          onClick={addItem}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 6,
            border: `1px solid ${acc}`,
            background: `${acc}15`,
            color: acc,
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer'
          }}
        >
          <Plus size={15} />
          <span>Add Raw Material / Ingredient</span>
        </button>
      </div>

      {/* Cost Summary Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Raw Material Cost</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{formatIndianCurrency(totals.totalMaterialCost)}</div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Includes wastage allowance</div>
        </div>

        <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Conversion Costs</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{formatIndianCurrency(labor + overhead)}</div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Labor (₹{labor}) + Overhead (₹{overhead})</div>
        </div>

        <div style={{ background: dk ? 'rgba(56, 189, 248, 0.08)' : '#f0f9ff', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>Total Batch Cost</div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4, color: fg }}>
            {formatIndianCurrency(totals.totalBatchCost)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Cost for {batchUnits} units</div>
        </div>

        <div style={{ background: dk ? `${acc}15` : `${acc}10`, border: `1px solid ${acc}40`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 12, color: acc, fontWeight: 800, textTransform: 'uppercase' }}>Unit Cost per Piece</div>
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4, color: fg }}>
            {formatIndianCurrency(totals.costPerFinishedUnit)}
          </div>
          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Minimum floor cost per unit</div>
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
          <span>{copied ? 'Copied BOM Summary' : 'Copy BOM Costing'}</span>
        </button>
      </div>
    </div>
  );
};
