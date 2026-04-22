import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Save, CheckCircle, Loader2, Info, Lightbulb, BookOpen } from 'lucide-react';
import { categories, categoryGuidance, getGuidanceForCategory } from './evaluation-resources';

interface StartupWizardProps {
  onComplete: (data: any) => void;
  isEvaluating?: boolean;
}

export const StartupWizard: React.FC<StartupWizardProps> = ({ onComplete, isEvaluating = false }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [showGuidance, setShowGuidance] = useState(true);

  const handleNext = () => setStep((s) => Math.min(s + 1, categories.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleChange = (val: string) => {
    setFormData({ ...formData, [categories[step].id]: val });
  };

  const guidance = getGuidanceForCategory(categories[step].id);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
          <span>Step {step + 1} of 10</span>
          <span>{Math.round(((step + 1) / 10) * 100)}% Complete</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500" 
            style={{ width: `${((step + 1) / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl">{categories[step].icon}</span>
          <h2 className="text-xl font-bold text-white">{categories[step].label}</h2>
        </div>
        <p className="text-slate-400 text-sm mb-6">
          {guidance?.description || "Describe this section in detail. Focus on facts and metrics that an investor would look for."}
        </p>
        
        <textarea
          value={formData[categories[step].id] || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Enter details about ${categories[step].label}...`}
          className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 outline-none focus:border-indigo-500 transition-colors resize-none"
        />

        {/* Guidance Panel */}
        {guidance && showGuidance && (
          <div className="mt-6 bg-slate-950/50 border border-slate-800 rounded-xl p-5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-indigo-400" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">What to Include</p>
              </div>
              <button 
                onClick={() => setShowGuidance(false)}
                className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
              >
                Hide
              </button>
            </div>
            
            <ul className="space-y-1.5 mb-5">
              {guidance.whatToInclude.map((item, i) => (
                <li key={i} className="text-xs text-slate-500 flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={16} className="text-amber-400" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Example</p>
            </div>
            <p className="text-xs text-slate-500 italic bg-slate-900 p-3 rounded-lg border border-slate-800 mb-4">
              "{guidance.example}"
            </p>
            
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-emerald-400" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">What Investors Look For</p>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {guidance.investorLens}
            </p>
          </div>
        )}

        {/* Show guidance toggle if hidden */}
        {!showGuidance && (
          <button 
            onClick={() => setShowGuidance(true)}
            className="mt-4 flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <Info size={14} />
            Show guidance for this section
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button 
          onClick={handleBack}
          disabled={step === 0}
          className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm text-slate-400 hover:text-white disabled:opacity-0 transition-all"
        >
          <ChevronLeft size={18} /> Back
        </button>
        
        {step === categories.length - 1 ? (
          <button 
            onClick={() => onComplete(formData)}
            disabled={isEvaluating}
            className={`flex items-center gap-2 px-8 py-2 rounded-lg font-bold text-sm transition-all shadow-lg ${
              isEvaluating 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
            }`}
          >
            {isEvaluating ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <CheckCircle size={18} /> Submit for Evaluation
              </>
            )}
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-indigo-900/20"
          >
            Next <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
