import db from '../db.js';

const WorkCase = {
  truncateAndInsert: async (records) => {
    // 1. Clear existing data
    await db('work_cases').del();
    
    // 2. Insert new data in chunks (prevents packet size errors)
    if (records.length) {
      const chunkSize = 100; 
      for (let i = 0; i < records.length; i += chunkSize) {
        await db('work_cases').insert(records.slice(i, i + chunkSize));
      }
    }
  },

  findAll: async ({ search }) => {
    let query = db('work_cases').select('*');

    if (search) {
      const s = `%${search}%`;
      query = query.where(function() {
        this.where('dealing_executive', 'like', s)
          .orWhere('package', 'like', s)
          .orWhere('agency_name', 'like', s)
          .orWhere('pr_no', 'like', s);
      });
    }

    // Order by Sr No, then by ID for consistent pagination
    return await query.orderBy([
      { column: 'sr_no', order: 'asc' },
      { column: 'id', order: 'asc' }
    ]);
  }
};

export default WorkCase;