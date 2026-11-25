// src/utils/xlsxHelpers.js
import XLSX from 'xlsx';

export const normKey = (s) =>
  String(s || '').toLowerCase().replace(/[\s\n\r]+/g, ' ').trim();

/** Exact normalized match first, then "contains" fallback. Supports multiple aliases. */
export const getVal = (row, ...aliases) => {
  const targets = aliases.map(normKey);
  let key = Object.keys(row).find((k) => targets.includes(normKey(k)));
  if (key) return row[key];
  key = Object.keys(row).find((k) => {
    const n = normKey(k);
    return targets.some((t) => n.includes(t));
  });
  return key ? row[key] : '';
};

export const safeString = (v) => {
  if (v === null || v === undefined) return null;
  const s = String(v).replace(/\s+/g, ' ').trim();
  return s === '' ? null : s;
};

/** "1186239    BHUSHAN SALES" -> "BHUSHAN SALES" */
export const cleanSupplier = (v) => {
  const s = safeString(v);
  if (!s) return null;
  return s.replace(/^\d{4,}\s+/, '').trim() || s;
};

export const parseNum = (v) => {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ''));
  return isFinite(n) ? n : 0;
};

export const parseInt2 = (v) => {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number') return Math.trunc(v);
  const n = parseInt(String(v).replace(/[^0-9\-]/g, ''), 10);
  return isNaN(n) ? null : n;
};

const pad2 = (n) => String(n).padStart(2, '0');

/** Always returns MySQL-ready 'YYYY-MM-DD' (or null). Safe with cellDates: true or raw serial. */
export const toDateISO = (v) => {
  if (v === null || v === undefined || v === '') return null;
  if (v instanceof Date && !isNaN(v)) {
    return `${v.getFullYear()}-${pad2(v.getMonth() + 1)}-${pad2(v.getDate())}`;
  }
  if (typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v);
    return d && d.y ? `${d.y}-${pad2(d.m)}-${pad2(d.d)}` : null;
  }
  const s = String(v).trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${pad2(m[2])}-${pad2(m[3])}`;
  m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (m) return `${m[3]}-${pad2(m[2])}-${pad2(m[1])}`;
  const d = new Date(s);
  return isNaN(d) ? null : `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

/** Read first sheet of an xlsx file from disk into array-of-objects. */
export const readSheetObjects = (filePath) => {
  const wb = XLSX.readFile(filePath, { cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: '' });
};