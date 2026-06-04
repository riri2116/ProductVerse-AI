import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConfigurator } from '../context/ConfiguratorContext';
import { Heart, Download, Search, Sparkles, User, Share2 } from 'lucide-react';

interface MarketplaceItem {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  description: string | null;
  category: string;
  downloads: number;
  likesCount: number;
  user: { name: string; avatar: string | null };
  project: { activeConfig: string; modelUrl: string };
}

export const Marketplace: React.FC<{
  onSelectProject: (id: string) => void;
}> = ({ onSelectProject }) => {
  const { token } = useAuth();
  const { createProject, loadProject } = useConfigurator();

  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});

  const fetchMarketplace = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/marketplace');
      const data = await res.json();
      if (res.ok) setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const handleLike = async (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      alert('Authentication required to bookmark configurations.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/marketplace/${itemId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setLikedItems(prev => ({ ...prev, [itemId]: data.liked }));
        // Adjust likesCount count locally
        setItems(prev => prev.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              likesCount: data.liked ? item.likesCount + 1 : Math.max(0, item.likesCount - 1)
            };
          }
          return item;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemix = async (item: MarketplaceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      alert('Authentication required to remix designs.');
      return;
    }

    const confirmRemix = window.confirm(`Remix "${item.title}"? This forks a duplicate into your workspace.`);
    if (!confirmRemix) return;

    try {
      // 1. Create project
      const modelCat = item.project.modelUrl.includes('car') ? 'car' : item.project.modelUrl.includes('chair') ? 'chair' : 'sneaker';
      const forkId = await createProject(
        `Remix: ${item.title}`,
        `Custom fork of marketplace design spec by ${item.user.name}.`,
        modelCat
      );

      // 2. Sync active config
      await fetch(`http://localhost:3001/api/projects/${forkId}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ configData: JSON.parse(item.project.activeConfig) })
      });

      // 3. Load Project
      await loadProject(forkId);
      onSelectProject(forkId);
    } catch (err) {
      console.error(err);
      alert('Failed to fork design spec.');
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const getCategoryImage = (url: string) => {
    if (url.includes('car')) return '🚗';
    if (url.includes('chair')) return '🪑';
    return '👟';
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-violet-400 font-bold text-xs uppercase tracking-widest mb-1 font-mono">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Community Gallery</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Design Marketplace
          </h1>
          <p className="text-sm text-slate-400 mt-1">Fork, remix, and duplicate assets published by leading designers.</p>
        </div>

        {/* Search Input bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog designs..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500 placeholder-slate-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Categories chips row */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Automotive', 'Furniture', 'Sneaker'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              categoryFilter === cat
                ? 'bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fetching ? (
          // Animated grid skeletons
          <>
            {[1, 2, 3].map((num) => (
              <div key={num} className="glass-panel rounded-2xl border border-slate-700/10 flex flex-col justify-between overflow-hidden h-[28rem] animate-pulse">
                <div className="h-48 bg-slate-900/60" />
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="w-2/3 h-5 bg-slate-800 rounded" />
                    <div className="w-full h-3 bg-slate-800 rounded mt-2" />
                    <div className="w-5/6 h-3 bg-slate-800 rounded mt-1" />
                    <div className="w-1/2 h-4 bg-slate-800 rounded mt-4" />
                  </div>
                  <div className="pt-4 border-t border-slate-850 flex items-center justify-between">
                    <div className="w-16 h-4 bg-slate-850 rounded" />
                    <div className="w-20 h-6 bg-slate-850 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          filteredItems.map((item) => {
            const isLiked = likedItems[item.id] || false;
            return (
              <div
                key={item.id}
                className="glass-panel rounded-2xl border border-slate-700/20 flex flex-col justify-between overflow-hidden group hover:border-violet-500/30 transition-all duration-300 h-[28rem] relative"
              >
                {/* Image Preview Block */}
                <div className="h-48 bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center relative overflow-hidden">
                  <span className="text-6xl filter saturate-75 group-hover:scale-110 transition-transform duration-300">
                    {getCategoryImage(item.project.modelUrl)}
                  </span>
                  
                  {/* Float details */}
                  <div className="absolute top-3 left-3 bg-slate-950/65 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-800 text-[9px] text-slate-400 font-mono">
                    {item.category}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 line-clamp-1 group-hover:text-violet-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description || 'Custom material layout ready for catalog staging.'}
                    </p>

                    <div className="flex items-center space-x-2 mt-4 text-[10px] text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-600" />
                      <span>Published by</span>
                      <img src={item.user.avatar || ''} className="w-4 h-4 rounded-full border border-slate-800" alt="" />
                      <span className="font-semibold text-slate-400">{item.user.name}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-slate-400">
                      {/* Likes */}
                      <button
                        onClick={(e) => handleLike(item.id, e)}
                        className="flex items-center space-x-1 hover:text-red-400 transition-colors text-xs font-mono"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
                        <span>{item.likesCount}</span>
                      </button>
                      {/* Downloads count */}
                      <span className="flex items-center space-x-1 text-xs font-mono text-slate-500">
                        <Download className="w-3.5 h-3.5 text-slate-600" />
                        <span>{item.downloads}</span>
                      </span>
                    </div>

                    {/* Fork Remix CTA */}
                    <button
                      onClick={(e) => handleRemix(item, e)}
                      className="py-1 px-3 bg-violet-600/20 hover:bg-violet-600 text-violet-400 hover:text-white border border-violet-500/20 hover:border-violet-500 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 active:scale-95 transition-all shadow-md shadow-violet-600/5"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Remix Spec</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {filteredItems.length === 0 && (
          <div className="col-span-3 glass-panel p-16 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
            <span className="text-4xl">🌌</span>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              No matching creations found in the public index. Try clearing filters or revising your query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Marketplace;
