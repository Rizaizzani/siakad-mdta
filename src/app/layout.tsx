import type { Metadata } from 'next';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIAKAD - MDTA Safinatussalam',
  description: 'Sistem Informasi Akademik MDTA Safinatussalam',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta name="google-site-verification" content="c0bd9b18d463d0dd" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <AppProvider>{children}</AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}