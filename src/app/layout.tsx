import type { Metadata } from 'next';
import { AppProviders } from '@/components/providers/app-providers';
import { FloatingScrollbar } from '@/components/layout/floating-scrollbar';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import './globals.css';

export const metadata: Metadata = {
  title: 'VeriText | Enterprise AI Text Detection Platform',
  description:
    'Production-grade multilingual AI text detection with sentence-level scoring, stylometry analytics, and risk visualization.',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/veritext-logo-application-light-mode.webp',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/veritext-logo-application-dark-mode.webp',
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <AppProviders>{children}</AppProviders>
          <FloatingScrollbar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
