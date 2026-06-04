import React from 'react';
import { useConfigurator } from '../context/ConfiguratorContext';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import { RefreshCw, RotateCcw, Video, Compass, Mic, Camera, LayoutGrid, Eye, HelpCircle } from 'lucide-react';

interface ToolbarProps {
  onTogglePhotographer: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onTogglePhotographer }) => {
  const {
    category,
    setCategory,
    viewMode,
    setViewMode,
    environment,
    setEnvironment
  } = useConfigurator();

  const {
    isListening,
    commandFeedback,
    startListening,
    stopListening
  } = useVoiceCommands();

  const toggleVoiceListen = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleResetCamera = () => {
    // Rely on Drei OrbitControls reset internally by looking up window triggers or setting coordinate updates
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const clickEvent = new MouseEvent('dblclick', { bubbles: true, cancelable: true });
      canvas.dispatchEvent(clickEvent);
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-3 w-full max-w-2xl px-4 pointer-events-none">
      {/* Speech feedback alerts overlay */}
      {commandFeedback && (
        <div className="px-4 py-2 rounded-full bg-slate-950/90 border border-violet-500/40 text-violet-300 text-[11px] font-mono tracking-wide pointer-events-auto flex items-center space-x-2 animate-bounce shadow-2xl backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          <span>{commandFeedback}</span>
        </div>
      )}

      {/* Main glass panel */}
      <div className="glass-panel p-2.5 rounded-2xl flex items-center justify-between w-full pointer-events-auto backdrop-blur-md shadow-xl border border-slate-700/30">
        
        {/* Preset switch categories */}
        <div className="flex items-center space-x-1">
          {(['car', 'chair', 'sneaker'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                category === cat
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              {cat === 'car' ? '🚗 Hypercar' : cat === 'chair' ? '🪑 Lounge' : '👟 Runner'}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-slate-800" />

        {/* View Mode controls */}
        <div className="flex items-center space-x-1">
          {[
            { id: 'standard', name: 'Studio', icon: Eye },
            { id: 'exploded', name: 'Explode', icon: Compass },
            { id: 'story', name: 'Story', icon: LayoutGrid },
            { id: 'ar', name: 'AR Mode', icon: Video }
          ].map((mode) => {
            const Icon = mode.icon;
            const active = viewMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-300 ${
                  active
                    ? 'bg-slate-800 text-slate-100 border border-slate-700/60 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-violet-400' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">{mode.name}</span>
              </button>
            );
          })}
        </div>

        <div className="h-6 w-px bg-slate-800" />

        {/* Environment drop-down list */}
        <div className="flex items-center space-x-1 text-xs">
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-medium text-slate-300 focus:outline-none hover:border-slate-700 cursor-pointer"
          >
            <option value="Studio">💡 Studio Map</option>
            <option value="Neon">🌌 Neon Sunset</option>
            <option value="Warm">🌇 Golden Hour</option>
            <option value="Dramatic">🔦 Monolithic</option>
          </select>
        </div>

        <div className="h-6 w-px bg-slate-800" />

        {/* Helpers & mic triggers */}
        <div className="flex items-center space-x-1.5">
          {/* Camera snapshot */}
          <button
            onClick={onTogglePhotographer}
            title="Open catalog photographer"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 rounded-xl transition-all active:scale-90"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Reset camera */}
          <button
            onClick={handleResetCamera}
            title="Reset Orbit camera"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 rounded-xl transition-all active:scale-90"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speech commands microphone */}
          <button
            onClick={toggleVoiceListen}
            title="Activate speech voice commands"
            className={`p-2 rounded-xl transition-all duration-300 active:scale-90 relative flex items-center space-x-1.5 ${
              isListening
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 glow-border-purple px-3'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Mic className="w-4 h-4 animate-pulse" />
            {isListening && (
              <span className="flex items-end space-x-0.5 h-3">
                <span className="voice-wave-bar" />
                <span className="voice-wave-bar" />
                <span className="voice-wave-bar" />
                <span className="voice-wave-bar" />
              </span>
            )}
            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Toolbar;
