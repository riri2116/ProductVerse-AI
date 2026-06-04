import React, { useState } from 'react';
import { useMultiplayer } from '../context/MultiplayerContext';
import { useConfigurator } from '../context/ConfiguratorContext';
import { Users, Send, Check, Mic, UserPlus } from 'lucide-react';

export const MultiplayerPanel: React.FC = () => {
  const { activeUsers, voiceActive, setVoiceActive, socket } = useMultiplayer();
  const { comments, postComment, resolveComment } = useConfigurator();
  const [commentText, setCommentText] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    // Spatial coordinate is set to center [0,0.5,0] for standard flat annotation
    postComment(commentText, 0, 0.5, 0);
    setCommentText('');
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    // Simulate adding cursor elements to multiplayer lists for demo
    alert(`Invitation dispatched to ${inviteEmail}. Peer will sync upon joining.`);
    setInviteEmail('');

    // Trigger fake cursor movement simulation to demonstrate multi-user overlay
    if (socket) {
      // Broadcast cursor ticks locally
      let angle = 0;
      const interval = setInterval(() => {
        angle += 0.05;
        // Simulate a rotating orbital coordinate cursor
        socket.emit('cursor-move', {
          x: Math.sin(angle) * 1.5,
          y: 0.5 + Math.cos(angle * 2) * 0.3,
          z: Math.cos(angle) * 1.5
        });

        // Kill simulator after 40 seconds
        if (angle > 15) clearInterval(interval);
      }, 100);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl w-80 flex flex-col space-y-6 max-h-[85vh] overflow-y-auto glow-border-purple/10">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider font-sans">
            Multiplayer Sync
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-1">Co-edit and converse in real time</p>
      </div>

      <hr className="border-slate-800" />

      {/* Team invite section */}
      <div className="flex flex-col space-y-2">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
          Invite Collaborator
        </span>
        <form onSubmit={handleInvite} className="flex space-x-1">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="designer@brand.com"
            className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500 placeholder-slate-600"
            required
          />
          <button
            type="submit"
            className="px-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl active:scale-95 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      <hr className="border-slate-800" />

      {/* Active members list */}
      <div className="flex flex-col space-y-3">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
          Active Editors ({activeUsers.length})
        </span>
        <div className="flex flex-col space-y-2">
          {activeUsers.map((u, i) => (
            <div key={u.userId || i} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/30 border border-slate-900">
              <div className="flex items-center space-x-2">
                <img src={u.avatar} className="w-6 h-6 rounded-full border border-slate-700" alt="" />
                <span className="text-xs text-slate-300 font-medium">{u.name}</span>
              </div>
              {u.voiceActive ? (
                <span className="text-[9px] text-emerald-400 font-bold uppercase flex items-center space-x-1 font-mono">
                  <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Speaking</span>
                </span>
              ) : (
                <span className="text-[9px] text-slate-600 font-bold uppercase font-mono">Idle</span>
              )}
            </div>
          ))}
        </div>

        {/* Voice toggle */}
        <button
          onClick={() => setVoiceActive(!voiceActive)}
          className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all duration-300 ${
            voiceActive
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>{voiceActive ? 'Microphone Active' : 'Enable Voice Chat'}</span>
        </button>
      </div>

      <hr className="border-slate-800" />

      {/* Spatial / Annotations feed */}
      <div className="flex flex-col space-y-3">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
          Reviews & Thread comments
        </span>

        {/* List annotations */}
        <div className="flex flex-col space-y-2.5 max-h-40 overflow-y-auto pr-1">
          {comments.filter(c => !c.isResolved).map((c) => (
            <div key={c.id} className="flex flex-col space-y-1 p-2.5 rounded-xl bg-slate-900/30 border border-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-violet-400 font-bold">{c.user.name}</span>
                <button
                  onClick={() => resolveComment(c.id)}
                  className="p-0.5 rounded text-slate-500 hover:text-emerald-400 hover:bg-slate-900 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">{c.text}</p>
            </div>
          ))}

          {comments.filter(c => !c.isResolved).length === 0 && (
            <div className="p-3 text-center">
              <p className="text-[10px] text-slate-500">No review comments yet.</p>
            </div>
          )}
        </div>

        {/* Quick comment entry */}
        <form onSubmit={handleSendComment} className="flex space-x-1">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type comment thread..."
            className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500 placeholder-slate-600"
          />
          <button
            type="submit"
            className="px-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
export default MultiplayerPanel;
