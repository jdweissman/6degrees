import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Save, CheckCircle, Loader2 } from 'lucide-react';

const categories = [
  { id: 'business', label: 'Business Description', icon: '📝' },
  { id: 'market', label: 'Market Analysis', icon: '🌎' },
  { id: 'product', label: 'Product / Service', icon: '🛠️' },
  { id: 'competition', label: 'Competition', icon: '⚔️' },
  { id: 'gtm', label: 'Go-to-Market', icon: '🚀' },
  { id: 'traction', label: 'Traction', icon: '📈' },
  { id: 'ops', label: 'Operations', icon: '⚙️' },
  { id: 'team', label: 'Management / Team', icon: '👥' },
  { id: 'finances', label: 'Finances', icon: '💰' },
  { id: 'ask', label: 'The Ask', icon: '🎯' },
];

interface StartupWizardProps {
  onComplete: (data: any) => void;
  isEvaluating?: boolean;
}

export const StartupWizard: React.FC<StartupWizardProps> = ({ onComplete, isEvaluating = false }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({});

  const handleNext = () => setStep((s) => Math.min(s + 1, categories.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleChange = (val: string) => {
    setFormData({ ...formData, [categories[step].id]: val });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl">
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
          Describe your {categories[step].label.toLowerCase()} in detail. 
          Focus on facts and metrics that an investor would look for.
        </p>
        <textarea
          value={formData[categories[step].id] || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Enter details about ${categories[step].label}...`}
          className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 outline-none focus:border-indigo-500 transition-colors resize-none"
        />
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
