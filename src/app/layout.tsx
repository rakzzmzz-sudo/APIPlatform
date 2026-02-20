'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import Login from '@/components/Auth/Login';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39FF14]"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onToggle={() => setShowSignup(!showSignup)} />;
  }

  return (
    <div className="flex h-screen bg-[#012419]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>CPaaS Platform</title>
        <meta name="description" content="CPaaS Platform Dashboard" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
