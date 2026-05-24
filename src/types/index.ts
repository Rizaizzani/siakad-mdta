export type StatusSiswa = 'Aktif' | 'Non-Aktif';
export type StatusAbsen = 'Hadir' | 'Izin' | 'Sakit' | 'Alpha';

export interface Siswa {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  tanggalLahir: string;
  alamat: string;
  namaOrtu: string;
  noHp: string;
  status: StatusSiswa;
}

export interface Absensi {
  id: string;
  tanggal: string;
  siswaId: string;
  kelas: string;
  status: StatusAbsen;
  keterangan?: string;
}

export interface Penilaian {
  id: string;
  siswaId: string;
  kelas: string;
  mapel: string;
  semester: string;
  nilaiTugas: number;
  nilaiUjian: number;
  nilaiAkhir: number;
  tanggal: string;
}
