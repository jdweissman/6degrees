import React from 'react';
import { AlertCircle, CheckCircle2, Info, TrendingUp } from 'lucide-react';

interface ScorecardProps {
  scores: {
    category: string;
    score: number;
    feedback: string;
  }[];
}

export const Scorecard: React.FC<ScorecardProps> = ({ scores }) => {
  const totalScore = scores.reduce((acc, curr) => acc + curr.score, 0);
  
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Overall Status Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
        <div>
          <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Overall Readiness</h3>
          <p className="text-3xl font-black text-white">{totalScore}<span className="text-slate-600 text-lg">/100</span></p>
        </div>
        <div className="text-right">
          <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
            totalScore >= 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            {totalScore >= 70 ? 'Investor Ready' : 'Refinement Needed'}
          </span>
        </div>
      </div>

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
            
            <p className="text-xs text-slate-400 leading-relaxed italic">
              "{item.feedback}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};