import React, { useState, useMemo } from 'react';
import { formatIndianCurrency, numberToWordsIndian, copyToClipboard } from '../../utils/formatters';
import { Plus, Trash2, Copy, Check, RotateCcw } from 'lucide-react';

interface InvoiceRow {
  id: string;
  item: string;
  qty: number;
  rate: number;
  discountPct: number;
  gstPct: number;
}

export const InvoiceTotalCalculator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [rows, setRows] = useState<InvoiceRow[]>([
    { id: '1', item: 'Cotton Printed Shirting Fabric', qty: 250, rate: 320, discountPct: 5, gstPct: 5 },
    { id: '2', item: 'Rayon Plain Dyed Material', qty: 180, rate: 195, discountPct: 0, gstPct: 5 },
    { id: '3', item: 'Packaging & Wooden Pallets', qty: 10, rate: 450, discountPct: 0, gstPct: 18 }
  ]);
  const [shippingCharges, setShippingCharges] = useState('1500');
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const shipping = parseFloat(shippingCharges) || 0;

  const totals = useMemo(() => {
    let subtotalGross = 0;
    let totalDiscount = 0;
    let totalTaxable = 0;
    let totalGst = 0;

    rows.forEach((r) => {
      const gross = r.qty * r.rate;
      const disc = (gross * (r.discountPct || 0)) / 100;
      const taxable = gross - disc;
      const tax = (taxable * (r.gstPct || 0)) / 100;

      subtotalGross += gross;
      totalDiscount += disc;
      totalTaxable += taxable;
      totalGst += tax;
    });

    const unroundedTotal = totalTaxable + totalGst + shipping;
    const roundedGrandTotal = Math.round(unroundedTotal);
    const roundOff = roundedGrandTotal - unroundedTotal;

    return {
      subtotalGross,
      totalDiscount,
      totalTaxable,
      totalGst,
      shipping,
      roundOff,
      roundedGrandTotal
    };
  }, [rows, shipping]);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: String(Date.now()), item: 'New Material / Service', qty: 1, rate: 100, discountPct: 0, gstPct: 18 }
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, field: keyof InvoiceRow, val: any) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const handleCopy = () => {
    const text = `Invoice Summary:\nItems Count: ${rows.length}\nTaxable Subtotal: ${formatIndianCurrency(totals.totalTaxable)}\nTotal GST: ${formatIndianCurrency(totals.totalGst)}\nFreight/Shipping: ${formatIndianCurrency(totals.shipping)}\nRound Off: ${totals.roundOff.toFixed(2)}\nGrand Total: ${formatIndianCurrency(totals.roundedGrandTotal)}\nAmount in Words: ${numberToWordsIndian(totals.roundedGrandTotal)}`;
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Items Table */}
      <div style={{ overflowX: 'auto', marginBottom: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: dk ? '#111a28' : '#f1f5f9', borderBottom: `1px solid ${bdr}`, textAlign: 'left', color: fg2 }}>
              <th style={{ padding: '10px 12px', minWidth: 200 }}>Item Description</th>
              <th style={{ padding: '10px 12px', width: 90 }}>Qty</th>
              <th style={{ padding: '10px 12px', width: 110 }}>Rate (₹)</th>
              <th style={{ padding: '10px 12px', width: 90 }}>Disc %</th>
              <th style={{ padding: '10px 12px', width: 90 }}>GST %</th>
              <th style={{ padding: '10px 12px', width: 120, textAlign: 'right' }}>Total (₹)</th>
              <th style={{ padding: '10px 12px', width: 50, textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const gross = row.qty * row.rate;
              const disc = (gross * (row.discountPct || 0)) / 100;
              const taxable = gross - disc;
              const tax = (taxable * (row.gstPct || 0)) / 100;
              const lineTotal = taxable + tax;

              return (
                <tr key={row.id} style={{ borderBottom: `1px solid ${bdr}` }}>
                  <td style={{ padding: '8px 10px' }}>
                    <input
                      type="text"
                      value={row.item}
                      onChange={(e) => updateRow(row.id, 'item', e.target.value)}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                    />
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <input
                      type="number"
                      min="1"
                      value={row.qty}
                      onChange={(e) => updateRow(row.id, 'qty', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                    />
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={row.rate}
                      onChange={(e) => updateRow(row.id, 'rate', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                    />
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={row.discountPct}
                      onChange={(e) => updateRow(row.id, 'discountPct', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                    />
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <select
                      value={row.gstPct}
                      onChange={(e) => updateRow(row.id, 'gstPct', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 13 }}
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>
                    {formatIndianCurrency(lineTotal)}
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length <= 1}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: rows.length <= 1 ? fg2 : '#ef4444',
                        cursor: rows.length <= 1 ? 'not-allowed' : 'pointer',
                        padding: 4
                      }}
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

      {/* Add Row Button & Shipping */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <button
          type="button"
          onClick={addRow}
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
          <span>Add Invoice Item Row</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: fg }}>Freight / Shipping Charges (₹):</span>
          <input
            type="number"
            min="0"
            value={shippingCharges}
            onChange={(e) => setShippingCharges(e.target.value)}
            style={{ width: 120, padding: '8px 12px', borderRadius: 6, border: `1px solid ${bdr}`, background: inputBg, color: fg, fontSize: 14, fontWeight: 700 }}
          />
        </div>
      </div>

      {/* Invoice Totals Summary Box */}
      <div style={{
        background: dk ? 'rgba(255,255,255,0.02)' : '#f8fafc',
        border: `1px solid ${bdr}`,
        borderRadius: 12,
        padding: '20px 24px',
        maxWidth: 480,
        marginLeft: 'auto',
        marginBottom: 24
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: fg2 }}>Taxable Base Subtotal:</span>
            <span style={{ fontWeight: 700 }}>{formatIndianCurrency(totals.totalTaxable)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: fg2 }}>Total GST (CGST + SGST):</span>
            <span style={{ fontWeight: 700, color: acc }}>+{formatIndianCurrency(totals.totalGst)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: fg2 }}>Freight & Logistics:</span>
            <span style={{ fontWeight: 700 }}>+{formatIndianCurrency(totals.shipping)}</span>
          </div>
          {totals.roundOff !== 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: fg2 }}>
              <span>Round Off:</span>
              <span>{totals.roundOff > 0 ? `+₹${totals.roundOff.toFixed(2)}` : `-₹${Math.abs(totals.roundOff).toFixed(2)}`}</span>
            </div>
          )}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `2px solid ${fg}`,
            paddingTop: 12,
            marginTop: 4
          }}>
            <span style={{ fontSize: 16, fontWeight: 900 }}>Grand Total:</span>
            <span style={{ fontSize: 26, fontWeight: 900, color: acc }}>
              {formatIndianCurrency(totals.roundedGrandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Words Box */}
      <div style={{ fontSize: 13, color: fg2, background: dk ? 'rgba(232,168,56,0.08)' : '#fffbeb', padding: '12px 18px', borderRadius: 8, border: `1px solid ${acc}40`, marginBottom: 20 }}>
        <strong>Amount in Words:</strong> {numberToWordsIndian(totals.roundedGrandTotal)}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleCopy}
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: acc,
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? 'Copied Details' : 'Copy Invoice Totals'}</span>
        </button>
      </div>
    </div>
  );
};
