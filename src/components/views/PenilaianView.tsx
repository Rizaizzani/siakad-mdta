"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Save, CheckCircle, ChevronDown, Calculator } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Penilaian } from '@/types';
import { KELAS_LIST, MAPEL_LIST, SEMESTER_LIST, today } from '@/data/mockData';

export default function PenilaianView() {
  const { siswa, penilaian, savePenilaianBatch } = useAppContext();
  const [kelas, setKelas] = useState(KELAS_LIST[0]);
  const [mapel, setMapel] = useState(MAPEL_LIST[0]);
  const [semester, setSemester] = useState(SEMESTER_LIST[0]);
  const [formNilai, setFormNilai] = useState<Record<string, { tugas: string; ujian: string }>>({});
  const [saved, setSaved] = useState(false);

  const siswaDiKelas = useMemo(
    () => siswa.filter(s => s.kelas === kelas && s.status === 'Aktif'),
    [siswa, kelas]
  );

  useEffect(() => {
    const init: Record<string, { tugas: string; ujian: string }> = {};
    siswaDiKelas.forEach(s => {
      const existing = penilaian.find(
        p => p.siswaId === s.id && p.mapel === mapel && p.semester === semester
      );
      init[s.id] = {
        tugas: existing ? String(existing.nilaiTugas) : '',
        ujian: existing ? String(existing.nilaiUjian) : '',
      };
    });
    setFormNilai(init);
    setSaved(false);
  }, [kelas, mapel, semester, siswaDiKelas, penilaian]);

  const computeAkhir = (tugas: string, ujian: string) => {
    const t = parseFloat(tugas) || 0;
    const u = parseFloat(ujian) || 0;
    return Math.round(t * 0.4 + u * 0.6);
  };

  const handleSimpan = () => {
    const dataToSave: Omit<Penilaian, 'id'>[] = siswaDiKelas.map(s => {
      const f = formNilai[s.id] || { tugas: '0', ujian: '0' };
      const nilaiTugas = parseFloat(f.tugas) || 0;
      const nilaiUjian = parseFloat(f.ujian) || 0;
      return {
        siswaId: s.id, kelas, mapel, semester,
        nilaiTugas, nilaiUjian,
        nilaiAkhir: Math.round(nilaiTugas * 0.4 + nilaiUjian * 0.6),
        tanggal: today,
      };
    });
    savePenilaianBatch(dataToSave);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getNilaiColor = (val: number) => {
    if (val >= 85) return 'text-emerald-600 font-bold';
    if (val >= 70) return 'text-blue-600 font-semibold';
    if (val >= 60) return 'text-amber-600 font-semibold';
    return 'text-rose-600 font-semibold';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Input Penilaian</h2>
        <p className="text-sm text-slate-500 mt-0.5">Nilai Akhir = 40% Tugas + 60% Ujian</p>
      </div>

      {/* Filter */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Kelas', value: kelas, setter: setKelas, opts: KELAS_LIST },
          { label: 'Mata Pelajaran', value: mapel, setter: setMapel, opts: MAPEL_LIST },
          { label: 'Semester', value: semester, setter: setSemester, opts: SEMESTER_LIST },
        ].map(({ label, value, setter, opts }) => (
          <div key={label}>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>
            <div className="relative">
              <select value={value} onChange={e => setter(e.target.value)} className="w-full appearance-none border border-slate-200 rounded-xl px-3 py-2.5 pr-9 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wide border-b border-slate-200">
                <th className="px-5 py-3.5 w-10">No</th>
                <th className="px-5 py-3.5">Nama Siswa</th>
                <th className="px-5 py-3.5 text-center">Nilai Tugas</th>
                <th className="px-5 py-3.5 text-center">Nilai Ujian</th>
                <th className="px-5 py-3.5 text-center">
                  <span className="flex items-center justify-center gap-1"><Calculator size={12} /> Nilai Akhir</span>
                </th>
                <th className="px-5 py-3.5 text-center">Predikat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {siswaDiKelas.map((s, idx) => {
                const f = formNilai[s.id] || { tugas: '', ujian: '' };
                const akhir = computeAkhir(f.tugas, f.ujian);
                const predikat = akhir >= 90 ? 'A' : akhir >= 80 ? 'B' : akhir >= 70 ? 'C' : akhir >= 60 ? 'D' : 'E';
                const predikatColor = akhir >= 80 ? 'bg-emerald-100 text-emerald-700' : akhir >= 70 ? 'bg-blue-100 text-blue-700' : akhir >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700';
                return (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 text-slate-400 font-mono text-xs">{String(idx + 1).padStart(2, '0')}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">{s.nama}</p>
                      <p className="text-xs text-slate-400">{s.nis}</p>
                    </td>
                    <td className="px-5 py-4">
                      <input
                        type="number" min="0" max="100"
                        className="w-20 mx-auto block border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        value={f.tugas}
                        onChange={e => setFormNilai(prev => ({ ...prev, [s.id]: { ...prev[s.id], tugas: e.target.value } }))}
                        placeholder="0-100"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <input
                        type="number" min="0" max="100"
                        className="w-20 mx-auto block border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        value={f.ujian}
                        onChange={e => setFormNilai(prev => ({ ...prev, [s.id]: { ...prev[s.id], ujian: e.target.value } }))}
                        placeholder="0-100"
                      />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-base ${(f.tugas || f.ujian) ? getNilaiColor(akhir) : 'text-slate-300'}`}>
                        {(f.tugas || f.ujian) ? akhir : '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {(f.tugas || f.ujian) ? (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${predikatColor}`}>{predikat}</span>
                      ) : <span className="text-slate-300 text-xs">-</span>}
                    </td>
                  </tr>
                );
              })}
              {siswaDiKelas.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">Tidak ada siswa aktif di kelas ini.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {siswaDiKelas.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            {saved ? (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                <CheckCircle size={16} /> Nilai berhasil disimpan!
              </span>
            ) : <span />}
            <button onClick={handleSimpan} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-sm shadow-emerald-200">
              <Save size={16} /> Simpan Nilai
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
