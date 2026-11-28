
import db from '../db.js';

const PaymentStatus = {
  // Insert or update payment records in batches
  insertMany: async (records) => {
    if (!Array.isArray(records) || records.length === 0) {
      return 0;
    }

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

  // Get payment records with search and pagination
  findAll: async ({
    search = '',
    page = 1,
    limit = 50,
  } = {}) => {
    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit = Math.min(
      200,
      Math.max(1, parseInt(limit, 10) || 50)
    );

    const offset = (currentPage - 1) * pageLimit;

    let query = db('payment_statuses').select('*');

    if (search && String(search).trim()) {
      const s = `%${String(search).trim()}%`;

      query = query.where(function () {
        this.where('document_number', 'like', s)
          .orWhere('po_number', 'like', s)
          .orWhere('vendor_name', 'like', s)
          .orWhere('invoice_reference', 'like', s);
      });
    }

    // FIX: Remove SELECT * before COUNT
    const totalResult = await query.clone()
      .clearSelect()
      .count({ total: 'document_number' });

    const total = Number(totalResult[0].total) || 0;

    // Fetch paginated records
    const data = await query
      .orderBy('posting_date', 'desc')
      .offset(offset)
      .limit(pageLimit);

    return {
      data,
      total,
      page: currentPage,
      limit: pageLimit,
      totalPages: Math.ceil(total / pageLimit),
    };
  },

  // Overall payment statistics
  getStats: async () => {
    const [row] = await db('payment_statuses')
      .count('document_number as documents')
      .sum('gross_invoice_amount as total_invoiced');

    return {
      documents: Number(row.documents) || 0,
      total_invoiced: Number(row.total_invoiced) || 0,
    };
  },

  // Payment breakdown: blocked and paid
  getPaymentBreakdown: async () => {
    const stats = await db('payment_statuses')
      .select('document_status')
      .count('document_number as count')
      .sum('gross_invoice_amount as value')
      .groupBy('document_status');

    const blocked = { count: 0, value: 0 };
    const paid = { count: 0, value: 0 };

    stats.forEach((s) => {
      const status = String(s.document_status || '').toLowerCase();
      const count = Number(s.count) || 0;
      const value = Number(s.value) || 0;

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

  // List payment POs for dashboard preview
  getPaymentPoList: async () => {
    return await db('payment_statuses')
      .select('po_number')
      .sum('gross_invoice_amount as total_invoiced')
      .groupBy('po_number')
      .orderBy('po_number', 'asc')
      .limit(10);
  },
};

export default PaymentStatus;
