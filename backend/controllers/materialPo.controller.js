// src/controllers/materialPo.controller.js
import fs from 'fs';
import MaterialPo from '../models/MaterialPo.model.js';
import {
  readSheetObjects,
  getVal,
  safeString,
  cleanSupplier,
  parseNum,
  parseInt2,
  toDateISO,
} from '../utils/xlsxHelpers.js';

export const uploadMaterialPos = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const rows = readSheetObjects(req.file.path);
    if (!rows.length) {
      return res.status(400).json({ error: 'No data rows found in file' });
    }

    const unique = new Map(); // (po|item) -> record  (dedupe inside the file)
    let skipped = 0;

    for (const row of rows) {
      const po_number = safeString(getVal(row, 'Purchasing Document'));
      const item_no = parseInt2(getVal(row, 'Item'));

      // Blank rows + the trailing "=SUM(...)" row land here -> skipped
      if (!po_number || item_no === null) {
        skipped++;
        continue;
      }

      const rec = {
        po_number,
        item_no,
        plant: safeString(getVal(row, 'Plant')),
        material_code: safeString(getVal(row, 'Material')),
        short_text: safeString(getVal(row, 'Short Text')),
        po_date: toDateISO(getVal(row, 'Document Date')),
        supplier_name: cleanSupplier(
          getVal(row, 'Supplier/Supplying Plant', 'Supplier/Supplying Plant', 'Supplier')
        ),
        order_qty: parseNum(getVal(row, 'Order Quantity')),
        net_order_value: parseNum(getVal(row, 'Net Order Value')),
        pending_delivery_value: parseNum(
          getVal(row, 'Still to be delivered (value)', 'Still to be delivered')
        ),
        pending_invoice_value: parseNum(
          getVal(row, 'Still to be invoiced (val.)', 'Still to be invoiced')
        ),
      };

      unique.set(`${rec.po_number}|${rec.item_no}`, rec);
    }

    const records = [...unique.values()];
    if (!records.length) {
      return res.status(400).json({
        error: 'No valid rows found. The file must contain "Purchasing Document" and "Item" columns.',
      });
    }

    const saved = await MaterialPo.insertMany(records);

    res.status(201).json({
      message: `Imported ${saved} Material PO items (skipped ${skipped} empty/total rows).`,
      summary: { totalRows: rows.length, saved, skipped },
    });
  } catch (error) {
    console.error('Material PO Upload Error:', error);
    res.status(500).json({ error: error.message || 'Error processing Excel file' });
  } finally {
    // match your existing cleanup pattern
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }
    }
  }
};

export const getMaterialPos = async (req, res) => {
  try {
    const { search, page, limit } = req.query;
    const p = parseInt(page, 10) || 1;
    const l = parseInt(limit, 10) || 50;
    const result = await MaterialPo.findAll({ search, page: p, limit: l });
    res.json({ data: result.data, total: result.total, page: p, limit: l });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMaterialPoStats = async (req, res) => {
  try {
    res.json(await MaterialPo.getStats());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add this export
export const getMaterialPoWorkflowStats = async (req, res) => {
  try {
    const baseStats = await MaterialPo.getStats();
    const deliveryStats = await MaterialPo.getDeliveryStats();
    res.json({ ...baseStats, ...deliveryStats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};