import React, { useState } from 'react';
import { useConfigurator } from '../context/ConfiguratorContext';
import { GitBranch, GitCommit, GitPullRequest, RotateCcw } from 'lucide-react';

export const VersionHistoryPanel: React.FC = () => {
  const { versions, saveNewVersion, restoreVersion, loading } = useConfigurator();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await saveNewVersion(name, notes);
    setName('');
    setNotes('');
  };

  return (
    <div className="glass-panel p-6 rounded-2xl w-80 flex flex-col space-y-6 max-h-[85vh] overflow-y-auto glow-border-purple/10">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2">
          <GitBranch className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider font-sans">
            Version History
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-1">Git-like branching & config snapshots</p>
      </div>

      <hr className="border-slate-800" />

      {/* Save commit form */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
          Save Current State
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Version name (e.g. 'Red Sport trim')"
          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500 placeholder-slate-500 transition-colors"
          required
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Release notes / modification details..."
          rows={2}
          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500 placeholder-slate-500 resize-none transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 active:scale-95 transition-all shadow-md"
        >
          <GitCommit className="w-3.5 h-3.5 text-violet-400" />
          <span>Commit Version</span>
        </button>
      </form>

      <hr className="border-slate-800" />

      {/* Commit timeline */}
      <div className="flex flex-col space-y-3">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
          Revision History
        </span>

        <div className="flex flex-col space-y-4 pl-2 relative border-l border-slate-800">
          {versions.map((ver) => (
            <div key={ver.id} className="relative pl-4 group">
              {/* Commit node indicator */}
              <div className="absolute -left-[20px] top-1 w-2 h-2 rounded-full bg-slate-800 border border-slate-950 group-hover:bg-violet-500 transition-colors shadow-md" />
              
              <div className="flex flex-col space-y-1 bg-slate-900/30 border border-slate-900/60 p-3 rounded-xl hover:bg-slate-900/60 transition-colors">
                <div className="flex justify-between items-start">
                  <h5 className="text-[11px] font-bold text-slate-200 truncate pr-2">
                    {ver.name}
                  </h5>
                  <button
                    onClick={() => restoreVersion(ver.id)}
                    title="Restore this version state"
                    className="p-1 text-slate-500 hover:text-violet-400 rounded-lg hover:bg-slate-900 transition-colors active:scale-90"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>

                {ver.notes && (
                  <p className="text-[10px] text-slate-400 leading-normal">
                    {ver.notes}
                  </p>
                )}

                <div className="flex justify-between items-center text-[8px] text-slate-500 pt-1 font-mono">
                  <span>Author: {ver.creator.name}</span>
                  <span>{new Date(ver.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}

          {versions.length === 0 && (
            <div className="p-3 rounded-xl bg-slate-900/20 border border-slate-800/40 text-center pl-0 border-none">
              <p className="text-[10px] text-slate-500">No revisions committed yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default VersionHistoryPanel;
