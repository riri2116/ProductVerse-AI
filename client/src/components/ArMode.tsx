import React, { useState, useEffect } from 'react';
import { useConfigurator } from '../context/ConfiguratorContext';
import { Camera, RefreshCw, ZoomIn, Maximize, Move } from 'lucide-react';

const BACKGROUNDS = [
  { id: 'loft', name: 'Industrial Loft Space', url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80' },
  { id: 'showroom', name: 'Luxury Auto Gallery', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80' },
  { id: 'camera', name: 'Webcam Device Stream (Simulated)', url: '' }
];

export const ArMode: React.FC<{
  onUpdateScale: (s: number) => void;
  onUpdatePosition: (pos: [number, number, number]) => void;
}> = ({ onUpdateScale, onUpdatePosition }) => {
  const { category, projectName } = useConfigurator();
  const [activeBack, setActiveBack] = useState('loft');
  const [scale, setScale] = useState(100); // percentage
  const [rotation, setRotation] = useState(0); // degrees
  const [posX, setPosX] = useState(0);
  const [posZ, setPosZ] = useState(0);

  // Sync canvas adjustments with values
  useEffect(() => {
    onUpdateScale(scale / 100);
  }, [scale]);

  useEffect(() => {
    onUpdatePosition([posX / 100, -0.4, posZ / 100]);
  }, [posX, posZ]);

  // Hook up camera feed helper if simulated webcam is chosen
  useEffect(() => {
    const r3fContainer = document.querySelector('.r3f-canvas-container'); // helper select
    const canvasObj = document.querySelector('canvas');

    if (canvasObj) {
      if (activeBack === 'loft') {
        canvasObj.style.backgroundImage = `url(${BACKGROUNDS[0].url})`;
        canvasObj.style.backgroundSize = 'cover';
        canvasObj.style.backgroundPosition = 'center';
      } else if (activeBack === 'showroom') {
        canvasObj.style.backgroundImage = `url(${BACKGROUNDS[1].url})`;
        canvasObj.style.backgroundSize = 'cover';
        canvasObj.style.backgroundPosition = 'center';
      } else {
        // Mock grey static noise or default camera feed
        canvasObj.style.backgroundImage = 'radial-gradient(circle at center, #334155, #0f172a)';
        canvasObj.style.backgroundSize = 'cover';
      }
    }

    return () => {
      if (canvasObj) {
        canvasObj.style.backgroundImage = 'none';
      }
    };
  }, [activeBack]);

  const handleReset = () => {
    setScale(100);
    setRotation(0);
    setPosX(0);
    setPosZ(0);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl w-80 flex flex-col space-y-6 max-h-[85vh] overflow-y-auto glow-border-purple/10">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Maximize className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider font-sans">
            AR Placement
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-1">Overlay model onto real-world scenes</p>
      </div>

      <hr className="border-slate-800" />

      {/* Background selectors */}
      <div className="flex flex-col space-y-2">
        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
          Select Environment Backdrop
        </label>
        <div className="flex flex-col space-y-1.5">
          {BACKGROUNDS.map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBack(b.id)}
              className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                activeBack === b.id
                  ? 'bg-violet-600/25 border-violet-500 text-violet-300'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* Spacing & Translation Sliders */}
      <div className="flex flex-col space-y-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
          Transform Anchors
        </h4>

        {/* Scale */}
        <div>
          <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1">
              <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
              <span>AR Scale Factor</span>
            </span>
            <span className="text-slate-200 font-mono">{scale}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            value={scale}
            onChange={(e) => setScale(parseInt(e.target.value))}
            className="w-full accent-violet-500 bg-slate-900 h-1 rounded"
          />
        </div>

        {/* Translation X */}
        <div>
          <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1">
              <Move className="w-3.5 h-3.5 text-slate-500" />
              <span>Shift Lateral (X)</span>
            </span>
            <span className="text-slate-200 font-mono">{(posX / 100).toFixed(2)} m</span>
          </div>
          <input
            type="range"
            min="-150"
            max="150"
            value={posX}
            onChange={(e) => setPosX(parseInt(e.target.value))}
            className="w-full accent-violet-500 bg-slate-900 h-1 rounded"
          />
        </div>

        {/* Translation Z */}
        <div>
          <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1">
              <Move className="w-3.5 h-3.5 text-slate-500 rotate-90" />
              <span>Shift Depth (Z)</span>
            </span>
            <span className="text-slate-200 font-mono">{(posZ / 100).toFixed(2)} m</span>
          </div>
          <input
            type="range"
            min="-200"
            max="200"
            value={posZ}
            onChange={(e) => setPosZ(parseInt(e.target.value))}
            className="w-full accent-violet-500 bg-slate-900 h-1 rounded"
          />
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* Resets / Capture */}
      <div className="flex space-x-2">
        <button
          onClick={handleReset}
          className="flex-1 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Alignment</span>
        </button>
      </div>

      <div className="p-3 rounded-lg bg-slate-900/20 border border-slate-800/40 text-[10px] text-slate-500 leading-normal">
        📲 QR code activation link syncs this config instantly to your iOS/Android Safari browser camera overlay.
      </div>
    </div>
  );
};
export default ArMode;
