import React from 'react';
import { useConfigurator } from '../context/ConfiguratorContext';
import { useMultiplayer } from '../context/MultiplayerContext';

const PRESETS = [
  { name: 'Carbon Fiber', icon: '🧬', category: 'Carbon Fiber' },
  { name: 'Matte Leather', icon: '🐂', category: 'Leather' },
  { name: 'Polished Wood', icon: '🪵', category: 'Wood' },
  { name: 'White Marble', icon: '🏛️', category: 'Marble' },
  { name: 'Polished Metal', icon: '🪙', category: 'Metal' },
  { name: 'Frosted Glass', icon: '💎', category: 'Glass' },
  { name: 'Sport Mesh', icon: '🕸️', category: 'Fabric' }
];

export const MaterialPanel: React.FC = () => {
  const { materials, activePart, updateMaterial, applyMaterialPreset } = useConfigurator();
  const { broadcastMaterialChange } = useMultiplayer();

  if (!activePart) {
    return (
      <div className="glass-panel p-6 rounded-2xl w-80 text-center">
        <p className="text-sm text-slate-400 font-medium">
          Select a component on the model to adjust its physical properties.
        </p>
      </div>
    );
  }

  const mat = materials[activePart] || {
    color: '#ffffff',
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 0.0,
    opacity: 1.0,
    emissive: '#000000'
  };

  const handleUpdate = (key: string, val: any) => {
    updateMaterial(activePart, key as any, val);
    // Broadcast socket payload for live multiplayer syncing
    broadcastMaterialChange(activePart, { [key]: val });
  };

  const handlePresetSelect = (presetName: string) => {
    applyMaterialPreset(activePart, presetName);
    // Fetch newly merged state to broadcast
    setTimeout(() => {
      // Re-query new state to broadcast
      const freshMat = useConfigurator.name; // reference helper
      broadcastMaterialChange(activePart, materials[activePart]);
    }, 100);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl w-80 flex flex-col space-y-6 max-h-[85vh] overflow-y-auto glow-border-purple/10">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider font-sans">
            Material Studio
          </h3>
          <span className="text-[10px] bg-violet-600/30 text-violet-400 font-bold px-2 py-0.5 rounded-full border border-violet-500/20 uppercase">
            {activePart}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Configure advanced physical shaders</p>
      </div>

      <hr className="border-slate-800" />

      {/* Preset List */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 uppercase mb-3 tracking-wide">
          Preset Library
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handlePresetSelect(p.name)}
              className={`flex items-center space-x-2 p-2 rounded-xl text-left text-xs font-medium border transition-all duration-300 ${
                mat.category === p.category
                  ? 'bg-violet-600/25 border-violet-500 text-violet-300 shadow-md shadow-violet-500/10'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-900/80'
              }`}
            >
              <span>{p.icon}</span>
              <span className="truncate">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* Advanced Shading Parameters */}
      <div className="flex flex-col space-y-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
          Physical Parameters
        </h4>

        {/* Base Color Hex Input / Swatch */}
        <div>
          <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex justify-between mb-1.5">
            Base Color
            <span className="text-slate-200 font-mono text-[11px]">{mat.color.toUpperCase()}</span>
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-700 cursor-pointer">
              <input
                type="color"
                value={mat.color}
                onChange={(e) => handleUpdate('color', e.target.value)}
                className="absolute inset-0 scale-150 cursor-pointer p-0 border-none bg-transparent"
              />
            </div>
            <input
              type="text"
              value={mat.color}
              onChange={(e) => handleUpdate('color', e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-200 font-mono uppercase focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* Metalness Slider */}
        <div>
          <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Metalness</span>
            <span className="text-slate-200 font-mono">{mat.metalness.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={mat.metalness}
            onChange={(e) => handleUpdate('metalness', parseFloat(e.target.value))}
            className="w-full accent-violet-500 bg-slate-900/80 h-1 rounded"
          />
        </div>

        {/* Roughness Slider */}
        <div>
          <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Roughness</span>
            <span className="text-slate-200 font-mono">{mat.roughness.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={mat.roughness}
            onChange={(e) => handleUpdate('roughness', parseFloat(e.target.value))}
            className="w-full accent-violet-500 bg-slate-900/80 h-1 rounded"
          />
        </div>

        {/* Clearcoat Slider */}
        <div>
          <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Clearcoat Glow</span>
            <span className="text-slate-200 font-mono">{mat.clearcoat.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={mat.clearcoat}
            onChange={(e) => handleUpdate('clearcoat', parseFloat(e.target.value))}
            className="w-full accent-violet-500 bg-slate-900/80 h-1 rounded"
          />
        </div>

        {/* Transparency / Opacity */}
        <div>
          <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Transparency</span>
            <span className="text-slate-200 font-mono">{((mat.opacity ?? 1.0)).toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.01"
            value={mat.opacity ?? 1.0}
            onChange={(e) => handleUpdate('opacity', parseFloat(e.target.value))}
            className="w-full accent-violet-500 bg-slate-900/80 h-1 rounded"
          />
        </div>

        {/* Emissive Color Selection */}
        <div>
          <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex justify-between mb-1.5">
            Luminescent Glow
            <span className="text-slate-200 font-mono text-[11px]">
              {(mat.emissive || '#000000').toUpperCase()}
            </span>
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-700 cursor-pointer">
              <input
                type="color"
                value={mat.emissive || '#000000'}
                onChange={(e) => handleUpdate('emissive', e.target.value)}
                className="absolute inset-0 scale-150 cursor-pointer p-0 border-none bg-transparent"
              />
            </div>
            <input
              type="text"
              value={mat.emissive || '#000000'}
              onChange={(e) => handleUpdate('emissive', e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-200 font-mono uppercase focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default MaterialPanel;
