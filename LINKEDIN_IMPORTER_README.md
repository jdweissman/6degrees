# 6degrees - LinkedIn Import & Investor Matching

## New Features

### 1. LinkedIn Connection Import

Import your LinkedIn connections to build your network graph.

**How to export from LinkedIn:**
1. Go to LinkedIn Settings & Privacy
2. Click "Data privacy" → "Get a copy of your data"
3. Select "Connections" and request archive
4. Download the CSV when ready (usually takes 10-15 minutes)

**How to import:**
1. Navigate to the "LinkedIn Import" tab in the app
2. Drag & drop or select your CSV file
3. Connections are parsed and stored in your tenant

**API Endpoints:**
- `POST /api/linkedin/import` - Upload connections
- `GET /api/linkedin/connections` - Fetch connections (optional: `?company=X` or `?search=Y`)
- `GET /api/linkedin/stats` - Get connection statistics

---

### 2. Investor Database & Matching

Build a database of investors with their acceptance criteria and get matched based on your founder profile.

**Investor Criteria Supported:**
- Diversity focus (Women/Minority/Veteran/LGBTQ+ founded)
- Check size range ($ min - $ max)
- Preferred stages (idea, pre-seed, seed, series-a, series-b)
- Preferred sectors (fintech, healthtech, ai, saas, consumer, enterprise, climate, edtech, biotech)
- Geographic preferences (north-america, europe, asia, latin-america, remote-ok)

**How it works:**
1. Go to "Investor Matches" tab
2. Add investors with their criteria (or we'll add a Crunchbase importer later)
3. Complete your founder profile
4. Click "Find Investor Matches" to see scored matches

**Matching Algorithm:**
- Sector match: 30 points
- Stage match: 25 points
- Demographics match: 25 points
- Check size match: 10 points
- Geography match: 10 points

**API Endpoints:**
- `POST /api/investors` - Add investor
- `GET /api/investors` - List all investors
- `DELETE /api/investors/:id` - Delete investor
- `POST /api/founder-profile` - Save founder profile
- `GET /api/founder-profile/:name` - Get founder profile
- `POST /api/investor-matches` - Find matches for a profile

---

## Database Migration

Run this migration to add the new tables:

```bash
psql $DATABASE_URL -f backend/migrations/004_linkedin_and_investors.sql
```

Or manually run the SQL in `backend/migrations/004_linkedin_and_investors.sql`

---

## Tables Added

- `linkedin_connections` - Imported LinkedIn connections
- `investors` - Investor profiles with criteria
- `founder_profiles` - Founder demographic and company data
- `investor_matches` - Cached match results

---

## Next Steps (Future Enhancements)

1. **Crunchbase Integration** - Auto-populate investor data from Crunchbase API
2. **Connection Path Visualization** - Show actual paths through your LinkedIn network to investors
3. **Warm Intro Requests** - Generate intro request drafts for mutual connections
4. **Investor Research** - Scrape investor websites for thesis details
5. **Pipeline Tracking** - Track which investors you've contacted, responses, meetings

---

## Architecture

```
Frontend (React/Vite)
    ↓
Backend (Express/TypeScript)
    ↓
PostgreSQL (tenant-isolated data)
    ↓
Neo4j (graph paths - future enhancement)
```

All queries are tenant-isolated via RLS (Row Level Security).
