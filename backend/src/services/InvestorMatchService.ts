import { db } from '../lib/db.js';

interface FounderProfile {
  is_women_founded: boolean;
  is_minority_founded: boolean;
  is_veteran_founded: boolean;
  is_lgbtq_founded: boolean;
  stage: string;
  sectors: string[];
  regions: string[];
  funding_needed_usd: number;
}

interface Investor {
  id: string;
  name: string;
  firm: string;
  check_women_founded: boolean;
  check_minority_founded: boolean;
  check_veteran_founded: boolean;
  check_lgbtq_founded: boolean;
  min_check_size_usd: number;
  max_check_size_usd: number;
  preferred_stages: string[];
  preferred_sectors: string[];
  preferred_regions: string[];
  thesis: string;
}

interface MatchResult {
  investor: Investor;
  match_score: number;
  match_reasons: {
    sectors: boolean;
    stage: boolean;
    demographics: boolean;
    check_size: boolean;
    geography: boolean;
  };
  connection_path?: any;
}

export class InvestorMatchService {
  /**
   * Calculate match score between founder profile and investor criteria
   */
  static calculateMatchScore(founder: FounderProfile, investor: Investor): { score: number; reasons: any } {
    let score = 0;
    const reasons = {
      sectors: false,
      stage: false,
      demographics: false,
      check_size: false,
      geography: false
    };

    // Sector match (30 points)
    if (investor.preferred_sectors?.length > 0) {
      const matchingSectors = founder.sectors.filter(s => 
        investor.preferred_sectors.includes(s.toLowerCase())
      );
      if (matchingSectors.length > 0) {
        reasons.sectors = true;
        score += 30;
      }
    } else {
      // No sector preference = neutral
      score += 15;
    }

    // Stage match (25 points)
    if (investor.preferred_stages?.length > 0) {
      if (investor.preferred_stages.includes(founder.stage?.toLowerCase())) {
        reasons.stage = true;
        score += 25;
      }
    } else {
      score += 12;
    }

    // Demographics match (25 points)
    let demographicMatch = false;
    
    // If investor has specific diversity criteria, check them
    if (investor.check_women_founded && founder.is_women_founded) demographicMatch = true;
    if (investor.check_minority_founded && founder.is_minority_founded) demographicMatch = true;
    if (investor.check_veteran_founded && founder.is_veteran_founded) demographicMatch = true;
    if (investor.check_lgbtq_founded && founder.is_lgbtq_founded) demographicMatch = true;

    // If investor has NO diversity criteria, they're neutral (don't penalize)
    const hasDemographicCriteria = 
      investor.check_women_founded || 
      investor.check_minority_founded || 
      investor.check_veteran_founded || 
      investor.check_lgbtq_founded;

    if (hasDemographicCriteria) {
      if (demographicMatch) {
        reasons.demographics = true;
        score += 25;
      }
      // If they don't match demographics, score stays low
    } else {
      // No demographic criteria = neutral
      score += 12;
    }

    // Check size match (10 points)
    if (investor.min_check_size_usd && investor.max_check_size_usd) {
      if (founder.funding_needed_usd >= investor.min_check_size_usd && 
          founder.funding_needed_usd <= investor.max_check_size_usd) {
        reasons.check_size = true;
        score += 10;
      }
    } else {
      score += 5;
    }

    // Geography match (10 points)
    if (investor.preferred_regions?.length > 0) {
      const matchingRegions = founder.regions.filter(r => 
        investor.preferred_regions.includes(r.toLowerCase())
      );
      if (matchingRegions.length > 0 || investor.preferred_regions.includes('remote-ok')) {
        reasons.geography = true;
        score += 10;
      }
    } else {
      score += 5;
    }

    return { score, reasons };
  }

  /**
   * Find best investor matches for a founder profile
   */
  static async findMatches(tenantId: string, founderProfile: FounderProfile): Promise<MatchResult[]> {
    // Get all investors for this tenant
    const result = await db.query(
      `SELECT * FROM investors WHERE tenant_id = $1`,
      [tenantId]
    );

    const investors: Investor[] = result.rows;
    const matches: MatchResult[] = [];

    for (const investor of investors) {
      const { score, reasons } = this.calculateMatchScore(founderProfile, investor);
      
      // Only include matches with score > 40
      if (score > 40) {
        matches.push({
          investor,
          match_score: score,
          match_reasons: reasons,
          connection_path: null // Will be populated by graph service
        });
      }
    }

    // Sort by match score descending
    return matches.sort((a, b) => b.match_score - a.match_score);
  }

  /**
   * Save or update a founder profile
   */
  static async saveFounderProfile(tenantId: string, profile: {
    founder_name: string;
    company_name?: string;
    is_women_founded?: boolean;
    is_minority_founded?: boolean;
    is_veteran_founded?: boolean;
    is_lgbtq_founded?: boolean;
    stage?: string;
    sectors?: string[];
    regions?: string[];
    funding_needed_usd?: number;
  }) {
    const result = await db.query(
      `INSERT INTO founder_profiles (
         tenant_id, founder_name, company_name,
         is_women_founded, is_minority_founded, is_veteran_founded, is_lgbtq_founded,
         stage, sectors, regions, funding_needed_usd
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (tenant_id, founder_name) DO UPDATE SET
         company_name = EXCLUDED.company_name,
         is_women_founded = EXCLUDED.is_women_founded,
         is_minority_founded = EXCLUDED.is_minority_founded,
         is_veteran_founded = EXCLUDED.is_veteran_founded,
         is_lgbtq_founded = EXCLUDED.is_lgbtq_founded,
         stage = EXCLUDED.stage,
         sectors = EXCLUDED.sectors,
         regions = EXCLUDED.regions,
         funding_needed_usd = EXCLUDED.funding_needed_usd,
         updated_at = NOW()
       RETURNING *`,
      [
        tenantId,
        profile.founder_name,
        profile.company_name || '',
        profile.is_women_founded || false,
        profile.is_minority_founded || false,
        profile.is_veteran_founded || false,
        profile.is_lgbtq_founded || false,
        profile.stage || '',
        profile.sectors ? JSON.stringify(profile.sectors) : null,
        profile.regions ? JSON.stringify(profile.regions) : null,
        profile.funding_needed_usd || null
      ]
    );

    return result.rows[0];
  }

  /**
   * Get founder profile
   */
  static async getFounderProfile(tenantId: string, founderName: string) {
    const result = await db.query(
      `SELECT * FROM founder_profiles 
       WHERE tenant_id = $1 AND founder_name = $2`,
      [tenantId, founderName]
    );
    return result.rows[0];
  }

  /**
   * Add a new investor
   */
  static async addInvestor(tenantId: string, investor: {
    name: string;
    firm?: string;
    website?: string;
    linkedin_url?: string;
    crunchbase_url?: string;
    check_women_founded?: boolean;
    check_minority_founded?: boolean;
    check_veteran_founded?: boolean;
    check_lgbtq_founded?: boolean;
    min_check_size_usd?: number;
    max_check_size_usd?: number;
    preferred_stages?: string[];
    preferred_sectors?: string[];
    preferred_regions?: string[];
    thesis?: string;
  }) {
    const result = await db.query(
      `INSERT INTO investors (
         tenant_id, name, firm, website, linkedin_url, crunchbase_url,
         check_women_founded, check_minority_founded, check_veteran_founded, check_lgbtq_founded,
         min_check_size_usd, max_check_size_usd, preferred_stages, preferred_sectors, preferred_regions, thesis
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING *`,
      [
        tenantId,
        investor.name,
        investor.firm || '',
        investor.website || '',
        investor.linkedin_url || '',
        investor.crunchbase_url || '',
        investor.check_women_founded || false,
        investor.check_minority_founded || false,
        investor.check_veteran_founded || false,
        investor.check_lgbtq_founded || false,
        investor.min_check_size_usd || null,
        investor.max_check_size_usd || null,
        investor.preferred_stages ? JSON.stringify(investor.preferred_stages) : null,
        investor.preferred_sectors ? JSON.stringify(investor.preferred_sectors) : null,
        investor.preferred_regions ? JSON.stringify(investor.preferred_regions) : null,
        investor.thesis || ''
      ]
    );

    return result.rows[0];
  }

  /**
   * Get all investors for tenant
   */
  static async getInvestors(tenantId: string) {
    const result = await db.query(
      `SELECT * FROM investors WHERE tenant_id = $1 ORDER BY name ASC`,
      [tenantId]
    );
    return result.rows;
  }

  /**
   * Delete an investor
   */
  static async deleteInvestor(tenantId: string, investorId: string) {
    const result = await db.query(
      `DELETE FROM investors WHERE id = $1 AND tenant_id = $2 RETURNING *`,
      [investorId, tenantId]
    );
    return result.rows.length > 0;
  }
}
