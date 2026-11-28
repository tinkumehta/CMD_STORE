
import db from '../db.js';

const WorkCase = {
  truncateAndInsert: async (records) => {
    if (!Array.isArray(records)) {
      throw new Error('Records must be an array');
    }

    // Do not delete existing data for an empty upload.
    if (records.length === 0) {
      return 0;
    }

    const chunkSize = 100;

    // Delete and insert in one transaction.
    await db.transaction(async (trx) => {
      await trx('work_cases').del();

      for (let i = 0; i < records.length; i += chunkSize) {
        const chunk = records.slice(i, i + chunkSize);
        await trx('work_cases').insert(chunk);
      }
    });

    return records.length;
  },

  findAll: async ({ search } = {}) => {
    let query = db('work_cases').select('*');

    const keyword = String(search || '').trim();

    if (keyword) {
      const s = `%${keyword}%`;

      query = query.where(function () {
        this.where('dealing_executive', 'like', s)
          .orWhere('package', 'like', s)
          .orWhere('agency_name', 'like', s)
          .orWhere('pr_no', 'like', s);
      });
    }

    return await query.orderBy([
      { column: 'sr_no', order: 'asc' },
      { column: 'id', order: 'asc' },
    ]);
  },
};

export default WorkCase;
