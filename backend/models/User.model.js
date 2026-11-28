
import db from '../db.js';

const User = {
  findByUsername: async (username) => {
    return await db('users')
      .whereRaw('LOWER(username) = LOWER(?)', [
        String(username).trim(),
      ])
      .first();
  },

  create: async (username, passwordHash, role = 'user') => {
    const [insertId] = await db('users').insert({
      username: String(username).trim(),
      password_hash: passwordHash,
      role,
    });

    return await db('users')
      .select('id', 'username', 'role')
      .where({ id: insertId })
      .first();
  },

  findById: async (id) => {
    return await db('users')
      .where({ id })
      .first();
  },
};

export default User;
