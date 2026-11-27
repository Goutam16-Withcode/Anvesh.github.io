import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { AuthModal } from '@/components/AuthModal';
import { NotificationProvider } from '@/lib/notification-context';
import { LiveNotificationToast } from '@/components/Notifications/LiveNotificationToast';
import { CommandPalette } from '@/components/CommandPalette';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: 'ANVESH — AI-Powered Global Career Discovery & Multi-Stage Recommendation Platform',
  description:
    'Deterministic career intelligence replacing brittle ATS keyword queries with canonical skill graphs, Qdrant HNSW vector retrieval, LightGBM LambdaMART ranking, and counterfactual What-If simulation.',
  keywords: [
    'ANVESH',
    'Career Intelligence',
    'AI Job Recommendation',
    'What-If Simulation',
    'Skill Graph Ontology',
    'Learning-to-Rank',
    'Qdrant Vector DB',
    'LightGBM',
  ],
  authors: [{ name: 'ANVESH AI Team' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-brand-500 selection:text-white">
        <AuthProvider>
          <NotificationProvider>
            {children}
            <AuthModal />
            <LiveNotificationToast />
            <CommandPalette />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
