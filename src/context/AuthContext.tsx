"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type UserRole = 'admin' | 'guru' | 'user';

interface AuthUser {
  uid: string;
  email: string;
  nama: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        try {
          let docData: any = null;
          const uidRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(uidRef);

          if (snap.exists()) {
            docData = snap.data();
          } else if (firebaseUser.email) {
            // Fallback cerdas: cari berdasarkan field email di seluruh koleksi users
            const { collection, query, where, getDocs } = require('firebase/firestore');
            const q = query(collection(db, 'users'), where('email', '==', firebaseUser.email));
            const querySnap = await getDocs(q);
            if (!querySnap.empty) {
              docData = querySnap.docs[0].data();
            }
          }

          if (docData) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? '',
              nama: docData.nama ?? 'Pengguna',
              role: docData.role ?? 'user',
            });
          } else {
            // Fallback jika dokumen user sama sekali tidak ada di Firestore
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? '',
              nama: firebaseUser.email?.split('@')[0] ?? 'Pengguna',
              role: 'user',
            });
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
