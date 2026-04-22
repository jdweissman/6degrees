import React, { useState, useEffect } from 'react';
import { Download, FileText, ChevronLeft, Lightbulb, Target, TrendingUp, Shield, Rocket, Users, DollarSign, ClipboardList, Flag, Layers, Save, FolderOpen, Trash2 } from 'lucide-react';
import axios from 'axios';

interface SlideData {
  number: number;
  title: string;
  icon: React.ReactNode;
  content: string[];
  tips?: string[];
}

interface PitchDeckProps {
  evaluationData: any;
  onBack: () => void;
}

const TENANT_ID = '00000000-0000-0000-0000-000000000001';

interface SavedDeck {
  id: string;
  company_name: string;
  created_at: string;
  updated_at: string;
}

export const PitchDeck: React.FC<PitchDeckProps> = ({ evaluationData, onBack }) => {
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>([]);
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const d = evaluationData?.details || {};
  
  // Parse scores from evaluation or use defaults
  const scores = evaluationData?.scores || [
    { category: 'Business', score: 5 },
    { category: 'Market', score: 5 },
    { category: 'Product', score: 5 },
    { category: 'Competition', score: 5 },
    { category: 'GTM', score: 5 },
    { category: 'Traction', score: 5 },
    { category: 'Operations', score: 5 },
    { category: 'Team', score: 5 },
    { category: 'Finances', score: 5 },
    { category: 'Ask', score: 5 }
  ];

  // Fetch saved decks on mount
  useEffect(() => {
    fetchSavedDecks();
  }, []);

  const fetchSavedDecks = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/decks', {
        headers: { 'x-tenant-id': TENANT_ID }
      });
      setSavedDecks(res.data);
    } catch (err) {
      console.error('Failed to fetch saved decks:', err);
    }
  };

  const handleSaveDeck = async () => {
    if (!deckName.trim()) {
      setSaveMessage({ type: 'error', text: 'Please enter a deck name' });
      return;
    }

    setIsSaving(true);
    try {
      const slideData = slides.map(s => ({
        number: s.number,
        title: s.title,
        content: s.content,
        tips: s.tips
      }));

      const payload = {
        company_name: deckName,
        slide_data: slideData,
        evaluation_id: evaluationData?.id || null
      };

      if (currentDeckId) {
        // Update existing
        await axios.put(`http://localhost:3001/api/decks/${currentDeckId}`, payload, {
          headers: { 'x-tenant-id': TENANT_ID }
        });
        setSaveMessage({ type: 'success', text: 'Deck updated successfully!' });
      } else {
        // Create new
        const res = await axios.post('http://localhost:3001/api/decks', payload, {
          headers: { 'x-tenant-id': TENANT_ID }
        });
        setCurrentDeckId(res.data.id);
        setSaveMessage({ type: 'success', text: 'Deck saved successfully!' });
        fetchSavedDecks();
      }
      
      setTimeout(() => {
        setShowSaveModal(false);
        setSaveMessage(null);
        setDeckName('');
      }, 1500);
    } catch (err: any) {
      console.error('Save error:', err);
      setSaveMessage({ type: 'error', text: 'Failed to save deck' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadDeck = async (deckId: string) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/decks/${deckId}`, {
        headers: { 'x-tenant-id': TENANT_ID }
      });
      setCurrentDeckId(deckId);
      setDeckName(res.data.company_name);
      // Note: In a full implementation, you'd rebuild slides from slide_data here
      setSaveMessage({ type: 'success', text: 'Deck loaded!' });
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (err) {
      console.error('Load error:', err);
      setSaveMessage({ type: 'error', text: 'Failed to load deck' });
      setTimeout(() => setSaveMessage(null), 2000);
    }
  };

  const handleDeleteDeck = async (deckId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this deck?')) return;

    try {
      await axios.delete(`http://localhost:3001/api/decks/${deckId}`, {
        headers: { 'x-tenant-id': TENANT_ID }
      });
      fetchSavedDecks();
      if (currentDeckId === deckId) {
        setCurrentDeckId(null);
        setDeckName('');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const openSaveModal = () => {
    if (currentDeckId && deckName) {
      // Quick save existing deck
      handleSaveDeck();
    } else {
      setDeckName(d.company_name || evaluationData?.company_name || '');
      setShowSaveModal(true);
    }
  };

  const getScore = (category: string) => {
    const s = scores.find(x => x.category.toLowerCase().includes(category.toLowerCase()));
    return s?.score || 5;
  };

  const slides: SlideData[] = [
    {
      number: 1,
      title: 'Problem',
      icon: <Lightbulb size={20} />,
      content: [
        d.business || 'Describe the core problem you are solving',
        'Who experiences this pain point?',
        'How severe is it? (time, money, frustration)'
      ],
      tips: getScore('Business') < 7 ? ['Strengthen: Add specific customer quotes or data points'] : undefined
    },
    {
      number: 2,
      title: 'Solution',
      icon: <Target size={20} />,
      content: [
        'Your unique approach to solving the problem',
        'Why is this better than current alternatives?',
        'What makes it defensible?'
      ],
      tips: getScore('Business') < 7 ? ['Strengthen: Clarify your unique value proposition'] : undefined
    },
    {
      number: 3,
      title: 'Market',
      icon: <TrendingUp size={20} />,
      content: [
        d.market || 'Total Addressable Market (TAM)',
        'Serviceable Addressable Market (SAM)',
        'Serviceable Obtainable Market (SOM) - Year 1-3'
      ],
      tips: getScore('Market') < 7 ? ['Strengthen: Add specific SOM calculation with methodology'] : undefined
    },
    {
      number: 4,
      title: 'Product & Technology',
      icon: <Shield size={20} />,
      content: [
        d.product || 'Key features and capabilities',
        'Technical architecture overview',
        'IP, patents, or proprietary technology'
      ],
      tips: getScore('Product') < 7 ? ['Strengthen: Highlight technical moats or IP'] : undefined
    },
    {
      number: 5,
      title: 'Traction',
      icon: <Rocket size={20} />,
      content: [
        d.traction || 'Current metrics (revenue, users, growth rate)',
        'Key milestones achieved',
        'Customer testimonials or case studies'
      ],
      tips: getScore('Traction') < 7 ? ['Strengthen: Add more user growth data and retention metrics'] : undefined
    },
    {
      number: 6,
      title: 'Competition',
      icon: <Layers size={20} />,
      content: [
        d.competition || 'Competitive landscape',
        'Your positioning matrix',
        'Sustainable competitive advantages'
      ],
      tips: getScore('Competition') < 7 ? ['Strengthen: Clarify long-term defensive moat'] : undefined
    },
    {
      number: 7,
      title: 'Go-to-Market Strategy',
      icon: <Target size={20} />,
      content: [
        d.gtm || 'Customer acquisition channels',
        'Sales cycle and conversion metrics',
        'CAC and LTV projections'
      ],
      tips: getScore('GTM') < 7 ? ['Strengthen: Add specific CAC projections by channel'] : undefined
    },
    {
      number: 8,
      title: 'Business Model',
      icon: <DollarSign size={20} />,
      content: [
        'Revenue streams',
        'Pricing strategy',
        'Unit economics'
      ],
      tips: getScore('Finances') < 7 ? ['Strengthen: Link pricing to customer value metrics'] : undefined
    },
    {
      number: 9,
      title: 'Team',
      icon: <Users size={20} />,
      content: [
        d.team || 'Founder backgrounds and relevant experience',
        'Key hires planned',
        'Advisors and board'
      ],
      tips: getScore('Team') < 7 ? ['Strengthen: Highlight specific domain expertise'] : undefined
    },
    {
      number: 10,
      title: 'Financial Projections',
      icon: <TrendingUp size={20} />,
      content: [
        d.finances || '3-5 year revenue projections',
        'Key assumptions',
        'Use of funds breakdown'
      ],
      tips: getScore('Finances') < 7 ? ['Strengthen: Link hiring plan to runway milestones'] : undefined
    },
    {
      number: 11,
      title: 'The Ask',
      icon: <ClipboardList size={20} />,
      content: [
        d.ask || 'Funding amount and instrument',
        'Runway and milestones to next round',
        'Current cap table (if appropriate)'
      ],
      tips: getScore('Ask') < 7 ? ['Strengthen: Clarify milestone-based use of funds'] : undefined
    },
    {
      number: 12,
      title: 'Vision & Roadmap',
      icon: <Flag size={20} />,
      content: [
        '12-18 month roadmap',
        'Long-term vision (3-5 years)',
        'Exit strategy or endgame'
      ]
    }
  ];

  const generateMarkdown = () => {
    const companyName = d.company_name || 'Untitled Startup';
    const date = new Date().toISOString().split('T')[0];
    
    let md = `# ${companyName} - Pitch Deck\n\n`;
    md += `*Generated on ${date}*\n\n`;
    md += `---\n\n`;

    slides.forEach(slide => {
      md += `## Slide ${slide.number}: ${slide.title}\n\n`;
      slide.content.forEach(c => {
        md += `- ${c}\n`;
      });
      if (slide.tips) {
        md += `\n**Recommendations:**\n`;
        slide.tips.forEach(tip => {
          md += `> ⚠️ ${tip}\n`;
        });
      }
      md += `\n---\n\n`;
    });

    return md;
  };

  const handleExport = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pitch-deck-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Scorecard</span>
          </button>
          {savedDecks.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">|</span>
              <div className="relative group">
                <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                  <FolderOpen size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Saved Decks ({savedDecks.length})</span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-2 max-h-64 overflow-y-auto">
                    {savedDecks.map(deck => (
                      <div 
                        key={deck.id}
                        onClick={() => handleLoadDeck(deck.id)}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors ${currentDeckId === deck.id ? 'bg-slate-800' : ''}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{deck.company_name}</p>
                          <p className="text-[10px] text-slate-500">{new Date(deck.updated_at).toLocaleDateString()}</p>
                        </div>
                        <button 
                          onClick={(e) => handleDeleteDeck(deck.id, e)}
                          className="text-slate-600 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className={`text-xs font-bold uppercase tracking-widest ${saveMessage.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {saveMessage.text}
            </span>
          )}
          <button 
            onClick={openSaveModal}
            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${currentDeckId ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
          >
            <Save size={16} /> {currentDeckId ? 'Update' : 'Save'} Deck
          </button>
          <button 
            onClick={handleExport}
            className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Download size={16} /> Export Markdown
          </button>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-black text-white mb-4">Save Pitch Deck</h3>
            <input
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Enter deck name..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none mb-4"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSaveDeck()}
            />
            {saveMessage && (
              <p className={`text-sm font-bold mb-4 ${saveMessage.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {saveMessage.text}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleSaveDeck}
                disabled={isSaving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
              >
                {isSaving ? 'Saving...' : currentDeckId ? 'Update' : 'Save'}
              </button>
              <button
                onClick={() => { setShowSaveModal(false); setSaveMessage(null); }}
                className="flex-1 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slides */}
      <div className="grid grid-cols-1 gap-4">
        {slides.map((slide) => (
          <div 
            key={slide.number}
            className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-600/20 p-2 rounded-lg text-indigo-400">
                {slide.icon}
              </div>
              <h3 className="text-lg font-black text-white">
                Slide {slide.number}: {slide.title}
              </h3>
            </div>
            
            <ul className="space-y-2 mb-4">
              {slide.content.map((item, idx) => (
                <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {slide.tips && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-4">
                <div className="flex items-start gap-2">
                  <Lightbulb size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    {slide.tips.map((tip, idx) => (
                      <p key={idx} className="text-xs text-amber-200">
                        {tip}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
