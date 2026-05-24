"use client";

import { useAuth } from '@/context/AuthContext';
import LoginView from '@/components/views/LoginView';
import MainLayout from '@/components/layout/MainLayout';
import { GraduationCap } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();

  // Loading state — cek session Firebase
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <GraduationCap size={28} className="text-white" />
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <span className="w-4 h-4 border-2 border-slate-600 border-t-emerald-400 rounded-full animate-spin" />
          Memuat...
        </div>
      </div>
    );
  }

  // Belum login → tampilkan halaman login
  if (!user) return <LoginView />;

  // Sudah login → tampilkan aplikasi utama
  return <MainLayout />;
}