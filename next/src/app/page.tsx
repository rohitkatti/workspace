'use client';

import { ThemeProvider } from '@components/hooks/themeContext';
import { AppProvider } from '@components/hooks/appContext';
import { AuthProvider } from '@/components/hooks/authContext';
import { CanvasProvider } from '@components/hooks/canvasContext';
import { LeftPanel } from '@/components/panels/leftPanel';

export default function Home() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AuthProvider>
          <CanvasProvider>
            <LeftPanel />
          </CanvasProvider>
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
}