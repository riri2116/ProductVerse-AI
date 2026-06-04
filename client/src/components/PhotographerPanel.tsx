import React, { useState, useRef } from 'react';
import { useConfigurator } from '../context/ConfiguratorContext';
import { Camera, Image as ImageIcon, Download, Sparkles } from 'lucide-react';

const BACKDROPS = [
  { id: 'minimalist', name: 'Studio Minimalist', gradient: 'linear-gradient(135deg, #1e293b, #0f172a)' },
  { id: 'neon', name: 'Cyber Neon Grid', gradient: 'linear-gradient(135deg, #09090b, #1d003a)' },
  { id: 'luxury', name: 'Gold Sovereign Premium', gradient: 'linear-gradient(135deg, #111827, #030712)' }
];

export const PhotographerPanel: React.FC = () => {
  const { projectName, category } = useConfigurator();
  const [activeBackdrop, setActiveBackdrop] = useState('minimalist');
  const [headline, setHeadline] = useState('DESIGN THE FUTURE');
  const [tagline, setTagline] = useState('MADE IN THE PRODUCTVERSE');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Capture Three.js viewport stream and overlay branding
  const handleCapture = () => {
    const r3fCanvas = document.querySelector('canvas');
    if (!r3fCanvas) {
      alert('Could not find 3D viewport canvas. Make sure standard configurator is active.');
      return;
    }

    // Capture base64 snapshot
    const threeSnapshot = r3fCanvas.toDataURL('image/png');
    setCapturedImage(threeSnapshot);

    // Give time to render the modal, then composite onto 2D canvas
    setTimeout(() => {
      compositePoster(threeSnapshot);
    }, 150);
  };

  const compositePoster = (snapshotSrc: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load snapshot image
    const modelImg = new Image();
    modelImg.crossOrigin = 'anonymous';
    modelImg.onload = () => {
      // 1. Draw Background Gradient
      const selectedBack = BACKDROPS.find(b => b.id === activeBackdrop) || BACKDROPS[0];
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (selectedBack.id === 'minimalist') {
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(1, '#0f172a');
      } else if (selectedBack.id === 'neon') {
        grad.addColorStop(0, '#09090b');
        grad.addColorStop(1, '#1d003a');
      } else {
        grad.addColorStop(0, '#111827');
        grad.addColorStop(1, '#030712');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw aesthetic accent circles/shadows
      ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 250, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw Model Snapshot (centered)
      const ratio = modelImg.width / modelImg.height;
      const drawWidth = canvas.width - 60;
      const drawHeight = drawWidth / ratio;
      ctx.drawImage(modelImg, 30, (canvas.height - drawHeight) / 2 - 20, drawWidth, drawHeight);

      // 4. Draw Typography Overlay
      // Category / Tech Badge
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(30, 30, 110, 22);
      ctx.font = 'bold 9px Courier New';
      ctx.fillStyle = '#8b5cf6';
      ctx.fillText(`PV-${category.toUpperCase()}-SPEC-2026`, 38, 44);

      // Studio Branding
      ctx.font = 'bold 10px "Outfit", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText('PRODUCTVERSE AI LABS', canvas.width - 160, 44);

      // Headline (Bottom Left)
      ctx.font = 'bold 24px "Outfit", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(headline.toUpperCase(), 30, canvas.height - 55);

      // Subtitle (Bottom Left)
      ctx.font = 'medium 10px "Inter", sans-serif';
      ctx.fillStyle = '#8b5cf6';
      ctx.fillText(tagline.toUpperCase(), 30, canvas.height - 35);

      // Product Title (Bottom Right)
      ctx.font = 'bold 12px "Outfit", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(projectName.toUpperCase(), canvas.width - 180, canvas.height - 55);

      ctx.font = 'regular 9px "Inter", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillText('HIGH FIDELITY 3D CONFIGURATION', canvas.width - 180, canvas.height - 35);

      // Elegant Border Frame
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
    };
    modelImg.src = snapshotSrc;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${projectName.toLowerCase().replace(/\s+/g, '_')}_poster.png`;
    link.href = dataUrl;
    link.click();
  };

  const triggerBackdropChange = (id: string) => {
    setActiveBackdrop(id);
    if (capturedImage) {
      compositePoster(capturedImage);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl w-80 flex flex-col space-y-6 max-h-[85vh] overflow-y-auto glow-border-purple/10">
      <div>
        <div className="flex items-center space-x-2">
          <Camera className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider font-sans">
            Photographer
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-1">Export cinematic catalog banners</p>
      </div>

      <hr className="border-slate-800" />

      {/* Snapshot triggers */}
      <button
        onClick={handleCapture}
        className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 active:scale-95 transition-all shadow-lg shadow-violet-600/10"
      >
        <Camera className="w-3.5 h-3.5" />
        <span>Capture 3D Scene</span>
      </button>

      {capturedImage && (
        <div className="flex flex-col space-y-4 animate-fade-in">
          {/* Visual Canvas (rendered hidden or small scale, using img wrapper for sizing) */}
          <div className="relative border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full h-auto block rounded-xl bg-slate-900"
            />
          </div>

          <hr className="border-slate-800" />

          {/* Banner Overlays controls */}
          <div className="flex flex-col space-y-3">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              Studio Layout Settings
            </span>

            {/* Backdrop dropdown */}
            <div>
              <label className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1 block">
                Advertising Background
              </label>
              <div className="grid grid-cols-3 gap-1">
                {BACKDROPS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => triggerBackdropChange(b.id)}
                    className={`p-1.5 text-[9px] font-semibold border rounded-lg transition-colors truncate ${
                      activeBackdrop === b.id
                        ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {b.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Headline */}
            <div>
              <label className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1 block">
                Poster Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => {
                  setHeadline(e.target.value);
                  setTimeout(() => capturedImage && compositePoster(capturedImage), 10);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1 block">
                Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => {
                  setTagline(e.target.value);
                  setTimeout(() => capturedImage && compositePoster(capturedImage), 10);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 active:scale-95 transition-all shadow-md shadow-emerald-500/10"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Poster PNG</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default PhotographerPanel;
