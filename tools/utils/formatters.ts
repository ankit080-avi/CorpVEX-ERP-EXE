// Formatting utilities for Free Tools (Indian Numbering & Calculations)

export function formatIndianCurrency(num: number | string, includeSymbol = true): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return includeSymbol ? '₹0.00' : '0.00';
  
  const isNegative = n < 0;
  const absN = Math.abs(n);
  const parts = absN.toFixed(2).split('.');
  let intPart = parts[0];
  const decPart = parts[1];

  // Indian format: last 3 digits, then groups of 2
  if (intPart.length > 3) {
    const lastThree = intPart.substring(intPart.length - 3);
    const otherNumbers = intPart.substring(0, intPart.length - 3);
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    intPart = formatted;
  }

  const result = `${intPart}.${decPart}`;
  return `${isNegative ? '-' : ''}${includeSymbol ? '₹' : ''}${result}`;
}

export function formatNumber(num: number | string, decimals = 2): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '0';
  return n.toLocaleString('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0
  });
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

// Single-digit & teens words
const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertThreeDigits(num: number): string {
  let str = '';
  if (num >= 100) {
    str += ONES[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  if (num >= 20) {
    str += TENS[Math.floor(num / 10)] + ' ';
    num %= 10;
  }
  if (num > 0) {
    str += ONES[num] + ' ';
  }
  return str.trim();
}

/**
 * Convert number to words using the Indian numbering system (Crores, Lakhs, Thousands, Hundreds)
 */
export function numberToWordsIndian(num: number, currency = 'Rupees', subCurrency = 'Paise'): string {
  if (isNaN(num)) return '';
  if (num === 0) return `Zero ${currency} Only`;

  let isNegative = false;
  if (num < 0) {
    isNegative = true;
    num = Math.abs(num);
  }

  // Split integer and decimal
  const parts = num.toFixed(2).split('.');
  let intVal = parseInt(parts[0], 10);
  const decVal = parseInt(parts[1], 10);

  if (intVal === 0 && decVal === 0) return `Zero ${currency} Only`;

  let words = '';

  const crore = Math.floor(intVal / 10000000);
  intVal %= 10000000;

  const lakh = Math.floor(intVal / 100000);
  intVal %= 100000;

  const thousand = Math.floor(intVal / 1000);
  intVal %= 1000;

  const hundred = Math.floor(intVal / 100);
  intVal %= 100;

  const rest = intVal;

  if (crore > 0) {
    words += convertThreeDigits(crore) + ' Crore ';
  }
  if (lakh > 0) {
    words += convertThreeDigits(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    words += convertThreeDigits(thousand) + ' Thousand ';
  }
  if (hundred > 0) {
    words += convertThreeDigits(hundred) + ' Hundred ';
  }
  if (rest > 0) {
    if (words !== '') words += 'and ';
    words += convertThreeDigits(rest) + ' ';
  }

  words = words.trim();
  if (words) {
    words = `${words} ${currency}`;
  }

  if (decVal > 0) {
    const decWords = convertThreeDigits(decVal);
    if (words) {
      words += ` and ${decWords} ${subCurrency}`;
    } else {
      words = `${decWords} ${subCurrency}`;
    }
  }

  return `${isNegative ? 'Minus ' : ''}${words.trim()} Only`;
}

/**
 * Convert number to words in International / Western system (Billions, Millions, Thousands)
 */
export function numberToWordsInternational(num: number, currency = 'Dollars', subCurrency = 'Cents'): string {
  if (isNaN(num)) return '';
  if (num === 0) return `Zero ${currency} Only`;

  let isNegative = false;
  if (num < 0) {
    isNegative = true;
    num = Math.abs(num);
  }

  const parts = num.toFixed(2).split('.');
  let intVal = parseInt(parts[0], 10);
  const decVal = parseInt(parts[1], 10);

  if (intVal === 0 && decVal === 0) return `Zero ${currency} Only`;

  const scaleWords = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
  const chunks: number[] = [];

  while (intVal > 0) {
    chunks.push(intVal % 1000);
    intVal = Math.floor(intVal / 1000);
  }

  let words = '';
  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i];
    if (chunk > 0) {
      const chunkStr = convertThreeDigits(chunk);
      words += chunkStr + (scaleWords[i] ? ' ' + scaleWords[i] : '') + ' ';
    }
  }

  words = words.trim();
  if (words) {
    words = `${words} ${currency}`;
  }

  if (decVal > 0) {
    const decWords = convertThreeDigits(decVal);
    if (words) {
      words += ` and ${decWords} ${subCurrency}`;
    } else {
      words = `${decWords} ${subCurrency}`;
    }
  }

  return `${isNegative ? 'Minus ' : ''}${words.trim()} Only`;
}
