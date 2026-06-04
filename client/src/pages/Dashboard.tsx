import React, { useState, useEffect } from 'react';
import { useConfigurator } from '../context/ConfiguratorContext';
import { useAuth } from '../context/AuthContext';
import { Folder, Plus, CreditCard, Sparkles, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';

interface RecentProject {
  id: string;
  name: string;
  description: string | null;
  modelUrl: string;
  updatedAt: string;
}

export const Dashboard: React.FC<{
  onSelectProject: (id: string) => void;
  onNavigate: (view: string) => void;
}> = ({ onSelectProject, onNavigate }) => {
  const { token, user } = useAuth();
  const { createProject } = useConfigurator();

  const [projects, setProjects] = useState<RecentProject[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('car');
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:3001/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const projId = await createProject(name, description, category);
      setShowCreate(false);
      setName('');
      setDescription('');
      onSelectProject(projId);
    } catch (err) {
      alert(err || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryImage = (url: string) => {
    if (url.includes('car')) return '🚗';
    if (url.includes('chair')) return '🪑';
    return '👟';
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-violet-400 font-bold text-xs uppercase tracking-widest mb-1 font-mono">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Workspace Control</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Welcome back, {user?.name || 'Creator'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage and audit your 3D generative assemblies.</p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 active:scale-95 transition-all shadow-lg shadow-violet-600/15 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Design Spec</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: projects.length, icon: Folder, detail: 'In-cloud storage synced' },
          { label: 'Saved Versions', value: projects.length * 2 + 1, icon: Layers, detail: 'Checkpoints committed' },
          { label: 'Workspace Plan', value: user?.plan || 'FREE', icon: CreditCard, detail: 'Limits matching level' },
          { label: 'Marketplace Reach', value: '499 DLs', icon: TrendingUp, detail: 'Remixes download metrics' }
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-700/20 flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-sans">
                  {m.label}
                </span>
                <Icon className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-slate-100 font-mono tracking-tight">
                  {m.value}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">{m.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Workspace content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent project lists */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest font-sans mb-1">
            Recent Projects
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fetching ? (
              // Animated glass skeleton loaders
              <>
                <div className="glass-panel p-5 rounded-2xl border border-slate-700/10 h-44 animate-pulse flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded bg-slate-800" />
                    <div className="w-16 h-4 rounded bg-slate-800" />
                  </div>
                  <div className="w-2/3 h-5 bg-slate-800 rounded mt-4" />
                  <div className="w-full h-3 bg-slate-800 rounded mt-2" />
                  <div className="w-full h-2 bg-slate-800 rounded mt-1" />
                  <div className="w-full h-4 bg-slate-800 rounded mt-4" />
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-slate-700/10 h-44 animate-pulse flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded bg-slate-800" />
                    <div className="w-16 h-4 rounded bg-slate-800" />
                  </div>
                  <div className="w-1/2 h-5 bg-slate-800 rounded mt-4" />
                  <div className="w-full h-3 bg-slate-800 rounded mt-2" />
                  <div className="w-full h-2 bg-slate-800 rounded mt-1" />
                  <div className="w-full h-4 bg-slate-800 rounded mt-4" />
                </div>
              </>
            ) : (
              projects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  className="glass-panel p-5 rounded-2xl border border-slate-700/20 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-600/5 cursor-pointer flex flex-col justify-between h-44 transition-all duration-300 group"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-3xl filter saturate-75 group-hover:scale-110 transition-transform">
                        {getCategoryImage(p.modelUrl)}
                      </span>
                      <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                        {p.modelUrl.includes('car') ? 'Automotive' : p.modelUrl.includes('chair') ? 'Furniture' : 'Sneaker'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100 mt-3 group-hover:text-violet-400 transition-colors truncate">
                      {p.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-normal">
                      {p.description || 'No detailed specifications loaded.'}
                    </p>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono pt-3 border-t border-slate-800 flex justify-between items-center">
                    <span>Synced</span>
                    <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}

            {!fetching && projects.length === 0 && (
              <div className="col-span-2 glass-panel p-10 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
                <span className="text-3xl">📁</span>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  No active configurator designs in this space yet. Click "New Design Spec" to create one.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar panels (Subscriptions limits & team notifications) */}
        <div className="flex flex-col space-y-6">
          {/* Subscription checklist limits */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-700/20 flex flex-col justify-between h-64 bg-gradient-to-b from-slate-900/10 to-violet-950/5">
            <div>
              <div className="flex items-center space-x-2 text-violet-400 text-xs font-bold uppercase mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscription Limits</span>
              </div>
              <h4 className="text-sm font-bold text-slate-200">ProductVerse limits check</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Free tiers are limited to 3 designs. Pro / Enterprise accounts unlock S3 asset streams, custom HDR maps, and collaborative voice edits.
              </p>
            </div>
            
            <button
              onClick={() => onNavigate('admin')}
              className="w-full py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold active:scale-95 transition-all shadow"
            >
              Configure Accounts
            </button>
          </div>

          {/* Pending invites */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-700/20 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Pending Team Invites
            </h4>
            <div className="flex flex-col space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-violet-600/30 flex items-center justify-center text-xs text-violet-300 font-bold font-mono">
                    SC
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-200">Sarah Connor</h5>
                    <p className="text-[10px] text-slate-500">Nebula Pro Runner X</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Invitation Accepted. Project added to your library.')}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-semibold active:scale-95 transition-all"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Create Project Drawer Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 rounded-3xl w-full max-w-md border border-slate-700/40 shadow-2xl flex flex-col space-y-5 animate-fade-in pointer-events-auto">
            <div>
              <h3 className="text-xl font-bold text-slate-100">Bootstrap 3D Design Spec</h3>
              <p className="text-xs text-slate-400 mt-1">Provide configuration name and category</p>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1.5 block">
                  Project Title
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 'Project Chronos Prototype'"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500 placeholder-slate-600"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1.5 block">
                  Configuration Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'car', name: '🚗 Hypercar' },
                    { id: 'chair', name: '🪑 Lounge' },
                    { id: 'sneaker', name: '👟 Runner' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                        category === cat.id
                          ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1.5 block">
                  Design Brief / Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the design intent..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500 placeholder-slate-600 resize-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl text-xs font-semibold hover:bg-slate-900/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-violet-600/10 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Initialize Spec'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
