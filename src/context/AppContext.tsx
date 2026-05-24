"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Siswa, Absensi, Penilaian } from '../types';
import * as db from '../lib/firestoreService';

// ============================================================
// TYPE CONTEXT
// ============================================================
interface AppContextType {
  // Data
  siswa: Siswa[];
  absensi: Absensi[];
  penilaian: Penilaian[];

  // Status loading & error
  loading: boolean;
  error: string | null;

  // Fungsi refresh manual
  refreshData: () => Promise<void>;

  // CRUD Siswa
  addSiswa: (s: Omit<Siswa, 'id'>) => Promise<void>;
  updateSiswa: (id: string, s: Partial<Siswa>) => Promise<void>;
  deleteSiswa: (id: string) => Promise<void>;

  // Absensi
  saveAbsensiBatch: (data: Omit<Absensi, 'id'>[]) => Promise<void>;
  deleteAbsensi: (id: string) => Promise<void>;

  // Penilaian
  savePenilaianBatch: (data: Omit<Penilaian, 'id'>[]) => Promise<void>;
  updatePenilaian: (id: string, data: Partial<Penilaian>) => Promise<void>;
  deletePenilaian: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ============================================================
// PROVIDER
// ============================================================
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [absensi, setAbsensi] = useState<Absensi[]>([]);
  const [penilaian, setPenilaian] = useState<Penilaian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ----------------------------------------------------------
  // Load semua data dari Firestore saat aplikasi pertama dibuka
  // ----------------------------------------------------------
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [siswaData, absensiData, penilaianData] = await Promise.all([
        db.getSiswa(),
        db.getAbsensi(),
        db.getPenilaian(),
      ]);
      setSiswa(siswaData);
      setAbsensi(absensiData);
      setPenilaian(penilaianData);
    } catch (err) {
      console.error('Gagal memuat data dari Firestore:', err);
      setError('Gagal memuat data. Periksa koneksi internet dan konfigurasi Firebase.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ----------------------------------------------------------
  // CRUD SISWA
  // ----------------------------------------------------------
  const addSiswa = async (s: Omit<Siswa, 'id'>) => {
    const id = await db.addSiswa(s);
    setSiswa(prev => [...prev, { ...s, id }].sort((a, b) => a.nama.localeCompare(b.nama)));
  };

  const updateSiswa = async (id: string, updated: Partial<Siswa>) => {
    await db.updateSiswa(id, updated);
    setSiswa(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteSiswa = async (id: string) => {
    await db.deleteSiswa(id);
    setSiswa(prev => prev.filter(s => s.id !== id));
  };

  // ----------------------------------------------------------
  // ABSENSI
  // ----------------------------------------------------------
  const saveAbsensiBatch = async (data: Omit<Absensi, 'id'>[]) => {
    await db.saveAbsensiBatch(data);
    // Setelah simpan, refresh absensi dari server agar ID sinkron
    const fresh = await db.getAbsensi();
    setAbsensi(fresh);
  };

  const deleteAbsensi = async (id: string) => {
    await db.deleteAbsensi(id);
    setAbsensi(prev => prev.filter(a => a.id !== id));
  };

  // ----------------------------------------------------------
  // PENILAIAN
  // ----------------------------------------------------------
  const savePenilaianBatch = async (data: Omit<Penilaian, 'id'>[]) => {
    await db.savePenilaianBatch(data);
    const fresh = await db.getPenilaian();
    setPenilaian(fresh);
  };

  const updatePenilaian = async (id: string, data: Partial<Penilaian>) => {
    await db.updatePenilaian(id, data);
    setPenilaian(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)));
  };

  const deletePenilaian = async (id: string) => {
    await db.deletePenilaian(id);
    setPenilaian(prev => prev.filter(p => p.id !== id));
  };

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <AppContext.Provider
      value={{
        siswa,
        absensi,
        penilaian,
        loading,
        error,
        refreshData,
        addSiswa,
        updateSiswa,
        deleteSiswa,
        saveAbsensiBatch,
        deleteAbsensi,
        savePenilaianBatch,
        updatePenilaian,
        deletePenilaian,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ============================================================
// HOOK
// ============================================================
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};