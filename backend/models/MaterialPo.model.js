// src/models/MaterialPo.model.js
import db from '../db.js';

const MaterialPo = {
  // Upsert in chunks; keeps existing rows and only touches what you upload
  insertMany: async (records) => {
    if (!records.length) return 0;
    const chunkSize = 100;
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      await db('material_pos')
        .insert(chunk)
        .onConflict(['po_number', 'item_no'])
        .merge();
    }
    return records.length;
  },

  findAll: async ({ search, page = 1, limit = 50 }) => {
    let query = db('material_pos').select('*');

    if (search) {
      const s = `%${search}%`;
      query = query.where(function () {
        this.where('po_number', 'like', s)
          .orWhere('supplier_name', 'like', s)
          .orWhere('material_code', 'like', s)
          .orWhere('short_text', 'like', s);
      });
    }

    const totalResult = await query.clone().count('id as total');
    const total = parseInt(totalResult[0].total, 10);

    const data = await query
      .orderBy('po_date', 'desc')
      .offset((page - 1) * limit)
      .limit(limit);

    return { data, total };
  },

  getStats: async () => {
    const [row] = await db('material_pos')
      .count('id as items')
      .sum('net_order_value as total_value')
      .countDistinct('po_number as pos');
    return {
      items: Number(row.items) || 0,
      total_value: Number(row.total_value) || 0,
      distinct_pos: Number(row.pos) || 0,
    };
  },

  // Add this inside your MaterialPo object in src/models/MaterialPo.model.js
  getDeliveryStats: async () => {
    // 1. Aggregate by PO first (since one PO can have multiple items)
    const pos = await db('material_pos')
      .select('po_number')
      .sum('net_order_value as total_value')
      .sum('pending_delivery_value as pending_value')
      .groupBy('po_number');

    let fully_received = { count: 0, value: 0 };
    let partially_received = { count: 0, value: 0 };
    let not_received = { count: 0, value: 0 };
    
    let total_received_value = 0;
    let total_pending_value = 0;

    pos.forEach(po => {
      const total = Number(po.total_value) || 0;
      const pending = Number(po.pending_value) || 0;
      const delivered = total - pending;

      total_received_value += delivered;
      total_pending_value += pending;

      if (pending <= 1) { 
        // Fully received
        fully_received.count++;
        fully_received.value += total;
      } else if (delivered <= 1) {
        // Not received at all
        not_received.count++;
        not_received.value += total;
      } else {
        // Partially received
        partially_received.count++;
        partially_received.value += total;
      }
    });

    return { fully_received, partially_received, not_received, total_received_value, total_pending_value };
  }
};

export default MaterialPo;