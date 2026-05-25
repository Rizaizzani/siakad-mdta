"use client";

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { today, KELAS_LIST } from '@/data/mockData';
import { Users, UserX, CheckCircle2, BookOpen, TrendingUp, BarChart3, Calendar } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

export default function DashboardView() {
  const { siswa, absensi, penilaian } = useAppContext();
  const totalAktif = siswa.filter(s => s.status === 'Aktif').length;
  const totalNonAktif = siswa.filter(s => s.status === 'Non-Aktif').length;
  const absensiHariIni = absensi.filter(a => a.tanggal === today);
  const hadirHariIni = absensiHariIni.filter(a => a.status === 'Hadir').length;
  const totalMapel = [...new Set(penilaian.map(p => p.mapel))].length;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const tgl = d.toISOString().split('T')[0];
    const dayAbsen = absensi.filter(a => a.tanggal === tgl);
    return {
      name: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
      Hadir: dayAbsen.filter(a => a.status === 'Hadir').length,
      Alpha: dayAbsen.filter(a => a.status === 'Alpha').length,
      Izin: dayAbsen.filter(a => a.status === 'Izin').length,
      Sakit: dayAbsen.filter(a => a.status === 'Sakit').length,
    };
  });

  const pieData = [
    { name: 'Hadir', value: absensiHariIni.filter(a => a.status === 'Hadir').length },
    { name: 'Izin', value: absensiHariIni.filter(a => a.status === 'Izin').length },
    { name: 'Sakit', value: absensiHariIni.filter(a => a.status === 'Sakit').length },
    { name: 'Alpha', value: absensiHariIni.filter(a => a.status === 'Alpha').length },
  ].filter(d => d.value > 0);

  const siswaPerKelas = KELAS_LIST.map(k => ({
    name: k.split(' ').slice(0, 2).join(' '),
    total: siswa.filter(s => s.kelas === k && s.status === 'Aktif').length,
  }));

  const statsCards = [
    { label: 'Siswa Aktif', value: totalAktif, icon: Users, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'Siswa Non-Aktif', value: totalNonAktif, icon: UserX, bg: 'bg-rose-50', text: 'text-rose-600' },
    { label: 'Hadir Hari Ini', value: hadirHariIni, icon: CheckCircle2, bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Mata Pelajaran', value: totalMapel, icon: BookOpen, bg: 'bg-amber-50', text: 'text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
            <Calendar size={14} />
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-sm text-emerald-700 font-medium">
          Semester Ganjil 2024/2025
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`${card.bg} p-2.5 rounded-xl`}>
                <card.icon size={20} className={card.text} />
              </div>
              <TrendingUp size={14} className="text-slate-300" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{card.value}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-emerald-600" />
            <h3 className="font-semibold text-slate-800">Kehadiran 7 Hari Terakhir</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={last7Days} barSize={8} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Bar dataKey="Hadir" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Izin" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Sakit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Alpha" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-4">Status Hari Ini</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" outerRadius={72} dataKey="value" fontSize={11}>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">Belum ada data absensi hari ini</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-4">Distribusi Siswa per Kelas</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={siswaPerKelas} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={80} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Bar dataKey="total" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-sm">
          <h3 className="font-semibold mb-4 opacity-90">Info Lembaga</h3>
          <div className="space-y-3 text-sm">
            {[
              ['Nama Lembaga', 'MDTA Safinatussalam'],
              ['Total Siswa', `${siswa.length} Siswa`],
              ['Total Kelas', '6 Kelas'],
              ['Mata Pelajaran', '7 Mapel'],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="opacity-70 text-xs">{label}</p>
                <p className="font-semibold">{val}</p>
              </div>
            ))}
            <div className="pt-2 border-t border-white/20">
              <p className="opacity-70 text-xs">Sistem</p>
              <p className="font-semibold text-xs">SIAKAD MDTA Safinatussalam</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}