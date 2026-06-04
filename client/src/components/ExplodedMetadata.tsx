import React from 'react';
import { useConfigurator } from '../context/ConfiguratorContext';

// Procedural part dictionary details
const PART_METADATA: Record<string, Record<string, { name: string; weight: string; cost: string; carbon: string; difficulty: string }>> = {
  car: {
    body: { name: 'Carbon Composite Monocoque', weight: '220 kg', cost: '$18,500', carbon: '850 kg CO2', difficulty: 'Extreme' },
    wheels: { name: 'Forged Magnesium Rims', weight: '36 kg (set)', cost: '$4,200', carbon: '120 kg CO2', difficulty: 'High' },
    calipers: { name: 'Carbon Ceramic Braking System', weight: '12 kg', cost: '$2,800', carbon: '45 kg CO2', difficulty: 'Medium' },
    glass: { name: 'Laminated Acoustic Windshield', weight: '15 kg', cost: '$1,400', carbon: '20 kg CO2', difficulty: 'Low' },
    interior: { name: 'Matte Leather Cockpit Seating', weight: '45 kg', cost: '$5,500', carbon: '95 kg CO2', difficulty: 'High' }
  },
  chair: {
    base: { name: 'Solid Carrara Marble Base', weight: '22 kg', cost: '$320', carbon: '15 kg CO2', difficulty: 'High' },
    cushions: { name: 'Full-Grain Stitch Leather cushions', weight: '6.5 kg', cost: '$280', carbon: '35 kg CO2', difficulty: 'Medium' },
    frame: { name: 'Polished Tubular Steel Frame', weight: '8.0 kg', cost: '$180', carbon: '22 kg CO2', difficulty: 'Low' }
  },
  sneaker: {
    sole: { name: 'Thermo-Injected EVA Foam Sole', weight: '240 g', cost: '$28', carbon: '2.5 kg CO2', difficulty: 'Medium' },
    upper: { name: 'Recycled Polymer Weave Upper', weight: '180 g', cost: '$35', carbon: '1.2 kg CO2', difficulty: 'High' },
    laces: { name: 'High-Tensile Cord Laces', weight: '15 g', cost: '$4', carbon: '0.1 kg CO2', difficulty: 'Low' },
    accents: { name: 'Reflective TPU Accents', weight: '40 g', cost: '$14', carbon: '0.8 kg CO2', difficulty: 'Medium' }
  }
};

export const ExplodedMetadata: React.FC = () => {
  const { activePart, category, viewMode } = useConfigurator();

  if (viewMode !== 'exploded' || !activePart) return null;

  const data = PART_METADATA[category]?.[activePart];
  if (!data) return null;

  return (
    <div className="absolute right-6 top-24 z-20 glass-panel p-5 rounded-2xl w-80 glow-border-purple/10 animate-fade-in">
      <div className="flex items-center space-x-2 mb-3">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-sans">
          Component Inspector
        </h4>
      </div>

      <h3 className="text-base font-bold text-slate-100 mb-1">{data.name}</h3>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4">
        ID: PV-{category.substring(0, 3).toUpperCase()}-{activePart.toUpperCase()}
      </p>

      <hr className="border-slate-800 mb-4" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">
            Component Cost
          </span>
          <span className="text-sm font-semibold text-slate-200 font-mono">{data.cost}</span>
        </div>
        <div>
          <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">
            Assembly Weight
          </span>
          <span className="text-sm font-semibold text-slate-200 font-mono">{data.weight}</span>
        </div>
        <div>
          <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">
            Carbon Load
          </span>
          <span className="text-sm font-semibold text-slate-200 font-mono">{data.carbon}</span>
        </div>
        <div>
          <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">
            Tooling Difficulty
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 border border-slate-800 text-slate-300">
            {data.difficulty}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800">
        <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-1">
          Manufacturing Code
        </span>
        <div className="p-2 rounded bg-slate-900/60 font-mono text-[10px] text-violet-400 select-all border border-slate-800">
          SEC-G-{category.toUpperCase()}-{activePart.toUpperCase()}
        </div>
      </div>
    </div>
  );
};
export default ExplodedMetadata;
