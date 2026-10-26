// src/controllers/workCase.controller.js
import XLSX from 'xlsx';
import fs from 'fs'; // Import file system to clean up uploaded files
import WorkCase from '../models/WorkCase.model.js';

// Helper: Fuzzy find column value by searching part of the header name
const getVal = (row, keySearch) => {
  const search = keySearch.toLowerCase().replace(/[\s\n\r]+/g, ' ').trim();
  const key = Object.keys(row).find((k) => {
    const kClean = String(k).toLowerCase().replace(/[\s\n\r]+/g, ' ').trim();
    return kClean.includes(search);
  });
  return key ? row[key] : '';
};

// Helper: Parse Cost (removes commas and converts to float)
const parseCost = (val) => {
  if (!val) return 0;
  const clean = String(val).replace(/,/g, '').trim();
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};

// Helper: Parse Date (handles both Date objects and raw Excel serial numbers)
const parseDate = (val) => {
  if (!val) return '';
  
  // If it's already a JS Date object (due to cellDates: true)
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return '';
    const d = String(val.getDate()).padStart(2, '0');
    const m = String(val.getMonth() + 1).padStart(2, '0');
    const y = val.getFullYear();
    return `${d}-${m}-${y}`;
  }
  
  // If Excel sends a raw serial number (e.g., 45123)
  if (typeof val === 'number') {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(excelEpoch.getTime() + val * 86400000);
    if (isNaN(date.getTime())) return '';
    const d = String(date.getUTCDate()).padStart(2, '0');
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const y = date.getUTCFullYear();
    return `${d}-${m}-${y}`;
  }
  
  return String(val).trim();
};

// Helper: Safely convert values to string (prevents [object Object])
const safeString = (val) => {
  if (val === null || val === undefined) return '';
  return String(val).trim();
};

// Helper: Find which row index contains the actual headers
const findHeaderRow = (rawRows) => {
  for (let i = 0; i < rawRows.length; i++) {
    const rowStr = rawRows[i].join(' ').toLowerCase();
    if (rowStr.includes('dealing executive') && rowStr.includes('package')) {
      return i;
    }
  }
  return -1;
};

export const uploadWorkStatus = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const workbook = XLSX.readFile(req.file.path, { cellDates: true });
    let allRecords = [];

    // Validate required sheets exist
    if (!workbook.Sheets['Contracts'] && !workbook.Sheets['Purchase']) {
      throw new Error('Excel file must contain at least one sheet named "Contracts" or "Purchase".');
    }

    // ---------- 1. PARSE CONTRACTS SHEET ----------
    const contractSheet = workbook.Sheets['Contracts'];
    if (contractSheet) {
      const rawRows = XLSX.utils.sheet_to_json(contractSheet, { header: 1, defval: '' });
      const headerIdx = findHeaderRow(rawRows);

      if (headerIdx !== -1) {
        const headers = rawRows[headerIdx];
        const dataRows = rawRows.slice(headerIdx + 1);

        const mappedContracts = dataRows
          .map(row => {
            const obj = {};
            headers.forEach((h, i) => { if (h) obj[h] = row[i]; });
            return obj;
          })
          .filter(row => {
            const sn = getVal(row, 'S.N');
            return sn && !isNaN(parseInt(sn)); // Only keep valid data rows
          })
          .map(row => ({
            case_type: 'Contract',
            sr_no: parseInt(getVal(row, 'S.N')) || 0,
            dealing_executive: safeString(getVal(row, 'Dealing Executive')),
            pradip_ref: safeString(getVal(row, 'PR Pradip file ref')),
            tendering_ref: safeString(getVal(row, 'Tendering Process Pradip file Ref')),
            project: safeString(getVal(row, 'Project')),
            package: safeString(getVal(row, 'Package')),
            cost_estimate: parseCost(getVal(row, 'Cost Estimate')),
            mode_of_tendering: safeString(getVal(row, 'Mode Of Tendering')),
            pr_no: safeString(getVal(row, 'PR No.')),
            pr_date: parseDate(getVal(row, 'PR Recieved date')),
            critical_package: safeString(getVal(row, 'Critical Package')),
            tendering_type: safeString(getVal(row, 'Tendering type')),
            nit_date: parseDate(getVal(row, 'NIT Date')),
            technical_bod: parseDate(getVal(row, 'Technical BOD')),
            status: safeString(getVal(row, 'STATUS')),
            loi_date: parseDate(getVal(row, 'GeM Contract / LOI Date')),
            po_date: parseDate(getVal(row, 'SAP PO No/Date')),
            agency_name: safeString(getVal(row, 'Name of the agency')),
            remarks: safeString(getVal(row, 'Remarks Related to Present Status')),
          }));

        allRecords = [...allRecords, ...mappedContracts];
      }
    }

    // ---------- 2. PARSE PURCHASE SHEET ----------
    const purchaseSheet = workbook.Sheets['Purchase'];
    if (purchaseSheet) {
      const rawRows = XLSX.utils.sheet_to_json(purchaseSheet, { header: 1, defval: '' });
      const headerIdx = findHeaderRow(rawRows);

      if (headerIdx !== -1) {
        const headers = rawRows[headerIdx];
        const dataRows = rawRows.slice(headerIdx + 1);

        const mappedPurchases = dataRows
          .map(row => {
            const obj = {};
            headers.forEach((h, i) => { if (h) obj[h] = row[i]; });
            return obj;
          })
          .filter(row => {
            const sn = getVal(row, 'S.N');
            return sn && !isNaN(parseInt(sn));
          })
          .map(row => ({
            case_type: 'Purchase',
            sr_no: parseInt(getVal(row, 'S.N')) || 0,
            dealing_executive: safeString(getVal(row, 'Dealing Executive')),
            pradip_ref: safeString(getVal(row, 'Pradip file ref')),
            tendering_ref: '',
            project: safeString(getVal(row, 'Project')),
            package: safeString(getVal(row, 'Package')),
            cost_estimate: parseCost(getVal(row, 'Cost Estimate')),
            mode_of_tendering: safeString(getVal(row, 'Mode Of Tendering')),
            pr_no: safeString(getVal(row, 'PR No.')),
            pr_date: parseDate(getVal(row, 'PR Recieved date')),
            critical_package: safeString(getVal(row, 'Critical Package')),
            tendering_type: safeString(getVal(row, 'Tendering type')),
            nit_date: parseDate(getVal(row, 'NIT date')),
            technical_bod: parseDate(getVal(row, 'Technical BOD')),
            status: '',
            loi_date: parseDate(getVal(row, 'GeM Contract / LOI Date')),
            po_date: parseDate(getVal(row, 'SAP PO No/Date')),
            agency_name: safeString(getVal(row, 'Name of the agency')),
            remarks: safeString(getVal(row, 'Remarks related to preasent')), // Handles the typo in the sheet
          }));

        allRecords = [...allRecords, ...mappedPurchases];
      }
    }

    if (allRecords.length === 0) {
      return res.status(400).json({ 
        error: 'No valid data found. Please ensure the Excel file contains standard rows with "S.N" values.' 
      });
    }

    // Insert into database
    await WorkCase.truncateAndInsert(allRecords);
    
    res.status(201).json({ message: `Successfully imported ${allRecords.length} records.` });

  } catch (error) {
    console.error("Work Status Upload Error:", error);
    res.status(500).json({ error: error.message || 'Error processing Excel file' });
  
  } finally {
    // PERFORMANCE FIX: Always delete the temporary file from the server after processing
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Failed to delete temp file:", err);
      }
    }
  }
};

export const getWorkStatus = async (req, res) => {
  try {
    const { search } = req.query;
    const data = await WorkCase.findAll({ search });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};