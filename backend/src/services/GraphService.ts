import { getSession } from '../lib/graph.js';

export class GraphService {
  static async createIntroPath(founderName: string, contactName: string, investorName: string) {
    const session = getSession();
    try {
      const query = `
        MERGE (f:Founder {name: $founderName})
        MERGE (c:Contact {name: $contactName})
        MERGE (i:Investor {name: $investorName})
        MERGE (f)-[:KNOWS {trust: 0.9}]->(c)
        MERGE (c)-[:KNOWS {trust: 0.6}]->(i)
        RETURN f, c, i
      `;

      await session.run(query, { founderName, contactName, investorName });
      return true;
    } catch (error) {
      console.error("Neo4j Error:", error);
      throw error;
    } finally {
      await session.close();
    }
  }
}
