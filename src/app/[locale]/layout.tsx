import '@/app/globals.css'
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from "@/components/ui/sonner"
import { FontProvider } from '@/components/providers/font';
import { cookies } from 'next/headers';
import { Inter, Roboto_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme';
import { FooterSection } from '@/components/ui/footer-section';
import NavHeader from '@/components/widgets/nav-header';
import { getServerSession } from '@/lib/auth/server-session';
import SessionProvider from '@/components/providers/session';
import { ZodProvider } from '@/components/providers/zodI18n';
import { GoogleTagManager } from '@next/third-parties/google'
// import { Analytics } from "@vercel/analytics/react";
import Analytics from "@/components/adsense";
import CookieBanner from '@/components/widgets/cookie-consent';
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const roboto_mono = Roboto_Mono({
    subsets: ['latin'],
    variable: '--font-roboto-mono',
    display: 'swap',
})
export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const session = await getServerSession();
    const cookieStore = await cookies()
    const font = cookieStore.get('font')?.value
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html lang={locale} className={`${inter.variable} ${roboto_mono.variable}`} suppressHydrationWarning>
            <head>
                <Analytics />
            </head>
            <body>
                <SessionProvider initialSession={session}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <FontProvider defaultFont={font || inter.variable}>
                            <NextIntlClientProvider>
                                <ZodProvider>
                                    <NavHeader />
                                    {children}
                                    <CookieBanner />
                                    <FooterSection />

                                    <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
                                </ZodProvider>
                            </NextIntlClientProvider>
                            <Toaster />
                        </FontProvider>
                    </ThemeProvider>
                </SessionProvider>

            </body>
        </html >
    );
}