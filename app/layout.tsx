import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ErrorBoundary } from '@/components/weather/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Weather App - Real-time Weather Updates',
  description: 'Get accurate weather forecasts, current conditions, and weather alerts for any location worldwide.',
  keywords: 'weather, forecast, temperature, humidity, wind, precipitation, alerts',
  authors: [{ name: 'Weather App' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#74b9ff',
  manifest: '/manifest.json'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}