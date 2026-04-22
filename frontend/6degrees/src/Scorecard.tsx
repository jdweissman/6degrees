import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Info, TrendingUp, Lightbulb, Target, BookOpen, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { getResourcesForScore, getRubricForScore, scoringRubric, resourcesByCategory } from './evaluation-resources';

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

const ResourceIcon: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
  switch (type) {
    case 'guide': return <BookOpen size={14} className={className} />;
    case 'template': return <Target size={14} className={className} />;
    case 'video': return <ExternalLink size={14} className={className} />;
    default: return <ExternalLink size={14} className={className} />;
  }
};

const CategoryCard: React.FC<{ item: CategoryScore }> = ({ item }) => {
  const [showResources, setShowResources] = useState(false);
  const resources = getResourcesForScore(item.category, item.score);
  const rubric = getRubricForScore(item.score);

  return (
    <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl hover:border-indigo-500/50 transition-colors group">
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
        <div className="mb-4">
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

      {/* Resources Section */}
      <div className="border-t border-slate-800 pt-3 mt-3">
        <button 
          onClick={() => setShowResources(!showResources)}
          className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest"
        >
          <BookOpen size={12} />
          {showResources ? 'Hide Resources' : 'Get Help'}
          {showResources ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {showResources && (
          <div className="mt-3 space-y-3">
            {/* Rubric Badge */}
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-tighter ${
              rubric.color === 'rose' ? 'bg-rose-500/20 text-rose-400' :
              rubric.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
              rubric.color === 'indigo' ? 'bg-indigo-500/20 text-indigo-400' :
              rubric.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
              'bg-violet-500/20 text-violet-400'
            }`}>
              <span>{rubric.label}</span>
              <span className="text-slate-600">({rubric.range})</span>
            </div>

            {/* Resources List */}
            <div className="space-y-2">
              {resources.map((resource, idx) => (
                <a 
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-xs text-slate-400 hover:text-indigo-400 transition-colors group"
                >
                  <ResourceIcon type={resource.type} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{resource.title}</div>
                    <div className="text-[9px] text-slate-600 uppercase tracking-wider">{resource.source} • {resource.type}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Scorecard: React.FC<ScorecardProps> = ({ 
  scores, 
  overallAssessment,
  recommendedNextSteps = [],
  onGenerateDeck 
}) => {
  const [showRubric, setShowRubric] = useState(false);
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

      {/* Scoring Rubric Accordion */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowRubric(!showRubric)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <BookOpen size={18} className="text-slate-500" />
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Scoring Rubric</span>
          </div>
          {showRubric ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
        </button>

        {showRubric && (
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
            {Object.entries(scoringRubric).map(([key, rubric]) => (
              <div 
                key={key}
                className={`p-3 rounded-xl border ${
                  rubric.color === 'rose' ? 'bg-rose-500/10 border-rose-500/30' :
                  rubric.color === 'orange' ? 'bg-orange-500/10 border-orange-500/30' :
                  rubric.color === 'indigo' ? 'bg-indigo-500/10 border-indigo-500/30' :
                  rubric.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30' :
                  'bg-violet-500/10 border-violet-500/30'
                }`}
              >
                <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${
                  rubric.color === 'rose' ? 'text-rose-400' :
                  rubric.color === 'orange' ? 'text-orange-400' :
                  rubric.color === 'indigo' ? 'text-indigo-400' :
                  rubric.color === 'emerald' ? 'text-emerald-400' :
                  'text-violet-400'
                }`}>
                  {rubric.label}
                </div>
                <div className="text-[9px] text-slate-500 font-mono mb-1">Score: {rubric.range}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{rubric.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 10-Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scores.map((item, idx) => (
          <CategoryCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};
