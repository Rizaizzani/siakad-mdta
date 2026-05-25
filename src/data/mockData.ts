import { Siswa, Absensi, Penilaian } from '../types';

export const KELAS_LIST = [
  'Kelas 1',
  'Kelas 2',
  'Kelas 3',
  'Kelas 4',
  'Kelas 5',
  'Kelas 6',
];

export const MAPEL_LIST = [
  'Aqidah',
  'Akhlak',
  'Fiqih',
  'Al Quran',
  'Bahasa Arab',
  'Hadist',
  'Tarikh Islam'
];

export const SEMESTER_LIST = ['Ganjil 2024/2025', 'Genap 2024/2025'];

export const today = new Date().toISOString().split('T')[0];

export const initialSiswa: Siswa[] = [
  { id: '1', nis: '2023001', nama: 'Ahmad Fadlan', kelas: 'Kelas 1', jenisKelamin: 'Laki-laki', tanggalLahir: '2015-03-12', alamat: 'Jl. Mawar No. 1', namaOrtu: 'Bapak Fadlan', noHp: '08123456789', status: 'Aktif' },
  { id: '2', nis: '2023002', nama: 'Siti Aminah', kelas: 'Kelas 1', jenisKelamin: 'Perempuan', tanggalLahir: '2015-07-20', alamat: 'Jl. Melati No. 5', namaOrtu: 'Ibu Aminah', noHp: '08234567890', status: 'Aktif' },
  { id: '3', nis: '2023003', nama: 'Muhammad Rizki', kelas: 'Kelas 2', jenisKelamin: 'Laki-laki', tanggalLahir: '2014-11-05', alamat: 'Jl. Dahlia No. 8', namaOrtu: 'Bapak Rizki', noHp: '08345678901', status: 'Aktif' },
  { id: '4', nis: '2023004', nama: 'Fatimah Zahra', kelas: 'Kelas 2', jenisKelamin: 'Perempuan', tanggalLahir: '2014-04-18', alamat: 'Jl. Anggrek No. 3', namaOrtu: 'Ibu Zahra', noHp: '08456789012', status: 'Aktif' },
  { id: '5', nis: '2023005', nama: 'Abdullah Hakim', kelas: 'Kelas 3', jenisKelamin: 'Laki-laki', tanggalLahir: '2013-09-25', alamat: 'Jl. Kenanga No. 12', namaOrtu: 'Bapak Hakim', noHp: '08567890123', status: 'Aktif' },
  { id: '6', nis: '2023006', nama: 'Nur Hidayah', kelas: 'Kelas 3', jenisKelamin: 'Perempuan', tanggalLahir: '2013-01-30', alamat: 'Jl. Flamboyan No. 7', namaOrtu: 'Ibu Hidayah', noHp: '08678901234', status: 'Aktif' },
  { id: '7', nis: '2023007', nama: 'Umar Farouq', kelas: 'Kelas 4', jenisKelamin: 'Laki-laki', tanggalLahir: '2012-06-14', alamat: 'Jl. Cempaka No. 2', namaOrtu: 'Bapak Farouq', noHp: '08789012345', status: 'Aktif' },
  { id: '8', nis: '2023008', nama: 'Aisyah Putri', kelas: 'Kelas 4', jenisKelamin: 'Perempuan', tanggalLahir: '2012-12-08', alamat: 'Jl. Nusa Indah No. 6', namaOrtu: 'Ibu Putri', noHp: '08890123456', status: 'Aktif' },
  { id: '9', nis: '2022001', nama: 'Bilal Anshori', kelas: 'Kelas 5', jenisKelamin: 'Laki-laki', tanggalLahir: '2015-08-22', alamat: 'Jl. Bougenville No. 9', namaOrtu: 'Bapak Anshori', noHp: '08901234567', status: 'Non-Aktif' },
  { id: '10', nis: '2023010', nama: 'Khadijah Salma', kelas: 'Kelas 6', jenisKelamin: 'Perempuan', tanggalLahir: '2014-02-17', alamat: 'Jl. Seruni No. 4', namaOrtu: 'Ibu Salma', noHp: '08012345678', status: 'Aktif' },
];

// Generate sample absensi for last 7 days
export const generateSampleAbsensi = (): Absensi[] => {
  const result: Absensi[] = [];
  const statuses: Array<'Hadir' | 'Izin' | 'Sakit' | 'Alpha'> = ['Hadir', 'Hadir', 'Hadir', 'Hadir', 'Izin', 'Sakit', 'Alpha'];
  let idCounter = 1;
  for (let d = 6; d >= 0; d--) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    const tgl = date.toISOString().split('T')[0];
    initialSiswa.filter(s => s.status === 'Aktif').forEach(s => {
      result.push({
        id: String(idCounter++),
        tanggal: tgl,
        siswaId: s.id,
        kelas: s.kelas,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    });
  }
  return result;
};

export const generateSamplePenilaian = (): Penilaian[] => {
  const result: Penilaian[] = [];
  let idCounter = 1;
  initialSiswa.filter(s => s.status === 'Aktif').forEach(s => {
    MAPEL_LIST.forEach(mapel => {
      const tugas = Math.floor(Math.random() * 30) + 70;
      const ujian = Math.floor(Math.random() * 30) + 65;
      const akhir = Math.round(tugas * 0.4 + ujian * 0.6);
      result.push({
        id: String(idCounter++),
        siswaId: s.id,
        kelas: s.kelas,
        mapel,
        semester: 'Ganjil 2024/2025',
        nilaiTugas: tugas,
        nilaiUjian: ujian,
        nilaiAkhir: akhir,
        tanggal: today,
      });
    });
  });
  return result;
};