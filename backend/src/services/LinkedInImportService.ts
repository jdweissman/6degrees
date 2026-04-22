import multer from 'multer';
import { parse } from 'csv-parse/sync';
import { db } from '../lib/db.js';

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

export const uploadMiddleware = upload.single('connections');

interface LinkedInConnection {
  name: string;
  email: string;
  company: string;
  position: string;
  linkedin_url: string;
  connection_degree: string;
}

export class LinkedInImportService {
  /**
   * Parse LinkedIn CSV export and return structured connections
   * LinkedIn exports have columns: First Name, Last Name, Email Address, Company, Position, Connected On
   */
  static parseCSV(csvContent: string): LinkedInConnection[] {
    try {
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true
      });

      return records.map((record: any) => {
        // Handle different LinkedIn export formats
        const firstName = record['First Name'] || record['firstName'] || '';
        const lastName = record['Last Name'] || record['lastName'] || '';
        const email = record['Email Address'] || record['emailAddress'] || '';
        const company = record['Company'] || record['companyName'] || '';
        const position = record['Position'] || record['position'] || '';
        const linkedinUrl = record['Linkedin URL'] || record['linkedinUrl'] || '';
        const connectedOn = record['Connected On'] || record['connectedOn'] || '';

        return {
          name: `${firstName} ${lastName}`.trim(),
          email: email || '',
          company: company || '',
          position: position || '',
          linkedin_url: linkedinUrl || '',
          connection_degree: '1st' // LinkedIn exports are always 1st degree connections
        };
      }).filter(conn => conn.name); // Filter out empty rows
    } catch (error: any) {
      throw new Error(`CSV parsing failed: ${error.message}`);
    }
  }

  /**
   * Import connections into database
   */
  static async importConnections(tenantId: string, connections: LinkedInConnection[]) {
    const inserted = [];
    
    for (const conn of connections) {
      try {
        const result = await db.query(
          `INSERT INTO linkedin_connections (tenant_id, name, email, company, position, linkedin_url, connection_degree)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT DO NOTHING
           RETURNING *`,
          [tenantId, conn.name, conn.email, conn.company, conn.position, conn.linkedin_url, conn.connection_degree]
        );
        
        if (result.rows.length > 0) {
          inserted.push(result.rows[0]);
        }
      } catch (error: any) {
        console.error(`Failed to import connection ${conn.name}:`, error.message);
      }
    }

    return {
      total: connections.length,
      imported: inserted.length,
      duplicates: connections.length - inserted.length
    };
  }

  /**
   * Get connections filtered by company or keyword
   */
  static async getConnections(tenantId: string, filters?: { company?: string; search?: string }) {
    let query = 'SELECT * FROM linkedin_connections WHERE tenant_id = $1';
    const params: any[] = [tenantId];
    let paramIndex = 2;

    if (filters?.company) {
      query += ` AND LOWER(company) LIKE LOWER($${paramIndex})`;
      params.push(`%${filters.company}%`);
      paramIndex++;
    }

    if (filters?.search) {
      query += ` AND (LOWER(name) LIKE LOWER($${paramIndex}) OR LOWER(company) LIKE LOWER($${paramIndex}))`;
      params.push(`%${filters.search}%`);
    }

    query += ' ORDER BY name ASC';

    const result = await db.query(query, params);
    return result.rows;
  }

  /**
   * Find mutual connections between user and a target company/person
   */
  static async findPathToTarget(tenantId: string, targetCompany: string) {
    // Find connections who work at or have worked at the target company
    const result = await db.query(
      `SELECT * FROM linkedin_connections 
       WHERE tenant_id = $1 AND LOWER(company) LIKE LOWER($2)
       ORDER BY name ASC`,
      [tenantId, `%${targetCompany}%`]
    );

    return result.rows;
  }

  /**
   * Get connection statistics
   */
  static async getStats(tenantId: string) {
    const result = await db.query(
      `SELECT 
         COUNT(*) as total_connections,
         COUNT(DISTINCT LOWER(company)) as unique_companies,
         COUNT(DISTINCT LOWER(SPLIT_PART(company, ' ', 1))) as unique_industries
       FROM linkedin_connections 
       WHERE tenant_id = $1`,
      [tenantId]
    );

    return result.rows[0];
  }
}
