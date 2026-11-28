
import db from '../db.js';

const MaterialPo = {
  // Insert or update records in batches
  insertMany: async (records) => {
    if (!Array.isArray(records) || records.length === 0) {
      return 0;
    }

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

  // Get material POs with search and pagination
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

    let query = db('material_pos').select('*');

    if (search && String(search).trim()) {
      const s = `%${String(search).trim()}%`;

      query = query.where(function () {
        this.where('po_number', 'like', s)
          .orWhere('supplier_name', 'like', s)
          .orWhere('material_code', 'like', s)
          .orWhere('short_text', 'like', s);
      });
    }

    // FIX: Remove SELECT * before COUNT
    const totalResult = await query.clone()
      .clearSelect()
      .count({ total: 'id' });

    const total = Number(totalResult[0].total) || 0;

    // Fetch paginated records
    const data = await query
      .orderBy('po_date', 'desc')
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

  // Material PO summary statistics
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

  // Delivery statistics grouped by purchase order
  getDeliveryStats: async () => {
    const pos = await db('material_pos')
      .select('po_number')
      .sum('net_order_value as total_value')
      .sum('pending_delivery_value as pending_value')
      .groupBy('po_number');

    const fully_received = { count: 0, value: 0 };
    const partially_received = { count: 0, value: 0 };
    const not_received = { count: 0, value: 0 };

    let total_received_value = 0;
    let total_pending_value = 0;

    pos.forEach((po) => {
      const total = Number(po.total_value) || 0;
      const pending = Number(po.pending_value) || 0;

      // Avoid negative delivered amounts from invalid pending values
      const delivered = Math.max(0, total - pending);

      total_received_value += delivered;
      total_pending_value += pending;

      if (pending <= 1) {
        fully_received.count++;
        fully_received.value += total;
      } else if (delivered <= 1) {
        not_received.count++;
        not_received.value += total;
      } else {
        partially_received.count++;
        partially_received.value += total;
      }
    });

    return {
      fully_received,
      partially_received,
      not_received,
      total_received_value,
      total_pending_value,
    };
  },
};

export default MaterialPo;
