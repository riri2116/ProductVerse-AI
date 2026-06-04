import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Workspace } from './pages/Workspace';
import { ConfiguratorProvider } from './context/ConfiguratorContext';
import { MultiplayerProvider } from './context/MultiplayerContext';
import { Sparkles, Key, Sun, Moon } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const [openAuth, setOpenAuth] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    const html = document.documentElement;
    if (themeMode === 'dark') {
      html.classList.remove('dark');
      html.classList.add('light');
      setThemeMode('light');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
      setThemeMode('dark');
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold animate-spin shadow-lg shadow-violet-600/30">
          🌌
        </div>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase animate-pulse">
          Calibrating ProductVerse UI...
        </p>
      </div>
    );
  }

  // 1. Logged in Workspace routing
  if (isAuthenticated && user) {
    return (
      <MultiplayerProvider>
        <Workspace />
      </MultiplayerProvider>
    );
  }

  // 2. Unauthenticated views
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 flex flex-col relative transition-colors duration-300">
      
      {/* Landing top header bar */}
      <nav className="h-16 border-b border-slate-200 dark:border-slate-900 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md px-6 flex items-center justify-between z-40 relative">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setOpenAuth(false)}>
          <span className="text-xl">🌌</span>
          <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase font-sans bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            ProductVerse AI
          </span>
        </div>

        <div className="flex items-center space-x-3.5">
          {/* Light/Dark toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 transition-colors"
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {openAuth ? (
            <button
              onClick={() => setOpenAuth(false)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-200 rounded-xl text-xs font-bold transition-all active:scale-95 shadow"
            >
              Back To Landing
            </button>
          ) : (
            <button
              onClick={() => setOpenAuth(true)}
              className="px-4.5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 active:scale-95 transition-all shadow-md shadow-violet-600/10"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Console Access</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main viewport pages */}
      <div className="flex-1 flex flex-col">
        {openAuth ? (
          <AuthPage />
        ) : (
          <LandingPage onGetStarted={() => setOpenAuth(true)} />
        )}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ConfiguratorProvider>
      <AppContent />
    </ConfiguratorProvider>
  );
};

export default App;
