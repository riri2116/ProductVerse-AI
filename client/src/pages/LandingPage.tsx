import React, { useState } from 'react';
import { useConfigurator } from '../context/ConfiguratorContext';
import { Sparkles, ArrowRight, Eye, Users, ShieldAlert, Cpu, Heart, CheckCircle2, ChevronDown } from 'lucide-react';

export const LandingPage: React.FC<{
  onGetStarted: () => void;
}> = ({ onGetStarted }) => {
  const { category, setCategory, materials, updateMaterial } = useConfigurator();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const getDemoImage = () => {
    if (category === 'car') return '🚗';
    if (category === 'chair') return '🪑';
    return '👟';
  };

  return (
    <div className="w-full flex flex-col space-y-20 relative select-none">
      
      {/* 1. HERO HEADER SECTION */}
      <header className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-slate-950">
        
        {/* Decorative Grid Mesh Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />

        {/* Cinematic Glowing Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 flex flex-col items-center">
          
          {/* Tech badge tag */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[11px] font-bold uppercase tracking-widest font-mono shadow-md animate-pulse">
            <Sparkles className="w-4.5 h-4.5" />
            <span>Product Experience Platform v1.2</span>
          </div>

          {/* Headline Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-3xl">
            Design The Future <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              In Real Time
            </span>
          </h1>

          {/* Subtitle description */}
          <p className="text-sm sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
            ProductVerse AI combines photorealistic 3D configuration, real-time multiplayer coordination, and generative AI design critic audits into a unified enterprise platform.
          </p>

          {/* Call to Actions CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 w-full sm:w-auto">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-violet-600/20 active:scale-95 transition-all group"
            >
              <span>Start Designing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow"
            >
              Try Interactive Sandbox
            </button>
          </div>
        </div>

        {/* Small floating 3D Preview Frame mockup */}
        <div className="mt-12 w-full max-w-4xl h-44 flex items-center justify-center text-8xl filter saturate-75 opacity-80 animate-pulse-slow">
          🚗 🪑 👟
        </div>
      </header>

      {/* 2. CORE FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Platform Modules</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Enterprise-level architecture structured for global industrial design workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: '3D Configurator Studio', desc: 'Adjust physical shaders, metalness, and clearcoat properties on high-poly meshes.', icon: Eye },
            { title: 'Generative AI Designer', desc: 'Input textual design briefs to instantly update mesh colors and material variables.', icon: Cpu },
            { title: 'Multiplayer Coordination', desc: 'Sync spatial pointer cursors and annotations across teams in shared cloud sessions.', icon: Users }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-700/20 flex flex-col justify-between h-56 hover:border-violet-500/25 transition-all">
                <div className="w-10 h-10 rounded-xl bg-violet-600/10 flex items-center justify-center border border-violet-500/20">
                  <Icon className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-100">{feat.title}</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INTERACTIVE 3D SANDBOX DEMO */}
      <section id="demo-section" className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] text-violet-400 font-bold uppercase tracking-widest font-mono">
                Interactive Sandbox
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Paint Your Concept</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Test the configurator capabilities. Switch between catalog categories, pick colors, and update parameters instantly.
              </p>
            </div>

            {/* Model switchers */}
            <div className="flex space-x-1.5">
              {(['car', 'chair', 'sneaker'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    category === cat
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Color Swatches picker */}
            <div className="space-y-3">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Base Coat Paint
              </span>
              <div className="flex space-x-2">
                {['#111111', '#ef4444', '#3b82f6', '#10b981', '#f59e0b'].map((hex) => {
                  const active = (materials.body?.color || materials.sole?.color) === hex;
                  return (
                    <button
                      key={hex}
                      onClick={() => {
                        if (category === 'car') updateMaterial('body', 'color', hex);
                        else if (category === 'chair') updateMaterial('cushions', 'color', hex);
                        else updateMaterial('sole', 'color', hex);
                      }}
                      style={{ backgroundColor: hex }}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        active ? 'border-white scale-110' : 'border-slate-800 hover:scale-105'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sandbox interactive frame preview */}
          <div className="lg:col-span-2 h-72 sm:h-96 rounded-2xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Visual procedurals scale */}
            <div className="text-8xl select-none filter saturate-75 hover:rotate-12 transition-transform duration-500">
              {getDemoImage()}
            </div>
            
            <span className="absolute bottom-4 right-4 bg-slate-900/60 backdrop-blur-md px-3 py-1 text-[10px] text-slate-500 border border-slate-800 rounded-md">
              Configurator Preview Sandbox
            </span>
          </div>

        </div>
      </section>

      {/* 4. DESIGN AUDIT CRITIC SHOWCASE */}
      <section className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Visual Design Critic</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto font-sans">
            AI evaluates assembly specs for styling prestige, manufacturing feasibility, and carbon impacts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-6 rounded-2xl border border-slate-700/20 space-y-4">
            <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest font-mono flex items-center space-x-2">
              <Cpu className="w-4 h-4" />
              <span>Critic scoring index</span>
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Aesthetics', val: 94, clr: 'text-emerald-400' },
                { label: 'Market Appeal', val: 88, clr: 'text-emerald-400' },
                { label: 'Mfg Feasibility', val: 72, clr: 'text-violet-400' },
                { label: 'Luxury Rating', val: 96, clr: 'text-emerald-400' },
                { label: 'Cost Efficiency', val: 65, clr: 'text-amber-400' },
                { label: 'Sustainability', val: 82, clr: 'text-violet-400' }
              ].map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-900 flex flex-col items-center">
                  <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider mb-1">{c.label}</span>
                  <span className={`text-base font-bold font-mono ${c.clr}`}>{c.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-700/20 space-y-4 justify-between flex flex-col">
            <div>
              <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest font-mono">
                Suggestions report
              </h4>
              <ul className="flex flex-col space-y-3.5 mt-4 text-xs text-slate-300">
                <li className="flex items-start space-x-2 leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-violet-600/30 flex items-center justify-center text-[10px] font-bold text-violet-300 shrink-0 mt-0.5">1</span>
                  <span>High specular clearcoat values increase aesthetic premium, but require thermal cures.</span>
                </li>
                <li className="flex items-start space-x-2 leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-violet-600/30 flex items-center justify-center text-[10px] font-bold text-violet-300 shrink-0 mt-0.5">2</span>
                  <span>Magnesium alloy rims lower overall curb weight, but require advanced CNC tools.</span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={onGetStarted}
              className="py-2.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Run Audit In Workspace
            </button>
          </div>
        </div>
      </section>

      {/* 5. LUXURY PRICING TIERS */}
      <section className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Workspace Licensing</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Choose the subscription package built for your design demands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Free Tier', price: '$0', desc: 'Best for individual 3D configurator exploration.', items: ['3 Active Design Projects', 'Standard Material library', 'Procedural rendering viewport', 'Local poster snapshots'] },
            { name: 'Developer Pro', price: '$49', desc: 'Built for professional designers and freelancers.', items: ['Unlimited active projects', 'Full S3 storage allocation', 'Real-time pricing estimates', 'Multiplayer annotations thread', 'AI Critic audits checklist'], active: true },
            { name: 'Enterprise Elite', price: '$299', desc: 'Engineered for globally recognized brand designers.', items: ['Collaborative Voice channels', 'Custom HDRI environments', 'Admin statistics telemetry', 'Docker deployment layouts', 'Dedicated support managers'] }
          ].map((plan, i) => (
            <div
              key={i}
              className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between h-[30rem] relative ${
                plan.active
                  ? 'border-violet-500 shadow-xl shadow-violet-500/5 bg-gradient-to-b from-slate-900/10 to-violet-950/5'
                  : 'border-slate-700/20'
              }`}
            >
              {plan.active && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 border border-violet-400 text-white font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  RECOMMENDED
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-slate-100">{plan.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
                </div>

                <div className="flex items-baseline space-x-1 font-sans">
                  <span className="text-4xl font-extrabold text-slate-100 tracking-tight font-mono">
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>

                <hr className="border-slate-800" />

                <ul className="flex flex-col space-y-2.5 text-xs text-slate-300">
                  {plan.items.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onGetStarted}
                className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  plan.active
                    ? 'bg-violet-600 hover:bg-violet-500 text-white shadow shadow-violet-600/25 active:scale-95'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 active:scale-95'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ SECTION (Accordion) */}
      <section className="max-w-4xl mx-auto px-6 space-y-10 pb-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Quick responses to common system queries.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          {[
            { q: 'Can I upload custom 3D models?', a: 'Yes. ProductVerse AI supports GLTF, GLB, OBJ, and FBX file formats inside logged workspaces. In Sandbox mode, we provide default high-fidelity models for immediate testing.' },
            { q: 'Does the AI Designer support custom prompt styles?', a: 'Our text-to-spec generator parses natural language. Prompts like "dark stealth sports car" or "pink cyberpunk neon sneaker" dynamically match specific material parameters.' },
            { q: 'How does real-time pricing work?', a: 'Every time you adjust material attributes (metalness, clearcoat, textures), our pricing service computes manufacturing tooling complexity, package boxes, and cargo freight costs instantly.' }
          ].map((item, index) => (
            <div key={index} className="glass-panel rounded-2xl border border-slate-700/20 overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-900/40 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4.5 h-4.5 text-slate-400 transition-transform duration-300 ${
                  activeFaq === index ? 'rotate-180' : ''
                }`} />
              </button>

              {activeFaq === index && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 pt-4 animate-fade-in">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-slate-500 leading-normal">
          <div className="space-y-3">
            <span className="font-bold text-slate-200 text-sm">🌌 PRODUCTVERSE AI</span>
            <p className="text-[10px]">
              Design and publish cinematic 3D configurator mockups with advanced AI-critic reports.
            </p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <span className="font-bold text-slate-300">Catalog Presets</span>
            <button onClick={() => setCategory('car')} className="hover:text-slate-300 text-left">Aethera Hypercar</button>
            <button onClick={() => setCategory('chair')} className="hover:text-slate-300 text-left">Vortex Lounge Chair</button>
            <button onClick={() => setCategory('sneaker')} className="hover:text-slate-300 text-left">Nebula Runner</button>
          </div>
          <div className="flex flex-col space-y-1.5">
            <span className="font-bold text-slate-300">Platform Features</span>
            <button onClick={onGetStarted} className="hover:text-slate-300 text-left">Real-Time Sync</button>
            <button onClick={onGetStarted} className="hover:text-slate-300 text-left">Pricing Timelines</button>
            <button onClick={onGetStarted} className="hover:text-slate-300 text-left">AR Placements</button>
          </div>
          <div className="flex flex-col space-y-1.5">
            <span className="font-bold text-slate-300">Legal Telemetry</span>
            <span className="hover:text-slate-300">Privacy Policy</span>
            <span className="hover:text-slate-300">Terms of Service</span>
            <span>© 2026 ProductVerse AI. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
