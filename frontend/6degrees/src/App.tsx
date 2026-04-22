import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PlusCircle, 
  Users, 
  Network, 
  Zap, 
  ChevronRight,
  Database,
  AlertCircle,
  CheckCircle2,
  Info,
  FileText
} from 'lucide-react';
import './index.css';
import { StartupWizard } from './StartupWizard';
import { PitchDeck } from './PitchDeck';
import { LinkedInImporter } from './LinkedInImporter';
import { InvestorMatcher } from './InvestorMatcher';
import { CrunchbaseImporter } from './CrunchbaseImporter';

// --- Types ---
interface NodeProps {
  label: string;
  type: 'source' | 'connector' | 'target';
  warmth?: number;
}

interface NetworkData {
  name: string;
  overallReadiness: number;
  network: Array<{
    warmth: number;
    distance: number;
    details: { from: string; via: string; to: string; };
  }>;
}

const TENANT_ID = '00000000-0000-0000-0000-000000000001';

// --- Sub-Components ---
const Node: React.FC<NodeProps> = ({ label, type, warmth = 70 }) => {
  const colorClass = warmth > 80 ? 'text-emerald-400' : warmth > 55 ? 'text-indigo-400' : 'text-rose-400';
  const glowClass = warmth > 80 ? 'shadow-emerald-900/40' : warmth > 55 ? 'shadow-indigo-900/40' : 'shadow-rose-900/40';
  const borderClass = type === 'target' ? (warmth > 80 ? 'border-emerald-500' : 'border-indigo-500') : 'border-slate-700';

  return (
    <div className="text-center min-w-[120px] animate-in zoom-in duration-300">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 mx-auto shadow-xl transition-all duration-700 border-2 ${glowClass} ${borderClass} bg-slate-900`}>
        {type === 'source' && <Users size={24} className={colorClass} />}
        {type === 'connector' && <Zap size={24} className={colorClass} />}
        {type === 'target' && <Network size={24} className={colorClass} />}
      </div>
      <p className="text-[10px] font-black uppercase tracking-tighter text-slate-500 mb-1">{type}</p>
      <p className="text-xs font-bold text-slate-200 leading-tight mb-2 h-8 flex items-center justify-center italic px-2">{label}</p>
      <div className="w-12 h-1 bg-slate-800 mx-auto rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-1000 ${warmth > 80 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${warmth}%` }} />
      </div>
      <p className={`text-[9px] font-black mt-1 uppercase tracking-widest ${colorClass}`}>{warmth}% Access</p>
    </div>
  );
};

const Line = () => (
  <div className="h-[2px] flex-1 bg-slate-800 relative min-w-[40px] mt-[-40px]">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent w-full animate-pulse" />
  </div>
);

const Scorecard = ({ scores, onGenerateDeck }: { scores: any[], onGenerateDeck: () => void }) => {
  const totalScore = scores.reduce((acc, curr) => acc + curr.score, 0);
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
        <div className="text-left">
          <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Overall Readiness</h3>
          <p className="text-3xl font-black text-white">{totalScore}<span className="text-slate-600 text-lg">/100</span></p>
        </div>
        <button onClick={onGenerateDeck} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2">
          <FileText size={16} /> Generate Pitch Outline
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        {scores.map((item, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl hover:border-indigo-500/50 transition-colors group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                {item.score >= 8 ? <CheckCircle2 size={16} className="text-emerald-500" /> : item.score >= 5 ? <Info size={16} className="text-amber-500" /> : <AlertCircle size={16} className="text-rose-500" />}
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-tight">{item.category}</h4>
              </div>
              <span className="text-lg font-black text-indigo-400">{item.score}<span className="text-[10px] text-slate-600">/10</span></span>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full mb-3">
              <div className={`h-full rounded-full transition-all duration-1000 ${item.score >= 8 ? 'bg-emerald-500' : item.score >= 5 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${item.score * 10}%` }} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed italic">"{item.feedback}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [view, setView] = useState<'network' | 'wizard' | 'analysis' | 'pitch-deck' | 'linkedin' | 'investors' | 'crunchbase'>('network');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [founders, setFounders] = useState<any[]>([]);
  const [network, setNetwork] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(false);
  const [evaluationData, setEvaluationData] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => { fetchFounders(); }, []);

  const fetchFounders = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/founders', { headers: { 'x-tenant-id': TENANT_ID } });
      setFounders(res.data);
    } catch (err) { console.error("Fetch error:", err); }
  };

  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    try {
      const res = await axios.post('http://localhost:3001/api/profiles', { full_name: name, email, title, linkedin_url: linkedin }, { headers: { 'x-tenant-id': TENANT_ID } });
      setFounders(prev => [...prev, res.data]);
      setName(''); setEmail(''); setTitle(''); setLinkedin('');
    } catch (err) { console.error("Add error:", err); }
  };

  const handleStartupSubmit = async (formData: any) => {
    setIsEvaluating(true);
    try {
      const res = await axios.post('http://localhost:3001/api/evaluate', formData, {
        headers: { 'x-tenant-id': TENANT_ID }
      });
      setEvaluationData(res.data.data);
      setView('analysis');
    } catch (err) {
      console.error("Evaluation error:", err);
      alert('Evaluation failed. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const getNetwork = async (founderName: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3001/api/network/${encodeURIComponent(founderName)}`, { headers: { 'x-tenant-id': TENANT_ID } });
      setNetwork(res.data);
    } catch (err) { console.error("Network error:", err); } finally { setLoading(false); }
  };

  const mockAnalysis = [
    { category: "Business", score: 8, feedback: "Clear problem-solution fit. The value prop is sharp." },
    { category: "Market", score: 7, feedback: "TAM is large, but need more detail on the specific SOM." },
    { category: "Product", score: 9, feedback: "Proprietary tech provides a strong competitive moat." },
    { category: "Traction", score: 4, feedback: "Early revenue is good, but need more user growth data." },
    { category: "Competition", score: 6, feedback: "Solid analysis, but clarify the long-term defensive moat." },
    { category: "GTM", score: 5, feedback: "Channel strategy is identified; needs specific CAC projections." },
    { category: "Operations", score: 8, feedback: "Lean structure with a clear path to scale." },
    { category: "Team", score: 9, feedback: "Executive experience is a major asset for this round." },
    { category: "Finances", score: 6, feedback: "Projections are realistic; link hiring plan to runway." },
    { category: "The Ask", score: 7, feedback: "Round size is appropriate for an 18-month runway." }
  ];

  // Transform evaluation data into scorecard format
  const getScorecardData = () => {
    if (!evaluationData) return { scores: mockAnalysis, overallAssessment: '', recommendedNextSteps: [] };
    
    const categories = [
      { key: 'business', label: 'Business' },
      { key: 'market', label: 'Market' },
      { key: 'product', label: 'Product' },
      { key: 'traction', label: 'Traction' },
      { key: 'competition', label: 'Competition' },
      { key: 'gtm', label: 'GTM' },
      { key: 'ops', label: 'Operations' },
      { key: 'team', label: 'Team' },
      { key: 'finances', label: 'Finances' },
      { key: 'ask', label: 'The Ask' }
    ];

    const scores = categories.map(cat => {
      const feedback = evaluationData[`feedback_${cat.key}`];
      if (feedback && typeof feedback === 'object') {
        return {
          category: cat.label,
          score: feedback.score || 5,
          feedback: feedback.feedback || 'No feedback available',
          strengths: feedback.strengths || [],
          improvements: feedback.improvements || []
        };
      }
      // Fallback to score columns if feedback not parsed
      return {
        category: cat.label,
        score: evaluationData[`score_${cat.key}`] || 5,
        feedback: 'AI evaluation pending'
      };
    });

    return {
      scores,
      overallAssessment: evaluationData.overall_assessment || '',
      recommendedNextSteps: evaluationData.recommended_next_steps || []
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 pb-6 border-b border-slate-900 gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-900/20"><Database size={24} /></div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-white">6 Degrees</h1>
          </div>
          <form onSubmit={handleAddProfile} className="w-full lg:w-auto grid grid-cols-1 md:grid-cols-2 lg:flex gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <div className="space-y-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name *" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:border-indigo-500 outline-none" required />
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job Title" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:border-indigo-500 outline-none" />
            </div>
            <div className="space-y-2">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:border-indigo-500 outline-none" />
              <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="LinkedIn URL" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:border-indigo-500 outline-none" />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-6 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2">
              <PlusCircle size={18} /> Add
            </button>
          </form>
        </header>

        <div className="flex gap-2 mb-8 flex-wrap">
          <button onClick={() => setView('network')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${view === 'network' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>Network Map</button>
          <button onClick={() => setView('linkedin')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${view === 'linkedin' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>LinkedIn Import</button>
          <button onClick={() => setView('crunchbase')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${view === 'crunchbase' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>Crunchbase</button>
          <button onClick={() => setView('investors')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${view === 'investors' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>Investor Matches</button>
          <button onClick={() => setView('wizard')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${view === 'wizard' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>Startup Wizard</button>
          <button onClick={() => setView('analysis')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${view === 'analysis' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>Scorecard</button>
        </div>

        {view === 'network' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h2 className="text-slate-500 text-xs font-bold uppercase tracking-widest px-2 text-left">Saved Contacts</h2>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
                {founders.map((f) => (
                  <button key={f.id} onClick={() => getNetwork(f.full_name)} className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-all group text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">{f.full_name?.charAt(0) || '?'}</div>
                      <div>
                        <p className="font-semibold text-sm text-slate-300 group-hover:text-white leading-tight">{f.full_name}</p>
                        {f.title && <p className="text-[10px] text-slate-500 group-hover:text-indigo-300 transition-colors">{f.title}</p>}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-700 group-hover:text-indigo-400" />
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 bg-slate-900/30 border border-slate-800 rounded-3xl p-8 min-h-[450px]">
              <h2 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8 text-left">Strategic Access Map</h2>
              {loading ? ( 
                <div className="h-64 flex items-center justify-center animate-pulse text-indigo-500 text-sm font-bold tracking-widest">CALCULATING WARMTH...</div> 
              ) : !network ? (
                <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-600 text-sm">
                  <Zap size={32} className="mb-2 text-slate-800" />
                  Select a contact to view the access path
                </div>
              ) : (
                <div className="space-y-12 py-8">
                  {network.network.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Node label={item.details.from} type="source" warmth={100} />
                      <Line />
                      <Node label={item.details.via} type={item.details.via.includes("Direct") ? "target" : "connector"} warmth={item.distance === 0 ? 100 : Math.min(100, item.warmth + 15)} />
                      <Line />
                      <Node label={item.details.to} type="target" warmth={item.warmth} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : view === 'wizard' ? (
          <StartupWizard onComplete={handleStartupSubmit} isEvaluating={isEvaluating} />
        ) : view === 'analysis' ? (
          <Scorecard 
            scores={getScorecardData().scores} 
            overallAssessment={getScorecardData().overallAssessment}
            recommendedNextSteps={getScorecardData().recommendedNextSteps}
            onGenerateDeck={() => setView('pitch-deck')} 
          />
        ) : view === 'pitch-deck' ? (
          <PitchDeck evaluationData={evaluationData} onBack={() => setView('analysis')} />
        ) : view === 'linkedin' ? (
          <LinkedInImporter />
        ) : view === 'crunchbase' ? (
          <CrunchbaseImporter />
        ) : view === 'investors' ? (
          <InvestorMatcher />
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-left">
            <h2 className="text-2xl font-black mb-6">12-Slide Pitch Outline</h2>
            <p className="text-slate-400 italic">This outline is coming soon...</p>
            <button onClick={() => setView('analysis')} className="text-indigo-400 font-bold text-sm mt-4">← Back to Scorecard</button>
          </div>
        )}
      </div>
    </div>
  );
}