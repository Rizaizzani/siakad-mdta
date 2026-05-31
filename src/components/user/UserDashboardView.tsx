"use client";

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { today, getCurrentSemesterInfo } from '@/data/mockData';
import { Users, CheckCircle2, BookOpen, Calendar, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UserDashboardView() {
  const { siswa, absensi, penilaian } = useAppContext();
  const { user } = useAuth();

  const totalAktif = siswa.filter(s => s.status === 'Aktif').length;
  const absensiHariIni = absensi.filter(a => a.tanggal === today);
  const hadirHariIni = absensiHariIni.filter(a => a.status === 'Hadir').length;
  const totalMapel = [...new Set(penilaian.map(p => p.mapel))].length;

  // Coba cari data siswa jika akun user merepresentasikan siswa tertentu
  const dataSiswaUser = siswa.find(s => s.nama.toLowerCase() === user?.nama.toLowerCase() || s.nis === user?.nama);

  const statsCards = [
    { label: 'Siswa Aktif', value: totalAktif, icon: Users, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'Hadir Hari Ini', value: hadirHariIni, icon: CheckCircle2, bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Mata Pelajaran', value: totalMapel, icon: BookOpen, bg: 'bg-amber-50', text: 'text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Siswa</h2>
          <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
            <Calendar size={14} />
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-sm text-blue-700 font-medium animate-pulse">
          Informasi & Rekap Akademik
        </div>
      </div>

      {/* Selamat Datang */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-y-4 translate-x-4 pointer-events-none">
          <Award size={240} />
        </div>
        <div className="relative z-10 max-w-xl">
          <h3 className="text-xl md:text-2xl font-bold mb-2">Selamat Datang, {user?.nama}!</h3>
          <p className="text-blue-100 text-sm md:text-base mb-4 leading-relaxed">
            Melalui halaman ini, Anda dapat memantau data siswa, rekap kehadiran, serta seluruh pencapaian nilai akademik di MDTA Safinatussalam secara berkala.
          </p>
          {dataSiswaUser && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Siswa Teridentifikasi: {dataSiswaUser.nama} ({dataSiswaUser.kelas})
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`${card.bg} p-2.5 rounded-xl`}>
                <card.icon size={20} className={card.text} />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{card.value}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Informasi MDTA */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Informasi Lembaga</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['Nama Lembaga', 'MDTA Safinatussalam'],
            ['Total Siswa', `${siswa.length} Orang`],
            ['Tahun Ajaran', getCurrentSemesterInfo().academicYear],
            ['Status Sistem', 'Online - Sinkronisasi Firestore'],
          ].map(([label, val]) => (
            <div key={label} className="bg-slate-50 p-4 rounded-xl">
              <p className="text-slate-500 text-xs font-medium">{label}</p>
              <p className="font-semibold text-slate-800 text-sm mt-1">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
