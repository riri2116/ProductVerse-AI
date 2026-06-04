import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type ViewMode = 'standard' | 'exploded' | 'story' | 'ar';

export interface MaterialConfig {
  color: string;
  metalness: number;
  roughness: number;
  clearcoat: number;
  opacity?: number;
  emissive?: string;
  normalScale?: number;
  category?: string; // Predefined categories (Carbon Fiber, Leather, Wood, Marble, Chrome)
}

export interface PricingInfo {
  materialCost: number;
  manufacturingCost: number;
  packagingCost: number;
  shippingCost: number;
  profitMargin: number;
  totalCost: number;
  retailPrice: number;
}

export interface MfgStep {
  name: string;
  durationHours: number;
  description: string;
  cost: number;
}

export interface MfgSimulation {
  steps: MfgStep[];
  totalTimeHours: number;
  difficulty: 'Low' | 'Medium' | 'High' | 'Extreme';
  carbonFootprintKg: number;
  materialUsageGrams: number;
}

export interface CriticReview {
  visualScore: number;
  marketAppeal: number;
  feasibility: number;
  luxuryRating: number;
  costEfficiency: number;
  accessibility: number;
  suggestions: string[];
}

export interface ProjectComment {
  id: string;
  text: string;
  posX: number;
  posY: number;
  posZ: number;
  isResolved: boolean;
  user: { name: string; avatar: string | null };
  createdAt: string;
}

export interface ProjectVersion {
  id: string;
  name: string;
  notes: string | null;
  configData: string;
  creator: { name: string };
  createdAt: string;
}

interface ConfiguratorContextType {
  projectId: string | null;
  projectName: string;
  projectDescription: string;
  category: 'car' | 'chair' | 'sneaker';
  modelUrl: string;
  materials: Record<string, MaterialConfig>;
  activePart: string | null;
  viewMode: ViewMode;
  environment: string; // Studio, Neon, Warm, Dramatic
  pricing: PricingInfo;
  simulation: MfgSimulation;
  critic: CriticReview | null;
  comments: ProjectComment[];
  versions: ProjectVersion[];
  loading: boolean;
  
  setCategory: (cat: 'car' | 'chair' | 'sneaker') => void;
  setActivePart: (part: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setEnvironment: (env: string) => void;
  updateMaterial: (part: string, key: keyof MaterialConfig, value: any) => void;
  applyMaterialPreset: (part: string, presetName: string) => void;
  loadProject: (id: string) => Promise<void>;
  createProject: (name: string, description: string, cat: string) => Promise<string>;
  saveNewVersion: (name: string, notes: string) => Promise<void>;
  restoreVersion: (verId: string) => Promise<void>;
  postComment: (text: string, x: number, y: number, z: number) => Promise<void>;
  resolveComment: (commentId: string) => Promise<void>;
  triggerAiGenerate: (prompt: string) => Promise<void>;
  triggerAiCritic: (promptContext?: string) => Promise<void>;
  updatePricingAndSimulation: () => void;
}

const ConfiguratorContext = createContext<ConfiguratorContextType | undefined>(undefined);

const PRESET_MATERIALS: Record<string, Partial<MaterialConfig>> = {
  'Carbon Fiber': { color: '#1a1a1a', metalness: 0.8, roughness: 0.2, clearcoat: 1.0, category: 'Carbon Fiber' },
  'Matte Leather': { color: '#703e3e', metalness: 0.1, roughness: 0.7, clearcoat: 0.0, category: 'Leather' },
  'Polished Wood': { color: '#855b32', metalness: 0.1, roughness: 0.4, clearcoat: 0.5, category: 'Wood' },
  'White Marble': { color: '#eaeaea', metalness: 0.2, roughness: 0.15, clearcoat: 0.9, category: 'Marble' },
  'Polished Metal': { color: '#b0b3b8', metalness: 0.9, roughness: 0.15, clearcoat: 0.4, category: 'Metal' },
  'Frosted Glass': { color: '#a0c0e0', metalness: 0.1, roughness: 0.25, clearcoat: 1.0, opacity: 0.5, category: 'Glass' },
  'Sport Mesh': { color: '#ec4899', metalness: 0.0, roughness: 0.8, clearcoat: 0.0, category: 'Fabric' }
};

const DEFAULT_CAR_CONFIG = {
  body: { color: '#111111', metalness: 0.9, roughness: 0.15, clearcoat: 1.0, category: 'Metal' },
  wheels: { color: '#1f2937', metalness: 0.8, roughness: 0.35, clearcoat: 0.2, category: 'Metal' },
  calipers: { color: '#ef4444', metalness: 0.9, roughness: 0.1, clearcoat: 0.8, category: 'Metal' },
  glass: { color: '#3b82f6', metalness: 0.1, roughness: 0.05, clearcoat: 1.0, opacity: 0.4, category: 'Glass' },
  interior: { color: '#7f1d1d', metalness: 0.0, roughness: 0.7, clearcoat: 0.0, category: 'Leather' }
};

const DEFAULT_CHAIR_CONFIG = {
  base: { color: '#eaeaea', metalness: 0.2, roughness: 0.1, clearcoat: 0.8, category: 'Marble' },
  cushions: { color: '#7f1d1d', metalness: 0.0, roughness: 0.7, clearcoat: 0.0, category: 'Leather' },
  frame: { color: '#1e293b', metalness: 0.9, roughness: 0.2, clearcoat: 0.5, category: 'Metal' }
};

const DEFAULT_SNEAKER_CONFIG = {
  sole: { color: '#10b981', metalness: 0.1, roughness: 0.6, clearcoat: 0.0, category: 'Rubber' },
  upper: { color: '#0f172a', metalness: 0.2, roughness: 0.5, clearcoat: 0.1, category: 'Fabric' },
  laces: { color: '#ef4444', metalness: 0.0, roughness: 0.9, clearcoat: 0.0, category: 'Fabric' },
  accents: { color: '#ec4899', metalness: 0.6, roughness: 0.2, clearcoat: 0.8, emissive: '#ec4899', category: 'Plastic' }
};

export const ConfiguratorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('New Configurator Design');
  const [projectDescription, setProjectDescription] = useState('Premium 3D presentation workspace.');
  const [category, setCategoryState] = useState<'car' | 'chair' | 'sneaker'>('car');
  const [modelUrl, setModelUrl] = useState('/models/sports_car.glb');
  const [materials, setMaterials] = useState<Record<string, MaterialConfig>>(DEFAULT_CAR_CONFIG);
  const [activePart, setActivePart] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [environment, setEnvironment] = useState('Studio');
  
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [critic, setCritic] = useState<CriticReview | null>(null);
  const [loading, setLoading] = useState(false);

  const [pricing, setPricing] = useState<PricingInfo>({
    materialCost: 0,
    manufacturingCost: 0,
    packagingCost: 0,
    shippingCost: 0,
    profitMargin: 60,
    totalCost: 0,
    retailPrice: 0
  });

  const [simulation, setSimulation] = useState<MfgSimulation>({
    steps: [],
    totalTimeHours: 0,
    difficulty: 'Medium',
    carbonFootprintKg: 0,
    materialUsageGrams: 0
  });

  // Calculate pricing & manufacturing sim locally or from server
  const updatePricingAndSimulation = () => {
    let materialCost = 25;
    let manufacturingCost = 45;
    let shippingCost = 15;
    let packagingCost = 10;
    let weightModifier = 1.0;

    if (category === 'car') {
      materialCost = 9000;
      manufacturingCost = 11500;
      packagingCost = 1200;
      shippingCost = 450;
      weightModifier = 1200;
    } else if (category === 'chair') {
      materialCost = 140;
      manufacturingCost = 175;
      packagingCost = 75;
      shippingCost = 65;
      weightModifier = 18;
    } else if (category === 'sneaker') {
      materialCost = 30;
      manufacturingCost = 40;
      packagingCost = 12;
      shippingCost = 8;
      weightModifier = 0.9;
    }

    let metalnessCount = 0;
    let clearcoatCount = 0;
    const parts = Object.keys(materials);

    parts.forEach(p => {
      const mat = materials[p];
      if (mat) {
        if (mat.metalness > 0.5) metalnessCount++;
        if (mat.clearcoat > 0.5) clearcoatCount++;
      }
    });

    const mCount = parts.length || 1;
    const finalMatCost = Math.round(materialCost * (1 + (metalnessCount / mCount) * 0.3));
    const finalMfgCost = Math.round(manufacturingCost * (1 + (clearcoatCount / mCount) * 0.25));
    const finalTotalCost = finalMatCost + finalMfgCost + packagingCost + shippingCost;
    const margin = 60; // 60%
    const retailPrice = Math.round(finalTotalCost / (1 - margin / 100));

    setPricing({
      materialCost: finalMatCost,
      manufacturingCost: finalMfgCost,
      packagingCost,
      shippingCost,
      profitMargin: margin,
      totalCost: finalTotalCost,
      retailPrice
    });

    // Simulated steps
    const steps: MfgStep[] = [];
    if (category === 'car') {
      steps.push(
        { name: 'Alloy Casting & Stamping', durationHours: 72, description: 'Composite frame mold pressing and vacuum infusing resins.', cost: Math.round(finalMfgCost * 0.35) },
        { name: 'Pigment Layering', durationHours: 24, description: 'Application of base coat primers and premium high-solids metallics.', cost: Math.round(finalMfgCost * 0.25) },
        { name: 'Polyurethane Clearcoating', durationHours: 12, description: 'Robot applied dual clearcoats, heat cured to high gloss index.', cost: Math.round(finalMfgCost * 0.2) },
        { name: 'Hand Assembly & QC Auditing', durationHours: 36, description: 'Joining cockpit components, leather trims, and alignment sensor sync.', cost: Math.round(finalMfgCost * 0.2) }
      );
    } else if (category === 'chair') {
      steps.push(
        { name: 'CNC Base Milling', durationHours: 4, description: 'Automated 5-axis sculpting of structural supporting legs.', cost: Math.round(finalMfgCost * 0.3) },
        { name: 'Ergonomic Foam Cut', durationHours: 2, description: 'Sizing memory-foam cushions and backing subframes.', cost: Math.round(finalMfgCost * 0.2) },
        { name: 'Leather Stitching', durationHours: 5, description: 'Hand-sewing pattern panels with double-needle lockstitches.', cost: Math.round(finalMfgCost * 0.3) },
        { name: 'Final Assembly & Finishing', durationHours: 2, description: 'Mechanical fastening and wood shell hand waxing.', cost: Math.round(finalMfgCost * 0.2) }
      );
    } else {
      steps.push(
        { name: 'Polymer Sole Injection', durationHours: 1, description: 'Liquid EVA polyurethane expansion molding.', cost: Math.round(finalMfgCost * 0.3) },
        { name: 'Upper Knitting', durationHours: 2, description: 'High-speed knitting of custom colored synthetic fibers.', cost: Math.round(finalMfgCost * 0.3) },
        { name: 'Heat Activation gluing', durationHours: 1, description: 'Thermal pressing of outsole treads onto standard uppers.', cost: Math.round(finalMfgCost * 0.2) },
        { name: 'Packaging & Trim QC', durationHours: 1, description: 'Lacing details inspection and boxing in premium slide drawer.', cost: Math.round(finalMfgCost * 0.2) }
      );
    }

    let totalTime = 0;
    steps.forEach(s => totalTime += s.durationHours);

    setSimulation({
      steps,
      totalTimeHours: totalTime,
      difficulty: totalTime > 100 ? 'Extreme' : totalTime > 10 ? 'High' : 'Medium',
      carbonFootprintKg: category === 'car' ? 4500 : category === 'chair' ? 38 : 6.8,
      materialUsageGrams: category === 'car' ? 1200000 : category === 'chair' ? 14500 : 720
    });
  };

  useEffect(() => {
    updatePricingAndSimulation();
  }, [materials, category]);

  const setCategory = (cat: 'car' | 'chair' | 'sneaker') => {
    setCategoryState(cat);
    if (cat === 'car') {
      setModelUrl('/models/sports_car.glb');
      setMaterials(DEFAULT_CAR_CONFIG);
    } else if (cat === 'chair') {
      setModelUrl('/models/lounge_chair.glb');
      setMaterials(DEFAULT_CHAIR_CONFIG);
    } else {
      setModelUrl('/models/sneaker.glb');
      setMaterials(DEFAULT_SNEAKER_CONFIG);
    }
    setActivePart(null);
    setCritic(null);
  };

  const updateMaterial = (part: string, key: keyof MaterialConfig, value: any) => {
    setMaterials(prev => {
      if (!prev[part]) return prev;
      const updated = {
        ...prev,
        [part]: {
          ...prev[part],
          [key]: value
        }
      };
      
      // Update config on server if project is active
      if (projectId && token) {
        fetch(`http://localhost:3001/api/projects/${projectId}/config`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ configData: updated })
        }).catch(err => console.warn('Could not sync material config with server:', err));
      }
      
      return updated;
    });
  };

  const applyMaterialPreset = (part: string, presetName: string) => {
    const preset = PRESET_MATERIALS[presetName];
    if (preset) {
      setMaterials(prev => {
        if (!prev[part]) return prev;
        const updated = {
          ...prev,
          [part]: {
            ...prev[part],
            ...preset
          }
        };

        if (projectId && token) {
          fetch(`http://localhost:3001/api/projects/${projectId}/config`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ configData: updated })
          }).catch(err => console.warn(err));
        }

        return updated;
      });
    }
  };

  const loadProject = async (id: string) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/projects/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load project.');

      setProjectId(data.id);
      setProjectName(data.name);
      setProjectDescription(data.description || '');
      
      const isCar = data.modelUrl.includes('car');
      const isChair = data.modelUrl.includes('chair');
      const cat = isCar ? 'car' : isChair ? 'chair' : 'sneaker';
      
      setCategoryState(cat);
      setModelUrl(data.modelUrl);
      
      if (data.activeConfig) {
        setMaterials(JSON.parse(data.activeConfig));
      }
      
      setComments(data.comments || []);
      setVersions(data.versions || []);
      setCritic(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (name: string, description: string, cat: string): Promise<string> => {
    if (!token) throw new Error('Unauthenticated.');
    try {
      const res = await fetch('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, category: cat })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      return data.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const saveNewVersion = async (name: string, notes: string) => {
    if (!projectId || !token) return;
    try {
      const res = await fetch(`http://localhost:3001/api/projects/${projectId}/versions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, notes, configData: materials })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Refresh version list
      const creatorName = user ? user.name : 'Active User';
      const addedVer: ProjectVersion = {
        id: data.id,
        name: data.name,
        notes: data.notes,
        configData: data.configData,
        creator: { name: creatorName },
        createdAt: new Date().toISOString()
      };
      setVersions(prev => [addedVer, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const restoreVersion = async (verId: string) => {
    if (!projectId || !token) return;
    try {
      const res = await fetch(`http://localhost:3001/api/projects/${projectId}/versions/${verId}/restore`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMaterials(JSON.parse(data.activeConfig));
      setCritic(null);
    } catch (err) {
      console.error(err);
    }
  };

  const postComment = async (text: string, x: number, y: number, z: number) => {
    if (!projectId || !token) return;
    try {
      const res = await fetch(`http://localhost:3001/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text, posX: x, posY: y, posZ: z })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setComments(prev => [...prev, data]);
    } catch (err) {
      console.error(err);
    }
  };

  const resolveComment = async (commentId: string) => {
    if (!projectId || !token) return;
    try {
      const res = await fetch(`http://localhost:3001/api/projects/${projectId}/comments/${commentId}/resolve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Could not resolve comment.');

      setComments(prev => prev.map(c => c.id === commentId ? { ...c, isResolved: true } : c));
    } catch (err) {
      console.error(err);
    }
  };

  const triggerAiGenerate = async (prompt: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/ai/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, category })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Apply the generated materials
      const newMats = { ...materials };
      data.palette.forEach((item: any) => {
        if (newMats[item.name]) {
          newMats[item.name] = {
            ...newMats[item.name],
            color: item.color,
            metalness: item.metalness,
            roughness: item.roughness,
            clearcoat: item.clearcoat,
            emissive: item.emissive || '#000000',
            opacity: item.opacity ?? newMats[item.name].opacity ?? 1.0
          };
        }
      });
      setMaterials(newMats);
      setCritic(null); // Reset visual scores until critic runs
      
      // Update database if editing active file
      if (projectId && token) {
        await fetch(`http://localhost:3001/api/projects/${projectId}/config`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ configData: newMats })
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const triggerAiCritic = async (promptContext?: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/ai/critic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: materials, category, prompt: promptContext })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCritic(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfiguratorContext.Provider value={{
      projectId, projectName, projectDescription, category, modelUrl, materials, activePart, viewMode, environment, pricing, simulation, critic, comments, versions, loading,
      setCategory, setActivePart, setViewMode, setEnvironment, updateMaterial, applyMaterialPreset, loadProject, createProject, saveNewVersion, restoreVersion, postComment, resolveComment, triggerAiGenerate, triggerAiCritic, updatePricingAndSimulation
    }}>
      {children}
    </ConfiguratorContext.Provider>
  );
};

export const useConfigurator = () => {
  const context = useContext(ConfiguratorContext);
  if (!context) throw new Error('useConfigurator must be used inside a ConfiguratorProvider');
  return context;
};
