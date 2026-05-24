"use client";

import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { KELAS_LIST, MAPEL_LIST, SEMESTER_LIST } from '@/data/mockData';
import { Filter } from 'lucide-react';

export default function UserPenilaianView() {
  const { siswa, penilaian } = useAppContext();
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [filterMapel, setFilterMapel] = useState('Semua');
  const [filterSemester, setFilterSemester] = useState(SEMESTER_LIST[0]);

  const siswaFiltered = useMemo(() =>
    filterKelas === 'Semua' ? siswa : siswa.filter(s => s.kelas === filterKelas),
    [siswa, filterKelas]
  );

  const rekap = useMemo(() => {
    const mapelList = filterMapel === 'Semua' ? MAPEL_LIST : [filterMapel];
    return siswaFiltered.map(s => {
      const nilaiPerMapel: Record<string, number | null> = {};
      mapelList.forEach(m => {
        const found = penilaian.find(p =>
          p.siswaId === s.id && p.mapel === m && p.semester === filterSemester
        );
        nilaiPerMapel[m] = found ? found.nilaiAkhir : null;
      });
      const available = Object.values(nilaiPerMapel).filter(v => v !== null) as number[];
      const rata = available.length > 0 ? Math.round(available.reduce((a, b) => a + b, 0) / available.length) : null;
      return { ...s, nilaiPerMapel, rata };
    });
  }, [siswaFiltered, penilaian, filterMapel, filterSemester]);

  const displayMapel = filterMapel === 'Semua' ? MAPEL_LIST : [filterMapel];

  const getNilaiColor = (val: number | null) => {
    if (val === null) return 'text-slate-300';
    if (val >= 85) return 'text-emerald-600 font-bold';
    if (val >= 70) return 'text-blue-600 font-semibold';
    if (val >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Rekap Penilaian</h2>
          <p className="text-sm text-slate-500">{rekap.length} siswa</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-3 items-center">
        <Filter size={16} className="text-slate-400" />
        {[
          { label: 'Kelas', value: filterKelas, setter: setFilterKelas, opts: ['Semua', ...KELAS_LIST] },
          { label: 'Mapel', value: filterMapel, setter: setFilterMapel, opts: ['Semua', ...MAPEL_LIST] },
          { label: 'Semester', value: filterSemester, setter: setFilterSemester, opts: SEMESTER_LIST },
        ].map(({ label, value, setter, opts }) => (
          <select
            key={label}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={value}
            onChange={e => setter(e.target.value)}
          >
            {opts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wide border-b border-slate-200">
                <th className="px-5 py-3.5">Siswa</th>
                <th className="px-5 py-3.5">Kelas</th>
                {displayMapel.map(m => (
                  <th key={m} className="px-3 py-3.5 text-center whitespace-nowrap">{m.split(' ').slice(0, 2).join(' ')}</th>
                ))}
                <th className="px-5 py-3.5 text-center bg-slate-100">Rata-rata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rekap.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-800">{s.nama}</p>
                    <p className="text-xs text-slate-400">{s.nis}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600 text-xs">{s.kelas}</td>
                  {displayMapel.map(m => (
                    <td key={m} className="px-3 py-4 text-center">
                      <span className={getNilaiColor(s.nilaiPerMapel[m])}>
                        {s.nilaiPerMapel[m] ?? '-'}
                      </span>
                    </td>
                  ))}
                  <td className="px-5 py-4 text-center bg-slate-50">
                    {s.rata !== null ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-sm ${getNilaiColor(s.rata)}`}>{s.rata}</span>
                        <div className="w-14 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.rata >= 80 ? 'bg-emerald-500' : s.rata >= 70 ? 'bg-blue-500' : s.rata >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${s.rata}%` }} />
                        </div>
                      </div>
                    ) : <span className="text-slate-300">-</span>}
                  </td>
                </tr>
              ))}
              {rekap.length === 0 && (
                <tr>
                  <td colSpan={displayMapel.length + 3} className="px-5 py-12 text-center text-slate-400">
                    Tidak ada data penilaian.
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
