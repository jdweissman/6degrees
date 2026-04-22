import React from 'react';
import { AlertCircle, CheckCircle2, Info, TrendingUp, Lightbulb, Target } from 'lucide-react';

interface CategoryScore {
  category: string;
  score: number;
  feedback: string;
  strengths?: string[];
  improvements?: string[];
}

interface ScorecardProps {
  scores: CategoryScore[];
  overallAssessment?: string;
  recommendedNextSteps?: string[];
  onGenerateDeck?: () => void;
}

export const Scorecard: React.FC<ScorecardProps> = ({ 
  scores, 
  overallAssessment,
  recommendedNextSteps = [],
  onGenerateDeck 
}) => {
  const totalScore = scores.reduce((acc, curr) => acc + curr.score, 0);
  
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Overall Status Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
        <div>
          <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Overall Readiness</h3>
          <p className="text-3xl font-black text-white">{totalScore}<span className="text-slate-600 text-lg">/100</span></p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
              totalScore >= 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {totalScore >= 70 ? 'Investor Ready' : 'Refinement Needed'}
            </span>
          </div>
          {onGenerateDeck && (
            <button 
              onClick={onGenerateDeck}
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <Target size={16} /> Generate Pitch Outline
            </button>
          )}
        </div>
      </div>

      {/* Overall Assessment */}
      {overallAssessment && (
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <TrendingUp size={20} className="text-indigo-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-black text-indigo-200 uppercase tracking-widest mb-2">Analyst Assessment</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{overallAssessment}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Next Steps */}
      {recommendedNextSteps && recommendedNextSteps.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Lightbulb size={20} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-black text-amber-200 uppercase tracking-widest mb-3">Recommended Next Steps</h4>
              <ul className="space-y-2">
                {recommendedNextSteps.map((step, idx) => (
                  <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-amber-500 font-bold">→</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 10-Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scores.map((item, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl hover:border-indigo-500/50 transition-colors group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                {item.score >= 8 ? <CheckCircle2 size={16} className="text-emerald-500" /> : 
                 item.score >= 5 ? <Info size={16} className="text-amber-500" /> : 
                 <AlertCircle size={16} className="text-rose-500" />}
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-tight">{item.category}</h4>
              </div>
              <span className="text-lg font-black text-indigo-400">{item.score}<span className="text-[10px] text-slate-600">/10</span></span>
            </div>
            
            {/* Score Bar */}
            <div className="h-1 w-full bg-slate-800 rounded-full mb-3">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  item.score >= 8 ? 'bg-emerald-500' : item.score >= 5 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${item.score * 10}%` }}
              />
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed italic mb-4">
              "{item.feedback}"
            </p>

            {/* Strengths */}
            {item.strengths && item.strengths.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Strengths</p>
                <ul className="space-y-1">
                  {item.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-emerald-200 flex items-start gap-1.5">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {item.improvements && item.improvements.length > 0 && (
              <div>
                <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">To Improve</p>
                <ul className="space-y-1">
                  {item.improvements.map((s, i) => (
                    <li key={i} className="text-xs text-amber-200 flex items-start gap-1.5">
                      <span className="text-amber-500 mt-0.5">→</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
