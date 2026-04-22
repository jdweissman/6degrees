import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { tenantContextMiddleware } from './middleware/tenantContext.js';
import { db } from './lib/db.js';
import { getSession } from './lib/graph.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Applies RLS to ensure tenant data isolation
app.use(tenantContextMiddleware);

// --- ROUTES ---

// 1. GET: Fetch contacts from 'founders' table (Postgres)
app.get('/api/founders', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM founders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err: any) {
    console.error("GET Founders Error:", err.message);
    res.status(500).json({ error: 'Database fetch failed' });
  }
});

// 2. POST: Add new contact to 'founders' table (Postgres)
app.post('/api/profiles', async (req, res) => {
  const { full_name, email, title, linkedin_url } = req.body;
  const tenantId = (req as any).tenantId || req.headers['x-tenant-id'];

  try {
    const result = await db.query(
      `INSERT INTO founders (full_name, email, title, linkedin_url, tenant_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [full_name, email || '', title || '', linkedin_url || '', tenantId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error("POST Founder Error:", err.message);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

// 3. POST: Save Startup Evaluation (Postgres)
app.post('/api/startup-evaluation', async (req, res) => {
  const { company_name, details } = req.body;
  const tenantId = (req as any).tenantId || req.headers['x-tenant-id'];

  try {
    const query = `
      INSERT INTO startups (
        tenant_id, 
        company_name, 
        business_description, 
        market_analysis, 
        product_details, 
        competition_strategy, 
        gtm_strategy, 
        traction_data, 
        operations_plan, 
        team_background, 
        financial_projections, 
        the_ask
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    
    const values = [
      tenantId, 
      company_name || 'Untitled Startup', 
      details.business, 
      details.market, 
      details.product, 
      details.competition, 
      details.gtm, 
      details.traction, 
      details.ops, 
      details.team, 
      details.finances, 
      details.ask
    ];

    const result = await db.query(query, values);
    res.status(201).json({ message: "Evaluation saved successfully", data: result.rows[0] });
  } catch (err: any) {
    console.error("Database Error while saving startup:", err.message);
    res.status(500).json({ error: 'Failed to record evaluation' });
  }
});

// 4. POST: Save Pitch Deck
app.post('/api/decks', async (req, res) => {
  const { company_name, slide_data, evaluation_id } = req.body;
  const tenantId = (req as any).tenantId || req.headers['x-tenant-id'];

  try {
    const result = await db.query(
      `INSERT INTO pitch_decks (tenant_id, company_name, slide_data, evaluation_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [tenantId, company_name, JSON.stringify(slide_data), evaluation_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error("POST Deck Error:", err.message);
    res.status(500).json({ error: 'Failed to save deck' });
  }
});

// 5. POST: Evaluate Startup (LLM-powered)
app.post('/api/evaluate', async (req, res) => {
  const { company_name, business, market, product, traction, competition, gtm, operations, team, finances, ask } = req.body;
  const tenantId = (req as any).tenantId || req.headers['x-tenant-id'];

  try {
    const { evaluateStartup } = await import('./services/StartupEvaluator.js');
    
    const evaluation = await evaluateStartup({
      company_name: company_name || 'Untitled Startup',
      business: business || '',
      market: market || '',
      product: product || '',
      traction: traction || '',
      competition: competition || '',
      gtm: gtm || '',
      operations: operations || '',
      team: team || '',
      finances: finances || '',
      ask: ask || ''
    });

    // Save evaluation results to database
    const result = await db.query(
      `INSERT INTO startups (
        tenant_id, company_name,
        business_description, market_analysis, product_details,
        competition_strategy, gtm_strategy, traction_data,
        operations_plan, team_background, financial_projections, the_ask,
        score_business, score_market, score_product, score_competition,
        score_gtm, score_traction, score_ops, score_team,
        score_finances, score_ask,
        feedback_business, feedback_market, feedback_product,
        feedback_competition, feedback_gtm, feedback_traction,
        feedback_ops, feedback_team, feedback_finances, feedback_ask,
        overall_assessment, recommended_next_steps
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
                $13, $14, $15, $16, $17, $18, $19, $20, $21, $22,
                $23, $24, $25, $26, $27, $28, $29, $30, $31, $32,
                $33, $34)
      RETURNING *`,
      [
        tenantId, company_name || 'Untitled Startup',
        business, market, product, competition, gtm, traction, operations, team, finances, ask,
        evaluation.business.score, evaluation.market.score, evaluation.product.score, evaluation.competition.score,
        evaluation.gtm.score, evaluation.traction.score, evaluation.operations.score, evaluation.team.score,
        evaluation.finances.score, evaluation.ask.score,
        JSON.stringify(evaluation.business),
        JSON.stringify(evaluation.market),
        JSON.stringify(evaluation.product),
        JSON.stringify(evaluation.competition),
        JSON.stringify(evaluation.gtm),
        JSON.stringify(evaluation.traction),
        JSON.stringify(evaluation.operations),
        JSON.stringify(evaluation.team),
        JSON.stringify(evaluation.finances),
        JSON.stringify(evaluation.ask),
        evaluation.overall_assessment,
        JSON.stringify(evaluation.recommended_next_steps)
      ]
    );

    res.json({
      message: 'Evaluation completed',
      data: result.rows[0],
      evaluation
    });
  } catch (err: any) {
    console.error("Evaluation Error:", err.message);
    res.status(500).json({ error: 'Evaluation failed', details: err.message });
  }
});

// 6. GET: List All Decks for Tenant
app.get('/api/decks', async (req, res) => {
  const tenantId = (req as any).tenantId || req.headers['x-tenant-id'];

  try {
    const result = await db.query(
      `SELECT id, company_name, created_at, updated_at
       FROM pitch_decks
       WHERE tenant_id = $1
       ORDER BY updated_at DESC`,
      [tenantId]
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error("GET Decks Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch decks' });
  }
});

// 6. GET: Get Single Deck by ID
app.get('/api/decks/:id', async (req, res) => {
  const { id } = req.params;
  const tenantId = (req as any).tenantId || req.headers['x-tenant-id'];

  try {
    const result = await db.query(
      `SELECT * FROM pitch_decks
       WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error("GET Deck Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch deck' });
  }
});

// 7. PUT: Update Deck
app.put('/api/decks/:id', async (req, res) => {
  const { id } = req.params;
  const { company_name, slide_data } = req.body;
  const tenantId = (req as any).tenantId || req.headers['x-tenant-id'];

  try {
    const result = await db.query(
      `UPDATE pitch_decks
       SET company_name = $1, slide_data = $2, updated_at = NOW()
       WHERE id = $3 AND tenant_id = $4
       RETURNING *`,
      [company_name, JSON.stringify(slide_data), id, tenantId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error("PUT Deck Error:", err.message);
    res.status(500).json({ error: 'Failed to update deck' });
  }
});

// 8. DELETE: Delete Deck
app.delete('/api/decks/:id', async (req, res) => {
  const { id } = req.params;
  const tenantId = (req as any).tenantId || req.headers['x-tenant-id'];

  try {
    const result = await db.query(
      `DELETE FROM pitch_decks
       WHERE id = $1 AND tenant_id = $2
       RETURNING *`,
      [id, tenantId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    res.json({ message: 'Deck deleted successfully' });
  } catch (err: any) {
    console.error("DELETE Deck Error:", err.message);
    res.status(500).json({ error: 'Failed to delete deck' });
  }
});

// 9. GET: Neo4j Graph Path (Shortest Path Logic)
app.get('/api/network/:name', async (req, res) => {
  const { name } = req.params;
  const tenantId = (req as any).tenantId || req.headers['x-tenant-id'];
  const session = getSession();

  try {
    // 1. Fetch Readiness Score from Postgres
    const startupRes = await db.query(
      `SELECT 
        (score_business + score_market + score_product + score_competition + 
         score_gtm + score_traction + score_ops + score_team + 
         score_finances + score_ask) as total_score 
       FROM startups WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [tenantId]
    );
    const readinessScore = startupRes.rows.length > 0 ? startupRes.rows[0].total_score : 50;

    // 2. Cypher Query: Fetch source and target. Only attempt shortestPath if IDs differ.
    const result = await session.run(
      `MATCH (me:Person {name: $meName, tenantId: $tid}), (target:Person {name: $targetName, tenantId: $tid})
       WITH me, target
       OPTIONAL MATCH path = shortestPath((me)-[*..6]-(target))
       WHERE id(me) <> id(target)
       RETURN path, me, target`,
      { 
        meName: process.env.MY_NAME || "Jesse Adams", 
        targetName: name, 
        tid: tenantId 
      }
    );

    // 3. Process records into networkData
    const networkData = result.records.map(record => {
      const path = record.get('path');
      const me = record.get('me');
      const target = record.get('target');

      // CASE A: Identity Guard (Target is the User)
      if (me.properties.name === target.properties.name) {
        return {
          path: "Direct",
          warmth: 100,
          distance: 0,
          details: { 
            from: me.properties.name, 
            via: "Direct Access", 
            to: target.properties.name 
          }
        };
      }

      // CASE B: No path found in the graph
      if (!path) return null;

      // CASE C: Valid Path Processing
      const distance = path.segments.length;
      // Exponential decay: Warmth drops by 10% for every hop after the first
      const warmth = Math.round(readinessScore * Math.pow(0.9, distance - 1));

      return {
        path: "Path Found",
        warmth,
        distance,
        details: {
          from: path.start.properties.name,
          // distance > 1 means there's at least one middle-node
          via: distance > 1 ? path.segments[0].end.properties.name : "Direct Intro",
          to: path.end.properties.name
        }
      };
    }).filter(item => item !== null);

    res.json({
      name,
      overallReadiness: readinessScore,
      network: networkData
    });

  } catch (err: any) {
    console.error("Network Heatmap Error:", err.message);
    res.status(500).json({ error: "Access Map Calculation Failed" });
  } finally {
    // ALWAYS close the Neo4j session
    await session.close();
  }
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});