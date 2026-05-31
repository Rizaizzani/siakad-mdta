import type { Metadata } from 'next';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'SIAKAD MDTA Safinatussalam',
  description: 'Sistem informasi akademik berbasis web',
  keywords: ['siakad', 'mdta', 'safinatussalam'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta name="google-site-verification" content="fNAIFykDeWspEOXGJt_ldEllveL-wbTqeE-A9XdTHWs" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <AppProvider>{children}</AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}