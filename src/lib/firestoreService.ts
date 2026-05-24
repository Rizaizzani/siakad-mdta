// src/lib/firestoreService.ts
// Semua fungsi untuk menyimpan, mengambil, mengubah, dan menghapus data dari Firestore

import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { Siswa, Absensi, Penilaian } from '../types';

// ============================================================
// NAMA KOLEKSI DI FIRESTORE
// ============================================================
const COLLECTIONS = {
  SISWA: 'siswa',
  ABSENSI: 'absensi',
  PENILAIAN: 'penilaian',
} as const;

// ============================================================
// HELPER: Konversi Firestore Timestamp ke string
// ============================================================
function toDateString(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString().split('T')[0];
  if (typeof value === 'string') return value;
  return '';
}

// ============================================================
// SISWA
// ============================================================

/** Ambil semua data siswa */
export async function getSiswa(): Promise<Siswa[]> {
  const snap = await getDocs(query(collection(db, COLLECTIONS.SISWA), orderBy('nama')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Siswa));
}

/** Tambah siswa baru */
export async function addSiswa(data: Omit<Siswa, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.SISWA), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Update data siswa */
export async function updateSiswa(id: string, data: Partial<Siswa>): Promise<void> {
  const ref = doc(db, COLLECTIONS.SISWA, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

/** Hapus siswa */
export async function deleteSiswa(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.SISWA, id));
}

// ============================================================
// ABSENSI
// ============================================================

/** Ambil semua data absensi */
export async function getAbsensi(): Promise<Absensi[]> {
  const snap = await getDocs(query(collection(db, COLLECTIONS.ABSENSI), orderBy('tanggal', 'desc')));
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      tanggal: toDateString(data.tanggal),
      siswaId: data.siswaId,
      kelas: data.kelas,
      status: data.status,
      keterangan: data.keterangan,
    } as Absensi;
  });
}

/** Simpan absensi batch (sekelompok siswa sekaligus) */
export async function saveAbsensiBatch(data: Omit<Absensi, 'id'>[]): Promise<void> {
  const batch = writeBatch(db);

  for (const item of data) {
    // Gunakan ID deterministik: siswaId_tanggal agar tidak duplikat
    const docId = `${item.siswaId}_${item.tanggal}`;
    const ref = doc(db, COLLECTIONS.ABSENSI, docId);
    batch.set(ref, { ...item, updatedAt: serverTimestamp() });
  }

  await batch.commit();
}

/** Hapus absensi */
export async function deleteAbsensi(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.ABSENSI, id));
}

// ============================================================
// PENILAIAN
// ============================================================

/** Ambil semua data penilaian */
export async function getPenilaian(): Promise<Penilaian[]> {
  const snap = await getDocs(query(collection(db, COLLECTIONS.PENILAIAN), orderBy('tanggal', 'desc')));
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      siswaId: data.siswaId,
      kelas: data.kelas,
      mapel: data.mapel,
      semester: data.semester,
      nilaiTugas: data.nilaiTugas,
      nilaiUjian: data.nilaiUjian,
      nilaiAkhir: data.nilaiAkhir,
      tanggal: toDateString(data.tanggal),
    } as Penilaian;
  });
}

/** Simpan penilaian batch */
export async function savePenilaianBatch(data: Omit<Penilaian, 'id'>[]): Promise<void> {
  const batch = writeBatch(db);

  for (const item of data) {
    // ID deterministik: siswaId_mapel_semester agar tidak duplikat
    const docId = `${item.siswaId}_${item.mapel}_${item.semester}`.replace(/\s+/g, '_');
    const ref = doc(db, COLLECTIONS.PENILAIAN, docId);
    batch.set(ref, { ...item, updatedAt: serverTimestamp() });
  }

  await batch.commit();
}

/** Update satu nilai */
export async function updatePenilaian(id: string, data: Partial<Penilaian>): Promise<void> {
  const ref = doc(db, COLLECTIONS.PENILAIAN, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

/** Hapus penilaian */
export async function deletePenilaian(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PENILAIAN, id));
}
