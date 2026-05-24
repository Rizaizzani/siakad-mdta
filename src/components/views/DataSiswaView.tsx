"use client";

import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, User, Phone, MapPin, ChevronDown } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Siswa, StatusSiswa } from '@/types';
import { KELAS_LIST } from '@/data/mockData';

const emptyForm = (): Omit<Siswa, 'id'> => ({
  nis: '', nama: '', kelas: KELAS_LIST[0],
  jenisKelamin: 'Laki-laki', tanggalLahir: '',
  alamat: '', namaOrtu: '', noHp: '', status: 'Aktif',
});

export default function DataSiswaView() {
  const { siswa, addSiswa, updateSiswa, deleteSiswa } = useAppContext();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [filterKelas, setFilterKelas] = useState<string>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Siswa, 'id'>>(emptyForm());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = siswa.filter(s => {
    const matchSearch = s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search);
    const matchStatus = filterStatus === 'Semua' || s.status === filterStatus;
    const matchKelas = filterKelas === 'Semua' || s.kelas === filterKelas;
    return matchSearch && matchStatus && matchKelas;
  });

  const openModal = (s?: Siswa) => {
    if (s) {
      const { id, ...rest } = s;
      setFormData(rest);
      setEditingId(id);
    } else {
      setFormData(emptyForm());
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) updateSiswa(editingId, formData);
    else addSiswa(formData);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteSiswa(id);
    setDeleteConfirm(null);
  };

  const set = (key: keyof Omit<Siswa, 'id'>, val: string) =>
    setFormData(prev => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Data Siswa</h2>
          <p className="text-sm text-slate-500">{filtered.length} dari {siswa.length} siswa ditampilkan</p>
        </div>
        <button onClick={() => openModal()} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-sm shadow-emerald-200">
          <Plus size={16} /> Tambah Siswa
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input type="text" placeholder="Cari NIS atau Nama..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <select className="appearance-none border border-slate-200 rounded-xl px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="Semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Non-Aktif">Non-Aktif</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-3 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select className="appearance-none border border-slate-200 rounded-xl px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" value={filterKelas} onChange={e => setFilterKelas(e.target.value)}>
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
                <th className="px-5 py-3.5 hidden lg:table-cell">No. HP Ortu</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
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
                  <td className="px-5 py-4 text-slate-600 hidden lg:table-cell">{s.noHp || '-'}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${s.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openModal(s)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => setDeleteConfirm(s.id)} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400"><User size={32} className="mx-auto mb-2 opacity-40" /><p>Tidak ada data siswa ditemukan.</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
              <h3 className="font-bold text-slate-800">{editingId ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">NIS *</label>
                  <input required type="text" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={formData.nis} onChange={e => set('nis', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Jenis Kelamin *</label>
                  <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={formData.jenisKelamin} onChange={e => set('jenisKelamin', e.target.value)}>
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Nama Lengkap *</label>
                <input required type="text" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={formData.nama} onChange={e => set('nama', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Kelas *</label>
                  <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={formData.kelas} onChange={e => set('kelas', e.target.value)}>
                    {KELAS_LIST.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Tanggal Lahir</label>
                  <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={formData.tanggalLahir} onChange={e => set('tanggalLahir', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Nama Orang Tua</label>
                <input type="text" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={formData.namaOrtu} onChange={e => set('namaOrtu', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">No. HP Orang Tua</label>
                <input type="tel" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={formData.noHp} onChange={e => set('noHp', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Alamat</label>
                <textarea rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none" value={formData.alamat} onChange={e => set('alamat', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Status</label>
                <div className="flex gap-3">
                  {(['Aktif', 'Non-Aktif'] as StatusSiswa[]).map(s => (
                    <label key={s} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 cursor-pointer text-sm font-medium transition-all ${formData.status === s ? (s === 'Aktif' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-rose-500 bg-rose-50 text-rose-700') : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      <input type="radio" name="status" value={s} checked={formData.status === s} onChange={() => set('status', s)} className="sr-only" />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 size={20} className="text-rose-600" />
              </div>
              <h3 className="font-bold text-slate-800">Hapus Siswa?</h3>
              <p className="text-sm text-slate-500 mt-1">Data yang dihapus tidak dapat dikembalikan.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 text-sm font-medium border border-slate-200 rounded-xl hover:bg-slate-50">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}