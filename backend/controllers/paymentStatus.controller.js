// src/controllers/paymentStatus.controller.js
import fs from 'fs';
import PaymentStatus from '../models/PaymentStatus.model.js';
import {
  readSheetObjects,
  getVal,
  safeString,
  parseNum,
  parseInt2,
  toDateISO,
} from '../utils/xlsxHelpers.js';

export const uploadPaymentStatuses = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const rows = readSheetObjects(req.file.path);
    if (!rows.length) {
      return res.status(400).json({ error: 'No data rows found in file' });
    }

    const unique = new Map(); // document_number -> record
    let skipped = 0;

    for (const row of rows) {
      const document_number = safeString(getVal(row, 'Document Number'));
      const po_number = safeString(getVal(row, 'Purchasing Document'));

      // Blank rows and the trailing block that only holds PO numbers -> skipped
      if (!document_number || !po_number) {
        skipped++;
        continue;
      }

      const rec = {
        document_number,
        po_number,
        po_document_date: toDateISO(getVal(row, 'PO Document Date')),
        vendor_name: safeString(getVal(row, 'Name')), // header is literally "Name"
        invoice_reference: safeString(getVal(row, 'Reference')),
        gross_invoice_amount: parseNum(getVal(row, 'Gross Invoice Amount')),
        document_status: safeString(getVal(row, 'Document Status')), // 'Blocked'
        posting_date: toDateISO(getVal(row, 'Posting Date')),
        fiscal_year: parseInt2(getVal(row, 'Fiscal Year')),
      };

      unique.set(rec.document_number, rec);
    }

    const records = [...unique.values()];
    if (!records.length) {
      return res.status(400).json({
        error:
          'No valid rows found. The file must contain "Document Number" and "Purchasing Document" columns.',
      });
    }

    const saved = await PaymentStatus.insertMany(records);

    res.status(201).json({
      message: `Imported ${saved} payment rows (skipped ${skipped} empty rows).`,
      summary: { totalRows: rows.length, saved, skipped },
    });
  } catch (error) {
    console.error('Payment Status Upload Error:', error);
    res.status(500).json({ error: error.message || 'Error processing Excel file' });
  } finally {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }
    }
  }
};

export const getPaymentStatuses = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    const p = parseInt(page, 10) || 1;
    const l = parseInt(limit, 10) || 50;
    const result = await PaymentStatus.findAll({ search, page: p, limit: l });
    res.json({ data: result.data, total: result.total, page: p, limit: l });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentStatusStats = async (req, res) => {
  try {
    res.json(await PaymentStatus.getStats());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add this export
export const getPaymentWorkflowStats = async (req, res) => {
  try {
    const baseStats = await PaymentStatus.getStats();
    const breakdown = await PaymentStatus.getPaymentBreakdown();
    res.json({ ...baseStats, ...breakdown });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};