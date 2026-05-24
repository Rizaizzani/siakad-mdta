"use client";

import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { KELAS_LIST } from '@/data/mockData';
import { Filter, Download } from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  Hadir: 'bg-emerald-100 text-emerald-700',
  Izin: 'bg-amber-100 text-amber-700',
  Sakit: 'bg-blue-100 text-blue-700',
  Alpha: 'bg-rose-100 text-rose-700',
};

export default function RekapAbsensiView() {
  const { siswa, absensi } = useAppContext();
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [filterBulan, setFilterBulan] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');

  const months = useMemo(() => {
    const s = new Set(absensi.map(a => a.tanggal.slice(0, 7)));
    return Array.from(s).sort().reverse();
  }, [absensi]);

  const filteredAbsensi = useMemo(() => {
    return absensi.filter(a => {
      const matchKelas = filterKelas === 'Semua' || a.kelas === filterKelas;
      const matchBulan = !filterBulan || a.tanggal.startsWith(filterBulan);
      const matchTanggal = !filterTanggal || a.tanggal === filterTanggal;
      return matchKelas && matchBulan && matchTanggal;
    });
  }, [absensi, filterKelas, filterBulan, filterTanggal]);

  const rekapPerSiswa = useMemo(() => {
    const siswaFiltered = filterKelas === 'Semua'
      ? siswa
      : siswa.filter(s => s.kelas === filterKelas);

    return siswaFiltered.map(s => {
      const myAbsen = filteredAbsensi.filter(a => a.siswaId === s.id);
      const hadir = myAbsen.filter(a => a.status === 'Hadir').length;
      const izin = myAbsen.filter(a => a.status === 'Izin').length;
      const sakit = myAbsen.filter(a => a.status === 'Sakit').length;
      const alpha = myAbsen.filter(a => a.status === 'Alpha').length;
      const total = myAbsen.length;
      const persen = total > 0 ? Math.round((hadir / total) * 100) : 0;
      return { ...s, hadir, izin, sakit, alpha, total, persen };
    });
  }, [siswa, filteredAbsensi, filterKelas]);

  const exportCSV = () => {
    const rows = [
      ['NIS', 'Nama', 'Kelas', 'Hadir', 'Izin', 'Sakit', 'Alpha', 'Total', '% Hadir'],
      ...rekapPerSiswa.map(s => [s.nis, s.nama, s.kelas, s.hadir, s.izin, s.sakit, s.alpha, s.total, `${s.persen}%`]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'rekap-absensi.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Rekap Absensi</h2>
          <p className="text-sm text-slate-500">{rekapPerSiswa.length} siswa</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-3 items-center">
        <Filter size={16} className="text-slate-400" />
        <select className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" value={filterKelas} onChange={e => setFilterKelas(e.target.value)}>
          <option value="Semua">Semua Kelas</option>
          {KELAS_LIST.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <select className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" value={filterBulan} onChange={e => { setFilterBulan(e.target.value); setFilterTanggal(''); }}>
          <option value="">Semua Bulan</option>
          {months.map(m => <option key={m} value={m}>{new Date(m + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</option>)}
        </select>
        <input type="date" value={filterTanggal} onChange={e => { setFilterTanggal(e.target.value); setFilterBulan(''); }} className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        {(filterBulan || filterTanggal || filterKelas !== 'Semua') && (
          <button onClick={() => { setFilterKelas('Semua'); setFilterBulan(''); setFilterTanggal(''); }} className="text-xs text-slate-500 hover:text-rose-500 underline">Reset</button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wide border-b border-slate-200">
                <th className="px-5 py-3.5">Siswa</th>
                <th className="px-5 py-3.5">Kelas</th>
                <th className="px-5 py-3.5 text-center text-emerald-600">Hadir</th>
                <th className="px-5 py-3.5 text-center text-amber-600">Izin</th>
                <th className="px-5 py-3.5 text-center text-blue-600">Sakit</th>
                <th className="px-5 py-3.5 text-center text-rose-600">Alpha</th>
                <th className="px-5 py-3.5 text-center">Total</th>
                <th className="px-5 py-3.5 text-center">% Hadir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {rekapPerSiswa.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-800">{s.nama}</p>
                    <p className="text-xs text-slate-400">{s.nis}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600 text-xs">{s.kelas}</td>
                  <td className="px-5 py-4 text-center"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR.Hadir}`}>{s.hadir}</span></td>
                  <td className="px-5 py-4 text-center"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR.Izin}`}>{s.izin}</span></td>
                  <td className="px-5 py-4 text-center"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR.Sakit}`}>{s.sakit}</span></td>
                  <td className="px-5 py-4 text-center"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR.Alpha}`}>{s.alpha}</span></td>
                  <td className="px-5 py-4 text-center font-semibold text-slate-700">{s.total}</td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-xs font-bold ${s.persen >= 80 ? 'text-emerald-600' : s.persen >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>{s.persen}%</span>
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${s.persen >= 80 ? 'bg-emerald-500' : s.persen >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${s.persen}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {rekapPerSiswa.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-slate-400">Tidak ada data absensi.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
