-- Migration: Add pitch_decks table
-- Run this on your database to enable deck persistence

CREATE TABLE IF NOT EXISTS pitch_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  slide_data JSONB NOT NULL,
  evaluation_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster tenant lookups
CREATE INDEX IF NOT EXISTS idx_pitch_decks_tenant ON pitch_decks(tenant_id);

-- RLS Policy - tenants can only see their own decks
ALTER TABLE pitch_decks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_policy ON pitch_decks;
CREATE POLICY tenant_isolation_policy ON pitch_decks
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
