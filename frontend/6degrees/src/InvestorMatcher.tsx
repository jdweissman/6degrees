import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Briefcase, Target, Users, DollarSign, MapPin, Zap } from 'lucide-react';
import axios from 'axios';

const TENANT_ID = '00000000-0000-0000-0000-000000000001';

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
}

interface FounderProfile {
  founder_name: string;
  company_name: string;
  is_women_founded: boolean;
  is_minority_founded: boolean;
  is_veteran_founded: boolean;
  is_lgbtq_founded: boolean;
  stage: string;
  sectors: string[];
  regions: string[];
  funding_needed_usd: number;
}

const STAGES = ['idea', 'pre-seed', 'seed', 'series-a', 'series-b'];
const SECTORS = ['fintech', 'healthtech', 'ai', 'saas', 'consumer', 'enterprise', 'climate', 'edtech', 'biotech'];
const REGIONS = ['north-america', 'europe', 'asia', 'latin-america', 'remote-ok'];

export const InvestorMatcher: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'investors' | 'profile' | 'matches'>('investors');
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [showAddInvestor, setShowAddInvestor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  
  // Founder profile state
  const [founderProfile, setFounderProfile] = useState<FounderProfile>({
    founder_name: 'Jesse Weissman',
    company_name: 'cognitivebytes.ai',
    is_women_founded: false,
    is_minority_founded: false,
    is_veteran_founded: false,
    is_lgbtq_founded: false,
    stage: 'pre-seed',
    sectors: ['ai', 'saas'],
    regions: ['north-america', 'remote-ok'],
    funding_needed_usd: 500000
  });

  // New investor form state
  const [newInvestor, setNewInvestor] = useState<Partial<Investor>>({
    name: '',
    firm: '',
    check_women_founded: false,
    check_minority_founded: false,
    check_veteran_founded: false,
    check_lgbtq_founded: false,
    min_check_size_usd: 100000,
    max_check_size_usd: 1000000,
    preferred_stages: ['pre-seed', 'seed'],
    preferred_sectors: [],
    preferred_regions: ['north-america'],
    thesis: ''
  });

  const fetchInvestors = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/investors', {
        headers: { 'x-tenant-id': TENANT_ID }
      });
      setInvestors(res.data);
    } catch (err) {
      console.error('Failed to fetch investors:', err);
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, []);

  const handleAddInvestor = async () => {
    if (!newInvestor.name) return;

    try {
      await axios.post('http://localhost:3001/api/investors', newInvestor, {
        headers: { 'x-tenant-id': TENANT_ID }
      });
      setNewInvestor({
        name: '',
        firm: '',
        check_women_founded: false,
        check_minority_founded: false,
        check_veteran_founded: false,
        check_lgbtq_founded: false,
        min_check_size_usd: 100000,
        max_check_size_usd: 1000000,
        preferred_stages: ['pre-seed', 'seed'],
        preferred_sectors: [],
        preferred_regions: ['north-america'],
        thesis: ''
      });
      setShowAddInvestor(false);
      fetchInvestors();
    } catch (err) {
      console.error('Failed to add investor:', err);
    }
  };

  const handleDeleteInvestor = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/investors/${id}`, {
        headers: { 'x-tenant-id': TENANT_ID }
      });
      fetchInvestors();
    } catch (err) {
      console.error('Failed to delete investor:', err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await axios.post('http://localhost:3001/api/founder-profile', founderProfile, {
        headers: { 'x-tenant-id': TENANT_ID }
      });
      alert('Profile saved!');
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  const findMatches = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/api/investor-matches', founderProfile, {
        headers: { 'x-tenant-id': TENANT_ID }
      });
      setMatches(res.data);
      setActiveTab('matches');
    } catch (err) {
      console.error('Failed to find matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayValue = (arr: string[], value: string) => {
    return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-indigo-400';
    return 'text-amber-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-indigo-500';
    return 'bg-amber-500';
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('investors')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === 'investors'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-900 text-slate-500 border border-slate-800'
          }`}
        >
          Investors
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-900 text-slate-500 border border-slate-800'
          }`}
        >
          Your Profile
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === 'matches'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-900 text-slate-500 border border-slate-800'
          }`}
        >
          Matches
        </button>
      </div>

      {/* Investors Tab */}
      {activeTab === 'investors' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Investor Database</h3>
            <button
              onClick={() => setShowAddInvestor(!showAddInvestor)}
              className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Plus size={14} /> Add Investor
            </button>
          </div>

          {showAddInvestor && (
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  value={newInvestor.name}
                  onChange={(e) => setNewInvestor({ ...newInvestor, name: e.target.value })}
                  placeholder="Investor Name *"
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                />
                <input
                  value={newInvestor.firm}
                  onChange={(e) => setNewInvestor({ ...newInvestor, firm: e.target.value })}
                  placeholder="Firm"
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Diversity Focus</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'check_women_founded', label: 'Women Founded' },
                    { key: 'check_minority_founded', label: 'Minority Founded' },
                    { key: 'check_veteran_founded', label: 'Veteran Founded' },
                    { key: 'check_lgbtq_founded', label: 'LGBTQ+ Founded' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setNewInvestor({ ...newInvestor, [key]: !newInvestor[key as keyof Investor] })}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        newInvestor[key as keyof Investor]
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Min Check Size</p>
                  <input
                    type="number"
                    value={newInvestor.min_check_size_usd}
                    onChange={(e) => setNewInvestor({ ...newInvestor, min_check_size_usd: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Max Check Size</p>
                  <input
                    type="number"
                    value={newInvestor.max_check_size_usd}
                    onChange={(e) => setNewInvestor({ ...newInvestor, max_check_size_usd: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Preferred Stages</p>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map(stage => (
                    <button
                      key={stage}
                      onClick={() => setNewInvestor({ ...newInvestor, preferred_stages: toggleArrayValue(newInvestor.preferred_stages || [], stage) })}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        newInvestor.preferred_stages?.includes(stage)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Preferred Sectors</p>
                <div className="flex flex-wrap gap-2">
                  {SECTORS.map(sector => (
                    <button
                      key={sector}
                      onClick={() => setNewInvestor({ ...newInvestor, preferred_sectors: toggleArrayValue(newInvestor.preferred_sectors || [], sector) })}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        newInvestor.preferred_sectors?.includes(sector)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddInvestor}
                className="w-full bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
              >
                Save Investor
              </button>
            </div>
          )}

          {/* Investor List */}
          <div className="space-y-2">
            {investors.map(investor => (
              <div key={investor.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white">{investor.name}</h4>
                  <p className="text-xs text-slate-400">{investor.firm}</p>
                  <div className="flex gap-2 mt-2">
                    {investor.check_women_founded && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-bold">Women</span>
                    )}
                    {investor.check_minority_founded && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">Minority</span>
                    )}
                    {investor.check_veteran_founded && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold">Veteran</span>
                    )}
                    {investor.check_lgbtq_founded && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold">LGBTQ+</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteInvestor(investor.id)}
                  className="p-2 hover:bg-rose-500/20 rounded-lg transition-colors"
                >
                  <Trash2 size={16} className="text-slate-600 hover:text-rose-400" />
                </button>
              </div>
            ))}
            {investors.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-8">No investors yet. Add your first investor above.</p>
            )}
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Founder Profile</h3>
          
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                value={founderProfile.founder_name}
                onChange={(e) => setFounderProfile({ ...founderProfile, founder_name: e.target.value })}
                placeholder="Your Name"
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none"
              />
              <input
                value={founderProfile.company_name}
                onChange={(e) => setFounderProfile({ ...founderProfile, company_name: e.target.value })}
                placeholder="Company Name"
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Demographics (Optional)</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'is_women_founded', label: 'Women Founded' },
                  { key: 'is_minority_founded', label: 'Minority Founded' },
                  { key: 'is_veteran_founded', label: 'Veteran Founded' },
                  { key: 'is_lgbtq_founded', label: 'LGBTQ+ Founded' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFounderProfile({ ...founderProfile, [key]: !founderProfile[key as keyof FounderProfile] })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      founderProfile[key as keyof FounderProfile]
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Stage</p>
              <div className="flex flex-wrap gap-2">
                {STAGES.map(stage => (
                  <button
                    key={stage}
                    onClick={() => setFounderProfile({ ...founderProfile, stage })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      founderProfile.stage === stage
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Sectors</p>
              <div className="flex flex-wrap gap-2">
                {SECTORS.map(sector => (
                  <button
                    key={sector}
                    onClick={() => setFounderProfile({ ...founderProfile, sectors: toggleArrayValue(founderProfile.sectors, sector) })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      founderProfile.sectors.includes(sector)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Funding Needed</p>
              <input
                type="number"
                value={founderProfile.funding_needed_usd}
                onChange={(e) => setFounderProfile({ ...founderProfile, funding_needed_usd: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="w-full bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
            >
              Save Profile
            </button>

            <button
              onClick={findMatches}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Zap size={14} />
              {loading ? 'Finding Matches...' : 'Find Investor Matches'}
            </button>
          </div>
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Investor Matches</h3>
          
          {matches.length === 0 ? (
            <div className="bg-slate-900/30 border border-slate-800 p-8 rounded-xl text-center">
              <Target size={48} className="mx-auto mb-4 text-slate-700" />
              <p className="text-slate-400 text-sm">No matches yet.</p>
              <p className="text-slate-500 text-xs mt-2">Add investors and complete your profile to find matches.</p>
              <button
                onClick={() => setActiveTab('profile')}
                className="mt-4 text-indigo-400 font-bold text-xs hover:underline"
              >
                Complete your profile →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match, idx) => (
                <div key={idx} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-white">{match.investor.name}</h4>
                      <p className="text-xs text-slate-400">{match.investor.firm}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-black ${getScoreColor(match.match_score)}`}>{match.match_score}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">Match Score</p>
                    </div>
                  </div>
                  
                  <div className="h-2 bg-slate-800 rounded-full mb-3">
                    <div 
                      className={`h-full rounded-full transition-all ${getScoreBg(match.match_score)}`} 
                      style={{ width: `${match.match_score}%` }} 
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {match.match_reasons.sectors && (
                      <span className="text-[10px] px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 font-bold flex items-center gap-1">
                        <Briefcase size={10} /> Sector Match
                      </span>
                    )}
                    {match.match_reasons.stage && (
                      <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                        <Target size={10} /> Stage Match
                      </span>
                    )}
                    {match.match_reasons.demographics && (
                      <span className="text-[10px] px-2 py-1 rounded bg-pink-500/20 text-pink-400 font-bold flex items-center gap-1">
                        <Users size={10} /> Diversity Focus
                      </span>
                    )}
                    {match.match_reasons.check_size && (
                      <span className="text-[10px] px-2 py-1 rounded bg-amber-500/20 text-amber-400 font-bold flex items-center gap-1">
                        <DollarSign size={10} /> Check Size
                      </span>
                    )}
                    {match.match_reasons.geography && (
                      <span className="text-[10px] px-2 py-1 rounded bg-blue-500/20 text-blue-400 font-bold flex items-center gap-1">
                        <MapPin size={10} /> Geography
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
