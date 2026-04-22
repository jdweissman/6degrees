import React, { useState } from 'react';
import { Search, Download, ExternalLink, CheckCircle, AlertCircle, TrendingUp, Users, Briefcase } from 'lucide-react';
import axios from 'axios';

const TENANT_ID = '00000000-0000-0000-0000-000000000001';

interface CrunchbaseResult {
  uuid: string;
  name: string;
  short_description?: string;
  website?: string;
  linkedin_url?: string;
  rank: number;
}

interface CuratedInvestor {
  name: string;
  crunchbase_url: string;
  focus: string;
}

interface ImportResult {
  imported: number;
  failed: number;
  errors: string[];
}

export const CrunchbaseImporter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CrunchbaseResult[]>([]);
  const [selectedInvestors, setSelectedInvestors] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [curatedList, setCuratedList] = useState<CuratedInvestor[]>([]);
  const [showCurated, setShowCurated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError(null);
    setSearchResults([]);

    try {
      const res = await axios.get(
        `http://localhost:3001/api/crunchbase/search?query=${encodeURIComponent(searchQuery)}`
      );
      setSearchResults(res.data);
    } catch (err: any) {
      if (err.response?.status === 500 && err.response?.data?.details?.includes('CRUNCHBASE_API_KEY')) {
        setApiKeyMissing(true);
      } else {
        setError(err.response?.data?.details || 'Search failed. Please try again.');
      }
    } finally {
      setSearching(false);
    }
  };

  const handleImport = async (uuid: string) => {
    try {
      await axios.get(`http://localhost:3001/api/crunchbase/investor/${uuid}`, {
        headers: { 'x-tenant-id': TENANT_ID }
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleBatchImport = async () => {
    if (selectedInvestors.size === 0) return;

    setImporting(true);
    setError(null);

    try {
      const res = await axios.post(
        'http://localhost:3001/api/crunchbase/batch-import',
        { uuids: Array.from(selectedInvestors) },
        { headers: { 'x-tenant-id': TENANT_ID } }
      );
      setImportResult(res.data);
      setSelectedInvestors(new Set());
      setSearchResults([]);
    } catch (err: any) {
      setError(err.response?.data?.details || 'Batch import failed.');
    } finally {
      setImporting(false);
    }
  };

  const handleImportCurated = async () => {
    setImporting(true);
    setError(null);

    try {
      const uuids = curatedList.map(inv => inv.crunchbase_url);
      const res = await axios.post(
        'http://localhost:3001/api/crunchbase/batch-import',
        { uuids },
        { headers: { 'x-tenant-id': TENANT_ID } }
      );
      setImportResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.details || 'Import failed.');
    } finally {
      setImporting(false);
    }
  };

  const loadCuratedList = async () => {
    setShowCurated(true);
    try {
      const res = await axios.get('http://localhost:3001/api/crunchbase/curated');
      setCuratedList(res.data);
    } catch (err) {
      setError('Failed to load curated list');
    }
  };

  const toggleSelect = (uuid: string) => {
    const newSelected = new Set(selectedInvestors);
    if (newSelected.has(uuid)) {
      newSelected.delete(uuid);
    } else {
      newSelected.add(uuid);
    }
    setSelectedInvestors(newSelected);
  };

  const getStageBadge = (focus: string) => {
    if (focus.toLowerCase().includes('seed') || focus.toLowerCase().includes('early')) {
      return 'bg-emerald-500/20 text-emerald-400';
    }
    if (focus.toLowerCase().includes('series') || focus.toLowerCase().includes('growth')) {
      return 'bg-indigo-500/20 text-indigo-400';
    }
    return 'bg-slate-700 text-slate-300';
  };

  return (
    <div className="space-y-6">
      {/* API Key Warning */}
      {apiKeyMissing && (
        <div className="bg-amber-500/10 border border-amber-500/50 p-4 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-400 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-300 mb-1">Crunchbase API Key Required</h4>
              <p className="text-sm text-amber-200/80 mb-3">
                Add <code className="bg-amber-500/20 px-2 py-0.5 rounded">CRUNCHBASE_API_KEY=your_key_here</code> to your <code className="bg-amber-500/20 px-2 py-0.5 rounded">.env</code> file
              </p>
              <a
                href="https://www.crunchbase.com/api/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                Get API Key <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex gap-3">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search investors (e.g., 'Sequoia', 'Y Combinator', 'women-focused VC')"
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
        />
        <button
          onClick={handleSearch}
          disabled={searching || !searchQuery.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 px-6 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center gap-2"
        >
          <Search size={16} />
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Curated List Button */}
      {!showCurated ? (
        <button
          onClick={loadCuratedList}
          className="w-full bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
        >
          <TrendingUp size={16} className="text-indigo-400" />
          Load Curated Top VC List
        </button>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-white">Curated Top VC Firms</h3>
            <button
              onClick={handleImportCurated}
              disabled={importing}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Download size={14} />
              {importing ? 'Importing...' : 'Import All 15'}
            </button>
          </div>
          <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto">
            {curatedList.map((investor, idx) => (
              <div key={idx} className="p-3 flex justify-between items-center hover:bg-slate-800/50">
                <div>
                  <h4 className="font-bold text-white text-sm">{investor.name}</h4>
                  <p className="text-xs text-slate-400">{investor.focus}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${getStageBadge(investor.focus)}`}>
                  VC
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-white">Search Results ({searchResults.length})</h3>
            <button
              onClick={handleBatchImport}
              disabled={importing || selectedInvestors.size === 0}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Download size={14} />
              Import Selected ({selectedInvestors.size})
            </button>
          </div>
          <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto">
            {searchResults.map((result) => (
              <div
                key={result.uuid}
                className={`p-4 flex items-center gap-3 hover:bg-slate-800/50 cursor-pointer transition-all ${
                  selectedInvestors.has(result.uuid) ? 'bg-indigo-500/10' : ''
                }`}
                onClick={() => toggleSelect(result.uuid)}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  selectedInvestors.has(result.uuid)
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'border-slate-600'
                }`}>
                  {selectedInvestors.has(result.uuid) && <CheckCircle size={12} className="text-white" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">{result.name}</h4>
                  {result.short_description && (
                    <p className="text-xs text-slate-400 line-clamp-1">{result.short_description}</p>
                  )}
                  <div className="flex gap-2 mt-1">
                    {result.website && (
                      <a
                        href={result.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <Briefcase size={10} /> Website
                      </a>
                    )}
                    {result.linkedin_url && (
                      <a
                        href={result.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Users size={10} /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
                <ExternalLink size={14} className="text-slate-600" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Import Result */}
      {importResult && (
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle size={20} className="text-emerald-400" />
            <h4 className="font-bold text-white">Import Complete</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest">Imported</p>
              <p className="font-bold text-emerald-400">{importResult.imported}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest">Failed</p>
              <p className="font-bold text-amber-400">{importResult.failed}</p>
            </div>
          </div>
          {importResult.errors.length > 0 && (
            <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg">
              <p className="text-[10px] text-rose-300 font-mono">
                {importResult.errors.slice(0, 3).join('\n')}
                {importResult.errors.length > 3 && `\n...and ${importResult.errors.length - 3} more`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-rose-400" />
            <p className="text-sm text-rose-300">{error}</p>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-slate-900/30 border border-slate-800 p-4 rounded-xl">
        <h4 className="font-bold text-white mb-2 text-sm">How it works:</h4>
        <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
          <li>Search Crunchbase for investors by name or keyword</li>
          <li>Select investors you want to add to your database</li>
          <li>Click "Import Selected" to fetch full profiles</li>
          <li>Investor criteria auto-populated from Crunchbase data</li>
          <li>Use Investor Matches tab to find best fits for your startup</li>
        </ol>
        <p className="text-[10px] text-slate-500 mt-3 italic">
          Note: Requires Crunchbase API key. Free tier allows 50 calls/day.
        </p>
      </div>
    </div>
  );
};
