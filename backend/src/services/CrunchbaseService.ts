import { db } from '../lib/db.js';

interface CrunchbaseInvestor {
 name: string;
 firm?: string;
 website?: string;
 linkedin_url?: string;
 crunchbase_url: string;
 description?: string;
 
 // Investment focus
 investor_type: string[]; // "venture_capital", "angel", "private_equity", etc.
 stages: string[]; // "seed", "series_a", etc.
 sectors: string[]; // "fintech", "healthcare", etc.
 
 // Geography
 headquarters?: {
   city: string;
   region: string;
   country: string;
 };
 
 // Investment range
 min_investment_usd?: number;
 max_investment_usd?: number;
 
 // Portfolio
 num_investments?: number;
 num_exits?: number;
 
 // Diversity focus (inferred from portfolio)
 diversity_focus?: {
   women_founded: boolean;
   minority_founded: boolean;
 };
}

interface CrunchbaseSearchResult {
 uuid: string;
 name: string;
 short_description?: string;
 website?: string;
 linkedin_url?: string;
 rank: number;
}

export class CrunchbaseService {
 private static readonly BASE_URL = 'https://api.crunchbase.com/api/v4';
 private static readonly API_KEY = process.env.CRUNCHBASE_API_KEY;

 /**
  * Search for investors by name
  */
 static async searchInvestors(query: string): Promise<CrunchbaseSearchResult[]> {
   if (!this.API_KEY) {
     throw new Error('CRUNCHBASE_API_KEY not configured');
   }

   try {
     const response = await fetch(
       `${this.BASE_URL}/entities/organizations/search?query=${encodeURIComponent(query)}&field_ids=name,short_description,website,linkedin_url`,
       {
         headers: {
           'Authorization': `Bearer ${this.API_KEY}`,
           'Accept': 'application/json'
         }
       }
     );

     if (!response.ok) {
       throw new Error(`Crunchbase API error: ${response.status}`);
     }

     const data: any = await response.json();
     
     return (data.entities || []).map((entity: any) => ({
       uuid: entity.uuid,
       name: entity.properties?.name || entity.name,
       short_description: entity.properties?.short_description,
       website: entity.properties?.website?.value,
       linkedin_url: entity.properties?.linkedin_url?.value,
       rank: entity.rank || 0
     }));
   } catch (error: any) {
     console.error('Crunchbase search error:', error.message);
     throw error;
   }
 }

 /**
  * Get detailed investor profile by UUID
  */
 static async getInvestorDetails(uuid: string): Promise<CrunchbaseInvestor | null> {
   if (!this.API_KEY) {
     throw new Error('CRUNCHBASE_API_KEY not configured');
   }

   try {
     const response = await fetch(
       `${this.BASE_URL}/entities/organizations/${uuid}`,
       {
         headers: {
           'Authorization': `Bearer ${this.API_KEY}`,
           'Accept': 'application/json'
         }
       }
     );

     if (!response.ok) {
       throw new Error(`Crunchbase API error: ${response.status}`);
     }

     const data: any = await response.json();
     const props = data.properties || {};

     // Extract investor type
     const investorType = props.investor_type?.value || [];
     
     // Extract investment stages
     const stages = props.investment_stages?.value || [];
     
     // Extract sectors/industries
     const sectors = props.industries?.map((i: any) => i.name.toLowerCase()) || [];

     // Extract headquarters
     const headquarters = props.headquarters_location
       ? {
           city: props.headquarters_location.city || '',
           region: props.headquarters_location.region || '',
           country: props.headquarters_location.country || ''
         }
       : undefined;

     // Extract investment range
     const minInvestment = props.min_investment_amount?.value_usd;
     const maxInvestment = props.max_investment_amount?.value_usd;

     // Get portfolio for diversity analysis
     const portfolio = props.portfolio_organizations?.value || [];
     const diversityFocus = this.analyzeDiversityFocus(portfolio);

     return {
       name: props.name || '',
       firm: props.name || '',
       website: props.website?.value,
       linkedin_url: props.linkedin_url?.value,
       crunchbase_url: `https://www.crunchbase.com/organization/${props.identifier?.value || uuid}`,
       description: props.short_description,
       investor_type: investorType,
       stages: this.normalizeStages(stages),
       sectors: sectors.slice(0, 10), // Limit to top 10
       headquarters,
       min_investment_usd: minInvestment,
       max_investment_usd: maxInvestment,
       num_investments: props.num_investments?.value || 0,
       num_exits: props.num_exits?.value || 0,
       diversity_focus: diversityFocus
     };
   } catch (error: any) {
     console.error('Crunchbase details error:', error.message);
     return null;
   }
 }

 /**
  * Analyze portfolio to infer diversity focus
  */
 private static analyzeDiversityFocus(portfolio: any[]): { women_founded: boolean; minority_founded: boolean } {
   if (!portfolio || portfolio.length === 0) {
     return { women_founded: false, minority_founded: false };
   }

   // Look for keywords in founder descriptions
   const diversityKeywords = {
     women: ['women-founded', 'women-led', 'female founder', 'woman-owned'],
     minority: ['minority-owned', 'diverse founders', 'underrepresented']
   };

   let womenFounded = 0;
   let minorityFounded = 0;

   portfolio.forEach((company: any) => {
     const description = (company.short_description || '').toLowerCase();
     const founders = company.founders || [];
     
     founders.forEach((founder: any) => {
       const gender = founder.gender?.toLowerCase() || '';
       if (gender.includes('female')) womenFounded++;
     });

     if (diversityKeywords.women.some(kw => description.includes(kw))) womenFounded++;
     if (diversityKeywords.minority.some(kw => description.includes(kw))) minorityFounded++;
   });

   // If >20% of portfolio shows diversity signals, mark as diversity-focused
   const threshold = Math.max(1, Math.floor(portfolio.length * 0.2));
   
   return {
     women_founded: womenFounded >= threshold,
     minority_founded: minorityFounded >= threshold
   };
 }

 /**
  * Normalize stage names to our standard format
  */
 private static normalizeStages(stages: string[]): string[] {
   const stageMap: Record<string, string> = {
     'seed': 'seed',
     'pre_seed': 'pre-seed',
     'pre-seed': 'pre-seed',
     'early_stage_venture': 'seed',
     'late_stage_venture': 'series-b',
     'series_a': 'series-a',
     'series_b': 'series-b',
     'series_c': 'series-b',
     'series_d': 'series-b',
     'series_e': 'series-b',
     'growth_equity': 'series-b',
     'private_equity': 'series-b',
     'angel': 'idea',
     'venture_capital': 'seed'
   };

   return stages
     .map(s => stageMap[s.toLowerCase()] || null)
     .filter(Boolean) as string[];
 }

 /**
  * Convert Crunchbase investor to our database format
  */
 static async importFromCrunchbase(tenantId: string, crunchbaseUuid: string) {
   const details = await this.getInvestorDetails(crunchbaseUuid);
   
   if (!details) {
     throw new Error('Failed to fetch investor details from Crunchbase');
   }

   // Determine region from headquarters
   let preferredRegions: string[] = [];
   if (details.headquarters) {
     const country = details.headquarters.country.toLowerCase();
     if (country.includes('united states') || country.includes('canada')) {
       preferredRegions.push('north-america');
     } else if (country.includes('united kingdom') || country.includes('germany') || country.includes('france')) {
       preferredRegions.push('europe');
     } else if (country.includes('china') || country.includes('japan') || country.includes('singapore')) {
       preferredRegions.push('asia');
     }
   }
   preferredRegions.push('remote-ok'); // Default to remote-friendly

   // Map sectors to our standard list
   const sectorMap: Record<string, string> = {
     'financial services': 'fintech',
     'fintech': 'fintech',
     'healthcare': 'healthtech',
     'biotechnology': 'biotech',
     'artificial intelligence': 'ai',
     'machine learning': 'ai',
     'software': 'saas',
     'saas': 'saas',
     'enterprise software': 'enterprise',
     'consumer': 'consumer',
     'e-commerce': 'consumer',
     'climate tech': 'climate',
     'clean technology': 'climate',
     'education': 'edtech',
     'edtech': 'edtech'
   };

   const preferredSectors = details.sectors
     .map(s => sectorMap[s] || null)
     .filter(Boolean) as string[];

   // Insert into database
   const result = await db.query(
     `INSERT INTO investors (
        tenant_id, name, firm, website, linkedin_url, crunchbase_url,
        check_women_founded, check_minority_founded,
        min_check_size_usd, max_check_size_usd,
        preferred_stages, preferred_sectors, preferred_regions,
        thesis, source
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (crunchbase_url) DO UPDATE SET
        name = EXCLUDED.name,
        firm = EXCLUDED.firm,
        website = EXCLUDED.website,
        linkedin_url = EXCLUDED.linkedin_url,
        check_women_founded = EXCLUDED.check_women_founded,
        check_minority_founded = EXCLUDED.check_minority_founded,
        min_check_size_usd = EXCLUDED.min_check_size_usd,
        max_check_size_usd = EXCLUDED.max_check_size_usd,
        preferred_stages = EXCLUDED.preferred_stages,
        preferred_sectors = EXCLUDED.preferred_sectors,
        preferred_regions = EXCLUDED.preferred_regions,
        thesis = EXCLUDED.thesis,
        updated_at = NOW()
      RETURNING *`,
     [
       tenantId,
       details.name,
       details.firm,
       details.website || '',
       details.linkedin_url || '',
       details.crunchbase_url,
       details.diversity_focus?.women_founded || false,
       details.diversity_focus?.minority_founded || false,
       details.min_investment_usd || null,
       details.max_investment_usd || null,
       JSON.stringify(details.stages.length > 0 ? details.stages : ['seed', 'series-a']),
       JSON.stringify(preferredSectors.length > 0 ? preferredSectors : ['saas']),
       JSON.stringify(preferredRegions),
       details.description || '',
       'crunchbase'
     ]
   );

   return result.rows[0];
 }

 /**
  * Batch import multiple investors from Crunchbase
  */
 static async batchImport(tenantId: string, crunchbaseUuids: string[]) {
   const results = {
     imported: 0,
     failed: 0,
     errors: [] as string[]
   };

   for (const uuid of crunchbaseUuids) {
     try {
       await this.importFromCrunchbase(tenantId, uuid);
       results.imported++;
     } catch (error: any) {
       results.failed++;
       results.errors.push(`${uuid}: ${error.message}`);
     }
   }

   return results;
 }

 /**
  * Get popular VCs by sector (curated list)
  */
 static getCuratedInvestors(): Array<{ name: string; crunchbase_url: string; focus: string }> {
   return [
     { name: 'Y Combinator', crunchbase_url: 'y-combinator', focus: 'All stages, all sectors' },
     { name: 'Andreessen Horowitz', crunchbase_url: 'andreessen-horowitz', focus: 'Enterprise, Consumer, Bio' },
     { name: 'Sequoia Capital', crunchbase_url: 'sequoia-capital', focus: 'All stages' },
     { name: 'Accel', crunchbase_url: 'accel-partners', focus: 'Early stage, SaaS' },
     { name: 'First Round Capital', crunchbase_url: 'first-round-capital', focus: 'Pre-seed, Seed' },
     { name: 'Forerunner Ventures', crunchbase_url: 'forerunner-ventures', focus: 'Consumer, Women-founded' },
     { name: 'Backstage Capital', crunchbase_url: 'backstage-capital', focus: 'Underrepresented founders' },
     { name: 'Female Founders Fund', crunchbase_url: 'female-founders-fund', focus: 'Women-founded only' },
     { name: ' Harlem Capital', crunchbase_url: 'harlem-capital-partners', focus: 'Diverse founders' },
     { name: 'Kleiner Perkins', crunchbase_url: 'kleiner-perkins-caufield-byers', focus: 'Enterprise, Consumer, Hardtech' },
     { name: 'Benchmark', crunchbase_url: 'benchmark', focus: 'Early stage' },
     { name: 'Greylock Partners', crunchbase_url: 'greylock-partners', focus: 'Enterprise, Consumer' },
     { name: 'Index Ventures', crunchbase_url: 'index-ventures', focus: 'Europe/US, All stages' },
     { name: 'Lightspeed Venture Partners', crunchbase_url: 'lightspeed-venture-partners', focus: 'Enterprise, Consumer' },
     { name: 'NEA', crunchbase_url: 'new-enterprise-associates', focus: 'All stages, all sectors' }
   ];
 }
}
