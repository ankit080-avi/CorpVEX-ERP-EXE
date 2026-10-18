import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Info, Copy, Check, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../../utils/formatters';

const STATE_CODES: Record<string, string> = {
  '01': 'Jammu & Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab', '04': 'Chandigarh',
  '05': 'Uttarakhand', '06': 'Haryana', '07': 'Delhi', '08': 'Rajasthan',
  '09': 'Uttar Pradesh', '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh',
  '13': 'Nagaland', '14': 'Manipur', '15': 'Mizoram', '16': 'Tripura',
  '17': 'Meghalaya', '18': 'Assam', '19': 'West Bengal', '20': 'Jharkhand',
  '21': 'Odisha', '22': 'Chhattisgarh', '23': 'Madhya Pradesh', '24': 'Gujarat',
  '25': 'Daman & Diu', '26': 'Dadra & Nagar Haveli', '27': 'Maharashtra', '28': 'Andhra Pradesh (Old)',
  '29': 'Karnataka', '30': 'Goa', '31': 'Lakshadweep', '32': 'Kerala',
  '33': 'Tamil Nadu', '34': 'Puducherry', '35': 'Andaman & Nicobar Islands', '36': 'Telangana',
  '37': 'Andhra Pradesh (New)', '38': 'Ladakh', '97': 'Other Territory', '99': 'Centre Jurisdiction'
};

const ENTITY_TYPES: Record<string, string> = {
  'C': 'Company (Pvt Ltd / Public Ltd)',
  'P': 'Individual / Proprietorship',
  'H': 'Hindu Undivided Family (HUF)',
  'F': 'Partnership Firm / LLP',
  'A': 'Association of Persons (AOP)',
  'T': 'Trust',
  'B': 'Body of Individuals (BOI)',
  'L': 'Local Authority',
  'J': 'Artificial Juridical Person',
  'G': 'Government Agency'
};

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function validateGstinChecksum(gstin: string): { isValidChecksum: boolean; expectedChar: string } {
  if (gstin.length !== 15) return { isValidChecksum: false, expectedChar: '' };

  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const charIndex = CHARS.indexOf(gstin[i]);
    if (charIndex === -1) return { isValidChecksum: false, expectedChar: '' };

    const multiplier = (i % 2 === 0) ? 1 : 2;
    const product = charIndex * multiplier;
    const quotient = Math.floor(product / 36);
    const remainder = product % 36;
    sum += quotient + remainder;
  }

  const checkIndex = (36 - (sum % 36)) % 36;
  const expectedChar = CHARS[checkIndex];
  return {
    isValidChecksum: expectedChar === gstin[14],
    expectedChar
  };
}

export const GstinValidator: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [gstinInput, setGstinInput] = useState('24AAACC1206F1ZT');
  const [copied, setCopied] = useState(false);

  const dk = theme === 'dark';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#64748b';
  const bdr = dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const acc = dk ? '#e8a838' : '#d97706';
  const inputBg = dk ? '#151f30' : '#f8fafc';

  const cleanGstin = gstinInput.trim().toUpperCase();

  // 1. Structure validation
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const isFormatValid = regex.test(cleanGstin);

  // 2. State validation
  const stateCode = cleanGstin.substring(0, 2);
  const stateName = STATE_CODES[stateCode] || null;

  // 3. PAN validation
  const pan = cleanGstin.length >= 12 ? cleanGstin.substring(2, 12) : '';
  const entityChar = pan.length >= 4 ? pan[3] : '';
  const entityType = ENTITY_TYPES[entityChar] || 'Standard Entity';

  // 4. Checksum
  const checksumResult = cleanGstin.length === 15 ? validateGstinChecksum(cleanGstin) : { isValidChecksum: false, expectedChar: '' };

  const isOverallValid = isFormatValid && Boolean(stateName) && checksumResult.isValidChecksum;

  return (
    <div>
      {/* Input */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: fg, marginBottom: 8 }}>
          Enter 15-Digit GSTIN to Validate
        </label>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            maxLength={15}
            value={gstinInput}
            onChange={(e) => setGstinInput(e.target.value.toUpperCase())}
            placeholder="e.g. 24AAACC1206F1ZT"
            style={{
              flex: 1,
              minWidth: 260,
              padding: '14px 16px',
              borderRadius: 8,
              border: `1px solid ${bdr}`,
              background: inputBg,
              color: fg,
              fontSize: 18,
              fontFamily: 'monospace',
              fontWeight: 800,
              letterSpacing: '0.08em',
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={() => setGstinInput('')}
            type="button"
            style={{
              padding: '12px 18px',
              borderRadius: 8,
              border: `1px solid ${bdr}`,
              background: dk ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
              color: fg,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>
        <div style={{ fontSize: 12, color: fg2, marginTop: 6 }}>
          Input format: 2 State Digits + 10 PAN Characters + 1 Entity Number + 'Z' + 1 Check Digit
        </div>
      </div>

      {/* Primary Verification Result Box */}
      <div style={{
        padding: '20px 24px',
        borderRadius: 12,
        background: isOverallValid
          ? (dk ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5')
          : cleanGstin.length === 15
            ? (dk ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2')
            : (dk ? 'rgba(232, 168, 56, 0.1)' : '#fffbeb'),
        border: `1px solid ${
          isOverallValid
            ? '#10b981'
            : cleanGstin.length === 15
              ? '#ef4444'
              : acc
        }`,
        marginBottom: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isOverallValid ? (
            <CheckCircle2 size={28} color="#10b981" />
          ) : (
            <AlertCircle size={28} color={cleanGstin.length === 15 ? '#ef4444' : acc} />
          )}
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: fg }}>
              {isOverallValid
                ? 'Valid GSTIN Structure & Luhn Checksum'
                : cleanGstin.length === 15
                  ? 'Invalid GSTIN Format or Checksum Failed'
                  : `Incomplete GSTIN (${cleanGstin.length}/15 digits)`}
            </div>
            <div style={{ fontSize: 13, color: fg2, marginTop: 2 }}>
              {isOverallValid
                ? 'Syntactical structure, State jurisdiction code, and mathematical check digit verified successfully.'
                : cleanGstin.length === 15
                  ? (!isFormatValid ? 'Format does not match standard 15-character GST pattern.' : `Checksum mismatch: expected '${checksumResult.expectedChar}', found '${cleanGstin[14]}'.`)
                  : 'Please enter all 15 characters of the GSTIN to run structure and checksum validation.'}
            </div>
          </div>
        </div>
      </div>

      {/* Disclosed Structure Breakdown */}
      {cleanGstin.length >= 2 && (
        <div style={{ background: dk ? 'rgba(255,255,255,0.02)' : '#ffffff', border: `1px solid ${bdr}`, borderRadius: 12, padding: 22, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: fg2, textTransform: 'uppercase', marginBottom: 16 }}>
            Decoded GSTIN Attributes
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: fg2, fontWeight: 600 }}>State Jurisdiction</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: stateName ? fg : '#ef4444' }}>
                {stateName ? `${stateName} (${stateCode})` : `Invalid State Code (${stateCode})`}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: fg2, fontWeight: 600 }}>Extracted PAN</div>
              <div style={{ fontSize: 15, fontWeight: 800, fontFamily: 'monospace' }}>
                {pan || '—'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: fg2, fontWeight: 600 }}>Constitution of Business</div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>
                {entityType}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: fg2, fontWeight: 600 }}>Entity Sequence & Check Digit</div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>
                Entity #{cleanGstin[12] || '—'} • Check: {cleanGstin[14] || '—'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance & API Notice (Crucial standard requirement) */}
      <div style={{
        background: dk ? 'rgba(0,0,0,0.3)' : '#f8fafc',
        border: `1px solid ${bdr}`,
        borderRadius: 8,
        padding: '14px 18px',
        fontSize: 12.5,
        color: fg2,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        lineHeight: 1.55
      }}>
        <Info size={16} color={acc} style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <strong style={{ color: fg }}>Format / Checksum Validation vs. Live Government Verification:</strong>
          <br />
          This client-side tool validates the alphanumeric layout, PAN structure, and official Modulo-36 check digit without sending your data to any remote server. It does not query the live GSTN portal to verify active filing status, taxpayer trade name, or cancellation dates (which requires an authorized GSP/API session).
        </div>
      </div>
    </div>
  );
};
