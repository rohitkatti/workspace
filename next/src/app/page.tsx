'use client';

import { AuthProvider } from '@/components/hooks/authContext';
import { AppProvider } from '@components/hooks/appContext';

export default function Home() {
  return (
    <AppProvider>
      <AuthProvider>
      </AuthProvider>
    </AppProvider>
  );
}