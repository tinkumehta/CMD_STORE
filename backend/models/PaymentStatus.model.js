// src/models/PaymentStatus.model.js
import db from '../db.js';

const PaymentStatus = {
  insertMany: async (records) => {
    if (!records.length) return 0;
    const chunkSize = 100;
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      await db('payment_statuses')
        .insert(chunk)
        .onConflict(['document_number'])
        .merge();
    }
    return records.length;
  },

  findAll: async ({ search, page = 1, limit = 50 }) => {
    let query = db('payment_statuses').select('*');

    if (search) {
      const s = `%${search}%`;
      query = query.where(function () {
        this.where('document_number', 'like', s)
          .orWhere('po_number', 'like', s)
          .orWhere('vendor_name', 'like', s)
          .orWhere('invoice_reference', 'like', s);
      });
    }

    const totalResult = await query.clone().count('document_number as total');
    const total = parseInt(totalResult[0].total, 10);

    const data = await query
      .orderBy('posting_date', 'desc')
      .offset((page - 1) * limit)
      .limit(limit);

    return { data, total };
  },

  getStats: async () => {
    const [row] = await db('payment_statuses')
      .count('document_number as documents')
      .sum('gross_invoice_amount as total_invoiced');
    return {
      documents: Number(row.documents) || 0,
      total_invoiced: Number(row.total_invoiced) || 0,
    };
  },

  
   getPaymentBreakdown: async () => {
    // Get all payment statuses
    const stats = await db('payment_statuses')
      .select('document_status')
      .count('document_number as count')
      .sum('gross_invoice_amount as value')
      .groupBy('document_status');

    let blocked = { count: 0, value: 0 };
    let paid = { count: 0, value: 0 };

    stats.forEach(s => {
      const status = String(s.document_status || '').toLowerCase();
      const count = Number(s.count) || 0;
      const value = Number(s.value) || 0;

      // "Blocked" usually means it's stuck in audit/clearance
      if (status.includes('block') || status.includes('process')) {
        blocked.count += count;
        blocked.value += value;
      } else {
        paid.count += count;
        paid.value += value;
      }
    });

    return { blocked, paid };
  },

  // NEW: Get list of POs that have payments to show the user
  getPaymentPoList: async () => {
    const list = await db('payment_statuses')
      .select('po_number')
      .sum('gross_invoice_amount as total_invoiced')
      .groupBy('po_number')
      .limit(10); // Limit to 10 for the dashboard preview
    return list;
  }
};

export default PaymentStatus;