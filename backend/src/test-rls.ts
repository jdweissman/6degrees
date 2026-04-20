import { tenantStorage, db } from './lib/db.js'; // MUST BE .js
import { GraphService } from './services/GraphService.js'; // MUST BE .js

async function test() {
  try {
    console.log("🛠️  Phase 1: Testing Postgres...");
    const tenantA = '00000000-0000-0000-0000-000000000001';
    
    await tenantStorage.run(tenantA, async () => {
      await db.query(
        "INSERT INTO founders (full_name, email, tenant_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
        ["Jesse Adams", "jesse@6dp.ai", tenantA]
      );
      const res = await db.query("SELECT * FROM founders");
      console.log(`✅ Postgres Success: Found ${res.rowCount} record(s).`);
    });

    console.log("🕸️  Phase 2: Testing Neo4j...");
    await GraphService.createIntroPath("Jesse Adams", "Brett Sims", "Sequoia Capital");
    console.log("✅ Neo4j Success: Relationship created.");

  } catch (err: any) {
    console.error("❌ THE ACTUAL ERROR IS:");
    console.error(err.message || err);
    console.error(err.stack);
    process.exit(1);
  }
}

console.log("🚀 Script starting...");
test();
