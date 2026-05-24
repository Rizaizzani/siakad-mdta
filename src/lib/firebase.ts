// src/lib/firebase.ts
// Konfigurasi Firebase untuk SIAKAD MDTA
// Ganti nilai-nilai di bawah dengan konfigurasi Firebase project Anda

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ⚠️ PENTING: Ganti dengan konfigurasi dari Firebase Console Anda
// Cara mendapatkan: https://console.firebase.google.com
// → Project Settings → Your apps → Web app → SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBZfAyA9ANLdHVcHOBh-EmNm5LBSfPbiM",
  authDomain: "siakad-mdta.firebaseapp.com",
  databaseURL: "https://siakad-mdta-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "siakad-mdta",
  storageBucket: "siakad-mdta.firebasestorage.app",
  messagingSenderId: "811971385904",
  appId: "1:811971385904:web:1dd68c4a5ab2789d276bf5",
  measurementId: "G-TFQ773HDER"
};

// Mencegah inisialisasi duplikat saat hot reload (Next.js dev mode)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firestore Database
export const db = getFirestore(app);
