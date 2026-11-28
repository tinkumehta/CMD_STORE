
import db from '../db.js';

const PurchaseOrder = {
  findAll: async ({ page = 1, limit = 50, enqType, search }) => {
    const offset = (page - 1) * limit;

    let query = db('purchase_orders').select('*');

    if (enqType) {
      query = query.where('enq_type', enqType);
    }

    if (search) {
      query = query.where(function () {
        this.where('po_no', 'like', `%${search}%`)
          .orWhere('agency', 'like', `%${search}%`)
          .orWhere('name_of_work', 'like', `%${search}%`);
      });
    }

    // FIX: Remove SELECT * before COUNT
    const totalResult = await query.clone()
      .clearSelect()
      .count({ total: 'id' });

    const total = Number(totalResult[0].total) || 0;

    // Fetch actual records
    const data = await query
      .orderBy('date', 'desc')
      .offset(offset)
      .limit(limit);

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  },

  getEnqTypeStats: async () => {
    return await db('purchase_orders')
      .select('enq_type')
      .count('* as count')
      .groupBy('enq_type')
      .orderBy('count', 'desc');
  },

  truncateAndInsert: async (records) => {
    if (!records.length) return;

    await db('purchase_orders').del();
    await db('purchase_orders').insert(records);
  },

  update: async (id, data) => {
    const existing = await db('purchase_orders')
      .where({ id })
      .first();

    if (!existing) return null;

    await db('purchase_orders')
      .where({ id })
      .update(data);

    return await db('purchase_orders')
      .where({ id })
      .first();
  },

  delete: async (id) => {
    const deleted = await db('purchase_orders')
      .where({ id })
      .del();

    return deleted > 0;
  },
};

export default PurchaseOrder;
