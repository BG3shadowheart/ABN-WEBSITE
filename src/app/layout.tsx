import type { Metadata, Viewport } from 'next';
import { Fredoka, JetBrains_Mono, Nunito } from 'next/font/google';
import './globals.css';

import { Atmosphere } from '@/components/atmosphere';
import { OrderContextProvider } from '@/components/order-context';
import { CharacterStage } from '@/components/character-stage';
import { ThemeController } from '@/components/theme-controller';
import { findLocalCharacters } from '@/lib/local-art';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { PRODUCTS } from '@/data/products';
import { STORE_DESCRIPTION, STORE_NAME, STORE_TAGLINE, STORE_URL } from '@/data/store';

const display = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
});

const sans = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono-price',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(STORE_URL),
  title: {
    default: `${STORE_NAME} — ${STORE_TAGLINE}`,
    template: `%s · ${STORE_NAME}`,
  },
  description: STORE_DESCRIPTION,
  applicationName: STORE_NAME,
  keywords: [
    'ABNORMAL',
    'premium builds',
    'PC builds',
    'Android APK',
    'iOS builds',
    'price list',
    'USD BDT pricing',
  ],
  openGraph: {
    type: 'website',
    siteName: STORE_NAME,
    title: `${STORE_NAME} — ${STORE_TAGLINE}`,
    description: STORE_DESCRIPTION,
    url: STORE_URL,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${STORE_NAME} — ${STORE_TAGLINE}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${STORE_NAME} — ${STORE_TAGLINE}`,
    description: STORE_DESCRIPTION,
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#04040a',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="anemo"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ink-950 text-bone-200 antialiased">
        <Atmosphere />
        <ThemeController />
        <CharacterStage local={findLocalCharacters()} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-crimson-500 focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:text-bone-50"
        >
          Skip to content
        </a>

        <SiteHeader productCount={PRODUCTS.length} />

        <OrderContextProvider>
          <main id="main">{children}</main>
        </OrderContextProvider>

        <SiteFooter />
      </body>
    </html>
  );
}
