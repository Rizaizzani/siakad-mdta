"use client";

import React, { useState } from 'react';
import {
  LayoutDashboard, Users, ClipboardCheck, ClipboardList,
  GraduationCap, FileBarChart2, Menu, X, ChevronRight,
} from 'lucide-react';
import DashboardView from '../views/DashboardView';
import DataSiswaView from '../views/DataSiswaView';
import AbsensiView from '../views/AbsensiView';
import RekapAbsensiView from '../views/RekapAbsensiView';
import PenilaianView from '../views/PenilaianView';
import RekapPenilaianView from '../views/RekapPenilaianView';

type ViewKey = 'dashboard' | 'siswa' | 'absen' | 'rekap-absen' | 'nilai' | 'rekap-nilai';

interface NavItem {
  key: ViewKey;
  label: string;
  icon: React.ElementType;
  group: string;
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Utama' },
  { key: 'siswa', label: 'Data Siswa', icon: Users, group: 'Akademik' },
  { key: 'absen', label: 'Input Absensi', icon: ClipboardCheck, group: 'Akademik' },
  { key: 'rekap-absen', label: 'Rekap Absensi', icon: ClipboardList, group: 'Akademik' },
  { key: 'nilai', label: 'Input Penilaian', icon: GraduationCap, group: 'Penilaian' },
  { key: 'rekap-nilai', label: 'Rekap Penilaian', icon: FileBarChart2, group: 'Penilaian' },
];

const renderView = (view: ViewKey) => {
  switch (view) {
    case 'dashboard': return <DashboardView />;
    case 'siswa': return <DataSiswaView />;
    case 'absen': return <AbsensiView />;
    case 'rekap-absen': return <RekapAbsensiView />;
    case 'nilai': return <PenilaianView />;
    case 'rekap-nilai': return <RekapPenilaianView />;
  }
};

export default function MainLayout() {
  const [currentView, setCurrentView] = useState<ViewKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const groups = [...new Set(navItems.map(n => n.group))];

  const handleNav = (key: ViewKey) => {
    setCurrentView(key);
    setSidebarOpen(false);
  };

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

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
          {groups.map(group => (
            <div key={group}>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 mb-1.5">{group}</p>
              <div className="space-y-0.5">
                {navItems.filter(n => n.group === group).map(item => {
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

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-xl p-3">
            <p className="text-slate-400 text-xs">Prototype v1.0</p>
            <p className="text-slate-500 text-[10px] mt-0.5">© 2025 MDTA Safinatussalam</p>
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
              {navItems.find(n => n.key === currentView)?.label}
            </h2>
            <p className="text-xs text-slate-400 hidden sm:block">
              {navItems.find(n => n.key === currentView)?.group} › {navItems.find(n => n.key === currentView)?.label}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-700">Admin</p>
              <p className="text-[10px] text-slate-400">Administrator</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          {renderView(currentView)}
        </main>
      </div>
    </div>
  );
}