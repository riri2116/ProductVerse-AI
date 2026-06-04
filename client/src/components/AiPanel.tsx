import React, { useState } from 'react';
import { useConfigurator } from '../context/ConfiguratorContext';
import { Sparkles, Activity, ShieldAlert, Award } from 'lucide-react';

const SUGGESTIONS = [
  'Futuristic Stealth Sports Car',
  'Cyberpunk Neon Sneaker',
  'Luxury White Marble Lounge Chair'
];

export const AiPanel: React.FC = () => {
  const { triggerAiGenerate, triggerAiCritic, critic, loading, category } = useConfigurator();
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    await triggerAiGenerate(prompt);
  };

  const handleSuggestionClick = (pill: string) => {
    setPrompt(pill);
    triggerAiGenerate(pill);
  };

  const handleAudit = () => {
    triggerAiCritic(prompt);
  };

  // Helper for circular gauge styling
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/20';
    if (score >= 70) return 'text-violet-400 border-violet-500/20';
    return 'text-amber-400 border-amber-500/20';
  };

  return (
    <div className="glass-panel p-6 rounded-2xl w-80 flex flex-col space-y-6 max-h-[85vh] overflow-y-auto glow-border-purple/10">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider font-sans">
            AI Design Hub
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-1">Automate styling & audit specifications</p>
      </div>

      <hr className="border-slate-800" />

      {/* Generator section */}
      <div className="flex flex-col space-y-3">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
          Generative Theme Engine
        </h4>

        <form onSubmit={handleGenerate} className="flex flex-col space-y-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your design (e.g., 'golden royal trim stealth black'...)"
            rows={3}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500 placeholder-slate-500 resize-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 shadow-lg shadow-violet-600/10 active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{loading ? 'Synthesizing Spec...' : 'Generate Theme'}</span>
          </button>
        </form>

        {/* Suggestion pills */}
        <div className="flex flex-col space-y-1.5 pt-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            Quick Inceptions
          </span>
          <div className="flex flex-col space-y-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestionClick(s)}
                className="text-left px-2.5 py-1.5 rounded-lg bg-slate-900/30 hover:bg-slate-900/70 border border-slate-800/40 text-[10px] text-slate-400 hover:text-slate-200 truncate transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* Critic section */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
            AI Design Critic
          </h4>
          <button
            onClick={handleAudit}
            disabled={loading}
            className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-[10px] font-semibold flex items-center space-x-1 transition-all active:scale-95"
          >
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Run Critic Audit</span>
          </button>
        </div>

        {critic ? (
          <div className="flex flex-col space-y-4 animate-fade-in">
            {/* Critic metrics grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/30 border border-slate-900/80">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Visual</span>
                <span className={`text-base font-bold font-mono ${getScoreColor(critic.visualScore)}`}>
                  {critic.visualScore}
                </span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/30 border border-slate-900/80">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Market</span>
                <span className={`text-base font-bold font-mono ${getScoreColor(critic.marketAppeal)}`}>
                  {critic.marketAppeal}
                </span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/30 border border-slate-900/80">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Mfg Feas</span>
                <span className={`text-base font-bold font-mono ${getScoreColor(critic.feasibility)}`}>
                  {critic.feasibility}
                </span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/30 border border-slate-900/80">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Luxury</span>
                <span className={`text-base font-bold font-mono ${getScoreColor(critic.luxuryRating)}`}>
                  {critic.luxuryRating}
                </span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/30 border border-slate-900/80">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Cost Eff</span>
                <span className={`text-base font-bold font-mono ${getScoreColor(critic.costEfficiency)}`}>
                  {critic.costEfficiency}
                </span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/30 border border-slate-900/80">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Access</span>
                <span className={`text-base font-bold font-mono ${getScoreColor(critic.accessibility)}`}>
                  {critic.accessibility}
                </span>
              </div>
            </div>

            {/* Critique audit feedback */}
            <div className="space-y-2.5">
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Engineering Observations
              </span>
              <ul className="flex flex-col space-y-2">
                {critic.suggestions.map((s, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-[11px] text-slate-300 leading-normal">
                    {idx === 0 ? (
                      <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                    )}
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900/80 text-center">
            <p className="text-[11px] text-slate-400">
              Audit not executed yet. Click "Run Critic Audit" to evaluate this material configurations list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default AiPanel;
