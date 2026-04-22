-- Migration: Add LinkedIn connections and investor criteria tables
-- Run this on your database to enable network importing and investor matching

-- Table: linkedin_connections
-- Stores imported LinkedIn connections from CSV export
CREATE TABLE IF NOT EXISTS linkedin_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  company VARCHAR(255),
  position VARCHAR(255),
  linkedin_url VARCHAR(500),
  connection_degree VARCHAR(10), -- "1st", "2nd", "3rd"
  imported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_linkedin_connections_tenant ON linkedin_connections(tenant_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_connections_company ON linkedin_connections(company);
CREATE INDEX IF NOT EXISTS idx_linkedin_connections_name ON linkedin_connections(name);

ALTER TABLE linkedin_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_policy ON linkedin_connections;
CREATE POLICY tenant_isolation_policy ON linkedin_connections
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Table: investors
-- Investor profiles with acceptance criteria
CREATE TABLE IF NOT EXISTS investors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  firm VARCHAR(255),
  website VARCHAR(500),
  linkedin_url VARCHAR(500),
  crunchbase_url VARCHAR(500),
  
  -- Investment criteria
  check_women_founded BOOLEAN DEFAULT FALSE,
  check_minority_founded BOOLEAN DEFAULT FALSE,
  check_veteran_founded BOOLEAN DEFAULT FALSE,
  check_lgbtq_founded BOOLEAN DEFAULT FALSE,
  
  -- Stage preferences
  min_check_size_usd INTEGER,
  max_check_size_usd INTEGER,
  preferred_stages JSONB, -- ["pre-seed", "seed", "series-a"]
  
  -- Sector preferences
  preferred_sectors JSONB, -- ["fintech", "healthtech", "ai", "saas"]
  
  -- Geography
  preferred_regions JSONB, -- ["north-america", "europe", "remote-ok"]
  
  -- Thesis/notes
  thesis TEXT,
  
  -- Data source
  source VARCHAR(50) DEFAULT 'manual', -- "manual", "crunchbase", "imported"
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_investors_tenant ON investors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_investors_sectors ON investors USING GIN (preferred_sectors);
CREATE INDEX IF NOT EXISTS idx_investors_stages ON investors USING GIN (preferred_stages);

ALTER TABLE investors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_policy ON investors;
CREATE POLICY tenant_isolation_policy ON investors
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Table: founder_profiles
-- Extended founder data for matching
CREATE TABLE IF NOT EXISTS founder_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  founder_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  
  -- Demographics (optional, self-reported)
  is_women_founded BOOLEAN DEFAULT FALSE,
  is_minority_founded BOOLEAN DEFAULT FALSE,
  is_veteran_founded BOOLEAN DEFAULT FALSE,
  is_lgbtq_founded BOOLEAN DEFAULT FALSE,
  
  -- Company details
  stage VARCHAR(50), -- "idea", "pre-seed", "seed", "series-a"
  sectors JSONB,
  regions JSONB,
  funding_needed_usd INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_founder_profiles_tenant ON founder_profiles(tenant_id);

ALTER TABLE founder_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_policy ON founder_profiles;
CREATE POLICY tenant_isolation_policy ON founder_profiles
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Table: investor_matches
-- Cached match results between founders and investors
CREATE TABLE IF NOT EXISTS investor_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  founder_profile_id UUID REFERENCES founder_profiles(id),
  investor_id UUID REFERENCES investors(id),
  
  match_score INTEGER NOT NULL, -- 0-100
  match_reasons JSONB, -- {"sectors": true, "stage": true, "demographics": true}
  connection_path JSONB, -- Shows how founder is connected to investor
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_investor_matches_tenant ON investor_matches(tenant_id);
CREATE INDEX IF NOT EXISTS idx_investor_matches_founder ON investor_matches(founder_profile_id);

ALTER TABLE investor_matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_policy ON investor_matches;
CREATE POLICY tenant_isolation_policy ON investor_matches
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
