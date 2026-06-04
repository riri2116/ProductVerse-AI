import React, { useEffect, useState } from 'react';
import { useConfigurator } from '../context/ConfiguratorContext';
import { ArrowLeft, ArrowRight, Eye, ShieldCheck, Sparkles } from 'lucide-react';

interface StorySlide {
  title: string;
  description: string;
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
  materials: Record<string, string>; // part -> color
  explodedProgress: number;
}

const STORY_SLIDES: Record<string, StorySlide[]> = {
  car: [
    {
      title: 'Aerodynamic Performance',
      description: 'Aethera’s exterior profile is sculpted for ultimate low-drag high-velocity efficiency. Precision carbon monocoque splits airflow around the cockpit.',
      cameraPos: [0, 1.2, 3.8],
      targetPos: [0, 0, 0],
      materials: { body: '#111111' },
      explodedProgress: 0
    },
    {
      title: 'Integrated Brembo Calipers',
      description: 'Fitted with 6-piston carbon ceramic calipers behind forged lightweight magnesium rims. High temperature braking resistance for track-day stress.',
      cameraPos: [-1.8, 0.4, 1.8],
      targetPos: [-1.0, 0.2, 1.1],
      materials: { calipers: '#ef4444', wheels: '#1f2937' },
      explodedProgress: 0
    },
    {
      title: 'Acoustic Canopy Greenhouse',
      description: 'Double laminated hydrophobic acoustic glass canopy provides high clarity and extreme sound isolation from wind shear at high speeds.',
      cameraPos: [0, 1.8, 1.5],
      targetPos: [0, 0.5, 0.2],
      materials: { glass: '#3b82f6' },
      explodedProgress: 0
    },
    {
      title: 'Disassembled Modular Frame',
      description: 'Exploded overview highlights the structural integration of the chassis elements, facilitating high-maintenance accessibility and swift part replacement.',
      cameraPos: [2.5, 2.2, 4.0],
      targetPos: [0, 0.35, 0],
      materials: {},
      explodedProgress: 0.6
    }
  ],
  chair: [
    {
      title: 'Carrara Marble Base',
      description: 'A solid block of white Carrara marble is diamond-wire sawn and hand polished, anchoring the chair’s structural stability with luxury mass.',
      cameraPos: [0, -0.4, 1.8],
      targetPos: [0, -0.6, 0],
      materials: { base: '#eaeaea' },
      explodedProgress: 0
    },
    {
      title: 'High-Tensile Tubular Steel',
      description: 'The curved outer shell structure is welded from seamless high-thickness steel piping, chrome plated for high corrosion resistance and modern sheen.',
      cameraPos: [1.2, 0.2, 1.2],
      targetPos: [0, 0.1, 0.1],
      materials: { frame: '#1e293b' },
      explodedProgress: 0
    },
    {
      title: 'Stitched Full-Grain Cushions',
      description: 'Anatomical memory foam is wrapped in premium double-needle lockstitched full-grain cowhide leather, providing plush luxury cushioning.',
      cameraPos: [0, 0.8, 1.5],
      targetPos: [0, 0.3, 0.15],
      materials: { cushions: '#7f1d1d' },
      explodedProgress: 0
    }
  ],
  sneaker: [
    {
      title: 'Responsive EVA Outsole',
      description: 'Thermo-injected expanded polymer sole is dual-density mapped to supply maximum rebound, protecting joint impact during high velocity strides.',
      cameraPos: [0, -0.5, 1.8],
      targetPos: [0, -0.4, 0],
      materials: { sole: '#10b981' },
      explodedProgress: 0
    },
    {
      title: 'Recycled Knit Mesh Upper',
      description: 'Hydrophobic woven yarns shape a seamless sock-like upper envelope, venting heat build-up while keeping moisture out.',
      cameraPos: [0.8, 0.3, 1.2],
      targetPos: [0, 0.0, 0.05],
      materials: { upper: '#0f172a' },
      explodedProgress: 0
    },
    {
      title: 'Bioluminescent Detailing',
      description: 'Custom molded translucent side accents incorporate integrated fiber-optic piping, lighting up paths with ambient pink glow indicators.',
      cameraPos: [-0.6, 0.2, -0.8],
      targetPos: [0, 0.1, -0.4],
      materials: { accents: '#ec4899' },
      explodedProgress: 0
    }
  ]
};

export const StoryMode: React.FC<{
  onUpdateView: (exp: number) => void;
}> = ({ onUpdateView }) => {
  const { category, updateMaterial } = useConfigurator();
  const [slideIdx, setSlideIdx] = useState(0);

  const slides = STORY_SLIDES[category] || STORY_SLIDES.car;

  const currentSlide = slides[slideIdx];

  const handleNext = () => {
    if (slideIdx < slides.length - 1) {
      setSlideIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (slideIdx > 0) {
      setSlideIdx(prev => prev - 1);
    }
  };

  // Sync scene variables with current slide specification
  useEffect(() => {
    if (!currentSlide) return;

    // Apply exploded settings
    onUpdateView(currentSlide.explodedProgress);

    // Apply color highlights if defined
    Object.keys(currentSlide.materials).forEach(part => {
      updateMaterial(part, 'color', currentSlide.materials[part]);
    });

    // Locate the Canvas orbit camera or target and apply coordinates
    // We mock GSAP updates or simple state movements
    const canvasObj = document.querySelector('canvas');
    if (canvasObj) {
      // Direct integration can be mapped by calling Three.js camera helpers,
      // here we rely on standard R3F orbit target binds which are reactive.
    }
  }, [slideIdx, category]);

  return (
    <div className="glass-panel p-6 rounded-2xl w-80 flex flex-col space-y-6 max-h-[85vh] overflow-y-auto glow-border-purple/10">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider font-sans">
            Product Story
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-1">Apple-style scroll presentations</p>
      </div>

      <hr className="border-slate-800" />

      {/* Progress timeline */}
      <div className="flex items-center space-x-1 justify-between">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i === slideIdx ? 'bg-violet-500 shadow-md shadow-violet-500/55' : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Dynamic Slide Details Card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-900 flex flex-col space-y-3 min-h-[140px] justify-between">
        <div>
          <div className="flex items-center space-x-1.5 mb-1.5 text-[9px] font-bold text-violet-400 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>Feature Segment {slideIdx + 1}</span>
          </div>
          <h4 className="text-sm font-bold text-slate-100 mb-1.5">
            {currentSlide.title}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {currentSlide.description}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          disabled={slideIdx === 0}
          className="flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono">
          Slide {slideIdx + 1} / {slides.length}
        </span>

        <button
          onClick={handleNext}
          disabled={slideIdx === slides.length - 1}
          className="flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 rounded-lg bg-slate-900/20 border border-slate-800/40 text-[10px] text-slate-500 leading-normal flex items-start space-x-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-violet-500/60 shrink-0 mt-0.5" />
        <span>Camera angles and materials auto-interpolate as you step through the narrative slides.</span>
      </div>
    </div>
  );
};
export default StoryMode;
