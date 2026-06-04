import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, Github } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register, googleLogin } = useAuth();
  
  // Tabs: 'signin' | 'signup' | 'forgot'
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (tab === 'signin') {
        await login(email, password);
      } else if (tab === 'signup') {
        await register(name, email, password);
      } else {
        // Forgot password
        const res = await fetch('http://localhost:3001/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        setSuccessMsg(data.message || 'Verification link sent to your inbox.');
      }
    } catch (err: any) {
      setError(err.message || 'Action failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMock = async () => {
    setError(null);
    setLoading(true);
    try {
      await googleLogin('mock-google-oauth-credential-token-2026');
    } catch (err: any) {
      setError(err.message || 'Google OAuth failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-950">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Auth Card */}
      <div className="glass-panel p-8 rounded-3xl w-full max-w-md border border-slate-700/30 shadow-2xl relative z-10 flex flex-col space-y-6 animate-fade-in pointer-events-auto">
        
        {/* Brand header */}
        <div className="text-center space-y-1">
          <div className="flex justify-center items-center space-x-1 text-violet-400 font-bold text-[10px] tracking-widest uppercase font-mono">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>ProductVerse Auth</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight font-sans">
            {tab === 'signin' ? 'Access Workspace' : tab === 'signup' ? 'Create Account' : 'Recover Credential'}
          </h2>
          <p className="text-xs text-slate-400">
            {tab === 'signin' ? 'Welcome back! Sync your specs.' : tab === 'signup' ? 'Get started for free.' : 'Dispatches email validation checks.'}
          </p>
        </div>

        {/* Error / Success states */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center leading-normal">
            ⚠️ {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold text-center leading-normal">
            ✓ {successMsg}
          </div>
        )}

        {/* Main form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          
          {tab === 'signup' && (
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1.5 block">
                Developer Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500 placeholder-slate-600"
                  required
                />
                <User className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1.5 block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@productverse.ai"
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500 placeholder-slate-600"
                required
              />
              <Mail className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
            </div>
          </div>

          {tab !== 'forgot' && (
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500 placeholder-slate-600"
                  required
                />
                <Lock className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          {tab === 'signin' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => { setError(null); setSuccessMsg(null); setTab('forgot'); }}
                className="text-[10px] text-slate-400 hover:text-violet-400 font-semibold"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center active:scale-95 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Synthesizing Authorization...' : tab === 'signin' ? 'Verify Sign In' : tab === 'signup' ? 'Create Free Account' : 'Verify Email Recovery'}
          </button>
        </form>

        <div className="flex items-center my-2 text-slate-700 text-[10px] uppercase font-bold tracking-wider before:content-[''] before:flex-1 before:h-px before:bg-slate-900 before:mr-3 after:content-[''] after:flex-1 after:h-px after:bg-slate-900 after:ml-3">
          Or Continue With
        </div>

        {/* SSO Mock triggers */}
        <div className="flex space-x-2">
          <button
            onClick={handleGoogleMock}
            className="flex-1 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
          >
            {/* Google Colorful SVG icon */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#ea4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.65 1.42 7.58l3.86 3C6.22 7.72 8.87 5.04 12 5.04z" />
              <path fill="#4285f4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.73-4.94 3.73-8.69z" />
              <path fill="#fbbc05" d="M5.28 14.42c-.25-.76-.4-1.57-.4-2.42s.15-1.66.4-2.42L1.42 7.58C.51 9.42 0 11.51 0 13.68c0 2.17.51 4.26 1.42 6.1l3.86-3.36z" />
              <path fill="#34a853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1-3.13 0-5.78-2.68-6.72-6.54l-3.86 3C3.37 20.35 7.35 23 12 23z" />
            </svg>
            <span>Google Login</span>
          </button>
        </div>

        {/* Footer switches */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-900 flex justify-between items-center">
          {tab === 'signin' ? (
            <>
              <span>New to ProductVerse?</span>
              <button onClick={() => { setError(null); setSuccessMsg(null); setTab('signup'); }} className="text-violet-400 hover:text-violet-300 font-bold">
                Register Account
              </button>
            </>
          ) : (
            <>
              <span>Already registered?</span>
              <button onClick={() => { setError(null); setSuccessMsg(null); setTab('signin'); }} className="text-violet-400 hover:text-violet-300 font-bold">
                Sign In Instead
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
