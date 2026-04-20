import { db } from '../lib/db';

export class FounderService {
  static async getMyProfile() {
    // Because of RLS, this 'SELECT *' only sees the current tenant's data.
    const res = await db.query('SELECT * FROM founders LIMIT 1');
    return res.rows[0];
  }

  static async updateProfile(name: string, bio: string, email: string) {
    const query = `
      INSERT INTO founders (full_name, bio, email, tenant_id)
      VALUES ($1, $2, $3, current_setting('app.current_tenant_id')::uuid)
      ON CONFLICT (email) DO UPDATE 
      SET full_name = EXCLUDED.full_name, bio = EXCLUDED.bio
      RETURNING *;
    `;
    const res = await db.query(query, [name, bio, email]);
    return res.rows[0];
  }
}
