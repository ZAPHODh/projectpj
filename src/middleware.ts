import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth/helper';
import { routing } from './i18n/routing';
import { decode } from './lib/auth/server-session';




const intlMiddleware = createMiddleware(routing);

const protectedRoutes = ['/calendar', '/customer', '/professionals', '/finance', '/account'];
const publicRoutes = ['/auth', '/'];

export default async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Extrair locale e caminho interno
    const pathSegments = pathname.split('/').filter(Boolean);
    const [maybeLocale] = pathSegments;
    const hasLocale = routing.locales.includes(maybeLocale as "en" | "pt" | "zh");

    const locale = hasLocale ? maybeLocale : routing.defaultLocale;
    const internalPath = hasLocale
        ? `/${pathSegments.slice(1).join('/')}`
        : pathname;

    const isProtectedRoute = protectedRoutes.some(route =>
        internalPath.startsWith(route)
    );
    const isPublicRoute = publicRoutes.includes(internalPath);

    const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await decode(cookie);
    if (isProtectedRoute && !session?.user.id) {
        const url = new URL(`/${locale}/auth/signin`, req.url);
        return NextResponse.redirect(url);
    }

    if (isPublicRoute && session?.user.id && !internalPath.startsWith('/calendar')) {
        const url = new URL(`/${locale}/calendar/week-view`, req.url);
        return NextResponse.redirect(url);
    }

    return intlMiddleware(req);
}

export const config = {
    matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
};


// import createMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';
// import createMiddleware from 'next-intl/middleware';
// import { cookies } from "next/headers"
// import { NextRequest, NextResponse } from "next/server"
// import { SESSION_COOKIE_NAME } from "./lib/auth/helper"
// import { decode } from "./lib/auth/server-session"
// import { routing } from './i18n/routing';

// export default createMiddleware(routing);

// import createMiddleware from 'next-intl/middleware';
// import { NextRequest, NextResponse } from 'next/server';
// import { routing } from './i18n/routing';

// const intlMiddleware = createMiddleware(routing);

// const protectedRoutes = ['/account', '/calendar', '/finance', '/professionals'];

// function isProtectedPath(pathname: string): boolean {
//     const parts = pathname.split('/').filter(p => p !== '');
//     if (parts.length > 0 && routing.locales.includes(parts[0] as 'en' | 'pt' | 'zh')) {
//         const pathWithoutLocale = '/' + parts.slice(1).join('/');
//         return protectedRoutes.some(route => pathWithoutLocale.startsWith(route));
//     }
//     return protectedRoutes.some(route => pathname.startsWith(route));
// }

// function getLocaleFromPath(pathname: string): string {
//     const parts = pathname.split('/').filter(p => p !== '');
//     return parts.length > 0 && routing.locales.includes(parts[0] as 'en' | 'pt' | 'zh')
//         ? parts[0]
//         : 'en';
// }

// async function checkSession(request: NextRequest) {
//     const res = await fetch(new URL('/api/auth/session', request.url), {
//         method: 'POST',
//         headers: request.headers,
//     });

//     if (!res.ok) {
//         return false;
//     }

//     const session = await res.json();
//     return !!session.user?.id;
// }

// export default async function middleware(request: NextRequest) {
//     const intlResponse = intlMiddleware(request);

//     if ([307, 308].includes(intlResponse.status)) {
//         return intlResponse;
//     }

//     const { pathname } = request.nextUrl;
//     const locale = getLocaleFromPath(pathname);

//     if (isProtectedPath(pathname)) {
//         const isSessionValid = await checkSession(request);

//         if (!isSessionValid) {
//             const url = request.nextUrl.clone();
//             url.pathname = `/${locale}/auth/signin`;
//             return NextResponse.redirect(url);
//         }
//     }

//     return intlResponse;
// }

// const protectedRoutes = ['/calendar', 'customer', 'professionals', 'finance', 'account']
// const publicRoutes = ['/auth', '/']

// export default async function middleware(req: NextRequest) {
//     const intlMiddleware = createMiddleware(routing);
//     if (intlMiddleware) return intlMiddleware;

//     const path = req.nextUrl.pathname
//     const isProtectedRoute = protectedRoutes.includes(path)
//     const isPublicRoute = publicRoutes.includes(path)


//     const cookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value
//     const session = await decode(cookie)

//     if (isProtectedRoute && !session?.user.id) {
//         return NextResponse.redirect(new URL('/auth/signin', req.nextUrl))
//     }


//     if (
//         isPublicRoute &&
//         session?.user.id &&
//         !req.nextUrl.pathname.startsWith('/account')
//     ) {
//         return NextResponse.redirect(new URL('/account', req.nextUrl))
//     }

//     return NextResponse.next()
// }
// export const config = {
//     // Match all pathnames except for
//     // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
//     // - … the ones containing a dot (e.g. `favicon.ico`)
//     matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
// };