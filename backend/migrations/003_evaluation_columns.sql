-- Migration: Add LLM evaluation columns to startups table
-- Run this on your database to enable AI-powered scoring

ALTER TABLE startups ADD COLUMN IF NOT EXISTS score_business INTEGER;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS score_market INTEGER;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS score_product INTEGER;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS score_competition INTEGER;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS score_gtm INTEGER;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS score_traction INTEGER;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS score_ops INTEGER;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS score_team INTEGER;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS score_finances INTEGER;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS score_ask INTEGER;

ALTER TABLE startups ADD COLUMN IF NOT EXISTS feedback_business JSONB;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS feedback_market JSONB;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS feedback_product JSONB;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS feedback_competition JSONB;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS feedback_gtm JSONB;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS feedback_traction JSONB;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS feedback_ops JSONB;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS feedback_team JSONB;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS feedback_finances JSONB;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS feedback_ask JSONB;

ALTER TABLE startups ADD COLUMN IF NOT EXISTS overall_assessment TEXT;
ALTER TABLE startups ADD COLUMN IF NOT EXISTS recommended_next_steps JSONB;

-- Create index for fetching latest evaluation
CREATE INDEX IF NOT EXISTS idx_startups_tenant_created ON startups(tenant_id, created_at DESC);
