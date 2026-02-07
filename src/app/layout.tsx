import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TelegramProvider } from '@/components/TelegramProvider';

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'NSS - Natural Stones Seekers',
  description: 'Mine stones. Build your future.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0e1a',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} bg-navy-900 text-white antialiased`}>
        <ThemeProvider>
          <TelegramProvider>
            {children}
          </TelegramProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
