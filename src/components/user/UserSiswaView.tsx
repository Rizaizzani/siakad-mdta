"use client";

import React, { useState } from 'react';
import { Search, User, ChevronDown } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Siswa } from '@/types';
import { KELAS_LIST } from '@/data/mockData';

export default function UserSiswaView() {
  const { siswa } = useAppContext();
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState<string>('Semua');

  const filtered = siswa.filter(s => {
    const matchSearch = s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search);
    const matchKelas = filterKelas === 'Semua' || s.kelas === filterKelas;
    return matchSearch && matchKelas;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daftar Siswa</h2>
          <p className="text-sm text-slate-500">{filtered.length} dari {siswa.length} siswa aktif ditampilkan</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Cari NIS atau Nama..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="appearance-none border border-slate-200 rounded-xl px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={filterKelas}
            onChange={e => setFilterKelas(e.target.value)}
          >
            <option value="Semua">Semua Kelas</option>
            {KELAS_LIST.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wide border-b border-slate-200">
                <th className="px-5 py-3.5">Siswa</th>
                <th className="px-5 py-3.5">Kelas</th>
                <th className="px-5 py-3.5 hidden md:table-cell">Jenis Kelamin</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${s.jenisKelamin === 'Perempuan' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                        {s.nama.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{s.nama}</p>
                        <p className="text-xs text-slate-400">{s.nis}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{s.kelas}</td>
                  <td className="px-5 py-4 text-slate-600 hidden md:table-cell">{s.jenisKelamin}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${s.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-400">
                    <User size={32} className="mx-auto mb-2 opacity-40" />
                    <p>Tidak ada data siswa ditemukan.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
