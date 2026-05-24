// src/lib/firebase.ts
// Konfigurasi Firebase untuk SIAKAD MDTA
// Ganti nilai-nilai di bawah dengan konfigurasi Firebase project Anda

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ⚠️ PENTING: Ganti dengan konfigurasi dari Firebase Console Anda
// Cara mendapatkan: https://console.firebase.google.com
// → Project Settings → Your apps → Web app → SDK setup and configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Mencegah inisialisasi duplikat saat hot reload (Next.js dev mode)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firestore Database
export const db = getFirestore(app);
