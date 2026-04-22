import { Pool } from 'pg';
import dotenv from 'dotenv';
import { AsyncLocalStorage } from 'async_hooks';

dotenv.config();

// This is the magic bucket that holds the tenantId for the duration of a single request
export const tenantStorage = new AsyncLocalStorage<string>();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = {
  async query(text: string, params?: any[]) {
    const tenantId = tenantStorage.getStore();
    const client = await pool.connect();
    
    try {
      // This line is why we used RLS in SQL. 
      // It tells Postgres who the current user is for THIS specific query.
      if (tenantId) {
        await client.query(`SET LOCAL app.current_tenant_id = ${client.escapeLiteral(tenantId)}`);
      }
      
      return await client.query(text, params);
    } finally {
      client.release();
    }
  }
};
