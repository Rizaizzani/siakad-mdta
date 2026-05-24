"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Save, CheckCircle, ChevronDown } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { StatusAbsen } from '@/types';
import { KELAS_LIST, today } from '@/data/mockData';

const STATUS_LIST: StatusAbsen[] = ['Hadir', 'Izin', 'Sakit', 'Alpha'];
const STATUS_COLOR: Record<StatusAbsen, string> = {
  Hadir: 'text-emerald-700 bg-emerald-50 border-emerald-300',
  Izin: 'text-amber-700 bg-amber-50 border-amber-300',
  Sakit: 'text-blue-700 bg-blue-50 border-blue-300',
  Alpha: 'text-rose-700 bg-rose-50 border-rose-300',
};

export default function AbsensiView() {
  const { siswa, absensi, saveAbsensiBatch } = useAppContext();
  const [tanggal, setTanggal] = useState(today);
  const [kelas, setKelas] = useState(KELAS_LIST[0]);
  const [formAbsensi, setFormAbsensi] = useState<Record<string, StatusAbsen>>({});
  const [saved, setSaved] = useState(false);

  const siswaDiKelas = useMemo(
    () => siswa.filter(s => s.kelas === kelas && s.status === 'Aktif'),
    [siswa, kelas]
  );

  useEffect(() => {
    const existing = absensi.filter(a => a.tanggal === tanggal && a.kelas === kelas);
    const init: Record<string, StatusAbsen> = {};
    siswaDiKelas.forEach(s => {
      const found = existing.find(a => a.siswaId === s.id);
      init[s.id] = found ? found.status : 'Hadir';
    });
    setFormAbsensi(init);
    setSaved(false);
  }, [tanggal, kelas, siswaDiKelas, absensi]);

  const handleSimpan = () => {
    const dataToSave = siswaDiKelas.map(s => ({
      tanggal, siswaId: s.id, kelas, status: formAbsensi[s.id] || 'Hadir',
    }));
    saveAbsensiBatch(dataToSave);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const summary = STATUS_LIST.map(st => ({
    status: st,
    count: Object.values(formAbsensi).filter(v => v === st).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Input Absensi</h2>
        <p className="text-sm text-slate-500 mt-0.5">Catat kehadiran siswa harian</p>
      </div>

      {/* Filter */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Tanggal</label>
          <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Kelas</label>
          <div className="relative">
            <select value={kelas} onChange={e => setKelas(e.target.value)} className="w-full appearance-none border border-slate-200 rounded-xl px-3 py-2.5 pr-9 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              {KELAS_LIST.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Summary badges */}
      {siswaDiKelas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {summary.map(({ status, count }) => (
            <span key={status} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${STATUS_COLOR[status as StatusAbsen]}`}>
              {status}: {count}
            </span>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wide border-b border-slate-200">
                <th className="px-5 py-3.5 w-12">No</th>
                <th className="px-5 py-3.5">Nama Siswa</th>
                <th className="px-5 py-3.5 text-center">Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {siswaDiKelas.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-slate-400 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</td>
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
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2 flex-wrap">
                      {STATUS_LIST.map(status => (
                        <label key={status} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${formAbsensi[s.id] === status ? STATUS_COLOR[status] : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}>
                          <input
                            type="radio"
                            name={`absen-${s.id}`}
                            value={status}
                            checked={formAbsensi[s.id] === status}
                            onChange={() => setFormAbsensi(prev => ({ ...prev, [s.id]: status }))}
                            className="sr-only"
                          />
                          {status}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {siswaDiKelas.length === 0 && (
                <tr><td colSpan={3} className="px-5 py-12 text-center text-slate-400">Tidak ada siswa aktif di kelas ini.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {siswaDiKelas.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                <CheckCircle size={16} /> Data absensi berhasil disimpan!
              </span>
            )}
            {!saved && <span />}
            <button onClick={handleSimpan} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-sm shadow-emerald-200">
              <Save size={16} /> Simpan Absensi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}