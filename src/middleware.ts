import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};


// import { SESSION_COOKIE_NAME } from "@/lib/auth/helper";
// import { decode } from "@/lib/auth/server-session";

// import { NextResponse } from "next/server";
// import createMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';
// import { NextRequest } from 'next/server';

// const intlMiddleware = createMiddleware(routing);
// const PROTECTED_API_ROUTES = [
//     '/api/schedulers',
//     '/api/import-customers',
//     '/api/professionals',
//     '/api/services'
// ];
// export default async function middleware(request: NextRequest) {
//     const { pathname } = request.nextUrl;
//     const isProtectedRoute = PROTECTED_API_ROUTES.some((route) =>
//         pathname.startsWith(route)
//     );

//     if (isProtectedRoute) {
//         const cookie = request.cookies.get(SESSION_COOKIE_NAME);

//         if (!cookie) {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//         }

//         const session = await decode(cookie.value);
//         if (!session) {
//             const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//             response.cookies.delete(SESSION_COOKIE_NAME);
//             return response;
//         }

//         return NextResponse.next();
//     }

//     return intlMiddleware(request);
// }

// export const config = {
//     matcher: [
//         '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
//         '/api/schedulers/:path*',
//         '/api/import-customers/:path*',
//         '/api/professionals/:path*',
//         '/api/services/:path*'
//     ]
// };

// import { NextResponse, NextRequest } from 'next/server';
// import createIntlMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';


// const intlMiddleware = createIntlMiddleware(routing);


// function generateNonce() {
//     return Buffer.from(crypto.randomUUID()).toString('base64');
// }

// export default function middleware(request: NextRequest) {
//     const nonce = generateNonce();
//     // middleware.ts (trecho atualizado)
//     const cspHeader = `
//     default-src 'self';
//     script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com;
//     connect-src 'self' https://ep1.adtrafficquality.google https://ep2.adtraffi.cquality.google https://www.google-analytics.com;
//     frame-src https://googleads.g.doubleclick.net https://www.googletagmanager.com https://ep2.adtraffi.cquality.google https://www.google.com;
//     style-src 'self' 'nonce-${nonce}' 'sha256-udQJaD2iLjLPwDBs5CIgWma5W3O8BHOI9Sy+17DR6tk=';
//     img-src 'self' blob: data: https://www.google-analytics.com https://pagead2.googlesyndication.com https://ep1.adtrafficquality.google;
//     font-src 'self';
//     object-src 'none';
//     base-uri 'self';
//     upgrade-insecure-requests;
// `.replace(/\s{2,}/g, ' ').trim();



//     const requestHeaders = new Headers(request.headers);
//     requestHeaders.set('x-nonce', nonce);
//     const response = intlMiddleware(new NextRequest(request, {
//         headers: requestHeaders
//     }));

//     response.headers.set('Content-Security-Policy', cspHeader);

//     return response;
// }

// export const config = {
//     matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
// };