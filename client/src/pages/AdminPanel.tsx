import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Activity, HardDrive, Database, Terminal, Users, AlertCircle } from 'lucide-react';

interface SystemStats {
  stats: { users: number; projects: number; marketplace: number; logs: number };
  system: { database: string; health: string; storageUsage: string; apiVersion: string };
}

interface AuditLogItem {
  id: string;
  userId: string | null;
  action: string;
  details: string;
  ipAddress: string | null;
  createdAt: string;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  plan: string;
  createdAt: string;
}

export const AdminPanel: React.FC = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'users' | 'audit'>('diagnostics');

  const fetchData = async () => {
    if (!token || user?.role !== 'ADMIN') return;
    try {
      const statsRes = await fetch('http://localhost:3001/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      if (statsRes.ok) setStats(statsData);

      const logsRes = await fetch('http://localhost:3001/api/admin/audit', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const logsData = await logsRes.json();
      if (logsRes.ok) setLogs(logsData);

      const usersRes = await fetch('http://localhost:3001/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const usersData = await usersRes.json();
      if (usersRes.ok) setUsersList(usersData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex-grow p-10 flex flex-col items-center justify-center space-y-3">
        <AlertCircle className="w-12 h-12 text-red-500 animate-pulse" />
        <h3 className="text-xl font-bold text-slate-200">Access Restricted</h3>
        <p className="text-xs text-slate-500 max-w-sm text-center">
          Administrative credentials are required to inspect system telemetry logs.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-red-400 font-bold text-xs uppercase tracking-widest mb-1 font-mono">
          <Shield className="w-4 h-4 shrink-0" />
          <span>System Administration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
          Enterprise Admin Panel
        </h1>
        <p className="text-sm text-slate-400 mt-1">Review live telemetry logs, system audits, and user plans.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1.5 border-b border-slate-800 pb-px">
        {[
          { id: 'diagnostics', name: 'Diagnostics & Telemetry', icon: Activity },
          { id: 'users', name: 'User Directory', icon: Users },
          { id: 'audit', name: 'Audit Logs', icon: Terminal }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-4 py-2 border-b-2 text-xs font-semibold transition-all -mb-px ${
                active
                  ? 'border-red-500 text-red-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'diagnostics' && stats && (
        <div className="space-y-6 animate-fade-in">
          {/* Telemetry Numbers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-700/20">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Users</span>
              <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">{stats.stats.users}</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-700/20">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Projects</span>
              <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">{stats.stats.projects}</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-700/20">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Marketplace Items</span>
              <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">{stats.stats.marketplace}</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-700/20">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Audit Entries</span>
              <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">{stats.stats.logs}</div>
            </div>
          </div>

          {/* System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-700/20 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-3">System Health</h3>
                <div className="flex flex-col space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Environment Node</span>
                    <span className="text-emerald-400 font-bold uppercase flex items-center space-x-1">
                      <Database className="w-3.5 h-3.5 mr-1" />
                      <span>{stats.system.health}</span>
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Database Engine</span>
                    <span className="text-slate-300 font-medium">{stats.system.database}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">AWS S3 Assets Allocation</span>
                    <span className="text-slate-300 font-mono font-semibold">{stats.system.storageUsage}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Core Api version</span>
                    <span className="text-slate-300 font-mono font-semibold">{stats.system.apiVersion}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-700/20 flex flex-col justify-between space-y-4 bg-gradient-to-b from-slate-900/10 to-red-950/5">
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2">Cluster Telemetry</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ProductVerse core utilizes autoscaling Docker clusters across Railway, Vercel edge handlers, and AWS S3 storage networks. Telemetry indexes indicate optimal memory usage.
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={fetchData}
                  className="w-full py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold active:scale-95 transition-all"
                >
                  Force Sync Telemetry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-panel rounded-2xl border border-slate-700/20 overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-slate-800 bg-slate-900/20">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Registered Accounts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 uppercase font-bold text-[9px] tracking-wider">
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Workspace Role</th>
                  <th className="p-3">Active Subscription</th>
                  <th className="p-3">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {usersList.map((u) => (
                  <tr key={u.id} className="text-slate-300 hover:bg-slate-900/20 transition-colors">
                    <td className="p-3 font-semibold text-slate-100">{u.name}</td>
                    <td className="p-3 font-mono text-[11px]">{u.email}</td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-200">{u.plan}</td>
                    <td className="p-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="glass-panel rounded-2xl border border-slate-700/20 p-5 space-y-4 max-h-[60vh] overflow-y-auto animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Security Access logs</h3>
            <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-500 px-2 py-0.5 rounded font-mono">
              Limit: 50 items
            </span>
          </div>

          <div className="flex flex-col space-y-3.5">
            {logs.map((log) => (
              <div key={log.id} className="flex flex-col space-y-1 p-3 rounded-xl bg-slate-900/30 border border-slate-900/60 font-mono text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-red-400 font-bold uppercase text-[10px]">
                    🛡️ {log.action}
                  </span>
                  <span className="text-slate-500 text-[9px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-300 leading-normal">{log.details}</p>
                <div className="flex space-x-4 text-[9px] text-slate-500 pt-1">
                  <span>IP: {log.ipAddress || '127.0.0.1'}</span>
                  <span>ID: {log.id}</span>
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="p-10 text-center">
                <p className="text-xs text-slate-500 font-mono">No security logs recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminPanel;
