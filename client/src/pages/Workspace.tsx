import React, { useState } from 'react';
import { useConfigurator } from '../context/ConfiguratorContext';
import { useAuth } from '../context/AuthContext';
import { ConfiguratorCanvas } from '../components/ConfiguratorCanvas';
import { MaterialPanel } from '../components/MaterialPanel';
import { AiPanel } from '../components/AiPanel';
import { ExplodedMetadata } from '../components/ExplodedMetadata';
import { PricingPanel } from '../components/PricingPanel';
import { StoryMode } from '../components/StoryMode';
import { ArMode } from '../components/ArMode';
import { VersionHistoryPanel } from '../components/VersionHistoryPanel';
import { MultiplayerPanel } from '../components/MultiplayerPanel';
import { PhotographerPanel } from '../components/PhotographerPanel';
import { Toolbar } from '../components/Toolbar';
import { Dashboard } from './Dashboard';
import { Marketplace } from './Marketplace';
import { AdminPanel } from './AdminPanel';
import { LayoutDashboard, Compass, Store, Shield, LogOut, Sparkles, GitBranch, Users, Coins } from 'lucide-react';

export const Workspace: React.FC = () => {
  const { logout, user } = useAuth();
  const {
    projectId,
    projectName,
    category,
    viewMode,
    loadProject
  } = useConfigurator();

  // Navigation state: 'dashboard' | 'configurator' | 'marketplace' | 'admin'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'configurator' | 'marketplace' | 'admin'>('dashboard');

  // Floating menus overlays
  const [showAi, setShowAi] = useState(false);
  const [showGit, setShowGit] = useState(false);
  const [showMulti, setShowMulti] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);

  // View state modifications
  const [explodedVal, setExplodedVal] = useState(0);

  const selectProjectAndLoad = async (id: string) => {
    await loadProject(id);
    setActiveTab('configurator');
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const closeOverlays = () => {
    setShowAi(false);
    setShowGit(false);
    setShowMulti(false);
    setShowPricing(false);
    setShowPhoto(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-100 font-sans">
      
      {/* 1. LEFT SIDEBAR NAVIGATION NAVIGATION */}
      <aside className="w-16 md:w-20 bg-slate-950 border-r border-slate-900 flex flex-col items-center py-6 justify-between shrink-0 z-30">
        <div className="flex flex-col items-center space-y-8 w-full">
          {/* Logo brand */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30 text-white font-bold text-lg font-sans">
            🌌
          </div>

          <hr className="w-8 border-slate-800" />

          {/* Nav groups */}
          <nav className="flex flex-col items-center space-y-4 w-full">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
              { id: 'configurator', name: 'Studio', icon: Compass, disabled: !projectId },
              { id: 'marketplace', name: 'Gallery', icon: Store },
              { id: 'admin', name: 'Admin', icon: Shield, disabled: user?.role !== 'ADMIN' }
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.disabled) return;
                    closeOverlays();
                    setActiveTab(tab.id as any);
                  }}
                  disabled={tab.disabled}
                  title={tab.name}
                  className={`relative p-3 rounded-xl transition-all duration-300 ${
                    active
                      ? 'bg-violet-600/20 text-violet-400 border border-violet-500/20 shadow-md'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900 disabled:opacity-20 disabled:pointer-events-none'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {active && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-violet-500 rounded-r" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Sign out session"
          className="p-3 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-xl transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </aside>

      {/* 2. DYNAMIC WORKSPACE PANEL VIEWS */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Render pages based on navigation */}
        {activeTab === 'dashboard' && (
          <Dashboard
            onSelectProject={selectProjectAndLoad}
            onNavigate={(view) => setActiveTab(view as any)}
          />
        )}

        {activeTab === 'marketplace' && (
          <Marketplace onSelectProject={selectProjectAndLoad} />
        )}

        {activeTab === 'admin' && <AdminPanel />}

        {activeTab === 'configurator' && (
          <div className="flex-1 flex flex-col overflow-hidden relative">
            
            {/* Top Workspace Header Bar */}
            <header className="h-14 bg-slate-950/80 border-b border-slate-900 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-slate-900 border border-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded uppercase">
                  {category}
                </span>
                <h2 className="text-sm font-bold text-slate-200 truncate max-w-xs md:max-w-md">
                  {projectName}
                </h2>
              </div>

              {/* Toolbar helper buttons */}
              <div className="flex items-center space-x-1">
                {/* AI Panel trigger */}
                <button
                  onClick={() => { closeOverlays(); setShowAi(!showAi); }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    showAi
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">AI Studio</span>
                </button>

                {/* Pricing panel trigger */}
                <button
                  onClick={() => { closeOverlays(); setShowPricing(!showPricing); }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    showPricing
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Landed Cost</span>
                </button>

                {/* Git timeline trigger */}
                <button
                  onClick={() => { closeOverlays(); setShowGit(!showGit); }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    showGit
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Git Revs</span>
                </button>

                {/* Multiplayer trigger */}
                <button
                  onClick={() => { closeOverlays(); setShowMulti(!showMulti); }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    showMulti
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Multiplayer</span>
                </button>
              </div>
            </header>

            {/* Configurator canvas + right sidebar */}
            <div className="flex-1 flex overflow-hidden relative">
              {/* R3F Canvas */}
              <div className="flex-1 h-full bg-slate-900/10 relative">
                <ConfiguratorCanvas explodedProgress={viewMode === 'exploded' ? 0.6 : explodedVal} />
                
                {/* Floating Bottom Toolbar */}
                <Toolbar onTogglePhotographer={() => { closeOverlays(); setShowPhoto(!showPhoto); }} />
              </div>

              {/* Right Contextual Control Panels */}
              <div className="absolute bottom-4 left-4 right-4 md:bottom-auto md:left-auto md:top-6 md:right-6 z-20 flex space-x-4 pointer-events-auto max-h-[40vh] md:max-h-[85vh] overflow-y-auto">
                {/* Standard shading parameters */}
                {viewMode === 'standard' && !showAi && !showGit && !showMulti && !showPricing && !showPhoto && (
                  <MaterialPanel />
                )}

                {/* Exploded inspector cards */}
                {viewMode === 'exploded' && (
                  <ExplodedMetadata />
                )}

                {/* Story narrative triggers */}
                {viewMode === 'story' && (
                  <StoryMode onUpdateView={(exp) => setExplodedVal(exp)} />
                )}

                {/* AR placements settings */}
                {viewMode === 'ar' && (
                  <ArMode onUpdateScale={() => {}} onUpdatePosition={() => {}} />
                )}

                {/* Secondary Toggled Drawer Overlays */}
                {showAi && <AiPanel />}
                {showGit && <VersionHistoryPanel />}
                {showMulti && <MultiplayerPanel />}
                {showPricing && <PricingPanel />}
                {showPhoto && <PhotographerPanel />}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default Workspace;
