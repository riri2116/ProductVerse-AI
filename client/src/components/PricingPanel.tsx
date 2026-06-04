import React from 'react';
import { useConfigurator } from '../context/ConfiguratorContext';
import { Coins, Factory, Info, Leaf, Scale, Clock } from 'lucide-react';

export const PricingPanel: React.FC = () => {
  const { pricing, simulation, category } = useConfigurator();

  return (
    <div className="glass-panel p-6 rounded-2xl w-80 flex flex-col space-y-6 max-h-[85vh] overflow-y-auto glow-border-purple/10">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider font-sans">
            Cost & Production
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-1">Real-time bills of materials & schedules</p>
      </div>

      <hr className="border-slate-800" />

      {/* Bill of Materials Costs */}
      <div className="flex flex-col space-y-3">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center space-x-1.5">
          <Coins className="w-3.5 h-3.5 text-violet-400" />
          <span>BOM Cost Summary</span>
        </h4>
        <div className="flex flex-col space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-900">
            <span className="text-slate-400">Material Cost</span>
            <span className="text-slate-200 font-mono font-semibold">${pricing.materialCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-900">
            <span className="text-slate-400">Tooling & Mfg Cost</span>
            <span className="text-slate-200 font-mono font-semibold">${pricing.manufacturingCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-900">
            <span className="text-slate-400">Luxury Packing Box</span>
            <span className="text-slate-200 font-mono font-semibold">${pricing.packagingCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-900">
            <span className="text-slate-400">International Logistics</span>
            <span className="text-slate-200 font-mono font-semibold">${pricing.shippingCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1.5 mt-1 rounded bg-slate-950/60 px-2 border border-slate-900 text-slate-300 font-medium">
            <span>Total Landed Cost</span>
            <span className="font-mono text-slate-200 font-bold">${pricing.totalCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-900">
            <span className="text-slate-400">Calculated Profit Margin</span>
            <span className="text-emerald-400 font-mono font-semibold">{pricing.profitMargin}%</span>
          </div>
          <div className="flex justify-between py-2.5 mt-2 rounded bg-violet-950/20 px-3 border border-violet-500/20 font-bold text-sm">
            <span className="text-violet-200">Recommended Retail (RRP)</span>
            <span className="font-mono text-violet-400 text-base">${pricing.retailPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* Assembly Statistics */}
      <div className="flex flex-col space-y-3">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center space-x-1.5">
          <Factory className="w-3.5 h-3.5 text-violet-400" />
          <span>Manufacturing Metrics</span>
        </h4>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-900 flex flex-col space-y-1">
            <div className="flex items-center space-x-1 text-slate-500">
              <Scale className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[9px] uppercase font-bold tracking-wider">Weight Load</span>
            </div>
            <span className="text-slate-200 font-semibold font-mono">
              {category === 'car' ? '1,320 kg' : category === 'chair' ? '36.5 kg' : '820 g'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-900 flex flex-col space-y-1">
            <div className="flex items-center space-x-1 text-slate-500">
              <Leaf className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[9px] uppercase font-bold tracking-wider">Carbon Cost</span>
            </div>
            <span className="text-slate-200 font-semibold font-mono text-emerald-400">
              {simulation.carbonFootprintKg} kg CO2
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-900 flex flex-col space-y-1">
            <div className="flex items-center space-x-1 text-slate-500">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[9px] uppercase font-bold tracking-wider">Time Index</span>
            </div>
            <span className="text-slate-200 font-semibold font-mono">
              {simulation.totalTimeHours} Hours
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-900 flex flex-col space-y-1">
            <div className="flex items-center space-x-1 text-slate-500">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[9px] uppercase font-bold tracking-wider">Complexity</span>
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-violet-600/25 text-violet-400 border border-violet-500/20 mt-0.5 self-start">
              {simulation.difficulty}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* Vertical timeline of assembly stages */}
      <div className="flex flex-col space-y-3">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
          Production Sequence
        </h4>

        <div className="flex flex-col space-y-4 pl-2 relative border-l border-slate-800">
          {simulation.steps.map((s, idx) => (
            <div key={idx} className="relative pl-4">
              {/* Colored Dot indicator */}
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-violet-500 border border-slate-950 shadow-md shadow-violet-500/50" />
              
              <div className="flex justify-between items-baseline mb-0.5">
                <h5 className="text-[11px] font-bold text-slate-200">{s.name}</h5>
                <span className="text-[9px] text-slate-500 font-mono font-bold shrink-0 ml-1">
                  ⏱️ {s.durationHours}h
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PricingPanel;
