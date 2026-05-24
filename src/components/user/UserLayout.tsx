"use client";

import React, { useState } from 'react';
import {
  LayoutDashboard, Users, ClipboardList,
  FileBarChart2, Menu, X, ChevronRight, LogOut, GraduationCap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import UserDashboardView from './UserDashboardView';
import UserSiswaView from './UserSiswaView';
import UserAbsensiView from './UserAbsensiView';
import UserPenilaianView from './UserPenilaianView';

type UserViewKey = 'dashboard' | 'siswa' | 'rekap-absen' | 'rekap-nilai';

interface UserNavItem {
  key: UserViewKey;
  label: string;
  icon: React.ElementType;
  group: string;
}

const userNavItems: UserNavItem[] = [
  { key: 'dashboard',   label: 'Dashboard',       icon: LayoutDashboard, group: 'Utama' },
  { key: 'siswa',       label: 'Data Siswa',       icon: Users,           group: 'Informasi' },
  { key: 'rekap-absen', label: 'Rekap Absensi',    icon: ClipboardList,   group: 'Akademik' },
  { key: 'rekap-nilai', label: 'Rekap Penilaian',  icon: FileBarChart2,   group: 'Akademik' },
];

const renderUserView = (view: UserViewKey) => {
  switch (view) {
    case 'dashboard':   return <UserDashboardView />;
    case 'siswa':       return <UserSiswaView />;
    case 'rekap-absen': return <UserAbsensiView />;
    case 'rekap-nilai': return <UserPenilaianView />;
  }
};

export default function UserLayout() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<UserViewKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const groups = [...new Set(userNavItems.map(n => n.group))];

  const handleNav = (key: UserViewKey) => {
    setCurrentView(key);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  const initials = user?.nama
    ? user.nama.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                <GraduationCap size={15} className="text-white" />
              </div>
              <h1 className="text-white font-bold text-base">SIAKAD</h1>
            </div>
            <p className="text-slate-400 text-xs pl-9">MDTA Safinatussalam</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-3.5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-slate-200 text-sm font-medium truncate">{user?.nama}</p>
              <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-blue-500/20 text-blue-300 border-blue-500/30 mt-0.5">
                Siswa / Wali
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
          {groups.map(group => (
            <div key={group}>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 mb-1.5">{group}</p>
              <div className="space-y-0.5">
                {userNavItems.filter(n => n.group === group).map(item => {
                  const active = currentView === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleNav(item.key)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                    >
                      <item.icon size={17} className={active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {active && <ChevronRight size={14} className="text-emerald-300" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer + Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all disabled:opacity-50"
          >
            <LogOut size={16} />
            {loggingOut ? 'Keluar...' : 'Keluar'}
          </button>
          <div className="bg-slate-800 rounded-xl px-3 py-2">
            <p className="text-slate-500 text-[10px]">© 2026 MDTA Safinatussalam</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-800 p-1.5 hover:bg-slate-100 rounded-lg">
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              {userNavItems.find(n => n.key === currentView)?.label}
            </h2>
            <p className="text-xs text-slate-400 hidden sm:block">
              {userNavItems.find(n => n.key === currentView)?.group} › {userNavItems.find(n => n.key === currentView)?.label}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-700">{user?.nama}</p>
              <p className="text-[10px] text-slate-400">Siswa / Wali</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          {renderUserView(currentView)}
        </main>
      </div>
    </div>
  );
}
